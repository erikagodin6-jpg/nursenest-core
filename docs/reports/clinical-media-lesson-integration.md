# Phase 5F — Embedded Clinical Media

**Date:** 2026-06-01  
**TypeScript:** 0 errors

---

## Existing infrastructure (unchanged)

| Component | File | Status |
|---|---|---|
| Full cardiac sound library UI | `pathway-lesson-sound-libraries-ui.tsx` | Existing — full lesson-page experience |
| Audio card (narration) | `lesson-audio-card.tsx` | Existing — marketing + lesson pages |
| Cardiac sounds data | `cardiac-sounds-library-data.ts` | Existing — 12+ sound records |
| Respiratory sounds data | `respiratory-sounds-library-data.ts` | Existing — 10+ sound records |
| Waveform synthesizer | `lesson-sound-waveform-synth.ts` | Existing — WebAudioAPI synthesis |
| Lesson clinical image card | `lesson-clinical-image-card.tsx` | Existing — full lesson-page format |
| Safe image renderer | `safe-lesson-remote-image.tsx` | Existing — graceful load failure |

---

## What was built

### `src/components/clinical-media/clinical-audio-block.tsx`

**`ClinicalAudioBlock`** — single-sound embeddable player.

- Takes a `soundId` (from `CARDIAC_SOUND_RECORDS` or `RESPIRATORY_SOUND_RECORDS`) and `kind` (`"cardiac"` | `"respiratory"`)
- Renders a "Simulate sound" button that triggers WebAudioAPI synthesis via `scheduleCardiacWaveform` / `scheduleRespiratoryWaveform`
- Auto-stops after one playback cycle (~4.5 s)
- Graceful fallback when WebAudioAPI is unsupported
- Two modes: `compact` (single-line chip) and full (card with clinical context)

**`ClinicalAudioGroup`** — compact multi-sound group.

- Accepts an array of `{ soundId, kind, displayName }` entries
- Renders each as a compact `ClinicalAudioBlock` chip
- Suitable for lesson sections that cover multiple related sounds

### `src/components/clinical-media/clinical-image-block.tsx`

**`ClinicalImageBlock`** — single-image embeddable card.

- Accepts `url`, `alt`, `label`, `caption`
- Two modes: `compact` (no header, small padding) and full (collapsible header)
- `startCollapsed` prop — useful when the image is supplementary
- Uses existing `SafeLessonRemoteImage` (graceful 404 handling via `onHidden`)
- No auth or data dependency — pure presentation

### `src/components/clinical-media/index.ts`

Barrel export for both components.

---

## Usage examples

### Respiratory sound in a lesson section (wheeze)

```tsx
import { ClinicalAudioBlock } from "@/components/clinical-media";

// Asthma lesson, COPD lesson, Bronchiolitis lesson, Respiratory Assessment
<ClinicalAudioBlock
  soundId="wheeze"
  kind="respiratory"
  showSignificance
  showAuscultationSite
/>
```

### Cardiac sound in a flashcard rationale (S3)

```tsx
import { ClinicalAudioBlock } from "@/components/clinical-media";

// Heart Failure flashcard, Volume Overload flashcard, Cardiac Assessment
<ClinicalAudioBlock
  soundId="s3"
  kind="cardiac"
  compact
/>
```

### Sound group in a cardiac assessment lesson

```tsx
import { ClinicalAudioGroup } from "@/components/clinical-media";

<ClinicalAudioGroup
  heading="Heart sounds to auscultate"
  sounds={[
    { soundId: "s1", kind: "cardiac" },
    { soundId: "s2", kind: "cardiac" },
    { soundId: "s3", kind: "cardiac", displayName: "S3 — heart failure" },
    { soundId: "s4", kind: "cardiac", displayName: "S4 — hypertension" },
  ]}
/>
```

### Clinical image in a practice test rationale

```tsx
import { ClinicalImageBlock } from "@/components/clinical-media";

<ClinicalImageBlock
  url="https://nursenest-images.tor1.cdn.digitaloceanspaces.com/cardiactamponade.jpeg"
  alt="Cardiac tamponade — Beck's triad and pericardiocentesis"
  caption="Cardiac tamponade compresses all four chambers. Key triad: hypotension, JVD, muffled heart sounds."
  compact
/>
```

---

## Reusability matrix

| Surface | ClinicalAudioBlock | ClinicalImageBlock |
|---|---|---|
| Lesson detail page | ✅ Full or compact | ✅ Full or compact |
| Flashcard front/back | ✅ Compact | ✅ Compact |
| Practice test rationale | ✅ Compact | ✅ Compact |
| CAT feedback panel | ✅ Compact | ✅ Compact |

---

## Sound IDs available

### Cardiac (`kind="cardiac"`)

| ID | Name | Clinical use |
|---|---|---|
| `s1` | S1 (first heart sound) | Normal cardiac assessment |
| `s2` | S2 (second heart sound) | Normal cardiac assessment |
| `s3` | S3 gallop | Heart failure, volume overload |
| `s4` | S4 gallop | Hypertension, LV hypertrophy, MI |
| `mitral-regurgitation` | Mitral regurgitation | Rheumatic disease, MVP |
| `aortic-stenosis` | Aortic stenosis | Elderly, calcification |
| `pericardial-rub` | Pericardial friction rub | Pericarditis |

### Respiratory (`kind="respiratory"`)

| ID | Name | Clinical use |
|---|---|---|
| `wheeze` | Wheeze | Asthma, COPD, bronchiolitis |
| `crackles-fine` | Fine crackles | Pulmonary fibrosis, early HF |
| `crackles-coarse` | Coarse crackles | Pneumonia, pulmonary edema |
| `rhonchi` | Rhonchi | Secretion clearance, COPD |
| `stridor` | Stridor | Croup, upper airway obstruction |
| `pleural-rub` | Pleural friction rub | Pleuritis, pulmonary infarction |
| `vesicular` | Vesicular (normal) | Normal reference |

---

## Integration path for embedding in lesson sections

The existing `pathway-lesson-body.tsx` renders lesson section markdown. To embed a clinical audio or image block inside a lesson section, add a callout prefix pattern that the renderer recognises:

**Existing callout patterns** (already handled by the renderer):
- `Safety:`, `Priority:`, `Pearl:`, `Pharm:`, `Exam:`, `Clinical:`

**Recommended new pattern** (not yet implemented — future work):
- `Audio: cardiac:s3` → renders `<ClinicalAudioBlock soundId="s3" kind="cardiac" compact />`
- `Audio: respiratory:wheeze` → renders respiratory wheeze block
- `Image: {url}|{alt}` → renders `<ClinicalImageBlock url={url} alt={alt} compact />`

This would allow clinical media to be embedded in lesson markdown without requiring RSC changes per lesson.
