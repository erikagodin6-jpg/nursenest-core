# ECG Module Clinical Accuracy Inventory

Date: 2026-05-11
Scope: learner ECG module, admin ECG module, ECG question/rationale content, strip rendering, gating/exclusion behavior, and ECG-related tests/assets.

## Audit method

- Searched the app root for ECG-related routes, components, libraries, admin surfaces, tests, and supporting content.
- Read the primary learner/admin ECG files, question generation/store code, strip renderer, validation helpers, and CAT/practice exclusion logic.
- Cross-checked clinical claims against live external references during the paired accuracy audit.

## Primary learner surface

### Routes and layouts

- `src/app/modules/ecg/page.tsx`
- `src/app/modules/ecg/layout.tsx`
- `src/app/modules/ecg/basic/lessons/page.tsx`
- `src/app/modules/ecg/basic/quizzes/page.tsx`
- `src/app/modules/ecg/basic/worksheets/page.tsx`
- `src/app/modules/ecg/advanced/lessons/page.tsx`
- `src/app/modules/ecg/advanced/video-drills/page.tsx`
- `src/app/modules/ecg/advanced/scenarios/page.tsx`
- `src/app/modules/ecg/advanced/worksheets/page.tsx`
- Related hidden surface: `src/app/modules/ecg-interpretation/layout.tsx`

### Learner UI components

- `src/components/ecg-module/ecg-module-hub.tsx`
- `src/components/ecg-module/ecg-module-page.tsx`
- `src/components/ecg-module/ecg-module-client.tsx`
- `src/components/ecg-module/ecg-module-publication-notice.tsx`
- `src/components/study/ecg-live-strip.tsx`
- `src/components/study/ecg-video-question-media.tsx`

## Admin ECG surface

- `src/app/(admin)/admin/modules/ecg/page.tsx`
- `src/components/ecg-module/admin-ecg-publish-button.tsx`
- `src/app/api/admin/modules/ecg/publish/route.ts`
- `src/app/api/admin/ai/ecg-video-questions/generate/route.ts`
- `src/app/api/admin/ai/drafts/questions/[id]/promote/route.ts`
- Draft helper: `src/lib/ecg-video-quiz/admin-ecg-video-question-draft.ts`

## ECG content and question sources

### Learner-visible ECG question data path

- `src/lib/ecg-module/ecg-question-store.ts`
- `src/app/api/modules/ecg/questions/route.ts`
- `src/app/api/modules/ecg/questions/[id]/answer/route.ts`
- `src/app/api/modules/ecg/worksheets/route.ts`

### Curated and generated ECG question content

- `src/lib/ecg-module/ecg-premium-curated-pack.ts`
- `src/lib/ecg-module/ecg-question-generation.ts`
- `src/lib/ecg-module/ecg-question-dedup.ts`
- `src/lib/ecg-video-quiz/ecg-video-question.ts`

### Rhythm definitions and rendering/validation

- `src/lib/ecg-module/ecg-rhythm-templates.ts`
- `src/lib/ecg-module/ecg-waveform-generator.ts`
- `src/lib/ecg-module/ecg-strip-clinical-validation.ts`

## Gating, entitlement, exclusion, and discovery controls

- `src/lib/ecg-module/ecg-module-config.ts`
- `src/lib/ecg-module/ecg-module.server.ts`
- `src/lib/ecg-module/ecg-module-status.ts`
- `src/lib/ecg-module/ecg-module-readiness.ts`
- `src/lib/ecg-module/ecg-linked-learning.ts`
- `src/lib/practice-tests/cat-pool.ts`
- `src/lib/practice-tests/cat-question-completeness.ts`
- `src/lib/study-question-pool/get-study-question-pool-for-pathway.ts`
- `src/lib/learner/premium-dashboard-launch-tiles.ts`
- `src/lib/modules/hidden-module-preview.test.ts`

## Tests directly relevant to ECG accuracy and gating

### Unit and contract tests

- `src/lib/ecg-module/ecg-deterministic-strip.test.tsx`
- `src/lib/ecg-module/ecg-module-config.test.ts`
- `src/lib/ecg-module/ecg-module-contract.test.ts`
- `src/lib/ecg-module/ecg-premium-curated-pack.contract.test.ts`
- `src/lib/ecg-video-quiz/ecg-video-question.test.ts`
- `src/lib/ecg-video-quiz/admin-ecg-video-question-draft.test.ts`

### E2E tests

- `tests/e2e/ecg-module/ecg-module-learn-flow.spec.ts`
- `tests/e2e/ecg-video-quiz/ecg-video-quiz.spec.ts`
- `tests/e2e/public/homepage-ecg-visual-governance.spec.ts`

## Adjacent ECG-related assets and content not treated as the learner strip source of truth

### Marketing or dashboard references

- `src/components/marketing/home/premium-homepage-ecg.tsx`
- `src/lib/marketing/homepage-premium-ecg-pages-keys.ts`
- `src/components/marketing/pricing-ecg-clarity-block.tsx`
- `src/components/internal-courses/internal-course-ecg-module.tsx`

### Static or blog ECG content

- ECG long-tail content set under `src/content/blog-static-longtail/`, including `ecg-p1-*.md` and related teaching pages.

These files can contain ECG educational claims, but they are not the deterministic strip source used by the ECG learner module itself.

## Highest-priority files for clinical accuracy review

1. `src/lib/ecg-module/ecg-rhythm-templates.ts`
2. `src/lib/ecg-module/ecg-waveform-generator.ts`
3. `src/lib/ecg-module/ecg-strip-clinical-validation.ts`
4. `src/lib/ecg-module/ecg-premium-curated-pack.ts`
5. `src/lib/ecg-module/ecg-question-generation.ts`
6. `src/lib/ecg-module/ecg-question-store.ts`
7. `src/app/api/admin/ai/drafts/questions/[id]/promote/route.ts`
8. `src/lib/ecg-module/ecg-module.server.ts`
9. `src/lib/ecg-module/ecg-module-config.ts`
10. `src/components/study/ecg-live-strip.tsx`

## Initial inventory conclusions

- The ECG module is a gated learner and admin subsystem with its own route family, DB-backed ECG question model, deterministic strip renderer, and readiness and publish machinery.
- ECG is intentionally restricted to RN and NP learner access in the module path and explicitly excluded from CAT and general study pools through dedicated filters.
- The main clinical-risk hotspots are rhythm metadata, deterministic strip generation fidelity, curated and generated ECG question rationales, and admin publication paths that can create ECG rows outside the curated-readiness flow.
