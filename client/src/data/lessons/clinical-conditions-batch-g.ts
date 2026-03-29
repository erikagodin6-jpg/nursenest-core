import type { LessonContent } from "./types";

export const clinicalConditionsBatchGLessons: Record<string, LessonContent> = {
  "conduct-disorder-rpn": {
    title: "Conduct Disorder",
    cellular: {
      title: "Neurobehavioral Pathophysiology",
      content: "Conduct disorder is a persistent pattern of aggressive and rule-violating behavior lasting more than 6 months during childhood or adolescence. Structural, functional, and chemical changes in the brain—including reduced prefrontal cortex activity and altered amygdala reactivity—impair impulse control, empathy, and consequence evaluation. Genetic predisposition combined with adverse childhood experiences drives the behavioral defiance that escalates from property destruction to harm against people or animals. The nurse monitors for safety concerns, implements structured behavioral expectations as directed, and reports escalation patterns to the care team."
    },
    riskFactors: [
      "Adverse childhood experiences (abuse, neglect, trauma)",
      "Genetic predisposition and family history of antisocial behavior",
      "Parental substance use or mental illness",
      "Inconsistent or harsh parenting styles",
      "Low socioeconomic status",
      "Peer rejection and association with deviant peer groups",
      "History of ADHD or learning disabilities",
      "Prenatal exposure to substances"
    ],
    diagnostics: [
      "Monitor and document behavioral patterns as directed",
      "Report episodes of aggression, property destruction, or rule violations",
      "Observe for signs of substance use",
      "Screen for suicidal or homicidal ideation as directed and report findings",
      "Document frequency, duration, and severity of behavioral outbursts",
      "Report changes in social interactions or withdrawal patterns"
    ],
    management: [
      "Maintain a structured, predictable routine as directed",
      "Set firm limits and consistent boundaries as part of the care plan",
      "Implement positive reinforcement for appropriate behavior as directed",
      "Redirect inappropriate behavior using approved techniques",
      "Ensure environmental safety: remove potential weapons or harmful objects",
      "Assist with supervised activities as delegated"
    ],
    nursingActions: [
      "Promote physical safety of the patient and others at all times",
      "Check for substance use and report findings to the RN",
      "Screen for suicidal or homicidal ideation and report immediately",
      "Maintain firm limits, boundaries, structure, and clear expectations",
      "Implement structured daily routines consistently",
      "Establish and reinforce behavioral goals with positive reinforcement",
      "Report escalating aggression or new behavioral patterns to the RN",
      "Document all behavioral interventions and patient responses"
    ],
    signs: {
      left: [
        "Behavioral defiance and rule-breaking",
        "Theft, shoplifting, or property destruction",
        "Low self-esteem and easy frustration",
        "Lack of empathy or remorse"
      ],
      right: [
        "Aggression toward people or animals",
        "Bullying, fighting, or use of weapons",
        "Anger outbursts and escalating violence",
        "Social isolation and difficulty bonding"
      ]
    },
    medications: [
      { name: "Risperidone", type: "Atypical antipsychotic", action: "Blocks dopamine D2 and serotonin 5-HT2A receptors to reduce aggression and irritability", sideEffects: "Weight gain, metabolic syndrome, sedation, EPS", contra: "Hypersensitivity, dementia-related psychosis in elderly", pearl: "FDA-approved for irritability in autism; used off-label for conduct disorder aggression. Monitor weight and metabolic panels. Administer as ordered." }
    ],
    pearls: [
      "Without treatment, conduct disorder may progress to antisocial personality disorder in adulthood",
      "Positive reinforcement is more effective than punishment for behavior modification",
      "Always assess for comorbid substance use, ADHD, and mood disorders"
    ],
    quiz: [
      { question: "Which nursing intervention is most appropriate for a child with conduct disorder who is displaying aggressive behavior?", options: ["Allow the child to self-regulate without limits", "Set firm limits and redirect the behavior", "Isolate the child in a dark room", "Ignore the behavior entirely"], correct: 1, rationale: "Setting firm limits and redirecting behavior provides structure and safety. Ignoring aggressive behavior can escalate the situation, and isolation without therapeutic purpose is inappropriate." },
      { question: "What complication should the nurse monitor for in an adolescent with untreated conduct disorder?", options: ["Hypothyroidism", "Substance use and juvenile delinquency", "Diabetes insipidus", "Pernicious anemia"], correct: 1, rationale: "Untreated conduct disorder is associated with substance use, juvenile delinquency, school expulsion, and eventual antisocial personality disorder." },
      { question: "Which approach is most effective for behavior modification in conduct disorder?", options: ["Corporal punishment", "Positive reinforcement for desired behaviors", "Strict medication-only regimen", "Unrestricted freedom to build trust"], correct: 1, rationale: "Positive reinforcement strengthens desired behaviors and helps the child develop self-esteem. Punishment-based approaches tend to reinforce aggression patterns." }
    ]
  },

  "conduct-disorder-rn": {
    title: "Conduct Disorder",
    cellular: {
      title: "Neurobiological Basis of Conduct Disorder",
      content: "Conduct disorder involves structural and functional brain alterations including reduced gray matter volume in the prefrontal cortex and amygdala, decreased serotonin activity, and elevated cortisol reactivity. These neurobiological changes impair executive function, emotional regulation, and moral reasoning. Adverse childhood experiences create epigenetic modifications that further dysregulate the hypothalamic-pituitary-adrenal (HPA) axis, maintaining a chronic state of fight-or-flight that manifests as aggression and defiance. The nurse performs comprehensive behavioral assessments, implements evidence-based behavioral interventions, coordinates multidisciplinary care, and evaluates treatment effectiveness."
    },
    riskFactors: [
      "Childhood maltreatment, abuse, or neglect",
      "Genetic factors including family history of conduct disorder or antisocial personality disorder",
      "Prenatal substance exposure (alcohol, drugs)",
      "Parental psychopathology or incarceration",
      "Low socioeconomic status and community violence exposure",
      "Comorbid ADHD, depression, or anxiety disorders",
      "Traumatic brain injury",
      "Early onset behavioral problems before age 10 (worse prognosis)"
    ],
    diagnostics: [
      "Perform comprehensive behavioral and psychosocial assessment",
      "Administer standardized behavioral rating scales (CBCL, Conners)",
      "Assess for comorbid conditions: ADHD, depression, anxiety, PTSD",
      "Screen for substance use with validated adolescent screening tools",
      "Evaluate cognitive functioning and academic performance",
      "Assess family dynamics, attachment patterns, and parenting styles",
      "Screen for suicidal and homicidal ideation using validated tools"
    ],
    management: [
      "Implement cognitive-behavioral therapy (CBT) interventions as part of treatment plan",
      "Coordinate social skills training groups",
      "Facilitate caregiver management technique training for families",
      "Develop individualized behavioral contract with specific goals and rewards",
      "Implement de-escalation protocols for aggressive episodes",
      "Coordinate with school, social services, and juvenile justice as needed",
      "Monitor medication effectiveness and side effects",
      "Evaluate treatment progress using behavioral outcome measures"
    ],
    nursingActions: [
      "Perform comprehensive safety assessment on admission and ongoing",
      "Develop therapeutic relationship using consistent, non-judgmental approach",
      "Implement evidence-based behavioral management strategies",
      "Administer medications as prescribed and monitor for therapeutic and adverse effects",
      "Coordinate multidisciplinary treatment planning conferences",
      "Educate family on behavioral management techniques and positive reinforcement",
      "Monitor for substance use and screen regularly",
      "Document behavioral patterns, interventions, and responses systematically"
    ],
    signs: {
      left: [
        "Persistent rule-breaking and defiance (>6 months)",
        "Theft, vandalism, or property destruction",
        "Truancy and academic failure",
        "Low frustration tolerance and irritability"
      ],
      right: [
        "Physical aggression toward peers, family, or animals",
        "Bullying, intimidation, or use of weapons",
        "Sexual coercion or forced sexual activity",
        "Lack of guilt, empathy, or remorse for actions"
      ]
    },
    medications: [
      { name: "Risperidone", type: "Atypical antipsychotic", action: "Antagonizes dopamine D2 and serotonin 5-HT2A receptors to reduce aggression and irritability", sideEffects: "Weight gain, metabolic syndrome, hyperprolactinemia, EPS, sedation", contra: "Hypersensitivity, dementia-related psychosis", pearl: "Monitor weight, fasting glucose, and lipid panels quarterly. Obtain baseline prolactin. Most evidence-supported medication for pediatric aggression." },
      { name: "Methylphenidate", type: "CNS stimulant", action: "Increases dopamine and norepinephrine in the prefrontal cortex to improve attention and impulse control", sideEffects: "Appetite suppression, insomnia, growth suppression, tachycardia", contra: "Glaucoma, concurrent MAOI use, marked anxiety", pearl: "Used when comorbid ADHD is present. Administer early in the day to minimize insomnia. Monitor height and weight regularly." },
      { name: "Lithium", type: "Mood stabilizer", action: "Modulates neurotransmitter release and intracellular signaling to reduce aggression and mood instability", sideEffects: "Tremor, polyuria, polydipsia, hypothyroidism, renal toxicity", contra: "Severe renal or cardiovascular disease, dehydration", pearl: "Therapeutic range is narrow (0.6-1.2 mEq/L). Monitor levels, renal function, and thyroid function regularly. Ensure adequate hydration and sodium intake." }
    ],
    pearls: [
      "Early-onset conduct disorder (before age 10) has a worse prognosis than adolescent-onset",
      "Callous-unemotional traits (limited empathy, lack of guilt) predict more severe trajectory",
      "Multimodal treatment combining CBT, family therapy, and pharmacotherapy has best outcomes",
      "Comorbid ADHD should be treated concurrently as untreated ADHD worsens behavioral outcomes",
      "Build therapeutic alliance gradually—trust is essential but takes time with this population"
    ],
    quiz: [
      { question: "Which assessment finding distinguishes conduct disorder from oppositional defiant disorder?", options: ["Argumentative behavior with adults", "Physical aggression and property destruction violating others' rights", "Temper tantrums lasting more than 10 minutes", "Refusal to follow household rules"], correct: 1, rationale: "Conduct disorder is distinguished by serious violations of others' rights including physical aggression, property destruction, theft, and rule violations beyond simple defiance." },
      { question: "What is the priority nursing assessment for an adolescent newly admitted with conduct disorder?", options: ["Academic performance evaluation", "Safety assessment including suicidal and homicidal ideation", "Family genogram completion", "Cognitive functioning screening"], correct: 1, rationale: "Safety is the priority. Adolescents with conduct disorder are at elevated risk for suicidal ideation, homicidal ideation, and substance use, requiring immediate assessment." },
      { question: "Which intervention is most effective for reducing aggressive behavior in conduct disorder?", options: ["Restrictive seclusion protocols", "Combined CBT and family-based behavioral management", "Medication-only treatment approach", "Peer confrontation therapy"], correct: 1, rationale: "Evidence supports multimodal treatment combining CBT for the adolescent with caregiver behavioral management training. Medication alone is insufficient, and confrontational approaches can worsen aggression." }
    ]
  },

  "conduct-disorder-np": {
    title: "Conduct Disorder",
    cellular: {
      title: "Neurobiology and Differential Diagnosis",
      content: "Conduct disorder involves complex neurobiological dysfunction across multiple brain circuits. Neuroimaging reveals reduced volume and activity in the ventromedial prefrontal cortex (impaired decision-making), orbitofrontal cortex (reduced consequence evaluation), and amygdala (blunted threat and empathy processing). Serotonergic hypofunction in the raphe nuclei lowers impulse control thresholds, while dysregulated dopaminergic reward pathways in the nucleus accumbens drive sensation-seeking behavior. Elevated testosterone and cortisol dysregulation via the HPA axis maintain chronic aggression. The clinician must differentiate conduct disorder from oppositional defiant disorder, ADHD, PTSD, bipolar disorder, and intermittent explosive disorder, then develop a comprehensive treatment plan including pharmacotherapy, evidence-based psychotherapy, and family-based interventions."
    },
    riskFactors: [
      "Genetic polymorphisms in MAOA gene (warrior gene) combined with maltreatment",
      "Prenatal alcohol or substance exposure affecting brain development",
      "Early childhood trauma and insecure attachment patterns",
      "Callous-unemotional trait phenotype (limited prosocial emotions specifier in DSM-5)",
      "Comorbid ADHD, substance use disorder, or mood disorders",
      "Low resting heart rate (autonomic underarousal)",
      "Perinatal complications and low birth weight",
      "Community violence exposure and gang involvement"
    ],
    diagnostics: [
      "Apply DSM-5 diagnostic criteria: persistent pattern (≥12 months) with at least 3 of 15 criteria across aggression, destruction, deceitfulness, and rule violations",
      "Specify onset type: childhood-onset (<10 years) vs. adolescent-onset; specify limited prosocial emotions",
      "Differentiate from ODD (no rights violations), ADHD (inattention-driven), PTSD (trauma-driven aggression), and bipolar disorder (episodic mood changes)",
      "Order comprehensive metabolic panel, thyroid function, and drug screen to rule out medical causes",
      "Administer standardized instruments: CBCL, SDQ, ICU (Inventory of Callous-Unemotional Traits)",
      "Obtain neuropsychological testing if cognitive or learning deficits suspected",
      "Assess for comorbid substance use, depression, anxiety, and learning disabilities"
    ],
    management: [
      "Prescribe risperidone (0.25-0.5 mg/day initial, titrate to 0.5-1.5 mg/day) for severe aggression unresponsive to behavioral interventions alone",
      "Consider lithium (target level 0.6-1.0 mEq/L) for persistent aggression and mood instability",
      "Prescribe stimulant medication (methylphenidate or amphetamine salts) for comorbid ADHD",
      "Order and monitor comprehensive metabolic panel, fasting lipids, prolactin with antipsychotic use",
      "Refer for evidence-based psychotherapy: MST (Multisystemic Therapy) or FFT (Functional Family Therapy)",
      "Coordinate Parent Management Training (PMT) as first-line psychosocial intervention",
      "Develop crisis safety plan with family including de-escalation strategies",
      "Implement structured academic and vocational support coordination"
    ],
    nursingActions: [
      "Conduct comprehensive psychiatric evaluation including developmental history and family assessment",
      "Formulate differential diagnosis and develop multimodal treatment plan",
      "Prescribe and titrate psychotropic medications with appropriate monitoring protocols",
      "Order and interpret laboratory monitoring: metabolic panels, drug levels, prolactin",
      "Coordinate referrals for evidence-based psychotherapy (MST, CBT, FFT)",
      "Evaluate treatment response using standardized outcome measures at regular intervals",
      "Manage comorbid conditions (ADHD, depression, substance use) concurrently",
      "Provide psychoeducation to family regarding disorder prognosis, treatment expectations, and relapse prevention"
    ],
    signs: {
      left: [
        "Persistent rule violations across settings (home, school, community)",
        "Deceitfulness, lying, and manipulation",
        "Callous-unemotional traits (limited guilt, empathy, concern for performance)",
        "Flat affect when confronted with consequences of behavior"
      ],
      right: [
        "Physical cruelty to people or animals",
        "Fire-setting or serious property destruction",
        "Forced sexual activity or weapon use",
        "Running away, truancy, and staying out past curfew"
      ]
    },
    medications: [
      { name: "Risperidone", type: "Atypical antipsychotic", action: "D2 and 5-HT2A antagonism reduces aggression and irritability through modulation of mesolimbic dopamine pathways", sideEffects: "Weight gain (avg 2-3 kg in first 8 weeks), metabolic syndrome, hyperprolactinemia, EPS, sedation", contra: "Hypersensitivity, QTc prolongation, dementia-related psychosis", pearl: "Best evidence base for pediatric aggression. Start 0.25 mg/day and titrate slowly. Monitor metabolic parameters every 3 months. Switch to aripiprazole if significant weight gain or prolactin elevation occurs." },
      { name: "Lithium Carbonate", type: "Mood stabilizer", action: "Modulates inositol phosphate signaling and glycogen synthase kinase-3 to stabilize mood and reduce impulsive aggression", sideEffects: "Tremor, polyuria, polydipsia, hypothyroidism, renal impairment, weight gain", contra: "Severe renal disease, significant cardiovascular disease, severe dehydration, sodium-depleting conditions", pearl: "Demonstrated anti-aggressive properties independent of mood stabilization. Therapeutic range 0.6-1.0 mEq/L for aggression. Monitor levels, renal function, and thyroid every 3-6 months. Ensure adequate hydration." },
      { name: "Valproic Acid", type: "Anticonvulsant/mood stabilizer", action: "Enhances GABA transmission and modulates voltage-gated sodium channels to reduce impulsivity and aggression", sideEffects: "Hepatotoxicity, pancreatitis, thrombocytopenia, weight gain, teratogenicity", contra: "Hepatic disease, pregnancy, urea cycle disorders, mitochondrial disorders", pearl: "Alternative to lithium for aggression. Obtain baseline and periodic CBC, LFTs, and drug levels. Contraindicated in females of childbearing potential unless adequate contraception is ensured." },
      { name: "Guanfacine Extended-Release", type: "Alpha-2 adrenergic agonist", action: "Stimulates alpha-2A receptors in the prefrontal cortex to improve impulse control and reduce hyperarousal", sideEffects: "Sedation, hypotension, bradycardia, dry mouth", contra: "Hypersensitivity, concurrent CYP3A4 inhibitor use", pearl: "Useful adjunct for comorbid ADHD with prominent hyperactivity-impulsivity. Non-stimulant option. Do not discontinue abruptly—rebound hypertension risk. May help reduce emotional dysregulation." }
    ],
    pearls: [
      "DSM-5 limited prosocial emotions specifier (callous-unemotional traits) predicts poorer treatment response and higher risk of adult psychopathy",
      "Multisystemic Therapy (MST) has the strongest evidence base for reducing criminal recidivism in youth with conduct disorder",
      "Pharmacotherapy should always accompany psychosocial interventions—medication alone is insufficient",
      "Low resting heart rate is a consistent biological correlate of conduct disorder and antisocial behavior",
      "Risk of progression to antisocial personality disorder is approximately 40% for childhood-onset conduct disorder"
    ],
    quiz: [
      { question: "Which DSM-5 specifier for conduct disorder predicts the worst long-term prognosis?", options: ["Adolescent-onset type", "Limited prosocial emotions (callous-unemotional traits)", "Unspecified onset", "Mild severity"], correct: 1, rationale: "The limited prosocial emotions specifier identifies youth with callous-unemotional traits who show more severe, treatment-resistant aggression and higher risk of adult antisocial personality disorder." },
      { question: "An NP is prescribing risperidone for aggression in an adolescent with conduct disorder. Which monitoring is essential?", options: ["Monthly hemoglobin A1c only", "Quarterly fasting glucose, lipids, and prolactin levels", "Annual thyroid function only", "Biweekly complete blood count"], correct: 1, rationale: "Risperidone carries risks of metabolic syndrome and hyperprolactinemia. Quarterly monitoring of fasting glucose, lipid panel, and prolactin is essential to detect adverse metabolic effects early." },
      { question: "Which evidence-based psychotherapy has the strongest research support for conduct disorder?", options: ["Psychoanalytic therapy", "Multisystemic Therapy (MST)", "Electroconvulsive therapy", "Art therapy alone"], correct: 1, rationale: "MST is the most rigorously studied psychotherapy for conduct disorder, addressing multiple systems (family, school, peers, community) and demonstrating reduced recidivism and out-of-home placements." }
    ]
  },

  "alcohol-withdrawal-rpn": {
    title: "Alcohol Withdrawal",
    cellular: {
      title: "CNS Excitotoxicity in Alcohol Withdrawal",
      content: "Alcohol is a central nervous system (CNS) depressant that enhances inhibitory GABA activity and suppresses excitatory glutamate (NMDA) signaling. Chronic alcohol use causes neuroadaptive upregulation of NMDA receptors and downregulation of GABA receptors. When alcohol is abruptly discontinued, unopposed excitatory neurotransmission produces autonomic hyperactivity—tachycardia, hypertension, diaphoresis, tremors—progressing to seizures and potentially fatal delirium tremens. Symptoms begin 6-24 hours after the last drink. The nurse monitors vital signs, observes for escalating symptoms, administers medications as ordered, and reports changes immediately."
    },
    riskFactors: [
      "Chronic heavy alcohol use",
      "Previous history of alcohol withdrawal seizures or delirium tremens",
      "Concurrent medical illness or infection",
      "Older age",
      "Co-occurring substance use",
      "Nutritional deficiencies (thiamine, folate, magnesium)",
      "Hepatic dysfunction",
      "Prior episodes of withdrawal (kindling effect increases severity)"
    ],
    diagnostics: [
      "Monitor vital signs frequently as ordered: heart rate, blood pressure, temperature",
      "Report tachycardia (HR >100), hypertension, or fever to the RN",
      "Observe and document tremor severity, diaphoresis, and agitation",
      "Report any hallucinations (visual, auditory, or tactile) to the nurse immediately",
      "Monitor hydration status: intake and output as directed",
      "Report seizure activity immediately with onset time and duration"
    ],
    management: [
      "Administer benzodiazepines as ordered (lorazepam, diazepam, chlordiazepoxide)",
      "Administer thiamine and folic acid supplements as ordered",
      "Maintain IV fluid therapy as ordered (normal saline)",
      "Maintain a calm, quiet environment with minimal lighting and stimulation",
      "Implement seizure precautions as directed",
      "Administer electrolyte replacements as ordered (magnesium, potassium, phosphorus)"
    ],
    nursingActions: [
      "Monitor vital signs per ordered frequency and report abnormalities",
      "Assess and document level of consciousness and orientation",
      "Observe for tremors, diaphoresis, agitation, and hallucinations",
      "Report any seizure activity immediately with description and duration",
      "Maintain patient safety: fall precautions, bed in low position, side rails padded",
      "Administer medications as ordered and monitor response",
      "Monitor and maintain fluid intake as directed",
      "Document all findings and report worsening symptoms to the RN"
    ],
    signs: {
      left: [
        "Mild tremors and anxiety",
        "Diaphoresis and restlessness",
        "Nausea and vomiting",
        "Headache and irritability"
      ],
      right: [
        "Severe hypertension and tachycardia",
        "Visual or tactile hallucinations",
        "Seizure activity",
        "Delirium tremens: fever, altered mental status, severe agitation"
      ]
    },
    medications: [
      { name: "Lorazepam", type: "Benzodiazepine", action: "Enhances GABA-A receptor activity to reduce CNS excitability and prevent withdrawal seizures", sideEffects: "Sedation, respiratory depression, hypotension, paradoxical agitation", contra: "Severe respiratory depression, acute narrow-angle glaucoma", pearl: "Preferred in hepatic impairment because it has no active metabolites. Administer as ordered based on CIWA score. Monitor respiratory rate and sedation level." },
      { name: "Thiamine (Vitamin B1)", type: "Vitamin supplement", action: "Essential cofactor for glucose metabolism in neurons; prevents Wernicke encephalopathy", sideEffects: "Rare allergic reaction with IV administration", contra: "Known hypersensitivity", pearl: "Always administer thiamine BEFORE glucose to prevent precipitating Wernicke encephalopathy. Give IV or IM in acute withdrawal." }
    ],
    pearls: [
      "Delirium tremens is a medical emergency with a mortality rate of 5-15% without treatment",
      "Symptoms of alcohol withdrawal begin 6-24 hours after the last drink and peak at 24-48 hours",
      "Always administer thiamine before dextrose-containing IV fluids to prevent Wernicke encephalopathy",
      "The kindling effect means each successive withdrawal episode tends to be more severe"
    ],
    quiz: [
      { question: "A patient in alcohol withdrawal develops a temperature of 39.5°C, severe confusion, and profuse diaphoresis. What should the nurse do first?", options: ["Administer acetaminophen as needed", "Report to the nurse immediately—these are signs of delirium tremens", "Apply cooling blankets and reassess in 30 minutes", "Document and continue routine monitoring"], correct: 1, rationale: "Fever, severe confusion, and profuse diaphoresis are hallmarks of delirium tremens, a life-threatening complication requiring immediate medical intervention." },
      { question: "When should thiamine be administered in relation to glucose-containing IV fluids?", options: ["After glucose administration", "Simultaneously with glucose", "Before glucose administration", "Thiamine timing does not matter"], correct: 2, rationale: "Thiamine must be given before glucose to prevent precipitating or worsening Wernicke encephalopathy, as glucose metabolism depletes remaining thiamine stores." },
      { question: "Which assessment tool is used to evaluate the severity of alcohol withdrawal?", options: ["Glasgow Coma Scale", "CIWA-Ar (Clinical Institute Withdrawal Assessment for Alcohol)", "Braden Scale", "Norton Scale"], correct: 1, rationale: "The CIWA-Ar is a standardized assessment tool that scores withdrawal severity across 10 domains including tremor, anxiety, agitation, and orientation to guide treatment intensity." }
    ]
  },

  "alcohol-withdrawal-rn": {
    title: "Alcohol Withdrawal",
    cellular: {
      title: "Neuroadaptive Mechanisms of Alcohol",
      content: "Chronic alcohol exposure produces neuroadaptive changes: GABA-A receptors are downregulated and internalized, reducing inhibitory neurotransmission, while NMDA glutamate receptors are upregulated to compensate for chronic suppression. Upon alcohol cessation, this imbalance creates a hyperexcitable state. The withdrawal cascade progresses through predictable stages: minor withdrawal (6-24 hours), alcoholic hallucinosis (12-48 hours), withdrawal seizures (24-48 hours), and delirium tremens (48-96 hours). The kindling hypothesis explains progressive worsening with repeated withdrawal episodes. The nurse performs CIWA-Ar scoring, implements symptom-triggered benzodiazepine protocols, manages fluid and electrolyte replacement, coordinates seizure management, and recognizes delirium tremens requiring ICU-level care."
    },
    riskFactors: [
      "History of prior alcohol withdrawal seizures or delirium tremens",
      "Duration and quantity of alcohol consumption (>10 years heavy use)",
      "Concurrent acute illness, infection, or surgery",
      "Elevated BAL at presentation",
      "Advanced age",
      "Comorbid hepatic disease or cirrhosis",
      "Concurrent benzodiazepine or sedative use",
      "Electrolyte abnormalities (hypomagnesemia, hypokalemia)"
    ],
    diagnostics: [
      "Administer CIWA-Ar assessment every 1-4 hours; score ≥8 indicates need for pharmacological treatment",
      "Obtain baseline and serial vital signs: HR, BP, temperature, RR, SpO2",
      "Order and interpret comprehensive metabolic panel: electrolytes, glucose, hepatic function, renal function",
      "Monitor magnesium, phosphorus, and potassium levels (commonly depleted)",
      "Obtain blood alcohol level (BAL) on admission",
      "Order CBC to evaluate for infection, anemia, and thrombocytopenia",
      "Monitor cardiac rhythm for arrhythmias associated with electrolyte imbalances"
    ],
    management: [
      "Implement symptom-triggered benzodiazepine protocol based on CIWA-Ar scores",
      "Administer lorazepam 1-2 mg IV/PO for CIWA ≥8; reassess every 1-2 hours",
      "Replace electrolytes: magnesium sulfate 1-2g IV, potassium chloride per protocol",
      "Administer thiamine 100-500 mg IV before any glucose-containing fluids",
      "Initiate IV normal saline for fluid resuscitation and electrolyte correction",
      "Implement seizure precautions: padded side rails, suction at bedside, O2 available",
      "Monitor cardiac rhythm continuously via telemetry",
      "Escalate care to ICU for CIWA ≥20 or signs of delirium tremens"
    ],
    nursingActions: [
      "Perform CIWA-Ar scoring at prescribed intervals and adjust medication administration accordingly",
      "Assess and document neurological status: orientation, tremor severity, diaphoresis, agitation",
      "Monitor for progression of withdrawal: minor symptoms → hallucinosis → seizures → DTs",
      "Administer benzodiazepines per protocol and evaluate therapeutic response",
      "Maintain accurate intake and output with IV fluid replacement",
      "Implement fall and seizure precautions with appropriate safety measures",
      "Provide frequent reorientation and maintain calm, low-stimulation environment",
      "Coordinate long-term recovery planning: naltrexone initiation, support groups, counseling referrals"
    ],
    signs: {
      left: [
        "Minor withdrawal: tremor, anxiety, insomnia, diaphoresis (6-24 hrs)",
        "Alcoholic hallucinosis: visual/auditory/tactile hallucinations with clear sensorium (12-48 hrs)",
        "Tachycardia and hypertension",
        "Nausea, vomiting, and anorexia"
      ],
      right: [
        "Withdrawal seizures: generalized tonic-clonic (24-48 hrs)",
        "Delirium tremens: severe agitation, global confusion, fever >38.3°C (48-96 hrs)",
        "Profound autonomic instability: severe HTN, tachycardia >120, diaphoresis",
        "Cardiovascular collapse and death if untreated"
      ]
    },
    medications: [
      { name: "Lorazepam (Ativan)", type: "Benzodiazepine", action: "Enhances GABA-A receptor activity to counteract excitatory neurotransmission and prevent seizures", sideEffects: "Respiratory depression, oversedation, hypotension, paradoxical agitation", contra: "Severe respiratory failure, myasthenia gravis", pearl: "Preferred for hepatic impairment (no hepatic metabolism to active metabolites). CIWA-triggered dosing reduces total benzodiazepine requirements vs. fixed-schedule dosing." },
      { name: "Chlordiazepoxide (Librium)", type: "Long-acting benzodiazepine", action: "Provides sustained GABA enhancement with self-tapering pharmacokinetics due to long half-life", sideEffects: "Excessive sedation, ataxia, confusion, respiratory depression", contra: "Severe hepatic impairment, acute narrow-angle glaucoma", pearl: "Preferred for mild-moderate withdrawal in patients without hepatic disease. Long half-life provides built-in taper. Not appropriate for severe withdrawal requiring IV access." },
      { name: "Magnesium Sulfate", type: "Electrolyte replacement", action: "Replaces depleted magnesium stores, stabilizes cardiac membranes, and raises seizure threshold", sideEffects: "Flushing, hypotension, respiratory depression at high levels, loss of deep tendon reflexes", contra: "Severe renal failure, heart block", pearl: "Hypomagnesemia is nearly universal in chronic alcoholism and contributes to seizure risk and refractory hypokalemia. Replace magnesium before attempting potassium correction." },
      { name: "Folic Acid", type: "Vitamin supplement", action: "Replaces folate depleted by chronic alcohol use; supports DNA synthesis and red blood cell production", sideEffects: "Generally well-tolerated", contra: "None significant", pearl: "Chronic alcoholism causes folate deficiency leading to megaloblastic anemia. Administer 1 mg daily along with thiamine and multivitamin." }
    ],
    pearls: [
      "CIWA-Ar score ≥8 triggers medication; ≥20 indicates severe withdrawal requiring ICU consideration",
      "Symptom-triggered benzodiazepine dosing (CIWA-based) is superior to fixed-schedule dosing: shorter treatment duration and less total medication",
      "Hypomagnesemia must be corrected before hypokalemia can be effectively treated",
      "Delirium tremens has a 5-15% mortality rate without treatment but <1% with proper benzodiazepine therapy",
      "Long-term recovery medications include naltrexone (reduces craving), acamprosate (reduces glutamate excitotoxicity), and disulfiram (aversion therapy)"
    ],
    quiz: [
      { question: "A patient's CIWA-Ar score is 22. What is the priority nursing action?", options: ["Continue monitoring every 4 hours", "Administer benzodiazepine per protocol and notify the provider for possible ICU transfer", "Offer oral fluids and reassess in 1 hour", "Administer acetaminophen for comfort"], correct: 1, rationale: "A CIWA-Ar score of ≥20 indicates severe withdrawal with high risk for seizures and delirium tremens, requiring immediate benzodiazepine administration and consideration for ICU-level monitoring." },
      { question: "Which electrolyte imbalance must be corrected BEFORE potassium replacement can be effective in alcohol withdrawal?", options: ["Sodium", "Calcium", "Magnesium", "Chloride"], correct: 2, rationale: "Hypomagnesemia causes renal potassium wasting, making potassium replacement ineffective until magnesium is corrected. This is a critical principle in alcohol withdrawal management." },
      { question: "A patient in alcohol withdrawal states he sees spiders crawling on the walls but is oriented to person, place, and time. This most likely represents:", options: ["Delirium tremens", "Alcoholic hallucinosis", "Withdrawal seizure aura", "Korsakoff syndrome"], correct: 1, rationale: "Alcoholic hallucinosis features visual, auditory, or tactile hallucinations with preserved sensorium (orientation intact). In contrast, delirium tremens involves global confusion and disorientation." }
    ]
  },

  "alcohol-withdrawal-np": {
    title: "Alcohol Withdrawal",
    cellular: {
      title: "Neurochemistry and Pharmacological Management",
      content: "The neurochemistry of alcohol withdrawal involves dual neurotransmitter derangement. Chronic ethanol potentiates GABA-A receptor chloride conductance while inhibiting NMDA receptor calcium influx. Compensatory neuroadaptation reduces GABA-A receptor expression (particularly alpha-1 subunit) and upregulates NMDA receptor density (NR2B subunit) and voltage-gated calcium channels. Abrupt cessation unmasks massive excitatory drive with glutamate-mediated excitotoxicity causing neuronal death and seizures. The kindling hypothesis explains progressive worsening: each withdrawal episode sensitizes neurons to subsequent withdrawal through long-term potentiation-like mechanisms. The clinician must prescribe evidence-based pharmacological protocols, manage complex medical comorbidities, order and interpret diagnostic studies, and coordinate long-term alcohol use disorder treatment including medication-assisted treatment (MAT)."
    },
    riskFactors: [
      "History of multiple prior withdrawal episodes (kindling effect)",
      "Blood alcohol level >150 mg/dL at presentation",
      "Concurrent benzodiazepine or barbiturate dependence",
      "Comorbid hepatic cirrhosis or acute hepatitis",
      "Concurrent infection, pancreatitis, or trauma",
      "Prior delirium tremens or withdrawal seizures",
      "Advanced age with multiple medical comorbidities",
      "Prolonged heavy consumption (>8 standard drinks/day for >10 years)"
    ],
    diagnostics: [
      "Order comprehensive metabolic panel: assess hepatic function (AST:ALT ratio >2:1 suggests alcoholic liver disease), renal function, electrolytes",
      "Order magnesium, phosphorus, and ionized calcium levels",
      "Obtain blood alcohol level and urine drug screen on admission",
      "Order CBC: evaluate for macrocytic anemia (elevated MCV), thrombocytopenia, leukocytosis",
      "Order coagulation studies (PT/INR) to assess hepatic synthetic function",
      "Order lipase to rule out concurrent pancreatitis",
      "Obtain ECG to evaluate for QTc prolongation and arrhythmias",
      "Consider CT head if altered mental status out of proportion to withdrawal or focal neurological findings"
    ],
    management: [
      "Prescribe symptom-triggered benzodiazepine protocol: lorazepam 2-4 mg IV q1h for CIWA ≥10; use diazepam front-loading for severe cases",
      "Prescribe thiamine 500 mg IV TID for 3 days (Caine criteria), then 100 mg IV/IM daily",
      "Order IV normal saline at 125-250 mL/hr with electrolyte replacement protocols",
      "Prescribe magnesium sulfate 2g IV over 1 hour, then recheck and re-dose as needed",
      "Prescribe potassium chloride replacement per protocol (oral or IV based on level and tolerance)",
      "For refractory cases: prescribe phenobarbital 130-260 mg IV for benzodiazepine-resistant withdrawal",
      "Prescribe folate 1 mg daily and multivitamin for nutritional repletion",
      "Initiate medication-assisted treatment for long-term recovery: naltrexone 50 mg daily (after withdrawal resolves) or acamprosate 666 mg TID"
    ],
    nursingActions: [
      "Establish severity classification and prescribe appropriate withdrawal protocol (mild/moderate/severe)",
      "Prescribe and adjust benzodiazepine regimen based on CIWA-Ar scores and clinical response",
      "Order and interpret laboratory studies to guide electrolyte replacement and identify complications",
      "Manage concurrent medical conditions: hepatic disease, pancreatitis, GI bleeding, infections",
      "Evaluate for Wernicke encephalopathy (classic triad: encephalopathy, oculomotor dysfunction, gait ataxia)",
      "Determine ICU vs. step-down level of care based on withdrawal severity and comorbidities",
      "Prescribe long-term MAT and coordinate outpatient addiction services",
      "Address nutritional deficiencies and prescribe comprehensive vitamin replacement"
    ],
    signs: {
      left: [
        "Minor withdrawal (6-24 hrs): tremor, anxiety, insomnia, tachycardia, diaphoresis",
        "Alcoholic hallucinosis (12-48 hrs): hallucinations with intact sensorium",
        "Elevated liver enzymes with AST:ALT ratio >2:1",
        "Macrocytic anemia (MCV >100 fL) from folate deficiency"
      ],
      right: [
        "Withdrawal seizures (24-48 hrs): generalized tonic-clonic, usually brief and self-limited",
        "Delirium tremens (48-96 hrs): life-threatening delirium with autonomic storm",
        "Wernicke encephalopathy: confusion, ophthalmoplegia, ataxia (triad present in only 16% of cases)",
        "Cardiovascular collapse, hyperthermia, rhabdomyolysis in severe DTs"
      ]
    },
    medications: [
      { name: "Diazepam (Valium)", type: "Long-acting benzodiazepine", action: "GABA-A agonist with long half-life (20-100 hrs) providing self-tapering effect through active metabolites", sideEffects: "Respiratory depression, oversedation, hypotension, paradoxical agitation", contra: "Severe hepatic impairment (use lorazepam instead), myasthenia gravis, acute narrow-angle glaucoma", pearl: "Front-loading with diazepam 10-20 mg IV q1-2h until CIWA <10 provides rapid control with built-in pharmacological taper. Preferred in patients without hepatic impairment." },
      { name: "Phenobarbital", type: "Barbiturate", action: "Enhances GABA-A receptor activity at a different binding site than benzodiazepines; provides additional inhibitory neurotransmission", sideEffects: "Respiratory depression, hypotension, excessive sedation, laryngospasm", contra: "Severe hepatic or respiratory failure, porphyria", pearl: "Reserved for benzodiazepine-resistant withdrawal. Dose: 130-260 mg IV q15-30 min until symptoms controlled. Has additive respiratory depression risk with benzodiazepines—requires ICU monitoring." },
      { name: "Naltrexone", type: "Opioid antagonist", action: "Blocks mu-opioid receptors in the mesolimbic reward pathway, reducing alcohol craving and reward", sideEffects: "Nausea, headache, hepatotoxicity at high doses, injection site reactions (IM form)", contra: "Concurrent opioid use, acute hepatitis or hepatic failure, current opioid dependence", pearl: "Initiate after withdrawal resolves. Available as daily oral (50 mg) or monthly IM injection (380 mg/Vivitrol). Check LFTs before starting. Reduces heavy drinking days by 36% per COMBINE trial." },
      { name: "Acamprosate (Campral)", type: "Glutamate modulator", action: "Modulates NMDA glutamate receptors and restores balance between excitatory and inhibitory neurotransmission", sideEffects: "Diarrhea, nausea, headache", contra: "Severe renal impairment (CrCl <30 mL/min)", pearl: "Best for maintaining abstinence rather than reducing consumption. Dose: 666 mg TID. Does not require hepatic metabolism—safe in liver disease. Start after withdrawal resolves." }
    ],
    pearls: [
      "The classic Wernicke triad (encephalopathy, ophthalmoplegia, ataxia) is present in only 16% of cases—maintain low threshold for empiric thiamine",
      "High-dose IV thiamine (500 mg TID) is now recommended for suspected Wernicke encephalopathy (Caine criteria)",
      "Diazepam front-loading provides rapid control with built-in self-taper due to long-acting active metabolites",
      "Phenobarbital should be reserved for ICU patients with benzodiazepine-resistant withdrawal",
      "AST:ALT ratio >2:1 is characteristic of alcoholic liver disease and helps distinguish from other hepatic etiologies"
    ],
    quiz: [
      { question: "An NP is managing a patient with severe alcohol withdrawal unresponsive to lorazepam 8 mg IV over 4 hours. What is the most appropriate next step?", options: ["Increase lorazepam to 16 mg IV per hour", "Add phenobarbital 130-260 mg IV and transfer to ICU", "Discontinue benzodiazepines and start haloperidol", "Switch to oral chlordiazepoxide"], correct: 1, rationale: "Benzodiazepine-resistant withdrawal requires addition of phenobarbital, which acts at a different GABA-A binding site. This requires ICU-level monitoring due to additive respiratory depression risk. Haloperidol lowers seizure threshold and should not replace benzodiazepines." },
      { question: "Which medication-assisted treatment for alcohol use disorder is safest in a patient with cirrhosis?", options: ["Naltrexone", "Disulfiram", "Acamprosate", "Chlordiazepoxide"], correct: 2, rationale: "Acamprosate is renally eliminated and does not require hepatic metabolism, making it the safest MAT option in patients with hepatic disease. Naltrexone and disulfiram are hepatotoxic." },
      { question: "An NP suspects Wernicke encephalopathy in an alcoholic patient presenting with confusion and nystagmus. Which treatment should be initiated immediately?", options: ["D50W IV push", "Thiamine 500 mg IV TID for 3 days", "Phenytoin 1g IV loading dose", "Normal saline bolus only"], correct: 1, rationale: "High-dose IV thiamine (500 mg TID for 3 days) is the recommended treatment for suspected Wernicke encephalopathy. Glucose administration before thiamine can precipitate or worsen the condition." }
    ]
  },

  "serotonin-syndrome-rpn": {
    title: "Serotonin Syndrome",
    cellular: {
      title: "Serotonergic Excess Pathophysiology",
      content: "Serotonin syndrome results from excess serotonergic activity in the central nervous system, typically caused by drug interactions or overdose of medications that increase serotonin levels. Excessive activation of 5-HT1A and 5-HT2A receptors in the brainstem and spinal cord produces a characteristic triad: altered mental status, autonomic instability, and neuromuscular excitability. The condition does not occur naturally—it is always drug-induced. Onset is rapid, typically within 2-72 hours of a causative medication change. The nurse monitors for the characteristic signs, maintains patient safety, and reports findings immediately."
    },
    riskFactors: [
      "Initiation or dose increase of serotonergic medications (SSRIs, SNRIs, MAOIs)",
      "Concurrent use of multiple serotonergic agents",
      "Use of tramadol, meperidine, or fentanyl with SSRIs/SNRIs",
      "Concurrent use of St. John's Wort with antidepressants",
      "Illicit drug use: MDMA (ecstasy), cocaine, amphetamines",
      "Drug-drug interactions with ondansetron and serotonergic antidepressants",
      "Recent MAOI use with inadequate washout period",
      "Herbal supplement interactions"
    ],
    diagnostics: [
      "Monitor vital signs frequently: temperature, heart rate, blood pressure",
      "Report fever, tachycardia, or hypertension to the nurse immediately",
      "Observe for clonus, tremor, and hyperreflexia and report",
      "Report mental status changes: agitation, restlessness, confusion",
      "Observe for diaphoresis and report",
      "Document pupil size (mydriasis) and report changes"
    ],
    management: [
      "Maintain patient safety: side rails up, fall precautions",
      "Administer IV fluids as ordered",
      "Administer medications as ordered (benzodiazepines for agitation)",
      "Maintain oxygen saturation monitoring as directed",
      "Implement continuous cardiac monitoring as ordered",
      "Assist with cooling measures as directed for hyperthermia"
    ],
    nursingActions: [
      "Assess for the triad: mental status changes, autonomic instability, neuromuscular excitability",
      "Report clonus (involuntary rhythmic muscle contractions) immediately",
      "Monitor temperature and report hyperthermia (>38.5°C) to the RN",
      "Monitor oxygen saturation and report levels below ordered parameters",
      "Maintain continuous cardiac monitoring and report arrhythmias",
      "Ensure all serotonergic medications are held as directed",
      "Document all symptoms, vital signs, and interventions",
      "Maintain IV access and administer fluids as ordered"
    ],
    signs: {
      left: [
        "Agitation and restlessness",
        "Confusion and disorientation",
        "Diaphoresis",
        "Mydriasis (dilated pupils)"
      ],
      right: [
        "Clonus (especially lower extremity)",
        "Hyperreflexia and muscle rigidity",
        "Hyperthermia (>38.5°C)",
        "Tachycardia and hypertension"
      ]
    },
    medications: [
      { name: "Lorazepam", type: "Benzodiazepine", action: "Reduces agitation and muscle rigidity through GABA enhancement", sideEffects: "Sedation, respiratory depression, hypotension", contra: "Severe respiratory insufficiency", pearl: "Used for symptomatic management of agitation and muscle rigidity. Administer as ordered. Monitor respiratory rate and sedation level closely." },
      { name: "Cyproheptadine", type: "Serotonin antagonist", action: "Blocks 5-HT1A and 5-HT2A receptors to directly counteract serotonin excess", sideEffects: "Sedation, dry mouth, urinary retention", contra: "Narrow-angle glaucoma, concurrent MAOI use", pearl: "Specific antidote for serotonin syndrome. Given orally or via NG tube. Initial dose typically 12 mg, then 2 mg every 2 hours until symptoms improve. Administer as ordered." }
    ],
    pearls: [
      "Serotonin syndrome is always drug-induced—it does not occur spontaneously",
      "Clonus (rhythmic involuntary muscle jerking) is a hallmark finding that distinguishes serotonin syndrome from neuroleptic malignant syndrome",
      "Onset is typically within 2-72 hours of a medication change",
      "Most cases resolve within 24-72 hours after discontinuing the causative agent"
    ],
    quiz: [
      { question: "Which finding is most characteristic of serotonin syndrome?", options: ["Lead-pipe rigidity", "Clonus with hyperreflexia", "Hypothermia", "Bradycardia"], correct: 1, rationale: "Clonus with hyperreflexia is the hallmark neuromuscular finding in serotonin syndrome. Lead-pipe rigidity is more characteristic of neuroleptic malignant syndrome. Serotonin syndrome causes hyperthermia and tachycardia, not hypothermia and bradycardia." },
      { question: "A patient taking sertraline and tramadol develops agitation, fever, and leg clonus. What should the nurse do first?", options: ["Administer the next scheduled dose of sertraline", "Report findings to the nurse immediately as possible serotonin syndrome", "Encourage oral fluids and reassess in 1 hour", "Apply ice packs to the patient's forehead"], correct: 1, rationale: "This presentation is classic for serotonin syndrome triggered by the combination of an SSRI and tramadol. The nurse must report immediately as this is a potentially life-threatening emergency." },
      { question: "Which drug combination increases the risk of serotonin syndrome?", options: ["ACE inhibitor and diuretic", "SSRI and St. John's Wort", "Beta-blocker and calcium channel blocker", "Proton pump inhibitor and antacid"], correct: 1, rationale: "St. John's Wort is a serotonin reuptake inhibitor. When combined with an SSRI, the additive serotonergic effect increases the risk of serotonin syndrome." }
    ]
  },

  "serotonin-syndrome-rn": {
    title: "Serotonin Syndrome",
    cellular: {
      title: "Serotonergic Receptor Pharmacology",
      content: "Serotonin syndrome occurs through three pharmacological mechanisms that increase synaptic serotonin: (1) increased serotonin synthesis (L-tryptophan), (2) decreased serotonin metabolism (MAOIs), and (3) increased serotonin release or decreased reuptake (SSRIs, SNRIs, TCAs, tramadol, meperidine, MDMA). Excessive 5-HT1A stimulation in the brainstem raphe nuclei and spinal cord produces the autonomic and neuromuscular features. 5-HT2A overstimulation contributes to hyperthermia, agitation, and altered mental status. The Hunter Serotonin Toxicity Criteria provide diagnostic accuracy: the presence of clonus (spontaneous, inducible, or ocular) in the setting of a serotonergic agent is highly specific. The nurse must recognize the syndrome promptly, discontinue all serotonergic agents, manage symptomatic treatment, and prevent life-threatening complications."
    },
    riskFactors: [
      "Concurrent use of two or more serotonergic agents",
      "MAOI combined with SSRI or SNRI (most dangerous combination)",
      "SSRI/SNRI with tramadol, meperidine, or fentanyl",
      "SSRI/SNRI initiation or dose escalation",
      "Transition between serotonergic medications without adequate washout",
      "Concurrent use of linezolid (weak MAOI) or methylene blue with serotonergic agents",
      "Recreational drug use: MDMA, cocaine, amphetamines, LSD",
      "St. John's Wort or tryptophan supplementation with antidepressants"
    ],
    diagnostics: [
      "Apply Hunter Serotonin Toxicity Criteria: serotonergic agent + clonus (spontaneous, inducible, or ocular) OR agitation + hyperreflexia + diaphoresis",
      "Obtain vital signs: temperature (hyperthermia >38.5°C), HR (tachycardia), BP (hypertension), RR",
      "Assess deep tendon reflexes and check for clonus (ankle, patellar)",
      "Assess mental status: agitation, confusion, delirium",
      "Obtain CK level to evaluate for rhabdomyolysis from sustained muscle hyperactivity",
      "Order comprehensive metabolic panel including renal function (rhabdomyolysis risk)",
      "Differentiate from neuroleptic malignant syndrome: NMS develops slowly (days vs. hours), has lead-pipe rigidity (not clonus), and has bradyreflexia"
    ],
    management: [
      "Immediately discontinue ALL serotonergic agents",
      "Administer benzodiazepines (lorazepam 1-2 mg IV) for agitation and muscle rigidity",
      "Administer cyproheptadine 12 mg loading dose PO/NG, then 2 mg q2h until symptoms resolve",
      "Initiate aggressive IV fluid resuscitation to prevent rhabdomyolysis and renal failure",
      "Implement active cooling measures for hyperthermia >41°C (cooling blankets, ice packs, evaporative cooling)",
      "Maintain continuous cardiac monitoring and pulse oximetry",
      "Prepare for intubation and paralysis with non-depolarizing agents if severe rigidity/hyperthermia",
      "Avoid antipyretics (acetaminophen is ineffective; hyperthermia is from muscle activity, not hypothalamic)"
    ],
    nursingActions: [
      "Perform rapid assessment using Hunter criteria upon suspicion",
      "Discontinue all serotonergic medications immediately and notify the provider",
      "Administer cyproheptadine as prescribed (specific serotonin antagonist)",
      "Monitor temperature continuously and implement cooling for hyperthermia >41°C",
      "Assess CK levels to monitor for rhabdomyolysis",
      "Maintain strict I&O with target urine output >0.5 mL/kg/hr to protect renal function",
      "Monitor for complications: seizures, DIC, arrhythmias, multi-organ failure",
      "Educate patient on drug interactions and safe medication practices upon discharge"
    ],
    signs: {
      left: [
        "Agitation, restlessness, and anxiety",
        "Confusion, disorientation, and delirium",
        "Diaphoresis and flushing",
        "Mydriasis (dilated pupils)",
        "Diarrhea and hyperactive bowel sounds"
      ],
      right: [
        "Spontaneous or inducible clonus (hallmark finding)",
        "Hyperreflexia and increased muscle tone",
        "Hyperthermia (>41°C in severe cases)",
        "Tachycardia (>120 bpm) and hypertension",
        "Ocular clonus (slow lateral eye movements)"
      ]
    },
    medications: [
      { name: "Cyproheptadine (Periactin)", type: "Serotonin antagonist (5-HT2A blocker)", action: "Competitively blocks serotonin receptors (5-HT1A, 5-HT2A) to directly counteract serotonin excess at the receptor level", sideEffects: "Sedation, dry mouth, urinary retention, appetite stimulation", contra: "Narrow-angle glaucoma, prostatic hypertrophy, concurrent MAOI use", pearl: "Only available in oral form—crush and administer via NG tube if patient cannot swallow. Loading dose 12 mg, then 2 mg every 2 hours (max 32 mg/day). Response usually seen within hours." },
      { name: "Lorazepam", type: "Benzodiazepine", action: "Enhances GABA inhibition to reduce muscle hyperactivity, agitation, and lower seizure threshold", sideEffects: "Respiratory depression, sedation, hypotension", contra: "Severe respiratory insufficiency", pearl: "First-line for agitation and muscle rigidity. Reducing muscle hyperactivity also helps control hyperthermia. Administer 1-2 mg IV; repeat as needed." },
      { name: "Dantrolene", type: "Direct muscle relaxant", action: "Blocks calcium release from sarcoplasmic reticulum to reduce muscle rigidity and heat generation", sideEffects: "Hepatotoxicity, muscle weakness, diarrhea", contra: "Active hepatic disease", pearl: "Reserved for severe cases with hyperthermia >41°C unresponsive to benzodiazepines and cooling. More commonly used in neuroleptic malignant syndrome and malignant hyperthermia." }
    ],
    pearls: [
      "The most dangerous drug combination is MAOI + SSRI/SNRI—requires 14-day washout (5 weeks for fluoxetine) when switching",
      "Clonus is the most reliable distinguishing feature between serotonin syndrome (clonus present) and neuroleptic malignant syndrome (lead-pipe rigidity, no clonus)",
      "Antipyretics (acetaminophen, NSAIDs) are ineffective in serotonin syndrome because hyperthermia is due to muscular hyperactivity, not hypothalamic dysfunction",
      "Linezolid and methylene blue are weak MAOIs—use with serotonergic agents can precipitate serotonin syndrome",
      "Most mild-moderate cases resolve within 24-72 hours after discontinuing the offending agent"
    ],
    quiz: [
      { question: "What is the most important distinguishing feature between serotonin syndrome and neuroleptic malignant syndrome?", options: ["Hyperthermia", "Altered mental status", "Clonus (present in serotonin syndrome) vs. lead-pipe rigidity (NMS)", "Tachycardia"], correct: 2, rationale: "Clonus with hyperreflexia is characteristic of serotonin syndrome, while NMS presents with lead-pipe rigidity and bradyreflexia. Both can cause hyperthermia, altered mental status, and tachycardia." },
      { question: "Why are antipyretics ineffective for treating hyperthermia in serotonin syndrome?", options: ["The fever is too high for antipyretics to work", "Hyperthermia is from muscular hyperactivity, not hypothalamic dysfunction", "Antipyretics interact with serotonergic drugs", "The liver cannot metabolize antipyretics during the syndrome"], correct: 1, rationale: "In serotonin syndrome, hyperthermia results from excessive muscle contraction generating heat, not from hypothalamic temperature set-point alteration. Antipyretics work on the hypothalamus and are therefore ineffective." },
      { question: "An RN suspects serotonin syndrome in a patient taking fluoxetine who was just prescribed linezolid. What is the priority action?", options: ["Administer the scheduled dose of fluoxetine", "Discontinue both serotonergic agents and notify the provider immediately", "Apply cooling blankets and continue current medications", "Order a STAT CT scan of the head"], correct: 1, rationale: "Linezolid is a weak MAOI. Combined with fluoxetine (SSRI), it can cause serotonin syndrome. Both agents must be immediately discontinued. Fluoxetine has a long half-life (5-week washout)." }
    ]
  },

  "serotonin-syndrome-np": {
    title: "Serotonin Syndrome",
    cellular: {
      title: "Serotonergic Pharmacology",
      content: "Serotonin syndrome arises from excessive stimulation of central and peripheral serotonin receptors, primarily 5-HT1A and 5-HT2A. Five pharmacological mechanisms can increase synaptic serotonin: (1) increased precursor supply (L-tryptophan), (2) increased serotonin release (MDMA, amphetamines), (3) inhibition of serotonin reuptake (SSRIs, SNRIs, TCAs, tramadol, meperidine), (4) inhibition of serotonin metabolism (MAOIs, linezolid, methylene blue), and (5) direct receptor agonism (buspirone, triptans, LSD). The Hunter Serotonin Toxicity Criteria (sensitivity 84%, specificity 97%) require exposure to a serotonergic agent plus one of: spontaneous clonus, inducible clonus + agitation or diaphoresis, ocular clonus + agitation or diaphoresis, tremor + hyperreflexia, or hypertonia + temperature >38°C + ocular or inducible clonus. The clinician must differentiate from neuroleptic malignant syndrome, malignant hyperthermia, anticholinergic toxicity, and sympathomimetic overdose, then prescribe definitive treatment."
    },
    riskFactors: [
      "MAOI + SSRI/SNRI combination (highest risk—potentially fatal)",
      "SSRI/SNRI + tramadol, meperidine, fentanyl, or methadone",
      "Transition between antidepressants without adequate washout period (14 days standard; 5 weeks for fluoxetine to MAOI)",
      "Linezolid or methylene blue co-prescribed with serotonergic agents",
      "SSRI/SNRI + triptans (lower risk but clinically relevant)",
      "SSRI/SNRI + dextromethorphan at high doses",
      "Recreational drug use: MDMA, cocaine, LSD with prescribed serotonergics",
      "Polypharmacy in elderly patients with multiple serotonergic medications"
    ],
    diagnostics: [
      "Apply Hunter Serotonin Toxicity Criteria systematically for definitive clinical diagnosis",
      "Differentiate from NMS: NMS has slow onset (days-weeks), lead-pipe rigidity, bradyreflexia, exposure to dopamine antagonists; SS has rapid onset (hours), clonus, hyperreflexia, exposure to serotonergic agents",
      "Differentiate from malignant hyperthermia: occurs during/after anesthesia with succinylcholine or volatile agents",
      "Order CK and myoglobin to assess for rhabdomyolysis",
      "Order comprehensive metabolic panel including BUN/creatinine (acute kidney injury from rhabdomyolysis)",
      "Order coagulation studies (PT/INR, fibrinogen) to evaluate for DIC",
      "Order blood gas to assess metabolic acidosis from muscle breakdown",
      "Order complete medication reconciliation including OTC supplements and recreational drugs"
    ],
    management: [
      "Prescribe immediate discontinuation of all serotonergic agents and identify the causative combination",
      "Prescribe cyproheptadine 12 mg PO/NG stat, then 2 mg every 2 hours (max 32 mg/day) until symptom resolution",
      "Prescribe lorazepam 1-2 mg IV q5-15 min PRN for agitation, muscle rigidity, and seizure prophylaxis",
      "Order aggressive IV fluid resuscitation with NS at 200-500 mL/hr to prevent acute kidney injury from rhabdomyolysis",
      "For severe hyperthermia >41°C: prescribe non-depolarizing neuromuscular blockade (rocuronium) and intubation",
      "Prescribe active cooling measures for temperature >40°C; avoid succinylcholine (risk of hyperkalemia with rhabdomyolysis)",
      "Avoid dantrolene unless concurrent neuroleptic malignant syndrome cannot be excluded",
      "Prescribe safe serotonergic medication re-introduction plan with appropriate washout periods after recovery"
    ],
    nursingActions: [
      "Perform comprehensive medication reconciliation to identify all serotonergic agents, including OTC and supplements",
      "Apply Hunter criteria for definitive diagnosis and determine severity classification",
      "Prescribe definitive pharmacological management including cyproheptadine and benzodiazepines",
      "Order and interpret CK, metabolic panel, coagulation studies to assess for rhabdomyolysis and DIC",
      "Determine ICU vs. floor-level monitoring based on severity and temperature",
      "Manage airway and ventilation decisions for severe cases with respiratory compromise",
      "Develop safe antidepressant re-introduction plan with appropriate washout periods",
      "Educate patient and family on dangerous drug combinations and importance of complete medication disclosure"
    ],
    signs: {
      left: [
        "Mild: agitation, anxiety, tremor, tachycardia, mydriasis, diaphoresis",
        "Moderate: inducible clonus, hyperreflexia, increased muscle tone, temperature up to 40°C",
        "Diarrhea and hyperactive bowel sounds (peripheral serotonin effects)",
        "Myoclonus (involuntary muscle jerking)"
      ],
      right: [
        "Severe: spontaneous clonus, sustained muscle rigidity, temperature >41°C",
        "Delirium, obtundation, or coma",
        "Rhabdomyolysis (CK >1000 IU/L) with dark urine (myoglobinuria)",
        "DIC, metabolic acidosis, multi-organ failure, cardiovascular collapse"
      ]
    },
    medications: [
      { name: "Cyproheptadine (Periactin)", type: "Non-selective serotonin antagonist", action: "Competitively antagonizes 5-HT1A and 5-HT2A receptors; also has antihistaminic and anticholinergic properties", sideEffects: "Sedation, dry mouth, urinary retention, increased appetite", contra: "Narrow-angle glaucoma, pyloric stenosis, concurrent MAOI", pearl: "Only specific antidote for serotonin syndrome. Only oral formulation exists—give via NG if patient cannot swallow. Response typically within 1-2 hours. Continue 8 mg q6h maintenance until serotonergic agents are eliminated." },
      { name: "Rocuronium", type: "Non-depolarizing neuromuscular blocker", action: "Blocks nicotinic acetylcholine receptors at the neuromuscular junction to eliminate muscle rigidity and heat generation", sideEffects: "Prolonged paralysis (requires mechanical ventilation), histamine release", contra: "Cannot secure airway, known hypersensitivity", pearl: "Used for severe cases with hyperthermia >41°C unresponsive to benzodiazepines. Eliminates muscular heat generation. Must have airway secured first. Avoid succinylcholine—risk of hyperkalemia from rhabdomyolysis." },
      { name: "Lorazepam", type: "Benzodiazepine", action: "GABA-A enhancement providing anxiolysis, muscle relaxation, and anticonvulsant effects", sideEffects: "Respiratory depression, oversedation, hypotension", contra: "Severe respiratory insufficiency", pearl: "First-line pharmacological treatment. Reduces muscle hyperactivity (reducing heat generation), controls agitation, and provides seizure prophylaxis. Titrate to clinical effect." },
      { name: "Chlorpromazine", type: "Phenothiazine with 5-HT2A antagonism", action: "Blocks serotonin 5-HT2A receptors and provides sedation through dopamine and histamine antagonism", sideEffects: "Hypotension, dystonia, QTc prolongation, lowers seizure threshold", contra: "Severe hypotension, concurrent CNS depression", pearl: "Alternative serotonin antagonist when cyproheptadine is unavailable or NG access is not feasible (available IV). Use with caution due to hypotension risk. Less commonly used than cyproheptadine." }
    ],
    pearls: [
      "The most critical washout period: 14 days from MAOI to SSRI/SNRI; 5 weeks from fluoxetine to MAOI (due to long active metabolite norfluoxetine)",
      "Succinylcholine is contraindicated in serotonin syndrome with suspected rhabdomyolysis due to hyperkalemia risk—use non-depolarizing agents only",
      "Hunter criteria have 84% sensitivity and 97% specificity—superior to the older Sternbach criteria",
      "Linezolid (antibiotic) and methylene blue (used in methemoglobinemia) are frequently missed as serotonergic agents that can precipitate the syndrome",
      "Most cases (70%) resolve within 24 hours of discontinuing the offending agent with supportive care alone"
    ],
    quiz: [
      { question: "An NP needs to switch a patient from fluoxetine to an MAOI. What is the required minimum washout period?", options: ["24 hours", "7 days", "14 days", "5 weeks"], correct: 3, rationale: "Fluoxetine has the longest half-life of any SSRI and its active metabolite norfluoxetine has a half-life of 4-16 days. A 5-week washout is required before starting an MAOI to prevent serotonin syndrome." },
      { question: "A patient with confirmed serotonin syndrome has a temperature of 41.5°C and sustained muscle rigidity despite benzodiazepines. What should the clinician prescribe?", options: ["Acetaminophen 1g IV stat", "Intubation with rocuronium and active cooling", "Dantrolene 2.5 mg/kg IV", "Haloperidol 5 mg IM for agitation"], correct: 1, rationale: "Severe serotonin syndrome with hyperthermia >41°C and sustained rigidity requires neuromuscular paralysis with a non-depolarizing agent (rocuronium), intubation, and active cooling to eliminate muscular heat generation." },
      { question: "Which non-antidepressant medication is most commonly overlooked as a serotonergic agent capable of causing serotonin syndrome?", options: ["Metoprolol", "Linezolid", "Omeprazole", "Lisinopril"], correct: 1, rationale: "Linezolid is an antibiotic with weak, reversible MAOI activity. When co-prescribed with SSRIs/SNRIs, it can precipitate serotonin syndrome. This interaction is frequently overlooked in clinical practice." }
    ]
  },

  "intimate-partner-violence-rpn": {
    title: "Intimate Partner Violence",
    cellular: {
      title: "Cycle of Violence and Trauma Pathophysiology",
      content: "Intimate partner violence (IPV) encompasses physical, sexual, psychological, and economic abuse by a current or former intimate partner. The cycle of violence typically follows a pattern: tension building, acute battering incident, and honeymoon/reconciliation phase. Chronic exposure to IPV activates the hypothalamic-pituitary-adrenal (HPA) axis, producing sustained cortisol elevation that causes hippocampal atrophy (impaired memory and decision-making), amygdala hyperactivation (heightened threat response), and prefrontal cortex hypofunction (impaired executive function). Victims develop complex trauma responses including learned helplessness, trauma bonding, and hypervigilance. The nurse screens for IPV indicators, provides empathetic non-judgmental care, ensures patient safety, documents findings, and reports to the nurse and appropriate authorities."
    },
    riskFactors: [
      "History of childhood abuse or witnessing domestic violence",
      "Substance use by either partner",
      "Low socioeconomic status and financial dependence",
      "Social isolation and lack of support network",
      "Pregnancy and postpartum period (increased risk)",
      "Young age and early marriage",
      "Controlling or jealous partner behavior",
      "Mental health disorders in either partner"
    ],
    diagnostics: [
      "Screen all patients using validated tools as directed (HITS, SAFE questions)",
      "Observe for injuries inconsistent with stated mechanism",
      "Report signs of physical abuse: bruising in unusual patterns, injuries at different healing stages",
      "Report signs of psychological abuse: withdrawal, fear, reluctance to speak around partner",
      "Document findings objectively using patient's own words in quotation marks",
      "Report signs of strangulation: petechiae above the clavicle, hoarse voice, difficulty swallowing"
    ],
    management: [
      "Interview patient privately without partner present",
      "Maintain a non-judgmental, empathetic approach",
      "Provide information about available resources as directed (hotlines, shelters)",
      "Ensure patient safety during the visit",
      "Follow mandatory reporting requirements as directed",
      "Document all findings with photographs if consent is obtained"
    ],
    nursingActions: [
      "Screen for IPV in a private setting away from the partner or accompanying persons",
      "Use direct but sensitive language: 'Do you feel safe at home?' 'Has anyone hurt or threatened you?'",
      "Observe and document injuries: type, location, size, color, pattern, healing stage",
      "Document patient statements using direct quotes",
      "Take photographs of injuries with patient consent and proper labeling",
      "Provide crisis hotline information and local shelter resources",
      "Report to the nurse and follow mandatory reporting protocols",
      "Ensure patient safety: do not include shelter or safety information in take-home materials that could be found by the abuser"
    ],
    signs: {
      left: [
        "Injuries inconsistent with reported mechanism",
        "Multiple injuries in various stages of healing",
        "Frequent emergency department visits",
        "Chronic pain without clear medical cause"
      ],
      right: [
        "Fearfulness, hypervigilance, and anxiety around partner",
        "Partner speaks for the patient or refuses to leave the room",
        "Depression, low self-esteem, and social withdrawal",
        "Delayed prenatal care or repeated pregnancy complications"
      ]
    },
    medications: [
      { name: "Sertraline", type: "SSRI antidepressant", action: "Increases synaptic serotonin to treat comorbid depression, anxiety, and PTSD symptoms associated with IPV", sideEffects: "Nausea, insomnia, sexual dysfunction, serotonin syndrome risk", contra: "Concurrent MAOI use, hypersensitivity", pearl: "First-line for PTSD and depression in IPV survivors. Administer as ordered. Monitor for suicidal ideation especially in the first weeks of treatment." }
    ],
    pearls: [
      "Always screen for IPV privately—never in the presence of the partner",
      "The most dangerous time for a victim is when they attempt to leave the relationship",
      "Strangulation is the strongest predictor of future homicide in IPV—assess for petechiae above the clavicle",
      "Do not provide shelter information in written materials that could be discovered by the abuser",
      "Pregnancy increases the risk of IPV and may trigger the first episode"
    ],
    quiz: [
      { question: "Which is the most important nursing action when screening for intimate partner violence?", options: ["Interview the patient with their partner present for verification", "Screen the patient privately in a secure setting", "Ask the partner directly if they have ever been violent", "Wait for the patient to voluntarily disclose abuse"], correct: 1, rationale: "Screening must occur privately without the partner present to ensure the patient feels safe to disclose. The partner's presence prevents honest disclosure and may increase danger." },
      { question: "A patient presents with facial bruising and states she 'walked into a door.' Her partner answers most questions. What should the nurse do?", options: ["Accept the explanation and document the injury", "Ask the partner to step out and privately screen the patient for IPV", "Confront the partner about possible abuse", "Discharge the patient without further questioning"], correct: 1, rationale: "The controlling partner behavior and injuries inconsistent with the stated mechanism are red flags for IPV. The nurse should separate the patient from the partner and screen privately." },
      { question: "Which finding is the strongest predictor of future homicide in an IPV situation?", options: ["Emotional verbal abuse", "Financial control", "History of strangulation", "Social media monitoring"], correct: 2, rationale: "Research consistently shows that strangulation is the single strongest predictor of future homicide in intimate partner violence situations. Assess for petechiae above the clavicle, hoarse voice, and difficulty swallowing." }
    ]
  },

  "intimate-partner-violence-rn": {
    title: "Intimate Partner Violence",
    cellular: {
      title: "Neurobiological Impact of Chronic Trauma",
      content: "Chronic intimate partner violence produces significant neurobiological changes through sustained HPA axis activation and repeated traumatic stress. Elevated cortisol causes hippocampal volume reduction (impaired memory consolidation and contextual processing), amygdala hypertrophy (heightened fear response and threat detection), and prefrontal cortex thinning (impaired decision-making and impulse control). These changes produce the complex trauma response seen in IPV survivors: hypervigilance, emotional dysregulation, dissociation, and learned helplessness. Trauma bonding (Stockholm syndrome-like attachment) develops through intermittent reinforcement of abuse and affection cycles. The nurse performs comprehensive assessments, implements evidence-based screening, provides trauma-informed care, develops safety plans, coordinates forensic documentation, manages mandatory reporting obligations, and addresses the physical and psychological health consequences of IPV."
    },
    riskFactors: [
      "Prior IPV victimization or childhood exposure to domestic violence",
      "Substance use disorder in either partner",
      "Low socioeconomic status, unemployment, and financial dependence on partner",
      "Social isolation and limited support network",
      "Pregnancy (risk increases 2-3x) and postpartum period",
      "Disability or chronic illness creating dependency",
      "Immigration status creating fear of deportation",
      "Recent separation or divorce attempt (highest lethality risk)"
    ],
    diagnostics: [
      "Administer validated IPV screening tools: HITS (Hurt, Insult, Threaten, Scream), SAFE questions, Danger Assessment Scale",
      "Perform comprehensive head-to-toe physical assessment documenting all injuries",
      "Assess for strangulation indicators: subconjunctival hemorrhage, petechiae above clavicle, hoarseness, dysphagia, neck bruising",
      "Screen for mental health consequences: PTSD (PCL-5), depression (PHQ-9), anxiety (GAD-7)",
      "Assess for substance use as a coping mechanism",
      "Evaluate functional status and ability to perform ADLs safely",
      "Assess lethality risk using validated Danger Assessment tool"
    ],
    management: [
      "Implement trauma-informed care principles: safety, trustworthiness, choice, collaboration, empowerment",
      "Develop individualized safety plan: escape route, packed bag, important documents, financial resources, safe contacts",
      "Provide comprehensive referral network: domestic violence hotline, shelters, legal aid, counseling",
      "Coordinate forensic nursing examination when indicated",
      "Perform forensic photography with proper documentation (body map, ruler for scale, patient ID in photos)",
      "Complete mandatory reporting according to jurisdictional requirements",
      "Manage acute injuries and chronic health conditions exacerbated by abuse",
      "Coordinate with social work for discharge planning and safety"
    ],
    nursingActions: [
      "Screen all patients privately using validated tools at every healthcare encounter",
      "Perform comprehensive physical assessment with detailed injury documentation",
      "Use trauma-informed interview techniques: open-ended questions, non-judgmental language, empowerment-focused",
      "Complete forensic documentation: body maps, injury descriptions (size, color, shape, location, healing stage), photographs with consent",
      "Develop safety plan collaboratively with the patient based on their specific situation",
      "Coordinate referrals: social work, advocacy services, legal aid, mental health counseling",
      "Fulfill mandatory reporting obligations while explaining the process to the patient",
      "Provide anticipatory guidance on the cycle of violence and trauma bonding"
    ],
    signs: {
      left: [
        "Injuries in various healing stages (old and new bruising)",
        "Defensive injuries: forearm bruising, hand injuries",
        "Injuries in central pattern (chest, abdomen, face, neck)",
        "Chronic somatic complaints: headaches, abdominal pain, pelvic pain"
      ],
      right: [
        "Strangulation signs: petechiae above clavicle, hoarseness, dysphagia",
        "Severe anxiety, PTSD symptoms, and dissociation",
        "Reproductive coercion: unplanned pregnancies, STIs",
        "Traumatic brain injury from repeated head trauma"
      ]
    },
    medications: [
      { name: "Sertraline", type: "SSRI antidepressant", action: "Increases synaptic serotonin to treat PTSD, depression, and anxiety commonly comorbid with IPV", sideEffects: "Nausea, sexual dysfunction, insomnia, weight changes", contra: "Concurrent MAOI use, hypersensitivity", pearl: "FDA-approved for PTSD. First-line pharmacotherapy for IPV-related trauma. Monitor for suicidal ideation especially in first 4 weeks. Combine with trauma-focused psychotherapy for best outcomes." },
      { name: "Prazosin", type: "Alpha-1 adrenergic blocker", action: "Reduces noradrenergic hyperarousal to treat PTSD-related nightmares and sleep disturbance", sideEffects: "First-dose syncope, orthostatic hypotension, dizziness, headache", contra: "Concurrent PDE5 inhibitor use, significant hypotension", pearl: "Start 1 mg at bedtime and titrate slowly. Reduces trauma-related nightmares by blocking norepinephrine-mediated reactivation of traumatic memories during sleep. Monitor for first-dose hypotension." },
      { name: "Hydroxyzine", type: "Antihistamine/anxiolytic", action: "H1 receptor antagonism provides anxiolysis and sedation without benzodiazepine dependence risk", sideEffects: "Sedation, dry mouth, urinary retention, QTc prolongation at high doses", contra: "Prolonged QTc, early pregnancy", pearl: "Non-addictive anxiolytic option for acute anxiety in IPV survivors. Preferable to benzodiazepines which carry dependence risk in trauma populations." }
    ],
    pearls: [
      "IPV screening should occur at every healthcare encounter—not just emergency visits—using validated tools",
      "The Danger Assessment Scale helps predict lethality risk: strangulation, access to weapons, escalation of violence, threats to kill are critical indicators",
      "Forensic documentation requires body maps, measurements, color descriptions, photographs with scale ruler, and patient consent",
      "Respect patient autonomy—provide resources and safety planning but do not pressure the patient to leave before they are ready",
      "Trauma bonding explains why patients return to abusers: intermittent reinforcement of abuse and affection creates powerful psychological attachment"
    ],
    quiz: [
      { question: "Which assessment tool specifically evaluates lethality risk in intimate partner violence?", options: ["PHQ-9", "Glasgow Coma Scale", "Danger Assessment Scale", "Braden Scale"], correct: 2, rationale: "The Danger Assessment Scale (Campbell) specifically evaluates risk factors for homicide in IPV situations including strangulation history, weapon access, escalation pattern, and threats." },
      { question: "An RN is documenting injuries on an IPV patient. Which documentation practice is most appropriate?", options: ["General description: 'multiple bruises noted'", "Detailed body map with measurements, color, shape, and photographs with scale ruler", "Notation: 'suspected abuse'", "Documentation of injuries without recording patient statements"], correct: 1, rationale: "Forensic documentation requires detailed descriptions on body maps with measurements, color staging, shape, photographs with a scale ruler, and the patient's own statements in direct quotes." },
      { question: "Why should the nurse avoid providing shelter brochures in take-home paperwork for an IPV patient?", options: ["Shelters do not accept referrals from nurses", "The abuser may discover the materials and escalate violence", "Patients should find shelters independently", "Shelter information is confidential"], correct: 1, rationale: "Providing shelter information in take-home materials risks the abuser discovering the patient's plans to leave, which is the most dangerous time in an IPV situation and could trigger escalated violence or homicide." }
    ]
  },

  "intimate-partner-violence-np": {
    title: "Intimate Partner Violence",
    cellular: {
      title: "Complex Trauma Neurobiology",
      content: "IPV-related complex trauma produces distinct neurobiological patterns identifiable on functional neuroimaging: persistent amygdala hyperactivation with threat-related stimuli, hippocampal atrophy (8-15% volume reduction in chronic PTSD), medial prefrontal cortex hypoactivation (impaired fear extinction), and anterior cingulate cortex dysfunction (impaired emotional regulation). Chronic sympathetic nervous system activation produces elevated norepinephrine levels, contributing to hypervigilance, exaggerated startle response, and insomnia. Repeated traumatic brain injury from physical assaults creates cumulative neurological damage similar to chronic traumatic encephalopathy (CTE). The clinician must conduct comprehensive trauma-informed assessments, prescribe pharmacotherapy for PTSD, depression, and anxiety, manage TBI-related sequelae, coordinate forensic examinations, fulfill complex medico-legal reporting obligations, order and interpret diagnostic studies, and develop comprehensive treatment plans addressing physical, psychological, and social determinants of health."
    },
    riskFactors: [
      "Prior IPV victimization with trauma bonding patterns",
      "Intersectional vulnerabilities: immigration status, disability, LGBTQ+ identity, language barriers",
      "Economic dependence and financial abuse",
      "Substance use disorder in either partner (particularly stimulants and alcohol)",
      "Partner's access to weapons (firearms increase homicide risk 5-12x)",
      "Recent separation or restraining order (highest lethality period)",
      "Pregnancy (IPV affects 3-9% of pregnancies; homicide is a leading cause of maternal mortality)",
      "History of strangulation (increases homicide risk 7x)",
      "Partner with prior criminal history or mental health disorders"
    ],
    diagnostics: [
      "Administer Danger Assessment Scale to quantify lethality risk and guide safety planning intensity",
      "Order CT head for suspected traumatic brain injury (repeated concussions from physical assault)",
      "Order cervical spine imaging if strangulation with neck pain is reported",
      "Order comprehensive labs: CBC, CMP, coagulation studies, pregnancy test, STI panel",
      "Screen for PTSD using PCL-5 (score ≥33 suggests PTSD), depression using PHQ-9, and anxiety using GAD-7",
      "Assess for substance use disorders using validated screening tools (AUDIT, DAST)",
      "Order neuropsychological testing if cognitive deficits are noted from repeated head trauma",
      "Perform comprehensive sexual assault examination with forensic evidence collection when indicated"
    ],
    management: [
      "Prescribe pharmacotherapy for PTSD: sertraline 25 mg daily, titrate to 100-200 mg (FDA-approved for PTSD)",
      "Prescribe prazosin 1 mg at bedtime, titrate to 2-15 mg for PTSD-related nightmares and hyperarousal",
      "Prescribe hydroxyzine 25-50 mg PRN for acute anxiety (avoid benzodiazepines in trauma populations)",
      "Refer for evidence-based trauma therapy: CPT (Cognitive Processing Therapy) or PE (Prolonged Exposure)",
      "Manage TBI sequelae: prescribe appropriate headache management, cognitive rehabilitation referral",
      "Order and interpret comprehensive STI screening including HIV prophylaxis if indicated",
      "Complete mandatory reporting per jurisdictional requirements with documentation of compliance",
      "Coordinate multidisciplinary care: social work, legal advocacy, housing assistance, childcare services"
    ],
    nursingActions: [
      "Conduct comprehensive trauma-informed assessment addressing physical, psychological, sexual, and financial abuse",
      "Apply Danger Assessment Scale and develop graduated safety plan based on lethality risk level",
      "Prescribe and manage pharmacotherapy for PTSD, depression, anxiety, and insomnia",
      "Order and interpret diagnostic imaging and laboratory studies for injury assessment and health screening",
      "Coordinate forensic examination and evidence collection with proper chain of custody",
      "Manage complex medico-legal obligations: mandatory reporting, court testimony preparation, medical record documentation",
      "Refer for trauma-specific psychotherapy: CPT, PE, EMDR (Eye Movement Desensitization and Reprocessing)",
      "Address social determinants of health: housing, financial resources, legal protection, childcare, transportation"
    ],
    signs: {
      left: [
        "Recurrent injuries with inconsistent explanations across multiple visits",
        "Central-pattern injuries: face, neck, chest, abdomen, inner arms",
        "Chronic pain syndromes: headaches, back pain, pelvic pain, fibromyalgia",
        "Reproductive health issues: repeated STIs, unintended pregnancies, chronic pelvic pain"
      ],
      right: [
        "Strangulation sequelae: subconjunctival hemorrhage, voice changes, dysphagia, carotid dissection risk",
        "Traumatic brain injury symptoms: cognitive deficits, memory impairment, personality changes",
        "Complex PTSD: emotional dysregulation, dissociation, identity disturbance, relational difficulties",
        "Suicidality (IPV survivors have 4-8x increased suicide risk)"
      ]
    },
    medications: [
      { name: "Sertraline", type: "SSRI", action: "Increases serotonergic transmission in limbic circuits to reduce PTSD re-experiencing, avoidance, and hyperarousal symptoms", sideEffects: "Nausea, sexual dysfunction, insomnia, activation syndrome in early treatment", contra: "Concurrent MAOI use (14-day washout), hypersensitivity", pearl: "FDA-approved for PTSD (along with paroxetine). Start 25 mg daily, titrate by 25-50 mg every 1-2 weeks to target 100-200 mg. Response typically requires 4-6 weeks at therapeutic dose." },
      { name: "Prazosin", type: "Alpha-1 adrenergic antagonist", action: "Blocks postsynaptic alpha-1 receptors in the CNS to reduce noradrenergic hyperarousal responsible for trauma-related nightmares and hypervigilance", sideEffects: "First-dose syncope, orthostatic hypotension, dizziness, nasal congestion", contra: "Concurrent PDE5 inhibitors, significant hypotension", pearl: "VA/DoD guidelines recommend for PTSD-related nightmares unresponsive to SSRIs. Start 1 mg at bedtime; titrate by 1 mg every 3-7 days to 2-15 mg. Check orthostatic vitals. Counsel patient to rise slowly." },
      { name: "Paroxetine", type: "SSRI", action: "Potent serotonin reuptake inhibition with mild norepinephrine reuptake inhibition and anticholinergic properties", sideEffects: "Weight gain, sexual dysfunction, sedation, significant discontinuation syndrome, teratogenic (Category D)", contra: "Pregnancy, concurrent MAOI or thioridazine use", pearl: "FDA-approved for PTSD. Has sedating properties beneficial for insomnia and anxiety. Most significant discontinuation syndrome of SSRIs—never stop abruptly. Avoid in pregnancy." },
      { name: "Topiramate", type: "Anticonvulsant", action: "Enhances GABA, blocks glutamate, and modulates sodium channels to reduce PTSD re-experiencing and nightmares", sideEffects: "Cognitive slowing (word-finding difficulty), paresthesias, weight loss, kidney stones, metabolic acidosis", contra: "Pregnancy (teratogenic), metabolic acidosis, nephrolithiasis", pearl: "Off-label adjunct for PTSD with comorbid alcohol use disorder (reduces cravings and PTSD symptoms simultaneously). Start 25 mg daily, titrate to 100-200 mg BID. Monitor bicarbonate levels." }
    ],
    pearls: [
      "Homicide is a leading cause of death for pregnant and postpartum women—screen for IPV at every prenatal visit",
      "Strangulation may cause delayed death from carotid dissection or cerebral edema hours to days after the event—order vascular imaging if strangulation is reported",
      "Avoid benzodiazepines in IPV/PTSD patients: high addiction potential in trauma populations and they impair trauma processing in psychotherapy",
      "Cognitive Processing Therapy (CPT) and Prolonged Exposure (PE) are the most evidence-based psychotherapies for PTSD—superior to non-specific counseling",
      "IPV survivors have 4-8x increased suicide risk—screen at every visit using Columbia Suicide Severity Rating Scale"
    ],
    quiz: [
      { question: "An NP evaluates a pregnant patient with suspected intimate partner violence. Which finding poses the most immediate safety concern?", options: ["History of verbal arguments with partner", "Partner monitors patient's phone and social media", "Patient reports being strangled until unconscious last week", "Patient reports occasional pushing during disagreements"], correct: 2, rationale: "Strangulation to unconsciousness indicates extreme lethality risk (7x increased homicide risk). In pregnancy, this represents immediate danger to both the patient and fetus. It also warrants vascular imaging to rule out carotid dissection." },
      { question: "Why should benzodiazepines be avoided for anxiety management in IPV survivors with PTSD?", options: ["They are not effective for anxiety", "High addiction potential in trauma populations and they impair trauma processing in therapy", "They cause excessive weight gain", "They are contraindicated with SSRIs"], correct: 1, rationale: "Benzodiazepines carry high addiction potential in trauma populations (self-medication risk) and impair fear extinction processes necessary for effective trauma-focused psychotherapy (CPT, PE, EMDR)." },
      { question: "Which pharmacotherapy combination is most appropriate for an IPV survivor with PTSD, persistent nightmares, and comorbid alcohol use?", options: ["Alprazolam + zolpidem", "Sertraline + prazosin + topiramate", "Paroxetine + oxycodone + gabapentin", "Fluoxetine + diazepam + trazodone"], correct: 1, rationale: "Sertraline (FDA-approved for PTSD) + prazosin (reduces trauma-related nightmares) + topiramate (addresses both PTSD symptoms and alcohol cravings) provides evidence-based management of all three conditions without addiction risk." }
    ]
  }
};
