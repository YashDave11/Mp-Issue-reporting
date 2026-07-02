import os
import math
import json
import logging
from typing import Optional, List, Dict, Any, Tuple
from datetime import datetime
from app.core.database import db

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai_pipeline")

# Try to import new Google Generative AI SDK (google-genai)
try:
    from google import genai as genai_sdk
    from google.genai import types as genai_types
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False
    genai_sdk = None
    logger.warning("google-genai package not found. Running in offline/mock mode.")

class AIService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        self.use_real_ai = HAS_GENAI and self.api_key is not None
        self.client = None
        
        if self.use_real_ai:
            try:
                self.client = genai_sdk.Client(api_key=self.api_key)
                logger.info("Gemini API client (google.genai) configured successfully.")
            except Exception as e:
                logger.error(f"Failed to configure Gemini client: {e}. Falling back to mock mode.")
                self.use_real_ai = False
        else:
            logger.info("Starting AI Service in OFFLINE/MOCK mode. Set GEMINI_API_KEY to enable real AI.")

    # --- 1. Speech-to-Text (Transcription) ---
    async def transcribe_voice(self, voice_file_path: str) -> str:
        """
        Transcribes a voice note file. In real mode, it sends the file to Gemini 1.5 Flash.
        In mock mode, it returns a default transcription based on file name or a fallback.
        """
        if not os.path.exists(voice_file_path):
            logger.error(f"Voice file not found at: {voice_file_path}")
            return "Speech transcription failed: File not found."
            
        if self.use_real_ai:
            try:
                logger.info(f"Uploading audio file for transcription: {voice_file_path}")
                with open(voice_file_path, "rb") as f:
                    audio_bytes = f.read()
                
                prompt = (
                    "Transcribe this audio clip exactly as spoken. "
                    "If spoken in Hindi or another regional Indian language, please transcribe it in its native script (e.g. Devanagari). "
                    "Return ONLY the transcription text, nothing else."
                )
                
                response = self.client.models.generate_content(
                    model="gemini-2.0-flash",
                    contents=[
                        genai_types.Part.from_bytes(data=audio_bytes, mime_type="audio/mpeg"),
                        prompt,
                    ]
                )
                text = response.text.strip()
                logger.info(f"Successfully transcribed audio using Gemini: '{text}'")
                return text
            except Exception as e:
                logger.error(f"Real transcription failed: {e}. Falling back to mock.")
        
        # Mock Transcription based on filename keywords or defaults
        filename = os.path.basename(voice_file_path).lower()
        if "road" in filename or "sadak" in filename:
            return "Sadak toot gayi hai school ke paas, bache gir jate hain"
        elif "water" in filename or "pani" in filename:
            return "Bazaar me paani jama ho jata hai thodi si barish me"
        elif "garbage" in filename or "kachra" in filename:
            return "Park ke paas kachra jama ho gaya hai, bahut badboo aati hai"
        return "Ward 7 primary school boundary deewar tut gayi hai, kripya thik karayein."

    # --- 2. Translation & Language Detection ---
    async def translate_text(self, text: str) -> Tuple[str, str]:
        """
        Detects language and translates non-English text to English.
        Returns: (translated_text, detected_language_code)
        """
        if not text:
            return "", "en"
            
        if self.use_real_ai:
            try:
                prompt = (
                    f"Analyze this text: '{text}'. "
                    "Determine its language. Translate it to clear English. "
                    "Return ONLY a JSON object in this exact format: "
                    '{"language_code": "hi", "translated_text": "Translated English text"}'
                )
                response = self.client.models.generate_content(
                    model="gemini-2.0-flash",
                    contents=prompt,
                )
                res_text = response.text.strip()
                if res_text.startswith("```json"):
                    res_text = res_text[7:-3].strip()
                elif res_text.startswith("```"):
                    res_text = res_text[3:-3].strip()
                data = json.loads(res_text)
                return data.get("translated_text", text), data.get("language_code", "en")
            except Exception as e:
                logger.error(f"Real translation failed: {e}. Falling back to mock.")
        
        # Mock Translation mapping for key demo statements
        text_lower = text.lower()
        hi_to_en = {
            "sadak toot gayi": ("Road is broken near the school, children fall down", "hi"),
            "pani jama": ("Water logging in the market during light rain", "hi"),
            "deewar tut": ("School boundary wall is broken", "hi"),
            "chatt tooti": ("Primary school roof is broken, water drips during rain", "hi"),
            "kachra jama": ("Garbage has accumulated near the park, it smells a lot", "hi"),
            "peene ke paani": ("There is no drinking water facility in the PHC clinic", "hi"),
            "street lights": ("Street lights are not working near the bus stand", "hi")
        }
        
        for key, val in hi_to_en.items():
            if key in text_lower:
                return val
                
        # If no match, check character sets for Hindi script
        is_hindi = any('\u0900' <= char <= '\u097F' for char in text)
        if is_hindi:
            return f"Translated English: {text}", "hi"
            
        return text, "en"

    # --- 3. Multimodal Issue Enrichment ---
    async def enrich_issue(self, raw_text: str, image_path: Optional[str] = None) -> Dict[str, Any]:
        """
        Enriches raw issue text (and optional image) with summary, category, urgency, and entities.
        Returns: {
            "title": str,
            "summary": str,
            "category": str,
            "urgency_score": float,
            "entities": List[str]
        }
        """
        if self.use_real_ai:
            try:
                prompt = (
                    f"Analyze this issue report: '{raw_text}'. "
                    "Categorize it into one of: 'roads', 'sanitation', 'school infrastructure', 'water', 'health', 'public safety'. "
                    "Provide a short descriptive English title (max 5 words). "
                    "Provide a concise one-sentence English summary. "
                    "Estimate an urgency score between 0.0 (low urgency) and 1.0 (extremely critical safety hazard). "
                    "Extract key infrastructure entities (like 'school', 'ward 7', 'handpump', 'PHC'). "
                    "Return ONLY a JSON object in this exact format: "
                    "{"
                    '  "title": "Title in English",'
                    '  "summary": "Summary in English.",'
                    '  "category": "roads",'
                    '  "urgency_score": 0.85,'
                    '  "entities": ["entity1", "entity2"]'
                    "}"
                )
                
                contents: list = [prompt]
                
                # If image is attached, send inline bytes
                if image_path and os.path.exists(image_path):
                    logger.info(f"Adding image to Gemini model input: {image_path}")
                    with open(image_path, "rb") as img_f:
                        img_bytes = img_f.read()
                    contents.insert(0, genai_types.Part.from_bytes(data=img_bytes, mime_type="image/jpeg"))
                    
                response = self.client.models.generate_content(
                    model="gemini-2.0-flash",
                    contents=contents,
                )
                    
                res_text = response.text.strip()
                if res_text.startswith("```json"):
                    res_text = res_text[7:-3].strip()
                elif res_text.startswith("```"):
                    res_text = res_text[3:-3].strip()
                    
                data = json.loads(res_text)
                return {
                    "title": data.get("title", "Constituency Issue"),
                    "summary": data.get("summary", "Constituency issue reported by citizen."),
                    "category": data.get("category", "roads").lower(),
                    "urgency_score": float(data.get("urgency_score", 0.5)),
                    "entities": data.get("entities", [])
                }
            except Exception as e:
                logger.error(f"Real issue enrichment failed: {e}. Falling back to mock.")

        # Mock enrichment rules
        text_lower = raw_text.lower()
        title = "Constituency Issue"
        summary = "Citizen reported local infrastructure issue."
        category = "roads"
        urgency = 0.5
        entities = []
        
        # Categorize
        if "road" in text_lower or "sadak" in text_lower or "pot hole" in text_lower or "gaddhe" in text_lower:
            title = "Damaged Local Road"
            summary = "Potholes and damage on public road hindering traffic safety."
            category = "roads"
            urgency = 0.7
            entities = ["road", "potholes"]
        elif "water" in text_lower or "pani" in text_lower or "drain" in text_lower or "naala" in text_lower:
            title = "Water Pooling and Drainage Issue"
            summary = "Blocked storm drains causing water logging in public lanes."
            category = "water"
            urgency = 0.8
            entities = ["drainage", "water supply"]
        elif "school" in text_lower or "chatt" in text_lower or "boundary" in text_lower or "desk" in text_lower:
            title = "School Infrastructure Repairs"
            summary = "Structural damage to government school facility needing repair."
            category = "school infrastructure"
            urgency = 0.75
            entities = ["school", "roof"]
        elif "garbage" in text_lower or "kachra" in text_lower or "clean" in text_lower or "sewer" in text_lower:
            title = "Sanitation and Garbage Heap"
            summary = "Accumulated solid waste and blocked sewers causing unhygienic conditions."
            category = "sanitation"
            urgency = 0.6
            entities = ["garbage", "sewer"]
        elif "doctor" in text_lower or "hospital" in text_lower or "phc" in text_lower or "clinic" in text_lower:
            title = "Health Center Staffing Gaps"
            summary = "Absence of medical staff at local primary health center."
            category = "health"
            urgency = 0.82
            entities = ["health center", "doctor"]
        elif "dark" in text_lower or "light" in text_lower or "safety" in text_lower or "darr" in text_lower:
            title = "Street Lighting and Safety"
            summary = "Non-functional streetlights causing dark alleys and safety concerns."
            category = "public safety"
            urgency = 0.65
            entities = ["streetlights", "security"]

        # Parse ward entity
        for ward_num in ["7", "8", "9", "10"]:
            if f"ward {ward_num}" in text_lower or f"ward{ward_num}" in text_lower:
                entities.append(f"Ward {ward_num}")
                
        return {
            "title": title,
            "summary": summary,
            "category": category,
            "urgency_score": urgency,
            "entities": entities
        }

    # --- 4. Semantic Duplicate Detection ---
    async def check_duplicates(self, text: str, lat: float, lng: float, category: str) -> List[Dict[str, Any]]:
        """
        Detects duplicate issues.
        Combines spatial distance filter (within 3km) and text similarity score.
        In real mode, uses Gemini Embeddings.
        In mock mode, uses keyword overlaps.
        Returns: List of matching issues with a similarity score.
        """
        all_issues = db.get_all_issues()
        # Filter issues by same category, visibility=public, and status in (open, under_review, planned, in_progress)
        candidate_issues = [
            issue for issue in all_issues
            if issue["category"] == category 
            and issue["visibility"] == "public"
            and issue["status"] in ["open", "under_review", "planned", "in_progress"]
            and issue["duplicate_of"] is None
        ]
        
        duplicates = []
        
        # Calculate scores
        for issue in candidate_issues:
            # 1. Calculate Geodist (Haversine formula)
            dist = self._haversine(lat, lng, issue["lat"], issue["lng"])
            if dist > 3.0: # Skip if further than 3 km
                continue
                
            # 2. Text Similarity
            text_sim = 0.0
            if self.use_real_ai:
                try:
                    text_sim = self._get_gemini_similarity(text, issue["normalized_text"] or issue["summary"])
                except Exception as e:
                    logger.error(f"Failed to get semantic embedding similarity: {e}")
                    text_sim = self._get_mock_similarity(text, issue["normalized_text"] or issue["summary"])
            else:
                text_sim = self._get_mock_similarity(text, issue["normalized_text"] or issue["summary"])
                
            # 3. Combine scores: higher similarity if they are very close
            # E.g. Similarity = TextSimilarity * 0.7 + ProximityScore * 0.3
            proximity_score = max(0.0, 1.0 - (dist / 3.0)) # 1.0 if same spot, 0.0 if 3km away
            combined_similarity = text_sim * 0.7 + proximity_score * 0.3
            
            if combined_similarity >= 0.65: # Duplicate threshold
                duplicates.append({
                    "issue_id": issue["id"],
                    "title": issue["title"],
                    "summary": issue["summary"],
                    "category": issue["category"],
                    "location_name": issue["location_name"],
                    "similarity_score": round(combined_similarity, 2),
                    "distance_km": round(dist, 2),
                    "upvote_count": issue["upvote_count"],
                    "status": issue["status"]
                })
                
        # Sort by similarity score descending
        duplicates.sort(key=lambda x: x["similarity_score"], reverse=True)
        return duplicates

    def _haversine(self, lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        """Calculates distance in km between two lat/lng pairs."""
        R = 6371.0 # Earth's radius in km
        d_lat = math.radians(lat2 - lat1)
        d_lng = math.radians(lng2 - lng1)
        
        a = math.sin(d_lat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lng / 2) ** 2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    def _get_gemini_similarity(self, text1: str, text2: str) -> float:
        """Gets cosine similarity between two texts using Gemini Embeddings API."""
        try:
            model = "models/text-embedding-004"
            # Get embeddings
            emb1 = genai.embed_content(model=model, content=text1, task_type="retrieval_query")["embedding"]
            emb2 = genai.embed_content(model=model, content=text2, task_type="retrieval_document")["embedding"]
            
            # Cosine similarity
            dot_product = sum(a * b for a, b in zip(emb1, emb2))
            norm1 = math.sqrt(sum(a * a for a in emb1))
            norm2 = math.sqrt(sum(b * b for b in emb2))
            
            return dot_product / (norm1 * norm2)
        except Exception as e:
            logger.error(f"Gemini embedding API failed: {e}")
            raise e

    def _get_mock_similarity(self, text1: str, text2: str) -> float:
        """Simple Jaccard keyword overlap matching as fallback."""
        w1 = set(text1.lower().split())
        w2 = set(text2.lower().split())
        # Stop words
        stops = {"is", "the", "are", "and", "in", "near", "school", "toot", "gayi", "hai", "ke", "paas", "road", "broken"}
        w1_filtered = w1 - stops
        w2_filtered = w2 - stops
        
        if not w1_filtered or not w2_filtered:
            intersection = w1.intersection(w2)
            union = w1.union(w2)
        else:
            intersection = w1_filtered.intersection(w2_filtered)
            union = w1_filtered.union(w2_filtered)
            
        return len(intersection) / len(union) if union else 0.0

    # --- 5. Priority Score Recalculator ---
    def recalculate_priority_score(self, issue_id: str):
        """
        Recalculates explainable priority score for an issue:
        Score = 30% Demand + 25% Infra Gap + 20% AI Urgency + 15% Vulnerability + 10% Recency
        """
        issue = db.get_issue(issue_id)
        if not issue:
            return
            
        config = db.get_scoring_config()
        w_demand = config.get("community_demand_weight", 0.30)
        w_gap = config.get("infrastructure_gap_weight", 0.25)
        w_urgency = config.get("ai_urgency_weight", 0.20)
        w_vuln = config.get("vulnerability_weight", 0.15)
        w_recency = config.get("recency_weight", 0.10)
        
        # 1. Community Demand Score: normalized on upvote & comment counts
        # counts are stored denormalized
        upvote_cnt = issue.get("upvote_count", 0)
        comment_cnt = issue.get("comment_count", 0)
        # Linear normalization capped at 25 units of community activity (upvote=1, comment=2)
        demand_score = min(1.0, (upvote_cnt + 2.0 * comment_cnt) / 25.0)
        
        # 2. Infrastructure Gap Score: based on public area profile
        area_profile_id = f"area_{issue['location_name'].lower().replace(' ', '_')}"
        area_profile = db.get_area_profile(area_profile_id)
        
        infra_gap_score = 0.5 # Default fallback
        vulnerability_score = 0.5 # Default fallback
        
        if area_profile:
            vulnerability_score = area_profile.get("vulnerability_index", 0.5)
            category = issue.get("category", "").lower()
            
            if category == "roads":
                # road condition index: 1.0 is perfect road, so gap is 1.0 - index
                infra_gap_score = 1.0 - area_profile.get("road_condition_index", 0.5)
            elif category == "water":
                # if fewer water points, higher gap
                infra_gap_score = 1.0 if area_profile.get("water_points_count", 5) <= 2 else 0.2
            elif category in ["health", "school infrastructure"]:
                # if PHC/school count is 0, higher gap
                facility_count = area_profile.get("phc_count", 1) if category == "health" else area_profile.get("primary_school_count", 1)
                infra_gap_score = 1.0 if facility_count == 0 else 0.3
        
        # 3. AI Urgency Score
        ai_urgency_score = issue.get("ai_urgency_score", 0.5)
        
        # 4. Recency Score
        try:
            created_dt = datetime.fromisoformat(issue["created_at"])
            delta_days = (datetime.now() - created_dt).days
            recency_score = max(0.0, 1.0 - (delta_days / 30.0)) # fades out linearly over 30 days
        except Exception:
            recency_score = 0.5
            
        # Compute final priority score
        priority_score = (
            w_demand * demand_score +
            w_gap * infra_gap_score +
            w_urgency * ai_urgency_score +
            w_vuln * vulnerability_score +
            w_recency * recency_score
        )
        
        # Update issue fields
        issue["community_demand_score"] = round(demand_score, 2)
        issue["infrastructure_gap_score"] = round(infra_gap_score, 2)
        issue["vulnerability_score"] = round(vulnerability_score, 2)
        issue["recency_score"] = round(recency_score, 2)
        issue["priority_score"] = round(priority_score, 2)
        
        issue["score_breakdown"] = {
            "community_demand": round(demand_score, 2),
            "infrastructure_gap": round(infra_gap_score, 2),
            "ai_urgency": round(ai_urgency_score, 2),
            "vulnerability": round(vulnerability_score, 2),
            "recency": round(recency_score, 2)
        }
        
        issue["updated_at"] = datetime.now().isoformat()
        db.save_issue(issue)
        logger.info(f"Recalculated priority score for issue {issue_id}: {round(priority_score, 2)}")

# Global AI Service Instance
ai_service = AIService()
