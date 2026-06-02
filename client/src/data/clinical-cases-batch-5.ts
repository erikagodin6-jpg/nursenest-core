import type { ClinicalCase } from "./clinical-case-types";

export const clinicalCasesBatch5: ClinicalCase[] = [
  {
    id: "addisonian-crisis",
    title: "The Steroid-Dependent Patient in Crisis",
    patientProfile: "David Okafor, 42-year-old male. PMH: Primary adrenal insufficiency (Addison's disease) on daily hydrocortisone 20 mg AM / 10 mg PM and fludrocortisone 0.1 mg daily. Developed viral gastroenteritis 2 days ago with persistent vomiting; unable to keep oral medications down for 48 hours.",
    chiefComplaint: "Severe weakness, dizziness, and abdominal pain",
    category: "Endocrine Emergency",
    difficulty: "advanced",
    bodySystem: "Endocrine",
    stages: [
      {
        id: "initial-presentation",
        title: "Emergency Department Arrival",
        narrative: "EMS brings David in after his wife found him near-syncopal on the bathroom floor. He is lethargic but responsive, complaining of diffuse abdominal pain and nausea. His skin appears notably hyperpigmented, particularly on the knuckles and buccal mucosa. He wears a medical alert bracelet reading 'Adrenal Insufficiency — Stress Dose Steroids.'",
        vitals: { hr: 122, bp: "78/48", rr: 22, spo2: 96, temp: 37.2, pain: 7 },
        labs: [
          { name: "Sodium", value: "126", unit: "mEq/L", flag: "low" },
          { name: "Potassium", value: "6.1", unit: "mEq/L", flag: "critical" },
          { name: "Glucose", value: "52", unit: "mg/dL", flag: "critical" },
          { name: "Cortisol (random)", value: "1.2", unit: "mcg/dL", flag: "critical" },
          { name: "BUN", value: "38", unit: "mg/dL", flag: "high" },
          { name: "Creatinine", value: "1.6", unit: "mg/dL", flag: "high" }
        ],
        assessmentFindings: [
          "Hyperpigmentation of skin creases, knuckles, and buccal mucosa",
          "Severe orthostatic hypotension — unable to sit upright",
          "Dry mucous membranes, poor skin turgor, sunken eyes",
          "Diffuse abdominal tenderness without rebound or guarding",
          "Lethargy with appropriate responses when stimulated",
          "Medical alert bracelet: Adrenal Insufficiency"
        ],
        nursingPriority: "Recognize adrenal crisis in a known Addison's patient who has been unable to take replacement steroids. The triad of hypotension, hyponatremia, and hyperkalemia with hypoglycemia is classic. Immediate IV stress-dose steroids and aggressive fluid resuscitation are lifesaving.",
        decisions: [
          {
            id: "stress-dose-steroids",
            text: "Administer IV hydrocortisone 100 mg stat, initiate rapid NS bolus with D5NS, draw cortisol level, and continuous cardiac monitoring for hyperkalemia",
            isOptimal: true,
            consequence: "IV hydrocortisone is administered within minutes. A 1L NS bolus is running wide open followed by D5NS. The cortisol level confirms crisis. Cardiac monitor shows peaked T waves prompting close observation. Within 30 minutes, BP improves to 92/60 and the patient becomes more alert.",
            mechanismExplanation: "In primary adrenal insufficiency, the adrenal cortex cannot produce cortisol or aldosterone. Cortisol is essential for vascular tone (permissive effect on catecholamine receptors), gluconeogenesis, and stress response. Without cortisol, catecholamines cannot maintain vascular resistance → refractory hypotension. Aldosterone deficiency causes sodium wasting and potassium retention. The 100 mg IV hydrocortisone provides both glucocorticoid and mineralocorticoid activity at stress doses. D5NS addresses both volume depletion and hypoglycemia simultaneously."
          },
          {
            id: "fluid-only-approach",
            text: "Start aggressive IV normal saline bolus and recheck blood pressure in 15 minutes before giving any medications",
            isOptimal: false,
            consequence: "Despite 2L of NS, blood pressure remains critically low at 80/50. Without cortisol replacement, catecholamines cannot effectively cause vasoconstriction. The hypoglycemia worsens and the patient becomes increasingly obtunded. Precious time is lost.",
            mechanismExplanation: "Adrenal crisis causes a form of distributive shock that is refractory to volume alone. Cortisol has a permissive effect on alpha-1 adrenergic receptors: without cortisol, norepinephrine and epinephrine cannot bind effectively to vascular smooth muscle receptors. No amount of fluid will restore vascular tone without cortisol replacement. Additionally, fluids alone do not address the hypoglycemia caused by impaired gluconeogenesis."
          },
          {
            id: "treat-hyperkalemia-first",
            text: "Focus on the critical potassium of 6.1: administer calcium gluconate, insulin/dextrose, and kayexalate before addressing other issues",
            isOptimal: false,
            consequence: "While hyperkalemia treatment is initiated, the underlying cause is not addressed. Potassium temporarily decreases but rebounds within an hour. The patient's hypotension is not treated and progresses to cardiovascular collapse. Treating the electrolyte abnormality without correcting the hormonal deficiency addresses the symptom, not the disease.",
            mechanismExplanation: "The hyperkalemia in adrenal crisis is caused by aldosterone deficiency: without aldosterone, the principal cells of the collecting duct cannot excrete potassium via ENaC/ROMK channels. Standard hyperkalemia treatments provide temporary intracellular shifting but do not address the root cause. Hydrocortisone at stress doses (100 mg) provides sufficient mineralocorticoid activity to restore renal potassium excretion. Treating the underlying hormonal deficiency simultaneously corrects multiple electrolyte abnormalities."
          }
        ],
        criticalThinking: "Why is this patient's hypotension refractory to fluids alone? Consider the role of cortisol in maintaining vascular responsiveness to catecholamines."
      },
      {
        id: "stabilization-phase",
        title: "Post-Steroid Stabilization",
        narrative: "After receiving IV hydrocortisone 100 mg and 2L of D5NS, David is improving but remains in the resuscitation bay. His wife reports he has been under significant work stress and skipped his evening hydrocortisone dose even before the gastroenteritis began. A repeat assessment 2 hours later shows improvement but ongoing concerns.",
        vitals: { hr: 98, bp: "102/64", rr: 18, spo2: 97, temp: 37.0, pain: 4 },
        labs: [
          { name: "Sodium", value: "130", unit: "mEq/L", flag: "low" },
          { name: "Potassium", value: "5.2", unit: "mEq/L", flag: "high" },
          { name: "Glucose", value: "88", unit: "mg/dL" },
          { name: "Cortisol (post-dose)", value: "42", unit: "mcg/dL" }
        ],
        assessmentFindings: [
          "Mental status improved: alert, oriented x4, conversational",
          "Blood pressure improving with IV fluids and steroid replacement",
          "Tolerating small sips of clear liquids without vomiting",
          "Potassium trending down but still elevated",
          "Skin turgor improving, mucous membranes less dry"
        ],
        nursingPriority: "Plan ongoing steroid replacement schedule, monitor electrolyte normalization, and provide critical patient education about sick-day rules and stress dosing to prevent future crises.",
        decisions: [
          {
            id: "schedule-steroids-educate",
            text: "Schedule hydrocortisone 50 mg IV q8h, plan endocrine consult, initiate patient/family education on sick-day steroid stress dosing, emergency injection kit, and medical alert identification",
            isOptimal: true,
            consequence: "The patient is admitted for 24-48 hours of IV steroid taper. Endocrinology consults and provides a written sick-day action plan. David and his wife are taught IM hydrocortisone injection technique. Electrolytes normalize over 24 hours. The crisis is attributed to medication non-compliance compounded by physiological stress of gastroenteritis.",
            mechanismExplanation: "After the initial 100 mg bolus, stress-dose hydrocortisone is continued at 50 mg IV q6-8h for 24 hours, then tapered to double the maintenance dose, then gradually returned to baseline. This mimics the normal cortisol stress response (the adrenal glands normally produce 150-300 mg cortisol/day under maximal stress vs 15-25 mg/day at baseline). Education is the most important long-term intervention: patients must understand the 'rule of 2-3' — double or triple oral dose during illness, and use IM injection if vomiting prevents oral intake."
          },
          {
            id: "resume-oral-meds",
            text: "Patient is improving — resume his home oral hydrocortisone 20 mg/10 mg and fludrocortisone, observe for 4 hours, and discharge",
            isOptimal: false,
            consequence: "Returning directly to maintenance doses after a crisis is inadequate. The adrenal axis needs supraphysiologic support during recovery. The patient vomits his oral dose the next morning, and symptoms recur, requiring readmission. The abrupt return to maintenance dosing fails to account for ongoing physiologic stress.",
            mechanismExplanation: "After adrenal crisis, the body remains in a stress state requiring supraphysiologic cortisol. Maintenance doses (20-30 mg/day) are grossly insufficient for a patient recovering from crisis. The hypothalamic-pituitary-adrenal axis in primary adrenal insufficiency cannot auto-regulate: the patient depends entirely on exogenous replacement. A gradual taper from stress to maintenance doses (typically over 2-3 days) is necessary. Premature discharge risks recurrence if the triggering illness is not fully resolved."
          },
          {
            id: "hold-steroids-observe",
            text: "Steroids are already on board — hold the next dose until the morning and let the initial bolus provide coverage overnight",
            isOptimal: false,
            consequence: "IV hydrocortisone has a half-life of approximately 90 minutes. By 6 hours post-dose, cortisol levels are falling rapidly. At 3 AM, the patient's blood pressure drops to 84/52 and glucose falls to 60 mg/dL. Emergency stress dosing must be repeated, and the crisis extends unnecessarily.",
            mechanismExplanation: "Hydrocortisone (cortisol) has a plasma half-life of 60-90 minutes. A single 100 mg bolus provides approximately 4-6 hours of adequate coverage before levels fall below therapeutic threshold. In a patient with zero endogenous production, timed repeated dosing is essential. The common error is assuming a large initial dose provides sustained coverage — it does not. Cortisol follows first-order elimination kinetics: the concentration halves roughly every 90 minutes regardless of the initial dose."
          }
        ],
        criticalThinking: "Why can't a single large dose of hydrocortisone provide 24-hour coverage? Consider the pharmacokinetics of cortisol and why patients with primary adrenal insufficiency need scheduled dosing."
      }
    ],
    debriefing: {
      keyLearning: [
        "Adrenal crisis presents with refractory hypotension, hyponatremia, hyperkalemia, and hypoglycemia — the hallmark tetrad",
        "IV hydrocortisone 100 mg is the priority intervention and must not be delayed for fluid resuscitation alone",
        "Cortisol has a permissive effect on catecholamine receptors: without cortisol, vasopressors and fluid are ineffective at restoring vascular tone",
        "Stress-dose steroids must be continued q6-8h after the initial bolus due to the short half-life of hydrocortisone",
        "Patient education on sick-day rules and emergency IM injection is the most critical prevention strategy"
      ],
      mechanismSummary: "Adrenal crisis occurs when a patient with adrenal insufficiency experiences physiologic stress without adequate cortisol replacement. The pathophysiology involves loss of cortisol's permissive effect on vascular catecholamine sensitivity → refractory vasodilation and hypotension. Simultaneously, aldosterone deficiency causes renal sodium wasting and potassium retention via loss of ENaC/ROMK channel regulation in the collecting duct. Impaired gluconeogenesis from cortisol deficiency causes hypoglycemia. The triad of hemodynamic collapse, electrolyte derangement, and metabolic failure constitutes the crisis and responds dramatically to exogenous cortisol replacement.",
      commonErrors: [
        "Attempting fluid resuscitation without concurrent steroid replacement — adrenal crisis is refractory to fluids alone",
        "Focusing on hyperkalemia treatment without recognizing the underlying hormonal cause",
        "Administering a single steroid bolus without scheduling ongoing stress-dose replacement",
        "Discharging too early on maintenance doses before the physiologic stress has resolved",
        "Failing to check for and educate about medical alert identification and emergency injection kits"
      ]
    }
  },
  {
    id: "status-epilepticus",
    title: "The Prolonged Seizure Emergency",
    patientProfile: "Ana Rodriguez, 28-year-old female. PMH: Epilepsy diagnosed at age 16, on levetiracetam 1000 mg BID. Boyfriend reports she ran out of medication 3 days ago and could not afford the refill. No other medical history. No known allergies.",
    chiefComplaint: "Continuous generalized tonic-clonic seizure for approximately 8 minutes",
    category: "Neurological Emergency",
    difficulty: "advanced",
    bodySystem: "Neurological",
    stages: [
      {
        id: "active-seizure",
        title: "Active Seizure Management",
        narrative: "EMS arrives with Ana actively seizing. The boyfriend states the seizure started approximately 8 minutes ago with no signs of stopping. EMS administered midazolam 10 mg IM en route. She is on a stretcher, postictal guard rails up, oxygen via non-rebreather. The seizure continues with rhythmic tonic-clonic movements of all extremities. She is cyanotic around the lips.",
        vitals: { hr: 140, bp: "178/102", rr: 6, spo2: 82, temp: 38.4 },
        assessmentFindings: [
          "Active generalized tonic-clonic seizure with rhythmic extremity movements",
          "Cyanosis of lips and nail beds",
          "Foamy oral secretions, no blood noted",
          "Pupils fixed and dilated bilaterally during seizure activity",
          "Incontinent of urine",
          "IV access established by EMS: 20G left antecubital"
        ],
        nursingPriority: "Status epilepticus is defined as seizure activity lasting >5 minutes or recurrent seizures without return to baseline. This is a neurological emergency with increasing risk of irreversible brain injury with each passing minute. Benzodiazepine administration is the first-line treatment.",
        decisions: [
          {
            id: "lorazepam-protocol",
            text: "Administer lorazepam 4 mg IV push (midazolam given IM en route was first-line), position on side, suction secretions, prepare for second-line agent if seizure persists in 5 minutes",
            isOptimal: true,
            consequence: "Lorazepam is administered IV push. After 3 minutes, the tonic-clonic activity begins to slow. Suctioning clears oral secretions and SpO2 improves to 90%. You prepare levetiracetam 60 mg/kg IV as the second-line agent. The seizure stops at 12 minutes total duration.",
            mechanismExplanation: "Status epilepticus involves sustained abnormal neuronal firing from excitatory glutamate overwhelming inhibitory GABA pathways. Benzodiazepines enhance GABA-A receptor chloride channel opening, increasing inhibitory tone. Lorazepam IV is preferred in the ED because of its longer duration of anticonvulsant effect (12-24 hours) compared to midazolam (1-2 hours). The established protocol is: first-line benzodiazepine → wait 5 minutes → if persistent, second-line antiepileptic (levetiracetam, fosphenytoin, or valproate). Each minute of sustained seizure activity increases excitotoxic neuronal injury from excessive calcium influx via NMDA receptors."
          },
          {
            id: "oral-airway-restrain",
            text: "Insert an oral airway to protect the tongue, apply soft restraints to prevent injury, and wait for the seizure to stop on its own",
            isOptimal: false,
            consequence: "Attempting to insert an oral airway during active seizure causes a tooth to break and the airway is aspirated into the oropharynx. Restraints increase injury risk as the patient seizes against them. The seizure continues for another 15 minutes without pharmacologic intervention, causing prolonged hypoxia and potential excitotoxic brain injury.",
            mechanismExplanation: "Nothing should be placed in the mouth during an active seizure: this is a persistent myth that causes iatrogenic injury. Tongue biting occurs at seizure onset from jaw clenching and cannot be prevented mid-seizure. Restraints are contraindicated because they increase the risk of rhabdomyolysis and fractures as muscles contract against fixed resistance. Status epilepticus will not self-terminate: the longer the seizure persists, the more resistant it becomes to treatment due to GABA-A receptor internalization (trafficking from the cell surface into endosomes). This is why rapid pharmacologic intervention is critical."
          },
          {
            id: "phenytoin-loading",
            text: "Skip benzodiazepines since midazolam was given en route and go directly to phenytoin 20 mg/kg IV loading dose",
            isOptimal: false,
            consequence: "Phenytoin requires 20-30 minutes to infuse (max rate 50 mg/min to avoid cardiac arrhythmias). During this prolonged infusion time, the seizure continues. IM midazolam has lower bioavailability and shorter duration than IV lorazepam — a single IM dose is not equivalent to completing first-line therapy. The seizure duration extends to 25 minutes before the phenytoin reaches therapeutic levels.",
            mechanismExplanation: "The treatment protocol for status epilepticus is evidence-based and sequential for a reason. First-line benzodiazepines work within 1-3 minutes by directly enhancing GABA-A receptor function. IM midazolam (given by EMS) is appropriate prehospital but has lower CNS bioavailability than IV lorazepam. A single IM dose does not constitute complete first-line therapy. Second-line agents (phenytoin, levetiracetam) work via different mechanisms (sodium channel blockade, SV2A protein modulation) and take 15-30 minutes to achieve therapeutic levels. Skipping to second-line therapy wastes the critical window when GABA-A receptors are still surface-expressed and responsive to benzodiazepines."
          }
        ],
        criticalThinking: "Why does status epilepticus become increasingly resistant to benzodiazepines over time? Consider what happens to GABA-A receptors during prolonged seizure activity."
      },
      {
        id: "post-seizure-monitoring",
        title: "Post-Seizure Assessment and Monitoring",
        narrative: "The seizure has terminated after lorazepam and levetiracetam administration. Ana is now in a postictal state. She is breathing spontaneously but remains unresponsive to voice. Thirty minutes have passed since seizure termination.",
        vitals: { hr: 108, bp: "142/88", rr: 16, spo2: 94, temp: 38.1, pain: 0 },
        labs: [
          { name: "Glucose", value: "186", unit: "mg/dL", flag: "high" },
          { name: "Sodium", value: "138", unit: "mEq/L" },
          { name: "Levetiracetam level", value: "<2", unit: "mcg/mL", flag: "critical" },
          { name: "CK", value: "1,840", unit: "U/L", flag: "high" },
          { name: "Lactate", value: "5.6", unit: "mmol/L", flag: "high" },
          { name: "pH (VBG)", value: "7.22", unit: "", flag: "low" }
        ],
        assessmentFindings: [
          "Postictal state: eyes closed, moaning, withdrawing to pain",
          "No focal neurological deficits appreciable in current state",
          "Tongue laceration noted on left lateral border, minor oozing",
          "Mild myoglobinuria: dark amber urine in Foley catheter",
          "Bilateral breath sounds clear, improving oxygenation on 4L NC",
          "No further seizure activity on continuous EEG monitoring"
        ],
        nursingPriority: "Monitor for seizure recurrence, assess for complications of prolonged seizure (rhabdomyolysis, aspiration, metabolic acidosis), and address the precipitating cause (medication non-compliance due to cost).",
        decisions: [
          {
            id: "comprehensive-monitoring",
            text: "Maintain seizure precautions, aggressive IV hydration for rhabdomyolysis prevention, continuous EEG monitoring, reload levetiracetam to therapeutic levels, and initiate social work consult for medication access",
            isOptimal: true,
            consequence: "Ana is admitted to the neuro-ICU. IV NS is run at 200 mL/hr to maintain UOP >200 mL/hr for myoglobin clearance. CK peaks at 4,200 and trends down with hydration. Continuous EEG shows no subclinical seizures. Levetiracetam is reloaded IV. Social work identifies a patient assistance program for her medication. She recovers fully within 48 hours.",
            mechanismExplanation: "Prolonged tonic-clonic seizures cause massive skeletal muscle breakdown (rhabdomyolysis): the CK of 1,840 and dark urine (myoglobinuria) confirm this. Myoglobin is nephrotoxic — it precipitates in renal tubules and causes acute tubular necrosis, especially in acidic urine. Aggressive hydration dilutes myoglobin concentration and maintains tubular flow. The lactic acidosis (pH 7.22, lactate 5.6) results from anaerobic muscle metabolism during sustained contraction and resolves with cessation of seizure activity. The undetectable levetiracetam level confirms medication non-compliance as the precipitant. Social work addresses the root cause: medication affordability."
          },
          {
            id: "transfer-floor",
            text: "Seizure has stopped and patient is postictal — transfer to a medical floor bed for observation and restart home medications",
            isOptimal: false,
            consequence: "On the medical floor, the patient has a recurrent seizure at 2 AM that is not immediately recognized by non-neuro nursing staff. The CK continues to rise without aggressive hydration, and acute kidney injury develops with creatinine rising to 3.2. The lack of continuous EEG monitoring misses 20 minutes of subclinical seizure activity.",
            mechanismExplanation: "After status epilepticus, the risk of seizure recurrence is 20-30% in the first 24 hours. Continuous EEG monitoring is essential because subclinical (non-convulsive) seizures occur in up to 48% of patients after convulsive status epilepticus and are invisible without EEG. The elevated CK and myoglobinuria require aggressive hydration monitoring that exceeds floor-level nursing ratios. ICU-level monitoring is the standard of care for 24-48 hours post-status epilepticus."
          },
          {
            id: "phenytoin-add-on",
            text: "Add phenytoin loading dose on top of levetiracetam for double antiepileptic coverage and discharge in 24 hours with both medications",
            isOptimal: false,
            consequence: "Phenytoin loading causes hypotension (BP drops to 90/58) in a patient with post-seizure hemodynamic instability. Discharging on two antiepileptics with the same medication access barrier that caused the crisis ensures recurrence. The patient cannot afford one medication — she certainly cannot afford two.",
            mechanismExplanation: "Adding phenytoin to levetiracetam without clear indication introduces risk without benefit. Phenytoin's IV loading can cause hypotension and cardiac arrhythmias (it contains propylene glycol which is a myocardial depressant). The patient's seizures were caused by medication non-compliance, not treatment failure — her seizures were controlled on levetiracetam when she was taking it. Adding a second agent does not address the root cause (cost barrier) and adds drug interaction complexity, side effect burden, and financial cost. The optimal intervention targets the precipitating cause."
          }
        ],
        criticalThinking: "The root cause of this status epilepticus was medication non-compliance due to cost. How does addressing social determinants of health fit into the clinical management of neurological emergencies?"
      }
    ],
    debriefing: {
      keyLearning: [
        "Status epilepticus is defined as seizure activity lasting >5 minutes and requires immediate pharmacologic intervention — it will not self-terminate",
        "The first-line treatment is IV lorazepam or IM midazolam; do NOT skip to second-line agents prematurely",
        "GABA-A receptor internalization during prolonged seizures makes benzodiazepines progressively less effective — time is brain",
        "Post-status monitoring must include continuous EEG (subclinical seizures occur in ~48%), rhabdomyolysis management, and ICU-level care",
        "Addressing the precipitating cause (medication non-compliance due to cost) is as important as acute management"
      ],
      mechanismSummary: "Status epilepticus represents a failure of seizure termination mechanisms. Normally, seizures self-terminate through GABA-mediated inhibition and adenosine accumulation. In status epilepticus, sustained excitatory glutamate release activates NMDA receptors → calcium influx → excitotoxic neuronal injury. Simultaneously, GABA-A receptors undergo activity-dependent internalization (endocytosis), reducing the number of surface receptors available for benzodiazepine binding. This creates a self-perpetuating cycle: the longer the seizure, the more resistant it becomes to first-line treatment. Systemic complications include lactic acidosis from anaerobic muscle metabolism, rhabdomyolysis from sustained contraction, hyperthermia from muscle activity, and eventually cardiovascular collapse.",
      commonErrors: [
        "Placing objects in the mouth during active seizures — this causes iatrogenic injury and is never indicated",
        "Applying physical restraints during seizures, which increases rhabdomyolysis and fracture risk",
        "Waiting for seizures to self-terminate rather than administering benzodiazepines promptly",
        "Failing to monitor for subclinical seizures with continuous EEG after convulsive status resolves",
        "Treating the seizure without addressing the precipitating cause (medication access, compliance barriers)"
      ]
    }
  },
  {
    id: "c-diff-colitis",
    title: "The Post-Antibiotic Diarrhea Patient",
    patientProfile: "Eleanor Wright, 76-year-old female. PMH: Recent hospitalization (2 weeks ago) for UTI treated with ciprofloxacin x 10 days, Type 2 diabetes, osteoarthritis, mild dementia. Presenting from assisted living facility with 3 days of profuse watery diarrhea, up to 15 episodes daily.",
    chiefComplaint: "Profuse watery diarrhea, abdominal cramping, and low-grade fever",
    category: "GI/Infectious Disease",
    difficulty: "intermediate",
    bodySystem: "Gastrointestinal",
    stages: [
      {
        id: "initial-assessment",
        title: "Emergency Department Assessment",
        narrative: "Eleanor arrives from her assisted living facility with documentation showing 15 episodes of watery, foul-smelling diarrhea in the past 24 hours. The facility notes she completed ciprofloxacin 10 days ago for a UTI. She is confused, which the facility reports is worse than her baseline mild cognitive impairment. The stool has a characteristic 'horse barn' odor.",
        vitals: { hr: 104, bp: "100/58", rr: 20, spo2: 95, temp: 38.6, pain: 6 },
        labs: [
          { name: "WBC", value: "22.4", unit: "×10³/μL", flag: "critical" },
          { name: "Creatinine", value: "2.1", unit: "mg/dL", flag: "high" },
          { name: "Albumin", value: "2.4", unit: "g/dL", flag: "low" },
          { name: "Lactate", value: "2.8", unit: "mmol/L", flag: "high" },
          { name: "Potassium", value: "3.0", unit: "mEq/L", flag: "low" }
        ],
        assessmentFindings: [
          "Diffuse abdominal tenderness, worse in lower quadrants, mild distension",
          "Profuse watery stool: greenish, extremely foul-smelling",
          "Dry mucous membranes, tenting skin turgor",
          "Confusion: oriented to name only (baseline oriented x2 per facility)",
          "Perianal skin breakdown with excoriation from frequent diarrhea",
          "Recent antibiotic history: ciprofloxacin x 10 days completed 2 weeks ago"
        ],
        nursingPriority: "High clinical suspicion for Clostridioides difficile infection given the classic triad: recent antibiotic exposure (fluoroquinolone), elderly/institutionalized, and profuse watery diarrhea with leukocytosis. Immediate implementation of contact precautions is essential to prevent transmission.",
        decisions: [
          {
            id: "contact-precautions-test",
            text: "Immediately implement contact precautions (gown, gloves, private room), collect stool for C. difficile PCR/toxin assay, initiate oral vancomycin 125 mg QID, aggressive IV fluid resuscitation, and discontinue any unnecessary antibiotics",
            isOptimal: true,
            consequence: "Contact precautions are implemented before the test results return. Stool PCR returns positive for C. difficile toxin B within 2 hours. Oral vancomycin is started promptly. IV LR is initiated at 200 mL/hr. The infectious disease team is consulted. Hand hygiene with soap and water is emphasized to all staff (alcohol gel does NOT kill C. difficile spores).",
            mechanismExplanation: "C. difficile infection occurs when antibiotics (especially fluoroquinolones, clindamycin, cephalosporins) disrupt the normal gut microbiome, eliminating competitive flora that normally suppress C. difficile colonization. C. difficile produces toxin A (enterotoxin causing fluid secretion) and toxin B (cytotoxin causing mucosal damage). The WBC of 22.4 suggests significant colonic inflammation. Oral vancomycin is first-line for non-severe/severe CDI because it achieves high intraluminal concentrations where the organism resides. Contact precautions are critical because C. difficile forms heat-resistant spores that persist on surfaces for months. Alcohol-based hand sanitizer does NOT inactivate spores — soap and water with mechanical friction is required."
          },
          {
            id: "standard-precautions-only",
            text: "Maintain standard precautions, send stool culture and C. difficile test, start metronidazole IV for presumed intra-abdominal infection, and await test results before changing precautions",
            isOptimal: false,
            consequence: "Standard precautions are insufficient for C. difficile. Before results return, two other patients in adjacent rooms develop diarrhea. IV metronidazole is inferior to oral vancomycin for CDI because metronidazole achieves poor colonic concentrations. The patient's symptoms worsen over 48 hours on IV metronidazole.",
            mechanismExplanation: "C. difficile requires contact precautions empirically when clinical suspicion is high — waiting for test confirmation allows spore transmission. C. difficile spores can persist on hospital surfaces (bedrails, call lights, commodes) for up to 5 months. IV metronidazole was historically used but achieves low fecal concentrations (it is absorbed in the small intestine and only reaches the colon via biliary excretion in inflamed states). Current guidelines (IDSA/SHEA 2021) recommend oral vancomycin or fidaxomicin as first-line therapy for all severities of CDI. Metronidazole is reserved only as an adjunct in fulminant cases."
          },
          {
            id: "antidiarrheal-approach",
            text: "Administer loperamide for symptom control, start empiric ciprofloxacin for possible recurrent UTI with GI symptoms, and send routine stool culture",
            isOptimal: false,
            consequence: "Loperamide slows gut motility, trapping C. difficile toxins in the colon and dramatically worsening mucosal injury. Ciprofloxacin — the same antibiotic that precipitated the CDI — further disrupts the microbiome and provides a competitive advantage for C. difficile. Within 24 hours, the patient develops toxic megacolon with abdominal distension, absent bowel sounds, and hemodynamic instability.",
            mechanismExplanation: "Antimotility agents (loperamide, diphenoxylate) are absolutely contraindicated in suspected or confirmed CDI. They inhibit peristalsis, allowing toxin A and B to remain in prolonged contact with colonic mucosa, dramatically increasing mucosal damage and the risk of toxic megacolon. Toxic megacolon occurs when transmural inflammation causes colonic dilation (>6 cm on X-ray), loss of haustral markings, and risk of perforation. Re-administering the precipitating antibiotic (ciprofloxacin) provides further selective advantage to C. difficile by eliminating any remaining competitive flora."
          }
        ],
        criticalThinking: "Why is alcohol-based hand sanitizer ineffective against C. difficile, and what does this tell you about the organism's survival strategy?"
      },
      {
        id: "treatment-monitoring",
        title: "Treatment Response and Complication Monitoring",
        narrative: "Eleanor has been on oral vancomycin 125 mg QID for 48 hours. The frequency of diarrhea has decreased from 15 to 6 episodes daily. However, the morning assessment reveals new concerning findings.",
        vitals: { hr: 110, bp: "92/54", rr: 24, spo2: 93, temp: 39.2, pain: 8 },
        labs: [
          { name: "WBC", value: "32.8", unit: "×10³/μL", flag: "critical" },
          { name: "Lactate", value: "4.2", unit: "mmol/L", flag: "critical" },
          { name: "Creatinine", value: "2.8", unit: "mg/dL", flag: "high" },
          { name: "Albumin", value: "1.9", unit: "g/dL", flag: "critical" }
        ],
        assessmentFindings: [
          "Abdomen markedly distended, tympanic to percussion",
          "Absent bowel sounds in all four quadrants",
          "Rebound tenderness in lower quadrants",
          "Diarrhea episodes decreased but now more bloody",
          "Worsening confusion: not responding appropriately to commands",
          "Peripheral edema noted in lower extremities (albumin 1.9)"
        ],
        nursingPriority: "Recognize fulminant C. difficile colitis: rising WBC >30,000, hemodynamic instability, abdominal distension with absent bowel sounds suggest toxic megacolon. This is a surgical emergency requiring immediate escalation.",
        decisions: [
          {
            id: "escalate-surgical",
            text: "Immediately notify provider of fulminant presentation: request urgent surgical consult, add IV metronidazole 500 mg q8h to oral vancomycin, consider vancomycin retention enemas, obtain urgent abdominal CT, and prepare for possible emergent colectomy",
            isOptimal: true,
            consequence: "CT scan reveals colonic dilation of 7 cm with mucosal thickening and pericolonic stranding consistent with toxic megacolon. Surgery is consulted emergently. IV metronidazole is added as adjunctive therapy. The patient is taken for subtotal colectomy, which is lifesaving. Pathology confirms pseudomembranous colitis with transmural necrosis.",
            mechanismExplanation: "Fulminant CDI (formerly 'complicated' CDI) is defined by WBC >30,000, serum lactate >2.2, hypotension, ileus, or toxic megacolon. When oral vancomycin alone is insufficient, combination therapy is indicated: oral vancomycin (or per NG tube if ileus prevents oral intake) PLUS IV metronidazole (which reaches the inflamed colon via biliary and direct transmural secretion in severe disease) PLUS vancomycin retention enemas (if ileus prevents oral drug reaching the colon). Toxic megacolon occurs when transmural colonic inflammation destroys the myenteric plexus → loss of motor function → dilation → risk of perforation and peritonitis. Subtotal colectomy is lifesaving when medical management fails, with mortality of 35-80% without surgery in fulminant disease."
          },
          {
            id: "increase-vancomycin",
            text: "Increase oral vancomycin dose to 500 mg QID and continue monitoring — the diarrhea frequency is decreasing so the treatment is working",
            isOptimal: false,
            consequence: "While dose escalation is part of fulminant CDI management, it is insufficient as a sole intervention in the setting of toxic megacolon. With ileus developing, oral vancomycin may not even reach the colon. The patient develops perforation overnight, leading to fecal peritonitis and septic shock.",
            mechanismExplanation: "The decreasing diarrhea frequency is actually a concerning sign in this context — it may indicate ileus (colonic motor failure) rather than treatment response. When the colon becomes atonic and dilated, stool output paradoxically decreases because peristalsis has ceased. The rising WBC, rising lactate, and abdominal distension with absent bowel sounds all indicate clinical deterioration despite fewer diarrheal episodes. This is a critical cognitive trap: interpreting fewer stools as improvement when the clinical trajectory is clearly worsening."
          },
          {
            id: "fidaxomicin-switch",
            text: "Switch from vancomycin to fidaxomicin for better outcomes and wait for clinical improvement",
            isOptimal: false,
            consequence: "While fidaxomicin is an excellent option for recurrence prevention, switching antibiotics in the setting of fulminant disease with toxic megacolon delays the necessary surgical intervention. The patient continues to deteriorate hemodynamically. Fidaxomicin's advantages (narrow spectrum, lower recurrence rates) are relevant for non-fulminant disease, not for acute surgical emergencies.",
            mechanismExplanation: "Fidaxomicin is a narrow-spectrum macrolide that targets C. difficile with minimal disruption to the remaining gut microbiome, reducing recurrence rates compared to vancomycin (13% vs 27%). However, in fulminant CDI with toxic megacolon, the issue is no longer just antimicrobial coverage — it is transmural colonic necrosis requiring surgical intervention. Switching antimicrobials does not address the mechanical complication. The IDSA guidelines specifically recommend combination therapy (not monotherapy switching) plus surgical consultation for fulminant disease."
          }
        ],
        criticalThinking: "Why might decreasing diarrhea in a CDI patient actually be a sign of clinical deterioration rather than improvement?"
      }
    ],
    debriefing: {
      keyLearning: [
        "C. difficile infection should be suspected in any patient with diarrhea and recent antibiotic exposure — fluoroquinolones are the highest-risk class",
        "Contact precautions must be implemented empirically before test results return; alcohol-based hand sanitizer does not kill C. difficile spores",
        "Oral vancomycin or fidaxomicin is first-line therapy; IV metronidazole alone is inferior due to poor colonic concentration",
        "Antimotility agents (loperamide) are absolutely contraindicated in CDI — they trap toxins and promote toxic megacolon",
        "Decreasing stool output in CDI may paradoxically indicate worsening disease (ileus/toxic megacolon) rather than treatment response"
      ],
      mechanismSummary: "C. difficile infection results from antibiotic-induced disruption of the colonic microbiome. Normal gut flora (especially Bacteroides, Firmicutes) competitively inhibit C. difficile colonization through nutrient competition and bile acid metabolism. Antibiotics eliminate these protective bacteria, allowing C. difficile spores to germinate and vegetative cells to produce toxin A (enterotoxin: fluid secretion via activation of enteric nervous system and neutrophil recruitment) and toxin B (cytotoxin: disruption of actin cytoskeleton → cell rounding and death → mucosal ulceration with pseudomembrane formation). Fulminant disease involves transmural extension with myenteric plexus destruction → ileus → toxic megacolon → perforation → peritonitis.",
      commonErrors: [
        "Using alcohol-based hand sanitizer instead of soap and water — spores are resistant to alcohol",
        "Administering loperamide or diphenoxylate for symptomatic relief of CDI-related diarrhea",
        "Using IV metronidazole as sole therapy instead of oral vancomycin",
        "Interpreting decreased stool frequency as improvement without correlating with other clinical markers",
        "Failing to consult surgery early in fulminant disease with signs of toxic megacolon"
      ]
    }
  },
  {
    id: "chest-tube-management",
    title: "The Post-Thoracotomy Chest Tube Crisis",
    patientProfile: "James Mitchell, 58-year-old male. PMH: Right lower lobe lung cancer, status post right lower lobectomy 18 hours ago. Two chest tubes in place: one anterior (for air) and one posterior (for fluid). Connected to a chest drainage system (Pleur-Evac) on -20 cm H₂O suction. On 3L nasal cannula.",
    chiefComplaint: "Increasing dyspnea and nurse-identified drainage system concerns",
    category: "Respiratory/Surgical",
    difficulty: "intermediate",
    bodySystem: "Respiratory",
    stages: [
      {
        id: "drainage-assessment",
        title: "Chest Tube System Assessment",
        narrative: "During your hourly assessment, you notice the water seal chamber is showing continuous vigorous bubbling (air leak). Over the past 2 hours, the chest tube output has changed from serosanguineous to bright red, with 200 mL in the last hour. James reports increasing difficulty breathing and right-sided chest pressure. The dressing at the posterior chest tube insertion site appears saturated.",
        vitals: { hr: 112, bp: "138/86", rr: 26, spo2: 90, temp: 37.4, pain: 7 },
        labs: [
          { name: "Hgb", value: "9.2", unit: "g/dL", flag: "low" },
          { name: "Hct", value: "27.8", unit: "%", flag: "low" },
          { name: "Platelets", value: "142", unit: "×10³/μL" },
          { name: "INR", value: "1.2", unit: "" }
        ],
        assessmentFindings: [
          "Continuous bubbling in the water seal chamber (significant air leak)",
          "Chest tube output: 200 mL bright red blood in past hour (previously serosanguineous 30-50 mL/hr)",
          "Subcutaneous emphysema palpable along right lateral chest wall",
          "Diminished breath sounds on the right compared to left",
          "Chest tube tubing connections intact, no visible kinks or dependent loops",
          "Posterior insertion site dressing saturated with serosanguineous drainage"
        ],
        nursingPriority: "Two critical findings require immediate attention: (1) Continuous air leak with subcutaneous emphysema suggests bronchopleural fistula or parenchymal air leak; (2) Chest tube output >200 mL/hr of bright red blood is a post-thoracotomy hemorrhage emergency. Both require urgent surgical notification.",
        decisions: [
          {
            id: "notify-surgeon-stat",
            text: "Immediately notify the thoracic surgeon: report the continuous air leak, hourly output >200 mL bright blood, subcutaneous emphysema, and worsening respiratory status. Mark the subcutaneous emphysema borders, check all connections, and prepare for possible return to OR",
            isOptimal: true,
            consequence: "The thoracic surgeon arrives within 10 minutes. Chest X-ray shows a moderate right pneumothorax despite the functioning chest tube, indicating the air leak exceeds the drainage system's capacity. The bleeding is identified as a small arterial bleeder at the resection margin. James is taken back to the OR for hemorrhage control and bronchopleural fistula repair. Post-op recovery is uneventful.",
            mechanismExplanation: "Post-lobectomy chest tube management requires understanding the physics of pleural drainage. The water seal chamber bubbling indicates air entering the pleural space and exiting through the chest tube — continuous bubbling means a sustained air leak. Subcutaneous emphysema occurs when air tracks along tissue planes from the pleural space into the subcutaneous tissue, indicating the air leak exceeds the system's evacuation capacity. Chest tube output >200 mL/hr of bright red blood within 24 hours of thoracotomy suggests arterial bleeding requiring surgical re-exploration. Marking the emphysema borders with a skin marker allows serial monitoring of whether it is expanding or resolving."
          },
          {
            id: "clamp-chest-tube",
            text: "Clamp the chest tube to stop the air leak and reduce bleeding, then reposition the patient and reassess",
            isOptimal: false,
            consequence: "Clamping the chest tube traps air in the pleural space. Within minutes, the pneumothorax enlarges, and James develops acute respiratory distress with tracheal deviation to the left. He has developed a tension pneumothorax from the continuing air leak with no escape route. Emergency needle decompression is required before unclamping the tube.",
            mechanismExplanation: "A chest tube should NEVER be clamped when a continuous air leak is present. The chest tube is the pathway through which air exits the pleural space: clamping it converts an open system (air leaking but being evacuated) into a closed system where air accumulates under pressure. If the air leak continues (as with a bronchopleural fistula), the trapped air creates positive pressure in the pleural space → tension pneumothorax → mediastinal shift → compression of the contralateral lung and great vessels → obstructive shock and cardiac arrest. Clamping is only briefly indicated when testing for air leak resolution or during chest tube removal."
          },
          {
            id: "increase-suction",
            text: "Increase the wall suction from -20 to -40 cm H₂O to evacuate the air leak more effectively, apply a pressure dressing to the insertion site, and continue monitoring",
            isOptimal: false,
            consequence: "Excessive suction increases the pressure gradient across the air leak, potentially enlarging the bronchopleural fistula. The higher negative pressure damages the lung parenchyma at the staple line, worsening the air leak. The bleeding continues unabated because it is arterial in origin and requires surgical hemostasis, not nursing management alone.",
            mechanismExplanation: "Standard pleural suction is -20 cm H₂O, which provides enough negative pressure to re-expand the lung without excessive parenchymal stress. Increasing suction beyond -20 to -25 cm H₂O creates excessive transpulmonary pressure gradient, which can tear fragile post-surgical lung tissue and enlarge air leaks. The analogy is a suction cup on damaged glass: more suction makes the crack worse. For the hemorrhage component, >200 mL/hr of bright red blood is an accepted threshold for surgical re-exploration. No amount of suction adjustment or dressing changes addresses a surgical bleeder."
          }
        ],
        criticalThinking: "Why is continuous bubbling in the water seal chamber clinically significant, and when does an air leak transition from expected postoperative finding to emergency?"
      },
      {
        id: "accidental-dislodgement",
        title: "Chest Tube Dislodgement Emergency",
        narrative: "James returns from the OR with the air leak repaired and bleeding controlled. It is now postoperative day 3. He has one remaining chest tube on water seal (suction discontinued). While ambulating with physical therapy, James catches his foot on the IV pole. As he stumbles, the chest tube is accidentally pulled out. You hear the characteristic 'sucking' sound at the insertion site.",
        vitals: { hr: 118, bp: "146/92", rr: 28, spo2: 88, temp: 37.2, pain: 9 },
        assessmentFindings: [
          "Chest tube completely dislodged from right lateral chest wall",
          "Open wound at former insertion site with audible sucking sound on inspiration",
          "Patient clutching right chest, severe distress",
          "Rapidly developing subcutaneous emphysema around the site",
          "Breath sounds absent on the right side",
          "Petroleum gauze and occlusive dressing supplies available at bedside"
        ],
        nursingPriority: "An open pneumothorax ('sucking chest wound') has been created by the dislodged chest tube. The open wound allows atmospheric air to enter the pleural space during inspiration, collapsing the lung. Immediate wound occlusion is the priority, followed by monitoring for tension pneumothorax.",
        decisions: [
          {
            id: "occlusive-dressing",
            text: "Apply petroleum gauze and occlusive dressing taped on three sides (flutter valve effect), administer high-flow oxygen, call surgeon stat for chest tube reinsertion, monitor for tension pneumothorax",
            isOptimal: true,
            consequence: "The three-sided occlusive dressing is applied within 30 seconds, creating a one-way valve: the untaped side allows trapped air to escape during expiration while preventing atmospheric air entry during inspiration. SpO2 improves to 93% with high-flow oxygen. The thoracic surgeon arrives within 15 minutes and places a new chest tube under sterile technique. Repeat chest X-ray shows lung re-expansion.",
            mechanismExplanation: "The three-sided dressing creates a flutter valve mechanism that manages the open pneumothorax. During inspiration, negative intrapleural pressure pulls the dressing flat against the wound, sealing it and preventing atmospheric air entry. During expiration, positive pressure lifts the untaped edge, allowing trapped air to exit. This is superior to a four-sided (fully sealed) dressing because fully occlusive dressings can convert an open pneumothorax into a tension pneumothorax if air continues to leak from the lung into the pleural space with no exit route. The petroleum gauze provides an air-tight barrier, and taping three sides creates the directional valve."
          },
          {
            id: "four-sided-dressing",
            text: "Quickly cover the wound with a fully occlusive dressing taped on all four sides to completely seal the opening, then call the surgeon",
            isOptimal: false,
            consequence: "The four-sided dressing effectively seals the external wound. However, the post-surgical lung parenchyma continues to leak small amounts of air into the pleural space. With no exit route (chest tube removed, wound sealed), air accumulates under pressure. Within 10 minutes, James develops tracheal deviation, distended neck veins, and severe hypotension — tension pneumothorax. The dressing must be partially removed emergently to release trapped air.",
            mechanismExplanation: "A four-sided (fully occlusive) dressing seals the wound but creates a closed system. If the lung surface continues to leak air (common after recent thoracic surgery), that air has no escape route. Progressive air accumulation creates tension pneumothorax: intrapleural pressure exceeds atmospheric pressure → mediastinal shift → IVC compression → decreased venous return → obstructive shock. The three-sided dressing prevents this by providing a one-way valve. This is why emergency trauma management teaches 'three sides, not four' for open chest wounds."
          },
          {
            id: "gloved-hand-pressure",
            text: "Apply manual pressure with a gloved hand while sending someone to find supplies, lay the patient flat to reduce air entry",
            isOptimal: false,
            consequence: "Manual pressure is intermittent and unreliable — removing the hand to reposition creates an open pneumothorax each time. Laying the patient flat worsens respiratory distress as the diaphragm pushes upward against the collapsed lung. The delay in applying a proper dressing allows progressive pneumothorax. Petroleum gauze should always be stocked at the bedside of every patient with a chest tube.",
            mechanismExplanation: "Bedside chest tube supplies (petroleum gauze, occlusive dressings, padded clamps) should be immediately available at the bedside of every patient with a chest tube — this is a nursing standard of care, not an improvised response. Manual pressure cannot create a reliable seal against the dynamic pressure changes of respiration. Placing the patient flat is contraindicated because it reduces functional residual capacity: the supine position allows abdominal contents to push the diaphragm cephalad, further compromising the already impaired lung. Semi-Fowler's or upright positioning optimizes respiratory mechanics."
          }
        ],
        criticalThinking: "Why is a three-sided dressing superior to a four-sided dressing for an open pneumothorax? Consider what happens to trapped air when the external wound is sealed but the internal air leak continues."
      }
    ],
    debriefing: {
      keyLearning: [
        "Continuous bubbling in the water seal chamber indicates an active air leak — assess whether it is small and expected or large and pathological",
        "Chest tube output >200 mL/hr of bright red blood post-thoracotomy requires immediate surgical notification",
        "NEVER clamp a chest tube when a continuous air leak is present — this can create a tension pneumothorax",
        "For accidental chest tube dislodgement, apply petroleum gauze with three-sided occlusive dressing (flutter valve) — NOT four sides",
        "Chest tube bedside supplies (petroleum gauze, occlusive dressing, padded clamps) must always be immediately accessible"
      ],
      mechanismSummary: "Chest tube management requires understanding pleural space physics. The pleural space normally has negative pressure (-5 cm H₂O). Chest tubes evacuate air and fluid to restore this negative pressure and maintain lung expansion. The water seal chamber acts as a one-way valve: air exits from the pleural space through the water seal (bubbling) but atmospheric air cannot enter. Suction augments air/fluid removal. Air leaks cause bubbling — small leaks after surgery are common and self-resolve, but large continuous leaks indicate parenchymal or bronchial disruption. An open pneumothorax (from dislodged tube) allows bidirectional air flow, collapsing the lung. The three-sided dressing creates an improvised flutter valve until definitive chest tube reinsertion.",
      commonErrors: [
        "Clamping chest tubes during active air leaks, risking tension pneumothorax",
        "Increasing suction beyond -20 to -25 cm H₂O, worsening parenchymal air leaks",
        "Applying fully occlusive (four-sided) dressings to open chest wounds",
        "Not having emergency chest tube supplies at the patient's bedside",
        "Failing to monitor and mark subcutaneous emphysema borders for progression tracking"
      ]
    }
  },
  {
    id: "psychiatric-emergency",
    title: "The Acutely Agitated Patient",
    patientProfile: "Marcus Thompson, 34-year-old male. PMH: Bipolar disorder type I on lithium 900 mg BID and olanzapine 10 mg nightly, prior psychiatric hospitalizations x3. Brought to ED by police after being found running in traffic, screaming about 'government surveillance.' He is combative and has already overturned a stretcher in the ambulance bay.",
    chiefComplaint: "Acute agitation, psychomotor excitation, and threatening behavior",
    category: "Psychiatric Emergency",
    difficulty: "intermediate",
    bodySystem: "Psychiatric",
    stages: [
      {
        id: "de-escalation-attempt",
        title: "Initial De-escalation and Safety Assessment",
        narrative: "Marcus is pacing rapidly in the exam room. He is diaphoretic, pupils are dilated, and he is speaking rapidly with pressured speech. He intermittently strikes the walls and has threatened to hurt anyone who comes near him. Two security officers are present. The room has been cleared of sharp objects and movable equipment. His girlfriend, who arrived separately, reports he stopped taking his lithium 2 weeks ago because 'he felt cured' and she found empty bottles of an herbal supplement containing St. John's Wort in his apartment.",
        vitals: { hr: 128, bp: "168/98", rr: 24, spo2: 98, temp: 39.1, pain: 0 },
        labs: [
          { name: "Lithium level", value: "<0.2", unit: "mEq/L", flag: "low" },
          { name: "WBC", value: "11.2", unit: "×10³/μL", flag: "high" },
          { name: "CK", value: "890", unit: "U/L", flag: "high" },
          { name: "TSH", value: "1.8", unit: "mIU/L" },
          { name: "Urine drug screen", value: "Negative", unit: "" },
          { name: "Glucose", value: "142", unit: "mg/dL", flag: "high" }
        ],
        assessmentFindings: [
          "Extreme psychomotor agitation: pacing, striking walls, rapid pressured speech",
          "Dilated pupils, diaphoresis, flushed skin",
          "Temperature 39.1°C with no obvious infectious source",
          "Grandiose delusions: 'I am being tracked by the CIA because of my powers'",
          "Hyperreflexia noted during brief exam attempt",
          "CK elevated at 890 — consider rhabdomyolysis from agitation vs neuroleptic malignant syndrome vs serotonin syndrome",
          "St. John's Wort use reported (potent serotonergic herbal supplement)"
        ],
        nursingPriority: "Ensure safety of patient and staff as the immediate priority. Then differentiate between acute mania (bipolar disorder medication non-compliance), serotonin syndrome (St. John's Wort + residual medication interactions), and neuroleptic malignant syndrome (recent olanzapine use). The approach to chemical intervention differs based on the underlying cause.",
        decisions: [
          {
            id: "verbal-de-escalation-first",
            text: "Attempt verbal de-escalation using a calm, non-threatening approach: reduce stimuli, offer oral medications (olanzapine 10 mg PO or lorazepam 2 mg PO), maintain safe distance, use open-ended questions. Simultaneously evaluate for serotonin syndrome given St. John's Wort use, hyperthermia, hyperreflexia, and diaphoresis",
            isOptimal: true,
            consequence: "Using a calm, low voice, you introduce yourself from a safe distance. You offer him water and a choice between oral medications. The reduced stimulation and respectful approach de-escalates his combativeness enough to accept lorazepam 2 mg PO. The clinical team identifies the serotonin syndrome differential: hyperthermia + hyperreflexia + clonus + diaphoresis + agitation in the setting of serotonergic supplement use. Cyproheptadine is considered if symptoms progress.",
            mechanismExplanation: "Verbal de-escalation is the gold standard first intervention for acute agitation and succeeds in 60-80% of cases. The key principles are: (1) Reduce environmental stimulation (dim lights, reduce noise, limit personnel), (2) Maintain safe distance (two arm lengths), (3) Speak calmly with short sentences, (4) Offer choices to restore sense of control, (5) Avoid confrontation or arguing with delusions. The clinical picture raises concern for serotonin syndrome: St. John's Wort (contains hypericin, a potent SSRI-like compound) combined with any residual serotonergic medications can cause excess serotonergic activity → hyperthermia, hyperreflexia, clonus, agitation, diaphoresis. Clonus (especially lower extremity) is the most specific finding for serotonin syndrome."
          },
          {
            id: "immediate-restraints",
            text: "Apply four-point physical restraints immediately for staff safety, then administer haloperidol 10 mg IM + diphenhydramine 50 mg IM for rapid sedation",
            isOptimal: false,
            consequence: "Physical restraints without attempting de-escalation violates the patient's rights and escalates his agitation further. He fights the restraints, worsening rhabdomyolysis (CK rises to 3,200). Haloperidol, an antipsychotic with serotonergic properties, worsens the suspected serotonin syndrome: his temperature spikes to 40.2°C and he develops severe rigidity. The clinical picture now overlaps with neuroleptic malignant syndrome, complicating diagnosis and management.",
            mechanismExplanation: "Physical restraints should be a last resort after de-escalation attempts fail and there is an imminent safety threat. Restraints are associated with increased injury risk, rhabdomyolysis (from isometric muscle contraction against restraints), positional asphyxia, and psychological trauma. Haloperidol is a D2 receptor antagonist but also has serotonergic activity: in a patient with potential serotonin syndrome, adding serotonergic agents can be fatal. The combination of hyperthermia + rigidity after antipsychotic administration raises the differential of NMS (idiosyncratic reaction to dopamine blockade) vs serotonin syndrome (dose-dependent serotonergic excess). The distinction matters: NMS treatment involves dantrolene and bromocriptine, while serotonin syndrome treatment involves cyproheptadine and benzodiazepines."
          },
          {
            id: "benzodiazepine-only",
            text: "Administer midazolam 5 mg IM without attempting verbal de-escalation — verbal techniques won't work with someone this agitated, and benzodiazepines are the safest option",
            isOptimal: false,
            consequence: "While benzodiazepines are indeed safer than antipsychotics in the serotonin syndrome differential, skipping verbal de-escalation violates best practice guidelines and patient autonomy. IM midazolam sedates Marcus within 10 minutes, but the heavy sedation masks the evolving serotonin syndrome symptoms. His temperature continues to rise unmonitored to 40.0°C before a nurse rechecks vitals, delaying critical treatment.",
            mechanismExplanation: "Benzodiazepines are the safest pharmacologic option for undifferentiated agitation because they have no serotonergic or dopaminergic effects — making them safe regardless of whether the agitation is from mania, serotonin syndrome, NMS, or substance intoxication. However, verbal de-escalation should always be attempted first: the APA, AAEP, and Joint Commission all mandate that verbal de-escalation be attempted before chemical or physical restraint. Additionally, over-sedation can mask vital sign trends that are diagnostic (rising temperature in serotonin syndrome, progressive rigidity in NMS). The goal is calm cooperation, not obtundation."
          }
        ],
        criticalThinking: "How do you differentiate serotonin syndrome from neuroleptic malignant syndrome in a patient with exposure to both serotonergic supplements and antipsychotic medications?"
      },
      {
        id: "ongoing-management",
        title: "Differential Diagnosis Clarification",
        narrative: "Marcus accepted oral lorazepam and is calmer but still intermittently agitated. You perform a more detailed neurological assessment. He has bilateral lower extremity clonus (>3 beats), hyperreflexia throughout, and continued diaphoresis. His temperature remains 39.1°C. He is tremulous and has intermittent myoclonic jerks in his upper extremities. His girlfriend confirms the St. John's Wort use began 1 week ago.",
        vitals: { hr: 116, bp: "152/88", rr: 22, spo2: 97, temp: 39.1, pain: 0 },
        labs: [
          { name: "CK (repeat)", value: "1,420", unit: "U/L", flag: "high" },
          { name: "Core temp (rectal)", value: "39.4", unit: "°C", flag: "high" },
          { name: "Creatinine", value: "1.4", unit: "mg/dL", flag: "high" }
        ],
        assessmentFindings: [
          "Bilateral lower extremity clonus (>3 beats, inducible)",
          "Hyperreflexia in upper and lower extremities (3+ throughout)",
          "Intermittent myoclonic jerks in upper extremities",
          "Diaphoresis persists, skin flushed",
          "Tremor of hands, worsening with intention",
          "Bowel sounds hyperactive (diarrhea reported by girlfriend over past 2 days)",
          "Mydriasis (dilated pupils) bilateral"
        ],
        nursingPriority: "The constellation of clonus + hyperreflexia + hyperthermia + diaphoresis + agitation + myoclonus in the setting of serotonergic agent exposure (St. John's Wort) meets Hunter Serotonin Toxicity Criteria. This is serotonin syndrome, not pure mania or NMS. Treatment is discontinuation of serotonergic agents, benzodiazepines for agitation, and cyproheptadine for moderate-severe cases.",
        decisions: [
          {
            id: "serotonin-syndrome-protocol",
            text: "Confirm serotonin syndrome diagnosis using Hunter Criteria, discontinue all serotonergic agents, administer cyproheptadine 12 mg PO loading then 2 mg q2h, continue benzodiazepines for agitation, active cooling measures, IV hydration for rhabdomyolysis prevention, continuous cardiac monitoring",
            isOptimal: true,
            consequence: "The medical team confirms serotonin syndrome based on Hunter Criteria (spontaneous clonus with agitation and diaphoresis in the setting of serotonergic agent exposure). St. John's Wort is discontinued. Cyproheptadine (serotonin antagonist) is administered via NG tube. Active cooling with cooling blankets reduces temperature to 38.2°C within 2 hours. IV hydration maintains UOP for myoglobin clearance. Marcus's symptoms begin resolving within 12 hours. Psychiatry is consulted for bipolar disorder management without serotonergic agents.",
            mechanismExplanation: "The Hunter Serotonin Toxicity Criteria require a serotonergic agent exposure PLUS one of: spontaneous clonus, inducible clonus with agitation or diaphoresis, ocular clonus with agitation or diaphoresis, tremor with hyperreflexia, or temperature >38°C with ocular/inducible clonus. Marcus meets criteria with inducible clonus + agitation + diaphoresis. St. John's Wort contains hypericin and hyperforin, which inhibit serotonin reuptake and MAO activity. Cyproheptadine is a 5-HT2A receptor antagonist that directly blocks the excess serotonergic stimulation. Unlike NMS (which develops over days-weeks with 'lead pipe' rigidity), serotonin syndrome develops within hours with clonus and hyperreflexia as distinguishing features."
          },
          {
            id: "antipsychotic-restart",
            text: "This is acute mania from lithium discontinuation — restart olanzapine 20 mg IM for acute manic episode, plan lithium reload, and admit to psychiatry",
            isOptimal: false,
            consequence: "Olanzapine has serotonergic activity (5-HT2A/2C antagonism) and while this might actually be partially therapeutic for serotonin syndrome, the higher dose and IM route cause excessive sedation that masks the clinical picture. The temperature continues to rise because the serotonergic excess is not addressed with specific antidotal therapy. The patient requires ICU admission when his temperature reaches 40.5°C.",
            mechanismExplanation: "While acute mania from lithium discontinuation likely contributes to the agitation, the physical examination findings (clonus, hyperreflexia, hyperthermia, diaphoresis, myoclonus) are not explained by mania alone. Mania causes behavioral symptoms (pressured speech, grandiosity, decreased sleep) but does not cause clonus or hyperreflexia. These neurological signs are pathognomonic for serotonin excess at the synaptic cleft. Treating this as pure mania without addressing the serotonin syndrome misses the life-threatening component."
          },
          {
            id: "dantrolene-nms",
            text: "Administer dantrolene 2.5 mg/kg IV for suspected neuroleptic malignant syndrome, discontinue all medications, and arrange ICU transfer",
            isOptimal: false,
            consequence: "Dantrolene (a skeletal muscle relaxant acting on ryanodine receptors) is the treatment for NMS, not serotonin syndrome. While it may reduce muscle rigidity, it does not address the central serotonergic excess causing the syndrome. The condition does not improve because the wrong antidote was selected. The distinction between NMS (rigidity, bradyreflexia, lead-pipe) and serotonin syndrome (clonus, hyperreflexia, neuromuscular hyperactivity) is clinically critical.",
            mechanismExplanation: "NMS and serotonin syndrome are frequently confused but have different pathophysiology and treatments. NMS is caused by central dopamine D2 receptor blockade (from antipsychotics) → hypothalamic thermoregulatory failure + extrapyramidal rigidity. It develops over days-weeks, causes 'lead pipe' rigidity, and bradyreflexia (decreased reflexes). Treatment: dantrolene (reduces muscle rigidity via ryanodine receptor blockade) + bromocriptine (dopamine agonist). Serotonin syndrome is caused by excess serotonergic activity → neuromuscular excitability + autonomic instability. It develops within hours, causes clonus and hyperreflexia. Treatment: cyproheptadine (5-HT2A antagonist) + benzodiazepines. Using the wrong antidote delays appropriate treatment."
          }
        ],
        criticalThinking: "Clonus and hyperreflexia point toward serotonin syndrome, while lead-pipe rigidity and bradyreflexia point toward NMS. Why does this distinction matter for treatment selection?"
      }
    ],
    debriefing: {
      keyLearning: [
        "Verbal de-escalation should always be the first intervention for acute agitation and succeeds in 60-80% of cases",
        "Benzodiazepines are the safest pharmacologic option for undifferentiated agitation because they are safe across all differentials",
        "Serotonin syndrome is distinguished from NMS by clonus, hyperreflexia, and rapid onset; NMS features lead-pipe rigidity, bradyreflexia, and gradual onset",
        "St. John's Wort is a potent serotonergic supplement that can cause serotonin syndrome alone or in combination with other serotonergic agents",
        "Cyproheptadine is the specific antidote for serotonin syndrome; dantrolene/bromocriptine are for NMS — using the wrong antidote is ineffective"
      ],
      mechanismSummary: "This case demonstrates the intersection of psychiatric emergency (acute mania from lithium non-compliance) and medical emergency (serotonin syndrome from St. John's Wort). Serotonin syndrome results from excess serotonergic activity at central and peripheral 5-HT receptors, particularly 5-HT1A and 5-HT2A. The clinical triad is: (1) neuromuscular hyperactivity (clonus, hyperreflexia, myoclonus), (2) autonomic instability (hyperthermia, diaphoresis, tachycardia, hypertension), and (3) altered mental status (agitation, confusion). The Hunter Criteria provide a sensitive and specific diagnostic framework. Treatment targets the serotonergic excess directly with cyproheptadine (5-HT2A antagonist) while managing complications (hyperthermia, rhabdomyolysis) supportively.",
      commonErrors: [
        "Skipping verbal de-escalation and proceeding directly to physical or chemical restraint",
        "Using haloperidol or other antipsychotics with serotonergic activity in undifferentiated agitation with hyperthermia",
        "Confusing serotonin syndrome with NMS and administering the wrong antidote",
        "Not asking about herbal supplements, particularly St. John's Wort, 5-HTP, and tryptophan",
        "Over-sedating agitated patients and masking evolving vital sign abnormalities"
      ]
    }
  },
  {
    id: "neonatal-distress",
    title: "The Newborn with Respiratory Distress",
    patientProfile: "Baby Girl Torres, born 15 minutes ago at 34 weeks gestational age via emergency cesarean section for placental abruption. Birth weight 2.1 kg. Apgar scores: 5 at 1 minute, 7 at 5 minutes. Mother had no prenatal steroids (abruption occurred suddenly). The infant was brought to the NICU for respiratory distress.",
    chiefComplaint: "Tachypnea, nasal flaring, and intercostal retractions in a premature neonate",
    category: "Neonatal Care",
    difficulty: "intermediate",
    bodySystem: "Neonatal",
    stages: [
      {
        id: "nicu-admission",
        title: "NICU Admission Assessment",
        narrative: "You receive Baby Torres in the NICU. She is on the radiant warmer, placed immediately after delivery. The infant is visibly working hard to breathe with prominent intercostal and subcostal retractions, nasal flaring, and an expiratory grunt audible without a stethoscope. Her skin is pink centrally but acrocyanosis is present. The Silverman-Andersen score is being calculated.",
        vitals: { hr: 172, bp: "52/30", rr: 72, spo2: 86, temp: 36.2 },
        labs: [
          { name: "ABG pH", value: "7.28", unit: "", flag: "low" },
          { name: "PaCO2", value: "52", unit: "mmHg", flag: "high" },
          { name: "PaO2", value: "42", unit: "mmHg", flag: "low" },
          { name: "Glucose", value: "38", unit: "mg/dL", flag: "critical" },
          { name: "Hgb", value: "14.2", unit: "g/dL" }
        ],
        assessmentFindings: [
          "Silverman-Andersen score: 7 (moderate-severe respiratory distress)",
          "Prominent intercostal and subcostal retractions",
          "Nasal flaring with each breath",
          "Expiratory grunting audible without stethoscope",
          "Central pink, peripheral acrocyanosis",
          "Axillary temperature 36.2°C (borderline hypothermia for a neonate)",
          "34 weeks gestational age — no antenatal corticosteroids administered",
          "Hypoglycemia: glucose 38 mg/dL"
        ],
        nursingPriority: "This preterm infant without antenatal steroid exposure is at high risk for Respiratory Distress Syndrome (RDS) from surfactant deficiency. The combination of prematurity, expiratory grunting (auto-PEEP to maintain alveolar patency), retractions, and hypoxemia is classic. Immediate priorities are thermoregulation, respiratory support, surfactant administration, and glucose correction.",
        decisions: [
          {
            id: "comprehensive-nicu-care",
            text: "Initiate CPAP 6 cm H₂O with blended oxygen targeting SpO2 90-95%, prepare for surfactant administration (INSURE technique or LISA), correct hypothermia with radiant warmer and plastic wrap, administer IV dextrose bolus for hypoglycemia, minimize handling",
            isOptimal: true,
            consequence: "CPAP stabilizes the infant's breathing by providing continuous positive airway pressure to prevent alveolar collapse. SpO2 improves to 91%. Surfactant (beractant) is administered via thin catheter during spontaneous breathing (LISA technique). Temperature rises to 36.8°C with warm environment and plastic wrap. D10W 2 mL/kg IV push corrects glucose to 62 mg/dL. Over the next 2 hours, retractions diminish and the Silverman-Andersen score improves to 3.",
            mechanismExplanation: "RDS results from deficiency of pulmonary surfactant, which is produced by Type II alveolar pneumocytes beginning at approximately 24 weeks gestation but reaching adequate levels around 34-36 weeks. Surfactant reduces alveolar surface tension (by disrupting intermolecular forces between water molecules), preventing alveolar collapse at end-expiration. Without surfactant, alveoli collapse with each expiration → atelectasis → V/Q mismatch → hypoxemia. The infant's expiratory grunting is a compensatory mechanism: grunting against a partially closed glottis creates auto-PEEP, mimicking CPAP to keep alveoli open. CPAP provides external positive pressure to achieve the same goal. Exogenous surfactant replaces the deficient endogenous supply. Antenatal steroids (betamethasone) accelerate Type II pneumocyte maturation and surfactant production — this infant missed this intervention."
          },
          {
            id: "intubate-immediately",
            text: "Intubate immediately and place on mechanical ventilation with high FiO2, then administer surfactant through the endotracheal tube",
            isOptimal: false,
            consequence: "Intubation is performed but causes a vagal bradycardic response (HR drops to 80) requiring brief positive pressure ventilation. High-pressure mechanical ventilation in a surfactant-deficient lung causes volutrauma and barotrauma, injuring the already fragile alveoli. While surfactant administration via ETT is effective, the infant now requires prolonged ventilation because the mechanical injury triggers an inflammatory cascade (ventilator-induced lung injury).",
            mechanismExplanation: "Current neonatology evidence strongly favors non-invasive respiratory support (CPAP) over immediate intubation for premature infants with RDS, when clinically stable enough. Mechanical ventilation causes: (1) Barotrauma: excessive pressure damages alveolar walls, (2) Volutrauma: excessive tidal volumes over-distend alveoli, (3) Atelectotrauma: repeated opening and closing of unstable alveoli causes shear stress. These injuries trigger inflammatory cytokine release → bronchopulmonary dysplasia (BPD). The INSURE (INtubate-SURfactant-Extubate) and LISA (Less Invasive Surfactant Administration) techniques allow surfactant delivery while avoiding sustained mechanical ventilation. Intubation is reserved for infants failing CPAP (persistent apnea, severe hypoxemia, or hypercarbia)."
          },
          {
            id: "warm-observe",
            text: "Focus on warming the infant first — hypothermia is the most dangerous immediate threat. Place under radiant warmer, wrap in warm blankets, and reassess respiratory status once temperature normalizes",
            isOptimal: false,
            consequence: "While thermoregulation is important, treating it as the sole priority while ignoring SpO2 of 86% and severe respiratory distress delays critical respiratory interventions. Warming alone does not address the surfactant deficiency. The infant's respiratory acidosis worsens (PaCO2 rises to 62 mmHg) during the delay, and the infant becomes increasingly exhausted from the work of breathing.",
            mechanismExplanation: "Neonatal thermoregulation is indeed a critical priority (the WHO Golden Minute principle includes drying and warming), but it must occur simultaneously with respiratory assessment and intervention — not sequentially. Hypothermia increases oxygen consumption (cold stress triggers non-shivering thermogenesis in brown fat, consuming oxygen and glucose), worsening the hypoxemia from RDS. However, an SpO2 of 86% with a Silverman-Andersen score of 7 represents severe respiratory distress that will lead to respiratory failure without CPAP and surfactant. Neonatal resuscitation requires parallel interventions: thermoregulation AND respiratory support AND glucose management simultaneously."
          }
        ],
        criticalThinking: "Why does the premature infant grunt during expiration? How does this compensatory mechanism relate to the purpose of CPAP therapy?"
      },
      {
        id: "ongoing-monitoring",
        title: "Post-Surfactant Monitoring and Complications",
        narrative: "Baby Torres received surfactant via LISA technique 2 hours ago with good initial response. She is on CPAP 5 cm H₂O with FiO2 30%. However, during your 4-hour assessment, you notice new concerning findings. The infant has become less active, and the continuous pulse oximetry shows intermittent desaturation episodes.",
        vitals: { hr: 158, bp: "48/28", rr: 45, spo2: 88, temp: 36.8 },
        labs: [
          { name: "Glucose", value: "72", unit: "mg/dL" },
          { name: "ABG pH", value: "7.32", unit: "", flag: "low" },
          { name: "PaCO2", value: "48", unit: "mmHg", flag: "high" },
          { name: "Total bilirubin", value: "8.2", unit: "mg/dL", flag: "high" },
          { name: "Calcium (ionized)", value: "3.8", unit: "mg/dL", flag: "low" }
        ],
        assessmentFindings: [
          "Intermittent apneic episodes lasting 15-20 seconds with bradycardia (HR dips to 90)",
          "Mild jaundice visible on face and chest",
          "Fontanelle soft and flat",
          "Decreased spontaneous movement compared to initial assessment",
          "CPAP delivering appropriately, no air leaks around prongs",
          "Abdominal distension noted — no stool since birth",
          "Feeding not yet initiated"
        ],
        nursingPriority: "Apnea of prematurity is common in infants <37 weeks and is the primary concern. However, the differential for apnea in a premature infant includes sepsis, hypoglycemia, hypothermia, IVH (intraventricular hemorrhage), and NEC (necrotizing enterocolitis). Caffeine citrate is the first-line treatment for apnea of prematurity.",
        decisions: [
          {
            id: "caffeine-workup",
            text: "Administer caffeine citrate 20 mg/kg IV loading dose, obtain sepsis workup (CBC, blood culture, CRP), cranial ultrasound to rule out IVH, abdominal X-ray for distension, maintain NPO until abdominal assessment complete, and continue apnea monitoring with event recording",
            isOptimal: true,
            consequence: "Caffeine citrate is loaded and apneic episodes decrease from 6/hour to 1/hour within 4 hours. Cranial ultrasound shows Grade I IVH (germinal matrix hemorrhage only — common in premature infants). Sepsis workup is negative. Abdominal X-ray shows a normal gas pattern without pneumatosis. Trophic feeds are initiated cautiously with maternal breast milk at 10 mL/kg/day. Phototherapy is initiated for jaundice.",
            mechanismExplanation: "Apnea of prematurity results from immature brainstem respiratory centers — the medullary chemoreceptors and pontine respiratory groups have incomplete myelination before 37 weeks. Caffeine citrate (a methylxanthine) blocks adenosine A1 and A2A receptors in the medullary respiratory center: adenosine normally acts as a respiratory depressant, so blocking it stimulates respiratory drive. The loading dose (20 mg/kg) achieves therapeutic levels rapidly, with maintenance dosing (5-10 mg/kg/day) continuing until 34-36 weeks corrected gestational age. The IVH screening is critical: premature infants are at high risk for germinal matrix hemorrhage, especially within the first 72 hours of life. The fragile subependymal germinal matrix vasculature is susceptible to fluctuations in cerebral blood flow."
          },
          {
            id: "increase-cpap",
            text: "The apneic episodes suggest worsening RDS — increase CPAP to 8 cm H₂O and increase FiO2 to 50%. Consider repeat surfactant dose.",
            isOptimal: false,
            consequence: "Increasing CPAP pressure to 8 cm H₂O in a 2.1 kg infant causes gastric distension (aerophagia) and increases intrathoracic pressure, impeding venous return. The higher FiO2 is unnecessary as the desaturations are from central apnea, not V/Q mismatch. The infant's abdominal distension worsens, and excessive CPAP pressure raises the risk of pneumothorax. The apneic episodes continue because the underlying cause (brainstem immaturity) is not addressed by positive pressure.",
            mechanismExplanation: "Apnea of prematurity is central apnea (brainstem origin), not obstructive or due to lung disease. CPAP supports oxygenation by preventing alveolar collapse but does not stimulate the central respiratory drive. Increasing CPAP pressure in an infant whose lung disease is improving (FiO2 was already weaning to 30%) creates problems: (1) Excessive positive pressure inhibits venous return → decreased cardiac output, (2) Gastric distension from air swallowing → NEC risk, (3) Pneumothorax risk from alveolar over-distension. The correct treatment for central apnea is a respiratory stimulant (caffeine), not increased positive pressure. Additionally, excessive FiO2 in premature infants increases the risk of retinopathy of prematurity (ROP) from oxygen free radical damage to developing retinal vasculature."
          },
          {
            id: "stimulate-and-watch",
            text: "Apnea in premature infants is normal — provide tactile stimulation during episodes and continue routine monitoring without medication changes",
            isOptimal: false,
            consequence: "While tactile stimulation is appropriate during individual apneic episodes, frequent apnea (>3 episodes in 1 hour requiring intervention) warrants pharmacologic treatment. Without caffeine, the episodes increase in frequency and duration. One episode lasts 30 seconds with a heart rate nadir of 60, requiring bag-mask ventilation. The infant is at risk for hypoxic injury from recurrent untreated episodes.",
            mechanismExplanation: "Tactile stimulation (rubbing the back or soles of feet) is appropriate as an immediate response to an individual apneic episode — it activates the reticular activating system and 'reminds' the brainstem to breathe. However, when apnea is recurrent (defined as >3 episodes in 1 hour, or any episode requiring positive pressure ventilation, or any episode causing significant bradycardia or desaturation), pharmacologic treatment with caffeine is indicated. Untreated recurrent apnea causes intermittent hypoxia-reoxygenation cycles that are associated with retinopathy of prematurity, neurodevelopmental impairment, and increased risk of SIDS. Caffeine has been shown in the CAP trial to reduce BPD, improve neurodevelopmental outcomes, and reduce the need for mechanical ventilation."
          }
        ],
        criticalThinking: "Why is caffeine, a common daily stimulant, used as a critical medication in neonatal care? Consider its mechanism of action on brainstem respiratory centers."
      }
    ],
    debriefing: {
      keyLearning: [
        "RDS in premature infants results from surfactant deficiency — expiratory grunting is a compensatory auto-PEEP mechanism",
        "CPAP is preferred over immediate intubation for stable premature infants with RDS; LISA/INSURE techniques deliver surfactant without prolonged mechanical ventilation",
        "Neonatal care requires simultaneous management of thermoregulation, respiratory support, and glucose — not sequential prioritization",
        "Apnea of prematurity is central in origin and is treated with caffeine citrate — increasing CPAP does not address brainstem immaturity",
        "Excessive oxygen (FiO2) in premature infants risks retinopathy of prematurity — target SpO2 90-95%, not 100%"
      ],
      mechanismSummary: "This case illustrates two common neonatal conditions. RDS results from insufficient surfactant production by immature Type II pneumocytes → increased alveolar surface tension → alveolar collapse at end-expiration → atelectasis → intrapulmonary shunt → hypoxemia. The infant compensates by grunting (creating auto-PEEP) and increasing respiratory rate (reducing time for alveolar collapse). Treatment with CPAP mimics grunting physiologically, and exogenous surfactant replaces the deficit. Apnea of prematurity results from immature medullary respiratory center neurons with incomplete myelination → absent or irregular respiratory drive → periodic breathing → apneic episodes. Caffeine blocks inhibitory adenosine receptors in the respiratory center, augmenting the drive to breathe.",
      commonErrors: [
        "Intubating premature infants reflexively rather than trialing non-invasive support first",
        "Using high FiO2 without targeting specific SpO2 ranges (90-95% for premature infants)",
        "Treating apnea of prematurity with increased CPAP rather than caffeine (wrong mechanism)",
        "Delaying respiratory interventions while focusing exclusively on thermoregulation",
        "Not initiating cranial ultrasound screening for IVH within the first 72 hours of life in premature infants"
      ]
    }
  }
];
