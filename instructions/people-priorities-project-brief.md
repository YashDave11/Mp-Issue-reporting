# People's Priorities AI — Project Brief

## Overview
People's Priorities AI is a multilingual civic-tech platform for **Track 1: People's Priorities** in Build with AI: Code for Communities. The goal is to help an MP's office convert scattered citizen requests from voice notes, text, photos, and messaging platforms into a ranked, evidence-backed list of development works that can be acted on quickly.[cite:12]

The hackathon emphasizes real-world deployment, use of Google Cloud technologies, multilingual and voice-enabled access, and solutions that can realistically pilot in a constituency or district in weeks rather than months.[cite:12][cite:20]

## Core Problem
MPs receive development requests from many channels: public meetings, letters, grievance portals, social media, and direct outreach. These inputs are fragmented, repetitive, multilingual, and often unstructured, making it difficult to identify recurring priorities and compare them against real demographic and infrastructure gaps.[cite:12]

A strong solution for Track 1 therefore must do four things well:
- Collect citizen input in inclusive formats.
- Detect duplicates and cluster similar issues.
- Measure public demand and urgency objectively.
- Recommend high-priority works with explainable reasoning.[cite:12]

## Proposed Solution
The proposed product is a **community-validated priority engine** for constituency development planning.

Instead of treating every complaint as a separate record, the system:
1. Accepts new issues from citizens through web, mobile, WhatsApp-style flows, and voice input.
2. Uses AI to classify, translate, summarize, geotag, and deduplicate reports.
3. Lets citizens press **"This affects me too"** to upvote an existing issue instead of re-reporting it.
4. Allows comments and additional context, including voice notes and photos.
5. Combines public demand with public datasets to rank development works for the MP dashboard.

This makes the platform more democratic than a standard complaint form and more actionable than a simple grievance list.

## Why This Concept Is Strong
This concept maps directly to the judging criteria:

| Evaluation area | Why this project fits |
|---|---|
| Problem–Solution Fit | Solves prioritization of citizen requests and development works directly.[cite:12] |
| AI/Technical Execution | AI performs translation, speech processing, summarization, deduplication, categorization, clustering, and ranking.[cite:12] |
| Deployability & Scalability | Built on managed Google Cloud services with a practical pilot model.[cite:12][cite:20] |
| Inclusivity & Accessibility | Supports multilingual, voice-first, and low-connectivity flows.[cite:12] |
| Impact Potential | Converts raw citizen demand into measurable, ranked projects. |
| Presentation & Clarity | Easy to demo with a citizen flow and an MP office dashboard.[cite:12] |

## Product Vision
The platform should feel like a mix of:
- a citizen issue reporting app,
- a local community validation layer,
- and an AI decision-support dashboard for governance teams.

The key idea is that **AI does the hard work**, while the interface stays simple enough for citizens, field workers, and constituency staff.

## Primary Users
### 1. Citizens
Citizens report issues in their own language using text, voice, image, or simple forms. They can also discover nearby reported issues and support them using upvotes.

### 2. MP Office / Constituency Staff
Staff members use the dashboard to see hotspots, issue clusters, comments, evidence, and ranked recommendations for action.

### 3. Analysts / Moderators
Admins validate flagged content, configure scoring weights, and review public datasets.

## Core Features

### Citizen Intake
- Report issue using text.
- Report issue using voice note.
- Upload supporting photo.
- Auto-detect or select language.
- Auto-translate to a standard processing language.
- Auto-extract location from text, map selection, or uploaded metadata.
- Simple category prompts such as roads, education, water, sanitation, health, and public safety.

### Deduplication and Issue Discovery
- AI similarity match against existing issues.
- If similar issue exists, citizen sees the existing thread instead of creating a duplicate.
- Prompt: **"This issue is already reported by people near you. Add your support or context."**
- Nearby issue feed with map and list views.

### Community Validation Layer
- **This affects me too** upvote button.
- One upvote per citizen per issue.
- Count of affected residents shown publicly.
- Comment thread for additional details.
- Voice comments and image-based follow-up context.
- Optional evidence tags such as recurring, urgent, seasonal, or dangerous.

