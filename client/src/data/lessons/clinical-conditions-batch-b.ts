import { getAssetUrl } from "@/lib/asset-url";
import type { LessonContent } from "./types";
const imgFebrileSeizures = getAssetUrl("febrileseizures_1773374861631.png");

export const clinicalConditionsBatchBLessons: Record<string, LessonContent> = {
  "febrile-seizures-rpn": {
    title: "Febrile Seizures",
    image: imgFebrileSeizures,
    cellular: {
      title: "Thermoregulatory Seizure Pathophysiology",
      content: "Febrile seizures occur in children aged 6 months to 5 years when a rapid rise in body temperature lowers the seizure threshold in the immature central nervous system. The developing brain has increased neuronal excitability and incomplete myelination, making it vulnerable to temperature-induced depolarization cascades. Simple febrile seizures are generalized, last less than 15 minutes, and do not recur within 24 hours. Complex febrile seizures are focal, prolonged (>15 minutes), or recur within 24 hours. The nurse monitors vital signs, ensures seizure safety, times seizure duration, administers antipyretics as ordered, and reports all findings to the RN."
    },
    riskFactors: [
      "Age 6 months to 5 years",
      "Rapid rise in temperature rather than absolute temperature",
      "First- or second-degree relative with febrile seizures",
      "Viral infections (HHV-6, influenza)",
      "Recent immunization (particularly DTaP, MMR)",
      "Iron deficiency anemia",
      "Daycare attendance (increased infection exposure)",
      "Male sex (slightly higher incidence)"
    ],
    diagnostics: [
      "Monitor temperature continuously and report trends to the RN",
      "Time and document seizure duration, type of movements, and post-ictal behavior",
      "Monitor oxygen saturation during and after the seizure event",
      "Report any focal features (one-sided movements, eye deviation)",
      "Monitor neurological status post-seizure as directed",
      "Report repeated seizures within 24 hours immediately"
    ],
    management: [
      "Place child on side (recovery position) during seizure",
      "Clear surrounding area of hazards; do not restrain the child",
      "Do not place anything in the child's mouth during the seizure",
      "Administer antipyretics (acetaminophen or ibuprofen) as ordered after seizure",
      "Apply tepid sponging if ordered; avoid cold water or alcohol baths",
      "Maintain IV access as directed",
      "Keep suction equipment at bedside"
    ],
    nursingActions: [
      "Ensure seizure precautions are in place: padded side rails, suction at bedside, oxygen available",
      "Time the seizure from onset and document all observations",
      "Position child in lateral recovery position during seizure",
      "Monitor vital signs every 15 minutes post-seizure as directed",
      "Report post-ictal state duration and any new neurological findings to the RN",
      "Educate parents that simple febrile seizures do not cause brain damage",
      "Reassure parents and provide emotional support during the event",
      "Document seizure characteristics: onset, duration, movements, post-ictal state"
    ],
    signs: {
      left: [
        "Rapid temperature rise (often >38.5°C / 101.3°F)",
        "Generalized tonic-clonic movements",
        "Loss of consciousness",
        "Duration typically <5 minutes"
      ],
      right: [
        "Post-ictal drowsiness and confusion",
        "Brief apnea during seizure",
        "Cyanosis during prolonged episode",
        "Incontinence (urinary or fecal)"
      ]
    },
    medications: [
      { name: "Acetaminophen", type: "Antipyretic/Analgesic", action: "Inhibits prostaglandin synthesis in the CNS to reduce fever", sideEffects: "Hepatotoxicity in overdose, rash", contra: "Severe hepatic impairment, known hypersensitivity", pearl: "Dose 10-15 mg/kg every 4-6 hours. Does not prevent febrile seizures but treats fever and discomfort. Administer as ordered." },
      { name: "Diazepam (rectal)", type: "Benzodiazepine", action: "Enhances GABA-A receptor activity to terminate seizure activity", sideEffects: "Respiratory depression, sedation, hypotension", contra: "Respiratory compromise, acute narrow-angle glaucoma", pearl: "Used for prolonged seizures >5 minutes. Monitor respiratory status closely after administration. Report any respiratory changes immediately." },
      { name: "Ibuprofen", type: "NSAID/Antipyretic", action: "Inhibits COX-1 and COX-2, reducing prostaglandin-mediated fever", sideEffects: "GI upset, renal impairment, bleeding risk", contra: "Age <6 months, active GI bleeding, renal impairment", pearl: "Dose 5-10 mg/kg every 6-8 hours. May be alternated with acetaminophen as ordered. Do not use in dehydrated children." }
    ],
    pearls: [
      "Simple febrile seizures do not increase the risk of epilepsy or cause brain damage",
      "The rate of temperature rise is more important than the absolute temperature in triggering seizures",
      "Rectal diazepam is the rescue medication for seizures lasting >5 minutes",
      "Parents should be taught seizure first aid: side-lying position, time the seizure, do not restrain",
      "Most febrile seizures are self-limiting and resolve within 1-2 minutes"
    ],
    quiz: [
      { question: "A 2-year-old is having a febrile seizure. What is the RPN's priority action?", options: ["Restrain the child to prevent injury", "Place the child on their side and time the seizure", "Insert an oral airway immediately", "Administer acetaminophen during the seizure"], correct: 1, rationale: "The priority is to place the child in a lateral recovery position to maintain airway patency and time the seizure. Never restrain or insert objects into the mouth during a seizure." },
      { question: "Which characteristic differentiates a complex from a simple febrile seizure?", options: ["Occurrence with fever", "Duration greater than 15 minutes", "Age of onset between 6 months and 5 years", "Generalized tonic-clonic movements"], correct: 1, rationale: "Complex febrile seizures last >15 minutes, have focal features, or recur within 24 hours. Simple febrile seizures are generalized, brief (<15 min), and occur once in 24 hours." },
      { question: "After a febrile seizure, the parent asks if the child will develop epilepsy. What is the most appropriate RPN response?", options: ["Yes, all children with febrile seizures develop epilepsy", "Simple febrile seizures do not significantly increase the risk of epilepsy", "The child needs to start anti-epileptic medication immediately", "Febrile seizures always cause permanent brain damage"], correct: 1, rationale: "Simple febrile seizures are benign and do not significantly increase the risk of developing epilepsy. They do not cause brain damage or long-term neurological problems." }
    ]
  },

  "febrile-seizures-rn": {
    title: "Febrile Seizures",
    image: imgFebrileSeizures,
    cellular: {
      title: "Neuronal Excitability and Thermoregulation",
      content: "Febrile seizures result from the interaction between an immature central nervous system and rapid temperature elevation. The pediatric brain has a lower seizure threshold due to incomplete myelination, higher neuronal density, and greater excitatory-to-inhibitory neurotransmitter ratios. Pro-inflammatory cytokines (IL-1β, TNF-α) released during febrile illness further lower the seizure threshold by enhancing glutamate activity and reducing GABA-mediated inhibition. The nurse performs comprehensive neurological assessment, differentiates simple from complex febrile seizures, implements seizure protocols, manages antipyretic therapy, coordinates diagnostic workup, and provides evidence-based parent education."
    },
    riskFactors: [
      "Age 6 months to 5 years (peak incidence 12-18 months)",
      "Family history of febrile seizures (first-degree relative increases risk 2-3x)",
      "Rapid temperature elevation rather than peak temperature",
      "Viral infections: HHV-6 (roseola), influenza, adenovirus",
      "Recent vaccination (slight transient risk with DTaP day 1, MMR days 8-14)",
      "Iron deficiency anemia",
      "Neonatal nursery stay >30 days",
      "Developmental delay"
    ],
    diagnostics: [
      "Perform comprehensive neurological assessment: level of consciousness, pupil response, fontanelle status, meningeal signs",
      "Differentiate simple vs. complex febrile seizure based on duration, focal features, and recurrence",
      "Assess for source of infection: otitis media, pharyngitis, UTI, pneumonia",
      "Evaluate for meningeal signs: nuchal rigidity, Kernig sign, Brudzinski sign",
      "Monitor CBC, CMP, blood glucose, urinalysis to identify infection source",
      "Assess need for lumbar puncture per protocol (especially if <12 months, unvaccinated, or meningeal signs)",
      "Continuous cardiorespiratory monitoring during and post-seizure"
    ],
    management: [
      "Implement seizure protocol: maintain airway, position laterally, time seizure, have suction ready",
      "Administer rescue benzodiazepine per protocol if seizure >5 minutes (diazepam rectal or midazolam intranasal)",
      "Initiate continuous cardiorespiratory monitoring",
      "Administer weight-based antipyretics per protocol after seizure activity ceases",
      "Obtain IV access and blood work as ordered",
      "Coordinate neurological consultation for complex febrile seizures",
      "Implement post-ictal monitoring protocol with neuro checks every 15 minutes",
      "Evaluate hydration status and initiate fluid resuscitation as needed"
    ],
    nursingActions: [
      "Perform systematic seizure assessment: time of onset, type, duration, body parts involved, eye deviation, post-ictal state",
      "Classify seizure as simple or complex and communicate classification to the provider",
      "Assess Glasgow Coma Scale and monitor post-ictal recovery trajectory",
      "Monitor temperature trend and response to antipyretics",
      "Perform age-appropriate head-to-toe assessment to identify infection source",
      "Educate parents on seizure first aid, when to call 911, and febrile seizure recurrence risk",
      "Develop and review seizure action plan with family before discharge",
      "Document seizure event in detail: onset, duration, movements, interventions, response"
    ],
    signs: {
      left: [
        "Rapid temperature rise (>38.5°C / 101.3°F)",
        "Generalized tonic-clonic activity",
        "Loss of consciousness",
        "Eyes rolling upward or deviated",
        "Duration typically 1-3 minutes"
      ],
      right: [
        "Post-ictal lethargy (30 min to 2 hours)",
        "Transient post-ictal confusion",
        "Brief cyanosis or apnea",
        "Incontinence",
        "Todd's paralysis (after complex seizure)"
      ]
    },
    medications: [
      { name: "Diazepam (rectal gel)", type: "Benzodiazepine", action: "Enhances GABA-A receptor-mediated chloride influx to terminate seizure activity", sideEffects: "Respiratory depression, excessive sedation, hypotension, paradoxical agitation", contra: "Respiratory compromise, acute narrow-angle glaucoma, myasthenia gravis", pearl: "Rectal dose: 0.5 mg/kg for ages 2-5 years. Monitor respiratory rate and SpO2 for at least 2 hours post-administration. Have bag-valve-mask at bedside." },
      { name: "Midazolam (intranasal)", type: "Benzodiazepine", action: "Rapid-onset GABA-A enhancement via intranasal absorption for seizure termination", sideEffects: "Respiratory depression, sedation, nasal irritation", contra: "Severe respiratory insufficiency, shock", pearl: "Intranasal route achieves therapeutic levels in 3-5 minutes. Dose: 0.2 mg/kg. Increasingly preferred over rectal diazepam for ease of administration." },
      { name: "Acetaminophen", type: "Antipyretic/Analgesic", action: "Central prostaglandin synthesis inhibition to reduce fever set-point", sideEffects: "Hepatotoxicity in overdose, rare allergic reactions", contra: "Severe hepatic disease, G6PD deficiency (relative)", pearl: "Weight-based dosing: 10-15 mg/kg q4-6h. Maximum 75 mg/kg/day. Does not prevent seizure recurrence but treats underlying fever and improves comfort." },
      { name: "Ibuprofen", type: "NSAID/Antipyretic", action: "Peripheral COX inhibition reducing prostaglandin-mediated fever and inflammation", sideEffects: "GI irritation, renal impairment, bleeding risk", contra: "Age <6 months, dehydration, renal impairment, active GI bleeding", pearl: "Dose 5-10 mg/kg q6-8h. More sustained antipyretic effect than acetaminophen. Ensure adequate hydration before administering." }
    ],
    pearls: [
      "Simple febrile seizures have a 30-35% recurrence risk; younger age at first seizure increases recurrence",
      "Lumbar puncture should be strongly considered in children <12 months with first febrile seizure, as meningeal signs may be absent",
      "EEG is not routinely indicated for simple febrile seizures and does not predict epilepsy risk",
      "Antipyretics treat fever and discomfort but have NOT been proven to prevent febrile seizure recurrence",
      "Children with complex febrile seizures have a slightly higher (2-5%) risk of later epilepsy compared to 1% for simple febrile seizures"
    ],
    quiz: [
      { question: "A 14-month-old presents with a first-time febrile seizure. Which assessment finding would prompt the nurse to request a lumbar puncture?", options: ["Temperature of 39°C", "Seizure duration of 2 minutes", "Bulging fontanelle and inconsolable crying", "Post-ictal drowsiness lasting 20 minutes"], correct: 2, rationale: "A bulging fontanelle and inconsolable crying are concerning for meningitis. In children <12-18 months, meningeal signs may be subtle, and a lumbar puncture is strongly considered to rule out CNS infection." },
      { question: "Which classification criteria indicates a complex febrile seizure?", options: ["Generalized tonic-clonic activity lasting 3 minutes", "Focal seizure with left arm jerking lasting 20 minutes", "Single seizure episode in a 2-year-old with fever", "Post-ictal drowsiness for 15 minutes"], correct: 1, rationale: "A focal seizure lasting >15 minutes meets criteria for complex febrile seizure. Complex features include focal onset, duration >15 minutes, or recurrence within 24 hours." },
      { question: "A parent asks the nurse if giving acetaminophen around the clock during illness will prevent febrile seizures. What is the evidence-based response?", options: ["Yes, scheduled antipyretics effectively prevent febrile seizures", "No, studies have shown that antipyretics do not prevent febrile seizure recurrence", "Yes, alternating acetaminophen and ibuprofen eliminates seizure risk", "Antipyretics should be avoided during febrile illnesses in children"], correct: 1, rationale: "Research consistently demonstrates that antipyretics, while effective for treating fever and improving comfort, do not prevent febrile seizure recurrence. Parents should be counseled accordingly." }
    ]
  },

  "febrile-seizures-np": {
    title: "Febrile Seizures",
    image: imgFebrileSeizures,
    cellular: {
      title: "Seizure Neurophysiology and Febrile Response",
      content: "Febrile seizures arise from the convergence of age-dependent neuronal hyperexcitability and systemic inflammatory response. The immature brain exhibits enhanced excitatory amino acid (glutamate, aspartate) neurotransmission, reduced GABAergic inhibition, and incomplete axonal myelination, creating a low seizure threshold. Pyrogens (IL-1β, IL-6, TNF-α, PGE2) act on hypothalamic thermoregulatory centers to reset the temperature set-point while simultaneously enhancing neuronal excitability through direct effects on ion channel kinetics—accelerating sodium channel recovery and reducing potassium conductance. Genetic susceptibility loci (FEB1-FEB8) influence channelopathy variants, particularly SCN1A and GABRG2 mutations, which overlap with genetic epilepsy syndromes. The clinician must conduct differential diagnosis, order and interpret diagnostic workup, prescribe treatment, determine need for neuroimaging or EEG, and manage long-term seizure recurrence planning."
    },
    riskFactors: [
      "Age 6-60 months with peak at 12-18 months",
      "Genetic susceptibility: FEB1-FEB8 loci, SCN1A, GABRG2 polymorphisms",
      "First-degree family history (autosomal dominant with reduced penetrance in some families)",
      "Viral triggers: HHV-6 (roseola—highest association), influenza A/B, adenovirus, parainfluenza",
      "Post-immunization fever (DTaP day 0-1, MMR days 8-14, but seizure risk is from fever, not vaccine)",
      "Iron deficiency anemia (odds ratio 1.3-3.8)",
      "Zinc deficiency (emerging evidence)",
      "Neonatal ICU stay >28 days"
    ],
    diagnostics: [
      "Order CBC with differential, CMP, blood glucose, blood culture if toxic-appearing",
      "Order urinalysis and urine culture (UTI is common occult source in febrile children <2 years)",
      "Determine need for lumbar puncture: required if <6 months, strongly consider if 6-12 months or unimmunized against H. influenzae type b and S. pneumoniae",
      "Interpret CSF results: cell count, protein, glucose, Gram stain, culture, and viral PCR panel",
      "Order EEG only if complex features present or neurological exam is abnormal post-ictally",
      "Order neuroimaging (MRI preferred over CT) only if focal neurological deficit, prolonged post-ictal state, or concern for structural lesion",
      "Evaluate iron studies (ferritin, serum iron, TIBC) if recurrent febrile seizures"
    ],
    management: [
      "Prescribe weight-based antipyretics for comfort (acetaminophen 10-15 mg/kg q4-6h or ibuprofen 5-10 mg/kg q6-8h for age >6 months)",
      "Prescribe rectal diazepam (Diastat) rescue kit for home use in children with recurrent febrile seizures (0.5 mg/kg for ages 2-5)",
      "Consider intranasal midazolam (0.2 mg/kg) as alternative rescue therapy",
      "Prescribe antibiotics based on identified infection source",
      "Do NOT prescribe daily anti-epileptic drugs for simple febrile seizures (AAP guideline)",
      "Consider intermittent oral diazepam (0.33 mg/kg q8h during febrile illness) only for high-risk recurrence cases after shared decision-making",
      "Order iron supplementation if iron deficiency anemia is confirmed",
      "Develop individualized seizure action plan for school and daycare"
    ],
    nursingActions: [
      "Perform comprehensive neurological examination: cranial nerves, motor, sensory, reflexes, developmental milestones",
      "Assess developmental trajectory and determine if seizure caused any regression",
      "Calculate seizure recurrence risk based on age, family history, temperature at seizure, and seizure characteristics",
      "Counsel family on natural history: 30-35% recurrence risk, no increased risk of cognitive impairment",
      "Prescribe and educate on Diastat (rectal diazepam) rescue protocol for families of children with recurrent febrile seizures",
      "Determine immunization plan: febrile seizures are NOT a contraindication to vaccination",
      "Schedule follow-up within 1-2 weeks to reassess neurological status",
      "Refer to pediatric neurology if complex febrile seizures, abnormal development, or family history of epilepsy"
    ],
    signs: {
      left: [
        "Rapid temperature rise (often >39°C / 102.2°F)",
        "Generalized tonic-clonic activity (simple)",
        "Brief duration (1-3 minutes typical)",
        "Normal interictal EEG",
        "Normal neurological exam after post-ictal period"
      ],
      right: [
        "Focal onset or lateralized features (complex)",
        "Duration >15 minutes (complex/febrile status)",
        "Recurrence within 24 hours (complex)",
        "Prolonged post-ictal state (>1 hour)",
        "Todd's paralysis (suggests focal origin)"
      ]
    },
    medications: [
      { name: "Diazepam rectal gel (Diastat)", type: "Benzodiazepine rescue", action: "Rapid GABA-A receptor potentiation for seizure termination via rectal absorption", sideEffects: "Respiratory depression, excessive sedation, ataxia, paradoxical agitation", contra: "Untreated narrow-angle glaucoma, severe respiratory insufficiency, sleep apnea", pearl: "Prescribe for home rescue if seizures >5 min. Age-based dosing: 0.5 mg/kg (age 2-5), 0.3 mg/kg (age 6-11). Train caregivers on administration. Include in seizure action plan." },
      { name: "Midazolam (intranasal/buccal)", type: "Benzodiazepine rescue", action: "Rapid mucosal absorption with GABA-A potentiation, achieving brain levels in 3-5 minutes", sideEffects: "Respiratory depression, sedation, hiccups, nasal burning", contra: "Severe respiratory failure, shock, concurrent CNS depressants", pearl: "RAMPART trial demonstrated non-inferiority of IM midazolam to IV lorazepam. Intranasal/buccal routes increasingly used for pre-hospital rescue. Dose: 0.2 mg/kg intranasal." },
      { name: "Oral Diazepam (intermittent prophylaxis)", type: "Benzodiazepine (oral)", action: "Enhances GABA-mediated inhibition during febrile episodes to reduce seizure recurrence risk", sideEffects: "Sedation, ataxia, behavioral changes, respiratory depression", contra: "Respiratory compromise, severe hepatic disease", pearl: "Intermittent oral diazepam 0.33 mg/kg q8h during febrile illness reduces recurrence by ~44% but causes significant sedation. Only consider after shared decision-making for high-risk recurrence." },
      { name: "Ferrous sulfate", type: "Iron supplement", action: "Replenishes iron stores needed for neuronal myelination and neurotransmitter synthesis", sideEffects: "GI upset, constipation, dark stools, staining of teeth (liquid form)", contra: "Iron overload, hemochromatosis, hemolytic anemias", pearl: "Dose 3-6 mg/kg/day of elemental iron. Correct iron deficiency anemia which is an independent risk factor for febrile seizure recurrence. Give with vitamin C to enhance absorption." }
    ],
    pearls: [
      "AAP guidelines: prophylactic anti-epileptic drugs are NOT recommended for simple febrile seizures due to side effect burden exceeding benefit",
      "Risk of epilepsy after simple febrile seizure is only ~1% (same as general population); complex febrile seizures carry 2-5% risk",
      "Febrile seizures are NOT a contraindication to any vaccine; post-vaccination prophylactic antipyretics can be discussed",
      "SCN1A mutations should be considered if febrile seizures are prolonged, recurrent, or associated with developmental regression (Dravet syndrome)",
      "Iron deficiency is a modifiable risk factor for febrile seizure recurrence: screen with ferritin in children with recurrent episodes"
    ],
    quiz: [
      { question: "A 10-month-old presents with a first simple febrile seizure. The child is up-to-date on vaccines and has a normal neurological exam. Which diagnostic is most appropriate?", options: ["Emergent CT scan of the head", "Routine EEG within 24 hours", "Evaluation for source of fever; lumbar puncture should be considered given age", "No workup is needed; discharge home immediately"], correct: 2, rationale: "For children 6-12 months with a first febrile seizure, lumbar puncture should be considered as meningeal signs can be unreliable at this age. Source of fever should be identified. EEG and neuroimaging are not routinely indicated for simple febrile seizures." },
      { question: "A parent requests daily anti-seizure medication for their child who has had two simple febrile seizures. What is the NP's evidence-based response?", options: ["Prescribe phenobarbital daily as it is proven to prevent recurrence", "Prescribe levetiracetam as first-line prophylaxis", "Explain that AAP guidelines do not recommend daily AEDs for simple febrile seizures due to unfavorable risk-benefit ratio", "Start valproic acid immediately to prevent brain damage"], correct: 2, rationale: "The AAP strongly recommends against daily anti-epileptic drugs for simple febrile seizures. The side effects of chronic AED therapy outweigh the benefits, and febrile seizures are benign with no evidence of brain damage or increased epilepsy risk." },
      { question: "Which finding in a febrile child should prompt the clinician to order neuroimaging?", options: ["Post-ictal drowsiness lasting 20 minutes", "Generalized seizure lasting 2 minutes", "Persistent focal neurological deficit after post-ictal period resolves", "Temperature of 40°C with bilateral tonic-clonic seizure"], correct: 2, rationale: "A persistent focal neurological deficit after the post-ictal period suggests a structural brain lesion and warrants neuroimaging (MRI preferred). Post-ictal drowsiness and brief generalized seizures are expected in simple febrile seizures." }
    ]
  },

  "iron-deficiency-anemia-rpn": {
    title: "Iron Deficiency Anemia",
    cellular: {
      title: "Iron and Erythropoiesis",
      content: "Iron deficiency anemia (IDA) is the most common nutritional deficiency worldwide, resulting from inadequate iron stores to support hemoglobin synthesis. Iron is essential for the heme molecule within hemoglobin, which carries oxygen in red blood cells. When iron stores are depleted, the bone marrow produces small (microcytic), pale (hypochromic) red blood cells with reduced oxygen-carrying capacity. This leads to tissue hypoxia, compensatory tachycardia, and fatigue. The nurse monitors for signs and symptoms of anemia, administers iron supplements and other medications as ordered, reinforces dietary education, and reports changes in patient status."
    },
    riskFactors: [
      "Inadequate dietary iron intake",
      "Menstruation (heavy menstrual bleeding is the leading cause in premenopausal women)",
      "Pregnancy and lactation (increased iron demand)",
      "Chronic GI blood loss (ulcers, polyps, colorectal cancer)",
      "Malabsorption (celiac disease, gastric bypass, H. pylori infection)",
      "Infants on cow's milk before 12 months",
      "Vegetarian or vegan diet without iron planning",
      "Frequent blood donation"
    ],
    diagnostics: [
      "Monitor hemoglobin and hematocrit levels as reported",
      "Report signs of worsening anemia: increased fatigue, pallor, dizziness",
      "Monitor heart rate and blood pressure for compensatory tachycardia",
      "Observe for pica (craving non-food items like ice or dirt) and report",
      "Monitor stool characteristics: dark stools with iron supplementation are expected",
      "Report any signs of GI bleeding: melena, hematochezia"
    ],
    management: [
      "Administer oral iron supplements as ordered (on empty stomach with vitamin C for absorption)",
      "Educate on iron-rich foods: red meat, spinach, beans, fortified cereals",
      "Educate on substances that inhibit iron absorption: calcium, antacids, tea, coffee",
      "Administer stool softeners as ordered to manage iron-related constipation",
      "Assist with activity tolerance: allow rest periods, monitor for orthostatic hypotension",
      "Report hemoglobin <7 g/dL or symptomatic anemia to the RN"
    ],
    nursingActions: [
      "Assess for signs and symptoms of anemia: pallor, fatigue, tachycardia, dyspnea on exertion",
      "Monitor vital signs and report resting tachycardia or orthostatic hypotension",
      "Administer oral iron supplements as ordered and educate on proper timing",
      "Monitor for side effects of iron therapy: constipation, nausea, dark stools",
      "Report worsening symptoms despite iron therapy to the RN",
      "Educate patient on dietary sources of iron and foods that enhance or inhibit absorption",
      "Implement fall precautions due to dizziness and orthostatic changes",
      "Document intake and adherence to iron supplementation regimen"
    ],
    signs: {
      left: [
        "Fatigue and weakness",
        "Pallor (conjunctival, palmar, nail beds)",
        "Tachycardia at rest",
        "Dyspnea on exertion",
        "Dizziness and lightheadedness"
      ],
      right: [
        "Koilonychia (spoon-shaped nails)",
        "Glossitis (smooth, sore tongue)",
        "Angular cheilitis (mouth corner cracking)",
        "Pica (craving ice, clay, starch)",
        "Cold intolerance"
      ]
    },
    medications: [
      { name: "Ferrous sulfate", type: "Oral iron supplement", action: "Provides elemental iron for hemoglobin synthesis and red blood cell production", sideEffects: "Constipation, nausea, abdominal cramping, black/dark stools", contra: "Hemochromatosis, hemolytic anemia, concurrent IV iron", pearl: "Take on empty stomach 1 hour before meals with vitamin C (orange juice) to enhance absorption. Stools will turn dark—this is expected. Use a straw for liquid forms to prevent tooth staining." },
      { name: "Docusate sodium", type: "Stool softener", action: "Increases water and fat penetration into stool to ease passage", sideEffects: "Diarrhea, abdominal cramping", contra: "Intestinal obstruction", pearl: "Commonly co-prescribed with iron supplements to prevent constipation. Encourage adequate fluid intake." },
      { name: "Ascorbic acid (Vitamin C)", type: "Vitamin supplement", action: "Reduces ferric iron (Fe3+) to ferrous iron (Fe2+) in the GI tract, enhancing absorption", sideEffects: "GI upset in high doses, kidney stones (rare)", contra: "Hemochromatosis, G6PD deficiency (high doses)", pearl: "Taking 200 mg of vitamin C with each iron dose can increase absorption by 2-3 fold. Orange juice is a practical alternative." }
    ],
    pearls: [
      "Dark or black stools are an expected side effect of oral iron therapy and do not indicate GI bleeding",
      "Iron supplements should be taken on an empty stomach; if GI upset is intolerable, take with a small amount of food (not dairy)",
      "Pica (especially pagophagia—ice craving) is a specific clinical sign of iron deficiency that resolves with treatment",
      "It takes 2-3 months of iron therapy to normalize hemoglobin and 6 months to replenish iron stores",
      "Separate iron from calcium supplements, antacids, and tetracyclines by at least 2 hours"
    ],
    quiz: [
      { question: "A patient on oral iron therapy reports black stools. What is the appropriate RPN action?", options: ["Hold the iron supplement and report immediately", "Reassure the patient that dark stools are an expected side effect of oral iron", "Perform a stool guaiac test immediately", "Increase the iron dose"], correct: 1, rationale: "Dark or black stools are a normal and expected side effect of oral iron supplementation. The patient should be reassured that this is not concerning as long as there are no other signs of GI bleeding." },
      { question: "Which instruction should the nurse reinforce regarding oral iron administration?", options: ["Take iron with milk to reduce stomach upset", "Take iron with vitamin C or orange juice to enhance absorption", "Take iron with antacids to prevent nausea", "Take iron with calcium supplements for best absorption"], correct: 1, rationale: "Vitamin C enhances iron absorption by reducing ferric iron to ferrous iron. Milk, antacids, and calcium inhibit iron absorption and should be separated from iron doses by at least 2 hours." },
      { question: "Which assessment finding is most indicative of iron deficiency anemia?", options: ["Jaundice and dark urine", "Spoon-shaped nails and pica", "Petechiae and purpura", "Lymphadenopathy and night sweats"], correct: 1, rationale: "Koilonychia (spoon-shaped nails) and pica (craving non-food items like ice) are classic signs specific to iron deficiency anemia. Jaundice suggests hemolytic anemia; petechiae suggest thrombocytopenia." }
    ]
  },

  "iron-deficiency-anemia-rn": {
    title: "Iron Deficiency Anemia",
    cellular: {
      title: "Iron Metabolism and Hematopoiesis",
      content: "Iron deficiency anemia (IDA) develops through three progressive stages: (1) iron depletion—reduced ferritin stores with normal hemoglobin; (2) iron-deficient erythropoiesis—low serum iron, elevated TIBC, reduced transferrin saturation (<20%), with early microcytosis; (3) iron deficiency anemia—low hemoglobin with microcytic, hypochromic RBCs and elevated RDW. The body absorbs dietary iron primarily in the duodenum via divalent metal transporter-1 (DMT1), with hepcidin acting as the master regulator of iron homeostasis. The nurse performs comprehensive assessment, interprets laboratory trends, manages transfusion therapy for severe cases, administers IV iron infusions, monitors for adverse reactions, and provides individualized patient education."
    },
    riskFactors: [
      "Menorrhagia (most common cause in premenopausal women)",
      "GI blood loss: peptic ulcer disease, NSAID use, colorectal cancer, inflammatory bowel disease",
      "Pregnancy (iron requirements increase to 27 mg/day)",
      "Malabsorption syndromes: celiac disease, Crohn's disease, bariatric surgery",
      "Chronic kidney disease (reduced erythropoietin production)",
      "Helicobacter pylori infection (impairs iron absorption)",
      "Vegetarian/vegan diet without adequate planning",
      "Frequent phlebotomy or blood donation"
    ],
    diagnostics: [
      "Interpret CBC findings: low Hgb/Hct, low MCV (<80 fL), low MCH, elevated RDW",
      "Evaluate iron studies: low serum iron, low ferritin (<30 ng/mL), elevated TIBC, low transferrin saturation (<20%)",
      "Assess peripheral blood smear for microcytic, hypochromic RBCs, target cells, pencil cells",
      "Monitor reticulocyte count: should increase 7-10 days after initiating iron therapy",
      "Evaluate soluble transferrin receptor (sTfR) if concurrent inflammation may falsely elevate ferritin",
      "Assess stool guaiac or FIT for occult GI blood loss",
      "Monitor comprehensive metabolic panel for renal function in CKD-associated anemia"
    ],
    management: [
      "Administer oral iron therapy per protocol: ferrous sulfate 325 mg (65 mg elemental iron) 1-3 times daily",
      "Administer IV iron infusion per protocol for patients with intolerance, malabsorption, or Hgb <7 g/dL",
      "Prepare for and manage blood transfusion per protocol for symptomatic anemia with Hgb <7 g/dL",
      "Monitor for IV iron infusion reactions: anaphylaxis, hypotension, flushing, chest tightness",
      "Coordinate with gastroenterology for endoscopic evaluation if GI source suspected",
      "Implement fall precautions for symptomatic patients",
      "Monitor for transfusion reactions per protocol: fever, chills, urticaria, back pain, dyspnea"
    ],
    nursingActions: [
      "Perform comprehensive anemia assessment: skin color, mucous membranes, capillary refill, activity tolerance",
      "Monitor hemodynamic status: heart rate, blood pressure, orthostatic vital signs",
      "Administer IV iron infusion per protocol with test dose monitoring for first 15 minutes",
      "Monitor for infusion-related reactions: hypotension, flushing, dyspnea, chest pain, back pain",
      "Assess response to therapy: reticulocyte count increase at 7-10 days, hemoglobin rise of 1-2 g/dL per month",
      "Educate on iron-rich diet: heme iron (red meat, poultry, fish) absorbs better than non-heme iron (spinach, beans, fortified cereals)",
      "Counsel on iron absorption enhancers (vitamin C) and inhibitors (calcium, tannins, phytates)",
      "Coordinate GI referral for men and postmenopausal women with unexplained IDA (to rule out malignancy)"
    ],
    signs: {
      left: [
        "Fatigue and decreased exercise tolerance",
        "Pallor (conjunctival, palmar creases, nail beds)",
        "Compensatory tachycardia and systolic flow murmur",
        "Dyspnea on exertion",
        "Dizziness and orthostatic hypotension"
      ],
      right: [
        "Koilonychia (spoon nails)",
        "Glossitis (smooth, beefy red tongue)",
        "Angular cheilitis",
        "Pica and pagophagia (ice craving)",
        "Restless leg syndrome",
        "Brittle hair and diffuse hair loss"
      ]
    },
    medications: [
      { name: "Ferrous sulfate", type: "Oral iron supplement", action: "Provides 20% elemental iron (65 mg per 325 mg tablet) for hemoglobin synthesis", sideEffects: "Nausea, constipation, epigastric pain, dark stools", contra: "Hemochromatosis, hemosiderosis, concurrent parenteral iron", pearl: "Take 1 hour before meals on empty stomach with vitamin C. If GI intolerance is severe, switch to ferrous gluconate (less elemental iron but better tolerated). Expect reticulocyte rise at 7-10 days and Hgb increase of 1-2 g/dL per month." },
      { name: "Iron sucrose (Venofer)", type: "IV iron replacement", action: "Delivers iron directly to transferrin and reticuloendothelial system, bypassing GI absorption", sideEffects: "Hypotension, nausea, headache, injection site reaction, rarely anaphylaxis", contra: "Iron overload, known hypersensitivity to iron sucrose", pearl: "Administer test dose and monitor for 15 minutes. Preferred in CKD patients on dialysis. Typical dose: 200 mg IV over 2-5 minutes or diluted in NS over 15 minutes. Monitor serum ferritin and TSAT 4 weeks after course completion." },
      { name: "Ferric carboxymaltose (Injectafer)", type: "IV iron replacement", action: "High-dose IV iron preparation allowing rapid repletion with fewer infusions", sideEffects: "Hypophosphatemia, hypertension, nausea, injection site reactions", contra: "Hypersensitivity to ferric carboxymaltose, iron overload", pearl: "Can administer up to 750 mg in a single infusion (15 minutes). Usually requires only 2 doses separated by 7 days. Monitor phosphorus levels as hypophosphatemia is a unique concern." },
      { name: "Packed Red Blood Cells", type: "Blood product", action: "Immediately increases oxygen-carrying capacity by raising hemoglobin", sideEffects: "Transfusion reactions (febrile, hemolytic, allergic), volume overload, iron overload", contra: "Patient refusal, mild asymptomatic anemia", pearl: "Transfuse for Hgb <7 g/dL with symptoms or active bleeding. Each unit raises Hgb approximately 1 g/dL. Follow institutional transfusion protocol with two-nurse verification." }
    ],
    pearls: [
      "In men and postmenopausal women, iron deficiency anemia should be considered a GI malignancy until proven otherwise",
      "Reticulocyte count is the earliest indicator of response to iron therapy—expect a rise within 7-10 days",
      "Ferritin is an acute phase reactant and may be falsely elevated in infection, inflammation, or liver disease; use sTfR or ferritin/sTfR ratio to clarify",
      "IV iron is preferred over oral in CKD, inflammatory bowel disease, post-bariatric surgery, and oral iron intolerance",
      "Continue iron therapy for 3-6 months after hemoglobin normalizes to fully replenish iron stores (ferritin goal >50 ng/mL)"
    ],
    quiz: [
      { question: "Which lab finding is most consistent with iron deficiency anemia?", options: ["Elevated MCV, normal ferritin", "Low ferritin, elevated TIBC, low transferrin saturation", "Normal MCV, elevated reticulocyte count", "Elevated ferritin, low TIBC"], correct: 1, rationale: "Iron deficiency anemia is characterized by low ferritin (depleted stores), elevated TIBC (the body is trying to bind more iron), and low transferrin saturation (<20%). Elevated ferritin with low TIBC suggests anemia of chronic disease." },
      { question: "A patient receiving their first IV iron sucrose infusion develops facial flushing and chest tightness 5 minutes into the infusion. What is the priority RN action?", options: ["Continue the infusion at a slower rate", "Stop the infusion immediately and assess vital signs", "Administer diphenhydramine and continue the infusion", "Document the finding and reassess in 15 minutes"], correct: 1, rationale: "Facial flushing and chest tightness during IV iron infusion may indicate an anaphylactic reaction. The infusion must be stopped immediately, vital signs assessed, and the provider notified. Emergency equipment should be at bedside." },
      { question: "A 55-year-old male is diagnosed with iron deficiency anemia. Which additional evaluation is essential?", options: ["Thyroid function tests", "GI endoscopy to evaluate for colorectal malignancy", "Bone marrow biopsy", "Vitamin B12 level"], correct: 1, rationale: "In men and postmenopausal women, IDA warrants GI evaluation to rule out colorectal cancer or other sources of GI blood loss. This is a high-yield clinical pearl." }
    ]
  },

  "iron-deficiency-anemia-np": {
    title: "Iron Deficiency Anemia",
    cellular: {
      title: "Iron Homeostasis and Differential Diagnosis",
      content: "Iron homeostasis is regulated by the hepcidin-ferroportin axis. Hepcidin, a hepatic peptide hormone, is the master regulator: it binds to ferroportin (the sole iron exporter on enterocytes and macrophages), causing its internalization and degradation, thereby reducing iron absorption and release from stores. In iron deficiency, hepcidin is suppressed, maximizing iron absorption. In anemia of chronic disease (ACD), inflammatory cytokines (IL-6) upregulate hepcidin, trapping iron in macrophages despite adequate stores—creating functional iron deficiency. The clinician must differentiate IDA from ACD, thalassemia trait, and sideroblastic anemia using advanced iron studies, prescribe appropriate iron formulations (oral vs. parenteral), investigate underlying etiology, and manage refractory cases."
    },
    riskFactors: [
      "Chronic blood loss: menorrhagia, GI bleeding (PUD, IBD, angiodysplasia, colorectal cancer), hematuria",
      "Malabsorption: celiac disease, H. pylori gastritis, autoimmune atrophic gastritis, post-bariatric surgery (especially Roux-en-Y)",
      "Increased demand: pregnancy (27 mg/day requirement), lactation, rapid growth in adolescents",
      "Dietary insufficiency: strict vegan/vegetarian diet, eating disorders",
      "Chronic kidney disease (reduced erythropoietin, chronic inflammation)",
      "Heart failure (iron deficiency present in 30-50% of HF patients independent of anemia)",
      "Medications: PPIs (reduce iron absorption), NSAIDs (GI blood loss), anticoagulants",
      "Frequent phlebotomy or blood donation"
    ],
    diagnostics: [
      "Order and interpret complete iron panel: serum iron, ferritin, TIBC, transferrin saturation (TSAT)",
      "Differentiate IDA from ACD: IDA has low ferritin, high TIBC, low TSAT; ACD has normal/high ferritin, low TIBC, low TSAT",
      "Order soluble transferrin receptor (sTfR) and calculate sTfR/log ferritin index to differentiate IDA from ACD in mixed presentations",
      "Evaluate peripheral smear: microcytic hypochromic RBCs, anisocytosis (elevated RDW), target cells, pencil cells",
      "Order hemoglobin electrophoresis if MCV is disproportionately low relative to anemia severity (consider thalassemia trait)",
      "Order GI evaluation: upper endoscopy and colonoscopy for men, postmenopausal women, or anyone >40 with unexplained IDA",
      "Order celiac panel (anti-tTG IgA) and H. pylori testing if malabsorption suspected",
      "Consider hepcidin level in complex cases to guide oral vs. IV iron decision"
    ],
    management: [
      "Prescribe oral iron: ferrous sulfate 325 mg (65 mg elemental iron) PO daily to TID on empty stomach with vitamin C",
      "Prescribe alternate oral formulations for intolerance: ferrous gluconate 325 mg (36 mg elemental) or polysaccharide iron complex",
      "Prescribe IV iron for: oral intolerance, malabsorption, CKD/dialysis, IBD, pregnancy 2nd/3rd trimester with Hgb <10, HF with iron deficiency",
      "Select IV iron formulation: iron sucrose (CKD), ferric carboxymaltose (rapid repletion), ferumoxytol (single high-dose infusion)",
      "Calculate total iron deficit: weight (kg) × (target Hgb – actual Hgb) × 2.4 + 500 mg (for stores)",
      "Prescribe erythropoiesis-stimulating agents (ESA) for CKD-associated anemia only after iron repletion (TSAT >20%, ferritin >100)",
      "Order blood transfusion for Hgb <7 g/dL with hemodynamic instability or active hemorrhage",
      "Treat underlying cause: PPI for PUD, GnRH agonist or IUD for menorrhagia, gluten-free diet for celiac disease"
    ],
    nursingActions: [
      "Conduct differential diagnosis workup systematically: assess bleeding history, dietary intake, GI symptoms, menstrual history",
      "Order and interpret age/sex-appropriate cancer screening if GI source suspected",
      "Calculate Mentzer index (MCV/RBC count): >13 favors IDA, <13 favors thalassemia trait",
      "Prescribe and monitor response to iron therapy: reticulocyte count at 1-2 weeks, CBC at 4-8 weeks",
      "Adjust therapy based on response: if Hgb does not increase by 1 g/dL in 4 weeks on oral iron, evaluate for non-adherence, malabsorption, or ongoing blood loss",
      "Assess for concurrent deficiencies: B12, folate, copper, zinc",
      "Counsel on long-term iron supplementation: continue 3-6 months after Hgb normalizes (target ferritin >50 ng/mL)",
      "Refer to hematology for refractory IDA, suspected bone marrow disorder, or iron-refractory iron deficiency anemia (IRIDA)"
    ],
    signs: {
      left: [
        "Fatigue, weakness, decreased exercise tolerance",
        "Pallor of conjunctivae and palmar creases",
        "Tachycardia, systolic flow murmur",
        "Dyspnea on exertion",
        "Cognitive impairment and poor concentration"
      ],
      right: [
        "Koilonychia (spoon nails)",
        "Glossitis and angular cheilitis",
        "Pica and pagophagia",
        "Plummer-Vinson syndrome (dysphagia + esophageal web + IDA)",
        "Restless leg syndrome",
        "Beeturia (enhanced beet pigment absorption)"
      ]
    },
    medications: [
      { name: "Ferrous sulfate", type: "Oral iron supplement", action: "Provides 20% elemental iron (65 mg per 325 mg tablet) for Hgb synthesis", sideEffects: "Nausea, constipation, epigastric pain, dark stools, metallic taste", contra: "Hemochromatosis, hemosiderosis, peptic ulcer disease (relative)", pearl: "First-line therapy. Take on empty stomach 1h before meals with 200 mg vitamin C. Every-other-day dosing may improve absorption via hepcidin dynamics (IROIDA trial). Expect reticulocyte response in 7-10 days." },
      { name: "Ferric carboxymaltose (Injectafer)", type: "IV iron replacement", action: "Stable iron-carbohydrate complex delivering iron to transferrin and RES for rapid store repletion", sideEffects: "Hypophosphatemia (up to 50%), hypertension, nausea, injection site reactions", contra: "Hypersensitivity, iron overload", pearl: "Can deliver 750 mg in 15 minutes. Two-dose regimen separated by 7 days. Unique risk of severe hypophosphatemia: check phosphorus at 2 weeks. Preferred for rapid outpatient repletion." },
      { name: "Ferumoxytol (Feraheme)", type: "IV iron replacement", action: "Superparamagnetic iron oxide nanoparticles taken up by macrophages for slow iron release", sideEffects: "Serious hypersensitivity reactions (boxed warning), hypotension, back pain", contra: "Known hypersensitivity, iron overload", pearl: "FDA boxed warning for anaphylaxis. Advantage: can give 510 mg in 15 minutes, two-dose course. Monitor for 30 minutes post-infusion. Can interfere with MRI for up to 3 months." },
      { name: "Epoetin alfa (Epogen/Procrit)", type: "Erythropoiesis-stimulating agent", action: "Recombinant erythropoietin stimulating RBC production in bone marrow", sideEffects: "Hypertension, thromboembolism, pure red cell aplasia (rare), cardiovascular events at high Hgb targets", contra: "Uncontrolled HTN, iron deficiency not corrected, Hgb >10 g/dL in CKD", pearl: "Only initiate after iron stores are replete (TSAT >20%, ferritin >100). Target Hgb 10-11.5 g/dL in CKD. Higher targets increase cardiovascular risk (TREAT, CREATE trials)." }
    ],
    pearls: [
      "Every-other-day oral iron dosing may be as effective as daily dosing due to hepcidin-mediated absorption blockade lasting 24 hours after each dose",
      "Plummer-Vinson syndrome (IDA + esophageal web + dysphagia) increases risk of esophageal squamous cell carcinoma",
      "Iron deficiency without anemia (ferritin <30, normal Hgb) should still be treated as it causes fatigue, cognitive impairment, and restless legs",
      "In heart failure, IV iron (ferric carboxymaltose) improves symptoms and exercise capacity even without anemia (FAIR-HF, AFFIRM-AHF trials)",
      "Iron-refractory iron deficiency anemia (IRIDA) is caused by TMPRSS6 mutations leading to constitutively elevated hepcidin: suspect if oral iron is ineffective and malabsorption is excluded"
    ],
    quiz: [
      { question: "A patient has low serum iron, elevated ferritin, and low TIBC. Which condition does this pattern most likely represent?", options: ["Iron deficiency anemia", "Anemia of chronic disease", "Thalassemia trait", "Sideroblastic anemia"], correct: 1, rationale: "Anemia of chronic disease shows low serum iron (iron is sequestered) but elevated ferritin (acute phase reactant) and low TIBC (decreased transferrin production). IDA shows low ferritin and elevated TIBC." },
      { question: "An NP prescribes ferric carboxymaltose IV for a patient with iron deficiency anemia. Which lab should be monitored 2 weeks post-infusion that is unique to this formulation?", options: ["Serum potassium", "Serum phosphorus", "Serum calcium", "Serum magnesium"], correct: 1, rationale: "Ferric carboxymaltose has a unique risk of hypophosphatemia (up to 50% of patients) mediated through increased FGF23 levels. Serum phosphorus should be monitored 2 weeks post-infusion." },
      { question: "A patient on oral iron therapy for 6 weeks shows no hemoglobin improvement. Which is the most appropriate next step?", options: ["Double the iron dose", "Switch to folic acid supplementation", "Evaluate for non-adherence, malabsorption, or ongoing blood loss", "Discontinue iron and observe for 3 months"], correct: 2, rationale: "Failure to respond to oral iron after 4-6 weeks should prompt investigation for non-adherence, malabsorption (celiac disease, H. pylori), ongoing blood loss, or incorrect diagnosis. Simply increasing the dose is unlikely to help if absorption is the issue." }
    ]
  },

  "sickle-cell-crisis-rpn": {
    title: "Sickle Cell Vaso-Occlusive Crisis",
    cellular: {
      title: "Hemoglobin S Polymerization",
      content: "Sickle cell disease (SCD) is an autosomal recessive hemoglobinopathy caused by a point mutation in the beta-globin gene, producing hemoglobin S (HbS). Under conditions of deoxygenation, dehydration, acidosis, or cold exposure, HbS polymerizes into rigid fibers that deform the red blood cell into a crescent (sickle) shape. These rigid cells cannot navigate small capillaries, causing vaso-occlusion, tissue ischemia, and intense pain. Chronic hemolysis leads to baseline anemia, jaundice, and gallstones. The nurse monitors pain levels, administers medications as ordered, maintains hydration, and reports changes in patient condition to the RN."
    },
    riskFactors: [
      "Homozygous HbSS genotype (most severe form)",
      "Dehydration",
      "Infection and fever",
      "Hypoxia and high altitude",
      "Cold exposure",
      "Physical or emotional stress",
      "Acidosis",
      "Menstruation and pregnancy"
    ],
    diagnostics: [
      "Assess pain using age-appropriate pain scale and report scores",
      "Monitor vital signs, especially temperature (infection is a major trigger and complication)",
      "Monitor oxygen saturation continuously and report SpO2 <95%",
      "Report signs of acute chest syndrome: fever, chest pain, cough, dyspnea",
      "Monitor intake and output to assess hydration status",
      "Report any change in neurological status (may indicate stroke)"
    ],
    management: [
      "Administer IV fluids as ordered to maintain hydration",
      "Administer pain medications as ordered, including opioids for severe pain",
      "Apply warm compresses to painful areas (never cold, which worsens sickling)",
      "Administer oxygen as ordered to maintain SpO2 >95%",
      "Encourage incentive spirometry every 2 hours to prevent acute chest syndrome",
      "Maintain bed rest during acute crisis with repositioning every 2 hours",
      "Administer antibiotics as ordered if infection is suspected"
    ],
    nursingActions: [
      "Assess pain characteristics, location, intensity, and response to interventions",
      "Administer analgesics as ordered and reassess pain 30 minutes after IV, 60 minutes after PO",
      "Monitor IV fluid infusion rate and intake/output",
      "Apply warm compresses to affected joints and extremities as ordered",
      "Encourage and assist with incentive spirometry every 2 hours while awake",
      "Monitor for complications: acute chest syndrome, stroke, splenic sequestration, priapism",
      "Report fever >38.5°C (101.3°F) immediately as infection risk is high due to functional asplenia",
      "Provide emotional support and non-pharmacological pain management as adjuncts"
    ],
    signs: {
      left: [
        "Severe bone and joint pain",
        "Abdominal pain",
        "Low-grade fever",
        "Swollen, tender extremities (dactylitis in children)",
        "Dark urine (hemolysis)"
      ],
      right: [
        "Tachycardia and tachypnea",
        "Jaundice and scleral icterus",
        "Pallor (chronic anemia)",
        "Priapism (painful sustained erection)",
        "Acute chest syndrome signs: fever, chest pain, new infiltrate"
      ]
    },
    medications: [
      { name: "Morphine sulfate", type: "Opioid analgesic", action: "Binds mu-opioid receptors in the CNS to modulate pain perception", sideEffects: "Respiratory depression, sedation, constipation, nausea, pruritus", contra: "Respiratory depression, paralytic ileus, known hypersensitivity", pearl: "Mainstay of severe VOC pain management. Administer as ordered and reassess pain frequently. Do not withhold pain medication based on appearance—sickle cell pain is real and severe." },
      { name: "Ketorolac", type: "NSAID", action: "Inhibits COX-1 and COX-2 to reduce prostaglandin-mediated pain and inflammation", sideEffects: "GI bleeding, renal impairment, platelet dysfunction", contra: "Active GI bleed, renal failure, perioperative CABG", pearl: "Used as adjunct to opioids for multimodal pain management. Maximum 5 days of use. Report any signs of GI bleeding." },
      { name: "Normal saline", type: "IV crystalloid fluid", action: "Restores intravascular volume, improves blood flow, and reduces HbS concentration", sideEffects: "Volume overload, hyperchloremic acidosis with excessive use", contra: "Severe volume overload, acute pulmonary edema", pearl: "Aggressive hydration at 1.5x maintenance is standard during VOC. Monitor I&O and auscultate lungs for fluid overload. Dehydration worsens sickling." }
    ],
    pearls: [
      "Never apply cold compresses to a sickle cell patient—cold promotes vasoconstriction and worsens sickling",
      "Patients with sickle cell disease have functional asplenia: fever must be treated as a medical emergency with rapid antibiotic coverage",
      "Incentive spirometry every 2 hours is critical to prevent acute chest syndrome during a pain crisis",
      "Pain in sickle cell crisis is real and often undertreated: advocate for adequate analgesia",
      "Acute chest syndrome (fever + new pulmonary infiltrate + respiratory symptoms) is the leading cause of death in SCD"
    ],
    quiz: [
      { question: "Which intervention should the nurse avoid when caring for a patient in sickle cell crisis?", options: ["Applying warm compresses to painful areas", "Administering IV fluids as ordered", "Applying ice packs to swollen joints", "Encouraging incentive spirometry"], correct: 2, rationale: "Cold application (ice packs) causes vasoconstriction and promotes further sickling and vaso-occlusion. Only warm compresses should be used for sickle cell pain." },
      { question: "A patient in sickle cell crisis develops fever of 39°C, cough, and chest pain. Which complication should the nurse suspect and report immediately?", options: ["Pneumothorax", "Acute chest syndrome", "Pulmonary embolism", "Pleural effusion"], correct: 1, rationale: "Acute chest syndrome (fever + new pulmonary infiltrate + respiratory symptoms) is a life-threatening complication of sickle cell disease and the leading cause of death in SCD patients." },
      { question: "Why is aggressive IV hydration essential during a vaso-occlusive crisis?", options: ["To dilute sickle hemoglobin and increase pain medication effectiveness", "To reduce blood viscosity and HbS concentration, improving blood flow through small vessels", "To flush out sickle cells from the body", "To prevent kidney stones"], correct: 1, rationale: "IV hydration reduces blood viscosity and HbS concentration, improves blood flow through capillaries, and helps prevent further vaso-occlusion. Dehydration is a major trigger for sickling." }
    ]
  },

  "sickle-cell-crisis-rn": {
    title: "Sickle Cell Vaso-Occlusive Crisis",
    cellular: {
      title: "Vaso-Occlusion and Chronic Hemolysis",
      content: "In sickle cell disease, the valine-for-glutamic acid substitution at position 6 of the beta-globin chain produces hemoglobin S. Under deoxygenation, HbS molecules polymerize into long, rigid fibers that distort RBC morphology into sickle shapes. These deformed cells adhere to vascular endothelium via adhesion molecules (VCAM-1, ICAM-1, P-selectin), activate the coagulation cascade, and recruit neutrophils—creating a feedforward cycle of vaso-occlusion, ischemia, and reperfusion injury. Chronic intravascular hemolysis releases free hemoglobin, which scavenges nitric oxide (NO), causing endothelial dysfunction, pulmonary hypertension, and stroke risk. The nurse manages comprehensive pain protocols, administers transfusions, monitors for acute complications, coordinates multidisciplinary care, and provides culturally sensitive pain management."
    },
    riskFactors: [
      "HbSS (sickle cell anemia—most severe), HbSC, HbS-beta-thalassemia",
      "Dehydration (increases HbS concentration and blood viscosity)",
      "Infection (fever increases metabolic demands and deoxygenation)",
      "Hypoxia from any cause (pneumonia, sleep apnea, high altitude)",
      "Cold exposure (vasoconstriction reduces tissue oxygenation)",
      "Physical overexertion and emotional stress",
      "Pregnancy (increased metabolic demand, hypercoagulability)",
      "Surgery or anesthesia (hypothermia, hypoxia risk)"
    ],
    diagnostics: [
      "Obtain CBC with reticulocyte count: assess degree of anemia and bone marrow response",
      "Compare current hemoglobin to patient's baseline (typical baseline Hgb 6-9 g/dL in HbSS)",
      "Assess reticulocyte count: elevated indicates ongoing hemolysis; sudden drop may indicate aplastic crisis",
      "Obtain type and screen/crossmatch in anticipation of transfusion",
      "Monitor LDH, indirect bilirubin, haptoglobin (hemolysis markers)",
      "Obtain chest X-ray if respiratory symptoms present (evaluate for acute chest syndrome)",
      "Obtain blood cultures if temperature >38.5°C before initiating antibiotics",
      "Order transcranial Doppler results review for stroke risk in pediatric patients"
    ],
    management: [
      "Implement multimodal pain protocol: IV opioids (morphine or hydromorphone) with PCA if ordered, plus NSAIDs as adjuncts",
      "Initiate IV hydration at 1.5x maintenance rate with isotonic fluids",
      "Administer oxygen to maintain SpO2 >95% (do not routinely administer O2 if SpO2 is adequate—may suppress erythropoiesis)",
      "Administer empiric antibiotics per protocol if temperature >38.5°C (ceftriaxone typical first-line)",
      "Prepare for simple or exchange transfusion as ordered for severe anemia, acute chest syndrome, or stroke",
      "Implement incentive spirometry protocol: 10 breaths every 2 hours while awake",
      "Coordinate hematology consultation for complex crises",
      "Monitor for and manage complications: acute chest syndrome, stroke, splenic sequestration, priapism, aplastic crisis"
    ],
    nursingActions: [
      "Perform comprehensive pain assessment using validated tools; reassess 30 min post-IV, 60 min post-PO medication",
      "Advocate for adequate pain management: sickle cell pain is frequently undertreated due to implicit bias",
      "Monitor continuous pulse oximetry and report SpO2 <95%",
      "Assess for signs of acute chest syndrome: new fever, chest pain, cough, tachypnea, new infiltrate on CXR",
      "Assess neurological status: sudden headache, unilateral weakness, speech changes suggest stroke",
      "Monitor for splenic sequestration (especially in children): sudden left-sided abdominal pain, rapidly falling Hgb, palpable spleen",
      "Administer and monitor blood transfusions per protocol with verification procedures",
      "Educate patient on hydroxyurea adherence, crisis prevention strategies, and when to seek emergency care"
    ],
    signs: {
      left: [
        "Severe bone pain (long bones, spine, pelvis)",
        "Abdominal pain (mesenteric vaso-occlusion or splenic sequestration)",
        "Dactylitis (hand-foot syndrome in children <3 years)",
        "Chronic hemolytic anemia (baseline Hgb 6-9 g/dL)",
        "Jaundice and scleral icterus"
      ],
      right: [
        "Acute chest syndrome: fever, chest pain, new infiltrate, hypoxia",
        "Stroke symptoms: sudden hemiparesis, aphasia, altered consciousness",
        "Priapism (sustained painful erection >4 hours = emergency)",
        "Splenic sequestration: rapidly enlarging spleen, falling Hgb, shock",
        "Aplastic crisis: sudden severe anemia, low reticulocyte count (parvovirus B19)"
      ]
    },
    medications: [
      { name: "Hydromorphone (Dilaudid)", type: "Opioid analgesic", action: "Potent mu-opioid receptor agonist providing superior pain relief with less histamine release than morphine", sideEffects: "Respiratory depression, sedation, constipation, nausea, pruritus", contra: "Severe respiratory depression, paralytic ileus, MAO inhibitor use within 14 days", pearl: "Often preferred over morphine in SCD as it causes less histamine release and pruritus. Use PCA when available for patient-controlled titration. Monitor sedation level and respiratory rate." },
      { name: "Hydroxyurea", type: "Disease-modifying agent", action: "Increases fetal hemoglobin (HbF) production, which inhibits HbS polymerization; also reduces WBC and platelet counts", sideEffects: "Myelosuppression (neutropenia, thrombocytopenia), skin hyperpigmentation, teratogenicity", contra: "Pregnancy, severe myelosuppression, renal impairment (dose adjust)", pearl: "Only FDA-approved disease-modifying therapy for SCD. Reduces crisis frequency by 50%, reduces ACS, and reduces need for transfusions. Monitor CBC every 4-8 weeks. Effective within 3-6 months." },
      { name: "Ceftriaxone", type: "Third-generation cephalosporin", action: "Broad-spectrum bactericidal activity covering encapsulated organisms (S. pneumoniae, H. influenzae)", sideEffects: "Diarrhea, rash, biliary pseudolithiasis, Clostridioides difficile infection", contra: "Cephalosporin allergy, neonates with hyperbilirubinemia", pearl: "Empiric first-line antibiotic for febrile SCD patients due to functional asplenia and high risk for encapsulated organism sepsis. Administer within 1 hour of fever recognition." },
      { name: "Packed Red Blood Cells (simple/exchange transfusion)", type: "Blood product", action: "Increases oxygen-carrying capacity and dilutes HbS percentage to reduce sickling", sideEffects: "Transfusion reactions, iron overload, alloimmunization (common in SCD)", contra: "Hgb >10 g/dL (simple transfusion may increase viscosity), incompatible crossmatch", pearl: "Simple transfusion for Hgb <5 g/dL or symptomatic anemia. Exchange transfusion for stroke, severe ACS, or pre-operative (target HbS <30%). SCD patients have high alloimmunization rates—use phenotypically matched, sickle-negative blood." }
    ],
    pearls: [
      "Acute chest syndrome is the leading cause of death in SCD: any new respiratory symptoms + fever in a VOC patient should trigger immediate CXR and escalation",
      "Sickle cell patients have functional asplenia by age 5: they are highly susceptible to encapsulated organisms (S. pneumoniae, H. influenzae, Salmonella)",
      "Do not transfuse above Hgb 10 g/dL in SCD: increasing Hgb above this level raises blood viscosity and worsens vaso-occlusion",
      "Hydroxyurea reduces VOC frequency by ~50% and is recommended for all patients with HbSS age ≥9 months regardless of severity",
      "Implicit bias in pain management is well-documented in SCD care: always assess pain objectively and advocate for the patient"
    ],
    quiz: [
      { question: "A patient with HbSS disease develops acute chest pain, fever, and a new infiltrate on chest X-ray during a VOC. What is the priority RN intervention?", options: ["Continue current pain management and monitor", "Initiate oxygen therapy, notify the provider, and prepare for exchange transfusion", "Apply ice packs to the chest wall", "Discharge the patient with oral antibiotics"], correct: 1, rationale: "These findings are consistent with acute chest syndrome, a life-threatening emergency. Immediate interventions include oxygen supplementation, IV antibiotics, and preparation for simple or exchange transfusion as ordered." },
      { question: "Which statement about hydroxyurea in sickle cell disease is correct?", options: ["It cures sickle cell disease by replacing HbS with HbA", "It increases fetal hemoglobin (HbF) production, reducing HbS polymerization and crisis frequency", "It is only used during acute crises for immediate pain relief", "It has no significant side effects and does not require monitoring"], correct: 1, rationale: "Hydroxyurea increases HbF, which inhibits HbS polymerization. It reduces VOC frequency by ~50%, reduces ACS episodes, and decreases transfusion needs. It requires regular CBC monitoring for myelosuppression." },
      { question: "Why should blood transfusion in SCD patients not exceed a hemoglobin of 10 g/dL?", options: ["It would cause hemolytic transfusion reaction", "Hgb >10 increases blood viscosity, potentially worsening vaso-occlusion", "The body cannot handle more than 10 g/dL of hemoglobin", "Higher hemoglobin suppresses hydroxyurea effectiveness"], correct: 1, rationale: "In SCD, transfusing Hgb above 10 g/dL increases blood viscosity, which can paradoxically worsen vaso-occlusion and trigger additional crises. Target is to keep Hgb below 10 g/dL." }
    ]
  },

  "sickle-cell-crisis-np": {
    title: "Sickle Cell Crisis",
    cellular: {
      title: "Hemoglobinopathy Management",
      content: "Sickle cell disease pathophysiology extends beyond simple vaso-occlusion to encompass sterile inflammation, chronic hemolysis-mediated vasculopathy, and progressive end-organ damage. Free hemoglobin released during intravascular hemolysis scavenges nitric oxide (NO) and generates reactive oxygen species, causing endothelial dysfunction, increased adhesion molecule expression, platelet activation, and a chronic hypercoagulable state. This NO depletion contributes to pulmonary hypertension (present in ~30% of adults with SCD), leg ulcers, priapism, and cerebrovascular disease. Disease-modifying therapies target multiple pathways: hydroxyurea increases HbF, L-glutamine reduces oxidative stress, crizanlizumab blocks P-selectin-mediated adhesion, and voxelotor increases HbS oxygen affinity. The clinician must diagnose genotype-specific complications, prescribe and monitor disease-modifying agents, manage chronic organ damage, coordinate genetic counseling, and direct acute crisis management including exchange transfusion decisions."
    },
    riskFactors: [
      "HbSS genotype (sickle cell anemia—most severe phenotype)",
      "HbS-beta-zero thalassemia (clinically similar to HbSS)",
      "History of prior acute chest syndrome (strongest predictor of recurrence)",
      "Elevated baseline WBC count (marker of vaso-occlusive risk)",
      "Low baseline HbF level (<10%)",
      "Concomitant alpha-thalassemia (may be protective by reducing MCHC)",
      "Chronic pain syndrome and opioid tolerance",
      "Sickle nephropathy (hyposthenuria, papillary necrosis, FSGS)"
    ],
    diagnostics: [
      "Order hemoglobin electrophoresis to confirm genotype: HbSS, HbSC, HbS-beta-thal0/+",
      "Monitor baseline labs: CBC, reticulocyte count, LDH, indirect bilirubin, haptoglobin, ferritin (if transfused)",
      "Order HbF percentage to guide disease-modifying therapy response (target >20% on hydroxyurea)",
      "Order echocardiogram with tricuspid regurgitant jet velocity (TRV) for pulmonary hypertension screening (TRV ≥2.5 m/s = elevated risk)",
      "Order transcranial Doppler in children ages 2-16 annually for stroke risk (abnormal: velocity ≥200 cm/s = chronic transfusion program)",
      "Order iron studies and liver iron concentration (MRI-based) for transfusion-related iron overload",
      "Order renal function panel and urine albumin-to-creatinine ratio for sickle nephropathy screening",
      "Order pulmonary function tests if chronic respiratory symptoms present"
    ],
    management: [
      "Prescribe hydroxyurea for all patients with HbSS ≥9 months: start 15 mg/kg/day, titrate to maximum tolerated dose (target MCV increase, HbF >20%)",
      "Prescribe L-glutamine (Endari) 5-15 g PO BID as adjunct for patients with ≥2 VOCs/year despite hydroxyurea",
      "Prescribe crizanlizumab (Adakveo) 5 mg/kg IV monthly for VOC reduction in patients ≥16 years",
      "Prescribe voxelotor (Oxbryta) 1500 mg PO daily to increase Hgb by 1 g/dL and reduce hemolysis markers",
      "Order chronic transfusion program for stroke prevention (target HbS <30% via exchange transfusion every 3-4 weeks)",
      "Prescribe iron chelation therapy (deferasirox) when ferritin >1000 ng/mL from chronic transfusions",
      "Refer for hematopoietic stem cell transplant evaluation in severe SCD with HLA-matched sibling donor",
      "Prescribe ACEi/ARB for sickle nephropathy with proteinuria (albuminuria >300 mg/day)"
    ],
    nursingActions: [
      "Develop individualized comprehensive SCD management plan addressing crisis prevention, chronic complications, and psychosocial needs",
      "Monitor disease-modifying therapy response and toxicity: CBC q4-8 weeks on hydroxyurea, hepatic function on deferasirox",
      "Screen annually for end-organ damage: retinopathy, nephropathy, pulmonary hypertension, avascular necrosis",
      "Coordinate genetic counseling for reproductive planning: discuss inheritance patterns, prenatal testing, preimplantation genetic diagnosis",
      "Manage chronic pain program: differentiate chronic SCD pain from acute crisis, avoid escalating opioids without reassessment",
      "Prescribe age-appropriate immunizations including pneumococcal vaccines (PCV13 + PPSV23), annual influenza, and meningococcal vaccines",
      "Coordinate transition from pediatric to adult SCD care for adolescents",
      "Refer for curative therapy evaluation: gene therapy (LentiGlobin, Casgevy) for eligible patients"
    ],
    signs: {
      left: [
        "Recurrent VOC pain requiring hospitalization",
        "Chronic hemolytic anemia (Hgb 6-9 g/dL, elevated reticulocyte count, LDH, indirect bilirubin)",
        "Cholelithiasis (pigmented bilirubin stones from chronic hemolysis)",
        "Avascular necrosis (hip, shoulder)",
        "Sickle retinopathy (proliferative and non-proliferative)"
      ],
      right: [
        "Pulmonary hypertension (TRV ≥2.5 m/s on echo)",
        "Sickle nephropathy (proteinuria, hyposthenuria, eventual CKD)",
        "Stroke (children: large vessel occlusive; adults: hemorrhagic)",
        "Iron overload from chronic transfusions (cardiac, hepatic, endocrine dysfunction)",
        "Leg ulcers (malleolar, chronic, difficult to heal)"
      ]
    },
    medications: [
      { name: "Hydroxyurea", type: "Disease-modifying agent", action: "Increases HbF via stress erythropoiesis, reduces WBC and platelet adhesion, increases NO bioavailability", sideEffects: "Myelosuppression (ANC <2000 = hold), skin/nail hyperpigmentation, teratogenicity, azoospermia (usually reversible)", contra: "Pregnancy, severe myelosuppression, severe renal/hepatic impairment (dose adjust)", pearl: "Start 15 mg/kg/day, increase by 5 mg/kg q8 weeks to maximum tolerated dose (usually 25-35 mg/kg/day). Monitor CBC q4-8 weeks. Maximum benefit seen at 3-6 months. Only drug proven to reduce mortality in SCD." },
      { name: "Crizanlizumab (Adakveo)", type: "Anti-P-selectin monoclonal antibody", action: "Blocks P-selectin on endothelium and platelets, reducing sickle cell adhesion and vaso-occlusion", sideEffects: "Infusion-related reactions, arthralgia, back pain, nausea, abdominal pain", contra: "Known hypersensitivity", pearl: "SUSTAIN trial showed 45% reduction in annual VOC rate. Administer 5 mg/kg IV over 30 min at weeks 0, 2, then monthly. Can be used with or without hydroxyurea. FDA-approved for age ≥16 years." },
      { name: "Voxelotor (Oxbryta)", type: "HbS polymerization inhibitor", action: "Increases hemoglobin-oxygen affinity, stabilizing HbS in the oxy-state and preventing polymerization", sideEffects: "Headache, diarrhea, abdominal pain, fatigue, rash", contra: "Known hypersensitivity", pearl: "HOPE trial showed Hgb increase >1 g/dL in 51% of patients and reduced hemolysis markers. 1500 mg PO daily. May be combined with hydroxyurea. FDA-approved for age ≥12 years." },
      { name: "Deferasirox (Jadenu)", type: "Oral iron chelator", action: "Selectively binds iron in a 2:1 complex and promotes fecal iron excretion", sideEffects: "Renal toxicity (monitor creatinine), hepatotoxicity, GI bleeding, rash", contra: "CrCl <40 mL/min, platelet count <50,000, high-risk MDS", pearl: "Initiate when ferritin >1000 ng/mL from chronic transfusions. Dose: 14 mg/kg/day (Jadenu tablets). Monitor serum creatinine monthly, LFTs monthly, serum ferritin monthly. Target ferritin 500-1000 ng/mL." }
    ],
    pearls: [
      "Gene therapy (Casgevy—CRISPR-based; LentiGlobin—lentiviral) represents potential cure: FDA-approved for SCD age ≥12 with recurrent VOC",
      "Transcranial Doppler screening every 12 months in children age 2-16 is the standard of care for primary stroke prevention",
      "Chronic transfusion programs targeting HbS <30% reduce stroke recurrence by >90% but require lifelong iron chelation",
      "Hydroxyurea is the only medication proven to reduce mortality in SCD: it should be offered to all HbSS patients ≥9 months regardless of severity",
      "Sickle cell trait (HbAS) is generally benign but carries risks during extreme conditions: exertional rhabdomyolysis, renal medullary carcinoma, and splenic infarction at high altitude"
    ],
    quiz: [
      { question: "An NP is managing a 14-year-old with HbSS who had 5 VOC hospitalizations last year on maximum-dose hydroxyurea. Which additional disease-modifying therapy should be considered?", options: ["Increase hydroxyurea beyond maximum dose", "Add crizanlizumab (anti-P-selectin antibody) for VOC reduction", "Switch to daily aspirin only", "Discontinue hydroxyurea and start iron supplements"], correct: 1, rationale: "Crizanlizumab (Adakveo) is an anti-P-selectin monoclonal antibody that reduces VOC frequency by 45% and can be added to hydroxyurea in patients with persistent crises. It is FDA-approved for age ≥16, but may be considered off-label in adolescents with severe disease." },
      { question: "An annual transcranial Doppler in a 7-year-old with HbSS shows velocity of 210 cm/s. What is the appropriate NP action?", options: ["Repeat the test in 1 year", "Initiate chronic transfusion therapy to maintain HbS <30%", "Start aspirin and monitor symptoms", "No intervention needed; this is a normal finding"], correct: 1, rationale: "A TCD velocity ≥200 cm/s is abnormal and indicates high stroke risk. Per STOP trial evidence, chronic transfusion therapy targeting HbS <30% reduces primary stroke risk by >90% and should be initiated." },
      { question: "Which newly approved therapy offers potential cure for sickle cell disease through gene editing?", options: ["Voxelotor", "Crizanlizumab", "Casgevy (exagamglogene autotemcel)—CRISPR-based gene therapy", "L-glutamine"], correct: 2, rationale: "Casgevy is a CRISPR/Cas9-based gene therapy that edits the BCL11A enhancer to reactivate fetal hemoglobin production, offering potential cure. It was FDA-approved in December 2023 for patients ≥12 years with recurrent VOC." }
    ]
  },

  "pediatric-dehydration-rpn": {
    title: "Pediatric Dehydration",
    cellular: {
      title: "Fluid Balance in the Pediatric Patient",
      content: "Children are more susceptible to dehydration than adults due to higher body surface area-to-weight ratio (greater insensible losses), higher metabolic rate, immature renal concentrating ability, and greater total body water percentage (70-80% in infants vs. 60% in adults). Dehydration occurs when fluid output exceeds intake, most commonly from gastroenteritis (vomiting and diarrhea), fever, or inadequate oral intake. Dehydration is classified as mild (3-5% weight loss), moderate (6-9%), or severe (≥10%). The type (isotonic, hypotonic, or hypertonic) affects clinical presentation and treatment approach. The nurse monitors hydration status, administers oral rehydration and IV fluids as ordered, measures intake and output, and reports clinical changes to the RN."
    },
    riskFactors: [
      "Age <5 years (especially infants <12 months)",
      "Acute gastroenteritis (rotavirus, norovirus)",
      "Fever (increases insensible losses by 12% per degree Celsius above normal)",
      "Vomiting and diarrhea",
      "Burns (increased insensible losses)",
      "Diabetic ketoacidosis",
      "Cystic fibrosis (increased salt losses)",
      "Hot weather and inadequate fluid access"
    ],
    diagnostics: [
      "Weigh the child on admission and daily using same scale (weight change is the most reliable indicator)",
      "Monitor vital signs: heart rate, blood pressure, temperature",
      "Assess capillary refill time and report if >2 seconds",
      "Monitor and record all intake and output (count diapers: 6-8 wet diapers/day is normal for infants)",
      "Observe for clinical signs of dehydration: dry mucous membranes, sunken fontanelle, decreased tears",
      "Report changes in level of consciousness (lethargy, irritability)"
    ],
    management: [
      "Administer oral rehydration solution (ORS) as ordered for mild to moderate dehydration",
      "Administer IV fluids as ordered for severe dehydration or inability to tolerate oral fluids",
      "Offer small, frequent amounts of ORS (5-10 mL every 5 minutes) as ordered",
      "Maintain strict intake and output recording including diaper weights",
      "Continue breastfeeding or formula feeding alongside ORS as directed",
      "Report signs of worsening dehydration or shock immediately",
      "Reintroduce age-appropriate diet (BRAT: bananas, rice, applesauce, toast) as tolerated"
    ],
    nursingActions: [
      "Assess hydration status systematically: mucous membranes, fontanelle, skin turgor, tear production, urine output",
      "Weigh all diapers to quantify urine output (1 g = 1 mL) and record stool output",
      "Monitor vital signs at intervals ordered by the RN/provider",
      "Administer ORS in small, frequent volumes to prevent vomiting",
      "Report signs of severe dehydration: sunken fontanelle, absent tears, tachycardia, poor capillary refill, lethargy",
      "Educate parents on ORS preparation and administration technique",
      "Monitor for electrolyte imbalance signs: muscle weakness, irritability, seizures",
      "Implement safety measures: side rails up, fall precautions for weak or dizzy children"
    ],
    signs: {
      left: [
        "Mild (3-5%): slightly dry mucous membranes, mildly decreased urine output, normal skin turgor",
        "Moderate (6-9%): dry mucous membranes, sunken fontanelle, decreased tears, tachycardia",
        "Decreased urine output (concentrated, dark yellow)",
        "Thirst and irritability"
      ],
      right: [
        "Severe (≥10%): very dry mucous membranes, sunken eyes, absent tears, markedly sunken fontanelle",
        "Tachycardia with weak, thready pulse",
        "Hypotension (late sign indicating impending shock)",
        "Lethargy, decreased responsiveness, mottled skin",
        "Capillary refill >3 seconds"
      ]
    },
    medications: [
      { name: "Oral Rehydration Solution (ORS)", type: "Electrolyte replacement", action: "Utilizes sodium-glucose cotransport mechanism to maximize water absorption in the small intestine", sideEffects: "Vomiting if given too quickly, hypernatremia if improperly prepared", contra: "Severe dehydration with shock, intractable vomiting, ileus", pearl: "WHO-ORS contains sodium 75 mEq/L, glucose 75 mmol/L, potassium 20 mEq/L. Give 5-10 mL every 5 minutes via syringe or spoon. Do not use sports drinks, juice, or soda as substitutes." },
      { name: "Ondansetron (Zofran)", type: "5-HT3 receptor antagonist antiemetic", action: "Blocks serotonin receptors in the CTZ and vagal afferents to reduce vomiting", sideEffects: "Headache, constipation, QT prolongation (rare at standard doses)", contra: "Known hypersensitivity, congenital long QT syndrome", pearl: "A single dose of oral ondansetron (0.15 mg/kg) can reduce vomiting enough to allow successful oral rehydration, preventing the need for IV fluids. Administer as ordered." },
      { name: "Normal saline (0.9% NaCl)", type: "Isotonic crystalloid", action: "Expands intravascular volume and restores circulating blood volume in moderate-severe dehydration", sideEffects: "Hyperchloremic metabolic acidosis with large volumes, fluid overload", contra: "Fluid overload, pulmonary edema", pearl: "For severe dehydration with signs of shock: bolus 20 mL/kg over 15-20 minutes, may repeat up to 3 times. Administer as ordered and report response." }
    ],
    pearls: [
      "Weight change is the single most reliable measure of dehydration in children: a pre-illness weight is invaluable",
      "Sunken fontanelle in an infant is a specific sign of moderate-to-severe dehydration (only assessable before fontanelle closure ~18 months)",
      "Oral rehydration is as effective as IV therapy for mild-to-moderate dehydration and is the WHO-preferred treatment",
      "Do not use sports drinks, juice, or soda for rehydration—they have excessive sugar and inadequate electrolytes",
      "Hypotension is a LATE sign of dehydration in children: tachycardia appears earlier as a compensatory mechanism"
    ],
    quiz: [
      { question: "An infant with gastroenteritis has dry mucous membranes, a sunken fontanelle, and decreased tears. What degree of dehydration should the nurse report?", options: ["Mild (3-5%)", "Moderate (6-9%)", "Severe (≥10%)", "No dehydration"], correct: 1, rationale: "Dry mucous membranes, sunken fontanelle, and decreased tears are consistent with moderate dehydration (6-9%). Severe dehydration would include absent tears, lethargy, and hemodynamic instability." },
      { question: "What is the recommended initial approach for managing a mildly dehydrated 2-year-old with gastroenteritis?", options: ["Immediate IV fluid bolus", "Small frequent amounts of oral rehydration solution (5-10 mL every 5 minutes)", "NPO until vomiting stops completely", "Large volumes of fruit juice"], correct: 1, rationale: "For mild dehydration, small frequent volumes of ORS are first-line treatment. Giving 5-10 mL every 5 minutes allows absorption while minimizing vomiting. IV fluids are reserved for severe cases or oral failure." },
      { question: "Which fluid should NOT be used for oral rehydration in a dehydrated child?", options: ["WHO oral rehydration solution", "Pedialyte", "Apple juice or sports drinks", "Breast milk alongside ORS"], correct: 2, rationale: "Apple juice and sports drinks have high osmolality from excessive sugar and inadequate electrolytes, which can worsen diarrhea through osmotic effects. ORS, Pedialyte, or breast milk alongside ORS are appropriate choices." }
    ]
  },

  "pediatric-dehydration-rn": {
    title: "Pediatric Dehydration",
    cellular: {
      title: "Pediatric Fluid Compartment Physiology",
      content: "Children have proportionally more total body water (TBW) than adults: neonates ~75% TBW, infants ~65%, compared to ~60% in adults. A larger percentage exists in the extracellular compartment, making children more vulnerable to rapid fluid shifts. The immature kidneys have limited concentrating ability (maximum urine osmolality ~600 mOsm/kg in neonates vs. 1200 in adults), making them less able to compensate for fluid losses. Dehydration classification by tonicity is critical: isotonic (isonatremic, Na 130-150 mEq/L) is most common (~80%), hypotonic (hyponatremic, Na <130) causes cellular swelling and seizure risk, and hypertonic (hypernatremic, Na >150) requires slow correction to prevent cerebral edema. The nurse performs comprehensive fluid status assessment, calculates fluid deficits, manages IV rehydration protocols, monitors electrolytes, and recognizes signs of dehydration-related shock."
    },
    riskFactors: [
      "Age <12 months (highest risk due to immature renal function and high BSA:weight ratio)",
      "Acute gastroenteritis (rotavirus, norovirus, Salmonella, Shigella)",
      "Fever >39°C (insensible losses increase 12% per degree above 37°C)",
      "Burns (massive insensible losses proportional to BSA)",
      "Diabetic ketoacidosis (osmotic diuresis)",
      "Pyloric stenosis (projectile vomiting with hypochloremic metabolic alkalosis)",
      "Cystic fibrosis (excessive salt losses in sweat)",
      "Adrenal insufficiency (salt-wasting)"
    ],
    diagnostics: [
      "Calculate percentage dehydration from pre-illness and current weight: (pre-illness – current)/pre-illness × 100",
      "Assess clinical dehydration score: mucous membranes, tears, skin turgor, general appearance, capillary refill",
      "Order and interpret BMP: serum sodium (classify tonicity), potassium, bicarbonate (acidosis from diarrhea), BUN, creatinine, glucose",
      "Calculate BUN:creatinine ratio (>20:1 suggests prerenal dehydration)",
      "Monitor urine specific gravity (>1.020 indicates concentrated urine/dehydration)",
      "Assess blood gas if severe dehydration: metabolic acidosis with elevated anion gap suggests lactic acidosis from poor perfusion",
      "Evaluate stool studies if bloody diarrhea or prolonged illness: culture, ova and parasites, Clostridioides difficile toxin"
    ],
    management: [
      "Calculate fluid deficit: weight (kg) × % dehydration × 10 = deficit in mL",
      "Implement WHO rehydration protocol: mild—ORS 50 mL/kg over 4 hours; moderate—ORS 100 mL/kg over 4 hours",
      "For severe dehydration/shock: NS or LR 20 mL/kg IV bolus over 15-20 minutes, reassess, repeat up to 60 mL/kg",
      "After initial resuscitation: replace remaining deficit over 24 hours (add maintenance fluids using Holliday-Segar formula)",
      "For hypernatremic dehydration: correct sodium slowly at ≤0.5 mEq/L/hour (≤12 mEq/day) to prevent cerebral edema",
      "Monitor serum sodium every 4-6 hours during correction of dysnatremia",
      "Administer ondansetron (0.15 mg/kg single dose) to facilitate oral rehydration if vomiting present",
      "Reintroduce feeding early: continue breastfeeding, age-appropriate diet as tolerated"
    ],
    nursingActions: [
      "Perform systematic dehydration assessment using validated clinical dehydration scale (CDS)",
      "Obtain accurate weight on admission and every 12 hours (same scale, same time, minimal clothing)",
      "Calculate and maintain accurate I&O: weigh all diapers, measure all oral and IV intake",
      "Calculate maintenance fluid requirements using Holliday-Segar: 100 mL/kg for first 10 kg + 50 mL/kg for next 10 kg + 20 mL/kg for each additional kg",
      "Assess skin turgor over the abdomen (most reliable area in children)",
      "Monitor for hypokalemia during rehydration: muscle weakness, absent bowel sounds, cardiac arrhythmia",
      "Educate parents on signs of dehydration requiring return to ED: no wet diaper >6 hours, no tears, lethargy",
      "Coordinate with dietitian for nutritional recovery plan"
    ],
    signs: {
      left: [
        "Mild (3-5%): slightly dry mouth, normal capillary refill, mildly decreased output",
        "Moderate (6-9%): dry mucous membranes, sunken fontanelle/eyes, tachycardia, decreased tears, oliguria",
        "Decreased skin turgor (tenting over abdomen >2 seconds)",
        "Concentrated urine (dark, specific gravity >1.025)",
        "Irritability or excessive thirst"
      ],
      right: [
        "Severe (≥10%): absent tears, very sunken fontanelle and eyes, marked tachycardia",
        "Hypotension with weak thready pulses (LATE sign in children)",
        "Mottled, cool extremities with CRT >3 seconds",
        "Lethargy or obtundation",
        "Anuria",
        "Signs of shock: altered mental status, delayed CRT, weak pulses"
      ]
    },
    medications: [
      { name: "Oral Rehydration Solution (ORS)", type: "Electrolyte replacement", action: "Exploits sodium-glucose cotransporter (SGLT1) in small intestine for maximum water absorption even during active diarrhea", sideEffects: "Vomiting if administered too rapidly, rare hypernatremia if concentration is incorrect", contra: "Severe dehydration with shock, paralytic ileus, altered consciousness (aspiration risk)", pearl: "WHO low-osmolality ORS (245 mOsm/L) is superior to standard ORS. Administer via syringe/spoon: 5 mL q1-2 min. If vomiting persists after ondansetron, switch to NG tube for continuous ORS delivery before IV." },
      { name: "Ondansetron (Zofran)", type: "5-HT3 receptor antagonist", action: "Blocks serotonin in the chemoreceptor trigger zone and vagal afferents to suppress vomiting reflex", sideEffects: "Headache, constipation, dizziness, QT prolongation (dose-dependent)", contra: "Congenital long QT syndrome, known hypersensitivity, concurrent QT-prolonging medications", pearl: "Single oral dose (0.15 mg/kg, max 4 mg) in the ED reduces vomiting and IV fluid need. Oral dissolving tablet (ODT) is ideal as it dissolves on the tongue. Give 15-30 minutes before starting ORS." },
      { name: "Lactated Ringer's solution", type: "Isotonic crystalloid", action: "Balanced electrolyte solution that provides volume expansion with buffering capacity from lactate metabolism to bicarbonate", sideEffects: "Volume overload, lactic acidosis monitoring interference", contra: "Severe hepatic failure (cannot metabolize lactate), hyperkalemia", pearl: "Preferred over NS for large-volume resuscitation as it causes less hyperchloremic metabolic acidosis. Use for bolus resuscitation: 20 mL/kg over 15-20 min, reassess, repeat as needed up to 60 mL/kg." },
      { name: "Potassium chloride (IV additive)", type: "Electrolyte replacement", action: "Replaces potassium lost through diarrhea and vomiting; essential for cellular function, cardiac rhythm, and muscle contraction", sideEffects: "Hyperkalemia (cardiac arrhythmias), phlebitis at IV site, GI irritation (oral)", contra: "Hyperkalemia, anuria, Addisonian crisis (until treated)", pearl: "Add 20-40 mEq/L to maintenance fluids ONLY after urine output is established (indicates adequate renal function). Never IV push KCl. Maximum infusion rate: 0.5 mEq/kg/hour." }
    ],
    pearls: [
      "Holliday-Segar formula for maintenance fluids: 4 mL/kg/hr for first 10 kg, 2 mL/kg/hr for next 10 kg, 1 mL/kg/hr for each kg above 20",
      "Skin turgor should be assessed over the abdomen in children (not the hand)—pinch and release, >2 seconds return indicates moderate-severe dehydration",
      "Hypernatremic dehydration must be corrected slowly (≤0.5 mEq/L/hour) to prevent cerebral edema and seizures from rapid fluid shifts",
      "Oral rehydration therapy (ORT) is as effective as IV therapy for mild-moderate dehydration and is the WHO gold standard",
      "Never add potassium to IV fluids until urine output is confirmed: hyperkalemia in a dehydrated child with poor renal perfusion can be fatal"
    ],
    quiz: [
      { question: "A 10 kg infant with moderate dehydration (8%) needs rehydration. How much fluid deficit must be replaced?", options: ["400 mL", "800 mL", "1000 mL", "1600 mL"], correct: 1, rationale: "Fluid deficit = weight (kg) × % dehydration × 10 = 10 × 8 × 10 = 800 mL. This deficit is replaced over 24 hours in addition to maintenance fluids." },
      { question: "An infant with hypernatremic dehydration (Na 165 mEq/L) is being rehydrated. The serum sodium drops from 165 to 150 in 6 hours. What should the nurse do?", options: ["Continue the current rate as the sodium is correcting", "Slow the rehydration rate because sodium is correcting too rapidly", "Increase the rehydration rate to normalize sodium faster", "Stop all fluids and recheck in 2 hours"], correct: 1, rationale: "Sodium dropped 15 mEq/L in 6 hours (2.5 mEq/L/hour), which exceeds the safe rate of ≤0.5 mEq/L/hour. The rehydration rate must be slowed to prevent cerebral edema from rapid osmotic shifts." },
      { question: "Before adding potassium chloride to a dehydrated child's IV fluids, which assessment must the nurse confirm?", options: ["The child has a normal temperature", "The child has established urine output", "The child's sodium level is normal", "The child has been NPO for 4 hours"], correct: 1, rationale: "Potassium should never be added to IV fluids until adequate urine output is confirmed. In a dehydrated child with decreased renal perfusion, administering potassium risks life-threatening hyperkalemia." }
    ]
  },

  "pediatric-dehydration-np": {
    title: "Pediatric Dehydration",
    cellular: {
      title: "Pediatric Fluid Physiology",
      content: "The clinician managing pediatric dehydration must integrate developmental physiology, fluid compartment dynamics, and electrolyte correction strategies. Neonates have ~75% TBW with 40% in the extracellular fluid (ECF), making them vulnerable to rapid dehydration. The immature nephron has limited concentrating ability (600 mOsm/kg vs. 1200 in adults), limited sodium conservation, and a lower GFR. Isotonic dehydration (Na 130-150) reflects proportional water-sodium loss and is the most common (80%). Hyponatremic dehydration (Na <130) from hypotonic fluid replacement causes water to shift intracellularly, producing cerebral edema risk. Hypernatremic dehydration (Na >150) from free water loss causes water to shift extracellularly, and overly rapid correction can produce cerebral edema from reverse osmotic shift. The clinician must classify dehydration by severity and tonicity, calculate fluid deficit and maintenance requirements, prescribe electrolyte correction protocols, and investigate underlying etiology."
    },
    riskFactors: [
      "Neonates and infants <6 months (highest vulnerability due to immature renal function, high BSA:weight ratio, dependence on caregiver for fluids)",
      "Rotavirus and norovirus gastroenteritis (most common infectious cause)",
      "Pyloric stenosis (projectile non-bilious vomiting with hypochloremic hypokalemic metabolic alkalosis)",
      "Diabetic ketoacidosis (osmotic diuresis with severe total body water deficit)",
      "Diabetes insipidus (central or nephrogenic—free water loss causing hypernatremic dehydration)",
      "Congenital adrenal hyperplasia (salt-wasting crisis in neonates)",
      "Burns >10% TBSA (Parkland formula for replacement)",
      "Malnutrition and protein-energy wasting (impaired oncotic pressure)"
    ],
    diagnostics: [
      "Calculate dehydration severity: mild (3-5%), moderate (6-9%), severe (≥10%) using clinical score and weight change",
      "Order and interpret BMP: sodium (classify tonicity), potassium, chloride, bicarbonate, BUN, creatinine, glucose",
      "Calculate serum osmolality: 2(Na) + glucose/18 + BUN/2.8 (normal 275-295 mOsm/kg)",
      "Calculate corrected sodium in hyperglycemia: for every 100 mg/dL glucose above 100, add 1.6 mEq/L to measured sodium",
      "Order VBG or ABG for severe dehydration: assess pH, pCO2, bicarbonate, lactate",
      "Order urinalysis with specific gravity and urine electrolytes to assess renal concentrating ability and etiology",
      "Consider stool studies for prolonged or bloody diarrhea: culture, C. difficile PCR, rotavirus antigen, ova and parasites",
      "Order abdominal ultrasound if pyloric stenosis suspected (olive-shaped mass, projectile non-bilious vomiting in 3-6 week old)"
    ],
    management: [
      "Prescribe fluid replacement based on severity: mild-moderate—ORS 50-100 mL/kg over 4 hours; severe/shock—NS or LR 20 mL/kg bolus IV, repeat up to 60 mL/kg",
      "Calculate total 24-hour fluid requirement: deficit + maintenance (Holliday-Segar) + ongoing losses",
      "For isotonic dehydration: replace half of deficit over first 8 hours, remaining half over next 16 hours, plus maintenance",
      "For hypernatremic dehydration (Na >150): use hypotonic fluids (D5 0.45% NS or D5 0.2% NS), correct sodium at ≤0.5 mEq/L/hour (≤12 mEq/24h), replace deficit over 48-72 hours",
      "For hyponatremic dehydration (Na <130): use isotonic or hypertonic saline for symptomatic cases (seizures); correct at ≤8 mEq/24h to prevent osmotic demyelination",
      "For severe hyponatremia with seizures: prescribe 3% NaCl 2-5 mL/kg IV bolus over 10-20 minutes to raise Na by 2-3 mEq/L acutely",
      "Prescribe ondansetron ODT 0.15 mg/kg (max 4 mg) single dose for vomiting to facilitate ORT",
      "Prescribe potassium replacement (20-40 mEq/L in IV fluids) AFTER urine output established"
    ],
    nursingActions: [
      "Determine underlying etiology: gastroenteritis, DKA, pyloric stenosis, diabetes insipidus, adrenal insufficiency",
      "Calculate free water deficit in hypernatremic dehydration: 4 mL/kg × weight × (current Na – desired Na)",
      "Monitor serum sodium every 4-6 hours during dysnatremia correction",
      "Reassess clinical dehydration score at 2 and 4 hours after initiating rehydration",
      "Prescribe zinc supplementation (10-20 mg/day for 10-14 days) for children with diarrhea per WHO guidelines (reduces duration and recurrence)",
      "Evaluate for surgical causes: pyloric stenosis (ultrasound), intussusception (air-contrast enema), malrotation with volvulus (upper GI series)",
      "Prescribe rotavirus vaccine catch-up if age-eligible and not yet vaccinated (prevention)",
      "Counsel parents on red flags requiring immediate return: no wet diaper >8 hours, blood in stool, bilious vomiting, lethargy"
    ],
    signs: {
      left: [
        "Isotonic dehydration (Na 130-150): proportional ECF loss, clinical signs proportional to severity",
        "Hyponatremic dehydration (Na <130): exaggerated clinical dehydration signs, seizure risk from cellular edema",
        "Weight loss corresponding to fluid deficit percentage",
        "Metabolic acidosis (low bicarbonate from diarrheal losses and poor perfusion)",
        "Elevated BUN:creatinine ratio (>20:1 = prerenal)"
      ],
      right: [
        "Hypernatremic dehydration (Na >150): doughy skin turgor (misleadingly preserved), irritability, seizures during correction",
        "Compensated shock: tachycardia, normal BP, prolonged CRT (children compensate longer than adults)",
        "Decompensated shock: hypotension (LATE), altered consciousness, anuria",
        "Hypokalemia from GI losses: muscle weakness, ileus, U waves on ECG",
        "Hypoglycemia risk (especially in infants with poor glycogen stores)"
      ]
    },
    medications: [
      { name: "Oral Rehydration Solution (WHO formula)", type: "Electrolyte replacement solution", action: "Exploits coupled sodium-glucose cotransport (SGLT1) in jejunal enterocytes; osmotic gradient drives water absorption even during active secretory diarrhea", sideEffects: "Vomiting if too fast, hypernatremia if improperly reconstituted", contra: "Severe dehydration with hemodynamic instability, ileus, altered consciousness", pearl: "WHO reduced-osmolality ORS (245 mOsm/L) reduces stool output, vomiting, and need for IV fluids vs. old formula. NG tube ORS at 15-25 mL/kg/hour is effective alternative if oral fails before resorting to IV." },
      { name: "3% Hypertonic saline", type: "Hypertonic sodium solution", action: "Rapidly raises serum sodium to reverse symptomatic hyponatremia and reduce cerebral edema", sideEffects: "Osmotic demyelination syndrome (if corrected too rapidly), phlebitis, volume overload", contra: "Hypernatremia, heart failure, unmonitored setting", pearl: "Emergency use only for hyponatremic seizures. Bolus 2-5 mL/kg IV over 10-20 minutes to raise Na by 2-3 mEq/L acutely. Total correction must not exceed 8 mEq/24h. Requires ICU monitoring with sodium checks every 2 hours." },
      { name: "Zinc supplementation", type: "Micronutrient", action: "Enhances intestinal water and electrolyte absorption, improves immune function, and reduces duration and severity of diarrheal illness", sideEffects: "Nausea, vomiting, metallic taste, copper deficiency with prolonged use", contra: "Known hypersensitivity", pearl: "WHO recommends zinc for ALL children with diarrhea: <6 months: 10 mg/day, >6 months: 20 mg/day for 10-14 days. Reduces diarrhea duration by ~25% and reduces future diarrheal episodes for 2-3 months." },
      { name: "Ondansetron (Zofran ODT)", type: "5-HT3 receptor antagonist", action: "Selective serotonin receptor blockade at CTZ and vagal afferents suppressing the vomiting reflex", sideEffects: "QT prolongation (dose-dependent), headache, constipation, dizziness", contra: "Congenital long QT syndrome, apomorphine use, known hypersensitivity", pearl: "Prescribe single dose 0.15 mg/kg (max 4 mg) PO. NNT = 5 to prevent one IV insertion. Use ODT formulation for vomiting children. Check ECG if concerns about QT interval. Can be repeated once if vomiting recurs within 4 hours." }
    ],
    pearls: [
      "In hypernatremic dehydration, skin turgor may appear deceptively normal ('doughy') because intracellular-to-extracellular water shift maintains ECF volume: clinical dehydration signs underestimate true severity",
      "Children compensate for hypovolemia with tachycardia far longer than adults: hypotension is a LATE and ominous sign indicating >25% blood volume loss",
      "The sodium-glucose cotransporter (SGLT1) is the physiological basis of ORS: glucose is required for sodium (and therefore water) absorption—this is why sugar-free solutions don't work",
      "Zinc supplementation for acute diarrhea is WHO-recommended but frequently overlooked in high-income countries: it reduces diarrheal duration by 25% and recurrence for 2-3 months",
      "Pyloric stenosis classically presents with hypochloremic, hypokalemic metabolic alkalosis (the only surgical cause of non-anion gap metabolic alkalosis in infants)"
    ],
    quiz: [
      { question: "A 3-week-old presents with projectile non-bilious vomiting, a palpable olive-shaped mass, and lab values showing pH 7.52, Cl- 88, K+ 3.0. Which diagnosis should the clinician suspect?", options: ["Gastroenteritis", "Intussusception", "Pyloric stenosis", "Malrotation with volvulus"], correct: 2, rationale: "Projectile non-bilious vomiting in a 3-6 week old with an olive-shaped epigastric mass and hypochloremic hypokalemic metabolic alkalosis is the classic presentation of pyloric stenosis. The metabolic alkalosis results from loss of HCl through persistent vomiting." },
      { question: "A child with hypernatremic dehydration (Na 170 mEq/L) is being rehydrated. Over what time period should the deficit be corrected?", options: ["4-6 hours", "12-24 hours", "48-72 hours", "1 week"], correct: 2, rationale: "Hypernatremic dehydration requires slow correction over 48-72 hours at a rate of ≤0.5 mEq/L/hour (≤12 mEq/24h) to prevent cerebral edema from rapid osmotic fluid shifts into brain cells." },
      { question: "An NP is managing a 2-year-old with moderate dehydration from gastroenteritis. Which evidence-based adjunct therapy should be prescribed alongside ORS?", options: ["Loperamide to reduce diarrhea", "Zinc supplementation for 10-14 days", "Prophylactic antibiotics", "Probiotics only"], correct: 1, rationale: "WHO recommends zinc supplementation (20 mg/day for 10-14 days) for ALL children with diarrhea. Zinc reduces diarrheal duration by ~25% and reduces recurrence for 2-3 months. Loperamide is contraindicated in children <2 years." }
    ]
  }
};
