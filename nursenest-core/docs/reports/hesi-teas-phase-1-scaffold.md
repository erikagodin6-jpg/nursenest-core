# HESI A2 / ATI TEAS hidden scaffold — Phase 1

## Status

Internal-only scaffold update. No public launch.

- `status: "hidden"` remains on admissions pathway rows
- `NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS=1` is still required for internal resolution
- no sitemap inclusion
- no nav exposure
- no checkout / Stripe exposure
- no learner-shell chrome exposure

## Routes touched

No new public routes were added.

The existing exam-hub route tree now supports a stricter hidden scaffold posture for:

- `/us/allied/hesi-a2`
- `/us/allied/ati-teas`

Behavior:

- with flag off: these routes do not resolve
- with flag on: the **overview route only** renders the internal scaffold
- sibling subroutes remain blocked through the `[examCode]` layout guard:
  - `/pricing`
  - `/questions`
  - `/cat`
  - `/lessons`
  - other descendants under the same hub tree

HESI Exit remains hidden and out of scope for this phase's route enablement.

## Guardrails implemented

### Routing

- Added a shared helper to allow only the exact overview route for phase-1 hidden scaffold pathways.
- The `[examCode]` layout now rejects hidden admissions subroutes unless the request is the exact overview path and the pathway is one of the phase-1 scaffold IDs.
- The overview page still branches before `buildNursingTierHubContent`, so RN / NCLEX fallback modules do not render.

### Learner shell

- Hidden pathways are filtered from learner chrome metadata.
- A manually-set hidden admissions `learnerPath` no longer surfaces pathway pills/context bars in learner shell chrome.

### Checkout / pricing / CAT / question pools

- HESI A2 and ATI TEAS remain on `PRE_NURSING`, which is treated as a free, non-Stripe billing tier.
- CAT continues to fail closed because admissions rows are `info_only`.
- Question-bank scope continues to fail closed because admissions rows still have empty `contentExamKeys`.

## Sitemap / indexing behavior

- admissions-prep hubs remain excluded from `listPublishedExamPathwaysForPublicSite()`
- `collectExamPathwayUrls()` does not emit HESI / TEAS URLs
- hidden admissions metadata remains `noindex, nofollow`
- internal admissions hubs continue to omit public hreflang alternates

## Intentionally disabled

- public SEO rollout
- public sitemap entries
- main navigation links
- learner dashboard pathway exposure
- learner-shell pathway chrome
- pricing / checkout flow
- CAT launch
- question-bank launch
- lessons launch
- HESI Exit route enablement for this phase

## Verification

Targeted tests added or extended:

- admissions hidden route / sitemap / metadata contracts
- overview-only helper behavior
- HESI Exit remains blocked in this phase
- learner-shell hidden pathway filtering
- free-tier checkout isolation
- empty admissions question scope
- CAT info-only assessment

Commands to run:

- `npm run typecheck:critical`
- `npm run test:homepage`
- `npm run sitemap:validate`
- `npm run seo:guardrails`
- targeted admissions-prep contracts

## Next phases

1. Decide whether HESI Exit gets its own hidden scaffold activation phase or stays dormant until content is ready.
2. Add real lesson/question/flashcard tagging only when product is ready to keep those surfaces internal without accidental route leakage.
3. Finalize learner-surface UX for any future internal preview routes beyond the overview page.
4. Do not remove `hidden`, `noindex`, or the launch gate until `docs/governance/admissions-prep-launch-gate.md` is fully satisfied.
