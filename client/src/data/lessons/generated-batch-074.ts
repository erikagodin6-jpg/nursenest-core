import type { LessonContent } from "./types";

export const generatedBatch074Lessons: Record<string, LessonContent> = {
  "penile-cancer-np": {
    title: "Penile Cancer: Staging & Surgical Management",
    cellular: { title: "Penile Cancer Pathophysiology", content: "Penile cancer is predominantly squamous cell carcinoma (>95%) arising from the epithelium of the glans, prepuce, or penile shaft. HPV types 16 and 18 are implicated in approximately 50% of cases, with viral E6/E7 oncoproteins inactivating p53 and Rb tumor suppressors respectively. Phimosis creates a chronic inflammatory microenvironment beneath the foreskin where smegma accumulation and poor hygiene promote carcinogenesis. Staging follows the TNM system: T1 (subepithelial invasion), T2 (corpus spongiosum/cavernosum), T3 (urethral invasion), T4 (adjacent structures). Inguinal lymph node involvement is the most important prognostic factor, with 5-year survival dropping from 85% (node-negative) to 29% (bilateral nodal disease)." },
    riskFactors: ["Phimosis (strongest risk factor — 10-fold increased risk)", "HPV infection (types 16, 18)", "Lack of neonatal circumcision", "Poor genital hygiene", "Smoking (2-5 fold increased risk)", "Chronic inflammatory conditions (lichen sclerosus/balanitis xerotica obliterans)", "UV phototherapy for psoriasis (PUVA treatment)", "Immunosuppression (HIV, transplant recipients)"],
    diagnostics: ["Punch or incisional biopsy of penile lesion for histopathological confirmation", "Physical examination of inguinal lymph nodes bilaterally", "CT or MRI of pelvis for nodal staging", "PET-CT for detection of distant metastases", "Sentinel lymph node biopsy for clinically node-negative patients with T1b or higher", "HPV testing of tumor specimen", "Chest CT for pulmonary metastasis screening"],
    management: ["Organ-sparing surgery for low-stage disease: wide local excision, glansectomy, Mohs micrographic surgery", "Partial penectomy with 2 cm margin for invasive disease (T2+)", "Total penectomy with perineal urethrostomy for advanced local disease", "Inguinal lymph node dissection for node-positive disease", "Neoadjuvant chemotherapy (TIP regimen: paclitaxel, ifosfamide, cisplatin) for bulky nodal disease", "Radiation therapy as alternative for early-stage disease or adjuvant post-surgery", "HPV vaccination (Gardasil 9) for primary prevention"],
    nursingActions: ["Provide sensitive, non-judgmental psychosexual counseling", "Coordinate multidisciplinary care (urology, oncology, psychology, wound care)", "Monitor surgical site for infection, wound dehiscence, and urethral stenosis", "Educate on perineal urethrostomy care if total penectomy performed", "Assess for depression, anxiety, and body image disturbance", "Provide information on sexual rehabilitation options"],
    assessmentFindings: ["Painless penile mass or ulcer (most common presentation)", "Phimosis or inability to retract foreskin (may conceal tumor)", "Inguinal lymphadenopathy (palpable fixed or mobile nodes)", "Foul-smelling discharge from under prepuce", "Urethral obstruction symptoms in advanced disease"],
    signs: {
      left: ["Painless papule or flat lesion on glans", "Localized, mobile, < 2 cm", "No palpable inguinal lymphadenopathy", "No urinary symptoms"],
      right: ["Fungating, ulcerated penile mass", "Fixed, bilateral inguinal lymphadenopathy", "Urethral obstruction or fistula", "Weight loss and systemic symptoms (metastatic disease)"]
    },
    medications: [
      { name: "Cisplatin", type: "Platinum-based alkylating agent", action: "Cross-links DNA strands preventing replication and triggering apoptosis in rapidly dividing tumor cells", sideEffects: "Nephrotoxicity (dose-limiting), severe nausea/vomiting, ototoxicity, peripheral neuropathy, myelosuppression", contra: "Pre-existing renal insufficiency, hearing impairment, pregnancy", pearl: "Aggressive pre- and post-hydration with NS required to prevent nephrotoxicity; monitor BUN/Cr, audiometry, and serum magnesium; antiemetic premedication mandatory (5-HT3 + dexamethasone + NK1 antagonist)" }
    ],
    pearls: ["Phimosis is the strongest risk factor — neonatal circumcision is virtually 100% protective", "HPV vaccination prevents approximately 50% of penile cancers", "Inguinal lymph node status is the single most important prognostic factor", "Organ-sparing approaches are preferred for early disease to preserve function and quality of life", "A penile lesion that does not heal within 4 weeks warrants biopsy regardless of appearance", "Psychosexual support is essential — body image and sexual function impact is profound"],
    quiz: [
      {
        question: "Which risk factor is most strongly associated with penile cancer?",
        options: ["Smoking", "HPV infection", "Phimosis", "Obesity"],
        correct: 2,
        rationale: "Phimosis carries a 10-fold increased risk of penile cancer due to chronic inflammation from smegma accumulation under a non-retractable foreskin. Neonatal circumcision is virtually completely protective."
      },
      {
        question: "What is the most important prognostic factor in penile cancer?",
        options: ["Tumor size", "HPV status", "Inguinal lymph node involvement", "Patient age"],
        correct: 2,
        rationale: "Inguinal lymph node involvement is the single most important prognostic factor, with 5-year survival dropping from 85% (node-negative) to 29% (bilateral nodal disease)."
      },
      {
        question: "A patient presents with a painless, non-healing penile lesion for 6 weeks. What is the most appropriate next step?",
        options: ["Prescribe topical antifungal cream", "Reassure and observe for another 6 weeks", "Perform punch or incisional biopsy", "Order CT scan"],
        correct: 2,
        rationale: "Any penile lesion that does not heal within 4 weeks requires biopsy to rule out malignancy. Delaying diagnosis worsens prognosis."
      }
    ]
  },
  "pe-pathophysiology-np": {
    title: "Pulmonary Embolism: Vascular Obstruction & Dead Space",
    cellular: { title: "PE Hemodynamic Cascade", content: "When a thrombus lodges in the pulmonary vasculature, it creates mechanical obstruction and triggers reflex vasoconstriction via thromboxane A2 and serotonin release from activated platelets. The obstructed segment becomes ventilated dead space — alveoli receive air but no blood flow, preventing gas exchange. Simultaneously, blood is shunted to non-obstructed lung zones, creating areas of low V/Q ratio and intrapulmonary shunting. In massive PE (>50% vascular occlusion), acute right ventricular afterload increases dramatically. The thin-walled RV cannot generate pressures >40 mmHg acutely, leading to RV dilation, interventricular septal bowing leftward (D-sign on echo), reduced LV filling, decreased cardiac output, and obstructive shock. Neurohormonal activation (catecholamine surge) initially compensates with tachycardia, but progressive RV ischemia from elevated wall tension and decreased coronary perfusion pressure leads to cardiovascular collapse." },
    riskFactors: ["Virchow's triad: stasis, endothelial injury, hypercoagulability", "Recent surgery (especially orthopedic — hip/knee replacement)", "Active malignancy (lung, pancreatic, brain, ovarian highest risk)", "Prolonged immobilization (>72 hours bed rest, long-haul travel)", "Prior VTE (30% recurrence risk without anticoagulation)", "Hormonal factors (OCP, HRT, pregnancy/postpartum)", "Hereditary thrombophilia (Factor V Leiden, prothrombin G20210A mutation)", "Obesity (BMI >30)", "Central venous catheter"],
    diagnostics: ["CTPA (CT pulmonary angiography) — definitive diagnostic imaging", "D-dimer with age-adjusted cutoff for low-probability patients", "ABG: hypoxemia, hypocapnia (respiratory alkalosis), elevated A-a gradient", "ECG: sinus tachycardia (most common), S1Q3T3 pattern, new RBBB, right axis deviation", "Troponin and BNP (RV strain biomarkers for risk stratification)", "Echocardiography: RV dilation, RV hypokinesis, McConnell sign (apical sparing), septal flattening", "Lower extremity duplex ultrasound (confirms DVT source in 50-70% of cases)"],
    management: ["Anticoagulation: LMWH or UFH bridging to DOAC or warfarin (minimum 3 months)", "Massive PE (with shock): systemic thrombolysis with alteplase 100 mg IV over 2 hours", "Submassive PE (RV strain without hypotension): close monitoring, consider catheter-directed therapy", "Surgical embolectomy for massive PE when thrombolysis contraindicated or failed", "IVC filter when anticoagulation absolutely contraindicated", "Hemodynamic support: cautious IV fluids (500 mL NS max — overloading dilated RV worsens septal shift), vasopressors (norepinephrine preferred)"],
    nursingActions: ["Initiate continuous telemetry and hemodynamic monitoring", "Administer heparin per weight-based protocol with aPTT monitoring", "Monitor for signs of hemodynamic deterioration (rising HR, falling BP, increasing O2 requirement)", "Position in semi-Fowler's to optimize ventilation", "Assess for bleeding complications of anticoagulation", "Restrict fluid administration — avoid RV volume overload"],
    assessmentFindings: ["Sudden-onset dyspnea (most common symptom)", "Pleuritic chest pain (sharp, worsened by inspiration)", "Tachycardia and tachypnea out of proportion to clinical picture", "Hemoptysis (pulmonary infarction)", "Jugular venous distension with clear lung fields (right heart failure without left heart congestion)", "Unilateral leg swelling (concurrent DVT)"],
    signs: {
      left: ["Pleuritic chest pain with exertion", "Mild tachycardia (HR 100-110)", "Normal blood pressure", "SpO2 92-95% on room air"],
      right: ["Severe dyspnea at rest with hypoxemia", "Hypotension (SBP < 90) — obstructive shock", "JVD with clear lungs (RV failure pattern)", "Syncope or PEA cardiac arrest"]
    },
    medications: [
      { name: "Alteplase (tPA)", type: "Fibrinolytic/thrombolytic", action: "Binds fibrin in thrombus and converts entrapped plasminogen to plasmin, directly dissolving the pulmonary embolus and restoring perfusion", sideEffects: "Major hemorrhage (intracranial hemorrhage 2-3%), reperfusion arrhythmias, angioedema (rare with alteplase)", contra: "Active internal bleeding, recent intracranial surgery or stroke (<3 months), intracranial neoplasm, known AVM, severe uncontrolled HTN", pearl: "100 mg IV over 2 hours for massive PE; hold heparin during infusion; indicated when PE causes sustained hypotension (SBP < 90 for > 15 min) or cardiac arrest" },
      { name: "Unfractionated Heparin (UFH)", type: "Indirect thrombin inhibitor", action: "Binds antithrombin III potentiating its inhibition of thrombin (factor IIa) and factor Xa, preventing clot propagation", sideEffects: "Bleeding, HIT (heparin-induced thrombocytopenia), osteoporosis with long-term use", contra: "Active major bleeding, history of HIT, severe thrombocytopenia", pearl: "80 units/kg bolus then 18 units/kg/hr drip; check aPTT every 6 hours until therapeutic (1.5-2.5× control); preferred over LMWH for massive PE and renal failure (short half-life, reversible with protamine)" }
    ],
    pearls: ["JVD with clear lungs = right heart failure pattern — think PE, RV infarct, tamponade, or tension pneumo", "Do NOT aggressively fluid-resuscitate PE patients — overloading a dilated RV worsens septal shift and cardiac output", "S1Q3T3 is classic but uncommon — sinus tachycardia is the most frequent ECG finding", "Massive PE = hemodynamic instability — this is the ONLY indication for systemic thrombolysis", "McConnell sign on echo (apical sparing of RV hypokinesis) is relatively specific for acute PE", "Half-dose tPA (50 mg) is used in cardiac arrest from PE"],
    quiz: [
      {
        question: "A patient with massive PE has SBP 75/40. The resident orders 2 liters of normal saline. Why is this problematic?",
        options: ["Normal saline is the wrong fluid — use lactated Ringer's", "Aggressive volume loading overloads the dilated RV, worsening septal shift and reducing LV filling", "The patient needs colloid, not crystalloid", "Fluid resuscitation should be delayed until after thrombolysis"],
        correct: 1,
        rationale: "In massive PE, the RV is already dilated from acute pressure overload. Adding excessive volume further distends the RV, pushes the septum leftward, reduces LV filling, and worsens cardiac output. Small fluid boluses (250-500 mL max) with vasopressors are preferred."
      },
      {
        question: "What does ventilated dead space mean in the context of pulmonary embolism?",
        options: ["Alveoli that are collapsed and not ventilated", "Alveoli that receive air but no blood flow due to vascular obstruction", "Extra bronchial space from hyperinflation", "Areas of pulmonary fibrosis"],
        correct: 1,
        rationale: "The embolus blocks perfusion to a lung segment. Those alveoli continue to be ventilated but receive no blood flow, so gas exchange cannot occur — this is dead space ventilation, the hallmark of PE pathophysiology."
      },
      {
        question: "An echo in acute PE shows RV dilation with apical sparing of hypokinesis. What is this finding called?",
        options: ["Takotsubo pattern", "McConnell sign", "D-sign", "Kussmaul sign"],
        correct: 1,
        rationale: "McConnell sign is RV free wall hypokinesis with preserved apical contractility, a relatively specific echocardiographic finding for acute PE that helps distinguish it from other causes of RV failure."
      }
    ]
  },
  "peptic-ulcer-basics-rpn": {
    title: "Peptic Ulcer Disease Basics",
    cellular: { title: "How Peptic Ulcers Form", content: "A peptic ulcer is an open sore in the lining of the stomach (gastric ulcer) or the first part of the small intestine (duodenal ulcer). Ulcers form when the protective mucous barrier of the GI lining is damaged, allowing stomach acid to erode the tissue underneath. The two most common causes are infection with the bacterium Helicobacter pylori (H. pylori) and chronic use of NSAIDs (ibuprofen, naproxen, aspirin), which reduce protective prostaglandin production. Duodenal ulcers are more common and typically cause burning epigastric pain that improves with eating, while gastric ulcers cause pain that worsens with eating." },
    riskFactors: ["H. pylori infection (most common cause)", "Chronic NSAID use (ibuprofen, aspirin, naproxen)", "Smoking (impairs mucosal healing)", "Excessive alcohol use", "Stress (ICU patients — stress ulcers)", "Family history of peptic ulcer disease", "Older age"],
    diagnostics: ["H. pylori testing: stool antigen test, urea breath test, or biopsy during endoscopy", "CBC to check for anemia (chronic blood loss)", "Stool guaiac test (occult blood)", "Upper endoscopy (EGD) for direct visualization if alarm symptoms present", "Monitor vital signs for signs of bleeding (tachycardia, hypotension)"],
    management: ["Give prescribed acid-reducing medications (PPIs) as ordered", "Administer H. pylori antibiotic treatment if infection confirmed", "Avoid NSAIDs — use acetaminophen for pain instead", "Small frequent meals rather than large meals", "Stop smoking", "Follow up for H. pylori eradication testing after treatment"],
    nursingActions: ["Assess epigastric pain characteristics: timing related to meals, severity, duration", "Monitor stool color and consistency (black tarry stools = bleeding)", "Administer PPIs 30 minutes before meals as ordered", "Educate patient to avoid NSAIDs, alcohol, and smoking", "Report signs of bleeding: hematemesis, melena, dizziness, tachycardia", "Monitor intake and output and nutritional status"],
    assessmentFindings: ["Epigastric burning or gnawing pain", "Relationship of pain to meals (duodenal = relieved by food, gastric = worsened)", "Nausea or vomiting", "Heartburn or acid reflux", "Dark tarry stools (melena) if bleeding", "Weight loss with gastric ulcers"],
    signs: {
      left: ["Intermittent epigastric burning pain", "Pain related to meals", "Mild nausea or bloating", "Positive H. pylori test"],
      right: ["Hematemesis (vomiting blood or coffee-ground emesis)", "Melena (black, tarry stools)", "Sudden severe abdominal pain with rigid abdomen (perforation)", "Tachycardia and hypotension (hemorrhage)"]
    },
    medications: [{
      name: "Omeprazole",
      type: "Proton pump inhibitor (PPI)",
      action: "Blocks the acid-producing pump in stomach cells, dramatically reducing stomach acid production",
      sideEffects: "Headache, diarrhea, nausea, increased risk of C. difficile infection with long-term use",
      contra: "Known allergy; long-term use may reduce calcium and magnesium absorption",
      pearl: "Take 30 minutes BEFORE breakfast for best effect; allow 4-8 weeks for ulcer healing"
    }],
    pearls: ["The two main causes of ulcers are H. pylori and NSAIDs — ask about both", "Duodenal ulcer pain IMPROVES with eating; gastric ulcer pain WORSENS with eating", "Black tarry stools (melena) = upper GI bleeding — report immediately", "PPIs work best when taken 30 minutes before the first meal of the day", "Avoid NSAIDs — switch to acetaminophen for pain", "Coffee-ground emesis indicates upper GI bleeding — report immediately"],
    quiz: [
      {
        question: "A patient with a duodenal ulcer says their pain gets better when they eat. Is this expected?",
        options: ["No — eating should make ulcer pain worse", "Yes — duodenal ulcer pain typically improves with food because food buffers the acid", "No — ulcer pain is not related to meals", "Yes — but only if they eat spicy food"],
        correct: 1,
        rationale: "Duodenal ulcer pain classically improves with eating because food neutralizes acid in the duodenum. Pain returns 2-3 hours later when the stomach empties. Gastric ulcer pain, conversely, worsens with eating."
      },
      {
        question: "A patient taking ibuprofen daily for arthritis develops epigastric pain. What is the most likely connection?",
        options: ["Ibuprofen causes dehydration leading to stomach pain", "NSAIDs like ibuprofen reduce protective prostaglandins in the stomach lining, increasing ulcer risk", "Ibuprofen is too strong a pain reliever", "There is no connection between ibuprofen and stomach pain"],
        correct: 1,
        rationale: "NSAIDs inhibit COX enzymes that produce protective prostaglandins in the gastric mucosa. Without these prostaglandins, the mucous barrier weakens and acid damages the underlying tissue, causing ulcers."
      },
      {
        question: "A patient with a peptic ulcer has black, tarry stools. What does this indicate?",
        options: ["A normal side effect of PPI medications", "Iron supplementation side effect", "Upper GI bleeding (melena) requiring immediate reporting", "The ulcer has healed"],
        correct: 2,
        rationale: "Black tarry stools (melena) indicate upper GI bleeding. Blood from a bleeding ulcer is digested as it passes through the GI tract, turning black and tarry. This requires immediate assessment and notification."
      }
    ]
  },
  "peptic-ulcer-patho-np": {
    title: "Peptic Ulcer Pathophysiology",
    cellular: { title: "PUD Mucosal Defense & Injury", content: "Peptic ulcer disease results from an imbalance between aggressive factors (hydrochloric acid, pepsin, H. pylori virulence factors, NSAIDs) and protective mechanisms (mucus-bicarbonate barrier, prostaglandin-mediated mucosal blood flow, epithelial cell renewal). H. pylori colonizes the gastric antrum, produces urease to create an alkaline microenvironment, and releases virulence factors (CagA, VacA) that disrupt tight junctions, induce epithelial apoptosis, and trigger chronic inflammation. NSAIDs inhibit COX-1, reducing prostaglandin E2 and I2 synthesis, which decreases mucosal blood flow, bicarbonate secretion, and epithelial cell proliferation. Duodenal ulcers result from H. pylori-induced antral gastritis causing excessive gastrin release and acid hypersecretion, while gastric ulcers involve direct mucosal injury with normal or reduced acid output." },
    riskFactors: ["H. pylori infection (present in 60-70% of gastric ulcers and 90-95% of duodenal ulcers)", "Chronic NSAID use (dose-dependent risk, increased with age >60)", "Smoking (delays ulcer healing, increases recurrence)", "Prior PUD history", "Concurrent anticoagulant or corticosteroid use with NSAIDs", "Zollinger-Ellison syndrome (gastrinoma)", "Critical illness (stress ulcers in ICU patients)", "High-dose corticosteroid therapy alone (controversial, risk increases with concurrent NSAID)"],
    diagnostics: ["Upper endoscopy (EGD) — gold standard for visualization, biopsy, and H. pylori testing", "H. pylori testing: urea breath test (UBT), stool antigen test, or endoscopic biopsy with rapid urease test (CLO test)", "Fasting serum gastrin level if Zollinger-Ellison syndrome suspected (>1000 pg/mL diagnostic)", "Secretin stimulation test for gastrinoma confirmation", "CBC (iron deficiency anemia from chronic blood loss)", "BUN:creatinine ratio (elevated BUN suggests upper GI bleeding with protein absorption)"],
    management: ["H. pylori eradication: triple therapy (PPI + clarithromycin + amoxicillin × 14 days) or bismuth quadruple therapy", "PPI therapy for 4-8 weeks (gastric ulcers typically need 8 weeks)", "Discontinue NSAIDs; if NSAID must continue, add PPI prophylaxis and use lowest effective dose", "Confirm H. pylori eradication with UBT or stool antigen 4+ weeks after completing treatment (off PPI for 1-2 weeks)", "Endoscopic hemostasis for actively bleeding ulcers (epinephrine injection + thermal or clip)", "Surgical intervention for refractory bleeding, perforation, or gastric outlet obstruction"],
    nursingActions: ["Obtain detailed medication history including NSAID, aspirin, and supplement use", "Coordinate H. pylori testing before initiating antibiotic therapy", "Educate on medication adherence for full antibiotic course (incomplete treatment promotes resistance)", "Monitor for signs of complications: hemorrhage, perforation, obstruction", "Hold PPIs and bismuth for 1-2 weeks and antibiotics for 4 weeks before H. pylori eradication testing", "Counsel on smoking cessation and NSAID avoidance"],
    assessmentFindings: ["Burning epigastric pain (most common symptom)", "Timing pattern: duodenal ulcer pain 2-3 hours after meals and at night, relieved by food/antacids; gastric ulcer pain worsened by food", "Nausea, early satiety, bloating", "Weight loss (more common with gastric ulcers)", "Hematemesis or melena (GI bleeding)", "Epigastric tenderness on palpation"],
    signs: {
      left: ["Intermittent epigastric pain related to meals", "Positive H. pylori test", "Mild epigastric tenderness", "Normal hemoglobin"],
      right: ["Coffee-ground emesis or hematemesis (hemorrhage)", "Sudden severe epigastric pain with rigid abdomen and rebound tenderness (perforation)", "Persistent vomiting with succussion splash (gastric outlet obstruction)", "Hemodynamic instability (massive hemorrhage)"]
    },
    medications: [
      { name: "Pantoprazole", type: "Proton pump inhibitor", action: "Irreversibly inhibits H+/K+ ATPase (proton pump) on gastric parietal cell apical membrane, blocking the final step of acid secretion", sideEffects: "Headache, diarrhea, hypomagnesemia, C. difficile risk, bone fracture risk with long-term use, vitamin B12 malabsorption", contra: "Concomitant rilpivirine (reduced absorption); caution with long-term use", pearl: "IV pantoprazole 80 mg bolus then 8 mg/hr drip for acute GI bleeding; oral PPI 30 min before meals; must be taken before eating to be effective (proton pumps are only active during meals)" },
      { name: "Clarithromycin", type: "Macrolide antibiotic", action: "Binds 50S ribosomal subunit inhibiting bacterial protein synthesis; key component of H. pylori triple therapy", sideEffects: "Metallic taste, diarrhea, nausea, QT prolongation, hepatotoxicity", contra: "History of cholestatic jaundice, concurrent QT-prolonging drugs, colchicine with renal/hepatic impairment", pearl: "Clarithromycin resistance is increasing (15-20%) — use bismuth quadruple therapy in areas with >15% resistance or if patient previously received macrolide antibiotics" }
    ],
    pearls: ["H. pylori is present in 90-95% of duodenal ulcers and 60-70% of gastric ulcers — always test", "PPIs must be taken 30 minutes BEFORE meals — they only block actively secreting proton pumps", "Confirm H. pylori eradication 4+ weeks after treatment — recurrence rate is high if not eradicated", "Coffee-ground emesis = upper GI bleed: old blood digested by acid looks like coffee grounds", "Gastric ulcers require repeat endoscopy after healing to rule out malignancy; duodenal ulcers do NOT", "Zollinger-Ellison syndrome: consider when ulcers are refractory to PPIs, multiple, or in unusual locations (distal duodenum, jejunum)"],
    quiz: [
      {
        question: "Why do gastric ulcers require follow-up endoscopy after treatment but duodenal ulcers typically do not?",
        options: ["Gastric ulcers heal more slowly", "Gastric ulcers may harbor underlying malignancy that looks like a benign ulcer", "Duodenal ulcers are always benign", "Gastric ulcers are more painful"],
        correct: 1,
        rationale: "Gastric carcinoma can present as an ulcerated lesion indistinguishable from a benign ulcer on initial endoscopy. Follow-up endoscopy with repeat biopsy confirms healing and excludes malignancy. Duodenal ulcers are virtually never malignant."
      },
      {
        question: "A patient completed H. pylori triple therapy 2 weeks ago. When should eradication be confirmed?",
        options: ["Immediately after finishing antibiotics", "4+ weeks after treatment completion, with PPI held for 1-2 weeks before testing", "Testing is not needed if symptoms resolve", "6 months after treatment"],
        correct: 1,
        rationale: "Eradication testing should be done ≥ 4 weeks after completing antibiotics, with PPIs held for 1-2 weeks before testing (PPIs suppress H. pylori without eradicating it, causing false negatives)."
      },
      {
        question: "Which mechanism explains why NSAIDs cause peptic ulcers?",
        options: ["NSAIDs directly produce acid in the stomach", "NSAIDs inhibit COX-1, reducing protective prostaglandins that maintain mucosal blood flow and bicarbonate secretion", "NSAIDs kill H. pylori but damage surrounding tissue", "NSAIDs increase gastrin secretion"],
        correct: 1,
        rationale: "COX-1-derived prostaglandins (PGE2, PGI2) maintain gastric mucosal integrity by promoting blood flow, mucus/bicarbonate secretion, and epithelial renewal. NSAID inhibition of COX-1 removes these protections."
      }
    ]
  },
  "percussion-patterns-np": {
    title: "Percussion Patterns",
    cellular: { title: "Physics of Percussion Assessment", content: "Percussion generates sound waves by striking the body surface, with the resulting resonance determined by the density and air content of underlying tissues. The five percussion notes are: (1) Tympany — drum-like, highest amplitude, heard over gas-filled organs (stomach, bowel); (2) Hyperresonance — booming, lower pitch, heard over hyperinflated lung (emphysema, pneumothorax); (3) Resonance — normal lung sound, hollow quality; (4) Dullness — thud-like, heard over solid organs (liver, heart) or fluid-filled spaces (pleural effusion, consolidation); (5) Flatness — absolute dullness, heard over dense tissue (muscle, bone). Percussion assessment enables detection of pneumothorax (hyperresonance), pleural effusion (dullness with shifting), consolidation (dullness), ascites (shifting dullness), and organomegaly before imaging is available." },
    riskFactors: ["Conditions causing abnormal percussion findings:", "Pneumothorax (hyperresonance on affected side)", "Pleural effusion (dullness at lung base with decreased breath sounds)", "Pneumonia with consolidation (dullness with bronchial breath sounds)", "COPD/emphysema (diffuse hyperresonance with low diaphragms)", "Ascites (shifting dullness, fluid wave)", "Hepatomegaly or splenomegaly (extended dullness beyond normal organ borders)"],
    diagnostics: ["Perform systematic chest percussion: compare symmetrical areas bilaterally", "Percuss anterior, lateral, and posterior chest from apex to base", "Identify diaphragmatic excursion by percussing during inspiration and expiration (normal 3-5 cm)", "Percuss liver span at right midclavicular line (normal 6-12 cm)", "Perform abdominal percussion in all four quadrants", "Assess for shifting dullness (ascites) by percussing with patient supine then on side"],
    management: ["Correlate percussion findings with auscultation, palpation, and inspection", "Order confirmatory imaging based on abnormal percussion findings", "Hyperresonant hemithorax: emergent chest X-ray or needle decompression if tension pneumothorax suspected", "Dull lung base with decreased breath sounds: chest X-ray and consider thoracentesis for effusion", "Shifting dullness with abdominal distension: abdominal ultrasound for ascites quantification", "Document percussion findings with precise anatomical location and comparison to contralateral side"],
    nursingActions: ["Use correct percussion technique: hyperextend middle finger of non-dominant hand flat against chest wall, strike with tip of dominant middle finger", "Percuss systematically comparing side to side at same levels", "Document abnormal findings with precise location", "Report new hyperresonance (pneumothorax risk) or new dullness (effusion/consolidation) immediately", "Assess liver span and report hepatomegaly", "Evaluate diaphragmatic excursion for symmetry"],
    assessmentFindings: ["Normal resonance over lung fields bilaterally", "Dullness over heart (left 3rd-5th intercostal space) and liver (right 5th ICS to costal margin)", "Tympany over gastric bubble (left upper quadrant/Traube space)", "Diaphragmatic excursion 3-5 cm bilaterally and symmetric", "Shifting dullness absent (no ascites)", "Liver span 6-12 cm at right midclavicular line"],
    signs: {
      left: ["Bilateral resonance over lung fields", "Liver dullness within normal span", "Tympany over gastric bubble (Traube space)", "Symmetric diaphragmatic excursion"],
      right: ["Unilateral hyperresonance (pneumothorax)", "Dullness at lung base with decreased breath sounds (effusion)", "Shifting dullness with distended abdomen (ascites)", "Absent liver dullness (free air — perforated viscus)"]
    },
    medications: [
      { name: "No specific medications for percussion assessment", type: "Physical assessment skill", action: "Percussion is a diagnostic technique, not a treatment — findings guide medication and treatment decisions", sideEffects: "N/A", contra: "N/A", pearl: "Loss of normal liver dullness (replaced by tympany) suggests free intraperitoneal air from a perforated viscus — this is a surgical emergency" }
    ],
    pearls: ["The five percussion notes in order of increasing density: tympany → hyperresonance → resonance → dullness → flatness", "Hyperresonance on one side = pneumothorax until proven otherwise", "Dullness at lung base that shifts with position change = pleural effusion (not consolidation)", "Absence of liver dullness (tympany over liver area) = possible pneumoperitoneum from perforated viscus — surgical emergency", "Always compare percussion findings bilaterally and symmetrically — asymmetry is the key finding", "Diaphragmatic excursion < 3 cm or asymmetric suggests phrenic nerve palsy, effusion, or elevated hemidiaphragm"],
    quiz: [
      {
        question: "A nurse percusses the right lower chest and finds dullness where resonance was present yesterday. What should be suspected?",
        options: ["Normal variation", "New pleural effusion or consolidation", "Pneumothorax", "Gastric distension"],
        correct: 1,
        rationale: "A change from resonance to dullness at the lung base suggests fluid accumulation (pleural effusion) or consolidation (pneumonia). This new finding requires further assessment and imaging."
      },
      {
        question: "Percussion over the right upper quadrant reveals tympany instead of expected liver dullness. What does this suggest?",
        options: ["Normal variant", "Free intraperitoneal air (pneumoperitoneum) from perforated viscus", "Liver failure", "Ascites"],
        correct: 1,
        rationale: "Absence of normal liver dullness replaced by tympany suggests free air in the peritoneal cavity from a perforated viscus, which is a surgical emergency requiring immediate attention."
      },
      {
        question: "A patient with severe emphysema would have which percussion finding over the chest?",
        options: ["Dullness bilaterally", "Hyperresonance bilaterally with low diaphragms", "Flatness bilaterally", "Normal resonance"],
        correct: 1,
        rationale: "Emphysema causes air trapping and hyperinflation of the lungs, producing bilateral hyperresonance on percussion. The diaphragms are pushed down (low and flat) due to hyperinflated lungs."
      }
    ]
  },  "perfusion-pressure-np": {
    title: "Perfusion Pressure",
    cellular: { title: "Cerebral & Organ Perfusion Pressure Physiology", content: "Perfusion pressure is the net pressure gradient driving blood flow through an organ's vascular bed, calculated as the difference between arterial inflow pressure and venous outflow pressure (or, in the case of the brain, intracranial pressure). Cerebral perfusion pressure (CPP) = Mean Arterial Pressure (MAP) - Intracranial Pressure (ICP), with the target CPP typically 60-70 mmHg. The brain autoregulates blood flow across a MAP range of 60-150 mmHg through myogenic and metabolic mechanisms that dilate or constrict cerebral arterioles. When MAP falls below the autoregulatory range or ICP rises, CPP drops below the ischemic threshold, causing neuronal injury. Similarly, renal perfusion requires MAP > 65 mmHg to maintain glomerular filtration, and abdominal perfusion pressure (APP = MAP - intra-abdominal pressure) becomes critical in abdominal compartment syndrome." },
    riskFactors: ["Traumatic brain injury (elevated ICP reducing CPP)", "Hemorrhagic or ischemic stroke", "Brain tumor with mass effect", "Hydrocephalus", "Shock states (hemorrhagic, septic, cardiogenic — reduced MAP)", "Abdominal compartment syndrome (elevated IAP reducing APP)", "Chronic hypertension (autoregulatory curve shifted rightward — higher MAP needed for adequate CPP)"],
    diagnostics: ["Calculate MAP: (SBP + 2×DBP) ÷ 3 or use arterial line for continuous monitoring", "ICP monitoring via EVD (external ventricular drain) or intraparenchymal monitor", "Calculate CPP = MAP - ICP (target 60-70 mmHg)", "Measure intra-abdominal pressure via bladder catheter transducer (normal < 12 mmHg)", "Calculate APP = MAP - IAP (target > 60 mmHg)", "Monitor cerebral oxygenation (SjvO2, PbtO2) as perfusion adequacy measures", "Transcranial Doppler for cerebral blood flow velocity assessment"],
    management: ["Maintain CPP 60-70 mmHg through MAP optimization and ICP reduction", "ICP reduction: head of bed 30°, sedation, osmotic therapy (mannitol, hypertonic saline), CSF drainage via EVD", "MAP support: vasopressors (norepinephrine first-line), IV fluids to maintain euvolemia", "Avoid hypotension (SBP < 90 even briefly in TBI doubles mortality)", "Abdominal compartment syndrome: decompressive laparotomy when IAP > 20 mmHg with organ dysfunction", "Tier-based ICP management: stepwise escalation from positioning → sedation → osmotic therapy → hypothermia → decompressive craniectomy"],
    nursingActions: ["Monitor ICP, MAP, and CPP continuously via invasive monitors", "Maintain head of bed at 30° with head midline (prevents jugular venous compression)", "Report CPP < 60 mmHg or ICP > 20 mmHg immediately", "Prevent ICP spikes: avoid coughing, straining, Valsalva; pre-medicate before suctioning", "Administer osmotic agents (mannitol, 3% saline) per protocol and monitor serum osmolality and sodium", "Monitor neurological status with Glasgow Coma Scale every 1-2 hours"],
    assessmentFindings: ["ICP value (normal < 15 mmHg, treat if > 20-22 mmHg)", "CPP value (target 60-70 mmHg)", "MAP value (maintain per prescriber parameters)", "Neurological status: GCS, pupil size and reactivity, motor function", "Signs of herniation: Cushing triad (HTN, bradycardia, irregular respirations), fixed dilated pupil", "IAP measurement via bladder transducer for abdominal perfusion monitoring"],
    signs: {
      left: ["CPP 60-70 mmHg (adequate cerebral perfusion)", "ICP < 15 mmHg", "GCS stable, pupils equal and reactive", "MAP within autoregulatory range"],
      right: ["CPP < 50 mmHg (ischemic threshold)", "ICP > 20 mmHg sustained", "Cushing triad (HTN, bradycardia, irregular respirations — brainstem herniation)", "Fixed, dilated pupil (uncal herniation)"]
    },
    medications: [
      { name: "Mannitol", type: "Osmotic diuretic", action: "Creates osmotic gradient pulling water from brain parenchyma into intravascular space, reducing cerebral edema and ICP", sideEffects: "Dehydration, electrolyte imbalances, rebound ICP elevation, acute kidney injury at high serum osmolality", contra: "Serum osmolality > 320 mOsm/kg, severe dehydration, anuria", pearl: "Dose 0.25-1 g/kg IV bolus over 15-20 min; onset 15-30 min, duration 4-6 hours; must monitor serum osmolality (hold if >320) and replace urinary fluid losses" },
      { name: "Hypertonic Saline (3%)", type: "Hyperosmolar agent", action: "Creates osmotic gradient similar to mannitol but also expands intravascular volume, supporting MAP and CPP simultaneously", sideEffects: "Hypernatremia, central pontine myelinolysis (if corrected too rapidly in chronic hyponatremia), phlebitis", contra: "Hypernatremia (Na > 160 mEq/L)", pearl: "250 mL bolus of 3% NaCl over 15-20 min for acute ICP crisis; advantage over mannitol: does not cause diuresis, so supports MAP/CPP while lowering ICP; preferred in hypotensive patients" }
    ],
    pearls: ["CPP = MAP - ICP: you can improve CPP by either raising MAP or lowering ICP", "Even brief episodes of SBP < 90 in TBI double mortality — avoid hypotension at all costs", "Head of bed 30° with head midline optimizes venous drainage and reduces ICP without affecting CPP", "Hypertonic saline is preferred over mannitol in hypotensive patients because it expands volume while reducing ICP", "Chronic hypertension shifts the autoregulatory curve rightward — these patients need HIGHER MAP targets", "Cushing triad (hypertension + bradycardia + irregular respirations) is a LATE sign of brainstem herniation — do not wait for it"],
    quiz: [
      {
        question: "A TBI patient has MAP 80 mmHg and ICP 25 mmHg. What is the CPP and what action is needed?",
        options: ["CPP 55 mmHg — below target; treat elevated ICP and/or raise MAP", "CPP 105 mmHg — too high, reduce MAP", "CPP 55 mmHg — acceptable, continue monitoring", "CPP cannot be calculated without additional data"],
        correct: 0,
        rationale: "CPP = MAP - ICP = 80 - 25 = 55 mmHg. Target CPP is 60-70 mmHg, so 55 is below target. Interventions should focus on reducing ICP (mannitol, hypertonic saline, CSF drainage) and supporting MAP."
      },
      {
        question: "Why is hypertonic saline preferred over mannitol in a hypotensive TBI patient?",
        options: ["Hypertonic saline works faster", "Hypertonic saline expands intravascular volume (supporting MAP) while reducing ICP, whereas mannitol causes diuresis which can worsen hypotension", "Mannitol is more expensive", "Hypertonic saline has fewer side effects overall"],
        correct: 1,
        rationale: "Mannitol is an osmotic diuretic that can exacerbate hypotension through volume loss. Hypertonic saline draws water from the brain while expanding plasma volume, supporting both MAP and CPP simultaneously."
      },
      {
        question: "A nurse positions a TBI patient flat for a procedure. ICP spikes from 15 to 28. What is the mechanism?",
        options: ["The flat position caused pain-related ICP elevation", "Lowering the head below heart level impairs cerebral venous drainage, increasing cerebral blood volume and ICP", "The flat position compressed the brain directly", "ICP monitors are inaccurate when the patient is flat"],
        correct: 1,
        rationale: "Head elevation promotes cerebral venous drainage via gravity. When the patient is flat, venous outflow is impeded, increasing cerebral blood volume and ICP. The head of bed should be maintained at 30° with head midline."
      }
    ]
  },
  "pericardial-mesothelioma-rn": {
    title: "Pericardial Mesothelioma",
    cellular: { title: "Pericardial Mesothelioma Pathophysiology", content: "Pericardial mesothelioma is an extremely rare primary malignancy of the pericardial mesothelial lining, accounting for less than 1% of all mesotheliomas. Unlike pleural mesothelioma where asbestos exposure is clearly established, pericardial mesothelioma has an inconsistent association with asbestos. The tumor grows diffusely along the pericardial surface, causing progressive pericardial thickening, hemorrhagic effusion, and ultimately constrictive physiology. The pericardial effusion restricts cardiac filling during diastole, leading to cardiac tamponade if fluid accumulates rapidly. Symptoms mimic constrictive pericarditis or tamponade, making diagnosis extremely challenging — most cases are diagnosed at autopsy or during surgery for presumed benign pericardial disease." },
    riskFactors: ["Asbestos exposure (inconsistent but reported association)", "Prior radiation therapy to the chest", "Male sex (slight predominance)", "Age 40-70 years", "History of other asbestos-related disease (pleural mesothelioma, asbestosis)"],
    diagnostics: ["Echocardiogram showing pericardial effusion and thickening", "CT or MRI of chest demonstrating pericardial mass or irregular thickening", "Pericardiocentesis with cytology (low diagnostic yield — 25-50%)", "Pericardial biopsy via pericardioscopy or surgical pericardial window (definitive)", "PET-CT for staging and metastatic evaluation", "Cardiac catheterization showing elevated and equalized diastolic filling pressures"],
    management: ["Pericardiocentesis for symptomatic tamponade (palliative drainage)", "Pericardiectomy when feasible (surgical resection — often incomplete due to diffuse involvement)", "Chemotherapy: cisplatin/pemetrexed regimen (extrapolated from pleural mesothelioma data)", "Radiation therapy for local symptom control", "Repeat pericardial drainage or pericardial window for recurrent effusions", "Palliative care consultation early given poor prognosis (median survival 6-10 months)"],
    nursingActions: ["Monitor for signs of cardiac tamponade: Beck's triad (muffled heart sounds, JVD, hypotension)", "Assess for pulsus paradoxus (SBP drop > 10 mmHg during inspiration)", "Monitor hemodynamic status including heart rate, blood pressure, and central venous pressure", "Maintain pericardial drain if placed: monitor output, prevent kinking, assess for infection", "Provide psychosocial support given grave prognosis", "Coordinate palliative care and advance care planning discussions"],
    assessmentFindings: ["Progressive dyspnea on exertion", "Chest pain (often positional, pleuritic)", "Peripheral edema and JVD (right heart failure physiology)", "Muffled heart sounds", "Pericardial friction rub (early)", "Pulsus paradoxus (> 10 mmHg SBP variation with respiration)"],
    signs: {
      left: ["Exertional dyspnea with mild pericardial effusion", "Distant heart sounds", "Mild peripheral edema", "Low-grade fatigue and malaise"],
      right: ["Beck's triad (hypotension, JVD, muffled heart sounds — tamponade)", "Pulsus paradoxus > 10 mmHg", "Electrical alternans on ECG (swinging heart in fluid)", "Hemodynamic collapse requiring emergent pericardiocentesis"]
    },
    medications: [
      { name: "Pemetrexed", type: "Antifolate chemotherapy agent", action: "Inhibits multiple folate-dependent enzymes (thymidylate synthase, DHFR, GARFT) disrupting DNA and RNA synthesis in mesothelioma cells", sideEffects: "Myelosuppression, mucositis, nausea, fatigue, rash, renal toxicity", contra: "CrCl < 45 mL/min, severe myelosuppression, pregnancy", pearl: "Must supplement with folic acid (400 mcg daily) and vitamin B12 (1000 mcg IM every 9 weeks) starting 1 week before first dose to reduce hematologic and GI toxicity; dexamethasone premedication prevents skin rash" }
    ],
    pearls: ["Pericardial mesothelioma is extremely rare — often diagnosed post-mortem or incidentally during cardiac surgery", "Beck's triad (JVD, hypotension, muffled heart sounds) = cardiac tamponade — emergent pericardiocentesis needed", "Pulsus paradoxus > 10 mmHg is a key bedside sign of tamponade", "Electrical alternans on ECG (alternating QRS amplitude) suggests a large pericardial effusion with the heart swinging within fluid", "Prognosis is extremely poor (median survival 6-10 months) — early palliative care consultation is essential", "Pericardial cytology has low sensitivity — surgical biopsy often needed for diagnosis"],
    quiz: [
      {
        question: "A patient with pericardial mesothelioma develops JVD, hypotension, and muffled heart sounds. What is occurring?",
        options: ["Pulmonary embolism", "Cardiac tamponade (Beck's triad)", "Myocardial infarction", "Pneumothorax"],
        correct: 1,
        rationale: "JVD + hypotension + muffled heart sounds is Beck's triad, the classic presentation of cardiac tamponade. The pericardial effusion compresses the heart, preventing adequate filling and reducing cardiac output."
      },
      {
        question: "What bedside assessment finding supports the diagnosis of cardiac tamponade?",
        options: ["Bounding pulses", "Pulsus paradoxus > 10 mmHg (SBP drop > 10 during inspiration)", "Wide pulse pressure", "Third heart sound (S3)"],
        correct: 1,
        rationale: "Pulsus paradoxus (exaggerated SBP drop during inspiration > 10 mmHg) occurs in tamponade because the fluid-filled pericardium restricts cardiac expansion, and inspiratory venous return preferentially fills the RV at the expense of LV filling."
      },
      {
        question: "Why is the pericardial cytology diagnostic yield low for pericardial mesothelioma?",
        options: ["The tumor does not shed cells", "Mesothelioma cells are difficult to distinguish from reactive mesothelial cells on cytology alone", "Pericardial fluid is always too bloody for analysis", "The tumor only grows outside the pericardium"],
        correct: 1,
        rationale: "Mesothelioma cells can be morphologically similar to reactive mesothelial cells, making cytologic diagnosis difficult. Surgical biopsy with immunohistochemistry is often needed for definitive diagnosis."
      }
    ]
  },  "peripheral-neuropathy-basics-rpn": {
    title: "Peripheral Neuropathy Basics",
    cellular: { title: "Pathophysiology of Peripheral Neuropathy", content: "Peripheral neuropathy refers to damage or dysfunction of the peripheral nerves (those outside the brain and spinal cord), resulting in sensory, motor, or autonomic symptoms depending on which nerve fibers are affected. It is extremely common, affecting up to 8% of the general population and up to 50% of patients with diabetes.\n\nPeripheral nerves contain three types of fibers: sensory (carrying touch, pain, temperature, and position information from the body to the brain), motor (carrying movement commands from the brain to muscles), and autonomic (controlling involuntary functions like blood pressure, heart rate, digestion, and sweating). Neuropathy can affect any combination of these fiber types.\n\nThe two main patterns of nerve damage are axonal degeneration and demyelination. In axonal degeneration (the most common), the axon itself is damaged, typically starting at the most distal portions (the longest nerves are affected first). This produces the characteristic stocking-glove distribution where symptoms begin in the toes and feet, progress to the ankles and calves, and eventually involve the fingertips and hands. The pathophysiology involves metabolic damage to the axon from hyperglycemia (diabetic neuropathy), toxins (alcohol, chemotherapy), nutritional deficiencies (B12, thiamine), or ischemia.\n\nIn demyelinating neuropathy, the myelin sheath is damaged while the axon is preserved initially. This produces motor weakness and areflexia more prominently than sensory symptoms. Guillain-Barre syndrome is the classic acute demyelinating neuropathy.\n\nDiabetic peripheral neuropathy, the most common form, occurs through several mechanisms: hyperglycemia activates the polyol pathway, converting glucose to sorbitol which accumulates in nerve cells and causes osmotic damage. Advanced glycation end-products (AGEs) damage nerve proteins and blood vessel walls. Microvascular disease reduces blood supply to peripheral nerves (vasa nervorum), causing ischemic nerve injury.\n\nFor RPNs, the critical nursing priorities are fall prevention (patients with sensory neuropathy cannot feel their feet properly), foot care education (especially for diabetic patients who may not feel injuries), pain management (neuropathic pain responds poorly to standard analgesics), and monitoring for autonomic symptoms (orthostatic hypotension, gastroparesis, neurogenic bladder)." },
    riskFactors: ["Diabetes mellitus (most common cause — affects up to 50% of diabetic patients)", "Chronic alcohol use (thiamine deficiency and direct nerve toxicity)", "Vitamin B12 deficiency", "Chemotherapy (vincristine, cisplatin, paclitaxel)", "HIV/AIDS", "Chronic kidney disease (uremic neuropathy)", "Autoimmune diseases (lupus, rheumatoid arthritis)"],
    diagnostics: ["Assess sensation with monofilament testing on feet (10-g monofilament)", "Test vibration sense with 128 Hz tuning fork at great toe", "Check deep tendon reflexes (decreased or absent in neuropathy)", "Assess for stocking-glove distribution of numbness or tingling", "Blood glucose and HbA1c (screen for diabetes)", "Vitamin B12 level"],
    management: ["Control blood sugar tightly if diabetic (most important intervention)", "Pain management with prescribed neuropathic pain medications", "Daily foot inspection and proper foot care", "Fall prevention measures (adequate lighting, non-slip surfaces, assistive devices)", "Correct nutritional deficiencies (B12, thiamine supplementation)", "Avoid alcohol and other neurotoxins"],
    nursingActions: ["Perform foot assessment at every visit: check skin integrity, sensation, pulses", "Teach patient to inspect feet daily for cuts, blisters, or sores they may not feel", "Assess fall risk and implement safety measures", "Monitor for orthostatic hypotension (take BP lying and standing)", "Ensure proper footwear (closed-toe, well-fitting shoes; avoid going barefoot)", "Report new numbness, weakness, or worsening symptoms"],
    assessmentFindings: ["Numbness or tingling in stocking-glove pattern (feet first, then hands)", "Burning or shooting pain in extremities", "Decreased sensation to light touch and vibration in distal extremities", "Decreased or absent ankle reflexes", "Unsteady gait or balance problems", "Orthostatic hypotension (autonomic involvement)"],
    signs: {
      left: ["Mild tingling or numbness in toes", "Decreased vibration sense at great toe", "Diminished ankle reflexes", "Intact skin on feet"],
      right: ["Complete loss of sensation in feet (high injury risk)", "Undetected foot ulcers or wounds", "Significant weakness or foot drop", "Orthostatic hypotension with dizziness or falls"]
    },
    medications: [{
      name: "Gabapentin",
      type: "Anticonvulsant/neuropathic pain agent",
      action: "Binds to calcium channels in the nervous system, reducing excitatory neurotransmitter release and calming overactive pain nerve signals",
      sideEffects: "Drowsiness, dizziness, weight gain, peripheral edema, ataxia",
      contra: "Severe renal impairment (dose must be reduced), suicidal ideation risk",
      pearl: "Start low (100-300 mg at bedtime) and increase gradually; takes 1-2 weeks for pain relief; warn about drowsiness and fall risk"
    }],
    pearls: ["Diabetes is the #1 cause of peripheral neuropathy — tight blood sugar control is the most important treatment", "Stocking-glove pattern = longest nerves affected first (toes/feet before fingers/hands)", "Daily foot inspection is critical — patients cannot feel injuries and small cuts can become infected", "10-gram monofilament test is the standard screening for loss of protective sensation", "Neuropathic pain does NOT respond to regular pain medications (Tylenol, ibuprofen) — needs gabapentin or similar", "Never go barefoot with peripheral neuropathy — always wear protective footwear"],
    quiz: [
      {
        question: "A diabetic patient cannot feel the monofilament on their feet during assessment. What is the priority nursing intervention?",
        options: ["Apply warm compresses to the feet", "Teach daily foot inspection and proper footwear because they cannot feel injuries", "Apply topical pain cream", "Recommend walking barefoot to stimulate the nerves"],
        correct: 1,
        rationale: "Loss of protective sensation means the patient cannot feel cuts, blisters, or pressure sores. Daily foot inspection and protective footwear are essential to prevent undetected injuries that can lead to ulceration and amputation."
      },
      {
        question: "Which pattern of numbness is characteristic of peripheral neuropathy?",
        options: ["Numbness on one side of the body (like a stroke)", "Stocking-glove pattern — numbness starting in the feet and progressing upward", "Numbness only in the hands", "Random patches of numbness on the trunk"],
        correct: 1,
        rationale: "Peripheral neuropathy typically follows a stocking-glove distribution because the longest nerves (to the feet) are damaged first, then progressively shorter nerves (hands) are affected."
      },
      {
        question: "A patient with peripheral neuropathy asks why regular Tylenol doesn't help their burning foot pain. What is the explanation?",
        options: ["They need a higher dose of Tylenol", "Neuropathic pain is caused by nerve damage and requires specific nerve pain medications like gabapentin", "Tylenol only works for headaches", "They should try ibuprofen instead"],
        correct: 1,
        rationale: "Neuropathic pain results from damaged nerve fibers sending abnormal pain signals. Standard analgesics target inflammatory pathways and are ineffective. Medications like gabapentin or pregabalin target nerve excitability."
      }
    ]
  },
  "peripheral-neuropathy-np": {
    title: "Peripheral Neuropathy Management",
    cellular: { title: "Advanced Peripheral Neuropathy Management", content: "Advanced management of peripheral neuropathy requires distinguishing axonal from demyelinating patterns, length-dependent from non-length-dependent neuropathies, and identifying the underlying etiology among over 100 potential causes. Electrodiagnostic studies (nerve conduction velocity studies and electromyography) are the cornerstone of evaluation: axonal neuropathies show reduced amplitude with preserved conduction velocity, while demyelinating neuropathies show prolonged distal latencies, reduced conduction velocity, conduction block, and temporal dispersion. The NP must systematically evaluate metabolic (diabetes, B12, thyroid), toxic (alcohol, chemotherapy, heavy metals), inflammatory (CIDP, vasculitic neuropathy), infectious (HIV, Lyme, hepatitis C), hereditary (CMT), and paraneoplastic etiologies through targeted laboratory and electrodiagnostic testing." },
    riskFactors: ["Diabetes mellitus (50% of all neuropathies)", "Prediabetes/metabolic syndrome (may cause small fiber neuropathy)", "Chemotherapy exposure (platinum agents, taxanes, vinca alkaloids)", "Chronic alcohol use (combined thiamine deficiency and direct toxicity)", "B12 deficiency (metformin use, pernicious anemia, malabsorption)", "Chronic kidney disease stage 3+", "Hereditary neuropathy family history (CMT)", "Autoimmune diseases (Sjogren, lupus, vasculitis)", "Paraproteinemia (MGUS, multiple myeloma)"],
    diagnostics: ["Nerve conduction studies (NCS) and electromyography (EMG) — distinguish axonal vs demyelinating pattern", "HbA1c and 2-hour OGTT (diabetes/prediabetes screening)", "Vitamin B12 and methylmalonic acid (MMA — more sensitive for B12 deficiency)", "TSH (hypothyroid neuropathy)", "SPEP/UPEP with immunofixation (paraproteinemia screening)", "Hepatitis B/C and HIV serology", "ESR, ANA, ANCA (vasculitic neuropathy)", "Nerve biopsy for suspected vasculitis, amyloidosis, or CIDP when electrodiagnostics inconclusive", "Skin punch biopsy for intraepidermal nerve fiber density (small fiber neuropathy)"],
    management: ["Treat underlying etiology: glycemic control, B12 supplementation, stop offending medication", "First-line neuropathic pain: duloxetine (60-120 mg daily) or pregabalin (150-600 mg/day divided)", "Second-line: gabapentin (900-3600 mg/day divided TID), TCAs (amitriptyline, nortriptyline)", "Topical options: capsaicin 8% patch, lidocaine 5% patch for focal symptoms", "CIDP treatment: IVIG, corticosteroids, or plasma exchange", "Multidisciplinary approach: physical therapy for gait/balance, podiatry for foot care, occupational therapy", "Referral to neurology for unclear etiology or treatment-resistant cases"],
    nursingActions: ["Perform comprehensive sensory examination (monofilament, vibration, proprioception, pinprick)", "Assess deep tendon reflexes systematically", "Order and interpret electrodiagnostic studies (NCS/EMG)", "Screen for treatable etiologies with systematic lab panel", "Prescribe and titrate neuropathic pain medications with regular follow-up", "Counsel on fall prevention, foot care, and driving safety"],
    assessmentFindings: ["Sensory loss in stocking-glove distribution (length-dependent axonal neuropathy)", "Reduced or absent deep tendon reflexes (especially ankle jerks)", "Distal muscle weakness (toe extension, ankle dorsiflexion — foot drop in severe cases)", "Gait instability and positive Romberg test", "Autonomic features: orthostatic hypotension, anhidrosis, gastroparesis, erectile dysfunction", "Neuropathic pain character: burning, shooting, electric-shock-like, allodynia"],
    signs: {
      left: ["Distal symmetric sensory symptoms (tingling, numbness)", "Reduced vibration sense at toes", "Diminished ankle reflexes", "Mild balance difficulty on tandem walking"],
      right: ["Foot drop (peroneal nerve involvement)", "Charcot foot deformity (neuropathic arthropathy)", "Non-healing foot ulcer over pressure point", "Autonomic neuropathy: resting tachycardia, orthostatic hypotension"]
    },
    medications: [
      { name: "Duloxetine", type: "SNRI antidepressant/neuropathic pain agent", action: "Inhibits serotonin and norepinephrine reuptake in descending pain inhibitory pathways of the dorsal horn, augmenting endogenous pain modulation", sideEffects: "Nausea, dry mouth, constipation, dizziness, insomnia, hepatotoxicity (rare), serotonin syndrome (with MAOIs)", contra: "Concurrent MAOI use, uncontrolled narrow-angle glaucoma, severe hepatic impairment, CrCl < 30 mL/min", pearl: "Start 30 mg daily × 1 week then increase to 60 mg daily; FDA-approved for diabetic neuropathy at 60 mg; dual benefit for comorbid depression and neuropathic pain" },
      { name: "Pregabalin", type: "Alpha-2-delta calcium channel ligand", action: "Binds alpha-2-delta subunit of voltage-gated calcium channels, reducing excitatory neurotransmitter release (glutamate, norepinephrine, substance P) in hyperexcitable neurons", sideEffects: "Somnolence, dizziness, weight gain, peripheral edema, blurred vision; Schedule V controlled substance", contra: "Known hypersensitivity; dose reduce for renal impairment; caution with CNS depressants", pearl: "Start 75 mg BID, titrate to 150 mg BID over 1-2 weeks; more predictable pharmacokinetics than gabapentin (linear absorption); Schedule V due to euphoria and misuse potential" }
    ],
    pearls: ["NCS/EMG distinguishes axonal (reduced amplitude) from demyelinating (slow velocity) neuropathy — this changes the differential diagnosis entirely", "Always check B12 AND methylmalonic acid — B12 can be falsely normal when MMA is elevated", "Metformin causes B12 deficiency in 10-30% of long-term users — screen B12 annually", "Duloxetine is preferred first-line for diabetic neuropathy (FDA-approved, dual benefit for comorbid depression)", "Small fiber neuropathy has NORMAL NCS/EMG — skin punch biopsy for intraepidermal nerve fiber density is diagnostic", "CIDP (chronic inflammatory demyelinating polyneuropathy) is treatable — do not miss this diagnosis (symmetrical proximal + distal weakness with areflexia)"],
    quiz: [
      {
        question: "NCS shows reduced conduction velocity with prolonged distal latencies and conduction block. What pattern is this?",
        options: ["Axonal neuropathy", "Demyelinating neuropathy", "Mixed sensorimotor neuropathy", "Normal study"],
        correct: 1,
        rationale: "Reduced conduction velocity, prolonged distal latencies, and conduction block are hallmarks of a demyelinating neuropathy (damage to the myelin sheath). This pattern raises suspicion for CIDP, GBS, or CMT1."
      },
      {
        question: "A patient on metformin for 10 years has B12 level of 280 pg/mL (low-normal). What additional test should be ordered?",
        options: ["Folate level", "Methylmalonic acid (MMA) — elevated MMA confirms functional B12 deficiency even with low-normal B12", "Iron panel", "Homocysteine only"],
        correct: 1,
        rationale: "B12 can be falsely normal while tissue deficiency exists. MMA is more sensitive for B12 deficiency. Metformin reduces B12 absorption in 10-30% of long-term users, making annual screening important."
      },
      {
        question: "A patient has neuropathic symptoms but NCS/EMG is completely normal. What diagnosis should be considered?",
        options: ["Malingering", "Small fiber neuropathy (confirmed by skin punch biopsy)", "Central neuropathy", "The patient does not have neuropathy"],
        correct: 1,
        rationale: "Small fiber neuropathy affects only unmyelinated C fibers and thinly myelinated A-delta fibers, which are not measured by standard NCS/EMG. Skin punch biopsy with intraepidermal nerve fiber density (IENFD) is the diagnostic test."
      }
    ]
  },
  "peripheral-neuropathy-patho-np": {
    title: "Peripheral Neuropathy Pathophysiology",
    cellular: { title: "Neuropathic Injury Mechanisms", content: "Peripheral neuropathy pathophysiology involves distinct mechanisms depending on the etiology. In diabetic neuropathy, hyperglycemia drives injury through four interconnected pathways: (1) the polyol pathway (glucose → sorbitol via aldose reductase, causing osmotic nerve swelling), (2) advanced glycation end-products (AGEs modifying structural proteins and activating RAGE receptors triggering inflammatory cascades), (3) protein kinase C activation (altering vascular permeability and blood flow to vasa nervorum), and (4) hexosamine pathway flux (O-GlcNAcylation of transcription factors altering gene expression). In toxic neuropathies, chemotherapy agents damage the dorsal root ganglion neurons (platinum agents bind DNA; taxanes disrupt microtubule-mediated axonal transport). In immune-mediated neuropathies (GBS, CIDP), molecular mimicry triggers complement-mediated destruction of myelin or axonal gangliosides." },
    riskFactors: ["Duration and severity of hyperglycemia (HbA1c correlation)", "Concurrent nephropathy, retinopathy (shared microvascular pathology)", "Smoking (endothelial dysfunction worsens vasa nervorum ischemia)", "Dyslipidemia (lipid-mediated nerve injury)", "Height/body length (longer axons = greater vulnerability to length-dependent injury)", "Genetic susceptibility (polymorphisms in aldose reductase, ACE genes)", "Cumulative chemotherapy dose (dose-dependent neurotoxicity)", "Prior neuropathic injury (second-hit phenomenon)"],
    diagnostics: ["Nerve conduction studies to characterize pattern and severity", "Quantitative sensory testing (QST) for threshold measurements", "Autonomic reflex screen (QSART, heart rate variability, tilt table) for autonomic neuropathy", "Nerve biopsy: epineurial vasculitis, amyloid deposits, inflammatory infiltrates, fiber loss quantification", "Skin punch biopsy: intraepidermal nerve fiber density (IENFD) for small fiber neuropathy", "Serum and urine immunofixation electrophoresis (paraprotein-associated neuropathy)", "Genetic testing for hereditary neuropathies (PMP22 duplication for CMT1A)"],
    management: ["Target specific pathogenic mechanism when identified", "Tight glycemic control (HbA1c < 7%) — only intervention proven to prevent diabetic neuropathy progression in T1DM", "Aldose reductase inhibitors (investigational — epalrestat available in Japan)", "Alpha-lipoic acid 600 mg daily (antioxidant with modest evidence in diabetic neuropathy)", "Immunotherapy for inflammatory neuropathies: IVIG, plasma exchange, corticosteroids", "Dose modification or discontinuation of neurotoxic chemotherapy when severe", "Benfotiamine (lipid-soluble thiamine derivative) for alcoholic neuropathy"],
    nursingActions: ["Educate on the pathophysiologic basis of neuropathy to promote adherence to glycemic control", "Perform serial quantitative assessments (monofilament, vibration, ankle reflexes) to track progression", "Screen for concurrent microvascular complications (retinopathy, nephropathy)", "Coordinate electrodiagnostic referral when etiology unclear or pattern atypical", "Monitor for chemotherapy dose-limiting neurotoxicity and communicate with oncology team", "Assess for neuropathic pain and autonomic symptoms at each visit"],
    assessmentFindings: ["Reduced IENFD on skin punch biopsy (< 5th percentile for age — diagnostic for small fiber neuropathy)", "NCS pattern: axonal (reduced amplitude) vs demyelinating (slow velocity, conduction block)", "Reduced vibratory perception threshold on quantitative testing", "Absent H-reflexes and reduced sensory nerve action potentials", "Evidence of concurrent microvascular disease (retinopathy, albuminuria)", "Autonomic testing abnormalities (reduced QSART sweat output, blunted heart rate variability)"],
    signs: {
      left: ["Reduced vibration sense at toes with preserved ankle reflexes", "Mildly reduced IENFD on skin biopsy", "NCS showing borderline sensory amplitude reduction", "HbA1c 7-8% with early neuropathy symptoms"],
      right: ["Complete sensory loss with absent ankle reflexes", "Severe IENFD reduction (< 1st percentile)", "Motor nerve involvement with foot drop", "Charcot neuroarthropathy with joint destruction"]
    },
    medications: [
      { name: "Alpha-Lipoic Acid", type: "Antioxidant/neuroprotective agent", action: "Scavenges reactive oxygen species, regenerates other antioxidants (vitamin C, E, glutathione), and improves endothelial nitric oxide-mediated blood flow to vasa nervorum", sideEffects: "GI upset, skin rash, may lower blood glucose (monitor in diabetic patients)", contra: "No absolute contraindications; caution with concurrent glucose-lowering agents (additive hypoglycemia)", pearl: "600 mg IV daily × 3 weeks showed symptom improvement in NATHAN-1 trial; oral dosing 600 mg daily has modest evidence; not FDA-approved for neuropathy but widely used" }
    ],
    pearls: ["Four diabetic neuropathy pathways: polyol, AGE, PKC, hexosamine — all driven by hyperglycemia", "Tight glycemic control prevents neuropathy in T1DM (DCCT trial) but only slows progression in T2DM (UKPDS)", "Chemotherapy-induced neuropathy is the most common reason for dose reduction or early discontinuation of cancer treatment", "Small fiber neuropathy presents with burning pain and autonomic dysfunction but NORMAL NCS — need skin biopsy", "Molecular mimicry in GBS: Campylobacter jejuni lipooligosaccharides mimic gangliosides on nerve surfaces, triggering autoimmune attack", "The pattern of nerve injury (axonal vs demyelinating, symmetric vs asymmetric) narrows the differential diagnosis more than any single lab test"],
    quiz: [
      {
        question: "Which pathway converts glucose to sorbitol, causing osmotic damage to peripheral nerves in diabetes?",
        options: ["Hexosamine pathway", "Polyol pathway via aldose reductase", "Protein kinase C pathway", "AGE formation pathway"],
        correct: 1,
        rationale: "The polyol pathway converts excess glucose to sorbitol via aldose reductase. Sorbitol cannot cross cell membranes, accumulates intracellularly, and draws water in by osmosis, causing nerve cell swelling and dysfunction."
      },
      {
        question: "In Guillain-Barré syndrome, what mechanism triggers peripheral nerve injury?",
        options: ["Hyperglycemia-mediated oxidative stress", "Molecular mimicry — antibodies against bacterial lipooligosaccharides cross-react with nerve gangliosides", "Direct viral invasion of nerve fibers", "Vasa nervorum ischemia"],
        correct: 1,
        rationale: "GBS typically follows infection (often Campylobacter jejuni). Bacterial surface molecules resemble gangliosides on nerve membranes. The immune system attacks both the bacteria and the nerves through complement-mediated destruction."
      },
      {
        question: "Why does tight glycemic control prevent neuropathy more effectively in T1DM than T2DM?",
        options: ["T1DM patients are younger and nerves recover better", "T2DM involves additional metabolic risk factors (dyslipidemia, obesity, insulin resistance) beyond hyperglycemia alone", "T1DM neuropathy is a different disease", "T2DM patients cannot achieve tight glycemic control"],
        correct: 1,
        rationale: "T2DM neuropathy is driven not only by hyperglycemia but also by dyslipidemia, insulin resistance, oxidative stress, and inflammation — factors not fully addressed by glycemic control alone. This explains why the UKPDS showed only modest benefit compared to the DCCT in T1DM."
      }
    ]
  },
  "peripheral-pulse-assessment": {
    title: "Peripheral Pulse Assessment",
    cellular: { title: "Arterial Pulse Physiology", content: "Peripheral pulses represent the pressure wave generated by left ventricular systole traveling through the arterial system. The pulse character reflects cardiac output, blood volume, vascular compliance, and downstream resistance. Each heartbeat creates a systolic pressure wave that travels through the aorta and into progressively smaller arteries. Palpable peripheral pulses include temporal, carotid, brachial, radial, ulnar, femoral, popliteal, dorsalis pedis (dorsal pedal), and posterior tibial. Pulse assessment evaluates rate, rhythm, amplitude (strength), symmetry, and quality. Diminished or absent peripheral pulses indicate arterial insufficiency from atherosclerosis, embolism, or external compression." },
    riskFactors: ["Peripheral arterial disease (atherosclerosis)", "Diabetes mellitus (accelerated atherosclerosis)", "Smoking (endothelial damage and vasoconstriction)", "Hypertension", "Hyperlipidemia", "Advanced age", "Prior vascular surgery or catheterization"],
    diagnostics: ["Palpate pulses bilaterally and compare symmetry", "Grade pulse amplitude: 0 (absent), 1+ (weak/thready), 2+ (normal), 3+ (full/bounding), 4+ (bounding/abnormal)", "Assess capillary refill time (normal < 3 seconds)", "Perform Allen test before radial artery access (assess ulnar collateral flow)", "Ankle-brachial index (ABI): normal 1.0-1.4, claudication 0.4-0.9, critical ischemia < 0.4", "Doppler ultrasound when pulses are not palpable"],
    management: ["Document all pulse findings with location, grade, and bilateral comparison", "Mark pulse locations with a skin marker for serial monitoring", "Use Doppler ultrasound when pulses are not palpable by palpation", "Report absent or significantly diminished pulses immediately", "Compare to baseline assessment findings", "Assess skin temperature, color, and hair distribution as adjuncts to pulse assessment"],
    nursingActions: ["Palpate pulses systematically: radial, dorsalis pedis, posterior tibial at minimum", "Compare pulses bilaterally for symmetry", "Document pulse grade (0 to 4+) at each assessment point", "Mark pulse locations with pen on skin for consistent reassessment", "Report changes from baseline immediately", "Assess associated signs: skin color, temperature, hair loss, ulceration"],
    assessmentFindings: ["Pulse rate, rhythm, and amplitude bilaterally", "Skin color and temperature of extremities", "Capillary refill time", "Hair distribution on lower extremities (absent hair = chronic ischemia)", "Skin integrity and presence of ulceration", "Pain with walking (claudication distance)"],
    signs: {
      left: ["Strong, symmetric 2+ pulses bilaterally", "Warm extremities with normal capillary refill", "Normal skin color and hair distribution", "ABI 1.0-1.4"],
      right: ["Absent or diminished pulses (0 or 1+)", "Cool, pale, or mottled extremity", "Capillary refill > 3 seconds", "ABI < 0.4 (critical limb ischemia)"]
    },
    medications: [{
      name: "Aspirin",
      type: "Antiplatelet agent",
      action: "Irreversibly inhibits cyclooxygenase-1 (COX-1) in platelets, preventing thromboxane A2 formation and platelet aggregation",
      sideEffects: "GI bleeding, bruising, tinnitus at high doses",
      contra: "Active GI bleeding, aspirin allergy, children with viral illness (Reye syndrome risk)",
      pearl: "Low-dose aspirin (81-325 mg) is standard for secondary prevention in peripheral arterial disease to reduce cardiovascular events"
    }],
    pearls: ["Always compare pulses bilaterally — ASYMMETRY is the key finding", "Dorsalis pedis pulse is absent in 5-10% of healthy people — also assess posterior tibial", "ABI < 0.9 is diagnostic for PAD; ABI < 0.4 indicates critical limb ischemia", "Absent hair on lower extremities and shiny thin skin are signs of chronic arterial insufficiency", "Mark pulse locations with pen on skin for consistent serial monitoring", "Cool pale extremity with absent pulses = arterial emergency — report immediately"],
    quiz: [
      {
        question: "A nurse cannot palpate the dorsalis pedis pulse on a patient's right foot. What should be done next?",
        options: ["Document absent pulse and continue care", "Assess posterior tibial pulse and use Doppler ultrasound if needed", "Apply warm blankets to the foot", "Notify the provider of a vascular emergency"],
        correct: 1,
        rationale: "The dorsalis pedis pulse is congenitally absent in 5-10% of people. The posterior tibial pulse should be assessed, and Doppler ultrasound used if pulses remain non-palpable to confirm arterial blood flow."
      },
      {
        question: "A patient's ABI on the left leg is 0.5. What does this indicate?",
        options: ["Normal arterial flow", "Mild peripheral arterial disease with claudication", "Critical limb ischemia requiring emergency intervention", "The measurement is invalid"],
        correct: 1,
        rationale: "ABI 0.4-0.9 indicates peripheral arterial disease. An ABI of 0.5 falls in this range, suggesting moderate arterial insufficiency that typically presents with claudication (pain with walking)."
      },
      {
        question: "What does asymmetric pulse assessment (strong left, weak right) suggest?",
        options: ["Normal anatomic variation", "Arterial obstruction or stenosis on the weaker side", "The patient is lying on their right side", "Dehydration"],
        correct: 1,
        rationale: "Pulse asymmetry suggests arterial obstruction (atherosclerosis, embolism, or dissection) reducing blood flow to the weaker side. This requires further evaluation with Doppler or angiography."
      }
    ]
  },
  "peripheral-pulse-assessment-np": {
    title: "Advanced Peripheral Pulse Assessment",
    cellular: { title: "Advanced Arterial Hemodynamic Assessment", content: "Advanced pulse assessment interprets the arterial waveform characteristics that reflect upstream cardiac function and downstream vascular impedance. Pulsus alternans (alternating strong and weak beats) indicates severe left ventricular systolic dysfunction. Pulsus paradoxus (>10 mmHg SBP drop during inspiration) suggests cardiac tamponade, severe asthma, or constrictive pericarditis. Pulsus bisferiens (two systolic peaks) occurs in aortic regurgitation with stenosis or HOCM. Water-hammer pulse (Corrigan pulse) with wide pulse pressure reflects aortic regurgitation. Pulse deficit (apical rate exceeding radial rate) indicates atrial fibrillation with rapid ventricular response where some contractions are too weak to generate a palpable peripheral pulse. The NP integrates these findings with hemodynamic principles: pulse pressure (SBP - DBP) reflects stroke volume and arterial compliance, while MAP reflects end-organ perfusion." },
    riskFactors: ["Aortic valve disease (stenosis or regurgitation altering pulse character)", "Heart failure (pulsus alternans)", "Cardiac tamponade (pulsus paradoxus)", "Atrial fibrillation (pulse deficit)", "Hypertrophic cardiomyopathy (pulsus bisferiens)", "Severe COPD or asthma (pulsus paradoxus)", "Aortic coarctation (upper/lower extremity pulse discrepancy)", "Thoracic outlet syndrome (positional pulse changes)"],
    diagnostics: ["Auscultate apical pulse simultaneously with radial palpation (pulse deficit calculation)", "Measure pulsus paradoxus: inflate BP cuff above systolic, deflate slowly noting first Korotkoff sound during expiration then during inspiration — difference > 10 mmHg is abnormal", "Assess pulse contour: sharp upstroke (normal) vs slow upstroke (pulsus parvus et tardus in aortic stenosis)", "Compare upper and lower extremity pulses (discrepancy in coarctation)", "Bilateral arm BP comparison (>15 mmHg difference = subclavian stenosis or aortic dissection)", "Continuous arterial waveform analysis via arterial line in critical care"],
    management: ["Correlate abnormal pulse findings with echocardiographic and hemodynamic data", "Pulsus paradoxus > 10 mmHg: emergent echocardiography for tamponade evaluation", "Pulsus alternans: evaluate ejection fraction and heart failure management", "Wide pulse pressure: evaluate for aortic regurgitation severity", "Pulse deficit in AFib: assess rate control adequacy and anticoagulation status", "Upper-lower extremity gradient: evaluate for aortic coarctation or dissection"],
    nursingActions: ["Perform comprehensive pulse assessment including character, contour, and symmetry", "Measure pulsus paradoxus at bedside using sphygmomanometer technique", "Calculate pulse deficit (apical - radial) in atrial fibrillation", "Compare bilateral arm blood pressures at every initial encounter", "Document arterial waveform characteristics when arterial line available", "Report new pulse character abnormalities with clinical correlation"],
    assessmentFindings: ["Pulse character (bounding, thready, normal, alternating)", "Pulse contour (brisk upstroke vs slow rising/parvus et tardus)", "Pulsus paradoxus measurement (normal < 10 mmHg variation)", "Pulse deficit value (apical rate minus radial rate)", "Bilateral arm pressure comparison", "Upper extremity vs lower extremity pressure comparison"],
    signs: {
      left: ["Normal pulse contour with brisk upstroke", "No pulsus paradoxus (< 10 mmHg variation)", "Equal bilateral pulses and arm pressures", "No pulse deficit (apical = radial rate)"],
      right: ["Pulsus paradoxus > 10 mmHg (tamponade, severe asthma)", "Pulsus alternans (severe LV dysfunction)", "Pulse deficit > 10 (poorly controlled AFib)", "Bilateral arm pressure difference > 20 mmHg (aortic dissection)"]
    },
    medications: [
      { name: "Norepinephrine", type: "Alpha-1 and beta-1 adrenergic agonist/vasopressor", action: "Potent alpha-1 vasoconstriction increases SVR and MAP; moderate beta-1 effect increases contractility; preferred first-line vasopressor in distributive shock", sideEffects: "Peripheral ischemia (digital gangrene with prolonged use), arrhythmias, tissue necrosis with extravasation", contra: "Mesenteric or peripheral vascular thrombosis (relative); hypovolemia without concurrent fluid resuscitation", pearl: "Must be given through central venous access; if peripheral access used emergently, monitor site constantly for extravasation; dose 0.1-30 mcg/min titrated to target MAP ≥ 65 mmHg" }
    ],
    pearls: ["Pulsus paradoxus > 10 mmHg: think tamponade first, then severe asthma/COPD, then constrictive pericarditis", "Pulsus alternans is pathognomonic for severe LV systolic dysfunction — check EF", "Bilateral arm BP difference > 20 mmHg: consider aortic dissection (ascending vs descending determines treatment)", "Pulsus parvus et tardus (slow-rising, weak pulse) = hemodynamically significant aortic stenosis", "Water-hammer/Corrigan pulse = aortic regurgitation — check for other AR signs (wide pulse pressure, de Musset sign, Quincke pulses)", "Pulse deficit in AFib reflects ventricular contractions too weak to generate peripheral pulses — indicates need for rate control"],
    quiz: [
      {
        question: "A patient's SBP drops from 120 mmHg during expiration to 105 mmHg during inspiration. What is the pulsus paradoxus value and what does it suggest?",
        options: ["15 mmHg — normal variation", "15 mmHg — abnormal, evaluate for cardiac tamponade", "5 mmHg — normal", "Cannot be determined without an arterial line"],
        correct: 1,
        rationale: "Pulsus paradoxus = 120 - 105 = 15 mmHg. Normal is < 10 mmHg. A value > 10 mmHg is abnormal and raises concern for cardiac tamponade, severe asthma, or constrictive pericarditis."
      },
      {
        question: "The NP notes alternating strong and weak radial pulses in a patient with heart failure. What is this finding?",
        options: ["Pulsus paradoxus", "Pulsus alternans — indicates severe LV systolic dysfunction", "Pulse deficit from atrial fibrillation", "Normal sinus arrhythmia"],
        correct: 1,
        rationale: "Pulsus alternans (alternating strong and weak beats) is pathognomonic for severe left ventricular systolic dysfunction. It reflects beat-to-beat variation in contractile force from a failing ventricle."
      },
      {
        question: "Bilateral arm BP shows: right arm 180/90, left arm 140/85. What should be evaluated?",
        options: ["This is normal variation", "Aortic dissection or subclavian artery stenosis", "The left arm cuff is too small", "Anxiety causing right arm elevation"],
        correct: 1,
        rationale: "A bilateral arm BP difference > 15-20 mmHg raises concern for aortic dissection (with branch vessel involvement) or subclavian artery stenosis. Urgent imaging (CT angiography) should be obtained."
      }
    ]
  },
  "peritoneal-dialysis-basics-rpn": {
    title: "Peritoneal Dialysis Basics",
    cellular: { title: "How Peritoneal Dialysis Works", content: "Peritoneal dialysis (PD) uses the body's own peritoneal membrane (the lining of the abdominal cavity) as a natural filter to remove waste products and excess fluid from the blood. A special fluid called dialysate is infused through a catheter into the abdominal cavity (peritoneal space). Waste products and excess electrolytes cross from the blood vessels in the peritoneum into the dialysate by diffusion (moving from high to low concentration), and excess water is pulled out by osmosis (the dialysate contains dextrose which draws water across the membrane). After a dwell period (4-6 hours for CAPD or 1-2 hours for automated cycler), the used dialysate is drained out carrying waste and fluid. This process is repeated multiple times daily." },
    riskFactors: ["Peritonitis (most common and serious complication)", "Poor hand hygiene or break in sterile technique", "Exit site or tunnel infection", "Constipation (can impair drainage)", "Malnutrition (protein lost in dialysate)", "Hernias (from increased intra-abdominal pressure)", "Diabetes (higher infection risk, protein losses worsen glycemic control)"],
    diagnostics: ["Monitor drained dialysate: should be clear and straw-colored", "Cloudy dialysate = peritonitis until proven otherwise — notify nurse immediately", "Record intake and output: volume of fluid instilled vs drained (net ultrafiltration)", "Weigh patient daily at same time", "Monitor vital signs including blood pressure and temperature", "Check exit site for redness, swelling, discharge, or tenderness"],
    management: ["Maintain strict sterile technique during all exchanges", "Follow prescribed dwell times and solution concentrations", "Warm dialysate to body temperature before infusion (prevents abdominal cramping and hypothermia)", "Elevate head of bed during dwell to ease breathing", "Report cloudy dialysate, fever, or abdominal pain immediately", "Encourage adequate protein intake (protein is lost in dialysate)"],
    nursingActions: ["Maintain strict aseptic technique during all catheter care and exchanges", "Monitor dialysate color with every drain: clear = normal, cloudy = possible peritonitis", "Weigh patient daily and record fluid balance", "Assess catheter exit site for signs of infection at each shift", "Keep catheter site clean and dry with prescribed dressing protocol", "Report outflow problems (may indicate catheter migration, constipation, or fibrin clots)"],
    assessmentFindings: ["Dialysate appearance (clear and straw-colored = normal)", "Catheter exit site condition (clean, dry, no redness)", "Fluid balance (volume drained vs instilled)", "Daily weight trend", "Abdominal comfort during fills and drains", "Blood pressure and signs of fluid overload or depletion"],
    signs: {
      left: ["Clear, straw-colored dialysate drainage", "Clean, dry catheter exit site", "Comfortable during exchanges", "Stable weight and blood pressure"],
      right: ["Cloudy dialysate (peritonitis)", "Fever and abdominal pain (peritonitis)", "Red, tender, or draining exit site (infection)", "Shortness of breath during dwell (too much fluid or diaphragm pressure)"]
    },
    medications: [{
      name: "Intraperitoneal Cefazolin",
      type: "First-generation cephalosporin antibiotic",
      action: "Inhibits bacterial cell wall synthesis; added directly to dialysate to treat peritonitis (gram-positive coverage)",
      sideEffects: "Allergic reaction, nausea, abdominal discomfort",
      contra: "Cephalosporin or severe penicillin allergy",
      pearl: "Given IP (intraperitoneal — added to the dialysate bag) for peritonitis treatment; loading dose in first exchange, then maintenance in subsequent exchanges; combined with gram-negative coverage (ceftazidime or gentamicin)"
    }],
    pearls: ["Cloudy dialysate = peritonitis until proven otherwise — report IMMEDIATELY", "Strict hand hygiene and sterile technique are the #1 way to prevent peritonitis", "Warm dialysate to body temperature before instilling to prevent cramping and hypothermia", "Constipation can impair dialysate drainage — encourage adequate fiber and fluid intake", "Patients lose protein through peritoneal dialysis — encourage high-protein diet", "Always check dialysate color with every drain — this is the earliest sign of infection"],
    quiz: [
      {
        question: "A patient performing peritoneal dialysis drains cloudy fluid. What is the priority action?",
        options: ["Continue the next exchange and see if it clears up", "Report immediately — cloudy dialysate indicates possible peritonitis", "Increase the dwell time", "Give the patient acetaminophen"],
        correct: 1,
        rationale: "Cloudy dialysate is the hallmark sign of peritonitis, the most common and serious complication of peritoneal dialysis. It requires immediate reporting, dialysate culture, and antibiotic treatment."
      },
      {
        question: "Why should dialysate be warmed before infusion?",
        options: ["Cold dialysate kills bacteria better", "Warming prevents abdominal cramping and hypothermia", "Cold fluid removes more waste products", "Warming is optional and only for patient comfort"],
        correct: 1,
        rationale: "Cold dialysate causes abdominal cramping, pain, and can lower core body temperature (hypothermia). Warming the solution to body temperature (37°C) prevents these complications and makes the exchange more comfortable."
      },
      {
        question: "What is the single most important intervention to prevent peritonitis in peritoneal dialysis?",
        options: ["Taking prophylactic antibiotics", "Strict hand hygiene and sterile technique during exchanges", "Changing the catheter weekly", "Using the highest concentration dialysate"],
        correct: 1,
        rationale: "Most peritonitis cases result from touch contamination during exchanges. Proper hand hygiene and strict aseptic technique during all catheter handling and exchanges are the most effective prevention strategies."
      }
    ]
  }
};
