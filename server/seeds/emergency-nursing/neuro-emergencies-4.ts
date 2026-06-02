import { EmergencyNursingQuestion } from "./types";

export const neuroEmergency4Questions: EmergencyNursingQuestion[] = [
  {
    stem: "A 72-year-old male presents with acute onset of right-sided hemiparesis and aphasia 90 minutes ago. CT head shows no hemorrhage. His blood glucose is 42 mg/dL. What should the emergency nurse do BEFORE administering alteplase?",
    options: [
      "Administer IV dextrose 50% (D50) 25 mL and reassess neurological status after glucose correction",
      "Proceed with alteplase immediately as time is critical in acute stroke",
      "Obtain MRI brain to confirm ischemic stroke before any treatment",
      "Administer aspirin 325 mg as bridge therapy while preparing alteplase"
    ],
    correctAnswer: 0,
    rationaleLong: "Hypoglycemia is the most important stroke mimic that must be excluded before administering thrombolytics. Severe hypoglycemia (blood glucose <60 mg/dL) can cause focal neurological deficits that are clinically indistinguishable from acute ischemic stroke, including hemiparesis, aphasia, and altered consciousness. These symptoms resolve completely with glucose correction, making thrombolysis unnecessary and exposing the patient to bleeding risk without benefit. AHA/ASA stroke guidelines mandate that blood glucose be checked and corrected before alteplase administration. The treatment is IV dextrose 50% (D50W) 25 mL (12.5 grams of dextrose) administered as an IV push. If symptoms resolve with glucose correction, the diagnosis is hypoglycemia, not stroke, and alteplase is not indicated. If symptoms persist despite normoglycemia, then the workup for acute stroke continues. Other important stroke mimics include: seizure with postictal deficit (Todd's paralysis), complex migraine with aura, conversion disorder, brain tumor, and hypertensive encephalopathy. Administering alteplase without checking glucose could result in unnecessary hemorrhagic risk for a readily reversible condition. MRI is not required before alteplase - CT to exclude hemorrhage is sufficient. Aspirin is contraindicated within 24 hours of alteplase administration due to increased bleeding risk. The emergency nurse should ensure point-of-care glucose testing is performed within minutes of arrival for all suspected stroke patients.",
    learningObjective: "Correct hypoglycemia before administering thrombolytics as it is the most critical stroke mimic to exclude",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Stroke Management",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "ALWAYS check and correct blood glucose before alteplase - hypoglycemia perfectly mimics stroke",
    clinicalPearls: [
      "Hypoglycemia is the #1 stroke mimic that changes management",
      "D50W 25 mL IV push corrects most hypoglycemia within minutes",
      "If symptoms resolve with glucose correction, it's not a stroke",
      "Point-of-care glucose should be obtained within minutes of arrival"
    ],
    safetyNote: "Administering alteplase to a hypoglycemic patient exposes them to hemorrhagic risk for a reversible condition",
    distractorRationales: [
      "Glucose correction must precede alteplase to rule out hypoglycemia as stroke mimic",
      "Proceeding without glucose check risks unnecessary hemorrhagic complications",
      "MRI is not required before alteplase - non-contrast CT is sufficient",
      "Aspirin is contraindicated within 24 hours of alteplase administration"
    ],
    lessonLink: "/emergency/lessons/stroke-management"
  },
  {
    stem: "A 28-year-old female presents with the worst headache of her life that began suddenly during sexual intercourse. CT head is negative. LP shows xanthochromia and elevated RBC count that does not clear between tubes. What is the diagnosis and next step?",
    options: [
      "Subarachnoid hemorrhage - obtain CT angiography to identify the source of bleeding",
      "Traumatic lumbar puncture - repeat LP at a higher interspace",
      "Migraine headache - administer IV ketorolac and metoclopramide",
      "Meningitis - start empiric antibiotics and dexamethasone"
    ],
    correctAnswer: 0,
    rationaleLong: "This presentation is classic for subarachnoid hemorrhage (SAH). The sudden onset worst headache of life (thunderclap headache) occurring during physical exertion (sexual intercourse, straining, heavy lifting) is the hallmark presentation of aneurysmal SAH. While CT head has 98% sensitivity for SAH within 6 hours of onset, it decreases to 93% at 12 hours and 50% at 5 days. When CT is negative but clinical suspicion remains high, lumbar puncture is the definitive diagnostic test. The LP findings in this case are diagnostic of SAH: xanthochromia (yellowish discoloration of CSF caused by breakdown of hemoglobin to bilirubin, which takes approximately 2-12 hours after bleeding) and an RBC count that does NOT clear between sequential tubes (unlike a traumatic tap where RBC count progressively decreases from tube 1 to tube 4). Xanthochromia is the most reliable LP finding for SAH because it distinguishes true subarachnoid blood (present long enough for hemoglobin degradation) from a traumatic tap (fresh blood introduced during the procedure). Once SAH is confirmed, the next step is CT angiography (CTA) to identify the source of bleeding - most commonly a ruptured cerebral aneurysm (85% of non-traumatic SAH). CTA has sensitivity of 95-100% for aneurysms >3 mm. If CTA is negative, conventional cerebral angiography (digital subtraction angiography) should be performed. Emergency management includes: maintaining SBP <160 mmHg until the aneurysm is secured, administering nimodipine 60 mg every 4 hours for 21 days (to prevent delayed cerebral ischemia from vasospasm), strict bed rest, stool softeners to prevent straining, and emergent neurosurgical consultation for aneurysm securing (surgical clipping or endovascular coiling).",
    learningObjective: "Diagnose SAH based on LP findings when CT is negative and initiate appropriate workup with CT angiography",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Subarachnoid Hemorrhage",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Negative CT does NOT rule out SAH - LP with xanthochromia and non-clearing RBCs confirms the diagnosis",
    clinicalPearls: [
      "CT sensitivity for SAH decreases over time: 98% at 6h, 93% at 12h, 50% at 5 days",
      "Xanthochromia = hemoglobin breakdown = blood has been present >2 hours",
      "Non-clearing RBCs distinguish SAH from traumatic LP",
      "Nimodipine prevents vasospasm-induced delayed cerebral ischemia"
    ],
    safetyNote: "Maintain SBP <160 mmHg in confirmed SAH until the aneurysm is secured to prevent rebleeding",
    distractorRationales: [
      "SAH confirmed by xanthochromia and non-clearing RBCs; CTA identifies the bleeding source",
      "Traumatic LP shows clearing RBCs and no xanthochromia",
      "Thunderclap headache during exertion is SAH until proven otherwise, not migraine",
      "Meningitis presents with fever, nuchal rigidity, and different CSF findings"
    ],
    lessonLink: "/emergency/lessons/subarachnoid-hemorrhage"
  },
  {
    stem: "A 65-year-old male with acute ischemic stroke has a blood pressure of 210/118 mmHg. He is a candidate for IV alteplase. To what level must BP be reduced before alteplase administration?",
    options: [
      "Below 185/110 mmHg",
      "Below 220/120 mmHg",
      "Below 160/90 mmHg",
      "Below 140/80 mmHg"
    ],
    correctAnswer: 0,
    rationaleLong: "Before administering IV alteplase for acute ischemic stroke, blood pressure must be reduced to below 185/110 mmHg and maintained below 180/105 mmHg for at least 24 hours after administration. This threshold is established by AHA/ASA guidelines based on the increased risk of symptomatic intracranial hemorrhage (sICH) when thrombolytics are given at higher blood pressures. The recommended antihypertensive agents for acute stroke BP management include: IV labetalol 10-20 mg over 1-2 minutes (may repeat once), IV nicardipine infusion starting at 5 mg/hr and titrating by 2.5 mg/hr every 5-15 minutes to a maximum of 15 mg/hr, or IV clevidipine infusion starting at 1-2 mg/hr and doubling every 2-15 minutes to maximum of 21 mg/hr. If blood pressure cannot be brought below 185/110 mmHg with these agents, alteplase should NOT be administered. The threshold of 220/120 mmHg applies to patients who are NOT candidates for thrombolysis - in these patients, permissive hypertension is allowed up to 220/120 mmHg because the elevated BP may maintain perfusion to the ischemic penumbra. Reducing BP to 160/90 or 140/80 is overly aggressive and may worsen stroke outcome by reducing perfusion to salvageable brain tissue. The emergency nurse should use an arterial line for continuous BP monitoring during and after alteplase administration and should avoid sublingual nifedipine (unpredictable, precipitous BP drops).",
    learningObjective: "Apply the correct blood pressure threshold of <185/110 mmHg before alteplase administration for stroke",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Stroke Management",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Alteplase-eligible stroke: BP <185/110 before, <180/105 for 24h after; non-eligible: permissive up to 220/120",
    clinicalPearls: [
      "Pre-alteplase BP target: <185/110 mmHg",
      "Post-alteplase BP target: <180/105 mmHg for 24 hours",
      "Labetalol and nicardipine are preferred IV antihypertensives",
      "If BP can't be controlled, alteplase is contraindicated"
    ],
    safetyNote: "Never use sublingual nifedipine for stroke BP management - causes unpredictable precipitous BP drops",
    distractorRationales: [
      "185/110 is the correct threshold for alteplase eligibility",
      "220/120 applies to non-alteplase stroke patients for permissive hypertension",
      "160/90 is too aggressive and may worsen ischemic penumbra perfusion",
      "140/80 is dangerously low and would reduce collateral blood flow"
    ],
    lessonLink: "/emergency/lessons/stroke-management"
  },
  {
    stem: "A 45-year-old female presents with progressive ascending weakness starting in her feet and moving to her legs over 3 days. She had a gastrointestinal illness 2 weeks ago. Deep tendon reflexes are absent bilaterally. Vital capacity is measured at 18 mL/kg (normal >60 mL/kg). What is the most critical nursing intervention?",
    options: [
      "Prepare for emergent intubation as the vital capacity indicates impending respiratory failure",
      "Administer IV methylprednisolone 1 gram for presumed inflammatory demyelination",
      "Position the patient in Trendelenburg to improve ventilation",
      "Obtain urgent MRI of the lumbar spine to rule out compression"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with Guillain-Barré syndrome (GBS), an acute inflammatory demyelinating polyneuropathy characterized by ascending weakness, areflexia, and frequently preceded by a gastrointestinal (Campylobacter jejuni) or respiratory infection 1-4 weeks prior. The most critical finding in this scenario is the vital capacity (VC) of 18 mL/kg, which is well below the threshold for elective intubation. The '20/30/40 rule' guides respiratory monitoring in GBS: intubation should be strongly considered when VC <20 mL/kg, maximal inspiratory pressure (MIP or NIF) <-30 cmH2O, or maximal expiratory pressure (MEP) <40 cmH2O. At 18 mL/kg, this patient is at immediate risk for respiratory failure and should be intubated electively before respiratory arrest occurs. Up to 30% of GBS patients require mechanical ventilation. The emergency nurse should: prepare for RSI (avoiding succinylcholine which can cause fatal hyperkalemia in denervated muscles), ensure continuous pulse oximetry and capnography, perform serial VC and NIF measurements every 2-4 hours, and monitor for autonomic dysfunction (blood pressure lability, cardiac arrhythmias, urinary retention). IV corticosteroids (methylprednisolone) are NOT effective in GBS and are not recommended - the definitive treatments are IV immunoglobulin (IVIG 0.4 g/kg/day for 5 days) or plasmapheresis. Trendelenburg position can worsen diaphragmatic function in a patient with respiratory muscle weakness. MRI of the spine may show nerve root enhancement but should not delay respiratory management.",
    learningObjective: "Recognize critical respiratory compromise in GBS using the 20/30/40 rule and prepare for emergent intubation",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Neuromuscular Emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "GBS respiratory monitoring: VC <20 mL/kg, NIF <-30, MEP <40 = intubate; AVOID succinylcholine",
    clinicalPearls: [
      "20/30/40 rule: VC <20, NIF <-30, MEP <40 → intubate",
      "30% of GBS patients require mechanical ventilation",
      "Succinylcholine is contraindicated - causes hyperkalemia in denervated muscles",
      "IVIG and plasmapheresis are definitive treatments, NOT steroids"
    ],
    safetyNote: "Succinylcholine can cause fatal hyperkalemia in GBS - use rocuronium for RSI",
    distractorRationales: [
      "VC of 18 mL/kg is below the 20 mL/kg threshold requiring intubation",
      "Corticosteroids are ineffective in GBS - use IVIG or plasmapheresis",
      "Trendelenburg worsens diaphragmatic function in respiratory muscle weakness",
      "MRI should not delay respiratory management in impending failure"
    ],
    lessonLink: "/emergency/lessons/neuromuscular-emergencies"
  },
  {
    stem: "A 58-year-old male presents with acute onset of vertigo, nystagmus, ataxia, and dysphagia after waking from sleep. CT head is negative. MRI shows a lateral medullary infarct. Which vascular territory is affected?",
    options: [
      "Posterior inferior cerebellar artery (PICA) territory - Wallenberg syndrome",
      "Anterior inferior cerebellar artery (AICA) territory",
      "Superior cerebellar artery (SCA) territory",
      "Basilar artery main trunk"
    ],
    correctAnswer: 0,
    rationaleLong: "Wallenberg syndrome (lateral medullary syndrome) is caused by occlusion of the posterior inferior cerebellar artery (PICA) or, less commonly, the vertebral artery. It is one of the most clinically distinct stroke syndromes, affecting the lateral medulla. The hallmark features include: (1) Vertigo with nystagmus (vestibular nucleus involvement), (2) Ipsilateral facial pain and temperature loss (descending trigeminal tract), (3) Contralateral body pain and temperature loss (spinothalamic tract), (4) Ipsilateral Horner's syndrome (descending sympathetic fibers - ptosis, miosis, anhidrosis), (5) Dysphagia and hoarseness (nucleus ambiguus - CN IX, X), (6) Ipsilateral cerebellar ataxia (inferior cerebellar peduncle). A critical clinical pearl is the crossed sensory deficit: ipsilateral face + contralateral body pain/temperature loss, which is virtually pathognomonic for lateral medullary infarction. Dysphagia is particularly important for the emergency nurse because it places the patient at high aspiration risk - a formal swallow evaluation should be performed before any oral intake. AICA syndrome affects the lateral pons and includes hearing loss (cochlear nucleus) and facial weakness (facial nerve nucleus), which are absent in Wallenberg syndrome. SCA syndrome involves the superior cerebellum and lateral pons with prominent cerebellar ataxia. Basilar artery occlusion causes bilateral brainstem signs with potentially devastating locked-in syndrome.",
    learningObjective: "Identify Wallenberg syndrome as PICA territory infarction and recognize the crossed sensory deficit pattern",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Posterior Circulation Stroke",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Crossed sensory deficit (ipsilateral face + contralateral body) is pathognomonic for Wallenberg syndrome",
    clinicalPearls: [
      "Wallenberg = PICA territory = lateral medulla",
      "Crossed sensory deficit: ipsilateral face, contralateral body",
      "Dysphagia creates high aspiration risk - NPO until swallow evaluation",
      "Ipsilateral Horner's syndrome (ptosis, miosis, anhidrosis) is common"
    ],
    safetyNote: "Keep patient NPO until formal swallow evaluation - dysphagia from Wallenberg syndrome causes high aspiration risk",
    distractorRationales: [
      "PICA occlusion causes Wallenberg syndrome with its classic lateral medullary features",
      "AICA syndrome includes hearing loss and facial weakness, absent here",
      "SCA syndrome primarily involves superior cerebellum, different presentation",
      "Basilar occlusion causes bilateral signs, not the unilateral pattern described"
    ],
    lessonLink: "/emergency/lessons/posterior-circulation-stroke"
  },
  {
    stem: "A 35-year-old male with known epilepsy presents in continuous generalized tonic-clonic seizures lasting 15 minutes. IV access has been established. IV lorazepam 4 mg has been given twice without effect. What is the next medication the emergency nurse should prepare?",
    options: [
      "IV fosphenytoin 20 mg PE/kg infused at 150 mg PE/min",
      "IV propofol 2 mg/kg bolus for general anesthesia",
      "IV phenobarbital 20 mg/kg at 50 mg/min",
      "IM midazolam 10 mg for additional benzodiazepine effect"
    ],
    correctAnswer: 0,
    rationaleLong: "Status epilepticus (SE) is defined as continuous seizure activity lasting >5 minutes or two or more seizures without full recovery between them. This patient has been seizing for 15 minutes and has failed two doses of IV lorazepam (first-line therapy), meeting the criteria for benzodiazepine-refractory status epilepticus. According to the Neurocritical Care Society and AES guidelines, the next step in the treatment algorithm is a second-line antiepileptic drug (AED). The recommended options for second-line AEDs are: (1) IV fosphenytoin 20 mg PE/kg (phenytoin equivalents) infused at 150 mg PE/min (preferred over phenytoin due to lower risk of infusion-site reactions and purple glove syndrome), (2) IV valproate sodium 40 mg/kg at 10 mg/kg/min, or (3) IV levetiracetam 60 mg/kg at 5 mg/kg/min. Fosphenytoin is the most commonly used second-line agent. The nurse should monitor for hypotension and cardiac arrhythmias during infusion and must use a cardiac monitor. Fosphenytoin is preferred over phenytoin because it can be infused faster (150 mg PE/min vs 50 mg/min), can be given IM if IV access is lost, and has a lower incidence of infusion-related complications. Propofol would be third-line therapy (anesthetic-dose agents) reserved for refractory status epilepticus that fails second-line AEDs, requiring intubation and ICU admission. Phenobarbital is an alternative second-line agent but is less commonly used due to pronounced respiratory depression and hypotension. Additional IM midazolam after two doses of IV lorazepam is unlikely to be effective as the patient has already demonstrated benzodiazepine resistance.",
    learningObjective: "Follow the stepwise protocol for status epilepticus: benzodiazepines → second-line AED (fosphenytoin) → anesthetic agents",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Seizure Management",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Benzodiazepine-refractory SE: next step is fosphenytoin (or valproate/levetiracetam), NOT more benzodiazepines",
    clinicalPearls: [
      "SE treatment ladder: benzodiazepine → fosphenytoin/valproate/levetiracetam → anesthetics",
      "Fosphenytoin preferred over phenytoin: faster infusion, fewer site reactions",
      "Monitor cardiac rhythm during fosphenytoin infusion - risk of arrhythmias",
      "Propofol/pentobarbital are third-line requiring intubation"
    ],
    safetyNote: "Fosphenytoin infusion can cause hypotension and cardiac arrhythmias - continuous cardiac monitoring is mandatory",
    distractorRationales: [
      "Fosphenytoin is the appropriate second-line agent after benzodiazepine failure",
      "Propofol is third-line therapy requiring intubation for refractory SE",
      "Phenobarbital is an alternative but causes more respiratory depression",
      "Additional benzodiazepine is unlikely effective after two failed doses"
    ],
    lessonLink: "/emergency/lessons/seizure-management"
  },
  {
    stem: "A 70-year-old female presents with acute onset of the worst headache of her life, NIHSS score of 22, and CT head showing a large right-sided intracerebral hemorrhage (ICH) measuring 45 mL with intraventricular extension. Her INR is 3.2 on warfarin. What are the two most critical immediate interventions?",
    options: [
      "Emergent INR reversal with 4-factor PCC and IV vitamin K, plus blood pressure reduction to SBP <140 mmHg",
      "Emergent craniotomy for hematoma evacuation and VP shunt placement",
      "IV alteplase for concomitant ischemic stroke and blood pressure reduction",
      "Observation in ICU with repeat CT in 6 hours and gradual warfarin dose reduction"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with a large, life-threatening intracerebral hemorrhage (ICH) complicated by supratherapeutic anticoagulation (INR 3.2 on warfarin) and intraventricular extension, both of which significantly worsen prognosis. The two most critical immediate interventions are: (1) Emergent anticoagulation reversal: 4-factor prothrombin complex concentrate (4F-PCC, dosed based on INR and weight) PLUS IV vitamin K 10 mg over 20 minutes. This combination rapidly normalizes the INR (PCC within 15-30 minutes, vitamin K sustains the effect) to stop hematoma expansion. Hematoma expansion is the most modifiable predictor of poor outcome in ICH, and anticoagulation-associated ICH has a 50% mortality rate. Every minute of delay in reversal allows continued bleeding. (2) Blood pressure reduction to SBP <140 mmHg per the INTERACT2 and ATACH-2 trial data. The AHA/ASA ICH guidelines recommend SBP <140 mmHg for patients presenting with SBP 150-220 mmHg. IV nicardipine or clevidipine infusions are preferred for precise titration. Aggressive BP reduction reduces hematoma expansion without increasing perilesional ischemia. The combination of rapid INR reversal and BP reduction addresses the two main drivers of hematoma growth: coagulopathy and hydrostatic pressure. FFP alone is inferior to PCC (slower, requires larger volume, incomplete reversal). Craniotomy for hematoma evacuation remains controversial - the STICH and STICH II trials showed no clear benefit for surgical evacuation of supratentorial ICH, though decompressive craniectomy may be considered for massive hemorrhage with herniation. Alteplase is absolutely contraindicated in hemorrhagic stroke. Observation and gradual dose reduction would allow continued hemorrhage.",
    learningObjective: "Prioritize emergent anticoagulation reversal and blood pressure control as the two critical interventions in warfarin-associated ICH",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Intracerebral Hemorrhage",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Warfarin-associated ICH: PCC + vitamin K for reversal AND SBP <140 mmHg - both must happen simultaneously",
    clinicalPearls: [
      "Hematoma expansion is the most modifiable predictor of ICH outcome",
      "Warfarin ICH mortality is 50% - emergent reversal is life-saving",
      "4F-PCC reverses INR in 15-30 minutes vs FFP which takes hours",
      "SBP target <140 mmHg reduces hematoma expansion"
    ],
    safetyNote: "Every minute of delay in anticoagulation reversal allows continued intracranial bleeding",
    distractorRationales: [
      "PCC + vitamin K reversal and BP reduction address both drivers of hematoma growth",
      "Craniotomy has no proven benefit for supratentorial ICH in most cases",
      "Alteplase is absolutely contraindicated in hemorrhagic stroke",
      "Observation with gradual dose reduction allows continued hemorrhage"
    ],
    lessonLink: "/emergency/lessons/intracerebral-hemorrhage"
  },
  {
    stem: "A 55-year-old female presents with sudden onset of bilateral lower extremity weakness, urinary retention, and sensory loss below the umbilicus. Back pain at the T10 level preceded the weakness by 2 hours. MRI shows a T8-T10 epidural abscess with cord compression. What is the priority intervention?",
    options: [
      "Emergent neurosurgical decompression within 24 hours plus IV antibiotics",
      "IV antibiotics alone with serial neurological exams every 4 hours",
      "High-dose IV methylprednisolone per spinal cord injury protocol",
      "Lumbar puncture to identify the causative organism before treatment"
    ],
    correctAnswer: 0,
    rationaleLong: "Spinal epidural abscess (SEA) with neurological deficits is a neurosurgical emergency requiring both emergent surgical decompression and IV antibiotics. This patient has progressed to the paralytic stage (Stage IV of the Heusner classification: back pain → radiculopathy → weakness/sphincter dysfunction → paralysis), and the duration and severity of neurological deficit at the time of surgery are the strongest predictors of outcome. Studies show that patients who undergo decompressive surgery within 24-36 hours of developing motor weakness have significantly better neurological outcomes than those treated conservatively or with delayed surgery. The longer the cord is compressed, the less likely neurological recovery will occur. Staphylococcus aureus is the causative organism in 60-70% of cases, with MRSA being increasingly common. IV antibiotics should be initiated empirically before surgery (vancomycin + cefepime or meropenem for broad coverage), but antibiotics alone are insufficient when neurological deficits are present - the abscess exerts mechanical compression on the spinal cord that antibiotics cannot relieve rapidly enough. The combination of surgical decompression (laminectomy with drainage) and targeted antibiotics (typically 6-8 weeks of IV therapy) provides the best outcomes. Methylprednisolone is used for traumatic spinal cord injury, not infectious causes - steroids can worsen infection. Lumbar puncture is contraindicated in spinal epidural abscess because it can introduce bacteria into the subarachnoid space and cause meningitis, and it delays definitive treatment.",
    learningObjective: "Recognize spinal epidural abscess with neurological deficits as a neurosurgical emergency requiring decompression within 24 hours",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Spinal Cord Emergencies",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Epidural abscess with motor deficit = surgical emergency; antibiotics alone are insufficient for cord compression",
    clinicalPearls: [
      "Duration of deficit before surgery is the strongest outcome predictor",
      "S. aureus is the causative organism in 60-70% of cases",
      "IV antibiotics for 6-8 weeks after surgical drainage",
      "Risk factors: IV drug use, diabetes, spinal procedures, immunosuppression"
    ],
    safetyNote: "Lumbar puncture is contraindicated in spinal epidural abscess - risk of meningitis from needle tracking",
    distractorRationales: [
      "Emergent surgery + antibiotics addresses both compression and infection",
      "Antibiotics alone cannot rapidly relieve mechanical cord compression",
      "Steroids worsen infection and are not indicated for infectious cord compression",
      "LP is contraindicated and delays definitive treatment"
    ],
    lessonLink: "/emergency/lessons/spinal-cord-emergencies"
  },
  {
    stem: "A 62-year-old male presents with acute onset of diplopia, dysarthria, and left-sided ataxia. CT head is negative. CTA shows a basilar artery occlusion. NIHSS is 14. He is 3 hours from symptom onset. What is the treatment approach?",
    options: [
      "IV alteplase AND emergent endovascular thrombectomy for basilar artery occlusion",
      "IV alteplase alone with close neurological monitoring",
      "Antiplatelet therapy with aspirin 325 mg and clopidogrel 300 mg loading",
      "IV heparin infusion for posterior circulation stroke"
    ],
    correctAnswer: 0,
    rationaleLong: "Basilar artery occlusion (BAO) is one of the most devastating forms of acute ischemic stroke, with mortality rates of 80-90% without treatment and high rates of severe disability among survivors. The basilar artery supplies the brainstem, cerebellum, and posterior cerebral arteries, and complete occlusion can lead to locked-in syndrome, coma, and death. This patient presents with classic posterior circulation stroke symptoms (diplopia, dysarthria, ataxia) and confirmed BAO on CTA within the treatment window. The optimal treatment approach combines IV alteplase (0.9 mg/kg, max 90 mg, with 10% bolus and 90% over 60 minutes) AND emergent endovascular thrombectomy. The BEST trial (2022) and ATTENTION trial (2022) demonstrated significant benefit of endovascular thrombectomy for basilar artery occlusion, similar to the evidence for anterior circulation large vessel occlusion. IV alteplase should be administered as a bridge therapy while preparing for thrombectomy (similar to anterior circulation LVO management). The thrombectomy window for BAO may extend beyond 24 hours in selected patients due to the slower progression of posterior circulation infarction (greater collateral supply). IV alteplase alone has limited efficacy for large vessel occlusions (LVO), with recanalization rates of only 10-25% for large arterial clots. Antiplatelet therapy alone is insufficient for acute large vessel occlusion. IV heparin is not first-line treatment for acute ischemic stroke. The emergency nurse should prepare for both alteplase administration and emergent transfer to the neurointerventional suite.",
    learningObjective: "Recognize basilar artery occlusion as requiring both IV thrombolysis and emergent mechanical thrombectomy",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Posterior Circulation Stroke",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Basilar artery occlusion = alteplase + thrombectomy; alteplase alone recanalized only 10-25% of LVOs",
    clinicalPearls: [
      "BAO mortality 80-90% without treatment",
      "BEST and ATTENTION trials proved thrombectomy benefit for BAO",
      "Thrombectomy window may extend beyond 24 hours for posterior circulation",
      "Posterior circulation symptoms: diplopia, dysarthria, ataxia, vertigo, coma"
    ],
    safetyNote: "Basilar occlusion can rapidly progress to locked-in syndrome or death - this is a time-critical emergency",
    distractorRationales: [
      "Combined alteplase and thrombectomy provides best recanalization for BAO",
      "Alteplase alone has only 10-25% recanalization rate for large vessel occlusions",
      "Antiplatelet therapy is insufficient for acute large vessel occlusion",
      "IV heparin is not standard first-line therapy for acute ischemic stroke"
    ],
    lessonLink: "/emergency/lessons/posterior-circulation-stroke"
  },
  {
    stem: "A 42-year-old female presents with rapidly progressive bilateral facial weakness, areflexia, and paresthesias in her hands and feet over 72 hours. CSF analysis shows albuminocytologic dissociation (elevated protein with normal cell count). Which variant of GBS does this presentation suggest, and what specific monitoring is crucial?",
    options: [
      "Acute inflammatory demyelinating polyneuropathy (AIDP) - monitor vital capacity and NIF every 4 hours for respiratory failure",
      "Miller Fisher syndrome - monitor for ophthalmoplegia progression",
      "Acute motor axonal neuropathy (AMAN) - monitor for cardiac arrhythmias only",
      "Chronic inflammatory demyelinating polyneuropathy (CIDP) - monitor for relapse"
    ],
    correctAnswer: 0,
    rationaleLong: "This presentation describes the classic form of Guillain-Barré syndrome - Acute Inflammatory Demyelinating Polyneuropathy (AIDP), which accounts for 85-90% of GBS cases in Western countries. The hallmark features are: rapidly progressive ascending weakness (here manifested as bilateral facial weakness and limb paresthesias), areflexia (loss of deep tendon reflexes from demyelination of motor nerve roots), and the characteristic CSF finding of albuminocytologic dissociation (elevated protein reflecting inflammation at the nerve roots, with normal white cell count - typically <10 cells/μL). The bilateral facial weakness (facial diplegia) is an important feature seen in 50% of GBS cases and distinguishes it from Bell's palsy (which is unilateral). The most critical monitoring parameter in GBS is serial respiratory function testing - specifically vital capacity (VC) and negative inspiratory force (NIF) every 2-4 hours. The 20/30/40 rule guides intubation decisions: VC <20 mL/kg, NIF <-30 cmH2O, or MEP <40 cmH2O indicates the need for elective intubation. Respiratory failure from diaphragmatic and intercostal muscle weakness is the most common cause of death in GBS. Additionally, autonomic monitoring is important because 65% of GBS patients develop autonomic dysfunction (blood pressure lability, cardiac arrhythmias, urinary retention, ileus). Miller Fisher syndrome (5% of GBS) presents with the triad of ophthalmoplegia, ataxia, and areflexia WITHOUT significant limb weakness. AMAN involves pure motor axonal damage without sensory findings. CIDP is chronic (>8 weeks) and not an acute presentation.",
    learningObjective: "Classify AIDP as the most common GBS variant and prioritize serial respiratory monitoring",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Neuromuscular Emergencies",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Bilateral facial weakness + ascending weakness + areflexia + high protein/normal cells CSF = AIDP; monitor VC every 4 hours",
    clinicalPearls: [
      "AIDP accounts for 85-90% of GBS in Western countries",
      "Albuminocytologic dissociation: high protein + normal cells in CSF",
      "50% of GBS patients develop bilateral facial weakness",
      "65% develop autonomic dysfunction - monitor BP and cardiac rhythm"
    ],
    safetyNote: "Serial vital capacity measurement every 2-4 hours is mandatory - respiratory failure can progress rapidly",
    distractorRationales: [
      "AIDP with respiratory monitoring is the correct classification and priority",
      "Miller Fisher presents with ophthalmoplegia, ataxia, areflexia without limb weakness",
      "AMAN involves only motor findings without sensory symptoms",
      "CIDP is chronic (>8 weeks) and not an acute emergency presentation"
    ],
    lessonLink: "/emergency/lessons/neuromuscular-emergencies"
  },
  {
    stem: "A 68-year-old male with Parkinson's disease on carbidopa-levodopa presents with temperature 41.2°C, severe rigidity, altered mental status, and autonomic instability (BP 200/110, HR 128, diaphoresis). His wife reports he stopped taking his Parkinson's medications 3 days ago. What is the diagnosis?",
    options: [
      "Neuroleptic malignant syndrome (NMS) from abrupt dopaminergic withdrawal",
      "Serotonin syndrome from medication interaction",
      "Malignant hyperthermia from anesthetic exposure",
      "Sepsis from urinary tract infection"
    ],
    correctAnswer: 0,
    rationaleLong: "This presentation is classic for Neuroleptic Malignant Syndrome (NMS), which can be triggered by two mechanisms: (1) dopamine receptor blockade by neuroleptic/antipsychotic medications, or (2) abrupt withdrawal of dopaminergic agents (such as carbidopa-levodopa in Parkinson's disease patients). The cardinal features of NMS are remembered by the mnemonic FALTER: Fever (typically >40°C/104°F), Altered mental status, Lead-pipe rigidity, Tremor, Elevated CK (often >1000 IU/L, can exceed 100,000), and autonomic instability (Renal failure from rhabdomyolysis is a feared complication). In this case, the abrupt discontinuation of carbidopa-levodopa 3 days ago removed central dopaminergic stimulation, effectively creating the same state as dopamine receptor blockade. Treatment includes: (1) Immediate reinstatement of dopaminergic medications (carbidopa-levodopa via NG tube if patient cannot swallow), (2) IV dantrolene 1-2.5 mg/kg for severe rigidity and hyperthermia (directly inhibits muscle contraction by blocking calcium release from the sarcoplasmic reticulum), (3) Oral bromocriptine 2.5-10 mg TID (a dopamine agonist), (4) Aggressive cooling measures, (5) Aggressive IV hydration with monitoring of CK and renal function, (6) ICU admission. Serotonin syndrome presents with clonus, hyperreflexia, and mydriasis (rather than the rigidity and bradyreflexia of NMS). Malignant hyperthermia occurs during anesthesia with halogenated agents or succinylcholine. While sepsis can cause fever and altered mental status, the severe lead-pipe rigidity and temporal relationship to medication cessation make NMS the clear diagnosis.",
    learningObjective: "Recognize NMS triggered by abrupt withdrawal of dopaminergic agents in Parkinson's disease",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Drug-Induced Neurological Emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "NMS can be caused by dopamine withdrawal (stopping levodopa), not just neuroleptic administration",
    clinicalPearls: [
      "NMS from levodopa withdrawal presents identically to NMS from neuroleptics",
      "FALTER: Fever, Altered MS, Lead-pipe rigidity, Tremor, Elevated CK, Renal failure",
      "Treatment: restart dopaminergic meds + dantrolene + bromocriptine + cooling",
      "CK can exceed 100,000 - monitor for rhabdomyolysis and renal failure"
    ],
    safetyNote: "Never abruptly discontinue dopaminergic medications in Parkinson's patients - taper gradually",
    distractorRationales: [
      "NMS from abrupt levodopa withdrawal explains all features",
      "Serotonin syndrome has clonus and hyperreflexia, not lead-pipe rigidity",
      "Malignant hyperthermia requires anesthetic exposure trigger",
      "Sepsis lacks the specific rigidity and medication-temporal relationship"
    ],
    lessonLink: "/emergency/lessons/drug-induced-neurological-emergencies"
  },
  {
    stem: "A 50-year-old male presents with progressive headache, confusion, and papilledema over 48 hours. CT head shows obstructive hydrocephalus from a colloid cyst of the third ventricle. What emergent intervention should the emergency nurse prepare for?",
    options: [
      "Emergent external ventricular drain (EVD) placement to relieve intracranial pressure",
      "IV mannitol 1 g/kg and head of bed elevation to 30 degrees only",
      "Lumbar puncture to drain excess CSF and measure opening pressure",
      "IV dexamethasone 10 mg for vasogenic edema reduction"
    ],
    correctAnswer: 0,
    rationaleLong: "Obstructive (non-communicating) hydrocephalus from a colloid cyst of the third ventricle is a neurosurgical emergency because the cyst acts as a ball-valve mechanism at the foramen of Monro, intermittently or completely blocking CSF flow from the lateral ventricles to the third ventricle. This causes acute or subacute elevation of intracranial pressure (ICP) with risk of rapid herniation and death. The definitive emergent intervention is placement of an external ventricular drain (EVD), also called a ventriculostomy. The EVD is a catheter placed through a burr hole (typically at Kocher's point) into the lateral ventricle, allowing controlled drainage of CSF and direct measurement of ICP. This provides immediate relief of elevated ICP while definitive treatment (surgical or endoscopic removal of the colloid cyst) is planned. The emergency nurse should prepare: the EVD kit and sterile supplies, head-shaving equipment, local anesthetic, and the external drainage system with calibrated collection chamber. While IV mannitol (0.5-1 g/kg) and head elevation are important temporizing measures for elevated ICP, they are insufficient as sole treatment for obstructive hydrocephalus because the obstruction is mechanical - CSF cannot drain past the cyst regardless of osmotic therapy. Lumbar puncture is CONTRAINDICATED in obstructive hydrocephalus because removing CSF from below the obstruction can create a pressure differential and precipitate transtentorial or tonsillar herniation. Dexamethasone reduces vasogenic edema (around tumors) but does not address the mechanical CSF obstruction.",
    learningObjective: "Prepare for emergent EVD placement as the intervention for obstructive hydrocephalus with elevated ICP",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Elevated Intracranial Pressure",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Obstructive hydrocephalus = EVD for CSF drainage; LP is CONTRAINDICATED due to herniation risk",
    clinicalPearls: [
      "Colloid cysts cause ball-valve obstruction at the foramen of Monro",
      "EVD provides immediate ICP relief and continuous ICP monitoring",
      "Kocher's point: 1 cm anterior to coronal suture, mid-pupillary line",
      "Can cause sudden death from acute hydrocephalus"
    ],
    safetyNote: "Lumbar puncture in obstructive hydrocephalus can cause fatal transtentorial herniation",
    distractorRationales: [
      "EVD provides definitive CSF drainage for mechanical obstruction",
      "Mannitol alone cannot overcome a mechanical CSF obstruction",
      "LP is contraindicated in obstructive hydrocephalus",
      "Dexamethasone treats vasogenic edema, not mechanical obstruction"
    ],
    lessonLink: "/emergency/lessons/elevated-intracranial-pressure"
  },
  {
    stem: "A 78-year-old female presents with acute right-sided weakness and aphasia. She was last known well 5 hours ago. CT perfusion shows a small core infarct (15 mL) with a large penumbra (120 mL), resulting in a mismatch ratio of 8:1. She is outside the standard IV alteplase window. What treatment is she still eligible for?",
    options: [
      "Mechanical thrombectomy based on favorable perfusion imaging (mismatch) up to 24 hours",
      "IV alteplase at reduced dose as she is still within 6 hours",
      "Aspirin and clopidogrel dual antiplatelet therapy",
      "No acute reperfusion therapy is available beyond 4.5 hours"
    ],
    correctAnswer: 0,
    rationaleLong: "The DAWN trial (2018) and DEFUSE 3 trial (2018) revolutionized acute stroke treatment by demonstrating that mechanical thrombectomy can be beneficial in select patients up to 24 hours from last known well, provided perfusion imaging shows favorable mismatch between the core infarct (irreversibly damaged tissue) and the ischemic penumbra (at-risk but salvageable tissue). This patient has ideal mismatch criteria: small core (15 mL) and large penumbra (120 mL), with a mismatch ratio of 8:1 (far exceeding the required ratio of >1.8). The DAWN trial criteria include: clinical deficit disproportionate to infarct volume (clinical-core mismatch), core infarct volume <21 mL for patients >80 years or <31 mL for patients 18-80 years (with NIHSS ≥10), and large vessel occlusion (ICA or M1 MCA). The DEFUSE 3 trial extended the window to 6-16 hours using perfusion mismatch criteria: mismatch ratio >1.8, mismatch volume >15 mL, and core infarct <70 mL. The rationale is that the small core indicates the brain tissue has adequate collateral blood supply maintaining the penumbra viable, and thrombectomy can restore perfusion to save this at-risk tissue. The standard IV alteplase window is 4.5 hours (WAKE-UP trial extended this to patients with unknown onset using MRI DWI-FLAIR mismatch). Beyond 4.5 hours, alteplase is not standard. Dual antiplatelet therapy does not provide acute reperfusion for large vessel occlusion.",
    learningObjective: "Apply perfusion mismatch criteria for extended-window mechanical thrombectomy based on DAWN and DEFUSE 3 trials",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Stroke Management",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Thrombectomy can be performed up to 24 hours with favorable perfusion mismatch (small core, large penumbra)",
    clinicalPearls: [
      "DAWN trial: thrombectomy up to 24 hours with clinical-core mismatch",
      "DEFUSE 3: thrombectomy 6-16 hours with perfusion mismatch ratio >1.8",
      "Small core + large penumbra = salvageable tissue with good collaterals",
      "CT perfusion is essential for extended-window treatment decisions"
    ],
    safetyNote: "Extended-window thrombectomy requires careful patient selection with perfusion imaging - not all late-presenting strokes qualify",
    distractorRationales: [
      "Favorable mismatch criteria allow thrombectomy up to 24 hours",
      "IV alteplase window is 4.5 hours maximum for standard treatment",
      "Dual antiplatelet therapy does not provide acute reperfusion for LVO",
      "DAWN and DEFUSE 3 trials proved reperfusion benefit beyond 4.5 hours"
    ],
    lessonLink: "/emergency/lessons/stroke-management"
  },
  {
    stem: "A 40-year-old female with myasthenia gravis presents with worsening dysphagia, diplopia, and respiratory difficulty. Her current medications include pyridostigmine and azathioprine. She recently had a URI and increased her pyridostigmine dose. How should the emergency nurse differentiate between myasthenic crisis and cholinergic crisis?",
    options: [
      "Administer edrophonium (Tensilon) test under controlled conditions - improvement suggests myasthenic crisis, worsening suggests cholinergic crisis",
      "Check serum acetylcholine receptor antibody levels for acute diagnosis",
      "Administer atropine 1 mg IV - improvement confirms cholinergic crisis",
      "Obtain nerve conduction studies and EMG for differentiation"
    ],
    correctAnswer: 0,
    rationaleLong: "Differentiating between myasthenic crisis and cholinergic crisis is one of the most critical diagnostic challenges in neuromuscular emergency care, as the treatments are opposite. Myasthenic crisis is caused by inadequate acetylcholinesterase inhibition (under-treatment) leading to severe weakness, while cholinergic crisis is caused by excessive acetylcholinesterase inhibition (over-treatment with pyridostigmine) leading to an overabundance of acetylcholine that paradoxically causes weakness through depolarization block, along with cholinergic symptoms (SLUDGE: Salivation, Lacrimation, Urination, Defecation, GI upset, Emesis + miosis, bradycardia, fasciculations). The edrophonium (Tensilon) test involves administering a short-acting acetylcholinesterase inhibitor: if the patient improves (increased strength), this confirms insufficient cholinergic stimulation (myasthenic crisis), and treatment is to increase pyridostigmine or initiate crisis management with IVIG/plasmapheresis. If the patient worsens (increased weakness, more secretions), this confirms excessive cholinergic stimulation (cholinergic crisis), and treatment is to withhold anticholinesterase medications and provide supportive care. IMPORTANT: The edrophonium test must be performed in a controlled setting with resuscitation equipment available because transient worsening can cause respiratory failure. Atropine should be at bedside to reverse cholinergic side effects. However, in practice, many centers now bypass the Tensilon test and simply hold all anticholinesterase medications while providing supportive care (including intubation if needed), starting IVIG or plasmapheresis, and gradually reintroducing pyridostigmine at a lower dose. Serum antibody levels take days to result and do not reflect acute crisis status. Nerve conduction studies are diagnostic for MG but do not differentiate crisis types acutely.",
    learningObjective: "Apply the edrophonium test to differentiate myasthenic crisis from cholinergic crisis",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Neuromuscular Emergencies",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Tensilon test: improvement = myasthenic crisis (under-treatment); worsening = cholinergic crisis (over-treatment)",
    clinicalPearls: [
      "Myasthenic crisis: under-treatment → increase therapy or IVIG/plasmapheresis",
      "Cholinergic crisis: over-treatment → hold anticholinesterases + supportive care",
      "SLUDGE mnemonic for cholinergic excess: Salivation, Lacrimation, Urination, Defecation, GI upset, Emesis",
      "Many centers now bypass Tensilon test and hold pyridostigmine as empiric approach"
    ],
    safetyNote: "Perform edrophonium test only with resuscitation equipment available - can cause acute respiratory failure",
    distractorRationales: [
      "Edrophonium test provides immediate differentiation between crisis types",
      "Antibody levels take days and don't reflect acute crisis status",
      "Atropine treats cholinergic symptoms but doesn't definitively differentiate crises",
      "NCS/EMG are diagnostic for MG but not useful for acute crisis differentiation"
    ],
    lessonLink: "/emergency/lessons/neuromuscular-emergencies"
  },
  {
    stem: "A 25-year-old male presents after a diving accident with cervical spine injury at C4. He has complete motor and sensory loss below the nipple line, priapism, and hypotension (BP 76/40) with bradycardia (HR 44). Despite 2 liters of IV normal saline, BP remains low. What type of shock is this and what is the appropriate vasopressor?",
    options: [
      "Neurogenic shock - IV norepinephrine infusion to maintain MAP ≥85 mmHg",
      "Hemorrhagic shock - continue volume resuscitation with blood products",
      "Cardiogenic shock - IV dobutamine for cardiac contractility support",
      "Septic shock - IV broad-spectrum antibiotics and vasopressors"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with neurogenic shock secondary to acute cervical spinal cord injury at C4. Neurogenic shock results from disruption of sympathetic nervous system outflow from the thoracolumbar cord (T1-L2), leading to: (1) Loss of sympathetic vascular tone causing vasodilation and hypotension (warm, pink extremities - unlike hemorrhagic shock which causes cold, pale extremities), (2) Loss of sympathetic cardiac innervation (T1-T4) causing bradycardia (unlike hemorrhagic or septic shock where tachycardia is expected), (3) Loss of temperature regulation below the injury level. The combination of hypotension + bradycardia in a trauma patient with SCI is the hallmark of neurogenic shock. Priapism is another classic sign of cervical or high thoracic SCI. After ruling out hemorrhagic shock with appropriate workup (FAST exam, chest/pelvis X-rays, labs), the treatment of neurogenic shock is: (1) Judicious IV fluid resuscitation (excessive fluid can cause pulmonary edema), (2) Vasopressor therapy - norepinephrine is preferred because it provides both alpha-1 vasoconstriction (to restore SVR) and beta-1 stimulation (to address bradycardia). The MAP target is ≥85-90 mmHg for the first 7 days to optimize spinal cord perfusion. (3) Atropine or glycopyrrolate for symptomatic bradycardia. (4) Early neurosurgical consultation for potential surgical decompression and stabilization. Phenylephrine is avoided as sole agent because it can worsen bradycardia through baroreceptor-mediated reflex. Dopamine is an alternative. The key distinction from hemorrhagic shock in trauma is the bradycardia - hemorrhagic shock causes tachycardia as a compensatory response.",
    learningObjective: "Differentiate neurogenic shock from hemorrhagic shock in spinal cord injury and select norepinephrine for vasopressor support",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Spinal Cord Injuries",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Neurogenic shock = hypotension + BRADYCARDIA; hemorrhagic shock = hypotension + TACHYCARDIA",
    clinicalPearls: [
      "Neurogenic shock: hypotension + bradycardia + warm extremities",
      "Hemorrhagic shock: hypotension + tachycardia + cold extremities",
      "MAP target ≥85 mmHg for 7 days to optimize spinal cord perfusion",
      "Norepinephrine preferred: provides both vasoconstriction and chronotropy"
    ],
    safetyNote: "Always rule out hemorrhagic shock before attributing hypotension to neurogenic shock in trauma patients",
    distractorRationales: [
      "Neurogenic shock with norepinephrine for vasoconstriction and chronotropy",
      "Hemorrhagic shock would present with tachycardia, not bradycardia",
      "Cardiogenic shock would show JVD and pulmonary edema",
      "Sepsis is unlikely in acute trauma without infection source"
    ],
    lessonLink: "/emergency/lessons/spinal-cord-injuries"
  },
  {
    stem: "A 55-year-old male presents with sudden onset of the worst headache of his life. CT head shows diffuse subarachnoid hemorrhage. CT angiography identifies a 7 mm anterior communicating artery aneurysm. While in the ED, the patient becomes increasingly drowsy. What is the Hunt and Hess grade, and what medication must be started immediately?",
    options: [
      "Hunt and Hess Grade III (drowsy with mild focal deficit) - start nimodipine 60 mg PO/NG every 4 hours for 21 days",
      "Hunt and Hess Grade I (asymptomatic) - start aspirin for antiplatelet protection",
      "Hunt and Hess Grade V (comatose) - start mannitol for ICP reduction",
      "Hunt and Hess Grade II (moderate headache) - start IV dexamethasone for edema"
    ],
    correctAnswer: 0,
    rationaleLong: "The Hunt and Hess grading scale classifies the severity of subarachnoid hemorrhage (SAH) and correlates with surgical outcome: Grade I - asymptomatic or mild headache, Grade II - moderate to severe headache with nuchal rigidity but no neurological deficit other than cranial nerve palsy, Grade III - drowsiness, confusion, or mild focal deficit, Grade IV - stupor with moderate to severe hemiparesis, Grade V - deep coma with decerebrate posturing. This patient with a severe headache who is becoming increasingly drowsy (altered consciousness) without coma fits Grade III. Regardless of grade, ALL patients with confirmed aneurysmal SAH must be started on nimodipine 60 mg PO or via NG tube every 4 hours for 21 days. Nimodipine is a dihydropyridine calcium channel blocker with preferential cerebral vascular selectivity. Its primary benefit is NOT prevention of angiographic vasospasm (large vessel spasm), but rather prevention of delayed cerebral ischemia (DCI), which occurs in 20-30% of SAH patients between days 4-14 (peak at days 7-10). DCI is the leading cause of preventable morbidity and mortality after SAH. Nimodipine has been shown to improve neurological outcomes and reduce the incidence of DCI by approximately 34%. It is given orally rather than IV (IV nimodipine can cause significant hypotension). Aspirin is contraindicated before the aneurysm is secured as it increases rebleeding risk. Mannitol may be used for acute ICP elevation but is not the priority medication for SAH. Dexamethasone has no proven benefit in SAH.",
    learningObjective: "Grade SAH severity using Hunt and Hess scale and initiate nimodipine for delayed cerebral ischemia prevention",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Subarachnoid Hemorrhage",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Nimodipine prevents delayed cerebral ischemia, not vasospasm itself; give PO not IV to avoid hypotension",
    clinicalPearls: [
      "Hunt & Hess: I=asymptomatic, II=headache/rigidity, III=drowsy, IV=stupor, V=coma",
      "Nimodipine 60 mg PO q4h x 21 days for ALL aneurysmal SAH patients",
      "DCI peak incidence: days 7-10 post-SAH; nimodipine reduces DCI by 34%",
      "AComm aneurysm is the most common location for ruptured aneurysms"
    ],
    safetyNote: "Give nimodipine PO/NG only - IV administration causes severe hypotension compromising cerebral perfusion",
    distractorRationales: [
      "Grade III (drowsy) + nimodipine for DCI prevention is correct",
      "Grade I is asymptomatic; aspirin is contraindicated before aneurysm securing",
      "Grade V is comatose; this patient is drowsy, not comatose",
      "Dexamethasone has no proven benefit in subarachnoid hemorrhage"
    ],
    lessonLink: "/emergency/lessons/subarachnoid-hemorrhage"
  },
  {
    stem: "A 70-year-old male presents with acute onset vertigo, nausea, and gait ataxia. The HINTS exam shows: normal head impulse test (no corrective saccade), direction-changing nystagmus, and skew deviation present. What does this HINTS exam pattern indicate?",
    options: [
      "Central cause of vertigo (likely posterior circulation stroke) - emergent MRI and neurology consultation needed",
      "Benign paroxysmal positional vertigo (BPPV) - perform Epley maneuver",
      "Vestibular neuritis - treat with meclizine and corticosteroids",
      "Meniere's disease - treat with diuretics and low-salt diet"
    ],
    correctAnswer: 0,
    rationaleLong: "The HINTS exam (Head Impulse, Nystagmus, Test of Skew) is a bedside examination that differentiates central from peripheral causes of acute vestibular syndrome (continuous vertigo, nystagmus, nausea, and gait unsteadiness). The HINTS exam has been shown to be MORE sensitive than initial MRI (which can miss posterior fossa strokes in the first 24-48 hours) for detecting central causes. A DANGEROUS (central) HINTS pattern includes ANY of the following: (1) Normal head impulse test (HIT): A normal HIT (no corrective saccade when the head is rapidly turned) in a patient with acute vestibular syndrome is concerning because peripheral vestibular lesions SHOULD cause an abnormal HIT. A normal HIT suggests the vestibular nerve and peripheral apparatus are intact, and the problem is central. (2) Direction-changing nystagmus: In peripheral vertigo, nystagmus beats in one direction regardless of gaze direction. Direction-changing nystagmus (beats right on right gaze, beats left on left gaze) indicates a central lesion. (3) Skew deviation: Vertical misalignment of the eyes on alternating cover test is a sign of brainstem dysfunction and strongly suggests a central cause. If ANY one of the three components is central, the entire HINTS exam is considered positive for central pathology, and the patient requires emergent MRI with diffusion-weighted imaging and neurology consultation for suspected posterior circulation stroke. This patient has ALL THREE central findings, making the diagnosis virtually certain. BPPV is episodic (not continuous), vestibular neuritis would have an abnormal HIT, and Meniere's disease has associated hearing loss and is episodic.",
    learningObjective: "Apply the HINTS exam to differentiate central (stroke) from peripheral causes of acute vertigo",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Posterior Circulation Stroke",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "HINTS: Normal HIT + Direction-changing nystagmus + Skew deviation = CENTRAL (stroke until proven otherwise)",
    clinicalPearls: [
      "HINTS is more sensitive than initial MRI for posterior fossa stroke",
      "Normal HIT in acute vestibular syndrome is DANGEROUS - suggests central cause",
      "Direction-changing nystagmus = central; unidirectional = peripheral",
      "Any ONE central HINTS finding makes the entire exam positive for central pathology"
    ],
    safetyNote: "MRI can miss posterior fossa strokes in the first 24-48 hours - a concerning HINTS exam should override a negative MRI",
    distractorRationales: [
      "All three HINTS components indicate central pathology requiring stroke workup",
      "BPPV is episodic and positional, not continuous vertigo",
      "Vestibular neuritis would show abnormal HIT (corrective saccade present)",
      "Meniere's disease is episodic with hearing loss, not continuous vertigo"
    ],
    lessonLink: "/emergency/lessons/posterior-circulation-stroke"
  },
  {
    stem: "A 30-year-old female with known multiple sclerosis presents with acute bilateral leg weakness, a sensory level at T6, and urinary retention developing over 12 hours. MRI shows a longitudinally extensive transverse myelitis spanning T4-T8 with more than 3 vertebral segments involved. What is the first-line treatment?",
    options: [
      "IV methylprednisolone 1 gram daily for 3-5 days",
      "IV immunoglobulin (IVIG) 0.4 g/kg daily for 5 days",
      "Plasmapheresis (5-7 exchanges over 10-14 days)",
      "Oral prednisone 60 mg daily with gradual taper"
    ],
    correctAnswer: 0,
    rationaleLong: "Acute transverse myelitis in the setting of multiple sclerosis (or as an isolated demyelinating event) requires urgent treatment with high-dose IV corticosteroids. IV methylprednisolone 1 gram daily for 3-5 days is the established first-line treatment. The mechanism of benefit includes: (1) reduction of inflammatory edema within the spinal cord, (2) decreased immune cell migration across the blood-brain barrier, (3) reduction of demyelination-associated inflammation, and (4) stabilization of the blood-brain barrier. The urgency of treatment is critical because prolonged spinal cord inflammation leads to irreversible axonal damage. Earlier treatment initiation is associated with better neurological recovery. The nurse should administer the methylprednisolone as a slow IV infusion over 1 hour, monitor for common side effects (hyperglycemia, insomnia, GI upset, metallic taste, mood changes), and check blood glucose regularly. The longitudinally extensive transverse myelitis (LETM) spanning ≥3 vertebral segments is noteworthy because it raises suspicion for neuromyelitis optica spectrum disorder (NMOSD/Devic's disease) in addition to MS. NMOSD-associated myelitis is characteristically LETM, while MS-associated myelitis typically involves shorter segments (<2 vertebral bodies). Aquaporin-4 (AQP4) antibodies should be sent to evaluate for NMOSD, as this changes long-term treatment strategy. If the patient fails to improve after 3-5 days of IV steroids, plasmapheresis is the second-line rescue therapy, with evidence showing benefit in steroid-refractory attacks. IVIG is an alternative but has less evidence for acute MS/NMOSD attacks. Oral prednisone at moderate doses is insufficient for acute spinal cord inflammation.",
    learningObjective: "Initiate high-dose IV methylprednisolone as first-line treatment for acute transverse myelitis",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Demyelinating Emergencies",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "LETM ≥3 segments suggests NMOSD over MS - send AQP4 antibodies; both need IV steroids acutely",
    clinicalPearls: [
      "IV methylprednisolone 1 g/day x 3-5 days is first-line for acute myelitis",
      "LETM (≥3 segments) raises suspicion for NMOSD vs MS",
      "Plasmapheresis is rescue therapy if steroids fail",
      "Earlier treatment = better neurological recovery"
    ],
    safetyNote: "Monitor blood glucose closely during high-dose steroids - can cause significant hyperglycemia requiring insulin",
    distractorRationales: [
      "High-dose IV methylprednisolone is the established first-line treatment",
      "IVIG is an alternative but has less evidence for acute demyelinating myelitis",
      "Plasmapheresis is second-line for steroid-refractory cases",
      "Oral prednisone at moderate doses is insufficient for acute spinal cord inflammation"
    ],
    lessonLink: "/emergency/lessons/demyelinating-emergencies"
  },
  {
    stem: "A 65-year-old male presents with acute confusion, fever 39.5°C, and new-onset seizures. LP shows: WBC 120 cells/μL (predominantly lymphocytes), RBC 150 cells/μL, protein 85 mg/dL, glucose 55 mg/dL (serum glucose 100 mg/dL). MRI shows temporal lobe hyperintensity. What is the most likely diagnosis and empiric treatment?",
    options: [
      "Herpes simplex encephalitis (HSE) - IV acyclovir 10 mg/kg every 8 hours",
      "Bacterial meningitis - IV ceftriaxone 2 g and vancomycin",
      "Fungal meningitis - IV amphotericin B",
      "Autoimmune encephalitis - IV methylprednisolone 1 gram"
    ],
    correctAnswer: 0,
    rationaleLong: "This presentation is classic for herpes simplex encephalitis (HSE), the most common sporadic fatal encephalitis. The constellation of findings is highly characteristic: (1) Acute confusion with fever and new-onset seizures (encephalitis triad), (2) CSF showing lymphocytic pleocytosis (WBC 120 with lymphocyte predominance - typical of viral infections), RBCs in CSF (reflecting the hemorrhagic necrotizing nature of HSE), mildly elevated protein, and near-normal glucose (viral infections typically have normal or mildly decreased glucose), (3) MRI showing temporal lobe hyperintensity (HSV-1 has a strong predilection for the temporal and frontal lobes). The treatment is IV acyclovir 10 mg/kg every 8 hours for 14-21 days. Acyclovir must be started EMPIRICALLY immediately upon clinical suspicion, before confirmatory testing (CSF HSV PCR) returns, because: untreated HSE has a mortality rate of 70%, and treatment within 48 hours of symptom onset reduces mortality to 20-30% and significantly improves neurological outcomes. HSV PCR from CSF is the gold standard diagnostic test with sensitivity of 96-98% and specificity of 95-99%, but results may take 24-48 hours. The emergency nurse should ensure adequate IV hydration during acyclovir infusion (acyclovir crystallizes in renal tubules causing nephrotoxicity if the patient is dehydrated) and monitor renal function. Bacterial meningitis would show neutrophilic pleocytosis with very low glucose. Fungal meningitis has a more indolent course. Autoimmune encephalitis typically presents without fever.",
    learningObjective: "Recognize herpes simplex encephalitis and initiate empiric IV acyclovir immediately without waiting for confirmatory testing",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "CNS Infections",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Start acyclovir EMPIRICALLY for suspected HSE - do NOT wait for HSV PCR results (70% mortality untreated)",
    clinicalPearls: [
      "HSE triad: fever, confusion, seizures with temporal lobe predilection",
      "CSF: lymphocytic pleocytosis + RBCs + temporal MRI changes = HSE until proven otherwise",
      "Untreated mortality 70%; with acyclovir 20-30%",
      "Aggressive IV hydration prevents acyclovir nephrotoxicity"
    ],
    safetyNote: "Ensure adequate hydration during acyclovir infusion - acyclovir crystalluria causes acute kidney injury in dehydrated patients",
    distractorRationales: [
      "HSE: lymphocytic pleocytosis + RBCs + temporal lobe involvement = acyclovir",
      "Bacterial meningitis has neutrophilic pleocytosis and very low glucose",
      "Fungal meningitis has an indolent course with very low glucose",
      "Autoimmune encephalitis typically presents without fever"
    ],
    lessonLink: "/emergency/lessons/cns-infections"
  },
  {
    stem: "A 45-year-old female presents with thunderclap headache and CT shows subarachnoid hemorrhage. CTA is negative for aneurysm. Catheter angiography is also negative. What is the most likely diagnosis?",
    options: [
      "Perimesencephalic non-aneurysmal SAH - a benign variant with excellent prognosis",
      "Missed aneurysm requiring repeat catheter angiography in 2 weeks",
      "Arteriovenous malformation bleed requiring surgical resection",
      "Cerebral venous sinus thrombosis mimicking SAH"
    ],
    correctAnswer: 0,
    rationaleLong: "Perimesencephalic non-aneurysmal SAH accounts for approximately 10-15% of all subarachnoid hemorrhages and is characterized by: (1) Hemorrhage pattern: blood confined to the perimesencephalic cisterns (prepontine and interpeduncular cisterns) anterior to the brainstem, WITHOUT extension into the Sylvian fissures, interhemispheric fissure, or lateral to the brain surface, (2) Negative angiography: both CTA and catheter (digital subtraction) angiography are negative for aneurysm, AVM, or other vascular malformation, (3) EXCELLENT prognosis: unlike aneurysmal SAH, perimesencephalic SAH has a near-zero risk of rebleeding, no risk of delayed vasospasm or delayed cerebral ischemia, and full neurological recovery in virtually all patients. The presumed etiology is rupture of a small perimesencephalic vein, hence the self-limited, benign course. The importance of correctly identifying this entity is that these patients do NOT require the same intensive monitoring, nimodipine therapy, or prolonged ICU stays that aneurysmal SAH patients need. However, the diagnosis of perimesencephalic SAH requires: (1) Classic perimesencephalic hemorrhage pattern on CT, AND (2) Negative CTA, AND (3) Negative catheter angiography. If the hemorrhage pattern is NOT classic perimesencephalic (e.g., extends into Sylvian fissures or convexity), repeat catheter angiography in 1-2 weeks should be performed to evaluate for a small aneurysm that may have been obscured by vasospasm or clot during the initial study. While repeat angiography is sometimes performed even in classic perimesencephalic pattern, the yield is extremely low (<1%).",
    learningObjective: "Identify perimesencephalic non-aneurysmal SAH as a benign variant with excellent prognosis",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Subarachnoid Hemorrhage",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Perimesencephalic SAH: blood confined to cisterns + negative angiography = benign, near-zero rebleed risk",
    clinicalPearls: [
      "Perimesencephalic SAH accounts for 10-15% of all SAH",
      "Blood confined to perimesencephalic cisterns only",
      "No risk of vasospasm, DCI, or rebleeding",
      "Requires classic hemorrhage pattern AND negative angiography for diagnosis"
    ],
    safetyNote: "If hemorrhage extends beyond perimesencephalic cisterns, it's NOT perimesencephalic SAH - treat as aneurysmal until proven otherwise",
    distractorRationales: [
      "Classic perimesencephalic pattern with negative angiography is a benign variant",
      "Repeat angiography is warranted only if hemorrhage pattern is NOT classic perimesencephalic",
      "AVM would typically be visible on CTA or catheter angiography",
      "Cerebral venous thrombosis has a different hemorrhage pattern and CT findings"
    ],
    lessonLink: "/emergency/lessons/subarachnoid-hemorrhage"
  },
  {
    stem: "A 60-year-old male presents with sudden onset of diplopia, ptosis of the left eye, and the left pupil is fixed and dilated at 6 mm. The eye is deviated down and out. He also reports a new severe headache. What is the emergency nurse's primary concern?",
    options: [
      "Posterior communicating artery aneurysm compressing cranial nerve III - emergent CTA/MRA needed",
      "Diabetic cranial nerve III palsy - reassurance and outpatient follow-up",
      "Myasthenia gravis exacerbation - edrophonium test indicated",
      "Cavernous sinus thrombosis - start anticoagulation"
    ],
    correctAnswer: 0,
    rationaleLong: "An acute, painful third cranial nerve (oculomotor) palsy WITH pupil involvement (fixed and dilated pupil) is a neurosurgical emergency until proven otherwise. The most concerning cause is a posterior communicating artery (PComm) aneurysm compressing the third nerve as it exits the brainstem and courses along the base of the skull. The anatomy is critical: the parasympathetic pupillary fibers travel on the OUTSIDE (peripheral) of the oculomotor nerve and are the first fibers to be compressed by an expanding aneurysm, causing pupil dilation (mydriasis) and loss of the light reflex. The somatic motor fibers in the nerve core are compressed secondarily, causing ptosis (levator palpebrae weakness) and the characteristic down-and-out eye position (from unopposed lateral rectus [CN VI] and superior oblique [CN IV] action). The headache suggests possible aneurysm expansion or sentinel leak (small SAH preceding full rupture). This presentation requires EMERGENT vascular imaging: CT angiography (CTA) or MR angiography (MRA) to identify the aneurysm, followed by catheter angiography if CTA is negative but clinical suspicion remains high. If an aneurysm is confirmed, neurosurgical consultation for clipping or endovascular coiling is urgent. The key clinical pearl that differentiates compressive from ischemic (diabetic) third nerve palsy is PUPIL INVOLVEMENT: compressive lesions (aneurysm) affect the peripheral pupillary fibers first → PUPIL IS DILATED. Diabetic/ischemic third nerve palsy affects the core motor fibers → PUPIL IS SPARED (normal reactive pupil). A pupil-sparing third nerve palsy in a diabetic patient can be managed as an outpatient, but pupil-INVOLVING third nerve palsy requires emergent vascular imaging regardless of diabetes history.",
    learningObjective: "Differentiate compressive from ischemic third nerve palsy based on pupil involvement and initiate emergent vascular imaging",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Cranial Nerve Emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "CN III palsy + dilated pupil = compressive (aneurysm) = emergent CTA; pupil-sparing = likely diabetic/ischemic",
    clinicalPearls: [
      "Pupil-INVOLVING CN III palsy = emergent vascular imaging for aneurysm",
      "Pupil-SPARING CN III palsy = likely ischemic (diabetic), outpatient workup",
      "PComm aneurysm is the most common cause of compressive CN III palsy",
      "Parasympathetic fibers are peripheral on CN III - compressed first by aneurysm"
    ],
    safetyNote: "PComm aneurysm can rupture causing fatal SAH - emergent imaging and neurosurgical consultation are mandatory",
    distractorRationales: [
      "Pupil-involving CN III palsy with headache = PComm aneurysm until proven otherwise",
      "Diabetic CN III palsy is pupil-SPARING - this patient has pupil involvement",
      "Myasthenia causes fatigable ptosis but does NOT cause fixed dilated pupil",
      "Cavernous sinus thrombosis typically involves multiple cranial nerves (III, IV, V, VI)"
    ],
    lessonLink: "/emergency/lessons/cranial-nerve-emergencies"
  },
  {
    stem: "A 72-year-old female with atrial fibrillation presents with acute left-sided neglect, right gaze deviation, and left homonymous hemianopia. Her NIHSS is 20. CT perfusion shows a large area of completed infarct (core >70 mL) with minimal penumbra. She is 4 hours from symptom onset. Is she a candidate for mechanical thrombectomy?",
    options: [
      "No - core infarct >70 mL exceeds the criteria for mechanical thrombectomy even within the treatment window",
      "Yes - any stroke within 6 hours should receive thrombectomy regardless of perfusion findings",
      "Yes - NIHSS >15 qualifies for thrombectomy independent of imaging",
      "No - right gaze deviation is a contraindication to thrombectomy"
    ],
    correctAnswer: 0,
    rationaleLong: "Despite being within the 6-hour treatment window and having a severe stroke (NIHSS 20), this patient is NOT a candidate for mechanical thrombectomy because her core infarct volume exceeds 70 mL. The current AHA/ASA guidelines for thrombectomy include strict imaging criteria to select patients who will benefit: the core infarct (irreversibly damaged tissue) should be <70 mL, with a mismatch ratio >1.8 and mismatch volume >15 mL (DEFUSE 3 criteria). When the core infarct is large (>70 mL), the majority of brain tissue in the affected territory has already undergone irreversible injury, and restoring blood flow through thrombectomy is unlikely to provide clinical benefit but carries significant risks including hemorrhagic transformation of the large infarct, reperfusion injury, and malignant cerebral edema. The SELECT2 trial (2023) and RESCUE-Japan LIMIT trials explored thrombectomy in large core infarcts with mixed results, and current practice generally maintains the <70 mL threshold. For this patient, management would include: monitoring for malignant cerebral edema (which can develop 24-72 hours post-stroke and may require decompressive craniectomy), standard post-stroke care (aspirin after 24 hours, statin therapy, anticoagulation for AF once hemorrhagic transformation is ruled out), and rehabilitation planning. The NIHSS score alone does not determine thrombectomy eligibility - it must be combined with favorable imaging. Gaze deviation is a component of the NIHSS score but is not a contraindication to thrombectomy.",
    learningObjective: "Apply imaging criteria (core infarct <70 mL) to determine thrombectomy eligibility regardless of time window",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Stroke Management",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Being within the time window does NOT automatically qualify for thrombectomy - imaging criteria must also be met",
    clinicalPearls: [
      "Thrombectomy imaging criteria: core <70 mL, mismatch ratio >1.8, mismatch volume >15 mL",
      "Large core infarcts risk hemorrhagic transformation and malignant edema with reperfusion",
      "NIHSS alone does not determine thrombectomy eligibility",
      "Monitor for malignant cerebral edema 24-72 hours post-large stroke"
    ],
    safetyNote: "Large completed infarcts with reperfusion can develop fatal hemorrhagic transformation and malignant edema",
    distractorRationales: [
      "Core >70 mL exceeds thrombectomy criteria regardless of time window",
      "Time window alone does not determine eligibility - imaging criteria are essential",
      "NIHSS is one factor but must be combined with favorable imaging",
      "Gaze deviation is a stroke symptom scored on NIHSS, not a contraindication"
    ],
    lessonLink: "/emergency/lessons/stroke-management"
  },
  {
    stem: "A 55-year-old male with alcoholism presents with confusion, horizontal nystagmus, ophthalmoplegia, and gait ataxia. What is the diagnosis, and what must be administered BEFORE any glucose-containing fluids?",
    options: [
      "Wernicke encephalopathy - IV thiamine (vitamin B1) 500 mg must be given before glucose",
      "Hepatic encephalopathy - oral lactulose 30 mL every 2 hours",
      "Alcohol withdrawal seizures - IV lorazepam 4 mg",
      "Korsakoff psychosis - oral thiamine 100 mg daily"
    ],
    correctAnswer: 0,
    rationaleLong: "This presentation is classic Wernicke encephalopathy, characterized by the triad of: (1) Confusion (encephalopathy), (2) Oculomotor dysfunction (nystagmus and ophthalmoplegia), and (3) Gait ataxia. Wernicke encephalopathy is caused by acute thiamine (vitamin B1) deficiency, most commonly seen in alcoholism, malnutrition, hyperemesis gravidarum, or bariatric surgery patients. The CRITICAL nursing consideration is that IV thiamine MUST be administered BEFORE any glucose-containing fluids. This is because glucose metabolism consumes thiamine as a cofactor (thiamine pyrophosphate is essential for the pyruvate dehydrogenase complex and the Krebs cycle). Administering glucose to a thiamine-depleted patient accelerates thiamine consumption, worsening or precipitating Wernicke encephalopathy and potentially causing irreversible neurological damage. The recommended treatment is high-dose IV thiamine: 500 mg IV three times daily for 2-3 days, then 250 mg IV daily for 3-5 days. The traditional dose of 100 mg IV was found to be insufficient for adequate CNS thiamine repletion. Only after thiamine has been administered should glucose-containing fluids be given. If untreated, Wernicke encephalopathy progresses to Korsakoff syndrome (irreversible anterograde amnesia with confabulation), making this a true emergency. Hepatic encephalopathy presents with asterixis and elevated ammonia. Alcohol withdrawal seizures typically occur 12-48 hours after last drink and present differently. Korsakoff psychosis is the chronic, irreversible sequela of untreated Wernicke - oral thiamine at that stage is inadequate.",
    learningObjective: "Administer IV thiamine BEFORE glucose in suspected Wernicke encephalopathy to prevent irreversible neurological damage",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Metabolic Neurological Emergencies",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "ALWAYS give thiamine BEFORE glucose - glucose without thiamine worsens Wernicke and can cause permanent brain damage",
    clinicalPearls: [
      "Wernicke triad: confusion, oculomotor dysfunction, ataxia",
      "High-dose thiamine: 500 mg IV TID x 2-3 days (100 mg is insufficient)",
      "Glucose before thiamine precipitates/worsens Wernicke encephalopathy",
      "Untreated Wernicke → irreversible Korsakoff syndrome (amnesia + confabulation)"
    ],
    safetyNote: "NEVER give glucose-containing fluids to a malnourished or alcoholic patient without first administering IV thiamine",
    distractorRationales: [
      "Wernicke encephalopathy with IV thiamine before glucose is correct",
      "Hepatic encephalopathy presents with asterixis and elevated ammonia",
      "Alcohol withdrawal seizures have a different presentation and timing",
      "Korsakoff is the irreversible sequela - oral thiamine is inadequate at that stage"
    ],
    lessonLink: "/emergency/lessons/metabolic-neurological-emergencies"
  }
];
