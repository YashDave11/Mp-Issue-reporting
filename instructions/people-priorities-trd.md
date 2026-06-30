# Technical Requirements Document — People's Priorities AI

## Document Control
| Field | Value |
|---|---|
| Product | People's Priorities AI |
| Hackathon Track | Build with AI: Code for Communities — Track 1: People's Priorities |
| Document Type | TRD |
| Version | 1.0 |
| Status | Draft |
| Audience | Developers, designers, AI engineers, judges, technical reviewers |
| Build Mode | Vibe coding with structured constraints |

## TRD Writing Rules Used
This TRD follows widely used technical documentation and requirements-writing guidance: keep documents short and useful, organize them clearly, focus on goals, scope, constraints, and trade-offs, write requirements that are concise and testable, use consistent terminology, and keep the document alive as implementation evolves.[web:50][web:51][web:47][web:49]

For vibe coding, that means the document should be detailed enough to unblock fast building, but not bloated with low-value prose or premature implementation trivia. The document should tell builders what must be true, what decisions matter, what APIs and modules exist, and what is explicitly out of scope.[web:41][web:49][web:50]

## 1. Technical Summary
People's Priorities AI is a multilingual civic-tech platform that converts citizen issue reports into ranked, explainable development priorities for an MP office. The technical system must ingest text, voice, and image inputs; deduplicate similar issues; allow community validation through upvotes and comments; enrich issue records with AI and public datasets; and present the results in a real-time dashboard.[web:12]

The MVP must look deployable, operate on Google Cloud-aligned infrastructure, and demonstrate that AI is the engine doing real work rather than acting as decorative chat.[web:12][web:20]

## 2. Technical Goals
- Accept citizen issues through a mobile-friendly web experience.
- Support text, voice, and optional image input.
- Normalize multilingual input for downstream processing.
- Detect duplicates before creating new issue threads.
- Allow citizens to support existing issues with **This affects me too**.
- Allow comments that add structured context.
- Compute an explainable priority score.
- Render a staff dashboard with ranked issues and map hotspots.
- Stay simple enough to ship as a hackathon MVP.

## 3. Non-Goals
- Full production identity verification.
- Native Android and iOS apps in the MVP.
- Full WhatsApp Business production integration.
- Multi-constituency tenant support.
- Complex workflow automation with government back-office systems.
- Full-blown analytics warehouse beyond demo scope.

## 4. Vibe Coding Constraints
To support fast execution, the engineering approach should obey these rules:
- Build the smallest end-to-end slice first.
- Prefer managed services over self-hosted infrastructure where possible.
- Use meaningful names in code, routes, data models, and files so the codebase communicates intent clearly.[web:50]
- Keep modules loosely coupled and easily swappable.
- Write requirements and interfaces in a pass/fail manner wherever possible so implementation can be checked quickly.[web:47]
- Add documentation alongside code changes so the technical brief stays current.[web:50]
- Avoid over-abstracting; optimize for speed, clarity, and demo reliability.

## 5. System Overview
The system has four core layers:
1. **Citizen Intake Layer** — report issues, browse nearby issues, upvote, comment.
2. **AI Enrichment Layer** — speech transcription, translation, summarization, categorization, entity extraction, deduplication.
3. **Scoring and Data Layer** — issue storage, support counts, public dataset enrichment, ranking logic.
4. **Staff Dashboard Layer** — ranked issue table, hotspot map, issue drill-down, moderation, and status tracking.

## 6. High-Level Architecture
```text
Citizen Web App / PWA
        |
        v
Firebase Hosting / Frontend App
        |
        v
Backend API (Cloud Run)
        |
        +--> Cloud Storage (voice/image uploads)
        +--> Firestore (operational issue data)
        +--> BigQuery (analytics + public data)
        +--> Gemini / Vertex AI APIs
        +--> Speech-to-Text API
        +--> Translation API
        +--> Maps / Geospatial services
        |
        v
MP Staff Dashboard (React)
```

## 7. Recommended Tech Stack
### Frontend
- React + Vite
- TypeScript
- Tailwind CSS
- React Router
- Zustand or TanStack Query
- Recharts for dashboard charts
- Google Maps JavaScript API for map views

### Backend
- FastAPI or Node.js with Express
- Cloud Run for container deployment
- Firebase Admin SDK
- Pydantic or Zod for schema validation
- Background jobs using Cloud Functions or scheduled Cloud Run tasks

### Data and Storage
- Firestore for live operational data
- BigQuery for analytics and enriched dataset joins
- Cloud Storage for media uploads

### AI Services
- Gemini API or Vertex AI for summarization, categorization, moderation, and multimodal analysis
- Speech-to-Text for voice intake
- Translation API for multilingual normalization
- Embeddings or semantic similarity layer for deduplication

