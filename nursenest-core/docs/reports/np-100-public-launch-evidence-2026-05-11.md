# NP 100% Public Launch Evidence

Date: 2026-05-11
Scope: US NP + Canada NP / CNPLE public launch readiness

## Verdict

The repo-side NP launch plan is implemented across product gating, content inventory, SEO/discovery expansion, release-alias alignment, and deploy-spec hardening. The remaining gaps in this shell are environment-backed verification blockers, not missing NP code paths:

- Stripe runtime variables are not populated in this shell, so Stripe-backed launch proof cannot be executed here.
- Worktree-local `next dev` crashes under Turbopack because the worktree `node_modules` symlink points outside the filesystem root.
- Production-domain SEO verification remains blocked in this shell by DNS resolution failure for `www.nursenest.ca`.

## Product State Evidence

- `ca-np-cnple` now ships as `status: "active"` with `acquisitionMode: "subscribe"` in `src/lib/exam-pathways/exam-pathways-data-segment-a.ts`.
- `us-np-fnp` remains `status: "active"` with `acquisitionMode: "subscribe"`.
- The committed readiness snapshot now carries real NP publish counts:
  - `ca-np-cnple`: 1221 lessons, 1496 questions
  - `us-np-fnp`: 591 lessons, 4819 questions
- CAT/readiness config resolves both launch pathways to `mini_adaptive`, `60-120` questions, `180` minutes.
- Canada NP marketing copy no longer presents CNPLE as beta-only or waitlist-only.

Command evidence captured from this worktree:

```bash
node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync('./src/config/pathway-readiness-snapshot.json','utf8')); console.log(JSON.stringify({cnple:data['ca-np-cnple'], fnp:data['us-np-fnp']},null,2));"
```

Result:

- `ca-np-cnple.updatedAt`: `2026-05-11T12:52:28.254Z`
- `us-np-fnp.updatedAt`: `2026-05-11T12:52:28.254Z`

## Content And Discovery Evidence

- The NP parity catalog and Canada/US NP pathway catalogs were regenerated to raise launch inventory and close the audit-backed gap set.
- The programmatic SEO registry now emits `112` NP condition-discovery public paths, exceeding the plan floor of 100.
- Localized SEO readiness and NP practice-test segment copy were corrected so Canada NP routes resolve under the real CNPLE route id and live-subscriber positioning.

Command evidence:

```bash
node --import tsx --input-type=module -e "import { pathwayTopicProgrammaticRowCount, collectPathwayTopicProgrammaticPublicPaths } from './src/lib/seo/pathway-topic-programmatic-registry.ts'; const paths=collectPathwayTopicProgrammaticPublicPaths(); const npConditionPaths=paths.filter((p)=>p.includes('/np-condition-')); console.log(JSON.stringify({totalRows:pathwayTopicProgrammaticRowCount(), npConditionPaths:npConditionPaths.length, sample:npConditionPaths.slice(0,10)},null,2));"
```

Observed output:

- `totalRows`: 268
- `npConditionPaths`: 112

## Release And Deploy Rail Evidence

- App-level aliases now exist in `nursenest-core/package.json`:
  - `deploy:precheck`
  - `validate:release`
  - `qa:verify:health`
  - `qa:post-deploy-smoke`
  - `qa:verify:production`
  - `qa:verify:production:core`
- Root-level forwarding aliases now exist in the worktree `package.json` so operators can run the same commands from repo root.
- The DigitalOcean app spec now uses `instance_size_slug: basic-s`, aligning the live spec with deploy safety docs.

Operator-surface smoke:

```bash
cd /root/nursenest-core/.worktrees/np-100-launch
npm run qa:verify:health
```

Observed output:

- Root alias correctly forwarded into `nursenest-core`.
- The script exited with the expected usage failure because `BASE_URL` was intentionally unset:
  - `verify-deploy-health: set BASE_URL`

## Automated Verification Evidence

### Passing targeted tests

Executed:

