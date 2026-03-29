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
import { Brain, Target, Clock, Lightbulb } from "lucide-react";

export function StudyStrategiesModule() {
  const { t } = useI18n();
  const testingEffectContent = useEditableText("study-testing-effect-content", "Research in cognitive science demonstrates that the act of retrieving information from memory — testing yourself — is itself a powerful learning event. Each successful retrieval strengthens the memory trace, making future retrieval easier. Failed retrieval attempts followed by feedback are also highly effective. This means practice questions are not just assessment tools — they are learning tools.");
  const crammingWarningContent = useEditableText("study-cramming-warning-content", "Cramming can produce short-term recall for a single exam, but nursing requires cumulative knowledge — pharmacology builds on physiology, which builds on anatomy, which builds on chemistry. Crammed material is unavailable when you need it in later courses and on the NCLEX. Spaced repetition throughout the semester ensures the foundation is solid when you build on it.");
  const failurePatternsContent = useEditableText("study-failure-patterns-content", "1. Studying content but not practicing questions (content ≠ test readiness). 2. Changing answers — your first instinct based on knowledge is usually correct; only change if you find a clear reasoning error. 3. Reading into the question — answer based on what's presented, not what you imagine might also be happening. 4. Choosing the most complex or longest answer — simplicity is often correct. 5. Picking an answer because it's familiar rather than because it answers the specific question asked.");

  return (
    <div className="space-y-10" data-testid="module-study-strategies">
      <div>
        <EditableModuleText sectionKey="study-title" defaultText="Study & Cognitive Strategies for Nursing School" as="h2" className="text-2xl font-bold text-gray-900 mb-2" />
        <EditableModuleText sectionKey="study-desc" defaultText="Master evidence-based study techniques, cognitive load management, active learning strategies, and exam reasoning skills that predict success in nursing education." as="p" className="text-gray-600" multiline />
      </div>

      <MicroLesson title="Active Recall vs Passive Study" subtitle="Why re-reading doesn't work" icon={<Brain className="w-5 h-5" />}>
        <EditableModuleText sectionKey="study-active-recall-content" defaultText="The most common study mistake is passive review — re-reading notes, highlighting text, and watching lectures without actively testing yourself. Active recall — forcing yourself to retrieve information from memory without looking at your notes — is 2-3 times more effective than re-reading." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
            <p className="text-xs font-semibold text-red-700 mb-1">Passive Methods (Low Retention)</p>
            <p className="text-xs text-red-600">Re-reading textbook chapters. Highlighting and underlining. Copying notes verbatim. Watching lecture recordings passively. Making study guides you never test yourself on. These feel productive but create an illusion of learning — you recognize the material but can't recall it on exam day.</p>
          </div>
          <div className="p-4 bg-green-50/60 rounded-xl border border-green-100">
            <p className="text-xs font-semibold text-green-700 mb-1">Active Methods (High Retention)</p>
            <p className="text-xs text-green-600">Practice questions (the #1 method for nursing exams). Flashcards with self-testing. Teaching concepts to others (or explaining aloud to yourself). Writing from memory then checking. Creating and answering your own questions. Clinical reasoning exercises. These force retrieval, which strengthens neural pathways.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_study_strategies.theTestingEffect")}
          content={testingEffectContent}
        />
      </MicroLesson>

      <MicroLesson title="Spaced Repetition" subtitle="Timing your reviews for maximum retention" icon={<Clock className="w-5 h-5" />}>
        <EditableModuleText sectionKey="study-spaced-repetition-content" defaultText="The spacing effect — where memory is stronger when study sessions are distributed over time — is one of the most robust findings in learning science. Information reviewed at increasing intervals is retained for months or years, while crammed information fades within days." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 mt-3">
          <p className="text-xs font-semibold text-blue-700 mb-2">The Forgetting Curve & How to Beat It</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-16 text-xs font-medium text-blue-600">Day 1</div>
              <div className="flex-1 bg-blue-200 rounded-full h-3"><div className="bg-blue-500 rounded-full h-3" style={{width: "100%"}} /></div>
              <span className="text-xs text-blue-600">100% (just learned)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 text-xs font-medium text-blue-600">Day 2</div>
              <div className="flex-1 bg-blue-200 rounded-full h-3"><div className="bg-blue-500 rounded-full h-3" style={{width: "40%"}} /></div>
              <span className="text-xs text-blue-600">~40% without review</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 text-xs font-medium text-blue-600">Day 7</div>
              <div className="flex-1 bg-blue-200 rounded-full h-3"><div className="bg-blue-500 rounded-full h-3" style={{width: "20%"}} /></div>
              <span className="text-xs text-blue-600">~20% without review</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 text-xs font-medium text-blue-600">Day 30</div>
              <div className="flex-1 bg-blue-200 rounded-full h-3"><div className="bg-blue-500 rounded-full h-3" style={{width: "5%"}} /></div>
              <span className="text-xs text-blue-600">~5% without review</span>
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">Each spaced review resets and extends the curve. After 4-5 well-timed reviews, the information becomes durable long-term memory.</p>
        </div>
        <CognitiveCard
          type="warning"
          title={t("data.pre_nursing_study_strategies.whyCrammingFailsForNursing")}
          content={crammingWarningContent}
        />
      </MicroLesson>

      <MicroLesson title="Concept Mapping & Clinical Reasoning" subtitle="Connecting ideas instead of memorizing lists" icon={<Target className="w-5 h-5" />}>
        <EditableModuleText sectionKey="study-concept-mapping-content" defaultText="Nursing exams test clinical reasoning — the ability to think through a clinical situation using knowledge of pathophysiology, pharmacology, and nursing care to prioritize actions and predict outcomes — not recall of isolated facts. Concept mapping builds the connections between ideas that clinical reasoning requires." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 mb-1">How to Build a Concept Map</p>
            <p className="text-xs text-purple-600"><strong>1.</strong> Start with a central concept (e.g., 'Heart Failure'). <strong>2.</strong> Branch out to related concepts (pathophysiology, risk factors, assessment findings). <strong>3.</strong> Draw connections between branches with linking phrases ('leads to,' 'caused by,' 'treated with'). <strong>4.</strong> Identify cross-links — these are the insights that show deep understanding. The process of creating the map is more valuable than the finished product.</p>
          </div>
          <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
            <p className="text-xs font-semibold text-teal-700 mb-1">The 'Why' Chain</p>
            <p className="text-xs text-teal-600">For every fact you learn, ask 'Why?' until you reach the mechanism. Example: 'ACE inhibitors cause cough' → Why? → 'Because they prevent bradykinin breakdown' → Why does that matter? → 'Bradykinin accumulates in the lungs and irritates airways.' This chain gives you the reasoning to answer application questions, not just recall questions.</p>
          </div>
        </div>
      </MicroLesson>

      <MicroLesson title="Exam Reasoning Strategies" subtitle="Approaching NCLEX-style questions" icon={<Lightbulb className="w-5 h-5" />}>
        <EditableModuleText sectionKey="study-exam-reasoning-content" defaultText="Nursing exam questions test application and analysis, not memorization. Developing a systematic approach to questions is as important as knowing the content." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <ProgressiveReveal
          title={t("data.pre_nursing_study_strategies.questionAttackStrategy")}
          cards={[
            {
              id: "ss1",
              title: "Read the LAST Line First",
              summary: "Identify what the question is actually asking",
              detail: "The stem (question text) often contains distracting details. Read the last line first to know what you're solving for — 'What is the PRIORITY nursing action?' is a very different question than 'What should the nurse document?' This prevents you from choosing a correct fact that doesn't answer the actual question.",
            },
            {
              id: "ss2",
              title: "Identify the Topic & Context",
              summary: "What clinical concept is being tested?",
              detail: "Determine the clinical topic (cardiac? respiratory? pharmacology?), the patient context (age, acuity, setting), and the nursing role being tested (assessment, intervention, evaluation, delegation). This narrows your thinking to the relevant knowledge domain.",
            },
            {
              id: "ss3",
              title: "Eliminate Systematically",
              summary: "Use ABC, Maslow, and nursing process",
              detail: "Priority frameworks help when multiple answers seem correct: ABC (Airway → Breathing → Circulation), Maslow's hierarchy (physiological → safety → psychosocial), Nursing Process (Assessment before Intervention). Eliminate options that violate these hierarchies. If two options address the same priority level, choose the more specific, patient-centered one.",
            },
            {
              id: "ss4",
              title: "Avoid 'Always' and 'Never'",
              summary: "Absolute terms are usually wrong",
              detail: "Options containing absolute words ('always,' 'never,' 'all,' 'none') are usually incorrect in nursing because clinical practice requires individual assessment and judgment. Options with qualifying words ('usually,' 'often,' 'may') are more likely correct because they acknowledge clinical variability.",
            },
          ]}
        />
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_study_strategies.commonFailurePatterns")}
          content={failurePatternsContent}
        />
      </MicroLesson>

      <MatchingExercise
        title={t("data.pre_nursing_study_strategies.matchTheStudyStrategy")}
        pairs={[
          { term: "Active recall", definition: "Testing yourself without looking at notes" },
          { term: "Spaced repetition", definition: "Reviewing at increasing intervals over time" },
          { term: "Concept mapping", definition: "Visualizing connections between ideas" },
          { term: "The testing effect", definition: "Retrieval practice strengthens memory" },
          { term: "Passive study", definition: "Re-reading and highlighting (low retention)" },
          { term: "Cramming", definition: "Concentrated study before exam (poor long-term retention)" },
        ]}
      />

      <SelfCheckQuiz
        title={t("data.pre_nursing_study_strategies.studyStrategiesQuiz")}
        questions={[
          {
            id: "ss1",
            question: "Which study method produces the highest long-term retention?",
            options: ["Re-reading the textbook chapter", "Highlighting key terms", "Practicing retrieval through self-testing", "Watching lecture recordings twice"],
            correctIndex: 2,
            rationale: "Active recall (self-testing) is consistently shown to produce 2-3 times better retention than passive methods. The act of retrieving information strengthens the memory trace.",
          },
          {
            id: "ss2",
            question: "The spacing effect works because:",
            options: ["Studying more hours is always better", "Distributed practice forces repeated retrieval at the point of forgetting", "It reduces total study time", "It eliminates the need for understanding"],
            correctIndex: 1,
            rationale: "Spaced repetition works by timing reviews at the point when you're about to forget — each retrieval at this threshold strengthens the memory more than easy reviews of fresh material.",
          },
          {
            id: "ss3",
            question: "When approaching an NCLEX-style question, the FIRST step should be:",
            options: ["Read all answer options", "Read the entire stem carefully", "Identify what the last line is asking", "Eliminate the longest answer"],
            correctIndex: 2,
            rationale: "Reading the last line first tells you what the question is actually asking — priority action? assessment finding? teaching point? This prevents you from being distracted by stem details and choosing a correct fact that doesn't answer the question.",
          },
          {
            id: "ss4",
            question: "A concept map is most valuable because it:",
            options: ["Looks impressive in study notes", "Organizes information in a linear list", "Reveals connections and relationships between concepts", "Eliminates the need for practice questions"],
            correctIndex: 2,
            rationale: "Concept maps build the relational understanding that clinical reasoning requires. Seeing how pathophysiology connects to assessment findings connects to interventions creates the integrated knowledge base needed for application questions.",
          },
          {
            id: "ss5",
            question: "Why does cramming fail specifically for nursing education?",
            options: ["Nursing courses are too easy for cramming to be necessary", "Nursing knowledge is cumulative — later courses build on earlier material", "Cramming is actually effective for nursing", "Nursing exams only test memorization"],
            correctIndex: 1,
            rationale: "Nursing knowledge is cumulative: pharmacology requires physiology, clinical reasoning requires pathophysiology, and the NCLEX tests integrated knowledge from all courses. Crammed material is unavailable for these later applications.",
          },
          {
            id: "ss6",
            question: "On a nursing exam, answer options containing 'always' or 'never' are usually:",
            options: ["Correct because they show confidence", "Incorrect because nursing requires individualized judgment", "The best choice when unsure", "Only wrong in pharmacology questions"],
            correctIndex: 1,
            rationale: "Absolute terms are usually wrong in nursing because clinical practice depends on individual patient assessment. Nursing decisions are rarely absolute — qualifying words ('usually,' 'may,' 'often') reflect clinical reality.",
          },
          {
            id: "ss7",
            question: "The 'forgetting curve' shows that without review, approximately what percentage of new information is lost within 24 hours?",
            options: ["10%", "30%", "60%", "90%"],
            correctIndex: 2,
            rationale: "Research by Ebbinghaus demonstrated that roughly 60% of newly learned material is forgotten within 24 hours without active review. Spaced repetition counteracts this rapid decline by reviewing at strategic intervals.",
          },
          {
            id: "ss8",
            question: "Which priority framework should a nursing student apply FIRST when two answer options both seem correct?",
            options: ["Choose the longest answer", "Apply ABC (Airway, Breathing, Circulation)", "Pick the option with the most medical terminology", "Select the psychosocial intervention"],
            correctIndex: 1,
            rationale: "ABC (Airway → Breathing → Circulation) is the primary priority framework in nursing. Physiological needs take priority over psychosocial needs, and within physiological needs, airway always comes first.",
          },
          {
            id: "ss9",
            question: "The 'Why Chain' study technique involves:",
            options: ["Asking classmates why they chose certain answers", "Repeatedly asking 'why' until you reach the underlying mechanism", "Questioning the textbook author's reasoning", "Asking why nursing school is difficult"],
            correctIndex: 1,
            rationale: "The 'Why Chain' deepens understanding by tracing facts to their underlying mechanisms. For example: 'ACE inhibitors cause cough' → Why? → 'Bradykinin accumulates' → Why? → 'ACE normally breaks down bradykinin.' This builds the reasoning needed for application questions.",
          },
          {
            id: "ss10",
            question: "A student reviews cardiac physiology on Day 1, Day 3, Day 7, and Day 14. This schedule demonstrates:",
            options: ["Cramming", "Massed practice", "Spaced repetition with expanding intervals", "Passive review"],
            correctIndex: 2,
            rationale: "Reviewing at expanding intervals (1, 3, 7, 14 days) is the hallmark of spaced repetition. Each review occurs near the point of forgetting, which maximally strengthens the memory trace and extends retention.",
          },
          {
            id: "ss11",
            question: "When a nursing exam question asks 'What is the PRIORITY action?', the student should:",
            options: ["Choose the first intervention that comes to mind", "Select the action that addresses the most life-threatening concern", "Pick the option that includes the most nursing skills", "Choose the option that involves calling the physician"],
            correctIndex: 1,
            rationale: "Priority questions require identifying the most life-threatening or urgent concern. Use ABC, Maslow's hierarchy, and the nursing process to determine which action addresses the most critical need first.",
          },
          {
            id: "ss12",
            question: "Teaching a concept to someone else (or explaining it aloud) is effective because it:",
            options: ["Is easier than reading", "Forces you to organize and retrieve information actively", "Takes less time than practice questions", "Eliminates the need for further study"],
            correctIndex: 1,
            rationale: "Teaching requires you to organize information logically, retrieve it from memory, and identify gaps in your understanding. This active process strengthens neural pathways far more than passive review methods.",
          },
          {
            id: "ss13",
            question: "A student consistently changes their answers on exams and scores lower as a result. What study strategy addresses this?",
            options: ["Study longer hours before the exam", "Trust your first instinct unless you find a clear reasoning error", "Always change answers to longer options", "Skip questions you're unsure about"],
            correctIndex: 1,
            rationale: "Research shows that first instincts based on knowledge are usually correct. Students should only change answers when they identify a specific reasoning error, not based on anxiety or second-guessing.",
          },
          {
            id: "ss14",
            question: "Maslow's hierarchy applied to nursing exam questions means:",
            options: ["Psychosocial needs always come first", "Physiological needs take priority over safety and psychosocial needs", "Self-actualization is the priority in acute care", "All levels of need are equally important"],
            correctIndex: 1,
            rationale: "In nursing priority questions, Maslow's hierarchy dictates that physiological needs (airway, breathing, circulation, nutrition) take priority over safety, belonging, esteem, and self-actualization needs.",
          },
          {
            id: "ss15",
            question: "What is the primary difference between recognition and recall?",
            options: ["They are the same cognitive process", "Recognition identifies familiar material; recall retrieves it from memory without cues", "Recall is easier than recognition", "Recognition is the goal of nursing education"],
            correctIndex: 1,
            rationale: "Recognition (identifying correct information when you see it) creates an illusion of learning. Recall (retrieving information without cues) is what exams and clinical practice require. Passive study builds recognition; active recall builds true retrieval ability.",
          },
          {
            id: "ss16",
            question: "A student reads a question about a patient with chest pain and assumes the patient is also having an MI, even though the stem doesn't state this. This error is called:",
            options: ["Critical thinking", "Reading into the question", "Clinical reasoning", "Prioritization"],
            correctIndex: 1,
            rationale: "Reading into the question means adding information that isn't provided in the stem. Students should answer based only on the information presented, not on assumptions about what else might be happening clinically.",
          },
          {
            id: "ss17",
            question: "Which study approach is MOST effective for preparing for NCLEX-style application questions?",
            options: ["Memorizing drug classifications from a list", "Practicing clinical scenario-based questions with rationales", "Re-reading the textbook multiple times", "Creating color-coded study guides"],
            correctIndex: 1,
            rationale: "NCLEX tests application and analysis, not memorization. Practicing with clinical scenario questions and studying the rationales builds the reasoning skills needed to apply knowledge to novel patient situations.",
          },
          {
            id: "ss18",
            question: "Cognitive load theory suggests that effective studying requires:",
            options: ["Multitasking to cover more material", "Studying in noisy environments to build focus", "Breaking complex information into manageable chunks", "Studying everything at once for the big picture"],
            correctIndex: 2,
            rationale: "Working memory has limited capacity. Cognitive load theory shows that breaking complex information into smaller, meaningful chunks prevents overload and allows deeper processing and integration into long-term memory.",
          },
          {
            id: "ss19",
            question: "The nursing process (Assessment, Diagnosis, Planning, Implementation, Evaluation) is used in exam strategy to:",
            options: ["Ensure you always choose assessment as the answer", "Determine that assessment should generally come before intervention in answer choices", "Eliminate all implementation answers", "Choose evaluation answers over all others"],
            correctIndex: 1,
            rationale: "The nursing process helps with priority questions: generally, you should assess before intervening. If one option is 'assess the patient' and another is 'administer medication,' and assessment hasn't been completed, the assessment option is usually correct.",
          },
          {
            id: "ss20",
            question: "Cross-links in a concept map are valuable because they:",
            options: ["Make the map look more complex", "Show connections between different knowledge domains that deepen understanding", "Are required by nursing instructors", "Replace the need for practice questions"],
            correctIndex: 1,
            rationale: "Cross-links connect ideas across different branches or domains (e.g., linking a pharmacology concept to a pathophysiology concept). These connections reflect the integrated thinking that clinical reasoning demands and that NCLEX-style questions test.",
          },
        ]}
      />
    </div>
  );
}
