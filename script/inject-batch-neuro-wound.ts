import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LESSONS_DIR = path.join(__dirname, "../client/src/data/lessons");

function escapeStr(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function buildLS(l: any): string {
  const li: string[] = [];
  li.push(`    title: "${escapeStr(l.title)}",`);
  li.push(`    cellular: { title: "${escapeStr(l.cellular.title)}", content: "${escapeStr(l.cellular.content)}" },`);
  li.push(`    riskFactors: [${l.riskFactors.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    diagnostics: [${l.diagnostics.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    management: [${l.management.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    nursingActions: [${l.nursingActions.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    assessmentFindings: [${l.assessmentFindings.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    signs: { left: [${l.signs.left.map((r:string) => `"${escapeStr(r)}"`).join(",")}], right: [${l.signs.right.map((r:string) => `"${escapeStr(r)}"`).join(",")}] },`);
  li.push(`    medications: [${l.medications.map((m:any) => `{ name: "${escapeStr(m.name)}", type: "${escapeStr(m.type)}", action: "${escapeStr(m.action)}", sideEffects: "${escapeStr(m.sideEffects)}", contra: "${escapeStr(m.contra)}", pearl: "${escapeStr(m.pearl)}" }`).join(",")}],`);
  li.push(`    pearls: [${l.pearls.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    quiz: [${l.quiz.map((q:any) => `{ question: "${escapeStr(q.question)}", options: [${q.options.map((o:string) => `"${escapeStr(o)}"`).join(",")}], correct: ${q.correct}, rationale: "${escapeStr(q.rationale)}" }`).join(",")}]`);
  return li.join("\n    ");
}

function inject(id: string, lesson: any): boolean {
  const files = fs.readdirSync(LESSONS_DIR).filter(f => f.endsWith(".ts") && f !== "index.ts" && f !== "types.ts");
  for (const file of files) {
    const fp = path.join(LESSONS_DIR, file);
    let src = fs.readFileSync(fp, "utf-8");
    const re = new RegExp(`"${id}":\\s*\\{[\\s\\S]*?\\[WRITE YOUR[\\s\\S]*?\\n  \\}`, "m");
    if (re.test(src)) {
      const replacement = `"${id}": {\n    ${buildLS(lesson)}\n  }`;
      src = src.replace(re, replacement);
      fs.writeFileSync(fp, src, "utf-8");
      console.log(`  Injected: ${id} -> ${file}`);
      return true;
    }
  }
  console.log(`  SKIP: ${id} (no placeholder found)`);
  return false;
}

const lessons: Record<string, any> = {
  "delirium-elderly-rpn": {
    title: "Delirium in the Elderly: Recognition and Nursing Management",
    cellular: {
      title: "Pathophysiology of Delirium in the Aging Brain",
      content: "Delirium is an acute, fluctuating disturbance in attention, awareness, and cognition that develops over hours to days and represents a medical emergency. Unlike dementia, delirium is typically reversible when the underlying cause is identified and treated. The pathophysiology involves widespread disruption of neurotransmitter signaling, particularly an imbalance between acetylcholine (which decreases) and dopamine (which increases) in the brain. This neurochemical disruption impairs the reticular activating system, which controls arousal and attention, and disrupts cortical-subcortical connectivity. The aging brain is particularly vulnerable to delirium because of age-related reductions in cerebral blood flow, decreased cholinergic reserve, increased blood-brain barrier permeability, and reduced neuronal density. These changes mean that even minor physiological insults such as urinary tract infections, constipation, dehydration, or medication changes can trigger delirium in elderly patients. Inflammatory cytokines released during acute illness (interleukin-1, interleukin-6, tumor necrosis factor-alpha) cross the compromised blood-brain barrier and directly impair neurotransmission. Oxidative stress and neuroinflammation further damage vulnerable neurons. Delirium exists in three motor subtypes: hyperactive (agitation, hallucinations, restlessness), hypoactive (lethargy, reduced responsiveness, withdrawal), and mixed (alternating between the two). Hypoactive delirium is the most common subtype in elderly patients but is frequently missed because the patient appears calm or sleepy rather than agitated. The practical nurse must understand that delirium is NEVER a normal part of aging and always indicates an underlying medical condition requiring urgent investigation. The DELIRIUM mnemonic identifies common reversible causes: Drugs (anticholinergics, benzodiazepines, opioids), Electrolyte imbalances, Lack of drugs (withdrawal from alcohol or benzodiazepines), Infection (UTI, pneumonia, sepsis), Reduced sensory input (missing hearing aids or glasses), Intracranial pathology (stroke, subdural hematoma), Urinary retention or fecal impaction, and Myocardial or pulmonary conditions (MI, PE, hypoxia). Early recognition using validated screening tools such as the Confusion Assessment Method (CAM) significantly improves outcomes. The CAM requires four features: acute onset and fluctuating course, inattention, disorganized thinking, and altered level of consciousness. Features 1 and 2 must be present, plus either feature 3 or 4, for a positive screen. Untreated delirium is associated with increased mortality (up to 25-33% in hospitalized elderly), prolonged hospital stays, increased risk of falls, pressure injuries, functional decline, and accelerated progression to dementia."
    },
    riskFactors: [
      "Advanced age (over 65 years) with decreased cholinergic reserve and reduced cerebral blood flow",
      "Pre-existing cognitive impairment or dementia (strongest predisposing factor for delirium)",
      "Polypharmacy, especially anticholinergic medications, benzodiazepines, opioids, and corticosteroids",
      "Sensory impairment (hearing loss, visual impairment) without corrective devices",
      "Dehydration, malnutrition, and electrolyte imbalances (hyponatremia, hypercalcemia)",
      "Acute infection (urinary tract infection is the most common precipitant in elderly)",
      "Recent surgery or anesthesia (post-operative delirium occurs in 15-53% of elderly surgical patients)",
      "Sleep deprivation, ICU environment, physical restraint use, and urinary catheterization"
    ],
    diagnostics: [
      "Confusion Assessment Method (CAM): validated screening tool requiring acute onset with fluctuating course PLUS inattention PLUS either disorganized thinking or altered level of consciousness",
      "Complete blood count (CBC): elevated WBC suggests infection; low hemoglobin may indicate anemia contributing to cerebral hypoxia",
      "Basic metabolic panel (BMP): assess sodium, potassium, calcium, glucose, BUN/creatinine for metabolic causes",
      "Urinalysis and urine culture: rule out urinary tract infection as the most common precipitant in elderly patients",
      "Chest X-ray: rule out pneumonia, especially in patients with subtle respiratory symptoms",
      "Medication reconciliation: systematic review of all medications, including over-the-counter and herbal products, focusing on anticholinergic burden"
    ],
    management: [
      "Identify and treat the underlying cause immediately (antibiotics for infection, fluid replacement for dehydration, medication adjustment for drug-induced delirium)",
      "Implement non-pharmacological interventions as first-line treatment: reorientation, familiar objects, consistent caregivers, adequate lighting, noise reduction",
      "Ensure sensory aids are available and in use (hearing aids with working batteries, clean eyeglasses at bedside)",
      "Maintain sleep-wake cycle: minimize nighttime disruptions, open curtains during day, reduce caffeine after noon, cluster care activities",
      "Promote mobility and prevent immobilization: assist with ambulation at least twice daily if safe, avoid unnecessary restraints",
      "Ensure adequate hydration and nutrition: offer fluids frequently, monitor intake, provide assistance with meals as needed",
      "Administer low-dose haloperidol only when behavioral symptoms pose an immediate safety risk and non-pharmacological measures have failed"
    ],
    nursingActions: [
      "Screen all elderly patients for delirium on admission and every shift using the CAM tool; document findings and communicate changes immediately",
      "Perform orientation interventions: state your name and role, provide date and time information, explain all procedures before performing them",
      "Monitor vital signs every 4 hours minimum; report fever (possible infection trigger), hypoxia (SpO2 below 92%), or hemodynamic instability",
      "Maintain a safe environment: keep bed in lowest position, call bell within reach, side rails per policy, remove clutter, ensure adequate lighting",
      "Document the onset, duration, and fluctuating nature of cognitive changes using specific behavioral descriptions rather than vague terms",
      "Monitor fluid balance: encourage oral intake of at least 1500 mL daily (unless fluid restricted), document intake and output accurately",
      "Review medication administration records for high-risk medications (anticholinergics, benzodiazepines, opioids) and report concerns to the prescriber"
    ],
    assessmentFindings: [
      "Acute onset of confusion with fluctuating course (lucid intervals alternating with periods of confusion) -- the hallmark feature distinguishing delirium from dementia",
      "Inattention: inability to maintain focus, easily distracted, difficulty following conversation or commands, cannot recite months backward",
      "Hyperactive subtype: agitation, pulling at lines or tubes, attempting to get out of bed, hallucinations (visual more common than auditory), combativeness",
      "Hypoactive subtype: lethargy, decreased responsiveness, reduced speech output, appears sleepy or withdrawn -- frequently MISSED and misattributed to depression or fatigue",
      "Disorganized thinking: incoherent speech, illogical flow of ideas, unpredictable subject changes, difficulty with simple reasoning tasks",
      "Sleep-wake cycle disturbance: sundowning (worsening symptoms in late afternoon/evening), daytime somnolence, nighttime agitation",
      "Perceptual disturbances: visual hallucinations (seeing people or objects that are not present), illusions (misinterpretation of real stimuli such as IV tubing appearing as snakes)"
    ],
    signs: {
      left: [
        "New onset of mild confusion or disorientation to time",
        "Increased restlessness or agitation in the evening (sundowning)",
        "Difficulty maintaining attention during conversation",
        "Sleep-wake cycle disruption (daytime drowsiness, nighttime wakefulness)",
        "Mild anxiety or irritability not previously present",
        "New difficulty following simple instructions"
      ],
      right: [
        "Acute severe agitation with risk of self-harm or harm to others",
        "Pulling at IV lines, catheters, or oxygen devices",
        "Visual hallucinations with fearful or paranoid behavior",
        "Rapid deterioration in level of consciousness",
        "New focal neurological deficits (possible stroke as underlying cause)",
        "Fever with acute confusion (sepsis until proven otherwise)"
      ]
    },
    medications: [
      {
        name: "Haloperidol (Haldol)",
        type: "First-generation antipsychotic (butyrophenone)",
        action: "Blocks dopamine D2 receptors in the mesolimbic pathway, reducing psychotic symptoms including hallucinations, agitation, and disorganized thinking associated with delirium. Restores the acetylcholine-dopamine balance disrupted in delirium.",
        sideEffects: "Extrapyramidal symptoms (acute dystonia, akathisia, parkinsonism), QT prolongation and torsades de pointes, neuroleptic malignant syndrome (hyperthermia, rigidity, autonomic instability), sedation, orthostatic hypotension",
        contra: "Parkinson disease or Lewy body dementia (can cause severe worsening of motor symptoms and life-threatening sensitivity reactions); prolonged QT interval; severe cardiac disease; CNS depression",
        pearl: "Use the LOWEST effective dose for the SHORTEST duration; start with 0.25-0.5 mg in elderly patients; obtain baseline ECG and monitor QTc; NEVER use as a first-line intervention -- always try non-pharmacological measures first"
      },
      {
        name: "Melatonin",
        type: "Endogenous hormone supplement (sleep-wake cycle regulator)",
        action: "Binds to melatonin receptors (MT1 and MT2) in the suprachiasmatic nucleus of the hypothalamus, helping to restore the disrupted circadian rhythm that contributes to delirium. Promotes physiological sleep onset without the adverse cognitive effects of sedative-hypnotics.",
        sideEffects: "Daytime drowsiness, headache, dizziness, nausea; minimal risk compared to benzodiazepines or sedative-hypnotics",
        contra: "Autoimmune disorders (theoretical immunostimulatory effects); use caution with warfarin (may increase anticoagulant effect); hepatic impairment (reduced metabolism)",
        pearl: "Administer 0.5-3 mg at bedtime to support circadian rhythm restoration; emerging evidence supports use in delirium prevention protocols; far safer than benzodiazepines for sleep promotion in elderly patients"
      },
      {
        name: "Thiamine (Vitamin B1)",
        type: "Water-soluble vitamin supplement",
        action: "Serves as an essential coenzyme for pyruvate dehydrogenase and alpha-ketoglutarate dehydrogenase in cellular energy metabolism. Thiamine deficiency impairs glucose utilization in the brain, causing neuronal damage particularly in the thalamus and mammillary bodies, leading to Wernicke encephalopathy (confusion, ataxia, ophthalmoplegia).",
        sideEffects: "Rare; anaphylaxis with IV administration (very rare), local irritation at injection site, mild GI upset with oral administration",
        contra: "Known hypersensitivity to thiamine (extremely rare); no significant contraindications at replacement doses",
        pearl: "Always administer thiamine BEFORE glucose-containing IV fluids in malnourished or alcohol-dependent patients -- glucose administration without thiamine can precipitate acute Wernicke encephalopathy by depleting the remaining thiamine stores; standard dose is 100 mg IV or IM daily for 3-5 days"
      }
    ],
    pearls: [
      "Delirium is NEVER normal aging -- it always indicates an underlying medical condition that requires urgent investigation and treatment",
      "The CAM screening tool requires four features: (1) acute onset with fluctuating course, (2) inattention, (3) disorganized thinking, (4) altered level of consciousness. Features 1 AND 2 must be present, PLUS either 3 OR 4.",
      "Hypoactive delirium is the most commonly MISSED subtype in elderly patients because the patient appears calm, sleepy, or withdrawn rather than agitated -- always screen formally rather than relying on behavioral observation alone",
      "The DELIRIUM mnemonic identifies reversible causes: Drugs, Electrolytes, Lack of drugs (withdrawal), Infection, Reduced sensory input, Intracranial pathology, Urinary retention/fecal impaction, Myocardial/pulmonary conditions",
      "UTI is the most common precipitant of delirium in elderly patients -- always obtain urinalysis when an elderly patient develops acute confusion, even without urinary symptoms",
      "NEVER use benzodiazepines to treat delirium (they worsen confusion) EXCEPT in alcohol or benzodiazepine withdrawal delirium, where benzodiazepines are the treatment of choice",
      "Sundowning (worsening confusion in late afternoon/evening) can be mitigated by maintaining consistent routines, ensuring adequate daytime lighting, reducing stimulation in the evening, and providing familiar orientation cues"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a 78-year-old patient who was alert and oriented yesterday but is now confused, pulling at IV lines, and seeing people who are not in the room. Which screening tool should the nurse use to assess this patient?",
        options: [
          "Mini-Mental State Examination (MMSE)",
          "Confusion Assessment Method (CAM)",
          "Glasgow Coma Scale (GCS)",
          "Montreal Cognitive Assessment (MoCA)"
        ],
        correct: 1,
        rationale: "The Confusion Assessment Method (CAM) is the validated screening tool specifically designed to identify delirium. It assesses for acute onset with fluctuating course, inattention, disorganized thinking, and altered level of consciousness. The MMSE and MoCA assess baseline cognitive function (dementia screening), not acute delirium."
      },
      {
        question: "An elderly patient with delirium is quietly staring at the wall, has reduced speech, and is difficult to arouse. The family states this is not like them. Which subtype of delirium is the nurse observing?",
        options: [
          "Hyperactive delirium",
          "Mixed delirium",
          "Hypoactive delirium",
          "Terminal restlessness"
        ],
        correct: 2,
        rationale: "Hypoactive delirium presents with lethargy, reduced responsiveness, decreased speech output, and withdrawal. It is the most common subtype in elderly patients and is frequently missed because the patient appears calm or sleepy. Hyperactive delirium involves agitation, hallucinations, and restlessness."
      },
      {
        question: "A practical nurse is caring for a malnourished elderly patient admitted with confusion. The physician orders IV dextrose and thiamine. Which medication should be administered FIRST?",
        options: [
          "IV dextrose should be administered first to correct hypoglycemia",
          "Thiamine should be administered first to prevent Wernicke encephalopathy",
          "Both medications should be administered simultaneously in the same line",
          "The order of administration does not matter for patient safety"
        ],
        correct: 1,
        rationale: "Thiamine must be administered BEFORE glucose-containing IV fluids in malnourished patients. Glucose metabolism requires thiamine as a coenzyme; administering glucose without adequate thiamine depletes remaining thiamine stores and can precipitate acute Wernicke encephalopathy (confusion, ataxia, ophthalmoplegia)."
      }
    ]
  },

  "dementia-care-rpn": {
    title: "Dementia Care: Types, Assessment, and Person-Centered Nursing",
    cellular: {
      title: "Neuropathology of Dementia Syndromes",
      content: "Dementia is a chronic, progressive syndrome characterized by deterioration of cognitive function beyond what is expected from normal aging. Unlike delirium, which develops acutely and is typically reversible, dementia has a gradual onset and is generally irreversible. The most common type is Alzheimer disease (AD), accounting for 60-70% of all dementia cases. In Alzheimer disease, two hallmark pathological changes occur in the brain: extracellular amyloid-beta plaques and intracellular neurofibrillary tangles composed of hyperphosphorylated tau protein. Amyloid-beta protein, which is normally produced and cleared from the brain, accumulates into insoluble plaques between neurons when the balance between production and clearance is disrupted. These plaques trigger an inflammatory response, activate microglia (the brain's immune cells), and generate oxidative stress that damages surrounding neurons. Simultaneously, tau protein, which normally stabilizes microtubules within neurons to maintain structural integrity and axonal transport, becomes hyperphosphorylated. This hyperphosphorylated tau detaches from microtubules, aggregates into paired helical filaments, and forms neurofibrillary tangles inside neurons. The tangles disrupt intracellular transport, leading to synaptic dysfunction and eventual neuronal death. The disease typically begins in the hippocampus and entorhinal cortex (explaining early memory loss) and progressively spreads to the temporal, parietal, and frontal lobes. Vascular dementia is the second most common type, caused by reduced blood flow to the brain from cerebrovascular disease. Unlike the gradual decline of Alzheimer disease, vascular dementia often presents with a stepwise deterioration pattern, where cognitive function declines abruptly after each vascular event (stroke or transient ischemic attack) and then stabilizes until the next event. Risk factors mirror those for cardiovascular disease: hypertension, diabetes, hyperlipidemia, atrial fibrillation, and smoking. Lewy body dementia (LBD) is characterized by abnormal protein deposits called Lewy bodies (alpha-synuclein aggregates) within neurons throughout the cortex. LBD presents with fluctuating cognition, recurrent visual hallucinations, and parkinsonism (rigidity, bradykinesia, postural instability). A critical clinical distinction is that patients with LBD have extreme sensitivity to antipsychotic medications, which can cause severe neuroleptic malignant syndrome and death. Frontotemporal dementia (FTD) involves degeneration of the frontal and temporal lobes, presenting primarily with personality changes, behavioral disinhibition, and language difficulties rather than the memory loss seen in Alzheimer disease. The practical nurse plays a critical role in person-centered dementia care, which focuses on maintaining the individual's dignity, preferences, abilities, and quality of life rather than focusing solely on deficits. Standardized cognitive screening tools include the Mini-Mental State Examination (MMSE) with a maximum score of 30 (scores below 24 suggest cognitive impairment) and the Montreal Cognitive Assessment (MoCA), which is more sensitive for detecting mild cognitive impairment."
    },
    riskFactors: [
      "Advanced age (strongest risk factor; prevalence doubles every 5 years after age 65)",
      "Family history of dementia and genetic factors (APOE-e4 allele increases Alzheimer risk 3-15 fold)",
      "Cardiovascular risk factors: hypertension, diabetes, hyperlipidemia, obesity, smoking (especially for vascular dementia)",
      "History of traumatic brain injury, especially repeated head trauma",
      "Low educational attainment and limited cognitive engagement (reduced cognitive reserve)",
      "Social isolation and depression (both risk factors and early manifestations)",
      "Down syndrome (trisomy 21) -- virtually all individuals develop Alzheimer neuropathology by age 40 due to extra copy of amyloid precursor protein gene on chromosome 21",
      "Hearing loss (associated with accelerated cognitive decline and increased dementia risk)"
    ],
    diagnostics: [
      "Mini-Mental State Examination (MMSE): 30-point screening tool assessing orientation, registration, attention, recall, language, and visuospatial ability; score below 24 suggests cognitive impairment; score 18-24 mild impairment; below 18 severe impairment",
      "Montreal Cognitive Assessment (MoCA): 30-point screening tool more sensitive than MMSE for mild cognitive impairment; includes executive function, visuospatial, naming, memory, attention, language, abstraction, and orientation domains; score below 26 suggests impairment",
      "CT or MRI of brain: assess for structural changes including cortical atrophy, ventricular enlargement, hippocampal volume loss (Alzheimer), evidence of cerebrovascular disease (vascular dementia), or focal frontal/temporal atrophy (frontotemporal dementia)",
      "Complete metabolic panel and thyroid function tests (TSH, free T4): rule out reversible causes of cognitive decline including hypothyroidism, hepatic encephalopathy, renal failure, and electrolyte imbalances",
      "Vitamin B12 and folate levels: deficiency of either can cause reversible cognitive impairment mimicking dementia",
      "Depression screening (Geriatric Depression Scale): pseudodementia from depression is a reversible condition that mimics dementia and must be ruled out"
    ],
    management: [
      "Implement person-centered care: learn the patient's life history, preferences, routines, and meaningful activities; use this information to individualize the care plan",
      "Establish and maintain consistent daily routines: same caregivers when possible, predictable meal times, activity schedules, and sleep-wake patterns",
      "Simplify communication: use short, clear sentences; ask one question at a time; allow extra time for response; avoid arguing or correcting; redirect when agitated",
      "Modify the environment to maximize safety and function: remove hazards, ensure adequate non-glare lighting, use contrasting colors for important objects, minimize background noise",
      "Support remaining abilities: encourage self-care activities with verbal cues and step-by-step guidance rather than doing tasks for the patient",
      "Manage behavioral symptoms non-pharmacologically first: identify triggers (pain, hunger, toileting needs, overstimulation), address unmet needs, use distraction and redirection techniques",
      "Provide caregiver education and support: teach communication strategies, safety planning, community resources, and the importance of self-care to prevent caregiver burnout"
    ],
    nursingActions: [
      "Perform cognitive screening using MMSE or MoCA as ordered; document scores and compare with previous assessments to track progression",
      "Assess and manage behavioral and psychological symptoms of dementia (BPSD): identify triggers, document patterns, implement individualized behavioral interventions before requesting pharmacological management",
      "Ensure patient safety: assess fall risk every shift, implement fall prevention measures, assess wandering risk, apply identification bracelet, ensure secure environment",
      "Monitor nutritional status: weigh weekly, assess swallowing ability, provide finger foods if utensil use is impaired, allow adequate time for meals, minimize distractions during eating",
      "Administer cholinesterase inhibitors with food to reduce GI side effects; monitor heart rate (risk of bradycardia); report signs of GI bleeding",
      "Provide structured activities appropriate to cognitive level: reminiscence therapy, music therapy, gentle exercise, sensory stimulation",
      "Communicate with family members: provide regular updates, educate about disease progression, connect with support resources such as Alzheimer Society programs"
    ],
    assessmentFindings: [
      "Alzheimer disease: progressive memory loss (recent memory affected first, remote memory preserved longer), difficulty with word finding (anomia), impaired judgment, personality changes, eventual loss of ADL independence",
      "Vascular dementia: stepwise cognitive decline with periods of stability between events, focal neurological deficits, executive dysfunction (planning, organizing, sequencing), emotional lability",
      "Lewy body dementia: fluctuating cognition (good days and bad days), recurrent well-formed visual hallucinations, parkinsonism (shuffling gait, rigidity, tremor), REM sleep behavior disorder, extreme sensitivity to antipsychotics",
      "Frontotemporal dementia: early personality and behavioral changes (disinhibition, apathy, loss of empathy), language difficulties, relatively preserved memory in early stages, onset typically younger (45-65 years)",
      "Sundowning: increased confusion, agitation, and behavioral symptoms in late afternoon and evening, common across all dementia types",
      "Aphasia progression: difficulty naming objects (anomia) progressing to fluent but empty speech, then non-fluent speech, and eventually mutism in late-stage disease",
      "Apraxia: loss of ability to perform learned motor tasks despite intact motor function (inability to dress, use utensils, or perform familiar activities)"
    ],
    signs: {
      left: [
        "Repeating questions or conversations within minutes",
        "Misplacing belongings in unusual locations",
        "Difficulty with complex tasks (managing finances, cooking multi-step meals)",
        "Word-finding difficulty during conversation",
        "Mild personality changes or withdrawal from social activities",
        "Getting lost in familiar environments"
      ],
      right: [
        "Wandering with inability to find way back (elopement risk)",
        "Aggressive or combative behavior toward caregivers",
        "Inability to recognize family members or self (agnosia)",
        "Severe dysphagia with aspiration risk",
        "Complete loss of ADL independence requiring total care",
        "Refusal to eat or drink with progressive weight loss"
      ]
    },
    medications: [
      {
        name: "Donepezil (Aricept)",
        type: "Cholinesterase inhibitor (acetylcholinesterase inhibitor)",
        action: "Reversibly inhibits acetylcholinesterase, the enzyme that breaks down acetylcholine in the synaptic cleft. This increases the concentration and duration of action of acetylcholine at cholinergic synapses, partially compensating for the loss of cholinergic neurons in Alzheimer disease. Does not stop disease progression but may temporarily stabilize or modestly improve cognitive and functional symptoms.",
        sideEffects: "Nausea, vomiting, diarrhea, anorexia, weight loss, insomnia, vivid dreams, muscle cramps, bradycardia, syncope",
        contra: "Sick sinus syndrome or other supraventricular conduction abnormalities (without pacemaker); active GI bleeding or peptic ulcer disease; severe hepatic impairment; concurrent use of anticholinergic medications (antagonizes therapeutic effect)",
        pearl: "Administer at bedtime to minimize GI side effects; therapeutic effect is modest (stabilization rather than improvement); takes 4-6 weeks for full effect; if discontinued for more than several days, must be re-titrated from the lowest dose to avoid cholinergic crisis"
      },
      {
        name: "Memantine (Ebixa/Namenda)",
        type: "NMDA receptor antagonist",
        action: "Blocks pathological overstimulation of N-methyl-D-aspartate (NMDA) glutamate receptors while preserving physiological receptor activation needed for learning and memory. In Alzheimer disease, excessive glutamate release causes sustained NMDA receptor activation, leading to calcium influx, excitotoxicity, and neuronal death. Memantine provides neuroprotection by regulating this glutamate activity.",
        sideEffects: "Dizziness, headache, constipation, confusion (paradoxically), hypertension, somnolence",
        contra: "Severe renal impairment (requires dose reduction); conditions that raise urine pH (reduces renal excretion); concurrent use of other NMDA antagonists (amantadine, ketamine, dextromethorphan)",
        pearl: "Approved for moderate-to-severe Alzheimer disease; can be used in combination with donepezil for additive benefit; dose must be titrated gradually over 3-4 weeks; monitor renal function as the drug is renally excreted"
      },
      {
        name: "Risperidone (Risperdal)",
        type: "Second-generation (atypical) antipsychotic",
        action: "Blocks dopamine D2 and serotonin 5-HT2A receptors in the brain. The dual receptor blockade reduces psychotic symptoms (hallucinations, delusions) and agitation while the serotonin antagonism partially offsets dopamine-related extrapyramidal side effects compared to first-generation antipsychotics.",
        sideEffects: "Sedation, weight gain, metabolic syndrome (hyperglycemia, dyslipidemia), orthostatic hypotension, extrapyramidal symptoms (dose-dependent), increased risk of cerebrovascular events in elderly with dementia",
        contra: "Lewy body dementia (extreme sensitivity to antipsychotics can cause severe parkinsonism, neuroleptic malignant syndrome, and death); Parkinson disease; concurrent use with strong CYP2D6 inhibitors without dose adjustment",
        pearl: "BLACK BOX WARNING: Increased risk of death in elderly patients with dementia-related psychosis -- use ONLY when behavioral symptoms pose a serious safety risk and all non-pharmacological interventions have failed; start at the lowest dose (0.25 mg) and titrate slowly; NEVER use in Lewy body dementia"
      }
    ],
    pearls: [
      "Delirium versus dementia: delirium has ACUTE onset (hours to days), fluctuating course, and is typically REVERSIBLE; dementia has GRADUAL onset (months to years), progressive course, and is generally IRREVERSIBLE. Delirium can be superimposed on dementia.",
      "The MMSE has a maximum score of 30 points: 24-30 suggests normal cognition, 18-23 mild impairment, and below 18 severe impairment. However, scores are influenced by education level, language, and cultural background.",
      "NEVER use antipsychotics in patients with Lewy body dementia -- these patients have extreme sensitivity that can cause life-threatening neuroleptic malignant syndrome, severe parkinsonism, and death",
      "Person-centered care is the gold standard for dementia management: focus on the person's remaining abilities, life history, preferences, and dignity rather than their deficits",
      "When a patient with dementia becomes agitated, always assess for underlying causes first: pain (use a validated non-verbal pain scale), urinary retention, constipation, hunger, thirst, fear, overstimulation, or need for toileting",
      "Anticholinergic medications worsen dementia symptoms by further reducing the already depleted acetylcholine levels -- review all medications for anticholinergic properties (diphenhydramine, oxybutynin, tricyclic antidepressants) and advocate for alternatives",
      "Wandering is a significant safety risk: implement environmental modifications (door alarms, secure units), apply identification bracelet, register with local wandering alert programs, and ensure the patient has current identification at all times"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient diagnosed with Lewy body dementia who is experiencing visual hallucinations. The physician orders an antipsychotic medication. What is the MOST important nursing action?",
        options: [
          "Administer the medication as ordered to control the hallucinations",
          "Question the order because patients with Lewy body dementia have extreme sensitivity to antipsychotics",
          "Request a higher dose because hallucinations in Lewy body dementia are treatment-resistant",
          "Hold the medication until the next shift and let another nurse decide"
        ],
        correct: 1,
        rationale: "Patients with Lewy body dementia have extreme sensitivity to antipsychotic medications, which can cause severe parkinsonism, neuroleptic malignant syndrome, and death. The nurse must question this order and communicate the concern to the prescriber. This is a critical patient safety issue."
      },
      {
        question: "A family member asks the practical nurse to explain the difference between their mother's Alzheimer disease and the delirium she experienced during a recent hospitalization. Which response is MOST accurate?",
        options: [
          "Delirium and Alzheimer disease are essentially the same condition with different names",
          "Delirium develops suddenly and is usually reversible, while Alzheimer disease develops gradually and is progressive",
          "Alzheimer disease causes hallucinations, while delirium only causes memory loss",
          "Both conditions are caused by the same brain changes and have identical treatments"
        ],
        correct: 1,
        rationale: "Delirium has an acute onset (hours to days), fluctuating course, and is typically reversible when the underlying cause is treated. Alzheimer disease has a gradual onset (months to years), progressive course, and is irreversible. Delirium can occur in patients who already have dementia (delirium superimposed on dementia)."
      },
      {
        question: "A patient with moderate Alzheimer disease becomes agitated and begins yelling during afternoon care. Which nursing intervention should the practical nurse implement FIRST?",
        options: [
          "Request an order for a PRN antipsychotic medication",
          "Apply physical restraints to prevent the patient from harming themselves",
          "Assess for an underlying cause such as pain, toileting needs, or overstimulation",
          "Leave the patient alone in their room until they calm down"
        ],
        correct: 2,
        rationale: "When a patient with dementia becomes agitated, the first nursing action is to assess for underlying causes (pain, hunger, toileting needs, overstimulation, fear). Agitation in dementia often communicates an unmet need. Non-pharmacological interventions should always be attempted before requesting medication. Restraints increase agitation and are associated with injury."
      }
    ]
  },

  "drain-management-rpn": {
    title: "Surgical Drain Management for Practical Nurses",
    cellular: {
      title: "Physiology of Wound Drainage and Healing",
      content: "Surgical drains are devices placed during or after surgical procedures to prevent the accumulation of fluid (blood, serum, lymph, bile, pus, or air) in a wound bed or body cavity. Understanding why fluid accumulates requires knowledge of the inflammatory phase of wound healing. When tissue is surgically incised, the body initiates the inflammatory response within minutes. Damaged blood vessels constrict briefly (vasoconstriction for 5-10 minutes) and then dilate (vasodilation), increasing blood flow to the area. Increased capillary permeability allows plasma proteins, clotting factors, and immune cells to leak into the interstitial space, creating serous or serosanguineous fluid. This inflammatory exudate serves a protective function: it delivers neutrophils and macrophages to combat infection, provides growth factors for tissue repair, and removes cellular debris. However, excessive fluid accumulation in a closed surgical space creates problems. A seroma (collection of serous fluid) creates a dead space that separates tissue layers, preventing wound edge approximation and delaying healing. A hematoma (collection of blood) not only creates dead space but also serves as a medium for bacterial growth, significantly increasing infection risk. Fluid collections also increase pressure on surrounding tissues, causing pain and potentially compromising blood supply to the wound edges. Surgical drains work by either passive or active mechanisms. Passive drains (such as the Penrose drain) function through gravity and capillary action; fluid flows along the drain from an area of higher pressure to lower pressure. Active drains (such as Jackson-Pratt and Hemovac systems) use closed-suction mechanisms that create negative pressure to actively draw fluid out of the wound. The Jackson-Pratt (JP) drain uses a grenade-shaped bulb that is compressed to create suction; when fully expanded, the bulb has lost its negative pressure and must be re-compressed. The Hemovac drain uses a larger, disc-shaped reservoir with a spring mechanism that generates stronger suction, making it suitable for larger surgical sites with greater expected drainage. Chest tubes (thoracostomy tubes) represent a specialized drainage system used to remove air (pneumothorax), blood (hemothorax), or fluid (pleural effusion) from the pleural space. The chest tube connects to a closed drainage system (such as a Pleur-Evac or Atrium system) that includes three chambers: a collection chamber for drainage, a water-seal chamber that acts as a one-way valve preventing air from re-entering the pleural space, and a suction control chamber. The practical nurse must understand the principles of drain management to maintain patency, accurately measure and document output, recognize complications, and ensure patient comfort while preventing drain dislodgement."
    },
    riskFactors: [
      "Extensive surgical procedures with large tissue dissection areas (mastectomy, abdominal surgery, joint replacement)",
      "Coagulopathy or anticoagulant therapy (increased risk of hematoma formation requiring drainage)",
      "Obesity (increased dead space in subcutaneous tissue layers, higher infection risk)",
      "Malnutrition and hypoalbuminemia (impaired wound healing, increased serous drainage)",
      "Diabetes mellitus (impaired immune function, delayed wound healing, increased infection risk)",
      "History of previous surgical site infection or wound complications",
      "Immunosuppression from chemotherapy, corticosteroids, or chronic disease"
    ],
    diagnostics: [
      "Drain output monitoring: measure and document volume, color, consistency, and odor of drainage at established intervals (typically every 8-12 hours or more frequently as ordered)",
      "Complete blood count (CBC): monitor hemoglobin/hematocrit for hemorrhage; elevated WBC may indicate developing infection at drain site",
      "Wound culture and sensitivity: obtain if drainage becomes purulent, malodorous, or if signs of infection develop at the drain site or surgical wound",
      "Serum albumin and prealbumin: assess nutritional status; albumin below 3.0 g/dL is associated with impaired wound healing and increased drainage",
      "Chest X-ray (for chest tubes): verify tube placement, assess lung re-expansion, evaluate for residual pneumothorax or pleural effusion",
      "Ultrasound: may be ordered to assess for fluid collections (seroma, hematoma, abscess) if drain output suddenly decreases and clinical signs suggest ongoing fluid accumulation"
    ],
    management: [
      "Maintain drain patency: milk or strip tubing per facility protocol to prevent clot occlusion (use gentle technique to avoid excessive negative pressure); ensure tubing is not kinked, clamped, or compressed",
      "Empty drains at regular intervals per facility protocol (typically every 8-12 hours or when bulb/reservoir is half full) using aseptic technique",
      "Secure the drain to prevent accidental dislodgement: pin the drain to the patient's gown (not to skin), use a safety pin with tape reinforcement, leave enough slack to allow movement",
      "Monitor and document drain output characteristics: measure volume precisely, describe color (sanguineous, serosanguineous, serous, purulent), note consistency and odor",
      "Maintain closed chest tube drainage system below the level of the chest at all times; never clamp a chest tube unless specifically ordered or during system changes",
      "Drain removal is typically performed when output decreases to less than 25-30 mL per 24 hours (varies by surgeon preference and type of surgery)",
      "Provide patient education: teach drain care for patients discharged with drains in place, including emptying technique, output measurement, site care, and signs of complications requiring medical attention"
    ],
    nursingActions: [
      "Assess the drain insertion site every shift for signs of infection (redness, warmth, swelling, purulent drainage, increased tenderness) and document findings",
      "Measure and record drain output using a graduated cylinder for accuracy; report output exceeding expected parameters or sudden increases/decreases to the physician",
      "Maintain sterile technique when emptying closed-suction drains: clean the port with an alcohol swab, empty into a graduated container, re-compress the bulb before closing the port to re-establish suction",
      "Assess chest tube water-seal chamber for tidaling (fluctuation with respiration) which indicates the system is patent; absence of tidaling may indicate lung re-expansion (desired) or tube occlusion (undesired)",
      "Report bright red drainage (active hemorrhage), sudden increase in output volume, purulent or malodorous drainage, or air leak in chest tube system immediately",
      "Perform pain assessment before and after drain site care; administer analgesics as prescribed 30 minutes before dressing changes or drain removal",
      "Document the type of drain, insertion site location, suture integrity, drain patency, output characteristics, and any complications at every assessment"
    ],
    assessmentFindings: [
      "Normal serous drainage: clear to pale yellow, thin consistency, no odor; expected in the days following surgery as inflammatory exudate decreases",
      "Serosanguineous drainage: pink-tinged, thin; normal in the first 24-72 hours post-surgery as blood mixes with serous fluid",
      "Sanguineous drainage: bright red, blood-like; expected immediately post-operatively but concerning if it persists or increases after 24 hours (possible hemorrhage)",
      "Purulent drainage: thick, opaque, yellow-green or brown, often malodorous; indicates infection requiring immediate notification and wound culture",
      "Chest tube tidaling: normal fluctuation of fluid in the water-seal chamber with respiration (rises with inspiration in spontaneously breathing patients); indicates patent tube and intact pleural seal",
      "Chest tube continuous bubbling in water-seal chamber: indicates an air leak either from the lung (bronchopleural fistula) or from a connection in the system; check all connections first",
      "Sudden cessation of chest tube drainage with respiratory distress: may indicate tube occlusion, tension pneumothorax, or tube displacement -- assess patient immediately and notify physician"
    ],
    signs: {
      left: [
        "Gradual decrease in drain output volume over days (expected healing)",
        "Serosanguineous drainage transitioning to serous (normal progression)",
        "Mild tenderness at drain insertion site",
        "Small amount of clear drainage around drain exit site",
        "Normal chest tube tidaling with respiration",
        "Patient reports mild discomfort at drain site during movement"
      ],
      right: [
        "Sudden large volume of bright red drainage (hemorrhage)",
        "Purulent, malodorous drainage from drain or insertion site (infection)",
        "Drain accidentally dislodged or pulled out",
        "Subcutaneous emphysema (crepitus) around chest tube site (air leak into tissues)",
        "Absent tidaling with chest tube plus respiratory distress (possible tension pneumothorax)",
        "Signs of sepsis: fever, tachycardia, hypotension, altered mental status with drain in situ"
      ]
    },
    medications: [
      {
        name: "Cefazolin (Ancef/Kefzol)",
        type: "First-generation cephalosporin antibiotic",
        action: "Binds to penicillin-binding proteins (PBPs) on the bacterial cell wall, inhibiting the transpeptidation step of peptidoglycan synthesis. This weakens the cell wall structure, causing osmotic instability and bacterial cell lysis. Effective against common surgical site infection pathogens including Staphylococcus aureus (MSSA), Streptococcus species, and some gram-negative organisms.",
        sideEffects: "Allergic reactions (rash, urticaria, anaphylaxis), diarrhea, nausea, phlebitis at IV site, Clostridioides difficile infection with prolonged use, positive Coombs test",
        contra: "Known anaphylaxis to cephalosporins; use with caution in patients with penicillin allergy (approximately 1-2% cross-reactivity risk); severe renal impairment (requires dose adjustment)",
        pearl: "The most commonly used prophylactic antibiotic for surgical site infection prevention; administered within 60 minutes before surgical incision for optimal tissue levels; assess for penicillin and cephalosporin allergy before administration"
      },
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low molecular weight heparin (LMWH) anticoagulant",
        action: "Binds to antithrombin III, which then preferentially inactivates Factor Xa in the coagulation cascade (anti-Xa to anti-IIa ratio of approximately 4:1). This inhibits thrombin generation and fibrin clot formation, preventing deep vein thrombosis (DVT) and pulmonary embolism (PE) in surgical patients during the period of immobilization.",
        sideEffects: "Bleeding (most significant), injection site bruising and hematoma, thrombocytopenia (monitor platelet count), elevated liver enzymes, hyperkalemia (rare)",
        contra: "Active major bleeding; heparin-induced thrombocytopenia (HIT); severe thrombocytopenia (platelets below 50,000); epidural or spinal catheter in situ (risk of spinal hematoma); severe renal impairment with CrCl below 30 mL/min (drug accumulation)",
        pearl: "Administer subcutaneously in the abdomen (alternating left and right sides); do NOT aspirate or rub the injection site (increases bruising); hold pressure for 30 seconds; typical prophylactic dose is 40 mg daily or 30 mg twice daily starting 12-24 hours post-operatively"
      },
      {
        name: "Acetaminophen (Tylenol)",
        type: "Non-opioid analgesic and antipyretic",
        action: "Inhibits cyclooxygenase (COX) enzymes primarily in the central nervous system, reducing prostaglandin synthesis in the hypothalamic thermoregulatory center (antipyretic effect) and in pain-processing pathways (analgesic effect). Unlike NSAIDs, acetaminophen has minimal peripheral anti-inflammatory activity and does not inhibit platelet function.",
        sideEffects: "Hepatotoxicity (dose-dependent, most significant adverse effect), nausea, allergic reactions (rare), Stevens-Johnson syndrome (very rare)",
        contra: "Severe hepatic impairment or active liver disease; known hypersensitivity; caution with alcohol use disorder (increased hepatotoxicity risk); caution with warfarin (may potentiate anticoagulant effect at doses above 2 g/day)",
        pearl: "Maximum dose 4 g/day in healthy adults, 2 g/day in patients with liver disease or alcohol use; CHECK ALL SOURCES of acetaminophen (combination products like Percocet, Tylenol #3, cold medications) to prevent inadvertent overdose; first-line analgesic for post-operative pain management in multimodal analgesia protocols"
      }
    ],
    pearls: [
      "Jackson-Pratt (JP) drain: grenade-shaped bulb must be COMPRESSED with the port open, then port closed while compressed to maintain suction; a fully expanded bulb has NO suction and is not functioning properly",
      "Hemovac drain: disc-shaped reservoir with stronger suction capacity than JP drains; used for larger surgical sites with greater expected drainage volumes; compress by pushing the top and bottom together",
      "Penrose drain: passive, open drain that works by gravity and capillary action; requires an external dressing to absorb drainage; higher infection risk than closed-suction systems because it is open to the environment",
      "Chest tube drainage systems must ALWAYS remain below the level of the patient's chest to prevent backflow of fluid into the pleural space; NEVER clamp a chest tube unless specifically ordered",
      "Normal drain output progression post-surgery: sanguineous (first 24 hours) transitions to serosanguineous (24-72 hours) then to serous (after 72 hours) with decreasing volume; deviation from this pattern warrants investigation",
      "Report drain output exceeding 100 mL/hour of sanguineous drainage immediately as this may indicate post-operative hemorrhage requiring surgical re-exploration",
      "When a patient is discharged with a drain in place, teach them to measure and record output, empty the drain using clean technique, secure the drain under clothing, and recognize signs of infection requiring immediate medical attention"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a post-operative patient with a Jackson-Pratt drain. The nurse notices the bulb is fully expanded. What is the MOST appropriate action?",
        options: [
          "Document the finding and continue monitoring",
          "Empty the drain, compress the bulb, and close the port to re-establish suction",
          "Remove the drain because it is no longer functioning",
          "Notify the surgeon immediately for drain replacement"
        ],
        correct: 1,
        rationale: "A fully expanded JP drain bulb has lost its negative pressure (suction) and is no longer functioning effectively. The nurse should empty the drain using aseptic technique, then compress the bulb while the port is open, and close the port while the bulb is still compressed to re-establish suction."
      },
      {
        question: "A patient with a chest tube suddenly develops respiratory distress. The nurse observes that tidaling has stopped in the water-seal chamber. What should the nurse suspect?",
        options: [
          "The lung has fully re-expanded and the chest tube can be removed",
          "The chest tube may be occluded or displaced, requiring immediate assessment",
          "This is a normal finding that requires no intervention",
          "The suction pressure needs to be increased"
        ],
        correct: 1,
        rationale: "Absent tidaling in the water-seal chamber combined with respiratory distress suggests the chest tube may be occluded (clot, kink) or displaced. While absent tidaling can indicate lung re-expansion (a positive finding), this would NOT be accompanied by respiratory distress. The nurse must assess the patient immediately and notify the physician."
      },
      {
        question: "A practical nurse observes thick, yellow-green, foul-smelling drainage from a surgical drain site on post-operative day 5. Which action should the nurse take FIRST?",
        options: [
          "Apply a warm compress to the drain site to promote drainage",
          "Irrigate the drain with sterile saline to clear the drainage",
          "Document the finding and report it to the physician as a possible wound infection",
          "Remove the drain to prevent further contamination of the wound"
        ],
        correct: 2,
        rationale: "Thick, yellow-green, malodorous drainage indicates purulent drainage consistent with wound infection. The nurse should document the characteristics of the drainage (color, amount, consistency, odor) and report to the physician immediately. A wound culture will likely be ordered. The nurse should not irrigate or remove the drain without a physician order."
      }
    ]
  },

  "dressing-types-rpn": {
    title: "Wound Dressing Types and Selection for Practical Nurses",
    cellular: {
      title: "Physiology of Wound Healing and Moist Wound Environment",
      content: "Wound healing progresses through four overlapping phases: hemostasis, inflammation, proliferation, and maturation (remodeling). Understanding these phases is essential for selecting the appropriate wound dressing. During hemostasis (immediate to minutes), damaged blood vessels constrict and platelets aggregate to form a platelet plug, which is stabilized by a fibrin mesh to create a clot. This clot serves as a provisional matrix for cell migration. During the inflammatory phase (1-6 days), neutrophils migrate to the wound within hours to combat bacteria and remove debris through phagocytosis. Macrophages follow at approximately 48-72 hours and are considered the most critical cells in wound healing because they coordinate the transition from inflammation to proliferation by releasing growth factors including platelet-derived growth factor (PDGF), transforming growth factor-beta (TGF-beta), and vascular endothelial growth factor (VEGF). During the proliferative phase (4-21 days), fibroblasts migrate into the wound and begin synthesizing collagen, the primary structural protein of new tissue. Angiogenesis (new blood vessel formation) creates a granular, beefy-red tissue called granulation tissue. Epithelial cells at the wound edges divide and migrate across the wound surface (epithelialization), and wound contraction occurs as myofibroblasts pull wound edges together. During the maturation phase (21 days to 2 years), collagen is reorganized and cross-linked, increasing wound tensile strength from approximately 3% at 1 week to a maximum of approximately 80% of original tissue strength. The concept of moist wound healing, established by George Winter in 1962, revolutionized wound care by demonstrating that wounds heal up to 50% faster in a moist environment compared to a dry environment. Moisture promotes epithelial cell migration across the wound surface, facilitates autolytic debridement (the body's own enzymes breaking down necrotic tissue), reduces pain by keeping nerve endings moist, and supports growth factor activity. However, excessive moisture causes maceration (waterlogged, white, wrinkled tissue) of the periwound skin, which breaks down the skin barrier and enlarges the wound. The practical nurse must assess the wound bed to guide dressing selection: red granulation tissue needs protection and moisture maintenance; yellow slough (devitalized tissue) needs debridement; black eschar (necrotic tissue) typically needs debridement unless on a stable heel or in a patient receiving palliative care. The TIME framework guides wound bed assessment: Tissue (viable vs. non-viable), Infection/Inflammation (signs of bioburden), Moisture (balance), and Edge (advancing vs. non-advancing wound margins). Each wound dressing type has specific properties that make it appropriate for certain wound conditions: absorptive capacity, moisture donation, adhesion characteristics, conformability, antimicrobial properties, and transparency for wound monitoring."
    },
    riskFactors: [
      "Diabetes mellitus (impaired neutrophil function, peripheral neuropathy masking injury, peripheral vascular disease reducing blood flow to wound)",
      "Peripheral arterial disease (reduced arterial blood flow depriving tissues of oxygen and nutrients needed for healing)",
      "Venous insufficiency (chronic edema, hemosiderin staining, lipodermatosclerosis leading to venous leg ulcers)",
      "Malnutrition and protein deficiency (inadequate substrates for collagen synthesis, impaired immune function; albumin below 3.0 g/dL significantly impairs healing)",
      "Chronic corticosteroid use (suppresses inflammatory phase, inhibits fibroblast proliferation, reduces collagen synthesis)",
      "Advanced age (thinner dermis, reduced collagen production, decreased immune function, impaired circulation)",
      "Obesity (reduced blood supply to adipose tissue, increased tension on wound edges, higher surgical site infection rates)",
      "Smoking (nicotine causes vasoconstriction reducing tissue oxygenation; carbon monoxide binds hemoglobin reducing oxygen-carrying capacity)"
    ],
    diagnostics: [
      "Wound assessment and documentation: measure length, width, and depth in centimeters using a ruler; describe wound bed (percentage of granulation, slough, eschar), periwound skin condition, exudate characteristics (amount, color, odor), and wound edges",
      "Wound culture (quantitative tissue biopsy or Levine technique swab): indicated when clinical signs of infection are present (increased pain, erythema, warmth, purulent exudate, malodor); cleanse wound before obtaining culture to avoid surface colonizer contamination",
      "Serum albumin and prealbumin: albumin below 3.0 g/dL and prealbumin below 15 mg/dL indicate protein malnutrition that significantly impairs wound healing",
      "Ankle-brachial index (ABI): ratio of ankle to brachial systolic blood pressure; ABI below 0.9 indicates peripheral arterial disease; compression therapy is CONTRAINDICATED with ABI below 0.5",
      "Hemoglobin A1C: in diabetic patients, values above 7% are associated with impaired wound healing; optimize glycemic control to promote healing",
      "Doppler ultrasound: assess arterial and venous blood flow to the wound area; essential before applying compression therapy for suspected venous leg ulcers"
    ],
    management: [
      "Select dressings based on wound bed assessment using the principle of maintaining a moist wound environment without causing maceration of periwound skin",
      "Gauze dressings: versatile, inexpensive, available in woven and non-woven forms; use moist-to-dry for mechanical debridement (controversial, increasingly replaced by advanced dressings); primary disadvantage is adherence to wound bed causing trauma on removal",
      "Foam dressings: highly absorptive, thermal-insulating, conformable; ideal for moderate-to-heavily exudating wounds; available in adhesive and non-adhesive forms; protect wound from external contamination while managing excess moisture",
      "Hydrocolloid dressings (DuoDERM): contain gelatin, pectin, and carboxymethylcellulose that interact with wound exudate to form a gel; provide autolytic debridement; waterproof outer layer allows bathing; change every 3-7 days; NOT appropriate for infected wounds or heavily exudating wounds",
      "Alginate dressings (Kaltostat): derived from brown seaweed (calcium alginate); extremely absorptive (15-20 times their weight); form a gel on contact with wound exudate; excellent for heavily exudating wounds and cavities; require a secondary dressing; contraindicated in dry wounds",
      "Negative pressure wound therapy (NPWT/wound VAC): applies controlled sub-atmospheric pressure to the wound bed through a foam or gauze filler and sealed dressing; promotes granulation tissue formation, removes excess exudate, reduces edema, and improves blood flow; contraindicated with untreated osteomyelitis, necrotic tissue with eschar, malignancy in wound, and exposed blood vessels or organs",
      "Apply skin protectant (barrier cream or liquid skin barrier) to periwound skin before applying adhesive dressings to prevent moisture-associated skin damage and adhesive-related skin tears"
    ],
    nursingActions: [
      "Perform comprehensive wound assessment at every dressing change using a standardized wound assessment tool; document wound measurements, wound bed characteristics, exudate, periwound skin, and signs of healing or deterioration",
      "Maintain aseptic technique during dressing changes: hand hygiene, clean or sterile gloves per facility protocol, sterile supplies for acute surgical wounds, clean technique acceptable for chronic wounds",
      "Irrigate wounds with normal saline (0.9% NaCl) at appropriate pressure (4-15 psi) using a 35 mL syringe with an 18-gauge angiocatheter tip to remove loose debris without damaging granulation tissue",
      "Apply dressings extending at least 2 cm beyond wound edges to ensure complete coverage and protect periwound skin; ensure dressings conform to wound contours without restricting movement",
      "Monitor for signs of wound infection: increasing pain, expanding erythema beyond wound edges, increased warmth, purulent or malodorous exudate, elevated temperature, elevated WBC, and delayed healing",
      "Report any wound deterioration, unexpected changes in drainage, new areas of undermining or tunneling, or signs of wound dehiscence to the physician or wound care specialist",
      "Educate patients and families on wound care at home: dressing change technique, frequency, signs of infection, when to seek medical attention, nutrition for wound healing, and proper hand hygiene"
    ],
    assessmentFindings: [
      "Granulation tissue: beefy red, moist, granular appearance; indicates healthy wound healing in the proliferative phase; protect with non-adherent dressings that maintain moisture",
      "Slough: yellow, tan, or grey devitalized tissue; loosely adherent; indicates need for debridement (autolytic with moisture-retentive dressings, enzymatic, or sharp debridement by authorized clinician)",
      "Eschar: black or brown, dry, leathery, firmly adherent dead tissue; generally requires debridement EXCEPT on stable heel ulcers (where eschar serves as a biological cover) or in palliative patients",
      "Epithelialization: new pink or silvery tissue growing from wound edges inward; indicates healing; protect with moisture-retentive, non-traumatic dressings",
      "Maceration: white, waterlogged, wrinkled periwound skin; indicates excessive moisture; increase dressing absorbency, apply skin protectant, change dressings more frequently",
      "Undermining: tissue destruction beneath intact wound edges; measured by clock position and depth using a cotton-tipped applicator; indicates wound is larger than surface appearance",
      "Tunneling: narrow channel extending from wound into surrounding tissue; measured by depth and direction using clock position; may indicate abscess formation or fistula development"
    ],
    signs: {
      left: [
        "Wound bed with healthy red granulation tissue and decreasing size",
        "Serosanguineous drainage decreasing in amount over time",
        "Wound edges with advancing epithelialization (pink/silver border)",
        "Periwound skin intact without maceration or erythema",
        "Patient reports decreasing pain at wound site",
        "Stable wound measurements on serial assessments"
      ],
      right: [
        "Expanding wound size with increasing depth, undermining, or tunneling",
        "Purulent, malodorous drainage (green, yellow-brown, or grey)",
        "Cellulitis: spreading erythema, warmth, and induration beyond wound edges",
        "Wound dehiscence (separation of surgical wound edges) with possible evisceration",
        "Signs of systemic infection: fever, tachycardia, elevated WBC, altered mental status",
        "Exposed bone, tendon, or deep structures in wound bed (requires immediate specialist referral)"
      ]
    },
    medications: [
      {
        name: "Silver Sulfadiazine (Silvadene/Flamazine)",
        type: "Topical antimicrobial (sulfonamide-silver combination)",
        action: "Silver ions bind to bacterial DNA and cell membrane proteins, disrupting multiple cellular processes simultaneously. The sulfadiazine component inhibits dihydropteroate synthase, blocking folic acid synthesis in bacteria. This dual mechanism provides broad-spectrum antimicrobial activity against gram-positive bacteria (including MRSA), gram-negative bacteria (including Pseudomonas aeruginosa), and Candida species.",
        sideEffects: "Transient leukopenia (monitor CBC weekly, typically resolves spontaneously), skin discoloration (grey-black), delayed wound epithelialization with prolonged use, allergic contact dermatitis, argyria (permanent skin discoloration with prolonged silver exposure, rare)",
        contra: "Sulfonamide allergy; pregnancy near term (risk of kernicterus in newborn); premature infants and neonates under 2 months; glucose-6-phosphate dehydrogenase (G6PD) deficiency; do NOT apply to face (risk of permanent discoloration)",
        pearl: "Apply 1/16 inch thickness to wound with sterile tongue depressor or gloved hand; reapply every 12-24 hours after wound cleansing; monitor WBC count weekly for the first several weeks (leukopenia typically occurs between days 2-4 and resolves by day 12); being replaced in many settings by newer silver-containing dressings that do not inhibit epithelialization"
      },
      {
        name: "Bacitracin",
        type: "Topical polypeptide antibiotic",
        action: "Inhibits bacterial cell wall synthesis by interfering with the dephosphorylation of the lipid carrier molecule (C55-isoprenyl pyrophosphate) that transports peptidoglycan precursors across the cell membrane. This disrupts cell wall formation in gram-positive bacteria, leading to osmotic instability and bacterial death. Most effective against gram-positive organisms including Staphylococcus and Streptococcus species.",
        sideEffects: "Allergic contact dermatitis (common with prolonged use, more frequent than commonly recognized), local irritation, rare anaphylaxis, nephrotoxicity and ototoxicity with systemic absorption (relevant only in large open wounds or mucous membrane application)",
        contra: "Known hypersensitivity to bacitracin; not for systemic use due to nephrotoxicity; avoid application to large open wounds or burns where significant systemic absorption may occur",
        pearl: "Available over-the-counter for minor wound care; apply a thin layer to clean wound 1-3 times daily; increasingly being questioned in routine wound care as studies show petroleum jelly alone is equally effective for minor wounds and has lower sensitization risk; always assess for allergy history before first application"
      },
      {
        name: "Mupirocin (Bactroban)",
        type: "Topical antibiotic (pseudomonic acid)",
        action: "Reversibly binds to bacterial isoleucyl-tRNA synthetase, blocking incorporation of isoleucine into bacterial proteins. This unique mechanism of action means mupirocin has no cross-resistance with other antibiotic classes. Highly effective against Staphylococcus aureus including methicillin-resistant strains (MRSA) and Streptococcus pyogenes.",
        sideEffects: "Local burning or stinging at application site, pruritus, erythema, dry skin, allergic contact dermatitis (uncommon), headache (with intranasal use)",
        contra: "Known hypersensitivity to mupirocin or polyethylene glycol (vehicle component); do not apply to large open wounds (polyethylene glycol absorption risk in patients with renal impairment); not for use on burns",
        pearl: "First-line topical treatment for impetigo and MRSA wound infections; also used intranasally for MRSA decolonization protocols (apply to each nare twice daily for 5 days); limit use to 10 days to prevent resistance development; do NOT use mupirocin ointment (not cream) in the nose for decolonization as the ointment formulation is paraffin-based and appropriate for intranasal use"
      }
    ],
    pearls: [
      "The principle of moist wound healing: wounds heal up to 50% faster in a moist environment. The goal is to maintain moisture BALANCE -- enough moisture to support cell migration and autolytic debridement, but not so much that periwound maceration occurs.",
      "Match the dressing to the wound: DRY wounds need moisture-donating dressings (hydrogels, honey-based); MODERATE exudate needs moisture-maintaining dressings (hydrocolloids, foam); HEAVY exudate needs highly absorptive dressings (alginates, hydrofibers, superabsorbents)",
      "The TIME framework guides wound assessment: Tissue (is the wound bed viable?), Infection/Inflammation (are there signs of bioburden?), Moisture (is there appropriate moisture balance?), Edge (are wound margins advancing?)",
      "Hydrocolloid dressings (DuoDERM) produce a characteristic yellow-brown gel with a distinctive odor when removed -- this is NORMAL and should NOT be confused with purulent drainage or infection",
      "Alginate dressings should NEVER be applied to dry wounds -- they require wound exudate to activate their gel-forming properties and will adhere painfully to a dry wound bed",
      "Wound measurements should always be documented consistently: length (head-to-toe direction, 12 o'clock to 6 o'clock) x width (side-to-side, 9 o'clock to 3 o'clock) x depth in centimeters",
      "NEVER use hydrogen peroxide, povidone-iodine, or Dakin solution directly in a wound bed for routine cleansing -- these are cytotoxic to fibroblasts and granulation tissue; use normal saline (0.9% NaCl) for wound irrigation"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient with a heavily exudating leg ulcer. The wound bed is 100% red granulation tissue but the periwound skin is macerated. Which dressing is MOST appropriate?",
        options: [
          "Hydrocolloid dressing to promote moisture retention",
          "Hydrogel dressing to donate additional moisture to the wound",
          "Alginate or foam dressing to absorb excess exudate",
          "Dry gauze dressing to remove all moisture from the wound"
        ],
        correct: 2,
        rationale: "A heavily exudating wound with periwound maceration needs a highly absorptive dressing to manage excess moisture. Alginate or foam dressings are appropriate choices. Hydrocolloids are for low-to-moderate exudate wounds, hydrogels donate moisture (inappropriate for an already over-moist wound), and dry gauze violates moist wound healing principles and causes trauma on removal."
      },
      {
        question: "During a hydrocolloid dressing change, the practical nurse observes yellow-brown gel with a distinctive odor on the wound surface. What is the MOST appropriate interpretation?",
        options: [
          "The wound is infected and requires immediate wound culture and antibiotics",
          "This is the normal gel formation that occurs when hydrocolloid interacts with exudate",
          "The dressing has expired and must be discarded immediately",
          "The patient is having an allergic reaction to the dressing material"
        ],
        correct: 1,
        rationale: "Hydrocolloid dressings produce a characteristic yellow-brown gel with a distinctive odor when they interact with wound exudate. This is normal and expected, and should not be confused with purulent drainage or infection. The wound should be gently cleansed with normal saline and reassessed."
      },
      {
        question: "A practical nurse is preparing to irrigate a chronic wound. Which solution and technique is MOST appropriate?",
        options: [
          "Hydrogen peroxide applied directly to the wound bed with gauze",
          "Povidone-iodine (Betadine) poured over the wound to sterilize it",
          "Normal saline (0.9% NaCl) using a 35 mL syringe with an 18-gauge angiocatheter",
          "Tap water under high pressure from the faucet"
        ],
        correct: 2,
        rationale: "Normal saline is the recommended irrigation solution because it is isotonic and non-cytotoxic to granulation tissue. A 35 mL syringe with an 18-gauge angiocatheter delivers approximately 8 psi of pressure, which is within the recommended range (4-15 psi) to remove debris without damaging healing tissue. Hydrogen peroxide and povidone-iodine are cytotoxic to fibroblasts."
      }
    ]
  },

  "dysphagia-management-rpn": {
    title: "Dysphagia Management and Aspiration Prevention for Practical Nurses",
    cellular: {
      title: "Anatomy and Physiology of Normal Swallowing",
      content: "Swallowing (deglutition) is a complex neuromuscular process involving more than 30 pairs of muscles and five cranial nerves (V trigeminal, VII facial, IX glossopharyngeal, X vagus, and XII hypoglossal) coordinated by the swallowing center in the medulla oblongata. Normal swallowing consists of four phases. The oral preparatory phase is voluntary: food is chewed (mastication), mixed with saliva containing amylase for initial starch digestion, and formed into a cohesive bolus by the tongue against the hard palate. The buccinator muscles in the cheeks prevent food from falling into the lateral sulci. The oral propulsive phase is also voluntary: the tongue tip elevates to the hard palate and moves the bolus posteriorly in a wave-like motion toward the oropharynx. When the bolus reaches the anterior faucial pillars, the swallowing reflex is triggered. The pharyngeal phase is involuntary and lasts approximately 1 second. It involves a precisely timed sequence: the soft palate elevates to close the nasopharynx (preventing nasal regurgitation), the hyoid bone and larynx elevate superiorly and anteriorly, the epiglottis inverts to cover the laryngeal inlet, the vocal folds adduct (close) to protect the airway, respiration ceases momentarily (deglutition apnea), and the pharyngeal constrictors contract sequentially to propel the bolus through the pharynx. The upper esophageal sphincter (UES) relaxes to allow bolus entry into the esophagus. The esophageal phase is involuntary: peristaltic waves propel the bolus through the esophagus to the stomach, while the lower esophageal sphincter (LES) relaxes to allow passage into the gastric fundus. Dysphagia occurs when any component of this mechanism is disrupted. Oropharyngeal dysphagia results from neurological damage (stroke, traumatic brain injury, Parkinson disease, multiple sclerosis, myasthenia gravis), structural abnormalities (tumors, Zenker diverticulum), or muscular dysfunction affecting the oral or pharyngeal phases. Esophageal dysphagia results from obstruction (stricture, tumor, Schatzki ring) or motility disorders (achalasia, esophageal spasm, scleroderma) affecting the esophageal phase. The most dangerous complication of dysphagia is aspiration -- the entry of food, liquid, or secretions below the level of the true vocal folds into the lower respiratory tract. Aspiration pneumonia develops when aspirated material contains pathogenic bacteria (often oropharyngeal flora including anaerobes) that colonize the lower airways, causing an inflammatory response and infection. Silent aspiration, which occurs without visible signs of coughing or choking, is particularly dangerous because it is clinically undetectable without instrumental assessment (videofluoroscopic swallow study or fiberoptic endoscopic evaluation of swallowing). The International Dysphagia Diet Standardisation Initiative (IDDSI) framework provides a globally standardized terminology and classification system for texture-modified foods and thickened liquids, using a scale from Level 0 (thin liquids) through Level 7 (regular food). This framework replaced previously inconsistent terminology (nectar-thick, honey-thick, pudding-thick) that varied between countries and facilities, reducing the risk of miscommunication and aspiration events."
    },
    riskFactors: [
      "Stroke (most common cause of oropharyngeal dysphagia; affects up to 65% of acute stroke patients; damage to cranial nerve nuclei or cortical swallowing centers)",
      "Neurodegenerative diseases: Parkinson disease (reduced tongue motility, delayed swallow reflex), multiple sclerosis, ALS/motor neuron disease, myasthenia gravis",
      "Advanced age with sarcopenia (age-related loss of muscle mass and strength affecting the muscles of mastication and swallowing)",
      "Head and neck cancer or surgical treatment (resection of oral, pharyngeal, or laryngeal structures; radiation fibrosis)",
      "Prolonged endotracheal intubation or tracheostomy (laryngeal injury, vocal cord dysfunction, impaired laryngeal sensation)",
      "Traumatic brain injury (disruption of cortical and brainstem swallowing centers)",
      "Severe gastroesophageal reflux disease (esophageal inflammation, stricture formation)",
      "Medications causing dry mouth (anticholinergics) or decreased level of consciousness (sedatives, opioids)"
    ],
    diagnostics: [
      "Bedside swallowing screen (water swallow test): initial screening by trained nurse; patient drinks water and is observed for coughing, choking, voice change (wet/gurgling voice), or delayed swallow; positive screen requires referral to speech-language pathologist",
      "Videofluoroscopic swallow study (VFSS/modified barium swallow): gold standard for evaluating swallowing physiology; patient swallows barium-coated food and liquids of various consistencies under fluoroscopy; identifies the phase of dysfunction and presence of aspiration or penetration",
      "Fiberoptic endoscopic evaluation of swallowing (FEES): a flexible endoscope is passed through the nose to visualize the pharynx and larynx during swallowing; can be performed at bedside; directly visualizes residue, penetration, and aspiration",
      "Pulse oximetry during meals: desaturation of 2% or more from baseline during eating may suggest aspiration (low sensitivity and specificity but useful as adjunctive monitoring)",
      "Chest X-ray: indicated if aspiration pneumonia is suspected; infiltrates typically in dependent lung segments (right lower lobe most common in upright aspiration, posterior segments in supine aspiration)",
      "Serum albumin and prealbumin: assess nutritional status in patients with chronic dysphagia who may develop protein-calorie malnutrition and dehydration"
    ],
    management: [
      "Maintain NPO (nothing by mouth) until a formal swallowing assessment is completed by a speech-language pathologist, especially after stroke or extubation",
      "Implement diet texture modifications per IDDSI framework as recommended: Level 0 (thin), Level 1 (slightly thick), Level 2 (mildly thick), Level 3 (moderately thick/liquidized), Level 4 (pureed), Level 5 (minced and moist), Level 6 (soft and bite-sized), Level 7 (regular/easy to chew)",
      "Position the patient upright at 90 degrees during meals and for at least 30 minutes after eating to reduce aspiration risk through gravity-assisted bolus clearance",
      "Implement compensatory swallowing strategies as directed by the speech-language pathologist: chin tuck (flexing chin toward chest to widen valleculae and narrow airway entrance), head turn toward weak side (directs bolus to stronger side), effortful swallow, double swallow",
      "Provide small, frequent meals to reduce fatigue; offer 1-2 teaspoon-sized bites; allow adequate time between swallows; avoid rushed meals",
      "Ensure adequate oral hydration and nutrition: monitor daily fluid intake, calorie counts, and body weight; consult dietitian for nutritional supplementation; consider enteral feeding (NG tube or PEG) if oral intake is insufficient",
      "Perform thorough oral care at least twice daily and before meals: reduces oropharyngeal bacterial load, decreasing the risk of aspiration pneumonia if aspiration occurs"
    ],
    nursingActions: [
      "Perform bedside swallowing screening per facility protocol before offering ANY food, fluids, or oral medications to at-risk patients (stroke, post-extubation, neurological conditions)",
      "Verify the prescribed diet texture and liquid consistency before every meal tray delivery; check the IDDSI level on the diet order and ensure the tray matches",
      "Monitor the patient during meals: observe for coughing, choking, wet/gurgling voice quality after swallowing, food pocketing in cheeks, prolonged chewing, or refusal to swallow",
      "Supervise medication administration: consult pharmacy regarding which medications can be crushed and mixed with applesauce or thickened liquid; never crush enteric-coated or extended-release medications",
      "Perform oral care before meals (stimulates saliva production and reduces bacterial load) and after meals (removes food residue that could be aspirated later)",
      "Monitor respiratory status: auscultate lung sounds before and after meals; report new adventitious sounds (crackles, rhonchi) that may indicate aspiration",
      "Document swallowing assessment findings, diet modifications, patient tolerance, amount consumed, any signs of aspiration, and patient/family education provided"
    ],
    assessmentFindings: [
      "Coughing or choking during or immediately after swallowing (overt aspiration sign, though absence does NOT rule out aspiration)",
      "Wet or gurgling voice quality after swallowing (liquid or food sitting on or near the vocal folds)",
      "Nasal regurgitation (food or liquid exiting through the nose, indicating velopharyngeal insufficiency/incomplete soft palate closure)",
      "Food pocketing in the cheeks (buccal residue) after eating, indicating impaired oral motor function or reduced oral sensation",
      "Recurrent aspiration pneumonia (especially right lower lobe infiltrates on chest X-ray), unexplained fevers, or chronic cough after meals",
      "Drooling or inability to manage oral secretions (impaired oral phase of swallowing, reduced lip closure, or decreased swallow frequency)",
      "Unexplained weight loss, dehydration, or malnutrition in a patient with known neurological condition (may indicate chronic silent aspiration with inadequate oral intake)"
    ],
    signs: {
      left: [
        "Occasional coughing with thin liquids but able to manage thickened liquids safely",
        "Mild difficulty initiating swallow requiring verbal cues",
        "Slight wet voice quality that clears with throat clearing after swallowing",
        "Taking longer than usual to complete meals",
        "Preference for soft foods and avoidance of dry or hard textures",
        "Mild food residue in mouth after swallowing detected on oral inspection"
      ],
      right: [
        "Severe coughing, choking, or gagging with all oral intake including saliva",
        "Oxygen desaturation during meals (SpO2 dropping 2% or more from baseline)",
        "Aspiration pneumonia (fever, productive cough, dyspnea, abnormal lung sounds)",
        "Complete inability to manage oral secretions with continuous drooling",
        "Frank aspiration observed during instrumental swallowing assessment",
        "Rapid unintentional weight loss with signs of dehydration and malnutrition"
      ]
    },
    medications: [
      {
        name: "Metoclopramide (Reglan/Maxeran)",
        type: "Prokinetic agent and antiemetic (dopamine D2 antagonist)",
        action: "Increases upper gastrointestinal motility by enhancing the release of acetylcholine from myenteric motor neurons and blocking dopamine D2 receptors. Accelerates gastric emptying and increases lower esophageal sphincter tone, reducing gastroesophageal reflux that can contribute to aspiration risk. Also blocks dopamine D2 receptors in the chemoreceptor trigger zone, providing antiemetic effect.",
        sideEffects: "Drowsiness, restlessness (akathisia), diarrhea, extrapyramidal symptoms (acute dystonia, parkinsonism), tardive dyskinesia with prolonged use (may be irreversible), neuroleptic malignant syndrome (rare), depression",
        contra: "GI obstruction, perforation, or hemorrhage; pheochromocytoma (may cause hypertensive crisis); seizure disorder (lowers seizure threshold); Parkinson disease (dopamine antagonism worsens motor symptoms); concurrent use of other dopamine antagonists",
        pearl: "Maximum recommended duration is 12 weeks due to risk of irreversible tardive dyskinesia; administer 30 minutes before meals for optimal effect on gastric emptying; monitor for involuntary facial movements (lip smacking, tongue protrusion, chewing movements) at every assessment; use is declining due to safety concerns"
      },
      {
        name: "Omeprazole (Losec/Prilosec)",
        type: "Proton pump inhibitor (PPI)",
        action: "Irreversibly binds to the hydrogen-potassium ATPase enzyme system (proton pump) on the apical surface of gastric parietal cells, blocking the final common pathway of acid secretion. Reduces gastric acid production by up to 95%, raising intragastric pH. In dysphagia patients, reduces the volume and acidity of gastric contents, decreasing the severity of damage if gastroesophageal reflux and aspiration occur.",
        sideEffects: "Headache, diarrhea, abdominal pain, nausea; long-term use associated with vitamin B12 deficiency, hypomagnesemia, increased fracture risk (hip, wrist, spine), Clostridioides difficile infection, community-acquired pneumonia",
        contra: "Known hypersensitivity; concurrent use with rilpivirine, atazanavir, or nelfinavir (PPIs reduce absorption of these drugs); use with caution in patients with hepatic impairment (reduced metabolism)",
        pearl: "Administer 30-60 minutes before the first meal of the day on an empty stomach for maximum efficacy; capsules should be swallowed whole and NOT crushed -- if patient cannot swallow capsules, open and sprinkle granules on applesauce (do not crush granules) or use oral suspension formulation; review need for continued PPI therapy regularly as prolonged use carries cumulative risks"
      },
      {
        name: "Nystatin (Mycostatin)",
        type: "Antifungal (polyene antimycotic)",
        action: "Binds to ergosterol in the fungal cell membrane, creating pores that increase membrane permeability. This allows potassium and other essential intracellular components to leak out, disrupting the osmotic integrity of the cell and causing fungal cell death. Active against Candida species, which commonly cause oral thrush in patients with dysphagia who have impaired oral hygiene, use corticosteroid inhalers, or are immunocompromised.",
        sideEffects: "Nausea, vomiting, diarrhea (with high oral doses), oral irritation, unpleasant taste, contact dermatitis (rare)",
        contra: "Known hypersensitivity to nystatin; not absorbed systemically so systemic fungal infections require different antifungal agents",
        pearl: "For oral candidiasis (thrush), instruct the patient to swish the suspension throughout the mouth for as long as possible (at least 1-2 minutes), coating all surfaces including the tongue, palate, and buccal mucosa, then swallow; administer AFTER meals and oral care; continue treatment for 48 hours after symptoms resolve to prevent relapse; in dysphagia patients, oral thrush can worsen swallowing difficulty due to pain and inflammation"
      }
    ],
    pearls: [
      "The chin tuck maneuver (flexing chin toward chest during swallowing) is the most commonly used compensatory technique -- it widens the valleculae (space between tongue base and epiglottis), narrows the airway entrance, and pushes the tongue base posteriorly to improve pharyngeal clearance",
      "IDDSI framework levels: 0 = thin, 1 = slightly thick, 2 = mildly thick, 3 = moderately thick (liquidized), 4 = pureed, 5 = minced and moist, 6 = soft and bite-sized, 7 = regular/easy to chew. Always verify the prescribed level before serving meals.",
      "Silent aspiration (aspiration without coughing or choking) occurs in up to 40-70% of patients who aspirate -- a patient who does not cough during meals is NOT necessarily safe; instrumental assessment (VFSS or FEES) is required to detect silent aspiration",
      "Oral care is a CRITICAL aspiration pneumonia prevention measure: thorough oral hygiene at least twice daily (and before meals) reduces the concentration of pathogenic bacteria in oral secretions, so that if aspiration occurs, the aspirated material has a lower bacterial load",
      "NEVER rush a patient with dysphagia during meals -- fatigue during eating increases aspiration risk; allow adequate time, provide rest periods, and offer small frequent meals rather than three large meals",
      "Thickened liquids reduce aspiration risk by slowing the speed of the liquid bolus through the pharynx, giving the impaired swallowing mechanism more time to close the airway; however, patients often find thickened liquids unpalatable, leading to dehydration if fluid intake is not monitored closely",
      "Keep the patient upright at 90 degrees during meals and for at least 30 minutes after eating -- gravity assists with bolus clearance and reduces gastroesophageal reflux aspiration; elevate the head of bed for tube-fed patients as well"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a stroke patient who coughs every time they drink water but tolerates pudding without difficulty. Which action should the nurse take FIRST?",
        options: [
          "Discontinue all oral intake and insert a nasogastric tube",
          "Withhold thin liquids and notify the speech-language pathologist for swallowing assessment",
          "Encourage the patient to drink more water slowly to practice swallowing",
          "Add ice chips to the water to make swallowing easier"
        ],
        correct: 1,
        rationale: "Coughing with thin liquids but tolerating thicker consistencies is a classic sign of oropharyngeal dysphagia with thin liquid aspiration. The nurse should withhold thin liquids (the aspiration-provoking consistency) and refer to the speech-language pathologist for formal swallowing assessment and diet recommendations. Encouraging more water intake increases aspiration risk."
      },
      {
        question: "A patient with dysphagia is prescribed IDDSI Level 4 (pureed) diet and IDDSI Level 2 (mildly thick) liquids. The practical nurse observes a regular meal tray with unmodified solid food delivered to the bedside. What is the MOST appropriate action?",
        options: [
          "Allow the patient to eat the regular food if they are hungry",
          "Remove the tray immediately and request the correct texture-modified diet from dietary services",
          "Cut the regular food into smaller pieces to make it easier to swallow",
          "Blend the regular food at the bedside using a cup and fork"
        ],
        correct: 1,
        rationale: "Serving the wrong diet texture to a patient with dysphagia is a significant safety risk for aspiration. The nurse must remove the incorrect tray and request the prescribed IDDSI Level 4 (pureed) diet. Cutting food into smaller pieces does not achieve the required pureed consistency. Diet texture modifications must be prepared by dietary services using proper equipment."
      },
      {
        question: "A practical nurse is caring for a patient with dysphagia and notes the patient has white patches on the tongue and oral mucosa with complaints of mouth soreness. The nurse suspects oral candidiasis (thrush). Why is this finding particularly significant in a patient with dysphagia?",
        options: [
          "Oral thrush is only a cosmetic concern and does not affect swallowing",
          "Oral candidiasis can worsen swallowing difficulty due to pain and inflammation, and indicates inadequate oral care",
          "Thrush always indicates the patient is immunocompromised and requires isolation",
          "White patches on the tongue are a normal variant in patients with dysphagia"
        ],
        correct: 1,
        rationale: "Oral candidiasis (thrush) causes pain, inflammation, and altered taste that can worsen swallowing difficulty in patients who already have dysphagia. It also indicates that oral hygiene may be inadequate. Patients with dysphagia are at higher risk for thrush due to impaired oral clearance, mouth breathing, and use of certain medications. Treatment with nystatin and improved oral care is essential."
      }
    ]
  }
};

let ok = 0;
let skip = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) ok++;
  else skip++;
}
console.log(`\nDone: ${ok} injected, ${skip} skipped`);
