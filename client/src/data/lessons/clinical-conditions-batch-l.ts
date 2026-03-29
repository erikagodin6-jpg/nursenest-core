import { getAssetUrl } from "@/lib/asset-url";
import type { LessonContent } from "./types";
const imgGuillainBarre = getAssetUrl("guillainbarrre_1773374861631.png");

export const clinicalConditionsBatchLLessons: Record<string, LessonContent> = {
  "alzheimer-disease-rpn": {
    title: "Alzheimer Disease",
    cellular: {
      title: "Neurodegenerative Pathology",
      content: "Alzheimer disease is an irreversible and progressive dementia caused by neurodegenerative changes in the brain from abnormal protein buildup. Beta-amyloid plaques accumulate between neurons and tau protein tangles form inside neurons, resulting in cell damage and neuronal death. These changes develop over time, leading to progressive cognitive decline. The nurse monitors for changes in cognition, behavior, and functional ability, assists with activities of daily living, maintains safety, and reports changes to the nursing team."
    },
    riskFactors: [
      "Age over 65 years (greatest risk factor)",
      "Family history of Alzheimer disease",
      "Down syndrome (trisomy 21)",
      "Female sex",
      "History of head trauma",
      "Cardiovascular risk factors (hypertension, diabetes, obesity)",
      "Low educational attainment",
      "Social isolation and sedentary lifestyle"
    ],
    diagnostics: [
      "Assist with cognitive screening tools (MMSE or MoCA) as directed",
      "Monitor client's level of orientation, attention, and recall",
      "Document baseline cognitive and functional abilities",
      "Report changes in behavior, mood, or cognitive function to the RN",
      "Monitor for safety hazards related to cognitive decline",
      "Assist with ADL assessment and report functional changes"
    ],
    management: [
      "Administer cholinesterase inhibitors as ordered (donepezil, rivastigmine)",
      "Administer memantine as ordered for moderate-to-severe disease",
      "Maintain structured and consistent daily routine",
      "Establish normal daytime and nighttime sleep-wake cycle",
      "Decrease stimulation (caffeine, TV) in the evening",
      "Increase daytime exposure to light to promote circadian rhythm",
      "Reorient the client frequently using calm, simple communication"
    ],
    nursingActions: [
      "Maintain a safe environment: door sensors, grab bars, remove throw rugs",
      "Allow client to wander in a safe, enclosed area",
      "Ensure medical identification bracelet is worn at all times",
      "Remove household hazards: gas appliances, toxic chemicals, sharp objects",
      "Install grab bars in shower and bathroom",
      "Do not challenge or negate delusional experiences",
      "Use familiar music, photographs, and visual cues to reduce agitation",
      "Give directions one step at a time with eye contact and gestures",
      "Assess and report caregiver burden; suggest respite care and support groups"
    ],
    signs: {
      left: [
        "Short-term memory decline",
        "Visuospatial deficits",
        "Language difficulties (word-finding problems)",
        "Cognitive impairment (inability to learn new skills)",
        "Self-care deficits",
        "Decline in social skills"
      ],
      right: [
        "Neuropsychiatric symptoms (delusions, hallucinations)",
        "Extrapyramidal motor movements",
        "Myoclonus",
        "Seizures",
        "Loss of bladder or bowel control",
        "Complete dependence on caregivers"
      ]
    },
    medications: [
      { name: "Donepezil", type: "Cholinesterase inhibitor", action: "Increases acetylcholine availability by inhibiting its breakdown at the synapse", sideEffects: "Nausea, diarrhea, insomnia, bradycardia, muscle cramps", contra: "Severe hepatic impairment, sick sinus syndrome without pacemaker", pearl: "Administer at bedtime to minimize GI side effects. Report bradycardia or syncope to the RN." },
      { name: "Memantine", type: "NMDA receptor antagonist", action: "Blocks excessive glutamate stimulation to protect neurons from excitotoxicity", sideEffects: "Dizziness, headache, constipation, confusion", contra: "Severe renal impairment", pearl: "Used for moderate-to-severe Alzheimer disease. Can be combined with cholinesterase inhibitors." }
    ],
    pearls: [
      "Establish a cognitive baseline early so changes can be detected and reported",
      "Structured routines reduce confusion, agitation, and sundowning behavior",
      "Never argue with or correct a client experiencing delusions; redirect gently",
      "Medical identification bracelets are essential for wandering clients",
      "Caregiver burnout is common; assess and encourage use of respite care services"
    ],
    quiz: [
      { question: "Which intervention should the nurse prioritize for a client with Alzheimer disease who becomes agitated in the evening?", options: ["Administer a sedative as ordered", "Reduce environmental stimulation and maintain a calm routine", "Restrain the client for safety", "Increase caffeine intake to keep them awake during the day"], correct: 1, rationale: "Sundowning (increased agitation in the evening) is managed by reducing stimulation, maintaining routine, and ensuring a calm environment. Restraints and sedatives are not first-line interventions." },
      { question: "Which safety measure is most important for a client with Alzheimer disease who wanders?", options: ["Lock the client in their room", "Apply a medical identification bracelet and install door sensors", "Keep all lights off at night", "Remove all furniture from the room"], correct: 1, rationale: "Medical identification bracelets and door sensors allow safe monitoring without restricting freedom. Locking a client in a room is inappropriate and may increase agitation." },
      { question: "The nurse notes a client with Alzheimer disease is experiencing visual hallucinations. What is the best response?", options: ["Challenge the hallucination and explain it is not real", "Reassure the client they are safe and redirect attention", "Ignore the client's experience", "Turn off all lights to eliminate visual stimulation"], correct: 1, rationale: "The nurse should not challenge or negate the experience. Reassuring safety and gentle redirection are therapeutic approaches for neuropsychiatric symptoms." }
    ]
  },

  "alzheimer-disease-rn": {
    title: "Alzheimer Disease",
    cellular: {
      title: "Pathophysiology of Neurodegeneration",
      content: "Alzheimer disease is characterized by progressive accumulation of extracellular beta-amyloid plaques and intracellular neurofibrillary tangles of hyperphosphorylated tau protein. These pathological changes trigger chronic neuroinflammation, oxidative stress, synaptic dysfunction, and widespread neuronal death, particularly in the hippocampus and cerebral cortex. Cholinergic neurotransmission is severely impaired as the nucleus basalis of Meynert degenerates. The disease progresses through predictable stages, from mild cognitive impairment to complete functional dependence. The nurse performs comprehensive cognitive assessments, manages pharmacological therapy, coordinates multidisciplinary care, implements safety interventions, and provides caregiver education and support."
    },
    riskFactors: [
      "Advanced age (prevalence doubles every 5 years after age 65)",
      "Apolipoprotein E4 (APOE4) genotype",
      "Family history of early-onset Alzheimer disease",
      "Down syndrome (trisomy 21)",
      "Female sex (longer lifespan and hormonal factors)",
      "Cardiovascular risk factors: hypertension, diabetes, hyperlipidemia",
      "History of traumatic brain injury",
      "Chronic social isolation and depression"
    ],
    diagnostics: [
      "Administer standardized cognitive screening: Mini-Mental State Examination (MMSE) or Montreal Cognitive Assessment (MoCA)",
      "Assess orientation, attention, recall, language, and visuospatial function systematically",
      "Rule out reversible causes of dementia: hypothyroidism, B12 deficiency, depression, normal pressure hydrocephalus",
      "Interpret MRI findings: diffuse cortical and hippocampal atrophy",
      "Review laboratory results: TSH, vitamin B12, CBC, CMP, RPR",
      "Assess functional status using ADL and IADL scales to establish baseline and track decline",
      "Evaluate for depression using validated tools (GDS, PHQ-9)"
    ],
    management: [
      "Initiate and titrate cholinesterase inhibitors (donepezil, rivastigmine, galantamine) for mild-to-moderate disease",
      "Add memantine for moderate-to-severe disease per provider order",
      "Implement structured daily routines to reduce confusion and agitation",
      "Establish and maintain consistent sleep-wake cycles",
      "Coordinate multidisciplinary care: neurology, social work, dietitian, physical therapy",
      "Facilitate advance directive planning: living will, power of attorney, end-of-life preferences",
      "Refer caregivers to support groups and community resources",
      "Implement fall prevention measures and environmental modifications"
    ],
    nursingActions: [
      "Perform serial cognitive assessments at each encounter to track progression",
      "Assess for behavioral and psychological symptoms of dementia (BPSD): agitation, aggression, sundowning, wandering",
      "Implement non-pharmacological interventions first: music therapy, validation therapy, structured activities",
      "Manage medication administration: consider patch formulations for clients who refuse oral medications",
      "Coordinate home safety assessment: remove hazards, install grab bars, secure exits",
      "Educate family on disease trajectory and realistic expectations",
      "Screen for and address caregiver burden using validated tools (Zarit Burden Interview)",
      "Implement aspiration precautions as swallowing function declines"
    ],
    signs: {
      left: [
        "Progressive short-term memory loss",
        "Difficulty with complex tasks and problem-solving",
        "Word-finding difficulties (anomia)",
        "Visuospatial disorientation (getting lost in familiar places)",
        "Impaired judgment and decision-making",
        "Personality and mood changes"
      ],
      right: [
        "Delusions and paranoia",
        "Visual and auditory hallucinations",
        "Agitation and aggression",
        "Sundowning (increased confusion in evening)",
        "Dysphagia and aspiration risk",
        "Incontinence (urinary and fecal)",
        "Seizures in advanced disease"
      ]
    },
    medications: [
      { name: "Donepezil", type: "Cholinesterase inhibitor", action: "Reversibly inhibits acetylcholinesterase, increasing ACh concentration at cholinergic synapses", sideEffects: "Nausea, diarrhea, insomnia, vivid dreams, bradycardia, syncope", contra: "Severe hepatic impairment, sick sinus syndrome", pearl: "First-line for mild-to-moderate Alzheimer disease. Administer at bedtime. Monitor heart rate and report bradycardia." },
      { name: "Rivastigmine", type: "Cholinesterase inhibitor", action: "Inhibits both acetylcholinesterase and butyrylcholinesterase in the CNS", sideEffects: "Nausea, vomiting, weight loss, dizziness", contra: "Known hypersensitivity, severe hepatic impairment", pearl: "Available as transdermal patch (Exelon Patch) which improves adherence and reduces GI side effects. Rotate application sites daily." },
      { name: "Memantine", type: "NMDA receptor antagonist", action: "Blocks excessive glutamate-mediated excitotoxicity while preserving normal neurotransmission", sideEffects: "Dizziness, headache, confusion, constipation", contra: "Severe renal impairment (CrCl <5 mL/min)", pearl: "Indicated for moderate-to-severe Alzheimer disease. Can be used in combination with cholinesterase inhibitors for additive benefit." },
      { name: "Risperidone (low dose)", type: "Atypical antipsychotic", action: "Blocks dopamine D2 and serotonin 5-HT2A receptors to reduce psychotic symptoms", sideEffects: "Sedation, orthostatic hypotension, EPS, metabolic syndrome", contra: "Dementia-related psychosis in elderly (FDA black box warning for increased mortality)", pearl: "Used with extreme caution and only when non-pharmacological interventions fail. Lowest effective dose for shortest duration. Black box warning for increased stroke and death in elderly with dementia." }
    ],
    pearls: [
      "No confirmatory diagnostic test exists for Alzheimer disease during life; diagnosis is clinical and supported by imaging",
      "MRI shows diffuse cortical atrophy with hippocampal volume loss",
      "Cholinesterase inhibitors do not cure or halt disease progression; they temporarily improve symptoms",
      "Sundowning can be managed by increasing daytime light exposure and reducing evening stimulation",
      "Aspiration risk increases significantly in late-stage disease; assess swallowing regularly"
    ],
    quiz: [
      { question: "Which assessment finding should the nurse expect in early-stage Alzheimer disease?", options: ["Seizures and myoclonus", "Progressive short-term memory loss with preserved long-term memory", "Complete bowel and bladder incontinence", "Inability to swallow"], correct: 1, rationale: "Early Alzheimer disease is characterized by progressive short-term memory loss while long-term memories are relatively preserved. Seizures, incontinence, and dysphagia are late-stage manifestations." },
      { question: "Which non-pharmacological intervention should the nurse implement first for a client with agitation related to Alzheimer disease?", options: ["Apply physical restraints", "Administer haloperidol PRN", "Use music therapy, redirection, and a calm environment", "Increase the dose of donepezil"], correct: 2, rationale: "Non-pharmacological interventions (music therapy, validation therapy, environmental modification) should always be attempted first. Antipsychotics carry a black box warning in elderly dementia patients." },
      { question: "The nurse is educating the family of a client with Alzheimer disease about advance care planning. Which action is the priority?", options: ["Recommend immediate nursing home placement", "Facilitate completion of advance directives while the client can still participate", "Advise the family to make all decisions without the client's input", "Defer planning until the client reaches late-stage disease"], correct: 1, rationale: "Advance directive planning should occur as early as possible while the client retains decision-making capacity to express their wishes for future care." }
    ]
  },

  "guillain-barre-rpn": {
    title: "Guillain-Barré Syndrome",
    image: imgGuillainBarre,
    cellular: {
      title: "Immune-Mediated Demyelination",
      content: "Guillain-Barré syndrome (GBS) is an acute autoimmune polyneuropathy in which the immune system attacks the peripheral nervous system following a triggering event (usually a viral or bacterial infection). Autoantibodies target the myelin sheath surrounding peripheral nerves, causing demyelination and impaired nerve conduction. This results in ascending symmetrical muscle weakness that begins in the lower extremities and progresses upward, potentially involving respiratory muscles. The nurse monitors vital signs, respiratory status, and neurological function, reporting all changes immediately."
    },
    riskFactors: [
      "Recent viral infection (1-4 weeks prior): influenza, Epstein-Barr, cytomegalovirus, Zika",
      "Campylobacter jejuni gastroenteritis (most common preceding infection)",
      "Recent surgery or vaccination (rare association)",
      "HIV infection",
      "Hodgkin lymphoma"
    ],
    diagnostics: [
      "Monitor vital signs frequently, especially respiratory rate and depth",
      "Measure and report oxygen saturation trends",
      "Monitor and report progressive weakness: note which muscle groups are affected",
      "Report difficulty swallowing, speaking, or breathing immediately",
      "Assess and document deep tendon reflexes as directed (areflexia is expected)",
      "Monitor urine output for urinary retention"
    ],
    management: [
      "Maintain bed rest during acute phase as ordered",
      "Assist with positioning to prevent skin breakdown and contractures",
      "Administer medications as ordered",
      "Keep emergency respiratory equipment accessible (ambu bag, suction)",
      "Implement VTE prophylaxis measures as directed (SCDs, anticoagulants)",
      "Provide emotional support as the client experiences rapidly progressing paralysis"
    ],
    nursingActions: [
      "Monitor respiratory function every 2-4 hours: rate, depth, accessory muscle use, oxygen saturation",
      "Report any decline in respiratory effort immediately to the RN",
      "Assess motor strength in all extremities and document progression of weakness",
      "Monitor for autonomic dysfunction: blood pressure fluctuations, cardiac arrhythmias, diaphoresis",
      "Prevent complications of immobility: reposition every 2 hours, range-of-motion exercises",
      "Assess for pain (neuropathic pain is common) and report for management",
      "Monitor swallowing ability before oral intake; hold feeds if dysphagia suspected"
    ],
    signs: {
      left: [
        "Ascending symmetrical weakness (starts in legs)",
        "Paresthesias (tingling, numbness in extremities)",
        "Diminished or absent deep tendon reflexes",
        "Bilateral facial weakness",
        "Difficulty walking or standing"
      ],
      right: [
        "Respiratory muscle weakness (dyspnea, shallow breathing)",
        "Autonomic instability (BP swings, tachycardia, bradycardia)",
        "Dysphagia and drooling",
        "Urinary retention",
        "Severe neuropathic pain",
        "Complete flaccid paralysis (severe cases)"
      ]
    },
    medications: [
      { name: "Enoxaparin", type: "Low-molecular-weight heparin", action: "Prevents venous thromboembolism in immobilized patients", sideEffects: "Bleeding, injection site bruising, thrombocytopenia", contra: "Active bleeding, HIT, severe renal impairment", pearl: "VTE prophylaxis is critical in GBS patients due to prolonged immobility. Administer subcutaneously as ordered and report signs of bleeding." }
    ],
    pearls: [
      "GBS is a medical emergency; respiratory failure can develop rapidly and unpredictably",
      "Ascending weakness that reaches the respiratory muscles requires intubation and mechanical ventilation",
      "Deep tendon reflexes are typically absent (areflexia) in GBS",
      "Most patients recover fully, but recovery can take weeks to months",
      "Pain management is often overlooked in GBS; neuropathic pain is common and distressing"
    ],
    quiz: [
      { question: "Which finding in a client with Guillain-Barré syndrome should the nurse report immediately?", options: ["Tingling in the toes", "Declining respiratory rate and increasing use of accessory muscles", "Absent patellar reflex", "Mild leg weakness"], correct: 1, rationale: "Respiratory decline indicates ascending paralysis has reached the respiratory muscles, which is a life-threatening emergency requiring immediate intervention including possible intubation." },
      { question: "The nurse is caring for a client with GBS who is on bed rest. Which intervention is most important to prevent complications?", options: ["Encourage ambulation three times daily", "Reposition every 2 hours and apply sequential compression devices", "Maintain strict fluid restriction", "Elevate the head of bed to 90 degrees at all times"], correct: 1, rationale: "Immobility in GBS increases the risk of DVT, skin breakdown, and respiratory complications. Repositioning and SCDs are essential preventive measures." }
    ]
  },

  "guillain-barre-rn": {
    title: "Guillain-Barré Syndrome",
    image: imgGuillainBarre,
    cellular: {
      title: "Autoimmune Peripheral Neuropathy",
      content: "Guillain-Barré syndrome is an acute inflammatory demyelinating polyneuropathy (AIDP) in which molecular mimicry between microbial antigens and gangliosides on the myelin sheath triggers autoantibody production and complement-mediated destruction of Schwann cells. Demyelination disrupts saltatory conduction in peripheral motor and sensory nerves. The classic presentation is ascending symmetrical weakness with areflexia, progressing over days to weeks. Approximately 30% of patients develop respiratory failure requiring mechanical ventilation. Autonomic dysfunction affects 70% of patients and is the leading cause of death. The nurse performs serial neurological assessments, monitors respiratory function, manages hemodynamic instability, coordinates immunotherapy, and provides comprehensive supportive care."
    },
    riskFactors: [
      "Campylobacter jejuni gastroenteritis (30% of cases; associated with axonal variant and poorer prognosis)",
      "Upper respiratory infection 1-4 weeks prior",
      "Cytomegalovirus, Epstein-Barr virus, influenza, Zika virus",
      "Recent surgery or anesthesia",
      "HIV/AIDS",
      "Hodgkin lymphoma",
      "Post-vaccination (rare, approximately 1-2 per million)"
    ],
    diagnostics: [
      "Perform serial neurological assessments: motor strength grading (0-5 scale), DTR assessment, cranial nerve examination",
      "Monitor forced vital capacity (FVC) and negative inspiratory force (NIF) every 4-6 hours during acute phase",
      "Anticipate intubation when FVC <20 mL/kg, NIF <-25 cmH2O, or >30% decline from baseline (20-30-40 rule)",
      "Interpret CSF analysis: albuminocytologic dissociation (elevated protein with normal WBC count)",
      "Interpret nerve conduction studies showing prolonged distal latencies and conduction block",
      "Monitor continuous cardiac telemetry for autonomic arrhythmias",
      "Assess Hughes Functional Grading Scale to track disability progression"
    ],
    management: [
      "Coordinate plasmapheresis (plasma exchange): 5 sessions over 7-14 days for moderate-to-severe GBS",
      "Administer IV immunoglobulin (IVIG) 0.4 g/kg/day for 5 days as alternative to plasmapheresis",
      "Implement aggressive respiratory monitoring and prepare for intubation",
      "Manage autonomic instability: continuous telemetry, cautious use of vasopressors and antiarrhythmics",
      "Implement comprehensive VTE prophylaxis: SCDs plus pharmacological anticoagulation",
      "Manage neuropathic pain with gabapentin or pregabalin per order",
      "Coordinate physical therapy for range-of-motion exercises during acute phase and progressive rehabilitation",
      "Implement nutritional support: enteral feeding if dysphagia present"
    ],
    nursingActions: [
      "Perform respiratory assessment every 2-4 hours: rate, depth, FVC, single-breath count, cough strength",
      "Keep emergency intubation equipment at bedside at all times",
      "Assess motor strength systematically from distal to proximal every 4-8 hours and document progression",
      "Monitor for autonomic dysfunction: labile blood pressure, cardiac arrhythmias, ileus, urinary retention",
      "Perform swallowing assessment before any oral intake; implement aspiration precautions",
      "Provide meticulous skin care and reposition every 2 hours; use pressure-relieving surfaces",
      "Assess pain using validated scales; neuropathic pain may require multimodal management",
      "Provide emotional support and education: explain that GBS is usually self-limiting with good recovery potential"
    ],
    signs: {
      left: [
        "Ascending symmetrical weakness (legs before arms)",
        "Areflexia or hyporeflexia",
        "Paresthesias and numbness",
        "Bilateral facial nerve palsy (cranial nerve VII)",
        "Bulbar weakness (dysarthria, dysphagia)",
        "Pain (neuropathic, back, extremity)"
      ],
      right: [
        "Respiratory failure (diaphragmatic weakness)",
        "Autonomic instability (tachycardia, bradycardia, hypertension, hypotension)",
        "Cardiac arrhythmias (leading cause of mortality)",
        "Paralytic ileus",
        "Urinary retention",
        "Complete quadriplegia in severe cases"
      ]
    },
    medications: [
      { name: "Intravenous Immunoglobulin (IVIG)", type: "Immunomodulator", action: "Provides exogenous antibodies that modulate the immune response and block autoantibody-mediated nerve damage", sideEffects: "Headache, fever, chills, myalgias, anaphylaxis (IgA-deficient patients), aseptic meningitis, renal failure, thromboembolic events", contra: "Selective IgA deficiency with anti-IgA antibodies, history of anaphylaxis to IVIG", pearl: "Standard dose is 0.4 g/kg/day for 5 days (total 2 g/kg). Equally effective as plasmapheresis. Do not combine IVIG with plasmapheresis (no additional benefit). Check IgA level before first infusion." },
      { name: "Gabapentin", type: "Anticonvulsant / neuropathic pain agent", action: "Modulates calcium channels in the CNS to reduce neuropathic pain signaling", sideEffects: "Sedation, dizziness, ataxia, peripheral edema", contra: "Severe renal impairment (dose adjustment required)", pearl: "First-line for neuropathic pain in GBS. Start low (100-300mg TID) and titrate. Monitor for excessive sedation especially in patients with respiratory compromise." },
      { name: "Enoxaparin", type: "LMWH anticoagulant", action: "Inhibits factor Xa and thrombin to prevent venous thromboembolism", sideEffects: "Bleeding, HIT, injection site hematoma", contra: "Active hemorrhage, HIT, severe renal impairment (CrCl <30)", pearl: "VTE prophylaxis is essential due to prolonged immobility. Combined with SCDs. Adjust dose for renal impairment." }
    ],
    pearls: [
      "The 20-30-40 rule for intubation: FVC <20 mL/kg, NIF <-25 (or worse than -30), or >30% decline in FVC from baseline",
      "Corticosteroids are NOT effective in GBS and should not be administered",
      "Albuminocytologic dissociation (high CSF protein, normal cell count) is the classic CSF finding but may be normal in the first week",
      "IVIG and plasmapheresis are equally effective; do not combine them",
      "Recovery follows a pattern: plateau phase (2-4 weeks) followed by gradual improvement over weeks to months"
    ],
    quiz: [
      { question: "A patient with GBS has a forced vital capacity (FVC) of 18 mL/kg. What is the RN's priority action?", options: ["Continue monitoring every 4 hours", "Prepare for intubation and notify the provider immediately", "Administer supplemental oxygen via nasal cannula", "Encourage incentive spirometry"], correct: 1, rationale: "FVC <20 mL/kg meets criteria for intubation in GBS (20-30-40 rule). The nurse should prepare for intubation immediately and notify the provider, as respiratory failure can progress rapidly." },
      { question: "Which CSF finding is characteristic of Guillain-Barré syndrome?", options: ["Elevated WBC count with low glucose", "Elevated protein with normal WBC count", "Bloody CSF with xanthochromia", "Normal protein with elevated glucose"], correct: 1, rationale: "Albuminocytologic dissociation (elevated CSF protein with normal WBC count) is the classic finding in GBS, reflecting inflammation and protein leakage at the blood-nerve barrier." },
      { question: "The nurse is caring for a patient receiving IVIG for GBS. Which assessment is essential before the first infusion?", options: ["Serum potassium level", "IgA level", "Hemoglobin A1c", "Serum albumin"], correct: 1, rationale: "Patients with selective IgA deficiency can develop anaphylaxis when exposed to IgA-containing blood products including IVIG. IgA level should be checked before the first infusion." }
    ]
  },

  "myasthenia-gravis-rpn": {
    title: "Myasthenia Gravis",
    cellular: {
      title: "Neuromuscular Junction Dysfunction",
      content: "Myasthenia gravis is an autoimmune disorder in which antibodies target acetylcholine receptors at the neuromuscular junction, impairing nerve impulse transmission to skeletal muscles. This results in progressive, fluctuating muscle weakness that worsens with activity and improves with rest. The weakness characteristically affects ocular muscles first (ptosis, diplopia), then progresses to bulbar muscles (dysphagia, dysarthria) and potentially respiratory muscles. The nurse monitors for worsening weakness, respiratory status, and medication effects, reporting all changes immediately."
    },
    riskFactors: [
      "Female sex (onset typically 20-40 years)",
      "Male sex (onset typically 60-80 years)",
      "Thymic abnormalities (thymoma in 10-15% of cases)",
      "Other autoimmune conditions (thyroid disease, rheumatoid arthritis, lupus)",
      "Family history of autoimmune disease",
      "Stress, infection, or temperature extremes (exacerbation triggers)"
    ],
    diagnostics: [
      "Monitor muscle strength throughout the day and document fluctuations",
      "Report worsening ptosis, diplopia, or difficulty swallowing to the RN",
      "Monitor respiratory rate, depth, and oxygen saturation frequently",
      "Assess voice quality for dysarthria and nasal speech",
      "Report difficulty chewing or swallowing before or during meals",
      "Monitor for medication side effects and report"
    ],
    management: [
      "Administer pyridostigmine exactly on time as ordered (timing is critical)",
      "Schedule activities and ADLs early in the day when energy levels are highest",
      "Prepare semisolid foods to reduce aspiration risk during meals",
      "Administer medications before meals to optimize swallowing strength",
      "Encourage rest periods between activities to prevent fatigue",
      "Avoid excessive heat exposure which worsens muscle weakness"
    ],
    nursingActions: [
      "Monitor for signs of respiratory crisis and report immediately: increasing dyspnea, use of accessory muscles, inability to cough",
      "Assess swallowing function before each meal and report any gurgling or coughing during eating",
      "Monitor for gurgling, coughing, or wet voice quality during meals (aspiration risk)",
      "Position client in semi-Fowler's position during and after meals",
      "Encourage relaxation and stress reduction techniques",
      "Ensure vaccinations are up to date per provider orders",
      "Report any sudden severe worsening of weakness (may indicate myasthenic crisis)"
    ],
    signs: {
      left: [
        "Ptosis (drooping eyelids)",
        "Diplopia (double vision)",
        "Fluctuating muscle weakness (worse later in day)",
        "Weakness improves with rest",
        "Dysarthria (slurred speech)",
        "Difficulty chewing"
      ],
      right: [
        "Dysphagia (difficulty swallowing)",
        "Respiratory muscle weakness",
        "Nasal voice quality",
        "Neck weakness (head drop)",
        "Generalized limb weakness",
        "Respiratory failure (myasthenic crisis)"
      ]
    },
    medications: [
      { name: "Pyridostigmine", type: "Cholinesterase inhibitor", action: "Inhibits acetylcholinesterase, increasing acetylcholine availability at the neuromuscular junction", sideEffects: "Abdominal cramps, diarrhea, increased salivation, bradycardia, muscle fasciculations", contra: "Mechanical bowel or urinary obstruction", pearl: "Must be administered exactly on time. Administer 30-60 minutes before meals to improve swallowing. Too much causes cholinergic crisis (SLUDGE symptoms)." }
    ],
    pearls: [
      "Pyridostigmine timing is critical: late doses lead to worsening weakness, overdose leads to cholinergic crisis",
      "Medications that worsen MG include fluoroquinolones, aminoglycosides, magnesium sulfate, and beta-blockers",
      "Myasthenic crisis (too little medication) vs. cholinergic crisis (too much medication) both cause respiratory failure",
      "Weakness that worsens with activity and improves with rest is the hallmark of myasthenia gravis",
      "Schedule ADLs early in the day when muscle strength is greatest"
    ],
    quiz: [
      { question: "Which finding in a client with myasthenia gravis should the nurse report immediately?", options: ["Mild ptosis in the evening", "Increasing difficulty breathing and inability to swallow", "Fatigue after physical activity", "Improvement in strength after rest"], correct: 1, rationale: "Increasing dyspnea and dysphagia suggest progression toward myasthenic crisis with respiratory failure, requiring immediate intervention including potential intubation." },
      { question: "When should pyridostigmine be administered in relation to meals?", options: ["Immediately after the meal", "30-60 minutes before the meal", "At bedtime only", "Only when symptoms worsen"], correct: 1, rationale: "Pyridostigmine should be administered 30-60 minutes before meals to allow peak effect during eating, improving chewing and swallowing strength." }
    ]
  },

  "myasthenia-gravis-rn": {
    title: "Myasthenia Gravis",
    cellular: {
      title: "Autoimmune Neuromuscular Pathophysiology",
      content: "Myasthenia gravis is an autoimmune disorder in which IgG autoantibodies bind to nicotinic acetylcholine receptors (AChRs) on the postsynaptic membrane of the neuromuscular junction. This binding activates complement, destroys receptors, and reduces the number of functional AChRs. As a result, acetylcholine released from motor nerve terminals is insufficient to depolarize the postsynaptic membrane and generate a muscle action potential. The weakness is characteristically fatigable: repeated use of a muscle group depletes available ACh and worsens weakness, while rest allows replenishment. The thymus gland is implicated in 85% of patients (hyperplasia or thymoma). The nurse manages medication timing, performs serial respiratory and neurological assessments, distinguishes between myasthenic and cholinergic crises, implements aspiration precautions, and coordinates multidisciplinary care."
    },
    riskFactors: [
      "Bimodal age distribution: women 20-40 years, men 60-80 years",
      "Thymic abnormalities: thymic hyperplasia (65%), thymoma (10-15%)",
      "Other autoimmune conditions (thyroiditis, rheumatoid arthritis, SLE)",
      "Family history of autoimmune disease",
      "HLA-B8 and HLA-DR3 genetic associations",
      "Exacerbation triggers: infection, stress, surgery, pregnancy, temperature extremes",
      "Medications that worsen MG: aminoglycosides, fluoroquinolones, macrolides, beta-blockers, magnesium, D-penicillamine"
    ],
    diagnostics: [
      "Interpret serum AChR antibody test (positive in 85% of generalized MG)",
      "Evaluate anti-MuSK antibody in AChR-negative patients (seronegative MG)",
      "Assess response to edrophonium (Tensilon test): brief improvement in strength confirms MG diagnosis",
      "Order electromyography (EMG) with repetitive nerve stimulation: decremental response is diagnostic",
      "Order CT or MRI of chest to evaluate for thymoma",
      "Perform serial bedside respiratory assessment: FVC, NIF, single-breath count",
      "Monitor complete medication list for drugs that exacerbate MG"
    ],
    management: [
      "Administer pyridostigmine on a strict schedule; titrate dose based on symptom response",
      "Administer corticosteroids (prednisone) as prescribed for immunosuppression; monitor for initial worsening",
      "Coordinate immunosuppressant therapy: azathioprine, mycophenolate as steroid-sparing agents",
      "Prepare patient for thymectomy if thymoma is present or in non-thymomatous MG for potential remission",
      "Manage myasthenic crisis: plasmapheresis or IVIG, respiratory support, ICU monitoring",
      "Differentiate myasthenic crisis from cholinergic crisis (both present with weakness and respiratory failure)",
      "Implement aspiration precautions: assess swallowing, modified diet texture, upright positioning"
    ],
    nursingActions: [
      "Administer pyridostigmine exactly on time; delays worsen weakness, overdose causes cholinergic crisis",
      "Perform respiratory assessment every 2-4 hours during exacerbation: FVC, NIF, cough strength, SpO2",
      "Assess for myasthenic crisis: sudden severe generalized weakness, respiratory distress, dysphagia (undertreated)",
      "Assess for cholinergic crisis: excessive salivation, lacrimation, urination, diarrhea, diaphoresis, bradycardia (SLUDGE; overtreated)",
      "Keep emergency intubation equipment at bedside during acute phase",
      "Perform swallowing assessment before meals; modify diet consistency as needed",
      "Schedule nursing care and patient activities during peak medication effect",
      "Educate patient on medication adherence, trigger avoidance, and signs of crisis"
    ],
    signs: {
      left: [
        "Ptosis (drooping eyelids, often asymmetric)",
        "Diplopia (double vision)",
        "Fatigable weakness (worsens with activity, improves with rest)",
        "Facial weakness (flat affect, snarl when smiling)",
        "Dysarthria (weak, nasal speech)",
        "Weak neck extensors (head drop)"
      ],
      right: [
        "Dysphagia with aspiration risk",
        "Respiratory muscle weakness (dyspnea, shallow breathing)",
        "Myasthenic crisis (acute respiratory failure from undertreated MG)",
        "Cholinergic crisis (SLUDGE symptoms from pyridostigmine overdose)",
        "Generalized limb weakness (proximal > distal)",
        "Inability to maintain upright posture"
      ]
    },
    medications: [
      { name: "Pyridostigmine", type: "Cholinesterase inhibitor", action: "Inhibits acetylcholinesterase at the neuromuscular junction, increasing ACh concentration and improving neuromuscular transmission", sideEffects: "Abdominal cramps, diarrhea, increased secretions, bradycardia, muscle fasciculations", contra: "Mechanical GI or urinary obstruction", pearl: "First-line symptomatic treatment. Typical dose: 60mg every 4-6 hours. Extended-release (Mestinon Timespan 180mg) given at bedtime for overnight coverage. Overdose causes cholinergic crisis." },
      { name: "Prednisone", type: "Corticosteroid", action: "Suppresses autoimmune response by reducing AChR antibody production and complement activation", sideEffects: "Cushingoid features, hyperglycemia, osteoporosis, immunosuppression, adrenal suppression", contra: "Active systemic fungal infection, uncontrolled diabetes", pearl: "May cause initial worsening of weakness in first 2-3 weeks (start low, go slow). Taper gradually to avoid adrenal crisis. Long-term use requires steroid-sparing agent." },
      { name: "Azathioprine", type: "Immunosuppressant", action: "Purine analog that inhibits lymphocyte proliferation, reducing autoantibody production", sideEffects: "Bone marrow suppression, hepatotoxicity, pancreatitis, increased infection risk", contra: "TPMT deficiency (check TPMT before starting), pregnancy", pearl: "Steroid-sparing agent; takes 3-6 months for full effect. Monitor CBC and LFTs regularly. Check TPMT enzyme level before initiating therapy." },
      { name: "IVIG", type: "Immunomodulator", action: "Modulates immune system, neutralizes pathogenic autoantibodies through anti-idiotype mechanisms", sideEffects: "Headache, anaphylaxis (IgA deficiency), renal failure, thromboembolism", contra: "IgA deficiency with anti-IgA antibodies", pearl: "Used for myasthenic crisis and as bridge therapy. 2 g/kg over 2-5 days. Onset of action within days. Check IgA level before first dose." }
    ],
    pearls: [
      "Myasthenic crisis (undertreated) and cholinergic crisis (overtreated) both cause respiratory failure but are treated differently",
      "The Tensilon (edrophonium) test differentiates the two: improvement = myasthenic crisis; worsening = cholinergic crisis",
      "Never administer aminoglycosides, fluoroquinolones, or magnesium sulfate to a patient with MG without extreme caution",
      "Thymectomy may lead to remission or significant improvement in 50-70% of non-thymomatous MG patients",
      "Initial worsening of weakness after starting prednisone is expected; hospitalize patients during initiation if bulbar or respiratory involvement is significant"
    ],
    quiz: [
      { question: "A patient with MG develops profuse salivation, diarrhea, abdominal cramping, and worsening weakness after taking pyridostigmine. The nurse suspects:", options: ["Myasthenic crisis", "Cholinergic crisis", "Allergic reaction to pyridostigmine", "Normal medication response"], correct: 1, rationale: "SLUDGE symptoms (Salivation, Lacrimation, Urination, Diarrhea, GI cramping, Emesis) with worsening weakness after pyridostigmine administration indicate cholinergic crisis from medication overdose." },
      { question: "Which medication should the nurse question if ordered for a patient with myasthenia gravis?", options: ["Pyridostigmine", "Azathioprine", "Gentamicin", "Prednisone"], correct: 2, rationale: "Aminoglycosides (including gentamicin) can worsen neuromuscular blockade in MG by interfering with ACh release and postsynaptic receptor function, potentially precipitating respiratory failure." },
      { question: "The nurse is preparing a patient with MG for thymectomy. Which preoperative assessment is the priority?", options: ["Assess for latex allergy", "Evaluate respiratory function and FVC", "Check serum potassium level", "Assess for peripheral edema"], correct: 1, rationale: "Respiratory function assessment is critical before thymectomy because MG patients are at high risk for postoperative respiratory failure. Baseline FVC and NIF guide postoperative ventilation management." }
    ]
  },

  "newborn-diabetic-mother-rpn": {
    title: "Newborn of Diabetic Mother",
    cellular: {
      title: "Fetal Hyperinsulinism",
      content: "During intrauterine life, the fetus of a mother with poorly controlled diabetes is exposed to elevated maternal glucose levels that cross the placenta. The fetal pancreas responds by producing high levels of insulin (fetal hyperinsulinism). After birth, the newborn loses the maternal glucose supply but continues to produce excessive insulin, resulting in rapid neonatal hypoglycemia. Fetal hyperinsulinism also drives excessive fetal growth (macrosomia), which increases the risk of birth injuries. The newborn is additionally at risk for hypocalcemia, hyperbilirubinemia, polycythemia, and respiratory distress syndrome. The nurse monitors blood glucose levels, feeding patterns, and vital signs, reporting abnormalities immediately."
    },
    riskFactors: [
      "Maternal gestational diabetes mellitus (GDM)",
      "Maternal pre-existing type 1 or type 2 diabetes",
      "Poor maternal glycemic control during pregnancy",
      "Macrosomia (birth weight >4000g or >90th percentile)",
      "Large for gestational age (LGA) newborn",
      "Preterm birth (impaired surfactant production)",
      "Maternal obesity"
    ],
    diagnostics: [
      "Monitor blood glucose levels per protocol: typically at 1, 2, 4, 8, 12, and 24 hours of life",
      "Report blood glucose <40 mg/dL (2.2 mmol/L) immediately",
      "Monitor for signs of hypoglycemia: jitteriness, irritability, tremors, poor feeding, lethargy, apnea",
      "Monitor vital signs: temperature instability, respiratory rate, heart rate",
      "Assess for signs of birth injury: clavicle fracture, brachial plexus injury (Erb palsy)",
      "Monitor for jaundice and report yellow skin discoloration"
    ],
    management: [
      "Initiate early and frequent feeding within 30-60 minutes of birth (breastfeeding preferred)",
      "Feed every 2-3 hours to maintain glucose levels",
      "Administer IV dextrose as ordered if oral feeds are insufficient to maintain glucose",
      "Maintain thermoregulation: skin-to-skin contact, warm environment (cold stress increases glucose utilization)",
      "Report respiratory distress signs: tachypnea, grunting, nasal flaring, retractions",
      "Monitor intake and output including wet diapers and stool frequency"
    ],
    nursingActions: [
      "Perform heel stick blood glucose checks at scheduled intervals and report abnormal values",
      "Encourage breastfeeding or provide formula supplementation as ordered",
      "Assess feeding effectiveness: latch, duration, swallowing sounds",
      "Monitor respiratory status: rate, effort, oxygen saturation",
      "Maintain thermoneutral environment to prevent cold stress",
      "Assess for birth trauma: asymmetric Moro reflex (Erb palsy), crepitus over clavicle",
      "Monitor skin color for jaundice and report progression"
    ],
    signs: {
      left: [
        "Macrosomia (large birth weight)",
        "Plethoric (ruddy, flushed) appearance",
        "Organomegaly (enlarged liver, heart)",
        "Cushingoid facial features",
        "Birth injuries from difficult delivery"
      ],
      right: [
        "Hypoglycemia: jitteriness, tremors, irritability, poor feeding",
        "Lethargy, hypotonia, apnea (severe hypoglycemia)",
        "Temperature instability",
        "Respiratory distress (tachypnea, grunting)",
        "Jaundice",
        "Seizures (if severe hypoglycemia untreated)"
      ]
    },
    medications: [
      { name: "Dextrose 10% IV", type: "Glucose replacement", action: "Provides exogenous glucose to maintain blood sugar when oral feeds are insufficient", sideEffects: "Rebound hypoglycemia if infusion stopped abruptly, IV site infiltration", contra: "None (life-saving intervention for neonatal hypoglycemia)", pearl: "Administer 2 mL/kg bolus of D10W followed by continuous infusion at 6-8 mg/kg/min. Wean gradually to prevent rebound hypoglycemia. Always recheck glucose 30 minutes after intervention." }
    ],
    pearls: [
      "Neonatal hypoglycemia can cause permanent neurological damage if not treated promptly",
      "Early feeding (within 30-60 minutes of birth) is the first intervention for maintaining blood glucose",
      "Jitteriness is the most common early sign of neonatal hypoglycemia",
      "Cold stress increases glucose utilization; maintain thermoneutral environment at all times",
      "Macrosomia increases risk of shoulder dystocia, clavicle fracture, and brachial plexus injury during delivery"
    ],
    quiz: [
      { question: "A newborn of a diabetic mother has a blood glucose of 35 mg/dL at 2 hours of life. What is the RPN's priority action?", options: ["Document the finding and recheck in 4 hours", "Report the low glucose immediately and encourage feeding", "Wait for the next scheduled check", "Apply a warm blanket and recheck in 1 hour"], correct: 1, rationale: "Blood glucose <40 mg/dL requires immediate intervention. The nurse should report the finding and initiate or encourage feeding. IV dextrose may be needed if oral feeds do not raise glucose levels." },
      { question: "Which assessment finding is the earliest indicator of hypoglycemia in a newborn of a diabetic mother?", options: ["Seizures", "Cyanosis", "Jitteriness and tremors", "Bradycardia"], correct: 2, rationale: "Jitteriness, tremors, and irritability are early signs of neonatal hypoglycemia. Seizures are a late and severe manifestation indicating prolonged or profound hypoglycemia." }
    ]
  },

  "newborn-diabetic-mother-rn": {
    title: "Newborn of Diabetic Mother",
    cellular: {
      title: "Pathophysiology of Fetal Hyperinsulinism",
      content: "In pregnancies complicated by diabetes mellitus, chronic maternal hyperglycemia exposes the fetus to elevated glucose levels that freely cross the placenta via facilitated diffusion (GLUT-1 transporters). Maternal insulin does not cross the placenta, so the fetal pancreatic beta cells undergo hyperplasia and hypertrophy, producing excessive insulin. Fetal hyperinsulinism acts as a growth factor, causing macrosomia, organomegaly (cardiomegaly, hepatomegaly), and increased adipose deposition. At birth, the maternal glucose supply is abruptly removed, but the neonatal pancreas continues to secrete supraphysiological insulin levels, causing rapid and potentially severe hypoglycemia within the first 1-4 hours of life. Additional metabolic complications include hypocalcemia (impaired parathyroid response), hypomagnesemia, polycythemia (erythropoietin response to chronic fetal hypoxia), hyperbilirubinemia (from polycythemia breakdown), and respiratory distress syndrome (insulin inhibits surfactant production). The nurse implements comprehensive metabolic monitoring, manages glucose stabilization, coordinates diagnostic workup, and provides family education."
    },
    riskFactors: [
      "Maternal pre-gestational diabetes (type 1 or type 2) with poor glycemic control",
      "Gestational diabetes mellitus (GDM)",
      "Maternal HbA1c >6.5% during pregnancy",
      "Macrosomia (birth weight >4000g)",
      "Preterm birth (decreased glycogen stores and immature surfactant production)",
      "Operative delivery (cesarean section, vacuum, forceps) due to macrosomia",
      "Maternal obesity and metabolic syndrome"
    ],
    diagnostics: [
      "Perform point-of-care blood glucose at 1, 2, 4, 8, 12, and 24 hours of life per protocol",
      "Confirm point-of-care values <40 mg/dL with serum glucose",
      "Monitor serum calcium levels at 6, 24, and 48 hours (risk of hypocalcemia)",
      "Order serum bilirubin if jaundice develops; monitor with transcutaneous bilirubinometry",
      "Monitor CBC and hematocrit for polycythemia (Hct >65%)",
      "Assess echocardiogram if murmur detected or signs of cardiomyopathy present",
      "Monitor respiratory status continuously: pulse oximetry, respiratory rate, work of breathing"
    ],
    management: [
      "Initiate early feeding within 30 minutes of birth and feed every 2-3 hours",
      "Administer IV dextrose (D10W bolus 2 mL/kg followed by continuous infusion 6-8 mg/kg/min) for glucose <25 mg/dL in first 4 hours or <35 mg/dL after 4 hours",
      "Titrate glucose infusion rate (GIR) based on serial glucose checks; target glucose >45 mg/dL",
      "Wean IV dextrose gradually to prevent rebound hypoglycemia as oral feeds are established",
      "Implement thermoregulation strategies: skin-to-skin contact, radiant warmer, pre-warmed blankets",
      "Manage polycythemia: ensure adequate hydration; partial exchange transfusion if Hct >70% with symptoms",
      "Initiate phototherapy for hyperbilirubinemia per hour-specific bilirubin nomogram",
      "Provide respiratory support as needed: supplemental oxygen, CPAP, or mechanical ventilation for RDS"
    ],
    nursingActions: [
      "Implement standardized neonatal hypoglycemia screening protocol with documented action thresholds",
      "Assess feeding effectiveness at each session: latch quality, duration, audible swallowing",
      "Calculate glucose infusion rate (GIR) accurately: GIR = (% dextrose × rate mL/hr) / (6 × weight kg)",
      "Perform comprehensive newborn assessment: head-to-toe evaluation including birth injury screening",
      "Assess for Erb palsy: asymmetric Moro reflex, arm held in waiter's tip position",
      "Assess for clavicle fracture: crepitus, asymmetric movement, swelling",
      "Monitor for signs of cardiac involvement: murmur, tachypnea, poor perfusion, cardiomegaly on CXR",
      "Educate parents on hypoglycemia signs, feeding importance, and follow-up requirements"
    ],
    signs: {
      left: [
        "Macrosomia (LGA)",
        "Plethoric, round (cushingoid) facies",
        "Cardiomegaly and hepatomegaly",
        "Increased subcutaneous fat",
        "Shoulder dystocia history",
        "Birth injuries (clavicle fracture, Erb palsy)"
      ],
      right: [
        "Hypoglycemia: jitteriness, tremors, poor feeding, lethargy, seizures",
        "Hypocalcemia: jitteriness, irritability, seizures (often overlaps with hypoglycemia presentation)",
        "Respiratory distress syndrome: tachypnea, grunting, nasal flaring, retractions",
        "Polycythemia: plethora, cyanosis, poor feeding, hyperviscosity",
        "Hyperbilirubinemia: jaundice, elevated bilirubin",
        "Hypertrophic cardiomyopathy: murmur, tachypnea, poor feeding"
      ]
    },
    medications: [
      { name: "Dextrose 10% IV (D10W)", type: "Glucose replacement", action: "Provides exogenous glucose to correct and maintain normoglycemia in the setting of persistent fetal hyperinsulinism", sideEffects: "Rebound hypoglycemia with abrupt discontinuation, IV infiltration with tissue necrosis (>12.5% dextrose requires central line)", contra: "No absolute contraindications in neonatal hypoglycemia", pearl: "Bolus: 2 mL/kg D10W IV push (200 mg/kg glucose). Continuous infusion: start at GIR 6-8 mg/kg/min. Recheck glucose 30 minutes after bolus and hourly during infusion. Wean by 1-2 mg/kg/min every 6-12 hours as glucose stabilizes." },
      { name: "Calcium Gluconate 10%", type: "Electrolyte replacement", action: "Replaces calcium in neonatal hypocalcemia resulting from impaired parathyroid function", sideEffects: "Bradycardia (administer slowly), tissue necrosis if extravasation occurs", contra: "Concurrent digitalis use (increased sensitivity)", pearl: "Administer IV slowly over 10-30 minutes with continuous cardiac monitoring. Monitor heart rate during infusion. Stop infusion if bradycardia develops. Check ionized calcium levels." }
    ],
    pearls: [
      "Insulin inhibits fetal surfactant production, making IDMs at higher risk for RDS even at term gestation",
      "Hypocalcemia in IDMs typically occurs at 24-72 hours of life due to functional hypoparathyroidism",
      "Polycythemia results from chronic intrauterine hypoxia stimulating fetal erythropoietin production",
      "Hypertrophic cardiomyopathy in IDMs is usually transient and resolves within 2-4 weeks as insulin levels normalize",
      "GIR calculation: (% dextrose × rate mL/hr) / (6 × weight kg) gives mg/kg/min of glucose delivery"
    ],
    quiz: [
      { question: "A newborn of a diabetic mother has a blood glucose of 22 mg/dL at 3 hours of life. The nurse should:", options: ["Encourage breastfeeding and recheck in 1 hour", "Administer D10W bolus 2 mL/kg IV and initiate continuous glucose infusion", "Apply a warm blanket and observe", "Wait for the routine 4-hour glucose check"], correct: 1, rationale: "Blood glucose <25 mg/dL in the first 4 hours of life requires IV dextrose intervention. A 2 mL/kg bolus of D10W followed by continuous infusion at 6-8 mg/kg/min is the standard treatment." },
      { question: "Why are newborns of diabetic mothers at increased risk for respiratory distress syndrome?", options: ["Maternal diabetes causes lung hyperplasia", "Fetal hyperinsulinism inhibits surfactant production", "Maternal antibodies attack fetal lung tissue", "Excessive amniotic fluid dilutes surfactant"], correct: 1, rationale: "Elevated fetal insulin levels inhibit the production of surfactant phospholipids, particularly phosphatidylglycerol, making IDMs more susceptible to RDS even at term gestation." },
      { question: "The nurse is weaning IV dextrose in a stabilized IDM. Which practice prevents rebound hypoglycemia?", options: ["Discontinue the infusion abruptly once glucose is >50 mg/dL", "Decrease the GIR by 1-2 mg/kg/min every 6-12 hours while advancing oral feeds", "Switch to D50W for more concentrated glucose delivery", "Reduce feeding frequency to decrease insulin production"], correct: 1, rationale: "Gradual weaning of IV dextrose by 1-2 mg/kg/min every 6-12 hours, while simultaneously advancing oral feeds, prevents rebound hypoglycemia from the ongoing hyperinsulinemic state." }
    ]
  },

  "newborn-diabetic-mother-np": {
    title: "Newborn of Diabetic Mother",
    cellular: {
      title: "Metabolic Pathophysiology of the Infant of a",
      content: "The infant of a diabetic mother (IDM) represents a clinical model of fetal programming and in utero metabolic disease. Chronic maternal hyperglycemia drives fetal beta-cell hyperplasia through the Pedersen hypothesis: maternal glucose crosses the placenta, stimulating fetal insulin secretion. Insulin acts as a fetal growth hormone, promoting anabolic pathways including glycogenesis, lipogenesis, and protein synthesis, resulting in macrosomia and organomegaly. At birth, abrupt cessation of transplacental glucose delivery combined with persistent hyperinsulinism produces severe hypoglycemia within 1-4 hours. The metabolic cascade extends beyond glucose: insulin suppresses fetal parathyroid hormone (causing hypocalcemia at 24-72 hours), chronic fetal hypoxia from placental insufficiency stimulates erythropoietin (causing polycythemia and subsequent hyperbilirubinemia), and insulin antagonizes cortisol-mediated surfactant production (increasing RDS risk even at term). Hypertrophic cardiomyopathy occurs in 30% of IDMs from glycogen deposition in the interventricular septum, typically resolving within weeks as insulin levels normalize. The clinician prescribes glucose management protocols, manages the full metabolic panel, coordinates diagnostic evaluation, and guides the transition to outpatient follow-up."
    },
    riskFactors: [
      "Pre-gestational diabetes with HbA1c >6.5% in first trimester (congenital anomaly risk proportional to HbA1c)",
      "Gestational diabetes with poor glycemic control",
      "Maternal insulin requirements >100 units/day (marker of severe insulin resistance)",
      "Birth weight >4500g (highest risk for birth injury and metabolic complications)",
      "Preterm delivery (reduced glycogen stores, immature gluconeogenic enzymes, inadequate surfactant)",
      "Shoulder dystocia during delivery (brachial plexus injury, clavicle fracture)",
      "Maternal vascular disease (SGA paradox: growth restriction from uteroplacental insufficiency)"
    ],
    diagnostics: [
      "Prescribe structured glucose monitoring protocol: 1, 2, 4, 8, 12, 24 hours; extend to 48 hours if values remain unstable",
      "Confirm point-of-care glucose <40 mg/dL with serum glucose; differentiate from erroneous capillary values",
      "Order ionized calcium at 6, 24, and 48 hours (more accurate than total calcium in neonates)",
      "Order serum magnesium if hypocalcemia is refractory to calcium supplementation",
      "Order CBC with peripheral smear and reticulocyte count: evaluate for polycythemia (central venous Hct >65%)",
      "Order total and direct bilirubin at 24 hours and per hour-specific nomogram",
      "Order echocardiogram if murmur, cardiomegaly on CXR, or signs of poor cardiac output (hypertrophic cardiomyopathy in 30% of IDMs)",
      "Evaluate for congenital anomalies: cardiac (VSD, transposition), neural tube defects, caudal regression syndrome, renal anomalies"
    ],
    management: [
      "Prescribe D10W bolus 2 mL/kg (200 mg/kg glucose) for symptomatic hypoglycemia or glucose <25 mg/dL in first 4 hours, <35 mg/dL after 4 hours",
      "Initiate continuous D10W infusion at GIR 6-8 mg/kg/min; titrate to maintain glucose 45-60 mg/dL",
      "Advance to D12.5% or higher concentration via central access if peripheral GIR is insufficient (GIR >12 mg/kg/min suggests hyperinsulinism workup needed)",
      "For persistent hypoglycemia >48 hours despite GIR >12-15: consider diazoxide 5-15 mg/kg/day PO divided BID-TID (opens KATP channels to suppress insulin release)",
      "Prescribe calcium gluconate 10% IV 100-200 mg/kg (1-2 mL/kg) over 10-30 minutes with cardiac monitoring for symptomatic hypocalcemia",
      "Manage polycythemia: IV hydration for asymptomatic Hct 65-70%; partial exchange transfusion with normal saline for symptomatic Hct >70%",
      "Order phototherapy per AAP guidelines for hyperbilirubinemia; consider intensive phototherapy if approaching exchange transfusion thresholds",
      "Manage RDS: surfactant replacement therapy for confirmed surfactant deficiency; CPAP or mechanical ventilation as indicated"
    ],
    nursingActions: [
      "Develop and implement unit-based hypoglycemia management algorithm with clear thresholds for feeding vs. IV intervention",
      "Calculate and verify GIR at each infusion rate change: GIR = (% dextrose × rate mL/hr) / (6 × weight kg)",
      "Order critical sample during hypoglycemia episode if persistent: insulin, cortisol, growth hormone, C-peptide, free fatty acids, beta-hydroxybutyrate",
      "Screen for congenital heart disease: pre- and post-ductal pulse oximetry, auscultation, CXR if indicated",
      "Assess for caudal regression syndrome (lumbosacral agenesis) in IDMs of poorly controlled type 1 diabetic mothers",
      "Coordinate lactation consultation for breastfeeding support and supplemental feeding plan",
      "Plan follow-up: glucose monitoring beyond discharge if needed, bilirubin recheck, cardiac follow-up if cardiomyopathy identified",
      "Counsel parents on long-term metabolic risks for IDMs: childhood obesity, insulin resistance, type 2 diabetes"
    ],
    signs: {
      left: [
        "Macrosomia with organomegaly (cardiomegaly, hepatomegaly)",
        "Cushingoid facies with increased subcutaneous fat",
        "Plethoric appearance (polycythemia)",
        "Birth injuries: Erb palsy, clavicle fracture",
        "Hypertrophic interventricular septum on echo",
        "Congenital anomalies (cardiac, neural tube, renal, caudal regression)"
      ],
      right: [
        "Hypoglycemia: jitteriness, tremors, apnea, seizures, coma",
        "Hypocalcemia: jitteriness, tetany, prolonged QTc, seizures",
        "Respiratory distress syndrome: tachypnea, grunting, retractions, cyanosis",
        "Polycythemia/hyperviscosity: plethora, poor feeding, respiratory distress, hyperbilirubinemia",
        "Hypertrophic cardiomyopathy: poor feeding, tachypnea, systolic murmur, outflow obstruction",
        "Renal vein thrombosis (from polycythemia): hematuria, flank mass, thrombocytopenia"
      ]
    },
    medications: [
      { name: "Dextrose 10% IV (D10W)", type: "Glucose replacement", action: "Provides continuous exogenous glucose to overcome hyperinsulinism-driven hypoglycemia", sideEffects: "Rebound hypoglycemia if weaned too rapidly, peripheral line infiltration, osmotic injury with concentrations >12.5% via peripheral IV", contra: "None (emergency treatment for neonatal hypoglycemia)", pearl: "Bolus 2 mL/kg D10W delivers 200 mg/kg glucose. Start GIR 6-8 mg/kg/min. If GIR >12 mg/kg/min required, obtain central access and initiate hyperinsulinism workup. Wean by 1-2 mg/kg/min every 6-12 hours." },
      { name: "Diazoxide", type: "Potassium channel opener", action: "Opens ATP-sensitive potassium channels on pancreatic beta cells, suppressing insulin secretion", sideEffects: "Fluid retention, hypertrichosis, hyperuricemia, hyperglycemia", contra: "Functional hypoglycemia, allergy to thiazide diuretics", pearl: "Used for persistent hyperinsulinemic hypoglycemia unresponsive to IV glucose (GIR >15 mg/kg/min). Dose: 5-15 mg/kg/day divided BID-TID. Often combined with chlorothiazide to offset fluid retention. Response confirms KATP-sensitive mechanism." },
      { name: "Calcium Gluconate 10%", type: "Electrolyte replacement", action: "Replaces ionized calcium in neonatal hypocalcemia due to functional hypoparathyroidism", sideEffects: "Bradycardia (administer slowly with cardiac monitoring), tissue necrosis with extravasation, arrhythmias", contra: "Digoxin use (potentiates toxicity), hypercalcemia", pearl: "Dose: 100-200 mg/kg (1-2 mL/kg of 10% solution) IV slow push over 10-30 minutes. Continuous cardiac monitoring mandatory. Stop infusion for HR <100 bpm. Do not mix with sodium bicarbonate (precipitates)." },
      { name: "Surfactant (Beractant)", type: "Lung surfactant replacement", action: "Replaces deficient endogenous surfactant in alveoli, reducing surface tension and preventing alveolar collapse", sideEffects: "Transient oxygen desaturation, bradycardia during administration, pulmonary hemorrhage", contra: "None (lifesaving for neonatal RDS)", pearl: "IDMs may require surfactant even at term gestation due to insulin-mediated suppression of surfactant production. Administer via endotracheal tube. Response should be rapid with improved compliance and oxygenation." }
    ],
    pearls: [
      "The Pedersen hypothesis: maternal hyperglycemia → fetal hyperglycemia → fetal hyperinsulinism → macrosomia, organomegaly, and metabolic complications",
      "GIR requirement >12-15 mg/kg/min strongly suggests persistent hyperinsulinism requiring further workup (critical sample, genetic testing for KATP channel mutations)",
      "Caudal regression syndrome (sacral agenesis) is the most specific congenital anomaly associated with maternal diabetes, though rare",
      "Hypertrophic cardiomyopathy in IDMs is transient and usually resolves within 2-4 weeks as insulin levels normalize; avoid inotropes (may worsen outflow obstruction)",
      "IDMs have long-term metabolic programming: increased risk of childhood obesity, metabolic syndrome, and type 2 diabetes; counsel parents about healthy lifestyle practices"
    ],
    quiz: [
      { question: "An IDM requires a GIR of 16 mg/kg/min to maintain normoglycemia at 36 hours of life. The clinician should:", options: ["Continue current management and observe", "Obtain a critical sample (insulin, C-peptide, cortisol, FFA) and initiate hyperinsulinism workup", "Increase enteral feeds and wean IV glucose", "Switch to D5W to reduce glucose delivery"], correct: 1, rationale: "GIR requirement >12-15 mg/kg/min beyond 48 hours is abnormal and suggests persistent hyperinsulinemic hypoglycemia requiring a critical sample during hypoglycemia and evaluation for congenital hyperinsulinism (KATP channel mutations)." },
      { question: "Which congenital anomaly is most specifically associated with poorly controlled maternal diabetes?", options: ["Cleft lip and palate", "Caudal regression syndrome", "Down syndrome", "Pyloric stenosis"], correct: 1, rationale: "Caudal regression syndrome (sacral agenesis) is the most specific congenital anomaly associated with maternal diabetes, though it is rare. The risk of congenital anomalies is directly proportional to the degree of hyperglycemia during organogenesis (first trimester HbA1c)." },
      { question: "An IDM develops hypertrophic cardiomyopathy with left ventricular outflow tract obstruction. Why should inotropes be avoided?", options: ["They are not available in neonatal formulations", "Increased contractility worsens dynamic outflow obstruction", "They cause hyperglycemia in neonates", "They are contraindicated with phototherapy"], correct: 1, rationale: "In hypertrophic cardiomyopathy with outflow obstruction, inotropic agents increase contractility and worsen the dynamic obstruction. Management is supportive with volume expansion and beta-blockers if symptomatic. The condition is transient and resolves as insulin levels normalize." }
    ]
  }
};