### Infra and Tooling
- Firebase Hosting
- Secret Manager
- Cloud Logging
- GitHub for source control
- Optional Postman / Bruno collection for API validation

This stack matches the hackathon's encouraged Google Cloud tooling for AI, speech, translation, maps, data, backend, and rapid prototyping.[web:12][web:20]

## 8. Core Technical Requirements
### TR-1 Citizen Issue Submission
The system must allow a citizen to create an issue from a mobile-responsive web interface.

**Requirements**
- User can submit text input.
- User can upload a voice note.
- User can upload one or more photos.
- User can provide location by text or map selection.
- Submission endpoint must validate payload before processing.

**Acceptance criteria**
- Invalid payload returns validation error.
- Valid payload creates a raw issue record.
- Voice and image assets are stored with issue references.

### TR-2 Multilingual Processing
The system must support multilingual intake suitable for Indian constituency use cases.

**Requirements**
- Language is auto-detected or user-selected.
- Non-standard language inputs are translated into a common internal representation.
- Original user content is retained for traceability.

**Acceptance criteria**
- Processed issue stores original and normalized text.
- Staff dashboard can display both summary and original content when needed.

### TR-3 Speech Processing
The system must convert citizen voice reports into text for downstream enrichment.

**Requirements**
- Voice uploads are transcribed asynchronously.
- Transcription failure state is recorded.
- Raw media remains accessible for audit/demo.

**Acceptance criteria**
- Voice report receives a transcript or an explicit failed status.
- Failed transcriptions do not break the rest of the issue pipeline.

### TR-4 AI Categorization and Summarization
The system must classify incoming reports and generate a concise issue summary.

**Requirements**
- Assign one primary category.
- Generate a short summary for issue cards.
- Estimate urgency.
- Extract structured entities such as locality, facility type, and issue object.

**Acceptance criteria**
- Every processed issue contains category, summary, and urgency fields.
- Missing extractions are represented safely as null or unknown values.

### TR-5 Deduplication
The system must reduce duplicate issue threads.

**Requirements**
- Compare each new issue against existing issue corpus.
- Use both semantic similarity and location proximity.
- Return a list of likely matches above threshold.
- Allow user to support an existing issue instead of creating a new one.

**Acceptance criteria**
- Duplicate check happens before final issue publish.
- Duplicate confidence is stored.
- User can override and submit a new issue if needed.

### TR-6 Community Validation
The system must let citizens support existing issues and add context.

**Requirements**
- One upvote per issue per user identity hash.
- Comment thread per issue.
- Optional voice/image attachments on comments.
- Public counts for upvotes and comments.

**Acceptance criteria**
- Duplicate upvote attempts are blocked.
- Comment counts update after successful submission.
- Upvote state is reflected in both issue detail and dashboard totals.

### TR-7 Priority Scoring
The system must rank issues using an explainable score.

**Requirements**
- Priority score computed from weighted factors.
- Factor breakdown stored and surfaced in dashboard.
- Score recalculated after meaningful input changes or on schedule.

**Acceptance criteria**
- Dashboard can sort by score.
- Each issue shows human-readable scoring explanation.
- Score calculation does not fail if one factor is missing.

### TR-8 Staff Dashboard
The system must provide a technical dashboard for constituency staff.

**Requirements**
- Ranked issues table.
- Filter by category, location, and status.
- Hotspot map.
- Detail pane with summary, evidence, comments, counts, and score logic.
- Status update flow.

**Acceptance criteria**
- First load shows top issues without manual refresh.
- Issue detail can be opened from both map and table.
- Status changes persist correctly.

### TR-9 Moderation and Abuse Handling
The system must keep public issue threads usable and trustworthy.

**Requirements**
- Rate limiting on submissions, comments, and upvotes.
- Moderation flag on suspicious content.
- Manual merge tool for duplicates.
- Optional hidden state for inappropriate content.

**Acceptance criteria**
- Repeated spam attempts are rejected.
- Moderators can merge issues without data loss.
- Hidden content is excluded from public listing.

## 9. Non-Functional Requirements
### Performance
- First meaningful dashboard load should feel fast on hackathon demo hardware.
- New upvote/comment should appear within a few seconds.
- AI enrichment may be async, but visible fallback states are required.

### Reliability
- Submission should not fail if one enrichment step fails.
- Partial issue records must remain recoverable.
- Logs must exist for failed AI calls and upload errors.

### Security
- Media uploads should use signed or controlled storage flow.
- Secrets must stay outside source code.
- Identity should be represented by OTP or hashed session/phone identifiers, not plaintext sensitive data.

