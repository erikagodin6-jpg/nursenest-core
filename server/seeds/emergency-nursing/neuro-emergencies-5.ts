import { EmergencyNursingQuestion } from "./types";

export const neuroEmergency5Questions: EmergencyNursingQuestion[] = [
  {
    stem: "A 22-year-old male presents after a motorcycle accident with GCS 7 (E2V1M4). CT head shows bilateral cerebral contusions with midline shift of 8 mm and compressed basal cisterns. ICP monitor reads 32 mmHg and MAP is 90 mmHg. What is the cerebral perfusion pressure (CPP) and is it adequate?",
    options: [
      "CPP is 58 mmHg - this is below the target of 60-70 mmHg and requires intervention to increase MAP or decrease ICP",
      "CPP is 58 mmHg - this is adequate and no intervention is needed",
      "CPP is 122 mmHg - this is above target and MAP should be decreased",
      "CPP cannot be calculated without knowing the central venous pressure"
    ],
    correctAnswer: 0,
    rationaleLong: "Cerebral perfusion pressure (CPP) is calculated as: CPP = MAP - ICP (Mean Arterial Pressure minus Intracranial Pressure). In this patient: CPP = 90 - 32 = 58 mmHg. The Brain Trauma Foundation guidelines recommend maintaining CPP between 60-70 mmHg in patients with severe traumatic brain injury. A CPP below 60 mmHg is associated with cerebral ischemia and worse outcomes, while a CPP above 70 mmHg increases the risk of ARDS and other systemic complications from aggressive vasopressor use. At 58 mmHg, this patient's CPP is below the minimum target and requires intervention. The two approaches to improving CPP are: (1) Increase MAP: using vasopressors (norepinephrine is preferred) to raise blood pressure, and (2) Decrease ICP: the ICP of 32 mmHg is significantly elevated (normal <20 mmHg in adults, treatment threshold ≥22 mmHg per BTF guidelines). ICP-lowering interventions include: elevating the head of bed to 30 degrees with the head midline (promotes venous drainage), IV hypertonic saline (23.4% 30 mL or 3% saline 250 mL bolus) or IV mannitol (0.5-1 g/kg), CSF drainage via EVD if available, sedation and analgesia (propofol, fentanyl), neuromuscular blockade if other measures fail, and decompressive craniectomy as a last resort. The midline shift of 8 mm and compressed basal cisterns are ominous findings indicating significant mass effect and impending herniation. The nurse should ensure the ICP monitoring transducer is properly leveled and zeroed, maintain strict head positioning, avoid activities that increase ICP (suctioning, coughing, neck flexion), and promptly report any ICP elevation or neurological changes.",
    learningObjective: "Calculate CPP from MAP and ICP and identify when CPP falls below the target range requiring intervention",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Traumatic Brain Injury",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "CPP = MAP - ICP; target CPP 60-70 mmHg; ICP treatment threshold ≥22 mmHg",
    clinicalPearls: [
      "CPP = MAP - ICP (not systolic BP - ICP)",
      "Target CPP: 60-70 mmHg per Brain Trauma Foundation guidelines",
      "CPP <60 → cerebral ischemia; CPP >70 → systemic complications",
      "ICP treatment threshold: ≥22 mmHg"
    ],
    safetyNote: "Ensure ICP transducer is properly leveled at the tragus of the ear and zeroed for accurate readings",
    distractorRationales: [
      "CPP of 58 is below the 60-70 target and requires intervention",
      "58 mmHg is inadequate and risks cerebral ischemia",
      "CPP is MAP minus ICP, not MAP plus ICP",
      "CVP is not needed for CPP calculation"
    ],
    lessonLink: "/emergency/lessons/traumatic-brain-injury"
  },
  {
    stem: "A 68-year-old female with acute ischemic stroke receives IV alteplase. Thirty minutes into the infusion, she develops sudden headache, vomiting, and her NIHSS worsens from 12 to 22. BP increases to 210/120 mmHg. What is the most likely complication and immediate nursing actions?",
    options: [
      "Symptomatic intracerebral hemorrhage - stop alteplase, stat CT head, prepare cryoprecipitate and tranexamic acid",
      "Extension of the ischemic stroke - continue alteplase and increase infusion rate",
      "Allergic reaction to alteplase - stop infusion and administer epinephrine",
      "Hypertensive emergency unrelated to alteplase - administer IV labetalol only"
    ],
    correctAnswer: 0,
    rationaleLong: "Symptomatic intracerebral hemorrhage (sICH) is the most feared complication of IV alteplase for stroke, occurring in approximately 6-7% of treated patients. The clinical presentation of sICH during or after alteplase infusion includes: sudden neurological deterioration (worsening NIHSS by ≥4 points), new-onset headache and vomiting, and acute blood pressure elevation (Cushing response from increased ICP). The immediate nursing actions in the correct sequence are: (1) STOP the alteplase infusion immediately, (2) Obtain STAT non-contrast CT head to confirm hemorrhage, (3) Draw STAT labs: CBC, PT/INR, PTT, fibrinogen level, type and screen, (4) Prepare reversal agents: Cryoprecipitate 10 units (to replace fibrinogen consumed by alteplase-activated plasmin - target fibrinogen >200 mg/dL), Tranexamic acid (TXA) 1 gram IV over 10 minutes (antifibrinolytic to inhibit plasmin), and Aminocaproic acid as an alternative antifibrinolytic, (5) Aggressive blood pressure management to SBP <140 mmHg (IV nicardipine or labetalol), (6) Prepare for possible neurosurgical intervention (EVD or hematoma evacuation). The alteplase half-life is approximately 4 minutes, but the fibrinolytic state persists for several hours because circulating plasmin continues degrading fibrinogen and clot. This is why cryoprecipitate (to replace fibrinogen) and antifibrinolytics (to inhibit plasmin) are both needed. Continuing alteplase would worsen hemorrhage. This is not an allergic reaction (anaphylaxis presents differently). Hypertension alone doesn't explain the neurological deterioration.",
    learningObjective: "Recognize symptomatic intracerebral hemorrhage during alteplase infusion and execute the emergency reversal protocol",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Stroke Management",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Stop alteplase + STAT CT + cryoprecipitate (for fibrinogen) + TXA (for plasmin inhibition) = sICH protocol",
    clinicalPearls: [
      "sICH occurs in 6-7% of alteplase-treated stroke patients",
      "Signs: sudden worsening NIHSS ≥4 points + headache + vomiting + BP elevation",
      "Cryoprecipitate replaces fibrinogen consumed by plasmin",
      "TXA/aminocaproic acid inhibits ongoing fibrinolysis"
    ],
    safetyNote: "STOP alteplase IMMEDIATELY at the first sign of neurological deterioration - even seconds matter",
    distractorRationales: [
      "sICH protocol: stop alteplase, STAT CT, cryoprecipitate + TXA",
      "Continuing alteplase would worsen hemorrhage catastrophically",
      "Allergic reaction presents with urticaria, angioedema, not neurological decline",
      "BP elevation is a Cushing response to hemorrhage, not an isolated hypertensive emergency"
    ],
    lessonLink: "/emergency/lessons/stroke-management"
  },
  {
    stem: "A 45-year-old female presents with a 3-day history of progressive headache, blurred vision, and pulsatile tinnitus. Fundoscopic exam shows bilateral papilledema. CT head and MRI are normal. LP opening pressure is 38 cmH2O (normal <25). CSF composition is normal. BMI is 42. What is the diagnosis?",
    options: [
      "Idiopathic intracranial hypertension (pseudotumor cerebri) - requires acetazolamide and weight management",
      "Bacterial meningitis - requires IV antibiotics",
      "Normal pressure hydrocephalus - requires VP shunt placement",
      "Brain tumor not detected on imaging - requires repeat MRI with contrast"
    ],
    correctAnswer: 0,
    rationaleLong: "This presentation is classic for idiopathic intracranial hypertension (IIH), formerly known as pseudotumor cerebri or benign intracranial hypertension. The diagnostic criteria (Modified Dandy criteria) include: (1) Signs and symptoms of elevated ICP (headache, blurred vision, pulsatile tinnitus, papilledema), (2) Elevated LP opening pressure (>25 cmH2O in adults, this patient has 38 cmH2O), (3) Normal CSF composition (protein, glucose, cell count all normal), (4) Normal neuroimaging (no mass lesion, hydrocephalus, or venous sinus thrombosis), (5) No other identifiable cause. IIH predominantly affects obese women of childbearing age (as in this case with BMI 42). The pathophysiology is thought to involve impaired CSF absorption at the arachnoid granulations. The primary concern is vision loss from chronic papilledema causing optic nerve damage. Treatment includes: (1) Acetazolamide (carbonic anhydrase inhibitor) 250 mg BID, titrated up to 1-2 grams daily - reduces CSF production, (2) Weight loss of 5-10% body weight significantly improves symptoms, (3) Serial visual field testing and ophthalmology follow-up, (4) For severe or refractory cases: therapeutic LP with CSF removal (high-volume LP draining 20-30 mL), optic nerve sheath fenestration, or CSF shunt placement (ventriculoperitoneal or lumboperitoneal). Emergency presentations requiring urgent intervention include: acute vision loss, rapidly progressive papilledema, and thunderclap headache pattern. The nurse should monitor visual acuity and visual field assessments. Bacterial meningitis would show abnormal CSF. Normal pressure hydrocephalus presents with gait ataxia, urinary incontinence, and dementia. Normal MRI rules out mass lesions.",
    learningObjective: "Diagnose idiopathic intracranial hypertension based on Modified Dandy criteria and initiate appropriate treatment",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Elevated Intracranial Pressure",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Obese female + headache + papilledema + high opening pressure + normal CSF + normal imaging = IIH",
    clinicalPearls: [
      "IIH predominantly affects obese women of childbearing age",
      "LP opening pressure >25 cmH2O with normal CSF and imaging = IIH",
      "Vision loss from chronic papilledema is the primary concern",
      "5-10% weight loss significantly improves symptoms"
    ],
    safetyNote: "Monitor visual acuity regularly - untreated IIH can cause permanent blindness from optic nerve damage",
    distractorRationales: [
      "IIH: elevated opening pressure + normal CSF + normal imaging + typical demographics",
      "Bacterial meningitis has abnormal CSF with pleocytosis and low glucose",
      "Normal pressure hydrocephalus has ventricular enlargement on imaging",
      "Normal MRI with and without contrast rules out tumor"
    ],
    lessonLink: "/emergency/lessons/elevated-intracranial-pressure"
  },
  {
    stem: "A 60-year-old male presents with acute onset of locked-in syndrome: quadriplegia, anarthria, but preserved consciousness and vertical eye movements. CT angiography shows a basilar artery occlusion. What is the neuroanatomical basis of this syndrome?",
    options: [
      "Bilateral ventral pontine infarction destroying corticospinal and corticobulbar tracts while sparing the reticular activating system",
      "Bilateral thalamic infarction from perforating artery occlusion",
      "Cerebellar infarction with brainstem compression",
      "Bilateral cerebral hemisphere infarction from bilateral ICA occlusion"
    ],
    correctAnswer: 0,
    rationaleLong: "Locked-in syndrome (LIS) is a devastating neurological condition caused by bilateral ventral pontine infarction, most commonly from basilar artery occlusion. The neuroanatomical basis is critical to understanding: The ventral pons contains the corticospinal tracts (motor pathways to the body) and corticobulbar tracts (motor pathways to the face and bulbar muscles) bilaterally. Infarction of these tracts causes complete quadriplegia (loss of all limb movement) and anarthria (inability to speak due to loss of tongue, pharyngeal, and facial muscle control). However, the reticular activating system (responsible for consciousness and alertness) is located in the TEGMENTUM (dorsal pons and midbrain) and is typically spared, meaning the patient remains fully conscious and cognitively intact. The only preserved voluntary movements are vertical eye movements and blinking, because the supranuclear pathways controlling vertical gaze travel through the midbrain (above the pontine lesion) and the oculomotor nucleus (CN III) is in the midbrain. This allows the patient to communicate using a system of blinks or vertical eye movements (e.g., blink once for yes, twice for no). LIS is one of the most feared neurological outcomes because patients are fully aware but completely unable to move or communicate except through eye movements. The emergency nurse must understand this syndrome to ensure these patients receive: appropriate pain management (they feel pain but cannot express it), protection from aspiration (complete loss of swallowing and cough), psychological support (they understand everything happening around them), and communication systems. EEG shows normal waking patterns, confirming consciousness. Treatment is primarily supportive, though thrombectomy for basilar artery occlusion may prevent progression or improve outcome in early cases.",
    learningObjective: "Identify the neuroanatomical basis of locked-in syndrome and understand that patients retain full consciousness",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Posterior Circulation Stroke",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Locked-in patients are FULLY CONSCIOUS but unable to move - communicate via eye blinks/vertical movements",
    clinicalPearls: [
      "Bilateral ventral pons: corticospinal + corticobulbar tracts destroyed",
      "Reticular activating system (dorsal pons/midbrain) is spared = consciousness preserved",
      "Only preserved movements: vertical eye movements and blinking",
      "EEG shows normal waking patterns confirming intact consciousness"
    ],
    safetyNote: "Locked-in patients feel pain and understand everything - NEVER discuss prognosis at bedside as if patient cannot hear",
    distractorRationales: [
      "Bilateral ventral pontine infarction explains all findings of locked-in syndrome",
      "Thalamic infarction causes different syndromes (sensory loss, behavioral changes)",
      "Cerebellar infarction causes ataxia and vertigo, not quadriplegia",
      "Bilateral hemisphere infarction would cause cortical blindness and coma"
    ],
    lessonLink: "/emergency/lessons/posterior-circulation-stroke"
  },
  {
    stem: "A 70-year-old male with a VP shunt presents with headache, vomiting, and lethargy. CT head shows enlarged ventricles bilaterally. The shunt was placed 5 years ago. What is the most likely diagnosis and what should the nurse assess?",
    options: [
      "VP shunt malfunction - assess for shunt reservoir compressibility and obtain shunt series X-rays",
      "New onset normal pressure hydrocephalus - the shunt is working normally",
      "Shunt infection - draw blood cultures and start vancomycin empirically",
      "Over-drainage syndrome - elevate head of bed to 90 degrees"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with signs of elevated ICP (headache, vomiting, lethargy) and CT shows enlarged ventricles, which in a patient with an existing VP shunt strongly suggests shunt malfunction (obstruction or disconnection). VP shunt malfunction is the most common shunt complication, occurring in approximately 40% of shunts within the first year and remaining a lifelong risk. The most common cause is proximal (ventricular) catheter obstruction from choroid plexus tissue or brain parenchyma growing into the catheter tip. The emergency nurse's assessment should include: (1) Shunt reservoir ('pump') assessment: pressing on the reservoir behind the ear - if it compresses easily but refills slowly, this suggests distal obstruction; if it is difficult to compress, this suggests proximal obstruction; if it compresses and does not refill, it is likely disconnected. However, reservoir assessment has limited sensitivity and should not be solely relied upon. (2) Shunt series X-rays: a series of X-rays (skull, chest, abdomen) to visualize the entire shunt system and check for disconnection, kinking, or migration of the distal catheter. (3) CT head comparison: comparing current ventricular size to the patient's baseline post-shunt CT - ventricle enlargement from baseline confirms malfunction. (4) Vital signs and neurological assessment: GCS, pupil reactivity, Cushing triad (hypertension, bradycardia, irregular respirations indicating herniation). If shunt malfunction is confirmed, neurosurgical consultation for shunt revision is needed emergently. Shunt infection typically presents with fever, abdominal pain (for VP shunts), and CSF pleocytosis. Over-drainage causes slit ventricle syndrome with headaches that worsen when upright.",
    learningObjective: "Assess VP shunt malfunction using reservoir testing and shunt series X-rays in patients with acute hydrocephalus",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "CSF Shunt Emergencies",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "VP shunt patient + enlarged ventricles + ICP symptoms = shunt malfunction until proven otherwise",
    clinicalPearls: [
      "40% of VP shunts malfunction within the first year",
      "Proximal catheter obstruction is the most common cause of malfunction",
      "Shunt series X-rays visualize the entire system for disconnection/kinking",
      "Compare CT ventricle size to baseline post-shunt images"
    ],
    safetyNote: "VP shunt malfunction can cause rapid herniation - this is a neurosurgical emergency requiring urgent consultation",
    distractorRationales: [
      "Enlarged ventricles + ICP symptoms in shunt patient = malfunction",
      "Working shunt would not allow ventricle enlargement",
      "Infection typically presents with fever and sometimes abdominal symptoms",
      "Over-drainage causes small ventricles, not enlarged"
    ],
    lessonLink: "/emergency/lessons/csf-shunt-emergencies"
  },
  {
    stem: "A 35-year-old female presents with acute onset of severe headache and left-sided weakness. She is 34 weeks pregnant. CT head shows a right parietal intracerebral hemorrhage. BP is 178/108 mmHg. What is the preferred antihypertensive agent for this pregnant patient with ICH?",
    options: [
      "IV labetalol 20 mg bolus, may repeat and increase dose every 10 minutes",
      "IV nitroprusside infusion starting at 0.3 mcg/kg/min",
      "IV enalaprilat 1.25 mg over 5 minutes",
      "Oral nifedipine 10 mg sublingual for rapid effect"
    ],
    correctAnswer: 0,
    rationaleLong: "In pregnant patients with intracerebral hemorrhage requiring acute blood pressure management, IV labetalol is the preferred first-line antihypertensive agent. Labetalol is a combined alpha-1 and beta-adrenergic blocker that provides controlled blood pressure reduction with a favorable safety profile in pregnancy. The dosing protocol is: 20 mg IV bolus over 2 minutes, followed by repeat doses of 40 mg, then 80 mg at 10-minute intervals if needed (maximum cumulative dose 300 mg). Alternatively, a continuous infusion at 1-2 mg/min can be used. IV hydralazine (5-10 mg IV every 20 minutes) is an acceptable alternative. The target BP for ICH in pregnancy follows the same guidelines as non-pregnant ICH: SBP <140 mmHg per INTERACT2 and AHA/ASA ICH guidelines, balanced against maintaining adequate placental perfusion. Nitroprusside is CONTRAINDICATED in pregnancy because its metabolite cyanide can cause fetal toxicity (cyanide crosses the placenta and accumulates in the fetus, which has limited capacity for cyanide detoxification). ACE inhibitors (enalaprilat) are CONTRAINDICATED in pregnancy due to teratogenic effects including fetal renal failure, oligohydramnios, pulmonary hypoplasia, and neonatal death - this applies to all trimesters but is especially dangerous in the second and third trimesters. Sublingual nifedipine can cause unpredictable, precipitous blood pressure drops which are dangerous in both ICH (may worsen cerebral perfusion) and pregnancy (may compromise uteroplacental blood flow). Additionally, this patient at 34 weeks gestation needs emergent obstetric consultation for fetal monitoring, consideration of delivery timing, and maternal-fetal risk assessment.",
    learningObjective: "Select labetalol as the preferred antihypertensive for ICH in pregnancy and identify contraindicated agents",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Stroke in Special Populations",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Pregnancy + ICH: use labetalol or hydralazine; nitroprusside causes fetal cyanide toxicity; ACE inhibitors are teratogenic",
    clinicalPearls: [
      "Labetalol and hydralazine are first-line antihypertensives in pregnancy",
      "Nitroprusside: fetal cyanide toxicity (cyanide crosses placenta)",
      "ACE inhibitors: teratogenic - fetal renal failure, oligohydramnios",
      "Obstetric consultation essential for fetal monitoring and delivery planning"
    ],
    safetyNote: "ACE inhibitors in pregnancy can cause fetal death - absolute contraindication in all trimesters",
    distractorRationales: [
      "Labetalol is safe in pregnancy with predictable BP reduction",
      "Nitroprusside causes fetal cyanide toxicity",
      "ACE inhibitors are teratogenic and contraindicated in pregnancy",
      "Sublingual nifedipine causes unpredictable precipitous BP drops"
    ],
    lessonLink: "/emergency/lessons/stroke-in-special-populations"
  },
  {
    stem: "A 50-year-old male with HIV (CD4 count 85 cells/μL) presents with 2 weeks of progressive headache, fever, and confusion. CT head shows multiple ring-enhancing lesions. MRI confirms the findings. What are the two most likely diagnoses in this immunocompromised patient?",
    options: [
      "Cerebral toxoplasmosis and primary CNS lymphoma - initiate empiric toxoplasmosis treatment and reassess in 2 weeks",
      "Bacterial brain abscesses requiring emergent surgical drainage",
      "Multiple metastatic brain tumors requiring oncology consultation",
      "Neurocysticercosis requiring albendazole and corticosteroids"
    ],
    correctAnswer: 0,
    rationaleLong: "In HIV-positive patients with CD4 counts <100 cells/μL, multiple ring-enhancing brain lesions on imaging have two primary diagnoses to consider: cerebral toxoplasmosis (most common, 60-70%) and primary CNS lymphoma (PCNSL, 20-30%). The clinical approach is to initiate empiric treatment for toxoplasmosis (the more common and treatable condition) and reassess with repeat imaging in 10-14 days. Toxoplasmosis treatment consists of: pyrimethamine (200 mg loading dose, then 50-75 mg/day) + sulfadiazine (1000-1500 mg QID) + leucovorin (10-25 mg/day to prevent folate deficiency from pyrimethamine). If the patient shows clinical and radiographic improvement at 2 weeks, toxoplasmosis is confirmed and treatment continues for at least 6 weeks. If there is no improvement, PCNSL becomes the leading diagnosis, and stereotactic brain biopsy is needed for definitive diagnosis. Additional diagnostic aids include: Toxoplasma IgG antibody (positive in >95% of toxoplasmosis cases; negative IgG makes toxoplasmosis less likely), Thallium-201 SPECT scan (PCNSL shows increased uptake; toxoplasmosis does not), EBV PCR from CSF (positive in 80-90% of PCNSL), and PET scan (PCNSL is hypermetabolic). The emergency nurse should: obtain blood for Toxoplasma serology, ensure seizure precautions are in place (ring-enhancing lesions have high seizure risk), monitor for signs of herniation from mass effect, and ensure antiretroviral therapy coordination with infectious disease. Bacterial brain abscesses are less common in HIV. Metastases require known primary cancer. Neurocysticercosis is possible but less likely with this degree of immunocompromise.",
    learningObjective: "Differentiate cerebral toxoplasmosis from primary CNS lymphoma in HIV patients with ring-enhancing lesions",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "CNS Infections",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "HIV + CD4 <100 + ring-enhancing lesions = toxoplasmosis vs PCNSL; treat empirically for toxo and reassess at 2 weeks",
    clinicalPearls: [
      "Toxoplasmosis is the most common cause of ring-enhancing lesions in AIDS",
      "Empiric toxo treatment: pyrimethamine + sulfadiazine + leucovorin",
      "Reassess at 2 weeks: improvement confirms toxo; no improvement → biopsy for PCNSL",
      "Toxoplasma IgG negative makes toxoplasmosis unlikely"
    ],
    safetyNote: "Implement seizure precautions for all patients with ring-enhancing brain lesions",
    distractorRationales: [
      "Empiric toxo treatment with 2-week reassessment is standard approach in HIV",
      "Bacterial abscess is less common in HIV than toxoplasmosis",
      "Metastases require known primary cancer and have different clinical context",
      "Neurocysticercosis is less likely with severe immunocompromise"
    ],
    lessonLink: "/emergency/lessons/cns-infections"
  },
  {
    stem: "A 75-year-old male presents with acute onset facial droop, arm weakness, and speech difficulty. The triage nurse notes the time is 14:30 and the patient was last seen normal at 13:45. What validated tool should the nurse use for rapid stroke screening, and what are the key elements?",
    options: [
      "Cincinnati Prehospital Stroke Scale (CPSS) or FAST - assess Face drooping, Arm drift, Speech abnormality, and Time of onset",
      "Glasgow Coma Scale - assess Eye opening, Verbal response, Motor response",
      "NIH Stroke Scale - complete all 11 categories before activating stroke team",
      "ABCDE primary survey - assess Airway, Breathing, Circulation, Disability, Exposure"
    ],
    correctAnswer: 0,
    rationaleLong: "The Cincinnati Prehospital Stroke Scale (CPSS) or its public-facing version FAST (Face, Arm, Speech, Time) is the validated rapid stroke screening tool designed for quick identification of potential stroke patients. The elements are: Face - ask the patient to smile and check for facial asymmetry (one side droops or doesn't move as well), Arms - ask the patient to hold both arms out with eyes closed for 10 seconds and check for arm drift (one arm drifts downward or cannot be raised), Speech - ask the patient to repeat a simple sentence (e.g., 'The sky is blue') and check for slurred or abnormal speech. If ANY one of these three findings is abnormal, there is a 72% probability of stroke, and the stroke team should be activated immediately. The fourth element, Time, emphasizes documenting the last known well time (in this case 13:45) because this determines eligibility for time-sensitive treatments (IV alteplase within 4.5 hours, thrombectomy within 6-24 hours). The emergency nurse should activate the stroke team code based on the positive CPSS/FAST screen WITHOUT waiting for a complete NIHSS assessment, as the NIHSS is a more detailed 42-point scale that is performed by the stroke team or physician and takes several minutes to complete. Delaying activation to complete a full NIHSS wastes critical minutes in the treatment window. The GCS assesses consciousness level but is not specific for stroke screening. The ABCDE approach is a general trauma/emergency survey. More advanced prehospital screens include the RACE (Rapid Arterial oCclusion Evaluation) and LAMS (Los Angeles Motor Scale) that identify large vessel occlusion candidates for direct transfer to thrombectomy-capable centers.",
    learningObjective: "Apply CPSS/FAST for rapid stroke screening and activate the stroke team without waiting for complete NIHSS",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Stroke Management",
    difficulty: 1,
    cognitiveLevel: "comprehension",
    questionType: "MCQ_SINGLE",
    examTrap: "FAST screen activates the stroke team; do NOT wait for full NIHSS before activation - time is brain",
    clinicalPearls: [
      "FAST: Face, Arms, Speech, Time - any 1 abnormal = 72% stroke probability",
      "Document last known well time immediately - determines treatment eligibility",
      "Activate stroke team on positive FAST screen - don't wait for NIHSS",
      "RACE and LAMS screens identify LVO for direct transfer to thrombectomy centers"
    ],
    safetyNote: "Every minute of delayed treatment in stroke results in loss of 1.9 million neurons - time is brain",
    distractorRationales: [
      "CPSS/FAST is the validated rapid stroke screening tool",
      "GCS assesses consciousness but is not stroke-specific",
      "Full NIHSS should not delay stroke team activation",
      "ABCDE is a general emergency survey not specific to stroke"
    ],
    lessonLink: "/emergency/lessons/stroke-management"
  },
  {
    stem: "A 40-year-old male presents after a generalized tonic-clonic seizure that has terminated. He has no history of epilepsy. He is postictal with GCS of 12. CT head is normal. What is the emergency nurse's priority in the postictal assessment?",
    options: [
      "Maintain airway positioning, obtain blood glucose, and perform thorough secondary survey to identify the seizure etiology",
      "Administer IV lorazepam 4 mg to prevent another seizure",
      "Obtain an emergent EEG before the patient regains full consciousness",
      "Discharge once GCS returns to 15 with outpatient neurology referral"
    ],
    correctAnswer: 0,
    rationaleLong: "In the postictal phase following a first-time generalized tonic-clonic seizure, the emergency nurse's priority is a systematic assessment to maintain safety and identify the underlying cause. The key priorities are: (1) Airway management: Position the patient in the recovery position (left lateral decubitus) to prevent aspiration. Suction the oropharynx if needed. Do NOT insert an oropharyngeal airway or anything into the mouth during or immediately after a seizure (risk of dental damage and aspiration). Monitor oxygen saturation and respiratory effort. (2) Obtain blood glucose immediately: Hypoglycemia is a common and rapidly treatable cause of seizures. If blood glucose is <60 mg/dL, administer IV dextrose. (3) Thorough secondary survey to identify etiology: Labs (BMP including sodium, calcium, magnesium, glucose; CBC; toxicology screen; prolactin level if available within 20 minutes), vital signs (fever may indicate infection/meningitis), medication history (medications that lower seizure threshold: tramadol, bupropion, fluoroquinolones), substance use (alcohol withdrawal seizures occur 12-48 hours after last drink), trauma assessment (check for injuries sustained during the seizure: tongue lacerations, shoulder dislocations, vertebral compression fractures). Prophylactic benzodiazepines are NOT indicated after a single terminated seizure - they are reserved for seizure clusters or status epilepticus. EEG is important but not emergent in the ED and would not change acute management. A first seizure in an adult requires comprehensive workup before any consideration of discharge, including CT head (already done), labs, and observation for at least 4-6 hours.",
    learningObjective: "Prioritize airway management, glucose check, and systematic secondary survey in postictal assessment after first seizure",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Seizure Management",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "First seizure workup: glucose, electrolytes (Na+, Ca2+, Mg2+), tox screen, head CT; no prophylactic benzodiazepines",
    clinicalPearls: [
      "Position in recovery position - never insert objects into the mouth",
      "Check glucose immediately - hypoglycemia is a treatable seizure cause",
      "Check sodium, calcium, magnesium for metabolic causes",
      "Alcohol withdrawal seizures: 12-48 hours after last drink"
    ],
    safetyNote: "Do not insert anything into the mouth during or after a seizure - risk of dental trauma and aspiration",
    distractorRationales: [
      "Airway management + glucose + secondary survey is the correct priority sequence",
      "Prophylactic benzodiazepines are not indicated after a single terminated seizure",
      "EEG is important but not emergent and won't change acute ED management",
      "First seizure in an adult requires comprehensive workup before discharge consideration"
    ],
    lessonLink: "/emergency/lessons/seizure-management"
  },
  {
    stem: "A 55-year-old male with a known brain tumor presents with progressive headache, right-sided hemiparesis, and a dilated left pupil that is sluggishly reactive. CT shows significant left-to-right midline shift with uncal herniation. What is the emergent medical intervention while neurosurgery is consulted?",
    options: [
      "IV mannitol 1-1.5 g/kg bolus AND hyperventilation targeting PaCO2 30-35 mmHg as a brief bridge to surgery",
      "IV dexamethasone 10 mg only and wait for neurosurgical evaluation",
      "Lumbar puncture to reduce CSF volume and ICP",
      "IV labetalol to reduce blood pressure and cerebral blood volume"
    ],
    correctAnswer: 0,
    rationaleLong: "Uncal herniation is a life-threatening neurosurgical emergency where the medial temporal lobe (uncus) herniates through the tentorial notch, compressing the ipsilateral third cranial nerve (causing ipsilateral pupil dilation) and the cerebral peduncle (causing contralateral hemiparesis - though Kernohan's notch phenomenon can cause ipsilateral hemiparesis). This is a 'brain code' requiring immediate intervention to reduce ICP and prevent brainstem compression and death. The emergent medical bridge therapy while awaiting neurosurgical intervention includes: (1) IV Mannitol 1-1.5 g/kg bolus: an osmotic diuretic that creates an osmotic gradient drawing water from brain tissue into the intravascular space, reducing brain volume and ICP within 15-30 minutes. It also improves cerebral blood flow rheology. Serum osmolality should be checked (withhold if >320 mOsm/kg). An alternative is hypertonic saline (23.4% NaCl 30 mL via central line, or 3% NaCl 250-500 mL bolus). (2) Brief hyperventilation targeting PaCO2 30-35 mmHg: hyperventilation causes cerebral vasoconstriction, rapidly reducing cerebral blood volume and ICP within minutes. However, this is a TEMPORARY measure (30-60 minutes) because prolonged hyperventilation below PaCO2 25 mmHg can cause cerebral ischemia from excessive vasoconstriction. It should only be used as a brief bridge to definitive treatment. (3) Head of bed elevated to 30 degrees with head midline. Dexamethasone reduces vasogenic edema around tumors but takes 4-6 hours for effect and is not sufficient as sole therapy for acute herniation. LP is absolutely contraindicated in uncal herniation - it can accelerate downward herniation. Antihypertensives do not meaningfully reduce ICP.",
    learningObjective: "Implement emergent medical management of uncal herniation with osmotic therapy and brief hyperventilation as a bridge to surgery",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Elevated Intracranial Pressure",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Herniation = mannitol (or hypertonic saline) + brief hyperventilation (PaCO2 30-35, not <25) as bridge to surgery",
    clinicalPearls: [
      "Ipsilateral dilated pupil + contralateral hemiparesis = classic uncal herniation",
      "Mannitol 1-1.5 g/kg works in 15-30 minutes; check osmolality (hold if >320)",
      "Hyperventilation is temporary only (30-60 min) - prolonged use causes ischemia",
      "23.4% hypertonic saline is an alternative to mannitol (requires central line)"
    ],
    safetyNote: "NEVER perform lumbar puncture in suspected herniation - can accelerate downward herniation and cause death",
    distractorRationales: [
      "Mannitol and brief hyperventilation provide the fastest ICP reduction as bridge to surgery",
      "Dexamethasone takes hours to work and is insufficient for acute herniation",
      "LP is absolutely contraindicated in herniation syndrome",
      "Antihypertensives do not meaningfully reduce ICP in herniation"
    ],
    lessonLink: "/emergency/lessons/elevated-intracranial-pressure"
  },
  {
    stem: "A 28-year-old female presents with sudden onset of severe headache, right-sided weakness, and a seizure. She is 3 days postpartum. MRI with MRV shows cerebral venous sinus thrombosis (CVST) of the superior sagittal sinus. What is the initial treatment?",
    options: [
      "Therapeutic anticoagulation with IV heparin despite the hemorrhagic infarct component",
      "Antiplatelet therapy with aspirin 325 mg daily",
      "Surgical thrombectomy of the superior sagittal sinus",
      "IV alteplase for thrombolysis of the venous clot"
    ],
    correctAnswer: 0,
    rationaleLong: "Cerebral venous sinus thrombosis (CVST) is a unique cerebrovascular emergency in which a thrombus forms in the dural venous sinuses, impeding venous drainage from the brain. This leads to increased venous pressure, vasogenic edema, and potentially venous infarction with hemorrhagic transformation. CVST predominantly affects young women, with risk factors including the postpartum state (as in this case), oral contraceptive use, thrombophilias, dehydration, and infection. The counterintuitive but evidence-based treatment is therapeutic anticoagulation with IV unfractionated heparin (UFH with aPTT goal 1.5-2.5x control) or LMWH (enoxaparin 1 mg/kg BID), EVEN in the presence of hemorrhagic venous infarction. This is because: (1) The underlying pathology is thrombotic - anticoagulation prevents clot extension and promotes natural fibrinolysis, (2) The hemorrhage in CVST is caused by venous hypertension from the clot, not arterial rupture - treating the clot treats the hemorrhage, (3) Multiple randomized trials and meta-analyses have shown that anticoagulation in CVST (even with hemorrhagic infarction) improves outcomes without increasing hemorrhagic complications. After the acute phase, patients are transitioned to oral anticoagulation (warfarin or DOAC) for 3-12 months depending on the underlying cause. Antiplatelet therapy alone is insufficient for venous thrombosis treatment. Surgical thrombectomy is reserved for severe, refractory cases. IV alteplase (systemic thrombolysis) carries excessive bleeding risk and is not standard; catheter-directed thrombolysis may be considered in severe cases failing anticoagulation.",
    learningObjective: "Initiate therapeutic anticoagulation for CVST even in the presence of hemorrhagic venous infarction",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Cerebral Venous Thrombosis",
    difficulty: 5,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Anticoagulate CVST even with hemorrhagic infarction - the hemorrhage is caused by venous hypertension from the clot",
    clinicalPearls: [
      "CVST risk factors: postpartum, OCPs, thrombophilia, dehydration, infection",
      "Anticoagulation improves outcomes even with hemorrhagic venous infarction",
      "Hemorrhage in CVST is from venous hypertension, not arterial rupture",
      "Transition to oral anticoagulation for 3-12 months after acute phase"
    ],
    safetyNote: "Monitor for signs of worsening hemorrhage or herniation during anticoagulation - rare but possible",
    distractorRationales: [
      "Therapeutic heparin is the standard treatment for CVST even with hemorrhagic infarction",
      "Antiplatelet therapy alone is insufficient for venous thrombosis",
      "Surgical thrombectomy is reserved for refractory cases only",
      "Systemic thrombolysis carries excessive bleeding risk in CVST"
    ],
    lessonLink: "/emergency/lessons/cerebral-venous-thrombosis"
  },
  {
    stem: "A 65-year-old male presents with progressive gait difficulty, urinary incontinence, and memory problems developing over months. CT head shows ventriculomegaly (enlarged ventricles) out of proportion to cortical atrophy. What classic triad does this represent?",
    options: [
      "Normal pressure hydrocephalus (NPH) - 'wet, wacky, and wobbly' triad of urinary incontinence, dementia, and gait apraxia",
      "Alzheimer's disease with vascular component",
      "Parkinson's disease with postural instability",
      "Chronic subdural hematoma causing mass effect"
    ],
    correctAnswer: 0,
    rationaleLong: "Normal pressure hydrocephalus (NPH) presents with the classic triad remembered as 'wet, wacky, and wobbly': (1) Wet = urinary incontinence (from stretching of periventricular sacral motor fibers), (2) Wacky = dementia (subcortical type with slowed processing, apathy, and executive dysfunction rather than cortical features like aphasia), (3) Wobbly = gait apraxia (magnetic gait - wide-based, shuffling steps with difficulty initiating walking, as if feet are stuck to the floor). NPH is distinguished from other causes of ventriculomegaly by the characteristic imaging finding of ventriculomegaly out of proportion to cortical (sulcal) atrophy. In ex vacuo hydrocephalus (from Alzheimer's or other neurodegenerative diseases), ventricles enlarge proportionally to brain atrophy, and sulci are widened. In NPH, the ventricles are disproportionately large while the sulci remain relatively normal or compressed. The diagnosis is further supported by a high-volume lumbar puncture (removing 30-50 mL of CSF) followed by reassessment of gait - if gait improves within 24-48 hours, this is a positive tap test and predicts good response to permanent CSF diversion (VP shunt). NPH is one of the few potentially reversible causes of dementia, making accurate diagnosis critical. Gait disturbance is typically the earliest and most responsive symptom to treatment, while dementia responds least. The emergency nurse should be aware that NPH patients may present to the ED with falls, urinary tract infections, or progressive confusion.",
    learningObjective: "Identify the classic triad of NPH and recognize it as a potentially reversible cause of dementia",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Hydrocephalus",
    difficulty: 2,
    cognitiveLevel: "comprehension",
    questionType: "MCQ_SINGLE",
    examTrap: "NPH: ventriculomegaly OUT OF PROPORTION to atrophy; classic triad: wet (incontinence), wacky (dementia), wobbly (gait)",
    clinicalPearls: [
      "NPH is one of the few reversible causes of dementia",
      "Gait apraxia responds best to treatment; dementia responds least",
      "Positive tap test (gait improvement after high-volume LP) predicts shunt response",
      "Magnetic gait: wide-based, shuffling, difficulty initiating steps"
    ],
    safetyNote: "Falls are a major risk in NPH patients - implement fall precautions for all suspected cases",
    distractorRationales: [
      "NPH: ventriculomegaly + classic triad of wet, wacky, wobbly",
      "Alzheimer's has proportional ventricular and sulcal enlargement (ex vacuo)",
      "Parkinson's has resting tremor, rigidity, and bradykinesia without incontinence",
      "Subdural hematoma shows extra-axial fluid collection, not hydrocephalus"
    ],
    lessonLink: "/emergency/lessons/hydrocephalus"
  },
  {
    stem: "A 58-year-old male presents with sudden onset of vertigo, hearing loss in the right ear, right facial weakness, and right-sided ataxia. CT head is negative. What posterior circulation territory is most likely involved?",
    options: [
      "Anterior inferior cerebellar artery (AICA) territory - lateral pontine syndrome",
      "Posterior inferior cerebellar artery (PICA) territory - Wallenberg syndrome",
      "Superior cerebellar artery (SCA) territory",
      "Posterior cerebral artery (PCA) territory"
    ],
    correctAnswer: 0,
    rationaleLong: "The combination of vertigo, ipsilateral hearing loss, facial weakness, and cerebellar ataxia localizes to the anterior inferior cerebellar artery (AICA) territory, which supplies the lateral pons and anterior-inferior cerebellum. The AICA syndrome (lateral pontine syndrome) is distinguished from other posterior circulation syndromes by two key features that are UNIQUE to AICA territory: (1) Hearing loss - the AICA gives off the internal auditory (labyrinthine) artery that supplies the cochlea and vestibular apparatus. AICA occlusion can cause sudden sensorineural hearing loss and peripheral vestibular dysfunction. (2) Facial weakness - the facial nerve nucleus (CN VII) is located in the lateral pons, supplied by AICA. Facial weakness from AICA stroke is a lower motor neuron (LMN) pattern affecting the entire hemiface (forehead and lower face), unlike upper motor neuron (UMN) facial weakness from cortical stroke that spares the forehead. Other AICA syndrome features include: ipsilateral Horner syndrome, ipsilateral facial sensory loss (CN V), contralateral body pain/temperature loss (spinothalamic tract), and ipsilateral cerebellar ataxia. Wallenberg syndrome (PICA) does NOT include hearing loss or facial weakness - these features reliably distinguish AICA from PICA territory. SCA syndrome primarily causes ipsilateral cerebellar ataxia and contralateral spinothalamic sensory loss without hearing loss or facial weakness. PCA territory involves the occipital lobe (visual cortex) and medial temporal lobe, causing visual field deficits.",
    learningObjective: "Differentiate AICA from PICA territory stroke based on the presence of hearing loss and facial weakness",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Posterior Circulation Stroke",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Hearing loss + facial weakness = AICA territory (not PICA); AICA gives off the labyrinthine artery",
    clinicalPearls: [
      "AICA supplies: lateral pons, anterior-inferior cerebellum, inner ear (via labyrinthine artery)",
      "Hearing loss distinguishes AICA from PICA territory",
      "AICA facial weakness is LMN pattern (entire hemiface including forehead)",
      "PICA (Wallenberg) has NO hearing loss and NO facial weakness"
    ],
    safetyNote: "Posterior circulation strokes are frequently misdiagnosed as peripheral vertigo - always perform HINTS exam",
    distractorRationales: [
      "AICA territory: hearing loss + facial weakness + vertigo + ataxia",
      "PICA (Wallenberg) does not cause hearing loss or facial weakness",
      "SCA causes ataxia without hearing loss or facial weakness",
      "PCA causes visual field deficits, not hearing loss or facial weakness"
    ],
    lessonLink: "/emergency/lessons/posterior-circulation-stroke"
  },
  {
    stem: "A 30-year-old female presents with new-onset generalized seizure in the ED. She is 38 weeks pregnant with BP 190/120 mmHg, proteinuria 3+, and peripheral edema. What is the diagnosis and first-line treatment for the seizure?",
    options: [
      "Eclampsia - IV magnesium sulfate 4-6 g loading dose over 15-20 minutes followed by 1-2 g/hr infusion",
      "Eclampsia - IV lorazepam 4 mg as first-line anticonvulsant",
      "Preeclampsia - IV labetalol for blood pressure control only",
      "Epilepsy exacerbation - IV phenytoin 20 mg/kg loading dose"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with eclampsia, defined as the occurrence of new-onset seizures in a patient with preeclampsia (hypertension + proteinuria in pregnancy after 20 weeks). Eclampsia is a life-threatening obstetric and neurological emergency. The first-line treatment for eclamptic seizures is IV magnesium sulfate (MgSO4), NOT traditional anticonvulsants like benzodiazepines or phenytoin. Magnesium sulfate is given as a 4-6 gram IV loading dose over 15-20 minutes, followed by a maintenance infusion of 1-2 grams per hour. It has been proven superior to both diazepam and phenytoin for preventing recurrent eclamptic seizures in the landmark Magpie and Eclampsia trials. Magnesium works through multiple mechanisms: NMDA receptor antagonism, cerebral vasodilation (reducing vasospasm), and membrane stabilization. The therapeutic magnesium level is 4-7 mg/dL. The nurse must monitor for magnesium toxicity using the following parameters: Loss of deep tendon reflexes (first sign of toxicity at 7-10 mg/dL), respiratory depression (10-15 mg/dL), and cardiac arrest (>15 mg/dL). Keep calcium gluconate 1 gram at bedside as the antidote for magnesium toxicity. Additionally: blood pressure control with IV labetalol or hydralazine, delivery planning (eclampsia is an indication for delivery regardless of gestational age), and continuous fetal monitoring. Benzodiazepines may be used if seizures persist despite magnesium but are not first-line. Phenytoin has been shown to be inferior to magnesium sulfate for eclamptic seizures.",
    learningObjective: "Administer magnesium sulfate as the first-line treatment for eclamptic seizures and monitor for toxicity",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Seizure Management",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Eclamptic seizures = magnesium sulfate first-line, NOT benzodiazepines; keep calcium gluconate at bedside for toxicity",
    clinicalPearls: [
      "MgSO4 4-6 g loading, then 1-2 g/hr infusion for eclampsia",
      "Therapeutic Mg2+ level: 4-7 mg/dL; DTR loss at 7-10 mg/dL",
      "Calcium gluconate 1 g is the antidote for Mg2+ toxicity",
      "Eclampsia = seizure + preeclampsia = indication for delivery"
    ],
    safetyNote: "Check patellar reflexes every hour during magnesium infusion - loss of DTRs is the first sign of toxicity",
    distractorRationales: [
      "Magnesium sulfate is proven superior to both benzodiazepines and phenytoin for eclampsia",
      "Lorazepam is second-line if seizures persist despite magnesium",
      "BP control alone does not prevent seizure recurrence in eclampsia",
      "Phenytoin is inferior to magnesium for eclamptic seizure prevention"
    ],
    lessonLink: "/emergency/lessons/seizure-management"
  },
  {
    stem: "A 45-year-old male is brought in by EMS after being found unconscious. His GCS is 3. CT head shows a large epidural hematoma with 12 mm midline shift and a 'swirl sign' within the hematoma. What does the swirl sign indicate and what is the urgency level?",
    options: [
      "Active bleeding within the hematoma - this requires immediate surgical evacuation as hyperacute emergency",
      "Chronic organized hematoma that can be managed conservatively",
      "Calcification within the hematoma suggesting old injury",
      "Air within the hematoma suggesting open skull fracture"
    ],
    correctAnswer: 0,
    rationaleLong: "The 'swirl sign' on non-contrast CT head is a mixed-density pattern within an epidural hematoma (EDH) that indicates active, ongoing hemorrhage. On CT, clotted blood appears hyperdense (bright white, 60-80 Hounsfield units), while fresh unclotted blood appears relatively hypodense (darker, 30-40 Hounsfield units) within the hematoma. The swirl pattern of intermixed hyperdense (clotted) and hypodense (fresh, unclotted) blood signifies that active bleeding is occurring into the existing hematoma. This finding carries extreme urgency because: (1) The hematoma is actively expanding, (2) 12 mm of midline shift indicates significant mass effect with imminent herniation, (3) GCS of 3 indicates profound neurological compromise likely from brainstem compression. Epidural hematomas are typically caused by rupture of the middle meningeal artery (associated with temporal bone fractures) and can expand rapidly. The classic presentation is the 'lucid interval' - initial loss of consciousness, brief improvement, then rapid deterioration as the hematoma expands. However, many patients (especially with severe injuries) do not demonstrate this pattern. This patient requires immediate surgical evacuation (craniotomy for hematoma drainage and hemostasis of the bleeding vessel). The mortality of EDH with surgical evacuation is approximately 10-20%, but without surgery, it approaches 100% when there is significant mass effect. The emergency nurse should prepare for emergent OR transfer, ensure blood products are available, and implement herniation protocol (mannitol/hypertonic saline) as a bridge to surgery.",
    learningObjective: "Recognize the CT swirl sign as indicating active hemorrhage requiring immediate surgical intervention",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Traumatic Brain Injury",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Swirl sign = active bleeding within hematoma = hyperacute surgical emergency; don't wait for clinical deterioration",
    clinicalPearls: [
      "Swirl sign: mixed density (clotted + fresh blood) = active hemorrhage",
      "EDH most commonly from middle meningeal artery rupture",
      "Classic lucid interval occurs in only 20-30% of EDH patients",
      "EDH mortality without surgery approaches 100% with mass effect"
    ],
    safetyNote: "EDH with active bleeding is one of the most time-critical neurosurgical emergencies - minutes matter",
    distractorRationales: [
      "Swirl sign indicates active bleeding requiring immediate surgery",
      "Chronic hematomas appear uniformly hypodense, not mixed density",
      "Calcification appears as discrete dense foci, not a swirl pattern",
      "Air appears as very hypodense (black) foci, distinct from the swirl pattern"
    ],
    lessonLink: "/emergency/lessons/traumatic-brain-injury"
  },
  {
    stem: "A nurse is assessing a 60-year-old male with acute right hemispheric stroke. Which deficit is MOST characteristic of right hemisphere stroke compared to left hemisphere stroke?",
    options: [
      "Left-sided hemispatial neglect (anosognosia) - the patient ignores the left side of space and may deny having any deficit",
      "Expressive aphasia (Broca's) - difficulty producing fluent speech",
      "Receptive aphasia (Wernicke's) - difficulty understanding spoken language",
      "Right-left confusion and finger agnosia (Gerstmann syndrome)"
    ],
    correctAnswer: 0,
    rationaleLong: "Left-sided hemispatial neglect (also called unilateral spatial neglect or hemineglect) is the MOST characteristic and clinically significant deficit of right hemisphere stroke. Patients with neglect fail to attend to, perceive, or respond to stimuli in the left hemispace (contralateral to the lesion). This can manifest as: ignoring food on the left side of the plate, failing to dress the left side of the body, not recognizing their own left limbs, drawing only the right half of a clock face, and reading only the right side of text. Importantly, patients with neglect often exhibit anosognosia - unawareness of their own deficit. They may deny having any weakness or may confabulate explanations for their deficits. Anosognosia is particularly dangerous in the ED because these patients may attempt to get up and walk despite left-sided hemiparesis, creating a high fall risk. The right parietal lobe (inferior parietal lobule) plays a dominant role in spatial attention, attending to BOTH sides of space, while the left parietal lobe predominantly attends to the right side only. This is why right hemisphere damage produces much more severe and clinically apparent neglect than left hemisphere damage. Broca's aphasia (expressive, non-fluent) and Wernicke's aphasia (receptive, fluent) are characteristic of LEFT hemisphere strokes because the dominant hemisphere for language is the left in 95% of right-handed and 60% of left-handed individuals. Gerstmann syndrome (right-left confusion, finger agnosia, agraphia, acalculia) also localizes to the dominant (usually left) angular gyrus.",
    learningObjective: "Recognize left-sided hemispatial neglect with anosognosia as the hallmark of right hemisphere stroke",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Stroke Management",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Right hemisphere stroke = neglect/anosognosia; Left hemisphere stroke = aphasia; neglect patients are high fall risk",
    clinicalPearls: [
      "Neglect patients may deny deficits (anosognosia) and attempt unsafe activities",
      "Test for neglect: clock drawing, line bisection, extinction testing",
      "Right parietal lobe attends to both sides of space; left attends only to right",
      "Neglect is a major fall risk factor - position call bell and care items on right side"
    ],
    safetyNote: "Neglect patients are at extreme fall risk because they deny having weakness - implement strict fall precautions",
    distractorRationales: [
      "Left-sided neglect with anosognosia is the hallmark of right hemisphere stroke",
      "Broca's aphasia localizes to the left frontal lobe (dominant hemisphere)",
      "Wernicke's aphasia localizes to the left temporal lobe (dominant hemisphere)",
      "Gerstmann syndrome localizes to the left angular gyrus (dominant hemisphere)"
    ],
    lessonLink: "/emergency/lessons/stroke-management"
  },
  {
    stem: "A 72-year-old female with atrial fibrillation takes dabigatran. She presents with acute onset of left-sided weakness and facial droop. NIHSS is 16. CT head shows no hemorrhage. She took her last dabigatran dose 3 hours ago. Can IV alteplase be safely administered?",
    options: [
      "No - dabigatran taken within 48 hours contraindicates alteplase unless specific drug level testing shows negligible anticoagulant effect or idarucizumab is administered first",
      "Yes - alteplase can be given regardless of anticoagulant status in stroke",
      "Yes - dabigatran has a short half-life so 3 hours is sufficient clearance",
      "No - but aspirin 325 mg should be given instead as the next best option"
    ],
    correctAnswer: 0,
    rationaleLong: "In patients taking direct oral anticoagulants (DOACs) including dabigatran, alteplase administration for acute ischemic stroke requires careful consideration of the patient's anticoagulation status. Current AHA/ASA guidelines recommend that IV alteplase should generally NOT be administered if a DOAC was taken within the preceding 48 hours, because the residual anticoagulant effect significantly increases the risk of symptomatic intracerebral hemorrhage. This patient took dabigatran only 3 hours ago, well within the 48-hour window, making alteplase contraindicated under standard guidelines. However, there are two scenarios where alteplase might still be considered: (1) Specific drug level testing: If a thrombin time (TT) or dilute thrombin time (dTT) for dabigatran returns normal, this indicates negligible anticoagulant effect and alteplase can be considered. An aPTT within normal range also suggests low dabigatran levels but is less specific. The challenge is that these tests may not be readily available or have rapid turnaround in many EDs. (2) Idarucizumab (Praxbind) administration: Idarucizumab is the specific reversal agent for dabigatran (a humanized monoclonal antibody fragment that binds dabigatran with 350x higher affinity than thrombin). Giving idarucizumab 5 g IV (two 2.5 g vials) can completely reverse dabigatran's anticoagulant effect within minutes, after which alteplase can be safely administered. This 'reversal then lysis' approach has been described in case series and is increasingly used. Alternatively, this patient with NIHSS 16 likely has a large vessel occlusion and should be evaluated for mechanical thrombectomy, which does not require reversal of anticoagulation.",
    learningObjective: "Recognize DOAC use within 48 hours as a relative contraindication to alteplase and understand reversal strategies",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Stroke Management",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "DOAC within 48 hours generally contraindicates alteplase; idarucizumab can reverse dabigatran before thrombolysis",
    clinicalPearls: [
      "DOAC within 48 hours: alteplase generally contraindicated",
      "Normal thrombin time suggests negligible dabigatran effect",
      "Idarucizumab 5 g IV reverses dabigatran within minutes",
      "Consider thrombectomy for LVO - doesn't require anticoagulation reversal"
    ],
    safetyNote: "Alteplase with therapeutic DOAC levels dramatically increases intracranial hemorrhage risk",
    distractorRationales: [
      "Dabigatran within 48 hours contraindicates alteplase without reversal or level testing",
      "Alteplase with active anticoagulation dramatically increases hemorrhage risk",
      "Dabigatran half-life is 12-17 hours - 3 hours is insufficient clearance",
      "Aspirin within 24 hours of alteplase is also contraindicated"
    ],
    lessonLink: "/emergency/lessons/stroke-management"
  }
];
