import type { LessonContent } from "./types";

export const missingBatch10Lessons: Record<string, LessonContent> = {
  "rn-pulmonary-stenosis": {
    title: "Pulmonary Stenosis",
    cellular: { title: "Pathophysiology of Pulmonary Stenosis", content: "Pulmonary stenosis is a congenital heart defect characterized by the narrowing of the outflow tract from the right ventricle to the pulmonary artery. This obstruction increases resistance to right ventricular outflow, leading to right ventricular hypertrophy as the heart compensates for the increased workload. As the right ventricle struggles to pump blood through the narrowed passage, pressure builds up in the chamber, which can result in decreased cardiac output and eventual heart failure. The severity of the stenosis can vary; mild cases may be asymptomatic, while severe cases can lead to significant clinical manifestations early in life. Over time, chronic pressure overload can cause right ventricular dilation and potentially arrhythmias. The condition is often associated with other congenital anomalies, such as atrial septal defects or ventricular septal defects. Management typically involves monitoring and potential surgical intervention to relieve the obstruction and restore normal blood flow." },
    riskFactors: ["Congenital heart defects", "Family history of heart disease", "Maternal rubella infection during pregnancy", "Down syndrome or Noonan syndrome", "Advanced maternal age", "Diabetes in the mother"],
    diagnostics: ["Obtain a detailed patient history", "Perform a physical examination", "Order a chest X-ray to assess heart size", "Conduct an ECG to detect right ventricular hypertrophy", "Request an echocardiogram to visualize the obstruction", "Measure oxygen saturation levels to evaluate for cyanosis", "Perform a cardiac catheterization if indicated"],
    management: ["Monitor vital signs and oxygen saturation continuously", "Administer diuretics to manage fluid overload", "Provide supplemental oxygen as needed", "Prepare for potential balloon valvuloplasty", "Educate the family about the condition and treatment options", "Coordinate with a pediatric cardiologist for ongoing care", "Consider surgical intervention for severe cases"],
    nursingActions: ["Assess for signs of right heart failure", "Monitor for symptoms of decreased cardiac output", "Evaluate growth and development in pediatric patients", "Educate the patient and family on medication adherence", "Document changes in symptoms and report to the healthcare team", "Prepare the patient for diagnostic procedures as needed", "Provide emotional support to the family"],
    pearls: ["Pulmonary stenosis can be asymptomatic in mild cases.", "Early detection is crucial to prevent complications.", "A systolic ejection murmur is a key clinical finding.", "Management may require interdisciplinary collaboration."],
    signs: {
      left: ["Murmur on auscultation (systolic ejection murmur)", "Fatigue during exertion", "Cyanosis (if severe)", "Shortness of breath on exertion"],
      right: ["Severe cyanosis", "Syncope or presyncope", "Signs of right heart failure (e.g., peripheral edema)", "Arrhythmias or palpitations"]
    },
    medications: [
      { name: "Furosemide", type: "Diuretic", action: "Reduces fluid overload by promoting diuresis", sideEffects: "Dehydration, electrolyte imbalances, hypotension", contra: "Anuria, hypersensitivity to sulfonamides", pearl: "Monitor electrolytes closely during therapy." },
      { name: "Digoxin", type: "Cardiac glycoside", action: "Increases contractility and decreases heart rate", sideEffects: "Nausea, vomiting, bradycardia", contra: "Ventricular fibrillation, hypersensitivity", pearl: "Monitor for signs of digoxin toxicity." },
    ],
    quiz: [
      { question: "What is the primary assessment finding associated with pulmonary stenosis?", options: ["Diastolic murmur", "Systolic ejection murmur", "Gallop rhythm", "High-pitched wheezing"], correct: 1, rationale: "A systolic ejection murmur is the characteristic auscultatory finding due to increased flow across a narrowed outflow tract." },
      { question: "Which medication is commonly used to manage fluid overload in patients with pulmonary stenosis?", options: ["Amiodarone", "Furosemide", "Digoxin", "Aspirin"], correct: 1, rationale: "Furosemide is a loop diuretic that effectively reduces fluid overload by promoting diuresis, making it essential in managing this condition." },
    ],
  },
  "rn-respiratory-syncytial-virus-infection": {
    title: "RSV Infection",
    cellular: { title: "Pathophysiology of RSV Infection", content: "Respiratory Syncytial Virus (RSV) is a common respiratory virus that primarily affects infants and young children. It is characterized by its ability to infect the epithelial cells of the respiratory tract, leading to inflammation and obstruction of the airways. The virus spreads through respiratory droplets and can survive on surfaces, making it easily transmissible. Once inhaled, RSV attaches to the respiratory epithelial cells, causing cell fusion and the formation of multinucleated giant cells. The resulting inflammatory response leads to increased mucus production, airway edema, and bronchoconstriction. Clinically, RSV presents with symptoms ranging from mild cold-like signs to severe respiratory distress, particularly in high-risk populations such as premature infants or those with underlying health conditions. The immune response typically involves both humoral and cell-mediated immunity, but it may be insufficient in younger populations, leading to more severe disease progression. Understanding the pathophysiology of RSV is crucial for effective diagnosis and management." },
    riskFactors: ["Premature birth", "Chronic lung disease", "Congenital heart defects", "Immunocompromised state", "Exposure to secondhand smoke", "Age < 2 years"],
    diagnostics: ["Obtain nasopharyngeal swab for PCR testing", "Conduct rapid RSV antigen testing", "Perform chest X-ray to assess for hyperinflation", "Measure oxygen saturation levels", "Evaluate complete blood count (CBC) for leukocytosis", "Assess respiratory rate and effort"],
    management: ["Provide supportive care including oxygen therapy", "Administer bronchodilators as needed", "Ensure adequate hydration and nutrition", "Consider ribavirin for high-risk patients", "Implement isolation precautions to prevent spread", "Monitor vital signs closely for changes"],
    nursingActions: ["Assess respiratory status frequently, including lung sounds", "Monitor oxygen saturation levels continuously", "Educate caregivers on recognizing early signs of distress", "Administer prescribed medications and monitor for effectiveness", "Encourage fluid intake to prevent dehydration", "Document changes in the patient’s condition promptly"],
    pearls: ["RSV can lead to severe bronchiolitis in infants, requiring careful monitoring.", "Supportive care is the primary treatment; antiviral therapy is reserved for high-risk patients.", "Preventive measures include palivizumab for at-risk infants during RSV season."],
    signs: {
      left: ["Mild cough", "Nasal congestion", "Fever", "Wheezing"],
      right: ["Severe respiratory distress", "Cyanosis", "Apnea", "Decreased level of consciousness"]
    },
    medications: [
      { name: "Ribavirin", type: "Antiviral", action: "Inhibits viral replication", sideEffects: "Hemolytic anemia, respiratory irritation", contra: "Pregnancy, severe anemia", pearl: "Use cautiously in patients with underlying pulmonary conditions." },
      { name: "Albuterol", type: "Bronchodilator", action: "Relaxes bronchial smooth muscle", sideEffects: "Tachycardia, jitteriness", contra: "Hypersensitivity to the drug", pearl: "Monitor heart rate before and after administration." },
    ],
    quiz: [
      { question: "What is the primary mode of transmission for Respiratory Syncytial Virus (RSV)?", options: ["Airborne droplets", "Direct contact", "Fecal-oral route", "Respiratory droplets"], correct: 3, rationale: "RSV is primarily transmitted through respiratory droplets when an infected person coughs or sneezes." },
      { question: "Which of the following is a common early sign of RSV infection in infants?", options: ["Severe respiratory distress", "Cyanosis", "Mild cough", "Apnea"], correct: 2, rationale: "A mild cough is often one of the first symptoms seen in infants with RSV infection." },
    ],
  },
  "rn-right-ventricular-hypertrophy": {
    title: "Right Ventricular Hypertrophy",
    cellular: { title: "Pathophysiology of Right Ventricular Hypertrophy", content: "Right ventricular hypertrophy (RVH) occurs when the right ventricle (RV) of the heart undergoes structural changes due to increased workload. This condition is primarily caused by chronic pressure overload, often attributed to pulmonary hypertension or left heart failure. The heart muscle responds to the heightened demands by increasing in size and mass, a process known as hypertrophy. As the RV thickens, its ability to effectively pump blood into the pulmonary circulation may diminish, leading to compromised cardiac output. This condition can further contribute to right-sided heart failure as the heart struggles to maintain adequate perfusion. Over time, the hypertrophied muscle may become less compliant and more susceptible to ischemia, leading to arrhythmias and increased morbidity. Understanding the underlying mechanisms of RVH is crucial for effective management and treatment of patients experiencing this condition." },
    riskFactors: ["Chronic obstructive pulmonary disease (COPD)", "Pulmonary hypertension", "Obstructive sleep apnea", "Congenital heart defects", "Left heart failure", "Cor pulmonale"],
    diagnostics: ["Obtain a detailed patient history", "Perform a thorough physical examination", "Order an electrocardiogram (ECG)", "Request an echocardiogram", "Measure serum B-type natriuretic peptide (BNP) levels", "Conduct a chest X-ray", "Evaluate pulmonary function tests (PFTs)"],
    management: ["Address underlying causes (e.g., manage COPD)", "Implement lifestyle modifications (e.g., smoking cessation)", "Initiate diuretic therapy for fluid overload", "Consider pulmonary vasodilators (e.g., sildenafil)", "Monitor for arrhythmias", "Educate the patient on symptom management", "Schedule regular follow-ups for monitoring"],
    nursingActions: ["Conduct regular assessments of heart and lung sounds", "Monitor vital signs and oxygen saturation frequently", "Evaluate for signs of right-sided heart failure (e.g., edema)", "Administer medications as prescribed and monitor for side effects", "Educate the patient on recognizing signs of worsening condition", "Document changes in symptoms and response to treatment"],
    pearls: ["RVH often indicates underlying cardiac issues; always assess the patient's history.", "Monitoring BNP levels can help evaluate the severity of heart failure.", "Educating patients on lifestyle changes is crucial for management.", "Regular follow-ups are essential to prevent complications."],
    signs: {
      left: ["Fatigue", "Shortness of breath with exertion", "Palpitations", "Mild peripheral edema"],
      right: ["Severe peripheral edema", "Jugular venous distention", "Ascites", "Cyanosis or signs of shock"]
    },
    medications: [
      { name: "Sildenafil", type: "Pulmonary vasodilator", action: "Relaxes blood vessels in the lungs to lower pulmonary arterial pressure", sideEffects: "Headache, flushing, dyspepsia, visual disturbances", contra: "Nitrate use, severe hypotension", pearl: "Monitor blood pressure closely when administering." },
      { name: "Furosemide", type: "Diuretic", action: "Reduces fluid overload by promoting renal excretion of water and electrolytes", sideEffects: "Dehydration, electrolyte imbalances, hypotension", contra: "Anuria, hypersensitivity to sulfonamides", pearl: "Assess renal function before and during therapy." },
    ],
    quiz: [
      { question: "What is a common cause of right ventricular hypertrophy?", options: ["A. Aortic stenosis", "B. Pulmonary hypertension", "C. Myocardial infarction", "D. Mitral regurgitation"], correct: 1, rationale: "Pulmonary hypertension leads to increased pressure in the right ventricle, causing hypertrophy." },
      { question: "Which medication is classified as a pulmonary vasodilator used in RVH management?", options: ["A. Furosemide", "B. Sildenafil", "C. Carvedilol", "D. Atorvastatin"], correct: 1, rationale: "Sildenafil is used to reduce pulmonary arterial pressure, which can help manage RVH." },
    ],
  },
  "rn-septic-arthritis": {
    title: "Septic Arthritis",
    cellular: { title: "Pathophysiology of Septic Arthritis", content: "Septic arthritis is a joint infection primarily caused by bacteria, most commonly Staphylococcus aureus. The infection may arise from direct inoculation (e.g., trauma or surgery) or hematogenous spread from a distant site. Once the pathogen enters the joint space, it triggers an inflammatory response characterized by the influx of neutrophils and other immune cells, leading to synovial membrane inflammation, joint effusion, and cartilage degradation. The resulting purulent material can cause increased joint pressure, pain, and dysfunction. If not treated promptly, septic arthritis can lead to joint destruction and systemic complications such as sepsis. Risk factors include immunosuppression, diabetes, and previous joint disease, making timely diagnosis and intervention critical to prevent long-term morbidity." },
    riskFactors: ["Immunocompromised state", "History of joint disease (e.g., rheumatoid arthritis)", "Recent joint surgery or trauma", "Diabetes mellitus", "Age over 60", "Intravenous drug use", "Chronic kidney disease", "Skin infections"],
    diagnostics: ["Obtain joint aspiration for synovial fluid analysis", "Perform blood cultures to identify causative organisms", "Order complete blood count (CBC) for leukocytosis", "Conduct C-reactive protein (CRP) and erythrocyte sedimentation rate (ESR) tests", "Order X-rays to assess joint damage or effusion", "Consider MRI for detailed joint imaging", "Evaluate for other infections in the body", "Conduct ultrasound for guided aspiration if necessary"],
    management: ["Initiate intravenous antibiotics based on culture results", "Perform joint aspiration to relieve pressure and obtain fluid", "Administer analgesics and anti-inflammatory medications", "Consider surgical intervention for severe cases (e.g., arthroscopy or open drainage)", "Monitor vital signs and signs of systemic infection", "Educate the patient on joint care and rehabilitation", "Ensure adequate hydration and nutrition", "Plan for follow-up evaluations to monitor recovery"],
    nursingActions: ["Assess the affected joint for swelling and tenderness", "Monitor temperature and signs of systemic infection", "Evaluate pain levels using a standardized scale", "Document joint mobility and function regularly", "Educate the patient on the importance of medication adherence", "Facilitate joint rest and elevation as needed", "Coordinate care with physical therapy for rehabilitation", "Provide emotional support and address patient concerns"],
    pearls: ["Early identification and treatment are key to preventing joint damage.", "Joint aspiration can provide both diagnostic and therapeutic benefits.", "Educate patients about the importance of completing the full course of antibiotics.", "Be vigilant for signs of systemic infection, as septic arthritis can lead to sepsis."],
    signs: {
      left: ["Localized joint swelling", "Increased warmth over the joint", "Limited range of motion", "Fever or chills"],
      right: ["Severe joint pain on movement", "Pus or fluid drainage from the joint", "Persistent fever despite treatment", "Signs of systemic shock (e.g., altered mental status, hypotension)"]
    },
    medications: [
      { name: "Ceftriaxone", type: "Antibiotic", action: "Inhibits bacterial cell wall synthesis.", sideEffects: "Diarrhea, rash, allergic reactions, superinfection.", contra: "Hypersensitivity to cephalosporins.", pearl: "Effective against Gram-negative bacteria." },
      { name: "Vancomycin", type: "Glycopeptide antibiotic", action: "Inhibits bacterial cell wall synthesis, effective against MRSA.", sideEffects: "Nephrotoxicity, ototoxicity, red man syndrome.", contra: "Hypersensitivity to vancomycin.", pearl: "Monitor trough levels to avoid toxicity." },
    ],
    quiz: [
      { question: "What is the most common causative organism in septic arthritis?", options: ["Escherichia coli", "Staphylococcus aureus", "Streptococcus pneumoniae", "Pseudomonas aeruginosa"], correct: 1, rationale: "Staphylococcus aureus is the most frequently identified pathogen in cases of septic arthritis." },
      { question: "Which of the following is a late sign of septic arthritis?", options: ["Localized joint swelling", "Increased warmth over the joint", "Severe joint pain on movement", "Signs of systemic shock"], correct: 3, rationale: "Signs of systemic shock indicate a severe progression of septic arthritis and potential sepsis." },
    ],
  },
  "rn-sequestration-crisis": {
    title: "Sequestration Crisis",
    cellular: { title: "Pathophysiology of Sequestration Crisis", content: "Sequestration crisis is a life-threatening complication primarily seen in patients with sickle cell disease, where sickled red blood cells obstruct microvasculature leading to inadequate blood flow to organs. This obstruction results in tissue ischemia and damage due to decreased oxygen delivery. The spleen is particularly vulnerable, as it sequesters sickled cells, causing splenic enlargement and hypoxia. This crisis can lead to hemolytic anemia due to the rapid breakdown of red blood cells and may also cause severe pain, fever, and potential organ dysfunction. In children, repeated crises may lead to functional asplenia, increasing the risk for infections. The clinical picture is often characterized by abdominal pain, splenic enlargement, and symptoms of shock as blood volume decreases." },
    riskFactors: ["Sickle cell disease", "Dehydration", "Infections", "Extreme temperatures", "High altitude", "Physical exertion"],
    diagnostics: ["Obtain complete blood count (CBC)", "Assess reticulocyte count", "Perform peripheral blood smear", "Measure serum bilirubin levels", "Evaluate liver function tests", "Conduct a chest X-ray"],
    management: ["Administer intravenous fluids for hydration", "Provide oxygen therapy to improve oxygenation", "Initiate pain management with analgesics", "Transfusion of red blood cells if indicated", "Monitor vital signs closely for changes", "Administer antibiotics for suspected infections"],
    nursingActions: ["Perform regular assessments of vital signs", "Monitor for signs of shock or organ dysfunction", "Maintain IV access for fluid and medication administration", "Educate patient on hydration and avoidance of triggers", "Collaborate with the healthcare team for transfusion therapy", "Document changes in pain levels and manage accordingly"],
    pearls: ["Early intervention is key in managing sequestration crisis.", "Hydration can significantly reduce the frequency of crises.", "Educate patients on recognizing early symptoms to seek timely care."],
    signs: {
      left: ["Abdominal pain", "Splenic tenderness or enlargement", "Fever", "Tachycardia"],
      right: ["Severe hypotension", "Altered mental status", "Signs of shock", "Severe respiratory distress"]
    },
    medications: [
      { name: "Hydroxyurea", type: "Antineoplastic agent", action: "Increases fetal hemoglobin levels, reducing sickling episodes", sideEffects: "Bone marrow suppression, gastrointestinal upset", contra: "Pregnancy, active malignancy", pearl: "Consider for long-term management in chronic sickle cell patients." },
      { name: "Opioids (e.g., Morphine)", type: "Analgesic", action: "Provides pain relief by acting on the central nervous system", sideEffects: "Respiratory depression, constipation, sedation", contra: "Severe respiratory disorders", pearl: "Use cautiously and monitor for signs of overdose." },
    ],
    quiz: [
      { question: "What is the primary pathophysiological mechanism of a sequestration crisis in sickle cell disease?", options: ["Formation of antibodies against red blood cells", "Obstruction of blood vessels by sickled red blood cells", "Increase in white blood cell count", "Decreased production of red blood cells"], correct: 1, rationale: "The primary mechanism involves the obstruction of blood vessels by sickled red blood cells, leading to ischemia and tissue damage." },
      { question: "Which of the following interventions is the priority for a patient in a sequestration crisis?", options: ["Administer oral analgesics", "Initiate intravenous fluid therapy", "Perform a complete blood count", "Educate about pain management"], correct: 1, rationale: "Initiating intravenous fluid therapy is critical to restore volume and improve perfusion in a patient experiencing a sequestration crisis." },
    ],
  },
  "rn-sickle-cell-disease": {
    title: "Sickle Cell Disease",
    cellular: { title: "Pathophysiology of Sickle Cell Disease", content: "Sickle Cell Disease (SCD) is a genetic disorder characterized by the production of abnormal hemoglobin, known as hemoglobin S (HbS). In SCD, red blood cells (RBCs) distort into a crescent or sickle shape, particularly under low oxygen conditions. These sickle-shaped cells are rigid, leading to impaired microcirculation and increased hemolysis. The obstruction of small blood vessels by sickle cells results in ischemia and subsequent pain episodes, known as sickle cell crises. Chronic hemolysis leads to anemia due to decreased RBC lifespan, while the repeated vaso-occlusive events can result in organ damage. The disease is inherited in an autosomal recessive pattern, with varying severity based on the presence of other hemoglobin types. Individuals often experience episodes of acute pain, fatigue, and increased susceptibility to infections due to splenic dysfunction. Management focuses on alleviating symptoms and preventing complications." },
    riskFactors: ["Family history of sickle cell disease", "African, Mediterranean, or Middle Eastern ancestry", "Presence of sickle cell trait", "Infections (especially pneumonia)", "Dehydration", "High altitude exposure", "Extreme temperatures", "Stress"],
    diagnostics: ["Perform complete blood count (CBC) to check for anemia", "Conduct hemoglobin electrophoresis to identify hemoglobin types", "Order reticulocyte count to assess bone marrow response", "Obtain peripheral blood smear to observe sickled cells", "Measure bilirubin levels to evaluate hemolysis", "Use imaging studies to assess for organ damage", "Monitor oxygen saturation levels", "Evaluate for organ function tests (e.g., renal function)"],
    management: ["Administer pain management including opioids during crises", "Provide hydration to reduce blood viscosity", "Administer hydroxyurea to reduce frequency of crises", "Implement blood transfusions for severe anemia", "Use antibiotics prophylactically to prevent infections", "Encourage vaccinations (e.g., pneumococcal, meningococcal)", "Promote patient education on lifestyle modifications", "Monitor for and manage complications such as acute chest syndrome"],
    nursingActions: ["Assess pain level using a standardized pain scale", "Monitor vital signs frequently, especially during a crisis", "Ensure adequate hydration and administer IV fluids as prescribed", "Educate patients on recognizing signs of infection", "Administer prescribed medications and monitor for side effects", "Encourage regular follow-up appointments for monitoring", "Advocate for a multidisciplinary approach to care", "Provide emotional support and counseling resources"],
    pearls: ["Sickle cell crises can be triggered by dehydration and stress.", "Hydroxyurea is effective in reducing the frequency of pain crises.", "Education on recognizing early symptoms can prevent complications.", "Regular vaccinations are crucial to prevent infections in SCD patients."],
    signs: {
      left: ["Fatigue and weakness", "Frequent pain episodes (crises)", "Swelling of hands and feet (dactylitis)", "Pallor or jaundice"],
      right: ["Acute chest syndrome (chest pain, fever, cough)", "Severe abdominal pain indicating splenic sequestration", "Stroke symptoms (e.g., sudden weakness, confusion)", "Acute renal failure or hematuria"]
    },
    medications: [
      { name: "Hydroxyurea", type: "Antineoplastic agent", action: "Stimulates fetal hemoglobin production, reducing sickling", sideEffects: "Bone marrow suppression, gastrointestinal symptoms", contra: "Pregnancy, hypersensitivity to hydroxyurea", pearl: "Monitor blood counts regularly due to risk of myelosuppression." },
      { name: "Opioids (e.g., Morphine)", type: "Analgesic", action: "Provides effective pain relief during crises", sideEffects: "Respiratory depression, constipation, sedation", contra: "Severe respiratory depression, acute abdomen", pearl: "Assess pain and sedation levels frequently to prevent overdose." },
    ],
    quiz: [
      { question: "What is the primary cause of pain in sickle cell disease?", options: ["Increased blood viscosity", "Obstruction of blood flow", "Anemia", "Infection"], correct: 1, rationale: "The primary cause of pain in sickle cell disease is the obstruction of blood flow due to sickle-shaped cells, leading to ischemia." },
      { question: "Which medication is used to reduce the frequency of sickle cell crises?", options: ["Ibuprofen", "Hydroxyurea", "Penicillin", "Morphine"], correct: 1, rationale: "Hydroxyurea is used to stimulate fetal hemoglobin production and reduce the frequency of sickle cell crises." },
    ],
  },
  "rn-streptococcal-infection": {
    title: "Streptococcal Infection (Group A Strep)",
    cellular: { title: "Pathophysiology of Group A Streptococcal Infection", content: "Group A Streptococcus (GAS), primarily Streptococcus pyogenes, is a gram-positive bacterium responsible for a range of infections, from mild pharyngitis to severe invasive diseases. The bacteria enter the body through mucosal surfaces or breaks in the skin and can release various virulence factors, including streptolysins, hyaluronidase, and exotoxins. These factors contribute to the bacteria's ability to evade the host immune response and cause tissue damage. The infection triggers a host immune response characterized by the activation of neutrophils and macrophages, leading to inflammation and tissue destruction. In some cases, the immune response can lead to post-infectious complications, such as rheumatic fever or post-streptococcal glomerulonephritis. Early identification and treatment are essential to prevent complications and promote recovery." },
    riskFactors: ["Close contact with infected individuals", "Age (common in children aged 5-15 years)", "Recent viral infection (e.g., influenza)", "Crowded living conditions (schools, daycare)", "Immunocompromised state", "Poor hygiene practices"],
    diagnostics: ["Obtain throat swab for rapid antigen detection", "Culture throat swab for Streptococcus", "Perform complete blood count (CBC) to check for leukocytosis", "Check ASO titer to assess for recent streptococcal infection", "Order ESR or CRP to evaluate inflammatory response", "Conduct imaging studies if complications are suspected (e.g., abscess)"],
    management: ["Administer appropriate antibiotics (e.g., penicillin or amoxicillin)", "Provide symptomatic relief (e.g., analgesics, antipyretics)", "Instruct on proper hydration and nutrition", "Educate on the importance of completing antibiotic course", "Isolate the patient if indicated to prevent spread", "Monitor for complications such as abscess formation or systemic infection"],
    nursingActions: ["Assess vital signs regularly, monitoring for fever", "Perform throat assessments for swelling and exudate", "Monitor for signs of respiratory distress", "Educate the patient on hand hygiene practices", "Provide comfort measures (e.g., warm saline gargles)", "Document and report any changes in condition promptly"],
    pearls: ["Group A Strep infections can lead to rheumatic fever if untreated.", "Rapid antigen tests are useful for quick diagnosis but may require follow-up culture.", "Throat culture remains the gold standard for diagnosis of streptococcal pharyngitis."],
    signs: {
      left: ["Sore throat with erythema", "Fever (usually > 38°C)", "Swollen lymph nodes", "Pus or white patches on tonsils"],
      right: ["Difficulty breathing or swallowing", "High fever (> 39.5°C)", "Rash (e.g., scarlet fever presentation)", "Signs of systemic infection (e.g., hypotension, tachycardia)"]
    },
    medications: [
      { name: "Penicillin", type: "Antibiotic", action: "Inhibits bacterial cell wall synthesis, leading to cell lysis", sideEffects: "Allergic reactions, gastrointestinal upset", contra: "History of penicillin allergy", pearl: "First-line treatment for streptococcal pharyngitis" },
      { name: "Amoxicillin", type: "Antibiotic", action: "Inhibits bacterial cell wall synthesis, effective against Streptococcus", sideEffects: "Allergic reactions, diarrhea", contra: "History of amoxicillin allergy", pearl: "Often preferred for its taste in pediatric populations" },
    ],
    quiz: [
      { question: "What is the first-line treatment for Group A Streptococcal pharyngitis?", options: ["Amoxicillin", "Ciprofloxacin", "Vancomycin", "Azithromycin"], correct: 0, rationale: "Amoxicillin is the first-line treatment due to its efficacy and safety profile for Group A Streptococcus." },
      { question: "Which of the following is a late sign of Group A Streptococcal infection?", options: ["Fever", "Swollen lymph nodes", "Scarlet rash", "Sore throat"], correct: 2, rationale: "A scarlet rash is considered a late sign and is associated with complications such as scarlet fever." },
    ],
  },
  "rn-submersion-injury": {
    title: "Submersion Injury (Near Drowning)",
    cellular: { title: "Pathophysiology of Submersion Injury", content: "Submersion injury occurs when a person is submerged in water, leading to asphyxia and potential drowning. When a victim is submerged, the airway may become obstructed, resulting in hypoxia. The type of water (fresh vs. salt) can influence the pathophysiological outcome; fresh water can cause hemolysis and pulmonary edema, while salt water can lead to hypervolemia and dehydration. The initial response to submersion includes a gasp reflex, which may lead to water entering the lungs. This can result in aspiration pneumonia and acute respiratory distress syndrome (ARDS). The duration of submersion is critical; irreversible brain damage can occur within 4-6 minutes due to lack of oxygen. Cellular injury occurs due to ischemia and subsequent reperfusion injury upon re-oxygenation, leading to inflammatory responses and potential multiorgan failure." },
    riskFactors: ["Age (children and elderly)", "Alcohol or drug use", "Lack of swimming ability", "Inadequate supervision (especially in children)", "Medical conditions (seizures, cardiovascular issues)", "Environmental factors (rivers, oceans, pools without safety measures)"],
    diagnostics: ["Assess respiratory status", "Monitor heart rate and rhythm", "Obtain arterial blood gas analysis", "Conduct chest X-ray", "Perform pulse oximetry", "Evaluate neurological status"],
    management: ["Provide immediate airway management", "Administer supplemental oxygen", "Initiate CPR if not breathing", "Correct electrolyte imbalances", "Monitor for signs of ARDS", "Prepare for possible intubation"],
    nursingActions: ["Assess and maintain airway patency", "Monitor vital signs frequently", "Administer IV fluids as ordered", "Educate family about the injury and recovery process", "Document all assessments and interventions", "Collaborate with the interdisciplinary team for holistic care"],
    pearls: ["Quick recognition and intervention are critical to prevent permanent damage.", "Always assess for other injuries or complications post-rescue.", "Be aware that hypothermia can complicate the clinical picture."],
    signs: {
      left: ["Coughing or sputum production", "Altered level of consciousness", "Cyanosis or hypoxia", "Tachycardia"],
      right: ["Severe respiratory distress", "Bradycardia or cardiac arrest", "Unresponsiveness or coma", "Pulmonary edema on auscultation"]
    },
    medications: [
      { name: "Oxygen", type: "Gas", action: "Increases oxygen saturation and tissue perfusion", sideEffects: "Dry mucous membranes, respiratory depression", contra: "None in emergency situations", pearl: "Administer high-flow oxygen early to prevent hypoxia." },
      { name: "Bronchodilators", type: "Inhaled medication", action: "Relaxes bronchial muscles and improves airflow", sideEffects: "Tachycardia, tremors, anxiety", contra: "Known hypersensitivity", pearl: "Use in patients with bronchospasm to alleviate respiratory distress." },
    ],
    quiz: [
      { question: "What is the most critical nursing action for a patient who has experienced a submersion injury?", options: ["Administering IV fluids", "Maintaining airway patency", "Providing emotional support", "Performing a full physical assessment"], correct: 1, rationale: "Maintaining airway patency is the most urgent priority to ensure oxygen delivery and prevent hypoxia." },
      { question: "Which sign indicates late-stage complications in a patient with a near drowning event?", options: ["Coughing", "Tachycardia", "Pulmonary edema", "Altered level of consciousness"], correct: 2, rationale: "Pulmonary edema is a late sign indicating severe respiratory compromise and requires immediate intervention." },
    ],
  },
  "rn-sydenham-chorea": {
    title: "Sydenham Chorea",
    cellular: { title: "Pathophysiology of Sydenham Chorea", content: "Sydenham Chorea is a neurological disorder characterized by rapid, unintentional movements, primarily affecting children and adolescents. It is a manifestation of rheumatic fever, which arises as a post-infectious complication of group A Streptococcus (GAS) infection. The underlying pathophysiology involves an autoimmune response where antibodies directed against GAS cross-react with neuronal tissues, particularly in the basal ganglia. This autoimmune process leads to dysfunction in the regulation of motor control, resulting in chorea. Neurotransmitter imbalances, particularly with dopamine, are also implicated, as the basal ganglia are integral in modulating motor activity. The disorder may present weeks to months after the initial streptococcal infection, often accompanied by other rheumatic fever symptoms such as carditis or arthritis. The chorea can be exacerbated by stress or emotional disturbances, highlighting the need for a comprehensive approach to management." },
    riskFactors: ["Recent streptococcal throat infection", "Age between 5-15 years", "Female gender", "Family history of rheumatic fever", "Previous episodes of rheumatic fever", "Environmental factors (e.g., overcrowding)"],
    diagnostics: ["Assess for recent streptococcal infection history", "Perform throat culture for Group A Streptococcus", "Measure anti-streptolysin O (ASO) titers", "Evaluate neurological function through clinical assessment", "Conduct MRI if indicated to rule out other conditions", "Monitor for signs of carditis via echocardiogram"],
    management: ["Administer antipsychotics for chorea control", "Provide corticosteroids to reduce inflammation", "Prescribe benzodiazepines for anxiety and movement control", "Implement supportive care and physical therapy", "Educate family about the condition and coping strategies", "Schedule regular follow-up for monitoring progression"],
    nursingActions: ["Perform thorough neurological assessments regularly", "Monitor for signs of heart complications", "Educate patient and family about the disease process", "Encourage a safe environment to prevent injury", "Assess and manage emotional and psychological effects", "Collaborate with a multidisciplinary team for comprehensive care"],
    pearls: ["Sydenham Chorea is often preceded by a streptococcal infection.", "Early recognition and treatment can prevent complications.", "Education on the importance of follow-up care is crucial.", "Chorea may exacerbate during periods of stress or illness."],
    signs: {
      left: ["Sudden, irregular movements of the face and limbs", "Emotional lability or mood swings", "Difficulty with fine motor tasks", "Involuntary facial grimacing"],
      right: ["Severe motor disturbances leading to immobility", "Cognitive impairment or confusion", "Signs of heart failure (e.g., dyspnea, edema)", "Increased frequency of seizures or convulsions"]
    },
    medications: [
      { name: "Haloperidol", type: "Antipsychotic", action: "Reduces chorea symptoms by blocking dopamine receptors", sideEffects: "Sedation, weight gain, extrapyramidal symptoms", contra: "Hypersensitivity to haloperidol, Parkinson's disease", pearl: "Monitor for tardive dyskinesia with long-term use." },
      { name: "Prednisone", type: "Corticosteroid", action: "Decreases inflammation and modulates immune response", sideEffects: "Weight gain, hyperglycemia, increased infection risk", contra: "Systemic fungal infections, live vaccines", pearl: "Taper dosage to avoid adrenal insufficiency." },
    ],
    quiz: [
      { question: "Which of the following is the primary cause of Sydenham Chorea?", options: ["A. Viral infection", "B. Group A Streptococcus infection", "C. Autoimmune disorder", "D. Genetic predisposition"], correct: 1, rationale: "Sydenham Chorea is a post-infectious complication of Group A Streptococcus infection, leading to an autoimmune response." },
      { question: "What is an important nursing action for a patient with Sydenham Chorea?", options: ["A. Restrict all physical activity", "B. Monitor for neurological and cardiac symptoms", "C. Administer antipyretics for fever", "D. Provide high-protein diet"], correct: 1, rationale: "Monitoring for neurological and cardiac symptoms is crucial for managing potential complications in patients with Sydenham Chorea." },
    ],
  },
};
