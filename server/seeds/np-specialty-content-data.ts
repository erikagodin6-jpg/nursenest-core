import crypto from "crypto";

function hashStem(stem: string): string {
  const normalized = stem.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
  return crypto.createHash("sha256").update(normalized).digest("hex").substring(0, 16);
}

export interface NPQuestion {
  exam: string;
  stem: string;
  options: { label: string; text: string }[];
  correctAnswer: string[];
  rationale: string;
  difficulty: number;
  topic: string;
  subtopic: string;
  bodySystem: string;
  questionFormat: string;
  cognitiveLevel: string;
  scenario: string;
  clinicalPearl: string;
  examStrategy: string;
  memoryHook: string;
  clinicalTrap: string;
  distractorRationales: Record<string, string>;
  tags: string[];
  caseId?: string;
  stemHash: string;
}

const PATIENT_AGES = [
  { desc: "22-year-old", ageGroup: "young-adult" },
  { desc: "28-year-old", ageGroup: "young-adult" },
  { desc: "34-year-old", ageGroup: "adult" },
  { desc: "42-year-old", ageGroup: "adult" },
  { desc: "48-year-old", ageGroup: "middle-age" },
  { desc: "55-year-old", ageGroup: "middle-age" },
  { desc: "62-year-old", ageGroup: "older-adult" },
  { desc: "68-year-old", ageGroup: "older-adult" },
  { desc: "74-year-old", ageGroup: "elderly" },
  { desc: "81-year-old", ageGroup: "elderly" },
];

const GENDERS = ["male", "female"];

const COGNITIVE_LEVELS = ["recall", "application", "analysis", "synthesis"];

const QUESTION_FORMATS = [
  "MCQ", "SATA", "scenario-based", "prioritization",
  "lab-interpretation", "dosage-calculation", "progressive-unfolding",
  "ordered-response", "bowtie",
];

const NGN_FORMATS = ["scenario-based", "bowtie", "SATA", "progressive-unfolding", "lab-interpretation"];

interface SpecialtyTopicBank {
  exam: string;
  topics: TopicQuestionSet[];
}

interface TopicQuestionSet {
  topic: string;
  subtopics: SubtopicBank[];
  bodySystem: string;
  blueprintDomain: string;
}

interface SubtopicBank {
  subtopic: string;
  questionTemplates: QuestionTemplate[];
}

interface QuestionTemplate {
  stemTemplate: string;
  options: { label: string; text: string }[];
  correctAnswer: string[];
  rationaleTemplate: string;
  difficulty: number;
  format: string;
  cognitive: string;
  clinicalPearl: string;
  examStrategy: string;
  memoryHook: string;
  clinicalTrap: string;
  distractorRationales: Record<string, string>;
  isNGN?: boolean;
  caseGroup?: string;
}

function generatePatientDetail(idx: number): { age: string; gender: string } {
  const ageIdx = idx % PATIENT_AGES.length;
  const genderIdx = (idx + Math.floor(idx / PATIENT_AGES.length)) % GENDERS.length;
  return { age: PATIENT_AGES[ageIdx].desc, gender: GENDERS[genderIdx] };
}

function expandTemplate(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }
  return result;
}

