import type { LessonContent } from "./types";

export const rnContentBatch006Lessons: Record<string, LessonContent> = {
  "stroke-tia-comprehensive-rn": {
    title: "Stroke and TIA: Comprehensive RN Management",
    cellular: {
      title: "Cerebrovascular Ischemia and Hemorrhagic Mechanisms",
      content: "Stroke is classified as ischemic (87%) or hemorrhagic (13%). Ischemic stroke results from thrombotic occlusion of a cerebral artery (large vessel atherosclerosis or small vessel lacunar infarction) or embolic occlusion (cardiogenic emboli from atrial fibrillation, valvular disease, or paradoxical embolism through patent foramen ovale). Within seconds of occlusion, neurons in the ischemic core lose ATP and undergo irreversible injury through glutamate-mediated excitotoxicity, calcium influx, free radical production, and membrane failure. Surrounding the core is the penumbra—tissue with compromised but viable perfusion sustained by collateral flow. The penumbra is the therapeutic target: reperfusion within the time window can salvage this tissue. Time is brain: approximately 1.9 million neurons die per minute in untreated large vessel occlusion. Hemorrhagic stroke occurs from intracerebral hemorrhage (ICH, most commonly from hypertensive arteriolar damage in basal ganglia, thalamus, pons, or cerebellum) or subarachnoid hemorrhage (SAH, from ruptured berry aneurysm at the Circle of Willis). Transient ischemic attack (TIA) produces temporary neurological deficit lasting <24 hours (typically <1 hour) without permanent infarction on imaging."
    },
    riskFactors: [
      "Hypertension: single most important modifiable risk factor for both ischemic and hemorrhagic stroke",
      "Atrial fibrillation: 5-fold increased risk of cardioembolic stroke; CHA2DS2-VASc score guides anticoagulation",
      "Diabetes mellitus with accelerated atherosclerosis and endothelial dysfunction",
      "Hyperlipidemia with carotid artery atherosclerosis (>70% stenosis significantly increases risk)",
      "Smoking: 2-4 fold increased risk; risk decreases substantially within 5 years of cessation",
      "Prior TIA: 10-15% risk of stroke within 90 days; highest risk in first 48 hours (ABCD2 score for risk stratification)",
      "Sickle cell disease in pediatric population (most common cause of stroke in children)",
      "Cocaine and amphetamine use causing vasospasm and hemorrhagic stroke"
    ],
    diagnostics: [
      "Non-contrast CT head STAT: first-line to rule out hemorrhagic stroke before thrombolytic therapy (must be obtained within 25 minutes of arrival)",
      "CT angiography (CTA): identifies large vessel occlusion for mechanical thrombectomy candidacy",
      "CT perfusion: differentiates ischemic core from salvageable penumbra, extends treatment window",
      "MRI with diffusion-weighted imaging (DWI): most sensitive for early ischemic changes and small infarctions",
      "NIH Stroke Scale (NIHSS): standardized neurological assessment quantifying stroke severity (0-42 points)",
      "Blood glucose: must be checked before tPA (hypoglycemia can mimic stroke); tPA contraindicated if glucose <50",
      "ECG and telemetry monitoring for atrial fibrillation as embolic source",
      "Carotid Doppler ultrasound for evaluation of carotid stenosis in anterior circulation strokes"
    ],
    management: [
      "Ischemic stroke: IV alteplase (tPA) 0.9mg/kg (max 90mg) within 4.5 hours of symptom onset: 10% bolus over 1 minute, remainder infused over 60 minutes",
      "Large vessel occlusion: mechanical thrombectomy within 24 hours if favorable perfusion imaging",
      "Permissive hypertension: do NOT lower BP in acute ischemic stroke unless >220/120 (or >185/110 if tPA candidate); elevated BP maintains perfusion to penumbra",
      "Hemorrhagic stroke: aggressive BP reduction to SBP <140 within 1 hour (IV nicardipine, labetalol, or clevidipine)",
      "SAH: secure the aneurysm (surgical clipping or endovascular coiling) within 24 hours; nimodipine 60mg q4h x 21 days for vasospasm prevention",
      "Post-acute: antiplatelet therapy (aspirin or clopidogrel) for secondary prevention in ischemic stroke; anticoagulation for cardioembolic stroke",
      "Dysphagia screening before any oral intake to prevent aspiration pneumonia"
    ],
    nursingActions: [
      "Activate stroke code immediately upon recognition of stroke symptoms; time of symptom onset (or last known well time) is critical",
      "Perform NIHSS assessment at baseline, 2 hours post-tPA, 24 hours, and with any neurological change",
      "Monitor BP per protocol: pre-tPA maintain <185/110; during and 24 hours post-tPA maintain <180/105; post-hemorrhagic stroke maintain <140 systolic",
      "Perform neurological checks every 15 minutes x2 hours post-tPA, then every 30 minutes x6 hours, then hourly x16 hours",
      "Watch for hemorrhagic conversion post-tPA: sudden headache, nausea, vomiting, new neurological deficit, hypertension—stop tPA immediately, stat CT",
      "Maintain head of bed at 0-30 degrees to optimize cerebral perfusion (unless increased ICP, then elevate to 30 degrees)",
      "Assess swallowing function before giving any PO medications, food, or fluids (bedside swallow screen)",
      "Position affected extremities to prevent contractures; initiate early mobilization per protocol"
    ],
    assessmentFindings: [
      "Anterior circulation (MCA) stroke: contralateral hemiparesis/hemiplegia, hemisensory loss, homonymous hemianopia, aphasia (dominant hemisphere) or neglect/anosognosia (non-dominant hemisphere)",
      "Posterior circulation (vertebrobasilar) stroke: vertigo, diplopia, dysphagia, ataxia, crossed deficits (ipsilateral face + contralateral body)",
      "Lacunar stroke: pure motor or pure sensory deficit without cortical signs (no aphasia, neglect, or visual field loss)",
      "Hemorrhagic stroke: sudden severe headache ('worst headache of my life' in SAH), rapid progression, often with vomiting and decreased LOC",
      "TIA: transient neurological deficit resolving completely within 24 hours (usually <1 hour)"
    ],
    signs: {
      left: [
        "Facial droop: ask patient to smile (unilateral weakness)",
        "Arm drift: hold both arms outstretched with eyes closed",
        "Speech difficulty: slurred speech (dysarthria) or word-finding difficulty (aphasia)",
        "Sudden onset of symptoms (BE-FAST: Balance, Eyes, Face, Arms, Speech, Time)"
      ],
      right: [
        "Hemorrhagic conversion: sudden worsening after initial improvement",
        "Increased ICP: Cushing triad (hypertension, bradycardia, irregular respirations)",
        "Seizure activity in hemorrhagic stroke or large infarction",
        "Cerebral edema with midline shift causing herniation (days 3-5 post-stroke)"
      ]
    },
    medications: [
      { name: "Alteplase (tPA)", type: "Thrombolytic (Tissue Plasminogen Activator)", action: "Binds to fibrin in the thrombus and converts entrapped plasminogen to plasmin, which degrades the fibrin clot matrix. Restores blood flow to the ischemic penumbra, salvaging viable brain tissue. 30% relative reduction in disability at 3 months", sideEffects: "Hemorrhage (intracranial hemorrhage in 6% of treated patients), angioedema (especially with concurrent ACEi), systemic bleeding", contra: "Active internal bleeding, recent surgery/trauma within 14 days, history of ICH, BP >185/110 unresponsive to treatment, platelets <100,000, INR >1.7, glucose <50mg/dL, stroke or head trauma within 3 months", pearl: "Door-to-needle time goal is <60 minutes. 10% given as bolus over 1 minute, 90% infused over 60 minutes. NO anticoagulants or antiplatelets for 24 hours after tPA. Obtain repeat CT at 24 hours before starting antiplatelet therapy. Monitor for angioedema: swelling of tongue, lips, or oropharynx." },
      { name: "Nimodipine", type: "Calcium Channel Blocker (Cerebral Selective)", action: "Selectively dilates cerebral arteries by blocking L-type calcium channels in cerebral vascular smooth muscle. Prevents and treats cerebral vasospasm after subarachnoid hemorrhage, which peaks at days 4-14. Reduces poor neurological outcomes by 40%", sideEffects: "Hypotension (dose-limiting), headache, nausea, peripheral edema", contra: "Severe hypotension, concurrent IV calcium channel blocker, concurrent strong CYP3A4 inhibitors", pearl: "60mg PO/NG every 4 hours for 21 days starting within 96 hours of SAH. Must be given orally or via NG tube—NEVER give IV (has caused fatal cardiovascular collapse). Held for SBP <90. Reduce dose in hepatic impairment." }
    ],
    pearls: [
      "Time is brain: 1.9 million neurons die per minute during untreated large vessel occlusion—every minute of delay matters",
      "Permissive hypertension in ischemic stroke: do NOT lower BP unless >220/120 (or >185/110 if tPA candidate)—elevated BP maintains perfusion to the penumbra",
      "tPA contraindication mnemonics: recent surgery/trauma, active bleeding, hemorrhagic stroke, platelets <100K, INR >1.7, BP >185/110",
      "Nimodipine is ORAL only in SAH—IV administration has caused fatal cardiovascular collapse",
      "TIA is a stroke warning: 10-15% of TIA patients have a stroke within 90 days, with highest risk in first 48 hours—urgent workup is essential"
    ],
    quiz: [
      { question: "A patient presents with sudden left-sided weakness, facial droop, and slurred speech. Symptom onset was 90 minutes ago. CT head shows no hemorrhage. BP is 178/96. What is the priority intervention?", options: ["Lower BP to below 140/90 immediately", "Administer IV alteplase per protocol", "Obtain MRI to confirm ischemic stroke", "Administer aspirin 325mg immediately"], correct: 1, rationale: "This patient has an acute ischemic stroke within the 4.5-hour tPA window with no hemorrhage on CT and BP within the tPA-eligible range (<185/110). tPA is the priority to restore blood flow and salvage the penumbra. Aspirin is held for 24 hours after tPA. MRI delays treatment." },
      { question: "Two hours after tPA administration, a stroke patient develops sudden severe headache, vomiting, and new right-sided weakness. What should the nurse do first?", options: ["Continue tPA and administer ondansetron for nausea", "Stop tPA infusion immediately and obtain stat CT head", "Administer IV nitroglycerin for possible hypertension", "Perform NIHSS assessment and document findings"], correct: 1, rationale: "Sudden headache, vomiting, and new neurological deficit after tPA suggest hemorrhagic conversion—a life-threatening complication. The priority is stopping tPA immediately and obtaining an emergent CT to confirm. Treatment includes cryoprecipitate for fibrinogen replacement and neurosurgical consultation." },
      { question: "A patient with subarachnoid hemorrhage is on day 5 post-bleed. The nurse should be most vigilant for:", options: ["Deep vein thrombosis", "Cerebral vasospasm", "Rebleeding from the aneurysm", "Seizure activity"], correct: 1, rationale: "Cerebral vasospasm peaks between days 4-14 after SAH and is the leading cause of delayed neurological deterioration. The nurse should monitor for new focal deficits, confusion, or decreased LOC. Transcranial Doppler monitoring and nimodipine therapy are key preventive strategies." },
      { question: "A nurse is caring for a patient with acute ischemic stroke who is not a tPA candidate. The BP is 198/108. What is the appropriate BP management?", options: ["Reduce BP to <140/90 within 1 hour", "Allow permissive hypertension unless BP >220/120", "Administer IV labetalol to achieve BP <160/100", "Start oral amlodipine for gradual reduction"], correct: 1, rationale: "In acute ischemic stroke without tPA, permissive hypertension is maintained to ensure cerebral perfusion to the ischemic penumbra. BP is only treated if >220/120. Aggressive lowering can extend the infarction by reducing perfusion to already-compromised tissue." }
    ]
  },

  "seizures-seizure-care-rn": {
    title: "Seizures and Seizure Care: RN Assessment and Management",
    cellular: {
      title: "Neuronal Hyperexcitability and Seizure Propagation",
      content: "Seizures result from abnormal, excessive, and synchronous neuronal discharge in the cerebral cortex caused by an imbalance between excitatory (glutamate) and inhibitory (GABA) neurotransmission. The balance tips toward excitation through several mechanisms: increased glutamate release, enhanced NMDA/AMPA receptor sensitivity, decreased GABAergic inhibition, or altered ion channel function (channelopathies). Focal seizures originate from a localized cortical region and produce symptoms reflecting that area's function (e.g., temporal lobe = automatisms, déjà vu, olfactory hallucinations; frontal lobe = motor activity). Generalized seizures involve both hemispheres from onset through thalamocortical circuits. Tonic-clonic seizures involve initial tonic phase (sustained muscle contraction from synchronous cortical discharge, 10-20 seconds) followed by clonic phase (rhythmic contracting and relaxing from alternating excitatory and inhibitory volleys, 30-60 seconds). Status epilepticus (seizure lasting >5 minutes or recurrent seizures without recovery) represents a neurological emergency where excitatory mechanisms overwhelm inhibitory controls, GABA receptors are internalized from the membrane, and progressive neuronal injury occurs from metabolic exhaustion, hyperthermia, and excitotoxicity."
    },
    riskFactors: [
      "Epilepsy (recurrent unprovoked seizures; affects 1% of population)",
      "Acute brain injury: stroke, traumatic brain injury, brain tumor, CNS infection (meningitis, encephalitis, brain abscess)",
      "Metabolic derangements: hypoglycemia (<60 mg/dL), hyponatremia (<120 mEq/L), hypocalcemia, hepatic/uremic encephalopathy",
      "Drug and alcohol withdrawal (especially benzodiazepine and alcohol withdrawal seizures 12-48 hours after last use)",
      "Medication-induced: tramadol, bupropion, theophylline, fluoroquinolones, imipenem lower seizure threshold",
      "Eclampsia in pregnant patients (seizures from severe preeclampsia)",
      "Febrile seizures in children 6 months to 5 years (most common pediatric seizure type)"
    ],
    diagnostics: [
      "Electroencephalography (EEG): gold standard for seizure classification and epilepsy diagnosis; identifies epileptiform discharges and seizure focus",
      "CT head without contrast: emergent imaging to rule out hemorrhage, mass lesion, or structural cause",
      "MRI brain with epilepsy protocol: identifies structural lesions (mesial temporal sclerosis, cortical dysplasia, tumors)",
      "Serum glucose, electrolytes (Na+, Ca2+, Mg2+), BUN/creatinine, hepatic function panel",
      "Antiepileptic drug (AED) levels: assess compliance and therapeutic dosing (phenytoin, valproic acid, carbamazepine)",
      "Prolactin level: elevated 10-20 minutes after generalized tonic-clonic seizure (helps differentiate from psychogenic nonepileptic events)",
      "Lumbar puncture if CNS infection suspected (after CT rules out mass effect)"
    ],
    management: [
      "First-line for acute seizure/status epilepticus: IV lorazepam 0.1mg/kg (max 4mg per dose, may repeat once) or IM midazolam 10mg if no IV access",
      "Second-line: IV fosphenytoin 20mg PE/kg or IV levetiracetam 60mg/kg (max 4500mg) or IV valproate 40mg/kg",
      "Refractory status epilepticus (persists after two AED attempts): continuous infusion of midazolam, propofol, or pentobarbital with EEG monitoring",
      "Long-term AED therapy based on seizure type: levetiracetam (broad-spectrum, first-line), lamotrigine, valproic acid, carbamazepine, oxcarbazepine",
      "Identify and treat underlying cause: correct metabolic abnormalities, treat infection, evacuate hemorrhage, resect tumor"
    ],
    nursingActions: [
      "During seizure: protect from injury, turn to side (recovery position) to maintain airway, DO NOT restrain or place anything in the mouth",
      "Time the seizure from onset—activate emergency response if >5 minutes (status epilepticus threshold)",
      "Note seizure characteristics: type of movement, body parts involved, progression, eye deviation, automatisms, duration, post-ictal state",
      "Ensure suction equipment at bedside; suction airway only after seizure activity stops",
      "Maintain seizure precautions: padded side rails up, bed in lowest position, suction and oxygen at bedside",
      "Monitor oxygen saturation during and after seizure; apply supplemental oxygen as needed",
      "Assess post-ictal state: level of consciousness, orientation, focal deficits (Todd paralysis), injuries sustained during seizure",
      "Administer AEDs as prescribed; monitor therapeutic drug levels and signs of toxicity"
    ],
    assessmentFindings: [
      "Tonic-clonic: sudden LOC, tonic stiffening (10-20 seconds) followed by clonic jerking (30-60 seconds), cyanosis, incontinence, tongue biting, post-ictal confusion (minutes to hours)",
      "Focal aware (simple partial): no LOC; motor, sensory, autonomic, or psychic symptoms depending on cortical area",
      "Focal impaired awareness (complex partial): altered consciousness with automatisms (lip smacking, picking at clothes, wandering)",
      "Absence: brief (5-30 seconds) staring episodes with behavioral arrest, often mistaken for daydreaming in children",
      "Post-ictal phase: confusion, fatigue, headache, muscle soreness, Todd paralysis (temporary focal weakness mimicking stroke)"
    ],
    signs: {
      left: [
        "Tonic-clonic: LOC with stiffening then rhythmic jerking",
        "Focal motor: unilateral jerking of face, arm, or leg",
        "Absence: brief staring episodes in children",
        "Aura: warning sign of impending seizure (déjà vu, smells, tingling)"
      ],
      right: [
        "Status epilepticus: continuous seizure >5 minutes or recurrent without recovery",
        "Cyanosis during tonic phase from respiratory muscle spasm",
        "Tongue laceration from jaw clenching during tonic phase",
        "Post-ictal confusion, Todd paralysis, incontinence"
      ]
    },
    medications: [
      { name: "Levetiracetam (Keppra)", type: "Antiepileptic Drug", action: "Binds to synaptic vesicle protein SV2A, modulating neurotransmitter release and reducing neuronal synchronization. Broad-spectrum efficacy for focal and generalized seizures with no hepatic metabolism and minimal drug interactions", sideEffects: "Behavioral changes (irritability, aggression, depression—'Keppra rage'), drowsiness, headache, dizziness", contra: "Hypersensitivity to levetiracetam; use with caution in patients with depression or behavioral disorders", pearl: "First-line AED due to broad-spectrum efficacy, no drug interactions, no hepatic metabolism, and no therapeutic drug monitoring needed. Dose adjustment required in renal impairment. Behavioral side effects may require switching to brivaracetam (same mechanism, fewer behavioral effects)." },
      { name: "Lorazepam (Ativan)", type: "Benzodiazepine", action: "Enhances GABA-A receptor activity by increasing chloride channel opening frequency, rapidly increasing inhibitory neurotransmission and terminating seizure activity within 2-3 minutes IV. Longest-acting benzodiazepine for seizure termination (duration 12-24 hours)", sideEffects: "Respiratory depression (primary concern), hypotension, sedation, paradoxical agitation", contra: "Severe respiratory insufficiency, acute narrow-angle glaucoma, known benzodiazepine hypersensitivity", pearl: "First-line for status epilepticus: 0.1mg/kg IV (max 4mg) over 2 minutes, may repeat once. Must have respiratory support equipment ready. Duration of action makes it preferred over diazepam for status epilepticus. IM midazolam is the alternative when IV access is unavailable (RAMPART trial: IM midazolam was superior to IV lorazepam when IV access was delayed)." }
    ],
    pearls: [
      "NEVER place anything in the mouth during a seizure—risk of broken teeth and airway obstruction far outweighs the risk of tongue biting",
      "5-minute rule for status epilepticus: any seizure lasting >5 minutes requires emergency benzodiazepine treatment; waiting for self-termination risks brain damage",
      "Todd paralysis (temporary post-ictal focal weakness) can mimic stroke—history of seizure and resolution within 24 hours differentiates the two",
      "Phenytoin toxicity triad: nystagmus (first sign), ataxia, then altered mental status—check levels if any of these appear",
      "Women of childbearing age: valproic acid is teratogenic (neural tube defects); levetiracetam or lamotrigine are preferred"
    ],
    quiz: [
      { question: "A nurse witnesses a patient having a generalized tonic-clonic seizure. Which actions are appropriate? Select the best answer.", options: ["Restrain the patient's arms and legs to prevent injury", "Insert an oral airway between the teeth to prevent tongue biting", "Turn the patient to the side, clear the area of hazards, and time the seizure", "Hold the patient's head firmly against the pillow"], correct: 2, rationale: "During a seizure: turn to the side (maintains airway, prevents aspiration), remove hazardous objects, time the seizure. NEVER restrain (risk of fractures), never put anything in the mouth (risk of broken teeth and airway obstruction), never hold the head down (risk of cervical injury)." },
      { question: "A patient's seizure has lasted 6 minutes and shows no signs of stopping. Which medication should the nurse prepare to administer first?", options: ["Phenytoin 1000mg IV", "Lorazepam 4mg IV", "Levetiracetam 500mg PO", "Phenobarbital 60mg IM"], correct: 1, rationale: "Status epilepticus (seizure >5 minutes) requires emergent IV benzodiazepine. Lorazepam 0.1mg/kg (max 4mg) IV is first-line due to rapid onset (2-3 minutes) and longest duration of action among benzodiazepines. Phenytoin is second-line if benzodiazepines fail." },
      { question: "A patient on phenytoin (Dilantin) 300mg daily develops nystagmus and unsteady gait. Which action should the nurse take?", options: ["Administer the next dose as scheduled", "Hold the medication and check a phenytoin level", "Increase the dose to control breakthrough seizures", "Switch to immediate-release formulation"], correct: 1, rationale: "Nystagmus and ataxia are early signs of phenytoin toxicity. The medication should be held and a serum level checked (therapeutic range 10-20 mcg/mL). Phenytoin has zero-order kinetics, meaning small dose increases can cause disproportionate level rises." },
      { question: "Which nursing assessment is most important to document during a witnessed seizure?", options: ["The patient's last meal", "The type, duration, and progression of the seizure activity and body parts involved", "Whether the patient was watching television", "The room temperature"], correct: 1, rationale: "Detailed seizure documentation helps classify the seizure type and localize the focus: note onset (which body part started first), progression (did it spread?), type of movement, eye deviation, duration, incontinence, and post-ictal state. This information guides treatment decisions and EEG interpretation." }
    ]
  },

  "meningitis-comprehensive-rn": {
    title: "Meningitis: Comprehensive RN Assessment and Management",
    cellular: {
      title: "Meningeal Inflammation and CSF Infection",
      content: "Meningitis is inflammation of the meninges (pia mater and arachnoid) and the cerebrospinal fluid (CSF) within the subarachnoid space. Bacterial meningitis is most dangerous: organisms (Neisseria meningitidis, Streptococcus pneumoniae, Group B Streptococcus in neonates, Listeria monocytogenes in elderly/immunocompromised) reach the meninges hematogenously or via direct extension. Bacteria multiply rapidly in the protein-rich, complement-poor CSF environment. Bacterial cell wall components (lipopolysaccharide, peptidoglycan) trigger an intense inflammatory cascade: cytokine release (TNF-alpha, IL-1, IL-6) increases blood-brain barrier permeability, allowing neutrophil migration into the CSF. This inflammatory exudate increases CSF viscosity and obstructs CSF reabsorption at the arachnoid granulations, causing communicating hydrocephalus and elevated intracranial pressure (ICP). Cerebral edema (vasogenic from BBB breakdown, cytotoxic from neuronal injury, and interstitial from obstructed CSF flow) further elevates ICP. Vasculitis of meningeal blood vessels can cause cortical infarction. Viral meningitis (most commonly enteroviruses) causes lymphocytic pleocytosis in CSF and is generally self-limited. Mortality in bacterial meningitis is 15-25% even with treatment."
    },
    riskFactors: [
      "Extremes of age: neonates (<3 months) and elderly (>65 years) due to immature or declining immune function",
      "Close-quarters living: college dormitories, military barracks, daycare centers (N. meningitidis spread via respiratory droplets)",
      "Immunocompromised states: asplenia (encapsulated organisms), HIV/AIDS, complement deficiencies, immunosuppressive therapy",
      "CSF leak from skull fracture or neurosurgical procedure (direct bacterial entry)",
      "Cochlear implants (increased risk of S. pneumoniae meningitis)",
      "Non-vaccination or incomplete vaccination against meningococcus, pneumococcus, Haemophilus influenzae type b",
      "Basilar skull fracture with CSF rhinorrhea or otorrhea"
    ],
    diagnostics: [
      "Lumbar puncture with CSF analysis (gold standard): bacterial = elevated WBC with neutrophil predominance, elevated protein (>100mg/dL), decreased glucose (<40mg/dL or <60% of serum glucose), elevated opening pressure",
      "Viral meningitis CSF: lymphocytic pleocytosis, normal to mildly elevated protein, normal glucose",
      "CSF Gram stain and culture: identifies organism and guides antibiotic selection",
      "Blood cultures x2 BEFORE antibiotics (positive in 50-80% of bacterial meningitis)",
      "CT head before LP if risk of herniation: papilledema, focal neurological deficits, altered consciousness, immunocompromised, age >60, history of CNS disease",
      "Procalcitonin and CRP: elevated in bacterial meningitis, help differentiate from viral",
      "PCR testing for specific organisms (HSV, enterovirus, N. meningitidis) when cultures are negative"
    ],
    management: [
      "Empiric antibiotics IMMEDIATELY after blood cultures drawn—do NOT delay for LP or CT (every hour of delay increases mortality 30%)",
      "Empiric regimen: ceftriaxone + vancomycin (adults); add ampicillin if age >50 or immunocompromised (Listeria coverage)",
      "Dexamethasone 0.15mg/kg q6h x4 days started BEFORE or WITH first antibiotic dose—reduces mortality and hearing loss in S. pneumoniae meningitis",
      "Narrow antibiotics based on CSF culture and sensitivity results",
      "Supportive care: IV fluids (avoid overhydration which worsens cerebral edema), ICP management, seizure prophylaxis",
      "Chemoprophylaxis for close contacts of N. meningitidis: rifampin, ciprofloxacin, or ceftriaxone within 24 hours of case identification"
    ],
    nursingActions: [
      "Implement droplet precautions immediately for suspected bacterial meningitis until 24 hours of effective antibiotics",
      "Perform neurological assessments every 1-2 hours: GCS, pupil reactivity, motor response, signs of increased ICP",
      "Monitor for signs of increased ICP: decreasing LOC, widening pulse pressure, bradycardia, irregular respirations (Cushing triad), pupil changes",
      "Maintain dim, quiet environment to reduce photophobia and headache aggravation",
      "Position head of bed at 30 degrees to promote venous drainage and reduce ICP",
      "Strict I&O monitoring; avoid fluid overload which can worsen cerebral edema",
      "Assess for complications: seizures, cranial nerve palsies (hearing loss CN VIII), DIC, septic shock, Waterhouse-Friderichsen syndrome (adrenal hemorrhage)",
      "Educate on chemoprophylaxis for close contacts; report to public health authorities"
    ],
    assessmentFindings: [
      "Classic triad (present in <50% of adults): headache, fever, nuchal rigidity",
      "Altered mental status ranging from confusion to coma",
      "Kernig sign: resistance and pain on passive knee extension when hip is flexed to 90 degrees",
      "Brudzinski sign: involuntary hip and knee flexion when neck is passively flexed",
      "Photophobia and phonophobia",
      "Neonatal presentation is nonspecific: irritability, poor feeding, bulging fontanel, high-pitched cry, temperature instability",
      "Petechial/purpuric rash (especially N. meningitidis): non-blanching, progresses rapidly, indicates DIC"
    ],
    signs: {
      left: [
        "Severe headache with neck stiffness",
        "Fever (often >38.5°C/101.3°F)",
        "Photophobia and phonophobia",
        "Kernig and Brudzinski signs positive"
      ],
      right: [
        "Altered mental status to coma",
        "Petechial/purpuric rash (meningococcal)",
        "Seizures from cortical irritation",
        "Signs of increased ICP: Cushing triad, pupil changes"
      ]
    },
    medications: [
      { name: "Ceftriaxone", type: "Third-generation Cephalosporin", action: "Bactericidal; binds penicillin-binding proteins and inhibits cell wall synthesis. Excellent CSF penetration when meninges are inflamed. Covers S. pneumoniae, N. meningitidis, H. influenzae, and Gram-negative organisms", sideEffects: "Biliary sludging and pseudocholelithiasis, diarrhea (C. difficile risk), allergic reactions (cross-reactivity with penicillin allergy ~2%)", contra: "Neonates with hyperbilirubinemia (displaces bilirubin from albumin; use cefotaxime instead), concurrent IV calcium (precipitation risk in neonates)", pearl: "Standard meningitis dose: 2g IV q12h in adults. Do NOT delay for LP results—start empirically immediately after blood cultures. Achieves bactericidal CSF concentrations within 1-2 hours. Combined with vancomycin for empiric coverage of penicillin-resistant pneumococcus." },
      { name: "Dexamethasone", type: "Corticosteroid", action: "Reduces inflammatory cascade in bacterial meningitis by inhibiting cytokine production (TNF-alpha, IL-1). Decreases BBB permeability, cerebral edema, and ICP. Reduces mortality and neurological sequelae (especially sensorineural hearing loss) in S. pneumoniae meningitis", sideEffects: "Hyperglycemia, GI bleeding, immunosuppression, adrenal suppression", contra: "Should not be given after antibiotics are started (must be given before or concurrent with first antibiotic dose for maximum benefit)", pearl: "0.15mg/kg IV q6h for 4 days, started 15-20 minutes BEFORE or WITH the first dose of antibiotics. Timing is critical: the anti-inflammatory effect must coincide with the massive bacterial lysis and antigen release from antibiotic-mediated killing. If antibiotics have already been given, the benefit of dexamethasone is significantly reduced." }
    ],
    pearls: [
      "Time kills in bacterial meningitis: every hour of antibiotic delay increases mortality by 30%—draw blood cultures and start empiric antibiotics immediately",
      "Dexamethasone must be given BEFORE or WITH the first antibiotic dose—giving it after reduces its benefit significantly",
      "Do NOT delay antibiotics for CT or LP—if CT is needed first, give antibiotics immediately after blood cultures, then proceed with CT and LP",
      "Petechial/purpuric rash + fever + altered mental status = meningococcemia until proven otherwise—initiate droplet precautions and empiric antibiotics immediately",
      "Neonates with meningitis present atypically: irritability, poor feeding, temperature instability, bulging fontanel—classic neck stiffness may be absent"
    ],
    quiz: [
      { question: "A patient presents with fever, severe headache, nuchal rigidity, and photophobia. A CT scan is ordered before lumbar puncture. What should the nurse do regarding antibiotics?", options: ["Wait for LP results before starting antibiotics", "Wait for CT results before starting antibiotics", "Draw blood cultures and start empiric antibiotics immediately without waiting for CT or LP", "Start antibiotics only after Gram stain results are available"], correct: 2, rationale: "In suspected bacterial meningitis, every hour of antibiotic delay increases mortality by 30%. Blood cultures should be drawn immediately, followed by empiric antibiotics. CT and LP can be performed after antibiotics are initiated without significantly affecting diagnostic yield." },
      { question: "A nurse is caring for a patient with confirmed Neisseria meningitidis meningitis. Which infection control precaution is required?", options: ["Standard precautions only", "Contact precautions with gown and gloves", "Droplet precautions until 24 hours of effective antibiotic therapy", "Airborne precautions with N95 respirator"], correct: 2, rationale: "N. meningitidis is transmitted via respiratory droplets. Droplet precautions (surgical mask within 3-6 feet) are required until the patient has received 24 hours of effective antibiotic therapy. Close contacts require chemoprophylaxis." },
      { question: "Which CSF findings are most consistent with bacterial meningitis?", options: ["Lymphocytic pleocytosis, normal glucose, mildly elevated protein", "Neutrophilic pleocytosis, decreased glucose, markedly elevated protein, elevated opening pressure", "Normal WBC count with mildly elevated protein", "Red blood cells with xanthochromia"], correct: 1, rationale: "Bacterial meningitis CSF shows neutrophilic predominance, decreased glucose (<40 or <60% of serum), markedly elevated protein (>100mg/dL), and elevated opening pressure. Viral meningitis shows lymphocytic pleocytosis with normal glucose. RBCs with xanthochromia suggests subarachnoid hemorrhage." },
      { question: "When should dexamethasone be administered in bacterial meningitis?", options: ["After 24 hours of antibiotic therapy", "Only if the patient develops seizures", "Before or at the same time as the first dose of antibiotics", "Only in children under 5 years"], correct: 2, rationale: "Dexamethasone must be given 15-20 minutes before or concurrently with the first antibiotic dose to suppress the inflammatory response triggered by bacterial lysis. Delayed administration significantly reduces benefit, particularly for preventing hearing loss." }
    ]
  },

  "dementia-vs-delirium-rn": {
    title: "Dementia vs Delirium: RN Differentiation and Management",
    cellular: {
      title: "Neurodegenerative vs Acute Neurocognitive Pathophysiology",
      content: "Dementia and delirium are distinct neurocognitive disorders with different pathophysiology, onset, and management. Dementia represents chronic, progressive neurodegeneration. Alzheimer disease (AD, 60-80% of dementia) involves accumulation of extracellular amyloid-beta plaques and intracellular neurofibrillary tangles (hyperphosphorylated tau protein) that disrupt synaptic transmission, trigger neuroinflammation, and cause neuronal death. Cholinergic neurons in the nucleus basalis of Meynert are particularly vulnerable, leading to acetylcholine deficiency that correlates with memory impairment. Vascular dementia (second most common) results from cumulative cerebrovascular damage (multi-infarct or small vessel disease). Lewy body dementia involves alpha-synuclein protein aggregation in cortical neurons causing fluctuating cognition, visual hallucinations, and parkinsonism. Delirium is an acute, fluctuating disturbance of attention and awareness caused by a medical condition, medication, or substance. The pathophysiology involves widespread neurotransmitter imbalance: decreased acetylcholine, excess dopamine, cortisol-mediated neuroinflammation, and disruption of circadian regulation. Common precipitants include infection (UTI, pneumonia), medications (anticholinergics, opioids, benzodiazepines), metabolic derangements, pain, sleep deprivation, and hospital environment changes. Delirium is reversible when the underlying cause is treated."
    },
    riskFactors: [
      "Dementia risk factors: age >65, family history of AD, ApoE4 genotype, history of TBI, cardiovascular risk factors, social isolation, low educational attainment",
      "Delirium risk factors: advanced age, pre-existing dementia (strongest predictor), acute illness/infection, multiple medications (polypharmacy), sensory impairment (vision, hearing), immobility, dehydration, urinary catheter use",
      "High-risk medications for delirium: anticholinergics, benzodiazepines, opioids, steroids, fluoroquinolones, H2 blockers",
      "Hospitalization itself increases delirium risk (environmental disruption, sleep deprivation, immobility)"
    ],
    diagnostics: [
      "Confusion Assessment Method (CAM): validated tool for delirium screening—requires acute onset/fluctuating course AND inattention PLUS either disorganized thinking OR altered LOC",
      "Mini-Mental State Examination (MMSE) or Montreal Cognitive Assessment (MoCA) for cognitive screening in suspected dementia",
      "Basic metabolic panel, CBC, urinalysis, thyroid function, B12, folate to identify reversible causes of cognitive changes",
      "Medication review: identify anticholinergic burden and CNS-active medications",
      "CT/MRI brain: rule out structural causes (subdural hematoma, NPH, tumor, stroke) in new cognitive decline",
      "EEG if seizure suspected: delirium shows generalized slowing; seizures show epileptiform activity"
    ],
    management: [
      "Delirium: identify and treat the underlying cause (infection, metabolic derangement, medication effect, pain, urinary retention, constipation)",
      "Non-pharmacological delirium interventions FIRST: reorientation, sleep hygiene, mobilization, removing unnecessary catheters, correcting sensory deficits (glasses, hearing aids), maintaining day-night cycles",
      "Pharmacological delirium management (only for severe agitation with safety risk): low-dose haloperidol 0.5-1mg IV/IM or quetiapine 25mg PO; avoid benzodiazepines (worsen delirium except in alcohol/benzo withdrawal)",
      "Dementia: cholinesterase inhibitors (donepezil, rivastigmine, galantamine) for mild-moderate AD; memantine for moderate-severe AD",
      "Dementia behavioral management: non-pharmacological approaches first (redirection, validation therapy, structured routines); antipsychotics only as last resort (FDA black box warning for increased mortality in elderly with dementia)"
    ],
    nursingActions: [
      "Screen for delirium using CAM at admission, each shift, and with any change in mental status",
      "Differentiate delirium from dementia: delirium = acute onset, fluctuating, inattention, often hyperactive or hypoactive; dementia = insidious onset, progressive, attention preserved until late stages",
      "Implement delirium prevention bundle: early mobilization, sleep promotion (cluster care, minimize nighttime vitals), reorientation (clock, calendar, familiar objects), hydration, minimize restraints",
      "For dementia patients: maintain consistent routine, use short simple sentences, provide visual cues, avoid arguing or correcting confabulation",
      "Assess pain using validated tools for nonverbal patients (PAINAD scale) as uncontrolled pain is a common delirium precipitant",
      "Review medications daily with team: discontinue or dose-reduce anticholinergics, benzodiazepines, and other deliriogenic medications",
      "Ensure patient safety: fall precautions, bed alarms, sitters if needed, avoid restraints (worsen delirium)",
      "Involve family in care: familiar faces and voices reduce anxiety and disorientation"
    ],
    assessmentFindings: [
      "Delirium: acute onset (hours to days), fluctuating consciousness, inattention (cannot follow conversation or count backwards), hallucinations (often visual), psychomotor agitation or lethargy, sleep-wake cycle disruption",
      "Hypoactive delirium (most commonly missed): withdrawal, flat affect, decreased psychomotor activity, lethargy—often mistaken for depression or fatigue",
      "Hyperactive delirium: agitation, restlessness, hallucinations, pulling at lines/tubes, attempting to climb out of bed",
      "Dementia: insidious onset (months to years), progressive cognitive decline, memory loss (short-term first, then long-term), language difficulties, impaired judgment, personality changes, attention preserved until late stages",
      "Sundowning in dementia: increased confusion and agitation in late afternoon/evening due to circadian disruption"
    ],
    signs: {
      left: [
        "Delirium: acute onset over hours to days",
        "Delirium: fluctuating level of consciousness",
        "Delirium: inattention (hallmark feature)",
        "Delirium: reversible when cause is treated"
      ],
      right: [
        "Dementia: insidious onset over months to years",
        "Dementia: consciousness clear until late stages",
        "Dementia: attention preserved early in disease",
        "Dementia: progressive and irreversible (most types)"
      ]
    },
    medications: [
      { name: "Donepezil (Aricept)", type: "Cholinesterase Inhibitor", action: "Reversibly inhibits acetylcholinesterase in the synaptic cleft, increasing available acetylcholine to compensate for cholinergic neuron loss in Alzheimer disease. Improves cognition and function in mild-moderate AD; does not halt disease progression", sideEffects: "Nausea, vomiting, diarrhea, anorexia, weight loss, bradycardia, insomnia, vivid dreams", contra: "Sick sinus syndrome or other supraventricular conduction abnormalities without pacemaker; severe hepatic impairment", pearl: "Give at bedtime to reduce GI side effects and minimize daytime drowsiness. Start 5mg daily, may increase to 10mg after 4-6 weeks. Available in 23mg dose for moderate-severe AD. Cholinergic effects can worsen bradycardia—monitor HR in patients on beta-blockers. Benefits are modest and temporary; cognition eventually declines despite treatment." },
      { name: "Haloperidol", type: "Typical (First-generation) Antipsychotic", action: "Blocks dopamine D2 receptors, reducing psychomotor agitation and psychotic symptoms in delirium. Reserved for severe agitation that threatens patient safety when non-pharmacological measures fail", sideEffects: "QT prolongation (risk of torsades de pointes), extrapyramidal symptoms, neuroleptic malignant syndrome, sedation", contra: "QTc >500ms, Parkinson disease or Lewy body dementia (extreme sensitivity to antipsychotics with potentially fatal exacerbation of motor symptoms), concurrent QT-prolonging medications", pearl: "Use lowest effective dose: 0.5-1mg IV/IM, may repeat every 30-60 minutes. Monitor QTc before and during administration. NEVER use in Lewy body dementia—can cause severe parkinsonism, rigidity, and death. FDA black box warning: increased mortality in elderly patients with dementia-related psychosis. Use only as last resort and for shortest duration possible." }
    ],
    pearls: [
      "Delirium superimposed on dementia is extremely common—always evaluate for new delirium when a dementia patient has acute behavioral changes",
      "Hypoactive delirium is the most common and most missed form—look for withdrawal, lethargy, and flat affect, not just agitation",
      "UTI is the most common cause of delirium in elderly patients—always check urinalysis",
      "Avoid benzodiazepines in delirium (worsen confusion) EXCEPT in alcohol or benzodiazepine withdrawal where they are the treatment",
      "NEVER give haloperidol or any antipsychotic to patients with Lewy body dementia—extreme sensitivity can cause fatal reactions"
    ],
    quiz: [
      { question: "An 82-year-old patient admitted for hip surgery was oriented on admission. On post-op day 2, the patient is confused, pulling at IV lines, and reports seeing 'bugs on the wall.' Which condition does the nurse suspect?", options: ["Alzheimer disease exacerbation", "Post-operative delirium", "Major depression with psychotic features", "Normal post-operative recovery"], correct: 1, rationale: "Acute onset of confusion, agitation, and visual hallucinations in a previously oriented hospitalized elderly patient is classic for delirium. Key features: acute onset (vs insidious in dementia), fluctuating course, inattention, and identifiable precipitant (surgery, anesthesia, pain medications)." },
      { question: "Which assessment tool should the nurse use to screen for delirium?", options: ["Mini-Mental State Examination (MMSE)", "Confusion Assessment Method (CAM)", "Glasgow Coma Scale (GCS)", "PHQ-9 Depression Screening"], correct: 1, rationale: "The CAM is the validated bedside screening tool for delirium, with sensitivity of 94-100% and specificity of 90-95%. It assesses four features: acute onset/fluctuating course, inattention, disorganized thinking, and altered level of consciousness. MMSE assesses overall cognition, not specifically delirium." },
      { question: "Which non-pharmacological intervention is most important for delirium prevention?", options: ["Restraining the patient to prevent falls", "Administering scheduled benzodiazepines for sleep", "Maintaining day-night cycles, early mobilization, and reorientation", "Keeping the room dark and quiet at all times"], correct: 2, rationale: "Evidence-based delirium prevention includes maintaining circadian rhythms (natural light during day, darkness at night), early mobilization, reorientation, correcting sensory deficits, and minimizing sedating medications. Restraints and benzodiazepines actually WORSEN delirium." },
      { question: "A patient with known Lewy body dementia becomes agitated. Which medication is CONTRAINDICATED?", options: ["Low-dose quetiapine", "Haloperidol", "Donepezil", "Melatonin"], correct: 1, rationale: "Haloperidol and other typical antipsychotics are contraindicated in Lewy body dementia due to extreme dopaminergic sensitivity. These patients can develop fatal neuroleptic sensitivity reactions with severe rigidity, worsening cognition, and autonomic instability. Low-dose quetiapine is the safest antipsychotic option if absolutely needed." }
    ]
  },

  "diabetes-mellitus-comprehensive-rn": {
    title: "Diabetes Mellitus: Comprehensive RN Management",
    cellular: {
      title: "Insulin Secretion, Resistance, and Metabolic Dysregulation",
      content: "Diabetes mellitus is a group of metabolic diseases characterized by hyperglycemia resulting from defects in insulin secretion, insulin action, or both. Type 1 DM (5-10%) is an autoimmune destruction of pancreatic beta cells mediated by T-lymphocytes and autoantibodies (anti-GAD, anti-IA2, anti-insulin), resulting in absolute insulin deficiency. The destruction occurs over months to years before clinical presentation, which typically occurs when >80% of beta cells are destroyed. Without insulin, glucose cannot enter cells, leading to intracellular starvation despite hyperglycemia, and the body catabolizes fat through lipolysis, producing ketone bodies (acetoacetate, beta-hydroxybutyrate, acetone) that cause metabolic acidosis (DKA). Type 2 DM (90-95%) involves insulin resistance in skeletal muscle, liver, and adipose tissue combined with progressive beta cell dysfunction. Insulin resistance requires compensatory hyperinsulinemia; when beta cells can no longer meet demand, hyperglycemia develops. Chronic hyperglycemia causes microvascular damage through: advanced glycation end products (AGEs), activation of protein kinase C, increased polyol pathway flux, and oxidative stress—leading to retinopathy, nephropathy, and neuropathy. Macrovascular disease (CAD, stroke, PVD) is accelerated by associated dyslipidemia and hypertension."
    },
    riskFactors: [
      "Type 1: genetic susceptibility (HLA-DR3/DR4), autoimmune conditions (thyroid disease, celiac disease), viral triggers (Coxsackievirus B), family history (5-6% risk with first-degree relative)",
      "Type 2: obesity (BMI >25, especially central adiposity), sedentary lifestyle, family history (40% risk with one affected parent), age >45",
      "Gestational DM history (50% will develop T2DM within 10 years)",
      "Ethnicity: African American, Hispanic, Native American, Asian American, Pacific Islander",
      "Polycystic ovary syndrome (PCOS) with insulin resistance",
      "Prediabetes: A1C 5.7-6.4%, FPG 100-125, OGTT 140-199"
    ],
    diagnostics: [
      "HbA1c: ≥6.5% for diagnosis; reflects average blood glucose over 2-3 months (target <7% for most adults; individualized for elderly, pregnant, and patients with comorbidities)",
      "Fasting plasma glucose (FPG) ≥126 mg/dL on two occasions",
      "Oral glucose tolerance test (OGTT): 2-hour plasma glucose ≥200 mg/dL after 75g glucose load",
      "Random plasma glucose ≥200 mg/dL with classic symptoms (polyuria, polydipsia, weight loss)",
      "Self-monitoring of blood glucose (SMBG): fasting, pre-meal, 2-hour post-meal, bedtime; target 80-130 fasting, <180 post-meal",
      "Continuous glucose monitor (CGM): time-in-range 70-180 mg/dL target >70% of the day",
      "Annual screening: microalbumin/creatinine ratio (nephropathy), dilated eye exam (retinopathy), monofilament foot exam (neuropathy), lipid panel, comprehensive metabolic panel"
    ],
    management: [
      "Type 1: basal-bolus insulin regimen mandatory (no oral agents alone); basal insulin (glargine, detemir) + rapid-acting insulin (lispro, aspart) with meals; insulin pump therapy",
      "Type 2 first-line: metformin + lifestyle modifications (weight loss 5-7%, 150 min/week moderate activity, medical nutrition therapy)",
      "Type 2 second-line: add SGLT2 inhibitor (empagliflozin, dapagliflozin) or GLP-1 receptor agonist (semaglutide, liraglutide)—especially if cardiovascular or renal disease",
      "A1C target <7% for most adults; <6.5% if new diagnosis without hypoglycemia risk; <8% if elderly with multiple comorbidities",
      "Comprehensive cardiovascular risk reduction: statin therapy, BP control <130/80, aspirin if high CV risk",
      "Sick day management: Type 1 must NEVER stop insulin; check BG every 4 hours, test ketones, stay hydrated, adjust doses"
    ],
    nursingActions: [
      "Monitor blood glucose before meals, at bedtime, and when symptomatic; report values <70 or >300 to provider",
      "Administer insulin per sliding scale or prescribed regimen; verify dose with second nurse",
      "Rotate injection sites systematically (abdomen fastest absorption, then arms, thighs, buttocks) to prevent lipodystrophy",
      "Assess for hypoglycemia: shakiness, sweating, pallor, tachycardia, confusion, seizure—treat with Rule of 15 (15g fast-acting carb, recheck in 15 minutes)",
      "For severe hypoglycemia (unable to swallow): glucagon 1mg IM/SC or IV dextrose 25g (D50W 50mL)",
      "Perform comprehensive foot assessment every visit: inspect for lesions, calluses, ulcers; test sensation with monofilament; palpate pedal pulses",
      "Educate on sick day management, medication self-administration, carb counting, and recognizing hypo/hyperglycemia",
      "Coordinate annual screening appointments: ophthalmology, nephrology, podiatry, dental"
    ],
    assessmentFindings: [
      "Classic symptoms (Type 1): polyuria, polydipsia, polyphagia with weight loss (3 P's)",
      "Type 2: often asymptomatic initially; fatigue, blurred vision, slow wound healing, recurrent infections (candidiasis, UTIs)",
      "Hypoglycemia (<70 mg/dL): tremor, diaphoresis, palpitations, anxiety (adrenergic), confusion, slurred speech, seizure (neuroglycopenic)",
      "Hyperglycemia (>250 mg/dL): polyuria, polydipsia, blurred vision, fatigue, Kussmaul respirations and fruity breath if DKA",
      "Chronic complications: decreased pedal pulses and sensation (neuropathy/PVD), skin changes, non-healing wounds"
    ],
    signs: {
      left: [
        "Polyuria, polydipsia, polyphagia (3 P's)",
        "Unexplained weight loss (Type 1)",
        "Fatigue and blurred vision",
        "Recurrent infections (candidiasis, UTIs)"
      ],
      right: [
        "Hypoglycemia: tremor, diaphoresis, confusion, seizure",
        "DKA: Kussmaul respirations, fruity breath, abdominal pain",
        "HHS: extreme hyperglycemia >600, altered LOC, seizures",
        "Chronic: peripheral neuropathy, retinopathy, nephropathy"
      ]
    },
    medications: [
      { name: "Metformin (Glucophage)", type: "Biguanide", action: "Decreases hepatic glucose production, increases insulin sensitivity in skeletal muscle, and reduces intestinal glucose absorption. Does not cause hypoglycemia when used alone. Additional benefits: modest weight loss, improved lipid profile, possible cardiovascular protection", sideEffects: "GI effects (nausea, diarrhea, metallic taste—use extended-release to minimize), vitamin B12 deficiency with long-term use, lactic acidosis (rare but serious)", contra: "eGFR <30 (contraindicated), eGFR 30-45 (do not initiate, may continue with monitoring), acute or chronic metabolic acidosis, hold before iodinated contrast procedures", pearl: "First-line for Type 2 DM. Start 500mg daily with dinner, titrate to max 2000mg/day. Monitor B12 levels annually. Hold 48 hours before and after iodinated contrast in patients with eGFR <60. Lactic acidosis risk is extremely low (4-9 per 100,000 patient-years) but educate patients on symptoms: malaise, myalgia, dyspnea, abdominal pain." },
      { name: "Insulin Glargine (Lantus)", type: "Long-acting Basal Insulin Analog", action: "Forms microprecipitates in subcutaneous tissue that slowly dissolve, providing a relatively flat 24-hour insulin profile without significant peaks. Mimics physiological basal insulin secretion, suppressing hepatic glucose production between meals and overnight", sideEffects: "Hypoglycemia (primary concern), weight gain, injection site lipodystrophy, allergic reactions (rare)", contra: "During episodes of hypoglycemia; hypersensitivity to insulin glargine", pearl: "Give at the same time daily (typically bedtime or morning). NEVER mix in the same syringe with other insulins (acidic pH incompatible). Clear solution (do not shake—not a suspension). If patient also takes NPH: glargine = clear, NPH = cloudy. Dose adjust by 2 units every 3 days based on fasting glucose. In Type 1: must always be paired with rapid-acting insulin at meals." },
      { name: "Empagliflozin (Jardiance)", type: "SGLT2 Inhibitor", action: "Inhibits sodium-glucose co-transporter 2 in the proximal renal tubule, blocking renal glucose reabsorption and causing glycosuria. Reduces A1C by 0.5-1.0%, causes weight loss and BP reduction. Proven cardiovascular and renal protective benefits independent of glucose lowering", sideEffects: "Genital mycotic infections (candidiasis), urinary tract infections, volume depletion, euglycemic DKA (rare, especially in Type 1 or fasting), Fournier gangrene (rare)", contra: "Severe renal impairment for glycemic efficacy (eGFR <20; though renal protective benefit persists at lower eGFR), Type 1 DM (increased DKA risk), recurrent genital infections", pearl: "Preferred second-line after metformin in T2DM with established cardiovascular disease, heart failure, or CKD. Educate patients about genital hygiene to prevent mycotic infections. Hold before major surgery (DKA risk with fasting). Causes glucosuria—urine glucose testing will always be positive and cannot be used for monitoring." }
    ],
    pearls: [
      "Rule of 15 for hypoglycemia: give 15g fast-acting carbohydrate, wait 15 minutes, recheck; repeat until BG >70 then give a snack with protein to prevent recurrence",
      "Type 1 patients must NEVER stop insulin—even when NPO or sick; adjust doses but always provide basal insulin to prevent DKA",
      "Dawn phenomenon (early morning hyperglycemia from growth hormone/cortisol surge) vs Somogyi effect (rebound hyperglycemia from nocturnal hypoglycemia)—check 3am BG to differentiate",
      "Rapid-acting insulin peaks in 1-2 hours—the highest risk for hypoglycemia; ensure meal is available before administering",
      "SGLT2 inhibitors can cause euglycemic DKA (normal glucose but acidotic)—check ketones if patient has nausea, vomiting, or malaise even with normal BG"
    ],
    quiz: [
      { question: "A Type 1 diabetic patient is admitted NPO for surgery tomorrow. The nurse should anticipate which insulin order?", options: ["Hold all insulin until the patient can eat", "Continue basal insulin (glargine) at reduced dose; hold mealtime rapid-acting insulin", "Switch to oral metformin during the NPO period", "Administer sliding scale insulin only if glucose >200"], correct: 1, rationale: "Type 1 patients require basal insulin at all times to prevent DKA. The basal insulin dose is typically reduced by 20-25% during NPO periods, and mealtime rapid-acting insulin is held since the patient is not eating. Metformin does not replace insulin in Type 1." },
      { question: "A patient with diabetes has a blood glucose of 52 mg/dL and is alert and able to swallow. What is the priority nursing action?", options: ["Administer IV D50W 25g", "Give 15g of fast-acting carbohydrate and recheck in 15 minutes", "Administer glucagon 1mg IM", "Hold the next insulin dose and call the provider"], correct: 1, rationale: "For conscious patients who can swallow, the Rule of 15 is applied: give 15g fast-acting carbohydrate (4 oz juice, glucose tablets), wait 15 minutes, recheck. IV dextrose and glucagon are reserved for patients who cannot take oral carbohydrate." },
      { question: "A nurse is teaching a newly diagnosed Type 2 diabetic patient about metformin. Which statement by the patient indicates understanding?", options: ["I should take this medication on an empty stomach for best results", "If I feel nauseated, I should take the medication with food", "I can stop taking this medication once my blood sugar is normal", "I should avoid eating any carbohydrates while on this medication"], correct: 1, rationale: "GI side effects (nausea, diarrhea) are common with metformin and can be minimized by taking with food and using the extended-release formulation. Taking on an empty stomach worsens GI effects. Metformin is a lifelong medication. Carbohydrate counting is important but elimination is not required." },
      { question: "A Type 2 diabetic patient on empagliflozin reports vulvar itching and white vaginal discharge. The nurse should:", options: ["Recognize this as an expected side effect and educate on genital hygiene", "Suspect a sexually transmitted infection and order screening", "Discontinue the medication immediately", "Advise the patient that this will resolve on its own without treatment"], correct: 0, rationale: "Genital mycotic infections (candidiasis) are a common side effect of SGLT2 inhibitors due to glucosuria creating a glucose-rich environment favorable for yeast growth. Treatment with antifungals is needed, but the medication can typically be continued. Patient education on genital hygiene and prompt treatment of symptoms is essential." }
    ]
  },

  "dka-management-rn": {
    title: "Diabetic Ketoacidosis: RN Emergency Management",
    cellular: {
      title: "Insulin Deficiency and Ketone Body Formation",
      content: "Diabetic ketoacidosis (DKA) is a life-threatening metabolic emergency caused by absolute or relative insulin deficiency combined with counter-regulatory hormone excess (glucagon, cortisol, catecholamines, growth hormone). Without insulin, glucose cannot enter cells despite hyperglycemia, creating intracellular energy starvation. The liver responds by increasing gluconeogenesis and glycogenolysis, worsening hyperglycemia. Simultaneously, uninhibited lipolysis in adipose tissue releases massive quantities of free fatty acids (FFAs) to the liver, where they undergo beta-oxidation to acetyl-CoA. When acetyl-CoA production exceeds the capacity of the citric acid cycle, the excess is diverted to ketogenesis, producing acetoacetate, beta-hydroxybutyrate, and acetone. These ketone bodies are strong organic acids that overwhelm the bicarbonate buffering system, causing high-anion-gap metabolic acidosis. The resulting hyperglycemia causes osmotic diuresis with massive fluid loss (average 5-7 liters in adults), electrolyte depletion (potassium, sodium, phosphate, magnesium), and hyperosmolarity. Total body potassium is always depleted even when serum K+ appears normal or elevated—because acidosis shifts potassium extracellularly. When insulin is given, potassium shifts back intracellularly, and potentially fatal hypokalemia can occur."
    },
    riskFactors: [
      "New-onset Type 1 DM (DKA may be the initial presentation in 25-30% of T1DM diagnoses)",
      "Insulin omission or pump failure (most common precipitant in known Type 1 DM)",
      "Infection (pneumonia, UTI, sepsis): stress hormones antagonize insulin",
      "Acute illness: MI, stroke, pancreatitis, trauma, surgery",
      "Medications: corticosteroids, thiazides, atypical antipsychotics (olanzapine, clozapine), SGLT2 inhibitors (euglycemic DKA)",
      "Substance use: cocaine, alcohol binge",
      "Eating disorders with insulin manipulation ('diabulimia')"
    ],
    diagnostics: [
      "Blood glucose >250 mg/dL (may be lower in euglycemic DKA with SGLT2 inhibitors)",
      "Arterial blood gas: pH <7.30 (mild 7.25-7.30, moderate 7.00-7.24, severe <7.00)",
      "Serum bicarbonate <18 mEq/L",
      "Anion gap >12 (calculated: Na - [Cl + HCO3]); elevated indicates unmeasured acids (ketones)",
      "Serum ketones: beta-hydroxybutyrate >3.0 mmol/L (preferred over urine ketones which lag behind resolution)",
      "Serum potassium: may be high, normal, or low—total body potassium is ALWAYS depleted regardless of serum level",
      "BUN/creatinine elevated from dehydration; serum osmolality elevated",
      "CBC, blood cultures, urinalysis, chest X-ray to identify precipitating cause"
    ],
    management: [
      "Aggressive IV fluid resuscitation: 0.9% NS 1-1.5 L/hr for first 1-2 hours, then 250-500 mL/hr; switch to 0.45% NS when corrected sodium normalizes; add dextrose (D5W) when glucose <200 to prevent hypoglycemia while continuing insulin",
      "Continuous IV regular insulin infusion: 0.1-0.14 units/kg/hr AFTER potassium is confirmed ≥3.3 mEq/L; goal glucose reduction 50-75 mg/dL/hr",
      "CRITICAL: Check potassium BEFORE starting insulin. If K+ <3.3: replace potassium first, hold insulin; if K+ 3.3-5.3: give KCl 20-40 mEq with each liter of fluid; if K+ >5.3: hold potassium, recheck every 2 hours",
      "Monitor glucose hourly, BMP every 2-4 hours until DKA resolved",
      "DKA resolution criteria: glucose <200, pH >7.30, bicarbonate ≥15, anion gap ≤12",
      "Transition to subcutaneous insulin: overlap SC basal insulin by 2 hours before discontinuing IV insulin to prevent rebound hyperglycemia/DKA"
    ],
    nursingActions: [
      "Establish two large-bore IV lines immediately for fluid resuscitation and insulin drip (separate lines)",
      "Check serum potassium before initiating insulin—hypokalemia during insulin therapy can cause fatal cardiac arrhythmias",
      "Monitor blood glucose every hour and adjust insulin drip per protocol; target glucose reduction 50-75 mg/dL/hr",
      "Monitor electrolytes (K+, Na+, Mg2+, PO4) every 2-4 hours and replace as ordered",
      "Continuous cardiac monitoring for dysrhythmias related to potassium shifts",
      "Assess respiratory status: monitor for Kussmaul respirations (deep, rapid breathing to compensate for acidosis), note fruity acetone breath",
      "Monitor level of consciousness: cerebral edema is a life-threatening complication (especially in children)",
      "Strict I&O; assess for fluid overload during aggressive resuscitation (crackles, JVD)",
      "Identify and treat precipitating cause: obtain blood cultures, UA, CXR",
      "Educate on DKA prevention: sick day management, never omit insulin, recognize early symptoms"
    ],
    assessmentFindings: [
      "Kussmaul respirations: deep, rapid breathing as respiratory compensation for metabolic acidosis",
      "Fruity/acetone breath odor from ketone exhalation",
      "Nausea, vomiting, and diffuse abdominal pain (can mimic acute abdomen)",
      "Severe dehydration: dry mucous membranes, poor skin turgor, tachycardia, hypotension",
      "Altered mental status: lethargy to coma (correlates with osmolality >320 mOsm/kg)",
      "Polyuria (osmotic diuresis) and polydipsia early; oliguria later if severe dehydration"
    ],
    signs: {
      left: [
        "Kussmaul respirations (deep, rapid)",
        "Fruity acetone breath odor",
        "Nausea, vomiting, abdominal pain",
        "Polyuria and polydipsia"
      ],
      right: [
        "Severe dehydration: tachycardia, hypotension",
        "Altered mental status (lethargy to coma)",
        "Warm, dry, flushed skin",
        "Cardiac dysrhythmias from potassium shifts"
      ]
    },
    medications: [
      { name: "Regular Insulin (IV Infusion)", type: "Rapid-acting Insulin for DKA", action: "Only insulin given IV; onset 15-30 minutes when given IV. Promotes cellular glucose uptake, suppresses hepatic gluconeogenesis and lipolysis, halts ketone production. Drives potassium intracellularly (must monitor K+ closely)", sideEffects: "Hypoglycemia (prevented by adding dextrose to fluids when glucose <200), hypokalemia (prevented by concurrent potassium replacement)", contra: "Do NOT start if potassium <3.3 mEq/L (risk of fatal hypokalemia when insulin drives K+ intracellularly)", pearl: "Only regular insulin can be given IV (other insulins are SC only). Continuous infusion at 0.1-0.14 units/kg/hr. DO NOT bolus in children (increased cerebral edema risk). When transitioning to SC insulin: give basal SC insulin 2 hours BEFORE stopping IV drip—the drip has no depot effect and DKA will recur rapidly if there is a gap." },
      { name: "Potassium Chloride (KCl)", type: "Electrolyte Replacement", action: "Replaces total body potassium deficit (average deficit 3-5 mEq/kg in DKA). As insulin is administered, it drives potassium intracellularly, and serum levels drop rapidly—potentially causing fatal cardiac arrhythmias if not replaced concurrently", sideEffects: "Phlebitis with peripheral IV (concentration-dependent), hyperkalemia if infused too rapidly, cardiac arrest with rapid bolus", contra: "Potassium >5.3 mEq/L (hold and recheck every 2 hours); severe renal failure (impaired excretion)", pearl: "The most dangerous moment in DKA management is starting insulin before checking potassium. If K+ <3.3: hold insulin and replace K+ first until ≥3.3. IV KCl maximum rate via peripheral line: 10 mEq/hr; via central line: 20 mEq/hr with cardiac monitoring. Never push KCl IV—always diluted infusion." }
    ],
    pearls: [
      "Always check potassium BEFORE starting insulin in DKA—hypokalemia during insulin therapy is the most dangerous iatrogenic complication",
      "Corrected sodium guides fluid selection: if corrected Na is low, use 0.9% NS; if normal or high, switch to 0.45% NS",
      "Add dextrose to IV fluids when glucose <200 mg/dL—the goal is to continue insulin until acidosis resolves, not just until glucose normalizes",
      "Cerebral edema is the leading cause of death in pediatric DKA—avoid rapid fluid boluses and rapid glucose correction in children",
      "Gap between SC insulin injection and IV drip discontinuation must be at least 2 hours—shorter gap causes DKA recurrence within hours"
    ],
    quiz: [
      { question: "A patient presents with DKA. Serum potassium is 3.0 mEq/L. The provider orders an insulin drip. What should the nurse do?", options: ["Start the insulin drip immediately as ordered", "Start the insulin drip and infuse potassium simultaneously", "Hold the insulin drip and replace potassium to ≥3.3 mEq/L first", "Administer calcium gluconate to protect the heart and then start insulin"], correct: 2, rationale: "If serum K+ is <3.3 mEq/L, insulin is held until potassium is replaced to ≥3.3. Insulin drives potassium intracellularly, which can cause fatal hypokalemia and cardiac arrhythmias when starting from an already low level." },
      { question: "During DKA treatment, blood glucose drops to 180 mg/dL but the pH remains 7.18 and anion gap is 20. What should the nurse anticipate?", options: ["Stop the insulin drip since glucose is near normal", "Continue the insulin drip and add D5W to the IV fluids", "Switch to oral antidiabetic agents", "Increase the insulin drip rate to resolve acidosis faster"], correct: 1, rationale: "The insulin drip must continue until DKA resolves (pH >7.30, bicarb ≥15, anion gap ≤12). Glucose normalizes before acidosis resolves. Dextrose is added to IV fluids to prevent hypoglycemia while continuing insulin to clear ketoacidosis." },
      { question: "Which finding indicates DKA has resolved and the patient can transition to subcutaneous insulin?", options: ["Blood glucose <200 mg/dL alone", "Patient is tolerating oral fluids", "pH >7.30, bicarbonate ≥15, anion gap ≤12, and glucose <200", "Urine ketones are negative"], correct: 2, rationale: "DKA resolution requires ALL of these criteria: pH >7.30, serum bicarbonate ≥15 mEq/L, anion gap ≤12, and glucose <200 mg/dL. A single parameter is insufficient. Urine ketones can persist after blood ketones clear and are not reliable for determining resolution." },
      { question: "A nurse is transitioning a DKA patient from IV to subcutaneous insulin. What is critical regarding timing?", options: ["Stop the IV drip immediately when the SC insulin is given", "Overlap: give SC basal insulin at least 2 hours before stopping the IV drip", "Wait 4 hours after stopping the IV drip to give SC insulin", "Give SC and IV insulin simultaneously for 24 hours"], correct: 1, rationale: "There must be at least a 2-hour overlap between SC basal insulin administration and IV drip discontinuation. IV insulin has no depot effect—its half-life is only 5-7 minutes. Without overlap, the patient will have a gap in insulin coverage and DKA can recur within hours." }
    ]
  },

  "thyroid-disorders-rn": {
    title: "Hypothyroidism and Hyperthyroidism: RN Comprehensive Management",
    cellular: {
      title: "Thyroid Hormone Synthesis and Metabolic Regulation",
      content: "The thyroid gland produces triiodothyronine (T3, active form) and thyroxine (T4, prohormone converted to T3 peripherally) through a series of iodine-dependent steps. The hypothalamic-pituitary-thyroid (HPT) axis regulates production: TRH from the hypothalamus stimulates TSH from the anterior pituitary, which stimulates the thyroid. Thyroid hormones regulate basal metabolic rate by increasing oxygen consumption, heat production, and cellular metabolism in virtually every tissue. Hypothyroidism (most commonly Hashimoto thyroiditis, an autoimmune destruction with anti-TPO and anti-thyroglobulin antibodies) causes decreased metabolic rate: bradycardia, weight gain, cold intolerance, constipation, fatigue, dry skin, and myxedema (non-pitting edema from glycosaminoglycan accumulation). Severe untreated hypothyroidism can progress to myxedema coma—a life-threatening emergency with hypothermia, altered mental status, hypoventilation, and cardiovascular collapse. Hyperthyroidism (most commonly Graves disease, with thyroid-stimulating immunoglobulins [TSI] mimicking TSH) causes increased metabolic rate: tachycardia, weight loss despite increased appetite, heat intolerance, diarrhea, tremor, and anxiety. Thyroid storm is the extreme manifestation: hyperthermia >104°F, delirium, tachycardia >140, heart failure, and high mortality without treatment."
    },
    riskFactors: [
      "Female sex (8:1 female-to-male ratio for autoimmune thyroid disease)",
      "Autoimmune conditions: Type 1 DM, rheumatoid arthritis, pernicious anemia, celiac disease",
      "Family history of thyroid disease",
      "Post-thyroidectomy or radioactive iodine therapy (iatrogenic hypothyroidism)",
      "Medications: amiodarone (causes both hypo and hyperthyroidism), lithium (hypothyroidism), interferon-alpha",
      "Iodine deficiency (worldwide most common cause of hypothyroidism; rare in developed countries)",
      "Pregnancy and postpartum period (postpartum thyroiditis)"
    ],
    diagnostics: [
      "TSH: most sensitive initial test. Elevated TSH with low free T4 = primary hypothyroidism. Low/suppressed TSH with elevated free T4 and/or free T3 = primary hyperthyroidism",
      "Free T4 and free T3 levels: confirm the degree of dysfunction",
      "Anti-TPO and anti-thyroglobulin antibodies: confirm Hashimoto thyroiditis (autoimmune hypothyroidism)",
      "Thyroid-stimulating immunoglobulin (TSI) and thyroid receptor antibody (TRAb): confirm Graves disease",
      "Radioactive iodine uptake (RAIU) scan: differentiates Graves disease (diffuse increased uptake) from thyroiditis (low uptake) and toxic nodule (focal uptake)",
      "Monitor for complications: lipid panel (hyperlipidemia in hypothyroidism), ECG (tachyarrhythmias in hyperthyroidism), CBC, LFTs"
    ],
    management: [
      "Hypothyroidism: levothyroxine replacement therapy (synthetic T4); start low in elderly and cardiac patients (12.5-25mcg), titrate based on TSH every 6-8 weeks",
      "Hyperthyroidism: antithyroid drugs (methimazole first-line, PTU for first trimester pregnancy and thyroid storm), radioactive iodine ablation (I-131), or thyroidectomy",
      "Thyroid storm: high-dose PTU (blocks synthesis AND peripheral T4-to-T3 conversion), beta-blockers, corticosteroids, cooling measures, supportive care",
      "Myxedema coma: IV levothyroxine loading dose, IV hydrocortisone (adrenal insufficiency must be assumed), warming measures, supportive ICU care"
    ],
    nursingActions: [
      "Levothyroxine: administer on empty stomach, 30-60 minutes before breakfast, with water only; separate from calcium, iron, antacids by 4 hours",
      "Monitor TSH levels 6-8 weeks after dose changes; once stable, annually",
      "Hypothyroid patients: monitor for constipation, weight changes, cold intolerance, depression, bradycardia; cardiac monitoring when initiating replacement in elderly",
      "Hyperthyroid patients: provide a high-calorie diet, cool environment, rest periods; protect eyes in Graves ophthalmopathy (lubrication, sunglasses, elevate HOB)",
      "Monitor for thyroid storm triggers: infection, surgery, trauma, iodine load (contrast dye); recognize early signs: fever >101°F, tachycardia >130, agitation",
      "Post-thyroidectomy nursing: monitor for hypocalcemia (check Chvostek and Trousseau signs), hemorrhage (check neck dressing and posterior neck for bleeding), airway compromise (stridor, respiratory distress), and recurrent laryngeal nerve damage (hoarseness)",
      "Assess for signs of myxedema coma in severely hypothyroid patients: hypothermia, altered LOC, hypoventilation, bradycardia"
    ],
    assessmentFindings: [
      "Hypothyroidism: fatigue, weight gain, cold intolerance, constipation, dry skin, brittle nails, alopecia, bradycardia, delayed DTRs, periorbital puffiness, menorrhagia",
      "Hyperthyroidism: weight loss with increased appetite, heat intolerance, diarrhea, tachycardia/palpitations, tremor, anxiety, insomnia, exophthalmos (Graves), fine hair, hyperactive DTRs, amenorrhea",
      "Graves ophthalmopathy: proptosis, lid retraction, diplopia, corneal exposure",
      "Myxedema: non-pitting edema, thickened tongue, hoarse voice, puffy face and hands",
      "Thyroid storm: extreme tachycardia, hyperthermia, delirium, nausea/vomiting/diarrhea, heart failure"
    ],
    signs: {
      left: [
        "Hypothyroid: bradycardia, weight gain, cold intolerance",
        "Hypothyroid: fatigue, constipation, dry skin",
        "Hypothyroid: delayed deep tendon reflexes",
        "Hypothyroid: periorbital puffiness, menorrhagia"
      ],
      right: [
        "Hyperthyroid: tachycardia, weight loss, heat intolerance",
        "Hyperthyroid: tremor, anxiety, diarrhea",
        "Hyperthyroid: hyperactive deep tendon reflexes",
        "Graves: exophthalmos, pretibial myxedema"
      ]
    },
    medications: [
      { name: "Levothyroxine (Synthroid)", type: "Synthetic T4 (Thyroid Hormone Replacement)", action: "Synthetic thyroxine (T4) that is converted to active T3 peripherally by deiodinase enzymes. Restores metabolic rate, energy levels, and organ function. Long half-life (7 days) provides stable daily dosing", sideEffects: "Signs of hyperthyroidism if over-replaced: tachycardia, anxiety, weight loss, insomnia, heat intolerance, diarrhea, bone loss with chronic over-replacement", contra: "Uncorrected adrenal insufficiency (thyroid replacement increases cortisol metabolism, potentially precipitating adrenal crisis—always replace cortisol first), acute MI (may increase myocardial oxygen demand)", pearl: "Take on empty stomach 30-60 minutes before food with water only. Calcium, iron, aluminum antacids, cholestyramine, and soy interfere with absorption (separate by 4+ hours). TSH is checked 6-8 weeks after any dose change. In elderly or cardiac patients: start low (12.5-25mcg) and increase slowly to avoid precipitating angina, MI, or arrhythmia." },
      { name: "Methimazole (Tapazole)", type: "Thionamide Antithyroid Drug", action: "Inhibits thyroid peroxidase (TPO), blocking iodine organification and coupling of MIT/DIT to form T3 and T4. Reduces thyroid hormone synthesis within 1-2 weeks, though full effect takes 6-8 weeks as stored hormone is depleted. Does NOT block peripheral T4-to-T3 conversion (unlike PTU)", sideEffects: "Agranulocytosis (0.2-0.5%, potentially fatal—report fever, sore throat, mouth ulcers immediately), hepatotoxicity, rash, arthralgia, teratogenicity (aplasia cutis in first trimester)", contra: "First trimester pregnancy (teratogenic—use PTU instead), known agranulocytosis with prior thionamide use", pearl: "First-line antithyroid drug (more potent, longer-acting, fewer side effects than PTU except in first trimester and thyroid storm). Check CBC at baseline and with any signs of infection. Patients MUST be educated to report fever, sore throat, or mouth ulcers immediately—agranulocytosis can be fatal if not recognized. PTU is preferred in thyroid storm (blocks peripheral T4-to-T3 conversion) and first trimester pregnancy." }
    ],
    pearls: [
      "TSH and thyroid hormones have an inverse relationship in primary thyroid disease: high TSH = hypo, low TSH = hyper",
      "Post-thyroidectomy emergency supplies at bedside: calcium gluconate (for hypocalcemia), tracheostomy tray (for airway compromise from hemorrhage or laryngeal edema)",
      "Thyroid storm vs severe hyperthyroidism: thyroid storm has altered mental status and temperature >104°F—mortality is 10-30% even with treatment",
      "Levothyroxine has a 7-day half-life—missing one dose is not an emergency; do not double doses",
      "Always rule out adrenal insufficiency before starting levothyroxine in severe hypothyroidism—thyroid replacement increases cortisol metabolism and can precipitate adrenal crisis"
    ],
    quiz: [
      { question: "A patient on methimazole for Graves disease calls the clinic reporting a sore throat, fever of 102°F, and mouth ulcers. What should the nurse advise?", options: ["Take an over-the-counter cold medication and rest", "Come to the ED immediately for a stat CBC with differential", "This is a common side effect that will resolve on its own", "Increase fluids and gargle with salt water"], correct: 1, rationale: "Fever, sore throat, and mouth ulcers in a patient on methimazole suggest agranulocytosis—a potentially fatal complication where the WBC/neutrophil count drops severely, eliminating immune defense. A stat CBC is required immediately; if ANC <500, the drug is permanently discontinued." },
      { question: "Post-thyroidectomy, a nurse notes the patient has tingling around the mouth and fingertips, and a positive Chvostek sign. What does this indicate?", options: ["Hypocalcemia from inadvertent parathyroid removal", "Normal post-surgical healing", "Recurrent laryngeal nerve damage", "Thyroid storm"], correct: 0, rationale: "Perioral tingling, extremity numbness, and positive Chvostek sign (facial muscle twitch when tapping over facial nerve) indicate hypocalcemia from inadvertent damage or removal of the parathyroid glands during thyroidectomy. Treatment: IV calcium gluconate. Keep calcium at bedside." },
      { question: "Which instructions should the nurse give a patient starting levothyroxine?", options: ["Take with a full meal to enhance absorption", "Take on an empty stomach 30-60 minutes before breakfast with water only", "Take at bedtime with a calcium supplement", "Take with coffee for best absorption"], correct: 1, rationale: "Levothyroxine requires an acidic, empty stomach for optimal absorption. Food, calcium, iron, coffee, and antacids all significantly reduce absorption. The standard instruction is to take first thing in the morning with water only, 30-60 minutes before eating." },
      { question: "A nurse is preparing to administer levothyroxine to a patient recently diagnosed with both severe hypothyroidism and suspected adrenal insufficiency. Which medication should be given FIRST?", options: ["Levothyroxine", "Hydrocortisone", "Methimazole", "Propranolol"], correct: 1, rationale: "Cortisol must be replaced BEFORE levothyroxine in patients with coexisting adrenal insufficiency. Thyroid hormone replacement increases cortisol metabolism; without adequate cortisol, this can precipitate a life-threatening adrenal crisis. Always replace cortisol first, then cautiously initiate thyroid replacement." }
    ]
  },

  "adrenal-disorders-rn": {
    title: "Adrenal Insufficiency, Cushing Syndrome, and Hyperaldosteronism",
    cellular: {
      title: "Adrenal Cortex Hormone Production and Dysregulation",
      content: "The adrenal cortex produces three classes of hormones in three zones: zona glomerulosa produces mineralocorticoids (aldosterone, regulated by RAAS and serum potassium), zona fasciculata produces glucocorticoids (cortisol, regulated by ACTH from the anterior pituitary via the HPA axis), and zona reticularis produces androgens (DHEA, androstenedione). Adrenal insufficiency (Addison disease when primary) results from destruction of the adrenal cortex by autoimmune adrenalitis (80% in developed countries), infections (TB, fungal, HIV-related), hemorrhage (Waterhouse-Friderichsen syndrome from meningococcemia), or bilateral adrenalectomy. Loss of cortisol removes negative feedback on the pituitary, causing elevated ACTH, which stimulates melanocyte-stimulating hormone (MSH) production (same precursor molecule POMC), causing hyperpigmentation. Loss of aldosterone causes sodium wasting, potassium retention, and hypovolemia. Cushing syndrome results from chronic glucocorticoid excess—most commonly iatrogenic (exogenous corticosteroid therapy), followed by Cushing disease (ACTH-secreting pituitary adenoma), ectopic ACTH production (small cell lung cancer), or adrenal adenoma/carcinoma. Cortisol excess causes: protein catabolism (muscle wasting, thin skin, striae), glucose intolerance (gluconeogenesis), fat redistribution (central obesity, moon face, buffalo hump), sodium retention with hypokalemia, immunosuppression, and osteoporosis. Hyperaldosteronism (Conn syndrome when primary from adrenal adenoma) causes excessive sodium retention, potassium secretion, and hydrogen ion secretion, leading to hypertension, hypokalemia, and metabolic alkalosis."
    },
    riskFactors: [
      "Addison disease: autoimmune polyendocrine syndrome, chronic corticosteroid therapy with abrupt withdrawal, adrenal hemorrhage (anticoagulation, DIC, meningococcemia), TB, HIV/AIDS",
      "Cushing syndrome: long-term corticosteroid therapy (most common cause), pituitary adenoma (Cushing disease), ectopic ACTH from malignancy, adrenal tumors",
      "Hyperaldosteronism: adrenal adenoma (Conn syndrome), bilateral adrenal hyperplasia, resistant hypertension with hypokalemia"
    ],
    diagnostics: [
      "Addison disease: morning cortisol <3 mcg/dL is diagnostic; ACTH stimulation test (cosyntropin test): cortisol fails to rise >18-20 mcg/dL; elevated ACTH in primary insufficiency; low sodium, elevated potassium, hypoglycemia",
      "Cushing syndrome: 24-hour urine free cortisol (elevated), late-night salivary cortisol (elevated), low-dose dexamethasone suppression test (cortisol fails to suppress); high-dose dexamethasone test and ACTH levels differentiate pituitary from ectopic/adrenal sources",
      "Hyperaldosteronism: aldosterone-to-renin ratio (ARR) >30 with aldosterone >15 ng/dL as screening; confirmatory salt loading test; CT adrenal or adrenal vein sampling to localize",
      "BMP for all: electrolytes (Na+, K+), glucose, renal function; ECG if potassium abnormalities"
    ],
    management: [
      "Addison disease: lifelong hormone replacement—hydrocortisone 15-25mg/day in divided doses (cortisol replacement) PLUS fludrocortisone 0.05-0.2mg/day (mineralocorticoid replacement); stress dosing during illness/surgery (double or triple cortisol dose)",
      "Adrenal crisis: IV hydrocortisone 100mg bolus then 50mg IV q8h, aggressive IV NS resuscitation, treat precipitating cause; LIFE-THREATENING EMERGENCY",
      "Cushing syndrome: treat underlying cause—taper exogenous steroids slowly (NEVER abruptly stop), surgical resection of pituitary or adrenal tumor, medical therapy (ketoconazole, metyrapone) if surgery not feasible",
      "Hyperaldosteronism: adrenalectomy for adenoma; spironolactone or eplerenone for bilateral hyperplasia or surgical contraindication"
    ],
    nursingActions: [
      "Addison disease: educate on lifelong medication adherence—missing doses can be fatal; ensure patient has emergency injection kit (Solu-Cortef IM) and medical alert identification",
      "Stress dosing education: double cortisol dose for fever, illness, or minor procedures; triple for surgery; IV hydrocortisone for vomiting (cannot take oral)",
      "Monitor for adrenal crisis: hypotension unresponsive to fluids, tachycardia, severe weakness, altered LOC, fever, hyponatremia, hyperkalemia—administer IV hydrocortisone immediately",
      "Cushing syndrome: fall prevention (osteoporosis, muscle weakness), skin integrity (thin skin bruises easily), blood glucose monitoring (steroid-induced hyperglycemia), infection prevention (immunosuppression)",
      "Hyperaldosteronism: monitor BP closely, assess potassium levels and supplement as needed, assess for metabolic alkalosis, educate on spironolactone side effects (gynecomastia, menstrual irregularities)",
      "Cushing patients on corticosteroid taper: educate on gradual dose reduction; NEVER abruptly discontinue—adrenal suppression requires slow taper to allow HPA axis recovery"
    ],
    assessmentFindings: [
      "Addison: hyperpigmentation (especially skin folds, gingiva, buccal mucosa, scars), weight loss, fatigue, orthostatic hypotension, salt craving, hypoglycemia",
      "Cushing: central obesity with thin extremities, moon face, buffalo hump, purple striae >1cm wide, thin fragile skin with easy bruising, hirsutism, acne, proximal muscle weakness",
      "Hyperaldosteronism: hypertension (often resistant to 3+ drugs), hypokalemia (muscle weakness, cramping, polyuria), metabolic alkalosis",
      "Adrenal crisis: profound hypotension, shock, severe abdominal pain (can mimic acute abdomen), fever, altered consciousness"
    ],
    signs: {
      left: [
        "Addison: hyperpigmentation, weight loss, fatigue",
        "Addison: orthostatic hypotension, salt craving",
        "Addison: hyponatremia, hyperkalemia, hypoglycemia",
        "Addison: hyperpigmented gingiva and buccal mucosa"
      ],
      right: [
        "Cushing: moon face, buffalo hump, central obesity",
        "Cushing: purple striae, thin skin, easy bruising",
        "Cushing: hyperglycemia, hypokalemia, immunosuppression",
        "Conn syndrome: resistant hypertension with hypokalemia"
      ]
    },
    medications: [
      { name: "Hydrocortisone (Cortef / Solu-Cortef)", type: "Glucocorticoid Replacement", action: "Synthetic cortisol that replaces deficient endogenous cortisol in adrenal insufficiency. Provides essential glucocorticoid effects: glucose regulation, stress response, anti-inflammatory action, and permissive effects on catecholamine function. At physiologic doses, also provides some mineralocorticoid activity", sideEffects: "At replacement doses: minimal. At supraphysiologic doses: Cushing features, hyperglycemia, osteoporosis, immunosuppression, adrenal suppression, GI ulceration, mood changes", contra: "Systemic fungal infections (at pharmacologic doses); no absolute contraindication for adrenal crisis replacement", pearl: "Replacement dosing: 15-25mg/day divided (2/3 AM, 1/3 PM to mimic cortisol circadian rhythm). Stress dosing: double for illness, triple for surgery. For adrenal crisis: 100mg IV bolus immediately then 50mg q8h. Patients MUST carry emergency injection kit and wear medical alert identification. Educate that this medication is LIFESAVING and must never be omitted." },
      { name: "Fludrocortisone (Florinef)", type: "Synthetic Mineralocorticoid", action: "Replaces deficient aldosterone in primary adrenal insufficiency. Acts on the distal renal tubule to increase sodium reabsorption and potassium/hydrogen secretion, restoring extracellular fluid volume and blood pressure", sideEffects: "Hypertension, hypokalemia, edema, headache, CHF exacerbation with excessive doses", contra: "Systemic fungal infections; caution in heart failure and hypertension", pearl: "Typical dose 0.05-0.2mg daily. Monitor BP (goal normotensive), serum potassium, and assess for peripheral edema. Not needed in secondary/tertiary adrenal insufficiency (pituitary/hypothalamic causes) because aldosterone is primarily regulated by RAAS, not ACTH. Liberal salt intake is recommended." }
    ],
    pearls: [
      "Adrenal crisis can be triggered by any physiological stress (infection, surgery, trauma, dehydration) in a patient with adrenal insufficiency—educate on stress dosing",
      "Hyperpigmentation in Addison disease is caused by excess ACTH stimulating MSH (same precursor POMC)—it occurs in PRIMARY insufficiency only, not secondary",
      "NEVER abruptly stop chronic corticosteroid therapy—the adrenal glands atrophy during chronic exogenous steroid use and need weeks to months to recover function",
      "Cushing syndrome vs Cushing disease: syndrome = any cause of cortisol excess; disease = specifically ACTH-secreting pituitary adenoma",
      "Conn syndrome (primary hyperaldosteronism) should be suspected in any patient with resistant hypertension plus unexplained hypokalemia—check aldosterone-to-renin ratio"
    ],
    quiz: [
      { question: "A patient with Addison disease presents with severe hypotension unresponsive to fluids, temperature 103°F, sodium 118 mEq/L, and potassium 6.8 mEq/L. What is the priority intervention?", options: ["Administer spironolactone for hyperkalemia", "Administer IV hydrocortisone 100mg immediately", "Obtain a morning cortisol level before treatment", "Start methimazole for suspected thyroid storm"], correct: 1, rationale: "This is an adrenal crisis—a life-threatening emergency. IV hydrocortisone 100mg is given immediately without waiting for confirmatory tests. The hyponatremia and hyperkalemia reflect mineralocorticoid deficiency, and the hemodynamic collapse reflects cortisol deficiency. Treatment should never be delayed for diagnostic confirmation." },
      { question: "A patient taking prednisone 40mg daily for 6 months asks if they can stop the medication since they feel better. The nurse's best response is:", options: ["Yes, you can stop immediately since you feel well", "The medication must be tapered gradually over weeks to allow your adrenal glands to resume cortisol production", "You should switch to methimazole instead", "Stop for 3 days, then restart at a lower dose"], correct: 1, rationale: "Chronic corticosteroid use suppresses the HPA axis, causing adrenal atrophy. Abrupt discontinuation can cause adrenal crisis (potentially fatal). Gradual tapering over weeks to months allows the adrenal glands to recover endogenous cortisol production." },
      { question: "Which assessment finding is most specific to Cushing syndrome?", options: ["Hypertension", "Weight gain", "Purple striae wider than 1cm", "Fatigue"], correct: 2, rationale: "Wide (>1cm), purple/violaceous striae are the most specific finding for Cushing syndrome, reflecting cortisol-mediated dermal thinning and easy rupture of subcutaneous blood vessels. Hypertension, weight gain, and fatigue are nonspecific findings seen in many conditions." },
      { question: "A patient with primary hyperaldosteronism (Conn syndrome) is started on spironolactone. Which side effect should the nurse discuss?", options: ["Hyperkalemia, gynecomastia, and menstrual irregularities", "Hypoglycemia and weight loss", "Bronchospasm and urticaria", "Hair loss and nail changes"], correct: 0, rationale: "Spironolactone blocks aldosterone receptors, causing potassium retention (risk of hyperkalemia—monitor K+). It also has anti-androgenic effects causing gynecomastia in men and menstrual irregularities in women. Eplerenone is a more selective alternative with fewer hormonal side effects." }
    ]
  }
};
