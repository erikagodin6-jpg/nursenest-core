# NurseNest AI fixability audit

**Scope:** Separate AI-safe fixes from developer-only work. **No code or schema changes** were made in this audit.

## Method

- Ran bounded `tsc --noEmit` (90s); process **timed out (exit 124)** before listing errors. Full TS baseline must be run by a human/CI: `cd nursenest-core && npm run typecheck`.
- Grep: `@ts-expect-error`, `eslint-disable`, stray `*.save` under `src/`.
- Verified `ci:verify` references `content:source-of-truth:check` and that `scripts/content-source-of-truth-check.mjs` exists.

## Category tags

- **SAFE_FOR_AI** — mechanical, low blast radius, easy to verify.
- **AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW** — AI may draft; human must review (product, security, behavior).
- **DEVELOPER_ONLY** — auth, billing, entitlements, migrations, exam timing, production gates.
- **DO_NOT_TOUCH** — secrets, compliance, or policy forbids blind edits.

## Issues

### ISSUE-001 — TypeScript baseline unknown

| Field | Value |
| --- | --- |
| Category | AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW |
| File | (workspace-wide) |
| Summary | Full `tsc` did not finish in 90s; error count unknown. |
| Cause | Large project / cold compile in audit environment. |
| Risk | Medium |
| Fix | Developer runs `npm run typecheck`, saves log; AI triages mechanical errors only. |
| Tests | `npm run typecheck` |
| Touches revenue/auth/DB/SEO/deploy | N / N / N / N / **Y** if CI gate fails |

### ISSUE-002 — Admin blog localized route

| Field | Value |
| --- | --- |
| Category | AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW |
| File | `src/app/api/admin/blog/localized/route.ts` |
| Summary | `@ts-expect-error` (Prisma generate + migration comment). |
| Cause | Temporary type suppression. |
| Risk | Medium |
| Fix | After schema/client align, replace with real types; remove suppression. |
| Tests | `npm run typecheck`; admin blog smoke |
| Touches | Auth Y, DB Y, SEO Y, deploy Y |

### ISSUE-003 — Admin blog localized queue route

| Field | Value |
| --- | --- |
| Category | AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW |
| File | `src/app/api/admin/blog/localized/queue/route.ts` |
| Summary | Same `@ts-expect-error` pattern as ISSUE-002. |
| Cause | Same |
| Risk | Medium |
| Fix | Same |
| Tests | Same |
| Touches | Auth Y, DB Y, SEO Y, deploy Y |

### ISSUE-004 — Admin blog localized id route

| Field | Value |
| --- | --- |
| Category | AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW |
| File | `src/app/api/admin/blog/localized/[id]/route.ts` |
| Summary | Same `@ts-expect-error` pattern as ISSUE-002. |
| Cause | Same |
| Risk | Medium |
| Fix | Same |
| Tests | Same |
| Touches | Auth Y, DB Y, SEO Y, deploy Y |

### ISSUE-005 — Practice test runner exhaustive-deps

| Field | Value |
| --- | --- |
| Category | DEVELOPER_ONLY |
| File | `src/components/student/practice-test-runner-client.tsx` |
| Summary | `eslint-disable-next-line react-hooks/exhaustive-deps` near exam/timer logic. |
| Cause | Avoid re-subscribe loops / duplicate submits. |
| Risk | High |
| Fix | Human refactor with E2E and timer edge-case coverage first. |
| Tests | Playwright practice/CAT suites |
| Touches | Revenue Y, deploy Y |

### ISSUE-006 — CAT session any types

| Field | Value |
| --- | --- |
| Category | AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW |
| File | `src/lib/cat/session-persistence.ts`, `src/lib/cat/cat-inference-audit.ts` |
| Summary | `no-explicit-any` suppressed. |
| Cause | Legacy JSON shapes. |
| Risk | Medium |
| Fix | Narrow types or `unknown` + zod; preserve runtime behavior. |
| Tests | CAT unit/integration; paid cat E2E if configured |
| Touches | Revenue Y, DB semantics for session |

### ISSUE-007 — Stray lessons page backup

| Field | Value |
| --- | --- |
| Category | SAFE_FOR_AI |
| File | `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx.save` |
| Summary | Backup file beside real `page.tsx`; confuses search and may drift. |
| Cause | Editor/manual backup. |
| Risk | Low |
| Fix | Diff vs `page.tsx`; delete if redundant. |
| Tests | `npm run typecheck` |
| Touches | None |

### ISSUE-008 — Duplicate blog threshold docs

| Field | Value |
| --- | --- |
| Category | SAFE_FOR_AI |
| File | `docs/blog-quality-thresholds.md` and `src/lib/blog/blog-quality-score.ts` |
| Summary | Numeric thresholds duplicated; drift risk. |
| Cause | Human-readable doc. |
| Risk | Low |
| Fix | Doc points to single source of truth in TS; trim duplicate table or auto-check in CI. |
| Tests | Optional doc drift script |
| Touches | Governance copy only |

