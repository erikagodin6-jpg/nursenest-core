import type { LessonContent } from "./types";

export const missingBatch07Lessons: Record<string, LessonContent> = {
  "rn-hypertension": {
    title: "Hypertension",
    cellular: { title: "Pathophysiology of Hypertension", content: "Hypertension, or high blood pressure, is primarily a result of increased peripheral vascular resistance and/or increased cardiac output. At the cellular level, endothelial dysfunction plays a crucial role in the development of hypertension. This dysfunction leads to decreased production of vasodilators such as nitric oxide and increased production of vasoconstrictors such as endothelin-1. Chronic hypertension causes structural changes in blood vessels, including hypertrophy of the vascular smooth muscle and remodeling of the extracellular matrix. This results in narrowed arteries, increased stiffness, and ultimately elevated blood pressure. Additionally, factors like inflammation, oxidative stress, and dyslipidemia contribute to the pathogenesis of hypertension, perpetuating the cycle of vascular damage and increased blood pressure. Over time, untreated hypertension can lead to significant complications, including heart failure, stroke, and renal impairment." },
    riskFactors: ["Obesity", "Sedentary lifestyle", "High sodium diet", "Family history of hypertension", "Excessive alcohol consumption", "Chronic stress", "Age (45+ for men, 55+ for women)", "Smoking"],
    diagnostics: ["Monitor blood pressure readings regularly", "Assess for target organ damage (e.g., heart, kidneys)", "Expect laboratory findings such as elevated creatinine", "Evaluate ECG for left ventricular hypertrophy", "Assess serum lipid levels", "Monitor for signs of metabolic syndrome"],
    management: ["Educate on lifestyle modifications (diet, exercise)", "Encourage adherence to antihypertensive medications", "Promote weight loss strategies", "Administer prescribed medications as ordered", "Instruct on home blood pressure monitoring", "Coordinate referrals to dietitians or lifestyle coaches"],
    nursingActions: ["Monitor blood pressure every visit, aiming for <130/80 mmHg", "Assess for side effects of antihypertensive medications", "Evaluate patient understanding of disease and treatment plan", "Provide support for smoking cessation", "Encourage dietary changes, focusing on DASH diet", "Document changes in patient condition and response to treatment"],
    pearls: ["Hypertension is often asymptomatic; regular screening is essential.", "Lifestyle changes can significantly lower blood pressure and reduce medication reliance.", "Patient education on medication adherence is critical for effective management.", "Target organ assessment is necessary to tailor treatment and monitor complications."],
    signs: {
      left: ["Headaches", "Dizziness", "Shortness of breath", "Fatigue"],
      right: ["Severe headache", "Vision changes", "Chest pain", "Confusion"]
    },
    medications: [
      { name: "Lisinopril", type: "ACE Inhibitor", action: "Inhibits the conversion of angiotensin I to angiotensin II, leading to vasodilation", sideEffects: "Cough", contra: "History of angioedema", pearl: "Monitor potassium levels due to risk of hyperkalemia" },
      { name: "Amlodipine", type: "Calcium Channel Blocker", action: "Inhibits calcium ion influx into vascular smooth muscle, causing vasodilation", sideEffects: "Peripheral edema", contra: "Severe hypotension", pearl: "Effective for patients with coexisting angina" },
      { name: "Hydrochlorothiazide", type: "Thiazide Diuretic", action: "Inhibits sodium reabsorption in the distal convoluted tubule, leading to diuresis", sideEffects: "Hypokalemia", contra: "Anuria", pearl: "Monitor electrolyte levels regularly" },
    ],
    quiz: [
      { question: "What is the first-line treatment for a patient diagnosed with Stage 1 Hypertension?", options: ["Diuretics", "Lifestyle modifications", "Beta-blockers", "ACE inhibitors"], correct: 1, rationale: "Lifestyle modifications are recommended as the first step in managing Stage 1 Hypertension before considering medication." },
      { question: "A patient with hypertension presents with severe headache and visual disturbances. What should the nurse assess for next?", options: ["Electrolyte levels", "Signs of stroke", "Medication adherence", "Lifestyle factors"], correct: 1, rationale: "Severe headache and visual disturbances could indicate a hypertensive crisis or stroke; immediate assessment for neurological deficits is crucial." },
    ],
  },
  "rn-hypertensive-encephalopathy": {
    title: "Hypertensive Encephalopathy",
    cellular: { title: "Pathophysiology of Hypertensive Encephalopathy", content: "Hypertensive encephalopathy is a severe complication of uncontrolled hypertension that results in acute cerebral edema. At the cellular level, excessive blood pressure leads to disruption of the blood-brain barrier (BBB), resulting in increased permeability. This permits the influx of water and solutes into the neuronal tissues, causing cytotoxic and vasogenic edema. The elevated pressure also diminishes cerebral blood flow, leading to ischemic injury to neurons, particularly in areas like the basal ganglia and cerebral cortex. The resultant neuronal injury triggers inflammatory responses, which further exacerbate edema and lead to neuronal death if not promptly managed. Clinically, patients may present with altered mental status, headache, seizures, and focal neurological deficits as a result of this pathophysiological cascade." },
    riskFactors: ["Chronic hypertension", "Non-adherence to antihypertensive medications", "Cocaine or stimulant use", "Chronic kidney disease", "Pheochromocytoma", "Obstructive sleep apnea", "Pregnancy-related hypertension"],
    diagnostics: ["Monitor blood pressure frequently for hypertensive crisis", "Assess neurological status using Glasgow Coma Scale", "Expect imaging studies (CT or MRI) to rule out hemorrhage", "Evaluate serum electrolytes for imbalances", "Monitor renal function tests for acute kidney injury", "Assess for signs of end-organ damage through physical examination"],
    management: ["Administer antihypertensive medications as prescribed", "Maintain strict blood pressure control protocols", "Provide oxygen therapy if indicated", "Implement seizure precautions for at-risk patients", "Educate patient on lifestyle modifications post-crisis", "Collaborate with the healthcare team for potential ICU admission if severe"],
    nursingActions: ["Assess blood pressure every 15 minutes during hypertensive episodes, aiming for gradual reduction", "Monitor neurological status every hour for changes in consciousness or focal deficits", "Evaluate IV access and administer medications as ordered, monitoring for efficacy and side effects", "Document all findings and interventions in the patient's record promptly", "Educate the patient about the importance of medication adherence and follow-up care", "Assess for signs of fluid overload due to aggressive antihypertensive therapy"],
    pearls: ["Rapid but controlled reduction of blood pressure is crucial to prevent neurological damage.", "Always assess for signs of end-organ damage in patients with severe hypertension.", "Patient education on the importance of medication adherence can prevent recurrence."],
    signs: {
      left: ["Mild headache", "Dizziness or lightheadedness", "Nausea", "Visual disturbances"],
      right: ["Severe headache (thunderclap)", "Altered mental status (confusion or lethargy)", "Seizures", "Focal neurological deficits (e.g., weakness or speech changes)"]
    },
    medications: [
      { name: "Labetalol", type: "Beta-blocker", action: "Lowers blood pressure by blocking adrenergic receptors", sideEffects: "Bradycardia", contra: "Asthma or severe bronchospasm", pearl: "Monitor heart rate closely; may cause hypotension." },
      { name: "Nitroprusside", type: "Vasodilator", action: "Dilates blood vessels to decrease systemic vascular resistance", sideEffects: "Cyanide toxicity", contra: "Known hypersensitivity to nitroprusside", pearl: "Use with caution in renal impairment; monitor thiocyanate levels." },
    ],
    quiz: [
      { question: "What is the priority nursing action for a patient diagnosed with hypertensive encephalopathy?", options: ["Administer oral antihypertensives", "Monitor blood pressure frequently", "Provide patient education on lifestyle changes", "Assess for peripheral edema"], correct: 1, rationale: "Monitoring blood pressure frequently is essential to prevent further complications and manage hypertensive crises effectively." },
      { question: "Which symptom is most indicative of severe hypertensive encephalopathy?", options: ["Mild headache", "Nausea", "Severe headache with altered mental status", "Dizziness"], correct: 2, rationale: "Severe headache accompanied by altered mental status indicates significant neurological compromise and should be treated as an emergency." },
    ],
  },
  "rn-hypertrophic-pyloric-stenosis": {
    title: "Hypertrophic Pyloric Stenosis",
    cellular: { title: "Pathophysiology of Hypertrophic Pyloric Stenosis", content: "Hypertrophic pyloric stenosis (HPS) is characterized by the abnormal thickening of the pyloric muscle, which leads to gastric outlet obstruction. This condition primarily affects infants, typically presenting between 3 and 12 weeks of age. At the cellular level, hypertrophy occurs due to an increase in the size of smooth muscle fibers, resulting in a narrowed pyloric channel. This hypertrophy is thought to be influenced by genetic and environmental factors. The obstruction prevents normal passage of food from the stomach to the duodenum, leading to symptoms such as projectile vomiting and dehydration. As gastric contents back up, the infant's ability to retain nutrition diminishes, potentially causing metabolic alkalosis due to loss of gastric acid. The condition is diagnosed through physical examination and imaging studies that reveal a 'string sign' or an 'olive' mass in the right upper quadrant. Surgical intervention (pyloromyotomy) is often necessary to relieve the obstruction." },
    riskFactors: ["Family history of pyloric stenosis", "Male gender", "First-born child", "Caucasian ethnicity", "Premature birth", "Maternal smoking during pregnancy"],
    diagnostics: ["Assess for projectile vomiting", "Monitor hydration status", "Expect an olive-shaped mass in the abdomen", "Perform abdominal ultrasound", "Check serum electrolyte levels", "Assess for metabolic alkalosis"],
    management: ["Administer IV fluids for rehydration", "Prepare the infant for surgery", "Educate parents on post-operative care", "Monitor vital signs closely", "Provide comfort measures", "Encourage small, frequent feedings post-op"],
    nursingActions: ["Assess for signs of dehydration (e.g., dry mucous membranes, decreased urine output)", "Monitor electrolyte levels (especially potassium and chloride)", "Evaluate feeding tolerance after surgery", "Document the amount and characteristics of vomit", "Observe for signs of infection at the surgical site", "Maintain NPO status until bowel function returns"],
    pearls: ["Projectile vomiting is a classic sign of pyloric stenosis.", "Early recognition and surgical intervention are key to preventing complications.", "Dehydration and electrolyte imbalances can occur rapidly in infants with HPS."],
    signs: {
      left: ["Projectile vomiting", "Dehydration", "Constant hunger", "Irritability"],
      right: ["Severe dehydration", "Electrolyte imbalances", "Abdominal distension", "Signs of shock"]
    },
    medications: [
      { name: "Ondansetron", type: "Antiemetic", action: "Blocks serotonin receptors to prevent nausea and vomiting", sideEffects: "Headache", contra: "Hypersensitivity to ondansetron", pearl: "Use cautiously in patients with electrolyte imbalances." },
      { name: "IV Fluids (e.g., Normal Saline)", type: "Electrolyte solution", action: "Restores hydration and electrolyte balance", sideEffects: "Fluid overload", contra: "Heart failure", pearl: "Monitor closely for signs of fluid overload." },
    ],
    quiz: [
      { question: "What is the classic sign of hypertrophic pyloric stenosis?", options: ["Bile-stained vomiting", "Projectile vomiting", "Abdominal pain", "Constipation"], correct: 1, rationale: "Projectile vomiting is characteristic of HPS due to the obstruction caused by the hypertrophied pyloric muscle. Bile-stained vomiting suggests a different condition, while abdominal pain and constipation are not specific signs." },
      { question: "Which assessment finding would indicate dehydration in an infant with pyloric stenosis?", options: ["Increased weight", "Clear urine", "Dry mucous membranes", "Frequent feedings"], correct: 2, rationale: "Dry mucous membranes are indicative of dehydration. Increased weight and clear urine are not associated with dehydration, and frequent feedings would not occur due to vomiting." },
    ],
  },
  "rn-hypocalcemia": {
    title: "Hypocalcemia",
    cellular: { title: "Pathophysiology of Hypocalcemia", content: "Hypocalcemia is defined as a serum calcium level below 2.1 mmol/L. Calcium plays a critical role in various physiological processes including muscle contraction, neurotransmission, and blood coagulation. At the cellular level, hypocalcemia occurs due to a variety of mechanisms such as decreased parathyroid hormone (PTH) secretion, vitamin D deficiency, or the presence of certain diseases like kidney failure. When calcium levels drop, the neuromuscular excitability increases due to reduced threshold for action potentials, leading to symptoms such as muscle spasms and tetany. Additionally, the heart muscle may be affected, resulting in prolonged QT intervals on the ECG, which can lead to arrhythmias. Consequently, the body's compensatory mechanisms may attempt to restore calcium levels through increased bone resorption and renal reabsorption, but these may be insufficient, necessitating clinical intervention." },
    riskFactors: ["Vitamin D deficiency", "Chronic kidney disease", "Hypoparathyroidism", "Malabsorption syndromes", "Medications (e.g., bisphosphonates)", "Acute pancreatitis", "Excessive blood transfusions"],
    diagnostics: ["Monitor serum calcium levels", "Assess for Chvostek's sign", "Assess for Trousseau's sign", "Expect ECG changes", "Monitor for signs of neuromuscular irritability", "Assess dietary intake of calcium", "Evaluate renal function tests"],
    management: ["Administer oral calcium supplements", "Administer intravenous calcium gluconate", "Encourage high-calcium diet", "Educate patient on vitamin D supplementation", "Monitor for adverse reactions to calcium treatment", "Coordinate with dietitian for nutritional planning"],
    nursingActions: ["Monitor vital signs every 4 hours", "Assess neurological status regularly", "Evaluate cardiac rhythm continuously", "Document calcium levels and symptoms", "Educate patient on signs of hypocalcemia", "Monitor for signs of hypercalcemia during treatment"],
    pearls: ["Always assess for signs of hypocalcemia in patients with neck surgery.", "Remember that low magnesium levels can also contribute to hypocalcemia.", "Educate patients on the importance of dietary sources of calcium along with supplements.", "ECG changes can be a critical indicator of severe hypocalcemia."],
    signs: {
      left: ["Numbness and tingling in fingers", "Muscle cramps", "Fatigue", "Generalized weakness"],
      right: ["Severe muscle spasms", "Prolonged QT interval", "Seizures", "Cardiac arrest"]
    },
    medications: [
      { name: "Calcium Gluconate", type: "Mineral Supplement", action: "Increases serum calcium levels", sideEffects: "Hypotension", contra: "Hypercalcemia", pearl: "Administer slowly to avoid cardiac complications." },
      { name: "Calcium Carbonate", type: "Antacid/Mineral Supplement", action: "Replenishes calcium stores", sideEffects: "Constipation", contra: "Renal calculi", pearl: "Take with food for better absorption." },
    ],
    quiz: [
      { question: "What is the most common neurological sign of hypocalcemia?", options: ["Trousseau's sign", "Chvostek's sign", "Seizure activity", "Cardiac arrhythmia"], correct: 1, rationale: "Chvostek's sign is a spasm of the facial muscles triggered by tapping the facial nerve and is a key indicator of hypocalcemia." },
      { question: "Which medication is commonly administered for severe hypocalcemia?", options: ["Magnesium sulfate", "Calcium gluconate", "Potassium chloride", "Sodium bicarbonate"], correct: 1, rationale: "Calcium gluconate is the first-line treatment for severe hypocalcemia to quickly restore calcium levels." },
    ],
  },
  "rn-hypoglycemia": {
    title: "Hypoglycemia",
    cellular: { title: "Pathophysiology of Hypoglycemia", content: "Hypoglycemia occurs when blood glucose levels fall below the normal range of 4.0 to 7.0 mmol/L. At the cellular level, glucose is the primary energy source for neurons and erythrocytes, and a deficiency leads to impaired cellular metabolism. The pancreas secretes insulin in response to elevated blood glucose levels, promoting cellular uptake of glucose. However, excessive insulin secretion, inadequate glucose production from the liver, or increased glucose utilization can lead to hypoglycemia. The counter-regulatory hormones, including glucagon and epinephrine, are released to restore normal blood sugar levels by stimulating hepatic gluconeogenesis and glycogenolysis. In prolonged hypoglycemia, the brain becomes deprived of glucose, leading to neurological symptoms such as confusion, seizures, and potentially coma." },
    riskFactors: ["Excessive insulin administration", "Prolonged fasting", "Inadequate carbohydrate intake", "Increased physical activity", "Alcohol consumption", "Certain medications (e.g., sulfonylureas)", "Reactive hypoglycemia", "Hormonal deficiencies (e.g., adrenal insufficiency)"],
    diagnostics: ["Monitor blood glucose levels", "Assess for symptoms of hypoglycemia", "Expect laboratory results indicating low blood glucose (<4.0 mmol/L)", "Monitor vital signs for changes", "Assess neurological status for confusion or altered consciousness", "Expect an increased level of ketones in urine"],
    management: ["Administer fast-acting carbohydrates (e.g., glucose tablets)", "Provide a snack containing complex carbohydrates and protein", "Administer glucagon intramuscularly if patient is unconscious", "Ensure patient safety and prevent falls", "Educate patient on recognizing hypoglycemic symptoms", "Encourage regular meal planning and carbohydrate counting"],
    nursingActions: ["Monitor blood glucose levels every 15 minutes until stable", "Assess level of consciousness and orientation", "Document patient response to interventions", "Educate patient on the importance of wearing a medical alert bracelet", "Instruct patient to carry fast-acting glucose at all times", "Collaborate with the dietitian for dietary education"],
    pearls: ["Always assess blood glucose levels before and after interventions", "Educate patients on the signs and symptoms of hypoglycemia", "Involve dietitians in managing patients' meal plans", "Encourage patients to have a source of glucose readily available"],
    signs: {
      left: ["Sweating", "Tremors", "Hunger", "Nervousness"],
      right: ["Confusion", "Seizures", "Loss of consciousness", "Hypothermia"]
    },
    medications: [
      { name: "Glucose (Dextrose)", type: "Carbohydrate", action: "Rapidly increases blood glucose levels", sideEffects: "Hyperglycemia", contra: "Hyperglycemic crisis", pearl: "Use D50W for rapid administration in emergencies" },
      { name: "Glucagon", type: "Hormone", action: "Stimulates hepatic glycogenolysis and gluconeogenesis", sideEffects: "Nausea and vomiting", contra: "Insulinoma", pearl: "Administer subcutaneously or intramuscularly if patient is unconscious" },
    ],
    quiz: [
      { question: "What is the first action a nurse should take when a patient exhibits signs of hypoglycemia?", options: ["Administer glucagon", "Monitor blood glucose", "Provide fast-acting carbohydrates", "Call for help"], correct: 2, rationale: "Providing fast-acting carbohydrates is the immediate intervention to raise blood sugar levels." },
      { question: "Which symptom is a late sign of hypoglycemia?", options: ["Tremors", "Sweating", "Confusion", "Seizures"], correct: 3, rationale: "Seizures indicate a severe hypoglycemic state where the brain is significantly deprived of glucose." },
    ],
  },
  "rn-hypokalemia": {
    title: "Hypokalemia",
    cellular: { title: "Pathophysiology of Hypokalemia", content: "Hypokalemia is defined as a serum potassium level below 3.5 mEq/L. Potassium is crucial for maintaining cellular function, particularly in nerve and muscle cells. At the cellular level, hypokalemia leads to a disruption in the resting membrane potential, making it more difficult for cells to depolarize. This results in impaired neuromuscular transmission and cardiac conduction. The kidneys play a pivotal role in potassium homeostasis; when potassium levels are low, the renal tubules may excrete excessive amounts of potassium, exacerbating the condition. Causes of hypokalemia include gastrointestinal losses (vomiting, diarrhea), renal losses (diuretics, hyperaldosteronism), and inadequate dietary intake. The net effect of hypokalemia can lead to muscle weakness, cardiac arrhythmias, and in severe cases, respiratory failure." },
    riskFactors: ["Diuretic use", "Chronic diarrhea", "Vomiting", "Excessive sweating", "Inadequate dietary intake", "Hyperaldosteronism", "Renal tubular acidosis"],
    diagnostics: ["Monitor serum potassium levels", "Assess ECG for changes", "Expect muscle strength assessment", "Monitor urine output", "Assess for signs of dehydration", "Evaluate dietary intake", "Monitor blood pressure"],
    management: ["Administer potassium supplements as ordered", "Encourage potassium-rich foods", "Educate patient on medication side effects", "Monitor ECG for arrhythmias", "Implement fall precautions", "Maintain IV access for potassium replacement"],
    nursingActions: ["Assess cardiac rhythm continuously for dysrhythmias", "Monitor potassium levels every 6-12 hours", "Evaluate muscle strength and reflexes every shift", "Check IV potassium administration rates", "Assess for signs of digitalis toxicity if applicable", "Document and report significant findings promptly"],
    pearls: ["Always assess cardiac function in patients with hypokalemia", "Educate patients about dietary sources of potassium", "Monitor for signs of digitalis toxicity in patients on digoxin", "Encourage fluid intake to prevent dehydration"],
    signs: {
      left: ["Muscle weakness", "Fatigue", "Constipation", "Palpitations"],
      right: ["Severe muscle cramps", "Paralysis", "Life-threatening cardiac arrhythmias", "Respiratory failure"]
    },
    medications: [
      { name: "Potassium Chloride", type: "Electrolyte", action: "Replenishes potassium stores", sideEffects: "Gastrointestinal upset", contra: "Renal failure", pearl: "Administer IV potassium slowly to avoid cardiac complications" },
      { name: "Spironolactone", type: "Potassium-sparing diuretic", action: "Inhibits aldosterone, reducing potassium excretion", sideEffects: "Hyperkalemia", contra: "Severe renal impairment", pearl: "Monitor potassium levels closely when using with other diuretics" },
    ],
    quiz: [
      { question: "What is the most common cardiac change associated with hypokalemia?", options: ["Tachycardia", "ST segment elevation", "Flattened T waves", "Bradycardia"], correct: 2, rationale: "Flattened T waves are a classic finding on ECG in patients with hypokalemia, while tachycardia can occur but is not specific to hypokalemia." },
      { question: "Which of the following foods is the highest in potassium?", options: ["Banana", "Apple", "Carrot", "Bread"], correct: 0, rationale: "Bananas are well-known for their high potassium content, unlike apples, carrots, and bread which have significantly lower levels." },
    ],
  },
  "rn-hypomagnesemia": {
    title: "Hypomagnesemia",
    cellular: { title: "Pathophysiology of Hypomagnesemia", content: "Hypomagnesemia is characterized by a serum magnesium level less than 0.75 mmol/L. Magnesium plays a crucial role in numerous cellular processes, including enzyme activation, DNA synthesis, and neuromuscular transmission. At the cellular level, magnesium is essential for the proper functioning of ion channels, particularly the sodium-potassium ATPase pump, which regulates neuronal excitability and muscle contraction. Low magnesium levels can lead to increased release of neurotransmitters, causing hyperexcitability of neurons and muscle cells. This can result in symptoms such as tremors, seizures, and cardiac arrhythmias. Additionally, hypomagnesemia can impact calcium and potassium levels, further contributing to neuromuscular and cardiovascular complications. Causes include inadequate dietary intake, gastrointestinal losses (e.g., diarrhea, malabsorption), renal losses (e.g., diuretics, diabetes), and chronic alcoholism. Understanding these cellular mechanisms is vital for effective patient management." },
    riskFactors: ["Chronic alcoholism", "Diuretic use", "Gastrointestinal losses (diarrhea, vomiting)", "Malabsorption syndromes", "Renal disease", "Poor dietary intake", "Hypercalcemia", "Sepsis"],
    diagnostics: ["Monitor serum magnesium levels", "Assess for signs of neuromuscular irritability", "Evaluate ECG for arrhythmias", "Expect muscle weakness or cramps", "Assess dietary intake of magnesium", "Monitor for hypocalcemia and hypokalemia", "Evaluate renal function tests", "Assess for symptoms of acute confusion or seizures"],
    management: ["Administer oral magnesium supplements as ordered", "Initiate IV magnesium sulfate for severe cases", "Educate the patient on dietary sources of magnesium", "Monitor vital signs closely", "Provide safety measures to prevent falls", "Encourage adequate hydration", "Collaborate with dietitian for nutritional counseling", "Reassess magnesium levels post-treatment"],
    nursingActions: ["Monitor serum magnesium levels every 6 hours during treatment", "Assess heart rate and rhythm continuously during IV magnesium administration", "Evaluate deep tendon reflexes before and after magnesium administration", "Document any signs of respiratory distress", "Assess for signs of toxicity (e.g., muscle weakness, hypotension)", "Monitor urine output to prevent hypermagnesemia", "Educate patients on signs and symptoms of hypomagnesemia", "Encourage lifestyle modifications to increase dietary magnesium"],
    pearls: ["Monitor for signs of hypomagnesemia in patients on diuretics", "Remember to assess potassium and calcium levels with hypomagnesemia", "Educate patients on magnesium-rich foods like nuts and green leafy vegetables", "Be aware of potential drug interactions with magnesium, especially neuromuscular blockers"],
    signs: {
      left: ["Muscle twitching", "Tremors", "Fatigue", "Nausea"],
      right: ["Severe muscle weakness", "Cardiac arrhythmias", "Seizures", "Respiratory failure"]
    },
    medications: [
      { name: "Magnesium Sulfate", type: "Electrolyte Supplement", action: "Replenishes magnesium levels", sideEffects: "Hypotension", contra: "Renal failure", pearl: "Administer slowly to prevent cardiovascular complications" },
      { name: "Magnesium Oxide", type: "Oral Supplement", action: "Provides magnesium for metabolic functions", sideEffects: "Diarrhea", contra: "Bowel obstruction", pearl: "Useful for mild cases and dietary supplementation" },
    ],
    quiz: [
      { question: "What is a primary nursing action when administering intravenous magnesium sulfate?", options: ["Monitor serum magnesium levels", "Administer rapidly", "Encourage oral intake", "Position patient upright"], correct: 0, rationale: "Monitoring serum magnesium levels ensures effectiveness and safety, while rapid administration can lead to serious complications." },
      { question: "Which sign would indicate severe hypomagnesemia?", options: ["Tremors", "Muscle cramps", "Cardiac arrhythmias", "Fatigue"], correct: 2, rationale: "Cardiac arrhythmias are a severe manifestation of hypomagnesemia, indicating critical electrolyte imbalance." },
    ],
  },
  "rn-hypoparathyroidism": {
    title: "Hypoparathyroidism",
    cellular: { title: "Pathophysiology of Hypoparathyroidism", content: "Hypoparathyroidism is characterized by insufficient secretion of parathyroid hormone (PTH), leading to decreased calcium levels in the blood (hypocalcemia) and increased phosphate levels (hyperphosphatemia). PTH is crucial for calcium homeostasis, as it regulates calcium release from bones, reabsorption in the kidneys, and intestinal absorption through active vitamin D. When PTH is deficient, the body cannot mobilize calcium from bones or reabsorb it from the renal tubules effectively. This results in neuromuscular excitability, as low serum calcium levels lead to increased excitability of nerve and muscle cells. Clinically, patients may present with tetany, seizures, and cardiac abnormalities due to the critical role of calcium in neuromuscular function and cardiac contractility. Chronic hypoparathyroidism can also lead to complications such as cataracts and basal ganglia calcifications." },
    riskFactors: ["Previous neck surgery", "Autoimmune diseases", "Genetic syndromes (e.g., DiGeorge syndrome)", "Radiation therapy to the neck", "Hypomagnesemia", "Chronic kidney disease", "Vitamin D deficiency"],
    diagnostics: ["Monitor serum calcium levels", "Assess serum phosphate levels", "Expect low PTH levels", "Monitor ECG for QT prolongation", "Assess for signs of tetany", "Evaluate magnesium levels", "Expect positive Chvostek's and Trousseau's signs"],
    management: ["Administer calcium supplements", "Provide vitamin D supplementation", "Encourage high-calcium diet", "Monitor for signs of hypocalcemia", "Educate patient on medication adherence", "Assess for side effects of calcium therapy", "Coordinate with dietary services for meal planning"],
    nursingActions: ["Assess vital signs, focusing on heart rate and rhythm", "Monitor neuromuscular status for signs of tetany", "Evaluate patient's response to calcium and vitamin D therapy", "Educate patient and family on disease management", "Conduct regular laboratory assessments of calcium and phosphate levels", "Implement safety measures to prevent falls due to muscle spasms"],
    pearls: ["Hypoparathyroidism often presents after thyroid or parathyroid surgery.", "Early recognition of hypocalcemia symptoms can prevent severe complications.", "Patient education regarding dietary sources of calcium is crucial for management.", "Regular monitoring of calcium and phosphate levels is essential for effective treatment."],
    signs: {
      left: ["Numbness and tingling in fingers", "Muscle cramps", "Fatigue", "Dry skin"],
      right: ["Severe muscle spasms", "Seizures", "Cardiac arrhythmias", "Laryngeal spasm leading to airway obstruction"]
    },
    medications: [
      { name: "Calcium carbonate", type: "Calcium supplement", action: "Increases serum calcium levels", sideEffects: "Constipation", contra: "Hypercalcemia", pearl: "Administer with food to enhance absorption" },
      { name: "Calcitriol", type: "Active form of vitamin D", action: "Enhances intestinal absorption of calcium", sideEffects: "Hypercalcemia", contra: "Vitamin D toxicity", pearl: "Monitor calcium levels closely to avoid toxicity" },
    ],
    quiz: [
      { question: "Which of the following assessments would most likely indicate a complication of hypoparathyroidism?", options: ["Positive Trousseau's sign", "Increased serum calcium levels", "Decreased heart rate", "Improved muscle strength"], correct: 0, rationale: "A positive Trousseau's sign indicates neuromuscular excitability due to hypocalcemia, a common complication of hypoparathyroidism." },
      { question: "What is the priority nursing intervention for a patient experiencing tetany due to hypoparathyroidism?", options: ["Administer IV calcium gluconate", "Educate about dietary calcium sources", "Monitor vital signs", "Assess for signs of infection"], correct: 0, rationale: "Administering IV calcium gluconate is crucial to rapidly correct hypocalcemia and relieve tetany symptoms." },
    ],
  },
  "rn-hypophosphatemia": {
    title: "Hypophosphatemia",
    cellular: { title: "Pathophysiology of Hypophosphatemia", content: "Hypophosphatemia is characterized by abnormally low levels of phosphate (less than 0.81 mmol/L) in the blood, which is critical for energy production, cellular repair, and bone formation. Phosphate is primarily stored in bones and is vital for ATP production, cellular metabolism, and bone mineralization. At the cellular level, decreased phosphate availability disrupts ATP synthesis, leading to impaired energy production. This can cause decreased cellular function, particularly in tissues with high energy demands, such as muscle and nerve tissues. Additionally, low phosphate levels can contribute to impaired oxygen delivery at the cellular level due to decreased 2,3-BPG levels in red blood cells, leading to hemolysis and reduced oxygen release from hemoglobin. The condition can result from various factors including malnutrition, excessive use of antacids, diabetes mellitus, chronic alcoholism, and hyperparathyroidism, which can further exacerbate the depletion of phosphorus in the body." },
    riskFactors: ["Malnutrition", "Chronic alcoholism", "Diabetes mellitus", "Excessive antacid use", "Hyperparathyroidism", "Renal tubular disorders"],
    diagnostics: ["Monitor serum phosphate levels", "Assess dietary intake of phosphorus", "Expect decreased ATP levels", "Evaluate renal function tests", "Assess for signs of hemolysis", "Monitor blood glucose levels"],
    management: ["Administer phosphate replacement therapy as prescribed", "Encourage dietary sources of phosphorus (e.g., dairy, meat, nuts)", "Educate patients on avoiding excessive antacid use", "Monitor for signs of complications (e.g., muscle weakness)", "Adjust medications that may contribute to hypophosphatemia", "Collaborate with dietitians for nutritional counseling"],
    nursingActions: ["Monitor vital signs for changes", "Assess neurological status for confusion or seizures", "Evaluate muscle strength and function", "Check for signs of respiratory distress", "Monitor electrolyte levels regularly", "Assess for signs of infection or illness that may exacerbate condition"],
    pearls: ["Remember to assess for muscle weakness as it may indicate worsening hypophosphatemia.", "Monitor for changes in mental status, which can signal severe phosphate depletion.", "Educate patients on the importance of dietary phosphate to prevent recurrence."],
    signs: {
      left: ["Mild muscle weakness", "Fatigue", "Irritability", "Bone pain"],
      right: ["Severe muscle weakness", "Respiratory failure", "Seizures", "Cardiac arrhythmias"]
    },
    medications: [
      { name: "Sodium Phosphate", type: "Electrolyte replacement", action: "Increases serum phosphate levels", sideEffects: "Hyperphosphatemia", contra: "Severe renal impairment", pearl: "Monitor calcium levels to prevent precipitation of calcium phosphate" },
      { name: "Potassium Phosphate", type: "Electrolyte replacement", action: "Increases phosphate levels and provides potassium", sideEffects: "Diarrhea", contra: "Hyperkalemia", pearl: "Administer with food to reduce gastrointestinal upset" },
    ],
    quiz: [
      { question: "What is the most concerning sign of severe hypophosphatemia?", options: ["Mild muscle weakness", "Fatigue", "Seizures", "Bone pain"], correct: 2, rationale: "Seizures are a neurological emergency that indicates severe hypophosphatemia affecting brain function, while the other options are less severe signs." },
      { question: "Which nursing intervention is crucial for a patient receiving phosphate replacement therapy?", options: ["Monitor serum calcium levels", "Restrict fluid intake", "Encourage high-calcium foods", "Increase physical activity"], correct: 0, rationale: "Monitoring serum calcium levels is crucial to prevent complications such as hyperphosphatemia, while the other options are not priority actions in this context." },
    ],
  },
  "rn-hypoxia": {
    title: "Hypoxia",
    cellular: { title: "Pathophysiology of Hypoxia", content: "Hypoxia is a condition characterized by inadequate oxygen supply to tissues and cells, which can result from various etiologies. At the cellular level, hypoxia leads to a shift from aerobic to anaerobic metabolism due to insufficient oxygen. This metabolic change results in the accumulation of lactic acid, causing a drop in pH (acidosis), and ultimately affects ATP production, impairing cellular functions. Cells become less efficient, leading to cell injury and, if prolonged, cell death. The body compensates initially through increased heart rate and respiratory rate to enhance oxygen delivery. However, if the underlying cause of hypoxia is not addressed, organ systems begin to fail, and irreversible damage may occur. Effective oxygen transport is essential; therefore, conditions such as anemia, carbon monoxide poisoning, and pulmonary disorders can exacerbate hypoxia. The impact on various organ systems, particularly the brain and heart, underscores the critical need for prompt recognition and management." },
    riskFactors: ["Chronic lung disease (e.g., COPD, asthma)", "Anemia or low hemoglobin levels", "High altitudes or low atmospheric pressure", "Smoking or exposure to secondhand smoke", "Cardiovascular diseases (e.g., heart failure, shock)", "Severe infections (e.g., pneumonia, sepsis)", "Obesity hypoventilation syndrome", "Neuromuscular disorders (e.g., myasthenia gravis)"],
    diagnostics: ["Monitor arterial blood gases (ABG) for hypoxemia", "Assess oxygen saturation levels using pulse oximetry", "Expect respiratory rate changes (tachypnea or bradypnea)", "Evaluate hemoglobin and hematocrit levels", "Perform chest X-ray to identify underlying lung pathology", "Assess for cyanosis in lips and extremities", "Monitor vital signs for changes in heart rate and blood pressure", "Assess mental status and level of consciousness"],
    management: ["Administer supplemental oxygen as prescribed", "Position patient in high Fowler's or semi-Fowler's position", "Encourage deep breathing exercises to improve lung expansion", "Provide medications as ordered (e.g., bronchodilators, steroids)", "Educate patient on smoking cessation and pulmonary hygiene", "Collaborate with respiratory therapy for advanced interventions", "Monitor for potential complications such as respiratory failure", "Document all assessments and interventions thoroughly"],
    nursingActions: ["Assess oxygen saturation levels and report if < 92%", "Monitor respiratory effort and use of accessory muscles", "Evaluate the patient's response to oxygen therapy regularly", "Document changes in mental status and notify the physician", "Check for signs of respiratory distress every 15 minutes", "Assess for chest pain or discomfort indicating cardiac issues", "Ensure airway patency and suction as needed", "Reassess vital signs post-intervention for effectiveness"],
    pearls: ["Always assess for the underlying cause of hypoxia.", "Early recognition of hypoxia can prevent severe complications.", "Educate patients about the importance of adherence to treatment plans.", "Regularly monitor vital signs and oxygen saturation to detect deterioration."],
    signs: {
      left: ["Mild shortness of breath on exertion", "Increased heart rate (tachycardia)", "Slightly decreased oxygen saturation (92-95%)", "Mild cyanosis around lips or fingertips"],
      right: ["Severe dyspnea or inability to speak full sentences", "Cyanosis in the face and trunk", "Altered level of consciousness (confusion, lethargy)", "Bradycardia or hypotension indicating shock"]
    },
    medications: [
      { name: "Albuterol", type: "Bronchodilator", action: "Relaxes bronchial smooth muscle, leading to bronchodilation", sideEffects: "Tachycardia, nervousness", contra: "Hypersensitivity to albuterol", pearl: "Monitor heart rate closely; may need dose adjustments." },
      { name: "Oxygen", type: "Supplemental oxygen", action: "Increases the amount of oxygen available for inhalation", sideEffects: "Oxygen toxicity (especially at high concentrations)", contra: "Relative contraindication in certain COPD patients", pearl: "Titrate oxygen to maintain SpO2 > 92%." },
      { name: "Prednisone", type: "Corticosteroid", action: "Reduces inflammation in the airways", sideEffects: "Increased appetite, mood changes", contra: "Systemic fungal infections", pearl: "Monitor for signs of infection and glucose levels." },
    ],
    quiz: [
      { question: "Which nursing action is the priority for a patient exhibiting signs of hypoxia?", options: ["Administer bronchodilator medication", "Provide supplemental oxygen", "Position the patient in high Fowler's", "Assess level of consciousness"], correct: 1, rationale: "Providing supplemental oxygen is the immediate intervention to address hypoxia, while other actions can follow based on the patient's response." },
      { question: "What is a common late sign of hypoxia?", options: ["Increased heart rate", "Mild confusion", "Cyanosis", "Tachypnea"], correct: 2, rationale: "Cyanosis is a late sign indicating severe hypoxia, while increased heart rate, mild confusion, and tachypnea may occur in earlier stages." },
    ],
  },
};
