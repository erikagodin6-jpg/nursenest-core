import { EmergencyNursingQuestion } from "./types";

export const neuroEmergency7Questions: EmergencyNursingQuestion[] = [
  {
    stem: "A 45-year-old male presents with sudden onset of severe occipital headache, vomiting, and progressive ataxia. CT head shows a large cerebellar hemorrhage (3.5 cm) with compression of the fourth ventricle and early obstructive hydrocephalus. GCS is 13 and declining. What is the most critical intervention?",
    options: [
      "Emergent neurosurgical consultation for suboccipital craniectomy and hematoma evacuation",
      "IV mannitol alone and serial CT scans every 6 hours",
      "Lumbar puncture to relieve hydrocephalus",
      "Conservative management with blood pressure control only"
    ],
    correctAnswer: 0,
    rationaleLong: "Cerebellar hemorrhage >3 cm in diameter with neurological deterioration is a neurosurgical emergency requiring suboccipital craniectomy with hematoma evacuation. The posterior fossa is a confined space, and cerebellar hemorrhages have unique and life-threatening complications: (1) Fourth ventricle compression causing acute obstructive hydrocephalus (present in this patient), leading to rapidly rising ICP, (2) Direct brainstem compression from the expanding hematoma, potentially causing respiratory arrest and death, (3) Upward transtentorial herniation (cerebellum herniates upward through the tentorial notch) or tonsillar herniation (cerebellar tonsils herniate downward through the foramen magnum, compressing the medulla). The AHA/ASA guidelines recommend surgical evacuation for cerebellar hemorrhages >3 cm or those causing neurological deterioration, hydrocephalus, or brainstem compression. Surgery for cerebellar hemorrhage has the best outcomes of all ICH surgical indications because the cerebellum is more resilient to surgical manipulation than the cerebral hemispheres, and the procedure relieves both the mass effect and the obstructive hydrocephalus. An EVD (external ventricular drain) may be placed simultaneously to manage hydrocephalus, but EVD alone without hematoma evacuation risks upward herniation by creating a pressure differential. Mannitol alone is a temporizing measure but insufficient for a surgical lesion. Lumbar puncture is ABSOLUTELY CONTRAINDICATED as it can precipitate tonsillar herniation by creating a craniospinal pressure gradient. Conservative management with declining GCS would lead to brainstem compression and death.",
    learningObjective: "Recognize cerebellar hemorrhage >3 cm with declining GCS as a neurosurgical emergency requiring posterior fossa decompression",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Intracerebral Hemorrhage",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Cerebellar hemorrhage >3 cm or with deterioration = surgery; LP is CONTRAINDICATED (tonsillar herniation risk)",
    clinicalPearls: [
      "Cerebellar ICH >3 cm with deterioration = surgical emergency",
      "Posterior fossa hemorrhage is the most surgically treatable ICH location",
      "Fourth ventricle compression causes obstructive hydrocephalus",
      "EVD alone without hematoma evacuation risks upward herniation"
    ],
    safetyNote: "LP in posterior fossa hemorrhage can cause fatal tonsillar herniation - absolute contraindication",
    distractorRationales: [
      "Suboccipital craniectomy with evacuation addresses mass effect and hydrocephalus",
      "Mannitol alone is insufficient for a surgical lesion with declining GCS",
      "LP can precipitate fatal tonsillar herniation",
      "Conservative management with declining GCS leads to brainstem compression"
    ],
    lessonLink: "/emergency/lessons/intracerebral-hemorrhage"
  },
  {
    stem: "A 30-year-old female with systemic lupus erythematosus (SLE) presents with headache, confusion, seizures, and visual disturbances. MRI shows bilateral symmetric white matter edema predominantly in the posterior parietal and occipital regions. BP is 195/118 mmHg. What is the diagnosis?",
    options: [
      "Posterior reversible encephalopathy syndrome (PRES) - requiring aggressive blood pressure reduction",
      "Lupus cerebritis requiring high-dose IV cyclophosphamide",
      "Ischemic stroke in bilateral PCA territories",
      "Progressive multifocal leukoencephalopathy (PML)"
    ],
    correctAnswer: 0,
    rationaleLong: "Posterior Reversible Encephalopathy Syndrome (PRES) is a clinico-radiological syndrome characterized by headache, confusion, seizures, and visual disturbances with characteristic MRI findings of vasogenic edema predominantly affecting the posterior white matter (parietal and occipital lobes bilaterally). The posterior predilection is believed to result from the relative paucity of sympathetic innervation of the posterior cerebral circulation, making it more susceptible to autoregulatory breakthrough during severe hypertension. PRES is associated with: (1) Severe hypertension (most common cause), (2) Eclampsia/preeclampsia, (3) Immunosuppressive therapy (cyclosporine, tacrolimus, sirolimus), (4) Autoimmune diseases (SLE, as in this patient), (5) Renal failure, (6) Sepsis/shock. The pathophysiology involves failure of cerebral autoregulation leading to endothelial dysfunction, blood-brain barrier breakdown, and vasogenic edema (NOT cytotoxic edema, which is important because vasogenic edema is reversible while cytotoxic is not). Treatment focuses on: (1) Aggressive blood pressure reduction - IV labetalol or nicardipine targeting 25% MAP reduction in the first few hours, (2) Seizure management with IV lorazepam and levetiracetam, (3) Identification and treatment of the underlying cause (e.g., adjusting immunosuppressive medications), (4) Close neurological monitoring. With prompt treatment, PRES is typically fully reversible (hence the name), with resolution of edema on follow-up MRI within days to weeks. However, delayed or inadequate treatment can lead to progression to cytotoxic edema, infarction, and permanent neurological damage.",
    learningObjective: "Diagnose PRES based on clinical presentation and characteristic posterior white matter MRI findings",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Hypertensive Neurological Emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "PRES: posterior white matter edema + hypertension/eclampsia/immunosuppression = reversible with prompt BP control",
    clinicalPearls: [
      "PRES predominantly affects posterior parietal and occipital white matter bilaterally",
      "Vasogenic edema (reversible) not cytotoxic edema (irreversible)",
      "Causes: hypertension, eclampsia, cyclosporine/tacrolimus, SLE, renal failure",
      "Fully reversible with prompt treatment - edema resolves on follow-up MRI"
    ],
    safetyNote: "Delayed treatment of PRES can progress to irreversible cytotoxic edema and infarction",
    distractorRationales: [
      "PRES: bilateral posterior white matter edema in hypertensive SLE patient",
      "Lupus cerebritis shows different MRI pattern and requires different treatment",
      "Bilateral PCA stroke causes cytotoxic (not vasogenic) edema in cortical territory",
      "PML has asymmetric white matter lesions without enhancement"
    ],
    lessonLink: "/emergency/lessons/hypertensive-neurological-emergencies"
  },
  {
    stem: "A 50-year-old male with diabetes presents with fever, severe ear pain, otorrhea, and right facial nerve palsy (CN VII). He has had chronic otitis externa for 3 weeks that has not responded to topical antibiotics. CT temporal bone shows bony erosion of the skull base. What is the diagnosis?",
    options: [
      "Malignant (necrotizing) otitis externa - a life-threatening skull base osteomyelitis requiring IV anti-pseudomonal antibiotics",
      "Acute otitis media with mastoiditis",
      "Cholesteatoma with facial nerve erosion",
      "Bell's palsy coinciding with ear infection"
    ],
    correctAnswer: 0,
    rationaleLong: "Malignant (necrotizing) otitis externa is a life-threatening infection that extends beyond the external ear canal to involve the temporal bone, skull base, and potentially the intracranial structures. Despite the name 'malignant,' it is an infection, not a cancer. It almost exclusively affects diabetic patients and immunocompromised individuals (HIV/AIDS, chemotherapy). The causative organism is Pseudomonas aeruginosa in >95% of cases. The pathophysiology involves: initial otitis externa → infection spreads through the fissures of Santorini and osteocartilaginous junction → temporal bone osteomyelitis → skull base osteomyelitis → cranial nerve involvement. Cranial nerve palsies are a hallmark of progressive disease: CN VII (facial nerve) is affected first and most commonly because it traverses the temporal bone adjacent to the ear canal. If untreated, the infection can spread to involve CN IX, X, XI (jugular foramen) and CN XII (hypoglossal canal), and can eventually cause sigmoid sinus thrombosis, meningitis, and brain abscess. Treatment requires: (1) Long-term IV anti-pseudomonal antibiotics for 6-8 weeks minimum (ciprofloxacin IV/PO, or IV piperacillin-tazobactam, cefepime, or meropenem for severe cases), (2) Surgical debridement of necrotic bone, (3) Strict glucose control, (4) Serial gallium-67 or technetium-99m bone scans to monitor treatment response (ESR/CRP also tracked). Mortality is 10-20% even with treatment, and higher if intracranial complications develop. The emergency nurse should obtain blood cultures, glucose, ESR/CRP, and prepare for CT temporal bone imaging.",
    learningObjective: "Recognize malignant otitis externa as skull base osteomyelitis in diabetic patients requiring emergent IV antibiotics",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "CNS Infections",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Diabetic + chronic otitis externa + facial nerve palsy + skull base erosion = malignant OE (Pseudomonas); NOT Bell's palsy",
    clinicalPearls: [
      "Pseudomonas aeruginosa causes >95% of malignant otitis externa",
      "Almost exclusively in diabetics and immunocompromised patients",
      "CN VII is the first and most commonly affected cranial nerve",
      "Treatment: 6-8 weeks IV anti-pseudomonal antibiotics + surgical debridement"
    ],
    safetyNote: "Malignant otitis externa can progress to meningitis and brain abscess if not treated aggressively",
    distractorRationales: [
      "Malignant OE: diabetic + chronic OE + skull base erosion + CN palsy",
      "Acute otitis media involves the middle ear, not the skull base",
      "Cholesteatoma develops slowly and has different CT appearance",
      "Bell's palsy does not cause ear pain, otorrhea, or bony erosion"
    ],
    lessonLink: "/emergency/lessons/cns-infections"
  },
  {
    stem: "A 70-year-old female presents with sudden onset of right arm monoplegia. She can move her right leg and left side normally. CT head shows a small cortical infarct in the left precentral gyrus 'hand knob' area. What is this type of stroke called?",
    options: [
      "Small cortical (embolic) infarct causing isolated motor deficit - likely from a cardiac or aortic embolic source",
      "Lacunar infarct from small vessel disease",
      "Watershed (border zone) infarct from hypoperfusion",
      "Large vessel atherosclerotic occlusion"
    ],
    correctAnswer: 0,
    rationaleLong: "This presentation of isolated right arm weakness with a small infarct in the left precentral gyrus 'hand knob' area (the omega-shaped region of the motor cortex representing hand function) is characteristic of a small cortical (embolic) infarct. The hand knob is a well-defined anatomical landmark on the precentral gyrus that can be identified on axial MRI and represents the cortical motor representation of the hand and fingers. Small cortical infarcts affecting this region cause highly focal deficits (isolated hand/arm weakness) because the motor cortex has a somatotopic organization (motor homunculus) where different body parts are represented in specific cortical areas. This type of infarct is typically caused by cardioembolism (atrial fibrillation, valvular disease, PFO with paradoxical embolism) or artery-to-artery embolism (aortic arch atheroma, carotid plaque). The key distinction from lacunar infarcts is the CORTICAL location. Lacunar infarcts are subcortical (in the basal ganglia, internal capsule, thalamus, or pons) and are caused by small vessel lipohyalinosis or microatheroma. Pure motor hemiparesis from a lacunar infarct typically affects the face, arm, AND leg (because the motor fibers converge in the compact internal capsule), unlike this case of isolated arm weakness. The workup should include cardiac monitoring for atrial fibrillation, echocardiography (including TEE with bubble study for PFO), carotid imaging, and hypercoagulability testing in appropriate patients. This case illustrates why detailed neurological examination is essential - the pattern of deficit guides the localization and etiological workup.",
    learningObjective: "Differentiate small cortical embolic infarcts from lacunar infarcts based on deficit pattern and imaging",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Stroke Management",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Isolated arm weakness with cortical infarct = embolic source; lacunar infarcts cause face+arm+leg involvement",
    clinicalPearls: [
      "Hand knob is the omega-shaped area of precentral gyrus representing hand motor function",
      "Small cortical infarcts suggest cardioembolic or artery-to-artery embolic source",
      "Lacunar infarcts are subcortical and cause more uniform face+arm+leg deficits",
      "Workup: cardiac monitoring, echo with TEE, carotid imaging"
    ],
    safetyNote: "Isolated limb weakness from cortical infarct suggests embolic source - investigate for AF and cardiac emboli",
    distractorRationales: [
      "Small cortical infarct in hand knob with isolated arm weakness suggests embolic source",
      "Lacunar infarcts are subcortical and cause different deficit patterns",
      "Watershed infarcts occur at border zones between vascular territories",
      "Large vessel occlusion causes more extensive territory involvement"
    ],
    lessonLink: "/emergency/lessons/stroke-management"
  },
  {
    stem: "A 35-year-old male presents with progressive bilateral lower extremity weakness, back pain, and urinary retention developing over 4 hours. He had a lumbar epidural steroid injection yesterday. MRI shows a spinal epidural hematoma at L2-L4. What is the time window for optimal surgical outcome?",
    options: [
      "Surgical decompression within 12 hours of symptom onset for the best chance of neurological recovery",
      "Surgery can be delayed up to 72 hours without affecting outcome",
      "Conservative management with serial MRIs is preferred for epidural hematomas",
      "Surgery should be performed only if complete paralysis develops"
    ],
    correctAnswer: 0,
    rationaleLong: "Spinal epidural hematoma (SEH) causing neurological deficits is a surgical emergency requiring decompressive laminectomy within the narrowest possible time window. The evidence strongly supports that surgical decompression within 12 hours of symptom onset is associated with the best neurological outcomes, with some studies showing optimal results when surgery occurs within 6-8 hours. The relationship between time to surgery and outcome is essentially linear - every hour of delay reduces the probability of neurological recovery. In this case, the spinal epidural hematoma developed as a complication of the lumbar epidural steroid injection, which is the most common iatrogenic cause of SEH. Other causes include: anticoagulation therapy, coagulopathies, spinal surgery, spinal trauma, and vascular malformations. Spontaneous SEH also occurs, particularly in anticoagulated patients. The clinical presentation follows a predictable pattern: acute back pain at the level of the hematoma → radiculopathy → progressive motor weakness below the level → sensory changes → sphincter dysfunction (urinary retention/incontinence). This patient has already progressed to bilateral weakness and urinary retention, indicating significant cord or cauda equina compression. MRI is the gold standard diagnostic study, showing a biconvex epidural collection that is hypointense on T1 and hyperintense on T2 in the acute phase. The surgical approach is posterior laminectomy with hematoma evacuation and hemostasis. Waiting for complete paralysis dramatically worsens the prognosis - complete deficits present for >24-48 hours have very poor recovery rates.",
    learningObjective: "Recognize the critical time window of <12 hours for surgical decompression of spinal epidural hematoma",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Spinal Cord Emergencies",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Spinal epidural hematoma with neuro deficits: surgery within 12 hours (ideally 6-8 hours) for best outcomes",
    clinicalPearls: [
      "SEH surgery within 12 hours for optimal neurological recovery",
      "Most common iatrogenic cause: epidural procedures",
      "Progression: back pain → radiculopathy → weakness → sphincter dysfunction",
      "Complete deficit >24-48 hours has very poor recovery prognosis"
    ],
    safetyNote: "Monitor all post-epidural procedure patients for new back pain, weakness, or urinary retention - SEH can progress rapidly",
    distractorRationales: [
      "12-hour window for surgical decompression provides best neurological outcomes",
      "72-hour delay would result in permanent neurological damage",
      "Conservative management is inappropriate for SEH with progressive neurological deficits",
      "Waiting for complete paralysis dramatically worsens outcomes"
    ],
    lessonLink: "/emergency/lessons/spinal-cord-emergencies"
  },
  {
    stem: "A 60-year-old male presents with acute onset of vertigo, vomiting, and severe gait ataxia. He cannot sit unsupported. CT head is negative. He is diagnosed with acute cerebellar stroke. Which complication of cerebellar stroke is the emergency nurse's greatest concern in the first 72 hours?",
    options: [
      "Malignant cerebellar edema causing brainstem compression and obstructive hydrocephalus",
      "Hemorrhagic transformation of the cerebellar infarct",
      "Chronic post-stroke cerebellar ataxia",
      "Post-stroke depression and anxiety"
    ],
    correctAnswer: 0,
    rationaleLong: "The greatest concern in cerebellar stroke during the first 72 hours is the development of malignant cerebellar edema. The posterior fossa is an enclosed space with limited room for expansion, bounded by the tentorium cerebelli superiorly and the foramen magnum inferiorly. As the infarcted cerebellar tissue swells (typically peaking at 48-72 hours post-stroke), the edema can cause two life-threatening complications: (1) Direct brainstem compression: The swollen cerebellum presses against the brainstem (pons and medulla), which houses vital respiratory and cardiovascular centers. Brainstem compression can cause rapid deterioration from consciousness to coma and respiratory arrest. (2) Obstructive hydrocephalus: The edematous cerebellum compresses the fourth ventricle, blocking CSF outflow and causing acute hydrocephalus with rapidly rising ICP. This combination can be fatal within hours. Approximately 20-25% of cerebellar stroke patients develop clinically significant edema requiring intervention. The emergency nurse must perform serial neurological assessments (every 1-2 hours) monitoring for: decreasing GCS, new headache or worsening vomiting, new cranial nerve palsies (particularly CN VI), and progressive ataxia. If malignant edema develops, the treatment is emergent suboccipital decompressive craniectomy with or without EVD placement. An EVD alone (without posterior fossa decompression) can worsen upward herniation. The nurse should ensure the neurosurgical team is aware of all cerebellar stroke patients for potential emergency intervention.",
    learningObjective: "Monitor for malignant cerebellar edema causing brainstem compression and obstructive hydrocephalus in the first 72 hours",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Posterior Circulation Stroke",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Cerebellar stroke: edema peaks 48-72 hours → brainstem compression + hydrocephalus → may need posterior fossa decompression",
    clinicalPearls: [
      "Posterior fossa edema peaks at 48-72 hours post-stroke",
      "20-25% of cerebellar strokes develop significant edema",
      "Monitor every 1-2 hours: GCS, vomiting, CN palsies, pupil changes",
      "EVD alone without decompression can worsen upward herniation"
    ],
    safetyNote: "Alert neurosurgery for ALL cerebellar stroke patients - deterioration can be sudden and rapidly fatal",
    distractorRationales: [
      "Malignant edema with brainstem compression is the most critical early complication",
      "Hemorrhagic transformation is a concern but less immediately life-threatening",
      "Chronic ataxia is a long-term concern, not an acute emergency",
      "Depression is important but not the priority concern in the first 72 hours"
    ],
    lessonLink: "/emergency/lessons/posterior-circulation-stroke"
  },
  {
    stem: "A 22-year-old male presents after a witnessed generalized tonic-clonic seizure. He is postictal with left arm weakness that was not present before the seizure. The weakness gradually improves over 30 minutes. CT head is normal. What is this phenomenon called?",
    options: [
      "Todd's paralysis (postictal paresis) - a transient focal neurological deficit following a seizure that resolves within 24-48 hours",
      "New ischemic stroke requiring emergent thrombolysis",
      "Conversion disorder (functional neurological symptom disorder)",
      "Spinal cord injury from seizure-related trauma"
    ],
    correctAnswer: 0,
    rationaleLong: "Todd's paralysis (also called Todd's paresis or postictal paresis) is a transient focal neurological deficit that occurs following a seizure, most commonly manifesting as hemiparesis (weakness) contralateral to the seizure focus. It can also present as aphasia, visual field deficits, or other focal findings depending on the cortical area affected. The key characteristics are: (1) It follows a seizure (not preceding it), (2) It is transient, typically resolving within 15 minutes to 48 hours (most commonly within 15-60 minutes), (3) It reflects temporary exhaustion or inhibition of the cortical neurons that were excessively activated during the seizure, (4) CT head is typically normal (no acute stroke). The clinical challenge is that Todd's paralysis can perfectly mimic acute stroke, and the emergency team must distinguish between the two because acute stroke requires time-sensitive treatment. Important differentiating factors include: witnessed seizure preceding the deficit, known epilepsy history, progressive improvement over minutes to hours (stroke deficits are typically persistent or worsening), and age (Todd's can occur at any age but young patients without vascular risk factors are more likely). However, it is critically important to recognize that seizures can also be a SYMPTOM of acute stroke, particularly in hemorrhagic stroke. Therefore, any new focal deficit after a seizure MUST be evaluated with emergent imaging (CT or MRI) to exclude stroke, even if Todd's paralysis is suspected. The emergency nurse should document the exact timing and quality of the weakness, perform serial neurological assessments, and ensure imaging is completed promptly.",
    learningObjective: "Recognize Todd's paralysis as a postictal phenomenon while maintaining vigilance for acute stroke",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Seizure Management",
    difficulty: 2,
    cognitiveLevel: "comprehension",
    questionType: "MCQ_SINGLE",
    examTrap: "Todd's paralysis is transient but seizures can also BE a stroke symptom - always image to exclude stroke",
    clinicalPearls: [
      "Todd's paralysis: postictal focal deficit lasting minutes to 48 hours",
      "Most common: contralateral hemiparesis; also aphasia, visual field deficits",
      "Reflects cortical neuron exhaustion from excessive seizure activity",
      "Seizures can be a symptom of stroke - always get imaging"
    ],
    safetyNote: "Never assume Todd's paralysis without imaging - seizure can be the presenting symptom of acute stroke",
    distractorRationales: [
      "Todd's paralysis: transient postictal deficit resolving within 48 hours, CT normal",
      "Stroke deficits are persistent/worsening, not improving over 30 minutes",
      "Conversion disorder is a diagnosis of exclusion requiring thorough workup",
      "Spinal cord injury would cause bilateral/level findings, not unilateral arm weakness"
    ],
    lessonLink: "/emergency/lessons/seizure-management"
  },
  {
    stem: "A 75-year-old male on aspirin and clopidogrel presents with a large spontaneous intracerebral hemorrhage. Platelet count is 180,000/μL. Should platelet transfusion be administered?",
    options: [
      "Platelet transfusion is NOT recommended - the PATCH trial showed worsened outcomes with platelet transfusion for antiplatelet-associated ICH",
      "Transfuse 1 unit of platelets for each antiplatelet agent the patient is taking",
      "Transfuse platelets only if platelet count is below 100,000/μL",
      "Transfuse 6 units of platelets immediately to reverse antiplatelet effect"
    ],
    correctAnswer: 0,
    rationaleLong: "The PATCH trial (Platelet Transfusion versus Standard Care after Acute Stroke due to Spontaneous Cerebral Haemorrhage Associated with Antiplatelet Therapy), published in The Lancet in 2016, was a landmark randomized controlled trial that demonstrated platelet transfusion WORSENED outcomes in patients with antiplatelet-associated intracerebral hemorrhage. Patients who received platelet transfusion had significantly higher odds of death or dependence at 3 months compared to standard care (adjusted odds ratio 2.05). The proposed mechanisms for harm include: (1) Platelet activation and aggregation from transfused platelets may promote thrombotic complications including venous thromboembolism and myocardial infarction, (2) Transfusion-related inflammatory responses, (3) The platelet transfusion may not effectively reverse the antiplatelet effect on existing circulating platelets (aspirin and clopidogrel irreversibly inhibit platelet function for the 7-10 day platelet lifespan, and transfused platelets represent only a small fraction of total platelets). Based on this evidence, the AHA/ASA ICH guidelines do NOT recommend platelet transfusion for antiplatelet-associated ICH. The management focus should instead be on: aggressive blood pressure control (SBP <140 mmHg), surgical consultation for indicated cases, correction of any coagulopathy from other causes, and supportive care. It is important to note that this recommendation applies to ICH specifically - platelet transfusion may still be indicated for active hemorrhage in surgical settings or for thrombocytopenia (platelet count <100,000/μL).",
    learningObjective: "Recognize that platelet transfusion is not recommended for antiplatelet-associated ICH based on PATCH trial evidence",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Intracerebral Hemorrhage",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "PATCH trial: platelet transfusion WORSENED outcomes in antiplatelet-associated ICH - do NOT transfuse",
    clinicalPearls: [
      "PATCH trial: platelet transfusion increased death/dependence in antiplatelet ICH",
      "Focus on BP control (SBP <140) rather than platelet transfusion",
      "Aspirin/clopidogrel irreversibly inhibit platelets for 7-10 day lifespan",
      "Platelet transfusion may still be indicated for thrombocytopenia (<100K)"
    ],
    safetyNote: "Platelet transfusion in antiplatelet-associated ICH may increase mortality - this is a harmful intervention",
    distractorRationales: [
      "PATCH trial evidence shows platelet transfusion worsens ICH outcomes",
      "Number of antiplatelet agents does not change the transfusion recommendation",
      "Platelet count is normal at 180K; thrombocytopenia threshold doesn't apply",
      "6-unit platelet transfusion has been proven harmful in this setting"
    ],
    lessonLink: "/emergency/lessons/intracerebral-hemorrhage"
  },
  {
    stem: "A 55-year-old female presents with sudden onset of complete bilateral vision loss after cardiac catheterization. She is alert and oriented. Pupillary light reflexes are intact bilaterally. Fundoscopic examination is normal. CT head shows bilateral occipital lobe infarctions. She insists she can see normally despite bumping into objects. What additional phenomenon is present?",
    options: [
      "Anton syndrome (visual anosognosia) - the patient confabulates visual experiences despite complete cortical blindness",
      "Charles Bonnet syndrome - visual hallucinations in visually impaired patients",
      "Balint syndrome - simultanagnosia, optic ataxia, and oculomotor apraxia",
      "Prosopagnosia - inability to recognize familiar faces"
    ],
    correctAnswer: 0,
    rationaleLong: "Anton syndrome (visual anosognosia) is a rare but striking neurological condition in which a patient with cortical blindness is unaware of and denies their visual deficit, often confabulating detailed visual descriptions of their environment that are inaccurate. This patient demonstrates all hallmark features: (1) Complete bilateral visual loss (from bilateral occipital infarctions - a complication of cardiac catheterization, likely from cholesterol crystal or air emboli to both posterior cerebral arteries), (2) Intact pupillary reflexes (confirming the lesion is cortical, not in the eyes or optic nerves - the pupillary reflex arc goes through the midbrain, not the visual cortex), (3) Normal fundoscopic examination (the retina is intact), (4) Denial of blindness with confabulation ('insists she can see normally despite bumping into objects'). The proposed mechanism involves disconnection between the primary visual cortex (destroyed) and visual association areas (partially preserved), along with disruption of self-monitoring mechanisms that normally provide awareness of sensory deficits. The visual association areas may generate confabulated 'visual experiences' based on memory and expectation. Anton syndrome is important for emergency nurses to recognize because: these patients are at extreme fall and injury risk (they attempt to navigate using confabulated vision), they may refuse assistance because they believe they can see, and they require constant supervision and a safe environment. Charles Bonnet syndrome involves formed visual hallucinations (not denial of blindness). Balint syndrome involves spatial processing deficits. Prosopagnosia specifically affects face recognition.",
    learningObjective: "Recognize Anton syndrome as denial of cortical blindness with confabulation and implement appropriate safety measures",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Visual Emergencies in Stroke",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Cortical blindness + denial of vision loss + confabulation = Anton syndrome; extreme fall risk from confabulated vision",
    clinicalPearls: [
      "Anton syndrome: cortical blindness + denial + confabulation of visual experiences",
      "Caused by bilateral occipital lobe damage with spared visual association areas",
      "Intact pupils confirm cortical (not retinal/nerve) cause of blindness",
      "Cardiac catheterization can cause bilateral PCA embolism"
    ],
    safetyNote: "Anton syndrome patients will attempt to walk and navigate using false visual information - constant supervision required",
    distractorRationales: [
      "Anton syndrome: cortical blindness with denial and confabulation",
      "Charles Bonnet involves visual hallucinations but patients know they can't see",
      "Balint syndrome affects visual spatial processing, not vision itself",
      "Prosopagnosia specifically affects face recognition, not total blindness"
    ],
    lessonLink: "/emergency/lessons/visual-emergencies-stroke"
  },
  {
    stem: "A 62-year-old male presents with acute right leg monoplegia. CT angiography shows an occlusion of the left anterior cerebral artery (ACA). Which additional deficit should the emergency nurse assess for that is specific to ACA territory stroke?",
    options: [
      "Urinary incontinence and personality/behavioral changes (abulia) from frontal lobe involvement",
      "Receptive aphasia from temporal lobe involvement",
      "Homonymous hemianopia from occipital lobe involvement",
      "Contralateral upper extremity weakness worse than lower extremity"
    ],
    correctAnswer: 0,
    rationaleLong: "The anterior cerebral artery (ACA) supplies the medial surface of the frontal and parietal lobes, including the motor and sensory cortex for the lower extremity (which is located on the medial surface of the hemispheres, within the interhemispheric fissure). ACA stroke characteristically causes contralateral lower extremity weakness and sensory loss that is MORE severe than the upper extremity (opposite to MCA stroke where arm and face weakness predominate). This explains the isolated right leg monoplegia. Additional ACA territory-specific deficits include: (1) Urinary incontinence: from damage to the medial frontal micturition center (supplementary motor area), which controls voluntary bladder function, (2) Personality and behavioral changes: the ACA supplies the medial prefrontal cortex and anterior cingulate cortex, which are critical for motivation, initiative, and personality. Damage causes abulia (lack of will or initiative - the patient appears apathetic and requires prompting to initiate activities), (3) Alien hand syndrome (callosal variant): if the corpus callosum is affected, the contralateral hand may exhibit involuntary, purposeful-appearing movements, (4) Transcortical motor aphasia (left ACA): reduced speech output with preserved repetition. The emergency nurse should specifically assess: bladder function (urinary retention or incontinence), behavioral status (apathy, reduced spontaneity, inappropriate social behavior), and bilateral lower extremity motor function. Receptive aphasia is Wernicke's area (MCA territory). Homonymous hemianopia is PCA territory. UE > LE weakness is the MCA pattern, opposite of ACA.",
    learningObjective: "Identify ACA territory-specific deficits including leg weakness, urinary incontinence, and behavioral changes",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Stroke Management",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "ACA stroke: leg > arm weakness + urinary incontinence + abulia; MCA stroke: face+arm > leg weakness",
    clinicalPearls: [
      "ACA supplies medial frontal/parietal = LE motor/sensory cortex",
      "ACA deficit pattern: LE > UE weakness (opposite of MCA pattern)",
      "Urinary incontinence from medial frontal micturition center damage",
      "Abulia: lack of initiative/motivation from prefrontal damage"
    ],
    safetyNote: "Assess for urinary retention/incontinence and implement bladder management in ACA stroke",
    distractorRationales: [
      "Urinary incontinence and abulia are specific to ACA territory involvement",
      "Receptive aphasia localizes to Wernicke's area in MCA territory",
      "Homonymous hemianopia localizes to PCA territory",
      "UE > LE weakness is the MCA pattern, opposite of ACA"
    ],
    lessonLink: "/emergency/lessons/stroke-management"
  },
  {
    stem: "A 40-year-old male presents with severe headache, seizures, and focal neurological deficits. He has a history of IV drug use. CT head shows a ring-enhancing lesion with surrounding edema. What is the most likely diagnosis and initial management?",
    options: [
      "Brain abscess - start empiric IV antibiotics (vancomycin + ceftriaxone + metronidazole) and obtain neurosurgical consultation",
      "Primary brain tumor - start IV dexamethasone and plan for elective biopsy",
      "Cerebral toxoplasmosis - start pyrimethamine and sulfadiazine",
      "Cysticercosis - start albendazole and dexamethasone"
    ],
    correctAnswer: 0,
    rationaleLong: "In an IV drug user presenting with ring-enhancing brain lesion, seizures, and focal deficits, brain abscess is the most likely diagnosis. Brain abscess is a focal collection of pus within the brain parenchyma that forms through direct extension (sinusitis, otitis, dental infection), hematogenous spread (endocarditis, pulmonary infections, IV drug use), or post-traumatic/post-surgical inoculation. IV drug use is a significant risk factor because: (1) bacteremia from contaminated needles can seed the brain hematogenously, (2) right-to-left cardiac shunts from tricuspid valve endocarditis can allow septic emboli to reach the cerebral circulation, (3) immunocompromise may be present (HIV coinfection). The causative organisms typically include: Streptococcus species (60-70% of cases), Staphylococcus aureus (especially with IV drug use and post-traumatic), anaerobes (Bacteroides, Fusobacterium), and gram-negative bacilli. Empiric antibiotic coverage must be broad: vancomycin (MRSA coverage), ceftriaxone or cefotaxime (gram-negative and streptococcal coverage), AND metronidazole (anaerobic coverage). CT characteristics of brain abscess include: ring enhancement with contrast (the capsule enhances), surrounding vasogenic edema, and often restricted diffusion on MRI DWI (which distinguishes abscess from tumor - abscesses show bright DWI signal while tumors typically do not). Neurosurgical consultation is essential for: aspiration/drainage (stereotactic or open) for abscesses >2.5 cm, culture-directed antibiotic therapy based on aspirate, and abscesses causing significant mass effect. Total antibiotic duration is typically 6-8 weeks IV. Toxoplasmosis would be considered in HIV-positive patients with CD4 <100.",
    learningObjective: "Diagnose brain abscess in an IV drug user and initiate broad-spectrum empiric antibiotics with neurosurgical consultation",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "CNS Infections",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Ring-enhancing lesion + IV drug use = brain abscess; empiric: vancomycin + ceftriaxone + metronidazole",
    clinicalPearls: [
      "Brain abscess: ring-enhancement + restricted diffusion on MRI DWI",
      "IV drug use: hematogenous spread, often S. aureus",
      "Triple antibiotics: vancomycin + ceftriaxone + metronidazole",
      "Surgical aspiration for abscesses >2.5 cm or causing mass effect"
    ],
    safetyNote: "Brain abscess can rupture into the ventricles causing ventriculitis and meningitis - a catastrophic complication",
    distractorRationales: [
      "Brain abscess with IV drug use history requires broad-spectrum IV antibiotics",
      "Primary tumor is less likely with IV drug use history and acute presentation",
      "Toxoplasmosis requires HIV/immunocompromise context",
      "Cysticercosis has different epidemiology and CT appearance"
    ],
    lessonLink: "/emergency/lessons/cns-infections"
  },
  {
    stem: "A 58-year-old female presents with acute onset of right homonymous hemianopia. She has no motor weakness or sensory deficits. Which vascular territory is responsible for this isolated visual field deficit?",
    options: [
      "Left posterior cerebral artery (PCA) territory causing left occipital lobe infarction",
      "Left middle cerebral artery (MCA) territory causing temporal lobe infarction",
      "Right posterior cerebral artery territory causing right occipital infarction",
      "Left anterior cerebral artery territory causing frontal lobe infarction"
    ],
    correctAnswer: 0,
    rationaleLong: "A right homonymous hemianopia (loss of the right visual field in both eyes) localizes to the LEFT visual pathway posterior to the optic chiasm - specifically, the left optic radiation or left occipital visual cortex. The most common vascular cause is left posterior cerebral artery (PCA) occlusion causing infarction of the left occipital lobe (primary visual cortex, area V1). The visual pathway anatomy explains the lateralization: visual information from the RIGHT visual field projects to the LEFT half of each retina → left optic tract (after the chiasm) → left lateral geniculate nucleus → left optic radiation → left occipital cortex (calcarine sulcus). Damage anywhere along this post-chiasmatic pathway on the LEFT causes RIGHT homonymous hemianopia (loss of the RIGHT half of the visual field in BOTH eyes). The PCA is the terminal branch of the basilar artery (posterior circulation) and supplies the occipital lobes, inferior temporal lobes, and medial temporal structures (hippocampus). An isolated visual field deficit without motor or sensory findings is characteristic of PCA territory stroke because the occipital lobe is a dedicated visual processing area without motor or somatosensory cortex. However, PCA stroke can also cause: memory impairment (hippocampal involvement), color naming deficits (if dominant hemisphere), visual agnosia, and prosopagnosia. The MCA territory includes the lateral frontal, parietal, and temporal lobes - MCA stroke causes motor and sensory deficits, aphasia, and neglect, not isolated hemianopia.",
    learningObjective: "Localize isolated homonymous hemianopia to the contralateral posterior cerebral artery territory",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Stroke Management",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Right homonymous hemianopia = LEFT PCA territory; isolated visual field deficit = occipital lobe (PCA territory)",
    clinicalPearls: [
      "Homonymous hemianopia localizes to the contralateral post-chiasmatic visual pathway",
      "Isolated hemianopia without motor/sensory deficits = PCA territory",
      "PCA is posterior circulation (basilar artery terminal branch)",
      "PCA stroke may also cause memory impairment from hippocampal involvement"
    ],
    safetyNote: "Patients with homonymous hemianopia have impaired peripheral vision - implement fall prevention for affected side",
    distractorRationales: [
      "Left PCA infarction causes right homonymous hemianopia from left occipital damage",
      "MCA territory causes motor/sensory deficits and aphasia, not isolated hemianopia",
      "Right PCA would cause LEFT homonymous hemianopia, not right",
      "ACA territory causes leg weakness, not visual field deficits"
    ],
    lessonLink: "/emergency/lessons/stroke-management"
  },
  {
    stem: "A 45-year-old female presents with thunderclap headache and neck stiffness. CT head is normal. Before performing an LP, the emergency nurse should verify which of the following to ensure safe LP performance?",
    options: [
      "Normal coagulation studies (PT/INR, aPTT), platelet count >50,000/μL, and no signs of elevated ICP on CT (no mass lesion or midline shift)",
      "Patient consent only - no laboratory testing is needed before LP",
      "Blood glucose level to ensure accurate CSF/serum glucose comparison",
      "Pregnancy test to determine if LP is safe"
    ],
    correctAnswer: 0,
    rationaleLong: "Before performing a lumbar puncture, the emergency nurse should verify several safety parameters: (1) Coagulation status: PT/INR and aPTT should be within acceptable range. An INR >1.5 or significantly prolonged aPTT increases the risk of spinal epidural or subdural hematoma from the LP needle. For patients on anticoagulants, specific reversal may be needed before proceeding (though the risk-benefit ratio must be considered in suspected SAH). (2) Platelet count: should be >50,000/μL (some guidelines use >40,000/μL) to ensure adequate hemostasis at the puncture site. Below this threshold, platelet transfusion before LP is recommended. (3) CT head findings: The CT should be reviewed to ensure there is no mass lesion, midline shift, or other signs of significantly elevated ICP that would make LP dangerous. LP in the presence of a mass lesion with elevated ICP can precipitate transtentorial or tonsillar herniation by creating a pressure differential between the intracranial and spinal compartments. However, a normal CT does NOT guarantee that LP is safe - clinical judgment about ICP is also important. (4) Additional considerations: proper patient positioning (lateral decubitus or sitting), sterile technique, appropriate needle selection (atraumatic/Sprotte needle preferred to reduce post-LP headache), and informed consent. While blood glucose and pregnancy testing are important clinical considerations, they are not safety prerequisites for the LP procedure itself. Blood glucose should be drawn simultaneously with LP to allow CSF/serum glucose ratio calculation, but this doesn't determine LP safety.",
    learningObjective: "Verify coagulation status, platelet count, and CT findings before performing lumbar puncture",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Diagnostic Procedures",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Pre-LP checklist: coags normal, platelets >50K, no mass/shift on CT; atraumatic needle reduces post-LP headache",
    clinicalPearls: [
      "INR >1.5 or platelets <50K = increased spinal hematoma risk with LP",
      "CT must show no mass lesion or midline shift before LP",
      "Normal CT does NOT guarantee LP safety - clinical judgment still required",
      "Atraumatic (Sprotte/Whitacre) needles reduce post-LP headache by 40%"
    ],
    safetyNote: "LP with coagulopathy or mass lesion can cause spinal hematoma or fatal herniation respectively",
    distractorRationales: [
      "Coags, platelets, and CT findings are essential safety checks before LP",
      "Laboratory testing is mandatory - consent alone is insufficient",
      "Blood glucose is drawn WITH LP for comparison, not as a safety prerequisite",
      "Pregnancy status doesn't affect LP safety"
    ],
    lessonLink: "/emergency/lessons/diagnostic-procedures"
  },
  {
    stem: "A 70-year-old male with known atrial fibrillation presents with acute onset of right facial droop, right arm weakness, and difficulty speaking. Symptoms began 2.5 hours ago. CT head shows no hemorrhage. What medication should the emergency nurse prepare while the stroke team evaluates for thrombolysis?",
    options: [
      "IV alteplase 0.9 mg/kg (max 90 mg) with 10% as IV bolus and 90% infused over 60 minutes",
      "Oral aspirin 325 mg as the initial stroke treatment",
      "IV heparin bolus 80 units/kg followed by 18 units/kg/hr infusion",
      "IV nimodipine 60 mg for neuroprotection"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with acute ischemic stroke symptoms within the 4.5-hour thrombolytic window (2.5 hours from onset) and a negative CT head for hemorrhage. The emergency nurse should prepare IV alteplase (tissue plasminogen activator/tPA) at the correct dose and administration protocol: Total dose: 0.9 mg/kg with a maximum of 90 mg. Administration: 10% of the total dose given as an IV bolus over 1 minute, and the remaining 90% infused over 60 minutes via infusion pump. For example, for a 80 kg patient: total dose = 72 mg; bolus = 7.2 mg IV push over 1 minute; infusion = 64.8 mg over 60 minutes. Nursing considerations during alteplase administration include: dedicated IV line (do not piggyback other medications), continuous cardiac monitoring, blood pressure monitoring every 15 minutes during infusion, then every 30 minutes for 6 hours, then every hour for 18 hours, maintaining BP <180/105 mmHg, neurological assessment (NIHSS) every 15 minutes during infusion and for the next 6 hours, and monitoring for signs of bleeding (oral, GI, urinary, intracranial). Aspirin is NOT given within 24 hours of alteplase due to increased hemorrhagic risk. IV heparin is also not given within 24 hours of alteplase. Nimodipine is used for SAH vasospasm prevention, not ischemic stroke neuroprotection. The nurse should have emergency medications at bedside: labetalol and nicardipine for BP control, and cryoprecipitate for alteplase reversal if sICH occurs.",
    learningObjective: "Prepare and administer IV alteplase at the correct dose and infusion protocol for acute ischemic stroke",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Stroke Management",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Alteplase for stroke: 0.9 mg/kg (max 90 mg), 10% bolus + 90% over 60 min; NO aspirin or heparin for 24 hours",
    clinicalPearls: [
      "Alteplase dose: 0.9 mg/kg (max 90 mg); 10% bolus, 90% over 60 minutes",
      "BP monitoring: q15min during infusion, q30min x 6h, q1h x 18h",
      "Maintain BP <180/105 for 24 hours post-alteplase",
      "No aspirin, heparin, or anticoagulants for 24 hours after alteplase"
    ],
    safetyNote: "Use a dedicated IV line for alteplase - do not mix with other medications",
    distractorRationales: [
      "Alteplase at correct dose and protocol is the appropriate preparation",
      "Aspirin is contraindicated within 24 hours of alteplase",
      "Heparin increases bleeding risk when given with alteplase",
      "Nimodipine is for SAH, not ischemic stroke"
    ],
    lessonLink: "/emergency/lessons/stroke-management"
  },
  {
    stem: "A 55-year-old male presents with acute headache and progressive bilateral lower extremity weakness over 6 hours. MRI shows an anterior spinal artery infarction at T6. What is the classic clinical syndrome and which modalities are affected?",
    options: [
      "Anterior cord syndrome: bilateral motor paralysis and pain/temperature loss below T6 with preserved proprioception and vibration (posterior column sparing)",
      "Complete transverse myelitis: complete loss of all motor, sensory, and autonomic function below T6",
      "Brown-Séquard syndrome: ipsilateral motor loss and contralateral pain/temperature loss",
      "Central cord syndrome: upper extremity weakness greater than lower extremity"
    ],
    correctAnswer: 0,
    rationaleLong: "Anterior spinal artery infarction causes anterior cord syndrome, which results from ischemia to the anterior two-thirds of the spinal cord. The anterior spinal artery supplies: (1) The corticospinal tracts (motor) - located in the lateral columns, (2) The spinothalamic tracts (pain and temperature sensation) - located in the anterolateral columns, (3) The anterior horns (lower motor neurons). The posterior columns (dorsal columns), which carry proprioception, vibration sense, and fine touch, are supplied by the paired posterior spinal arteries and are SPARED in anterior cord syndrome. This creates the characteristic dissociated sensory loss pattern: loss of pain and temperature sensation below the level (spinothalamic tract) with PRESERVED proprioception, vibration, and fine touch (posterior columns). Motor function (corticospinal tract) is also lost bilaterally below the level. The combination of bilateral motor paralysis + dissociated sensory loss (pain/temp lost, proprioception/vibration preserved) is pathognomonic for anterior cord syndrome. Anterior spinal artery infarction can be caused by: aortic surgery or aortic dissection (the artery of Adamkiewicz, the major radiculomedullary artery at T9-T12, originates from the aorta), atherosclerosis, hypercoagulable states, systemic hypotension, and rarely, vasculitis. There is no specific treatment to reverse the infarction, and management is supportive: blood pressure optimization (avoid hypotension), DVT prophylaxis, bladder management, and rehabilitation. Brown-Séquard is hemisection of the cord. Central cord syndrome affects the upper extremities more than lower. Complete transverse myelitis affects all modalities.",
    learningObjective: "Identify anterior cord syndrome from anterior spinal artery infarction with its characteristic dissociated sensory pattern",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Spinal Cord Emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Anterior cord syndrome: motor loss + pain/temp loss + PRESERVED proprioception/vibration (posterior columns spared)",
    clinicalPearls: [
      "Anterior spinal artery supplies anterior 2/3 of cord; posterior columns spared",
      "Dissociated sensory loss: pain/temp lost, proprioception/vibration preserved",
      "Common cause: aortic surgery (artery of Adamkiewicz at T9-T12)",
      "No specific reversal treatment - supportive care and rehabilitation"
    ],
    safetyNote: "Anterior spinal artery infarction during aortic surgery is preventable - monitor for new lower extremity deficits postoperatively",
    distractorRationales: [
      "Anterior cord syndrome: bilateral motor + pain/temp loss with preserved posterior columns",
      "Complete transverse myelitis would affect ALL sensory modalities",
      "Brown-Séquard is unilateral cord lesion with different deficit pattern",
      "Central cord syndrome primarily affects upper extremities, not lower"
    ],
    lessonLink: "/emergency/lessons/spinal-cord-emergencies"
  },
  {
    stem: "A nurse is caring for a patient with suspected bacterial meningitis. The patient is allergic to penicillin (anaphylaxis). Which alternative antibiotic regimen should the nurse prepare?",
    options: [
      "IV vancomycin PLUS IV meropenem (a carbapenem safe in penicillin-allergic patients without carbapenem allergy)",
      "IV vancomycin alone without additional coverage",
      "IV azithromycin PLUS IV metronidazole",
      "Oral doxycycline 100 mg BID"
    ],
    correctAnswer: 0,
    rationaleLong: "In patients with suspected bacterial meningitis who have a severe penicillin allergy (anaphylaxis), the standard regimen of vancomycin + ceftriaxone needs modification because cephalosporins have a historical cross-reactivity concern with penicillin allergy (though the actual cross-reactivity rate with third-generation cephalosporins is <1%). For patients with documented severe penicillin allergy, the recommended alternative is: IV vancomycin 25-30 mg/kg loading dose PLUS IV meropenem 2 g every 8 hours. Meropenem is a carbapenem antibiotic that provides excellent CNS penetration and broad-spectrum coverage against the common meningitis pathogens (S. pneumoniae, N. meningitidis, H. influenzae, and Listeria). The cross-reactivity between penicillin and carbapenems is extremely low (<1%), and meropenem is generally considered safe in penicillin-allergic patients. However, patients with a history of carbapenem allergy should not receive meropenem. Another alternative is IV chloramphenicol (which has excellent CNS penetration but is associated with rare but serious bone marrow toxicity). The nurse should: (1) Document the specific nature of the allergy (anaphylaxis vs. rash vs. GI upset), (2) Ensure the patient is monitored closely for 30 minutes after the first dose, (3) Have epinephrine and resuscitation equipment at bedside. Vancomycin alone is insufficient as it provides inadequate coverage for gram-negative organisms. Azithromycin and metronidazole do not have adequate CNS penetration for meningitis. Oral doxycycline is inadequate for bacterial meningitis.",
    learningObjective: "Select appropriate alternative antibiotics for bacterial meningitis in penicillin-allergic patients",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "CNS Infections",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Penicillin anaphylaxis + meningitis: vancomycin + meropenem (carbapenem cross-reactivity <1%)",
    clinicalPearls: [
      "Meropenem has <1% cross-reactivity with penicillin - generally safe",
      "Chloramphenicol is another alternative with good CNS penetration",
      "Always document the specific type of allergic reaction",
      "Monitor closely for 30 minutes after first dose of alternative antibiotics"
    ],
    safetyNote: "Have epinephrine and resuscitation equipment at bedside when administering antibiotics to allergic patients",
    distractorRationales: [
      "Vancomycin + meropenem provides appropriate coverage for penicillin-allergic patients",
      "Vancomycin alone lacks gram-negative coverage essential for meningitis",
      "Azithromycin and metronidazole have inadequate CNS penetration",
      "Oral doxycycline is completely inadequate for bacterial meningitis"
    ],
    lessonLink: "/emergency/lessons/cns-infections"
  }
];
