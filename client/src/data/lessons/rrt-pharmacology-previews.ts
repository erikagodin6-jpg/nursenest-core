import type { PharmacologyTopicPreview } from "./rrt-pharmacology-topics";

export const RRT_PHARMACOLOGY_PREVIEWS: PharmacologyTopicPreview[] = [
  {
    slug: "bronchodilators",
    title: "Bronchodilators: Beta-2 Agonists & Anticholinergics",
    shortTitle: "Bronchodilators",
    category: "Core Respiratory Medications",
    icon: "Wind",
    isFree: true,
    seo: {
      title: "Bronchodilators for RRT Exam Prep — Beta-2 Agonists & Anticholinergics | NurseNest",
      description: "Master bronchodilator pharmacology for the NBRC TMC and CSE. Study albuterol, levalbuterol, ipratropium, and tiotropium with indications, side effects, and exam-focused practice questions.",
      keywords: "bronchodilators RRT exam, albuterol pharmacology, levalbuterol, ipratropium, beta-2 agonists respiratory therapy, anticholinergics NBRC exam"
    },
    overview: "Bronchodilators are the cornerstone of aerosolized medication therapy in respiratory care. They work by relaxing bronchial smooth muscle to relieve bronchospasm and improve airflow. Two primary classes dominate respiratory pharmacology: beta-2 adrenergic agonists and anticholinergics (parasympatholytics).",
    highYieldFacts: [
      "Albuterol is the most commonly tested bronchodilator on the NBRC TMC — know the standard nebulizer dose (2.5 mg in 3 mL) and MDI dose (90 mcg/puff, 2 puffs)",
      "Levalbuterol (Xopenex) is the R-isomer of albuterol with fewer cardiac side effects but similar bronchodilator efficacy",
      "Ipratropium (Atrovent) has slower onset (15-30 min) than albuterol (5-15 min) — never use as sole rescue medication in acute bronchospasm",
    ],
  },
  {
    slug: "corticosteroids",
    title: "Corticosteroids: Inhaled & Systemic for Respiratory Disease",
    shortTitle: "Corticosteroids",
    category: "Core Respiratory Medications",
    icon: "Shield",
    isFree: true,
    seo: {
      title: "Corticosteroids for RRT Exam — Inhaled & Systemic Steroids | NurseNest",
      description: "Study corticosteroid pharmacology for the NBRC TMC and CSE exams. Cover beclomethasone, budesonide, fluticasone, prednisone with mechanisms, side effects, and exam questions.",
      keywords: "corticosteroids RRT exam, inhaled steroids respiratory therapy, budesonide, fluticasone, prednisone NBRC, anti-inflammatory respiratory medications"
    },
    overview: "Corticosteroids are the most potent anti-inflammatory medications in respiratory pharmacology. They reduce airway inflammation, mucus production, and bronchial hyperresponsiveness through suppression of inflammatory gene transcription.",
    highYieldFacts: [
      "Inhaled corticosteroids (ICS) are first-line controller therapy for persistent asthma — they reduce inflammation but do NOT provide acute bronchodilation",
      "Oral candidiasis (thrush) and dysphonia are the most common ICS side effects — prevented by mouth rinsing and spacer use",
      "Systemic steroids for acute exacerbations: prednisone 40-60 mg daily for 5-7 days or methylprednisolone IV",
    ],
  },
  {
    slug: "mucolytics",
    title: "Mucolytics & Mucokinetic Agents",
    shortTitle: "Mucolytics",
    category: "Airway Clearance Medications",
    icon: "Droplets",
    isFree: false,
    seo: {
      title: "Mucolytics for RRT Exam Prep — Acetylcysteine, Dornase Alfa, Hypertonic Saline | NurseNest",
      description: "Study mucolytic and mucokinetic agents for the NBRC TMC and CSE exams. Cover N-acetylcysteine, dornase alfa, hypertonic saline with mechanisms, indications, and exam practice.",
      keywords: "mucolytics RRT exam, acetylcysteine respiratory, dornase alfa cystic fibrosis, hypertonic saline nebulizer, mucokinetic agents NBRC"
    },
    overview: "Mucolytics and mucokinetic agents modify the properties of airway secretions to facilitate clearance. They work through different mechanisms: classic mucolytics break disulfide bonds in mucus glycoproteins, while mucokinetic agents enhance mucociliary transport.",
    highYieldFacts: [
      "N-acetylcysteine (Mucomyst) is a classic mucolytic that breaks disulfide bonds — also used as antidote for acetaminophen overdose",
      "Dornase alfa (Pulmozyme) cleaves extracellular DNA in purulent secretions — approved only for cystic fibrosis",
      "Hypertonic saline (3-7%) is a mucokinetic that draws water into airways via osmosis — commonly used in CF and for sputum induction",
    ],
  },
  {
    slug: "aerosolized-anti-infectives",
    title: "Aerosolized Anti-Infectives: Antibiotics & Antivirals",
    shortTitle: "Anti-Infectives",
    category: "Antimicrobial Therapy",
    icon: "Syringe",
    isFree: false,
    seo: {
      title: "Aerosolized Anti-Infectives for RRT Exam — Tobramycin, Pentamidine, Ribavirin | NurseNest",
      description: "Master aerosolized anti-infective pharmacology for NBRC exams. Study tobramycin, pentamidine, ribavirin with administration techniques, safety precautions, and practice questions.",
      keywords: "aerosolized antibiotics RRT, tobramycin inhalation, pentamidine nebulizer, ribavirin SPAG, anti-infectives respiratory therapy NBRC"
    },
    overview: "Aerosolized anti-infectives deliver antimicrobial agents directly to the respiratory tract, achieving high local concentrations while minimizing systemic toxicity.",
    highYieldFacts: [
      "Tobramycin (TOBI) is delivered via jet nebulizer for Pseudomonas in CF — alternating 28-day on/off cycles",
      "Pentamidine isethionate is nebulized for PCP prophylaxis in immunocompromised patients — requires negative pressure room",
      "Ribavirin (Virazole) via SPAG-2 generator for severe RSV in infants — teratogenic, requires scavenging system",
    ],
  },
  {
    slug: "adrenergic-medications",
    title: "Adrenergic Medications: Sympathomimetics in Respiratory Care",
    shortTitle: "Adrenergic Meds",
    category: "Core Respiratory Medications",
    icon: "Zap",
    isFree: false,
    seo: {
      title: "Adrenergic Medications for RRT Exam — Epinephrine, Racemic Epinephrine | NurseNest",
      description: "Study adrenergic medication pharmacology for NBRC exams. Cover epinephrine, racemic epinephrine, and sympathomimetic agents with receptor specificity and clinical applications.",
      keywords: "adrenergic medications RRT, epinephrine respiratory, racemic epinephrine croup, sympathomimetics NBRC exam, alpha beta receptors respiratory"
    },
    overview: "Adrenergic medications (sympathomimetics) stimulate adrenergic receptors throughout the body. In respiratory care, they are used for bronchodilation, vasoconstriction to reduce airway edema, and hemodynamic support.",
    highYieldFacts: [
      "Racemic epinephrine is first-line for croup (laryngotracheobronchitis) — reduces subglottic edema via alpha-1 vasoconstriction",
      "Epinephrine is a non-selective adrenergic agonist (alpha-1, beta-1, beta-2) — used in anaphylaxis, cardiac arrest, and severe croup",
      "Know receptor specificity: alpha-1 = vasoconstriction, beta-1 = cardiac stimulation, beta-2 = bronchodilation",
    ],
  },
  {
    slug: "diuretics-cardiopulmonary",
    title: "Diuretics in Cardiopulmonary Care",
    shortTitle: "Diuretics",
    category: "Cardiovascular-Pulmonary Medications",
    icon: "Heart",
    isFree: false,
    seo: {
      title: "Diuretics in Cardiopulmonary Care for RRT Exam | NurseNest",
      description: "Study diuretic pharmacology for respiratory therapy exams. Cover furosemide, hydrochlorothiazide, and spironolactone in CHF and pulmonary edema management.",
      keywords: "diuretics RRT exam, furosemide respiratory, pulmonary edema management, CHF diuretics NBRC, loop diuretics cardiopulmonary"
    },
    overview: "Diuretics are essential in managing fluid overload conditions that affect respiratory function, particularly congestive heart failure (CHF) and pulmonary edema.",
    highYieldFacts: [
      "Furosemide (Lasix) is the most commonly tested diuretic — a loop diuretic that inhibits Na+/K+/2Cl- cotransporter in the loop of Henle",
      "Monitor for hypokalemia with loop and thiazide diuretics — can potentiate digitalis toxicity and cause cardiac arrhythmias",
      "Spironolactone is a potassium-sparing aldosterone antagonist — used in severe CHF and causes hyperkalemia",
    ],
  },
  {
    slug: "emergency-medications",
    title: "Emergency Respiratory Medications",
    shortTitle: "Emergency Meds",
    category: "Critical Care Pharmacology",
    icon: "AlertTriangle",
    isFree: false,
    seo: {
      title: "Emergency Respiratory Medications for RRT Exam — ACLS Drugs | NurseNest",
      description: "Master emergency medication pharmacology for NBRC exams. Study epinephrine, atropine, vasopressin, and ACLS drugs with doses, routes, and clinical scenarios.",
      keywords: "emergency medications RRT, ACLS drugs respiratory therapy, epinephrine cardiac arrest, atropine bradycardia, vasopressin NBRC exam"
    },
    overview: "Emergency respiratory medications are critical in life-threatening situations including cardiac arrest, severe bronchospasm, anaphylaxis, and respiratory failure.",
    highYieldFacts: [
      "Epinephrine 1 mg IV push every 3-5 minutes is the first-line drug in cardiac arrest (PEA, asystole, VF/pulseless VT)",
      "Atropine 1 mg IV every 3-5 minutes (max 3 mg) for symptomatic bradycardia — blocks vagal tone at muscarinic receptors",
      "Sodium bicarbonate corrects metabolic acidosis — give 1 mEq/kg IV for documented severe acidosis or hyperkalemia",
    ],
  },
  {
    slug: "sedation-paralytics",
    title: "Sedation & Paralytic Agents in Mechanical Ventilation",
    shortTitle: "Sedation & Paralytics",
    category: "Critical Care Pharmacology",
    icon: "Moon",
    isFree: false,
    seo: {
      title: "Sedation & Paralytics for RRT Exam — ICU Pharmacology | NurseNest",
      description: "Study sedation and neuromuscular blocking agents for NBRC exams. Cover propofol, midazolam, fentanyl, cisatracurium with ventilator management applications.",
      keywords: "sedation paralytics RRT exam, propofol ventilator, midazolam ICU, neuromuscular blocking agents, cisatracurium respiratory therapy NBRC"
    },
    overview: "Sedation and neuromuscular blocking agents (NMBAs) are essential in ICU management of mechanically ventilated patients, facilitating ventilator synchrony and reducing oxygen consumption.",
    highYieldFacts: [
      "Propofol is the preferred sedative for short-term ventilated patients — rapid onset/offset, but causes hypotension and propofol infusion syndrome with prolonged use",
      "Midazolam (Versed) is a benzodiazepine — flumazenil is the reversal agent; avoid prolonged infusion due to active metabolite accumulation",
      "Cisatracurium is the preferred NMBA in ICU — undergoes Hofmann degradation (organ-independent) making it safe in hepatic/renal failure",
    ],
  },
  {
    slug: "inhaled-delivery-devices",
    title: "Inhaled Medication Delivery Devices: MDI, DPI, SVN & Ventilator Aerosol",
    shortTitle: "Delivery Devices",
    category: "Aerosol Therapy & Devices",
    icon: "Gauge",
    isFree: true,
    seo: {
      title: "Inhaled Delivery Devices for RRT Exam — MDI, DPI, SVN, Ventilator Aerosol | NurseNest",
      description: "Master inhaled medication delivery devices for NBRC exams. Study MDI technique, DPI instructions, SVN setup, and ventilator aerosol delivery with practice questions.",
      keywords: "inhaled delivery devices RRT, MDI technique exam, DPI respiratory therapy, SVN nebulizer setup, ventilator aerosol delivery NBRC"
    },
    overview: "Inhaled medication delivery devices are fundamental to respiratory therapy practice. Understanding device selection, proper technique, and troubleshooting is essential for the NBRC TMC and CSE exams.",
    highYieldFacts: [
      "MDI with spacer is equivalent to SVN for bronchodilator delivery in stable patients — spacers improve lung deposition from ~10% to ~20%",
      "DPIs are breath-actuated and require inspiratory flow of 30-60 L/min — contraindicated in patients who cannot generate adequate flow",
      "For ventilator aerosol delivery, place MDI adapter or mesh nebulizer 15 cm from the ETT on the inspiratory limb",
    ],
  },
  {
    slug: "side-effects-contraindications",
    title: "Side Effects & Contraindications: Comprehensive Respiratory Drug Safety",
    shortTitle: "Side Effects & Safety",
    category: "Clinical Drug Safety",
    icon: "ShieldAlert",
    isFree: false,
    seo: {
      title: "Drug Side Effects & Contraindications for RRT Exam | NurseNest",
      description: "Comprehensive respiratory drug side effects and contraindications review for NBRC exams. Study drug interactions, adverse effects, and patient safety considerations.",
      keywords: "drug side effects RRT exam, contraindications respiratory medications, drug interactions NBRC, respiratory drug safety, adverse effects bronchodilators corticosteroids"
    },
    overview: "Understanding drug side effects, contraindications, and interactions is one of the highest-yield pharmacology topics on the NBRC TMC exam. Approximately 15-20% of pharmacology questions focus specifically on adverse effects and safety considerations.",
    highYieldFacts: [
      "Tachycardia and tremor are the most common beta-2 agonist side effects — hypokalemia is the most dangerous with frequent dosing",
      "Oral candidiasis from ICS is prevented by mouth rinsing and spacer use — dysphonia (hoarseness) is another common ICS side effect",
      "Anticholinergic side effects: dry mouth (most common), urinary retention, constipation, blurred vision — contraindicated in narrow-angle glaucoma",
    ],
  },
  {
    slug: "pediatric-neonatal-pharmacology",
    title: "Pediatric & Neonatal Respiratory Pharmacology",
    shortTitle: "Peds/Neo Pharm",
    category: "Specialty Populations",
    icon: "Baby",
    isFree: false,
    seo: {
      title: "Pediatric & Neonatal Respiratory Pharmacology for RRT Exam | NurseNest",
      description: "Study pediatric and neonatal respiratory pharmacology for NBRC exams. Cover surfactant therapy, caffeine citrate, nitric oxide, and age-specific medication dosing.",
      keywords: "pediatric respiratory pharmacology RRT, neonatal medications NBRC, surfactant therapy, caffeine citrate apnea, inhaled nitric oxide PPHN"
    },
    overview: "Pediatric and neonatal respiratory pharmacology requires understanding age-specific drug dosing, unique neonatal conditions, and developmental pharmacokinetics.",
    highYieldFacts: [
      "Surfactant (Survanta, Curosurf, Infasurf) is given intratracheally for RDS in premature neonates — prophylactic vs rescue dosing strategies",
      "Caffeine citrate is first-line for apnea of prematurity — loading dose 20 mg/kg, maintenance 5-10 mg/kg daily",
      "Inhaled nitric oxide (iNO) at 20 ppm is first-line for PPHN — selectively dilates pulmonary vasculature without systemic hypotension",
    ],
  },
  {
    slug: "ventilator-linked-pharmacology",
    title: "Ventilator-Linked Pharmacology & Drug-Ventilator Interactions",
    shortTitle: "Vent Pharmacology",
    category: "Critical Care Pharmacology",
    icon: "Monitor",
    isFree: false,
    seo: {
      title: "Ventilator-Linked Pharmacology for RRT Exam | NurseNest",
      description: "Study how medications interact with mechanical ventilation for NBRC exams. Cover sedation protocols, NMBA management, bronchodilator delivery on ventilators.",
      keywords: "ventilator pharmacology RRT, drug ventilator interactions, sedation mechanical ventilation, NMBA monitoring, aerosol delivery ventilator NBRC"
    },
    overview: "Ventilator-linked pharmacology encompasses the complex interactions between medications and mechanical ventilation, including drug delivery through ventilator circuits, sedation management, and pharmacological optimization of ventilator parameters.",
    highYieldFacts: [
      "Aerosol deposition in ventilated patients is only 10-15% with SVN vs 30% with vibrating mesh nebulizer — device selection matters",
      "Sedation vacation (daily spontaneous awakening trial) reduces ventilator days — coordinate with spontaneous breathing trial for liberation protocol",
      "Train-of-four (TOF) monitoring is required during NMBA infusion — target 1-2 twitches out of 4 for adequate paralysis",
    ],
  },
  {
    slug: "surfactant-therapy",
    title: "Exogenous Surfactant Therapy",
    shortTitle: "Surfactant",
    category: "Specialty Populations",
    icon: "Beaker",
    isFree: false,
    seo: {
      title: "Surfactant Therapy for RRT Exam — Neonatal Respiratory Care | NurseNest",
      description: "Master exogenous surfactant therapy for NBRC exams. Study surfactant types, administration techniques, dosing protocols, and clinical monitoring.",
      keywords: "surfactant therapy RRT exam, exogenous surfactant neonatal, Survanta Curosurf Infasurf, surfactant administration technique, RDS treatment NBRC"
    },
    overview: "Exogenous surfactant replacement therapy is one of the most important advances in neonatal respiratory care, dramatically reducing mortality from respiratory distress syndrome (RDS) in premature infants.",
    highYieldFacts: [
      "Natural surfactants (Survanta, Curosurf, Infasurf) contain surfactant proteins and are preferred over synthetic preparations",
      "Administration: intratracheal instillation via ETT in aliquots with position changes — monitor SpO2 and chest rise during dosing",
      "INSURE technique (Intubate-Surfactant-Extubate) and LISA (Less Invasive Surfactant Administration) are modern delivery strategies",
    ],
  },
  {
    slug: "leukotriene-modifiers",
    title: "Leukotriene Modifiers & Anti-Inflammatory Agents",
    shortTitle: "Leukotriene Modifiers",
    category: "Core Respiratory Medications",
    icon: "Pill",
    isFree: false,
    seo: {
      title: "Leukotriene Modifiers for RRT Exam — Montelukast, Zafirlukast | NurseNest",
      description: "Study leukotriene modifier pharmacology for NBRC exams. Cover montelukast, zafirlukast, zileuton with mechanisms, indications, and exam-focused questions.",
      keywords: "leukotriene modifiers RRT exam, montelukast respiratory, zafirlukast NBRC, anti-leukotriene asthma, zileuton pharmacology"
    },
    overview: "Leukotriene modifiers are oral anti-inflammatory agents that block the leukotriene pathway, reducing inflammation, bronchoconstriction, and mucus production in asthma.",
    highYieldFacts: [
      "Montelukast (Singulair) is a leukotriene receptor antagonist (LTRA) — blocks CysLT1 receptors on smooth muscle and inflammatory cells",
      "Leukotrienes are 100-1000x more potent than histamine as bronchoconstrictors — they also increase vascular permeability and mucus secretion",
      "LTRAs are oral medications taken at bedtime — they do NOT replace inhaled corticosteroids as first-line controller therapy",
    ],
  },
  {
    slug: "aerosol-delivery-during-ventilation",
    title: "Aerosol Delivery During Mechanical Ventilation",
    shortTitle: "Vent Aerosol Delivery",
    category: "Aerosol Therapy & Devices",
    icon: "Settings",
    isFree: false,
    seo: {
      title: "Aerosol Delivery During Mechanical Ventilation for RRT Exam | NurseNest",
      description: "Master aerosol drug delivery during mechanical ventilation for NBRC exams. Study MDI vs nebulizer in ventilator circuits, optimal placement, and technique.",
      keywords: "aerosol delivery ventilation RRT, MDI ventilator circuit, nebulizer mechanical ventilation, ventilator aerosol technique NBRC, inhaled drug delivery ICU"
    },
    overview: "Aerosol delivery during mechanical ventilation is a critical respiratory therapy skill that requires understanding of device selection, circuit placement, ventilator settings optimization, and patient-specific factors that affect drug deposition.",
    highYieldFacts: [
      "Vibrating mesh nebulizers deliver 3-5x more drug to the lungs than traditional jet nebulizers during ventilation",
      "MDI with spacer adapter should be placed on the inspiratory limb 15 cm proximal to the Y-piece for optimal delivery",
      "Ventilator settings for optimal aerosol: increase Vt if safe, slow inspiratory flow, use square wave pattern, reduce humidifier temperature",
    ],
  },
];
