import os
import uuid
import hashlib
import secrets
import logging
from typing import List, Optional
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app.models.schemas import (
    CreateIssueRequest, CreateCommentRequest, CreateUpvoteRequest, UpdateStatusRequest,
    MergeDuplicateRequest, IssueRecord, CommentRecord, UpvoteRecord,
    StatusEventRecord, ScoreBreakdown, IssueStatus, DedupeStatus,
    SourceChannel, PublicAreaProfile
)
from app.core.database import db
from app.services.ai import ai_service

# Configure Logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("main_server")

app = FastAPI(title="Peoples Priorities AI API", version="1.0.0")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathon demo simplicity
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup directories for local media uploads
UPLOADS_DIR = "uploads"
os.makedirs(UPLOADS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# Active session tokens: { token -> user_record }
# In production this would be Redis/DB; for hackathon an in-memory dict is sufficient.
_active_sessions: dict = {}

def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# --- Helper to create standard response ---
def make_error_response(message: str):
    return {"status": "error", "message": message}

# ── AUTH ENDPOINTS ──────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    username: str
    password: str

class SignupRequest(BaseModel):
    username: str
    password: str
    role: str = "citizen"

@app.post("/api/auth/login")
async def auth_login(payload: LoginRequest):
    """Validates credentials and returns a session token + user record."""
    users = db.get_data("users")  # dict of { username -> { username, password_hash, role } }
    user = users.get(payload.username)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password.")

    # Accept both plain-text (legacy seed) and sha256 hashes
    pw_hash = _hash_password(payload.password)
    stored_hash = user.get("password_hash", "")
    if stored_hash != pw_hash and stored_hash != payload.password:
        raise HTTPException(status_code=401, detail="Invalid username or password.")

    token = secrets.token_urlsafe(32)
    user_record = {
        "username": user["username"],
        "role": user["role"],
        "display_name": user.get("display_name", user["username"]),
    }
    _active_sessions[token] = user_record
    logger.info(f"Login success: {payload.username} ({user_record['role']})")
    return {"status": "success", "token": token, "user": user_record}

@app.post("/api/auth/signup")
async def auth_signup(payload: SignupRequest):
    """Creates a new citizen account and returns a session token."""
    if payload.role not in ("citizen", "staff", "moderator"):
        raise HTTPException(status_code=400, detail="Invalid role.")
    
    users = db.get_data("users")
    if payload.username in users:
        raise HTTPException(status_code=409, detail="Username already taken.")
    
    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")
    
    new_user = {
        "username": payload.username,
        "password_hash": _hash_password(payload.password),
        "role": payload.role,
        "display_name": payload.username,
    }
    users[payload.username] = new_user
    db.save_data("users", users)
    
    token = secrets.token_urlsafe(32)
    user_record = {
        "username": new_user["username"],
        "role": new_user["role"],
        "display_name": new_user["display_name"],
    }
    _active_sessions[token] = user_record
    logger.info(f"Signup success: {payload.username} ({payload.role})")
    return {"status": "success", "token": token, "user": user_record}


# --- ENDPOINT: Upload Media (Images or Audio) ---
@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """Saves uploaded file locally and returns its path URL."""
    try:
        file_ext = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        filepath = os.path.join(UPLOADS_DIR, unique_filename)
        
        with open(filepath, "wb") as f:
            content = await file.read()
            f.write(content)
            
        url = f"/uploads/{unique_filename}"
        logger.info(f"File uploaded successfully: {url}")
        return {"url": url, "filename": file.filename}
    except Exception as e:
        logger.error(f"File upload failed: {e}")
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

# --- ENDPOINT: Check Duplicate ---
@app.post("/api/issues/check-duplicate")
async def check_duplicate(payload: CreateIssueRequest):
    """
    Called before creating a new issue.
    Runs text & location duplicate search and returns candidates.
    """
    try:
        # First, run language translation if input is regional
        text_to_check = payload.text or ""
        if payload.voice_url:
            # If voice note is uploaded, we might have transcribed it, or we transcribe it here
            # In simple workflow, voice is transcribed during this duplicate check or issue creation
            # Let's check if the file path is local
            local_path = payload.voice_url.lstrip("/")
            if os.path.exists(local_path):
                text_to_check = await ai_service.transcribe_voice(local_path)
                
        # If still empty, return empty list
        if not text_to_check:
            return {"status": "success", "candidates": []}
            
        # Enrich text translation and get category
        translated_text, detected_lang = await ai_service.translate_text(text_to_check)
        enrich_data = await ai_service.enrich_issue(translated_text)
        
        category = payload.source_channel or enrich_data["category"]
        if hasattr(payload, 'category') and getattr(payload, 'category'):
            category = getattr(payload, 'category')
        else:
            category = enrich_data["category"]
            
        candidates = await ai_service.check_duplicates(
            text=translated_text,
            lat=payload.lat,
            lng=payload.lng,
            category=category
        )
        
        return {
            "status": "success",
            "detected_text": text_to_check,
            "detected_category": category,
            "candidates": candidates
        }
    except Exception as e:
        logger.error(f"Duplicate check failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- ENDPOINT: Create Issue ---
@app.post("/api/issues/create")
async def create_issue(payload: CreateIssueRequest):
    """
    Submits and processes a new issue.
    Enriches with AI (transcribe/translate/classify/summary), links locality profiles,
    and runs initial priority score calculation.
    """
    try:
        issue_id = f"issue_{uuid.uuid4().hex[:8]}"
        
        # 1. Check if voice transcription is needed
        raw_text = payload.text or ""
        if payload.voice_url:
            local_path = payload.voice_url.lstrip("/")
            if os.path.exists(local_path):
                transcription = await ai_service.transcribe_voice(local_path)
                raw_text = transcription if transcription else raw_text
                
        # 2. Run translation to English
        translated_text, detected_lang = await ai_service.translate_text(raw_text)
        
        # 3. Enrich issue (summary, classification, urgency, entities)
        enrich_data = await ai_service.enrich_issue(translated_text)
        
        # 4. Determine primary category
        category = enrich_data["category"]
        
        # 5. Extract locality and link public area profile
        location_name = payload.location_name
        # Match location to closest ward
        ward = location_name
        area_profile_id = f"area_{location_name.lower().replace(' ', '_')}"
        area_profile = db.get_area_profile(area_profile_id)
        if not area_profile:
            # Default to Ward 7 if not matching
            area_profile_id = "area_ward_7"
            ward = "Ward 7"
            location_name = "Ward 7"
            
        # 6. Save initial issue record
        timestamp = datetime.now().isoformat()
        
        issue_record = {
            "id": issue_id,
            "title": enrich_data["title"],
            "raw_text": raw_text,
            "normalized_text": translated_text,
            "summary": enrich_data["summary"],
            "language": detected_lang,
            "category": category,
            "sub_category": None,
            "source_channel": payload.source_channel,
            "reporter_hash": f"reporter_{uuid.uuid4().hex[:6]}",
            "location_name": location_name,
            "ward": ward,
            "district": "Jodhpur",
            "state": "Rajasthan",
            "lat": payload.lat,
            "lng": payload.lng,
            "dedupe_status": DedupeStatus.UNIQUE.value,
            "duplicate_of": None,
            "duplicate_confidence": None,
            "ai_urgency_score": enrich_data["urgency_score"],
            "priority_score": 0.0,  # Recalculated next
            "upvote_count": 0,
            "comment_count": 0,
            "unique_supporter_count": 1,
            "status": IssueStatus.OPEN.value,
            "visibility": "public",
            "media_url": payload.image_urls[0] if payload.image_urls else (payload.voice_url if payload.voice_url else None),
            "created_at": timestamp,
            "updated_at": timestamp,
            "score_breakdown": {
                "community_demand": 0.0,
                "infrastructure_gap": 0.0,
                "ai_urgency": enrich_data["urgency_score"],
                "vulnerability": 0.0,
                "recency": 1.0
            }
        }
        
        db.save_issue(issue_record)
        
        # 7. Recalculate Priority Score
        ai_service.recalculate_priority_score(issue_id)
        
        # Reload updated record
        updated_issue = db.get_issue(issue_id)
        return {"status": "success", "issue": updated_issue}
        
    except Exception as e:
        logger.error(f"Issue creation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- ENDPOINT: Nearby Issues ---
@app.get("/api/issues/nearby")
async def get_nearby_issues(
    lat: float = Query(..., ge=-90.0, le=90.0),
    lng: float = Query(..., ge=-180.0, le=180.0),
    radius_km: float = Query(5.0, gt=0.0)
):
    """Fetches public issues within a certain radius from current lat/lng."""
    try:
        all_issues = db.get_all_issues()
        nearby = []
        
        for issue in all_issues:
            if issue["visibility"] != "public" or issue["duplicate_of"] is not None:
                continue
                
            dist = ai_service._haversine(lat, lng, issue["lat"], issue["lng"])
            if dist <= radius_km:
                issue_copy = issue.copy()
                issue_copy["distance_km"] = round(dist, 2)
                nearby.append(issue_copy)
                
        # Sort by distance
        nearby.sort(key=lambda x: x["distance_km"])
        return {"status": "success", "issues": nearby}
    except Exception as e:
        logger.error(f"Fetching nearby issues failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- ENDPOINT: Issue Detail ---
@app.get("/api/issues/{id}")
async def get_issue_detail(id: str, citizen_hash: Optional[str] = None):
    """Returns rich details of a single issue, including comments and upvote state."""
    issue = db.get_issue(id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
        
    comments = db.get_issue_comments(id)
    # Sort comments by created_at descending
    comments.sort(key=lambda x: x["created_at"], reverse=True)
    
    # Check if this user upvoted
    has_upvoted = False
    if citizen_hash:
        has_upvoted = db.has_user_upvoted(id, citizen_hash)
        
    return {
        "status": "success",
        "issue": issue,
        "comments": comments,
        "user_has_upvoted": has_upvoted
    }

# --- ENDPOINT: Upvote Issue ---
@app.post("/api/issues/{id}/upvote")
async def upvote_issue(id: str, payload: CreateUpvoteRequest):
    """
    Registers an upvote (This affects me too) on an issue.
    Enforces one upvote per user hash per issue and triggers score recalculation.
    """
    issue = db.get_issue(id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
        
    # Check if duplicate upvote
    if db.has_user_upvoted(id, payload.citizen_hash):
        return {"status": "error", "message": "You have already supported this issue."}
        
    timestamp = datetime.now().isoformat()
    
    # Create upvote record
    upvote = {
        "id": f"upvote_{id}_{payload.citizen_hash}",
        "issue_id": id,
        "citizen_hash": payload.citizen_hash,
        "created_at": timestamp
    }
    db.save_upvote(upvote)
    
    # Update denormalized counts on issue
    issue["upvote_count"] += 1
    issue["unique_supporter_count"] += 1
    issue["updated_at"] = timestamp
    db.save_issue(issue)
    
    # Recalculate priority score
    ai_service.recalculate_priority_score(id)
    
    # Reload updated issue
    updated_issue = db.get_issue(id)
    return {"status": "success", "issue": updated_issue}

# --- ENDPOINT: Add Comment ---
@app.post("/api/issues/{id}/comment")
async def add_comment(id: str, payload: CreateCommentRequest):
    """
    Adds a comment to an issue thread, supplying extra context.
    Increments issue comment counts and triggers score recalculation.
    """
    issue = db.get_issue(id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
        
    timestamp = datetime.now().isoformat()
    comment_id = f"comment_{uuid.uuid4().hex[:8]}"
    
    # Translate comment text to normalize context
    translated_text, detected_lang = await ai_service.translate_text(payload.text)
    
    # Get a quick summary from AI for the comment if needed
    ai_note = "Comment validation context"
    if ai_service.use_real_ai:
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(
                f"Extract a short 5-word summary note of the key observation from this comment: '{translated_text}'. "
                "For example: 'Seasonal flooding concerns' or 'Stray dogs risk'. Keep it extremely short."
            )
            ai_note = response.text.strip()
        except Exception:
            pass
            
    comment = {
        "id": comment_id,
        "issue_id": id,
        "text": payload.text,
        "raw_text": payload.text,
        "normalized_text": translated_text,
        "language": detected_lang,
        "voice_url": payload.voice_url,
        "image_url": payload.image_url,
        "author_hash": payload.citizen_hash,
        "ai_note": ai_note,
        "created_at": timestamp
    }
    db.save_comment(comment)
    
    # Increment issue count
    issue["comment_count"] += 1
    issue["updated_at"] = timestamp
    db.save_issue(issue)
    
    # Recalculate score
    ai_service.recalculate_priority_score(id)
    
    # Reload
    comments = db.get_issue_comments(id)
    comments.sort(key=lambda x: x["created_at"], reverse=True)
    return {"status": "success", "comments": comments, "issue": db.get_issue(id)}

# --- ENDPOINT: Staff Dashboard Issues ---
@app.get("/api/dashboard/issues")
async def get_dashboard_issues(
    category: Optional[str] = Query(None),
    ward: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    sort_by: str = Query("priority_score") # priority_score, upvote_count, created_at
):
    """
    Returns filtered and sorted issues for the staff dashboard table.
    Sorts by priority score by default.
    """
    issues = db.get_all_issues()
    filtered = []
    
    for issue in issues:
        # Exclude hidden or marked duplicate issues (unless they are the main parent thread)
        if issue["visibility"] == "hidden" or issue["duplicate_of"] is not None:
            continue
            
        if category and issue["category"] != category:
            continue
        if ward and issue["ward"] != ward:
            continue
        if status and issue["status"] != status:
            continue
            
        filtered.append(issue)
        
    # Sort
    if sort_by == "priority_score":
        filtered.sort(key=lambda x: x["priority_score"], reverse=True)
    elif sort_by == "upvote_count":
        filtered.sort(key=lambda x: x["upvote_count"], reverse=True)
    elif sort_by == "created_at":
        filtered.sort(key=lambda x: x["created_at"], reverse=True)
        
    return {"status": "success", "issues": filtered}

# --- ENDPOINT: Hotspots ---
@app.get("/api/dashboard/hotspots")
async def get_hotspots():
    """Returns map coordinates and weights (based on priority score) for heat maps."""
    issues = db.get_all_issues()
    hotspots = []
    
    for issue in issues:
        if issue["visibility"] == "hidden" or issue["duplicate_of"] is not None:
            continue
            
        hotspots.append({
            "issue_id": issue["id"],
            "title": issue["title"],
            "category": issue["category"],
            "lat": issue["lat"],
            "lng": issue["lng"],
            "priority_score": issue["priority_score"],
            "weight": issue["priority_score"] * 10  # multiplier for visual heat sizing
        })
    return {"status": "success", "hotspots": hotspots}

# --- ENDPOINT: Update Issue Status (Staff Action) ---
@app.patch("/api/issues/{id}/status")
async def update_issue_status(id: str, payload: UpdateStatusRequest):
    """Updates the status of an issue (e.g. open -> under_review) and logs status audit event."""
    issue = db.get_issue(id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
        
    from_status = issue["status"]
    to_status = payload.status.value
    
    timestamp = datetime.now().isoformat()
    
    # Save status audit event
    event = {
        "id": f"status_event_{uuid.uuid4().hex[:8]}",
        "issue_id": id,
        "from_status": from_status,
        "to_status": to_status,
        "changed_by_type": "staff",
        "changed_by_id": payload.changed_by_id,
        "note": payload.note or f"Status updated to {to_status}",
        "created_at": timestamp
    }
    db.save_status_event(event)
    
    # Update issue status
    issue["status"] = to_status
    issue["updated_at"] = timestamp
    db.save_issue(issue)
    
    # Recalculate priority score (since status change affects recency/score calculation context)
    ai_service.recalculate_priority_score(id)
    
    return {
        "status": "success", 
        "issue": db.get_issue(id),
        "event": event
    }

# --- ENDPOINT: Merge Duplicates ---
@app.post("/api/issues/{id}/merge")
async def merge_duplicate(id: str, payload: MergeDuplicateRequest):
    """
    Manually marks an issue as duplicate and merges its counts (upvotes)
    into a parent issue thread.
    """
    source_issue = db.get_issue(id) # The duplicate
    parent_issue = db.get_issue(payload.parent_issue_id) # The main thread
    
    if not source_issue or not parent_issue:
        raise HTTPException(status_code=404, detail="One or both issues not found")
        
    if id == payload.parent_issue_id:
        return {"status": "error", "message": "Cannot merge an issue into itself."}
        
    timestamp = datetime.now().isoformat()
    
    # Mark source issue as duplicate
    source_issue["dedupe_status"] = DedupeStatus.MERGED.value
    source_issue["duplicate_of"] = payload.parent_issue_id
    source_issue["duplicate_confidence"] = 1.0
    source_issue["status"] = IssueStatus.HIDDEN.value
    source_issue["visibility"] = "hidden"
    source_issue["updated_at"] = timestamp
    db.save_issue(source_issue)
    
    # Add comments and upvotes from duplicate issue to the parent issue
    source_comments = db.get_issue_comments(id)
    for c in source_comments:
        c["issue_id"] = payload.parent_issue_id
        db.save_comment(c)
        
    # Re-link upvotes
    source_upvotes = db.get_issue_upvotes(id)
    added_upvotes = 0
    for u in source_upvotes:
        # Check if citizen already upvoted parent issue
        if not db.has_user_upvoted(payload.parent_issue_id, u["citizen_hash"]):
            u["issue_id"] = payload.parent_issue_id
            db.save_upvote(u)
            added_upvotes += 1
            
    # Update parent issue counters
    parent_issue["upvote_count"] += added_upvotes
    parent_issue["comment_count"] += len(source_comments)
    parent_issue["unique_supporter_count"] += added_upvotes
    parent_issue["updated_at"] = timestamp
    db.save_issue(parent_issue)
    
    # Recalculate parent issue priority score
    ai_service.recalculate_priority_score(payload.parent_issue_id)
    
    # Create audit log event
    event = {
        "id": f"status_event_{uuid.uuid4().hex[:8]}",
        "issue_id": id,
        "from_status": source_issue["status"],
        "to_status": "merged",
        "changed_by_type": "staff",
        "changed_by_id": "moderator_01",
        "note": f"Merged duplicate issue {id} into parent issue {payload.parent_issue_id}",
        "created_at": timestamp
    }
    db.save_status_event(event)
    
    return {
        "status": "success",
        "source_issue": source_issue,
        "parent_issue": db.get_issue(payload.parent_issue_id)
    }

# --- ROOT ENDPOINT ---
@app.get("/")
async def root():
    return {
        "status": "active",
        "product": "Peoples Priorities AI Engine API",
        "docs_url": "/docs"
    }
