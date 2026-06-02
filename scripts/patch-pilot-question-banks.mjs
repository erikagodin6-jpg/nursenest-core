/**
 * Appends new questions to pilot topic files to reach blueprint targets.
 * Heavy topics: 45–60 questions. Light topics: 20–25 questions.
 * Does NOT modify existing questions.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PILOT_DIR = path.resolve(__dirname, "../data/pilots/foundations");

// ---------------------------------------------------------------------------
// NEW QUESTIONS — keyed by topicSlug
// ---------------------------------------------------------------------------

const ADDITIONS = {

  // =========================================================================
  // body-direction-and-positional-terms  (32 → 45, +13)
  // Gaps: Fowler's/Trendelenburg/Sims positions, inguinal/axillary/femoral
  //       regional terms, mediastinum, nine-region system, combined terms
  // =========================================================================
  "body-direction-and-positional-terms": [
    {
      questionId: "body-direction-and-positional-terms-Q33",
      stem: "A nurse elevates the head of a patient's bed to 45 degrees after surgery. This position is called:",
      options: { A: "Trendelenburg position", B: "Fowler's position", C: "Sims' position", D: "Lithotomy position" },
      correctAnswer: "B",
      rationale: "Fowler's position places the head of the bed at 45–60 degrees (semi-Fowler's = 30–45°). It improves respiratory expansion and is used postoperatively, for patients with heart failure, and during nasogastric tube feedings. Trendelenburg = legs elevated above the head. Sims' = lateral recumbent with upper knee flexed.",
      difficultyLevel: "foundational",
      keyConceptTested: "positional term: Fowler's position"
    },
    {
      questionId: "body-direction-and-positional-terms-Q34",
      stem: "In Trendelenburg position, the patient is placed:",
      options: { A: "Sitting upright at 90 degrees", B: "Supine with the legs elevated above the level of the head", C: "On the left side with the upper knee flexed", D: "Prone with the head turned to one side" },
      correctAnswer: "B",
      rationale: "Trendelenburg position places the patient supine with the lower body (legs) elevated above the head on a tilted table or bed. Historically used in shock to improve venous return, though evidence is mixed. It is also used for some surgical procedures. Fowler's = sitting up. Sims' = lateral with knee flexed.",
      difficultyLevel: "foundational",
      keyConceptTested: "positional term: Trendelenburg"
    },
    {
      questionId: "body-direction-and-positional-terms-Q35",
      stem: "The inguinal region of the body refers to the:",
      options: { A: "Buttocks", B: "Inner groin area where the thigh meets the abdomen", C: "Lower back between the ribs and pelvis", D: "Outer lateral thigh" },
      correctAnswer: "B",
      rationale: "The inguinal region (groin) is the junction between the abdomen and the upper thigh. It contains the inguinal ligament, inguinal lymph nodes, and is the site of inguinal hernias. The gluteal region = buttocks. The lumbar region = lower back. The femoral region = anterior thigh.",
      difficultyLevel: "foundational",
      keyConceptTested: "regional term: inguinal"
    },
    {
      questionId: "body-direction-and-positional-terms-Q36",
      stem: "The axillary region of the body is located:",
      options: { A: "On the back of the upper arm", B: "In the armpit, where the arm meets the shoulder and chest", C: "On the lateral chest wall at the level of the nipple", D: "Below the clavicle on the anterior chest" },
      correctAnswer: "B",
      rationale: "The axillary region is the armpit — the hollow area where the arm joins the shoulder and chest. It contains axillary lymph nodes (assessed in breast cancer staging), the axillary artery and vein, and the brachial plexus nerves. Axillary temperature measurement is taken in this region.",
      difficultyLevel: "foundational",
      keyConceptTested: "regional term: axillary"
    },
    {
      questionId: "body-direction-and-positional-terms-Q37",
      stem: "The femoral region refers to the:",
      options: { A: "Lower leg (shin area)", B: "Upper thigh (anterior surface)", C: "Back of the knee", D: "Top surface of the foot" },
      correctAnswer: "B",
      rationale: "The femoral region refers to the thigh — the area of the lower limb between the hip and the knee. The femoral artery and vein are located in the upper femoral region (femoral triangle). The patellar region = knee. The popliteal region = back of the knee. The dorsal region = top of the foot.",
      difficultyLevel: "foundational",
      keyConceptTested: "regional term: femoral"
    },
    {
      questionId: "body-direction-and-positional-terms-Q38",
      stem: "The mediastinum is a subdivision of the thoracic cavity. It contains:",
      options: { A: "The lungs and their pleural coverings", B: "The heart, great vessels, esophagus, trachea, and thymus", C: "Only the heart and pericardium", D: "The diaphragm and its associated nerves" },
      correctAnswer: "B",
      rationale: "The mediastinum is the central compartment of the thoracic cavity between the two lungs. It contains the heart (in the pericardial sac), great vessels (aorta, vena cavae, pulmonary vessels), trachea, esophagus, thymus, and associated lymph nodes and nerves. The lungs are lateral in the pleural cavities, not in the mediastinum.",
      difficultyLevel: "foundational",
      keyConceptTested: "mediastinum contents"
    },
    {
      questionId: "body-direction-and-positional-terms-Q39",
      stem: "In the nine-region abdominal system, the epigastric region is located:",
      options: { A: "In the lower central abdomen, below the umbilicus", B: "In the upper central abdomen, between the right and left hypochondriac regions", C: "On the right side lateral to the umbilicus", D: "In the pelvic region below the inguinal ligaments" },
      correctAnswer: "B",
      rationale: "In the nine-region system, the epigastric region is in the upper central abdomen, flanked by the right and left hypochondriac regions. It overlies the stomach and part of the liver. The hypogastric (pubic) region is the lower central area. The right/left lateral = flank regions (lumbar). Iliac/inguinal regions are lower lateral.",
      difficultyLevel: "applied",
      keyConceptTested: "nine-region system: epigastric region"
    },
    {
      questionId: "body-direction-and-positional-terms-Q40",
      stem: "A surgical wound is described as 'midline, inferior to the umbilicus, extending to the pubic symphysis.' Using directional and regional terms, where is this incision?",
      options: { A: "A horizontal incision across the upper abdomen at the level of the liver", B: "A vertical incision down the center of the lower abdomen from the navel toward the pelvis", C: "An oblique incision in the right lower quadrant near the appendix", D: "A lateral incision across the left flank region" },
      correctAnswer: "B",
      rationale: "Midline = along the midsagittal plane (center). Inferior to the umbilicus = below the navel. Extending to the pubic symphysis = downward to the pelvic bony landmark. This describes a vertical lower midline abdominal incision — common for Cesarean sections, hysterectomies, and colon surgery.",
      difficultyLevel: "applied",
      keyConceptTested: "combined directional terms in surgical description"
    },
    {
      questionId: "body-direction-and-positional-terms-Q41",
      stem: "A nurse documents 'right lateral decubitus position.' This means the patient is:",
      options: { A: "Lying on the back with the right side elevated", B: "Lying on the right side", C: "Lying face down on the right side of the bed", D: "Sitting at 45 degrees with the right arm elevated" },
      correctAnswer: "B",
      rationale: "Lateral decubitus means lying on one's side. Right lateral decubitus = lying on the right side. This position is used for certain procedures (e.g., chest X-ray to detect small pleural effusions that layer out by gravity) and for patient comfort. Left lateral decubitus is used for sigmoidoscopy and enemas.",
      difficultyLevel: "foundational",
      keyConceptTested: "positional term: lateral decubitus"
    },
    {
      questionId: "body-direction-and-positional-terms-Q42",
      stem: "The umbilical region of the abdomen surrounds:",
      options: { A: "The pubic bone and bladder", B: "The navel (belly button) and the surrounding central abdominal area", C: "The upper central area above the stomach", D: "The flanks on both sides of the spine" },
      correctAnswer: "B",
      rationale: "The umbilical region surrounds the navel (umbilicus) in the central abdomen. In the nine-region system it is flanked by the right and left lumbar (flank) regions laterally, the epigastric above, and the hypogastric below. It overlies parts of the small intestine and transverse colon.",
      difficultyLevel: "foundational",
      keyConceptTested: "regional term: umbilical"
    },
    {
      questionId: "body-direction-and-positional-terms-Q43",
      stem: "Which imaging plane does an MRI use when producing a 'coronal' reconstruction of the brain?",
      options: { A: "Transverse plane — top-to-bottom cross-sections", B: "Sagittal plane — left/right division", C: "Frontal (coronal) plane — anterior/posterior division", D: "Oblique plane — diagonal cut through the body" },
      correctAnswer: "C",
      rationale: "A coronal (frontal plane) MRI image divides the body or brain into anterior and posterior sections. Coronal brain images show structures from front to back. Transverse = horizontal cross-sections (the standard CT orientation). Sagittal = left-right division. MRI can reconstruct images in any plane from the raw data.",
      difficultyLevel: "applied",
      keyConceptTested: "coronal plane in MRI imaging"
    },
    {
      questionId: "body-direction-and-positional-terms-Q44",
      stem: "A patient's chart notes 'hepatomegaly with inferior border of the liver palpable 4 cm below the right costal margin.' The costal margin is the:",
      options: { A: "Lower edge of the rib cage", B: "Junction between the sternum and clavicle", C: "Posterior iliac crest", D: "Upper border of the pubic symphysis" },
      correctAnswer: "A",
      rationale: "The costal margin is the lower edge of the rib cage (formed by the costal cartilages of ribs 7–10). The liver normally lies superior to this margin and cannot be palpated below it in healthy adults. Palpating the liver's inferior edge 4 cm below the right costal margin indicates hepatomegaly (liver enlargement).",
      difficultyLevel: "applied",
      keyConceptTested: "costal margin; directional term inferior; regional anatomy"
    },
    {
      questionId: "body-direction-and-positional-terms-Q45",
      stem: "During a thoracentesis, the needle is inserted into the posterior thorax just superior to the upper border of a rib (rather than inferior to it) to avoid injuring the:",
      options: { A: "Intercostal lymph nodes", B: "Neurovascular bundle running just inferior to each rib", C: "Pleural membrane on the superior surface of each rib", D: "Diaphragmatic attachments at the inferior rib" },
      correctAnswer: "B",
      rationale: "A neurovascular bundle (intercostal nerve, artery, and vein) runs in the costal groove along the inferior surface of each rib. Inserting the needle just above (superior to) the upper border of the rib below the target space avoids lacerating these structures. This is a direct application of anatomical positional knowledge to procedural safety.",
      difficultyLevel: "applied",
      keyConceptTested: "superior border insertion — neurovascular bundle anatomy; clinical safety"
    }
  ],

  // =========================================================================
  // cardiovascular-respiratory-terminology  (22 → 45, +23)
  // Gaps: pericarditis, cardiomegaly, valvular terms, ECG, coronary vessels,
  //       hemoptysis, pleuritis, epistaxis, cyanosis, diaphoresis, edema,
  //       septicemia, phlebitis, hypercapnia, spirometry, capnography
  // =========================================================================
  "cardiovascular-respiratory-terminology": [
    {
      questionId: "cardiovascular-respiratory-terminology-Q23",
      stem: "The term 'pericarditis' refers to inflammation of the:",
      options: { A: "Heart muscle (myocardium)", B: "Inner lining of the heart chambers (endocardium)", C: "Outer fibrous sac surrounding the heart (pericardium)", D: "Heart valves" },
      correctAnswer: "C",
      rationale: "Peri- = around; card/o = heart; -itis = inflammation. The pericardium is the double-walled fibrous sac surrounding the heart. Pericarditis causes sharp chest pain that worsens with lying flat and improves when leaning forward. Myocarditis = heart muscle. Endocarditis = inner lining. Valvulitis = valve inflammation.",
      difficultyLevel: "foundational",
      keyConceptTested: "pericarditis — prefix peri-"
    },
    {
      questionId: "cardiovascular-respiratory-terminology-Q24",
      stem: "A patient's echocardiogram report notes 'cardiomegaly.' This finding indicates:",
      options: { A: "A thickened pericardial sac", B: "Enlargement of the heart", C: "Abnormal heart rhythm", D: "Decreased cardiac output" },
      correctAnswer: "B",
      rationale: "Cardi/o = heart; -megaly = enlargement. Cardiomegaly = abnormal enlargement of the heart, seen on chest X-ray or echocardiogram. It is associated with chronic conditions such as heart failure, hypertension, or cardiomyopathy where the heart muscle remodels under chronic stress.",
      difficultyLevel: "foundational",
      keyConceptTested: "cardiomegaly — suffix -megaly"
    },
    {
      questionId: "cardiovascular-respiratory-terminology-Q25",
      stem: "The term 'mitral regurgitation' means that the mitral valve is:",
      options: { A: "Narrowed and impedes blood flow from the left atrium to the left ventricle", B: "Incompetent and allows blood to flow backward from the left ventricle to the left atrium", C: "Infected and inflamed, reducing valve mobility", D: "Calcified and fused, requiring surgical replacement" },
      correctAnswer: "B",
      rationale: "Regurgitation = backward flow. Mitral regurgitation means the mitral valve does not close properly, allowing blood to flow backward (regurgitate) from the left ventricle into the left atrium during ventricular contraction. Mitral stenosis = narrowing of the valve. Endocarditis can cause valve infection. Calcification can cause stenosis.",
      difficultyLevel: "applied",
      keyConceptTested: "regurgitation — backward flow through incompetent valve"
    },
    {
      questionId: "cardiovascular-respiratory-terminology-Q26",
      stem: "The abbreviation 'ECG' or 'EKG' stands for electrocardiogram. The root 'cardio' and suffix '-gram' in this term mean:",
      options: { A: "Study of heart electricity; a specialist who interprets it", B: "The heart; a recorded tracing or image", C: "Treatment of the heart; a type of medication", D: "The heart valves; a surgical procedure" },
      correctAnswer: "B",
      rationale: "Electro- = electricity; cardi/o = heart; -gram = recorded tracing or image. An electrocardiogram is a recording (tracing) of the heart's electrical activity over time. -Graphy is the process; -gram is the result (the recording itself). Compare: echocardiography (process of recording heart images with sound) vs echocardiogram (the resulting image).",
      difficultyLevel: "foundational",
      keyConceptTested: "suffix -gram = recorded tracing; ECG/EKG word parts"
    },
    {
      questionId: "cardiovascular-respiratory-terminology-Q27",
      stem: "The coronary arteries supply blood to the:",
      options: { A: "Lungs and pulmonary circulation", B: "Heart muscle (myocardium) itself", C: "Great vessels including the aorta", D: "Inner lining of the heart (endocardium) only" },
      correctAnswer: "B",
      rationale: "Coronary = crown-shaped; the coronary arteries encircle the heart like a crown and supply oxygenated blood to the myocardium (heart muscle) itself. Obstruction of a coronary artery causes myocardial ischemia and infarction. Pulmonary arteries supply the lungs. The endocardium is too thin to require its own dedicated vessels.",
      difficultyLevel: "foundational",
      keyConceptTested: "coronary arteries — supply to myocardium"
    },
    {
      questionId: "cardiovascular-respiratory-terminology-Q28",
      stem: "A patient is coughing up blood-tinged sputum. The medical term for this symptom is:",
      options: { A: "Hematemesis", B: "Hematuria", C: "Hemoptysis", D: "Epistaxis" },
      correctAnswer: "C",
      rationale: "Hem/o = blood; -ptysis = spitting. Hemoptysis = coughing up blood or blood-tinged secretions from the respiratory tract. Hematemesis = vomiting blood (-emesis = vomiting). Hematuria = blood in the urine. Epistaxis = nosebleed (from the nasal vessels, not the lower respiratory tract).",
      difficultyLevel: "foundational",
      keyConceptTested: "hemoptysis — hem/o + -ptysis"
    },
    {
      questionId: "cardiovascular-respiratory-terminology-Q29",
      stem: "Epistaxis is the medical term for:",
      options: { A: "Coughing up blood", B: "Nosebleed", C: "Blood in the sputum", D: "Vomiting blood" },
      correctAnswer: "B",
      rationale: "Epistaxis = nosebleed; it refers to bleeding from the nasal mucosa. Anterior epistaxis (from Kiesselbach's plexus) is most common and usually self-limited. Hemoptysis = blood from the respiratory tract (coughing). Hematemesis = vomiting blood. Hemoptysis vs. epistaxis is clinically important — one is pulmonary, the other is nasal.",
      difficultyLevel: "foundational",
      keyConceptTested: "epistaxis = nosebleed"
    },
    {
      questionId: "cardiovascular-respiratory-terminology-Q30",
      stem: "The term 'diaphoresis' in a nursing assessment refers to:",
      options: { A: "Difficulty breathing when lying flat", B: "Profuse sweating, often associated with pain or shock", C: "Bluish discoloration of the skin from low oxygen", D: "Crackling sounds heard in the lung bases" },
      correctAnswer: "B",
      rationale: "Diaphoresis = profuse, often drenching sweating. It is a classic symptom accompanying myocardial infarction ('cold, clammy, diaphoretic'), severe pain, sepsis, or hypoglycemia. Orthopnea = difficulty breathing supine. Cyanosis = blue discoloration from hypoxia. Crackles (rales) are auscultated lung sounds.",
      difficultyLevel: "foundational",
      keyConceptTested: "diaphoresis = profuse sweating"
    },
    {
      questionId: "cardiovascular-respiratory-terminology-Q31",
      stem: "Peripheral edema in a patient with heart failure is best explained at the terminology level as:",
      options: { A: "Hemothorax — blood pooling in the thoracic cavity", B: "Fluid accumulation in the interstitial spaces of the extremities due to elevated venous pressure", C: "Vasoconstriction reducing blood flow to the limbs", D: "Lymphangitis blocking return of lymphatic fluid" },
      correctAnswer: "B",
      rationale: "Edema = swelling from fluid accumulation in tissue spaces. In right heart failure, elevated venous pressure forces fluid into the interstitial spaces of dependent areas (ankles, legs). Edema is distinct from hemothorax (blood in chest), vasoconstriction (reduced flow), or lymphangitis (lymphatic inflammation). Correctly distinguishing these terms prevents documentation errors.",
      difficultyLevel: "applied",
      keyConceptTested: "edema — definition; HF clinical context"
    },
    {
      questionId: "cardiovascular-respiratory-terminology-Q32",
      stem: "The suffix '-sclerosis' in the term 'arteriosclerosis' means:",
      options: { A: "Inflammation", B: "Hardening", C: "Narrowing", D: "Rupture" },
      correctAnswer: "B",
      rationale: "Sclero- = hard; -sis = condition of. Arteriosclerosis = hardening of the arteries, a general term for loss of arterial elasticity with age or disease. Atherosclerosis is a specific type involving plaque. -Itis = inflammation. -Stenosis = narrowing (can occur as a consequence). -Rrhexis = rupture.",
      difficultyLevel: "foundational",
      keyConceptTested: "suffix -sclerosis = hardening"
    },
    {
      questionId: "cardiovascular-respiratory-terminology-Q33",
      stem: "Phlebitis is correctly defined as:",
      options: { A: "A blood clot within a vein", B: "Inflammation of a vein", C: "Surgical removal of a vein", D: "Varicose enlargement of a vein" },
      correctAnswer: "B",
      rationale: "Phleb/o = vein; -itis = inflammation. Phlebitis = inflammation of a vein, often at a peripheral IV site or from catheter irritation. Thrombophlebitis = phlebitis with an associated thrombus. Phlebectomy (-ectomy) = surgical removal. Varicose veins are dilated, tortuous veins — not primarily an inflammatory condition.",
      difficultyLevel: "foundational",
      keyConceptTested: "phlebitis — phleb/o + -itis"
    },
    {
      questionId: "cardiovascular-respiratory-terminology-Q34",
      stem: "The term 'septicemia' refers to:",
      options: { A: "Local infection of a skin wound", B: "Bacterial or other organisms present in the bloodstream", C: "Inflammation of the peritoneum from abdominal infection", D: "Viral infection of the upper respiratory tract" },
      correctAnswer: "B",
      rationale: "Septic/o = infected; -emia = blood condition. Septicemia = presence of pathogenic organisms (typically bacteria) in the bloodstream, capable of spreading infection throughout the body. It can lead to sepsis and septic shock. Cellulitis = local skin infection. Peritonitis = peritoneum inflammation. URI = upper respiratory infection.",
      difficultyLevel: "foundational",
      keyConceptTested: "septicemia — septic/o + -emia"
    },
    {
      questionId: "cardiovascular-respiratory-terminology-Q35",
      stem: "Hypercapnia refers to an abnormally elevated level of which gas in the blood?",
      options: { A: "Oxygen (O₂)", B: "Nitrogen (N₂)", C: "Carbon dioxide (CO₂)", D: "Carbon monoxide (CO)" },
      correctAnswer: "C",
      rationale: "Hyper- = elevated; capn/o = carbon dioxide; -ia = condition. Hypercapnia = elevated PaCO₂ in arterial blood, typically > 45 mmHg. It results from hypoventilation (inadequate CO₂ removal) and is a sign of respiratory failure. Hypoxemia = low O₂. Hypocarbia = low CO₂ (from hyperventilation).",
      difficultyLevel: "foundational",
      keyConceptTested: "hypercapnia — root capn/o = CO₂"
    },
    {
      questionId: "cardiovascular-respiratory-terminology-Q36",
      stem: "The term 'pleuritis' (pleurisy) refers to inflammation of the:",
      options: { A: "Lung parenchyma (air-exchanging tissue)", B: "Bronchial walls", C: "Pleural membranes lining the lung and thoracic wall", D: "Alveolar sacs" },
      correctAnswer: "C",
      rationale: "Pleur/o = pleura; -itis = inflammation. Pleuritis = inflammation of the pleural membranes (visceral and parietal pleura). It causes sharp, stabbing chest pain that worsens with breathing (pleuritic chest pain) because the inflamed surfaces rub against each other. Pneumonia = parenchymal infection. Bronchitis = bronchial inflammation. Alveolitis = alveolar inflammation.",
      difficultyLevel: "foundational",
      keyConceptTested: "pleuritis — pleur/o + -itis"
    },
    {
      questionId: "cardiovascular-respiratory-terminology-Q37",
      stem: "A nurse uses pulse oximetry (SpO₂) to assess peripheral oxygen saturation. The root 'ox-' in 'oximetry' and 'oxygen' relates to:",
      options: { A: "Acid-base balance", B: "Oxygen content", C: "Cardiac output measurement", D: "Respiratory rate monitoring" },
      correctAnswer: "B",
      rationale: "The root ox- derives from the Greek 'oxys' meaning sharp/acid and by extension refers to oxygen in medical and scientific terminology. Oximetry = measurement of oxygen saturation. Oxyhemoglobin = hemoglobin bound to oxygen. Hypoxia = tissue oxygen deficiency. Pulse oximetry measures the percentage of hemoglobin saturated with oxygen non-invasively.",
      difficultyLevel: "foundational",
      keyConceptTested: "root ox- = oxygen; pulse oximetry terminology"
    },
    {
      questionId: "cardiovascular-respiratory-terminology-Q38",
      stem: "The term 'hemothorax' refers to:",
      options: { A: "Air accumulation in the pleural space", B: "Blood accumulation in the pleural space", C: "Fluid accumulation in the pericardial sac", D: "Infection of the thoracic cavity" },
      correctAnswer: "B",
      rationale: "Hem/o = blood; thorax = chest. Hemothorax = blood in the pleural (thoracic) space, often from trauma (rib fractures lacerating intercostal vessels or lung) or aortic injury. Pneumothorax = air in pleural space. Pericardial effusion/tamponade = fluid around the heart. Empyema = pus in the pleural space.",
      difficultyLevel: "foundational",
      keyConceptTested: "hemothorax — hem/o + thorax"
    },
    {
      questionId: "cardiovascular-respiratory-terminology-Q39",
      stem: "The medical term for coughing up blood from the lower respiratory tract is hemoptysis. What term describes vomiting blood from the GI tract?",
      options: { A: "Epistaxis", B: "Hematochezia", C: "Hematemesis", D: "Melena" },
      correctAnswer: "C",
      rationale: "Hem/o = blood; -emesis = vomiting. Hematemesis = vomiting blood from the upper GI tract (esophagus, stomach, duodenum). Epistaxis = nosebleed. Hematochezia = bright red blood from the rectum (lower GI bleed). Melena = dark, tarry stool from digested blood (upper GI bleed). Distinguishing these sources directs appropriate clinical intervention.",
      difficultyLevel: "applied",
      keyConceptTested: "hematemesis — -emesis; contrast with hemoptysis"
    },
    {
      questionId: "cardiovascular-respiratory-terminology-Q40",
      stem: "In cardiac terminology, the prefix 'brady-' appears in 'bradycardia.' In the autonomic nervous system context, which drug classification would INCREASE heart rate by opposing bradycardia?",
      options: { A: "Beta-blockers (e.g., metoprolol)", B: "Anticholinergics (e.g., atropine)", C: "Calcium channel blockers (e.g., diltiazem)", D: "Antiarrhythmics (e.g., amiodarone)" },
      correctAnswer: "B",
      rationale: "Anticholinergics (e.g., atropine) block the parasympathetic (vagal) slowing of the heart, allowing heart rate to increase — used to treat symptomatic bradycardia. Beta-blockers slow heart rate (treat tachycardia). Calcium channel blockers (non-dihydropyridines) slow conduction. Amiodarone is used for various arrhythmias but is not the primary treatment for bradycardia.",
      difficultyLevel: "applied",
      keyConceptTested: "bradycardia treatment — clinical application of brady- prefix"
    },
    {
      questionId: "cardiovascular-respiratory-terminology-Q41",
      stem: "Cyanosis is a clinical sign characterized by a bluish discoloration of the skin and mucous membranes. It results from:",
      options: { A: "Excessive melanin production triggered by hypoxia", B: "High levels of deoxygenated hemoglobin in peripheral blood vessels", C: "Reduced red blood cell count causing pale, blue-tinted skin", D: "Vasoconstriction redirecting blood away from the skin" },
      correctAnswer: "B",
      rationale: "Cyan/o = blue. Cyanosis occurs when deoxygenated hemoglobin (which is darker/blue-red) is present in sufficient concentration in peripheral capillaries (> ~5 g/dL of deoxyhemoglobin). This imparts a blue hue visible in the lips, nail beds, and mucous membranes. Anemia can actually mask cyanosis because there is less total hemoglobin. Vasoconstriction causes pallor, not cyanosis.",
      difficultyLevel: "applied",
      keyConceptTested: "cyanosis — cyan/o = blue; deoxygenated hemoglobin"
    },
    {
      questionId: "cardiovascular-respiratory-terminology-Q42",
      stem: "The combining form 'aort/o' in the term 'aortic stenosis' refers to the:",
      options: { A: "Pulmonary artery", B: "Coronary arteries", C: "Aorta — the largest artery in the body", D: "Atrioventricular valves" },
      correctAnswer: "C",
      rationale: "Aort/o = aorta. The aorta is the largest artery in the body, arising from the left ventricle and distributing oxygenated blood to the systemic circulation. Aortic stenosis = narrowing of the aortic valve opening. Pulmonary artery = carries deoxygenated blood to the lungs. Coronary arteries branch from the aortic root.",
      difficultyLevel: "foundational",
      keyConceptTested: "root aort/o = aorta"
    },
    {
      questionId: "cardiovascular-respiratory-terminology-Q43",
      stem: "Which term describes a condition of abnormally low oxygen in body tissues (not just in the blood)?",
      options: { A: "Hypoxemia", B: "Hypercapnia", C: "Hypoxia", D: "Anemia" },
      correctAnswer: "C",
      rationale: "Hypoxia = insufficient oxygen delivery to or use by body tissues. Hypoxemia (hypox- + -emia = blood condition) specifically means low oxygen in the arterial blood. Hypoxia is the broader tissue-level state — a patient can have tissue hypoxia from anemia, poor cardiac output, or poisoning even with a normal SpO₂. Hypercapnia = elevated CO₂. Anemia = low RBC/hemoglobin.",
      difficultyLevel: "applied",
      keyConceptTested: "hypoxia vs hypoxemia distinction"
    },
    {
      questionId: "cardiovascular-respiratory-terminology-Q44",
      stem: "The suffix '-graphy' appears in 'echocardiography' and '-gram' appears in 'echocardiogram.' Which correctly distinguishes these two terms?",
      options: { A: "Echocardiography is the resulting image; echocardiogram is the process", B: "Echocardiography is the process of recording; echocardiogram is the resulting recorded image", C: "Both terms are interchangeable with no clinical distinction", D: "Echocardiography is performed by a nurse; echocardiogram is read by a cardiologist" },
      correctAnswer: "B",
      rationale: "-Graphy = the process or technique of recording. -Gram = the result of that process (the recorded image, tracing, or data). Echocardiography = the process (using ultrasound to image the heart). Echocardiogram = the resulting recording. The same applies to: electroencephalography/-gram (EEG), mammography/-gram, radiography/-gram.",
      difficultyLevel: "foundational",
      keyConceptTested: "-graphy (process) vs -gram (result)"
    },
    {
      questionId: "cardiovascular-respiratory-terminology-Q45",
      stem: "Angioplasty of a coronary artery is performed to:",
      options: { A: "Remove and replace the diseased artery with a graft", B: "Visualize the inside of the artery using a camera scope", C: "Open and widen a narrowed vessel, often with a balloon and stent", D: "Surgically ligate the vessel to prevent hemorrhage" },
      correctAnswer: "C",
      rationale: "Angi/o = vessel; -plasty = surgical repair/reconstruction. Angioplasty (percutaneous coronary intervention, PCI) uses a catheter-mounted balloon to open a narrowed coronary artery, often followed by stent placement to keep it open. Bypass grafting = replacement with another vessel. Angioscopy = camera visualization. Ligation = tying off a vessel.",
      difficultyLevel: "applied",
      keyConceptTested: "angioplasty — angi/o + -plasty; coronary intervention"
    }
  ],

  // =========================================================================
  // cell-structure-and-function  (22 → 45, +23)
  // Gaps: cytoskeleton, cilia/flagella, peroxisomes, sarcoplasmic reticulum,
  //       cholesterol in membrane, glycocalyx, proteasome, autophagy,
  //       reactive oxygen species, stem cells, cell senescence,
  //       endocytosis (intro), vesicle trafficking
  // =========================================================================
  "cell-structure-and-function": [
    {
      questionId: "cell-structure-and-function-Q23",
      stem: "The cytoskeleton of a cell provides all of the following EXCEPT:",
      options: { A: "Structural support and shape maintenance", B: "Intracellular transport tracks for vesicles and organelles", C: "Generation of ATP through cellular respiration", D: "Enables cell movement and division via spindle fibers" },
      correctAnswer: "C",
      rationale: "The cytoskeleton (microtubules, microfilaments, and intermediate filaments) provides structural support, intracellular transport tracks (microtubules for vesicles/organelles), and enables cell division (mitotic spindle) and movement (actin-based). ATP generation is the function of mitochondria via cellular respiration — the cytoskeleton does not produce energy.",
      difficultyLevel: "foundational",
      keyConceptTested: "cytoskeleton functions"
    },
    {
      questionId: "cell-structure-and-function-Q24",
      stem: "Microtubules are a component of the cytoskeleton. They are critical for cell division because they:",
      options: { A: "Produce ATP needed to pull chromosomes apart", B: "Form the mitotic spindle that physically separates chromosomes during cell division", C: "Replicate DNA in the nucleus during S phase", D: "Provide the structural backbone of the nuclear envelope" },
      correctAnswer: "B",
      rationale: "Microtubules form the mitotic spindle — a structure of dynamic protein polymers that attaches to chromosomes at kinetochores and physically pulls sister chromatids to opposite poles of the cell during anaphase. Taxane drugs (e.g., paclitaxel) stabilize microtubules abnormally, preventing spindle disassembly and blocking cell division.",
      difficultyLevel: "applied",
      keyConceptTested: "microtubules — mitotic spindle; taxane mechanism"
    },
    {
      questionId: "cell-structure-and-function-Q25",
      stem: "Cilia on the surface of respiratory epithelial cells differ from the flagellum of a sperm cell in that:",
      options: { A: "Cilia use ATP while flagella do not require energy", B: "Cilia are numerous and short, beating rhythmically; flagella are single and long, propelling the cell", C: "Cilia propel the cell; flagella move substances across the cell surface", D: "Cilia are found only in non-dividing cells; flagella in dividing cells" },
      correctAnswer: "B",
      rationale: "Cilia are multiple, short, hair-like projections that beat in coordinated waves to move substances across a cell surface (e.g., mucus in airways). Flagella are typically single, long whip-like structures that propel the cell itself (e.g., sperm motility). Both use ATP through dynein motor proteins and have the same 9+2 microtubule arrangement.",
      difficultyLevel: "foundational",
      keyConceptTested: "cilia vs flagella — structure and function"
    },
    {
      questionId: "cell-structure-and-function-Q26",
      stem: "Peroxisomes in the liver are important for drug detoxification because they:",
      options: { A: "Package detoxified drugs in vesicles for exocytosis", B: "Break down harmful hydrogen peroxide and oxidize toxic substances using catalase and oxidases", C: "Synthesize the enzymes used by lysosomes to break down cellular waste", D: "Transport drugs across the plasma membrane using ATP-driven pumps" },
      correctAnswer: "B",
      rationale: "Peroxisomes contain oxidative enzymes (oxidases) that generate hydrogen peroxide (H₂O₂) while breaking down fatty acids and detoxifying harmful substances. Catalase within the peroxisome immediately breaks down H₂O₂ into water and O₂, preventing oxidative damage. This is especially active in liver cells (hepatocytes) that process drugs and alcohol.",
      difficultyLevel: "applied",
      keyConceptTested: "peroxisomes — oxidative detoxification; catalase"
    },
    {
      questionId: "cell-structure-and-function-Q27",
      stem: "In muscle cells, the smooth ER is called the sarcoplasmic reticulum. Its specialized function is to:",
      options: { A: "Produce the myosin proteins used in muscle contraction", B: "Store and release calcium ions that trigger muscle contraction", C: "Generate ATP for the energy-intensive process of contraction", D: "Remove waste products of contraction from the cytoplasm" },
      correctAnswer: "B",
      rationale: "The sarcoplasmic reticulum (SR) is the specialized smooth ER of muscle cells. Its primary function is to store and release Ca²⁺ ions. A nerve signal triggers Ca²⁺ release from the SR → Ca²⁺ binds troponin → actin-myosin crossbridges form → contraction. After contraction, Ca²⁺ is pumped back into the SR. Calcium channel blockers can affect this process.",
      difficultyLevel: "applied",
      keyConceptTested: "sarcoplasmic reticulum — Ca²⁺ storage for muscle contraction"
    },
    {
      questionId: "cell-structure-and-function-Q28",
      stem: "Cholesterol is an important component of the plasma membrane because it:",
      options: { A: "Acts as a receptor for hormones and drugs", B: "Provides the phospholipid bilayer's hydrophilic outer surface", C: "Stabilizes membrane fluidity, preventing it from becoming too rigid in cold or too fluid in heat", D: "Generates ATP to maintain the membrane potential" },
      correctAnswer: "C",
      rationale: "Cholesterol molecules are interspersed between phospholipids in the bilayer. They act as fluidity buffers: at low temperatures, cholesterol prevents phospholipids from packing too tightly (preventing rigidity); at high temperatures, cholesterol dampens excessive membrane fluidity. This is why membrane function is temperature-sensitive and why cells maintain precise internal temperature.",
      difficultyLevel: "applied",
      keyConceptTested: "cholesterol — membrane fluidity buffer"
    },
    {
      questionId: "cell-structure-and-function-Q29",
      stem: "The glycocalyx is a carbohydrate-rich coat on the outer surface of the plasma membrane. It functions primarily in:",
      options: { A: "Energy production through glycolysis", B: "Cell recognition, cell-to-cell communication, and immune identity", C: "Protein synthesis on the outer membrane surface", D: "Transporting lipids from the cell to the bloodstream" },
      correctAnswer: "B",
      rationale: "The glycocalyx is formed by carbohydrates linked to membrane proteins (glycoproteins) and lipids (glycolipids). It serves as a molecular 'name tag' for cell recognition — enabling immune cells to identify 'self' vs 'foreign,' facilitating cell-to-cell adhesion, and allowing receptor-ligand binding. ABO blood typing is based on glycocalyx antigens on RBCs.",
      difficultyLevel: "applied",
      keyConceptTested: "glycocalyx — cell recognition and identity; ABO blood types"
    },
    {
      questionId: "cell-structure-and-function-Q30",
      stem: "The proteasome is a cellular structure responsible for:",
      options: { A: "Synthesizing proteins from mRNA templates", B: "Breaking down misfolded or damaged proteins marked with ubiquitin", C: "Transporting newly made proteins from the rough ER to the Golgi", D: "Storing proteins until they are needed for secretion" },
      correctAnswer: "B",
      rationale: "The proteasome is a large protein complex that degrades ubiquitin-tagged proteins — typically misfolded, damaged, or regulatory proteins that must be removed. This 'quality control' system prevents accumulation of defective proteins. Proteasome dysfunction is implicated in neurodegenerative diseases (Parkinson's, Alzheimer's). Proteasome inhibitors (e.g., bortezomib) are used in multiple myeloma.",
      difficultyLevel: "applied",
      keyConceptTested: "proteasome — ubiquitin-proteasome protein degradation"
    },
    {
      questionId: "cell-structure-and-function-Q31",
      stem: "Autophagy is a cellular process in which:",
      options: { A: "The cell generates energy by oxidizing fatty acids in peroxisomes", B: "The cell engulfs and destroys its own damaged organelles by routing them to lysosomes", C: "A cell self-destructs in a programmed, orderly manner (apoptosis)", D: "Cells divide to replace neighboring cells that have died" },
      correctAnswer: "B",
      rationale: "Auto- = self; -phagy = eating. Autophagy = 'self-eating' — a process in which the cell wraps damaged organelles in an autophagosome membrane and delivers them to lysosomes for enzymatic degradation and recycling. This is essential for cellular housekeeping, particularly during starvation (recycling nutrients) and in clearing damaged organelles. Defective autophagy is linked to neurodegeneration.",
      difficultyLevel: "foundational",
      keyConceptTested: "autophagy — self-digestion of organelles via lysosomes"
    },
    {
      questionId: "cell-structure-and-function-Q32",
      stem: "Reactive oxygen species (ROS) are produced as a byproduct of mitochondrial respiration. They are clinically relevant because they:",
      options: { A: "Provide additional ATP when oxygen supply is adequate", B: "Can damage DNA, proteins, and membrane lipids, contributing to aging and cancer", C: "Signal the nucleus to increase protein synthesis during exercise", D: "Stimulate red blood cell production in bone marrow" },
      correctAnswer: "B",
      rationale: "ROS (superoxide, hydrogen peroxide, hydroxyl radicals) are produced during mitochondrial electron transport. They are highly reactive and can oxidatively damage DNA, proteins, and lipid membranes — a process called oxidative stress. Antioxidants (vitamin C, E, glutathione) neutralize ROS. Excessive ROS damage contributes to aging, atherosclerosis, neurodegenerative disease, and cancer.",
      difficultyLevel: "applied",
      keyConceptTested: "reactive oxygen species — oxidative stress; clinical implications"
    },
    {
      questionId: "cell-structure-and-function-Q33",
      stem: "Stem cells are clinically valuable because they are capable of:",
      options: { A: "Producing large amounts of ATP without requiring oxygen", B: "Indefinite self-renewal and differentiation into multiple specialized cell types", C: "Repairing DNA mutations in fully differentiated neighboring cells", D: "Secreting growth factors that suppress cancer cell division" },
      correctAnswer: "B",
      rationale: "Stem cells are defined by two key properties: (1) self-renewal — the ability to divide and produce more stem cells, and (2) differentiation potential — the ability to give rise to specialized cell types. This makes them candidates for regenerative therapies (bone marrow transplants are the established example). Pluripotent stem cells can form any cell type; multipotent stem cells are more restricted (e.g., hematopoietic stem cells produce only blood cells).",
      difficultyLevel: "foundational",
      keyConceptTested: "stem cells — self-renewal and differentiation"
    },
    {
      questionId: "cell-structure-and-function-Q34",
      stem: "Which cellular structure anchors the mitotic spindle and organizes microtubule assembly during cell division?",
      options: { A: "Nucleolus", B: "Centrosome (containing centrioles)", C: "Rough endoplasmic reticulum", D: "Golgi apparatus" },
      correctAnswer: "B",
      rationale: "The centrosome, which contains a pair of centrioles, is the main microtubule-organizing center of the cell. During mitosis, the centrosome duplicates and each moves to an opposite pole, organizing the mitotic spindle. Microtubules grow from the centrosomes to attach to chromosomes. The nucleolus makes rRNA. Rough ER synthesizes secretory proteins.",
      difficultyLevel: "foundational",
      keyConceptTested: "centrosome — microtubule organizing center; mitotic spindle"
    },
    {
      questionId: "cell-structure-and-function-Q35",
      stem: "During an ischemic event, cellular injury begins with failure of the Na⁺/K⁺ ATPase pump. In which cellular region does this pump reside?",
      options: { A: "Nuclear envelope", B: "Plasma membrane", C: "Golgi apparatus membrane", D: "Mitochondrial inner membrane" },
      correctAnswer: "B",
      rationale: "The Na⁺/K⁺ ATPase pump is an integral protein embedded in the plasma membrane (cell membrane). It uses ATP to pump Na⁺ out of and K⁺ into the cell. When ischemia depletes ATP, this pump fails — Na⁺ accumulates intracellularly, water follows osmotically, and the cell swells. This is one of the earliest events in ischemic cell injury.",
      difficultyLevel: "applied",
      keyConceptTested: "Na⁺/K⁺ pump location — plasma membrane; ischemia sequence"
    },
    {
      questionId: "cell-structure-and-function-Q36",
      stem: "The process by which a cell engulfs extracellular material by folding the plasma membrane around it to form an intracellular vesicle is called:",
      options: { A: "Exocytosis", B: "Endocytosis", C: "Autophagy", D: "Apoptosis" },
      correctAnswer: "B",
      rationale: "Endocytosis = the cell membrane folds inward around extracellular material, pinching off to form an intracellular vesicle (endosome). Forms include phagocytosis (large particles), pinocytosis (fluid), and receptor-mediated endocytosis (specific molecules). Exocytosis = vesicles fuse with membrane to release contents out. Autophagy = digestion of own organelles. Apoptosis = programmed cell death.",
      difficultyLevel: "foundational",
      keyConceptTested: "endocytosis definition"
    },
    {
      questionId: "cell-structure-and-function-Q37",
      stem: "Karyotyping is a laboratory technique that examines a cell's chromosomes. It is performed on cells during which phase of mitosis, when chromosomes are most condensed and visible?",
      options: { A: "Interphase (G1)", B: "S phase", C: "Metaphase", D: "Telophase" },
      correctAnswer: "C",
      rationale: "Chromosomes are maximally condensed and individually distinguishable during metaphase, when they are also aligned at the metaphase plate. Karyotyping arrests cells in metaphase (using colchicine, a microtubule inhibitor) to photograph and arrange chromosomes for analysis. This technique detects numerical abnormalities (trisomy 21) and structural rearrangements.",
      difficultyLevel: "applied",
      keyConceptTested: "karyotyping — metaphase; chromosomes condensed"
    },
    {
      questionId: "cell-structure-and-function-Q38",
      stem: "A cell in the G0 phase of the cell cycle is:",
      options: { A: "Actively replicating its DNA", B: "Preparing to enter mitosis", C: "In a quiescent, non-dividing state", D: "Undergoing apoptosis" },
      correctAnswer: "C",
      rationale: "G0 (Gap zero) is a non-dividing, quiescent state. Cells exit the active cell cycle and enter G0 when they are terminally differentiated (neurons, cardiac muscle) or when growth signals are absent. G0 cells can re-enter the cycle if stimulated (e.g., wound repair). This is distinct from apoptosis (programmed death) or active cell cycle phases.",
      difficultyLevel: "foundational",
      keyConceptTested: "G0 phase — quiescent non-dividing state"
    },
    {
      questionId: "cell-structure-and-function-Q39",
      stem: "A research team develops a drug that blocks nuclear pores. What cellular process would be most directly impaired?",
      options: { A: "Lipid synthesis in the smooth ER", B: "Transport of mRNA from the nucleus to the cytoplasm for translation", C: "Protein packaging in the Golgi apparatus", D: "ATP production in mitochondria" },
      correctAnswer: "B",
      rationale: "Nuclear pores regulate the bidirectional transport of molecules between the nucleus and cytoplasm. Blocking them would prevent mRNA (transcribed in the nucleus) from exiting to ribosomes in the cytoplasm — halting protein synthesis. It would also block proteins needed by the nucleus (DNA polymerases, histones) from entering. Smooth ER, Golgi, and mitochondria operate outside the nuclear envelope.",
      difficultyLevel: "applied",
      keyConceptTested: "nuclear pores — mRNA export; protein import"
    },
    {
      questionId: "cell-structure-and-function-Q40",
      stem: "Which of the following best describes the concept of 'cell senescence'?",
      options: { A: "The process by which cells divide more rapidly with age", B: "A state in which cells permanently stop dividing but remain metabolically active and secrete inflammatory factors", C: "Programmed death of cells following completion of their functional lifespan", D: "The loss of cell membrane integrity in aging tissues" },
      correctAnswer: "B",
      rationale: "Cellular senescence is a stress response in which cells permanently arrest their cell cycle (stop dividing) but do not die. Senescent cells remain alive and secrete pro-inflammatory cytokines and proteases (the senescence-associated secretory phenotype, SASP). Accumulation of senescent cells contributes to aging and age-related diseases. This is distinct from apoptosis (cell death) or normal cell cycle arrest.",
      difficultyLevel: "applied",
      keyConceptTested: "cell senescence — permanent cell cycle arrest; aging"
    },
    {
      questionId: "cell-structure-and-function-Q41",
      stem: "Microfilaments (actin filaments) in the cytoskeleton are responsible for:",
      options: { A: "Forming the mitotic spindle during cell division", B: "Cell motility, shape changes, and muscle contraction at the molecular level", C: "Providing a structural scaffold for the nuclear envelope", D: "Transporting vesicles between the ER and Golgi apparatus" },
      correctAnswer: "B",
      rationale: "Microfilaments are made of actin polymers and are responsible for cell motility (lamellipodia, filopodia), shape changes during cytokinesis (cleavage furrow), and are the basis of muscle contraction (actin-myosin interaction in sarcomeres). Microtubules form the mitotic spindle. Intermediate filaments reinforce the nuclear lamina. Microtubules also serve as vesicle transport tracks.",
      difficultyLevel: "foundational",
      keyConceptTested: "microfilaments (actin) — cell motility and muscle contraction"
    },
    {
      questionId: "cell-structure-and-function-Q42",
      stem: "Which of the following is a correct statement about DNA and chromosomes?",
      options: { A: "Each chromosome contains a single gene", B: "Humans have 46 chromosomes arranged in 23 pairs in somatic (body) cells", C: "Chromosomes are only visible as distinct structures during interphase", D: "Each chromosome contains DNA from both parents simultaneously" },
      correctAnswer: "B",
      rationale: "Human somatic (non-sex) cells contain 46 chromosomes in 23 homologous pairs (diploid). Each chromosome contains thousands of genes. Chromosomes become visible as distinct condensed structures during mitosis (M phase), not interphase (where they exist as diffuse chromatin). Each chromosome within a pair comes from one parent (one maternal, one paternal).",
      difficultyLevel: "foundational",
      keyConceptTested: "human chromosome number — 46 chromosomes; 23 pairs"
    },
    {
      questionId: "cell-structure-and-function-Q43",
      stem: "A patient with Wilson's disease accumulates toxic levels of copper in liver cells because the transport protein that normally exports copper is absent. This disease best illustrates the importance of:",
      options: { A: "Lysosomes for heavy metal storage", B: "Plasma membrane transport proteins for regulating intracellular ion concentrations", C: "Peroxisomes for oxidizing heavy metals", D: "Golgi apparatus for tagging metals with sorting signals" },
      correctAnswer: "B",
      rationale: "Wilson's disease is caused by a mutation in the ATP7B gene, which encodes a copper-transporting ATPase (an active transporter in the plasma membrane). Without this transporter, copper accumulates in liver, brain, and other organs causing toxicity. This directly illustrates the role of membrane transport proteins in maintaining safe intracellular ion concentrations — an application of active transport biology.",
      difficultyLevel: "applied",
      keyConceptTested: "membrane transport proteins — Wilson's disease; ion homeostasis"
    },
    {
      questionId: "cell-structure-and-function-Q44",
      stem: "What distinguishes the two layers of the phospholipid bilayer in terms of their molecular orientation?",
      options: { A: "Hydrophilic phosphate heads face inward; hydrophobic fatty acid tails face outward toward the aqueous environments", B: "Hydrophilic phosphate heads face outward toward aqueous environments; hydrophobic tails face each other inward", C: "Both layers have hydrophobic heads on the outside and hydrophilic tails inside", D: "The two layers are chemically identical and face the same direction" },
      correctAnswer: "B",
      rationale: "Each phospholipid has a hydrophilic (water-loving) head (phosphate group) and two hydrophobic (water-fearing) fatty acid tails. In the bilayer, hydrophilic heads face outward toward the aqueous extracellular fluid and cytoplasm, while hydrophobic tails face inward away from water. This arrangement is thermodynamically stable and creates the barrier properties of the membrane.",
      difficultyLevel: "foundational",
      keyConceptTested: "phospholipid bilayer — hydrophilic heads out; hydrophobic tails in"
    },
    {
      questionId: "cell-structure-and-function-Q45",
      stem: "A chemotherapy drug inhibits topoisomerase II, an enzyme that relieves DNA strand tension during replication. Which cell cycle phase is most directly targeted?",
      options: { A: "G1 — cell growth and preparation", B: "S phase — DNA replication", C: "G2 — post-replication quality check", D: "M phase — chromosome segregation" },
      correctAnswer: "B",
      rationale: "Topoisomerase II is essential during S phase, when DNA is being replicated. As the double helix unwinds for copying, it creates torsional stress ahead of the replication fork. Topoisomerase II cuts and re-joins DNA strands to relieve this tension. Inhibiting it (e.g., with etoposide, doxorubicin) causes DNA breaks that halt replication and trigger apoptosis — targeting rapidly dividing cancer cells in S phase.",
      difficultyLevel: "applied",
      keyConceptTested: "topoisomerase II — S phase; chemotherapy mechanism"
    }
  ],

  // =========================================================================
  // cell-transport-mechanisms  (22 → 45, +23)
  // Gaps: concentration gradient factors, K⁺ balance, osmolality, oncotic
  //       pressure, albumin/edema, ADH/aquaporins, loop diuretics, carrier
  //       saturation, 3% NaCl, Starling forces, amino acid transport,
  //       renal tubule reabsorption, calcium signaling
  // =========================================================================
  "cell-transport-mechanisms": [
    {
      questionId: "cell-transport-mechanisms-Q23",
      stem: "Which factor most directly increases the rate of simple diffusion across a membrane?",
      options: { A: "Decreasing the surface area available for diffusion", B: "Increasing the steepness of the concentration gradient", C: "Increasing membrane thickness", D: "Lowering the temperature of the solution" },
      correctAnswer: "B",
      rationale: "According to Fick's law of diffusion, rate is directly proportional to the concentration gradient (difference in concentration on each side). A steeper gradient = faster diffusion. Surface area also increases rate (directly proportional), while membrane thickness and lower temperature decrease the rate (inversely proportional). In the lungs, a greater alveolar–capillary O₂ gradient drives faster gas exchange.",
      difficultyLevel: "foundational",
      keyConceptTested: "Fick's law — factors affecting diffusion rate"
    },
    {
      questionId: "cell-transport-mechanisms-Q24",
      stem: "The Na⁺/K⁺ pump maintains high intracellular K⁺ levels. Hyperkalemia (abnormally high serum K⁺) is dangerous because it:",
      options: { A: "Depletes intracellular sodium, causing cell shrinkage", B: "Reduces the K⁺ concentration gradient across cell membranes, depolarizing cells and causing dangerous cardiac arrhythmias", C: "Activates the Na⁺/K⁺ pump to dangerous speeds, consuming all cellular ATP", D: "Causes water to flow out of cells by osmosis, leading to cellular dehydration" },
      correctAnswer: "B",
      rationale: "The resting membrane potential depends on the K⁺ gradient (high intracellular K⁺, low extracellular K⁺). Hyperkalemia reduces this gradient → cells partially depolarize → abnormal excitability in cardiac cells → ventricular fibrillation and cardiac arrest. This is why IV potassium must be given slowly with continuous cardiac monitoring — it directly threatens the electrical stability of the heart.",
      difficultyLevel: "applied",
      keyConceptTested: "hyperkalemia → K⁺ gradient reduction → cardiac arrhythmia"
    },
    {
      questionId: "cell-transport-mechanisms-Q25",
      stem: "Serum osmolality measures the concentration of solutes in blood plasma. Normal serum osmolality is approximately:",
      options: { A: "50–100 mOsm/kg", B: "140–180 mOsm/kg", C: "285–295 mOsm/kg", D: "400–450 mOsm/kg" },
      correctAnswer: "C",
      rationale: "Normal serum osmolality is approximately 285–295 mOsm/kg. It is primarily determined by sodium, glucose, and urea. Hyperosmolality (> 295) suggests dehydration or hyperglycemia. Hypo-osmolality (< 285) suggests overhydration or hyponatremia. Osmolality is the key reference point for defining isotonic, hypertonic, and hypotonic IV solutions.",
      difficultyLevel: "foundational",
      keyConceptTested: "normal serum osmolality — 285–295 mOsm/kg"
    },
    {
      questionId: "cell-transport-mechanisms-Q26",
      stem: "Oncotic pressure (colloid osmotic pressure) in blood plasma is primarily generated by:",
      options: { A: "Sodium chloride dissolved in the plasma", B: "Plasma proteins, especially albumin", C: "Red blood cells in the bloodstream", D: "Glucose and other small solutes in the blood" },
      correctAnswer: "B",
      rationale: "Oncotic pressure is the osmotic pressure exerted by large proteins (primarily albumin, which accounts for ~75–80% of plasma oncotic pressure) that cannot cross capillary walls. This protein-generated pressure pulls water back into capillaries from the interstitium (opposing hydrostatic pressure). Low albumin (e.g., liver disease, malnutrition) reduces oncotic pressure → edema from fluid leaking into tissues.",
      difficultyLevel: "applied",
      keyConceptTested: "oncotic pressure — albumin; edema from hypoalbuminemia"
    },
    {
      questionId: "cell-transport-mechanisms-Q27",
      stem: "A patient with severe liver disease has a serum albumin of 1.8 g/dL (normal: 3.5–5.0 g/dL) and develops marked peripheral edema. The transport mechanism most responsible for this edema is:",
      options: { A: "Increased active transport of Na⁺ into tissue spaces", B: "Reduced plasma oncotic pressure allowing excess fluid to shift from capillaries into interstitial spaces", C: "Increased sodium-potassium pump activity driving fluid accumulation", D: "Facilitated diffusion of albumin from vessels into tissues" },
      correctAnswer: "B",
      rationale: "Albumin is synthesized in the liver. Liver disease → reduced albumin production → low serum albumin → reduced plasma oncotic pressure → less osmotic pull keeping fluid in capillaries → fluid leaks into interstitial spaces (edema, ascites). This is a direct clinical application of oncotic pressure principles. Treatment includes albumin infusions and treating the underlying liver disease.",
      difficultyLevel: "applied",
      keyConceptTested: "hypoalbuminemia → reduced oncotic pressure → edema"
    },
    {
      questionId: "cell-transport-mechanisms-Q28",
      stem: "Antidiuretic hormone (ADH/vasopressin) increases water reabsorption in the kidney collecting duct by:",
      options: { A: "Activating the Na⁺/K⁺ pump to reabsorb sodium, which osmotically draws water", B: "Inserting aquaporin-2 (AQP2) water channels into the collecting duct membrane, allowing water to flow by osmosis", C: "Opening Na⁺ channels to increase sodium transport, pulling water passively", D: "Stimulating exocytosis of water-containing vesicles from collecting duct cells" },
      correctAnswer: "B",
      rationale: "ADH (vasopressin) acts on V2 receptors in kidney collecting duct cells → stimulates insertion of aquaporin-2 (AQP2) water channels into the apical membrane → water moves by osmosis from the tubular lumen into the hyperosmotic medullary interstitium → concentrated urine is produced. In the absence of ADH (diabetes insipidus), collecting ducts are impermeable to water → dilute urine.",
      difficultyLevel: "applied",
      keyConceptTested: "ADH → aquaporin-2 insertion → water reabsorption"
    },
    {
      questionId: "cell-transport-mechanisms-Q29",
      stem: "Loop diuretics (e.g., furosemide) produce diuresis by blocking the Na⁺/K⁺/2Cl⁻ cotransporter in the thick ascending limb of the loop of Henle. This is an example of blocking:",
      options: { A: "Simple diffusion of electrolytes", B: "Primary active transport by the Na⁺/K⁺ pump", C: "Secondary active transport (cotransport) using the Na⁺ gradient", D: "Facilitated diffusion through ion channels" },
      correctAnswer: "C",
      rationale: "The Na⁺/K⁺/2Cl⁻ cotransporter moves Na⁺, K⁺, and Cl⁻ together into the tubular cell, powered by the Na⁺ gradient created by the Na⁺/K⁺ ATPase pump on the basolateral side. This is secondary active transport — it uses the energy stored in the Na⁺ gradient rather than direct ATP hydrolysis. Furosemide blocks this transporter, preventing salt (and therefore water) reabsorption → large urine output.",
      difficultyLevel: "applied",
      keyConceptTested: "loop diuretics — block Na⁺/K⁺/2Cl⁻ cotransporter; secondary active transport"
    },
    {
      questionId: "cell-transport-mechanisms-Q30",
      stem: "A carrier protein responsible for facilitated diffusion can become saturated. What does 'saturation' of a carrier protein mean?",
      options: { A: "The carrier becomes permanently inactivated from transporting too many molecules", B: "All available carrier binding sites are occupied, so transport rate reaches a maximum and cannot increase further despite higher concentration", C: "The carrier protein begins transporting molecules against their gradient once saturated", D: "The carrier protein undergoes conformational change that blocks the channel permanently" },
      correctAnswer: "B",
      rationale: "Unlike simple diffusion (which increases linearly with concentration gradient indefinitely), facilitated diffusion via carrier proteins shows saturation kinetics. When all carrier molecules are occupied (binding sites filled), the transport rate reaches a maximum (Vmax) and cannot increase even if substrate concentration rises further. This is clinically significant — GLUT transporters saturate at high blood glucose, limiting the rate of cellular glucose uptake.",
      difficultyLevel: "applied",
      keyConceptTested: "carrier protein saturation — transport maximum (Vmax)"
    },
    {
      questionId: "cell-transport-mechanisms-Q31",
      stem: "Amino acids are absorbed from the small intestine into enterocytes via sodium-coupled cotransporters. This process depends on which primary active transport mechanism?",
      options: { A: "Aquaporin channels for water co-transport with amino acids", B: "The Na⁺/K⁺ ATPase pump on the basolateral membrane maintaining the Na⁺ gradient that drives cotransport", C: "Direct ATP hydrolysis by each amino acid transporter to move amino acids uphill", D: "Facilitated diffusion through GLUT transporters shared with glucose" },
      correctAnswer: "B",
      rationale: "Amino acid absorption uses secondary active transport — Na⁺ flows into the enterocyte along its concentration gradient, dragging amino acids with it. This Na⁺ gradient is maintained by the Na⁺/K⁺ ATPase pump on the basolateral membrane, which continuously pumps Na⁺ out of the cell. The same mechanism drives glucose absorption (SGLT1 in the small intestine). Without the Na⁺/K⁺ pump, both amino acid and glucose absorption would fail.",
      difficultyLevel: "applied",
      keyConceptTested: "amino acid absorption — secondary active transport; Na⁺/K⁺ pump as primary driver"
    },
    {
      questionId: "cell-transport-mechanisms-Q32",
      stem: "Hypertonic saline (3% NaCl) is used to treat severe symptomatic hyponatremia (very low blood sodium). At the cellular level, this solution works by:",
      options: { A: "Pumping Na⁺ directly into cells using active transporters", B: "Drawing water osmotically out of swollen brain cells (crenation) to reduce cerebral edema", C: "Inserting aquaporins to increase water excretion via the kidneys", D: "Blocking the Na⁺/K⁺ pump to redistribute sodium" },
      correctAnswer: "B",
      rationale: "In severe hyponatremia, low plasma osmolality causes water to move into brain cells by osmosis → cerebral edema → potentially fatal herniation. 3% NaCl is hypertonic relative to the swollen cells — it raises plasma osmolality, drawing water osmotically out of brain cells (crenation), reducing cerebral edema. It must be given slowly to prevent osmotic demyelination syndrome from overcorrection.",
      difficultyLevel: "applied",
      keyConceptTested: "hypertonic 3% NaCl — osmotic water withdrawal; cerebral edema treatment"
    },
    {
      questionId: "cell-transport-mechanisms-Q33",
      stem: "In the proximal convoluted tubule of the kidney, 65–70% of filtered sodium is reabsorbed. This reabsorption primarily occurs via:",
      options: { A: "Passive simple diffusion down the Na⁺ electrochemical gradient", B: "Primary active transport by Na⁺/K⁺ ATPase pumps on the basolateral membrane and secondary active transport on the apical membrane", C: "Aquaporin channels that move Na⁺ along with water", D: "Endocytosis of Na⁺-containing tubular fluid" },
      correctAnswer: "B",
      rationale: "In the proximal tubule: apical membrane uses secondary active transport (Na⁺ cotransporters for glucose, amino acids; Na⁺/H⁺ exchanger) to move Na⁺ into the cell along its gradient. Basolateral Na⁺/K⁺ ATPase pumps Na⁺ out into the peritubular capillaries (primary active transport), maintaining the low intracellular Na⁺ that drives apical influx. Aquaporins transport water but not ions.",
      difficultyLevel: "applied",
      keyConceptTested: "renal Na⁺ reabsorption — primary + secondary active transport teamwork"
    },
    {
      questionId: "cell-transport-mechanisms-Q34",
      stem: "Starling forces determine fluid movement across capillary walls. Which combination of forces promotes fluid movement OUT of capillaries into the interstitium?",
      options: { A: "High plasma oncotic pressure + low capillary hydrostatic pressure", B: "High capillary hydrostatic pressure + low plasma oncotic pressure", C: "Low capillary hydrostatic pressure + high plasma oncotic pressure", D: "Equal hydrostatic and oncotic pressures" },
      correctAnswer: "B",
      rationale: "Starling forces: (1) Capillary hydrostatic pressure — pushes fluid OUT of capillaries. (2) Plasma oncotic pressure — pulls fluid IN (keeps it in vessels). High hydrostatic pressure (e.g., heart failure, venous obstruction) combined with low oncotic pressure (hypoalbuminemia) promotes net fluid filtration into the interstitium → edema. Diuretics reduce hydrostatic pressure; albumin infusions restore oncotic pressure.",
      difficultyLevel: "applied",
      keyConceptTested: "Starling forces — capillary fluid dynamics; edema"
    },
    {
      questionId: "cell-transport-mechanisms-Q35",
      stem: "Voltage-gated calcium channels in cardiac and smooth muscle open in response to membrane depolarization. The influx of Ca²⁺ triggers contraction. Calcium channel blockers (e.g., amlodipine) lower blood pressure because they:",
      options: { A: "Block Na⁺/K⁺ pump activity, reducing membrane potential", B: "Prevent Ca²⁺ influx into vascular smooth muscle cells, causing vasodilation and reduced peripheral resistance", C: "Increase K⁺ efflux, hyperpolarizing and paralysing cardiac cells", D: "Block GLUT transporters, reducing energy available for smooth muscle contraction" },
      correctAnswer: "B",
      rationale: "Amlodipine and other dihydropyridine calcium channel blockers block L-type voltage-gated Ca²⁺ channels in vascular smooth muscle. Without Ca²⁺ influx, smooth muscle cannot contract → vasodilation → reduced peripheral vascular resistance → lower blood pressure. This is a direct application of facilitated Ca²⁺ transport biology to cardiovascular pharmacology.",
      difficultyLevel: "applied",
      keyConceptTested: "calcium channel blockers — voltage-gated Ca²⁺ channels; vasodilation mechanism"
    },
    {
      questionId: "cell-transport-mechanisms-Q36",
      stem: "Glucose enters most cells (not muscle/fat) by facilitated diffusion through GLUT transporters even without insulin. Why does glucose still enter these cells even at normal blood glucose concentrations?",
      options: { A: "GLUT1/GLUT3 transporters in brain and RBCs are constitutively present and use the blood-to-cell glucose gradient to drive uptake", B: "Low cellular glucose is actively pumped to generate a gradient for blood glucose entry", C: "Insulin opens GLUT1 channels in all tissues simultaneously", D: "Glucose diffuses freely across the lipid bilayer without requiring transporters in most tissues" },
      correctAnswer: "A",
      rationale: "Brain neurons and red blood cells express GLUT1 and GLUT3, which are constitutively present in the plasma membrane without requiring insulin signaling. Because intracellular glucose is rapidly phosphorylated (trapping it), intracellular free glucose stays low — maintaining a blood→cell gradient that continuously drives facilitated diffusion. This ensures the brain receives glucose regardless of insulin status.",
      difficultyLevel: "applied",
      keyConceptTested: "GLUT1/GLUT3 — insulin-independent; brain glucose uptake"
    },
    {
      questionId: "cell-transport-mechanisms-Q37",
      stem: "A patient receiving total parenteral nutrition (TPN) containing high concentrations of dextrose develops cellular dehydration (cell shrinkage). Using tonicity principles, this occurs because:",
      options: { A: "TPN provides too little fluid, causing systemic dehydration", B: "High glucose in TPN raises plasma osmolality above intracellular osmolality, drawing water osmotically out of cells", C: "Dextrose activates the Na⁺/K⁺ pump excessively, pulling water into the bloodstream", D: "TPN suppresses ADH release, causing the kidneys to excrete intracellular water" },
      correctAnswer: "B",
      rationale: "High dextrose TPN significantly increases plasma osmolality (glucose contributes to osmolality). When plasma osmolality exceeds intracellular osmolality, water moves by osmosis from cells into the plasma (cells crenate/shrink). This is a hypertonic state. Careful glucose management in TPN prevents this osmotic stress. Hyperglycemic hyperosmolar state in uncontrolled diabetes causes the same cellular dehydration.",
      difficultyLevel: "applied",
      keyConceptTested: "high-glucose TPN → hypertonic plasma → cellular dehydration (osmosis)"
    },
    {
      questionId: "cell-transport-mechanisms-Q38",
      stem: "Osmosis and simple diffusion are both passive processes. They differ in that osmosis specifically refers to the movement of:",
      options: { A: "Any solute from high to low concentration", B: "Ions through protein channels down their electrochemical gradient", C: "Water molecules across a semipermeable membrane toward the more concentrated solution", D: "Lipid-soluble substances directly through the phospholipid bilayer" },
      correctAnswer: "C",
      rationale: "Osmosis is specifically the passive movement of water molecules across a semipermeable membrane from a region of low solute concentration (high water concentration) to a region of high solute concentration (low water concentration). Simple diffusion moves solute (not water specifically) from high to low concentration. Both are passive (require no ATP) but describe different molecules and directions.",
      difficultyLevel: "foundational",
      keyConceptTested: "osmosis vs simple diffusion — water vs solute movement"
    },
    {
      questionId: "cell-transport-mechanisms-Q39",
      stem: "In patients with SIADH (syndrome of inappropriate antidiuretic hormone), excess ADH causes excessive water retention. At the renal tubule level, this occurs because:",
      options: { A: "Excess ADH blocks Na⁺/K⁺ pump activity, preventing sodium excretion", B: "Excess ADH continuously inserts aquaporin-2 channels in collecting duct cells, causing abnormally high water reabsorption and dilutional hyponatremia", C: "Excess ADH opens Na⁺ channels in the collecting duct, increasing sodium reabsorption with water following", D: "Excess ADH stimulates aldosterone, causing both water and potassium retention" },
      correctAnswer: "B",
      rationale: "SIADH = excess ADH despite low serum osmolality. ADH drives aquaporin-2 (AQP2) insertion into collecting duct membranes → excess water reabsorption → diluted plasma sodium (dilutional hyponatremia) → fluid overload. Treatment: fluid restriction, vasopressin receptor antagonists (vaptans) that block V2 receptors to remove aquaporin channels from the membrane.",
      difficultyLevel: "applied",
      keyConceptTested: "SIADH — excess ADH → aquaporin-2 → dilutional hyponatremia"
    },
    {
      questionId: "cell-transport-mechanisms-Q40",
      stem: "Which of the following substances would be UNABLE to cross a phospholipid bilayer by simple diffusion?",
      options: { A: "Ethanol (alcohol)", B: "Oxygen (O₂)", C: "Sodium ions (Na⁺)", D: "Carbon dioxide (CO₂)" },
      correctAnswer: "C",
      rationale: "Simple diffusion across the lipid bilayer requires substances to be small and non-polar (lipid-soluble). Charged ions like Na⁺ cannot dissolve through the hydrophobic interior of the bilayer — they require protein channels (facilitated diffusion) or active transport. O₂, CO₂, and ethanol are small and non-polar; they diffuse freely. This is the fundamental reason protein channels exist.",
      difficultyLevel: "foundational",
      keyConceptTested: "ions cannot cross bilayer by simple diffusion — require channels"
    },
    {
      questionId: "cell-transport-mechanisms-Q41",
      stem: "The exchange of nutrients and waste between cells and capillaries at the tissue level occurs primarily by:",
      options: { A: "Active transport of all nutrients directly across capillary endothelium", B: "Simple diffusion of small molecules (O₂, CO₂, glucose) and osmosis of water across the capillary wall", C: "Receptor-mediated endocytosis of all nutrients into capillary endothelial cells", D: "Bulk flow of plasma across the capillary wall with all dissolved substances" },
      correctAnswer: "B",
      rationale: "At the tissue capillary level, O₂ and nutrients diffuse from capillary blood (high concentration) into interstitial fluid and cells (low concentration). CO₂ and metabolic waste diffuse in the opposite direction. Water moves by osmosis. Most small molecules (glucose, amino acids, O₂, CO₂) cross by diffusion; larger molecules may use transcytosis (a form of endocytosis/exocytosis). This is passive transport — no ATP required.",
      difficultyLevel: "applied",
      keyConceptTested: "capillary exchange — diffusion and osmosis"
    },
    {
      questionId: "cell-transport-mechanisms-Q42",
      stem: "Hypokalemia (low serum K⁺) causes muscle weakness because:",
      options: { A: "Low extracellular K⁺ causes K⁺ to flood out of cells, depolarizing muscle membranes", B: "Low extracellular K⁺ increases the K⁺ gradient, hyperpolarizing muscle cell membranes and making them less excitable", C: "Hypokalemia directly blocks the active transport of Ca²⁺ needed for contraction", D: "Low K⁺ activates the Na⁺/K⁺ pump excessively, depleting all cellular ATP" },
      correctAnswer: "B",
      rationale: "The resting membrane potential depends on the ratio of intracellular to extracellular K⁺. Hypokalemia (low extracellular K⁺) increases this ratio → K⁺ leaks more readily out of cells → the inside becomes more negative (hyperpolarized) → cells are harder to stimulate (higher threshold for action potentials) → muscle weakness, smooth muscle ileus, and in severe cases cardiac arrhythmias.",
      difficultyLevel: "applied",
      keyConceptTested: "hypokalemia → hyperpolarization → muscle weakness"
    },
    {
      questionId: "cell-transport-mechanisms-Q43",
      stem: "The proximal renal tubule reabsorbs ~180 g of glucose per day yet almost none appears in urine under normal conditions. At what blood glucose level does glycosuria begin?",
      options: { A: "When blood glucose exceeds 70 mg/dL (the lower normal limit)", B: "When blood glucose exceeds approximately 180 mg/dL (the renal threshold), saturating SGLT2 transporters", C: "When blood glucose falls below 100 mg/dL (subnormal range)", D: "When blood glucose exceeds 400 mg/dL only in very advanced diabetes" },
      correctAnswer: "B",
      rationale: "Glucose is reabsorbed from the renal filtrate by SGLT2 transporters in the proximal tubule using secondary active transport. These transporters saturate at a plasma glucose of approximately 180 mg/dL (the renal threshold). Above this, transporters cannot reabsorb all filtered glucose → excess spills into urine (glycosuria). This is why glycosuria is a diagnostic sign of diabetes and the basis of SGLT2 inhibitor therapy.",
      difficultyLevel: "applied",
      keyConceptTested: "renal glucose threshold — SGLT2 saturation at ~180 mg/dL → glycosuria"
    },
    {
      questionId: "cell-transport-mechanisms-Q44",
      stem: "Cells undergoing exocytosis fuse intracellular vesicles with the plasma membrane. This process requires which condition?",
      options: { A: "A concentration gradient driving vesicle contents outward", B: "ATP and SNARE protein complexes that mediate vesicle-membrane fusion", C: "Aquaporin channels in the vesicle membrane to release water first", D: "Na⁺/K⁺ pump activation to create electrical charge for membrane fusion" },
      correctAnswer: "B",
      rationale: "Exocytosis requires ATP (energy for vesicle trafficking along cytoskeletal tracks) and SNARE proteins — a family of proteins on the vesicle (v-SNAREs) and target membrane (t-SNAREs) that interlock like a zipper to mediate membrane fusion and release of vesicle contents. Botulinum toxin causes flaccid paralysis by cleaving SNARE proteins at the neuromuscular junction, preventing acetylcholine exocytosis.",
      difficultyLevel: "applied",
      keyConceptTested: "exocytosis mechanism — SNARE proteins; ATP; botulinum toxin"
    },
    {
      questionId: "cell-transport-mechanisms-Q45",
      stem: "Ethanol (alcohol) causes CNS depression partly because it is lipid-soluble and crosses the blood-brain barrier easily. Which transport mechanism does ethanol use to enter neurons?",
      options: { A: "Active transport against its concentration gradient", B: "Simple diffusion through the lipid bilayer", C: "Facilitated diffusion through a specific alcohol channel protein", D: "Receptor-mediated endocytosis into neurons" },
      correctAnswer: "B",
      rationale: "Ethanol is a small, amphipathic molecule (has both hydrophilic OH group and hydrophobic carbon chain) that is sufficiently lipid-soluble to diffuse directly through the phospholipid bilayer by simple diffusion. It crosses the blood-brain barrier rapidly without specific transport proteins. Its CNS effects occur within minutes of consumption for this reason. Most drugs that affect the CNS must similarly be lipid-soluble to cross the blood-brain barrier.",
      difficultyLevel: "applied",
      keyConceptTested: "ethanol — simple diffusion through BBB; lipid solubility"
    }
  ],

  // =========================================================================
  // four-tissue-types  (22 → 45, +23)
  // Gaps: exocrine/endocrine glands, goblet cells, tight junctions,
  //       desmosomes, reticular fibers in lymphoid tissue, osteoblasts/
  //       osteoclasts, hyaline/fibrocartilage, bone hematopoiesis,
  //       SA node/pacemaker, wound healing phases, keloid, ependymal cells,
  //       serous membranes, satellite cells PNS, denervation atrophy
  // =========================================================================
  "four-tissue-types": [
    {
      questionId: "four-tissue-types-Q23",
      stem: "Goblet cells are found throughout the GI and respiratory tracts. They are classified as which type of glandular cell?",
      options: { A: "Endocrine — secreting hormones into the bloodstream", B: "Exocrine — secreting mucus onto an epithelial surface", C: "Paracrine — secreting signals only to neighboring cells", D: "Autocrine — secreting signals that act on the cell itself" },
      correctAnswer: "B",
      rationale: "Goblet cells are unicellular exocrine glands — they secrete mucus directly onto an epithelial surface (lumen or outer surface) rather than into the bloodstream. In the airway, goblet cell mucus traps inhaled particles for the mucociliary escalator. In the GI tract, mucus lubricates and protects the epithelial lining. Endocrine glands secrete hormones into the blood.",
      difficultyLevel: "foundational",
      keyConceptTested: "goblet cells — unicellular exocrine glands; mucus secretion"
    },
    {
      questionId: "four-tissue-types-Q24",
      stem: "Tight junctions between intestinal epithelial cells are clinically important because they:",
      options: { A: "Allow rapid electrical communication between adjacent intestinal cells", B: "Seal the space between cells to prevent harmful substances from leaking between cells into the bloodstream", C: "Provide flexible mechanical attachment that absorbs physical stress on the epithelium", D: "Anchor the epithelium to the basement membrane below" },
      correctAnswer: "B",
      rationale: "Tight junctions (zonula occludens) are protein complexes that seal the intercellular space, forming a near-impermeable barrier between epithelial cells. In the intestine, this prevents microbes and toxins from passing between cells into the bloodstream ('leaky gut' when tight junctions are disrupted). The blood-brain barrier is also maintained by tight junctions. Gap junctions = electrical communication. Desmosomes = mechanical adhesion.",
      difficultyLevel: "applied",
      keyConceptTested: "tight junctions — paracellular barrier; 'leaky gut'"
    },
    {
      questionId: "four-tissue-types-Q25",
      stem: "Desmosomes connect adjacent cells by interlocking with which intracellular cytoskeletal element?",
      options: { A: "Microtubules", B: "Microfilaments (actin)", C: "Intermediate filaments (e.g., keratin, desmin)", D: "Centrosomal fibers" },
      correctAnswer: "C",
      rationale: "Desmosomes are mechanical cell junctions that anchor to intermediate filaments (keratin in epithelial cells, desmin in cardiac/muscle cells). This creates a tissue-wide network that distributes mechanical stress. In the heart, desmosomes in intercalated discs prevent cardiac cells from pulling apart during contraction. Genetic defects in desmosomal proteins cause arrhythmogenic cardiomyopathy (desmoplakin mutations).",
      difficultyLevel: "applied",
      keyConceptTested: "desmosomes — mechanical junctions anchored to intermediate filaments"
    },
    {
      questionId: "four-tissue-types-Q26",
      stem: "Reticular fibers provide a fine supportive meshwork in which organs?",
      options: { A: "Tendons and ligaments, providing tensile strength", B: "Large arteries, providing elastic recoil", C: "Lymph nodes, spleen, and bone marrow, forming a structural framework for immune and blood-forming cells", D: "Intervertebral discs, providing compression resistance" },
      correctAnswer: "C",
      rationale: "Reticular fibers are thin type III collagen fibers organized into a delicate meshwork (stroma) in lymphoid organs (lymph nodes, spleen), bone marrow, and liver. This lattice provides structural support for immune cells and hematopoietic (blood-forming) cells. Tendons = dense regular collagen. Arteries = elastic fibers. Intervertebral discs = fibrocartilage.",
      difficultyLevel: "foundational",
      keyConceptTested: "reticular fibers — lymphoid organ stroma"
    },
    {
      questionId: "four-tissue-types-Q27",
      stem: "Osteoclasts and osteoblasts are both found in bone (a connective tissue). They differ in that:",
      options: { A: "Osteoblasts break down bone matrix; osteoclasts build new bone", B: "Osteoblasts synthesize and deposit bone matrix; osteoclasts resorb (dissolve) bone matrix", C: "Osteoclasts produce collagen for bone strength; osteoblasts store mineral salts", D: "Both cell types perform identical functions but in different bone regions" },
      correctAnswer: "B",
      rationale: "Osteoblasts (osteo + blast = immature forming cell) build bone by synthesizing and mineralizing bone matrix (osteoid). Osteoclasts (osteo + clast = breaking cell) resorb (break down) bone by secreting acids and enzymes. Bone remodeling requires both in balance. Bisphosphonates (e.g., alendronate) inhibit osteoclasts, used in osteoporosis. PTH stimulates osteoclasts to release calcium.",
      difficultyLevel: "foundational",
      keyConceptTested: "osteoblasts vs osteoclasts — bone formation vs resorption"
    },
    {
      questionId: "four-tissue-types-Q28",
      stem: "Hyaline cartilage is found in which of the following locations?",
      options: { A: "Intervertebral discs and pubic symphysis", B: "Articular surfaces of joints, costal cartilages of ribs, and tracheal rings", C: "External ear (pinna) and epiglottis", D: "Ligamentum nuchae and aortic wall" },
      correctAnswer: "B",
      rationale: "Hyaline cartilage is the most common type. Its locations: articular surfaces of synovial joints (covering bone ends), costal cartilages (connecting ribs to sternum), tracheal and bronchial rings (keeping airways open), and fetal skeleton. Fibrocartilage = intervertebral discs and pubic symphysis (tension + compression). Elastic cartilage = ear pinna and epiglottis. Ligamentum nuchae contains elastin.",
      difficultyLevel: "foundational",
      keyConceptTested: "hyaline cartilage locations"
    },
    {
      questionId: "four-tissue-types-Q29",
      stem: "Fibrocartilage is uniquely suited for the intervertebral discs because it:",
      options: { A: "Is highly vascular, allowing rapid regeneration after disc herniation", B: "Combines high tensile strength (from collagen bundles) with resistance to compression, accommodating vertebral loads", C: "Is flexible and elastic, returning to shape after repeated bending of the spine", D: "Contains a high proportion of elastic fibers for flexibility, similar to the ear cartilage" },
      correctAnswer: "B",
      rationale: "Fibrocartilage contains abundant dense collagen fiber bundles, giving it greater tensile strength than hyaline cartilage while retaining some compressibility. This makes it ideal for structures under both tension and compression: intervertebral discs, the pubic symphysis, and menisci of the knee. It is avascular like other cartilage types, which is why disc herniation heals poorly.",
      difficultyLevel: "applied",
      keyConceptTested: "fibrocartilage — tensile strength + compression resistance; intervertebral discs"
    },
    {
      questionId: "four-tissue-types-Q30",
      stem: "Red bone marrow is a form of connective tissue found primarily in flat bones (sternum, ilium, ribs) in adults. Its primary function is:",
      options: { A: "Storing yellow lipid-rich marrow as an energy reserve", B: "Hematopoiesis — production of all formed blood elements (RBCs, WBCs, platelets)", C: "Synthesizing calcium and phosphate for bone mineralization", D: "Providing tensile strength through collagen fiber production" },
      correctAnswer: "B",
      rationale: "Red bone marrow contains hematopoietic stem cells that produce all blood cell types (erythropoiesis for RBCs, myelopoiesis for granulocytes/monocytes, thrombopoiesis for platelets, lymphopoiesis for lymphocytes). Bone marrow biopsy evaluates marrow cellularity, blast cell percentage (leukemia diagnosis), and hematopoietic function. Yellow marrow = fat storage in long bone diaphyses.",
      difficultyLevel: "foundational",
      keyConceptTested: "red bone marrow — hematopoiesis; connective tissue"
    },
    {
      questionId: "four-tissue-types-Q31",
      stem: "The sinoatrial (SA) node generates the heart's intrinsic rhythm. These pacemaker cells are specialized:",
      options: { A: "Connective tissue cells embedded between cardiac muscle fibers", B: "Modified cardiac muscle cells capable of spontaneous depolarization", C: "Peripheral nervous system neurons that fire rhythmically", D: "Purkinje fibers that distribute electrical signals to the ventricles" },
      correctAnswer: "B",
      rationale: "SA node cells are specialized cardiac muscle cells with modified ion channels that allow spontaneous, rhythmic depolarization (automaticity) without an external nerve signal. They are cardiac muscle tissue — not neurons or connective tissue. The SA node fires at 60–100 bpm, making it the dominant pacemaker. Purkinje fibers are also modified cardiac cells but serve conduction (delivery) rather than pacemaker (initiation) functions.",
      difficultyLevel: "foundational",
      keyConceptTested: "SA node — specialized cardiac muscle; automaticity"
    },
    {
      questionId: "four-tissue-types-Q32",
      stem: "Inflammation is the first phase of wound healing. At the tissue level, which cells are primarily responsible for initial microbial defense and debris clearance in this phase?",
      options: { A: "Fibroblasts, which immediately synthesize collagen to close the wound", B: "Neutrophils (arriving within hours) and macrophages (arriving days later) phagocytosing bacteria and debris", C: "Smooth muscle cells contracting to close blood vessels and stop bleeding", D: "Epithelial cells migrating from wound edges to resurface the wound" },
      correctAnswer: "B",
      rationale: "In wound healing, inflammation (days 1–4) involves: vasodilation → neutrophils arrive first (within hours) to phagocytose bacteria and debris → macrophages arrive (1–2 days) to continue phagocytosis and secrete growth factors driving the next healing phase. Re-epithelialization begins in the proliferative phase. Fibroblasts produce collagen in the proliferative phase (days 4–21).",
      difficultyLevel: "applied",
      keyConceptTested: "wound healing inflammation phase — neutrophils and macrophages"
    },
    {
      questionId: "four-tissue-types-Q33",
      stem: "A keloid is an abnormal scar response that extends beyond the original wound boundaries. At the tissue level, this results from:",
      options: { A: "Insufficient collagen production by fibroblasts during wound healing", B: "Excessive collagen deposition by overactive fibroblasts during the remodeling phase", C: "Infection preventing normal epithelialization across the wound surface", D: "Destruction of the basement membrane preventing wound closure" },
      correctAnswer: "B",
      rationale: "Keloids form when fibroblasts in the wound produce excess collagen during remodeling, creating dense fibrous tissue that extends beyond the original wound margins. They are most common on the ears, chest, and shoulders, and in people with darker skin tones. Hypertrophic scars remain within the wound margins. Both result from excess collagen — the difference is spatial extent.",
      difficultyLevel: "applied",
      keyConceptTested: "keloid — excess collagen deposition by fibroblasts"
    },
    {
      questionId: "four-tissue-types-Q34",
      stem: "Ependymal cells line the ventricles of the brain and the central canal of the spinal cord. Their primary function is:",
      options: { A: "Producing myelin sheaths for neurons within the CNS", B: "Producing and circulating cerebrospinal fluid (CSF)", C: "Phagocytosing pathogens that enter the CSF", D: "Forming the blood-brain barrier at the capillary level" },
      correctAnswer: "B",
      rationale: "Ependymal cells are neuroglia that line the ventricles and central canal. Specialized ependymal cells (choroid plexus epithelium) produce CSF by filtering blood plasma. Their cilia beat to circulate CSF through the ventricular system. Oligodendrocytes = CNS myelin. Microglia = CNS phagocytes. Astrocytes + endothelial cells = blood-brain barrier.",
      difficultyLevel: "foundational",
      keyConceptTested: "ependymal cells — CSF production and circulation"
    },
    {
      questionId: "four-tissue-types-Q35",
      stem: "Serous membranes line body cavities and cover organs. The serous membrane covering the lung is called the visceral pleura. Its counterpart lining the thoracic wall is the:",
      options: { A: "Visceral pericardium", B: "Parietal pleura", C: "Peritoneum", D: "Mesentery" },
      correctAnswer: "B",
      rationale: "Serous membranes have two layers: the visceral layer covers the organ, and the parietal layer lines the body cavity wall. In the thorax: visceral pleura covers the lung; parietal pleura lines the chest wall. Between them is a thin film of serous fluid that allows the layers to slide frictionlessly. Fluid accumulation between these layers = pleural effusion. Visceral pericardium covers the heart; parietal pericardium = outer sac.",
      difficultyLevel: "foundational",
      keyConceptTested: "serous membranes — visceral vs parietal pleura"
    },
    {
      questionId: "four-tissue-types-Q36",
      stem: "Satellite cells in the peripheral nervous system differ from Schwann cells in that they:",
      options: { A: "Produce myelin sheaths around large-diameter peripheral axons", B: "Surround and support neuron cell bodies in dorsal root and autonomic ganglia", C: "Generate action potentials in response to nociceptive stimuli", D: "Form the perineurium (connective tissue sheath) around peripheral nerves" },
      correctAnswer: "B",
      rationale: "Satellite cells are PNS glial cells that surround and support neuron cell bodies within ganglia (clusters of neuronal cell bodies outside the CNS), including dorsal root ganglia (sensory) and autonomic ganglia. They regulate the microenvironment of ganglionic neurons. Schwann cells myelinate large axons and ensheath unmyelinated axons in the PNS.",
      difficultyLevel: "foundational",
      keyConceptTested: "satellite cells — surround neuron cell bodies in PNS ganglia"
    },
    {
      questionId: "four-tissue-types-Q37",
      stem: "Denervation atrophy differs from disuse atrophy in that denervation atrophy:",
      options: { A: "Is fully reversible with physical therapy exercises", B: "Occurs more slowly than disuse atrophy over months to years", C: "Is caused by loss of motor nerve supply to muscle rather than reduced use, and produces more severe, rapid muscle wasting", D: "Only affects slow-twitch (type I) muscle fibers" },
      correctAnswer: "C",
      rationale: "Disuse atrophy = muscle shrinkage from inactivity (e.g., limb casting, bedrest) — slow, partially reversible. Denervation atrophy = muscle wasting from loss of the motor nerve supply (e.g., spinal cord injury, polio, amyotrophic lateral sclerosis) — more rapid and severe because muscle cells require ongoing neural trophic signals. Without reinnervation, denervated muscle eventually undergoes fibrosis and complete replacement by fibrous connective tissue.",
      difficultyLevel: "applied",
      keyConceptTested: "denervation vs disuse atrophy — mechanism and severity"
    },
    {
      questionId: "four-tissue-types-Q38",
      stem: "Which type of epithelial cell junction allows direct electrical coupling between adjacent cardiac muscle cells?",
      options: { A: "Tight junctions", B: "Desmosomes", C: "Gap junctions", D: "Hemidesmosomes" },
      correctAnswer: "C",
      rationale: "Gap junctions are protein channels (connexins) that directly connect the cytoplasm of adjacent cells, allowing ions and small molecules to pass — enabling electrical coupling. In cardiac intercalated discs, gap junctions allow action potentials to spread rapidly from cell to cell, synchronizing contraction. Tight junctions = seal extracellular space. Desmosomes = mechanical adhesion. Hemidesmosomes = anchor epithelium to basement membrane.",
      difficultyLevel: "foundational",
      keyConceptTested: "gap junctions — electrical coupling; cardiac synchronization"
    },
    {
      questionId: "four-tissue-types-Q39",
      stem: "Which connective tissue cell type is primarily responsible for synthesizing the collagen and elastic fibers of the extracellular matrix?",
      options: { A: "Macrophages", B: "Mast cells", C: "Fibroblasts", D: "Plasma cells" },
      correctAnswer: "C",
      rationale: "Fibroblasts are the primary cell type responsible for synthesizing and secreting collagen, elastic fibers, and ground substance components of the extracellular matrix. They are essential for wound healing (forming granulation tissue and scar). Macrophages = phagocytes. Mast cells = release histamine/heparin (inflammation, allergy). Plasma cells = antibody-secreting B lymphocytes.",
      difficultyLevel: "foundational",
      keyConceptTested: "fibroblasts — ECM synthesis; collagen and elastic fibers"
    },
    {
      questionId: "four-tissue-types-Q40",
      stem: "In the proliferative phase of wound healing (days 4–21), granulation tissue fills the wound. What does granulation tissue consist of?",
      options: { A: "Mature scar tissue composed entirely of dense collagen", B: "New capillaries (angiogenesis), fibroblasts depositing collagen, and inflammatory cells in a loose connective tissue matrix", C: "A layer of newly divided keratinocytes resurfacing the wound", D: "Lymphocytes and plasma cells producing antibodies against wound pathogens" },
      correctAnswer: "B",
      rationale: "Granulation tissue is vascularized, provisional connective tissue formed in the proliferative wound healing phase. It contains: new capillaries (angiogenesis — providing O₂ and nutrients), fibroblasts (producing collagen to strengthen the wound), myofibroblasts (contracting the wound margins), and macrophages. It appears red and granular at the wound base. Re-epithelialization occurs across this tissue.",
      difficultyLevel: "applied",
      keyConceptTested: "granulation tissue composition — angiogenesis + fibroblasts"
    },
    {
      questionId: "four-tissue-types-Q41",
      stem: "Which of the following best describes the periosteum?",
      options: { A: "The inner lining of the medullary cavity of long bones", B: "The fibrous connective tissue membrane covering the outer surface of bone", C: "The cartilage covering the articular surface of bones at joints", D: "The vascular network supplying the bone marrow" },
      correctAnswer: "B",
      rationale: "The periosteum is a dense fibrous connective tissue membrane covering the outer surface of bone (except at articular surfaces). It contains osteoprogenitor cells (bone stem cells) and is essential for bone repair after fracture — providing cells that become osteoblasts. It is also richly innervated, which is why periosteal stripping (as in fractures) is extremely painful. The endosteum lines the medullary cavity.",
      difficultyLevel: "foundational",
      keyConceptTested: "periosteum — outer bone membrane; fracture repair"
    },
    {
      questionId: "four-tissue-types-Q42",
      stem: "White adipose tissue serves as more than energy storage. Which function of white adipose makes it clinically relevant to cardiovascular risk?",
      options: { A: "Thermogenesis — generating heat to maintain core body temperature", B: "Secretion of adipokines (e.g., leptin, adiponectin, inflammatory cytokines) that influence metabolism, appetite, and inflammation", C: "Hematopoiesis — producing white blood cells when bone marrow is insufficient", D: "Myelin synthesis — supporting nerve insulation in peripheral neurons" },
      correctAnswer: "B",
      rationale: "White adipose is an active endocrine organ secreting adipokines: leptin (appetite regulation), adiponectin (improves insulin sensitivity), and pro-inflammatory cytokines (IL-6, TNF-α) in obesity. Excess visceral adipose tissue promotes chronic low-grade inflammation → insulin resistance → cardiovascular risk. Brown adipose tissue (not white) performs thermogenesis via uncoupled mitochondria.",
      difficultyLevel: "applied",
      keyConceptTested: "white adipose — endocrine function; adipokines; cardiovascular risk"
    },
    {
      questionId: "four-tissue-types-Q43",
      stem: "The Purkinje fibers of the cardiac conduction system are:",
      options: { A: "Autonomic nerve fibers that directly stimulate ventricular muscle", B: "Specialized cardiac muscle cells that rapidly conduct action potentials to the ventricular muscle mass", C: "Smooth muscle cells that regulate atrioventricular valve closure", D: "Connective tissue fibers anchoring the AV node to the ventricular septum" },
      correctAnswer: "B",
      rationale: "Purkinje fibers are large, specialized cardiac muscle cells with few myofibrils but abundant gap junctions, adapted for rapid electrical conduction. They transmit action potentials from the bundle of His rapidly throughout the ventricular walls, ensuring near-simultaneous ventricular contraction from apex to base. They are cardiac muscle tissue — not neurons or smooth muscle. Bundle branch blocks occur when Purkinje fiber conduction is interrupted.",
      difficultyLevel: "applied",
      keyConceptTested: "Purkinje fibers — specialized cardiac muscle for rapid conduction"
    },
    {
      questionId: "four-tissue-types-Q44",
      stem: "A patient with a herniated intervertebral disc complains of radiating leg pain (sciatica). The disc herniation damages which tissue structures?",
      options: { A: "Articular hyaline cartilage covering the vertebral body ends", B: "Fibrocartilage nucleus pulposus and annulus fibrosus compressing adjacent nerve roots", C: "Elastic cartilage of the ligamentum flavum stretching the neural canal", D: "Dense regular connective tissue tendons attached to the vertebrae" },
      correctAnswer: "B",
      rationale: "Intervertebral discs consist of a fibrocartilaginous outer ring (annulus fibrosus) surrounding a gel-like nucleus pulposus. Herniation occurs when the nucleus pulposus breaches the annulus fibrosus and compresses adjacent spinal nerve roots. The sciatic nerve (formed from L4–S3 roots) is commonly compressed by L4/L5 or L5/S1 disc herniation → sciatica. The slow healing of fibrocartilage (avascular) makes disc injuries slow to recover.",
      difficultyLevel: "applied",
      keyConceptTested: "disc herniation — fibrocartilage; nucleus pulposus; nerve root compression"
    },
    {
      questionId: "four-tissue-types-Q45",
      stem: "Hemidesmosomes differ from desmosomes in that they:",
      options: { A: "Connect two adjacent epithelial cells to each other", B: "Anchor the basal surface of epithelial cells to the basement membrane below", C: "Allow ions to pass between epithelial cells for electrical signaling", D: "Seal the space between epithelial cells to prevent leakage" },
      correctAnswer: "B",
      rationale: "Hemidesmosomes anchor the basal surface of epithelial cells to the underlying basement membrane using integrins on the epithelial side and laminin in the basement membrane. They are 'half desmosomes' — only one cell involved, attaching to the ECM below rather than to an adjacent cell. In epidermolysis bullosa, hemidesmosomes are defective → skin layers separate with minor trauma (blistering disease).",
      difficultyLevel: "applied",
      keyConceptTested: "hemidesmosomes — basal cell-to-basement membrane anchoring"
    }
  ],

  // =========================================================================
  // cell-division-mitosis-meiosis  (12 → 20, +8)
  // Gaps: prophase, anaphase, telophase, Klinefelter syndrome,
  //       oncogenes, G1 checkpoint, meiosis I vs II, species variation value
  // =========================================================================
  "cell-division-mitosis-meiosis": [
    {
      questionId: "cell-division-mitosis-meiosis-Q13",
      stem: "During prophase of mitosis, which two visible changes occur in the cell?",
      options: { A: "Chromosomes align at the metaphase plate; spindle fibers attach", B: "Chromosomes condense into visible structures; the mitotic spindle begins to form", C: "Sister chromatids separate and move to opposite poles", D: "Nuclear envelopes re-form around each set of chromosomes" },
      correctAnswer: "B",
      rationale: "In prophase: (1) chromatin condenses into distinct visible chromosomes (each already a pair of sister chromatids joined at the centromere), and (2) the mitotic spindle begins assembling from microtubules radiating from the centrosomes. The nuclear envelope breaks down late in prophase (prometaphase). Chromosome alignment = metaphase. Chromatid separation = anaphase. Nuclear envelope re-formation = telophase.",
      difficultyLevel: "foundational",
      keyConceptTested: "prophase — chromosome condensation + spindle formation"
    },
    {
      questionId: "cell-division-mitosis-meiosis-Q14",
      stem: "During anaphase of mitosis, spindle fibers shorten and pull sister chromatids to opposite poles. What does each pole of the dividing cell receive?",
      options: { A: "A complete set of 92 chromatids (double the normal)", B: "A complete set of 46 chromosomes (now single-stranded, as sisters have separated)", C: "23 chromosomes (the haploid number for gamete production)", D: "Random assortments of chromosomes with no guaranteed complete set" },
      correctAnswer: "B",
      rationale: "In anaphase, cohesins holding sister chromatids together are cleaved by separase. Spindle fibers shorten, pulling one chromatid from each pair to each pole. Each pole receives one copy of every chromosome — a full complement of 46 single chromatids (now called chromosomes). This ensures each daughter cell receives a genetically identical diploid set. The 23-chromosome haploid number occurs in meiosis only.",
      difficultyLevel: "foundational",
      keyConceptTested: "anaphase — sister chromatid separation; each pole receives 46"
    },
    {
      questionId: "cell-division-mitosis-meiosis-Q15",
      stem: "Telophase and cytokinesis complete cell division. What is the final outcome of these two processes?",
      options: { A: "Two cells, each with 92 chromosomes (one copy of each chromosome pair)", B: "Four haploid cells genetically identical to the parent", C: "Two genetically identical diploid cells, each with a distinct nucleus and separated cytoplasm", D: "One cell with a double nucleus awaiting the next round of division" },
      correctAnswer: "C",
      rationale: "In telophase, nuclear envelopes re-form around each set of chromosomes at the poles, and chromosomes begin to decondense. Cytokinesis (cleavage furrow in animal cells) then pinches the cytoplasm into two separate cells. The result is two genetically identical daughter cells, each diploid (46 chromosomes), ready to enter G1 of a new cell cycle.",
      difficultyLevel: "foundational",
      keyConceptTested: "telophase + cytokinesis — two identical diploid daughter cells"
    },
    {
      questionId: "cell-division-mitosis-meiosis-Q16",
      stem: "Klinefelter syndrome (47, XXY) most commonly results from:",
      options: { A: "A mutation in a gene controlling male sexual development on the Y chromosome", B: "Nondisjunction of sex chromosomes during meiosis, producing a gamete with both X and Y", C: "Deletion of part of the X chromosome", D: "Trisomy of chromosome 21 rather than sex chromosomes" },
      correctAnswer: "B",
      rationale: "Klinefelter syndrome (47, XXY) occurs when nondisjunction produces a gamete containing both X and Y chromosomes (from the father — XY sperm) or two X chromosomes (from the mother — XX egg). Fertilization then results in a 47, XXY zygote. Features include tall stature, small testes, infertility, and gynecomastia. It is the most common sex chromosome aneuploidy in males (1 in 500–1000).",
      difficultyLevel: "foundational",
      keyConceptTested: "Klinefelter syndrome — 47,XXY; nondisjunction"
    },
    {
      questionId: "cell-division-mitosis-meiosis-Q17",
      stem: "Proto-oncogenes are normal genes that regulate cell growth and division. They become dangerous when they mutate into oncogenes because:",
      options: { A: "They produce tumor suppressor proteins that prevent normal DNA repair", B: "Mutated oncogenes drive continuous, unregulated cell division even without growth signals", C: "They cause cells to enter G0 permanently, preventing normal tissue renewal", D: "Oncogenes suppress the immune system, allowing cancer cells to evade detection" },
      correctAnswer: "B",
      rationale: "Proto-oncogenes encode proteins that normally promote controlled cell cycle progression (growth factors, receptors, signaling molecules). A gain-of-function mutation converts them into oncogenes — which produce continuously active (always 'on') growth signals, driving uncontrolled cell proliferation. RAS is a classic example: mutant RAS (KRAS) continuously signals cell division, found in ~30% of human cancers.",
      difficultyLevel: "applied",
      keyConceptTested: "oncogenes — gain-of-function; continuous growth signaling"
    },
    {
      questionId: "cell-division-mitosis-meiosis-Q18",
      stem: "The G1 checkpoint in the cell cycle evaluates which of the following before allowing the cell to proceed to S phase?",
      options: { A: "Whether the mitotic spindle is properly assembled", B: "Whether all chromosomes are attached to spindle fibers", C: "Whether the cell is large enough and its DNA is undamaged, and whether growth signals are present", D: "Whether DNA replication has been completed accurately" },
      correctAnswer: "C",
      rationale: "The G1 checkpoint (restriction point) evaluates: (1) cell size and nutrient availability, (2) DNA integrity (absence of double-strand breaks), and (3) presence of mitogenic (growth-promoting) signals. If these conditions are met, the cell proceeds to S phase. If DNA is damaged, p53 halts the cycle here. This is the major decision point for whether a cell will divide. The G2 checkpoint checks DNA replication accuracy; the spindle checkpoint verifies chromosome attachment.",
      difficultyLevel: "applied",
      keyConceptTested: "G1 checkpoint — cell size, DNA integrity, growth signals"
    },
    {
      questionId: "cell-division-mitosis-meiosis-Q19",
      stem: "The key difference between Meiosis I and Meiosis II is that:",
      options: { A: "Meiosis I separates sister chromatids; Meiosis II separates homologous chromosome pairs", B: "Meiosis I separates homologous chromosome pairs (reducing chromosome number); Meiosis II separates sister chromatids", C: "Both divisions separate the same structures, but Meiosis II is the first to produce haploid cells", D: "Meiosis I only occurs in females; Meiosis II only in males" },
      correctAnswer: "B",
      rationale: "Meiosis I is the reductional division: homologous chromosome pairs (each consisting of two sister chromatids) separate → daughter cells receive 23 chromosomes (each still as two chromatids). This is where genetic recombination (crossing over) also occurs. Meiosis II is the equational division: sister chromatids separate (like mitosis), producing 4 haploid cells total with 23 single chromosomes each.",
      difficultyLevel: "applied",
      keyConceptTested: "meiosis I vs II — reductional vs equational division"
    },
    {
      questionId: "cell-division-mitosis-meiosis-Q20",
      stem: "Colchicine, derived from the autumn crocus plant, arrests cells in metaphase by disrupting microtubule polymerization. This drug has been used clinically to:",
      options: { A: "Treat bacterial infections by targeting prokaryotic cell division", B: "Treat gout by preventing neutrophil migration (also microtubule-dependent) and reduce inflammation", C: "Stimulate bone marrow cell division to treat anemia", D: "Block meiosis in reproductive cells to prevent genetic disease" },
      correctAnswer: "B",
      rationale: "Colchicine is used clinically to treat acute gout attacks. It disrupts microtubule polymerization, which impairs neutrophil motility and activation — reducing the inflammatory response in gouty joints. It is also used in laboratory karyotyping to arrest cells in metaphase for chromosome analysis. Colchicine does not have antibiotic, hematopoietic, or reproductive applications.",
      difficultyLevel: "applied",
      keyConceptTested: "colchicine — microtubule disruption; gout treatment; karyotyping"
    }
  ],

  // =========================================================================
  // skin-structure-and-functions  (12 → 20, +8)
  // Gaps: sebaceous glands/acne, sensory receptors, arrector pili,
  //       pressure injury staging, nail anatomy, stratum lucidum,
  //       Merkel cells, apocrine glands
  // =========================================================================
  "skin-structure-and-functions": [
    {
      questionId: "skin-structure-and-functions-Q13",
      stem: "Sebaceous glands are associated with hair follicles and secrete sebum. Acne vulgaris results from:",
      options: { A: "Overactivity of eccrine sweat glands causing excess moisture", B: "Blockage of sebaceous gland ducts by excess sebum and dead cells, with subsequent bacterial colonization causing inflammation", C: "Viral infection of the stratum basale disrupting keratinocyte division", D: "Allergic reaction of Langerhans cells to normal skin flora" },
      correctAnswer: "B",
      rationale: "Sebaceous glands secrete sebum (oily lipid mixture) through a duct opening at the hair follicle. Acne vulgaris develops when excess sebum and desquamated cells block the follicular duct (comedone formation) → Cutibacterium acnes (skin bacterium) colonizes → inflammatory response → papules, pustules, and cysts. Androgens increase sebaceous gland activity, explaining acne prevalence during puberty.",
      difficultyLevel: "applied",
      keyConceptTested: "sebaceous glands → acne mechanism"
    },
    {
      questionId: "skin-structure-and-functions-Q14",
      stem: "Pacinian corpuscles in the dermis and hypodermis respond to which sensory stimulus?",
      options: { A: "Light touch and fine texture discrimination", B: "Deep pressure and high-frequency vibration", C: "Temperature changes in the skin", D: "Pain (nociception) from tissue damage" },
      correctAnswer: "B",
      rationale: "Pacinian corpuscles are rapidly adapting mechanoreceptors sensitive to deep pressure and high-frequency vibration. They are large, encapsulated receptors found in the dermis, hypodermis, and periosteum. Meissner's corpuscles (superficial dermis, especially fingertips) detect fine touch and light texture. Thermoreceptors = temperature. Nociceptors = pain (free nerve endings).",
      difficultyLevel: "foundational",
      keyConceptTested: "Pacinian corpuscles — deep pressure and vibration"
    },
    {
      questionId: "skin-structure-and-functions-Q15",
      stem: "Meissner's corpuscles are concentrated in the fingertips, lips, and eyelids. They are specialized for:",
      options: { A: "Detecting deep tissue vibration", B: "Fine touch discrimination and detecting light stroking or textures", C: "Thermal sensation including cold temperatures", D: "Detecting sustained pressure over time" },
      correctAnswer: "B",
      rationale: "Meissner's corpuscles (tactile corpuscles) are rapidly adapting mechanoreceptors in the superficial dermis of highly sensitive areas (fingertips, lips). They are specialized for fine touch, light stroke, and two-point discrimination — the ability to distinguish two nearby touch points as separate. Their concentration in fingertips enables manual dexterity and Braille reading. Pacinian = deep vibration. Ruffini endings = sustained pressure.",
      difficultyLevel: "foundational",
      keyConceptTested: "Meissner's corpuscles — fine touch; fingertip two-point discrimination"
    },
    {
      questionId: "skin-structure-and-functions-Q16",
      stem: "The arrector pili muscle is a smooth muscle attached to each hair follicle. When it contracts, it produces:",
      options: { A: "Increased sebum secretion to lubricate the hair shaft", B: "Piloerection ('goosebumps'), standing the hair upright and compressing the sebaceous gland", C: "Increased blood flow to the follicle to support hair growth", D: "Desquamation (shedding) of the overlying stratum corneum" },
      correctAnswer: "B",
      rationale: "The arrector pili is a small smooth muscle that runs from the hair follicle to the papillary dermis. Contraction (triggered by cold or emotional stress via sympathetic stimulation) pulls the follicle to an upright position, producing piloerection ('goosebumps'). It also briefly compresses the associated sebaceous gland, releasing sebum. In animals with fur, this response traps insulating air; in humans it serves primarily as an autonomic response vestige.",
      difficultyLevel: "foundational",
      keyConceptTested: "arrector pili — piloerection; smooth muscle"
    },
    {
      questionId: "skin-structure-and-functions-Q17",
      stem: "A hospitalized patient develops a Stage 3 pressure injury over the sacrum. A Stage 3 pressure injury is characterized by:",
      options: { A: "Non-blanchable erythema of intact skin only", B: "Partial-thickness loss involving the epidermis and possibly the upper dermis, with a moist wound bed", C: "Full-thickness tissue loss exposing subcutaneous fat, without exposed bone, tendon, or muscle", D: "Full-thickness tissue loss with exposed bone, tendon, or muscle" },
      correctAnswer: "C",
      rationale: "Pressure injury staging: Stage 1 = intact skin, non-blanchable erythema. Stage 2 = partial-thickness skin loss (epidermis ± superficial dermis), moist wound base. Stage 3 = full-thickness tissue loss exposing subcutaneous fat; may have slough but no exposed bone/tendon/muscle. Stage 4 = full-thickness with exposed bone, tendon, or muscle. Unstageable = obscured by slough/eschar.",
      difficultyLevel: "applied",
      keyConceptTested: "pressure injury staging — Stage 3 characteristics"
    },
    {
      questionId: "skin-structure-and-functions-Q18",
      stem: "The stratum lucidum is a layer of the epidermis found only in thick skin (palms of hands and soles of feet). It is absent in thin skin because:",
      options: { A: "Thin skin lacks melanocytes and therefore cannot form this translucent layer", B: "It is an additional translucent layer of dead cells providing extra protection where mechanical stress is greatest", C: "Thin skin is too moist for keratinized cell accumulation to form this layer", D: "The stratum granulosum is absent in thin skin, preventing lucidum formation" },
      correctAnswer: "B",
      rationale: "The stratum lucidum ('clear layer') is an extra layer of dead, flattened, homogenous cells found only in thick skin — the palms and soles, which experience intense mechanical wear and friction. It provides additional protection in these high-stress areas. Thin skin (most of the body) lacks this layer but still has all other epidermal strata.",
      difficultyLevel: "foundational",
      keyConceptTested: "stratum lucidum — thick skin only; palms/soles"
    },
    {
      questionId: "skin-structure-and-functions-Q19",
      stem: "The nail bed has a pink color in well-perfused individuals. This pink color results from:",
      options: { A: "Melanin deposits in the nail plate", B: "Oxygenated hemoglobin in the dermal capillaries visible through the translucent nail plate", C: "Keratin pigments in the thick stratum corneum of the nail", D: "Sebum from adjacent sebaceous glands coloring the nail bed" },
      correctAnswer: "B",
      rationale: "The nail plate is translucent keratinized epithelium. The pink color of a normal nail bed comes from oxygenated hemoglobin in the dense capillary bed of the underlying dermis (nail bed). Cyanosis (low oxygen) turns nail beds blue; anemia (low hemoglobin) makes them pale. Capillary refill time (pressing on the nail until blanching, then releasing) tests peripheral perfusion using this principle.",
      difficultyLevel: "applied",
      keyConceptTested: "nail bed color — dermal capillaries visible through nail plate; perfusion assessment"
    },
    {
      questionId: "skin-structure-and-functions-Q20",
      stem: "Transepidermal water loss (TEWL) is clinically significant in patients with extensive burns because:",
      options: { A: "Burns increase melanin production, blocking UV protection and causing water to evaporate faster", B: "Destruction of the stratum corneum eliminates the waterproofing barrier, causing massive fluid and electrolyte loss through the wound surface", C: "Burns stimulate excessive eccrine sweat gland activity, dramatically increasing fluid loss", D: "Damaged Langerhans cells release inflammatory cytokines that increase capillary permeability and fluid loss" },
      correctAnswer: "B",
      rationale: "The stratum corneum with its lipid-filled keratinized cells provides the primary barrier against TEWL. Burns destroy this layer. Extensive full-thickness burns expose the dermis and underlying tissues — removing the waterproof barrier completely. Burns covering >20% of body surface area require aggressive IV fluid resuscitation (Parkland formula) to replace fluid lost through the wound, which can amount to liters per day.",
      difficultyLevel: "applied",
      keyConceptTested: "TEWL — stratum corneum barrier; burn fluid resuscitation"
    }
  ]
};

// ---------------------------------------------------------------------------
// PATCH ENGINE — appends questions to each topic file
// ---------------------------------------------------------------------------

let grandTotal = 0;
const results = [];

for (const [slug, newQuestions] of Object.entries(ADDITIONS)) {
  // Find the file
  let filePath = null;
  for (const batch of ["batch-01", "batch-02", "batch-03"]) {
    const candidate = path.join(PILOT_DIR, batch, `${slug}.json`);
    if (fs.existsSync(candidate)) { filePath = candidate; break; }
  }
  if (!filePath) { console.error(`❌ File not found for slug: ${slug}`); continue; }

  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const before = data.questions.length;
  data.questions.push(...newQuestions);
  const after = data.questions.length;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  grandTotal += newQuestions.length;
  results.push({ slug, before, added: newQuestions.length, after });
  console.log(`✅ ${slug}: ${before} → ${after} (+${newQuestions.length})`);
}

console.log(`\n${"─".repeat(60)}`);
console.log(`Grand total questions added: ${grandTotal}`);
console.log(`\nFinal counts:`);
results.forEach(r => console.log(`  ${r.slug.padEnd(48)} ${r.after} questions`));