### ISSUE-009 — Mobile doc dual paths

| Field | Value |
| --- | --- |
| Category | SAFE_FOR_AI |
| File | `docs/mobile-ux-audit.md`, `reports/mobile-ux-audit.md` |
| Summary | Two locations; editors may update wrong file. |
| Cause | Tooling write limits on `reports/`. |
| Risk | Low |
| Fix | Header line: canonical edit path under `docs/`; sync to `reports/` in CI. |
| Tests | N/A |

### ISSUE-010 — ci:verify chain

| Field | Value |
| --- | --- |
| Category | DEVELOPER_ONLY |
| File | `package.json` script `ci:verify` |
| Summary | Long chain including `build`; failures need human diagnosis. |
| Cause | Production gate by design. |
| Risk | High when red |
| Fix | Developer triages; AI only after root cause known. |
| Tests | `npm run ci:verify` |
| Touches | Deploy Y, DB generate, content checks |

### ISSUE-011 — Mobile E2E env gap

| Field | Value |
| --- | --- |
| Category | AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW |
| File | `playwright.mobile.config.ts`, `tests/e2e/mobile/*` |
| Summary | Paid projects omitted without `E2E_PAID_*`; local green can miss paid-only regressions. |
| Cause | Secrets not in repo. |
| Risk | Medium |
| Fix | CI checklist + doc env vars clearly. |
| Tests | `npm run test:e2e:mobile` with credentials |
| Touches | Revenue indirect, deploy Y |

### ISSUE-012 — Blog governance extension

| Field | Value |
| --- | --- |
| Category | AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW |
| File | `src/lib/blog/blog-content-quality-gate.ts`, `blog-quality-score.ts` |
| Summary | Adding banned phrases or weights is mechanical but can false-block publish. |
| Cause | Ongoing ops |
| Risk | Low–Medium |
| Fix | Small PRs + `npm run blog:quality:test` + dry audits on non-prod DB. |
| Tests | `blog:quality:test`, `blog:audit-quality` |
| Touches | SEO Y, revenue indirect |

### ISSUE-013 — Admin surface audits

| Field | Value |
| --- | --- |
| Category | DEVELOPER_ONLY |
| File | `package.json` — `audit:admin-edit-publish-surface*` |
| Summary | Failures involve RBAC and staff session truth; not AI-only. |
| Cause | Security domain |
| Risk | High |
| Fix | Human interprets; AI may format reports only. |
| Tests | `audit:admin-edit-publish-surface:verify`, `test:admin-edit-publish-surface` |
| Touches | Auth Y, deploy Y |

### ISSUE-014 — Auth and entitlements blanket

| Field | Value |
| --- | --- |
| Category | DO_NOT_TOUCH (for autonomous AI) |
| File | e.g. `src/lib/auth/*`, `src/lib/entitlements/*`, Stripe webhooks |
| Summary | “Obvious” null guards can widen access if wrong. |
| Cause | N/A |
| Risk | High |
| Fix | Developer + security review only. |
| Tests | Tier-matrix E2E, paywall policy tests |
| Touches | Revenue Y, auth Y, DB Y |

### ISSUE-015 — SEO spot-check process

| Field | Value |
| --- | --- |
| Category | AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW |
| File | Example: `.../lessons/page.tsx` has rich `generateMetadata` |
| Summary | No gap found on this slice; other routes still need scripted verification. |
| Cause | N/A |
| Risk | Low for copy-only fixes; High if changing canonical rules |
| Fix | Run `verify:seo-indexability`, `audit:localized-seo`; AI may fix copy aligned to truthpack. |
| Tests | `test:seo-sitemap`, SEO verify scripts |
| Touches | SEO Y, deploy Y |

### ISSUE-016 — Mobile overflow follow-ups

| Field | Value |
| --- | --- |
| Category | SAFE_FOR_AI |
| File | `src/app/globals.css` and marketing components if Playwright flags overflow |
| Summary | After `test:e2e:mobile`, fix route-specific wide children; avoid breaking inner scroll. |
| Cause | Legacy CSS |
| Risk | Low |
| Fix | Targeted Tailwind/CSS per failing route. |
| Tests | `npm run test:e2e:mobile` |
| Touches | N |

## Counts (this audit)

- SAFE_FOR_AI: 4  
- AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW: 7  
- DEVELOPER_ONLY: 3  
- DO_NOT_TOUCH: 1 (plus blanket auth/paywall note)

## Developer handoff rules

1. Run `npm run typecheck` and attach output before AI fixes TS.  
2. Do not let AI change Stripe, webhooks, staff RBAC, or Prisma schema without explicit scope.  
3. SEO canonical and query indexing rules: human review on any change.  
4. Use existing audits as gates: admin edit-publish, SEO verify, blog quality.
