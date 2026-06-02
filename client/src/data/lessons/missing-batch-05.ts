import type { LessonContent } from "./types";

export const missingBatch05Lessons: Record<string, LessonContent> = {
  "rn-botulism": {
    title: "Botulism",
    cellular: { title: "Pathophysiology of Botulism", content: "Botulism is caused by the neurotoxin produced by the bacterium Clostridium botulinum, which is an anaerobic, gram-positive bacillus. The toxin interferes with the release of acetylcholine at the neuromuscular junction, leading to flaccid paralysis. This blockage prevents muscle contraction, resulting in weakness and paralysis of the voluntary muscles. The toxin may enter the body through contaminated food, wounds, or in infants through ingestion of spores. In the gastrointestinal tract, proteolytic enzymes release the toxin, which then spreads through the bloodstream to peripheral nerves. Symptoms may begin within 12 to 36 hours after exposure, as the toxin's action leads to descending paralysis, affecting cranial nerves first, which can lead to respiratory failure if untreated." },
    riskFactors: ["Improperly preserved or canned foods", "Infant exposure to honey", "Wound infections in IV drug users", "Unpasteurized dairy products", "Older adults with weakened immune systems", "Recent surgical procedures involving the gastrointestinal tract"],
    diagnostics: ["Assess for history of contaminated food consumption", "Monitor for clinical signs of paralysis", "Expect laboratory confirmation of C. botulinum toxin", "Assess cranial nerve function", "Monitor respiratory status for signs of compromise", "Expect imaging studies to rule out other causes of symptoms"],
    management: ["Administer botulinum antitoxin as prescribed", "Provide respiratory support if indicated", "Implement enteral feeding if swallowing is impaired", "Educate patients on food safety practices", "Monitor vital signs closely", "Ensure proper wound care to prevent infection"],
    nursingActions: ["Assess neurological status every 1-2 hours", "Monitor respiratory rate and effort continuously", "Evaluate swallow function before oral intake", "Document onset and progression of symptoms", "Assess for potential complications, such as aspiration", "Educate the patient and family on signs of worsening condition"],
    pearls: ["Botulism is a medical emergency; prompt recognition and treatment are critical.", "Avoid honey in infants under 1 year to prevent infant botulism.", "Educate about safe food handling and canning practices to prevent outbreaks."],
    signs: {
      left: ["Generalized weakness", "Double vision", "Difficulty swallowing", "Slurred speech"],
      right: ["Respiratory failure", "Flaccid paralysis", "Fixed dilated pupils", "Cardiovascular instability"]
    },
    medications: [
      { name: "Botulinum Antitoxin", type: "Antitoxin", action: "Neutralizes circulating botulinum toxin", sideEffects: "Allergic reactions", contra: "History of hypersensitivity to the antitoxin", pearl: "Administer as soon as botulism is suspected for best outcomes" },
      { name: "Supportive Care Medications", type: "Various", action: "Manage symptoms and complications", sideEffects: "Varies by medication", contra: "Depends on specific medication used", pearl: "Use minimally effective doses to avoid exacerbating respiratory depression" },
    ],
    quiz: [
      { question: "What is the primary mechanism of action of botulinum toxin?", options: ["Inhibits acetylcholine release", "Stimulates muscle contraction", "Increases neurotransmitter release", "Blocks dopamine receptors"], correct: 0, rationale: "Botulinum toxin inhibits acetylcholine release at the neuromuscular junction, leading to paralysis. The other options do not accurately describe its action." },
      { question: "Which sign would indicate worsening condition in a patient with botulism?", options: ["Improved muscle strength", "Decreased respiratory effort", "Increased heart rate", "Clear speech"], correct: 1, rationale: "Decreased respiratory effort is a critical sign of worsening condition in botulism, indicating respiratory failure. The other options suggest improvement." },
    ],
  },
  "rn-bronchiolitis": {
    title: "Bronchiolitis",
    cellular: { title: "Pathophysiology of Bronchiolitis", content: "Bronchiolitis is primarily caused by viral infections, most commonly Respiratory Syncytial Virus (RSV) in infants and young children. The pathophysiology begins with the virus infecting the epithelial cells of the bronchioles, leading to cell death and inflammation. This inflammatory response results in the accumulation of mucus, edema, and necrosis in the small airways, causing airway obstruction. The obstruction leads to air trapping and atelectasis, which further impairs gas exchange. Clinically, this process manifests as wheezing, increased work of breathing, and hypoxemia. In severe cases, the inflammatory response can lead to respiratory failure, requiring hospitalization and supportive care." },
    riskFactors: ["Age under 2 years", "Prematurity", "Exposure to tobacco smoke", "Concurrent respiratory infections", "Immunocompromised status", "Crowded living conditions", "Lack of breastfeeding"],
    diagnostics: ["Monitor respiratory rate and effort", "Expect hypoxia on pulse oximetry", "Assess for wheezing and crackles on auscultation", "Evaluate hydration status through intake and output", "Perform nasal swab for viral testing", "Assess for signs of respiratory distress", "Monitor vital signs for fever and tachycardia"],
    management: ["Provide supplemental oxygen as needed", "Administer bronchodilators per protocol", "Encourage fluid intake to prevent dehydration", "Teach parents about signs of respiratory distress", "Implement humidified oxygen therapy", "Position patient to optimize breathing", "Administer antipyretics for fever management"],
    nursingActions: ["Assess vital signs every 2-4 hours", "Monitor oxygen saturation levels and report < 92%", "Document respiratory assessments every shift", "Perform chest physiotherapy as ordered", "Educate caregivers on home care and follow-up", "Evaluate response to bronchodilator therapy", "Observe for signs of dehydration (e.g., dry mucous membranes)"],
    pearls: ["RSV is the most common cause of bronchiolitis in infants.", "Supportive care is the mainstay of treatment.", "Early recognition of respiratory distress is crucial.", "Parental education on recognizing worsening symptoms is essential."],
    signs: {
      left: ["Mild wheezing", "Increased respiratory rate", "Low-grade fever", "Nasal congestion"],
      right: ["Severe respiratory distress", "Hypoxia (< 90% saturation)", "Cyanosis", "Apnea or respiratory failure"]
    },
    medications: [
      { name: "Albuterol", type: "Bronchodilator", action: "Relaxes bronchial smooth muscle", sideEffects: "Tachycardia", contra: "History of severe cardiac disease", pearl: "Use a spacer for optimal delivery in children." },
      { name: "Ribavirin", type: "Antiviral", action: "Inhibits viral replication", sideEffects: "Hemolytic anemia", contra: "Pregnancy", pearl: "Use in severe cases of RSV bronchiolitis." },
    ],
    quiz: [
      { question: "What is the most common viral cause of bronchiolitis in infants?", options: ["A) Influenza virus", "B) Respiratory Syncytial Virus (RSV)", "C) Adenovirus", "D) Rhinovirus"], correct: 1, rationale: "B is correct as RSV is the leading cause of bronchiolitis in infants, while the other options are less common causes." },
      { question: "Which nursing action is most critical when caring for a child with bronchiolitis?", options: ["A) Administer antihistamines", "B) Monitor oxygen saturation levels", "C) Encourage solid food intake", "D) Provide a warm environment"], correct: 1, rationale: "B is correct because monitoring oxygen levels is essential for assessing the child's respiratory status and ensuring adequate oxygenation." },
    ],
  },
  "rn-cardiac-dysrhythmias": {
    title: "Cardiac Dysrhythmias",
    cellular: { title: "Pathophysiology of Cardiac Dysrhythmias", content: "Cardiac dysrhythmias arise from disturbances in the conduction system of the heart, affecting the normal rhythm and rate of cardiac contractions. At the cellular level, dysrhythmias occur due to alterations in ion channel function, leading to abnormal depolarization and repolarization processes. These alterations can be caused by ischemia, electrolyte imbalances (such as hyperkalemia or hypokalemia), or structural heart disease. For instance, ischemic damage to myocardial tissue can disrupt the electrical pathways, resulting in arrhythmias such as atrial fibrillation or ventricular tachycardia. Additionally, changes in automaticity, triggered activity, or re-entry mechanisms can further exacerbate dysrhythmias. The resultant electrical instability can lead to inadequate cardiac output, potentially resulting in decreased perfusion to vital organs." },
    riskFactors: ["Coronary artery disease", "Hypertension", "Heart failure", "Electrolyte imbalances", "Cardiac surgery", "Use of stimulants (caffeine, nicotine)", "Structural heart defects", "Family history of dysrhythmias"],
    diagnostics: ["Monitor heart rate and rhythm via ECG", "Expect abnormal ECG findings", "Assess for signs of decreased cardiac output", "Evaluate electrolyte levels (K+, Mg2+)", "Monitor blood pressure", "Assess patient for symptoms of palpitations", "Expect Holter monitor results for transient dysrhythmias", "Monitor for signs of syncope"],
    management: ["Administer prescribed antiarrhythmic medications", "Educate patient about lifestyle modifications", "Provide continuous cardiac monitoring", "Prepare for potential cardioversion if indicated", "Implement patient safety measures (e.g., fall precautions)", "Collaborate with the healthcare team for potential interventions", "Assess response to treatment and adjust plan accordingly", "Document findings and interventions"],
    nursingActions: ["Assess heart rate and rhythm every 4 hours", "Monitor vital signs every 1-2 hours as needed", "Evaluate patient’s response to medications (e.g., improvement in rhythm)", "Assess for chest pain or discomfort", "Monitor for signs of hypotension (BP <90/60 mmHg)", "Document all arrhythmic events and interventions", "Educate patient on recognizing warning signs of dysrhythmias", "Encourage adherence to prescribed medication regimen"],
    pearls: ["Always assess for potential causes of dysrhythmias", "Prioritize patient safety during episodes of dysrhythmias", "Educate patients on lifestyle changes to manage risk factors", "Continuous monitoring is key in managing patients with dysrhythmias"],
    signs: {
      left: ["Palpitations", "Dizziness", "Fatigue", "Mild chest discomfort"],
      right: ["Severe chest pain", "Loss of consciousness", "Rapid or irregular heartbeat", "Signs of shock (e.g., cool, clammy skin)"]
    },
    medications: [
      { name: "Adenosine", type: "Antiarrhythmic", action: "Slows conduction through the AV node", sideEffects: "Transient asystole", contra: "Second or third-degree AV block", pearl: "Administer rapidly via IV push followed by a flush" },
      { name: "Amiodarone", type: "Antiarrhythmic", action: "Prolongs the cardiac action potential and refractory period", sideEffects: "Pulmonary toxicity", contra: "Severe bradycardia", pearl: "Monitor for thyroid dysfunction due to iodine content" },
      { name: "Digoxin", type: "Cardiac glycoside", action: "Increases myocardial contractility and decreases heart rate", sideEffects: "Nausea and visual disturbances", contra: "Ventricular fibrillation", pearl: "Monitor digoxin levels and potassium levels" },
    ],
    quiz: [
      { question: "What is the priority nursing action for a patient experiencing ventricular tachycardia?", options: ["Administer adenosine", "Prepare for defibrillation", "Start IV fluids", "Perform a cardiac assessment"], correct: 1, rationale: "Defibrillation is critical in life-threatening arrhythmias like ventricular tachycardia to restore normal rhythm, while administering adenosine is appropriate for SVT, not VT." },
      { question: "Which medication is contraindicated in patients with a history of second-degree heart block?", options: ["Amiodarone", "Adenosine", "Digoxin", "Atropine"], correct: 2, rationale: "Digoxin can exacerbate heart block and is contraindicated in patients with significant AV block, while amiodarone and adenosine can be used cautiously." },
    ],
  },
  "rn-chronic-bronchitis": {
    title: "Chronic Bronchitis",
    cellular: { title: "Pathophysiology of Chronic Bronchitis", content: "Chronic bronchitis is characterized by the chronic inflammation of the bronchi, leading to excessive mucus production, airway obstruction, and difficulty with airflow. At the cellular level, exposure to irritants such as cigarette smoke or environmental pollutants triggers an inflammatory response. This response involves the activation of inflammatory mediators, leading to the recruitment of neutrophils and macrophages to the airways. Goblet cells become hyperplastic, resulting in increased mucus secretion, while ciliary function is impaired, reducing mucociliary clearance. The bronchioles undergo structural changes, including fibrosis and narrowing, which further obstruct airflow, especially during expiration. Over time, these pathological changes contribute to the characteristic symptoms of chronic bronchitis, such as chronic cough, sputum production, and dyspnea." },
    riskFactors: ["Cigarette smoking", "Occupational exposure to dust and chemicals", "Air pollution", "Recurrent respiratory infections", "Genetic predisposition (e.g., alpha-1 antitrypsin deficiency)", "Age over 40 years", "Chronic exposure to indoor pollutants (e.g., biomass fuel)"],
    diagnostics: ["Assess respiratory rate and pattern", "Monitor oxygen saturation levels", "Expect increased sputum production", "Assess lung sounds for wheezing or rhonchi", "Obtain a chest X-ray to identify changes", "Perform pulmonary function tests (PFTs) to evaluate airflow obstruction", "Monitor arterial blood gases (ABGs) for respiratory acidosis"],
    management: ["Administer bronchodilators as prescribed to relieve bronchospasm", "Encourage smoking cessation programs for patients who smoke", "Provide oxygen therapy as indicated to maintain oxygen saturation above 92%", "Instruct on proper inhaler technique to enhance medication delivery", "Encourage hydration to thin mucus secretions", "Teach effective coughing techniques to aid in mucus clearance"],
    nursingActions: ["Assess lung sounds every shift and report significant changes", "Monitor vital signs, especially respiratory rate and effort", "Educate patients on recognizing early signs of exacerbation", "Encourage participation in pulmonary rehabilitation programs", "Evaluate the effectiveness of bronchodilator therapy using peak flow measurements", "Document sputum characteristics and amount daily"],
    pearls: ["Chronic bronchitis is often referred to as 'blue bloater' due to cyanosis and obesity.", "Avoiding triggers and smoking cessation are crucial in managing chronic bronchitis.", "Encourage patients to get vaccinated against influenza and pneumonia to prevent exacerbations.", "Educate patients on the importance of adherence to prescribed medications."],
    signs: {
      left: ["Chronic productive cough", "Sputum production, especially in the morning", "Mild dyspnea on exertion", "Wheezing or rhonchi on auscultation"],
      right: ["Severe shortness of breath at rest", "Cyanosis (bluish discoloration of lips/fingers)", "Confusion or altered mental status", "Use of accessory muscles for breathing"]
    },
    medications: [
      { name: "Albuterol", type: "Bronchodilator (Beta-2 agonist)", action: "Relaxes bronchial smooth muscle and dilates airways", sideEffects: "Tachycardia", contra: "Hypersensitivity to albuterol", pearl: "Monitor heart rate; may cause palpitations." },
      { name: "Ipratropium", type: "Anticholinergic", action: "Inhibits bronchoconstriction by blocking muscarinic receptors", sideEffects: "Dry mouth", contra: "Glaucoma (caution with nebulizer use)", pearl: "May take several doses to achieve full effect." },
      { name: "Theophylline", type: "Methylxanthine", action: "Relaxes bronchial smooth muscle and decreases inflammation", sideEffects: "Nausea and increased heart rate", contra: "Active peptic ulcer disease", pearl: "Monitor serum levels; narrow therapeutic index." },
    ],
    quiz: [
      { question: "Which of the following is a classic symptom of chronic bronchitis?", options: ["Severe shortness of breath at rest", "Productive cough with sputum", "Wheezing only during exercise", "Cyanosis of the extremities"], correct: 1, rationale: "A productive cough with sputum is a hallmark of chronic bronchitis, while severe shortness of breath and cyanosis are more indicative of acute exacerbations." },
      { question: "What is the primary action of bronchodilators in managing chronic bronchitis?", options: ["Reduce inflammation in the lungs", "Increase mucus production", "Relax bronchial smooth muscle", "Enhance ciliary function"], correct: 2, rationale: "Bronchodilators primarily work by relaxing bronchial smooth muscle, leading to improved airflow and reduced dyspnea." },
    ],
  },
  "rn-chronic-obstructive-pulmonary-disease": {
    title: "Chronic Obstructive Pulmonary Disease",
    cellular: { title: "Pathophysiology of COPD", content: "Chronic Obstructive Pulmonary Disease (COPD) primarily comprises two conditions: emphysema and chronic bronchitis. At the cellular level, COPD is characterized by oxidative stress, inflammation, and destruction of lung parenchyma. In emphysema, protease-antiprotease imbalance leads to the degradation of elastin fibers in the alveoli, resulting in air trapping and reduced surface area for gas exchange. In chronic bronchitis, prolonged exposure to irritants causes hypersecretion of mucus, inflammation, and airway narrowing due to bronchial wall thickening. The inflammatory response activates neutrophils and macrophages, releasing cytokines and proteases that perpetuate lung damage. Consequently, patients experience progressive airflow limitation, impaired gas exchange, and increased work of breathing, leading to symptoms such as dyspnea, chronic cough, and sputum production." },
    riskFactors: ["Smoking history", "Exposure to air pollutants", "Genetic predisposition (e.g., alpha-1 antitrypsin deficiency)", "Occupational dust and chemicals", "Age over 40", "Frequent respiratory infections", "Low socioeconomic status", "History of asthma"],
    diagnostics: ["Monitor spirometry results for FEV1/FVC ratio < 70%", "Expect chest X-ray showing hyperinflation", "Assess arterial blood gases for hypoxemia and hypercapnia", "Evaluate complete blood count for polycythemia", "Monitor oxygen saturation levels", "Assess for respiratory acidosis on blood gas analysis", "Expect to find increased total lung capacity on pulmonary function tests"],
    management: ["Administer bronchodilators as prescribed", "Encourage smoking cessation programs", "Provide oxygen therapy to maintain SpO2 between 88-92%", "Educate on inhaler techniques", "Instruct on breathing exercises (e.g., pursed-lip breathing)", "Promote pulmonary rehabilitation programs", "Administer corticosteroids for acute exacerbations", "Encourage adequate hydration to thin secretions"],
    nursingActions: ["Assess respiratory rate and pattern every 4 hours", "Monitor heart rate and rhythm for arrhythmias", "Evaluate breath sounds for wheezing or diminished sounds", "Document sputum characteristics daily", "Measure peak flow rates daily", "Educate patients on recognizing early signs of exacerbation"],
    pearls: ["COPD is a progressive disease; early intervention can slow progression.", "Prioritize smoking cessation in all COPD patients.", "Use a combination of bronchodilators for better symptom control.", "Educate patients on recognizing signs of exacerbation for timely management."],
    signs: {
      left: ["Chronic cough", "Sputum production", "Wheezing", "Dyspnea on exertion"],
      right: ["Severe dyspnea at rest", "Cyanosis", "Confusion or altered mental status", "Use of accessory muscles for breathing"]
    },
    medications: [
      { name: "Albuterol", type: "Bronchodilator", action: "Stimulates beta-2 adrenergic receptors causing bronchodilation", sideEffects: "Tachycardia", contra: "Hypersensitivity to albuterol", pearl: "Use as a rescue inhaler for acute symptoms" },
      { name: "Tiotropium", type: "Anticholinergic", action: "Inhibits acetylcholine at muscarinic receptors, leading to bronchodilation", sideEffects: "Dry mouth", contra: "Glaucoma", pearl: "Once-daily dosing improves adherence" },
      { name: "Prednisone", type: "Corticosteroid", action: "Reduces inflammation in the airways", sideEffects: "Hyperglycemia", contra: "Systemic fungal infections", pearl: "Taper dosage to prevent adrenal insufficiency" },
    ],
    quiz: [
      { question: "What is the primary mechanism of action for tiotropium in COPD management?", options: ["Inhibits leukotriene synthesis", "Stimulates beta-2 receptors", "Inhibits acetylcholine at muscarinic receptors", "Reduces mucus production"], correct: 2, rationale: "Tiotropium works by inhibiting acetylcholine, leading to bronchodilation, while the other options describe different mechanisms." },
      { question: "Which symptom is characteristic of late-stage COPD?", options: ["Chronic cough", "Sputum production", "Cyanosis", "Wheezing"], correct: 2, rationale: "Cyanosis indicates severe hypoxemia and is a sign of late-stage COPD, while the other symptoms are more common in earlier stages." },
    ],
  },
  "rn-cleft-palate": {
    title: "Cleft Palate",
    cellular: { title: "Pathophysiology of Cleft Palate", content: "Cleft palate is a congenital condition resulting from the failure of the palatine processes to fuse during embryonic development, typically occurring between the 6th and 10th week of gestation. This failure leads to an opening or gap in the roof of the mouth, which can vary in severity, affecting the hard palate, soft palate, or both. At the cellular level, the disruption in the normal migration and proliferation of mesenchymal cells contributes to this defect. Genetic factors, environmental influences, and teratogens can play roles in the etiology of cleft palate. The presence of a cleft palate can lead to complications such as feeding difficulties, speech problems, recurrent ear infections, and an increased risk for dental issues. Early identification and intervention are crucial for optimizing outcomes and facilitating normal development." },
    riskFactors: ["Family history of cleft palate", "Maternal smoking during pregnancy", "Maternal diabetes", "Use of certain medications during pregnancy", "Advanced maternal age", "Nutritional deficiencies in pregnancy", "Exposure to environmental toxins"],
    diagnostics: ["Assess for visible cleft on assessment", "Monitor feeding patterns for difficulties", "Expect referral to a pediatric specialist", "Assess for signs of aspiration during feeding", "Monitor weight gain and growth patterns", "Evaluate for recurrent otitis media"],
    management: ["Provide education on feeding techniques", "Coordinate multidisciplinary care with speech and feeding therapists", "Administer prescribed medications for ear infections", "Encourage parental bonding and support", "Facilitate surgical referral for repair", "Promote nutritional support and hydration"],
    nursingActions: ["Assess the infant's ability to latch and suck during feeding", "Monitor for signs of aspiration, such as coughing or choking", "Evaluate growth parameters at each visit", "Document and report any feeding difficulties to the healthcare provider", "Instruct parents on proper feeding positions", "Provide emotional support to the family regarding the diagnosis"],
    pearls: ["Early intervention is critical for optimal outcomes.", "Multidisciplinary care is essential for managing cleft palate.", "Educate families about feeding strategies to prevent aspiration.", "Regular follow-up is necessary to monitor growth and development."],
    signs: {
      left: ["Visible cleft or gap in the palate", "Difficulty feeding", "Coughing or choking during feeds", "Foul-smelling breath"],
      right: ["Severe respiratory distress", "Inability to gain weight", "Signs of dehydration", "Frequent aspirational pneumonia"]
    },
    medications: [
      { name: "Amoxicillin", type: "Antibiotic", action: "Inhibits bacterial cell wall synthesis", sideEffects: "Rash", contra: "Allergy to penicillin", pearl: "Monitor for allergic reactions in patients with a history of allergies." },
      { name: "Acetaminophen", type: "Analgesic", action: "Inhibits prostaglandin synthesis", sideEffects: "Liver toxicity with overdose", contra: "Severe liver disease", pearl: "Be cautious with dosing, especially in infants." },
    ],
    quiz: [
      { question: "What is the primary risk factor for cleft palate?", options: ["Maternal smoking", "Advanced paternal age", "High maternal socioeconomic status", "Increased infant weight"], correct: 0, rationale: "Maternal smoking is a well-known risk factor for cleft palate; the other options do not have a strong association." },
      { question: "Which nursing action is a priority for an infant with a cleft palate?", options: ["Assess for signs of respiratory distress", "Provide parent education on feeding techniques", "Monitor weight gain", "Schedule follow-up surgery"], correct: 0, rationale: "Assessing for signs of respiratory distress is vital due to the risk of aspiration; while the other actions are important, they are secondary to immediate safety." },
    ],
  },
  "rn-conversion-disorder": {
    title: "Conversion Disorder",
    cellular: { title: "Pathophysiology of Conversion Disorder", content: "Conversion disorder, also known as functional neurological symptom disorder, is characterized by the presence of neurological symptoms that cannot be explained by medical or neurological conditions. At the cellular level, it is hypothesized that psychological stressors lead to altered brain function, particularly in areas responsible for motor control and sensory processing. Neuroimaging studies have shown changes in brain activity in response to emotional stimuli, which may result in the conversion of psychological distress into physical symptoms. The exact mechanisms remain unclear but may involve dysregulation of neural circuits and neurotransmitter systems, particularly the integration of emotional and sensory information. This disorder can manifest with a variety of symptoms including paralysis, tremors, or non-epileptic seizures, reflecting a disruption in the normal functioning of motor and sensory pathways." },
    riskFactors: ["History of trauma or abuse", "High levels of stress or anxiety", "Comorbid psychiatric disorders", "Neurological illness in the past", "Dissociative disorders", "Lack of social support", "Recent significant life changes", "Substance abuse history"],
    diagnostics: ["Assess neurological function thoroughly", "Monitor for non-organic neurological symptoms", "Expect to rule out other medical conditions", "Evaluate psychosocial history for stressors", "Conduct a physical examination to identify inconsistencies", "Review previous medical records for similar presentations"],
    management: ["Provide psychoeducation about the disorder", "Facilitate referrals to mental health services", "Encourage participation in physical therapy", "Implement coping strategies for stress management", "Collaborate with interdisciplinary team for holistic care", "Support gradual re-engagement in daily activities"],
    nursingActions: ["Assess mental status and level of distress regularly", "Monitor vital signs for signs of anxiety or panic", "Document the onset and progression of symptoms", "Encourage open communication about feelings and experiences", "Establish a trusting nurse-patient relationship", "Educate patients on the nature of conversion disorder"],
    pearls: ["Always consider psychological factors in unexplained symptoms.", "Establish a therapeutic relationship to support patient trust.", "Interdisciplinary collaboration enhances patient outcomes.", "Educate patients that symptoms are real but not linked to a medical condition."],
    signs: {
      left: ["Sudden onset of motor/sensory symptoms", "Inconsistent symptoms with known medical conditions", "Physical symptoms that follow psychological stressors", "Lack of concern or 'la belle indifference'"],
      right: ["Persistent symptoms leading to severe functional impairment", "Presence of non-epileptic seizures", "Severe pain without a clear medical cause", "Acute crisis or suicidal ideation"]
    },
    medications: [
      { name: "Fluoxetine", type: "SSRI", action: "Increases serotonin levels to help with mood regulation", sideEffects: "Nausea and sexual dysfunction", contra: "Concurrent use of MAOIs", pearl: "Consider starting at a low dose for gradual titration." },
      { name: "Sertraline", type: "SSRI", action: "Inhibits serotonin reuptake to improve mood and decrease anxiety", sideEffects: "Drowsiness and gastrointestinal upset", contra: "History of hypersensitivity to sertraline", pearl: "Monitor for increased anxiety during initiation of therapy." },
    ],
    quiz: [
      { question: "Which of the following is a characteristic sign of conversion disorder?", options: ["Inconsistent neurological symptoms", "Severe organic pathology", "Positive neurological tests", "Persistent headache"], correct: 0, rationale: "Inconsistent neurological symptoms are indicative of conversion disorder, while the other options suggest clear organic pathology." },
      { question: "What is the priority nursing action for a patient with conversion disorder?", options: ["Educate about the disorder", "Monitor vital signs", "Provide emotional support", "Encourage physical activity"], correct: 3, rationale: "While all actions are important, encouraging physical activity helps the patient regain function and reduces dependence on symptoms." },
    ],
  },
  "rn-coronary-artery-aneurysm": {
    title: "Coronary Artery Aneurysm",
    cellular: { title: "Pathophysiology of Coronary Artery Aneurysm", content: "A coronary artery aneurysm is a localized dilation of a coronary artery that occurs due to weakened vessel walls. This weakness may arise from various factors, including atherosclerosis, inflammatory diseases, or genetic conditions. At the cellular level, the structural integrity of the arterial wall is compromised, primarily affecting the tunica media, which is comprised of smooth muscle cells and elastin fibers. As the vessel wall weakens, it is unable to withstand normal hemodynamic pressures, leading to bulging and potential rupture. The inflammatory process can lead to further degradation of the extracellular matrix, contributing to the aneurysm's expansion. Additionally, turbulent blood flow at the site of the aneurysm can predispose to thrombus formation, further complicating the patient's condition. Monitoring for ischemia due to compromised blood flow distal to the aneurysm is critical in managing these patients." },
    riskFactors: ["Atherosclerosis", "Hypertension", "Genetic connective tissue disorders", "Previous myocardial infarction", "Smoking", "Hyperlipidemia", "Chronic inflammatory diseases", "Age over 60"],
    diagnostics: ["Monitor blood pressure for hypertension", "Assess for chest pain or discomfort", "Expect echocardiogram results for aneurysm size", "Evaluate coronary angiography findings", "Monitor cardiac biomarkers for ischemia", "Assess ECG changes for ischemic patterns"],
    management: ["Administer prescribed antihypertensives", "Provide education on lifestyle modifications", "Prepare patient for possible surgical intervention", "Administer antiplatelet medications as ordered", "Monitor vital signs closely", "Maintain a calm environment to reduce stress", "Facilitate referral to cardiology for further evaluation"],
    nursingActions: ["Assess vital signs, including heart rate and blood pressure, every 15 minutes if unstable", "Monitor ECG continuously for arrhythmias", "Assess for signs of myocardial ischemia, such as chest pain", "Evaluate peripheral perfusion and pulses", "Administer medications as prescribed and monitor their effects", "Educate the patient on recognizing signs of complications", "Document any changes in the patient's condition promptly"],
    pearls: ["Early detection is key to preventing rupture.", "Patient education on risk factors can help in management.", "Regular follow-ups with cardiology are essential.", "Understand the importance of lifestyle changes in preventing progression."],
    signs: {
      left: ["Mild chest pain", "Shortness of breath", "Fatigue", "Lightheadedness"],
      right: ["Severe chest pain", "Hypotension", "Signs of myocardial infarction", "Loss of consciousness"]
    },
    medications: [
      { name: "Aspirin", type: "Antiplatelet", action: "Inhibits platelet aggregation", sideEffects: "Gastrointestinal bleeding", contra: "Active peptic ulcer disease", pearl: "Monitor for signs of bleeding and educate patient on signs to report." },
      { name: "Beta-blockers", type: "Antihypertensive", action: "Reduces heart rate and myocardial oxygen demand", sideEffects: "Bradycardia", contra: "Asthma or COPD", pearl: "Monitor heart rate; hold if <60 bpm." },
      { name: "ACE inhibitors", type: "Antihypertensive", action: "Reduces systemic vascular resistance", sideEffects: "Cough", contra: "Angioedema history", pearl: "Monitor renal function and potassium levels." },
    ],
    quiz: [
      { question: "What is the primary risk factor for developing a coronary artery aneurysm?", options: ["Genetic disorders", "Hypertension", "Smoking", "High cholesterol"], correct: 1, rationale: "Hypertension is a significant risk factor that increases the pressure within the arteries, contributing to the formation of an aneurysm. While all options can contribute, hypertension is particularly critical." },
      { question: "Which medication is primarily used to prevent thrombus formation in patients with coronary artery aneurysm?", options: ["Beta-blockers", "ACE inhibitors", "Aspirin", "Statins"], correct: 2, rationale: "Aspirin is an antiplatelet medication that helps prevent thrombus formation, which is essential in managing coronary artery aneurysms. Beta-blockers and ACE inhibitors serve different purposes." },
    ],
  },
  "rn-cystic-fibrosis": {
    title: "Cystic Fibrosis",
    cellular: { title: "Pathophysiology of Cystic Fibrosis", content: "Cystic Fibrosis (CF) is a genetic disorder caused by mutations in the cystic fibrosis transmembrane conductance regulator (CFTR) gene, leading to dysfunctional chloride channels primarily in epithelial cells. This results in the production of thick, viscous secretions in various organs, particularly the lungs, pancreas, and intestines. In the lungs, obstructed airways trap bacteria, leading to chronic infections, inflammation, and progressive lung damage. In the pancreas, thick secretions obstruct the pancreatic ducts, impairing digestive enzyme release, which leads to malabsorption of nutrients. The accumulation of mucus in other organs such as the liver and intestines causes additional complications. Over time, this systemic involvement leads to significant morbidity and mortality, necessitating a comprehensive management approach." },
    riskFactors: ["Family history of cystic fibrosis", "Mutation in CFTR gene", "Ethnicity (Caucasians at higher risk)", "Being of Northern European descent", "History of meconium ileus at birth", "Chronic respiratory infections in childhood"],
    diagnostics: ["Monitor sweat chloride test results", "Assess pulmonary function tests (PFTs)", "Expect chest X-ray abnormalities (hyperinflation, bronchiectasis)", "Monitor nutritional status and growth parameters", "Assess for pancreatic function tests (stool fat tests)", "Evaluate genetic testing for CFTR mutations"],
    management: ["Administer bronchodilators as prescribed", "Implement airway clearance techniques (e.g., chest physiotherapy)", "Provide pancreatic enzyme replacement therapy with meals", "Encourage high-calorie, high-protein diet", "Administer antibiotics for respiratory infections", "Educate about infection control practices"],
    nursingActions: ["Assess respiratory status (O2 saturation, breath sounds) at least every shift", "Monitor for signs of respiratory distress (tachypnea, use of accessory muscles)", "Evaluate nutritional intake and growth patterns regularly", "Provide patient education on CF management and lifestyle modifications", "Assess for abdominal pain or changes in stool consistency", "Monitor for signs of diabetes and conduct blood glucose assessments"],
    pearls: ["Early detection through newborn screening is crucial for management.", "Multidisciplinary approach (pulmonologist, dietitian, physiotherapist) enhances care.", "Regular monitoring of lung function is essential to adjust treatment.", "Patient education on self-management and infection control is vital."],
    signs: {
      left: ["Persistent cough with thick sputum", "Frequent lung infections", "Poor weight gain despite a good appetite", "Salty-tasting skin"],
      right: ["Severe respiratory distress (cyanosis, tachycardia)", "Frequent hospitalizations for pulmonary exacerbations", "Diabetes complications (e.g., ketoacidosis)", "Intestinal obstruction (severe abdominal pain, distension)"]
    },
    medications: [
      { name: "Dornase alfa", type: "Mucolytic", action: "Breaks down DNA in mucus, reducing viscosity", sideEffects: "Pharyngitis", contra: "Hypersensitivity to the drug", pearl: "Administer via nebulizer; monitor for respiratory improvement." },
      { name: "Pancrelipase", type: "Digestive enzyme", action: "Replaces pancreatic enzymes to aid digestion", sideEffects: "Abdominal discomfort, diarrhea", contra: "Acute pancreatitis", pearl: "Administer with meals and snacks for optimal absorption." },
      { name: "Azithromycin", type: "Antibiotic", action: "Reduces inflammation and bacterial load in lungs", sideEffects: "Gastrointestinal upset", contra: "Hypersensitivity to macrolides", pearl: "Long-term use may improve lung function." },
    ],
    quiz: [
      { question: "What is the primary defect in cystic fibrosis?", options: ["A. Defective insulin production", "B. Dysfunctional chloride channels", "C. Abnormal hemoglobin synthesis", "D. Impaired platelet function"], correct: 1, rationale: "B is correct as CF is caused by mutations in the CFTR gene leading to dysfunctional chloride channels. A, C, and D are not related to CF pathology." },
      { question: "Which of the following is a common sign of cystic fibrosis in children?", options: ["A. Frequent headaches", "B. Salty skin", "C. Low blood pressure", "D. Rapid weight loss"], correct: 1, rationale: "B is correct as salty skin is a hallmark sign of CF due to elevated sweat chloride levels. A, C, and D are not characteristic of CF." },
    ],
  },
  "rn-emphysema": {
    title: "Emphysema",
    cellular: { title: "Pathophysiology of Emphysema", content: "Emphysema is a chronic obstructive pulmonary disease (COPD) characterized by the destruction of alveolar walls, leading to decreased surface area for gas exchange. This destruction is primarily caused by long-term exposure to irritants, particularly cigarette smoke, which triggers an inflammatory response. Proteolytic enzymes such as elastase are released, which break down elastin, a key protein in alveolar structure. Loss of elastin results in the enlargement of air spaces and the formation of bullae, impairing airflow during expiration. As a consequence, patients experience air trapping, decreased oxygenation, and increased work of breathing. The body compensates initially with increased respiratory rate and use of accessory muscles, but over time, this leads to respiratory fatigue and hypoxemia. Additionally, the chronic inflammation contributes to mucus hypersecretion, further obstructing airways. This pathophysiological process underscores the importance of early detection and management in preventing disease progression." },
    riskFactors: ["Smoking", "Environmental pollutants", "Occupational exposure to dust and chemicals", "Genetic factors (e.g., alpha-1 antitrypsin deficiency)", "History of respiratory infections", "Age (typically > 40 years)", "Sedentary lifestyle"],
    diagnostics: ["Assess lung function using spirometry", "Monitor arterial blood gases (ABGs)", "Expect decreased FEV1/FVC ratio", "Assess chest X-ray for hyperinflation", "Monitor oxygen saturation levels", "Expect increased residual volume on pulmonary function tests"],
    management: ["Administer bronchodilators as prescribed", "Encourage smoking cessation programs", "Educate on the use of inhalers and proper technique", "Implement pulmonary rehabilitation", "Provide supplemental oxygen therapy as needed", "Encourage adequate hydration to thin secretions", "Promote effective coughing techniques"],
    nursingActions: ["Assess respiratory rate and effort every 2 hours", "Monitor oxygen saturation, maintaining > 90% target", "Evaluate lung sounds for wheezing or diminished breath sounds", "Document any changes in patient’s condition", "Educate patients on recognizing exacerbation signs", "Encourage participation in physical activity as tolerated"],
    pearls: ["Emphysema is often part of a broader COPD syndrome.", "Smoking cessation is the most effective intervention to slow progression.", "Long-acting bronchodilators are preferred for better control of symptoms.", "Monitor for signs of respiratory failure in advanced disease."],
    signs: {
      left: ["Chronic cough", "Dyspnea on exertion", "Wheezing", "Increased sputum production"],
      right: ["Severe shortness of breath at rest", "Cyanosis of lips or fingers", "Confusion or altered mental status", "Pursed-lip breathing"]
    },
    medications: [
      { name: "Albuterol", type: "Bronchodilator", action: "Relaxes bronchial smooth muscle, leading to bronchodilation", sideEffects: "Tachycardia", contra: "Hypersensitivity to the drug", pearl: "Use a spacer for better medication delivery" },
      { name: "Tiotropium", type: "Anticholinergic", action: "Inhibits bronchoconstriction by blocking acetylcholine", sideEffects: "Dry mouth", contra: "Glaucoma", pearl: "Once daily dosing improves adherence" },
      { name: "Inhaled corticosteroids (e.g., fluticasone)", type: "Anti-inflammatory", action: "Reduces airway inflammation", sideEffects: "Oral thrush", contra: "Active infection", pearl: "Rinse mouth after use to prevent thrush" },
    ],
    quiz: [
      { question: "What is the primary pathophysiological change in emphysema?", options: ["Increased mucus production", "Destruction of alveoli", "Bronchial constriction", "Pulmonary hypertension"], correct: 1, rationale: "Destruction of alveoli is the hallmark of emphysema, unlike the other options which are more relevant to other conditions." },
      { question: "Which medication is considered a first-line treatment for acute bronchodilation in emphysema?", options: ["Tiotropium", "Fluticasone", "Albuterol", "Montelukast"], correct: 2, rationale: "Albuterol is a short-acting bronchodilator used for rapid relief of bronchospasm, while Tiotropium is used for maintenance." },
    ],
  },
};
