import { EmergencyNursingQuestion } from "./types";

export const neuroEmergency9Questions: EmergencyNursingQuestion[] = [
  {
    stem: "A 70-year-old male on warfarin (INR 3.8) presents after a ground-level fall with progressive left-sided weakness over 4 hours. CT head shows a right-sided acute subdural hematoma with 8 mm thickness and 5 mm midline shift. What is the priority pharmacological intervention before neurosurgical evacuation?",
    options: [
      "Administer IV vitamin K 10 mg alone and recheck INR in 6 hours before surgery",
      "Administer 4-factor prothrombin complex concentrate (4F-PCC) with IV vitamin K 10 mg for immediate INR reversal",
      "Transfuse 4 units of fresh frozen plasma over 4 hours to normalize coagulation",
      "Hold warfarin and allow INR to normalize naturally over 48-72 hours before surgery"
    ],
    correctAnswer: 1,
    rationaleLong: "In anticoagulant-associated intracranial hemorrhage, rapid reversal of coagulopathy is critical to prevent hematoma expansion, which is the primary driver of morbidity and mortality. For warfarin-associated ICH, the current AHA/ASA guidelines recommend 4-factor prothrombin complex concentrate (4F-PCC) as the first-line reversal agent because it provides immediate and complete reversal of warfarin's anticoagulant effect. 4F-PCC contains all four vitamin K-dependent clotting factors (II, VII, IX, X) in concentrated form, allowing rapid INR correction (typically within 15-30 minutes) with a small volume infusion (typically 25-50 IU/kg based on INR). IV vitamin K 10 mg should be administered concurrently because 4F-PCC provides only temporary factor replacement (12-24 hours), while vitamin K enables endogenous production of clotting factors over 12-24 hours. Together, they provide both immediate and sustained reversal. Fresh frozen plasma (FFP) is inferior to 4F-PCC for several reasons: it requires ABO typing, thawing, and large volume infusion (typically 10-15 mL/kg, or 3-5 units), takes 4-6 hours to administer, has incomplete INR correction, and carries risks of volume overload, transfusion reactions, and TRALI. Vitamin K alone takes 12-24 hours to achieve meaningful INR reduction, which is far too slow for life-threatening ICH. Allowing natural normalization over 48-72 hours risks fatal hematoma expansion. The emergency nurse should prepare for rapid 4F-PCC infusion, draw baseline labs including INR, and arrange emergent neurosurgical consultation simultaneously. Target INR is less than 1.4 before surgical evacuation.",
    learningObjective: "Apply evidence-based warfarin reversal using 4F-PCC and vitamin K for anticoagulant-associated intracranial hemorrhage",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Intracranial Hemorrhage Management",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "FFP is too slow and volume-heavy for ICH reversal; 4F-PCC is the standard of care for warfarin-associated ICH",
    clinicalPearls: [
      "4F-PCC reverses warfarin INR within 15-30 minutes vs 4-6 hours for FFP",
      "Always give IV vitamin K with 4F-PCC for sustained reversal",
      "Target INR <1.4 before neurosurgical intervention",
      "Hematoma expansion occurs in 30-40% of anticoagulant-associated ICH"
    ],
    safetyNote: "Do NOT delay reversal for repeat imaging - administer 4F-PCC as soon as anticoagulant-associated ICH is confirmed on CT",
    distractorRationales: [
      "Vitamin K alone takes 12-24 hours and is too slow for acute ICH",
      "4F-PCC with vitamin K provides both immediate and sustained reversal",
      "FFP requires large volumes, is slow, and provides incomplete reversal",
      "Natural normalization risks fatal hematoma expansion"
    ],
    lessonLink: "/emergency/lessons/intracranial-hemorrhage"
  },
  {
    stem: "A 28-year-old female presents with sudden severe headache, neck stiffness, and photophobia. CT head is negative for hemorrhage. Lumbar puncture reveals an opening pressure of 22 cm H2O, 12,000 RBCs in tube 1 and 11,500 RBCs in tube 4, with xanthochromia present. What do these CSF findings indicate?",
    options: [
      "Traumatic lumbar puncture causing artifactual blood in CSF, which can be safely discharged",
      "Subarachnoid hemorrhage, as demonstrated by non-clearing RBCs and xanthochromia",
      "Bacterial meningitis with hemorrhagic component requiring broad-spectrum antibiotics",
      "Idiopathic intracranial hypertension with incidental traumatic tap"
    ],
    correctAnswer: 1,
    rationaleLong: "This presentation is classic for subarachnoid hemorrhage (SAH) with CT-negative, LP-positive findings. Approximately 2-5% of SAH cases are missed on initial CT, particularly when imaging is performed more than 6-12 hours after headache onset, as CT sensitivity decreases from ~98% at 6 hours to ~93% at 12 hours and ~50% at 1 week. The critical CSF findings supporting SAH include: (1) Non-clearing RBCs between tubes: In a traumatic tap, RBC counts decrease significantly from tube 1 to tube 4 (typically >25-50% decrease). In this case, the RBC count remains essentially unchanged (12,000 to 11,500), indicating true subarachnoid blood rather than procedural contamination. (2) Xanthochromia: This yellow discoloration of CSF supernatant results from the breakdown of hemoglobin into oxyhemoglobin and bilirubin. Xanthochromia takes approximately 2-12 hours to develop after SAH and persists for up to 2-4 weeks. Its presence strongly supports true SAH rather than traumatic tap, as procedural blood has not had time to undergo hemolysis. (3) Elevated opening pressure: While not specific, elevated OP is consistent with SAH. The next step is emergent CT angiography (CTA) to identify the source of hemorrhage, most commonly a ruptured cerebral aneurysm (75-80% of non-traumatic SAH). If CTA is negative, digital subtraction angiography (DSA) is the gold standard. The patient should be admitted to ICU for monitoring of vasospasm, rebleeding, and hydrocephalus. The emergency nurse should maintain a quiet, calm environment, administer analgesics (avoiding NSAIDs), and implement aneurysm precautions including strict blood pressure control (typically SBP <160 mmHg), bed rest with head of bed elevated 30 degrees, stool softeners, and seizure precautions.",
    learningObjective: "Differentiate traumatic lumbar puncture from true subarachnoid hemorrhage using CSF analysis including RBC clearing and xanthochromia",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Subarachnoid Hemorrhage",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Non-clearing RBCs (tube 1 to tube 4) + xanthochromia = SAH, not traumatic tap; traumatic taps show significant RBC clearing between tubes",
    clinicalPearls: [
      "Traumatic tap: RBCs decrease >25-50% from tube 1 to tube 4",
      "Xanthochromia develops 2-12 hours after SAH and persists weeks",
      "CT sensitivity for SAH decreases after 6-12 hours from onset",
      "CTA is the next step after LP-confirmed SAH"
    ],
    safetyNote: "Never discharge a patient with thunderclap headache based on negative CT alone if LP shows non-clearing RBCs and xanthochromia",
    distractorRationales: [
      "Traumatic tap would show significant RBC clearing between tubes",
      "Non-clearing RBCs with xanthochromia confirms SAH",
      "No CSF findings suggest bacterial infection",
      "IIH does not present with RBCs or xanthochromia in CSF"
    ],
    lessonLink: "/emergency/lessons/subarachnoid-hemorrhage"
  },
  {
    stem: "A 45-year-old male is brought to the ED after a witnessed generalized tonic-clonic seizure that has been ongoing for 12 minutes. He received lorazepam 4 mg IV by EMS 5 minutes ago without seizure termination. What is the appropriate next medication?",
    options: [
      "Repeat lorazepam 4 mg IV and observe for another 5 minutes",
      "IV fosphenytoin 20 mg PE/kg at 150 mg PE/minute or IV levetiracetam 60 mg/kg",
      "IV propofol infusion for immediate burst suppression",
      "IV phenobarbital 20 mg/kg as first-line second agent"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient is in established status epilepticus (SE), defined as a seizure lasting more than 5 minutes or recurrent seizures without return to baseline. The Neurocritical Care Society and AES guidelines outline a stepwise approach. The first-line treatment is a benzodiazepine (lorazepam 0.1 mg/kg IV, maximum 4 mg, repeated once if needed). This patient has already received an adequate first dose of lorazepam without effect. While a repeat dose of lorazepam is sometimes given, the patient has already had 5 minutes without response, and continued benzodiazepine administration without escalation risks prolonging SE and increasing morbidity. The second-line treatment for benzodiazepine-refractory SE includes IV fosphenytoin (20 mg PE/kg at a maximum rate of 150 mg PE/minute), IV levetiracetam (60 mg/kg, maximum 4500 mg, over 15 minutes), or IV valproate (40 mg/kg, maximum 3000 mg, over 10 minutes). The ESETT trial demonstrated equivalent efficacy among these three agents for benzodiazepine-refractory SE, with approximately 45-50% seizure cessation rates. Fosphenytoin is preferred over phenytoin because it can be administered faster, causes less tissue injury, and does not require a dedicated IV line. Levetiracetam has the advantage of fewer drug interactions and hemodynamic effects. Propofol and other anesthetic agents (midazolam infusion, pentobarbital) are reserved for refractory SE (failure of two appropriate medication trials) and require intubation and continuous EEG monitoring. Phenobarbital was historically used as a second-line agent but has largely been replaced by the three agents above due to its respiratory depression and prolonged sedation. The emergency nurse should prepare both the second-line medication and intubation equipment in case of progression to refractory SE.",
    learningObjective: "Apply the stepwise treatment algorithm for status epilepticus including second-line agents after benzodiazepine failure",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Status Epilepticus",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Do not keep repeating benzodiazepines without escalation — move to second-line agents (fosphenytoin, levetiracetam, or valproate) after adequate benzodiazepine dosing",
    clinicalPearls: [
      "SE definition: seizure >5 minutes or recurrent seizures without baseline return",
      "ESETT trial: fosphenytoin, levetiracetam, and valproate are equally effective as second-line",
      "Fosphenytoin preferred over phenytoin: faster infusion, less tissue injury",
      "Prepare intubation equipment when administering second-line agents"
    ],
    safetyNote: "Monitor cardiac rhythm and blood pressure during fosphenytoin infusion — can cause hypotension and arrhythmias",
    distractorRationales: [
      "Repeating lorazepam without escalation delays definitive treatment",
      "Fosphenytoin or levetiracetam are evidence-based second-line agents",
      "Propofol is reserved for refractory SE requiring intubation",
      "Phenobarbital is no longer preferred as first second-line agent"
    ],
    lessonLink: "/emergency/lessons/status-epilepticus"
  },
  {
    stem: "A 55-year-old female with a history of migraine presents with the worst headache of her life, nausea, and a right CN III palsy with pupil dilation. CT head is pending. What is the most likely diagnosis requiring emergent intervention?",
    options: [
      "Complicated migraine with aura causing temporary cranial nerve dysfunction",
      "Posterior communicating artery aneurysm with impending rupture",
      "Diabetic cranial neuropathy (ischemic third nerve palsy)",
      "Cavernous sinus thrombosis with third nerve compression"
    ],
    correctAnswer: 1,
    rationaleLong: "A painful third cranial nerve palsy with pupil involvement (mydriasis) is a neurosurgical emergency until proven otherwise, as it strongly suggests compression of CN III by an expanding posterior communicating artery (PComA) aneurysm. The posterior communicating artery runs adjacent to CN III, and an enlarging or leaking aneurysm at this location compresses the nerve, affecting the parasympathetic fibers that run on the outer surface of the nerve. These parasympathetic fibers control pupillary constriction, so their compression causes pupil dilation (mydriasis) — the hallmark of a compressive CN III palsy. The combination of thunderclap headache (worst headache of life) with a pupil-involving CN III palsy carries an extremely high probability of PComA aneurysm, potentially with sentinel hemorrhage (warning leak). This requires emergent CT/CTA, and if negative, LP and conventional angiography. Neurosurgical consultation should be obtained immediately regardless of CT results. A key clinical distinction is between compressive and ischemic CN III palsies: compressive lesions (aneurysm) typically involve the pupil because parasympathetic fibers are on the nerve surface, while ischemic lesions (diabetic mononeuropathy) typically spare the pupil because ischemia affects the central nerve fibers. However, this rule is not absolute, and any CN III palsy with headache must be evaluated for aneurysm. Migraine can cause transient cranial nerve palsies but would not present as the worst headache of life with new pupil dilation. Cavernous sinus thrombosis typically presents with proptosis, chemosis, and multiple cranial nerve palsies (III, IV, V1, V2, VI). The emergency nurse should establish large-bore IV access, prepare for potential rapid deterioration, and implement aneurysm precautions.",
    learningObjective: "Recognize pupil-involving CN III palsy as a sign of posterior communicating artery aneurysm requiring emergent evaluation",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Cerebrovascular Emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Pupil-involving CN III palsy = compressive (aneurysm) until proven otherwise; pupil-sparing = ischemic (diabetic) — but always image if headache is present",
    clinicalPearls: [
      "PComA aneurysm: painful CN III palsy WITH pupil involvement",
      "Diabetic CN III palsy: painless or mild pain, pupil typically SPARED",
      "Parasympathetic fibers run on CN III surface — compressed first by external lesions",
      "Sentinel headache may precede aneurysm rupture by hours to weeks"
    ],
    safetyNote: "Any new CN III palsy with pupil involvement must have emergent CTA — do not attribute to migraine without imaging",
    distractorRationales: [
      "Migraine does not cause pupil-involving CN III palsy with thunderclap headache",
      "PComA aneurysm is the most dangerous and likely diagnosis",
      "Diabetic CN III palsy typically spares the pupil",
      "Cavernous sinus thrombosis presents with proptosis and multiple cranial neuropathies"
    ],
    lessonLink: "/emergency/lessons/cerebrovascular-emergencies"
  },
  {
    stem: "A 62-year-old male with atrial fibrillation presents 90 minutes after acute onset of right arm weakness and expressive aphasia. NIHSS is 14. CT head shows no hemorrhage. CT perfusion reveals a large ischemic penumbra with small core infarct in the left MCA territory. A large vessel occlusion of the left M1 segment is confirmed on CTA. What is the optimal treatment strategy?",
    options: [
      "IV alteplase 0.9 mg/kg alone, as the patient is within the 4.5-hour window",
      "Direct mechanical thrombectomy without IV alteplase to avoid bleeding risk",
      "IV alteplase followed by mechanical thrombectomy (bridging therapy)",
      "IV alteplase followed by IV heparin infusion for secondary prevention"
    ],
    correctAnswer: 2,
    rationaleLong: "The optimal treatment for this patient with acute ischemic stroke from large vessel occlusion (LVO) within the IV thrombolysis window is bridging therapy: IV alteplase administered as soon as possible, followed by mechanical thrombectomy. This approach is supported by multiple landmark trials (MR CLEAN, ESCAPE, EXTEND-IA, SWIFT PRIME, REVASCAT) that demonstrated dramatic benefit of endovascular thrombectomy for LVO strokes. The rationale for bridging therapy is that IV alteplase begins working immediately to dissolve the clot while the interventional team prepares for thrombectomy, and in some cases, IV alteplase may partially or completely recanalize the vessel before thrombectomy begins. However, IV alteplase alone has limited efficacy for large vessel occlusions, with recanalization rates of only 10-30% for M1 segment occlusions. Mechanical thrombectomy achieves recanalization in 70-90% of cases and is the definitive treatment. AHA/ASA guidelines recommend that IV alteplase should NOT be withheld or delayed in eligible patients while awaiting thrombectomy. The DIRECT-MT and MR CLEAN-NO IV trials have explored direct thrombectomy without IV alteplase, and while results show non-inferiority in some settings, the current standard of care remains bridging therapy when the patient is alteplase-eligible. The emergency nurse's role includes rapid alteplase preparation and administration (0.9 mg/kg, 10% as bolus, remainder over 60 minutes), neurological monitoring, blood pressure management (maintain BP <180/105 after alteplase), and preparation for transfer to the neurointerventional suite. IV heparin after alteplase is contraindicated due to high bleeding risk. The nurse should continue the alteplase infusion during transfer to the interventional suite.",
    learningObjective: "Understand bridging therapy (IV alteplase plus mechanical thrombectomy) as the standard of care for large vessel occlusion stroke within the thrombolysis window",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Stroke Management",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "IV alteplase alone is insufficient for LVO — bridging therapy (alteplase + thrombectomy) is the standard; do not delay alteplase while awaiting thrombectomy",
    clinicalPearls: [
      "LVO recanalization with IV alteplase alone: only 10-30%",
      "Mechanical thrombectomy achieves 70-90% recanalization for LVO",
      "Continue alteplase infusion during transfer to interventional suite",
      "Five landmark trials (MR CLEAN, ESCAPE, EXTEND-IA, SWIFT PRIME, REVASCAT) established thrombectomy benefit"
    ],
    safetyNote: "Do NOT delay IV alteplase to wait for thrombectomy team — start alteplase immediately if patient is eligible",
    distractorRationales: [
      "IV alteplase alone has poor recanalization rates for LVO",
      "Skipping alteplase is not standard when the patient is eligible",
      "Bridging therapy is the current guideline-recommended approach",
      "IV heparin after alteplase is contraindicated due to hemorrhage risk"
    ],
    lessonLink: "/emergency/lessons/stroke-management"
  },
  {
    stem: "A 30-year-old male presents after a high-speed motorcycle collision. GCS is 7 (E2V1M4). CT head shows diffuse cerebral edema with loss of gray-white matter differentiation. ICP monitor reads 32 mmHg. MAP is 85 mmHg. What is the calculated cerebral perfusion pressure and is it adequate?",
    options: [
      "CPP is 53 mmHg, which is below the minimum target of 60 mmHg and requires intervention",
      "CPP is 117 mmHg, which is above the maximum recommended target",
      "CPP is 53 mmHg, which is adequate as the target is >50 mmHg",
      "CPP cannot be calculated without knowing the central venous pressure"
    ],
    correctAnswer: 0,
    rationaleLong: "Cerebral perfusion pressure (CPP) is calculated as: CPP = MAP - ICP. In this case: CPP = 85 - 32 = 53 mmHg. The Brain Trauma Foundation (BTF) guidelines recommend maintaining CPP between 60-70 mmHg for optimal outcomes in severe traumatic brain injury (TBI). A CPP of 53 mmHg is below the minimum target of 60 mmHg, indicating inadequate cerebral perfusion that requires immediate intervention. There are two approaches to improving CPP: (1) Reduce ICP: The current ICP of 32 mmHg exceeds the treatment threshold of 22 mmHg (BTF guidelines). Interventions include elevating the head of bed to 30 degrees, ensuring proper cervical spine alignment (no jugular venous compression), hyperosmolar therapy (mannitol 0.25-1 g/kg IV or hypertonic saline 23.4% 30 mL via central line), brief hyperventilation to PaCO2 30-35 mmHg as a temporizing measure, and sedation/analgesia optimization. (2) Increase MAP: If ICP reduction alone is insufficient, vasopressors (norepinephrine is preferred) can be used to augment MAP and achieve target CPP. However, excessive CPP (>70 mmHg) should be avoided as it increases the risk of ARDS and cerebral edema. The emergency nurse should continuously monitor ICP and CPP, position the patient with head of bed at 30 degrees, ensure the ICP transducer is zeroed at the tragus (external auditory meatus), avoid hypotension and hypoxia (secondary brain injury), maintain normothermia (treat fever aggressively), and titrate interventions to maintain CPP 60-70 mmHg and ICP <22 mmHg. CVP is not part of the CPP calculation.",
    learningObjective: "Calculate cerebral perfusion pressure and identify when it falls below the target range requiring intervention in severe TBI",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Traumatic Brain Injury",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "CPP = MAP - ICP, NOT MAP + ICP; target CPP 60-70 mmHg; ICP treatment threshold is 22 mmHg per BTF guidelines",
    clinicalPearls: [
      "CPP = MAP - ICP; target 60-70 mmHg in severe TBI",
      "ICP treatment threshold: 22 mmHg (BTF guidelines)",
      "Avoid CPP >70 mmHg — increases ARDS and cerebral edema risk",
      "Zero ICP transducer at tragus (external auditory meatus)"
    ],
    safetyNote: "Both low CPP (<60) and high CPP (>70) are harmful — titrate interventions to maintain 60-70 mmHg",
    distractorRationales: [
      "CPP of 53 is below target and requires intervention",
      "CPP is MAP minus ICP, not MAP plus ICP",
      "50 mmHg is below the BTF-recommended minimum of 60",
      "CVP is not used in CPP calculation"
    ],
    lessonLink: "/emergency/lessons/traumatic-brain-injury"
  },
  {
    stem: "A 72-year-old female on rivaroxaban presents with acute left hemiparesis and neglect. NIHSS is 18. Symptom onset was 2 hours ago. Last rivaroxaban dose was 3 hours ago. CT head shows no hemorrhage. CTA reveals right MCA M1 occlusion. What is the appropriate thrombolytic decision?",
    options: [
      "Administer IV alteplase as the patient is within the 4.5-hour window regardless of anticoagulant status",
      "IV alteplase is contraindicated due to recent DOAC use; proceed directly to mechanical thrombectomy",
      "Administer andexanet alfa to reverse rivaroxaban, then give IV alteplase",
      "Wait 24 hours for rivaroxaban clearance, then reassess for thrombolysis"
    ],
    correctAnswer: 1,
    rationaleLong: "IV alteplase is generally contraindicated in patients who have taken a direct oral anticoagulant (DOAC) within the therapeutic time window, which for rivaroxaban is approximately 24-48 hours (given its half-life of 5-9 hours in patients with normal renal function, with therapeutic anticoagulant levels present for approximately 24 hours after the last dose). The patient took rivaroxaban only 3 hours ago, meaning therapeutic drug levels are present, and administering alteplase would create an unacceptable risk of hemorrhagic transformation, particularly symptomatic intracerebral hemorrhage. However, this patient has a large vessel occlusion (LVO) with significant deficit (NIHSS 18), and mechanical thrombectomy is the definitive treatment for LVO that does not require systemic thrombolysis. Current guidelines recommend proceeding directly to mechanical thrombectomy for DOAC-treated patients with LVO, bypassing IV alteplase. Thrombectomy can be performed regardless of anticoagulant status because it is a mechanical procedure that does not add systemic bleeding risk. There are some exceptions to the alteplase contraindication: if the anti-Xa level is below a certain threshold (institution-dependent, typically <0.5 IU/mL for some centers) or if specific DOAC reversal agents are administered first. However, using andexanet alfa (the reversal agent for factor Xa inhibitors) solely to enable IV alteplase is not currently a standard or validated approach, adds significant delay, and the thrombus burden in an M1 occlusion makes IV alteplase alone unlikely to achieve recanalization. The emergency nurse should prepare the patient for emergent thrombectomy, coordinate with the interventional team, maintain blood pressure per institutional protocol, and ensure large-bore IV access. Waiting 24 hours would result in completed infarction and devastating neurological outcome.",
    learningObjective: "Recognize that IV alteplase is contraindicated with recent DOAC use and that mechanical thrombectomy is the treatment for LVO in anticoagulated patients",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Stroke Management",
    difficulty: 5,
    cognitiveLevel: "evaluation",
    questionType: "MCQ_SINGLE",
    examTrap: "Recent DOAC use contraindicates IV alteplase, but thrombectomy can still be performed — do not deny patients with LVO definitive treatment",
    clinicalPearls: [
      "Rivaroxaban therapeutic effect lasts ~24 hours after last dose",
      "Thrombectomy is safe regardless of anticoagulant status",
      "Anti-Xa level <0.5 IU/mL may allow alteplase at some institutions",
      "DOAC patients with LVO: go directly to thrombectomy"
    ],
    safetyNote: "Never administer IV alteplase to a patient on therapeutic DOAC — hemorrhagic transformation risk is significantly elevated",
    distractorRationales: [
      "Alteplase with therapeutic DOAC levels creates unacceptable bleeding risk",
      "Direct thrombectomy bypasses the need for systemic thrombolysis",
      "Andexanet alfa to enable alteplase is not standard practice",
      "Waiting 24 hours would result in completed infarction"
    ],
    lessonLink: "/emergency/lessons/stroke-management"
  },
  {
    stem: "A 40-year-old female presents with progressive bilateral ascending weakness over 5 days, areflexia, and paresthesias in the hands and feet. She had a respiratory infection 2 weeks ago. Forced vital capacity (FVC) is 18 mL/kg. What is the nursing priority?",
    options: [
      "Administer IV methylprednisolone 1 g daily for acute inflammatory demyelination",
      "Prepare for elective intubation as FVC is approaching the critical threshold for respiratory failure",
      "Position the patient supine and administer supplemental oxygen via nasal cannula",
      "Discharge with outpatient neurology follow-up as symptoms are mild"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with Guillain-Barré syndrome (GBS), an acute inflammatory demyelinating polyradiculoneuropathy (AIDP) characterized by ascending weakness, areflexia, and sensory symptoms, typically preceded by an infection 1-4 weeks earlier. The critical concern in GBS is respiratory failure due to progressive weakness of the diaphragm and intercostal muscles, which occurs in approximately 20-30% of GBS patients. The forced vital capacity (FVC) is the most important bedside parameter for monitoring respiratory function in GBS. The 20/30/40 rule guides intubation decisions: FVC <20 mL/kg (this patient is at 18 mL/kg — below threshold), maximum inspiratory pressure (MIP) less negative than -30 cm H2O, or maximum expiratory pressure (MEP) <40 cm H2O. This patient's FVC of 18 mL/kg is below the critical threshold of 20 mL/kg, indicating imminent respiratory failure requiring elective intubation. Elective intubation is far safer than emergent intubation in a crashing patient with GBS because these patients can rapidly decompensate without warning (SpO2 and ABG may be normal until very late due to compensatory mechanisms). The emergency nurse should prepare for intubation, monitor serial FVC every 2-4 hours (or more frequently if declining rapidly), keep the head of bed elevated (not supine — supine positioning worsens respiratory function), have suction readily available (autonomic dysfunction may cause secretion issues), and avoid succinylcholine during intubation (risk of hyperkalemia from denervation). Treatment of GBS itself includes IV immunoglobulin (IVIg) 0.4 g/kg/day for 5 days OR plasmapheresis. Corticosteroids are NOT effective in GBS and may worsen outcomes. Discharging this patient would be dangerous given the FVC below the intubation threshold.",
    learningObjective: "Apply the 20/30/40 rule for intubation criteria in Guillain-Barré syndrome and recognize FVC as the critical monitoring parameter",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Neuromuscular Emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "FVC <20 mL/kg = intubation threshold in GBS; do NOT rely on SpO2 or ABG — they remain normal until catastrophic decompensation",
    clinicalPearls: [
      "20/30/40 rule: FVC <20, MIP > -30, MEP <40 = intubate",
      "Monitor FVC every 2-4 hours in GBS patients",
      "Avoid succinylcholine in GBS — risk of hyperkalemia",
      "IVIg or plasmapheresis are treatments; steroids are NOT effective"
    ],
    safetyNote: "Avoid succinylcholine during intubation of GBS patients — denervation creates hyperkalemia risk; use rocuronium instead",
    distractorRationales: [
      "Corticosteroids are not effective in GBS and may worsen outcomes",
      "FVC 18 mL/kg is below the 20 mL/kg intubation threshold",
      "Supine positioning worsens respiratory mechanics in GBS",
      "Discharge is dangerous with FVC below intubation threshold"
    ],
    lessonLink: "/emergency/lessons/neuromuscular-emergencies"
  },
  {
    stem: "A 58-year-old male presents with acute onset of vertigo, dysarthria, dysphagia, ipsilateral Horner syndrome, and contralateral loss of pain and temperature sensation. What vascular territory is affected?",
    options: [
      "Anterior cerebral artery territory causing medial frontal lobe ischemia",
      "Posterior inferior cerebellar artery (PICA) territory causing lateral medullary (Wallenberg) syndrome",
      "Middle cerebral artery territory causing lateral cortical ischemia",
      "Basilar artery occlusion causing bilateral pontine ischemia"
    ],
    correctAnswer: 1,
    rationaleLong: "This presentation is classic for lateral medullary syndrome (Wallenberg syndrome), caused by occlusion of the posterior inferior cerebellar artery (PICA) or the vertebral artery. The lateral medulla contains several critical structures, and their ischemia produces a characteristic constellation of findings: (1) Vestibular nuclei: vertigo, nystagmus, nausea/vomiting — this is why many Wallenberg patients are initially misdiagnosed as having peripheral vertigo or labyrinthitis. (2) Nucleus ambiguus (CN IX, X): dysarthria, dysphagia, hoarseness, absent gag reflex on the ipsilateral side. Dysphagia is a major concern for aspiration risk. (3) Descending sympathetic tract: ipsilateral Horner syndrome (ptosis, miosis, anhidrosis). (4) Spinothalamic tract: contralateral loss of pain and temperature sensation in the body. Importantly, there is an alternating sensory pattern — ipsilateral facial sensory loss (descending trigeminal tract) with contralateral body sensory loss (spinothalamic tract). (5) Inferior cerebellar peduncle: ipsilateral cerebellar ataxia. The emergency nurse should prioritize airway protection given the significant aspiration risk from dysphagia and absent gag reflex. NPO status should be maintained until a formal swallowing evaluation is completed. The patient needs urgent MRI with diffusion-weighted imaging (DWI) for definitive diagnosis, as CT often misses posterior fossa strokes. CTA or MRA should evaluate for vertebral artery dissection, which is a common cause of Wallenberg syndrome in younger patients. Treatment follows standard acute ischemic stroke protocols, and thrombolysis or thrombectomy may be considered if within the treatment window.",
    learningObjective: "Identify the clinical features of lateral medullary (Wallenberg) syndrome and its association with PICA territory ischemia",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Posterior Circulation Stroke",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Wallenberg syndrome is commonly misdiagnosed as peripheral vertigo — always check for crossed sensory findings and Horner syndrome",
    clinicalPearls: [
      "Wallenberg triad: vertigo + dysphagia + Horner syndrome",
      "Crossed sensory pattern: ipsilateral face + contralateral body pain/temperature loss",
      "High aspiration risk — maintain NPO until swallowing evaluation",
      "CT often misses posterior fossa strokes — MRI DWI is needed"
    ],
    safetyNote: "Maintain strict NPO status in Wallenberg syndrome due to severe aspiration risk from CN IX/X dysfunction",
    distractorRationales: [
      "ACA territory causes leg weakness and personality changes, not this pattern",
      "PICA territory produces the classic lateral medullary syndrome",
      "MCA territory causes contralateral face/arm weakness and aphasia",
      "Basilar occlusion causes bilateral findings and decreased consciousness"
    ],
    lessonLink: "/emergency/lessons/posterior-circulation-stroke"
  },
  {
    stem: "A 25-year-old female presents with severe headache, bilateral papilledema, and visual obscurations. BMI is 38. CT head is normal. LP reveals an opening pressure of 38 cm H2O with normal CSF composition. What is the immediate therapeutic intervention during the lumbar puncture?",
    options: [
      "Drain CSF until opening pressure normalizes to below 20 cm H2O",
      "Remove 20-30 mL of CSF to provide symptomatic relief and reduce risk of visual loss",
      "Do not remove any CSF — the LP is diagnostic only",
      "Administer intrathecal methylprednisolone to reduce inflammation"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with idiopathic intracranial hypertension (IIH), formerly known as pseudotumor cerebri. The classic presentation includes headache, bilateral papilledema, visual disturbances (transient visual obscurations, enlarged blind spots), and pulsatile tinnitus in a young obese female. Diagnostic criteria (modified Dandy criteria) include: elevated ICP (>25 cm H2O in adults), normal CSF composition, normal neuroimaging (or showing only signs of elevated ICP such as empty sella, flattened posterior globes, or optic nerve sheath distension), and no other identifiable cause. During the diagnostic LP, therapeutic CSF drainage of 20-30 mL is recommended to provide immediate symptomatic relief from headache and reduce the risk of ongoing visual damage. This volume is sufficient to lower pressure acutely while minimizing the risk of complications such as post-LP headache, tonsillar herniation (extremely rare in IIH), or rebound intracranial hypotension. Draining to a specific target pressure (below 20 cm H2O) is not standard practice and may remove too much CSF, causing severe post-LP headache. The LP is both diagnostic and therapeutic in IIH. Intrathecal medications are not used in IIH management. After the LP, the mainstay of medical treatment is acetazolamide (a carbonic anhydrase inhibitor that reduces CSF production), starting at 500 mg twice daily and titrating up to 2-4 g/day as tolerated. Weight loss is the most effective long-term treatment, with even 5-10% weight loss significantly improving outcomes. Urgent ophthalmology referral is essential for baseline visual field testing and monitoring. Patients with rapidly progressive visual loss may require optic nerve sheath fenestration or CSF shunting (ventriculoperitoneal or lumboperitoneal) as a surgical intervention.",
    learningObjective: "Manage idiopathic intracranial hypertension with therapeutic CSF drainage during diagnostic lumbar puncture",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Elevated Intracranial Pressure",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "LP in IIH is both diagnostic AND therapeutic — drain 20-30 mL for symptomatic relief; do not drain to a specific target pressure",
    clinicalPearls: [
      "IIH: young obese female + headache + papilledema + normal CT + elevated OP",
      "Therapeutic drainage: 20-30 mL CSF during diagnostic LP",
      "Acetazolamide reduces CSF production; start 500 mg BID",
      "Weight loss of 5-10% significantly improves IIH outcomes"
    ],
    safetyNote: "Urgent ophthalmology referral required — IIH can cause permanent visual loss if untreated",
    distractorRationales: [
      "Draining to a specific target may remove too much CSF",
      "20-30 mL drainage provides safe symptomatic relief",
      "LP is both diagnostic and therapeutic in IIH",
      "Intrathecal steroids have no role in IIH management"
    ],
    lessonLink: "/emergency/lessons/elevated-icp"
  },
  {
    stem: "A 68-year-old male with a VP shunt for normal pressure hydrocephalus presents with headache, decreased level of consciousness, and bilateral sixth nerve palsies. CT head shows enlarged ventricles compared to his baseline imaging. What is the most likely diagnosis?",
    options: [
      "Shunt overdrainage causing subdural hematoma",
      "VP shunt malfunction with acute obstructive hydrocephalus",
      "Normal pressure hydrocephalus progression unrelated to shunt function",
      "Meningitis causing communicating hydrocephalus"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with signs and symptoms of VP shunt malfunction leading to acute obstructive hydrocephalus. The key findings are: (1) Headache and decreased level of consciousness: indicating elevated ICP from CSF accumulation. (2) Bilateral sixth nerve palsies: CN VI has the longest intracranial course and is particularly susceptible to stretching from elevated ICP. Bilateral CN VI palsies are a classic false localizing sign of elevated ICP, not indicating a specific brainstem lesion. (3) Enlarged ventricles compared to baseline: directly demonstrating that the shunt is not adequately draining CSF. VP shunt malfunction is common, with approximately 40% of shunts failing within the first 2 years and 50% within 6 years. Common causes of malfunction include proximal catheter obstruction (choroid plexus, debris, brain tissue growing into catheter holes), distal catheter obstruction (peritoneal adhesions, catheter migration), valve malfunction, catheter disconnection, and infection. The emergency evaluation should include: (1) Shunt series X-rays (AP and lateral skull, chest, and abdomen) to evaluate catheter integrity, connections, and tip positions. (2) CT head compared to baseline to assess ventricle size. (3) Neurosurgical consultation for possible shunt tap (performed under sterile conditions by a neurosurgeon to assess shunt patency and measure ICP). (4) If the patient is deteriorating rapidly, emergent neurosurgical intervention may be needed. Shunt overdrainage would cause small ventricles and potentially subdural hygromas or hematomas, not enlarged ventricles. The emergency nurse should monitor neurological status closely, prepare for potential emergent intervention, and elevate the head of bed to 30 degrees to reduce ICP.",
    learningObjective: "Recognize VP shunt malfunction presenting with signs of elevated ICP and enlarged ventricles on CT",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Hydrocephalus and CSF Disorders",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Bilateral CN VI palsies are a false localizing sign of elevated ICP — they indicate diffuse pressure, not a brainstem lesion",
    clinicalPearls: [
      "~40% of VP shunts fail within 2 years",
      "Shunt series X-rays evaluate catheter integrity and position",
      "Bilateral CN VI palsies = elevated ICP until proven otherwise",
      "Always compare CT to baseline imaging in shunt patients"
    ],
    safetyNote: "Only neurosurgery should perform shunt taps — improper technique can introduce infection or damage the system",
    distractorRationales: [
      "Overdrainage causes small ventricles and subdural collections, not enlargement",
      "Shunt malfunction with enlarged ventricles indicates obstruction",
      "NPH progression would not cause acute decompensation with CN VI palsies",
      "Meningitis would present with fever and CSF pleocytosis"
    ],
    lessonLink: "/emergency/lessons/hydrocephalus-emergencies"
  },
  {
    stem: "A 35-year-old male presents after a diving accident with C5 spinal cord injury. He is hypotensive (BP 78/50), bradycardic (HR 44), and has warm, flushed skin below the level of injury. What type of shock is this patient experiencing and what is the first-line vasopressor?",
    options: [
      "Hypovolemic shock from occult hemorrhage; treat with phenylephrine",
      "Neurogenic shock from loss of sympathetic tone; treat with norepinephrine",
      "Cardiogenic shock from myocardial contusion; treat with dobutamine",
      "Septic shock from aspiration pneumonia; treat with vasopressin"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with neurogenic shock, a distributive form of shock caused by loss of sympathetic nervous system tone below the level of spinal cord injury. The classic triad of neurogenic shock is: (1) Hypotension from loss of peripheral vascular tone (vasodilation), (2) Bradycardia from unopposed parasympathetic (vagal) activity to the heart, and (3) Peripheral vasodilation causing warm, flushed, dry skin below the injury level (in contrast to hypovolemic shock, which causes cool, clammy, pale skin). Neurogenic shock occurs with injuries at T6 or above, where the sympathetic outflow from the thoracolumbar spine is disrupted. Higher injuries (cervical) produce more severe hemodynamic effects because more sympathetic outflow is lost. This patient's C5 injury disrupts sympathetic innervation to the heart (T1-T4 cardioacceleratory fibers) and peripheral vasculature. Treatment of neurogenic shock follows a stepwise approach: (1) IV fluid resuscitation (1-2 L crystalloid) to optimize preload — but use caution as these patients may not respond to fluids alone and are at risk for fluid overload. (2) Norepinephrine is the first-line vasopressor because it provides both alpha-1 vasoconstriction (addressing the vasodilation) and beta-1 cardiac stimulation (addressing the bradycardia). (3) For persistent bradycardia despite norepinephrine, atropine 0.5-1 mg IV or glycopyrrolate may be added. (4) If the patient remains hypotensive, vasopressin can be added as a second-line agent. Phenylephrine (pure alpha agonist) may worsen bradycardia through reflex mechanisms and is not preferred. Importantly, hemorrhagic shock must always be considered concurrently in trauma patients — neurogenic shock is a diagnosis of exclusion after hemorrhage has been ruled out. The emergency nurse should carefully monitor hemodynamics, maintain spinal immobilization, avoid hypothermia (impaired thermoregulation), and insert an indwelling catheter for urinary retention.",
    learningObjective: "Identify neurogenic shock from spinal cord injury and apply norepinephrine as first-line vasopressor therapy",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Spinal Cord Injury",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Neurogenic shock: warm + hypotensive + bradycardic (unlike hypovolemic shock: cool + hypotensive + tachycardic); always rule out hemorrhage first",
    clinicalPearls: [
      "Neurogenic shock triad: hypotension + bradycardia + warm/flushed skin",
      "Occurs with SCI at T6 or above; more severe with higher injuries",
      "Norepinephrine is first-line: provides vasoconstriction + cardiac stimulation",
      "Phenylephrine may worsen bradycardia via reflex mechanisms"
    ],
    safetyNote: "Always rule out hemorrhagic shock in trauma patients — neurogenic shock is a diagnosis of exclusion",
    distractorRationales: [
      "Hypovolemic shock presents with cool, clammy skin and tachycardia",
      "Neurogenic shock matches the triad of hypotension, bradycardia, and warm skin",
      "Cardiogenic shock is unlikely without chest trauma findings",
      "Septic shock does not develop acutely from a diving accident"
    ],
    lessonLink: "/emergency/lessons/spinal-cord-injury"
  },
  {
    stem: "A 50-year-old male with chronic alcoholism presents with confusion, ophthalmoplegia, and ataxia. His blood glucose is 68 mg/dL. What must be administered BEFORE IV dextrose?",
    options: [
      "IV naloxone 2 mg to rule out opioid overdose",
      "IV thiamine 500 mg to prevent Wernicke encephalopathy precipitation",
      "IV phenytoin to prevent alcohol withdrawal seizures",
      "IV flumazenil to reverse benzodiazepine effects"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with the classic triad of Wernicke encephalopathy (WE): confusion (encephalopathy), ophthalmoplegia (impaired eye movements, typically lateral gaze palsy from CN VI involvement), and ataxia (cerebellar dysfunction). WE is caused by thiamine (vitamin B1) deficiency, most commonly seen in chronic alcoholism but also in malnutrition, hyperemesis gravidarum, bariatric surgery patients, and other conditions causing nutritional deficiency. The critical clinical principle is that thiamine must ALWAYS be administered BEFORE or concurrently with IV dextrose in patients at risk for thiamine deficiency. The reason is that glucose metabolism requires thiamine as a cofactor for pyruvate dehydrogenase and other enzymes in the Krebs cycle. Administering glucose to a thiamine-depleted patient increases metabolic demand for the already-deficient thiamine, potentially consuming the last remaining thiamine stores and precipitating or worsening Wernicke encephalopathy. This can lead to irreversible brain damage, particularly to the mammillary bodies and periaqueductal gray matter. The recommended thiamine dose for suspected WE is 500 mg IV three times daily for 2-3 days, then 250 mg IV daily for 3-5 days (European Federation of Neurological Societies guidelines). Higher doses are recommended for established WE compared to prophylactic doses (100-250 mg). Thiamine is water-soluble with an excellent safety profile — serious adverse reactions are extremely rare. If WE progresses untreated, it can lead to Korsakoff syndrome, characterized by severe anterograde amnesia, confabulation, and personality changes, which is largely irreversible. The classic triad is present in only about 16-33% of WE cases; many patients present with only one or two features, so a high index of suspicion is necessary in at-risk populations. The emergency nurse should administer IV thiamine before any glucose-containing fluids, initiate nutritional support, and monitor for alcohol withdrawal symptoms.",
    learningObjective: "Recognize Wernicke encephalopathy and the critical requirement to administer thiamine before IV dextrose",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Metabolic Encephalopathy",
    difficulty: 2,
    cognitiveLevel: "comprehension",
    questionType: "MCQ_SINGLE",
    examTrap: "ALWAYS give thiamine BEFORE dextrose in alcoholic or malnourished patients — dextrose without thiamine can precipitate or worsen Wernicke encephalopathy",
    clinicalPearls: [
      "Wernicke triad: confusion + ophthalmoplegia + ataxia (only 16-33% have all three)",
      "Thiamine 500 mg IV TID for 2-3 days for established Wernicke",
      "Untreated Wernicke → Korsakoff syndrome (irreversible amnesia)",
      "Thiamine is extremely safe — treat empirically when in doubt"
    ],
    safetyNote: "NEVER give IV dextrose before thiamine in alcoholic or malnourished patients — can cause irreversible brain damage",
    distractorRationales: [
      "Naloxone is for opioid overdose, not indicated here",
      "Thiamine must precede dextrose to prevent Wernicke precipitation",
      "Phenytoin is not first-line for alcohol withdrawal seizures",
      "Flumazenil can precipitate seizures in chronic benzodiazepine users"
    ],
    lessonLink: "/emergency/lessons/metabolic-encephalopathy"
  },
  {
    stem: "A 42-year-old female with myasthenia gravis presents with worsening dysphagia, nasal speech, and dyspnea after a recent upper respiratory infection. Her negative inspiratory force (NIF) is -22 cm H2O. She takes pyridostigmine 60 mg every 4 hours. How does the emergency nurse differentiate between myasthenic crisis and cholinergic crisis?",
    options: [
      "Administer a higher dose of pyridostigmine — if symptoms improve, it is myasthenic crisis",
      "Administer edrophonium (Tensilon) test — improvement indicates myasthenic crisis; worsening indicates cholinergic crisis",
      "Check for miosis, bradycardia, excessive secretions, and fasciculations — these suggest cholinergic crisis from excessive anticholinesterase medication",
      "Both crises are treated identically with immediate intubation, so differentiation is not clinically important"
    ],
    correctAnswer: 2,
    rationaleLong: "Differentiating myasthenic crisis from cholinergic crisis is critical because they have opposite causes and different treatments (although both may require intubation if respiratory failure occurs). Myasthenic crisis is caused by disease exacerbation (often triggered by infection, surgery, medication changes, or stress) resulting in insufficient acetylcholine activity at the neuromuscular junction. Patients present with worsening weakness, respiratory failure, and may need increased anticholinesterase medication or immunotherapy (IVIg or plasmapheresis). Cholinergic crisis is caused by excessive anticholinesterase medication (too much pyridostigmine), resulting in overstimulation and then depolarization block at the neuromuscular junction. The key differentiating features of cholinergic crisis include muscarinic signs: miosis (constricted pupils), bradycardia, excessive salivation, lacrimation, urination, diarrhea, bronchorrhea, bronchospasm (remembered by the mnemonic SLUDGE-BBB), and fasciculations from nicotinic overstimulation. These muscarinic/nicotinic signs are ABSENT in myasthenic crisis. While the edrophonium (Tensilon) test was historically used for differentiation — a short-acting anticholinesterase that temporarily improves myasthenic crisis but worsens cholinergic crisis — it has largely fallen out of favor due to risks of cardiac arrhythmias, bronchospasm, and its limited availability. The safer approach is clinical assessment of muscarinic signs. In this patient, the URI is a common trigger for myasthenic crisis, but the nurse should still assess for cholinergic signs before adjusting medication. The NIF of -22 cm H2O is concerning (less negative than -30 cm H2O suggests impending respiratory failure). The emergency nurse should prepare for intubation (using a non-depolarizing agent — AVOID succinylcholine due to resistance), hold anticholinesterase medications if cholinergic crisis is suspected, and arrange for ICU admission. IVIg or plasmapheresis should be initiated early for myasthenic crisis.",
    learningObjective: "Differentiate myasthenic crisis from cholinergic crisis using muscarinic signs and understand the clinical implications for treatment",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Neuromuscular Emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Cholinergic crisis has muscarinic signs (SLUDGE-BBB) that are absent in myasthenic crisis — do not just increase pyridostigmine without checking",
    clinicalPearls: [
      "Cholinergic crisis: SLUDGE-BBB (Salivation, Lacrimation, Urination, Diarrhea, GI cramps, Emesis, Bradycardia, Bronchospasm, Bronchorrhea)",
      "NIF less negative than -30 cm H2O suggests impending respiratory failure",
      "Avoid succinylcholine in MG — patients are resistant to depolarizing agents",
      "IVIg or plasmapheresis for myasthenic crisis; hold pyridostigmine for cholinergic crisis"
    ],
    safetyNote: "Do NOT give additional pyridostigmine without assessing for cholinergic signs — if cholinergic crisis, it will worsen respiratory failure",
    distractorRationales: [
      "Increasing pyridostigmine in cholinergic crisis would be dangerous",
      "Edrophonium test is no longer routinely used due to cardiac risks",
      "Muscarinic signs (miosis, bradycardia, secretions) differentiate cholinergic crisis",
      "Differentiation matters for medication management even if both need intubation"
    ],
    lessonLink: "/emergency/lessons/neuromuscular-emergencies"
  },
  {
    stem: "A 75-year-old male with known Parkinson disease on levodopa/carbidopa presents with high fever (40.2°C), severe rigidity, altered consciousness, CK 8,500 U/L, and autonomic instability. His wife reports his neurologist stopped his levodopa abruptly 3 days ago. What is the most likely diagnosis?",
    options: [
      "Serotonin syndrome from a new antidepressant medication",
      "Neuroleptic malignant syndrome (NMS)-like reaction from abrupt levodopa withdrawal",
      "Malignant hyperthermia from recent general anesthesia",
      "Heat stroke from environmental exposure"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with a neuroleptic malignant syndrome (NMS)-like reaction triggered by abrupt withdrawal of dopaminergic medication (levodopa/carbidopa). This condition, sometimes called parkinsonism-hyperpyrexia syndrome or neuroleptic malignant-like syndrome, is clinically identical to classic NMS and occurs when dopaminergic medications are abruptly discontinued in patients with Parkinson disease. The pathophysiology involves sudden central dopamine depletion, leading to the characteristic tetrad: (1) Hyperthermia (temperature >38°C, often >40°C), (2) Severe muscular rigidity (lead-pipe rigidity), (3) Altered mental status (confusion, delirium, obtundation), (4) Autonomic instability (tachycardia, labile blood pressure, diaphoresis, tachypnea). Elevated creatine kinase (CK) from rhabdomyolysis is typical and can lead to acute kidney injury. The triggers for this condition include abrupt levodopa discontinuation, dose reduction, medication changes, infections causing malabsorption, or postoperative NPO status preventing oral medication administration. Treatment involves: (1) Immediate resumption of dopaminergic medications — restart levodopa at the previous dose via NG tube if the patient cannot swallow. (2) Aggressive cooling measures for hyperthermia. (3) IV hydration and monitoring for rhabdomyolysis/AKI (target UOP >200 mL/hr). (4) Dantrolene 1-2.5 mg/kg IV may be used for severe rigidity (it acts on the skeletal muscle ryanodine receptor to reduce rigidity and thermogenesis). (5) Bromocriptine (dopamine agonist) 2.5 mg via NG tube every 8 hours may be added. (6) ICU admission for monitoring and supportive care. Serotonin syndrome shares some features but presents with clonus, hyperreflexia, and diarrhea rather than lead-pipe rigidity. Malignant hyperthermia occurs during or immediately after general anesthesia with specific triggering agents. Heat stroke would not explain the severe rigidity and elevated CK in this clinical context.",
    learningObjective: "Recognize NMS-like reaction from abrupt dopaminergic medication withdrawal in Parkinson disease and initiate immediate treatment",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Drug-Related Neurological Emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Abrupt levodopa withdrawal = NMS-like reaction; NEVER abruptly stop dopaminergic medications in Parkinson patients",
    clinicalPearls: [
      "NMS tetrad: hyperthermia + rigidity + AMS + autonomic instability",
      "CK >1000 U/L suggests rhabdomyolysis — monitor renal function",
      "Restart dopaminergic medication immediately via NG tube if needed",
      "Dantrolene for severe rigidity; bromocriptine as adjunct"
    ],
    safetyNote: "NEVER abruptly discontinue levodopa or other dopaminergic medications — can trigger life-threatening NMS-like syndrome",
    distractorRationales: [
      "Serotonin syndrome features clonus and hyperreflexia, not lead-pipe rigidity",
      "Abrupt levodopa withdrawal is the clear trigger for NMS-like reaction",
      "Malignant hyperthermia requires exposure to triggering anesthetic agents",
      "Heat stroke does not cause severe rigidity and markedly elevated CK"
    ],
    lessonLink: "/emergency/lessons/drug-related-neuro-emergencies"
  },
  {
    stem: "A 60-year-old male presents 18 hours after acute ischemic stroke with right hemiplegia and aphasia. He did not receive IV alteplase due to a late presentation. MRI shows a large left MCA infarction. Over the next 24 hours, his GCS deteriorates from 12 to 7, and repeat CT shows significant midline shift. What neurosurgical intervention may be life-saving?",
    options: [
      "Emergent craniotomy for clot evacuation and hematoma drainage",
      "Decompressive hemicraniectomy to relieve malignant cerebral edema",
      "Placement of an external ventricular drain for CSF diversion",
      "Stereotactic aspiration of the ischemic core"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient is developing malignant cerebral edema following a large MCA territory infarction, which is a life-threatening complication that occurs in approximately 10% of supratentorial ischemic strokes, typically peaking at 48-96 hours post-stroke. The clinical hallmark is progressive neurological deterioration with increasing midline shift, leading to uncal herniation and death if untreated. The DECIMAL, DESTINY, and HAMLET trials demonstrated that decompressive hemicraniectomy (surgical removal of a large portion of the skull to allow the edematous brain to expand outward rather than herniating) reduces mortality from approximately 70-80% to 20-30% in malignant MCA infarction. Key findings from these trials: (1) Surgery should be performed within 48 hours of stroke onset, before clinical herniation occurs. (2) The greatest benefit is seen in patients under 60 years old, though the DESTINY II trial showed mortality benefit even in patients over 60 (however, functional outcomes in older patients may be poor, with significant disability). (3) The bone flap should be at least 12 cm in diameter for adequate decompression. (4) Duraplasty (opening the dura) is an essential component to allow maximum brain expansion. The emergency nurse's role includes frequent neurological assessments (GCS, pupil reactivity, motor response), recognition of herniation signs (unilateral pupil dilation, decorticate/decerebrate posturing, Cushing response), implementation of ICP-lowering measures as bridge to surgery (head of bed elevation, osmotic therapy, mild hyperventilation), and preparation for emergent surgical intervention. An EVD is used for hydrocephalus, not for hemispheric edema. Clot evacuation and stereotactic aspiration are for hemorrhagic stroke, not ischemic infarction.",
    learningObjective: "Recognize malignant cerebral edema following large MCA infarction and understand the role of decompressive hemicraniectomy",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Stroke Complications",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Malignant MCA edema peaks at 48-96 hours; hemicraniectomy must be performed within 48 hours before herniation occurs",
    clinicalPearls: [
      "Malignant MCA edema occurs in ~10% of supratentorial strokes",
      "DECIMAL/DESTINY/HAMLET trials: hemicraniectomy reduces mortality from 70-80% to 20-30%",
      "Surgery within 48 hours before clinical herniation for best outcomes",
      "Bone flap ≥12 cm with duraplasty for adequate decompression"
    ],
    safetyNote: "Monitor for herniation signs (pupil dilation, posturing, Cushing triad) every 1-2 hours in large MCA infarctions",
    distractorRationales: [
      "Craniotomy for clot evacuation is for hemorrhagic stroke, not ischemic",
      "Hemicraniectomy is the evidence-based intervention for malignant MCA edema",
      "EVD addresses hydrocephalus, not hemispheric edema and midline shift",
      "Stereotactic aspiration is not applicable to ischemic infarction"
    ],
    lessonLink: "/emergency/lessons/stroke-complications"
  },
  {
    stem: "A 22-year-old female presents with progressive bilateral visual loss, pain with eye movement, and a relative afferent pupillary defect (RAPD) in the left eye. MRI of the orbits shows bilateral optic nerve enhancement. She has no prior neurological history. What is the most likely diagnosis and what condition does this finding suggest?",
    options: [
      "Bilateral optic neuritis, suggesting a first presentation of multiple sclerosis",
      "Bilateral retinal detachment from trauma",
      "Central retinal artery occlusion causing bilateral visual loss",
      "Bilateral glaucoma with acute angle closure"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with bilateral optic neuritis, characterized by progressive visual loss, pain with eye movement (due to inflammation of the optic nerve sheath, which stretches during eye movement), and a relative afferent pupillary defect (Marcus Gunn pupil). MRI showing bilateral optic nerve enhancement confirms active inflammation. Optic neuritis is the presenting symptom in 15-20% of multiple sclerosis (MS) cases, and approximately 50-70% of patients with a first episode of optic neuritis will eventually develop MS. The Optic Neuritis Treatment Trial (ONTT) provided critical evidence for management: (1) IV methylprednisolone (1 g daily for 3 days) followed by oral prednisone taper speeds visual recovery but does not improve final visual outcome. (2) Oral prednisone alone is CONTRAINDICATED as initial treatment because it paradoxically increases the recurrence rate of optic neuritis. (3) MRI of the brain and spinal cord should be performed to look for demyelinating lesions (white matter plaques), which significantly increase the risk of MS development. The McDonald criteria use MRI findings to establish MS diagnosis based on dissemination in space and time. The RAPD (Marcus Gunn pupil) is detected by the swinging flashlight test: when light is swung from the unaffected eye to the affected eye, the affected pupil paradoxically dilates because the afferent signal from the damaged optic nerve is weaker. This is a critical exam finding that localizes the pathology to the optic nerve. The emergency nurse should assess visual acuity, perform color vision testing (red desaturation is an early sign of optic neuritis), check pupillary reflexes, and arrange urgent ophthalmology and neurology consultations. Bilateral presentation is less common in MS and should also raise consideration for neuromyelitis optica spectrum disorder (NMOSD), which requires aquaporin-4 antibody testing.",
    learningObjective: "Recognize optic neuritis as a potential first presentation of multiple sclerosis and understand the diagnostic and treatment implications",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Demyelinating Emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Oral prednisone alone is CONTRAINDICATED in optic neuritis — use IV methylprednisolone; oral-only treatment increases recurrence risk",
    clinicalPearls: [
      "Optic neuritis triad: visual loss + pain with eye movement + RAPD",
      "50-70% of optic neuritis patients eventually develop MS",
      "IV methylprednisolone speeds recovery; oral prednisone alone increases recurrence",
      "Bilateral optic neuritis: consider NMOSD and check aquaporin-4 antibodies"
    ],
    safetyNote: "Do NOT treat optic neuritis with oral prednisone alone — ONTT showed increased recurrence rate with oral-only steroids",
    distractorRationales: [
      "Optic neuritis with enhancement on MRI is the most likely diagnosis",
      "Retinal detachment does not cause pain with eye movement or optic nerve enhancement",
      "CRAO presents with sudden painless monocular vision loss",
      "Acute glaucoma presents with eye redness, halos, and elevated intraocular pressure"
    ],
    lessonLink: "/emergency/lessons/demyelinating-emergencies"
  },
  {
    stem: "A 48-year-old male presents with sudden onset of worst headache of his life, confusion, and bilateral lower extremity weakness. CT head shows blood in the interhemispheric fissure. What is the most likely source of hemorrhage?",
    options: [
      "Ruptured middle cerebral artery aneurysm",
      "Ruptured anterior communicating artery aneurysm",
      "Hypertensive basal ganglia hemorrhage",
      "Ruptured posterior communicating artery aneurysm"
    ],
    correctAnswer: 1,
    rationaleLong: "Blood predominantly in the interhemispheric fissure on CT strongly suggests a ruptured anterior communicating artery (AComA) aneurysm. The distribution of subarachnoid blood on CT can help predict the location of the ruptured aneurysm: (1) AComA aneurysm: Blood in the interhemispheric fissure, especially the anterior interhemispheric fissure. This is the most common location for cerebral aneurysms, accounting for approximately 30-35% of all intracranial aneurysms. (2) MCA aneurysm: Blood predominantly in the Sylvian fissure (lateral sulcus). (3) PComA aneurysm: Blood in the suprasellar cistern and adjacent to the temporal lobe. (4) Basilar tip aneurysm: Blood in the prepontine and interpeduncular cisterns. The bilateral lower extremity weakness in this patient is explained by the anatomy: AComA aneurysm rupture can cause blood and vasospasm affecting the anterior cerebral arteries (ACAs) bilaterally. The ACAs supply the medial cortex, which includes the motor and sensory representation for the lower extremities (leg areas of the homunculus are on the medial surface of the hemisphere). Therefore, bilateral ACA compromise causes bilateral leg weakness, which is a classic localizing sign pointing to the AComA aneurysm location. Additionally, AComA aneurysms may be associated with abulia (lack of will/motivation), memory deficits, and personality changes due to involvement of the medial frontal lobes and basal forebrain. The emergency nurse should implement aneurysm precautions (strict BP control with SBP target per neurosurgery, typically <140-160 mmHg; bed rest; quiet environment; stool softeners; seizure precautions), arrange emergent CTA followed by DSA, and prepare for possible urgent surgical clipping or endovascular coiling. Nimodipine 60 mg every 4 hours should be initiated for vasospasm prophylaxis.",
    learningObjective: "Correlate CT blood distribution with aneurysm location, specifically interhemispheric blood with anterior communicating artery aneurysm",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Subarachnoid Hemorrhage",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Interhemispheric blood = AComA aneurysm; Sylvian fissure blood = MCA aneurysm; bilateral leg weakness = ACA territory",
    clinicalPearls: [
      "AComA is the most common intracranial aneurysm location (~30-35%)",
      "Bilateral leg weakness localizes to ACA territory (medial cortex)",
      "CT blood distribution predicts aneurysm location",
      "Nimodipine 60 mg q4h for vasospasm prophylaxis (start within 96 hours)"
    ],
    safetyNote: "Strict blood pressure control is essential to prevent rebleeding — most dangerous in first 24 hours before aneurysm is secured",
    distractorRationales: [
      "MCA aneurysm would cause Sylvian fissure blood and contralateral hemiparesis",
      "AComA aneurysm explains interhemispheric blood and bilateral leg weakness",
      "Hypertensive hemorrhage occurs in basal ganglia/thalamus, not interhemispheric fissure",
      "PComA aneurysm causes suprasellar blood and CN III palsy"
    ],
    lessonLink: "/emergency/lessons/subarachnoid-hemorrhage"
  },
  {
    stem: "A 65-year-old female on apixaban presents with acute left MCA syndrome. NIHSS is 22. Last known well was 1 hour ago. Anti-factor Xa level returns at 180 ng/mL. CT shows no hemorrhage. CTA shows left M1 occlusion. What is the thrombolytic eligibility status?",
    options: [
      "Eligible for IV alteplase since anti-Xa level is below 200 ng/mL",
      "IV alteplase is contraindicated as anti-Xa level exceeds the safe threshold; proceed to direct thrombectomy",
      "Administer andexanet alfa to reverse apixaban, then give IV alteplase within 15 minutes",
      "Eligible for IV alteplase regardless of anti-Xa level if within the time window"
    ],
    correctAnswer: 1,
    rationaleLong: "The decision to administer IV alteplase in patients on direct oral anticoagulants (DOACs) depends on the measured anticoagulant effect. For factor Xa inhibitors (apixaban, rivaroxaban, edoxaban), the anti-factor Xa level is used to assess anticoagulant activity. While institutional protocols vary, many centers use a threshold of anti-Xa level <30 ng/mL as safe for alteplase administration, as this indicates negligible anticoagulant effect. Some institutions use more liberal cutoffs of <50 ng/mL or even <100 ng/mL. This patient's anti-Xa level of 180 ng/mL indicates significant therapeutic anticoagulation, meaning the patient is at substantially increased risk of hemorrhagic transformation if IV alteplase is administered. Therefore, IV alteplase is contraindicated. However, the patient has a confirmed large vessel occlusion (LVO) with severe deficit (NIHSS 22) and should proceed directly to mechanical thrombectomy, which is safe regardless of anticoagulant status. Thrombectomy achieves recanalization mechanically without adding systemic fibrinolytic risk. The major trials (MR CLEAN, ESCAPE, etc.) included patients on anticoagulants who underwent thrombectomy safely. Using andexanet alfa (the specific reversal agent for factor Xa inhibitors) solely to enable alteplase administration is not an established or recommended practice — it adds delay, is extremely expensive, and the M1 occlusion is unlikely to respond to alteplase alone. The emergency nurse should prepare the patient for direct thrombectomy, coordinate with the neurointerventional team, maintain blood pressure per protocol, ensure large-bore IV access, and monitor neurological status during transfer to the interventional suite.",
    learningObjective: "Apply anti-factor Xa level thresholds in DOAC-treated patients to determine thrombolytic eligibility and select appropriate stroke treatment",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Stroke Management",
    difficulty: 5,
    cognitiveLevel: "evaluation",
    questionType: "MCQ_SINGLE",
    examTrap: "Anti-Xa level >30-50 ng/mL generally contraindicates IV alteplase; but thrombectomy is ALWAYS an option for LVO regardless of anticoagulation",
    clinicalPearls: [
      "Anti-Xa <30 ng/mL: most centers consider safe for alteplase",
      "Anti-Xa 30-50 ng/mL: institutional protocols vary",
      "Anti-Xa >50 ng/mL: most centers contraindicate alteplase",
      "Thrombectomy is safe regardless of anticoagulant status"
    ],
    safetyNote: "Point-of-care anti-Xa assays enable rapid decision-making — do not delay thrombectomy while waiting for lab results",
    distractorRationales: [
      "Anti-Xa 180 ng/mL is well above the safe threshold for alteplase",
      "Direct thrombectomy is the appropriate treatment for LVO with therapeutic anticoagulation",
      "Andexanet alfa to enable alteplase is not standard practice for stroke",
      "Anti-Xa level must be considered — alteplase is not safe regardless of DOAC levels"
    ],
    lessonLink: "/emergency/lessons/stroke-management"
  },
  {
    stem: "A 55-year-old male undergoing IV alteplase for acute ischemic stroke suddenly develops severe headache, vomiting, and rapid neurological deterioration with new-onset right pupil dilation 30 minutes into the infusion. What is the immediate priority action?",
    options: [
      "Complete the alteplase infusion and obtain a STAT CT head",
      "Stop the alteplase infusion immediately and obtain a STAT CT head",
      "Increase the alteplase infusion rate to achieve faster recanalization",
      "Administer IV labetalol to lower blood pressure and continue the infusion"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient is presenting with classic signs of symptomatic intracerebral hemorrhage (sICH) during IV alteplase infusion, which is the most feared complication of thrombolytic therapy occurring in approximately 6-7% of patients. The signs — sudden severe headache, vomiting, rapid neurological deterioration, and new pupil dilation (suggesting uncal herniation from expanding hemorrhage) — demand immediate action. The absolute first priority is to STOP the alteplase infusion immediately. Every additional minute of thrombolytic infusion will worsen the hemorrhage by continuing to lyse clots and prevent hemostasis. There should be zero hesitation in stopping the infusion — no team member should continue the infusion while awaiting physician orders in this clinical scenario. Simultaneously: (1) Obtain STAT CT head to confirm hemorrhage. (2) Draw STAT labs: CBC, fibrinogen, PT/INR, PTT, type and screen. (3) Prepare reversal agents: Cryoprecipitate 10 units (to replace fibrinogen — target >200 mg/dL), tranexamic acid (TXA) 1 g IV over 10 minutes, and platelet transfusion may be considered. (4) Emergent neurosurgical consultation for possible surgical evacuation. (5) Blood pressure management: Reduce SBP to <140 mmHg. (6) Intubation preparation for airway protection if GCS is deteriorating. The emergency nurse plays a critical role in immediately recognizing these signs during the mandatory q15-minute neurological checks during alteplase infusion. Alteplase has a half-life of approximately 4-5 minutes, so its effect diminishes rapidly after discontinuation, but fibrinogen depletion may persist for 24 hours. Completing the infusion, increasing the rate, or merely treating blood pressure without stopping the thrombolytic would be catastrophic.",
    learningObjective: "Recognize symptomatic intracerebral hemorrhage during alteplase infusion and implement the immediate response protocol",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Stroke Complications",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Any neurological deterioration during alteplase = stop infusion FIRST, CT SECOND — do not complete the infusion or wait for imaging",
    clinicalPearls: [
      "sICH during alteplase: ~6-7% incidence",
      "Stop alteplase immediately — half-life is only 4-5 minutes",
      "Reversal: cryoprecipitate (fibrinogen >200), TXA 1 g IV, consider platelets",
      "Neurological checks q15 min during alteplase infusion"
    ],
    safetyNote: "ANY neurological deterioration during alteplase infusion = STOP infusion immediately — this is a nursing-initiated action that should not wait for physician orders",
    distractorRationales: [
      "Completing the infusion would worsen life-threatening hemorrhage",
      "Stopping the infusion immediately is the critical first action",
      "Increasing the infusion rate would be catastrophic",
      "Blood pressure management alone without stopping alteplase is insufficient"
    ],
    lessonLink: "/emergency/lessons/stroke-complications"
  },
  {
    stem: "A 38-year-old female at 36 weeks gestation presents with severe headache, visual disturbances, and a generalized tonic-clonic seizure. Blood pressure is 185/115 mmHg. Urine protein is 3+. What is the first-line medication for seizure control and prevention?",
    options: [
      "IV lorazepam 4 mg followed by phenytoin loading",
      "IV magnesium sulfate 4-6 g loading dose over 15-20 minutes, then 1-2 g/hour maintenance infusion",
      "IV levetiracetam 1500 mg over 15 minutes",
      "IV valproic acid 40 mg/kg loading dose"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with eclampsia — seizures occurring in the setting of preeclampsia (hypertension, proteinuria, and end-organ damage during pregnancy). Magnesium sulfate is the definitive first-line treatment for both treatment and prevention of eclamptic seizures, as established by the landmark Magpie Trial and Eclampsia Trial. The protocol is: (1) Loading dose: 4-6 g IV magnesium sulfate diluted in 100 mL NS, infused over 15-20 minutes. (2) Maintenance infusion: 1-2 g/hour continuous IV infusion. (3) Continue for 24-48 hours after delivery or after the last seizure. Magnesium sulfate works through multiple mechanisms: NMDA receptor antagonism (reduces neuronal excitability), calcium channel blockade (smooth muscle relaxation and vasodilation), and endothelial protection. It is superior to traditional anticonvulsants (phenytoin, diazepam) for eclampsia because it addresses the underlying pathophysiology rather than just suppressing seizures. Monitoring during magnesium infusion is critical. The emergency nurse must assess: (1) Deep tendon reflexes (DTRs) every 1-2 hours — loss of DTRs is the first sign of magnesium toxicity. (2) Respiratory rate — must be >12 breaths/min. (3) Urine output — must be >25-30 mL/hour (magnesium is renally excreted). (4) Therapeutic magnesium level: 4-7 mEq/L. Toxicity progression: DTR loss at 7-10 mEq/L, respiratory depression at 10-13 mEq/L, cardiac arrest at >15 mEq/L. The antidote for magnesium toxicity is calcium gluconate 1 g IV over 3 minutes. Additional management includes IV labetalol or hydralazine for blood pressure control (target <160/110 mmHg) and emergent delivery planning. Valproic acid is teratogenic and contraindicated in pregnancy. Phenytoin is inferior to magnesium sulfate for eclampsia based on clinical trial evidence.",
    learningObjective: "Apply magnesium sulfate as first-line treatment for eclamptic seizures and monitor for toxicity",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Pregnancy-Related Neurological Emergencies",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Magnesium sulfate, NOT traditional anticonvulsants, is first-line for eclampsia; calcium gluconate is the antidote for magnesium toxicity",
    clinicalPearls: [
      "MgSO4 loading: 4-6 g IV over 15-20 min; maintenance: 1-2 g/hr",
      "Monitor: DTRs, respiratory rate >12, urine output >25 mL/hr",
      "Toxicity: DTR loss (7-10 mEq/L) → respiratory depression (10-13) → cardiac arrest (>15)",
      "Antidote: calcium gluconate 1 g IV over 3 minutes"
    ],
    safetyNote: "Keep calcium gluconate at bedside during magnesium infusion — respiratory arrest from toxicity requires immediate reversal",
    distractorRationales: [
      "Benzodiazepines and phenytoin are inferior to MgSO4 for eclampsia",
      "Magnesium sulfate is the evidence-based first-line treatment",
      "Levetiracetam is not standard of care for eclamptic seizures",
      "Valproic acid is teratogenic and contraindicated in pregnancy"
    ],
    lessonLink: "/emergency/lessons/pregnancy-neuro-emergencies"
  },
  {
    stem: "A 70-year-old male presents with acute onset of bilateral ptosis, diplopia, dysarthria, and quadriparesis. He is alert but rapidly deteriorating. CTA reveals acute basilar artery occlusion. What is the time window for intervention and what is the primary treatment?",
    options: [
      "Basilar occlusion has a strict 4.5-hour window for IV alteplase only",
      "Mechanical thrombectomy up to 24 hours from symptom onset may be considered given the high mortality of untreated basilar occlusion",
      "Conservative management with antiplatelet therapy, as basilar occlusion has good outcomes without intervention",
      "Surgical bypass of the basilar artery is the standard of care"
    ],
    correctAnswer: 1,
    rationaleLong: "Acute basilar artery occlusion (BAO) is a neurological emergency with mortality rates of 80-90% without recanalization. The clinical presentation includes bilateral motor deficits (quadriparesis or quadriplegia), cranial nerve palsies (diplopia, ptosis, dysarthria, dysphagia, facial weakness), decreased level of consciousness (due to reticular activating system ischemia in the pons), and in severe cases, locked-in syndrome (awareness with complete motor paralysis except vertical eye movements). The ATTENTION and BASILAR trials provided evidence for endovascular treatment of BAO. The key finding from BASILAR and subsequent studies is that mechanical thrombectomy may be considered in extended time windows (up to 24 hours and sometimes beyond) for BAO, unlike anterior circulation LVO where thrombectomy has a more defined time window. This extended window is justified because: (1) The brainstem has limited collateral blood supply, making every minute critical but also meaning that some tissue may remain viable longer through posterior circulation collaterals. (2) The devastating natural history of untreated BAO (>80% mortality) means the benefit-to-risk ratio favors intervention even in later time windows. (3) CT perfusion and MRI DWI/FLAIR mismatch can identify salvageable tissue beyond traditional time windows. Treatment typically includes IV alteplase (if within 4.5 hours and no contraindications) as a bridge to thrombectomy, followed by mechanical thrombectomy as the definitive treatment. The emergency nurse should prepare for rapid neurological deterioration, airway management (intubation is frequently needed), and facilitate the fastest possible transfer to the neurointerventional suite. Basilar occlusion requires the highest level of urgency — equivalent to or exceeding STEMI activation. Conservative management carries near-certain mortality or devastating disability.",
    learningObjective: "Recognize acute basilar artery occlusion as a life-threatening emergency amenable to mechanical thrombectomy with extended time windows",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Posterior Circulation Stroke",
    difficulty: 5,
    cognitiveLevel: "evaluation",
    questionType: "MCQ_SINGLE",
    examTrap: "Basilar occlusion has an extended thrombectomy window (up to 24 hours) due to the devastating natural history — do not deny intervention based on time alone",
    clinicalPearls: [
      "BAO mortality without treatment: 80-90%",
      "Thrombectomy may be considered up to 24 hours for BAO",
      "Bilateral motor/cranial nerve deficits + decreased consciousness = suspect BAO",
      "Locked-in syndrome: aware but paralyzed except vertical eye movements"
    ],
    safetyNote: "Basilar occlusion requires the highest level of urgency — activate neurointerventional team immediately upon CTA confirmation",
    distractorRationales: [
      "4.5-hour window is for IV alteplase; thrombectomy has extended windows for BAO",
      "Extended thrombectomy window is appropriate for BAO",
      "Conservative management has near-certain mortality in BAO",
      "Surgical bypass is not the standard of care for acute BAO"
    ],
    lessonLink: "/emergency/lessons/posterior-circulation-stroke"
  },
  {
    stem: "A 44-year-old female presents with thunderclap headache, seizure, and left hemiparesis. She is 5 days postpartum. CT head shows a right-sided cortical hemorrhage with surrounding edema. CT venography reveals thrombosis of the superior sagittal sinus. What is the paradoxical treatment for this condition?",
    options: [
      "Emergent surgical evacuation of the hemorrhage with craniectomy",
      "Anticoagulation with IV heparin despite the presence of intracranial hemorrhage",
      "IV tranexamic acid to stabilize the hemorrhagic component",
      "Antiplatelet therapy with aspirin 325 mg and clopidogrel 75 mg"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with cerebral venous sinus thrombosis (CVST), a condition more common in young women, particularly in the postpartum period (risk factors include the hypercoagulable state of pregnancy, dehydration, and hormonal changes). CVST can cause both venous infarction and hemorrhagic transformation due to increased venous pressure preventing adequate drainage. The paradoxical but evidence-based treatment is systemic anticoagulation with IV heparin, even in the presence of intracranial hemorrhage. This is because: (1) The hemorrhage is CAUSED by the venous thrombosis — venous congestion increases intracranial pressure, leading to hemorrhagic venous infarction. Treating the underlying cause (thrombosis) prevents further hemorrhage by restoring venous drainage. (2) The International Study on Cerebral Vein and Dural Sinus Thrombosis (ISCVT) and subsequent guidelines (AHA/ASA 2011, European Stroke Organization) support anticoagulation even with hemorrhagic infarction. (3) Withholding anticoagulation allows thrombus propagation, leading to worsening venous congestion, additional hemorrhage, and potentially fatal brain herniation. The treatment protocol is: (1) IV unfractionated heparin with target aPTT 1.5-2.5x normal (or weight-based LMWH in stable patients). (2) Transition to oral anticoagulation (warfarin with INR target 2-3) for 6-12 months. (3) Monitor neurologically and with repeat imaging. (4) Treat the underlying cause (hypercoagulability workup after acute phase). (5) Manage seizures with anticonvulsants (levetiracetam preferred). (6) Manage elevated ICP if present. Surgical evacuation is not first-line as the hemorrhage is venous in nature and will worsen without treating the underlying thrombosis. Tranexamic acid (an antifibrinolytic) would worsen the thrombosis. Antiplatelet therapy is insufficient for venous thrombosis. The emergency nurse should initiate heparin infusion per protocol, perform frequent neurological checks, and prepare for potential decompression if clinical deterioration occurs despite anticoagulation.",
    learningObjective: "Understand the paradoxical use of anticoagulation in cerebral venous sinus thrombosis even with hemorrhagic transformation",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Cerebrovascular Emergencies",
    difficulty: 5,
    cognitiveLevel: "evaluation",
    questionType: "MCQ_SINGLE",
    examTrap: "CVST with hemorrhage = still anticoagulate — the hemorrhage is CAUSED by the thrombosis; treating the cause prevents further bleeding",
    clinicalPearls: [
      "CVST risk factors: postpartum, OCP, hypercoagulable states, dehydration",
      "Anticoagulate even with hemorrhage — treats the underlying cause",
      "IV heparin → transition to warfarin (INR 2-3) for 6-12 months",
      "Suspect CVST: young woman + headache + seizure + cortical hemorrhage"
    ],
    safetyNote: "Do NOT withhold anticoagulation for CVST-associated hemorrhage — thrombus propagation causes worse hemorrhage and herniation",
    distractorRationales: [
      "Surgical evacuation does not address the underlying thrombosis",
      "Anticoagulation treats the cause and prevents further hemorrhage",
      "Tranexamic acid would worsen the venous thrombosis",
      "Antiplatelet therapy is insufficient for venous sinus thrombosis"
    ],
    lessonLink: "/emergency/lessons/cerebrovascular-emergencies"
  },
  {
    stem: "A 56-year-old male with no significant medical history presents with sudden onset of severe low back pain followed by rapidly progressive bilateral lower extremity weakness, urinary retention, and sensory loss below T10. MRI shows a spinal epidural hematoma from T8 to T11. What is the surgical time window for optimal neurological recovery?",
    options: [
      "Surgery within 24-48 hours provides adequate outcomes",
      "Surgical decompression within 12 hours (ideally <6 hours) of symptom onset for best neurological recovery",
      "Surgery can be deferred if the patient stabilizes clinically on steroids",
      "Endovascular embolization is the preferred treatment over surgical decompression"
    ],
    correctAnswer: 1,
    rationaleLong: "Spinal epidural hematoma (SEH) is a neurosurgical emergency requiring urgent decompressive laminectomy and hematoma evacuation. The prognosis is directly related to the time from symptom onset to surgical decompression and the severity of the neurological deficit at the time of surgery. Evidence consistently shows that surgical decompression within 12 hours of symptom onset is associated with significantly better neurological outcomes, with the best outcomes observed when surgery is performed within 6 hours. Patients who undergo decompression within 6 hours have the highest rates of complete or near-complete neurological recovery (motor and bladder function). After 12 hours, recovery rates decline substantially, and after 24-48 hours with complete motor deficit, the likelihood of meaningful recovery is significantly reduced. SEH can be spontaneous (often associated with anticoagulant use, coagulopathies, or vascular malformations) or secondary to spinal procedures (epidural injections, spinal surgery), trauma, or rarely, severe hypertension. In anticoagulated patients, immediate reversal of anticoagulation is essential in addition to surgery. The clinical presentation typically follows a pattern: (1) Sudden severe back or neck pain (depending on the level), (2) Progressive radiculopathy, (3) Rapidly evolving myelopathy with motor weakness, sensory loss, and autonomic dysfunction (bladder/bowel), (4) Complete paralysis if untreated. The emergency nurse should recognize this as a time-critical emergency similar to acute stroke, facilitate emergent MRI, reverse any anticoagulation, consult neurosurgery immediately, and prepare the patient for emergent operative intervention. Steroids alone do not substitute for surgical decompression in SEH with neurological deficit. Endovascular embolization is used for vascular malformations, not epidural hematomas.",
    learningObjective: "Recognize spinal epidural hematoma as a surgical emergency requiring decompression within 12 hours (ideally <6 hours) for optimal recovery",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Spinal Cord Emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Spinal epidural hematoma: surgery within 6-12 hours for best outcomes; after 24 hours with complete deficit, recovery is unlikely",
    clinicalPearls: [
      "Best outcomes with surgical decompression <6 hours from onset",
      "After 12 hours, neurological recovery rates decline significantly",
      "Reverse anticoagulation immediately if applicable",
      "Classic progression: back pain → radiculopathy → myelopathy → paralysis"
    ],
    safetyNote: "Rapidly progressive bilateral weakness with urinary retention = surgical emergency — do not delay for serial examinations",
    distractorRationales: [
      "24-48 hours is too late for optimal recovery, especially with complete deficit",
      "12 hours (ideally <6) is the evidence-based surgical window",
      "Steroids do not substitute for surgical decompression in SEH",
      "Endovascular embolization is not the treatment for epidural hematoma"
    ],
    lessonLink: "/emergency/lessons/spinal-cord-emergencies"
  },
  {
    stem: "A 32-year-old male presents to the ED after a concussion sustained during a football game 2 hours ago. He was briefly unconscious, is now GCS 15, and CT head is normal. He reports headache, dizziness, and difficulty concentrating. What are the key discharge instructions the emergency nurse should provide?",
    options: [
      "Strict bed rest in a dark room for 2 weeks with no physical or cognitive activity",
      "Graduated return-to-activity protocol with cognitive and physical rest for 24-48 hours followed by stepwise progression, with return precautions for danger signs",
      "Immediate return to full activity including contact sports once symptoms resolve",
      "Prescribe opioid analgesics for headache management and schedule MRI in 1 week"
    ],
    correctAnswer: 1,
    rationaleLong: "Current evidence-based concussion management follows a graduated return-to-activity (RTA) protocol as outlined in the Berlin Consensus Statement on Concussion in Sport (2023). The key principles and discharge instructions include: (1) Initial relative rest period of 24-48 hours: This involves reducing but not eliminating all activity. Prolonged strict bed rest (cocoon therapy) is no longer recommended as it has been shown to delay recovery. Light cognitive activity and gentle walking are acceptable. (2) Graduated Return-to-Activity Protocol (6 steps): Step 1: Symptom-limited activity (daily activities that do not provoke symptoms). Step 2: Light aerobic exercise (walking, swimming — no resistance training). Step 3: Sport-specific exercise (running drills — no head impact). Step 4: Non-contact training drills (more complex drills, may begin resistance training). Step 5: Full contact practice (with medical clearance). Step 6: Return to competition. Each step requires a minimum of 24 hours without symptom exacerbation before progressing to the next step. If symptoms worsen, return to the previous step. (3) Return-to-ED danger signs the nurse must clearly communicate: worsening headache, repeated vomiting, seizures, increasing confusion or unusual behavior, one pupil larger than the other, weakness or numbness, slurred speech, inability to recognize people or places, increasing drowsiness or inability to be awakened, clear fluid from nose or ears. (4) Avoid alcohol, sleep aids, and medications that may mask symptoms. (5) Screen time and cognitive activity should be gradually increased as tolerated. (6) Follow-up with primary care or concussion clinic within 1-2 weeks. The emergency nurse should provide written discharge instructions (patients with concussion may have difficulty retaining verbal information) and ensure a responsible adult will be with the patient for the first 24 hours. Return to contact sports requires medical clearance and completion of the full RTA protocol.",
    learningObjective: "Apply evidence-based concussion discharge instructions including the graduated return-to-activity protocol and danger sign education",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Mild Traumatic Brain Injury",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Prolonged strict bed rest (cocoon therapy) delays concussion recovery — current guidelines recommend 24-48 hours of relative rest followed by graduated activity",
    clinicalPearls: [
      "24-48 hours relative rest, then graduated 6-step return-to-activity protocol",
      "Each step requires 24 hours symptom-free before progression",
      "Provide WRITTEN discharge instructions — concussed patients have poor recall",
      "Return to contact sports requires medical clearance after completing full RTA"
    ],
    safetyNote: "Ensure a responsible adult stays with the concussion patient for first 24 hours and can recognize danger signs requiring ED return",
    distractorRationales: [
      "Prolonged strict bed rest delays recovery and is no longer recommended",
      "Graduated RTA with initial rest and stepwise progression is evidence-based",
      "Immediate return to contact sports risks second impact syndrome",
      "Opioids are not recommended for concussion headache; MRI is not routinely needed"
    ],
    lessonLink: "/emergency/lessons/mild-tbi"
  }
];
