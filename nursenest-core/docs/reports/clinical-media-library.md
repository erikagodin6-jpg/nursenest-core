# Clinical Media Library

Generated: 2026-06-02

## Summary

Implemented a reusable Clinical Media Library at:

- `/app/clinical-media-library`

The library is built from canonical registries instead of a new silo:

- `src/lib/lessons/respiratory-sounds-library-data.ts`
- `src/lib/lessons/cardiac-sounds-library-data.ts`
- `src/lib/clinical-images/clinical-image-library.ts`
- `src/lib/clinical-media/clinical-media-library.ts`

## Uploaded Media Discovered

Respiratory sound uploads already referenced by the existing respiratory registry:

- Vesicular breath sounds: `/api/assets/vesicularlungsounds_1772495979578.mp4`
- Bronchovesicular breath sounds: `/api/assets/bronchovesicular_1772495979578.mp4`
- Bronchial breath sounds: `/api/assets/bronchial_1772495979578.mp4`
- Fine crackles: `/api/assets/finecrackles_1772495979578.mp4`
- Coarse crackles: `/api/assets/coarsecrackles-rales_1772495979578.mp4`
- Inspiratory crackles: `/api/assets/inspiratorycrackles_1772495979578.mp4`
- Wheezes: `/api/assets/wheeze_1772495979578.mp4`
- Expiratory wheeze: `/api/assets/expiratorywheeze_1772495979578.mp4`
- Rhonchi: `/api/assets/rhonchi_1772495979578.mp4`
- Stridor: `/api/assets/stridor_1772495979578.mp4`
- Pleural friction rub: `/api/assets/pleuralrub_1772495979578.mp4`

Clinical image / ECG assets discovered from the existing clinical image registry:

- Atopic Dermatitis
- Conjunctivitis
- Epiglottitis
- Kawasaki Disease
- Retinal Detachment
- ECG Interpretation Basics

No local checked-in audio files were found in this workspace. The respiratory sound registry points to uploaded asset filenames through the existing `/api/assets/{filename}` convention.

## Reusable Assets

Current mapped inventory:

| Content Type | Count |
| --- | ---: |
| Respiratory Sounds | 12 |
| Cardiac Sounds | 11 |
| ECG Strips | 1 |
| Clinical Images | 5 |
| ABG Interpretation | 0 |
| Chest X-rays | 0 |
| Future Audio/Video Assets | 0 |

Respiratory Assessment Module now includes:

- Vesicular
- Bronchovesicular
- Bronchial
- Tracheal
- Fine Crackles
- Coarse Crackles
- Inspiratory Crackles
- Wheezes
- Expiratory Wheeze
- Rhonchi
- Stridor
- Pleural Friction Rub

Cardiac Assessment Module now includes:

- S1
- S2
- S3
- S4
- Aortic stenosis murmur
- Mitral regurgitation murmur
- Aortic regurgitation murmur
- Mitral stenosis murmur
- Clicks
- Opening snap
- Pericardial friction rub

## Missing Mappings

Missing content-type mappings:

- ABG Interpretation
- Chest X-rays
- Future Audio/Video Assets

Missing uploaded audio:

- Tracheal breath sounds currently use the synthesized bronchial/tracheal teaching timbre.
- Cardiac sounds currently use synthesized teaching timbres; no uploaded cardiac sound files were found in the workspace.

## Pathway Coverage

| Pathway | Mapped Assets |
| --- | ---: |
| RN | 29 |
| RPN | 27 |
| PN | 27 |
| NP | 29 |
| RT | 23 |
| ICU | 23 |
| Paramedic | 23 |

Pathway-specific overlays are available for:

- RN
- RPN
- PN
- NP
- RT
- ICU
- Paramedic

## Implementation Notes

The library exposes each asset with:

- media type
- module
- description
- clinical significance
- common causes
- exam tips
- clinical pearl
- location / auscultation site when applicable
- source kind
- pathway overlays

Runtime rendering:

- Uploaded respiratory assets render with a native audio player.
- Cardiac sounds and unmapped respiratory sounds render through the existing WebAudio clinical sound simulator.
- Clinical images and ECG visuals render through the existing clinical image block.
- `/api/assets/{filename}` now has a narrow Next route for local legacy assets or a configured legacy asset base, so uploaded respiratory sound URLs have a handler outside the i18n-only asset route.

Files added or changed:

- `src/lib/clinical-media/clinical-media-library.ts`
- `src/components/clinical-media/clinical-media-library-client.tsx`
- `src/app/(app)/app/(learner)/clinical-media-library/page.tsx`
- `src/app/api/assets/[filename]/route.ts`
- `src/lib/lessons/respiratory-sounds-library-data.ts`
- `src/lib/lessons/cardiac-sounds-library-data.ts`
- `src/components/workspace/workspace-shell.tsx`
- `src/components/workspace/workspace-sidebar.tsx`

## Verification

Registry smoke check:

- Total assets: 29
- Uploaded/audio/image assets discovered: 17
- Missing content-type mappings: 3

Command verification:

- `npm run typecheck:critical` - passed
