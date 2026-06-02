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
import { Users, Heart, Globe, Shield } from "lucide-react";

export function CulturalCompetencyModule() {
  const { t } = useI18n();
  const sdohContent = useEditableText("cc-sdoh-content", "Social Determinants of Health (SDOH) are the non-medical factors that influence health outcomes. They include the conditions in which people are born, grow, work, live, and age, and the wider set of forces shaping daily life. SDOH account for 30-55% of health outcomes — far more than clinical care alone. Nurses must assess and address these factors to provide equitable, effective care.");
  const biasContent = useEditableText("cc-bias-content", "Implicit biases are unconscious attitudes or stereotypes that affect understanding, actions, and decisions. In healthcare, implicit bias can lead to disparities in pain management, diagnostic workups, treatment recommendations, and communication quality. Research shows that healthcare providers hold implicit biases related to race, ethnicity, weight, age, gender identity, socioeconomic status, and disability. Recognizing that everyone holds implicit biases is the first step — the goal is not to eliminate them entirely but to develop strategies to prevent them from affecting patient care.");
  const traumaInformedContent = useEditableText("cc-trauma-informed-content", "Trauma-informed care (TIC) recognizes that many patients have experienced trauma — physical, emotional, sexual, or systemic — and that healthcare encounters can trigger re-traumatization. The five principles are: Safety (ensuring physical and emotional safety), Trustworthiness (maintaining clear boundaries and consistency), Choice (giving patients control over decisions), Collaboration (sharing power in the care relationship), and Empowerment (building on patient strengths). TIC shifts the question from 'What is wrong with you?' to 'What has happened to you?'");

  return (
    <div className="space-y-10" data-testid="module-cultural-competency">
      <div>
        <EditableModuleText sectionKey="cc-title" defaultText="Cultural Competency & Social Determinants of Health" as="h2" className="text-2xl font-bold text-gray-900 mb-2" />
        <EditableModuleText sectionKey="cc-desc" defaultText="Develop cultural humility, recognize implicit bias, understand social determinants of health, and apply trauma-informed care principles to deliver equitable, patient-centered nursing care." as="p" className="text-gray-600" multiline />
      </div>

      <MicroLesson title="Social Determinants of Health (SDOH)" subtitle="The non-medical factors that drive health outcomes" icon={<Globe className="w-5 h-5" />}>
        <EditableModuleText sectionKey="cc-sdoh-intro" defaultText="Health outcomes are shaped far more by where people live, work, and grow than by the clinical care they receive. Understanding SDOH is essential for nurses who want to address root causes of health disparities, not just symptoms." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">Five Key SDOH Domains (Healthy People 2030)</p>
            <p className="text-xs text-blue-600"><strong>1. Economic Stability:</strong> Employment, income, food security, housing stability. <strong>2. Education Access & Quality:</strong> Literacy, language, early childhood education. <strong>3. Healthcare Access & Quality:</strong> Insurance coverage, provider availability, cultural competence of care. <strong>4. Neighborhood & Built Environment:</strong> Housing quality, transportation, safety, walkability, access to healthy foods. <strong>5. Social & Community Context:</strong> Social support, community engagement, discrimination, incarceration history.</p>
          </div>
          <div className="p-4 bg-green-50/60 rounded-xl border border-green-100">
            <p className="text-xs font-semibold text-green-700 mb-1">Nursing Implications</p>
            <p className="text-xs text-green-600">Screen for SDOH using validated tools. Connect patients to community resources (food banks, housing assistance, transportation). Document SDOH in the medical record using Z-codes (ICD-10). Advocate for policy changes that address upstream determinants. Recognize that non-adherence may reflect barriers — not unwillingness. A patient who misses appointments may lack transportation, not motivation.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_cultural_competency.sdohImpactOnHealth")}
          content={sdohContent}
        />
      </MicroLesson>

      <MicroLesson title="Cultural Humility vs. Cultural Competence" subtitle="Moving from knowledge to lifelong self-reflection" icon={<Heart className="w-5 h-5" />}>
        <EditableModuleText sectionKey="cc-humility-intro" defaultText="Cultural competence implies a finite endpoint — mastering knowledge about specific cultures. Cultural humility, by contrast, is a lifelong commitment to self-reflection, recognizing power imbalances, and developing mutually respectful partnerships. Modern nursing education increasingly emphasizes humility over competence because no one can master all cultures." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
            <p className="text-xs font-semibold text-amber-700 mb-1">Cultural Competence (Traditional Model)</p>
            <p className="text-xs text-amber-600">Knowledge-based approach: learn facts about specific cultural groups. Risk of stereotyping — assuming all members of a group share the same beliefs. Implies an achievable endpoint. Focuses on the provider's knowledge. Example: 'Hispanic patients value family involvement in care decisions.' While sometimes useful, this approach can become reductionist.</p>
          </div>
          <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
            <p className="text-xs font-semibold text-teal-700 mb-1">Cultural Humility (Modern Approach)</p>
            <p className="text-xs text-teal-600">Lifelong process of self-reflection and self-critique. Acknowledges power imbalances in the provider-patient relationship. Treats the patient as the expert on their own experience. Asks open-ended questions: 'What is important to you about your care?' 'How does your family make health decisions?' 'Are there cultural or spiritual practices I should know about?' Avoids assumptions about any individual based on group membership.</p>
          </div>
        </div>
        <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100 mt-3">
          <p className="text-xs font-semibold text-purple-700 mb-1">Culturally Responsive Communication</p>
          <p className="text-xs text-purple-600"><strong>Use professional interpreters</strong> — never family members (especially children) for medical interpretation. Family members may filter, omit, or add information, and using them creates confidentiality and consent issues. <strong>Health literacy:</strong> Use plain language, teach-back method, visual aids. Approximately 36% of U.S. adults have basic or below-basic health literacy. <strong>Nonverbal awareness:</strong> Eye contact, personal space, and touch norms vary across cultures. <strong>Ask, don't assume:</strong> Every patient is an individual within their cultural context.</p>
        </div>
      </MicroLesson>

      <MicroLesson title="Implicit Bias & Health Disparities" subtitle="Recognizing unconscious influences on clinical decisions" icon={<Shield className="w-5 h-5" />}>
        <EditableModuleText sectionKey="cc-bias-intro" defaultText="Health disparities are preventable differences in health outcomes between population groups. They persist even when controlling for insurance status, income, and education — suggesting that bias within the healthcare system itself plays a role. Nurses spend more time with patients than any other provider and thus have enormous influence on equitable care delivery." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <ProgressiveReveal
          title={t("data.pre_nursing_cultural_competency.typesOfBiasInHealthcare")}
          cards={[
            {
              id: "cc-bias-1",
              title: "Confirmation Bias",
              summary: "Seeking information that confirms existing beliefs",
              detail: "A provider who assumes a patient with substance use disorder is drug-seeking may focus only on evidence supporting that assumption and miss legitimate pain or pathology. Confirmation bias narrows clinical assessment and can lead to missed diagnoses.",
            },
            {
              id: "cc-bias-2",
              title: "Anchoring Bias",
              summary: "Over-relying on the first piece of information received",
              detail: "If a triage note says 'anxiety attack,' providers may anchor on that diagnosis and fail to fully evaluate chest pain, dyspnea, or other potentially serious symptoms. First impressions can override clinical evidence.",
            },
            {
              id: "cc-bias-3",
              title: "Weight Bias",
              summary: "Attributing symptoms to obesity without thorough workup",
              detail: "Patients with higher BMI report that providers attribute all symptoms to weight, leading to delayed diagnosis of cancer, cardiac disease, autoimmune conditions, and other pathology. This is one of the most pervasive and undertreated biases in healthcare.",
            },
            {
              id: "cc-bias-4",
              title: "Racial Bias in Pain Management",
              summary: "Disparities in pain assessment and treatment by race",
              detail: "Studies consistently show that Black and Hispanic patients receive less analgesia for the same conditions compared to white patients. A 2016 study found that 50% of medical students and residents endorsed false beliefs about biological differences in pain sensitivity between races. These biases directly impact patient outcomes.",
            },
          ]}
        />
        <CognitiveCard
          type="warning"
          title={t("data.pre_nursing_cultural_competency.recognizingAndMitigatingImplicitBias")}
          content={biasContent}
        />
      </MicroLesson>

      <MicroLesson title="Trauma-Informed Care & Health Literacy" subtitle="Creating safe, empowering healthcare encounters" icon={<Users className="w-5 h-5" />}>
        <EditableModuleText sectionKey="cc-tic-intro" defaultText="Trauma is pervasive — the ACE (Adverse Childhood Experiences) study found that nearly two-thirds of adults have experienced at least one adverse childhood experience. Healthcare settings can trigger re-traumatization through power imbalances, loss of control, invasive procedures, and institutional environments. Nurses practicing trauma-informed care create safety and trust that improve outcomes." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-100">
            <p className="text-xs font-semibold text-rose-700 mb-1">Five Principles of Trauma-Informed Care</p>
            <p className="text-xs text-rose-600"><strong>1. Safety:</strong> Physical and emotional safety — explain what you will do before touching the patient. <strong>2. Trustworthiness:</strong> Be consistent, follow through on promises, maintain boundaries. <strong>3. Choice:</strong> Offer options whenever possible — 'Would you prefer to sit or lie down for this procedure?' <strong>4. Collaboration:</strong> Partner with the patient rather than directing them. <strong>5. Empowerment:</strong> Build on patient strengths and resilience.</p>
          </div>
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
            <p className="text-xs font-semibold text-indigo-700 mb-1">Health Literacy in Practice</p>
            <p className="text-xs text-indigo-600"><strong>Teach-back method:</strong> 'Can you tell me in your own words what we discussed?' — confirms understanding without shaming. <strong>Plain language:</strong> Replace 'hypertension' with 'high blood pressure,' 'NPO' with 'nothing to eat or drink.' <strong>Visual aids:</strong> Use diagrams, models, and written materials at 5th-6th grade reading level. <strong>Chunk and check:</strong> Give 2-3 pieces of information, then check understanding before continuing. <strong>Universal precautions approach:</strong> Assume all patients may have limited health literacy — clear communication benefits everyone.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_cultural_competency.traumainformedNursingPractice")}
          content={traumaInformedContent}
        />
      </MicroLesson>

      <MatchingExercise
        title={t("data.pre_nursing_cultural_competency.matchTheCulturalCompetencyConcept")}
        pairs={[
          { id: "cc-m1", term: "Social determinants of health", definition: "Non-medical factors like income, housing, and education that affect health outcomes" },
          { id: "cc-m2", term: "Cultural humility", definition: "Lifelong self-reflection and treating patients as experts on their own experience" },
          { id: "cc-m3", term: "Implicit bias", definition: "Unconscious attitudes that affect clinical decisions without awareness" },
          { id: "cc-m4", term: "Trauma-informed care", definition: "Approach recognizing trauma history and preventing re-traumatization" },
          { id: "cc-m5", term: "Health literacy", definition: "Ability to obtain, process, and understand basic health information" },
          { id: "cc-m6", term: "Teach-back method", definition: "Asking patients to explain information in their own words to confirm understanding" },
        ]}
      />

      <SelfCheckQuiz
        title={t("data.pre_nursing_cultural_competency.culturalCompetencySdohQuiz")}
        questions={[
          {
            id: "cc1",
            question: "Which factor accounts for the LARGEST proportion of health outcomes?",
            options: ["Clinical healthcare quality", "Genetics and biology", "Social determinants of health", "Individual health behaviors alone"],
            correctIndex: 2,
            rationale: "Social determinants of health (SDOH) account for 30-55% of health outcomes — more than clinical care, genetics, or individual behaviors alone. This includes factors like income, education, housing, and community context.",
          },
          {
            id: "cc2",
            question: "A nurse needs to explain a new diagnosis to a patient who speaks limited English. The BEST action is to:",
            options: ["Ask the patient's adult child to interpret", "Use a professional medical interpreter", "Speak slowly and loudly in English", "Provide written materials in English and gesture"],
            correctIndex: 1,
            rationale: "Professional medical interpreters are trained in medical terminology, confidentiality, and accuracy. Family members may filter information, omit sensitive details, or lack medical vocabulary. Using children as interpreters is never appropriate.",
          },
          {
            id: "cc3",
            question: "Cultural humility differs from cultural competence primarily because cultural humility:",
            options: ["Requires memorizing facts about every culture", "Is a lifelong process of self-reflection without a fixed endpoint", "Can be achieved through a single training session", "Focuses only on language barriers"],
            correctIndex: 1,
            rationale: "Cultural humility is a lifelong commitment to self-reflection, recognizing power imbalances, and treating patients as experts on their own cultural experience. Cultural competence implies a finite endpoint of mastered knowledge.",
          },
          {
            id: "cc4",
            question: "A patient repeatedly misses follow-up appointments. Using a SDOH lens, the nurse should FIRST:",
            options: ["Document the patient as non-compliant", "Discharge the patient from the practice", "Assess for barriers such as transportation, work schedule, or childcare", "Assume the patient does not value their health"],
            correctIndex: 2,
            rationale: "Non-adherence often reflects social barriers rather than patient unwillingness. Assessing for transportation, work conflicts, childcare needs, or financial barriers allows the nurse to address root causes and connect patients with resources.",
          },
          {
            id: "cc5",
            question: "Implicit bias in healthcare is BEST described as:",
            options: ["Intentional discrimination against certain patient groups", "Unconscious attitudes that influence clinical decisions without awareness", "A problem limited to older healthcare providers", "Bias that only affects pain management decisions"],
            correctIndex: 1,
            rationale: "Implicit biases are unconscious attitudes that affect understanding, actions, and decisions. All healthcare providers hold implicit biases — the goal is to recognize them and develop strategies to prevent them from affecting patient care.",
          },
          {
            id: "cc6",
            question: "The teach-back method involves:",
            options: ["Teaching patients to read medical charts", "Having patients repeat medical terminology", "Asking patients to explain information in their own words to verify understanding", "Providing patients with textbooks about their condition"],
            correctIndex: 2,
            rationale: "The teach-back method asks patients to restate information in their own words — 'Can you tell me what we discussed about your medications?' This confirms understanding without shaming and identifies gaps in comprehension.",
          },
          {
            id: "cc7",
            question: "Which principle of trauma-informed care involves giving patients control over healthcare decisions?",
            options: ["Safety", "Trustworthiness", "Choice", "Collaboration"],
            correctIndex: 2,
            rationale: "Choice means offering patients options whenever possible — 'Would you prefer to sit or lie down?' 'Would you like a same-gender provider?' Giving control back to patients who have experienced trauma supports healing and trust.",
          },
          {
            id: "cc8",
            question: "The ACE (Adverse Childhood Experiences) study found that:",
            options: ["Childhood trauma is rare, affecting less than 10% of adults", "Nearly two-thirds of adults have experienced at least one adverse childhood experience", "ACEs only affect mental health, not physical health", "ACEs are only relevant in pediatric settings"],
            correctIndex: 1,
            rationale: "The landmark ACE study found that approximately 64% of adults have at least one ACE, and ACEs are strongly correlated with chronic disease, mental health conditions, substance use, and early mortality in adulthood.",
          },
          {
            id: "cc9",
            question: "A nurse suspects that a colleague is providing less thorough pain assessments for patients of a particular racial group. This is an example of:",
            options: ["Cultural competence in action", "Appropriate clinical judgment", "Implicit racial bias affecting care delivery", "Evidence-based practice"],
            correctIndex: 2,
            rationale: "Disparities in pain assessment and treatment by race are well-documented examples of implicit bias in healthcare. Studies consistently show that Black and Hispanic patients receive less analgesia for the same conditions compared to white patients.",
          },
          {
            id: "cc10",
            question: "Health literacy is BEST assessed by:",
            options: ["Asking patients their education level", "Observing whether patients can read consent forms", "Using a universal precautions approach — assuming all patients may benefit from clear communication", "Testing patients with vocabulary quizzes"],
            correctIndex: 2,
            rationale: "The universal precautions approach to health literacy means providing clear, plain-language communication to ALL patients regardless of education level. Education level does not reliably predict health literacy, and testing creates shame.",
          },
          {
            id: "cc11",
            question: "Which of the following is a key domain of Social Determinants of Health according to Healthy People 2030?",
            options: ["Genetic predisposition", "Blood type distribution", "Neighborhood and built environment", "Medication metabolism rates"],
            correctIndex: 2,
            rationale: "The five SDOH domains in Healthy People 2030 are: Economic Stability, Education Access & Quality, Healthcare Access & Quality, Neighborhood & Built Environment, and Social & Community Context.",
          },
          {
            id: "cc12",
            question: "When providing trauma-informed care, the nurse should shift the question from:",
            options: ["'What are your symptoms?' to 'What medications do you take?'", "'What is wrong with you?' to 'What has happened to you?'", "'How are you feeling?' to 'What is your pain level?'", "'What do you need?' to 'What does your doctor recommend?'"],
            correctIndex: 1,
            rationale: "Trauma-informed care reframes the approach from pathology-focused ('What is wrong with you?') to experience-focused ('What has happened to you?'), recognizing that behaviors and health conditions often have roots in traumatic experiences.",
          },
          {
            id: "cc13",
            question: "Using a patient's child as a medical interpreter is inappropriate PRIMARILY because:",
            options: ["Children cannot understand medical terminology", "It violates child labor laws", "It creates confidentiality issues, role reversal, and risks of inaccurate translation", "It takes too much time"],
            correctIndex: 2,
            rationale: "Using children as interpreters creates multiple problems: confidentiality violations, inappropriate role reversal, emotional burden on the child, risk of inaccurate or filtered translation, and potential consent issues. Professional interpreters should always be used.",
          },
          {
            id: "cc14",
            question: "Confirmation bias in healthcare means:",
            options: ["Confirming a diagnosis with laboratory tests", "Seeking information that confirms existing assumptions about a patient", "Getting a second opinion to confirm treatment plans", "Confirming patient identity before medication administration"],
            correctIndex: 1,
            rationale: "Confirmation bias occurs when a provider selectively seeks or interprets information that confirms their initial assumption, potentially missing contradictory evidence. This can lead to missed diagnoses and inadequate treatment.",
          },
          {
            id: "cc15",
            question: "A nurse is caring for a patient from an unfamiliar cultural background. The BEST approach is to:",
            options: ["Research stereotypes about that culture online", "Assume the patient follows all traditional practices of their culture", "Ask the patient open-ended questions about their preferences and beliefs", "Treat the patient exactly the same as all other patients without asking about preferences"],
            correctIndex: 2,
            rationale: "Cultural humility involves asking open-ended questions — 'What is important to you about your care?' 'Are there cultural or spiritual practices I should know about?' This treats the patient as the expert on their own experience without stereotyping.",
          },
          {
            id: "cc16",
            question: "SDOH are documented in medical records using:",
            options: ["CPT procedure codes", "ICD-10 Z-codes", "NANDA nursing diagnoses only", "Progress notes without specific codes"],
            correctIndex: 1,
            rationale: "ICD-10 Z-codes (Z55-Z65) capture SDOH factors such as housing instability, food insecurity, transportation barriers, and educational challenges. Documenting these allows tracking of social factors and connection to resources.",
          },
          {
            id: "cc17",
            question: "Which strategy is MOST effective for communicating complex health information to patients with low health literacy?",
            options: ["Providing detailed written instructions with medical terminology", "Using the chunk-and-check method — giving 2-3 pieces of information then verifying understanding", "Speaking louder and more slowly", "Giving all instructions at once to save time"],
            correctIndex: 1,
            rationale: "Chunk-and-check involves delivering 2-3 pieces of information, then checking understanding before continuing. This prevents cognitive overload and allows clarification in real-time. Combined with plain language and teach-back, it significantly improves comprehension.",
          },
          {
            id: "cc18",
            question: "Weight bias in healthcare can lead to:",
            options: ["More thorough physical examinations", "Delayed diagnosis when symptoms are attributed to obesity without full workup", "Improved patient-provider relationships", "Better adherence to treatment plans"],
            correctIndex: 1,
            rationale: "Weight bias leads providers to attribute symptoms to obesity without conducting thorough diagnostic workups. This has resulted in delayed diagnoses of cancer, cardiac disease, autoimmune conditions, and other serious pathology in patients with higher BMI.",
          },
          {
            id: "cc19",
            question: "The 'Safety' principle of trauma-informed care includes:",
            options: ["Using physical restraints to prevent patient harm", "Ensuring both physical and emotional safety, including explaining procedures before touching the patient", "Keeping patients under constant surveillance", "Restricting patient visitors for their protection"],
            correctIndex: 1,
            rationale: "Safety in trauma-informed care means ensuring both physical and emotional safety. This includes explaining what you will do before touching the patient, asking permission, providing a calm environment, and being attentive to signs of distress.",
          },
          {
            id: "cc20",
            question: "Health disparities BEST refer to:",
            options: ["Normal variations in health outcomes between individuals", "Preventable differences in health outcomes between population groups", "Differences in healthcare costs between hospitals", "Variations in provider specialization"],
            correctIndex: 1,
            rationale: "Health disparities are preventable differences in health outcomes experienced by socially disadvantaged populations. They are linked to historical and current inequities in social, economic, and environmental conditions — not to biological differences between groups.",
          },
        ]}
      />
    </div>
  );
}
