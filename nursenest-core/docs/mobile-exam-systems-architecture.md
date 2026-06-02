# Mobile exam systems architecture (Flashcards, Practice exams, CAT)

## Truthpack

The `.vibecheck/truthpack/` directory is **not present in this workspace clone**. This document references **verified server routes and handler files in `src/app/api`** only. Tier names and marketing copy are **not invented** here.

## Goals

- **Server-authoritative** entitlements, pathway scoping (RN/RPN/NP), question pools, CAT / adaptive selection, and scoring.
- Mobile is a **thin client**: display, local timer/elapsed cache, debounced submits, React Query caches, SecureStore resume keys.
- **No** duplicate question selection, mock pools, or client-side IRT/CAT selection.

## Shared package (`packages/nursenest-mobile-shared`)

| Module | Role |
| --- | --- |
| `mobile-api-client.ts` | `fetch` wrapper: bearer token, optional `pathwayId` on deck list, **no retry on 401/403**, GET-only retry on transient 5xx. |
| `study-surface-headers.ts` | `x-nn-study-launch-surface` values required by `validateFlashcardsPostLaunchRequest` / `validatePracticeExamPostLaunchRequest` (`src/lib/learner/study-product-route-contract.ts`). |
| `flashcards-api.ts` | Typed helpers for deck list, study batch, deck/card review POSTs. |
| `practice-tests-api.ts` | List/create/get/patch practice tests; per-index question fetch. |
| `cat-np-api.ts` | NP-only `/api/cat/np/*` + `GET /api/questions/[id]` hydration. |
| `cat-advance-patch.ts` | Copy of web `buildCatAdvancePatchBody` contract for `PATCH` `cat_advance`. |
| `cat-practice-reducer.ts` / `cat-np-reducer.ts` | Pure UI phase machines driven **only** by server JSON. |
| `rationale-visibility.ts` | Mirrors `GET .../question` teachingExposure rules — client uses for labels and `includeRationale` on NP question hydration. |
| `entitlement-gate.ts` | Maps `401`/`403` to hard-stop UX. |
| `session-keys.ts` | SecureStore key naming. |
| `architecture-hooks.ts` | Offline queue / push / recommendations **ports** (no implementations). |

## Flashcards

### Endpoints

- `GET /api/flashcards/decks` — paginated; supports `pathwayId`, `page`, `pageSize` (`src/app/api/flashcards/decks/route.ts`).
- `GET /api/flashcards/decks/[deckRef]/study` — bounded batch (`limit`, `reset`, `shuffle`); **session cursor lives in DB** (`flashcardStudySession`), not a separate opaque id in JSON (`src/app/api/flashcards/decks/[deckRef]/study/route.ts`).
- `POST /api/flashcards/decks/[deckRef]/review` — deck-scoped SM-2 progress (**preferred** for deck study coherence).
- `POST /api/flashcards/cards/[cardId]/review` — multi-deck/custom paths (`src/app/api/flashcards/cards/[cardId]/review/route.ts`).

### Mobile behavior

- Pathway filter: query `pathwayId` from mobile store (shared client appends on deck list when absent).
- **Swipe UX** (`apps/mobile` `FlashcardStudyScreen`): `react-native-gesture-handler` + Reanimated; ratings map to server enums (`again`, `good`, etc.).
- **Resume**: SecureStore key `flashcardDeckRefCursorKey` stores last known `{ cursor, queueLength }` for crash UX; **source of truth** remains server session row.

## Practice exams (linear + CAT via practice-tests)

### Endpoints

