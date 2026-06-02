# CAT Entry-Point Normalization Audit (2026-04-10)

Scope: CAT routing, gating, CTA semantics, and browser QA for pathway-aware CAT starts.

## Study-loop follow-up audit

This pass extended the CAT normalization beyond marketing entry points into the subscriber study loop:

- rationale fallback lesson links now preserve `pathwayId` when the originating question/session knows it
- `/app/lessons` now honors `pathwayId` topic-filter links, so rationale and weak-area lesson follow-ups stay on the right pathway lesson inventory
- dashboard, readiness, report-card, study-plan, questions, lessons, and practice-tests quick links now use a shared CAT resolver instead of scattering generic `/app/practice-tests/start` fallbacks
- adaptive recommendation CTAs now stay pathway-scoped when possible and explicitly say “Choose a pathway…” when the destination is the in-app chooser
- CAT results weak-area follow-ups now keep pathway context for lesson, drill, weak-focus, and restart CAT links
- weak-area and account remediation links now preserve pathway context for lessons and topic drills where available
- question-bank rationale fallback + end-of-session CAT follow-up now keep pathway-aware destinations

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
- `CAT readiness over time` (`/app/practice-tests/cat-insights`) remains intentionally cross-session and cross-pathway.

### Normalized in this pass

- CAT-labeled weak-focus links now set `cat=1` and preserve pathway context when available.
- Readiness/report-card/account CAT CTAs now use CAT-focused helper routing instead of generic weak-mode.
- Questions / lessons / practice-tests quick-link cards now resolve CAT through the same pathway-aware chooser-or-scope helper.
- Adaptive study recommendations now avoid hiding the chooser behind pathway-specific wording.
- Rationale lesson fallbacks, weak-topic lesson links, and CAT-results follow-up links now preserve pathway context instead of dropping back to generic lesson/drill routes.
- Lesson study-loop sign-in shortcut now returns to the same public pathway CAT page (not a legacy direct app callback).
- Legacy fallback in deprecated lesson CTA no longer routes to generic `/app/practice-tests`; it uses `/app/practice-tests/start`.
- Nursing tier hub CAT copy updated from “CAT Exams” to “CAT prep” to match destination intent.

## Browser QA coverage added

Playwright spec: `e2e/cat-entrypoints.spec.ts`

- `/practice-exams` -> pathway CAT links for US and CA region cookies.
- Sign-in callback returns to same CAT path for US RN, CA RPN, and US FNP.
- Blocked waitlist case (`/canada/np/cnple/cat`) shows unavailable state and keeps lessons/question bank links.
- Allied pathway CAT page (`/us/allied/allied-health/cat`) stays pathway-scoped and validates callback when sign-in CTA is shown.
- Tampered invalid pathway route (`/us/rpn/rex-pn/cat`) renders safe not-found recovery and does not expose a CAT sign-in callback.

Playwright spec: `e2e/lesson-flows.spec.ts`

- Public lesson study-loop CAT links stay pathway-scoped for representative RN / PN / FNP lesson flows.
- Post-lesson “CAT prep · this pathway” CTA stays on the matching pathway surface instead of leaking to a generic CAT entry.

Additional signed-in study-loop normalization is covered in targeted helper/unit tests where browser auth harness coverage is still limited:

- `src/lib/exam-pathways/pathway-cat-flow.test.ts`
- `src/lib/learner/remediation-links.test.ts`
- `src/lib/questions/merge-rationale-lesson-links.test.ts`

## Remaining edge cases

- Some server-rendered quick-link surfaces still rely on server-selected “best pathway” heuristics when a learner has multiple eligible pathways and no explicit preference. Those now resolve to the chooser rather than a misleading scoped CAT link.
- Client-side analytics is normalized for the main client-owned CAT study-loop CTAs; some server-rendered link surfaces still depend on pageview + downstream CAT start events rather than per-click client instrumentation.

## Duplicate readiness work note

Current behavior intentionally keeps defense in depth:

1. Public CAT page checks eligibility/readiness via `cat-eligibility` for UX.
2. CAT creation (`POST /api/practice-tests`) re-runs server readiness and emits structured `CAT_*` failure codes.

Recommendation: keep both checks for correctness/security. A future refactor can share a cached readiness snapshot only if API-level revalidation remains authoritative.
