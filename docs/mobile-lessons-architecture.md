# Mobile lessons architecture (RN)

## Scope

- **Canonical content:** `PathwayLesson` rows via new learner JSON APIs — same hub/detail contracts as `/app/lessons` and `/app/lessons/[id]` (no parallel lesson DB, no marketing SEO routes touched).
- **Packages:** `@nursenest/mobile-shared` (types, fetch helpers, query keys, pagination + markdown chunk utilities, bookmark stubs). **App:** `apps/mobile` screens + React Query.

## Truthpack

`.vibecheck/truthpack/` was **not present** in this workspace clone; this document references **verified server routes and filenames in-repo** only. Do not invent product copy or tier names here.

## APIs (read path)

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/learner/pathway-lessons` | Paginated pathway hub rows + optional `progressByPathwaySlug` (subscriber only). Mirrors pathway branch of `/app/lessons`. |
| `GET` | `/api/learner/pathway-lessons/topics?pathwayId=` | Distinct `topicSlug` / topic labels for category chips (bounded `take`). |
| `GET` | `/api/learner/pathway-lesson?id=` **or** `pathwayId` + `slug` | Full `PathwayLessonRecord` JSON + `progressStatus` + `related[]` (includes `lessonId` when resolvable). |
| `POST` | `/api/lessons/pathway-progress` | Progress open/engage/complete — existing server contract; mobile calls `action: "open"` after detail load when progress UI is allowed. |

**Auth:** session cookie (`createJsonApiClient` + SecureStore cookie jar) — same model as other mobile learner calls.

**Non-subscriber:** list + detail return **403** `not_subscribed` (aligned with `/app/lessons` paywall for full pathway catalog).

**Legacy hub modes:** if the web hub would pick `content_items` / `legacy_content_map`, the list API returns **409** `pathway_list_unsupported` so native does not silently show the wrong inventory.

## Pagination & caching

- **Server:** offset pages with `page` + `limit` (same bounds as `parseLessonLibraryLimit` / `maxSafeOffsetPage` on web).
- **Client:** `@tanstack/react-query` `useInfiniteQuery` + `getNextPageParam` from `page` / `pageCount`. `staleTime` ~120s and `placeholderData` keep the hub stable while refetching.
- **Lists:** `FlatList` with `windowSize={7}` and `removeClippedSubviews` (no `@shopify/flash-list` dependency in this slice — add later if profiling demands it).
- **Offline / persist:** `EXPO_PUBLIC_ENABLE_QUERY_PERSISTENCE` + `src/lib/query-persistence.ts` remain **optional**; documented cache keys live in `lessonQueryKeys` (`packages/nursenest-mobile-shared/src/lessons-api.ts`). Do not persist full-catalog keys.

## Progress & entitlements

- **Rule:** UI may show row/detail progress **only** when `entitlement.hasAccess && entitlement.canShowLessonProgress` from API payloads — mirrored by `canShowPaidLessonProgressRow` in shared tests.
- **Never** fabricate completion; optimistic updates belong **after** confirmed `POST /api/lessons/pathway-progress` (not implemented as optimistic in v1).

## Resume

- **SecureStore keys:** `LESSON_RESUME_*` in `resume-keys.ts` — last pathway, slug, lesson id, scroll offset. Hub writes on row tap; detail updates scroll offset (throttled).

## Rich text / markdown

- **Choice:** section `body` strings rendered as **plain `Text`** with `splitMarkdownBodyIntoChunks` to limit re-renders — **no** `react-native-render-html` / markdown display dependency (keeps bundle lean per `AGENTS.md`). Clinical structure uses existing **structured sections** (`heading` + `body`) from `PathwayLessonRecord`.

## Bookmarks

- **Stub:** `createStubLessonBookmarkApi()` + `BOOKMARK_SECURE_STORE_PREFIX` — no backend route in-repo; TODO documented in `bookmarks.ts`.

## Manual QA (suggested)

1. Large lesson (many long sections) — scroll + chunk rendering.
2. Slow 3G — skeletons, pagination tail loading.
3. Offline — cached pages only; expect 401/403/network errors without cookies.
4. Paid vs free — progress pills hidden when API omits `canShowLessonProgress`.

## Risks

- **Payload size:** detail returns full `record.sections`; monitor memory on low-RAM Android.
- **409 hub mode:** accounts without pathway inventory need a product decision (native messaging vs forcing pathway onboarding).
- **Related navigation:** rows without `lessonId` resolve stay disabled (rare if DB row missing).

## Tests

- **Unit:** `packages/nursenest-mobile-shared` — Vitest (`npm run test`): pagination reducer, entitlement gate, markdown chunk splitter.

## Verification commands

- `npm --prefix packages/nursenest-mobile-shared run test`
- `npm --prefix apps/mobile run typecheck`
- `npm --prefix nursenest-core run typecheck:critical`
