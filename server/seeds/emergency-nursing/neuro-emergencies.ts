import { EmergencyNursingQuestion } from "./types";

export const neuroEmergencyQuestions: EmergencyNursingQuestion[] = [
  {
    stem: "A 68-year-old male presents to the ED with sudden onset right-sided facial droop, right arm weakness, and slurred speech that began 45 minutes ago. His wife confirms the exact time of onset. Using the BE-FAST assessment, which additional symptom should the emergency nurse specifically evaluate that extends beyond the traditional FAST screening?",
    options: [
      "Blood pressure measurement",
      "Balance difficulties and vision changes (Eyes)",
      "Breathing pattern assessment",
      "Blood glucose level"
    ],
    correctAnswer: 1,
    rationaleLong: "The BE-FAST stroke screening tool expands upon the traditional FAST (Face, Arms, Speech, Time) assessment by adding two additional components: B for Balance and E for Eyes. The traditional FAST screening (Face drooping, Arm weakness, Speech difficulty, Time to call 911) is effective for anterior circulation strokes but may miss approximately 14% of posterior circulation strokes that present with balance disturbances, vertigo, and visual changes. BE-FAST addresses this gap: B (Balance) - sudden onset of balance difficulties, dizziness, loss of coordination, or inability to walk. These symptoms suggest posterior circulation stroke involving the cerebellum or brainstem. E (Eyes) - sudden onset of visual disturbances including blurred vision, double vision (diplopia), or visual field cuts (hemianopsia). Posterior circulation strokes involving the occipital lobe or brainstem can cause these visual symptoms without the classic facial droop or arm weakness. By incorporating these additional assessments, the emergency nurse can identify posterior circulation strokes that might otherwise be missed during initial screening. This is particularly important because posterior circulation strokes can be rapidly progressive and life-threatening, involving critical structures such as the brainstem, cerebellum, and occipital lobes. While blood pressure, breathing, and glucose are important assessments in stroke care, they are not specific components of the BE-FAST screening tool. Blood glucose should always be checked to rule out hypoglycemia as a stroke mimic, but this is a laboratory test rather than a clinical screening component.",
    learningObjective: "Apply the BE-FAST stroke screening tool to identify both anterior and posterior circulation strokes",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Stroke Recognition (FAST/BE-FAST)",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Traditional FAST misses ~14% of posterior circulation strokes - BE-FAST adds Balance and Eyes to improve detection",
    clinicalPearls: [
      "BE-FAST: Balance, Eyes, Face, Arms, Speech, Time",
      "Posterior circulation strokes may present without classic facial droop or arm weakness",
      "Dizziness + ataxia + visual changes = consider posterior circulation stroke",
      "Always document exact time of symptom onset or last known well time"
    ],
    safetyNote: "Do not dismiss isolated dizziness and visual changes as benign without considering posterior circulation stroke",
    distractorRationales: [
      "Blood pressure is important but not a BE-FAST component",
      "Breathing assessment is not part of the BE-FAST screening tool",
      "Blood glucose rules out hypoglycemia as a mimic but is not a BE-FAST component"
    ],
    lessonLink: "/emergency/lessons/stroke-recognition"
  },
  {
    stem: "A 72-year-old female with atrial fibrillation (not on anticoagulation) presents to the ED with acute onset left-sided hemiplegia and global aphasia. Symptom onset was 2 hours ago. CT head is negative for hemorrhage. What is the time window for IV alteplase (tPA) administration, and what is the critical time metric?",
    options: [
      "tPA can be given up to 6 hours from symptom onset; door-to-CT time should be within 45 minutes",
      "tPA can be given within 4.5 hours from symptom onset; door-to-needle time should be within 60 minutes",
      "tPA can be given within 3 hours only; door-to-needle time should be within 30 minutes",
      "tPA can be given within 12 hours based on perfusion imaging"
    ],
    correctAnswer: 1,
    rationaleLong: "IV alteplase (tPA) for acute ischemic stroke can be administered within 4.5 hours of symptom onset (or last known well time) in eligible patients. The critical time metric is the door-to-needle (DTN) time, which should be within 60 minutes according to AHA/ASA guidelines. This means from the time the patient arrives at the ED (door) to the time the tPA infusion begins (needle) should be 60 minutes or less. The DTN time encompasses all the steps: initial assessment, CT imaging, interpretation, lab review, consent, and drug preparation. The tPA window was originally established as 3 hours based on the NINDS trial (1995), and was later extended to 4.5 hours based on the ECASS III trial (2008), though with additional exclusion criteria for the 3-4.5 hour window (age >80, severe stroke NIHSS >25, history of both stroke AND diabetes, and oral anticoagulant use regardless of INR). The dose of IV alteplase for stroke is 0.9 mg/kg (maximum 90 mg), with 10% given as an IV bolus over 1 minute and the remaining 90% infused over 60 minutes. The emergency nurse plays a critical role in expediting the DTN time by: activating the stroke team immediately upon patient arrival, obtaining IV access during triage, facilitating rapid CT completion (goal <25 minutes from arrival), drawing blood for labs simultaneously (but not waiting for results unless there is clinical suspicion of abnormality), and having tPA prepared in advance based on estimated weight. Every minute of delay in treatment results in approximately 1.9 million neurons dying, emphasizing the time-critical nature of stroke care.",
    learningObjective: "Apply the 4.5-hour tPA window and 60-minute door-to-needle time target for acute ischemic stroke management",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "TPA Administration Criteria",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "The tPA window is 4.5 hours (not 3 hours) from onset. Additional exclusion criteria apply for the 3-4.5 hour window",
    clinicalPearls: [
      "tPA window: 4.5 hours from symptom onset or last known well",
      "Door-to-needle target: 60 minutes or less",
      "tPA dose: 0.9 mg/kg (max 90 mg); 10% bolus, 90% over 60 minutes",
      "Approximately 1.9 million neurons die per minute of untreated ischemic stroke"
    ],
    safetyNote: "Do not wait for lab results to administer tPA unless there is clinical suspicion of coagulopathy - only a stat glucose is required before treatment",
    distractorRationales: [
      "6 hours is not the tPA window (though thrombectomy may extend to 24 hours with imaging selection)",
      "3 hours was the original NINDS window; ECASS III extended it to 4.5 hours",
      "12 hours is not applicable to IV tPA; extended windows apply to mechanical thrombectomy only"
    ],
    lessonLink: "/emergency/lessons/tpa-administration"
  },
  {
    stem: "A 55-year-old male presents to the ED with the worst headache of his life, sudden onset 30 minutes ago, with associated nausea, vomiting, and neck stiffness. CT head without contrast is normal. What should the emergency nurse anticipate as the next diagnostic step?",
    options: [
      "Discharge the patient with a diagnosis of migraine and prescribe sumatriptan",
      "Lumbar puncture to evaluate for subarachnoid hemorrhage that may not be visible on initial CT",
      "MRI brain with contrast to evaluate for brain tumor",
      "CT angiography of the head only if the patient develops focal neurological deficits"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with a thunderclap headache (sudden onset, worst headache of life) with meningeal signs (neck stiffness, nausea, vomiting), which is the classic presentation of subarachnoid hemorrhage (SAH) until proven otherwise. While CT head without contrast is the initial diagnostic test of choice and has high sensitivity for SAH when performed within 6 hours of onset (approximately 98-100% sensitivity), its sensitivity decreases over time (93% at 12 hours, dropping further after 24 hours). A normal CT does not definitively exclude SAH, particularly when there is a small amount of bleeding that may not be visible on CT. When the clinical suspicion for SAH is high and the CT is negative, a lumbar puncture (LP) is the next diagnostic step. The LP evaluates for xanthochromia (yellow discoloration of CSF from bilirubin produced by hemoglobin degradation, which takes 6-12 hours to develop) and elevated red blood cell counts that do not clear between sequential tubes (differentiating true SAH from traumatic LP). Some centers are now using CT angiography (CTA) as an alternative to LP in CT-negative suspected SAH, as CTA can identify aneurysms that could be the source of bleeding. This approach is increasingly accepted but LP remains the standard in many practice settings. Discharging this patient with a migraine diagnosis would be dangerous, as missed SAH has approximately 50% mortality from rebleeding. MRI is not the appropriate next step for acute SAH evaluation. The emergency nurse should prepare an LP tray, assist with patient positioning, and ensure that opening pressure is measured and that CSF is sent for cell count, protein, glucose, and xanthochromia analysis.",
    learningObjective: "Recognize the need for lumbar puncture when CT is negative in suspected subarachnoid hemorrhage",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Headache Red Flags",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "A normal CT does NOT rule out SAH, especially >6 hours from onset. LP is needed when clinical suspicion remains high",
    clinicalPearls: [
      "CT sensitivity for SAH: ~98-100% within 6 hours, decreasing over time",
      "LP evaluates for xanthochromia (takes 6-12 hours to develop) and RBCs",
      "Thunderclap headache = SAH until proven otherwise",
      "CTA can identify aneurysms and is increasingly used as LP alternative"
    ],
    safetyNote: "Never discharge a thunderclap headache without ruling out SAH - missed SAH has ~50% mortality from rebleeding",
    distractorRationales: [
      "Discharging with migraine diagnosis without ruling out SAH is dangerous",
      "MRI is not the standard next step for acute SAH workup",
      "CTA should not be delayed until focal deficits develop"
    ],
    lessonLink: "/emergency/lessons/headache-red-flags"
  },
  {
    stem: "A 45-year-old female presents to the ED with sudden onset of right-sided weakness and aphasia. CT head is negative for hemorrhage. NIHSS score is 18. Time of onset was 2 hours ago. CT angiography reveals a left middle cerebral artery (MCA) occlusion. Which reperfusion strategy provides the best outcome for this patient?",
    options: [
      "IV tPA alone without mechanical intervention",
      "IV tPA followed by endovascular mechanical thrombectomy (bridging therapy)",
      "Mechanical thrombectomy alone without IV tPA",
      "IV heparin anticoagulation only"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has a large vessel occlusion (LVO) - left MCA occlusion - causing a significant acute ischemic stroke (NIHSS 18, which indicates a severe stroke). The optimal reperfusion strategy is bridging therapy: IV tPA administration followed by endovascular mechanical thrombectomy. This approach provides the benefits of both treatments. IV tPA is administered first because it can begin dissolving the clot immediately while the patient is being prepared for thrombectomy, and it has a faster initiation time than organizing the neurointerventional team. tPA alone successfully recanalizes large vessel occlusions in only about 4-8% of cases, which is why thrombectomy is essential for LVO. Mechanical thrombectomy using stent retrievers or aspiration devices achieves recanalization rates of 80-90% in large vessel occlusions and has been shown in multiple landmark trials (MR CLEAN, ESCAPE, EXTEND-IA, SWIFT PRIME, REVASCAT) to dramatically improve functional outcomes. The AHA/ASA guidelines recommend thrombectomy for patients with: (1) LVO in the anterior circulation (ICA or M1 segment of MCA); (2) NIHSS >=6; (3) Pre-stroke mRS 0-1 (functional independence); (4) Within 6 hours of onset (or up to 24 hours with favorable perfusion imaging). The patient should receive IV tPA if within the 4.5-hour window AND proceed to thrombectomy - these are complementary, not competing, strategies. The emergency nurse should administer tPA while simultaneously coordinating patient transfer to the neurointerventional suite. IV heparin alone does not achieve acute reperfusion.",
    learningObjective: "Implement bridging therapy (IV tPA + mechanical thrombectomy) for large vessel occlusion acute ischemic stroke",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Ischemic vs Hemorrhagic Stroke",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "tPA alone recanalizes LVO in only 4-8% of cases - thrombectomy is essential for large vessel occlusions",
    clinicalPearls: [
      "Bridging therapy: tPA + thrombectomy provides the best outcomes for LVO",
      "Thrombectomy window: 6 hours standard, up to 24 hours with perfusion imaging",
      "tPA recanalizes LVO in only 4-8%; thrombectomy achieves 80-90% recanalization",
      "NIHSS >=6 with LVO = strong thrombectomy candidate"
    ],
    safetyNote: "Do not delay tPA administration while arranging thrombectomy - start tPA immediately and transfer to neurointerventional suite simultaneously",
    distractorRationales: [
      "tPA alone is insufficient for LVO with only 4-8% recanalization rate",
      "Thrombectomy alone without tPA misses the opportunity for early clot dissolution",
      "Heparin does not achieve acute reperfusion of an occluded vessel"
    ],
    lessonLink: "/emergency/lessons/stroke-recognition"
  },
  {
    stem: "A 30-year-old male presents to the ED with a tonic-clonic seizure that has been ongoing for 8 minutes upon arrival. EMS has administered midazolam 10 mg IM en route. The seizure continues. What is the next appropriate intervention?",
    options: [
      "Administer another dose of midazolam 10 mg IM and wait 10 minutes",
      "Administer IV lorazepam 4 mg (or repeat dose of IV benzodiazepine) and prepare second-line antiepileptic drug",
      "Immediately intubate the patient for airway protection",
      "Obtain a CT scan of the head before any further treatment"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient is in status epilepticus (SE), defined as a seizure lasting more than 5 minutes or multiple seizures without return to baseline between events. With the seizure ongoing for 8 minutes despite pre-hospital benzodiazepine administration, the patient requires urgent escalation of treatment. According to the Neurocritical Care Society and AAN guidelines for status epilepticus management, the treatment follows a tiered approach: FIRST-LINE (0-5 minutes): Benzodiazepines - IV lorazepam 0.1 mg/kg (max 4 mg, may repeat once) or IM midazolam 10 mg or diazepam 10 mg IV. If the first-line benzodiazepine has been given and the seizure continues, a second dose should be administered if not already given. SECOND-LINE (5-20 minutes): If seizures persist after adequate benzodiazepine dosing, a second-line antiepileptic drug should be administered: IV fosphenytoin 20 mg PE/kg (preferred over phenytoin due to fewer infusion-related side effects), IV valproate sodium 40 mg/kg, or IV levetiracetam 60 mg/kg. Each of these has different advantages depending on the clinical situation. THIRD-LINE (>20 minutes): Refractory SE - requires continuous infusion of midazolam, propofol, or pentobarbital with continuous EEG monitoring, typically requiring intubation and ICU admission. Since this patient received IM midazolam from EMS, the next step should include IV lorazepam (a different benzodiazepine via a different route) and immediate preparation of a second-line agent. Intubation may become necessary but should not delay anti-seizure medication administration. CT should not delay treatment of ongoing seizures.",
    learningObjective: "Apply the tiered treatment algorithm for status epilepticus including first-line benzodiazepines and second-line antiepileptic drugs",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Seizure Management and Status Epilepticus",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Status epilepticus: seizure >5 minutes. Benzodiazepine failure requires escalation to second-line agents (fosphenytoin, valproate, or levetiracetam), not just more benzodiazepines",
    clinicalPearls: [
      "SE definition: seizure >5 min or multiple seizures without return to baseline",
      "First-line: benzodiazepines (lorazepam IV, midazolam IM)",
      "Second-line: fosphenytoin 20 PE/kg, valproate 40 mg/kg, or levetiracetam 60 mg/kg",
      "Refractory SE (>20 min): continuous infusion + intubation + EEG monitoring"
    ],
    safetyNote: "Every minute of ongoing status epilepticus increases the risk of brain injury, aspiration, and death - treat aggressively without delay",
    distractorRationales: [
      "Repeating the same dose of the same benzodiazepine without escalation may be insufficient",
      "Intubation should not delay anti-seizure medication administration",
      "CT should never delay treatment of active status epilepticus"
    ],
    lessonLink: "/emergency/lessons/seizure-management"
  },
  {
    stem: "A 22-year-old college student presents to the ED with severe headache, high fever (39.8C), neck stiffness, and photophobia. Petechial rash is noted on the trunk and extremities. The patient's level of consciousness is deteriorating. What should the emergency nurse prioritize?",
    options: [
      "Obtain blood cultures, then CT head, then lumbar puncture, then start antibiotics",
      "Obtain blood cultures and immediately administer empiric IV antibiotics (ceftriaxone + vancomycin + dexamethasone) without delaying for CT or LP",
      "Perform lumbar puncture first to confirm the diagnosis before starting antibiotics",
      "Administer acetaminophen for fever and observe for 2 hours before deciding on antibiotics"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with classic signs of bacterial meningitis: severe headache, high fever, neck stiffness (meningismus), photophobia, and a petechial rash (which is particularly concerning for Neisseria meningitidis/meningococcal meningitis). The deteriorating level of consciousness indicates this is a rapidly progressive, life-threatening infection. In suspected bacterial meningitis, the absolute priority is rapid administration of empiric IV antibiotics. The mortality rate for bacterial meningitis increases significantly with every hour of delay in antibiotic administration. The recommended approach is: (1) Obtain blood cultures IMMEDIATELY (takes 2 minutes and should not delay antibiotics); (2) Administer empiric antibiotics without waiting for CT or LP results. For community-acquired meningitis in adults: IV ceftriaxone 2g + IV vancomycin 15-20 mg/kg + IV dexamethasone 0.15 mg/kg (given 15-20 minutes before or concurrently with first antibiotic dose to reduce inflammatory response and improve neurological outcomes); (3) After antibiotics are started, proceed with CT head if indicated (focal neurological deficits, altered consciousness, papilledema, immunocompromised, seizures) followed by LP when safe; (4) LP should be performed when feasible to confirm diagnosis and guide antibiotic adjustment, but CSF cultures remain positive for hours after antibiotic initiation. The petechial rash is highly suggestive of meningococcal disease, which can progress to fulminant sepsis and DIC within hours. The emergency nurse should also initiate droplet isolation precautions and notify infection control for contact prophylaxis of close contacts with rifampin, ciprofloxacin, or ceftriaxone.",
    learningObjective: "Prioritize immediate empiric antibiotic administration in suspected bacterial meningitis without delaying for diagnostic studies",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Meningitis",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER delay antibiotics for CT or LP in suspected bacterial meningitis - every hour of delay increases mortality",
    clinicalPearls: [
      "Antibiotics FIRST in meningitis - do not delay for imaging or LP",
      "Empiric: ceftriaxone + vancomycin + dexamethasone (adults)",
      "Petechial rash = high suspicion for N. meningitidis",
      "Dexamethasone should be given before or with first antibiotic dose"
    ],
    safetyNote: "Initiate droplet isolation precautions for suspected meningococcal meningitis and arrange post-exposure prophylaxis for close contacts",
    distractorRationales: [
      "Delaying antibiotics for CT and LP increases mortality significantly",
      "LP before antibiotics wastes critical time in a deteriorating patient",
      "Observing without treatment for suspected bacterial meningitis is negligent"
    ],
    lessonLink: "/emergency/lessons/meningitis-management"
  },
  {
    stem: "A 58-year-old male with a history of hypertension presents to the ED with sudden onset severe headache, vomiting, and right-sided hemiparesis. CT head reveals a 3 cm left basal ganglia intracerebral hemorrhage (ICH). BP is 198/112 mmHg. What blood pressure target should the emergency nurse anticipate for this patient?",
    options: [
      "Rapidly reduce SBP to 120 mmHg within 30 minutes",
      "Reduce SBP to below 140 mmHg within 1 hour per current guidelines",
      "Maintain SBP at current level to ensure cerebral perfusion",
      "Reduce SBP to 160 mmHg only if the patient develops signs of herniation"
    ],
    correctAnswer: 1,
    rationaleLong: "Current AHA/ASA guidelines for spontaneous intracerebral hemorrhage (ICH) recommend reducing systolic blood pressure to below 140 mmHg within 1 hour of presentation, provided the initial SBP is between 150-220 mmHg. This recommendation is based on the INTERACT2 trial and subsequent studies showing that intensive blood pressure lowering (target SBP <140 mmHg) in acute ICH is safe and may improve functional outcomes by reducing hematoma expansion. Hematoma expansion occurs in approximately 30-40% of ICH patients within the first few hours and is a major predictor of poor outcome. Elevated blood pressure directly contributes to hematoma expansion and worsening of perihematomal edema. The preferred IV antihypertensive agents for acute ICH include: nicardipine infusion (5-15 mg/hr) for its smooth, titratable blood pressure control; clevidipine infusion (1-2 mg/hr initial); or labetalol (10-20 mg IV bolus, repeated or as infusion). IV nitroprusside should be avoided as it can increase intracranial pressure. The emergency nurse should establish an arterial line for continuous blood pressure monitoring and use an IV infusion pump for precise antihypertensive titration. Rapidly reducing SBP to 120 mmHg may be too aggressive and could compromise cerebral perfusion, particularly in patients with chronic hypertension and shifted autoregulation curves. Maintaining the current elevated pressure promotes continued hematoma expansion. Waiting for herniation signs before treating blood pressure is too late and results in worse outcomes. Blood pressure should be controlled proactively in acute ICH.",
    learningObjective: "Implement blood pressure management for acute intracerebral hemorrhage targeting SBP <140 mmHg within 1 hour",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Ischemic vs Hemorrhagic Stroke",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "ICH BP target: SBP <140 mmHg within 1 hour. This is MORE aggressive than ischemic stroke BP management",
    clinicalPearls: [
      "ICH BP target: SBP <140 mmHg within 1 hour",
      "Hematoma expansion occurs in 30-40% of patients in first hours",
      "Preferred agents: nicardipine or clevidipine infusion (titratable)",
      "Avoid nitroprusside (increases ICP) and rapid drops below 120 mmHg"
    ],
    safetyNote: "Use arterial line monitoring for precise BP control in ICH - cuff measurements may be inaccurate with frequent changes",
    distractorRationales: [
      "SBP 120 may be too aggressive and compromise cerebral perfusion",
      "Maintaining elevated BP promotes hematoma expansion",
      "Waiting for herniation to treat BP results in worse outcomes"
    ],
    lessonLink: "/emergency/lessons/hemorrhagic-stroke"
  },
  {
    stem: "A patient is brought to the ED by family who report progressively worsening confusion over 3 days. The patient has a history of diabetes, chronic kidney disease, and recent UTI treatment. GCS is 12 (E3V4M5). Vital signs: BP 142/88, HR 92, RR 18, Temp 37.4C, glucose 248 mg/dL. Which initial assessment tool should the emergency nurse use to systematically evaluate the altered mental status?",
    options: [
      "Cincinnati Stroke Scale only",
      "AEIOU-TIPS mnemonic for systematic evaluation of altered mental status causes",
      "Mini-Mental State Examination (MMSE)",
      "HEART score assessment"
    ],
    correctAnswer: 1,
    rationaleLong: "When evaluating a patient with altered mental status (AMS) in the emergency department, the AEIOU-TIPS mnemonic provides a systematic framework to identify reversible and life-threatening causes. AMS has a vast differential diagnosis, and this mnemonic ensures critical causes are not overlooked: A - Alcohol/Acidosis: Acute intoxication, withdrawal, DKA, metabolic acidosis. E - Epilepsy/Electrolytes/Encephalopathy: Post-ictal state, status epilepticus, hypo/hypernatremia, hepatic encephalopathy, uremic encephalopathy. I - Insulin (glucose abnormalities): Hypoglycemia, DKA, HHS (hyperosmolar hyperglycemic state). O - Overdose/Oxygen: Drug overdose, carbon monoxide poisoning, hypoxemia. U - Uremia: Renal failure with uremic encephalopathy. T - Trauma/Temperature: Traumatic brain injury, hypothermia, hyperthermia. I - Infection: Meningitis, encephalitis, sepsis, UTI (especially in elderly). P - Psychiatric/Poisoning: Acute psychosis, toxic ingestion. S - Stroke/Seizure/Shock: Acute stroke, non-convulsive status epilepticus, cardiogenic or hypovolemic shock. For this specific patient, multiple potential causes should be investigated: uremic encephalopathy (CKD), hyperglycemia/DKA/HHS (diabetes with glucose 248), persistent infection (recent UTI), and metabolic derangements. The Cincinnati Stroke Scale evaluates for stroke specifically but does not systematically address the broad differential of AMS. The MMSE is designed for cognitive assessment in outpatient settings, not acute ED evaluation. The HEART score is for chest pain risk stratification. The emergency nurse should obtain a stat glucose, BMP (electrolytes, BUN, creatinine), blood gas, urinalysis, blood cultures, and consider CT head to systematically work through the AEIOU-TIPS causes.",
    learningObjective: "Apply the AEIOU-TIPS mnemonic for systematic evaluation of altered mental status in the emergency department",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Altered Mental Status Assessment",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "AMS has a vast differential - use AEIOU-TIPS to avoid anchoring on a single diagnosis and missing reversible causes",
    clinicalPearls: [
      "AEIOU-TIPS: Alcohol, Epilepsy, Insulin, Overdose, Uremia, Trauma, Infection, Psychiatric, Stroke",
      "Always check glucose immediately in any AMS patient",
      "UTI is a common cause of AMS in elderly patients",
      "Consider multiple concurrent causes, especially in patients with multiple comorbidities"
    ],
    safetyNote: "Check blood glucose STAT in all altered mental status patients - hypoglycemia is immediately reversible and can mimic stroke",
    distractorRationales: [
      "Cincinnati Stroke Scale only evaluates for stroke, not the broad AMS differential",
      "MMSE is for outpatient cognitive screening, not acute ED evaluation",
      "HEART score is for chest pain risk stratification, not AMS evaluation"
    ],
    lessonLink: "/emergency/lessons/altered-mental-status"
  },
  {
    stem: "A 65-year-old male with a history of atrial fibrillation on warfarin presents with sudden onset severe headache and progressive left-sided weakness over 1 hour. INR is 3.8. CT head reveals a large right hemispheric intracerebral hemorrhage with midline shift. What is the priority intervention for this anticoagulant-associated ICH?",
    options: [
      "Administer vitamin K 10 mg IV and wait for INR to normalize",
      "Administer 4-factor prothrombin complex concentrate (PCC) for immediate INR reversal along with vitamin K 10 mg IV",
      "Hold warfarin and allow the INR to naturally decrease over 3-5 days",
      "Administer fresh frozen plasma (FFP) as the first-line reversal agent"
    ],
    correctAnswer: 1,
    rationaleLong: "Anticoagulant-associated intracerebral hemorrhage (ICH) is a life-threatening emergency requiring immediate reversal of anticoagulation to limit hematoma expansion. For warfarin-associated ICH, the current AHA/ASA guidelines recommend 4-factor prothrombin complex concentrate (4F-PCC, such as Kcentra or Octaplex) as the first-line reversal agent, combined with IV vitamin K 10 mg. 4F-PCC provides immediate reversal (within 15-30 minutes) by supplying the vitamin K-dependent clotting factors (II, VII, IX, X) and proteins C and S. The target INR is <1.4, which should be achieved within 1 hour. Vitamin K is given concurrently because its effects take 12-24 hours to manifest, and it provides sustained reversal after the short-acting PCC wears off. Without vitamin K, the INR may rebound as the PCC factors are consumed. Fresh frozen plasma (FFP) was previously used for warfarin reversal but is now considered inferior to PCC for several reasons: (1) FFP requires thawing time (30-45 minutes); (2) Large volumes are needed (15-20 mL/kg, typically 4-6 units), risking TACO; (3) Slower time to INR reversal; (4) Incomplete INR correction in many cases. Simply holding warfarin and allowing natural INR decline is inappropriate for life-threatening hemorrhage, as it takes 3-5 days and the patient could die from hematoma expansion in the interim. Vitamin K alone takes 12-24 hours for full effect, which is far too slow for acute ICH management. The emergency nurse should administer PCC based on the INR level and body weight, give concurrent vitamin K 10 mg IV (slowly over 20 minutes due to anaphylactoid risk), recheck INR 15-30 minutes after PCC, and prepare for potential neurosurgical intervention.",
    learningObjective: "Implement rapid INR reversal with 4-factor PCC and vitamin K for warfarin-associated intracerebral hemorrhage",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Ischemic vs Hemorrhagic Stroke",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "PCC reverses INR in 15-30 minutes vs FFP taking 2+ hours. Always give vitamin K concurrently to prevent INR rebound",
    clinicalPearls: [
      "4F-PCC is first-line for warfarin-associated ICH reversal (reverses in 15-30 min)",
      "Give vitamin K 10 mg IV concurrently for sustained reversal (effect in 12-24 hrs)",
      "Target INR <1.4 within 1 hour",
      "FFP is inferior: slow, large volume, incomplete correction"
    ],
    safetyNote: "Administer IV vitamin K slowly over 20 minutes due to risk of anaphylactoid reaction - do not give IV push",
    distractorRationales: [
      "Vitamin K alone takes 12-24 hours - too slow for life-threatening ICH",
      "Waiting for natural INR decline takes days and risks fatal hematoma expansion",
      "FFP is slower, requires large volumes, and provides incomplete reversal"
    ],
    lessonLink: "/emergency/lessons/hemorrhagic-stroke"
  },
  {
    stem: "A 40-year-old female presents to the ED with progressive bilateral leg weakness and numbness ascending from the feet over 3 days. She had a respiratory infection 2 weeks ago. Deep tendon reflexes are absent in the lower extremities. Vital signs: BP 128/74, HR 88, RR 20. The emergency nurse should be most concerned about which potential life-threatening complication?",
    options: [
      "Development of deep vein thrombosis from immobility",
      "Ascending respiratory failure from diaphragmatic weakness requiring intubation",
      "Urinary retention requiring catheterization",
      "Autonomic dysreflexia causing hypertensive crisis"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with Guillain-Barre syndrome (GBS), an acute inflammatory demyelinating polyneuropathy that classically presents with ascending symmetrical weakness and areflexia following a preceding infection (most commonly Campylobacter jejuni gastroenteritis or upper respiratory infection). The most life-threatening complication of GBS is ascending respiratory failure. As the demyelinating process ascends from the lower extremities to involve the intercostal muscles and diaphragm, the patient can develop rapidly progressive respiratory failure requiring emergent intubation and mechanical ventilation. Approximately 25-30% of GBS patients require mechanical ventilation. The emergency nurse must perform frequent respiratory assessments using serial measurements of: (1) Forced vital capacity (FVC) - the most sensitive indicator; intubation is recommended when FVC falls below 20 mL/kg or is rapidly declining (the '20/30/40 rule': FVC <20 mL/kg, maximum inspiratory pressure (MIP) less negative than -30 cmH2O, maximum expiratory pressure (MEP) <40 cmH2O); (2) Negative inspiratory force (NIF/MIP); (3) Single-breath count (normal >25, concerning <15); (4) Subjective dyspnea. Respiratory failure in GBS can be sudden and precipitous. SpO2 monitoring alone is insufficient because it is a late indicator of respiratory failure - oxygen saturation may remain normal until the patient is critically hypoventilating. The patient should be admitted to an ICU-level of care with continuous respiratory monitoring. While DVT, urinary retention, and autonomic dysfunction are all complications of GBS, respiratory failure is the most immediately life-threatening and the primary cause of mortality. Treatment for GBS includes IV immunoglobulin (IVIg) or plasmapheresis.",
    learningObjective: "Monitor for ascending respiratory failure in Guillain-Barre syndrome using serial forced vital capacity measurements",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Spinal Cord Syndromes",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "SpO2 is a LATE indicator of respiratory failure in GBS - serial FVC measurements are essential. 25-30% of GBS patients need intubation",
    clinicalPearls: [
      "20/30/40 rule for intubation: FVC <20 mL/kg, MIP <-30, MEP <40",
      "Serial FVC q2-4 hours is essential - SpO2 is a late indicator",
      "25-30% of GBS patients require mechanical ventilation",
      "Treatment: IVIg or plasmapheresis (not both together)"
    ],
    safetyNote: "Keep intubation equipment at bedside for all GBS patients - respiratory deterioration can be sudden and unpredictable",
    distractorRationales: [
      "DVT is a complication of immobility but not the most immediately life-threatening",
      "Urinary retention requires catheterization but is not acutely life-threatening",
      "Autonomic dysreflexia is associated with spinal cord injury above T6, not GBS"
    ],
    lessonLink: "/emergency/lessons/spinal-cord-syndromes"
  },
  {
    stem: "A 75-year-old male presents to the ED with sudden onset of vertigo, nausea, vomiting, and inability to walk. He also has difficulty swallowing and hoarseness. His right pupil is miotic (constricted) and he has right-sided facial numbness with left-sided body numbness. What neurological syndrome does this presentation suggest?",
    options: [
      "Benign paroxysmal positional vertigo (BPPV)",
      "Lateral medullary syndrome (Wallenberg syndrome) - a posterior circulation stroke",
      "Vestibular neuritis",
      "Meniere's disease"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with lateral medullary syndrome (Wallenberg syndrome), caused by occlusion of the posterior inferior cerebellar artery (PICA) or the vertebral artery, resulting in infarction of the lateral medulla. This is one of the most commonly tested posterior circulation stroke syndromes. The classic findings include: (1) Vertigo, nausea, vomiting, and nystagmus - from vestibular nucleus involvement; (2) Dysphagia (difficulty swallowing) and hoarseness - from nucleus ambiguus involvement (cranial nerves IX and X); (3) Ipsilateral Horner syndrome - miotic (constricted) pupil, ptosis, and anhidrosis from descending sympathetic tract involvement; (4) Crossed sensory findings - ipsilateral facial numbness (descending trigeminal tract, cranial nerve V) and contralateral body numbness (spinothalamic tract); (5) Ipsilateral cerebellar ataxia - from inferior cerebellar peduncle involvement. The crossed sensory pattern (same-side face, opposite-side body) is the hallmark of lateral medullary syndrome and is critical for differentiating this from other causes of vertigo. BPPV causes brief positional vertigo without neurological deficits. Vestibular neuritis causes isolated vertigo without cranial nerve deficits or crossed sensory findings. Meniere's disease causes episodic vertigo with hearing loss and tinnitus. The emergency nurse must recognize that vertigo with ANY neurological deficit requires stroke evaluation. The HINTS exam (Head Impulse, Nystagmus, Test of Skew) can help differentiate peripheral from central vertigo at the bedside. This patient needs emergent brain MRI (CT has low sensitivity for posterior fossa strokes) and CTA to evaluate the posterior circulation, with consideration for thrombolysis or thrombectomy if within the treatment window.",
    learningObjective: "Identify lateral medullary syndrome (Wallenberg syndrome) as a posterior circulation stroke with crossed sensory findings",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Neurological Assessment in ED",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Crossed sensory findings (ipsilateral face + contralateral body numbness) are pathognomonic for lateral medullary syndrome - never benign",
    clinicalPearls: [
      "Wallenberg syndrome: PICA or vertebral artery occlusion -> lateral medulla infarction",
      "Crossed sensory pattern: ipsilateral face + contralateral body numbness",
      "Ipsilateral Horner syndrome (miosis, ptosis, anhidrosis) is classic",
      "HINTS exam differentiates central from peripheral causes of vertigo"
    ],
    safetyNote: "Vertigo with ANY neurological deficit (cranial nerve, motor, sensory) is a stroke until proven otherwise - do not dismiss as benign vertigo",
    distractorRationales: [
      "BPPV does not cause cranial nerve deficits or crossed sensory findings",
      "Vestibular neuritis causes isolated vertigo without focal neurological signs",
      "Meniere's disease has episodic pattern with hearing loss, not crossed sensory findings"
    ],
    lessonLink: "/emergency/lessons/stroke-recognition"
  },
  {
    stem: "A 28-year-old female presents to the ED with the sudden onset of the worst headache of her life while exercising. She is alert but photophobic with severe neck stiffness. CT head shows diffuse subarachnoid blood. CT angiography reveals a 7 mm anterior communicating artery aneurysm. What is the most critical concern in the first 24 hours that the emergency nurse should monitor for?",
    options: [
      "Vasospasm causing delayed cerebral ischemia",
      "Rebleeding from the ruptured aneurysm, which carries 70% mortality",
      "Hydrocephalus requiring external ventricular drain placement",
      "Seizure activity requiring prophylactic anticonvulsant therapy"
    ],
    correctAnswer: 1,
    rationaleLong: "In the first 24 hours after aneurysmal subarachnoid hemorrhage (aSAH), the most critical concern is REBLEEDING from the ruptured aneurysm. Rebleeding occurs in approximately 4-14% of patients within the first 24 hours if the aneurysm is not secured, and it carries a devastating mortality rate of approximately 70%. The risk of rebleeding is highest in the first 6-12 hours after the initial hemorrhage. Because of this extremely high mortality, securing the aneurysm (either by endovascular coiling or surgical clipping) should be performed as early as possible, ideally within 24 hours of presentation. Until the aneurysm is secured, the emergency nurse must implement strict measures to reduce rebleeding risk: (1) Blood pressure control - target SBP <160 mmHg using IV nicardipine or labetalol; (2) Minimize stimulation - quiet environment, dim lights, stool softeners, anti-emetics; (3) Pain management - adequate analgesia to prevent hypertensive spikes from pain; (4) Seizure prevention - many institutions use short-term prophylactic anticonvulsants; (5) Strict bed rest with head of bed elevated 30 degrees; (6) Avoid Valsalva maneuvers (coughing, straining). While vasospasm is a major cause of morbidity and mortality in SAH, it typically occurs between days 3-14 (peaking days 7-10) and is not the primary concern in the first 24 hours. Nimodipine 60 mg PO every 4 hours should be started within 96 hours for vasospasm prophylaxis. Hydrocephalus can develop acutely but is less immediately lethal than rebleeding. Seizure prophylaxis is important but secondary to preventing rebleeding.",
    learningObjective: "Prioritize rebleeding prevention as the most critical concern in the first 24 hours after aneurysmal subarachnoid hemorrhage",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Headache Red Flags",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Vasospasm peaks at days 7-10. In the FIRST 24 hours, rebleeding (70% mortality) is the primary concern before the aneurysm is secured",
    clinicalPearls: [
      "Rebleeding risk highest in first 6-12 hours; 70% mortality",
      "Aneurysm should be secured (coil/clip) within 24 hours of presentation",
      "BP target <160 mmHg until aneurysm is secured",
      "Vasospasm occurs days 3-14, peaking days 7-10; prophylax with nimodipine"
    ],
    safetyNote: "Minimize all stimulation and Valsalva maneuvers before aneurysm is secured - any BP spike increases rebleeding risk",
    distractorRationales: [
      "Vasospasm is days 3-14 concern, not the first 24 hours",
      "Hydrocephalus is important but less immediately lethal than rebleeding",
      "Seizure prophylaxis is secondary to rebleeding prevention"
    ],
    lessonLink: "/emergency/lessons/headache-red-flags"
  },
  {
    stem: "A patient arrives in the ED with acute stroke symptoms. The last known well time was 8 hours ago. CT head shows no hemorrhage, but CT perfusion imaging reveals a large area of ischemic penumbra (salvageable tissue) with a small infarct core. What does this imaging information indicate about treatment options?",
    options: [
      "The patient cannot receive any reperfusion therapy because the tPA window has closed",
      "The patient may be a candidate for mechanical thrombectomy up to 24 hours based on favorable perfusion imaging despite being outside the tPA window",
      "The patient should receive IV tPA at 8 hours since there is salvageable tissue",
      "The patient requires only aspirin and statin therapy"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient is outside the IV tPA window (4.5 hours) but may be a candidate for mechanical thrombectomy based on advanced perfusion imaging. The landmark DAWN and DEFUSE 3 trials demonstrated that patients with large vessel occlusion (LVO) stroke can benefit from thrombectomy up to 24 hours from last known well time, IF perfusion imaging shows a favorable mismatch between the area of irreversible infarction (core) and the area of at-risk but potentially salvageable tissue (penumbra). The concept of the ischemic penumbra is central to modern stroke care. The penumbra represents brain tissue that is ischemic but not yet infarcted, maintained by collateral blood flow. This tissue is at risk of progressing to infarction if blood flow is not restored but can be salvaged with timely reperfusion. When CT or MR perfusion imaging shows a small infarct core but a large penumbra (mismatch), it indicates significant tissue that can still be saved with thrombectomy, even many hours after symptom onset. The DAWN trial criteria include: (1) Age >=80: core <21 mL and NIHSS >=10; (2) Age <80: core <31 mL and NIHSS >=10, or core <51 mL and NIHSS >=20. IV tPA should NOT be given beyond 4.5 hours from last known well time, regardless of imaging findings. Aspirin and statin therapy alone would be insufficient when there is significant salvageable tissue and a large vessel occlusion amenable to thrombectomy. The emergency nurse should facilitate rapid transfer to a comprehensive stroke center capable of thrombectomy and ensure all imaging is transmitted with the patient.",
    learningObjective: "Apply perfusion imaging-based patient selection criteria for mechanical thrombectomy in the extended time window (up to 24 hours)",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Ischemic vs Hemorrhagic Stroke",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "tPA window closes at 4.5 hours, but thrombectomy can be performed up to 24 hours with favorable perfusion imaging (DAWN/DEFUSE 3 criteria)",
    clinicalPearls: [
      "DAWN/DEFUSE 3: thrombectomy up to 24 hours with perfusion mismatch",
      "Small core + large penumbra = favorable for late thrombectomy",
      "tPA window: 4.5 hours (does not extend with perfusion imaging)",
      "Transfer to comprehensive stroke center for thrombectomy capability"
    ],
    safetyNote: "Do not give tPA beyond 4.5 hours even with favorable imaging - extended window applies only to mechanical thrombectomy",
    distractorRationales: [
      "Thrombectomy can be offered up to 24 hours with favorable imaging",
      "tPA should NOT be given beyond 4.5 hours regardless of imaging",
      "Aspirin alone is insufficient when salvageable tissue and treatable LVO exist"
    ],
    lessonLink: "/emergency/lessons/stroke-recognition"
  },
  {
    stem: "A 19-year-old male is brought to the ED after a motorcycle accident. He has a GCS of 7 (E2V1M4), unequal pupils (right 6mm fixed, left 3mm reactive), and decorticate posturing on the left side. These findings suggest what neurological emergency?",
    options: [
      "Concussion with temporary loss of consciousness",
      "Uncal herniation with compression of the right CN III, requiring emergent intervention",
      "Diffuse axonal injury without mass effect",
      "Bilateral subdural hematomas with equal brain compression"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with clinical signs of uncal (transtentorial) herniation, which is a life-threatening neurological emergency. The key findings are: (1) Severely depressed GCS of 7 (GCS <=8 requires intubation for airway protection); (2) Unilateral fixed dilated pupil - the right pupil is 6mm and fixed (non-reactive to light), while the left is 3mm and reactive. This indicates compression of the right oculomotor nerve (CN III) as the medial temporal lobe (uncus) herniates over the tentorium cerebelli. CN III carries parasympathetic fibers on its outer surface, making them susceptible to early compression, which results in pupillary dilation and loss of reactivity on the ipsilateral side; (3) Contralateral motor deficits (left-sided decorticate posturing) - the herniating mass is compressing the right cerebral peduncle against the tentorial edge, causing contralateral (left-sided) motor dysfunction. The classic Cushing's triad of hypertension, bradycardia, and irregular respirations may also be present with advanced herniation. Immediate interventions include: elevation of head of bed to 30 degrees, hyperventilation to a target PaCO2 of 30-35 mmHg (temporary measure only), IV mannitol 1 g/kg or hypertonic saline (23.4% NaCl 30 mL through central line, or 3% NaCl 250-500 mL), emergent CT head, and neurosurgical consultation for possible surgical evacuation. A concussion would not cause pupillary changes or posturing. Diffuse axonal injury typically shows bilateral signs without pupillary asymmetry. Bilateral subdural hematomas would more likely cause bilateral pupillary changes.",
    learningObjective: "Recognize the clinical signs of uncal herniation (unilateral fixed dilated pupil with contralateral motor deficits) and implement emergent interventions",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Increased ICP Management",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Unilateral fixed dilated pupil = ipsilateral CN III compression from herniation. The blown pupil is on the SAME side as the mass lesion",
    clinicalPearls: [
      "Uncal herniation: ipsilateral fixed dilated pupil + contralateral motor deficit",
      "GCS <=8 requires intubation for airway protection",
      "Emergency ICP reduction: HOB 30 degrees, mannitol 1 g/kg or hypertonic saline",
      "Hyperventilation to PaCO2 30-35 is only a temporary bridge measure"
    ],
    safetyNote: "Uncal herniation is irreversible without rapid intervention - neurosurgical consultation should be immediate",
    distractorRationales: [
      "Concussion does not cause pupillary changes or posturing",
      "DAI typically shows bilateral signs without pupillary asymmetry",
      "Bilateral subdurals would cause bilateral pupillary changes, not unilateral"
    ],
    lessonLink: "/emergency/lessons/increased-icp"
  },
  {
    stem: "A patient with known epilepsy presents to the ED in status epilepticus. First and second-line antiepileptic drugs have failed (lorazepam, then fosphenytoin). The seizure has been ongoing for 35 minutes. What defines this as refractory status epilepticus (RSE) and what is the management approach?",
    options: [
      "Continue escalating doses of fosphenytoin until maximum dose is reached",
      "RSE is defined as SE that persists despite adequate first and second-line therapy; management requires continuous IV infusion of midazolam, propofol, or pentobarbital with intubation and continuous EEG monitoring",
      "Administer oral levetiracetam via nasogastric tube",
      "Discontinue all seizure medications and obtain MRI brain before further treatment"
    ],
    correctAnswer: 1,
    rationaleLong: "Refractory status epilepticus (RSE) is defined as status epilepticus that does not respond to adequate doses of first-line (benzodiazepines) and second-line (fosphenytoin, valproate, or levetiracetam) antiepileptic drugs. This patient has been seizing for 35 minutes despite these interventions, meeting the criteria for RSE. RSE occurs in approximately 23-43% of all status epilepticus cases and carries significant morbidity and mortality (mortality rates of 16-39%). Management of RSE requires escalation to continuous IV infusion of one of the following agents: (1) Midazolam infusion: Loading dose 0.2 mg/kg, then 0.1-2 mg/kg/hr; advantage is rapid onset and shorter duration; (2) Propofol infusion: Loading dose 1-2 mg/kg, then 20-80 mcg/kg/min; risk of propofol infusion syndrome with prolonged use; (3) Pentobarbital: Loading dose 5-15 mg/kg, then 0.5-5 mg/kg/hr; most potent but causes severe hemodynamic depression. All of these agents require endotracheal intubation and mechanical ventilation, as they cause respiratory depression and loss of airway protective reflexes. Continuous EEG (cEEG) monitoring is mandatory to confirm electrographic seizure suppression, as clinical manifestations may cease while electrical seizure activity continues (non-convulsive SE). The target is either seizure suppression or burst-suppression pattern on EEG for 24-48 hours before attempting to wean. The emergency nurse should prepare for intubation (RSI with a non-depolarizing paralytic to avoid succinylcholine-induced hyperkalemia from prolonged muscle activity), establish arterial and central venous access, initiate vasopressor support (these infusions cause significant hypotension), and coordinate ICU admission. The patient will need continuous temperature monitoring, as prolonged seizures cause hyperthermia from sustained muscle activity.",
    learningObjective: "Manage refractory status epilepticus with continuous IV anesthetic infusion, intubation, and continuous EEG monitoring",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Seizure Management and Status Epilepticus",
    difficulty: 5,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "RSE requires continuous IV anesthetic infusion + intubation + continuous EEG. Clinical seizure cessation does not guarantee electrical cessation",
    clinicalPearls: [
      "RSE: SE persisting despite first AND second-line therapy",
      "Options: midazolam, propofol, or pentobarbital continuous infusion",
      "Continuous EEG is mandatory to confirm electrographic suppression",
      "Avoid succinylcholine for RSI in prolonged seizures (hyperkalemia risk)"
    ],
    safetyNote: "Prolonged seizure activity causes rhabdomyolysis, hyperthermia, and metabolic acidosis - treat aggressively and monitor CK and core temperature",
    distractorRationales: [
      "Escalating fosphenytoin alone is insufficient for RSE - continuous infusion is needed",
      "Oral medications via NG tube are inadequate for refractory status epilepticus",
      "Stopping seizure medications and waiting for MRI would be life-threatening"
    ],
    lessonLink: "/emergency/lessons/seizure-management"
  },
  {
    stem: "An emergency nurse is assessing a patient using the Glasgow Coma Scale (GCS). The patient opens eyes to pain, makes incomprehensible sounds, and withdraws from pain. What is this patient's GCS score?",
    options: [
      "GCS 6 (E1 + V2 + M3)",
      "GCS 8 (E2 + V2 + M4)",
      "GCS 9 (E3 + V2 + M4)",
      "GCS 7 (E2 + V1 + M4)"
    ],
    correctAnswer: 1,
    rationaleLong: "The Glasgow Coma Scale (GCS) is calculated by assessing three components: Eye opening (E), Verbal response (V), and Motor response (M). For this patient: Eye Opening (E2): Opens eyes to PAIN stimulus (not spontaneously or to voice). The scale is: E4 = spontaneous, E3 = to voice/command, E2 = to pain, E1 = none. Verbal Response (V2): Makes INCOMPREHENSIBLE sounds (moaning, groaning without recognizable words). The scale is: V5 = oriented, V4 = confused conversation, V3 = inappropriate words, V2 = incomprehensible sounds, V1 = none. Motor Response (M4): WITHDRAWS from pain (pulls extremity away from painful stimulus, a purposeful movement). The scale is: M6 = obeys commands, M5 = localizes pain (reaches toward stimulus to remove it), M4 = withdrawal (flexion withdrawal from pain), M3 = abnormal flexion (decorticate), M2 = extension (decerebrate), M1 = none. Total GCS = E2 + V2 + M4 = 8. This GCS score of 8 is clinically significant because GCS <=8 is the threshold at which intubation for airway protection is indicated, as the patient is unable to reliably maintain and protect their airway. The emergency nurse should be prepared for airway management and should communicate the individual components (E2V2M4) along with the total score, as the components provide more clinical information than the total alone. For example, a patient with E4V1M3 (GCS 8) has a very different clinical picture than E2V2M4 (also GCS 8).",
    learningObjective: "Calculate and interpret the Glasgow Coma Scale score to guide clinical decision-making including airway management",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Glasgow Coma Scale",
    difficulty: 1,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "GCS <=8 = intubate. Always report individual components (E, V, M) in addition to total score for more meaningful communication",
    clinicalPearls: [
      "GCS <=8: intubation for airway protection",
      "Report as E_V_M_ format, not just total (e.g., E2V2M4 = GCS 8)",
      "Withdrawal (M4) = flexion away from pain; Localization (M5) = reaches toward stimulus",
      "Motor component is the most predictive of outcome"
    ],
    safetyNote: "A GCS of 8 is the intubation threshold - prepare for airway management whenever GCS drops to this level",
    distractorRationales: [
      "E1+V2+M3=6 is incorrect - eye opening to pain is E2, not E1",
      "E3+V2+M4=9 is incorrect - eye opening to voice is E3; this patient opens to pain (E2)",
      "E2+V1+M4=7 is incorrect - incomprehensible sounds is V2, not V1 (which is none)"
    ],
    lessonLink: "/emergency/lessons/glasgow-coma-scale"
  },
  {
    stem: "A 50-year-old male presents to the ED after a diving accident with acute onset quadriplegia, loss of sensation below the nipple line (T4 level), and urinary retention. He is hypotensive (BP 78/44 mmHg) with a heart rate of 52 bpm. What type of shock should the emergency nurse recognize?",
    options: [
      "Hypovolemic shock from internal hemorrhage",
      "Neurogenic shock from spinal cord injury causing loss of sympathetic tone",
      "Cardiogenic shock from cardiac contusion",
      "Septic shock from aspiration pneumonia"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has neurogenic shock resulting from an acute spinal cord injury (SCI) at or above the T4 level. Neurogenic shock is a distributive shock caused by the acute loss of sympathetic nervous system tone below the level of the spinal cord injury. The sympathetic chain exits the spinal cord from T1-L2, so injuries above T6 (and especially above T4) disrupt the sympathetic outflow to the heart and peripheral vasculature. The clinical presentation of neurogenic shock is distinctive and differs from other forms of shock: (1) Hypotension from loss of vascular tone (vasodilation) below the injury level; (2) Bradycardia from unopposed vagal (parasympathetic) tone on the heart - this is the key differentiating feature. In hypovolemic, cardiogenic, and septic shock, the heart rate is typically elevated (tachycardic) as a compensatory response. In neurogenic shock, the heart cannot mount a tachycardic response because the sympathetic cardiac accelerator fibers (T1-T4) are disrupted; (3) Warm, dry, flushed skin below the injury level (from vasodilation), contrasted with cool, pale skin above the level; (4) Poikilothermia (inability to regulate body temperature). Management includes: (1) IV fluid resuscitation (judicious, as excessive fluids can cause pulmonary edema without improving vascular tone); (2) Vasopressors - norepinephrine is preferred as it provides both alpha (vasoconstriction) and beta-1 (chronotropic) effects; (3) Atropine for symptomatic bradycardia; (4) Spinal immobilization and MRI for definitive injury assessment; (5) Early methylprednisolone is controversial and no longer routinely recommended. The emergency nurse must differentiate neurogenic shock from spinal shock (which refers to the temporary loss of all neurological function below the injury, including reflexes) and from hemorrhagic shock (which is common in trauma and must be excluded).",
    learningObjective: "Differentiate neurogenic shock (hypotension + bradycardia) from other shock types in acute spinal cord injury",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Spinal Cord Syndromes",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Neurogenic shock = hypotension + BRADYCARDIA (not tachycardia). Bradycardia distinguishes it from hemorrhagic and other shock types",
    clinicalPearls: [
      "Neurogenic shock: hypotension + bradycardia + warm skin (loss of sympathetic tone)",
      "SCI above T6 disrupts sympathetic outflow to heart and vasculature",
      "Norepinephrine is preferred vasopressor (alpha + beta-1 effects)",
      "Must rule out concurrent hemorrhagic shock in all trauma patients"
    ],
    safetyNote: "Always rule out hemorrhagic shock in trauma patients before attributing hypotension solely to neurogenic shock - the two can coexist",
    distractorRationales: [
      "Hypovolemic shock presents with tachycardia as a compensatory response",
      "Cardiogenic shock from contusion would show different hemodynamic pattern",
      "Septic shock is unlikely in the immediate post-injury period and presents with tachycardia"
    ],
    lessonLink: "/emergency/lessons/spinal-cord-syndromes"
  },
  {
    stem: "A 60-year-old female presents to the ED with acute onset of severe headache, nausea, and ataxia. CT head reveals a cerebellar hemorrhage measuring 3.5 cm with early fourth ventricle compression. GCS is 14 (E4V4M6). Why is this specific type of ICH particularly dangerous?",
    options: [
      "Cerebellar hemorrhages have the highest recurrence rate of all ICH types",
      "Cerebellar hemorrhages can rapidly cause brainstem compression, obstructive hydrocephalus, and death from herniation through the foramen magnum",
      "Cerebellar hemorrhages are always caused by arteriovenous malformations",
      "Cerebellar hemorrhages respond poorly to blood pressure management"
    ],
    correctAnswer: 1,
    rationaleLong: "Cerebellar hemorrhage is particularly dangerous because of the limited space in the posterior fossa and the proximity to critical brainstem structures. The posterior fossa contains the cerebellum, pons, and medulla within a rigid bony compartment. Even a moderate-sized cerebellar hemorrhage can cause: (1) Direct brainstem compression: The cerebellum is immediately adjacent to the brainstem. Expansion of a cerebellar hematoma directly compresses the pons and medulla, which contain vital centers for consciousness (reticular activating system), respiration, and cardiovascular regulation. Compression of these structures leads to rapid clinical deterioration and death. (2) Obstructive hydrocephalus: The fourth ventricle lies between the cerebellum and brainstem. A cerebellar hemorrhage can compress or obstruct the fourth ventricle, blocking CSF outflow and causing acute obstructive hydrocephalus with rapidly increasing intracranial pressure. (3) Tonsillar herniation: The cerebellar tonsils can herniate downward through the foramen magnum, compressing the medulla and causing cardiorespiratory arrest. This is the most dreaded complication. Cerebellar hemorrhages >3 cm are generally considered surgical candidates requiring emergent suboccipital craniectomy for hematoma evacuation, especially when there is brainstem compression, deteriorating neurological exam, or hydrocephalus. Smaller hemorrhages may be managed conservatively with close monitoring. The patient in this scenario has a 3.5 cm hemorrhage with early fourth ventricle compression and relatively preserved GCS (14), but she is at high risk for rapid deterioration. The emergency nurse should prepare for potential emergent neurosurgical intervention, maintain strict neurological monitoring (GCS checks every 15-30 minutes), and prepare for possible external ventricular drain (EVD) placement if hydrocephalus develops. Have intubation equipment immediately available.",
    learningObjective: "Recognize the unique dangers of cerebellar hemorrhage including brainstem compression, obstructive hydrocephalus, and tonsillar herniation",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Ischemic vs Hemorrhagic Stroke",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Cerebellar hemorrhage >3 cm is generally a surgical emergency. Posterior fossa hemorrhages can deteriorate catastrophically within minutes",
    clinicalPearls: [
      "Cerebellar ICH >3 cm = surgical candidate (suboccipital craniectomy)",
      "Posterior fossa is a rigid compartment with limited space for expansion",
      "4th ventricle compression causes acute obstructive hydrocephalus",
      "Tonsillar herniation through foramen magnum compresses medulla -> death"
    ],
    safetyNote: "Patients with cerebellar hemorrhage can deteriorate from alert to comatose within minutes - neuro checks every 15-30 minutes and neurosurgery on standby",
    distractorRationales: [
      "Recurrence rate is not the primary danger of cerebellar hemorrhage",
      "AVMs are one cause but not the only etiology of cerebellar hemorrhage",
      "BP management is important and effective, but the anatomical danger is the key concern"
    ],
    lessonLink: "/emergency/lessons/hemorrhagic-stroke"
  },
  {
    stem: "A 35-year-old male presents to the ED with sudden onset of severe headache, fever (39.2C), confusion, and new-onset seizures. MRI shows temporal lobe edema and hemorrhagic changes. The emergency nurse should suspect which condition and what empiric treatment should be initiated?",
    options: [
      "Brain abscess - start vancomycin and metronidazole",
      "Herpes simplex encephalitis (HSE) - start IV acyclovir 10 mg/kg immediately",
      "Bacterial meningitis - start ceftriaxone and vancomycin",
      "Autoimmune encephalitis - start IV methylprednisolone"
    ],
    correctAnswer: 1,
    rationaleLong: "This presentation is classic for herpes simplex encephalitis (HSE), the most common and most treatable form of viral encephalitis. The key features that point to HSE include: (1) Acute onset of fever with neurological symptoms (confusion, seizures, altered behavior); (2) Temporal lobe involvement on MRI - HSE has a strong predilection for the temporal lobes and insular cortex due to the virus traveling along the olfactory and trigeminal nerve pathways; (3) Hemorrhagic changes within the temporal lobes are characteristic. HSV-1 causes approximately 95% of HSE cases in adults. Without treatment, HSE has a mortality rate of approximately 70%, and even with treatment, significant neurological morbidity is common. The survival rate improves to approximately 80% with early acyclovir administration. IV acyclovir at 10 mg/kg every 8 hours should be initiated IMMEDIATELY upon clinical suspicion, without waiting for confirmatory testing. Confirmatory diagnosis is made by CSF PCR for HSV DNA (from lumbar puncture), which has high sensitivity and specificity. However, LP should not delay acyclovir initiation. Acyclovir works by inhibiting viral DNA polymerase after being phosphorylated by viral thymidine kinase, selectively targeting HSV-infected cells. The typical treatment course is 14-21 days. The emergency nurse should ensure adequate IV hydration during acyclovir administration (acyclovir can crystallize in renal tubules causing acute kidney injury) and monitor renal function. Seizures should be treated aggressively with benzodiazepines and anti-epileptic drugs. Brain abscess would show ring-enhancing lesion, not temporal lobe edema. Bacterial meningitis has a different pattern. Autoimmune encephalitis develops more gradually.",
    learningObjective: "Recognize herpes simplex encephalitis by temporal lobe involvement and initiate immediate empiric IV acyclovir",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Meningitis",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Temporal lobe + fever + seizures + confusion = HSE until proven otherwise. Start acyclovir IMMEDIATELY - do not wait for LP or PCR results",
    clinicalPearls: [
      "HSE: temporal lobe predilection + fever + seizures + confusion",
      "Acyclovir 10 mg/kg IV q8h for 14-21 days - start immediately",
      "Untreated mortality: 70%; treated mortality: ~20%",
      "CSF HSV PCR confirms diagnosis but should not delay treatment"
    ],
    safetyNote: "Maintain aggressive IV hydration during acyclovir therapy to prevent renal crystallopathy and acute kidney injury",
    distractorRationales: [
      "Brain abscess shows ring-enhancing lesion, not temporal lobe edema",
      "Bacterial meningitis has different MRI pattern and does not target temporal lobes",
      "Autoimmune encephalitis develops more gradually and does not typically cause hemorrhagic changes"
    ],
    lessonLink: "/emergency/lessons/meningitis-management"
  },
  {
    stem: "A patient with a severe traumatic brain injury (TBI) has an intracranial pressure (ICP) monitor showing readings of 28 mmHg (normal <20 mmHg). The patient's MAP is 82 mmHg. Calculate the cerebral perfusion pressure (CPP) and determine if it is adequate.",
    options: [
      "CPP = 54 mmHg - this is adequate and no intervention is needed",
      "CPP = 54 mmHg - this is below the target of 60-70 mmHg and interventions are needed to either increase MAP or decrease ICP",
      "CPP = 110 mmHg - this is too high and needs to be reduced",
      "CPP cannot be calculated without knowing the central venous pressure"
    ],
    correctAnswer: 1,
    rationaleLong: "Cerebral perfusion pressure (CPP) is calculated as: CPP = MAP - ICP. In this case: CPP = 82 - 28 = 54 mmHg. The Brain Trauma Foundation (BTF) guidelines recommend maintaining CPP between 60-70 mmHg for optimal cerebral perfusion in severe TBI patients. A CPP of 54 mmHg is below the minimum recommended threshold of 60 mmHg, indicating inadequate cerebral blood flow that can lead to secondary brain injury from cerebral ischemia. Two strategies can be used to improve CPP: (1) Increase MAP: using IV vasopressors (norepinephrine or phenylephrine), IV fluid boluses, or optimizing cardiac output. Target MAP should be sufficient to maintain CPP >60 mmHg; (2) Decrease ICP: The elevated ICP of 28 mmHg (normal <20 mmHg, treatment threshold typically >22 mmHg per BTF guidelines) should be addressed using a tiered approach: First tier - Head of bed elevation to 30 degrees, maintain midline head positioning (avoid jugular venous compression), CSF drainage through EVD if in place, osmotic therapy (mannitol 0.25-1 g/kg or hypertonic saline 23.4% 30 mL through central line), adequate sedation and analgesia, maintain normothermia, optimize ventilation (PaCO2 35-40 mmHg). Second tier - Moderate hypothermia, decompressive craniectomy, barbiturate coma. The emergency nurse should continuously monitor the ICP waveform, ensure the transducer is properly zeroed and leveled, calculate CPP with every MAP change, and report ICP values >22 mmHg to the medical team immediately. Maintaining adequate CPP is critical because insufficient cerebral perfusion causes secondary ischemic injury, which significantly worsens outcomes in TBI. CVP is not needed for CPP calculation.",
    learningObjective: "Calculate cerebral perfusion pressure (CPP = MAP - ICP) and implement interventions to maintain CPP within target range",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Increased ICP Management",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "CPP = MAP - ICP. Target CPP 60-70 mmHg. Treat ICP >22 mmHg. Both MAP increase AND ICP decrease can improve CPP",
    clinicalPearls: [
      "CPP = MAP - ICP; target 60-70 mmHg",
      "ICP treatment threshold: >22 mmHg per BTF guidelines",
      "Two strategies: increase MAP (vasopressors) or decrease ICP (osmotic therapy, CSF drainage)",
      "Maintain HOB 30 degrees, midline head position, normothermia"
    ],
    safetyNote: "CPP <50 mmHg is associated with very poor outcomes and requires immediate intervention",
    distractorRationales: [
      "CPP of 54 is below the 60-70 target and requires intervention",
      "CPP formula is MAP - ICP, not MAP + ICP (which would give 110)",
      "CVP is not needed for CPP calculation"
    ],
    lessonLink: "/emergency/lessons/increased-icp"
  },
  {
    stem: "A 70-year-old female with a history of hypertension and diabetes presents to the ED with acute onset of right arm and leg weakness. CT head is negative. Her blood glucose is 42 mg/dL. After IV dextrose 50% administration, her glucose normalizes to 180 mg/dL and her neurological deficits completely resolve. What does this case illustrate?",
    options: [
      "The patient had a transient ischemic attack (TIA) that coincidentally resolved with glucose correction",
      "Hypoglycemia can mimic acute stroke and must be ruled out before administering tPA",
      "The patient had a hypoglycemic seizure causing post-ictal weakness",
      "The neurological exam findings were fabricated and the patient was malingering"
    ],
    correctAnswer: 1,
    rationaleLong: "This case perfectly illustrates one of the most critical stroke mimics: hypoglycemia. Hypoglycemia (blood glucose <60 mg/dL) can produce focal neurological deficits that are indistinguishable from acute ischemic stroke, including hemiparesis, aphasia, diplopia, ataxia, and altered mental status. The mechanism involves selective vulnerability of certain brain regions to glucose deprivation, with neurons in the cerebral cortex and hippocampus being particularly susceptible. When blood glucose falls below the threshold for normal neuronal function, these regions can produce focal deficits that perfectly mimic stroke. This case illustrates why checking blood glucose is one of the most important and TIME-CRITICAL assessments in the stroke evaluation protocol. The AHA/ASA guidelines require blood glucose measurement before tPA administration because: (1) Both hypoglycemia (<50 mg/dL) and severe hyperglycemia (>400 mg/dL) can cause focal neurological deficits that mimic stroke; (2) Administering tPA to a patient whose deficits are caused by hypoglycemia would expose them to significant bleeding risk without any benefit, as the underlying cause is metabolic, not vascular; (3) Glucose correction with IV dextrose rapidly reverses hypoglycemic deficits, avoiding unnecessary thrombolytic therapy. The complete resolution of neurological deficits after glucose correction confirms that hypoglycemia was the cause. However, it is important to note that hypoglycemia and stroke can coexist, so if deficits persist after glucose normalization, the stroke workup should continue. The emergency nurse should always obtain a point-of-care glucose as the FIRST lab test in any patient with suspected stroke.",
    learningObjective: "Identify hypoglycemia as a critical stroke mimic that must be excluded before tPA administration",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Altered Mental Status Assessment",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Blood glucose is the ONLY lab test required BEFORE tPA administration. Hypoglycemia <50 mg/dL can perfectly mimic stroke",
    clinicalPearls: [
      "Hypoglycemia can produce focal deficits indistinguishable from stroke",
      "Blood glucose must be checked before tPA administration (AHA/ASA requirement)",
      "Point-of-care glucose should be the FIRST lab test in stroke evaluation",
      "If deficits persist after glucose correction, continue stroke workup (can coexist)"
    ],
    safetyNote: "Giving tPA to a hypoglycemic patient exposes them to bleeding risk without benefit - always check glucose before thrombolytics",
    distractorRationales: [
      "The complete resolution with glucose correction excludes TIA as the cause",
      "Post-ictal weakness typically follows witnessed seizure activity, which was not described",
      "Malingering does not respond to glucose correction with complete resolution"
    ],
    lessonLink: "/emergency/lessons/altered-mental-status"
  },
  {
    stem: "A 45-year-old male arrives to the ED after a grand mal seizure witnessed at work. He is now post-ictal with GCS 13 (E3V4M6). He has no prior seizure history. Vital signs: BP 158/92, HR 104, Temp 37.1C, glucose 112 mg/dL. What is the most important assessment the emergency nurse should prioritize for a first-time seizure in an adult?",
    options: [
      "Obtain an EEG immediately in the ED",
      "Comprehensive evaluation to identify the underlying cause, including CT head, labs (BMP, CBC, toxicology screen, prolactin), and thorough history",
      "Start an antiepileptic drug immediately before any diagnostic workup",
      "Discharge home with neurology follow-up if the post-ictal state resolves"
    ],
    correctAnswer: 1,
    rationaleLong: "A first-time seizure in an adult warrants a comprehensive diagnostic evaluation to identify the underlying cause, as new-onset seizures in adults are frequently caused by structural brain pathology (tumors, stroke, hemorrhage), metabolic derangements, toxic exposures, or infections rather than primary epilepsy. The priority assessments include: (1) CT head without contrast - to evaluate for intracranial hemorrhage, mass lesions, stroke, or other structural pathology. Up to 15-20% of adults with a first-time seizure will have a structural lesion identified on neuroimaging. MRI is more sensitive but may not be immediately available; (2) Comprehensive metabolic panel (BMP) - to evaluate for electrolyte abnormalities (hyponatremia, hypocalcemia, hypomagnesemia), renal failure (uremia), and hepatic failure that can cause seizures; (3) Complete blood count (CBC) - to evaluate for infection; (4) Toxicology screen - many substances (cocaine, amphetamines, synthetic cannabinoids) and medication overdoses can cause seizures; (5) Blood alcohol level - alcohol withdrawal is a common cause of seizures; (6) Prolactin level - if drawn within 10-20 minutes of the seizure, an elevated prolactin (>2x baseline) can help distinguish true generalized tonic-clonic seizures from non-epileptic events; (7) Thorough history - including substance use, medication changes, recent head trauma, infection symptoms, family history of epilepsy, and detailed description of the event. An EEG is important but is typically obtained during inpatient stay or outpatient follow-up, not emergently in the ED unless non-convulsive status epilepticus is suspected. Starting an AED immediately is not indicated after a single unprovoked seizure unless there is a high-risk etiology identified. Discharging without evaluation is inappropriate for a first-time seizure.",
    learningObjective: "Perform comprehensive diagnostic evaluation for first-time adult seizure to identify structural, metabolic, or toxic etiologies",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Seizure Management and Status Epilepticus",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "First-time seizures in adults are NOT just epilepsy - 15-20% have a structural brain lesion. CT head and comprehensive labs are mandatory",
    clinicalPearls: [
      "First-time adult seizure: CT head is mandatory (15-20% have structural pathology)",
      "Check BMP, CBC, tox screen, alcohol level, and prolactin",
      "Prolactin drawn within 20 minutes helps differentiate true seizure from non-epileptic event",
      "Alcohol withdrawal seizures typically occur 6-48 hours after cessation"
    ],
    safetyNote: "Never discharge a first-time seizure patient without CT head and comprehensive metabolic evaluation",
    distractorRationales: [
      "EEG is important but usually obtained inpatient or outpatient, not emergently in ED",
      "AED is not routinely started after a single unprovoked seizure without identified high-risk cause",
      "Discharge without evaluation is inappropriate for first-time adult seizure"
    ],
    lessonLink: "/emergency/lessons/seizure-management"
  },
  {
    stem: "A 78-year-old female with a history of stroke on aspirin presents to the ED with a new episode of right arm weakness that resolved completely after 15 minutes. She is now neurologically intact. Her ABCD2 score is 5. What is the significance of this transient episode?",
    options: [
      "Since symptoms resolved, the patient can be discharged home with outpatient neurology follow-up in 2 weeks",
      "This is a transient ischemic attack (TIA) which carries a high short-term stroke risk (ABCD2 score 5 = moderate-high risk), requiring urgent evaluation with brain imaging, vascular imaging, and likely admission or rapid ED workup",
      "This is a benign episode of focal migraine and requires no further workup",
      "The patient should receive IV tPA since she had neurological symptoms within the past hour"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has experienced a transient ischemic attack (TIA), defined as a transient episode of neurological dysfunction caused by focal brain, spinal cord, or retinal ischemia without acute infarction. The fact that symptoms resolved completely within 15 minutes is characteristic of TIA, but this should NOT provide false reassurance. TIA is a medical emergency and a critical warning sign for impending stroke. The ABCD2 score estimates the short-term stroke risk after TIA: A = Age >=60 (1 point); B = Blood pressure >=140/90 (1 point); C = Clinical features (unilateral weakness = 2 points, speech disturbance without weakness = 1 point); D = Duration (>=60 min = 2 points, 10-59 min = 1 point); D = Diabetes (1 point). Total score 0-7. A score of 5 indicates moderate-to-high risk, with a 2-day stroke risk of approximately 4-8%. The recommended evaluation includes: (1) Brain MRI with diffusion-weighted imaging (DWI) - up to 30-50% of clinical TIAs show restricted diffusion on DWI, indicating actual brain infarction; (2) CT or MR angiography of the head and neck - to evaluate for large vessel stenosis (particularly carotid stenosis >50%) or intracranial stenosis; (3) Cardiac evaluation including ECG and echocardiography - to identify cardiac sources of embolism; (4) Lab work including lipid panel, HbA1c, and coagulation studies; (5) Initiation of dual antiplatelet therapy (aspirin + clopidogrel for 21 days per CHANCE and POINT trials) for high-risk TIA. tPA is not indicated as symptoms have fully resolved. Discharge without evaluation carries unacceptable stroke risk.",
    learningObjective: "Recognize TIA as a stroke warning requiring urgent evaluation and risk stratification using the ABCD2 score",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Stroke Recognition (FAST/BE-FAST)",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "TIA is NOT benign - it is a stroke warning. 30-50% of 'TIAs' show actual brain infarction on DWI-MRI",
    clinicalPearls: [
      "ABCD2 score >=4 = moderate-high stroke risk requiring urgent evaluation",
      "30-50% of TIAs show DWI-positive lesions (actual infarction) on MRI",
      "Dual antiplatelet (ASA + clopidogrel) for 21 days reduces recurrent stroke risk",
      "Carotid imaging is essential - >50% stenosis may require endarterectomy"
    ],
    safetyNote: "Never discharge a TIA patient without vascular imaging - treatable high-grade carotid stenosis can cause devastating stroke within days",
    distractorRationales: [
      "Discharging without evaluation carries unacceptable short-term stroke risk",
      "TIA with resolved symptoms is not 'benign' - it is a stroke warning",
      "tPA is not indicated when symptoms have completely resolved"
    ],
    lessonLink: "/emergency/lessons/stroke-recognition"
  },
  {
    stem: "An ED nurse receives a 62-year-old patient with acute ischemic stroke who is a candidate for IV tPA. The patient weighs 80 kg. What is the correct tPA dose and administration protocol?",
    options: [
      "Total dose: 90 mg (maximum). Give 9 mg (10%) as IV bolus over 1 minute, then infuse remaining 81 mg over 60 minutes",
      "Total dose: 72 mg (0.9 mg/kg). Give 7.2 mg (10%) as IV bolus over 1 minute, then infuse remaining 64.8 mg over 60 minutes",
      "Total dose: 80 mg (1 mg/kg). Give 8 mg as IV bolus, then infuse remaining 72 mg over 30 minutes",
      "Total dose: 100 mg flat dose. Give 10 mg as IV bolus, then infuse remaining 90 mg over 2 hours"
    ],
    correctAnswer: 1,
    rationaleLong: "The correct dosing of IV alteplase (tPA) for acute ischemic stroke is 0.9 mg/kg with a maximum total dose of 90 mg. For an 80 kg patient: Total dose = 80 kg x 0.9 mg/kg = 72 mg. Administration protocol: 10% of the total dose (7.2 mg) is given as an IV bolus over 1 minute, and the remaining 90% (64.8 mg) is infused over 60 minutes via an infusion pump. This dosing regimen was established by the NINDS trial and has remained the standard. The maximum dose is capped at 90 mg regardless of patient weight to minimize the risk of intracranial hemorrhage (the most feared complication, occurring in approximately 6.4% of treated patients). It is important to note that this dose is DIFFERENT from the dose used for tPA in ST-elevation myocardial infarction (where the dose is 100 mg) or pulmonary embolism (100 mg over 2 hours). The stroke dose is lower because the brain is more susceptible to hemorrhagic transformation. Critical nursing responsibilities during tPA administration include: (1) Two-nurse verification of the dose calculation; (2) Dedicated IV line for tPA (not shared with other medications); (3) Blood pressure monitoring every 15 minutes for 2 hours, then every 30 minutes for 6 hours, then hourly for 16 hours; (4) BP target <180/105 mmHg during and after infusion; (5) Neurological assessments (NIHSS) every 15 minutes during infusion, every 30 minutes for 6 hours, then hourly for 24 hours; (6) No anticoagulants, antiplatelets, or invasive procedures for 24 hours after tPA administration; (7) Stop infusion immediately and notify physician for any neurological deterioration (suggestive of ICH).",
    learningObjective: "Calculate and administer the correct IV tPA dose for acute ischemic stroke using the 0.9 mg/kg protocol",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "TPA Administration Criteria",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Stroke tPA dose: 0.9 mg/kg (max 90 mg). NOT the same as MI dose (100 mg) or PE dose (100 mg over 2 hours)",
    clinicalPearls: [
      "tPA dose: 0.9 mg/kg, max 90 mg. 10% bolus over 1 min, 90% over 60 min",
      "Two-nurse verification of dose calculation is mandatory",
      "BP target <180/105 for 24 hours post-tPA",
      "No anticoagulants, antiplatelets, or invasive procedures for 24 hours"
    ],
    safetyNote: "Stop tPA infusion immediately and obtain emergent CT head for any neurological deterioration - signs of intracranial hemorrhage",
    distractorRationales: [
      "90 mg would overdose this patient (max is 90 mg for >=100 kg patients)",
      "1 mg/kg is the wrong dose - the correct dose is 0.9 mg/kg for stroke",
      "100 mg flat dose is used for PE, not stroke"
    ],
    lessonLink: "/emergency/lessons/tpa-administration"
  },
  {
    stem: "A 55-year-old male with a history of chronic alcohol use presents to the ED with confusion, ophthalmoplegia (bilateral lateral rectus palsy), and ataxia. He appears malnourished. What condition should the emergency nurse suspect and what is the emergent treatment?",
    options: [
      "Alcohol withdrawal delirium - administer IV lorazepam",
      "Wernicke encephalopathy - administer IV thiamine 500 mg before any glucose-containing fluids",
      "Hepatic encephalopathy - administer oral lactulose",
      "Alcohol intoxication - observe until sober"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with the classic triad of Wernicke encephalopathy: confusion (encephalopathy), ophthalmoplegia (eye movement abnormalities, particularly lateral rectus palsy), and ataxia (gait instability). Wernicke encephalopathy is caused by thiamine (vitamin B1) deficiency, most commonly seen in chronic alcoholism due to poor nutrition, impaired gastrointestinal absorption, and decreased hepatic storage and metabolism of thiamine. However, it can also occur in any malnourished state, anorexia nervosa, hyperemesis gravidarum, or malabsorption syndromes. The treatment is EMERGENT IV thiamine, given at high doses: 500 mg IV three times daily for 2-3 days, then 250 mg IV daily for 3-5 days. Thiamine must be administered BEFORE any glucose-containing fluids (IV dextrose). This is a critical safety point: glucose metabolism requires thiamine as a cofactor (specifically for pyruvate dehydrogenase and other enzymes in the Krebs cycle). Administering glucose to a thiamine-depleted patient diverts the remaining thiamine stores to glucose metabolism, potentially precipitating or worsening Wernicke encephalopathy, which can progress to the irreversible Korsakoff syndrome (severe anterograde amnesia with confabulation). If left untreated, Wernicke encephalopathy progresses to Korsakoff syndrome in approximately 80% of cases. Mortality from untreated Wernicke encephalopathy is approximately 20%. The emergency nurse should ensure thiamine is given before or concurrently with any dextrose-containing fluids, not after. Alcohol withdrawal delirium presents with autonomic instability and agitation, not ophthalmoplegia. Hepatic encephalopathy may cause confusion but not the specific eye findings. Simple intoxication does not explain the ophthalmoplegia and ataxia triad.",
    learningObjective: "Recognize Wernicke encephalopathy triad and administer IV thiamine BEFORE glucose to prevent irreversible Korsakoff syndrome",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Altered Mental Status Assessment",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "ALWAYS give thiamine BEFORE glucose in suspected Wernicke encephalopathy - glucose can worsen thiamine depletion and precipitate Korsakoff syndrome",
    clinicalPearls: [
      "Wernicke triad: confusion + ophthalmoplegia + ataxia (classic but all three present in only 16%)",
      "Thiamine 500 mg IV TID for 2-3 days BEFORE any glucose administration",
      "Untreated Wernicke -> Korsakoff syndrome (irreversible) in 80% of cases",
      "Can occur in any malnourished state, not just alcoholism"
    ],
    safetyNote: "NEVER administer IV dextrose to an alcoholic or malnourished patient without giving thiamine first",
    distractorRationales: [
      "Alcohol withdrawal delirium does not cause ophthalmoplegia",
      "Hepatic encephalopathy does not cause the specific eye findings of Wernicke",
      "Simple intoxication does not explain the specific neurological triad"
    ],
    lessonLink: "/emergency/lessons/altered-mental-status"
  },
  {
    stem: "A 32-year-old male involved in a motorcycle accident presents with weakness in the arms with preserved leg strength, loss of pain and temperature sensation in the upper extremities, but intact light touch and proprioception. What spinal cord syndrome does this pattern suggest?",
    options: [
      "Brown-Sequard syndrome (hemisection)",
      "Central cord syndrome",
      "Anterior cord syndrome",
      "Cauda equina syndrome"
    ],
    correctAnswer: 1,
    rationaleLong: "This presentation is classic for central cord syndrome, the most common incomplete spinal cord injury pattern. Central cord syndrome results from injury to the central portion of the spinal cord, typically in the cervical region. The key clinical features are: (1) Upper extremity weakness greater than lower extremity weakness - this occurs because the corticospinal tracts are somatotopically organized with the cervical (arm) fibers located more centrally and the sacral (leg) fibers located more peripherally (lamination). A central cord injury preferentially damages the more centrally located cervical fibers, causing greater arm weakness than leg weakness; (2) Loss of pain and temperature sensation in the upper extremities - the spinothalamic tract fibers crossing at the level of injury (in the anterior white commissure) are disrupted; (3) Preserved light touch and proprioception - the dorsal columns (posterior columns) carrying these modalities are located peripherally and are often spared. Central cord syndrome most commonly occurs in elderly patients with pre-existing cervical spondylosis who experience a hyperextension injury (even minor trauma such as a fall). In younger patients, it can occur with more significant trauma such as this motorcycle accident. The prognosis for central cord syndrome is generally favorable, with many patients recovering significant function, particularly in the lower extremities. Lower extremity strength typically recovers first, followed by bladder function, and finally upper extremity strength, with hand function being the last to recover. Brown-Sequard syndrome (cord hemisection) presents with ipsilateral motor weakness and proprioception loss with contralateral pain/temperature loss. Anterior cord syndrome shows bilateral motor and pain/temperature loss with preserved posterior column function. Cauda equina syndrome affects the nerve roots below the conus medullaris with lower extremity symptoms and bladder/bowel dysfunction.",
    learningObjective: "Identify central cord syndrome by the pattern of upper > lower extremity weakness with dissociated sensory loss",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Spinal Cord Syndromes",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Central cord syndrome: arms worse than legs (opposite of what you might expect). Due to somatotopic lamination of corticospinal tracts",
    clinicalPearls: [
      "Central cord: arms > legs weakness due to central lamination of corticospinal tract",
      "Most common incomplete SCI; often in elderly with cervical spondylosis",
      "Recovery pattern: legs first -> bladder -> upper extremities -> hands last",
      "Mechanism: typically cervical hyperextension injury"
    ],
    safetyNote: "Maintain spinal immobilization in all suspected spinal cord injuries until MRI can evaluate the cord and surrounding structures",
    distractorRationales: [
      "Brown-Sequard: ipsilateral motor + ipsilateral proprioception loss + contralateral pain/temp loss",
      "Anterior cord: bilateral motor and pain/temp loss with preserved posterior column function",
      "Cauda equina: lower extremity weakness + saddle anesthesia + bladder/bowel dysfunction"
    ],
    lessonLink: "/emergency/lessons/spinal-cord-syndromes"
  },
  {
    stem: "A 66-year-old female presents to the ED with a headache that she describes as a 'thunderclap' occurring during sexual intercourse. She has no focal neurological deficits. CT head and lumbar puncture are both negative for subarachnoid hemorrhage. What diagnosis should the emergency nurse consider, and what imaging should be obtained?",
    options: [
      "Tension headache - discharge with acetaminophen",
      "Reversible cerebral vasoconstriction syndrome (RCVS) - obtain CT or MR angiography to evaluate for multifocal arterial narrowing",
      "Cluster headache - administer high-flow oxygen",
      "Migraine with aura - discharge with triptan prescription"
    ],
    correctAnswer: 1,
    rationaleLong: "After ruling out subarachnoid hemorrhage (SAH) with negative CT and LP, the next important diagnosis to consider in a patient with thunderclap headache triggered by sexual activity is reversible cerebral vasoconstriction syndrome (RCVS). RCVS is characterized by recurrent thunderclap headaches caused by multifocal segmental vasoconstriction of the cerebral arteries. Triggers commonly include sexual activity, exertion, Valsalva maneuvers, bathing, and certain drugs (particularly vasoactive substances such as triptans, SSRIs, pseudoephedrine, and cannabis). The hallmark of RCVS is the severe, sudden-onset headache that reaches maximal intensity within seconds (thunderclap pattern). RCVS can be complicated by ischemic stroke, hemorrhagic stroke, and posterior reversible encephalopathy syndrome (PRES). The diagnosis is made by CT angiography (CTA) or MR angiography (MRA) showing a 'string of beads' pattern - multifocal segmental narrowing and dilation of the cerebral arteries. However, vascular imaging may be normal early in the course (first 1-2 weeks), so repeat imaging may be needed. Treatment includes avoidance of triggers and vasoactive substances, calcium channel blockers (verapamil or nimodipine), and supportive care. The vasoconstriction typically reverses within 1-3 months. Tension headaches do not present with thunderclap onset. Cluster headaches are unilateral periorbital with autonomic features. Migraines have a gradual onset over minutes, not the instantaneous thunderclap pattern. The emergency nurse should ensure vascular imaging is obtained before discharge and that the patient is educated about trigger avoidance.",
    learningObjective: "Consider RCVS in the differential diagnosis of thunderclap headache after ruling out SAH",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Headache Red Flags",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "SAH-negative thunderclap headache still requires vascular imaging to evaluate for RCVS, which can cause stroke",
    clinicalPearls: [
      "RCVS: recurrent thunderclap headaches + multifocal cerebral vasoconstriction",
      "Triggers: sex, exertion, Valsalva, vasoactive drugs",
      "CTA/MRA shows 'string of beads' pattern (may be normal early)",
      "Treatment: verapamil or nimodipine; avoid triggers and vasoactive substances"
    ],
    safetyNote: "Do NOT prescribe triptans for thunderclap headache - triptans are vasoactive and can worsen RCVS",
    distractorRationales: [
      "Tension headaches do not present with thunderclap onset",
      "Cluster headaches are unilateral periorbital with autonomic features, not thunderclap pattern",
      "Migraines develop gradually over minutes, not instantaneously"
    ],
    lessonLink: "/emergency/lessons/headache-red-flags"
  },
  {
    stem: "A 45-year-old male presents to the ED with progressive lower back pain, bilateral leg weakness, urinary retention, and saddle anesthesia over the past 12 hours. MRI reveals a large lumbar disc herniation compressing the cauda equina. What makes this presentation a surgical emergency?",
    options: [
      "Lower back pain always requires emergent surgical consultation",
      "Cauda equina syndrome causes irreversible paralysis and bowel/bladder dysfunction if not surgically decompressed within 24-48 hours",
      "The patient needs bedside lumbar puncture for diagnosis",
      "Conservative management with steroids and bed rest is equally effective"
    ],
    correctAnswer: 1,
    rationaleLong: "Cauda equina syndrome (CES) is a surgical emergency that requires urgent decompressive surgery, ideally within 24-48 hours of symptom onset, to prevent permanent neurological damage. The cauda equina is the bundle of nerve roots below the conus medullaris (typically L1-L2 level) that provides motor and sensory innervation to the lower extremities, perineum, and bladder/bowel. Compression of these nerve roots can result from disc herniation, tumor, abscess, hematoma, or spinal stenosis. The classic presentation includes: (1) Bilateral leg weakness or sciatica; (2) Saddle anesthesia (numbness in the perineal/perianal area corresponding to S2-S5 dermatomes); (3) Urinary retention (most specific symptom - loss of detrusor muscle innervation); (4) Decreased rectal tone and fecal incontinence; (5) Sexual dysfunction. If surgical decompression is delayed beyond 48 hours, the risk of permanent bladder, bowel, and sexual dysfunction increases dramatically. Even with timely surgery, some patients may have residual deficits, but early intervention provides the best chance of recovery. The emergency nurse should recognize the constellation of symptoms, facilitate urgent MRI (the diagnostic study of choice), obtain an immediate neurosurgical or orthopedic spine consultation, and prepare the patient for emergent surgery. A post-void residual bladder scan should be performed to document urinary retention. The patient should be made NPO in preparation for surgery. Conservative management with steroids and bed rest is NOT appropriate for true CES - this is a surgical condition. Lumbar puncture is diagnostic for meningitis, not CES; MRI is the correct imaging study.",
    learningObjective: "Recognize cauda equina syndrome as a surgical emergency requiring decompression within 24-48 hours",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Spinal Cord Syndromes",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Cauda equina red flags: bilateral leg weakness + saddle anesthesia + urinary retention = surgical emergency, NOT conservative management",
    clinicalPearls: [
      "CES triad: bilateral leg symptoms + saddle anesthesia + bladder dysfunction",
      "Urinary retention is the most specific symptom of CES",
      "Surgical decompression within 24-48 hours for best outcomes",
      "Post-void residual >200 mL supports urinary retention diagnosis"
    ],
    safetyNote: "Any patient with bilateral leg weakness and urinary retention needs emergent MRI and neurosurgical consultation - delay causes permanent disability",
    distractorRationales: [
      "Not all back pain requires surgery, but CES is a specific surgical emergency",
      "LP is for meningitis evaluation, not CES diagnosis",
      "Conservative management is inappropriate for CES - surgical decompression is required"
    ],
    lessonLink: "/emergency/lessons/spinal-cord-syndromes"
  },
  {
    stem: "A 58-year-old male presents to the ED with acute onset right-sided weakness and Broca's aphasia (can understand speech but cannot produce fluent speech). NIHSS score is 14. CT head is negative for hemorrhage. CT angiography shows a left M1 middle cerebral artery occlusion. Time of symptom onset was 90 minutes ago. IV tPA is being prepared. Which tPA contraindication should the nurse verify is NOT present?",
    options: [
      "Age over 50 years",
      "Blood pressure >185/110 mmHg that cannot be controlled with IV antihypertensives",
      "History of well-controlled hypertension",
      "Use of aspirin within the past 24 hours"
    ],
    correctAnswer: 1,
    rationaleLong: "Blood pressure greater than 185/110 mmHg that cannot be reduced and maintained below this threshold with IV antihypertensive therapy is an absolute contraindication to IV tPA administration for acute ischemic stroke. Elevated blood pressure at the time of tPA administration significantly increases the risk of symptomatic intracranial hemorrhage (sICH), the most feared complication of thrombolytic therapy. The AHA/ASA guidelines require that blood pressure must be below 185/110 mmHg before tPA is given and maintained below 180/105 mmHg for 24 hours after administration. IV labetalol (10-20 mg over 1-2 minutes) or IV nicardipine (5 mg/hr, titrate up) are commonly used to achieve BP control before tPA administration. If blood pressure cannot be lowered below the threshold, tPA should NOT be given. Other important tPA contraindications include: active internal bleeding, bleeding diathesis (platelets <100,000, INR >1.7, aPTT above normal), recent intracranial or spinal surgery within 3 months, recent head trauma within 3 months, history of intracranial hemorrhage, intracranial neoplasm, known AVM or aneurysm, and blood glucose <50 mg/dL. Age over 50 is NOT a contraindication to tPA. Age >80 adds exclusion criteria only for the 3-4.5 hour window. Well-controlled hypertension (not currently elevated) is not a contraindication. Prior aspirin use within 24 hours is NOT a contraindication to tPA. However, no antiplatelets or anticoagulants should be given for 24 hours AFTER tPA administration.",
    learningObjective: "Verify tPA eligibility criteria including blood pressure thresholds and identify absolute contraindications",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "TPA Administration Criteria",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "BP must be <185/110 BEFORE tPA and <180/105 for 24 hours AFTER. Prior aspirin use is NOT a contraindication to tPA",
    clinicalPearls: [
      "Pre-tPA BP target: <185/110 mmHg (treat with IV labetalol or nicardipine)",
      "Post-tPA BP target: <180/105 for 24 hours",
      "Prior aspirin use is NOT a contraindication to tPA",
      "Age alone is not a contraindication (additional criteria for 3-4.5 hr window if >80)"
    ],
    safetyNote: "If BP cannot be controlled below 185/110, tPA must NOT be administered - document all BP measurements and treatment attempts",
    distractorRationales: [
      "Age over 50 is not a tPA contraindication",
      "History of well-controlled hypertension is not a contraindication if current BP is controlled",
      "Prior aspirin use is not a contraindication; post-tPA antiplatelet restriction is for 24 hours"
    ],
    lessonLink: "/emergency/lessons/tpa-administration"
  },
  {
    stem: "A 7-year-old child is brought to the ED by parents after witnessing a 3-minute generalized seizure at home. This is the child's first seizure. The child is now alert and at baseline. Temperature is 40.1C (104.2F). There is no rash, neck stiffness, or focal neurological findings. What is the most likely diagnosis?",
    options: [
      "Epilepsy requiring initiation of daily antiepileptic medication",
      "Febrile seizure - a benign condition in children aged 6 months to 5 years, though this child is outside the typical age range and requires further evaluation",
      "Meningitis requiring immediate antibiotics",
      "Brain tumor causing seizures"
    ],
    correctAnswer: 1,
    rationaleLong: "While febrile seizures are the most common cause of seizures in young children (ages 6 months to 5 years), this 7-year-old child is OUTSIDE the typical age range for simple febrile seizures. Simple febrile seizures occur in children aged 6 months to 5 years, are generalized (not focal), last less than 15 minutes, and do not recur within 24 hours. They are associated with fever >=100.4F (38C) and are generally benign with an excellent prognosis. However, this child at age 7 is outside the typical window, which raises additional diagnostic considerations. A first-time seizure with fever in a child older than 5 requires more thorough evaluation because: (1) The seizure may be caused by the underlying illness causing the fever (such as CNS infection) rather than a benign febrile seizure; (2) Febrile seizures in older children are less common and may indicate an underlying seizure disorder; (3) The possibility of meningitis or encephalitis must be evaluated more carefully. The evaluation should include: detailed history and physical examination, assessment for meningeal signs, consideration of blood work (CBC, BMP, blood cultures), and possibly neuroimaging and lumbar puncture if there are concerning features. While meningitis is in the differential, the absence of rash, neck stiffness, and focal findings makes it less likely. The child's return to baseline neurological function is reassuring. The emergency nurse should monitor the child closely, administer antipyretics, and ensure appropriate follow-up is arranged regardless of the ED evaluation results.",
    learningObjective: "Evaluate febrile seizures considering age-appropriate presentation and recognize atypical features requiring further investigation",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Seizure Management and Status Epilepticus",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Simple febrile seizures occur in children 6 months to 5 years. Outside this age range requires more thorough evaluation for underlying cause",
    clinicalPearls: [
      "Simple febrile seizures: 6 months to 5 years, generalized, <15 min, no recurrence in 24 hrs",
      "Age >5 with febrile seizure = atypical and needs further workup",
      "Return to baseline is reassuring but does not eliminate need for evaluation",
      "Complex febrile seizure: focal, >15 min, or recurrent within 24 hours"
    ],
    safetyNote: "Administer antipyretics but recognize that preventing fever does not prevent febrile seizure recurrence",
    distractorRationales: [
      "Single seizure does not require initiation of daily AED in children",
      "Meningitis is in the differential but no classic signs are present",
      "Brain tumor is unlikely with normal neurological exam at baseline, but cannot be excluded without imaging"
    ],
    lessonLink: "/emergency/lessons/seizure-management"
  },
  {
    stem: "A 70-year-old male with a history of atrial fibrillation presents to the ED with sudden onset of right-sided weakness and aphasia. Last known well time was when he went to bed at 10 PM. He was found with symptoms at 6 AM (8-hour window from LKW). CT head is negative for hemorrhage. What imaging modality can help determine if this patient may still be a candidate for intervention?",
    options: [
      "Repeat CT head in 6 hours to evaluate for infarct evolution",
      "CT perfusion or MRI with diffusion/perfusion imaging to identify salvageable penumbral tissue",
      "Carotid Doppler ultrasound to evaluate for stenosis",
      "Conventional cerebral angiography"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with a wake-up stroke where the exact time of symptom onset is unknown (last known well 10 PM, found symptomatic 6 AM, giving an 8-hour window). He is outside the IV tPA window (4.5 hours) but may still be a candidate for mechanical thrombectomy if perfusion imaging demonstrates favorable tissue characteristics. CT perfusion (CTP) or MRI with diffusion-weighted imaging (DWI) and perfusion-weighted imaging (PWI) can differentiate between irreversibly infarcted tissue (core) and ischemic but potentially salvageable tissue (penumbra). The DAWN trial (6-24 hours) and DEFUSE 3 trial (6-16 hours) established that patients with small infarct cores and large penumbral mismatch benefit from thrombectomy even in extended time windows. For wake-up strokes specifically, the WAKE-UP trial demonstrated that MRI-based selection (using DWI-FLAIR mismatch) can identify patients who benefit from IV tPA, as DWI-positive/FLAIR-negative lesions indicate the infarct is likely less than 4.5 hours old. CTP provides maps of cerebral blood flow (CBF), cerebral blood volume (CBV), and mean transit time (MTT). The core is defined by severely reduced CBV, while the penumbra shows reduced CBF with maintained CBV. The mismatch between these represents salvageable tissue. Repeating CT head without perfusion imaging does not provide information about salvageable tissue. Carotid Doppler evaluates extracranial vessels but does not assess brain tissue viability. Conventional angiography is invasive and used for intervention, not initial tissue viability assessment. The emergency nurse should facilitate rapid access to advanced imaging (CTP or MRI) and notify the stroke team and neurointerventionalists about a potential thrombectomy candidate.",
    learningObjective: "Use perfusion imaging to identify thrombectomy candidates in wake-up strokes and extended time window presentations",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Ischemic vs Hemorrhagic Stroke",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Wake-up strokes are NOT automatically excluded from intervention - perfusion imaging can identify patients who benefit from thrombectomy up to 24 hours",
    clinicalPearls: [
      "CT perfusion identifies core (irreversible) vs penumbra (salvageable) tissue",
      "DWI-FLAIR mismatch on MRI suggests infarct is <4.5 hours old (WAKE-UP trial)",
      "Thrombectomy may be performed up to 24 hours with favorable perfusion mismatch",
      "Small core + large penumbra = favorable for late intervention"
    ],
    safetyNote: "Do not deny wake-up stroke patients potential treatment without advanced imaging assessment - tissue clock matters more than time clock",
    distractorRationales: [
      "Repeat non-contrast CT without perfusion does not assess tissue viability",
      "Carotid Doppler evaluates vessels but not brain tissue salvageability",
      "Conventional angiography is invasive and used for intervention, not selection"
    ],
    lessonLink: "/emergency/lessons/stroke-recognition"
  },
  {
    stem: "An ED nurse is caring for a patient with severe traumatic brain injury who shows signs of Cushing's triad. What three findings constitute Cushing's triad and what do they indicate?",
    options: [
      "Tachycardia, hypotension, and tachypnea - indicating hemorrhagic shock",
      "Hypertension, bradycardia, and irregular respirations - indicating critically elevated ICP with impending brainstem herniation",
      "Fever, neck stiffness, and altered mental status - indicating meningitis",
      "Hypotension, tachycardia, and warm skin - indicating neurogenic shock"
    ],
    correctAnswer: 1,
    rationaleLong: "Cushing's triad (also called Cushing's reflex or Cushing's response) consists of: (1) Systemic hypertension (often with widened pulse pressure); (2) Bradycardia (reflex vagal response); (3) Irregular respiratory pattern (Cheyne-Stokes, ataxic, or apneustic breathing). This triad represents a late and ominous sign of critically elevated intracranial pressure (ICP) with impending brainstem herniation. It is a physiological response that occurs as the brainstem is compressed by the expanding intracranial contents. The mechanism is as follows: as ICP rises and approaches the mean arterial pressure, cerebral perfusion pressure (CPP = MAP - ICP) decreases to dangerously low levels. The brainstem detects the cerebral ischemia and triggers a massive sympathetic response (Cushing's reflex) that dramatically raises systemic blood pressure to force blood through the compressed cerebral vasculature and maintain some cerebral blood flow. The baroreceptors in the aortic arch and carotid sinus detect the acute hypertension and trigger a reflexive bradycardia through the vagus nerve. The irregular respirations result from direct brainstem compression affecting the respiratory centers in the medulla and pons. When the emergency nurse observes Cushing's triad, it indicates a critically ill patient with ICP at or near lethal levels. Immediate interventions include: emergent neurosurgical consultation, intubation with controlled ventilation, osmotic therapy (mannitol or hypertonic saline), head of bed elevation to 30 degrees, and preparation for possible emergent surgical decompression. This is a medical emergency with minutes to act before irreversible brainstem damage occurs.",
    learningObjective: "Identify Cushing's triad as a late sign of critical ICP elevation requiring immediate intervention to prevent death",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Increased ICP Management",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Cushing's triad is a LATE and OMINOUS sign - by the time it appears, herniation may be imminent. Do not wait for Cushing's triad to treat elevated ICP",
    clinicalPearls: [
      "Cushing's triad: hypertension + bradycardia + irregular breathing = ICP crisis",
      "It is a LATE sign - elevated ICP should be treated before Cushing's develops",
      "Immediate interventions: intubation, mannitol/hypertonic saline, HOB 30 degrees",
      "Neurosurgical emergency requiring immediate consultation"
    ],
    safetyNote: "Cushing's triad indicates imminent herniation - act immediately with osmotic therapy and prepare for emergent surgical decompression",
    distractorRationales: [
      "Hemorrhagic shock causes tachycardia and hypotension, not hypertension and bradycardia",
      "Meningitis triad is different: fever, neck stiffness, altered mental status",
      "Neurogenic shock causes hypotension and bradycardia without hypertension or irregular breathing"
    ],
    lessonLink: "/emergency/lessons/increased-icp"
  },
  {
    stem: "A 52-year-old male presents to the ED after a witnessed generalized tonic-clonic seizure. He has a history of epilepsy controlled on levetiracetam. In the post-ictal period, the emergency nurse notices clear fluid draining from the patient's right ear. What does this finding suggest?",
    options: [
      "Otitis media that may have triggered the seizure",
      "CSF otorrhea from a skull base fracture, suggesting the seizure may have been caused by head trauma",
      "Excessive salivation from the seizure tracking into the ear canal",
      "Ear wax liquefied from the fever associated with the seizure"
    ],
    correctAnswer: 1,
    rationaleLong: "Clear fluid draining from the ear (otorrhea) in a post-seizure patient should raise immediate concern for cerebrospinal fluid (CSF) otorrhea from a temporal bone or skull base fracture. This finding is critically important because it changes the diagnostic approach from managing a simple breakthrough seizure to evaluating for traumatic brain injury. CSF otorrhea occurs when a fracture of the temporal bone creates a communication between the subarachnoid space and the middle ear or ear canal. The clear fluid is CSF that leaks through the fracture site. The seizure may have been caused by the underlying head trauma rather than breakthrough epilepsy, or the patient may have sustained head trauma during the seizure (fall). The emergency nurse should: (1) Test the fluid for glucose using a bedside glucose test strip - CSF has significant glucose content (approximately 60 mg/dL) compared to other bodily fluids. However, this test is not highly specific; (2) Look for the 'halo sign' or 'ring sign' - when the fluid is placed on a white sheet, CSF will form a central spot with a surrounding clear ring (halo) because the protein separates from the watery component; (3) Obtain a CT head without contrast and CT temporal bones to evaluate for fracture; (4) Send the fluid for beta-2 transferrin testing - this is the definitive test for CSF identification (present only in CSF, perilymph, and aqueous humor); (5) Avoid nasal suctioning, nasogastric tube placement, or nasal packing, as these can worsen the dural tear or introduce infection; (6) Administer antibiotics to prevent meningitis through the dural breach is controversial. Otitis media would present with purulent (not clear) fluid. Salivation from seizures would not drain from the ear canal. Ear wax does not liquefy from seizure-associated activity.",
    learningObjective: "Identify CSF otorrhea as a sign of skull base fracture in post-seizure patients and implement appropriate evaluation",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Neurological Assessment in ED",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Clear fluid from the ear after a seizure = CSF otorrhea until proven otherwise. Check for halo sign and obtain CT temporal bones",
    clinicalPearls: [
      "CSF otorrhea: clear fluid from ear = skull base fracture until proven otherwise",
      "Halo sign on white sheet: CSF separates into central spot with surrounding clear ring",
      "Beta-2 transferrin is the definitive test for CSF identification",
      "Avoid NG tubes, nasal packing, and nasal suctioning with suspected base of skull fracture"
    ],
    safetyNote: "Skull base fractures with CSF leak increase meningitis risk - neurosurgical consultation and close monitoring are essential",
    distractorRationales: [
      "Otitis media produces purulent drainage, not clear fluid",
      "Salivation from seizures does not drain from the ear canal",
      "Ear wax does not liquefy into clear fluid from seizure activity"
    ],
    lessonLink: "/emergency/lessons/neurological-assessment"
  },
  {
    stem: "A 80-year-old female with no significant medical history presents with acute onset of left-sided weakness and left-sided neglect. Her daughter states the symptoms began exactly 3 hours ago. CT head is negative. NIHSS is 16. Blood glucose is 130 mg/dL. BP is 190/100 mmHg. What must be done before IV tPA can be administered?",
    options: [
      "Reduce blood pressure below 185/110 mmHg and verify no contraindications",
      "Wait for complete blood count and chemistry panel results before giving tPA",
      "Obtain an MRI brain to confirm the infarct location",
      "Consult neurology before any treatment decisions"
    ],
    correctAnswer: 0,
    rationaleLong: "Before IV tPA administration, the blood pressure must be controlled below 185/110 mmHg, and a rapid screen for contraindications must be completed. In this patient, the BP of 190/100 mmHg exceeds the 185/110 threshold. While the systolic (190) is above 185, the diastolic (100) is below 110. The systolic component exceeds the threshold and must be treated. The priority steps before tPA administration are: (1) Blood glucose check - already done (130 mg/dL, normal range); (2) Blood pressure control - administer IV labetalol 10-20 mg over 1-2 minutes or start IV nicardipine 5 mg/hr to reduce SBP below 185 mmHg. If BP cannot be maintained below threshold, tPA cannot be given; (3) Quick verification of no absolute contraindications - recent surgery, active bleeding, bleeding diathesis, recent stroke or head trauma within 3 months, intracranial hemorrhage history, etc.; (4) Confirm time of onset and eligibility (within 4.5 hours). Importantly, the AHA/ASA guidelines state that ONLY a blood glucose result is required before tPA administration. Complete blood count and chemistry panel should be drawn but should NOT delay tPA unless there is clinical suspicion of coagulopathy (known anticoagulant use, liver disease, hematological disorders). Waiting for lab results is one of the most common causes of door-to-needle time delays. MRI is more sensitive than CT for early ischemic changes but is NOT required before tPA - a CT excluding hemorrhage is sufficient. Neurology consultation should occur simultaneously but should not delay treatment. The emergency nurse should facilitate rapid BP control, verify the glucose is >50 mg/dL, and prepare the tPA dose for immediate administration.",
    learningObjective: "Expedite tPA preparation by controlling BP and verifying only essential prerequisites (glucose and contraindication screen)",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "TPA Administration Criteria",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Only blood GLUCOSE is required before tPA. Do NOT delay tPA for CBC, BMP, or coagulation studies unless clinical suspicion of abnormality",
    clinicalPearls: [
      "Only glucose is REQUIRED before tPA (must be >50 mg/dL)",
      "BP must be <185/110 before tPA initiation",
      "Draw labs but do NOT wait for results unless clinical suspicion of abnormality",
      "IV labetalol or nicardipine for pre-tPA BP control"
    ],
    safetyNote: "Waiting for unnecessary lab results is a major cause of DTN delays - every minute of delay = 1.9 million neurons lost",
    distractorRationales: [
      "CBC and chemistry should not delay tPA unless clinical suspicion of abnormality",
      "MRI is not required before tPA - CT excluding hemorrhage is sufficient",
      "Neurology should be consulted but treatment should not be delayed"
    ],
    lessonLink: "/emergency/lessons/tpa-administration"
  },
  {
    stem: "A patient receiving IV tPA for acute ischemic stroke suddenly develops worsening headache, vomiting, and increasing blood pressure 30 minutes into the infusion. Her NIHSS score has increased from 12 to 22. What should the emergency nurse do immediately?",
    options: [
      "Continue the tPA infusion and administer ondansetron for nausea",
      "Stop the tPA infusion immediately, obtain emergent CT head, draw stat coagulation studies (PT/INR, aPTT, fibrinogen, CBC), and prepare for possible reversal",
      "Increase the tPA infusion rate to improve reperfusion",
      "Administer IV labetalol for the hypertension and continue the infusion"
    ],
    correctAnswer: 1,
    rationaleLong: "The sudden development of worsening headache, vomiting, increasing blood pressure, and neurological deterioration (NIHSS increase from 12 to 22) during tPA infusion is the classic presentation of symptomatic intracranial hemorrhage (sICH), the most feared complication of thrombolytic therapy for stroke. sICH occurs in approximately 6.4% of patients receiving IV tPA and carries a mortality rate of approximately 45-50%. The immediate nursing actions are: (1) STOP the tPA infusion immediately - every additional minute of thrombolytic administration with active ICH increases the hemorrhage size and worsens outcomes; (2) Obtain an emergent non-contrast CT head to confirm ICH; (3) Draw STAT coagulation studies: PT/INR, aPTT, fibrinogen level, platelet count, and type and screen for blood products; (4) Prepare for hemorrhage reversal: cryoprecipitate (to replace fibrinogen, target fibrinogen >200 mg/dL), tranexamic acid (TXA) 1 gram IV, and platelet transfusion if count <100,000; (5) Manage blood pressure aggressively targeting SBP <140 mmHg; (6) Notify neurosurgery for possible surgical evacuation; (7) Prepare for emergent intubation if GCS continues to decline. The reversal of tPA-induced fibrinolysis focuses on replacing fibrinogen (depleted by tPA's action on plasminogen) and inhibiting ongoing fibrinolysis. Cryoprecipitate is the primary agent for fibrinogen replacement (10 units initially, targeting fibrinogen >200 mg/dL). Aminocaproic acid (4-5 grams IV) or tranexamic acid can also inhibit fibrinolysis. Any neurological deterioration during or after tPA infusion should be considered ICH until proven otherwise with emergent CT scan.",
    learningObjective: "Recognize and manage symptomatic intracranial hemorrhage during tPA infusion with immediate drug cessation and reversal protocols",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "TPA Administration Criteria",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Any neurological deterioration during tPA = stop infusion + emergent CT. Hemorrhage reversal: cryoprecipitate (fibrinogen replacement) + TXA",
    clinicalPearls: [
      "sICH rate with tPA: ~6.4%; mortality ~45-50%",
      "Signs: worsening headache, vomiting, rising BP, NIHSS increase during infusion",
      "Reversal: cryoprecipitate (target fibrinogen >200), TXA 1g, platelets if <100K",
      "NIHSS should be checked every 15 minutes during tPA infusion"
    ],
    safetyNote: "STOP tPA infusion immediately at the first sign of neurological deterioration - do not wait for CT confirmation to stop the drug",
    distractorRationales: [
      "Continuing the infusion with active ICH would be fatal",
      "Increasing the infusion rate would worsen the hemorrhage",
      "Treating only the BP without stopping tPA is dangerously inadequate"
    ],
    lessonLink: "/emergency/lessons/tpa-administration"
  },
  {
    stem: "A 25-year-old female presents to the ED with severe positional headache that is worse when standing and relieved when lying down. She had a lumbar puncture 3 days ago for evaluation of possible multiple sclerosis. What is the most likely diagnosis?",
    options: [
      "Post-dural puncture headache (PDPH) from CSF leak at the LP site",
      "Bacterial meningitis from LP contamination",
      "Tension-type headache from stress about her diagnosis",
      "Migraine with aura triggered by the lumbar puncture"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient has a post-dural puncture headache (PDPH), the most common complication of lumbar puncture, occurring in approximately 10-30% of patients after LP. PDPH is caused by a persistent CSF leak through the dural puncture site, which reduces the volume and pressure of CSF in the subarachnoid space. When the patient is upright, the reduced CSF volume causes the brain to sag within the cranium due to gravity, stretching the pain-sensitive meningeal structures and causing headache. When the patient lies down, the gravitational effect is eliminated, CSF pressure equalizes, and the headache improves. The hallmark feature of PDPH is its strong postural component: worse when upright (sitting or standing) and improved or resolved when supine. PDPH typically develops 24-48 hours after LP and can last several days to weeks. Risk factors include younger age, female sex, larger needle gauge, and cutting (Quincke) needles (vs non-cutting atraumatic Sprotte or Whitacre needles). Management includes: (1) Conservative measures: bed rest, oral hydration, caffeine (300-500 mg PO or IV caffeine sodium benzoate 500 mg), and oral analgesics; (2) Epidural blood patch (EBP) - the definitive treatment if conservative measures fail after 24-48 hours. EBP involves injecting 15-20 mL of the patient's autologous blood into the epidural space at or near the LP site, which patches the dural tear and restores CSF pressure. EBP has a success rate of approximately 70-90% with the first attempt. Meningitis from LP would present with fever, worsening headache regardless of position, and meningeal signs. Tension headache does not have the characteristic postural component. Migraines have typical aura features and are not exclusively positional.",
    learningObjective: "Recognize post-dural puncture headache by its characteristic postural pattern and manage with conservative measures or epidural blood patch",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Headache Red Flags",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "PDPH is POSITIONAL: worse upright, better supine. If headache worsens regardless of position with fever, consider meningitis",
    clinicalPearls: [
      "PDPH: positional headache worse upright, better supine (occurs 10-30% of LPs)",
      "Risk factors: young, female, large needle gauge, cutting needles",
      "Conservative: bed rest, caffeine, hydration, analgesics",
      "Epidural blood patch: definitive treatment if conservative measures fail (70-90% success)"
    ],
    safetyNote: "If post-LP headache is NOT positional and is associated with fever, evaluate for iatrogenic meningitis",
    distractorRationales: [
      "Meningitis from LP contamination would present with fever and non-positional headache",
      "Tension headache does not have the strong postural component",
      "Migraine is not exclusively positional and has typical aura features"
    ],
    lessonLink: "/emergency/lessons/headache-red-flags"
  },
  {
    stem: "A 60-year-old male presents to the ED with acute onset of vertigo, diplopia, dysphagia, and bilateral limb ataxia. MRI reveals an acute basilar artery occlusion. What makes this a particularly time-critical and dangerous presentation?",
    options: [
      "Basilar artery strokes have the same prognosis as other stroke types",
      "Basilar artery occlusion can cause locked-in syndrome, coma, and death because it supplies the brainstem, with mortality rates of 85-95% without intervention",
      "The basilar artery is not amenable to thrombectomy",
      "Basilar artery strokes always present with classic unilateral weakness"
    ],
    correctAnswer: 1,
    rationaleLong: "Basilar artery occlusion is one of the most devastating forms of acute ischemic stroke, with mortality rates of 85-95% without intervention. The basilar artery is formed by the confluence of the two vertebral arteries and supplies the brainstem (pons and medulla), cerebellum, thalamus, and parts of the occipital and temporal lobes. The brainstem is the most critical structure at risk because it contains: (1) The reticular activating system (consciousness); (2) All cranial nerve nuclei (III-XII); (3) All ascending and descending motor and sensory tracts connecting the brain to the body; (4) Vital respiratory and cardiovascular centers; (5) The corticospinal tracts (motor pathways to the body). Complete basilar artery occlusion can cause: (1) Locked-in syndrome - the patient is fully conscious but completely paralyzed except for vertical eye movements and blinking, because the corticospinal and corticobulbar tracts in the ventral pons are infarcted while the reticular activating system in the dorsal pons is spared; (2) Coma - if the reticular activating system is also involved; (3) Death - from respiratory failure and cardiovascular collapse. Basilar artery occlusion is increasingly recognized as amenable to endovascular thrombectomy, with the BASICS and ATTENTION trials demonstrating significant mortality reduction with thrombectomy compared to medical management alone. The treatment window may be extended because the brainstem has robust collateral supply through the posterior communicating arteries. The emergency nurse must recognize posterior circulation stroke symptoms (vertigo, diplopia, dysarthria, ataxia) and facilitate emergent evaluation and transfer to a comprehensive stroke center.",
    learningObjective: "Recognize basilar artery occlusion as the most dangerous type of ischemic stroke with extreme mortality without intervention",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Ischemic vs Hemorrhagic Stroke",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Basilar artery occlusion has 85-95% mortality without treatment. Locked-in syndrome is a devastating but survivable outcome where consciousness is preserved",
    clinicalPearls: [
      "Basilar occlusion: 85-95% mortality without intervention",
      "Locked-in syndrome: conscious but paralyzed (only vertical eye movement preserved)",
      "Posterior circulation symptoms: vertigo, diplopia, dysarthria, bilateral ataxia",
      "Thrombectomy reduces mortality significantly (BASICS/ATTENTION trials)"
    ],
    safetyNote: "Posterior circulation strokes can be initially subtle - any new vertigo with cranial nerve findings requires urgent stroke evaluation",
    distractorRationales: [
      "Basilar artery strokes have much worse prognosis than most other stroke types",
      "Basilar artery thrombectomy is increasingly performed with good outcomes",
      "Basilar strokes present with BILATERAL symptoms and cranial nerve findings, not classic unilateral weakness"
    ],
    lessonLink: "/emergency/lessons/stroke-recognition"
  },
  {
    stem: "An emergency nurse is performing a neurological assessment on a trauma patient. When testing the patient's pupillary response, one pupil is 4mm and reactive while the other is 7mm and fixed. The patient's GCS has decreased from 14 to 10 in the past 30 minutes. What does progressive pupillary asymmetry (anisocoria) with declining GCS most likely indicate?",
    options: [
      "Pre-existing anisocoria from a benign condition",
      "Expanding intracranial mass lesion causing transtentorial herniation with CN III compression",
      "Medication effect from opioid administration",
      "Direct traumatic injury to the eye"
    ],
    correctAnswer: 1,
    rationaleLong: "Progressive pupillary asymmetry (anisocoria) with a declining GCS in a trauma patient is a critical finding indicating an expanding intracranial mass lesion causing transtentorial (uncal) herniation. As the temporal lobe uncus herniates over the tentorium cerebelli, it compresses the ipsilateral oculomotor nerve (CN III). The parasympathetic fibers run on the outside of CN III and are compressed first, causing pupillary dilation (mydriasis) and loss of the light reflex on the affected side. The fixed, dilated pupil (7mm) is on the SAME SIDE as the mass lesion in most cases (ipsilateral). The declining GCS reflects progressive brainstem compression affecting the reticular activating system. This progression represents a neurosurgical emergency requiring immediate intervention: (1) Secure the airway with intubation (GCS 10 is approaching intubation threshold); (2) Administer osmotic therapy: mannitol 1 g/kg IV or hypertonic saline (23.4% 30 mL through central line or 3% NaCl 250-500 mL through peripheral IV); (3) Elevate head of bed to 30 degrees; (4) Brief hyperventilation to PaCO2 30-35 mmHg as a temporary measure; (5) Emergent CT head; (6) Emergent neurosurgical consultation for possible craniotomy. While pre-existing anisocoria (physiological anisocoria, affecting ~20% of the population) can cause pupillary asymmetry, it is typically <=1mm difference and does NOT change over time or correlate with GCS decline. Opioids cause bilateral miosis (pinpoint pupils), not unilateral dilation. Direct eye trauma can cause a fixed dilated pupil but would not explain the declining GCS.",
    learningObjective: "Interpret progressive anisocoria with declining GCS as transtentorial herniation requiring emergent neurosurgical intervention",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Increased ICP Management",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "NEW or PROGRESSIVE anisocoria in trauma = herniation until proven otherwise. Pre-existing anisocoria is typically <=1mm and stable",
    clinicalPearls: [
      "Progressive anisocoria + declining GCS = herniation = neurosurgical emergency",
      "Dilated fixed pupil is on the SAME side as the mass lesion (ipsilateral)",
      "Physiological anisocoria: <=1mm, stable, no GCS change (affects ~20% of population)",
      "Immediate treatment: mannitol or hypertonic saline, HOB 30, controlled ventilation"
    ],
    safetyNote: "Document and compare pupil sizes at every neurological check - progressive change of even 1mm is significant in trauma patients",
    distractorRationales: [
      "Pre-existing anisocoria is stable and does not correlate with GCS changes",
      "Opioids cause bilateral miosis, not unilateral dilation",
      "Eye trauma can cause a fixed pupil but would not explain declining consciousness"
    ],
    lessonLink: "/emergency/lessons/increased-icp"
  },
  {
    stem: "A 48-year-old female with a history of migraines presents to the ED with her 'usual migraine' that started 6 hours ago. She took sumatriptan at home without relief. She mentions this headache feels 'slightly different' - it came on more suddenly than usual. What should the emergency nurse's approach be?",
    options: [
      "Treat as a typical migraine with IV ketorolac and metoclopramide since she has a known migraine history",
      "Obtain a CT head to evaluate for secondary causes because any change in a patient's typical headache pattern requires investigation, even in known migraineurs",
      "Administer a second dose of sumatriptan for breakthrough migraine",
      "Discharge with a prescription for a stronger triptan"
    ],
    correctAnswer: 1,
    rationaleLong: "Any change in a patient's established headache pattern warrants evaluation for secondary (dangerous) causes of headache, even in patients with a known history of migraines. This is one of the most important principles in emergency headache assessment. The patient herself identified that this headache 'feels slightly different' and came on more suddenly than her typical migraines. These are significant red flags that should not be dismissed based on the assumption that the current headache is simply a more severe version of her usual migraines. Red flags in headache assessment that warrant further investigation include: (1) 'First or worst' headache - new headache type or worst headache ever experienced; (2) Change in pattern - different quality, location, or onset pattern from the patient's usual headaches; (3) Sudden onset (thunderclap) - suggesting SAH, RCVS, or other vascular pathology; (4) Progressive worsening over days to weeks - suggesting mass lesion or chronic subdural hematoma; (5) Headache with fever, neck stiffness, or neurological deficits; (6) Headache resistant to usual treatment (as in this case - sumatriptan failed); (7) New headache in patients over 50 (consider temporal arteritis); (8) Headache with Valsalva exacerbation (suggesting posterior fossa lesion). A CT head without contrast is the minimum evaluation for this patient. If CT is negative and clinical suspicion remains, lumbar puncture or CT angiography may be needed. Subarachnoid hemorrhage, brain tumor, and other life-threatening conditions can present initially as a headache that 'seems like a migraine.' Having a headache history provides neither immunity from dangerous pathology nor an excuse for inadequate evaluation. Administering another triptan without evaluation could mask a dangerous condition and delay treatment.",
    learningObjective: "Evaluate any change in an established headache pattern for secondary causes, even in patients with known migraine history",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Headache Red Flags",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "A history of migraines does NOT protect a patient from developing a new, dangerous headache. ANY change in pattern requires evaluation",
    clinicalPearls: [
      "Any change in established headache pattern = investigate for secondary cause",
      "Red flags: first/worst, sudden onset, pattern change, treatment failure, fever, neuro deficit",
      "Patients with migraines can also develop SAH, tumors, and other dangerous headaches",
      "Failed treatment with usual medications is a red flag for a different headache etiology"
    ],
    safetyNote: "The most commonly missed SAH occurs in patients with a known headache history who are assumed to have 'just another migraine'",
    distractorRationales: [
      "Treating as a typical migraine without evaluation ignores the change in pattern",
      "A second triptan dose without investigation could mask a dangerous condition",
      "Discharge without evaluation is inappropriate given the change in headache quality"
    ],
    lessonLink: "/emergency/lessons/headache-red-flags"
  },
  {
    stem: "A 65-year-old male with a large right MCA territory ischemic stroke is in the ED. He received tPA 3 hours ago but his neurological exam continues to worsen. NIHSS has increased from 16 to 24. The nurse notices his left arm and leg are flaccid and he has forced eye deviation to the right with decreasing consciousness. CT head shows a massive right hemispheric infarct with 8mm of midline shift and effacement of the right lateral ventricle. What life-threatening complication has developed?",
    options: [
      "Hemorrhagic transformation of the ischemic infarct",
      "Malignant cerebral edema causing transtentorial herniation",
      "Seizure activity causing worsening neurological exam",
      "tPA-induced coagulopathy causing systemic bleeding"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has developed malignant cerebral edema, a life-threatening complication of large hemispheric ischemic stroke that occurs when massive cytotoxic and vasogenic edema in the infarcted tissue causes progressive brain swelling with midline shift, herniation, and death. Malignant cerebral edema typically develops 2-5 days after a large MCA territory infarction, though it can begin within 24 hours. It occurs in approximately 10-15% of patients with large hemispheric strokes, predominantly in younger patients who have less brain atrophy and therefore less room for swelling. The mortality rate without surgical intervention is approximately 80%. The CT findings of 8mm midline shift and ventricular effacement confirm significant mass effect from the swollen infarcted hemisphere. The clinical signs include: forced eye deviation toward the side of the lesion (right), contralateral hemiplegia (left), progressive decrease in consciousness, and eventual uncal herniation with pupillary changes. The treatment for malignant cerebral edema is decompressive hemicraniectomy (DHC) - surgical removal of a large portion of the skull overlying the swollen hemisphere to allow the brain to expand outward rather than herniating downward. The DESTINY, DECIMAL, and HAMLET trials demonstrated that DHC performed within 48 hours of stroke onset significantly reduces mortality (from ~78% to ~29%) in patients under 60 years of age. Medical management (mannitol, hypertonic saline, hyperventilation) provides temporary ICP reduction but does not address the progressive swelling. While hemorrhagic transformation should also be considered (especially after tPA), the CT showed infarct with edema and midline shift rather than hemorrhage. Seizures would typically show electrical activity on exam (though non-convulsive SE should be considered). tPA-induced coagulopathy would manifest as bleeding, not cerebral edema.",
    learningObjective: "Recognize malignant cerebral edema as a complication of large hemispheric stroke requiring consideration of decompressive hemicraniectomy",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Increased ICP Management",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Malignant cerebral edema has 80% mortality without surgery. Decompressive hemicraniectomy reduces mortality from ~78% to ~29% when performed within 48 hours",
    clinicalPearls: [
      "Malignant edema: develops 2-5 days after large MCA stroke (can be earlier)",
      "Occurs in 10-15% of large hemispheric strokes",
      "Decompressive hemicraniectomy within 48 hours dramatically reduces mortality",
      "Medical measures (mannitol, hypertonic saline) are temporary bridges to surgery"
    ],
    safetyNote: "Neurosurgical consultation should be obtained early for any large hemispheric infarct, not after herniation has begun",
    distractorRationales: [
      "Hemorrhagic transformation would show hemorrhage on CT, not edema with midline shift",
      "Seizures should be considered but the CT findings explain the clinical deterioration",
      "tPA coagulopathy causes bleeding, not cerebral edema"
    ],
    lessonLink: "/emergency/lessons/increased-icp"
  },
  {
    stem: "A 72-year-old female presents to the ED with new-onset temporal headache, jaw claudication, and sudden painless vision loss in the right eye. ESR is 85 mm/hr (normal <30) and CRP is elevated. What condition does this presentation suggest and what is the emergent treatment?",
    options: [
      "Migraine with visual aura - administer sumatriptan",
      "Giant cell arteritis (temporal arteritis) - start high-dose corticosteroids immediately to prevent contralateral vision loss",
      "Retinal detachment - refer to ophthalmology within 1 week",
      "Optic neuritis from multiple sclerosis - start IV methylprednisolone"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with classic giant cell arteritis (GCA), also known as temporal arteritis. GCA is a systemic vasculitis affecting medium and large arteries, with a predilection for the temporal arteries and other branches of the external carotid artery. The classic features include: (1) New temporal headache in a patient over 50 years; (2) Jaw claudication (pain or fatigue in the jaw muscles during chewing, caused by ischemia of the masseter muscles from temporal artery inflammation); (3) Vision loss - the most feared complication, caused by arteritic anterior ischemic optic neuropathy (AION) from inflammation and thrombosis of the posterior ciliary arteries supplying the optic nerve; (4) Markedly elevated ESR (>50 mm/hr, often >100) and CRP. The emergent treatment is high-dose corticosteroids, which must be started IMMEDIATELY upon clinical suspicion - do NOT wait for temporal artery biopsy results. For GCA with vision loss, the recommended regimen is IV methylprednisolone 1 gram/day for 3-5 days, followed by oral prednisone 1 mg/kg/day with gradual taper over months. The rationale for immediate treatment is that GCA-related vision loss in one eye is frequently followed by vision loss in the contralateral eye within days to weeks if inflammation is not suppressed. Temporal artery biopsy should be performed within 2 weeks of starting steroids (biopsy remains positive despite steroid treatment for up to 2-4 weeks). The biopsy shows granulomatous inflammation with giant cells. The emergency nurse should ensure the steroids are administered without delay, ophthalmology is consulted emergently, and the patient is admitted for continued treatment and monitoring.",
    learningObjective: "Recognize giant cell arteritis with vision loss as an emergency requiring immediate high-dose corticosteroids",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Headache Red Flags",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Do NOT wait for temporal artery biopsy to start steroids in suspected GCA - contralateral vision loss can occur within days without treatment",
    clinicalPearls: [
      "GCA: temporal headache + jaw claudication + vision loss + elevated ESR/CRP in patient >50",
      "Start IV methylprednisolone 1g/day immediately - do not wait for biopsy",
      "Jaw claudication is the most specific symptom for GCA",
      "Biopsy remains positive for 2-4 weeks after starting steroids"
    ],
    safetyNote: "Untreated GCA with vision loss in one eye will cause bilateral blindness - immediate steroid treatment is vision-saving",
    distractorRationales: [
      "Migraine does not cause painless vision loss with elevated ESR/CRP and jaw claudication",
      "Retinal detachment requires emergent referral, not 1-week follow-up, but this presentation is not retinal detachment",
      "Optic neuritis from MS typically affects younger patients and does not cause elevated ESR/CRP or jaw claudication"
    ],
    lessonLink: "/emergency/lessons/headache-red-flags"
  },
  {
    stem: "A patient in the ED develops non-convulsive status epilepticus (NCSE). The patient appears confused and has subtle eye twitching but no obvious tonic-clonic activity. EEG shows continuous epileptiform discharges. Why is NCSE particularly dangerous in the ED?",
    options: [
      "NCSE is a benign condition that resolves spontaneously",
      "NCSE can be missed because it lacks dramatic motor manifestations, leading to delayed treatment and ongoing neuronal injury",
      "NCSE only occurs in patients with known epilepsy",
      "NCSE does not cause brain damage because there is no convulsive activity"
    ],
    correctAnswer: 1,
    rationaleLong: "Non-convulsive status epilepticus (NCSE) is one of the most underdiagnosed neurological emergencies in the ED because it lacks the dramatic tonic-clonic movements of convulsive SE, making it easily confused with other causes of altered mental status. Despite the absence of obvious motor manifestations, NCSE causes ongoing neuronal injury through continuous abnormal electrical activity that increases metabolic demand, causes excitotoxic damage from excessive glutamate release, disrupts the blood-brain barrier, and leads to progressive neurological deterioration. The clinical presentation of NCSE can be subtle and varied: confusion, decreased responsiveness, staring, subtle eye twitching or eye deviation, automatisms (repetitive purposeless movements), fluctuating level of consciousness, or even appearing to be 'just confused.' This mimics many other common ED presentations including delirium, metabolic encephalopathy, psychiatric disorders, and post-ictal states. NCSE should be suspected in any patient with: (1) Unexplained altered mental status; (2) Failure to improve after a witnessed seizure (persistent 'post-ictal' state); (3) Fluctuating consciousness; (4) Subtle motor signs (eyelid fluttering, nystagmus, lip smacking); (5) Known epilepsy with change in baseline. Diagnosis requires EEG (continuous EEG monitoring is ideal), which shows continuous or nearly continuous epileptiform discharges. Treatment follows the same algorithm as convulsive SE: benzodiazepines followed by second-line agents. The emergency nurse should advocate for EEG monitoring when NCSE is suspected and communicate concerns about persistent altered mental status that does not have a clear explanation. Studies suggest that NCSE occurs in approximately 8-20% of comatose ICU patients undergoing continuous EEG monitoring, highlighting how frequently it is missed.",
    learningObjective: "Recognize non-convulsive status epilepticus as a dangerous and commonly missed cause of altered mental status requiring EEG for diagnosis",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Seizure Management and Status Epilepticus",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "NCSE causes ongoing brain injury despite the absence of convulsions - it requires EEG for diagnosis and is one of the most underdiagnosed emergencies",
    clinicalPearls: [
      "NCSE: subtle or absent motor manifestations but continuous electrical seizure activity",
      "Suspect in unexplained AMS, persistent post-ictal state, fluctuating consciousness",
      "EEG is required for diagnosis - clinical exam alone is insufficient",
      "Treatment is the same as convulsive SE: benzodiazepines + second-line agents"
    ],
    safetyNote: "Any 'post-ictal' patient who does not return to baseline within 20-30 minutes should be evaluated for NCSE with EEG",
    distractorRationales: [
      "NCSE is NOT benign - it causes ongoing neuronal damage",
      "NCSE can occur in patients without prior epilepsy history",
      "Lack of convulsive activity does NOT mean lack of brain damage"
    ],
    lessonLink: "/emergency/lessons/seizure-management"
  }
];
