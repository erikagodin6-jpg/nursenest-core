# NurseNest — AI fixability audit

**Scope:** Separate **safe AI work** from **developer-only** work. **No code, schema, routes, or runtime behavior was changed** to produce this document.

**Method (this run):**

- `tsc --noEmit` was attempted with a **90s** wall clock; it **timed out** before listing errors — full TS baseline is **not** enumerated here.
- Grep: `@ts-expect-error`, `eslint-disable`, stray `*.save` under `src/app`.
- Spot-check: `package.json` `ci:verify` chain; blog governance / mobile docs layout.

**Categories**

| Tag | Meaning |
| --- | --- |
| `SAFE_FOR_AI` | Mechanical; low blast radius; verify with existing scripts/tests. |
| `AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW` | AI may draft; human reviews product/security/behavior. |
| `DEVELOPER_ONLY` | Auth, billing, entitlements, Prisma, migrations, exam/timer correctness. |
| `DO_NOT_TOUCH` | Secrets, compliance, or policy forbids blind edits. |

**Risk:** Low / Medium / High.

**Touches column:** Revenue · Auth · Database · SEO · Deployment (Y/N).

---

### ISSUE-001 — TypeScript baseline unknown

| Field | Value |
| --- | --- |
| **Category** | `AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW` |
| **File** | *(workspace)* |
| **Summary** | Full `tsc --noEmit` did not finish within 90s in audit env; **unknown** error count. |
| **Cause** | Large project / cold compile. |
| **Risk** | Medium |
| **Fix** | Run `cd nursenest-core && npm run typecheck`; export output; AI triages **mechanical** errors only after list exists. |
| **Tests** | `npm run typecheck` |
| **Touches** | R N · A N · D N · S N · **Dep Y** (CI) |

---

### ISSUE-002 — Admin blog `@ts-expect-error` (localized)

| Field | Value |
| --- | --- |
| **Category** | `AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW` |
| **File** | `src/app/api/admin/blog/localized/route.ts` |
| **Summary** | `@ts-expect-error` — “available after prisma generate + migration”. |
| **Cause** | Client/types lag schema. |
| **Risk** | Medium |
| **Fix** | After `prisma generate` + migrations, replace with real types; remove suppression. |
| **Tests** | `npm run typecheck`; admin blog smoke |
| **Touches** | R N · **A Y** · **D Y** · **S Y** · Dep Y |

---

### ISSUE-003 — Admin blog queue route

| Field | Value |
| --- | --- |
| **Category** | `AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW` |
| **File** | `src/app/api/admin/blog/localized/queue/route.ts` |
| **Summary** | Same `@ts-expect-error` pattern as ISSUE-002. |
| **Cause** | Same |
| **Risk** | Medium |
| **Fix** | Same as ISSUE-002 |
| **Tests** | Same |
| **Touches** | A Y · D Y · S Y · Dep Y |

---

### ISSUE-004 — Admin blog `[id]` route

| Field | Value |
| --- | --- |
| **Category** | `AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW` |
| **File** | `src/app/api/admin/blog/localized/[id]/route.ts` |
| **Summary** | Same `@ts-expect-error` pattern. |
| **Cause** | Same |
| **Risk** | Medium |
| **Fix** | Same as ISSUE-002 |
| **Tests** | Same |
| **Touches** | A Y · D Y · S Y · Dep Y |

---

### ISSUE-005 — `exhaustive-deps` in exam runner

| Field | Value |
| --- | --- |
| **Category** | `DEVELOPER_ONLY` |
| **File** | `src/components/student/practice-test-runner-client.tsx` (and similar exam clients) |
| **Summary** | `eslint-disable-next-line react-hooks/exhaustive-deps` near timer/submit flows. |
| **Cause** | Avoid duplicate submits / timer resets. |
| **Risk** | **High** |
| **Fix** | Human refactor with E2E + manual timer cases; do not “fix” deps blindly. |
| **Tests** | Playwright practice/CAT; manual |
| **Touches** | **R Y** · A N · D N · S N · Dep Y |

