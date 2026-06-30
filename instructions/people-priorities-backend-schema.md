# Backend Schema — People's Priorities AI

## Purpose
This document defines the backend schema for **People's Priorities AI**. It covers the core data model, collection/table structure, field definitions, relationships, indexes, validation rules, API payload schemas, and implementation notes needed to build the MVP quickly and cleanly.

It is optimized for **vibe coding**, which means the schema is designed to be clear, practical, modular, and directly translatable into Firestore collections, TypeScript/Python models, and API contracts without unnecessary complexity.[web:73][web:78][web:74]

## Schema Design Rules Used
This schema follows web-sourced best practices for backend and database schema design: use clear naming, design around access patterns, keep schemas consistent, validate required fields, index only what queries need, model relationships intentionally, store timestamps and status explicitly, and separate write payloads from read models when useful for API clarity.[web:73][web:78][web:74][web:77][web:80]

For Firestore specifically, the schema should optimize for the actual queries the app needs, avoid pathological growth patterns, keep documents small, and structure data so common reads are fast and predictable.[web:73][web:78] For API schemas, request and response objects should be explicit, stable, and easy to reuse across create, read, update, and detail views.[web:74]

## Backend Architecture Assumption
Recommended MVP backend layout:
- **Operational store**: Firestore
- **Analytics / aggregation**: BigQuery
- **Media storage**: Cloud Storage
- **API layer**: FastAPI or Node.js/Express on Cloud Run
- **Realtime updates**: Firestore listeners or lightweight subscriptions
- **AI enrichment**: Gemini / Vertex AI, Speech-to-Text, Translation API

This schema is therefore split into:
1. **Operational entities** for app behavior
2. **Analytics entities** for ranking and reporting
3. **API schemas** for transport contracts

## Design Principles
- Model the **issue** as the central entity.
- Treat upvotes and comments as separate child entities for flexibility and auditability.
- Store AI outputs explicitly, not just raw text.
- Keep raw user input and normalized AI-enriched content both available.
- Support both **list view** and **detail view** use cases.
- Design for easy deduplication and ranking recalculation.
- Prefer explicit fields over opaque nested blobs when the data drives UI or queries.

## Entity Overview
Core entities:
- `issues`
- `comments`
- `upvotes`
- `issue_status_events`
- `moderation_flags`
- `public_area_profiles`
- `ai_processing_jobs`
- `users_staff`
- `config_scoring`

Optional support entities:
- `issue_duplicates`
- `attachments`
- `activity_logs`

## Firestore Collection Structure
```text
/issues/{issueId}
/issues/{issueId}/comments/{commentId}
/issues/{issueId}/upvotes/{upvoteId}
/issues/{issueId}/status_events/{eventId}
/issues/{issueId}/flags/{flagId}
/issues/{issueId}/attachments/{attachmentId}

/public_area_profiles/{areaId}
/ai_processing_jobs/{jobId}
/users_staff/{staffId}
/config_scoring/default
/activity_logs/{logId}
```

This structure follows Firestore guidance to model around read/write patterns and use subcollections for growing child records such as comments and upvotes.[web:73][web:78]

## Primary Entity: Issue
The **issue** is the core thread that citizens support and staff review.

### Collection
`/issues/{issueId}`

### Schema
```json
{
  "id": "issue_001",
  "title": "Damaged road near Ward 7 school",
  "raw_text": "Sadak toot gayi hai school ke paas",
  "normalized_text": "Road near Ward 7 school is damaged",
  "summary": "Road near Ward 7 school is damaged and unsafe for students.",
  "language": "hi",
  "category": "roads",
  "sub_category": "road_damage",
  "source_channel": "web",
  "source_type": "citizen_submission",
  "reporter_hash": "anon_hash_123",
  "location_name": "Ward 7",
  "ward": "Ward 7",
  "block": null,
  "district": "Jodhpur",
  "state": "Rajasthan",
  "lat": 26.2389,
  "lng": 73.0243,
  "geo_hash": "...",
  "dedupe_status": "unique",
  "duplicate_of": null,
  "duplicate_confidence": null,
  "ai_category_confidence": 0.93,
  "ai_urgency_score": 0.78,
  "ai_summary_version": "v1",
  "community_demand_score": 0.61,
  "infrastructure_gap_score": 0.72,
  "vulnerability_score": 0.55,
  "recency_score": 0.40,
  "priority_score": 0.64,
  "upvote_count": 18,
  "comment_count": 4,
  "unique_supporter_count": 18,
  "status": "open",
  "visibility": "public",
  "verification_state": "unverified",
  "primary_attachment_url": null,
  "latest_activity_at": "2026-06-29T09:00:00Z",
  "created_at": "2026-06-29T08:55:00Z",
  "updated_at": "2026-06-29T09:00:00Z",
  "created_by_type": "citizen",
  "created_by_id": null,
  "area_profile_id": "area_ward_7",
  "score_breakdown": {
    "community_demand": 0.61,
    "infrastructure_gap": 0.72,
    "ai_urgency": 0.78,
    "vulnerability": 0.55,
    "recency": 0.40
  }
}
```

