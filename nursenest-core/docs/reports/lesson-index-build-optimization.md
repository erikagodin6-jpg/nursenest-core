# Lesson Index Build Optimization

Generated: 2026-05-10

## Summary

The verifier now supports explicit deep, changed-pathway, and lightweight deploy verification modes. Deep verification remains the default. Lightweight and changed-only behavior is opt-in through env vars and keeps schema, required allied index presence, manifest hash/count checks, raw-count drift checks, public lesson route href checks, and total row accounting.

## Controls

- `NN_DEEP_LESSON_VERIFY=1`: force deep live-parity verification for every generated pathway. This is the default behavior when no fast-path env is set.
- `NN_SKIP_HEAVY_LESSON_VERIFY=1`: run manifest/schema/raw-count/detail-route checks and skip live parity plus coverage normalization.
- `NN_VERIFY_CHANGED_PATHWAYS_ONLY=1`: deep-verify only pathway IDs listed in `NN_CHANGED_LESSON_PATHWAYS`.
- `NN_CHANGED_LESSON_PATHWAYS=us-rn-nclex-rn,ca-rn-nclex-rn`: optional comma-separated list used by changed-only mode. If omitted, changed-only mode falls back to deep-safe verification.

## Manifest

`src/content/pathway-lessons/generated-indexes/manifest.json` is generated next to the pathway JSON files. Each entry records:

- `pathwayId`
- `fileName`
- `sourceFingerprint`
- `fileHash`
- `lessonCount`
- `generatedAt`
- `verifiedAt` after verification

The verifier rejects missing manifest entries, file hash drift, and lesson count drift when a manifest is present.

## Timing Evidence

Local timing from this pass:

| Command | Mode | Result |
| --- | --- | --- |
| `npm run build:lesson-indexes` | generation | `totalBuildMs=102858`, `totalIndexedLessons=3090`, heap ~147 MB |
| `NN_SKIP_HEAVY_LESSON_VERIFY=1 npm run verify:lesson-indexes` before coverage optimization | light | `verifyMs=57790`, still bottlenecked by coverage normalization |
| `NN_SKIP_HEAVY_LESSON_VERIFY=1 npm run verify:lesson-indexes` after coverage optimization | light | `verifyMs=186`, `manifestVerifiedPathways=9`, `deepVerifiedPathways=0`, heap ~142 MB |
| `NN_VERIFY_CHANGED_PATHWAYS_ONLY=1 NN_CHANGED_LESSON_PATHWAYS=us-rn-nclex-rn npm run verify:lesson-indexes` | changed-only | `verifyMs=29842`, `manifestVerifiedPathways=9`, `deepVerifiedPathways=1`, heap ~183 MB |

An accidental full verification run also completed successfully during test isolation work, confirming the default deep path still runs end to end.

## Guarantees Preserved

- Generated index files still parse through `parsePathwayLessonGeneratedIndexV1`.
- Required allied pathway files are still checked in every mode.
- Generated files must still correspond to known catalog pathway IDs.
- `mergedRawLessonCount` is still checked against live raw catalog rows in every mode.
- Public marketing lesson detail href shape is still checked in every mode.
- Deep verification still validates summary parity, slug parity, marketing effective slug parity, coverage collapse, exclusion reasons, allied profession mappings, and route metadata.

## Residual Risks

- Lightweight mode intentionally skips live parity and coverage normalization. Use it only for deployment-time speed where a prior deep/CI verifier has already validated the generated artifact source.
- Changed-only mode needs an accurate `NN_CHANGED_LESSON_PATHWAYS` list from CI or the caller. If omitted, it falls back to deep-safe behavior.
- Generation remains the dominant bottleneck locally at ~103s. Further optimization should target normalization of large RN/NP pathways, especially repeated normalized catalog work.
