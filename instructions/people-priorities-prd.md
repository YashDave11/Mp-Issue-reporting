# Product Requirements Document — People's Priorities AI

## Document Control
| Field | Value |
|---|---|
| Product | People's Priorities AI |
| Hackathon | Build with AI: Code for Communities — Track 1: People's Priorities |
| Version | 1.0 |
| Status | Draft |
| Target Release | Hackathon MVP |
| Primary Users | Citizens, MP office staff, moderators |
| Core Team | Product, design, frontend, backend, AI/ML |

## PRD Principles
This PRD follows current best-practice guidance for agile product requirements documents: define the purpose, features, user needs, and success criteria; keep the document concise; include goals, assumptions, user stories, design context, open questions, and explicit out-of-scope items; and treat the PRD as a living, collaborative source of truth rather than a rigid specification.[web:25][page:1][page:2]

The document is optimized for **vibe coding**: it gives enough context, constraints, flows, acceptance criteria, and technical direction for fast implementation without over-specifying every UI detail. This aligns with agile PRD advice to provide just enough context, preserve flexibility, and let builders solve implementation elegantly.[page:1][page:2]

## 1. Product Summary
People's Priorities AI is a multilingual civic-tech platform that helps an MP's office consolidate citizen development requests from voice, text, photos, and lightweight digital channels into a ranked, evidence-backed list of constituency priorities. The product is designed specifically for Track 1, which asks teams to build a multilingual AI platform that surfaces recurring citizen needs, maps demand hotspots, and combines feedback with demographic and infrastructure data to recommend high-priority development works.[web:12][page:1]

The core differentiator is a **community validation layer**: instead of creating duplicate complaints, citizens can support an existing issue using a **This affects me too** action and add comments, voice context, or photos. AI then deduplicates, summarizes, geotags, classifies, and ranks issues for constituency staff.

## 2. Problem Statement
Citizen development demands reach MPs through fragmented channels such as meetings, letters, social media, grievance portals, and direct outreach. These inputs are multilingual, repetitive, and unstructured, which makes it hard to identify true demand patterns or objectively compare competing development works.[web:12]

Today, the same issue may be reported dozens of times by different people, while another high-impact problem may remain buried in scattered messages. A constituency team needs a system that can consolidate these signals, reduce duplicate reporting, and turn raw citizen input into a transparent shortlist of projects worth acting on.

## 3. Objective
Build a working MVP that demonstrates an end-to-end flow where citizens can submit or support constituency issues, and MP office staff can view a ranked dashboard of validated priorities backed by AI and public context data.

### Business Objective
Enable faster, more evidence-based constituency planning by converting noisy citizen input into ranked development actions that can be understood in under five minutes by a policymaker.

### Product Objective
Reduce duplicate issue reporting, increase visibility of real community demand, and give constituency staff a simple system for identifying the most urgent and broadly supported local problems.

## 4. Success Metrics
The PRD should define clear goals and success metrics because strong PRDs connect objectives to measurable outcomes.[web:30][web:31]

| Metric | Baseline | MVP Target |
|---|---|---|
| Duplicate issue consolidation rate | Manual / none | 60%+ similar reports redirected to existing issue |
| Time to classify a new issue | Manual | Under 15 seconds for AI-enriched processing |
| Citizen support signal captured | None | Upvotes enabled on 100% of published issues |
| Dashboard actionability | Unstructured backlog | Top 10 ranked issues visible with reasons |
| Accessibility coverage | Text-first | Voice + multilingual input enabled |
| Demo completion | Not applicable | End-to-end live flow without manual intervention |

## 5. Background and Strategic Fit
A PRD should explain why the product matters and how it fits the broader strategy.[page:1] In this hackathon, the strategy is explicit: build AI systems that help governance teams act on public problems faster, using Google Cloud technologies and inclusive access patterns such as voice, multilingual support, and public dataset integration.[web:12][web:20]

This product fits that strategy because it makes AI the actual operating engine for constituency planning, not a cosmetic add-on. It uses AI to transform scattered citizen signals into clustered, ranked development priorities that an MP office can review, filter, and act upon.

## 6. Users and Personas
### Primary Persona 1 — Citizen Reporter
- Lives in a constituency area.
- May have low digital literacy.
- May prefer Hindi or another regional language.
- Needs a quick way to raise an issue or support an existing one.
- May only have intermittent connectivity.

### Primary Persona 2 — Concerned Supporter
- Has seen an already reported issue.
- Does not want to retype the same complaint.
- Wants to indicate that the issue also affects them.
- May add short text, voice, or photo context.

