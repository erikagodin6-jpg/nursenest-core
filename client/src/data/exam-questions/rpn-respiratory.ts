import type { ExamQuestion } from "./types";

export const rpnRespiratoryQuestions: ExamQuestion[] = [
  // ===== COPD MANAGEMENT/EXACERBATION (Questions 1-13) =====
  {
    q: "A 68-year-old client with COPD presents with BP 138/82, HR 98, RR 26, SpO2 86% on room air. The client is using accessory muscles and reports increased sputum production over the past two days. Which nursing action is the priority?",
    o: ["Apply low-flow oxygen at 1 to 2 L/min via nasal cannula as ordered and monitor the client's response", "Encourage the client to perform incentive spirometry every hour", "Administer a bronchodilator via metered-dose inhaler without a spacer", "Position the client supine to reduce work of breathing"],
    a: 0,
    r: "Clients with COPD are at risk for CO2 retention, so low-flow oxygen (1 to 2 L/min) is started cautiously. SpO2 of 86% indicates significant hypoxemia requiring supplemental oxygen. High-flow oxygen could suppress the hypoxic drive. Supine positioning increases dyspnea. Incentive spirometry does not address the acute hypoxemia.",
    s: "Respiratory"
  },
  {
    q: "A 74-year-old client with a history of COPD exacerbation is receiving oxygen via Venturi mask at 28% FiO2. Repeat SpO2 reads 91%. The client appears more comfortable with decreased accessory muscle use. Which action should the nurse take next?",
    o: ["Continue monitoring and document the client's improved respiratory status", "Increase the FiO2 to 60% to raise the SpO2 further", "Remove the Venturi mask and switch to a non-rebreather mask at 15 L/min", "Discontinue the oxygen since the client reports feeling better"],
    a: 0,
    r: "A target SpO2 of 88% to 92% is recommended for COPD clients to avoid suppressing the hypoxic ventilatory drive. The client shows clinical improvement and SpO2 is within the acceptable range. Increasing to high-flow oxygen risks CO2 retention. Discontinuing oxygen prematurely could cause desaturation.",
    s: "Respiratory"
  },
  {
    q: "A 70-year-old client with stable COPD is being discharged with a new prescription for tiotropium bromide (Spiriva). BP is 126/78, HR 72, RR 18, SpO2 93% on room air. Which statement by the client indicates effective teaching?",
    o: ["I will use this inhaler once daily to keep my airways open and prevent flare-ups", "I will use this inhaler only when I feel short of breath during an acute attack", "I should use this medication before my salbutamol puffer every time", "I will stop taking this once my breathing improves for a week"],
    a: 0,
    r: "Tiotropium is a long-acting anticholinergic bronchodilator taken once daily for maintenance therapy in COPD. It is not a rescue inhaler. It should be continued as prescribed to maintain airway patency, not discontinued when symptoms improve. Salbutamol is the rescue inhaler used for acute symptoms.",
    s: "Respiratory"
  },
  {
    q: "A 66-year-old client with COPD is being assessed during a follow-up visit. BP 130/80, HR 80, RR 20, SpO2 92% on room air. The client reports sleeping with three pillows and waking short of breath at night. Which finding should the nurse report to the healthcare provider first?",
    o: ["The orthopnea and paroxysmal nocturnal dyspnea, as these may indicate developing cor pulmonale", "The SpO2 of 92%, since it is below normal range", "The resting heart rate of 80, which may suggest tachycardia", "The blood pressure of 130/80, as it requires antihypertensive treatment"],
    a: 0,
    r: "Orthopnea (sleeping with three pillows) and paroxysmal nocturnal dyspnea in a COPD client suggest right-sided heart failure (cor pulmonale), a serious complication of chronic pulmonary disease. SpO2 of 92% is within acceptable range for COPD. HR 80 and BP 130/80 are within normal limits.",
    s: "Respiratory"
  },
  {
    q: "A 72-year-old client with COPD is admitted with an acute exacerbation. ABG results show pH 7.30, PaCO2 58 mmHg, HCO3 30 mEq/L, PaO2 54 mmHg. SpO2 is 84%. Which interpretation is most accurate?",
    o: ["Partially compensated respiratory acidosis with hypoxemia, consistent with COPD exacerbation", "Fully compensated metabolic alkalosis", "Uncompensated metabolic acidosis", "Normal ABG values expected in chronic COPD"],
    a: 0,
    r: "The pH is acidotic (below 7.35), PaCO2 is elevated (above 45 mmHg, respiratory cause), and HCO3 is elevated (above 26, indicating renal compensation but not fully corrected since pH is still acidotic). PaO2 of 54 confirms hypoxemia. This pattern is classic for an acute-on-chronic COPD exacerbation.",
    s: "Respiratory"
  },
  {
    q: "A 65-year-old client with severe COPD is prescribed home oxygen therapy at 2 L/min via nasal cannula. BP 128/76, HR 76, RR 20, SpO2 89% on room air. Which safety instruction should the nurse emphasize?",
    o: ["Keep the oxygen at least 3 metres away from open flames and do not smoke while using it", "Increase the oxygen flow rate to 6 L/min during meals for extra energy", "Use petroleum-based lip balm to prevent nasal dryness from the cannula", "Store oxygen tanks in a closed closet to prevent accidental damage"],
    a: 0,
    r: "Oxygen supports combustion and must be kept away from open flames, sparks, and smoking materials. Petroleum-based products are flammable and should not be used near oxygen; water-soluble products are recommended instead. Oxygen tanks should be stored in well-ventilated areas, not enclosed spaces. Flow rates should not be adjusted without a provider order.",
    s: "Respiratory"
  },
  {
    q: "A 69-year-old client with COPD is performing pursed-lip breathing during ambulation. BP 132/78, HR 88, RR 22, SpO2 90%. Which observation indicates the client is performing the technique correctly?",
    o: ["The client inhales slowly through the nose and exhales through pursed lips for twice as long as inhalation", "The client inhales and exhales rapidly through the mouth to increase air exchange", "The client holds their breath for 10 seconds between each inhalation", "The client breathes deeply through the mouth with forced expiration"],
    a: 0,
    r: "Pursed-lip breathing involves slow nasal inhalation followed by exhalation through pursed lips with an exhalation time approximately twice the inhalation time. This creates back pressure that keeps airways open longer, prevents air trapping, and improves gas exchange. Rapid breathing or breath-holding would be ineffective or harmful.",
    s: "Respiratory"
  },
  {
    q: "A 71-year-old client with COPD and a barrel chest is being assessed. BP 134/84, HR 82, RR 22, SpO2 91% on 2 L/min nasal cannula. The nurse notes decreased breath sounds bilaterally with prolonged expiration. Which assessment finding is most consistent with the client's diagnosis?",
    o: ["Hyperresonance on percussion due to air trapping in the lungs", "Dullness on percussion indicating fluid accumulation", "Increased tactile fremitus over the lung bases", "Bronchial breath sounds heard over the peripheral lung fields"],
    a: 0,
    r: "Barrel chest in COPD results from chronic air trapping and hyperinflation. Percussion reveals hyperresonance due to excess air in the lungs. Dullness suggests fluid or consolidation. Decreased tactile fremitus (not increased) occurs with air trapping. Bronchial sounds in peripheral fields suggest consolidation, not COPD.",
    s: "Respiratory"
  },
  {
    q: "A 67-year-old client with COPD is prescribed prednisone 40 mg daily for a 5-day course during an acute exacerbation. BP 140/86, HR 90, RR 24, SpO2 88% on 2 L/min. The client asks why the medication cannot be stopped after feeling better on day 2. Which response is most appropriate?",
    o: ["Completing the full course is important to fully reduce airway inflammation and prevent a rebound flare-up", "You can stop the prednisone whenever your breathing feels normal again", "Prednisone works as a bronchodilator, so stopping early will close your airways", "This medication has no side effects, so there is no harm in continuing longer than prescribed"],
    a: 0,
    r: "Short-course systemic corticosteroids reduce airway inflammation during COPD exacerbations. The full course should be completed to achieve maximum anti-inflammatory effect and prevent symptom rebound. Prednisone is not a bronchodilator. It does have significant side effects including hyperglycemia, immune suppression, and gastric irritation.",
    s: "Respiratory"
  },
  {
    q: "A 73-year-old client with COPD is being assessed in the clinic. BP 130/80, HR 78, RR 18, SpO2 93% on room air. The client reports using their salbutamol inhaler 6 times daily. Which action should the nurse take?",
    o: ["Report the frequent rescue inhaler use to the healthcare provider, as it indicates inadequate maintenance therapy", "Reassure the client that using salbutamol 6 times daily is within normal limits", "Instruct the client to double the salbutamol dose to reduce the frequency of use", "Discontinue the salbutamol and switch to deep breathing exercises only"],
    a: 0,
    r: "Frequent rescue inhaler use (more than 2 to 3 times per week for stable disease) suggests inadequate disease control and the need for maintenance therapy adjustment. The nurse should report this to the provider. Doubling the dose independently is outside nursing scope. Deep breathing alone cannot manage COPD.",
    s: "Respiratory"
  },
  {
    q: "A 76-year-old client with end-stage COPD has an advance directive specifying no intubation. BP 96/60, HR 112, RR 32, SpO2 78% on 3 L/min nasal cannula. The client is confused and drowsy. Which action should the nurse take?",
    o: ["Notify the healthcare provider immediately and initiate comfort measures as outlined in the advance directive", "Prepare for endotracheal intubation and mechanical ventilation", "Increase the oxygen to 15 L/min via non-rebreather mask without notifying the provider", "Discontinue the oxygen to honour the advance directive"],
    a: 0,
    r: "The advance directive specifies no intubation. The nurse must respect this while still notifying the provider about the clinical deterioration. Comfort measures, including appropriate oxygen and symptom management, should be provided. Intubation violates the directive. Unilaterally increasing high-flow oxygen risks CO2 narcosis. Discontinuing oxygen entirely is not consistent with comfort care.",
    s: "Respiratory"
  },
  {
    q: "A 64-year-old client newly diagnosed with COPD is learning to use a dry powder inhaler (DPI). BP 128/76, HR 74, RR 18, SpO2 94% on room air. Which instruction should the nurse provide?",
    o: ["Inhale quickly and deeply through the mouthpiece to ensure the powder reaches the airways", "Shake the inhaler vigorously before each use and exhale into the device first", "Inhale slowly through the nose while pressing the canister down", "Use a spacer with the DPI for better drug delivery"],
    a: 0,
    r: "Dry powder inhalers require a quick, deep inhalation to generate enough airflow to disperse the powder into fine particles that reach the lower airways. DPIs should not be shaken, exhaled into (moisture clumps the powder), or used with spacers. Slow inhalation is used with metered-dose inhalers, not DPIs.",
    s: "Respiratory"
  },
  {
    q: "A 70-year-old client with COPD and type 2 diabetes is receiving a prednisone taper. BP 142/88, HR 86, RR 20, SpO2 91% on 2 L/min. The morning blood glucose reads 14.2 mmol/L (previous baseline was 7.0 mmol/L). Which nursing action is most appropriate?",
    o: ["Report the elevated blood glucose to the healthcare provider, as corticosteroids commonly cause hyperglycemia", "Withhold the prednisone dose until the blood glucose normalizes", "Administer an extra dose of the client's oral hypoglycemic without an order", "Document the finding and recheck the glucose in 24 hours without reporting"],
    a: 0,
    r: "Corticosteroids cause hyperglycemia by promoting gluconeogenesis and insulin resistance. A blood glucose of 14.2 mmol/L (doubled from baseline) in a diabetic client requires reporting so the provider can adjust insulin or oral hypoglycemic dosing. Withholding prednisone or administering extra medication independently is outside RPN scope.",
    s: "Respiratory"
  },
  // ===== ASTHMA (Questions 14-26) =====
  {
    q: "A 22-year-old client presents to the emergency department with an acute asthma exacerbation. BP 118/74, HR 118, RR 32, SpO2 88%. The client is sitting upright, using accessory muscles, and can only speak in two-word phrases. Which action should the nurse prioritize?",
    o: ["Administer salbutamol via nebulizer as ordered and apply oxygen to maintain SpO2 above 92%", "Have the client lie flat to improve ventilation", "Administer a long-acting beta-2 agonist via metered-dose inhaler", "Encourage the client to drink warm fluids to thin secretions"],
    a: 0,
    r: "Two-word sentences indicate severe distress. Nebulized salbutamol provides rapid bronchodilation, and supplemental oxygen addresses the hypoxemia. Flat positioning worsens dyspnea. Long-acting beta-2 agonists are not for acute rescue. Warm fluids do not address the immediate bronchospasm and could increase aspiration risk during severe distress.",
    s: "Respiratory"
  },
  {
    q: "A 16-year-old client with asthma is being discharged with a fluticasone (Flovent) inhaler. BP 110/68, HR 78, RR 16, SpO2 98% on room air. Which instruction is essential for the nurse to include?",
    o: ["Rinse your mouth with water after each use to prevent oral thrush", "Use this inhaler only when you feel an asthma attack coming on", "Take two extra puffs if you feel short of breath during exercise", "This inhaler will provide immediate relief during an acute attack"],
    a: 0,
    r: "Inhaled corticosteroids like fluticasone can cause oral candidiasis (thrush) and dysphonia. Rinsing the mouth after each use reduces this risk. Fluticasone is a maintenance controller, not a rescue inhaler, and should be used daily as prescribed regardless of symptoms. It does not provide immediate bronchodilation.",
    s: "Respiratory"
  },
  {
    q: "A 10-year-old child with asthma is brought to the clinic by a parent. BP 100/60, HR 92, RR 22, SpO2 96% on room air. The parent reports the child has been using the rescue inhaler daily for the past month and waking with cough three times per week. Which assessment finding is most important to report?",
    o: ["The frequency of rescue inhaler use and nighttime symptoms, indicating poorly controlled asthma", "The SpO2 of 96%, as it is below the normal range for a child", "The respiratory rate of 22, which is abnormally high for this age", "The heart rate of 92, suggesting possible medication side effects"],
    a: 0,
    r: "Daily rescue inhaler use and frequent nighttime symptoms (more than twice per week) indicate uncontrolled asthma requiring step-up therapy. SpO2 of 96% is normal. RR of 22 is within normal range for a 10-year-old. HR of 92 is normal for this age group. The symptom pattern suggests the need for controller medication initiation or adjustment.",
    s: "Respiratory"
  },
  {
    q: "A 30-year-old client with known asthma is receiving a continuous salbutamol nebulizer treatment in the emergency department. BP 122/74, HR 130, RR 28, SpO2 90%. The client reports feeling jittery and having heart palpitations. Which action should the nurse take?",
    o: ["Document the findings and notify the healthcare provider, as tachycardia and tremor are expected side effects but require monitoring", "Immediately discontinue the nebulizer treatment", "Administer a dose of propranolol to control the heart rate", "Reassure the client that these symptoms will resolve and continue the treatment without reporting"],
    a: 0,
    r: "Tachycardia, tremor, and jitteriness are known side effects of beta-2 agonists like salbutamol. However, with a HR of 130 and ongoing hypoxemia (SpO2 90%), the provider should be notified to evaluate the treatment plan. Abruptly stopping treatment could worsen bronchospasm. Beta-blockers (propranolol) are contraindicated in asthma as they cause bronchoconstriction.",
    s: "Respiratory"
  },
  {
    q: "A 25-year-old client with asthma has been prescribed a combined fluticasone/salmeterol (Advair) inhaler. BP 114/70, HR 74, RR 16, SpO2 99% on room air. The client asks why the salbutamol inhaler is still needed. Which response is correct?",
    o: ["Advair is a controller medication taken daily, but salbutamol is still needed for sudden breakthrough symptoms", "You no longer need salbutamol since Advair contains a bronchodilator", "Advair replaces all other asthma medications entirely", "You should use salbutamol first and then Advair immediately after every time"],
    a: 0,
    r: "Advair combines an inhaled corticosteroid (fluticasone) with a long-acting beta-2 agonist (salmeterol) for daily maintenance. However, salmeterol has a slow onset and is not suitable for acute rescue. Salbutamol (short-acting beta-2 agonist) is still required for rapid relief of acute bronchospasm.",
    s: "Respiratory"
  },
  {
    q: "A 19-year-old client with exercise-induced asthma asks the nurse about prevention strategies. BP 112/66, HR 68, RR 14, SpO2 99% on room air. Which instruction is most appropriate?",
    o: ["Use your salbutamol inhaler 15 to 30 minutes before exercise to prevent bronchospasm", "Avoid all forms of physical activity to prevent asthma attacks", "Take an extra dose of your maintenance inhaler right before exercising", "Exercise only in cold, dry air, as it opens the airways more effectively"],
    a: 0,
    r: "Pre-treatment with salbutamol 15 to 30 minutes before exercise is the standard recommendation for exercise-induced bronchospasm. Avoiding all exercise is unnecessary and harmful to overall health. Extra maintenance inhaler doses are not indicated. Cold, dry air actually triggers bronchospasm in many asthmatic clients.",
    s: "Respiratory"
  },
  {
    q: "A 35-year-old client with severe persistent asthma presents with a silent chest on auscultation. BP 100/60, HR 140, RR 36, SpO2 82%. The client appears exhausted and confused. Which finding is most alarming?",
    o: ["The silent chest, indicating severe air trapping with minimal air movement and impending respiratory failure", "The blood pressure of 100/60, suggesting dehydration", "The respiratory rate of 36, indicating the client is hyperventilating", "The heart rate of 140, suggesting anxiety"],
    a: 0,
    r: "A silent chest in an asthmatic client is an ominous sign indicating such severe bronchoconstriction that there is insufficient air movement to produce wheezing. Combined with confusion, exhaustion, and profound hypoxemia (SpO2 82%), this signals impending respiratory arrest. This is a medical emergency requiring immediate intervention.",
    s: "Respiratory"
  },
  {
    q: "A nurse is teaching a 14-year-old client with asthma about trigger avoidance. The client lives with two cats and has a bedroom with carpet. BP 108/64, HR 76, RR 16, SpO2 98% on room air. Which recommendation is most appropriate?",
    o: ["Keep the cats out of the bedroom, use allergen-proof bedding covers, and consider replacing carpet with hard flooring", "Rehome the cats immediately, as pets are the only cause of asthma triggers", "Use scented air fresheners to mask allergens in the home", "Open the windows during high pollen count days to increase ventilation"],
    a: 0,
    r: "Environmental modifications include reducing allergen exposure by keeping pets out of sleeping areas, using allergen-proof covers, and removing carpet (which traps dust mites and dander). Rehoming pets may not be necessary if exposure is minimized. Scented products can be triggers. Opening windows during high pollen counts increases allergen exposure.",
    s: "Respiratory"
  },
  {
    q: "A 28-year-old client with asthma is being taught how to use a metered-dose inhaler (MDI) with a spacer. BP 116/72, HR 72, RR 16, SpO2 98% on room air. Which step indicates the client needs further teaching?",
    o: ["The client inhales rapidly and forcefully through the spacer immediately after pressing the canister", "The client shakes the inhaler before each puff", "The client exhales fully before placing the mouthpiece in their mouth", "The client holds their breath for approximately 10 seconds after inhaling"],
    a: 0,
    r: "With an MDI and spacer, the inhalation should be slow and deep (not rapid and forceful) to allow the medication particles to be carried deep into the lower airways. Rapid inhalation causes the medication to deposit in the throat. Shaking the inhaler, exhaling before use, and breath-holding are all correct techniques.",
    s: "Respiratory"
  },
  {
    q: "A 40-year-old client presents to the emergency department with status asthmaticus. After three nebulized salbutamol treatments, SpO2 remains at 87%, BP 108/68, HR 132, RR 34. The client is diaphoretic and using accessory muscles. Which action should the nurse anticipate?",
    o: ["Prepare for possible intubation and mechanical ventilation while continuing bronchodilator therapy as ordered", "Discharge the client with a prescription for oral corticosteroids", "Administer a fourth nebulizer treatment and wait 30 minutes before reassessing", "Position the client in left lateral recumbent position to improve gas exchange"],
    a: 0,
    r: "Status asthmaticus that does not respond to aggressive bronchodilator therapy may progress to respiratory failure requiring intubation and mechanical ventilation. The persistent hypoxemia, tachycardia, and diaphoresis after three treatments suggest inadequate response. Discharging this client would be unsafe. Lateral positioning does not address the underlying bronchospasm.",
    s: "Respiratory"
  },
  {
    q: "A 8-year-old child with asthma is admitted with an exacerbation. The provider orders ipratropium bromide via nebulizer in addition to salbutamol. BP 98/62, HR 110, RR 28, SpO2 91% on room air. The parent asks why two breathing treatments are needed. Which explanation is most accurate?",
    o: ["These two medications work by different mechanisms to open the airways more effectively together than either one alone", "Ipratropium replaces salbutamol when the first medication stops working", "Both medications are the same type of drug given in different doses", "Ipratropium is given to counteract the side effects of salbutamol"],
    a: 0,
    r: "Salbutamol is a beta-2 agonist that relaxes bronchial smooth muscle, while ipratropium is an anticholinergic that blocks vagal-mediated bronchoconstriction. Together they provide additive bronchodilation through different pathways. They are not the same drug class and ipratropium is not given to counteract salbutamol side effects.",
    s: "Respiratory"
  },
  {
    q: "A 45-year-old client with moderate persistent asthma has been well controlled for 6 months on fluticasone and a long-acting beta-2 agonist. BP 120/76, HR 70, RR 14, SpO2 98% on room air. The client asks about stopping the controller medications. Which response is most appropriate?",
    o: ["Continue the medications as prescribed and discuss any changes with your healthcare provider, as asthma is a chronic condition", "You can safely stop all medications since you have been symptom-free for 6 months", "Reduce the dose by half on your own and see if symptoms return", "Switch to using only the rescue inhaler as needed instead of the controller medications"],
    a: 0,
    r: "Asthma is a chronic inflammatory condition, and stopping controller medications without medical guidance can lead to loss of control and exacerbation. Step-down therapy should only be done gradually under healthcare provider supervision after a sustained period of good control. Self-adjusting medications is unsafe.",
    s: "Respiratory"
  },
  // ===== PNEUMONIA (Questions 27-39) =====
  {
    q: "A 78-year-old client is admitted with community-acquired pneumonia. BP 98/58, HR 108, RR 28, SpO2 89% on room air, temperature 39.2 degrees Celsius. The nurse notes coarse crackles in the right lower lobe. Which intervention should the nurse implement first?",
    o: ["Apply supplemental oxygen as ordered and position the client in semi-Fowler's to optimize ventilation", "Administer the prescribed antibiotic after confirming blood cultures have been collected", "Encourage oral fluid intake of at least 3 litres per day", "Apply a cooling blanket to reduce the fever immediately"],
    a: 0,
    r: "With SpO2 of 89% and tachypnea (RR 28), addressing hypoxemia is the immediate priority. Semi-Fowler's position maximizes lung expansion. Antibiotics are important but are given after blood cultures and after addressing the ABCs. Forcing fluids may not be safe with the hypotension. Fever management is secondary to oxygenation.",
    s: "Respiratory"
  },
  {
    q: "A 82-year-old client in a long-term care facility develops hospital-acquired pneumonia. BP 110/64, HR 96, RR 24, SpO2 92% on room air, temperature 38.6 degrees Celsius. The client has a productive cough with green sputum. Which assessment finding should the nurse report immediately?",
    o: ["The change in sputum colour to green, combined with fever and tachycardia, indicating possible worsening infection", "The SpO2 of 92%, as it is a critical finding", "The blood pressure of 110/64, suggesting shock", "The respiratory rate of 24, which is abnormally high for this age"],
    a: 0,
    r: "Green (purulent) sputum combined with fever and tachycardia in a hospitalized older adult suggests bacterial infection progression and possible need for antibiotic change. SpO2 of 92% is within acceptable range. BP 110/64 may be normal for this client. A slightly elevated RR alone is less significant than the combined clinical picture.",
    s: "Respiratory"
  },
  {
    q: "A 55-year-old client with pneumonia has an order for sputum culture and sensitivity. BP 122/78, HR 88, RR 22, SpO2 94% on 2 L/min, temperature 38.4 degrees Celsius. Which instruction should the nurse provide for proper specimen collection?",
    o: ["Collect the specimen first thing in the morning by coughing deeply into the sterile container before eating, drinking, or using mouthwash", "Collect the specimen after the client eats breakfast to ensure they have energy to cough", "Have the client spit saliva into the container at any time during the day", "Collect the specimen after starting antibiotics to see which organisms survive"],
    a: 0,
    r: "Sputum for culture should be collected in the morning when secretions have pooled overnight, before oral intake or mouthwash that could contaminate the specimen. A deep cough produces sputum from the lower airways, not saliva. Ideally, specimens are collected before starting antibiotics to identify the causative organism accurately.",
    s: "Respiratory"
  },
  {
    q: "A 70-year-old client with pneumonia is receiving IV antibiotics. On day 3, the client develops watery diarrhea (6 episodes today), abdominal cramping, and a temperature of 38.8 degrees Celsius. BP 106/64, HR 100, RR 20, SpO2 94% on room air. Which complication should the nurse suspect?",
    o: ["Clostridioides difficile (C. difficile) infection secondary to antibiotic therapy", "A normal response to the pneumonia resolving", "Food poisoning from the hospital diet", "Lactose intolerance triggered by illness"],
    a: 0,
    r: "Watery diarrhea, abdominal cramping, and fever developing during antibiotic therapy are classic signs of C. difficile infection. Antibiotics disrupt normal gut flora, allowing C. difficile overgrowth. The nurse should report these findings, implement contact precautions, and anticipate orders for stool testing. This is not a normal part of pneumonia recovery.",
    s: "Respiratory"
  },
  {
    q: "A 60-year-old client with pneumonia has a chest X-ray showing right lower lobe consolidation. The nurse positions the client for optimal gas exchange. BP 118/72, HR 86, RR 22, SpO2 91% on 2 L/min. Which position is most beneficial?",
    o: ["Position the client with the unaffected (left) lung down to improve perfusion to the ventilated lung", "Position the client with the affected (right) lung down to promote drainage", "Place the client in a flat supine position to equalize ventilation", "Keep the client in Trendelenburg position to mobilize secretions"],
    a: 0,
    r: "Positioning with the good (unaffected) lung down takes advantage of gravity-dependent perfusion matching ventilation. Blood flow is greatest in the dependent lung, so placing the healthy lung down optimizes ventilation-perfusion matching. Placing the affected lung down directs more blood to the poorly ventilated lung. Supine and Trendelenburg positions do not optimize gas exchange.",
    s: "Respiratory"
  },
  {
    q: "A 85-year-old client in a long-term care facility is at high risk for aspiration pneumonia. BP 128/80, HR 76, RR 18, SpO2 95% on room air. The client has dysphagia and a history of stroke. Which preventive measure should the nurse prioritize?",
    o: ["Elevate the head of bed to at least 30 degrees during and for 30 minutes after meals, and follow the speech-language pathologist's diet recommendations", "Offer thin clear liquids to prevent dehydration", "Place the client supine immediately after meals to promote digestion", "Encourage the client to eat quickly to minimize fatigue"],
    a: 0,
    r: "Aspiration prevention in dysphagia includes keeping the HOB elevated during and after meals, following modified diet textures recommended by the speech-language pathologist, and allowing adequate time for eating. Thin liquids increase aspiration risk in dysphagia. Supine positioning after meals promotes aspiration. Rushed eating increases choking risk.",
    s: "Respiratory"
  },
  {
    q: "A 48-year-old client is admitted with pneumonia and has a history of alcohol use disorder. BP 104/66, HR 104, RR 26, SpO2 90% on room air, temperature 39.8 degrees Celsius. The nurse notes the client is malnourished with poor oral hygiene. Which factor increases this client's risk for a more severe course of pneumonia?",
    o: ["Alcohol use disorder, malnutrition, and poor oral hygiene all impair immune function and increase aspiration risk", "The client's age of 48, which places them in the highest risk category", "The respiratory rate of 26, which suggests the lungs cannot fight infection", "The blood pressure of 104/66, indicating the pneumonia has spread to the heart"],
    a: 0,
    r: "Alcohol use disorder suppresses immune function, impairs cough reflex, and increases aspiration risk. Malnutrition weakens immunity. Poor oral hygiene increases the bacterial load in the oropharynx, raising aspiration pneumonia risk. Age 48 alone is not high-risk. Tachypnea is a compensatory response. BP 104/66 does not indicate cardiac spread.",
    s: "Respiratory"
  },
  {
    q: "A 72-year-old client with pneumonia has been receiving IV ceftriaxone for 48 hours. Temperature has decreased from 39.4 to 37.8 degrees Celsius, BP 116/72, HR 84, RR 20, SpO2 94% on room air. The client is now tolerating oral intake. Which action should the nurse anticipate?",
    o: ["Transitioning from IV to oral antibiotics to continue treatment while preparing for discharge", "Discontinuing antibiotics since the fever has improved", "Switching to a different class of IV antibiotics due to lack of complete resolution", "Continuing the IV antibiotic for a minimum of 14 additional days"],
    a: 0,
    r: "Clinical improvement (decreasing fever, stable vitals, tolerating oral intake) within 48 to 72 hours of IV antibiotics supports IV-to-oral switch therapy. This allows earlier discharge. Stopping antibiotics prematurely risks relapse. Switching classes is not indicated when improvement is seen. Extended IV therapy is not standard for uncomplicated community-acquired pneumonia.",
    s: "Respiratory"
  },
  {
    q: "A 66-year-old immunocompromised client on chemotherapy develops pneumonia. BP 100/60, HR 112, RR 30, SpO2 86% on room air, temperature 38.0 degrees Celsius. WBC is 1.2 x 10^9/L. Which finding is most important for the nurse to consider when planning care?",
    o: ["The severely low WBC count, indicating neutropenia and impaired ability to fight the infection", "The low-grade temperature, which suggests the infection is mild", "The hypotension, which is likely caused by dehydration from chemotherapy", "The respiratory rate of 30, which is expected during any respiratory illness"],
    a: 0,
    r: "Neutropenia (WBC 1.2, normal 4.5 to 11.0 x 10^9/L) means the client has severely compromised immune defense against infection. In neutropenic clients, even a low-grade fever is significant because the impaired immune system may not mount a robust febrile response. The low WBC requires neutropenic precautions and aggressive treatment.",
    s: "Respiratory"
  },
  {
    q: "A 58-year-old client is admitted with community-acquired pneumonia and a parapneumonic pleural effusion. BP 114/70, HR 92, RR 24, SpO2 91% on 2 L/min. The client reports pleuritic chest pain rated 7 out of 10 that worsens with deep breathing. Which nursing intervention is most appropriate?",
    o: ["Administer prescribed analgesics and encourage the client to splint the chest wall during coughing and deep breathing", "Instruct the client to avoid coughing and deep breathing to minimize pain", "Apply ice packs to the affected side of the chest continuously", "Position the client on the unaffected side to eliminate the pain completely"],
    a: 0,
    r: "Pleuritic chest pain impairs the client's ability to breathe deeply and cough effectively, which can worsen atelectasis and pneumonia. Pain management with prescribed analgesics and chest splinting during coughing promotes effective airway clearance. Avoiding coughing and deep breathing would lead to secretion retention. Ice packs are not first-line. Side positioning helps but does not eliminate pain.",
    s: "Respiratory"
  },
  {
    q: "A nurse is providing discharge teaching to a 75-year-old client recovering from pneumonia. BP 122/74, HR 76, RR 18, SpO2 96% on room air. Which instruction is most important to include?",
    o: ["Complete the full course of antibiotics as prescribed, even if you feel better before they are finished", "Resume normal activity levels immediately upon discharge", "Avoid the pneumococcal vaccine since you already had pneumonia", "Take the antibiotics only when you feel short of breath"],
    a: 0,
    r: "Completing the full antibiotic course is essential to eradicate the infection and prevent antibiotic resistance. Activities should be resumed gradually. The pneumococcal vaccine is still recommended for prevention of future infections from other serotypes. Taking antibiotics intermittently promotes resistance and incomplete treatment.",
    s: "Respiratory"
  },
  {
    q: "A 68-year-old client with bilateral pneumonia is deteriorating despite treatment. BP 86/54, HR 124, RR 34, SpO2 82% on high-flow oxygen, temperature 40.1 degrees Celsius. Urine output has been 15 mL over the last 2 hours. Which complication should the nurse suspect?",
    o: ["Sepsis progressing to septic shock, as evidenced by hypotension, tachycardia, and oliguria", "Mild dehydration requiring increased oral fluid intake", "A normal inflammatory response to bilateral pneumonia", "Hypervolemia from excessive IV fluid administration"],
    a: 0,
    r: "Hypotension (BP 86/54), tachycardia (HR 124), high fever, and oliguria (15 mL in 2 hours, well below 0.5 mL/kg/hr) in the setting of pneumonia strongly suggest sepsis progressing to septic shock. This is a medical emergency requiring aggressive fluid resuscitation and vasopressor support. This is not a normal response or simple dehydration.",
    s: "Respiratory"
  },
  // ===== TUBERCULOSIS (Questions 40-52) =====
  {
    q: "A 45-year-old client is admitted with suspected active pulmonary tuberculosis. BP 118/74, HR 82, RR 20, SpO2 95% on room air. The client reports a productive cough with blood-tinged sputum for 3 weeks, night sweats, and a 5 kg weight loss. Which isolation precaution should the nurse implement?",
    o: ["Airborne precautions with placement in a negative pressure room and an N95 respirator for all staff entering the room", "Droplet precautions with a surgical mask for the client", "Contact precautions with gown and gloves only", "Standard precautions only, since TB is not contagious until confirmed"],
    a: 0,
    r: "Active pulmonary TB is transmitted via airborne droplet nuclei that remain suspended in the air. Airborne precautions include a private negative pressure room and fitted N95 respirators for staff. Droplet precautions are insufficient as TB particles are smaller than droplets. Precautions are implemented based on suspicion, not only after confirmation.",
    s: "Respiratory"
  },
  {
    q: "A 38-year-old client has a Mantoux tuberculin skin test (TST) placed. The client returns for reading 48 hours later. The nurse measures 12 mm of induration at the injection site. BP 120/76, HR 74, RR 16, SpO2 99% on room air. The client has no known risk factors. How should the nurse interpret this result?",
    o: ["A positive result for a client with no risk factors, as induration of 15 mm or greater is positive for low-risk individuals, but 12 mm requires further assessment of actual risk category", "A negative result, since the induration must be at least 15 mm to be positive", "A positive result for all populations regardless of risk factors", "An inconclusive result requiring immediate repeat testing"],
    a: 0,
    r: "TST interpretation depends on risk category. For individuals with no risk factors, 15 mm or more is positive. For healthcare workers or those from high-prevalence areas, 10 mm is positive. For immunocompromised clients, 5 mm is positive. At 12 mm with no risk factors, this needs careful risk category assessment but would be positive for medium-risk groups.",
    s: "Respiratory"
  },
  {
    q: "A 50-year-old client with confirmed active pulmonary TB is started on a four-drug regimen: isoniazid, rifampin, pyrazinamide, and ethambutol. BP 124/78, HR 76, RR 18, SpO2 96% on room air. Which side effect should the nurse monitor for specifically related to ethambutol?",
    o: ["Changes in visual acuity and colour discrimination, as ethambutol can cause optic neuritis", "Orange discolouration of urine and body fluids", "Peripheral neuropathy and tingling in the extremities", "Elevated uric acid levels and joint pain"],
    a: 0,
    r: "Ethambutol can cause optic neuritis, resulting in decreased visual acuity, loss of red-green colour discrimination, and central scotomas. Baseline and monthly eye examinations are recommended. Orange body fluids are a side effect of rifampin. Peripheral neuropathy is associated with isoniazid. Elevated uric acid is a side effect of pyrazinamide.",
    s: "Respiratory"
  },
  {
    q: "A 42-year-old client with active TB is on isoniazid therapy. The nurse plans to administer pyridoxine (vitamin B6) as prescribed. BP 116/72, HR 70, RR 16, SpO2 97% on room air. The client asks why the additional vitamin is needed. Which response is correct?",
    o: ["Isoniazid can cause peripheral neuropathy by interfering with vitamin B6 metabolism, so supplementation prevents this side effect", "Vitamin B6 increases the effectiveness of isoniazid against TB bacteria", "Pyridoxine protects the liver from isoniazid-induced hepatotoxicity", "The vitamin is given to improve your appetite during TB treatment"],
    a: 0,
    r: "Isoniazid inhibits pyridoxine (vitamin B6) metabolism, which can lead to peripheral neuropathy (tingling, numbness in hands and feet). Supplementation with pyridoxine 25 to 50 mg daily prevents this complication. Pyridoxine does not enhance antibiotic effectiveness, protect the liver, or improve appetite.",
    s: "Respiratory"
  },
  {
    q: "A 35-year-old client with latent TB infection is prescribed isoniazid monotherapy for 9 months. BP 118/70, HR 72, RR 16, SpO2 98% on room air. Which monitoring parameter is most important during treatment?",
    o: ["Liver function tests, as isoniazid can cause hepatotoxicity", "Complete blood count weekly for bone marrow suppression", "Serum creatinine monthly for nephrotoxicity", "Thyroid function tests for drug-induced hypothyroidism"],
    a: 0,
    r: "Isoniazid is hepatotoxic, and hepatitis is the most serious adverse effect. Liver function tests (AST, ALT) should be monitored at baseline and periodically throughout treatment, especially in clients over 35 years of age or those who consume alcohol. Clients should report symptoms of hepatitis such as nausea, jaundice, dark urine, and fatigue.",
    s: "Respiratory"
  },
  {
    q: "A 48-year-old client with active pulmonary TB has been on treatment for two weeks and asks when the airborne precautions can be discontinued. BP 120/74, HR 78, RR 18, SpO2 96% on room air. Which response is most accurate?",
    o: ["Airborne precautions are typically discontinued after three consecutive negative sputum AFB smears collected on separate days", "Precautions can be removed after 24 hours of antibiotic therapy", "You will remain in isolation for the full 6 to 9 months of treatment", "Precautions are discontinued once your chest X-ray returns to normal"],
    a: 0,
    r: "Airborne precautions for TB are discontinued when the client has three consecutive negative AFB sputum smears collected 8 to 24 hours apart, shows clinical improvement, and has been on effective therapy for at least 2 weeks. A single timeframe or chest X-ray normalization alone is not sufficient. Treatment continues for 6 to 9 months but isolation does not.",
    s: "Respiratory"
  },
  {
    q: "A 55-year-old client on rifampin for TB treatment calls the clinic concerned that their urine has turned orange-red. BP 122/76, HR 74, RR 16, SpO2 97% on room air. Which response by the nurse is most appropriate?",
    o: ["This is an expected and harmless side effect of rifampin and will resolve when the medication is completed", "This is a sign of kidney damage and you should stop the medication immediately", "You should go to the emergency department for evaluation right away", "Increase your water intake to 4 litres per day to flush the medication from your system"],
    a: 0,
    r: "Rifampin causes orange-red discolouration of urine, tears, sweat, and other body fluids. This is an expected pharmacological effect, not a sign of toxicity or organ damage. Clients should be warned about this before starting therapy, including the potential to stain contact lenses and clothing. The medication should not be discontinued.",
    s: "Respiratory"
  },
  {
    q: "A 30-year-old healthcare worker has a positive TST with 11 mm of induration. A chest X-ray is clear. BP 114/68, HR 68, RR 14, SpO2 99% on room air. The client is asymptomatic. Which interpretation is correct?",
    o: ["This indicates latent TB infection requiring treatment to prevent progression to active disease", "This confirms active pulmonary TB requiring immediate airborne precautions", "The clear chest X-ray means no TB exposure occurred and no treatment is needed", "The result is a false positive and should be repeated in 6 months"],
    a: 0,
    r: "For healthcare workers, 10 mm or greater induration is positive. A positive TST with a clear chest X-ray and no symptoms indicates latent TB infection (LTBI). The client has been exposed and infected but does not have active disease. Treatment of LTBI (typically isoniazid for 9 months) is recommended to prevent future reactivation.",
    s: "Respiratory"
  },
  {
    q: "A 60-year-old client with active TB is on directly observed therapy (DOT). BP 126/80, HR 80, RR 18, SpO2 95% on room air. The client expresses frustration about having someone watch them take their medication. Which response is most therapeutic?",
    o: ["I understand your frustration, but DOT ensures the medication is taken consistently, which protects your health and prevents drug-resistant TB from developing", "You are right, I will recommend stopping DOT since you seem responsible", "DOT is only required for clients who cannot be trusted to take their medications", "If you refuse DOT, you will be hospitalized for the remainder of your treatment"],
    a: 0,
    r: "DOT is a public health strategy to ensure medication adherence and prevent the development of multidrug-resistant TB. The nurse should validate the client's feelings while explaining the rationale. DOT is not a punishment or a trust issue. Threatening hospitalization is not therapeutic communication. Discontinuing DOT goes against public health guidelines.",
    s: "Respiratory"
  },
  {
    q: "A 40-year-old client with active pulmonary TB is being discharged on a four-drug regimen. BP 118/72, HR 74, RR 16, SpO2 97% on room air. Which discharge instruction is most critical?",
    o: ["Take all four medications exactly as prescribed for the full duration; stopping early or skipping doses can create drug-resistant TB", "You may stop taking medications once your symptoms resolve", "Wear an N95 respirator at all times, even at home alone", "Avoid all contact with other people for the entire treatment course"],
    a: 0,
    r: "Medication adherence for the full treatment duration (6 to 9 months) is the most critical instruction, as incomplete treatment is the primary cause of multidrug-resistant TB (MDR-TB). Symptoms may improve within weeks, but the bacilli require prolonged treatment for eradication. N95 masks are for healthcare workers. Social isolation for the entire course is unnecessary once non-infectious.",
    s: "Respiratory"
  },
  {
    q: "A nurse is screening clients in a shelter for TB exposure. A 52-year-old client who is HIV-positive has a TST with 4 mm of induration. BP 108/66, HR 82, RR 18, SpO2 96% on room air. How should the nurse interpret this result?",
    o: ["Positive for TB exposure, since 5 mm or greater is positive for HIV-positive clients, but 4 mm is technically negative and warrants further evaluation given the high-risk status", "Negative, and no further testing is needed", "Positive, requiring immediate isolation and treatment", "Inconclusive, requiring a repeat test in 2 weeks"],
    a: 0,
    r: "For HIV-positive clients, the positive threshold is 5 mm or more. At 4 mm, the result is technically negative but given the immunosuppression (which can cause false negatives due to anergy), further evaluation with interferon-gamma release assay (IGRA) blood testing may be warranted. The nurse should report this finding to the provider for clinical judgment.",
    s: "Respiratory"
  },
  {
    q: "A 65-year-old client with reactivated TB is producing large volumes of blood-tinged sputum. BP 102/60, HR 108, RR 26, SpO2 90% on 2 L/min. The client appears anxious and is coughing frequently. Which nursing action is the priority?",
    o: ["Position the client on the affected side, monitor for hemoptysis volume, and notify the healthcare provider immediately", "Encourage vigorous coughing to clear the blood from the airways", "Apply a cold compress to the chest to reduce bleeding", "Restrict all fluid intake to prevent further hemoptysis"],
    a: 0,
    r: "Positioning on the affected side prevents blood from draining into the unaffected lung (prevents aspiration of blood). The nurse should monitor hemoptysis volume, maintain the airway, and notify the provider urgently, as massive hemoptysis is a life-threatening complication of TB. Vigorous coughing may worsen bleeding. Cold compresses are ineffective. Fluid restriction is not indicated.",
    s: "Respiratory"
  },
  // ===== TRACHEOSTOMY CARE (Questions 53-65) =====
  {
    q: "A 58-year-old client with a new tracheostomy (post-day 2) begins coughing and the inner cannula becomes visibly occluded with thick secretions. BP 130/82, HR 96, RR 24, SpO2 90%. Which action should the nurse perform first?",
    o: ["Remove the inner cannula, clean or replace it, and suction the tracheostomy as needed", "Call the healthcare provider before touching the tracheostomy", "Remove the entire tracheostomy tube and replace it with a new one", "Administer oxygen via a face mask placed over the client's nose and mouth"],
    a: 0,
    r: "An occluded inner cannula is a common cause of airway obstruction in tracheostomy clients. The nurse should remove the inner cannula (it is designed to be removable), clean or replace it, and suction if needed. This is a routine nursing intervention. Removing the entire tube risks loss of the stoma. Face mask oxygen is ineffective with a tracheostomy in place.",
    s: "Respiratory"
  },
  {
    q: "A nurse is performing tracheostomy care on a 62-year-old client. BP 124/76, HR 78, RR 18, SpO2 96% on trach collar with 40% FiO2. Which technique demonstrates proper tracheostomy care?",
    o: ["Use sterile technique to clean the inner cannula with hydrogen peroxide followed by a normal saline rinse, and change the tracheostomy ties", "Use tap water and a regular washcloth to clean around the stoma", "Cut gauze squares from a larger gauze pad and place them around the stoma", "Tie the new tracheostomy ties in a knot at the back of the neck"],
    a: 0,
    r: "Tracheostomy care uses sterile technique. The inner cannula is cleaned with hydrogen peroxide (to dissolve secretions) and rinsed with sterile normal saline. Pre-cut tracheostomy dressings should be used (not cut gauze, which leaves loose fibres that can be aspirated). Ties are secured with one finger's space beneath them, not knotted tightly.",
    s: "Respiratory"
  },
  {
    q: "A 55-year-old client with a tracheostomy is being prepared for discharge. BP 120/74, HR 72, RR 16, SpO2 97% on room air via tracheostomy. The client's spouse will be the primary caregiver. Which teaching point is most critical?",
    o: ["Always keep a spare tracheostomy tube of the same size and one size smaller at the bedside in case of accidental decannulation", "The tracheostomy tube never needs to be replaced once inserted", "Suctioning should be performed on a strict schedule every 2 hours regardless of secretions", "The client can go swimming safely as long as the tracheostomy is covered"],
    a: 0,
    r: "Accidental decannulation is a life-threatening emergency. Having a spare tube (same size and one size smaller) at the bedside ensures rapid re-insertion. Tracheostomy tubes require regular changes per policy. Suctioning is done as needed based on assessment, not on a rigid schedule. Swimming is contraindicated as water entering the tracheostomy causes drowning.",
    s: "Respiratory"
  },
  {
    q: "A 60-year-old client with a cuffed tracheostomy tube is receiving mechanical ventilation. The nurse checks the cuff pressure and reads 30 cmH2O. BP 128/80, HR 82, RR set at 14, SpO2 98%. Which action should the nurse take?",
    o: ["Reduce the cuff pressure to between 20 and 25 cmH2O to prevent tracheal mucosal damage", "Increase the cuff pressure to 40 cmH2O for a better seal", "Deflate the cuff completely to allow the client to speak", "Document the pressure as normal and continue current care"],
    a: 0,
    r: "Tracheal cuff pressure should be maintained between 20 and 25 cmH2O (or 15 to 20 mmHg). Pressures above 25 cmH2O can exceed capillary perfusion pressure and cause tracheal mucosal ischemia, necrosis, and tracheomalacia. Increasing pressure worsens the risk. Complete deflation during mechanical ventilation causes air leak and loss of ventilation.",
    s: "Respiratory"
  },
  {
    q: "A 50-year-old client with a tracheostomy is found in bed with the tracheostomy tube dislodged. The stoma is less than 7 days old. BP 98/60, HR 120, RR 36, SpO2 78%. The client is in visible distress. Which action should the nurse take first?",
    o: ["Call for help, attempt to ventilate via the stoma with a bag-valve device, and prepare for oral intubation if reinsertion fails", "Attempt to reinsert the tracheostomy tube independently without calling for help", "Cover the stoma and administer oxygen via nasal cannula", "Wait for the respiratory therapist to arrive before taking any action"],
    a: 0,
    r: "Accidental decannulation of a fresh tracheostomy (less than 7 days) is a medical emergency because the tract is not yet mature and can close rapidly. The nurse should call for help immediately, attempt ventilation, and have intubation equipment ready since reinsertion into an immature tract may be difficult and should be done by an experienced provider.",
    s: "Respiratory"
  },
  {
    q: "A 64-year-old client with a tracheostomy reports feeling anxious about not being able to speak. BP 122/76, HR 80, RR 18, SpO2 95% on humidified air. The client is alert and oriented. Which intervention should the nurse implement?",
    o: ["Provide a communication board, pen and paper, and explore the possibility of a speaking valve with the healthcare team", "Reassure the client that speech will return spontaneously once the tracheostomy is removed", "Tell the client to mouth words slowly so the nurse can lip-read", "Inflate the tracheostomy cuff further to allow air to pass over the vocal cords"],
    a: 0,
    r: "Alternative communication methods (communication boards, writing materials) should be provided immediately. A speaking valve (Passy-Muir) may be appropriate if the client meets criteria (deflated cuff, adequate airway). Inflating the cuff prevents air from reaching the vocal cords and makes speech impossible. Lip-reading alone is not a reliable primary communication method.",
    s: "Respiratory"
  },
  {
    q: "A 70-year-old client with a tracheostomy develops subcutaneous emphysema around the stoma site. BP 132/84, HR 94, RR 24, SpO2 92% on trach collar. The nurse palpates crepitus in the neck and upper chest. Which action should the nurse take?",
    o: ["Notify the healthcare provider immediately, as subcutaneous emphysema may indicate a displaced tube or tracheal injury", "Apply a pressure dressing over the stoma to prevent further air leak", "Deflate the cuff and remove the tracheostomy tube", "Document the finding and reassess in 4 hours"],
    a: 0,
    r: "Subcutaneous emphysema (air in the subcutaneous tissue causing crepitus) around a tracheostomy site suggests the tube may be displaced or there may be tracheal injury, allowing air to leak into surrounding tissues. This requires urgent provider notification. Applying pressure, removing the tube, or delaying reporting could worsen the situation.",
    s: "Respiratory"
  },
  {
    q: "A nurse is suctioning a 56-year-old client's tracheostomy. During suctioning, the client's heart rate drops from 82 to 48 bpm and SpO2 drops from 96% to 84%. BP 118/72. Which action should the nurse take immediately?",
    o: ["Stop suctioning immediately, provide supplemental oxygen, and allow the client to recover before reassessing", "Continue suctioning to remove the remaining secretions quickly", "Increase the suction pressure to complete the procedure faster", "Administer atropine intravenously to increase the heart rate"],
    a: 0,
    r: "Vagal stimulation from suctioning can cause bradycardia, and the procedure also causes hypoxemia from oxygen removal. The nurse must stop suctioning immediately, hyperoxygenate the client, and allow recovery. Continuing or increasing suction worsens both problems. Atropine administration would require a provider order and is not the first action.",
    s: "Respiratory"
  },
  {
    q: "A 48-year-old client with a long-term tracheostomy is being assessed. The nurse notes granulation tissue forming around the stoma edge. BP 118/74, HR 74, RR 16, SpO2 97% on room air via tracheostomy. Which finding should the nurse report?",
    o: ["The granulation tissue, as it may cause bleeding, obstruction, or difficulty with tube changes and requires provider evaluation", "The SpO2 of 97%, as it is too high for a tracheostomy client", "The respiratory rate of 16, which may be too low", "The heart rate of 74, suggesting the client needs cardiac monitoring"],
    a: 0,
    r: "Granulation tissue around the tracheostomy stoma is a common complication that can bleed, obstruct the airway, and make tube changes difficult. It should be reported to the provider for evaluation and possible treatment (silver nitrate cauterization or surgical removal). SpO2 97%, RR 16, and HR 74 are all normal findings.",
    s: "Respiratory"
  },
  {
    q: "A 66-year-old client with a tracheostomy is eating lunch. The client suddenly develops coughing, food particles are visible in the tracheal secretions, and SpO2 drops from 96% to 88%. BP 130/82, HR 104, RR 28. Which complication has likely occurred?",
    o: ["Aspiration of food through the tracheostomy, requiring immediate suctioning and notification of the healthcare provider", "A normal coughing episode during eating that requires no intervention", "An allergic reaction to the food being consumed", "Tracheostomy tube displacement during eating"],
    a: 0,
    r: "Food particles in tracheal secretions with desaturation confirm aspiration. Tracheostomy clients are at increased risk for aspiration because the tracheostomy tube impairs the swallowing mechanism and eliminates subglottic pressure. The nurse should suction immediately, stop feeding, and notify the provider. A swallowing assessment and dietary modifications may be needed.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a 54-year-old client with a tracheostomy and humidified oxygen via trach collar. The nurse notes the client's secretions have become thick, tenacious, and difficult to suction. BP 120/76, HR 80, RR 20, SpO2 93%. Which intervention should the nurse implement first?",
    o: ["Ensure adequate humidification of inspired air and assess the client's hydration status", "Increase the suction pressure to maximum to remove the thick secretions", "Instil 10 mL of normal saline directly into the tracheostomy before suctioning", "Restrict oral fluids to reduce the volume of secretions"],
    a: 0,
    r: "Thick secretions often result from inadequate humidification or dehydration. The nurse should first check that the humidification system is functioning properly and assess hydration status. Increasing suction pressure risks mucosal damage. Normal saline instillation is no longer recommended as it can dislodge bacteria into the lower airways. Restricting fluids worsens thick secretions.",
    s: "Respiratory"
  },
  // ===== CHEST PHYSIOTHERAPY (Questions 66-78) =====
  {
    q: "A 58-year-old client with chronic bronchitis is prescribed chest physiotherapy (CPT). BP 128/80, HR 82, RR 22, SpO2 92% on 2 L/min. The nurse plans to perform postural drainage of the right lower lobe. Which position is correct?",
    o: ["Position the client on the left side in Trendelenburg with the foot of the bed elevated", "Position the client sitting upright at 90 degrees", "Position the client supine with the head of bed elevated to 45 degrees", "Position the client prone with the head of bed flat"],
    a: 0,
    r: "To drain the right lower lobe, gravity must pull secretions upward from the lower lobe toward the larger airways. Positioning the client on the opposite (left) side with the foot of the bed elevated uses gravity to facilitate drainage from the right lower lobe. Upright positioning drains upper lobes. Prone positioning is for anterior segments.",
    s: "Respiratory"
  },
  {
    q: "A 62-year-old client with bronchiectasis is scheduled for CPT. BP 134/82, HR 86, RR 20, SpO2 93% on room air. The client ate lunch 20 minutes ago. Which action should the nurse take?",
    o: ["Delay CPT for at least 1 to 2 hours after the meal to reduce the risk of nausea and aspiration", "Proceed with CPT immediately to take advantage of the extra energy from eating", "Have the client drink a large glass of water before starting CPT", "Perform CPT in a sitting position only since the client just ate"],
    a: 0,
    r: "CPT should be performed at least 1 to 2 hours after meals to prevent nausea, vomiting, and aspiration. The positions used in postural drainage (Trendelenburg, side-lying) increase the risk of gastric reflux and aspiration on a full stomach. Scheduling CPT before meals or between meals is recommended.",
    s: "Respiratory"
  },
  {
    q: "A 45-year-old client with cystic fibrosis is receiving CPT with percussion. BP 116/72, HR 78, RR 20, SpO2 94% on room air. The client reports sharp pain over the lower ribs on the right side. Which action should the nurse take?",
    o: ["Stop percussion immediately, assess the painful area, and report the finding to the healthcare provider", "Continue percussion but with less force over the painful area", "Administer a dose of acetaminophen and resume percussion after 30 minutes", "Reposition the client and increase the percussion force to loosen secretions faster"],
    a: 0,
    r: "Sharp rib pain during percussion could indicate a rib fracture or injury, especially in clients with conditions that weaken bones or with repeated CPT. The nurse should stop immediately, assess the area for tenderness, bruising, or crepitus, and report to the provider. Continuing percussion risks further injury. Pain investigation takes priority over continuing the procedure.",
    s: "Respiratory"
  },
  {
    q: "A nurse is performing vibration during CPT on a 70-year-old client with pneumonia. BP 130/78, HR 84, RR 22, SpO2 91% on 2 L/min. Which technique is correct?",
    o: ["Place hands flat on the chest wall and apply gentle vibrating pressure during the exhalation phase of breathing", "Apply vibration during inhalation to help the client breathe in more air", "Use a closed fist to vibrate the chest wall as forcefully as possible", "Vibrate only over bony prominences such as the spine and sternum"],
    a: 0,
    r: "Vibration is applied with flat hands on the chest wall during exhalation to help move secretions toward the larger airways for expectoration. Vibration during inhalation is ineffective. A closed fist or excessive force can cause injury. Vibration should be applied over the lung fields, not over the spine, sternum, or kidneys.",
    s: "Respiratory"
  },
  {
    q: "A 52-year-old client with a history of COPD and osteoporosis is referred for CPT. BP 126/74, HR 76, RR 20, SpO2 93% on room air. Which modification should the nurse make to the treatment plan?",
    o: ["Use gentle vibration and avoid percussion over the thorax, as osteoporosis increases the risk of rib fractures", "Perform vigorous percussion as usual since osteoporosis does not affect CPT", "Skip CPT entirely and use only nebulized bronchodilators", "Increase the percussion force to compensate for reduced lung compliance"],
    a: 0,
    r: "Osteoporosis significantly increases the risk of rib fractures during percussion. The nurse should modify CPT to use gentler techniques such as vibration, flutter valves, or positive expiratory pressure devices instead of percussion. CPT should not be completely skipped, as secretion clearance is still important, but techniques should be adapted to the client's condition.",
    s: "Respiratory"
  },
  {
    q: "A 68-year-old post-operative client is receiving CPT to prevent atelectasis. During the session, the client's SpO2 drops from 94% to 86%, BP changes from 130/80 to 98/58, and HR increases from 80 to 118. Which action should the nurse take?",
    o: ["Stop CPT immediately, return the client to a comfortable position, apply supplemental oxygen, and notify the healthcare provider", "Continue CPT as the desaturation is expected during position changes", "Increase the oxygen flow rate and continue CPT in the current position", "Suction the client vigorously and resume CPT"],
    a: 0,
    r: "A significant drop in SpO2 (from 94% to 86%), hypotension, and tachycardia during CPT indicate the client is not tolerating the procedure. The nurse must stop immediately, return the client to a safe position, ensure adequate oxygenation, and notify the provider. Continuing could lead to respiratory failure or cardiovascular collapse.",
    s: "Respiratory"
  },
  {
    q: "A 56-year-old client with a large pleural effusion on the left side is scheduled for CPT. BP 122/76, HR 84, RR 22, SpO2 92% on 2 L/min. Which area should the nurse avoid during percussion?",
    o: ["The area over the left pleural effusion, as percussion is ineffective over fluid and may cause discomfort", "The right upper chest, as it is unaffected by the effusion", "The right lower chest, as it is always contraindicated", "The posterior chest wall on both sides"],
    a: 0,
    r: "Percussion over a pleural effusion is ineffective because the fluid prevents the mechanical energy from reaching and mobilizing airway secretions. It may also cause pain. CPT should focus on lung segments that can benefit from secretion clearance. The nurse should also avoid percussion over the spine, sternum, kidneys, and liver.",
    s: "Respiratory"
  },
  {
    q: "A nurse is educating a 40-year-old client with bronchiectasis about using a flutter valve (oscillating PEP device) for airway clearance at home. BP 118/74, HR 76, RR 18, SpO2 96% on room air. Which instruction should the nurse provide?",
    o: ["Sit upright, inhale deeply, place the device in your mouth, and exhale slowly through the device to create oscillating pressure that loosens secretions", "Inhale through the device to draw medication into the lungs", "Use the device only when you have an acute infection", "Shake the device vigorously against your chest wall like a percussion tool"],
    a: 0,
    r: "The flutter valve (e.g., Acapella, Aerobika) creates oscillating positive expiratory pressure during exhalation, which vibrates the airway walls and loosens secretions for easier expectoration. It is used in an upright position with slow exhalation through the device. It is not an inhalation device, percussion tool, or for acute use only.",
    s: "Respiratory"
  },
  {
    q: "A 75-year-old client with pneumonia has thick secretions and is unable to cough effectively. BP 124/78, HR 88, RR 24, SpO2 90% on 3 L/min. The nurse plans to perform CPT. Which intervention should be performed before CPT to improve effectiveness?",
    o: ["Administer a prescribed nebulized bronchodilator to open the airways before starting CPT", "Have the client eat a large meal to increase energy for coughing", "Apply a chest binder to compress the secretions before drainage", "Administer a sedative to relax the client during the procedure"],
    a: 0,
    r: "Administering a bronchodilator before CPT opens the airways, allowing secretions to be mobilized more effectively during the procedure. Eating before CPT increases aspiration risk. A chest binder would restrict chest expansion. Sedation would suppress the cough reflex and reduce the client's ability to participate in airway clearance.",
    s: "Respiratory"
  },
  {
    q: "A nurse is evaluating the effectiveness of CPT on a 65-year-old client with chronic bronchitis. BP 126/78, HR 80, RR 20, SpO2 94% on room air. Which finding best indicates that CPT has been effective?",
    o: ["The client is able to expectorate increased amounts of sputum and breath sounds have improved", "The client's blood pressure has increased after the treatment", "The client reports feeling drowsy after the procedure", "The client's heart rate has increased by 20 beats per minute"],
    a: 0,
    r: "The goal of CPT is to mobilize and clear airway secretions. Effective CPT results in productive coughing with increased sputum expectoration and improved breath sounds (clearing of crackles and rhonchi). Blood pressure changes, drowsiness, and tachycardia are not indicators of effective CPT and may indicate adverse effects.",
    s: "Respiratory"
  },
  // ===== SUCTIONING (Questions 79-91) =====
  {
    q: "A 62-year-old client on a ventilator requires endotracheal suctioning. BP 132/80, HR 86, RR 16 (ventilator), SpO2 96%. Before suctioning, the nurse hyperoxygenates the client with 100% oxygen. Which rationale supports this action?",
    o: ["Hyperoxygenation prevents suction-induced hypoxemia by increasing the oxygen reserve before temporarily removing oxygen during the procedure", "Hyperoxygenation treats the underlying lung disease more effectively", "100% oxygen is routinely administered to all ventilated clients regardless of suctioning", "Hyperoxygenation stimulates the cough reflex to loosen secretions"],
    a: 0,
    r: "Suctioning temporarily removes oxygen from the airway along with secretions, which can cause hypoxemia, bradycardia, and dysrhythmias. Pre-oxygenation with 100% FiO2 for 30 to 60 seconds builds an oxygen reserve to prevent desaturation during the procedure. This is standard of care before endotracheal suctioning.",
    s: "Respiratory"
  },
  {
    q: "A nurse is suctioning a 70-year-old client's endotracheal tube. The suction catheter should not be advanced beyond the tip of the endotracheal tube. BP 126/78, HR 80, RR 14 (ventilator), SpO2 97%. Which complication can result from suctioning too deeply?",
    o: ["Mucosal trauma and stimulation of the carina causing severe coughing, bronchospasm, and vagal-mediated bradycardia", "Improved secretion clearance from the lower airways", "Reduced risk of ventilator-associated pneumonia", "More effective oxygen delivery to the alveoli"],
    a: 0,
    r: "Advancing the catheter beyond the ETT tip (deep suctioning) can traumatize the tracheal and bronchial mucosa and stimulate the carina, causing intense coughing, bronchospasm, and vagal-mediated bradycardia or cardiac arrest. The catheter should be inserted to just beyond the tip of the artificial airway, not deep into the bronchi.",
    s: "Respiratory"
  },
  {
    q: "A 55-year-old client with a tracheostomy requires suctioning. The nurse notes the secretions are blood-tinged. BP 120/74, HR 82, RR 20, SpO2 94% on humidified air. Which action should the nurse take?",
    o: ["Document the finding, use gentle suctioning technique, and report the blood-tinged secretions to the healthcare provider", "Increase the suction pressure to remove the blood more quickly", "Stop all suctioning until the bleeding resolves on its own", "Pack the tracheostomy stoma with gauze to stop the bleeding"],
    a: 0,
    r: "Blood-tinged secretions may indicate mucosal trauma from suctioning, infection, or other complications. The nurse should document the finding, use gentle technique (to prevent further trauma), and report to the provider. Increasing suction pressure worsens mucosal damage. Stopping all suctioning could lead to airway obstruction. Packing the stoma is not appropriate.",
    s: "Respiratory"
  },
  {
    q: "A nurse is preparing to perform nasopharyngeal suctioning on a 68-year-old client. BP 128/80, HR 78, RR 22, SpO2 91% on 2 L/min. The client has a history of nasal polyps. Which consideration is most important?",
    o: ["Assess the nares carefully and use the larger, more patent nostril to reduce the risk of trauma or bleeding", "Always suction through the right nostril first", "Apply suction while inserting the catheter to clear the nasal passage", "Use the largest catheter available for maximum secretion removal"],
    a: 0,
    r: "Nasal polyps increase the risk of bleeding and obstruction during nasopharyngeal suctioning. The nurse should assess both nares and use the more patent one. Suction is applied only during withdrawal, not during insertion (to prevent mucosal damage). The catheter size should be no larger than half the diameter of the nostril. There is no standard rule about which nostril to use first.",
    s: "Respiratory"
  },
  {
    q: "A 72-year-old client with COPD is receiving oxygen via nasal cannula at 2 L/min. The nurse needs to perform oropharyngeal suctioning for pooled oral secretions. SpO2 is 92%, BP 126/76, HR 80, RR 20. Which suction technique should the nurse use?",
    o: ["Use a Yankauer (tonsil-tip) suction catheter with clean technique to remove oral secretions", "Use a sterile flexible suction catheter inserted through the nose", "Use an endotracheal suction catheter with full sterile technique", "Remove the nasal cannula and suction through the nose with a Yankauer"],
    a: 0,
    r: "Oropharyngeal suctioning uses a Yankauer (rigid tonsil-tip) catheter with clean (not sterile) technique, as the oral cavity is not a sterile environment. A flexible sterile catheter is used for tracheal suctioning. The Yankauer is designed for oral use only and should not be inserted through the nose.",
    s: "Respiratory"
  },
  {
    q: "A 60-year-old ventilated client requires endotracheal suctioning. The nurse selects a suction catheter. The ETT internal diameter is 8.0 mm. BP 130/78, HR 84, RR 14 (ventilator), SpO2 97%. Which catheter size is most appropriate?",
    o: ["12 French, as the catheter should be no larger than half the internal diameter of the ETT", "18 French, to maximize secretion removal", "6 French, the smallest available", "Use the same size catheter as the ETT diameter"],
    a: 0,
    r: "The suction catheter should be no larger than half the internal diameter of the artificial airway to prevent generating excessive negative pressure that could cause atelectasis and hypoxemia. For an 8.0 mm ETT, half the diameter is 4 mm, which converts to approximately 12 French (multiply mm by 3). An 18 French catheter would occlude too much of the airway.",
    s: "Respiratory"
  },
  {
    q: "A nurse is suctioning a 65-year-old client through a tracheostomy. The nurse applies intermittent suction while withdrawing the catheter using a rotating motion. Each suction pass takes approximately 10 seconds. BP 122/76, HR 80, RR 18, SpO2 95%. Which element of this technique needs correction?",
    o: ["The technique described is correct and does not need modification", "The nurse should apply continuous suction rather than intermittent suction", "The nurse should advance and withdraw the catheter without rotation", "Each suction pass should last at least 30 seconds for thorough clearance"],
    a: 0,
    r: "The technique described is correct: intermittent suction is applied during withdrawal only, using a rotating motion to contact all surfaces, and each pass is limited to 10 to 15 seconds to prevent hypoxemia. Continuous suction increases mucosal damage. No rotation reduces effectiveness. Suctioning for longer than 15 seconds causes significant desaturation.",
    s: "Respiratory"
  },
  {
    q: "A 58-year-old client with thick tracheostomy secretions is being suctioned. The suction pressure gauge reads 160 mmHg. BP 124/78, HR 82, RR 20, SpO2 93%. Which action should the nurse take?",
    o: ["Reduce the suction pressure to between 80 and 120 mmHg, as 160 mmHg is too high and may cause mucosal trauma", "Increase the pressure to 200 mmHg since the secretions are thick", "Maintain the current pressure as it is within normal range", "Turn off the suction and use manual removal of secretions instead"],
    a: 0,
    r: "Safe suction pressure for adults is typically 80 to 120 mmHg (some guidelines allow up to 150 mmHg). Pressures above 150 mmHg increase the risk of mucosal trauma, bleeding, and atelectasis. Despite thick secretions, the solution is adequate humidification, not excessive suction pressure. Manual removal of tracheal secretions is not a standard technique.",
    s: "Respiratory"
  },
  {
    q: "A 74-year-old client with a tracheostomy is being suctioned in a long-term care facility. During suctioning, the nurse notes the secretions are foul-smelling and yellow-green. BP 130/82, HR 92, RR 24, SpO2 91% on humidified trach collar. Temperature is 38.4 degrees Celsius. Which action is most appropriate?",
    o: ["Report the purulent secretions, elevated temperature, and vital sign changes to the healthcare provider, as these findings suggest respiratory infection", "Document the finding and continue routine tracheostomy care without notification", "Increase the frequency of suctioning to every 30 minutes to clear the infection", "Administer an antibiotic from the client's existing supply without a new order"],
    a: 0,
    r: "Foul-smelling, purulent (yellow-green) secretions combined with fever and tachycardia strongly suggest respiratory infection (possibly tracheobronchitis or pneumonia). The nurse must report these findings promptly so the provider can order cultures and appropriate antibiotics. Increasing suctioning frequency alone does not treat the infection. Administering antibiotics without an order is outside scope.",
    s: "Respiratory"
  },
  {
    q: "A 50-year-old client requires nasotracheal suctioning. The client is alert and oriented with BP 118/72, HR 76, RR 22, SpO2 93% on room air. The client becomes anxious and resists the procedure. Which action should the nurse take first?",
    o: ["Explain the procedure, its purpose, and what the client will experience, and allow the client to ask questions before proceeding", "Restrain the client's hands and proceed with suctioning for safety", "Skip the suctioning and document the client's refusal", "Administer a sedative before attempting the procedure again"],
    a: 0,
    r: "Patient anxiety often results from inadequate understanding of the procedure. The nurse should provide clear, calm explanations about what will happen and why it is needed. Restraining is inappropriate and violates client autonomy. Documentation without intervention may be unsafe if suctioning is clinically needed. Sedation for a routine procedure is excessive.",
    s: "Respiratory"
  },
  // ===== INCENTIVE SPIROMETRY (Questions 92-100) =====
  {
    q: "A 55-year-old client is recovering from abdominal surgery on post-operative day 1. BP 126/78, HR 82, RR 18, SpO2 94% on room air. The nurse instructs the client on incentive spirometry use. Which instruction is correct?",
    o: ["Sit upright, exhale normally, seal lips around the mouthpiece, inhale slowly and deeply, then hold your breath for 3 to 5 seconds before exhaling", "Exhale forcefully into the device to push the indicator to the top", "Use the device while lying flat to maximize lung expansion", "Inhale as quickly as possible through the mouthpiece"],
    a: 0,
    r: "Correct incentive spirometry technique involves sitting upright (to maximize diaphragmatic excursion), normal exhalation, slow deep inhalation through the mouthpiece (to fully inflate the alveoli), and breath-holding for 3 to 5 seconds (to promote sustained alveolar inflation). The device measures inhalation, not exhalation. Rapid inhalation does not allow full alveolar recruitment.",
    s: "Respiratory"
  },
  {
    q: "A 68-year-old client had a thoracotomy 8 hours ago. The client reports incisional pain of 8 out of 10 and refuses to use the incentive spirometer. BP 134/82, HR 92, RR 22, SpO2 91% on 2 L/min. Which action should the nurse take first?",
    o: ["Administer prescribed analgesic medication and encourage incentive spirometry use once pain is adequately controlled", "Force the client to use the spirometer despite the pain", "Document the refusal and wait until the next shift to reattempt", "Tell the client that pain is expected and they must use the device anyway"],
    a: 0,
    r: "Post-operative pain significantly limits the client's ability to take deep breaths. Adequate pain management is essential before attempting incentive spirometry. Once pain is controlled, the client can participate more effectively. Forcing or dismissing pain concerns is inappropriate. Delaying to the next shift increases the risk of atelectasis.",
    s: "Respiratory"
  },
  {
    q: "A 72-year-old client is using an incentive spirometer after hip replacement surgery. BP 128/76, HR 78, RR 16, SpO2 96% on room air. The client achieves a volume of 1,000 mL consistently. The nurse notes the client takes a quick breath and immediately exhales. Which correction should the nurse provide?",
    o: ["Hold your breath at the peak of inhalation for 3 to 5 seconds before exhaling to keep the alveoli open longer", "Exhale more forcefully after each breath to strengthen your lungs", "Try to reach a volume of at least 3,000 mL with each breath", "Take several rapid shallow breaths through the device instead"],
    a: 0,
    r: "The sustained maximal inspiration (breath-hold at peak inhalation for 3 to 5 seconds) is the most important component of incentive spirometry, as it maintains positive alveolar pressure and promotes alveolar recruitment. Without the breath-hold, the benefit is significantly reduced. The volume achieved is individual; 1,000 mL may be appropriate for this client.",
    s: "Respiratory"
  },
  {
    q: "A 60-year-old client with a history of smoking is admitted for cholecystectomy. Pre-operative assessment shows BP 130/80, HR 78, RR 16, SpO2 95% on room air. The nurse teaches incentive spirometry pre-operatively. Which statement by the client indicates understanding?",
    o: ["I will use the incentive spirometer at least 10 times every hour while awake to prevent lung complications after surgery", "I will only use the spirometer if I develop a fever after surgery", "I should blow into the device as hard as I can each time", "Using the spirometer once a day after surgery is enough to prevent pneumonia"],
    a: 0,
    r: "The standard recommendation is 10 sustained maximal inspirations per hour while awake. Pre-operative teaching ensures the client understands the technique before surgery when pain and sedation may impair learning. Waiting for fever means prevention has failed. The spirometer measures inhalation, not exhalation. Once daily use is insufficient for atelectasis prevention.",
    s: "Respiratory"
  },
  {
    q: "A 45-year-old client on post-operative day 2 after spinal surgery reports dizziness during incentive spirometry use. BP 118/72, HR 74, RR 16, SpO2 97% on room air. The client has been performing 15 repetitions rapidly in succession. Which adjustment should the nurse suggest?",
    o: ["Take normal breaths between repetitions and perform 10 sustained breaths every hour rather than many rapid repetitions all at once", "Discontinue incentive spirometry permanently since it is causing dizziness", "Increase the repetitions to 20 to build tolerance", "Perform the exercise while lying flat to prevent dizziness"],
    a: 0,
    r: "Dizziness during incentive spirometry is usually caused by hyperventilation from too many rapid, successive breaths. The client should take normal breaths between repetitions and spread the 10 breaths throughout each hour. Discontinuing the device removes a valuable prevention tool. Lying flat reduces lung expansion effectiveness.",
    s: "Respiratory"
  },
  // ===== PEAK FLOW MONITORING (Questions 101-109) =====
  {
    q: "A 20-year-old client with asthma has a personal best peak expiratory flow rate (PEFR) of 500 L/min. Today's reading is 410 L/min. BP 112/68, HR 76, RR 16, SpO2 98% on room air. The client is asymptomatic. Which zone does this reading fall into?",
    o: ["Green zone (80% to 100% of personal best), indicating well-controlled asthma", "Yellow zone (50% to 79% of personal best), indicating caution", "Red zone (below 50% of personal best), indicating a medical emergency", "The reading is unreliable and should be repeated tomorrow"],
    a: 0,
    r: "410 / 500 = 82%, which falls in the green zone (80% to 100% of personal best). Green zone means asthma is well controlled and the client should continue their current management plan. Yellow zone (50% to 79%) requires action such as using a rescue inhaler. Red zone (below 50%) is a medical emergency.",
    s: "Respiratory"
  },
  {
    q: "A 14-year-old client with asthma has a personal best PEFR of 400 L/min. This morning's reading is 180 L/min. BP 106/64, HR 108, RR 28, SpO2 90% on room air. The client is wheezing audibly. Which action should the nurse advise?",
    o: ["Administer the rescue inhaler immediately and seek emergency medical attention, as this is a red zone reading", "Continue with normal daily activities and recheck the PEFR tomorrow", "Use the controller inhaler and recheck in 4 hours", "Have the client rest quietly and recheck the peak flow after lunch"],
    a: 0,
    r: "180 / 400 = 45%, which is in the red zone (below 50% of personal best). This indicates a severe asthma exacerbation requiring immediate rescue inhaler use and emergency medical attention. The clinical signs (tachycardia, tachypnea, wheezing, SpO2 90%) confirm the severity. Delaying treatment could lead to respiratory failure.",
    s: "Respiratory"
  },
  {
    q: "A 28-year-old client with asthma is being taught to use a peak flow meter. BP 114/70, HR 72, RR 14, SpO2 99% on room air. Which instruction should the nurse provide?",
    o: ["Stand up or sit upright, take a deep breath in, seal your lips tightly around the mouthpiece, and blow out as hard and fast as you can in one single breath", "Blow slowly and steadily into the device for as long as possible", "Inhale through the peak flow meter to measure your inspiratory capacity", "Perform the test once and record the single reading"],
    a: 0,
    r: "Peak flow meters measure the maximum speed of exhalation (peak expiratory flow rate). The technique requires standing or sitting upright, a maximum inhalation, tight lip seal, and a forceful, fast exhalation. The best of three attempts should be recorded. Slow exhalation, inhalation through the device, or single readings are incorrect techniques.",
    s: "Respiratory"
  },
  {
    q: "A 32-year-old client with asthma has a personal best PEFR of 550 L/min. Today's reading is 340 L/min after exposure to a known trigger at work. BP 116/72, HR 88, RR 22, SpO2 94% on room air. The client reports mild chest tightness. Which action is most appropriate?",
    o: ["Administer the rescue inhaler as per the asthma action plan and recheck PEFR in 20 minutes", "Call 911 immediately for emergency transport", "Advise the client to lie down and rest until symptoms resolve", "Tell the client to continue working and monitor symptoms"],
    a: 0,
    r: "340 / 550 = 62%, which falls in the yellow zone (50% to 79% of personal best). The asthma action plan for yellow zone readings typically includes using the rescue inhaler and rechecking PEFR after 20 minutes. If symptoms do not improve, further medical attention is needed. This is not yet a red zone emergency. Resting alone and continuing exposure are inadequate responses.",
    s: "Respiratory"
  },
  {
    q: "A nurse is reviewing peak flow monitoring records for a 18-year-old client with asthma. The client's morning PEFR readings over the past week show significant variability: 480, 320, 460, 290, 500, 350, 470 L/min. Personal best is 520 L/min. BP 110/66, HR 74, RR 16, SpO2 97% on room air. Which finding should the nurse report?",
    o: ["The high variability in daily PEFR readings, which suggests poorly controlled asthma with significant airway lability", "The readings are all within the green zone and indicate good control", "Only the lowest reading of 290 is concerning; the others are normal", "The client's technique is likely poor and the readings should be disregarded"],
    a: 0,
    r: "PEFR variability greater than 20% between readings indicates unstable or poorly controlled asthma with significant airway reactivity. Several readings fall in the yellow zone (290/520 = 56%, 320/520 = 62%, 350/520 = 67%). This pattern suggests the current treatment plan is inadequate and needs provider review. Dismissing the variability could miss a worsening condition.",
    s: "Respiratory"
  },
  // ===== CYSTIC FIBROSIS (Questions 110-122) =====
  {
    q: "A 12-year-old child with cystic fibrosis is admitted with a pulmonary exacerbation. BP 100/62, HR 110, RR 28, SpO2 89% on room air, temperature 38.6 degrees Celsius. The child has a productive cough with thick, green sputum. Which intervention should the nurse implement first?",
    o: ["Apply supplemental oxygen as ordered and position the child in high Fowler's to maximize ventilation", "Encourage the child to eat a high-calorie snack to maintain energy", "Begin chest physiotherapy immediately to clear the secretions", "Administer the scheduled pancreatic enzyme supplements"],
    a: 0,
    r: "With SpO2 of 89% and respiratory distress (RR 28, tachycardia), addressing oxygenation is the immediate priority. High Fowler's position maximizes lung expansion. While CPT, nutrition, and enzyme supplements are important components of CF care, they should follow initial stabilization of the airway and breathing.",
    s: "Respiratory"
  },
  {
    q: "A 15-year-old adolescent with cystic fibrosis is prescribed pancreatic enzyme supplements (Creon) with meals. BP 106/66, HR 78, RR 18, SpO2 96% on room air. The parent reports the child has been having greasy, foul-smelling stools. Which assessment should the nurse make first?",
    o: ["Verify that the child is taking the enzyme supplements at the beginning of each meal and snack, as steatorrhea suggests inadequate enzyme dosing or timing", "Recommend eliminating all fats from the child's diet", "Advise the parent that this is a normal finding in cystic fibrosis and requires no action", "Increase the enzyme dose without consulting the healthcare provider"],
    a: 0,
    r: "Steatorrhea (greasy, foul-smelling stools) in CF indicates fat malabsorption from pancreatic insufficiency. The nurse should first verify that enzymes are being taken correctly (at the start of every meal and snack, not after). Fat restriction is not recommended in CF because these children need high-calorie, high-fat diets. Dose adjustments require a provider order.",
    s: "Respiratory"
  },
  {
    q: "A 10-year-old child with cystic fibrosis is being discharged after a pulmonary exacerbation. BP 98/60, HR 84, RR 20, SpO2 95% on room air. The nurse is teaching the family about nutrition. Which dietary instruction is correct?",
    o: ["Provide a high-calorie, high-protein, high-fat diet with pancreatic enzymes taken with all meals and snacks", "Restrict calories and fat to prevent obesity and pancreatic stress", "Follow a low-sodium diet to prevent fluid retention in the lungs", "Limit protein intake to reduce the burden on the digestive system"],
    a: 0,
    r: "Children with CF have increased caloric needs (120% to 150% of normal) due to the energy demands of chronic lung disease and malabsorption. A high-calorie, high-protein, high-fat diet with pancreatic enzyme replacement supports growth and nutrition. Calorie and fat restriction would lead to malnutrition. Extra sodium may actually be needed, especially in hot weather.",
    s: "Respiratory"
  },
  {
    q: "A 8-year-old child with cystic fibrosis has a sweat chloride test result of 72 mEq/L. BP 96/58, HR 88, RR 20, SpO2 97% on room air. The parent asks what this result means. Which response is most accurate?",
    o: ["A sweat chloride level above 60 mEq/L is diagnostic of cystic fibrosis and confirms your child's diagnosis", "This is a normal sweat chloride level for children and does not indicate CF", "The test needs to be repeated because sweat chloride is unreliable in children", "A level of 72 means the CF is in remission"],
    a: 0,
    r: "The sweat chloride test is the gold standard for diagnosing CF. A result above 60 mEq/L is diagnostic of CF. Normal is below 30 mEq/L, and 30 to 59 mEq/L is borderline/intermediate. CF is a genetic condition with no remission. The test is reliable in children and is typically performed twice for confirmation.",
    s: "Respiratory"
  },
  {
    q: "A 16-year-old client with cystic fibrosis is prescribed inhaled dornase alfa (Pulmozyme). BP 108/66, HR 76, RR 18, SpO2 95% on room air. The client asks what this medication does. Which explanation is correct?",
    o: ["It breaks down the DNA in thick airway secretions, making the mucus thinner and easier to cough up", "It kills the bacteria causing lung infections in cystic fibrosis", "It opens the airways like a bronchodilator for immediate relief", "It replaces the missing enzymes in the pancreas"],
    a: 0,
    r: "Dornase alfa (Pulmozyme) is a recombinant human DNase that cleaves extracellular DNA in CF sputum. In CF, neutrophils release large amounts of DNA during infection-fighting, which makes secretions extremely viscous. Dornase alfa reduces sputum viscosity, improving airway clearance. It is not an antibiotic, bronchodilator, or pancreatic enzyme.",
    s: "Respiratory"
  },
  {
    q: "A 14-year-old client with CF is admitted with hemoptysis. The client coughed up approximately 50 mL of bright red blood. BP 108/68, HR 102, RR 24, SpO2 92% on room air. Which nursing action is the priority?",
    o: ["Position the client upright, remain calm, keep the client at rest, and notify the healthcare provider immediately", "Begin chest physiotherapy to clear the blood from the airways", "Have the client drink ice water to stop the bleeding", "Administer the prescribed inhaled bronchodilator right away"],
    a: 0,
    r: "Hemoptysis in CF can be life-threatening. The nurse should position the client upright (to prevent aspiration of blood), keep them calm and at rest, and notify the provider immediately. CPT is contraindicated during active hemoptysis as it could worsen bleeding. Ice water and bronchodilators do not address the hemorrhage.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a 20-year-old client with CF who is on IV tobramycin for a Pseudomonas aeruginosa lung infection. BP 112/70, HR 82, RR 20, SpO2 94% on room air. Which monitoring parameter is most important during aminoglycoside therapy?",
    o: ["Serum trough and peak levels, along with renal function and hearing assessments, as aminoglycosides are nephrotoxic and ototoxic", "Daily chest X-rays to monitor infection clearance", "Hourly blood glucose monitoring for drug-induced hypoglycemia", "Continuous cardiac telemetry for QT prolongation"],
    a: 0,
    r: "Aminoglycosides (tobramycin, gentamicin) have narrow therapeutic windows and can cause nephrotoxicity and ototoxicity. Drug levels (peak and trough), serum creatinine, and hearing assessments are essential monitoring parameters. Daily chest X-rays are excessive. Blood glucose monitoring and cardiac telemetry are not primary concerns with aminoglycosides.",
    s: "Respiratory"
  },
  {
    q: "A 18-year-old client with CF and CF-related diabetes (CFRD) has a blood glucose of 16.8 mmol/L before lunch. BP 110/68, HR 80, RR 18, SpO2 96% on room air. The client is on a sliding scale insulin regimen. Which consideration is unique to CFRD management?",
    o: ["The client still requires a high-calorie diet despite having diabetes, so caloric restriction is not recommended as it would be in type 2 diabetes", "The client should follow a strict low-calorie diabetic diet identical to type 2 diabetes management", "Oral hypoglycemics are the first-line treatment for CFRD", "Blood glucose monitoring is not necessary if the client feels well"],
    a: 0,
    r: "CFRD management differs from type 2 diabetes in that caloric restriction is contraindicated because CF clients need high-calorie diets for growth and respiratory muscle strength. Insulin is the primary treatment (not oral agents), and blood glucose monitoring is always required. Nutritional management must balance glucose control with adequate caloric intake.",
    s: "Respiratory"
  },
  // ===== PLEURAL EFFUSION/PLEURISY (Questions 123-135) =====
  {
    q: "A 62-year-old client is admitted with a large left-sided pleural effusion. BP 128/78, HR 92, RR 26, SpO2 90% on room air. The client reports dyspnea and dull chest pain on the affected side. Which assessment finding is expected during physical examination?",
    o: ["Decreased breath sounds, dullness to percussion, and decreased tactile fremitus over the left lower lung field", "Hyperresonance to percussion and increased breath sounds on the left", "Bilateral wheezing with normal percussion notes", "Stridor and tracheal deviation to the left"],
    a: 0,
    r: "Pleural effusion causes fluid accumulation in the pleural space. Physical findings include decreased breath sounds (fluid dampens sound transmission), dullness to percussion (fluid is dense), and decreased tactile fremitus (fluid impedes vibration transmission). Hyperresonance indicates air, not fluid. Wheezing is airway-related. Tracheal deviation toward the effusion would not occur; a large effusion pushes the trachea away.",
    s: "Respiratory"
  },
  {
    q: "A 58-year-old client with a pleural effusion is undergoing thoracentesis. The nurse positions the client sitting on the edge of the bed, leaning forward over a bedside table. BP 122/74, HR 80, RR 22, SpO2 92% on 2 L/min. During the procedure, the client develops sudden dyspnea, a persistent cough, and SpO2 drops to 85%. Which complication should the nurse suspect?",
    o: ["Pneumothorax from lung puncture during the thoracentesis procedure", "Allergic reaction to the local anaesthetic", "Normal response to fluid removal that requires no intervention", "Vasovagal syncope from anxiety"],
    a: 0,
    r: "Sudden dyspnea, cough, and desaturation during thoracentesis strongly suggest pneumothorax from inadvertent lung puncture. This is a known complication. The nurse should stop the procedure, apply oxygen, monitor vitals, and prepare for a chest X-ray and possible chest tube insertion. Vasovagal responses cause hypotension and bradycardia, not desaturation.",
    s: "Respiratory"
  },
  {
    q: "A 70-year-old client has undergone thoracentesis with 1,500 mL of fluid removed. BP 110/68, HR 88, RR 20, SpO2 94% on room air. Post-procedure, the nurse monitors the client closely. Which finding would require immediate reporting?",
    o: ["Sudden onset of cough with frothy sputum and increasing dyspnea, suggesting re-expansion pulmonary edema", "A small adhesive bandage at the puncture site with slight oozing", "Mild soreness at the insertion site", "Improved breath sounds on the affected side"],
    a: 0,
    r: "Re-expansion pulmonary edema can occur when a large volume of fluid is removed rapidly (typically more than 1,000 to 1,500 mL). Symptoms include cough with frothy sputum, dyspnea, and hypoxemia. This is a serious complication requiring immediate intervention. Mild soreness and slight oozing are expected. Improved breath sounds indicate a positive outcome.",
    s: "Respiratory"
  },
  {
    q: "A 55-year-old client with pleurisy reports sharp, stabbing chest pain rated 8 out of 10 that worsens with inspiration and coughing. BP 132/80, HR 94, RR 26, SpO2 93% on room air. Which nursing intervention will best address this client's pain pattern?",
    o: ["Administer prescribed analgesics and teach the client to splint the affected side with a pillow when coughing or deep breathing", "Encourage frequent deep breathing and coughing without pain management", "Apply a heating pad continuously to the affected side of the chest", "Position the client on the unaffected side to completely eliminate pain"],
    a: 0,
    r: "Pleuritic pain occurs when inflamed pleural surfaces rub together during respiration. Analgesics reduce pain, enabling deeper breathing and effective coughing. Splinting with a pillow provides external support and reduces pain during coughing. Deep breathing without pain control leads to shallow breathing and atelectasis. Positioning helps but does not eliminate pain.",
    s: "Respiratory"
  },
  {
    q: "A 65-year-old client with a malignant pleural effusion has a PleurX catheter placed for intermittent drainage at home. BP 124/76, HR 78, RR 18, SpO2 95% on room air. Which discharge instruction is most important?",
    o: ["Drain no more than 1,000 mL at a time to prevent re-expansion pulmonary edema, and stop if you develop coughing, chest tightness, or shortness of breath during drainage", "Drain the catheter completely each session regardless of the volume", "Leave the catheter open continuously to drain throughout the day", "Clean the catheter insertion site with hydrogen peroxide daily"],
    a: 0,
    r: "Limiting drainage to 1,000 mL per session prevents re-expansion pulmonary edema, which occurs when the lung re-expands too rapidly after fluid removal. Symptoms of re-expansion (coughing, dyspnea, chest tightness) require immediate cessation of drainage. Continuous drainage and unlimited volumes are unsafe. Catheter site care follows specific protocols provided by the care team.",
    s: "Respiratory"
  },
  {
    q: "A 50-year-old client with bilateral pleural effusions secondary to heart failure is being treated with IV furosemide. BP 108/64, HR 96, RR 24, SpO2 91% on 2 L/min. After 4 hours, urine output is 800 mL. Which assessment is most important for the nurse to perform?",
    o: ["Reassess breath sounds and respiratory status, weigh the client, and monitor electrolytes for diuretic-induced imbalances", "Reduce the oxygen flow rate since the effusions should be resolving", "Encourage the client to increase fluid intake to replace the urine output", "Administer an additional dose of furosemide without a provider order"],
    a: 0,
    r: "After significant diuresis, the nurse should reassess respiratory status for improvement, weigh the client to quantify fluid loss, and monitor electrolytes (especially potassium and sodium) as loop diuretics cause significant electrolyte losses. Reducing oxygen prematurely, replacing lost fluid, or administering extra medication without an order are inappropriate.",
    s: "Respiratory"
  },
  // ===== PULMONARY FIBROSIS (Questions 136-144) =====
  {
    q: "A 64-year-old client with idiopathic pulmonary fibrosis reports progressive dyspnea with exertion over the past 6 months. BP 126/78, HR 84, RR 22, SpO2 89% on room air at rest. Pulmonary function tests show a reduced FVC and DLCO. Which finding should the nurse report as the most concerning change?",
    o: ["The worsening exertional dyspnea and resting SpO2 of 89%, indicating disease progression and need for supplemental oxygen evaluation", "The blood pressure of 126/78, suggesting hypertension", "The heart rate of 84, which is elevated for this client", "The respiratory rate of 22, which is within normal limits"],
    a: 0,
    r: "Progressive exertional dyspnea and declining resting SpO2 in pulmonary fibrosis indicate disease progression with worsening gas exchange. A resting SpO2 below 90% typically warrants evaluation for home oxygen therapy. BP 126/78 is within normal range. HR 84 and RR 22 are mildly elevated but expected with the underlying condition.",
    s: "Respiratory"
  },
  {
    q: "A 60-year-old client with pulmonary fibrosis is prescribed pirfenidone (Esbriet). BP 122/76, HR 78, RR 20, SpO2 92% on 2 L/min. Which side effect should the nurse monitor for most closely?",
    o: ["Photosensitivity and gastrointestinal symptoms (nausea, diarrhea), which are the most common adverse effects of pirfenidone", "Significant weight gain and fluid retention", "Severe hypotension requiring vasopressor support", "Drug-induced bronchospasm and wheezing"],
    a: 0,
    r: "Pirfenidone commonly causes photosensitivity (clients should use sunscreen and avoid prolonged sun exposure), nausea, diarrhea, and rash. These GI side effects can be reduced by taking the medication with food and titrating the dose gradually. Weight gain, hypotension, and bronchospasm are not typical side effects of pirfenidone.",
    s: "Respiratory"
  },
  {
    q: "A 58-year-old client with pulmonary fibrosis desaturates from SpO2 94% to 82% during a 6-minute walk test. BP 118/72, HR 110 after walking, RR 30. The client reports severe dyspnea and must stop walking after 3 minutes. Which action should the nurse take?",
    o: ["Stop the walk test, apply supplemental oxygen, allow the client to rest, and report the significant desaturation to the healthcare provider", "Encourage the client to continue walking to complete the full 6 minutes", "Increase the walking pace to finish the test more quickly", "Document the results as expected for a pulmonary fibrosis client"],
    a: 0,
    r: "A drop in SpO2 to 82% during exertion is a significant desaturation that indicates impaired gas exchange. The test should be stopped, oxygen applied, and the finding reported. This level of desaturation during activity may indicate the need for supplemental oxygen during exertion. Continuing the test could be dangerous.",
    s: "Respiratory"
  },
  {
    q: "A 66-year-old client with pulmonary fibrosis reports a dry, hacking, non-productive cough that disrupts sleep. BP 124/78, HR 80, RR 20, SpO2 91% on 2 L/min. The client asks why they cough so much without producing any sputum. Which explanation is most accurate?",
    o: ["The scarring and thickening of lung tissue in pulmonary fibrosis irritates the cough receptors in the airways, causing a chronic dry cough", "The cough is caused by a respiratory infection that needs antibiotics", "You are coughing because your oxygen level is too high", "The cough is a side effect of supplemental oxygen and will stop when you discontinue it"],
    a: 0,
    r: "Chronic dry cough is a hallmark symptom of pulmonary fibrosis. The fibrotic (scarred) lung tissue distorts airways and stimulates cough receptors. The cough is typically non-productive because the issue is structural, not secretory. It is not caused by infection, high oxygen levels, or oxygen therapy. Management may include antitussive medications.",
    s: "Respiratory"
  },
  {
    q: "A 62-year-old client with advanced pulmonary fibrosis develops clubbing of the fingernails. BP 120/76, HR 86, RR 24, SpO2 88% on 3 L/min. Which explanation for this finding is correct?",
    o: ["Clubbing results from chronic hypoxemia causing proliferation of connective tissue at the nail bed, and indicates long-standing oxygen deprivation", "Clubbing is caused by the medications used to treat pulmonary fibrosis", "Clubbing is a normal finding in adults over 60 years of age", "Clubbing indicates the client has a nail fungal infection requiring treatment"],
    a: 0,
    r: "Digital clubbing (enlargement of the distal phalanges with loss of the normal nail bed angle) occurs in chronic hypoxic conditions including pulmonary fibrosis, bronchiectasis, and cyanotic heart disease. It results from chronic tissue hypoxia stimulating vascular endothelial growth factor and connective tissue proliferation. It is not caused by medications, aging, or fungal infection.",
    s: "Respiratory"
  },
  // ===== BRONCHITIS (Questions 145-157) =====
  {
    q: "A 52-year-old client presents with a 10-day history of productive cough with yellow sputum. BP 128/78, HR 82, RR 20, SpO2 96% on room air, temperature 37.4 degrees Celsius. The client is otherwise healthy with no chronic conditions. Which assessment finding should the nurse report?",
    o: ["The duration and characteristics of the cough with sputum production to evaluate if the acute bronchitis is resolving or worsening", "The temperature of 37.4, as it indicates sepsis", "The SpO2 of 96%, as it requires supplemental oxygen", "The blood pressure, as it indicates hypertensive emergency"],
    a: 0,
    r: "Acute bronchitis typically lasts 10 to 14 days. A productive cough lasting 10 days with low-grade fever in an otherwise healthy client should be reported so the provider can evaluate if the condition is resolving or if further workup (chest X-ray to rule out pneumonia) is needed. Temp 37.4 is not sepsis. SpO2 96% and BP 128/78 are normal.",
    s: "Respiratory"
  },
  {
    q: "A 60-year-old client with chronic bronchitis is assessed during a clinic visit. BP 132/82, HR 80, RR 20, SpO2 93% on room air. The nurse observes the client has a cyanotic appearance and peripheral edema. Which complication should the nurse suspect?",
    o: ["Cor pulmonale (right-sided heart failure) secondary to chronic hypoxemia from long-standing bronchitis", "Left-sided heart failure from valvular disease", "Acute pulmonary embolism", "Peripheral arterial disease causing the cyanosis"],
    a: 0,
    r: "Chronic bronchitis causes prolonged hypoxemia, which leads to pulmonary vasoconstriction and pulmonary hypertension. Over time, the increased afterload on the right ventricle causes right-sided heart failure (cor pulmonale), manifesting as peripheral edema, JVD, and cyanosis. This is a classic complication of chronic obstructive lung disease.",
    s: "Respiratory"
  },
  {
    q: "A 48-year-old client with acute bronchitis asks the nurse for an antibiotic prescription. BP 122/76, HR 76, RR 18, SpO2 97% on room air, temperature 37.2 degrees Celsius. The client is otherwise healthy. Which response is most appropriate?",
    o: ["Most cases of acute bronchitis are viral and do not require antibiotics; treatment focuses on symptom management with rest, fluids, and antipyretics", "You definitely need antibiotics since you have been coughing for several days", "I will request an antibiotic prescription for you right away", "Antibiotics will help your cough resolve faster regardless of the cause"],
    a: 0,
    r: "Acute bronchitis is predominantly viral (90% of cases), and antibiotics are not indicated unless a bacterial superinfection is suspected. Inappropriate antibiotic use contributes to antimicrobial resistance. Treatment is supportive: rest, adequate hydration, antipyretics for fever, and potentially antitussives for symptom relief.",
    s: "Respiratory"
  },
  {
    q: "A 65-year-old client with chronic bronchitis is being taught about smoking cessation. The client has smoked 1.5 packs per day for 40 years. BP 136/84, HR 84, RR 22, SpO2 91% on room air. Which approach is most effective for the nurse to take?",
    o: ["Discuss the benefits of quitting at any age, offer nicotine replacement resources, and refer to a smoking cessation program", "Tell the client it is too late to quit since the lung damage is already done", "Insist the client quit immediately and refuse to provide care until they do", "Mention smoking cessation briefly and move on to other teaching topics"],
    a: 0,
    r: "Smoking cessation at any age provides health benefits including reduced progression of chronic bronchitis, improved lung function, and decreased cardiovascular risk. The nurse should provide supportive counselling, discuss pharmacological aids (nicotine replacement, varenicline), and refer to cessation programs. It is never too late to quit. Punitive approaches are ineffective.",
    s: "Respiratory"
  },
  {
    q: "A 56-year-old client with acute exacerbation of chronic bronchitis is prescribed a short-acting bronchodilator and an oral corticosteroid. BP 130/80, HR 88, RR 24, SpO2 90% on 2 L/min. Which instruction should the nurse provide about the corticosteroid?",
    o: ["Take the corticosteroid with food to reduce stomach irritation, and do not stop the medication abruptly without provider guidance", "Take the corticosteroid on an empty stomach for better absorption", "You may stop the corticosteroid as soon as your breathing improves", "The corticosteroid will work immediately to open your airways"],
    a: 0,
    r: "Corticosteroids can cause gastric irritation and should be taken with food. They should not be stopped abruptly (especially after prolonged use) due to the risk of adrenal insufficiency. Corticosteroids reduce inflammation but take hours to days for full effect; they are not immediate bronchodilators. Completing the prescribed course prevents symptom rebound.",
    s: "Respiratory"
  },
  {
    q: "A 70-year-old client with chronic bronchitis has thick, tenacious sputum and difficulty expectorating. BP 126/78, HR 82, RR 22, SpO2 92% on 2 L/min. Which non-pharmacological intervention should the nurse implement?",
    o: ["Increase oral fluid intake (unless contraindicated) and ensure adequate room humidification to thin secretions", "Restrict fluids to reduce sputum production", "Apply a chest binder to compress the airways and force out secretions", "Instruct the client to suppress coughing to conserve energy"],
    a: 0,
    r: "Adequate hydration thins secretions, making them easier to expectorate. Room humidification adds moisture to inspired air, further reducing sputum viscosity. Fluid restriction would thicken secretions. Chest binders restrict chest expansion. Cough suppression prevents secretion clearance and can lead to atelectasis and infection.",
    s: "Respiratory"
  },
  // ===== RSV/BRONCHIOLITIS (Questions 158-166) =====
  {
    q: "A 6-month-old infant is admitted with RSV bronchiolitis. BP 80/50, HR 160, RR 64, SpO2 88% on room air, temperature 38.4 degrees Celsius. The nurse observes nasal flaring, intercostal retractions, and wheezing. Which intervention is the priority?",
    o: ["Apply humidified supplemental oxygen as ordered and position the infant with the head of crib elevated to reduce work of breathing", "Administer an oral antibiotic as this is likely a bacterial infection", "Offer a full bottle feed to ensure adequate caloric intake", "Bundle the infant tightly to keep warm and reduce energy expenditure"],
    a: 0,
    r: "RSV bronchiolitis in infants presents with significant respiratory distress. SpO2 of 88% with nasal flaring and retractions requires immediate oxygen therapy. Humidified oxygen helps moisten thickened secretions. Elevating the head improves diaphragmatic excursion. RSV is viral, so antibiotics are not indicated. Feeding during severe distress increases aspiration risk. Tight bundling restricts chest movement.",
    s: "Respiratory"
  },
  {
    q: "A 4-month-old infant with RSV is placed on contact and droplet precautions. The nurse is preparing to provide care. BP 78/48, HR 150, RR 56, SpO2 92% on humidified oxygen. Which infection control measure is most important?",
    o: ["Perform thorough hand hygiene before and after contact, wear gloves and a gown, and clean shared equipment between patients", "Standard precautions alone are sufficient for RSV", "Airborne precautions with an N95 respirator are required", "Only visitors need to wear personal protective equipment"],
    a: 0,
    r: "RSV is transmitted primarily through contact with respiratory secretions and fomites. Contact and droplet precautions include hand hygiene, gloves, gowns, and careful equipment cleaning. RSV is not airborne (N95 not required). All caregivers, not just visitors, must follow precautions. Standard precautions alone are insufficient due to the highly contagious nature of RSV.",
    s: "Respiratory"
  },
  {
    q: "A 3-month-old infant with RSV bronchiolitis is being assessed. BP 76/46, HR 148, RR 60, SpO2 91% on humidified nasal cannula at 1 L/min. The infant was breastfeeding well yesterday but today refuses to latch. Which finding is most concerning?",
    o: ["The refusal to feed, as it indicates increased work of breathing and possible impending respiratory failure in an infant", "The heart rate of 148, which is abnormally high for this age", "The blood pressure of 76/46, suggesting cardiogenic shock", "The respiratory rate of 60, which is within normal range for this age"],
    a: 0,
    r: "In infants, refusal to feed is a critical sign of worsening respiratory distress because infants cannot coordinate sucking, swallowing, and breathing simultaneously when in respiratory distress. This can precede respiratory failure. HR 148 is within the normal range for infants (120 to 160). BP is age-appropriate. RR of 60 is at the upper limit of normal for infants.",
    s: "Respiratory"
  },
  {
    q: "A nurse is educating parents of a premature infant (born at 32 weeks gestation) about RSV prevention. The infant is now 2 months old chronologically. BP 72/44, HR 142, RR 44, SpO2 98% on room air. Which preventive measure should the nurse discuss?",
    o: ["Palivizumab (Synagis) injections during RSV season, as premature infants are at highest risk for severe RSV disease", "The RSV vaccine, which provides lifelong immunity after a single dose", "Administering prophylactic antibiotics throughout the winter months", "Keeping the infant in an isolated room for the first year of life"],
    a: 0,
    r: "Palivizumab is a monoclonal antibody given monthly during RSV season (typically November through March) to high-risk infants including those born prematurely. It provides passive immunity by binding to the RSV F protein. It is not a vaccine. Antibiotics are ineffective against viruses. Complete isolation is impractical and unnecessary with appropriate prevention.",
    s: "Respiratory"
  },
  {
    q: "A 5-month-old infant with RSV bronchiolitis requires nasal suctioning before feeds. BP 78/48, HR 152, RR 54, SpO2 93% on humidified nasal cannula. The nurse performs bulb syringe suctioning. Which technique is correct?",
    o: ["Compress the bulb before inserting it gently into the nostril, then release to create suction and withdraw secretions", "Insert the bulb and squeeze it while in the nostril to push secretions deeper for easier removal", "Suction each nostril for at least 30 seconds to ensure complete clearance", "Insert the bulb syringe as deep as possible into the nostril for maximum effect"],
    a: 0,
    r: "The correct technique is to compress the bulb first (outside the nostril), gently insert the tip into the nostril, then release to create suction that withdraws secretions. Squeezing while inserted pushes secretions deeper. Prolonged suctioning (30 seconds) causes mucosal edema and trauma. Deep insertion can damage the delicate nasal mucosa of infants.",
    s: "Respiratory"
  },
  // ===== PERTUSSIS (Questions 167-175) =====
  {
    q: "A 3-month-old infant is brought to the emergency department with paroxysmal coughing spells followed by a high-pitched inspiratory whoop. BP 78/48, HR 164, RR 50, SpO2 88% during a coughing episode. The infant becomes cyanotic during paroxysms. Which infection should the nurse suspect?",
    o: ["Pertussis (whooping cough), based on the characteristic paroxysmal cough pattern and inspiratory whoop", "Croup, based on the barking cough pattern", "Epiglottitis, based on the drooling and stridor", "Bronchiolitis, based on the expiratory wheezing"],
    a: 0,
    r: "The classic triad of pertussis is paroxysmal coughing, inspiratory whoop, and post-tussive emesis or cyanosis. The whooping sound occurs when the child inhales forcefully against a narrowed glottis after a prolonged coughing paroxysm. Croup presents with barking cough and stridor. Epiglottitis has drooling and tripod positioning. Bronchiolitis has expiratory wheezing.",
    s: "Respiratory"
  },
  {
    q: "A 4-month-old infant with confirmed pertussis is placed on droplet precautions. BP 76/46, HR 158, RR 48, SpO2 94% on room air between coughing episodes. The nurse notes the infant has post-tussive vomiting after severe coughing spells. Which nursing concern is the priority?",
    o: ["Risk for aspiration, dehydration, and inadequate nutrition due to the frequent vomiting and coughing spells", "The blood pressure reading, which suggests cardiogenic shock", "The need for immediate intubation based on the respiratory rate", "The infant's heart rate, which indicates a cardiac arrhythmia"],
    a: 0,
    r: "Post-tussive vomiting in pertussis creates risks for aspiration, dehydration, and nutritional compromise, especially in young infants. The nurse should position the infant to prevent aspiration, provide small frequent feedings when tolerated, and monitor hydration status. BP 76/46 is normal for this age. RR 48 is appropriate. HR 158 may be elevated but does not indicate arrhythmia.",
    s: "Respiratory"
  },
  {
    q: "A 6-week-old infant is diagnosed with pertussis. The healthcare provider prescribes azithromycin. BP 74/44, HR 156, RR 52, SpO2 93% on room air. The parent asks why an antibiotic is given for a cough. Which response is most accurate?",
    o: ["Azithromycin reduces the duration of infectiousness and prevents spread to others, though it may not significantly shorten the cough once paroxysms have begun", "The antibiotic will immediately stop the coughing spells", "Antibiotics are given to treat the viral cause of pertussis", "Azithromycin is given to prevent bacterial pneumonia from developing"],
    a: 0,
    r: "Pertussis is caused by Bordetella pertussis (a bacterium). Macrolide antibiotics (azithromycin, erythromycin) are given primarily to reduce the period of communicability and protect close contacts. Once the paroxysmal stage has begun, antibiotics have limited effect on symptom duration because the toxin-mediated damage is already present.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a family whose 2-month-old infant has pertussis. The infant's 4-year-old sibling and parents were exposed. BP for infant: 76/46, HR 150, RR 46, SpO2 95% on room air. Which prophylactic recommendation should the nurse anticipate?",
    o: ["All close household contacts should receive post-exposure prophylaxis with azithromycin regardless of vaccination status", "Only unvaccinated contacts need prophylaxis", "Prophylaxis is not needed since the family has been vaccinated", "Only the sibling under 7 years needs prophylaxis"],
    a: 0,
    r: "All close contacts of pertussis cases should receive post-exposure prophylaxis with a macrolide antibiotic (azithromycin) regardless of vaccination status, as vaccine-induced immunity wanes over time. This is especially important for household contacts where there may be other vulnerable individuals (infants, pregnant women, elderly). Vaccination status alone does not provide certainty of protection.",
    s: "Respiratory"
  },
  {
    q: "A 5-month-old infant with pertussis is having frequent coughing paroxysms followed by apneic episodes lasting 10 to 15 seconds. BP 78/48, HR 168, RR varies between 20 and 56, SpO2 drops to 80% during apnea. Which monitoring priority should the nurse establish?",
    o: ["Continuous cardiorespiratory monitoring and pulse oximetry with immediate access to resuscitation equipment", "Monitoring vital signs every 4 hours with routine nursing assessments", "Hourly peak flow measurements to track airway function", "Daily chest X-rays to assess for pneumonia development"],
    a: 0,
    r: "Apneic episodes in infants with pertussis are life-threatening and require continuous cardiorespiratory monitoring, continuous pulse oximetry, and immediate access to resuscitation equipment (bag-valve-mask, suction, oxygen). Every-4-hour monitoring is inadequate given the apneic episodes. Peak flow is not possible in infants. Daily chest X-rays do not address the immediate threat of apnea.",
    s: "Respiratory"
  },
  // ===== CHEST TUBE MANAGEMENT (Questions 176-188) =====
  {
    q: "A 45-year-old client has a chest tube connected to a water-seal drainage system following a left-sided pneumothorax. BP 118/72, HR 82, RR 18, SpO2 96% on 2 L/min. The nurse observes continuous bubbling in the water-seal chamber. Which interpretation is correct?",
    o: ["Continuous bubbling in the water-seal chamber indicates an air leak in the system or from the client's lung that should be reported", "Continuous bubbling is a normal expected finding in all chest tube systems", "Bubbling indicates the chest tube is blocked and needs to be irrigated", "Continuous bubbling means the suction is set too high"],
    a: 0,
    r: "Continuous bubbling in the water-seal chamber indicates an air leak. This may be from the client's lung (expected initially in a pneumothorax) or from a connection leak in the tubing system. The nurse should check all connections first, and if the leak persists, report to the provider. Intermittent bubbling with exhalation or coughing is expected; continuous bubbling is not normal.",
    s: "Respiratory"
  },
  {
    q: "A 58-year-old client with a chest tube for pleural effusion drainage is ambulating in the hallway. The drainage system accidentally tips over. BP 122/76, HR 80, RR 18, SpO2 95% on room air. Which action should the nurse take first?",
    o: ["Immediately return the drainage system to the upright position and assess the client's respiratory status", "Clamp the chest tube at the insertion site to prevent air entry", "Remove the chest tube and cover the site with an occlusive dressing", "Leave the system on the floor and call the healthcare provider"],
    a: 0,
    r: "If the drainage system tips over, it should be immediately returned to the upright position below the level of the client's chest. The nurse should then assess the client's respiratory status and check the water-seal level. Clamping a chest tube can cause tension pneumothorax. Removing the tube is not indicated. The system should not be left on the floor.",
    s: "Respiratory"
  },
  {
    q: "A 50-year-old client has a chest tube with 20 cmH2O of wall suction ordered. The nurse notes the suction control chamber is not bubbling. BP 120/74, HR 78, RR 16, SpO2 97% on room air. Which action should the nurse take?",
    o: ["Check that the suction tubing is connected to the wall suction and that the wall suction is turned on and functioning", "Increase the amount of water in the suction control chamber", "Clamp the chest tube and notify the provider of equipment failure", "Remove the chest tube since the suction is not working"],
    a: 0,
    r: "Absence of gentle bubbling in the suction control chamber indicates the suction is not connected or not turned on. The nurse should check all connections, verify the wall suction is on, and ensure the suction control chamber has the correct water level. Clamping or removing the tube for a suction issue is inappropriate and potentially dangerous.",
    s: "Respiratory"
  },
  {
    q: "A 62-year-old client with a chest tube reports sudden sharp chest pain and dyspnea. BP 106/64, HR 112, RR 28, SpO2 86%. The nurse notices the chest tube has become disconnected from the drainage system. Which action should the nurse perform immediately?",
    o: ["Submerge the end of the chest tube in a container of sterile water or saline to re-establish a water seal, and reconnect to a new drainage system", "Clamp the chest tube with two padded clamps indefinitely", "Reconnect the contaminated tubing to the existing drainage system", "Cover the chest tube opening with a dry gauze and tape it closed"],
    a: 0,
    r: "If a chest tube disconnects, the immediate priority is re-establishing a water seal to prevent air from entering the pleural space. Submerging the tube end in sterile water creates a temporary seal while a new sterile system is set up. Prolonged clamping risks tension pneumothorax. Reconnecting contaminated tubing introduces infection risk. Covering with dry gauze does not create a water seal.",
    s: "Respiratory"
  },
  {
    q: "A nurse is monitoring a 55-year-old client's chest tube drainage output. Over the past hour, the drainage has increased from pink serous fluid to 200 mL of bright red blood. BP 98/58, HR 118, RR 26, SpO2 92% on 2 L/min. Which action is most appropriate?",
    o: ["Notify the healthcare provider immediately, as this volume and colour of drainage combined with hemodynamic changes suggests active hemorrhage", "Mark the drainage level and reassess in 4 hours", "Clamp the chest tube to stop the bleeding", "Milk the chest tube tubing to encourage clot clearance"],
    a: 0,
    r: "Drainage exceeding 200 mL/hour of bright red blood with accompanying hypotension, tachycardia, and tachypnea indicates active hemorrhage (hemothorax). This requires immediate provider notification and possible surgical intervention. Waiting 4 hours is unsafe. Clamping could cause tamponade. Milking (stripping) tubing is generally discouraged as it generates excessive negative pressure.",
    s: "Respiratory"
  },
  {
    q: "A 48-year-old client's chest tube is being prepared for removal. The provider orders the chest tube to be removed during the client's exhalation or Valsalva manoeuvre. BP 120/74, HR 76, RR 16, SpO2 97% on room air. The nurse has petroleum gauze and an occlusive dressing ready. Why is the timing of removal important?",
    o: ["Removing during exhalation or Valsalva creates positive intrathoracic pressure that prevents air from being sucked into the pleural space through the tube site", "Removing during inhalation allows the lung to expand and push the tube out naturally", "The timing does not matter; the occlusive dressing prevents any air entry", "Removal during Valsalva is more comfortable for the client"],
    a: 0,
    r: "During exhalation or Valsalva, intrathoracic pressure is positive, which prevents ambient air from being drawn into the pleural space through the insertion site. If removed during inhalation, the negative intrathoracic pressure could cause air to enter and create a pneumothorax. The occlusive dressing is important but the timing is the critical safeguard against air entry.",
    s: "Respiratory"
  },
  {
    q: "A 40-year-old client with a chest tube has tidaling visible in the water-seal chamber. The fluid level rises during inhalation and falls during exhalation with spontaneous breathing. BP 118/72, HR 76, RR 16, SpO2 97% on room air. Which interpretation is correct?",
    o: ["Tidaling is a normal finding indicating the chest tube is patent and responsive to intrathoracic pressure changes", "Tidaling indicates the chest tube is blocked and needs to be replaced", "Tidaling means there is a large air leak that requires clamping", "The absence of tidaling would be a normal finding at this point"],
    a: 0,
    r: "Tidaling (fluctuation of fluid in the water-seal chamber with respiration) is a normal finding confirming the chest tube is patent and responding to normal intrathoracic pressure changes. Absence of tidaling could indicate tube occlusion (by clot or kinking) or full lung re-expansion. Tidaling does not indicate an air leak or blockage.",
    s: "Respiratory"
  },
  {
    q: "A 52-year-old client with a chest tube accidentally pulls on the tubing while repositioning in bed. The insertion site dressing is partially displaced. BP 122/76, HR 84, RR 20, SpO2 95% on room air. The chest tube appears to still be in place. Which action should the nurse take first?",
    o: ["Assess the insertion site for displacement, apply a new sterile occlusive dressing, and verify the drainage system is intact and functioning", "Remove the chest tube since the sterility has been compromised", "Push the chest tube in further to ensure it is secure", "Leave the dressing as it is and document the incident"],
    a: 0,
    r: "The nurse should carefully assess the insertion site for signs of tube displacement (air leak, subcutaneous emphysema), apply a new sterile occlusive dressing to maintain the seal, and verify the drainage system is functioning. Removing the tube for a dressing issue is excessive. Pushing the tube in could cause injury. Leaving the dressing compromised risks infection and air leak.",
    s: "Respiratory"
  },
  // ===== OXYGEN THERAPY (Questions 189-201) =====
  {
    q: "A 72-year-old client with COPD is admitted with a respiratory infection. BP 130/80, HR 90, RR 24, SpO2 85% on room air. The nurse is selecting the appropriate oxygen delivery device. Which device and flow rate is most appropriate?",
    o: ["Nasal cannula at 1 to 2 L/min, titrated to maintain SpO2 between 88% and 92%", "Non-rebreather mask at 15 L/min to achieve SpO2 of 100%", "Simple face mask at 10 L/min for rapid correction", "High-flow nasal cannula at 60 L/min for maximum oxygenation"],
    a: 0,
    r: "In COPD, the target SpO2 is 88% to 92% because these clients may rely on hypoxic drive for ventilation. Low-flow oxygen via nasal cannula (1 to 2 L/min) allows precise titration. High-flow oxygen risks suppressing the ventilatory drive, causing CO2 retention, and respiratory depression. A non-rebreather at 15 L/min delivers near 100% FiO2, which is excessive for COPD.",
    s: "Respiratory"
  },
  {
    q: "A 55-year-old client with acute respiratory failure requires precise oxygen delivery. BP 108/66, HR 110, RR 30, SpO2 84% on nasal cannula at 4 L/min. The healthcare provider orders FiO2 of 40%. Which device should the nurse select?",
    o: ["A Venturi mask set at 40% FiO2, as it delivers precise and consistent oxygen concentrations regardless of the client's breathing pattern", "A nasal cannula at 6 L/min", "A simple face mask at 5 L/min", "A partial rebreather mask at 10 L/min"],
    a: 0,
    r: "The Venturi mask (air-entrainment mask) is the device of choice when a precise FiO2 is required. It uses jet mixing to deliver an exact oxygen concentration regardless of the client's respiratory rate or tidal volume. Nasal cannula and simple face masks deliver variable FiO2 depending on the client's breathing pattern. A partial rebreather delivers 60% to 75% FiO2, which is more than ordered.",
    s: "Respiratory"
  },
  {
    q: "A 60-year-old client is receiving oxygen via a non-rebreather mask at 15 L/min. BP 100/62, HR 108, RR 32, SpO2 88%. The nurse notices the reservoir bag is completely deflating during each inhalation. Which action should the nurse take?",
    o: ["Ensure the oxygen flow rate is sufficient to keep the reservoir bag at least one-third full during inhalation", "Remove the non-rebreather mask since it is not working properly", "Reduce the flow rate so the bag does not inflate at all", "This is the expected function of the reservoir bag"],
    a: 0,
    r: "The reservoir bag on a non-rebreather mask must remain at least partially inflated (one-third full) during inspiration to ensure the client is receiving high-concentration oxygen and not rebreathing CO2. Complete deflation means the client is not getting adequate oxygen from the reservoir. The flow rate should be increased to keep the bag inflated, or the mask may need adjustment.",
    s: "Respiratory"
  },
  {
    q: "A 68-year-old client is being weaned from a high-flow nasal cannula. Current settings: FiO2 50%, flow rate 40 L/min. BP 122/76, HR 82, RR 20, SpO2 95%. The healthcare provider orders a gradual wean. Which approach is correct?",
    o: ["Decrease the FiO2 first in increments (e.g., by 5% to 10%), then reduce the flow rate, while monitoring SpO2 and respiratory status", "Discontinue the high-flow cannula abruptly and switch to room air", "Increase the flow rate while decreasing FiO2 simultaneously", "Reduce the flow rate first to the minimum, then decrease FiO2"],
    a: 0,
    r: "When weaning high-flow nasal cannula, FiO2 is typically reduced first (in small increments) while maintaining flow rate, since the high flow provides airway pressure support and reduces work of breathing. Once FiO2 is near room air levels, the flow rate is gradually decreased. Abrupt discontinuation could cause respiratory decompensation.",
    s: "Respiratory"
  },
  {
    q: "A 75-year-old client on home oxygen therapy calls the clinic reporting a nosebleed while using the nasal cannula at 2 L/min. BP 128/78, HR 76, RR 18, SpO2 92% on the cannula. Which advice should the nurse provide first?",
    o: ["Apply gentle pressure to the nose, ensure the humidifier bottle is filled, and check that the cannula prongs are not causing nasal irritation", "Remove the oxygen permanently and breathe room air", "Increase the oxygen flow to 6 L/min to compensate for blood loss", "Go to the emergency department immediately for cauterization"],
    a: 0,
    r: "Nasal dryness and epistaxis are common side effects of nasal cannula use. The nurse should advise standard nosebleed management (pressure, head slightly forward), ensure the humidifier bottle is being used and filled, and check that the cannula prongs fit properly. Removing oxygen is unsafe. Increasing flow worsens dryness. Emergency care is not needed for a minor nosebleed.",
    s: "Respiratory"
  },
  {
    q: "A 50-year-old client is receiving oxygen via simple face mask at 8 L/min. The client needs to eat lunch. BP 120/74, HR 78, RR 18, SpO2 94% on the face mask. Which action should the nurse take?",
    o: ["Switch to a nasal cannula at an appropriate flow rate during meals as ordered, and return to the face mask afterward", "Remove the oxygen completely during the meal and replace it after", "Keep the face mask on and have the client eat around the mask", "Skip the meal to maintain continuous face mask oxygen therapy"],
    a: 0,
    r: "A nasal cannula allows the client to eat and drink while receiving oxygen. The nurse should switch to nasal cannula during meals (with an equivalent flow rate as ordered) and return to the face mask afterward. Removing oxygen completely could cause desaturation. Eating around a face mask is impractical. Skipping meals compromises nutrition.",
    s: "Respiratory"
  },
  {
    q: "A 80-year-old client with pneumonia is on a Venturi mask at 35% FiO2. SpO2 reads 98%, BP 126/78, HR 76, RR 18. The client is comfortable and breathing easily. Which assessment should the nurse perform before considering any oxygen adjustment?",
    o: ["Consult with the healthcare provider about possibly weaning the FiO2, as SpO2 of 98% may indicate the current setting is higher than needed", "Increase the FiO2 to 60% to further improve oxygenation", "Immediately remove the Venturi mask and switch to room air", "Maintain the current settings indefinitely since the client is comfortable"],
    a: 0,
    r: "An SpO2 of 98% on supplemental oxygen in an older adult with pneumonia suggests the current FiO2 may be higher than necessary. The nurse should discuss possible weaning with the provider, as unnecessary supplemental oxygen can mask clinical deterioration and has potential toxicity with prolonged use. Abrupt removal risks desaturation. Increasing FiO2 is unnecessary.",
    s: "Respiratory"
  },
  {
    q: "A 45-year-old client is receiving oxygen therapy via nasal cannula at 4 L/min. The client complains of dry mouth and nasal passages. BP 118/72, HR 80, RR 18, SpO2 95%. Which intervention should the nurse implement?",
    o: ["Ensure a humidifier is attached to the oxygen source, offer oral care, and provide water-soluble lubricant for the nares", "Increase the oxygen flow rate to 6 L/min to improve comfort", "Discontinue the oxygen until the dryness resolves", "Apply petroleum jelly to the nares and lips for moisture"],
    a: 0,
    r: "Oxygen at flow rates above 4 L/min dries mucous membranes. Humidification moistens the oxygen. Oral care and water-soluble nasal lubricant improve comfort. Increasing the flow rate worsens dryness. Discontinuing oxygen could cause hypoxemia. Petroleum-based products are contraindicated near oxygen due to flammability.",
    s: "Respiratory"
  },
  // ===== ARDS (Questions 202-210) =====
  {
    q: "A 42-year-old client is admitted to the ICU with ARDS following aspiration pneumonitis. BP 94/58, HR 120, RR 36, SpO2 78% on 15 L/min non-rebreather mask. ABG shows pH 7.28, PaCO2 52, PaO2 48, HCO3 24. Which intervention should the nurse anticipate?",
    o: ["Preparation for endotracheal intubation and mechanical ventilation, as the client has refractory hypoxemia despite maximum supplemental oxygen", "Increasing the oxygen flow rate beyond 15 L/min on the non-rebreather mask", "Administering IV antibiotics and waiting for improvement", "Switching to a nasal cannula for client comfort"],
    a: 0,
    r: "ARDS is characterized by refractory hypoxemia (PaO2 48 despite maximum supplemental oxygen). The client requires intubation and mechanical ventilation with PEEP to recruit collapsed alveoli and improve gas exchange. A non-rebreather cannot deliver higher than 90% to 100% FiO2. Switching to nasal cannula would worsen hypoxemia. Antibiotics alone do not address the oxygenation failure.",
    s: "Respiratory"
  },
  {
    q: "A 55-year-old client with ARDS is on mechanical ventilation with FiO2 80% and PEEP 12 cmH2O. BP 106/64, HR 98, RR 22 (ventilator set at 16), SpO2 90%. The nurse notes a sudden drop in SpO2 to 82% with increased peak airway pressures. Which complication should the nurse suspect first?",
    o: ["Pneumothorax from barotrauma caused by high ventilator pressures and PEEP", "Ventilator-associated pneumonia developing over minutes", "Improvement in lung compliance reducing the need for PEEP", "The pulse oximeter is malfunctioning"],
    a: 0,
    r: "In mechanically ventilated ARDS clients, sudden desaturation with increased peak airway pressures suggests pneumothorax from barotrauma, which is a known complication of high PEEP and FiO2. This is a medical emergency requiring immediate assessment (absent breath sounds on one side, tracheal deviation) and possibly emergent needle decompression. VAP develops over days, not minutes.",
    s: "Respiratory"
  },
  {
    q: "A 48-year-old client with ARDS is being ventilated using lung-protective strategy. The nurse monitors tidal volumes set at 6 mL/kg of ideal body weight. The client weighs 70 kg (ideal body weight). BP 110/68, HR 92, RR 18 (ventilator), SpO2 92% on FiO2 60%. Which finding should the nurse report?",
    o: ["A PaCO2 of 55 mmHg, which may be acceptable (permissive hypercapnia) in lung-protective ventilation but should be confirmed with the provider", "A tidal volume of 420 mL, which is within the prescribed range", "An SpO2 of 92%, which is adequate for ARDS management", "A respiratory rate of 18, which matches the ventilator setting"],
    a: 0,
    r: "Lung-protective ventilation uses low tidal volumes (6 mL/kg IBW = 420 mL for 70 kg), which may result in permissive hypercapnia (elevated CO2). While this is often tolerated to prevent ventilator-induced lung injury, the nurse should report a PaCO2 of 55 to the provider for awareness and to ensure the pH is acceptable. The tidal volume of 420 mL and SpO2 of 92% are within target.",
    s: "Respiratory"
  },
  {
    q: "A 60-year-old client with ARDS is placed in the prone position. BP 108/66, HR 88, RR 16 (ventilator), SpO2 improves from 86% to 93% after proning. Which nursing assessment is most critical during prone positioning?",
    o: ["Assess the face, eyes, and pressure points regularly, as prone positioning increases the risk of facial edema, corneal injury, and pressure injuries", "Monitor for decreased SpO2, as prone positioning always worsens oxygenation", "Assess only the posterior chest for skin breakdown", "Check the blood pressure every 30 minutes but no other assessments are needed"],
    a: 0,
    r: "Prone positioning in ARDS improves oxygenation by redistributing blood flow to better-ventilated lung regions. However, it creates risks for facial and periorbital edema, corneal abrasion (eyes must be lubricated and protected), pressure injuries on the face, chest, and anterior bony prominences, and accidental extubation. The improved SpO2 (86% to 93%) confirms the expected benefit.",
    s: "Respiratory"
  },
  {
    q: "A 50-year-old client with ARDS develops worsening renal function. BUN 38 mg/dL, creatinine 2.8 mg/dL. BP 88/54, HR 116, RR 20 (ventilator), SpO2 90% on FiO2 70% with PEEP 14. Urine output has been 80 mL in the past 8 hours. Which complication is most likely developing?",
    o: ["Multi-organ dysfunction syndrome (MODS), as ARDS with renal failure and hemodynamic instability indicates systemic deterioration", "Isolated acute kidney injury from contrast dye exposure", "Normal renal response to mechanical ventilation", "Medication-induced nephrotoxicity that will resolve with dose adjustments"],
    a: 0,
    r: "ARDS can trigger a systemic inflammatory response leading to multi-organ dysfunction syndrome (MODS). Declining renal function (elevated BUN and creatinine, oliguria) with hemodynamic instability (hypotension, tachycardia) in the setting of ARDS strongly suggests MODS. This carries a very high mortality rate and requires aggressive supportive care.",
    s: "Respiratory"
  },
  // ===== PULMONARY EMBOLISM (Questions 211-220) =====
  {
    q: "A 38-year-old client is 5 days post-operative from hip replacement surgery. The client suddenly develops sharp pleuritic chest pain, dyspnea, and anxiety. BP 96/58, HR 128, RR 34, SpO2 86% on room air. Which condition should the nurse suspect?",
    o: ["Pulmonary embolism, given the post-surgical risk, sudden onset of chest pain, tachycardia, and hypoxemia", "Acute myocardial infarction based on the chest pain", "Pneumothorax from surgical positioning", "Post-operative atelectasis causing mild discomfort"],
    a: 0,
    r: "The sudden onset of pleuritic chest pain, dyspnea, tachycardia, hypoxemia, and anxiety in a post-surgical client is a classic presentation of pulmonary embolism. Hip surgery is a major risk factor for DVT/PE. While MI and pneumothorax should be considered in the differential, the clinical picture most strongly suggests PE. Atelectasis does not typically present this acutely.",
    s: "Respiratory"
  },
  {
    q: "A 45-year-old client is diagnosed with a massive pulmonary embolism. BP 80/50, HR 136, RR 36, SpO2 80% on 15 L/min non-rebreather. The client is pale, diaphoretic, and confused. Which intervention should the nurse anticipate as the priority?",
    o: ["Prepare for thrombolytic therapy or surgical embolectomy while supporting hemodynamics with IV fluids and vasopressors as ordered", "Administer subcutaneous heparin and monitor for improvement over 24 hours", "Begin oral warfarin therapy immediately", "Apply compression stockings and elevate the legs"],
    a: 0,
    r: "A massive PE with hemodynamic instability (hypotension, tachycardia, altered mental status) requires emergent intervention. Thrombolytics (tPA) can dissolve the clot rapidly. Surgical embolectomy may be needed if thrombolytics are contraindicated. Subcutaneous heparin is insufficient for massive PE. Oral warfarin takes days to become therapeutic. Compression stockings do not address the acute emergency.",
    s: "Respiratory"
  },
  {
    q: "A 50-year-old client is started on IV heparin for a confirmed pulmonary embolism. BP 108/68, HR 102, RR 26, SpO2 90% on 4 L/min. The baseline aPTT is 30 seconds. Which monitoring schedule is most appropriate?",
    o: ["Check aPTT every 6 hours initially and adjust the heparin drip per protocol until the therapeutic range of 1.5 to 2.5 times control is achieved", "Check aPTT once daily and adjust the drip weekly", "Monitor INR instead of aPTT for heparin therapy", "No monitoring is needed once the heparin infusion is started"],
    a: 0,
    r: "IV heparin requires close monitoring of aPTT (not INR) every 6 hours initially to achieve a therapeutic range of 1.5 to 2.5 times the control value. For a control of 30 seconds, the target would be 45 to 75 seconds. INR monitors warfarin, not heparin. Daily monitoring is insufficient during the initial titration phase. All anticoagulants require monitoring for effectiveness and safety.",
    s: "Respiratory"
  },
  {
    q: "A 60-year-old client with a history of DVT presents with sudden onset hemoptysis, pleuritic chest pain, and dyspnea. BP 104/62, HR 114, RR 30, SpO2 88% on room air. The nurse notes the client's right calf is warm, swollen, and tender. Which assessment finding most strongly supports pulmonary embolism?",
    o: ["The combination of hemoptysis, pleuritic chest pain, and signs of DVT in the right calf, indicating the embolus likely originated from the leg", "The blood pressure of 104/62, which confirms PE", "The hemoptysis alone, which is diagnostic of PE", "The calf warmth, which is the definitive test for PE"],
    a: 0,
    r: "The classic triad of PE includes dyspnea, pleuritic chest pain, and hemoptysis. Combined with signs of DVT in the calf (the most common source of PE), the clinical picture strongly supports PE. While no single finding is diagnostic (CT pulmonary angiography is the gold standard), the combination of findings with DVT history makes PE highly probable.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a 35-year-old client who is on prolonged bed rest after a spinal cord injury. BP 110/70, HR 76, RR 16, SpO2 97% on room air. Which PE prevention measure should the nurse implement?",
    o: ["Apply sequential compression devices (SCDs) as ordered and administer prophylactic anticoagulation as prescribed", "Encourage the client to cross their legs while in bed for comfort", "Restrict all fluid intake to prevent edema formation", "Monitor for PE symptoms but do not implement prevention strategies"],
    a: 0,
    r: "Clients on prolonged bed rest are at high risk for DVT and subsequent PE. Prevention includes mechanical measures (SCDs, which promote venous return) and pharmacological prophylaxis (low-dose heparin or LMWH as prescribed). Crossing legs impedes venous return. Adequate hydration prevents blood viscosity. Prevention is always preferable to monitoring for complications after they occur.",
    s: "Respiratory"
  },
  {
    q: "A 42-year-old client is being discharged on rivaroxaban after a pulmonary embolism. BP 116/72, HR 78, RR 16, SpO2 97% on room air. Which discharge instruction should the nurse provide?",
    o: ["Report any unusual bleeding such as blood in stool, dark urine, excessive bruising, or prolonged bleeding from cuts to your healthcare provider immediately", "You can safely take ibuprofen or aspirin for headaches while on rivaroxaban", "Skip doses if you are feeling well to reduce medication side effects", "INR monitoring will be required weekly while taking rivaroxaban"],
    a: 0,
    r: "Rivaroxaban is an anticoagulant that increases bleeding risk. Clients must report any signs of bleeding promptly. NSAIDs (ibuprofen) and aspirin increase bleeding risk and should be avoided. Doses should not be skipped as this could lead to recurrent thromboembolism. Rivaroxaban (a DOAC) does not require routine INR monitoring (that is for warfarin).",
    s: "Respiratory"
  },
  // ===== OBSTRUCTIVE SLEEP APNEA (Questions 221-229) =====
  {
    q: "A 52-year-old client with a BMI of 38 is referred for a sleep study after the partner reports loud snoring and witnessed apneic episodes lasting up to 20 seconds. BP 148/92, HR 82, RR 16, SpO2 94% on room air while awake. Which assessment finding is most consistent with obstructive sleep apnea?",
    o: ["Excessive daytime sleepiness, morning headaches, and witnessed apneic episodes during sleep", "Insomnia with difficulty falling asleep at night", "Restless leg syndrome with periodic limb movements", "Nighttime asthma with wheezing episodes only during sleep"],
    a: 0,
    r: "OSA presents with witnessed apneic episodes (partner reports cessation of breathing during sleep), loud snoring, excessive daytime sleepiness (from fragmented sleep), and morning headaches (from nocturnal hypercapnia). The client's obesity (BMI 38) and hypertension are additional risk factors. Insomnia and restless leg syndrome are different sleep disorders.",
    s: "Respiratory"
  },
  {
    q: "A 48-year-old client is newly diagnosed with moderate obstructive sleep apnea (AHI of 22 events/hour). BP 140/88, HR 78, RR 16, SpO2 96% on room air. The healthcare provider prescribes CPAP therapy. Which teaching point is most important?",
    o: ["Use the CPAP machine every night for the entire sleep period, as consistent use is essential for symptom relief and reducing cardiovascular risk", "Use the CPAP only when you feel tired, as overuse can cause lung damage", "The CPAP will cure your sleep apnea after 6 months of use", "Sleep on your back with the CPAP to maximize its effectiveness"],
    a: 0,
    r: "Consistent nightly CPAP use is essential for managing OSA. CPAP prevents upper airway collapse by providing continuous positive pressure, reducing apneic events, improving sleep quality, and decreasing cardiovascular risk. CPAP does not cure OSA; it manages it. Overuse does not cause lung damage. Lateral positioning is actually preferred for OSA, not supine.",
    s: "Respiratory"
  },
  {
    q: "A 55-year-old client with OSA and CPAP therapy reports the mask causes skin irritation on the bridge of the nose and the client frequently removes it during the night. BP 142/86, HR 80, RR 16, SpO2 95% on room air. Which intervention should the nurse suggest?",
    o: ["Consult with the respiratory therapist about a different mask style or size, and check that the headgear is not too tight", "Tell the client to stop using CPAP and just use extra pillows instead", "Recommend applying petroleum jelly under the mask to reduce irritation", "Advise the client that skin irritation is permanent and cannot be improved"],
    a: 0,
    r: "Mask fit is crucial for CPAP compliance. The respiratory therapist can evaluate for a different mask type (nasal pillows, full face, nasal mask) or adjust the size and headgear tension. Skin irritation from poor fit is a common reason for CPAP non-compliance and is usually solvable. Petroleum jelly can degrade mask materials. Pillows alone do not treat OSA.",
    s: "Respiratory"
  },
  {
    q: "A 60-year-old client with untreated severe OSA is scheduled for elective knee surgery under general anaesthesia. BP 150/94, HR 84, RR 18, SpO2 93% on room air. Which pre-operative concern should the nurse communicate to the surgical team?",
    o: ["The untreated severe OSA increases the risk of difficult intubation, post-operative respiratory depression, and airway obstruction after anaesthesia", "The OSA will have no impact on the anaesthesia or surgery", "The client should not receive any pain medication post-operatively due to the OSA", "The surgery should be cancelled permanently due to the OSA diagnosis"],
    a: 0,
    r: "Untreated OSA significantly increases perioperative risk including difficult airway management, sensitivity to sedatives and opioids, post-operative airway obstruction, and respiratory depression. The anaesthesia team must be aware to plan appropriately. Pain medication is still used but with careful monitoring. Surgery is not necessarily cancelled but requires modified planning.",
    s: "Respiratory"
  },
  {
    q: "A 50-year-old client with OSA asks about lifestyle modifications that may help. BMI is 36, BP 144/90, HR 80, RR 16, SpO2 95% on room air. The client drinks alcohol most evenings. Which recommendation is most appropriate?",
    o: ["Lose weight, avoid alcohol before bedtime, and sleep in a lateral position rather than supine to reduce airway obstruction", "Weight loss will not affect sleep apnea, so focus only on CPAP therapy", "Drink alcohol before bed to help you fall asleep faster and sleep more deeply", "Sleep in a supine position with a thin pillow to keep the airway straight"],
    a: 0,
    r: "Weight loss is the most effective lifestyle modification for OSA, as excess tissue in the upper airway contributes to obstruction. Alcohol relaxes pharyngeal muscles and worsens apneic episodes, so it should be avoided before sleep. Lateral sleeping reduces gravitational collapse of the soft palate and tongue. Supine positioning worsens OSA.",
    s: "Respiratory"
  },
  // ===== LUNG CANCER (Questions 230-238) =====
  {
    q: "A 62-year-old client with a 40-pack-year smoking history presents with a persistent cough, hemoptysis, and unintentional weight loss of 8 kg over 3 months. BP 128/78, HR 84, RR 20, SpO2 94% on room air. A chest X-ray reveals a mass in the right upper lobe. Which finding is most concerning for malignancy?",
    o: ["The combination of persistent cough, hemoptysis, significant weight loss, and lung mass in a heavy smoker, which strongly suggests lung cancer", "The blood pressure of 128/78, which may indicate cardiac involvement", "The SpO2 of 94%, which is too low for a non-hospitalized client", "The respiratory rate of 20, suggesting advanced respiratory failure"],
    a: 0,
    r: "Persistent cough, hemoptysis, significant unintentional weight loss, and a lung mass in a client with a 40-pack-year smoking history are classic warning signs of lung cancer. Smoking is the leading risk factor. The BP, SpO2, and RR are all within acceptable ranges and are not the primary concern in this clinical picture.",
    s: "Respiratory"
  },
  {
    q: "A 58-year-old client with non-small cell lung cancer is undergoing radiation therapy to the chest. The client reports difficulty swallowing and a sore throat. BP 120/74, HR 78, RR 18, SpO2 96% on room air. Which complication of radiation therapy should the nurse suspect?",
    o: ["Radiation esophagitis from the radiation field affecting the oesophagus, which is an expected side effect of thoracic radiation", "A new primary cancer of the oesophagus", "An allergic reaction to the radiation beams", "Vocal cord paralysis from the lung tumour directly"],
    a: 0,
    r: "Radiation esophagitis is a common side effect of thoracic radiation therapy because the oesophagus is within the radiation field. Symptoms include dysphagia (difficulty swallowing), odynophagia (painful swallowing), and sore throat. Management includes soft bland diet, topical analgesics, and pain management. It is not a new cancer or allergic reaction.",
    s: "Respiratory"
  },
  {
    q: "A 65-year-old client with advanced lung cancer reports progressively worsening facial swelling, neck vein distension, and upper extremity oedema. BP 148/92, HR 90, RR 24, SpO2 92% on room air. Which oncologic emergency should the nurse recognize?",
    o: ["Superior vena cava syndrome caused by tumour compression of the SVC, requiring urgent notification of the healthcare provider", "Normal fluid retention from inactivity", "An allergic reaction to chemotherapy medications", "Right-sided heart failure from pre-existing cardiac disease"],
    a: 0,
    r: "Superior vena cava (SVC) syndrome occurs when a lung tumour compresses or invades the SVC, obstructing venous return from the head, neck, and upper extremities. Classic signs include facial edema, JVD, upper extremity swelling, and headache. This is an oncologic emergency requiring urgent intervention (radiation, stenting, or chemotherapy). It is not caused by inactivity or allergies.",
    s: "Respiratory"
  },
  {
    q: "A 70-year-old client with lung cancer is receiving palliative care. The client has increasing dyspnea, BP 106/64, HR 96, RR 28, SpO2 86% on 4 L/min nasal cannula. The client's advance directive states comfort measures only. Which intervention is most appropriate?",
    o: ["Administer prescribed opioids for dyspnea relief, increase oxygen for comfort, and provide emotional support to the client and family", "Initiate non-invasive ventilation to improve oxygenation", "Transfer the client to the ICU for intubation and mechanical ventilation", "Withhold all medications and allow natural death without symptom management"],
    a: 0,
    r: "Palliative care with comfort measures focuses on symptom relief. Low-dose opioids are effective for managing dyspnea in terminal illness by reducing the sensation of breathlessness. Supplemental oxygen provides comfort. Non-invasive ventilation and ICU transfer contradict comfort measures only. Withholding symptom management is not compassionate end-of-life care.",
    s: "Respiratory"
  },
  {
    q: "A 56-year-old client is diagnosed with small cell lung cancer (SCLC). The oncologist explains this type has a high growth rate and early metastasis. BP 122/76, HR 80, RR 18, SpO2 96% on room air. Which paraneoplastic syndrome is most commonly associated with SCLC?",
    o: ["Syndrome of inappropriate antidiuretic hormone secretion (SIADH), causing dilutional hyponatremia", "Cushing syndrome from excess cortisol production", "Hypercalcemia from PTH-related peptide secretion", "Polycythemia from excess erythropoietin production"],
    a: 0,
    r: "SCLC is the lung cancer type most commonly associated with SIADH, where tumour cells produce ectopic ADH, causing water retention and dilutional hyponatremia. Symptoms include confusion, nausea, and seizures. Cushing syndrome can also occur with SCLC but is less common. Hypercalcemia is more associated with squamous cell carcinoma. The nurse should monitor sodium levels closely.",
    s: "Respiratory"
  },
  // ===== PNEUMOTHORAX (Questions 239-248) =====
  {
    q: "A 22-year-old tall, thin male suddenly develops sharp right-sided chest pain and dyspnea while playing basketball. BP 116/72, HR 104, RR 26, SpO2 93% on room air. The nurse notes decreased breath sounds on the right side. Which condition should the nurse suspect?",
    o: ["Spontaneous pneumothorax, which is common in tall, thin young males and presents with sudden chest pain and decreased breath sounds on the affected side", "Acute myocardial infarction from exertion", "Pulmonary embolism from a lower extremity DVT", "Musculoskeletal chest wall strain from exercise"],
    a: 0,
    r: "Primary spontaneous pneumothorax classically occurs in tall, thin young males (ages 18 to 35) due to rupture of subpleural blebs. The sudden onset of sharp chest pain with decreased breath sounds on the affected side during physical activity is a typical presentation. MI is rare in a 22-year-old. PE would require DVT risk factors. Musculoskeletal strain does not cause decreased breath sounds.",
    s: "Respiratory"
  },
  {
    q: "A 55-year-old client with COPD develops a tension pneumothorax. BP 78/48, HR 138, RR 36, SpO2 74%. The nurse observes tracheal deviation to the left, absent breath sounds on the right, and distended neck veins. Which intervention should the nurse anticipate as the immediate priority?",
    o: ["Emergency needle decompression of the right chest followed by chest tube insertion to relieve the pressure causing cardiovascular collapse", "Obtain a chest X-ray to confirm the diagnosis before any intervention", "Administer a bronchodilator to relieve the airway obstruction", "Position the client in Trendelenburg to improve blood flow to the brain"],
    a: 0,
    r: "Tension pneumothorax is a life-threatening emergency where air enters the pleural space but cannot escape, causing progressive pressure buildup that shifts the mediastinum, compresses the heart and great vessels, and causes cardiovascular collapse. Immediate needle decompression (large-bore needle in the 2nd intercostal space, midclavicular line on the affected side) is lifesaving. Waiting for a chest X-ray can be fatal.",
    s: "Respiratory"
  },
  {
    q: "A 30-year-old client is diagnosed with a small, stable pneumothorax (less than 15% lung collapse). BP 118/72, HR 82, RR 18, SpO2 96% on room air. The client is asymptomatic at rest. Which treatment approach should the nurse anticipate?",
    o: ["Observation with serial chest X-rays and supplemental oxygen, as small stable pneumothoraces may resolve spontaneously with conservative management", "Immediate chest tube insertion regardless of the size", "Emergency thoracotomy in the operating room", "Discharge without any follow-up since the client is asymptomatic"],
    a: 0,
    r: "Small, stable pneumothoraces (less than 15 to 20% collapse) in clinically stable clients may be managed conservatively with observation, serial chest X-rays to monitor resolution, and supplemental oxygen (which accelerates air reabsorption by 4 times). Chest tubes and surgery are reserved for larger or symptomatic pneumothoraces. Follow-up is essential even for asymptomatic clients.",
    s: "Respiratory"
  },
  {
    q: "A 40-year-old client is recovering from a chest tube insertion for pneumothorax. The nurse notes the water-seal chamber shows no more tidaling, and a repeat chest X-ray shows full lung re-expansion. BP 120/74, HR 76, RR 16, SpO2 98% on room air. Which action should the nurse anticipate?",
    o: ["Notify the healthcare provider, as the absence of tidaling with full re-expansion may indicate readiness for chest tube removal", "Increase the suction to re-establish tidaling", "Replace the drainage system, as the absence of tidaling means the system is defective", "Clamp the chest tube permanently since the lung is re-expanded"],
    a: 0,
    r: "Absence of tidaling with confirmed full lung re-expansion on chest X-ray indicates the lung is fully inflated and the pleural space has sealed. This may indicate readiness for chest tube removal. The provider should be notified for evaluation. Increasing suction or replacing the system is unnecessary. Permanent clamping without provider assessment is not appropriate.",
    s: "Respiratory"
  },
  {
    q: "A 35-year-old client with a right-sided pneumothorax is receiving oxygen via nasal cannula at 4 L/min. The client asks why oxygen helps if the problem is air outside the lung, not inside it. BP 120/74, HR 84, RR 20, SpO2 95%. Which explanation is correct?",
    o: ["Supplemental oxygen increases the concentration of oxygen in the blood and also accelerates the reabsorption of air from the pleural space by replacing nitrogen with more readily absorbed oxygen", "Oxygen pushes the air out of the pleural space mechanically", "Oxygen is given only for client comfort and has no therapeutic benefit for pneumothorax", "Supplemental oxygen reinflates the collapsed lung directly"],
    a: 0,
    r: "Supplemental oxygen provides two benefits in pneumothorax: it treats hypoxemia from the reduced lung surface area, and it accelerates pleural air reabsorption by creating a nitrogen concentration gradient (replacing nitrogen in the blood with oxygen, which enhances nitrogen reabsorption from the pleural space). It does not mechanically push air out or directly reinflate the lung.",
    s: "Respiratory"
  },
  {
    q: "A 28-year-old client with a history of two previous spontaneous pneumothoraces on the right side presents with another episode. BP 112/68, HR 92, RR 22, SpO2 92% on room air. Which surgical intervention should the nurse anticipate being discussed?",
    o: ["Video-assisted thoracoscopic surgery (VATS) with pleurodesis or bleb resection to prevent recurrence, as the client has had multiple episodes", "No surgical intervention, as pneumothorax always resolves with conservative management", "Open-heart surgery to repair the lung", "Bilateral lung transplantation"],
    a: 0,
    r: "Recurrent spontaneous pneumothorax (two or more episodes on the same side) is an indication for surgical intervention to prevent future recurrences. VATS with mechanical or chemical pleurodesis (creates adhesion between pleural layers) and/or bleb resection (removes the ruptured blebs) is the standard approach. The recurrence rate after a second episode is approximately 50% without surgical intervention.",
    s: "Respiratory"
  },
  // ===== ABG INTERPRETATION (Questions 249-261) =====
  {
    q: "A 70-year-old client with pneumonia has ABG results: pH 7.48, PaCO2 30 mmHg, HCO3 24 mEq/L, PaO2 62 mmHg. BP 108/66, HR 108, RR 32, SpO2 90% on 2 L/min. Which interpretation is correct?",
    o: ["Uncompensated respiratory alkalosis with hypoxemia, caused by hyperventilation in response to the pneumonia", "Metabolic acidosis from lactic acid buildup", "Normal ABG values for a client with pneumonia", "Compensated metabolic alkalosis"],
    a: 0,
    r: "pH 7.48 (alkalotic), PaCO2 30 (low, respiratory cause of alkalosis), HCO3 24 (normal, no metabolic compensation), PaO2 62 (hypoxemia). The client is hyperventilating (RR 32) in response to hypoxemia from pneumonia, blowing off excess CO2. Since HCO3 is normal, there is no compensation yet, making this uncompensated respiratory alkalosis.",
    s: "Respiratory"
  },
  {
    q: "A 65-year-old client with COPD has ABG results: pH 7.36, PaCO2 56 mmHg, HCO3 32 mEq/L, PaO2 68 mmHg. BP 128/78, HR 80, RR 20, SpO2 92% on 2 L/min. Which interpretation is correct?",
    o: ["Fully compensated respiratory acidosis, which is expected in chronic COPD due to chronic CO2 retention with renal compensation", "Uncompensated metabolic alkalosis", "Acute respiratory acidosis requiring intubation", "Normal ABG results with no abnormalities"],
    a: 0,
    r: "pH 7.36 (low normal, so the primary problem is acidosis), PaCO2 56 (elevated, respiratory cause), HCO3 32 (elevated, renal compensation by retaining bicarbonate). Since pH is within normal range (7.35 to 7.45), this is fully compensated respiratory acidosis. This is the expected baseline for chronic COPD clients with chronic CO2 retention.",
    s: "Respiratory"
  },
  {
    q: "A 40-year-old client with diabetic ketoacidosis has ABG results: pH 7.22, PaCO2 18 mmHg, HCO3 8 mEq/L, PaO2 98 mmHg. BP 98/58, HR 118, RR 36 (deep, rapid), SpO2 97% on room air. Which interpretation is correct?",
    o: ["Partially compensated metabolic acidosis with respiratory compensation (Kussmaul respirations) attempting to blow off CO2", "Uncompensated respiratory acidosis", "Fully compensated respiratory alkalosis", "Normal ABG values during diabetic ketoacidosis"],
    a: 0,
    r: "pH 7.22 (severely acidotic), PaCO2 18 (low, indicating respiratory compensation by hyperventilation), HCO3 8 (very low, metabolic cause of acidosis from ketoacid accumulation). Since pH is still outside normal range, this is partially compensated. The deep, rapid breathing (Kussmaul respirations at RR 36) is the body's attempt to reduce CO2 and raise pH.",
    s: "Respiratory"
  },
  {
    q: "A 55-year-old client post-general anaesthesia has ABG results: pH 7.30, PaCO2 54 mmHg, HCO3 25 mEq/L, PaO2 72 mmHg. BP 114/70, HR 88, RR 10, SpO2 91% on 2 L/min. Which interpretation is correct?",
    o: ["Uncompensated respiratory acidosis from hypoventilation, likely due to residual anaesthetic effects suppressing the respiratory drive", "Compensated metabolic acidosis", "Respiratory alkalosis from hyperventilation", "Normal post-anaesthesia ABG findings"],
    a: 0,
    r: "pH 7.30 (acidotic), PaCO2 54 (elevated, respiratory cause), HCO3 25 (normal, no metabolic compensation yet). The low respiratory rate (RR 10) indicates hypoventilation from residual anaesthetic effects causing CO2 retention. Since HCO3 is normal, the kidneys have not had time to compensate, making this uncompensated respiratory acidosis.",
    s: "Respiratory"
  },
  {
    q: "A 30-year-old client having a severe anxiety attack has ABG results: pH 7.52, PaCO2 24 mmHg, HCO3 23 mEq/L, PaO2 110 mmHg. BP 126/78, HR 112, RR 38, SpO2 100% on room air. Which intervention is most appropriate?",
    o: ["Coach the client in slow, controlled breathing to reduce the respiratory rate and correct the respiratory alkalosis", "Administer sodium bicarbonate to correct the alkalosis", "Intubate the client to control the respiratory rate", "Administer 100% oxygen via non-rebreather mask"],
    a: 0,
    r: "The ABG shows respiratory alkalosis (pH 7.52, PaCO2 24) from hyperventilation during an anxiety attack. The treatment is to address the cause by coaching slow, controlled breathing to reduce CO2 exhalation. Sodium bicarbonate would worsen alkalosis. Intubation is excessive for anxiety. The PaO2 of 110 and SpO2 of 100% indicate no need for additional oxygen.",
    s: "Respiratory"
  },
  {
    q: "A 68-year-old client with chronic kidney disease has ABG results: pH 7.30, PaCO2 32 mmHg, HCO3 16 mEq/L, PaO2 88 mmHg. BP 134/82, HR 90, RR 24, SpO2 95% on room air. Which interpretation is correct?",
    o: ["Partially compensated metabolic acidosis from the kidneys' inability to excrete acids and regenerate bicarbonate", "Uncompensated respiratory acidosis", "Fully compensated respiratory alkalosis", "Mixed respiratory and metabolic alkalosis"],
    a: 0,
    r: "pH 7.30 (acidotic), PaCO2 32 (low, indicating respiratory compensation through hyperventilation), HCO3 16 (low, metabolic cause from renal failure's inability to excrete acids and regenerate bicarbonate). Since pH is still acidotic despite respiratory compensation, this is partially compensated metabolic acidosis, a classic finding in chronic kidney disease.",
    s: "Respiratory"
  },
  {
    q: "A 50-year-old client with persistent vomiting for 3 days has ABG results: pH 7.50, PaCO2 46 mmHg, HCO3 34 mEq/L, PaO2 85 mmHg. BP 102/60, HR 100, RR 14, SpO2 96% on room air. Which interpretation is correct?",
    o: ["Partially compensated metabolic alkalosis from loss of gastric acid through persistent vomiting", "Uncompensated respiratory acidosis", "Fully compensated respiratory alkalosis", "Normal ABG findings during a gastrointestinal illness"],
    a: 0,
    r: "pH 7.50 (alkalotic), PaCO2 46 (slightly elevated, indicating respiratory compensation by hypoventilating to retain CO2), HCO3 34 (elevated, metabolic cause from loss of hydrochloric acid through vomiting). Since pH is still alkalotic, this is partially compensated metabolic alkalosis. The body compensates by slowing respirations (RR 14) to retain CO2.",
    s: "Respiratory"
  },
  {
    q: "A nurse is reviewing ABG results for a 75-year-old client with acute asthma exacerbation. ABG: pH 7.34, PaCO2 48 mmHg, HCO3 25 mEq/L, PaO2 58 mmHg. BP 128/82, HR 110, RR 28, SpO2 87% on room air. The nurse recalls the client's previous ABG 2 hours ago showed PaCO2 of 32 mmHg. Which trend is most alarming?",
    o: ["The rising PaCO2 from 32 to 48 mmHg indicates the client is tiring and may be progressing toward respiratory failure despite the elevated respiratory rate", "The pH of 7.34, which is within normal limits and not concerning", "The HCO3 of 25, indicating metabolic compensation has begun", "The respiratory rate of 28, which shows the client is hyperventilating effectively"],
    a: 0,
    r: "In acute asthma, initial hyperventilation causes low PaCO2 (as seen in the earlier ABG of 32). A rising PaCO2 (now 48) despite tachypnea (RR 28) is an ominous sign indicating respiratory muscle fatigue and impending respiratory failure. The client can no longer compensate by hyperventilating. This requires immediate escalation of care and possible intubation preparation.",
    s: "Respiratory"
  },
  // ===== SATA QUESTIONS (Questions 262-301) =====
  {
    q: "A nurse is caring for a 65-year-old client with COPD exacerbation. Which interventions should the nurse implement? Select all that apply.",
    o: ["Administer low-flow oxygen as ordered to maintain SpO2 between 88% and 92%", "Position the client in high Fowler's or tripod position", "Administer bronchodilators via nebulizer as ordered", "Place the client in a supine flat position to equalize ventilation", "Monitor respiratory rate, depth, and oxygen saturation continuously", "Administer high-flow oxygen at 15 L/min to achieve SpO2 of 100%"],
    a: -1,
    ca: [0, 1, 2, 4],
    t: "sata",
    r: "COPD management includes low-flow oxygen (to prevent CO2 retention from suppressing the hypoxic drive), upright positioning (high Fowler's or tripod to maximize lung expansion), prescribed bronchodilators, and continuous respiratory monitoring. Supine positioning worsens dyspnea. High-flow oxygen at 15 L/min can suppress the ventilatory drive in COPD clients.",
    s: "Respiratory"
  },
  {
    q: "A 12-year-old child with cystic fibrosis is being discharged. Which instructions should the nurse include in the discharge teaching? Select all that apply.",
    o: ["Perform airway clearance techniques (CPT or flutter valve) at least twice daily", "Take pancreatic enzymes at the beginning of each meal and snack", "Follow a high-calorie, high-protein diet", "Restrict sodium intake to prevent fluid retention", "Report increased cough, change in sputum colour, or fever to the healthcare provider", "Avoid all physical activity to conserve energy"],
    a: -1,
    ca: [0, 1, 2, 4],
    t: "sata",
    r: "CF discharge teaching includes airway clearance techniques (at least twice daily and more during exacerbations), pancreatic enzymes with all food intake, high-calorie diet (120 to 150% of normal requirements), and reporting signs of infection. Extra sodium is often needed (not restricted) due to salt losses in sweat. Regular physical activity is encouraged as it improves lung function.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a client with a chest tube. Which nursing actions are appropriate for chest tube management? Select all that apply.",
    o: ["Keep the drainage system below the level of the client's chest at all times", "Monitor and document the amount, colour, and consistency of drainage", "Ensure all connections are taped securely to prevent disconnection", "Clamp the chest tube routinely during ambulation", "Assess for tidaling in the water-seal chamber as an indicator of tube patency", "Milk or strip the chest tube tubing every hour to prevent clots"],
    a: -1,
    ca: [0, 1, 2, 4],
    t: "sata",
    r: "Chest tube management includes keeping the system below chest level (gravity drainage), monitoring drainage, securing connections, and assessing tidaling (normal indicator of patency). Routine clamping is contraindicated as it can cause tension pneumothorax. Routine milking or stripping generates excessive negative pressure and is generally not recommended unless specifically ordered.",
    s: "Respiratory"
  },
  {
    q: "A nurse is assessing a client for signs of pulmonary embolism. Which findings are consistent with PE? Select all that apply.",
    o: ["Sudden onset of dyspnea", "Pleuritic chest pain that worsens with inspiration", "Tachycardia and hypotension", "Hemoptysis", "Bradycardia with hypertension", "Anxiety and sense of impending doom"],
    a: -1,
    ca: [0, 1, 2, 3, 5],
    t: "sata",
    r: "PE classically presents with sudden dyspnea, pleuritic chest pain, tachycardia (not bradycardia), hypotension (in massive PE), hemoptysis, and anxiety with a sense of impending doom. Bradycardia with hypertension (Cushing response) is associated with increased intracranial pressure, not PE.",
    s: "Respiratory"
  },
  {
    q: "A nurse is teaching a client with asthma about trigger avoidance. Which environmental modifications should the nurse recommend? Select all that apply.",
    o: ["Use allergen-proof covers on pillows and mattresses", "Remove carpeting from the bedroom if possible", "Keep indoor humidity below 50% to reduce dust mite and mould growth", "Use scented candles and air fresheners to improve air quality", "Avoid exposure to tobacco smoke and strong chemical fumes", "Keep windows open during high pollen days to ventilate the home"],
    a: -1,
    ca: [0, 1, 2, 4],
    t: "sata",
    r: "Asthma trigger avoidance includes allergen-proof bedding covers, removing carpet (traps allergens), maintaining low humidity (reduces dust mites and mould), and avoiding tobacco smoke and chemicals. Scented products (candles, air fresheners) can trigger bronchospasm. Opening windows during high pollen days increases allergen exposure.",
    s: "Respiratory"
  },
  {
    q: "A nurse is monitoring a client receiving mechanical ventilation for ARDS. Which complications should the nurse assess for? Select all that apply.",
    o: ["Ventilator-associated pneumonia (VAP)", "Barotrauma and pneumothorax", "Gastrointestinal stress ulcers", "Venous thromboembolism from immobility", "Improved respiratory muscle strength from the ventilator", "Oral mucous membrane breakdown from the endotracheal tube"],
    a: -1,
    ca: [0, 1, 2, 3, 5],
    t: "sata",
    r: "Mechanical ventilation complications include VAP (from bypassing normal airway defenses), barotrauma (from positive pressure), stress ulcers (from critical illness), VTE (from immobility), and oral breakdown (from ETT pressure). Mechanical ventilation actually causes respiratory muscle deconditioning (diaphragm atrophy), not strengthening.",
    s: "Respiratory"
  },
  {
    q: "A nurse is providing tracheostomy care. Which actions are appropriate? Select all that apply.",
    o: ["Clean the inner cannula using hydrogen peroxide followed by a sterile saline rinse", "Use pre-cut tracheostomy dressings rather than cutting gauze", "Secure the tracheostomy ties with enough slack to fit one finger underneath", "Change the tracheostomy ties while holding the faceplate securely to prevent dislodgement", "Apply petroleum-based ointment around the stoma to prevent skin breakdown", "Suction the tracheostomy before performing stoma care"],
    a: -1,
    ca: [0, 1, 2, 3, 5],
    t: "sata",
    r: "Proper tracheostomy care includes cleaning with hydrogen peroxide and saline rinse, using pre-cut dressings (not cut gauze which sheds fibres), appropriate tie tension (one finger space), securing the faceplate during tie changes (to prevent accidental decannulation), and suctioning before care (to clear secretions). Petroleum-based products should not be used near the stoma due to aspiration risk.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a client with tuberculosis. Which infection control measures should be implemented? Select all that apply.",
    o: ["Place the client in a private negative pressure isolation room", "Wear a fitted N95 respirator when entering the client's room", "Have the client wear a surgical mask when being transported outside the isolation room", "Use standard precautions only, as TB is not highly contagious", "Ensure at least 6 to 12 air exchanges per hour in the isolation room", "Teach the client to cover their mouth and nose when coughing or sneezing"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "TB airborne precautions include negative pressure room (prevents airborne particles from escaping), N95 respirator for staff (filters small droplet nuclei), surgical mask on client during transport, adequate air exchanges (dilutes airborne particles), and cough hygiene education. Standard precautions alone are insufficient for TB, which is transmitted via airborne droplet nuclei.",
    s: "Respiratory"
  },
  {
    q: "A nurse is assessing a client with a pneumothorax. Which findings are consistent with pneumothorax? Select all that apply.",
    o: ["Decreased or absent breath sounds on the affected side", "Sharp chest pain with sudden onset", "Hyperresonance to percussion on the affected side", "Increased tactile fremitus on the affected side", "Tracheal deviation away from the affected side in tension pneumothorax", "Dyspnea and tachypnea"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "Pneumothorax findings include decreased/absent breath sounds (air in pleural space prevents sound transmission), sudden chest pain, hyperresonance on percussion (air is less dense than tissue), tracheal deviation away from the affected side in tension pneumothorax, and dyspnea. Tactile fremitus is decreased (not increased) because air in the pleural space impedes vibration transmission.",
    s: "Respiratory"
  },
  {
    q: "A nurse is discharging a client with a new diagnosis of obstructive sleep apnea on CPAP therapy. Which teaching points should be included? Select all that apply.",
    o: ["Use the CPAP device every night for the entire duration of sleep", "Clean the mask, tubing, and humidifier chamber regularly as directed", "Report any skin irritation from the mask to the respiratory therapist for refitting", "Remove the CPAP after the first 2 hours of sleep, as that is when most apneic events occur", "Avoid sleeping supine if possible, as lateral positioning may reduce apnea severity", "Avoid alcohol and sedatives before bedtime, as they worsen airway obstruction"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "OSA with CPAP teaching includes nightly use for the full sleep period (not just 2 hours), regular equipment cleaning, reporting mask fit issues, lateral sleep positioning (reduces airway collapse), and avoiding CNS depressants (alcohol, sedatives) which relax pharyngeal muscles and worsen obstruction. CPAP should be used for the entire night, not removed after 2 hours.",
    s: "Respiratory"
  },
  {
    q: "A nurse is suctioning a client's endotracheal tube. Which practices should the nurse follow? Select all that apply.",
    o: ["Hyperoxygenate the client with 100% oxygen before and after suctioning", "Limit each suction pass to 10 to 15 seconds", "Apply suction only during catheter withdrawal, not during insertion", "Use the largest suction catheter available for maximum secretion removal", "Use sterile technique throughout the procedure", "Monitor heart rate and oxygen saturation during suctioning"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "Proper endotracheal suctioning technique includes pre-oxygenation (prevents hypoxemia), limiting passes to 10 to 15 seconds (prevents prolonged hypoxemia), applying suction only during withdrawal (prevents mucosal damage), using sterile technique (prevents infection), and monitoring vitals (detects complications). The catheter should be no larger than half the ETT diameter, not the largest available.",
    s: "Respiratory"
  },
  {
    q: "A nurse is providing care to a client with pleural effusion post-thoracentesis. Which assessments should the nurse prioritize? Select all that apply.",
    o: ["Monitor respiratory status including breath sounds, respiratory rate, and SpO2", "Assess the puncture site for bleeding, crepitus, or air leak", "Obtain a post-procedure chest X-ray as ordered to check for pneumothorax", "Discontinue oxygen therapy immediately after the procedure", "Monitor vital signs for signs of hemodynamic instability", "Assess for symptoms of re-expansion pulmonary edema (cough, frothy sputum, dyspnea)"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "Post-thoracentesis monitoring includes respiratory assessment (for improvement or deterioration), puncture site evaluation (for complications), post-procedure chest X-ray (to detect pneumothorax), vital sign monitoring (for hemodynamic changes), and watching for re-expansion pulmonary edema. Oxygen should be continued as needed based on SpO2, not discontinued automatically.",
    s: "Respiratory"
  },
  {
    q: "A nurse is educating a client about peak flow monitoring for asthma management. Which instructions should be included? Select all that apply.",
    o: ["Perform the test standing or sitting upright for maximum effort", "Record the best of three attempts each time", "Monitor peak flow at the same time each day for consistency", "Exhale slowly and steadily into the device for as long as possible", "Know your personal best value and the green, yellow, and red zone ranges", "Bring your peak flow diary to all healthcare provider appointments"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "Peak flow monitoring requires upright positioning, recording the best of three attempts, consistent daily timing, knowing personal best and zone ranges, and bringing the diary to appointments. The exhalation should be as hard and fast as possible in a single breath, not slow and steady. Slow exhalation measures a different parameter and gives inaccurate PEFR readings.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a client receiving oxygen therapy. Which safety measures should the nurse implement? Select all that apply.",
    o: ["Post 'oxygen in use' signs at the client's doorway and bedside", "Keep oxygen sources at least 3 metres from open flames or heat sources", "Use water-soluble lubricant for nasal and lip care, not petroleum-based products", "Allow the client to smoke in the bathroom with the door closed if they insist", "Check oxygen flow rate and delivery device at each assessment", "Ensure electrical equipment in the room is functioning properly and grounded"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "Oxygen safety includes posting warning signs, maintaining distance from flames, using water-soluble products (petroleum is flammable), regular flow rate checks, and ensuring proper electrical safety (sparks can ignite in oxygen-enriched environments). Smoking near oxygen is never permitted, even in the bathroom, as it creates an explosion and fire risk.",
    s: "Respiratory"
  },
  {
    q: "A nurse is assessing a client with suspected ARDS. Which criteria help identify ARDS? Select all that apply.",
    o: ["Acute onset of bilateral pulmonary infiltrates on chest X-ray", "PaO2/FiO2 ratio of 200 or less indicating severe hypoxemia", "Respiratory failure not fully explained by cardiac failure or fluid overload", "Gradual onset over several weeks with slow deterioration", "Need for positive pressure ventilation", "A known risk factor such as sepsis, aspiration, or trauma"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "The Berlin Definition of ARDS requires acute onset (within 7 days, not weeks), bilateral opacities on imaging, respiratory failure not fully explained by cardiac causes, PaO2/FiO2 ratio of 300 or less (200 or less is severe), need for positive pressure ventilation, and a known risk factor. Gradual onset over weeks is not consistent with ARDS; it is an acute condition.",
    s: "Respiratory"
  },
  // ===== ORDERED RESPONSE QUESTIONS (Questions 276-300) =====
  {
    q: "A client with suspected pneumothorax arrives in the emergency department with severe dyspnea and absent breath sounds on the left side. Place the nursing actions in the correct order of priority.",
    o: ["Assess airway, breathing, and circulation", "Apply supplemental oxygen and monitor SpO2", "Notify the healthcare provider and report assessment findings", "Assist with emergency needle decompression or chest tube insertion as ordered", "Obtain a chest X-ray as ordered", "Continuously monitor vital signs and respiratory status post-procedure"],
    a: -1,
    co: [0, 1, 2, 4, 3, 5],
    t: "ordered",
    r: "Management follows ABCs first (assess), oxygenation (treat hypoxemia), provider notification (communicate), imaging (confirm diagnosis with chest X-ray if time allows), definitive treatment (needle decompression or chest tube), and ongoing monitoring. In tension pneumothorax, needle decompression may precede imaging, but the sequence addresses the most critical needs first.",
    s: "Respiratory"
  },
  {
    q: "A nurse discovers a client's tracheostomy tube has been accidentally dislodged. The tracheostomy is more than 7 days old with a mature tract. Place the actions in the correct order.",
    o: ["Call for help and stay with the client", "Attempt to reinsert the tracheostomy tube using the obturator", "If unable to reinsert, insert a smaller replacement tube", "Verify tube placement by assessing breath sounds and SpO2", "Secure the tube with tracheostomy ties", "Notify the healthcare provider about the incident"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "For accidental decannulation with a mature tract (over 7 days): call for help first, attempt reinsertion with obturator (mature tract is less likely to close), try a smaller tube if the original cannot be reinserted, verify placement (breath sounds, SpO2), secure the tube, and notify the provider. A mature tract allows bedside reinsertion attempts.",
    s: "Respiratory"
  },
  {
    q: "A client with asthma presents with an acute exacerbation. Place the nursing interventions in the correct order.",
    o: ["Assess the severity of the exacerbation (respiratory rate, SpO2, ability to speak, use of accessory muscles)", "Apply supplemental oxygen to maintain SpO2 above 92%", "Administer inhaled short-acting bronchodilator (salbutamol) via nebulizer as ordered", "Administer systemic corticosteroid (prednisone) as ordered", "Reassess respiratory status after bronchodilator treatment", "Document findings and response to treatment"],
    a: -1,
    co: [0, 1, 2, 4, 3, 5],
    t: "ordered",
    r: "Asthma exacerbation management: assess severity first (determines treatment intensity), apply oxygen (address hypoxemia), administer rescue bronchodilator (primary acute treatment), reassess response (determines if additional treatments needed), administer corticosteroid (reduces inflammation, takes hours to work), and document. Assessment before and after treatment guides clinical decisions.",
    s: "Respiratory"
  },
  {
    q: "A nurse is preparing to suction a client's endotracheal tube. Place the steps in the correct order.",
    o: ["Explain the procedure to the client and gather equipment", "Perform hand hygiene and apply sterile gloves", "Hyperoxygenate the client with 100% oxygen for 30 to 60 seconds", "Insert the suction catheter without applying suction to the appropriate depth", "Apply intermittent suction while withdrawing the catheter with a rotating motion (10 to 15 seconds)", "Hyperoxygenate the client again and assess respiratory status"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "Suctioning procedure: explain the procedure (reduces anxiety, promotes cooperation), hand hygiene and sterile gloving (infection prevention), pre-oxygenation (prevents hypoxemia during suctioning), catheter insertion without suction (prevents mucosal trauma), suction during withdrawal with rotation (maximizes secretion removal while minimizing trauma), and post-oxygenation with reassessment.",
    s: "Respiratory"
  },
  {
    q: "A client is being treated for active pulmonary tuberculosis. Place the steps in the TB treatment process in correct chronological order.",
    o: ["Initiate airborne precautions and place the client in a negative pressure room", "Collect three sputum specimens for AFB smear and culture", "Begin the four-drug regimen (isoniazid, rifampin, pyrazinamide, ethambutol) as ordered", "Monitor for medication side effects and adherence through DOT", "Obtain three consecutive negative AFB sputum smears to consider discontinuing airborne precautions", "Continue treatment for the full 6 to 9 months with transition to the continuation phase"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "TB management follows a systematic process: isolation first (protect others), specimen collection (identify organism before treatment), start multi-drug therapy (prevent resistance), ongoing monitoring (ensure adherence and detect side effects), document non-infectiousness (three negative smears to remove precautions), and complete full treatment course (prevent relapse and resistance).",
    s: "Respiratory"
  },
  {
    q: "A nurse is preparing a client for a thoracentesis procedure. Place the steps in the correct order.",
    o: ["Verify informed consent has been obtained", "Review the client's coagulation studies and platelet count", "Position the client sitting on the edge of the bed, leaning forward over a bedside table", "Assist the provider with cleansing the site and administering local anaesthetic", "Monitor the client's respiratory status and vital signs throughout the procedure", "Apply an occlusive dressing to the puncture site after the procedure and obtain a post-procedure chest X-ray as ordered"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "Thoracentesis preparation follows: consent verification (legal requirement), coagulation review (bleeding risk assessment), proper positioning (sitting forward opens intercostal spaces and moves fluid to the base), site preparation (sterile technique and anaesthesia), continuous monitoring during the procedure (detect complications early), and post-procedure care with imaging to rule out pneumothorax.",
    s: "Respiratory"
  },
  {
    q: "A client with ARDS is deteriorating on the ventilator. Place the nursing actions in the correct order of priority.",
    o: ["Assess the client's airway, endotracheal tube position, and ventilator connections", "Manually ventilate with 100% oxygen using a bag-valve device if the ventilator is malfunctioning", "Notify the healthcare provider and respiratory therapist of the change in condition", "Obtain an arterial blood gas sample as ordered", "Implement ordered changes to ventilator settings (FiO2, PEEP, tidal volume)", "Prepare for additional interventions such as prone positioning or paralytic agents as ordered"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "When a ventilated client deteriorates: assess the airway and equipment first (identify correctable mechanical issues using the DOPE mnemonic), manually ventilate if needed (ensure oxygenation while troubleshooting), notify the team (communicate the emergency), obtain ABG (objective data for decision-making), adjust ventilator (optimize support), and prepare for advanced interventions.",
    s: "Respiratory"
  },
  {
    q: "A nurse is performing chest physiotherapy on a client with bronchiectasis. Place the steps in the correct order.",
    o: ["Administer the prescribed bronchodilator 15 to 20 minutes before starting CPT", "Position the client in the appropriate postural drainage position for the targeted lung segment", "Perform percussion and vibration on the chest wall over the targeted area", "Encourage the client to cough and expectorate secretions after each position change", "Reposition the client to drain the next lung segment as indicated", "Assess and document the amount, colour, and consistency of expectorated sputum"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "CPT procedure: administer bronchodilator first (opens airways for more effective drainage), position for targeted segment (gravity-assisted drainage), perform percussion and vibration (loosen secretions from airway walls), encourage coughing (clear loosened secretions), reposition for the next segment (systematic approach to all affected areas), and assess and document output (evaluate effectiveness).",
    s: "Respiratory"
  },
  {
    q: "A client develops a large pleural effusion causing respiratory distress. Place the nursing actions in the correct order.",
    o: ["Assess respiratory status including SpO2, respiratory rate, and breath sounds", "Position the client in high Fowler's position to maximize ventilation", "Apply supplemental oxygen as ordered to maintain adequate SpO2", "Notify the healthcare provider of the client's respiratory distress", "Assist with thoracentesis preparation and procedure as ordered", "Monitor the client for complications post-thoracentesis including pneumothorax and re-expansion pulmonary edema"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "Pleural effusion with respiratory distress: assess first (determine severity), position upright (improve diaphragmatic excursion), apply oxygen (address hypoxemia), notify provider (communicate findings and obtain orders), assist with thoracentesis (definitive fluid removal), and monitor for complications (pneumothorax, re-expansion edema are known risks).",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a client who has just had a chest tube inserted. Place the initial assessment steps in the correct order.",
    o: ["Confirm the drainage system is set up correctly with the water-seal level at 2 cm", "Verify that all connections are secure and taped", "Assess for tidaling in the water-seal chamber", "Check for air leaks by observing the water-seal chamber for continuous bubbling", "Assess the chest tube insertion site dressing for drainage or air leak", "Document the initial drainage amount, colour, and consistency"],
    a: -1,
    co: [0, 1, 4, 2, 3, 5],
    t: "ordered",
    r: "Initial chest tube assessment: verify system setup (water-seal at correct level), check connections (prevent disconnection), assess insertion site (ensure proper dressing and no air leak at site), check tidaling (confirms tube patency), assess for air leaks in water-seal (continuous bubbling may indicate system or pleural leak), and document baseline drainage (establishes reference for monitoring).",
    s: "Respiratory"
  },
  {
    q: "A nurse is implementing oxygen therapy for a hypoxemic client. Place the steps in the correct order.",
    o: ["Assess the client's respiratory status, SpO2, and ABG results if available", "Select the appropriate oxygen delivery device based on the provider's order and the client's needs", "Apply the device, set the prescribed flow rate, and ensure proper fit", "Educate the client about oxygen safety precautions including fire risk", "Monitor SpO2 and respiratory status at regular intervals", "Document the device, flow rate, client response, and SpO2 readings"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "Oxygen therapy implementation: assess baseline status (determine severity and guide device selection), select the device (match the clinical need to the appropriate delivery system), apply and set the flow (initiate therapy), educate the client (safety is essential with supplemental oxygen), monitor response (evaluate effectiveness and adjust as needed), and document (legal record of care provided).",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a client with an acute asthma exacerbation who is not responding to initial bronchodilator therapy. Place the escalation steps in the correct order.",
    o: ["Reassess the client's respiratory status after the initial bronchodilator treatment", "Administer a second dose of nebulized salbutamol as ordered", "Add ipratropium bromide to the nebulizer treatment as ordered", "Administer systemic corticosteroids (IV methylprednisolone) as ordered", "Prepare for possible intubation and mechanical ventilation if the client continues to deteriorate", "Notify the healthcare provider and rapid response team of the client's worsening condition"],
    a: -1,
    co: [0, 1, 5, 2, 3, 4],
    t: "ordered",
    r: "Asthma escalation: reassess after initial treatment (determine response), repeat bronchodilator (standard next step), notify the provider early about poor response (communicate deterioration), add anticholinergic (additional bronchodilation pathway), administer systemic steroids (reduce inflammation), and prepare for intubation (anticipate worst-case scenario). Early provider notification is critical when initial treatment fails.",
    s: "Respiratory"
  },
  // ===== FILL-IN-BLANK QUESTIONS (Questions 288-299) =====
  {
    q: "A nurse is calculating the oxygen flow rate for a client. The provider orders FiO2 of 28% via nasal cannula. Each litre of nasal cannula flow increases FiO2 by approximately 4% above room air (21%). How many litres per minute should the nurse set?",
    o: [],
    a: -1,
    cv: "2",
    t: "fill-in-blank",
    r: "Room air FiO2 is 21%. Each litre per minute via nasal cannula adds approximately 4% FiO2. To achieve 28%: 28% minus 21% = 7%. 7% divided by 4% per litre = 1.75, rounded to 2 L/min. At 2 L/min, the approximate FiO2 is 29%, which is the closest achievable to the ordered 28%.",
    s: "Respiratory"
  },
  {
    q: "A client's ABG results show PaO2 of 60 mmHg. The client is on a Venturi mask with FiO2 of 40%. Calculate the PaO2/FiO2 ratio. Round to the nearest whole number.",
    o: [],
    a: -1,
    cv: "150",
    t: "fill-in-blank",
    r: "PaO2/FiO2 ratio = PaO2 divided by FiO2 (as a decimal). 60 divided by 0.40 = 150. A PaO2/FiO2 ratio below 200 indicates severe ARDS. Below 300 indicates mild to moderate ARDS. This client's ratio of 150 is consistent with moderate to severe ARDS and indicates significant impairment in gas exchange.",
    s: "Respiratory"
  },
  {
    q: "A nurse is calculating the peak flow percentage for a client with asthma. The client's personal best PEFR is 480 L/min and today's reading is 264 L/min. What percentage of personal best is today's reading? Round to the nearest whole number.",
    o: [],
    a: -1,
    cv: "55",
    t: "fill-in-blank",
    r: "Percentage of personal best = (current PEFR divided by personal best) multiplied by 100. (264 divided by 480) multiplied by 100 = 55%. This places the client in the yellow zone (50% to 79%), indicating caution. The client should follow their asthma action plan, which typically includes using the rescue inhaler and contacting their provider if symptoms do not improve.",
    s: "Respiratory"
  },
  {
    q: "A nurse is preparing normal saline for a nebulizer treatment. The order reads: salbutamol 2.5 mg in 3 mL normal saline via nebulizer. The salbutamol comes in a unit-dose vial containing 2.5 mg in 0.5 mL. How many millilitres of normal saline should the nurse add? Round to one decimal place.",
    o: [],
    a: -1,
    cv: "2.5",
    t: "fill-in-blank",
    r: "Total volume needed: 3 mL. Salbutamol volume: 0.5 mL. Normal saline to add: 3 mL minus 0.5 mL = 2.5 mL. The nurse adds 2.5 mL of normal saline to the 0.5 mL salbutamol unit-dose vial to achieve the total nebulizer volume of 3 mL as ordered.",
    s: "Respiratory"
  },
  {
    q: "A client's chest tube has drained the following amounts over 8 hours: 75 mL in the first 2 hours, 50 mL in the next 3 hours, and 25 mL in the last 3 hours. What is the total drainage output for the 8-hour shift in millilitres?",
    o: [],
    a: -1,
    cv: "150",
    t: "fill-in-blank",
    r: "Total drainage = 75 mL + 50 mL + 25 mL = 150 mL over 8 hours. The decreasing trend (75, 50, 25 mL per period) is a positive sign indicating the drainage is resolving. The nurse should document the total amount, colour, and consistency, and report any sudden increase in drainage volume.",
    s: "Respiratory"
  },
  {
    q: "A client weighing 75 kg is on lung-protective ventilation for ARDS. The prescribed tidal volume is 6 mL/kg of ideal body weight. Calculate the tidal volume in millilitres.",
    o: [],
    a: -1,
    cv: "450",
    t: "fill-in-blank",
    r: "Tidal volume = 6 mL/kg multiplied by ideal body weight (75 kg) = 450 mL. Lung-protective ventilation uses low tidal volumes (6 mL/kg IBW) to prevent ventilator-induced lung injury (VILI) by minimizing alveolar overdistension. Higher tidal volumes (10 to 12 mL/kg) are associated with worse outcomes in ARDS.",
    s: "Respiratory"
  },
  {
    q: "A nurse is calculating the A-a gradient for a client. The alveolar PO2 (PAO2) is estimated at 104 mmHg and the arterial PaO2 is 82 mmHg. What is the A-a gradient in mmHg?",
    o: [],
    a: -1,
    cv: "22",
    t: "fill-in-blank",
    r: "A-a gradient = PAO2 minus PaO2 = 104 minus 82 = 22 mmHg. The normal A-a gradient is approximately 5 to 15 mmHg in young adults and increases with age (estimated normal = age divided by 4 plus 4). An elevated A-a gradient (above 15 to 20 mmHg) suggests a pulmonary cause of hypoxemia such as V/Q mismatch, diffusion impairment, or shunt.",
    s: "Respiratory"
  },
  {
    q: "A nurse is converting a client's respiratory rate from breaths per 15 seconds to breaths per minute. The nurse counts 7 breaths in 15 seconds. What is the respiratory rate per minute?",
    o: [],
    a: -1,
    cv: "28",
    t: "fill-in-blank",
    r: "Respiratory rate per minute = breaths counted multiplied by the number of 15-second intervals in one minute. 7 breaths multiplied by 4 = 28 breaths per minute. A rate of 28 is tachypneic (normal adult range is 12 to 20) and warrants further assessment of the client's respiratory status, SpO2, and potential causes of the increased rate.",
    s: "Respiratory"
  },
  {
    q: "A client is receiving aminophylline via continuous IV infusion. The order reads: aminophylline 500 mg in 250 mL D5W, infuse at 0.5 mg/kg/hour. The client weighs 80 kg. What is the infusion rate in mL per hour? Round to the nearest whole number.",
    o: [],
    a: -1,
    cv: "20",
    t: "fill-in-blank",
    r: "Step 1: Dose per hour = 0.5 mg/kg/hr multiplied by 80 kg = 40 mg/hr. Step 2: Concentration = 500 mg divided by 250 mL = 2 mg/mL. Step 3: Infusion rate = 40 mg/hr divided by 2 mg/mL = 20 mL/hr. Aminophylline is a bronchodilator with a narrow therapeutic window requiring careful dose calculation and therapeutic drug monitoring.",
    s: "Respiratory"
  },
  {
    q: "A nurse is calculating the minute ventilation for a client on a ventilator. The tidal volume is set at 500 mL and the respiratory rate is 14 breaths per minute. What is the minute ventilation in litres per minute? Round to one decimal place.",
    o: [],
    a: -1,
    cv: "7.0",
    t: "fill-in-blank",
    r: "Minute ventilation = tidal volume multiplied by respiratory rate = 500 mL multiplied by 14 breaths/min = 7,000 mL/min = 7.0 L/min. Normal minute ventilation is approximately 5 to 8 L/min. This client's minute ventilation is within the normal range. Changes in minute ventilation directly affect CO2 elimination.",
    s: "Respiratory"
  },
  {
    q: "A client's peak flow reading is 360 L/min. The client's personal best is 600 L/min. What percentage of personal best is this reading? Round to the nearest whole number.",
    o: [],
    a: -1,
    cv: "60",
    t: "fill-in-blank",
    r: "Percentage = (360 divided by 600) multiplied by 100 = 60%. This falls in the yellow zone (50% to 79% of personal best). The client should follow their asthma action plan for the yellow zone, which typically includes using the rescue inhaler and monitoring closely. If the reading does not improve, the client should seek medical attention.",
    s: "Respiratory"
  },
  {
    q: "A client is receiving oxygen via a Venturi mask at 35% FiO2. The nurse needs to calculate the approximate PaO2 the client should achieve if gas exchange were normal. Using the rough estimate that PaO2 should be approximately 5 times the FiO2 percentage, what is the expected PaO2 in mmHg?",
    o: [],
    a: -1,
    cv: "175",
    t: "fill-in-blank",
    r: "Expected PaO2 = FiO2 percentage multiplied by 5 = 35 multiplied by 5 = 175 mmHg. This is a rough clinical estimate. If the actual PaO2 is significantly lower than 175 mmHg, it suggests impaired gas exchange (V/Q mismatch, shunt, or diffusion impairment). This quick calculation helps clinicians assess whether the oxygenation response is appropriate for the FiO2 being delivered.",
    s: "Respiratory"
  },
  // ===== HOT-SPOT QUESTIONS (Questions 300-310 but we have exactly 10) =====
  {
    q: "A nurse is assessing a client with a suspected right-sided pneumothorax. Identify the location where the nurse would expect to find absent breath sounds during auscultation.",
    o: ["Right anterior and lateral chest fields", "Left anterior and lateral chest fields", "Bilateral posterior bases only", "Over the trachea at the sternal notch"],
    a: 0,
    t: "hot-spot",
    hc: "The nurse is performing a respiratory assessment on a client with sudden right-sided chest pain and dyspnea. The stethoscope is being placed systematically across the chest to compare breath sounds bilaterally.",
    ht: "In a right-sided pneumothorax, air accumulates in the right pleural space, preventing the right lung from fully expanding. Breath sounds would be absent or significantly diminished over the right anterior and lateral chest fields, while the left side should have normal breath sounds for comparison.",
    r: "A right-sided pneumothorax causes air to fill the right pleural space, collapsing the lung and eliminating normal breath sounds on the right side. The nurse should compare both sides systematically, expecting absent or markedly diminished sounds on the right with normal sounds on the left. Tracheal breath sounds would remain audible as they originate from the trachea.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a client with a tracheostomy. Identify the correct location to assess the tracheostomy cuff pressure.",
    o: ["The pilot balloon attached to the external inflation line of the tracheostomy tube", "The main body of the tracheostomy tube at the stoma site", "The inner cannula of the tracheostomy tube", "The tracheostomy tie attachment point on the faceplate"],
    a: 0,
    t: "hot-spot",
    hc: "The nurse is preparing to check the cuff pressure on a cuffed tracheostomy tube. The client is receiving mechanical ventilation and the nurse needs to ensure the cuff pressure is within the safe range of 20 to 25 cmH2O.",
    ht: "The pilot balloon is a small, inflatable balloon connected to the tracheostomy cuff via an inflation line. It sits external to the client and is connected to the same air channel as the intratracheal cuff. The nurse attaches a cuff pressure manometer to the pilot balloon valve to measure and adjust the cuff pressure.",
    r: "The pilot balloon is the external indicator and access point for the tracheostomy cuff. Attaching a cuff pressure manometer to the pilot balloon valve allows the nurse to measure intracuff pressure. Safe cuff pressure is 20 to 25 cmH2O. The pilot balloon should feel firm but compressible. An empty pilot balloon suggests the cuff is deflated.",
    s: "Respiratory"
  },
  {
    q: "A client with asthma is being taught to use a peak flow meter. Identify the correct position for the indicator on the peak flow meter before each use.",
    o: ["At the bottom of the numbered scale (zero or baseline position)", "At the midpoint of the numbered scale", "At the top of the numbered scale (maximum reading)", "At the client's previous best reading"],
    a: 0,
    t: "hot-spot",
    hc: "The nurse is demonstrating proper peak flow meter technique to a client. Before each attempt, the client needs to ensure the device is properly reset for an accurate reading.",
    ht: "The indicator (sliding marker) on the peak flow meter must be reset to the bottom (zero/baseline) of the numbered scale before each use. During the forceful exhalation, the client's breath pushes the indicator up the scale. The number where the indicator stops represents the peak expiratory flow rate in litres per minute.",
    r: "Before each peak flow attempt, the indicator must be at the baseline (zero) position. If not reset, the indicator will show the previous reading rather than the current one, resulting in an inaccurate measurement. The client should check and reset the indicator before each of the three attempts, recording the best of the three.",
    s: "Respiratory"
  },
  {
    q: "A nurse is performing a respiratory assessment on a client with suspected pleural effusion. Identify the area where the nurse would expect dullness to percussion.",
    o: ["Over the lower lung fields on the affected side, where fluid collects due to gravity", "Over the apices of both lungs", "Over the trachea in the suprasternal notch", "Over the upper lung fields on the unaffected side"],
    a: 0,
    t: "hot-spot",
    hc: "The nurse is percussing the client's posterior chest systematically from the apices to the bases, comparing both sides at each level. The client has a left-sided pleural effusion visible on chest X-ray.",
    ht: "Pleural effusion fluid collects in the dependent (lower) portions of the pleural space due to gravity. Percussion over the lower lung fields on the affected (left) side would produce a dull sound rather than the normal resonant sound, because the fluid-filled space does not vibrate like air-filled lung tissue.",
    r: "Pleural fluid accumulates at the lung bases due to gravity. Percussion over this area produces dullness (a flat, muted sound) because fluid transmits sound differently than air-filled tissue. The nurse should percuss from top to bottom comparing both sides; the transition from resonant to dull indicates the upper fluid level. The opposite (unaffected) side should remain resonant.",
    s: "Respiratory"
  },
  {
    q: "A nurse is positioning a client for postural drainage of the right middle lobe. Identify the correct client position.",
    o: ["Left side-lying with the foot of the bed elevated approximately 15 degrees (Trendelenburg), rotated slightly onto the back", "Sitting upright at 90 degrees with arms resting on a pillow", "Prone with the head of bed elevated 30 degrees", "Right side-lying with the bed completely flat"],
    a: 0,
    t: "hot-spot",
    hc: "The nurse is positioning the client for chest physiotherapy targeting the right middle lobe. The client has been cleared for Trendelenburg positioning and has no contraindications to postural drainage.",
    ht: "The right middle lobe is an anterior and lateral segment that drains best when the client is positioned on the left side with slight backward rotation (about 1/4 turn toward supine) and the foot of the bed elevated. This allows gravity to drain secretions from the right middle lobe into the larger central airways for expectoration.",
    r: "Postural drainage positions use gravity to move secretions from specific lung segments toward the central airways. The right middle lobe is located anterolaterally, so the client is positioned on the opposite (left) side with slight backward rotation and Trendelenburg to allow gravity drainage. Each lung segment has a specific drainage position based on its anatomical location.",
    s: "Respiratory"
  },
  {
    q: "A nurse is assessing a client with suspected tension pneumothorax. Identify the anatomical landmark where the nurse would observe tracheal deviation.",
    o: ["The suprasternal notch (jugular notch) at the anterior base of the neck", "The xiphoid process at the inferior end of the sternum", "The angle of Louis at the manubriosternal junction", "The posterior cervical spine at the level of C7"],
    a: 0,
    t: "hot-spot",
    hc: "The nurse suspects tension pneumothorax in a client with absent breath sounds on the left side, hypotension, and jugular venous distension. The nurse needs to assess for tracheal deviation as part of the emergency assessment.",
    ht: "The trachea is best assessed at the suprasternal notch (jugular notch), the U-shaped depression at the top of the sternum between the two clavicles. The nurse gently palpates this area to determine if the trachea is midline or deviated. In tension pneumothorax, the trachea deviates away from the affected side due to mediastinal shift from pressure buildup.",
    r: "The suprasternal notch is the most accessible and reliable landmark for assessing tracheal position. In tension pneumothorax, pressure buildup on the affected side pushes the mediastinum (including the trachea) toward the opposite side. Tracheal deviation is a late and ominous finding indicating significant pressure accumulation requiring emergency intervention.",
    s: "Respiratory"
  },
  {
    q: "A nurse is assessing a client's oxygen saturation using a pulse oximeter. Identify the most reliable site for accurate SpO2 measurement.",
    o: ["The fingertip of the index or middle finger, placed with the sensor over the nail bed", "The earlobe, which is always more accurate than the fingertip", "The forehead, which provides the fastest reading in all clients", "The tip of the nose, which has the best perfusion for measurement"],
    a: 0,
    t: "hot-spot",
    hc: "The nurse is preparing to assess a client's oxygen saturation. The client has warm, well-perfused hands with good capillary refill. The nurse selects the appropriate site for the pulse oximeter probe.",
    ht: "The fingertip is the standard and most commonly used site for pulse oximetry when the client has adequate peripheral perfusion. The sensor must be placed so the light emitter and detector are aligned across the nail bed (not on the side of the finger). The nail bed provides a consistent, accessible vascular bed for accurate light absorption measurement.",
    r: "The fingertip of the index or middle finger provides reliable SpO2 readings when peripheral perfusion is adequate. The probe should be placed over the nail bed with the light source and detector properly aligned. Factors that reduce accuracy include nail polish (especially dark colours), poor perfusion, hypothermia, and excessive movement. The earlobe is an alternative when peripheral perfusion is poor.",
    s: "Respiratory"
  },
  {
    q: "A nurse is assessing a client with emphysema and observes characteristic changes in the chest shape. Identify the feature of the chest wall that is most indicative of chronic hyperinflation.",
    o: ["Increased anteroposterior (AP) diameter creating a barrel-shaped chest", "Pectus excavatum (funnel chest) with a sunken sternum", "Pectus carinatum (pigeon chest) with a protruding sternum", "Kyphoscoliosis causing lateral curvature of the thoracic spine"],
    a: 0,
    t: "hot-spot",
    hc: "The nurse is inspecting the chest wall of a 68-year-old client with long-standing emphysema. The client is sitting upright in a chair using pursed-lip breathing. The nurse observes the chest shape from the lateral view.",
    ht: "Barrel chest occurs when the AP diameter increases to equal or approach the lateral diameter, giving the chest a rounded, barrel-like appearance when viewed from the side. In emphysema, chronic air trapping and hyperinflation of the lungs gradually expand the rib cage, increasing the AP diameter. The normal AP-to-lateral ratio is approximately 1:2; in barrel chest, it approaches 1:1.",
    r: "Barrel chest is a hallmark physical finding of chronic emphysema. Chronic air trapping progressively hyperinflates the lungs, which pushes the ribs into a more horizontal position and increases the AP diameter. This is visible as a rounded chest on lateral inspection. Pectus excavatum and carinatum are congenital chest wall deformities. Kyphoscoliosis is a spinal condition.",
    s: "Respiratory"
  },
  {
    q: "A nurse is locating the correct position for chest tube insertion for a pneumothorax. Identify the typical anatomical landmark for chest tube placement.",
    o: ["The fourth or fifth intercostal space at the anterior or midaxillary line on the affected side (the safe triangle)", "The second intercostal space at the midclavicular line bilaterally", "The seventh intercostal space at the posterior axillary line", "The substernal area just below the xiphoid process"],
    a: 0,
    t: "hot-spot",
    hc: "The healthcare provider is preparing to insert a chest tube for a right-sided pneumothorax. The nurse is assisting by identifying the anatomical landmarks for tube placement and preparing the insertion site.",
    ht: "The 'safe triangle' for chest tube insertion is bordered by the anterior border of the latissimus dorsi, the lateral border of the pectoralis major, a line at the level of the nipple (approximately 5th intercostal space), and the apex. The 4th or 5th intercostal space at the midaxillary line is the standard insertion point for most chest tubes.",
    r: "The safe triangle (4th to 5th intercostal space at the anterior to midaxillary line) is the standard site for chest tube insertion because it avoids major blood vessels, nerves, and the diaphragm. The tube is inserted above the rib to avoid the intercostal neurovascular bundle that runs along the inferior border of each rib. The second intercostal space is used for needle decompression of tension pneumothorax, not standard chest tube placement.",
    s: "Respiratory"
  },
  {
    q: "A nurse is identifying the location for assessing tactile fremitus on a client with pneumonia. Identify the correct hand placement for this assessment technique.",
    o: ["The ulnar (medial) surface of the hand or the ball of the hand placed firmly on the chest wall bilaterally in symmetric positions", "The fingertips lightly touching the anterior chest at the clavicles", "The back of the hand placed on the abdomen below the costal margin", "The palm of the hand hovering 2 cm above the chest wall without contact"],
    a: 0,
    t: "hot-spot",
    hc: "The nurse is performing a tactile fremitus assessment on a client with right lower lobe pneumonia. The client is asked to say 'ninety-nine' while the nurse palpates the chest wall systematically.",
    ht: "Tactile fremitus is assessed by placing the ulnar surface (bony edge) of the hand or the ball of the hand flat against the chest wall while the client repeats 'ninety-nine' or a similar phrase. The vibrations from the voice transmit through the lung tissue to the chest wall. The nurse compares symmetric positions on both sides of the chest.",
    r: "The ulnar surface or ball of the hand is most sensitive to vibration and is the correct placement for tactile fremitus. In pneumonia, consolidation increases fremitus (solid tissue transmits vibrations better than air-filled tissue), so the nurse would feel increased vibration over the right lower lobe compared to the left. Decreased fremitus occurs with air (pneumothorax) or fluid (pleural effusion) between the lung and chest wall.",
    s: "Respiratory"
  }
];
