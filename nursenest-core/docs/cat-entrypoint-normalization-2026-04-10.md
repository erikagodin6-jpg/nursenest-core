# CAT Entry-Point Normalization Audit (2026-04-10)

Scope: CAT routing, gating, CTA semantics, and browser QA for pathway-aware CAT starts.

## Classified CAT entry points

### Correct pathway-aware public CAT entries

- `/practice-exams` CAT strip uses `publicMarketingCatHrefForOffering(...)`.
- Pathway hubs and lesson/public marketing strips route to `/{country}/{role}/{exam}/cat`.
- Public CAT page (`/{country}/{role}/{exam}/cat`) uses server eligibility (`cat-eligibility`) and sign-in callback to the same CAT page.

### Correct signed-in app CAT entries

- `appPathwayCatSessionStartPath(pathwayId)` (`/app/practice-tests/start?pathwayId=...`).
- Dashboard quick-action CAT starts now prefer pathway-specific start links when pathway context exists.
- Report-card and account CAT quick links now route to pathway start when a preferred pathway is available.

### Intentionally generic (kept)

- `/app/practice-tests` history/list/builder surfaces that are explicitly cross-session or multi-mode.
- `/app/practice-tests/start` fallback when no safe preferred pathway is available yet (forces in-app path choice when needed).

### Normalized in this pass

- CAT-labeled weak-focus links now set `cat=1` and preserve pathway context when available.
- Readiness/report-card/account CAT CTAs now use CAT-focused helper routing instead of generic weak-mode.
- Lesson study-loop sign-in shortcut now returns to the same public pathway CAT page (not a legacy direct app callback).
- Legacy fallback in deprecated lesson CTA no longer routes to generic `/app/practice-tests`; it uses `/app/practice-tests/start`.
- Nursing tier hub CAT copy updated from “CAT Exams” to “CAT prep” to match destination intent.

## Browser QA coverage added

Playwright spec: `e2e/cat-entrypoints.spec.ts`

- `/practice-exams` -> pathway CAT links for US and CA region cookies.
- Sign-in callback returns to same CAT path for US RN, CA RPN, and US FNP.
- Blocked waitlist case (`/canada/np/cnple/cat`) shows unavailable state and keeps lessons/question bank links.
- Allied pathway CAT page (`/us/allied/allied-health/cat`) stays pathway-scoped and validates callback when sign-in CTA is shown.
- Tampered invalid pathway route (`/us/rpn/rex-pn/cat`) returns 404.

## Duplicate readiness work note

Current behavior intentionally keeps defense in depth:

1. Public CAT page checks eligibility/readiness via `cat-eligibility` for UX.
2. CAT creation (`POST /api/practice-tests`) re-runs server readiness and emits structured `CAT_*` failure codes.

Recommendation: keep both checks for correctness/security. A future refactor can share a cached readiness snapshot only if API-level revalidation remains authoritative.
