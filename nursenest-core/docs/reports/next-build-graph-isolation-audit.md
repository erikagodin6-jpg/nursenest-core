# Next Build Graph Isolation Audit

Date: `2026-05-11`
App root: `nursenest-core/`
Goal: reduce Next.js compile graph pressure and memory usage without removing routes or features.

## Summary

This pass isolated admin/internal server imports from the shared public and learner layout graph rather than deleting any surface.

The most important outcome is structural:

- shared public and learner layouts no longer have static runtime imports of `staff-session`, marketing public-content override loaders, admin view-as context, or admin QA simulation helpers
- build metrics now record a compile-graph snapshot alongside route count and peak RSS
- the latest local `next build` still terminated with `SIGKILL`, but sampled peak process RSS dropped to `3100 MB` from recent runs in the `5771-6076 MB` range

## Largest graph offenders found

### Shared-layout offenders before isolation

1. `src/app/(marketing)/[locale]/layout.tsx`
   - statically imported `@/lib/auth/staff-session`
   - statically imported `@/lib/marketing/load-marketing-public-content-overrides`
   - effect: public locale marketing routes paid for staff/auth + Prisma-backed override graph up front

2. `src/app/(student)/app/layout.tsx`
   - statically imported `@/lib/auth/staff-session`
   - effect: all `/app/*` routes pulled staff/admin auth lookup into the shared learner shell entry

3. `src/app/(student)/app/(learner)/layout.tsx`
   - statically imported `@/lib/admin/admin-view-as-learner-context`
   - statically imported `@/lib/admin/admin-learner-qa-simulation`
   - effect: normal learner routes paid for admin QA/view-as helpers in the root learner shell graph

### Remaining heavy import systems after isolation

From the new compile-graph snapshot logged by `scripts/run-next-prod-build.mjs`:

- route count: `771`
- layout count: `35`
- page count: `388`
- app source modules: `857`
- total source modules: `4748`

Largest remaining import-count hotspots:

- `directDbImportsInApp`: `234` files
- `examRegistryImportsInApp`: `21` files
- `staffSessionImports`: `12` files
- `adminQaSimulationImports`: `5` files
- `internalAdmissionsImports`: `2` files
- `marketingPublicOverrideImports`: `1` file
- `adminViewAsImports`: `0` files

## Memory-heavy import chains

1. Marketing locale shell
   - `src/app/(marketing)/[locale]/layout.tsx`
   - previous chain: layout -> `staff-session` -> auth/session lookup -> admin role source -> Prisma
   - previous chain: layout -> `load-marketing-public-content-overrides` -> Prisma

2. Learner shell admin overlay
   - `src/app/(student)/app/(learner)/layout.tsx`
   - previous chain: layout -> `admin-view-as-learner-context` -> `staff-session` + admin QA simulation
   - previous chain: layout -> admin QA helpers -> pricing catalog, pathway nav metadata, exam pathway catalog

3. Staff bypass entitlements
   - `src/lib/entitlements/get-user-access.ts`
   - previous chain: entitlement core -> admin QA simulation module even for non-admin users because of top-level import coupling

4. Admin view-as helper
   - `src/lib/admin/admin-view-as-learner-context.ts`
   - previous chain: view-as helper -> entitlement + `getUserAccess` imports at module load, even though the common `getAdminViewAsLearnerContext()` path only needed staff session + QA cookie validation

## Admin isolation changes

### Shared route/layout isolation

- `src/app/(marketing)/[locale]/layout.tsx`
  - replaced static imports of `staff-session` and `load-marketing-public-content-overrides` with lazy server helpers (`getStaffSessionSafe`, `loadPublicContentOverridesForLocaleSafe`)

- `src/app/(student)/app/layout.tsx`
  - replaced static `staff-session` import with lazy server lookup only when deciding whether to render the admin command palette

- `src/app/(student)/app/(learner)/layout.tsx`
  - removed static runtime imports of admin QA simulation helpers and admin view-as context
  - added lazy server helpers to load admin view-as context and QA helper module only when needed
  - preserved QA toolbar, QA overlay, and staff behavior with safe fallbacks if the lazy import fails

### Deeper fanout reduction

- `src/lib/admin/admin-view-as-learner-context.ts`
  - moved entitlement/user-access imports behind function-local dynamic imports
  - keeps the common `getAdminViewAsLearnerContext()` path focused on staff session + QA cookie validation

- `src/lib/entitlements/get-user-access.ts`
  - moved admin QA simulation module behind a function-local dynamic import inside the staff-bypass branch
  - normal learner entitlement reads no longer pay for that admin module at top-level load time