### Required fields
- `id`
- `raw_text` or media-derived transcript
- `summary`
- `category`
- `source_channel`
- `location_name` or geolocation pair
- `status`
- `created_at`
- `updated_at`

### Notes
- Keep `raw_text` and `normalized_text` both for traceability.
- Store `priority_score` denormalized to support fast list queries.
- Store counts (`upvote_count`, `comment_count`) denormalized for dashboard speed.
- Use `latest_activity_at` for ranking/trending queries.

## Child Entity: Comment
Comments are issue-specific and should live in a subcollection to support unbounded growth and scoped reads.[web:73][web:78]

### Collection
`/issues/{issueId}/comments/{commentId}`

### Schema
```json
{
  "id": "comment_001",
  "issue_id": "issue_001",
  "author_hash": "anon_hash_789",
  "text": "This gets worse during monsoon.",
  "raw_text": "This gets worse during monsoon.",
  "normalized_text": "This gets worse during monsoon.",
  "language": "en",
  "voice_url": null,
  "image_url": null,
  "ai_note": "Seasonal worsening reported during monsoon.",
  "ai_signal_tags": ["seasonal", "safety_risk"],
  "moderation_state": "visible",
  "created_at": "2026-06-29T09:02:00Z",
  "updated_at": "2026-06-29T09:02:00Z"
}
```

### Required fields
- `id`
- `issue_id`
- `author_hash`
- `created_at`
- at least one of `text`, `voice_url`, or `image_url`

## Child Entity: Upvote
Upvotes are modeled as separate documents to guarantee one-support-per-user-per-issue and preserve auditability.

### Collection
`/issues/{issueId}/upvotes/{upvoteId}`

### Schema
```json
{
  "id": "upvote_001",
  "issue_id": "issue_001",
  "citizen_hash": "anon_hash_456",
  "source": "app",
  "created_at": "2026-06-29T09:03:00Z"
}
```

### Required fields
- `id`
- `issue_id`
- `citizen_hash`
- `created_at`

### Constraint
Uniqueness should be enforced at the app/service layer with a deterministic document key such as:
`/issues/{issueId}/upvotes/{citizenHash}`

This avoids duplicate upvotes with a simple existence check.

## Child Entity: Status Event
Status events provide an audit trail for issue lifecycle updates.

### Collection
`/issues/{issueId}/status_events/{eventId}`

### Schema
```json
{
  "id": "status_001",
  "issue_id": "issue_001",
  "from_status": "open",
  "to_status": "under_review",
  "changed_by_type": "staff",
  "changed_by_id": "staff_01",
  "note": "Marked for review after support crossed threshold.",
  "created_at": "2026-06-29T09:05:00Z"
}
```

## Child Entity: Moderation Flag
### Collection
`/issues/{issueId}/flags/{flagId}`

### Schema
```json
{
  "id": "flag_001",
  "issue_id": "issue_001",
  "target_type": "comment",
  "target_id": "comment_001",
  "reason": "possible_spam",
  "reported_by": "system",
  "status": "open",
  "resolution": null,
  "created_at": "2026-06-29T09:06:00Z",
  "resolved_at": null
}
```

## Child Entity: Attachment
Optional but useful if you want multiple media records instead of flat issue/comment URLs.

### Collection
`/issues/{issueId}/attachments/{attachmentId}`

### Schema
```json
{
  "id": "att_001",
  "issue_id": "issue_001",
  "owner_type": "issue",
  "owner_id": "issue_001",
  "file_type": "image",
  "mime_type": "image/jpeg",
  "storage_path": "issues/issue_001/photo1.jpg",
  "public_url": "https://...",
  "created_at": "2026-06-29T09:00:00Z"
}
```