### AI Processing Layer
- Speech-to-text for voice submissions.
- Translation for multilingual normalization.
- LLM-based issue summarization.
- Classification into civic categories.
- Urgency scoring.
- Entity extraction such as village name, ward, school, PHC, road, drain, water tank, etc.
- Deduplication using embeddings or semantic similarity.
- Cluster summarization: convert many citizen reports into one actionable development work.

### MP Dashboard
- Ranked issue list.
- Hotspot map by constituency area.
- Filters by category, urgency, geography, and time.
- Trend view showing rising issues.
- Drill-down page with:
  - issue summary,
  - number of unique reporters,
  - upvote count,
  - comment highlights,
  - images,
  - demographic context,
  - nearby infrastructure gaps,
  - recommended action.
- Export view for PDF/CSV briefings.

### Admin and Governance Features
- Content moderation queue.
- Spam detection.
- Duplicate merge tool.
- Weight configuration for priority score.
- Dataset upload pipeline for local facilities and census-linked context.
- Audit log for actions taken.

## Differentiating Features
These are the standout ideas that make the project stronger than a normal reporting portal:

### 1. Upvote-Driven Demand Signal
Instead of forcing many residents to re-submit the same problem, the platform consolidates issues and lets citizens support them through a **This affects me too** action. This reduces noise and creates a direct measure of citizen demand.

### 2. Community Context Through Comments
Comments are not just discussions; they add structured field intelligence. AI can summarize the most important details from comments into a short note for MP staff.

### 3. Explainable Priority Score
The dashboard should never show a mysterious ranking. Every issue should display the score contributors such as demand, urgency, vulnerability, and infrastructure gap.

### 4. Pilot-Ready Design
The system is designed for one constituency first, with configuration-based expansion to more districts or MPs later.

## Priority Scoring Model
A practical prototype can use a transparent formula such as:

**Priority Score = 30% Community Demand + 25% Infrastructure Gap + 20% AI Urgency + 15% Demographic Vulnerability + 10% Recency**

### Score Inputs
- **Community Demand**: upvotes, unique reporters, number of local comments.
- **Infrastructure Gap**: distance to nearest school/PHC/road service point, facility shortage, service deficit.
- **AI Urgency**: model-estimated criticality from text, image, and comments.
- **Demographic Vulnerability**: population density, children affected, elderly population, underserved area markers.
- **Recency**: recent rise in issue frequency.

### Why This Works
This score is explainable, demo-friendly, and easy for judges and policymakers to understand. It also aligns with the hackathon requirement that AI should perform meaningful work rather than decorative chatbot behavior.[cite:12]

## Recommended Tech Stack

### Frontend
- **Citizen app / PWA**: React + Vite + Tailwind CSS
- **Dashboard**: React + TypeScript + Tailwind CSS
- **Maps UI**: Google Maps JavaScript API
- **Charts**: Recharts or Plotly
- **State management**: Zustand or React Query

### Backend
- **API layer**: FastAPI or Node.js with Express
- **Auth/session logic**: Firebase Authentication or custom OTP-based session flow
- **Realtime updates**: Firebase Realtime Database or Firestore listeners
- **Background jobs**: Cloud Functions / Cloud Run jobs

### AI and ML
- **LLM + multimodal reasoning**: Gemini API / Vertex AI
- **Speech processing**: Google Cloud Speech-to-Text
- **Translation**: Google Cloud Translation API
- **Embeddings / similarity**: Vertex AI embeddings or local vector processing
- **Image understanding**: Gemini multimodal or Vertex AI Vision for issue photos
- **Moderation**: Gemini moderation prompt or safety filters

### Data Layer
- **Operational datastore**: Firestore or PostgreSQL
- **Analytics / reporting**: BigQuery
- **File storage**: Google Cloud Storage
- **Geospatial / hotspot processing**: BigQuery GIS and Google Maps Platform

