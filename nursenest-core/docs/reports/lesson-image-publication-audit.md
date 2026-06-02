# Lesson Image Publication Audit

Generated: 2026-06-02

## Executive Summary

Users were not seeing many generated lesson images because the lesson image registry advertised object keys that production could not publicly deliver. The renderer received CDN URLs for stale or private DigitalOcean Spaces objects, the browser received `403 application/xml`, and `SafeLessonRemoteImage` correctly hid the failed image to avoid broken placeholders.

This was a publication and registry validation failure, not a lesson UI failure.

## Root Cause

1. `src/config/education-image-inventory.json` contained stale object keys from `data/replit-exports/lesson_images.json`.
2. Most `uploads/images/*` entries returned `403 application/xml` from the public CDN.
3. Manual overrides and `LESSON_IMAGE_MAP` entries were accepted even when their object keys were not present in a public-deliverable inventory.
4. Pathway-prefixed lesson slugs could miss a curated override. Example: `us-rn-acute-coronary-syndrome` could miss the `acute-coronary-syndrome` override and fall through to a generic local illustration.

## Storage Verification

Public CDN base:

`https://nursenest-images.tor1.cdn.digitaloceanspaces.com`

Environment limitation:

Spaces credentials were not available in the local runtime, so direct bucket listing could not be performed. Public delivery was verified through CDN probes.

### Before Fix

- Inventory image count: 50
- Publicly deliverable inventory/mapped keys found: 9
- Public delivery failures found: 49
- Common failure response: `403 application/xml`

Examples of broken public delivery:

- `uploads/images/atopic-dermatitis.webp`
- `uploads/images/osteoporosis.webp`
- `uploads/images/stevens-johnson-syndrome.webp`
- `decels.png`
- `bariatricsurgery.png`
- `cardiacamyloidosis.png`
- `eisenmenger.png`

### Publicly Deliverable Image Keys Confirmed

- `abdominalaorticaneurysm.jpeg`
- `acutecoronarysyndrome.jpeg`
- `atrialfibrillation.jpeg`
- `CABG.jpeg`
- `cardiactamponade.jpeg`
- `cardiacsarcoidosis.png`
- `DVT.png`
- `HypertensiveEncephalopathy.png`
- `InfectiveEndocarditis.png`

## Registry Verification

- Manual override slugs: 138
- Manual override unique object keys: 28
- Lesson image map entries: 17
- Lesson image map unique object keys: 17
- Unique mapped object keys checked after fix: 37
- Mapped keys still not publicly deliverable: 28

Those 28 stale mappings are now excluded from runtime resolution unless they are added back to the verified public inventory.

## Renderer Verification

Files checked:

- `src/app/(app)/app/(learner)/lessons/[id]/page.tsx`
- `src/components/lessons/lesson-clinical-image-card.tsx`
- `src/components/lessons/safe-lesson-remote-image.tsx`
- `src/lib/content/resolve-lesson-image.ts`

Renderer behavior is correct:

- Lesson pages call `resolveLessonImage()`.
- Image data is passed into `LessonClinicalImageCard`.
- `SafeLessonRemoteImage` hides failed remote images to avoid broken placeholders.

Renderer failure count: 0

The visible symptom came from invalid CDN URLs reaching the renderer.

## Runtime Sample

Audit script:

`scripts/audit-lesson-image-publication.mts`

Output:

`reports/lesson-image-publication-audit.json`

After fix:

- Total renderable lessons inspected: 3,229
- Total lessons with resolved image data: 298
- Runtime sample size: 50
- Sample lessons with image data received by renderer: 50
- Sample images publicly delivered: 50
- Sample failures: 0
- Success rate for sampled resolved images: 100%

## Fix Implemented

1. Updated `src/config/education-image-inventory.json` to contain only CDN-verified public image keys.
2. Updated `src/lib/content/resolve-lesson-image.ts` so manual overrides and lesson-image-map matches are only accepted when the object key exists in the verified inventory.
3. Added stripped pathway slug override matching before generic clinical illustration fallback.
4. Added `scripts/audit-lesson-image-publication.mts` for repeatable storage, registry, resolver, and runtime delivery verification.

## Files Changed

- `src/config/education-image-inventory.json`
- `src/lib/content/resolve-lesson-image.ts`
- `scripts/audit-lesson-image-publication.mts`
- `docs/reports/lesson-image-publication-audit.md`

## Remaining Publication Work

The following content groups still appear to exist in registry mappings but are not publicly deliverable from the CDN:

- `uploads/images/*` dermatology, pediatrics, respiratory, and inflammatory images
- Several root-level legacy keys, including `decels.png`, `bariatricsurgery.png`, and `cardiacamyloidosis.png`

To restore those images, upload or republish the original assets with public CDN access, then run the image inventory sync workflow and rerun the audit script.

## Verification

Command:

`node --import tsx scripts/audit-lesson-image-publication.mts`

Result:

- 50 of 50 sampled lessons with resolved images returned valid image responses.
- No broken image placeholders were produced.
- No empty remote image containers were produced by failed CDN assets because stale keys are no longer resolved.