## Reference Entity: Public Area Profile
This entity stores local public-data context used in scoring.

### Collection
`/public_area_profiles/{areaId}`

### Schema
```json
{
  "id": "area_ward_7",
  "name": "Ward 7",
  "district": "Jodhpur",
  "state": "Rajasthan",
  "population_estimate": 12500,
  "household_estimate": 2400,
  "child_population_ratio": 0.21,
  "elderly_population_ratio": 0.09,
  "primary_school_count": 2,
  "phc_count": 0,
  "water_points_count": 5,
  "road_condition_index": 0.43,
  "vulnerability_index": 0.62,
  "lat": 26.2389,
  "lng": 73.0243,
  "created_at": "2026-06-28T00:00:00Z",
  "updated_at": "2026-06-28T00:00:00Z"
}
```

## Reference Entity: AI Processing Job
Use a separate collection for tracing asynchronous enrichment jobs.

### Collection
`/ai_processing_jobs/{jobId}`

### Schema
```json
{
  "id": "job_001",
  "entity_type": "issue",
  "entity_id": "issue_001",
  "job_type": "issue_enrichment",
  "status": "completed",
  "steps": {
    "transcription": "completed",
    "translation": "completed",
    "classification": "completed",
    "summarization": "completed",
    "dedupe": "completed"
  },
  "error_message": null,
  "started_at": "2026-06-29T08:55:30Z",
  "completed_at": "2026-06-29T08:56:05Z"
}
```

## Reference Entity: Staff User
### Collection
`/users_staff/{staffId}`

### Schema
```json
{
  "id": "staff_01",
  "name": "Constituency Analyst",
  "email": "analyst@example.org",
  "role": "analyst",
  "status": "active",
  "created_at": "2026-06-28T00:00:00Z",
  "updated_at": "2026-06-28T00:00:00Z"
}
```

### Roles
- `admin`
- `analyst`
- `moderator`
- `viewer`

## Config Entity: Scoring Weights
### Collection
`/config_scoring/default`

### Schema
```json
{
  "id": "default",
  "community_demand_weight": 0.30,
  "infrastructure_gap_weight": 0.25,
  "ai_urgency_weight": 0.20,
  "vulnerability_weight": 0.15,
  "recency_weight": 0.10,
  "updated_at": "2026-06-29T00:00:00Z"
}
```

Keeping scoring weights configurable avoids hardcoding logic and supports quick tuning during demos.

## Optional Entity: Issue Duplicate Link
If duplicate analysis becomes more advanced, store duplicate candidates separately.

### Collection
`/issue_duplicates/{duplicateLinkId}`

### Schema
```json
{
  "id": "dup_001",
  "source_issue_id": "issue_999",
  "target_issue_id": "issue_001",
  "similarity_score": 0.88,
  "location_score": 0.74,
  "decision": "linked",
  "created_at": "2026-06-29T08:56:00Z"
}
```

## BigQuery Analytics Schema
Firestore is for operational reads/writes; BigQuery is for reporting, scoring joins, and hotspot analytics.[web:73][web:78]

### Table: `issues_analytics`
Suggested columns:
- `issue_id`
- `category`
- `sub_category`
- `district`
- `ward`
- `lat`
- `lng`
- `priority_score`
- `community_demand_score`
- `infrastructure_gap_score`
- `ai_urgency_score`
- `vulnerability_score`
- `recency_score`
- `upvote_count`
- `comment_count`
- `status`
- `created_at`
- `updated_at`

### Table: `issue_events`
Suggested columns:
- `event_id`
- `issue_id`
- `event_type`
- `actor_type`
- `actor_id`
- `payload_json`
- `created_at`

### Table: `area_profiles`
Suggested columns:
- `area_profile_id`
- `name`
- `district`
- `state`
- `population_estimate`
- `vulnerability_index`
- `facility_counts_json`
- `lat`
- `lng`
- `updated_at`

## Relationship Summary
| Entity | Relationship | Notes |
|---|---|---|
| Issue → Comments | 1 to many | Stored as subcollection |
| Issue → Upvotes | 1 to many | Stored as subcollection with unique supporter hash |
| Issue → Status Events | 1 to many | Audit history |
| Issue → Flags | 1 to many | Moderation and abuse tracking |
| Issue → Area Profile | many to 1 | Via `area_profile_id` |
| Issue → AI Job | 1 to many | Trace async processing |

