# Pre-developer cleanup audit (dead / duplicate / stale)

**Method:** Heuristic review (grep, script inventory, known parallel loaders). **Not** automated knip/depcheck. No files were deleted in this pass.

## Safe to remove now

_None recommended without owner sign-off._ The repo carries intentional legacy (`src/legacy/`), migration scripts, and content generators that look "unused" but are run ad hoc.

## Should not remove

| Item | Reason |
|------|--------|
| `server/`, root Vite/client paths | May still be referenced by ops or root `package.json` scripts. |
| `nursenest-core/src/legacy/` | Restoration source per `legacy-restoration.mdc`. |
| `expand:*` / `content:*` / `blog:*` scripts | Content pipeline and recovery. |
| Parallel lesson loaders | Often pathway-specific wrappers—not duplicate dead code. |
| Replit import / `stripe-replit-sync` | Migration history. |

## Needs human review

| Finding | Suggested action |
|---------|------------------|
| Many `verify:*` / `audit:*` scripts | Catalog CI-required vs optional. |
| Root vs `nursenest-core/package.json` | Confirm DO build uses `nursenest-core/`. |
| Typecheck failures | See `pre-developer-check-results.md`. |
| Admin printables route | Prisma `PrintableProductUpdateInput` drift. |
| OSCE pages / `osce-station-detail-body` | Nullability vs content. |
| `infer-continue-study-from-activity.ts` | Prisma select vs schema. |
| `practice-test-runner-client.tsx` size | Future refactor epic. |

## Duplicate logic (review only)

- Keep entitlement layering: `resolveEntitlementForPage` vs `requireSubscriberSession`.
- Centralize question filters via `content-access-scope.ts`.
