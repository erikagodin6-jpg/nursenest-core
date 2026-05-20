import type { CareerQuestion } from "./rrt-questions";

export const rrtPharmacologyQuestions: CareerQuestion[] = [
  {
    id: "rrt-pharm-001",
    stem: "A physician orders albuterol 2.5 mg via small-volume nebulizer for a patient with acute bronchospasm. Which route of administration is being used?",
    options: [
      "Inhaled/aerosolized",
      "Intravenous",
      "Subcutaneous",
      "Intramuscular"
    ],
    correctIndex: 0,
    rationale: "Albuterol via small-volume nebulizer (SVN) is delivered by the inhaled/aerosolized route. This is the preferred route for bronchodilators because it delivers medication directly to the airways, resulting in rapid onset of action (5–15 minutes) with minimal systemic side effects.",
    distractorExplanations: [
      "IV albuterol is not available in the US and is not standard practice for bronchospasm.",
      "Subcutaneous injection is used for epinephrine in anaphylaxis, not for routine bronchodilator therapy.",
      "Intramuscular injection is not an appropriate route for albuterol delivery."
    ],
    clinicalConcept: "The inhaled route delivers medication directly to the target organ (lungs), maximizing local effect while minimizing systemic absorption and side effects.",
    examTip: "TMC questions often test whether you can match the drug to its correct delivery route. Albuterol = inhaled; epinephrine = subcutaneous/IV/inhaled; racemic epinephrine = inhaled.",
    safetyPearl: "Always verify the correct formulation — nebulizer solution (mg/mL) vs. MDI (mcg/puff) to prevent dosing errors.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "bronchodilator delivery",
    pharmacologyCategory: "Route of Administration"
  },
  {
    id: "rrt-pharm-002",
    stem: "A patient with croup is prescribed racemic epinephrine 0.5 mL of 2.25% solution via nebulizer. What is the primary mechanism of action?",
    options: [
      "Topical vasoconstriction reducing subglottic mucosal edema",
      "Bronchodilation via beta-2 receptor stimulation",
      "Anti-inflammatory effect via inhibition of phospholipase A2",
      "Mucolytic action breaking disulfide bonds in mucus"
    ],
    correctIndex: 0,
    rationale: "Racemic epinephrine acts primarily through alpha-adrenergic stimulation causing topical vasoconstriction of the subglottic mucosa, reducing edema and stridor in croup. While it does have beta-2 effects, its therapeutic benefit in croup is from mucosal decongestion.",
    distractorExplanations: [
      "Beta-2 bronchodilation is the mechanism for albuterol, not the primary reason racemic epinephrine is used in croup.",
      "Phospholipase A2 inhibition is the mechanism of corticosteroids, not epinephrine.",
      "Mucolytic action describes acetylcysteine (Mucomyst), not epinephrine."
    ],
    clinicalConcept: "Racemic epinephrine contains equal parts D- and L-isomers. The L-isomer provides the therapeutic vasoconstriction. Effects are temporary (1–2 hours), which is why observation for rebound stridor is required.",
    examTip: "Distinguish between alpha effects (vasoconstriction → reduces edema) and beta-2 effects (bronchodilation). Croup = alpha effect; asthma = beta-2 effect.",
    safetyPearl: "Patients receiving racemic epinephrine for croup must be observed for at least 2–4 hours due to risk of rebound edema after the drug wears off.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "upper airway medications",
    pharmacologyCategory: "Route of Administration"
  },
  {
    id: "rrt-pharm-003",
    stem: "Which bronchodilator is classified as a short-acting muscarinic antagonist (SAMA) and is commonly combined with albuterol in a DuoNeb?",
    options: [
      "Ipratropium bromide (Atrovent)",
      "Tiotropium bromide (Spiriva)",
      "Umeclidinium (Incruse Ellipta)",
      "Glycopyrrolate (Seebri)"
    ],
    correctIndex: 0,
    rationale: "Ipratropium bromide (Atrovent) is a short-acting muscarinic antagonist (SAMA) that blocks acetylcholine at M3 receptors in airway smooth muscle. DuoNeb combines ipratropium 0.5 mg with albuterol 2.5 mg for additive bronchodilation.",
    distractorExplanations: [
      "Tiotropium is a long-acting muscarinic antagonist (LAMA), not a SAMA, and is used for maintenance therapy.",
      "Umeclidinium is a LAMA used in COPD maintenance and is not combined in DuoNeb.",
      "Glycopyrrolate (Seebri) is a LAMA for COPD maintenance, not a SAMA."
    ],
    clinicalConcept: "SAMA drugs block parasympathetic bronchoconstriction. They have slower onset (15–30 min) but complement beta-2 agonists which have faster onset (5–15 min). Combining both provides superior bronchodilation.",
    examTip: "Know the difference between SAMA (ipratropium, short-acting) and LAMA (tiotropium, umeclidinium, glycopyrrolate — long-acting maintenance drugs).",
    safetyPearl: "Ipratropium is contraindicated in patients with soy or peanut allergy because the MDI formulation contains soy lecithin.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "anticholinergic bronchodilators",
    pharmacologyCategory: "Device Selection"
  },
  {
    id: "rrt-pharm-004",
    stem: "A 6-year-old child with asthma cannot coordinate an MDI. Which device modification would BEST improve drug delivery?",
    options: [
      "Attach a valved holding chamber (spacer) to the MDI",
      "Switch to a dry powder inhaler (DPI)",
      "Increase the MDI dose to compensate for poor technique",
      "Instruct the child to hold the MDI 4 inches from the mouth"
    ],
    correctIndex: 0,
    rationale: "A valved holding chamber (VHC/spacer) eliminates the need for precise hand-breath coordination by suspending the aerosolized medication in the chamber, allowing the child to inhale at their own pace. This significantly increases lung deposition and reduces oropharyngeal impaction.",
    distractorExplanations: [
      "DPIs require a strong inspiratory flow (>30 L/min) which many young children cannot generate reliably.",
      "Increasing the dose does not fix the coordination problem and increases risk of systemic side effects.",
      "The open-mouth technique still requires coordination and is not recommended for children."
    ],
    clinicalConcept: "Spacers increase fine-particle fraction reaching the lower airways from ~10% to ~20% while reducing oropharyngeal deposition of corticosteroids (decreasing thrush risk).",
    examTip: "For children <5 years: spacer + mask. For children 5–8 years: spacer + mouthpiece. For adolescents/adults: MDI alone if coordination is adequate, or DPI.",
    safetyPearl: "Spacers should be primed before first use by spraying 10–20 actuations into the chamber. Wash monthly with dilute dish soap and air dry to reduce static charge.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "pediatric inhaler devices",
    pharmacologyCategory: "Device Selection"
  },
  {
    id: "rrt-pharm-005",
    stem: "After administering albuterol via SVN, the patient develops tachycardia (HR 128), tremor, and reports feeling jittery. Which side effect profile does this represent?",
    options: [
      "Expected beta-adrenergic side effects from systemic absorption",
      "Allergic reaction requiring discontinuation",
      "Parasympathetic stimulation from the drug",
      "Signs of medication overdose requiring naloxone"
    ],
    correctIndex: 0,
    rationale: "Tachycardia, skeletal muscle tremor, and nervousness are common beta-adrenergic side effects of albuterol due to systemic absorption stimulating beta-1 (cardiac) and beta-2 (skeletal muscle) receptors. These are expected and usually well-tolerated.",
    distractorExplanations: [
      "These are pharmacologic side effects, not an allergic reaction. Allergic reactions would present with urticaria, angioedema, or anaphylaxis.",
      "Albuterol is a sympathomimetic, not a parasympathomimetic. Parasympathetic effects would include bradycardia and bronchoconstriction.",
      "Naloxone reverses opioids, not beta-agonists. There is no specific reversal agent for beta-agonist side effects."
    ],
    clinicalConcept: "Beta-2 agonists are not perfectly selective. At therapeutic doses, some beta-1 stimulation occurs, causing tachycardia. Tremor results from beta-2 stimulation of skeletal muscle.",
    examTip: "Side effects of beta-2 agonists: tachycardia, tremor, nervousness, hypokalemia. If the TMC asks 'which is an expected side effect,' tachycardia and tremor are the classic answers.",
    safetyPearl: "Monitor potassium levels in patients receiving frequent or continuous albuterol, as beta-2 stimulation drives potassium intracellularly, causing hypokalemia.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "bronchodilator side effects",
    pharmacologyCategory: "Side Effect Recognition"
  },
  {
    id: "rrt-pharm-006",
    stem: "A patient using beclomethasone MDI twice daily develops white patches on the tongue and oral mucosa. What is the most likely cause?",
    options: [
      "Oral candidiasis (thrush) from inhaled corticosteroid deposition",
      "Chemical burn from the propellant",
      "Allergic reaction to the medication",
      "Vitamin deficiency from malabsorption"
    ],
    correctIndex: 0,
    rationale: "Oral candidiasis (thrush) is a common local side effect of inhaled corticosteroids (ICS) caused by steroid deposition in the oropharynx, which suppresses local immune defenses and promotes fungal overgrowth.",
    distractorExplanations: [
      "HFA propellants do not cause chemical burns to the oral mucosa.",
      "White patches on the tongue are characteristic of candidiasis, not an allergic reaction which would present differently.",
      "ICS do not cause malabsorption; white oral patches are a direct local effect."
    ],
    clinicalConcept: "Prevention strategies include: mouth rinsing and spitting after each ICS use, using a spacer to reduce oropharyngeal deposition, and using the lowest effective ICS dose.",
    examTip: "Whenever a question describes white patches in the mouth + ICS use, the answer is oral candidiasis. The follow-up recommendation is always 'rinse and spit after use' and 'use a spacer.'",
    safetyPearl: "If oral candidiasis develops, treat with nystatin oral suspension or clotrimazole troches while continuing ICS therapy. Do not discontinue the ICS without physician guidance.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "corticosteroid side effects",
    pharmacologyCategory: "Side Effect Recognition"
  },
  {
    id: "rrt-pharm-007",
    stem: "Levalbuterol (Xopenex) was developed as an alternative to racemic albuterol. What is the primary claimed advantage?",
    options: [
      "Contains only the active R-isomer, potentially reducing cardiac side effects",
      "Provides longer duration of action than albuterol",
      "Can be administered intravenously unlike albuterol",
      "Has anti-inflammatory properties in addition to bronchodilation"
    ],
    correctIndex: 0,
    rationale: "Levalbuterol contains only the R-isomer (active enantiomer) of albuterol. The S-isomer in racemic albuterol was thought to contribute to side effects. Levalbuterol's claimed advantage is equivalent bronchodilation with fewer cardiac side effects, though clinical evidence is mixed.",
    distractorExplanations: [
      "Levalbuterol has the same duration of action (4–6 hours) as racemic albuterol.",
      "Neither levalbuterol nor albuterol is available for IV use in the US.",
      "Levalbuterol is a pure bronchodilator; it does not have anti-inflammatory properties."
    ],
    clinicalConcept: "The standard nebulizer dose of levalbuterol (0.63 mg or 1.25 mg) is lower than racemic albuterol (2.5 mg) because it contains only the active isomer.",
    examTip: "If a TMC question asks about levalbuterol vs. albuterol, know that levalbuterol = R-isomer only, lower dose, potentially fewer side effects but more expensive.",
    safetyPearl: "Cost-effectiveness analyses generally favor racemic albuterol for most patients. Reserve levalbuterol for patients with significant tachycardia from racemic albuterol.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "beta-2 agonist pharmacology",
    pharmacologyCategory: "Side Effect Recognition"
  },
  {
    id: "rrt-pharm-008",
    stem: "A respiratory therapist receives an order for salmeterol (Serevent) for a patient experiencing acute bronchospasm. What is the appropriate action?",
    options: [
      "Contact the physician to clarify — salmeterol is a LABA and not indicated for acute rescue",
      "Administer immediately as ordered",
      "Substitute levalbuterol without contacting the physician",
      "Administer salmeterol with ipratropium for enhanced effect"
    ],
    correctIndex: 0,
    rationale: "Salmeterol is a long-acting beta-2 agonist (LABA) with onset of 15–30 minutes, making it inappropriate for acute bronchospasm rescue. LABAs are maintenance medications. The RT should contact the physician to suggest a short-acting beta-2 agonist (SABA) like albuterol instead.",
    distractorExplanations: [
      "Administering a LABA for acute rescue is inappropriate and delays proper treatment.",
      "Substituting medications without a physician order is outside the RT's scope of practice.",
      "Combining salmeterol with ipratropium does not address the fact that salmeterol is wrong for acute use."
    ],
    clinicalConcept: "SABA (albuterol, levalbuterol) = rescue. LABA (salmeterol, formoterol, olodaterol) = maintenance. The FDA has a Black Box Warning on LABA monotherapy in asthma due to increased risk of severe exacerbations.",
    examTip: "Physician-order clarification questions test your ability to identify inappropriate orders. LABA for acute bronchospasm = always clarify.",
    safetyPearl: "LABAs should NEVER be used as monotherapy in asthma — they must always be combined with an inhaled corticosteroid (ICS/LABA combination).",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "order clarification",
    pharmacologyCategory: "Physician-Order Clarification"
  },
  {
    id: "rrt-pharm-009",
    stem: "A physician orders cromolyn sodium (Intal) for a patient currently in status asthmaticus. What should the respiratory therapist do?",
    options: [
      "Contact the physician — cromolyn is a prophylactic agent, not for acute exacerbations",
      "Administer immediately to stabilize mast cells",
      "Mix with albuterol in the same nebulizer",
      "Administer via MDI for faster onset"
    ],
    correctIndex: 0,
    rationale: "Cromolyn sodium is a mast cell stabilizer used for prophylaxis of exercise-induced bronchospasm and allergic asthma. It has NO bronchodilator activity and takes 2–4 weeks for therapeutic effect. It is inappropriate for acute asthma and may worsen bronchospasm due to the inhaled powder/solution.",
    distractorExplanations: [
      "While cromolyn does stabilize mast cells, this is a preventive mechanism that takes weeks — it cannot help during an acute attack.",
      "Cromolyn should not be mixed with other medications in the same nebulizer without compatibility confirmation.",
      "The route does not change the drug's mechanism — it simply cannot treat acute bronchospasm regardless of delivery method."
    ],
    clinicalConcept: "Mast cell stabilizers prevent degranulation and release of histamine and leukotrienes. They must be taken regularly before allergen/exercise exposure to be effective.",
    examTip: "Cromolyn = prophylactic only. If a question places it in an acute setting, the answer is always 'clarify the order.' Same logic applies to montelukast (Singulair).",
    safetyPearl: "Cromolyn can actually trigger bronchospasm in some patients during acute attacks due to the hypertonic nature of the nebulizer solution — another reason to avoid it acutely.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "mast cell stabilizers",
    pharmacologyCategory: "Physician-Order Clarification"
  },
  {
    id: "rrt-pharm-010",
    stem: "Following a bronchodilator treatment, the respiratory therapist should reassess the patient. Which finding BEST indicates a positive response?",
    options: [
      "Decreased wheezing, improved air entry, and reduced work of breathing",
      "Complete absence of all breath sounds",
      "Increased respiratory rate from 20 to 32 breaths/min",
      "Development of a productive cough with thick yellow sputum"
    ],
    correctIndex: 0,
    rationale: "A positive response to bronchodilator therapy is indicated by decreased wheezing (or wheezing that transitions from expiratory to no wheezing with good air entry), improved bilateral air movement, reduced accessory muscle use, and decreased respiratory rate.",
    distractorExplanations: [
      "Absent breath sounds indicate severe airflow obstruction ('silent chest') — this is a critical finding, not improvement.",
      "Increasing respiratory rate suggests worsening respiratory distress, not improvement.",
      "Yellow sputum production may indicate infection but does not represent bronchodilator response."
    ],
    clinicalConcept: "Post-bronchodilator assessment should include: breath sounds, respiratory rate, heart rate, SpO2, work of breathing, peak flow (if applicable), and patient subjective report.",
    examTip: "Paradoxically, wheezing may initially INCREASE after bronchodilator because airways open and allow air movement where it was previously trapped. This is actually a good sign if air entry improves.",
    safetyPearl: "Document pre- and post-treatment findings including breath sounds, vital signs, and patient tolerance. Report any adverse effects (tachycardia >120, tremor, chest pain) to the physician.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "post-treatment assessment",
    pharmacologyCategory: "Reassessment After Treatment"
  },
  {
    id: "rrt-pharm-011",
    stem: "A 3-year-old child with RSV bronchiolitis is ordered ribavirin (Virazole) via SPAG-2 generator. What is the primary concern for healthcare workers?",
    options: [
      "Ribavirin is teratogenic and poses a risk to pregnant healthcare workers",
      "Ribavirin causes immediate bronchospasm in healthcare workers",
      "The SPAG-2 generator is too loud for the pediatric unit",
      "Ribavirin must be mixed with normal saline which degrades quickly"
    ],
    correctIndex: 0,
    rationale: "Ribavirin is classified as FDA Pregnancy Category X (teratogenic). The primary safety concern is environmental exposure to aerosolized ribavirin, which poses a significant risk to pregnant healthcare workers and women of childbearing age.",
    distractorExplanations: [
      "Ribavirin does not cause bronchospasm in healthcare workers — the concern is teratogenicity, not acute respiratory effects.",
      "Noise level is not a clinically significant safety concern compared to teratogenicity.",
      "Ribavirin is reconstituted with sterile water (not normal saline), and stability is not the primary concern."
    ],
    clinicalConcept: "Ribavirin is delivered via the small-particle aerosol generator (SPAG-2) which creates 1.3 μm particles. Treatment is typically 12–18 hours/day for 3–7 days.",
    examTip: "Ribavirin + SPAG-2 + RSV + teratogenic risk to pregnant staff = classic TMC question cluster. Also know that ribavirin can clog ventilator circuits if the patient is mechanically ventilated.",
    safetyPearl: "Use scavenging systems, negative-pressure rooms, and limit exposure time. Pregnant staff must NOT administer or be in the room during ribavirin therapy.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "antiviral medications",
    pharmacologyCategory: "Pediatric Respiratory Pharmacology"
  },
  {
    id: "rrt-pharm-012",
    stem: "An intubated premature neonate (28 weeks GA) receives surfactant replacement therapy. Which statement about surfactant administration is MOST accurate?",
    options: [
      "It is administered via endotracheal tube in divided doses with position changes",
      "It is given via nebulizer to ensure even distribution",
      "It should be administered only after the first 48 hours of life",
      "It is mixed with albuterol for simultaneous bronchodilation"
    ],
    correctIndex: 0,
    rationale: "Exogenous surfactant (beractant/Survanta, calfactant/Infasurf, poractant alfa/Curosurf) is administered directly into the endotracheal tube in divided aliquots with position changes (right lateral, left lateral, supine) to ensure distribution to all lung segments.",
    distractorExplanations: [
      "Surfactant is a viscous liquid that cannot be effectively nebulized — it must be instilled directly into the ETT.",
      "Early surfactant administration (within 2 hours of birth) improves outcomes. Waiting 48 hours would be harmful.",
      "Surfactant should not be mixed with other medications. It is administered as a standalone bolus."
    ],
    clinicalConcept: "Surfactant reduces alveolar surface tension, preventing atelectasis. Natural surfactant contains phospholipids (DPPC), surfactant proteins (SP-A, B, C, D), and is produced by Type II alveolar cells.",
    examTip: "Know surfactant brands: Survanta (bovine), Infasurf (calf), Curosurf (porcine). Administration = intratracheal instillation. Prophylactic (before symptoms) vs. rescue (after RDS develops).",
    safetyPearl: "Monitor for transient bradycardia, desaturation, and ETT obstruction during surfactant instillation. Have suction and resuscitation equipment immediately available.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "surfactant therapy",
    pharmacologyCategory: "Neonatal Concepts"
  },
  {
    id: "rrt-pharm-013",
    stem: "A neonate is receiving caffeine citrate for apnea of prematurity. What is the primary mechanism of action?",
    options: [
      "Central respiratory stimulation via adenosine receptor antagonism",
      "Direct bronchodilation via beta-2 receptor activation",
      "Mucolytic effect reducing airway secretions",
      "Peripheral chemoreceptor sensitization to carbon dioxide"
    ],
    correctIndex: 0,
    rationale: "Caffeine citrate is a methylxanthine that stimulates the central respiratory drive by blocking adenosine receptors in the brainstem. It increases minute ventilation, improves CO2 sensitivity, and reduces the frequency of apneic episodes in premature neonates.",
    distractorExplanations: [
      "Caffeine has mild bronchodilator effects but its primary action in apnea of prematurity is central respiratory stimulation, not beta-2 activation.",
      "Caffeine does not have mucolytic properties.",
      "While methylxanthines can increase chemoreceptor sensitivity, the primary mechanism is central adenosine receptor antagonism."
    ],
    clinicalConcept: "Caffeine citrate has largely replaced theophylline/aminophylline for neonatal apnea due to its wider therapeutic index, longer half-life, and easier dosing. Loading dose: 20 mg/kg; maintenance: 5–10 mg/kg/day.",
    examTip: "Methylxanthines for neonatal apnea: caffeine citrate (preferred) > aminophylline/theophylline. Caffeine has fewer side effects and no need for drug level monitoring in most cases.",
    safetyPearl: "Monitor for tachycardia, irritability, feeding intolerance, and seizures. Caffeine citrate dose differs from caffeine base — always verify which formulation is being ordered.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "neonatal respiratory stimulants",
    pharmacologyCategory: "Neonatal Concepts"
  },
  {
    id: "rrt-pharm-014",
    stem: "When delivering aerosolized medication to a mechanically ventilated patient, where should the MDI adapter be placed in the ventilator circuit?",
    options: [
      "In the inspiratory limb, 15–30 cm from the patient wye",
      "At the exhalation valve",
      "In the expiratory limb near the ventilator",
      "Directly at the endotracheal tube connector"
    ],
    correctIndex: 0,
    rationale: "The MDI adapter (or spacer chamber) should be placed in the inspiratory limb approximately 15–30 cm from the patient wye. This position allows the aerosol plume to entrain into the inspiratory gas flow and provides adequate distance for particle deceleration, maximizing lower airway deposition.",
    distractorExplanations: [
      "Placing at the exhalation valve would direct medication away from the patient into the exhaled gas pathway.",
      "The expiratory limb carries exhaled gas away from the patient — medication would not reach the lungs.",
      "Directly at the ETT connector increases impaction on the tube walls and reduces drug delivery."
    ],
    clinicalConcept: "Aerosol delivery efficiency in ventilated patients is typically 10–15% of the nominal dose. Factors affecting delivery: humidification (reduces deposition), circuit design, ventilator settings, and device placement.",
    examTip: "For MDI in ventilator circuit: use spacer adapter in inspiratory limb, coordinate actuation with inspiration, remove HME (if present), and consider temporarily reducing humidification.",
    safetyPearl: "Remove the heat-moisture exchanger (HME) during aerosol treatments as it traps aerosol particles and dramatically reduces drug delivery to the patient.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "ventilator aerosol delivery",
    pharmacologyCategory: "Ventilated Patient Medication Delivery"
  },
  {
    id: "rrt-pharm-015",
    stem: "A mechanically ventilated patient requires albuterol. The RT has the choice between SVN and MDI with spacer. Which statement is CORRECT regarding aerosol delivery in ventilated patients?",
    options: [
      "MDI with spacer in the circuit provides more consistent dosing with less residual waste",
      "SVN always delivers more drug than MDI in ventilated patients",
      "Neither SVN nor MDI can be used in ventilated circuits",
      "The ventilator must be disconnected from the patient to use either device"
    ],
    correctIndex: 0,
    rationale: "Studies show that MDI with a spacer chamber in the ventilator circuit provides consistent, reproducible dosing with less drug waste compared to SVN. An SVN in the circuit can alter ventilator flows and tidal volumes. The MDI with spacer is generally preferred for in-circuit aerosol delivery.",
    distractorExplanations: [
      "SVN delivery in ventilator circuits is actually less efficient due to continuous nebulization during expiration, where drug is wasted.",
      "Both SVN and MDI can be used in ventilator circuits with appropriate adapters.",
      "The ventilator circuit should NOT be disconnected for aerosol delivery — in-line adapters allow treatment without disconnection."
    ],
    clinicalConcept: "4–8 puffs of albuterol via MDI with spacer ≈ 2.5 mg via SVN in ventilated patients. The MDI dose may need to be higher than for spontaneously breathing patients.",
    examTip: "Key factors for optimizing aerosol delivery in ventilated patients: use spacer, coordinate with inspiration, remove HME, use bias flow ≤2 L/min if possible, ensure adequate inspiratory time.",
    safetyPearl: "When using SVN in the ventilator circuit, the added flow from the nebulizer (~6–8 L/min) can increase delivered tidal volume and trigger high-pressure alarms. Adjust alarms and monitor closely.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "ventilator aerosol comparison",
    pharmacologyCategory: "Ventilated Patient Medication Delivery"
  },
  {
    id: "rrt-pharm-016",
    stem: "A patient with asthma performs pre- and post-bronchodilator spirometry. The pre-BD FEV1 is 2.0 L and post-BD FEV1 is 2.5 L. What is the percent improvement and is it significant?",
    options: [
      "25% improvement — this is a positive (significant) bronchodilator response",
      "10% improvement — this is borderline",
      "50% improvement — this suggests restriction, not obstruction",
      "25% improvement — but this is not clinically significant"
    ],
    correctIndex: 0,
    rationale: "Percent improvement = (2.5 - 2.0) / 2.0 × 100 = 25%. A positive bronchodilator response is defined as ≥12% improvement AND ≥200 mL absolute increase in FEV1. This patient meets both criteria (25% improvement and 500 mL increase), confirming significant reversibility consistent with asthma.",
    distractorExplanations: [
      "The calculation clearly shows 25%, not 10%. (2.5-2.0)/2.0 = 0.25 = 25%.",
      "This improvement pattern is consistent with reversible obstruction (asthma), not restriction.",
      "A 25% improvement exceeding both the 12% and 200 mL thresholds is definitively clinically significant by ATS/ERS criteria."
    ],
    clinicalConcept: "ATS/ERS criteria for positive bronchodilator response: ≥12% improvement AND ≥200 mL absolute increase in FEV1 or FVC from baseline. This helps distinguish reversible (asthma) from fixed (COPD) obstruction.",
    examTip: "The TMC loves bronchodilator response calculation questions. Formula: (Post - Pre) / Pre × 100. Significant = ≥12% AND ≥200 mL increase.",
    safetyPearl: "Withhold short-acting bronchodilators for 4–6 hours and long-acting for 12–24 hours before pre-bronchodilator spirometry to get accurate baseline values.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "bronchodilator response testing",
    pharmacologyCategory: "Bronchodilator Response Interpretation"
  },
  {
    id: "rrt-pharm-017",
    stem: "A CHF patient on mechanical ventilation develops crackles bilaterally, decreased SpO2, and frothy pink sputum. The physician orders furosemide (Lasix) 40 mg IV. What is the respiratory therapist's primary monitoring responsibility?",
    options: [
      "Monitor I&O, SpO2, breath sounds, and watch for signs of hypokalemia",
      "Administer the furosemide via nebulizer",
      "Increase the ventilator rate to compensate for fluid overload",
      "Administer sodium bicarbonate concurrently"
    ],
    correctIndex: 0,
    rationale: "Furosemide is a loop diuretic that promotes rapid diuresis. The RT should monitor intake and output (I&O), SpO2, breath sounds for improvement, and watch for hypokalemia (a common side effect of loop diuretics) which can cause cardiac arrhythmias.",
    distractorExplanations: [
      "Furosemide is given IV for pulmonary edema, not via nebulizer. While inhaled furosemide has been studied, it is not standard practice.",
      "Increasing ventilator rate does not address the fluid overload — the treatment is diuresis. PEEP may help with oxygenation.",
      "Sodium bicarbonate is not indicated for fluid overload management."
    ],
    clinicalConcept: "In cardiogenic pulmonary edema, fluid shifts into alveoli causing crackles and hypoxemia. Furosemide reduces preload by diuresis. PEEP on the ventilator helps by increasing functional residual capacity and improving oxygenation.",
    examTip: "Frothy pink sputum + crackles + dyspnea = pulmonary edema. Treatment: furosemide (diuretic), morphine (reduce preload/anxiety), CPAP/PEEP (splint open alveoli), position upright.",
    safetyPearl: "Loop diuretics cause hypokalemia, hypomagnesemia, and metabolic alkalosis. Hypokalemia potentiates digitalis toxicity — critical in CHF patients on digoxin.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "diuretic monitoring",
    pharmacologyCategory: "Fluid Overload/Diuretic Monitoring"
  },
  {
    id: "rrt-pharm-018",
    stem: "During a code blue, the physician calls for epinephrine 1 mg IV push for a patient in pulseless electrical activity (PEA). What is the correct concentration for IV push in cardiac arrest?",
    options: [
      "1:10,000 (0.1 mg/mL)",
      "1:1,000 (1 mg/mL)",
      "1:100,000 (0.01 mg/mL)",
      "1:100 (10 mg/mL)"
    ],
    correctIndex: 0,
    rationale: "For IV push during cardiac arrest, epinephrine 1:10,000 (0.1 mg/mL) is the correct concentration. This provides 1 mg in a 10 mL prefilled syringe. The 1:1,000 concentration is used for IM injection (anaphylaxis) or for nebulization, not for direct IV push.",
    distractorExplanations: [
      "1:1,000 (1 mg/mL) is the IM concentration for anaphylaxis. Giving this concentration IV push could cause severe hypertension and arrhythmias.",
      "1:100,000 is used for local anesthetic mixtures with epinephrine, not for cardiac arrest.",
      "1:100 concentration does not exist as a standard epinephrine preparation."
    ],
    clinicalConcept: "ACLS protocol: Epinephrine 1 mg IV/IO every 3–5 minutes during cardiac arrest. The primary mechanism in arrest is alpha-1 vasoconstriction increasing coronary and cerebral perfusion pressure.",
    examTip: "1:10,000 = IV in cardiac arrest. 1:1,000 = IM in anaphylaxis or nebulized for croup/stridor. NEVER mix these up — it's a patient safety question.",
    safetyPearl: "Epinephrine concentration errors are a leading cause of medication errors in emergencies. Always verify concentration AND route before administration. Use prefilled syringes when available.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "emergency cardiac medications",
    pharmacologyCategory: "Emergency Medication Recognition"
  },
  {
    id: "rrt-pharm-019",
    stem: "A patient with COPD is prescribed tiotropium (Spiriva) via HandiHaler. Which instruction is essential for proper use?",
    options: [
      "Inhale slowly and deeply, then hold breath for 10 seconds",
      "Shake the device vigorously before each use",
      "Exhale into the device before inhaling",
      "Take two rapid shallow breaths to activate the device"
    ],
    correctIndex: 0,
    rationale: "The HandiHaler is a dry powder inhaler (DPI) that requires the patient to inhale slowly and deeply through the mouthpiece to draw the powder into the lungs. Breath-holding for 10 seconds allows particle sedimentation in the lower airways.",
    distractorExplanations: [
      "DPIs are not shaken — only MDIs with suspension formulations need shaking. The HandiHaler uses a capsule that is pierced, not a canister.",
      "Exhaling into a DPI would introduce moisture and clump the dry powder, reducing drug delivery.",
      "DPIs are breath-actuated and require steady deep inhalation, not rapid shallow breaths."
    ],
    clinicalConcept: "DPIs are breath-actuated (no coordination needed) but require adequate inspiratory flow (typically >30 L/min). The HandiHaler uses a capsule pierced by pins when the button is pressed.",
    examTip: "MDI = slow inhalation with coordination (or use spacer). DPI = slow deep inhalation, no spacer, no shaking. Never exhale into a DPI.",
    safetyPearl: "Tiotropium capsules are for inhalation only — they should NEVER be swallowed. Store capsules in the blister pack until ready for use to prevent moisture degradation.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "DPI technique",
    pharmacologyCategory: "Device Selection"
  },
  {
    id: "rrt-pharm-020",
    stem: "Which of the following medications is contraindicated in a patient with a known peanut allergy?",
    options: [
      "Ipratropium bromide MDI (Atrovent HFA)",
      "Albuterol nebulizer solution",
      "Budesonide nebulizer suspension (Pulmicort)",
      "Fluticasone MDI (Flovent)"
    ],
    correctIndex: 0,
    rationale: "Ipratropium bromide MDI (Atrovent HFA) contains soy lecithin as a surfactant. Soy and peanut share cross-reactive allergens, so ipratropium MDI is contraindicated in patients with peanut or soy allergy. The nebulizer solution of ipratropium does not contain soy lecithin.",
    distractorExplanations: [
      "Albuterol nebulizer solution does not contain soy lecithin and is safe for peanut-allergic patients.",
      "Budesonide (Pulmicort) nebulizer suspension does not contain soy or peanut proteins.",
      "Fluticasone MDI (Flovent HFA) does not contain soy lecithin in its formulation."
    ],
    clinicalConcept: "Cross-reactivity between soy and peanut allergies occurs because both are legumes sharing similar protein structures. Always check inhaler excipients for known allergens.",
    examTip: "Peanut/soy allergy + ipratropium MDI = contraindicated is a HIGH-YIELD TMC question. Remember: the NEBULIZER solution is fine, only the MDI is contraindicated.",
    safetyPearl: "If a peanut-allergic patient needs an anticholinergic, use the ipratropium NEBULIZER solution (which is soy-free) instead of the MDI.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "drug contraindications",
    pharmacologyCategory: "Contraindications"
  },
  {
    id: "rrt-pharm-021",
    stem: "A patient with narrow-angle glaucoma is prescribed ipratropium nebulizer. What precaution must be emphasized?",
    options: [
      "Use a mouthpiece instead of a face mask to prevent eye exposure",
      "Administer at half the standard dose",
      "Discontinue all other medications during treatment",
      "Administer only at night to minimize photosensitivity"
    ],
    correctIndex: 0,
    rationale: "Ipratropium is an anticholinergic that can cause pupil dilation (mydriasis) and worsen narrow-angle glaucoma if the aerosol contacts the eyes. Using a mouthpiece instead of a face mask prevents ocular exposure. If a mask must be used, ensure it fits snugly to prevent leakage around the eyes.",
    distractorExplanations: [
      "Dose reduction is not the solution — the concern is ocular exposure, not systemic dose.",
      "Other medications do not need to be discontinued; the issue is specific to eye exposure from the nebulized anticholinergic.",
      "Ipratropium does not cause photosensitivity; the concern is direct anticholinergic effect on the eye."
    ],
    clinicalConcept: "Anticholinergic effects on the eye include mydriasis (dilation) and cycloplegia (paralysis of accommodation). In narrow-angle glaucoma, mydriasis can obstruct aqueous humor drainage, precipitating an acute glaucoma crisis.",
    examTip: "Glaucoma + anticholinergic nebulizer = use mouthpiece. This applies to both ipratropium and tiotropium when nebulized.",
    safetyPearl: "If a patient using nebulized ipratropium develops eye pain, blurred vision, or halos around lights, stop treatment and notify the physician immediately — these are signs of acute glaucoma.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "anticholinergic precautions",
    pharmacologyCategory: "Contraindications"
  },
  {
    id: "rrt-pharm-022",
    stem: "A physician orders acetylcysteine (Mucomyst) 20% 3 mL via SVN for a patient with thick tenacious secretions. What should be co-administered?",
    options: [
      "A bronchodilator (albuterol) to prevent acetylcysteine-induced bronchospasm",
      "An antibiotic to prevent infection",
      "Normal saline to dilute the medication to 5%",
      "A corticosteroid to enhance mucolytic activity"
    ],
    correctIndex: 0,
    rationale: "Acetylcysteine (Mucomyst) is a mucolytic that breaks disulfide bonds in mucus glycoproteins. It has a strong sulfur odor and can trigger reflex bronchospasm, especially in patients with reactive airways. A bronchodilator (albuterol) should be administered prior to or concurrently with acetylcysteine to prevent this.",
    distractorExplanations: [
      "Prophylactic antibiotics are not required with mucolytic therapy.",
      "Diluting to 5% would reduce the therapeutic dose. The 20% and 10% solutions are standard concentrations.",
      "Corticosteroids do not enhance mucolytic activity and are not routinely co-administered."
    ],
    clinicalConcept: "Acetylcysteine works by breaking disulfide bonds in mucus glycoproteins, reducing viscosity. It is also used as an antidote for acetaminophen overdose (oral/IV, much higher doses).",
    examTip: "Mucomyst = always give with a bronchodilator. The characteristic 'rotten egg' smell is from the sulfur compound. Classic TMC pairing question.",
    safetyPearl: "Acetylcysteine can discolor to light purple when exposed to air — this does not affect potency. However, discard if the solution turns dark or contains particulate matter.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "mucolytic agents",
    pharmacologyCategory: "Side Effect Recognition"
  },
  {
    id: "rrt-pharm-023",
    stem: "A 10-month-old infant with bronchiolitis needs albuterol. What is the most appropriate delivery device?",
    options: [
      "Small-volume nebulizer with a face mask",
      "Dry powder inhaler (DPI)",
      "Metered-dose inhaler without a spacer",
      "Ultrasonic nebulizer with mouthpiece"
    ],
    correctIndex: 0,
    rationale: "For infants who cannot use a mouthpiece or coordinate with an MDI, a small-volume nebulizer with an appropriately-sized face mask is the preferred delivery method. The mask provides a seal over the nose and mouth, allowing the infant to breathe normally while receiving medication.",
    distractorExplanations: [
      "DPIs require an inspiratory flow of >30 L/min which infants cannot generate.",
      "An MDI without a spacer requires hand-breath coordination impossible for a 10-month-old.",
      "Infants cannot maintain a seal on a mouthpiece. A face mask is necessary for this age group."
    ],
    clinicalConcept: "Aerosol delivery in pediatric patients: infants/toddlers = SVN + mask or MDI + spacer + mask. Preschool (3-5 yrs) = SVN + mask or MDI + spacer + mask/mouthpiece. School-age (>6 yrs) = MDI + spacer or DPI.",
    examTip: "Age-appropriate device selection is HIGH-YIELD. Remember: the younger the child, the more 'assisted' the device needs to be (mask > mouthpiece, nebulizer > DPI).",
    safetyPearl: "Avoid 'blow-by' technique (holding the nebulizer near the face without a mask) — it dramatically reduces drug delivery. A properly fitting mask is essential.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "pediatric aerosol delivery",
    pharmacologyCategory: "Pediatric Respiratory Pharmacology"
  },
  {
    id: "rrt-pharm-024",
    stem: "A patient on continuous albuterol nebulization develops a serum potassium of 3.0 mEq/L (normal 3.5–5.0). What is the mechanism of this electrolyte disturbance?",
    options: [
      "Beta-2 stimulation drives potassium into cells (intracellular shift)",
      "Albuterol increases renal potassium excretion",
      "Albuterol binds potassium directly in the bloodstream",
      "The nebulizer solution dilutes serum potassium"
    ],
    correctIndex: 0,
    rationale: "Beta-2 receptor stimulation activates the Na+/K+-ATPase pump on cell membranes, driving potassium from the extracellular space into cells. This intracellular shift of potassium causes transient hypokalemia, which can be significant with continuous or frequent albuterol treatments.",
    distractorExplanations: [
      "Albuterol does not directly affect renal potassium excretion. Loop diuretics increase renal K+ loss.",
      "Albuterol does not chemically bind potassium. The mechanism is cellular redistribution.",
      "Nebulizer solution volume (3-5 mL) is negligible and does not dilute serum electrolytes."
    ],
    clinicalConcept: "Continuous albuterol at 10–15 mg/hr is used for severe asthma exacerbations. Hypokalemia (<3.5 mEq/L) can cause cardiac arrhythmias, muscle weakness, and prolonged QT interval.",
    examTip: "Beta-2 agonist → hypokalemia (intracellular shift). This is the opposite of beta-blockers and succinylcholine, which can cause hyperkalemia.",
    safetyPearl: "Monitor potassium levels every 2–4 hours during continuous albuterol. Replace potassium as needed. Concurrent use of loop diuretics and albuterol compounds the hypokalemia risk.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "electrolyte disturbances",
    pharmacologyCategory: "Side Effect Recognition"
  },
  {
    id: "rrt-pharm-025",
    stem: "Which inhaled corticosteroid is available as a nebulizer suspension for young children with persistent asthma?",
    options: [
      "Budesonide (Pulmicort Respules)",
      "Fluticasone propionate (Flovent)",
      "Mometasone furoate (Asmanex)",
      "Ciclesonide (Alvesco)"
    ],
    correctIndex: 0,
    rationale: "Budesonide (Pulmicort Respules) is the only inhaled corticosteroid available as a nebulizer suspension, making it the preferred ICS for infants and young children who cannot use MDIs or DPIs. It is FDA-approved for children 12 months and older.",
    distractorExplanations: [
      "Fluticasone propionate (Flovent) is available as MDI and DPI only, not as a nebulizer solution.",
      "Mometasone (Asmanex) is available as DPI only.",
      "Ciclesonide (Alvesco) is available as MDI only."
    ],
    clinicalConcept: "Pulmicort Respules come in 0.25 mg/2 mL and 0.5 mg/2 mL concentrations. They should be administered via jet nebulizer (not ultrasonic, which can degrade the suspension).",
    examTip: "Pulmicort Respules = ONLY nebulizable ICS. High-yield for pediatric pharmacology questions. Remember: jet nebulizer only (not ultrasonic).",
    safetyPearl: "Budesonide Respules can be mixed with albuterol and ipratropium in the same nebulizer for combination treatment. Do not mix with other medications without checking compatibility.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "pediatric corticosteroids",
    pharmacologyCategory: "Pediatric Respiratory Pharmacology"
  },
  {
    id: "rrt-pharm-026",
    stem: "A physician orders 3% hypertonic saline via SVN for a patient with cystic fibrosis. What is the primary therapeutic purpose?",
    options: [
      "To promote osmotic hydration of airway secretions and improve mucociliary clearance",
      "To provide bronchodilation for airway obstruction",
      "To deliver sodium supplementation for electrolyte imbalance",
      "To sterilize the airway surface of bacteria"
    ],
    correctIndex: 0,
    rationale: "Hypertonic saline (3-7%) draws water into the airway lumen by osmosis, hydrating thick dehydrated secretions characteristic of cystic fibrosis. This improves mucociliary clearance and helps patients expectorate mucus more effectively.",
    distractorExplanations: [
      "Hypertonic saline does not have direct bronchodilator properties. In fact, it can cause bronchospasm in sensitive patients.",
      "The purpose is airway hydration, not systemic sodium replacement. The sodium stays in the airway lumen.",
      "Hypertonic saline does not have antibacterial properties at therapeutic concentrations."
    ],
    clinicalConcept: "In CF, defective CFTR channels result in dehydrated, thick airway secretions. Hypertonic saline helps restore the airway surface liquid layer, improving ciliary beating and mucus transport.",
    examTip: "CF + thick secretions + hypertonic saline = osmotic mucokinesis. Always pre-treat with a bronchodilator because HTS can trigger bronchospasm.",
    safetyPearl: "Always administer a bronchodilator BEFORE hypertonic saline to prevent bronchospasm. Monitor SpO2 and auscultate during treatment.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "mucokinetic agents",
    pharmacologyCategory: "Route of Administration"
  },
  {
    id: "rrt-pharm-027",
    stem: "A RT is preparing to administer dornase alfa (Pulmozyme) to a CF patient. Which nebulizer type is recommended?",
    options: [
      "Jet nebulizer or specific approved breath-enhanced nebulizer",
      "Ultrasonic nebulizer",
      "Vibrating mesh nebulizer with heated circuit",
      "Any standard small-volume nebulizer"
    ],
    correctIndex: 0,
    rationale: "Dornase alfa (Pulmozyme) is a recombinant DNase enzyme that should be delivered via the specific FDA-approved nebulizer systems (Hudson T Up-draft II, Marquest Acorn II, or PARI LC Plus/Sprint with appropriate compressor). Ultrasonic nebulizers can denature the protein.",
    distractorExplanations: [
      "Ultrasonic nebulizers generate heat that can denature the dornase alfa protein, reducing efficacy.",
      "Heated circuits can also degrade the protein structure. Specific approved devices must be used.",
      "Not all nebulizers are appropriate — the drug is a protein enzyme sensitive to delivery method."
    ],
    clinicalConcept: "Dornase alfa cleaves extracellular DNA released from neutrophils in CF airway secretions, reducing sputum viscosity. It is specific to CF and is not a general mucolytic.",
    examTip: "Pulmozyme = recombinant DNase, for CF only, specific nebulizer required (NOT ultrasonic). Do not mix with other medications.",
    safetyPearl: "Dornase alfa must be refrigerated (2-8°C) and protected from light. Do not mix with other drugs in the nebulizer. Use within 24 hours of removing from refrigeration.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "CF-specific medications",
    pharmacologyCategory: "Device Selection"
  },
  {
    id: "rrt-pharm-028",
    stem: "After administering a bronchodilator, a peak flow measurement increases from 250 L/min to 325 L/min. What percent improvement does this represent?",
    options: [
      "30% improvement",
      "20% improvement",
      "15% improvement",
      "75% improvement"
    ],
    correctIndex: 0,
    rationale: "Percent improvement = (325 - 250) / 250 × 100 = 75/250 × 100 = 30%. A ≥20% improvement in peak flow after bronchodilator administration is generally considered a significant positive response.",
    distractorExplanations: [
      "20% would require improvement to only 300 L/min. The actual improvement to 325 L/min is 30%.",
      "15% improvement would represent only ~37.5 L/min increase. The actual increase is 75 L/min.",
      "75% would require improvement to ~437 L/min from baseline 250 L/min."
    ],
    clinicalConcept: "Peak expiratory flow (PEF) is effort-dependent but useful for monitoring bronchodilator response in asthmatics. Green zone ≥80%, Yellow zone 50-80%, Red zone <50% of personal best.",
    examTip: "Know both PEF and FEV1 improvement thresholds. PEF: ≥20% improvement = significant. FEV1: ≥12% AND ≥200 mL = significant by ATS criteria.",
    safetyPearl: "Peak flow meters should be calibrated and the patient should perform 3 efforts — record the best of 3 attempts. Ensure upright position and maximal effort.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "bronchodilator response",
    pharmacologyCategory: "Bronchodilator Response Interpretation"
  },
  {
    id: "rrt-pharm-029",
    stem: "An intubated COPD patient on the ventilator is ordered ipratropium via MDI. How many puffs are typically required to achieve an equivalent therapeutic dose compared to spontaneous breathing?",
    options: [
      "4–8 puffs (higher dose to compensate for circuit losses)",
      "1 puff (same as spontaneous breathing)",
      "20 puffs (to overcome endotracheal tube resistance)",
      "The dose is the same as for non-intubated patients"
    ],
    correctIndex: 0,
    rationale: "Due to losses from ETT impaction, circuit deposition, and humidification, typically 4–8 puffs of ipratropium via MDI with spacer in the ventilator circuit are needed to deliver an equivalent therapeutic dose compared to the 2 puffs used for spontaneously breathing patients.",
    distractorExplanations: [
      "1 puff would deliver insufficient medication due to circuit and ETT losses (only 10-15% reaches lungs).",
      "20 puffs is excessive and not supported by evidence or guidelines.",
      "The dose must be increased for intubated patients due to significant drug losses in the circuit."
    ],
    clinicalConcept: "Approximately 10-15% of the nominal MDI dose reaches the lower airways in intubated patients (vs. 10-20% in spontaneous breathing). Factors reducing delivery: humidification, circuit volume, ETT size, and turbulent flow.",
    examTip: "Ventilator MDI dosing: generally 2-4× the spontaneous breathing dose. Remember the spacer adapter is essential for efficient delivery.",
    safetyPearl: "Coordinate each MDI actuation with the beginning of inspiration for maximum delivery. Wait 15–30 seconds between puffs. Do not actuate multiple puffs simultaneously into the spacer.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "ventilator MDI dosing",
    pharmacologyCategory: "Ventilated Patient Medication Delivery"
  },
  {
    id: "rrt-pharm-030",
    stem: "A neonate born at 26 weeks gestation develops respiratory distress syndrome (RDS). What type of surfactant is most commonly used for replacement therapy?",
    options: [
      "Natural (animal-derived) surfactant extracted from bovine or porcine lungs",
      "Synthetic surfactant containing only DPPC",
      "Aerosolized surfactant via high-flow nebulizer",
      "Oral surfactant suspension"
    ],
    correctIndex: 0,
    rationale: "Natural (animal-derived) surfactant preparations (beractant/Survanta from bovine, poractant alfa/Curosurf from porcine, calfactant/Infasurf from calf) are preferred because they contain surfactant-associated proteins (SP-B, SP-C) that improve surface tension lowering and spreading.",
    distractorExplanations: [
      "Early synthetic surfactants containing only DPPC showed inferior outcomes compared to natural surfactants. Newer synthetic formulations with protein analogs are improving but natural remains standard.",
      "Surfactant is too viscous for aerosolization and must be instilled directly into the ETT.",
      "Oral surfactant would be destroyed by gastric acid and cannot reach the lungs."
    ],
    clinicalConcept: "Surfactant reduces alveolar surface tension according to LaPlace's law (P = 2T/r). Without surfactant, small alveoli collapse (atelectasis). Premature neonates lack adequate surfactant production until ~35 weeks gestation.",
    examTip: "Know the three main natural surfactant brands: Survanta (bovine), Curosurf (porcine), Infasurf (calf). All are given via ETT. Curosurf has the highest phospholipid concentration.",
    safetyPearl: "Store surfactant at correct temperature per manufacturer guidelines. Warm to room temperature before administration. Do not shake vigorously — gently swirl to mix.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "neonatal surfactant",
    pharmacologyCategory: "Neonatal Concepts"
  },
  {
    id: "rrt-pharm-031",
    stem: "Which of the following is a known contraindication for beta-2 agonist bronchodilator therapy?",
    options: [
      "Pre-existing tachyarrhythmia unresponsive to treatment",
      "Mild asthma exacerbation",
      "COPD with stable vital signs",
      "Exercise-induced bronchospasm"
    ],
    correctIndex: 0,
    rationale: "Beta-2 agonists stimulate beta-1 cardiac receptors as well, causing tachycardia. In a patient with a pre-existing uncontrolled tachyarrhythmia (e.g., SVT, uncontrolled atrial fibrillation), the additional cardiac stimulation from beta-2 agonists could worsen the arrhythmia or cause hemodynamic instability.",
    distractorExplanations: [
      "Asthma exacerbation is the primary INDICATION for beta-2 agonists, not a contraindication.",
      "Stable COPD is an appropriate indication for bronchodilator therapy.",
      "Exercise-induced bronchospasm is effectively treated and prevented by SABA pre-treatment."
    ],
    clinicalConcept: "Relative contraindications to beta-2 agonists include: uncontrolled tachyarrhythmias, severe hypertension, thyrotoxicosis, and recent MI with hemodynamic instability.",
    examTip: "Most TMC 'contraindication' questions focus on cardiac effects. Beta-2 agonist + tachyarrhythmia = relative contraindication. Consider ipratropium as an alternative.",
    safetyPearl: "In patients with cardiac concerns requiring bronchodilation, ipratropium (anticholinergic) may be a safer alternative as it does not stimulate beta-adrenergic receptors.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "bronchodilator contraindications",
    pharmacologyCategory: "Contraindications"
  },
  {
    id: "rrt-pharm-032",
    stem: "A patient with severe status asthmaticus is not responding to continuous albuterol and IV corticosteroids. The physician considers adding IV magnesium sulfate. What is the rationale?",
    options: [
      "Magnesium causes smooth muscle relaxation and has bronchodilator properties",
      "Magnesium is a potent anti-inflammatory agent",
      "Magnesium replaces electrolyte losses from vomiting",
      "Magnesium increases surfactant production"
    ],
    correctIndex: 0,
    rationale: "IV magnesium sulfate (2 g IV over 20 minutes in adults) acts as a smooth muscle relaxant by blocking calcium influx into smooth muscle cells and inhibiting acetylcholine release. It provides additional bronchodilation in severe refractory asthma.",
    distractorExplanations: [
      "Magnesium's benefit in asthma is bronchodilation, not anti-inflammatory action. Corticosteroids provide the anti-inflammatory effect.",
      "While magnesium is an electrolyte, its use in status asthmaticus is specifically for bronchodilation, not simple replacement.",
      "Magnesium does not affect surfactant production."
    ],
    clinicalConcept: "IV magnesium sulfate is recommended by NAEPP guidelines for severe acute asthma unresponsive to initial therapy. It works within 20 minutes. Monitor for hypotension, flushing, and respiratory depression.",
    examTip: "Severe asthma not responding to standard therapy → add IV magnesium sulfate. This is a common TMC 'escalation of therapy' question.",
    safetyPearl: "Monitor deep tendon reflexes during magnesium infusion. Loss of DTRs indicates hypermagnesemia. Have calcium gluconate available as an antidote for magnesium toxicity.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "refractory asthma treatment",
    pharmacologyCategory: "Emergency Medication Recognition"
  },
  {
    id: "rrt-pharm-033",
    stem: "A physician orders methylprednisolone (Solu-Medrol) 125 mg IV for a patient with acute asthma exacerbation. When should the RT expect the onset of anti-inflammatory action?",
    options: [
      "4–6 hours after administration",
      "Immediately (within 5 minutes)",
      "24–48 hours after administration",
      "7–10 days after administration"
    ],
    correctIndex: 0,
    rationale: "Systemic corticosteroids take 4–6 hours for onset of anti-inflammatory action because they work through genomic mechanisms — binding intracellular receptors, translocating to the nucleus, and altering gene transcription to reduce inflammatory mediator production.",
    distractorExplanations: [
      "Corticosteroids do not provide immediate bronchodilation — they are NOT rescue medications.",
      "While full anti-inflammatory effects continue to build over 24–48 hours, onset begins at 4–6 hours.",
      "7–10 days is too long for onset. Chronic corticosteroid side effects develop over weeks to months."
    ],
    clinicalConcept: "Corticosteroids reduce airway inflammation by: suppressing cytokine production, reducing eosinophil migration, decreasing vascular permeability, and restoring beta-receptor responsiveness.",
    examTip: "Steroids take 4–6 hours to work. This is why they are given EARLY in acute asthma — to allow time for anti-inflammatory effects. Bronchodilators bridge the gap for immediate relief.",
    safetyPearl: "Short bursts of systemic steroids (3–10 days) have minimal side effects. Long-term use causes: osteoporosis, adrenal suppression, hyperglycemia, immunosuppression, and Cushing syndrome.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "corticosteroid onset",
    pharmacologyCategory: "Route of Administration"
  },
  {
    id: "rrt-pharm-034",
    stem: "A RT is asked to administer pentamidine isethionate via Respirgard II nebulizer for a patient with HIV. What is the primary indication?",
    options: [
      "Prophylaxis or treatment of Pneumocystis jirovecii pneumonia (PJP)",
      "Treatment of active tuberculosis",
      "Bronchodilation for COPD exacerbation",
      "Mucolytic therapy for cystic fibrosis"
    ],
    correctIndex: 0,
    rationale: "Aerosolized pentamidine is an antiprotozoal agent used for prophylaxis and treatment of Pneumocystis jirovecii pneumonia (PJP, formerly PCP) in immunocompromised patients, particularly those with HIV/AIDS and CD4 counts <200 cells/μL.",
    distractorExplanations: [
      "Tuberculosis is treated with rifampin, isoniazid, pyrazinamide, and ethambutol — not pentamidine.",
      "Pentamidine has no bronchodilator properties.",
      "Pentamidine is not a mucolytic and is not used for CF."
    ],
    clinicalConcept: "The Respirgard II is a specialized one-way valve nebulizer with expiratory filters to prevent environmental contamination. Pentamidine 300 mg is nebulized monthly for PJP prophylaxis.",
    examTip: "Pentamidine + Respirgard II + HIV/PJP = classic TMC association. Know that pentamidine can cause bronchospasm (pre-treat with bronchodilator) and hypoglycemia.",
    safetyPearl: "Administer in a negative-pressure room with exhaust filtration. Pre-treat with bronchodilator. Side effects include hypoglycemia, nephrotoxicity, and pancreatitis.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "antimicrobial aerosols",
    pharmacologyCategory: "Route of Administration"
  },
  {
    id: "rrt-pharm-035",
    stem: "A patient being treated with tobramycin inhalation solution (TOBI) for chronic Pseudomonas colonization in CF should have which lab value monitored?",
    options: [
      "Serum creatinine and BUN for nephrotoxicity",
      "Liver enzymes for hepatotoxicity",
      "Serum calcium for hypercalcemia",
      "Thyroid function tests"
    ],
    correctIndex: 0,
    rationale: "Tobramycin is an aminoglycoside antibiotic. Even when administered by inhalation, systemic absorption can occur, and aminoglycosides are known for nephrotoxicity and ototoxicity. Serum creatinine and BUN should be monitored to detect early kidney impairment.",
    distractorExplanations: [
      "Aminoglycosides are not significantly hepatotoxic. Nephro- and ototoxicity are the primary concerns.",
      "Tobramycin does not affect calcium metabolism.",
      "Thyroid function is not affected by aminoglycoside antibiotics."
    ],
    clinicalConcept: "TOBI is administered in alternating 28-day on/28-day off cycles via PARI LC Plus nebulizer. It reduces Pseudomonas aeruginosa colony counts and improves pulmonary function in CF patients.",
    examTip: "Aminoglycoside = nephrotoxicity + ototoxicity. This applies to all aminoglycosides: tobramycin, gentamicin, amikacin. Monitor creatinine and report hearing changes.",
    safetyPearl: "Patients should report tinnitus, hearing loss, or dizziness immediately — these may indicate ototoxicity which can be irreversible. Audiometric testing should be performed at baseline.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "inhaled antibiotics",
    pharmacologyCategory: "Side Effect Recognition"
  },
  {
    id: "rrt-pharm-036",
    stem: "During a pediatric asthma exacerbation, the physician increases the albuterol frequency to every 20 minutes × 3 doses. After 3 treatments the child shows minimal improvement. What is the MOST appropriate next step?",
    options: [
      "Transition to continuous albuterol nebulization and add systemic corticosteroids",
      "Discontinue all bronchodilator therapy",
      "Switch to a dry powder inhaler for better delivery",
      "Wait 4 hours and reassess without further intervention"
    ],
    correctIndex: 0,
    rationale: "In moderate-to-severe asthma exacerbation not responding to intermittent albuterol q20min, escalation to continuous albuterol nebulization (10-15 mg/hr for children) plus systemic corticosteroids (if not already started) is the standard next step per NAEPP guidelines.",
    distractorExplanations: [
      "Discontinuing bronchodilators in active bronchospasm would be dangerous.",
      "A DPI requires adequate inspiratory flow which a child in respiratory distress cannot generate.",
      "Waiting without intervention in a child not responding to treatment could lead to respiratory failure."
    ],
    clinicalConcept: "Continuous nebulization provides sustained bronchodilation without the peaks and troughs of intermittent dosing. It is delivered using a large-volume nebulizer setup with albuterol in a diluted solution.",
    examTip: "Escalation ladder for acute asthma: albuterol q20min × 3 → continuous albuterol → add ipratropium → IV magnesium → consider intubation. Know this progression.",
    safetyPearl: "During continuous albuterol, monitor heart rate continuously (target <180 in children), potassium q2-4h, and lactate. Tachycardia >200 or new arrhythmia = hold and notify physician.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "asthma escalation therapy",
    pharmacologyCategory: "Reassessment After Treatment"
  },
  {
    id: "rrt-pharm-037",
    stem: "A patient with suspected opioid overdose presents with respiratory rate of 4 breaths/min, pinpoint pupils, and unresponsiveness. Which medication should be administered immediately?",
    options: [
      "Naloxone (Narcan) 0.4–2 mg IV/IM/IN",
      "Flumazenil (Romazicon) 0.2 mg IV",
      "Epinephrine 1:1,000 IM",
      "Atropine 0.5 mg IV"
    ],
    correctIndex: 0,
    rationale: "Naloxone is a competitive opioid receptor antagonist that rapidly reverses opioid-induced respiratory depression. The classic triad of opioid overdose (respiratory depression, miosis/pinpoint pupils, decreased consciousness) responds to naloxone within 2–5 minutes.",
    distractorExplanations: [
      "Flumazenil reverses benzodiazepines (midazolam, diazepam), not opioids.",
      "Epinephrine is for anaphylaxis and cardiac arrest, not opioid reversal.",
      "Atropine treats bradycardia and organophosphate poisoning, not opioid overdose."
    ],
    clinicalConcept: "Naloxone can be given IV, IM, subcutaneous, intranasal (Narcan nasal spray), or via ETT. Onset: IV 2 min, IM 5 min, IN 5 min. Duration: 30–90 minutes (shorter than most opioids).",
    examTip: "Opioid overdose triad: respiratory depression + miosis + decreased LOC = naloxone. Remember naloxone duration is shorter than most opioids — repeat doses or continuous infusion may be needed.",
    safetyPearl: "Titrate naloxone to adequate ventilation, not full consciousness. Rapid complete reversal in opioid-dependent patients can trigger acute withdrawal, pulmonary edema, and cardiac arrhythmias.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "opioid reversal",
    pharmacologyCategory: "Emergency Medication Recognition"
  },
  {
    id: "rrt-pharm-038",
    stem: "A patient with myasthenia gravis develops respiratory failure. Which category of neuromuscular blocking agents should be AVOIDED during intubation if possible?",
    options: [
      "Depolarizing agents (succinylcholine) due to unpredictable response",
      "Non-depolarizing agents because they have no effect in myasthenia gravis",
      "All neuromuscular blockers are equally safe",
      "Local anesthetics because they worsen muscle weakness"
    ],
    correctIndex: 0,
    rationale: "In myasthenia gravis (autoimmune destruction of acetylcholine receptors), patients have unpredictable responses to succinylcholine — they may be resistant (requiring higher doses) or develop Phase II block. Non-depolarizing agents should be used at REDUCED doses (patients are very sensitive).",
    distractorExplanations: [
      "Non-depolarizing agents DO have an effect — in fact, MG patients are extremely sensitive to them and require reduced doses.",
      "Neuromuscular blockers have very different pharmacology in MG patients. They are NOT equally safe.",
      "Local anesthetics are not the concern in MG intubation."
    ],
    clinicalConcept: "Myasthenia gravis = fewer functional ACh receptors at the neuromuscular junction. This means: resistance to depolarizing agents (fewer receptors to stimulate) and hypersensitivity to non-depolarizing agents (fewer receptors to block).",
    examTip: "MG + intubation = avoid succinylcholine, use non-depolarizing at 1/3 to 1/2 normal dose. MG + respiratory failure is called myasthenic crisis.",
    safetyPearl: "Myasthenic crisis can be triggered by infection, surgery, medication changes, or stress. Assess negative inspiratory force (NIF) and vital capacity — NIF <-20 cmH2O or VC <1L suggests need for intubation.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "neuromuscular blocking agents",
    pharmacologyCategory: "Contraindications"
  },
  {
    id: "rrt-pharm-039",
    stem: "A patient receiving inhaled nitric oxide (iNO) at 20 ppm for pulmonary hypertension suddenly has the iNO discontinued. What is the primary risk?",
    options: [
      "Rebound pulmonary hypertension with acute hemodynamic deterioration",
      "Systemic hypotension from vasodilation",
      "Methemoglobinemia from drug accumulation",
      "Bronchospasm from airway irritation"
    ],
    correctIndex: 0,
    rationale: "Abrupt discontinuation of inhaled nitric oxide can cause severe rebound pulmonary hypertension because the pulmonary vasculature has downregulated endogenous NO production. This can lead to rapid hemodynamic deterioration, severe hypoxemia, and right heart failure.",
    distractorExplanations: [
      "iNO causes selective PULMONARY vasodilation, not systemic hypotension. Its effect is local to ventilated lung units.",
      "Methemoglobinemia is a side effect during iNO therapy, not from discontinuation. It is monitored during treatment.",
      "iNO does not cause bronchospasm. It is a smooth muscle relaxant."
    ],
    clinicalConcept: "iNO works by activating guanylate cyclase → increasing cGMP → smooth muscle relaxation in pulmonary vasculature. It is rapidly inactivated by hemoglobin, limiting systemic effects.",
    examTip: "iNO must be weaned gradually, never stopped abruptly. Typical weaning: reduce by 5 ppm q4h down to 1 ppm, then 0.5 ppm before discontinuation.",
    safetyPearl: "Monitor methemoglobin levels (keep <5%), nitrogen dioxide levels (<2 ppm), and have backup iNO delivery system available. Sudden delivery system failure = emergency.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "inhaled nitric oxide",
    pharmacologyCategory: "Side Effect Recognition"
  },
  {
    id: "rrt-pharm-040",
    stem: "Which inhaled medication requires monitoring of methemoglobin levels during administration?",
    options: [
      "Inhaled nitric oxide (iNO)",
      "Albuterol",
      "Ipratropium bromide",
      "Budesonide"
    ],
    correctIndex: 0,
    rationale: "Inhaled nitric oxide oxidizes hemoglobin to methemoglobin, which cannot carry oxygen. Methemoglobin levels must be monitored and kept below 5%. Levels >5% require dose reduction; >10% requires discontinuation.",
    distractorExplanations: [
      "Albuterol does not affect methemoglobin levels.",
      "Ipratropium does not interact with hemoglobin.",
      "Budesonide has no effect on methemoglobin."
    ],
    clinicalConcept: "Methemoglobin contains iron in the ferric (Fe3+) state instead of the normal ferrous (Fe2+) state. This shifts the oxyhemoglobin dissociation curve to the left, impairing oxygen unloading to tissues.",
    examTip: "iNO → methemoglobin monitoring is a guaranteed TMC topic. Also know: NO2 (nitrogen dioxide) is a toxic byproduct of iNO that must be monitored (<2 ppm).",
    safetyPearl: "Co-oximetry is required to measure methemoglobin — standard pulse oximetry cannot differentiate methemoglobin from oxyhemoglobin and will give falsely normal SpO2 readings.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "nitric oxide monitoring",
    pharmacologyCategory: "Side Effect Recognition"
  },
  {
    id: "rrt-pharm-041",
    stem: "A RT receives an order for albuterol 2.5 mg + ipratropium 0.5 mg (DuoNeb) for a patient with acute COPD exacerbation. What is the advantage of this combination?",
    options: [
      "Additive bronchodilation through two different mechanisms with fewer side effects than increasing either drug alone",
      "The drugs cancel out each other's side effects",
      "Ipratropium enhances albuterol absorption in the lungs",
      "The combination has anti-inflammatory properties"
    ],
    correctIndex: 0,
    rationale: "Combining a beta-2 agonist (albuterol) with an anticholinergic (ipratropium) provides additive bronchodilation through two distinct pathways: beta-2 receptor stimulation (relaxing smooth muscle) and muscarinic receptor blockade (preventing parasympathetic bronchoconstriction). This achieves greater bronchodilation than increasing the dose of either agent alone.",
    distractorExplanations: [
      "The drugs do not cancel side effects. Each has its own side effect profile (tachycardia for albuterol, dry mouth for ipratropium).",
      "Ipratropium does not affect albuterol's pharmacokinetics or absorption.",
      "Neither drug has significant anti-inflammatory properties — corticosteroids provide anti-inflammatory action."
    ],
    clinicalConcept: "In COPD, both sympathetic (beta-2) and parasympathetic (muscarinic) pathways control airway tone. Targeting both pathways simultaneously provides superior bronchodilation than either pathway alone.",
    examTip: "DuoNeb (albuterol + ipratropium) is the go-to combination for acute COPD exacerbations. For maintenance COPD: LABA + LAMA combinations (e.g., Stiolto, Anoro Ellipta).",
    safetyPearl: "DuoNeb comes premixed — do not add additional albuterol or ipratropium to the vial. Monitor for both tachycardia (albuterol) and urinary retention (ipratropium, especially in elderly males).",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "combination bronchodilators",
    pharmacologyCategory: "Route of Administration"
  },
  {
    id: "rrt-pharm-042",
    stem: "An order is received for heliox (80/20) therapy for a patient with severe upper airway obstruction from post-extubation stridor. What is the therapeutic principle?",
    options: [
      "Helium's low density reduces turbulent airflow resistance, decreasing work of breathing",
      "Helium provides additional oxygen to the obstructed airway",
      "Heliox directly reduces airway inflammation",
      "Helium acts as a bronchodilator at high concentrations"
    ],
    correctIndex: 0,
    rationale: "Heliox (helium-oxygen mixture) works because helium is less dense than nitrogen. In areas of turbulent flow (upper airway obstruction, post-extubation stridor), the low-density gas reduces airway resistance and decreases the pressure gradient needed to move air, thereby reducing work of breathing.",
    distractorExplanations: [
      "An 80/20 heliox mixture actually provides LESS oxygen (20%) than room air (21%). The benefit is reduced gas density, not increased oxygenation.",
      "Heliox has no anti-inflammatory properties. Corticosteroids and racemic epinephrine address inflammation.",
      "Helium does not interact with smooth muscle receptors and has no bronchodilator properties."
    ],
    clinicalConcept: "Heliox is most effective when the helium concentration is ≥60% (80/20 is ideal). As the FiO2 requirement increases, the helium percentage decreases and the benefit diminishes. It is a temporizing measure while definitive treatment takes effect.",
    examTip: "Heliox = low density → reduced turbulent flow → decreased WOB. Best for UPPER airway obstruction. Less effective for lower airway disease. 80/20 is most effective mixture.",
    safetyPearl: "Heliox alters flow meter readings — use a heliox-specific flow meter or apply a correction factor (multiply displayed flow by 1.8 for 80/20 mixture). Standard oxygen equipment readings will be inaccurate.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "medical gases",
    pharmacologyCategory: "Route of Administration"
  },
  {
    id: "rrt-pharm-043",
    stem: "A NICU nurse reports that a neonate's O2 saturation has not improved after surfactant administration. The RT notes the surfactant was stored at room temperature for 3 days. What is the most likely issue?",
    options: [
      "Improper storage may have degraded the surfactant, reducing its effectiveness",
      "The neonate is too premature for surfactant to work",
      "Surfactant only works when given in the delivery room",
      "The O2 saturation probe is malfunctioning"
    ],
    correctIndex: 0,
    rationale: "Surfactant preparations have specific storage requirements (most require refrigeration at 2-8°C). Extended room temperature storage can degrade the phospholipid and protein components, reducing surface-tension-lowering ability and clinical effectiveness.",
    distractorExplanations: [
      "Surfactant is effective in extremely premature neonates — age is not the issue if the drug is properly stored and administered.",
      "While early administration is preferred, surfactant can be given at any time during the NICU stay when indicated.",
      "While probe malfunction is possible, the storage issue is the most likely explanation given the scenario."
    ],
    clinicalConcept: "Proper medication storage is critical for biological products like surfactant. Beractant (Survanta) should be stored refrigerated and warmed to room temperature before use. Poractant (Curosurf) should be refrigerated and protected from light.",
    examTip: "Questions about medication storage and handling are common. Surfactant = refrigerate. Dornase alfa = refrigerate. Albuterol = room temperature. Always check storage requirements.",
    safetyPearl: "Before administering surfactant, verify: correct storage conditions, expiration date, correct dose for weight, and that the preparation has been properly warmed (if applicable).",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "medication storage",
    pharmacologyCategory: "Neonatal Concepts"
  },
  {
    id: "rrt-pharm-044",
    stem: "A patient with an acute asthma exacerbation receives IV aminophylline. Which lab value must be monitored to prevent toxicity?",
    options: [
      "Serum theophylline level (therapeutic range 5–15 mcg/mL)",
      "Serum creatinine",
      "Prothrombin time (PT/INR)",
      "Serum albumin"
    ],
    correctIndex: 0,
    rationale: "Aminophylline is converted to theophylline in the body. Theophylline has a narrow therapeutic index (5–15 mcg/mL). Levels >20 mcg/mL cause nausea, vomiting, and tachycardia; levels >40 mcg/mL can cause seizures and fatal arrhythmias. Serum theophylline levels must be monitored.",
    distractorExplanations: [
      "While renal function can affect drug clearance, creatinine is not the primary monitoring parameter for theophylline.",
      "PT/INR monitors coagulation for warfarin therapy, not theophylline.",
      "Albumin is relevant for drugs with high protein binding but is not the primary theophylline monitoring parameter."
    ],
    clinicalConcept: "Theophylline is metabolized by CYP1A2 in the liver. Drug interactions that increase theophylline levels include: cimetidine, erythromycin, ciprofloxacin, and zileuton. Smoking decreases theophylline levels.",
    examTip: "Theophylline therapeutic range: 5–15 mcg/mL. Signs of toxicity: nausea → vomiting → tachycardia → seizures → arrhythmias. Classic narrow therapeutic index drug.",
    safetyPearl: "CHF, liver disease, and fever decrease theophylline clearance (risk of toxicity). Smoking increases clearance (may need higher doses). Adjust dose when smoking status changes.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "methylxanthine monitoring",
    pharmacologyCategory: "Side Effect Recognition"
  },
  {
    id: "rrt-pharm-045",
    stem: "A physician orders montelukast (Singulair) 10 mg PO daily for a patient with exercise-induced asthma. What class of medication is this?",
    options: [
      "Leukotriene receptor antagonist (LTRA)",
      "Short-acting beta-2 agonist",
      "Inhaled corticosteroid",
      "Mast cell stabilizer"
    ],
    correctIndex: 0,
    rationale: "Montelukast (Singulair) is a leukotriene receptor antagonist (LTRA) that blocks the CysLT1 receptor, preventing the bronchoconstriction, mucus secretion, and inflammatory cell recruitment caused by leukotrienes C4, D4, and E4.",
    distractorExplanations: [
      "Montelukast is oral and has slow onset — it is not a SABA (which provides rapid rescue bronchodilation).",
      "ICS are inhaled steroids (fluticasone, budesonide). Montelukast is oral and has a different mechanism.",
      "Mast cell stabilizers (cromolyn) prevent mast cell degranulation. Montelukast blocks leukotriene receptors."
    ],
    clinicalConcept: "Leukotrienes are inflammatory mediators produced from arachidonic acid by the 5-lipoxygenase pathway. They cause bronchoconstriction (100–1000× more potent than histamine), mucus hypersecretion, and eosinophil recruitment.",
    examTip: "Montelukast = oral, once daily, prophylactic only. NOT for acute attacks. Good for exercise-induced asthma and aspirin-sensitive asthma. Safe in children ≥1 year.",
    safetyPearl: "The FDA issued a Black Box Warning for montelukast regarding neuropsychiatric events including agitation, depression, suicidal thinking, and hallucinations. Monitor and report behavioral changes.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "leukotriene modifiers",
    pharmacologyCategory: "Route of Administration"
  },
  {
    id: "rrt-pharm-046",
    stem: "An intubated patient on the ventilator needs bronchodilator therapy. The RT notes a heat-moisture exchanger (HME) is in the circuit. What adjustment should be made?",
    options: [
      "Remove the HME during aerosol treatment to prevent drug trapping",
      "Keep the HME in place as it has no effect on aerosol delivery",
      "Double the medication dose to compensate for HME filtration",
      "Switch to oral bronchodilator administration"
    ],
    correctIndex: 0,
    rationale: "HMEs contain hygroscopic or hydrophobic filters that trap aerosol particles, drastically reducing drug delivery to the patient (up to 60-80% drug loss). The HME must be removed or bypassed during aerosol treatments and replaced afterward.",
    distractorExplanations: [
      "HMEs significantly reduce aerosol drug delivery. Ignoring this leads to therapeutic failure.",
      "Doubling the dose is not an evidence-based solution and does not adequately compensate for the filtering effect.",
      "Oral bronchodilators have slower onset and are not preferred for acute treatment in ventilated patients."
    ],
    clinicalConcept: "HMEs work by capturing heat and moisture during exhalation and returning it during inhalation. The same mechanism that traps water vapor also traps aerosolized medication particles.",
    examTip: "Ventilator aerosol delivery checklist: (1) Remove HME, (2) Place adapter 15-30 cm from wye, (3) Coordinate with inspiration, (4) Use spacer for MDI, (5) Replace HME after treatment.",
    safetyPearl: "Set a reminder to replace the HME after aerosol treatment is complete. Forgetting to replace it leaves the patient without humidification, risking secretion drying and mucus plugging.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "ventilator aerosol optimization",
    pharmacologyCategory: "Ventilated Patient Medication Delivery"
  },
  {
    id: "rrt-pharm-047",
    stem: "A child with asthma uses an MDI with spacer and mask. The parent reports the child is crying during treatments. How does crying affect aerosol delivery?",
    options: [
      "Crying reduces drug delivery because the child inhales through the mouth in short gasps and exhales forcefully",
      "Crying improves delivery by increasing tidal volume",
      "Crying has no effect on aerosol deposition",
      "Crying is beneficial because it opens the vocal cords wider"
    ],
    correctIndex: 0,
    rationale: "Crying dramatically reduces aerosol delivery (by up to 80%) because the child's breathing pattern changes to short inspiratory gasps followed by prolonged forceful exhalation. Most of the aerosol is exhaled before reaching the lower airways. Additionally, crying increases upper airway turbulence.",
    distractorExplanations: [
      "While crying increases minute ventilation, the breathing pattern (short gasps) reduces lung deposition, not improves it.",
      "Crying significantly reduces both total lung dose and peripheral deposition of aerosolized medication.",
      "The vocal cord position during crying is irrelevant compared to the detrimental effect on breathing pattern."
    ],
    clinicalConcept: "Optimal aerosol delivery requires slow, deep breaths with breath-holding. Crying creates the opposite pattern. Calm the child before treatment or wait for sleep (tidal breathing during sleep provides reasonable deposition).",
    examTip: "Crying child + aerosol = reduced drug delivery. Calm the child first, or consider treating during sleep. This is a commonly tested pediatric concept.",
    safetyPearl: "Have the parent hold the child comfortably and apply the mask gently. Distraction techniques (tablet, singing, stories) can help calm the child. Blowing the aerosol at the face ('blow-by') is NOT an effective alternative.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "pediatric aerosol factors",
    pharmacologyCategory: "Pediatric Respiratory Pharmacology"
  },
  {
    id: "rrt-pharm-048",
    stem: "Which of the following medications is specifically indicated for the treatment of respiratory syncytial virus (RSV) in high-risk infants?",
    options: [
      "Ribavirin (Virazole)",
      "Oseltamivir (Tamiflu)",
      "Acyclovir (Zovirax)",
      "Zanamivir (Relenza)"
    ],
    correctIndex: 0,
    rationale: "Ribavirin (Virazole) is a synthetic nucleoside analogue with activity against RSV. It is administered via SPAG-2 generator to high-risk infants (immunocompromised, congenital heart disease, premature infants) with severe RSV bronchiolitis.",
    distractorExplanations: [
      "Oseltamivir is a neuraminidase inhibitor for influenza A and B, not RSV.",
      "Acyclovir targets herpes simplex and varicella-zoster viruses, not RSV.",
      "Zanamivir is an inhaled neuraminidase inhibitor for influenza, not RSV."
    ],
    clinicalConcept: "Palivizumab (Synagis) is a monoclonal antibody for RSV PROPHYLAXIS in high-risk infants, given IM monthly during RSV season. Ribavirin is for TREATMENT of established RSV infection.",
    examTip: "RSV treatment = ribavirin (SPAG-2). RSV prevention = palivizumab (Synagis). Both are HIGH-YIELD neonatal/pediatric pharmacology topics.",
    safetyPearl: "Ribavirin can precipitate and clog ventilator circuits in mechanically ventilated infants. Use in-line filters, change circuits frequently, and monitor for obstruction.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "antiviral medications",
    pharmacologyCategory: "Pediatric Respiratory Pharmacology"
  },
  {
    id: "rrt-pharm-049",
    stem: "A mechanically ventilated patient with ARDS receives a neuromuscular blocking agent (cisatracurium) for ventilator dyssynchrony. What must be co-administered?",
    options: [
      "Sedation and analgesia — the patient is paralyzed but fully conscious without them",
      "A bronchodilator to prevent bronchospasm",
      "An anticholinergic to prevent bradycardia",
      "An antibiotic for infection prophylaxis"
    ],
    correctIndex: 0,
    rationale: "Neuromuscular blocking agents (NMBAs) paralyze skeletal muscles but have NO sedative, anxiolytic, or analgesic properties. The patient is essentially 'locked in' — awake and aware but unable to move, communicate, or breathe independently. Adequate sedation (propofol/midazolam) and analgesia (fentanyl/morphine) are mandatory.",
    distractorExplanations: [
      "Bronchospasm is not a typical concern with cisatracurium. Histamine-releasing NMBAs (atracurium) may cause bronchospasm, but cisatracurium does not.",
      "Cisatracurium does not cause clinically significant bradycardia. Anticholinergics are not routinely needed.",
      "Antibiotics are not indicated solely due to NMBA use."
    ],
    clinicalConcept: "Cisatracurium is preferred in ICU paralysis due to Hofmann elimination (organ-independent breakdown) — safe in hepatic and renal failure. Train-of-four monitoring guides dosing.",
    examTip: "NMBA = paralysis WITHOUT sedation. ALWAYS sedate first. Train-of-four (TOF) target: 1-2 twitches out of 4. This is a patient safety priority question.",
    safetyPearl: "Document sedation assessment (RASS or SAS score) before and during NMBA infusion. Place 'patient is chemically paralyzed — ensure sedation' signage at bedside. Eye care is essential to prevent corneal drying.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "neuromuscular blockers in ICU",
    pharmacologyCategory: "Ventilated Patient Medication Delivery"
  },
  {
    id: "rrt-pharm-050",
    stem: "A patient on warfarin therapy is prescribed a macrolide antibiotic for pneumonia. What drug interaction should the RT be aware of?",
    options: [
      "Macrolides inhibit cytochrome P450, increasing warfarin levels and bleeding risk",
      "Macrolides inactivate warfarin, requiring higher anticoagulant doses",
      "There is no interaction between macrolides and warfarin",
      "Macrolides increase warfarin metabolism, reducing its effectiveness"
    ],
    correctIndex: 0,
    rationale: "Macrolide antibiotics (erythromycin, clarithromycin, azithromycin) inhibit cytochrome P450 enzymes (CYP3A4) that metabolize warfarin. This decreases warfarin clearance, raising serum levels and increasing the risk of bleeding. INR must be monitored closely.",
    distractorExplanations: [
      "Macrolides increase warfarin levels — they do not inactivate or reduce warfarin effectiveness.",
      "This is a well-documented and clinically significant drug interaction.",
      "Macrolides decrease (not increase) warfarin metabolism."
    ],
    clinicalConcept: "The cytochrome P450 system is responsible for metabolizing many drugs. Enzyme inhibitors (macrolides, cimetidine, grapefruit) increase drug levels. Enzyme inducers (rifampin, phenytoin, smoking) decrease drug levels.",
    examTip: "Warfarin + macrolide/fluoroquinolone = increased INR and bleeding risk. This is a common drug interaction question across all healthcare certification exams.",
    safetyPearl: "Monitor INR within 3–5 days of starting the antibiotic. Report signs of bleeding (hematuria, melena, excessive bruising) immediately.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "drug interactions",
    pharmacologyCategory: "Side Effect Recognition"
  },
  {
    id: "rrt-pharm-051",
    stem: "Which medication is the FIRST-LINE treatment for anaphylaxis-related bronchospasm and hypotension?",
    options: [
      "Epinephrine 0.3–0.5 mg IM (1:1,000 concentration)",
      "Albuterol via nebulizer",
      "Diphenhydramine 50 mg IV",
      "Methylprednisolone 125 mg IV"
    ],
    correctIndex: 0,
    rationale: "Epinephrine is the FIRST-LINE treatment for anaphylaxis because it addresses all pathophysiologic mechanisms simultaneously: alpha-1 vasoconstriction (reverses hypotension), beta-1 cardiac stimulation (improves cardiac output), beta-2 bronchodilation (reverses bronchospasm), and mast cell stabilization (reduces further mediator release).",
    distractorExplanations: [
      "Albuterol addresses bronchospasm only. It does not treat hypotension, angioedema, or urticaria — it is adjunctive, not first-line.",
      "Diphenhydramine is a histamine H1 blocker — it treats urticaria/itching but does not reverse hypotension or bronchospasm acutely.",
      "Corticosteroids take 4–6 hours for onset and are used to prevent biphasic reaction — they are NOT first-line for acute anaphylaxis."
    ],
    clinicalConcept: "The IM route (anterolateral thigh) provides faster absorption than subcutaneous. EpiPen auto-injectors deliver 0.3 mg (adult) or 0.15 mg (pediatric) IM.",
    examTip: "Anaphylaxis = epinephrine FIRST, always. Then add: albuterol for persistent bronchospasm, antihistamines, and steroids. This is a patient safety question.",
    safetyPearl: "Do not substitute IV epinephrine for IM in non-arrest anaphylaxis without careful monitoring — IV bolus can cause fatal arrhythmias. IM in the lateral thigh is the standard of care.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "anaphylaxis management",
    pharmacologyCategory: "Emergency Medication Recognition"
  },
  {
    id: "rrt-pharm-052",
    stem: "A patient with COPD is started on roflumilast (Daliresp) 500 mcg PO daily. What class of medication is this?",
    options: [
      "Phosphodiesterase-4 (PDE4) inhibitor",
      "Long-acting beta-2 agonist",
      "Inhaled corticosteroid",
      "Leukotriene receptor antagonist"
    ],
    correctIndex: 0,
    rationale: "Roflumilast (Daliresp) is an oral phosphodiesterase-4 (PDE4) inhibitor that reduces inflammation in COPD by preventing the breakdown of intracellular cAMP in inflammatory cells (neutrophils, eosinophils). It is indicated for severe COPD with frequent exacerbations and chronic bronchitis phenotype.",
    distractorExplanations: [
      "LABAs are inhaled medications (salmeterol, formoterol). Roflumilast is oral.",
      "ICS are inhaled (fluticasone, budesonide). Roflumilast works by a different mechanism.",
      "LTRAs (montelukast) block leukotriene receptors. PDE4 inhibitors prevent cAMP breakdown."
    ],
    clinicalConcept: "PDE4 is the predominant phosphodiesterase in inflammatory cells. Inhibiting PDE4 increases cAMP, which suppresses the release of inflammatory mediators including TNF-alpha and interleukins.",
    examTip: "Roflumilast = oral PDE4 inhibitor for severe COPD (chronic bronchitis phenotype + frequent exacerbations). It is NOT a bronchodilator — it reduces exacerbation frequency.",
    safetyPearl: "Common side effects: nausea, diarrhea, weight loss, and psychiatric symptoms (depression, suicidal ideation). Contraindicated in moderate-severe liver disease.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "COPD anti-inflammatory agents",
    pharmacologyCategory: "Route of Administration"
  },
  {
    id: "rrt-pharm-053",
    stem: "An order reads: 'Albuterol 2.5 mg + budesonide 0.5 mg via SVN q4h.' Can these medications be mixed in the same nebulizer?",
    options: [
      "Yes — albuterol and budesonide (Pulmicort Respules) are compatible for co-nebulization",
      "No — they must always be given in separate nebulizations",
      "Only if diluted with 10 mL of normal saline",
      "They can be mixed but the budesonide must be added first"
    ],
    correctIndex: 0,
    rationale: "Budesonide (Pulmicort Respules) has been shown to be physically and chemically compatible with albuterol and ipratropium for co-nebulization. Mixing them in the same nebulizer reduces treatment time and improves patient compliance.",
    distractorExplanations: [
      "Studies confirm compatibility. Separating treatments unnecessarily increases total therapy time.",
      "Standard 3 mL total volume is adequate. 10 mL dilution is excessive and would prolong treatment time.",
      "Order of addition does not affect drug compatibility or efficacy."
    ],
    clinicalConcept: "Drug compatibility in nebulizers is important because some medications can degrade, precipitate, or interact when mixed. Always verify compatibility before combining medications.",
    examTip: "Compatible combos: albuterol + ipratropium, albuterol + budesonide, all three together. NOT compatible: cromolyn + other drugs (unless specifically approved). Dornase alfa = ALWAYS alone.",
    safetyPearl: "Dornase alfa (Pulmozyme) should NEVER be mixed with other medications. Acetylcysteine should not be mixed with most antibiotics due to incompatibility.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "nebulizer drug compatibility",
    pharmacologyCategory: "Device Selection"
  },
  {
    id: "rrt-pharm-054",
    stem: "A premature neonate at 25 weeks GA is receiving indomethacin. What is the primary respiratory indication?",
    options: [
      "Closure of a hemodynamically significant patent ductus arteriosus (PDA)",
      "Bronchodilation for neonatal wheezing",
      "Prevention of bronchopulmonary dysplasia",
      "Treatment of neonatal pneumonia"
    ],
    correctIndex: 0,
    rationale: "Indomethacin (and ibuprofen lysine) is a prostaglandin synthesis inhibitor used to promote closure of a patent ductus arteriosus (PDA) in premature neonates. The ductus arteriosus normally closes within 24–72 hours of birth, but may remain patent in preterm infants.",
    distractorExplanations: [
      "Indomethacin is not a bronchodilator and does not treat neonatal wheezing.",
      "Indomethacin does not prevent BPD. Caffeine and vitamin A have been studied for BPD prevention.",
      "Indomethacin has no antimicrobial properties for treating pneumonia."
    ],
    clinicalConcept: "A hemodynamically significant PDA causes left-to-right shunting, increasing pulmonary blood flow and leading to pulmonary edema, increasing ventilatory requirements and oxygen dependency.",
    examTip: "PDA closure in neonates: indomethacin or ibuprofen lysine (inhibit prostaglandin synthesis). Conversely, prostaglandin E1 (alprostadil) KEEPS the PDA OPEN in duct-dependent cardiac lesions.",
    safetyPearl: "Monitor urine output, serum creatinine, and platelet count during indomethacin therapy. Side effects include oliguria, renal impairment, necrotizing enterocolitis risk, and decreased platelet aggregation.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "neonatal cardiovascular pharmacology",
    pharmacologyCategory: "Neonatal Concepts"
  },
  {
    id: "rrt-pharm-055",
    stem: "A patient with severe community-acquired pneumonia is ordered aerosolized tobramycin. The RT notes the patient has been receiving IV furosemide. What drug interaction concern exists?",
    options: [
      "Both tobramycin and furosemide are ototoxic and nephrotoxic — concurrent use increases toxicity risk",
      "Furosemide inactivates tobramycin in the nebulizer",
      "Tobramycin reverses the diuretic effect of furosemide",
      "There is no significant interaction between these drugs"
    ],
    correctIndex: 0,
    rationale: "Both aminoglycosides (tobramycin) and loop diuretics (furosemide) independently carry risks of ototoxicity and nephrotoxicity. When used concurrently, these risks are additive or synergistic, requiring close monitoring of auditory function and renal parameters.",
    distractorExplanations: [
      "Drug inactivation does not occur between furosemide and tobramycin.",
      "Tobramycin does not interfere with furosemide's diuretic mechanism.",
      "This is a well-documented and clinically significant drug interaction."
    ],
    clinicalConcept: "Aminoglycoside nephrotoxicity involves proximal tubular damage. Loop diuretic ototoxicity involves damage to the stria vascularis of the cochlea. Together, both organ systems face compounded risk.",
    examTip: "Aminoglycoside + loop diuretic = additive ototoxicity and nephrotoxicity. This is a high-yield drug interaction for all healthcare certification exams.",
    safetyPearl: "Monitor BUN, creatinine, and drug levels. Perform baseline and serial audiometry. Report tinnitus, vertigo, or hearing changes immediately.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "drug interactions nephrotoxicity",
    pharmacologyCategory: "Fluid Overload/Diuretic Monitoring"
  },
  {
    id: "rrt-pharm-056",
    stem: "A patient with pulmonary arterial hypertension (PAH) is started on inhaled iloprost (Ventavis). What is the mechanism of action?",
    options: [
      "Prostacyclin analogue causing pulmonary vasodilation and platelet inhibition",
      "Phosphodiesterase-5 inhibitor relaxing pulmonary smooth muscle",
      "Endothelin receptor antagonist reducing vasoconstriction",
      "Calcium channel blocker reducing pulmonary vascular resistance"
    ],
    correctIndex: 0,
    rationale: "Iloprost (Ventavis) is a synthetic prostacyclin (PGI2) analogue that causes direct pulmonary vasodilation and inhibits platelet aggregation. It is inhaled via the I-neb or Prodose AAD nebulizer systems, requiring 6–9 inhalations daily.",
    distractorExplanations: [
      "PDE5 inhibitors include sildenafil (Revatio) and tadalafil (Adcirca) — different drug class.",
      "Endothelin receptor antagonists include bosentan (Tracleer) and ambrisentan (Letairis).",
      "Calcium channel blockers (nifedipine, diltiazem) are only used in vasoreactive PAH patients."
    ],
    clinicalConcept: "PAH treatment targets three pathways: prostacyclin pathway (iloprost, epoprostenol, treprostinil), nitric oxide pathway (sildenafil, riociguat), and endothelin pathway (bosentan, ambrisentan).",
    examTip: "Know the three PAH drug classes and one example of each: prostacyclin (iloprost), PDE5i (sildenafil), ERA (bosentan). Inhaled prostacyclins are given 6-9 times daily.",
    safetyPearl: "Iloprost can cause syncope, hypotension, and bronchospasm. The patient should be seated during inhalation. Do not mix with other medications in the nebulizer.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "pulmonary hypertension drugs",
    pharmacologyCategory: "Route of Administration"
  },
  {
    id: "rrt-pharm-057",
    stem: "After giving albuterol to a patient with asthma, the RT reassesses and finds SpO2 has decreased from 94% to 91%. What is the most likely explanation?",
    options: [
      "Bronchodilator-induced V/Q mismatch from increased perfusion to poorly ventilated areas",
      "The albuterol was contaminated",
      "The pulse oximeter is broken",
      "Albuterol directly decreases oxygen saturation"
    ],
    correctIndex: 0,
    rationale: "Beta-2 agonists cause pulmonary vasodilation in addition to bronchodilation. This increased blood flow to poorly ventilated lung units can transiently worsen V/Q mismatch and decrease SpO2. This is a known phenomenon called 'paradoxical desaturation' and is usually transient.",
    distractorExplanations: [
      "Contamination would not explain a physiologic decrease in SpO2 that follows a known pharmacologic mechanism.",
      "Equipment malfunction is possible but unlikely to correlate with treatment timing. The V/Q mechanism is the most likely explanation.",
      "Albuterol does not directly decrease oxygen saturation — the effect is indirect through V/Q changes."
    ],
    clinicalConcept: "Hypoxic pulmonary vasoconstriction (HPV) diverts blood away from poorly ventilated alveoli. Beta-2 agonists partially inhibit HPV, allowing blood flow to areas with low V/Q ratios, temporarily worsening oxygenation.",
    examTip: "Post-bronchodilator SpO2 drop = V/Q mismatch from vasodilation. This is transient and resolves as bronchodilation improves ventilation. Supplemental O2 may be needed temporarily.",
    safetyPearl: "If SpO2 drops significantly post-bronchodilator, provide supplemental oxygen and continue to monitor. If SpO2 does not recover within 15–20 minutes, investigate other causes.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "paradoxical bronchodilator response",
    pharmacologyCategory: "Reassessment After Treatment"
  },
  {
    id: "rrt-pharm-058",
    stem: "A physician orders atropine 0.02 mg/kg IV for a pediatric patient with symptomatic bradycardia. What is the minimum dose?",
    options: [
      "0.1 mg (to prevent paradoxical bradycardia)",
      "0.5 mg (same as adult minimum dose)",
      "0.01 mg (weight-based only)",
      "There is no minimum dose for atropine"
    ],
    correctIndex: 0,
    rationale: "The minimum dose of atropine in pediatric patients is 0.1 mg. Doses below this threshold can cause paradoxical bradycardia by acting primarily on the presynaptic M1 receptors, which inhibit the negative feedback mechanism and paradoxically increase vagal tone.",
    distractorExplanations: [
      "0.5 mg is the minimum adult dose for bradycardia per ACLS guidelines, not the pediatric minimum.",
      "0.01 mg would be far below the minimum and could worsen bradycardia.",
      "There IS a minimum dose — below 0.1 mg, paradoxical effects can occur."
    ],
    clinicalConcept: "Atropine is a competitive muscarinic receptor antagonist that blocks vagal (parasympathetic) input to the heart, increasing heart rate. At very low doses, it can paradoxically slow the heart.",
    examTip: "Pediatric atropine: dose 0.02 mg/kg, minimum 0.1 mg, maximum single dose 0.5 mg (child) or 1 mg (adolescent). Adult bradycardia: 0.5-1 mg q3-5min, max 3 mg.",
    safetyPearl: "Maximum total dose of atropine for pediatric bradycardia is 1 mg (child) or 3 mg (adolescent/adult). Document dose precisely as pediatric dosing errors are common.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "pediatric emergency medications",
    pharmacologyCategory: "Emergency Medication Recognition"
  },
  {
    id: "rrt-pharm-059",
    stem: "A patient with severe COPD receives prednisone burst therapy (40 mg PO daily × 5 days). On day 3, blood glucose is 285 mg/dL (normal <180 mg/dL). What is the relationship?",
    options: [
      "Corticosteroids cause hyperglycemia by promoting gluconeogenesis and insulin resistance",
      "This is an allergic reaction to prednisone",
      "The elevated glucose is unrelated to the prednisone",
      "Prednisone causes hypoglycemia, so this must be a lab error"
    ],
    correctIndex: 0,
    rationale: "Systemic corticosteroids cause hyperglycemia through multiple mechanisms: increased hepatic gluconeogenesis, decreased glucose uptake by muscle and fat cells (insulin resistance), and increased glycogen breakdown. This is one of the most common side effects of steroid therapy.",
    distractorExplanations: [
      "Hyperglycemia is a pharmacologic side effect, not an allergic reaction.",
      "The temporal relationship between prednisone and hyperglycemia is well-established and causative.",
      "Corticosteroids cause hyperglycemia, not hypoglycemia. This is a reliable pharmacologic effect."
    ],
    clinicalConcept: "Steroid-induced hyperglycemia is most pronounced in diabetic patients but can occur in anyone. It typically resolves after steroid discontinuation. Insulin sliding scale may be needed during treatment.",
    examTip: "Corticosteroid side effects: hyperglycemia, immunosuppression, adrenal suppression, osteoporosis, fluid retention, mood changes, weight gain. Hyperglycemia appears earliest.",
    safetyPearl: "Monitor blood glucose in all patients receiving systemic steroids, especially diabetics. Adjust insulin or oral hypoglycemic agents as needed. Taper steroids gradually if used >7-10 days to prevent adrenal crisis.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "corticosteroid metabolic effects",
    pharmacologyCategory: "Side Effect Recognition"
  },
  {
    id: "rrt-pharm-060",
    stem: "An RT is preparing to administer aerosolized colistin (colistimethate) to a CF patient colonized with multidrug-resistant Pseudomonas. What special precaution applies?",
    options: [
      "Pre-treat with a bronchodilator because inhaled colistin can cause severe bronchospasm",
      "Mix with dornase alfa for enhanced mucolytic effect",
      "Administer only via ultrasonic nebulizer",
      "No special precautions are needed"
    ],
    correctIndex: 0,
    rationale: "Inhaled colistin (colistimethate sodium) is a polymyxin antibiotic used for MDR Pseudomonas in CF. It commonly causes bronchospasm (reported in up to 50% of patients), so a bronchodilator must be administered BEFORE the colistin treatment.",
    distractorExplanations: [
      "Colistin should not be mixed with dornase alfa. Each medication should be nebulized separately.",
      "Colistin can be administered via jet nebulizer. Ultrasonic nebulizers may degrade certain antibiotic formulations.",
      "Bronchospasm prevention is a critical precaution that cannot be omitted."
    ],
    clinicalConcept: "Colistin has re-emerged as a last-resort antibiotic against multidrug-resistant gram-negative bacteria. The inhaled route delivers high local concentrations while minimizing systemic nephrotoxicity.",
    examTip: "Inhaled antibiotics that cause bronchospasm: colistin, tobramycin, pentamidine. Pre-treat with bronchodilator = universal precaution for all inhaled antibiotics.",
    safetyPearl: "Reconstitute colistimethate immediately before use. Do not use if the solution is hazy or contains particles. Monitor for chest tightness, cough, and wheezing during administration.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "inhaled antibiotics precautions",
    pharmacologyCategory: "Contraindications"
  },
  {
    id: "rrt-pharm-061",
    stem: "A patient with idiopathic pulmonary fibrosis (IPF) is prescribed pirfenidone (Esbriet). What class of medication is this?",
    options: [
      "Antifibrotic agent that slows the decline in lung function",
      "Bronchodilator for symptom relief",
      "Inhaled corticosteroid to reduce inflammation",
      "Mucolytic agent to thin secretions"
    ],
    correctIndex: 0,
    rationale: "Pirfenidone (Esbriet) is an oral antifibrotic agent that reduces the production of growth factors and cytokines involved in fibrosis (TGF-beta, TNF-alpha). Along with nintedanib (Ofev), it is one of two FDA-approved antifibrotics for IPF that slow the rate of FVC decline.",
    distractorExplanations: [
      "Pirfenidone has no bronchodilator properties. IPF involves restrictive pathology, not obstructive.",
      "Pirfenidone is oral, not inhaled, and works through antifibrotic mechanisms, not anti-inflammatory corticosteroid pathways.",
      "Pirfenidone does not affect mucus viscosity."
    ],
    clinicalConcept: "IPF is characterized by progressive scarring of lung parenchyma leading to restrictive physiology. Antifibrotics slow progression but do not reverse existing fibrosis. Lung transplantation remains the only curative option.",
    examTip: "Two FDA-approved antifibrotics for IPF: pirfenidone (Esbriet) and nintedanib (Ofev). Both are oral. They slow FVC decline but do not cure IPF.",
    safetyPearl: "Common side effects of pirfenidone: photosensitivity (avoid sun exposure), GI upset, anorexia, and elevated liver enzymes. Monitor LFTs regularly.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "antifibrotic therapy",
    pharmacologyCategory: "Route of Administration"
  },
  {
    id: "rrt-pharm-062",
    stem: "A respiratory therapist notices a physician ordered formoterol (Perforomist) for acute bronchospasm in an asthmatic patient. What makes this order potentially appropriate despite formoterol being a LABA?",
    options: [
      "Formoterol has a rapid onset (3–5 minutes) unlike other LABAs, but should still be used with ICS",
      "All LABAs can be used for acute rescue",
      "Formoterol is actually a SABA",
      "The physician intended to order fluticasone"
    ],
    correctIndex: 0,
    rationale: "Formoterol is unique among LABAs because it has rapid onset (3–5 minutes), similar to albuterol, while maintaining long duration (12 hours). While it can provide acute relief, guidelines still recommend it be used with an ICS (never as monotherapy in asthma) due to the LABA safety concerns.",
    distractorExplanations: [
      "Not all LABAs have rapid onset. Salmeterol takes 15–30 minutes and is NOT suitable for acute use.",
      "Formoterol is classified as a LABA, not a SABA, despite its rapid onset.",
      "This is a legitimate pharmacologic distinction about formoterol, not a prescribing error."
    ],
    clinicalConcept: "Formoterol's rapid onset is due to its moderate lipophilicity — it can quickly interact with beta-2 receptors while also being retained in the lipid bilayer for sustained action.",
    examTip: "Formoterol = LABA with rapid onset (unique). Salmeterol = LABA with slow onset. Both = 12-hour duration. Both require ICS co-therapy in asthma.",
    safetyPearl: "Even though formoterol has rapid onset, it should be prescribed as ICS/LABA combination (budesonide/formoterol = Symbicort) rather than standalone, per FDA Black Box Warning on LABA monotherapy in asthma.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "LABA pharmacology",
    pharmacologyCategory: "Physician-Order Clarification"
  },
  {
    id: "rrt-pharm-063",
    stem: "A CHF patient on the ventilator has worsening bilateral crackles and pink frothy secretions despite furosemide 40 mg IV. The physician orders an additional 80 mg IV furosemide plus a bumetanide 1 mg IV. What concern should the RT monitor for?",
    options: [
      "Severe hypokalemia and metabolic alkalosis from aggressive diuresis",
      "Fluid overload from the IV medication volume",
      "Bronchospasm from furosemide",
      "Hyperkalemia from potassium-sparing effects"
    ],
    correctIndex: 0,
    rationale: "Aggressive loop diuretic therapy (furosemide + bumetanide) causes profound potassium, magnesium, and chloride losses through the kidneys. Hypokalemia can cause life-threatening arrhythmias. Loss of hydrogen ions and chloride leads to contraction alkalosis (metabolic alkalosis).",
    distractorExplanations: [
      "The small IV volume of these medications does not contribute to fluid overload.",
      "Furosemide does not typically cause bronchospasm.",
      "Loop diuretics cause HYPOkalemia (potassium wasting), not hyperkalemia. Potassium-sparing diuretics (spironolactone) preserve potassium."
    ],
    clinicalConcept: "Loop diuretics inhibit the Na+/K+/2Cl- cotransporter in the thick ascending loop of Henle. This results in sodium, potassium, chloride, and water excretion. Metabolic alkalosis results from H+ loss and contraction.",
    examTip: "Loop diuretics → hypokalemia + metabolic alkalosis. Potassium-sparing diuretics → hyperkalemia + metabolic acidosis. Know these electrolyte patterns.",
    safetyPearl: "ECG monitoring is essential during aggressive diuresis. Hypokalemia causes U waves, flattened T waves, and ST depression. Replace potassium and magnesium concurrently.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "diuretic electrolyte effects",
    pharmacologyCategory: "Fluid Overload/Diuretic Monitoring"
  },
  {
    id: "rrt-pharm-064",
    stem: "A 2-day-old neonate born at 32 weeks GA has increasing oxygen requirements and bilateral ground-glass opacities on chest X-ray. Which medication addresses the underlying pathophysiology?",
    options: [
      "Exogenous surfactant replacement via endotracheal instillation",
      "Albuterol via nebulizer",
      "Dexamethasone IV",
      "Caffeine citrate"
    ],
    correctIndex: 0,
    rationale: "The presentation describes neonatal respiratory distress syndrome (RDS) caused by surfactant deficiency in a premature neonate. Exogenous surfactant replacement directly addresses the underlying pathophysiology by providing the missing phospholipids and surfactant proteins needed to reduce alveolar surface tension.",
    distractorExplanations: [
      "Albuterol treats bronchospasm, which is not the primary issue in neonatal RDS. Premature neonates have surfactant deficiency, not bronchospasm.",
      "While antenatal steroids help mature surfactant production, postnatal dexamethasone does not provide immediate surfactant and has significant neonatal side effects.",
      "Caffeine treats apnea of prematurity, not RDS. It addresses central respiratory drive, not alveolar surface tension."
    ],
    clinicalConcept: "Type II alveolar cells begin producing surfactant at ~24 weeks but adequate amounts are not present until ~35 weeks. Ground-glass appearance on CXR with air bronchograms is the classic radiographic finding of RDS.",
    examTip: "Premature neonate + increasing O2 needs + ground-glass CXR = RDS = surfactant. Antenatal steroids (betamethasone) given to the mother 24–48 hours before delivery accelerate fetal lung maturity.",
    safetyPearl: "After surfactant administration, be prepared to rapidly wean FiO2 and ventilator settings as compliance improves dramatically. Failure to wean can result in overdistension and pneumothorax.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "neonatal RDS treatment",
    pharmacologyCategory: "Neonatal Concepts"
  },
  {
    id: "rrt-pharm-065",
    stem: "A patient on mechanical ventilation develops ventilator-associated pneumonia caused by MRSA. Which aerosolized antibiotic may be considered as adjunctive therapy?",
    options: [
      "Aerosolized vancomycin",
      "Aerosolized penicillin",
      "Aerosolized ceftriaxone",
      "Aerosolized metronidazole"
    ],
    correctIndex: 0,
    rationale: "Aerosolized vancomycin can be used as adjunctive therapy for MRSA ventilator-associated pneumonia (VAP) when systemic antibiotics alone are insufficient. The inhaled route delivers high local concentrations to the site of infection while minimizing systemic toxicity.",
    distractorExplanations: [
      "MRSA is resistant to penicillin — aerosolized penicillin would be ineffective.",
      "Ceftriaxone is a third-generation cephalosporin with limited MRSA coverage and is not commonly aerosolized.",
      "Metronidazole targets anaerobic bacteria, not MRSA, and is not typically aerosolized."
    ],
    clinicalConcept: "Adjunctive inhaled antibiotics in VAP aim to achieve high alveolar drug concentrations (10-100× MIC) that are difficult to reach with systemic therapy alone due to poor lung penetration of many antibiotics.",
    examTip: "Inhaled antibiotics for ventilated patients: vancomycin (MRSA), tobramycin/colistin (Pseudomonas/MDR gram-negatives). These are ADJUNCTIVE — not replacements for systemic therapy.",
    safetyPearl: "Pre-treat with bronchodilator before inhaled vancomycin. Use vibrating mesh nebulizer for best delivery. Monitor for bronchospasm and ensure ventilator circuit filters are changed regularly.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "inhaled antibiotics for VAP",
    pharmacologyCategory: "Ventilated Patient Medication Delivery"
  },
  {
    id: "rrt-pharm-066",
    stem: "A patient with moderate persistent asthma is prescribed fluticasone/salmeterol (Advair) 250/50 DPI. What does the 250/50 represent?",
    options: [
      "Fluticasone 250 mcg (ICS) and salmeterol 50 mcg (LABA) per actuation",
      "Total daily dose of 250 mg fluticasone and 50 mg salmeterol",
      "250 puffs of fluticasone and 50 puffs of salmeterol per canister",
      "Fluticasone 50 mcg and salmeterol 250 mcg per actuation"
    ],
    correctIndex: 0,
    rationale: "Advair Diskus 250/50 contains fluticasone propionate 250 mcg (inhaled corticosteroid) and salmeterol 50 mcg (long-acting beta-2 agonist) per actuation. The first number always represents the ICS dose, which comes in multiple strengths (100/50, 250/50, 500/50).",
    distractorExplanations: [
      "Doses are in micrograms (mcg) per actuation, not total daily dose in milligrams.",
      "250/50 represents drug content per dose, not puff count per canister.",
      "The first number is the ICS (fluticasone) and the second is the LABA (salmeterol), not reversed."
    ],
    clinicalConcept: "ICS/LABA combination inhalers are the cornerstone of moderate-severe asthma management. The ICS controls inflammation while the LABA provides sustained bronchodilation. Together they are more effective than increasing ICS dose alone.",
    examTip: "Know common ICS/LABA combinations: Advair (fluticasone/salmeterol), Symbicort (budesonide/formoterol), Breo Ellipta (fluticasone furoate/vilanterol). First number = ICS dose.",
    safetyPearl: "Patients must understand that ICS/LABA inhalers are MAINTENANCE therapy, not rescue. They should always carry a separate SABA (albuterol) rescue inhaler.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "combination inhaler dosing",
    pharmacologyCategory: "Device Selection"
  },
  {
    id: "rrt-pharm-067",
    stem: "An RT observes a patient using a DPI but exhaling INTO the device before inhaling. What is the consequence?",
    options: [
      "Moisture from exhaled air can clump the dry powder and reduce drug delivery",
      "It increases drug delivery by clearing dead space",
      "It has no effect on drug delivery",
      "It activates the powder more effectively"
    ],
    correctIndex: 0,
    rationale: "Exhaling into a DPI introduces moisture and humidity into the powder chamber, causing the dry medication particles to clump together. This increases particle size, reduces the respirable fraction, and dramatically decreases drug delivery to the lower airways.",
    distractorExplanations: [
      "Exhaling into the DPI does not clear dead space — it contaminates the powder with moisture.",
      "Moisture significantly reduces drug delivery by 50% or more.",
      "The powder is activated by inhalation, not exhalation. Moisture from exhalation degrades the preparation."
    ],
    clinicalConcept: "Correct DPI technique: (1) Load dose, (2) Exhale AWAY from device, (3) Seal lips around mouthpiece, (4) Inhale deeply and forcefully, (5) Hold breath 5–10 seconds.",
    examTip: "DPI technique errors to watch for: exhaling into device, not inhaling forcefully enough, shaking the device, using a spacer (not needed/not used with DPIs).",
    safetyPearl: "Store DPIs in dry conditions. Do not use in high-humidity environments (bathrooms). Keep the cover/cap on when not in use. Replace if the device gets wet.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "DPI technique errors",
    pharmacologyCategory: "Device Selection"
  },
  {
    id: "rrt-pharm-068",
    stem: "An asthmatic patient has been using their albuterol rescue inhaler 4+ times daily for the past 3 weeks. What does this pattern indicate?",
    options: [
      "Inadequate asthma control requiring step-up in controller therapy",
      "The albuterol is working well and should be continued as-is",
      "The patient should switch to a different SABA brand",
      "Albuterol tolerance has developed and the patient should stop using it"
    ],
    correctIndex: 0,
    rationale: "Using a rescue inhaler >2 days/week indicates uncontrolled asthma per NAEPP guidelines. This patient needs assessment and step-up of controller therapy (initiating or increasing ICS, adding LABA, or other controller medications) rather than continued reliance on rescue bronchodilator alone.",
    distractorExplanations: [
      "Frequent rescue inhaler use indicates treatment failure, not success.",
      "Switching SABA brands does not address the underlying problem of inadequate asthma control.",
      "While beta-receptor downregulation can occur, the immediate concern is initiating proper controller therapy, not stopping rescue medications."
    ],
    clinicalConcept: "NAEPP stepwise approach: rescue SABA >2 days/week → add low-dose ICS. Still uncontrolled → add LABA or increase ICS dose. Still uncontrolled → add LAMA, biologic, or oral steroids.",
    examTip: "Rescue inhaler use frequency is an asthma control indicator. Well-controlled: ≤2 days/week. Not well-controlled: >2 days/week. Very poorly controlled: daily or multiple times daily.",
    safetyPearl: "Over-reliance on rescue inhalers without adequate controller therapy is associated with increased asthma mortality. Ensure patients understand the difference between rescue and controller medications.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "asthma control assessment",
    pharmacologyCategory: "Reassessment After Treatment"
  },
  {
    id: "rrt-pharm-069",
    stem: "During a neonatal resuscitation, the team needs to administer epinephrine but has no IV access. What is the alternative route?",
    options: [
      "Endotracheal tube (ETT) at a higher dose (0.05–0.1 mg/kg of 1:10,000)",
      "Oral administration",
      "Rectal administration",
      "Subcutaneous injection only"
    ],
    correctIndex: 0,
    rationale: "When IV/IO access is unavailable during neonatal resuscitation, epinephrine can be administered via the endotracheal tube at 3–10× the IV dose (0.05–0.1 mg/kg of 1:10,000 solution). This route provides direct access to the pulmonary vasculature.",
    distractorExplanations: [
      "Oral epinephrine would be destroyed by gastric acid and cannot provide rapid systemic absorption during resuscitation.",
      "Rectal administration is not an appropriate route for emergency epinephrine in neonates.",
      "Subcutaneous injection has too slow an onset for cardiac arrest. The ETT route provides more rapid absorption."
    ],
    clinicalConcept: "NRP guidelines recommend IV/UVC (umbilical venous catheter) as the preferred route for neonatal epinephrine. ETT route is used only when IV access cannot be established quickly.",
    examTip: "Neonatal resuscitation epinephrine: IV/UVC: 0.01–0.03 mg/kg of 1:10,000. ETT: 0.05–0.1 mg/kg of 1:10,000 (higher dose due to variable absorption).",
    safetyPearl: "ETT epinephrine should be followed by a flush (0.5–1 mL normal saline) and several positive-pressure breaths to distribute the medication. Establish IV/IO access as soon as possible.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "neonatal resuscitation drugs",
    pharmacologyCategory: "Neonatal Concepts"
  },
  {
    id: "rrt-pharm-070",
    stem: "A physician orders a bronchoprovocation test using methacholine for a patient with suspected asthma. What response confirms the diagnosis?",
    options: [
      "A ≥20% decrease in FEV1 at a low concentration of methacholine (PC20 ≤ 16 mg/mL)",
      "An increase in FEV1 of 12% or more",
      "No change in FEV1 at any concentration",
      "A 5% decrease in FEV1 at the highest concentration only"
    ],
    correctIndex: 0,
    rationale: "A positive methacholine challenge test is defined as a ≥20% fall in FEV1 (PC20) at a concentration of ≤16 mg/mL. This confirms airway hyperresponsiveness consistent with asthma. Methacholine is a muscarinic agonist that causes bronchoconstriction in hyperreactive airways.",
    distractorExplanations: [
      "An increase in FEV1 is a bronchodilator response, not a bronchoprovocation response.",
      "No change in FEV1 would be a NEGATIVE test, ruling out asthma with high negative predictive value.",
      "Only 5% decrease, even at maximum concentration, suggests normal airway responsiveness."
    ],
    clinicalConcept: "Methacholine challenge is highly sensitive (>90%) for asthma — a negative test essentially rules out asthma. However, it is not very specific, as other conditions can cause airway hyperresponsiveness.",
    examTip: "Bronchoprovocation: methacholine → bronchoconstriction → positive if FEV1 drops ≥20% (PC20). Bronchodilator: albuterol → bronchodilation → positive if FEV1 increases ≥12% AND ≥200 mL.",
    safetyPearl: "Have rescue bronchodilator and resuscitation equipment immediately available. Absolute contraindications: FEV1 <60% predicted, severe airflow limitation, recent MI, aortic aneurysm, uncontrolled hypertension.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "bronchoprovocation testing",
    pharmacologyCategory: "Bronchodilator Response Interpretation"
  },
  {
    id: "rrt-pharm-071",
    stem: "A patient receiving spironolactone (Aldactone) for CHF-related fluid retention develops a serum potassium of 5.8 mEq/L. What type of diuretic is spironolactone and what electrolyte risk does it carry?",
    options: [
      "Potassium-sparing diuretic with risk of hyperkalemia",
      "Loop diuretic with risk of hypokalemia",
      "Thiazide diuretic with risk of hyponatremia",
      "Osmotic diuretic with risk of dehydration"
    ],
    correctIndex: 0,
    rationale: "Spironolactone is an aldosterone antagonist (potassium-sparing diuretic). By blocking aldosterone in the collecting duct, it prevents sodium reabsorption and potassium excretion, leading to potassium retention and risk of hyperkalemia (K+ >5.0 mEq/L).",
    distractorExplanations: [
      "Loop diuretics (furosemide, bumetanide) cause hypokalemia. Spironolactone is not a loop diuretic.",
      "Thiazide diuretics (HCTZ) primarily cause hyponatremia and hypokalemia. Spironolactone is not a thiazide.",
      "Osmotic diuretics (mannitol) work differently. Spironolactone specifically blocks aldosterone receptors."
    ],
    clinicalConcept: "Aldosterone normally acts on the collecting duct to reabsorb sodium and secrete potassium. Blocking aldosterone with spironolactone reverses this: less sodium reabsorbed, less potassium excreted → hyperkalemia risk.",
    examTip: "K+-sparing diuretics: spironolactone, eplerenone, amiloride, triamterene → risk of HYPERkalemia. Loop + thiazide diuretics → risk of HYPOkalemia. Know the distinction.",
    safetyPearl: "Hyperkalemia (K+ >6.0) can cause fatal cardiac arrhythmias. Monitor ECG for peaked T waves, widened QRS, and sine wave pattern. Avoid K+ supplements and ACE inhibitors concurrently.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "potassium-sparing diuretics",
    pharmacologyCategory: "Fluid Overload/Diuretic Monitoring"
  },
  {
    id: "rrt-pharm-072",
    stem: "A physician writes an order for 'albuterol 25 mg via SVN.' The standard adult dose is 2.5 mg. What should the RT do?",
    options: [
      "Clarify the order with the physician — the dose appears to be a 10-fold error",
      "Administer as written since the physician ordered it",
      "Give 2.5 mg and document that the full dose was given",
      "Administer 25 mg divided into 10 separate treatments"
    ],
    correctIndex: 0,
    rationale: "A 10-fold dosing error (25 mg vs. 2.5 mg) is a common medication error pattern. The RT has a professional and legal obligation to verify orders that appear incorrect. Administering 25 mg could cause severe tachycardia, hypokalemia, and potentially fatal arrhythmias.",
    distractorExplanations: [
      "Blindly following an order that appears to be a medication error violates safe practice standards.",
      "Administering a different dose than ordered without clarification is practicing outside scope.",
      "Dividing into 10 treatments does not address the likely prescribing error and is not supported by evidence."
    ],
    clinicalConcept: "Decimal point errors and zero-related dosing mistakes are among the most common medication errors. Always verify doses that seem unusual and use leading zeros (0.5 mg) while avoiding trailing zeros (5.0 mg).",
    examTip: "Order clarification questions test your duty to question incorrect orders. If a dose is 10× normal, route is wrong, or drug is contraindicated → ALWAYS clarify.",
    safetyPearl: "Use the Institute for Safe Medication Practices (ISMP) guidelines: write clearly, avoid abbreviations, include indication, use computer order entry when available, and employ independent double-checks for high-alert medications.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "medication safety",
    pharmacologyCategory: "Physician-Order Clarification"
  },
  {
    id: "rrt-pharm-073",
    stem: "Which of the following patients should NOT receive a beta-blocker due to respiratory concerns?",
    options: [
      "A patient with severe reactive airway disease (asthma)",
      "A patient with stable hypertension on lisinopril",
      "A patient with heart failure on an ACE inhibitor",
      "A patient with atrial fibrillation and normal lungs"
    ],
    correctIndex: 0,
    rationale: "Non-selective beta-blockers (propranolol, nadolol) block both beta-1 (cardiac) and beta-2 (pulmonary) receptors. Blocking beta-2 receptors in asthmatic patients can cause severe, life-threatening bronchospasm. Even cardioselective beta-blockers should be used with extreme caution in severe asthma.",
    distractorExplanations: [
      "Hypertensive patients without reactive airway disease can safely use beta-blockers.",
      "Heart failure patients commonly benefit from cardioselective beta-blockers (carvedilol, metoprolol, bisoprolol) without respiratory complications.",
      "Atrial fibrillation with normal lungs is a standard indication for beta-blocker rate control."
    ],
    clinicalConcept: "Beta-2 receptors in bronchial smooth muscle mediate bronchodilation. Blocking these receptors promotes bronchoconstriction. The risk is highest with non-selective agents and in patients with pre-existing airway hyperreactivity.",
    examTip: "Asthma + beta-blocker = contraindicated (especially non-selective). COPD + cardioselective beta-blocker = may be used cautiously. This is a very common TMC drug interaction question.",
    safetyPearl: "If a patient with reactive airways needs a beta-blocker for cardiac indication, use the most cardioselective option (bisoprolol, atenolol, metoprolol) at the lowest dose, with close respiratory monitoring.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "beta-blocker respiratory effects",
    pharmacologyCategory: "Contraindications"
  },
  {
    id: "rrt-pharm-074",
    stem: "A ventilated patient is transitioning from IV sedation to spontaneous breathing trials. The physician orders dexmedetomidine (Precedex). What advantage does this agent have for weaning?",
    options: [
      "It provides sedation and anxiolysis without significant respiratory depression",
      "It is a powerful bronchodilator that facilitates weaning",
      "It provides complete neuromuscular blockade for smooth transition",
      "It increases respiratory drive to prevent hypoventilation"
    ],
    correctIndex: 0,
    rationale: "Dexmedetomidine is a selective alpha-2 adrenergic agonist that provides sedation, anxiolysis, and mild analgesia WITHOUT significant respiratory depression. This property makes it ideal for ventilator weaning as patients can be lightly sedated while maintaining their respiratory drive.",
    distractorExplanations: [
      "Dexmedetomidine has no bronchodilator properties.",
      "Dexmedetomidine provides sedation, NOT neuromuscular blockade. These are completely different drug classes.",
      "While it preserves respiratory drive (unlike opioids/benzodiazepines), it does not actively increase respiratory drive."
    ],
    clinicalConcept: "Unlike propofol and benzodiazepines, dexmedetomidine allows patients to be arousable and cooperative ('conscious sedation') while maintaining respiratory effort — crucial during SBTs.",
    examTip: "Dexmedetomidine = sedation without respiratory depression, ideal for ventilator weaning. Key side effects: bradycardia and hypotension from sympatholytic effects.",
    safetyPearl: "Monitor for bradycardia (can be severe) and hypotension. Loading dose should be avoided or given slowly. Not recommended for use >24 hours per FDA labeling, though ICU use often extends longer.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "ICU sedation for weaning",
    pharmacologyCategory: "Ventilated Patient Medication Delivery"
  },
  {
    id: "rrt-pharm-075",
    stem: "A patient with severe sepsis develops acute kidney injury. The physician switches from furosemide to a continuous infusion. Why might continuous infusion be preferred?",
    options: [
      "Continuous infusion provides more consistent diuresis with fewer peaks and troughs, reducing ototoxicity risk",
      "Bolus dosing is always more effective than continuous",
      "Continuous infusion allows higher total daily doses without monitoring",
      "There is no difference between continuous and bolus dosing"
    ],
    correctIndex: 0,
    rationale: "Continuous furosemide infusion provides more consistent drug levels at the loop of Henle, resulting in sustained natriuresis without the high peak levels that contribute to ototoxicity. It also produces more predictable urine output for fluid management in critically ill patients.",
    distractorExplanations: [
      "In many scenarios, continuous infusion achieves equal or better diuresis compared to intermittent boluses.",
      "Monitoring is still required regardless of delivery method — continuous infusion requires electrolyte monitoring.",
      "Multiple studies have shown differences in ototoxicity and urine output patterns between continuous and bolus dosing."
    ],
    clinicalConcept: "In acute kidney injury, higher bolus doses of loop diuretics are often needed to achieve adequate drug delivery to the loop of Henle. Continuous infusion avoids the ototoxic peaks while maintaining effective concentrations.",
    examTip: "Continuous diuretic infusion in ICU: more consistent output, potentially less ototoxicity, better fluid management. Common rate: furosemide 5-40 mg/hr after loading dose.",
    safetyPearl: "Monitor hourly urine output, electrolytes q4-6h, and daily weights during continuous diuretic infusion. Set clear targets for urine output and adjust rate accordingly.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "continuous diuretic infusion",
    pharmacologyCategory: "Fluid Overload/Diuretic Monitoring"
  },
  {
    id: "rrt-pharm-076",
    stem: "A 4-year-old child with a history of asthma presents with acute stridor after eating peanuts. Which TWO medications should be administered FIRST?",
    options: [
      "Epinephrine IM (for anaphylaxis) and albuterol nebulizer (for bronchospasm)",
      "Ipratropium and oral montelukast",
      "Dexamethasone IV and diphenhydramine PO",
      "Cromolyn sodium and budesonide nebulizer"
    ],
    correctIndex: 0,
    rationale: "This child is experiencing anaphylaxis (allergen exposure + stridor = upper airway edema). Epinephrine IM is the first-line treatment for anaphylaxis (addresses airway edema, bronchospasm, hypotension, and urticaria). Albuterol nebulizer addresses the lower airway bronchospasm component from the underlying asthma.",
    distractorExplanations: [
      "Ipratropium does not address the anaphylactic component, and oral montelukast is too slow acting.",
      "While steroids and antihistamines are adjunctive, they are NOT first-line in anaphylaxis. Epinephrine must come first.",
      "Cromolyn is prophylactic only and has no role in acute anaphylaxis. Budesonide is a maintenance medication."
    ],
    clinicalConcept: "Anaphylaxis involves mast cell degranulation releasing histamine, leukotrienes, and prostaglandins. Epinephrine counteracts all effects: alpha-1 (vasoconstriction), beta-1 (cardiac output), beta-2 (bronchodilation), and mast cell stabilization.",
    examTip: "Peanut allergy + stridor + asthma = anaphylaxis + bronchospasm. Treat both: epinephrine IM (anaphylaxis) + albuterol (bronchospasm). Stridor after allergen exposure = anaphylaxis until proven otherwise.",
    safetyPearl: "Keep the child in observation for at least 4-6 hours after anaphylaxis treatment due to risk of biphasic reaction (recurrence of symptoms 4-12 hours later). Prescribe EpiPen for future episodes.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "pediatric anaphylaxis",
    pharmacologyCategory: "Emergency Medication Recognition"
  },
  {
    id: "rrt-pharm-077",
    stem: "A patient is prescribed omalizumab (Xolair) for severe persistent allergic asthma unresponsive to ICS/LABA therapy. What class of medication is this?",
    options: [
      "Anti-IgE monoclonal antibody",
      "Leukotriene receptor antagonist",
      "Phosphodiesterase inhibitor",
      "Mast cell stabilizer"
    ],
    correctIndex: 0,
    rationale: "Omalizumab (Xolair) is a recombinant humanized monoclonal antibody that binds to free IgE, preventing it from binding to mast cells and basophils. This reduces the allergic cascade that triggers asthma exacerbations in patients with elevated IgE levels.",
    distractorExplanations: [
      "LTRAs (montelukast) block leukotriene receptors — a different mechanism than IgE binding.",
      "PDE inhibitors (roflumilast, theophylline) prevent cAMP/cGMP breakdown — different mechanism.",
      "Mast cell stabilizers (cromolyn) prevent mast cell degranulation but do not target IgE directly."
    ],
    clinicalConcept: "Biologic therapies for severe asthma target specific immune pathways: anti-IgE (omalizumab), anti-IL-5 (mepolizumab, reslizumab, benralizumab), anti-IL-4/13 (dupilumab), anti-TSLP (tezepelumab).",
    examTip: "Omalizumab = anti-IgE, for allergic asthma with elevated IgE. Requires subcutaneous injection every 2-4 weeks in a healthcare setting with monitoring for anaphylaxis.",
    safetyPearl: "Omalizumab carries a Black Box Warning for anaphylaxis (0.1-0.2% of patients). Must be administered in a healthcare setting with 2-hour post-injection observation for the first 3 doses.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "biologic therapies",
    pharmacologyCategory: "Route of Administration"
  },
  {
    id: "rrt-pharm-078",
    stem: "A patient on the ventilator requires prone positioning for refractory hypoxemia in ARDS. The RT has an MDI treatment due. What consideration applies?",
    options: [
      "Ensure the MDI adapter position is verified and drug delivery may be altered in prone position",
      "MDI treatments are contraindicated during prone positioning",
      "Drug delivery is always improved in prone position",
      "Switch to oral medication administration while prone"
    ],
    correctIndex: 0,
    rationale: "While aerosol treatments can be given during prone positioning, the RT should verify that the MDI adapter remains properly positioned in the inspiratory limb and be aware that drug deposition patterns may differ from supine positioning due to changes in regional ventilation distribution.",
    distractorExplanations: [
      "MDI treatments are NOT contraindicated during prone positioning — they can be administered safely with proper technique.",
      "Drug delivery is not universally improved in prone position. Regional ventilation changes may alter deposition patterns.",
      "Oral medications may actually be more challenging to administer safely in prone position and are not a substitute for inhaled bronchodilators."
    ],
    clinicalConcept: "Prone positioning improves oxygenation in ARDS by redistributing ventilation to dorsal (now non-dependent) regions, improving V/Q matching. Drug delivery considerations are secondary to the oxygenation benefit.",
    examTip: "Prone positioning + aerosol delivery = can be done, verify adapter position, be aware of altered deposition. This is a practical clinical scenario question.",
    safetyPearl: "During prone positioning, secure all tubing, ETT, and vascular access before turning. Verify ETT position with capnography and chest rise after turning. Protect pressure points.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "prone positioning and drugs",
    pharmacologyCategory: "Ventilated Patient Medication Delivery"
  },
  {
    id: "rrt-pharm-079",
    stem: "A patient with severe bronchospasm fails to respond to maximum albuterol and ipratropium. The physician asks about subcutaneous terbutaline. What is the indication?",
    options: [
      "Severe bronchospasm unresponsive to inhaled therapy, as subcutaneous delivery bypasses obstructed airways",
      "Routine maintenance therapy for mild asthma",
      "Prophylaxis before exercise",
      "Treatment of nasal congestion"
    ],
    correctIndex: 0,
    rationale: "Subcutaneous terbutaline (0.25 mg SC) is a beta-2 agonist used when inhaled bronchodilators cannot effectively reach the lower airways due to severe obstruction. The SC route provides systemic delivery that bypasses the obstructed airways, ensuring drug reaches beta-2 receptors.",
    distractorExplanations: [
      "SC terbutaline is reserved for acute severe bronchospasm, not routine maintenance.",
      "Exercise prophylaxis uses inhaled SABA, not subcutaneous beta-agonists.",
      "Terbutaline does not treat nasal congestion — decongestants (pseudoephedrine, oxymetazoline) are used."
    ],
    clinicalConcept: "When airflow obstruction is so severe that inhaled medications cannot reach the lower airways (silent chest, near-fatal asthma), systemic bronchodilator delivery via SC or IV route may be necessary.",
    examTip: "Refractory bronchospasm not responding to inhaled therapy → consider SC terbutaline or SC/IM epinephrine. This is the 'last resort' before intubation question.",
    safetyPearl: "SC terbutaline causes more systemic side effects than inhaled therapy: significant tachycardia, tremor, hypokalemia, and hyperglycemia. Continuous cardiac monitoring is required.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "systemic bronchodilators",
    pharmacologyCategory: "Emergency Medication Recognition"
  },
  {
    id: "rrt-pharm-080",
    stem: "After administering 3 albuterol nebulizer treatments to a child with acute asthma, the RT notes the child's wheezing has decreased but respiratory rate remains elevated at 36 breaths/min. The next assessment step should include:",
    options: [
      "Peak flow measurement, SpO2 trending, work of breathing evaluation, and auscultation for air entry",
      "Immediate intubation since respiratory rate is elevated",
      "Discontinuing treatment since wheezing improved",
      "Administering a sedative to reduce the respiratory rate"
    ],
    correctIndex: 0,
    rationale: "Comprehensive post-bronchodilator assessment should include objective measures (peak flow, SpO2), breath sounds (quality of air entry, not just presence of wheezing), work of breathing (accessory muscle use, retractions), and clinical appearance. Tachycardia and mild tachypnea may persist from the albuterol's beta-1 effects.",
    distractorExplanations: [
      "Elevated respiratory rate alone does not indicate need for intubation — full clinical assessment is required first.",
      "Improved wheezing is positive, but treatment is not complete. Continued monitoring and assessment are needed.",
      "Sedation in an asthmatic child with elevated respiratory rate could mask deterioration and cause respiratory depression."
    ],
    clinicalConcept: "Post-bronchodilator assessment uses a multimodal approach: subjective (patient report), objective (vital signs, PEF, SpO2), and clinical (breath sounds, work of breathing). No single parameter determines response.",
    examTip: "Never rely on a single assessment finding. Improved wheezing + persistent tachypnea = partial response. Gather more data (PEF, SpO2, air entry) to determine next steps.",
    safetyPearl: "Albuterol-induced tachycardia (beta-1 effect) can persist for 30–60 minutes after treatment. Don't confuse medication side effects with clinical deterioration.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "comprehensive post-treatment assessment",
    pharmacologyCategory: "Reassessment After Treatment"
  },
  {
    id: "rrt-pharm-081",
    stem: "A physician orders nitroprusside (Nipride) infusion for a hypertensive crisis patient on the ventilator. What toxic metabolite must the RT/team monitor?",
    options: [
      "Cyanide (thiocyanate) levels",
      "Methemoglobin",
      "Lactic acid",
      "Ammonia"
    ],
    correctIndex: 0,
    rationale: "Nitroprusside is metabolized to cyanide, which is then converted to thiocyanate by the liver. At high doses or prolonged infusion (>48 hours), cyanide can accumulate and cause cellular toxicity by inhibiting cytochrome oxidase in the electron transport chain.",
    distractorExplanations: [
      "Methemoglobin monitoring is associated with inhaled nitric oxide, not nitroprusside.",
      "While cyanide toxicity can cause lactic acidosis secondarily, it is the cyanide/thiocyanate level that is directly monitored.",
      "Ammonia monitoring is associated with hepatic failure and valproic acid therapy, not nitroprusside."
    ],
    clinicalConcept: "Cyanide toxicity signs: metabolic acidosis, increased mixed venous O2 (cells can't use O2), tachycardia, altered mental status. Treatment: hydroxocobalamin (Cyanokit) or sodium thiosulfate.",
    examTip: "Nitroprusside = cyanide risk. Inhaled nitric oxide = methemoglobin risk. These are commonly paired drug-monitoring questions on the TMC.",
    safetyPearl: "Limit nitroprusside infusion to <48 hours when possible. Maximum dose is 10 mcg/kg/min. Monitor thiocyanate levels (keep <12 mg/dL) and watch for metabolic acidosis.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "vasodilator monitoring",
    pharmacologyCategory: "Side Effect Recognition"
  },
  {
    id: "rrt-pharm-082",
    stem: "A respiratory therapist is educating a COPD patient on proper MDI technique. Which step is MOST commonly performed incorrectly by patients?",
    options: [
      "Failure to coordinate actuation with inhalation (poor hand-breath coordination)",
      "Shaking the canister too vigorously",
      "Holding breath for too long after inhalation",
      "Using the inhaler in the wrong hand"
    ],
    correctIndex: 0,
    rationale: "The most common MDI technique error is poor hand-breath coordination — patients actuate the canister too early or too late relative to their inhalation, resulting in medication impacting the oropharynx or being exhaled instead of reaching the lower airways.",
    distractorExplanations: [
      "Shaking before use is correct and rarely done too vigorously to cause problems.",
      "Most patients don't hold breath LONG ENOUGH (10 seconds recommended). Holding too long is uncommon.",
      "Hand dominance does not significantly affect MDI technique."
    ],
    clinicalConcept: "Proper MDI technique results in ~10-20% lung deposition. Poor technique reduces this to <5%. Using a spacer/VHC eliminates the coordination requirement and increases deposition to ~15-25%.",
    examTip: "MDI technique errors (most to least common): poor coordination, too fast inhalation, no breath-hold, not shaking, not priming, wrong head position. Spacer solves #1.",
    safetyPearl: "Use the 'teach-back' method: have the patient demonstrate technique, then correct errors. Reassess technique at every visit — studies show technique deteriorates over time without reinforcement.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "inhaler technique education",
    pharmacologyCategory: "Device Selection"
  },
  {
    id: "rrt-pharm-083",
    stem: "An RT is called to assess a neonate who received the first dose of prostaglandin E1 (alprostadil) infusion and develops apnea. Is this expected?",
    options: [
      "Yes — apnea is a well-known side effect of PGE1 infusion in neonates",
      "No — PGE1 should stimulate breathing",
      "Apnea indicates PGE1 overdose and the infusion should be stopped",
      "Apnea is caused by the IV fluid volume, not the medication"
    ],
    correctIndex: 0,
    rationale: "Apnea occurs in approximately 12% of neonates receiving PGE1 (alprostadil) infusion. It is a well-documented side effect, particularly at higher doses. Intubation and mechanical ventilation should be available whenever PGE1 is initiated.",
    distractorExplanations: [
      "PGE1 does not stimulate breathing — it maintains PDA patency for duct-dependent cardiac lesions but can cause CNS depression.",
      "Apnea at therapeutic doses is an expected side effect, not necessarily an overdose. Dose reduction may help but stopping may be harmful if the PDA needs to remain open.",
      "The fluid volume is negligible. Apnea is a direct pharmacologic effect of prostaglandin E1."
    ],
    clinicalConcept: "PGE1 (alprostadil) keeps the ductus arteriosus open in neonates with duct-dependent congenital heart defects (e.g., hypoplastic left heart, transposition, critical coarctation). It is a temporizing measure before surgical repair.",
    examTip: "PGE1 = keeps PDA OPEN (opposite of indomethacin which CLOSES PDA). PGE1 side effects: apnea, fever, hypotension, seizures. Always have intubation equipment ready.",
    safetyPearl: "Start PGE1 at the lowest effective dose (0.01–0.05 mcg/kg/min) and titrate up as needed. Have intubation equipment at bedside before starting. Neonatal transport teams should be familiar with PGE1 management.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "prostaglandin E1 neonatal",
    pharmacologyCategory: "Neonatal Concepts"
  },
  {
    id: "rrt-pharm-084",
    stem: "A patient with COPD and pulmonary edema has a chest X-ray showing bilateral pleural effusions and cardiomegaly. The physician orders IV furosemide and fluid restriction. What respiratory assessment finding would indicate the treatment is effective?",
    options: [
      "Resolution of crackles, improved SpO2, decreased work of breathing, and increased urine output",
      "Development of wheezing indicating bronchodilation",
      "Unchanged breath sounds after 6 hours",
      "Increased respiratory rate indicating improved ventilatory drive"
    ],
    correctIndex: 0,
    rationale: "Effective diuretic therapy for pulmonary edema results in fluid removal from the alveoli and interstitial spaces. Clinical signs of improvement include: clearing of crackles/rales, improved oxygenation (SpO2), decreased accessory muscle use, and increased urine output confirming diuresis.",
    distractorExplanations: [
      "Wheezing may be present in cardiac asthma but its development does not indicate improvement from diuretic therapy.",
      "Unchanged breath sounds after 6 hours suggest treatment failure, not success.",
      "Increased respiratory rate indicates worsening, not improvement."
    ],
    clinicalConcept: "Pulmonary edema causes crackles due to fluid in alveoli, hypoxemia from impaired gas exchange, and increased work of breathing from decreased lung compliance. Removing excess fluid reverses all of these.",
    examTip: "Post-diuretic assessment: breath sounds (crackles clearing), SpO2 (improving), respiratory rate (decreasing), urine output (increasing), weight (decreasing). Monitor K+ and Mg2+.",
    safetyPearl: "Rapid diuresis can cause hypovolemia and renal hypoperfusion. Monitor blood pressure, heart rate, and urine output hourly. Target net negative fluid balance of 1-2 L/day in most patients.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "diuretic effectiveness assessment",
    pharmacologyCategory: "Fluid Overload/Diuretic Monitoring"
  },
  {
    id: "rrt-pharm-085",
    stem: "A patient with acute severe asthma receives IV magnesium sulfate. Twenty minutes later, the patient reports feeling flushed and warm. The RT checks deep tendon reflexes and finds them diminished. What does this suggest?",
    options: [
      "Expected side effects of magnesium; diminished DTRs suggest serum levels are approaching toxic range",
      "An allergic reaction to magnesium",
      "The magnesium is not working and should be discontinued",
      "These findings are unrelated to the magnesium infusion"
    ],
    correctIndex: 0,
    rationale: "Flushing and warmth are common side effects of IV magnesium due to vasodilation. Diminished deep tendon reflexes (DTRs) indicate rising serum magnesium levels approaching toxicity. Normal DTRs are lost at ~7-10 mEq/L. The infusion rate should be slowed and magnesium levels checked.",
    distractorExplanations: [
      "These are pharmacologic effects of magnesium, not an allergic reaction.",
      "Flushing indicates the drug IS working (vasodilation). The concern is the degree of effect, not lack of efficacy.",
      "Flushing and diminished DTRs have a direct temporal and pharmacologic relationship to magnesium."
    ],
    clinicalConcept: "Magnesium toxicity progression: therapeutic → flushing/warmth → loss of DTRs → respiratory depression → cardiac arrest. DTR assessment is the bedside monitoring tool for magnesium toxicity.",
    examTip: "Magnesium toxicity monitoring: check DTRs regularly. Lost DTRs → check level → slow or stop infusion. Absent DTRs + respiratory depression → give calcium gluconate (antidote).",
    safetyPearl: "Keep calcium gluconate (1-2 g IV) at the bedside during magnesium infusion as an antidote. Calcium directly antagonizes magnesium's effects on neuromuscular transmission.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "magnesium monitoring",
    pharmacologyCategory: "Emergency Medication Recognition"
  },
  {
    id: "rrt-pharm-086",
    stem: "A physician orders umeclidinium/vilanterol (Anoro Ellipta) for a patient with stable COPD. What combination of drug classes does this represent?",
    options: [
      "LAMA + LABA (long-acting muscarinic antagonist + long-acting beta-2 agonist)",
      "ICS + LABA (inhaled corticosteroid + long-acting beta-2 agonist)",
      "SABA + SAMA (short-acting beta-2 agonist + short-acting muscarinic antagonist)",
      "ICS + LAMA (inhaled corticosteroid + long-acting muscarinic antagonist)"
    ],
    correctIndex: 0,
    rationale: "Anoro Ellipta contains umeclidinium (LAMA) and vilanterol (LABA). This dual bronchodilator combination provides additive bronchodilation through two distinct mechanisms: muscarinic receptor blockade and beta-2 receptor stimulation. It is indicated for maintenance COPD therapy.",
    distractorExplanations: [
      "ICS/LABA combinations include Advair, Symbicort, and Breo Ellipta. Anoro does not contain a corticosteroid.",
      "SABA/SAMA is DuoNeb (albuterol/ipratropium). Anoro is a long-acting combination.",
      "ICS/LAMA is a less common combination. Anoro specifically combines LAMA + LABA."
    ],
    clinicalConcept: "GOLD guidelines recommend LAMA + LABA dual bronchodilator therapy for COPD patients with persistent symptoms despite monotherapy. This combination does not increase pneumonia risk (unlike ICS-containing regimens).",
    examTip: "COPD maintenance combination inhalers: LAMA/LABA = Anoro, Stiolto, Bevespi. ICS/LABA = Advair, Symbicort, Breo. ICS/LAMA/LABA = Trelegy Ellipta. Know the drug class pairs.",
    safetyPearl: "LAMA/LABA combinations should NOT be used with other anticholinergics or LABAs due to additive effects. Monitor for urinary retention (LAMA) and tachycardia (LABA).",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "COPD maintenance therapy",
    pharmacologyCategory: "Device Selection"
  },
  {
    id: "rrt-pharm-087",
    stem: "A post-extubation patient develops stridor. The physician orders racemic epinephrine 0.5 mL of 2.25% solution and dexamethasone 0.6 mg/kg IV. What is the rationale for giving BOTH medications?",
    options: [
      "Racemic epinephrine provides rapid but temporary mucosal vasoconstriction while dexamethasone provides sustained anti-inflammatory effect (onset 4–6 hours)",
      "Both drugs provide immediate relief",
      "Dexamethasone enhances the vasoconstrictor effect of racemic epinephrine",
      "The combination prevents the need for reintubation in all cases"
    ],
    correctIndex: 0,
    rationale: "Racemic epinephrine provides rapid (within minutes) alpha-adrenergic vasoconstriction of the subglottic mucosa, reducing edema and stridor. However, its effect is temporary (1-2 hours). Dexamethasone provides anti-inflammatory effect that takes 4-6 hours to onset but lasts 24-72 hours, bridging the gap after racemic epinephrine wears off.",
    distractorExplanations: [
      "Dexamethasone takes 4-6 hours for onset — it does NOT provide immediate relief.",
      "Dexamethasone works through anti-inflammatory mechanisms, not enhancement of vasoconstriction.",
      "While this combination reduces reintubation rates, it does not prevent reintubation in ALL cases."
    ],
    clinicalConcept: "Post-extubation stridor occurs in 2-16% of intubated patients due to laryngeal/subglottic edema. Risk factors: traumatic intubation, prolonged intubation (>36 hours), female sex, large ETT relative to trachea.",
    examTip: "Post-extubation stridor treatment: racemic epi (immediate) + dexamethasone (sustained). The steroid bridges the gap after epinephrine wears off. Classic TMC dual-therapy question.",
    safetyPearl: "Observe for at least 2-4 hours after racemic epinephrine for rebound stridor. If stridor recurs, repeat racemic epinephrine and consider reintubation with a smaller ETT if respiratory distress worsens.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "post-extubation stridor management",
    pharmacologyCategory: "Reassessment After Treatment"
  },
  {
    id: "rrt-pharm-088",
    stem: "A cystic fibrosis patient uses the following daily regimen: albuterol → hypertonic saline → dornase alfa → chest physiotherapy → inhaled tobramycin. Why is this sequence important?",
    options: [
      "Bronchodilator first opens airways, then mucolytics thin secretions, airway clearance removes them, and antibiotic treats infection with a clear airway",
      "The sequence can be performed in any order",
      "The antibiotic should always be given first to kill bacteria before clearance",
      "Dornase alfa must be given before albuterol to prevent drug interaction"
    ],
    correctIndex: 0,
    rationale: "The CF airway clearance sequence is optimized for maximum benefit: (1) Albuterol opens airways for better drug penetration, (2) Hypertonic saline hydrates secretions, (3) Dornase alfa breaks down DNA in secretions, (4) Chest physiotherapy clears the now-thinned secretions, (5) Tobramycin deposits on cleared airway surfaces for maximum antibacterial effect.",
    distractorExplanations: [
      "Sequence matters significantly for CF medication efficacy. Random ordering reduces therapeutic benefit.",
      "Giving antibiotic first would result in antibiotic being cleared with the secretions during subsequent chest physiotherapy.",
      "There is no drug interaction between dornase alfa and albuterol. The sequence is based on optimizing clearance."
    ],
    clinicalConcept: "CF treatment burden is significant (1-4 hours daily). Proper sequencing maximizes the benefit of each therapy while minimizing total treatment time.",
    examTip: "CF medication sequence: bronchodilator → mucokinetic/mucolytic → airway clearance → inhaled antibiotic. The antibiotic ALWAYS goes last to maximize deposition on cleared airways.",
    safetyPearl: "Dornase alfa should NOT be mixed with other medications. Allow ≥30 minutes between hypertonic saline and dornase alfa if possible, as some studies suggest interaction.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "CF treatment sequencing",
    pharmacologyCategory: "Reassessment After Treatment"
  },
  {
    id: "rrt-pharm-089",
    stem: "A patient on the ventilator receives propofol (Diprivan) for sedation. After 72 hours, triglyceride levels are markedly elevated. What explains this?",
    options: [
      "Propofol is formulated in a 10% soybean oil lipid emulsion that contributes to hyperlipidemia",
      "Propofol causes the liver to overproduce triglycerides",
      "The elevated triglycerides are coincidental",
      "Propofol inhibits lipase enzymes"
    ],
    correctIndex: 0,
    rationale: "Propofol is formulated in Intralipid (10% soybean oil, 2.25% glycerol, 1.2% egg lecithin). Each mL of propofol provides 1.1 kcal from fat. At typical sedation rates (25-50 mcg/kg/min), this contributes significant lipid calories and can cause hypertriglyceridemia.",
    distractorExplanations: [
      "The triglycerides come from the lipid emulsion vehicle, not hepatic overproduction.",
      "The temporal relationship with propofol initiation makes this directly causative, not coincidental.",
      "While propofol may impair lipid clearance somewhat, the primary mechanism is the exogenous lipid load."
    ],
    clinicalConcept: "Propofol lipid calories must be counted as part of the patient's nutritional intake. At 50 mcg/kg/min for a 70 kg patient, propofol contributes ~554 fat kcal/day.",
    examTip: "Propofol side effects: hypertriglyceridemia, hypotension, respiratory depression, propofol infusion syndrome (PRIS) with prolonged high-dose use.",
    safetyPearl: "Monitor triglycerides within 12 hours of starting propofol and at least every 3 days. If triglycerides >500 mg/dL, consider alternative sedation. Watch for PRIS: metabolic acidosis, rhabdomyolysis, hyperkalemia, cardiac failure.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "propofol side effects",
    pharmacologyCategory: "Side Effect Recognition"
  },
  {
    id: "rrt-pharm-090",
    stem: "A patient with ARDS on the ventilator is receiving a cisatracurium infusion for ventilator dyssynchrony. Which assessment tool should the RT use to titrate the infusion?",
    options: [
      "Train-of-four (TOF) peripheral nerve stimulation, targeting 1-2 twitches out of 4",
      "Glasgow Coma Scale",
      "RASS sedation score",
      "Peak inspiratory pressure trending"
    ],
    correctIndex: 0,
    rationale: "Train-of-four (TOF) monitoring uses a peripheral nerve stimulator (typically over the ulnar nerve) to deliver 4 electrical impulses and count the resulting muscle twitches. A target of 1-2 out of 4 twitches ensures adequate neuromuscular blockade while avoiding over-paralysis.",
    distractorExplanations: [
      "GCS assesses consciousness level, which cannot be reliably assessed during chemical paralysis.",
      "RASS measures sedation depth, not neuromuscular blockade. It cannot differentiate between sedation and paralysis.",
      "PIP is affected by many factors (compliance, resistance, secretions) and is not specific to NMB monitoring."
    ],
    clinicalConcept: "TOF ratio: 4/4 = no blockade, 3/4 = 75% receptor occupancy, 2/4 = 80% occupancy (target), 1/4 = 90% occupancy, 0/4 = 100% blockade (over-paralyzed).",
    examTip: "NMBA monitoring = train-of-four. Target = 1-2/4 twitches. 0/4 = too much paralysis (increase risk of prolonged weakness). Always assess sedation before TOF.",
    safetyPearl: "Verify adequate sedation BEFORE interpreting TOF results. A paralyzed patient with inadequate sedation experiences terrifying awareness. Daily NMBA holidays (if safe) help reassess both sedation and neuromuscular function.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "NMB monitoring",
    pharmacologyCategory: "Ventilated Patient Medication Delivery"
  },
  {
    id: "rrt-pharm-091",
    stem: "An order is received for 'albuterol via SVN q2h PRN for wheezing.' The patient has been receiving treatments every 2 hours for the past 12 hours with minimal improvement. What should the RT recommend?",
    options: [
      "Escalate to continuous albuterol and add systemic corticosteroids; notify the physician of treatment failure",
      "Continue q2h treatments indefinitely",
      "Increase the albuterol dose to 5 mg per treatment",
      "Switch to ipratropium monotherapy"
    ],
    correctIndex: 0,
    rationale: "Twelve hours of q2h bronchodilator treatments without significant improvement constitutes treatment failure. The RT should recommend escalation: continuous albuterol nebulization, systemic corticosteroids (if not already started), and physician notification for reassessment of the treatment plan and differential diagnosis.",
    distractorExplanations: [
      "Continuing the same regimen without improvement is not appropriate patient care.",
      "Simply increasing the dose without addressing the overall treatment failure does not follow evidence-based guidelines.",
      "Ipratropium monotherapy is less effective than albuterol for acute bronchospasm. Adding ipratropium to albuterol would be more appropriate."
    ],
    clinicalConcept: "Treatment failure in asthma/COPD may indicate: incorrect diagnosis, airway inflammation predominating over bronchospasm (need steroids), mucus plugging, or non-compliance with proper inhaler technique.",
    examTip: "When treatments are not working → escalate AND investigate why. The answer is rarely 'keep doing the same thing.' Consider alternative diagnoses, complications, and escalation pathways.",
    safetyPearl: "Document treatment responses (or lack thereof) meticulously. Use standardized assessment tools (asthma severity scores) to objectively track patient status and justify escalation.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "treatment failure management",
    pharmacologyCategory: "Physician-Order Clarification"
  },
  {
    id: "rrt-pharm-092",
    stem: "A neonatal patient born at 34 weeks is receiving nasal CPAP. The nurse reports the baby is having increased episodes of apnea. Which medication should be initiated?",
    options: [
      "Caffeine citrate (loading dose 20 mg/kg, then 5-10 mg/kg/day maintenance)",
      "Albuterol 1.25 mg via nebulizer",
      "Dexamethasone 0.5 mg/kg IV",
      "Surfactant via ETT"
    ],
    correctIndex: 0,
    rationale: "Caffeine citrate is the first-line pharmacologic treatment for apnea of prematurity. It stimulates the central respiratory drive, increases chemoreceptor sensitivity to CO2, and improves diaphragmatic contractility. Loading dose is 20 mg/kg IV/PO, followed by 5-10 mg/kg/day maintenance.",
    distractorExplanations: [
      "Albuterol treats bronchospasm, not central apnea. Apnea of prematurity is a central nervous system issue.",
      "Dexamethasone is not first-line for apnea of prematurity. It may be used for BPD prevention but has significant neonatal risks.",
      "Surfactant treats RDS, not apnea. The baby is on CPAP, not intubated."
    ],
    clinicalConcept: "Apnea of prematurity occurs in >50% of neonates <34 weeks GA due to immature brainstem respiratory control. It typically resolves by 37-44 weeks post-conceptional age.",
    examTip: "Premature neonate + apnea = caffeine citrate. Know the loading and maintenance doses. Caffeine has replaced theophylline as the preferred methylxanthine due to wider therapeutic index.",
    safetyPearl: "Caffeine citrate dose is NOT the same as caffeine base. Caffeine citrate 20 mg = caffeine base 10 mg. Verify formulation to prevent dosing errors. Monitor heart rate and feeding tolerance.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "neonatal apnea treatment",
    pharmacologyCategory: "Neonatal Concepts"
  },
  {
    id: "rrt-pharm-093",
    stem: "A RT is asked to administer aerosolized epoprostenol (Flolan) to a mechanically ventilated patient with acute pulmonary hypertension. What delivery system consideration is critical?",
    options: [
      "Use a dedicated continuous nebulizer with pH-stable diluent; drug is unstable and must be prepared fresh",
      "Use a standard SVN with saline diluent",
      "Administer via MDI for precise dosing",
      "Mix with albuterol for simultaneous delivery"
    ],
    correctIndex: 0,
    rationale: "Epoprostenol (Flolan) is extremely unstable with a half-life of 6 minutes at physiologic pH. It requires preparation with a specific alkaline diluent (glycine buffer), continuous nebulization, and must be used within 8 hours of reconstitution. A dedicated nebulizer system in the ventilator circuit is required.",
    distractorExplanations: [
      "Standard SVN with saline would degrade epoprostenol rapidly due to the acidic pH of normal saline.",
      "Epoprostenol is not available as an MDI formulation. It is administered as a continuous aerosolized solution.",
      "Epoprostenol should not be mixed with other medications due to compatibility concerns and its extreme instability."
    ],
    clinicalConcept: "Aerosolized epoprostenol provides selective pulmonary vasodilation similar to iNO but at a fraction of the cost. It has been increasingly used as an alternative to iNO in many ICUs.",
    examTip: "Epoprostenol (Flolan) = prostacyclin, extremely unstable (6-min half-life), requires specific diluent, continuous nebulization. iNO = nitric oxide, requires specific delivery system and methemoglobin monitoring.",
    safetyPearl: "Never abruptly discontinue aerosolized epoprostenol — rebound pulmonary hypertension can occur (similar to iNO). Wean gradually under hemodynamic monitoring.",
    difficulty: 5,
    category: "Respiratory Pharmacology",
    topic: "aerosolized prostacyclin",
    pharmacologyCategory: "Ventilated Patient Medication Delivery"
  },
  {
    id: "rrt-pharm-094",
    stem: "A patient with active tuberculosis is being treated with isoniazid, rifampin, pyrazinamide, and ethambutol. Which respiratory infection control measure is MOST important during aerosol treatments?",
    options: [
      "Perform treatments in a negative-pressure airborne infection isolation room (AIIR)",
      "Perform treatments in any private room",
      "Use a simple surgical mask on the patient",
      "No special precautions are needed once antibiotics are started"
    ],
    correctIndex: 0,
    rationale: "Active TB patients are infectious until they have been on appropriate therapy for at least 2 weeks AND show clinical improvement AND have negative sputum smears. Aerosol treatments generate infectious droplet nuclei, requiring airborne precautions with a negative-pressure AIIR and N95 respirator for healthcare workers.",
    distractorExplanations: [
      "A regular private room does not provide airborne infection control — negative pressure and specific air exchange rates are required.",
      "A surgical mask does not filter the small droplet nuclei (1-5 μm) that transmit TB. N95 or higher filtration is needed for HCWs.",
      "Patients remain infectious for at least 2 weeks after starting appropriate therapy. Precautions must be maintained."
    ],
    clinicalConcept: "TB is transmitted via airborne droplet nuclei that remain suspended in air for hours. AIIR rooms have ≥12 air changes per hour with air exhausted outside or through HEPA filtration before recirculation.",
    examTip: "TB + aerosol = AIIR + N95 for HCWs. Duration of infectiousness: minimum 2 weeks of appropriate therapy + clinical improvement + 3 consecutive negative AFB smears.",
    safetyPearl: "Healthcare workers must be fit-tested for N95 respirators annually. If a powered air-purifying respirator (PAPR) is available, it provides higher protection without fit-testing concerns.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "infection control with aerosols",
    pharmacologyCategory: "Route of Administration"
  },
  {
    id: "rrt-pharm-095",
    stem: "A physician orders fluticasone furoate/umeclidinium/vilanterol (Trelegy Ellipta) for a COPD patient. This is a triple therapy containing which three drug classes?",
    options: [
      "ICS + LAMA + LABA (inhaled corticosteroid + long-acting muscarinic antagonist + long-acting beta-2 agonist)",
      "SABA + SAMA + ICS",
      "LTRA + LABA + ICS",
      "PDE4 inhibitor + LABA + LAMA"
    ],
    correctIndex: 0,
    rationale: "Trelegy Ellipta is a single-inhaler triple therapy containing fluticasone furoate (ICS), umeclidinium (LAMA), and vilanterol (LABA). This combination provides anti-inflammatory action plus dual bronchodilation for COPD patients with frequent exacerbations despite dual therapy.",
    distractorExplanations: [
      "SABA and SAMA are short-acting rescue medications. Trelegy is a maintenance therapy with all long-acting components.",
      "LTRAs (montelukast) are oral medications not combined in inhalers.",
      "PDE4 inhibitors (roflumilast) are oral and not part of inhaler combinations."
    ],
    clinicalConcept: "GOLD guidelines recommend triple therapy (ICS/LAMA/LABA) for COPD patients who continue to exacerbate despite LAMA/LABA dual therapy, particularly those with blood eosinophils ≥300 cells/μL.",
    examTip: "Triple therapy for COPD = ICS + LAMA + LABA. Trelegy Ellipta is the most common single-device triple therapy. Once-daily dosing improves adherence.",
    safetyPearl: "Adding ICS increases pneumonia risk in COPD patients. Monitor for pneumonia symptoms. The eosinophil count helps predict which patients benefit from ICS-containing regimens.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "triple therapy COPD",
    pharmacologyCategory: "Route of Administration"
  },
  {
    id: "rrt-pharm-096",
    stem: "A patient with organophosphate poisoning presents with SLUDGE symptoms (salivation, lacrimation, urination, defecation, GI distress, emesis) and bronchospasm. Which TWO medications are indicated?",
    options: [
      "Atropine (anticholinergic) and pralidoxime (2-PAM, cholinesterase reactivator)",
      "Naloxone and flumazenil",
      "Epinephrine and diphenhydramine",
      "Albuterol and ipratropium only"
    ],
    correctIndex: 0,
    rationale: "Organophosphate poisoning causes excessive acetylcholine accumulation by irreversibly inhibiting acetylcholinesterase. Atropine blocks muscarinic ACh receptors, reversing SLUDGE symptoms and bronchospasm. Pralidoxime (2-PAM) reactivates cholinesterase if given early (within 24-48 hours).",
    distractorExplanations: [
      "Naloxone reverses opioids and flumazenil reverses benzodiazepines — neither addresses cholinergic crisis.",
      "Epinephrine and diphenhydramine treat anaphylaxis, not cholinergic poisoning.",
      "While bronchodilators may help symptomatically, they do not address the underlying anticholinesterase toxicity."
    ],
    clinicalConcept: "Organophosphates (pesticides, nerve agents) phosphorylate acetylcholinesterase, preventing ACh breakdown. This causes both muscarinic (SLUDGE, bronchospasm, miosis) and nicotinic (muscle fasciculations, weakness, paralysis) effects.",
    examTip: "SLUDGE + bronchospasm + miosis = organophosphate/cholinergic crisis. Treatment: atropine (muscarinic blockade) + pralidoxime (enzyme reactivation). High-dose atropine may be needed.",
    safetyPearl: "Healthcare workers must wear appropriate PPE (gloves, gown, respiratory protection) when treating organophosphate poisoning to prevent secondary contamination. Decontaminate the patient before treatment.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "toxicology antidotes",
    pharmacologyCategory: "Emergency Medication Recognition"
  },
  {
    id: "rrt-pharm-097",
    stem: "A RT is teaching a patient about the difference between their rescue inhaler (albuterol) and controller inhaler (fluticasone). Which statement by the patient indicates correct understanding?",
    options: [
      "'I use albuterol when I feel short of breath and fluticasone every day even when I feel fine'",
      "'I use fluticasone only when I have an asthma attack'",
      "'I can use either one whenever I need them'",
      "'I should stop fluticasone once I feel better'"
    ],
    correctIndex: 0,
    rationale: "This statement demonstrates correct understanding: albuterol (SABA/rescue) is used as-needed for acute symptoms, while fluticasone (ICS/controller) is used daily for maintenance regardless of symptoms to control underlying airway inflammation.",
    distractorExplanations: [
      "Using ICS only during attacks defeats its purpose — it requires consistent daily use to control inflammation.",
      "Rescue and controller inhalers have different indications and are not interchangeable.",
      "Stopping ICS when feeling well leads to loss of inflammation control and eventual exacerbation."
    ],
    clinicalConcept: "The 'asthma action plan' educates patients on rescue vs. controller medications. Controller medications (ICS, LABA, LTRA) maintain inflammation control. Rescue medications (SABA) provide acute symptom relief.",
    examTip: "Patient education questions test whether the patient understands rescue vs. controller. Correct understanding = daily controller + as-needed rescue. Common error = using controller as rescue.",
    safetyPearl: "Poor understanding of rescue vs. controller medications is a leading cause of asthma-related hospitalizations and deaths. Verify understanding at every visit using teach-back method.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "patient education",
    pharmacologyCategory: "Reassessment After Treatment"
  },
  {
    id: "rrt-pharm-098",
    stem: "A physician orders inhaled tobramycin for a ventilated patient using a vibrating mesh nebulizer. What advantage does the vibrating mesh nebulizer have over jet nebulizers for this application?",
    options: [
      "Higher drug output efficiency, minimal residual volume, and no additional gas flow that alters ventilator parameters",
      "Lower cost per treatment",
      "It can nebulize suspensions better than jet nebulizers",
      "It produces larger particles for upper airway deposition"
    ],
    correctIndex: 0,
    rationale: "Vibrating mesh nebulizers (e.g., Aerogen Solo) have several advantages in ventilated patients: higher output efficiency (>90% vs. ~40% for jet), minimal residual volume (<0.1 mL vs. 1-2 mL for jet), and no additional gas flow added to the circuit (jet nebulizers add 6-8 L/min which alters tidal volume and triggering).",
    distractorExplanations: [
      "Vibrating mesh nebulizers typically cost more per unit than jet nebulizers.",
      "Some mesh nebulizers struggle with viscous suspensions — jet nebulizers may be preferred for certain thick preparations.",
      "Mesh nebulizers produce appropriately sized particles (1-5 μm) for lower airway deposition, not larger particles."
    ],
    clinicalConcept: "Vibrating mesh technology uses a perforated plate (mesh/aperture plate) that vibrates at ultrasonic frequency, forcing liquid through micro-holes to create aerosol without additional driving gas flow.",
    examTip: "Vibrating mesh nebulizer advantages: no added flow, high efficiency, low residual, quiet operation. Disadvantages: higher cost, can clog with suspensions, requires cleaning.",
    safetyPearl: "When switching from jet to mesh nebulizer for the same drug, the dose may need adjustment due to the significantly higher drug delivery efficiency of the mesh device.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "advanced nebulizer technology",
    pharmacologyCategory: "Device Selection"
  },
  {
    id: "rrt-pharm-099",
    stem: "A neonate born at 30 weeks GA is receiving high-frequency oscillatory ventilation (HFOV). The physician wants to administer surfactant. What is the recommended approach?",
    options: [
      "Briefly switch to conventional ventilation for surfactant instillation via ETT, then resume HFOV",
      "Nebulize the surfactant through the HFOV circuit",
      "Administer surfactant via nasogastric tube",
      "Surfactant cannot be given while on any form of mechanical ventilation"
    ],
    correctIndex: 0,
    rationale: "Surfactant must be instilled directly into the ETT in divided aliquots. During HFOV, the continuous distending pressure and oscillatory flow make direct instillation challenging. The recommended approach is to briefly switch to conventional ventilation, instill surfactant via ETT with position changes, then resume HFOV.",
    distractorExplanations: [
      "Surfactant is too viscous for nebulization. Direct ETT instillation is required for adequate delivery.",
      "Oral/NG surfactant cannot reach the lungs and would be destroyed by gastric acid.",
      "Surfactant is routinely given to intubated neonates on mechanical ventilation — it is a primary indication."
    ],
    clinicalConcept: "Some centers use the INSURE technique: INtubate, SURfactant, Extubate to CPAP — minimizing duration of invasive ventilation. Newer techniques include LISA (Less Invasive Surfactant Administration) via thin catheter.",
    examTip: "Surfactant administration: always via ETT, divided doses, position changes. On HFOV → briefly switch to conventional mode. INSURE and LISA are newer techniques to know.",
    safetyPearl: "After surfactant administration, lung compliance improves rapidly. Be prepared to immediately reduce ventilator pressures and FiO2 to prevent overdistension, air leak, and oxygen toxicity.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "surfactant on HFOV",
    pharmacologyCategory: "Neonatal Concepts"
  },
  {
    id: "rrt-pharm-100",
    stem: "A patient receives 3 albuterol nebulizer treatments followed by spirometry. Pre-treatment FEV1 was 1.8 L and post-treatment FEV1 is 1.9 L. Is this a significant bronchodilator response?",
    options: [
      "No — improvement is only 5.6% and 100 mL, not meeting ATS/ERS criteria of ≥12% AND ≥200 mL",
      "Yes — any improvement is significant",
      "Yes — 100 mL improvement always meets criteria",
      "Cannot be determined without FVC values"
    ],
    correctIndex: 0,
    rationale: "Percent improvement = (1.9 - 1.8) / 1.8 × 100 = 5.6%. Absolute improvement = 100 mL. ATS/ERS criteria require BOTH ≥12% improvement AND ≥200 mL absolute increase. This patient meets neither criterion, so the response is NOT significant.",
    distractorExplanations: [
      "Not all improvements are clinically significant. Evidence-based criteria define what constitutes a meaningful response.",
      "100 mL does not meet the ≥200 mL threshold. Both percent and absolute criteria must be met.",
      "FEV1 criteria alone (without FVC) can determine bronchodilator responsiveness per ATS/ERS guidelines."
    ],
    clinicalConcept: "A negative bronchodilator response suggests fixed airway obstruction (more consistent with COPD than asthma), though some asthmatics may not show acute reversibility during stable periods.",
    examTip: "Significant BD response = ≥12% AND ≥200 mL. BOTH must be met. Practice calculating: (Post-Pre)/Pre × 100 for percent. Post-Pre for absolute mL change.",
    safetyPearl: "A negative BD response does not mean bronchodilators are useless — some patients have symptomatic improvement without meeting spirometric criteria. Clinical response should also guide therapy decisions.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "bronchodilator response calculation",
    pharmacologyCategory: "Bronchodilator Response Interpretation"
  },
  {
    id: "rrt-pharm-101",
    stem: "A patient with suspected cyanide poisoning from a house fire presents with altered mental status, tachycardia, and metabolic acidosis. Which antidote should be administered?",
    options: [
      "Hydroxocobalamin (Cyanokit) 5 g IV",
      "N-acetylcysteine (Mucomyst) IV",
      "Naloxone (Narcan) 2 mg IV",
      "Flumazenil (Romazicon) 0.5 mg IV"
    ],
    correctIndex: 0,
    rationale: "Hydroxocobalamin (vitamin B12a precursor) directly binds cyanide to form cyanocobalamin (vitamin B12), which is renally excreted. It is the preferred antidote for cyanide poisoning, especially in smoke inhalation victims who may have concurrent CO poisoning (unlike the older cyanide antidote kit which contains methemoglobin-inducing agents).",
    distractorExplanations: [
      "NAC is the antidote for acetaminophen overdose, not cyanide poisoning.",
      "Naloxone reverses opioids, not cyanide.",
      "Flumazenil reverses benzodiazepines, not cyanide."
    ],
    clinicalConcept: "House fire smoke contains both CO and cyanide (from burning plastics/synthetics). Hydroxocobalamin can be safely used with concurrent CO poisoning, unlike the sodium nitrite/thiosulfate kit which induces methemoglobinemia.",
    examTip: "House fire + metabolic acidosis + altered mental status = consider BOTH CO and cyanide poisoning. Treatment: 100% O2 (CO) + hydroxocobalamin (cyanide).",
    safetyPearl: "Hydroxocobalamin turns skin, urine, and mucous membranes red/dark red for up to 7 days. Warn the patient and team. It can also interfere with colorimetric lab assays.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "cyanide antidotes",
    pharmacologyCategory: "Emergency Medication Recognition"
  },
  {
    id: "rrt-pharm-102",
    stem: "A patient with chronic kidney disease develops fluid overload with pulmonary edema. The physician orders IV furosemide 80 mg. After 2 hours, urine output is only 50 mL. What is the term for this diminished diuretic response?",
    options: [
      "Diuretic resistance, often seen in CKD due to reduced drug delivery to the tubules",
      "Diuretic allergy",
      "Drug tolerance from chronic use",
      "Normal expected response for this dose"
    ],
    correctIndex: 0,
    rationale: "Diuretic resistance in CKD occurs because: (1) reduced renal blood flow decreases drug delivery to the loop of Henle, (2) accumulated organic acids compete with furosemide for tubular secretion, and (3) nephron loss reduces the number of functional sodium transporters available to block.",
    distractorExplanations: [
      "This is a pharmacokinetic/pharmacodynamic issue, not an allergic reaction.",
      "While chronic diuretic use can cause braking phenomenon, the primary issue in CKD is impaired drug delivery and reduced functional nephrons.",
      "50 mL urine output after 80 mg IV furosemide in 2 hours is inadequate and indicates impaired diuretic response."
    ],
    clinicalConcept: "Strategies for diuretic resistance: increase dose (CKD patients often need 2-4× normal doses), continuous infusion, add a thiazide diuretic for sequential nephron blockade, or consider ultrafiltration.",
    examTip: "CKD + pulmonary edema + poor diuretic response = diuretic resistance. Solutions: dose escalation, continuous infusion, combination diuretics, or ultrafiltration/dialysis.",
    safetyPearl: "In severe diuretic resistance with life-threatening pulmonary edema, continuous renal replacement therapy (CRRT) or hemodialysis with ultrafiltration may be needed for fluid removal.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "diuretic resistance",
    pharmacologyCategory: "Fluid Overload/Diuretic Monitoring"
  },
  {
    id: "rrt-pharm-103",
    stem: "A patient on warfarin develops massive hemoptysis. Which medication should be administered to reverse warfarin's anticoagulant effect?",
    options: [
      "Vitamin K (phytonadione) IV and/or fresh frozen plasma (FFP)/PCC",
      "Protamine sulfate",
      "Aminocaproic acid",
      "Desmopressin (DDAVP)"
    ],
    correctIndex: 0,
    rationale: "Warfarin inhibits vitamin K-dependent clotting factors (II, VII, IX, X). Vitamin K (IV phytonadione) restores factor production (onset 6-24 hours) while FFP or 4-factor prothrombin complex concentrate (PCC) provides immediate factor replacement for life-threatening bleeding.",
    distractorExplanations: [
      "Protamine reverses heparin, not warfarin. Different anticoagulant, different reversal agent.",
      "Aminocaproic acid is an antifibrinolytic used for excessive fibrinolysis, not warfarin reversal.",
      "DDAVP enhances platelet function (von Willebrand factor release) and is used for mild hemophilia A and uremic bleeding, not warfarin reversal."
    ],
    clinicalConcept: "Anticoagulant reversal agents: warfarin → vitamin K + FFP/PCC. Heparin → protamine. Direct oral anticoagulants (DOACs): dabigatran → idarucizumab (Praxbind); factor Xa inhibitors → andexanet alfa (Andexxa).",
    examTip: "Warfarin reversal = vitamin K. Heparin reversal = protamine. This is a critical medication safety question. Know reversal agents for major anticoagulants.",
    safetyPearl: "IV vitamin K should be given slowly (risk of anaphylactoid reaction). For life-threatening bleeding, 4-factor PCC is preferred over FFP due to faster administration, smaller volume, and more predictable factor levels.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "anticoagulant reversal",
    pharmacologyCategory: "Emergency Medication Recognition"
  },
  {
    id: "rrt-pharm-104",
    stem: "A physician orders a nicotine replacement patch for a COPD patient who wants to quit smoking. Which statement about nicotine replacement therapy (NRT) is correct?",
    options: [
      "NRT doubles the chance of successful smoking cessation compared to placebo",
      "NRT is contraindicated in all COPD patients",
      "Patients must continue smoking while using NRT",
      "NRT patches deliver nicotine via the pulmonary route"
    ],
    correctIndex: 0,
    rationale: "Meta-analyses consistently show that nicotine replacement therapy (patches, gum, lozenges, inhaler, nasal spray) approximately doubles the chance of successful long-term smoking cessation compared to placebo. Combining NRT with counseling further improves success rates.",
    distractorExplanations: [
      "NRT is not contraindicated in COPD patients — smoking cessation is the single most effective intervention for slowing COPD progression.",
      "Patients should set a quit date and stop smoking when starting NRT. Concurrent smoking and NRT increases nicotine toxicity risk.",
      "Nicotine patches deliver nicotine transdermally (through the skin), not through the lungs."
    ],
    clinicalConcept: "Smoking cessation in COPD is the ONLY intervention proven to slow the rate of FEV1 decline. Pharmacotherapy options: NRT, varenicline (Chantix), bupropion (Zyban). Combination therapy (NRT + varenicline) may be most effective.",
    examTip: "Smoking cessation = most important COPD intervention. Know the pharmacotherapy options and their mechanisms. NRT = nicotine replacement. Varenicline = partial nicotinic agonist. Bupropion = dopamine/norepinephrine reuptake inhibitor.",
    safetyPearl: "NRT patches should be removed before MRI. Rotate patch application sites to prevent skin irritation. If vivid dreams occur, remove the patch at bedtime.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "smoking cessation pharmacology",
    pharmacologyCategory: "Route of Administration"
  },
  {
    id: "rrt-pharm-105",
    stem: "A patient with COPD and cor pulmonale is prescribed a phosphodiesterase-5 inhibitor (sildenafil). What is the respiratory indication?",
    options: [
      "Treatment of pulmonary arterial hypertension by relaxing pulmonary vascular smooth muscle",
      "Bronchodilation for COPD",
      "Mucolytic therapy for thick secretions",
      "Anti-inflammatory treatment for airway inflammation"
    ],
    correctIndex: 0,
    rationale: "Sildenafil (Revatio) inhibits phosphodiesterase-5, which breaks down cGMP in pulmonary vascular smooth muscle. Increased cGMP causes vasodilation, reducing pulmonary vascular resistance and right ventricular afterload in pulmonary hypertension.",
    distractorExplanations: [
      "Sildenafil does not act on airway smooth muscle beta-2 receptors — it is not a bronchodilator.",
      "Sildenafil has no mucolytic properties.",
      "Sildenafil works on vascular smooth muscle, not airway inflammation."
    ],
    clinicalConcept: "PDE5 inhibitors (sildenafil/Revatio, tadalafil/Adcirca) target the same nitric oxide-cGMP pathway as inhaled nitric oxide. They provide oral, continuous pulmonary vasodilation without the need for specialized delivery systems.",
    examTip: "PDE5 inhibitors for pulmonary hypertension: sildenafil (Revatio, not Viagra — same drug, different brand/dose for PAH). Tadalafil (Adcirca) is the other option. Both are oral PDE5 inhibitors.",
    safetyPearl: "PDE5 inhibitors are contraindicated with nitrates (nitroglycerin, isosorbide) due to severe additive hypotension. Ask about ALL medications including PRN and recreational drugs before prescribing.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "PDE5 inhibitors for PAH",
    pharmacologyCategory: "Route of Administration"
  },
  {
    id: "rrt-pharm-106",
    stem: "A pediatric patient with acute croup receives dexamethasone 0.6 mg/kg PO. Four hours later, the stridor has not improved. What additional treatment should the RT recommend?",
    options: [
      "Administer racemic epinephrine 0.5 mL of 2.25% via nebulizer for more immediate relief",
      "Repeat the dexamethasone dose immediately",
      "Intubate the patient",
      "Administer antibiotics for bacterial tracheitis"
    ],
    correctIndex: 0,
    rationale: "While dexamethasone takes 2-6 hours for full effect, if stridor persists at 4 hours, racemic epinephrine via nebulizer provides rapid mucosal vasoconstriction (onset 5-10 minutes) to bridge the gap. This does not replace the steroid but adds immediate relief while the anti-inflammatory effect develops.",
    distractorExplanations: [
      "Repeating dexamethasone within 24 hours of an appropriate dose is generally unnecessary and increases side effect risk.",
      "Intubation is reserved for severe cases not responding to medical management. A trial of racemic epinephrine should be attempted first.",
      "The presentation describes viral croup, not bacterial tracheitis. Antibiotics are not indicated without evidence of bacterial infection."
    ],
    clinicalConcept: "Croup (laryngotracheobronchitis) is usually viral (parainfluenza). Westley croup score assesses severity: stridor at rest, retractions, air entry, cyanosis, and level of consciousness.",
    examTip: "Croup severity assessment: mild (stridor with agitation only) → moderate (stridor at rest) → severe (stridor + distress + altered LOC). Treatment escalation follows severity.",
    safetyPearl: "After racemic epinephrine, observe for rebound stridor (2-4 hours). If the child required racemic epinephrine, admission or extended observation is recommended.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "croup escalation therapy",
    pharmacologyCategory: "Pediatric Respiratory Pharmacology"
  },
  {
    id: "rrt-pharm-107",
    stem: "A respiratory therapist prepares to administer nebulized amphotericin B to a lung transplant patient. What is the primary purpose of this treatment?",
    options: [
      "Prophylaxis against invasive pulmonary aspergillosis in immunosuppressed patients",
      "Treatment of bacterial pneumonia",
      "Bronchodilation for post-transplant bronchospasm",
      "Prevention of organ rejection"
    ],
    correctIndex: 0,
    rationale: "Inhaled amphotericin B is used as antifungal prophylaxis in lung transplant recipients, who are highly immunosuppressed and at significant risk for invasive pulmonary aspergillosis. The inhaled route delivers high local antifungal concentrations to the airways with minimal systemic toxicity.",
    distractorExplanations: [
      "Amphotericin B is an antifungal, not an antibiotic. Bacterial pneumonia requires antibacterial agents.",
      "Amphotericin B is not a bronchodilator. It may actually cause bronchospasm (pre-treat with bronchodilator).",
      "Rejection prevention uses immunosuppressants (tacrolimus, mycophenolate, prednisone), not antifungals."
    ],
    clinicalConcept: "Post-transplant fungal infections are a leading cause of morbidity and mortality. Aspergillus species are the most common fungal pathogens, particularly involving the bronchial anastomosis site.",
    examTip: "Inhaled amphotericin B = antifungal prophylaxis in immunosuppressed patients (transplant, neutropenic). Pre-treat with bronchodilator. Use in well-ventilated area.",
    safetyPearl: "Inhaled amphotericin can cause severe bronchospasm, nausea, and bad taste. Always pre-treat with bronchodilator. IV amphotericin B is nephrotoxic — the inhaled route avoids this systemic toxicity.",
    difficulty: 5,
    category: "Respiratory Pharmacology",
    topic: "inhaled antifungals",
    pharmacologyCategory: "Route of Administration"
  },
  {
    id: "rrt-pharm-108",
    stem: "A ventilated patient on continuous albuterol develops a serum potassium of 2.8 mEq/L and new PVCs on the cardiac monitor. What is the priority action?",
    options: [
      "Notify physician, hold continuous albuterol, and prepare for IV potassium replacement",
      "Continue albuterol and increase the cardiac monitor alarm limits",
      "Switch to ipratropium and monitor",
      "Administer oral potassium supplements only"
    ],
    correctIndex: 0,
    rationale: "Serum potassium of 2.8 mEq/L is critically low. Combined with new PVCs (premature ventricular contractions), this indicates a dangerous cardiac arrhythmia risk from hypokalemia. The priority is to notify the physician, temporarily hold the continuous albuterol (which is causing the hypokalemia via beta-2 intracellular K+ shift), and prepare for IV potassium replacement.",
    distractorExplanations: [
      "Increasing alarm limits ignores a dangerous clinical finding. New PVCs with hypokalemia require immediate intervention.",
      "While switching to ipratropium addresses the potassium issue, the critical potassium level requires active replacement, not just drug substitution.",
      "Oral potassium is too slow for critical hypokalemia with cardiac arrhythmia. IV replacement is needed urgently."
    ],
    clinicalConcept: "Hypokalemia promotes cardiac arrhythmias by increasing the resting membrane potential, prolonging repolarization (long QT), and creating re-entrant circuits (PVCs → ventricular tachycardia → ventricular fibrillation).",
    examTip: "Critical K+ <3.0 + cardiac arrhythmia = emergency. Hold the causative agent (albuterol), replace IV, and monitor ECG. This tests clinical priority-setting.",
    safetyPearl: "IV potassium replacement should not exceed 10-20 mEq/hour peripherally (risk of phlebitis and cardiac arrest). Central line access allows faster rates. Always use infusion pump, never bolus.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "critical electrolyte emergency",
    pharmacologyCategory: "Fluid Overload/Diuretic Monitoring"
  },
  {
    id: "rrt-pharm-109",
    stem: "A physician orders zafirlukast (Accolate) for a patient with aspirin-exacerbated respiratory disease (AERD). Why is this medication particularly appropriate for this condition?",
    options: [
      "AERD involves overproduction of leukotrienes, and zafirlukast blocks leukotriene receptors",
      "Zafirlukast directly blocks the aspirin receptor",
      "AERD only responds to oral bronchodilators",
      "Zafirlukast has antihistamine properties"
    ],
    correctIndex: 0,
    rationale: "In aspirin-exacerbated respiratory disease (AERD/Samter's triad), COX-1 inhibition by aspirin/NSAIDs shunts arachidonic acid metabolism toward the 5-lipoxygenase pathway, causing overproduction of cysteinyl leukotrienes. Leukotriene receptor antagonists (zafirlukast, montelukast) block CysLT1 receptors, directly addressing this pathophysiology.",
    distractorExplanations: [
      "There is no 'aspirin receptor.' Aspirin inhibits cyclooxygenase (COX) enzymes.",
      "AERD responds to multiple medication classes. Leukotriene modifiers are particularly helpful due to the disease mechanism.",
      "Zafirlukast is a leukotriene receptor antagonist, not an antihistamine."
    ],
    clinicalConcept: "Samter's triad: nasal polyps + asthma + aspirin/NSAID sensitivity. The leukotriene pathway is central to the pathophysiology, making LTRAs and 5-LOX inhibitors (zileuton) particularly effective.",
    examTip: "Aspirin-sensitive asthma = leukotriene overproduction = LTRA (montelukast, zafirlukast) or 5-LOX inhibitor (zileuton) are especially indicated. This is a mechanism-matching question.",
    safetyPearl: "Zafirlukast can cause hepatotoxicity (rare but serious). Monitor liver function tests. It also has drug interactions due to CYP2C9 inhibition (increases warfarin levels).",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "leukotriene modifiers in AERD",
    pharmacologyCategory: "Contraindications"
  },
  {
    id: "rrt-pharm-110",
    stem: "A patient presents to the ED after a scuba diving accident with suspected arterial gas embolism. What is the definitive treatment?",
    options: [
      "Hyperbaric oxygen therapy (100% O2 at 2.0-2.8 ATA)",
      "Standard oxygen via non-rebreather mask",
      "IV furosemide for bubble dissolution",
      "Chest tube insertion"
    ],
    correctIndex: 0,
    rationale: "Hyperbaric oxygen therapy (HBO) is the definitive treatment for arterial gas embolism and decompression sickness. Increased ambient pressure reduces bubble size (Boyle's law), while 100% O2 accelerates nitrogen washout and creates a diffusion gradient that dissolves remaining bubbles.",
    distractorExplanations: [
      "Standard NRB oxygen is first aid but not definitive treatment. HBO provides both pressure reduction and O2 diffusion benefits.",
      "Diuretics do not dissolve gas bubbles.",
      "Chest tubes treat pneumothorax, not gas embolism."
    ],
    clinicalConcept: "Boyle's law (P₁V₁ = P₂V₂): increasing ambient pressure (HBO) decreases bubble volume. Henry's law: increased pressure increases gas solubility, helping dissolve nitrogen bubbles back into solution.",
    examTip: "Hyperbaric O2 indications: arterial gas embolism, decompression sickness, CO poisoning, gas gangrene, problem wounds, necrotizing fasciitis. Know the primary gas law mechanisms.",
    safetyPearl: "HBO contraindications: untreated pneumothorax (risk of tension pneumothorax), concurrent bleomycin therapy (pulmonary O2 toxicity), and certain medications that sensitize to O2 toxicity.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "hyperbaric oxygen therapy",
    pharmacologyCategory: "Emergency Medication Recognition"
  },
  {
    id: "rrt-pharm-111",
    stem: "A patient with chronic asthma on high-dose ICS develops dysphonia (hoarseness). What is the cause and what should be recommended?",
    options: [
      "Steroid myopathy of the vocal cords from ICS deposition; recommend spacer use and dose reduction if possible",
      "Vocal cord paralysis requiring surgery",
      "Allergic laryngeal edema requiring epinephrine",
      "Infection of the larynx requiring antibiotics"
    ],
    correctIndex: 0,
    rationale: "Dysphonia (hoarseness) is a common local side effect of inhaled corticosteroids caused by steroid-induced myopathy of the laryngeal muscles and mucosal changes from direct ICS deposition on the vocal cords. Using a spacer reduces oropharyngeal/laryngeal deposition, and the lowest effective ICS dose should be used.",
    distractorExplanations: [
      "This is reversible steroid-induced dysphonia, not vocal cord paralysis requiring surgery.",
      "Dysphonia from ICS is not an allergic reaction. There is no laryngeal edema requiring emergency treatment.",
      "This is a local steroid effect, not an infection."
    ],
    clinicalConcept: "ICS local side effects: dysphonia (up to 50% of patients), oral candidiasis (5-10%), cough, throat irritation. All are reduced by using a spacer and rinsing the mouth after use.",
    examTip: "ICS + hoarseness = steroid myopathy of vocal cords. Management: spacer, rinse/spit, try dose reduction or switch to different ICS with lower oropharyngeal deposition (ciclesonide).",
    safetyPearl: "Ciclesonide (Alvesco) is a prodrug activated in the lungs, resulting in less oropharyngeal deposition and fewer local side effects (dysphonia, thrush) compared to other ICS formulations.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "ICS local side effects",
    pharmacologyCategory: "Side Effect Recognition"
  },
  {
    id: "rrt-pharm-112",
    stem: "A patient with acute severe hyperkalemia (K+ 7.2 mEq/L) has peaked T waves on ECG. The physician orders calcium gluconate, insulin/dextrose, and nebulized albuterol. What is albuterol's role in hyperkalemia treatment?",
    options: [
      "Beta-2 stimulation drives potassium intracellularly, temporarily lowering serum K+",
      "Albuterol directly binds and eliminates potassium",
      "Albuterol improves cardiac conduction independent of potassium",
      "There is no role for albuterol in hyperkalemia"
    ],
    correctIndex: 0,
    rationale: "High-dose nebulized albuterol (10-20 mg via nebulizer, 4-8× the standard dose) stimulates beta-2 receptors, activating the Na+/K+-ATPase pump and driving potassium from the extracellular space into cells. This can reduce serum K+ by 0.5-1.5 mEq/L within 30 minutes.",
    distractorExplanations: [
      "Albuterol does not bind or eliminate potassium. It redistributes K+ intracellularly (temporizing measure).",
      "Albuterol's cardiac effects in hyperkalemia are through K+ redistribution, not direct conduction improvement. Calcium gluconate provides direct cardiac membrane stabilization.",
      "Albuterol is a well-established component of hyperkalemia treatment protocols."
    ],
    clinicalConcept: "Hyperkalemia treatment steps: (1) Calcium gluconate = stabilize myocardium, (2) Insulin/dextrose + albuterol = shift K+ intracellularly, (3) Kayexalate/patiromer/sodium bicarbonate = eliminate K+ from body, (4) Dialysis for severe/refractory cases.",
    examTip: "Albuterol for hyperkalemia uses 10-20 mg (4-8× normal dose). Same mechanism as albuterol-induced hypokalemia in asthma, but used therapeutically here.",
    safetyPearl: "High-dose albuterol for hyperkalemia causes significant tachycardia (HR 120-140). Monitor ECG continuously. K+ shift is temporary (2-4 hours) — definitive treatment (dialysis, K+ binders) is needed.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "albuterol in hyperkalemia",
    pharmacologyCategory: "Emergency Medication Recognition"
  },
  {
    id: "rrt-pharm-113",
    stem: "A physician orders zileuton (Zyflo) for a patient with moderate persistent asthma. What mechanism distinguishes this from montelukast?",
    options: [
      "Zileuton inhibits 5-lipoxygenase (prevents leukotriene SYNTHESIS), while montelukast blocks leukotriene receptors",
      "Zileuton is a bronchodilator while montelukast is anti-inflammatory",
      "Zileuton works faster than montelukast",
      "There is no mechanistic difference"
    ],
    correctIndex: 0,
    rationale: "Zileuton (Zyflo) inhibits the 5-lipoxygenase enzyme, blocking the production of ALL leukotrienes (LTB4, LTC4, LTD4, LTE4). Montelukast blocks only the CysLT1 receptor (blocking LTC4/D4/E4 effects). Zileuton has broader leukotriene pathway inhibition.",
    distractorExplanations: [
      "Both are anti-inflammatory, not bronchodilators. They work through the leukotriene pathway by different mechanisms.",
      "Both have similar onset of weeks for full anti-inflammatory effect.",
      "The mechanisms are distinctly different — synthesis inhibition vs. receptor blockade."
    ],
    clinicalConcept: "The leukotriene pathway: arachidonic acid → 5-lipoxygenase → LTA4 → LTB4 (neutrophil chemotaxis) + LTC4/D4/E4 (bronchoconstriction, mucus, edema). Zileuton blocks the enzyme; LTRAs block the receptor.",
    examTip: "Zileuton = 5-LOX inhibitor (blocks leukotriene synthesis). Montelukast/zafirlukast = CysLT1 receptor antagonists (block leukotriene action). Zileuton requires liver function monitoring.",
    safetyPearl: "Zileuton requires hepatic monitoring (LFTs at baseline, monthly for 3 months, then q2-3 months) due to hepatotoxicity risk. It also interacts with warfarin and theophylline via CYP450 inhibition.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "leukotriene pathway drugs",
    pharmacologyCategory: "Route of Administration"
  },
  {
    id: "rrt-pharm-114",
    stem: "A preterm neonate at 26 weeks GA is being considered for antenatal corticosteroid therapy. The mother has not yet delivered. What is the purpose of administering betamethasone to the mother?",
    options: [
      "To accelerate fetal lung maturation and surfactant production before preterm delivery",
      "To treat the mother's asthma",
      "To prevent neonatal infection",
      "To delay preterm labor"
    ],
    correctIndex: 0,
    rationale: "Antenatal corticosteroids (betamethasone 12 mg IM × 2 doses, 24 hours apart, or dexamethasone 6 mg IM × 4 doses, 12 hours apart) cross the placenta and accelerate fetal lung maturation by inducing surfactant production by Type II alveolar cells, reducing RDS severity, neonatal mortality, and IVH.",
    distractorExplanations: [
      "The purpose is fetal lung maturation, not maternal asthma treatment (though different steroids might treat both).",
      "Antenatal steroids do not prevent infection — they actually slightly increase maternal infection risk.",
      "Tocolytics (not steroids) are used to delay preterm labor to allow time for steroids to take effect."
    ],
    clinicalConcept: "Maximum benefit occurs 24-48 hours after completion of the steroid course. Benefit starts ~24 hours after the first dose. Recommended for all pregnancies at risk for preterm delivery between 24-34 weeks GA.",
    examTip: "Antenatal steroids = betamethasone or dexamethasone given to MOTHER to mature FETAL lungs. Optimal timing: 24-48 hours before delivery. Indicated at 24-34 weeks GA.",
    safetyPearl: "Antenatal steroids may temporarily worsen maternal hyperglycemia in diabetic mothers. Monitor blood glucose closely. A single rescue course may be considered if >14 days have elapsed since the first course.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "antenatal steroids",
    pharmacologyCategory: "Neonatal Concepts"
  },
  {
    id: "rrt-pharm-115",
    stem: "A patient with asthma develops chest tightness 15 minutes after starting a new biologic therapy infusion. The nurse notes urticaria and BP has dropped to 85/50. What is the first medication to administer?",
    options: [
      "Epinephrine 0.3-0.5 mg IM in the anterolateral thigh",
      "Diphenhydramine 50 mg IV",
      "Methylprednisolone 125 mg IV",
      "Normal saline bolus 1 L"
    ],
    correctIndex: 0,
    rationale: "This presentation (medication infusion → urticaria + hypotension + chest tightness) is anaphylaxis. Epinephrine IM is ALWAYS the first medication for anaphylaxis regardless of the trigger. It addresses all components: bronchospasm (beta-2), hypotension (alpha-1), cardiac output (beta-1), and mast cell stabilization.",
    distractorExplanations: [
      "Diphenhydramine treats urticaria but does NOT reverse hypotension or bronchospasm — it is adjunctive, not first-line.",
      "Corticosteroids take 4-6 hours for onset and prevent biphasic reaction — they are not first-line for acute anaphylaxis.",
      "Fluid bolus is important for hypotension in anaphylaxis but is NOT the first intervention. Epinephrine addresses the root cause."
    ],
    clinicalConcept: "Anaphylaxis diagnostic criteria: rapid onset involving skin/mucosal tissue (urticaria) PLUS respiratory compromise OR hemodynamic instability after exposure to a likely allergen.",
    examTip: "Anaphylaxis = epinephrine IM FIRST, always. Then: IV fluids, antihistamines, steroids, albuterol for persistent bronchospasm. Delayed epinephrine = worse outcomes.",
    safetyPearl: "IM injection in the anterolateral thigh provides faster absorption than deltoid or SC routes. Monitor for biphasic reaction (recurrence 4-12 hours later). Prescribe EpiPen for future episodes.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "infusion anaphylaxis",
    pharmacologyCategory: "Emergency Medication Recognition"
  },
  {
    id: "rrt-pharm-116",
    stem: "A COPD patient on oxygen therapy via nasal cannula at 2 L/min is prescribed acetazolamide (Diamox) for metabolic alkalosis. What is the respiratory relevance of this medication?",
    options: [
      "Acetazolamide is a carbonic anhydrase inhibitor that causes mild metabolic acidosis, stimulating respiratory drive",
      "Acetazolamide is a bronchodilator for COPD",
      "Acetazolamide increases oxygen-carrying capacity of hemoglobin",
      "Acetazolamide reduces CO2 production"
    ],
    correctIndex: 0,
    rationale: "Acetazolamide inhibits carbonic anhydrase, leading to bicarbonate diuresis and mild metabolic acidosis. In COPD patients with chronic respiratory acidosis who develop metabolic alkalosis (often from diuretics), the alkalosis suppresses respiratory drive. Acetazolamide corrects the alkalosis, restoring ventilatory stimulus.",
    distractorExplanations: [
      "Acetazolamide has no bronchodilator properties.",
      "Acetazolamide does not affect hemoglobin's oxygen-carrying capacity.",
      "Acetazolamide does not reduce CO2 production — it affects bicarbonate handling in the kidney."
    ],
    clinicalConcept: "In COPD patients dependent on hypoxic drive, metabolic alkalosis (from diuretics, NG suction, etc.) further suppresses ventilation. Acetazolamide creates a compensatory acidosis that restores the drive to breathe.",
    examTip: "Acetazolamide uses in respiratory: (1) correct metabolic alkalosis suppressing ventilatory drive, (2) altitude sickness prevention, (3) idiopathic intracranial hypertension (reduces CSF production).",
    safetyPearl: "Acetazolamide is a sulfonamide derivative — contraindicated in patients with sulfa allergy. It can cause paresthesias, metabolic acidosis, and kidney stones (citrate urine to prevent).",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "carbonic anhydrase inhibitors",
    pharmacologyCategory: "Fluid Overload/Diuretic Monitoring"
  },
  {
    id: "rrt-pharm-117",
    stem: "Which of the following inhaler devices does NOT require hand-breath coordination by the patient?",
    options: [
      "Dry powder inhaler (DPI)",
      "Standard pressurized metered-dose inhaler (pMDI) without spacer",
      "Soft mist inhaler (Respimat) without spacer",
      "Manual squeeze-bulb nebulizer"
    ],
    correctIndex: 0,
    rationale: "DPIs are breath-actuated — the patient's inhalation triggers drug release, eliminating the need for hand-breath coordination. The patient simply loads the dose, exhales away from the device, and inhales deeply through the mouthpiece. The inspiratory effort itself disperses the powder.",
    distractorExplanations: [
      "Standard pMDIs require precise coordination between canister actuation and inhalation.",
      "The Respimat generates a slow-moving mist but still benefits from coordinated inhalation timing without a spacer.",
      "Manual squeeze-bulb nebulizers require coordination of squeezing with inhalation."
    ],
    clinicalConcept: "Device selection should match patient capability: poor coordination → spacer + MDI or DPI. Weak inspiratory effort → SVN or pMDI + spacer (not DPI). Young children → SVN + mask or pMDI + spacer + mask.",
    examTip: "DPI = no coordination needed BUT requires adequate inspiratory flow (>30 L/min). MDI = coordination needed (use spacer to eliminate). SVN = no coordination or effort needed.",
    safetyPearl: "Do not prescribe DPIs for patients with severely reduced inspiratory effort (COPD with very low FEV1, neuromuscular disease, young children) as they may not generate adequate flow to disperse the powder.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "device coordination requirements",
    pharmacologyCategory: "Device Selection"
  },
  {
    id: "rrt-pharm-118",
    stem: "A physician orders a bronchodilator for a premature neonate with wheezing. Which beta-2 agonist is typically used and at what dose?",
    options: [
      "Albuterol 1.25 mg (half the pediatric dose) via nebulizer with face mask",
      "Salmeterol 50 mcg via DPI",
      "Albuterol 2.5 mg (full adult dose) via nebulizer",
      "Formoterol 12 mcg via DPI"
    ],
    correctIndex: 0,
    rationale: "For premature neonates and infants, albuterol 1.25 mg (0.5 mL of 0.5% solution or 2.5 mL of 0.5 mg/mL unit dose) via SVN with an appropriately-sized face mask is the standard dose — approximately half the standard pediatric/adult dose of 2.5 mg. LABAs are not used in neonates.",
    distractorExplanations: [
      "Salmeterol is a LABA not used in neonates/infants. DPIs require inspiratory flows neonates cannot generate.",
      "2.5 mg is the standard pediatric dose for children >12 months. Neonates receive a reduced dose.",
      "Formoterol is a LABA not approved for neonatal use and requires inspiratory effort for DPI activation."
    ],
    clinicalConcept: "Beta-2 agonist dosing in neonates is based on weight and clinical response. Neonatal airways are small and highly reactive. Even low doses can cause significant tachycardia in neonates.",
    examTip: "Neonatal albuterol: 1.25 mg or 0.15 mg/kg via SVN. Pediatric standard: 2.5 mg. Adult: 2.5 mg (same as pediatric). Higher doses (5 mg) for severe exacerbations.",
    safetyPearl: "Monitor heart rate closely in neonates receiving beta-2 agonists. Target HR should remain <180 bpm. Report paradoxical bronchospasm (rare but possible with cold nebulizer solution in reactive neonatal airways).",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "neonatal bronchodilator dosing",
    pharmacologyCategory: "Pediatric Respiratory Pharmacology"
  },
  {
    id: "rrt-pharm-119",
    stem: "A patient's pre-bronchodilator FVC is 3.2 L and post-bronchodilator FVC is 3.7 L. What does this suggest?",
    options: [
      "A 15.6% improvement in FVC suggesting significant air trapping reversal with bronchodilator",
      "Normal spirometry with no change",
      "The patient has restrictive lung disease",
      "The bronchodilator has no effect"
    ],
    correctIndex: 0,
    rationale: "Percent improvement = (3.7 - 3.2) / 3.2 × 100 = 15.6% with 500 mL absolute increase. Significant FVC improvement after bronchodilator suggests air trapping reversal — the bronchodilator allowed previously trapped air to be exhaled, increasing the measured FVC. This is commonly seen in COPD with hyperinflation.",
    distractorExplanations: [
      "500 mL improvement in FVC is a meaningful change, not 'no change.'",
      "FVC improvement with bronchodilator suggests obstructive physiology with air trapping, not restriction.",
      "The bronchodilator clearly had a measurable effect on FVC."
    ],
    clinicalConcept: "In obstructive diseases with air trapping, bronchodilator response may show more improvement in FVC than FEV1 because the primary benefit is reducing trapped gas volume rather than increasing flow rates.",
    examTip: "Significant BD response can be shown by FEV1 OR FVC improvement (≥12% AND ≥200 mL). FVC improvement specifically suggests air trapping reversal. FEV1 improvement suggests airflow obstruction reversal.",
    safetyPearl: "Inspiratory capacity (IC) change after bronchodilator is an even better marker of air trapping reversal than FVC in COPD patients with hyperinflation.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "FVC bronchodilator response",
    pharmacologyCategory: "Bronchodilator Response Interpretation"
  },
  {
    id: "rrt-pharm-120",
    stem: "A physician orders sodium bicarbonate 50 mEq IV push for a patient in cardiac arrest with severe metabolic acidosis. When is bicarb indicated during ACLS?",
    options: [
      "Only for known or suspected pre-existing metabolic acidosis, hyperkalemia, or tricyclic antidepressant overdose",
      "As routine first-line treatment for all cardiac arrests",
      "Immediately after the first dose of epinephrine",
      "For respiratory acidosis during cardiac arrest"
    ],
    correctIndex: 0,
    rationale: "Sodium bicarbonate is NOT routinely recommended in cardiac arrest. It is indicated for specific situations: pre-existing metabolic acidosis (DKA, lactic acidosis), hyperkalemia-related arrest, and tricyclic antidepressant overdose. Routine use can worsen intracellular acidosis and shift the oxyhemoglobin dissociation curve leftward.",
    distractorExplanations: [
      "Bicarb is not routine in ACLS — adequate ventilation and chest compressions address the acidosis of cardiac arrest.",
      "The timing is not related to epinephrine. Bicarb is given for specific indications only.",
      "Respiratory acidosis is treated with improved ventilation, not bicarbonate."
    ],
    clinicalConcept: "Bicarbonate generates CO2 when buffering acid (HCO3- + H+ → H2CO3 → CO2 + H2O). If ventilation is inadequate, the CO2 crosses cell membranes and worsens intracellular acidosis.",
    examTip: "Bicarb in ACLS: NOT routine. Specific indications: known metabolic acidosis, hyperkalemia, TCA overdose, prolonged arrest. The answer to 'should we give bicarb?' is usually 'not routinely.'",
    safetyPearl: "Sodium bicarbonate is incompatible with many ACLS drugs. Flush the IV line before and after administration. It can cause extravasation injury (tissue necrosis) if given outside the vein.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "bicarbonate in ACLS",
    pharmacologyCategory: "Emergency Medication Recognition"
  },
  {
    id: "rrt-pharm-121",
    stem: "A ventilated ARDS patient on FiO2 1.0 and PEEP 18 cmH2O develops a sudden increase in peak inspiratory pressure from 35 to 55 cmH2O. Before adjusting medications, what should the RT assess FIRST?",
    options: [
      "Assess for mechanical causes: mucus plugging, ETT kinking, pneumothorax, or patient biting the tube",
      "Increase sedation and paralytic agents immediately",
      "Add another bronchodilator treatment",
      "Decrease PEEP to reduce pressure"
    ],
    correctIndex: 0,
    rationale: "A sudden increase in PIP should prompt immediate assessment for mechanical causes before adjusting pharmacologic therapy. Common causes include: mucus plugging (suction needed), ETT kinking or migration, tension pneumothorax (emergency), patient-ventilator dyssynchrony, or bronchospasm.",
    distractorExplanations: [
      "Increasing sedation/paralysis before identifying the cause could mask a life-threatening mechanical problem (pneumothorax).",
      "Bronchodilator may help if bronchospasm is the cause, but mechanical causes must be ruled out first.",
      "Decreasing PEEP could worsen hypoxemia in ARDS. The underlying cause of the pressure increase must be identified."
    ],
    clinicalConcept: "Troubleshooting high PIP: check plateau pressure. If PIP high but plateau normal = increased airway resistance (bronchospasm, secretions, ETT). If both PIP and plateau high = decreased compliance (pneumothorax, atelectasis, ARDS progression).",
    examTip: "High PIP + normal Pplat = resistance problem (ETT, secretions, bronchospasm). High PIP + high Pplat = compliance problem (pneumothorax, edema, ARDS). Always assess before treating.",
    safetyPearl: "Tension pneumothorax is a medical emergency. Signs: sudden high PIP, absent breath sounds unilaterally, hypotension, tracheal deviation. Requires immediate needle decompression, not medication changes.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "ventilator troubleshooting before drugs",
    pharmacologyCategory: "Physician-Order Clarification"
  },
  {
    id: "rrt-pharm-122",
    stem: "A patient with pulmonary fibrosis is prescribed nintedanib (Ofev). What is the primary mechanism of action?",
    options: [
      "Tyrosine kinase inhibitor that blocks fibroblast growth factor, VEGF, and PDGF receptors",
      "Bronchodilator for airflow obstruction",
      "Anti-inflammatory steroid",
      "Mucolytic agent"
    ],
    correctIndex: 0,
    rationale: "Nintedanib (Ofev) is a triple tyrosine kinase inhibitor that blocks fibroblast growth factor receptor (FGFR), vascular endothelial growth factor receptor (VEGFR), and platelet-derived growth factor receptor (PDGFR). These receptors drive fibroblast proliferation, migration, and extracellular matrix deposition in IPF.",
    distractorExplanations: [
      "Nintedanib has no bronchodilator properties. IPF is a restrictive, not obstructive, disease.",
      "Nintedanib is not a steroid. It works through kinase inhibition.",
      "Nintedanib does not affect mucus viscosity."
    ],
    clinicalConcept: "Both nintedanib and pirfenidone slow FVC decline by approximately 50% per year in IPF. They target different molecular pathways but have similar clinical efficacy.",
    examTip: "IPF antifibrotics: pirfenidone (anti-TGF-beta, anti-TNF-alpha) and nintedanib (triple tyrosine kinase inhibitor). Both oral, both slow FVC decline. Know both names.",
    safetyPearl: "Nintedanib's most common side effect is diarrhea (>60% of patients). Also monitor liver function and watch for bleeding complications. Contraindicated in pregnancy (teratogenic).",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "antifibrotic mechanisms",
    pharmacologyCategory: "Route of Administration"
  },
  {
    id: "rrt-pharm-123",
    stem: "A patient with severe pulmonary edema is placed on CPAP at 10 cmH2O. In addition to diuretic therapy, CPAP provides which pharmacology-relevant benefit?",
    options: [
      "Positive pressure reduces venous return (preload), decreasing pulmonary capillary hydrostatic pressure",
      "CPAP delivers aerosolized medications more effectively",
      "CPAP has direct diuretic properties",
      "CPAP increases cardiac output by increasing preload"
    ],
    correctIndex: 0,
    rationale: "CPAP increases intrathoracic pressure, which impedes venous return to the right heart, effectively reducing preload. This decreases pulmonary capillary hydrostatic pressure and reduces fluid transudation into the alveoli, complementing the diuretic therapy. CPAP also recruits atelectatic alveoli and improves FRC.",
    distractorExplanations: [
      "CPAP does not enhance aerosol delivery. In fact, positive pressure can alter aerosol deposition patterns.",
      "CPAP has no diuretic properties. It reduces fluid in the lungs mechanically, not by increasing urine output.",
      "CPAP reduces (not increases) preload through impedance of venous return."
    ],
    clinicalConcept: "CPAP in pulmonary edema addresses multiple pathophysiologic mechanisms: reduces preload (hemodynamic benefit), recruits atelectatic alveoli (oxygenation benefit), and reduces work of breathing (ventilatory benefit).",
    examTip: "CPAP for pulmonary edema: reduces preload + recruits alveoli + reduces WOB. Start at 5-10 cmH2O. This is first-line treatment along with diuretics and nitrates.",
    safetyPearl: "Monitor for hypotension (especially if patient is volume-depleted) and ensure the patient can protect their airway. CPAP is contraindicated in obtunded patients who cannot protect their airway.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "CPAP hemodynamic effects",
    pharmacologyCategory: "Fluid Overload/Diuretic Monitoring"
  },
  {
    id: "rrt-pharm-124",
    stem: "A patient presents with paradoxical bronchospasm after using their albuterol MDI. What should the RT recommend?",
    options: [
      "Discontinue the current MDI and switch to a different formulation or nebulizer delivery",
      "Increase the MDI dose",
      "Add another puff immediately after the bronchospasm",
      "Continue using the same MDI as this will resolve"
    ],
    correctIndex: 0,
    rationale: "Paradoxical bronchospasm (worsening bronchospasm after bronchodilator inhalation) can occur due to MDI propellant/additive sensitivity, cold Freon effect, or medication allergy. The RT should discontinue the current MDI and switch to an alternative formulation (different brand, different propellant) or delivery method (nebulizer).",
    distractorExplanations: [
      "Increasing the dose of a medication causing paradoxical bronchospasm would worsen the reaction.",
      "Adding more puffs of the causative agent is dangerous.",
      "Paradoxical bronchospasm requires intervention — it will not self-resolve with continued use of the same product."
    ],
    clinicalConcept: "Paradoxical bronchospasm can be caused by: propellant sensitivity (HFA, formerly CFC), preservative allergy (benzalkonium chloride, EDTA), cold Freon effect (aerosol cooling triggers reflex bronchospasm), or osmolality changes.",
    examTip: "Paradoxical bronchospasm = worsening after bronchodilator. Stop the drug, try alternative formulation/delivery. If severe, treat as acute bronchospasm (nebulized albuterol, epinephrine if anaphylactic).",
    safetyPearl: "Document paradoxical bronchospasm in the patient's allergy/adverse reaction list. Specify the exact product (brand, formulation) to prevent re-exposure.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "paradoxical bronchospasm",
    pharmacologyCategory: "Side Effect Recognition"
  },
  {
    id: "rrt-pharm-125",
    stem: "A critically ill patient on the ventilator requires sedation, analgesia, and neuromuscular blockade. In what order should these medications be initiated?",
    options: [
      "Analgesia first, then sedation, then neuromuscular blockade (A-S-NMB)",
      "Neuromuscular blockade first to control the patient",
      "Sedation first, then NMB, then analgesia",
      "All three simultaneously"
    ],
    correctIndex: 0,
    rationale: "The evidence-based sequence is analgesia-first (A1) approach: (1) Address pain with opioid analgesics, (2) Add sedation (propofol, dexmedetomidine) for anxiety/agitation, (3) Add NMB only if needed for ventilator dyssynchrony despite adequate sedation and analgesia. Pain causes agitation — treating pain first often reduces sedation requirements.",
    distractorExplanations: [
      "Starting NMB first without sedation and analgesia leaves the patient paralyzed but awake and in pain — this is inhumane and harmful.",
      "Sedation before analgesia may mask pain, leading to inadequate pain management and excessive sedative use.",
      "Simultaneous initiation makes titration difficult and may result in over-medication."
    ],
    clinicalConcept: "The PADIS guidelines (2018) recommend the A1 (analgesia-first) approach. Pain assessment in ventilated patients uses BPS (Behavioral Pain Scale) or CPOT (Critical-Care Pain Observation Tool).",
    examTip: "ICU sedation/analgesia order: Analgesia → Sedation → NMB (only if needed). Remember: NMB = paralysis WITHOUT sedation or analgesia. Always ensure adequate sedation before paralyzing.",
    safetyPearl: "Daily sedation interruption (when safe) allows neurologic assessment and reduces total drug exposure. Daily NMB interruption with TOF monitoring prevents prolonged weakness.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "ICU pharmacology sequencing",
    pharmacologyCategory: "Ventilated Patient Medication Delivery"
  },
  {
    id: "rrt-pharm-126",
    stem: "A patient with exercise-induced bronchospasm (EIB) asks which medication to use 15 minutes before exercise. What do you recommend?",
    options: [
      "Albuterol 2 puffs via MDI, 15-30 minutes before exercise",
      "Salmeterol 1 puff via DPI immediately before exercise",
      "Prednisone 40 mg PO 15 minutes before exercise",
      "Ipratropium via nebulizer 15 minutes before exercise"
    ],
    correctIndex: 0,
    rationale: "Short-acting beta-2 agonist (albuterol, 2 puffs MDI) administered 15-30 minutes before exercise is the first-line prophylaxis for exercise-induced bronchospasm. It provides protection for 4-6 hours. Daily controller medications should also be used if EIB occurs despite SABA prophylaxis.",
    distractorExplanations: [
      "Salmeterol takes 15-30 minutes for onset but must not be used for acute/immediate pre-exercise use. If used, it should be taken 30-60 minutes before. Also, LABA monotherapy in asthma carries safety concerns.",
      "Oral prednisone takes 4-6 hours for onset and is not appropriate for pre-exercise prophylaxis.",
      "Ipratropium is less effective than SABA for EIB prophylaxis and is not first-line."
    ],
    clinicalConcept: "EIB occurs in 40-90% of asthmatics and 10-50% of elite athletes. Cold, dry air increases risk. The mechanism involves airway cooling and dehydration → osmotic changes → mast cell mediator release → bronchospasm.",
    examTip: "EIB prophylaxis: SABA 15-30 min before exercise = first line. Alternatives: LTRA (montelukast), cromolyn, or warm-up exercise protocol. If EIB occurs frequently, step up controller therapy.",
    safetyPearl: "If a patient needs SABA pre-exercise daily, their underlying asthma is likely not well-controlled. Reassess controller medication adequacy rather than relying on pre-exercise SABA alone.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "exercise-induced bronchospasm prophylaxis",
    pharmacologyCategory: "Reassessment After Treatment"
  },
  {
    id: "rrt-pharm-127",
    stem: "A patient on ECMO requires aerosol medication delivery. What challenge does ECMO present for inhaled drug therapy?",
    options: [
      "Reduced pulmonary blood flow and ventilation make inhaled drug delivery to the lungs significantly less effective",
      "ECMO enhances drug delivery by increasing pulmonary blood flow",
      "Inhaled medications are automatically absorbed by the ECMO circuit",
      "There is no change in drug delivery during ECMO"
    ],
    correctIndex: 0,
    rationale: "During veno-arterial ECMO, pulmonary blood flow is significantly reduced as blood bypasses the lungs through the extracorporeal circuit. Combined with often reduced ventilatory settings ('lung rest'), inhaled drug delivery and absorption are substantially impaired because both ventilation (drug delivery to alveoli) and perfusion (drug absorption into circulation) are decreased.",
    distractorExplanations: [
      "ECMO reduces (not increases) pulmonary blood flow by diverting blood through the extracorporeal circuit.",
      "The ECMO circuit may sequester some drugs but the primary issue is reduced lung perfusion and ventilation, not circuit absorption.",
      "ECMO significantly alters the pharmacokinetics of inhaled medications."
    ],
    clinicalConcept: "On ECMO, alternative drug delivery routes (IV, enteral) may be preferred for medications normally given by inhalation. If inhaled drugs are used, doses may need adjustment and response should be closely monitored.",
    examTip: "ECMO + inhaled medications = reduced delivery and absorption. Consider alternative routes. This is an advanced concept that may appear on higher-level questions.",
    safetyPearl: "Some medications (sedatives, opioids, antibiotics) are sequestered by the ECMO circuit tubing and oxygenator, requiring dose adjustments. Consult pharmacology team for ECMO-specific dosing.",
    difficulty: 5,
    category: "Respiratory Pharmacology",
    topic: "ECMO and drug delivery",
    pharmacologyCategory: "Ventilated Patient Medication Delivery"
  },
  {
    id: "rrt-pharm-128",
    stem: "A 3-year-old with recurrent wheezing episodes is prescribed a leukotriene receptor antagonist. Which formulation is appropriate?",
    options: [
      "Montelukast 4 mg granules or chewable tablet (approved for ages 1-5)",
      "Zafirlukast 20 mg tablet (adult dose)",
      "Zileuton 600 mg tablet",
      "Montelukast 10 mg film-coated tablet (adult dose)"
    ],
    correctIndex: 0,
    rationale: "Montelukast (Singulair) is available in age-appropriate formulations: 4 mg granules (12 months–5 years), 5 mg chewable tablet (6–14 years), and 10 mg film-coated tablet (≥15 years). The 4 mg granules can be mixed with soft food for young children.",
    distractorExplanations: [
      "Zafirlukast 20 mg is an adult dose and is approved for ages ≥5 years only.",
      "Zileuton is approved for ages ≥12 years and requires hepatic monitoring. Not appropriate for a 3-year-old.",
      "Montelukast 10 mg is the adult/adolescent dose, not appropriate for a 3-year-old."
    ],
    clinicalConcept: "LTRAs are particularly useful in young children with recurrent wheezing because they are oral (avoiding inhaler technique issues), well-tolerated, and effective for both allergic and viral-induced wheezing.",
    examTip: "Montelukast pediatric dosing: 4 mg (1-5 yrs), 5 mg (6-14 yrs), 10 mg (≥15 yrs). Once daily at bedtime. Available as granules, chewable tablets, and film-coated tablets.",
    safetyPearl: "FDA Black Box Warning for montelukast: neuropsychiatric events (behavioral changes, depression, suicidal ideation). Carefully weigh benefits vs. risks. Parents should monitor for mood/behavioral changes.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "pediatric LTRA dosing",
    pharmacologyCategory: "Pediatric Respiratory Pharmacology"
  },
  {
    id: "rrt-pharm-129",
    stem: "A ventilated patient receiving IV heparin develops a sudden decrease in SpO2 to 82% with unilateral absent breath sounds. What should be suspected and what is the IMMEDIATE action?",
    options: [
      "Tension pneumothorax — perform immediate needle decompression before any medication changes",
      "Pulmonary embolism — increase the heparin dose",
      "Mucus plugging — increase the bronchodilator frequency",
      "Right mainstem intubation — add a bronchodilator"
    ],
    correctIndex: 0,
    rationale: "Sudden SpO2 drop with unilateral absent breath sounds in a ventilated patient is tension pneumothorax until proven otherwise. This is a mechanical/surgical emergency requiring immediate needle decompression (14-gauge needle, 2nd intercostal space, midclavicular line) followed by chest tube placement. No medication changes will help.",
    distractorExplanations: [
      "PE does not typically cause unilateral absent breath sounds. PE would show bilateral breath sounds with hypoxemia.",
      "Mucus plugging can cause unilateral changes but is not usually this sudden or severe. Suction should be attempted but pneumothorax must be ruled out first.",
      "Right mainstem intubation would show absent LEFT breath sounds. Bronchodilator would not help with mechanical causes."
    ],
    clinicalConcept: "Tension pneumothorax in ventilated patients can develop rapidly and is life-threatening. Positive pressure ventilation forces air into the pleural space, compressing the contralateral lung and impeding venous return.",
    examTip: "Sudden desaturation + unilateral absent breath sounds + high PIP = tension pneumothorax. This is a CLINICAL EMERGENCY requiring immediate decompression, not pharmacologic treatment.",
    safetyPearl: "Do NOT wait for chest X-ray confirmation if clinical signs strongly suggest tension pneumothorax. Delays in needle decompression can result in cardiac arrest. Decompress first, confirm with CXR after.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "differentiating mechanical vs pharmacologic problems",
    pharmacologyCategory: "Physician-Order Clarification"
  },
  {
    id: "rrt-pharm-130",
    stem: "A patient is being weaned from the ventilator and develops bronchospasm during a spontaneous breathing trial. The physician asks whether to use albuterol MDI or SVN. Which factors favor MDI with spacer?",
    options: [
      "More consistent dosing, faster administration, no impact on ventilator flow measurements",
      "Lower cost per dose",
      "Better for patients with very weak inspiratory effort",
      "MDI delivers more drug to the lungs in all situations"
    ],
    correctIndex: 0,
    rationale: "During SBTs, MDI with spacer is often preferred because: (1) dosing is more consistent and reproducible, (2) administration is faster (seconds vs. 10-15 minutes for SVN), (3) it does not add flow to the circuit that could affect ventilator measurements, and (4) it does not increase the patient's respiratory workload.",
    distractorExplanations: [
      "MDI cost per dose can be higher than SVN in some settings, though total cost of care may be lower due to efficiency.",
      "MDI requires adequate technique. Very weak patients may benefit from SVN as it requires no coordination.",
      "MDI does not always deliver more drug — delivery depends on technique, device, and patient factors."
    ],
    clinicalConcept: "During weaning/SBTs, minimizing unnecessary treatments and interventions that increase workload or alter measurements is important. MDI provides efficient drug delivery without circuit disruption.",
    examTip: "MDI vs. SVN in ventilated patients: MDI = faster, more consistent, no added flow. SVN = no coordination needed, can use for longer treatments, adds flow to circuit.",
    safetyPearl: "When using MDI during SBT, coordinate each puff with the beginning of inspiration for maximum deposition. Allow 30-60 seconds between puffs.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "weaning and aerosol delivery",
    pharmacologyCategory: "Ventilated Patient Medication Delivery"
  },
  {
    id: "rrt-pharm-131",
    stem: "A physician orders albuterol for a 6-month-old infant with bronchiolitis. Current evidence suggests which of the following?",
    options: [
      "Bronchodilators have limited benefit in viral bronchiolitis and are not routinely recommended",
      "Albuterol is the standard treatment for all bronchiolitis cases",
      "Ipratropium is more effective than albuterol in bronchiolitis",
      "Corticosteroids alone are sufficient for bronchiolitis treatment"
    ],
    correctIndex: 0,
    rationale: "The AAP clinical practice guidelines (2014, reaffirmed) recommend AGAINST routine use of bronchodilators in bronchiolitis. Evidence shows no consistent benefit in reducing hospitalization or improving clinical outcomes. Supportive care (suctioning, hydration, supplemental O2) is the mainstay of treatment.",
    distractorExplanations: [
      "Evidence does not support routine albuterol use in bronchiolitis. A trial dose may be given, but should be discontinued if no improvement.",
      "Ipratropium has also shown no benefit in bronchiolitis studies.",
      "Corticosteroids have not shown benefit in bronchiolitis and are not recommended."
    ],
    clinicalConcept: "Bronchiolitis pathophysiology involves airway edema and mucus plugging rather than true bronchospasm. This is why bronchodilators targeting smooth muscle have limited effect.",
    examTip: "Bronchiolitis in infants: supportive care only. No routine bronchodilators, no routine steroids, no routine antibiotics. High-flow nasal cannula or CPAP for respiratory support if needed.",
    safetyPearl: "If a trial dose of albuterol is given and shows clinical improvement (which occurs in a minority of cases), continue therapy. If no improvement after one dose, do not continue — the risks (tachycardia) outweigh the absent benefits.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "evidence-based bronchiolitis treatment",
    pharmacologyCategory: "Physician-Order Clarification"
  },
  {
    id: "rrt-pharm-132",
    stem: "A patient with acute pulmonary embolism (PE) receives tissue plasminogen activator (tPA/alteplase). What is the primary mechanism?",
    options: [
      "Fibrinolytic agent that converts plasminogen to plasmin, dissolving the fibrin clot",
      "Anticoagulant that prevents new clot formation",
      "Platelet inhibitor that prevents platelet aggregation",
      "Vasoconstrictor that redirects blood flow around the clot"
    ],
    correctIndex: 0,
    rationale: "Alteplase (tPA) is a thrombolytic/fibrinolytic agent that activates plasminogen bound to fibrin in the clot, converting it to plasmin. Plasmin then breaks down the fibrin mesh, dissolving the existing clot. This is used for massive PE with hemodynamic instability.",
    distractorExplanations: [
      "Anticoagulants (heparin, warfarin) prevent NEW clot formation but do not dissolve existing clots.",
      "Platelet inhibitors (aspirin, clopidogrel) prevent platelet activation but do not dissolve fibrin clots.",
      "tPA does not cause vasoconstriction."
    ],
    clinicalConcept: "Thrombolytics are indicated for massive PE (systolic BP <90 mmHg) and may be considered for submassive PE (RV dysfunction without hypotension). The risk of major bleeding must be weighed against the mortality risk.",
    examTip: "Thrombolytics: alteplase (tPA), tenecteplase, streptokinase. Used for massive PE, STEMI, and acute ischemic stroke. Major risk = hemorrhage (including intracranial).",
    safetyPearl: "Absolute contraindications to thrombolytics: active internal bleeding, recent (<3 months) intracranial surgery/stroke, intracranial neoplasm, suspected aortic dissection. Have blood products available.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "thrombolytic therapy",
    pharmacologyCategory: "Emergency Medication Recognition"
  },
  {
    id: "rrt-pharm-133",
    stem: "A patient using a soft mist inhaler (Respimat) asks how it differs from a standard MDI. What is the KEY difference?",
    options: [
      "Respimat generates a slower-moving aerosol cloud without propellant, resulting in higher lung deposition",
      "Respimat delivers medication faster than MDI",
      "Respimat uses CFC propellant while MDI uses HFA",
      "Respimat is only available for beta-2 agonists"
    ],
    correctIndex: 0,
    rationale: "The Respimat soft mist inhaler uses mechanical energy (spring mechanism) to force liquid through a uniblock nozzle, creating a slow-moving, long-duration aerosol cloud (~1.5 seconds vs. ~0.15 seconds for MDI). This allows more time for inhalation and results in higher lung deposition (~40-50% vs. ~10-20% for MDI) with less oropharyngeal impaction.",
    distractorExplanations: [
      "Respimat produces a slower, longer-lasting cloud — not faster delivery.",
      "Both Respimat (propellant-free) and modern MDIs (HFA propellant) are CFC-free. Respimat uses no propellant at all.",
      "Respimat is available for multiple drug classes including tiotropium (Spiriva Respimat), olodaterol (Striverdi), and combination products."
    ],
    clinicalConcept: "The Respimat's slow-velocity mist reduces the coordination demands compared to pMDI while avoiding the inspiratory flow requirement of DPIs. It represents a middle ground between pMDI and DPI technology.",
    examTip: "Respimat: no propellant, slow mist, high lung deposition, good for patients who struggle with MDI coordination or cannot generate DPI flow. Available for LAMA, LABA, and combinations.",
    safetyPearl: "The Respimat requires priming before first use (3 actuations pointed away from face). If not used for >3 days, re-prime with 1 actuation. The cartridge has a built-in dose counter.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "soft mist inhaler technology",
    pharmacologyCategory: "Device Selection"
  },
  {
    id: "rrt-pharm-134",
    stem: "A patient with persistent asthma is on step 4 therapy (medium-dose ICS/LABA) and continues to have poor control. Before stepping up therapy, what should the RT assess?",
    options: [
      "Inhaler technique, medication adherence, trigger avoidance, and comorbidities",
      "Whether the patient needs IV steroids",
      "If the patient should switch to oral bronchodilators",
      "Whether the patient should discontinue all inhalers"
    ],
    correctIndex: 0,
    rationale: "Before escalating therapy, the RT must assess the 'treatable traits': (1) Inhaler technique — up to 80% of patients use inhalers incorrectly, (2) Adherence — many patients are non-adherent, (3) Trigger avoidance — allergens, smoke, occupational exposures, (4) Comorbidities — GERD, sinusitis, obesity, depression that can worsen asthma control.",
    distractorExplanations: [
      "IV steroids are for acute exacerbations, not chronic step-up decisions.",
      "Oral bronchodilators have more side effects and are not preferred over inhaled therapy.",
      "Discontinuing all inhalers would worsen asthma control."
    ],
    clinicalConcept: "Studies show that 25-50% of 'uncontrolled' asthma is actually poor technique, non-adherence, or untreated comorbidities. Addressing these factors often improves control without adding medications.",
    examTip: "Before stepping up asthma therapy: check technique, check adherence, check triggers, check comorbidities. 'Has the patient been taking their medication correctly?' should be the first question.",
    safetyPearl: "Electronic monitoring devices can objectively track inhaler use and identify non-adherence patterns. Smart inhalers with Bluetooth connectivity are increasingly available.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "asthma step-up assessment",
    pharmacologyCategory: "Reassessment After Treatment"
  },
  {
    id: "rrt-pharm-135",
    stem: "A critically ill patient develops acute respiratory failure from status epilepticus. The physician orders lorazepam (Ativan) IV. What respiratory concern should the RT anticipate?",
    options: [
      "Respiratory depression from the benzodiazepine requiring close monitoring and potential ventilatory support",
      "Bronchospasm from the medication",
      "Increased respiratory drive requiring decreased ventilator support",
      "No respiratory effects from IV lorazepam"
    ],
    correctIndex: 0,
    rationale: "Benzodiazepines (lorazepam, midazolam, diazepam) cause dose-dependent CNS depression that can lead to respiratory depression (decreased respiratory rate, decreased tidal volume, and potential apnea). The RT should monitor respiratory status closely and have airway management equipment available.",
    distractorExplanations: [
      "Benzodiazepines do not cause bronchospasm. They may actually have mild bronchodilator properties.",
      "Benzodiazepines decrease (not increase) respiratory drive through GABA-A receptor potentiation.",
      "All benzodiazepines carry significant respiratory depression risk, especially when combined with opioids."
    ],
    clinicalConcept: "Benzodiazepines enhance GABA activity at GABA-A receptors, causing CNS depression including respiratory center depression. Risk is increased with concurrent opioids, alcohol, or other CNS depressants.",
    examTip: "Benzodiazepine reversal = flumazenil. Opioid reversal = naloxone. Know the reversal agents. Benzodiazepine + opioid combination = highest respiratory depression risk.",
    safetyPearl: "Have flumazenil (Romazicon) available as a reversal agent, but use cautiously — it can precipitate seizures in benzodiazepine-dependent patients and has a shorter half-life than most benzodiazepines.",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "benzodiazepine respiratory effects",
    pharmacologyCategory: "Side Effect Recognition"
  },
  {
    id: "rrt-pharm-136",
    stem: "A patient with COPD and cor pulmonale is prescribed a loop diuretic for peripheral edema. What additional respiratory medication consideration should be made?",
    options: [
      "Loop diuretics may cause metabolic alkalosis, potentially suppressing ventilatory drive in CO2 retainers",
      "Loop diuretics improve oxygenation and eliminate the need for supplemental O2",
      "Loop diuretics are contraindicated in all COPD patients",
      "Loop diuretics replace the need for bronchodilator therapy"
    ],
    correctIndex: 0,
    rationale: "Loop diuretics cause metabolic alkalosis (loss of H+, Cl-, and volume contraction). In COPD patients who retain CO2 and may rely partly on hypoxic or acidotic ventilatory drive, metabolic alkalosis can further suppress respiratory drive, potentially worsening hypercapnia. Electrolytes and ABGs should be monitored.",
    distractorExplanations: [
      "Loop diuretics reduce fluid overload but do not eliminate the need for supplemental oxygen. The underlying COPD still requires O2 therapy.",
      "Loop diuretics are NOT contraindicated in COPD — they are commonly used for cor pulmonale-related edema. Careful monitoring is needed.",
      "Diuretics treat fluid overload — they do not replace bronchodilator therapy for airflow obstruction."
    ],
    clinicalConcept: "Cor pulmonale (right heart failure from pulmonary hypertension) causes peripheral edema and hepatomegaly. Treatment addresses the underlying lung disease (oxygen, bronchodilators) and the fluid overload (diuretics, salt restriction).",
    examTip: "COPD + loop diuretic = watch for metabolic alkalosis + hypokalemia. Both can worsen respiratory function. Monitor ABGs and electrolytes. Consider acetazolamide if alkalosis is problematic.",
    safetyPearl: "In COPD patients on diuretics, monitor both serum potassium AND ABG. Correct metabolic alkalosis if it develops. Potassium-sparing diuretics may be added to prevent hypokalemia.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "diuretics in COPD",
    pharmacologyCategory: "Fluid Overload/Diuretic Monitoring"
  },
  {
    id: "rrt-pharm-137",
    stem: "A patient with severe community-acquired pneumonia receives empiric antibiotic therapy with a respiratory fluoroquinolone (levofloxacin). What is the rationale for choosing a respiratory fluoroquinolone?",
    options: [
      "Broad-spectrum coverage including Streptococcus pneumoniae and atypical organisms (Legionella, Mycoplasma, Chlamydia)",
      "It is the cheapest antibiotic available",
      "It provides antifungal coverage as well",
      "It is the only antibiotic that can be aerosolized"
    ],
    correctIndex: 0,
    rationale: "Respiratory fluoroquinolones (levofloxacin, moxifloxacin) provide excellent coverage of the most common CAP pathogens: Streptococcus pneumoniae (including drug-resistant strains), Haemophilus influenzae, Moraxella catarrhalis, and atypical organisms (Legionella, Mycoplasma pneumoniae, Chlamydia pneumoniae).",
    distractorExplanations: [
      "Cost is not the primary rationale — spectrum of coverage dictates antibiotic selection.",
      "Fluoroquinolones do not have antifungal activity.",
      "Multiple antibiotics can be aerosolized. This is not unique to fluoroquinolones."
    ],
    clinicalConcept: "CAP guidelines recommend respiratory fluoroquinolone monotherapy OR beta-lactam + macrolide combination for inpatient CAP. The choice depends on local resistance patterns, patient allergies, and severity.",
    examTip: "Respiratory fluoroquinolones cover typical + atypical CAP pathogens. Regular fluoroquinolones (ciprofloxacin) have poor pneumococcal coverage — do not substitute for CAP treatment.",
    safetyPearl: "Fluoroquinolone side effects: tendon rupture (especially Achilles), QT prolongation, peripheral neuropathy, C. difficile colitis, aortic dissection risk. FDA Black Box Warning limits use to situations without alternatives.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "empiric antibiotic therapy",
    pharmacologyCategory: "Route of Administration"
  },
  {
    id: "rrt-pharm-138",
    stem: "A neonatal transport team is preparing to transport a premature neonate with persistent pulmonary hypertension (PPHN). Which medication is commonly initiated before transport?",
    options: [
      "Inhaled nitric oxide (iNO) at 20 ppm via the ventilator circuit",
      "Oral sildenafil",
      "IV furosemide for fluid management",
      "Nebulized albuterol for bronchospasm"
    ],
    correctIndex: 0,
    rationale: "Inhaled nitric oxide at 20 ppm is the first-line pulmonary vasodilator for PPHN in neonates. It selectively dilates the pulmonary vasculature by activating guanylate cyclase/cGMP pathway, improving oxygenation by redirecting blood flow to ventilated lung regions.",
    distractorExplanations: [
      "Oral sildenafil may be used as adjunctive therapy or for weaning from iNO, but is not the initial acute intervention for PPHN.",
      "IV furosemide treats fluid overload, not PPHN. The primary pathology is pulmonary vasoconstriction.",
      "PPHN involves vascular spasm, not bronchospasm. Albuterol would not address the underlying problem."
    ],
    clinicalConcept: "PPHN occurs when the normal postnatal decline in pulmonary vascular resistance fails, resulting in right-to-left shunting through the PDA and foramen ovale. iNO specifically targets the pulmonary vasculature.",
    examTip: "PPHN in neonates: iNO 20 ppm = first-line vasodilator. If refractory: add sildenafil, milrinone, or consider ECMO. Distinguish PPHN from RDS (surfactant deficiency).",
    safetyPearl: "Ensure iNO delivery system is functioning properly during transport. Carry backup iNO supply. Abrupt iNO discontinuation during transport could be fatal due to rebound pulmonary hypertension.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "PPHN treatment",
    pharmacologyCategory: "Neonatal Concepts"
  },
  {
    id: "rrt-pharm-139",
    stem: "A patient develops methemoglobinemia (MetHb 18%) during inhaled nitric oxide therapy. What is the appropriate treatment?",
    options: [
      "Reduce or discontinue iNO and administer methylene blue 1-2 mg/kg IV if symptomatic",
      "Increase iNO dose to overcome the methemoglobin",
      "Administer hydroxocobalamin",
      "No treatment needed until MetHb exceeds 40%"
    ],
    correctIndex: 0,
    rationale: "MetHb >5% during iNO therapy requires dose reduction. MetHb >10% or symptomatic methemoglobinemia requires iNO discontinuation and methylene blue (1-2 mg/kg IV over 5 minutes). Methylene blue acts as an electron carrier, reducing methemoglobin back to functional hemoglobin via NADPH methemoglobin reductase.",
    distractorExplanations: [
      "Increasing iNO would worsen methemoglobinemia by producing more oxidized hemoglobin.",
      "Hydroxocobalamin is for cyanide poisoning, not methemoglobinemia.",
      "MetHb of 18% is clinically significant and requires intervention. Waiting until 40% could be fatal."
    ],
    clinicalConcept: "Methylene blue is itself blue — it temporarily turns the patient's skin and urine blue/green. It should not be used in patients with G6PD deficiency as it can cause hemolytic anemia.",
    examTip: "MetHb treatment: methylene blue 1-2 mg/kg IV. Contraindication: G6PD deficiency (use ascorbic acid instead). Know the MetHb thresholds: >5% = reduce iNO dose, >10% = consider discontinuation.",
    safetyPearl: "Standard pulse oximetry cannot accurately measure SpO2 in the presence of methemoglobinemia. Co-oximetry is required. Pulse oximetry will often read ~85% regardless of actual oxygen saturation when MetHb is elevated.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "methemoglobinemia treatment",
    pharmacologyCategory: "Side Effect Recognition"
  },
  {
    id: "rrt-pharm-140",
    stem: "A patient with COPD on triple inhaler therapy (ICS/LAMA/LABA) develops pneumonia for the third time in 12 months. What pharmacologic change should be considered?",
    options: [
      "Evaluate ICS withdrawal if eosinophils are low, as ICS increases pneumonia risk in COPD",
      "Add a fourth inhaler",
      "Increase the ICS dose for better anti-inflammatory control",
      "Discontinue all inhalers"
    ],
    correctIndex: 0,
    rationale: "Inhaled corticosteroids increase pneumonia risk in COPD patients by 50-70%. GOLD guidelines recommend considering ICS withdrawal in COPD patients with recurrent pneumonia, especially if blood eosinophils are <100 cells/μL (indicating low likelihood of ICS benefit). Stepping down to LAMA/LABA alone should be considered.",
    distractorExplanations: [
      "Adding a fourth inhaler would further complicate the regimen without addressing the ICS-pneumonia risk.",
      "Increasing ICS dose would likely increase pneumonia risk further.",
      "LAMA and LABA should be continued for bronchodilation. Only the ICS component is being reconsidered."
    ],
    clinicalConcept: "ICS benefit in COPD is greatest for patients with: blood eosinophils ≥300 cells/μL, frequent exacerbations (≥2/year), or asthma-COPD overlap. Low eosinophils suggest ICS provides minimal benefit with added pneumonia risk.",
    examTip: "COPD + recurrent pneumonia + on ICS → consider ICS step-down. Eosinophil count guides the decision. High eos = keep ICS. Low eos = remove ICS. This reflects current GOLD guidelines.",
    safetyPearl: "When withdrawing ICS in COPD, do so gradually and monitor for exacerbation increase. Ensure adequate LAMA/LABA bronchodilator coverage. Some patients may need oral PDE4 inhibitor (roflumilast) to prevent exacerbations.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "ICS pneumonia risk in COPD",
    pharmacologyCategory: "Reassessment After Treatment"
  },
  {
    id: "rrt-pharm-141",
    stem: "A physician orders adenosine 6 mg rapid IV push for a patient with supraventricular tachycardia (SVT) who is hemodynamically stable. What transient respiratory effect should the RT anticipate?",
    options: [
      "Brief period of apnea or dyspnea lasting 10-30 seconds due to adenosine receptor effects on breathing",
      "Sustained bronchodilation lasting several hours",
      "Permanent respiratory depression requiring intubation",
      "No respiratory effects"
    ],
    correctIndex: 0,
    rationale: "Adenosine causes transient stimulation of pulmonary C-fiber receptors and may trigger bronchospasm via A1 receptor activation. Patients commonly experience a brief sensation of chest tightness, dyspnea, and may have a momentary pause in breathing. These effects are transient (10-30 seconds) due to adenosine's ultra-short half-life (<10 seconds).",
    distractorExplanations: [
      "Adenosine's respiratory effects are transient, not sustained. Its half-life is <10 seconds.",
      "The respiratory effects are brief and self-limiting. Intubation is not required.",
      "Adenosine does affect breathing transiently, although effects are very brief."
    ],
    clinicalConcept: "Adenosine works by slowing AV node conduction, breaking the re-entrant circuit in SVT. Its ultra-short half-life means all effects (cardiac and respiratory) are brief. Must be given as rapid IV push followed by saline flush.",
    examTip: "Adenosine for SVT: 6 mg rapid IV push → 12 mg if no response → 12 mg. Warn patient about chest tightness/dyspnea ('you may feel like you can't breathe for a moment'). Use caution in asthmatics.",
    safetyPearl: "Adenosine is RELATIVELY CONTRAINDICATED in patients with severe asthma due to potential bronchospasm. Consider verapamil or diltiazem as alternatives if the patient has reactive airways.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "adenosine respiratory effects",
    pharmacologyCategory: "Emergency Medication Recognition"
  },
  {
    id: "rrt-pharm-142",
    stem: "A patient with severe ARDS is receiving a prone position ventilation strategy. The physician adds inhaled epoprostenol. What is the rationale for combining these two interventions?",
    options: [
      "Prone positioning recruits dorsal lung and epoprostenol selectively vasodilates ventilated areas, synergistically improving V/Q matching",
      "Epoprostenol prevents the patient from developing pressure injuries in prone position",
      "Prone positioning enhances epoprostenol absorption through the skin",
      "These interventions are never combined"
    ],
    correctIndex: 0,
    rationale: "Prone positioning improves oxygenation by redistributing ventilation to dorsal lung regions and improving chest wall mechanics. Inhaled epoprostenol selectively vasodilates the pulmonary vessels in VENTILATED lung units (because the drug only reaches areas with airflow). Combining both maximizes V/Q matching by matching improved ventilation (prone) with improved perfusion (epoprostenol).",
    distractorExplanations: [
      "Epoprostenol has no effect on skin integrity or pressure injury prevention.",
      "Epoprostenol is inhaled, not absorbed through the skin. Prone positioning does not affect inhaled drug absorption.",
      "These interventions are commonly combined in severe ARDS as complementary strategies."
    ],
    clinicalConcept: "The concept of 'selective pulmonary vasodilation' means the inhaled drug preferentially dilates vessels in ventilated alveoli, directing blood flow to areas of good ventilation. This is the V/Q matching benefit of inhaled vasodilators.",
    examTip: "Prone + inhaled vasodilator in ARDS = synergistic improvement in oxygenation. Prone = better ventilation distribution. Inhaled vasodilator = better perfusion distribution. Both improve V/Q matching.",
    safetyPearl: "When combining prone positioning with inhaled vasodilator, ensure the nebulizer circuit is secure and functioning before turning prone. Check for circuit disconnections after position changes.",
    difficulty: 5,
    category: "Respiratory Pharmacology",
    topic: "combined ARDS strategies",
    pharmacologyCategory: "Ventilated Patient Medication Delivery"
  },
  {
    id: "rrt-pharm-143",
    stem: "A patient taking theophylline presents with nausea, vomiting, and heart rate of 140 bpm. Theophylline level returns at 28 mcg/mL. What is the significance?",
    options: [
      "Theophylline toxicity — level exceeds therapeutic range (5-15 mcg/mL) and symptoms are consistent with toxicity",
      "Level is within therapeutic range",
      "Only cardiac symptoms are related to theophylline",
      "Theophylline levels do not correlate with symptoms"
    ],
    correctIndex: 0,
    rationale: "A theophylline level of 28 mcg/mL significantly exceeds the therapeutic range of 5-15 mcg/mL. At this level, gastrointestinal symptoms (nausea, vomiting), cardiac toxicity (tachycardia, arrhythmias), and CNS effects (restlessness, seizures at higher levels) are expected. The drug should be held and levels monitored.",
    distractorExplanations: [
      "28 mcg/mL is nearly double the upper therapeutic limit. This is clearly toxic.",
      "Both GI and cardiac symptoms are manifestations of theophylline toxicity.",
      "Theophylline has a well-established dose-toxicity relationship. Levels strongly correlate with symptoms."
    ],
    clinicalConcept: "Theophylline toxicity progression: 15-25 mcg/mL = nausea, vomiting, tachycardia. 25-40 mcg/mL = arrhythmias, hypotension. >40 mcg/mL = seizures, cardiac arrest. The narrow therapeutic index makes monitoring essential.",
    examTip: "Theophylline therapeutic range: 5-15 mcg/mL. Toxic range: >20 mcg/mL. Signs: N/V → tachycardia → arrhythmias → seizures → death. Narrow therapeutic index drug.",
    safetyPearl: "Multiple factors increase theophylline levels: CHF, liver disease, fever, drug interactions (cimetidine, macrolides, fluoroquinolones). Smoking decreases levels (induces CYP1A2). Adjust dose with any of these changes.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "theophylline toxicity",
    pharmacologyCategory: "Side Effect Recognition"
  },
  {
    id: "rrt-pharm-144",
    stem: "A NICU team is discussing whether to use the INSURE technique for a preterm neonate. What does INSURE stand for?",
    options: [
      "INtubate, SURfactant, Extubate — minimizing duration of invasive ventilation",
      "Inhale, Sustain, Repeat — a breathing technique",
      "Intravenous, Subcutaneous, Rectal — drug administration routes",
      "Inspect, Neutralize, Secure, Undo, Rescue, Evacuate"
    ],
    correctIndex: 0,
    rationale: "INSURE (INtubate-SURfactant-Extubate) is a technique where the neonate is briefly intubated for surfactant administration via ETT, then promptly extubated to non-invasive respiratory support (CPAP). This minimizes the duration of invasive mechanical ventilation and its associated complications (ventilator-induced lung injury, BPD).",
    distractorExplanations: [
      "INSURE is not a breathing technique. It is a surfactant administration strategy.",
      "These drug routes are unrelated to the neonatal surfactant strategy.",
      "This is not related to HAZMAT or emergency response protocols."
    ],
    clinicalConcept: "INSURE has been shown to reduce the need for prolonged mechanical ventilation, decrease BPD rates, and reduce air leak complications. Newer alternatives include LISA (Less Invasive Surfactant Administration) via thin catheter without intubation.",
    examTip: "INSURE = quick intubation + surfactant + quick extubation to CPAP. LISA = surfactant via thin catheter without intubation (even less invasive). Both reduce ventilator exposure.",
    safetyPearl: "INSURE requires experienced personnel who can quickly intubate, administer surfactant, assess response, and extubate. The neonate must be a candidate for non-invasive support post-surfactant.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "INSURE technique",
    pharmacologyCategory: "Neonatal Concepts"
  },
  {
    id: "rrt-pharm-145",
    stem: "A patient receiving high-dose furosemide for acute decompensated heart failure develops metabolic alkalosis (pH 7.52, PaCO2 48, HCO3 38). What is the expected respiratory compensation?",
    options: [
      "Hypoventilation (decreased respiratory rate/tidal volume) to retain CO2 and lower pH",
      "Hyperventilation to blow off more CO2",
      "No respiratory compensation occurs for metabolic alkalosis",
      "Increased tidal volume with normal respiratory rate"
    ],
    correctIndex: 0,
    rationale: "The expected respiratory compensation for metabolic alkalosis is hypoventilation — the respiratory center decreases ventilatory drive to retain CO2 (respiratory acid), which helps lower the pH back toward normal. The elevated PaCO2 of 48 mmHg in this ABG confirms compensatory hypoventilation.",
    distractorExplanations: [
      "Hyperventilation would lower CO2 further, worsening the alkalosis. The body compensates in the OPPOSITE direction.",
      "Respiratory compensation does occur for metabolic alkalosis, though it is limited because hypoxemia eventually stimulates breathing.",
      "Hypoventilation decreases BOTH rate and tidal volume, not just one."
    ],
    clinicalConcept: "Respiratory compensation for metabolic alkalosis is limited because the body cannot hypoventilate to the point of dangerous hypoxemia. Expected compensation: PaCO2 increases ~0.7 mmHg for each 1 mEq/L increase in HCO3.",
    examTip: "Metabolic alkalosis compensation = CO2 retention (hypoventilation). Metabolic acidosis compensation = CO2 elimination (hyperventilation/Kussmaul breathing). The lungs compensate for metabolic disorders; kidneys compensate for respiratory disorders.",
    safetyPearl: "In ventilated patients with metabolic alkalosis, do NOT hyperventilate — it worsens the alkalosis and can cause seizures. Allow permissive hypercapnia to help correct the pH.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "diuretic-induced alkalosis compensation",
    pharmacologyCategory: "Fluid Overload/Diuretic Monitoring"
  },
  {
    id: "rrt-pharm-146",
    stem: "A patient with acute asthma receives subcutaneous epinephrine 0.3 mg (1:1,000). Five minutes later, the patient develops severe hypertension (BP 220/130) and chest pain. What happened?",
    options: [
      "Excessive alpha-1 adrenergic stimulation causing vasoconstriction and hypertensive crisis",
      "The epinephrine was diluted incorrectly and had no effect",
      "This is a normal response to epinephrine",
      "The patient is having an allergic reaction to epinephrine"
    ],
    correctIndex: 0,
    rationale: "Severe hypertension after epinephrine is caused by excessive alpha-1 adrenergic stimulation causing systemic vasoconstriction. This can occur with overdose, inadvertent IV injection (instead of SC), or in patients on beta-blockers (unopposed alpha stimulation). It can cause hypertensive crisis, stroke, or myocardial ischemia.",
    distractorExplanations: [
      "If diluted incorrectly, the symptoms could be from too HIGH a concentration, not lack of effect.",
      "Severe hypertension and chest pain are NOT normal responses. Normal side effects include mild tachycardia and tremor.",
      "Allergic reactions to epinephrine are extremely rare and would present with urticaria/angioedema, not hypertension."
    ],
    clinicalConcept: "Epinephrine stimulates alpha-1 (vasoconstriction), beta-1 (cardiac stimulation), and beta-2 (bronchodilation, vasodilation) receptors. In overdose, the alpha-1 effects dominate, causing severe hypertension.",
    examTip: "Epinephrine adverse effects: hypertension (alpha-1), tachyarrhythmias (beta-1), tremor (beta-2). Treatment for epinephrine-induced hypertensive emergency: phentolamine (alpha-blocker) or nitroprusside.",
    safetyPearl: "Always verify epinephrine concentration (1:1,000 for IM/SC, 1:10,000 for IV in arrest) and dose before administration. Concentration errors are a leading cause of epinephrine adverse events.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "epinephrine adverse effects",
    pharmacologyCategory: "Emergency Medication Recognition"
  },
  {
    id: "rrt-pharm-147",
    stem: "A ventilated patient on sedation and analgesia is assessed using the Richmond Agitation-Sedation Scale (RASS). The target RASS score for most ICU patients is:",
    options: [
      "-2 to 0 (light sedation to alert and calm)",
      "-5 (unresponsive)",
      "+4 (combative)",
      "-4 to -5 (deep sedation to unresponsive)"
    ],
    correctIndex: 0,
    rationale: "Current evidence supports targeting light sedation (RASS -2 to 0) for most ICU patients. Light sedation is associated with shorter ventilator duration, shorter ICU stay, and lower rates of delirium compared to deep sedation. Deep sedation (-4 to -5) is only indicated for specific situations (NMB use, severe ARDS, refractory status epilepticus).",
    distractorExplanations: [
      "RASS -5 (unresponsive) indicates over-sedation, which is associated with worse outcomes.",
      "RASS +4 (combative) indicates dangerous agitation requiring treatment.",
      "Deep sedation (-4 to -5) prolongs ventilator duration and increases delirium and mortality."
    ],
    clinicalConcept: "RASS scale ranges from -5 (unarousable) to +4 (combative). 0 = alert and calm. Negative numbers = sedation levels. Positive numbers = agitation levels. Daily sedation interruption targets RASS 0.",
    examTip: "ICU sedation target: RASS -2 to 0 (light sedation). Daily sedation vacation (DSV) = stop sedation until RASS 0, then restart at half the rate. This reduces ventilator days.",
    safetyPearl: "Oversedation (RASS <-2) is associated with ICU-acquired weakness, prolonged delirium, and difficult ventilator weaning. Use validated tools (RASS, SAS) to guide sedation titration.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "ICU sedation targets",
    pharmacologyCategory: "Ventilated Patient Medication Delivery"
  },
  {
    id: "rrt-pharm-148",
    stem: "A CF patient receives aztreonam lysine (Cayston) via eFlow nebulizer. What spectrum of activity does this antibiotic cover?",
    options: [
      "Gram-negative bacteria, specifically Pseudomonas aeruginosa in CF airways",
      "Gram-positive bacteria including MRSA",
      "Fungal organisms including Aspergillus",
      "Viral pathogens including RSV"
    ],
    correctIndex: 0,
    rationale: "Aztreonam lysine (Cayston) is a monobactam antibiotic with activity exclusively against gram-negative bacteria, particularly Pseudomonas aeruginosa. The inhaled formulation was specifically developed for CF patients with chronic Pseudomonas colonization and is delivered via the Altera/eFlow nebulizer system.",
    distractorExplanations: [
      "Aztreonam has NO gram-positive activity. It is unique among beta-lactams in this regard.",
      "Aztreonam has no antifungal properties.",
      "Aztreonam has no antiviral activity."
    ],
    clinicalConcept: "Aztreonam is notable for having no cross-reactivity with penicillin allergy (can be used in penicillin-allergic patients), unlike other beta-lactam antibiotics. The inhaled formulation bypasses systemic side effects.",
    examTip: "Inhaled CF antibiotics: tobramycin (TOBI), aztreonam (Cayston), colistin — all target Pseudomonas. Given in alternating 28-day on/off cycles. Know the specific nebulizer systems required.",
    safetyPearl: "Cayston requires the specific Altera nebulizer system. It should not be mixed with other medications. Pre-treat with bronchodilator. Monitor for bronchospasm during administration.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "inhaled monobactam",
    pharmacologyCategory: "Route of Administration"
  },
  {
    id: "rrt-pharm-149",
    stem: "A patient receiving prone ventilation for ARDS has a bronchodilator ordered. What practical consideration should the RT address regarding aerosol delivery during prone positioning?",
    options: [
      "Ensure the nebulizer or MDI adapter remains above the fluid level and functional; gravity effects may alter drug pooling in the circuit",
      "Aerosol therapy is completely contraindicated during prone positioning",
      "Drug delivery is always better in prone vs. supine",
      "No adjustments are needed"
    ],
    correctIndex: 0,
    rationale: "During prone positioning, the orientation of the ventilator circuit changes. The RT must ensure that the nebulizer or MDI adapter remains properly positioned, that condensate does not pool and obstruct the aerosol path, and that the circuit orientation allows effective drug delivery. Gravity effects may cause fluid to collect differently.",
    distractorExplanations: [
      "Aerosol therapy is NOT contraindicated during prone positioning — it can be safely administered with appropriate attention to circuit orientation.",
      "Drug delivery is not universally better in prone position. Regional deposition patterns change.",
      "Adjustments are needed to account for circuit orientation changes and gravity effects on condensate."
    ],
    clinicalConcept: "Prone positioning is maintained for ≥16 hours/day in severe ARDS. During this time, all routine respiratory care (suctioning, aerosol therapy, assessment) must continue with appropriate modifications.",
    examTip: "Prone positioning + aerosol: practical considerations include circuit orientation, condensate management, adapter positioning, and monitoring for disconnections during position changes.",
    safetyPearl: "Always verify circuit integrity, ETT position (capnography), and drug delivery device function AFTER prone turning. Position changes are the highest-risk time for accidental extubation and circuit disconnection.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "prone positioning aerosol management",
    pharmacologyCategory: "Ventilated Patient Medication Delivery"
  },
  {
    id: "rrt-pharm-150",
    stem: "A physician writes an order for 'gentamicin via nebulizer' for a patient with bronchiectasis. The pharmacy sends IV gentamicin solution. Is this appropriate?",
    options: [
      "The RT should verify with pharmacy — IV formulations may contain preservatives (sulfites) unsuitable for inhalation",
      "IV solutions are always safe for nebulization",
      "Any liquid medication can be nebulized safely",
      "The RT should refuse to administer any inhaled antibiotic"
    ],
    correctIndex: 0,
    rationale: "IV gentamicin formulations may contain preservatives (sodium metabisulfite, EDTA, phenol) that can cause bronchospasm when inhaled. Preservative-free IV formulations exist and are preferred for nebulization. The RT should verify with pharmacy that the preparation is preservative-free before administering.",
    distractorExplanations: [
      "Not all IV formulations are suitable for inhalation. Preservatives and additives must be checked.",
      "Not all liquid medications can be safely nebulized. Osmolality, pH, preservatives, and stability must be considered.",
      "Inhaled antibiotics are a legitimate treatment modality. The concern is about the specific formulation, not the practice."
    ],
    clinicalConcept: "Off-label nebulization of IV formulations is common in practice (colistin, aminoglycosides, vancomycin). Safety requires: preservative-free formulation, appropriate pH and osmolality, and pre-treatment with bronchodilator.",
    examTip: "When nebulizing IV drug formulations: verify preservative-free status, check pH/osmolality, pre-treat with bronchodilator, and monitor for bronchospasm. This is a medication safety question.",
    safetyPearl: "Sulfite preservatives in IV formulations are the most common cause of bronchospasm from nebulized IV preparations. Always request preservative-free formulations from pharmacy for nebulization.",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "IV to nebulizer formulation safety",
    pharmacologyCategory: "Physician-Order Clarification"
  },
  {
    id: "rrt-pharm-151",
    stem: "A patient with bronchiectasis performs pre- and post-bronchodilator spirometry. Pre-BD FEV1/FVC is 58% and post-BD FEV1/FVC is 60%. Pre-BD FEV1 is 1.5 L and post-BD FEV1 is 1.55 L. What does this indicate?",
    options: [
      "Fixed airway obstruction with minimal bronchodilator reversibility, more consistent with bronchiectasis/COPD pattern than asthma",
      "Significant bronchodilator response indicating asthma",
      "Normal lung function",
      "Restrictive lung disease"
    ],
    correctIndex: 0,
    rationale: "The FEV1/FVC ratio is reduced (<70%) indicating obstruction. The post-BD improvement is only 3.3% and 50 mL — far below the ≥12% AND ≥200 mL criteria for significant reversibility. This fixed (non-reversible) obstruction pattern is typical of bronchiectasis and COPD, as opposed to the reversible obstruction seen in asthma.",
    distractorExplanations: [
      "3.3% improvement and 50 mL absolute change do not meet criteria for significant reversibility.",
      "FEV1/FVC of 58% is clearly abnormal (normal ≥70%). This is not normal lung function.",
      "Low FEV1/FVC ratio indicates obstruction, not restriction. Restriction shows normal or increased FEV1/FVC with reduced FVC."
    ],
    clinicalConcept: "Bronchiectasis causes structural airway damage with fixed obstruction. Unlike asthma (reversible obstruction), bronchiectasis airways are permanently dilated and do not respond well to bronchodilators. Treatment focuses on airway clearance and infection control.",
    examTip: "Fixed obstruction (minimal BD response) = COPD, bronchiectasis. Reversible obstruction (significant BD response) = asthma. Mixed picture = asthma-COPD overlap (ACO).",
    safetyPearl: "Even with minimal spirometric response, some bronchiectasis patients report subjective improvement with bronchodilators. Clinical response should be considered alongside objective spirometric data.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "fixed vs reversible obstruction",
    pharmacologyCategory: "Bronchodilator Response Interpretation"
  },
  {
    id: "rrt-pharm-152",
    stem: "An order is received for 'albuterol via SVN with 6 L/min oxygen.' The patient is on a 28% Venturi mask for controlled oxygen therapy due to chronic CO2 retention. What concern does this create?",
    options: [
      "The 6 L/min O2 driving the nebulizer delivers a higher FiO2 than the prescribed 28%, potentially suppressing hypoxic drive",
      "6 L/min is insufficient to drive the nebulizer",
      "Albuterol cannot be driven with oxygen",
      "The Venturi mask will filter out the albuterol"
    ],
    correctIndex: 0,
    rationale: "An SVN driven by 6 L/min oxygen delivers approximately 100% oxygen from the nebulizer output. For a chronic CO2 retainer on controlled 28% FiO2, this sudden increase in FiO2 during treatment may suppress hypoxic ventilatory drive, potentially worsening hypoventilation and hypercapnia.",
    distractorExplanations: [
      "6 L/min is the standard flow for driving an SVN — it is adequate.",
      "SVNs can be and routinely are driven by oxygen flow.",
      "The Venturi mask is removed during nebulizer treatment. They are not used simultaneously."
    ],
    clinicalConcept: "Options for CO2 retainers needing nebulized medications: (1) Drive SVN with compressed air instead of oxygen, (2) Use MDI + spacer (no supplemental gas needed), (3) If using O2-driven SVN, limit treatment duration and monitor closely.",
    examTip: "CO2 retainer + O2-driven nebulizer = risk of hypoxic drive suppression. Solution: drive the SVN with compressed air (if available) or use MDI + spacer. This is a HIGH-YIELD clinical reasoning question.",
    safetyPearl: "After SVN treatment with O2 in a CO2 retainer, immediately return to the prescribed controlled O2 device (Venturi mask) and monitor for increased drowsiness, decreased respiratory rate, or worsening hypercapnia.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "oxygen-driven nebulizer in COPD",
    pharmacologyCategory: "Route of Administration"
  },
  {
    id: "rrt-pharm-153",
    stem: "A neonatal patient receives vitamin A supplementation. What is the evidence-based respiratory benefit?",
    options: [
      "Reduced incidence of bronchopulmonary dysplasia (BPD) in very low birth weight infants",
      "Treatment of neonatal pneumonia",
      "Prevention of surfactant deficiency",
      "Treatment of persistent pulmonary hypertension"
    ],
    correctIndex: 0,
    rationale: "Vitamin A (retinol) supplementation has been shown to reduce the incidence of bronchopulmonary dysplasia (BPD) in very low birth weight premature infants. Vitamin A is essential for normal lung growth, epithelial cell differentiation, and repair of damaged airway epithelium.",
    distractorExplanations: [
      "Vitamin A does not directly treat pneumonia. Antibiotics are used for neonatal pneumonia.",
      "Surfactant production is not directly enhanced by vitamin A. Antenatal steroids promote surfactant production.",
      "PPHN is treated with inhaled nitric oxide and other pulmonary vasodilators, not vitamin A."
    ],
    clinicalConcept: "BPD is a chronic lung disease of prematurity characterized by arrested alveolar development and fibrosis. Risk factors include prematurity, mechanical ventilation, oxygen toxicity, and infection.",
    examTip: "BPD prevention strategies: gentle ventilation, caffeine, vitamin A, early surfactant, and minimizing oxygen exposure. Vitamin A is given IM 3 times/week for 4 weeks.",
    safetyPearl: "Vitamin A is given as intramuscular injection (5000 IU, 3 times/week × 4 weeks). Monitor for injection site reactions. Excessive vitamin A can cause toxicity (hepatotoxicity, increased intracranial pressure).",
    difficulty: 4,
    category: "Respiratory Pharmacology",
    topic: "BPD prevention",
    pharmacologyCategory: "Neonatal Concepts"
  },
  {
    id: "rrt-pharm-154",
    stem: "A 5-year-old child with asthma uses a breath-actuated MDI (Autohaler). What advantage does this device have over a standard pMDI?",
    options: [
      "Automatically releases medication when the patient inhales, eliminating the coordination requirement",
      "It delivers medication without any patient effort",
      "It is cheaper than standard MDI",
      "It provides higher lung deposition than any other device"
    ],
    correctIndex: 0,
    rationale: "Breath-actuated MDIs (e.g., Autohaler, Easi-Breathe) use an internal mechanism triggered by the patient's inspiratory flow to automatically release the medication. This eliminates the need for hand-breath coordination, which is the most common MDI technique error, particularly in children.",
    distractorExplanations: [
      "The patient must still inhale — the device simply times the release to match the inhalation. It requires inspiratory effort.",
      "Breath-actuated MDIs may cost more than standard pMDIs.",
      "Lung deposition is improved compared to poor-technique pMDI use but is not necessarily higher than all other devices."
    ],
    clinicalConcept: "Breath-actuated MDIs bridge the gap between standard pMDIs (require coordination) and DPIs (require high inspiratory flow). They are suitable for patients who cannot coordinate pMDI actuation but can generate moderate inspiratory flow.",
    examTip: "Device selection hierarchy for coordination problems: breath-actuated MDI or DPI (no coordination needed) > pMDI + spacer (reduces coordination need) > standard pMDI (requires full coordination).",
    safetyPearl: "Breath-actuated MDIs still require slow, deep inhalation and breath-holding. The device timing solves coordination but does not fix other technique errors (too fast inhalation, no breath-hold).",
    difficulty: 2,
    category: "Respiratory Pharmacology",
    topic: "breath-actuated inhaler",
    pharmacologyCategory: "Device Selection"
  },
  {
    id: "rrt-pharm-155",
    stem: "A respiratory therapist reviews the medication administration record and notices a patient received both a non-selective beta-blocker (propranolol) and albuterol nebulizer within the same hour. What pharmacologic interaction should be documented?",
    options: [
      "Propranolol blocks beta-2 receptors, significantly reducing or eliminating albuterol's bronchodilator effect",
      "These medications enhance each other's effects",
      "There is no interaction between these drug classes",
      "Propranolol enhances albuterol absorption"
    ],
    correctIndex: 0,
    rationale: "Non-selective beta-blockers (propranolol) block both beta-1 (cardiac) and beta-2 (pulmonary) receptors. Blocking beta-2 receptors directly antagonizes albuterol's bronchodilator effect and can precipitate severe bronchospasm. This is a significant drug interaction that should be documented and reported.",
    distractorExplanations: [
      "These medications are pharmacologic antagonists, not synergists. They have opposing effects on beta-2 receptors.",
      "This is a well-known and clinically significant drug-receptor interaction.",
      "Propranolol does not affect albuterol absorption — it blocks the receptor that albuterol activates."
    ],
    clinicalConcept: "Pharmacologic antagonism: when two drugs compete for the same receptor with opposite effects. Propranolol (blocker) vs. albuterol (agonist) at the beta-2 receptor = competitive antagonism, with the drug in higher concentration or receptor affinity dominating.",
    examTip: "Non-selective beta-blocker + beta-2 agonist = pharmacologic antagonism. The bronchodilator may not work. If a patient on a beta-blocker needs bronchodilation, use ipratropium (anticholinergic) instead.",
    safetyPearl: "Report this interaction to the physician. If the patient has both cardiac and pulmonary indications, consider switching to a cardioselective beta-blocker (metoprolol, atenolol, bisoprolol) which has less beta-2 blockade at therapeutic doses.",
    difficulty: 3,
    category: "Respiratory Pharmacology",
    topic: "beta-blocker drug interaction",
    pharmacologyCategory: "Contraindications"
  }
];
