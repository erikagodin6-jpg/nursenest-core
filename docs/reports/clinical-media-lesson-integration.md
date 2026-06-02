# Clinical Media — Lesson Integration Report

**Date:** 2026-06-02  
**Scope:** All clinical audio assets · lesson embeddings · pathway mappings · flashcard/question reuse surface

---

## Architecture

Clinical media lives **inside lessons**, not in separate "Heart Sounds" or "Breath Sounds" pages. Two reusable blocks handle all surfaces:

| Component | File | Surfaces |
|---|---|---|
| `ClinicalAudioBlock` | `src/components/clinical-media/clinical-audio-block.tsx` | Lessons · Flashcards · Practice Tests · CAT |
| `ClinicalAudioGroup` | same | Lessons · Flashcards · Practice Tests · CAT |
| `ClinicalImageBlock` | `src/components/clinical-media/clinical-image-block.tsx` | Lessons · Flashcards · Practice Tests · CAT |

Audio is synthesized client-side via WebAudioAPI — no external file dependency for waveform playback. Pre-recorded MP4 files are served via `/api/assets/{filename}` as supplemental `audioSrc`.

Embedding flows through `embeddedSoundLibraries` in the lesson catalog JSON → `buildLessonInteractiveModules()` → `PathwayLessonInteractiveModules` → `PathwayEmbeddedSoundLibraries` UI.

---

## Discovered Audio Assets

### Respiratory Sound Library (`respiratory_sounds`)

12 sounds · all synthesized · 10 have supplemental MP4 files

| Sound ID | Name | Category | Key Diseases | MP4 |
|---|---|---|---|---|
| `vesicular` | Vesicular breath sounds | Normal | Normal lung | ✓ |
| `bronchovesicular` | Bronchovesicular breath sounds | Normal | Consolidation if peripheral | ✓ |
| `bronchial` | Bronchial (tubular) breath sounds | Normal | Pneumonia, atelectasis | ✓ |
| `tracheal` | Tracheal breath sounds | Normal | Normal over trachea | — |
| `fine-crackles` | Fine crackles | Adventitious | Early pneumonia, HF, ILD | ✓ |
| `coarse-crackles` | Coarse crackles (rales) | Adventitious | Pulmonary edema, secretions | ✓ |
| `inspiratory-crackles` | Inspiratory crackles | Adventitious | ILD, bronchiectasis | ✓ |
| `wheezes` | Wheezes (polyphonic) | Adventitious | **Asthma**, COPD, bronchiolitis | ✓ |
| `expiratory-wheeze` | Expiratory wheeze | Adventitious | **Bronchospasm** (asthma, COPD) | ✓ |
| `rhonchi` | Rhonchi | Adventitious | **COPD**, secretion overload | ✓ |
| `stridor` | Stridor | Adventitious | **Croup**, foreign body, epiglottitis | ✓ |
| `pleural-friction-rub` | Pleural friction rub | Adventitious | Pleuritis, pulmonary embolism | ✓ |

### Cardiac Sound Library (`cardiac_sounds`)

11 sounds · all synthesized · no MP4 files (synthesis only)

| Sound ID | Name | Category | Key Diseases |
|---|---|---|---|
| `s1` | S1 (first heart sound) | Normal | Normal, tachycardia, mitral stenosis |
| `s2` | S2 (second heart sound) | Normal | Normal, pulmonary HTN, ASD |
| `s3` | S3 (ventricular gallop) | Extra sounds | **Heart failure**, **volume overload** |
| `s4` | S4 (atrial gallop) | Extra sounds | Ischemia, **reduced compliance** |
| `aortic-stenosis` | Aortic stenosis murmur | Murmurs | Calcific AS, bicuspid AV |
| `mitral-regurgitation` | Mitral regurgitation | Murmurs | Post-MI, MVP, rheumatic |
| `aortic-regurgitation` | Aortic regurgitation | Murmurs | Aortic root dilation, endocarditis |
| `mitral-stenosis` | Mitral stenosis | Murmurs | Rheumatic heart disease |
| `clicks` | Ejection / non-ejection clicks | Extra sounds | MVP, bicuspid AV |
| `opening-snap` | Opening snap | Extra sounds | Mitral stenosis (pliable valve) |
| `pericardial-friction-rub` | Pericardial friction rub | Abnormal | **Pericarditis**, uremia, post-MI |