### Primary Persona 3 — MP Office Analyst
- Reviews incoming local issues.
- Needs a dashboard with ranked priorities, map hotspots, issue evidence, and community demand.
- Must understand why an issue ranks high without reading every raw submission.

### Secondary Persona — Moderator / Admin
- Reviews flagged content.
- Merges duplicates when needed.
- Tunes scoring weights and uploads supporting data.

## 7. User Problems
### Citizen Problems
- Reporting a local issue feels repetitive and frustrating.
- Existing grievance tools do not show whether others are affected.
- Voice and local-language inputs are often unsupported.
- Users do not know whether their issue has traction.

### Staff Problems
- Requests come from too many channels.
- Duplicate complaints inflate noise.
- Manual triage is slow.
- There is no transparent way to compare one issue against another.

## 8. Scope
Best-practice PRDs call out both scope and out-of-scope items clearly to prevent confusion and scope creep.[page:1][web:30]

### In Scope for MVP
- Citizen issue submission via web/PWA.
- Text and voice issue intake.
- Optional photo upload.
- Language detection and translation.
- AI-based issue classification and summarization.
- Deduplication against existing issues.
- Upvote button: **This affects me too**.
- Comment thread with optional voice or image follow-up.
- Ranked issue dashboard for staff.
- Map-based hotspot view.
- Transparent priority score with visible reasons.
- Basic moderation and anti-spam logic.
- Public dataset enrichment for one demo geography.

### Out of Scope for MVP
- Full WhatsApp Business production rollout.
- Native Android and iOS apps alongside web.
- Complex workflow automation with district-level integrations.
- Full case management and field-visit scheduling.
- Deep historical analytics across multiple constituencies.
- Citizen identity verification beyond lightweight OTP/session logic.
- Multi-tenant production setup for many MPs.

## 9. Assumptions
Good PRDs state assumptions explicitly so teams can validate or revise them later.[page:1][web:30]

- Most citizens can use a simple mobile web flow if the interface is minimal.
- Voice input meaningfully improves accessibility for low-literacy users.
- Citizens are more likely to support an existing issue than submit a duplicate if the existing issue is easy to discover.
- A transparent score is more persuasive to judges and policymakers than a black-box AI ranking.
- A single-constituency demo with seeded or limited real data is sufficient for a strong hackathon prototype.
- Google Cloud services such as Gemini, Speech-to-Text, Translation, Firebase, Cloud Run, Maps, and BigQuery are acceptable and aligned with the hackathon recommendations.[web:12][web:20]

## 10. Product Principles
- **AI must do real work.** It should classify, deduplicate, summarize, translate, extract entities, and rank issues rather than act as a decorative chatbot.[web:12]
- **One action should feel obvious.** Citizens should immediately understand whether to report, support, or add context.
- **Reduce duplication by design.** The system should redirect users toward existing issues whenever possible.
- **Explain the ranking.** Every high-priority issue must show why it is high-priority.
- **Design for low-friction access.** Voice, minimal text, and mobile-first flows matter.
- **Keep the MVP demoable.** Every implemented feature must help the story in the final demo.

## 11. Core User Stories
Best-practice PRDs include user stories and supporting context so the team understands the problem from the user's perspective.[page:1][web:30]

### Citizen Submission
- As a citizen, I want to report a local issue in my own language so that I can raise concerns quickly.
- As a citizen, I want to send a voice note instead of typing so that I can report issues even if I am not comfortable writing.
- As a citizen, I want to upload a photo so that I can provide proof.

### Issue Discovery and Support
- As a citizen, I want to see nearby existing issues so that I do not create duplicates.
- As a citizen, I want to tap **This affects me too** so that I can support an issue without rewriting it.
- As a citizen, I want to add a comment or voice note so that I can contribute context.

### Staff Dashboard
- As an MP office analyst, I want to see ranked issues so that I know what to review first.
- As an analyst, I want to see a map of hotspots so that I can understand where demand is concentrated.
- As an analyst, I want to know why an issue is ranked highly so that I can justify action.
- As an analyst, I want to filter by category or geography so that I can explore the data quickly.

### Moderation
- As a moderator, I want to review flagged content so that spam or abuse does not affect rankings.
- As a moderator, I want to merge duplicates manually when needed so that issue threads stay clean.

## 12. Functional Requirements
### FR1 — Issue Submission
- User can submit an issue from a mobile-friendly form.
- Form supports text, voice upload, and optional photo.
- User can manually choose language or rely on auto-detection.
- User can pick a location on a map or enter locality text.

**Acceptance criteria**
- Submission succeeds on mobile and desktop.
- Voice file is stored and processed.
- Photo uploads are attached to the issue.
- Issue is stored in raw and processed forms.