### Accessibility
- Large tap targets.
- Mobile-first layout.
- Minimal reading burden.
- Clear labels for primary actions.

### Maintainability
- Clear module boundaries.
- Shared schema definitions.
- Minimal magic strings.
- Config-driven scoring weights.

## 10. Architecture Decisions
### Decision 1 — Web-first MVP
**Choice**: Build a PWA instead of native apps.

**Why**
- Fastest path to a demoable product.
- Works across devices with one codebase.
- Easier to iterate during hackathon.

### Decision 2 — Managed Google Cloud Services
**Choice**: Use Firebase, Cloud Run, BigQuery, Gemini, Speech-to-Text, Translation, Maps.

**Why**
- Strong alignment with hackathon guidance.[web:12]
- Lower ops burden.
- Faster to integrate and demo.

### Decision 3 — Firestore + BigQuery split
**Choice**: Use Firestore for live app data and BigQuery for enrichment/analytics.

**Why**
- Firestore is fast for app interactions.
- BigQuery is better for aggregation, geospatial queries, and analytics-style joins.

### Decision 4 — Async enrichment pipeline
**Choice**: Process AI enrichment asynchronously after raw issue creation.

**Why**
- Reduces blocking latency for user submission.
- Makes failure handling easier.
- Supports fallback states during demo.

## 11. Alternatives Considered
Good technical design docs and requirements docs should capture trade-offs and alternatives, not just the chosen path.[web:49][web:52]

| Alternative | Why not chosen |
|---|---|
| Native mobile apps first | Too slow for hackathon scope |
| Monolithic self-hosted backend | More operational overhead than needed |
| Pure SQL-only data architecture | Harder to optimize for real-time UI and fast prototyping |
| No deduplication, only issue submission | Weaker differentiation and worse UX |
| No upvote/comments, only admin ranking | Loses community validation signal |

## 12. Data Model
### Issue
```json
{
  "id": "issue_123",
  "title": "Broken road near ward school",
  "raw_text": "...",
  "normalized_text": "...",
  "summary": "Road near Ward 7 school is damaged and unsafe.",
  "category": "roads",
  "language": "hi",
  "location_name": "Ward 7",
  "lat": 26.2389,
  "lng": 73.0243,
  "urgency_score": 0.76,
  "priority_score": 0.81,
  "upvote_count": 42,
  "comment_count": 8,
  "status": "open",
  "duplicate_of": null,
  "created_at": "ISO-8601"
}
```

### Comment
```json
{
  "id": "comment_1",
  "issue_id": "issue_123",
  "text": "Floods every monsoon.",
  "voice_url": null,
  "image_url": null,
  "ai_note": "Seasonal flood risk reported.",
  "created_at": "ISO-8601"
}
```

### Upvote
```json
{
  "issue_id": "issue_123",
  "citizen_hash": "hashed_identifier",
  "created_at": "ISO-8601"
}
```

## 13. API Surface
### Citizen APIs
- `POST /issues/create`
- `POST /issues/check-duplicate`
- `POST /issues/upvote`
- `POST /issues/comment`
- `GET /issues/nearby`
- `GET /issues/{id}`

### Staff APIs
- `GET /dashboard/issues`
- `GET /dashboard/hotspots`
- `PATCH /issues/{id}/status`
- `POST /issues/{id}/merge`
- `GET /moderation/queue`

### Internal / Service APIs
- `POST /pipeline/transcribe`
- `POST /pipeline/translate`
- `POST /pipeline/enrich`
- `POST /pipeline/recalculate-score`

## 14. Processing Pipeline
```text
Raw submission
  -> validate request
  -> upload media
  -> create raw issue record
  -> transcribe voice (if present)
  -> translate / normalize text
  -> classify and summarize
  -> extract entities
  -> run duplicate search
  -> create or link issue thread
  -> recompute scores
  -> update dashboard views
```

## 15. Priority Scoring Logic
### Formula
Priority Score = 30% Community Demand + 25% Infrastructure Gap + 20% AI Urgency + 15% Demographic Vulnerability + 10% Recency

### Inputs
- **Community Demand**: upvotes, unique reporters, comments.
- **Infrastructure Gap**: nearest relevant facility, service mismatch, spatial shortage.
- **AI Urgency**: severity inferred from issue content.
- **Demographic Vulnerability**: affected population context.
- **Recency**: issue acceleration and freshness.

### Technical rule
Store both raw factor values and final score so the UI can explain the result.

## 16. Public Dataset Requirements
For MVP, enrich one geography only.

**Required fields**
- Area code or locality name
- Population or household estimate
- Basic facility list (school, PHC, roads or wards)
- Optional vulnerability indicators
- Optional distance lookup inputs

**Technical requirement**
Dataset ingestion must support CSV or spreadsheet-derived imports converted into a clean structured table.

