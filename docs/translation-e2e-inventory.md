# End-to-end translation inventory (NurseNest)

This document classifies **where user-facing text lives**, what is **already wired for localization**, and what **full linguistic coverage** requires beyond engineering work.

## 1. Canonical architecture (single runtime model)

| Layer | Source of truth | Runtime |
|-------|------------------|---------|
| **Global UI + marketing** | `tools/i18n/source/i18n-*.ts`, `tools/i18n/marketing/marketing-en.json` + locale overlays | Merged to `public/i18n/{locale}.json`; Next uses `loadMarketingMessages` / `MarketingI18nProvider`; APIs use cookie `nn_marketing_locale`. |
| **Pathway marketing lessons** | `nursenest-core/src/content/pathway-lessons/catalog.json` (English) | Server-only loader; **non-English text** = file overlays + DB (see below). |
| **Exam questions (subscriber flows)** | PostgreSQL `exam_questions` (canonical English for grading) | **Display** strings merge **file** `public/i18n/educational-overlays/{locale}/questions.json` + **DB** `educationalTranslationOverlay` (`EXAM_QUESTION`). Grading uses canonical fields. |
| **Flashcards** | PostgreSQL `Flashcard` / `FlashcardDeck` / tags | **Display** merge file `flashcards.json` + DB overlays (`FLASHCARD_*`). |
| **Legacy monolith lessons** | TS modules under `client/src/data/lessons/`, CMS/DB in some flows | Separate from pathway catalog; see §6. |
| **Pre-nursing** | Route-scoped tables (`pre-nursing-i18n`) | Intentionally separate per `docs/i18n-architecture.md`. |

**No second translation runtime:** educational content uses **stable IDs** (question id, lesson `pathwayId:slug` or `slug`, deck/card/tag ids) with **overlay payloads**, not duplicate scoring rows.

## 2. Classification of surfaces

### Already translatable (keys + wiring)

- **Marketing / learner shell:** `nav.*`, `footer.*`, `learner.*`, paywall/subscription keys in merged JSON (subject to marketing canonical key sets and overlay normalization).
- **RTL / `lang`:** `MarketingI18nProvider` sets `document.documentElement.lang` and `dir` for RTL locales (`marketing-locale-policy`).

### Structured file overlays (educational)

- **Location:** `nursenest-core/public/i18n/educational-overlays/<locale>/`
  - `lessons.json` — pathway lesson patches.
  - `fragments/*.json` — optional splits; **runtime-merged** (deep merge per lesson key) with `lessons.json` via `mergeLessonOverlaysFromFragments` in `educational-content-overlay.ts`.
  - `questions.json` — `ExamQuestion.id` → stem/options/rationale fields for **display**.
  - `flashcards.json` — `decks` / `cards` / `tags` maps.

### DB-backed overlays

- **Model:** `EducationalTranslationOverlay` (`educationalTranslationOverlay` in Prisma) with `sourceKind`, `sourceId`, `locale`, `payload`, `status`.
- **Merge order:** File bundle first, then DB published rows (DB wins per id), implemented in `educational-translation-db.ts`.

### Hardcoded English (high volume)

- **Legacy Vite `client/` pages** (e.g. question bank UI strings, some errors): migrate toward `t()` / shared keys over time; many flows are duplicated or bridged to Express APIs.
- **Server API error strings** (e.g. “Try again shortly”): often English-only; product may map to i18n keys in a later pass.
- **Embedded clinical corpus** in `client/src/data/lessons/*.ts`: English-only source; localization requires **content pipeline** (extract keys, overlays, or DB), not a single JSON file.

### Locale-aware but incomplete

- **All non-English locales** until overlays exist for **every** visible question, lesson section, and flashcard that the user can open: UI may be translated while **stems/bodies** still English (expected until overlays are filled).

### Missing locale files

- **Educational overlays** are **sparse by design** until content ships: empty or absent files = English display for that content type.

### Structurally blocked (without larger refactors)

- **Duplicated app surfaces** (Next learner vs Vite client): two bundles to align on keys.
- **CAT / scoring internals:** must remain locale-agnostic; only **presentation** layers may wrap localized strings.

## 3. How each content type is localized

### Lessons (pathway catalog)

1. Loader reads `catalog.json` → `PathwayLessonRecord`.
2. `applyPathwayLessonEducationalOverlay(lesson, locale, pathwayId, dbBundle)` merges file + DB lesson overlays.
3. Slugs and routing **unchanged**; only display fields patch.

### Questions

1. API loads rows from Prisma/SQL.
2. `mergeQuestionApiPayload` / `applyQuestionEducationalOverlayForDisplay` apply overlays; `displayOptions` when option count matches; **correct answer indices** unchanged.

### Flashcards

1. API loads decks/cards from DB.
2. `applyFlashcardCardOverlay` + merged bundle from file + DB.

## 4. Operational commands

| Command | Purpose |
|---------|---------|
| `npm run i18n:compile` | Regenerate merged UI JSON for all locales. |
| `npm run i18n:validate` | Key parity / empty warnings for UI bundles. |
| `npm run i18n:report:educational` | Writes `reports/educational-translation-coverage.json` (file overlay key counts vs catalog size). |
| `nursenest-core/scripts/merge-educational-lesson-fragments.mjs` | Optional: flatten `fragments/` → `lessons.json` for repos that prefer a single committed artifact (runtime merge makes this optional). |

## 5. Definition of “complete” vs realistic delivery

**Engineering “complete”** means: every surface **respects** locale cookies, merges overlays safely, does not break grading, and exposes **auditable** coverage gaps.

**Linguistic “complete”** for 20+ locales requires **thousands of clinically reviewed strings** for questions, lessons, and cards. That is a **content + medical QA** program, typically fed by:

- Phased overlay authoring (priority pathways/exams first).
- Optional MT with **mandatory** clinical review for patient-facing explanations.

**Protected brand tokens** (e.g. NCLEX, RN, PN) are left as in policy unless product specifies transliteration.

## 6. Admin scope

Admin tooling is **out of scope** unless already localized; do not block learner/marketing work on admin copy.

## 7. Remaining gaps (honest summary)

- **Full sentence-level parity** for all `exam_questions` and all pathway lessons across all marketing locales: **not achievable by code alone**; requires populated `questions.json` / `lessons.json` (and/or DB overlays) per locale.
- **Monolith legacy lesson TS corpus:** not automatically covered by pathway overlays; needs a dedicated migration plan if parity is required there.
- **API hardcoded errors:** should move to keyed messages for full UI language consistency.

Use `reports/educational-translation-coverage.json` after adding overlays to track **file-level** progress; DB overlay counts require SQL or admin diagnostics (`/admin/i18n`, server translation audit tools).
