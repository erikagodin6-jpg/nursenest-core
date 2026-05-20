# NurseNest

### Overview
NurseNest is an adaptive learning platform designed for nursing and allied health students across 17 specializations. Its primary purpose is to deliver comprehensive educational resources, advanced exam preparation (e.g., NCLEX, REX-PN), and detailed performance analytics. The platform leverages AI for content generation to foster clinical reasoning, nursing knowledge, and critical thinking. The vision is to revolutionize nursing education, improve patient care outcomes, and establish NurseNest as a leader in health education technology.

### User Preferences
- Preferred communication style: Simple, everyday language.
- Admin accounts use JWT-based authentication (no hardcoded admin users).
- Copyright must show current year dynamically (uses `new Date().getFullYear()`).
- NO normal lab values on lesson pages - only abnormal clinical findings.
- Content depth: Multi-paragraph cellular/molecular pathophysiology, detailed drug MOA at receptor level.
- Scope enforcement: RPN "monitor/report/administer as ordered," RN protocol-based, NP "order/prescribe".
- Regional content: CA shows CAD prices/Canadian labs, US shows USD/US values.
- NCLEX disclaimer: NurseNest is NOT affiliated with NCLEX, NCSBN, CNO, or any regulatory body.
- Copy protection: content cannot be easily copied/screenshotted.

### System Architecture
NurseNest utilizes a React frontend (TypeScript, Wouter, shadcn/ui, Tailwind CSS v4) with Vite, and an Express 5 backend (Node.js, TypeScript). Data management is handled by TanStack React Query through a RESTful API, with storage in PostgreSQL using Drizzle ORM. The UI includes 24 themes, semantic CSS tokens, and DM Sans typography.

Key features encompass a database-driven subscription model with regional pricing, tiered access, Stripe-based lifetime purchases, and free trials. The platform offers interactive learning modules, a mock exam engine employing stratified random sampling, and a comprehensive admin dashboard. AI integrations, managed by a centralized AI Provider Router, power functionalities such as blog automation, an Adaptive CAT Engine, Pass Probability Projection, a Next Best Action Engine, an AI Tutoring Assistant, and content generation with quality gates. Exam blueprints are database-driven, content is categorized by body system, and supports Next Generation NCLEX (NGN) question types, partial credit scoring, and a Spaced Repetition System. User access is dynamically controlled by subscription tier.

