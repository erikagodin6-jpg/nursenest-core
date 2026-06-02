# NurseNest — system source of truth (canonical architecture)

**Audience:** engineers shipping features without duplicating storage, routes, or pipelines.  
**Scope:** production Next app (`nursenest-core/`), shared monolith (`client/`, `server/`), and compile-time tools (`tools/i18n/`, `script/`).  
**Related:** machine-readable registry in `nursenest-core/src/lib/content-source-of-truth/content-registry.ts` (run `npm run content:source-of-truth:check` where available).

---

## 1. Lessons (RN / NP / allied / new-grad lesson bodies)

| Layer | Canonical SoT | Notes |
|-------|----------------|-------|
| **Authoring / runtime body** | **`PathwayLesson`** (`pathway_lessons` in PostgreSQL) | Option B: learner detail resolves pathway rows first; `ContentItem` type `lesson` is **legacy bridge** + redirect when tags link a pathway id. See `nursenest-core/src/app/(student)/app/(learner)/lessons/[id]/page.tsx`. |
| **Read path (marketing + gates)** | **`pathway-lesson-loader.ts`** | DB published row + locale overlays + structural `publicComplete` gate; catalog JSON can bootstrap until DB exists. |
| **Merge inputs (not SoT over DB)** | `nursenest-core/src/content/pathway-lessons/*.json` + **`generated-indexes/`** | Catalog shards / build indexes — **inputs / artifacts**; DB wins when a row exists. |
| **Legacy** | `ContentItem` lessons + `legacy-content-map-lessons` | Fallback only; do not add long-lived bodies here. |

**Pathway metadata:** `nursenest-core/src/lib/exam-pathways/exam-pathways-catalog.ts` (+ segment data) and **`exam-product-registry.ts`** (`getExamPathwayByRoute`, `resolveExamPathwayFromMarketingHubSegment`). Marketing `{locale}/{hubSlug}/{examCode}/…` URLs resolve here.

---

## 2. Flashcards

| Layer | Canonical SoT | Notes |
|-------|----------------|-------|
| **Storage** | **`Flashcard`**, **`FlashcardDeck`** | Published + entitlement-scoped. |
| **APIs** | `/api/flashcards`, `/api/flashcards/decks/*` | Subscriber enforcement; educational overlays merged server-side. |
| **Marketing teaser** | `src/content/flashcard-samples.json` | Read-only samples. |

---

## 3. CAT (adaptive testing)

| Layer | Canonical SoT | Notes |
|-------|----------------|-------|
| **Practice / exam-sim math** | **`src/lib/exams/cat-engine.ts`** + **`cat-adaptive-policy.ts`** + **`cat-types.ts`** | Drives POST `/api/practice-tests` adaptive sessions (`practice-tests/cat-session.ts`). |
| **Session persistence** | Prisma `PracticeTest` + JSON adaptive state | Versioned state; see `cat-active-session-snapshot-policy.ts`. |
| **Study / analytics “CAT” layer** | **`src/lib/cat/*`** | Performance tracker, session analyzer — **parallel** to `exams/cat-engine`; do not duplicate selection logic across trees without an explicit merge plan. |
| **Monolith legacy** | `server/mlt-adaptive-engine.ts` | Vite-era simulation — **not** Next practice CAT SoT. |

**Question pool:** **`ExamQuestion`** with `questionAccessWhere` + pathway isolation (documented in `cat-adaptive-policy.ts`).

---

## 4. Practice exams vs practice tests

**Single backend SoT:** **`PracticeTest`** rows via **`POST /api/practice-tests`** (`src/app/api/practice-tests/route.ts`).  
UI routes **`/app/practice-tests`** and **`/app/practice-exams`** both exist; multiple clients post to the same API with different `x-nn-study-launch-surface` headers. Treat naming as **product**, not separate persistence.

---

## 5. ECG module

**Marketing modules:** `src/app/modules/ecg/**`, `modules/ecg-interpretation/**` — mostly static pages + redirects (e.g. `modules/ecg/page.tsx` → `basic/lessons`).  
**Learner:** `/app/ecg-video-quiz` and linked study surfaces.  
**Admin:** `/admin/modules/ecg`.  
No single `EcgContent` table analogous to `PathwayLesson` — **route + component family**.

---

## 6. Lab modules

**SoT:** **`src/lib/labs/labs-engine.ts`** + **`labs-route-loader.ts`** consumed by **`/app/labs/[category]/[slug]`**. Structured TS corpus + per-lesson questions/flashcards.  
**Admin:** `/admin/modules/lab-values`. Not migrated to `PathwayLesson` unless a project explicitly does so.

---

## 7. Adaptive systems (umbrella)

- **Production adaptive practice / NCLEX sim:** `lib/exams/cat-engine` + practice session code.  
- **Readiness / study analytics:** `lib/cat/*`.  
- **Legacy MLT:** `server/mlt-adaptive-engine.ts`.

Extend **one** engine per feature; do not fork selection algorithms.

---

## 8. Blogs

**SoT:** **`BlogPost`** + admin publish/generation pipelines (`blog-article-generation-pipeline.ts`, `blog-control-panel-generation.ts`).  
**Static fallback:** `blog-static-posts.*` — DB-absent / build only per registry.  
Generated SEO must land on persisted rows before counting as live.

---

## 9. Localization / i18n

**Canonical doc:** `docs/i18n-architecture.md`.  
**Sources:** `tools/i18n/source/i18n-*.ts`, `tools/i18n/marketing/*` → **`npm run i18n:compile`** → merged `client/public/i18n/` + `nursenest-core/public/i18n/`.  
**DB translations:** separate Prisma tables for CMS fields.  
**Lesson overlays:** `public/i18n/educational-overlays/` + runtime merge.  
**Scoped tables:** e.g. pre-nursing — intentional exception.

---

## 10. SEO metadata

- Per-route **`generateMetadata`** in App Router.  
- **Sitemaps:** `src/app/sitemap.xml/route.ts`, `sitemap-allied.xml/route.ts`, `sitemap-new-grad.xml/route.ts`.  
- **Components:** `components/seo/*`, breadcrumbs — keep aligned with marketing canonical URLs.

---

## 11. When in doubt

1. `content-registry.ts`  
2. `docs/legacy-restoration-map.md`  
3. `reports/runtime-architecture-map.md`  
4. `reports/critical-production-surfaces.md`


---

## 12. Auth, signup, and onboarding (session SoT)

| Concern | Canonical SoT | Notes |
|---------|----------------|-------|
| **Session / learner auth** | NextAuth + `getProtectedRouteSession` patterns under `src/lib/auth/*` | DB-backed roles for staff; do not trust JWT alone for admin. |
| **Marketing signup links** | Routes like `/signup`, `/login` linked from marketing pages (e.g. pricing, questions landings) | CTAs are marketing-owned; auth behavior lives in auth lib + API routes. |
| **Learner onboarding gate** | `User.onboardingCompletedAt` checked in `src/app/(student)/app/(learner)/page.tsx` and `start-studying/page.tsx` → redirect **`/app/onboarding`** | Canonical learner onboarding UI: `src/app/(student)/app/(learner)/onboarding/page.tsx` + client. |
