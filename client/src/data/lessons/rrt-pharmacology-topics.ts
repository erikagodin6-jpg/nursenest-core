export interface PharmacologyTopicPreview {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  icon: string;
  isFree: boolean;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  overview: string;
  highYieldFacts: string[];
}

export interface PharmacologyTopicPremium {
  indications: string[];
  contraindications: string[];
  sideEffects: string[];
  clinicalReassessment: string[];
  examWritersFocus: string[];
  commonMistakes: string[];
  keyMedications: { name: string; dose: string; route: string; purpose: string }[];
  clinicalPearls: string[];
  quiz: { question: string; options: string[]; correctIndex: number; rationale: string }[];
}

export interface PharmacologyTopic extends PharmacologyTopicPreview, PharmacologyTopicPremium {}

export interface PharmacologyTopicApiResponse extends PharmacologyTopicPreview {
  isPremiumLocked: boolean;
  indications?: string[];
  contraindications?: string[];
  sideEffects?: string[];
  clinicalReassessment?: string[];
  examWritersFocus?: string[];
  commonMistakes?: string[];
  keyMedications?: { name: string; dose: string; route: string; purpose: string }[];
  clinicalPearls?: string[];
  quiz?: { question: string; options: string[]; correctIndex: number; rationale: string }[];
}

