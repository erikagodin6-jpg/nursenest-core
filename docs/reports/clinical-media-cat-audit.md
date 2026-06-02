# Clinical Media — CAT Pool Audit

**Date:** 2026-06-02  
**Phase:** 3 of 4 — Computerized Adaptive Testing Compatibility

---

## CAT Architecture Summary

The CAT pool (`lib/cat/`) draws from the `ExamQuestion` table. Questions are selected by the IRT-based adaptive engine (`cat-engine.ts`) based on:
- Difficulty estimate (θ parameter)
- Information function
- Exposure control (Sympson-Hetter method)
- Body system / topic coverage targets

The **rendering pipeline is shared** with practice tests. Both use:
- `practice-test-runner-core.tsx` → `PracticeTestQuestionMediaBlock`
- Phase: `"pre_submit"` (before answer) and `"post_submit"` (after answer / review)

Clinical audio embedded via `exhibitData.clinicalAudio` renders automatically in both contexts.

---

## CAT Mode Rendering Verification

| Mode | `mode` prop | Audio placement "stem" | Audio placement "rationale" |
|---|---|---|---|
| Practice / Study | `"practice"` | ✓ Shows on load | ✓ Shows after submit |
| CAT Adaptive Exam | `"cat"` | ✓ Shows on load | ✓ Shows after submit |
| CAT Study Mode | `"cat"` + per-item rationale | ✓ Shows on load | ✓ Shows in rationale panel |
| Post-exam Review | `"cat"` + review phase | ✓ Shows on load | ✓ Shows |

**No CAT-specific code changes required.** The `PracticeTestQuestionMediaBlock` already handles both modes. Audio placement follows the existing `phase` pattern used by ECG strips.

---

## CAT Pool Eligibility Criteria

Questions are eligible for clinical audio embedding when:

1. **The question stem contains or implies an auscultation finding** — "you auscultate...", "breath sounds reveal...", "on cardiac exam..."
2. **The correct answer turns on sound recognition** — not just symptom management
3. **The sound can be synthesized** — all 23 sounds in the registry are available
4. **The question difficulty is ≥ 2** — foundational (tier 1 / difficulty 1) questions are usually action-first and audio adds noise

---

## Question Pool Analysis by Body System

### Respiratory Pool (estimated eligible for audio)

| Question type | Example stem structure | Eligible sound | CAT weight |
|---|---|---|---|
| Breath sound recognition | "You auscultate bilaterally and hear…" | `wheezes`, `rhonchi`, `fine-crackles` | High — direct assessment skill |
| Worsening respiratory status | Scenario with wheezing that changes | `expiratory-wheeze` + `wheezes` | Medium |
| Stridor identification | Upper airway emergency scenario | `stridor` | High — safety-critical |
| Pneumonia consolidation | Bronchial breath sounds in periphery | `bronchial`, `fine-crackles` | Medium |
| ARDS / severe hypoxia | Diminished sounds bilaterally | `vesicular` (diminished reference) | Medium |
| Pleural effusion | Breath sounds absent at base | `vesicular` (reference normal) | Medium |

### Cardiac Pool (estimated eligible for audio)

| Question type | Example stem structure | Eligible sound | CAT weight |
|---|---|---|---|
| Heart failure exacerbation | "On auscultation you hear an S3…" | `s3` | High — classic exam finding |
| Pericarditis assessment | "Friction rub heard at…" | `pericardial-friction-rub` | High |
| Endocarditis complication | "New systolic murmur develops…" | `mitral-regurgitation` | High |
| Angina during ischemia | "Patient reports chest tightness; S4 heard" | `s4` | Medium |
| Aortic stenosis | "Systolic ejection murmur heard at RUSB" | `aortic-stenosis` | Medium |
| AFib recognition | "Irregularly irregular apical pulse" | `s1` (irregular timing) | Medium |

---

## Adaptive Engine Compatibility

| Component | Affected by audio? | Assessment |
|---|---|---|
| IRT item selection (`cat-engine.ts`) | No | `exhibitData` not read by engine |
| Difficulty estimation | No | Based on response accuracy, not content |
| Exposure control | No | Keyed on question ID, not media type |
| Termination criteria | No | Based on SE / information threshold |
| CAT scoring | No | Audio is display-only; answer options unchanged |
| Session persistence | No | `exhibitData` stored in question row, not session |
| Session replay | No | Audio re-renders from same exhibitData |

**Zero risk to adaptive accuracy.** Audio blocks are purely presentational and isolated from the scoring and selection pipeline.

---

## Performance in CAT Context

CAT sessions have strict latency requirements (next item should appear within 200–400ms of submission). Audio blocks do not affect this because:

1. **No network request** — synthesis is client-side via WebAudio API
2. **No auto-play** — audio context is not created until the learner presses Play
3. **No blocking render** — `ClinicalAudioBlock` is a lightweight client component (~3 KB JS)
4. **Existing ECG strip** — if a question already has an ECG video (which does block on network), audio adds no incremental latency

| Metric | ECG strip question | Audio-only question |
|---|---|---|
| Additional network request | 1 video request (existing) | 0 |
| JS bundle delta | 0 (already bundled) | 0 |
| Render blocking | None (video lazy-loads) | None |
| Time to interactive | Unchanged | Unchanged |

---

## Recommended CAT Tagging Workflow

1. **Query questions by topic** — filter for respiratory/cardiac body systems with difficulty ≥ 2
2. **Review stems** — identify questions where sound recognition changes the correct answer
3. **Set `exhibitData`** — add `{ clinicalAudio: { soundId, soundKind, placement: "stem" } }` via admin panel
4. **Verify rendering** — open question in practice test preview to confirm audio block renders
5. **Monitor answer distribution** — re-run psychometric analysis after 500+ exposures to confirm audio does not change item difficulty statistics unexpectedly

---

## Questions NOT Suitable for CAT Audio

| Scenario | Reason |
|---|---|
| Questions where the sound name appears in the stem | Audio would give away the answer |
| Questions where the answer is a nursing action (not identification) | Sound is context, not the test target |
| Tier 1 / difficulty 1 questions | Foundational — identification is secondary to action priority |
| Questions with 5+ answer options or complex branching | UI space for audio block would compete with answer list |
