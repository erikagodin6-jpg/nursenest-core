import type { LessonContent } from "./types";

export const rpnPathoNeurologyLessons: Record<string, LessonContent> = {
  "rpn-febrile-seizures": {
    title: "Febrile Seizures",
    cellular: {
      title: "Temperature-Dependent Neuronal Hyperexcitability",
      content: "Febrile seizures are the most common seizure disorder in childhood, affecting 2-5% of children between 6 months and 5 years of age. They are provoked by fever (temperature ≥38°C) in the absence of central nervous system infection, metabolic disturbance, or history of afebrile seizures. The pathophysiology involves the immature developing brain's heightened susceptibility to temperature-related changes in neuronal excitability. The pediatric brain has a lower seizure threshold than the adult brain due to several developmental factors: incomplete myelination reduces the speed and efficiency of inhibitory circuits, GABA-A receptor subunit composition in the immature brain paradoxically produces excitatory rather than inhibitory responses in some regions, and the ratio of excitatory (glutamate) to inhibitory (GABA) neurotransmission is higher in the developing brain. When body temperature rises rapidly, several mechanisms lower the seizure threshold further: increased metabolic rate in neurons accelerates ion channel kinetics, fever-associated cytokines (particularly interleukin-1β) directly enhance neuronal excitability by modulating NMDA receptor function and reducing inhibitory GABAergic transmission, and hyperthermia increases the release of excitatory neurotransmitters. The rate of temperature rise appears more important than the absolute temperature — seizures often occur during the rapid ascent phase, sometimes before parents even realize the child is febrile. Febrile seizures are classified as simple (80% of cases: generalized tonic-clonic, lasting <15 minutes, occurs once in 24 hours, no focal features) or complex (focal features, lasting >15 minutes, recurring within 24 hours, or occurring with Todd paralysis). Simple febrile seizures carry an excellent prognosis: no increased risk of epilepsy (risk remains at general population level of ~1%), no cognitive impairment, and no need for chronic antiepileptic treatment. Complex febrile seizures carry a slightly increased risk of later epilepsy (~4-6%). The recurrence risk after a first febrile seizure is approximately 30-35%, higher in children under 18 months at first episode."
    },
    riskFactors: [
      "Age 6 months to 5 years (peak incidence 12-18 months)",
      "Family history of febrile seizures (genetic predisposition — 25-40% have affected first-degree relative)",
      "Rapid rise in temperature (rate of increase more important than peak temperature)",
      "Viral infections (most common trigger — upper respiratory infections, roseola, influenza)",
      "Recent immunization (particularly MMR and DTaP — small transient increase in risk)",
      "Male sex (slightly higher incidence)",
      "Iron deficiency (some studies suggest association)"
    ],
    diagnostics: [
      "Clinical diagnosis based on age, fever, and seizure characteristics — no routine laboratory workup for simple febrile seizures",
      "Temperature assessment to document fever",
      "Assess for source of fever (physical examination for infection)",
      "Lumbar puncture ONLY if meningitis is suspected (not routine for simple febrile seizures in well-appearing child >18 months)",
      "Consider LP in children <12 months (meningeal signs may be absent), unvaccinated children, or those on antibiotics",
      "EEG and neuroimaging NOT indicated for simple febrile seizures"
    ],
    management: [
      "During seizure: protect airway, position on side (recovery position), do NOT restrain or insert anything into mouth",
      "Time the seizure — call emergency services if >5 minutes",
      "Administer rectal diazepam or intranasal midazolam as prescribed for prolonged seizures (>5 min)",
      "Treat the underlying fever source (antibiotics if bacterial infection identified)",
      "Antipyretics (acetaminophen, ibuprofen) for comfort — but do NOT prevent recurrence",
      "NO chronic antiepileptic drugs for simple febrile seizures",
      "Reassure parents: simple febrile seizures are benign and do NOT cause brain damage or epilepsy"
    ],
    nursingActions: [
      "During seizure: maintain airway, position on side, time the seizure, note seizure characteristics",
      "Clear area of hazards, loosen restrictive clothing, do NOT restrain",
      "Do NOT insert anything into the mouth (tongue blade, fingers)",
      "Monitor vital signs and oxygen saturation during and after seizure",
      "Assess post-ictal state: LOC, orientation, motor function",
      "Identify and treat fever source — perform comprehensive assessment",
      "Provide extensive parental education and reassurance (parents are terrified)",
      "Teach seizure first aid to parents: side position, timing, when to call 911 (>5 min or breathing difficulty)"
    ],
    assessmentFindings: [
      "Generalized tonic-clonic activity (simple) or focal onset (complex)",
      "Loss of consciousness during seizure",
      "Post-ictal drowsiness and confusion (normal, resolves within 30-60 minutes)",
      "Fever ≥38°C (may be the first sign of illness — parents may not know child is sick)",
      "Signs of underlying infection (URI symptoms, otitis media, pharyngitis)"
    ],
    signs: {
      left: ["Fever ≥38°C", "Generalized tonic-clonic activity", "Loss of consciousness", "Duration <15 min (simple)"],
      right: ["Post-ictal drowsiness", "Age 6 months-5 years", "Rapid temperature rise", "Normal neuro exam after"]
    },
    medications: [
      { name: "Diazepam Rectal Gel (Diastat)", type: "Benzodiazepine (Rescue Medication)", action: "Enhances GABA-A receptor activity, rapidly terminating seizure activity", sideEffects: "Respiratory depression, sedation, ataxia", contra: "Respiratory compromise, acute narrow-angle glaucoma", pearl: "Prescribed for home use by parents for seizures lasting >5 minutes. TEACH parents proper administration and when to call 911." },
      { name: "Acetaminophen", type: "Antipyretic/Analgesic", action: "Inhibits central prostaglandin synthesis, reducing fever set point in hypothalamus", sideEffects: "Hepatotoxicity with overdose", contra: "Severe liver disease", pearl: "Treats fever for COMFORT but does NOT prevent febrile seizures — this is critical parent teaching. Dose by weight, not age." },
      { name: "Midazolam Intranasal", type: "Benzodiazepine (Rescue Medication)", action: "Rapid-onset GABA-A potentiation via intranasal absorption; terminates prolonged seizures", sideEffects: "Respiratory depression, sedation, nasal irritation", contra: "Respiratory compromise", pearl: "Faster onset than rectal diazepam. Increasingly preferred rescue medication for home and prehospital use." }
    ],
    pearls: [
      "Simple febrile seizures are BENIGN — they do NOT cause brain damage, intellectual disability, or epilepsy",
      "Antipyretics treat fever for COMFORT but do NOT prevent febrile seizures — teach parents this critical point",
      "Rate of temperature rise matters more than peak temperature — seizures often occur before parents know child is febrile",
      "The most important nursing intervention during a seizure is AIRWAY management and TIMING — nothing in the mouth",
      "Parents are terrified — they often think their child is dying. Calm, clear education and reassurance is essential",
      "After first simple febrile seizure: 30-35% recurrence risk, but NO chronic antiepileptic treatment indicated"
    ],
    quiz: [
      { question: "A parent asks if giving acetaminophen around the clock will prevent febrile seizures. How should the nurse respond?", options: ["Yes, keeping the temperature down will prevent seizures", "Antipyretics treat fever for comfort but have NOT been shown to prevent febrile seizures", "Only ibuprofen prevents febrile seizures, not acetaminophen", "Alternating acetaminophen and ibuprofen will prevent recurrence"], correct: 1, rationale: "Multiple studies have demonstrated that antipyretics, while helpful for comfort, do NOT reduce the recurrence of febrile seizures. The rate of temperature rise and individual seizure threshold are the determining factors, and antipyretics cannot consistently prevent rapid temperature rises during acute illness." },
      { question: "What is the nurse's priority action during an active febrile seizure?", options: ["Insert a padded tongue blade to prevent tongue biting", "Restrain the child to prevent injury", "Maintain airway patency, position on side, and time the seizure", "Administer acetaminophen immediately"], correct: 2, rationale: "During any seizure, the priorities are airway management (side-lying/recovery position to prevent aspiration), safety (clear hazards, do not restrain), and timing the seizure (prolonged seizures >5 minutes require rescue medication). Nothing should be placed in the mouth." }
    ]
  },

  "rpn-meningitis": {
    title: "Meningitis",
    cellular: {
      title: "Meningeal Inflammation and CSF Infection",
      content: "Meningitis is inflammation of the meninges — the protective membranes (dura mater, arachnoid mater, and pia mater) surrounding the brain and spinal cord — and the cerebrospinal fluid (CSF) within the subarachnoid space. Bacterial meningitis is a medical emergency with mortality rates of 15-30% even with treatment, while viral meningitis is generally self-limiting. The pathophysiology of bacterial meningitis begins when organisms (most commonly Streptococcus pneumoniae and Neisseria meningitidis in adults, and Group B Streptococcus, E. coli, and Listeria in neonates) gain access to the CSF. Bacteria typically reach the meninges through hematogenous spread (bacteremia from a distant infection such as pneumonia or otitis media), direct extension (from sinusitis, mastoiditis, or skull fracture), or along neural pathways. Once bacteria enter the CSF — an immunologically privileged space with minimal antibodies, complement, and phagocytic cells — they proliferate rapidly. Bacterial cell wall components (lipopolysaccharide from gram-negatives, lipoteichoic acid from gram-positives) trigger a massive inflammatory cascade by activating toll-like receptors on resident macrophages and microglia. This releases pro-inflammatory cytokines (TNF-α, IL-1β, IL-6) that recruit neutrophils across the blood-brain barrier (BBB), cause BBB breakdown (increasing permeability), and produce vasogenic and cytotoxic cerebral edema. Cerebral edema elevates intracranial pressure (ICP), reducing cerebral perfusion and causing neuronal ischemia. Inflammation of cerebral blood vessels (vasculitis) can cause focal ischemic infarction. CSF analysis in bacterial meningitis reveals elevated opening pressure, elevated WBC with neutrophilic predominance, elevated protein (from BBB breakdown), and markedly decreased glucose (<40% of serum level, as bacteria and neutrophils consume glucose). Complications include seizures (20-30%), cranial nerve palsies (particularly CN VIII causing hearing loss), hydrocephalus, cerebral herniation, septic shock (particularly with meningococcal meningitis and associated DIC and adrenal hemorrhage — Waterhouse-Friderichsen syndrome), and long-term neurological deficits."
    },
    riskFactors: [
      "Extremes of age (<2 years and >60 years)",
      "Immunocompromised state (HIV, splenectomy, immunosuppressive therapy)",
      "Close-quarters living (college dormitories, military barracks, daycare)",
      "Lack of vaccination (meningococcal, pneumococcal, Hib vaccines)",
      "CSF leak (skull fracture, post-neurosurgical, congenital defect)",
      "Cochlear implants (increased risk of pneumococcal meningitis)",
      "Recent upper respiratory or ear infection",
      "Complement deficiencies (increase susceptibility to Neisseria)"
    ],
    diagnostics: [
      "Lumbar puncture with CSF analysis (GOLD STANDARD): opening pressure, WBC with differential, glucose, protein, Gram stain, culture",
      "Bacterial CSF: cloudy appearance, elevated WBC (neutrophilic), elevated protein, LOW glucose, positive Gram stain/culture",
      "Viral CSF: clear appearance, elevated WBC (lymphocytic), mildly elevated protein, NORMAL glucose, negative Gram stain",
      "Blood cultures (obtain BEFORE antibiotics if possible, but do NOT delay antibiotics)",
      "CT scan BEFORE LP if focal neurological deficits, papilledema, altered LOC, or immunocompromised (rule out mass lesion/herniation risk)",
      "CBC, CRP, procalcitonin (elevated in bacterial infection)"
    ],
    management: [
      "MEDICAL EMERGENCY — empiric IV antibiotics IMMEDIATELY (do NOT wait for CSF results)",
      "Empiric antibiotic therapy: ceftriaxone + vancomycin ± ampicillin (for Listeria coverage in age >50, immunocompromised, or neonates)",
      "Dexamethasone before or with first dose of antibiotics (reduces inflammatory complications, especially hearing loss with pneumococcal meningitis)",
      "Seizure precautions",
      "ICP management: elevate HOB 30°, avoid neck flexion, monitor neurological status",
      "Droplet precautions for suspected meningococcal meningitis until 24 hours of effective antibiotics",
      "Close contact prophylaxis for meningococcal meningitis (rifampin, ciprofloxacin, or ceftriaxone)"
    ],
    nursingActions: [
      "Implement droplet precautions immediately for suspected bacterial meningitis",
      "Administer antibiotics as soon as ordered — time to antibiotics directly affects survival",
      "Perform neurological assessments frequently: LOC, pupil reactivity, cranial nerve function",
      "Monitor for signs of increased ICP: headache, vomiting, altered LOC, Cushing triad (hypertension, bradycardia, irregular respirations)",
      "Maintain quiet, dimly lit environment (photophobia and noise sensitivity)",
      "Monitor I&O — SIADH can complicate meningitis causing fluid retention and hyponatremia",
      "Assess for petechial/purpuric rash (hallmark of meningococcal disease — may progress to DIC)",
      "Educate close contacts about chemoprophylaxis and vaccination"
    ],
    assessmentFindings: [
      "Classic triad: headache, fever, nuchal rigidity (neck stiffness) — present in only ~45% of adults",
      "Altered level of consciousness",
      "Photophobia (light sensitivity)",
      "Kernig sign: resistance and pain with knee extension when hip is flexed to 90°",
      "Brudzinski sign: involuntary flexion of hips/knees when neck is passively flexed",
      "Petechial or purpuric rash (meningococcal — can progress rapidly to purpura fulminans)",
      "Neonates/infants: bulging fontanelle, high-pitched cry, poor feeding, irritability (may lack classic meningeal signs)"
    ],
    signs: {
      left: ["Headache", "Fever", "Nuchal rigidity", "Photophobia"],
      right: ["Kernig sign positive", "Brudzinski sign positive", "Petechial rash (meningococcal)", "Altered LOC"]
    },
    medications: [
      { name: "Ceftriaxone", type: "Third-Generation Cephalosporin", action: "Bactericidal — binds penicillin-binding proteins (PBPs) inhibiting bacterial cell wall synthesis; excellent CSF penetration", sideEffects: "Diarrhea, hypersensitivity, biliary sludging", contra: "Severe penicillin allergy (cross-reactivity ~1-2%), neonates with hyperbilirubinemia (displaces bilirubin)", pearl: "Mainstay of empiric meningitis therapy. Excellent gram-negative coverage including N. meningitidis and most S. pneumoniae." },
      { name: "Vancomycin", type: "Glycopeptide Antibiotic", action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala terminal of peptidoglycan precursors; covers resistant S. pneumoniae", sideEffects: "Red man syndrome (histamine release if infused too fast — not an allergy), nephrotoxicity, ototoxicity", contra: "Oral form not effective for systemic infections (poor absorption)", pearl: "Added empirically to cover penicillin-resistant pneumococci. Infuse over ≥60 minutes to prevent red man syndrome. Monitor trough levels and renal function." },
      { name: "Dexamethasone", type: "Corticosteroid (Adjunctive)", action: "Reduces CNS inflammation and cerebral edema; decreases BBB permeability; reduces hearing loss risk in pneumococcal meningitis", sideEffects: "Hyperglycemia, GI bleeding, immunosuppression", contra: "Active untreated infections at other sites", pearl: "Give BEFORE or WITH the first dose of antibiotics — effectiveness is lost if given after antibiotics. Most evidence supports use in adults with pneumococcal meningitis." }
    ],
    pearls: [
      "Bacterial meningitis = MEDICAL EMERGENCY. Antibiotics within 1 HOUR — every minute of delay increases mortality and morbidity",
      "Do NOT delay antibiotics to obtain LP — if LP is delayed (need CT first), give antibiotics FIRST",
      "Kernig and Brudzinski signs are SPECIFIC but not SENSITIVE — their absence does NOT rule out meningitis",
      "Petechial rash + fever + meningeal signs = meningococcal meningitis until proven otherwise — initiate droplet precautions immediately",
      "Neonates may present with only irritability, poor feeding, and bulging fontanelle — classic meningeal signs are often absent",
      "Dexamethasone is given BEFORE or WITH antibiotics — it reduces hearing loss (most common long-term complication)"
    ],
    quiz: [
      { question: "A client is suspected of having bacterial meningitis but a CT scan is needed before LP due to papilledema. What should the nurse anticipate?", options: ["Wait for CT results and LP before administering any antibiotics", "Administer empiric antibiotics IMMEDIATELY before the CT scan — do not delay treatment", "Administer only dexamethasone and wait for LP results", "Send the patient for CT and defer antibiotic therapy to the ICU team"], correct: 1, rationale: "In bacterial meningitis, every hour of antibiotic delay increases mortality. If LP must be delayed (for CT to rule out mass lesion/herniation risk), blood cultures should be drawn and empiric antibiotics administered immediately. LP can be performed later — it may still show CSF abnormalities even after antibiotics." },
      { question: "Which CSF finding is most consistent with bacterial meningitis?", options: ["Clear CSF with lymphocytic predominance and normal glucose", "Cloudy CSF with neutrophilic predominance, elevated protein, and decreased glucose", "Normal CSF in all parameters", "Bloody CSF with elevated RBCs"], correct: 1, rationale: "Bacterial meningitis CSF findings include cloudy/turbid appearance, elevated WBC with neutrophilic predominance, elevated protein (from BBB breakdown), and decreased glucose (consumed by bacteria and neutrophils). Viral meningitis shows lymphocytic predominance with normal glucose." }
    ]
  },

  "rpn-parkinson-disease": {
    title: "Parkinson Disease",
    cellular: {
      title: "Dopaminergic Neurodegeneration in the Substantia Nigra",
      content: "Parkinson disease (PD) is a chronic progressive neurodegenerative disorder resulting from the selective loss of dopaminergic neurons in the substantia nigra pars compacta (SNpc) of the midbrain. The substantia nigra is a critical component of the basal ganglia circuitry that modulates voluntary movement, and its dopaminergic neurons project to the striatum (caudate nucleus and putamen) via the nigrostriatal pathway. Normally, dopamine released in the striatum facilitates movement initiation, movement execution smoothness, and postural stability through a balanced interaction between the direct (facilitatory) and indirect (inhibitory) motor pathways. In PD, the progressive death of SNpc neurons — driven by accumulation of misfolded alpha-synuclein protein aggregates (Lewy bodies), mitochondrial dysfunction, oxidative stress, and neuroinflammation — depletes striatal dopamine. By the time motor symptoms appear, approximately 60-80% of dopaminergic neurons have been lost, reflecting a long preclinical period. The dopamine-acetylcholine balance in the striatum is disrupted: with dopamine depleted, the relative excess of acetylcholine (an excitatory neurotransmitter in the striatum) further impairs the direct pathway and over-activates the indirect pathway, producing the cardinal motor features. The four cardinal motor features are: (1) Resting tremor — 'pill-rolling' tremor that occurs at rest and diminishes with intentional movement, caused by rhythmic oscillation in thalamocortical circuits deprived of dopaminergic modulation; (2) Rigidity — increased resistance to passive movement ('cogwheel rigidity' when combined with tremor, 'lead-pipe rigidity' when smooth), from loss of dopamine-mediated inhibition of muscle tone; (3) Bradykinesia — slowness and poverty of movement, the most disabling feature, resulting from insufficient dopamine to facilitate motor program initiation and execution; (4) Postural instability — impaired balance and righting reflexes, appearing in later stages. Non-motor symptoms (often preceding motor symptoms by years) include anosmia, constipation, REM sleep behavior disorder, depression, and cognitive decline. The progression is relentless — medications provide symptomatic relief but do not halt neurodegeneration."
    },
    riskFactors: [
      "Age >60 years (strongest risk factor — prevalence increases with age)",
      "Male sex (1.5:1 male-to-female ratio)",
      "Family history (5-10% of cases are familial with identified genetic mutations: LRRK2, SNCA, PARK2)",
      "Environmental exposures: pesticides (rotenone, paraquat), heavy metals, rural living",
      "Head trauma history",
      "Protective factors: caffeine consumption and smoking are inversely associated (NOT recommended as prevention)"
    ],
    diagnostics: [
      "Clinical diagnosis based on motor examination — no definitive diagnostic test exists",
      "Presence of at least 2 of 4 cardinal features (resting tremor, rigidity, bradykinesia, postural instability)",
      "Positive response to levodopa trial supports diagnosis",
      "MRI to exclude other causes (normal in PD, unlike other parkinsonisms)",
      "DaTscan (dopamine transporter imaging) may be used when diagnosis is uncertain",
      "Comprehensive neurological examination including gait assessment, postural stability testing"
    ],
    management: [
      "Levodopa/carbidopa is the GOLD STANDARD — most effective medication for motor symptoms",
      "Dopamine agonists (pramipexole, ropinirole) for early disease or as adjunct",
      "MAO-B inhibitors (selegiline, rasagiline) for early mild disease or adjunct therapy",
      "Physical therapy, occupational therapy, speech therapy (essential multidisciplinary approach)",
      "Fall prevention strategies (postural instability = high fall risk)",
      "Swallowing assessment (dysphagia → aspiration pneumonia is a leading cause of death)",
      "Deep brain stimulation (DBS) for advanced disease with motor fluctuations refractory to medication"
    ],
    nursingActions: [
      "Administer levodopa/carbidopa ON TIME — timing is critical for symptom control",
      "Assess motor function: tremor severity, gait, balance, bradykinesia, ability to perform ADLs",
      "Implement fall prevention: clear pathways, assistive devices, non-slip footwear, adequate lighting",
      "Allow extra time for activities — rushing increases frustration and fall risk",
      "Assess swallowing function — position upright during meals, thickened liquids if ordered, small bites",
      "Monitor for medication side effects: dyskinesia, orthostatic hypotension, hallucinations, nausea",
      "Encourage exercise and physical therapy — shown to improve mobility and quality of life",
      "Assess for depression and cognitive changes — screen regularly, refer as needed"
    ],
    assessmentFindings: [
      "Resting tremor ('pill-rolling') — worse at rest, diminishes with intentional movement",
      "Cogwheel rigidity (ratchety resistance to passive ROM)",
      "Bradykinesia (slow movement, shuffling gait, reduced arm swing, masked facies, micrographia)",
      "Postural instability (positive pull test — cannot correct balance when pulled backward)",
      "Shuffling, festinating gait (short steps with progressive acceleration, difficulty stopping)",
      "Masked facies (reduced facial expression, infrequent blinking)",
      "Hypophonia (soft, monotone voice)",
      "Micrographia (progressively smaller handwriting)"
    ],
    signs: {
      left: ["Resting tremor (pill-rolling)", "Cogwheel rigidity", "Bradykinesia", "Shuffling gait"],
      right: ["Masked facies", "Postural instability", "Hypophonia", "Micrographia"]
    },
    medications: [
      { name: "Levodopa/Carbidopa (Sinemet)", type: "Dopamine Precursor + Decarboxylase Inhibitor", action: "Levodopa crosses the BBB and is converted to dopamine by DOPA decarboxylase in the brain; carbidopa prevents peripheral conversion, reducing side effects and increasing CNS availability", sideEffects: "Nausea, orthostatic hypotension, dyskinesia (involuntary movements — long-term), on-off phenomenon, vivid dreams, hallucinations", contra: "Concurrent non-selective MAOIs, narrow-angle glaucoma, melanoma (theoretical)", pearl: "GOLD STANDARD for PD. Take on empty stomach for best absorption (protein competes for transport). Timing is critical — give ON TIME. Long-term use causes motor fluctuations (wearing off, on-off) and dyskinesia." },
      { name: "Pramipexole (Mirapex)", type: "Dopamine Agonist (D2/D3)", action: "Directly stimulates dopamine D2 and D3 receptors in the striatum, bypassing the need for endogenous dopamine synthesis", sideEffects: "Impulse control disorders (gambling, hypersexuality, compulsive shopping — MUST educate), somnolence, hallucinations, orthostatic hypotension, nausea", contra: "Severe renal impairment (renally cleared)", pearl: "Often used as initial monotherapy in younger patients to delay levodopa and its long-term complications. WARN about impulse control disorders — patients and families must monitor for behavioral changes." },
      { name: "Benztropine (Cogentin)", type: "Anticholinergic", action: "Blocks excessive cholinergic activity in the striatum, restoring dopamine-acetylcholine balance; primarily helps tremor and rigidity", sideEffects: "Dry mouth, constipation, urinary retention, blurred vision, confusion, cognitive impairment", contra: "Dementia, narrow-angle glaucoma, BPH (urinary retention risk), elderly (cognitive side effects)", pearl: "Primarily for tremor control. AVOID in elderly — high risk of confusion, cognitive impairment, falls. Monitor for urinary retention, especially in older men." }
    ],
    pearls: [
      "Cardinal features mnemonic: TRAP = Tremor (resting), Rigidity, Akinesia/bradykinesia, Postural instability",
      "Levodopa timing is CRITICAL — even 30-minute delays can cause breakthrough symptoms. Give ON TIME.",
      "Protein competes with levodopa for intestinal absorption and BBB transport — take on empty stomach or redistribute protein intake",
      "Aspiration pneumonia is a LEADING cause of death — assess swallowing at every visit",
      "Impulse control disorders with dopamine agonists: gambling, hypersexuality, compulsive eating/shopping — educate patient AND family",
      "Allow extra time for all activities — rushing a PD patient increases fall risk and frustration",
      "Exercise is therapeutic — studies show regular physical activity may slow disease progression"
    ],
    quiz: [
      { question: "A client on levodopa/carbidopa is experiencing involuntary writhing movements of the arms and face. What does this indicate?", options: ["Worsening Parkinson disease", "Levodopa-induced dyskinesia from long-term use", "Medication allergy", "Seizure activity"], correct: 1, rationale: "Dyskinesia (involuntary choreiform or writhing movements) is a well-known long-term complication of levodopa therapy, occurring in up to 50% of patients after 5 years. It results from pulsatile dopamine receptor stimulation and progressive loss of dopaminergic neurons." },
      { question: "Which nursing intervention is MOST important for a client with advanced Parkinson disease during mealtimes?", options: ["Encourage the client to eat quickly to prevent food from getting cold", "Assess swallowing function and position upright — dysphagia and aspiration risk are significant", "Serve only pureed foods regardless of swallowing assessment", "Allow the client to eat in a reclined position for comfort"], correct: 1, rationale: "Dysphagia is a major complication of PD, and aspiration pneumonia is a leading cause of death. Swallowing assessment should guide diet consistency. Upright positioning (90°), small bites, and adequate time reduce aspiration risk." }
    ]
  },

  "rpn-multiple-sclerosis": {
    title: "Multiple Sclerosis (MS)",
    cellular: {
      title: "Autoimmune Demyelination of the Central Nervous System",
      content: "Multiple sclerosis (MS) is a chronic autoimmune inflammatory disease of the central nervous system (CNS) characterized by multifocal demyelination, axonal injury, and neurodegeneration. The immune system attacks myelin — the lipid-rich insulating sheath produced by oligodendrocytes that wraps around axons in the CNS, enabling rapid saltatory conduction of nerve impulses along nodes of Ranvier. In MS, the autoimmune attack is primarily mediated by autoreactive CD4+ T-helper cells (particularly Th1 and Th17 subtypes) that cross the blood-brain barrier after peripheral activation. These T-cells recognize myelin antigens (myelin basic protein, myelin oligodendrocyte glycoprotein, proteolipid protein) presented by antigen-presenting cells within the CNS. Once in the CNS, they release pro-inflammatory cytokines (IFN-γ, TNF-α, IL-17) that recruit macrophages and activate microglia, which directly attack and strip myelin from axons. B-cells also play a critical role by producing antibodies against myelin components and acting as antigen-presenting cells. The areas of demyelination form discrete lesions called plaques, which can occur anywhere in the CNS white matter but have a predilection for the optic nerves, periventricular white matter, corpus callosum, brainstem, cerebellum, and spinal cord. When myelin is damaged, nerve impulse conduction slows dramatically or fails entirely (conduction block), producing the neurological deficits. Early in disease, remyelination can occur (though the new myelin is thinner and less efficient), and inflammation can resolve, leading to symptom improvement — this is the relapsing-remitting pattern. Over time, however, chronic demyelination leads to axonal degeneration and irreversible neuronal loss (secondary progressive phase), as demyelinated axons are more vulnerable to metabolic stress, excitotoxicity, and energy failure. The clinical presentation depends entirely on plaque location: optic neuritis (vision loss, eye pain), transverse myelitis (weakness, sensory changes below the lesion level, bowel/bladder dysfunction), cerebellar involvement (ataxia, intention tremor, nystagmus), brainstem lesions (diplopia, facial numbness, dysphagia), and cognitive impairment (affecting up to 65% of patients)."
    },
    riskFactors: [
      "Female sex (2-3:1 female-to-male ratio)",
      "Age 20-40 years at onset (most common onset age)",
      "Geographic latitude (higher prevalence farther from equator — vitamin D hypothesis)",
      "Northern European ancestry",
      "Family history (first-degree relative increases risk 20-40x)",
      "Vitamin D deficiency",
      "Epstein-Barr virus (EBV) infection (strong epidemiological association)",
      "Smoking (increases risk and accelerates progression)"
    ],
    diagnostics: [
      "MRI of brain and spinal cord: multiple hyperintense lesions on T2/FLAIR imaging (disseminated in space and time)",
      "Gadolinium-enhancing lesions indicate active inflammation",
      "CSF analysis: oligoclonal bands (present in >95% of MS), elevated IgG index",
      "Evoked potentials (visual, somatosensory, auditory) — may show slowed conduction",
      "McDonald criteria: clinical + MRI evidence of lesions disseminated in space AND time",
      "Comprehensive neurological examination documenting deficits"
    ],
    management: [
      "Disease-modifying therapies (DMTs): interferon-beta, glatiramer acetate, fingolimod, natalizumab, ocrelizumab — reduce relapse frequency and slow progression",
      "Acute relapse treatment: IV methylprednisolone (high-dose pulse therapy) to shorten exacerbation duration",
      "Symptomatic management: baclofen for spasticity, gabapentin for neuropathic pain, bladder management for urinary dysfunction",
      "Physical and occupational therapy (essential for maintaining function and independence)",
      "Avoid triggers that worsen symptoms: heat (Uhthoff phenomenon), fatigue, stress, infection",
      "Fatigue management: energy conservation, scheduled rest periods, amantadine or modafinil"
    ],
    nursingActions: [
      "Assess neurological status systematically: vision, strength, sensation, coordination, gait, cognition, bladder/bowel function",
      "Educate about disease course — relapsing-remitting vs progressive patterns",
      "Teach about heat avoidance (Uhthoff phenomenon: heat temporarily worsens symptoms by slowing conduction in demyelinated fibers)",
      "Implement fall prevention — spasticity, ataxia, and weakness increase fall risk",
      "Assist with energy conservation techniques — fatigue is the most common and disabling symptom",
      "Manage bladder dysfunction: timed voiding schedule, intermittent catheterization teaching if needed",
      "Monitor for medication side effects of DMTs (injection site reactions, flu-like symptoms, liver function with interferons)",
      "Provide emotional support — MS diagnosis at young age significantly impacts quality of life, relationships, and career"
    ],
    assessmentFindings: [
      "Optic neuritis: unilateral vision loss with eye pain (often first symptom)",
      "Sensory symptoms: numbness, tingling, 'pins and needles,' Lhermitte sign (electric shock down spine with neck flexion)",
      "Motor symptoms: weakness, spasticity, hyperreflexia, positive Babinski",
      "Cerebellar signs: intention tremor, scanning speech, ataxia, nystagmus",
      "Fatigue (most common symptom — present in 80% of patients, often most disabling)",
      "Bladder dysfunction: urgency, frequency, retention, incontinence",
      "Cognitive changes: impaired memory, processing speed, executive function",
      "Uhthoff phenomenon: symptom worsening with heat exposure (hot bath, exercise, fever)"
    ],
    signs: {
      left: ["Optic neuritis", "Sensory changes/numbness", "Spasticity/weakness", "Fatigue"],
      right: ["Lhermitte sign", "Cerebellar ataxia", "Bladder dysfunction", "Uhthoff phenomenon (heat worsening)"]
    },
    medications: [
      { name: "Interferon Beta-1a (Avonex, Rebif)", type: "Disease-Modifying Therapy (Immunomodulator)", action: "Modulates immune response by reducing T-cell activation, decreasing BBB permeability, and shifting cytokine profile from pro-inflammatory to anti-inflammatory", sideEffects: "Flu-like symptoms (common, especially initially — pretreat with acetaminophen/ibuprofen), injection site reactions, depression, hepatotoxicity, leukopenia", contra: "Decompensated liver disease, severe depression", pearl: "Reduces relapse rate by ~30%. Flu-like symptoms often diminish over time. Monitor LFTs and CBC. Teach injection technique and site rotation." },
      { name: "Methylprednisolone IV (Solu-Medrol)", type: "High-Dose Corticosteroid (Acute Relapse)", action: "Potent anti-inflammatory: reduces BBB permeability, decreases edema around plaques, and suppresses immune cell infiltration into CNS", sideEffects: "Insomnia, mood changes, hyperglycemia, GI irritation, immunosuppression, fluid retention", contra: "Active untreated infection, uncontrolled diabetes", pearl: "Given as pulse therapy (1 g IV daily for 3-5 days) for acute relapses. Shortens relapse duration but does NOT prevent future relapses or alter long-term disease course." },
      { name: "Baclofen", type: "GABA-B Agonist (Antispasmodic)", action: "Inhibits spinal motor neuron excitability by activating presynaptic GABA-B receptors, reducing muscle spasticity", sideEffects: "Drowsiness, dizziness, weakness, GI upset, withdrawal seizures if stopped abruptly", contra: "Use with caution in renal impairment (renally excreted)", pearl: "NEVER stop abruptly — can cause seizures and hallucinations. Start low, increase gradually. Intrathecal pump for severe refractory spasticity." }
    ],
    pearls: [
      "MS is diagnosed by lesions DISSEMINATED IN SPACE (multiple CNS locations) AND TIME (occurring at different times)",
      "UHTHOFF PHENOMENON: heat worsens MS symptoms temporarily — teach patients to avoid hot baths, saunas, and overheating during exercise",
      "LHERMITTE SIGN: electric shock sensation down the spine with neck flexion — classic for cervical cord demyelination",
      "Fatigue is the #1 most common and most disabling symptom — energy conservation is essential nursing teaching",
      "Optic neuritis is often the FIRST presenting symptom — unilateral vision loss with eye pain in a young woman = think MS",
      "DMTs reduce relapse frequency but do NOT cure MS — lifelong treatment commitment with monitoring required"
    ],
    quiz: [
      { question: "A client with MS reports worsening weakness and blurred vision after taking a hot bath. What should the nurse explain?", options: ["This indicates a new MS relapse requiring IV steroids", "This is Uhthoff phenomenon — heat temporarily worsens existing symptoms by impairing conduction in demyelinated nerves", "This is a medication side effect", "The client should go to the emergency department immediately"], correct: 1, rationale: "Uhthoff phenomenon is a well-known temporary worsening of MS symptoms with heat exposure. Elevated temperature further impairs conduction velocity in demyelinated fibers. Symptoms resolve when body temperature normalizes. It is NOT a new relapse and does not require acute treatment, but the patient should avoid heat triggers." },
      { question: "Which symptom is MOST commonly reported as the most disabling by patients with MS?", options: ["Vision loss", "Muscle spasticity", "Fatigue", "Tremor"], correct: 2, rationale: "Fatigue affects approximately 80% of MS patients and is consistently rated as the most disabling symptom. It is a primary MS symptom (not just from physical exertion) related to demyelination, inflammatory cytokines, and disrupted neural circuits. Energy conservation strategies are a key nursing intervention." }
    ]
  }
};