---

## Lesson Mappings — Respiratory Sounds

36 lessons assigned `respiratory_sounds`. Sound arrives embedded inside the lesson via the interactive sound library module.

### Wheeze anchor (asthma, COPD, bronchiolitis)

| Slug | Title | Pathways |
|---|---|---|
| `ca-rn-asthma` | Asthma | CA RN |
| `ca-rpn-asthma` | Asthma (REx-PN / PN) | CA RPN |
| `us-rn-asthma` | Asthma | US RN |
| `us-pn-asthma` | Asthma — PN scope | US LPN |
| `asthma-status-asthmaticus` | Asthma: Status Asthmaticus | US RN, CA RN |
| `bp26-uslpn-pa-asthma-exac` | Asthma exacerbation: monitoring | US LPN |
| `ca-rn-copd-respiratory` | COPD | CA RN |
| `ca-rpn-copd-respiratory` | COPD & respiratory basics | CA RPN |
| `us-rn-copd-respiratory` | COPD | US RN |
| `us-pn-copd-respiratory` | COPD & respiratory basics | US LPN |
| `copd-exacerbation-oxygen` | COPD: Exacerbation & Oxygen | US RN, CA RN |
| `copd-home-care` | COPD Home Care | CA RPN, US LPN |
| `bp26-uslpn-pa-copd-exac` | COPD exacerbation: oxygen & WOB | US LPN |
| `us-rn-pediatric-respiratory-asthma-croup-bronchiolitis` | Pediatric Respiratory Emergencies — Asthma, Croup & Bronchiolitis | US RN, CA RN |

### Assessment anchor

| Slug | Title | Pathways |
|---|---|---|
| `respiratory-assessment-ngn` | Respiratory Assessment & Oxygenation | US RN |
| `fnp-overlay-respiratory-acute` | COPD, asthma, ARDS, pneumonia, PE — NP overlay | US NP |

### Pleural / effusion

| Slug | Title | Pathways |
|---|---|---|
| `bp26-carpn-x006-pleural-effusion-breath-sounds-positioni` | Pleural effusion: breath sounds & positioning | CA RPN |
| `pleural-effusion-chest-tubes` | Pleural Effusion & Chest Tubes | US RN, CA RN |

### Pneumonia (bronchial sounds, crackles over consolidation)

| Slug | Title |
|---|---|
| `ca-rn-pneumonia` | Pneumonia |
| `ca-rpn-pneumonia` | Pneumonia |
| `us-rn-pneumonia` | Pneumonia |
| `us-pn-pneumonia` | Pneumonia — PN scope |
| `pneumonia-oxygenation` | Pneumonia & Oxygenation |
| `bp26-uslpn-pa-pneumonia-curbs` | Pneumonia — NCLEX-PN |

### ARDS (diffuse crackles, lost normal sounds)

| Slug | Title |
|---|---|
| `ca-rn-ards` | ARDS |
| `ca-rpn-ards` | ARDS |
| `us-rn-ards` | ARDS |
| `us-pn-ards` | ARDS — PN scope |
| `ards-ventilation-basics` | ARDS: Ventilation Basics |

---

## Lesson Mappings — Cardiac Sounds

44 lessons assigned `cardiac_sounds`.

### S3 anchor — heart failure, volume overload