### Hosting / Infra
- **Frontend hosting**: Firebase Hosting
- **Backend hosting**: Cloud Run
- **Async triggers**: Cloud Functions
- **Secrets and config**: Secret Manager
- **Monitoring**: Cloud Logging + Error Reporting

## Recommended Google Cloud Usage
The hackathon explicitly encourages use of Google Cloud technologies including Gemini, Vertex AI, Speech APIs, Maps, BigQuery, Firebase, Cloud Run, and public datasets integration.[cite:12][cite:20]

### Best-Fit Services for This Project
| Need | Recommended service |
|---|---|
| Voice intake | Cloud Speech-to-Text |
| Multilingual normalization | Translation API |
| Text/image understanding | Gemini API or Vertex AI |
| Web hosting | Firebase Hosting |
| User auth | Firebase Authentication |
| Fast API deployment | Cloud Run |
| Structured analytics | BigQuery |
| Files and photos | Cloud Storage |
| Realtime counters | Firestore / Realtime Database |
| Maps and hotspot view | Google Maps Platform |

## Architecture Overview

### High-Level Flow
1. Citizen submits issue through app, web, or messaging flow.
2. Backend stores raw submission.
3. AI pipeline transcribes, translates, classifies, and extracts entities.
4. Similarity engine checks whether the issue is new or duplicate.
5. If duplicate, user is redirected to the existing issue page to upvote or comment.
6. Public demand and public data are merged into a priority score.
7. Dashboard updates ranked issues for the MP office.

### Suggested Services Flow
- **React app** → Firebase Hosting
- **API requests** → Cloud Run
- **Submission processing** → Cloud Functions
- **AI enrichment** → Gemini / Vertex AI APIs
- **Raw + structured issue data** → Firestore + BigQuery
- **Photos/audio** → Cloud Storage
- **Analytics dashboard queries** → BigQuery

## Data Model

### Issue Entity
- Issue ID
- Title
- AI summary
- Full citizen description
- Category
- Location name
- Latitude / longitude
- Ward / village / block
- Upvote count
- Unique reporter count
- Comment count
- Urgency score
- Priority score
- Status: open, under review, planned, in progress, resolved
- Evidence assets
- Created at / updated at

### Comment Entity
- Comment ID
- Issue ID
- Citizen ID hash
- Comment text
- Voice note URL
- Image URL
- AI extracted insight
- Timestamp

### Upvote Entity
- Issue ID
- Citizen ID hash
- Timestamp

### Public Dataset Entity
- Region code
- Population metrics
- Facility metrics
- Vulnerability indicators
- Distance metrics

## AI Modules to Implement

### 1. Speech-to-Text Module
Purpose: convert citizen voice notes into text for downstream processing.

### 2. Translation Module
Purpose: normalize Hindi and regional-language inputs into a standard internal language while preserving original text.

### 3. Issue Classification Module
Purpose: classify report into governance categories and likely department.

### 4. Entity Extraction Module
Purpose: detect locality names, institution names, affected groups, and issue objects.

### 5. Deduplication Module
Purpose: match incoming issue against existing issues using semantic similarity and location proximity.

### 6. Summarization Module
Purpose: create short, readable summaries for staff dashboards and issue cards.

### 7. Comment Insight Module
Purpose: summarize the most useful community observations into a short note.

### 8. Priority Recommendation Module
Purpose: compute a score and convert issue clusters into suggested development works.

## MVP Scope
To increase the probability of shipping on time, the MVP should stay very focused.

### Recommended MVP Boundaries
- One constituency or one demo geography.
- 3 core categories only, for example: roads, sanitation, and school infrastructure.
- One citizen-facing intake app.
- One MP/staff dashboard.
- Voice + text input.
- Upvote + comments.
- Deduplication.
- Ranked issue dashboard.
- Basic public data integration.

### Avoid in MVP
- Full multilingual conversational bot.
- Complex social verification graphs.
- Too many issue categories.
- Native Android + iOS + web all at once.
- Overbuilt admin panel.