## 17. Frontend Requirements
### Citizen App
- Mobile-first responsive layout.
- Home actions: report issue, see nearby issues.
- Issue cards with summary, support count, location, and status.
- Duplicate detection UI before publish.
- Upvote and comment interactions with optimistic feedback.

### Staff Dashboard
- Desktop-friendly but still responsive.
- Sticky filter/header layout.
- Table + map dual navigation.
- Drill-down detail panel.
- Score explanation module.

## 18. Error Handling Requirements
- If AI pipeline fails, raw issue must still exist.
- If duplicate check fails, user may continue with new issue submission.
- If media upload fails, text-only fallback should still work where possible.
- UI must show clear states: processing, failed, retryable, complete.

## 19. Logging and Observability
- Log every submission attempt.
- Log every AI enrichment stage.
- Log score recalculation errors.
- Log moderation actions.
- Track key API latencies for submission, dedupe, and dashboard fetch.

## 20. Folder Structure Recommendation
```text
/apps
  /citizen-web
  /dashboard
/services
  /api
  /ai
  /scoring
  /moderation
/shared
  /schemas
  /types
  /utils
/data
  /seed
  /ingestion
/docs
  PRD.md
  TRD.md
  api-contracts.md
```

## 21. Coding Standards for Fast Build
Google's documentation guidance emphasizes meaningful names, concise docs, and examples starting with the simplest use case first.[web:50] Atlassian guidance on requirements emphasizes concise, organized, testable statements and consistent terminology.[web:47]

Apply those rules directly to the codebase:
- Name routes and services by intent, not vague abstractions.
- Keep functions small and composable.
- Prefer explicit schemas.
- Add one simple example payload for every API route.
- Keep README and docs aligned with the latest code.
- Delete dead code and stale docs aggressively.[web:50]

## 22. Example API Payloads
### Create Issue Request
```json
{
  "text": "School roof is damaged in Ward 7.",
  "language": "hi",
  "location_name": "Ward 7",
  "lat": 26.2389,
  "lng": 73.0243,
  "voice_url": null,
  "image_urls": []
}
```

### Upvote Request
```json
{
  "issue_id": "issue_123",
  "citizen_hash": "hashed_identifier"
}
```

### Comment Request
```json
{
  "issue_id": "issue_123",
  "text": "This gets worse in monsoon.",
  "voice_url": null,
  "image_url": null
}
```

## 23. Security and Privacy Requirements
- Do not store raw personally sensitive citizen details unless essential.
- Use hashed identifiers for repeat interaction checks.
- Restrict admin-only routes.
- Use signed media access where relevant.
- Keep AI prompts and API keys outside the repo.

## 24. Demo Readiness Requirements
- Seed at least 15 realistic issue records.
- Ensure one live voice submission works reliably.
- Ensure duplicate redirect works.
- Ensure one issue shows meaningful upvote growth.
- Ensure dashboard ranking and map update can be demonstrated within minutes.
- Keep a fallback script and seeded state in case live APIs slow down.

## 25. Build Order
### Phase 1 — Foundation
- Set up frontend apps.
- Define schemas.
- Build seeded issue list and details.
- Add media upload flow.

### Phase 2 — Enrichment
- Add transcription and translation.
- Add categorization and summary.
- Add issue processing status.

### Phase 3 — Community Layer
- Add duplicate detection UI.
- Add upvotes.
- Add comments.
- Add count updates.

### Phase 4 — Dashboard Intelligence
- Add ranking engine.
- Add map hotspot view.
- Add detail score explanation.
- Add moderation basics.

### Phase 5 — Stabilization
- Improve errors and fallbacks.
- Reduce latency.
- Clean naming and docs.
- Record demo backup.

## 26. Open Technical Questions
- Should Firestore alone be enough for MVP, with BigQuery only for seeded analytics?
- What similarity threshold should trigger duplicate suggestion?
- Should citizen identifiers use OTP or device/session hashing?
- What is the minimum viable public dataset that still makes scoring credible?
- How much scoring should be precomputed versus calculated on read?

## 27. Exit Criteria
The MVP is technically complete when all of the following are true:
- A citizen can submit an issue with text or voice.
- The system enriches the issue with AI metadata.
- The system can suggest an existing issue as a duplicate.
- A citizen can upvote and comment.
- A staff user can see ranked issues and hotspot map.
- Each ranked issue shows why it is ranked.
- The demo can run end-to-end without manual database edits.

## 28. Maintenance Rule
Technical docs should stay useful, current, and tightly connected to the implementation rather than becoming stale archives.[web:50][web:49] This TRD should be updated whenever core architecture, APIs, data schemas, or scoring logic changes.
