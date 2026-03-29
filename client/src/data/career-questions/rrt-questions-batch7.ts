import type { CareerQuestion } from "./rrt-questions";

export const rrtQuestionsBatch7: CareerQuestion[] = [
  {
    id: "rrt-2150",
    stem: "A premature infant born at 28 weeks gestation is showing signs of respiratory distress syndrome (RDS). What is the primary pathophysiology of neonatal RDS?",
    options: [
      "Surfactant deficiency leading to alveolar collapse",
      "Excess surfactant production causing airway obstruction",
      "Bacterial infection of the lower airways",
      "Congenital malformation of the bronchial tree"
    ],
    correctIndex: 0,
    rationale: "Neonatal RDS is primarily caused by insufficient surfactant production in premature lungs. Surfactant reduces surface tension in the alveoli, preventing collapse. Without adequate surfactant, alveoli collapse during expiration leading to atelectasis, ventilation-perfusion mismatch, and hypoxemia.",
    difficulty: 5,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Respiratory Distress Syndrome"
  },
  {
    id: "rrt-2151",
    stem: "Which of the following is the most common indicator that a neonate may need respiratory support immediately after birth?",
    options: [
      "Heart rate above 100 bpm",
      "Strong cry and active movement",
      "Persistent central cyanosis despite stimulation",
      "Pink skin color with acrocyanosis"
    ],
    correctIndex: 2,
    rationale: "Persistent central cyanosis despite stimulation indicates inadequate oxygenation and the need for respiratory intervention. A heart rate above 100, strong cry, and acrocyanosis are all normal findings in the immediate newborn period.",
    difficulty: 5,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Neonatal Resuscitation"
  },
  {
    id: "rrt-2152",
    stem: "What is the recommended initial FiO2 for resuscitation of a term newborn according to NRP guidelines?",
    options: [
      "1.0 (100%)",
      "0.21 (21%)",
      "0.50 (50%)",
      "0.40 (40%)"
    ],
    correctIndex: 1,
    rationale: "Current NRP guidelines recommend initiating resuscitation of term newborns with 21% oxygen (room air). FiO2 should be titrated based on pulse oximetry readings. Starting with 100% oxygen is no longer recommended due to the risk of oxygen toxicity and oxidative stress.",
    difficulty: 5,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Neonatal Resuscitation"
  },
  {
    id: "rrt-2153",
    stem: "A 2-year-old child presents with a barking cough, inspiratory stridor, and mild retractions. What is the most likely diagnosis?",
    options: [
      "Epiglottitis",
      "Croup (laryngotracheobronchitis)",
      "Foreign body aspiration",
      "Bacterial tracheitis"
    ],
    correctIndex: 1,
    rationale: "Croup is characterized by a barking or seal-like cough, inspiratory stridor, and hoarseness. It is most common in children aged 6 months to 3 years and is typically caused by parainfluenza virus. Epiglottitis presents with drooling and a toxic appearance, foreign body aspiration is usually sudden onset, and bacterial tracheitis presents with high fever and purulent secretions.",
    difficulty: 5,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Croup"
  },
  {
    id: "rrt-2154",
    stem: "What is the normal respiratory rate range for a newborn infant?",
    options: [
      "12-20 breaths per minute",
      "20-30 breaths per minute",
      "30-60 breaths per minute",
      "60-80 breaths per minute"
    ],
    correctIndex: 2,
    rationale: "The normal respiratory rate for a newborn is 30-60 breaths per minute. Rates of 12-20 are normal for adults, 20-30 for older children, and rates consistently above 60 would be considered tachypnea in a neonate.",
    difficulty: 5,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Neonatal Assessment"
  },
  {
    id: "rrt-2155",
    stem: "The Silverman-Andersen score is used in neonatal care to assess which of the following?",
    options: [
      "Pain level",
      "Neurological status",
      "Severity of respiratory distress",
      "Gestational age"
    ],
    correctIndex: 2,
    rationale: "The Silverman-Andersen score evaluates the severity of respiratory distress in neonates by assessing chest movement, intercostal retractions, xiphoid retractions, nasal flaring, and expiratory grunting. A score of 0 indicates no distress, while a score of 10 indicates severe distress.",
    difficulty: 4,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Neonatal Assessment"
  },
  {
    id: "rrt-2156",
    stem: "Which surfactant preparation is classified as a natural (animal-derived) surfactant?",
    options: [
      "Colfosceril palmitate (Exosurf)",
      "Beractant (Survanta)",
      "Lucinactant (Surfaxin)",
      "Tyloxapol"
    ],
    correctIndex: 1,
    rationale: "Beractant (Survanta) is a natural surfactant derived from bovine lung extract. Colfosceril palmitate (Exosurf) is a synthetic surfactant. Lucinactant (Surfaxin) is a synthetic peptide-containing surfactant. Natural surfactants generally have better clinical outcomes than first-generation synthetic surfactants.",
    difficulty: 4,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Surfactant Therapy"
  },
  {
    id: "rrt-2157",
    stem: "A neonate is placed on nasal CPAP at 5 cm H2O. What is the primary mechanism by which CPAP improves oxygenation in neonates with RDS?",
    options: [
      "Increases tidal volume delivery",
      "Maintains functional residual capacity and prevents alveolar collapse",
      "Directly increases surfactant production",
      "Reduces pulmonary blood flow"
    ],
    correctIndex: 1,
    rationale: "CPAP maintains functional residual capacity (FRC) by splinting the alveoli open during expiration, preventing atelectasis. This improves ventilation-perfusion matching and oxygenation. CPAP does not directly increase surfactant production or tidal volume, nor does it reduce pulmonary blood flow.",
    difficulty: 4,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "CPAP Therapy"
  },
  {
    id: "rrt-2158",
    stem: "In the APGAR scoring system, a score of 1 for 'respiratory effort' indicates which of the following?",
    options: [
      "Absent breathing",
      "Good, strong cry",
      "Slow, irregular breathing",
      "Regular respirations with mild retractions"
    ],
    correctIndex: 2,
    rationale: "In APGAR scoring, respiratory effort is scored as 0 for absent breathing, 1 for slow or irregular breathing, and 2 for a good, strong cry. The APGAR score is assessed at 1 and 5 minutes after birth to evaluate the newborn's transition to extrauterine life.",
    difficulty: 5,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Neonatal Assessment"
  },
  {
    id: "rrt-2159",
    stem: "What is the most appropriate initial ventilator mode for a premature neonate with RDS who has failed nasal CPAP?",
    options: [
      "High-frequency oscillatory ventilation",
      "Pressure-controlled SIMV with volume guarantee",
      "Volume-controlled assist/control",
      "Pressure support ventilation only"
    ],
    correctIndex: 1,
    rationale: "Pressure-controlled SIMV with volume guarantee is commonly used as initial mechanical ventilation for neonates with RDS. This mode provides synchronized breaths with consistent tidal volumes while limiting peak pressures. HFOV is typically reserved for failure of conventional ventilation. Pure volume control can be problematic due to variable leak around uncuffed ETTs.",
    difficulty: 4,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Neonatal Ventilation"
  },
  {
    id: "rrt-2160",
    stem: "A 4-year-old child with asthma is receiving a nebulized albuterol treatment. What is the appropriate dose of albuterol for this patient?",
    options: [
      "0.5 mg",
      "2.5 mg",
      "5.0 mg",
      "10.0 mg"
    ],
    correctIndex: 1,
    rationale: "The standard nebulized albuterol dose for children weighing less than 20 kg is 2.5 mg (0.5 mL of 0.5% solution diluted to 3 mL). For children over 20 kg and adults, the dose is typically 2.5-5 mg. A dose of 0.5 mg would be subtherapeutic, and 10 mg would be excessive.",
    difficulty: 5,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Pediatric Pharmacology"
  },
  {
    id: "rrt-2161",
    stem: "Which of the following chest X-ray findings is most characteristic of neonatal RDS?",
    options: [
      "Hyperinflation with flattened diaphragms",
      "Diffuse bilateral ground-glass appearance with air bronchograms",
      "Unilateral opacification with mediastinal shift",
      "Bilateral perihilar infiltrates with cardiomegaly"
    ],
    correctIndex: 1,
    rationale: "Neonatal RDS typically presents on chest X-ray with a diffuse bilateral ground-glass (reticulogranular) pattern and air bronchograms. Severe cases may show complete opacification ('white-out'). Hyperinflation suggests air trapping (e.g., meconium aspiration), unilateral opacification suggests pneumothorax or effusion, and perihilar infiltrates with cardiomegaly suggest cardiac pathology.",
    difficulty: 4,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Respiratory Distress Syndrome"
  },
  {
    id: "rrt-2162",
    stem: "What is the recommended tidal volume target for mechanical ventilation of a neonate?",
    options: [
      "2-3 mL/kg",
      "4-6 mL/kg",
      "8-10 mL/kg",
      "10-12 mL/kg"
    ],
    correctIndex: 1,
    rationale: "The recommended tidal volume for neonatal mechanical ventilation is 4-6 mL/kg. This range provides adequate ventilation while minimizing the risk of volutrauma. Volumes of 2-3 mL/kg would likely result in inadequate ventilation, while volumes above 6 mL/kg increase the risk of lung injury in neonates.",
    difficulty: 5,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Neonatal Ventilation"
  },
  {
    id: "rrt-2163",
    stem: "A premature infant at 26 weeks gestation receives surfactant therapy within 15 minutes of birth. This is an example of which type of surfactant administration?",
    options: [
      "Rescue therapy",
      "Prophylactic therapy",
      "Maintenance therapy",
      "Late therapy"
    ],
    correctIndex: 1,
    rationale: "Prophylactic surfactant therapy is administered shortly after birth (within 15-30 minutes) before significant symptoms of RDS develop, typically to very premature infants at high risk. Rescue therapy is given after RDS has been diagnosed and symptoms are present. Prophylactic therapy in extremely premature infants may reduce mortality and air leak complications.",
    difficulty: 4,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Surfactant Therapy"
  },
  {
    id: "rrt-2164",
    stem: "A neonate born at 32 weeks gestation develops apnea episodes. What medication is most commonly used to treat apnea of prematurity?",
    options: [
      "Doxapram",
      "Caffeine citrate",
      "Theophylline",
      "Aminophylline"
    ],
    correctIndex: 1,
    rationale: "Caffeine citrate is the first-line treatment for apnea of prematurity due to its wide therapeutic index, once-daily dosing, and fewer side effects compared to theophylline or aminophylline. The CAP trial demonstrated that caffeine also reduces the incidence of bronchopulmonary dysplasia. Doxapram is reserved for refractory cases.",
    difficulty: 4,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Apnea of Prematurity"
  },
  {
    id: "rrt-2165",
    stem: "What is bronchopulmonary dysplasia (BPD)?",
    options: [
      "An acute infection of the bronchial tree in neonates",
      "A chronic lung disease resulting from prolonged oxygen therapy and mechanical ventilation in premature infants",
      "A congenital absence of bronchial cartilage",
      "An autoimmune disorder affecting the pulmonary vasculature"
    ],
    correctIndex: 1,
    rationale: "BPD is a chronic lung disease that develops in premature infants who have been exposed to supplemental oxygen and/or positive pressure ventilation. It is characterized by inflammation, fibrosis, and impaired alveolar development. Risk factors include extreme prematurity, prolonged mechanical ventilation, oxygen toxicity, and infection.",
    difficulty: 5,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Bronchopulmonary Dysplasia"
  },
  {
    id: "rrt-2166",
    stem: "During neonatal resuscitation, positive pressure ventilation is initiated when the heart rate remains below what threshold after initial steps?",
    options: [
      "60 bpm",
      "80 bpm",
      "100 bpm",
      "120 bpm"
    ],
    correctIndex: 2,
    rationale: "According to NRP guidelines, positive pressure ventilation should be initiated if the heart rate remains below 100 bpm after initial steps (warming, clearing airway, drying, stimulating). If the heart rate drops below 60 bpm despite effective PPV, chest compressions should be started.",
    difficulty: 5,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Neonatal Resuscitation"
  },
  {
    id: "rrt-2167",
    stem: "A 6-month-old infant presents with wheezing, tachypnea, nasal flaring, and intercostal retractions. The symptoms started with rhinorrhea 2 days ago. What is the most likely diagnosis?",
    options: [
      "Asthma exacerbation",
      "Bronchiolitis",
      "Pneumonia",
      "Croup"
    ],
    correctIndex: 1,
    rationale: "Bronchiolitis is the most common lower respiratory tract infection in infants under 1 year of age, typically caused by respiratory syncytial virus (RSV). It presents with initial upper respiratory symptoms followed by wheezing, tachypnea, and respiratory distress. Asthma is less common in this age group, croup presents with stridor, and pneumonia typically presents with fever and focal findings.",
    difficulty: 1,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Bronchiolitis"
  },
  {
    id: "rrt-2168",
    stem: "Which size endotracheal tube (ETT) is most appropriate for a full-term neonate?",
    options: [
      "2.5 mm ID",
      "3.0 mm ID",
      "3.5 mm ID",
      "4.0 mm ID"
    ],
    correctIndex: 2,
    rationale: "A 3.5 mm ID ETT is appropriate for a full-term neonate (>3.5 kg). For premature infants: 2.5 mm for <1 kg, 3.0 mm for 1-2 kg, and 3.5 mm for >2 kg. The formula (age/4) + 4 is used for children over 1 year. Neonatal ETTs are uncuffed to reduce subglottic injury.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Airway Management"
  },
  {
    id: "rrt-2169",
    stem: "What is the primary purpose of administering antenatal corticosteroids to a mother at risk for preterm delivery?",
    options: [
      "To suppress the maternal immune response",
      "To accelerate fetal lung maturation and surfactant production",
      "To prevent maternal hemorrhage",
      "To delay the onset of labor"
    ],
    correctIndex: 1,
    rationale: "Antenatal corticosteroids (betamethasone or dexamethasone) are administered to mothers at risk for preterm delivery between 24-34 weeks gestation to accelerate fetal lung maturation by stimulating surfactant production. This significantly reduces the incidence and severity of RDS, intraventricular hemorrhage, and neonatal mortality.",
    difficulty: 1,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Respiratory Distress Syndrome"
  },
  {
    id: "rrt-2170",
    stem: "A child is being ventilated with high-frequency oscillatory ventilation (HFOV). Which parameter primarily controls oxygenation on HFOV?",
    options: [
      "Frequency (Hz)",
      "Amplitude (delta P)",
      "Mean airway pressure (MAP)",
      "Inspiratory time percentage"
    ],
    correctIndex: 2,
    rationale: "On HFOV, mean airway pressure (MAP) is the primary determinant of oxygenation. Increasing MAP recruits collapsed alveoli, improving ventilation-perfusion matching. Amplitude (delta P) controls ventilation (CO2 removal), and frequency affects the volume of gas moved per oscillation. MAP is typically set 2-4 cm H2O above the MAP used on conventional ventilation.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "High-Frequency Ventilation"
  },
  {
    id: "rrt-2171",
    stem: "A neonate on mechanical ventilation has an ABG showing: pH 7.25, PaCO2 60 mmHg, PaO2 65 mmHg, HCO3 24 mEq/L. Which ventilator adjustment is most appropriate?",
    options: [
      "Increase FiO2",
      "Increase PEEP",
      "Increase ventilator rate or tidal volume",
      "Decrease inspiratory time"
    ],
    correctIndex: 2,
    rationale: "The ABG shows uncompensated respiratory acidosis (low pH, elevated PaCO2, normal HCO3) with adequate oxygenation (PaO2 65). The primary problem is inadequate ventilation (CO2 removal). Increasing the ventilator rate or tidal volume will increase minute ventilation and decrease PaCO2. Increasing FiO2 or PEEP would address oxygenation, which is already adequate.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Neonatal Ventilation"
  },
  {
    id: "rrt-2172",
    stem: "Which complication is most closely associated with the use of high concentrations of supplemental oxygen in premature neonates?",
    options: [
      "Necrotizing enterocolitis",
      "Retinopathy of prematurity",
      "Patent ductus arteriosus",
      "Intraventricular hemorrhage"
    ],
    correctIndex: 1,
    rationale: "Retinopathy of prematurity (ROP) is strongly associated with excessive supplemental oxygen administration in premature infants. High oxygen levels cause abnormal blood vessel growth in the retina, potentially leading to retinal detachment and blindness. This is why oxygen saturation targets for premature neonates are carefully maintained between 88-95%.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Oxygen Therapy Complications"
  },
  {
    id: "rrt-2173",
    stem: "What is the recommended SpO2 target range for a very premature neonate (<32 weeks gestation) receiving supplemental oxygen?",
    options: [
      "85-89%",
      "88-95%",
      "95-100%",
      "92-97%"
    ],
    correctIndex: 1,
    rationale: "The recommended SpO2 target for very premature neonates is 88-95% (some centers use 90-95%). Maintaining saturations in this range balances adequate oxygenation with minimizing the risks of oxygen toxicity, including retinopathy of prematurity and bronchopulmonary dysplasia. Saturations above 95% are associated with increased risk of ROP.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Oxygen Therapy"
  },
  {
    id: "rrt-2174",
    stem: "A 3-year-old child with epiglottitis presents with drooling, high fever, and a muffled voice in the tripod position. What is the most important initial action?",
    options: [
      "Obtain a lateral neck X-ray immediately",
      "Attempt direct laryngoscopy at the bedside",
      "Keep the child calm and prepare for controlled airway management in the OR",
      "Administer racemic epinephrine nebulization"
    ],
    correctIndex: 2,
    rationale: "In epiglottitis, the priority is to keep the child calm and avoid agitation that could precipitate complete airway obstruction. Controlled intubation in the operating room with surgical backup is the gold standard. Direct laryngoscopy at the bedside could cause laryngospasm. Racemic epinephrine is used for croup, not epiglottitis. X-rays should not delay airway management.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Epiglottitis"
  },
  {
    id: "rrt-2175",
    stem: "Meconium aspiration syndrome (MAS) is most commonly associated with which type of infant?",
    options: [
      "Premature infants at 28-32 weeks",
      "Term or post-term infants",
      "Small for gestational age infants",
      "Infants born via elective cesarean section"
    ],
    correctIndex: 1,
    rationale: "Meconium aspiration syndrome is most commonly seen in term or post-term infants. Meconium passage in utero is rare before 34 weeks gestation and increases with gestational age. Post-term infants are at highest risk because of increased meconium production and decreased amniotic fluid volume. MAS causes airway obstruction, chemical pneumonitis, and surfactant inactivation.",
    difficulty: 1,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Meconium Aspiration Syndrome"
  },
  {
    id: "rrt-2176",
    stem: "A neonate with meconium aspiration syndrome develops a right-sided pneumothorax. What is the most likely mechanism?",
    options: [
      "Direct chest wall trauma during delivery",
      "Ball-valve obstruction leading to air trapping and alveolar rupture",
      "Surfactant deficiency causing diffuse atelectasis",
      "Congenital weakness of the visceral pleura"
    ],
    correctIndex: 1,
    rationale: "In MAS, particulate meconium creates a ball-valve obstruction in the airways. Air can enter during inspiration but becomes trapped during expiration, leading to progressive hyperinflation, alveolar rupture, and pneumothorax. This air leak complication occurs in up to 15-33% of infants with MAS.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Meconium Aspiration Syndrome"
  },
  {
    id: "rrt-2177",
    stem: "What is the appropriate depth of insertion for an ETT in a 1 kg premature neonate?",
    options: [
      "5 cm at the lip",
      "7 cm at the lip",
      "9 cm at the lip",
      "11 cm at the lip"
    ],
    correctIndex: 1,
    rationale: "The tip-to-lip ETT insertion depth for neonates can be estimated using the formula: weight (kg) + 6 cm. For a 1 kg infant: 1 + 6 = 7 cm at the lip. Another common method is the nasal-tragus length plus 1 cm. Proper positioning should always be confirmed with chest X-ray, aiming for the ETT tip at T1-T2 level.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Airway Management"
  },
  {
    id: "rrt-2178",
    stem: "Which type of congenital diaphragmatic hernia is most common?",
    options: [
      "Right-sided Bochdalek hernia",
      "Left-sided Bochdalek hernia",
      "Morgagni hernia",
      "Central tendon defect"
    ],
    correctIndex: 1,
    rationale: "Left-sided Bochdalek hernia accounts for approximately 80-85% of all congenital diaphragmatic hernias. It occurs through the posterolateral foramen of Bochdalek. Abdominal contents herniate into the left thorax, causing pulmonary hypoplasia and pulmonary hypertension. Right-sided Bochdalek hernias account for about 13%, and Morgagni hernias are rare (2%).",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Congenital Diaphragmatic Hernia"
  },
  {
    id: "rrt-2179",
    stem: "A neonate with a congenital diaphragmatic hernia requires intubation. What should be avoided during resuscitation?",
    options: [
      "Endotracheal intubation",
      "Bag-mask ventilation",
      "Pulse oximetry monitoring",
      "Intravenous access"
    ],
    correctIndex: 1,
    rationale: "Bag-mask ventilation should be avoided in neonates with congenital diaphragmatic hernia because it introduces air into the stomach and herniated bowel in the thorax, further compressing the lungs and worsening respiratory compromise. Immediate endotracheal intubation is the preferred method of ventilation, along with nasogastric tube placement for gastric decompression.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Congenital Diaphragmatic Hernia"
  },
  {
    id: "rrt-2180",
    stem: "What is the definition of transient tachypnea of the newborn (TTN)?",
    options: [
      "A chronic lung disease of prematurity",
      "A self-limiting condition caused by delayed clearance of fetal lung fluid",
      "An acute bacterial pneumonia acquired during delivery",
      "A congenital malformation of the tracheobronchial tree"
    ],
    correctIndex: 1,
    rationale: "Transient tachypnea of the newborn is a self-limiting condition caused by delayed reabsorption of fetal lung fluid. It is more common in term or near-term infants delivered by cesarean section (without labor) because the mechanical squeeze of vaginal delivery and catecholamine surge help clear lung fluid. Symptoms typically resolve within 24-72 hours.",
    difficulty: 1,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Transient Tachypnea of Newborn"
  },
  {
    id: "rrt-2181",
    stem: "A 5-year-old child with a history of asthma is admitted with severe respiratory distress. Peak expiratory flow (PEF) is 40% of predicted. According to the stepwise approach, what is the severity classification?",
    options: [
      "Mild intermittent",
      "Mild persistent",
      "Moderate exacerbation",
      "Severe exacerbation"
    ],
    correctIndex: 3,
    rationale: "A PEF of 40% of predicted indicates a severe asthma exacerbation. Classification: mild exacerbation PEF >70%, moderate 40-69%, severe <40%. Severe exacerbations require aggressive treatment including continuous nebulization, systemic corticosteroids, and close monitoring for deterioration.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Pediatric Asthma"
  },
  {
    id: "rrt-2182",
    stem: "Which inhaled corticosteroid is most commonly used as maintenance therapy in pediatric asthma?",
    options: [
      "Beclomethasone",
      "Budesonide",
      "Fluticasone",
      "Mometasone"
    ],
    correctIndex: 1,
    rationale: "Budesonide is one of the most commonly used inhaled corticosteroids in pediatric asthma, available as a nebulizer suspension (Pulmicort Respules) making it suitable for young children who cannot use metered-dose inhalers or dry powder inhalers. Fluticasone is also widely used but typically via MDI with spacer. All listed options are effective inhaled corticosteroids.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Pediatric Asthma"
  },
  {
    id: "rrt-2183",
    stem: "Persistent pulmonary hypertension of the newborn (PPHN) is characterized by which hemodynamic finding?",
    options: [
      "Left-to-right shunting through the foramen ovale",
      "Right-to-left shunting through the ductus arteriosus and/or foramen ovale",
      "Decreased pulmonary vascular resistance",
      "Increased systemic vascular resistance with normal pulmonary pressures"
    ],
    correctIndex: 1,
    rationale: "PPHN is characterized by failure of the normal transition from fetal to neonatal circulation. Elevated pulmonary vascular resistance causes right-to-left shunting through the patent ductus arteriosus and/or foramen ovale, resulting in severe hypoxemia. This produces a pre-ductal and post-ductal SpO2 difference greater than 5-10%.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Persistent Pulmonary Hypertension"
  },
  {
    id: "rrt-2184",
    stem: "What medication is used as a selective pulmonary vasodilator in the treatment of PPHN?",
    options: [
      "Inhaled nitric oxide (iNO)",
      "Inhaled epinephrine",
      "Nebulized albuterol",
      "Aerosolized surfactant"
    ],
    correctIndex: 0,
    rationale: "Inhaled nitric oxide (iNO) is the gold standard selective pulmonary vasodilator for treating PPHN. It acts directly on pulmonary vascular smooth muscle to cause vasodilation, reducing pulmonary vascular resistance and improving oxygenation. It is rapidly inactivated by hemoglobin, limiting systemic effects. Starting dose is typically 20 ppm.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Persistent Pulmonary Hypertension"
  },
  {
    id: "rrt-2185",
    stem: "What pre-ductal and post-ductal SpO2 difference is suggestive of persistent pulmonary hypertension in a neonate?",
    options: [
      "Greater than 1-2%",
      "Greater than 5-10%",
      "Greater than 15-20%",
      "Greater than 25%"
    ],
    correctIndex: 1,
    rationale: "A pre-ductal (right hand) and post-ductal (foot) SpO2 difference greater than 5-10% is suggestive of right-to-left shunting through the patent ductus arteriosus, consistent with PPHN. Pre-ductal saturations will be higher because that blood has not yet passed the ductus where deoxygenated blood mixes. A small difference of 1-2% can be normal.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Persistent Pulmonary Hypertension"
  },
  {
    id: "rrt-2186",
    stem: "A premature neonate is being weaned from mechanical ventilation. Which of the following criteria supports extubation readiness?",
    options: [
      "FiO2 of 0.60 with PEEP of 8 cm H2O",
      "Ventilator rate of 20 with PIP of 25 cm H2O",
      "FiO2 of 0.30 or less with low ventilator settings and spontaneous respiratory effort",
      "PaCO2 of 55 with pH of 7.28"
    ],
    correctIndex: 2,
    rationale: "Extubation readiness in neonates is suggested by low ventilator settings (FiO2 ≤0.30, low PIP, low rate), adequate spontaneous respiratory effort, and stable blood gases. Higher FiO2 requirements, high pressures, or respiratory acidosis indicate the infant is not ready for extubation. Most centers transition to nasal CPAP following extubation.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Neonatal Ventilation"
  },
  {
    id: "rrt-2187",
    stem: "What is the INSURE technique in neonatal respiratory care?",
    options: [
      "Inhaled Nitric oxide, Surfactant, Reintubation for Emergencies",
      "Intubation, Surfactant administration, Rapid Extubation to CPAP",
      "Intravenous Steroids, Umbilical catheter, Respiratory Evaluation",
      "Intermittent Nasal Suctioning, Umbilical monitoring, Rescue ventilation"
    ],
    correctIndex: 1,
    rationale: "The INSURE technique stands for INtubation, SURfactant administration, and Extubation to CPAP. This approach provides the benefits of surfactant therapy while minimizing the duration of mechanical ventilation and its associated complications. It has been shown to reduce the need for prolonged mechanical ventilation and may decrease the incidence of BPD.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Surfactant Therapy"
  },
  {
    id: "rrt-2188",
    stem: "A 10-month-old infant with bronchiolitis is hospitalized. Which of the following interventions has the strongest evidence for clinical benefit?",
    options: [
      "Nebulized albuterol",
      "Systemic corticosteroids",
      "Supportive care with nasal suctioning and supplemental oxygen as needed",
      "Nebulized hypertonic saline in the emergency department"
    ],
    correctIndex: 2,
    rationale: "Current evidence-based guidelines for bronchiolitis management emphasize supportive care, including nasal suctioning, supplemental oxygen to maintain SpO2 ≥90%, and adequate hydration. Bronchodilators and systemic corticosteroids have not shown consistent benefit in bronchiolitis and are not routinely recommended. Hypertonic saline may have some benefit for hospitalized patients but is not first-line.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Bronchiolitis"
  },
  {
    id: "rrt-2189",
    stem: "Which of the following is a risk factor for the development of bronchopulmonary dysplasia (BPD)?",
    options: [
      "Term birth weight above 3.5 kg",
      "Gestational age less than 28 weeks",
      "Delivery via cesarean section at term",
      "Maternal Group B streptococcus colonization"
    ],
    correctIndex: 1,
    rationale: "Extreme prematurity (gestational age <28 weeks) is the strongest risk factor for BPD. Other risk factors include prolonged mechanical ventilation, high oxygen exposure, infection, patent ductus arteriosus, and fluid overload. Term infants rarely develop BPD. The definition of BPD includes the need for supplemental oxygen at 36 weeks corrected gestational age.",
    difficulty: 1,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Bronchopulmonary Dysplasia"
  },
  {
    id: "rrt-2190",
    stem: "A neonate is placed on high-frequency oscillatory ventilation. The respiratory therapist notes the chest is not adequately vibrating. Which parameter should be increased?",
    options: [
      "Mean airway pressure",
      "FiO2",
      "Amplitude (delta P)",
      "Frequency (Hz)"
    ],
    correctIndex: 2,
    rationale: "Amplitude (delta P or power) controls the pressure oscillation around the mean airway pressure and determines the visible chest wall vibration ('chest wiggle'). If chest vibration is inadequate, increasing amplitude will improve ventilation. Increasing frequency would actually decrease the tidal volume delivered. MAP affects oxygenation, not chest vibration.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "High-Frequency Ventilation"
  },
  {
    id: "rrt-2191",
    stem: "On HFOV, which parameter adjustment would you make to decrease PaCO2?",
    options: [
      "Increase mean airway pressure",
      "Increase amplitude and/or decrease frequency",
      "Increase FiO2",
      "Decrease amplitude and increase frequency"
    ],
    correctIndex: 1,
    rationale: "To decrease PaCO2 on HFOV, increase amplitude (increases tidal volume) and/or decrease frequency (allows more time for gas exchange, increasing tidal volume). CO2 removal on HFOV is proportional to frequency × (tidal volume)². Since tidal volume has a squared relationship, changes in amplitude have a greater effect on CO2 removal than changes in frequency.",
    difficulty: 4,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "High-Frequency Ventilation"
  },
  {
    id: "rrt-2192",
    stem: "A newborn presents with a scaphoid abdomen, respiratory distress, and absent breath sounds on the left side. What is the most likely diagnosis?",
    options: [
      "Left-sided pneumothorax",
      "Left-sided congenital diaphragmatic hernia",
      "Left lower lobe pneumonia",
      "Congenital cystic adenomatoid malformation"
    ],
    correctIndex: 1,
    rationale: "The triad of scaphoid abdomen (empty-appearing abdomen because bowel has herniated into the chest), respiratory distress, and absent breath sounds on the left is classic for a left-sided congenital diaphragmatic hernia. A pneumothorax would not cause scaphoid abdomen, pneumonia would have crackles, and CCAM typically presents later.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Congenital Diaphragmatic Hernia"
  },
  {
    id: "rrt-2193",
    stem: "Which ventilation strategy is recommended to minimize ventilator-induced lung injury in neonates?",
    options: [
      "High tidal volumes with low PEEP",
      "Low tidal volumes with adequate PEEP (gentle ventilation)",
      "High peak pressures with rapid rates",
      "Maximum FiO2 with minimal PEEP"
    ],
    correctIndex: 1,
    rationale: "Gentle ventilation with low tidal volumes (4-6 mL/kg) and adequate PEEP to maintain lung recruitment is the recommended strategy to minimize ventilator-induced lung injury in neonates. This approach reduces volutrauma and atelectrauma. Permissive hypercapnia (tolerating PaCO2 up to 55-65 mmHg) may be used to allow lower ventilator settings.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Neonatal Ventilation"
  },
  {
    id: "rrt-2194",
    stem: "A child with croup is given a dose of nebulized racemic epinephrine. What is the duration of its clinical effect, and why is monitoring after administration important?",
    options: [
      "30 minutes; rebound bronchospasm may occur",
      "1-2 hours; rebound airway edema may occur after the effect wears off",
      "4-6 hours; there is a risk of cardiac arrhythmia",
      "8-12 hours; there is a risk of vocal cord paralysis"
    ],
    correctIndex: 1,
    rationale: "Racemic epinephrine provides temporary relief of airway edema in croup, typically lasting 1-2 hours. After the vasoconstrictive effect wears off, rebound edema can occur, potentially causing recurrence or worsening of symptoms. Patients should be observed for at least 2-4 hours after administration to monitor for rebound effects.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Croup"
  },
  {
    id: "rrt-2195",
    stem: "What oral medication is recommended as first-line treatment for moderate-to-severe croup?",
    options: [
      "Amoxicillin",
      "Dexamethasone",
      "Prednisolone",
      "Montelukast"
    ],
    correctIndex: 1,
    rationale: "Dexamethasone is the first-line corticosteroid for croup treatment, typically given as a single oral dose of 0.6 mg/kg. It reduces airway inflammation and edema, decreases the need for hospitalization, and reduces return visits. Its long half-life (36-54 hours) provides sustained benefit. Antibiotics are not indicated unless bacterial superinfection is suspected.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Croup"
  },
  {
    id: "rrt-2196",
    stem: "A 7-year-old child with asthma uses an MDI with a spacer. What is the recommended technique for using a spacer with an MDI?",
    options: [
      "Actuate the inhaler then wait 10 seconds before inhaling",
      "Inhale rapidly and forcefully after actuation",
      "Actuate the inhaler into the spacer and take a slow, deep breath over 3-5 seconds",
      "Actuate multiple puffs simultaneously into the spacer"
    ],
    correctIndex: 2,
    rationale: "Proper spacer technique involves: shake the MDI, attach to spacer, exhale normally, place spacer mouthpiece in mouth, actuate one puff, then inhale slowly and deeply over 3-5 seconds, hold breath for 10 seconds. Only one puff at a time should be actuated. Rapid inhalation causes increased oropharyngeal deposition. Waiting 10 seconds allows the medication to settle.",
    difficulty: 1,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Aerosol Delivery"
  },
  {
    id: "rrt-2197",
    stem: "Surfactant replacement therapy should be administered through which route?",
    options: [
      "Nebulization via face mask",
      "Intratracheal instillation via endotracheal tube",
      "Intravenous infusion",
      "Oral administration via nasogastric tube"
    ],
    correctIndex: 1,
    rationale: "Surfactant is administered via intratracheal instillation through an endotracheal tube or using minimally invasive techniques (LISA/MIST via thin catheter). It must be delivered directly to the lungs to coat the alveolar surface. Nebulization is being studied but is not yet standard practice. Surfactant cannot be given IV or orally as it would be degraded.",
    difficulty: 1,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Surfactant Therapy"
  },
  {
    id: "rrt-2198",
    stem: "A neonate born at 24 weeks gestation is at highest risk for which grade of intraventricular hemorrhage (IVH)?",
    options: [
      "Grade I - subependymal hemorrhage only",
      "Grade II - hemorrhage extending into ventricles without dilation",
      "Grade III - hemorrhage with ventricular dilation",
      "All grades; extreme prematurity is the greatest risk factor for any grade of IVH"
    ],
    correctIndex: 3,
    rationale: "Extreme prematurity is the single greatest risk factor for intraventricular hemorrhage of any grade. The germinal matrix, which is highly vascularized and fragile, is present until approximately 32-34 weeks gestation. Infants born at 24 weeks have the highest incidence of IVH, including severe grades (III-IV). Gentle ventilation and avoiding fluctuations in cerebral blood flow help reduce risk.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Complications of Prematurity"
  },
  {
    id: "rrt-2199",
    stem: "Which of the following is the correct sequence for neonatal resuscitation according to NRP?",
    options: [
      "Chest compressions → PPV → Epinephrine → Initial steps",
      "Initial steps → PPV → Chest compressions → Epinephrine",
      "PPV → Initial steps → Epinephrine → Chest compressions",
      "Epinephrine → Chest compressions → PPV → Initial steps"
    ],
    correctIndex: 1,
    rationale: "The NRP algorithm follows a specific sequence: Initial steps (warm, dry, stimulate, clear airway) → Evaluate → If HR <100 bpm, begin PPV → If HR <60 bpm despite effective PPV, begin chest compressions → If HR remains <60 bpm despite effective PPV and compressions, administer epinephrine. Most neonates respond to initial steps and PPV alone.",
    difficulty: 1,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Neonatal Resuscitation"
  },
  {
    id: "rrt-2200",
    stem: "During neonatal chest compressions, what is the recommended compression-to-ventilation ratio?",
    options: [
      "15:2",
      "30:2",
      "3:1",
      "5:1"
    ],
    correctIndex: 2,
    rationale: "The NRP-recommended compression-to-ventilation ratio for neonates is 3:1 (3 compressions to 1 ventilation), delivered in a coordinated fashion. This provides approximately 90 compressions and 30 ventilations per minute. This ratio differs from the pediatric and adult ratios because neonatal cardiac arrest is almost always due to respiratory failure rather than primary cardiac causes.",
    difficulty: 1,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Neonatal Resuscitation"
  },
  {
    id: "rrt-2201",
    stem: "A 3-week-old infant presents with projectile vomiting after feeds, dehydration, and a palpable olive-shaped mass in the right upper quadrant. The respiratory therapist notes hypochloremic metabolic alkalosis on ABG. What condition is most likely causing the acid-base disturbance?",
    options: [
      "Gastroesophageal reflux disease",
      "Pyloric stenosis",
      "Tracheoesophageal fistula",
      "Duodenal atresia"
    ],
    correctIndex: 1,
    rationale: "Pyloric stenosis causes projectile vomiting of gastric contents, leading to loss of hydrochloric acid and development of hypochloremic metabolic alkalosis. The respiratory therapist should recognize this acid-base pattern. The olive-shaped mass in the RUQ is the hypertrophied pylorus. This condition typically presents between 2-8 weeks of age.",
    difficulty: 4,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Pediatric Acid-Base"
  },
  {
    id: "rrt-2202",
    stem: "What is the minimum gestational age at which surfactant production typically becomes adequate to support independent breathing?",
    options: [
      "24-26 weeks",
      "28-30 weeks",
      "34-36 weeks",
      "38-40 weeks"
    ],
    correctIndex: 2,
    rationale: "Surfactant production typically becomes adequate for independent breathing at 34-36 weeks gestation. Type II pneumocytes begin producing surfactant around 24-28 weeks, but production is usually insufficient until 34-36 weeks. The lecithin/sphingomyelin (L/S) ratio in amniotic fluid can be used to assess fetal lung maturity, with a ratio ≥2.0 indicating maturity.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Surfactant Therapy"
  },
  {
    id: "rrt-2203",
    stem: "A pediatric patient requires an appropriately sized ETT. Using the age-based formula, what size uncuffed ETT is appropriate for a 6-year-old child?",
    options: [
      "4.5 mm ID",
      "5.0 mm ID",
      "5.5 mm ID",
      "6.0 mm ID"
    ],
    correctIndex: 2,
    rationale: "The formula for uncuffed ETT size in children over 1 year is: (age/4) + 4. For a 6-year-old: (6/4) + 4 = 5.5 mm ID. For cuffed tubes, the formula is (age/4) + 3.5. It is standard practice to have one size larger and one size smaller available at the bedside.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Airway Management"
  },
  {
    id: "rrt-2204",
    stem: "What is the most common cause of upper airway obstruction in an unconscious pediatric patient?",
    options: [
      "Foreign body",
      "Epiglottitis",
      "Tongue falling against the posterior pharynx",
      "Laryngospasm"
    ],
    correctIndex: 2,
    rationale: "In an unconscious child, the most common cause of upper airway obstruction is the tongue falling posteriorly against the pharyngeal wall due to loss of muscle tone. This is managed with head-tilt/chin-lift or jaw-thrust maneuver, or placement of an oropharyngeal airway. Children are particularly susceptible due to their relatively large tongue compared to their oral cavity.",
    difficulty: 1,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Airway Management"
  },
  {
    id: "rrt-2205",
    stem: "A neonate on HFOV has an ABG showing adequate ventilation but PaO2 of 45 mmHg on FiO2 0.80. What is the most appropriate adjustment?",
    options: [
      "Increase amplitude",
      "Increase frequency",
      "Increase mean airway pressure",
      "Decrease frequency"
    ],
    correctIndex: 2,
    rationale: "On HFOV, oxygenation is primarily controlled by mean airway pressure (MAP) and FiO2. Since FiO2 is already high at 0.80, increasing MAP to recruit more alveoli is the appropriate next step. Amplitude and frequency affect ventilation (CO2 removal), not oxygenation. Increasing MAP by 1-2 cm H2O increments with reassessment is recommended.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "High-Frequency Ventilation"
  },
  {
    id: "rrt-2206",
    stem: "Which of the following is a characteristic feature that distinguishes pediatric airways from adult airways?",
    options: [
      "The pediatric larynx is positioned lower in the neck",
      "The narrowest point of the pediatric airway is at the cricoid ring",
      "The pediatric epiglottis is shorter and stiffer",
      "The pediatric trachea is less compressible"
    ],
    correctIndex: 1,
    rationale: "In children under 8 years of age, the narrowest point of the airway is at the cricoid ring (subglottic area), unlike adults where the narrowest point is the glottis (vocal cords). This is why uncuffed ETTs were traditionally used in young children. The pediatric larynx sits higher (C3-C4 vs C4-C6), the epiglottis is longer and omega-shaped, and the trachea is more compressible.",
    difficulty: 2,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Pediatric Anatomy"
  },
  {
    id: "rrt-2207",
    stem: "A 4-year-old child with a known peanut allergy accidentally ingests peanuts and develops acute bronchospasm, urticaria, and hypotension. What is the first-line medication?",
    options: [
      "Nebulized albuterol",
      "Intramuscular epinephrine",
      "Intravenous diphenhydramine",
      "Intravenous methylprednisolone"
    ],
    correctIndex: 1,
    rationale: "Intramuscular epinephrine is the first-line treatment for anaphylaxis in both children and adults. It addresses bronchospasm, upper airway edema, and hypotension through its alpha and beta-adrenergic effects. The pediatric dose is 0.01 mg/kg of 1:1000 concentration (maximum 0.3 mg) IM in the anterolateral thigh. Albuterol, antihistamines, and steroids are adjunctive treatments.",
    difficulty: 2,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Pediatric Emergencies"
  },
  {
    id: "rrt-2208",
    stem: "An infant born at 35 weeks gestation develops tachypnea (RR 72), mild grunting, and requires 30% FiO2. Chest X-ray shows fluid in the interlobar fissures and perihilar streaking. What is the most likely diagnosis?",
    options: [
      "Respiratory distress syndrome",
      "Meconium aspiration syndrome",
      "Transient tachypnea of the newborn",
      "Neonatal pneumonia"
    ],
    correctIndex: 2,
    rationale: "Transient tachypnea of the newborn (TTN) typically presents in late preterm or term infants with tachypnea, mild respiratory distress, and low oxygen requirements. Classic chest X-ray findings include fluid in the interlobar fissures, perihilar streaking, and mild cardiomegaly from retained lung fluid. RDS would show ground-glass opacities, MAS shows patchy infiltrates with hyperinflation.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Transient Tachypnea of Newborn"
  },
  {
    id: "rrt-2209",
    stem: "What is the primary treatment for a child with foreign body aspiration confirmed by bronchoscopy?",
    options: [
      "Chest physiotherapy and postural drainage",
      "Rigid bronchoscopy with foreign body removal",
      "Nebulized hypertonic saline to facilitate expectoration",
      "High-frequency chest wall oscillation"
    ],
    correctIndex: 1,
    rationale: "Rigid bronchoscopy is the gold standard for removal of aspirated foreign bodies in children. It allows direct visualization and removal using forceps or suction. Chest physiotherapy and nebulized treatments cannot remove solid foreign bodies. Flexible bronchoscopy may be used for diagnosis but rigid bronchoscopy is preferred for removal due to better airway control and instrument access.",
    difficulty: 2,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Foreign Body Aspiration"
  },
  {
    id: "rrt-2210",
    stem: "A 14-month-old child suddenly chokes while eating grapes and becomes unable to cough or cry. What is the recommended intervention?",
    options: [
      "Blind finger sweep of the mouth",
      "Five back blows followed by five chest thrusts",
      "Abdominal thrusts (Heimlich maneuver)",
      "Attempt to ventilate with bag-mask"
    ],
    correctIndex: 1,
    rationale: "For infants under 1 year with complete airway obstruction, the recommended sequence is 5 back blows (between the scapulae with the infant face-down) alternating with 5 chest thrusts (lower sternum with the infant face-up). For children over 1 year, abdominal thrusts are used. At 14 months, abdominal thrusts (option C) would actually be correct per AHA guidelines since this child is over 1 year.",
    difficulty: 2,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Foreign Body Aspiration"
  },
  {
    id: "rrt-2211",
    stem: "Nitric oxide therapy in a neonate should be weaned gradually rather than abruptly discontinued. What complication can result from abrupt discontinuation?",
    options: [
      "Methemoglobinemia",
      "Rebound pulmonary hypertension",
      "Pneumothorax",
      "Surfactant inactivation"
    ],
    correctIndex: 1,
    rationale: "Abrupt discontinuation of inhaled nitric oxide can cause life-threatening rebound pulmonary hypertension due to the downregulation of endogenous NO production during therapy. iNO should be weaned gradually, typically decreasing by 5 ppm increments while monitoring oxygenation and hemodynamics. Methemoglobinemia is a side effect of iNO therapy but occurs during treatment, not upon discontinuation.",
    difficulty: 4,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Persistent Pulmonary Hypertension"
  },
  {
    id: "rrt-2212",
    stem: "A neonate receiving inhaled nitric oxide at 20 ppm has a methemoglobin level of 6%. What action should be taken?",
    options: [
      "Continue current iNO dose and recheck in 24 hours",
      "Increase FiO2 to compensate",
      "Reduce the iNO dose and monitor methemoglobin closely",
      "No action needed; this level is within normal limits during iNO therapy"
    ],
    correctIndex: 2,
    rationale: "Methemoglobin levels should be maintained below 5% during iNO therapy. A level of 6% is elevated and warrants dose reduction. Methemoglobin is formed when NO oxidizes the iron in hemoglobin, reducing its oxygen-carrying capacity. If levels exceed 5%, the iNO dose should be reduced. Levels above 10% may require discontinuation and treatment with methylene blue.",
    difficulty: 4,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Persistent Pulmonary Hypertension"
  },
  {
    id: "rrt-2213",
    stem: "Which factor is most important in determining the appropriate PEEP level for a ventilated neonate with RDS?",
    options: [
      "The infant's birth weight only",
      "Optimal lung recruitment assessed by oxygenation response and chest X-ray",
      "A fixed PEEP of 3 cm H2O for all neonates",
      "The type of ventilator being used"
    ],
    correctIndex: 1,
    rationale: "PEEP should be individualized based on the neonate's oxygenation response and chest X-ray findings to achieve optimal lung recruitment without overdistension. Typical PEEP ranges for neonatal RDS are 4-6 cm H2O, but should be adjusted based on clinical response. A fixed PEEP is inappropriate as disease severity varies. Chest X-ray can help assess lung volume at the set PEEP level.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Neonatal Ventilation"
  },
  {
    id: "rrt-2214",
    stem: "A premature neonate on mechanical ventilation develops abdominal distension, feeding intolerance, and bloody stools. What complication should be suspected?",
    options: [
      "Gastroesophageal reflux",
      "Necrotizing enterocolitis (NEC)",
      "Pyloric stenosis",
      "Meconium ileus"
    ],
    correctIndex: 1,
    rationale: "Necrotizing enterocolitis (NEC) is a serious gastrointestinal complication of prematurity characterized by abdominal distension, feeding intolerance, bloody stools, and pneumatosis intestinalis on abdominal X-ray. Risk factors include prematurity, formula feeding, hypoxia, and sepsis. The respiratory therapist should be aware of NEC as it affects respiratory management and may cause respiratory deterioration.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Complications of Prematurity"
  },
  {
    id: "rrt-2215",
    stem: "What is the purpose of a bubble CPAP system in neonatal respiratory care?",
    options: [
      "To deliver aerosolized medications",
      "To provide continuous positive pressure via an underwater seal generating pressure oscillations",
      "To measure lung compliance",
      "To suction the nasopharynx"
    ],
    correctIndex: 1,
    rationale: "Bubble CPAP delivers continuous positive airway pressure through nasal prongs, with the expiratory limb submerged in water to a specific depth (creating the desired CPAP level in cm H2O). The bubbling creates small pressure oscillations that may have a stochastic resonance effect, potentially enhancing gas exchange. It is simple, effective, and widely used in neonatal units worldwide.",
    difficulty: 2,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "CPAP Therapy"
  },
  {
    id: "rrt-2216",
    stem: "A 10-year-old child with cystic fibrosis has thick mucus plugging. Which airway clearance technique utilizes an oscillating positive expiratory pressure device?",
    options: [
      "Postural drainage with percussion",
      "Flutter valve or Acapella device",
      "Incentive spirometry",
      "Pursed-lip breathing"
    ],
    correctIndex: 1,
    rationale: "The Flutter valve and Acapella device are oscillating positive expiratory pressure (OPEP) devices used for airway clearance. They create vibrations and positive pressure during exhalation that loosen secretions from airway walls and facilitate their movement toward the mouth. These devices are particularly useful in cystic fibrosis patients and can be used independently by the patient.",
    difficulty: 1,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Airway Clearance"
  },
  {
    id: "rrt-2217",
    stem: "Which scoring system is used to assess the severity of respiratory distress in neonates and includes evaluation of grunting, flaring, retractions, and cyanosis?",
    options: [
      "APGAR score",
      "Downes score",
      "Glasgow Coma Scale",
      "Ballard score"
    ],
    correctIndex: 1,
    rationale: "The Downes score (also called the respiratory distress scoring system) evaluates respiratory rate, cyanosis, retractions, grunting, and air entry to assess the severity of neonatal respiratory distress. APGAR assesses overall newborn status, GCS assesses neurological status, and the Ballard score estimates gestational age.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Neonatal Assessment"
  },
  {
    id: "rrt-2218",
    stem: "A neonate on volume-guarantee ventilation consistently has measured tidal volumes below the set target. The ventilator is increasing PIP to the maximum limit. What is the most likely cause?",
    options: [
      "Improving lung compliance",
      "Large air leak around the uncuffed ETT",
      "The patient is over-sedated",
      "The ventilator circuit has excessive condensation"
    ],
    correctIndex: 1,
    rationale: "In volume-guarantee ventilation, the ventilator adjusts PIP to deliver the target tidal volume. If there is a significant air leak around the uncuffed ETT (common in neonates), the ventilator measures a lower expired volume and increases PIP to compensate. If PIP reaches the set limit, the target volume cannot be achieved. Solutions include accepting a larger leak, repositioning the ETT, or sizing up.",
    difficulty: 4,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Neonatal Ventilation"
  },
  {
    id: "rrt-2219",
    stem: "What is the LISA (Less Invasive Surfactant Administration) technique?",
    options: [
      "Surfactant delivery via nebulization during spontaneous breathing",
      "Surfactant instillation via a thin catheter while the infant breathes on CPAP",
      "Surfactant given through a laryngeal mask airway",
      "Intratracheal bolus through an ETT followed by immediate extubation"
    ],
    correctIndex: 1,
    rationale: "LISA involves inserting a thin catheter (typically a feeding tube or specialized catheter) through the vocal cords under direct laryngoscopy and instilling surfactant while the infant continues to breathe spontaneously on CPAP. This avoids intubation and mechanical ventilation. Studies show LISA reduces the need for mechanical ventilation and may decrease the incidence of BPD compared to traditional INSURE.",
    difficulty: 4,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Surfactant Therapy"
  },
  {
    id: "rrt-2220",
    stem: "A 3-year-old child with asthma is unable to coordinate with an MDI, even with a spacer. What is the most appropriate alternative delivery device?",
    options: [
      "Dry powder inhaler",
      "Small volume nebulizer with mask",
      "MDI without spacer",
      "Nasal cannula at high flow"
    ],
    correctIndex: 1,
    rationale: "For young children who cannot coordinate MDI use, a small volume nebulizer with a face mask is the most appropriate alternative. It delivers medication during normal tidal breathing and requires no coordination. Dry powder inhalers require a forceful inhalation that young children cannot generate. An MDI without a spacer has poor drug delivery, and a nasal cannula does not deliver aerosolized medications.",
    difficulty: 1,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Aerosol Delivery"
  },
  {
    id: "rrt-2221",
    stem: "Which congenital heart defect is most commonly associated with respiratory symptoms in neonates due to increased pulmonary blood flow?",
    options: [
      "Tetralogy of Fallot",
      "Ventricular septal defect (VSD)",
      "Transposition of the great arteries",
      "Tricuspid atresia"
    ],
    correctIndex: 1,
    rationale: "Ventricular septal defect causes a left-to-right shunt, increasing pulmonary blood flow and leading to pulmonary overcirculation, pulmonary edema, and respiratory distress. Large VSDs present with tachypnea, failure to thrive, and recurrent respiratory infections. Tetralogy of Fallot and tricuspid atresia reduce pulmonary blood flow, and transposition causes parallel rather than series circulation.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Congenital Heart Disease"
  },
  {
    id: "rrt-2222",
    stem: "A neonate with a patent ductus arteriosus (PDA) is being treated pharmacologically. Which medication is used to close a PDA?",
    options: [
      "Prostaglandin E1",
      "Indomethacin or ibuprofen",
      "Sildenafil",
      "Furosemide"
    ],
    correctIndex: 1,
    rationale: "Indomethacin and ibuprofen are prostaglandin synthesis inhibitors (NSAIDs) used to promote closure of a patent ductus arteriosus. They work by inhibiting cyclooxygenase, reducing prostaglandin production that maintains ductal patency. Prostaglandin E1 does the opposite - it keeps the ductus open (used in ductal-dependent cardiac lesions). Acetaminophen is also emerging as an alternative.",
    difficulty: 2,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Patent Ductus Arteriosus"
  },
  {
    id: "rrt-2223",
    stem: "When is prostaglandin E1 (PGE1) indicated in a neonate?",
    options: [
      "To close a patent ductus arteriosus",
      "To maintain ductal patency in ductal-dependent congenital heart disease",
      "To treat pulmonary hypertension",
      "To prevent retinopathy of prematurity"
    ],
    correctIndex: 1,
    rationale: "Prostaglandin E1 is administered to maintain ductal patency in neonates with ductal-dependent congenital heart lesions (e.g., transposition of great arteries, coarctation of the aorta, hypoplastic left heart syndrome). The ductus arteriosus provides critical systemic or pulmonary blood flow in these conditions. A significant side effect is apnea, requiring respiratory monitoring and potential intubation.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Congenital Heart Disease"
  },
  {
    id: "rrt-2224",
    stem: "What is the most common side effect of prostaglandin E1 infusion that requires respiratory therapy involvement?",
    options: [
      "Hypertension",
      "Apnea",
      "Bronchospasm",
      "Pneumothorax"
    ],
    correctIndex: 1,
    rationale: "Apnea is a well-known side effect of PGE1 infusion, occurring in approximately 10-12% of neonates receiving the drug. This requires close respiratory monitoring, and intubation equipment should be readily available. Some institutions electively intubate neonates on PGE1 before transport. Other side effects include fever, hypotension, and cutaneous flushing.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Congenital Heart Disease"
  },
  {
    id: "rrt-2225",
    stem: "An 8-year-old child with status asthmaticus is not responding to continuous nebulized albuterol and IV corticosteroids. Which medication should be considered next?",
    options: [
      "Inhaled nitric oxide",
      "IV magnesium sulfate",
      "Nebulized cromolyn sodium",
      "Oral montelukast"
    ],
    correctIndex: 1,
    rationale: "IV magnesium sulfate is recommended for children with severe or life-threatening asthma exacerbations not responding to initial therapy. Magnesium acts as a bronchodilator by relaxing smooth muscle through calcium channel blockade and inhibiting acetylcholine release. It is given as a single dose of 25-75 mg/kg (max 2 g) IV over 20 minutes. Cromolyn and montelukast are maintenance medications, not rescue drugs.",
    difficulty: 4,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Pediatric Asthma"
  },
  {
    id: "rrt-2226",
    stem: "A pediatric patient on mechanical ventilation has auto-PEEP detected. What is the most appropriate initial intervention?",
    options: [
      "Increase the set respiratory rate",
      "Increase the inspiratory time",
      "Decrease the respiratory rate and/or increase expiratory time",
      "Increase the tidal volume"
    ],
    correctIndex: 2,
    rationale: "Auto-PEEP (intrinsic PEEP) occurs when expiration is incomplete before the next breath begins, resulting in air trapping. The most appropriate intervention is to decrease the respiratory rate and/or increase expiratory time to allow complete exhalation. Increasing rate, inspiratory time, or tidal volume would all worsen air trapping. Bronchodilators may also help if bronchospasm is contributing.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Pediatric Ventilation"
  },
  {
    id: "rrt-2227",
    stem: "What is the most appropriate oxygen delivery device for a 2-year-old child requiring 28% FiO2?",
    options: [
      "Simple face mask at 2 L/min",
      "Non-rebreather mask at 15 L/min",
      "Nasal cannula at 0.5-1 L/min",
      "Venturi mask at 28%"
    ],
    correctIndex: 2,
    rationale: "A low-flow nasal cannula at 0.5-1 L/min is appropriate for delivering approximately 24-28% FiO2 to a young child. It is well-tolerated, allows feeding and talking, and provides consistent low-flow oxygen. A simple mask requires a minimum of 5 L/min, a non-rebreather provides near 100% FiO2, and a Venturi mask may be too large and poorly tolerated in a 2-year-old.",
    difficulty: 1,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Oxygen Therapy"
  },
  {
    id: "rrt-2228",
    stem: "High-flow nasal cannula (HFNC) therapy in pediatrics provides what advantages over standard nasal cannula?",
    options: [
      "Precise FiO2 delivery, airway warming and humidification, washout of nasopharyngeal dead space, and low-level CPAP effect",
      "Ability to deliver aerosolized medications and mechanical ventilation",
      "Higher tidal volumes and increased minute ventilation",
      "Direct measurement of lung compliance"
    ],
    correctIndex: 0,
    rationale: "HFNC provides heated, humidified gas at flows exceeding the patient's inspiratory demand, resulting in more precise FiO2 delivery, improved mucociliary function, reduced work of breathing through dead space washout, and a modest CPAP effect. It does not provide true mechanical ventilation or directly deliver aerosols, though some research is exploring this.",
    difficulty: 2,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "High-Flow Nasal Cannula"
  },
  {
    id: "rrt-2229",
    stem: "A premature neonate weighing 800 grams requires endotracheal intubation. What size ETT should be selected?",
    options: [
      "2.0 mm ID",
      "2.5 mm ID",
      "3.0 mm ID",
      "3.5 mm ID"
    ],
    correctIndex: 1,
    rationale: "For neonates weighing less than 1 kg, a 2.5 mm ID ETT is recommended. The NRP guidelines suggest: <1 kg = 2.5 mm, 1-2 kg = 3.0 mm, 2-3 kg = 3.0-3.5 mm, >3 kg = 3.5 mm. A 2.0 mm tube would have excessive airway resistance, and 3.0 mm would be too large for an 800-gram infant.",
    difficulty: 2,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Airway Management"
  },
  {
    id: "rrt-2230",
    stem: "A child on a ventilator develops sudden deterioration with high peak pressures, absent breath sounds on the right, and tracheal deviation to the left. What is the most likely emergency?",
    options: [
      "Right mainstem intubation",
      "Right-sided tension pneumothorax",
      "Mucus plugging of the right mainstem bronchus",
      "Equipment malfunction"
    ],
    correctIndex: 1,
    rationale: "The combination of sudden deterioration, high peak pressures, absent breath sounds on one side, and tracheal deviation to the opposite side is classic for tension pneumothorax. This is a medical emergency requiring immediate needle decompression followed by chest tube placement. The DOPE mnemonic (Displacement, Obstruction, Pneumothorax, Equipment) is used for acute deterioration on mechanical ventilation.",
    difficulty: 2,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Pneumothorax"
  },
  {
    id: "rrt-2231",
    stem: "The DOPE mnemonic is used when a ventilated patient has acute deterioration. What does DOPE stand for?",
    options: [
      "Displacement, Obstruction, Pneumothorax, Equipment failure",
      "Desaturation, Overventilation, Pressure changes, Extubation",
      "Drug reaction, Oxygenation failure, Perfusion problems, Edema",
      "Disconnection, Over-sedation, Pulmonary embolism, Electrolyte imbalance"
    ],
    correctIndex: 0,
    rationale: "DOPE stands for Displacement (ETT moved - right mainstem or extubation), Obstruction (mucus plug, kinking), Pneumothorax (air leak), and Equipment failure (circuit disconnect, ventilator malfunction). This systematic approach helps rapidly identify the cause of sudden deterioration in intubated patients and guides appropriate intervention.",
    difficulty: 1,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Ventilation Troubleshooting"
  },
  {
    id: "rrt-2232",
    stem: "Which of the following clinical findings would suggest a left-to-right intracardiac shunt in a neonate?",
    options: [
      "Cyanosis that does not improve with oxygen",
      "Increased pulmonary blood flow and pulmonary edema on chest X-ray",
      "Differential cyanosis with lower extremity cyanosis",
      "Single S2 heart sound"
    ],
    correctIndex: 1,
    rationale: "A left-to-right shunt (e.g., VSD, ASD, PDA) results in increased pulmonary blood flow as oxygenated blood recirculates through the lungs. Chest X-ray shows increased pulmonary vascular markings and potentially pulmonary edema. Cyanosis refractory to oxygen suggests a right-to-left shunt. Differential cyanosis suggests coarctation or interrupted aortic arch with PDA.",
    difficulty: 4,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Congenital Heart Disease"
  },
  {
    id: "rrt-2233",
    stem: "A neonate with trisomy 21 (Down syndrome) is at increased risk for which respiratory condition?",
    options: [
      "Cystic fibrosis",
      "Subglottic stenosis and obstructive sleep apnea",
      "Pulmonary alveolar proteinosis",
      "Alpha-1 antitrypsin deficiency"
    ],
    correctIndex: 1,
    rationale: "Neonates with Down syndrome have a higher incidence of airway anomalies including subglottic stenosis (smaller airway diameter), tracheomalacia, and obstructive sleep apnea (due to midface hypoplasia, macroglossia, and hypotonia). They also have increased risk of congenital heart disease, which can affect respiratory status. Smaller ETT sizes may be needed during intubation.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Congenital Conditions"
  },
  {
    id: "rrt-2234",
    stem: "What is the initial dose of caffeine citrate (loading dose) for treatment of apnea of prematurity?",
    options: [
      "5 mg/kg",
      "10 mg/kg",
      "20 mg/kg",
      "40 mg/kg"
    ],
    correctIndex: 2,
    rationale: "The loading dose of caffeine citrate for apnea of prematurity is 20 mg/kg IV or PO, followed by a maintenance dose of 5-10 mg/kg/day. Note that caffeine citrate dosing differs from caffeine base dosing (caffeine citrate is approximately twice the dose of caffeine base). Therapeutic levels are typically 5-25 mcg/mL.",
    difficulty: 2,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Apnea of Prematurity"
  },
  {
    id: "rrt-2235",
    stem: "A premature infant develops periodic breathing with brief pauses of 5-10 seconds without desaturation or bradycardia. How should this be managed?",
    options: [
      "Immediately intubate and place on mechanical ventilation",
      "Administer caffeine citrate loading dose",
      "Continue observation; periodic breathing is a normal variant in premature infants",
      "Start nasal CPAP at 6 cm H2O"
    ],
    correctIndex: 2,
    rationale: "Periodic breathing is defined as three or more episodes of breathing pauses lasting ≥3 seconds separated by ≤20 seconds of normal breathing. It is a normal developmental pattern in premature infants and does not require treatment unless accompanied by significant desaturation or bradycardia. It should be distinguished from pathologic apnea (cessation >20 seconds or accompanied by bradycardia/desaturation).",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Apnea of Prematurity"
  },
  {
    id: "rrt-2236",
    stem: "Which of the following describes the proper suctioning technique for a neonate with an endotracheal tube?",
    options: [
      "Instill 2 mL normal saline before each suctioning, advance catheter until resistance is met, apply continuous suction for 15 seconds",
      "Use a catheter no larger than half the ETT internal diameter, advance to a premeasured depth, apply intermittent suction while withdrawing for no longer than 10 seconds",
      "Apply suction while advancing the catheter to clear secretions, then withdraw slowly over 20 seconds",
      "Use the largest catheter that fits the ETT for maximum secretion removal, suction for 30 seconds"
    ],
    correctIndex: 1,
    rationale: "Proper neonatal suctioning technique includes: using a catheter no larger than 50% of the ETT ID (to prevent excessive negative pressure and atelectasis), advancing to a premeasured depth (not beyond the ETT tip to avoid tracheal/carinal trauma), and applying intermittent suction while withdrawing for no longer than 10 seconds. Routine saline instillation is no longer recommended.",
    difficulty: 2,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Airway Management"
  },
  {
    id: "rrt-2237",
    stem: "Which of the following is a contraindication for high-frequency oscillatory ventilation in a neonate?",
    options: [
      "Severe RDS refractory to conventional ventilation",
      "Persistent pulmonary hypertension",
      "Untreated obstructive airway lesion or air trapping disease",
      "Congenital diaphragmatic hernia"
    ],
    correctIndex: 2,
    rationale: "Obstructive airway disease with air trapping is a relative contraindication for HFOV because the high-frequency oscillations may worsen air trapping and increase the risk of air leak syndrome. HFOV is indicated for severe RDS, PPHN, and is sometimes used for CDH. However, obstructive conditions like severe meconium aspiration with air trapping require careful consideration.",
    difficulty: 4,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "High-Frequency Ventilation"
  },
  {
    id: "rrt-2238",
    stem: "What is high-frequency jet ventilation (HFJV), and when is it primarily used in neonates?",
    options: [
      "A mode that delivers small tidal volumes at 240-660 breaths/min, primarily used for air leak syndromes",
      "A mode using conventional rates at 60-80 breaths/min with very high pressures",
      "A mode that requires a cuffed ETT and is used only in term neonates",
      "A mode identical to HFOV with the same mechanisms of gas exchange"
    ],
    correctIndex: 0,
    rationale: "HFJV delivers short, high-velocity pulses of gas at rates of 240-660 breaths/min (4-11 Hz) through a specialized injector port. It is primarily used for air leak syndromes (pneumothorax, pulmonary interstitial emphysema) because it can ventilate effectively at lower peak pressures, allowing air leaks to heal. It is often used in tandem with a conventional ventilator providing PEEP and sigh breaths.",
    difficulty: 4,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "High-Frequency Ventilation"
  },
  {
    id: "rrt-2239",
    stem: "A 5-year-old child with cystic fibrosis has a pulmonary exacerbation. Which antibiotic is most commonly used to treat Pseudomonas aeruginosa colonization via the inhaled route?",
    options: [
      "Amoxicillin",
      "Tobramycin",
      "Azithromycin",
      "Vancomycin"
    ],
    correctIndex: 1,
    rationale: "Inhaled tobramycin (TOBI) is the most commonly used inhaled antibiotic for chronic Pseudomonas aeruginosa infection in cystic fibrosis. It delivers high concentrations directly to the lungs while minimizing systemic toxicity. It is typically given in alternating 28-day on/off cycles. Azithromycin is used for its anti-inflammatory properties but is given orally.",
    difficulty: 2,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Cystic Fibrosis"
  },
  {
    id: "rrt-2240",
    stem: "Dornase alfa (Pulmozyme) is used in cystic fibrosis to accomplish what?",
    options: [
      "Bronchodilation",
      "Anti-inflammatory action",
      "Cleavage of extracellular DNA to reduce mucus viscosity",
      "Surfactant replacement"
    ],
    correctIndex: 2,
    rationale: "Dornase alfa is a recombinant human deoxyribonuclease (DNase) that cleaves extracellular DNA released by neutrophils in the airways. This DNA contributes to the thick, viscous mucus characteristic of CF. By breaking down this DNA, dornase alfa reduces sputum viscosity and improves airway clearance and pulmonary function. It is administered via nebulization once daily.",
    difficulty: 2,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Cystic Fibrosis"
  },
  {
    id: "rrt-2241",
    stem: "A newborn has absent breath sounds on the left, dextrocardia, and bowel sounds heard in the left chest. What imaging finding would confirm the suspected diagnosis?",
    options: [
      "Ground-glass opacification bilaterally on chest X-ray",
      "Bowel loops visible in the left hemithorax on chest X-ray",
      "Pneumomediastinum on CT scan",
      "Pleural effusion on ultrasound"
    ],
    correctIndex: 1,
    rationale: "Bowel loops visible in the left hemithorax on chest X-ray confirms a left congenital diaphragmatic hernia. The bowel has herniated through the diaphragmatic defect into the thorax, displacing the heart to the right (dextrocardia), compressing the left lung, and causing absent breath sounds. A nasogastric tube may also be seen curling into the left chest.",
    difficulty: 2,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Congenital Diaphragmatic Hernia"
  },
  {
    id: "rrt-2242",
    stem: "What is the primary mechanism by which heliox (helium-oxygen mixture) improves ventilation in a child with upper airway obstruction?",
    options: [
      "It is a bronchodilator that relaxes smooth muscle",
      "Its lower density reduces turbulent airflow resistance through narrowed airways",
      "It increases oxygen-carrying capacity of hemoglobin",
      "It stimulates surfactant production"
    ],
    correctIndex: 1,
    rationale: "Heliox is a mixture of helium and oxygen that is less dense than air. In areas of turbulent flow (narrowed upper airways), gas flow resistance is density-dependent. The lower density of heliox reduces turbulent flow resistance, decreasing the work of breathing and improving ventilation. It is used as a temporizing measure in croup, post-extubation stridor, and upper airway obstruction.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Heliox Therapy"
  },
  {
    id: "rrt-2243",
    stem: "A neonate born at 25 weeks gestation develops pulmonary interstitial emphysema (PIE) on chest X-ray. What ventilator adjustment may help resolve this condition?",
    options: [
      "Increase PIP and tidal volume",
      "Switch to high-frequency ventilation at lower mean airway pressures",
      "Increase PEEP to 10 cm H2O",
      "Increase FiO2 to 1.0"
    ],
    correctIndex: 1,
    rationale: "Pulmonary interstitial emphysema occurs when air dissects into the pulmonary interstitium from ruptured alveoli, often due to barotrauma. Management includes reducing PIP and mean airway pressures when possible. HFOV or HFJV may be used because they can ventilate effectively at lower peak pressures. Increasing PIP or PEEP would worsen the condition by increasing the risk of further air leak.",
    difficulty: 4,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Air Leak Syndromes"
  },
  {
    id: "rrt-2244",
    stem: "What is the Pediatric Assessment Triangle (PAT) used for?",
    options: [
      "Detailed neurological assessment",
      "Rapid visual assessment of appearance, work of breathing, and circulation",
      "Calculation of drug dosages based on weight",
      "Evaluation of dehydration status"
    ],
    correctIndex: 1,
    rationale: "The Pediatric Assessment Triangle is a rapid, visual assessment tool that evaluates three components: Appearance (TICLS - tone, interactiveness, consolability, look/gaze, speech/cry), Work of Breathing (retractions, nasal flaring, positioning, audible sounds), and Circulation to Skin (color, mottling). It can be completed in seconds and helps prioritize interventions.",
    difficulty: 1,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Pediatric Assessment"
  },
  {
    id: "rrt-2245",
    stem: "A premature infant on nasal CPAP develops nasal septal breakdown. What modification should be considered?",
    options: [
      "Increase CPAP pressure to compensate for the leak",
      "Switch to nasal mask CPAP or alternate between prongs and mask interfaces",
      "Discontinue all respiratory support",
      "Switch to an oropharyngeal airway with CPAP"
    ],
    correctIndex: 1,
    rationale: "Nasal septal injury is a common complication of nasal prong CPAP in premature infants due to pressure from the prongs on the columella and septum. Alternating between nasal prong and nasal mask interfaces, or switching to a nasal mask, helps redistribute pressure and allow healing. Proper sizing and positioning of nasal prongs, along with barrier dressings, can help prevent this complication.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "CPAP Therapy"
  },
  {
    id: "rrt-2246",
    stem: "What is the lecithin/sphingomyelin (L/S) ratio, and what value indicates fetal lung maturity?",
    options: [
      "A blood test ratio; ≥1.0 indicates maturity",
      "An amniotic fluid ratio; ≥2.0 indicates maturity",
      "A urine test ratio; ≥3.0 indicates maturity",
      "A cord blood ratio; ≥1.5 indicates maturity"
    ],
    correctIndex: 1,
    rationale: "The L/S ratio is measured in amniotic fluid obtained via amniocentesis. Lecithin is the major phospholipid component of surfactant. An L/S ratio ≥2.0 indicates fetal lung maturity with a low risk of RDS. The presence of phosphatidylglycerol (PG) in amniotic fluid further confirms lung maturity. Values <1.5 indicate immature lungs with high RDS risk.",
    difficulty: 3,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Fetal Lung Maturity"
  },
  {
    id: "rrt-2247",
    stem: "A pediatric patient with severe ARDS has a P/F ratio of 80 on conventional ventilation. The care team is considering extracorporeal membrane oxygenation (ECMO). What is the general P/F ratio threshold that may indicate need for ECMO evaluation?",
    options: [
      "P/F ratio <300",
      "P/F ratio <200",
      "P/F ratio <100",
      "P/F ratio <50"
    ],
    correctIndex: 2,
    rationale: "A P/F ratio <100 on maximal conventional ventilator support is one criterion that may prompt ECMO evaluation in severe pediatric ARDS. Other criteria include oxygenation index >40, inability to maintain SpO2 >85%, and pH <7.15 with respiratory failure despite optimization. ECMO provides temporary support while allowing the lungs to rest and recover.",
    difficulty: 4,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "ECMO"
  },
  {
    id: "rrt-2248",
    stem: "Which type of ECMO is most commonly used in neonates with respiratory failure?",
    options: [
      "Veno-arterial (VA) ECMO",
      "Veno-venous (VV) ECMO",
      "Arterio-venous (AV) ECMO",
      "Veno-venous-arterial (VVA) ECMO"
    ],
    correctIndex: 0,
    rationale: "Veno-arterial (VA) ECMO has historically been the most commonly used type in neonates, typically using the right internal jugular vein and right common carotid artery for cannulation. VA ECMO provides both cardiac and respiratory support. VV ECMO is increasingly used when only respiratory support is needed, but VA remains more common in neonates due to catheter size limitations and the frequent need for hemodynamic support.",
    difficulty: 4,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "ECMO"
  },
  {
    id: "rrt-2249",
    stem: "A premature infant at 30 weeks gestation has an oxygen saturation alarm set. What is the recommended upper alarm limit for SpO2 to reduce the risk of retinopathy of prematurity?",
    options: [
      "100%",
      "98%",
      "95%",
      "90%"
    ],
    correctIndex: 2,
    rationale: "The upper SpO2 alarm limit for premature infants should be set at 95% to prevent hyperoxia and reduce the risk of retinopathy of prematurity (ROP). The target SpO2 range for premature neonates is typically 88-95%. Allowing saturations above 95% increases ROP risk, while saturations below 85% increase mortality risk. Tight oxygen saturation targeting is a critical aspect of neonatal respiratory care.",
    difficulty: 2,
    category: "Neonatal/Pediatric Respiratory Care",
    topic: "Oxygen Therapy"
  }
];