## Validation Rules
Strong backend schemas should encode required fields, allowed values, and type expectations early instead of relying on UI assumptions.[web:77][web:80]

### Common validation rules
- All entities must have `created_at` and `updated_at` where applicable.
- Enum-like fields should allow only documented values.
- `priority_score` and other score fields must stay in range `0.0` to `1.0`.
- `lat` must be between `-90` and `90`.
- `lng` must be between `-180` and `180`.
- At least one content input must exist for issue creation: text, voice, or image.
- At least one content input must exist for comment creation: text, voice, or image.
- `status` values allowed: `open`, `under_review`, `planned`, `in_progress`, `resolved`, `hidden`.
- `visibility` values allowed: `public`, `staff_only`, `hidden`.
- `moderation_state` values allowed: `visible`, `pending_review`, `hidden`.

## Index Recommendations
Firestore best practices recommend indexing for actual query patterns and avoiding unnecessary index cost.[web:73]

### Issue collection indexes
1. `status ASC, priority_score DESC`
2. `district ASC, category ASC, priority_score DESC`
3. `ward ASC, status ASC, latest_activity_at DESC`
4. `visibility ASC, status ASC, created_at DESC`
5. `category ASC, upvote_count DESC`

### Comment subcollection indexes
1. `moderation_state ASC, created_at DESC`

### Flag collection indexes
1. `status ASC, created_at DESC`

## Query Patterns the Schema Must Support
Designing around access patterns is one of the key schema rules.[web:73][web:78][web:80]

### Citizen-side reads
- Get nearby public issues by area/category.
- Get issue detail with support count and comments.
- Check whether current user already upvoted.

### Staff-side reads
- Get top-ranked issues by geography and category.
- Get issue detail with full score breakdown.
- Get hotspot-ready issue data.
- Get moderation queue.

### System reads/writes
- Create issue raw record.
- Update issue after AI enrichment.
- Insert upvote/comment.
- Recalculate and store priority score.
- Merge duplicates.

## API Schema Design Rules
Request and response schemas should be explicit and stable, and where useful should separate client-provided fields from computed/read-only fields.[web:74]

## Create Issue Request Schema
```json
{
  "text": "Road near school is broken",
  "language": "en",
  "location_name": "Ward 7",
  "lat": 26.2389,
  "lng": 73.0243,
  "voice_url": null,
  "image_urls": [],
  "source_channel": "web"
}
```

### Rules
- `text` optional only if voice or image exists.
- `voice_url` optional.
- `image_urls` optional array.
- `source_channel` required.

## Create Issue Response Schema
```json
{
  "issue_id": "issue_001",
  "status": "processing",
  "duplicate_candidates": [],
  "created_at": "2026-06-29T08:55:00Z"
}
```

## Duplicate Check Response Schema
```json
{
  "status": "duplicate_candidate_found",
  "candidates": [
    {
      "issue_id": "issue_001",
      "summary": "Road near Ward 7 school is damaged and unsafe.",
      "similarity_score": 0.88,
      "support_count": 18,
      "location_name": "Ward 7"
    }
  ]
}
```

## Upvote Request Schema
```json
{
  "issue_id": "issue_001",
  "citizen_hash": "anon_hash_456"
}
```

## Comment Request Schema
```json
{
  "issue_id": "issue_001",
  "text": "Flooding gets worse in monsoon",
  "voice_url": null,
  "image_url": null,
  "citizen_hash": "anon_hash_999"
}
```

## Issue List Response Schema
Use a lighter representation for list endpoints and a richer representation for detail endpoints, which follows good API schema separation.[web:74]

```json
{
  "items": [
    {
      "issue_id": "issue_001",
      "summary": "Road near Ward 7 school is damaged and unsafe.",
      "category": "roads",
      "location_name": "Ward 7",
      "priority_score": 0.64,
      "upvote_count": 18,
      "comment_count": 4,
      "status": "open",
      "primary_attachment_url": null
    }
  ],
  "next_cursor": null
}
```