export const RRT_PHARMACOLOGY_TOPICS: PharmacologyTopic[] = [
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
    overview: `Bronchodilators are the cornerstone of aerosolized medication therapy in respiratory care. They work by relaxing bronchial smooth muscle to relieve bronchospasm and improve airflow. Two primary classes dominate respiratory pharmacology: beta-2 adrenergic agonists and anticholinergics (parasympatholytics). Beta-2 agonists activate beta-2 receptors on bronchial smooth muscle, increasing intracellular cAMP and causing bronchodilation. They are further classified by duration: short-acting beta-2 agonists (SABAs) like albuterol provide rapid rescue relief lasting 4-6 hours, while long-acting beta-2 agonists (LABAs) like salmeterol and formoterol provide 12-hour maintenance bronchodilation. Anticholinergics block muscarinic (M3) acetylcholine receptors on bronchial smooth muscle and submucosal glands, reducing bronchoconstriction and mucus secretion. Short-acting muscarinic antagonists (SAMAs) like ipratropium have onset in 15-30 minutes with 4-8 hour duration, while long-acting muscarinic antagonists (LAMAs) like tiotropium last 24 hours. For COPD, anticholinergics are considered first-line maintenance therapy because cholinergic tone is the primary reversible component of airflow limitation. For asthma, SABAs remain the first-line rescue medication. Combination products (albuterol + ipratropium as DuoNeb/Combivent) are commonly used in acute exacerbations for additive bronchodilation through dual mechanism pathways.`,
    highYieldFacts: [
      "Albuterol is the most commonly tested bronchodilator on the NBRC TMC — know the standard nebulizer dose (2.5 mg in 3 mL) and MDI dose (90 mcg/puff, 2 puffs)",
      "Levalbuterol (Xopenex) is the R-isomer of albuterol with fewer cardiac side effects but similar bronchodilator efficacy — used when tachycardia limits albuterol use",
      "Ipratropium (Atrovent) has slower onset (15-30 min) than albuterol (5-15 min) — never use as sole rescue medication in acute bronchospasm",
      "Tiotropium (Spiriva) is a once-daily LAMA that is first-line maintenance for COPD — delivered via Respimat or HandiHaler device",
      "LABAs should NEVER be used as monotherapy in asthma — always combine with an inhaled corticosteroid (ICS) to prevent fatal exacerbations",
      "DuoNeb (albuterol + ipratropium) provides additive bronchodilation through dual beta-2 and anticholinergic pathways"
    ],
    indications: [
      "Acute bronchospasm rescue (SABA: albuterol, levalbuterol)",
      "COPD maintenance therapy (LAMA: tiotropium, umeclidinium; LABA: salmeterol, formoterol)",
      "Asthma maintenance combined with ICS (LABA: salmeterol in Advair, formoterol in Symbicort)",
      "Exercise-induced bronchospasm prophylaxis (SABA 15-30 minutes before exercise)",
      "Acute COPD or asthma exacerbation (combination SABA + SAMA)",
      "Bronchospasm reversal in mechanically ventilated patients"
    ],
    contraindications: [
      "Hypersensitivity to the specific medication or excipients (soy lecithin allergy with certain MDIs)",
      "Anticholinergics contraindicated in narrow-angle glaucoma and bladder neck obstruction",
      "LABAs as monotherapy in asthma (FDA Black Box Warning — increased risk of severe exacerbations and death without concurrent ICS)",
      "Use caution with SABAs in patients with severe cardiac arrhythmias or recent myocardial infarction",
      "Ipratropium contraindicated in patients with atropine hypersensitivity"
    ],
    sideEffects: [
      "Beta-2 agonists: tachycardia, palpitations, tremor, hypokalemia, hyperglycemia, anxiety, headache",
      "Anticholinergics: dry mouth (most common), urinary retention, constipation, blurred vision, mydriasis",
      "Paradoxical bronchospasm (rare but possible with any inhaled bronchodilator — discontinue and use alternative)",
      "Hypokalemia from beta-2 agonists shifting potassium intracellularly — monitor electrolytes with frequent dosing",
      "Tolerance to beta-2 agonists with chronic overuse (tachyphylaxis) — may require dose escalation"
    ],
    clinicalReassessment: [
      "Reassess breath sounds, respiratory rate, SpO2, and work of breathing 15-20 minutes after SABA administration",
      "Monitor heart rate before and after beta-2 agonist — hold or reduce dose if HR exceeds 120-130 bpm",
      "Evaluate peak flow or FEV1 before and after bronchodilator to quantify reversibility (12% and 200 mL improvement = positive response)",
      "Check for hypokalemia with serial potassium levels during continuous nebulization in acute exacerbations",
      "Assess for paradoxical bronchospasm — worsening wheezing or dyspnea after treatment indicates need to switch agents"
    ],
    examWritersFocus: [
      "Know the difference between SABA vs LABA onset/duration and when to use each",
      "NBRC loves questions about combination therapy (DuoNeb) — know the components and rationale for dual mechanism",
      "Expect questions about why LABAs must never be used as monotherapy in asthma — the FDA Black Box Warning",
      "Differentiate beta-2 agonist side effects (tachycardia, tremor, hypokalemia) from anticholinergic side effects (dry mouth, urinary retention)",
      "Questions testing levalbuterol vs racemic albuterol — when to switch and why"
    ],
    commonMistakes: [
      "Confusing onset times: albuterol works in 5-15 minutes, ipratropium takes 15-30 minutes — students often reverse these on exams",
      "Forgetting that LABAs require concurrent ICS in asthma — this is a critical safety point tested frequently",
      "Not recognizing that anticholinergics are preferred first-line maintenance in COPD (not beta-2 agonists) because the primary reversible component is cholinergic tone",
      "Overlooking hypokalemia as a side effect of beta-2 agonists — exam questions may present ECG changes (flat T waves, U waves) after aggressive albuterol dosing",
      "Confusing ipratropium (short-acting, 4-8h) with tiotropium (long-acting, 24h) and their dosing frequencies"
    ],
    keyMedications: [
      { name: "Albuterol (Ventolin/ProAir)", dose: "2.5 mg/3 mL nebulizer or 90 mcg/puff MDI (2 puffs q4-6h)", route: "Inhaled via SVN or MDI", purpose: "Short-acting beta-2 agonist for acute bronchospasm rescue and exercise-induced bronchospasm prevention" },
      { name: "Levalbuterol (Xopenex)", dose: "0.63-1.25 mg nebulizer q6-8h", route: "Inhaled via SVN", purpose: "R-isomer SABA with fewer cardiac side effects — alternative when albuterol causes excessive tachycardia" },
      { name: "Ipratropium (Atrovent)", dose: "0.5 mg/2.5 mL nebulizer or 17 mcg/puff MDI (2 puffs QID)", route: "Inhaled via SVN or MDI", purpose: "Short-acting anticholinergic for COPD and adjunct in acute asthma exacerbation" },
      { name: "Tiotropium (Spiriva)", dose: "18 mcg DPI daily or 2.5 mcg Respimat (2 puffs daily)", route: "Inhaled via HandiHaler or Respimat", purpose: "Long-acting anticholinergic for once-daily COPD maintenance therapy" },
      { name: "Salmeterol (Serevent)", dose: "50 mcg DPI BID", route: "Inhaled via Diskus DPI", purpose: "LABA for maintenance bronchodilation — always with ICS in asthma (Advair)" },
      { name: "DuoNeb (albuterol + ipratropium)", dose: "3 mg albuterol + 0.5 mg ipratropium per vial", route: "Inhaled via SVN", purpose: "Combination SABA + SAMA for acute exacerbations providing dual-mechanism bronchodilation" }
    ],
    clinicalPearls: [
      "In acute asthma exacerbation, give continuous albuterol nebulization (10-15 mg/hr) rather than intermittent dosing for severe bronchospasm",
      "The 12% and 200 mL rule for bronchodilator reversibility testing: both criteria must be met for a positive response on PFTs",
      "Ipratropium prevents reflex bronchoconstriction from vagal stimulation — useful before suctioning in ventilated patients",
      "In the ICU, MDI with spacer is as effective as nebulizer for bronchodilator delivery and preferred for infection control",
      "Monitor for paradoxical bronchospasm — if wheezing worsens after treatment, stop the medication and switch to an alternative"
    ],
    quiz: [
      { question: "A COPD patient in the ED is receiving albuterol nebulization every 20 minutes. After the third treatment, HR is 142 bpm. What is the most appropriate action?", options: ["Continue albuterol as ordered", "Switch to levalbuterol to reduce cardiac stimulation", "Discontinue all bronchodilators", "Add ipratropium and continue albuterol at same frequency"], correctIndex: 1, rationale: "Levalbuterol (Xopenex) is the R-isomer of albuterol with equivalent bronchodilator efficacy but fewer cardiac side effects. When albuterol causes excessive tachycardia (HR > 130), switching to levalbuterol maintains bronchodilation while reducing beta-1 cardiac stimulation. Discontinuing all bronchodilators would be harmful in acute exacerbation." },
      { question: "Which medication should NEVER be prescribed as monotherapy for asthma?", options: ["Albuterol", "Ipratropium", "Salmeterol", "Tiotropium"], correctIndex: 2, rationale: "Salmeterol (and all LABAs) carry an FDA Black Box Warning against monotherapy in asthma. LABA monotherapy is associated with increased risk of severe asthma exacerbations and asthma-related death. LABAs must always be combined with an inhaled corticosteroid (ICS) in asthma patients. Albuterol as rescue and ipratropium as adjunct can be used alone." },
      { question: "A respiratory therapist is selecting a first-line maintenance bronchodilator for a newly diagnosed COPD patient. Which is most appropriate?", options: ["Albuterol MDI 2 puffs QID", "Tiotropium 18 mcg via HandiHaler daily", "Salmeterol 50 mcg BID", "Ipratropium 2 puffs QID"], correctIndex: 1, rationale: "GOLD guidelines recommend a LAMA (tiotropium) as first-line maintenance therapy for COPD. Anticholinergics are preferred because the primary reversible component of airflow limitation in COPD is cholinergic tone. Albuterol is a rescue medication, not maintenance. LABAs are second-line. Short-acting ipratropium requires QID dosing, making once-daily tiotropium preferred for adherence." }
    ]
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
      description: "Study inhaled and systemic corticosteroid pharmacology for the NBRC TMC/CSE. Cover beclomethasone, budesonide, fluticasone, prednisone, and methylprednisolone with exam-focused content.",
      keywords: "corticosteroids RRT exam, inhaled steroids respiratory therapy, budesonide, fluticasone, prednisone, methylprednisolone NBRC"
    },
    overview: `Corticosteroids are the most potent anti-inflammatory medications used in respiratory care. They suppress the inflammatory cascade by inhibiting phospholipase A2 (blocking arachidonic acid release), reducing prostaglandin and leukotriene synthesis, decreasing vascular permeability and edema, and suppressing inflammatory cell migration and activation. In respiratory medicine, corticosteroids are used in two primary forms: inhaled corticosteroids (ICS) for chronic maintenance therapy, and systemic corticosteroids (IV or oral) for acute exacerbations. Inhaled corticosteroids are the cornerstone of persistent asthma management across all severity levels. They reduce airway inflammation, decrease bronchial hyperresponsiveness, and prevent airway remodeling. Common ICS agents include beclomethasone, budesonide, fluticasone, ciclesonide, and mometasone. ICS have high topical potency with low systemic bioavailability, minimizing systemic side effects. Systemic corticosteroids (prednisone, prednisolone, methylprednisolone, dexamethasone, hydrocortisone) are used for acute asthma exacerbations, COPD exacerbations, croup, and inflammatory lung diseases. Short courses (5-7 days) are preferred to minimize HPA axis suppression and metabolic side effects.`,
    highYieldFacts: [
      "ICS are the #1 controller medication for persistent asthma — tested heavily on NBRC exams",
      "Budesonide (Pulmicort) is the only ICS approved for nebulization — used in pediatric patients who cannot use MDIs or DPIs",
      "Always rinse mouth after ICS use to prevent oral candidiasis (thrush) — the most commonly tested ICS side effect",
      "Systemic steroids for acute asthma exacerbation: methylprednisolone 125 mg IV or prednisone 40-60 mg PO for 5-7 days",
      "ICS do NOT provide acute bronchodilation — they are maintenance medications with onset over days to weeks",
      "Dexamethasone and budesonide nebulization are used for croup (laryngotracheobronchitis) in pediatrics"
    ],
    indications: [
      "Persistent asthma (all severity levels) — ICS as first-line controller therapy",
      "Acute asthma exacerbation — systemic corticosteroids to reduce inflammation and prevent late-phase response",
      "Acute COPD exacerbation — short course systemic steroids (prednisone 40 mg x 5 days per GOLD guidelines)",
      "Croup (laryngotracheobronchitis) — dexamethasone IM/PO or nebulized budesonide",
      "BPD prevention in premature neonates (antenatal betamethasone for lung maturity)",
      "Post-extubation stridor — IV dexamethasone before planned extubation in high-risk patients"
    ],
    contraindications: [
      "Active untreated fungal infections (systemic corticosteroids)",
      "Systemic herpes simplex infection or varicella (relative contraindication for systemic steroids)",
      "Caution in diabetes — corticosteroids cause significant hyperglycemia",
      "Caution in immunocompromised patients — steroids further suppress immune function",
      "ICS should not be used for acute bronchospasm rescue — they are not bronchodilators"
    ],
    sideEffects: [
      "ICS local effects: oral candidiasis (thrush), dysphonia (hoarseness), pharyngeal irritation — prevented by mouth rinsing and spacer use",
      "Systemic effects (prolonged use): HPA axis suppression, adrenal insufficiency, osteoporosis, hyperglycemia, immunosuppression",
      "Cushing syndrome features with chronic systemic use: moon face, buffalo hump, central obesity, thin skin, easy bruising",
      "Growth suppression in children on chronic ICS — use lowest effective dose and monitor growth",
      "Increased infection risk with systemic steroids — watch for pneumonia, opportunistic infections"
    ],
    clinicalReassessment: [
      "Monitor for oral thrush at each visit in patients on ICS — inspect oral mucosa for white plaques",
      "Assess blood glucose levels in diabetic patients starting systemic corticosteroids — expect significant hyperglycemia",
      "Evaluate asthma control (symptom frequency, nighttime awakenings, rescue inhaler use) to determine ICS step-up or step-down",
      "Monitor growth velocity in pediatric patients on chronic ICS therapy",
      "Assess bone density in patients on long-term systemic corticosteroids"
    ],
    examWritersFocus: [
      "Oral candidiasis prevention with ICS — spacer use and mouth rinsing are the two key interventions tested",
      "Know that budesonide is the only nebulizable ICS — questions about treating young children with persistent asthma",
      "Differentiate ICS (maintenance, anti-inflammatory) from bronchodilators (rescue, smooth muscle relaxation) — a classic exam trap",
      "Systemic steroid dosing for acute exacerbations — methylprednisolone IV vs prednisone PO with correct doses",
      "Antenatal betamethasone for fetal lung maturity — given to mothers at 24-34 weeks gestation to accelerate surfactant production"
    ],
    commonMistakes: [
      "Using ICS as a rescue medication — ICS do not provide immediate bronchodilation and should never be used for acute symptoms",
      "Forgetting spacer use with ICS MDIs — spacers reduce oropharyngeal deposition and oral candidiasis risk by 50%",
      "Confusing inhaled budesonide (Pulmicort Respules for neb) with oral budesonide (Entocort for GI use)",
      "Not tapering systemic corticosteroids after prolonged courses (>2 weeks) — abrupt discontinuation causes adrenal crisis",
      "Assuming all steroids are the same — fluticasone has higher potency per mcg than beclomethasone, affecting dose equivalency"
    ],
    keyMedications: [
      { name: "Beclomethasone (QVAR)", dose: "40-320 mcg/day via MDI", route: "Inhaled MDI with spacer", purpose: "ICS for persistent asthma maintenance — low to high dose depending on severity" },
      { name: "Budesonide (Pulmicort)", dose: "0.25-1 mg via nebulizer BID or 180-360 mcg DPI", route: "Inhaled via SVN or Flexhaler DPI", purpose: "Only nebulizable ICS — used for pediatric patients; also available as DPI for older children and adults" },
      { name: "Fluticasone (Flovent)", dose: "88-880 mcg/day via MDI or DPI", route: "Inhaled MDI or Diskus DPI", purpose: "High-potency ICS for moderate to severe persistent asthma" },
      { name: "Prednisone", dose: "40-60 mg PO daily x 5-7 days", route: "Oral", purpose: "Systemic corticosteroid for acute asthma and COPD exacerbations" },
      { name: "Methylprednisolone (Solu-Medrol)", dose: "125 mg IV q6h initially, then taper", route: "Intravenous", purpose: "IV systemic steroid for severe acute asthma or status asthmaticus" },
      { name: "Dexamethasone (Decadron)", dose: "0.6 mg/kg PO/IM (max 16 mg) single dose", route: "Oral or IM", purpose: "Treatment of croup and post-extubation stridor prevention" }
    ],
    clinicalPearls: [
      "ICS + LABA combination inhalers (Advair, Symbicort, Breo) are the gold standard for moderate-severe persistent asthma",
      "Systemic steroids take 4-6 hours to reach clinical effect — administer early in acute exacerbations alongside bronchodilators",
      "The 'rule of 2s' assesses asthma control: if rescue inhaler needed >2 times/week, nighttime symptoms >2 times/month, or refills >2 canisters/year — step up therapy",
      "Antenatal betamethasone (2 doses, 12 mg IM, 24 hours apart) is given at 24-34 weeks gestation to accelerate fetal lung maturity and surfactant production",
      "In AECOPD, current GOLD guidelines recommend prednisone 40 mg daily for only 5 days — shorter courses are as effective as 14-day courses with fewer side effects"
    ],
    quiz: [
      { question: "A patient on fluticasone MDI develops white patches on the tongue and palate. What is the most appropriate initial intervention?", options: ["Discontinue the ICS and switch to a systemic steroid", "Instruct the patient to rinse mouth after each use and consider adding a spacer", "Start antifungal therapy and continue the ICS without changes", "Reduce the ICS dose by 50%"], correctIndex: 1, rationale: "White oral patches indicate oral candidiasis (thrush), the most common local side effect of ICS. First-line prevention includes mouth rinsing after each use and using a spacer device, which reduces oropharyngeal deposition. If thrush persists despite these measures, antifungal treatment (nystatin swish-and-swallow) may be added while continuing the ICS." },
      { question: "Which corticosteroid can be administered via small-volume nebulizer for a 2-year-old with persistent asthma?", options: ["Fluticasone", "Beclomethasone", "Budesonide", "Mometasone"], correctIndex: 2, rationale: "Budesonide (Pulmicort Respules) is the only ICS available in a nebulizer formulation. This makes it the preferred ICS for young children (under 4-5 years) who cannot effectively use MDIs or DPIs. Fluticasone, beclomethasone, and mometasone are only available as MDI or DPI formulations." },
      { question: "A patient with acute asthma exacerbation is receiving IV methylprednisolone. A student asks why the steroid is given since the patient already received albuterol. What is the best explanation?", options: ["Steroids provide faster bronchodilation than albuterol", "Steroids prevent the late-phase inflammatory response and reduce airway edema", "Steroids directly relax bronchial smooth muscle through beta-2 stimulation", "Steroids work as mucolytics to clear airway secretions"], correctIndex: 1, rationale: "Corticosteroids work by suppressing the inflammatory cascade — they reduce airway edema, decrease mucus production, and prevent the late-phase inflammatory response that causes sustained bronchospasm 4-12 hours after the initial trigger. They do NOT directly bronchodilate. Albuterol provides immediate smooth muscle relaxation while steroids address the underlying inflammation." }
    ]
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
      description: "Study mucolytic pharmacology for NBRC TMC/CSE exams. Cover N-acetylcysteine, dornase alfa (Pulmozyme), and hypertonic saline with indications, side effects, and clinical pearls.",
      keywords: "mucolytics RRT exam, acetylcysteine respiratory, dornase alfa Pulmozyme, hypertonic saline cystic fibrosis, mucokinetic agents NBRC"
    },
    overview: `Mucolytics and mucokinetic agents facilitate airway clearance by altering the physical properties of mucus. These medications are essential in conditions where mucus hypersecretion or abnormal mucus viscosity contributes to airway obstruction. N-acetylcysteine (NAC, Mucomyst) is a classic mucolytic that breaks disulfide bonds in mucus glycoproteins, reducing viscosity. It is administered via nebulizer (3-5 mL of 10% or 20% solution) and has a characteristic sulfur odor. NAC commonly causes bronchospasm, so it should always be administered with a bronchodilator. It is also used orally and IV as the antidote for acetaminophen (Tylenol) overdose. Dornase alfa (Pulmozyme) is a recombinant human DNase enzyme that cleaves extracellular DNA in purulent secretions, reducing mucus viscosity. It is specifically indicated for cystic fibrosis and should not be mixed with other medications in the nebulizer. Hypertonic saline (3-7%) acts as an osmotic mucokinetic agent, drawing water into the airway lumen to hydrate secretions and stimulate cough. It is used in cystic fibrosis, bronchiolitis, and as a diagnostic tool for sputum induction.`,
    highYieldFacts: [
      "NAC (Mucomyst) breaks disulfide bonds in mucus — always pre-treat with a bronchodilator because NAC causes reflex bronchospasm",
      "Dornase alfa (Pulmozyme) breaks down DNA from neutrophils in purulent secretions — indicated specifically for cystic fibrosis",
      "Dornase alfa must NOT be mixed with other nebulizer medications — use a dedicated nebulizer",
      "Hypertonic saline (3-7%) draws water into airways via osmosis — used for both CF therapy and sputum induction for TB diagnosis",
      "NAC is also the antidote for acetaminophen overdose (IV or oral route) — a common cross-topic exam question",
      "Normal saline (0.9%) is not a mucolytic — it is an isotonic solution used as a diluent for other aerosolized medications"
    ],
    indications: [
      "N-acetylcysteine: thick, tenacious mucus in chronic bronchitis, bronchiectasis, and post-operative atelectasis from mucus plugging",
      "Dornase alfa: cystic fibrosis maintenance therapy (age 5+) to reduce sputum viscosity and improve pulmonary function",
      "Hypertonic saline (7%): cystic fibrosis airway clearance adjunct; (3%): bronchiolitis in infants, sputum induction for TB culture",
      "NAC (oral/IV): acetaminophen overdose antidote — given within 8-10 hours of ingestion for maximum hepatoprotection"
    ],
    contraindications: [
      "NAC contraindicated in patients with known hypersensitivity or active bronchospasm without concurrent bronchodilator",
      "Dornase alfa should not be used in non-CF populations — evidence does not support benefit outside cystic fibrosis",
      "Hypertonic saline may trigger severe bronchospasm in asthmatic patients — pre-treat with bronchodilator and monitor closely",
      "Avoid NAC in patients unable to clear mobilized secretions (weak cough, neuromuscular disease) without concurrent airway clearance assistance"
    ],
    sideEffects: [
      "NAC: bronchospasm (most important), nausea, vomiting, stomatitis, rhinorrhea, unpleasant sulfur odor",
      "Dornase alfa: voice alteration, pharyngitis, rash, chest pain, conjunctivitis (generally well-tolerated)",
      "Hypertonic saline: bronchospasm, cough, pharyngitis, increased sputum production (desired therapeutic effect)"
    ],
    clinicalReassessment: [
      "Auscultate breath sounds before and after mucolytic administration — increased adventitious sounds may indicate mobilized secretions requiring suctioning",
      "Monitor for bronchospasm during and after NAC nebulization — have rescue bronchodilator immediately available",
      "Assess cough effectiveness — patients unable to clear mobilized secretions may require suctioning or chest physiotherapy",
      "Track sputum volume, consistency, and color changes as indicators of mucolytic effectiveness"
    ],
    examWritersFocus: [
      "NAC requires concurrent bronchodilator — nearly every exam question about NAC tests this critical point",
      "Dornase alfa is CF-specific — questions testing inappropriate use in non-CF patients (e.g., COPD, pneumonia)",
      "Hypertonic saline for sputum induction — testing concentration (3%) and indication (TB diagnosis, cytology)",
      "Know that NAC is the acetaminophen antidote — cross-topic pharmacology questions are common on CSE"
    ],
    commonMistakes: [
      "Administering NAC without a bronchodilator — this is the #1 mucolytic error on exams",
      "Mixing dornase alfa with other medications in the same nebulizer — it must be delivered alone",
      "Confusing hypertonic saline (mucokinetic) with normal saline (diluent only) — only hypertonic concentrations mobilize secretions",
      "Assuming mucolytics replace airway clearance techniques — they are adjuncts, not replacements for CPT, PEP, or HFCWO"
    ],
    keyMedications: [
      { name: "N-Acetylcysteine (Mucomyst)", dose: "3-5 mL of 10% or 20% solution via nebulizer", route: "Inhaled via SVN with concurrent bronchodilator", purpose: "Mucolytic breaking disulfide bonds in mucus glycoproteins to reduce sputum viscosity" },
      { name: "Dornase Alfa (Pulmozyme)", dose: "2.5 mg (one ampule) via nebulizer once daily", route: "Inhaled via dedicated jet nebulizer", purpose: "DNase enzyme cleaving extracellular DNA in CF sputum — reduces exacerbation frequency and improves FEV1" },
      { name: "Hypertonic Saline (3-7%)", dose: "4 mL of 7% (CF) or 3% (bronchiolitis/sputum induction) via nebulizer", route: "Inhaled via SVN", purpose: "Osmotic mucokinetic drawing water into airways to hydrate secretions and stimulate mucociliary clearance" }
    ],
    clinicalPearls: [
      "In CF, dornase alfa is typically given 30 minutes before airway clearance therapy to maximize mobilized secretion removal",
      "When using NAC, always administer the bronchodilator first, then the mucolytic — this prevents bronchospasm and ensures open airways for mucus mobilization",
      "Hypertonic saline 3% for sputum induction in suspected TB — patient must be in negative pressure isolation room during the procedure",
      "NAC dose for acetaminophen overdose: 140 mg/kg loading dose PO, then 70 mg/kg every 4 hours x 17 additional doses (oral protocol)"
    ],
    quiz: [
      { question: "A respiratory therapist is preparing to administer N-acetylcysteine via nebulizer. What medication should be given concurrently?", options: ["Ipratropium to prevent mucus hypersecretion", "Albuterol to prevent NAC-induced bronchospasm", "Dexamethasone to reduce airway inflammation", "Dornase alfa to enhance mucolytic effect"], correctIndex: 1, rationale: "NAC (Mucomyst) commonly triggers reflex bronchospasm as a side effect. A bronchodilator (albuterol) must always be administered concurrently or immediately before NAC to prevent airway narrowing. This is one of the most commonly tested mucolytic concepts on the NBRC exam." },
      { question: "Which mucolytic is specifically indicated for cystic fibrosis and should NOT be mixed with other nebulizer solutions?", options: ["N-acetylcysteine", "Hypertonic saline 7%", "Dornase alfa", "Normal saline"], correctIndex: 2, rationale: "Dornase alfa (Pulmozyme) is a recombinant DNase enzyme specifically indicated for CF patients. It cleaves the DNA from degraded neutrophils that makes CF sputum extremely viscous. It must be nebulized alone in a dedicated nebulizer and should not be mixed with other medications." }
    ]
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
      description: "Study aerosolized antibiotics and antivirals for the NBRC TMC/CSE. Cover inhaled tobramycin, pentamidine, ribavirin with administration precautions and exam-focused content.",
      keywords: "aerosolized antibiotics RRT exam, inhaled tobramycin, pentamidine PCP prophylaxis, ribavirin RSV, anti-infectives NBRC"
    },
    overview: `Aerosolized anti-infective agents deliver antibiotics and antivirals directly to the respiratory tract, achieving high local drug concentrations while minimizing systemic toxicity. Inhaled tobramycin (TOBI) is an aminoglycoside antibiotic used for chronic Pseudomonas aeruginosa infection in cystic fibrosis patients. It is administered via jet nebulizer or TOBI Podhaler in alternating 28-day on/off cycles. Aerosolized pentamidine is used for prophylaxis against Pneumocystis jirovecii pneumonia (PJP/PCP) in immunocompromised patients, particularly those with HIV/AIDS and CD4 counts below 200. It is delivered monthly via Respirgard II nebulizer in a negative pressure room due to healthcare worker exposure risk. Ribavirin (Virazole) is an antiviral used for severe respiratory syncytial virus (RSV) infection in high-risk infants. It is administered via small particle aerosol generator (SPAG-2) for 12-18 hours per day or intermittent high-dose protocol. Ribavirin is teratogenic and presents significant exposure risks to healthcare workers — pregnant staff must not enter the treatment room.`,
    highYieldFacts: [
      "Inhaled tobramycin (TOBI) is given in 28-day on/off cycles for CF patients with chronic Pseudomonas — always administer AFTER bronchodilator and airway clearance",
      "Pentamidine for PCP prophylaxis requires the Respirgard II nebulizer in a negative pressure room — monthly 300 mg treatments",
      "Ribavirin is teratogenic — pregnant healthcare workers must NOT enter the treatment area; it requires a SPAG-2 generator",
      "Tobramycin monitoring includes serial hearing tests (ototoxicity) and renal function — even inhaled route can cause systemic absorption",
      "Pentamidine can cause hypoglycemia, renal toxicity, and pancreatitis — monitor blood glucose and renal function"
    ],
    indications: [
      "Inhaled tobramycin: chronic Pseudomonas aeruginosa infection in cystic fibrosis (age 6+)",
      "Aerosolized pentamidine: PJP/PCP prophylaxis in HIV/AIDS patients with CD4 < 200 or prior PCP episode",
      "Ribavirin: severe RSV bronchiolitis in high-risk infants (premature, BPD, congenital heart disease, immunocompromised)",
      "Inhaled colistin/polymyxin: MDR gram-negative pneumonia in ventilated ICU patients (off-label adjunctive use)"
    ],
    contraindications: [
      "Ribavirin: pregnancy (FDA Category X — absolutely contraindicated) and breastfeeding",
      "Tobramycin: known aminoglycoside hypersensitivity; use caution in renal impairment and concurrent nephrotoxic drugs",
      "Pentamidine: caution in renal insufficiency, hepatic disease, diabetes, and blood dyscrasias",
      "All aerosolized anti-infectives require appropriate environmental controls to protect healthcare workers from occupational exposure"
    ],
    sideEffects: [
      "Tobramycin: bronchospasm, voice alteration, tinnitus (ototoxicity marker), renal impairment with systemic absorption",
      "Pentamidine: cough, bronchospasm, metallic taste, hypoglycemia, nephrotoxicity, pancreatitis",
      "Ribavirin: bronchospasm, conjunctival irritation, rash, equipment precipitation/clogging, teratogenicity"
    ],
    clinicalReassessment: [
      "Monitor audiometry (hearing tests) every 6 months in patients on chronic inhaled tobramycin for ototoxicity",
      "Check serum creatinine and BUN before and during inhaled aminoglycoside therapy for nephrotoxicity",
      "Monitor blood glucose before and after pentamidine administration for hypoglycemia",
      "Ensure negative pressure room ventilation is functioning during pentamidine and ribavirin administration"
    ],
    examWritersFocus: [
      "Ribavirin delivery device (SPAG-2) and teratogenicity precautions are the most heavily tested anti-infective topics",
      "Pentamidine delivery specifics: Respirgard II nebulizer, 300 mg monthly, negative pressure room",
      "Tobramycin 28-day on/off cycling in CF — questions about sequencing with other CF medications",
      "Healthcare worker safety: pregnant staff contraindication for ribavirin, environmental controls for pentamidine"
    ],
    commonMistakes: [
      "Not knowing that ribavirin requires the SPAG-2 generator (not a standard nebulizer) — this is a critical equipment question",
      "Confusing pentamidine prophylaxis dose (300 mg/month inhaled) with treatment dose (4 mg/kg IV daily)",
      "Forgetting that tobramycin in CF follows a 28-day on / 28-day off cycle — continuous use increases resistance",
      "Overlooking the environmental control requirements — pentamidine and ribavirin must be in negative pressure or well-ventilated rooms"
    ],
    keyMedications: [
      { name: "Tobramycin (TOBI)", dose: "300 mg/5 mL nebulizer BID x 28 days on, 28 days off", route: "Inhaled via PARI LC Plus nebulizer or Podhaler DPI", purpose: "Aminoglycoside targeting chronic Pseudomonas in CF airways" },
      { name: "Pentamidine (NebuPent)", dose: "300 mg via Respirgard II nebulizer monthly", route: "Inhaled via Respirgard II in negative pressure room", purpose: "PCP prophylaxis in immunocompromised patients with CD4 < 200" },
      { name: "Ribavirin (Virazole)", dose: "6 g reconstituted to 20 mg/mL via SPAG-2 for 12-18 hrs/day", route: "Inhaled via small particle aerosol generator (SPAG-2)", purpose: "Antiviral for severe RSV in high-risk infants" }
    ],
    clinicalPearls: [
      "In CF, the correct medication sequence is: bronchodilator → mucolytic (dornase alfa) → airway clearance → inhaled antibiotic (tobramycin)",
      "Ribavirin precipitate clogs ventilator circuits and ET tubes — use one-way valves and change circuits frequently during treatment",
      "Pentamidine does not protect the upper lobes well due to gravitational aerosol distribution — PCP may still occur in apical regions",
      "Healthcare workers administering ribavirin should wear N95 respirators and eye protection; pregnant staff must be reassigned"
    ],
    quiz: [
      { question: "A nurse reports she is 10 weeks pregnant. She has been assigned to care for an infant receiving ribavirin. What should the respiratory therapist recommend?", options: ["Wear an N95 mask during treatment periods only", "Continue care with standard precautions", "Request reassignment — ribavirin is teratogenic and pregnant staff must not be in the treatment area", "Limit exposure to 30 minutes per shift"], correctIndex: 2, rationale: "Ribavirin is classified as FDA Pregnancy Category X — it is absolutely contraindicated in pregnancy due to teratogenic effects. Pregnant healthcare workers must not enter the room during or for a period after ribavirin administration. The only appropriate action is immediate reassignment. PPE does not eliminate the exposure risk sufficiently." }
    ]
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
      description: "Master adrenergic (sympathomimetic) pharmacology for NBRC exams. Study racemic epinephrine for croup, epinephrine in anaphylaxis, and alpha/beta receptor physiology.",
      keywords: "adrenergic medications RRT exam, racemic epinephrine croup, epinephrine anaphylaxis, sympathomimetics respiratory therapy NBRC"
    },
    overview: `Adrenergic medications (sympathomimetics) mimic the effects of the sympathetic nervous system by stimulating alpha and beta adrenergic receptors. In respiratory care, understanding receptor pharmacology is fundamental: alpha-1 receptors cause vasoconstriction and mucosal decongestion; beta-1 receptors increase heart rate and contractility; beta-2 receptors cause bronchodilation, vasodilation, and reduced mast cell mediator release. Racemic epinephrine is a critical respiratory medication used for post-extubation stridor and severe croup. It contains both L-epinephrine (active) and D-epinephrine, stimulating alpha-1 receptors in the subglottic mucosa to cause vasoconstriction and reduce edema. The standard dose is 0.5 mL of 2.25% solution diluted in 3 mL NS via nebulizer. L-epinephrine (1:1000) 5 mL via nebulizer is an alternative when racemic epinephrine is unavailable. Systemic epinephrine (1:1,000 IM or 1:10,000 IV) is the first-line treatment for anaphylaxis, providing bronchodilation (beta-2), vasoconstriction (alpha-1), and cardiac stimulation (beta-1) to counteract the severe allergic response.`,
    highYieldFacts: [
      "Racemic epinephrine 0.5 mL of 2.25% via nebulizer — primary alpha-1 effect reduces subglottic edema in croup and post-extubation stridor",
      "Rebound edema can occur 1-2 hours after racemic epinephrine — observe patients for at least 2-4 hours after treatment",
      "Epinephrine for anaphylaxis: 0.3-0.5 mg (0.3-0.5 mL of 1:1,000) IM in the anterolateral thigh — NOT subcutaneous",
      "Alpha-1: vasoconstriction | Beta-1: heart rate/contractility | Beta-2: bronchodilation — know this receptor classification cold",
      "Phenylephrine is a pure alpha-1 agonist used as a nasal decongestant and vasopressor — no beta activity"
    ],
    indications: [
      "Racemic epinephrine: post-extubation stridor, moderate-severe croup, epiglottitis bridge therapy",
      "Systemic epinephrine: anaphylaxis (first-line), cardiac arrest (ACLS), severe asthma unresponsive to beta-2 agonists",
      "Nebulized L-epinephrine (1:1000): alternative to racemic epinephrine when unavailable",
      "Epinephrine auto-injector (EpiPen): self-administered treatment for known anaphylaxis risk"
    ],
    contraindications: [
      "No absolute contraindications for epinephrine in anaphylaxis — anaphylaxis is a life-threatening emergency",
      "Use caution in patients with severe cardiac disease, uncontrolled hypertension, or tachyarrhythmias",
      "Avoid IV bolus of 1:1,000 epinephrine — can cause fatal arrhythmia; use 1:10,000 concentration for IV administration",
      "Narrow-angle glaucoma and thyrotoxicosis are relative contraindications for racemic epinephrine"
    ],
    sideEffects: [
      "Tachycardia, palpitations, hypertension (beta-1 and alpha-1 stimulation)",
      "Tremor, anxiety, headache (beta-2 and CNS stimulation)",
      "Rebound mucosal edema 1-2 hours after racemic epinephrine (alpha-1 vasoconstriction wears off)",
      "Hyperglycemia (beta-2 mediated glycogenolysis)",
      "Cardiac arrhythmias with excessive dosing or IV administration of incorrect concentration"
    ],
    clinicalReassessment: [
      "Monitor for rebound stridor 1-2 hours after racemic epinephrine — observe minimum 2-4 hours in ED",
      "Assess heart rate, blood pressure, and SpO2 before and after epinephrine administration",
      "In anaphylaxis, reassess airway, breathing, and circulation every 5-15 minutes — repeat epinephrine IM if no improvement in 5-15 minutes",
      "Evaluate work of breathing and stridor severity using Westley croup score before and after treatment"
    ],
    examWritersFocus: [
      "Racemic epinephrine dose and concentration — 0.5 mL of 2.25% via nebulizer for croup/stridor",
      "Rebound edema concept — questions asking about observation period after racemic epinephrine",
      "Epinephrine concentrations: 1:1,000 for IM (anaphylaxis), 1:10,000 for IV (cardiac arrest) — a classic exam trap",
      "Receptor pharmacology: alpha-1 vs beta-1 vs beta-2 effects and which clinical scenarios each addresses"
    ],
    commonMistakes: [
      "Confusing 1:1,000 (IM) with 1:10,000 (IV) epinephrine concentrations — giving 1:1,000 IV is a lethal medication error",
      "Discharging a croup patient immediately after racemic epinephrine without observing for rebound edema",
      "Assuming racemic epinephrine works via beta-2 bronchodilation — its primary respiratory effect is alpha-1 mucosal vasoconstriction",
      "Forgetting that epinephrine has NO absolute contraindications in anaphylaxis — delaying administration costs lives"
    ],
    keyMedications: [
      { name: "Racemic Epinephrine (S2/Vaponefrin)", dose: "0.5 mL of 2.25% in 3 mL NS via nebulizer", route: "Inhaled via SVN", purpose: "Alpha-1 mediated mucosal vasoconstriction for post-extubation stridor and moderate-severe croup" },
      { name: "Epinephrine (Adrenalin) IM", dose: "0.3-0.5 mg (0.3-0.5 mL of 1:1,000) IM", route: "IM injection in anterolateral thigh", purpose: "First-line treatment for anaphylaxis — provides bronchodilation, vasoconstriction, and cardiac support" },
      { name: "Epinephrine IV (cardiac arrest)", dose: "1 mg (10 mL of 1:10,000) IV push q3-5 min", route: "Intravenous", purpose: "ACLS vasopressor for cardiac arrest — improves coronary and cerebral perfusion pressure" },
      { name: "L-Epinephrine (nebulized)", dose: "5 mL of 1:1,000 solution via nebulizer", route: "Inhaled via SVN", purpose: "Alternative to racemic epinephrine when unavailable for croup/stridor management" }
    ],
    clinicalPearls: [
      "In anaphylaxis, epinephrine IM (thigh) is preferred over subcutaneous — faster absorption and more reliable drug levels",
      "After racemic epinephrine for croup, if the child requires more than 2 treatments, consider ICU admission for close airway monitoring",
      "Nebulized epinephrine can be used as a temporizing measure for severe upper airway obstruction while preparing for definitive airway management",
      "Always differentiate alpha-1 effects (vasoconstriction → reduced edema) from beta-2 effects (smooth muscle relaxation → bronchodilation) when selecting respiratory medications"
    ],
    quiz: [
      { question: "A 3-year-old with severe croup receives racemic epinephrine in the ED. Stridor resolves within 15 minutes. The physician considers discharge. What should the respiratory therapist recommend?", options: ["Discharge is appropriate since symptoms have resolved", "Observe for at least 2-4 hours for potential rebound edema before discharge", "Administer a second treatment prophylactically before discharge", "Switch to IV epinephrine for sustained effect"], correctIndex: 1, rationale: "Racemic epinephrine causes transient alpha-1 mediated vasoconstriction in the subglottic mucosa. When the drug wears off (1-2 hours), rebound edema can cause stridor to return, sometimes worse than the initial presentation. All patients receiving racemic epinephrine must be observed for a minimum of 2-4 hours before discharge consideration." }
    ]
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
      description: "Study diuretic pharmacology for respiratory therapists. Cover furosemide, bumetanide, and their role in pulmonary edema, CHF, and fluid management for the NBRC TMC/CSE.",
      keywords: "diuretics RRT exam, furosemide respiratory therapy, pulmonary edema treatment, loop diuretics NBRC, fluid management respiratory"
    },
    overview: `Diuretics are essential medications in cardiopulmonary care, used primarily to manage fluid overload states that compromise respiratory function. Loop diuretics (furosemide, bumetanide, torsemide) inhibit the Na-K-2Cl cotransporter in the thick ascending limb of the loop of Henle, producing potent diuresis. Furosemide (Lasix) is the most commonly used diuretic in acute pulmonary edema and congestive heart failure (CHF) — it reduces preload within minutes when given IV, even before diuresis begins, through direct venodilation. This rapid preload reduction decreases pulmonary capillary hydrostatic pressure and relieves pulmonary edema. Thiazide diuretics (hydrochlorothiazide) work on the distal convoluted tubule and are used for chronic hypertension but are less relevant in acute respiratory care. Potassium-sparing diuretics (spironolactone) block aldosterone in the collecting duct and are used in CHF management for their mortality-reducing benefit. For respiratory therapists, understanding the electrolyte effects of diuretics is critical: loop diuretics cause hypokalemia, hypomagnesemia, and metabolic alkalosis — all of which affect ventilator weaning, cardiac rhythm stability, and respiratory muscle function.`,
    highYieldFacts: [
      "Furosemide IV acts within 5 minutes through venodilation (reducing preload) before diuretic effect begins (15-20 minutes)",
      "Loop diuretics cause hypokalemia — this prolongs QT interval and increases arrhythmia risk, especially with concurrent digoxin",
      "Metabolic alkalosis from loop diuretics causes compensatory hypoventilation — can complicate ventilator weaning",
      "Spironolactone reduces mortality in severe CHF (RALES trial) — potassium-sparing, so monitor for hyperkalemia",
      "Diuretic-induced hypokalemia weakens respiratory muscles (diaphragm) — can contribute to weaning failure"
    ],
    indications: [
      "Acute cardiogenic pulmonary edema — furosemide IV for rapid preload reduction",
      "Decompensated congestive heart failure with fluid overload and respiratory compromise",
      "Fluid overload in mechanically ventilated patients contributing to prolonged ventilator dependence",
      "Cerebral edema (mannitol — osmotic diuretic) in patients with elevated intracranial pressure",
      "Chronic CHF management — spironolactone for mortality reduction"
    ],
    contraindications: [
      "Severe hypovolemia or dehydration — diuresis would worsen circulatory compromise",
      "Anuria or severe renal failure unresponsive to diuretics (relative contraindication for loop diuretics)",
      "Severe electrolyte depletion: hypokalemia < 3.0 mEq/L, hypomagnesemia, or hyponatremia",
      "Spironolactone contraindicated in severe renal impairment (GFR < 30) or hyperkalemia > 5.0 mEq/L",
      "Sulfonamide allergy with furosemide (structural similarity — though cross-reactivity is debated)"
    ],
    sideEffects: [
      "Hypokalemia (loop and thiazide diuretics) — muscle weakness, cardiac arrhythmias, enhanced digoxin toxicity",
      "Metabolic alkalosis from volume contraction and hydrogen ion loss — can impair ventilator weaning",
      "Hypomagnesemia — increases cardiac arrhythmia risk and may cause resistant hypokalemia",
      "Ototoxicity with rapid IV furosemide infusion or concurrent aminoglycoside use",
      "Hypotension and prerenal azotemia from excessive diuresis"
    ],
    clinicalReassessment: [
      "Monitor I&O closely — urine output should increase within 30 minutes of IV furosemide",
      "Check potassium and magnesium levels before and 2-4 hours after IV loop diuretics",
      "Auscultate lung sounds serially — crackles should improve as pulmonary edema resolves",
      "Monitor daily weights — 1 kg weight loss approximates 1 liter of fluid removal",
      "Assess respiratory status for signs of metabolic alkalosis: decreased respiratory rate, shallow breathing"
    ],
    examWritersFocus: [
      "Furosemide's dual mechanism: immediate venodilation (preload reduction) PLUS delayed diuresis — both tested",
      "Electrolyte effects: hypokalemia causing ECG changes and arrhythmia risk, especially with digoxin",
      "Metabolic alkalosis from loop diuretics impacting ventilator weaning — expect ABG interpretation questions",
      "The relationship between fluid balance, preload, and pulmonary edema in mechanically ventilated patients"
    ],
    commonMistakes: [
      "Thinking furosemide only works through diuresis — its immediate venodilation effect provides rapid symptom relief before urine output increases",
      "Not monitoring potassium in patients receiving both loop diuretics and digoxin — hypokalemia enhances digoxin toxicity and can cause fatal arrhythmias",
      "Ignoring the metabolic alkalosis caused by loop diuretics — alkalosis shifts the oxyhemoglobin curve left and impairs oxygen delivery to tissues",
      "Aggressive diuresis in patients with borderline blood pressure — can precipitate cardiogenic shock"
    ],
    keyMedications: [
      { name: "Furosemide (Lasix)", dose: "20-80 mg IV push (acute); 20-80 mg PO daily (chronic)", route: "IV push or oral", purpose: "Loop diuretic for acute pulmonary edema and CHF — reduces preload via venodilation and diuresis" },
      { name: "Bumetanide (Bumex)", dose: "0.5-2 mg IV or PO", route: "IV push or oral", purpose: "Potent loop diuretic (40x potency of furosemide) for furosemide-resistant fluid overload" },
      { name: "Spironolactone (Aldactone)", dose: "12.5-50 mg PO daily", route: "Oral", purpose: "Potassium-sparing aldosterone antagonist for CHF mortality reduction — monitor for hyperkalemia" }
    ],
    clinicalPearls: [
      "In acute pulmonary edema, the treatment triad is: sit the patient upright + IV furosemide + supplemental oxygen or NIV",
      "A negative fluid balance of 1-2 L/day is the typical target in fluid-overloaded ventilated patients",
      "If a patient on loop diuretics develops metabolic alkalosis with compensatory hypoventilation, the ABG shows: elevated pH, elevated HCO3, elevated PaCO2",
      "Replace potassium to >4.0 mEq/L before attempting ventilator weaning — hypokalemia weakens the diaphragm"
    ],
    quiz: [
      { question: "A CHF patient on furosemide and digoxin has an ABG showing pH 7.52, PaCO2 48, HCO3 38. Serum K+ is 2.8 mEq/L. What is the primary concern?", options: ["Respiratory acidosis requiring increased ventilatory support", "Metabolic alkalosis with hypokalemia increasing digoxin toxicity and arrhythmia risk", "Respiratory alkalosis from hyperventilation", "Normal compensatory response requiring no intervention"], correctIndex: 1, rationale: "This ABG shows metabolic alkalosis (elevated pH, elevated HCO3) with appropriate respiratory compensation (elevated PaCO2). The etiology is loop diuretic-induced contraction alkalosis with potassium depletion. The critical concern is that hypokalemia (K+ 2.8) dramatically enhances digoxin toxicity, increasing the risk of fatal cardiac arrhythmias. Urgent potassium replacement is required." }
    ]
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
      description: "Master emergency medications for the NBRC TMC/CSE. Study epinephrine, atropine, vasopressin, and naloxone with ACLS protocols and respiratory emergency applications.",
      keywords: "emergency medications RRT exam, ACLS drugs respiratory therapy, epinephrine cardiac arrest, naloxone respiratory depression, emergency pharmacology NBRC"
    },
    overview: `Emergency medications are a critical component of respiratory therapy practice and are heavily tested on the NBRC TMC and CSE examinations. Respiratory therapists must be proficient in the pharmacology of drugs used during cardiac arrest, respiratory emergencies, and acute airway crises. Epinephrine remains the cornerstone of ACLS cardiac arrest management — 1 mg IV/IO every 3-5 minutes during pulseless arrest. It acts through alpha-1 vasoconstriction to improve coronary and cerebral perfusion pressure. Atropine blocks vagal stimulation to treat symptomatic bradycardia (0.5 mg IV every 3-5 minutes, max 3 mg). Naloxone (Narcan) is the opioid antagonist used to reverse respiratory depression from opioid overdose (0.4-2 mg IV/IM/IN, repeated every 2-3 minutes). Succinylcholine and rocuronium are neuromuscular blocking agents used for rapid sequence intubation (RSI). Sodium bicarbonate is used in specific cardiac arrest situations (known hyperkalemia, known pre-existing metabolic acidosis, tricyclic antidepressant overdose) but is NOT routinely recommended.`,
    highYieldFacts: [
      "Epinephrine 1 mg IV/IO every 3-5 minutes in pulseless arrest — the only vasopressor recommended for all cardiac arrest rhythms",
      "Naloxone onset: IV 1-2 minutes, IM 3-5 minutes, intranasal 3-5 minutes — titrate to restore respiratory effort, not full consciousness",
      "Atropine 0.5 mg IV for symptomatic bradycardia — maximum total dose 3 mg; ineffective in infranodal (Mobitz II, third-degree) blocks",
      "Succinylcholine (1-1.5 mg/kg IV) is a depolarizing NMB with 45-60 second onset — contraindicated in hyperkalemia, burns, crush injuries",
      "Rocuronium (1-1.2 mg/kg IV) is the non-depolarizing alternative with similar onset — can be reversed with sugammadex"
    ],
    indications: [
      "Epinephrine: all pulseless cardiac arrest rhythms (VF, pVT, PEA, asystole), anaphylaxis, severe bronchospasm",
      "Naloxone: opioid-induced respiratory depression (RR < 8-10, pinpoint pupils, decreased consciousness)",
      "Atropine: symptomatic sinus bradycardia with hemodynamic instability",
      "Succinylcholine/Rocuronium: rapid sequence intubation for emergency airway management",
      "Sodium bicarbonate: cardiac arrest with known hyperkalemia or pre-existing metabolic acidosis"
    ],
    contraindications: [
      "Succinylcholine contraindicated in hyperkalemia, malignant hyperthermia history, burn/crush injuries > 24 hours, prolonged immobilization",
      "Atropine should not be used for infranodal blocks (Mobitz II, third-degree) — may worsen block; use transcutaneous pacing",
      "Sodium bicarbonate not routinely recommended in cardiac arrest — can worsen intracellular acidosis",
      "Naloxone: caution in opioid-dependent patients — may precipitate acute withdrawal and pulmonary edema"
    ],
    sideEffects: [
      "Epinephrine: tachycardia, hypertension, arrhythmias, myocardial ischemia",
      "Naloxone: acute opioid withdrawal (agitation, vomiting, pulmonary edema, cardiac arrest in rare cases)",
      "Atropine: tachycardia, dry mouth, urinary retention, mydriasis, confusion in elderly",
      "Succinylcholine: hyperkalemia, malignant hyperthermia, fasciculations, masseter muscle rigidity, bradycardia",
      "Sodium bicarbonate: metabolic alkalosis, hypernatremia, paradoxical intracellular acidosis"
    ],
    clinicalReassessment: [
      "After naloxone: continuously monitor respiratory rate and SpO2 — naloxone duration (30-90 min) is shorter than most opioids, requiring repeated doses or infusion",
      "Post-RSI: confirm ETT placement with continuous waveform capnography, auscultation, and chest X-ray",
      "During ACLS: assess rhythm every 2 minutes, ensure high-quality CPR, and minimize interruptions for drug administration",
      "After atropine for bradycardia: monitor heart rate response — if no response after 3 mg, consider transcutaneous pacing"
    ],
    examWritersFocus: [
      "ACLS drug doses and intervals — epinephrine 1 mg q3-5 min is the most tested",
      "Naloxone titration concept — give enough to restore respirations, not full consciousness (avoid acute withdrawal)",
      "Succinylcholine contraindications — hyperkalemia and malignant hyperthermia are tested in nearly every pharmacology section",
      "Distinguish between depolarizing (succinylcholine) and non-depolarizing (rocuronium) NMBs — mechanism, onset, and reversal"
    ],
    commonMistakes: [
      "Giving excessive naloxone to fully awaken an opioid-dependent patient — this precipitates dangerous acute withdrawal with vomiting, aspiration, and possible cardiac arrest",
      "Using succinylcholine in a burn patient > 24 hours post-injury — upregulated ACh receptors cause massive potassium release and cardiac arrest",
      "Confusing epinephrine doses: cardiac arrest = 1 mg IV (1:10,000); anaphylaxis = 0.3-0.5 mg IM (1:1,000) — wrong route/concentration is fatal",
      "Forgetting that naloxone has a shorter half-life than most opioids — patients may re-narcotize after naloxone wears off"
    ],
    keyMedications: [
      { name: "Epinephrine (ACLS)", dose: "1 mg (10 mL of 1:10,000) IV/IO every 3-5 min", route: "IV or IO", purpose: "Alpha-1 vasopressor improving coronary and cerebral perfusion in cardiac arrest" },
      { name: "Naloxone (Narcan)", dose: "0.4-2 mg IV/IM/IN, may repeat every 2-3 min", route: "IV, IM, or Intranasal", purpose: "Opioid antagonist reversing respiratory depression — titrate to restore adequate ventilation" },
      { name: "Atropine", dose: "0.5 mg IV every 3-5 min (max 3 mg)", route: "IV", purpose: "Vagolytic for symptomatic sinus bradycardia — blocks parasympathetic tone to increase HR" },
      { name: "Rocuronium (Zemuron)", dose: "1-1.2 mg/kg IV for RSI", route: "IV", purpose: "Non-depolarizing NMB for RSI — reversible with sugammadex; preferred over succinylcholine in hyperkalemia" },
      { name: "Succinylcholine (Anectine)", dose: "1-1.5 mg/kg IV", route: "IV", purpose: "Depolarizing NMB for RSI with 45-60 sec onset and 6-10 min duration" }
    ],
    clinicalPearls: [
      "In opioid overdose, prioritize bag-mask ventilation first — naloxone treats the cause but ensuring ventilation/oxygenation is the immediate life-saving intervention",
      "Sugammadex 16 mg/kg can reverse rocuronium within 3 minutes — a game-changer for 'cannot intubate, cannot oxygenate' RSI failures",
      "In cardiac arrest, epinephrine's benefit comes from alpha-1 vasoconstriction (perfusion), not beta-1 cardiac stimulation — give it regardless of the rhythm",
      "Naloxone can be given intranasally (2 mg/spray) when IV access is unavailable — this is the community naloxone formulation"
    ],
    quiz: [
      { question: "A patient who received IV morphine 20 minutes ago now has RR 6, SpO2 84%, and pinpoint pupils. What is the priority action?", options: ["Administer naloxone 2 mg IV push immediately", "Initiate bag-mask ventilation with supplemental oxygen, then administer naloxone 0.4 mg IV titrated to respiratory effort", "Start chest compressions and call a code", "Apply CPAP at 10 cmH2O and monitor"], correctIndex: 1, rationale: "The priority is ensuring oxygenation and ventilation (BVM) while addressing the opioid overdose. Naloxone should be titrated starting at 0.4 mg IV to restore adequate respiratory effort without precipitating full opioid withdrawal. Starting with 2 mg may cause acute withdrawal with vomiting and aspiration. Chest compressions are not indicated — the patient has a pulse with respiratory depression, not cardiac arrest." }
    ]
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
      description: "Study sedation and neuromuscular blocking agents for the NBRC TMC/CSE. Cover propofol, midazolam, dexmedetomidine, cisatracurium, and daily awakening protocols.",
      keywords: "sedation RRT exam, paralytics mechanical ventilation, propofol ICU, dexmedetomidine, cisatracurium NBRC, daily awakening trial"
    },
    overview: `Sedation and neuromuscular blockade are essential components of mechanical ventilation management. Appropriate sedation reduces patient-ventilator dyssynchrony, anxiety, and physiologic stress, while neuromuscular blocking agents (NMBAs) may be required in severe ARDS to optimize ventilation and reduce oxygen consumption. The analgesia-first approach (eFAST protocol) prioritizes pain management before sedation. Fentanyl (25-200 mcg/hr IV) and hydromorphone are first-line analgesics. Propofol (5-80 mcg/kg/min) provides rapid sedation with rapid offset, allowing daily spontaneous awakening trials (SAT) — but can cause propofol infusion syndrome (PRIS) with prolonged high-dose use (metabolic acidosis, rhabdomyolysis, cardiac failure). Dexmedetomidine (0.2-1.5 mcg/kg/hr) is a selective alpha-2 agonist that provides sedation without respiratory depression, making it ideal for transitioning patients to spontaneous breathing modes. Midazolam is a benzodiazepine used less frequently due to accumulation and prolonged sedation. Cisatracurium is the preferred NMBA in ICU due to organ-independent Hofmann elimination. NMBAs must ALWAYS be accompanied by adequate sedation — paralysis without sedation is a terrifying and inhumane experience.`,
    highYieldFacts: [
      "Propofol infusion syndrome (PRIS) occurs with high doses (>80 mcg/kg/min) for >48 hours — monitor triglycerides and CK",
      "Dexmedetomidine does NOT cause respiratory depression — ideal for SBT preparation and extubation bridge",
      "Cisatracurium undergoes Hofmann elimination (temperature/pH-dependent) — no hepatic or renal dose adjustment needed",
      "NMBA patients MUST have Train-of-Four (TOF) monitoring — target 1-2/4 twitches to avoid over-paralysis",
      "Daily SAT (spontaneous awakening trial) paired with SBT (spontaneous breathing trial) reduces ventilator days and ICU mortality"
    ],
    indications: [
      "Sedation: patient-ventilator dyssynchrony, agitation during mechanical ventilation, procedural sedation for bronchoscopy/intubation",
      "NMBAs: severe ARDS with refractory dyssynchrony, dangerously elevated plateau pressures, prone positioning, status epilepticus",
      "Dexmedetomidine: ICU sedation with need to maintain respiratory drive, SBT bridging, alcohol withdrawal",
      "Propofol: rapid-onset sedation requiring daily awakening assessment capability"
    ],
    contraindications: [
      "Propofol: egg/soy allergy (contains egg lecithin and soybean oil), PRIS risk factors, hemodynamic instability",
      "NMBAs without adequate sedation: NEVER paralyze an awake patient — ensure RASS -4 to -5 before initiating NMBAs",
      "Succinylcholine in ICU patients immobilized >48 hours: upregulated ACh receptors cause lethal hyperkalemia",
      "Dexmedetomidine: severe bradycardia, heart block, or hemodynamic instability"
    ],
    sideEffects: [
      "Propofol: hypotension, bradycardia, hypertriglyceridemia, green discoloration of urine, PRIS with prolonged use",
      "Dexmedetomidine: bradycardia, hypotension (initial loading dose), dry mouth",
      "Midazolam: accumulation in renal failure, prolonged sedation, paradoxical agitation, respiratory depression",
      "Cisatracurium: skin flushing, bradycardia, critical illness myopathy with prolonged use",
      "All NMBAs: mask clinical seizures, prevent cough reflex, risk of awareness during paralysis"
    ],
    clinicalReassessment: [
      "Assess sedation level using RASS (Richmond Agitation-Sedation Scale) every 2-4 hours — target RASS 0 to -2 for most patients",
      "Train-of-Four monitoring every 4-8 hours during NMBA infusion — target 1-2/4 twitches",
      "Screen daily for SAT eligibility: no active seizures, no alcohol withdrawal, no neuromuscular blockade, FiO2 ≤ 0.50, PEEP ≤ 8",
      "Monitor triglyceride levels every 48-72 hours in patients receiving propofol — holds if triglycerides >400 mg/dL",
      "Assess for ICU-acquired weakness in patients receiving prolonged NMBAs and/or corticosteroids"
    ],
    examWritersFocus: [
      "RASS scoring and target ranges — know the scale from +4 (combative) to -5 (unarousable)",
      "SAT/SBT pairing protocol — daily awakening trial followed by spontaneous breathing trial",
      "PRIS recognition: metabolic acidosis, elevated CK, hypertriglyceridemia, cardiac failure in patients on propofol",
      "TOF monitoring during NMBAs — target 1-2/4 twitches; why sedation must precede paralysis",
      "Dexmedetomidine's unique property of sedation without respiratory depression"
    ],
    commonMistakes: [
      "Initiating NMBAs without ensuring deep sedation first — TOF 0/4 means complete paralysis, not adequate sedation",
      "Not screening daily for SAT/SBT eligibility — unnecessary prolongation of mechanical ventilation increases morbidity",
      "Confusing RASS (sedation scale) with GCS (consciousness scale) — they measure different things and have different targets",
      "Missing PRIS signs: unexplained metabolic acidosis with elevated lactate and CK in a patient on propofol should trigger immediate drug discontinuation"
    ],
    keyMedications: [
      { name: "Propofol (Diprivan)", dose: "5-80 mcg/kg/min continuous IV infusion", route: "IV infusion", purpose: "Rapid-onset/offset sedation for mechanically ventilated patients — allows daily SAT" },
      { name: "Dexmedetomidine (Precedex)", dose: "0.2-1.5 mcg/kg/hr IV infusion", route: "IV infusion", purpose: "Alpha-2 agonist sedation preserving respiratory drive — ideal for SBT bridging" },
      { name: "Fentanyl", dose: "25-200 mcg/hr IV infusion", route: "IV infusion", purpose: "First-line analgesic in ICU — analgesia-first approach before adding sedation" },
      { name: "Cisatracurium (Nimbex)", dose: "0.15 mg/kg bolus, then 1-3 mcg/kg/min infusion", route: "IV", purpose: "Preferred ICU NMBA with organ-independent Hofmann elimination" },
      { name: "Midazolam (Versed)", dose: "0.5-5 mg/hr IV infusion", route: "IV infusion", purpose: "Benzodiazepine sedation — less preferred due to accumulation; used for alcohol withdrawal or seizures" }
    ],
    clinicalPearls: [
      "The ABC trial demonstrated that pairing daily SAT with SBT reduces ventilator days by 3+ days and ICU mortality — this is standard of care",
      "Propofol provides approximately 1.1 kcal/mL from the lipid emulsion — must be counted in nutritional calculations",
      "When transitioning from propofol to dexmedetomidine for SBT, start dexmedetomidine first and allow it to reach steady state before weaning propofol",
      "Cisatracurium is preferred over vecuronium in ICU because Hofmann elimination is unaffected by hepatic or renal dysfunction"
    ],
    quiz: [
      { question: "A ventilated patient on propofol 80 mcg/kg/min for 72 hours develops metabolic acidosis, CK 15,000, and triglycerides 500 mg/dL. What should be done?", options: ["Increase propofol to achieve deeper sedation", "Immediately discontinue propofol — this presentation suggests propofol infusion syndrome", "Switch to higher-dose midazolam", "Add sodium bicarbonate and continue propofol"], correctIndex: 1, rationale: "This classic presentation (metabolic acidosis, elevated CK indicating rhabdomyolysis, hypertriglyceridemia, prolonged high-dose propofol) is propofol infusion syndrome (PRIS). PRIS is life-threatening and requires immediate propofol discontinuation, hemodynamic support, and renal protection. Continuing propofol or increasing the dose would be fatal." }
    ]
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
      description: "Master aerosol delivery device selection for the NBRC TMC/CSE. Study MDI with spacer, DPI technique, SVN operation, and aerosol delivery during mechanical ventilation.",
      keywords: "inhaled delivery devices RRT exam, MDI spacer technique, DPI dry powder inhaler, small volume nebulizer, ventilator aerosol delivery NBRC"
    },
    overview: `Aerosol delivery device selection and administration technique are core competencies for respiratory therapists and are heavily tested on NBRC examinations. The goal of aerosolized medication delivery is to deposit drug particles in the lower respiratory tract where they can exert therapeutic effect. Particle size is critical: particles 1-5 micrometers (respirable fraction) reach the lower airways and alveoli, while particles >5 micrometers deposit in the oropharynx, and particles <1 micrometer are exhaled without deposition. Metered-dose inhalers (MDIs) use a pressurized canister to deliver a metered dose of medication as an aerosol spray. Proper technique includes shaking, exhaling to FRC, slow deep inhalation (< 60 L/min) coordinated with actuation, followed by 5-10 second breath hold. Spacers (holding chambers) eliminate the need for hand-breath coordination, reduce oropharyngeal deposition by 50-80%, and increase lung deposition — they should be used with all ICS MDIs and recommended for patients with poor coordination. Dry powder inhalers (DPIs) are breath-actuated and require a fast, forceful inhalation (>30-60 L/min) to disaggregate the powder. They do not require hand-breath coordination but need adequate inspiratory flow — making them unsuitable for acute exacerbations or young children. Small-volume nebulizers (SVN/jet nebulizers) use compressed gas (6-8 L/min) to aerosolize liquid medication. Aerosol delivery during mechanical ventilation requires special considerations: place the MDI or nebulizer in the inspiratory limb 6 inches from the Y-connector, coordinate actuation with inspiration, and increase VT or extend inspiratory time to optimize deposition. In-line nebulizers may affect ventilator flow sensing, so monitor for auto-triggering.`,
    highYieldFacts: [
      "Respirable particle size: 1-5 micrometers — this is the most commonly tested aerosol physics fact on NBRC exams",
      "MDI with spacer delivers equivalent medication to SVN — studies show no difference in clinical outcomes when technique is proper",
      "DPI requires FAST deep inhalation (>30-60 L/min) — the opposite of MDI technique (slow inhalation < 60 L/min)",
      "During mechanical ventilation, place MDI adapter or nebulizer 6 inches from Y-connector in the inspiratory limb",
      "Spacers reduce oropharyngeal deposition by 50-80% — critical for ICS to prevent oral candidiasis",
      "SVN gas flow (6-8 L/min) adds to ventilator tidal volume and may affect triggering — adjust trigger sensitivity accordingly"
    ],
    indications: [
      "MDI: bronchodilators, corticosteroids, and combination medications for asthma and COPD maintenance and rescue",
      "MDI with spacer: all ICS administration, pediatric patients, elderly patients, anyone with poor hand-breath coordination",
      "DPI: maintenance medications for patients who can generate adequate inspiratory flow (>30 L/min)",
      "SVN: acute exacerbations, patients unable to use MDI/DPI (young children, severely dyspneic, mechanically ventilated)",
      "In-line nebulizer/MDI: aerosolized medication delivery to mechanically ventilated patients"
    ],
    contraindications: [
      "DPI inappropriate in acute severe exacerbations — patients cannot generate adequate inspiratory flow",
      "DPI not recommended for children under 5-6 years — insufficient inspiratory force",
      "MDI without spacer for ICS — increased oropharyngeal deposition and candidiasis risk",
      "Nebulizer treatment in untreated pneumothorax or hemoptysis (relative) — aerosol may worsen condition"
    ],
    sideEffects: [
      "Improper MDI technique: most medication deposits in oropharynx rather than lungs — reduced efficacy and increased local side effects",
      "SVN treatment: facial deposition causing eye irritation (ipratropium), environmental aerosol exposure (infection control concern)",
      "DPI moisture sensitivity: humid environments can clump powder and reduce drug delivery",
      "In-line nebulizer during ventilation: may affect ventilator triggering, adds flow to circuit, potential for condensate contamination"
    ],
    clinicalReassessment: [
      "Assess inhaler technique at every visit — studies show 50-80% of patients use MDIs incorrectly",
      "Evaluate response to aerosolized therapy: breath sounds, SpO2, respiratory rate, peak flow, and subjective symptom relief",
      "During mechanical ventilation aerosol delivery, monitor for auto-triggering from nebulizer flow",
      "Check MDI canister dose counter — empty canisters float in water but dose counters are more reliable"
    ],
    examWritersFocus: [
      "MDI vs DPI inhalation technique — slow deep for MDI, fast forceful for DPI — this is a major exam differentiator",
      "Spacer benefits: improved coordination, reduced oropharyngeal deposition, increased lung delivery — know all three",
      "Ventilator aerosol delivery setup: device placement, timing with inspiration, circuit considerations",
      "Particle size physics: 1-5 μm for lower airway deposition — questions about why particles >5 μm don't reach the lungs",
      "Patient selection: when to use MDI vs DPI vs SVN based on clinical scenario and patient capability"
    ],
    commonMistakes: [
      "Teaching fast inhalation with MDI — MDI requires SLOW deep breath; fast inhalation causes increased oropharyngeal impaction",
      "Prescribing DPI during an acute asthma exacerbation — the patient cannot generate adequate inspiratory flow when severely dyspneic",
      "Not using a spacer with ICS MDI — this is a major contributor to oral candidiasis and reduced drug delivery to the lungs",
      "Placing the nebulizer at the Y-connector instead of 6 inches upstream during mechanical ventilation — reduces aerosol delivery to the patient"
    ],
    keyMedications: [
      { name: "Albuterol MDI", dose: "90 mcg/puff, 2 puffs q4-6h PRN", route: "MDI with or without spacer", purpose: "Rescue bronchodilator — proper technique: shake, exhale, slow deep inhalation, 10-sec breath hold" },
      { name: "Fluticasone MDI", dose: "44-220 mcg/puff, 2 puffs BID", route: "MDI with spacer (REQUIRED)", purpose: "ICS — spacer reduces oropharyngeal deposition by 50-80%, reducing candidiasis risk" },
      { name: "Tiotropium DPI (HandiHaler)", dose: "18 mcg capsule inhaled once daily", route: "DPI — requires fast, forceful inhalation", purpose: "LAMA for COPD maintenance — breath-actuated, no coordination required" },
      { name: "Albuterol SVN", dose: "2.5 mg/3 mL via jet nebulizer at 6-8 L/min", route: "SVN driven by compressed gas or air", purpose: "Nebulized bronchodilator for acute exacerbations and patients unable to use MDI/DPI" }
    ],
    clinicalPearls: [
      "In the ICU, studies show MDI with spacer adapter is as effective as SVN for bronchodilator delivery in ventilated patients — and has infection control advantages",
      "Teach the 'open mouth' technique for MDI without spacer: hold MDI 4 cm from open mouth, actuate during slow inhalation — reduces oropharyngeal impaction",
      "Mesh nebulizers (vibrating mesh technology) produce consistent particle size with no added gas flow — increasingly preferred for ventilator aerosol delivery",
      "When switching a patient from SVN to MDI, ensure adequate technique education — 4-8 puffs of MDI with spacer ≈ one SVN treatment"
    ],
    quiz: [
      { question: "A respiratory therapist is teaching a patient how to use a DPI (dry powder inhaler). What is the correct inhalation instruction?", options: ["Inhale slowly and deeply, then hold breath for 10 seconds", "Inhale quickly and forcefully to generate enough flow to disaggregate the powder", "Actuate the device during slow exhalation", "Use a spacer to improve drug delivery"], correctIndex: 1, rationale: "DPIs are breath-actuated devices that require fast, forceful inhalation (>30-60 L/min) to create enough turbulent energy to disaggregate the powder into respirable particles. This is the opposite of MDI technique (slow, deep inhalation). Spacers are not used with DPIs — they are designed specifically for MDIs." },
      { question: "During mechanical ventilation, where should an in-line MDI adapter be placed for optimal aerosol delivery?", options: ["At the Y-connector", "At the endotracheal tube connection", "6 inches (15 cm) from the Y-connector in the inspiratory limb", "In the expiratory limb of the circuit"], correctIndex: 2, rationale: "The MDI adapter or nebulizer should be placed approximately 6 inches (15 cm) from the Y-connector in the inspiratory limb. This position allows the aerosol bolus to accumulate in the inspiratory tubing and be delivered as a concentrated dose during the next mechanical breath, optimizing lung deposition. Placing it at the Y-connector or ETT reduces deposition efficiency." }
    ]
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
      description: "Comprehensive review of respiratory medication side effects and contraindications for the NBRC TMC/CSE. Cross-reference chart of adverse effects, drug interactions, and safety monitoring.",
      keywords: "drug side effects RRT exam, respiratory medication contraindications, adverse drug reactions NBRC, medication safety respiratory therapy"
    },
    overview: `Understanding drug side effects, contraindications, and safety monitoring is essential for the respiratory therapist and is tested extensively on the NBRC TMC and CSE. Side effects can be predictable (dose-dependent pharmacological effects) or idiosyncratic (unpredictable, patient-specific). Key concepts include the therapeutic index (ratio of toxic dose to therapeutic dose — narrow therapeutic index drugs like theophylline require close monitoring), drug-drug interactions, and patient-specific factors (renal function, hepatic function, age, pregnancy) that alter drug response. For respiratory medications, the most commonly tested adverse effects include: beta-2 agonist tachycardia and hypokalemia, anticholinergic dry mouth and urinary retention, ICS oral candidiasis and dysphonia, systemic steroid hyperglycemia and HPA suppression, NAC bronchospasm, theophylline toxicity (nausea, arrhythmias, seizures at levels >20 mcg/mL), and NMBA awareness without adequate sedation. Drug interactions of respiratory significance include: theophylline level increases with erythromycin and cimetidine, additive bronchospasm with beta-blockers and beta-2 agonists, enhanced hypokalemia with loop diuretics and beta-2 agonists, and increased bleeding risk with anticoagulants and systemic steroids.`,
    highYieldFacts: [
      "Theophylline therapeutic range: 5-15 mcg/mL (some sources 10-20) — toxicity causes nausea, tachycardia, seizures",
      "Beta-2 agonists + loop diuretics = additive hypokalemia — monitor K+ closely in patients on both",
      "Non-selective beta-blockers (propranolol) can trigger fatal bronchospasm in asthma patients — always use cardioselective (metoprolol) if beta-blocker needed",
      "Theophylline levels increase with erythromycin, cimetidine, ciprofloxacin — decrease with phenytoin, rifampin, smoking",
      "All aerosolized medications can cause paradoxical bronchospasm — immediate intervention: discontinue drug, administer bronchodilator"
    ],
    indications: [
      "Side effect monitoring is required for ALL respiratory medications, not just specific drug classes",
      "Drug interaction screening before adding any new medication to a patient's regimen",
      "Theophylline level monitoring when initiating or changing interacting medications",
      "Renal and hepatic function assessment for dose adjustment of renally or hepatically cleared medications"
    ],
    contraindications: [
      "Non-selective beta-blockers in asthma: may trigger life-threatening bronchospasm",
      "MAO inhibitors with sympathomimetics: risk of severe hypertensive crisis",
      "Concurrent nephrotoxic agents with aminoglycoside antibiotics: additive renal toxicity",
      "Theophylline with CYP1A2 inhibitors without dose reduction: toxicity risk"
    ],
    sideEffects: [
      "Cross-reference: Beta-2 agonists → tachycardia, tremor, hypokalemia, hyperglycemia",
      "Cross-reference: Anticholinergics → dry mouth, urinary retention, constipation, blurred vision, tachycardia",
      "Cross-reference: ICS → oral candidiasis, dysphonia, pharyngeal irritation (local); adrenal suppression (high-dose systemic absorption)",
      "Cross-reference: Systemic steroids → hyperglycemia, immunosuppression, osteoporosis, GI bleeding, HPA suppression",
      "Cross-reference: Theophylline → nausea, vomiting, tachycardia, arrhythmias, seizures (dose-dependent, level >20)",
      "Cross-reference: NMBAs → paralysis awareness, critical illness myopathy, inability to cough or protect airway"
    ],
    clinicalReassessment: [
      "Monitor theophylline levels with initiation, dose changes, and when interacting drugs are added or removed",
      "Check potassium levels after aggressive beta-2 agonist therapy, especially in patients on concurrent diuretics",
      "Assess blood glucose in diabetic patients after starting systemic corticosteroids — anticipate significant hyperglycemia",
      "Perform medication reconciliation at every care transition to identify potential drug interactions"
    ],
    examWritersFocus: [
      "Theophylline drug interactions and toxicity signs — the most commonly tested drug safety topic on NBRC exams",
      "Beta-blocker contraindication in asthma — nearly guaranteed exam question",
      "Paradoxical bronchospasm concept — can occur with any aerosolized medication",
      "Hypokalemia from beta-2 agonist + diuretic combination — clinical significance including ECG changes and arrhythmia risk"
    ],
    commonMistakes: [
      "Prescribing non-selective beta-blockers to asthma patients — always specify cardioselective (beta-1 selective) agents",
      "Not checking theophylline levels after adding erythromycin or ciprofloxacin — these inhibit CYP1A2 and raise theophylline levels 25-50%",
      "Attributing all post-treatment wheezing to treatment failure — paradoxical bronchospasm from the medication itself is a real entity",
      "Ignoring smoking status for theophylline dosing — smoking induces CYP1A2, requiring higher theophylline doses; cessation reduces clearance"
    ],
    keyMedications: [
      { name: "Theophylline (Theo-24)", dose: "Titrate to serum level 5-15 mcg/mL", route: "Oral", purpose: "Methylxanthine bronchodilator with narrow therapeutic index — requires level monitoring" },
      { name: "Metoprolol (Lopressor)", dose: "25-100 mg PO BID", route: "Oral", purpose: "Cardioselective beta-1 blocker — safer than non-selective in patients with reactive airways disease" }
    ],
    clinicalPearls: [
      "The most dangerous drug interaction in respiratory care: non-selective beta-blocker + asthma = potentially fatal bronchospasm",
      "Smoking cessation in theophylline patients requires dose REDUCTION — stopping smoking decreases CYP1A2 activity, raising theophylline levels",
      "When a ventilated patient on NMBAs develops unexplained tachycardia and hypertension, consider inadequate sedation — they may be aware and terrified",
      "ICS oral candidiasis can be virtually eliminated with proper spacer use and mouth rinsing — teach every patient both interventions"
    ],
    quiz: [
      { question: "A patient with asthma and newly diagnosed hypertension is prescribed propranolol. What should the respiratory therapist report to the physician?", options: ["Propranolol is appropriate for this patient", "Propranolol is a non-selective beta-blocker that can trigger bronchospasm in asthma — recommend a cardioselective alternative", "Add albuterol prophylactically and continue propranolol", "Switch the asthma medication to an anticholinergic before starting propranolol"], correctIndex: 1, rationale: "Propranolol is a non-selective beta-blocker that blocks both beta-1 (cardiac) and beta-2 (bronchial) receptors. Blocking beta-2 receptors in asthmatic airways removes the bronchodilating influence of endogenous catecholamines, potentially triggering severe or fatal bronchospasm. The RT should recommend a cardioselective beta-1 blocker (metoprolol, atenolol) which spares beta-2 receptors." }
    ]
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
      description: "Master pediatric and neonatal respiratory pharmacology for the NBRC TMC/CSE. Study surfactant therapy, caffeine for apnea, pediatric dosing, and neonatal-specific medications.",
      keywords: "pediatric respiratory pharmacology RRT exam, neonatal surfactant therapy, caffeine apnea of prematurity, pediatric dosing NBRC"
    },
    overview: `Pediatric and neonatal respiratory pharmacology encompasses medications with unique considerations for developing lungs and immature organ systems. Exogenous surfactant therapy (beractant/Survanta, calfactant/Infasurf, poractant alfa/Curosurf) is administered intratracheally to premature neonates with respiratory distress syndrome (RDS) caused by surfactant deficiency. Surfactant reduces alveolar surface tension, prevents end-expiratory collapse, and improves compliance. It is given as rescue therapy (after RDS diagnosis) or prophylactically (to extremely premature infants <28 weeks). Caffeine citrate is the first-line treatment for apnea of prematurity, acting as a central respiratory stimulant by blocking adenosine receptors. It has a wide therapeutic index and once-daily dosing, making it the preferred methylxanthine over theophylline in neonates. Inhaled nitric oxide (iNO) at 5-20 ppm is a selective pulmonary vasodilator used for persistent pulmonary hypertension of the newborn (PPHN) and hypoxemic respiratory failure in term/near-term neonates. Pediatric aerosol delivery requires age-appropriate devices: nebulizer with face mask for infants, MDI with spacer and mask for toddlers, and MDI with spacer mouthpiece for children >4-5 years.`,
    highYieldFacts: [
      "Surfactant is given intratracheally to premature neonates with RDS — dose: beractant (Survanta) 100 mg/kg (4 mL/kg)",
      "Caffeine citrate loading dose: 20 mg/kg IV, maintenance: 5-10 mg/kg/day — preferred over theophylline for apnea of prematurity",
      "Inhaled nitric oxide (iNO) dose: start at 20 ppm, wean to 5 ppm — used for PPHN in term/near-term neonates",
      "Wean iNO gradually — abrupt discontinuation causes rebound pulmonary hypertension",
      "Budesonide is the only ICS available as nebulizer suspension — critical for toddlers with persistent asthma who can't use MDI/DPI",
      "Always monitor FiO2 in neonates receiving oxygen — retinopathy of prematurity risk with high/fluctuating SpO2"
    ],
    indications: [
      "Surfactant: neonatal RDS from surfactant deficiency in premature infants",
      "Caffeine citrate: apnea of prematurity in neonates <37 weeks gestational age",
      "Inhaled nitric oxide: persistent pulmonary hypertension of the newborn (PPHN), hypoxemic respiratory failure in term neonates",
      "Nebulized budesonide: persistent asthma in children too young for MDI/DPI (typically <4-5 years)",
      "Nebulized epinephrine: moderate-severe croup in children; bronchiolitis (off-label, limited evidence)"
    ],
    contraindications: [
      "Surfactant: no absolute contraindications in RDS — the benefit outweighs risks in surfactant-deficient neonates",
      "iNO: known duct-dependent cardiac lesions (iNO reduces PVR and may compromise systemic circulation in these patients)",
      "Caffeine: seizure disorders (relative — caffeine lowers seizure threshold), significant cardiac arrhythmias",
      "DPI devices: not appropriate for children under 5-6 years — insufficient inspiratory flow generation"
    ],
    sideEffects: [
      "Surfactant: transient desaturation and bradycardia during administration, ET tube obstruction, pulmonary hemorrhage (rare)",
      "Caffeine: tachycardia, jitteriness, feeding intolerance, insomnia, diuresis",
      "Inhaled nitric oxide: methemoglobinemia (monitor metHb levels), rebound pulmonary hypertension with abrupt withdrawal",
      "Oxygen therapy in neonates: retinopathy of prematurity, bronchopulmonary dysplasia from oxidative lung injury"
    ],
    clinicalReassessment: [
      "After surfactant: rapidly improving compliance may require ventilator adjustments — decrease PIP/PEEP to prevent overdistention",
      "Monitor SpO2 targets in premature neonates: 88-95% to balance between hypoxia and ROP risk",
      "Check methemoglobin levels every 24 hours during iNO therapy — discontinue if metHb >5%",
      "Caffeine level monitoring typically not required due to wide therapeutic index — check if poor response or toxicity suspected"
    ],
    examWritersFocus: [
      "Surfactant administration: intratracheal route, dose, and post-administration ventilator management adjustments",
      "Caffeine vs theophylline for apnea of prematurity — why caffeine is preferred (wider therapeutic index, once-daily dosing)",
      "iNO weaning: gradual reduction required to prevent rebound pulmonary hypertension",
      "Age-appropriate device selection: nebulizer + mask for infants, MDI + spacer + mask for toddlers, MDI + spacer for school-age"
    ],
    commonMistakes: [
      "Abruptly stopping iNO — must wean gradually to prevent rebound pulmonary hypertension that can be fatal",
      "Not adjusting ventilator settings after surfactant — compliance improves rapidly, and unchanged settings cause overdistention and air leak",
      "Prescribing DPI to a 3-year-old — children under 5-6 cannot generate adequate inspiratory flow for DPI devices",
      "Confusing caffeine citrate dosing with caffeine base — the citrate salt dose is approximately twice the base dose"
    ],
    keyMedications: [
      { name: "Beractant (Survanta)", dose: "100 mg/kg (4 mL/kg) intratracheal, up to 4 doses q6h", route: "Intratracheal instillation", purpose: "Exogenous surfactant replacing deficient surfactant in premature neonates with RDS" },
      { name: "Caffeine Citrate (Cafcit)", dose: "20 mg/kg IV load, then 5-10 mg/kg/day maintenance", route: "IV or oral", purpose: "Central respiratory stimulant for apnea of prematurity — blocks adenosine receptors" },
      { name: "Inhaled Nitric Oxide (iNO)", dose: "20 ppm initially, wean to 5 ppm before discontinuation", route: "Inhaled via ventilator circuit", purpose: "Selective pulmonary vasodilator for PPHN and neonatal hypoxemic respiratory failure" },
      { name: "Poractant Alfa (Curosurf)", dose: "2.5 mL/kg (200 mg/kg) initial dose intratracheal", route: "Intratracheal instillation", purpose: "Porcine-derived surfactant for neonatal RDS — higher initial dose than beractant" }
    ],
    clinicalPearls: [
      "The INSURE technique (INtubate-SURfactant-Extubate) is increasingly used — give surfactant via brief intubation, then extubate to CPAP",
      "Caffeine is now started prophylactically in very premature infants (<28 weeks) — evidence shows reduced BPD and improved neurodevelopmental outcomes",
      "When iNO response is poor (no improvement in PaO2 within 30-60 minutes), reconsider the diagnosis — iNO works for PPHN but not for structural heart disease",
      "For pediatric aerosol delivery, a properly fitting face mask with seal is more important than the nebulizer type — crying reduces aerosol deposition by 90%"
    ],
    quiz: [
      { question: "A 28-week premature neonate is diagnosed with RDS. After intratracheal surfactant administration, what ventilator change should the respiratory therapist anticipate?", options: ["Increase PIP to maintain adequate tidal volumes", "Decrease PIP/PEEP as compliance rapidly improves to prevent overdistention", "Switch from pressure control to volume control", "Increase FiO2 to compensate for surfactant-related shunting"], correctIndex: 1, rationale: "Surfactant rapidly improves lung compliance by reducing surface tension. If ventilator settings (particularly PIP and PEEP) are not reduced promptly, the improved compliance leads to excessive tidal volumes, overdistention, and potential pneumothorax. The RT must monitor compliance changes closely and decrease pressure settings as compliance improves." }
    ]
  },
  {
    slug: "ventilator-linked-pharmacology",
    title: "Ventilator-Linked Pharmacology: Medications During Mechanical Ventilation",
    shortTitle: "Vent-Linked Pharm",
    category: "Critical Care Pharmacology",
    icon: "Monitor",
    isFree: false,
    seo: {
      title: "Ventilator-Linked Pharmacology for RRT Exam — ICU Medications | NurseNest",
      description: "Study medications used during mechanical ventilation for the NBRC TMC/CSE. Cover aerosol delivery in ventilated patients, surfactant via ETT, iNO, and pharmacologic weaning support.",
      keywords: "ventilator pharmacology RRT exam, medications mechanical ventilation, aerosol delivery ventilator, iNO ventilator, weaning pharmacology NBRC"
    },
    overview: `Ventilator-linked pharmacology encompasses all medications that interact with or are delivered through the mechanical ventilation circuit, as well as drugs that affect ventilator management decisions. Aerosolized medications in ventilated patients have unique delivery challenges: the endotracheal tube, humidification system, and circuit all act as barriers reducing drug deposition to approximately 10-15% of the nebulizer charge (compared to 15-30% in spontaneously breathing patients). To optimize delivery, use MDI with in-line spacer adapter placed in the inspiratory limb 6 inches from the Y, or mesh nebulizer; turn off heated humidifier if possible; use tidal volumes >500 mL; and synchronize actuation with inspiratory phase. Inhaled pulmonary vasodilators (nitric oxide 5-40 ppm, inhaled epoprostenol 10-50 ng/kg/min) selectively dilate pulmonary vasculature in ventilated lung units, improving V/Q matching without systemic hypotension — used in ARDS and right heart failure. Neuromuscular blockers and sedation (covered separately) are critical ventilator-linked medications. Additionally, the RT must understand how medications affect weaning: diuretics correct fluid overload impeding weaning, bronchodilators optimize airflow, corticosteroids reduce airway inflammation, and electrolyte replacement (K+, Mg2+, phosphate) restores respiratory muscle function.`,
    highYieldFacts: [
      "Aerosol delivery through ventilator circuits: only 10-15% of nebulizer charge reaches the patient — positioning and technique matter",
      "Turn off humidifier during MDI delivery in ventilator circuit — humidity increases particle size and impaction",
      "Inhaled epoprostenol is a cost-effective alternative to iNO for selective pulmonary vasodilation in ARDS",
      "Correct hypokalemia (K+ >4.0), hypomagnesemia, and hypophosphatemia before attempting ventilator weaning — these impair diaphragm function",
      "Thyroid hormone replacement may be needed in critically ill patients with non-thyroidal illness syndrome affecting weaning",
      "Mesh nebulizers produce consistent particle size without adding gas flow to the ventilator circuit — preferred over jet nebulizers in ventilation"
    ],
    indications: [
      "In-line bronchodilator delivery for ventilated patients with bronchospasm or elevated airway resistance",
      "Inhaled pulmonary vasodilators (iNO, epoprostenol) for refractory hypoxemia in ARDS with elevated PVR",
      "Surfactant delivery via ETT in neonates with RDS",
      "Inhaled antibiotics (tobramycin, colistin) for ventilator-associated pneumonia (VAP) adjunctive therapy",
      "Pharmacologic optimization for weaning: diuretics, bronchodilators, electrolyte correction, nutritional support"
    ],
    contraindications: [
      "Jet nebulizer flow adds to ventilator tidal volume and may cause auto-triggering — monitor closely or use mesh nebulizer",
      "iNO in left ventricular dysfunction — sudden reduction in PVR can cause pulmonary edema from increased left heart preload",
      "Avoid aerosolized medications in patients with active hemoptysis through the ventilator circuit",
      "Do not attempt weaning while patient is receiving neuromuscular blocking agents — NMBAs must be discontinued first"
    ],
    sideEffects: [
      "Jet nebulizer-induced auto-triggering and tidal volume augmentation during mechanical ventilation",
      "Inhaled epoprostenol: systemic hypotension (less selective than iNO), rebound pulmonary hypertension with discontinuation",
      "Circuit contamination from nebulizer condensate — infection control concern",
      "Theophylline toxicity in ventilated patients receiving concurrent CYP1A2 inhibitors (ciprofloxacin for VAP)"
    ],
    clinicalReassessment: [
      "Monitor peak inspiratory pressure and auto-PEEP during in-line nebulizer treatments — nebulizer flow may affect ventilator mechanics",
      "Assess bronchodilator response in ventilated patients using peak-to-plateau pressure gradient reduction",
      "During iNO therapy: monitor methemoglobin every 24 hours and NO2 levels continuously in the ventilator circuit",
      "Before each SBT: ensure electrolytes optimized, fluid balance neutral, secretions manageable, and nutrition adequate"
    ],
    examWritersFocus: [
      "Ventilator aerosol delivery optimization: device placement, timing, humidification management, tidal volume considerations",
      "iNO vs inhaled epoprostenol: both are selective pulmonary vasodilators used in ARDS — know the differences",
      "Pharmacologic barriers to weaning: fluid overload, bronchospasm, electrolyte depletion, inadequate nutrition, unresolved infection",
      "Mesh nebulizer advantages over jet nebulizer in ventilator circuits — no added gas flow, consistent particle size"
    ],
    commonMistakes: [
      "Not accounting for added gas flow from jet nebulizer during ventilation — 6-8 L/min nebulizer flow adds significantly to delivered tidal volume",
      "Failing to optimize medications before SBT — weaning failure may be pharmacologically reversible (diuretics, bronchodilators, electrolytes)",
      "Confusing selective pulmonary vasodilation (iNO, inhaled epoprostenol) with systemic vasodilators (IV nitroprusside) — only inhaled agents are selective",
      "Using heated humidification during MDI delivery in the ventilator circuit — humidity increases particle size and reduces lung deposition"
    ],
    keyMedications: [
      { name: "Inhaled Epoprostenol (Flolan)", dose: "10-50 ng/kg/min via inline nebulizer in ventilator circuit", route: "Continuous nebulization in ventilator inspiratory limb", purpose: "Selective pulmonary vasodilator alternative to iNO for ARDS-related refractory hypoxemia" },
      { name: "Inhaled Nitric Oxide (INOmax)", dose: "5-40 ppm blended into ventilator circuit", route: "Continuous administration via iNO delivery system", purpose: "Selective pulmonary vasodilator for ARDS, PPHN, and right heart failure in ventilated patients" },
      { name: "Albuterol (in-line)", dose: "2.5 mg SVN or 4-8 puffs MDI via in-line adapter", route: "In-line nebulizer or MDI with spacer in ventilator circuit", purpose: "Bronchodilator for ventilated patients with elevated airway resistance or bronchospasm" }
    ],
    clinicalPearls: [
      "A decrease in peak-to-plateau pressure gradient after bronchodilator in a ventilated patient confirms reversible airway resistance component",
      "Inhaled epoprostenol costs approximately 1/10 of iNO and has similar efficacy — increasingly used as first-line in adult ARDS",
      "For maximum aerosol delivery in ventilated patients: MDI with spacer > mesh nebulizer > jet nebulizer (in terms of efficiency)",
      "The 'pharmacologic readiness for weaning' checklist: bronchospasm treated, fluids balanced, K+ >4.0, Mg2+ >2.0, PO4 >2.5, adequate nutrition, infection controlled"
    ],
    quiz: [
      { question: "A ventilated ARDS patient on 100% FiO2 and PEEP 18 has a PaO2 of 55 mmHg. The team decides to trial inhaled nitric oxide. How does iNO improve oxygenation?", options: ["By directly bronchodilating constricted airways", "By selectively dilating pulmonary vessels in ventilated lung units, improving V/Q matching", "By increasing cardiac output and systemic oxygen delivery", "By reducing FiO2 requirements through alveolar nitrogen displacement"], correctIndex: 1, rationale: "iNO reaches only ventilated alveoli (since it is an inhaled gas). It dilates the pulmonary vasculature surrounding those ventilated units, redirecting blood flow from shunt units (unventilated) to ventilated units. This selective improvement in V/Q matching increases PaO2 without causing systemic vasodilation. It does not bronchodilate or increase cardiac output." }
    ]
  },
  {
    slug: "surfactant-therapy",
    title: "Pulmonary Surfactant Therapy",
    shortTitle: "Surfactant",
    category: "Specialty Populations",
    icon: "Beaker",
    isFree: false,
    seo: {
      title: "Surfactant Therapy for RRT Exam — Neonatal RDS Management | NurseNest",
      description: "Master surfactant replacement therapy for the NBRC TMC/CSE. Study surfactant physiology, Survanta/Curosurf/Infasurf dosing, administration technique, and post-administration management.",
      keywords: "surfactant therapy RRT exam, neonatal RDS surfactant, beractant Survanta, surfactant administration respiratory therapy NBRC"
    },
    overview: `Pulmonary surfactant is a complex mixture of phospholipids (predominantly dipalmitoylphosphatidylcholine, DPPC) and surfactant proteins (SP-A, SP-B, SP-C, SP-D) produced by type II alveolar pneumocytes beginning at approximately 24-28 weeks gestational age, with adequate levels typically achieved by 35-36 weeks. Surfactant reduces alveolar surface tension according to LaPlace's Law (P = 2T/r), preventing end-expiratory alveolar collapse, reducing the work of breathing, and maintaining functional residual capacity. In premature neonates with insufficient surfactant, respiratory distress syndrome (RDS) develops — characterized by diffuse atelectasis, reduced compliance, intrapulmonary shunting, and hypoxemic respiratory failure. Exogenous surfactant replacement therapy has dramatically reduced neonatal mortality. Three commercial preparations are commonly used: beractant (Survanta, bovine-derived), calfactant (Infasurf, calf-derived), and poractant alfa (Curosurf, porcine-derived). Administration involves intratracheal instillation through the endotracheal tube in divided aliquots with position changes to ensure uniform distribution across all lung segments.`,
    highYieldFacts: [
      "Type II alveolar pneumocytes produce surfactant — type I cells are for gas exchange (this is a commonly tested cell type question)",
      "Surfactant production begins at 24-28 weeks gestation, adequate levels at 35-36 weeks — relates to RDS risk by gestational age",
      "LaPlace's Law: P = 2T/r — surfactant reduces surface tension (T), preventing small alveoli from collapsing into larger ones",
      "Lecithin/sphingomyelin (L/S) ratio ≥2:0 indicates lung maturity — measured from amniotic fluid",
      "Surfactant is given intratracheally in divided doses with position changes — typically 4 aliquots (right/left, head up/down)",
      "Post-surfactant: compliance improves rapidly — adjust ventilator settings immediately to prevent overdistention"
    ],
    indications: [
      "Rescue therapy: premature neonates with established RDS (ground-glass appearance on CXR, air bronchograms, FiO2 requirement >0.40)",
      "Prophylactic therapy: extremely premature infants (<28 weeks) at high risk for RDS",
      "ARDS in adults and children (off-label, investigational — mixed evidence)",
      "Meconium aspiration syndrome (off-label — surfactant inactivation by meconium)"
    ],
    contraindications: [
      "No absolute contraindications for surfactant in neonatal RDS — the survival benefit is overwhelming",
      "Relative: pneumothorax should be treated before surfactant administration",
      "Relative: active pulmonary hemorrhage (may worsen with surfactant)",
      "Congenital diaphragmatic hernia — surfactant is not effective (problem is structural, not surfactant deficiency)"
    ],
    sideEffects: [
      "Transient desaturation and bradycardia during instillation (most common — usually resolves within 1-2 minutes)",
      "ETT obstruction or plugging from surfactant (rare but requires immediate suctioning)",
      "Pulmonary hemorrhage (rare, more common in extremely premature infants <750 g)",
      "Rapid compliance improvement leading to overdistention and pneumothorax if ventilator not adjusted"
    ],
    clinicalReassessment: [
      "Monitor SpO2 continuously during and after surfactant administration — expect transient desaturation",
      "Check lung compliance within 15-30 minutes — anticipate PIP reduction needs as compliance improves",
      "Assess chest X-ray 2-6 hours after surfactant for improved aeration and resolution of ground-glass pattern",
      "May repeat surfactant dosing every 6-12 hours for up to 4 doses if persistent FiO2 requirement >0.30"
    ],
    examWritersFocus: [
      "Surfactant physiology: LaPlace's Law, type II pneumocytes, lecithin/sphingomyelin ratio",
      "Administration technique: intratracheal, divided doses, position changes — tested in CSE scenarios",
      "Post-administration ventilator management: decrease PIP/PEEP as compliance improves — critical safety concept",
      "Natural vs synthetic surfactant: natural (animal-derived) preparations contain SP-B and SP-C, offering faster onset"
    ],
    commonMistakes: [
      "Not reducing ventilator pressures after surfactant — improved compliance with unchanged settings causes overdistention and pneumothorax",
      "Suctioning the ETT immediately after surfactant administration — allow 1-2 hours for distribution and absorption before suctioning",
      "Confusing type I alveolar cells (gas exchange) with type II (surfactant production) — one of the most common anatomy errors",
      "Forgetting that antenatal betamethasone accelerates fetal surfactant production — this is a prevention strategy, not treatment"
    ],
    keyMedications: [
      { name: "Beractant (Survanta)", dose: "100 mg/kg (4 mL/kg) intratracheal, up to 4 doses", route: "Intratracheal instillation in 4 aliquots", purpose: "Bovine-derived surfactant for neonatal RDS — most widely used preparation" },
      { name: "Poractant Alfa (Curosurf)", dose: "2.5 mL/kg (200 mg/kg) initial, then 1.25 mL/kg (100 mg/kg) x2", route: "Intratracheal instillation", purpose: "Porcine-derived surfactant — higher initial dose, may have faster onset" },
      { name: "Calfactant (Infasurf)", dose: "3 mL/kg intratracheal, up to 3 doses q12h", route: "Intratracheal instillation", purpose: "Calf lung extract surfactant with highest phospholipid concentration" },
      { name: "Betamethasone (antenatal)", dose: "12 mg IM x 2 doses, 24 hours apart", route: "IM injection to mother", purpose: "Antenatal steroid accelerating fetal surfactant production at 24-34 weeks gestation" }
    ],
    clinicalPearls: [
      "The INSURE technique (Intubate-Surfactant-Extubate to CPAP) reduces ventilator days — increasingly preferred over sustained intubation",
      "LISA (Less Invasive Surfactant Administration) uses a thin catheter to deliver surfactant to spontaneously breathing neonates on CPAP — avoids intubation entirely",
      "Phosphatidylglycerol (PG) present in amniotic fluid confirms lung maturity even when L/S ratio is equivocal",
      "Surfactant dysfunction (inactivation by proteins, meconium, blood) occurs in ARDS, aspiration syndromes — exogenous surfactant may help but evidence is mixed"
    ],
    quiz: [
      { question: "After administering surfactant to a 30-week premature neonate, the RT notices PIP has dropped from 24 to 16 cmH2O with the same set pressure. SpO2 is 98% on 30% FiO2. What does this indicate?", options: ["Surfactant has failed — increase PIP", "ET tube obstruction requiring suctioning", "Improved lung compliance — wean FiO2 and monitor for overdistention", "Pneumothorax development — obtain stat CXR"], correctIndex: 2, rationale: "Decreased PIP with unchanged set pressure (in volume-targeted modes) or increased tidal volume (in pressure-targeted modes) indicates improved lung compliance from surfactant effect. The high SpO2 on low FiO2 confirms improved gas exchange. The RT should wean FiO2 to target SpO2 88-95% and reduce ventilator pressures to prevent overdistention." }
    ]
  },
  {
    slug: "leukotriene-modifiers",
    title: "Leukotriene Modifiers & Mast Cell Stabilizers",
    shortTitle: "Leukotriene Mods",
    category: "Core Respiratory Medications",
    icon: "Pill",
    isFree: false,
    seo: {
      title: "Leukotriene Modifiers for RRT Exam — Montelukast, Cromolyn | NurseNest",
      description: "Study leukotriene receptor antagonists and mast cell stabilizers for the NBRC TMC/CSE. Cover montelukast, zafirlukast, and cromolyn sodium with clinical applications.",
      keywords: "leukotriene modifiers RRT exam, montelukast Singulair, cromolyn sodium, mast cell stabilizers, asthma controller medications NBRC"
    },
    overview: `Leukotriene modifiers and mast cell stabilizers are non-steroidal controller medications used in asthma management. Leukotrienes (LTC4, LTD4, LTE4) are potent inflammatory mediators produced via the lipoxygenase pathway from arachidonic acid. They cause bronchoconstriction (1,000 times more potent than histamine), increase vascular permeability, enhance mucus secretion, and promote inflammatory cell recruitment. Leukotriene receptor antagonists (LTRAs) — montelukast (Singulair) and zafirlukast (Accolate) — block the CysLT1 receptor, preventing leukotriene-mediated bronchoconstriction and inflammation. Montelukast is particularly effective for exercise-induced bronchospasm and aspirin-sensitive asthma. Zileuton (Zyflo) inhibits 5-lipoxygenase, blocking leukotriene synthesis entirely — but requires liver function monitoring due to hepatotoxicity risk. Cromolyn sodium (Intal) and nedocromil are mast cell stabilizers that prevent degranulation, blocking the release of histamine, leukotrienes, and other inflammatory mediators. They are purely prophylactic — they have no bronchodilator activity and are ineffective during acute exacerbations. Cromolyn is extremely safe with minimal side effects, making it useful in pediatric asthma prophylaxis.`,
    highYieldFacts: [
      "Montelukast (Singulair) is taken orally once daily — excellent for exercise-induced bronchospasm and aspirin-sensitive asthma",
      "Cromolyn sodium is a mast cell stabilizer with NO bronchodilator activity — purely prophylactic, give 15-20 min before exercise/allergen exposure",
      "Zileuton requires liver function monitoring — hepatotoxicity risk (LFTs every 3 months for the first year)",
      "LTRAs are second-line controller medications — ICS remain the preferred first-line controller for persistent asthma",
      "Cromolyn is one of the safest respiratory medications — useful in pediatric patients where medication safety is paramount",
      "LTRAs do NOT require mouth rinsing or spacers — oral administration avoids ICS-related local side effects"
    ],
    indications: [
      "Montelukast: mild persistent asthma (alternative to low-dose ICS), exercise-induced bronchospasm prevention, allergic rhinitis",
      "Zafirlukast: mild-moderate persistent asthma as add-on or alternative controller",
      "Zileuton: aspirin-sensitive asthma, moderate-severe asthma as add-on to ICS/LABA",
      "Cromolyn sodium: exercise-induced bronchospasm prophylaxis, allergen-triggered asthma prevention, pediatric asthma"
    ],
    contraindications: [
      "Zileuton: active hepatic disease or transaminases >3x upper limit of normal",
      "Cromolyn: NOT for acute bronchospasm treatment — purely prophylactic",
      "Zafirlukast: known hypersensitivity, active hepatic insufficiency",
      "Note: 2020 FDA warning about neuropsychiatric events with montelukast — monitor for mood changes, suicidal ideation"
    ],
    sideEffects: [
      "Montelukast: headache, GI upset, behavioral/neuropsychiatric effects (FDA boxed warning — mood changes, suicidal ideation)",
      "Zileuton: elevated liver enzymes (hepatotoxicity), headache, GI upset",
      "Zafirlukast: headache, GI upset, rare Churg-Strauss syndrome association",
      "Cromolyn: cough, unpleasant taste, throat irritation (minimal systemic side effects)"
    ],
    clinicalReassessment: [
      "Monitor liver function tests before and during zileuton therapy — every 3 months for the first year",
      "Assess asthma control after 4-6 weeks of LTRA therapy — if inadequate, step up to ICS or ICS/LABA",
      "Screen for neuropsychiatric symptoms in patients on montelukast — FDA boxed warning (2020)",
      "Evaluate exercise tolerance in patients using LTRAs or cromolyn for exercise-induced bronchospasm"
    ],
    examWritersFocus: [
      "Montelukast mechanism: blocks CysLT1 receptor — versus zileuton which blocks 5-lipoxygenase enzyme",
      "Cromolyn as prophylactic-only medication — exam questions testing inappropriate use during acute exacerbation",
      "Zileuton liver monitoring requirement — hepatotoxicity is the most commonly tested LTRA side effect",
      "Aspirin-sensitive asthma triad: asthma + nasal polyps + aspirin sensitivity — LTRAs are particularly effective"
    ],
    commonMistakes: [
      "Using cromolyn during an acute asthma attack — it is purely prophylactic and has zero bronchodilator activity",
      "Prescribing LTRAs as first-line monotherapy for moderate-severe persistent asthma — ICS are first-line; LTRAs are alternatives for mild persistent only",
      "Forgetting zileuton's liver monitoring requirement — hepatotoxicity can be caught early with regular LFT screening",
      "Not recognizing aspirin-sensitive asthma as a specific indication for LTRAs — the leukotriene pathway is particularly relevant in this population"
    ],
    keyMedications: [
      { name: "Montelukast (Singulair)", dose: "10 mg PO daily (adults), 4-5 mg for children", route: "Oral", purpose: "LTRA blocking CysLT1 receptor — alternative controller for mild persistent asthma, exercise-induced bronchospasm, allergic rhinitis" },
      { name: "Zafirlukast (Accolate)", dose: "20 mg PO BID on empty stomach", route: "Oral", purpose: "LTRA for persistent asthma — must be taken 1 hour before or 2 hours after meals" },
      { name: "Zileuton (Zyflo)", dose: "600 mg PO QID or 1200 mg ER BID", route: "Oral", purpose: "5-lipoxygenase inhibitor blocking all leukotriene synthesis — requires liver monitoring" },
      { name: "Cromolyn Sodium (Intal)", dose: "20 mg via nebulizer QID or 2 puffs MDI QID", route: "Inhaled via SVN or MDI", purpose: "Mast cell stabilizer for prophylaxis only — 15-20 min before exercise or allergen exposure" }
    ],
    clinicalPearls: [
      "The aspirin-sensitive asthma triad (Samter's triad): asthma + aspirin sensitivity + nasal polyps — these patients have upregulated leukotriene production and respond exceptionally well to LTRAs",
      "Montelukast is available as chewable tablets for children (4 mg for 2-5 years, 5 mg for 6-14 years) — making it one of the easiest pediatric controller medications",
      "Cromolyn's exceptional safety profile makes it a valuable option for pregnant patients with exercise-induced bronchospasm — Category B medication",
      "If a patient on montelukast develops behavioral changes, mood alterations, or sleep disturbances, consider discontinuation — FDA boxed warning since 2020"
    ],
    quiz: [
      { question: "An asthmatic child is brought to the ED with acute bronchospasm. The parent reports the child takes cromolyn sodium daily. Should cromolyn be given now for the acute exacerbation?", options: ["Yes — increase the cromolyn dose for the acute episode", "No — cromolyn is a prophylactic medication with no bronchodilator activity; administer albuterol for acute rescue", "Yes — but combine it with ipratropium for added effect", "No — switch to montelukast for the acute episode instead"], correctIndex: 1, rationale: "Cromolyn sodium is a mast cell stabilizer that prevents mediator release — it has absolutely no bronchodilator activity and is useless during an acute exacerbation. The correct treatment for acute bronchospasm is a short-acting bronchodilator (albuterol). Cromolyn should be continued as a maintenance prophylactic medication once the acute episode resolves." }
    ]
  },
  {
    slug: "aerosol-delivery-during-ventilation",
    title: "Aerosol Delivery During Mechanical Ventilation & ET Tube Administration",
    shortTitle: "Vent Aerosol Delivery",
    category: "Aerosol Therapy & Devices",
    icon: "Settings",
    isFree: false,
    seo: {
      title: "Aerosol Delivery During Mechanical Ventilation for RRT Exam | NurseNest",
      description: "Master aerosol delivery optimization during mechanical ventilation for the NBRC TMC/CSE. Study MDI adapter placement, mesh nebulizers, spacer technique, and pediatric considerations.",
      keywords: "aerosol delivery mechanical ventilation RRT exam, MDI ventilator adapter, mesh nebulizer ICU, ET tube drug delivery NBRC"
    },
    overview: `Delivering aerosolized medications to mechanically ventilated patients presents unique challenges that the respiratory therapist must master. The endotracheal tube, ventilator circuit, humidification system, and gas flow dynamics all affect aerosol deposition. Drug deposition in ventilated patients is typically 10-15% of the nominal dose compared to 15-30% in spontaneously breathing patients. The RT can optimize delivery through several strategies: device selection (MDI with in-line spacer adapter or mesh nebulizer preferred over jet nebulizer), positioning (inspiratory limb, 6 inches from Y-connector), ventilator settings optimization (VT >500 mL, slow inspiratory flow, end-inspiratory pause), humidification management (turn off active humidification during MDI delivery if possible), and actuating MDI at beginning of inspiration. Mesh nebulizers (vibrating mesh technology) produce a consistent particle size without adding gas flow to the circuit, eliminating jet nebulizer-related tidal volume augmentation and triggering interference. For MDI delivery, 4-8 puffs via the in-line spacer adapter is approximately equivalent to one SVN treatment due to the reduced deposition efficiency. ET tube administration of medications (surfactant, epinephrine during neonatal resuscitation) requires specific techniques to ensure adequate drug delivery past the endotracheal tube to the lung parenchyma.`,
    highYieldFacts: [
      "Aerosol deposition in ventilated patients: only 10-15% — positioning and technique optimization are critical",
      "MDI in ventilator: use in-line spacer adapter, place in inspiratory limb 6 inches from Y, actuate at start of inspiration",
      "Mesh nebulizers: no added gas flow, consistent particle size, do not affect triggering — preferred for ventilated patients",
      "Jet nebulizer: adds 6-8 L/min to circuit → augmented VT and potential auto-triggering; monitor closely",
      "Turn off heated humidifier during MDI delivery — humidity increases particle size and reduces lung deposition",
      "MDI dose for ventilated patients: 4-8 puffs via adapter ≈ 2.5 mg albuterol SVN treatment"
    ],
    indications: [
      "Bronchospasm in ventilated patients — aerosolized bronchodilator via in-line device",
      "Chronic medication administration in long-term ventilated patients (ICS, bronchodilators)",
      "Inhaled antibiotics for ventilator-associated pneumonia (tobramycin, colistin)",
      "Inhaled pulmonary vasodilators for refractory hypoxemia (epoprostenol, iNO)",
      "Surfactant administration via ET tube in neonatal RDS"
    ],
    contraindications: [
      "Active pneumothorax: aerosol delivery may worsen air leak if bronchospasm is exacerbated",
      "Jet nebulizer in spontaneous breathing modes without close monitoring: added flow can cause auto-triggering and patient discomfort",
      "Heated humidification during MDI delivery reduces lung deposition — should be temporarily bypassed if clinically feasible"
    ],
    sideEffects: [
      "Jet nebulizer flow augmentation: increases delivered VT by 6-8 L/min flow, may exceed lung-protective VT targets",
      "Auto-triggering from nebulizer flow: ventilator misinterprets nebulizer flow as patient effort, delivering unintended breaths",
      "Circuit condensate from aerosolized medications: potential infection control risk and ventilator malfunction",
      "Drug deposition on ETT and circuit walls: wasted medication and potential ETT narrowing from accumulated residue"
    ],
    clinicalReassessment: [
      "Monitor for auto-triggering during jet nebulizer treatments: compare set RR with actual delivered RR",
      "Assess airway resistance (PIP - Pplat) before and after bronchodilator delivery to quantify response",
      "Check for circuit condensate accumulation after prolonged nebulization — drain water traps",
      "Evaluate MDI canister remaining doses via dose counter — empty canisters reduce treatment efficacy"
    ],
    examWritersFocus: [
      "MDI adapter placement in ventilator circuit: 6 inches from Y-connector in inspiratory limb — extremely commonly tested",
      "Jet nebulizer vs mesh nebulizer: flow augmentation, triggering interference, and particle size consistency",
      "Optimization strategies: VT, inspiratory flow, humidification, timing — know all factors affecting deposition",
      "Dose equivalence: 4-8 puffs MDI via adapter ≈ one SVN treatment in ventilated patients"
    ],
    commonMistakes: [
      "Placing the MDI adapter at the Y-connector instead of 6 inches upstream — significantly reduces aerosol delivery",
      "Not monitoring for auto-triggering during jet nebulizer treatments — may deliver excessive VT",
      "Keeping heated humidification on during MDI delivery — increases particle size and impaction losses",
      "Assuming same MDI dose works in ventilator as spontaneous breathing — reduced deposition requires 4-8 puffs instead of 2"
    ],
    keyMedications: [
      { name: "Albuterol via in-line MDI", dose: "4-8 puffs (360-720 mcg) via in-line spacer adapter", route: "MDI with spacer in ventilator inspiratory limb", purpose: "Rescue bronchodilator for ventilated patients — actuate at start of mechanical inspiration" },
      { name: "Albuterol via mesh nebulizer", dose: "2.5 mg in 3 mL via inline mesh nebulizer", route: "Mesh nebulizer in ventilator circuit", purpose: "Continuous or intermittent bronchodilation without added gas flow to circuit" },
      { name: "Ipratropium via in-line SVN", dose: "0.5 mg in 2.5 mL via inline jet nebulizer at 6-8 L/min", route: "Jet nebulizer in ventilator circuit", purpose: "Anticholinergic bronchodilation — monitor for flow augmentation and auto-triggering" }
    ],
    clinicalPearls: [
      "The most effective way to deliver aerosol in a ventilated patient: MDI with in-line spacer, 6 inches from Y, actuate early in inspiration, with end-inspiratory pause",
      "When using jet nebulizer in volume-control mode, the nebulizer flow adds to the set VT — consider switching to pressure-control temporarily",
      "If the ventilator has a dedicated 'nebulizer mode,' it compensates for added flow — use this feature when available",
      "For maximum deposition: use dry gas (bypass humidifier) with slow inspiratory flow rate and 1-2 second end-inspiratory pause"
    ],
    quiz: [
      { question: "During albuterol delivery via in-line jet nebulizer, the ventilated patient's displayed respiratory rate increases from 14 to 28 breaths/min despite no change in patient effort. What is the most likely cause?", options: ["Bronchospasm worsening despite treatment", "Auto-triggering from nebulizer gas flow being detected as patient effort", "Increased metabolic demand from the medication", "Ventilator malfunction requiring circuit change"], correctIndex: 1, rationale: "Jet nebulizers add 6-8 L/min of gas flow into the ventilator circuit. This added flow can be misinterpreted by the ventilator's flow or pressure trigger as patient inspiratory effort, causing the ventilator to deliver additional breaths (auto-triggering). The doubled respiratory rate without change in patient effort is classic auto-triggering. Solutions: increase trigger threshold, use mesh nebulizer instead, or manually adjust during treatment." }
    ]
  }
];
