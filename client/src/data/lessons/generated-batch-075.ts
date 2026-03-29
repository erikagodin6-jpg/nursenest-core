import type { LessonContent } from "./types";

export const generatedBatch075Lessons: Record<string, LessonContent> = {
  "personality-disorder-assessment-np": {
    title: "Personality Disorder Assessment: Cluster",
    cellular: { title: "Personality Disorder Neurobiology & Classification", content: "Personality disorders are enduring, inflexible patterns of inner experience and behavior that deviate markedly from cultural expectations, are pervasive across contexts, begin in adolescence or early adulthood, and cause significant distress or functional impairment. The DSM-5-TR classifies personality disorders into three clusters based on shared phenomenology: Cluster A (odd/eccentric — paranoid, schizoid, schizotypal), Cluster B (dramatic/erratic — antisocial, borderline, histrionic, narcissistic), and Cluster C (anxious/fearful — avoidant, dependent, obsessive-compulsive). Borderline personality disorder (BPD) has the most robust neurobiological evidence: reduced prefrontal cortex volume and function (impaired emotion regulation), hyperactive amygdala (emotional hyperreactivity), and disrupted serotonergic and dopaminergic neurotransmission. Dialectical behavior therapy (DBT) is the gold standard psychotherapy for BPD, targeting the core skills deficits of mindfulness, distress tolerance, emotion regulation, and interpersonal effectiveness." },
    riskFactors: ["Childhood trauma, abuse, or neglect (especially for BPD and antisocial PD)", "Insecure attachment patterns in early childhood", "Family history of personality disorders or mood disorders", "Childhood conduct disorder (precursor to antisocial PD)", "Invalidating environment during development (BPD)", "Genetic predisposition (heritability 40-60%)", "Substance use disorders (high comorbidity)"],
    diagnostics: ["Structured clinical interview: thorough developmental, relational, and behavioral history", "DSM-5-TR criteria application for specific personality disorder diagnosis", "Screening instruments: McLean Screening Instrument for BPD, PDQ-4+", "Assess for comorbid conditions: depression, anxiety, PTSD, substance use disorder", "Safety assessment: suicidal ideation, self-harm history, homicidal ideation", "Functional assessment: interpersonal relationships, occupational functioning, legal history", "Rule out medical mimics: thyroid dysfunction, TBI, substance-induced personality change"],
    management: ["DBT is first-line for borderline personality disorder (4 modules: mindfulness, distress tolerance, emotion regulation, interpersonal effectiveness)", "No medication is FDA-approved specifically for personality disorders — pharmacotherapy targets specific symptoms", "Mood instability: mood stabilizers (lamotrigine, valproate) or low-dose atypical antipsychotics", "Cognitive distortions/psychotic-like symptoms: low-dose aripiprazole or olanzapine", "Comorbid depression/anxiety: SSRIs (avoid TCAs in suicidal patients — lethal in overdose)", "Avoid benzodiazepines in BPD (disinhibition, dependence risk, paradoxical agitation)", "Develop safety plan for suicidal ideation and self-harm behaviors"],
    nursingActions: ["Establish clear, consistent therapeutic boundaries from the first encounter", "Use validation and empathic communication (core DBT skill)", "Assess suicide and self-harm risk at every encounter using structured tools (C-SSRS)", "Avoid splitting: maintain consistent treatment team communication", "Refer to DBT program for BPD (evidence-based, structured therapy)", "Document behavioral observations objectively without pejorative language", "Coordinate care with therapy team to maintain unified treatment approach"],
    assessmentFindings: ["Pattern of unstable relationships, self-image, and affect (BPD)", "Impulsive behaviors: self-harm, substance use, reckless spending, sexual impulsivity", "Chronic feelings of emptiness (BPD)", "Identity disturbance (unstable self-image, values, goals)", "Intense fear of abandonment (real or perceived)", "Emotional dysregulation disproportionate to situation", "Cluster A features: social withdrawal, suspiciousness, magical thinking", "Cluster C features: excessive anxiety, need for reassurance, perfectionism"],
    signs: {
      left: ["Stable therapeutic alliance with consistent boundaries", "Engagement in DBT or structured psychotherapy", "Reduced frequency of self-harm episodes", "Developing distress tolerance skills"],
      right: ["Active suicidal ideation with plan", "Escalating self-harm requiring medical intervention", "Splitting staff (idealizing some, devaluing others)", "Treatment disengagement or therapy-interfering behaviors"]
    },
    medications: [
      { name: "Lamotrigine", type: "Mood stabilizer/anticonvulsant", action: "Inhibits voltage-sensitive sodium channels and glutamate release, stabilizing mood and reducing emotional reactivity in BPD", sideEffects: "Stevens-Johnson syndrome (potentially fatal rash — dose-dependent), headache, dizziness, nausea, blurred vision", contra: "History of SJS/TEN, concurrent valproate (doubles lamotrigine levels requiring dose halving)", pearl: "MUST titrate slowly to prevent SJS: 25 mg daily × 2 weeks → 50 mg daily × 2 weeks → target 200 mg daily; ANY rash requires immediate discontinuation and evaluation; most effective mood stabilizer for BPD depressive symptoms" },
      { name: "Aripiprazole", type: "Atypical antipsychotic (partial dopamine agonist)", action: "Partial agonist at D2 and 5-HT1A receptors, antagonist at 5-HT2A; stabilizes dopaminergic tone rather than blocking it entirely", sideEffects: "Akathisia (most common and dose-limiting), insomnia, headache, weight gain (less than olanzapine)", contra: "Dementia-related psychosis (black box: increased stroke/death risk in elderly)", pearl: "Low doses (2-5 mg) used off-label for BPD targeting cognitive-perceptual symptoms, anger, and impulsivity; preferred over olanzapine due to lower metabolic burden" }
    ],
    pearls: ["DBT is the ONLY evidence-based psychotherapy for BPD — refer early and advocate for access", "No medication is FDA-approved for personality disorders — pharmacotherapy targets symptoms, not the disorder", "Avoid benzodiazepines in BPD: risk of disinhibition, paradoxical agitation, and addiction", "Splitting is NOT intentional manipulation — it reflects a genuine inability to integrate positive and negative aspects of relationships (defense mechanism)", "Consistency across the treatment team prevents splitting and maintains therapeutic alliance", "Lamotrigine must be titrated slowly over 6+ weeks to prevent Stevens-Johnson syndrome — never rush titration"],
    quiz: [
      {
        question: "A patient with BPD tells the NP 'You're the only provider who understands me — everyone else is terrible.' How should this be understood?",
        options: ["The patient is genuinely complimenting the NP", "This reflects splitting — the patient is idealizing the NP while devaluing others, a core BPD defense mechanism", "The patient is being manipulative and should be confronted", "This indicates good therapeutic rapport"],
        correct: 1,
        rationale: "Splitting (seeing others as all-good or all-bad) is a core defense mechanism in BPD reflecting inability to integrate positive and negative qualities. It is not intentional manipulation but a genuine cognitive-emotional pattern requiring consistent team communication."
      },
      {
        question: "Which psychotherapy has the strongest evidence base for borderline personality disorder?",
        options: ["Cognitive behavioral therapy (CBT)", "Dialectical behavior therapy (DBT)", "Psychoanalysis", "Eye movement desensitization and reprocessing (EMDR)"],
        correct: 1,
        rationale: "DBT, developed by Marsha Linehan specifically for BPD, is the gold standard treatment with the most robust evidence for reducing self-harm, suicidal behavior, and hospitalizations while improving emotional regulation."
      },
      {
        question: "Why should benzodiazepines be avoided in patients with BPD?",
        options: ["They are ineffective for anxiety", "They cause disinhibition, paradoxical agitation, and have high addiction potential in this population", "They interfere with DBT therapy", "They cause weight gain"],
        correct: 1,
        rationale: "Patients with BPD are at high risk for disinhibition (worsening impulsivity), paradoxical agitation, and substance dependence with benzodiazepines. These medications can actually worsen behavioral dysregulation."
      }
    ]
  },
  "pertussis-management-rpn": {
    title: "Pertussis (Whooping Cough) Management",
    cellular: { title: "Pertussis Pathophysiology", content: "Pertussis is a highly contagious respiratory infection caused by the gram-negative bacterium Bordetella pertussis. The bacteria attach to ciliated respiratory epithelial cells using adhesins (filamentous hemagglutinin, pertactin) and release toxins — pertussis toxin (PT) disrupts cellular signaling causing lymphocytosis and immune dysregulation, while tracheal cytotoxin destroys ciliated cells, impairing the mucociliary escalator. The disease progresses through three stages: catarrhal stage (1-2 weeks: cold-like symptoms, most contagious), paroxysmal stage (1-6 weeks: severe coughing fits with inspiratory whoop, post-tussive vomiting), and convalescent stage (weeks to months: gradual cough resolution). Infants under 6 months are at highest risk for complications including apnea, pneumonia, seizures, and death." },
    riskFactors: ["Unvaccinated or incompletely vaccinated children", "Infants < 6 months (too young for full vaccine series)", "Waning immunity in adolescents and adults (vaccine protection diminishes after 5-10 years)", "Close contact with infected individual", "Household exposure (attack rate 80-90% in susceptible contacts)", "Immunocompromised individuals", "Healthcare workers without recent Tdap booster"],
    diagnostics: ["Nasopharyngeal PCR swab for B. pertussis (most sensitive, fastest result)", "Nasopharyngeal culture (gold standard but takes 7-10 days)", "CBC showing marked lymphocytosis (WBC 20,000-100,000 — more prominent in infants)", "Chest X-ray if pneumonia suspected", "Monitor oxygen saturation during coughing paroxysms", "Document coughing episode characteristics (paroxysms, whoop, post-tussive vomiting)"],
    management: ["Antibiotic treatment: azithromycin (first-line) or erythromycin for 5-14 days", "Antibiotics reduce transmission but do not significantly shorten paroxysmal stage if started late", "Infants < 6 months: hospitalize for observation (apnea risk)", "Supportive care: gentle suctioning, oxygen as needed, small frequent feedings", "Isolate patient with droplet precautions until 5 days of antibiotic therapy completed", "Post-exposure prophylaxis: azithromycin for all close contacts regardless of vaccination status"],
    nursingActions: ["Implement droplet precautions (mask within 3 feet, private room)", "Monitor for apnea episodes in infants (especially during and after coughing paroxysms)", "Maintain oxygen saturation monitoring during coughing episodes", "Provide small, frequent feedings after coughing episodes (to reduce vomiting)", "Suction gently as needed (avoid triggering coughing paroxysms)", "Educate family on vaccination importance and post-exposure prophylaxis"],
    assessmentFindings: ["Paroxysmal coughing fits (rapid, repeated forceful coughs without breathing in between)", "Inspiratory whoop (high-pitched sound at end of coughing paroxysm — may be absent in infants)", "Post-tussive vomiting (vomiting after coughing episodes)", "Cyanosis during paroxysms", "Apnea in young infants (may be the only symptom — no whoop)", "Subconjunctival hemorrhage from forceful coughing"],
    signs: {
      left: ["Catarrhal stage: runny nose, mild cough, low-grade fever", "Mild paroxysmal cough without complications", "Maintaining oral intake between episodes", "Oxygen saturation stable"],
      right: ["Severe paroxysmal coughing with cyanosis", "Apnea episodes in infants", "Post-tussive vomiting with dehydration", "Oxygen desaturation during paroxysms"]
    },
    medications: [{
      name: "Azithromycin",
      type: "Macrolide antibiotic",
      action: "Inhibits bacterial protein synthesis by binding to the 50S ribosomal subunit, killing B. pertussis",
      sideEffects: "Nausea, diarrhea, abdominal pain, rare QT prolongation",
      contra: "Known allergy to macrolides, severe hepatic impairment",
      pearl: "First-line for pertussis treatment AND post-exposure prophylaxis; infants < 1 month: 10 mg/kg/day × 5 days; older children/adults: 500 mg day 1, then 250 mg days 2-5; erythromycin is alternative but less well-tolerated"
    }],
    pearls: ["Pertussis is called the '100-day cough' — paroxysmal coughing can last 6-10 weeks", "Infants under 6 months may NOT whoop — they may present with apnea as the primary symptom", "Antibiotics reduce transmission but don't shorten the cough if started during paroxysmal stage", "Tdap vaccine during pregnancy (27-36 weeks gestation) protects newborns via maternal antibodies", "Post-exposure prophylaxis with azithromycin for ALL close contacts regardless of vaccination status", "The paroxysmal cough can be so severe it causes rib fractures, subconjunctival hemorrhage, and urinary incontinence"],
    quiz: [
      {
        question: "A 2-month-old infant with pertussis stops breathing during a coughing episode. What is the priority concern?",
        options: ["Bronchospasm", "Apnea — the most dangerous complication of pertussis in young infants", "Laryngospasm", "Airway obstruction from mucus"],
        correct: 1,
        rationale: "Apnea is the most life-threatening complication of pertussis in infants under 6 months. Infants may not exhibit the classic whoop but instead have apneic episodes, which is why hospitalization for monitoring is required."
      },
      {
        question: "When should post-exposure prophylaxis be given to household contacts of a pertussis case?",
        options: ["Only to unvaccinated contacts", "Only to children under 5", "To ALL close contacts regardless of vaccination status", "Only if they develop symptoms"],
        correct: 2,
        rationale: "All close contacts should receive azithromycin prophylaxis regardless of vaccination status because vaccine-induced immunity wanes over time and even vaccinated individuals can develop and transmit pertussis."
      },
      {
        question: "Why are antibiotics started even though they won't significantly shorten the coughing stage?",
        options: ["To prevent secondary bacterial infections", "To reduce transmission to vulnerable contacts (especially infants)", "They do shorten the cough if given with a PPI", "To prevent the bacteria from becoming resistant"],
        correct: 1,
        rationale: "The primary benefit of antibiotic therapy during the paroxysmal stage is reducing transmission to others, particularly unvaccinated infants who are at highest risk for complications and death."
      }
    ]
  },
  "pft-interpretation-np": {
    title: "PFT Interpretation",
    cellular: { title: "Pulmonary Function Test Physiology", content: "Pulmonary function tests (PFTs) measure lung volumes, airflow rates, and gas exchange capacity to characterize respiratory pathology. Spirometry, the most fundamental PFT, measures FVC (forced vital capacity — total air exhaled forcefully after full inspiration), FEV1 (volume exhaled in the first second), and the FEV1/FVC ratio. The FEV1/FVC ratio differentiates obstructive from restrictive patterns: a ratio < 0.70 (or below lower limit of normal) indicates obstruction (airflow limitation during exhalation — COPD, asthma), while a normal or elevated ratio with reduced FVC suggests restriction (reduced lung volume — pulmonary fibrosis, chest wall disease, neuromuscular weakness). Diffusing capacity (DLCO) measures the lung's ability to transfer gas across the alveolar-capillary membrane, reduced in emphysema (loss of alveolar surface area) and interstitial lung disease (thickened membrane) but preserved or increased in asthma." },
    riskFactors: ["Smoking history (COPD, emphysema)", "Occupational dust/chemical exposure (pneumoconiosis, asbestosis)", "Connective tissue disease (ILD secondary to RA, scleroderma)", "Drug-induced lung disease (amiodarone, bleomycin, methotrexate)", "Neuromuscular disease (ALS, myasthenia gravis — restrictive pattern)", "Obesity (extrathoracic restriction)", "Alpha-1 antitrypsin deficiency (early-onset emphysema)"],
    diagnostics: ["Spirometry: FVC, FEV1, FEV1/FVC ratio — the foundation of PFT interpretation", "Bronchodilator response: repeat spirometry after albuterol — ≥12% AND ≥200 mL FEV1 improvement = reversible obstruction (asthma)", "Lung volumes: TLC (total lung capacity) — elevated in hyperinflation (COPD), reduced in restriction", "DLCO: reduced in emphysema and ILD; normal or elevated in asthma", "Flow-volume loops: characteristic patterns for upper airway obstruction (variable vs fixed)", "Maximal inspiratory/expiratory pressures (MIP/MEP) for neuromuscular respiratory weakness"],
    management: ["Obstructive pattern with reversibility: diagnose asthma, initiate stepwise therapy", "Obstructive without reversibility: diagnose COPD, classify by GOLD stage using FEV1 %predicted", "Restrictive pattern: differentiate intrinsic (ILD) from extrinsic (chest wall/NM disease) causes with DLCO and imaging", "Reduced DLCO with obstruction: emphysema (not chronic bronchitis)", "Mixed obstructive-restrictive: TLC differentiates — reduced TLC confirms coexisting restriction", "Serial PFTs to monitor disease progression and treatment response"],
    nursingActions: ["Ensure proper spirometry technique: coach patient to inhale completely, blast out fast, and continue for ≥ 6 seconds", "Obtain at least 3 acceptable and reproducible maneuvers (within 150 mL of each other)", "Withhold bronchodilators before testing if reversibility assessment planned", "Document medication use before testing (which inhalers used and when)", "Interpret results using age, sex, height, and race-adjusted predicted values", "Correlate PFT patterns with clinical presentation and imaging findings"],
    assessmentFindings: ["FEV1/FVC < 0.70 with reduced FEV1 (obstructive pattern)", "Normal FEV1/FVC with reduced FVC (possible restriction — confirm with TLC)", "Positive bronchodilator response (≥ 12% and 200 mL FEV1 increase = reversible = asthma)", "Reduced DLCO (emphysema or ILD)", "Increased TLC with hyperinflation (air trapping in COPD)", "Scooped or concave flow-volume loop (obstructive pattern)"],
    signs: {
      left: ["FEV1/FVC > 0.70 with normal volumes (normal PFTs)", "Positive bronchodilator response (reversible obstruction = asthma)", "Mild obstruction: FEV1 60-80% predicted", "Normal DLCO"],
      right: ["FEV1 < 30% predicted (very severe obstruction — GOLD Stage IV)", "Reduced DLCO + obstruction (emphysema with parenchymal destruction)", "Restrictive pattern with TLC < 80% predicted", "Flat flow-volume loop (fixed upper airway obstruction)"]
    },
    medications: [
      { name: "Albuterol (for bronchodilator testing)", type: "Short-acting beta-2 agonist", action: "Relaxes bronchial smooth muscle via beta-2 receptor activation and increased intracellular cAMP, demonstrating airway reversibility when FEV1 improves ≥12% and ≥200 mL", sideEffects: "Tremor, tachycardia, palpitations, hypokalemia", contra: "Hypersensitivity; relative caution in severe cardiac arrhythmias", pearl: "Standard bronchodilator challenge: 4 puffs (400 mcg) albuterol via MDI + spacer, repeat spirometry after 15-20 minutes; positive response (≥12% AND ≥200 mL improvement) distinguishes asthma from COPD" }
    ],
    pearls: ["FEV1/FVC < 0.70 = obstructive; FEV1/FVC normal with reduced FVC = restrictive; confirm restriction with TLC", "Bronchodilator response ≥ 12% AND ≥ 200 mL = reversible obstruction = likely asthma, not COPD", "DLCO differentiates emphysema (reduced) from chronic bronchitis (normal) and asthma (normal/increased)", "TLC is ESSENTIAL to confirm true restriction — low FVC alone can be from obstruction with air trapping", "GOLD staging uses FEV1 %predicted after bronchodilator: I (≥80), II (50-79), III (30-49), IV (<30)", "A scooped (concave) expiratory limb on flow-volume loop is characteristic of obstructive disease"],
    quiz: [
      {
        question: "PFTs show FEV1/FVC of 0.58 with FEV1 45% predicted and no bronchodilator response. What is the diagnosis and GOLD stage?",
        options: ["Asthma — moderate persistent", "COPD GOLD Stage III (severe — FEV1 30-49% predicted)", "Restrictive lung disease", "Normal with poor effort"],
        correct: 1,
        rationale: "FEV1/FVC < 0.70 confirms obstruction. No reversibility with bronchodilator excludes asthma and supports COPD. FEV1 of 45% predicted falls in GOLD Stage III (30-49% = severe)."
      },
      {
        question: "A patient has reduced FVC but normal FEV1/FVC ratio. What is needed to confirm restrictive lung disease?",
        options: ["Repeat spirometry", "Total lung capacity (TLC) measurement — reduced TLC confirms true restriction", "Bronchodilator challenge", "Chest X-ray alone"],
        correct: 1,
        rationale: "Reduced FVC with normal ratio can occur from obstruction with air trapping (not true restriction). TLC measurement is required — reduced TLC confirms intrinsic or extrinsic restriction."
      },
      {
        question: "DLCO is reduced in a patient with obstructive PFTs. What does this suggest?",
        options: ["Chronic bronchitis", "Asthma", "Emphysema — destruction of alveolar-capillary surface area reduces gas transfer", "Upper airway obstruction"],
        correct: 2,
        rationale: "Emphysema destroys alveolar walls, reducing the surface area available for gas diffusion across the alveolar-capillary membrane. Chronic bronchitis (airway disease without parenchymal destruction) has normal DLCO."
      }
    ]
  },
  "pft-obstructive-restrictive-np": {
    title: "PFT: Obstructive vs Restrictive",
    cellular: { title: "Obstructive vs Restrictive Pathophysiology", content: "Obstructive lung diseases (asthma, COPD, bronchiectasis) limit airflow during exhalation due to airway narrowing from inflammation, mucus, smooth muscle constriction, or loss of elastic recoil (emphysema). Air trapping occurs because narrowed airways collapse during forced expiration, increasing residual volume (RV) and functional residual capacity (FRC). Restrictive lung diseases limit lung expansion during inhalation due to intrinsic causes (pulmonary fibrosis, sarcoidosis — reduced lung compliance) or extrinsic causes (chest wall deformity, obesity, neuromuscular weakness, pleural disease — mechanical limitation). The key spirometric distinction is FEV1/FVC ratio: obstructive diseases lower this ratio because FEV1 decreases disproportionately to FVC, while restrictive diseases maintain or increase the ratio because both FEV1 and FVC decrease proportionally (with FVC often decreasing more)." },
    riskFactors: ["Obstructive: smoking (COPD), atopy/allergies (asthma), alpha-1 antitrypsin deficiency, chronic infections (bronchiectasis)", "Restrictive intrinsic: occupational exposure (silicosis, asbestosis), autoimmune disease (scleroderma), drug toxicity (bleomycin, amiodarone), radiation therapy", "Restrictive extrinsic: obesity (BMI > 40), kyphoscoliosis, ankylosing spondylitis, neuromuscular disease (ALS, muscular dystrophy, diaphragm paralysis)", "Pleural disease: large pleural effusion, extensive pleural thickening"],
    diagnostics: ["Spirometry: FEV1/FVC < 0.70 = obstructive; FEV1/FVC normal/elevated with reduced FVC = suggests restriction", "Lung volumes (plethysmography): TLC elevated in obstruction (hyperinflation); TLC reduced in restriction", "RV/TLC ratio: elevated in air trapping (obstructive)", "DLCO: reduced in emphysema and ILD; normal in asthma, chronic bronchitis, and extrinsic restriction", "High-resolution CT chest: distinguish ILD pattern from emphysema distribution", "Maximal inspiratory/expiratory pressures: low MIP/MEP in neuromuscular causes of restriction"],
    management: ["Obstructive disease management: bronchodilators (SABA/LABA), inhaled corticosteroids, pulmonary rehabilitation", "Asthma: stepwise therapy based on control level (GINA guidelines)", "COPD: GOLD classification guides inhaler selection (LAMA, LABA, ICS combinations)", "ILD/fibrosis: antifibrotic agents (pirfenidone, nintedanib for IPF)", "Extrinsic restriction: treat underlying cause (weight loss for obesity, spinal surgery for severe kyphoscoliosis)", "Neuromuscular restriction: non-invasive ventilation (BiPAP), cough assist devices"],
    nursingActions: ["Identify pattern (obstructive vs restrictive) from PFT results before provider visit", "Coach proper spirometry technique for reproducible results", "Correlate PFT pattern with clinical history and imaging", "Educate patients on disease-specific management based on PFT pattern", "Monitor serial PFTs to assess progression or treatment response", "Coordinate pulmonary rehabilitation referral for moderate-severe disease"],
    assessmentFindings: ["Obstructive: prolonged expiratory phase, wheezing, barrel chest (emphysema), hyperresonance on percussion", "Restrictive intrinsic: fine bilateral crackles (fibrosis), clubbing, reduced chest expansion", "Restrictive extrinsic: shallow breathing, use of accessory muscles, chest wall deformity", "Exercise intolerance and dyspnea on exertion (both patterns)", "Oxygen desaturation with activity (advanced disease)"],
    signs: {
      left: ["Mild obstruction: FEV1 60-80% predicted, minimal symptoms with activity", "Mild restriction: TLC 70-80% predicted, exercise tolerance preserved", "Normal DLCO", "Stable serial PFTs"],
      right: ["Severe obstruction: FEV1 < 30%, dyspnea at rest, supplemental O2 required", "Severe restriction: TLC < 50%, progressive dyspnea, hypoxemia", "Rapidly declining FEV1 or FVC (> 150 mL/year decline)", "Reduced DLCO < 40% predicted (advanced parenchymal disease)"]
    },
    medications: [
      { name: "Tiotropium", type: "Long-acting muscarinic antagonist (LAMA)", action: "Blocks M3 muscarinic receptors on bronchial smooth muscle, causing sustained bronchodilation for 24 hours; also reduces mucus secretion", sideEffects: "Dry mouth, urinary retention, constipation, narrow-angle glaucoma exacerbation", contra: "Severe milk protein allergy (lactose inhaler), narrow-angle glaucoma, urinary retention/BPH", pearl: "First-line long-acting bronchodilator for COPD (GOLD Group B-D); once-daily dosing improves adherence; HandiHaler (DPI) or Respimat (soft mist inhaler) — Respimat preferred for patients with poor inspiratory effort" },
      { name: "Pirfenidone", type: "Antifibrotic agent", action: "Reduces fibroblast proliferation, collagen deposition, and TGF-beta-mediated fibrogenesis in the lung, slowing the decline in FVC in idiopathic pulmonary fibrosis", sideEffects: "Nausea, photosensitivity (severe sunburn risk), anorexia, elevated liver enzymes, fatigue", contra: "Severe hepatic impairment, concurrent fluvoxamine (strong CYP1A2 inhibitor)", pearl: "FDA-approved for IPF only; titrate slowly over 2 weeks to target dose (801 mg TID with food); take with food to reduce GI side effects; wear sunscreen and protective clothing daily" }
    ],
    pearls: ["FEV1/FVC ratio is the single most important number in PFT interpretation — it separates obstructive from restrictive", "Never diagnose restriction from spirometry alone — you MUST confirm with TLC (low FVC can occur from air trapping in obstruction)", "DLCO distinguishes emphysema (low) from chronic bronchitis (normal) within obstructive disease", "Mixed obstructive-restrictive pattern: FEV1/FVC reduced AND TLC reduced — both conditions present", "Flow-volume loop shape provides additional diagnostic clues: concave expiratory limb = obstruction; symmetric reduction = restriction", "In IPF, PFTs show classic restrictive pattern (low TLC, low DLCO, normal FEV1/FVC) with progressive decline"],
    quiz: [
      {
        question: "PFTs show FEV1/FVC of 0.82 with FVC 55% predicted and TLC 58% predicted. What pattern is this?",
        options: ["Obstructive", "Restrictive (confirmed by reduced TLC)", "Normal with poor effort", "Mixed obstructive-restrictive"],
        correct: 1,
        rationale: "FEV1/FVC is normal (0.82 > 0.70), ruling out obstruction. Both FVC and TLC are reduced, confirming true restrictive lung disease. The next step is determining intrinsic vs extrinsic cause with DLCO and imaging."
      },
      {
        question: "Why can't restriction be diagnosed from spirometry alone?",
        options: ["Spirometry is not accurate enough", "Low FVC can result from air trapping in obstructive disease — TLC is needed to confirm true restriction", "Spirometry cannot measure FEV1 accurately", "Restriction always has normal spirometry"],
        correct: 1,
        rationale: "In obstructive disease, air trapping increases RV, which reduces the measured FVC. This can mimic a restrictive pattern on spirometry. Only TLC measurement (via plethysmography) can differentiate — elevated TLC = obstruction with air trapping, reduced TLC = true restriction."
      },
      {
        question: "A patient has obstructive PFTs with normal DLCO. What obstructive disease does this favor?",
        options: ["Emphysema", "Chronic bronchitis or asthma (airways disease without parenchymal destruction)", "Pulmonary fibrosis", "Pulmonary hypertension"],
        correct: 1,
        rationale: "Normal DLCO in the setting of obstruction indicates preserved alveolar-capillary surface area, favoring chronic bronchitis (airway disease) or asthma over emphysema (which destroys alveoli, reducing DLCO)."
      }
    ]
  },
  "pharmacodynamics-np": {
    title: "Pharmacodynamics",
    cellular: { title: "Drug-Receptor Interaction Principles", content: "Pharmacodynamics describes what a drug does to the body — the biochemical and physiological effects mediated through drug-receptor interactions. Most drugs exert effects by binding to specific receptors (proteins on cell surfaces or intracellularly) to either activate them (agonists) or block them (antagonists). Key pharmacodynamic concepts include: potency (concentration of drug needed to produce 50% maximal effect — EC50), efficacy (maximum effect a drug can produce regardless of dose), and therapeutic index (ratio of TD50/ED50, indicating the margin between therapeutic and toxic doses). The dose-response relationship follows a sigmoidal curve on a log-dose plot, with the steep portion representing the dosing range where small changes produce large effect changes. Receptor interactions are further classified as competitive (reversible, surmountable by increasing agonist dose) or non-competitive (irreversible or allosteric, reducing maximum response regardless of agonist concentration)." },
    riskFactors: ["Genetic polymorphisms affecting receptor density or sensitivity (pharmacogenomics)", "Drug-drug interactions at receptor level (competitive antagonism)", "Receptor up/down-regulation with chronic drug exposure (tolerance, tachyphylaxis)", "Age-related changes in receptor sensitivity (elderly more sensitive to CNS drugs)", "Organ dysfunction altering drug response (hepatic or renal impairment)", "Comorbidities affecting target organ physiology"],
    diagnostics: ["Monitor therapeutic drug levels for medications with narrow therapeutic index", "Assess clinical response against expected pharmacodynamic parameters", "Monitor for dose-response relationship (is the patient responding as expected?)", "Evaluate for adverse effects indicating receptor overstimulation or off-target binding", "Pharmacogenomic testing when available (CYP2D6, CYP2C19, HLA-B*5701, TPMT)", "Assess for tolerance development requiring dose escalation"],
    management: ["Select drugs based on receptor specificity for the target condition", "Start with lowest effective dose and titrate based on clinical response", "Monitor therapeutic index — narrow TI drugs require drug level monitoring (warfarin, digoxin, lithium, phenytoin, theophylline)", "Anticipate drug-drug interactions at the receptor level", "Adjust dosing for pharmacogenomic variations when known", "Evaluate for receptor desensitization/tolerance with chronic use"],
    nursingActions: ["Assess baseline clinical parameters before drug initiation", "Monitor therapeutic response at expected onset of action", "Report absence of expected therapeutic effect (possible receptor polymorphism or drug interaction)", "Monitor for signs of toxicity indicating narrow therapeutic window", "Educate patients on expected therapeutic effects and timeframe", "Document dose-response patterns for prescriber decision-making"],
    assessmentFindings: ["Therapeutic drug levels within target range for narrow TI drugs", "Clinical response matching expected pharmacodynamic effect", "Absence of adverse effects at therapeutic doses", "Evidence of tolerance development (decreasing response at same dose)", "Signs of toxicity (drug effect beyond therapeutic range)", "Drug-drug interaction effects at receptor level"],
    signs: {
      left: ["Therapeutic response at standard dosing", "Drug level within target therapeutic range", "No significant adverse effects", "Predictable dose-response relationship"],
      right: ["No therapeutic response despite adequate dosing (resistance or polymorphism)", "Drug toxicity at standard doses (narrow TI exceeded)", "Severe adverse effects from receptor overstimulation", "Rapid tolerance development requiring escalating doses"]
    },
    medications: [
      { name: "Naloxone", type: "Opioid receptor antagonist", action: "Competitive antagonist at mu, kappa, and delta opioid receptors — displaces opioid agonists from receptors, reversing respiratory depression, sedation, and analgesia simultaneously", sideEffects: "Acute opioid withdrawal (pain, agitation, nausea, tachycardia, hypertension), pulmonary edema (rare)", contra: "No absolute contraindications in life-threatening overdose", pearl: "Classic example of competitive antagonism: naloxone competes with opioids for the same receptor but has higher affinity; duration shorter than most opioids (30-90 min) — patients may re-sedate when naloxone wears off, requiring repeated dosing or infusion" }
    ],
    pearls: ["Potency = how much drug is needed (EC50); Efficacy = how well the drug works at its maximum (Emax)", "A drug can be very potent but have low efficacy — they are independent properties", "Competitive antagonists shift the dose-response curve RIGHT (more agonist needed); non-competitive antagonists shift it DOWN (reduced maximum response)", "Therapeutic index = TD50/ED50 — narrow TI drugs (warfarin, lithium, digoxin, phenytoin) require monitoring", "Tachyphylaxis = rapid tolerance (minutes to hours); tolerance = gradual decreased response (days to weeks)", "First-pass effect reduces bioavailability of oral drugs — sublingual and IV routes bypass this"],
    quiz: [
      {
        question: "Drug A produces 50% of its maximal effect at 5 mg while Drug B requires 50 mg. Which drug is more potent?",
        options: ["Drug B — it needs more medication so it's stronger", "Drug A — it achieves the same effect at a lower dose (lower EC50 = higher potency)", "They are equally potent", "Cannot determine without efficacy data"],
        correct: 1,
        rationale: "Potency is determined by EC50 (dose producing 50% of maximal effect). Drug A's lower EC50 (5 mg vs 50 mg) makes it 10 times more potent. Potency does not indicate which drug produces a greater maximum effect (efficacy)."
      },
      {
        question: "A patient on chronic opioids requires increasing doses for the same pain relief. What pharmacodynamic phenomenon is occurring?",
        options: ["Drug allergy", "Tolerance — receptor downregulation reducing sensitivity to the same dose", "Addiction", "The drug has expired"],
        correct: 1,
        rationale: "Tolerance is a pharmacodynamic phenomenon where chronic receptor stimulation leads to receptor downregulation, desensitization, or decreased intracellular signaling, requiring higher doses to achieve the same pharmacological effect."
      },
      {
        question: "Which describes a drug with a narrow therapeutic index?",
        options: ["A drug that works quickly", "A drug where the toxic dose is close to the therapeutic dose, requiring careful monitoring", "A drug that is very potent", "A drug that works on multiple receptors"],
        correct: 1,
        rationale: "Narrow therapeutic index means the difference between the effective dose and the toxic dose is small (low TI ratio). These drugs (warfarin, lithium, digoxin, phenytoin, theophylline) require drug level monitoring to maintain efficacy without toxicity."
      }
    ]
  },
  "pharmacokinetics-applied-np": {
    title: "Pharmacokinetics Applied",
    cellular: { title: "ADME Principles", content: "Pharmacokinetics describes what the body does to a drug through four processes: Absorption (drug entry into systemic circulation — affected by route, formulation, GI pH, food, and first-pass hepatic metabolism), Distribution (drug movement from blood into tissues — affected by protein binding, lipid solubility, volume of distribution, and blood-brain barrier penetration), Metabolism (biotransformation primarily by hepatic cytochrome P450 enzymes — CYP3A4 metabolizes ~50% of drugs; Phase I reactions add functional groups, Phase II conjugation reactions increase water solubility), and Excretion (elimination primarily via kidneys — glomerular filtration, tubular secretion, and reabsorption; also via bile, lungs, and sweat). Half-life (t½) is the time for plasma concentration to decrease by 50%; steady state is reached after approximately 4-5 half-lives of continuous dosing. These principles determine dosing intervals, loading doses, and dose adjustments for organ dysfunction." },
    riskFactors: ["Hepatic impairment (reduced CYP450 metabolism — drug accumulation)", "Renal impairment (reduced drug excretion — accumulation of parent drug or active metabolites)", "Extremes of age (neonates: immature metabolism/excretion; elderly: reduced renal/hepatic function)", "Obesity (altered volume of distribution for lipophilic drugs)", "Hypoalbuminemia (increased free drug fraction for protein-bound drugs)", "Drug-drug interactions at CYP450 level (inhibitors increase drug levels, inducers decrease them)", "Genetic polymorphisms in CYP enzymes (poor vs rapid metabolizers)"],
    diagnostics: ["Calculate creatinine clearance (Cockcroft-Gault) for renal dose adjustment", "Monitor drug levels for narrow therapeutic index medications at steady state", "Assess hepatic function (Child-Pugh score) for hepatically metabolized drugs", "Review medication list for CYP450 drug interactions", "Consider pharmacogenomic testing (CYP2D6, CYP2C19) for drugs with genetic variability", "Monitor clinical response to determine if drug levels are in therapeutic range"],
    management: ["Calculate loading dose when rapid therapeutic effect needed: Loading dose = Vd × target concentration", "Calculate maintenance dose: Maintenance = CL × target concentration", "Adjust doses for renal impairment using CrCl-based guidelines", "Adjust for hepatic impairment using Child-Pugh classification", "Identify and manage CYP450 drug interactions (inhibitors: grapefruit, azoles, macrolides; inducers: rifampin, carbamazepine, phenytoin)", "Understand steady state timing: 4-5 half-lives — do not check drug levels before steady state"],
    nursingActions: ["Calculate CrCl before prescribing renally excreted medications", "Review medication list for CYP450 interactions before adding new drugs", "Time drug level draws appropriately (trough levels just before next dose, peak levels per drug protocol)", "Educate patients on food-drug interactions that affect absorption (grapefruit, dairy, high-fat meals)", "Adjust dosing intervals for renal impairment rather than just reducing dose (for some drugs)", "Document kidney and liver function at baseline and monitor serially"],
    assessmentFindings: ["Current renal function (serum creatinine, calculated CrCl or eGFR)", "Hepatic function (AST, ALT, albumin, bilirubin, INR)", "Current medication list with potential CYP450 interactions identified", "Drug levels for narrow TI medications (at steady state)", "Clinical response and adverse effects", "Body weight and composition for volume of distribution estimation"],
    signs: {
      left: ["Drug level within therapeutic range at steady state", "Clinical response as expected", "No significant drug-drug interactions", "Normal renal and hepatic function"],
      right: ["Drug level above therapeutic range (accumulation/toxicity)", "Unexpected drug failure despite adherence (rapid metabolism or drug interaction)", "Rising creatinine in patient on renally cleared drug", "Hepatic encephalopathy in patient on hepatically cleared drug"]
    },
    medications: [
      { name: "Warfarin", type: "Vitamin K antagonist anticoagulant", action: "Inhibits vitamin K epoxide reductase (VKORC1), preventing the carboxylation and activation of factors II, VII, IX, and X", sideEffects: "Bleeding (major risk), skin necrosis (rare — protein C/S deficiency), teratogenicity", contra: "Pregnancy (Category X), active major bleeding, severe hepatic disease, non-adherent patients", pearl: "Classic narrow TI drug requiring INR monitoring; metabolized by CYP2C9 (polymorphisms affect dosing) and VKORC1 variants affect sensitivity; onset 3-5 days (existing factors must deplete); massive number of drug-food interactions (vitamin K foods, CYP2C9 inhibitors/inducers)" }
    ],
    pearls: ["Steady state = 4-5 half-lives — do NOT check drug levels before steady state is reached", "CYP3A4 metabolizes approximately 50% of all drugs — grapefruit juice and azole antifungals inhibit it (increase drug levels)", "Rifampin is the most potent CYP inducer — assume it will decrease levels of nearly every co-administered drug", "Loading dose bypasses the 4-5 half-life wait for steady state — used when rapid therapeutic effect is needed", "Volume of distribution (Vd) determines loading dose: high Vd = large loading dose needed (drug distributes widely into tissues)", "For renally cleared drugs, use CrCl (Cockcroft-Gault) not eGFR for dose adjustments — drug dosing guidelines are validated with CrCl"],
    quiz: [
      {
        question: "A drug has a half-life of 12 hours. Approximately how long until steady state is reached with regular dosing?",
        options: ["12 hours", "24 hours", "48-60 hours (4-5 half-lives)", "7 days"],
        correct: 2,
        rationale: "Steady state is reached after 4-5 half-lives of continuous dosing. With a 12-hour half-life: 4 × 12 = 48 hours to 5 × 12 = 60 hours. Drug levels should not be checked for therapeutic monitoring until steady state is reached."
      },
      {
        question: "A patient starts a new antifungal (CYP3A4 inhibitor) while taking a statin (CYP3A4 substrate). What pharmacokinetic consequence is expected?",
        options: ["Decreased statin effect", "Increased statin levels and toxicity risk (rhabdomyolysis)", "No interaction", "The antifungal will be less effective"],
        correct: 1,
        rationale: "The azole antifungal inhibits CYP3A4, the enzyme that metabolizes the statin. Reduced metabolism means statin levels will increase, potentially causing myopathy and rhabdomyolysis. The statin dose should be reduced or an alternative statin used."
      },
      {
        question: "Why is a loading dose given for some medications?",
        options: ["To test for allergic reactions", "To reach therapeutic levels immediately rather than waiting 4-5 half-lives for steady state", "To reduce side effects", "Loading doses are always required"],
        correct: 1,
        rationale: "Without a loading dose, it takes 4-5 half-lives of regular dosing to reach steady state. A loading dose fills the volume of distribution immediately, achieving therapeutic levels right away — critical for emergencies (e.g., heparin, digoxin, phenytoin)."
      }
    ]
  },
  "pharmacology-np": {
    title: "Advanced Pharmacology Principles",
    cellular: { title: "Advanced Prescribing Principles", content: "Advanced pharmacology for nurse practitioners integrates pharmacokinetics, pharmacodynamics, pharmacogenomics, and clinical pharmacology into evidence-based prescribing decisions. The NP must understand drug-receptor interactions (agonism, antagonism, partial agonism, inverse agonism), dose-response relationships (graded and quantal), therapeutic index calculations, and the clinical significance of CYP450 polymorphisms. Prescribing requires consideration of the complete clinical context: patient-specific factors (age, weight, organ function, pregnancy status, genetic profile), drug-specific factors (mechanism, kinetics, interactions, adverse effect profile), and system-level factors (formulary availability, cost, adherence barriers, monitoring requirements). The NP applies the principles of rational prescribing: right drug, right dose, right route, right patient, right monitoring." },
    riskFactors: ["Polypharmacy (≥ 5 medications — exponential interaction risk)", "CYP450 genetic polymorphisms (poor or ultrarapid metabolizers)", "Hepatic or renal impairment (altered drug metabolism/excretion)", "Pregnancy and lactation (teratogenicity, fetal drug exposure)", "Elderly patients (altered pharmacokinetics and increased sensitivity)", "Pediatric patients (immature organ systems and weight-based dosing)", "Non-adherence to prescribed regimen"],
    diagnostics: ["Review complete medication list including OTC, supplements, and herbal products", "Calculate CrCl for renal dose adjustments", "Assess hepatic function (Child-Pugh) for hepatically metabolized drugs", "Screen for drug interactions using evidence-based interaction checker", "Monitor therapeutic drug levels for narrow TI medications", "Pharmacogenomic panel when clinically indicated (CYP2D6, CYP2C19, CYP2C9, VKORC1, HLA-B*5701)"],
    management: ["Apply stepwise prescribing approach: start low, go slow, one change at a time", "Deprescribe unnecessary medications systematically", "Monitor for drug-drug, drug-food, and drug-disease interactions", "Adjust dosing for organ dysfunction using validated guidelines", "Apply pharmacogenomic results to drug selection and dosing", "Evaluate medication adherence barriers and simplify regimens when possible"],
    nursingActions: ["Perform medication reconciliation at every encounter", "Identify and resolve drug-drug interactions before prescribing", "Educate patients on mechanism of action, expected effects, and critical adverse effects", "Schedule appropriate monitoring (lab work, drug levels, clinical response)", "Document prescribing rationale and monitoring plan", "Evaluate adherence using open-ended questions and refill history"],
    assessmentFindings: ["Current medication list with doses, frequencies, and indications", "Renal and hepatic function baseline", "Drug allergies with reaction type documented", "Adherence history and barriers identified", "Pharmacogenomic profile if available", "Current drug levels for narrow TI medications"],
    signs: {
      left: ["Therapeutic response achieved at standard dosing", "No significant drug interactions identified", "Normal organ function for drug metabolism/excretion", "Patient adherent and educated on medications"],
      right: ["Polypharmacy with unidentified drug interactions", "Drug failure despite adequate dosing (consider pharmacogenomics)", "Narrow TI drug with level above therapeutic range", "Adverse drug reaction requiring medication change"]
    },
    medications: [
      { name: "Metoprolol Succinate", type: "Cardioselective beta-1 blocker", action: "Selectively blocks beta-1 receptors in the heart, reducing heart rate, contractility, and myocardial oxygen demand; reduces renin release from juxtaglomerular cells", sideEffects: "Bradycardia, hypotension, fatigue, bronchospasm at high doses (loses beta-1 selectivity), masking of hypoglycemia symptoms, depression", contra: "Severe bradycardia, heart block (2nd/3rd degree), decompensated heart failure, cardiogenic shock", pearl: "Metabolized by CYP2D6 — poor metabolizers (7% of Caucasians) have higher drug levels and more side effects; do NOT stop abruptly (rebound tachycardia, hypertension, angina from receptor upregulation); succinate = extended-release for once-daily dosing, tartrate = immediate-release for BID dosing" }
    ],
    pearls: ["Start low, go slow, one drug change at a time — this allows attribution of effects (therapeutic or adverse) to the specific change", "Always check CrCl before prescribing renally cleared drugs — serum creatinine alone is insufficient (elderly patients may have normal creatinine with reduced GFR)", "Rifampin, carbamazepine, and phenytoin are potent CYP inducers — assume they reduce levels of everything", "Grapefruit, azole antifungals, and macrolides are CYP3A4 inhibitors — increase levels of substrates", "Never stop a beta-blocker abruptly — receptor upregulation causes rebound crisis", "Pharmacogenomics: CYP2D6 affects codeine (prodrug — poor metabolizers get no effect, ultrarapid metabolizers risk toxicity)"],
    quiz: [
      {
        question: "A patient is prescribed codeine for pain but reports zero pain relief despite adherence. Pharmacogenomic testing shows CYP2D6 poor metabolizer. Why is codeine ineffective?",
        options: ["The patient is drug-seeking", "Codeine is a prodrug that requires CYP2D6 to convert it to morphine — poor metabolizers cannot activate it", "The dose is too low", "Poor metabolizers need a higher dose of codeine"],
        correct: 1,
        rationale: "Codeine is a prodrug that requires CYP2D6 metabolism to produce its active metabolite, morphine. CYP2D6 poor metabolizers cannot convert codeine to morphine, resulting in no analgesic effect. An alternative analgesic should be prescribed."
      },
      {
        question: "A patient's metoprolol is abruptly discontinued before surgery. What is the risk?",
        options: ["No risk — beta-blockers can be stopped anytime", "Rebound tachycardia, hypertension, and possible angina/MI from beta-receptor upregulation", "Rebound bradycardia", "Hypoglycemia"],
        correct: 1,
        rationale: "Chronic beta-blocker use causes upregulation of beta-receptors. Abrupt discontinuation unmasks these upregulated receptors to endogenous catecholamines, causing rebound tachycardia, hypertension, and potential myocardial ischemia."
      },
      {
        question: "An elderly patient has a normal serum creatinine of 1.0 mg/dL. Should you assume normal renal function for drug dosing?",
        options: ["Yes — normal creatinine means normal kidney function", "No — elderly patients have reduced muscle mass producing less creatinine; GFR may be significantly reduced despite normal creatinine. Calculate CrCl.", "Yes — if creatinine is normal, no dose adjustment is needed", "No — elderly patients always have reduced kidney function"],
        correct: 1,
        rationale: "Creatinine is a product of muscle metabolism. Elderly patients have less muscle mass, producing less creatinine. Their serum creatinine may be 'normal' while GFR is significantly reduced. Always calculate CrCl using Cockcroft-Gault for drug dosing."
      }
    ]
  },
  "pharmacology-rn": {
    title: "Pharmacology for Nursing Practice",
    cellular: { title: "Essential Pharmacology for RN Practice", content: "Registered nurses are responsible for safe medication administration, monitoring for therapeutic and adverse effects, and patient education. Understanding basic pharmacology principles is essential: drugs work by binding to receptors to produce effects (agonists activate, antagonists block), onset/peak/duration determine when to assess for effects, and half-life determines how long the drug stays in the body. The 'Rights' of medication administration (right patient, drug, dose, route, time, documentation, reason, response) form the safety framework. Nurses must recognize adverse drug reactions, understand drug-drug and drug-food interactions, and know when to hold medications and notify the prescriber." },
    riskFactors: ["Polypharmacy increasing interaction risk", "Narrow therapeutic index medications (warfarin, digoxin, lithium)", "Renal or hepatic impairment affecting drug clearance", "Allergies and previous adverse drug reactions", "High-alert medications (insulin, heparin, opioids, potassium, chemotherapy)", "Extremes of age (pediatric and geriatric populations)", "Look-alike/sound-alike (LASA) medications"],
    diagnostics: ["Check two patient identifiers before every medication administration", "Verify allergies before giving any medication", "Assess vital signs before administering drugs that affect HR or BP (beta-blockers, antihypertensives, digoxin)", "Review pertinent lab values (K+ before digoxin, INR before warfarin, renal function before nephrotoxic drugs)", "Monitor drug levels for narrow TI medications at appropriate timing", "Assess for drug-food interactions (warfarin + vitamin K foods, tetracycline + dairy)"],
    management: ["Follow the rights of medication administration", "Hold and notify prescriber when parameters are not met (HR < 60 before beta-blocker, SBP < 100 before antihypertensive)", "Report adverse drug reactions immediately", "Educate patients on medication purpose, expected effects, and side effects to report", "Administer medications at correct times relative to meals when required", "Monitor for therapeutic effect and adverse effects at appropriate intervals"],
    nursingActions: ["Perform three checks: compare medication to MAR when retrieving, when preparing, and at bedside before administration", "Assess vital signs and relevant labs before administration of high-risk drugs", "Monitor for expected therapeutic effect after administration", "Document administration including time, dose, route, site (for injections), and patient response", "Teach patients about their medications using teach-back method", "Report and document adverse drug reactions per facility policy"],
    assessmentFindings: ["Vital signs appropriate for ordered medications", "Lab values within safe range for medication administration", "No contraindications or allergies to prescribed medications", "Patient understanding of medication purpose and key side effects", "Therapeutic response to medications (e.g., pain reduction, BP control, glucose control)", "Absence of adverse drug reactions"],
    signs: {
      left: ["Therapeutic drug response achieved", "Vital signs within parameters for safe administration", "Lab values support safe medication administration", "Patient verbally confirms understanding of medications"],
      right: ["Adverse drug reaction (rash, anaphylaxis, GI bleeding)", "Vital signs outside safe parameters (HR < 60, SBP < 90)", "Drug level above therapeutic range (toxicity)", "Medication error identified"]
    },
    medications: [
      { name: "Digoxin", type: "Cardiac glycoside", action: "Inhibits sodium-potassium ATPase, increasing intracellular calcium and strengthening cardiac contraction (positive inotrope); slows conduction through AV node", sideEffects: "Nausea/vomiting, visual disturbances (yellow-green halos), bradycardia, dysrhythmias, hyperkalemia", contra: "Hypokalemia (increases digoxin toxicity), severe bradycardia, ventricular tachycardia, hypertrophic cardiomyopathy", pearl: "Check apical pulse for 1 full minute before giving — hold for HR < 60 in adults, < 70 in children; therapeutic level 0.5-2.0 ng/mL; hypokalemia increases toxicity risk — always check K+ before giving; antidote: digoxin immune Fab (Digibind)" }
    ],
    pearls: ["Always check apical pulse for 1 full minute before digoxin — hold and notify if < 60 (adult) or < 70 (child)", "Hypokalemia increases digoxin toxicity — always check potassium before administering", "Hold antihypertensives if SBP < 100 (or per prescriber parameters) and notify prescriber", "High-alert medications (insulin, heparin, opioids, potassium, chemotherapy) require independent double-check by two nurses", "Teach-back method: ask the patient to explain back what you taught to verify understanding", "Three checks of medication administration: when retrieving, when preparing, and at bedside"],
    quiz: [
      {
        question: "Before administering digoxin, the nurse takes an apical pulse and counts 54 bpm. What is the correct action?",
        options: ["Administer the medication and document the pulse", "Hold the medication and notify the prescriber — apical pulse < 60 is a hold parameter for digoxin", "Give the medication with a glass of milk", "Recheck the pulse in 30 minutes and give if improved"],
        correct: 1,
        rationale: "Digoxin slows heart rate. An apical pulse < 60 bpm in adults (< 70 in children) indicates the heart rate is too slow to safely administer digoxin. The nurse should hold the dose, document, and notify the prescriber."
      },
      {
        question: "A patient on warfarin has a potassium of 3.2 mEq/L. Which lab value is most important to check before administering warfarin?",
        options: ["Potassium", "INR — warfarin dosing is based on INR, not potassium", "Hemoglobin", "BUN"],
        correct: 1,
        rationale: "The INR (International Normalized Ratio) is the primary lab for warfarin monitoring. Warfarin's anticoagulant effect is measured by INR (target usually 2-3), and the INR determines whether the dose is safe to administer."
      },
      {
        question: "Which medications require independent double-check by two nurses before administration?",
        options: ["All oral medications", "High-alert medications: insulin, heparin, opioids, potassium, chemotherapy", "Only IV medications", "Only controlled substances"],
        correct: 1,
        rationale: "High-alert medications carry the highest risk of patient harm if errors occur. Two-nurse independent verification (each nurse independently checks the drug, dose, and patient) reduces medication error risk for these high-stakes drugs."
      }
    ]
  },
  "pharmacology-rpn": {
    title: "Basic Pharmacology",
    cellular: { title: "How Medications Work", content: "Medications work by interacting with the body to change how it functions. Most drugs work by attaching to specific spots on cells called receptors — like a key fitting into a lock. When a drug attaches to its receptor, it can either turn on a response (like opening a locked door) or block a response (like putting the wrong key in so the right key cannot fit). Every medication has a therapeutic effect (the desired effect) and potential side effects (unwanted effects). Nurses need to understand onset (when the drug starts working), peak (when it has maximum effect), and duration (how long it lasts) to properly monitor patients and time assessments." },
    riskFactors: ["Patient allergies (always check before administering ANY medication)", "Multiple medications (more drugs = higher risk of interactions)", "Kidney or liver problems (medications may build up to dangerous levels)", "Age (elderly and children need special dosing consideration)", "Pregnancy or breastfeeding (some drugs can harm the baby)", "Difficulty swallowing (affects which forms of medication can be given)"],
    diagnostics: ["Check two patient identifiers before every medication administration", "Verify allergies before giving any new medication", "Check vital signs before medications that affect heart rate or blood pressure", "Verify the patient can swallow before giving oral medications", "Check blood sugar before giving insulin", "Review the medication administration record (MAR) for correct timing"],
    management: ["Follow the rights of medication administration (right patient, drug, dose, route, time)", "Give medications at the correct time as ordered", "Know what to report: allergic reactions, unexpected effects, vital sign changes", "Hold medication and report if patient's condition has changed", "Store medications properly (some need refrigeration)", "Never crush extended-release or enteric-coated medications"],
    nursingActions: ["Check two patient identifiers before every medication", "Read the medication label three times (when retrieving, preparing, and administering)", "Report any medication error immediately — patient safety first", "Document medication administration including time, dose, route, and site", "Observe the patient take oral medications (do not leave at bedside)", "Monitor for expected effects and side effects after administration"],
    assessmentFindings: ["Correct patient identification confirmed", "No known allergies to prescribed medication", "Vital signs within safe range for medication administration", "Patient able to swallow (for oral medications)", "Medication matches the MAR order exactly", "Patient understands basic purpose of the medication"],
    signs: {
      left: ["Patient reports symptom improvement after medication", "Vital signs remain stable after administration", "No signs of allergic reaction", "Patient taking medication as scheduled"],
      right: ["Rash, hives, or swelling after medication (allergic reaction)", "Difficulty breathing after medication (anaphylaxis — call for help immediately)", "Heart rate or blood pressure significantly changed", "Patient reports unexpected or severe side effects"]
    },
    medications: [{
      name: "Acetaminophen (Tylenol)",
      type: "Analgesic/Antipyretic",
      action: "Reduces pain and fever by acting on the brain's pain and temperature centers",
      sideEffects: "Liver damage at high doses, nausea (rare at normal doses)",
      contra: "Severe liver disease, alcohol use disorder, doses exceeding maximum",
      pearl: "Maximum 4g/day in healthy adults, 2g/day with liver disease; found in MANY combination products (cold medicines, prescription pain pills) — check ALL medications for hidden acetaminophen to prevent accidental overdose"
    }],
    pearls: ["Always check TWO patient identifiers before giving ANY medication", "Never crush extended-release (ER, XR, SR) or enteric-coated tablets — they are designed to release slowly", "Right patient, right drug, right dose, right route, right time — the 5 Rights are your safety net", "If a medication seems wrong or unusual, STOP and verify before administering — your instinct matters", "Acetaminophen is in many combination products — always check total daily intake from ALL sources", "Report ANY medication error immediately — early reporting protects the patient"],
    quiz: [
      {
        question: "A patient is prescribed an extended-release tablet but says they cannot swallow large pills. What should the RPN do?",
        options: ["Crush the tablet and mix with applesauce", "Do NOT crush — notify the prescriber to order an alternative formulation (liquid, immediate-release)", "Cut the tablet in half", "Dissolve the tablet in water"],
        correct: 1,
        rationale: "Extended-release tablets are designed to release medication slowly over time. Crushing them releases the entire dose at once, potentially causing overdose or toxicity. The prescriber should be contacted for an alternative formulation."
      },
      {
        question: "Before giving a blood pressure medication, the RPN measures the patient's BP at 88/52 mmHg. What is the correct action?",
        options: ["Give the medication since it was ordered", "Hold the medication and report the low blood pressure to the nurse", "Give half the dose", "Give the medication with extra water"],
        correct: 1,
        rationale: "A blood pressure of 88/52 is low. Giving an antihypertensive medication could further lower BP dangerously. The RPN should hold the medication, document the finding, and report to the nurse or prescriber."
      },
      {
        question: "How many times should the RPN check the medication label during the administration process?",
        options: ["Once — when getting it from the medication cart", "Twice — when getting it and when giving it", "Three times — when retrieving, when preparing, and when administering at bedside", "Checking once is sufficient if the MAR is correct"],
        correct: 2,
        rationale: "The three-check system (retrieving from storage, preparing the medication, and at the bedside before administration) significantly reduces medication errors and is the standard of safe practice."
      }
    ]
  },
  "pharyngitis-np": {
    title: "Pharyngitis",
    cellular: { title: "Pharyngitis Pathophysiology & GAS Identification", content: "Pharyngitis is inflammation of the pharynx, with viral etiologies (rhinovirus, adenovirus, EBV, influenza) accounting for 70-85% of cases and Group A Streptococcus (GAS/S. pyogenes) accounting for 15-30% in children and 5-15% in adults. GAS pharyngitis is significant because untreated infection can trigger post-infectious immunologic complications: acute rheumatic fever (ARF — molecular mimicry between streptococcal M protein and cardiac tissue causing valvulitis) and post-streptococcal glomerulonephritis (PSGN — immune complex deposition in glomeruli). The Centor criteria (modified McIsaac) guide the need for testing: fever > 38°C, tonsillar exudates, tender anterior cervical lymphadenopathy, absence of cough, and age adjustment. A score ≥ 3 warrants rapid antigen detection test (RADT) or throat culture. Antibiotics treat GAS to prevent ARF (antibiotics must be started within 9 days of symptom onset), reduce symptom duration by 1-2 days, and decrease transmission." },
    riskFactors: ["Age 5-15 years (peak GAS pharyngitis incidence)", "Close contact in schools or daycare", "Crowded living conditions", "Winter and early spring season", "History of recurrent streptococcal pharyngitis", "Immunocompromised patients (higher complication risk)", "Household contact with confirmed GAS"],
    diagnostics: ["Apply modified Centor (McIsaac) criteria: fever >38°C (+1), tonsillar exudates (+1), tender anterior cervical LAD (+1), absence of cough (+1), age 3-14 (+1), age 15-44 (0), age ≥45 (-1)", "Score ≥ 3: perform RADT (rapid antigen detection test)", "Negative RADT in children/adolescents: confirm with throat culture (RADT sensitivity 70-90%)", "Negative RADT in adults: throat culture optional (lower rheumatic fever risk)", "Score ≤ 2: neither testing nor antibiotics recommended (viral pharyngitis likely)", "Monospot (heterophile antibody test) if EBV mononucleosis suspected (exudative pharyngitis + fatigue + splenomegaly + atypical lymphocytes)"],
    management: ["GAS-positive: amoxicillin 50 mg/kg/day (max 1g) once daily × 10 days OR 25 mg/kg BID × 10 days", "Penicillin V as alternative: 250 mg BID-TID (children), 500 mg BID (adults) × 10 days", "Penicillin allergy (non-anaphylaxis): cephalexin × 10 days", "Penicillin anaphylaxis: azithromycin 12 mg/kg/day (max 500 mg) × 5 days (increasing resistance — check local sensitivity)", "Symptomatic relief: acetaminophen/ibuprofen for pain and fever, salt water gargles, throat lozenges", "Follow-up throat culture NOT recommended for asymptomatic patients after treatment (test of cure not indicated)"],
    nursingActions: ["Apply Centor criteria to determine testing need before antibiotic decision", "Collect throat swab properly: swab BOTH tonsils and posterior pharynx vigorously", "Educate on completing full 10-day antibiotic course (prevents rheumatic fever even if feeling better)", "Advise return to school/work 24 hours after starting antibiotics (no longer contagious)", "Counsel on supportive care measures (hydration, rest, analgesics)", "Screen for complications: persistent fever beyond 48-72 hours on antibiotics, trismus (peritonsillar abscess)"],
    assessmentFindings: ["Sore throat (odynophagia — pain with swallowing)", "Fever > 38°C (100.4°F)", "Tonsillar exudates (white or yellow patches on enlarged tonsils)", "Tender anterior cervical lymphadenopathy", "Absence of cough, rhinorrhea, or conjunctivitis (viral symptoms suggest non-GAS etiology)", "Petechiae on soft palate (fairly specific for GAS)", "Scarlatiniform rash (sandpaper texture — scarlet fever with GAS)"],
    signs: {
      left: ["Sore throat with cough and nasal congestion (likely viral)", "No tonsillar exudates", "Low Centor score (≤ 2)", "Mild symptoms responding to supportive care"],
      right: ["High fever with tonsillar exudates and anterior LAD without cough (Centor ≥ 3)", "Palatal petechiae with scarlatiniform rash (scarlet fever)", "Trismus, unilateral swelling, 'hot potato voice' (peritonsillar abscess)", "Drooling with severe odynophagia and neck stiffness (retropharyngeal abscess — emergency)"]
    },
    medications: [
      { name: "Amoxicillin", type: "Aminopenicillin antibiotic", action: "Inhibits bacterial cell wall synthesis by binding penicillin-binding proteins in GAS; achieves adequate pharyngeal tissue concentrations for GAS eradication", sideEffects: "Diarrhea, rash (10%; maculopapular rash in EBV mononucleosis — NOT a true allergy), nausea", contra: "Penicillin anaphylaxis; EBV mononucleosis (ampicillin/amoxicillin rash)", pearl: "First-line for GAS pharyngitis: once-daily dosing (50 mg/kg, max 1g) is as effective as divided dosing and improves adherence; MUST complete full 10 days to prevent rheumatic fever; avoid in suspected mononucleosis (rash risk)" }
    ],
    pearls: ["Centor score ≤ 2: do NOT test or treat — viral pharyngitis is most likely", "Centor ≥ 3: test with RADT, treat only if positive (do not empirically treat pharyngitis)", "The 10-day antibiotic course prevents rheumatic fever — starting antibiotics within 9 days of symptom onset is effective", "Amoxicillin rash in a patient with EBV mono is NOT a penicillin allergy — do not label as allergic", "Test of cure (follow-up throat culture) is NOT recommended for asymptomatic patients after treatment", "Peritonsillar abscess: unilateral swelling, trismus, deviated uvula, 'hot potato voice' — needs ENT drainage"],
    quiz: [
      {
        question: "A 10-year-old has fever, tonsillar exudates, anterior cervical LAD, and no cough (Centor 4). RADT is negative. What is the next step?",
        options: ["No further testing needed — the patient does not have GAS", "Order a throat culture to confirm — RADT can have false negatives in children", "Prescribe antibiotics empirically", "Order a CBC"],
        correct: 1,
        rationale: "In children and adolescents, a negative RADT should be confirmed with a throat culture because RADT sensitivity is only 70-90%. Children are at higher risk for rheumatic fever, making accurate GAS detection critical."
      },
      {
        question: "Why must the antibiotic course for GAS pharyngitis be 10 days even if symptoms resolve in 2-3 days?",
        options: ["To prevent antibiotic resistance", "To prevent acute rheumatic fever — complete eradication of GAS requires a full 10-day course", "To treat the viral component of the infection", "Because all antibiotics must be taken for 10 days"],
        correct: 1,
        rationale: "The 10-day course ensures complete GAS eradication from the pharynx. Incomplete treatment leaves residual organisms that can trigger immune-mediated complications, particularly acute rheumatic fever."
      },
      {
        question: "A patient being treated for pharyngitis with amoxicillin develops diffuse maculopapular rash on day 3. Blood work shows atypical lymphocytes. What is the most likely explanation?",
        options: ["True penicillin allergy", "Amoxicillin rash from underlying EBV mononucleosis — NOT a true allergy", "Drug-induced serum sickness", "Stevens-Johnson syndrome"],
        correct: 1,
        rationale: "EBV mononucleosis causes a characteristic non-allergic maculopapular rash when amoxicillin/ampicillin is administered (occurring in 70-100% of mono patients). Atypical lymphocytes confirm EBV. This should NOT be documented as a penicillin allergy."
      }
    ]
  },
  "phenylketonuria-rpn": {
    title: "Phenylketonuria (PKU)",
    cellular: { title: "PKU Pathophysiology", content: "Phenylketonuria (PKU) is an autosomal recessive metabolic disorder caused by a deficiency of the enzyme phenylalanine hydroxylase (PAH), which normally converts the amino acid phenylalanine to tyrosine in the liver. Without this enzyme, phenylalanine accumulates in the blood and crosses into the brain, where it interferes with normal brain development by disrupting myelination, neurotransmitter synthesis, and protein formation. If untreated, PKU causes severe intellectual disability, seizures, behavioral problems, and a musty body odor (from phenylacetic acid in sweat and urine). PKU is detected through newborn screening (heel stick blood test performed 24-48 hours after birth). Early dietary restriction of phenylalanine prevents brain damage and allows normal intellectual development." },
    riskFactors: ["Both parents are carriers (autosomal recessive — 25% chance per pregnancy)", "Family history of PKU", "Certain ethnic backgrounds (higher prevalence in Northern European, Irish, and Turkish populations)", "Maternal PKU (if mother has uncontrolled PKU during pregnancy, fetal brain damage occurs regardless of fetal genotype)"],
    diagnostics: ["Newborn screening (Guthrie test or tandem mass spectrometry) — performed 24-48 hours after birth", "Confirmatory blood phenylalanine level (PKU: > 20 mg/dL; normal: < 2 mg/dL)", "Periodic blood phenylalanine monitoring (target 2-6 mg/dL for children, < 10 mg/dL for adults)", "Developmental screening at regular intervals", "Nutritional assessment and growth monitoring"],
    management: ["Lifelong low-phenylalanine diet (the cornerstone of treatment)", "Avoid high-protein foods: meat, fish, eggs, dairy, nuts, soy, beans", "Use special phenylalanine-free medical formula as primary protein source", "Sapropterin (Kuvan) for BH4-responsive PKU — allows some dietary liberalization", "Pegvaliase enzyme replacement therapy for adults with uncontrolled PKU", "Maternal PKU: strict phenylalanine control (2-6 mg/dL) BEFORE conception and throughout pregnancy"],
    nursingActions: ["Ensure newborn screening is collected 24-48 hours after birth (after protein feeding has begun)", "Educate parents on low-phenylalanine diet and reading food labels for protein content", "Support families in obtaining specialized PKU formula", "Monitor growth, development, and phenylalanine levels at regular intervals", "Educate adolescents about lifelong dietary compliance (especially important for females planning future pregnancies)", "Report developmental delays or regression to the healthcare team"],
    assessmentFindings: ["Newborn appears normal at birth (symptoms develop over weeks to months without treatment)", "Elevated phenylalanine on newborn screening", "Untreated: musty/mousy body odor (phenylacetic acid)", "Untreated: fair skin, light hair, blue eyes (reduced melanin from tyrosine deficiency)", "Untreated: intellectual disability, seizures, behavioral problems, eczema", "With treatment: normal growth and development"],
    signs: {
      left: ["Normal newborn screening result", "Phenylalanine level 2-6 mg/dL on diet (well-controlled)", "Normal developmental milestones", "Adherent to low-Phe diet and formula"],
      right: ["Elevated phenylalanine > 20 mg/dL (uncontrolled)", "Developmental delay or regression", "Musty body odor", "Seizures, behavioral problems, intellectual disability (late/untreated)"]
    },
    medications: [{
      name: "Sapropterin (Kuvan)",
      type: "BH4 cofactor supplement",
      action: "Provides synthetic tetrahydrobiopterin (BH4), the cofactor for phenylalanine hydroxylase, enhancing residual enzyme activity in BH4-responsive patients",
      sideEffects: "Headache, diarrhea, abdominal pain, upper respiratory infection, rhinorrhea",
      contra: "Non-BH4-responsive PKU (no residual enzyme activity to enhance)",
      pearl: "Only effective in 25-50% of PKU patients (those with residual PAH enzyme activity responsive to BH4); trial period needed to determine response; allows dietary liberalization if phenylalanine levels decrease by >30%"
    }],
    pearls: ["PKU is detected by newborn screening — the baby appears NORMAL at birth; symptoms develop if untreated", "Newborn screening must be done 24-48 hours after birth AFTER protein feeding has begun (false negatives if drawn too early)", "Diet is LIFELONG — phenylalanine restriction prevents brain damage", "Aspartame (NutraSweet) is metabolized to phenylalanine — AVOID in PKU patients", "Maternal PKU: uncontrolled maternal phenylalanine causes fetal brain damage, heart defects, and microcephaly regardless of the baby's PKU status", "The musty/mousy odor comes from phenylacetic acid (a phenylalanine metabolite) in sweat and urine"],
    quiz: [
      {
        question: "A mother with PKU is planning to become pregnant. What is essential before conception?",
        options: ["No special preparation is needed", "Strict phenylalanine control (2-6 mg/dL) BEFORE conception and throughout pregnancy to prevent fetal damage", "Start folic acid only", "Genetic testing of the father only"],
        correct: 1,
        rationale: "Elevated maternal phenylalanine crosses the placenta and damages the developing fetal brain, regardless of the baby's PKU status. Phenylalanine must be controlled BEFORE conception because brain development begins very early in pregnancy."
      },
      {
        question: "Why must newborn screening for PKU be performed AFTER the baby has started feeding?",
        options: ["The test is more comfortable after feeding", "Phenylalanine levels only rise after protein intake begins — testing before feeding produces false negatives", "The baby is calmer after feeding", "The heel is better perfused after feeding"],
        correct: 1,
        rationale: "PKU is detected by elevated phenylalanine levels. Before protein feeding begins, phenylalanine levels may be normal even in affected babies because the amino acid comes from dietary protein. Testing too early produces false negative results."
      },
      {
        question: "A parent of a child with PKU asks if the child can have diet soda with aspartame. What is the correct response?",
        options: ["Yes — diet soda has no sugar so it's fine", "No — aspartame is broken down into phenylalanine in the body, which PKU patients cannot metabolize safely", "Yes — small amounts are acceptable", "Only if the child is over 12 years old"],
        correct: 1,
        rationale: "Aspartame (NutraSweet) is an artificial sweetener composed of aspartic acid and phenylalanine. When metabolized, it releases phenylalanine, which PKU patients cannot safely process. All products containing aspartame must be avoided."
      }
    ]
  },
  "pheochromocytoma-crisis-np": {
    title: "Pheochromocytoma Crisis",
    cellular: { title: "Catecholamine Crisis Pathophysiology", content: "Pheochromocytoma crisis is a life-threatening catecholamine surge from an adrenal medullary tumor (or extra-adrenal paraganglioma) releasing massive quantities of epinephrine, norepinephrine, and/or dopamine. The catecholamine flood activates alpha-1 receptors (severe peripheral vasoconstriction causing hypertensive emergency with SBP >250 mmHg), beta-1 receptors (tachycardia, arrhythmias, increased contractility), and beta-2 receptors (hyperglycemia, hypokalemia). Crisis can be triggered by tumor manipulation during surgery, anesthesia induction, tyramine-containing foods, medications (metoclopramide, tricyclic antidepressants, opioids, corticosteroids), or may occur spontaneously. Uncontrolled hypertension can cause hypertensive encephalopathy, hemorrhagic stroke, myocardial infarction, aortic dissection, or flash pulmonary edema. The defining management principle is that ALPHA-blockade must be established BEFORE beta-blockade — giving a beta-blocker first removes beta-2-mediated vasodilation, causing unopposed alpha-mediated vasoconstriction and potentially fatal hypertensive crisis." },
    riskFactors: ["Known or undiagnosed pheochromocytoma", "Surgical tumor manipulation (intraoperative crisis)", "Anesthesia induction (catecholamine release trigger)", "Medications: metoclopramide, opioids, TCAs, corticosteroids, dopamine antagonists", "Tyramine-containing foods (aged cheese, red wine, cured meats)", "MEN 2A/2B syndrome (10% bilateral pheochromocytoma)", "Pregnancy (may present as pre-eclampsia)", "Bladder pheochromocytoma (micturition-triggered hypertensive episodes)"],
    diagnostics: ["Plasma free metanephrines (most sensitive screening test — sensitivity >96%)", "24-hour urine for catecholamines, metanephrines, and VMA", "CT or MRI of abdomen (adrenal tumor localization)", "MIBG scintigraphy for metastatic disease or extra-adrenal paraganglioma", "Genetic testing for familial syndromes (RET for MEN2, VHL, SDHB/C/D)", "Intraoperative arterial line and central venous access for hemodynamic monitoring"],
    management: ["ALPHA-blockade FIRST: phenoxybenzamine (irreversible, long-acting) 10-20 mg BID-TID starting 10-14 days before surgery", "THEN add beta-blocker (only after adequate alpha-blockade): propranolol or atenolol for reflex tachycardia", "NEVER give beta-blocker without prior alpha-blockade (unopposed alpha = lethal vasoconstriction)", "Hypertensive crisis: IV phentolamine (alpha-blocker) 5 mg boluses or nitroprusside infusion", "Liberal salt and fluid intake before surgery (catecholamine-induced volume contraction)", "Definitive treatment: surgical adrenalectomy (laparoscopic preferred)"],
    nursingActions: ["Monitor blood pressure continuously (arterial line in crisis setting)", "Administer IV phentolamine per protocol for hypertensive emergency", "Ensure alpha-blockade is established BEFORE any beta-blocker administration", "Avoid triggering activities: no palpation of abdomen (tumor manipulation), avoid catecholamine-releasing medications", "Monitor for post-operative hypotension (sudden catecholamine withdrawal after tumor removal)", "Maintain IV access and volume resuscitation supplies at bedside"],
    assessmentFindings: ["Severe paroxysmal hypertension (SBP often >200 mmHg)", "Classic triad: headache, diaphoresis, palpitations (90% sensitivity)", "Tachycardia with arrhythmias", "Pallor (vasoconstriction — NOT flushing)", "Tremor, anxiety, sense of impending doom", "Hyperglycemia (catecholamine-stimulated glycogenolysis)"],
    signs: {
      left: ["Episodic hypertension with headache and sweating (paroxysmal presentation)", "BP normalizes between episodes", "Classic triad present (headache, sweating, palpitations)", "Elevated plasma metanephrines confirming diagnosis"],
      right: ["Hypertensive emergency (SBP >250, end-organ damage)", "Hemorrhagic stroke or aortic dissection", "Flash pulmonary edema with cardiogenic shock", "Intraoperative hemodynamic instability (massive BP swings)"]
    },
    medications: [
      { name: "Phenoxybenzamine", type: "Irreversible non-selective alpha-blocker", action: "Irreversibly binds alpha-1 and alpha-2 adrenergic receptors, preventing catecholamine-mediated vasoconstriction; long duration of action (24-48 hours) ensures sustained alpha-blockade", sideEffects: "Orthostatic hypotension, reflex tachycardia, nasal congestion, retrograde ejaculation", contra: "Hypotension", pearl: "Start 10-20 mg BID 10-14 days before surgery; titrate to orthostatic hypotension (confirms adequate blockade); reflex tachycardia is expected and treated by adding beta-blocker AFTER alpha-blockade is achieved" },
      { name: "Phentolamine", type: "Reversible non-selective alpha-blocker", action: "Competitively blocks alpha-1 and alpha-2 receptors for rapid reduction of catecholamine-mediated hypertension", sideEffects: "Hypotension, tachycardia, flushing, GI upset, arrhythmias", contra: "Coronary artery disease (reflex tachycardia may worsen ischemia), hypotension", pearl: "IV bolus 2-5 mg for hypertensive crisis; onset 1-2 minutes, duration 10-15 minutes; have on standby during pheochromocytoma surgery for intraoperative hypertensive surges" }
    ],
    pearls: ["ALPHA-blockade FIRST, THEN beta-blockade — NEVER reverse this order (unopposed alpha = fatal vasoconstriction)", "The classic triad is Headache + Sweating + Palpitations — present during paroxysmal hypertensive episodes", "Pheochromocytoma causes PALLOR during attacks (vasoconstriction), not flushing", "Plasma free metanephrines are the most sensitive screening test (>96% sensitivity)", "Prepare for POST-operative hypotension — sudden catecholamine removal after tumor excision causes profound vasodilation", "Rule of 10s (approximate): 10% bilateral, 10% malignant, 10% extra-adrenal, 10% familial, 10% pediatric"],
    quiz: [
      {
        question: "A patient with pheochromocytoma is tachycardic. A resident orders propranolol. Why must the nurse clarify this order?",
        options: ["Propranolol is not effective for tachycardia", "Beta-blockers given WITHOUT prior alpha-blockade cause unopposed alpha vasoconstriction, potentially triggering fatal hypertensive crisis", "Propranolol is contraindicated with catecholamines", "The patient needs a calcium channel blocker instead"],
        correct: 1,
        rationale: "Beta-blockade alone removes beta-2-mediated vasodilation in skeletal muscle vasculature. Without alpha-blockade, the remaining unopposed alpha-1 stimulation causes severe vasoconstriction, worsening hypertension to potentially lethal levels."
      },
      {
        question: "During pheochromocytoma surgery, the patient's BP suddenly spikes to 260/140 mmHg. What IV medication should be administered?",
        options: ["Labetalol", "Phentolamine (IV alpha-blocker)", "Esmolol", "Hydralazine"],
        correct: 1,
        rationale: "Phentolamine is a rapid-acting IV alpha-blocker used for intraoperative hypertensive crises during pheochromocytoma surgery. It directly counters catecholamine-induced vasoconstriction with onset in 1-2 minutes."
      },
      {
        question: "After successful pheochromocytoma removal, the patient develops hypotension (BP 70/40). What is the cause?",
        options: ["Hemorrhage from surgical site", "Sudden loss of catecholamine source causing profound vasodilation and relative hypovolemia", "Anesthesia complication", "Sepsis from wound infection"],
        correct: 1,
        rationale: "Removal of the catecholamine-producing tumor causes abrupt withdrawal of vasoconstricting catecholamines, resulting in vasodilation and relative hypovolemia. Pre-operative volume loading and post-operative IV fluid resuscitation are essential."
      }
    ]
  },  "pituitary-adenoma-syndromes-rn": {
    title: "Pituitary Adenoma Syndromes",
    cellular: { title: "Pituitary Adenoma Pathophysiology", content: "Pituitary adenomas are benign tumors of the anterior pituitary gland that cause disease through hormone hypersecretion, mass effect, or both. Functioning adenomas produce excess hormones: prolactinomas (most common, 40%) cause galactorrhea and amenorrhea; GH-secreting adenomas cause acromegaly (adults) or gigantism (children); ACTH-secreting adenomas cause Cushing disease; and TSH-secreting adenomas cause central hyperthyroidism. Non-functioning adenomas (30%) present with mass effect symptoms: compression of the optic chiasm causes bitemporal hemianopsia (loss of peripheral vision in both eyes), while compression of the normal pituitary causes hypopituitarism. Macroadenomas (≥10 mm) are more likely to cause visual field defects and headaches, while microadenomas (<10 mm) typically present with hormonal symptoms alone." },
    riskFactors: ["MEN 1 syndrome (pituitary adenoma + parathyroid hyperplasia + pancreatic tumor)", "Family history of pituitary adenomas", "Age 30-60 years (peak incidence)", "Estrogen exposure (prolactinomas more common in women)", "Carney complex (rare genetic syndrome)", "McCune-Albright syndrome"],
    diagnostics: ["MRI of the sella turcica with gadolinium contrast (gold standard imaging)", "Prolactin level (> 200 ng/mL strongly suggests prolactinoma; normal < 20 ng/mL)", "IGF-1 level (elevated in acromegaly) with oral glucose suppression test", "24-hour urine free cortisol and late-night salivary cortisol (Cushing disease screening)", "Visual field testing (formal perimetry — assess for bitemporal hemianopsia)", "Complete anterior pituitary hormone panel (GH, prolactin, ACTH, TSH, LH, FSH)", "Assess for posterior pituitary involvement (diabetes insipidus: serum/urine osmolality)"],
    management: ["Prolactinoma: dopamine agonists (cabergoline first-line) — medical management is preferred over surgery", "GH-secreting adenoma: transsphenoidal surgery (first-line), octreotide/lanreotide if surgery fails", "ACTH-secreting adenoma: transsphenoidal surgery for Cushing disease", "Non-functioning macroadenoma with mass effect: transsphenoidal surgery", "Hormone replacement for any hypopituitarism (cortisol BEFORE thyroid hormone)", "Radiation therapy for residual/recurrent tumor after surgery"],
    nursingActions: ["Assess visual acuity and visual fields — report any changes immediately", "Monitor for signs of hormone hypersecretion specific to tumor type", "Post-operative transsphenoidal surgery monitoring: watch for CSF leak (clear fluid from nose — test for glucose/beta-2 transferrin), diabetes insipidus (polyuria, dilute urine), and meningitis", "Instruct patient NOT to blow nose, strain, cough, or bend forward after transsphenoidal surgery (increases ICP and risk of CSF leak)", "Monitor strict intake and output post-operatively (DI detection)", "Educate on lifelong hormone replacement if hypopituitarism develops"],
    assessmentFindings: ["Visual field deficits (bitemporal hemianopsia — peripheral vision loss bilaterally)", "Headache (mass effect from expanding tumor)", "Galactorrhea with amenorrhea (prolactinoma)", "Coarsening of facial features, enlarged hands/feet (acromegaly)", "Moon face, buffalo hump, striae, central obesity (Cushing disease)", "Fatigue, weight gain, cold intolerance (hypopituitarism from compression)"],
    signs: {
      left: ["Microadenoma: hormonal symptoms only (galactorrhea, amenorrhea)", "Normal visual fields", "Mild prolactin elevation (20-200 ng/mL)", "No headache or mass effect symptoms"],
      right: ["Macroadenoma with bitemporal hemianopsia", "Severe headache from mass effect", "Pituitary apoplexy (sudden hemorrhage into tumor — emergency)", "CSF rhinorrhea post-operatively (clear nasal drainage)"]
    },
    medications: [
      { name: "Cabergoline", type: "Dopamine agonist", action: "Stimulates D2 dopamine receptors on lactotroph cells, inhibiting prolactin secretion and causing prolactinoma tumor shrinkage", sideEffects: "Nausea, dizziness, orthostatic hypotension, headache, constipation; rare: cardiac valve fibrosis at high doses (monitor with echocardiography)", contra: "Uncontrolled hypertension, history of cardiac valvular disease, concurrent use of potent CYP3A4 inhibitors", pearl: "First-line for prolactinoma (medical management preferred over surgery); normalizes prolactin in >85% and causes tumor shrinkage in >70%; given twice weekly; superior to bromocriptine in efficacy and tolerability" }
    ],
    pearls: ["Prolactinoma is the ONLY pituitary adenoma treated MEDICALLY first (cabergoline) — all others require surgery", "Bitemporal hemianopsia = optic chiasm compression — classic visual field defect of pituitary macroadenoma", "After transsphenoidal surgery: NO nose blowing, NO straining, NO bending forward — prevents CSF leak", "Clear nasal drainage after transsphenoidal surgery: test for glucose (CSF has glucose, nasal mucus does not) or beta-2 transferrin", "Cortisol must be replaced BEFORE thyroid hormone in panhypopituitarism — starting thyroid first can precipitate adrenal crisis", "Prolactin > 200 ng/mL = almost certainly prolactinoma; 20-200 ng/mL = stalk effect or microadenoma — level correlates with tumor size"],
    quiz: [
      {
        question: "A patient with a prolactinoma asks if they will need surgery. What is the correct counseling?",
        options: ["Yes — all pituitary tumors require surgery", "No — prolactinomas are uniquely managed with medication first (cabergoline), and surgery is reserved for medication failure", "Surgery is only needed if the tumor is malignant", "Only radiation therapy is effective"],
        correct: 1,
        rationale: "Prolactinomas are the only pituitary adenomas where medical management (dopamine agonists) is first-line. Cabergoline normalizes prolactin and shrinks tumors in the majority of patients. Surgery is reserved for medication-refractory cases."
      },
      {
        question: "After transsphenoidal surgery, the nurse notices clear fluid dripping from the patient's nose. What should be suspected?",
        options: ["Normal nasal congestion", "Allergic rhinitis", "CSF leak — test the drainage for glucose or beta-2 transferrin", "Postnasal drip from anesthesia"],
        correct: 2,
        rationale: "Clear nasal drainage after transsphenoidal surgery is a CSF leak until proven otherwise. CSF contains glucose (nasal mucus does not), and beta-2 transferrin is specific to CSF. This is a serious complication requiring immediate intervention."
      },
      {
        question: "A patient reports losing peripheral vision in both eyes (bumping into door frames on both sides). What visual field pattern does this suggest?",
        options: ["Homonymous hemianopsia (stroke)", "Bitemporal hemianopsia — optic chiasm compression from pituitary macroadenoma", "Monocular vision loss (optic neuritis)", "Central scotoma (macular degeneration)"],
        correct: 1,
        rationale: "Bitemporal hemianopsia (loss of temporal/peripheral visual fields bilaterally) is the hallmark of optic chiasm compression by a pituitary macroadenoma. The chiasm sits directly above the pituitary, and expansion compresses the crossing nasal fibers."
      }
    ]
  },
  "pituitary-apoplexy-rn": {
    title: "Pituitary Apoplexy",
    cellular: { title: "Pituitary Apoplexy Pathophysiology", content: "Pituitary apoplexy is a clinical emergency caused by sudden hemorrhage or infarction within a pituitary adenoma, resulting in rapid tumor expansion within the rigid bony sella turcica. The sudden expansion compresses surrounding structures: the optic chiasm (causing acute visual loss, typically bitemporal hemianopsia), the cavernous sinuses laterally (causing cranial nerve III, IV, and VI palsies with diplopia and ptosis), and the normal pituitary gland (causing acute hypopituitarism). ACTH deficiency is the most immediately life-threatening consequence, as cortisol is essential for maintaining vascular tone and stress response. Without emergent glucocorticoid replacement, secondary adrenal crisis develops with cardiovascular collapse. Triggers include anticoagulation therapy, pituitary stimulation testing, surgery, head trauma, and pregnancy (Sheehan syndrome involves pituitary infarction from postpartum hemorrhage)." },
    riskFactors: ["Pre-existing pituitary adenoma (usually macroadenoma)", "Anticoagulation therapy (increased hemorrhage risk into tumor)", "Pituitary stimulation testing (GnRH, TRH, CRH testing)", "Recent surgery (especially cardiac surgery with anticoagulation)", "Head trauma", "Pregnancy/postpartum (Sheehan syndrome)", "Diabetes mellitus", "Hypertension", "Radiation therapy to the sella"],
    diagnostics: ["Emergent MRI of the sella with and without contrast (imaging of choice — shows hemorrhage and compression)", "CT head to rule out subarachnoid hemorrhage (pituitary apoplexy can mimic SAH)", "Stat cortisol level (often critically low — do NOT delay treatment waiting for results)", "Complete anterior pituitary hormone panel (prolactin, TSH, free T4, LH, FSH, GH, IGF-1)", "Serum sodium (hyponatremia from SIADH or adrenal insufficiency)", "Visual field testing when patient is stable enough", "Visual acuity assessment"],
    management: ["IMMEDIATE IV hydrocortisone (100 mg bolus then 50 mg every 8 hours) — do NOT wait for lab results", "IV normal saline for hemodynamic support", "Urgent neurosurgical consultation for transsphenoidal decompression", "Surgery indicated for: severe or progressive visual loss, deteriorating consciousness, or severe ophthalmoplegia", "Conservative management (steroids + monitoring) for mild cases with stable vision and intact consciousness", "Long-term hormone replacement as needed (many patients develop permanent panhypopituitarism)"],
    nursingActions: ["Recognize the emergency: sudden severe headache + visual changes + altered consciousness = pituitary apoplexy", "Administer IV hydrocortisone STAT as ordered — this is life-saving", "Perform neurological assessment including visual acuity and pupil reactivity every 1-2 hours", "Monitor for signs of adrenal crisis: hypotension, tachycardia, altered consciousness", "Maintain strict intake and output (monitor for DI or SIADH)", "Prepare for urgent surgical intervention if visual deterioration progresses", "Monitor sodium levels closely (hyponatremia risk from SIADH or cortisol deficiency)"],
    assessmentFindings: ["Sudden severe headache (thunderclap headache — may mimic SAH)", "Acute visual loss or visual field deficits (bitemporal hemianopsia)", "Diplopia and ptosis (cranial nerve III palsy from cavernous sinus compression)", "Nausea and vomiting", "Altered level of consciousness (may range from confusion to coma)", "Signs of adrenal crisis: hypotension, tachycardia, weakness", "Ophthalmoplegia (impaired eye movements)"],
    signs: {
      left: ["Mild headache with stable visual fields", "Normal consciousness and orientation", "Hemodynamically stable", "Mild ophthalmoplegia without visual acuity loss"],
      right: ["Severe headache with progressive visual loss", "Altered consciousness or obtundation", "Hemodynamic instability (adrenal crisis)", "Complete ophthalmoplegia with fixed dilated pupil (CN III compression)"]
    },
    medications: [
      { name: "Hydrocortisone (IV)", type: "Glucocorticoid", action: "Replaces deficient cortisol from acute ACTH loss, maintaining vascular tone, glucose homeostasis, and stress response; prevents cardiovascular collapse from acute adrenal insufficiency", sideEffects: "Hyperglycemia, fluid retention, gastric irritation, immunosuppression (with prolonged use)", contra: "No absolute contraindications in this emergency setting", pearl: "100 mg IV bolus immediately, then 50 mg IV every 8 hours; this is the MOST CRITICAL intervention — adrenal crisis is the leading cause of death in pituitary apoplexy; do NOT delay administration waiting for cortisol levels" }
    ],
    pearls: ["Pituitary apoplexy mimics subarachnoid hemorrhage — sudden thunderclap headache with nausea/vomiting", "ACTH deficiency is the most immediately life-threatening consequence — give IV hydrocortisone STAT without waiting for labs", "Visual deterioration or decreased consciousness = urgent surgical decompression", "The triad of severe headache + visual changes + ophthalmoplegia points to pituitary apoplexy", "Most patients develop permanent panhypopituitarism requiring lifelong hormone replacement", "Sheehan syndrome is pituitary apoplexy from postpartum hemorrhage — presents with inability to lactate (prolactin loss) and failure to resume menses"],
    quiz: [
      {
        question: "A patient with a known pituitary adenoma develops a sudden severe headache, visual loss, and becomes hypotensive. What medication must be given FIRST?",
        options: ["IV normal saline bolus", "IV hydrocortisone 100 mg STAT", "Nitroglycerin for headache", "Morphine for pain control"],
        correct: 1,
        rationale: "IV hydrocortisone is the most critical intervention in pituitary apoplexy. Acute ACTH loss causes cortisol deficiency leading to vascular collapse. Steroids must be administered immediately — this is the most common cause of death in untreated pituitary apoplexy."
      },
      {
        question: "What visual field defect is expected from optic chiasm compression in pituitary apoplexy?",
        options: ["Homonymous hemianopsia", "Bitemporal hemianopsia (loss of peripheral vision bilaterally)", "Central scotoma", "Total blindness in one eye"],
        correct: 1,
        rationale: "The optic chiasm sits directly above the pituitary. Compression affects the crossing nasal fibers, producing bitemporal hemianopsia — loss of temporal (peripheral) visual fields in both eyes."
      },
      {
        question: "Why does pituitary apoplexy mimic subarachnoid hemorrhage?",
        options: ["They involve the same blood vessel", "Both present with sudden severe thunderclap headache, nausea, vomiting, and meningismus from blood irritating the meninges", "They require the same treatment", "They look identical on CT scan"],
        correct: 1,
        rationale: "Hemorrhage from the pituitary can track into the subarachnoid space, causing meningeal irritation that mimics SAH. Both present with thunderclap headache, nausea/vomiting, and neck stiffness, making differentiation challenging without imaging."
      }
    ]
  }
};
