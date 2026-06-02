# Clinical Media — Practice Questions Audit

**Date:** 2026-06-02  
**Phase:** 2 of 4 — Practice Question + CAT Embedding

---

## What Changed

Two files implement the audio exhibit pipeline for practice questions and CAT:

| File | Change |
|---|---|
| `src/lib/questions/clinical-audio-exhibit.ts` | New file — parses `exhibitData.clinicalAudio` from ExamQuestion JSON field |
| `src/components/student/practice-test-runner/practice-test-runner-board-parts.tsx` | `PracticeTestQuestionMediaBlock` now renders `ClinicalAudioBlock` alongside ECG strips and clinical images |

---

## Exhibit Data Schema

Add to any ExamQuestion's `exhibitData` column:

```json
{
  "clinicalAudio": {
    "soundId": "wheezes",
    "soundKind": "respiratory",
    "displayName": "Wheeze — auscultated on exam",
    "placement": "stem",
    "showSignificance": true,
    "showAuscultationSite": false,
    "secondary": {
      "soundId": "rhonchi",
      "soundKind": "respiratory",
      "displayName": "Rhonchi — secretion overload"
    }
  }
}
```

`placement` values:
- `"stem"` — shown before answer choices (question phase + post-submit)
- `"post_stem"` — same as stem but label makes intent explicit
- `"rationale"` — shown only after submit/reveal (post-submit phase only)

---

## Questions Identified for Audio Embedding

### From static content files (tier2, tier3, CNPLE NGN, PN gap)

| Question Key | File | Topic | Auscultation Cue | Recommended Sound |
|---|---|---|---|---|
| `heart-failure-fluid-overload` | tier2 | Heart failure | "new crackles at the lung bases" | `fine-crackles` (respiratory) |
| `asthma-worsening` | tier2 | Asthma | "still has wheezing" | `wheezes` (respiratory) |
| `respiratory-distress-pneumonia` | tier2 | Respiratory | "diminished bilaterally" (tier3 scenario) | `vesicular` (respiratory) |
| Tier3 cardiogenic shock | tier3 | Shock | "crackles are present bilaterally" | `coarse-crackles` (respiratory) |
| Tier3 inhalation injury | tier3 | Airway | "stridor" after burns | `stridor` (respiratory) |
| CNPLE HF exacerbation | cnple | Heart failure | "crackles at both lung bases" | `fine-crackles` (respiratory) |
| CNPLE pediatric asthma | cnple | Pediatrics | "wheeze is now faint" (critical finding) | `wheezes` + `expiratory-wheeze` (respiratory) |
| `pn-cardiac-med-006` | pn-gap | Digoxin | "respiratory assessment for wheezing" (distractor context) | `wheezes` (respiratory) |

### ExhibitData patterns for these questions

**`heart-failure-fluid-overload` (tier2):**
```json
{
  "clinicalAudio": {
    "soundId": "fine-crackles",
    "soundKind": "respiratory",
    "displayName": "Fine crackles — bilateral basal",
    "placement": "stem",
    "showSignificance": true
  }
}
```

**`asthma-worsening` (tier2):**
```json
{
  "clinicalAudio": {
    "soundId": "wheezes",
    "soundKind": "respiratory",
    "displayName": "Wheeze — persistent after rescue inhaler",
    "placement": "stem",
    "showSignificance": true
  }
}
```

**Tier3 cardiogenic shock:**
```json
{
  "clinicalAudio": {
    "soundId": "coarse-crackles",
    "soundKind": "respiratory",
    "displayName": "Bilateral crackles — pulmonary oedema",
    "placement": "stem",
    "showSignificance": true,
    "secondary": {
      "soundId": "s3",
      "soundKind": "cardiac",
      "displayName": "S3 gallop — cardiogenic shock"
    }
  }
}
```

**Tier3 inhalation injury (stridor):**
```json
{
  "clinicalAudio": {
    "soundId": "stridor",
    "soundKind": "respiratory",
    "displayName": "Stridor — upper airway obstruction emergency",
    "placement": "stem",
    "showSignificance": true,
    "showAuscultationSite": true
  }
}
```

---

## Questions from the DB Bank That Should Receive Audio

The following DB question tag patterns are candidates. Set `exhibitData` as above:

| Tag pattern | Sound | Rationale |
|---|---|---|
| `topic: "Respiratory Assessment"` | `wheezes`, `fine-crackles`, `rhonchi` | Auscultation is primary skill |
| `topic: "Heart Failure"` + difficulty ≥ 2 | `s3`, `fine-crackles` | S3 and crackles are cardinal HF findings |
| `topic: "Asthma"` | `wheezes`, `expiratory-wheeze` | Wheeze identification is exam-tested |
| `topic: "COPD"` | `wheezes`, `rhonchi` | Chronic airflow limitation sounds |
| `topic: "Pneumonia"` | `bronchial`, `fine-crackles` | Consolidation breath sounds |
| `topic: "Pericarditis"` | `pericardial-friction-rub` | Friction rub is the classic finding |
| `topic: "Endocarditis"` | `mitral-regurgitation`, `aortic-regurgitation` | New murmur = key diagnostic |
| `topic: "Angina"` + difficulty ≥ 2 | `s4` | S4 heard during ischemic episodes |
| `topic: "Cardiac Assessment"` | `s1`, `s2`, `s3`, `s4` | Full assessment suite |
| `tags: ["stridor"]` | `stridor` | Upper airway emergency |
| `tags: ["bronchiolitis"]` | `wheezes`, `fine-crackles` | Pediatric lower airway |

---

## Rendering Pipeline

```
ExamQuestion.exhibitData = { clinicalAudio: { ... } }
         ↓
PracticeTestQuestionMediaBlock (practice-test-runner-board-parts.tsx)
         ↓
parseClinicalAudioExhibit(exhibitData)   → ClinicalAudioExhibit | null
         ↓
ClinicalAudioBlock (compact=false, full panel with play button)
+ optional secondary ClinicalAudioBlock
         ↓
Rendered BEFORE EcgVideoQuestionMedia, BEFORE ClinicalImageGallery
```

**Phase logic:**
- `placement: "stem"` → shown in **pre_submit** and **post_submit** phases
- `placement: "rationale"` → shown only in **post_submit** phase (after the learner answers)
- CAT exam mode (`mode: "cat"`) follows same placement rules

---

## Performance Assessment

| Concern | Impact | Mitigation |
|---|---|---|
| Audio synthesis on question load | Minimal — WebAudio context is lazy-initialized only on Play | ClinicalAudioBlock does NOT auto-play; learner explicitly presses Play |
| Concurrent audio + ECG strip | None — audio is WebAudio, ECG is video element; different audio stacks | Both render independently |
| SSR serialisation overhead | None — ClinicalAudioBlock is `"use client"`, not rendered on server | Audio context only created after hydration |
| Bundle size | +0 kB for audio data (already bundled in lesson pages); +~2 KB for exhibit parser | Exhibit parser is a tiny utility module |
| CAT adaptive scoring accuracy | No impact — audio embed is display-only; does not affect answer submission or scoring | exhibitData field is not read by the CAT engine |

---

## Not Tagged (Practice Questions)

| Scenario | Why excluded |
|---|---|
| Sepsis / tachycardia questions | Tachycardia alone is not an auscultation teaching moment |
| Postoperative bleeding | Hypotension — cardiovascular but not auscultation-focused |
| Stroke questions | Neurological — no auscultation |
| Medication safety (non-cardiac) | No direct auscultation link |
| Tier 1 foundational questions | Foundational questions focus on actions, not auscultation identification |
