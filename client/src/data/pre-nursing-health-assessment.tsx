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
import { Stethoscope, ClipboardList, Activity, Eye } from "lucide-react";

export function HealthAssessmentModule() {
  const { t } = useI18n();
  const subjectiveVsObjectiveContent = useEditableText("ha-subjective-objective-content", "Subjective data is information reported by the patient — symptoms, feelings, perceptions, and history. Only the patient can provide this data (e.g., 'I feel dizzy,' 'My pain is 7/10'). Objective data is observable, measurable information obtained through examination, diagnostic tests, and direct observation (e.g., BP 148/92, temperature 38.5°C, crackles auscultated in lung bases). The distinction matters because nursing diagnoses and clinical decisions require both types of data to form a complete clinical picture.");
  const redFlagsContent = useEditableText("ha-red-flags-content", "Red flags are assessment findings that require immediate intervention or escalation. Key red flags include: sudden change in level of consciousness (stroke, hypoglycemia, increased ICP), new-onset chest pain with diaphoresis (MI), respiratory distress with SpO2 < 90% (respiratory failure), systolic BP < 90 mmHg (shock), unilateral weakness or speech changes (stroke), rigid/board-like abdomen (peritonitis), and asymmetric pupils (increased ICP, herniation). When you identify a red flag, stop the routine assessment and activate the appropriate emergency response.");
  const documentationContent = useEditableText("ha-documentation-content", "SOAP notes organize documentation into Subjective (patient's report), Objective (measurable findings), Assessment (clinical judgment/diagnosis), and Plan (interventions). Focus charting uses DAR: Data (subjective + objective), Action (nursing interventions), and Response (patient outcomes). Narrative charting tells the story chronologically but can be disorganized. Exception-based charting documents only deviations from normal, saving time but risking missed documentation. Always document assessment findings promptly, accurately, and objectively — avoid subjective language like 'patient seems fine.'");

  return (
    <div className="space-y-10" data-testid="module-health-assessment">
      <div>
        <EditableModuleText sectionKey="ha-title" defaultText="Health Assessment Foundations" as="h2" className="text-2xl font-bold text-gray-900 mb-2" />
        <EditableModuleText sectionKey="ha-desc" defaultText="Master the foundations of patient assessment including subjective vs objective data collection, IPPA techniques, systematic head-to-toe assessment, vital signs interpretation, documentation methods, and recognition of critical red flags." as="p" className="text-gray-600" multiline />
      </div>

      <MicroLesson title="Subjective vs Objective Data" subtitle="Understanding the two pillars of assessment" icon={<ClipboardList className="w-5 h-5" />}>
        <EditableModuleText sectionKey="ha-data-types-intro" defaultText="Every nursing assessment collects two fundamental types of data. Distinguishing between them is essential for accurate documentation, clinical reasoning, and communication with the healthcare team." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">Subjective Data (Symptoms)</p>
            <p className="text-xs text-blue-600">Information reported by the patient that cannot be independently verified. Includes chief complaint, history of present illness, pain descriptions, emotional state, cultural beliefs, and past medical/surgical history. Use open-ended questions first ('Tell me about your pain'), then focused questions ('Where exactly does it hurt?'). Document using the patient's own words in quotation marks.</p>
          </div>
          <div className="p-4 bg-green-50/60 rounded-xl border border-green-100">
            <p className="text-xs font-semibold text-green-700 mb-1">Objective Data (Signs)</p>
            <p className="text-xs text-green-600">Observable, measurable findings obtained through physical examination, vital signs, laboratory results, and diagnostic imaging. Examples: heart rate 102 bpm, 2+ pitting edema bilateral ankles, crackles in bilateral lung bases, WBC 14,200/mm³. Objective data is verifiable by any qualified examiner and forms the basis for clinical decision-making.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_health_assessment.subjectiveVsObjectiveDistinction")}
          content={subjectiveVsObjectiveContent}
        />
      </MicroLesson>

      <MicroLesson title="IPPA Techniques" subtitle="Inspection, Palpation, Percussion, Auscultation" icon={<Stethoscope className="w-5 h-5" />}>
        <EditableModuleText sectionKey="ha-ippa-intro" defaultText="IPPA represents the four systematic techniques used in physical examination, always performed in this specific order (except for the abdomen, where auscultation precedes palpation and percussion to avoid altering bowel sounds)." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <ProgressiveReveal
          title={t("data.pre_nursing_health_assessment.theFourAssessmentTechniques")}
          cards={[
            {
              id: "ha-inspect",
              title: "Inspection",
              summary: "Visual examination — always performed first",
              detail: "Inspection uses sight, smell, and hearing to observe the patient before touching. Assess skin color, symmetry, size, shape, contour, movement, and position. Compare bilateral structures. Note odors (fruity breath in DKA, ammonia in renal failure). Inspection begins the moment you enter the room and continues throughout the encounter. Good lighting and adequate exposure are essential.",
            },
            {
              id: "ha-palpate",
              title: "Palpation",
              summary: "Using touch to assess texture, temperature, moisture, and masses",
              detail: "Light palpation (1-2 cm depth) assesses surface characteristics: skin temperature, moisture, texture, tenderness, and superficial masses. Deep palpation (4-5 cm depth) assesses organ size, shape, and deep masses. Use the dorsal surface of the hand for temperature assessment. Use fingertips for fine discrimination (pulses, lymph nodes). Palpate tender areas last to maintain patient trust and prevent guarding.",
            },
            {
              id: "ha-percuss",
              title: "Percussion",
              summary: "Tapping to assess underlying structures",
              detail: "Percussion produces sounds that indicate density of underlying tissue. Resonance: normal lung tissue (hollow, low-pitched). Hyperresonance: air-trapped lung (emphysema, pneumothorax). Dullness: solid organ or fluid (liver, pleural effusion, consolidation). Tympany: air-filled structure (gastric bubble, distended bowel). Flatness: dense tissue (muscle, bone). Technique: strike the distal interphalangeal joint of the middle finger placed on the skin.",
            },
            {
              id: "ha-auscult",
              title: "Auscultation",
              summary: "Listening with a stethoscope to body sounds",
              detail: "Use the diaphragm for high-pitched sounds (breath sounds, normal heart sounds S1/S2, bowel sounds). Use the bell for low-pitched sounds (heart murmurs, bruits, S3/S4). Auscultate in a quiet environment. For lungs: compare bilateral fields systematically. For heart: listen at all five auscultatory areas (aortic, pulmonic, Erb's point, tricuspid, mitral). For abdomen: listen in all four quadrants for at least 5 minutes before documenting absent bowel sounds.",
            },
          ]}
        />
        <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100 mt-3">
          <p className="text-xs font-semibold text-amber-700 mb-1">Exception: Abdominal Assessment Order</p>
          <p className="text-xs text-amber-600">For the abdomen, the order changes to Inspection → Auscultation → Percussion → Palpation. Auscultation must precede palpation and percussion because touching the abdomen can stimulate or diminish bowel sounds, producing inaccurate findings. This is a commonly tested concept on nursing exams.</p>
        </div>
      </MicroLesson>

      <MicroLesson title="Vital Signs Interpretation" subtitle="The foundation of every patient assessment" icon={<Activity className="w-5 h-5" />}>
        <EditableModuleText sectionKey="ha-vitals-intro" defaultText="Vital signs — temperature, pulse, respirations, blood pressure, and oxygen saturation (the 'fifth vital sign') — provide baseline data and indicate physiological status. Trends in vital signs are more clinically significant than single readings." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 mb-2">Normal Adult Vital Sign Ranges</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-purple-600">
              <div><strong>{t("data.pre_nursing_health_assessment.temperature")}</strong> 36.1–37.2°C (97.0–99.0°F)</div>
              <div><strong>{t("data.pre_nursing_health_assessment.pulse")}</strong> 60–100 bpm, regular rhythm</div>
              <div><strong>{t("data.pre_nursing_health_assessment.respirations")}</strong> 12–20 breaths/min, unlabored</div>
              <div><strong>{t("data.pre_nursing_health_assessment.bloodPressure")}</strong>{t("data.pre_nursing_health_assessment.systolicLt120DiastolicLt80Mmhg")}</div>
              <div><strong>{t("data.pre_nursing_health_assessment.spo2")}</strong> 95–100% on room air</div>
              <div><strong>{t("data.pre_nursing_health_assessment.pain")}</strong> 0/10 (the sixth vital sign)</div>
            </div>
          </div>
          <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
            <p className="text-xs font-semibold text-teal-700 mb-1">Orthostatic Vital Signs</p>
            <p className="text-xs text-teal-600">Measure BP and HR lying, sitting, and standing (wait 1-3 minutes between position changes). Orthostatic hypotension is defined as a drop in systolic BP ≥20 mmHg or diastolic BP ≥10 mmHg, or an increase in HR ≥20 bpm upon standing. Causes include dehydration, blood loss, medication effects (antihypertensives, diuretics), and autonomic dysfunction. Always ensure patient safety during positional changes.</p>
          </div>
        </div>
      </MicroLesson>

      <MicroLesson title="Head-to-Toe Assessment & Documentation" subtitle="Systematic approach and accurate recording" icon={<Eye className="w-5 h-5" />}>
        <EditableModuleText sectionKey="ha-headtotoe-intro" defaultText="A systematic head-to-toe assessment ensures no body system is missed. The standard approach moves cephalocaudal (head to toe) and proximal to distal. Document findings accurately using standardized terminology and approved abbreviations." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 mt-3">
          <p className="text-xs font-semibold text-indigo-700 mb-2">Head-to-Toe Assessment Order</p>
          <div className="space-y-1 text-xs text-indigo-600">
            <p><strong>1. General survey:</strong>{t("data.pre_nursing_health_assessment.overallAppearanceBodyHabitusHygiene")}</p>
            <p><strong>2. Neurological:</strong>{t("data.pre_nursing_health_assessment.locGlasgowComaScaleOrientation")}</p>
            <p><strong>3. Head/Face:</strong>{t("data.pre_nursing_health_assessment.skullSymmetryFacialExpressionTmj")}</p>
            <p><strong>4. Eyes/Ears/Nose/Throat:</strong>{t("data.pre_nursing_health_assessment.visualAcuityHearingNasalPatency")}</p>
            <p><strong>5. Neck:</strong>{t("data.pre_nursing_health_assessment.lymphNodesThyroidJugularVein")}</p>
            <p><strong>6. Chest/Lungs:</strong>{t("data.pre_nursing_health_assessment.respiratoryEffortBreathSoundsAll")}</p>
            <p><strong>7. Cardiovascular:</strong>{t("data.pre_nursing_health_assessment.heartSoundsS1s2RhythmPmi")}</p>
            <p><strong>8. Abdomen:</strong>{t("data.pre_nursing_health_assessment.inspectAuscultatePercussPalpateBowel")}</p>
            <p><strong>9. Musculoskeletal:</strong>{t("data.pre_nursing_health_assessment.romStrengthGaitJointSwelling")}</p>
            <p><strong>10. Integumentary:</strong>{t("data.pre_nursing_health_assessment.skinColorTurgorMoistureLesions")}</p>
            <p><strong>11. Extremities:</strong>{t("data.pre_nursing_health_assessment.pulsesEdemaSensationSkinIntegrity")}</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_health_assessment.documentationMethods")}
          content={documentationContent}
        />
        <CognitiveCard
          type="warning"
          title={t("data.pre_nursing_health_assessment.redFlagsRequiringImmediateAction")}
          content={redFlagsContent}
        />
      </MicroLesson>

      <MatchingExercise
        title={t("data.pre_nursing_health_assessment.matchTheAssessmentConcept")}
        pairs={[
          { id: "subjective", term: "Subjective data", definition: "Information reported by the patient (symptoms)" },
          { id: "objective", term: "Objective data", definition: "Observable, measurable findings (signs)" },
          { id: "inspection", term: "Inspection", definition: "Visual examination performed first" },
          { id: "auscultation", term: "Auscultation", definition: "Listening with a stethoscope to body sounds" },
          { id: "percussion", term: "Percussion", definition: "Tapping to assess density of underlying tissue" },
          { id: "soap", term: "SOAP note", definition: "Subjective, Objective, Assessment, Plan format" },
        ]}
      />

      <SelfCheckQuiz
        title={t("data.pre_nursing_health_assessment.healthAssessmentQuiz")}
        questions={[
          {
            id: "ha1",
            question: "A patient states, 'I feel like my heart is racing.' This is an example of:",
            options: ["Objective data", "Subjective data", "A nursing diagnosis", "An assessment finding"],
            correctIndex: 1,
            rationale: "The patient's verbal report of their experience is subjective data — it is a symptom that only the patient can perceive and report. Objective data would be the measured heart rate (e.g., HR 112 bpm).",
          },
          {
            id: "ha2",
            question: "When performing an abdominal assessment, the correct order of techniques is:",
            options: ["Inspection, Palpation, Percussion, Auscultation", "Auscultation, Inspection, Palpation, Percussion", "Inspection, Auscultation, Percussion, Palpation", "Palpation, Percussion, Auscultation, Inspection"],
            correctIndex: 2,
            rationale: "The abdomen is the exception to the standard IPPA order. Auscultation is performed before palpation and percussion because touching the abdomen can alter bowel sounds, producing inaccurate findings.",
          },
          {
            id: "ha3",
            question: "Which stethoscope component is used to assess low-pitched sounds such as heart murmurs?",
            options: ["Diaphragm", "Bell", "Tubing", "Earpieces"],
            correctIndex: 1,
            rationale: "The bell of the stethoscope is used for low-pitched sounds including heart murmurs, bruits, and S3/S4 heart sounds. The diaphragm is used for high-pitched sounds like breath sounds and normal S1/S2.",
          },
          {
            id: "ha4",
            question: "A percussion note that sounds hollow and low-pitched over the lung fields indicates:",
            options: ["Pleural effusion", "Pneumothorax", "Normal lung tissue (resonance)", "Consolidation"],
            correctIndex: 2,
            rationale: "Resonance is the normal percussion sound heard over healthy, air-filled lung tissue. It is hollow and low-pitched. Dullness indicates fluid or consolidation, while hyperresonance suggests trapped air (emphysema, pneumothorax).",
          },
          {
            id: "ha5",
            question: "Orthostatic hypotension is defined as a systolic BP drop of at least:",
            options: ["5 mmHg upon standing", "10 mmHg upon standing", "20 mmHg upon standing", "40 mmHg upon standing"],
            correctIndex: 2,
            rationale: "Orthostatic hypotension is defined as a systolic BP drop ≥20 mmHg or diastolic BP drop ≥10 mmHg, or HR increase ≥20 bpm upon standing from a lying or sitting position.",
          },
          {
            id: "ha6",
            question: "The nurse is assessing a patient and notes JVD (jugular vein distention) with the patient at 45 degrees. This is an abnormal finding that may indicate:",
            options: ["Dehydration", "Right-sided heart failure", "Hypotension", "Anemia"],
            correctIndex: 1,
            rationale: "JVD observed with the patient elevated at 45 degrees is abnormal and suggests elevated central venous pressure, commonly seen in right-sided heart failure, cardiac tamponade, or superior vena cava syndrome.",
          },
          {
            id: "ha7",
            question: "Which part of the hand is used to assess skin temperature?",
            options: ["Fingertips", "Palm", "Dorsal (back) surface of the hand", "Knuckles"],
            correctIndex: 2,
            rationale: "The dorsal surface of the hand is most sensitive to temperature changes and is used to assess skin temperature. Fingertips are used for fine discrimination of pulses, textures, and masses.",
          },
          {
            id: "ha8",
            question: "In SOAP documentation, the 'A' stands for:",
            options: ["Action taken by the nurse", "Assessment — the clinical judgment or diagnosis", "Auscultation findings", "Allergies of the patient"],
            correctIndex: 1,
            rationale: "In SOAP notes, A = Assessment, which represents the nurse's clinical judgment, nursing diagnosis, or interpretation of the subjective and objective data. It is the analytical component of the note.",
          },
          {
            id: "ha9",
            question: "A nurse must listen in all four quadrants for at least how long before documenting absent bowel sounds?",
            options: ["30 seconds", "1 minute", "3 minutes", "5 minutes"],
            correctIndex: 3,
            rationale: "The nurse must auscultate all four quadrants for a minimum of 5 minutes (some sources say up to 5 minutes per quadrant) before concluding that bowel sounds are absent. Premature documentation of absent bowel sounds is a common error.",
          },
          {
            id: "ha10",
            question: "PERRLA is an acronym used when assessing:",
            options: ["Respiratory rate and rhythm", "Pupil response", "Peripheral pulses", "Pain level"],
            correctIndex: 1,
            rationale: "PERRLA stands for Pupils Equal, Round, Reactive to Light and Accommodation. It is used to document a normal pupillary assessment as part of the neurological examination.",
          },
          {
            id: "ha11",
            question: "The Glasgow Coma Scale (GCS) assesses which three components?",
            options: ["Airway, Breathing, Circulation", "Eye opening, Verbal response, Motor response", "Orientation to person, place, time", "Pain, Nausea, Level of consciousness"],
            correctIndex: 1,
            rationale: "The GCS measures Eye opening (1-4), Verbal response (1-5), and Motor response (1-6) for a total score of 3-15. A score of 8 or below indicates severe impairment and typically requires airway protection.",
          },
          {
            id: "ha12",
            question: "During light palpation, the nurse depresses the skin approximately:",
            options: ["0.5 cm", "1-2 cm", "4-5 cm", "6-8 cm"],
            correctIndex: 1,
            rationale: "Light palpation involves depressing the skin 1-2 cm to assess surface characteristics such as temperature, moisture, texture, tenderness, and superficial masses. Deep palpation uses 4-5 cm depth.",
          },
          {
            id: "ha13",
            question: "A patient's blood pressure is 148/96 mmHg. This reading is classified as:",
            options: ["Normal", "Elevated", "Stage 1 hypertension", "Stage 2 hypertension"],
            correctIndex: 3,
            rationale: "According to AHA guidelines, Stage 2 hypertension is defined as systolic ≥140 mmHg or diastolic ≥90 mmHg. This patient's reading of 148/96 meets both criteria for Stage 2 hypertension.",
          },
          {
            id: "ha14",
            question: "When documenting, the nurse should avoid which of the following?",
            options: ["Using specific measurements", "Using approved abbreviations", "Writing 'patient appears comfortable'", "Recording vital signs promptly"],
            correctIndex: 2,
            rationale: "'Patient appears comfortable' is subjective nursing interpretation. Documentation should be objective and factual: 'Patient resting quietly, denies pain, VS within normal limits.' Avoid subjective language that reflects the nurse's interpretation rather than observable data.",
          },
          {
            id: "ha15",
            question: "A tympanic percussion note is normally heard over the:",
            options: ["Liver", "Lung fields", "Gastric air bubble", "Spleen"],
            correctIndex: 2,
            rationale: "Tympany is a loud, high-pitched, drum-like sound heard over air-filled structures such as the gastric air bubble and distended bowel. It is the predominant percussion sound over the abdomen.",
          },
          {
            id: "ha16",
            question: "Which finding is a RED FLAG requiring immediate intervention?",
            options: ["BP 132/84 mmHg", "Temperature 37.8°C", "New onset unilateral weakness with slurred speech", "Respiratory rate of 18 breaths/min"],
            correctIndex: 2,
            rationale: "New-onset unilateral weakness with speech changes is a red flag for acute stroke. This requires immediate activation of the stroke response team — 'time is brain.' The other findings are mildly abnormal or normal and do not require emergent action.",
          },
          {
            id: "ha17",
            question: "The 'S' in SBAR communication stands for:",
            options: ["Symptoms", "Situation", "Subjective data", "Stethoscope findings"],
            correctIndex: 1,
            rationale: "SBAR stands for Situation (what is happening now), Background (relevant history), Assessment (what you think the problem is), and Recommendation (what you think should be done). It is a standardized communication framework for handoff and escalation.",
          },
          {
            id: "ha18",
            question: "Normal capillary refill time in adults is:",
            options: ["Less than 1 second", "Less than 3 seconds", "Less than 5 seconds", "Less than 7 seconds"],
            correctIndex: 1,
            rationale: "Normal capillary refill is less than 3 seconds (some sources say less than 2 seconds). Delayed capillary refill indicates poor peripheral perfusion and may be seen in dehydration, shock, peripheral vascular disease, or hypothermia.",
          },
          {
            id: "ha19",
            question: "Focus charting uses the DAR format. What does DAR stand for?",
            options: ["Diagnosis, Action, Rationale", "Data, Action, Response", "Document, Assess, Record", "Data, Assessment, Referral"],
            correctIndex: 1,
            rationale: "DAR stands for Data (subjective and objective findings), Action (nursing interventions performed), and Response (patient's response to interventions). Focus charting organizes documentation around a specific patient concern or focus.",
          },
          {
            id: "ha20",
            question: "When palpating the abdomen, the nurse should palpate tender areas:",
            options: ["First, to get the most accurate assessment", "In the middle of the examination", "Last, to prevent guarding and maintain patient trust", "Only if the patient reports no pain"],
            correctIndex: 2,
            rationale: "Tender areas should always be palpated last. Palpating painful areas first causes the patient to tense (guard), making subsequent assessment of other areas inaccurate. It also diminishes patient trust and cooperation.",
          },
        ]}
      />
    </div>
  );
}