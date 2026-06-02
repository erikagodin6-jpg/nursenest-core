# Clinical Media — New Library Roadmap

**Date:** 2026-06-02  
**Phase:** 4 of 4 — Missing Libraries Prioritisation

---

## Existing Libraries (baseline)

| Library | Sounds | Status | Surfaces |
|---|---|---|---|
| `respiratory_sounds` | 12 sounds | Production-ready | Lessons, flashcards, practice tests, CAT |
| `cardiac_sounds` | 11 sounds | Production-ready | Lessons, flashcards, practice tests, CAT |

Total: 23 sounds · WebAudio synthesis · no external files for core sounds · 10 respiratory MP4 supplements via `/api/assets/`

---

## Ranked Candidate Libraries

### Rank 1 — ECG Interpretation (Cardiac Rhythm)

**Already partially built.** `EcgLiveStrip` + `EcgVideoQuestionMedia` handle static/animated ECG strips.

| Attribute | Assessment |
|---|---|
| Implementation effort | **Low** — ECG infrastructure already exists; gap is content (more rhythm templates) |
| Learner impact | **Very high** — ECG interpretation is tested on every NCLEX-RN, CNPLE, NP exam |
| Exam relevance | **Critical** — AFib, VTach, heart block, STEMI changes all tested heavily |
| Current state | `EcgLiveStrip` renders 15+ rhythms; `EcgVideoQuestionMedia` handles video strips |
| Gap | Need more rhythm templates and a dedicated ECG flashcard deck |

**Recommended next step:** Author 20 additional ECG strip templates (Holter patterns, 12-lead segments). Link existing strips to 30+ practice questions via `exhibitData.ecgVideo`.

---

### Rank 2 — Chest X-Ray Interpretation

| Attribute | Assessment |
|---|---|
| Implementation effort | **Low** — `ClinicalImageBlock` already renders images; gap is content |
| Learner impact | **High** — pneumothorax, pleural effusion, cardiomegaly, pulmonary oedema patterns are exam standards |
| Exam relevance | **High** — NCLEX-RN Next Gen includes exhibits with CXR images; CNPLE includes X-ray interpretation |
| Current state | `ClinicalImageBlock` is production-ready; `/public/clinical-illustrations/` holds some images |
| Gap | No curated CXR library; no CXR-specific exhibit type |

**Recommended next step:**
1. Create `src/lib/clinical-images/chest-xray-library.ts` with 15–20 annotated CXR definitions
2. Add CXR image files to CDN/public/clinical-illustrations
3. Embed via `ClinicalImageBlock` in pneumothorax, pleural effusion, HF, pneumonia lessons
4. Add to practice questions via `images` field (already supported by `ClinicalImageGallery`)

**Effort estimate:** 2–3 days (content sourcing is the bottleneck, not code)

---

### Rank 3 — Bowel Sounds

| Attribute | Assessment |
|---|---|
| Implementation effort | **Low-Medium** — same architecture as respiratory/cardiac sounds; needs new `bowel_sounds` waveform types |
| Learner impact | **Medium** — tested in abdominal assessment, bowel obstruction, paralytic ileus |
| Exam relevance | **Medium** — less frequently tested than cardiac/respiratory, but present in advanced assessments |
| Current state | None; waveform synthesis engine would need 4–5 new `BowelWaveformId` types |
| Gap | No synthesis waveforms; no content data file |

**Proposed sounds:**
- `normoactive` — normal bowel sounds (5–12/min, low pitch)
- `hyperactive` — high-pitched, frequent (gastroenteritis, early obstruction)
- `hypoactive` — slow, infrequent (paralytic ileus, post-op)
- `absent` — no sounds (late bowel obstruction)
- `borborygmi` — loud rushing (gastroenteritis)

**Effort estimate:** 3–4 days (waveform synthesis + content authoring + library component)

---

### Rank 4 — Ventilator Waveforms

| Attribute | Assessment |
|---|---|
| Implementation effort | **Medium** — ventilator waveform engine already exists (`VentilatorWaveformEngine`); needs lesson integration |
| Learner impact | **High for ICU tracks** — CCRN, NP, and new grad ICU content all include vent management |
| Exam relevance | **Medium-High** — pressure-volume loops, flow-time waveforms tested in critical care |
| Current state | `VentilatorWaveformEngine` built; `MonitorWorkstation` renders waveforms |
| Gap | Not yet embedded inside standard lessons/flashcards/questions; only in dedicated simulation |

**Recommended next step:** Wrap `VentilatorWaveformEngine` in a `VentilatorWaveformBlock` component following `ClinicalAudioBlock` patterns. Embed in 5–8 critical care lessons.

**Effort estimate:** 1–2 days (engine exists; wrapper component + content tagging needed)

---

### Rank 5 — Pediatric Heart Sounds

