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
import { BookOpen, Layers, Brain, FileText } from "lucide-react";

export function MedicalTerminologyModule() {
  const { t } = useI18n();
  const decodingAction = useEditableText("medterm-decoding-action", "Electrocardiography: electr/o (electrical) + cardi/o (heart) + -graphy (process of recording) = the process of recording the electrical activity of the heart. You don't need to memorize this — you can construct the meaning from parts.");
  const otomyConfusion = useEditableText("medterm-otomy-confusion", "These three sound similar but mean very different things. -Otomy = cutting into (the structure remains). -Ostomy = creating a permanent opening. -Ectomy = removing entirely. A tracheotomy cuts into the trachea; a tracheostomy creates a permanent opening; a tonsillectomy removes the tonsils.");

  return (
    <div className="space-y-10" data-testid="module-medical-terminology">
      <div>
        <EditableModuleText sectionKey="medterm-title" defaultText="Medical Terminology Mastery" as="h2" className="text-2xl font-bold text-gray-900 mb-2" />
        <EditableModuleText sectionKey="medterm-desc" defaultText="Decode medical language logically through word roots, prefixes, and suffixes rather than rote memorization. Build a framework for understanding any medical term you encounter." as="p" className="text-gray-600" multiline />
      </div>

      <MicroLesson title="How Medical Language Works" subtitle="A systematic approach to decoding medical terms" icon={<BookOpen className="w-5 h-5" />}>
        <EditableModuleText sectionKey="medterm-how-language-content" defaultText={`Medical terminology follows a logical construction system. Every medical term is assembled from building blocks: a root (the core meaning, usually an organ or structure), a prefix (modifies meaning — location, number, time), and a suffix (indicates procedure, condition, or function).`} as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-3 gap-3 mt-3">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">Root / Combining Form</p>
            <p className="text-xs text-blue-600">The foundation of the term. <em>Cardi/o</em> = heart, <em>hepat/o</em> = liver, <em>nephr/o</em> = kidney. The combining vowel (usually "o") links roots to suffixes.</p>
          </div>
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-700 mb-1">Prefix</p>
            <p className="text-xs text-emerald-600">Appears at the beginning. <em>Hyper-</em> = excessive, <em>hypo-</em> = below/deficient, <em>tachy-</em> = fast, <em>brady-</em> = slow, <em>peri-</em> = around.</p>
          </div>
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 mb-1">Suffix</p>
            <p className="text-xs text-purple-600"><em>-itis</em> = inflammation, <em>-ectomy</em> = surgical removal, <em>-ology</em> = study of, <em>-scopy</em> = visual examination, <em>-pathy</em> = disease.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_terminology.decodingInAction")}
          content={decodingAction}
        />
      </MicroLesson>

      <MicroLesson title="Body System Roots" subtitle="Core word roots organized by organ system" icon={<Layers className="w-5 h-5" />}>
        <EditableModuleText sectionKey="medterm-body-roots-content" defaultText="Each body system has characteristic word roots that appear repeatedly in clinical vocabulary. Learning these roots gives you a foundation for interpreting terms across all of healthcare." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <ProgressiveReveal
          title={t("data.pre_nursing_terminology.systembysystemRootWords")}
          cards={[
            {
              id: "mt1",
              title: "Cardiovascular",
              summary: "Heart and blood vessel roots",
              detail: "Cardi/o (heart), angi/o or vas/o (vessel), hem/o or hemat/o (blood), ven/o or phleb/o (vein), arteri/o (artery), thromb/o (clot), ather/o (fatty plaque). Example: Phlebotomy = phleb/o + -tomy (incision) = incision into a vein.",
            },
            {
              id: "mt2",
              title: "Respiratory",
              summary: "Lung and airway roots",
              detail: "Pulmon/o or pneum/o (lung), bronch/o (bronchus), trache/o (trachea), nas/o or rhin/o (nose), laryng/o (larynx), pharyng/o (pharynx), thorac/o (chest), ox/i (oxygen). Example: Bronchoscopy = bronch/o + -scopy (visual examination).",
            },
            {
              id: "mt3",
              title: "Gastrointestinal",
              summary: "Digestive system roots",
              detail: "Gastr/o (stomach), enter/o (intestine), hepat/o (liver), cholecyst/o (gallbladder), pancreat/o (pancreas), col/o or colon/o (colon), esophag/o (esophagus), or/o (mouth), proct/o (rectum/anus). Example: Hepatomegaly = hepat/o + -megaly (enlargement).",
            },
            {
              id: "mt4",
              title: "Neurological",
              summary: "Brain and nerve roots",
              detail: "Neur/o (nerve), cerebr/o or encephal/o (brain), mening/o (meninges), myel/o (spinal cord or bone marrow — context matters), psych/o (mind), cephal/o (head). Example: Encephalitis = encephal/o + -itis (inflammation).",
            },
            {
              id: "mt5",
              title: "Musculoskeletal",
              summary: "Bone, muscle, and joint roots",
              detail: "Oste/o (bone), arthr/o (joint), my/o or myos/o (muscle), chondr/o (cartilage), tend/o or tendin/o (tendon), cost/o (rib), crani/o (skull). Example: Osteoarthritis = oste/o + arthr/o + -itis.",
            },
            {
              id: "mt6",
              title: "Renal / Urinary",
              summary: "Kidney and urinary tract roots",
              detail: "Ren/o or nephr/o (kidney), cyst/o (bladder), ureter/o (ureter), urethr/o (urethra), pyel/o (renal pelvis), ur/o (urine). Example: Nephrolithiasis = nephr/o + lith/o (stone) + -iasis (condition).",
            },
          ]}
        />
      </MicroLesson>

      <MicroLesson title="Critical Prefixes & Suffixes" subtitle="The modifiers that change meaning" icon={<Brain className="w-5 h-5" />}>
        <EditableModuleText sectionKey="medterm-prefixes-suffixes-content" defaultText="Prefixes and suffixes modify the root to create specific clinical meanings. Learning the most common ones allows you to decode unfamiliar terms by breaking them into recognizable parts." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="space-y-4 mt-3">
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
            <p className="text-xs font-semibold text-amber-700 mb-2">Location & Direction Prefixes</p>
            <div className="grid grid-cols-2 gap-1 text-xs text-amber-600">
              <span><strong>{t("data.pre_nursing_terminology.epi")}</strong> = upon, above (epidermis)</span>
              <span><strong>{t("data.pre_nursing_terminology.sub")}</strong> = below (subcutaneous)</span>
              <span><strong>{t("data.pre_nursing_terminology.endo")}</strong> = within (endoscopy)</span>
              <span><strong>{t("data.pre_nursing_terminology.peri")}</strong> = around (pericardium)</span>
              <span><strong>{t("data.pre_nursing_terminology.inter")}</strong> = between (intercostal)</span>
              <span><strong>{t("data.pre_nursing_terminology.intra")}</strong> = within (intravenous)</span>
              <span><strong>{t("data.pre_nursing_terminology.retro")}</strong> = behind (retroperitoneal)</span>
              <span><strong>{t("data.pre_nursing_terminology.trans")}</strong> = across (transdermal)</span>
            </div>
          </div>
          <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-100">
            <p className="text-xs font-semibold text-rose-700 mb-2">Condition & Status Suffixes</p>
            <div className="grid grid-cols-2 gap-1 text-xs text-rose-600">
              <span><strong>-itis</strong> = inflammation</span>
              <span><strong>-osis</strong> = abnormal condition</span>
              <span><strong>-emia</strong> = blood condition</span>
              <span><strong>-penia</strong> = deficiency</span>
              <span><strong>-megaly</strong> = enlargement</span>
              <span><strong>-malacia</strong> = softening</span>
              <span><strong>-sclerosis</strong> = hardening</span>
              <span><strong>-algia / -dynia</strong> = pain</span>
            </div>
          </div>
          <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
            <p className="text-xs font-semibold text-teal-700 mb-2">Procedure Suffixes</p>
            <div className="grid grid-cols-2 gap-1 text-xs text-teal-600">
              <span><strong>-ectomy</strong> = surgical removal</span>
              <span><strong>-otomy</strong> = incision into</span>
              <span><strong>-ostomy</strong> = creating an opening</span>
              <span><strong>-plasty</strong> = surgical repair</span>
              <span><strong>-scopy</strong> = visual examination</span>
              <span><strong>-graphy</strong> = process of recording</span>
              <span><strong>-centesis</strong> = puncture to withdraw fluid</span>
              <span><strong>-pexy</strong> = surgical fixation</span>
            </div>
          </div>
        </div>
        <CognitiveCard
          type="warning"
          title={t("data.pre_nursing_terminology.commonConfusionOtomyVsOstomy")}
          content={otomyConfusion}
        />
      </MicroLesson>

      <MicroLesson title="Abbreviations & Safety" subtitle="Common abbreviations and dangerous look-alikes" icon={<FileText className="w-5 h-5" />}>
        <EditableModuleText sectionKey="medterm-abbreviations-content" defaultText="Healthcare abbreviations save time but create risk. The ISMP Do Not Use List exists because abbreviation misinterpretation causes real patient harm. Understanding which abbreviations are safe and which are dangerous is a foundational competency." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-green-50/60 rounded-xl border border-green-100">
            <p className="text-xs font-semibold text-green-700 mb-1">Safe & Common</p>
            <p className="text-xs text-green-600">BP (blood pressure), HR (heart rate), RR (respiratory rate), SpO2 (oxygen saturation), BID (twice daily), TID (three times daily), PO (by mouth), IV (intravenous), IM (intramuscular), SubQ (subcutaneous), NPO (nothing by mouth)</p>
          </div>
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
            <p className="text-xs font-semibold text-red-700 mb-1">Dangerous — Do Not Use</p>
            <p className="text-xs text-red-600">U (for units — mistaken for 0), QD/QOD (mistaken for each other), trailing zeros (1.0 mg read as 10 mg), MS (morphine sulfate or magnesium sulfate?), IU (mistaken for IV), μg (mistaken for mg)</p>
          </div>
        </div>
        <div className="mt-3 p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
          <p className="text-xs font-semibold text-indigo-700 mb-2">Route & Frequency Abbreviations</p>
          <div className="grid grid-cols-2 gap-1 text-xs text-indigo-600">
            <span><strong>PO</strong> = per os (by mouth)</span>
            <span><strong>SL</strong> = sublingual (under tongue)</span>
            <span><strong>PR</strong> = per rectum</span>
            <span><strong>GT</strong> = gastrostomy tube</span>
            <span><strong>PRN</strong> = as needed</span>
            <span><strong>AC</strong> = before meals</span>
            <span><strong>PC</strong> = after meals</span>
            <span><strong>HS</strong> = at bedtime</span>
            <span><strong>STAT</strong> = immediately</span>
            <span><strong>q4h</strong> = every 4 hours</span>
          </div>
        </div>
        <div className="mt-3 p-4 bg-cyan-50/60 rounded-xl border border-cyan-100">
          <p className="text-xs font-semibold text-cyan-700 mb-2">Assessment & Diagnostic Abbreviations</p>
          <div className="grid grid-cols-2 gap-1 text-xs text-cyan-600">
            <span><strong>WBC</strong> = white blood cells</span>
            <span><strong>RBC</strong> = red blood cells</span>
            <span><strong>{t("data.pre_nursing_terminology.hgb")}</strong> = hemoglobin</span>
            <span><strong>{t("data.pre_nursing_terminology.hct")}</strong> = hematocrit</span>
            <span><strong>BUN</strong> = blood urea nitrogen</span>
            <span><strong>ABG</strong> = arterial blood gas</span>
            <span><strong>CBC</strong> = complete blood count</span>
            <span><strong>CMP</strong> = comprehensive metabolic panel</span>
            <span><strong>PT/INR</strong> = prothrombin time / international normalized ratio</span>
            <span><strong>ECG/EKG</strong> = electrocardiogram</span>
          </div>
        </div>
      </MicroLesson>

      <MicroLesson title="Clinical Application of Terminology" subtitle="Using medical language in nursing practice" icon={<BookOpen className="w-5 h-5" />}>
        <EditableModuleText sectionKey="medterm-clinical-application" defaultText="Understanding medical terminology in isolation is not enough. You must be able to apply it in clinical documentation, verbal reports, and patient communication. Clinical application of medical terminology involves translating complex terms for patients, using correct terms in charting, and interpreting orders accurately. When a physician writes an order for a patient with dysphagia to receive a modified diet, you need to immediately understand that the patient has difficulty swallowing and requires food texture modifications to prevent aspiration." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-violet-50/60 rounded-xl border border-violet-100">
            <p className="text-xs font-semibold text-violet-700 mb-2">SBAR Communication Using Medical Terms</p>
            <p className="text-xs text-violet-600">The SBAR framework (Situation, Background, Assessment, Recommendation) requires precise medical terminology. For example: Situation — the patient is experiencing tachycardia with a heart rate of 128 and diaphoresis. Background — the patient has a history of atrial fibrillation and is prescribed metoprolol 25 mg BID. Assessment — the patient may be experiencing breakthrough atrial fibrillation or medication non-adherence. Recommendation — requesting an ECG and cardiac enzyme panel stat. Notice how every medical term carries specific clinical meaning that would be lost with non-medical language.</p>
          </div>
          <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-100">
            <p className="text-xs font-semibold text-orange-700 mb-2">Charting with Precision</p>
            <p className="text-xs text-orange-600">Documentation in nursing requires exact terminology. Instead of writing that a wound looks bad, a nurse charts that the wound bed demonstrates erythema with serosanguineous drainage and a two-centimeter area of induration at the periwound margin. This language is not just professional — it communicates specific clinical findings that other providers can interpret consistently. Erythema means redness indicating inflammation, serosanguineous describes drainage that is both serous (clear) and bloody, and induration means firmness or hardening of tissue.</p>
          </div>
          <div className="p-4 bg-lime-50/60 rounded-xl border border-lime-100">
            <p className="text-xs font-semibold text-lime-700 mb-2">Patient Education — Translating Terms</p>
            <p className="text-xs text-lime-600">Nurses bridge the gap between medical terminology and patient understanding. When a patient is told they have peripheral neuropathy, the nurse explains that the nerves in their hands and feet are damaged, which may cause tingling, numbness, or burning sensations. When a patient is diagnosed with cholelithiasis, the nurse explains that they have gallstones. This translation skill requires deep understanding of the medical terms so you can accurately simplify without losing critical meaning.</p>
          </div>
        </div>
      </MicroLesson>

      <MicroLesson title="Directional & Positional Terms" subtitle="Anatomical language for body orientation" icon={<Layers className="w-5 h-5" />}>
        <EditableModuleText sectionKey="medterm-directional-terms" defaultText="Anatomical directional terms provide a universal language for describing body positions, locations, and movements. These terms are always referenced from the anatomical position: standing upright, facing forward, arms at sides with palms facing forward. Mastery of directional terminology is essential for accurate documentation of assessment findings, wound locations, surgical sites, and patient positioning." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-sky-50/60 rounded-xl border border-sky-100">
            <p className="text-xs font-semibold text-sky-700 mb-2">Position Pairs</p>
            <div className="grid grid-cols-2 gap-1 text-xs text-sky-600">
              <span><strong>{t("data.pre_nursing_terminology.superior")}</strong> = above, toward the head</span>
              <span><strong>{t("data.pre_nursing_terminology.inferior")}</strong> = below, toward the feet</span>
              <span><strong>{t("data.pre_nursing_terminology.anteriorVentral")}</strong> = front of the body</span>
              <span><strong>{t("data.pre_nursing_terminology.posteriorDorsal")}</strong> = back of the body</span>
              <span><strong>{t("data.pre_nursing_terminology.medial")}</strong> = toward the midline</span>
              <span><strong>{t("data.pre_nursing_terminology.lateral")}</strong> = away from the midline</span>
              <span><strong>{t("data.pre_nursing_terminology.proximal")}</strong> = closer to the trunk</span>
              <span><strong>{t("data.pre_nursing_terminology.distal")}</strong> = farther from the trunk</span>
              <span><strong>{t("data.pre_nursing_terminology.superficial")}</strong> = near the surface</span>
              <span><strong>{t("data.pre_nursing_terminology.deep")}</strong> = farther from the surface</span>
            </div>
          </div>
          <div className="p-4 bg-fuchsia-50/60 rounded-xl border border-fuchsia-100">
            <p className="text-xs font-semibold text-fuchsia-700 mb-2">Body Planes</p>
            <div className="grid grid-cols-1 gap-1 text-xs text-fuchsia-600">
              <span><strong>{t("data.pre_nursing_terminology.sagittalPlane")}</strong> divides the body into left and right halves. A midsagittal cut creates equal halves.</span>
              <span><strong>{t("data.pre_nursing_terminology.frontalCoronalPlane")}</strong> divides the body into anterior and posterior sections.</span>
              <span><strong>{t("data.pre_nursing_terminology.transverseHorizontalPlane")}</strong> divides the body into superior and inferior sections. CT scans typically produce transverse cross-sections.</span>
            </div>
          </div>
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
            <p className="text-xs font-semibold text-amber-700 mb-2">Body Cavities</p>
            <p className="text-xs text-amber-600">The dorsal cavity includes the cranial cavity (brain) and the vertebral canal (spinal cord). The ventral cavity is divided by the diaphragm into the thoracic cavity (heart and lungs) and the abdominopelvic cavity. The abdominopelvic cavity is further divided into the abdominal cavity (stomach, liver, intestines, kidneys) and the pelvic cavity (bladder, reproductive organs). Understanding cavity locations helps interpret diagnostic imaging and surgical documentation.</p>
          </div>
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-700 mb-2">Abdominal Regions</p>
            <p className="text-xs text-emerald-600">The abdomen is divided into nine regions or four quadrants. The four-quadrant system is most common in clinical practice: right upper quadrant (RUQ) contains the liver and gallbladder, left upper quadrant (LUQ) contains the spleen and stomach, right lower quadrant (RLQ) contains the appendix and cecum, and left lower quadrant (LLQ) contains the sigmoid colon. When documenting abdominal pain, always specify the quadrant — this guides differential diagnosis and further investigation.</p>
          </div>
        </div>
      </MicroLesson>

      <MatchingExercise
        title={t("data.pre_nursing_terminology.matchTheRootToIts")}
        pairs={[
          { term: "Cardi/o", definition: "Heart" },
          { term: "Hepat/o", definition: "Liver" },
          { term: "Nephr/o", definition: "Kidney" },
          { term: "Pneum/o", definition: "Lung" },
          { term: "Neur/o", definition: "Nerve" },
          { term: "Oste/o", definition: "Bone" },
          { term: "Gastr/o", definition: "Stomach" },
          { term: "Derm/o", definition: "Skin" },
        ]}
      />

      <SelfCheckQuiz
        title={t("data.pre_nursing_terminology.medicalTerminologyQuiz")}
        questions={[
          {
            id: "t1",
            question: "What does the term 'hepatomegaly' mean?",
            options: ["Liver inflammation", "Liver enlargement", "Liver removal", "Liver pain"],
            correctIndex: 1,
            rationale: "Hepat/o = liver, -megaly = enlargement. Hepatomegaly means enlargement of the liver.",
          },
          {
            id: "t2",
            question: "A 'cholecystectomy' involves:",
            options: ["Visual examination of the gallbladder", "Incision into the gallbladder", "Surgical removal of the gallbladder", "Creating an opening in the gallbladder"],
            correctIndex: 2,
            rationale: "Cholecyst/o = gallbladder, -ectomy = surgical removal.",
          },
          {
            id: "t3",
            question: "The prefix 'tachy-' means:",
            options: ["Slow", "Fast", "Painful", "Excessive"],
            correctIndex: 1,
            rationale: "Tachy- = fast or rapid (tachycardia = fast heart rate, tachypnea = fast breathing).",
          },
          {
            id: "t4",
            question: "Which suffix indicates inflammation?",
            options: ["-osis", "-emia", "-itis", "-pathy"],
            correctIndex: 2,
            rationale: "-Itis always indicates inflammation (appendicitis, arthritis, bronchitis, meningitis).",
          },
          {
            id: "t5",
            question: "The abbreviation 'U' for units is on the Do-Not-Use list because:",
            options: ["It is an outdated term", "It can be mistaken for the number 0 or 4", "It only applies to insulin", "It is not a recognized abbreviation"],
            correctIndex: 1,
            rationale: "Handwritten 'U' can be mistaken for 0, 4, or cc, leading to a 10-fold or greater dosing error. Always write out 'units.'",
          },
          {
            id: "t6",
            question: "What does 'bradypnea' mean?",
            options: ["Fast breathing", "Difficult breathing", "Slow breathing", "Absence of breathing"],
            correctIndex: 2,
            rationale: "Brady- = slow, -pnea = breathing. Bradypnea = abnormally slow rate of breathing.",
          },
          {
            id: "t7",
            question: "The term 'subcutaneous' refers to:",
            options: ["Above the skin", "Within the skin", "Below the skin", "Around the skin"],
            correctIndex: 2,
            rationale: "Sub- = below/under, cutane/o = skin, -ous = pertaining to. Below the skin.",
          },
          {
            id: "t8",
            question: "What is the difference between '-otomy' and '-ostomy'?",
            options: ["They mean the same thing", "-Otomy creates a permanent opening; -ostomy is a temporary cut", "-Otomy is a cut into; -ostomy is creating a permanent opening", "-Otomy removes tissue; -ostomy repairs tissue"],
            correctIndex: 2,
            rationale: "-Otomy = cutting into (temporary, the structure remains). -Ostomy = creating a new permanent or semi-permanent opening.",
          },
          {
            id: "t9",
            question: "Which root refers to the kidney?",
            options: ["Cyst/o", "Nephr/o", "Pyel/o", "Ureter/o"],
            correctIndex: 1,
            rationale: "Nephr/o = kidney. Cyst/o = bladder, Pyel/o = renal pelvis, Ureter/o = ureter.",
          },
          {
            id: "t10",
            question: "The term 'dysphagia' means:",
            options: ["Difficulty breathing", "Difficulty speaking", "Difficulty swallowing", "Difficulty walking"],
            correctIndex: 2,
            rationale: "Dys- = difficult/painful, -phagia = swallowing. Dysphagia = difficulty swallowing.",
          },
          {
            id: "t11",
            question: "What does the suffix '-centesis' indicate?",
            options: ["Surgical repair", "Visual examination", "Puncture to withdraw fluid", "Creating an opening"],
            correctIndex: 2,
            rationale: "-Centesis = puncture to withdraw fluid. Examples: amniocentesis (puncture of the amniotic sac), thoracentesis (puncture of the chest cavity).",
          },
          {
            id: "t12",
            question: "The root 'encephal/o' refers to:",
            options: ["Spinal cord", "Brain", "Skull", "Nerve"],
            correctIndex: 1,
            rationale: "Encephal/o = brain. Encephalitis = inflammation of the brain. Encephalopathy = disease of the brain.",
          },
          {
            id: "t13",
            question: "Which prefix means 'around'?",
            options: ["Endo-", "Epi-", "Peri-", "Inter-"],
            correctIndex: 2,
            rationale: "Peri- = around. Pericardium = membrane around the heart. Perioperative = around the time of surgery.",
          },
          {
            id: "t14",
            question: "The term 'thrombocytopenia' means:",
            options: ["Excess white blood cells", "Deficiency of clotting cells (platelets)", "Enlargement of blood vessels", "Hardening of arteries"],
            correctIndex: 1,
            rationale: "Thromb/o = clot, cyt/o = cell, -penia = deficiency. Thrombocytopenia = deficiency of thrombocytes (platelets).",
          },
          {
            id: "t15",
            question: "What does 'NPO' stand for?",
            options: ["No physical orders", "Nothing per os (nothing by mouth)", "Nurse practitioner orders", "Normal patient output"],
            correctIndex: 1,
            rationale: "NPO = nil per os, Latin for 'nothing by mouth.' It is used when a patient must not eat or drink, often before surgery.",
          },
          {
            id: "t16",
            question: "The suffix '-sclerosis' means:",
            options: ["Softening", "Hardening", "Enlargement", "Inflammation"],
            correctIndex: 1,
            rationale: "-Sclerosis = hardening. Atherosclerosis = hardening of arteries due to fatty plaque. Multiple sclerosis = hardening of nerve tissue.",
          },
          {
            id: "t17",
            question: "Which root refers to a vein?",
            options: ["Arteri/o", "Angi/o", "Phleb/o", "Ather/o"],
            correctIndex: 2,
            rationale: "Phleb/o = vein (also ven/o). Phlebotomy = incision into a vein to draw blood. Phlebitis = inflammation of a vein.",
          },
          {
            id: "t18",
            question: "The term 'hyperglycemia' refers to:",
            options: ["Low blood sugar", "High blood sugar", "High blood pressure", "Low oxygen in blood"],
            correctIndex: 1,
            rationale: "Hyper- = excessive/above normal, glyc/o = sugar, -emia = blood condition. Hyperglycemia = excessive sugar in the blood.",
          },
          {
            id: "t19",
            question: "Why is the abbreviation 'QD' on the Do-Not-Use list?",
            options: ["It is an outdated dosing frequency", "It can be mistaken for QOD or QID, causing dosing errors", "It only applies to certain medications", "It has no standardized meaning"],
            correctIndex: 1,
            rationale: "QD (daily) can be confused with QOD (every other day) or QID (four times daily). Writing out 'daily' prevents potentially dangerous dosing errors.",
          },
          {
            id: "t20",
            question: "The term 'rhinoplasty' means:",
            options: ["Visual examination of the nose", "Surgical repair of the nose", "Inflammation of the nose", "Incision into the nose"],
            correctIndex: 1,
            rationale: "Rhin/o = nose, -plasty = surgical repair. Rhinoplasty = surgical repair or reconstruction of the nose.",
          },
        ]}
      />
    </div>
  );
}