### FR2 — AI Enrichment Pipeline
- System transcribes voice into text.
- System translates content into a standard internal language when needed.
- System classifies issue category.
- System extracts entities such as locality, institution, and issue type.
- System generates a concise summary.

**Acceptance criteria**
- Every issue receives a category, summary, and urgency estimate.
- Original language content remains accessible.
- Processing status is visible for debugging/demo.

### FR3 — Deduplication
- System compares new issue with existing issues using semantic similarity and location proximity.
- If a likely duplicate exists, the user is shown the existing issue and encouraged to support it.

**Acceptance criteria**
- Duplicate detection runs before publishing a new issue.
- User can choose existing issue instead of creating a duplicate.
- Duplicate confidence is stored.

### FR4 — Community Validation
- Each published issue supports one **This affects me too** action per user.
- Users can add comments and follow-up evidence.
- Comment counts and support counts update visibly.

**Acceptance criteria**
- Same user cannot upvote same issue multiple times.
- Comment submission supports text and optional voice/image.
- Support count appears on issue cards and details.

### FR5 — Ranking Engine
- System computes a priority score per issue.
- Score blends community demand, urgency, infrastructure gap, vulnerability, and recency.
- Dashboard shows both score and factor-level explanation.

**Acceptance criteria**
- Issues are sortable by score.
- Score updates after new upvotes/comments or periodic recalculation.
- Staff can see factor breakdown on details page.

### FR6 — Staff Dashboard
- Dashboard lists ranked issues.
- Dashboard includes category filters, search, and geography filters.
- Dashboard includes hotspot map.
- Dashboard includes issue detail drill-down.

**Acceptance criteria**
- Top issues visible at first load.
- Map pins or heat zones render properly.
- Detail panel shows summary, evidence, comments, counts, and score logic.

### FR7 — Moderation and Abuse Handling
- Flagged content enters review queue.
- Duplicate merge tool allows manual override.
- Basic rate limiting prevents spam.

**Acceptance criteria**
- Flagged content can be hidden from public view.
- Moderator can merge two issues into one thread.
- Repeated spam actions are blocked.

## 13. Non-Functional Requirements
- Mobile-first responsive UI.
- Basic accessibility with large tap targets and minimal-text flow.
- Near-real-time update of issue support counts.
- Reasonable performance for hackathon demo use.
- Clear fallbacks when AI processing is delayed.
- Logging for failed AI calls and submission errors.

## 14. Priority Score Definition
A transparent score is critical to trust and actionability.

### Proposed Formula
Priority Score = 30% Community Demand + 25% Infrastructure Gap + 20% AI Urgency + 15% Demographic Vulnerability + 10% Recency

### Inputs
- **Community Demand**: upvotes, unique reporters, comment activity.
- **Infrastructure Gap**: distance to nearest facility, known service deficit, public-data mismatch.
- **AI Urgency**: issue severity from text, voice, image, and comments.
- **Demographic Vulnerability**: indicators such as affected population or underserved locality.
- **Recency**: whether the issue is rising quickly.

### Requirement
The user interface must show the score factors in plain language, not only the final number.

## 15. UX Requirements
PRD best practices recommend linking to design explorations and wireframes rather than over-describing interactions in prose.[page:1]

### Citizen Flow
1. Open home screen.
2. Choose **Report an issue** or **See issues near me**.
3. Submit text/voice/photo.
4. If duplicate exists, see existing issue thread.
5. Tap **This affects me too** or add context.
6. Receive lightweight confirmation.

### Staff Flow
1. Open dashboard.
2. View ranked issue list and hotspots.
3. Filter by category/geography.
4. Open issue detail.
5. Review summary, evidence, counts, and score explanation.
6. Change status to under review / planned / resolved.

### UX Principles
- Minimal reading burden.
- Strong icon and button affordances.
- Hindi-first or bilingual-friendly text.
- One obvious primary action per screen.
- Clear success/error states.

## 16. Technical Approach
### Recommended Stack
- **Citizen web app**: React + Vite + Tailwind CSS
- **Dashboard**: React + TypeScript + Tailwind CSS
- **Backend API**: FastAPI or Node.js/Express
- **Auth/session**: Firebase Authentication or OTP-lite flow
- **Database**: Firestore for operational data, BigQuery for analytics
- **File storage**: Google Cloud Storage
- **Hosting**: Firebase Hosting + Cloud Run
- **AI services**: Gemini API / Vertex AI, Speech-to-Text, Translation API
- **Maps**: Google Maps Platform

### Why this stack
This stack aligns with the hackathon's recommended technologies, supports rapid prototyping, and is deployable enough to look pilot-ready.[web:12][web:20]