| Slug | Title | Pathways |
|---|---|---|
| `ca-rn-heart-failure` | Heart Failure: Assessment & Management | CA RN |
| `ca-rpn-heart-failure` | Heart failure (REx-PN / PN) | CA RPN |
| `us-rn-heart-failure` | Heart Failure: Assessment & Management | US RN |
| `us-pn-heart-failure` | Heart failure — PN scope | US LPN |
| `heart-failure-nursing-priorities-hy` | Heart Failure: Prioritization & Safety | US RN, CA RN |
| `heart-failure-monitoring` | Heart Failure Monitoring | CA RPN, US LPN |
| `bp26-uslpn-pa-chf-volume` | Heart failure: volume overload cues | US LPN |
| `bp26-carpn-x003-heart-failure-discharge-teaching` | Heart failure discharge teaching | CA RPN |
| `fnp-overlay-heart-failure` | Heart failure — NP diagnosis & management | US NP |
| `edema-daily-weights` | Edema & Daily Weights | CA RPN, US LPN |

### Assessment anchor

| Slug | Title |
|---|---|
| `cardiovascular-prioritization` | Cardiovascular prioritization |

### MI / ACS (S3 complication, post-MI murmurs)

| Slug | Title |
|---|---|
| `ca-rn-myocardial-infarction` | Myocardial Infarction: Recognition |
| `ca-rpn-myocardial-infarction` | Myocardial infarction (REx-PN / PN) |
| `us-rn-myocardial-infarction` | Myocardial Infarction: Recognition |
| `us-pn-myocardial-infarction` | Myocardial infarction — PN scope |
| `acute-myocardial-infarction-troponin` | MI: Recognition & Troponin |
| `acute-coronary-syndrome-nclex-rn` | Acute Coronary Syndrome |
| `bp26-carpn-x001-stemi-vs-nstemi-first-nursing-moves` | STEMI vs NSTEMI: first nursing moves |
| `fnp-overlay-myocardial-infarction` | MI / ACS — NP overlay |

### Angina (S4 during ischemia)

| Slug | Title |
|---|---|
| `ca-rn-angina` | Angina |
| `ca-rpn-angina` | Angina (REx-PN / PN) |
| `us-rn-angina` | Angina |
| `us-pn-angina` | Angina — PN scope |
| `bp26-carpn-x002-angina-vs-infarction-data-that-changes-r` | Angina vs infarction |

### Friction rubs + murmurs (pericarditis, endocarditis)

| Slug | Title |
|---|---|
| `endocarditis-blood-cultures` | Endocarditis |
| `infective-endocarditis-nclex-rn` | Infective Endocarditis |
| `pericarditis-ecg-clues` | Pericarditis: ECG Clues |
| `cardiac-tamponade-nclex-rn` | Cardiac Tamponade (distant muffled sounds) |

### Rhythm / surgical monitoring

| Slug | Title |
|---|---|
| `atrial-fibrillation-rate-control` | Atrial Fibrillation: Rate Control |
| `atrial-fibrillation-nclex-rn` | Atrial Fibrillation |
| `bp26-carpn-pa-afib-rate` | Atrial fibrillation: rate vs rhythm focus |
| `cabg-and-postoperative-cabg-complications-nclex-rn` | CABG |

---

## Lessons With Both Libraries

10 lessons where the presentation spans respiratory and cardiac auscultation.

| Slug | Title | Rationale |
|---|---|---|
| `ca-rn-pulmonary-embolism` | Pulmonary Embolism: Acute Care | Right heart strain (S3) + decreased breath sounds |
| `us-rn-pulmonary-embolism` | Pulmonary Embolism: Acute Care | Same |
| `dvt-pe-nursing-priorities` | DVT & Pulmonary Embolism: Priorities | Same |
| `ca-rn-shock` | Shock | Cardiogenic S3 + pulmonary crackles |
| `ca-rpn-shock` | Shock (REx-PN / PN) | Same |
| `us-rn-shock` | Shock | Same |
| `us-pn-shock` | Shock — PN scope | Same |
| `shock-recognition-fluids` | Shock: Recognition & Fluids | Same |

---

## Pathway Summary

