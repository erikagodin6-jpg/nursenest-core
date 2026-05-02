# Content source-of-truth audit (NurseNest)

**Scope:** architecture read/write paths, DB, fallbacks, routes, duplication risk.  
**Not claimed:** full Part 3–8 completion, production deploy verification, or “OSCE SOURCE OF TRUTH VERIFIED” (requires live admin→DB→public render proof).

---

## Part 1 — Source-of-truth table

| Domain | Read path (live) | Write / admin path | DB model(s) | Filesystem / JSON fallback | Public route(s) | Learner route(s) | Admin edit | Admin → live? | Hidden / legacy duplication risk |
|--------|------------------|---------------------|-------------|------------------------------|-----------------|------------------|------------|---------------|-----------------------------------|
| **Lessons (pathway)** | `pathway_lessons` via loaders (`pathway-lesson-loader`, `loadPathwayLesson*`, catalog merge) | `/admin/pathway-lessons/*`, `/api/admin/pathway-lessons/[id]` | `PathwayLesson` | `catalog.json` / pathway JSON under `src/content/pathway-lessons/` when pathway has no/partial DB rows | `/{locale}/{slug}/{examCode}/lessons/...` | `/app/lessons/[id]` | `/admin/pathway-lessons/edit`, `/admin/pathway-lessons/[id]` | **Yes** when published row drives route | Catalog shards + DB can both exist; sync layer must stay explicit |
| **Flashcards** | Subscriber API `/api/flashcards` + Prisma `Flashcard` / decks; overlays | `/api/admin/flashcards`, AI drafts | `Flashcard`, `FlashcardDeck`, drafts | `readFlashcardsSubscriberListSnapshot` / published snapshots for resilience | Marketing surfaces vary | `/app/flashcards` (hub) | `/admin/ai/flashcards`, admin flashcard flows | **Yes** for promoted DB rows | Generated drafts tables until promoted |
| **Practice questions** | `/api/questions` + `ExamQuestion` (entitlements) | `/api/admin/questions`, import routes | `ExamQuestion` (+ related) | None as primary SoT for live bank | Practice hubs / question UI | `/app/...` practice flows | `/admin/questions` | **Yes** for DB-backed items | Import pipelines; mapping tables |
| **CAT pools** | CAT sessions + blueprint / question selection services (see diagnostics `cat-blueprint-sessions`) | Admin diagnostics, blueprint tooling | Session + `ExamQuestion` linkage (implementation-specific) | Blueprint JSON / configs where used | N/A (mostly in-app) | `/app/...` CAT / practice runner | `/admin/diagnostics/cat-blueprint-sessions` | Partially — needs explicit guard audit (Part 3.4) | Blueprint files if any |
| **OSCE stations** | **DB `osce_stations`** (`is_published = true` only); legacy bundles only if **`OSCE_LEGACY_FALLBACK=1`** and DB empty | `/admin/osce-stations`, `/api/admin/osce-stations`, `PATCH /api/admin/osce-stations/[id]` | `OsceStation` | Legacy merge only with flag + empty DB | `/{locale}/{slug}/{examCode}/osce/...` | `/app/osce`, `/app/osce/[stationId]` | `/admin/osce-stations`, `/admin/osce-stations/[id]` | **Yes** for published rows | Legacy bundles until migrated; avoid editing only JSON |
| **Study plan** | Derived from progress + pathway lesson bundle (`loadStudyPlannerContext`, practice runner) | No single “study_plan” table surfaced | `User` progress, `PathwayLesson` completion, etc. | Client-side composition | Marketing copy | `/app/study-plan` | Weak areas analytics | **Partial** — planner is computed, not one CRUD table | N/A |
| **Report card / progress** | Progress tables + APIs for dashboard | Admin analytics | `Progress*`, topic stats, etc. | None primary | N/A | `/app` dashboard / report surfaces | `/admin/analytics/*` | **Read-heavy**; edits are not “content” | Telemetry |
| **New Grad pathway** | Same pathway lesson architecture + `new-grad-transition-catalog.json` merge in `pathway-lesson-catalog-sync` | Same as pathway lessons | `PathwayLesson` + catalog JSON | `new-grad-transition-catalog.json` | Exam hub under New Grad pathway | `/app/lessons/...` | Same pathway admin | **Same as RN** when rows in `pathway_lessons` | Extra JSON catalog for transition content |