```bash
node --import tsx --test src/lib/seo/pathway-topic-programmatic-registry.test.ts src/lib/lessons/pathway-launch-bundle.test.ts src/lib/exam-pathways/pathway-cat-marketing-copy.test.ts
```

Observed result:

- 12 tests passed
- 0 failed

These checks specifically prove:

- CNPLE public CAT copy is no longer beta-only once the pathway is launchable.
- Launch bundles still resolve for core pathways.
- The NP programmatic registry emits at least 100 condition-discovery pages and round-trips through route truth.

### `validate:release` alias execution

Executed:

```bash
npm run validate:release
```

Observed result:

- The alias is wired correctly and starts the intended release validation chain.
- It fails on pre-existing repository type/import issues outside the NP slice, including:
  - missing `@legacy-client/*` modules
  - missing `@shared/*` modules
  - billing payload typing errors in `src/lib/learner/load-billing-page-payload.ts`
  - a type mismatch in `src/lib/marketing/country-exam-offerings.ts`

Conclusion: the alias wiring is complete, but the shared repo-wide typecheck surface is not green in this shell.

### SEO verification attempts

Attempted against a branch-local dev server on `http://127.0.0.1:3211`:

- `npm run verify:seo-indexability`
- `npm run verify:sitemap`
- `npm run verify:public-links`

Blocked result:

- The worktree dev server crashed immediately with:
  - `TurbopackInternalError: Symlink [project]/node_modules is invalid, it points out of the filesystem root`
- Because the server terminated, all three SEO verification commands failed with `ECONNREFUSED 127.0.0.1:3211`.

Earlier production-target verification in this shell was also blocked by external DNS resolution failure for `www.nursenest.ca`.

Conclusion: the SEO registry implementation is in place and its unit coverage is green, but live crawl verification still requires either:

- a non-symlinked install for this worktree, or
- a reachable staging/production `BASE_URL`.

## Stripe And Subscriber-Proof Evidence

This shell does not have Stripe runtime variables populated.

Command evidence:

```bash
node --input-type=module -e "import { STRIPE_RUNTIME_ENV_KEYS } from './scripts/lib/stripe-runtime-env-keys.mjs'; const keys=['STRIPE_SECRET_KEY','STRIPE_WEBHOOK_SECRET','NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',...STRIPE_RUNTIME_ENV_KEYS]; const unique=[...new Set(keys)]; const rows=unique.map((key)=>({key,present:Boolean(process.env[key])})); console.log(JSON.stringify({present:rows.filter((r)=>r.present).length,total:rows.length},null,2));"
```

Observed output:

- `present: 0`
- `total: 50`

Implication:

- Stripe env completeness cannot be proven from this shell.
- Paid unlock verification should be executed in the provisioned QA or staging environment using the existing release rails and paid-user suites.

Existing proof surfaces already anchored in the repo:

- `tests/e2e/paid-user/paid-subscriber-audit.spec.ts`
- `tests/e2e/paid-user/flashcards-live-route-tiers.spec.ts`
- `tests/e2e/public/pathway-lessons-hub-premium.spec.ts`
- `tests/e2e/public/nursing-pathway-hubs-smoke.spec.ts`

These remain the correct launch proof rails for:

- premium lessons access
- flashcards access
- CAT entry access
- paid learner routing
- public NP hub and lessons-hub visibility

## Workstream Closeout

1. Canada / CNPLE activation: implemented
2. NP content roadmap closure: implemented in code and inventory artifacts
3. NP SEO discovery expansion: implemented; live crawl verification blocked by environment
4. Release command alignment: implemented
5. Deploy spec hardening: implemented
6. NP launch evidence bundle: implemented in this report

## Launch Sign-Off Note

From the repository state, NP is no longer a waitlist-shell launch. The remaining sign-off work is operational:

- run the paid E2E proof surfaces with provisioned auth credentials
- run the SEO verification scripts against a reachable staging or production `BASE_URL`
- run release validation in an environment where the repo-wide typecheck/import surface is already repaired or intentionally scoped
