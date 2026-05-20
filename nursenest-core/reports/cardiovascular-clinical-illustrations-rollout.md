# Cardiovascular Clinical Illustration Rollout

Date: 2026-05-08

## Scope

Added a reusable premium cardiovascular illustration system for NurseNest pathway lessons without editing lesson JSON, changing slugs, changing routes, changing entitlements, or touching the NurseNest logo.

## Architecture

- Assets live under `public/clinical-illustrations/cardiovascular/`.
- Metadata and lesson mapping live in `src/content/clinical-illustrations/cardiovascular/index.ts`.
- Lesson rendering reuses the existing `resolveLessonImage()` and `LessonClinicalImageCard` pipeline.
- The registry resolves before legacy inventory fallback, so curated cardiovascular visuals win for mapped cardiovascular lessons.
- Existing lesson source of truth remains `PathwayLesson` / catalog / DB loader.

## Assets Created

15 small SVG illustrations:

- Heart Failure
- Acute Coronary Syndrome
- Myocardial Infarction
- Coronary Artery Disease
- Hypertension
- Atrial Fibrillation
- Cardiac Output / Hemodynamics
- Shock States
- Valve Disorders
- ECG Interpretation Basics
- Cardiac Conduction System
- Heart Anatomy & Blood Flow
- RAAS Activation
- Cardiac Medication Mechanisms
- Perfusion Disorders

## RN Coverage

Representative RN cardiovascular slugs covered by exact mapping:

- `heart-failure-nursing-priorities-hy`
- `acute-coronary-syndrome-gold`
- `clinical-casebook-acs-chest-pain-gold`
- `acute-myocardial-infarction-troponin`
- `atrial-fibrillation-rate-control`
- `atrial-fibrillation-stroke-prevention-gold`
- `hypertensive-crisis-vs-urgency`
- `med-family-antihypertensives-gold`
- `med-family-cardiac-gold`
- `shock-recognition-fluids`
- `shock-emergencies-gold`
- `endocarditis-blood-cultures`
- `pericarditis-ecg-clues`
- `cardiac-tamponade-nclex-rn`
- `cabg-and-postoperative-cabg-complications-nclex-rn`
- `dvt-pe-nursing-priorities`
- `pulmonary-embolism-nclex-rn`
- `pulmonary-embolism-recognition-gold`
- `abdominal-aortic-aneurysm-nclex-rn`

## RPN / PN / NP Reuse

Representative reuse mappings:

- RPN: `bp26-carpn-x003-heart-failure-discharge-teaching` -> Heart Failure
- PN: `bp26-uslpn-pa-chf-volume` -> Heart Failure
- RPN: `bp26-carpn-pa-afib-rate` -> Atrial Fibrillation
- PN: `bp26-uslpn-pa-shock-classify` -> Shock States
- NP: `np-heart-failure-primary-care-gold` -> Heart Failure
- NP: `fnp-adult-hypertension-intensification` -> Hypertension
- NP: `fnp-overlay-shock` -> Shock States

## Performance Safeguards

- SVG assets are small, same-origin, lazy-loaded through the existing lesson image component.
- `SafeLessonRemoteImage` keeps `loading="lazy"` and `decoding="async"`.
- Existing image URL guard was preserved and already accepts same-origin SVG paths.
- No large PNG payloads were added.
- No client-side resolver or Prisma import was added.

## Validation

Passed:

- `npm run typecheck:critical`
- `node --import tsx --test src/content/clinical-illustrations/cardiovascular/cardiovascular-clinical-illustrations.test.ts src/lib/lessons/lesson-image-map.test.ts`

Targeted HTTP route checks attempted:

- 5 RN lesson URLs returned HTTP 200.
- 2 RPN/PN lesson URLs returned HTTP 200.
- 2 NP lesson URLs returned HTTP 200.

Browser visual validation was blocked by an existing lesson-detail runtime fallback in local dev:

- `NEXT_HTTP_ERROR_FALLBACK;404` from `PathwayLessonDetailPageBody`
- metadata also logged: `[pathway-lesson] expandToStandardFiveSections: blocked — incoming sections are authoritative; use the premium normalization path (PathwayLesson.sections only).`
- local DB drift also logged: `The column pathway_lessons.allied_profession_key does not exist in the current database.`

Because of that unrelated local route state, the captured lesson screenshots show the marketing error boundary rather than the lesson body.

Generated screenshots:

- `reports/cardiovascular-illustration-heart-failure-rn.png`
- `reports/cardiovascular-illustration-heart-failure-np.png`

## Remaining Gaps

- Convert SVG assets to WebP/AVIF later if the production asset policy requires raster-only illustrations.
- Add inline mechanism placement after the live lesson page error boundary is fixed.
- Add non-cardiovascular illustration registries after this cardiovascular system is reviewed.