- `GET /api/practice-tests` — bounded list (`take: 40` server-side) (`route.ts`).
- `POST /api/practice-tests` — create/resume contracts; CAT uses `selectionMode: "cat"` and related fields (`route.ts` Zod schema).
- `GET /api/practice-tests/[id]` — metadata; `hydrate=full` is optional and can be large — **mobile defaults to minimal** (`[id]/route.ts`).
- `GET /api/practice-tests/[id]/question?index=` — **one item at a time** (`[id]/question/route.ts`).
- `PATCH /api/practice-tests/[id]` — `save` \| `complete` \| `abandon` \| `cat_advance` \| `linear_commit` (`[id]/route.ts`).
- `GET /api/practice-tests/[id]/cat-study-review` — CAT study-mode review payload when applicable (`cat-study-review/route.ts`).

### Rationale & performance UI

- Server sets `teachingExposure` from config (see `question/route.ts`). Mobile **must not** fabricate topic breakdown charts: only render fields present on `results` / `teachingReview` when `GET` returns them.
- If a statistic is missing, **hide** the widget (current mobile screens are minimal stubs).

### CAT (RN/RPN style via practice-tests)

- **Identical** payload sequence as web `practice-test-runner-client.tsx`: build answers map, `PATCH` with `action: "cat_advance"` using `buildCatAdvancePatchBody`.
- **Never** interpret `adaptiveState` for selection — only display server-returned state if needed.

## NP CAT (`/api/cat/np/*`)

- `POST /api/cat/np/session` — creates `practiceTestId` + returns **metadata shell** for `firstQuestion` (`session/route.ts`).
- `POST /api/cat/np/answer` — advances engine; returns `nextQuestion` metadata or completion (`answer/route.ts`).
- `GET /api/cat/np/analysis?practiceTestId=` — post-run results (`analysis/route.ts`).
- **Full stems**: `GET /api/questions/[id]` with `includeRationale` only when policy allows (test mode → omit until complete + analysis).

## Auth & entitlements

- APIs use `requireSubscriberSession` / `auth()` patterns (`src/lib/entitlements/*`).
- Mobile must attach **real** session material (Bearer from native handoff or `credentials: 'include'` for cookie-based dev). `EXPO_PUBLIC_NN_BEARER` is **dev-only** convenience.
- **403** → upgrade / pathway entitlement UI — no client bypass.

## Architecture hooks (future)

- Offline review queue / push / recommendations: see `src/lib/mobile-native/*` and `architecture-hooks.ts` — **interfaces only** in this prompt.

## Risks & web-only gaps

- **Linear / tutor** practice UI on mobile is intentionally thin; full review navigation and `linear_commit` UX remain web-first until spec’d (`PracticeRunnerGateScreen`).
- **NP CAT** requires NP pathway entitlement server-side; heuristic UI checks are not a substitute for server 403.
- **Marketing locale / educational overlays** use cookies on web (`getMarketingLocaleFromRequestCookie`); native should add explicit locale header policy when product defines it (not invented here).

## Testing

### Automated (shared package)

- `npm -w @nursenest/mobile-shared run test` — session keys, rationale flag, entitlement gate, CAT reducers.

### Integration (manual / future CI)

- **Crash recovery — practice CAT**: force-kill app mid-session → relaunch → open same `practiceTestId` from list → confirm `GET` session `IN_PROGRESS` and `GET question` aligns with `cursorIndex`.
- **NP CAT continuation**: after answer network loss, verify server idempotency expectations (`409` on duplicate answer id) and user messaging.

## File map

| Area | Path |
| --- | --- |
| Mobile app shell | `apps/mobile/App.tsx`, `apps/mobile/src/pathway-context.tsx`, `apps/mobile/src/api-context.tsx` |
| Flashcards UI | `apps/mobile/src/screens/FlashcardListScreen.tsx`, `FlashcardStudyScreen.tsx` |
| Practice / CAT UI | `apps/mobile/src/screens/PracticeHubScreen.tsx`, `PracticeRunnerGateScreen.tsx`, `CatPracticeRunnerScreen.tsx`, `CatMenuScreen.tsx`, `NpCatScreen.tsx` |
| Shared client | `packages/nursenest-mobile-shared/src/*` |
