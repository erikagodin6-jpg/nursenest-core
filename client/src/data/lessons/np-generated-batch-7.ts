import type { LessonContent } from "./types";

export const npGeneratedBatch7: Record<string, LessonContent> = {
  "np-obesity-pathophysiology-management": {
    title: "Obesity Pathophysiology & Pharmacologic Management",
    cellular: {
      title: "Adipose Tissue Biology and Metabolic Dysfunction",
      content: "Obesity is a chronic, relapsing, multifactorial disease characterized by excess adiposity that impairs health. White adipose tissue (WAT) functions as an endocrine organ secreting adipokines that regulate metabolism, inflammation, and appetite. In obesity, adipocyte hypertrophy leads to hypoxia, macrophage infiltration, and a pro-inflammatory state with elevated TNF-alpha, IL-6, and resistin, while protective adiponectin levels decline. Adiponectin normally enhances insulin sensitivity via AMPK activation and fatty acid oxidation; its reduction in obesity directly contributes to insulin resistance. Leptin, secreted proportionally to fat mass, signals satiety via hypothalamic leptin receptors (ObRb) activating JAK-STAT3 pathways. In obesity, chronic hyperleptinemia causes leptin resistance through SOCS3-mediated suppression of leptin signaling, impairing satiety and promoting continued energy intake despite adequate fat stores.\n\nInsulin resistance in obesity involves impaired insulin receptor substrate (IRS-1) phosphorylation by serine kinases activated by free fatty acids, inflammatory cytokines, and ER stress. Ectopic lipid deposition in liver (NAFLD/NASH), skeletal muscle, and pancreatic beta cells (lipotoxicity) further impairs glucose homeostasis. Visceral adiposity is particularly metabolically active, draining directly into the portal circulation and exposing the liver to high concentrations of free fatty acids and inflammatory mediators.\n\nThe set-point theory posits that the hypothalamus defends a body weight range through adaptive thermogenesis and hormonal adjustments. After weight loss, ghrelin (hunger hormone) increases while leptin, PYY, and GLP-1 decrease, creating a hormonal milieu that promotes weight regain. This metabolic adaptation explains why behavioral interventions alone achieve only 3-5% sustained weight loss in most patients, supporting the rationale for pharmacotherapy and bariatric surgery."
    },
    riskFactors: [
      "Genetic predisposition (FTO, MC4R gene variants account for 40-70% of BMI heritability)",
      "Sedentary lifestyle and excess caloric intake relative to energy expenditure",
      "Endocrine disorders: hypothyroidism, Cushing syndrome, PCOS, hypogonadism",
      "Medications: antipsychotics (olanzapine, clozapine), glucocorticoids, insulin, sulfonylureas, TCAs, valproic acid, beta-blockers",
      "Sleep deprivation (<6 hours/night increases ghrelin, decreases leptin)",
      "Socioeconomic factors: food insecurity, limited access to healthy foods",
      "Psychological factors: binge eating disorder, emotional eating, depression",
      "Microbiome dysbiosis (altered Firmicutes-to-Bacteroidetes ratio)",
      "Childhood obesity (adipocyte hyperplasia establishes elevated set point)"
    ],
    diagnostics: [
      "Calculate BMI: overweight 25-29.9, class I obesity 30-34.9, class II 35-39.9, class III ≥40 kg/m²",
      "Measure waist circumference: >40 inches (102 cm) males, >35 inches (88 cm) females indicates central obesity",
      "Order fasting lipid panel (dyslipidemia screening), fasting glucose and HbA1c (diabetes/prediabetes)",
      "Order hepatic function panel (ALT/AST for NAFLD screening)",
      "Order TSH to rule out hypothyroidism as contributing factor",
      "Order fasting insulin level and calculate HOMA-IR if insulin resistance suspected",
      "Screen for obstructive sleep apnea (STOP-BANG questionnaire, polysomnography if positive)",
      "Assess for metabolic syndrome: ≥3 of waist circumference, triglycerides ≥150, HDL <40M/<50F, BP ≥130/85, fasting glucose ≥100",
      "Screen for depression (PHQ-9) and binge eating disorder"
    ],
    management: [
      "Lifestyle modification as foundation: caloric deficit of 500-750 kcal/day targeting 5-10% weight loss over 6 months",
      "Prescribe semaglutide 2.4 mg SC weekly (Wegovy) for BMI ≥30 or ≥27 with comorbidity - most effective current pharmacotherapy (15-17% weight loss in STEP trials)",
      "Prescribe tirzepatide (Zepbound) dual GIP/GLP-1 agonist for BMI ≥30 or ≥27 with comorbidity (20-22% weight loss in SURMOUNT trials)",
      "Prescribe liraglutide 3.0 mg SC daily (Saxenda) as alternative GLP-1 RA (5-8% weight loss)",
      "Prescribe orlistat 120 mg TID with meals (lipase inhibitor, 3-4% weight loss) - OTC at 60 mg",
      "Prescribe phentermine-topiramate ER (Qsymia) for short-term use (7-10% weight loss)",
      "Prescribe naltrexone-bupropion ER (Contrave) targeting reward pathways (5-6% weight loss)",
      "Refer for bariatric surgery evaluation: BMI ≥40, or BMI ≥35 with obesity-related comorbidities (updated 2022 ASMBS/IFSO guidelines lower threshold to BMI ≥35 or ≥30 with metabolic disease)",
      "Address metabolic syndrome components individually: antihypertensives, statins, metformin as indicated"
    ],
    signs: {
      left: [
        "BMI 30-34.9 with no obesity-related comorbidities",
        "Waist circumference mildly elevated",
        "Normal fasting glucose and lipid panel",
        "No evidence of obstructive sleep apnea"
      ],
      right: [
        "BMI ≥40 or ≥35 with type 2 diabetes, hypertension, or OSA",
        "Metabolic syndrome with insulin resistance (acanthosis nigricans)",
        "NAFLD with elevated transaminases progressing to NASH",
        "Obesity hypoventilation syndrome (Pickwickian syndrome)"
      ]
    },
    medications: [
      {
        name: "Semaglutide 2.4 mg (Wegovy)",
        type: "GLP-1 Receptor Agonist",
        action: "Mimics endogenous GLP-1, activating hypothalamic satiety centers to reduce appetite and food intake; slows gastric emptying; enhances glucose-dependent insulin secretion from pancreatic beta cells",
        sideEffects: "Nausea (most common, usually transient), vomiting, diarrhea, constipation, injection site reactions, pancreatitis (rare), cholelithiasis",
        contra: "Personal or family history of medullary thyroid carcinoma or MEN type 2 (boxed warning for thyroid C-cell tumors in rodents), history of pancreatitis, concurrent use with other GLP-1 RAs",
        pearl: "Titrate slowly over 16-20 weeks to target dose (0.25 mg weekly x4 → 0.5 → 1.0 → 1.7 → 2.4 mg) to minimize GI side effects. STEP trials showed 15-17% weight loss vs 2.4% placebo. Discontinuation often leads to weight regain (two-thirds within 1 year), supporting long-term use. Monitor for suicidal ideation."
      },
      {
        name: "Phentermine-Topiramate ER (Qsymia)",
        type: "Sympathomimetic Amine + Anticonvulsant",
        action: "Phentermine stimulates norepinephrine release in the hypothalamus suppressing appetite; topiramate enhances GABA activity and inhibits carbonic anhydrase, reducing appetite through multiple CNS mechanisms",
        sideEffects: "Insomnia, dry mouth, constipation, paresthesias, dysgeusia, cognitive impairment, elevated heart rate, metabolic acidosis",
        contra: "Pregnancy (Category X - topiramate causes cleft palate), glaucoma, hyperthyroidism, within 14 days of MAOIs, uncontrolled hypertension",
        pearl: "Requires negative pregnancy test before starting and monthly during treatment. REMS program required. If <3% weight loss after 12 weeks on highest dose, discontinue (taper topiramate component). Most effective oral combination for weight loss (7-10%). Contraception mandatory in women of childbearing potential."
      }
    ],
    pearls: [
      "The 2022 ASMBS/IFSO guidelines lowered bariatric surgery thresholds: now recommended for BMI ≥35 regardless of comorbidities, or BMI 30-34.9 with metabolic disease - the NP should refer earlier rather than waiting for failed pharmacotherapy at higher BMIs",
      "GLP-1 receptor agonists (semaglutide, tirzepatide) have fundamentally changed obesity pharmacotherapy with 15-22% weight loss rivaling bariatric surgery outcomes - however weight regain occurs after discontinuation, supporting chronic disease management approach",
      "Metabolic adaptation after weight loss (decreased resting metabolic rate, increased ghrelin, decreased leptin/PYY/GLP-1) persists for years and explains high recidivism rates - this is a physiological, not behavioral, phenomenon that justifies long-term pharmacotherapy",
      "Waist circumference is a better predictor of cardiovascular and metabolic risk than BMI alone because it reflects visceral adiposity - a normal-BMI patient with central obesity (metabolically obese normal weight) has elevated cardiometabolic risk",
      "All anti-obesity medications should be discontinued if <5% weight loss is not achieved within 12-16 weeks at maximum tolerated dose - this non-response criterion prevents prolonged exposure without benefit"
    ],
    quiz: [
      {
        question: "A 48-year-old woman with BMI 36, type 2 diabetes (HbA1c 7.8% on metformin), hypertension, and OSA asks about weight loss medication. She has no history of thyroid cancer or pancreatitis. Which medication provides the greatest weight loss AND cardiovascular/metabolic benefit?",
        options: [
          "Orlistat 120 mg TID with meals",
          "Semaglutide 2.4 mg SC weekly (Wegovy)",
          "Phentermine 37.5 mg daily",
          "Naltrexone-bupropion ER (Contrave)"
        ],
        correct: 1,
        rationale: "Semaglutide 2.4 mg (Wegovy) provides the greatest weight loss among currently available non-surgical options (15-17% in STEP trials) with demonstrated cardiovascular benefit (SELECT trial showed 20% reduction in MACE). It also improves glycemic control, making it ideal for this patient with T2DM. Orlistat provides modest weight loss (3-4%). Phentermine is short-term only. Naltrexone-bupropion provides moderate weight loss (5-6%) without proven CV benefit."
      },
      {
        question: "A 35-year-old woman on phentermine-topiramate ER (Qsymia) for obesity management reports a missed menstrual period. Pregnancy test is positive. What is the immediate priority action?",
        options: [
          "Continue Qsymia and add prenatal vitamins",
          "Immediately discontinue Qsymia (taper topiramate component) and counsel on teratogenic risk of cleft palate/lip",
          "Switch to orlistat for the remainder of pregnancy",
          "Reduce Qsymia to the lowest dose"
        ],
        correct: 1,
        rationale: "Topiramate is Category X in pregnancy with documented risk of oral clefts (cleft lip/palate) with first-trimester exposure. Qsymia must be immediately discontinued with topiramate tapered to prevent seizures. The REMS program requires monthly pregnancy testing and documented contraception use. No anti-obesity medications are recommended during pregnancy. This case illustrates why pregnancy testing and contraception counseling are mandatory components of Qsymia prescribing."
      },
      {
        question: "A patient on semaglutide 2.4 mg weekly for 16 weeks has lost only 3% of body weight. The patient reports good adherence and tolerates the medication well. What should the NP recommend?",
        options: [
          "Continue semaglutide for another 16 weeks before reassessing",
          "Add phentermine to boost weight loss",
          "Discontinue semaglutide as the patient is a non-responder at maximum dose and consider alternative pharmacotherapy or bariatric surgery referral",
          "Double the semaglutide dose to 4.8 mg weekly"
        ],
        correct: 2,
        rationale: "Guidelines recommend discontinuing anti-obesity medication if <5% weight loss is not achieved after 12-16 weeks at maximum tolerated dose. This patient has achieved only 3% at maximum dose (2.4 mg), indicating non-response. Continuing will not improve outcomes. The NP should discuss alternative medications (tirzepatide, naltrexone-bupropion) or referral for bariatric surgery evaluation. Semaglutide 2.4 mg is the maximum approved dose for obesity."
      }
    ]
  },

  "np-smoking-cessation-pharmacology": {
    title: "Smoking Cessation Pharmacology",
    cellular: {
      title: "Nicotine Addiction Neuropharmacology",
      content: "Nicotine addiction involves complex neurobiological mechanisms centered on the mesolimbic dopamine reward pathway. Inhaled nicotine reaches the brain within 10-20 seconds, binding to nicotinic acetylcholine receptors (nAChRs) — primarily alpha4beta2 subtypes — on ventral tegmental area (VTA) neurons. Receptor activation causes dopamine release in the nucleus accumbens, producing the reinforcing effects of smoking. Chronic nicotine exposure upregulates nAChR density (neuroadaptation), such that receptor desensitization during abstinence produces withdrawal symptoms: irritability, anxiety, difficulty concentrating, increased appetite, depressed mood, and intense cravings.\n\nThe Fagerström Test for Nicotine Dependence (FTND) quantifies physical dependence on a 0-10 scale, with the most predictive item being time to first cigarette after waking (<5 minutes indicates severe dependence). Nicotine has a half-life of approximately 2 hours, explaining the frequency of smoking behavior. Cotinine, the primary metabolite via CYP2A6, has a 16-hour half-life and serves as a biomarker for tobacco exposure.\n\nWithdrawal symptoms peak within 24-72 hours and gradually diminish over 2-4 weeks, though psychological cravings can persist for months. The 5 A's framework structures clinical intervention: Ask about tobacco use, Advise to quit, Assess willingness, Assist with quit plan and pharmacotherapy, Arrange follow-up. Even brief clinician advice (3 minutes) increases quit rates by 30%. Combination pharmacotherapy with behavioral counseling achieves the highest cessation rates (25-35% at 6 months)."
    },
    riskFactors: [
      "Early age of smoking initiation (<15 years increases lifetime dependence risk)",
      "High Fagerström score (≥6 indicates severe nicotine dependence)",
      "Comorbid psychiatric conditions: depression, anxiety, schizophrenia, ADHD, substance use disorders",
      "Low socioeconomic status and lower educational attainment",
      "Genetic factors: CYP2A6 polymorphisms affect nicotine metabolism rate",
      "Social environment: household members or peers who smoke",
      "History of multiple failed quit attempts",
      "Concurrent alcohol or cannabis use (triggers smoking behavior)",
      "Occupational stress and lack of smoke-free workplace policies"
    ],
    diagnostics: [
      "Assess tobacco use status at every clinical encounter (the '5 A's - Ask)",
      "Administer Fagerström Test for Nicotine Dependence to quantify addiction severity",
      "Assess readiness to quit using stages of change model (precontemplation, contemplation, preparation, action, maintenance)",
      "Order baseline labs: fasting lipid panel, fasting glucose, CBC (smoking causes polycythemia)",
      "Perform spirometry if respiratory symptoms present (COPD screening)",
      "Assess for comorbid depression (PHQ-9) and anxiety (GAD-7) - these conditions worsen during cessation",
      "Obtain medication history to identify drug interactions with smoking cessation agents",
      "Screen for contraindications to specific cessation pharmacotherapies",
      "Order urine cotinine if verification of smoking status needed (cutoff >200 ng/mL active smoker)"
    ],
    management: [
      "Prescribe varenicline (Chantix) as first-line monotherapy: 0.5 mg daily x3 days → 0.5 mg BID x4 days → 1 mg BID for 12 weeks (24 weeks for relapse prevention)",
      "Prescribe nicotine patch 21 mg/day (>10 cig/day) or 14 mg/day (<10 cig/day) tapering over 8-12 weeks",
      "Prescribe combination NRT: nicotine patch (baseline) + short-acting NRT (gum 2-4 mg, lozenge 2-4 mg, inhaler, or nasal spray) for breakthrough cravings",
      "Prescribe bupropion SR 150 mg daily x3 days then 150 mg BID for 7-12 weeks (start 1-2 weeks before quit date)",
      "Combine pharmacotherapy with behavioral counseling (individual, group, or quitline: 1-800-QUIT-NOW) for maximal efficacy",
      "Set a target quit date within 2 weeks of starting pharmacotherapy",
      "Prescribe combination varenicline + nicotine patch for heavy smokers (>20/day) with prior failed monotherapy",
      "Schedule follow-up within 1 week of quit date, then monthly for first 3 months",
      "Counsel on relapse prevention: identify triggers, develop coping strategies, weight management plan"
    ],
    signs: {
      left: [
        "Motivated to quit, low Fagerström score (0-3)",
        "No comorbid psychiatric conditions",
        "First quit attempt with adequate social support",
        "Light smoker (<10 cigarettes/day)"
      ],
      right: [
        "High Fagerström score (≥7), smokes within 5 minutes of waking",
        "Multiple failed quit attempts with severe withdrawal",
        "Comorbid depression, schizophrenia, or substance use disorder",
        "Heavy smoker (>20/day) with COPD or cardiovascular disease"
      ]
    },
    medications: [
      {
        name: "Varenicline (Chantix)",
        type: "Nicotinic Receptor Partial Agonist",
        action: "Partial agonist at alpha4beta2 nAChRs: provides moderate dopamine release to reduce withdrawal/cravings (agonist effect) while blocking nicotine from binding and producing its full rewarding effect (antagonist effect)",
        sideEffects: "Nausea (most common, 30% - take with food and full glass of water), vivid dreams/insomnia, headache, constipation, flatulence",
        contra: "End-stage renal disease (dose adjust to 0.5 mg BID), known hypersensitivity; previous FDA boxed warning for neuropsychiatric events was REMOVED in 2016 after EAGLES trial showed no increased risk vs NRT or placebo",
        pearl: "Most effective single-agent cessation therapy (OR 2.24 vs placebo). EAGLES trial (2016) demonstrated no increased risk of neuropsychiatric adverse events compared to NRT, bupropion, or placebo, leading to FDA removal of boxed warning. Can be used safely in patients with psychiatric comorbidities. Extend to 24 weeks for relapse prevention. May be combined with NRT for refractory cases."
      },
      {
        name: "Bupropion SR (Zyban/Wellbutrin SR)",
        type: "Norepinephrine-Dopamine Reuptake Inhibitor",
        action: "Inhibits reuptake of norepinephrine and dopamine, reducing nicotine withdrawal symptoms and cravings; also functions as a non-competitive antagonist at nicotinic receptors",
        sideEffects: "Insomnia (take second dose early afternoon, not at bedtime), dry mouth, headache, agitation, dose-dependent seizure risk",
        contra: "Seizure disorder or history of seizures, current or prior diagnosis of bulimia/anorexia (seizure risk), concurrent MAOI use (14-day washout), abrupt discontinuation of alcohol or benzodiazepines",
        pearl: "Dual indication: FDA-approved for both smoking cessation and major depression - ideal for patients with comorbid depression. Start 1-2 weeks before quit date. Do NOT exceed 300 mg/day (seizure risk increases at higher doses). Weight-neutral (actually promotes modest weight loss), advantageous for patients concerned about post-cessation weight gain. Can be safely combined with NRT."
      }
    ],
    pearls: [
      "Varenicline is the most effective single-agent cessation therapy but combination NRT (patch + short-acting form) achieves comparable quit rates - the clinician should select based on patient preference, cost, and contraindications",
      "The EAGLES trial definitively showed that varenicline does NOT increase neuropsychiatric adverse events compared to NRT or placebo, even in patients with psychiatric disorders - the FDA boxed warning was removed in 2016",
      "Bupropion has a dual indication for depression and smoking cessation, making it the ideal first-line choice for smokers with comorbid depression - it also attenuates post-cessation weight gain",
      "Combination pharmacotherapy (varenicline + NRT, or long-acting + short-acting NRT) plus behavioral counseling achieves the highest cessation rates (25-35%) and should be offered to all patients with severe nicotine dependence",
      "The most predictive question on the Fagerström scale is time to first cigarette: smoking within 5 minutes of waking indicates severe physical dependence requiring aggressive pharmacotherapy"
    ],
    quiz: [
      {
        question: "A 55-year-old man with a 40-pack-year history, COPD, and a Fagerström score of 8 wants to quit smoking. He has failed NRT patch monotherapy twice. He has no psychiatric history. Which regimen offers the highest probability of success?",
        options: [
          "Nicotine patch 21 mg alone for 12 weeks",
          "Varenicline 1 mg BID combined with nicotine patch 21 mg/day plus behavioral counseling",
          "Bupropion SR 150 mg BID alone",
          "E-cigarette transition"
        ],
        correct: 1,
        rationale: "For a patient with severe nicotine dependence (Fagerström 8) who has failed NRT monotherapy, combination pharmacotherapy (varenicline + NRT) plus behavioral counseling provides the highest quit rates. Varenicline partially activates nAChRs while blocking nicotine's rewarding effects, and the concurrent NRT provides additional baseline nicotine replacement. The EAGLES trial confirmed varenicline's safety. Repeating failed monotherapy or unproven e-cigarettes would be suboptimal."
      },
      {
        question: "A 42-year-old woman who smokes 15 cigarettes/day wants to quit. She has comorbid major depressive disorder currently treated with sertraline. She is concerned about weight gain after quitting. Which cessation medication best addresses all her concerns?",
        options: [
          "Nicotine gum 4 mg PRN",
          "Bupropion SR 150 mg BID (start 1-2 weeks before quit date)",
          "Varenicline 1 mg BID",
          "Nicotine patch 14 mg/day"
        ],
        correct: 1,
        rationale: "Bupropion SR has a dual FDA indication for smoking cessation and major depression, making it ideal for this patient. Its norepinephrine-dopamine reuptake inhibition helps manage both nicotine withdrawal and depressive symptoms. Uniquely among cessation agents, bupropion is weight-neutral to slightly weight-reducing, addressing her concern about post-cessation weight gain. Can be safely combined with sertraline (SSRI). Start 1-2 weeks before the quit date to achieve therapeutic levels."
      },
      {
        question: "A patient on varenicline for 4 weeks reports persistent nausea that is interfering with adherence. The patient has not yet quit smoking but has reduced from 20 to 8 cigarettes/day. What is the most appropriate intervention?",
        options: [
          "Discontinue varenicline immediately and switch to bupropion",
          "Counsel to take varenicline with food and a full glass of water; if nausea persists, consider temporary dose reduction to 0.5 mg BID",
          "Add ondansetron 4 mg for nausea and continue full dose",
          "Discontinue all pharmacotherapy and recommend behavioral counseling alone"
        ],
        correct: 1,
        rationale: "Nausea is the most common side effect of varenicline (30%) and typically improves with food and adequate hydration. Temporary dose reduction to 0.5 mg BID may improve tolerability while maintaining partial efficacy. The patient is showing progress (reduced from 20 to 8 cigarettes), suggesting the medication is working. Abruptly switching agents eliminates the partial agonist benefit. Complete discontinuation of pharmacotherapy reduces quit probability significantly."
      }
    ]
  },

  "np-parkinson-disease-management": {
    title: "Parkinson Disease Management",
    cellular: {
      title: "Dopaminergic Neurodegeneration and Alpha-Synuclein Pathology",
      content: "Parkinson disease (PD) is a progressive neurodegenerative disorder characterized by loss of dopaminergic neurons in the substantia nigra pars compacta (SNpc) and the presence of intracellular alpha-synuclein protein aggregates called Lewy bodies. The SNpc projects to the striatum (caudate and putamen) via the nigrostriatal pathway, providing dopaminergic input essential for smooth, coordinated voluntary movement. Loss of approximately 60-80% of dopaminergic neurons occurs before motor symptoms manifest clinically, indicating a prolonged preclinical phase.\n\nAlpha-synuclein is a presynaptic protein that normally facilitates synaptic vesicle trafficking. In PD, misfolded alpha-synuclein aggregates into toxic oligomers and fibrils that propagate in a prion-like fashion from cell to cell, following the Braak staging hypothesis: beginning in the olfactory bulb and dorsal motor nucleus of the vagus (stages 1-2, explaining early hyposmia and constipation), ascending to the brainstem and midbrain (stages 3-4, motor symptoms), and eventually reaching the neocortex (stages 5-6, cognitive decline and dementia).\n\nThe basal ganglia motor circuit involves a balance between the direct pathway (facilitating movement, mediated by D1 receptors) and the indirect pathway (inhibiting movement, mediated by D2 receptors). Dopamine depletion tips the balance toward the indirect pathway, producing the cardinal motor features: resting tremor (4-6 Hz, pill-rolling), rigidity (cogwheel or lead-pipe), bradykinesia (slowness of movement — the most disabling feature), and postural instability (typically a later feature). Non-motor symptoms — depression, REM sleep behavior disorder, autonomic dysfunction (orthostatic hypotension, constipation, urinary urgency), cognitive impairment — often precede or accompany motor manifestations."
    },
    riskFactors: [
      "Age >60 years (strongest risk factor; incidence increases with age)",
      "Male sex (1.5:1 male-to-female ratio)",
      "Family history (5-10% have monogenic forms: LRRK2, SNCA, PARK2/Parkin, PINK1, GBA mutations)",
      "Pesticide and herbicide exposure (paraquat, rotenone)",
      "Head trauma/traumatic brain injury",
      "Rural living and well-water consumption",
      "Inverse association with smoking and caffeine (epidemiologic observation, NOT protective recommendations)",
      "GBA (glucocerebrosidase) gene mutations — most common genetic risk factor for PD"
    ],
    diagnostics: [
      "Clinical diagnosis based on UK Brain Bank criteria: bradykinesia plus at least one of resting tremor, muscular rigidity, or postural instability (not caused by visual/vestibular/proprioceptive dysfunction)",
      "Apply Hoehn and Yahr staging: Stage 1 (unilateral), Stage 2 (bilateral without balance impairment), Stage 3 (bilateral with postural instability), Stage 4 (severe disability but able to stand/walk), Stage 5 (wheelchair-bound or bedridden)",
      "Assess for non-motor symptoms: REM sleep behavior disorder, anosmia/hyposmia, constipation, depression, cognitive impairment",
      "Order brain MRI primarily to exclude structural lesions, NPH, or vascular parkinsonism (MRI is typically normal in PD)",
      "Consider DaTscan (dopamine transporter SPECT imaging) to differentiate PD from essential tremor or drug-induced parkinsonism when diagnosis is uncertain",
      "Screen for depression (GDS or PHQ-9), cognitive impairment (MoCA — more sensitive than MMSE for PD cognition), and orthostatic hypotension (lying-to-standing BP)",
      "Review medication list to exclude drug-induced parkinsonism (metoclopramide, prochlorperazine, haloperidol, risperidone)",
      "Assess swallowing function — dysphagia evaluation if symptoms present (aspiration pneumonia is a leading cause of death in PD)"
    ],
    management: [
      "Initiate carbidopa-levodopa (Sinemet) as the gold standard for motor symptoms: start 25/100 mg TID, titrate to symptom control",
      "Prescribe dopamine agonist (pramipexole 0.125 mg TID or ropinirole 0.25 mg TID) as initial monotherapy in younger patients (<65) to delay levodopa motor complications",
      "Add MAO-B inhibitor (rasagiline 1 mg daily or selegiline 5 mg BID) for mild symptoms or as adjunct to levodopa",
      "Add COMT inhibitor (entacapone 200 mg with each levodopa dose, or opicapone 50 mg daily) for wearing-off phenomenon to extend levodopa duration",
      "Manage wearing-off: increase levodopa frequency (smaller, more frequent doses), add entacapone, or add dopamine agonist",
      "Manage dyskinesias: reduce individual levodopa dose (increase frequency), add amantadine 100-200 mg BID (NMDA antagonist that reduces dyskinesias)",
      "Refer for deep brain stimulation (DBS) evaluation for motor fluctuations or tremor refractory to optimized medical therapy (ideally Hoehn-Yahr stage 2-4 with clear levodopa responsiveness)",
      "Implement fall prevention program: physical therapy, home safety assessment, occupational therapy, exercise (tai chi demonstrated to improve balance)",
      "Manage dysphagia: speech-language pathology referral, modified diet textures, upright positioning during meals; PEG tube consideration in advanced disease"
    ],
    signs: {
      left: [
        "Unilateral resting tremor with preserved function (Hoehn-Yahr Stage 1)",
        "Mild bradykinesia not impacting daily activities",
        "Micrographia and reduced arm swing on affected side",
        "Hyposmia or constipation as early non-motor signs"
      ],
      right: [
        "Severe bilateral motor symptoms with postural instability and frequent falls (Hoehn-Yahr Stage 3-4)",
        "Motor fluctuations: wearing-off, on-off phenomena, freezing of gait",
        "Levodopa-induced dyskinesias (peak-dose choreiform movements)",
        "PD dementia, psychosis (visual hallucinations), or severe autonomic failure"
      ]
    },
    medications: [
      {
        name: "Carbidopa-Levodopa (Sinemet)",
        type: "Dopamine Precursor + Decarboxylase Inhibitor",
        action: "Levodopa crosses the blood-brain barrier and is converted to dopamine by aromatic L-amino acid decarboxylase (AADC) in surviving dopaminergic neurons; carbidopa inhibits peripheral AADC, preventing peripheral conversion and reducing nausea while increasing CNS bioavailability",
        sideEffects: "Nausea (mitigated by taking with food but NOT high-protein meals), orthostatic hypotension, somnolence, dyskinesias (with long-term use), wearing-off phenomenon, hallucinations (especially in elderly)",
        contra: "Concurrent non-selective MAOIs (hypertensive crisis), narrow-angle glaucoma, undiagnosed skin lesions (may activate melanoma)",
        pearl: "Gold standard for PD motor symptoms. Avoid high-protein meals around dosing (amino acids compete with levodopa for intestinal absorption and BBB transport). After 5-10 years, most patients develop motor complications: wearing-off (end-of-dose deterioration) and dyskinesias (peak-dose involuntary movements). This 'levodopa honeymoon' period ending is NOT drug tolerance but reflects progressive neurodegeneration."
      },
      {
        name: "Pramipexole (Mirapex)",
        type: "Non-Ergot Dopamine Agonist (D2/D3 preferring)",
        action: "Directly stimulates postsynaptic dopamine D2 and D3 receptors in the striatum, bypassing the degenerating presynaptic neuron; longer half-life than levodopa provides more continuous dopaminergic stimulation",
        sideEffects: "Somnolence and sudden sleep attacks (warn about driving), nausea, orthostatic hypotension, hallucinations, impulse control disorders (pathological gambling, hypersexuality, compulsive shopping/eating — 15-20% prevalence)",
        contra: "Severe renal impairment (renally cleared — dose adjust for CrCl <50), caution with other sedating medications",
        pearl: "Screen for impulse control disorders (ICDs) at every visit — patients may not voluntarily report compulsive gambling, shopping, or hypersexuality. ICDs are dose-dependent and reversible with dose reduction or discontinuation. Preferred as initial monotherapy in patients <65 to delay levodopa motor complications. Sudden discontinuation can cause dopamine agonist withdrawal syndrome (anxiety, panic, dysphoria)."
      }
    ],
    pearls: [
      "Carbidopa-levodopa remains the most effective treatment for PD motor symptoms after 50+ years — there is no evidence that delaying levodopa initiation prevents motor complications, as these are driven by disease progression, not cumulative drug exposure",
      "Impulse control disorders (pathological gambling, hypersexuality, compulsive shopping/eating) affect 15-20% of patients on dopamine agonists — the NP must screen at every visit as patients often do not voluntarily report these behaviors",
      "Drug-induced parkinsonism (metoclopramide, prochlorperazine, typical antipsychotics) is reversible with medication discontinuation — if an antipsychotic is needed in a PD patient, use quetiapine or clozapine (lowest D2 receptor affinity)",
      "REM sleep behavior disorder (acting out dreams, bed partner injuries) often precedes PD motor symptoms by years to decades and is a strong prodromal marker — the NP should monitor these patients longitudinally for PD development",
      "High-protein meals should be avoided around carbidopa-levodopa dosing because large neutral amino acids compete with levodopa for intestinal absorption and blood-brain barrier transport via the LAT1 transporter"
    ],
    quiz: [
      {
        question: "A 72-year-old man on carbidopa-levodopa 25/100 TID for 7 years reports his symptoms return 2 hours before his next dose with increased tremor, stiffness, and slowness. What is this phenomenon and the most appropriate initial management?",
        options: [
          "Drug tolerance — increase the total daily dose of levodopa significantly",
          "Wearing-off phenomenon — add entacapone 200 mg with each levodopa dose or increase dosing frequency with smaller individual doses",
          "On-off phenomenon — switch to a dopamine agonist monotherapy",
          "Disease progression — initiate deep brain stimulation referral immediately"
        ],
        correct: 1,
        rationale: "Wearing-off (end-of-dose deterioration) occurs when levodopa's clinical effect wears off before the next scheduled dose, causing predictable symptom return. First-line strategies include adding a COMT inhibitor (entacapone) to extend levodopa's half-life, or giving smaller, more frequent doses. This is distinct from the unpredictable on-off phenomenon. DBS is reserved for refractory motor fluctuations after medical optimization."
      },
      {
        question: "A 58-year-old woman on pramipexole 1 mg TID for early PD is brought in by her husband who reports she has spent $40,000 online shopping in the past month and has been making sexually inappropriate comments. What should the NP do?",
        options: [
          "Continue pramipexole and refer for psychiatric evaluation",
          "Recognize impulse control disorder secondary to dopamine agonist — reduce and taper pramipexole while monitoring for withdrawal syndrome, and compensate with levodopa if needed",
          "Add an SSRI to manage the behavioral changes",
          "Increase pramipexole as the symptoms suggest undertreated PD"
        ],
        correct: 1,
        rationale: "Impulse control disorders (compulsive shopping, hypersexuality, pathological gambling, binge eating) are a well-documented side effect of dopamine agonists, occurring in 15-20% of patients, mediated by D3 receptor stimulation in the reward circuitry. Management requires tapering the dopamine agonist (abrupt discontinuation risks withdrawal syndrome with anxiety, panic, dysphoria) and substituting levodopa for motor symptom control. The behaviors are dose-dependent and typically resolve with dose reduction."
      }
    ]
  },

  "np-meningitis-management": {
    title: "Meningitis: Diagnosis and Management",
    cellular: {
      title: "CNS Infection Pathophysiology and Meningeal Inflammation",
      content: "Meningitis is inflammation of the meninges (pia mater and arachnoid) surrounding the brain and spinal cord. Bacterial meningitis is a medical emergency with mortality rates of 10-30% even with treatment. The most common causative organisms vary by age: neonates (Group B Streptococcus, E. coli, Listeria monocytogenes), children/adolescents (Neisseria meningitidis, Streptococcus pneumoniae), adults (S. pneumoniae most common, N. meningitidis), and elderly/immunocompromised (S. pneumoniae, Listeria, gram-negative bacilli).\n\nPathogenesis involves nasopharyngeal colonization → bacteremia → crossing the blood-brain barrier (BBB). Bacteria multiply rapidly in CSF because the subarachnoid space lacks complement, immunoglobulins, and phagocytic cells. Bacterial cell wall components (lipopolysaccharide in gram-negatives, lipoteichoic acid in gram-positives) trigger intense inflammatory response: cytokine release (TNF-alpha, IL-1, IL-6), BBB disruption, neutrophilic infiltration, cerebral edema (vasogenic, cytotoxic, and interstitial), and elevated intracranial pressure. This inflammatory cascade, rather than direct bacterial toxicity, causes most of the neurological damage.\n\nViral (aseptic) meningitis is more common and typically self-limited. Enteroviruses (coxsackievirus, echovirus) account for 85% of viral cases. HSV-2 causes recurrent lymphocytic meningitis (Mollaret meningitis). Fungal meningitis (Cryptococcus neoformans) occurs primarily in immunocompromised hosts (HIV with CD4 <100). Tuberculous meningitis has an insidious course with basilar meningitis pattern and cranial nerve palsies."
    },
    riskFactors: [
      "Extremes of age: neonates and adults >65 years",
      "Immunocompromised state: HIV/AIDS, asplenia, complement deficiencies, immunosuppressive therapy",
      "Close-contact living: college dormitories, military barracks, daycare centers",
      "Basilar skull fracture with CSF leak (recurrent pneumococcal meningitis)",
      "Recent neurosurgery or CSF shunt placement",
      "Cochlear implants (increased risk of pneumococcal meningitis)",
      "Lack of vaccination (MCV4, PCV13/PPSV23, Hib)",
      "Alcoholism and chronic liver disease",
      "Sickle cell disease (functional asplenia)"
    ],
    diagnostics: [
      "Perform lumbar puncture (LP) as the definitive diagnostic test — do NOT delay empiric antibiotics if LP will be delayed for CT imaging",
      "CSF analysis — bacterial: elevated opening pressure (>20 cm H₂O), WBC >1000 with neutrophil predominance (>80%), protein elevated (>45 mg/dL, often >100), glucose low (<40 mg/dL or CSF:serum ratio <0.4), positive Gram stain (60-90% sensitivity)",
      "CSF analysis — viral: normal to mildly elevated opening pressure, WBC 10-500 with lymphocyte predominance, protein normal to mildly elevated, glucose normal, Gram stain negative",
      "CSF analysis — fungal (Cryptococcus): lymphocytic pleocytosis, elevated protein, low glucose, positive India ink (50-75%), cryptococcal antigen (>95% sensitivity)",
      "Order CT head BEFORE LP only if: altered mental status, focal neurological deficits, papilledema, seizures, or immunocompromised state (rule out mass lesion/elevated ICP)",
      "Order blood cultures x2 BEFORE antibiotics (positive in 50-80% of bacterial meningitis)",
      "CSF multiplex PCR panel (BioFire FilmArray) for rapid pathogen identification",
      "Order CRP and procalcitonin to help differentiate bacterial from viral etiology",
      "Assess for Kernig sign (pain/resistance with knee extension when hip flexed at 90°) and Brudzinski sign (involuntary hip/knee flexion with passive neck flexion) — sensitivity 5-30% but specificity >90%"
    ],
    management: [
      "Administer empiric antibiotics IMMEDIATELY — do NOT delay for CT or LP (door-to-antibiotic time <60 minutes critical for outcomes)",
      "Empiric regimen by age: neonates — ampicillin + gentamicin (or cefotaxime); 1 month-50 years — vancomycin + ceftriaxone (±ampicillin if Listeria risk); >50 years — vancomycin + ceftriaxone + ampicillin",
      "Administer dexamethasone 0.15 mg/kg IV q6h x4 days BEFORE or WITH first antibiotic dose (reduces mortality and neurological sequelae in pneumococcal meningitis — MUST be given before/with antibiotics, not after)",
      "Narrow antibiotic therapy based on CSF culture and sensitivity results",
      "Administer chemoprophylaxis to close contacts for N. meningitidis: rifampin 600 mg q12h x2 days, OR ciprofloxacin 500 mg single dose, OR ceftriaxone 250 mg IM single dose (preferred in pregnancy)",
      "Monitor for complications: cerebral edema, seizures, hydrocephalus, cranial nerve palsies (hearing loss from CN VIII), SIADH, subdural effusions",
      "Manage elevated ICP: elevate head of bed 30°, hyperosmolar therapy (mannitol or hypertonic saline), avoid hyperthermia",
      "Viral meningitis: supportive care (analgesics, antipyretics, IV fluids); acyclovir if HSV meningitis suspected",
      "Waterhouse-Friderichsen syndrome (bilateral adrenal hemorrhage from meningococcal sepsis): emergent IV hydrocortisone 100 mg, aggressive fluid resuscitation, vasopressors"
    ],
    signs: {
      left: [
        "Viral meningitis: gradual onset headache, low-grade fever, photophobia, neck stiffness with intact sensorium",
        "Alert with mild meningismus, no focal neurological deficits",
        "CSF with lymphocytic pleocytosis, normal glucose",
        "Improving symptoms within 48-72 hours with supportive care"
      ],
      right: [
        "Bacterial meningitis: acute onset high fever, severe headache, nuchal rigidity, altered mental status",
        "Petechial or purpuric rash (meningococcemia — N. meningitidis)",
        "Seizures, focal neurological deficits, signs of elevated ICP",
        "Waterhouse-Friderichsen syndrome: DIC, purpura fulminans, hemodynamic collapse"
      ]
    },
    medications: [
      {
        name: "Ceftriaxone (Rocephin)",
        type: "Third-Generation Cephalosporin",
        action: "Inhibits bacterial cell wall synthesis by binding PBPs; excellent CSF penetration when meninges are inflamed; broad-spectrum coverage against S. pneumoniae, N. meningitidis, H. influenzae, and most gram-negative organisms",
        sideEffects: "Diarrhea, biliary sludging (pseudolithiasis), injection site pain, cross-reactivity with penicillin allergy (1-2% risk)",
        contra: "Neonates with hyperbilirubinemia (displaces bilirubin from albumin — use cefotaxime instead), known cephalosporin anaphylaxis",
        pearl: "Meningitis dose: 2 g IV q12h in adults (higher than standard dosing to achieve adequate CSF levels). First-line empiric agent combined with vancomycin for suspected bacterial meningitis. Also the preferred single-dose chemoprophylaxis for meningococcal close contacts (250 mg IM) and is safe in pregnancy (unlike ciprofloxacin)."
      },
      {
        name: "Dexamethasone (adjunctive)",
        type: "Glucocorticoid Anti-inflammatory",
        action: "Suppresses the inflammatory cascade in the subarachnoid space by inhibiting cytokine production (TNF-alpha, IL-1), reducing BBB permeability, cerebral edema, and intracranial pressure",
        sideEffects: "Hyperglycemia, GI bleeding risk, immunosuppression (may mask clinical improvement), delayed CSF sterilization",
        contra: "Not recommended in neonatal meningitis or viral meningitis; reduced benefit if antibiotics have already been administered",
        pearl: "The de Gans trial (2002) showed dexamethasone reduces mortality (from 15% to 7%) and neurological sequelae (especially hearing loss) in PNEUMOCOCCAL meningitis. CRITICAL TIMING: must be given BEFORE or WITH first antibiotic dose, not after — if antibiotics were already started >1 hour ago, dexamethasone benefit is lost. Dose: 0.15 mg/kg IV q6h for 4 days."
      }
    ],
    pearls: [
      "Never delay empiric antibiotics for CT scan or lumbar puncture — obtain blood cultures and start vancomycin + ceftriaxone (±ampicillin) immediately if bacterial meningitis is suspected; every hour of antibiotic delay increases mortality by 3-7%",
      "Dexamethasone must be given BEFORE or WITH the first dose of antibiotics to reduce mortality and neurological sequelae in pneumococcal meningitis — if antibiotics have already been administered, the anti-inflammatory benefit is lost",
      "The classic triad of fever, neck stiffness, and altered mental status is present in only 44% of bacterial meningitis cases — the clinician should maintain high suspicion with any two of: headache, fever, neck stiffness, altered mental status",
      "CT before LP is only required when specific risk factors for herniation are present: altered mental status, focal neurological deficits, papilledema, recent seizure, immunocompromised state — routine CT delays antibiotic administration and is not needed in most cases",
      "Chemoprophylaxis for N. meningitidis close contacts (household members, kissing contacts, anyone sharing respiratory secretions) should be administered within 24 hours of case identification — ciprofloxacin 500 mg PO x1 dose or ceftriaxone 250 mg IM x1 dose are preferred over rifampin due to simpler dosing"
    ],
    quiz: [
      {
        question: "A 22-year-old college student presents with sudden onset high fever, severe headache, photophobia, and a petechial rash on the trunk and extremities. GCS is 13. CT scan is not immediately available. What is the most critical first action?",
        options: [
          "Wait for CT scan before proceeding with lumbar puncture",
          "Obtain blood cultures and immediately administer IV vancomycin + ceftriaxone + dexamethasone",
          "Obtain a lumbar puncture before starting any treatment",
          "Administer IV acyclovir for suspected HSV encephalitis"
        ],
        correct: 1,
        rationale: "This presentation is classic for meningococcal meningitis (fever, petechial rash, meningismus in a college-age patient). Every hour of antibiotic delay increases mortality by 3-7%. Blood cultures should be drawn immediately, then empiric vancomycin + ceftriaxone with dexamethasone (before or with antibiotics) started without waiting for CT or LP. CT is indicated here due to reduced GCS, but antibiotics must not be delayed. Chemoprophylaxis for close contacts is also required."
      },
      {
        question: "CSF results from a 68-year-old with fever and confusion show: WBC 2,200 (92% neutrophils), protein 320 mg/dL, glucose 18 mg/dL (serum glucose 120), Gram stain shows gram-positive diplococci. What is the most likely pathogen and appropriate definitive therapy?",
        options: [
          "Neisseria meningitidis — penicillin G",
          "Streptococcus pneumoniae — IV ceftriaxone (narrow from empiric vancomycin + ceftriaxone once sensitivity confirmed)",
          "Listeria monocytogenes — ampicillin",
          "Haemophilus influenzae — chloramphenicol"
        ],
        correct: 1,
        rationale: "Gram-positive diplococci in CSF with high neutrophilic pleocytosis, high protein, and very low glucose is diagnostic of S. pneumoniae meningitis — the most common cause of bacterial meningitis in adults. Definitive therapy is ceftriaxone (or penicillin G if fully susceptible). Vancomycin is continued empirically until susceptibilities confirm ceftriaxone sensitivity due to increasing pneumococcal resistance. N. meningitidis appears as gram-negative diplococci. Listeria appears as gram-positive rods."
      }
    ]
  },

  "np-aaa-management": {
    title: "Abdominal Aortic Aneurysm: Screening and Management",
    cellular: {
      title: "Aortic Wall Degeneration and Aneurysm Formation",
      content: "An abdominal aortic aneurysm (AAA) is defined as a focal dilation of the abdominal aorta to ≥3.0 cm (normal infrarenal aorta diameter is 1.5-2.5 cm) or >50% increase over normal diameter. The pathogenesis involves degradation of the aortic media through an imbalance of matrix metalloproteinases (MMP-2, MMP-9) and their tissue inhibitors (TIMPs). Elastin fragmentation and collagen degradation weaken the structural integrity of the aortic wall, leading to progressive dilation under systolic pressure.\n\nChronic transmural inflammation drives aneurysm progression: infiltrating macrophages and lymphocytes release proteolytic enzymes and inflammatory cytokines (TNF-alpha, IL-1beta, IL-6) that perpetuate extracellular matrix destruction. Oxidative stress and smooth muscle cell apoptosis further thin the media. The infrarenal aorta is preferentially affected due to lower elastin content, absence of vasa vasorum (relying on luminal diffusion for nutrition), and reflected wave hemodynamics that increase wall stress.\n\nThe Law of Laplace governs rupture risk: wall tension = (pressure × radius) / (2 × wall thickness). As the aneurysm enlarges, wall tension increases exponentially, explaining the dramatically higher rupture risk at larger diameters. Annual rupture risk by size: <4.0 cm = 0%, 4.0-4.9 cm = 0.5-5%, 5.0-5.9 cm = 3-15%, 6.0-6.9 cm = 10-20%, ≥7.0 cm = 20-40%. Ruptured AAA carries 80-90% mortality, with 50% dying before reaching the hospital."
    },
    riskFactors: [
      "Male sex (6:1 male-to-female ratio; prevalence 5-10% in men >65)",
      "Smoking — strongest modifiable risk factor (90% of AAA patients have smoking history; risk increases with pack-years)",
      "Age >65 years",
      "Hypertension (increases wall stress accelerating dilation)",
      "Family history of AAA (first-degree relative increases risk 2-fold)",
      "Atherosclerotic disease (PAD, CAD, cerebrovascular disease)",
      "Connective tissue disorders: Marfan syndrome, Ehlers-Danlos type IV, Loeys-Dietz syndrome",
      "COPD (shares smoking etiology, matrix metalloproteinase activation)",
      "Caucasian race (higher prevalence than African American or Asian populations)"
    ],
    diagnostics: [
      "USPSTF screening recommendation: one-time abdominal ultrasound for men aged 65-75 who have EVER smoked (Grade B recommendation)",
      "No routine screening recommended for women or never-smokers (may consider if family history)",
      "Abdominal ultrasound is the primary screening and surveillance tool (sensitivity 95-100% for AAA detection, non-invasive, no radiation)",
      "CT angiography (CTA) is the gold standard for preoperative planning — defines aneurysm morphology, extent, relationship to renal arteries, iliac involvement",
      "Surveillance intervals by size: 2.6-2.9 cm rescreen at 10 years, 3.0-3.9 cm every 3 years, 4.0-4.9 cm every 12 months, 5.0-5.4 cm every 6 months",
      "Physical exam: pulsatile, non-tender abdominal mass (sensitivity only 30-75%, higher with larger aneurysms; limited by body habitus)",
      "Assess for coexisting PAD (ankle-brachial index), CAD, and carotid stenosis — AAA is a marker of systemic atherosclerosis",
      "Immediate CT or bedside ultrasound if rupture suspected (do NOT delay for hemodynamically unstable patients)"
    ],
    management: [
      "Aggressive cardiovascular risk factor modification: smoking cessation (most important — slows growth rate), blood pressure control (target <130/80), statin therapy",
      "Surveillance for small aneurysms (3.0-5.4 cm) — no survival benefit from early surgical repair (UK Small Aneurysm Trial, ADAM trial)",
      "Surgical repair threshold: ≥5.5 cm in men (≥5.0 cm in women), rapid expansion (>1 cm/year or >0.5 cm in 6 months), or symptomatic aneurysm",
      "Endovascular aneurysm repair (EVAR) preferred for suitable anatomy: lower perioperative mortality (1-2% vs 4-5% open), faster recovery; requires lifelong CT surveillance for endoleak",
      "Open surgical repair for unfavorable anatomy (short/angulated neck, iliac access issues), younger patients (better long-term durability without reintervention), or ruptured AAA when EVAR not feasible",
      "Emergency management of ruptured AAA: immediate vascular surgery consultation, permissive hypotension (SBP 70-90 mmHg to maintain consciousness), massive transfusion protocol, emergent OR",
      "Beta-blockers (no proven benefit in slowing AAA growth, but treat concurrent hypertension and reduce wall stress)",
      "Screen first-degree relatives of AAA patients (siblings have 18% prevalence)",
      "Post-repair follow-up: EVAR requires CT angiography at 1, 6, 12 months then annually (endoleak surveillance); open repair requires periodic ultrasound"
    ],
    signs: {
      left: [
        "Asymptomatic AAA discovered incidentally on imaging",
        "Small aneurysm (3.0-4.4 cm) with stable growth rate",
        "No tenderness on palpation",
        "Well-controlled cardiovascular risk factors"
      ],
      right: [
        "Ruptured AAA classic triad: sudden severe abdominal or back pain, hypotension/shock, pulsatile abdominal mass (triad present in <50%)",
        "Symptomatic non-ruptured: new or worsening abdominal/back/flank pain with known AAA (impending rupture)",
        "Rapid expansion (>1 cm/year)",
        "Distal embolization: blue toe syndrome, trash foot from atheroemboli"
      ]
    },
    medications: [
      {
        name: "Atorvastatin (or Rosuvastatin)",
        type: "HMG-CoA Reductase Inhibitor (Statin)",
        action: "Reduces hepatic cholesterol synthesis, upregulates LDL receptors; provides pleiotropic anti-inflammatory effects by reducing MMP activity, CRP, and endothelial inflammation — may modestly slow AAA growth rate",
        sideEffects: "Myalgia, elevated transaminases, rhabdomyolysis (rare), new-onset diabetes (dose-dependent)",
        contra: "Active liver disease, pregnancy, concurrent strong CYP3A4 inhibitors (for atorvastatin)",
        pearl: "All AAA patients should be on statin therapy for cardiovascular risk reduction (AAA is a coronary risk equivalent). Some evidence suggests statins may reduce AAA growth rate through anti-inflammatory and MMP-inhibitory effects, but this is not the primary indication. Target high-intensity statin therapy (atorvastatin 40-80 mg or rosuvastatin 20-40 mg)."
      },
      {
        name: "Antihypertensive Therapy (ACE inhibitor/ARB preferred)",
        type: "Renin-Angiotensin System Inhibitor",
        action: "Reduces systemic blood pressure and aortic wall stress; ACE inhibitors may have additional protective effects through reduced angiotensin II-mediated MMP activation and vascular inflammation",
        sideEffects: "Cough (ACEi), hyperkalemia, acute kidney injury (monitor Cr/K+ at 1-2 weeks), angioedema (ACEi)",
        contra: "Bilateral renal artery stenosis, pregnancy, angioedema history (for ACEi), hyperkalemia >5.5",
        pearl: "Target BP <130/80 in AAA patients. Some observational data suggest ACE inhibitors specifically may slow AAA growth rate through angiotensin II-mediated pathways (reduced MMP expression), though this has not been confirmed in RCTs. Beta-blockers were historically thought to slow AAA growth but the ATAT trial showed no benefit — they remain useful for hypertension and perioperative cardiac protection."
      }
    ],
    pearls: [
      "USPSTF recommends ONE-TIME screening abdominal ultrasound for all men aged 65-75 who have ever smoked — this is a high-yield screening recommendation for NP boards and clinical practice",
      "The classic ruptured AAA triad of abdominal/back pain, hypotension, and pulsatile abdominal mass is present in fewer than 50% of cases — the clinician must maintain high suspicion in any elderly male smoker presenting with sudden abdominal or back pain and hemodynamic instability",
      "Smoking cessation is the ONLY intervention proven to slow AAA growth rate — the NP should aggressively counsel and treat tobacco dependence in all AAA patients",
      "Small AAA (3.0-5.4 cm) should be monitored with serial ultrasound, NOT repaired electively — the UK Small Aneurysm Trial and ADAM trial demonstrated no survival benefit from early surgical repair of aneurysms <5.5 cm",
      "EVAR has lower perioperative mortality than open repair but requires lifelong CT surveillance for endoleaks (persistent blood flow into the aneurysm sac) and has higher reintervention rates — the NP must ensure patients understand the commitment to follow-up imaging"
    ],
    quiz: [
      {
        question: "A 68-year-old male former smoker (40 pack-years, quit 5 years ago) presents for a routine health exam. He has never been screened for AAA. His blood pressure is 142/88 and he has a family history of AAA (brother died of ruptured AAA at age 72). What screening should the NP order?",
        options: [
          "No screening needed since he quit smoking 5 years ago",
          "One-time screening abdominal ultrasound per USPSTF guidelines",
          "CT angiography of the abdomen and pelvis",
          "Annual abdominal ultrasound for the next 5 years"
        ],
        correct: 1,
        rationale: "USPSTF gives a Grade B recommendation for one-time screening abdominal ultrasound in men aged 65-75 who have EVER smoked. This patient meets all criteria: male, 68 years old, history of smoking. His family history of AAA further strengthens the indication. Ultrasound is the appropriate screening modality (not CT). If the ultrasound is normal, no further screening is needed."
      },
      {
        question: "A 74-year-old man with a known 5.2 cm AAA being monitored with serial ultrasounds presents with new-onset constant, dull lower back pain radiating to the left flank. Vital signs: BP 108/72, HR 98. What is the most appropriate immediate action?",
        options: [
          "Order MRI of the lumbar spine to evaluate for disc disease",
          "Treat as musculoskeletal pain with NSAIDs and follow up in 1 week",
          "Obtain emergent CT angiography or bedside ultrasound and activate vascular surgery consultation — suspect impending or contained rupture",
          "Increase AAA surveillance to every 3 months"
        ],
        correct: 2,
        rationale: "New-onset back/flank pain in a patient with a known near-threshold AAA (5.2 cm) combined with relative hypotension (BP 108/72) and tachycardia (HR 98) is an impending or contained AAA rupture until proven otherwise. This is a surgical emergency. Emergent imaging (CT angiography or bedside ultrasound if unstable) and immediate vascular surgery consultation are required. Do not waste time with outpatient workup or dismiss as musculoskeletal pain — ruptured AAA has 80-90% mortality."
      }
    ]
  },

  "np-thalassemia-management": {
    title: "Thalassemia: Pathophysiology and Management",
    cellular: {
      title: "Globin Chain Imbalance and Ineffective Erythropoiesis",
      content: "Thalassemias are a group of inherited hemoglobin disorders characterized by reduced or absent synthesis of one or more globin chains, leading to imbalanced globin production, ineffective erythropoiesis, and chronic hemolytic anemia. Normal adult hemoglobin (HbA) consists of two alpha and two beta globin chains (α2β2). Alpha-thalassemia results from gene deletions on chromosome 16 (four alpha-globin genes total, two per chromosome), while beta-thalassemia results from point mutations on chromosome 11 affecting beta-globin gene expression.\n\nAlpha-thalassemia severity depends on the number of deleted alpha genes: silent carrier (1 deletion, -α/αα, clinically normal), alpha-thalassemia trait (2 deletions, either -α/-α cis or -α/αα trans, mild microcytic anemia), HbH disease (3 deletions, --/-α, moderate hemolytic anemia with HbH [β4 tetramers] on electrophoresis), and hydrops fetalis/Hb Bart's (4 deletions, --/--, incompatible with life — Hb Bart's [γ4] has extreme oxygen affinity and cannot deliver O2 to tissues).\n\nBeta-thalassemia is classified as minor/trait (one defective beta gene, β/β+ or β/β0, mild microcytic anemia), intermedia (moderate disease, variable genotypes), and major (Cooley anemia, β0/β0 or severe β+/β0, transfusion-dependent). In beta-thalassemia major, excess unpaired alpha chains precipitate within erythroid precursors, causing oxidative membrane damage, premature cell death in the bone marrow (ineffective erythropoiesis), and extravascular hemolysis in the spleen. Compensatory erythropoietic expansion causes bone marrow hyperplasia (chipmunk facies, frontal bossing, hair-on-end skull X-ray), extramedullary hematopoiesis (hepatosplenomegaly), and massively increased intestinal iron absorption (via suppressed hepcidin from elevated erythroferrone)."
    },
    riskFactors: [
      "Mediterranean descent (beta-thalassemia prevalent in Greek, Italian, Middle Eastern, North African populations)",
      "Southeast Asian descent (alpha-thalassemia, especially cis deletions — --/αα — which carry risk for hydrops fetalis in offspring)",
      "Sub-Saharan African descent (alpha-thalassemia trait common, typically trans deletions — -α/-α — lower risk for HbH/hydrops)",
      "Indian subcontinent and South Asian descent",
      "Both parents carrying thalassemia trait (25% risk of thalassemia major per pregnancy)",
      "Consanguinity increases risk of homozygous inheritance",
      "Co-inheritance with other hemoglobinopathies (HbS/beta-thalassemia, HbE/beta-thalassemia)"
    ],
    diagnostics: [
      "Order CBC with red cell indices: microcytic (MCV <80 fL) hypochromic (MCH <27 pg) anemia with elevated RBC count — distinguish from iron deficiency",
      "Calculate Mentzer index: MCV/RBC count — <13 suggests thalassemia trait, >13 suggests iron deficiency (useful screening but not definitive)",
      "Order hemoglobin electrophoresis: beta-thalassemia trait shows elevated HbA2 (>3.5%, typically 4-8%) and may show elevated HbF; HbH disease shows HbH bands (β4 tetramers)",
      "Order iron studies: ferritin, serum iron, TIBC, transferrin saturation — CRITICAL to differentiate from iron deficiency (thalassemia trait has normal/elevated iron stores; iron deficiency has low ferritin, high TIBC)",
      "Order peripheral blood smear: target cells, microcytes, basophilic stippling, nucleated RBCs (in severe forms)",
      "Order genetic testing (alpha-globin gene analysis by PCR or MLPA) for definitive alpha-thalassemia diagnosis (electrophoresis is often normal in alpha-thal trait)",
      "Screen partners of thalassemia trait carriers for genetic counseling before conception",
      "In transfusion-dependent patients: monitor serum ferritin every 3 months (target <1000 ng/mL), liver iron concentration by MRI R2* or T2* (target <7 mg/g), cardiac T2* MRI annually (T2* <20 ms indicates cardiac iron loading)"
    ],
    management: [
      "Thalassemia trait: no treatment needed — reassurance, genetic counseling, avoid misdiagnosis as iron deficiency and unnecessary iron supplementation",
      "Transfusion-dependent thalassemia (TDT/beta-thalassemia major): chronic transfusion program to maintain pre-transfusion Hb 9-10.5 g/dL, suppressing ineffective erythropoiesis and its complications",
      "Iron chelation therapy for transfusion iron overload (each unit of RBCs contains ~250 mg iron): deferoxamine (Desferal) SC/IV infusion 8-12 hours daily, deferasirox (Exjade/Jadenu) oral daily (first-line oral chelator), or deferiprone (Ferriprox) oral TID",
      "Monitor for iron overload organ damage: hepatic (cirrhosis, hepatocellular carcinoma), cardiac (cardiomyopathy — leading cause of death), endocrine (diabetes, hypogonadism, hypothyroidism, growth failure)",
      "Hydroxyurea to increase HbF production in selected patients with beta-thalassemia intermedia (HbF partially compensates for absent beta chains)",
      "Luspatercept (Reblozyl) — activin receptor ligand trap — FDA-approved for TDT to reduce transfusion burden",
      "Splenectomy for hypersplenism with increasing transfusion requirements (post-splenectomy: vaccinate PCV13/PPSV23, MCV4, Hib; lifelong penicillin prophylaxis; monitor for thrombocytosis)",
      "Bone marrow transplant (allogeneic HSCT) — only curative option for beta-thalassemia major; best outcomes in young children with HLA-matched sibling donors",
      "Gene therapy (betibeglogene autotemcel, Zynteglo) — FDA-approved for TDT; autologous gene-modified hematopoietic stem cells"
    ],
    signs: {
      left: [
        "Thalassemia trait: mild microcytic anemia (Hb 10-12), often asymptomatic and discovered incidentally",
        "Normal iron studies distinguishing from iron deficiency",
        "Elevated HbA2 (>3.5%) on hemoglobin electrophoresis",
        "Normal RBC count or elevated (key differentiator from iron deficiency)"
      ],
      right: [
        "Thalassemia major: severe anemia (Hb 3-7 g/dL without transfusion), failure to thrive by 6 months of age",
        "Skeletal changes: frontal bossing, maxillary hyperplasia (chipmunk facies), hair-on-end skull X-ray",
        "Massive hepatosplenomegaly from extramedullary hematopoiesis",
        "Iron overload complications: bronze skin, hepatic cirrhosis, cardiomyopathy, endocrinopathies"
      ]
    },
    medications: [
      {
        name: "Deferasirox (Exjade/Jadenu)",
        type: "Oral Iron Chelator (Tridentate)",
        action: "Binds free and tissue-stored ferric iron (Fe3+) in a 2:1 molar ratio, forming a stable complex excreted in feces; reduces hepatic, cardiac, and endocrine iron deposition in transfusion-dependent patients",
        sideEffects: "GI disturbances (nausea, diarrhea, abdominal pain — most common), renal toxicity (proteinuria, increased creatinine — monitor monthly), hepatotoxicity (liver failure reported), GI hemorrhage, auditory/visual disturbances",
        contra: "CrCl <40 mL/min, poor performance status, high-risk MDS, platelet count <50,000, known hepatic or renal impairment",
        pearl: "First-line oral chelator for transfusional iron overload. Jadenu (film-coated) replaced Exjade (dispersible) with better GI tolerability and adherence. Dose: 14-28 mg/kg/day (Jadenu). Monitor serum creatinine and proteinuria monthly, LFTs monthly, ferritin every 3 months, audiology and ophthalmology annually. Target serum ferritin <1000 ng/mL."
      },
      {
        name: "Luspatercept (Reblozyl)",
        type: "Erythroid Maturation Agent (Activin Receptor Ligand Trap)",
        action: "Binds TGF-beta superfamily ligands (GDF11, activin A) that inhibit late-stage erythropoiesis, thereby promoting red cell maturation and reducing ineffective erythropoiesis in the bone marrow",
        sideEffects: "Bone pain, arthralgia, fatigue, headache, dizziness, thromboembolic events",
        contra: "Pregnancy (embryo-fetal toxicity — requires negative pregnancy test and contraception)",
        pearl: "FDA-approved for anemia in adult beta-thalassemia patients requiring regular transfusions. BELIEVE trial showed 21% of patients achieved ≥33% reduction in transfusion burden. SC injection every 3 weeks. Start 1 mg/kg, titrate to 1.25 mg/kg. Offers a transfusion-sparing approach that also reduces iron loading."
      }
    ],
    pearls: [
      "The Mentzer index (MCV/RBC) is a simple bedside tool to differentiate thalassemia trait from iron deficiency: <13 favors thalassemia (many small cells), >13 favors iron deficiency (fewer cells overall) — but it must be confirmed with iron studies and hemoglobin electrophoresis",
      "Never prescribe iron supplementation for thalassemia trait — these patients have normal or elevated iron stores and iron loading can cause organ damage; always confirm iron studies before treating any microcytic anemia with iron",
      "In Southeast Asian patients, the cis deletion form of alpha-thalassemia (--/αα) is common and carries the risk of hydrops fetalis (Hb Bart's) if both parents carry cis deletions — this is a critical genetic counseling point",
      "Cardiac iron overload (assessed by cardiac MRI T2* <20 ms) is the leading cause of death in transfusion-dependent thalassemia — intensive iron chelation with deferiprone ± deferoxamine is recommended for T2* <10 ms",
      "Hemoglobin electrophoresis is normal in alpha-thalassemia trait (1-2 gene deletions) because HbA2 and HbF are not elevated — definitive diagnosis requires genetic testing (PCR-based alpha-globin gene analysis)"
    ],
    quiz: [
      {
        question: "A 25-year-old Greek woman with mild microcytic anemia (Hb 11.2, MCV 68, RBC 5.8 million) is evaluated. Iron studies show normal ferritin (85 ng/mL) and normal TIBC. Hemoglobin electrophoresis shows HbA2 5.2%. What is the diagnosis and appropriate counseling?",
        options: [
          "Iron deficiency anemia — prescribe oral iron supplementation",
          "Beta-thalassemia trait — no treatment needed; counsel regarding genetics and screen partner before conception",
          "Beta-thalassemia major — refer for chronic transfusion program",
          "Sideroblastic anemia — order bone marrow biopsy"
        ],
        correct: 1,
        rationale: "Mild microcytic anemia with elevated RBC count, normal iron studies, and elevated HbA2 (>3.5%) is diagnostic of beta-thalassemia trait. No treatment is needed. The critical counseling point is genetic: if her partner also carries beta-thalassemia trait, each pregnancy has a 25% risk of beta-thalassemia major. Partner screening with CBC and hemoglobin electrophoresis should be recommended before conception."
      },
      {
        question: "A 12-year-old boy with beta-thalassemia major on chronic transfusions has a serum ferritin of 3,200 ng/mL and cardiac MRI T2* of 15 ms. What does this indicate and what is the management priority?",
        options: [
          "Adequate iron chelation — continue current regimen",
          "Severe iron overload with early cardiac iron loading — intensify chelation therapy and monitor cardiac function closely",
          "Normal iron stores for a transfusion-dependent patient — no change needed",
          "Iron deficiency — increase transfusion frequency"
        ],
        correct: 1,
        rationale: "Ferritin >2500 ng/mL and cardiac T2* <20 ms indicate significant iron overload with cardiac iron deposition. Cardiac T2* 15 ms represents early cardiac iron loading (normal >20 ms; <10 ms indicates severe loading with high risk of heart failure). Management requires intensifying chelation therapy — combination chelation (deferiprone + deferoxamine) is recommended for cardiac T2* <20 ms. Cardiac iron overload is the leading cause of death in transfusion-dependent thalassemia."
      }
    ]
  },

  "np-rheumatoid-arthritis-management": {
    title: "Rheumatoid Arthritis & Inflammatory Disease",
    cellular: {
      title: "Autoimmune Synovitis and Joint Destruction",
      content: "Rheumatoid arthritis (RA) is a chronic, systemic autoimmune disease characterized by symmetric inflammatory polyarthritis targeting synovial joints. The pathogenesis begins with loss of immune tolerance to citrullinated self-antigens, leading to production of rheumatoid factor (RF — IgM antibody against the Fc portion of IgG) and anti-citrullinated protein antibodies (anti-CCP/ACPA) years before clinical disease onset (preclinical RA).\n\nThe synovial membrane undergoes dramatic transformation: normally 1-2 cell layers thick, it proliferates into an invasive, tumor-like tissue called pannus. Pannus is composed of hyperplastic fibroblast-like synoviocytes (FLS), macrophages, T cells (CD4+ Th1 and Th17), B cells, and plasma cells. Pro-inflammatory cytokines — particularly TNF-alpha, IL-6, and IL-1 — drive synovial inflammation, angiogenesis, and cartilage/bone destruction. TNF-alpha activates osteoclasts via RANKL upregulation, causing juxta-articular bone erosions. IL-6 drives systemic inflammation (elevated CRP, ESR, anemia of chronic disease) and contributes to fatigue.\n\nThe ACR/EULAR 2010 classification criteria assign points for joint involvement (small vs large joints, symmetric involvement), serology (RF, anti-CCP), acute phase reactants (CRP, ESR), and symptom duration (≥6 weeks), with a score ≥6/10 classifying as definite RA. The treat-to-target (T2T) strategy establishes remission or low disease activity as the treatment goal, with therapy escalated every 3-6 months until the target is achieved."
    },
    riskFactors: [
      "Female sex (3:1 female-to-male ratio)",
      "Age 40-60 years at onset (peak incidence)",
      "Genetic susceptibility: HLA-DRB1 shared epitope (strongest genetic risk factor, 40% of genetic risk)",
      "Cigarette smoking (strongest modifiable risk factor; increases anti-CCP production 2-fold)",
      "First-degree relative with RA (3-5 fold increased risk)",
      "Periodontal disease (Porphyromonas gingivalis generates citrullinated proteins, potentially triggering anti-CCP)",
      "Silica dust and textile dust occupational exposure",
      "Obesity (adipokine-driven inflammation; also reduces treatment response)",
      "Prior viral infections (EBV, parvovirus B19 — molecular mimicry hypothesis)"
    ],
    diagnostics: [
      "Order rheumatoid factor (RF) — sensitivity 70-80%, specificity 80%; positive in many other conditions (SLE, Sjögren, hepatitis C)",
      "Order anti-CCP antibodies (ACPA) — sensitivity 70%, specificity 95-99%; more specific than RF and predicts erosive disease",
      "Order ESR and CRP to assess disease activity and systemic inflammation",
      "Order CBC (anemia of chronic disease, thrombocytosis), CMP (baseline before DMARD therapy)",
      "Order hand/wrist X-rays: early findings — periarticular osteopenia, soft tissue swelling; late findings — joint space narrowing, marginal erosions, subluxations",
      "Apply ACR/EULAR 2010 classification criteria (score ≥6/10 for definite RA)",
      "Assess disease activity using validated composite measures: DAS28, CDAI, or SDAI at each visit",
      "Screen for hepatitis B and C before initiating DMARDs or biologics (reactivation risk)",
      "Obtain baseline chest X-ray and TB screening (QuantiFERON-TB Gold or PPD) before biologic therapy"
    ],
    management: [
      "Initiate methotrexate (MTX) as first-line DMARD within 3 months of diagnosis per treat-to-target strategy: start 10-15 mg weekly, titrate to 20-25 mg weekly over 4-8 weeks",
      "Prescribe folic acid 1 mg daily (or folinic acid 5 mg weekly 24h after MTX) to reduce MTX side effects (oral ulcers, nausea, hepatotoxicity)",
      "Add hydroxychloroquine (200-400 mg daily) and/or sulfasalazine (1-3 g daily) as combination conventional DMARD therapy (triple therapy)",
      "If inadequate response to MTX at 3-6 months, escalate to biologic DMARD: TNF inhibitor (adalimumab, etanercept, infliximab), IL-6 inhibitor (tocilizumab), T-cell co-stimulation modulator (abatacept), anti-CD20 (rituximab), or JAK inhibitor (tofacitinib, baricitinib)",
      "Bridge therapy with short-course oral prednisone 10-15 mg daily (taper over 6-8 weeks) while waiting for DMARD onset of action",
      "Monitor MTX toxicity: CBC and LFTs every 2-4 weeks for first 3 months, then every 8-12 weeks; hold MTX if ALT/AST >2x ULN or WBC <3500 or platelets <100,000",
      "Screen for TB (QuantiFERON Gold) and hepatitis B/C before starting biologics; treat latent TB before biologic initiation",
      "Treat to target: assess disease activity (DAS28, CDAI) every 3-6 months; adjust therapy until remission or low disease activity achieved",
      "Screen for and manage extra-articular manifestations: rheumatoid nodules, interstitial lung disease, pericarditis, scleritis, Felty syndrome (RA + splenomegaly + neutropenia)"
    ],
    signs: {
      left: [
        "Early RA: symmetric small joint swelling (MCPs, PIPs, wrists), morning stiffness >30 minutes",
        "Positive squeeze test (MCP and MTP tenderness with lateral compression)",
        "Elevated anti-CCP and/or RF with elevated inflammatory markers",
        "No radiographic erosions on baseline hand X-rays"
      ],
      right: [
        "Advanced RA: swan-neck and boutonnière deformities, ulnar deviation of MCPs",
        "Radiographic erosions and joint destruction despite DMARD therapy",
        "Extra-articular disease: rheumatoid nodules, ILD, vasculitis, Felty syndrome",
        "C1-C2 (atlantoaxial) subluxation — evaluate before intubation/surgery with flexion-extension cervical spine films"
      ]
    },
    medications: [
      {
        name: "Methotrexate (Rheumatrex, Trexall)",
        type: "Conventional DMARD (Folate Antagonist)",
        action: "Inhibits dihydrofolate reductase and aminoimidazole carboxamide ribonucleotide (AICAR) transformylase, increasing extracellular adenosine which has potent anti-inflammatory effects; reduces T-cell activation, cytokine production, and synovial inflammation",
        sideEffects: "GI (nausea, oral ulcers, diarrhea), hepatotoxicity (monitor LFTs), myelosuppression (monitor CBC), pneumonitis (dry cough, dyspnea — stop MTX immediately), teratogenicity (Category X)",
        contra: "Pregnancy and breastfeeding (Category X — discontinue 3 months before conception for both men and women), severe hepatic disease, alcoholism, immunodeficiency, pre-existing blood dyscrasias, CrCl <30",
        pearl: "Anchor drug for RA — first-line in nearly all patients. WEEKLY dosing (not daily — daily dosing is a fatal medication error causing pancytopenia). Start 10-15 mg weekly, titrate to 20-25 mg. Subcutaneous route has better bioavailability at doses >15 mg. Always co-prescribe folic acid 1 mg daily. Screen for hepatitis B/C before starting. Alcohol must be limited to minimize hepatotoxicity."
      },
      {
        name: "Adalimumab (Humira)",
        type: "TNF-alpha Inhibitor (Monoclonal Antibody)",
        action: "Fully human monoclonal antibody that binds and neutralizes both soluble and transmembrane TNF-alpha, blocking its interaction with p55/p75 TNF receptors; reduces inflammatory cell infiltration, MMP production, and osteoclast activation in the synovium",
        sideEffects: "Injection site reactions, increased infection risk (especially upper respiratory), reactivation of latent TB, hepatitis B reactivation, rare: demyelinating disease, lupus-like syndrome, lymphoma (controversial)",
        contra: "Active serious infection (sepsis, active TB, opportunistic infections), decompensated heart failure (NYHA Class III-IV), concurrent live vaccine administration",
        pearl: "Screen for latent TB (QuantiFERON Gold) and hepatitis B before starting — treat LTBI for at least 1 month before initiating. Dose: 40 mg SC every 2 weeks. Can be used as monotherapy but more effective combined with MTX (reduced immunogenicity/anti-drug antibodies). Biosimilars now available at lower cost. Monitor for signs of serious infection at every visit."
      }
    ],
    pearls: [
      "Methotrexate is prescribed WEEKLY, not daily — daily methotrexate dosing is a well-recognized fatal medication error causing severe pancytopenia, mucositis, and death; the NP must clearly communicate 'once weekly' and verify patient understanding",
      "Anti-CCP antibodies (ACPA) are 95-99% specific for RA and predict erosive disease — a positive anti-CCP in a patient with inflammatory arthritis essentially confirms RA diagnosis even if RF is negative",
      "The treat-to-target strategy requires measuring disease activity (DAS28 or CDAI) at every visit and escalating therapy every 3-6 months until remission or low disease activity is achieved — the clinician should not accept persistent moderate/high disease activity",
      "All patients must be screened for latent TB (QuantiFERON Gold) and hepatitis B before starting biologic DMARDs — TNF inhibitors cause TB reactivation, and rituximab causes hepatitis B reactivation, both of which can be fatal",
      "Atlantoaxial (C1-C2) subluxation from pannus erosion of the transverse ligament occurs in up to 25% of RA patients — flexion-extension lateral cervical spine radiographs must be obtained before any intubation or surgical procedure"
    ],
    quiz: [
      {
        question: "A 45-year-old woman presents with 8 weeks of symmetric swelling and stiffness in her MCP and PIP joints, morning stiffness lasting 90 minutes. Labs show positive anti-CCP (85 U/mL), positive RF, ESR 48 mm/hr, CRP 2.8 mg/dL. Hand X-rays show periarticular osteopenia but no erosions. What is the appropriate initial treatment?",
        options: [
          "NSAIDs only with reassessment in 6 months",
          "Methotrexate 10-15 mg weekly with folic acid 1 mg daily, initiated within 3 months of diagnosis",
          "Adalimumab 40 mg SC every 2 weeks as first-line therapy",
          "Prednisone 20 mg daily as long-term monotherapy"
        ],
        correct: 1,
        rationale: "This patient meets ACR/EULAR 2010 criteria for RA (symmetric small joint involvement, positive anti-CCP and RF, elevated acute phase reactants, symptoms ≥6 weeks). Per treat-to-target guidelines, methotrexate should be initiated as first-line DMARD within 3 months of diagnosis. Folic acid must be co-prescribed. NSAIDs alone do not prevent joint damage. Biologics are reserved for inadequate response to conventional DMARDs. Long-term corticosteroids should be avoided."
      },
      {
        question: "A patient with RA on methotrexate 20 mg weekly and adalimumab 40 mg every 2 weeks develops a persistent dry cough and progressive dyspnea over 3 weeks. CXR shows bilateral ground-glass opacities. What is the priority concern and action?",
        options: [
          "RA-related interstitial lung disease — continue current therapy and add prednisone",
          "Community-acquired pneumonia — prescribe outpatient antibiotics",
          "Methotrexate-induced pneumonitis — immediately hold methotrexate, obtain CT chest, rule out infection (PCP, CMV), start systemic corticosteroids",
          "Adalimumab-related reaction — discontinue adalimumab and continue MTX"
        ],
        correct: 2,
        rationale: "MTX-induced pneumonitis is a hypersensitivity reaction occurring in 2-8% of patients, presenting with dry cough, dyspnea, and bilateral ground-glass opacities. It is a medical emergency: MTX must be immediately discontinued, infection must be ruled out (especially PCP in immunosuppressed patients), and systemic corticosteroids initiated. The patient should never be rechallenged with MTX. RA-ILD is a consideration but the acute onset and medication exposure make MTX pneumonitis the priority concern."
      }
    ]
  },

  "np-anti-infectives-stewardship": {
    title: "Anti-Infectives, Stewardship & Resistance",
    cellular: {
      title: "Antimicrobial Mechanisms and Resistance Pathways",
      content: "Antimicrobial agents target essential bacterial structures and processes: cell wall synthesis (beta-lactams, glycopeptides), protein synthesis (30S: aminoglycosides, tetracyclines; 50S: macrolides, clindamycin, linezolid), DNA replication/repair (fluoroquinolones target topoisomerase II/IV; metronidazole generates DNA-damaging free radicals), folate synthesis (trimethoprim/sulfamethoxazole), and cell membrane integrity (daptomycin, polymyxins).\n\nAntibiotic resistance emerges through four primary mechanisms: (1) Enzymatic degradation — beta-lactamases (including extended-spectrum beta-lactamases [ESBLs] and carbapenemases [KPC, NDM, OXA-48]) hydrolyze the beta-lactam ring; (2) Target modification — altered penicillin-binding proteins (PBP2a in MRSA, encoded by mecA gene), ribosomal methylation (erm genes conferring macrolide resistance); (3) Efflux pumps — actively transport antibiotics out of the cell (tetracycline resistance, fluoroquinolone resistance); (4) Decreased permeability — porin mutations reducing outer membrane drug entry (carbapenem-resistant Enterobacterales).\n\nKey resistant organisms threatening clinical outcomes: MRSA (methicillin-resistant Staphylococcus aureus — mecA-mediated PBP2a), VRE (vancomycin-resistant Enterococcus — vanA/vanB gene clusters modifying D-Ala-D-Ala to D-Ala-D-Lac), ESBL-producing Enterobacterales (CTX-M enzymes hydrolyzing third-generation cephalosporins — treat with carbapenems), CRE (carbapenem-resistant Enterobacterales — limited therapeutic options including ceftazidime-avibactam, meropenem-vaborbactam), and MDR Pseudomonas aeruginosa.\n\nClostridioides difficile infection (CDI) results from antibiotic-mediated disruption of colonic microbiota, allowing C. difficile spore germination and toxin production (toxin A/B). Highest-risk antibiotics include fluoroquinolones, clindamycin, and broad-spectrum cephalosporins. CDI has become the most common healthcare-associated infection in the United States."
    },
    riskFactors: [
      "Broad-spectrum antibiotic use (especially fluoroquinolones, third-generation cephalosporins, clindamycin)",
      "Prolonged antibiotic courses beyond minimum effective duration",
      "Healthcare exposure: hospitalization, long-term care facilities, dialysis centers",
      "Immunocompromised status (HIV, transplant, chemotherapy, chronic corticosteroids)",
      "Indwelling devices: central lines, urinary catheters, endotracheal tubes",
      "Prior colonization or infection with resistant organisms",
      "International travel to areas with high antimicrobial resistance (South/Southeast Asia, Mediterranean)",
      "Agricultural antibiotic use (food animal production drives environmental resistance)",
      "Patient demand for unnecessary antibiotics (viral infections, asymptomatic bacteriuria)"
    ],
    diagnostics: [
      "Obtain appropriate cultures (blood, urine, sputum, wound) BEFORE initiating empiric antibiotics whenever possible",
      "Order Gram stain for rapid preliminary identification (cocci vs rods, gram-positive vs negative, arrangement)",
      "Order culture with sensitivity testing (MIC reporting) to guide targeted de-escalation",
      "Order procalcitonin to differentiate bacterial infection from viral/inflammatory (>0.5 ng/mL suggests bacterial; serial levels guide antibiotic duration)",
      "Order C. difficile testing for patients with ≥3 unformed stools in 24 hours on antibiotics: stool NAAT (PCR) or two-step testing (GDH + toxin EIA)",
      "Screen for MRSA nasal colonization (PCR swab) to guide empiric coverage decisions in hospitalized patients",
      "Monitor antibiotic stewardship metrics: Days of Therapy (DOT), Length of Therapy (LOT), time to de-escalation",
      "Order fungal markers (1,3-beta-D-glucan, galactomannan) in immunocompromised patients with persistent fever on antibiotics",
      "Assess renal and hepatic function for antibiotic dose adjustment (aminoglycoside and vancomycin trough levels)"
    ],
    management: [
      "Apply empiric-to-targeted therapy paradigm: start empiric coverage based on site of infection and local antibiogram, narrow based on culture results within 48-72 hours",
      "De-escalate: switch from IV to oral when patient is clinically improving, afebrile, tolerating PO, and has functional GI tract (IV-to-PO switch criteria)",
      "Use shortest effective antibiotic duration per evidence: CAP 5 days (ATS/IDSA 2019), uncomplicated UTI 3-5 days, uncomplicated cellulitis 5 days, strep pharyngitis 10 days penicillin/5 days azithromycin",
      "MRSA treatment: vancomycin (trough 15-20 mcg/mL for serious infections, AUC/MIC-guided dosing preferred), daptomycin (NOT for pneumonia — inactivated by surfactant), linezolid, TMP-SMX (for uncomplicated skin infections)",
      "ESBL treatment: carbapenems (meropenem, ertapenem) are drugs of choice; avoid cephalosporins even if in vitro sensitivity reported",
      "CDI treatment: first episode mild-moderate — fidaxomicin 200 mg BID x10 days (preferred) or vancomycin 125 mg PO QID x10 days; avoid metronidazole for initial episode (inferior outcomes per IDSA 2021); recurrent CDI — bezlotoxumab (anti-toxin B monoclonal antibody) or fecal microbiota transplant",
      "Outpatient stewardship: avoid antibiotics for viral URI, acute bronchitis, and asymptomatic bacteriuria (except pregnant women); use delayed/watchful waiting prescriptions for borderline cases",
      "Antifungal selection: fluconazole (Candida albicans, non-azole-resistant species), echinocandins (caspofungin, micafungin — empiric for critically ill/azole-resistant Candida), amphotericin B (Mucorales, refractory invasive fungal infections)",
      "Antiviral stewardship: oseltamivir for influenza within 48 hours, acyclovir/valacyclovir for HSV/VZV — do NOT prescribe antivirals for common cold or non-influenza viral illness"
    ],
    signs: {
      left: [
        "Localized infection with identified pathogen and susceptibility data available",
        "Clinically improving on appropriate targeted antibiotic within 48-72 hours",
        "Afebrile, tolerating oral intake — candidate for IV-to-PO switch",
        "Uncomplicated community-acquired infection in immunocompetent host"
      ],
      right: [
        "Sepsis/septic shock requiring broad-spectrum empiric coverage within 1 hour",
        "MDR organism identified: CRE, MDR Pseudomonas, VRE — limited therapeutic options",
        "CDI with toxic megacolon: colonic dilation >6 cm, WBC >30,000, lactate >5",
        "Persistent bacteremia/fungemia despite appropriate therapy (evaluate for source: endocarditis, abscess, retained device)"
      ]
    },
    medications: [
      {
        name: "Vancomycin (IV for systemic; PO for CDI)",
        type: "Glycopeptide Antibiotic",
        action: "Binds D-Ala-D-Ala terminal of peptidoglycan precursors, blocking transglycosylation and transpeptidation steps of cell wall synthesis; bactericidal against most gram-positive organisms",
        sideEffects: "Nephrotoxicity (monitor trough levels or AUC/MIC), ototoxicity, Red Man syndrome (histamine-mediated flushing from rapid infusion — slow infusion rate, not a true allergy), thrombocytopenia",
        contra: "Known vancomycin hypersensitivity; oral vancomycin is NOT absorbed systemically — used ONLY for C. difficile colitis",
        pearl: "AUC/MIC-guided dosing (target AUC 400-600) now preferred over trough-based dosing per 2020 ASHP/IDSA guidelines — associated with less nephrotoxicity. Oral vancomycin is NOT absorbed and acts only locally in the GI tract (for CDI). PO dose for CDI: 125 mg QID x10 days. Red Man Syndrome is an infusion-rate reaction, NOT anaphylaxis — slow the infusion and premedicate with diphenhydramine."
      },
      {
        name: "Fidaxomicin (Dificid)",
        type: "Macrocyclic Antibiotic (Narrow-Spectrum)",
        action: "Inhibits bacterial RNA polymerase with narrow-spectrum activity primarily against C. difficile; minimal disruption of normal colonic microbiota, reducing CDI recurrence rates compared to vancomycin",
        sideEffects: "Nausea, abdominal pain, GI hemorrhage (rare), anemia, neutropenia (rare)",
        contra: "Known hypersensitivity; not systemically absorbed — used only for CDI",
        pearl: "IDSA 2021 guidelines recommend fidaxomicin over oral vancomycin for initial and recurrent CDI due to lower recurrence rates (13% vs 27% in DIFICID trials). Its narrow spectrum preserves commensal Bacteroides, accelerating microbiome recovery. Higher cost than vancomycin but cost-effective when accounting for reduced recurrence. 200 mg PO BID x10 days."
      }
    ],
    pearls: [
      "The three most important antibiotic stewardship principles: (1) obtain cultures before antibiotics, (2) de-escalate within 48-72 hours based on culture results, (3) use the shortest effective duration — these reduce resistance emergence, CDI risk, and adverse drug events",
      "Fluoroquinolones carry FDA boxed warnings for tendinopathy/rupture, peripheral neuropathy, CNS effects, aortic dissection/aneurysm, and hypoglycemia — they should be reserved for infections without safer alternatives and avoided in the elderly and patients on corticosteroids",
      "Oral vancomycin is the treatment for C. difficile colitis — IV vancomycin does NOT reach therapeutic levels in the colon; conversely, oral vancomycin is NOT absorbed systemically and should never be prescribed for MRSA bloodstream infections",
      "ESBL-producing Enterobacterales may appear susceptible to cephalosporins on in vitro sensitivity testing, but clinical failure rates are high — carbapenems are the drugs of choice regardless of reported susceptibility",
      "Procalcitonin-guided antibiotic therapy (stop antibiotics when PCT <0.25 ng/mL or drops >80% from peak) safely reduces antibiotic duration without increasing adverse outcomes — particularly useful in respiratory infections and sepsis"
    ],
    quiz: [
      {
        question: "A 72-year-old hospitalized patient on day 8 of piperacillin-tazobactam for pneumonia develops watery diarrhea (8 episodes/day), abdominal cramping, and leukocytosis (WBC 22,000). Stool PCR is positive for C. difficile toxin. What is the most appropriate initial treatment?",
        options: [
          "Metronidazole 500 mg PO TID for 10 days",
          "Fidaxomicin 200 mg PO BID for 10 days",
          "IV vancomycin 1 g every 12 hours for 14 days",
          "Loperamide to reduce diarrhea frequency"
        ],
        correct: 1,
        rationale: "IDSA 2021 guidelines recommend fidaxomicin as preferred first-line therapy for initial CDI due to significantly lower recurrence rates compared to oral vancomycin (13% vs 27%). Metronidazole is no longer recommended for initial episodes due to inferior cure rates. IV vancomycin does NOT reach the colonic lumen and is ineffective for CDI. Loperamide is contraindicated as it may precipitate toxic megacolon by reducing toxin clearance."
      },
      {
        question: "A blood culture from a critically ill ICU patient grows an Escherichia coli that is resistant to ceftriaxone and ceftazidime but susceptible to meropenem and piperacillin-tazobactam on sensitivity testing. What is the most appropriate definitive antibiotic selection?",
        options: [
          "Piperacillin-tazobactam based on reported susceptibility",
          "Meropenem — carbapenems are the drug of choice for ESBL-producing organisms regardless of other in vitro susceptibilities",
          "Ceftriaxone with increased dosing frequency",
          "Azithromycin"
        ],
        correct: 1,
        rationale: "Resistance to third-generation cephalosporins (ceftriaxone, ceftazidime) with susceptibility to carbapenems is the hallmark of ESBL-producing Enterobacterales. Despite in vitro susceptibility to piperacillin-tazobactam, clinical failure rates are high with beta-lactam/beta-lactamase inhibitor combinations against ESBL producers (inoculum effect). Carbapenems are the drugs of choice for serious ESBL infections. This is a critical antimicrobial stewardship principle."
      },
      {
        question: "An NP is seeing a 32-year-old otherwise healthy patient with 3 days of sore throat, low-grade fever, and rhinorrhea. Rapid strep test is negative. The patient insists on antibiotics because 'it always works faster.' What is the most appropriate response?",
        options: [
          "Prescribe azithromycin 250 mg for 5 days to maintain the therapeutic relationship",
          "Explain this is likely a viral infection, antibiotics will not help, and discuss symptom management (analgesics, fluids, rest); offer a delayed prescription if symptoms worsen after 3-5 days",
          "Prescribe amoxicillin 500 mg TID for 10 days as empiric coverage",
          "Order a throat culture and prescribe antibiotics while awaiting results"
        ],
        correct: 1,
        rationale: "Viral URI is the most common outpatient diagnosis for inappropriate antibiotic prescribing. With a negative rapid strep test, rhinorrhea (suggesting viral etiology), and no red flags, antibiotics are not indicated. The NP should counsel on the self-limited nature, recommend symptomatic management, and offer a delayed/watchful waiting prescription as a stewardship strategy. Unnecessary antibiotic use drives resistance and exposes the patient to adverse effects (C. difficile, allergic reactions)."
      }
    ]
  },

  "np-vaccines-immunology-preventive": {
    title: "Vaccines, Immunology & Preventive Care",
    cellular: {
      title: "Vaccine Immunology and Adaptive Immune Memory",
      content: "Vaccination exploits the adaptive immune system's capacity for immunological memory. Vaccines expose the immune system to antigens in a controlled manner, priming both B-cell (humoral) and T-cell (cellular) responses without causing disease. Upon antigen presentation by dendritic cells to naive T cells in lymph nodes, CD4+ T-helper cells differentiate into effector and memory subsets. T-follicular helper (Tfh) cells drive germinal center reactions where B cells undergo somatic hypermutation and affinity maturation, producing high-affinity antibodies. Long-lived plasma cells migrate to bone marrow and produce sustained antibody titers. Memory B cells and memory T cells persist for years to decades, enabling rapid anamnestic (secondary) response upon re-exposure.\n\nVaccine types differ in their immunogenic mechanisms: (1) Live attenuated vaccines (MMR, varicella, rotavirus, LAIV, yellow fever) contain weakened pathogens that replicate limitedly, producing robust humoral AND cellular immunity with typically lifelong protection after 1-2 doses; (2) Inactivated/killed vaccines (IPV, hepatitis A, inactivated influenza) cannot replicate and primarily stimulate humoral immunity, often requiring multiple doses and boosters; (3) Subunit/conjugate vaccines (HBV recombinant, HPV, PCV13, MCV4) contain purified antigens — conjugation of polysaccharide antigens to carrier proteins converts T-independent responses to T-dependent responses, enabling memory in children <2 years; (4) mRNA vaccines (COVID-19) deliver genetic instructions for antigen production by host cells, activating both humoral and cellular immunity; (5) Toxoid vaccines (Td, DTaP) contain inactivated toxins stimulating antitoxin antibody production.\n\nContraindications to live vaccines include: pregnancy (theoretical fetal risk), severe immunodeficiency (HIV with CD4 <200, active chemotherapy, high-dose corticosteroids ≥20 mg prednisone/day for ≥14 days, biologic immunosuppressants), and anaphylaxis to vaccine component."
    },
    riskFactors: [
      "Unvaccinated or undervaccinated status (anti-vaccine hesitancy, access barriers, immigration from low-coverage countries)",
      "Immunocompromised state: HIV, transplant recipients, chemotherapy, biologic immunosuppressants, asplenia",
      "Extremes of age: infants with immature immune systems, elderly with immunosenescence",
      "Healthcare workers (occupational exposure to infectious diseases)",
      "Pregnancy (specific vaccine requirements and contraindications)",
      "Chronic medical conditions: diabetes, CKD, chronic liver disease, heart disease, COPD (impaired immune response)",
      "Travel to endemic areas for vaccine-preventable diseases",
      "Close-contact living: dormitories, military, long-term care facilities",
      "Occupational exposure: laboratory workers, animal handlers, first responders"
    ],
    diagnostics: [
      "Review immunization records at every clinical encounter — assess for missing or incomplete series per CDC/ACIP schedules",
      "Order vaccine titers (quantitative antibody levels) when immunization records are unavailable: MMR IgG, varicella IgG, hepatitis B surface antibody, hepatitis A IgG",
      "Order hepatitis B surface antibody (anti-HBs) after completion of HBV series in healthcare workers — ≥10 mIU/mL indicates immunity",
      "Screen for pregnancy before administering live vaccines (MMR, varicella) — counsel to avoid conception for 4 weeks after live vaccine",
      "Screen HIV status (CD4 count) before live vaccine administration — live vaccines contraindicated if CD4 <200",
      "Assess for severe immunosuppression: current chemotherapy, ≥20 mg prednisone/day for ≥14 days, biologic agents (anti-TNF, rituximab)",
      "Screen for egg allergy severity before influenza vaccination (severe egg allergy: administer in supervised setting with 30-minute observation; cell-culture or recombinant influenza vaccine preferred)",
      "Administer tuberculin skin test (TST) or IGRA before or simultaneously with live vaccines — live vaccines can suppress TST reactivity for 4-6 weeks",
      "Review USPSTF preventive screening recommendations integrated with immunization visits"
    ],
    management: [
      "Adult immunization schedule (CDC/ACIP): influenza annually, Td/Tdap every 10 years (Tdap once then Td boosters), shingles (Shingrix — recombinant, 2 doses, age ≥50), pneumococcal (PCV20 or PCV15+PPSV23 for adults ≥65 or high-risk), HPV (up to age 26, shared decision 27-45)",
      "Administer Tdap during each pregnancy at 27-36 weeks gestation for passive transfer of pertussis antibodies to the neonate",
      "Administer annual inactivated influenza vaccine to all adults — pregnancy is an indication, not a contraindication, for inactivated flu vaccine",
      "Administer hepatitis B vaccine to all unvaccinated adults aged 19-59 (universal recommendation since 2022 ACIP update); ages ≥60 shared clinical decision",
      "High-risk populations requiring additional vaccines: asplenia (PCV20, MenACWY, MenB, Hib), HIV (all inactivated vaccines per schedule; live vaccines if CD4 ≥200), ESRD/dialysis (HBV 40 mcg dose), chronic liver disease (HAV, HBV)",
      "Pediatric schedule: birth (HBV dose 1), 2 months (DTaP, IPV, Hib, PCV13, RV, HBV), 4 months (DTaP, IPV, Hib, PCV13, RV), 6 months (DTaP, HBV, PCV13, IIV), 12-15 months (MMR, varicella, Hib, PCV13, HepA), 4-6 years (DTaP, IPV, MMR, varicella)",
      "Address vaccine hesitancy using motivational interviewing: acknowledge concerns, provide evidence-based information, use presumptive language ('Your child is due for vaccines today'), offer to answer specific questions",
      "Travel vaccines: hepatitis A (all travelers to endemic areas), typhoid (South/Southeast Asia, Africa), yellow fever (sub-Saharan Africa, South America — live vaccine, certificate required), Japanese encephalitis, rabies pre-exposure (animal handlers, cave explorers)",
      "Integrate USPSTF screening recommendations: cervical cancer (Pap/HPV), breast cancer (mammography), colorectal cancer (colonoscopy/FIT), lung cancer (LDCT for smokers 50-80 with ≥20 pack-year history)"
    ],
    signs: {
      left: [
        "Mild injection site reactions: pain, redness, swelling (expected and self-limited)",
        "Low-grade fever for 24-48 hours post-vaccination (immune activation response)",
        "Mild systemic symptoms: fatigue, myalgia, headache (common with mRNA vaccines)",
        "Up-to-date immunization status per age-appropriate schedule"
      ],
      right: [
        "Anaphylaxis: onset within minutes to hours — urticaria, angioedema, bronchospasm, hypotension (epinephrine IM is first-line)",
        "Febrile seizure in children 6-24 hours post-vaccination (self-limited, does not contraindicate future doses)",
        "Vaccine-associated intussusception with rotavirus vaccine (rare, 1 in 20,000-100,000 — first dose highest risk)",
        "Breakthrough varicella or measles in immunocompromised patients who received live vaccine inappropriately"
      ]
    },
    medications: [
      {
        name: "Shingrix (Recombinant Zoster Vaccine)",
        type: "Recombinant Adjuvanted Vaccine",
        action: "Contains recombinant varicella-zoster virus glycoprotein E combined with AS01B adjuvant system; stimulates VZV-specific CD4+ T-cell and antibody responses to prevent herpes zoster reactivation from latent dorsal root ganglia virus",
        sideEffects: "Injection site pain (78%), myalgia (45%), fatigue (45%), headache, fever, GI symptoms; reactions typically resolve in 2-3 days",
        contra: "Known severe allergic reaction to any vaccine component; NOT contraindicated in immunocompromised patients (non-live vaccine)",
        pearl: "Recommended for ALL adults ≥50, including those with prior history of shingles and those previously vaccinated with Zostavax (live zoster vaccine). TWO doses IM 2-6 months apart. Efficacy: 97% in adults 50-69, 91% in adults ≥70. Unlike Zostavax (live, which was <50% effective and contraindicated in immunosuppressed), Shingrix is recombinant (non-live) and CAN be given to immunocompromised patients."
      },
      {
        name: "PCV20 (Prevnar 20) or PCV15+PPSV23",
        type: "Pneumococcal Conjugate Vaccine",
        action: "Polysaccharide antigens from 20 pneumococcal serotypes conjugated to CRM197 carrier protein (diphtheria toxoid mutant); converts T-independent polysaccharide response to T-dependent response, generating immunological memory and mucosal immunity",
        sideEffects: "Injection site reactions, fatigue, headache, myalgia, arthralgia",
        contra: "Severe allergic reaction to any component or previous dose of any PCV or diphtheria toxoid-containing vaccine",
        pearl: "Simplified 2023 ACIP guidelines: PCV20 single dose replaces the previous complex PCV13+PPSV23 regimen for adults ≥65 and adults 19-64 with immunocompromising conditions, CSF leaks, cochlear implants, or certain chronic diseases. PCV15 followed by PPSV23 (≥1 year later) is an acceptable alternative. Conjugation to protein carrier enables T-cell-dependent immune response — critical for immunological memory that polysaccharide vaccines alone cannot produce."
      }
    ],
    pearls: [
      "Live vaccines (MMR, varicella, LAIV, rotavirus, yellow fever, BCG) are contraindicated in pregnancy, severe immunodeficiency (CD4 <200, active chemo, high-dose steroids ≥20 mg prednisone x ≥14 days), and patients on biologic immunosuppressants — this is the single most important vaccine safety principle",
      "Shingrix (recombinant) has replaced Zostavax (live) as the preferred zoster vaccine — Shingrix is non-live and CAN be given to immunocompromised patients, unlike Zostavax which was contraindicated; Shingrix also has superior efficacy (>90% vs <50%)",
      "Tdap should be administered during EACH pregnancy at 27-36 weeks regardless of prior vaccination — passive transfer of maternal pertussis antibodies protects the neonate during the vulnerable period before their own DTaP series begins",
      "The ACIP 2022 universal adult hepatitis B vaccine recommendation simplified practice: all unvaccinated adults 19-59 should receive HBV vaccine without risk-factor screening; for ages ≥60, it is a shared clinical decision",
      "Vaccine hesitancy is best addressed using presumptive language ('Your child is due for vaccines today' rather than 'Would you like vaccines?') combined with motivational interviewing — studies show presumptive framing significantly increases acceptance rates"
    ],
    quiz: [
      {
        question: "A 55-year-old man with rheumatoid arthritis on methotrexate 20 mg weekly and adalimumab presents for immunization review. He has never received a shingles vaccine. Which recommendation is correct?",
        options: [
          "Shingrix is contraindicated because he is immunosuppressed",
          "Administer Zostavax (live zoster vaccine) instead of Shingrix",
          "Administer Shingrix 2-dose series — it is a recombinant (non-live) vaccine and is recommended for immunocompromised adults ≥50",
          "Defer all vaccinations until immunosuppression is discontinued"
        ],
        correct: 2,
        rationale: "Shingrix is a recombinant (non-live) vaccine and is recommended for immunocompromised adults ≥50. Unlike the old Zostavax (live vaccine, now discontinued in the US), Shingrix does NOT contain live virus and is safe in immunosuppressed patients. Immunocompromised patients are actually at HIGHER risk for herpes zoster reactivation, making vaccination especially important. Zostavax is no longer available and was contraindicated in immunosuppressed patients."
      },
      {
        question: "A 28-year-old pregnant woman at 30 weeks gestation presents for prenatal care. She received her last Tdap vaccine 3 years ago. She asks if she needs another Tdap during this pregnancy. What is the correct recommendation?",
        options: [
          "No, Tdap immunity from 3 years ago is sufficient",
          "Yes, administer Tdap at 27-36 weeks during EACH pregnancy regardless of prior vaccination to maximize passive antibody transfer to the neonate",
          "Defer Tdap until postpartum to avoid fetal exposure",
          "Administer Td booster instead of Tdap"
        ],
        correct: 1,
        rationale: "ACIP recommends Tdap during EACH pregnancy at 27-36 weeks, regardless of when the patient last received Tdap. This timing maximizes transplacental transfer of maternal anti-pertussis antibodies to protect the newborn during the vulnerable period before their own DTaP series begins at 2 months. Pertussis (whooping cough) is life-threatening in neonates who are too young for vaccination. Td does not contain the pertussis component."
      },
      {
        question: "A healthy 67-year-old woman who has never received pneumococcal vaccination presents for a wellness visit. What pneumococcal vaccine should the NP administer per current ACIP guidelines?",
        options: [
          "PPSV23 (Pneumovax) single dose only",
          "PCV13 (Prevnar 13) followed by PPSV23 one year later",
          "PCV20 (Prevnar 20) single dose",
          "No pneumococcal vaccination needed until age 70"
        ],
        correct: 2,
        rationale: "The simplified 2023 ACIP guidelines recommend PCV20 as a single dose for all adults ≥65 who have never received pneumococcal vaccination. This replaces the previous complex sequential PCV13 → PPSV23 regimen. PCV20 covers 20 serotypes with conjugate technology (T-dependent immune response with immunological memory). An alternative acceptable regimen is PCV15 followed by PPSV23 at least 1 year later."
      }
    ]
  }
};
