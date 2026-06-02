# AI fix priority list (NurseNest)

Ordered for **low risk first**, then **prep-for-dev**, then **developer-only**. Aligns with `ai-fixable-issues-audit.md`.

## Completed (SAFE_FOR_AI — see `docs/ai-fixes-completed.md`)

| Priority | Audit ID | Status |
| --- | --- | --- |
| P0.1 | ISSUE-009 | **Done** — canonical banners on `docs/mobile-ux-audit.md`, `docs/mobile-layout-regression-checklist.md`, `docs/mobile-navigation-risk-areas.md`. |
| P0.2 | ISSUE-008 | **Done** — `docs/blog-quality-thresholds.md` + contract test `blog-quality-thresholds-doc.contract.test.ts` in `blog:quality:test`. |
| P0.3 | ISSUE-007 | **Done** *(prior session)* — removed `page.tsx.save`; `test:source-hygiene` guards recurrence. |

## P1 — After developer supplies TS output (AI_CAN_PREP + review)

| Priority | Audit ID | Action | Verify |
| --- | --- | --- | --- |
| P1.1 | ISSUE-001 | Human runs `npm run typecheck`; paste errors; AI fixes **imports**, wrong optional chaining on **leaf** UI only. | `npm run typecheck` |
| P1.2 | ISSUE-002–004 | Remove `@ts-expect-error` on admin blog routes once Prisma client matches schema. | `typecheck` + admin blog smoke |
| P1.3 | ISSUE-006 | Replace `any` in CAT audit/persistence with typed shapes / zod. | CAT tests + E2E |
| P1.4 | ISSUE-011 | Extend mobile audit doc with exact env var names for paid mobile projects. | `npm run test:e2e:mobile` (with creds) |
| P1.5 | ISSUE-012 | Incremental blog governance list/tests in small PRs. | `npm run blog:quality:test`, `blog:audit-quality` |
| P1.6 | ISSUE-015 | Run SEO verify scripts; fix **copy-only** gaps if truthpack-aligned. | `verify:seo-indexability`, `test:seo-sitemap` |

## P2 — Developer-led (DEVELOPER_ONLY / high blast radius)

| Priority | Audit ID | Action | Verify |
| --- | --- | --- | --- |
| P2.1 | ISSUE-010 | Interpret `ci:verify` failures; no AI bulk “fixes” without root cause. | `npm run ci:verify` |
| P2.2 | ISSUE-005 | Any `exhaustive-deps` change in practice/CAT runner — human + E2E. | Playwright practice/CAT |
| P2.3 | ISSUE-013 | Admin edit/publish audit failures — policy + code review. | `audit:admin-edit-publish-surface:verify` |

## P3 — DO_NOT_TOUCH (AI)

| Priority | Audit ID | Rule |
| --- | --- | --- |
| P3.1 | ISSUE-014 | No unsupervised AI edits to auth, entitlements, Stripe, or JWT/session bridging. |

## P4 — SAFE_FOR_AI (after mobile failures exist)

| Priority | Audit ID | Action | Verify |
| --- | --- | --- | --- |
| P4.1 | ISSUE-016 | Per-route overflow fixes only when `test:e2e:mobile` fails. | `npm run test:e2e:mobile` |

---

## Quick reference — npm commands

| Goal | Command |
| --- | --- |
| Type baseline | `npm run typecheck` |
| CI parity | `npm run ci:verify` |
| Mobile width | `npm run test:e2e:mobile` |
| Blog governance | `npm run blog:quality:test` |
| Blog audit | `npm run blog:audit-quality` |
| Admin surface | `npm run audit:admin-edit-publish-surface:verify` |
| SEO | `npm run verify:seo-indexability` |
| Source hygiene | `npm run test:source-hygiene` |
