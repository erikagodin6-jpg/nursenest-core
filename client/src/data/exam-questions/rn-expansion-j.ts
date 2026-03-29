import type { ExamQuestion } from "./types";

export const rnExpansionJQuestions: ExamQuestion[] = [
  // ===== CARDIOVASCULAR: MI, HF, AAA (Questions 1-12) =====
  {
    q: "A 62-year-old male presents with crushing substernal chest pain radiating to the left arm for 30 minutes. ECG shows ST elevation in leads V1-V4. Troponin is pending. What is the priority intervention?",
    o: ["Wait for troponin results before acting", "Activate the cardiac catheterization lab for primary PCI", "Administer oral aspirin and schedule stress test", "Obtain chest X-ray to rule out other causes"],
    a: 1,
    r: "ST elevation in V1-V4 indicates anterior STEMI requiring emergent reperfusion. Primary PCI within 90 minutes is the gold standard. Troponin results should not delay intervention for a clear STEMI on ECG.",
    s: "Cardiovascular"
  },
  {
    q: "A patient with HFrEF (EF 22%) is prescribed carvedilol 3.125mg BID. After 5 days, the patient reports worsened fatigue. The nurse's best response is:",
    o: ["Discontinue carvedilol immediately", "This initial worsening is expected; continue and report severe symptoms", "Double the dose for faster therapeutic effect", "Switch to a calcium channel blocker"],
    a: 1,
    r: "Mild initial worsening of HF symptoms is expected when starting beta-blockers due to the negative inotropic effect. Long-term benefits in mortality reduction far outweigh short-term discomfort. Start low, go slow.",
    s: "Cardiovascular"
  },
  {
    q: "Which medication timing is critical for heart failure management?",
    o: ["Furosemide must be given at exactly the same time daily", "Sacubitril/valsartan requires a 36-hour washout from ACE inhibitors before initiation", "Carvedilol should be taken on an empty stomach", "Digoxin should be given with meals"],
    a: 1,
    r: "A 36-hour washout from ACEi is mandatory before starting sacubitril/valsartan to prevent angioedema from dual inhibition of RAAS and neprilysin pathways.",
    s: "Cardiovascular"
  },
  {
    q: "A patient 6 hours post-EVAR suddenly loses the right pedal pulse that was previously 2+. The right foot is cool and pale. The nurse should:",
    o: ["Apply warm blankets and recheck in 1 hour", "Elevate the right leg above heart level", "Notify the surgeon immediately—possible graft occlusion or embolization", "Document and continue routine monitoring"],
    a: 2,
    r: "Loss of a previously palpable pedal pulse after EVAR indicates possible graft occlusion, distal embolization, or femoral artery thrombosis. This is a vascular emergency requiring immediate surgical evaluation.",
    s: "Cardiovascular"
  },
  {
    q: "The most sensitive daily indicator of fluid status in a heart failure patient is:",
    o: ["Serum BNP level", "Daily weight measured at the same time, same scale, same clothing", "24-hour intake and output", "Lung auscultation findings"],
    a: 1,
    r: "Daily weight is the most sensitive and reliable indicator of fluid balance in HF. Weight gain >2 lbs/day or >5 lbs/week indicates fluid retention requiring intervention.",
    s: "Cardiovascular"
  },
  // ===== NEUROLOGY: Stroke, Seizures, Meningitis (Questions 6-15) =====
  {
    q: "A patient with acute ischemic stroke is NOT a tPA candidate. BP is 196/108. What is the appropriate management?",
    o: ["Reduce BP to <140/90 within 1 hour", "Allow permissive hypertension unless BP exceeds 220/120", "Administer IV labetalol to achieve BP <160/100", "Start oral amlodipine for gradual reduction"],
    a: 1,
    r: "In acute ischemic stroke without tPA, permissive hypertension maintains cerebral perfusion to the ischemic penumbra. BP is only treated if >220/120. Aggressive lowering extends infarction.",
    s: "Neurological"
  },
  {
    q: "Two hours after tPA, a stroke patient develops sudden headache, vomiting, and new neurological deficits. The nurse should FIRST:",
    o: ["Continue tPA and treat nausea", "Stop tPA and obtain stat CT head", "Administer nitroglycerin for hypertension", "Perform NIHSS and document"],
    a: 1,
    r: "Sudden headache, vomiting, and new deficits post-tPA suggest hemorrhagic conversion. Priority: stop tPA immediately, obtain stat CT head, and prepare cryoprecipitate for fibrinogen replacement.",
    s: "Neurological"
  },
  {
    q: "A patient's seizure has lasted 7 minutes with no signs of stopping. Which medication is first-line?",
    o: ["Phenytoin 1000mg IV", "Lorazepam 4mg IV", "Levetiracetam 500mg PO", "Phenobarbital 60mg IM"],
    a: 1,
    r: "Status epilepticus (seizure >5 minutes) requires emergent IV benzodiazepine. Lorazepam 0.1mg/kg (max 4mg) IV is first-line due to rapid onset and longest duration among benzodiazepines for seizure termination.",
    s: "Neurological"
  },
  {
    q: "A patient on phenytoin develops nystagmus and unsteady gait. The nurse should:",
    o: ["Administer the next dose as scheduled", "Hold the medication and check a phenytoin level", "Increase the dose to control breakthrough seizures", "Switch to immediate-release formulation"],
    a: 1,
    r: "Nystagmus and ataxia are early signs of phenytoin toxicity (therapeutic range 10-20 mcg/mL). Phenytoin has zero-order kinetics—small dose increases cause disproportionate level rises.",
    s: "Neurological"
  },
  {
    q: "Which CSF findings are diagnostic of bacterial meningitis?",
    o: ["Lymphocytic pleocytosis with normal glucose", "Neutrophilic pleocytosis with decreased glucose and elevated protein", "Normal WBC with mildly elevated protein", "RBCs with xanthochromia"],
    a: 1,
    r: "Bacterial meningitis: neutrophilic predominance, glucose <40 mg/dL (or <60% serum), protein >100 mg/dL, elevated opening pressure. Viral = lymphocytes, normal glucose. RBCs/xanthochromia = SAH.",
    s: "Neurological"
  },
  // ===== ENDOCRINE: DM, DKA, Thyroid, Adrenal (Questions 16-25) =====
  {
    q: "A Type 1 diabetic is admitted NPO for surgery. Which insulin order should the nurse anticipate?",
    o: ["Hold all insulin until the patient can eat", "Continue basal insulin at reduced dose; hold mealtime rapid-acting insulin", "Switch to oral metformin", "Sliding scale only if glucose >200"],
    a: 1,
    r: "Type 1 patients require basal insulin at ALL times to prevent DKA. Basal dose is typically reduced 20-25% during NPO periods while mealtime insulin is held.",
    s: "Endocrine"
  },
  {
    q: "During DKA treatment, serum K+ is 3.0 mEq/L. The insulin drip is ordered. The nurse should:",
    o: ["Start insulin immediately", "Start insulin with simultaneous potassium", "Hold insulin and replace potassium to ≥3.3 first", "Administer calcium gluconate then start insulin"],
    a: 2,
    r: "If K+ <3.3 mEq/L, insulin is held until potassium is replaced. Insulin drives K+ intracellularly, causing potentially fatal hypokalemia and cardiac arrhythmias from an already dangerously low level.",
    s: "Endocrine"
  },
  {
    q: "When transitioning a DKA patient from IV to SC insulin, how should the overlap be managed?",
    o: ["Stop IV drip immediately when SC given", "Give SC basal insulin at least 2 hours before stopping IV drip", "Wait 4 hours after stopping IV to give SC", "Run both simultaneously for 24 hours"],
    a: 1,
    r: "IV insulin has a half-life of only 5-7 minutes with no depot effect. A 2-hour overlap with SC basal insulin prevents DKA recurrence from the gap in insulin coverage.",
    s: "Endocrine"
  },
  {
    q: "Levothyroxine should be taken:",
    o: ["With a full meal", "On an empty stomach 30-60 minutes before breakfast with water only", "At bedtime with calcium", "With coffee for absorption"],
    a: 1,
    r: "Levothyroxine requires an acidic, empty stomach for optimal absorption. Food, calcium, iron, coffee, and antacids significantly reduce absorption.",
    s: "Endocrine"
  },
  {
    q: "A patient taking prednisone 40mg daily for 6 months asks to stop the medication. The nurse advises:",
    o: ["Stop immediately since feeling well", "Taper gradually over weeks to allow adrenal recovery", "Switch to methimazole", "Stop for 3 days then restart lower"],
    a: 1,
    r: "Chronic corticosteroids suppress the HPA axis, causing adrenal atrophy. Abrupt discontinuation can cause adrenal crisis. Gradual taper over weeks to months allows adrenal recovery.",
    s: "Endocrine"
  },
  // ===== HEMATOLOGY/ONCOLOGY (Questions 26-35) =====
  {
    q: "Fever in a neutropenic patient (ANC <500) requires antibiotics within:",
    o: ["24 hours", "6 hours", "60 minutes", "Only if blood cultures are positive"],
    a: 2,
    r: "Febrile neutropenia is a medical emergency requiring empiric broad-spectrum antibiotics within 60 minutes. Fever may be the ONLY sign—classic inflammatory signs require neutrophils that are absent.",
    s: "Hematology"
  },
  {
    q: "Which cancer has the highest cure rate in children with modern therapy?",
    o: ["AML", "Neuroblastoma", "ALL (85-90% cure rate)", "Wilms tumor"],
    a: 2,
    r: "Acute lymphoblastic leukemia in children has an 85-90% cure rate with modern multi-agent chemotherapy—one of the great successes of pediatric oncology.",
    s: "Hematology"
  },
  {
    q: "A nurse caring for a neutropenic patient should NOT:",
    o: ["Perform hand hygiene before entering the room", "Take a rectal temperature", "Provide a private room", "Restrict fresh flowers in the room"],
    a: 1,
    r: "No rectal temperatures, suppositories, or enemas in neutropenic patients. Rectal manipulation can cause mucosal tears leading to perianal abscess and bacteremia.",
    s: "Hematology"
  },
  {
    q: "A sickle cell patient's spouse reports the patient has been avoiding the ED during pain crises because they feel judged. The nurse should:",
    o: ["Agree that opioids should be avoided", "Acknowledge the concern and ensure timely analgesic administration per protocol", "Recommend non-pharmacological methods only", "Suggest the patient is drug-seeking"],
    a: 1,
    r: "SCD pain crises are real and severe. Undertreatment of pain is a major healthcare disparity. Analgesics should be administered within 30 minutes per protocol without judgment.",
    s: "Hematology"
  },
  {
    q: "Hydroxyurea in sickle cell disease works by:",
    o: ["Directly dissolving sickle cells", "Increasing fetal hemoglobin (HbF) which inhibits HbS polymerization", "Replacing hemoglobin S with hemoglobin A", "Chelating excess iron"],
    a: 1,
    r: "Hydroxyurea increases HbF production, which inhibits HbS polymerization and sickling. It reduces vaso-occlusive crises by 50% and is approved for children as young as 9 months.",
    s: "Hematology"
  },
  // ===== MUSCULOSKELETAL (Questions 36-42) =====
  {
    q: "RA affects joints in which pattern?",
    o: ["Asymmetric large joint involvement", "Symmetric small joint involvement sparing DIP joints", "DIP joint involvement primarily", "Monoarticular large joint"],
    a: 1,
    r: "RA characteristically affects MCP and PIP joints symmetrically while sparing DIP joints. DIP involvement suggests osteoarthritis. Morning stiffness >60 min distinguishes RA from OA.",
    s: "Musculoskeletal"
  },
  {
    q: "Before starting adalimumab (Humira) for RA, which screening test is mandatory?",
    o: ["Hemoglobin A1C", "PPD or IGRA for tuberculosis", "Thyroid function", "Bone density scan"],
    a: 1,
    r: "TNF inhibitors can reactivate latent TB. PPD or IGRA screening is mandatory before initiation. If positive, treatment for latent TB must start before beginning the biologic.",
    s: "Musculoskeletal"
  },
  {
    q: "A rhabdomyolysis patient has K+ 7.1 with peaked T waves on the monitor. The MOST urgent intervention is:",
    o: ["Oral sodium polystyrene sulfonate", "IV calcium gluconate 10 mL over 2-3 minutes", "Initiate hemodialysis", "Restrict dietary potassium"],
    a: 1,
    r: "With K+ >7.0 and ECG changes, IV calcium gluconate stabilizes the cardiac membrane immediately (onset 1-3 min). It does not lower K+ but prevents fatal arrhythmias while other treatments take effect.",
    s: "Musculoskeletal"
  },
  {
    q: "Acute monoarticular joint pain with effusion and fever requires which PRIORITY diagnostic procedure?",
    o: ["X-ray of the joint", "MRI of the joint", "Arthrocentesis for synovial fluid analysis", "Blood cultures only"],
    a: 2,
    r: "Acute monoarticular joint pain with effusion and fever is septic arthritis until proven otherwise. Arthrocentesis is priority for diagnosis (WBC, Gram stain, culture) and therapeutic benefit. Delay can cause irreversible cartilage destruction within 24-48 hours.",
    s: "Musculoskeletal"
  },
  // ===== INFECTION CONTROL / IMMUNE (Questions 43-50) =====
  {
    q: "Which statement about vancomycin administration is correct?",
    o: ["Red Man syndrome is a true allergy requiring permanent avoidance", "Vancomycin should be infused over at least 60 minutes per gram to prevent Red Man syndrome", "Vancomycin trough of 8 is therapeutic for osteomyelitis", "Vancomycin can be given IV push for convenience"],
    a: 1,
    r: "Red Man syndrome is rate-related histamine release, not an allergy. Infuse over ≥60 min/gram. For serious infections (osteomyelitis, bacteremia), target trough is 15-20 mcg/mL.",
    s: "Infection Control"
  },
  {
    q: "Which antibiotic combination should NEVER be used together?",
    o: ["Vancomycin and ceftriaxone", "Piperacillin-tazobactam and gentamicin", "Meropenem and valproic acid", "Cefepime and metronidazole"],
    a: 2,
    r: "Carbapenems (meropenem) reduce valproic acid levels by 60-100%, causing seizure breakthrough. This combination should never be used together.",
    s: "Infection Control"
  },
  {
    q: "Live vaccines are contraindicated in which populations? Select the best answer.",
    o: ["Adults over age 50", "Immunocompromised patients and pregnant women", "Patients with mild illness and low-grade fever", "Patients with egg allergy"],
    a: 1,
    r: "Live vaccines (MMR, varicella, LAIV, rotavirus) are contraindicated in immunocompromised patients and during pregnancy because the attenuated organism could cause disease in these populations.",
    s: "Infection Control"
  },
  {
    q: "Two live vaccines (MMR and varicella) were not both given today. When can the second be administered?",
    o: ["Tomorrow", "1 week later", "At least 28 days later", "Only at the next annual visit"],
    a: 2,
    r: "Live vaccines should be given on the same day or separated by ≥28 days. Giving live vaccines 1-27 days apart may impair immune response to the second vaccine.",
    s: "Infection Control"
  }
];