---

### ISSUE-006 — `no-explicit-any` in CAT libs

| Field | Value |
| --- | --- |
| **Category** | `AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW` |
| **File** | `src/lib/cat/session-persistence.ts`, `src/lib/cat/cat-inference-audit.ts` |
| **Summary** | `eslint-disable-next-line @typescript-eslint/no-explicit-any`. |
| **Cause** | Legacy JSON shapes. |
| **Risk** | Medium |
| **Fix** | Narrow types or `unknown` + zod; preserve session semantics. |
| **Tests** | CAT unit/integration; paid CAT E2E if configured |
| **Touches** | R Y · A N · **D Y** · S N · Dep Y |

---

### ISSUE-007 — Stray `page.tsx.save`

| Field | Value |
| --- | --- |
| **Category** | `SAFE_FOR_AI` |
| **File** | `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx.save` |
| **Summary** | Backup file beside real `page.tsx`; not a route module but adds noise/confusion. |
| **Cause** | Editor/manual backup. |
| **Risk** | Low |
| **Fix** | Diff vs `page.tsx`; if redundant, delete `.save`. |
| **Tests** | `npm run typecheck` |
| **Touches** | All N |

---

### ISSUE-008 — Duplicate blog threshold docs

| Field | Value |
| --- | --- |
| **Category** | `SAFE_FOR_AI` |
| **File** | `docs/blog-quality-thresholds.md` + `src/lib/blog/blog-quality-score.ts` |
| **Summary** | Numeric thresholds duplicated; drift risk. |
| **Cause** | Human-readable copy. |
| **Risk** | Low |
| **Fix** | Doc header: “Source of truth: `blog-quality-score.ts`”; or CI check doc vs exports. |
| **Tests** | Optional doc drift script |
| **Touches** | S indirect |

---

### ISSUE-009 — Docs vs `reports/` paths

| Field | Value |
| --- | --- |
| **Category** | `SAFE_FOR_AI` |
| **File** | `docs/mobile-ux-audit.md`, `reports/mobile-*.md` |
| **Summary** | Multiple locations for same class of doc; wrong file edited. |
| **Cause** | Tooling/env permissions on `reports/`. |
| **Risk** | Low |
| **Fix** | Single “edit here” pointer in each file header. |
| **Tests** | N/A |
| **Touches** | All N |

---

### ISSUE-010 — `ci:verify` gate

| Field | Value |
| --- | --- |
| **Category** | `DEVELOPER_ONLY` |
| **File** | `package.json` → `ci:verify` |
| **Summary** | Chains `db:generate`, `typecheck`, `content:source-of-truth:check`, `guard:build-scripts`, `build`. |
| **Cause** | Production gate by design. |
| **Risk** | **High** when red |
| **Fix** | Human triage; AI only after root cause known. |
| **Tests** | `npm run ci:verify` |
| **Touches** | **Dep Y** · D Y · S Y |

---

### ISSUE-011 — Mobile E2E requires paid env

| Field | Value |
| --- | --- |
| **Category** | `AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW` |
| **File** | `playwright.mobile.config.ts`, `tests/e2e/mobile/*` |
| **Summary** | Paid learner projects omitted without `E2E_PAID_*`; local “green” ≠ full mobile matrix. |
| **Cause** | Secrets not in repo. |
| **Risk** | Medium |
| **Fix** | CI checklist + doc env vars (partially done in mobile audit doc). |
| **Tests** | `npm run test:e2e:mobile` with credentials |
| **Touches** | R indirect · Dep Y |

---

### ISSUE-012 — Blog governance extension