## Best Demo Scenario
The demo should show a complete flow:
1. Citizen records a voice complaint in Hindi.
2. System transcribes and categorizes it.
3. Similar issue already exists, so the citizen is routed to that issue page.
4. Citizen taps **This affects me too**.
5. Another citizen adds a comment and photo.
6. Dashboard updates the upvote count and priority score in real time.
7. MP staff sees why the issue is ranked highly and marks it **Under Review**.

This makes the solution easy to understand within a short pitch window and highlights both AI utility and deployability.[cite:12]

## UI / UX Recommendations

### Citizen UI
- Keep the home screen simple: **Report an issue** and **See issues near me**.
- Use large buttons and icon-assisted actions.
- Use voice-first prompts.
- Use cards for existing issues with photo, short summary, upvote count, and location.
- Keep text minimal for low-literacy usability.

### Dashboard UI
- Top row: total open issues, top rising issue, categories, issue resolution funnel.
- Middle: hotspot map and ranked issue table.
- Bottom: issue detail panel with comments, images, and AI evidence summary.
- Use color carefully and keep the interface clean and official.

## Security, Abuse, and Trust
- One upvote per citizen per issue.
- OTP-based identity or hashed phone number tracking.
- Rate limiting on issue creation and comments.
- AI moderation for abuse or irrelevant content.
- Manual review queue for flagged items.
- Transparency panel showing why an issue is ranked highly.

## Implementation Plan

### Phase 1: Product Definition
- Finalize problem statement focus.
- Pick demo geography.
- Define issue categories.
- Create wireframes.

### Phase 2: Core Intake System
- Build issue submission UI.
- Add voice upload.
- Store raw submission.
- Integrate transcription and translation.

### Phase 3: AI Enrichment
- Add classification, summarization, and entity extraction.
- Add deduplication logic.
- Add issue card generation.

### Phase 4: Community Layer
- Implement upvotes.
- Implement comments.
- Add duplicate redirect to existing issue.

### Phase 5: Dashboard and Scoring
- Build ranking dashboard.
- Add map and filters.
- Implement score calculation.
- Connect public datasets.

### Phase 6: Demo and Polish
- Add seeded demo data.
- Create a clean demo script.
- Prepare pitch deck screenshots and architecture diagram.

## Suggested Team Split
For a small team, a practical split is:

### Builder 1 — Frontend / UX
- Citizen app
- Dashboard UI
- Map and charts
- Interaction polish

### Builder 2 — Backend / AI
- API design
- Data model
- AI pipeline
- Deduplication and scoring logic

### Optional Builder 3 — Data / Product
- Public datasets
- scoring criteria
- demo script
- presentation and documentation

## Sample API Endpoints
- `POST /issues/create`
- `POST /issues/transcribe`
- `POST /issues/comment`
- `POST /issues/upvote`
- `GET /issues/nearby`
- `GET /issues/:id`
- `GET /dashboard/issues`
- `PATCH /issues/:id/status`
- `GET /analytics/summary`

## Suggested Folder Structure
```text
/apps
  /citizen-web
  /dashboard
/services
  /api
  /ai-pipeline
  /scoring
  /moderation
/data
  /seed
  /schemas
/docs
  architecture.md
  demo-script.md
```

## What to Highlight in the Submission
- Real-world constituency use case.
- AI as a core engine, not a decorative chatbot.[cite:12]
- Citizen-friendly multilingual design.[cite:12]
- Community validation through upvotes and comments.
- Explainable ranking.
- Deployable Google Cloud architecture.[cite:12][cite:20]
- Practical pilot readiness.

## Final Recommendation
This project should be positioned as an **AI-powered constituency priority engine** rather than just an issue-reporting tool. The strongest differentiator is the combination of multilingual intake, AI deduplication, community upvotes, contextual comments, and an explainable ranking system for development planning.

A focused MVP using React, Firebase, Cloud Run, BigQuery, Google Maps, Gemini, Speech-to-Text, and Translation API is strong enough for the hackathon and realistic enough to feel pilot-ready.[cite:12][cite:20]
