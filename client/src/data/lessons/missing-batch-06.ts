import type { LessonContent } from "./types";

export const missingBatch06Lessons: Record<string, LessonContent> = {
  "rn-encopresis": {
    title: "Encopresis",
    cellular: { title: "Pathophysiology of Encopresis", content: "Encopresis is characterized by the involuntary passage of feces in inappropriate places, often due to chronic constipation and fecal retention. At the cellular level, prolonged stool retention leads to distention of the rectum, causing overstretching of the rectal wall. This overstretching can impair the normal sensory and motor functions of the rectum, reducing the urge to defecate and resulting in fecal impaction. The increased pressure from retained stool can cause the liquid stool to leak around the impaction, leading to soiling. Additionally, psychological factors such as anxiety surrounding bowel movements can exacerbate the condition. Understanding the interplay between physiological and psychological factors is essential for effective management." },
    riskFactors: ["Chronic constipation", "Low fiber diet", "Psychological stress or trauma", "Toilet training issues", "Neurological disorders", "Family history of encopresis", "Avoidance of bowel movements", "Sedentary lifestyle"],
    diagnostics: ["Assess bowel habits and frequency", "Monitor abdominal distension", "Expect fecal impaction on digital exam", "Assess for signs of dehydration", "Evaluate dietary intake (fiber and fluids)", "Monitor for behavioral issues related to toileting", "Expect abdominal pain or discomfort", "Assess for skin irritation or infection"],
    management: ["Encourage a high-fiber diet", "Increase fluid intake", "Implement a regular toileting schedule", "Educate families on behavioral strategies", "Administer prescribed laxatives or stool softeners", "Provide emotional support and counseling", "Monitor progress and bowel habits regularly", "Collaborate with dietitians for nutritional advice"],
    nursingActions: ["Assess bowel patterns daily for consistency and frequency", "Monitor for signs of dehydration, including skin turgor", "Evaluate abdominal girth for distension", "Educate patient and family on dietary modifications", "Document stool characteristics and frequency", "Provide a quiet and comfortable environment for toileting", "Encourage the child to sit on the toilet for a few minutes after meals", "Reassess and adjust management strategies based on response"],
    pearls: ["Encopresis often has a psychological component requiring holistic management.", "Regular toileting can improve bowel habits significantly.", "Family education is crucial for long-term success in management.", "Monitor for signs of emotional distress related to encopresis."],
    signs: {
      left: ["Infrequent bowel movements", "Abdominal discomfort", "Soiling of underwear", "Emotional distress related to bowel habits"],
      right: ["Severe abdominal pain", "Fecal impaction requiring medical intervention", "Signs of rectal bleeding", "Severe behavioral changes or regression"]
    },
    medications: [
      { name: "Polyethylene Glycol", type: "Osmotic Laxative", action: "Draws water into the bowel to soften stool", sideEffects: "Bloating and abdominal discomfort", contra: "Bowel obstruction", pearl: "Considered safe for children when used as directed." },
      { name: "Docusate Sodium", type: "Stool Softener", action: "Increases water content in stool", sideEffects: "Mild abdominal cramping", contra: "Severe abdominal pain or obstruction", pearl: "Useful for regular use to prevent hard stool formation." },
    ],
    quiz: [
      { question: "What is the primary nursing intervention for a child diagnosed with encopresis?", options: ["Administer laxatives immediately", "Implement a regular toileting schedule", "Restrict fluid intake", "Encourage prolonged withholding of bowel movements"], correct: 1, rationale: "Implementing a regular toileting schedule helps establish a consistent routine and encourages bowel regularity, which is essential for managing encopresis." },
      { question: "Which risk factor is most associated with encopresis?", options: ["High fiber diet", "Toilet training difficulties", "Regular exercise", "Strong family support"], correct: 1, rationale: "Toilet training difficulties can lead to avoidance behaviors, increasing the risk of encopresis due to fear or anxiety associated with bowel movements." },
    ],
  },
  "rn-esophageal-atresia": {
    title: "Esophageal Atresia",
    cellular: { title: "Pathophysiology of Esophageal Atresia", content: "Esophageal atresia (EA) is a congenital condition characterized by the incomplete development of the esophagus, resulting in a discontinuity of the esophageal lumen. It often occurs in conjunction with tracheoesophageal fistula (TEF), where an abnormal connection forms between the esophagus and trachea. The embryological cause is attributed to disruptions in the development of the foregut during the 4th to 6th week of gestation. This abnormality leads to the failure of the esophagus to form a continuous passage from the pharynx to the stomach. Cellularly, there is a lack of epithelial lining and smooth muscle development, resulting in structural and functional impairment. This affects the ability to perform normal swallowing and transport of food, leading to aspiration risks and feeding difficulties. The absence of a functional esophagus can also lead to associated complications, such as respiratory distress due to aspiration and poor nutritional intake." },
    riskFactors: ["Maternal polyhydramnios", "Prematurity", "Other congenital anomalies (e.g., cardiac defects)", "Family history of EA", "Intrauterine growth restriction (IUGR)", "Maternal exposure to teratogens", "Chromosomal abnormalities (e.g., trisomy 18)"],
    diagnostics: ["Assess for signs of respiratory distress", "Monitor for excessive salivation", "Expect to perform a chest X-ray", "Assess for cyanosis during feeding", "Monitor nutritional intake and growth patterns", "Expect an esophagram (barium swallow)", "Assess for signs of aspiration pneumonia"],
    management: ["Maintain NPO status until surgical intervention", "Prepare for surgical repair of the esophagus", "Administer IV fluids as ordered", "Implement nasogastric (NG) tube care", "Monitor vital signs frequently", "Conduct thorough assessments for aspiration", "Provide family education and support"],
    nursingActions: ["Assess respiratory status every 2-4 hours and with feeding", "Monitor for signs of dehydration (e.g., urine output, skin turgor)", "Evaluate feeding tolerance and signs of distress during feeds", "Document and report any changes in condition promptly", "Administer prescribed medications for comfort as needed", "Collaborate with the healthcare team for nutritional support", "Educate caregivers on recognizing signs of complications"],
    pearls: ["Esophageal atresia often presents with polyhydramnios during pregnancy.", "Early identification and surgical intervention are critical to prevent complications.", "Parents should be educated on the signs of aspiration and respiratory distress.", "Long-term follow-up is essential for growth and development monitoring."],
    signs: {
      left: ["Excessive drooling", "Coughing or choking during feeds", "Difficulty breathing", "Cyanosis during feeding"],
      right: ["Severe respiratory distress", "Recurrent aspiration pneumonia", "Signs of sepsis (e.g., temperature instability)", "Profound dehydration or electrolyte imbalance"]
    },
    medications: [
      { name: "Proton Pump Inhibitors", type: "Antisecretory", action: "Reduce gastric acid secretion", sideEffects: "Headache", contra: "Known hypersensitivity", pearl: "Monitor for signs of gastrointestinal bleeding" },
      { name: "Antibiotics (e.g., Ampicillin)", type: "Antimicrobial", action: "Treat or prevent infections", sideEffects: "Diarrhea", contra: "Allergy to penicillins", pearl: "Ensure hydration status is monitored during therapy" },
    ],
    quiz: [
      { question: "What is the most critical nursing action for a newborn diagnosed with esophageal atresia?", options: ["Initiate oral feeding immediately", "Maintain NPO status", "Administer oral medications", "Perform a chest physiotherapy"], correct: 1, rationale: "Maintaining NPO status is crucial to prevent aspiration and allow for surgical intervention." },
      { question: "Which of the following signs would indicate a potential complication in a patient with esophageal atresia?", options: ["Decreased urination", "Stable vital signs", "Normal feeding tolerance", "Absence of drooling"], correct: 0, rationale: "Decreased urination can indicate dehydration, which is a potential complication of esophageal atresia due to feeding difficulties." },
    ],
  },
  "rn-functional-fecal-incontinence": {
    title: "Functional Fecal Incontinence",
    cellular: { title: "Pathophysiology of Functional Fecal Incontinence", content: "Functional fecal incontinence is characterized by the inability to control bowel movements, leading to involuntary fecal leakage. This condition is often associated with a dysfunction in the neural pathways that coordinate bowel control, which can be affected by various factors including cognitive impairment, mobility limitations, and psychological conditions. At the cellular level, the rectal and anal sphincter muscles may not receive adequate signals from the central nervous system due to damage or degeneration of nerve fibers, resulting in decreased rectal compliance and altered sensitivity. Furthermore, changes in the intestinal microflora and motility may exacerbate symptoms. Individuals with cognitive impairments, such as dementia, may also have an inability to recognize the urge to defecate, leading to functional incontinence. Effective management requires understanding these underlying mechanisms to tailor interventions appropriately." },
    riskFactors: ["Cognitive impairment (e.g., dementia)", "Mobility issues (e.g., arthritis)", "Neurological disorders (e.g., stroke)", "Psychological conditions (e.g., depression)", "Chronic constipation", "Recent surgery (e.g., pelvic surgery)", "Medications affecting bowel function (e.g., opioids)", "Advanced age"],
    diagnostics: ["Assess bowel patterns and habits", "Monitor for signs of constipation or impaction", "Expect abdominal and rectal examinations", "Evaluate for associated neurological deficits", "Assess psychosocial factors affecting incontinence", "Monitor fluid and dietary intake", "Document patient-reported symptoms", "Collaborate with occupational therapy for functional assessment"],
    management: ["Implement a bowel training program", "Encourage high-fiber diet and adequate hydration", "Provide education on proper toileting techniques", "Establish a regular toileting schedule", "Refer to a dietitian for nutritional support", "Use incontinence products as needed", "Coordinate care with physiotherapy for mobility support", "Encourage pelvic floor muscle exercises"],
    nursingActions: ["Assess bowel habits daily for changes", "Monitor skin integrity around the perianal area", "Educate patient on the importance of timely toileting", "Document frequency and volume of fecal incontinence episodes", "Collaborate with interdisciplinary team for comprehensive care", "Evaluate effectiveness of implemented interventions weekly", "Provide emotional support to reduce anxiety related to incontinence", "Reinforce privacy and dignity during care"],
    pearls: ["Functional fecal incontinence often requires a multidisciplinary approach.", "Bowel training can significantly improve patient outcomes.", "Education on dietary modifications is crucial for management.", "Regular assessments can help identify changes in bowel habits early."],
    signs: {
      left: ["Infrequent bowel movements", "Mild abdominal discomfort", "Occasional leakage", "Awareness of urgency"],
      right: ["Frequent, uncontrollable leakage", "Severe abdominal pain", "Perianal skin breakdown", "Signs of fecal impaction"]
    },
    medications: [
      { name: "Loperamide", type: "Antidiarrheal", action: "Reduces intestinal motility", sideEffects: "Constipation", contra: "Bacterial enterocolitis", pearl: "Use with caution in elderly patients." },
      { name: "Psyllium", type: "Bulk-forming laxative", action: "Absorbs water to increase stool bulk", sideEffects: "Bloating, gas", contra: "Intestinal obstruction", pearl: "Instruct patients to take with plenty of water." },
    ],
    quiz: [
      { question: "Which of the following is a common risk factor for functional fecal incontinence?", options: ["Advanced age", "Hyperthyroidism", "Gastroparesis", "Diabetes insipidus"], correct: 0, rationale: "Advanced age is a well-documented risk factor for functional fecal incontinence due to possible cognitive and mobility issues. The other options are not directly linked to this condition." },
      { question: "What is the primary nursing action for a patient experiencing fecal incontinence?", options: ["Monitor vital signs", "Assess bowel habits", "Administer laxatives", "Encourage fluid restriction"], correct: 1, rationale: "Assessing bowel habits is crucial for understanding the frequency and nature of incontinence, which guides further interventions. Monitoring vital signs is important but not specific to fecal incontinence." },
    ],
  },
  "rn-gallstones": {
    title: "Gallstones (Cholelithiasis)",
    cellular: { title: "Pathophysiology of Gallstones", content: "Cholelithiasis occurs when there is an imbalance in the substances that make up bile, leading to the formation of solid particles (gallstones) in the gallbladder. There are two main types of gallstones: cholesterol and pigment stones. Cholesterol stones are formed when there is excess cholesterol in the bile, often due to obesity, rapid weight loss, or a high-fat diet. Pigment stones arise from excess bilirubin, which can occur in conditions such as hemolytic anemia or liver cirrhosis. The presence of gallstones can lead to inflammation (cholecystitis) if they obstruct the cystic duct, causing bile to accumulate and potentially leading to infection. Additionally, gallstones may migrate into the common bile duct, leading to complications such as pancreatitis or cholangitis." },
    riskFactors: ["Obesity", "Rapid weight loss", "High-fat diet", "Female gender", "Age over 40", "Family history of gallstones", "Diabetes mellitus", "Certain medications (e.g., estrogen)"],
    diagnostics: ["Monitor abdominal pain location and intensity", "Assess for jaundice", "Expect elevated liver enzymes (ALT, AST)", "Monitor for signs of pancreatitis", "Assess for clay-colored stools", "Expect ultrasound findings of gallstones", "Monitor vital signs for signs of infection", "Assess for biliary colic"],
    management: ["Administer pain relief medications as prescribed", "Encourage a low-fat diet", "Prepare patient for possible cholecystectomy", "Educate patient about dietary modifications", "Monitor for complications post-surgery", "Administer IV fluids if necessary", "Provide preoperative care including informed consent", "Educate on signs of infection post-operatively"],
    nursingActions: ["Assess abdominal tenderness and distension", "Monitor and document pain using a scale", "Check for rebound tenderness", "Assess for fever and chills", "Monitor liver function tests", "Educate patient on signs of complications to report", "Ensure patient's IV access is patent", "Reinforce dietary instructions pre and post-surgery"],
    pearls: ["Gallstones can be asymptomatic; regular assessments are crucial.", "Cholecystectomy is the definitive treatment for symptomatic gallstones.", "Monitor for complications like pancreatitis or cholangitis post-operatively.", "Dietary management is key in preventing recurrence."],
    signs: {
      left: ["Intermittent abdominal pain", "Nausea and vomiting", "Bloating", "Indigestion"],
      right: ["Severe abdominal pain", "Jaundice", "Fever and chills", "Clay-colored stools"]
    },
    medications: [
      { name: "Ursodiol", type: "Bile Acid", action: "Reduces the cholesterol content of bile", sideEffects: "Diarrhea", contra: "Pregnancy", pearl: "Useful in non-surgical candidates with cholesterol gallstones" },
      { name: "Analgesics (e.g., Morphine)", type: "Opioid", action: "Provides pain relief", sideEffects: "Constipation, respiratory depression", contra: "Acute pancreatitis", pearl: "Use caution in patients with biliary colic" },
      { name: "Antibiotics (e.g., Metronidazole)", type: "Antimicrobial", action: "Treats bacterial infections", sideEffects: "Nausea, metallic taste", contra: "Alcohol use", pearl: "Administer to prevent infection post-surgery" },
    ],
    quiz: [
      { question: "What is the primary risk factor for developing cholesterol gallstones?", options: ["High-fiber diet", "Obesity", "Increased physical activity", "Low-calcium intake"], correct: 1, rationale: "Obesity is a well-known risk factor for cholesterol gallstones due to increased cholesterol saturation in bile." },
      { question: "Which symptom indicates a potential complication of gallstones?", options: ["Mild abdominal discomfort", "Clay-colored stools", "Intermittent nausea", "Occasional gas", ""], correct: 1, rationale: "Clay-colored stools indicate a lack of bile in the intestines, suggesting a blockage or complication." },
    ],
  },
  "rn-hemophilia": {
    title: "Hemophilia",
    cellular: { title: "Pathophysiology of Hemophilia", content: "Hemophilia is a genetic bleeding disorder resulting from deficiencies in clotting factors, most commonly Factor VIII (Hemophilia A) or Factor IX (Hemophilia B). These deficiencies impair the coagulation cascade, leading to a diminished ability to form stable blood clots. At the cellular level, when a blood vessel is injured, platelets aggregate at the site, but without adequate clotting factors, fibrin formation is insufficient. This results in prolonged bleeding episodes, which can occur spontaneously or after minor trauma. Hemophilia is typically inherited in an X-linked recessive pattern, affecting primarily males. The severity of the disorder correlates with the level of clotting factor present: mild (5-40% of normal), moderate (1-5%), and severe (less than 1%). Individuals with hemophilia are at increased risk for joint damage due to repeated bleeding episodes, leading to hemophilic arthropathy." },
    riskFactors: ["Family history of hemophilia", "Male gender", "Genetic mutations", "Presence of inhibitors to clotting factors", "History of bleeding disorders", "Certain ethnic backgrounds (e.g., Caucasian, Irish)"],
    diagnostics: ["Monitor platelet count", "Expect prolonged activated partial thromboplastin time (aPTT)", "Assess for Factor VIII/IX levels", "Monitor for signs of bleeding", "Expect history of bleeding episodes", "Assess for joint swelling or pain"],
    management: ["Administer factor replacement therapy", "Educate on avoiding high-risk activities", "Encourage regular follow-up with a hematologist", "Provide education on bleeding precautions", "Administer desmopressin (DDAVP) if appropriate", "Promote physical therapy for joint health"],
    nursingActions: ["Assess vital signs for signs of hypotension", "Monitor for bleeding in high-risk areas (e.g., joints, gums)", "Evaluate for signs of internal bleeding (e.g., abdominal pain, hematuria)", "Educate patient on recognizing signs of bleeding", "Document frequency and severity of bleeding episodes", "Coordinate care with multidisciplinary team for comprehensive management"],
    pearls: ["Always monitor for signs of bleeding post-infusion", "Educate patients on the importance of factor replacement therapy compliance", "Use caution with anticoagulants in patients with hemophilia", "Encourage genetic counseling for affected families"],
    signs: {
      left: ["Easy bruising", "Frequent nosebleeds", "Prolonged bleeding after cuts", "Joint pain or swelling"],
      right: ["Spontaneous bleeding episodes", "Severe joint pain or swelling", "Hemorrhage requiring emergency intervention", "Blood in urine or stool"]
    },
    medications: [
      { name: "Factor VIII", type: "Clotting Factor Concentrate", action: "Replaces deficient Factor VIII to promote clotting", sideEffects: "Risk of allergic reaction", contra: "History of anaphylaxis to factor products", pearl: "Administer slowly to prevent transfusion reactions" },
      { name: "Desmopressin (DDAVP)", type: "Synthetic Antidiuretic Hormone", action: "Stimulates release of stored Factor VIII", sideEffects: "Hyponatremia", contra: "History of fluid retention disorders", pearl: "Can be used in mild cases of Hemophilia A" },
    ],
    quiz: [
      { question: "Which of the following is the most appropriate nursing action for a patient with hemophilia experiencing joint pain?", options: ["Apply heat to the joint", "Encourage range of motion exercises", "Administer factor replacement therapy", "Instruct the patient to rest the joint"], correct: 2, rationale: "Administering factor replacement therapy is critical to prevent further bleeding and manage joint pain, while heat may worsen inflammation and exercises may increase bleeding risk." },
      { question: "A patient with hemophilia A is receiving factor VIII replacement therapy. Which finding would indicate that the therapy is effective?", options: ["Decreased aPTT", "Increased platelet count", "No joint swelling", "Absence of bruising"], correct: 0, rationale: "A decreased aPTT indicates improved clotting ability, while the other options do not directly reflect the effectiveness of factor VIII therapy." },
    ],
  },
  "rn-hemorrhage": {
    title: "Hemorrhage",
    cellular: { title: "Pathophysiology of Hemorrhage", content: "Hemorrhage refers to the loss of blood, which can occur internally or externally and can be classified as arterial, venous, or capillary. At the cellular level, hemorrhage leads to a reduction in oxygen-carrying capacity of blood, resulting in tissue hypoxia. When blood vessels are compromised, platelets aggregate at the site of injury, and clotting factors are activated to form a fibrin clot. However, excessive blood loss overwhelms these compensatory mechanisms, leading to a decrease in perfusion pressure and impaired cellular metabolism. This can result in cellular injury and death if not promptly addressed. Additionally, significant hemorrhage activates the sympathetic nervous system, resulting in tachycardia and vasoconstriction in non-essential areas to maintain blood flow to vital organs. The severity of hemorrhage is often assessed using the percentage of blood volume lost, and prompt recognition and intervention are crucial to prevent shock and organ failure." },
    riskFactors: ["Trauma", "Surgery", "Anticoagulant therapy", "Bleeding disorders", "Gastrointestinal ulceration", "Pregnancy complications", "Aneurysms", "Vascular malformations"],
    diagnostics: ["Monitor vital signs for hypotension", "Expect a decrease in hemoglobin and hematocrit", "Assess for signs of shock", "Monitor coagulation profiles (PT, aPTT)", "Assess CBC for platelet count", "Monitor urine output for renal perfusion"],
    management: ["Initiate IV access for fluid resuscitation", "Administer blood products as ordered", "Provide oxygen therapy to improve tissue oxygenation", "Position the patient supine with legs elevated", "Implement wound care and control bleeding", "Prepare for possible surgical intervention", "Educate the patient on prevention of future hemorrhagic events"],
    nursingActions: ["Assess level of consciousness every 15 minutes", "Monitor heart rate and rhythm continuously", "Check peripheral pulses for adequacy", "Document fluid intake and output hourly", "Assess skin for signs of pallor and coolness", "Evaluate abdominal distension or rigidity", "Monitor laboratory values for trends in hemoglobin"],
    pearls: ["Rapid assessment and intervention are critical in preventing shock.", "Always monitor for signs of internal bleeding, especially in high-risk patients.", "Educate patients on the importance of managing anticoagulant therapy.", "Recognize that vital signs may be the first indication of hemorrhage severity."],
    signs: {
      left: ["Tachycardia", "Pallor", "Weakness", "Dizziness"],
      right: ["Hypotension", "Altered mental status", "Cold and clammy skin", "Oliguria or anuria"]
    },
    medications: [
      { name: "Tranexamic Acid", type: "Antifibrinolytic", action: "Inhibits fibrin breakdown to promote clot stability", sideEffects: "Thromboembolism", contra: "Active thromboembolic disease", pearl: "Administer as soon as possible after hemorrhage onset." },
      { name: "Vitamin K", type: "Vitamin", action: "Essential for synthesis of clotting factors II, VII, IX, and X", sideEffects: "Allergic reactions", contra: "Hypersensitivity to vitamin K", pearl: "Monitor INR levels to gauge effectiveness." },
      { name: "Fibrinogen Concentrate", type: "Coagulation factor", action: "Increases fibrinogen levels to aid in clot formation", sideEffects: "Hypersensitivity reactions", contra: "History of allergic reaction to components", pearl: "Administer slowly and monitor for signs of anaphylaxis." },
    ],
    quiz: [
      { question: "What is the priority nursing action in a patient suspected of hemorrhagic shock?", options: ["Administer analgesics", "Initiate IV fluid resuscitation", "Perform a thorough head-to-toe assessment", "Call for a physician"], correct: 1, rationale: "Initiating IV fluid resuscitation is critical to restore circulating volume and prevent further complications." },
      { question: "Which of the following laboratory values would you expect to decrease in a patient experiencing significant hemorrhage?", options: ["Platelet count", "Hemoglobin", "White blood cell count", "Prothrombin time"], correct: 1, rationale: "Hemoglobin levels decrease due to the loss of red blood cells from the hemorrhage." },
    ],
  },
  "rn-hepatitis-b": {
    title: "Hepatitis B",
    cellular: { title: "Pathophysiology of Hepatitis B", content: "Hepatitis B is a viral infection caused by the Hepatitis B virus (HBV), which primarily affects the liver. The virus is transmitted through contact with infectious body fluids, such as blood and semen. Once the virus enters the body, it primarily infects hepatocytes (liver cells) where it replicates. This leads to an inflammatory response, characterized by the infiltration of immune cells and the release of pro-inflammatory cytokines. The damage to hepatocytes can result in necrosis and apoptosis, leading to liver dysfunction. Chronic infection may develop in some individuals, increasing the risk of cirrhosis, liver failure, and hepatocellular carcinoma due to ongoing inflammation and cellular regeneration. Understanding the immune response to HBV is critical, as the host's immune system can sometimes clear the infection, but in other cases, it may lead to chronic infection and long-term liver complications." },
    riskFactors: ["Unvaccinated individuals", "Health care workers", "People with multiple sexual partners", "Injection drug users", "Individuals with chronic liver disease", "Travelers to endemic areas", "Infants born to infected mothers"],
    diagnostics: ["Monitor liver function tests (LFTs)", "Expect positive Hepatitis B surface antigen (HBsAg)", "Assess for presence of Hepatitis B e antigen (HBeAg)", "Monitor for elevated alanine aminotransferase (ALT) levels", "Expect seroconversion to anti-HBs (Hepatitis B surface antibody)", "Assess for jaundice and other liver dysfunction symptoms", "Monitor complete blood count (CBC) for signs of infection"],
    management: ["Administer Hepatitis B vaccine as per guidelines", "Educate about safe sex practices", "Provide antiviral therapy (e.g., tenofovir or entecavir) as prescribed", "Encourage regular follow-ups for liver health monitoring", "Advise on avoiding alcohol and hepatotoxic medications", "Support nutritional needs and liver-friendly diet", "Facilitate mental health support for chronic illness management"],
    nursingActions: ["Assess vital signs, looking for signs of liver failure", "Monitor for signs of bleeding due to coagulopathy", "Educate patient on transmission prevention methods", "Assess for abdominal pain and jaundice", "Monitor lab results for liver function and viral load", "Encourage adherence to medication regimen", "Evaluate understanding of disease process and treatment"],
    pearls: ["Vaccination is key for prevention; ensure newborns of infected mothers receive immune globulin.", "Chronic Hepatitis B requires lifelong follow-up and management.", "Educate patients about the importance of not sharing personal items that may be contaminated with blood."],
    signs: {
      left: ["Fatigue", "Loss of appetite", "Mild abdominal discomfort", "Jaundice"],
      right: ["Severe abdominal pain", "Confusion or altered mental status", "Profuse bleeding or bruising", "Signs of acute liver failure (e.g., hepatic encephalopathy)"]
    },
    medications: [
      { name: "Tenofovir", type: "Antiviral", action: "Inhibits HBV DNA polymerase, preventing viral replication", sideEffects: "Renal toxicity", contra: "Severe renal impairment", pearl: "Monitor renal function during therapy." },
      { name: "Entecavir", type: "Antiviral", action: "Inhibits HBV replication by blocking reverse transcription", sideEffects: "Lactic acidosis", contra: "Prior hypersensitivity to drug", pearl: "Administer on an empty stomach for optimal absorption." },
    ],
    quiz: [
      { question: "Which of the following is a key nursing action for a patient with acute Hepatitis B?", options: ["Administer antibiotics", "Monitor liver function tests", "Provide high-protein diet", "Encourage excessive alcohol intake"], correct: 1, rationale: "Monitoring liver function tests is critical to assess liver damage, while antibiotics are not appropriate for viral infections and a high-protein diet can strain the liver." },
      { question: "What is the primary mode of transmission for Hepatitis B?", options: ["Respiratory droplets", "Fecal-oral route", "Blood and body fluids", "Vector-borne transmission"], correct: 2, rationale: "Hepatitis B is primarily transmitted through blood and body fluids, making it important to educate patients on safe practices." },
    ],
  },
  "rn-hiatal-hernia": {
    title: "Hiatal Hernia",
    cellular: { title: "Pathophysiology of Hiatal Hernia", content: "A hiatal hernia occurs when a portion of the stomach protrudes through the diaphragm into the thoracic cavity. This can happen due to a weakened diaphragm or increased intra-abdominal pressure, which can be influenced by factors such as obesity, pregnancy, or chronic coughing. At the cellular level, the integrity of the diaphragm's muscle fibers is compromised, leading to a failure in maintaining the anatomical barrier between the abdominal and thoracic cavities. The displacement of the stomach can disrupt normal esophageal function, resulting in gastroesophageal reflux disease (GERD), where gastric contents leak back into the esophagus. This acid exposure can lead to inflammation, known as esophagitis, and can also increase the risk of Barrett's esophagus, which is a precancerous condition. Chronic irritation of the esophageal lining can cause cellular changes and contribute to dysphagia and chest pain." },
    riskFactors: ["Obesity", "Pregnancy", "Chronic coughing", "Age over 50", "Smoking", "Heavy lifting/straining", "Previous abdominal surgery"],
    diagnostics: ["Monitor for signs of GERD", "Assess for dysphagia", "Expect chest pain during meals", "Perform abdominal assessment", "Monitor vital signs for tachycardia", "Assess for signs of aspiration", "Evaluate dietary habits"],
    management: ["Educate about dietary modifications", "Encourage weight reduction if applicable", "Instruct to avoid lying down after meals", "Teach about elevating the head of the bed", "Plan for surgical intervention if symptoms are severe", "Implement medications as prescribed", "Encourage small, frequent meals"],
    nursingActions: ["Assess abdominal pain using a pain scale", "Monitor for signs of aspiration pneumonia", "Evaluate response to medications and dietary changes", "Assess for complications such as strangulation", "Monitor electrolyte levels if vomiting occurs", "Educate patient on avoiding triggers for reflux"],
    pearls: ["Hiatal hernias are often asymptomatic and discovered incidentally.", "Lifestyle modifications can significantly improve symptoms.", "Surgical intervention may be necessary for severe cases.", "Patients should be educated on recognizing signs of complications."],
    signs: {
      left: ["Heartburn after meals", "Regurgitation of food or sour liquid", "Difficulty swallowing", "Chest pain"],
      right: ["Severe chest pain", "Signs of gastrointestinal bleeding", "Rapid heart rate", "Difficulty breathing"]
    },
    medications: [
      { name: "Omeprazole", type: "Proton Pump Inhibitor", action: "Reduces gastric acid production", sideEffects: "Headache", contra: "Hypersensitivity to the drug", pearl: "Administer before meals for optimal effect" },
      { name: "Ranitidine", type: "H2 Receptor Antagonist", action: "Decreases stomach acid secretion", sideEffects: "Dizziness", contra: "Active liver disease", pearl: "Monitor liver function tests during therapy" },
    ],
    quiz: [
      { question: "What is the most common symptom of a hiatal hernia?", options: ["Chest pain", "Dysphagia", "Heartburn", "Regurgitation"], correct: 2, rationale: "Heartburn is the most common symptom due to acid reflux caused by the hernia. Chest pain and dysphagia may occur but are less frequent." },
      { question: "A patient with a hiatal hernia reports worsening chest pain and difficulty swallowing. What should the nurse assess for next?", options: ["Signs of GERD", "Signs of aspiration", "Abdominal tenderness", "Bowel sounds"], correct: 1, rationale: "Worsening chest pain and difficulty swallowing may indicate complications like aspiration, which requires immediate assessment." },
    ],
  },
  "rn-hyperhemolytic-crisis": {
    title: "Hyperhemolytic Crisis",
    cellular: { title: "Pathophysiology of Hyperhemolytic Crisis", content: "Hyperhemolytic crisis is characterized by an accelerated destruction of red blood cells (RBCs) leading to hemolytic anemia. This condition can be triggered by various factors including infections, certain medications, or autoimmune disorders. At the cellular level, antibodies, often IgG, bind to RBCs, marking them for destruction by macrophages in the spleen and liver. The complement system may also be activated, further facilitating hemolysis. The rapid breakdown of RBCs overwhelms the bone marrow's ability to produce new cells, resulting in a decreased hemoglobin level and subsequent tissue hypoxia. The release of hemoglobin into the circulation can cause secondary complications such as acute kidney injury due to tubular obstruction. Clinically, patients may present with signs of anemia, jaundice, dark urine, and splenomegaly." },
    riskFactors: ["Autoimmune disorders", "Infections (e.g., malaria)", "Blood transfusion reactions", "Certain medications (e.g., penicillin)", "Hemoglobinopathies (e.g., sickle cell disease)", "Pregnancy", "Chronic diseases (e.g., HIV)", "Exposure to toxins"],
    diagnostics: ["Monitor hemoglobin and hematocrit levels", "Assess reticulocyte count", "Expect elevated indirect bilirubin levels", "Assess haptoglobin levels", "Monitor Coombs test results", "Evaluate kidney function tests", "Expect signs of splenomegaly on physical examination"],
    management: ["Administer corticosteroids as prescribed", "Provide supportive care, including hydration", "Monitor for signs of acute kidney injury", "Educate the patient about avoiding triggers", "Administer blood transfusions if indicated", "Coordinate with a hematologist for specialized care", "Provide emotional support to the patient and family"],
    nursingActions: ["Assess vital signs every 4 hours", "Monitor urine output closely (≥30 mL/hr)", "Evaluate for signs of anemia (fatigue, pallor)", "Check for jaundice in sclera and skin", "Administer medications as prescribed and monitor for side effects", "Educate the patient regarding the importance of follow-up appointments", "Document changes in patient's condition promptly"],
    pearls: ["Always assess for recent infections or medication changes in patients presenting with anemia.", "Monitor kidney function closely in patients with hyperhemolytic crisis.", "Educate patients about the signs of hemolysis and when to seek medical attention.", "Consider genetic counseling for patients with hereditary hemolytic conditions."],
    signs: {
      left: ["Fatigue and weakness", "Pallor", "Jaundice", "Dark urine"],
      right: ["Severe abdominal pain", "Acute kidney injury signs (oliguria, anuria)", "Hypotension", "Altered mental status"]
    },
    medications: [
      { name: "Prednisone", type: "Corticosteroid", action: "Reduces immune-mediated hemolysis", sideEffects: "Increased blood glucose", contra: "Active infections", pearl: "Monitor blood glucose levels regularly." },
      { name: "Rho(D) immune globulin", type: "Immunoglobulin", action: "Prevents hemolytic disease in Rh-positive infants", sideEffects: "Fever, injection site reactions", contra: "History of anaphylactic reaction to human immunoglobulin", pearl: "Administer within 72 hours of Rh-incompatible transfusion." },
    ],
    quiz: [
      { question: "What is the primary nursing action when a patient shows signs of a hyperhemolytic crisis?", options: ["Administer blood transfusions", "Monitor vital signs", "Provide emotional support", "Educate about medication compliance"], correct: 1, rationale: "Monitoring vital signs is crucial to detect changes in the patient's condition rapidly; while blood transfusions may be needed later, initial assessment is priority." },
      { question: "Which laboratory finding would most likely indicate a hyperhemolytic crisis?", options: ["Elevated haptoglobin", "Low reticulocyte count", "Elevated indirect bilirubin", "Normal hemoglobin level"], correct: 2, rationale: "Elevated indirect bilirubin is a key sign of hemolysis, indicating the breakdown of red blood cells, while the other options do not correlate with this condition." },
    ],
  },
  "rn-hyperkalemia": {
    title: "Hyperkalemia",
    cellular: { title: "Pathophysiology of Hyperkalemia", content: "Hyperkalemia is defined as a serum potassium level greater than 5.0 mmol/L, which can disrupt normal cellular function, particularly in cardiac and neuromuscular tissues. Potassium is predominantly an intracellular ion, and its balance is crucial for maintaining resting membrane potential and cellular excitability. When potassium levels rise, it affects the depolarization of cardiac myocytes, leading to alterations in conduction and contractility, which can manifest as arrhythmias or cardiac arrest. Causes of hyperkalemia include renal failure, excessive dietary potassium intake, potassium-sparing diuretics, and cellular lysis (e.g., hemolysis or trauma). The kidneys play a pivotal role in potassium excretion; therefore, any impairment in renal function can significantly elevate potassium levels. The effect of hyperkalemia on the heart can be observed on EKG changes, including peaked T-waves, prolonged PR intervals, and widening of the QRS complex, which can progress to ventricular fibrillation or asystole if left uncorrected." },
    riskFactors: ["Chronic kidney disease", "Use of potassium-sparing diuretics", "Excessive potassium intake", "Acidosis", "Cellular breakdown (e.g., burns, trauma)", "Adrenal insufficiency", "Certain medications (e.g., ACE inhibitors)", "Diabetes mellitus"],
    diagnostics: ["Monitor serum potassium levels", "Assess ECG changes", "Expect increased creatinine levels", "Monitor for muscle weakness", "Assess for arrhythmias", "Expect metabolic acidosis", "Monitor urine output", "Assess for gastrointestinal symptoms"],
    management: ["Administer calcium gluconate or calcium chloride", "Administer insulin with glucose", "Administer sodium bicarbonate", "Administer beta-agonists (e.g., albuterol)", "Initiate hemodialysis if severe", "Educate on dietary potassium restriction", "Administer diuretics as prescribed", "Monitor vital signs closely"],
    nursingActions: ["Monitor serum potassium levels every 1-2 hours during acute phase", "Assess cardiac rhythm continuously", "Administer medications as ordered and monitor effects", "Assess for signs of muscle weakness or paralysis", "Evaluate renal function tests regularly", "Monitor for side effects of treatment interventions", "Educate patient on recognizing symptoms of hyperkalemia", "Document changes in patient condition and interventions"],
    pearls: ["Always assess cardiac rhythm in hyperkalemia", "Use continuous ECG monitoring during treatment", "Educate patients on food high in potassium to avoid", "Recognize early signs to prevent severe complications"],
    signs: {
      left: ["Mild muscle weakness", "Fatigue", "Palpitations", "Nausea"],
      right: ["Severe muscle weakness", "Bradycardia", "Widened QRS complex", "Cardiac arrest"]
    },
    medications: [
      { name: "Calcium Gluconate", type: "Electrolyte", action: "Stabilizes cardiac membranes", sideEffects: "Hypotension", contra: "Digitalis toxicity", pearl: "Administer slowly IV to avoid hypotension" },
      { name: "Insulin with Glucose", type: "Hormone", action: "Shifts potassium into cells", sideEffects: "Hypoglycemia", contra: "Hypokalemia", pearl: "Always administer glucose to prevent hypoglycemia" },
      { name: "Sodium Bicarbonate", type: "Alkalinizing agent", action: "Alkalinizes blood, shifting potassium into cells", sideEffects: "Metabolic alkalosis", contra: "Respiratory alkalosis", pearl: "Monitor arterial blood gases" },
    ],
    quiz: [
      { question: "What is the first-line treatment for severe hyperkalemia?", options: ["Administer calcium gluconate", "Start hemodialysis", "Administer potassium-sparing diuretics", "Administer sodium bicarbonate"], correct: 0, rationale: "Calcium gluconate is administered first to stabilize cardiac membranes before other treatments." },
      { question: "Which ECG change is commonly associated with hyperkalemia?", options: ["Prolonged QT interval", "Peaked T-waves", "ST elevation", "Atrial fibrillation"], correct: 1, rationale: "Peaked T-waves are characteristic of hyperkalemia and indicate increased potassium levels affecting cardiac conduction." },
    ],
  },
};