### Measurement and guardrails

- added `scripts/build-graph-isolation-metrics.mjs`
  - logs route count
  - logs app/source module counts
  - logs targeted runtime import counts for known heavy modules
  - logs shared-layout offender snapshot

- updated `scripts/run-next-prod-build.mjs`
  - emits `compile_graph_snapshot`
  - persists graph snapshot into `reports/build-runtime-metrics.json`

- updated `src/app/(student)/app/(learner)/learner-shell-import-guardrail.contract.test.ts`
  - now blocks future static runtime imports of `admin-learner-qa-simulation` and `admin-view-as-learner-context`
  - ignores `import type` so the guard only tracks runtime graph coupling

## Measurements

### Before (recent local next-prod-build runs)

Recent runs recorded in `reports/build-runtime-metrics.json` before this graph snapshot pass:

- `2026-05-11T06:37:09.866Z` -> peak RSS `5771 MB`
- `2026-05-11T06:44:43.930Z` -> peak RSS `6076 MB`
- `2026-05-11T06:49:29.463Z` -> peak RSS `6019 MB`

These prior runs did not yet include the compile-graph snapshot, but they establish the immediate pre-change memory band.

### After (this pass)

Current run:

- `next-prod-build` started: `2026-05-11T07:07:21.297Z`
- next build duration before kill: `327053 ms`
- sampled peak RSS: `3100 MB`
- peak process count: `1`
- failed phase: `next_build`
- terminal condition: `SIGKILL`

### Observed delta

Compared with the three recent local next-build runs above:

- vs `6076 MB`: down by `2976 MB` (`~49%`)
- vs `6019 MB`: down by `2919 MB` (`~48%`)
- vs `5771 MB`: down by `2671 MB` (`~46%`)

### Shared-layout offender snapshot after changes

`compile_graph_snapshot.sharedLayoutOffenders` reported:

- `src/app/(marketing)/[locale]/layout.tsx` -> `[]`
- `src/app/(marketing)/(default)/layout.tsx` -> `[]`
- `src/app/(student)/app/layout.tsx` -> `[]`
- `src/app/(student)/app/(learner)/layout.tsx` -> `[]`

That confirms the targeted shared-layout runtime edges were removed.

## Remaining bottlenecks

1. `@/lib/db` is still imported by `234` app files
   - this is now the biggest remaining graph fanout surface, especially across admin pages, APIs, and some public/learner pages

2. public exam hub surfaces still mix internal gating and DB-heavy logic
   - `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/layout.tsx`
   - `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/page.tsx`
   - internal admissions logic is route-local now, but still part of a public marketing subtree

3. exam registry imports remain wide
   - `21` app files still import exam registries/catalogs directly

4. single-worker build still dies later in Next/Turbopack
   - the shared-layout/admin isolation reduced sampled RSS substantially
   - however the build still ends with `SIGKILL`, which suggests remaining pressure from broader route graph size, DB-heavy page/server modules, or native/Turbopack allocations outside the isolated shared layout slice

## Expected RSS reduction

Based on the observed local run history, the admin/internal isolation work should reduce peak RSS materially in environments where the same shared layout graph was previously being traversed.

Observed local reduction in this pass was approximately `46-49%` versus the recent pre-change runs recorded in the same metrics file.

This should be treated as directional, not final:

- it proves the isolation changes removed real graph coupling
- it does not yet guarantee a successful single-worker production build because broader app-graph pressure still exists

## Verification

### Passed

- `npm run typecheck:critical`
- `npm run test:learner-shell-imports`
- `ReadLints` on all touched files returned no diagnostics
- `npm run build:production` completed content prep successfully and emitted the new compile-graph snapshot before failing later in `next_build`

### Build result

- `npm run build:production` -> failed in `next_build`
- failure mode: `SIGKILL`
- sampled peak RSS before kill: `3100 MB`

### Route smoke status

These were not completed because the production build did not produce a runnable fresh artifact:

- homepage smoke: not run
- learner dashboard smoke: not run
- admin smoke: not run
- no-route-regressions verdict: partially verified by typecheck + import guardrail only; full runtime smoke remains pending until the build completes

## Recommended next pass

1. target `@/lib/db` fanout in app routes, especially public marketing and learner pages that do not need eager top-level DB imports
2. route-localize internal admissions helpers in the public exam hub subtree where safe
3. audit exam-registry imports for page-local lazy loading opportunities
4. rerun `npm run build:production` after the next isolation slice and compare against this report using the new graph snapshot
