# PHASE 2 — Global Content Reuse Map
Generated: 2026-05-30

## Overview

This map identifies which NurseNest content is immediately reusable globally vs. what requires country-specific adaptation. The vast majority of clinical science content transfers directly; only exam-format specifics and regulatory terminology require localization.

---

## Reuse Classification

### 🌍 GLOBAL — Reusable As-Is (Estimated 85–90% of Core Content)

These topics are universal clinical science — anatomy, pharmacology, pathophysiology, lab interpretation, and clinical skills are identical worldwide:

| Content Domain | Examples | Reuse% |
|---|---|---|
| **Cardiac** | Heart failure, MI, dysrhythmias, ECG interpretation | 95% |
| **Respiratory** | COPD, asthma, pneumonia, ABGs, ventilators | 95% |
| **Shock & Sepsis** | Septic shock, hypovolemic, distributive, cardiogenic | 95% |
| **Pharmacology** | Drug classes, mechanism of action, safety/monitoring | 90% |
| **Lab Interpretation** | ABGs, CBC, BMP, coagulation, critical values | 95% |
| **Clinical Skills** | All 221 procedures (sterile technique, IV, airway, etc.) | 98% |
| **ECG Module** | Rhythm interpretation, 12-lead analysis | 95% |
| **Hemodynamics** | Invasive monitoring, waveforms, SvO2, CO | 95% |
| **Neurology** | ICP, stroke, seizures, neuro assessment | 90% |
| **Endocrine** | DKA, DI, SIADH, thyroid, adrenal | 92% |
| **Renal** | AKI, CKD, electrolyte disturbances, dialysis | 92% |
| **GI/GU** | Liver failure, bowel obstruction, GI bleeding | 90% |
| **Maternal/OB** | Antepartum, intrapartum, postpartum emergencies | 88% |
| **Pediatrics** | Developmental milestones, peds assessment | 85% |
| **Mental Health** | Psychiatric disorders, therapeutic communication | 85% |
| **Simulations** | Physiology monitor, ventilator, ECG scenarios | 95% |

### 🍁 CANADA-SPECIFIC — NCLEX-RN / REx-PN / CNPLE Framing

| Content Type | Canada-Specific Elements | Action for Others |
|---|---|---|
| NCLEX-RN question stems | "A nurse in Ontario…" geographic context | Swap to neutral or local |
| CAT exam format | Adaptive algorithm, NGN item types | Adapt to NMC CBT / PNLE formats |
| CNA scope references | Canadian scope-of-practice notes | Replace with country-specific |
| REx-PN question bank | PN-specific clinical focus | Adapt for EN/LVN equivalents |
| French i18n overlays | French-Canadian translations | Reuse for France/Belgium |

### 🇺🇸 US-SPECIFIC — NCLEX-RN / NCLEX-PN / NP Framing

| Content Type | US-Specific Elements | Action for Others |
|---|---|---|
| NCLEX-RN next-gen questions | NGN case studies, bow-tie, highlight | Adapt format for NMC CBT |
| State nursing practice references | US state BON scope | Remove or generalize |
| NP exam content (AANP/ANCC) | US NP certification specific | No direct reuse — new content |
| TEAS/HESI questions | Pre-nursing US testing | Remove entirely for international |

### 🇬🇧 UK-SPECIFIC — NMC CBT / OSCE

| Content Needed | Reusable Base | Build Required |
|---|---|---|
| NMC CBT question format | Clinical science = 90% reusable | CBT format adaptation |
| OSCE station preparation | Clinical skills = 95% reusable | Station-specific scripts |
| UK drug names (paracetamol, salbutamol) | US/CA content uses generic | Terminology overlay |
| NMC standards of proficiency | Framework mapping needed | New mapping document |

### 🇦🇺 AUSTRALIA-SPECIFIC — NMBA / AHPRA IQNM

| Content Needed | Reusable Base | Build Required |
|---|---|---|
| IQNM portfolio evidence | Clinical science = 90% | Portfolio framing |
| AHPRA registration steps | None (new content) | 100% new |
| Australian drug names | 85% overlap with generic | Terminology overlay |
| ANSAT/OCA assessment prep | Clinical skills = 85% | Assessment format adaptation |

### 🇳🇿 NEW ZEALAND — NCNZ

| Content Needed | Reusable Base | Build Required |
|---|---|---|
| NCNZ competency framework | Clinical science = 90% | Framework mapping |
| NZ Nursing Council registration | None (new content) | 100% new |
| NZ-specific medication names | 85% overlap | Terminology overlay |

### 🇮🇪 IRELAND — NMBI

| Content Needed | Reusable Base | Build Required |
|---|---|---|
| NMBI registration pathway | None (new content) | 100% new |
| Irish nursing standards | Clinical science = 90% | Standards mapping |
| UK/Ireland terminology overlap | High (95%) | Minimal adaptation needed |

---

## Content Architecture Recommendation

```
Global Core Lesson (e.g., "Heart Failure")
    ├── Global clinical science content (reusable everywhere)
    ├── 🍁 Canada supplement: NCLEX-RN question format
    ├── 🇺🇸 US supplement: NGN question format
    ├── 🇬🇧 UK supplement: NMC CBT framing + UK drug names
    ├── 🇦🇺 AU supplement: IQNM context + AU drug names
    └── 🇳🇿 NZ supplement: NCNZ competency mapping
```

**Avoid maintaining 5 separate lesson copies.** One global core + thin country supplements is the correct architecture.

---

## Estimated Reuse Rates by Country

| Market | Lessons Reusable | Questions Reusable | Simulations Reusable | Clinical Skills Reusable |
|---|---|---|---|---|
| United Kingdom | ~82% | ~35% | ~95% | ~95% |
| Australia | ~84% | ~40% | ~95% | ~95% |
| New Zealand | ~84% | ~40% | ~95% | ~95% |
| Ireland | ~85% | ~38% | ~95% | ~95% |
| Philippines | ~80% | ~50% | ~90% | ~95% |
| India | ~80% | ~45% | ~90% | ~95% |
| United States | ~92% (from CA base) | ~65% | ~98% | ~98% |