## Issue Detail Response Schema
```json
{
  "issue_id": "issue_001",
  "summary": "Road near Ward 7 school is damaged and unsafe.",
  "raw_text": "Sadak toot gayi hai school ke paas",
  "normalized_text": "Road near Ward 7 school is damaged",
  "category": "roads",
  "location_name": "Ward 7",
  "lat": 26.2389,
  "lng": 73.0243,
  "priority_score": 0.64,
  "score_breakdown": {
    "community_demand": 0.61,
    "infrastructure_gap": 0.72,
    "ai_urgency": 0.78,
    "vulnerability": 0.55,
    "recency": 0.40
  },
  "upvote_count": 18,
  "comment_count": 4,
  "status": "open",
  "comments": [],
  "attachments": []
}
```

## TypeScript Model Suggestions
```ts
export type IssueStatus =
  | 'open'
  | 'under_review'
  | 'planned'
  | 'in_progress'
  | 'resolved'
  | 'hidden';

export interface ScoreBreakdown {
  community_demand: number;
  infrastructure_gap: number;
  ai_urgency: number;
  vulnerability: number;
  recency: number;
}

export interface IssueRecord {
  id: string;
  title?: string;
  raw_text?: string;
  normalized_text?: string;
  summary: string;
  language?: string;
  category: string;
  sub_category?: string;
  source_channel: 'web' | 'pwa' | 'whatsapp' | 'sms' | 'admin';
  reporter_hash?: string;
  location_name: string;
  ward?: string;
  district?: string;
  state?: string;
  lat?: number;
  lng?: number;
  dedupe_status?: 'unique' | 'candidate' | 'duplicate' | 'merged';
  duplicate_of?: string | null;
  ai_urgency_score?: number;
  priority_score: number;
  upvote_count: number;
  comment_count: number;
  unique_supporter_count: number;
  status: IssueStatus;
  visibility: 'public' | 'staff_only' | 'hidden';
  latest_activity_at: string;
  created_at: string;
  updated_at: string;
  score_breakdown: ScoreBreakdown;
}
```

## FastAPI / Pydantic Suggestions
```python
from pydantic import BaseModel, Field
from typing import Optional, List, Literal

class ScoreBreakdown(BaseModel):
    community_demand: float = Field(ge=0, le=1)
    infrastructure_gap: float = Field(ge=0, le=1)
    ai_urgency: float = Field(ge=0, le=1)
    vulnerability: float = Field(ge=0, le=1)
    recency: float = Field(ge=0, le=1)

class CreateIssueRequest(BaseModel):
    text: Optional[str] = None
    language: Optional[str] = None
    location_name: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    voice_url: Optional[str] = None
    image_urls: List[str] = []
    source_channel: Literal['web', 'pwa', 'whatsapp', 'sms', 'admin']
```

## Naming Conventions
Consistent naming is a repeated schema-design best practice because it improves maintainability and reduces ambiguity.[web:77][web:80]

### Recommended rules
- Use snake_case for backend JSON/document fields.
- Use singular entity names in model types, plural collection names.
- Use `_at` suffix for timestamps.
- Use `_count` suffix for denormalized counters.
- Use `_score` suffix for normalized ranking factors.
- Use `_id` suffix for foreign references.
- Use `_hash` suffix for anonymized user identifiers.

## Migration and Change Rules
Even in a hackathon, schema changes should be controlled.

### Rules
- Add fields in backward-compatible ways where possible.
- Avoid deleting fields once frontend depends on them.
- Version AI-produced fields if prompts or logic change significantly.
- Keep list response and detail response contracts stable once UI wiring starts.

## Build Order for Vibe Coding
The schema should support fast implementation in layers.

### Phase 1
- Create `issues` collection schema.
- Create list/detail API models.
- Seed sample issue data.

### Phase 2
- Add `comments` and `upvotes` subcollections.
- Add denormalized counters.
- Add issue detail response.

### Phase 3
- Add AI enrichment fields.
- Add scoring config and score breakdown.
- Add `ai_processing_jobs`.

### Phase 4
- Add moderation flags and status events.
- Add `public_area_profiles` and BigQuery export.

## Final Recommendation
The best backend schema for this project is a **Firestore-first operational schema with denormalized issue records, subcollections for comments and upvotes, explicit AI-enrichment fields, and separate light-vs-detail API schemas**. That approach follows schema-design best practices because it is query-driven, consistent, scalable enough for the MVP, and fast to implement without becoming messy.[web:73][web:78][web:74][web:77]