export function buildFNPAANPQuestions(): NPQuestion[] {
  const questions: NPQuestion[] = [];
  const hashes = new Set<string>();

  const topicBanks: TopicQuestionSet[] = [
    {
      topic: "Advanced Health Assessment",
      bodySystem: "Multi-system",
      blueprintDomain: "Assessment & Diagnosis",
      subtopics: [
        {
          subtopic: "Head-to-Toe Assessment",
          questionTemplates: [
            {
              stemTemplate: "A {{age}} {{gender}} presents to the primary care clinic for an annual wellness exam. During the head-to-toe assessment, the NP notes a new systolic murmur best heard at the apex with radiation to the axilla. The patient reports occasional dyspnea on exertion. Which of the following is the most appropriate next step?",
              options: [
                { label: "A", text: "Order a transthoracic echocardiogram" },
                { label: "B", text: "Refer immediately to the emergency department" },
                { label: "C", text: "Prescribe a beta-blocker and follow up in 2 weeks" },
                { label: "D", text: "Reassure the patient that this is a benign finding" },
              ],
              correctAnswer: ["A"],
              rationaleTemplate: "A new systolic murmur at the apex radiating to the axilla is characteristic of mitral regurgitation. The presence of dyspnea on exertion suggests hemodynamic significance. The most appropriate next step is to order a transthoracic echocardiogram to evaluate the valve anatomy, severity of regurgitation, and ventricular function. This is not an emergency requiring ED referral unless the patient is hemodynamically unstable. Starting a beta-blocker without diagnostic confirmation is premature. Dismissing the finding as benign without evaluation could miss significant valvular disease that requires monitoring or intervention.",
              difficulty: 3,
              format: "MCQ",
              cognitive: "application",
              clinicalPearl: "A new murmur with associated symptoms always warrants echocardiographic evaluation before initiating treatment.",
              examStrategy: "When a question presents a new physical finding with symptoms, the correct answer is usually further diagnostic workup before treatment.",
              memoryHook: "New Murmur + Symptoms = Echo First",
              clinicalTrap: "Starting treatment before confirming the diagnosis with appropriate imaging.",
              distractorRationales: {
                B: "ED referral is not indicated unless there are signs of acute decompensation such as severe dyspnea at rest, syncope, or hemodynamic instability.",
                C: "Prescribing a beta-blocker without echocardiographic confirmation of the underlying pathology is premature and may not address the underlying cause.",
                D: "A new murmur with associated dyspnea on exertion should not be dismissed as benign without proper evaluation.",
              },
            },
            {
              stemTemplate: "A {{age}} {{gender}} presents with complaints of progressive fatigue and unintentional weight loss of 15 pounds over the past 3 months. Physical examination reveals bilateral cervical lymphadenopathy and hepatosplenomegaly. Which of the following laboratory tests should the NP order first?",
              options: [
                { label: "A", text: "Complete blood count with differential and peripheral smear" },
                { label: "B", text: "Thyroid-stimulating hormone level" },
                { label: "C", text: "HIV antibody test" },
                { label: "D", text: "Comprehensive metabolic panel only" },
              ],
              correctAnswer: ["A"],
              rationaleTemplate: "The combination of progressive fatigue, significant unintentional weight loss, bilateral cervical lymphadenopathy, and hepatosplenomegaly raises concern for hematologic malignancy such as lymphoma or leukemia. A CBC with differential and peripheral smear is the most appropriate initial laboratory test as it can reveal abnormal white cell counts, atypical lymphocytes, blasts, or cytopenias that would guide further workup including bone marrow biopsy, CT imaging, and lymph node biopsy. While TSH and HIV testing may be part of the differential workup, the clinical presentation with lymphadenopathy and organomegaly prioritizes hematologic evaluation. A CMP alone would not identify the likely etiology.",
              difficulty: 4,
              format: "scenario-based",
              cognitive: "analysis",
              clinicalPearl: "Bilateral lymphadenopathy + hepatosplenomegaly + constitutional symptoms (B symptoms) should prompt immediate hematologic evaluation.",
              examStrategy: "When constitutional symptoms combine with lymphadenopathy and organomegaly, think hematologic malignancy first.",
              memoryHook: "LAH = Lymphadenopathy + systemic symptoms Always Hematologic workup first",
              clinicalTrap: "Ordering only a thyroid panel when the clinical picture strongly suggests hematologic pathology.",
              distractorRationales: {
                B: "TSH would evaluate for thyroid dysfunction causing fatigue and weight changes, but does not explain lymphadenopathy and hepatosplenomegaly.",
                C: "HIV testing is important in the differential but is not the first-line test given the constellation of findings suggesting possible malignancy.",
                D: "A CMP evaluates metabolic function but would not identify hematologic abnormalities suggested by this presentation.",
              },
              isNGN: true,
            },
            {
              stemTemplate: "During a well-child visit, the NP examines a {{age}} {{gender}} and notes an asymmetric Moro reflex with the left arm remaining extended while the right arm abducts and extends normally. The birth history includes shoulder dystocia during a prolonged second stage of labor. Which nerve plexus injury does this finding most likely indicate?",
              options: [
                { label: "A", text: "Left brachial plexus injury (Erb-Duchenne palsy)" },
                { label: "B", text: "Right brachial plexus injury (Klumpke palsy)" },
                { label: "C", text: "Bilateral phrenic nerve injury" },
                { label: "D", text: "Left radial nerve palsy" },
              ],
              correctAnswer: ["A"],
              rationaleTemplate: "An asymmetric Moro reflex where one arm fails to abduct and extend is a classic sign of brachial plexus injury. Given the history of shoulder dystocia, the affected (left) side indicates Erb-Duchenne palsy involving the upper brachial plexus (C5-C6). This injury results in the characteristic 'waiter's tip' position with the arm adducted, internally rotated, and the forearm pronated. Klumpke palsy affects the lower plexus (C8-T1) and presents with hand weakness. Phrenic nerve injury would present with respiratory symptoms. Radial nerve palsy would cause wrist drop, not an abnormal Moro reflex pattern.",
              difficulty: 3,
              format: "MCQ",
              cognitive: "application",
              clinicalPearl: "Erb-Duchenne palsy (C5-C6) = 'waiter's tip' position; Klumpke palsy (C8-T1) = 'claw hand'.",
              examStrategy: "Associate shoulder dystocia + asymmetric Moro with Erb palsy on the affected side.",
              memoryHook: "Erb's = Upper plexus = Everything up (shoulder/elbow affected). Klumpke = Klaw (hand affected).",
              clinicalTrap: "Confusing Erb (upper plexus) with Klumpke (lower plexus) palsy based on the affected nerve roots.",
              distractorRationales: {
                B: "Klumpke palsy affects C8-T1 (lower plexus) and presents with hand/finger weakness, not an abnormal Moro pattern.",
                C: "Phrenic nerve injury (C3-C5) causes diaphragmatic paralysis with respiratory distress, not limb movement abnormalities.",
                D: "Radial nerve palsy causes wrist drop and does not affect the Moro reflex pattern.",
              },
            },
          ],
        },
        {
          subtopic: "Cardiovascular Assessment",
          questionTemplates: [
            {
              stemTemplate: "A {{age}} {{gender}} with a history of hypertension presents for a follow-up visit. Blood pressure readings on three separate occasions have been 148/92, 152/94, and 146/90 mmHg despite adherence to lisinopril 20 mg daily. The NP should first consider which of the following?",
              options: [
                { label: "A", text: "Add amlodipine 5 mg daily as a second agent" },
                { label: "B", text: "Increase lisinopril to 40 mg daily" },
                { label: "C", text: "Evaluate for secondary causes of hypertension" },
                { label: "D", text: "Switch to losartan 50 mg daily" },
              ],
              correctAnswer: ["A"],
              rationaleTemplate: "According to JNC 8 and ACC/AHA guidelines, when blood pressure remains above goal on a single agent at adequate dose, adding a second agent from a different class is preferred over uptitrating the same medication. Adding amlodipine (a calcium channel blocker) to an ACE inhibitor provides complementary mechanisms of action and is a recommended combination. Increasing lisinopril dose has diminishing returns and increased side effect risk. Evaluating for secondary hypertension is warranted if BP is resistant to 3 or more agents. Simply switching to another RAAS blocker (losartan) does not provide additional benefit as it works through the same pathway.",
              difficulty: 3,
              format: "MCQ",
              cognitive: "application",
              clinicalPearl: "ACEi + CCB is a preferred combination for hypertension management per current guidelines.",
              examStrategy: "For uncontrolled BP on monotherapy, add a complementary agent rather than increasing the same drug.",
              memoryHook: "Two mechanisms better than one: ACEi (RAAS blockade) + CCB (vasodilation) = complementary control.",
              clinicalTrap: "Maximizing a single agent dose when combination therapy provides better BP reduction with fewer side effects.",
              distractorRationales: {
                B: "Uptitrating lisinopril beyond 20 mg has diminishing antihypertensive returns with increased risk of cough, hyperkalemia, and angioedema.",
                C: "Secondary hypertension workup is indicated when BP is resistant to 3 agents including a diuretic, not after a single agent.",
                D: "Switching from an ACEi to an ARB provides no additional benefit as both block the RAAS pathway.",
              },
            },
            {
              stemTemplate: "A {{age}} {{gender}} presents with acute onset chest pain, diaphoresis, and shortness of breath. The ECG shows ST-segment elevation in leads II, III, and aVF. Which coronary artery is most likely occluded?",
              options: [
                { label: "A", text: "Right coronary artery" },
                { label: "B", text: "Left anterior descending artery" },
                { label: "C", text: "Left circumflex artery" },
                { label: "D", text: "Left main coronary artery" },
              ],
              correctAnswer: ["A"],
              rationaleTemplate: "ST-segment elevation in leads II, III, and aVF indicates an inferior myocardial infarction (STEMI). The inferior wall of the heart is supplied by the right coronary artery (RCA) in approximately 85% of the population (right-dominant circulation). The LAD supplies the anterior wall (leads V1-V4). The left circumflex supplies the lateral wall (leads I, aVL, V5-V6). Left main occlusion would cause diffuse ST changes and typically presents with cardiogenic shock. Understanding coronary anatomy and ECG lead correlation is essential for NP practice in identifying the culprit vessel.",
              difficulty: 3,
              format: "MCQ",
              cognitive: "application",
              clinicalPearl: "Inferior STEMI (II, III, aVF) = RCA. Anterior STEMI (V1-V4) = LAD. Lateral STEMI (I, aVL, V5-V6) = LCx.",
              examStrategy: "Associate ECG lead groups with coronary territories: inferior leads = RCA territory.",
              memoryHook: "RCA = Right = inferior (Right hand points down = inferior wall).",
              clinicalTrap: "Confusing inferior (II, III, aVF = RCA) with anterior (V1-V4 = LAD) MI territories.",
              distractorRationales: {
                B: "The LAD supplies the anterior wall; occlusion causes ST elevation in precordial leads V1-V4.",
                C: "The LCx supplies the lateral wall; occlusion causes ST elevation in leads I, aVL, V5-V6.",
                D: "Left main occlusion causes widespread ST changes and is usually rapidly fatal without intervention.",
              },
            },
          ],
        },
        {
          subtopic: "Respiratory Assessment",
          questionTemplates: [
            {
              stemTemplate: "A {{age}} {{gender}} presents with a 3-week history of productive cough, night sweats, and unintentional weight loss. The patient recently immigrated from a high-prevalence country. Chest X-ray reveals upper lobe cavitary lesion. What is the most appropriate initial diagnostic test?",
              options: [
                { label: "A", text: "Sputum acid-fast bacilli (AFB) smear and culture" },
                { label: "B", text: "Tuberculin skin test (PPD)" },
                { label: "C", text: "Interferon-gamma release assay (IGRA)" },
                { label: "D", text: "CT scan of the chest with contrast" },
              ],
              correctAnswer: ["A"],
              rationaleTemplate: "The presentation of productive cough, night sweats, weight loss, immigration from a high-prevalence country, and upper lobe cavitary lesion on CXR is highly suspicious for active pulmonary tuberculosis. The most appropriate initial diagnostic test is sputum AFB smear and culture, which directly identifies the organism. Three sputum specimens collected on different days are standard. PPD and IGRA are screening tests for TB infection but cannot distinguish active from latent TB, and may be falsely negative in active disease due to anergy. CT scan may provide additional anatomic detail but does not establish the diagnosis. Microbiologic confirmation is essential for treatment planning and public health reporting.",
              difficulty: 3,
              format: "scenario-based",
              cognitive: "analysis",
              clinicalPearl: "Active TB suspected = sputum AFB smear/culture first. PPD/IGRA are for screening latent TB, not diagnosing active disease.",
              examStrategy: "When the question describes classic active TB features, the answer is always microbiologic confirmation (sputum AFB).",
              memoryHook: "Active TB = Active investigation (sputum). Latent TB = Latent screening (PPD/IGRA).",
              clinicalTrap: "Ordering a PPD or IGRA when active TB is suspected - these are screening tests, not diagnostic for active disease.",
              distractorRationales: {
                B: "PPD is a screening test for TB infection, not a diagnostic test for active TB. It can be falsely negative in immunosuppressed patients with active disease.",
                C: "IGRA detects TB infection but cannot distinguish between active and latent TB, making it inappropriate as the sole initial test.",
                D: "CT scan provides detailed imaging but does not establish microbiologic diagnosis needed for treatment and public health reporting.",
              },
              isNGN: true,
            },
          ],
        },
        {
          subtopic: "Neurological Assessment",
          questionTemplates: [
            {
              stemTemplate: "A {{age}} {{gender}} presents with sudden onset right-sided facial droop, arm weakness, and slurred speech that started 2 hours ago. The NP performs a rapid neurological assessment. Which validated stroke scale should be used to quantify the neurological deficit?",
              options: [
                { label: "A", text: "NIH Stroke Scale (NIHSS)" },
                { label: "B", text: "Glasgow Coma Scale (GCS)" },
                { label: "C", text: "Modified Rankin Scale (mRS)" },
                { label: "D", text: "Barthel Index" },
              ],
              correctAnswer: ["A"],
              rationaleTemplate: "The NIH Stroke Scale (NIHSS) is the validated tool for quantifying neurological deficit severity in acute stroke. It evaluates 11 categories including level of consciousness, extraocular movements, visual fields, facial palsy, motor function, limb ataxia, sensory function, language, dysarthria, and extinction/inattention. The score ranges from 0-42 and guides treatment decisions including thrombolytic eligibility. The GCS assesses consciousness level but is not specific to stroke. The mRS measures post-stroke functional outcome, not acute deficit severity. The Barthel Index assesses activities of daily living, not acute neurological status.",
              difficulty: 2,
              format: "MCQ",
              cognitive: "recall",
              clinicalPearl: "NIHSS score guides acute stroke treatment: score 4+ generally warrants thrombolytic consideration within the time window.",
              examStrategy: "Associate acute stroke assessment with NIHSS. Post-stroke function = mRS. Consciousness = GCS.",
              memoryHook: "NIHSS = Now In Hospital Stroke Scale - it's the acute assessment tool.",
              clinicalTrap: "Selecting GCS (consciousness only) instead of NIHSS (comprehensive stroke severity) for acute stroke assessment.",
              distractorRationales: {
                B: "GCS evaluates consciousness level using eye opening, verbal response, and motor response but does not specifically assess stroke-related deficits.",
                C: "mRS is used to measure functional outcome and disability after stroke, not acute deficit severity.",
                D: "Barthel Index assesses independence in activities of daily living and is used in rehabilitation, not acute stroke assessment.",
              },
            },
          ],
        },
      ],
    },
    {
      topic: "Advanced Pharmacology",
      bodySystem: "Pharmacology",
      blueprintDomain: "Clinical Management & Treatment",
      subtopics: [
        {
          subtopic: "Antihypertensives",
          questionTemplates: [
            {
              stemTemplate: "A {{age}} {{gender}} with type 2 diabetes mellitus and stage 2 hypertension (BP 162/96 mmHg) presents for management. Urinalysis shows microalbuminuria (albumin-to-creatinine ratio 45 mg/g). Which antihypertensive class provides the greatest renal protective benefit in this patient?",
              options: [
                { label: "A", text: "ACE inhibitors" },
                { label: "B", text: "Thiazide diuretics" },
                { label: "C", text: "Beta-blockers" },
                { label: "D", text: "Alpha-blockers" },
              ],
              correctAnswer: ["A"],
              rationaleTemplate: "ACE inhibitors (and ARBs) are the preferred antihypertensive class for patients with diabetes and microalbuminuria because they provide renal protective benefits beyond blood pressure reduction. ACEi reduce intraglomerular pressure by dilating the efferent arteriole, slowing the progression of diabetic nephropathy. Multiple landmark trials (HOPE, RENAAL, IDNT) have demonstrated reduction in proteinuria progression and renal endpoints. Thiazide diuretics are effective for BP control but lack the specific nephroprotective mechanism. Beta-blockers and alpha-blockers do not provide the same degree of renal protection in diabetic patients with albuminuria.",
              difficulty: 3,
              format: "MCQ",
              cognitive: "application",
              clinicalPearl: "Diabetes + microalbuminuria = ACEi/ARB first-line regardless of blood pressure, for nephroprotection.",
              examStrategy: "Any question combining diabetes with proteinuria/albuminuria → answer is ACEi or ARB.",
              memoryHook: "ACE protects the kidney's 'Efferent' arteriole → reduces proteinuria in diabetes.",
              clinicalTrap: "Choosing a thiazide for BP control alone without considering the nephroprotective benefit of ACEi in diabetic nephropathy.",
              distractorRationales: {
                B: "Thiazide diuretics effectively lower blood pressure but do not provide the specific renal protective benefits of ACEi/ARB in diabetic nephropathy.",
                C: "Beta-blockers may be used as adjunctive therapy but are not first-line for renal protection in diabetic patients with albuminuria.",
                D: "Alpha-blockers are not recommended as first-line antihypertensives and do not provide nephroprotective benefits.",
              },
            },
            {
              stemTemplate: "A {{age}} {{gender}} is prescribed lisinopril 10 mg daily for hypertension. Two weeks later, laboratory results show potassium of 5.8 mEq/L (normal 3.5-5.0) and creatinine increased from 1.0 to 1.6 mg/dL. Which is the most appropriate action?",
              options: [
                { label: "A", text: "Discontinue lisinopril and switch to amlodipine" },
                { label: "B", text: "Continue lisinopril and recheck labs in 1 week" },
                { label: "C", text: "Add furosemide to reduce potassium" },
                { label: "D", text: "Increase lisinopril to 20 mg daily" },
              ],
              correctAnswer: ["A"],
              rationaleTemplate: "Hyperkalemia (5.8 mEq/L) and a significant rise in creatinine (>50% from baseline) after starting an ACE inhibitor indicate potential renovascular disease or impaired renal function. When creatinine rises more than 30% from baseline or potassium exceeds 5.5 mEq/L, the ACEi should be discontinued. Switching to amlodipine, a calcium channel blocker that does not affect potassium or renal hemodynamics, is appropriate. Continuing the drug risks worsening hyperkalemia and acute kidney injury. Adding furosemide is not a substitute for addressing the underlying drug-induced renal impairment. Increasing the dose would worsen both the hyperkalemia and renal dysfunction.",
              difficulty: 4,
              format: "MCQ",
              cognitive: "analysis",
              clinicalPearl: "Stop ACEi/ARB if creatinine rises >30% from baseline or K+ >5.5 mEq/L. This may indicate renal artery stenosis.",
              examStrategy: "ACEi + rising creatinine + hyperkalemia = stop the drug and switch classes.",
              memoryHook: "ACEi adverse = K+ up, Cr up → ACEi must go up (off the med list).",
              clinicalTrap: "Continuing the ACEi and just adding potassium-lowering therapy instead of addressing the root cause.",
              distractorRationales: {
                B: "Continuing an ACE inhibitor with K+ >5.5 and creatinine rise >50% risks life-threatening hyperkalemia and acute renal failure.",
                C: "Adding furosemide may transiently lower potassium but does not address the ACEi-induced renal impairment and could worsen renal function.",
                D: "Increasing the dose would exacerbate both the hyperkalemia and renal dysfunction.",
              },
            },
          ],
        },
        {
          subtopic: "Diabetes Medications",
          questionTemplates: [
            {
              stemTemplate: "A {{age}} {{gender}} with type 2 diabetes, BMI 34, and established atherosclerotic cardiovascular disease (ASCVD) has an HbA1c of 8.2% despite maximum-dose metformin. Which medication class should the NP add as second-line therapy based on current ADA guidelines?",
              options: [
                { label: "A", text: "GLP-1 receptor agonist (e.g., semaglutide)" },
                { label: "B", text: "Sulfonylurea (e.g., glipizide)" },
                { label: "C", text: "DPP-4 inhibitor (e.g., sitagliptin)" },
                { label: "D", text: "Thiazolidinedione (e.g., pioglitazone)" },
              ],
              correctAnswer: ["A"],
              rationaleTemplate: "Per current ADA Standards of Care, for patients with T2DM and established ASCVD, a GLP-1 receptor agonist with proven cardiovascular benefit (such as semaglutide or liraglutide) should be added to metformin regardless of HbA1c level. The SUSTAIN-6 and LEADER trials demonstrated significant reduction in major adverse cardiovascular events (MACE). GLP-1 RAs also promote weight loss, which benefits this obese patient. Sulfonylureas increase hypoglycemia risk and promote weight gain. DPP-4 inhibitors have cardiovascular neutrality without proven benefit. Pioglitazone carries risks of weight gain, edema, and heart failure exacerbation.",
              difficulty: 3,
              format: "MCQ",
              cognitive: "application",
              clinicalPearl: "T2DM + ASCVD = GLP-1 RA or SGLT2i with proven CV benefit, regardless of HbA1c. T2DM + HF/CKD = SGLT2i preferred.",
              examStrategy: "When the stem mentions ASCVD + T2DM, the answer is GLP-1 RA or SGLT2i. When it mentions HF or CKD, prefer SGLT2i.",
              memoryHook: "ASCVD = GLP-1 (cardiovascular benefit). HF/CKD = SGLT2i (cardiorenal benefit).",
              clinicalTrap: "Choosing a sulfonylurea for its potent glucose-lowering effect while ignoring the cardiovascular benefit of GLP-1 RAs.",
              distractorRationales: {
                B: "Sulfonylureas lower HbA1c effectively but increase hypoglycemia risk, promote weight gain, and have no proven cardiovascular benefit.",
                C: "DPP-4 inhibitors are cardiovascularly neutral and do not provide the MACE reduction demonstrated by GLP-1 RAs in patients with ASCVD.",
                D: "Pioglitazone causes fluid retention and weight gain and is contraindicated in heart failure, limiting its use in patients with cardiovascular disease.",
              },
            },
          ],
        },
        {
          subtopic: "Antibiotic Prescribing",
          questionTemplates: [
            {
              stemTemplate: "A {{age}} {{gender}} presents with a 5-day history of purulent nasal discharge, facial pain, and fever of 101.2F. Symptoms initially improved then worsened (double sickening pattern). The NP diagnoses acute bacterial rhinosinusitis. Which is the first-line antibiotic?",
              options: [
                { label: "A", text: "Amoxicillin-clavulanate 875/125 mg BID for 5-7 days" },
                { label: "B", text: "Azithromycin 500 mg day 1, then 250 mg days 2-5" },
                { label: "C", text: "Levofloxacin 500 mg daily for 10 days" },
                { label: "D", text: "Cephalexin 500 mg QID for 10 days" },
              ],
              correctAnswer: ["A"],
              rationaleTemplate: "Amoxicillin-clavulanate is the recommended first-line antibiotic for acute bacterial rhinosinusitis per IDSA guidelines. The clavulanate component provides beta-lactamase coverage against H. influenzae and M. catarrhalis. The shorter course (5-7 days) is as effective as longer courses with fewer side effects. Azithromycin has high resistance rates among respiratory pathogens (>30-40%) and is no longer recommended for sinusitis. Fluoroquinolones (levofloxacin) should be reserved for penicillin-allergic patients or treatment failure. Cephalexin has poor sinus penetration and inadequate coverage for typical sinusitis pathogens.",
              difficulty: 2,
              format: "MCQ",
              cognitive: "application",
              clinicalPearl: "IDSA first-line for ABRS: amoxicillin-clavulanate. Reserve fluoroquinolones for PCN allergy or treatment failure.",
              examStrategy: "For uncomplicated bacterial sinusitis, always choose amoxicillin-clavulanate over azithromycin or fluoroquinolones.",
              memoryHook: "Sinusitis = Amox-Clav. Z-pack = high resistance. FQ = fallback only.",
              clinicalTrap: "Prescribing azithromycin (Z-pack) for sinusitis despite high resistance rates making it ineffective.",
              distractorRationales: {
                B: "Azithromycin has high resistance rates (>30-40%) among S. pneumoniae and H. influenzae, making it unreliable for sinusitis treatment.",
                C: "Levofloxacin is a respiratory fluoroquinolone reserved for second-line use due to risk of tendon rupture, QT prolongation, and resistance concerns.",
                D: "Cephalexin (first-generation cephalosporin) has poor activity against H. influenzae and M. catarrhalis and inadequate sinus tissue penetration.",
              },
            },
          ],
        },
        {
          subtopic: "Psychotropic Medications",
          questionTemplates: [
            {
              stemTemplate: "A {{age}} {{gender}} is started on sertraline 50 mg daily for major depressive disorder. The patient returns 2 weeks later reporting improved mood but experiencing significant nausea and sexual dysfunction. Which is the most appropriate management?",
              options: [
                { label: "A", text: "Continue sertraline and reassess in 2 more weeks as GI side effects often resolve" },
                { label: "B", text: "Immediately switch to bupropion 150 mg XL daily" },
                { label: "C", text: "Discontinue sertraline and start a tricyclic antidepressant" },
                { label: "D", text: "Double the sertraline dose to 100 mg to achieve faster response" },
              ],
              correctAnswer: ["A"],
              rationaleTemplate: "SSRI-induced gastrointestinal side effects (nausea, diarrhea) typically resolve within the first 2-4 weeks of treatment. Since the patient is showing mood improvement at 2 weeks, it is appropriate to continue the medication and allow time for GI side effect resolution. Switching medications at this early stage would disrupt the therapeutic response that has begun. If side effects persist beyond 4-6 weeks, switching to bupropion (which has lower rates of sexual dysfunction and GI effects) would be appropriate. Tricyclics have more side effects overall. Doubling the dose prematurely could worsen side effects.",
              difficulty: 3,
              format: "MCQ",
              cognitive: "application",
              clinicalPearl: "SSRI GI side effects are usually transient (2-4 weeks). Sexual dysfunction tends to persist. Counseling patients on this timeline improves adherence.",
              examStrategy: "When a patient shows therapeutic benefit from an SSRI with tolerable early side effects, the answer is usually to continue and reassess.",
              memoryHook: "SSRI GI = Goes In time (resolves). SSRI Sexual = Stays (persistent).",
              clinicalTrap: "Prematurely switching medications when the patient is responding to treatment and GI side effects are likely to resolve.",
              distractorRationales: {
                B: "Switching medications disrupts the therapeutic response that has begun and delays achieving full remission. Switch only if side effects persist or worsen.",
                C: "TCAs have higher side effect burden (anticholinergic effects, cardiac conduction risk, overdose lethality) and are not first-line alternatives.",
                D: "Increasing the dose at 2 weeks is premature - full SSRI effect takes 4-6 weeks, and dose escalation should occur only after adequate trial duration.",
              },
            },
          ],
        },
      ],
    },
    {
      topic: "Diagnostic Reasoning",
      bodySystem: "Multi-system",
      blueprintDomain: "Assessment & Diagnosis",
      subtopics: [
        {
          subtopic: "Laboratory Interpretation",
          questionTemplates: [
            {
              stemTemplate: "A {{age}} {{gender}} presents with fatigue, cold intolerance, constipation, and dry skin. Laboratory results show TSH 12.4 mIU/L (normal 0.4-4.0), free T4 0.6 ng/dL (normal 0.8-1.8). Which is the most appropriate initial treatment?",
              options: [
                { label: "A", text: "Levothyroxine 1.6 mcg/kg/day, titrate based on TSH in 6-8 weeks" },
                { label: "B", text: "Liothyronine (T3) 25 mcg daily" },
                { label: "C", text: "Desiccated thyroid extract 60 mg daily" },
                { label: "D", text: "Methimazole 10 mg daily" },
              ],
              correctAnswer: ["A"],
              rationaleTemplate: "The laboratory findings (elevated TSH with low free T4) confirm primary hypothyroidism. Levothyroxine (synthetic T4) is the standard of care for hypothyroidism replacement. The typical starting dose is 1.6 mcg/kg/day for full replacement in otherwise healthy adults. TSH should be rechecked in 6-8 weeks to guide dose titration, as TSH takes 6-8 weeks to equilibrate after dose changes. Liothyronine (T3) alone is not recommended as monotherapy due to its short half-life and supraphysiologic T3 levels. Desiccated thyroid has variable potency and inconsistent T4:T3 ratios. Methimazole is an antithyroid medication used for hyperthyroidism and would worsen this patient's condition.",
              difficulty: 2,
              format: "lab-interpretation",
              cognitive: "application",
              clinicalPearl: "Levothyroxine dose: 1.6 mcg/kg/day full replacement. Elderly/cardiac patients: start low (25-50 mcg) and titrate slowly.",
              examStrategy: "High TSH + Low T4 = Hypothyroidism = Levothyroxine. Low TSH + High T4 = Hyperthyroidism = Methimazole/PTU.",
              memoryHook: "Hypo = Low T4, High TSH, Levothyroxine. Hyper = High T4, Low TSH, Methimazole.",
              clinicalTrap: "Prescribing methimazole (antithyroid drug) for hypothyroidism instead of levothyroxine (thyroid replacement).",
              distractorRationales: {
                B: "T3 monotherapy causes rapid peaks and troughs in T3 levels due to its short half-life (1 day vs. 7 days for T4).",
                C: "Desiccated thyroid has variable potency and inconsistent T4:T3 ratios, making it difficult to achieve precise dosing.",
                D: "Methimazole is an antithyroid agent that inhibits thyroid hormone synthesis - it would worsen hypothyroidism.",
              },
              isNGN: true,
            },
          ],
        },
        {
          subtopic: "Differential Diagnosis",
          questionTemplates: [
            {
              stemTemplate: "A {{age}} {{gender}} presents with acute onset right lower quadrant abdominal pain, nausea, and low-grade fever. McBurney point tenderness and positive Rovsing sign are noted on examination. WBC is 14,200/mm3. Which is the most likely diagnosis?",
              options: [
                { label: "A", text: "Acute appendicitis" },
                { label: "B", text: "Right-sided diverticulitis" },
                { label: "C", text: "Mesenteric lymphadenitis" },
                { label: "D", text: "Crohn disease exacerbation" },
              ],
              correctAnswer: ["A"],
              rationaleTemplate: "The classic presentation of acute appendicitis includes periumbilical pain that migrates to the right lower quadrant, nausea/anorexia, low-grade fever, McBurney point tenderness (1/3 of the distance from the anterior superior iliac spine to the umbilicus), positive Rovsing sign (RLQ pain with palpation of the LLQ), and leukocytosis. This constellation of findings has high sensitivity and specificity for appendicitis. Right-sided diverticulitis is possible but much less common and lacks the specific McBurney point tenderness. Mesenteric lymphadenitis typically occurs in children following viral illness. Crohn disease may cause RLQ pain but typically has a more chronic course with diarrhea and weight loss.",
              difficulty: 2,
              format: "scenario-based",
              cognitive: "application",
              clinicalPearl: "Classic appendicitis triad: RLQ pain (McBurney point), fever, leukocytosis. Rovsing sign adds specificity.",
              examStrategy: "McBurney point + Rovsing sign + leukocytosis = appendicitis until proven otherwise.",
              memoryHook: "McBurney = M for McBurney, M for mandatory appendicitis sign.",
              clinicalTrap: "Diagnosing diverticulitis in a young patient - diverticulitis is predominantly a disease of adults >40 and usually left-sided.",
              distractorRationales: {
                B: "Diverticulitis is typically left-sided (sigmoid colon) and more common in older adults. Right-sided diverticulitis is rare.",
                C: "Mesenteric lymphadenitis typically follows a viral URI in children and lacks the specific signs of appendicitis.",
                D: "Crohn disease has a chronic course with diarrhea, weight loss, and may cause RLQ pain but would not present with acute onset and specific appendiceal signs.",
              },
              isNGN: true,
            },
          ],
        },
      ],
    },
    {
      topic: "Health Promotion & Disease Prevention",
      bodySystem: "Preventive Care",
      blueprintDomain: "Health Promotion",
      subtopics: [
        {
          subtopic: "Cancer Screening",
          questionTemplates: [
            {
              stemTemplate: "A {{age}} {{gender}} with no significant family history asks the NP about colorectal cancer screening. According to USPSTF recommendations, which screening approach is most appropriate for average-risk adults beginning at age 45?",
              options: [
                { label: "A", text: "Colonoscopy every 10 years or annual FIT" },
                { label: "B", text: "Colonoscopy every 5 years starting at age 50" },
                { label: "C", text: "Annual fecal occult blood test starting at age 40" },
                { label: "D", text: "Flexible sigmoidoscopy annually starting at age 45" },
              ],
              correctAnswer: ["A"],
              rationaleTemplate: "The USPSTF updated their colorectal cancer screening recommendation in 2021, lowering the starting age from 50 to 45 for average-risk adults. Recommended screening options include colonoscopy every 10 years, annual high-sensitivity fecal immunochemical test (FIT), or FIT-DNA (Cologuard) every 1-3 years, among other options. The key update is the age change to 45 based on increasing CRC incidence in younger adults. Screening continues through age 75, with individualized decisions for ages 76-85. The question tests knowledge of current guidelines and appropriate screening intervals.",
              difficulty: 2,
              format: "MCQ",
              cognitive: "recall",
              clinicalPearl: "USPSTF 2021: CRC screening starts at age 45 (lowered from 50). Colonoscopy q10yr or FIT annually.",
              examStrategy: "Know that CRC screening now starts at 45, not 50. This is a frequently tested guideline change.",
              memoryHook: "45 is the new 50 for CRC screening (USPSTF 2021 update).",
              clinicalTrap: "Using the old recommendation of age 50 for CRC screening initiation.",
              distractorRationales: {
                B: "Starting at age 50 reflects the outdated guideline. The USPSTF 2021 recommendation lowered the starting age to 45.",
                C: "FOBT has been largely replaced by FIT, which has better sensitivity and specificity. Starting at 40 is not guideline-recommended for average risk.",
                D: "Flexible sigmoidoscopy is recommended every 5 years (not annually), and can be combined with FIT every 10 years.",
              },
            },
          ],
        },
        {
          subtopic: "Immunizations",
          questionTemplates: [
            {
              stemTemplate: "A {{age}} {{gender}} with well-controlled HIV (CD4 count 450 cells/mm3, undetectable viral load) asks about recommended vaccinations. Which vaccine is contraindicated in this patient?",
              options: [
                { label: "A", text: "Live attenuated influenza vaccine (LAIV/FluMist)" },
                { label: "B", text: "Inactivated influenza vaccine (IIV)" },
                { label: "C", text: "Pneumococcal conjugate vaccine (PCV20)" },
                { label: "D", text: "Hepatitis B vaccine" },
              ],
              correctAnswer: ["A"],
              rationaleTemplate: "Live attenuated influenza vaccine (LAIV/FluMist) is contraindicated in immunocompromised patients, including those with HIV, regardless of CD4 count or viral load control. Live vaccines carry the risk of vaccine-derived infection in immunocompromised hosts. The inactivated influenza vaccine (IIV) is safe and recommended annually for HIV-positive patients. PCV20 is recommended for all immunocompromised adults, including HIV patients. Hepatitis B vaccine is recommended and safe for HIV-positive patients. The key principle is that live vaccines are generally contraindicated in immunocompromised patients, with specific exceptions (e.g., MMR and varicella may be given if CD4 >200).",
              difficulty: 2,
              format: "MCQ",
              cognitive: "recall",
              clinicalPearl: "Live vaccines contraindicated in immunocompromised: LAIV, oral polio, BCG, smallpox. Exception: MMR/varicella if CD4 >200.",
              examStrategy: "When asked about vaccines in immunocompromised patients, identify the live vaccine - that is the contraindicated one.",
              memoryHook: "LAIV = Live = Lethal risk in immunocompromised. IIV = Inactivated = safe.",
              clinicalTrap: "Confusing LAIV (live, contraindicated) with IIV (inactivated, recommended) in immunocompromised patients.",
              distractorRationales: {
                B: "Inactivated influenza vaccine is safe and strongly recommended for all HIV-positive patients annually.",
                C: "PCV20 is recommended for immunocompromised adults including HIV patients for enhanced pneumococcal protection.",
                D: "Hepatitis B vaccine is safe and recommended for HIV-positive patients, who are at higher risk for hepatitis B complications.",
              },
            },
          ],
        },
      ],
    },
    {
      topic: "Professional Practice",
      bodySystem: "Professional",
      blueprintDomain: "Professional Practice",
      subtopics: [
        {
          subtopic: "Scope of Practice",
          questionTemplates: [
            {
              stemTemplate: "A {{age}} {{gender}} NP working in a full practice authority state evaluates a patient with suspected deep vein thrombosis. Which action is within the NP's independent scope of practice?",
              options: [
                { label: "A", text: "Order a venous duplex ultrasound and initiate anticoagulation if positive" },
                { label: "B", text: "Refer to a physician for diagnostic workup and management" },
                { label: "C", text: "Order the ultrasound but defer anticoagulation to physician consultation" },
                { label: "D", text: "Prescribe aspirin and schedule follow-up in 1 week" },
              ],
              correctAnswer: ["A"],
              rationaleTemplate: "In full practice authority states, NPs can independently evaluate, diagnose, order diagnostic tests, prescribe medications (including controlled substances), and manage patients without physician oversight. Ordering a venous duplex ultrasound for suspected DVT and initiating anticoagulation (typically with a DOAC such as rivaroxaban or apixaban) if confirmed are within the NP's independent scope. Referral to a physician is not required in full practice authority states. Deferring anticoagulation delays treatment of a potentially life-threatening condition. Prescribing aspirin alone is inadequate for DVT treatment and could lead to pulmonary embolism.",
              difficulty: 2,
              format: "MCQ",
              cognitive: "application",
              clinicalPearl: "Full practice authority = NP can independently diagnose, treat, and prescribe (including controlled substances).",
              examStrategy: "Know the three levels of NP practice authority: full, reduced, and restricted. Full = independent practice.",
              memoryHook: "Full practice = Full independence. Reduced = Collaborative agreement. Restricted = Physician supervision.",
              clinicalTrap: "Assuming NPs always need physician consultation when in a full practice authority state.",
              distractorRationales: {
                B: "Referral is unnecessary in full practice authority states where NPs practice independently.",
                C: "Deferring anticoagulation to physician consultation delays critical treatment and is unnecessary in full practice authority.",
                D: "Aspirin is not adequate anticoagulation for DVT and risks PE progression. Standard treatment is therapeutic anticoagulation.",
              },
            },
          ],
        },
      ],
    },
  ];

  let questionIndex = 0;
  for (const topicSet of topicBanks) {
    for (const subtopicBank of topicSet.subtopics) {
      for (const template of subtopicBank.questionTemplates) {
        for (let variation = 0; variation < PATIENT_AGES.length; variation++) {
          const { age, gender } = generatePatientDetail(variation + questionIndex);
          const vars = { age, gender };

          const stem = expandTemplate(template.stemTemplate, vars);
          const rationale = expandTemplate(template.rationaleTemplate, vars);
          const hash = hashStem(stem);

          if (hashes.has(hash)) continue;
          hashes.add(hash);

          questions.push({
            exam: "AANP-FNP",
            stem,
            options: template.options,
            correctAnswer: template.correctAnswer,
            rationale,
            difficulty: template.difficulty,
            topic: topicSet.topic,
            subtopic: subtopicBank.subtopic,
            bodySystem: topicSet.bodySystem,
            questionFormat: template.format,
            cognitiveLevel: template.cognitive,
            scenario: stem.substring(0, 200),
            clinicalPearl: template.clinicalPearl,
            examStrategy: template.examStrategy,
            memoryHook: template.memoryHook,
            clinicalTrap: template.clinicalTrap,
            distractorRationales: template.distractorRationales,
            tags: ["AANP-FNP", topicSet.topic, subtopicBank.subtopic, topicSet.blueprintDomain],
            caseId: template.caseGroup ? `AANP-FNP-${template.caseGroup}-${variation}` : undefined,
            stemHash: hash,
          });

          questionIndex++;
        }
      }
    }
  }

  return questions;
}