## 17. System Architecture
### High-Level Flow
1. Citizen submits issue.
2. Raw input stored.
3. AI pipeline runs transcription, translation, classification, entity extraction, and summarization.
4. Deduplication compares issue to current corpus.
5. New issue is created or user is redirected to existing issue.
6. Upvotes/comments enrich community demand signal.
7. Ranking engine recalculates issue score.
8. Dashboard updates for staff.

### Data Objects
#### Issue
- id
- title
- raw_text
- translated_text
- summary
- category
- location
- lat/lng
- urgency_score
- priority_score
- upvote_count
- comment_count
- status
- created_at

#### Comment
- id
- issue_id
- text
- voice_url
- image_url
- ai_note
- created_at

#### Upvote
- issue_id
- citizen_hash
- created_at

## 18. API Requirements
- `POST /issues/create`
- `POST /issues/comment`
- `POST /issues/upvote`
- `GET /issues/nearby`
- `GET /issues/:id`
- `GET /dashboard/issues`
- `PATCH /issues/:id/status`
- `POST /moderation/flag`

## 19. Analytics Requirements
Best-practice PRDs tie features to measurable hypotheses and KPIs.[web:31]

### Product Analytics
- Number of submitted issues.
- Duplicate redirection rate.
- Upvotes per issue.
- Comments per issue.
- Processing time per issue.
- Most common issue categories.
- Highest-demand geographies.

### Demo Analytics View
- Open issues.
- Rising issues.
- Top ranked issue.
- Avg. support per issue.
- Category distribution.

## 20. Dependencies
- Gemini / Vertex AI access.
- Speech-to-Text access.
- Translation API access.
- Maps API key.
- Seed dataset for one geography.
- Demo-ready issue samples and media.

## 21. Risks and Mitigations
| Risk | Impact | Mitigation |
|---|---|---|
| AI latency too high | Demo feels slow | Use async processing and seeded data for demo fallback |
| Duplicate detection weak | Poor UX | Use semantic + location similarity and manual override |
| Scope creep | MVP slips | Enforce in-scope vs out-of-scope sections |
| Low-quality public data | Weak ranking | Use one focused geography with curated sample datasets |
| Spam/abuse | Noisy results | Rate limits, moderation queue, basic safeguards |
| Too many features | Shallow demo | Focus on one clean flow and one dashboard story |

## 22. Open Questions
Strong PRDs maintain open questions rather than pretending every decision is resolved.[page:1][web:30]

- Which geography should be used for the final demo?
- Which 3 civic categories should be prioritized in the MVP?
- Should citizen support require OTP or remain anonymous with device/session hash?
- Should comments be public to all citizens or visible only in issue detail?
- Should the first demo include WhatsApp-style UI or only web?
- Which public datasets are easiest to clean and integrate before submission?

## 23. Launch / Demo Plan
- Seed 15–30 realistic issues for one geography.
- Show one fresh citizen voice submission.
- Demonstrate duplicate detection.
- Show **This affects me too** increasing support count.
- Add one comment with context.
- Show dashboard score update and hotspot map.
- End with issue status moving to **Under Review**.

## 24. Build Plan for Vibe Coding
This PRD is intentionally structured for fast implementation. For vibe coding, work in this order:

### Sprint 1 — Skeleton
- Set up citizen app and dashboard routes.
- Define data models.
- Add seeded issue list.
- Build issue cards and details page.

### Sprint 2 — Submission and AI pipeline
- Build text/voice/photo submission.
- Connect transcription, translation, classification, and summary.
- Store processed issue objects.

### Sprint 3 — Community layer
- Add dedupe flow.
- Add upvotes.
- Add comments.
- Update issue counts in real time.

### Sprint 4 — Dashboard intelligence
- Add ranking engine.
- Add filters and map.
- Add score breakdown.
- Add issue status workflow.

### Sprint 5 — Demo polish
- Improve copy and UI.
- Add moderation and rate-limit basics.
- Prepare final demo script.
- Record backup demo video.

## 25. What Success Looks Like
A successful MVP should let a judge immediately understand three things:
1. Citizens can report or support issues in a simple, inclusive way.
2. AI turns noisy inputs into clean, ranked issue intelligence.
3. The resulting dashboard is realistic enough for an MP office to pilot.

## 26. Collaboration Notes
Current PRD best practices emphasize team collaboration, iterative updates, and avoiding static, over-detailed specs that go stale.[page:1][page:2] This document should therefore be treated as a live build brief. Builders should update open questions, scope choices, API changes, and UI decisions as the prototype evolves.
