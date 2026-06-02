import { EmergencyNursingQuestion } from "./types";

export const neuroEmergency6Questions: EmergencyNursingQuestion[] = [
  {
    stem: "A 50-year-old male with chronic alcoholism presents with bilateral sixth cranial nerve palsies, horizontal nystagmus, and confusion. MRI shows symmetric T2 hyperintensity in the mammillary bodies and medial thalami. Which vitamin deficiency is responsible?",
    options: [
      "Thiamine (vitamin B1) deficiency causing Wernicke encephalopathy with characteristic MRI findings",
      "Vitamin B12 deficiency causing subacute combined degeneration",
      "Folate deficiency causing megaloblastic anemia with neurological effects",
      "Niacin (vitamin B3) deficiency causing pellagra"
    ],
    correctAnswer: 0,
    rationaleLong: "The MRI findings of symmetric T2/FLAIR hyperintensity in the mammillary bodies and medial thalami are pathognomonic for Wernicke encephalopathy (WE) caused by acute thiamine (vitamin B1) deficiency. These brain regions are particularly vulnerable to thiamine deficiency because they have high metabolic demands and depend heavily on thiamine-dependent enzymes (pyruvate dehydrogenase, alpha-ketoglutarate dehydrogenase, and transketolase) for energy metabolism. Other commonly affected structures include the periaqueductal gray matter, tectal plate, and dorsomedial thalamic nuclei. The bilateral sixth cranial nerve (abducens) palsies cause impaired lateral eye movement bilaterally, which is one of the oculomotor manifestations of WE (others include horizontal/vertical nystagmus and conjugate gaze palsies). The clinical triad of confusion, oculomotor dysfunction, and ataxia is present in only 16-33% of cases, making WE frequently underdiagnosed. The emergency nurse must recognize that WE is a clinical diagnosis that should be treated empirically with high-dose IV thiamine (500 mg TID for 2-3 days) before any glucose administration. MRI confirmation, while supportive, should NOT delay treatment. Serum thiamine levels have poor sensitivity and should not be relied upon for diagnosis. Vitamin B12 deficiency causes subacute combined degeneration affecting the posterior columns and corticospinal tracts of the spinal cord, not the mammillary bodies. Folate deficiency primarily causes hematological abnormalities. Pellagra (niacin deficiency) causes the 3 D's: Dermatitis, Diarrhea, and Dementia, with different MRI findings.",
    learningObjective: "Correlate MRI findings of mammillary body and thalamic hyperintensity with thiamine deficiency in Wernicke encephalopathy",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Metabolic Neurological Emergencies",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Mammillary body and medial thalamic MRI changes are pathognomonic for Wernicke encephalopathy",
    clinicalPearls: [
      "Classic WE triad present in only 16-33% of cases - high clinical suspicion needed",
      "MRI: symmetric T2 hyperintensity in mammillary bodies + medial thalami",
      "Treat empirically with IV thiamine - do not wait for MRI or lab confirmation",
      "Bilateral sixth nerve palsies are a hallmark oculomotor finding"
    ],
    safetyNote: "Wernicke encephalopathy is underdiagnosed in 80% of cases - maintain low threshold for empiric thiamine",
    distractorRationales: [
      "Thiamine deficiency causes Wernicke with characteristic mammillary body changes",
      "B12 deficiency affects spinal cord posterior columns, not mammillary bodies",
      "Folate deficiency primarily causes hematological abnormalities",
      "Pellagra has dermatologic and GI manifestations with different CNS findings"
    ],
    lessonLink: "/emergency/lessons/metabolic-neurological-emergencies"
  },
  {
    stem: "A 65-year-old male presents with acute onset of inability to swallow, hoarse voice, and nasal regurgitation of fluids. He also has ipsilateral palatal weakness and absent gag reflex on the left side. Which cranial nerves are affected?",
    options: [
      "Cranial nerves IX (glossopharyngeal) and X (vagus) - indicating a brainstem or jugular foramen lesion",
      "Cranial nerve VII (facial) only - indicating a Bell's palsy variant",
      "Cranial nerve XII (hypoglossal) - indicating tongue weakness",
      "Cranial nerve V (trigeminal) - indicating facial sensory loss"
    ],
    correctAnswer: 0,
    rationaleLong: "The combination of dysphagia (difficulty swallowing), dysphonia (hoarse voice), nasal regurgitation, palatal weakness, and absent gag reflex localizes to cranial nerves IX (glossopharyngeal) and X (vagus). These nerves share a close anatomical relationship as they exit the brainstem from the medulla and pass through the jugular foramen together. CN IX provides sensory innervation to the posterior pharynx (afferent limb of the gag reflex), contributes to swallowing via the stylopharyngeus muscle, and provides taste to the posterior third of the tongue. CN X provides motor innervation to the pharyngeal constrictors (essential for swallowing), the soft palate (elevation during swallowing and speech to prevent nasal regurgitation), and the vocal cords (via the recurrent laryngeal nerve - damage causes hoarseness). When both nerves are affected ipsilaterally, the gag reflex is absent on that side, the palate deviates AWAY from the lesion (toward the strong side) when the patient says 'ahh,' and the voice is hoarse. The emergency nurse's primary concern is ASPIRATION RISK. These patients cannot protect their airway due to: (1) impaired epiglottic closure over the trachea during swallowing, (2) impaired pharyngeal constriction to propel food bolus, (3) weak cough reflex (CN X). The nurse should: keep the patient NPO, elevate the head of bed, have suction at bedside, and arrange for a formal swallow evaluation before any oral intake. Causes include brainstem stroke (especially lateral medullary/Wallenberg syndrome), jugular foramen tumors (glomus jugulare), and skull base fractures.",
    learningObjective: "Identify combined CN IX and X dysfunction and implement aspiration precautions",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Cranial Nerve Emergencies",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "CN IX + X dysfunction = dysphagia + dysphonia + absent gag = HIGH aspiration risk; keep NPO",
    clinicalPearls: [
      "CN IX + X share anatomical path through jugular foramen",
      "Palate deviates AWAY from the lesion (toward strong side)",
      "Hoarseness indicates vocal cord paralysis (CN X recurrent laryngeal)",
      "Most common cause is lateral medullary stroke (Wallenberg syndrome)"
    ],
    safetyNote: "Keep patient NPO with head elevated and suction at bedside - aspiration is the immediate life threat",
    distractorRationales: [
      "CN IX and X dysfunction explains all findings including dysphagia and dysphonia",
      "CN VII affects facial muscles, not swallowing or voice",
      "CN XII affects tongue movement only, not palate or gag reflex",
      "CN V provides facial sensation, not swallowing function"
    ],
    lessonLink: "/emergency/lessons/cranial-nerve-emergencies"
  },
  {
    stem: "A 40-year-old female presents with acute severe headache, photophobia, neck stiffness, and fever of 39.8°C. She appears toxic. LP shows: WBC 2,400 (95% neutrophils), protein 280 mg/dL, glucose 18 mg/dL (serum glucose 110 mg/dL). Gram stain shows gram-positive diplococci. What antibiotics should the emergency nurse administer?",
    options: [
      "IV vancomycin 25-30 mg/kg AND IV ceftriaxone 2 g AND IV dexamethasone 0.15 mg/kg - all within 30 minutes",
      "IV ampicillin 2 g only for gram-positive coverage",
      "IV metronidazole 500 mg for anaerobic coverage",
      "IV acyclovir 10 mg/kg for suspected viral etiology"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with acute bacterial meningitis, evidenced by the classic meningeal signs (headache, photophobia, nuchal rigidity), fever, toxic appearance, and CSF findings showing: high WBC with neutrophilic predominance (bacterial infections typically cause >1000 WBC with >80% neutrophils), markedly elevated protein (>250 mg/dL indicates significant inflammation), very low glucose (CSF/serum glucose ratio <0.4 is characteristic of bacterial meningitis), and gram-positive diplococci on Gram stain (consistent with Streptococcus pneumoniae, the most common cause of bacterial meningitis in adults). The empiric antibiotic regimen for suspected bacterial meningitis in adults 18-50 years includes: (1) IV Vancomycin 25-30 mg/kg loading dose - provides coverage for penicillin-resistant S. pneumoniae (resistance rates 20-30% in some regions), (2) IV Ceftriaxone 2 g - provides broad coverage for S. pneumoniae, N. meningitidis, and H. influenzae, (3) IV Dexamethasone 0.15 mg/kg q6h for 4 days - given BEFORE or WITH the first antibiotic dose. Dexamethasone reduces inflammation and has been shown to decrease mortality and neurological sequelae specifically in pneumococcal meningitis. The timing rule is critical: dexamethasone MUST be given before or simultaneously with the first antibiotic dose; if antibiotics have already been administered, dexamethasone provides little benefit. All medications should be administered within 30 minutes of arrival (ideally sooner). For patients >50 years or immunocompromised, IV ampicillin 2 g q4h is ADDED to cover Listeria monocytogenes. Every hour of delay in antibiotic administration increases mortality by 3-7%.",
    learningObjective: "Administer empiric triple therapy for bacterial meningitis including dexamethasone before or with first antibiotic dose",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "CNS Infections",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Dexamethasone must be given BEFORE or WITH first antibiotic dose; if given after, it provides no benefit",
    clinicalPearls: [
      "Empiric adult meningitis: vancomycin + ceftriaxone + dexamethasone",
      "Add ampicillin for age >50, immunocompromised, or alcoholism (Listeria coverage)",
      "Dexamethasone reduces mortality in pneumococcal meningitis specifically",
      "Every hour of antibiotic delay increases mortality 3-7%"
    ],
    safetyNote: "Do NOT delay antibiotics to obtain LP or imaging - draw blood cultures and start antibiotics immediately if LP will be delayed",
    distractorRationales: [
      "Triple therapy with dexamethasone provides optimal coverage and reduces complications",
      "Ampicillin alone is insufficient and misses resistant organisms",
      "Metronidazole covers anaerobes which are rare causes of meningitis",
      "Acyclovir is for viral encephalitis; bacterial CSF findings are present here"
    ],
    lessonLink: "/emergency/lessons/cns-infections"
  },
  {
    stem: "A 55-year-old male presents with acute onset of complete paralysis of the right side of his face including the forehead. He cannot close his right eye or raise his right eyebrow. There is no limb weakness or other neurological deficits. What is the most likely diagnosis?",
    options: [
      "Bell's palsy (idiopathic facial nerve palsy) - a lower motor neuron CN VII lesion",
      "Stroke affecting the facial motor cortex",
      "Ramsay Hunt syndrome from herpes zoster oticus",
      "Acoustic neuroma compressing the facial nerve"
    ],
    correctAnswer: 0,
    rationaleLong: "The key diagnostic feature is involvement of the ENTIRE right face INCLUDING THE FOREHEAD (inability to raise eyebrow and close eye). This pattern indicates a lower motor neuron (LMN) lesion of cranial nerve VII (facial nerve), because the LMN innervates all ipsilateral facial muscles. Bell's palsy (idiopathic facial nerve palsy) is the most common cause of acute peripheral facial weakness, accounting for 60-75% of cases. It is believed to be caused by inflammation and edema of CN VII within the narrow fallopian canal (temporal bone), leading to nerve compression and ischemia. The critical clinical distinction is between LMN and UMN facial weakness: LMN (peripheral) lesion = ENTIRE face affected (forehead AND lower face) because the peripheral nerve innervates all ipsilateral muscles. UMN (central/stroke) lesion = ONLY LOWER FACE affected because the upper face (forehead) receives BILATERAL cortical innervation, so even with contralateral cortical damage, the ipsilateral cortex maintains forehead function. Since this patient has forehead involvement and no other neurological deficits, Bell's palsy is the most likely diagnosis. Bell's palsy treatment includes: oral prednisone 60-80 mg daily for 7 days (ideally started within 72 hours of onset), eye care (lubricating drops, moisture chamber, eye patch at night to prevent exposure keratitis), and oral valacyclovir 1 g TID for 7 days (added for severe cases). While Bell's palsy is the most common diagnosis, Ramsay Hunt syndrome should be considered if vesicular eruptions are present on the ear/external auditory canal (herpes zoster reactivation in the geniculate ganglion). Acoustic neuroma typically causes gradual facial weakness, not acute onset.",
    learningObjective: "Differentiate LMN (peripheral) from UMN (central) facial weakness based on forehead involvement",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Cranial Nerve Emergencies",
    difficulty: 2,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Forehead SPARED = stroke (UMN); Forehead INVOLVED = peripheral (LMN/Bell's); this is a high-yield distinction",
    clinicalPearls: [
      "LMN = entire face including forehead; UMN = lower face only (forehead spared)",
      "Bell's palsy: 60-75% of acute facial palsy; prednisone within 72 hours",
      "Eye care is essential: lubrication, moisture chamber, nighttime eye patch",
      "Check for ear vesicles - may indicate Ramsay Hunt syndrome (add valacyclovir)"
    ],
    safetyNote: "Inability to close the eye risks exposure keratitis and corneal ulceration - eye protection is critical",
    distractorRationales: [
      "Bell's palsy: acute LMN facial weakness with forehead involvement and no other deficits",
      "Stroke causes UMN pattern with forehead sparing and often other neurological deficits",
      "Ramsay Hunt requires ear vesicles from herpes zoster reactivation",
      "Acoustic neuroma causes gradual, not acute, facial weakness"
    ],
    lessonLink: "/emergency/lessons/cranial-nerve-emergencies"
  },
  {
    stem: "A 35-year-old male presents 6 hours after a moderate traumatic brain injury (GCS 12 initially, now 9). Repeat CT shows an acute subdural hematoma measuring 12 mm thickness with 7 mm midline shift. What are the surgical indications for this subdural hematoma?",
    options: [
      "Hematoma thickness >10 mm, midline shift >5 mm, and GCS drop ≥2 points - all three criteria indicate need for surgical evacuation",
      "Observation with serial CT scans every 12 hours is adequate since the GCS is still >8",
      "Burr hole evacuation is sufficient for acute subdural hematomas",
      "Surgery is only indicated if the patient develops fixed dilated pupils"
    ],
    correctAnswer: 0,
    rationaleLong: "The Brain Trauma Foundation guidelines for surgical management of acute subdural hematoma (SDH) recommend craniotomy for evacuation when ANY of the following criteria are met: (1) Hematoma thickness >10 mm (this patient has 12 mm), (2) Midline shift >5 mm (this patient has 7 mm), (3) GCS decrease of ≥2 points from time of injury (this patient dropped from 12 to 9, a decrease of 3 points), (4) ICP >20 mmHg. This patient meets ALL THREE of the thickness, midline shift, and GCS decline criteria, making surgical evacuation clearly indicated. Acute SDH is caused by rupture of bridging veins (most commonly) between the cerebral cortex and the dural sinuses, creating a crescent-shaped collection of blood over the cerebral convexity. Unlike epidural hematomas (which are lens-shaped and typically arterial), subdural hematomas are venous in origin, cross suture lines, and have a worse prognosis because they are often associated with underlying brain parenchymal injury. The surgical approach is craniotomy (not burr hole) because acute SDH blood is typically clotted and cannot be adequately evacuated through small burr holes. Burr hole drainage is reserved for chronic subdural hematomas where the blood has liquefied. Mortality for acute SDH requiring surgery is 40-60%, with outcomes being significantly worse when surgery is delayed beyond 4 hours from clinical deterioration. Waiting for fixed dilated pupils means waiting until uncal herniation has already occurred, dramatically worsening the prognosis. The emergency nurse should prepare the patient for emergent OR transfer, ensure blood products are available, and implement neuroprotective measures (HOB 30°, avoid hypotension and hypoxia).",
    learningObjective: "Apply BTF surgical indications for acute subdural hematoma based on thickness, shift, and GCS decline",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Traumatic Brain Injury",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "SDH surgery indications: >10 mm thick, >5 mm shift, GCS drop ≥2, or ICP >20 mmHg - ANY one is sufficient",
    clinicalPearls: [
      "Acute SDH: crescent-shaped, crosses sutures, venous origin (bridging veins)",
      "Surgery within 4 hours of deterioration improves outcomes",
      "Craniotomy for acute SDH (clotted); burr hole for chronic SDH (liquefied)",
      "Acute SDH mortality 40-60% even with surgical intervention"
    ],
    safetyNote: "GCS decline of ≥2 points is a neurosurgical emergency - notify neurosurgery immediately",
    distractorRationales: [
      "All three surgical criteria are met: >10 mm, >5 mm shift, GCS drop ≥2",
      "Serial observation is inappropriate when surgical criteria are met",
      "Burr holes cannot evacuate clotted acute SDH - craniotomy is needed",
      "Waiting for dilated pupils means irreversible herniation has already occurred"
    ],
    lessonLink: "/emergency/lessons/traumatic-brain-injury"
  },
  {
    stem: "A 60-year-old male on phenytoin for epilepsy presents with dizziness, nystagmus, ataxia, and slurred speech. His phenytoin level is 32 mcg/mL (therapeutic range 10-20 mcg/mL). What is the most appropriate management?",
    options: [
      "Hold phenytoin, monitor serum levels, provide supportive care with IV fluids and close neurological monitoring",
      "Administer activated charcoal 50 g for GI decontamination",
      "Initiate hemodialysis for rapid drug removal",
      "Administer IV fosphenytoin to convert to the safer prodrug form"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with phenytoin toxicity at a level of 32 mcg/mL (therapeutic range 10-20 mcg/mL). Phenytoin toxicity follows a dose-dependent progression of neurological symptoms: at 20-30 mcg/mL - nystagmus (usually the first sign); at 30-40 mcg/mL - ataxia, slurred speech (dysarthria), and diplopia; at 40-50 mcg/mL - lethargy and confusion; at >50 mcg/mL - coma and seizures (paradoxically, supratherapeutic levels can CAUSE seizures). The management of phenytoin toxicity is primarily supportive: (1) HOLD the phenytoin dose - the most important step; do not administer any further doses until levels return to the therapeutic range, (2) Serial phenytoin level monitoring every 6-8 hours (phenytoin exhibits zero-order/saturation kinetics, meaning at toxic levels, small dose increases cause disproportionately large level increases, and elimination is prolonged), (3) IV fluid hydration, (4) Fall precautions due to ataxia, (5) Cardiac monitoring (phenytoin can cause cardiac arrhythmias, particularly when given IV too rapidly), (6) Continuous neurological assessment. Activated charcoal is only useful if the ingestion occurred within 1-2 hours and this appears to be chronic accumulation, not acute ingestion. Hemodialysis is NOT effective for phenytoin removal because phenytoin is >90% protein-bound, meaning very little free drug is available for dialysis. Administering fosphenytoin would add more phenytoin to an already toxic level. Most patients with phenytoin toxicity recover fully with supportive care over 24-72 hours as levels decline.",
    learningObjective: "Manage phenytoin toxicity with dose holding and supportive care, recognizing the dose-dependent symptom progression",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Drug-Induced Neurological Emergencies",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Phenytoin toxicity: nystagmus first (20-30), then ataxia/dysarthria (30-40), then lethargy (40-50), then paradoxical seizures (>50)",
    clinicalPearls: [
      "Nystagmus is typically the first sign of phenytoin toxicity",
      "Phenytoin has zero-order kinetics - small dose changes cause large level changes at toxic levels",
      "Hemodialysis is ineffective due to >90% protein binding",
      "Paradoxically, very high levels can CAUSE seizures"
    ],
    safetyNote: "Implement strict fall precautions - ataxia from phenytoin toxicity creates significant fall risk",
    distractorRationales: [
      "Holding phenytoin and supportive care is the primary management",
      "Activated charcoal is not useful for chronic accumulation toxicity",
      "Hemodialysis cannot remove highly protein-bound phenytoin",
      "Fosphenytoin would add more phenytoin to already toxic levels"
    ],
    lessonLink: "/emergency/lessons/drug-induced-neurological-emergencies"
  },
  {
    stem: "A 75-year-old female presents with sudden onset of bilateral visual loss. She can only perceive light. Pupillary reflexes are intact bilaterally. CT head shows bilateral occipital lobe infarctions. What is this condition called and why are pupil reflexes preserved?",
    options: [
      "Cortical blindness - pupil reflexes are preserved because the pupillary light reflex pathway bypasses the visual cortex",
      "Bilateral optic neuritis - pupil reflexes are preserved due to redundant innervation",
      "Bilateral retinal artery occlusion - pupil reflexes are preserved due to choroidal blood supply",
      "Bilateral cataracts - pupil reflexes are preserved because the lens does not affect the reflex arc"
    ],
    correctAnswer: 0,
    rationaleLong: "Cortical blindness (also called cerebral blindness) is vision loss caused by bilateral damage to the primary visual cortex (area V1) in the occipital lobes, most commonly from bilateral posterior cerebral artery (PCA) occlusion. The hallmark clinical finding is complete or near-complete loss of vision WITH preserved pupillary light reflexes. This apparent paradox is explained by the neuroanatomy of the pupillary light reflex pathway: light enters the eye → retina → optic nerve → optic chiasm → optic tract → the reflex arc diverges to the PRETECTAL NUCLEUS in the midbrain (NOT the visual cortex) → Edinger-Westphal nucleus → parasympathetic fibers via CN III → pupillary constriction. Since the pupillary reflex pathway goes to the pretectal nucleus and never reaches the occipital visual cortex, bilateral occipital damage does not affect the pupillary response. This is a crucial diagnostic clue: if a patient reports complete blindness but has intact pupillary reflexes, the lesion is CORTICAL, not in the eyes or optic nerves. Conversely, if pupillary reflexes are absent, the lesion is pre-chiasmatic (retinal or optic nerve). An additional phenomenon seen in some cortical blindness patients is Anton syndrome (cortical blindness with confabulation) - the patient denies being blind and confabulates visual experiences, likely due to involvement of visual association areas. The emergency nurse should implement safety measures for a blind patient and arrange emergent neurology and ophthalmology consultation.",
    learningObjective: "Diagnose cortical blindness based on vision loss with preserved pupillary reflexes and understand the anatomical basis",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Visual Emergencies in Stroke",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Blind + intact pupils = cortical (occipital); Blind + absent pupil reflex = eye/optic nerve pathology",
    clinicalPearls: [
      "Pupillary reflex bypasses visual cortex via pretectal nucleus pathway",
      "Bilateral PCA occlusion is the most common cause of cortical blindness",
      "Anton syndrome: denies blindness and confabulates visual experiences",
      "Macular sparing may occur because the occipital pole has dual blood supply"
    ],
    safetyNote: "Implement fall prevention and safety measures appropriate for a newly blind patient",
    distractorRationales: [
      "Cortical blindness: vision loss with preserved pupils due to intact subcortical reflex arc",
      "Optic neuritis would cause afferent pupillary defect (Marcus Gunn pupil)",
      "Retinal artery occlusion would cause afferent pupillary defect",
      "Cataracts cause gradual vision loss, not sudden blindness with normal fundoscopy"
    ],
    lessonLink: "/emergency/lessons/visual-emergencies-stroke"
  },
  {
    stem: "A 48-year-old male presents with rapidly progressive ascending weakness, respiratory difficulty, and bulbar symptoms. He was recently diagnosed with Campylobacter jejuni gastroenteritis. Nerve conduction studies show absent motor responses with preserved sensory responses. Which GBS variant does this represent?",
    options: [
      "Acute motor axonal neuropathy (AMAN) - a pure motor variant associated with Campylobacter infection and anti-GM1 antibodies",
      "Acute inflammatory demyelinating polyneuropathy (AIDP) - classic demyelinating variant",
      "Miller Fisher syndrome - ophthalmoplegia, ataxia, areflexia",
      "Acute motor-sensory axonal neuropathy (AMSAN) - combined motor and sensory variant"
    ],
    correctAnswer: 0,
    rationaleLong: "Acute Motor Axonal Neuropathy (AMAN) is a GBS variant characterized by pure motor involvement with axonal damage (not demyelination). The nerve conduction study (NCS) pattern is pathognomonic: absent or severely reduced motor nerve compound muscle action potentials (CMAPs) with preserved sensory nerve action potentials (SNAPs). This differs from AIDP where NCS shows demyelinating features (prolonged distal latencies, slowed conduction velocities, conduction block, prolonged F-waves) affecting both motor and sensory nerves. AMAN is strongly associated with preceding Campylobacter jejuni infection through a molecular mimicry mechanism: antibodies generated against C. jejuni lipooligosaccharides (LOS) cross-react with gangliosides on the motor nerve axolemma, particularly GM1, GD1a, and GalNAc-GD1a. These anti-ganglioside antibodies cause complement-mediated attack on the nodes of Ranvier of motor axons, leading to axonal degeneration. AMAN accounts for 30-65% of GBS in East Asian countries and 5-10% in Western countries. Clinical features that distinguish AMAN from AIDP include: pure motor involvement (no sensory symptoms), often more rapid progression, and potentially faster recovery (because axonal regeneration in AMAN can be facilitated by intact Schwann cell basal lamina). Treatment is the same as other GBS variants: IV immunoglobulin (IVIG 0.4 g/kg/day for 5 days) or plasmapheresis. Corticosteroids remain ineffective. Miller Fisher syndrome presents with ophthalmoplegia, ataxia, and areflexia (anti-GQ1b antibodies). AMSAN involves both motor AND sensory axons.",
    learningObjective: "Identify AMAN GBS variant based on pure motor NCS findings and Campylobacter association",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Neuromuscular Emergencies",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Absent motor + preserved sensory on NCS = AMAN; Campylobacter jejuni is the strongest infectious trigger for GBS",
    clinicalPearls: [
      "AMAN: pure motor axonal damage, anti-GM1 antibodies, Campylobacter association",
      "NCS: absent motor responses + preserved sensory = axonal motor neuropathy",
      "Treatment same as AIDP: IVIG or plasmapheresis (NOT steroids)",
      "AMAN more common in East Asia (30-65%) than Western countries (5-10%)"
    ],
    safetyNote: "Monitor respiratory function closely - AMAN can progress to respiratory failure as rapidly as AIDP",
    distractorRationales: [
      "AMAN: pure motor involvement with preserved sensory on NCS",
      "AIDP shows demyelinating NCS features affecting both motor and sensory nerves",
      "Miller Fisher has ophthalmoplegia and ataxia without significant limb weakness",
      "AMSAN has absent motor AND sensory responses on NCS"
    ],
    lessonLink: "/emergency/lessons/neuromuscular-emergencies"
  },
  {
    stem: "A 70-year-old male with recent carotid endarterectomy presents 6 hours postoperatively with headache, confusion, focal seizures, and new-onset hypertension (BP 210/115). CT head shows ipsilateral cerebral edema with petechial hemorrhages in the hemisphere ipsilateral to the surgery. What is the diagnosis?",
    options: [
      "Cerebral hyperperfusion syndrome - requires aggressive blood pressure control to SBP <140 mmHg",
      "Postoperative ischemic stroke from carotid re-occlusion",
      "Postoperative hematoma at the surgical site",
      "Hypertensive encephalopathy unrelated to the surgery"
    ],
    correctAnswer: 0,
    rationaleLong: "Cerebral hyperperfusion syndrome (CHS) is a potentially devastating complication occurring in 1-3% of patients after carotid endarterectomy (CEA) or carotid stenting, typically presenting within hours to days postoperatively. The pathophysiology involves chronic cerebral hypoperfusion from high-grade carotid stenosis, which causes impaired cerebral autoregulation in the ipsilateral hemisphere. When blood flow is suddenly restored by the surgery, the impaired autoregulatory mechanisms cannot adequately constrict the cerebral vasculature, leading to hyperperfusion (cerebral blood flow increase >100% above baseline). This causes vasogenic edema, blood-brain barrier breakdown, and potentially intracerebral hemorrhage. The classic presentation includes: ipsilateral headache (often severe and throbbing), hypertension (frequently severe), seizures (focal or generalized), and focal neurological deficits. CT findings include ipsilateral cerebral edema and potentially petechial or larger intracerebral hemorrhages. The critical treatment is AGGRESSIVE blood pressure control targeting SBP <140 mmHg (some centers target <120 mmHg), using IV labetalol or nicardipine infusion. Seizure control with antiepileptic medications (levetiracetam is preferred as it has less drug interaction) is also essential. Avoiding factors that increase cerebral blood flow (hypercapnia, fever, agitation) is important. Risk factors include: high-grade stenosis (>90%), contralateral carotid occlusion, poor collateral circulation, perioperative hypertension, and diabetes. The emergency nurse post-CEA should monitor BP frequently (every 15 minutes in the first 24 hours), perform serial neurological assessments, and immediately report any headache, confusion, or new neurological deficits.",
    learningObjective: "Recognize cerebral hyperperfusion syndrome after carotid endarterectomy and prioritize aggressive BP control",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Postoperative Neurological Emergencies",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Post-CEA headache + hypertension + seizures + ipsilateral edema = hyperperfusion syndrome; SBP target <140",
    clinicalPearls: [
      "CHS occurs in 1-3% of CEA patients, usually within hours to days",
      "Caused by impaired autoregulation from chronic hypoperfusion",
      "Target SBP <140 mmHg aggressively with IV antihypertensives",
      "Risk factors: >90% stenosis, contralateral occlusion, poor collaterals"
    ],
    safetyNote: "Monitor BP every 15 minutes for the first 24 hours post-CEA - early detection of CHS is critical",
    distractorRationales: [
      "CHS: post-CEA headache + hypertension + seizures + ipsilateral edema/hemorrhage",
      "Re-occlusion would cause ischemic symptoms, not edema with petechial hemorrhage",
      "Surgical hematoma would be at the neck, not within the brain parenchyma",
      "The temporal relationship to surgery and ipsilateral findings make CHS specific"
    ],
    lessonLink: "/emergency/lessons/postoperative-neurological-emergencies"
  },
  {
    stem: "A 25-year-old female presents with progressively worsening headache over 2 weeks, bilateral papilledema, and sixth cranial nerve palsy. She has a history of acne treated with isotretinoin. MRI brain is normal. MRV shows no venous sinus thrombosis. LP opening pressure is 42 cmH2O. What medication is likely contributing to her condition?",
    options: [
      "Isotretinoin (vitamin A derivative) - a known cause of secondary intracranial hypertension",
      "Oral contraceptive pills - causing cerebral venous thrombosis",
      "Tetracycline antibiotics - causing bacterial meningitis",
      "Acetaminophen - causing analgesic-overuse headache"
    ],
    correctAnswer: 0,
    rationaleLong: "Isotretinoin (Accutane), a synthetic vitamin A derivative used to treat severe acne, is a well-established cause of secondary intracranial hypertension (formerly called pseudotumor cerebri). Vitamin A and its derivatives (retinoids) are known to alter CSF dynamics, potentially by increasing CSF production or decreasing CSF absorption at the arachnoid granulations. The mechanism involves retinoid-induced changes in the arachnoid villi that impair CSF outflow resistance. The clinical presentation is indistinguishable from idiopathic intracranial hypertension (IIH): headache (often worse in the morning or with Valsalva), bilateral papilledema, visual disturbances (transient visual obscurations, enlarged blind spots, visual field loss), and sixth cranial nerve palsy (false localizing sign from elevated ICP stretching the nerve along its long intracranial course). The diagnosis is confirmed by elevated LP opening pressure (>25 cmH2O, this patient has 42 cmH2O) with normal CSF composition and normal brain imaging. When isotretinoin is identified as the cause, the drug should be discontinued immediately. Other medications known to cause secondary intracranial hypertension include: tetracycline antibiotics (doxycycline, minocycline - notably these are also commonly used for acne), excessive vitamin A supplementation, growth hormone, and lithium. Of note, the combination of isotretinoin with a tetracycline antibiotic (sometimes prescribed together for acne) dramatically increases the risk of intracranial hypertension. Treatment includes: drug discontinuation, acetazolamide for ICP reduction, therapeutic LP for symptom relief, and ophthalmology follow-up for visual field monitoring.",
    learningObjective: "Identify isotretinoin as a cause of secondary intracranial hypertension and the importance of medication history review",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Elevated Intracranial Pressure",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Isotretinoin (vitamin A derivative) + tetracyclines are common drug causes of raised ICP; always review medication list",
    clinicalPearls: [
      "Isotretinoin, tetracyclines, excess vitamin A, and growth hormone cause raised ICP",
      "CN VI palsy is a false localizing sign of elevated ICP (long intracranial course)",
      "Drug-induced intracranial hypertension is indistinguishable from IIH on exam",
      "Discontinue the offending medication immediately"
    ],
    safetyNote: "Never combine isotretinoin with tetracycline antibiotics - dramatically increases risk of intracranial hypertension",
    distractorRationales: [
      "Isotretinoin is a well-established cause of secondary intracranial hypertension",
      "MRV was normal ruling out venous sinus thrombosis",
      "Tetracyclines can cause raised ICP but through intracranial hypertension, not meningitis",
      "Analgesic-overuse headache doesn't cause papilledema or elevated opening pressure"
    ],
    lessonLink: "/emergency/lessons/elevated-intracranial-pressure"
  },
  {
    stem: "A 62-year-old male presents with acute onset of crossed findings: left facial weakness (LMN pattern) and right arm/leg weakness. The lesion is most likely located in which structure?",
    options: [
      "Left pons (brainstem) - crossed findings indicate a brainstem lesion with ipsilateral cranial nerve and contralateral long tract signs",
      "Right cerebral hemisphere - causing contralateral facial and body weakness",
      "Left cerebral hemisphere - causing right-sided weakness",
      "Cervical spinal cord - causing bilateral upper extremity weakness"
    ],
    correctAnswer: 0,
    rationaleLong: "Crossed neurological deficits (ipsilateral cranial nerve findings + contralateral body findings) are the hallmark of BRAINSTEM lesions and are one of the most important localizing principles in neurology. In this case: left LMN facial weakness indicates a lesion affecting the left facial nerve nucleus or its fascicles within the PONS (facial nerve nucleus is in the pons), while right body weakness indicates a lesion affecting the left corticospinal tract before it decussates (crosses) at the medullary pyramids. The left pontine location explains both findings: the facial nerve nucleus on the left is directly damaged (causing ipsilateral LMN facial weakness affecting the entire left face including forehead), while the left corticospinal tract running through the pons is also damaged before its decussation in the medulla (causing contralateral right body weakness). This pattern is called alternating hemiplegia or Millard-Gubler syndrome when specifically involving CN VI and/or VII with contralateral hemiplegia from a pontine lesion. The key principle: cranial nerve nuclei are in the brainstem → ipsilateral effects; corticospinal tracts cross at the medullary pyramids → contralateral effects. Therefore, a brainstem lesion causes IPSILATERAL cranial nerve deficits + CONTRALATERAL body deficits = crossed findings. A cortical/hemispheric stroke would cause UMN (forehead-sparing) facial weakness AND body weakness on the SAME SIDE (both contralateral to the lesion), not crossed findings. Spinal cord lesions do not affect cranial nerves.",
    learningObjective: "Apply the principle of crossed findings to localize lesions to the brainstem",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Neurological Localization",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Crossed findings (ipsilateral CN + contralateral body) = BRAINSTEM lesion; same-side findings = hemispheric lesion",
    clinicalPearls: [
      "Crossed findings are pathognomonic for brainstem lesions",
      "CN nuclei: ipsilateral effects; corticospinal tract: contralateral effects (crosses at medulla)",
      "LMN facial weakness (entire face) = pontine lesion; UMN (forehead spared) = cortical",
      "Millard-Gubler syndrome: pontine lesion with CN VI/VII + contralateral hemiplegia"
    ],
    safetyNote: "Brainstem strokes can rapidly deteriorate - monitor closely for airway compromise and consciousness changes",
    distractorRationales: [
      "Crossed findings localize to the left pons where CN VII nucleus and corticospinal tract coexist",
      "Hemispheric lesion would cause same-side face and body weakness (both contralateral)",
      "Left hemisphere stroke would cause right UMN facial weakness (forehead spared) + right body",
      "Spinal cord lesions cannot cause cranial nerve deficits"
    ],
    lessonLink: "/emergency/lessons/neurological-localization"
  },
  {
    stem: "A 45-year-old male presents with sudden onset of severe headache, neck stiffness, and bilateral leg weakness. He has a known history of a spinal arteriovenous malformation (AVM). MRI shows a spinal subarachnoid hemorrhage at T8. What is the most important initial nursing intervention?",
    options: [
      "Strict bed rest, serial neurological assessments of lower extremity function, and pain management with avoidance of NSAIDs and anticoagulants",
      "Immediate mobilization to prevent deep vein thrombosis",
      "Administration of IV heparin for secondary stroke prevention",
      "Lumbar drain placement for CSF pressure reduction"
    ],
    correctAnswer: 0,
    rationaleLong: "Spinal subarachnoid hemorrhage (spinal SAH) is a rare but serious condition most commonly caused by spinal arteriovenous malformations (AVMs), spinal cord tumors, or coagulopathy. The presentation includes acute severe back pain, radiculopathy (nerve root irritation by blood), meningismus (nuchal rigidity from blood irritating the meninges), and progressive neurological deficits below the level of hemorrhage (bilateral leg weakness in this case from T8 level). The priority nursing interventions include: (1) Strict bed rest to reduce the risk of rebleeding from the spinal AVM, (2) Serial neurological assessments every 1-2 hours monitoring: lower extremity motor strength (graded 0-5 bilaterally), sensory level (dermatome mapping), deep tendon reflexes, and bladder function (urinary retention suggests cord compression), (3) Pain management using IV opioids (morphine or hydromorphone) - AVOID NSAIDs because they inhibit platelet function and can worsen hemorrhage, and AVOID anticoagulants for the same reason, (4) Blood pressure management to prevent rebleeding, (5) Emergent neurosurgical consultation for potential intervention (endovascular embolization or surgical resection of the AVM). Early mobilization would increase the risk of rebleeding from the AVM. Heparin anticoagulation would worsen ongoing hemorrhage. Lumbar drain placement is risky in the setting of spinal mass lesion/hemorrhage and could cause spinal cord herniation through altered CSF dynamics. DVT prophylaxis should be with mechanical devices (sequential compression devices) rather than pharmacological agents until the hemorrhage has stabilized.",
    learningObjective: "Implement bed rest, serial neurological monitoring, and appropriate pain management for spinal subarachnoid hemorrhage",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Spinal Cord Emergencies",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Spinal SAH: strict bed rest + avoid NSAIDs and anticoagulants + serial neuro checks; use SCDs for DVT prevention",
    clinicalPearls: [
      "Spinal AVM is the most common cause of spinal SAH",
      "Monitor lower extremity motor function, sensory level, and bladder function serially",
      "Avoid NSAIDs (impair platelets) and anticoagulants (worsen hemorrhage)",
      "Use mechanical DVT prophylaxis (SCDs), not pharmacological"
    ],
    safetyNote: "Deteriorating lower extremity function or new urinary retention requires emergent neurosurgical notification",
    distractorRationales: [
      "Bed rest, serial neuro checks, and NSAID/anticoagulant avoidance are the priorities",
      "Mobilization increases rebleeding risk from the AVM",
      "Heparin would worsen active hemorrhage",
      "Lumbar drain risks spinal cord herniation in spinal hemorrhage"
    ],
    lessonLink: "/emergency/lessons/spinal-cord-emergencies"
  },
  {
    stem: "A 55-year-old male with chronic kidney disease presents with acute confusion, asterixis, and multifocal myoclonus. Serum BUN is 120 mg/dL, creatinine is 9.8 mg/dL. CT head is normal. What neurological condition does this represent?",
    options: [
      "Uremic encephalopathy - requires emergent hemodialysis to remove uremic toxins",
      "Hepatic encephalopathy - requires lactulose administration",
      "Hypertensive encephalopathy - requires IV antihypertensives",
      "Non-convulsive status epilepticus - requires continuous EEG monitoring"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with uremic encephalopathy, a neurological complication of severe renal failure caused by the accumulation of uremic toxins in the brain. The hallmark clinical features include: (1) Progressive cognitive dysfunction (confusion, lethargy progressing to coma), (2) Asterixis (negative myoclonus/liver flap - a bilateral, asynchronous flapping tremor of the hands when wrists are dorsiflexed, caused by intermittent loss of muscle tone), (3) Multifocal myoclonus (sudden, brief, shock-like involuntary muscle jerks), (4) Other neurological symptoms: restlessness, tremor, seizures, and peripheral neuropathy. The pathophysiology involves accumulation of multiple uremic toxins including urea, creatinine, parathyroid hormone, guanidinosuccinic acid, and middle molecules that cross the blood-brain barrier and disrupt neuronal function through multiple mechanisms including oxidative stress, GABA-ergic dysfunction, and alterations in neurotransmitter metabolism. Diagnosis is clinical, based on the combination of severe azotemia (markedly elevated BUN and creatinine), characteristic neurological findings, and exclusion of other causes of encephalopathy. CT head is typically normal. EEG may show generalized slowing but is not specific. The definitive treatment is emergent hemodialysis to remove the accumulated uremic toxins. Clinical improvement typically begins within 24-48 hours of initiating adequate dialysis. Dialysis should be initiated carefully to avoid dialysis disequilibrium syndrome (rapid osmotic shifts causing cerebral edema), using slower flow rates and shorter sessions initially. While asterixis is also seen in hepatic encephalopathy, the markedly elevated BUN/creatinine with normal liver function points to uremic etiology.",
    learningObjective: "Recognize uremic encephalopathy based on neurological findings with severe azotemia and initiate emergent dialysis",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Metabolic Neurological Emergencies",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Asterixis + myoclonus + confusion + high BUN/Cr = uremic encephalopathy; similar presentation to hepatic encephalopathy",
    clinicalPearls: [
      "Asterixis (flapping tremor) is seen in both uremic and hepatic encephalopathy",
      "Multifocal myoclonus is characteristic of metabolic encephalopathies",
      "Emergent dialysis is the definitive treatment for uremic encephalopathy",
      "Start dialysis cautiously to avoid dialysis disequilibrium syndrome"
    ],
    safetyNote: "Rapid dialysis can cause dialysis disequilibrium syndrome (cerebral edema) - start with slower flow rates",
    distractorRationales: [
      "Uremic encephalopathy with severe azotemia requires emergent dialysis",
      "Hepatic encephalopathy would have elevated ammonia and liver dysfunction",
      "Hypertensive encephalopathy requires severely elevated BP and posterior changes on MRI",
      "EEG may be needed to rule out NCSE but clinical picture and labs point to uremia"
    ],
    lessonLink: "/emergency/lessons/metabolic-neurological-emergencies"
  },
  {
    stem: "A nurse is performing neurological assessment on a patient with suspected elevated ICP. Which of the following is the earliest and most reliable sign of increasing intracranial pressure?",
    options: [
      "Decreasing level of consciousness (altered GCS) - the most sensitive early indicator of rising ICP",
      "Cushing triad (hypertension, bradycardia, irregular respirations)",
      "Fixed and dilated pupils bilaterally",
      "Papilledema on fundoscopic examination"
    ],
    correctAnswer: 0,
    rationaleLong: "A decreasing level of consciousness (manifested as declining GCS score, increasing confusion, agitation, or lethargy) is the EARLIEST and most sensitive clinical indicator of rising intracranial pressure. This occurs because the reticular activating system (RAS) in the brainstem, responsible for maintaining wakefulness and alertness, is exquisitely sensitive to changes in intracranial pressure and cerebral perfusion. Even moderate ICP elevations can compress or distort the RAS, producing progressive deterioration in consciousness. The nurse should perform serial GCS assessments (every 1-2 hours for at-risk patients) and immediately report any decrease, even by a single point. The progression of ICP signs follows a predictable pattern from early to late: EARLY: altered consciousness, headache (worse in morning), nausea/vomiting, INTERMEDIATE: ipsilateral pupil dilation (CN III compression from uncal herniation), contralateral hemiparesis (cerebral peduncle compression), LATE: Cushing triad (hypertension, bradycardia, irregular/Cheyne-Stokes respirations - a brainstem response to ischemia), bilateral fixed dilated pupils (bilateral CN III compression from severe herniation). Cushing triad is a LATE and ominous sign indicating brainstem compression and is often a pre-terminal event. Fixed dilated pupils bilaterally indicate severe, often irreversible brainstem compression. Papilledema takes hours to days to develop and is therefore not an early sign of acute ICP elevation. By the time Cushing triad or bilateral fixed pupils appear, significant and potentially irreversible brain injury has already occurred, making early detection of consciousness changes critical for timely intervention.",
    learningObjective: "Identify decreasing level of consciousness as the earliest sign of rising ICP and understand the progression of ICP signs",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Elevated Intracranial Pressure",
    difficulty: 2,
    cognitiveLevel: "comprehension",
    questionType: "MCQ_SINGLE",
    examTrap: "Altered LOC is the EARLIEST ICP sign; Cushing triad is LATE and often pre-terminal; bilateral fixed pupils = severe",
    clinicalPearls: [
      "ICP progression: altered LOC → unilateral pupil dilation → hemiparesis → Cushing triad → bilateral fixed pupils",
      "GCS decline of even 1 point warrants immediate reassessment and notification",
      "Cushing triad is a LATE sign indicating brainstem compression",
      "Papilledema takes hours to days to develop - not useful for acute ICP detection"
    ],
    safetyNote: "Report any GCS decline immediately - early detection of rising ICP allows intervention before irreversible injury",
    distractorRationales: [
      "Altered consciousness is the earliest and most sensitive indicator of rising ICP",
      "Cushing triad is a late, often pre-terminal sign of brainstem compression",
      "Bilateral fixed pupils indicate severe, often irreversible brainstem damage",
      "Papilledema develops over hours to days, not useful for acute detection"
    ],
    lessonLink: "/emergency/lessons/elevated-intracranial-pressure"
  },
  {
    stem: "A 68-year-old male presents with acute onset of inability to speak (global aphasia), right hemiplegia, and right homonymous hemianopia. CT head shows no hemorrhage. CTA reveals a left internal carotid artery (ICA) terminus occlusion. What unique challenge does ICA terminus occlusion present for treatment?",
    options: [
      "ICA terminus occlusion has lower alteplase recanalization rates than MCA occlusion and higher clot burden requiring mechanical thrombectomy",
      "ICA terminus occlusion responds better to alteplase alone than other large vessel occlusions",
      "ICA terminus occlusion is not amenable to mechanical thrombectomy",
      "ICA terminus occlusion has a better natural history than MCA occlusion"
    ],
    correctAnswer: 0,
    rationaleLong: "Internal carotid artery (ICA) terminus occlusion (also called ICA-T or carotid T occlusion) is one of the most challenging stroke presentations because of several unique features: (1) Large clot burden: The ICA terminus is where the ICA bifurcates into the MCA and ACA. A clot at this location typically affects a massive territory including the entire MCA and often the ACA distribution, resulting in severe strokes (NIHSS usually >15, as in this patient with global aphasia, hemiplegia, and hemianopia). (2) Low alteplase recanalization rates: IV alteplase alone achieves recanalization in only 4-10% of ICA-T occlusions (compared to 30% for M1 MCA occlusions and 50% for M2 MCA occlusions). The clot is simply too large for chemical thrombolysis to dissolve effectively in the treatment window. (3) High mortality without intervention: 40-60% mortality with medical management alone. (4) Thrombectomy is essential: Mechanical thrombectomy significantly improves outcomes in ICA-T occlusion, with recanalization rates of 70-90% using modern stent retriever and aspiration techniques. Multiple trials (MR CLEAN, ESCAPE) included ICA-T patients. However, thrombectomy of ICA-T is technically more challenging and may require combined techniques (stent retriever + aspiration). The emergency nurse should recognize that ICA-T stroke patients are the HIGHEST PRIORITY for rapid transfer to the neurointerventional suite, as they have the most to gain from mechanical thrombectomy and the least benefit from alteplase alone. Time to reperfusion is the single most important modifiable factor.",
    learningObjective: "Recognize ICA terminus occlusion as a high-clot-burden stroke requiring mechanical thrombectomy due to poor alteplase response",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Stroke Management",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "ICA-T occlusion: alteplase recanalization only 4-10% vs thrombectomy 70-90% - prioritize thrombectomy",
    clinicalPearls: [
      "ICA-T occlusion affects MCA + ACA territories = devastating strokes",
      "Alteplase alone recanalized only 4-10% of ICA-T clots",
      "Mechanical thrombectomy achieves 70-90% recanalization",
      "These patients are the highest priority for thrombectomy transfer"
    ],
    safetyNote: "Do not delay thrombectomy transfer for ICA-T occlusion waiting for alteplase effect - recanalization rate is extremely low",
    distractorRationales: [
      "ICA-T has the lowest alteplase response rate and highest clot burden requiring thrombectomy",
      "Alteplase alone is insufficient for ICA-T with only 4-10% recanalization",
      "ICA-T is amenable to thrombectomy with high recanalization rates",
      "ICA-T has among the worst natural histories of all stroke types"
    ],
    lessonLink: "/emergency/lessons/stroke-management"
  },
  {
    stem: "A 20-year-old male presents after a concussion during a football game. He had a brief loss of consciousness, is now alert, and GCS is 15. CT head is normal. He reports headache, dizziness, and difficulty concentrating. What are the key discharge instructions the emergency nurse should provide?",
    options: [
      "Cognitive and physical rest for 24-48 hours, graduated return-to-play protocol with physician clearance, return for worsening headache/vomiting/confusion/seizure",
      "Complete bed rest for 2 weeks with no stimulation of any kind",
      "Normal activity can resume immediately since CT is normal",
      "Return to full contact sports after 24 hours if asymptomatic"
    ],
    correctAnswer: 0,
    rationaleLong: "Concussion (mild traumatic brain injury) management has evolved significantly. Current evidence-based guidelines recommend: (1) Initial cognitive and physical REST for 24-48 hours: This means avoiding strenuous physical activity, limiting screen time, and reducing cognitively demanding activities. However, complete rest beyond 48 hours has been shown to DELAY recovery and is no longer recommended. Light activity (walking, light housework) is encouraged after the initial rest period. (2) Graduated return-to-play (RTP) protocol: This is a stepwise process requiring physician clearance and a minimum of 6 steps over at least 6 days: Step 1 (24-48h rest) → Step 2 (light aerobic activity) → Step 3 (sport-specific exercise) → Step 4 (non-contact training drills) → Step 5 (full contact practice with medical clearance) → Step 6 (return to competition). If symptoms recur at any step, the athlete returns to the previous step for 24 hours. (3) Return precautions: The patient and a responsible companion should be instructed to return to the ED immediately for: worsening or severe headache, repeated vomiting, seizures, increasing confusion or difficulty waking, weakness or numbness in extremities, slurred speech, or behavioral changes. (4) No same-day return to play: A concussed athlete should NEVER return to play on the same day as the injury, regardless of how quickly symptoms resolve. Second Impact Syndrome (SIS) - a rare but potentially fatal condition where a second concussion before the first has resolved leads to rapid, catastrophic cerebral edema - is the primary concern. Complete bed rest for 2 weeks has been shown to worsen outcomes. Immediate normal activity or early return to contact sports risks SIS.",
    learningObjective: "Provide evidence-based concussion discharge instructions including graduated return-to-play protocol and danger signs",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Traumatic Brain Injury",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "24-48h rest then gradual activity increase; prolonged complete rest DELAYS recovery; NO same-day return to play",
    clinicalPearls: [
      "Initial rest 24-48 hours, then graduated return-to-activity",
      "Complete rest beyond 48 hours delays recovery",
      "6-step return-to-play protocol over minimum 6 days",
      "Second Impact Syndrome: rare but potentially fatal with premature return"
    ],
    safetyNote: "NEVER allow same-day return to play after concussion - risk of Second Impact Syndrome",
    distractorRationales: [
      "24-48h rest then graduated RTP with physician clearance is evidence-based",
      "Complete bed rest for 2 weeks delays recovery and is not recommended",
      "Immediate normal activity risks Second Impact Syndrome",
      "24-hour return to contact sports is far too early - minimum 6-day RTP protocol"
    ],
    lessonLink: "/emergency/lessons/traumatic-brain-injury"
  }
];
