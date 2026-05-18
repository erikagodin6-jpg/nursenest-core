import type { PatientCase } from "@/lib/cases/longitudinal-case-types";

/**
 * NurseNest-authored CNPLE LOFT-style women's health case.
 *
 * This is original practice content for Canadian NP clinical judgment training.
 * It is not an official CNPLE item and is not affiliated with CCRNR.
 */
export const CASE_WOMENS_HEALTH_ABNORMAL_BLEEDING: PatientCase = {
  id: "cnple-sample-womens-health-aub-001",
  title: "Ms. Renée Martin — Abnormal Uterine Bleeding, Anemia, and Endometrial Risk",
  tagline: "Women's Health · Diagnostic Reasoning and Shared Decision-Making",
  governance: {
    reviewStatus: "internal_review",
    reviewedBy: "NurseNest Clinical Team",
    contentUpdatedAt: "2026-05-18",
    guidelineSources: [
      "Canadian abnormal uterine bleeding assessment principles",
      "SOGC gynecologic care and endometrial-risk evaluation guidance",
      "Primary care iron-deficiency anemia and contraception counselling principles",
    ],
  },
  patient: { age: 46, sex: "Female", pronouns: "she/her", setting: "NP-Led Primary Care Clinic" },
  chiefComplaint: "Heavy irregular periods, fatigue, and concern about whether this is perimenopause or something more serious.",
  pmhx: [
    "G2P2, no current pregnancy plan",
    "BMI 34",
    "Polycystic ovary syndrome history",
    "Hypertension controlled on medication",
    "Mother had endometrial cancer at age 62",
  ],
  medications: [
    { name: "Amlodipine", dose: "5 mg", route: "PO", frequency: "daily", indication: "Hypertension" },
    { name: "Ibuprofen", dose: "400 mg", route: "PO", frequency: "PRN", indication: "Cramps" },
  ],
  allergies: [{ substance: "No known drug allergies", reaction: "", severity: "mild" }],
  primaryDomain: "reproductive-sexual-health",
  secondaryDomains: ["diagnostics-labs", "pharmacotherapeutics", "health-promotion-prevention"],
  difficulty: 4,
  stepCount: 3,
  estimatedMinutes: 19,
  isPremium: true,
  steps: [
    {
      index: 0,
      heading: "Initial abnormal uterine bleeding assessment",
      scenarioText:
        "Ms. Martin, 46, reports 8 months of increasingly heavy and irregular bleeding. She soaks through pads every 1–2 hours on the heaviest days and passes clots. Cycles range from 21 to 60 days. She feels fatigued and lightheaded with stairs but denies syncope, severe pelvic pain, fever, postcoital bleeding, or pregnancy symptoms. Vitals: BP 132/78, HR 96, SpO2 98%. She has a history of PCOS, BMI 34, and family history of endometrial cancer. She asks whether this is just perimenopause.",
      clinicalUpdate: {
        direction: "worsening",
        summary: "Perimenopausal bleeding may be common, but risk factors and heavy bleeding require structured AUB workup and endometrial-risk assessment.",
        newFindings: ["Heavy bleeding", "Irregular cycles", "Clots", "Fatigue/lightheadedness", "PCOS", "BMI 34", "Family history endometrial cancer"],
      },
      vitals: [
        { label: "BP", value: "132/78", unit: "mmHg" },
        { label: "HR", value: "96", unit: "bpm" },
        { label: "SpO2", value: "98%", unit: "room air" },
      ],
      diagnosticArtifacts: [],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "reproductive-sexual-health",
      question: {
        stem: "Ms. Martin is 46 with heavy irregular bleeding, fatigue, PCOS history, BMI 34, and family history of endometrial cancer. What is the most appropriate NP assessment plan?",
        family: "abnormal-uterine-bleeding-risk-stratification",
        options: [
          { id: "A", label: "Assess hemodynamic stability, rule out pregnancy, order CBC/ferritin and relevant labs, arrange pelvic exam/imaging as indicated, and refer/arrange endometrial sampling because age/risk factors raise concern." },
          { id: "B", label: "Reassure that irregular bleeding is normal in perimenopause and review in 1 year." },
          { id: "C", label: "Start combined hormonal contraception immediately without BP/risk review or endometrial assessment." },
          { id: "D", label: "Treat with antibiotics because clots indicate uterine infection." }
        ],
        correctOptionId: "A",
        rationale: "Abnormal uterine bleeding in the perimenopausal years requires pregnancy exclusion, anemia assessment, medication/bleeding history, pelvic assessment, and risk stratification. Age over 45 and risk factors for unopposed estrogen exposure such as PCOS and obesity increase concern for endometrial hyperplasia or malignancy, so endometrial sampling or gynecology referral is appropriate. Perimenopause does not remove the obligation to evaluate heavy or high-risk bleeding.",
        whyWrongByOptionId: {
          B: "Perimenopause can cause irregular cycles, but heavy bleeding plus endometrial risk factors needs workup.",
          C: "Hormonal treatment may help bleeding but should not bypass pregnancy exclusion, BP/risk review, and endometrial evaluation when indicated.",
          D: "Clots reflect heavy bleeding; they do not diagnose infection without fever, pelvic tenderness, discharge, or other signs."
        },
        clinicalJudgmentFocus: "Avoiding premature reassurance in perimenopausal AUB when endometrial-risk factors are present.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "CBC/ferritin show iron deficiency anemia. Endometrial sampling is arranged while symptoms and bleeding burden are managed." },
          B: { trajectory: "harmful", outcome: "Evaluation is delayed and anemia worsens; endometrial pathology is identified months later." },
          C: { trajectory: "suboptimal", outcome: "Bleeding improves briefly but underlying endometrial risk is not assessed." },
          D: { trajectory: "suboptimal", outcome: "Unnecessary antibiotics are given while anemia and endometrial risk are missed." }
        }
      }
    },
    {
      index: 1,
      heading: "Anemia results and treatment planning",
      updateNarrative: "One week later — lab and imaging review.",
      scenarioText:
        "Pregnancy test is negative. CBC shows hemoglobin 92 g/L, MCV 74 fL, ferritin 8 µg/L. TSH is normal. Pelvic ultrasound shows a mildly thickened endometrium for cycle timing and a 2.5 cm intramural fibroid not distorting the cavity. She is tired and wants quick symptom relief but is worried about cancer. BP today is 136/82. She does not smoke and has migraine without aura. Endometrial biopsy appointment is booked in 10 days.",
      clinicalUpdate: {
        direction: "mixed",
        summary: "Iron-deficiency anemia confirmed; fibroid may contribute, but endometrial sampling remains needed because risk factors persist.",
        newFindings: ["Hb 92", "Ferritin 8", "Pregnancy negative", "TSH normal", "Mildly thickened endometrium", "Biopsy booked"],
      },
      vitals: [{ label: "BP", value: "136/82", unit: "mmHg" }],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "AUB lab workup",
          finding: "Iron-deficiency anemia with normal TSH and negative pregnancy test",
          values: [
            { test: "Hemoglobin", value: "92 g/L", referenceRange: "approx. 120–160", flag: "L" },
            { test: "MCV", value: "74 fL", referenceRange: "80–100", flag: "L" },
            { test: "Ferritin", value: "8 µg/L", referenceRange: "often >30 desired", flag: "L" },
            { test: "Pregnancy test", value: "Negative", referenceRange: "Negative" }
          ],
          timestamp: "1 week"
        },
        { type: "imaging", name: "Pelvic ultrasound", finding: "Mildly thickened endometrium and 2.5 cm intramural fibroid not distorting cavity", values: [], timestamp: "1 week" }
      ],
      medicationChanges: [],
      followUpInterval: { value: 1, unit: "weeks", label: "1 week later" },
      cnpleDomain: "pharmacotherapeutics",
      question: {
        stem: "Ms. Martin has iron-deficiency anemia from heavy bleeding, endometrial biopsy booked, and wants symptom relief. What is the best interim NP plan?",
        family: "aub-anemia-symptom-management-while-investigating",
        options: [
          { id: "A", label: "Start iron replacement and bleeding-reduction therapy appropriate to her risks/preferences while ensuring endometrial biopsy proceeds; give urgent precautions for severe bleeding/syncope/chest pain/dyspnea." },
          { id: "B", label: "Cancel biopsy because ultrasound found a fibroid that fully explains the bleeding." },
          { id: "C", label: "Delay all treatment until biopsy results return, even though hemoglobin is 92 and symptoms are significant." },
          { id: "D", label: "Start estrogen-containing therapy without reviewing hypertension, migraine type, VTE risk, or patient preference." }
        ],
        correctOptionId: "A",
        rationale: "Symptom treatment and diagnostic evaluation should proceed in parallel. Iron deficiency should be treated, and bleeding can often be reduced with options such as tranexamic acid, progestin-based therapy, LNG-IUS planning, or other individualized approaches depending on contraindications and preferences. A small fibroid may contribute but does not eliminate the need for endometrial sampling in a high-risk patient. Urgent precautions are essential with significant anemia and heavy bleeding.",
        whyWrongByOptionId: {
          B: "Fibroids can coexist with endometrial hyperplasia/malignancy; her age and risk factors still warrant sampling.",
          C: "Waiting leaves symptomatic anemia and heavy bleeding untreated.",
          D: "Estrogen-containing therapy requires individualized risk assessment, especially with hypertension, migraine history, VTE risk, and age."
        },
        clinicalJudgmentFocus: "Managing heavy bleeding and anemia without abandoning endometrial-risk evaluation.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "Bleeding burden decreases, iron therapy begins, and biopsy proceeds as planned." },
          B: { trajectory: "harmful", outcome: "Endometrial sampling is delayed despite persistent risk factors." },
          C: { trajectory: "suboptimal", outcome: "She remains symptomatic and presents urgently after another heavy bleeding episode." },
          D: { trajectory: "suboptimal", outcome: "Therapy is started without adequate risk counselling, creating avoidable safety concerns." }
        }
      }
    },
    {
      index: 2,
      heading: "Biopsy result and longitudinal prevention counselling",
      updateNarrative: "Four weeks later — biopsy and follow-up planning.",
      scenarioText: "Endometrial biopsy shows benign proliferative endometrium without hyperplasia or malignancy. Bleeding has improved with interim therapy, and fatigue is slowly improving on iron. Ms. Martin asks about long-term options that reduce bleeding, protect the endometrium, and fit her preference to avoid daily pills. She also wants to know what changes would require reassessment in the future.",
      clinicalUpdate: {
        direction: "improving",
        summary: "Malignancy/hyperplasia excluded on current biopsy; now focus on long-term bleeding control, endometrial protection, anemia recovery, and return precautions.",
        newFindings: ["Benign biopsy", "Bleeding improved", "Iron therapy ongoing", "Prefers non-daily option", "Needs future red-flag counselling"],
      },
      vitals: [{ label: "BP", value: "130/78", unit: "mmHg" }],
      diagnosticArtifacts: [
        { type: "lab_panel", name: "Endometrial biopsy", finding: "Benign proliferative endometrium; no hyperplasia or malignancy", values: [], timestamp: "4 weeks" }
      ],
      medicationChanges: [{ name: "Iron replacement", dose: "individualized", route: "PO", frequency: "per regimen", indication: "Iron-deficiency anemia", flag: "new" }],
      followUpInterval: { value: 4, unit: "weeks", label: "4 weeks later" },
      cnpleDomain: "health-promotion-prevention",
      question: {
        stem: "After benign biopsy, what long-term plan best addresses Ms. Martin's bleeding, anemia, endometrial risk, and preferences?",
        family: "aub-longitudinal-management-and-red-flags",
        options: [
          { id: "A", label: "Discuss long-term options such as LNG-IUS or progestin-based endometrial protection, continue iron until repletion, monitor symptoms/CBC/ferritin, manage cardiometabolic risks, and give clear return precautions for recurrent heavy, postcoital, or postmenopausal bleeding." },
          { id: "B", label: "Stop follow-up permanently because one benign biopsy means future endometrial risk is zero." },
          { id: "C", label: "Recommend hysterectomy as the only acceptable long-term option." },
          { id: "D", label: "Stop iron as soon as bleeding improves even if ferritin is still low." }
        ],
        correctOptionId: "A",
        rationale: "A benign biopsy is reassuring for the current episode but does not remove future risk, especially if bleeding patterns change. Long-term management should be preference-sensitive and may include LNG-IUS or progestin-based endometrial protection, especially when risk factors for unopposed estrogen exist. Iron should continue until anemia and stores recover. Return precautions include recurrent heavy bleeding, intermenstrual/postcoital bleeding, postmenopausal bleeding, syncope, chest pain, dyspnea, or rapidly worsening symptoms.",
        whyWrongByOptionId: {
          B: "Risk is reduced by evaluation but not eliminated forever; new bleeding patterns need reassessment.",
          C: "Hysterectomy may be appropriate for selected patients but is not the only option and should not bypass shared decision-making.",
          D: "Ferritin repletion often lags behind symptom improvement; stopping early can leave iron stores depleted."
        },
        clinicalJudgmentFocus: "Moving from urgent AUB workup to preference-sensitive long-term bleeding control and endometrial protection.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "She chooses an LNG-IUS consultation, continues iron to repletion, and understands future bleeding red flags." },
          B: { trajectory: "suboptimal", outcome: "Future abnormal bleeding is normalized and reassessment is delayed." },
          C: { trajectory: "suboptimal", outcome: "She feels pressured and disengages from care despite having multiple acceptable options." },
          D: { trajectory: "suboptimal", outcome: "Fatigue persists because iron stores remain depleted." }
        }
      }
    }
  ]
};