---

## Part 2 — OSCE (status vs request)

**Done (codebase):** `OsceStation` model, migrate script, public `GET /api/osce-stations`, admin `GET/POST`, `PATCH /api/admin/osce-stations/[id]`, learner + marketing pages resolve via `osce-stations-resolve.server.ts` (DB-first).

**This change set adds:** first-class `description`, `isPublished`, `domain`, `roleTrack`, `sourceLegacyPath` (Prisma + migration `20260502160000_osce_stations_metadata`); public `GET /api/osce-stations/[id]`; **admin list + edit** at `/admin/osce-stations` and `/admin/osce-stations/[id]`; published filter on public reads; **legacy fallback gated** by `OSCE_LEGACY_FALLBACK=1` when the table is empty; RBAC allowlist for support tier (`/admin/osce-stations`, `/api/admin/osce-stations`).

**Still not done (explicit gaps):**

- Playwright proof admin PATCH → HTML on `/app/osce/[slug]` (auth + env).
- Legacy fallback only when **`OSCE_LEGACY_FALLBACK=1`** and DB empty (default off in production).
- Full column parity with every legacy field as its own DB column (some remain in `extensions` JSON until a follow-up migration).
- Printing **OSCE SOURCE OF TRUTH VERIFIED** only after live render proof (per your rule — not printed here).

---

## Part 2.5 — `client/src/pages/simulators.tsx` (legacy Vite page)

**Observation:** ~36 inline `osceStations` entries with **MCQ `scenario`** blocks (not full OSCE checklist stations).

**Decision:** Treat as **practice-style clinical items**, not first-class `osce_stations` rows.

- **Primary recommendation:** import into **`ExamQuestion`** (or verified study pipeline) with metadata `source: "legacy-simulators-osce"`, `pathwayId` / tags for OSCE remediation, and optional `lessonSlug` links — so they participate in practice hub, rationales, and analytics like other MCQs.
- **Alternative:** store as `osce_stations.extensions.simulatorMcq` only if product wants them exclusively on OSCE surfaces — worse fit for MCQ-only UX.

**Wire live:** not implemented in this pass (no bulk import); tracked as follow-up.

---

## Parts 3–8 — Summary (not executed end-to-end)

| Part | Status |
|------|--------|
| **3** Lessons/flashcards/CAT/remediation unification | Requires dedicated audit PR: CAT guards, question↔lesson links, flashcard pathway joins — **not completed** |
| **4** Med-math / medication mastery | Prior work on `pathway_lessons` migration tooling exists; full curriculum + question bank port — **not completed** |
| **5** New Grad parity checks | Registry + catalog merge exist; automated “fail if no hub” tests — **not added** |
| **6** Allied framework | Audit-only recommendation: extend pathway registry report — **not completed** |
| **7** Route smoke matrix | Playwright suite expansion — **not run** in this session |
| **8** Build | `npm run typecheck` run below; full production build — **not claimed** |

---

## Commands to run locally

```bash
cd nursenest-core
npx prisma migrate deploy   # apply osce_stations + column migrations
npm run typecheck
npm run test:clinical-scenarios   # includes OSCE SOT contract when DB + table exist
```

---

## Central registry + CI (content architecture program)

Machine-readable contracts live in **`src/lib/content-source-of-truth/content-registry.ts`** with:

- `resolveContentRoutes()` in `resolve-content-routes.ts`
- Guard tests: `src/lib/content-source-of-truth/content-source-of-truth.contract.test.ts`
- `npm run content:source-of-truth:check` (also chained in `ci:verify` after `typecheck`)
- `npm run content:source-of-truth:reports` → `reports/content-source-of-truth-audit.{json,md}`
- Migration skeleton: `src/lib/content-migration/*`

**Final narrative:** `docs/content-source-of-truth-final.md` (companion).

---

*Last updated: audit + OSCE incremental hardening + SoT registry pass.*
