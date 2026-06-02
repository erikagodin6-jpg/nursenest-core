import type { LessonContent } from "./types";

export const pharmacologyNpPrescribingLessons: Record<string, LessonContent> = {
  "pharm-np-prescribing-principles": {
    title: "Prescribing Principles",
    cellular: {
      title: "Pharmacokinetic",
      content:
        "Evidence-based prescribing requires NPs to integrate pharmacokinetic principles including absorption, distribution, metabolism, and excretion (ADME) with patient-specific factors such as age, organ function, and comorbidities. Renal dosing adjustments rely on creatinine clearance calculated via the Cockcroft-Gault equation: CrCl = [(140 - age) x weight in kg] / (72 x serum creatinine), multiplied by 0.85 for females, or estimated glomerular filtration rate (eGFR) derived from the CKD-EPI equation. Hepatic dosing considers the Child-Pugh classification (scores A through C based on bilirubin, albumin, INR, ascites, and encephalopathy) and cytochrome P450 enzyme activity, which can be altered by genetic polymorphisms, disease states, and concomitant medications. Pregnancy safety assessment has shifted from the former FDA letter categories (A, B, C, D, X) to the Pregnancy and Lactation Labeling Rule (PLLR), requiring clinicians to evaluate individual risk-benefit data rather than relying on simplified categories."
    },
    riskFactors: [
      "Extremes of age (neonates and elderly) with altered drug metabolism",
      "Renal impairment reducing drug clearance",
      "Hepatic dysfunction altering first-pass metabolism",
      "Pregnancy exposing fetus to teratogenic agents",
      "Polypharmacy increasing drug-drug interaction risk",
      "Genetic polymorphisms affecting CYP450 enzyme activity",
      "Malnutrition or hypoalbuminemia altering drug binding"
    ],
    diagnostics: [
      "Serum creatinine and BUN for renal function assessment",
      "Cockcroft-Gault equation for creatinine clearance calculation",
      "eGFR via CKD-EPI for staging chronic kidney disease",
      "Liver function tests (AST, ALT, bilirubin, albumin, INR) for Child-Pugh scoring",
      "Therapeutic drug monitoring (TDM) for narrow therapeutic index drugs",
      "Pregnancy testing before initiating known teratogens",
      "Pharmacogenomic testing for CYP2D6, CYP2C19 when clinically indicated"
    ],
    management: [
      "Start low, go slow in elderly patients to minimize adverse effects",
      "Calculate CrCl before prescribing renally cleared medications",
      "Adjust doses of metformin, gabapentin, DOACs, vancomycin, aminoglycosides, and lithium based on renal function",
      "Use Child-Pugh classification to guide hepatic dose adjustments",
      "Avoid or reduce doses of drugs heavily metabolized by CYP450 in liver disease",
      "Review pregnancy safety data using current PLLR labeling before prescribing to women of childbearing age",
      "Perform therapeutic drug monitoring for drugs with narrow therapeutic indices"
    ],
    signs: {
      left: [
        "Elevated serum creatinine indicating impaired renal clearance",
        "Prolonged drug half-life in hepatic impairment",
        "Subtherapeutic or supratherapeutic drug levels on TDM",
        "Signs of drug toxicity: nausea, confusion, tinnitus, or tremor"
      ],
      right: [
        "Known teratogens: ACE inhibitors, warfarin, isotretinoin, valproate, methotrexate, statins",
        "Safe in pregnancy: acetaminophen, penicillins, cephalosporins, insulin, labetalol, methyldopa",
        "Drugs requiring renal adjustment: metformin (hold if eGFR < 30), gabapentin, DOACs, vancomycin",
        "CYP450 substrates requiring hepatic dose reduction: opioids, benzodiazepines, warfarin"
      ]
    },
    medications: [
      {
        name: "Metformin",
        type: "Biguanide antihyperglycemic",
        action: "Decreases hepatic glucose production and increases insulin sensitivity in peripheral tissues",
        sideEffects: "GI upset (nausea, diarrhea), vitamin B12 deficiency with long-term use",
        contra: "eGFR < 30 mL/min (contraindicated), hold before iodinated contrast procedures",
        pearl: "Metformin does not cause hypoglycemia as monotherapy; lactic acidosis risk is rare but increases with renal impairment"
      },
      {
        name: "Gabapentin",
        type: "Anticonvulsant / neuropathic pain agent",
        action: "Binds alpha-2-delta subunit of voltage-gated calcium channels, reducing excitatory neurotransmitter release",
        sideEffects: "Sedation, dizziness, peripheral edema, ataxia",
        contra: "Requires dose reduction in renal impairment; avoid abrupt discontinuation",
        pearl: "Gabapentin dose must be adjusted when CrCl < 60 mL/min; maximum dose decreases proportionally with declining renal function"
      },
      {
        name: "Vancomycin",
        type: "Glycopeptide antibiotic",
        action: "Inhibits bacterial cell wall synthesis by binding D-Ala-D-Ala terminus of peptidoglycan precursors",
        sideEffects: "Nephrotoxicity, ototoxicity, Red Man syndrome (histamine-mediated with rapid infusion)",
        contra: "Requires trough monitoring and dose adjustment in renal impairment; infuse over at least 60 minutes",
        pearl: "Target AUC/MIC ratio of 400-600 is preferred over trough-only monitoring for MRSA infections; always adjust for renal function"
      },
      {
        name: "Rivaroxaban",
        type: "Direct oral anticoagulant (DOAC) - Factor Xa inhibitor",
        action: "Directly inhibits Factor Xa, preventing conversion of prothrombin to thrombin",
        sideEffects: "Bleeding, bruising, GI hemorrhage",
        contra: "Avoid in severe hepatic impairment (Child-Pugh C); dose adjustment required in renal impairment (CrCl 15-50 mL/min for certain indications)",
        pearl: "DOACs have fewer drug-food interactions than warfarin but require renal function monitoring at least annually and more frequently in CKD"
      },
      {
        name: "Lithium",
        type: "Mood stabilizer",
        action: "Modulates neurotransmitter release and intracellular signaling cascades including inositol phosphate pathway",
        sideEffects: "Tremor, polyuria, polydipsia, hypothyroidism, weight gain, nephrogenic diabetes insipidus",
        contra: "Narrow therapeutic index (0.6-1.2 mEq/L); requires dose reduction in renal impairment; dehydration and NSAIDs increase toxicity risk",
        pearl: "Lithium levels must be drawn 12 hours post-dose; thiazide diuretics and ACE inhibitors increase lithium levels by reducing renal excretion"
      }
    ],
    pearls: [
      "The Cockcroft-Gault equation uses actual body weight, age, sex, and serum creatinine to estimate CrCl and remains the standard for drug dosing despite limitations in obesity and elderly populations",
      "Child-Pugh Class C (score 10-15) indicates severe hepatic impairment; many medications are contraindicated or require significant dose reduction at this stage",
      "The FDA Pregnancy and Lactation Labeling Rule replaced letter categories in 2015; clinicians must now review specific subsections for human data, animal data, and pharmacokinetic considerations",
      "Therapeutic drug monitoring is essential for drugs with narrow therapeutic indices including vancomycin, lithium, aminoglycosides, digoxin, phenytoin, and theophylline",
      "Start low, go slow applies especially to elderly patients due to decreased renal and hepatic clearance, increased body fat altering volume of distribution, and reduced albumin affecting protein binding"
    ],
    quiz: [
      {
        question: "Which equation is most commonly used to calculate creatinine clearance for drug dosing adjustments?",
        options: [
          "CKD-EPI equation",
          "Cockcroft-Gault equation",
          "MDRD equation",
          "Henderson-Hasselbalch equation"
        ],
        correct: 1,
        rationale: "The Cockcroft-Gault equation is the standard for calculating creatinine clearance for drug dosing purposes, incorporating age, weight, sex, and serum creatinine."
      },
      {
        question: "At what eGFR threshold is metformin generally contraindicated?",
        options: [
          "eGFR < 60 mL/min",
          "eGFR < 45 mL/min",
          "eGFR < 30 mL/min",
          "eGFR < 15 mL/min"
        ],
        correct: 2,
        rationale: "Metformin is contraindicated when eGFR falls below 30 mL/min due to increased risk of lactic acidosis from impaired renal clearance of the drug."
      },
      {
        question: "Which of the following medications is considered safe during pregnancy?",
        options: [
          "Warfarin",
          "Lisinopril",
          "Labetalol",
          "Methotrexate"
        ],
        correct: 2,
        rationale: "Labetalol is considered safe in pregnancy and is commonly used to manage gestational hypertension and preeclampsia. Warfarin, ACE inhibitors, and methotrexate are known teratogens."
      },
      {
        question: "A patient with Child-Pugh Class C cirrhosis requires anticoagulation. Which consideration is most important?",
        options: [
          "Standard dosing of warfarin is appropriate",
          "DOACs are preferred over warfarin in severe liver disease",
          "Severe hepatic impairment contraindicates many DOACs and requires careful warfarin management",
          "No anticoagulation adjustment is needed if INR is normal"
        ],
        correct: 2,
        rationale: "Child-Pugh Class C represents severe hepatic impairment. Most DOACs are contraindicated in Child-Pugh C, and warfarin requires very careful management due to impaired synthesis of clotting factors."
      }
    ]
  },

  "pharm-np-controlled-substances": {
    title: "Controlled Substance Management",
    cellular: {
      title: "Neurobiological Basis of Controlled Substance",
      content:
        "Controlled substances exert their effects through specific neuroreceptor systems: opioids bind mu, kappa, and delta receptors in the central nervous system modulating pain perception and reward pathways via endogenous endorphin circuits. Benzodiazepines enhance gamma-aminobutyric acid (GABA) activity at GABA-A receptors by increasing chloride channel opening frequency, producing anxiolytic, sedative, and anticonvulsant effects. Stimulants such as amphetamines and methylphenidate increase synaptic dopamine and norepinephrine concentrations by blocking reuptake transporters and, in the case of amphetamines, promoting vesicular release. Tolerance develops through receptor downregulation and desensitization, while physical dependence involves neuroadaptive changes that produce withdrawal symptoms upon abrupt discontinuation, necessitating structured tapering protocols."
    },
    riskFactors: [
      "History of substance use disorder",
      "Concurrent use of CNS depressants (benzodiazepines with opioids)",
      "Elderly patients with increased sensitivity to sedation and falls",
      "Mental health comorbidities (depression, anxiety, PTSD)",
      "Family history of addiction",
      "High morphine milligram equivalent (MME) daily doses exceeding 50-90 MME",
      "Lack of PDMP checking prior to prescribing"
    ],
    diagnostics: [
      "Prescription Drug Monitoring Program (PDMP) query before each controlled substance prescription",
      "Urine drug screening (UDS) at baseline and periodically for opioid therapy",
      "COWS (Clinical Opiate Withdrawal Scale) scoring for buprenorphine initiation",
      "Baseline ECG for stimulants and methadone prescribing",
      "Cardiovascular assessment (blood pressure, heart rate) before stimulant therapy",
      "Growth charts and height/weight monitoring in pediatric stimulant patients",
      "Screening tools: CAGE-AID, DAST-10, or ORT for substance misuse risk"
    ],
    management: [
      "Check PDMP before every controlled substance prescription as mandated by most jurisdictions",
      "Follow CDC opioid prescribing guidelines: lowest effective dose, shortest duration",
      "Co-prescribe naloxone when opioid doses exceed 50 MME/day or risk factors present",
      "Establish opioid treatment agreements documenting expectations and monitoring plans",
      "Taper benzodiazepines gradually (reduce by 10-25% every 1-2 weeks) to prevent withdrawal seizures",
      "Monitor for diversion risk with stimulant prescriptions; use pill counts and UDS",
      "Initiate buprenorphine only after confirmed moderate withdrawal (COWS score 8-12 or higher)"
    ],
    signs: {
      left: [
        "Opioid toxicity: respiratory depression, miosis, sedation, decreased GCS",
        "Benzodiazepine withdrawal: anxiety, tremor, insomnia, seizures",
        "Stimulant adverse effects: tachycardia, hypertension, weight loss, insomnia",
        "Opioid withdrawal: lacrimation, rhinorrhea, myalgia, diarrhea, piloerection"
      ],
      right: [
        "Schedule II: high abuse potential (opioids, amphetamines, methylphenidate, methadone)",
        "Schedule III: moderate abuse potential (buprenorphine, testosterone, ketamine)",
        "Schedule IV: lower abuse potential (benzodiazepines, zolpidem, tramadol in some jurisdictions)",
        "Schedule V: lowest abuse potential (pregabalin, low-dose codeine cough preparations)"
      ]
    },
    medications: [
      {
        name: "Buprenorphine/Naloxone (Suboxone)",
        type: "Partial opioid agonist / opioid antagonist combination",
        action: "Buprenorphine is a partial mu-opioid agonist with high receptor affinity producing a ceiling effect on respiratory depression; naloxone deters parenteral misuse",
        sideEffects: "Headache, nausea, constipation, insomnia, diaphoresis, sublingual irritation",
        contra: "Do not initiate until patient is in moderate withdrawal (COWS 8-12+); concurrent full agonist opioids can precipitate withdrawal",
        pearl: "The X-waiver requirement was eliminated in 2023 allowing all DEA-registered practitioners to prescribe buprenorphine for opioid use disorder without additional certification"
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid antagonist",
        action: "Competitively binds mu-opioid receptors displacing opioid agonists and rapidly reversing respiratory depression",
        sideEffects: "Precipitated withdrawal (agitation, vomiting, tachycardia), short duration of action (30-90 minutes) may require repeat dosing",
        contra: "No absolute contraindications in life-threatening opioid overdose; use with caution in opioid-dependent patients due to withdrawal precipitation",
        pearl: "Co-prescribe naloxone with opioids when daily dose exceeds 50 MME, when concurrent benzodiazepines are used, or when patient has risk factors for overdose"
      },
      {
        name: "Lorazepam",
        type: "Benzodiazepine (Schedule IV)",
        action: "Enhances GABA-A receptor activity by increasing chloride channel opening frequency, producing anxiolytic and sedative effects",
        sideEffects: "Sedation, cognitive impairment, respiratory depression, paradoxical agitation in elderly, falls risk",
        contra: "Avoid in elderly per Beers Criteria due to increased fall and cognitive impairment risk; avoid combining with opioids; taper gradually to prevent withdrawal seizures",
        pearl: "Lorazepam is preferred in hepatic impairment because it undergoes glucuronidation rather than CYP450 oxidation, avoiding active metabolite accumulation"
      },
      {
        name: "Methylphenidate",
        type: "CNS stimulant (Schedule II)",
        action: "Blocks dopamine and norepinephrine reuptake transporters, increasing catecholamine concentrations in the prefrontal cortex",
        sideEffects: "Decreased appetite, weight loss, insomnia, tachycardia, increased blood pressure, growth suppression in children",
        contra: "Structural cardiac abnormalities, uncontrolled hypertension, concurrent MAO inhibitor use, history of psychosis",
        pearl: "Obtain baseline heart rate, blood pressure, and consider ECG before initiating; monitor height and weight in children every 3-6 months for growth suppression"
      },
      {
        name: "Methadone",
        type: "Full opioid agonist (Schedule II)",
        action: "Binds mu-opioid receptors and also acts as NMDA receptor antagonist; long and variable half-life (8-59 hours)",
        sideEffects: "QT prolongation, respiratory depression, sedation, constipation, diaphoresis",
        contra: "Baseline QTc > 500 ms, concurrent QT-prolonging medications, severe respiratory depression",
        pearl: "Methadone requires ECG monitoring due to QT prolongation risk; its long half-life means dose accumulation can cause delayed respiratory depression days after dose increases"
      }
    ],
    pearls: [
      "PDMP checking is legally mandated in most US states and Canadian provinces before prescribing controlled substances; document every query in the patient record",
      "The CDC recommends against exceeding 90 MME/day for chronic non-cancer pain; carefully reassess risk-benefit when doses exceed 50 MME/day",
      "Benzodiazepine tapers should reduce dose by no more than 10-25% every 1-2 weeks; rapid discontinuation risks withdrawal seizures and rebound anxiety",
      "The COWS score guides buprenorphine induction timing: score of 8-12 indicates moderate withdrawal appropriate for initiation; premature dosing precipitates withdrawal",
      "Stimulant diversion is common in college and workplace settings; use long-acting formulations and periodic monitoring to reduce risk"
    ],
    quiz: [
      {
        question: "What is the recommended COWS score threshold for initiating buprenorphine in opioid use disorder?",
        options: [
          "COWS score of 2-4",
          "COWS score of 5-7",
          "COWS score of 8-12 or higher",
          "COWS score is not relevant to buprenorphine initiation"
        ],
        correct: 2,
        rationale: "Buprenorphine should be initiated when the COWS score indicates moderate withdrawal (8-12 or higher). Starting too early when the patient still has full agonist opioids occupying receptors will precipitate withdrawal."
      },
      {
        question: "At what daily morphine milligram equivalent (MME) dose should naloxone be co-prescribed according to CDC guidelines?",
        options: [
          "25 MME/day",
          "50 MME/day",
          "100 MME/day",
          "150 MME/day"
        ],
        correct: 1,
        rationale: "The CDC recommends co-prescribing naloxone when opioid doses reach or exceed 50 MME/day, or when opioids are prescribed concurrently with benzodiazepines, or when the patient has risk factors for overdose."
      },
      {
        question: "Why is lorazepam preferred over other benzodiazepines in patients with hepatic impairment?",
        options: [
          "It has the shortest half-life of all benzodiazepines",
          "It undergoes glucuronidation rather than CYP450 oxidation, avoiding active metabolite accumulation",
          "It has no risk of dependence",
          "It does not cross the blood-brain barrier in liver disease"
        ],
        correct: 1,
        rationale: "Lorazepam, oxazepam, and temazepam (LOT) are preferred in hepatic impairment because they undergo Phase II glucuronidation conjugation, bypassing CYP450 oxidative metabolism and avoiding accumulation of active metabolites."
      },
      {
        question: "Which baseline assessment is essential before initiating stimulant therapy for ADHD?",
        options: [
          "Liver function tests",
          "Renal function panel",
          "Cardiovascular assessment including heart rate and blood pressure",
          "Pulmonary function tests"
        ],
        correct: 2,
        rationale: "Stimulants can increase heart rate and blood pressure. Baseline cardiovascular assessment is essential, and an ECG should be considered in patients with cardiac history, family history of sudden death, or cardiac symptoms."
      }
    ]
  },

  "pharm-np-high-risk": {
    title: "High-Risk Prescribing and Safety",
    cellular: {
      title: "Molecular Mechanisms of High-Risk Drug",
      content:
        "Serotonin syndrome results from excessive serotonergic activity at 5-HT1A and 5-HT2A receptors in the central and peripheral nervous systems, caused by combinations of serotonergic medications such as SSRIs with tramadol, triptans, MAOIs, or linezolid, producing a triad of altered mental status, autonomic instability, and neuromuscular hyperactivity. Neuroleptic malignant syndrome (NMS) involves dopamine D2 receptor blockade primarily in the hypothalamus and basal ganglia, most commonly triggered by antipsychotic medications, manifesting as lead-pipe rigidity, hyperthermia exceeding 40 degrees Celsius, altered mental status, and markedly elevated creatine kinase. QT prolongation occurs when medications block the hERG potassium channel (IKr current), delaying ventricular repolarization and increasing the risk of torsades de pointes, a potentially fatal polymorphic ventricular tachycardia. Drug-drug interactions through CYP450 inhibition or induction alter the metabolism of co-administered drugs, leading to either toxicity from elevated drug levels or therapeutic failure from accelerated clearance."
    },
    riskFactors: [
      "Polypharmacy especially in elderly patients",
      "Concurrent use of multiple serotonergic agents",
      "Use of antipsychotics at high doses or during rapid dose escalation",
      "Pre-existing QT prolongation or electrolyte imbalances (hypokalemia, hypomagnesemia)",
      "Hepatic impairment altering CYP450 metabolism",
      "Concomitant use of CYP450 inhibitors or inducers",
      "Female sex and advanced age as risk factors for QT prolongation"
    ],
    diagnostics: [
      "ECG monitoring for QTc interval (prolonged if > 470 ms in males, > 480 ms in females)",
      "Serum creatine kinase (CK) for suspected neuroleptic malignant syndrome",
      "Comprehensive metabolic panel including potassium and magnesium",
      "INR monitoring for warfarin with any medication change",
      "Complete blood count with differential for clozapine (weekly then biweekly then monthly ANC monitoring)",
      "Liver function tests when combining hepatotoxic agents",
      "Temperature monitoring for NMS and serotonin syndrome"
    ],
    management: [
      "Discontinue all serotonergic agents immediately if serotonin syndrome suspected; administer cyproheptadine as serotonin antagonist",
      "Discontinue causative antipsychotic in NMS; provide supportive care with cooling, IV fluids, and consider dantrolene or bromocriptine",
      "Correct electrolyte imbalances (potassium > 4.0, magnesium > 2.0) before and during QT-prolonging therapy",
      "Review all medications for CYP450 interactions before adding new prescriptions",
      "Implement Beers Criteria screening for elderly patients at every medication reconciliation",
      "Report adverse drug reactions through MedWatch (US) or Canada Vigilance (Canada)",
      "Apply deprescribing frameworks (STOPP/START criteria) to reduce unnecessary polypharmacy"
    ],
    signs: {
      left: [
        "Serotonin syndrome triad: altered mental status, autonomic instability (tachycardia, hyperthermia, diaphoresis), neuromuscular hyperactivity (clonus, hyperreflexia, tremor)",
        "NMS tetrad: lead-pipe rigidity, hyperthermia (> 40 C), altered mental status, autonomic dysfunction with elevated CK",
        "QT prolongation signs: palpitations, syncope, seizures, or sudden cardiac arrest from torsades de pointes",
        "Drug-induced agranulocytosis: fever, sore throat, mouth ulcers (clozapine)"
      ],
      right: [
        "Black box warnings: fluoroquinolones (tendon rupture, aortic dissection), SSRIs (suicidality in patients under 25)",
        "Black box warnings: warfarin (major bleeding), clozapine (agranulocytosis, myocarditis), isotretinoin (teratogenicity)",
        "QT-prolonging drugs: azithromycin, fluoroquinolones, methadone, ondansetron, haloperidol, TCAs",
        "CYP450 interactions: fluconazole and erythromycin (inhibitors), rifampin and carbamazepine (inducers)"
      ]
    },
    medications: [
      {
        name: "Ciprofloxacin",
        type: "Fluoroquinolone antibiotic",
        action: "Inhibits bacterial DNA gyrase and topoisomerase IV, preventing DNA replication and transcription",
        sideEffects: "Tendon rupture (especially Achilles), QT prolongation, peripheral neuropathy, aortic aneurysm/dissection, CNS effects",
        contra: "Myasthenia gravis (may worsen weakness), concurrent use with tizanidine or theophylline, children under 18 (except specific indications)",
        pearl: "Black box warning for tendon rupture, peripheral neuropathy, and CNS effects; risk increases with concurrent corticosteroids, age over 60, and organ transplant recipients"
      },
      {
        name: "Clozapine",
        type: "Atypical antipsychotic",
        action: "Antagonizes multiple receptors including D1, D2, D4, 5-HT2A, muscarinic, and alpha-adrenergic receptors",
        sideEffects: "Agranulocytosis (1-2% incidence), metabolic syndrome, weight gain, sedation, sialorrhea, seizures, myocarditis",
        contra: "Uncontrolled epilepsy, severe granulocytopenia, paralytic ileus; requires enrollment in REMS program with mandatory ANC monitoring",
        pearl: "Clozapine requires absolute neutrophil count (ANC) monitoring: weekly for first 6 months, biweekly for months 6-12, then monthly thereafter; it is the only antipsychotic proven effective for treatment-resistant schizophrenia"
      },
      {
        name: "Warfarin",
        type: "Vitamin K antagonist anticoagulant",
        action: "Inhibits vitamin K epoxide reductase (VKORC1), preventing gamma-carboxylation of clotting factors II, VII, IX, and X",
        sideEffects: "Bleeding (major and minor), skin necrosis (especially in protein C deficiency), purple toe syndrome, teratogenicity",
        contra: "Pregnancy (teratogenic, especially weeks 6-12), active major bleeding, severe hepatic disease, noncompliant patients",
        pearl: "Warfarin has extensive drug interactions: CYP2C9 inhibitors (fluconazole, amiodarone) increase INR; CYP inducers (rifampin, carbamazepine) decrease INR; vitamin K-rich foods affect efficacy"
      },
      {
        name: "Sertraline",
        type: "Selective serotonin reuptake inhibitor (SSRI)",
        action: "Selectively inhibits serotonin reuptake at the presynaptic neuron, increasing serotonin availability in the synaptic cleft",
        sideEffects: "Nausea, sexual dysfunction, insomnia, headache, serotonin syndrome when combined with other serotonergic agents",
        contra: "Concurrent MAOIs (wait 14 days between), concurrent use with linezolid or methylene blue, caution with other serotonergic agents",
        pearl: "Black box warning for increased suicidality in patients under 25 years old; monitor closely during initiation and dose changes; serotonin syndrome risk increases with tramadol, triptans, and St. Johns Wort"
      },
      {
        name: "Haloperidol",
        type: "Typical (first-generation) antipsychotic",
        action: "Potent dopamine D2 receptor antagonist in mesolimbic and nigrostriatal pathways",
        sideEffects: "Extrapyramidal symptoms, tardive dyskinesia, QT prolongation, NMS, hyperprolactinemia",
        contra: "Parkinson disease, dementia-related psychosis (black box: increased mortality), severe cardiac disease with prolonged QT",
        pearl: "High-potency typical antipsychotics like haloperidol carry the highest risk of EPS and NMS; IV haloperidol carries greater QT prolongation risk than oral formulation"
      },
      {
        name: "Cyproheptadine",
        type: "Serotonin antagonist / antihistamine",
        action: "Antagonizes 5-HT1A and 5-HT2A serotonin receptors, counteracting excess serotonergic activity",
        sideEffects: "Sedation, dry mouth, increased appetite, urinary retention",
        contra: "Narrow-angle glaucoma, urinary retention, concurrent MAOIs",
        pearl: "Cyproheptadine is the specific antidote for serotonin syndrome; initial dose is 12 mg followed by 2 mg every 2 hours until symptoms resolve; it is not effective for NMS"
      }
    ],
    pearls: [
      "Serotonin syndrome develops rapidly (within hours) and features clonus and hyperreflexia, distinguishing it from NMS which develops over days and features lead-pipe rigidity with no clonus",
      "The Hunter Criteria is the preferred diagnostic tool for serotonin syndrome, emphasizing clonus (spontaneous, inducible, or ocular) as the key clinical finding",
      "Beers Criteria identifies potentially inappropriate medications for adults 65 and older; key offenders include benzodiazepines, first-generation antihistamines, long-acting sulfonylureas, and chronic NSAID use",
      "QTc correction using the Bazett formula (QTc = QT / square root of RR interval) should be applied; drug-induced QTc > 500 ms significantly increases torsades de pointes risk",
      "MedWatch (FDA) and Canada Vigilance (Health Canada) are the official adverse drug reaction reporting systems; NPs have a professional obligation to report serious and unexpected adverse effects"
    ],
    quiz: [
      {
        question: "Which clinical finding best distinguishes serotonin syndrome from neuroleptic malignant syndrome?",
        options: [
          "Hyperthermia",
          "Altered mental status",
          "Clonus and hyperreflexia",
          "Elevated creatine kinase"
        ],
        correct: 2,
        rationale: "Clonus and hyperreflexia are hallmark neuromuscular findings of serotonin syndrome. NMS presents with lead-pipe rigidity and absence of clonus. Both conditions can feature hyperthermia and altered mental status."
      },
      {
        question: "A patient on sertraline is prescribed tramadol for pain. What is the primary safety concern?",
        options: [
          "QT prolongation",
          "Serotonin syndrome",
          "Neuroleptic malignant syndrome",
          "Agranulocytosis"
        ],
        correct: 1,
        rationale: "Both sertraline (SSRI) and tramadol (serotonin reuptake inhibitor and weak opioid agonist) increase serotonergic activity. Their combination significantly increases the risk of serotonin syndrome."
      },
      {
        question: "Which medication requires mandatory absolute neutrophil count (ANC) monitoring through a REMS program?",
        options: [
          "Haloperidol",
          "Risperidone",
          "Clozapine",
          "Olanzapine"
        ],
        correct: 2,
        rationale: "Clozapine carries a black box warning for agranulocytosis and requires enrollment in the Clozapine REMS Program with mandatory ANC monitoring: weekly for 6 months, biweekly for months 6-12, then monthly."
      },
      {
        question: "Which drug combination poses the greatest risk for QT prolongation and torsades de pointes?",
        options: [
          "Metformin and lisinopril",
          "Methadone and ondansetron",
          "Acetaminophen and ibuprofen",
          "Amoxicillin and clavulanate"
        ],
        correct: 1,
        rationale: "Both methadone and ondansetron independently prolong the QT interval by blocking hERG potassium channels. Their combination significantly increases the risk of torsades de pointes, especially with concurrent hypokalemia or hypomagnesemia."
      }
    ]
  }
};
