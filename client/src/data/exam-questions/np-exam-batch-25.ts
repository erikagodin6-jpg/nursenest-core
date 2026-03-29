import type { ExamQuestion } from "./types";

export const npExamBatch25Questions: ExamQuestion[] = [
  {
    q: "A 16-year-old female presents with self-harm behavior (superficial cutting on forearms), emotional dysregulation, and academic decline. She denies suicidal intent. Her parents are present and concerned. What is the NP's initial approach?",
    o: ["Conduct a thorough safety assessment including suicidality screening (Columbia Protocol), assess for underlying psychiatric disorders, and refer for evidence-based therapy (DBT for adolescents)", "Hospitalize immediately for any self-harm behavior", "Prescribe an SSRI and schedule follow-up in 4 weeks", "Reassure parents that cutting is a phase and will resolve"],
    a: 0,
    r: "Non-suicidal self-injury (NSSI) requires careful assessment distinguishing self-harm from suicidal behavior using validated tools (Columbia Suicide Severity Rating Scale). While NSSI without suicidal intent may not require hospitalization, it signals emotional distress and increases suicide risk over time. DBT for adolescents (DBT-A) has the strongest evidence for reducing self-harm. Underlying conditions (depression, PTSD, BPD traits) should be evaluated. Dismissing self-harm as a phase ignores serious psychological distress.",
    s: "Psychiatry"
  },
  {
    q: "A 35-year-old male with a history of opioid use disorder presents requesting medication-assisted treatment. He has been using heroin daily for 3 years and last used 18 hours ago. He has mild withdrawal symptoms. What is the most appropriate initial treatment?",
    o: ["Initiate buprenorphine/naloxone (Suboxone) after confirming sufficient withdrawal (COWS score 8 or greater); prescribe as office-based opioid treatment", "Start methadone 30 mg at an opioid treatment program", "Prescribe naltrexone immediately", "Recommend detoxification without MAT and refer to a 12-step program"],
    a: 0,
    r: "Buprenorphine/naloxone can be initiated in the office setting after confirming adequate withdrawal (COWS score 8+, typically 12-24 hours after last short-acting opioid use). Starting too early risks precipitated withdrawal. Buprenorphine is a partial mu-opioid agonist that reduces cravings and withdrawal. Methadone requires daily witnessed dosing at an OTP. Naltrexone (opioid antagonist) requires 7-10 days of abstinence. MAT is the standard of care; detoxification alone has high relapse rates (90%+).",
    s: "Psychiatry"
  },
  {
    q: "A 72-year-old male recently started on mirtazapine 15 mg for depression reports increased appetite, weight gain of 8 pounds in 6 weeks, and morning sedation. His depression has improved significantly (PHQ-9 decreased from 18 to 6). How should the NP manage these side effects?",
    o: ["Increase mirtazapine to 30-45 mg, as higher doses are paradoxically less sedating and may cause less weight gain due to increased noradrenergic activity", "Discontinue mirtazapine and switch to a different antidepressant", "Add a stimulant to counteract sedation", "Reduce mirtazapine to 7.5 mg to reduce side effects"],
    a: 0,
    r: "Mirtazapine has a paradoxical dose-response for sedation and weight gain. At lower doses (15 mg), histamine H1 antagonism predominates, causing sedation and appetite stimulation. At higher doses (30-45 mg), noradrenergic activation counteracts the sedation. Increasing the dose may reduce these side effects while maintaining antidepressant efficacy. Discontinuing an effective antidepressant should be avoided if side effects can be managed. Reducing the dose may worsen sedation.",
    s: "Psychiatry"
  },
  {
    q: "An NP is managing a patient panel of 1,200 patients. She notices increasing medication errors during afternoon clinic sessions. Root cause analysis reveals provider fatigue and inadequate support staff. What quality improvement framework should she apply?",
    o: ["Plan-Do-Study-Act (PDSA) cycle to systematically test and implement workflow changes such as adjusted scheduling templates and additional support staffing", "Continue current practice and document errors for annual review", "Report to administration and wait for their solution", "Reduce panel size to 200 patients immediately"],
    a: 0,
    r: "PDSA (Plan-Do-Study-Act) is the standard quality improvement framework for healthcare. The NP should: Plan (identify specific changes to test), Do (implement changes on small scale), Study (measure outcomes), Act (adopt, adapt, or abandon based on results). Specific interventions might include afternoon scheduling adjustments, medication reconciliation checklists, clinical pharmacist integration, or scribing support. Simply documenting errors without intervention perpetuates harm.",
    s: "Professional Practice"
  },
  {
    q: "An NP in a collaborative practice state is asked by her collaborating physician to prescribe a medication she believes is inappropriate for the patient based on current guidelines. The physician insists. What is the NP's appropriate action?",
    o: ["Respectfully advocate for the patient by presenting evidence-based guidelines; if disagreement persists, escalate through proper channels while not prescribing a medication she believes is harmful", "Prescribe the medication as the physician directed since they have authority", "Refuse to see the patient further", "Prescribe the medication and document disagreement in the chart"],
    a: 0,
    r: "NPs have independent professional liability and ethical obligations to their patients. Prescribing a medication the NP believes is inappropriate based on evidence violates the NP's duty to the patient and exposes the NP to malpractice liability. The appropriate approach is respectful evidence-based advocacy, shared decision-making, and if unresolved, escalation through institutional channels. The NP should never prescribe something they believe will harm the patient regardless of collaborative hierarchy.",
    s: "Professional Practice"
  },
  {
    q: "A 40-year-old male with well-controlled HIV (CD4 500, undetectable viral load) on bictegravir/emtricitabine/TAF presents with left-sided headache, fever, and focal neurological deficits. MRI shows a ring-enhancing lesion with surrounding edema. Toxoplasma IgG is positive. What is the most likely diagnosis given his CD4 count?",
    o: ["Primary CNS lymphoma should be considered alongside toxoplasmosis; obtain stereotactic biopsy given CD4 is above the typical threshold for toxoplasma reactivation", "Toxoplasma encephalitis; start empiric TMP-SMX", "Progressive multifocal leukoencephalopathy; optimize ART", "Cryptococcal meningitis; start amphotericin B"],
    a: 0,
    r: "While toxoplasma encephalitis is the most common cause of ring-enhancing brain lesions in AIDS patients, it typically occurs at CD4 below 100. With CD4 of 500, toxoplasma reactivation is unlikely despite positive IgG (indicating past exposure). Primary CNS lymphoma (PCNSL) can occur at higher CD4 counts and also presents with ring-enhancing lesions. Stereotactic biopsy is indicated when the clinical picture is atypical for toxoplasmosis. PML causes non-enhancing white matter lesions.",
    s: "Infectious Disease"
  },
  {
    q: "A 55-year-old male with chronic plaque psoriasis covering 25% BSA has failed methotrexate (hepatotoxicity concerns) and phototherapy (logistical barriers). He has psoriatic arthritis affecting his hands. What biologic class should the NP discuss?",
    o: ["TNF inhibitor (adalimumab, infliximab) or IL-17 inhibitor (secukinumab, ixekizumab) as both effectively treat skin and joint disease", "Topical calcineurin inhibitor as monotherapy", "Oral corticosteroid daily", "Cyclosporine indefinitely"],
    a: 0,
    r: "Moderate-to-severe psoriasis with concomitant psoriatic arthritis failing conventional systemic therapy is an indication for biologic therapy. TNF inhibitors and IL-17 inhibitors have dual efficacy for both skin psoriasis and psoriatic arthritis. IL-23 inhibitors (guselkumab, risankizumab) are highly effective for skin but have less joint data. Topical therapy alone is insufficient for 25% BSA involvement. Long-term oral corticosteroids risk severe rebound psoriasis upon withdrawal.",
    s: "Dermatology"
  },
  {
    q: "An 80-year-old female with moderate Alzheimer dementia on donepezil 10 mg and memantine 10 mg twice daily has progressive functional decline. Her daughter asks about the newly approved anti-amyloid therapy (aducanumab/lecanemab). What should the NP counsel?",
    o: ["Anti-amyloid antibodies are approved for early-stage AD (MCI or mild dementia) with confirmed amyloid pathology; this patient with moderate dementia is unlikely to be a candidate", "Recommend starting lecanemab immediately regardless of stage", "Discontinue current medications and switch to anti-amyloid therapy", "Anti-amyloid therapy reverses cognitive decline in all stages"],
    a: 0,
    r: "Anti-amyloid monoclonal antibodies (lecanemab, donanemab) are indicated for early Alzheimer disease (MCI due to AD or mild AD dementia) with PET or CSF-confirmed amyloid pathology. They modestly slow cognitive decline but do not reverse it. They are NOT indicated for moderate-to-severe AD. ARIA (amyloid-related imaging abnormalities) is a significant safety concern requiring MRI monitoring. This patient with moderate dementia is outside the approved indication.",
    s: "Geriatrics"
  },
  {
    q: "A 38-year-old G4P3 at 32 weeks gestation presents with sudden-onset severe abdominal pain and dark vaginal bleeding. Uterus is rigid and tender on palpation. Fetal heart rate shows late decelerations with reduced variability. She has a history of cocaine use and chronic hypertension. What is the most likely diagnosis?",
    o: ["Placental abruption; emergent cesarean delivery if fetal distress is confirmed", "Placenta previa; expectant management", "Normal labor contractions; continue monitoring", "Uterine rupture; exploratory laparotomy"],
    a: 0,
    r: "Sudden severe abdominal pain with dark vaginal bleeding, rigid tender uterus (Couvelaire uterus), and fetal distress in a patient with risk factors (cocaine, chronic hypertension) is classic for placental abruption. This is an obstetric emergency. With non-reassuring fetal heart rate pattern (late decelerations, reduced variability), emergent cesarean delivery is indicated. Placenta previa presents with painless bright red bleeding. Uterine rupture has different risk factors and presentation.",
    s: "Women's Health"
  },
  {
    q: "A 55-year-old female presents with pancytopenia (WBC 2.1, Hgb 8.5, Plt 62). Peripheral blood smear shows macrocytosis and hypersegmented neutrophils. Reticulocyte count is low. LDH and indirect bilirubin are elevated. What is the most likely diagnosis and initial workup?",
    o: ["Megaloblastic anemia (vitamin B12 or folate deficiency with ineffective erythropoiesis); order B12, folate, methylmalonic acid, and homocysteine levels", "Aplastic anemia; order bone marrow biopsy immediately", "Myelodysplastic syndrome; start azacitidine", "Autoimmune hemolytic anemia; start corticosteroids"],
    a: 0,
    r: "Pancytopenia with macrocytosis, hypersegmented neutrophils (6+ nuclear lobes), low reticulocyte count, and elevated LDH/indirect bilirubin (from intramedullary hemolysis/ineffective erythropoiesis) is classic for megaloblastic anemia. Initial workup includes B12 and folate levels. Methylmalonic acid (elevated in B12 deficiency only) and homocysteine (elevated in both) help differentiate the cause. B12 deficiency can cause pancytopenia through impaired DNA synthesis affecting all cell lines. Bone marrow biopsy may be needed if levels are equivocal.",
    s: "Hematology"
  }
];