export const NP_SPECIALTY_CONFIGS = [
  {
    exam: "AANP-FNP",
    label: "AANP Family Nurse Practitioner",
    focus: "family/primary care across the lifespan",
    region: "US",
    population: "all ages, families, communities",
  },
  {
    exam: "ANCC-FNP",
    label: "ANCC Family Nurse Practitioner Board Certification",
    focus: "family/primary care with research and evidence-based practice emphasis",
    region: "US",
    population: "all ages, families, communities",
  },
  {
    exam: "AGPCNP-AANP",
    label: "Adult-Gerontology Primary Care NP (AANP)",
    focus: "primary care of adults and older adults",
    region: "US",
    population: "adults and geriatric patients",
  },
  {
    exam: "AGPCNP-ANCC",
    label: "Adult-Gerontology Primary Care NP (ANCC)",
    focus: "primary care of adults and older adults with EBP emphasis",
    region: "US",
    population: "adults and geriatric patients",
  },
  {
    exam: "AGACNP",
    label: "Adult-Gerontology Acute Care NP",
    focus: "acute and critical care management of adults",
    region: "US",
    population: "acutely ill adults and older adults",
  },
  {
    exam: "PMHNP",
    label: "Psychiatric-Mental Health NP",
    focus: "psychiatric assessment and psychopharmacology",
    region: "US",
    population: "patients with mental health and substance use disorders",
  },
  {
    exam: "PNP",
    label: "Pediatric Nurse Practitioner",
    focus: "pediatric primary and acute care",
    region: "US",
    population: "neonates, infants, children, and adolescents",
  },
  {
    exam: "WHNP",
    label: "Women's Health Nurse Practitioner",
    focus: "women's reproductive and primary health care",
    region: "US",
    population: "women across the lifespan",
  },
  {
    exam: "ENP",
    label: "Emergency Nurse Practitioner",
    focus: "emergency and urgent care",
    region: "US",
    population: "patients presenting with acute/emergent conditions",
  },
];