| Attribute | Assessment |
|---|---|
| Implementation effort | **Low** — extends existing cardiac_sounds library; new sound records + waveform types |
| Learner impact | **Medium** — pediatric cardiology tested in NP, Pediatric RN, and NNP tracks |
| Exam relevance | **Medium** — PDA, ASD, innocent murmurs, coarctation tested on PNP-BC and CCRN-neonatal |
| Current state | `CARDIAC_SOUND_RECORDS` has adult murmurs; no pediatric-specific records |
| Gap | No pediatric waveforms; no pediatric murmur content data |

**Proposed sounds:**
- `innocent-murmur` — Still's murmur (benign in children)
- `pda-murmur` — continuous machinery murmur
- `asd-murmur` — fixed split S2 + soft systolic ejection murmur
- `vsd-murmur` — harsh holosystolic
- `coarctation-bruit` — systolic/continuous, heard posteriorly

**Effort estimate:** 2–3 days (waveform synthesis + content data + lesson tagging for pediatric lessons)

---

### Rank 6 — Skin Assessment Images

| Attribute | Assessment |
|---|---|
| Implementation effort | **Low** — `ClinicalImageBlock` already works; gap is content curation |
| Learner impact | **Medium** — pressure injury staging, wound assessment, rash identification |
| Exam relevance | **Medium** — wound/skin appears in med-surg, geriatric, and community health questions |
| Current state | No curated skin image library |
| Gap | No skin-specific image definitions; no dedicated block component |

**Recommended next step:** Curate 10–15 wound/skin images (pressure injuries stage I–IV, burns, cellulitis, herpes zoster). Embed via `ClinicalImageBlock` in wound care, integumentary, and geriatric lessons.

**Effort estimate:** 1 day code + 2–3 days content curation

---

### Rank 7 — Neurological Assessment Videos

| Attribute | Assessment |
|---|---|
| Implementation effort | **High** — requires video hosting, streaming component, and review workflow |
| Learner impact | **Medium** — NIHSS scoring, cranial nerve testing, pupil assessment |
| Exam relevance | **Medium** — stroke, TBI, and neuro assessments appear in advanced questions |
| Current state | No video infrastructure beyond ECG strips |
| Gap | No video hosting pipeline for clinical assessment videos; access/licensing issues for clinical recordings |

**Recommended next step:** Defer until ECG video infrastructure is proven at scale. Consider using animated illustrations instead of recorded video for initial implementation.

**Effort estimate:** 5–8 days (video hosting, streaming component, accessibility, CORS)

---

## Priority Matrix

| Library | Effort | Impact | Relevance | **Priority** |
|---|---|---|---|---|
| ECG interpretation expansion | Low | Very high | Critical | **P0 — Immediate** |
| Chest X-ray | Low | High | High | **P1 — Next sprint** |
| Ventilator waveforms | Low | High | Medium-high | **P1 — Next sprint** |
| Bowel sounds | Low-medium | Medium | Medium | **P2 — Near-term** |
| Pediatric heart sounds | Low | Medium | Medium | **P2 — Near-term** |
| Skin assessment images | Low | Medium | Medium | **P2 — Near-term** |
| Neurological videos | High | Medium | Medium | **P3 — Deferred** |

---

## Implementation Template (for new libraries)

New audio libraries follow this pattern (copy from respiratory_sounds):

1. **`src/lib/lessons/{name}-sounds-library-data.ts`** — Sound records with id, name, category, waveformType, etc.
2. **`src/lib/lessons/lesson-sound-waveform-synth.ts`** — Add new `{Name}WaveformId` type + synthesis functions
3. **`src/lib/lessons/pathway-lesson-sound-libraries.ts`** — Add new `PathwayEmbeddedSoundLibraryId` value
4. **`src/lib/lessons/lesson-interactive-modules.ts`** — Handle new library in `hydrateSoundLibraryItems()`
5. **`src/content/pathway-lessons/catalog.json`** — Add new library to relevant lessons
6. **`src/lib/flashcards/flashcard-clinical-media-registry.ts`** — Add new sound tags for flashcards

New image libraries:
1. **`src/lib/clinical-images/{name}-image-library.ts`** — Image definitions with url, alt, caption, bodySystem
2. **`src/content/pathway-lessons/catalog.json`** — No changes needed (images embedded via ClinicalImageBlock directly)
3. **Content questions / flashcards** — Add image URL to `clinicalImageUrl` or `exhibitData.images`

---

## Success Metrics

| Metric | Target |
|---|---|
| Lessons with clinical audio | 90 (current) → 120+ after bowel/pediatric |
| Flashcards with audio | 16 (current) → 40+ after content authoring sprint |
| Practice questions with audio | 0 (current) → 15+ after DB tagging sprint |
| CAT questions with audio | 0 (current) → 10+ after tagging sprint |
| Distinct sounds in registry | 23 (current) → 35+ after bowel + pediatric |