| Field | Value |
| --- | --- |
| **Category** | `AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW` |
| **File** | `src/lib/blog/blog-quality-score.ts`, `src/lib/blog/blog-content-quality-gate.ts` |
| **Summary** | Adding filler phrases / dimensions is mechanical but can **false-block** publish. |
| **Cause** | Ops iteration |
| **Risk** | Medium |
| **Fix** | Small PRs + `npm run blog:quality:test`; audit on non-prod DB only with approval. |
| **Tests** | `npm run blog:quality:test`, `blog:audit-quality` |
| **Touches** | **S Y** · R indirect |

---

### ISSUE-013 — Admin surface audits

| Field | Value |
| --- | --- |
| **Category** | `DEVELOPER_ONLY` |
| **File** | `package.json` → `audit:admin-edit-publish-surface*` |
| **Summary** | RBAC/staff/session policy — not AI-solo interpretation. |
| **Cause** | Security |
| **Risk** | **High** |
| **Fix** | Developer runs + decides; AI may format reports only. |
| **Tests** | `npm run audit:admin-edit-publish-surface:verify`, `test:admin-edit-publish-surface` |
| **Touches** | **A Y** · Dep Y |

---

### ISSUE-014 — Auth / paywall blanket

| Field | Value |
| --- | --- |
| **Category** | `DO_NOT_TOUCH` *(for unsupervised AI)* |
| **File** | `src/lib/auth/*`, `src/lib/entitlements/*`, Stripe webhooks |
| **Summary** | “Obvious” null guards can **widen access** if wrong. |
| **Cause** | N/A |
| **Risk** | **High** |
| **Fix** | Developer + security review only. |
| **Tests** | Tier-matrix E2E; `audit:paywall-security` |
| **Touches** | **R Y** · **A Y** · **D Y** |

---

### ISSUE-015 — SEO spot-check process

| Field | Value |
| --- | --- |
| **Category** | `AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW` |
| **File** | e.g. `.../lessons/page.tsx` (`generateMetadata` present) |
| **Summary** | No gap found on this slice; other routes need same systematic check. |
| **Cause** | N/A |
| **Risk** | Low–High depending on change |
| **Fix** | Run `verify:seo-indexability`, `audit:localized-seo`; AI may fix **copy-only** if aligned with truthpack/copy. |
| **Tests** | `npm run test:seo-sitemap`, SEO verify scripts |
| **Touches** | **S Y** · Dep Y |

---

### ISSUE-016 — Mobile overflow follow-ups

| Field | Value |
| --- | --- |
| **Category** | `SAFE_FOR_AI` |
| **File** | `src/app/globals.css`, marketing components as flagged by `test:e2e:mobile` |
| **Summary** | Fix overflow only where Playwright reports `scrollWidth > clientWidth`; avoid risky global `overflow-x` on scroll regions. |
| **Cause** | Legacy layouts |
| **Risk** | Low |
| **Fix** | Route-scoped Tailwind / `min-w-0` / `max-w-full` |
| **Tests** | `npm run test:e2e:mobile` |
| **Touches** | All N |

---

## Counts (this audit)

| Category | # |
| --- | ---: |
| SAFE_FOR_AI | 4 |
| AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW | 6 |
| DEVELOPER_ONLY | 3 |
| DO_NOT_TOUCH | 1 (+ blanket ISSUE-014) |

See **`ai-fix-priority-list.md`** for execution order.

---

## SAFE_FOR_AI remediation status *(post-fix sweep)*

| ID | Status |
| --- | --- |
| ISSUE-007 | **Resolved** — `*.save` removed; `test:source-hygiene` prevents recurrence. |
| ISSUE-008 | **Resolved** — doc points at `blog-quality-score.ts`; `blog-quality-thresholds-doc.contract.test.ts` guards drift. |
| ISSUE-009 | **Resolved** — canonical edit banners on mobile UX + layout checklist + nav risk docs. |
| ISSUE-016 | **Open** — apply CSS only when `test:e2e:mobile` reports horizontal overflow for a route. |