| Pathway | Resp only | Cardiac only | Both | Total with audio |
|---|---|---|---|---|
| CA RN (NCLEX-RN Canada) | 9 | 16 | 4 | 29 |
| CA RPN (REx-PN Canada) | 9 | 10 | 2 | 21 |
| US RN (NCLEX-RN) | 9 | 15 | 4 | 28 |
| US LPN (NCLEX-PN) | 9 | 7 | 2 | 18 |
| US NP (FNP) | 1 | 2 | 0 | 3 |
| **Total** | **36** | **44** | **10** | **90** |

---

## Flashcard Reuse

Use `ClinicalAudioBlock` directly in any flashcard back panel. No wiring required — the component is self-contained.

| Sound | Flashcard deck |
|---|---|
| `wheezes` (respiratory) | Asthma, COPD, pediatric respiratory decks |
| `expiratory-wheeze` (respiratory) | Asthma — lower airway obstruction cards |
| `rhonchi` (respiratory) | COPD secretion management cards |
| `fine-crackles` (respiratory) | HF volume overload, pulmonary fibrosis |
| `coarse-crackles` (respiratory) | Pulmonary edema emergency cards |
| `stridor` (respiratory) | Croup, epiglottitis, foreign body |
| `s3` (cardiac) | Heart failure S3 identification, volume overload |
| `s4` (cardiac) | Ischemia / angina auscultation |
| `aortic-stenosis` (cardiac) | Valve disease murmur identification |
| `mitral-regurgitation` (cardiac) | Post-MI complication, rheumatic disease |
| `pericardial-friction-rub` (cardiac) | Pericarditis identification |

```tsx
// Flashcard back panel — compact audio embed
<ClinicalAudioBlock
  soundId="s3"
  kind="cardiac"
  showSignificance
  compact
/>
```

---

## Practice Question / CAT Reuse

Embed in rationale panels or CAT feedback:

```tsx
// Practice question rationale — wheeze embed
<ClinicalAudioBlock
  soundId="wheezes"
  kind="respiratory"
  displayName="Wheeze — this patient's cardinal auscultation finding"
  showSignificance
/>
```

| Sound | Question context |
|---|---|
| `wheezes` | "What breath sound do you auscultate?" (asthma/COPD stem) |
| `s3` | "Which finding supports HF exacerbation?" |
| `fine-crackles` | "What do you hear at the lung bases?" (volume overload) |
| `stridor` | "You hear this on the child's inspiration…" (croup/epiglottitis) |
| `pericardial-friction-rub` | "Auscultation reveals…" (pericarditis) |

---

## Missing Assets

### Sounds missing MP4 files

| Sound ID | Kind | Notes |
|---|---|---|
| `tracheal` | respiratory | Waveform only |
| All 11 cardiac sounds | cardiac | All waveform-only; MP4 files not yet recorded |

### Potential future sounds

| Proposed | Kind | Lessons |
|---|---|---|
| Loud P2 / split S2 | cardiac | Cor pulmonale, ARDS, PE |
| Fixed split S2 | cardiac | ASD, VSD |
| Biphasic wheeze | respiratory | Severe asthma |
| Inspiratory stridor + expiratory wheeze | respiratory | Croup vs epiglottitis distinction |
| Friction rub (pleural, wet) | respiratory | Pneumonia, pleuritis |

---

## Validation

Tests passing after catalog update:

```
✓ buildLessonInteractiveModules hydrates respiratory items from registry
✓ getLessonInteractiveModules prefers lesson.interactiveModules when present
✓ inferPathwayLessonSoundLibraries — respiratory library (auscultation cues)
✓ inferPathwayLessonSoundLibraries — cardiac library (cardiovascular + auscultation)
✓ PRE_NURSING does not receive advanced valve murmur rows (tier gate)
```

**Catalog change:** `embeddedSoundLibraries` added to 88 lessons (2 already existed → total 90 lessons now have audio).
