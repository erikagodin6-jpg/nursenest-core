# Flashcards: legacy vs current (gap analysis)

**Legacy references:** `client/src/pages/public-flashcards.tsx`, `client/src/components/deck-views.tsx` (`DeckStudyLearn`, `DeckStudyTest`, `DeckHub`), `client/src/pages/flashcards.tsx` (embedded in tier test-bank), `server/sm2-engine.ts` + `/api/sm2/*`.

**Current app:** `/app/flashcards`, `/app/flashcards/[deckRef]`, `/app/flashcards/custom`, `/app/flashcards/weak-areas`; APIs under `/api/flashcards/*`; study UI in `components/study/active-study-session.tsx` and hub in `components/flashcards/flashcards-hub-client.tsx`.

## Legacy features / behaviors

| Area | Legacy |
|------|--------|
| Deck browse | Hub tabs (my/public/saved), search, sort, deck metadata, due badges, tier gating |
| Study vs test | **Learn** vs **Test** modes: test shows elapsed timer; learn focuses on self-rating |
| Card surface | Large single card, **tap/Space to flip**, then **progressive reveal** sections (answer → rationale → pearl) |
| Self-rating | Wrong / Unsure / Knew with **keyboard 1 / 2 / 3** (and arrows) and copy about spaced review |
| Session stats | Running **correct vs missed** counts in header |
| Retry | Cards marked missed could **reappear** in queue (`retry` flag) |
| Progress | Linear progress bar, index/total |
| End of session | Report view after deck study |
| SRS | SM-2 engine + `/api/sm2/*` (separate from simple flashcard-review) |

## Current features (before this restoration pass)

| Area | Current |
|------|---------|
| Deck browse | URL-synced filters, tags, pagination, stats/due summary, custom study builder |
| Study UI | `ActiveStudySession`: split layout (prompt + rationale sidebar), ratings, notes, star/save/confusing, completion summary |
| API | Deck study batching, `/review` with ratings mapped to SM-2 style scheduling in `lib/flashcards/spaced-repetition.ts` |
| Keyboard | Space/Enter reveal, arrows; **no digit shortcuts** |
| Learn vs test | **Not exposed** as separate modes on deck study route |

## Gaps addressed in implementation

| Gap | Restoration |
|-----|-------------|
| Legacy **card-first** interaction (single column, flip, progressive sections) | `ActiveStudySession` **`layout="card"`**: large tap target, `<details>` sections for answer/rationale/pearl, semantic token styling |
| **Learn vs test** | Query param **`?mode=test`** on `/app/flashcards/[deckRef]` → **elapsed timer** + mode label; hub deck card **Learn** / **Test** links |
| Session **rating counts** (knew / unsure / missed) | Shown in session header for all layouts |
| Keyboard **1 / 2 / 3** | Mapped to Incorrect / Unsure / Known after reveal |
| Content import proof | `import:legacy-client-flashcards` + **`import:legacy-full-content`** audit JSON |

## Still optional / follow-up (not blocking)

| Item | Notes |
|------|--------|
| Retry re-queue in-session | Legacy `retry` on card; current scheduling handled server-side via review API—could surface “back in queue” chip if API returns it |
| Full SM-2 dashboard parity | New app has due-summary + stats; legacy had richer SM-2 analytics page |
| 3D CSS flip | Legacy was mostly state swap; we matched behavior, not skeuomorphic flip |

## Routes updated

- `/app/flashcards/[deckRef]?mode=learn` (default)  
- `/app/flashcards/[deckRef]?mode=test`  

Deck grid CTAs now offer **Learn** and **Test** explicitly.
