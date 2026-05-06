# Phase one — scope and handoff priorities

**Goal:** Stabilize revenue-critical learner experiences (RN/RPN), shipping quality, and operational confidence—**without** opening a floodgate of new product systems.

**Timeline assumption:** First 2–4 weeks after onboarding; adjust with the lead.

---

## In scope (prioritized)

### P0 — Production stability (RN + RPN)

- **Incidents and regressions** on paid learner paths: auth, subscription state, paywall, lesson access, exam pathway scoping (US RN NCLEX-RN, Canada RPN / REx-PN, etc.).  
- **Server-side enforcement** preserved: entitlements, admin/staff RBAC, no “security by hiding UI.”  
- **Data safety:** No unbounded list queries; pagination and caps on hot paths (already codified in rules—defend them during fixes).

### P0 — Build and deployment stability

- **Green CI path:** `typecheck`, targeted tests, `prebuild` / i18n validators, Docker build where used.  
- **Environment parity:** Documented `DATABASE_URL` / `DIRECT_URL` / `NEXTAUTH_*` behavior; no accidental prod writes from local scripts.  
- **Release hygiene:** Small, revertible PRs; verify `verify:dist` / standalone artifacts when touching build.

### P1 — Mobile UX cleanup

- **Learner app surfaces:** Readable nav, no clipped labels, touch targets, overflow on small viewports (marketing + `/app` where applicable).  
- **Fixes are surgical:** No IA overhaul unless explicitly approved.

### P1 — Lesson hub performance

- **RN and RPN lesson listings:** Server pagination, avoid heavy JSON on list cards, preserve cache semantics for private learner routes.  
- **Align with** `.cursor/rules/rn-lesson-library-safety.mdc` and global engineering constraints.

### P1 — CAT / practice exams / flashcards consistency

- **Single source of truth** for exam-style questions: pathway-scoped `ExamQuestion` pools; ECG/video/special modalities **not** mixed into default pools unless scoped.  
- **Diagnostics:** Use `npm run audit:core-apis` and API telemetry patterns; empty states must be **explainable** (not silent fake counts).  
- **Regression tests** around hydrate contracts for practice tests (linear vs CAT).

### P2 — Blog quality repair

- **SEO and quality gates:** Thin posts, duplicate intent, broken canonical/hub links—use existing blog audit scripts where possible.  
- **Admin generation:** Reliability of pipelines and publish gates—not a rewrite of the CMS.

### P2 — Admin visibility

- **Diagnostics dashboards** and admin routes: accurate counts, actionable errors, no false “green” when DB is empty or degraded.  
- **Operational logs** for content and study surfaces (without PII in public tickets).

### P2 — Environment and Prisma drift prevention

- **PR discipline:** Migrations + `schema.prisma` stay in sync; no “schema-only” drive-by edits.  
- **Optional:** Regenerate internal truthpack / contract docs if the team uses that workflow (`vibecheck truthpack` when applicable).

---

## Out of scope (phase one)

Unless **explicitly** approved by product + engineering leads for a narrow hotfix:

| Item | Reason |
|------|--------|
| **Major new feature systems** | Diverts from stabilization; increases regression risk. |
| **Full ECG expansion** | Specialized modality; scope and entitlement rules need their own program. |
| **Full multilingual expansion** | i18n shard and compile pipeline are fragile—stabilization only (fix breaks, missing keys) unless a dedicated epic exists. |
| **Major architecture rewrites** | Only if required for **production stability** (e.g., unblock memory or security)—needs written ADR and rollback plan. |
| **Large-scale content rewrites** | Use chunked jobs and dedupe; not “replace entire catalog in one PR.” |
| **Pricing / packaging experiments** | Coordinate with business; touches Stripe and public trust. |

---

## Success criteria (phase one)

1. **RN and RPN** primary flows pass smoke + spot E2E after each risky merge.  
2. **Build and deploy** reproducible on a clean machine / CI with documented env **names**.  
3. **No regressions** on surfaces listed in `reports/do-not-break-surfaces.md`.  
4. **Measurable** improvement in one hub performance metric **or** documented baseline + next step (if measurement not yet wired).  
5. **Issue backlog** triaged in `reports/known-issues-inventory.md` (update as you learn).

---

## Escalation

- **Revenue down / auth broken / paywall open:** Page on-call immediately; freeze unrelated merges.  
- **SEO emergency** (indexing, sitemap): coordinate with lead before mass `robots` / canonical changes.  

This document is the **scope contract** for phase one; scope creep belongs in a new doc or epic.