Core architectural patterns and components include:
- **Learning & Exam Preparation**: Features like flashcards, question banks, adaptive flashcards, clinical vignette generation, and a mock exam engine with CAT and practice modes.
- **AI-Powered Study & Content**: AI study coaching, course generation, exam date planners, a context-aware AI tutoring assistant, and a bulk question bank orchestrator.
- **Content & SEO Infrastructure**: An allied health encyclopedia, an SEO lesson engine, programmatic SEO, multilingual SEO and translation capabilities, and a database-driven multi-domain sitemap.
- **User Experience & Engagement**: A dashboard lifecycle command center, a global problem reporting system, IndexedDB-based offline study, and LocalStorage-based popup suppression.
- **Multi-Profession Support**: A dynamic framework for adding new healthcare professions with specialized navigation and content.
- **Database Safety & Management**: PostgreSQL with Drizzle ORM, an EnvironmentAwareContentWriteService, and a comprehensive Backup, Export & Restore Framework.
- **Content Integrity Engine**: Automated scanning, AI auto-repair, pre-publish validation, and a manual review queue to maintain content quality.
- **Explanation Engine**: A unified system for structured explanation storage with AI-powered batch generation and review.
- **Exam Readiness Predictor Engine**: Provides readiness scores, pass probability, and personalized recommendations.
- **Unified Question Schema & Country Adaptation**: `exam_questions` table extended for international fields, filtered by country, language, and licensing body.
- **Multilingual Content Management**: AI-powered batch translation of content with dedicated translation tables and build-blocking validation.
- **Taxonomy Protection System**: Strict taxonomy validation and normalization for content generation.
- **Content Publishing Audit**: Admin system for audit reports, quality fixes, coverage, and paywall enforcement.
- **CAT Exam Resilience System**: Hardened CAT question pool pipeline with diagnostic logging, normalized response contracts, and a graceful degradation chain.
- **Cross-Platform REST API**: Dedicated route files for test banks, CAT exam sessions, enhanced mock exam and lesson endpoints, enforcing auth, entitlement/tier gating, analytics logging, and idempotency protections.
- **Subscription & Entitlement System**: Dedicated `user_subscriptions` table, with auth endpoints managing user authentication and entitlements, and Stripe webhooks updating subscription status.
- **Platform Resilience System**: Enterprise-grade infrastructure providing circuit breakers, feature flags, kill switches, health checks, rate limiting, load shedding, self-healing, emergency mode, and entitlement caching.
- **Memory Protection & Auto-Recovery System**: RSS-based memory monitoring with configurable thresholds, hard-capped in-memory stores, and load shedding middleware.
- **Alert Flood Prevention & Scaling Safety**: Global AlertCoordinator for centralized alert email sending with deduplication and rate limiting.
- **Production Incident Monitoring System**: Unified monitoring and alerting via `server/incident-monitor.ts` with structured logging, deduplication, and notification hooks.
- **Incident System & Correlation Engine**: Structured incident management with CRUD operations, timeline tracking, and a correlation engine that scores recent changes against incident start times.
- **Performance Protection System**: Production-grade performance instrumentation providing per-route response time metrics, slow DB query logging, server-side in-memory TTL caching, statement-level query timeouts, route priority tiers for load shedding, and an admin performance dashboard.
- **Deployment Protection & Self-Healing**: Blue-green deployment health gate with post-deploy monitoring, auto-rollback alerts, and a deploy freeze mechanism.
- **Cross-Platform Auth API**: Unified JWT-based auth for web and mobile with consistent response shape, covering login, registration, token refresh, logout, entitlements, profile management, and password recovery.
- **Admin Security**: JWT-only admin auth, role-based access control, CSRF protection, rate limiting, re-auth/confirmation tokens for sensitive operations, and enhanced audit logging.
- **Last-Known-Good Content Versioning**: Immutable versioning system for premium content with automatic failover and admin restore.
- **Release Gate API**: Pre-deploy and pre-publish safety checks with override audit logging.
- **Content Health Score Engine**: 0-100 scoring engine with per-dimension breakdown for content items.
- **VIP Subscriber Prioritization**: Middleware that prioritizes paid subscriber requests under high load.
- **Chaos Testing & Disaster Recovery**: Configurable chaos engine with 15 failure scenarios, DR readiness scoring, backup restore dry-run, and manifest generation.
- **Production Recurrence Prevention System**: Resource budget enforcement, architecture boundary enforcement, auto-containment runbooks, and nightly integrity audit with auto-quarantine.
- **Admin Reliability Dashboard**: Unified reliability monitoring dashboard with summary stats and actionable controls.
- **Data Migration & Auto-Cleanup System**: Versioned migration framework with up/down SQL scripts, dry-run preview, validation checks, automatic rollback, and scheduled auto-cleanup jobs.
- **Observability, Telemetry & Revenue Protection**: Behavioral telemetry service, time-travel debugging, and a revenue protection dashboard.
- **Exam Load Failure Recovery Pipeline**: Multi-stage client-side recovery for exam loading failures, with server-side incident storage and per-question error boundaries.
- **Content Quarantine System**: Auto-quarantine of critical non-auto-fixable content issues during scheduled scans with admin UI for management.
- **Subscriber Rescue & Refund Prevention**: Admin tools for subscriber retention including communication template management, rescue actions, and a refund prevention dashboard.
- **Cross-Platform Subscription & Entitlement Sync System**: Unified subscription management with a canonical `subscriptions` table, mobile-ready entitlement API, idempotent webhook processing, and structured analytics.
- **Cross-Platform Learning System API**: Unified `/api/v1/` REST API shared by website and mobile app, covering test banks, CAT/adaptive exams, mock exams, lessons, dashboard summary, analytics event logging, and question history.
- **Startup Stabilization**: All seed operations removed from the server startup path, with deferred startup for web processes.
- **Worker Process Separation**: Background work fully isolated into `server/worker.ts` via `PROCESS_ROLE=worker` env var.
- **Server Bundle Optimization**: esbuild bundles server to ~4.8MB via aggressive externalization, with dynamic imports for worker-only modules.
- **Bounded In-Memory Caches**: All in-memory Maps use `BoundedMap` with LRU eviction and optional TTL, with defined caps.
- **Platform Stability Hardening**: All storage list queries capped, kill switches wired to feature flags, exam start endpoints have in-memory idempotency keys.
- **Three-Tier Load Shedding**: Implements Warning (70% RSS), Protection (80%), and Critical (90%) tiers to manage system load.
- **System Hardening Module**: `server/system-hardening.ts` provides production-grade protections including configurable DB statement timeouts, per-user exam start rate limiting, and AI service timeout wrappers.
- **Paginated Exam Delivery**: `server/exam-delivery.ts` provides a paginated exam API for starting, retrieving questions, requesting rationales, answering, and submitting exams.
- **Byte-Size Bounded Cache**: `server/performance.ts` memoryCache has LRU eviction with both entry count and byte-size caps.
- **Memory Observability**: `server/memory-observability.ts` provides ring buffer trend tracking, per-route heap/RSS deltas, and RSS baseline drift detection.
- **Enhanced Critical Mode**: Memory monitor clears performance cache and stops synthetic monitoring when entering critical mode.
- **Lazy NurseNest Lite**: Prebuilt payloads are lazily initialized on first access.
- **Frontend Bundle Optimization**: Admin routes are lazy-loaded and wrapped in error boundaries; vendor chunking is expanded.
- **Flashcard Platform Availability**: localStorage-backed caching with 30min TTL, static emergency nursing deck, and per-section FlashcardErrorBoundary isolation.
- **Exam Submission Resilience**: Async finalization architecture in `server/exam-finalization.ts` with state machine (in_progress→completion_requested→processing→completed/failed). Incremental per-answer saves via `/api/mock-exams/:attemptId/answer`, lightweight `/complete` endpoint (no answer payload), `/result` polling endpoint. Server-side correctness computation from `exam_questions.correct_answer`. Frontend shows processing overlay during finalization.
- **Question Type Fallback System**: Universal type safety in `client/src/lib/question-type-safety.ts`. Safe type mapping normalizes all question types to `multiple-choice` or `multiple-select`. Unknown types fall back to MCQ rendering (never block exam). `QuestionGuard` applies normalization at render boundary. `QuestionErrorBoundary` auto-skips crashed questions after 5s. Generator type enforcement in `server/qbank-generator.ts` forces disallowed types (drag_drop, hotspot, ranking, etc.) to MCQ at ingestion. Telemetry logged to `/api/telemetry/unsupported-question-types`.

### External Dependencies
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Payment Processing**: Stripe, PayPal SDK
- **AI/Content Generation**: Centralized AI Provider Router (integrating OpenAI, Ollama, vLLM, LM Studio, Anthropic)
- **Object Storage**: Replit Object Storage
- **Email**: Resend
- **SMS**: Twilio