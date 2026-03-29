import { OSCESkillStation } from "./osce-skills-data";

export const osceSkillStations6: OSCESkillStation[] = [
  {
    id: "croup-assessment",
    title: "Croup Assessment",
    category: "Pediatric",
    difficulty: "Intermediate",
    icon: "Baby",
    description: "Assess a pediatric patient presenting with signs and symptoms of croup (laryngotracheobronchitis), determine severity using a validated scoring system, and initiate appropriate management.",
    scenarioIntro: "You are a nurse in the pediatric emergency department. A 2-year-old child is brought in by the parents at 11 PM with a barking cough, inspiratory stridor at rest, and mild sternal retractions. The parents report the child had a mild upper respiratory infection for 2 days. The child is alert but appears anxious.",
    equipment: [
      "Pulse oximeter (pediatric probe)",
      "Stethoscope (pediatric)",
      "Thermometer",
      "Westley Croup Score reference card",
      "Nebulizer with mask",
      "Racemic epinephrine",
      "Oral dexamethasone",
      "Humidified oxygen setup",
      "Age-appropriate distraction tools",
      "Documentation tools"
    ],
    steps: [
      { id: "crp-1", instruction: "Perform hand hygiene and approach the child calmly without separating from the parent.", rationale: "Agitation worsens airway obstruction in croup. Keeping the child with the parent reduces distress and prevents worsening of symptoms.", criticalStep: true },
      { id: "crp-2", instruction: "Identify the patient using two identifiers appropriate for a pediatric patient (name band and parent confirmation).", rationale: "Patient safety standard adapted for pediatric patients who cannot self-identify.", criticalStep: true },
      { id: "crp-3", instruction: "Assess the child from a distance first: observe respiratory effort, stridor, color, and level of consciousness without disturbing the child.", rationale: "Initial observation without physical contact prevents agitation. Stridor at rest indicates moderate-to-severe croup.", criticalStep: true },
      { id: "crp-4", instruction: "Apply pulse oximeter gently and obtain oxygen saturation.", rationale: "Hypoxia (SpO2 < 92%) indicates severe croup requiring immediate intervention. Most croup patients maintain normal saturations.", criticalStep: true },
      { id: "crp-5", instruction: "Assess and document the Westley Croup Score: stridor (0-2), retractions (0-3), air entry (0-2), cyanosis (0-5), level of consciousness (0-5).", rationale: "The Westley score objectively grades croup severity: mild (0-2), moderate (3-5), severe (6-11), impending respiratory failure (≥12). This guides treatment decisions.", criticalStep: true },
      { id: "crp-6", instruction: "Obtain temperature and assess for fever.", rationale: "Croup is typically associated with low-grade fever. High fever may suggest bacterial tracheitis or epiglottitis, requiring different management.", criticalStep: false },
      { id: "crp-7", instruction: "Assess hydration status: mucous membranes, skin turgor, capillary refill, urine output history from parents.", rationale: "Children with croup may have decreased oral intake due to sore throat and respiratory distress, increasing dehydration risk.", criticalStep: false },
      { id: "crp-8", instruction: "Administer oral dexamethasone as ordered (single dose 0.6 mg/kg).", rationale: "Corticosteroids reduce laryngeal edema and are the mainstay of croup treatment. A single dose is effective for all severity levels.", criticalStep: true },
      { id: "crp-9", instruction: "For moderate-to-severe croup, administer nebulized racemic epinephrine as ordered while keeping the child on the parent's lap.", rationale: "Racemic epinephrine provides rapid, temporary relief of airway edema. The child must be observed for at least 2-4 hours after administration for rebound symptoms.", criticalStep: true },
      { id: "crp-10", instruction: "Position the child upright, preferably sitting on the parent's lap, in a position of comfort.", rationale: "Upright positioning optimizes airway patency and reduces work of breathing. Forcing a supine position can worsen obstruction.", criticalStep: false },
      { id: "crp-11", instruction: "Reassess Westley Croup Score 30 minutes after treatment and compare with initial score.", rationale: "Repeat scoring determines treatment response. Failure to improve or worsening score requires escalation of care.", criticalStep: true },
      { id: "crp-12", instruction: "Educate parents on home management: cool night air, upright positioning, signs requiring return to ED (worsening stridor, drooling, inability to swallow).", rationale: "Parent education is essential as croup symptoms often worsen at night. Parents must recognize signs of severe airway compromise.", criticalStep: false },
      { id: "crp-13", instruction: "Document all findings, Westley scores, interventions, and the child's response to treatment.", rationale: "Accurate documentation ensures continuity of care and tracks disease progression or resolution.", criticalStep: false }
    ],
    commonErrors: [
      "Agitating the child by attempting invasive assessments before observing from a distance",
      "Separating the child from the parent unnecessarily",
      "Failing to use a validated scoring system to grade severity",
      "Not observing for rebound symptoms after racemic epinephrine (minimum 2-4 hours)",
      "Confusing croup with epiglottitis (croup has gradual onset, barking cough; epiglottitis has rapid onset, drooling, no cough)",
      "Attempting to visualize the throat with a tongue depressor (contraindicated if epiglottitis suspected)",
      "Not reassessing after treatment"
    ],
    passingCriteria: "All critical steps must be performed. Student must avoid agitating the child, assess severity using Westley Croup Score, administer corticosteroids, and reassess after treatment.",
    clinicalPearls: [
      "Croup is most common in children aged 6 months to 3 years, with peak incidence at 1-2 years.",
      "The classic 'seal bark' cough and inspiratory stridor are hallmark features of croup.",
      "Never attempt to examine the throat if epiglottitis is suspected — this can cause complete airway obstruction.",
      "Croup symptoms characteristically worsen at night.",
      "Racemic epinephrine effects last only 1-2 hours; always observe for rebound worsening.",
      "A single dose of dexamethasone is effective for 48-72 hours, covering the typical course of illness."
    ],
    examLevel: "RPN/RN",
    timeLimit: "15 minutes",
    candidateInstructions: "You are a nurse in the pediatric ED. A 2-year-old presents with barking cough and stridor. Assess the child, determine severity, and initiate treatment. Minimize distress to the child.",
    patientActorScript: "Parent holds a toddler mannequin. Parent is anxious, reporting the child woke with a 'horrible barking cough' and noisy breathing. If the candidate tries to separate the child, the parent should say the child screams when put down. Provide history: mild cold for 2 days, low-grade fever, no drooling, able to swallow.",
    examinerChecklist: [
      { action: "Approaches calmly without separating child from parent", marks: 2 },
      { action: "Performs initial assessment from a distance", marks: 2 },
      { action: "Applies pulse oximeter appropriately", marks: 1 },
      { action: "Calculates Westley Croup Score correctly", marks: 3 },
      { action: "Administers dexamethasone as ordered", marks: 2 },
      { action: "Administers nebulized epinephrine for moderate-severe", marks: 2 },
      { action: "Reassesses after treatment", marks: 2 },
      { action: "Provides parent education on home management", marks: 1 },
      { action: "Documents findings and scores", marks: 1 }
    ],
    criticalFailCriteria: [
      "Agitating the child causing respiratory deterioration",
      "Attempting to examine the throat with a tongue depressor",
      "Failing to assess airway patency",
      "Not administering corticosteroids",
      "Discharging after racemic epinephrine without adequate observation period"
    ],
    examinerQuestions: [
      { question: "What differentiates croup from epiglottitis?", answer: "Croup has gradual onset, barking cough, no drooling, and low-grade fever. Epiglottitis has rapid onset, no cough, drooling, high fever, and the child sits in tripod position. Epiglottitis is a surgical emergency." },
      { question: "Why must patients be observed after racemic epinephrine?", answer: "Racemic epinephrine effects last only 1-2 hours, and rebound worsening of airway edema can occur after the medication wears off. Patients should be observed for at least 2-4 hours." },
      { question: "What Westley score indicates severe croup?", answer: "A Westley score of 6-11 indicates severe croup. A score of 12 or higher indicates impending respiratory failure." }
    ],
    teachingPoints: [
      "Croup is caused by parainfluenza virus in most cases.",
      "The 'steeple sign' on anteroposterior neck X-ray shows subglottic narrowing characteristic of croup.",
      "Cool mist therapy has not been shown to be effective in clinical trials but may provide comfort.",
      "Heliox (helium-oxygen mixture) may be used in severe cases to reduce turbulent airflow.",
      "Most children with croup can be safely discharged after a single dose of dexamethasone if symptoms are mild."
    ]
  },
  {
    id: "bronchiolitis",
    title: "Bronchiolitis Assessment",
    category: "Pediatric",
    difficulty: "Intermediate",
    icon: "Wind",
    description: "Assess an infant presenting with bronchiolitis, evaluate respiratory status and hydration, and implement supportive care measures.",
    scenarioIntro: "You are a nurse in the pediatric unit. A 6-month-old infant is admitted with nasal congestion, wheezing, tachypnea, and poor feeding for 2 days. RSV rapid antigen test is positive. The infant is irritable with mild subcostal retractions.",
    equipment: [
      "Pulse oximeter (infant probe)",
      "Stethoscope (infant/pediatric)",
      "Thermometer",
      "Bulb syringe for nasal suctioning",
      "Normal saline nasal drops",
      "Humidified oxygen with appropriate delivery device",
      "IV supplies (if needed for hydration)",
      "Feeding assessment tools",
      "Cardiorespiratory monitor",
      "Documentation tools"
    ],
    steps: [
      { id: "brl-1", instruction: "Perform hand hygiene and don appropriate PPE (contact and droplet precautions for RSV).", rationale: "RSV is highly contagious via respiratory droplets and fomites. Contact and droplet precautions prevent nosocomial spread.", criticalStep: true },
      { id: "brl-2", instruction: "Identify the infant using two identifiers (name band and parent confirmation).", rationale: "Patient safety standard for pediatric patients.", criticalStep: true },
      { id: "brl-3", instruction: "Assess respiratory status: rate, depth, effort, nasal flaring, grunting, retractions (subcostal, intercostal, suprasternal), and head bobbing.", rationale: "Infants show respiratory distress through specific signs: nasal flaring, grunting (auto-PEEP), retractions, and head bobbing. These indicate increasing work of breathing.", criticalStep: true },
      { id: "brl-4", instruction: "Apply continuous pulse oximetry and assess oxygen saturation.", rationale: "Persistent SpO2 < 90% indicates need for supplemental oxygen. Bronchiolitis guidelines recommend maintaining SpO2 ≥ 90%.", criticalStep: true },
      { id: "brl-5", instruction: "Auscultate lung sounds bilaterally, noting wheezes, crackles, and air entry.", rationale: "Widespread wheezing and crackles are typical. Diminished air entry may indicate severe disease or impending respiratory failure.", criticalStep: true },
      { id: "brl-6", instruction: "Assess for apnea episodes, especially in infants under 2 months or premature infants.", rationale: "Apnea is a significant complication of RSV bronchiolitis in young or premature infants and may be the presenting symptom.", criticalStep: true },
      { id: "brl-7", instruction: "Obtain temperature and assess for fever.", rationale: "Low-grade fever is common with bronchiolitis. High fever may suggest secondary bacterial infection.", criticalStep: false },
      { id: "brl-8", instruction: "Assess hydration status: anterior fontanelle, mucous membranes, skin turgor, urine output (wet diapers), and weight.", rationale: "Infants with bronchiolitis are at high risk for dehydration due to increased insensible losses from tachypnea and decreased oral intake.", criticalStep: true },
      { id: "brl-9", instruction: "Perform gentle nasal suctioning with normal saline drops and bulb syringe before feeds and as needed.", rationale: "Infants are obligate nasal breathers. Nasal congestion significantly impairs feeding and breathing. Suctioning before feeds improves intake.", criticalStep: true },
      { id: "brl-10", instruction: "Position the infant with the head of bed elevated to 30 degrees.", rationale: "Elevated positioning reduces nasal congestion and improves respiratory mechanics by reducing abdominal pressure on the diaphragm.", criticalStep: false },
      { id: "brl-11", instruction: "Assess feeding tolerance: ability to coordinate suck-swallow-breathe, volume intake, and frequency.", rationale: "Tachypnea above 60-70 breaths/minute impairs coordination of feeding and breathing. Oral feeds may need to be withheld and IV fluids started.", criticalStep: true },
      { id: "brl-12", instruction: "Administer humidified supplemental oxygen if SpO2 consistently < 90%, using appropriate delivery method (nasal cannula).", rationale: "Supplemental oxygen is the primary treatment for hypoxemia in bronchiolitis. Nasal cannula is preferred for infants.", criticalStep: false },
      { id: "brl-13", instruction: "Monitor and document respiratory status, oxygen saturations, feeding intake, and output every 1-2 hours.", rationale: "Bronchiolitis can worsen rapidly, particularly on days 2-3 of illness. Frequent monitoring enables early detection of deterioration.", criticalStep: true },
      { id: "brl-14", instruction: "Educate parents on the expected course of illness, signs of deterioration, and infection prevention measures.", rationale: "Parents should understand that bronchiolitis typically peaks at days 3-5 and that nasal suctioning and hydration are the main supportive treatments.", criticalStep: false }
    ],
    commonErrors: [
      "Failing to implement appropriate isolation precautions for RSV",
      "Not monitoring for apnea in high-risk infants (< 2 months, premature)",
      "Routine use of bronchodilators (not recommended for bronchiolitis)",
      "Not suctioning the nose before feeds",
      "Attempting oral feeds when respiratory rate is > 60-70/minute",
      "Failing to monitor hydration status closely",
      "Not recognizing signs of impending respiratory failure"
    ],
    passingCriteria: "All critical steps must be performed. Student must implement contact and droplet precautions, assess respiratory status comprehensively, evaluate hydration, perform nasal suctioning, and monitor for apnea in high-risk infants.",
    clinicalPearls: [
      "RSV bronchiolitis is the leading cause of hospitalization in infants under 12 months.",
      "Treatment is primarily supportive: oxygen, hydration, and nasal suctioning. Bronchodilators and corticosteroids are NOT recommended.",
      "Infants are obligate nasal breathers — always suction the nose before attempting feeds.",
      "Peak illness severity occurs on days 2-5; warn parents that the child may worsen before improving.",
      "Palivizumab (Synagis) is a monoclonal antibody given for RSV prophylaxis in high-risk infants.",
      "Apnea may be the presenting symptom of RSV in premature infants."
    ],
    examLevel: "RPN/RN",
    timeLimit: "15 minutes",
    candidateInstructions: "You are caring for a 6-month-old infant admitted with RSV bronchiolitis. Perform a comprehensive assessment, initiate supportive care, and educate the parents.",
    patientActorScript: "Parent holds an infant mannequin. Parent is worried because the baby is not feeding well and breathing fast. If asked about wet diapers, report only 2 wet diapers in the last 12 hours (decreased from normal). If asked about feeding, report the baby takes only half of the usual bottle volume and coughs during feeds.",
    examinerChecklist: [
      { action: "Implements contact and droplet precautions", marks: 2 },
      { action: "Assesses respiratory status comprehensively including signs of distress", marks: 3 },
      { action: "Applies pulse oximetry and monitors saturation", marks: 1 },
      { action: "Auscultates lung sounds bilaterally", marks: 2 },
      { action: "Assesses for apnea risk factors", marks: 2 },
      { action: "Evaluates hydration status", marks: 2 },
      { action: "Performs nasal suctioning with saline", marks: 2 },
      { action: "Assesses feeding tolerance", marks: 1 },
      { action: "Documents findings and initiates monitoring plan", marks: 1 }
    ],
    criticalFailCriteria: [
      "Failing to implement isolation precautions",
      "Not assessing for apnea in a high-risk infant",
      "Administering inappropriate medications (bronchodilators routinely)",
      "Not recognizing signs of respiratory failure",
      "Forcing oral feeds in a severely tachypneic infant"
    ],
    examinerQuestions: [
      { question: "Why are bronchodilators not routinely recommended for bronchiolitis?", answer: "Evidence shows bronchodilators do not improve outcomes in bronchiolitis. The wheezing is caused by inflammation and mucus plugging of small airways, not bronchospasm. Guidelines recommend against routine use." },
      { question: "At what respiratory rate should you consider withholding oral feeds?", answer: "When the respiratory rate exceeds 60-70 breaths per minute, the infant cannot safely coordinate suck-swallow-breathe, increasing aspiration risk. IV fluids or nasogastric feeds should be considered." },
      { question: "Why is RSV particularly dangerous in premature infants?", answer: "Premature infants have immature airways, reduced maternal antibody transfer, and immature respiratory centers making them prone to apnea, severe disease, and respiratory failure with RSV infection." }
    ],
    teachingPoints: [
      "RSV is transmitted via respiratory droplets and can survive on surfaces for hours.",
      "Hand hygiene is the single most effective prevention measure for RSV transmission.",
      "High-flow nasal cannula (HFNC) has become a widely used respiratory support for moderate bronchiolitis.",
      "Hypertonic saline (3%) nebulization may be beneficial in hospitalized infants.",
      "Tobacco smoke exposure is a significant risk factor for severe bronchiolitis."
    ]
  },
  {
    id: "pediatric-fever",
    title: "Pediatric Fever Management",
    category: "Pediatric",
    difficulty: "Beginner",
    icon: "Thermometer",
    description: "Assess and manage a febrile pediatric patient, including accurate temperature measurement, fever source identification, and implementation of appropriate antipyretic and supportive measures.",
    scenarioIntro: "You are a nurse in the pediatric unit. A 3-year-old child is admitted with a temperature of 39.5°C (103.1°F), irritability, and decreased oral intake for 24 hours. The child has no significant medical history. The parents are anxious and asking for help.",
    equipment: [
      "Digital thermometer (rectal, tympanic, or temporal artery)",
      "Stethoscope (pediatric)",
      "Pulse oximeter",
      "Age-appropriate weight scale",
      "Acetaminophen (weight-based dosing chart)",
      "Ibuprofen (weight-based dosing chart)",
      "Oral syringe for medication administration",
      "Lightweight clothing and blankets",
      "Fluids appropriate for age",
      "Documentation tools"
    ],
    steps: [
      { id: "pf-1", instruction: "Perform hand hygiene and gather equipment.", rationale: "Standard infection prevention and preparation.", criticalStep: true },
      { id: "pf-2", instruction: "Identify the patient using two identifiers.", rationale: "Patient safety standard.", criticalStep: true },
      { id: "pf-3", instruction: "Obtain an accurate weight in kilograms for medication dosing.", rationale: "Pediatric medications are dosed by weight. An accurate weight is essential to prevent under- or overdosing.", criticalStep: true },
      { id: "pf-4", instruction: "Measure temperature using the most accurate method for age (rectal for infants under 2, tympanic or temporal artery for older children).", rationale: "Rectal temperature is the gold standard for infants. Temporal artery and tympanic are acceptable for older children. Method must be documented.", criticalStep: true },
      { id: "pf-5", instruction: "Assess vital signs including heart rate, respiratory rate, and blood pressure.", rationale: "Fever increases heart rate and respiratory rate. Tachycardia disproportionate to fever or hypotension may indicate sepsis.", criticalStep: true },
      { id: "pf-6", instruction: "Perform a focused assessment: level of alertness, skin color, hydration status, and overall appearance.", rationale: "A toxic-appearing child (lethargic, poor perfusion, mottled skin) requires urgent evaluation regardless of temperature.", criticalStep: true },
      { id: "pf-7", instruction: "Assess for source of infection: ears, throat, lungs, skin, urinary symptoms, and meningeal signs.", rationale: "Identifying the fever source guides treatment. Neck stiffness or bulging fontanelle in an infant suggests meningitis.", criticalStep: false },
      { id: "pf-8", instruction: "Calculate and administer acetaminophen (15 mg/kg) or ibuprofen (10 mg/kg for children > 6 months) as ordered.", rationale: "Weight-based dosing ensures therapeutic effect. Ibuprofen is not recommended for infants under 6 months. Antipyretics treat discomfort, not the fever itself.", criticalStep: true },
      { id: "pf-9", instruction: "Verify medication dosage using two-person verification or dosing chart before administration.", rationale: "Pediatric medication errors are a leading patient safety concern. Double-checking weight-based doses prevents overdosing.", criticalStep: true },
      { id: "pf-10", instruction: "Remove excess clothing and blankets, dress the child in lightweight clothing.", rationale: "Excess clothing traps heat and can elevate temperature further. Lightweight clothing allows heat dissipation.", criticalStep: false },
      { id: "pf-11", instruction: "Encourage oral fluids appropriate for age (breast milk, formula, clear fluids, popsicles for older children).", rationale: "Fever increases insensible fluid losses. Maintaining hydration is a key supportive measure.", criticalStep: false },
      { id: "pf-12", instruction: "Reassess temperature 30-60 minutes after antipyretic administration.", rationale: "Acetaminophen typically reduces fever within 30-60 minutes. Reassessment confirms treatment effectiveness.", criticalStep: true },
      { id: "pf-13", instruction: "Educate parents on appropriate dosing intervals, signs requiring medical attention, and that fever is a normal immune response.", rationale: "Parent education addresses fever phobia. Parents should understand not to alternate antipyretics without guidance and to seek care for lethargy, rash, or poor fluid intake.", criticalStep: false },
      { id: "pf-14", instruction: "Document temperature, method used, interventions, and child's response.", rationale: "Documentation ensures continuity of care and tracks fever trends.", criticalStep: false }
    ],
    commonErrors: [
      "Dosing antipyretics based on age instead of weight",
      "Giving ibuprofen to infants under 6 months",
      "Using ice baths or alcohol rubs to reduce fever (harmful and contraindicated)",
      "Alternating acetaminophen and ibuprofen without clear orders (increases dosing error risk)",
      "Over-bundling a febrile child",
      "Not reassessing temperature after treatment",
      "Not obtaining an accurate weight before medication administration",
      "Failing to recognize signs of serious illness in a febrile child"
    ],
    passingCriteria: "All critical steps must be performed. Student must accurately measure temperature, obtain weight, correctly calculate medication dose, verify dose, and reassess after treatment.",
    clinicalPearls: [
      "Fever is defined as a temperature ≥ 38°C (100.4°F).",
      "Fever itself is not harmful — it is a normal immune response. The goal of antipyretics is to improve comfort, not normalize temperature.",
      "Never use aspirin in children under 18 (risk of Reye syndrome).",
      "A febrile infant under 28 days requires a full septic workup regardless of appearance.",
      "Febrile seizures occur in 2-5% of children aged 6 months to 5 years and are typically benign.",
      "Always document the temperature measurement method, as normal ranges differ by route."
    ],
    examLevel: "RPN/RN",
    timeLimit: "12 minutes",
    candidateInstructions: "You are caring for a febrile 3-year-old on the pediatric unit. Assess the child, manage the fever appropriately, and educate the parents.",
    patientActorScript: "Parent holds or sits beside a child mannequin. Parent is very worried, saying 'the fever won't go away.' If asked, reports the child has not been eating much and has had 3 wet diapers today (fewer than normal). Parent asks if they should give the child a cold bath.",
    examinerChecklist: [
      { action: "Obtains accurate weight for medication dosing", marks: 2 },
      { action: "Measures temperature using appropriate method and documents route", marks: 2 },
      { action: "Assesses vital signs and overall appearance", marks: 2 },
      { action: "Calculates correct weight-based antipyretic dose", marks: 3 },
      { action: "Verifies medication dose before administration", marks: 2 },
      { action: "Removes excess clothing", marks: 1 },
      { action: "Encourages oral fluids", marks: 1 },
      { action: "Reassesses temperature after intervention", marks: 2 },
      { action: "Provides accurate parent education", marks: 1 }
    ],
    criticalFailCriteria: [
      "Administering incorrect medication dose",
      "Not verifying weight-based dose",
      "Using ice baths, cold water immersion, or alcohol rubs",
      "Giving aspirin to a child",
      "Giving ibuprofen to an infant under 6 months",
      "Failing to assess for signs of serious illness"
    ],
    examinerQuestions: [
      { question: "Why is rectal temperature the gold standard for infants?", answer: "Rectal temperature most accurately reflects core body temperature. Other methods may under-read or over-read, which is clinically significant in infants where fever management decisions (such as septic workup) depend on accurate temperature." },
      { question: "Why should aspirin not be given to children?", answer: "Aspirin is associated with Reye syndrome in children, a rare but potentially fatal condition causing liver failure and encephalopathy, particularly when given during viral illnesses." },
      { question: "What makes a febrile child 'toxic-appearing'?", answer: "A toxic-appearing child shows lethargy, poor eye contact, weak cry, mottled or pale skin, poor perfusion (prolonged capillary refill), and may be inconsolable or paradoxically quiet. This requires urgent evaluation." }
    ],
    teachingPoints: [
      "Fever phobia is common among parents. Education should emphasize that fever helps fight infection.",
      "Normal temperature varies by route: oral 37°C, rectal 37.5°C, axillary 36.5°C.",
      "Febrile seizures, while frightening, are generally benign and do not cause brain damage.",
      "Dehydration is the most common complication of fever in children.",
      "High fever (>40°C) does not necessarily indicate serious bacterial infection."
    ]
  },
  {
    id: "dehydration-assessment",
    title: "Pediatric Dehydration Assessment",
    category: "Pediatric",
    difficulty: "Intermediate",
    icon: "Droplets",
    description: "Assess a pediatric patient for dehydration, classify severity, calculate fluid deficit, and implement an appropriate rehydration plan.",
    scenarioIntro: "You are a nurse in the pediatric emergency department. A 14-month-old child is brought in with vomiting and diarrhea for 2 days. The parents report the child has had only 2 wet diapers in the last 12 hours and is refusing to drink. The child weighs 10 kg and appears listless.",
    equipment: [
      "Weight scale (accurate to nearest 10g for infants)",
      "Stethoscope (pediatric)",
      "Pulse oximeter",
      "Blood pressure cuff (pediatric)",
      "Oral rehydration solution (ORS)",
      "Oral syringe (5 mL and 10 mL)",
      "IV supplies (catheter, fluids, tubing)",
      "Normal saline or Ringer's lactate for IV bolus",
      "CDS (Clinical Dehydration Scale) reference card",
      "Documentation tools"
    ],
    steps: [
      { id: "deh-1", instruction: "Perform hand hygiene and gather equipment.", rationale: "Standard infection prevention and preparation.", criticalStep: true },
      { id: "deh-2", instruction: "Identify the patient using two identifiers.", rationale: "Patient safety standard.", criticalStep: true },
      { id: "deh-3", instruction: "Obtain an accurate weight and compare with the most recent documented weight to estimate fluid loss percentage.", rationale: "Weight loss is the most reliable indicator of dehydration severity. Each 1% weight loss equals approximately 10 mL/kg fluid deficit.", criticalStep: true },
      { id: "deh-4", instruction: "Assess clinical signs of dehydration: mucous membranes, anterior fontanelle, skin turgor, tears when crying, capillary refill, and extremity temperature.", rationale: "Clinical signs are used to classify dehydration as mild (3-5%), moderate (6-9%), or severe (≥10%). Sunken fontanelle and absent tears indicate significant dehydration.", criticalStep: true },
      { id: "deh-5", instruction: "Assess level of consciousness and irritability.", rationale: "A lethargic or inconsolable child indicates severe dehydration. Irritability progressing to lethargy is ominous.", criticalStep: true },
      { id: "deh-6", instruction: "Obtain vital signs: heart rate, respiratory rate, blood pressure, and temperature.", rationale: "Tachycardia is an early sign of dehydration. Hypotension is a late and ominous sign indicating hypovolemic shock in children.", criticalStep: true },
      { id: "deh-7", instruction: "Assess urine output by asking about wet diapers and checking the diaper.", rationale: "Decreased urine output (< 1 mL/kg/hour in infants) is a key indicator of renal hypoperfusion from dehydration.", criticalStep: false },
      { id: "deh-8", instruction: "Classify dehydration severity using a validated tool (CDS or WHO classification).", rationale: "Classification guides treatment: mild dehydration = oral rehydration; moderate = oral or IV; severe = IV fluid resuscitation.", criticalStep: true },
      { id: "deh-9", instruction: "For mild-to-moderate dehydration, initiate oral rehydration therapy (ORT) with small frequent volumes (5 mL every 1-2 minutes).", rationale: "Small frequent volumes prevent vomiting. ORS replaces both water and electrolytes. ORT is the preferred first-line treatment.", criticalStep: true },
      { id: "deh-10", instruction: "For severe dehydration, establish IV access and administer a 20 mL/kg normal saline bolus over 15-20 minutes as ordered.", rationale: "IV fluid bolus rapidly restores intravascular volume. 20 mL/kg is the standard pediatric resuscitation bolus, repeatable up to 60 mL/kg.", criticalStep: true },
      { id: "deh-11", instruction: "Reassess after each fluid bolus: heart rate, capillary refill, level of consciousness, and blood pressure.", rationale: "Reassessment determines if additional boluses are needed. Persistent tachycardia or poor perfusion after 60 mL/kg requires escalation.", criticalStep: true },
      { id: "deh-12", instruction: "Calculate maintenance fluid requirements and ongoing losses for fluid replacement plan.", rationale: "Holliday-Segar formula: 100 mL/kg for first 10 kg, 50 mL/kg for next 10 kg, 20 mL/kg thereafter per 24 hours.", criticalStep: false },
      { id: "deh-13", instruction: "Monitor and record all intake and output meticulously, including weighing diapers.", rationale: "Accurate I&O is essential to evaluate rehydration progress. 1 gram wet diaper weight = 1 mL urine output.", criticalStep: true },
      { id: "deh-14", instruction: "Educate parents on oral rehydration at home, signs of dehydration, and when to return.", rationale: "Parents should be taught to offer small frequent volumes of ORS, continue age-appropriate diet, and return for persistent vomiting, bloody stools, or lethargy.", criticalStep: false }
    ],
    commonErrors: [
      "Relying solely on mucous membrane assessment without using multiple indicators",
      "Not obtaining an accurate weight or comparing to recent weight",
      "Offering large volumes of fluid that trigger vomiting",
      "Using fruit juice or soda instead of ORS for rehydration",
      "Delaying IV access in severely dehydrated children",
      "Not reassessing after fluid bolus",
      "Failing to recognize tachycardia as an early sign of dehydration",
      "Not monitoring strict intake and output"
    ],
    passingCriteria: "All critical steps must be performed. Student must weigh the patient, assess dehydration using multiple clinical signs, classify severity, initiate appropriate rehydration, and reassess after intervention.",
    clinicalPearls: [
      "Weight loss percentage is the gold standard for assessing dehydration severity in children.",
      "Tachycardia is an early compensatory sign; hypotension is a LATE sign in children — do not wait for low blood pressure.",
      "Children compensate well until they suddenly decompensate — a normal blood pressure does not rule out significant dehydration.",
      "ORS is preferred over IV fluids for mild-to-moderate dehydration (equally effective, less invasive).",
      "Gastroenteritis is the most common cause of pediatric dehydration worldwide.",
      "Sunken anterior fontanelle is a specific sign for dehydration in infants under 18 months."
    ],
    examLevel: "RPN/RN",
    timeLimit: "15 minutes",
    candidateInstructions: "You are a nurse in the pediatric ED. A 14-month-old presents with vomiting, diarrhea, and decreased urine output. Assess dehydration severity and initiate rehydration.",
    patientActorScript: "Parent holds an infant mannequin. Parent reports 2 days of vomiting (4-5 times/day) and watery diarrhea (6-8 stools/day). Only 2 wet diapers in the last 12 hours. The child is refusing the bottle. Previous weight 2 weeks ago was 10.5 kg. If asked, no fever, no blood in stool.",
    examinerChecklist: [
      { action: "Obtains accurate weight and compares to previous weight", marks: 2 },
      { action: "Assesses multiple clinical signs of dehydration", marks: 3 },
      { action: "Checks anterior fontanelle", marks: 1 },
      { action: "Assesses vital signs including heart rate", marks: 2 },
      { action: "Classifies dehydration severity correctly", marks: 2 },
      { action: "Initiates appropriate rehydration method", marks: 2 },
      { action: "Reassesses after intervention", marks: 2 },
      { action: "Monitors and documents I&O", marks: 1 },
      { action: "Provides parent education", marks: 1 }
    ],
    criticalFailCriteria: [
      "Failing to recognize signs of severe dehydration",
      "Not obtaining an accurate weight",
      "Delaying IV resuscitation in a severely dehydrated child",
      "Not reassessing after fluid administration",
      "Administering hypotonic fluids as a bolus"
    ],
    examinerQuestions: [
      { question: "What is the Holliday-Segar formula for maintenance fluids?", answer: "100 mL/kg/day for the first 10 kg, plus 50 mL/kg/day for the next 10 kg, plus 20 mL/kg/day for each additional kg. For a 10 kg child, maintenance is 1000 mL/day or approximately 40 mL/hour." },
      { question: "Why is hypotension a late sign in children?", answer: "Children have strong compensatory mechanisms (increased heart rate, peripheral vasoconstriction). They maintain blood pressure until 25-30% of blood volume is lost, then decompensate rapidly. Tachycardia occurs much earlier." },
      { question: "Why is ORS preferred over plain water for rehydration?", answer: "ORS contains glucose and electrolytes in a specific ratio that promotes optimal sodium and water absorption via the sodium-glucose cotransporter in the small intestine. Plain water does not replace electrolyte losses." }
    ],
    teachingPoints: [
      "The WHO ORS formula is specifically designed to match intestinal absorption mechanisms.",
      "Ondansetron (Zofran) may be given to reduce vomiting and facilitate oral rehydration.",
      "Continue breastfeeding during rehydration — breast milk provides both hydration and nutrition.",
      "BRAT diet is no longer recommended; resume age-appropriate diet as tolerated.",
      "Rotavirus vaccine has significantly reduced severe gastroenteritis-related dehydration in children."
    ]
  },
  {
    id: "pediatric-asthma",
    title: "Pediatric Asthma Management",
    category: "Pediatric",
    difficulty: "Intermediate",
    icon: "Wind",
    description: "Assess and manage a pediatric patient experiencing an acute asthma exacerbation, including severity classification, bronchodilator administration, and monitoring for treatment response.",
    scenarioIntro: "You are a nurse in the pediatric emergency department. A 7-year-old child with known asthma is brought in by the parents with wheezing, cough, and difficulty breathing that started 3 hours ago after playing outside. The child used their rescue inhaler at home without improvement. The child can speak in short phrases only.",
    equipment: [
      "Pulse oximeter",
      "Stethoscope (pediatric)",
      "Peak flow meter (age-appropriate)",
      "Nebulizer with mask or mouthpiece",
      "Salbutamol (albuterol) nebulization solution",
      "Ipratropium bromide",
      "Spacer with mask for MDI",
      "Oral prednisolone/prednisone",
      "Oxygen with appropriate delivery device",
      "Cardiorespiratory monitor",
      "Asthma severity scoring tool",
      "Documentation tools"
    ],
    steps: [
      { id: "pas-1", instruction: "Perform hand hygiene and approach the child in a calm, reassuring manner.", rationale: "Anxiety worsens bronchospasm. A calm approach helps reduce the child's distress and work of breathing.", criticalStep: true },
      { id: "pas-2", instruction: "Identify the patient using two identifiers.", rationale: "Patient safety standard.", criticalStep: true },
      { id: "pas-3", instruction: "Rapidly assess airway, breathing, and circulation (ABCs). Note ability to speak, respiratory rate, use of accessory muscles, and color.", rationale: "Initial ABC assessment determines urgency. A child who cannot speak full sentences, is using accessory muscles, or shows cyanosis has a severe exacerbation.", criticalStep: true },
      { id: "pas-4", instruction: "Apply pulse oximeter and assess oxygen saturation.", rationale: "SpO2 < 92% indicates severe exacerbation. Administer supplemental oxygen to maintain SpO2 ≥ 94%.", criticalStep: true },
      { id: "pas-5", instruction: "Classify exacerbation severity: mild (speaks sentences, SpO2 > 95%), moderate (speaks phrases, SpO2 92-95%), severe (speaks words only, SpO2 < 92%), or life-threatening (silent chest, cyanosis, altered consciousness).", rationale: "Severity classification guides treatment intensity. Life-threatening features require immediate escalation.", criticalStep: true },
      { id: "pas-6", instruction: "Auscultate lung sounds bilaterally before treatment.", rationale: "Baseline auscultation documents the degree of wheezing and air entry. A silent chest is ominous — it indicates severe bronchospasm with minimal air movement.", criticalStep: true },
      { id: "pas-7", instruction: "Administer nebulized salbutamol (albuterol) 2.5-5 mg as ordered, with oxygen-driven nebulization.", rationale: "Salbutamol is a short-acting beta-2 agonist that relaxes bronchial smooth muscle. Oxygen-driven nebulization provides concurrent bronchodilation and oxygenation.", criticalStep: true },
      { id: "pas-8", instruction: "For moderate-severe exacerbation, add nebulized ipratropium bromide to the first salbutamol treatments as ordered.", rationale: "Ipratropium provides additional bronchodilation via anticholinergic mechanism. Most effective when combined with salbutamol in the first hour.", criticalStep: false },
      { id: "pas-9", instruction: "Administer oral corticosteroids (prednisolone 1-2 mg/kg) as ordered.", rationale: "Systemic corticosteroids reduce airway inflammation, the underlying pathology. Early administration reduces hospitalization and relapse rates.", criticalStep: true },
      { id: "pas-10", instruction: "Position the child upright or in a position of comfort (tripod position if preferred by the child).", rationale: "Upright positioning optimizes diaphragmatic excursion and ventilation. Allowing the child to choose their position reduces anxiety.", criticalStep: false },
      { id: "pas-11", instruction: "Reassess respiratory status, oxygen saturation, and lung sounds 15-20 minutes after each nebulization.", rationale: "Reassessment determines treatment response. Continued or worsening symptoms may require repeated nebulizations (up to 3 in the first hour for severe cases).", criticalStep: true },
      { id: "pas-12", instruction: "Obtain peak expiratory flow (PEF) if the child is able to cooperate (typically age 6+).", rationale: "PEF provides objective measurement of airflow obstruction. Compare to personal best or predicted: < 50% predicted = severe, 50-75% = moderate.", criticalStep: false },
      { id: "pas-13", instruction: "Monitor continuously for signs of deterioration: worsening dyspnea, silent chest, fatigue, confusion, or inability to speak.", rationale: "These indicate progression to life-threatening asthma requiring ICU intervention (IV magnesium, aminophylline, or intubation).", criticalStep: true },
      { id: "pas-14", instruction: "Review and reinforce asthma action plan with child and parents, including trigger avoidance and proper inhaler technique.", rationale: "A written asthma action plan reduces ED visits and hospitalizations. Proper inhaler technique ensures medication delivery.", criticalStep: false },
      { id: "pas-15", instruction: "Document severity classification, all treatments given, timing, and response to each treatment.", rationale: "Detailed documentation tracks treatment response and guides disposition decisions.", criticalStep: false }
    ],
    commonErrors: [
      "Not classifying exacerbation severity before initiating treatment",
      "Failing to recognize a silent chest as a sign of severe/life-threatening asthma",
      "Delaying corticosteroid administration",
      "Not reassessing between nebulization treatments",
      "Poor nebulizer mask fit resulting in inadequate medication delivery",
      "Not monitoring for respiratory fatigue as a sign of impending failure",
      "Forgetting to check inhaler technique before discharge",
      "Using a sedative in an anxious asthmatic child (can depress respiratory drive)"
    ],
    passingCriteria: "All critical steps must be performed. Student must assess ABCs, classify severity, administer bronchodilators and corticosteroids, and reassess after each treatment.",
    clinicalPearls: [
      "A silent chest in an asthmatic child is a medical emergency — it means air is not moving.",
      "Corticosteroids take 4-6 hours to work. Give them early; they treat the inflammation, not the bronchospasm.",
      "Respiratory fatigue (decreasing respiratory effort in a child who was previously working hard) is a pre-arrest sign.",
      "Pulsus paradoxus > 10 mmHg during an asthma attack indicates severe bronchospasm.",
      "Every child with asthma should have a written asthma action plan.",
      "Spacer devices improve MDI medication delivery by 50% or more compared to MDI alone."
    ],
    examLevel: "RPN/RN",
    timeLimit: "15 minutes",
    candidateInstructions: "You are caring for a 7-year-old with known asthma presenting with an acute exacerbation unresponsive to home rescue inhaler. Assess severity, initiate treatment, and monitor response.",
    patientActorScript: "Child (mannequin or standardized patient) is sitting upright, visibly breathing fast, speaking in short phrases. If asked to take a deep breath, simulates difficulty. Parent reports the child's rescue inhaler was used 3 times at home without improvement. Known triggers include cold air and exercise. Has been on a daily inhaled corticosteroid but ran out 2 weeks ago.",
    examinerChecklist: [
      { action: "Performs rapid ABC assessment", marks: 2 },
      { action: "Applies pulse oximetry", marks: 1 },
      { action: "Classifies severity correctly", marks: 2 },
      { action: "Auscultates lungs bilaterally before treatment", marks: 2 },
      { action: "Administers nebulized salbutamol correctly", marks: 2 },
      { action: "Administers oral corticosteroids", marks: 2 },
      { action: "Reassesses after nebulization", marks: 2 },
      { action: "Monitors for deterioration signs", marks: 2 },
      { action: "Reviews asthma action plan with family", marks: 1 }
    ],
    criticalFailCriteria: [
      "Failing to assess ABCs",
      "Not recognizing a severe or life-threatening exacerbation",
      "Failing to administer bronchodilators",
      "Administering sedation to an anxious asthmatic child",
      "Not reassessing after treatment",
      "Ignoring a silent chest"
    ],
    examinerQuestions: [
      { question: "Why is a silent chest dangerous in asthma?", answer: "A silent chest means there is insufficient air movement to generate wheeze sounds. This indicates near-complete bronchospasm and impending respiratory failure. It requires immediate escalation including possible intubation." },
      { question: "Why are corticosteroids given in acute asthma if they take hours to work?", answer: "Asthma is fundamentally an inflammatory disease. Corticosteroids reduce airway inflammation and edema, prevent late-phase inflammatory response, and reduce relapse. Early administration shortens recovery even though bronchodilators provide immediate relief." },
      { question: "What is the role of the spacer device?", answer: "A spacer holds the medication cloud so the child can inhale it over several breaths. It increases lung deposition from ~10% to ~20-40%, reduces oropharyngeal deposition, and eliminates the need for hand-breath coordination." }
    ],
    teachingPoints: [
      "Asthma is the most common chronic disease of childhood.",
      "Controller medications (inhaled corticosteroids) must be taken daily, not just during symptoms.",
      "Exercise-induced bronchospasm can be prevented with pre-treatment salbutamol 15-20 minutes before activity.",
      "Montelukast (leukotriene receptor antagonist) may be used as add-on therapy.",
      "Environmental control measures (dust mite covers, HEPA filters, no smoking) are essential components of asthma management."
    ]
  },
  {
    id: "suicide-risk-assessment",
    title: "Suicide Risk Assessment",
    category: "Mental Health",
    difficulty: "Advanced",
    icon: "Shield",
    description: "Conduct a comprehensive suicide risk assessment using validated screening tools, establish therapeutic rapport, determine level of risk, and develop an immediate safety plan.",
    scenarioIntro: "You are a nurse in the psychiatric emergency department. A 28-year-old patient has been brought in by a friend who is concerned because the patient has been making statements about 'not wanting to be here anymore.' The patient is cooperative but tearful, with a flat affect. There is a history of major depressive disorder.",
    equipment: [
      "Columbia Suicide Severity Rating Scale (C-SSRS) or equivalent validated tool",
      "Safety assessment documentation form",
      "Safety plan template",
      "Private, safe room (no ligature points, sharps removed)",
      "1:1 observation resources",
      "Crisis helpline information cards",
      "Documentation tools"
    ],
    steps: [
      { id: "sra-1", instruction: "Ensure the environment is safe: remove all potential means of harm (sharps, cords, belts, medications), ensure privacy, and position yourself between the patient and the door.", rationale: "Environmental safety is the first priority. Removing lethal means is the single most effective immediate intervention. Door positioning ensures the nurse's safety and escape route.", criticalStep: true },
      { id: "sra-2", instruction: "Introduce yourself, explain your role, and establish therapeutic rapport using a calm, non-judgmental tone.", rationale: "Patients are more likely to disclose suicidal ideation when they feel safe and not judged. Therapeutic rapport is essential for accurate assessment.", criticalStep: true },
      { id: "sra-3", instruction: "Begin with open-ended questions about the patient's current emotional state: 'Can you tell me what brought you here today?'", rationale: "Open-ended questions allow the patient to share their experience without feeling interrogated. This builds trust before asking direct questions about suicide.", criticalStep: false },
      { id: "sra-4", instruction: "Ask directly about suicidal ideation: 'Are you having thoughts of killing yourself or ending your life?'", rationale: "Asking directly about suicide does NOT increase risk — it provides relief and opens dialogue. Using clear language (not euphemisms) ensures accurate assessment.", criticalStep: true },
      { id: "sra-5", instruction: "If suicidal ideation is present, assess frequency, duration, and intensity: 'How often do you have these thoughts? How long do they last? How strong is the urge to act on them?'", rationale: "Frequency, duration, and intensity help quantify risk. Persistent, intense, and prolonged ideation indicates higher risk.", criticalStep: true },
      { id: "sra-6", instruction: "Assess for a plan: 'Have you thought about how you would end your life?'", rationale: "Having a specific plan significantly increases risk. The specificity and lethality of the plan are key risk stratification factors.", criticalStep: true },
      { id: "sra-7", instruction: "Assess access to means: 'Do you have access to the means you described (medications, firearms, etc.)?'", rationale: "Access to lethal means is the strongest modifiable risk factor for completed suicide. Means restriction saves lives.", criticalStep: true },
      { id: "sra-8", instruction: "Assess intent and timeline: 'Have you decided when you would do this? Have you taken any steps to prepare?'", rationale: "Active intent with a timeline and preparatory behaviors (giving away possessions, writing notes, stockpiling medications) indicate imminent risk.", criticalStep: true },
      { id: "sra-9", instruction: "Assess past suicide attempts, self-harm history, and family history of suicide.", rationale: "Previous attempt is the single strongest predictor of future suicide. Family history of suicide also increases risk.", criticalStep: true },
      { id: "sra-10", instruction: "Assess protective factors: reasons for living, social support, children, pets, religious beliefs, future-oriented thinking, willingness to seek help.", rationale: "Protective factors mitigate risk. Absence of protective factors increases concern. Ask: 'What has kept you going?' or 'What reasons do you have for living?'", criticalStep: false },
      { id: "sra-11", instruction: "Complete a validated screening tool (C-SSRS or PHQ-9 Item 9) and classify risk level as low, moderate, or high.", rationale: "Validated tools provide standardized, defensible risk stratification. Clinical judgment alone is insufficient for documentation.", criticalStep: true },
      { id: "sra-12", instruction: "For moderate-to-high risk: initiate 1:1 continuous observation and remove all potentially harmful items.", rationale: "Continuous observation prevents self-harm while in care. The patient should never be left alone until risk is reassessed by a psychiatrist.", criticalStep: true },
      { id: "sra-13", instruction: "Develop a collaborative safety plan with the patient: warning signs, coping strategies, people to contact, crisis resources, and means restriction.", rationale: "Safety planning (Stanley-Brown model) is evidence-based and gives the patient concrete steps when in crisis. It is more effective than no-harm contracts.", criticalStep: true },
      { id: "sra-14", instruction: "Notify the attending physician or psychiatrist of the assessment findings and risk level.", rationale: "Medical and psychiatric evaluation is required for all patients with suicidal ideation. The nurse's assessment informs the clinical team's management decisions.", criticalStep: true },
      { id: "sra-15", instruction: "Document the assessment thoroughly: exact patient statements (in quotation marks), risk factors, protective factors, risk level, interventions, and safety plan.", rationale: "Thorough documentation protects the patient and the nurse. Direct quotes are more defensible than paraphrasing.", criticalStep: true }
    ],
    commonErrors: [
      "Avoiding direct questions about suicide out of fear of 'planting the idea'",
      "Using euphemisms instead of clear language (e.g., 'hurt yourself' instead of 'kill yourself')",
      "Relying on no-harm contracts instead of evidence-based safety plans",
      "Not assessing access to lethal means",
      "Not asking about previous attempts",
      "Leaving the patient alone after disclosing suicidal ideation",
      "Failing to document direct patient quotes",
      "Not removing potentially harmful items from the environment",
      "Dismissing suicidal statements as attention-seeking"
    ],
    passingCriteria: "All critical steps must be performed. Student must create a safe environment, ask directly about suicidal ideation, assess plan/means/intent, use a validated screening tool, initiate appropriate safety measures, and document thoroughly.",
    clinicalPearls: [
      "Asking about suicide does NOT increase risk — research consistently shows it reduces distress.",
      "Previous suicide attempt is the single strongest predictor of completed suicide.",
      "Males complete suicide more often (more lethal means); females attempt more often.",
      "Means restriction (removing access to firearms, medications, etc.) is the most effective immediate intervention.",
      "No-harm contracts have NO evidence of effectiveness. Use evidence-based safety plans instead.",
      "The period immediately after psychiatric discharge is the highest-risk time for suicide. Close follow-up is critical."
    ],
    examLevel: "RN/NP",
    timeLimit: "20 minutes",
    candidateInstructions: "You are a nurse in the psychiatric ED. A patient has been brought in by a friend due to concerning statements. Conduct a comprehensive suicide risk assessment, determine risk level, and initiate appropriate safety measures.",
    patientActorScript: "You are tearful and initially reluctant but cooperative. When asked open-ended questions, share that you've been feeling hopeless for weeks. When asked directly about suicide, admit to thinking about it 'a lot.' If asked about a plan, disclose you've thought about taking all your pills (you have a bottle of 30 oxycodone at home from a previous injury). If asked about timeline, say 'maybe this weekend.' If asked about past attempts, disclose one overdose attempt 2 years ago. If asked about reasons for living, pause and say your dog. Respond positively to empathetic, non-judgmental approach. Become less cooperative if feeling judged.",
    examinerChecklist: [
      { action: "Ensures environmental safety (removes harmful items)", marks: 2 },
      { action: "Establishes therapeutic rapport with non-judgmental approach", marks: 2 },
      { action: "Asks directly about suicidal ideation using clear language", marks: 3 },
      { action: "Assesses plan specificity", marks: 2 },
      { action: "Assesses access to means", marks: 2 },
      { action: "Assesses intent and timeline", marks: 2 },
      { action: "Assesses past suicide attempts", marks: 1 },
      { action: "Identifies protective factors", marks: 1 },
      { action: "Uses validated screening tool", marks: 2 },
      { action: "Initiates 1:1 observation for high risk", marks: 2 },
      { action: "Develops collaborative safety plan", marks: 2 },
      { action: "Notifies physician/psychiatrist", marks: 1 },
      { action: "Documents thoroughly with direct quotes", marks: 2 }
    ],
    criticalFailCriteria: [
      "Failing to ask directly about suicidal ideation",
      "Not assessing access to lethal means",
      "Leaving a high-risk patient alone",
      "Not removing potentially harmful items from the environment",
      "Dismissing the patient's statements",
      "Failing to notify the clinical team of the risk level"
    ],
    examinerQuestions: [
      { question: "Why should you ask directly about suicide rather than using vague language?", answer: "Direct language ensures clarity and accurate assessment. Research shows asking directly about suicide does not plant the idea or increase risk. It actually provides relief to patients who feel someone finally understands their distress. Vague language can lead to misunderstanding and missed risk." },
      { question: "Why are no-harm contracts not recommended?", answer: "No-harm contracts have no evidence of effectiveness in preventing suicide. They may provide false reassurance to clinicians and can be coercive. Evidence-based safety plans (Stanley-Brown model) are recommended instead, as they provide concrete coping strategies." },
      { question: "What are the key risk factors for completed suicide?", answer: "Previous suicide attempt (strongest predictor), access to lethal means, current plan with intent, male gender, psychiatric diagnosis (especially depression, substance use, schizophrenia), recent discharge from psychiatric care, social isolation, chronic pain, and recent loss." }
    ],
    teachingPoints: [
      "The Columbia Suicide Severity Rating Scale (C-SSRS) is one of the most widely validated tools.",
      "Safety planning involves: identifying warning signs, internal coping strategies, people to contact for distraction, people to contact for help, professionals to contact, and making the environment safe.",
      "Lethal means counseling (asking about and helping restrict access to firearms, medications, etc.) is a critical nursing intervention.",
      "The 988 Suicide and Crisis Lifeline (US) and Crisis Services Canada (1-833-456-4566) should be provided to all at-risk patients.",
      "Approximately 80% of people who die by suicide saw a healthcare provider in the month before death."
    ]
  },
  {
    id: "panic-attack-management",
    title: "Panic Attack Management",
    category: "Mental Health",
    difficulty: "Intermediate",
    icon: "Brain",
    description: "Recognize and manage a patient experiencing an acute panic attack, differentiate from cardiac and other medical emergencies, provide therapeutic interventions, and teach coping strategies.",
    scenarioIntro: "You are a nurse in the emergency department. A 32-year-old patient presents with sudden onset chest tightness, palpitations, shortness of breath, tingling in the hands, and an overwhelming feeling of impending doom. The patient is hyperventilating, crying, and states 'I think I'm having a heart attack.' ECG and troponin have been ordered and are pending.",
    equipment: [
      "Cardiac monitor",
      "Pulse oximeter",
      "Blood pressure cuff",
      "12-lead ECG (already ordered)",
      "Paper bag (NOT for rebreathing — for comfort only if requested)",
      "Calm, quiet environment",
      "Grounding technique reference",
      "Documentation tools"
    ],
    steps: [
      { id: "pam-1", instruction: "Approach the patient calmly and introduce yourself. Use a slow, steady, reassuring voice.", rationale: "The nurse's demeanor is a therapeutic intervention. A calm presence helps de-escalate the patient's anxiety. Matching the patient's panic worsens symptoms.", criticalStep: true },
      { id: "pam-2", instruction: "Identify the patient using two identifiers.", rationale: "Patient safety standard.", criticalStep: true },
      { id: "pam-3", instruction: "Rule out medical emergency first: obtain vital signs, apply cardiac monitor, and review pending ECG results.", rationale: "Panic attack symptoms overlap significantly with MI, PE, pneumothorax, and hypoglycemia. Medical causes must be ruled out before attributing symptoms to anxiety.", criticalStep: true },
      { id: "pam-4", instruction: "Assess oxygen saturation and respiratory rate. Note hyperventilation pattern.", rationale: "Hyperventilation causes respiratory alkalosis, leading to tingling, lightheadedness, and chest tightness — all symptoms the patient is experiencing.", criticalStep: true },
      { id: "pam-5", instruction: "Acknowledge the patient's distress: 'I can see this is very frightening. You are safe, and I am going to help you through this.'", rationale: "Validation reduces shame and isolation. Telling a panicking patient to 'just calm down' is ineffective and dismissive.", criticalStep: true },
      { id: "pam-6", instruction: "Guide the patient through diaphragmatic breathing: 'Breathe in slowly through your nose for 4 counts, hold for 4 counts, breathe out through your mouth for 6 counts.'", rationale: "Controlled diaphragmatic breathing activates the parasympathetic nervous system, slowing heart rate and reducing hyperventilation-related symptoms.", criticalStep: true },
      { id: "pam-7", instruction: "If the patient is unable to follow breathing instructions, use grounding techniques: '5-4-3-2-1' method — name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.", rationale: "Grounding redirects attention from internal panic sensations to external reality, interrupting the panic cycle.", criticalStep: true },
      { id: "pam-8", instruction: "Maintain a calm, quiet environment: reduce stimulation by dimming lights, reducing noise, and limiting the number of people in the room.", rationale: "Sensory overload worsens panic. A calm environment supports the patient's self-regulation.", criticalStep: false },
      { id: "pam-9", instruction: "Stay with the patient throughout the episode. Do not leave them alone.", rationale: "The nurse's presence provides safety and reassurance. Leaving the patient alone can increase feelings of abandonment and fear.", criticalStep: true },
      { id: "pam-10", instruction: "Once medical causes are ruled out, explain the panic attack mechanism to the patient: fight-or-flight response, adrenaline surge, hyperventilation causing symptoms.", rationale: "Psychoeducation helps the patient understand that the symptoms, while terrifying, are not dangerous. This reduces fear of future episodes.", criticalStep: false },
      { id: "pam-11", instruction: "Assess for history of panic attacks, anxiety disorders, current stressors, and substance use (caffeine, stimulants).", rationale: "History helps determine if this is a first episode (requires more thorough medical workup) or a recurrent pattern. Substance use can trigger or worsen panic.", criticalStep: false },
      { id: "pam-12", instruction: "Reassess vital signs and symptoms after the acute episode subsides.", rationale: "Confirming symptom resolution and normalization of vital signs supports the diagnosis and provides reassurance.", criticalStep: true },
      { id: "pam-13", instruction: "Teach the patient coping strategies for future episodes: breathing techniques, grounding, cognitive reframing, and when to seek help.", rationale: "Empowering the patient with tools for self-management reduces the severity and frequency of future attacks.", criticalStep: false },
      { id: "pam-14", instruction: "Provide referral information for mental health follow-up and document the episode, interventions, and patient response.", rationale: "Ongoing mental health support (CBT, medication management) is the most effective treatment for panic disorder.", criticalStep: false }
    ],
    commonErrors: [
      "Immediately attributing symptoms to anxiety without ruling out medical causes",
      "Telling the patient to 'just calm down' or 'it's all in your head'",
      "Using a paper bag for rebreathing (can cause hypoxia and is no longer recommended)",
      "Leaving the patient alone during the episode",
      "Matching the patient's anxious energy instead of modeling calm",
      "Not assessing for substance use as a contributing factor",
      "Dismissing the patient's symptoms or minimizing their distress",
      "Failing to provide follow-up resources"
    ],
    passingCriteria: "All critical steps must be performed. Student must rule out medical emergency, validate the patient's experience, guide breathing and/or grounding techniques, stay with the patient, and reassess after the episode.",
    clinicalPearls: [
      "Panic attacks peak within 10 minutes and typically resolve within 20-30 minutes.",
      "The symptoms of a panic attack (chest pain, dyspnea, palpitations) mimic MI — always rule out cardiac causes first.",
      "Paper bag rebreathing is no longer recommended as it can cause hypoxia if there is an underlying medical cause.",
      "Cognitive Behavioral Therapy (CBT) is the gold standard treatment for panic disorder.",
      "Panic disorder affects 2-3% of the population, with women twice as likely as men.",
      "Agoraphobia develops in approximately one-third of patients with panic disorder."
    ],
    examLevel: "RPN/RN",
    timeLimit: "15 minutes",
    candidateInstructions: "You are an ED nurse. A 32-year-old patient presents with chest tightness, palpitations, and overwhelming fear. Manage the patient, rule out medical emergency, and provide therapeutic intervention.",
    patientActorScript: "You are hyperventilating, clutching your chest, and crying. You are convinced you are dying. Your hands and feet are tingling. If the nurse is calm and validating, you gradually calm down over 10-15 minutes. If the nurse is dismissive or tells you to 'calm down,' you become more agitated. History: this has happened twice before, first episode 6 months ago. You drink 4-5 coffees per day. No drug use. High-stress job. No cardiac history.",
    examinerChecklist: [
      { action: "Approaches calmly with reassuring tone", marks: 2 },
      { action: "Rules out medical emergency (vitals, ECG, monitoring)", marks: 3 },
      { action: "Validates the patient's experience", marks: 2 },
      { action: "Guides diaphragmatic breathing or grounding technique", marks: 3 },
      { action: "Stays with the patient throughout", marks: 2 },
      { action: "Reassesses after episode resolves", marks: 1 },
      { action: "Provides psychoeducation", marks: 1 },
      { action: "Assesses panic history and contributing factors", marks: 1 },
      { action: "Provides mental health follow-up referral", marks: 1 }
    ],
    criticalFailCriteria: [
      "Not ruling out medical emergency before attributing symptoms to anxiety",
      "Dismissing the patient's symptoms as 'not real'",
      "Using paper bag rebreathing",
      "Leaving the patient alone during the acute episode",
      "Administering sedation without physician order and proper assessment"
    ],
    examinerQuestions: [
      { question: "Why is paper bag rebreathing no longer recommended?", answer: "Paper bag rebreathing can cause dangerous hypoxia if the patient has an underlying medical condition causing their symptoms (MI, PE, asthma). It also reinforces the idea that something is medically wrong, increasing anxiety." },
      { question: "How does hyperventilation cause the patient's symptoms?", answer: "Hyperventilation causes excessive CO2 exhalation, leading to respiratory alkalosis. The increased pH causes calcium to bind to albumin, reducing ionized calcium, which produces tingling in the hands, feet, and perioral area, and can cause carpopedal spasm." },
      { question: "What are the DSM-5 criteria for panic disorder?", answer: "Recurrent unexpected panic attacks (at least one followed by persistent concern about additional attacks, worry about implications, or significant behavioral change for at least one month). Panic attacks involve 4 or more symptoms: palpitations, sweating, trembling, shortness of breath, chest pain, nausea, dizziness, derealization, fear of losing control, fear of dying, paresthesias, chills/hot flashes." }
    ],
    teachingPoints: [
      "The 5-4-3-2-1 grounding technique is one of the most effective immediate interventions.",
      "SSRIs are the first-line pharmacological treatment for panic disorder.",
      "Benzodiazepines provide rapid relief but carry dependence risk and should be used short-term.",
      "Caffeine is a significant trigger for panic attacks and should be minimized.",
      "Interoceptive exposure (deliberately inducing physical sensations) is a component of CBT for panic disorder."
    ]
  },
  {
    id: "delirium-assessment",
    title: "Delirium Assessment",
    category: "Mental Health",
    difficulty: "Intermediate",
    icon: "Brain",
    description: "Assess a patient for delirium using validated screening tools, identify potential reversible causes, differentiate delirium from dementia and depression, and implement appropriate interventions.",
    scenarioIntro: "You are a night-shift nurse on a medical-surgical unit. A 78-year-old patient who was alert and oriented earlier today is now confused, agitated, pulling at the IV lines, and calling out for people who are not present. The patient had a hip replacement surgery 2 days ago.",
    equipment: [
      "Confusion Assessment Method (CAM) tool",
      "Penlight",
      "Stethoscope",
      "Vital signs equipment",
      "Pulse oximeter",
      "Blood glucose monitor",
      "Bed alarm/fall prevention equipment",
      "Clock and calendar (reorientation aids)",
      "Documentation tools"
    ],
    steps: [
      { id: "dla-1", instruction: "Approach the patient calmly. Ensure safety by lowering the bed, activating bed alarm, and removing potential hazards.", rationale: "Patient safety is the first priority in delirium. Patients may fall, pull out lines, or injure themselves during agitation.", criticalStep: true },
      { id: "dla-2", instruction: "Identify the patient using two identifiers (if patient cannot verify, use armband).", rationale: "Patient safety standard. Delirious patients may not be able to self-identify.", criticalStep: true },
      { id: "dla-3", instruction: "Assess onset and course: determine when the change in mental status began and whether it fluctuates.", rationale: "Delirium has acute onset (hours to days) and a fluctuating course. This is the key differentiator from dementia, which has gradual onset and progressive course.", criticalStep: true },
      { id: "dla-4", instruction: "Perform the Confusion Assessment Method (CAM): 1) Acute onset and fluctuating course, 2) Inattention, 3) Disorganized thinking, 4) Altered level of consciousness.", rationale: "CAM is the gold standard screening tool for delirium. Positive CAM requires features 1 AND 2, plus either 3 OR 4.", criticalStep: true },
      { id: "dla-5", instruction: "Assess attention: ask the patient to recite the months of the year backward or spell 'WORLD' backward.", rationale: "Inattention is the hallmark feature of delirium and distinguishes it from other conditions. Inability to sustain attention is the core cognitive deficit.", criticalStep: true },
      { id: "dla-6", instruction: "Obtain vital signs including temperature and oxygen saturation.", rationale: "Common reversible causes of delirium include hypoxia, infection (UTI, pneumonia), and fever. Abnormal vitals may point to the underlying cause.", criticalStep: true },
      { id: "dla-7", instruction: "Check blood glucose level.", rationale: "Hypoglycemia is a common, immediately reversible cause of acute confusion. Always check glucose in any patient with altered mental status.", criticalStep: true },
      { id: "dla-8", instruction: "Review the medication list for deliriogenic medications: anticholinergics, benzodiazepines, opioids, corticosteroids, and polypharmacy.", rationale: "Medications are the most common modifiable cause of delirium. Anticholinergic burden is particularly significant in elderly patients.", criticalStep: true },
      { id: "dla-9", instruction: "Assess for urinary retention (bladder scan if available) and constipation.", rationale: "Urinary retention and fecal impaction are common, easily reversible causes of delirium in hospitalized elderly patients.", criticalStep: false },
      { id: "dla-10", instruction: "Assess hydration status and review recent intake/output and lab values (electrolytes, renal function).", rationale: "Dehydration, electrolyte imbalances (especially sodium and calcium), and renal dysfunction commonly cause delirium in elderly patients.", criticalStep: false },
      { id: "dla-11", instruction: "Implement non-pharmacological interventions: reorient the patient (clock, calendar, photos), maintain day-night cycle (lights on during day, dim at night), minimize noise, and encourage family presence.", rationale: "Non-pharmacological interventions are first-line for delirium management. They address disorientation, sleep disruption, and sensory deprivation.", criticalStep: true },
      { id: "dla-12", instruction: "Ensure the patient has their hearing aids and glasses if applicable.", rationale: "Sensory deprivation contributes to delirium. Correcting sensory deficits is a simple, effective intervention.", criticalStep: false },
      { id: "dla-13", instruction: "Use therapeutic communication: speak slowly, use short simple sentences, reorient repeatedly, and avoid arguing with the patient's perceptions.", rationale: "Arguing increases agitation. Gentle reorientation and validation are more effective in managing delirium-related confusion.", criticalStep: true },
      { id: "dla-14", instruction: "Notify the physician of the acute change in mental status, CAM findings, and any identified potential causes.", rationale: "Delirium is a medical emergency. The underlying cause must be identified and treated. The physician needs to be informed for diagnostic workup and management.", criticalStep: true },
      { id: "dla-15", instruction: "Document: time of onset, CAM results, baseline comparison, interventions, and patient response. Implement fall precautions.", rationale: "Documentation of acute change from baseline and CAM results is essential for tracking delirium course and communicating with the care team.", criticalStep: true }
    ],
    commonErrors: [
      "Confusing delirium with dementia or 'sundowning' without formal screening",
      "Not using a validated screening tool (CAM)",
      "Attributing acute confusion to age ('just getting old')",
      "Using physical restraints as first-line intervention (worsens delirium)",
      "Not checking for reversible causes (medications, UTI, constipation, hypoxia)",
      "Not assessing baseline mental status (what was the patient like before?)",
      "Using benzodiazepines for agitation in delirium (worsens delirium except in alcohol withdrawal)",
      "Not ensuring hearing aids and glasses are in place"
    ],
    passingCriteria: "All critical steps must be performed. Student must recognize acute change, perform CAM assessment, assess for reversible causes, implement non-pharmacological interventions, and notify the physician.",
    clinicalPearls: [
      "Delirium is a medical emergency with an underlying cause that must be found and treated.",
      "Use the mnemonic DELIRIUM for causes: Drugs, Electrolytes, Lack of drugs (withdrawal), Infection, Reduced sensory input, Intracranial causes, Urinary retention/constipation, Myocardial/pulmonary causes.",
      "Hypoactive delirium (quiet, withdrawn) is MORE common than hyperactive delirium but is frequently missed.",
      "Delirium is NOT a normal part of aging. Any acute change in mental status requires investigation.",
      "Physical restraints should be avoided as they worsen agitation and delirium.",
      "Post-operative delirium occurs in 15-53% of elderly surgical patients."
    ],
    examLevel: "RPN/RN",
    timeLimit: "15 minutes",
    candidateInstructions: "You are a night-shift nurse. Your 78-year-old post-operative patient who was oriented earlier is now acutely confused and agitated. Assess the patient, identify the condition, and initiate appropriate management.",
    patientActorScript: "You are agitated, pulling at your IV line, and looking around the room fearfully. You call out for your wife (who is not present). You do not know where you are. When asked to state the months backward, you cannot get past October. If the nurse is calm and gentle, you become slightly calmer. If the nurse is loud or confrontational, you become more agitated and try to climb out of bed.",
    examinerChecklist: [
      { action: "Ensures immediate patient safety", marks: 2 },
      { action: "Determines acute onset and change from baseline", marks: 2 },
      { action: "Performs CAM assessment correctly", marks: 3 },
      { action: "Tests attention (months backward or equivalent)", marks: 2 },
      { action: "Checks vital signs including oxygen saturation", marks: 1 },
      { action: "Checks blood glucose", marks: 1 },
      { action: "Reviews medications for deliriogenic drugs", marks: 2 },
      { action: "Implements non-pharmacological interventions", marks: 2 },
      { action: "Uses therapeutic communication appropriately", marks: 1 },
      { action: "Notifies physician of acute change", marks: 2 },
      { action: "Documents CAM results and findings", marks: 1 }
    ],
    criticalFailCriteria: [
      "Not recognizing the change as acute and clinically significant",
      "Attributing confusion to normal aging",
      "Applying physical restraints as first intervention",
      "Not assessing for reversible causes",
      "Not notifying the physician of the acute mental status change",
      "Administering benzodiazepines without appropriate indication"
    ],
    examinerQuestions: [
      { question: "How do you differentiate delirium from dementia?", answer: "Delirium has acute onset (hours to days), fluctuating course, inattention is the core feature, and it is reversible. Dementia has gradual onset (months to years), progressive course, memory loss is the core feature, and it is generally irreversible. Delirium and dementia can coexist." },
      { question: "Why should benzodiazepines be avoided in delirium?", answer: "Benzodiazepines are deliriogenic and worsen confusion, sedation, and fall risk in delirium. The exception is delirium caused by alcohol or benzodiazepine withdrawal, where benzodiazepines are the specific treatment." },
      { question: "What is hypoactive delirium and why is it important?", answer: "Hypoactive delirium presents as quiet, withdrawn, drowsy, and apathetic behavior. It is actually more common than hyperactive (agitated) delirium but is frequently missed because the patient is not disruptive. Hypoactive delirium carries a higher mortality rate because it is often undetected and untreated." }
    ],
    teachingPoints: [
      "The CAM tool has sensitivity of 94-100% and specificity of 90-95% when used properly.",
      "Hospital Elder Life Program (HELP) reduces delirium incidence by 33-40% using non-pharmacological interventions.",
      "Sleep promotion is critical: maintain day-night cycles, minimize nighttime interruptions, avoid sleeping medications.",
      "Early mobilization after surgery significantly reduces delirium risk.",
      "Delirium is an independent risk factor for increased mortality, prolonged hospitalization, and long-term cognitive decline."
    ]
  },
  {
    id: "dementia-communication",
    title: "Dementia Communication",
    category: "Mental Health",
    difficulty: "Intermediate",
    icon: "MessageCircle",
    description: "Demonstrate effective therapeutic communication strategies with a patient who has moderate dementia, including managing behavioral and psychological symptoms of dementia (BPSD) and collaborating with family caregivers.",
    scenarioIntro: "You are a nurse in a long-term care facility. You need to assist an 82-year-old resident with moderate Alzheimer's disease with their morning care. The resident is resistive to care today, repeatedly asking for their deceased spouse, and becomes agitated when told it is time for a bath. The resident's daughter is visiting and is distressed by the behavior.",
    equipment: [
      "Familiar comfort items (photos, blanket)",
      "Washcloths and towels",
      "Personal hygiene supplies",
      "Adaptive clothing",
      "Activity supplies for distraction",
      "Music player with familiar music",
      "Documentation tools"
    ],
    steps: [
      { id: "dmc-1", instruction: "Approach the resident from the front, at eye level, with a warm smile and calm demeanor.", rationale: "Approaching from behind or above startles patients with dementia. Eye-level contact is less threatening and facilitates communication.", criticalStep: true },
      { id: "dmc-2", instruction: "Introduce yourself by name and use the resident's preferred name. Make eye contact and use gentle touch if accepted.", rationale: "Patients with moderate dementia may not remember staff. Using their preferred name shows respect and may trigger familiarity.", criticalStep: true },
      { id: "dmc-3", instruction: "Speak slowly, clearly, and in short, simple sentences. Use one-step directions.", rationale: "Cognitive impairment limits the ability to process complex language. Short sentences and one-step instructions are easier to follow.", criticalStep: true },
      { id: "dmc-4", instruction: "When the resident asks for their deceased spouse, validate the emotion rather than correcting the reality: 'You miss [name]. Tell me about them.'", rationale: "Reality orientation (telling the person their spouse is dead) causes repeated grief and distress. Validation therapy acknowledges the emotion behind the communication.", criticalStep: true },
      { id: "dmc-5", instruction: "Avoid arguing, correcting, or using phrases like 'Don't you remember?' or 'I already told you.'", rationale: "The patient CANNOT remember due to their disease. Correcting creates shame, frustration, and agitation without any benefit.", criticalStep: true },
      { id: "dmc-6", instruction: "When the resident resists the bath, offer choices: 'Would you like to wash your face first or your hands first?'", rationale: "Offering simple choices preserves autonomy and dignity while redirecting from resistance. Avoid open-ended questions that are overwhelming.", criticalStep: true },
      { id: "dmc-7", instruction: "If resistance continues, step back, allow time, and try again later with a different approach.", rationale: "Forcing care increases agitation and can lead to combative behavior. 'Try later' is a legitimate nursing strategy for non-urgent tasks.", criticalStep: true },
      { id: "dmc-8", instruction: "Use distraction and redirection: offer a familiar activity, play familiar music, or reminisce about a topic the resident enjoys.", rationale: "Redirection is more effective than confrontation. Familiar music can reduce agitation by up to 67% in some studies.", criticalStep: false },
      { id: "dmc-9", instruction: "Assess for underlying causes of agitation: pain, hunger, toileting needs, environmental triggers (noise, unfamiliar people).", rationale: "Behavioral changes in dementia often indicate unmet needs. Pain is the most commonly missed cause of agitation in dementia patients.", criticalStep: true },
      { id: "dmc-10", instruction: "Maintain a consistent routine and familiar environment.", rationale: "Routine reduces anxiety in dementia patients. Changes in environment or caregivers are common triggers for behavioral symptoms.", criticalStep: false },
      { id: "dmc-11", instruction: "Support the visiting daughter: acknowledge her distress, explain the communication strategies you are using, and educate about the disease process.", rationale: "Family caregivers experience significant grief and burnout. Education helps them understand that behaviors are disease-driven, not personal.", criticalStep: true },
      { id: "dmc-12", instruction: "Teach the daughter specific communication techniques: validation, redirection, one-step instructions, and avoiding arguments.", rationale: "Empowering family members with practical tools improves their visits and reduces their distress.", criticalStep: false },
      { id: "dmc-13", instruction: "Document the behavioral episode, triggers identified, interventions used, and resident's response.", rationale: "Documentation of behavioral patterns helps identify triggers and effective interventions for the care plan.", criticalStep: false }
    ],
    commonErrors: [
      "Telling the patient their spouse is dead (causes repeated grief)",
      "Using 'Don't you remember?' or similar phrases",
      "Speaking too quickly or using complex sentences",
      "Arguing with the patient's perceived reality",
      "Forcing care when the patient is resistive",
      "Approaching from behind, startling the patient",
      "Not assessing for pain or other unmet needs as cause of agitation",
      "Dismissing the family member's distress",
      "Using physical or chemical restraints as first-line response to agitation"
    ],
    passingCriteria: "All critical steps must be performed. Student must demonstrate appropriate communication techniques (validation, redirection, simple language), avoid reality orientation that causes distress, manage resistance therapeutically, and support the family member.",
    clinicalPearls: [
      "The person with dementia is always right in their reality. Enter their world rather than forcing them into yours.",
      "Pain is the #1 missed cause of behavioral changes in dementia. Always assess pain before assuming behavior is 'just the dementia.'",
      "Familiar music from the patient's young adult years (ages 18-25) is most effective for reducing agitation.",
      "Validation therapy (acknowledging emotions) is more therapeutic than reality orientation for moderate-to-severe dementia.",
      "Never say 'Don't you remember?' — the answer is always no, and it causes shame and frustration.",
      "Consistent caregivers, routines, and environments significantly reduce behavioral symptoms."
    ],
    examLevel: "RPN/RN",
    timeLimit: "15 minutes",
    candidateInstructions: "You are a nurse in a long-term care facility. Assist an 82-year-old resident with moderate Alzheimer's disease who is resistive to morning care and asking for their deceased spouse. The resident's daughter is present and distressed. Demonstrate therapeutic communication.",
    patientActorScript: "You are confused but pleasant initially. You repeatedly ask where your wife/husband is. If told they are dead, become very distressed and cry. If the nurse validates your feelings ('You miss them'), calm down and share a memory. Resist the bath by pulling away and saying 'No! I don't want to!' If given a choice ('face or hands first?'), you may cooperate. If forced, become combative. Respond positively to familiar music or looking at photos.",
    examinerChecklist: [
      { action: "Approaches from front, at eye level, with calm demeanor", marks: 2 },
      { action: "Uses preferred name and introduces self", marks: 1 },
      { action: "Uses short, simple sentences and one-step directions", marks: 2 },
      { action: "Validates emotions when asked about deceased spouse", marks: 3 },
      { action: "Avoids correcting, arguing, or saying 'Don't you remember'", marks: 2 },
      { action: "Offers choices when resistance occurs", marks: 2 },
      { action: "Steps back and tries later when resistance continues", marks: 2 },
      { action: "Assesses for underlying causes of agitation", marks: 2 },
      { action: "Supports and educates the daughter", marks: 2 },
      { action: "Documents behavioral episode and interventions", marks: 1 }
    ],
    criticalFailCriteria: [
      "Telling the patient their spouse is dead in a blunt manner",
      "Forcing care against the patient's will",
      "Using physical restraints",
      "Arguing with the patient",
      "Ignoring the family member's distress",
      "Not assessing for underlying causes of behavioral change"
    ],
    examinerQuestions: [
      { question: "Why is reality orientation often inappropriate for patients with moderate-to-severe dementia?", answer: "In moderate-to-severe dementia, the patient cannot retain corrective information due to severe memory impairment. Repeatedly telling them distressing facts (e.g., spouse is dead) causes fresh grief each time without therapeutic benefit. Validation therapy addresses the emotion without causing harm." },
      { question: "What is the DICE approach for managing behavioral symptoms of dementia?", answer: "DICE stands for: Describe the behavior, Investigate underlying causes (pain, environment, unmet needs), Create a plan (non-pharmacological first), and Evaluate the outcome. It is a systematic approach to managing BPSD that prioritizes understanding causes over suppressing symptoms." },
      { question: "When might antipsychotics be appropriate for dementia-related agitation?", answer: "Antipsychotics may be considered when behavioral symptoms pose an immediate risk of harm to the patient or others, AND non-pharmacological interventions have been tried and failed. They carry a black box warning for increased mortality in elderly dementia patients and should be used at the lowest dose for the shortest duration." }
    ],
    teachingPoints: [
      "The Alzheimer's Association reports that non-pharmacological interventions should always be first-line.",
      "Music therapy, pet therapy, and reminiscence therapy have evidence supporting their use in dementia care.",
      "Sundowning (increased confusion and agitation in late afternoon/evening) is common and may be addressed with structured afternoon activities and adequate lighting.",
      "Caregiver burnout affects up to 60% of dementia caregivers. Refer to support groups and respite care.",
      "The Montessori-based approach to dementia care focuses on engaging preserved abilities rather than lost ones."
    ]
  }
];
