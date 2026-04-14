# Parity audit summary (evidence-based)

Generated: 2026-04-14T17:36:13.521Z

## Methodology

- **Registry**: `listPublicExamPathways()` in `src/lib/exam-pathways/exam-product-registry.ts`.
- **Catalog**: `getCatalogPathwayLessonsSync(pathwayId)` (bundled JSON + scoped gold + allied + new-grad merge).
- **DB**: **Skipped** — `DATABASE_URL` not configured or query failed; bank/deck counts are null in JSON.
- **Structural bar**: `structuralQuality.publicComplete` from `evaluatePathwayLessonStructuralGate` on normalized catalog lessons.

## Answers (from this run)

### 1. Country + exam + locale combinations that are routeable but lack content

**Definition used**: Public registry pathway where **catalogLessonCount = 0** AND **published DB lessons (locale en) = 0** (when DB available).

See `routeableButNoLessonOrDbContent` in `data/audit/country-exam-locale-parity.json`.

- `ca-np-cnple` → /canada/np/cnple/lessons
- `us-np-agpcnp` → /us/np/agpcnp/lessons
- `us-np-pmhnp` → /us/np/pmhnp/lessons
- `us-np-whnp` → /us/np/whnp/lessons
- `us-np-pnp-pc` → /us/np/pnp-pc/lessons

**Important**: Marketing UI locales (`MARKETING_LOCALE_CODES`) add a **language prefix** for many marketing pages; exam hub paths still use **`us` / `canada`** as the first segment in `(default)/[locale]/[slug]/[examCode]` (that `locale` param is **country**, not UI language). Localized *lesson bodies* are mostly **EN** in catalog; DB may store other locales separately.

### 2. Legacy vs new: still missing at scale

Evidence: `data/audit/unimported-legacy-content.json` — **~4084** legacy lesson keys not on current catalog/master snapshots (see file `counts.missingFromCurrentSnapshots`). This is **not** a claim of 1:1 slug parity; it is an inventory delta.

### 3. Published / catalog lessons: non-empty but structurally incomplete

Lessons with **approxWords ≥ 80** in combined section corpus but **`publicComplete: false`**: **539** (see `incompleteNonEmptyShell` in `lesson-content-completeness-audit.json`, capped).

### 4. Flashcard / question pathways: code vs public UI

- **Questions**: pools are DB-backed; pathway filters use registry `contentExamKeys` + entitlements. No single “pathway” column on `exam_questions`.
- **Flashcards**: **`/flashcards`** lists only decks matching `publicMarketingFlashcardDeckWhere` (published + **PUBLIC_PREVIEW** + cards). **Subscriber-only** or **HIDDEN** decks, or decks with **0** published cards, are **not** shown on the public hub even if rows exist.

See `flashcard-content-completeness-audit.json`.

## Files changed

- `scripts/audit/generate-full-parity-audit.mts` (this generator)
- `data/audit/*.json` + `data/audit/parity-summary.md` (outputs)

## Verification

Run from `nursenest-core/`: `npm run typecheck`

