import { useI18n } from "@/lib/i18n";
import {
  MicroLesson,
  CognitiveCard,
  HoverReveal,
  MatchingExercise,
  SelfCheckQuiz,
  ProgressiveReveal,
} from "@/components/interactive-learning";
import { EditableModuleText, useEditableText } from "@/components/module-edit-context";
import { Microscope, Activity, Scan, FlaskConical, Radio } from "lucide-react";

export function DiagnosticsModule() {
  const { t } = useI18n();
  const contrastMediaContent = useEditableText("diag-contrast-media-content", "Contrast media enhances imaging by increasing the difference in density between structures. Iodinated contrast is used for CT scans and angiography; gadolinium-based contrast is used for MRI. Patients must be screened for allergies (especially iodine/shellfish for CT contrast), renal function (contrast can cause nephropathy — check creatinine/GFR before administration), and metformin use (must be held 48 hours post-contrast to prevent lactic acidosis). Signs of contrast reaction range from mild (hives, itching) to severe (anaphylaxis with bronchospasm and hypotension). Emergency equipment must be immediately available.");
  const sensitivitySpecificityContent = useEditableText("diag-sensitivity-specificity-content", "Sensitivity and specificity are fundamental properties of diagnostic tests. Sensitivity (true positive rate) answers: 'If the patient HAS the disease, will the test detect it?' A highly sensitive test rarely misses disease — useful for screening (rule OUT). Specificity (true positive rate for negatives) answers: 'If the patient does NOT have the disease, will the test correctly show negative?' A highly specific test rarely gives false positives — useful for confirmation (rule IN). Memory aid: SN-N-OUT (Sensitive test, Negative result, rules OUT disease) and SP-P-IN (Specific test, Positive result, rules IN disease).");
  const pocTestingContent = useEditableText("diag-poc-testing-content", "Point-of-care testing (POCT) provides rapid results at the bedside, enabling immediate clinical decisions. Common POCT includes: blood glucose monitoring (most common POCT in nursing), urine dipstick analysis, rapid strep tests, pregnancy tests (hCG), troponin for acute MI, INR for anticoagulation monitoring, and arterial blood gases. Advantages include faster turnaround and immediate treatment decisions. Limitations include potentially lower accuracy than central lab testing, need for quality control, and operator-dependent reliability. Nurses must follow facility protocols for POCT quality assurance.");

  return (
    <div className="space-y-10" data-testid="module-diagnostics">
      <div>
        <EditableModuleText sectionKey="diag-title" defaultText="Diagnostic Testing & Imaging Foundations" as="h2" className="text-2xl font-bold text-gray-900 mb-2" />
        <EditableModuleText sectionKey="diag-desc" defaultText="Understand the principles behind common diagnostic tests, imaging modalities, ECG basics, laboratory values, and how sensitivity and specificity guide clinical decision-making." as="p" className="text-gray-600" multiline />
      </div>

      <MicroLesson title="Imaging Modalities: X-ray, CT, MRI, and Ultrasound" subtitle="When and why each is used" icon={<Scan className="w-5 h-5" />}>
        <EditableModuleText sectionKey="diag-imaging-intro" defaultText="Diagnostic imaging allows visualization of internal structures without invasive procedures. Each modality has distinct principles, advantages, and appropriate clinical applications. Understanding when to use each type is essential for nurses who prepare patients, explain procedures, and monitor for complications." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">X-ray (Radiography)</p>
            <p className="text-xs text-blue-600">Uses ionizing radiation to produce 2D images. Best for: bones (fractures), chest (pneumonia, heart size, pneumothorax), abdomen (bowel obstruction, foreign bodies). Fast, inexpensive, widely available. Limitations: 2D only, limited soft tissue detail, radiation exposure. Pregnancy precaution: shield abdomen or avoid if possible.</p>
          </div>
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 mb-1">CT Scan (Computed Tomography)</p>
            <p className="text-xs text-purple-600">Uses X-rays from multiple angles to create cross-sectional images. Best for: trauma assessment, stroke (hemorrhagic vs ischemic), pulmonary embolism, abdominal emergencies, cancer staging. Fast (minutes), excellent detail. Higher radiation dose than X-ray. Often uses iodinated contrast — check allergies and renal function. CT is the gold standard for acute stroke evaluation.</p>
          </div>
          <div className="p-4 bg-green-50/60 rounded-xl border border-green-100">
            <p className="text-xs font-semibold text-green-700 mb-1">MRI (Magnetic Resonance Imaging)</p>
            <p className="text-xs text-green-600">Uses strong magnetic fields and radio waves — NO ionizing radiation. Best for: brain and spinal cord, soft tissues (ligaments, tendons, cartilage), tumors, cardiac imaging. Superior soft tissue contrast. Takes 30-90 minutes, patient must remain still. Contraindications: pacemakers (most), metallic implants, cochlear implants, metal fragments. Uses gadolinium contrast (check renal function — risk of nephrogenic systemic fibrosis).</p>
          </div>
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
            <p className="text-xs font-semibold text-amber-700 mb-1">Ultrasound (Sonography)</p>
            <p className="text-xs text-amber-600">Uses high-frequency sound waves — no radiation. Best for: pregnancy monitoring, gallbladder (stones), cardiac assessment (echocardiogram), vascular studies (DVT), guided procedures (IV placement, biopsies), kidney assessment. Real-time imaging, portable, safe in pregnancy. Limitations: operator-dependent, limited by body habitus and gas/bone interference.</p>
          </div>
        </div>
        <CognitiveCard
          type="warning"
          title={t("data.pre_nursing_diagnostics.contrastMediaSafety")}
          content={contrastMediaContent}
        />
      </MicroLesson>

      <MicroLesson title="ECG Basic Concepts" subtitle="Understanding the cardiac electrical tracing" icon={<Activity className="w-5 h-5" />}>
        <EditableModuleText sectionKey="diag-ecg-intro" defaultText="An electrocardiogram (ECG/EKG) records the electrical activity of the heart through electrodes placed on the skin. A standard 12-lead ECG provides a comprehensive view of cardiac electrical activity from 12 different angles. Understanding the basic waveforms is essential for recognizing normal rhythm and detecting life-threatening arrhythmias." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
            <p className="text-xs font-semibold text-indigo-700 mb-2">ECG Waveform Components</p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold text-indigo-600 w-24 shrink-0">P Wave</span>
                <span className="text-xs text-indigo-600">Atrial depolarization (contraction). Should be upright, rounded, and consistent. Absent P waves suggest atrial fibrillation or junctional rhythm.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold text-indigo-600 w-24 shrink-0">PR Interval</span>
                <span className="text-xs text-indigo-600">Time from atrial depolarization to ventricular depolarization (0.12-0.20 seconds). Prolonged PR indicates AV block. Shortened PR seen in Wolff-Parkinson-White syndrome.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold text-indigo-600 w-24 shrink-0">QRS Complex</span>
                <span className="text-xs text-indigo-600">Ventricular depolarization (contraction). Normal duration: 0.06-0.12 seconds. Wide QRS (&gt;0.12s) suggests bundle branch block or ventricular origin. This is the largest waveform component.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold text-indigo-600 w-24 shrink-0">T Wave</span>
                <span className="text-xs text-indigo-600">Ventricular repolarization (recovery). Should be upright in most leads. Peaked T waves suggest hyperkalemia. Inverted T waves may indicate ischemia.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold text-indigo-600 w-24 shrink-0">ST Segment</span>
                <span className="text-xs text-indigo-600">Between QRS and T wave. Should be at baseline (isoelectric). ST elevation indicates acute MI (STEMI). ST depression suggests ischemia or non-STEMI.</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
            <p className="text-xs font-semibold text-teal-700 mb-1">Normal Sinus Rhythm Criteria</p>
            <p className="text-xs text-teal-600">Rate 60-100 bpm, regular rhythm, P wave before every QRS, QRS after every P wave, PR interval 0.12-0.20 seconds, QRS duration 0.06-0.12 seconds. Any deviation from these criteria suggests an abnormal rhythm that requires further evaluation and potential intervention.</p>
          </div>
        </div>
      </MicroLesson>

      <MicroLesson title="Sensitivity vs Specificity" subtitle="Understanding diagnostic test accuracy" icon={<Microscope className="w-5 h-5" />}>
        <EditableModuleText sectionKey="diag-sens-spec-intro" defaultText="No diagnostic test is perfect. Understanding how tests perform — their ability to correctly identify disease (sensitivity) and correctly identify absence of disease (specificity) — is critical for interpreting results and making clinical decisions. These concepts apply to every test from blood work to imaging." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-700 mb-1">High Sensitivity Tests (Screening)</p>
            <p className="text-xs text-emerald-600">Purpose: Detect as many true cases as possible. Minimizes false negatives. Used when missing a diagnosis is dangerous. Examples: D-dimer for PE (highly sensitive — if negative, PE is very unlikely), HIV screening tests, troponin for MI. Trade-off: May produce more false positives. Memory: SN-N-OUT — a Sensitive test with a Negative result rules OUT disease.</p>
          </div>
          <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-100">
            <p className="text-xs font-semibold text-orange-700 mb-1">High Specificity Tests (Confirmation)</p>
            <p className="text-xs text-orange-600">Purpose: Confirm disease when positive. Minimizes false positives. Used when a false positive would cause harm (unnecessary treatment, anxiety). Examples: Western blot for HIV confirmation, biopsy for cancer. Trade-off: May miss some true cases (false negatives). Memory: SP-P-IN — a Specific test with a Positive result rules IN disease.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_diagnostics.clinicalApplicationOfSensitivityAnd")}
          content={sensitivitySpecificityContent}
        />
      </MicroLesson>

      <MicroLesson title="Common Laboratory Values" subtitle="CBC, BMP, CMP, and coagulation studies" icon={<FlaskConical className="w-5 h-5" />}>
        <EditableModuleText sectionKey="diag-lab-intro" defaultText="Laboratory tests provide objective data about a patient's physiological status. Nurses must understand normal ranges, clinical significance of abnormal values, and how results guide nursing interventions. Critical values require immediate notification of the healthcare provider." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-2">Complete Blood Count (CBC)</p>
            <p className="text-xs text-blue-600">WBC (4,500-11,000/µL): Elevated in infection/inflammation, decreased in immunosuppression. RBC (4.5-5.5 M/µL for males, 4.0-5.0 for females): Decreased in anemia, increased in polycythemia. Hemoglobin (12-17 g/dL): Oxygen-carrying capacity. Hematocrit (36-52%): Percentage of blood volume that is RBCs. Platelets (150,000-400,000/µL): Decreased increases bleeding risk, increased raises clot risk.</p>
          </div>
          <div className="p-4 bg-green-50/60 rounded-xl border border-green-100">
            <p className="text-xs font-semibold text-green-700 mb-2">Basic Metabolic Panel (BMP)</p>
            <p className="text-xs text-green-600">Sodium (135-145 mEq/L): Fluid balance indicator. Potassium (3.5-5.0 mEq/L): Critical for cardiac function — both hypo and hyperkalemia are dangerous. Glucose (70-100 mg/dL fasting): Diabetes management. BUN (7-20 mg/dL) and Creatinine (0.6-1.2 mg/dL): Renal function markers. Calcium (8.5-10.5 mg/dL): Neuromuscular function. CO2/Bicarbonate (22-26 mEq/L): Acid-base balance.</p>
          </div>
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 mb-2">Coagulation Studies</p>
            <p className="text-xs text-purple-600">PT (11-13.5 seconds): Monitors warfarin therapy (extrinsic pathway). INR (0.8-1.1 normal; 2.0-3.0 therapeutic on warfarin): Standardized PT ratio. aPTT (25-35 seconds): Monitors heparin therapy (intrinsic pathway). Elevated values mean longer clotting time — increased bleeding risk. Critical to check before surgery or invasive procedures.</p>
          </div>
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
            <p className="text-xs font-semibold text-amber-700 mb-2">Comprehensive Metabolic Panel (CMP)</p>
            <p className="text-xs text-amber-600">Includes everything in BMP plus liver function tests. AST (10-40 U/L) and ALT (7-56 U/L): Liver enzymes — elevated in hepatic damage. Albumin (3.5-5.0 g/dL): Nutritional status and liver synthetic function. Total protein (6.0-8.3 g/dL). Bilirubin (0.1-1.2 mg/dL): Elevated causes jaundice, indicates liver or hemolysis issues. ALP (44-147 U/L): Elevated in bone or biliary disease.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_diagnostics.pointofcareTestingPoct")}
          content={pocTestingContent}
        />
      </MicroLesson>

      <MatchingExercise
        title={t("data.pre_nursing_diagnostics.matchTheDiagnosticTest")}
        pairs={[
          { term: "X-ray", definition: "2D imaging using ionizing radiation, best for bones and chest", id: "xray" },
          { term: "CT scan", definition: "Cross-sectional imaging, gold standard for acute stroke", id: "ct" },
          { term: "MRI", definition: "Magnetic fields, best soft tissue detail, no radiation", id: "mri" },
          { term: "Ultrasound", definition: "Sound waves, safe in pregnancy, real-time imaging", id: "us" },
          { term: "D-dimer", definition: "Highly sensitive screening test to rule OUT pulmonary embolism", id: "ddimer" },
          { term: "Troponin", definition: "Cardiac biomarker elevated in myocardial infarction", id: "trop" },
        ]}
      />

      <SelfCheckQuiz
        title={t("data.pre_nursing_diagnostics.diagnosticsImagingQuiz")}
        questions={[
          {
            id: "diag1",
            question: "Which imaging modality uses NO ionizing radiation and is considered safe during pregnancy?",
            options: ["X-ray", "CT scan", "Ultrasound", "Fluoroscopy"],
            correctIndex: 2,
            rationale: "Ultrasound uses high-frequency sound waves, not ionizing radiation, making it safe during pregnancy. It is the primary imaging modality for prenatal monitoring and does not carry radiation risks.",
          },
          {
            id: "diag2",
            question: "The P wave on an ECG represents:",
            options: ["Ventricular depolarization", "Atrial depolarization", "Ventricular repolarization", "Atrial repolarization"],
            correctIndex: 1,
            rationale: "The P wave represents atrial depolarization — the electrical activation that triggers atrial contraction. It should appear before every QRS complex in normal sinus rhythm.",
          },
          {
            id: "diag3",
            question: "A highly sensitive test with a negative result is most useful for:",
            options: ["Confirming disease is present", "Ruling out disease", "Determining disease severity", "Monitoring treatment response"],
            correctIndex: 1,
            rationale: "SN-N-OUT: A Sensitive test with a Negative result effectively rules OUT disease. High sensitivity means very few false negatives, so a negative result makes disease very unlikely.",
          },
          {
            id: "diag4",
            question: "Which laboratory value requires immediate reporting if critically abnormal because of its effect on cardiac function?",
            options: ["Albumin", "Potassium", "Total protein", "Bilirubin"],
            correctIndex: 1,
            rationale: "Potassium (normal 3.5-5.0 mEq/L) directly affects cardiac conduction. Both hypokalemia and hyperkalemia can cause life-threatening arrhythmias and require immediate intervention.",
          },
          {
            id: "diag5",
            question: "Before a patient receives iodinated contrast for a CT scan, the nurse should check:",
            options: ["Blood glucose level only", "Allergy history and renal function", "Complete blood count", "Liver function tests only"],
            correctIndex: 1,
            rationale: "Iodinated contrast can cause allergic reactions (ranging from hives to anaphylaxis) and contrast-induced nephropathy. The nurse must assess for iodine/shellfish allergies and check renal function (creatinine/GFR) before administration.",
          },
          {
            id: "diag6",
            question: "ST segment elevation on an ECG most strongly suggests:",
            options: ["Normal cardiac function", "Acute myocardial infarction (STEMI)", "Hyperkalemia", "Atrial fibrillation"],
            correctIndex: 1,
            rationale: "ST elevation is the hallmark finding of an acute ST-elevation myocardial infarction (STEMI), indicating transmural ischemia. This is a medical emergency requiring immediate intervention (PCI or thrombolytics).",
          },
          {
            id: "diag7",
            question: "Which imaging modality is the gold standard for evaluating acute stroke?",
            options: ["MRI", "X-ray", "CT scan", "Ultrasound"],
            correctIndex: 2,
            rationale: "CT scan is the gold standard for initial acute stroke evaluation because it is fast (takes minutes) and can quickly differentiate hemorrhagic stroke from ischemic stroke, which determines the treatment pathway.",
          },
          {
            id: "diag8",
            question: "A patient's INR is 4.5 while on warfarin therapy (target 2.0-3.0). The nurse should:",
            options: ["Administer the next warfarin dose as scheduled", "Recognize this as a critical value indicating high bleeding risk", "Increase the warfarin dose", "Document as a normal finding"],
            correctIndex: 1,
            rationale: "An INR of 4.5 exceeds the therapeutic range (2.0-3.0) significantly, indicating the blood is too thin and the patient is at high risk for bleeding. The provider must be notified immediately and the warfarin dose should be held.",
          },
          {
            id: "diag9",
            question: "Which is a contraindication for MRI?",
            options: ["Pregnancy", "Renal insufficiency", "Cardiac pacemaker (non-MRI compatible)", "Latex allergy"],
            correctIndex: 2,
            rationale: "MRI uses powerful magnetic fields that can displace or malfunction metallic implants including non-MRI-compatible pacemakers, potentially causing device failure, tissue burns, or projectile injuries. Screening for metallic implants is essential before MRI.",
          },
          {
            id: "diag10",
            question: "The QRS complex on an ECG represents:",
            options: ["Atrial depolarization", "Atrial repolarization", "Ventricular depolarization", "Ventricular repolarization"],
            correctIndex: 2,
            rationale: "The QRS complex represents ventricular depolarization — the electrical activation that triggers ventricular contraction. Normal QRS duration is 0.06-0.12 seconds; a widened QRS suggests conduction abnormalities.",
          },
          {
            id: "diag11",
            question: "SP-P-IN is a memory aid meaning:",
            options: ["Sensitive test, Positive result rules IN disease", "Specific test, Positive result rules IN disease", "Sensitive test, Positive result rules IN disease severity", "Specific test, Positive result rules IN prognosis"],
            correctIndex: 1,
            rationale: "SP-P-IN means a Specific test with a Positive result rules IN disease. High specificity means very few false positives, so when a highly specific test is positive, you can be confident the disease is present.",
          },
          {
            id: "diag12",
            question: "A hemoglobin level of 7.2 g/dL indicates:",
            options: ["Normal value for adult females", "Polycythemia", "Significant anemia requiring evaluation", "Normal value for adult males"],
            correctIndex: 2,
            rationale: "Normal hemoglobin is 12-17 g/dL. A level of 7.2 g/dL represents significant anemia that compromises oxygen-carrying capacity and may require transfusion depending on the clinical context and symptoms.",
          },
          {
            id: "diag13",
            question: "Which coagulation test monitors heparin therapy?",
            options: ["PT/INR", "aPTT", "Platelet count", "Fibrinogen level"],
            correctIndex: 1,
            rationale: "aPTT (activated partial thromboplastin time) monitors unfractionated heparin therapy, which affects the intrinsic coagulation pathway. Normal aPTT is 25-35 seconds; therapeutic range on heparin is typically 1.5-2.5 times normal.",
          },
          {
            id: "diag14",
            question: "Peaked T waves on an ECG are most commonly associated with:",
            options: ["Hypokalemia", "Hyperkalemia", "Hypocalcemia", "Hyponatremia"],
            correctIndex: 1,
            rationale: "Peaked (tall, narrow, tent-shaped) T waves are a hallmark ECG finding of hyperkalemia. This is a potentially life-threatening condition that can progress to fatal arrhythmias and requires immediate treatment.",
          },
          {
            id: "diag15",
            question: "The most common point-of-care test performed by nurses is:",
            options: ["Troponin", "Blood glucose monitoring", "D-dimer", "Arterial blood gas"],
            correctIndex: 1,
            rationale: "Blood glucose monitoring via fingerstick is the most commonly performed point-of-care test in nursing. It provides immediate results for diabetes management, insulin dosing, and detection of hypoglycemia or hyperglycemia.",
          },
          {
            id: "diag16",
            question: "A patient taking metformin is scheduled for a CT with contrast. The nurse should:",
            options: ["Administer metformin with extra fluids", "Hold metformin for 48 hours post-contrast", "Double the metformin dose for renal protection", "Discontinue metformin permanently"],
            correctIndex: 1,
            rationale: "Metformin must be held for 48 hours after iodinated contrast administration because the combination can cause lactic acidosis, especially if contrast-induced nephropathy develops. Renal function should be reassessed before resuming metformin.",
          },
          {
            id: "diag17",
            question: "An elevated WBC count (leukocytosis) most commonly indicates:",
            options: ["Dehydration", "Infection or inflammation", "Liver disease", "Anemia"],
            correctIndex: 1,
            rationale: "Leukocytosis (WBC > 11,000/µL) most commonly indicates infection or inflammation. The body produces more white blood cells to fight pathogens. The differential count can help identify the type of infection (bacterial vs viral).",
          },
          {
            id: "diag18",
            question: "Which imaging modality provides the BEST soft tissue detail?",
            options: ["X-ray", "CT scan", "MRI", "Fluoroscopy"],
            correctIndex: 2,
            rationale: "MRI provides superior soft tissue contrast compared to all other imaging modalities. It excels at visualizing brain, spinal cord, ligaments, tendons, cartilage, and tumors without ionizing radiation.",
          },
          {
            id: "diag19",
            question: "Normal sinus rhythm on ECG includes all of the following EXCEPT:",
            options: ["Heart rate 60-100 bpm", "P wave before every QRS complex", "Irregular R-R intervals", "PR interval 0.12-0.20 seconds"],
            correctIndex: 2,
            rationale: "Normal sinus rhythm requires REGULAR R-R intervals (regular rhythm). Irregular R-R intervals suggest an abnormal rhythm such as atrial fibrillation or premature beats. All other options are criteria for normal sinus rhythm.",
          },
          {
            id: "diag20",
            question: "Elevated ALT and AST levels most specifically indicate damage to which organ?",
            options: ["Heart", "Kidneys", "Liver", "Pancreas"],
            correctIndex: 2,
            rationale: "ALT (alanine aminotransferase) and AST (aspartate aminotransferase) are liver enzymes released into the bloodstream when hepatocytes are damaged. ALT is more specific to the liver, while AST can also be elevated in cardiac and muscle injury.",
          },
        ]}
      />
    </div>
  );
}