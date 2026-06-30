from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from enum import Enum

class IssueStatus(str, Enum):
    OPEN = "open"
    UNDER_REVIEW = "under_review"
    PLANNED = "planned"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    HIDDEN = "hidden"

class DedupeStatus(str, Enum):
    UNIQUE = "unique"
    CANDIDATE = "candidate"
    DUPLICATE = "duplicate"
    MERGED = "merged"

class SourceChannel(str, Enum):
    WEB = "web"
    PWA = "pwa"
    WHATSAPP = "whatsapp"
    SMS = "sms"
    ADMIN = "admin"

class ScoreBreakdown(BaseModel):
    community_demand: float = Field(default=0.0, ge=0.0, le=1.0)
    infrastructure_gap: float = Field(default=0.0, ge=0.0, le=1.0)
    ai_urgency: float = Field(default=0.0, ge=0.0, le=1.0)
    vulnerability: float = Field(default=0.0, ge=0.0, le=1.0)
    recency: float = Field(default=0.0, ge=0.0, le=1.0)

class IssueRecord(BaseModel):
    id: str
    title: str
    raw_text: Optional[str] = None
    normalized_text: Optional[str] = None
    summary: str
    language: str = "en"
    category: str
    sub_category: Optional[str] = None
    source_channel: SourceChannel = SourceChannel.WEB
    reporter_hash: str
    location_name: str
    ward: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    lat: float = Field(ge=-90.0, le=90.0)
    lng: float = Field(ge=-180.0, le=180.0)
    dedupe_status: DedupeStatus = DedupeStatus.UNIQUE
    duplicate_of: Optional[str] = None
    duplicate_confidence: Optional[float] = None
    ai_urgency_score: float = Field(default=0.0, ge=0.0, le=1.0)
    priority_score: float = Field(default=0.0, ge=0.0, le=1.0)
    upvote_count: int = 0
    comment_count: int = 0
    unique_supporter_count: int = 0
    status: IssueStatus = IssueStatus.OPEN
    visibility: str = "public"
    media_url: Optional[str] = None
    created_at: str
    updated_at: str
    score_breakdown: ScoreBreakdown

class CommentRecord(BaseModel):
    id: str
    issue_id: str
    text: str
    raw_text: Optional[str] = None
    normalized_text: Optional[str] = None
    language: str = "en"
    voice_url: Optional[str] = None
    image_url: Optional[str] = None
    author_hash: str
    ai_note: Optional[str] = None
    created_at: str

class UpvoteRecord(BaseModel):
    id: str
    issue_id: str
    citizen_hash: str
    created_at: str

class StatusEventRecord(BaseModel):
    id: str
    issue_id: str
    from_status: str
    to_status: str
    changed_by_type: str  # "staff" or "system"
    changed_by_id: str
    note: Optional[str] = None
    created_at: str

class PublicAreaProfile(BaseModel):
    id: str
    name: str
    district: str
    state: str
    population_estimate: int
    vulnerability_index: float = Field(ge=0.0, le=1.0)
    road_condition_index: float = Field(ge=0.0, le=1.0)  # higher means better condition
    water_points_count: int
    phc_count: int
    lat: float
    lng: float

class ScoringConfig(BaseModel):
    id: str = "default"
    community_demand_weight: float = 0.30
    infrastructure_gap_weight: float = 0.25
    ai_urgency_weight: float = 0.20
    vulnerability_weight: float = 0.15
    recency_weight: float = 0.10
    updated_at: str

# API Payloads
class CreateIssueRequest(BaseModel):
    text: Optional[str] = None
    language: Optional[str] = "en"
    location_name: str
    lat: float
    lng: float
    voice_url: Optional[str] = None
    image_urls: List[str] = []
    source_channel: SourceChannel = SourceChannel.WEB

class CheckDuplicateRequest(BaseModel):
    text: str
    lat: float
    lng: float
    category: Optional[str] = None

class CreateCommentRequest(BaseModel):
    text: str
    citizen_hash: str
    voice_url: Optional[str] = None
    image_url: Optional[str] = None

class CreateUpvoteRequest(BaseModel):
    citizen_hash: str

class UpdateStatusRequest(BaseModel):
    status: IssueStatus
    note: Optional[str] = None
    changed_by_id: str = "staff_01"

class MergeDuplicateRequest(BaseModel):
    parent_issue_id: str
