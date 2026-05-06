# AI fix priority list (NurseNest)

Ordered for **max safe progress before external developer** deep work. All items reference `docs/ai-fixable-issues-audit.md` (ISSUE-001, etc.).

| Priority | ISSUE | Category | Why this order |
| --- | --- | --- | --- |
| P0 | ISSUE-001 | AI_CAN_PREP | Unblock TS signal: run full `typecheck`, then batch-fix leaf errors (imports, typos). |
| P1 | ISSUE-007 | SAFE_FOR_AI | Remove stray `page.tsx.save` after diff — zero runtime risk. |
| P2 | ISSUE-008 | SAFE_FOR_AI | Doc drift: single source of truth pointer for blog thresholds. |
| P3 | ISSUE-009 | SAFE_FOR_AI | Doc drift: canonical path note for mobile UX docs. |
| P4 | ISSUE-002–004 | AI_CAN_PREP | Remove `@ts-expect-error` in admin blog routes **after** Prisma client/schema confirmed aligned. |
| P5 | ISSUE-016 | SAFE_FOR_AI | Fix any **specific** routes failing `test:e2e:mobile` overflow checks (evidence-driven). |
| P6 | ISSUE-011 | AI_CAN_PREP | CI/docs: ensure paid mobile env documented so regression suite actually runs. |
| P7 | ISSUE-012 | AI_CAN_PREP | Extend blog guardrail lists with tests only when content ops requests. |
| P8 | ISSUE-006 | AI_CAN_PREP | Replace `any` in CAT audit/persistence with typed boundaries — **after** CAT tests green. |
| P9 | ISSUE-015 | AI_CAN_PREP | Run SEO verify scripts; fix **copy-only** gaps where truthpack allows. |
| — | ISSUE-005 | DEVELOPER_ONLY | Do **not** prioritize AI on exhaustive-deps in exam runner without human plan. |
| — | ISSUE-010 | DEVELOPER_ONLY | `ci:verify` failures: developer triage first. |
| — | ISSUE-013 | DEVELOPER_ONLY | Admin audit failures: developer + security. |
| — | ISSUE-014 | DO_NOT_TOUCH | Auth/entitlements/Stripe: no autonomous AI edits. |

## Quick wins (same day, low risk)

- ISSUE-007, ISSUE-008, ISSUE-009 (docs + stray file).

## Blocked on developer input

- ISSUE-001 until `typecheck` log exists.  
- ISSUE-002–004 until Prisma/migrations state is confirmed.  
- ISSUE-005, ISSUE-010, ISSUE-013, ISSUE-014 at all times without explicit ticket.

## Verification commands (expected)

```bash
cd nursenest-core
npm run typecheck
npm run test:e2e:mobile
npm run blog:quality:test
npm run audit:admin-edit-publish-surface:verify
npm run verify:seo-indexability
```

Use only environments and DB credentials approved for the task.
