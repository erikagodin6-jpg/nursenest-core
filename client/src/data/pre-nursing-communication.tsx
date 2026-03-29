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
import { MessageSquare, Users, FileText, Shield } from "lucide-react";

export function CommunicationModule() {
  const { t } = useI18n();
  const therapeuticWarning = useEditableText("comm-therapeutic-warning", "Giving false reassurance ('Everything will be fine'), being judgmental ('You shouldn't feel that way'), giving advice ('If I were you...'), changing the subject when the patient is expressing concerns, using medical jargon the patient doesn't understand, and asking 'why' questions ('Why didn't you take your medication?') which sound accusatory.");
  const sbarConcept = useEditableText("comm-sbar-concept", "Without a structure, handoffs often bury the critical information in a sea of background data. SBAR forces the communicator to lead with the most important information (Situation), provide only relevant context (Background), share their clinical reasoning (Assessment), and state a clear ask (Recommendation). This saves time and prevents the receiver from having to extract the key message.");
  const justCultureConcept = useEditableText("comm-just-culture-concept", "A just culture distinguishes between human error (unintentional — support the person), at-risk behavior (taking shortcuts — coach the person), and reckless behavior (conscious disregard for safety — hold accountable). This distinction encourages reporting of errors and near-misses without fear of punishment, which is essential for learning and prevention.");

  return (
    <div className="space-y-10" data-testid="module-communication">
      <div>
        <EditableModuleText sectionKey="comm-title" defaultText="Healthcare Communication Fundamentals" as="h2" className="text-2xl font-bold text-gray-900 mb-2" />
        <EditableModuleText sectionKey="comm-desc" defaultText="Master professional communication, therapeutic techniques, structured handoff methods, documentation principles, and interprofessional collaboration — foundational skills for safe, effective healthcare." as="p" className="text-gray-600" multiline />
      </div>

      <MicroLesson title="Therapeutic Communication" subtitle="Purposeful communication that promotes healing" icon={<MessageSquare className="w-5 h-5" />}>
        <EditableModuleText sectionKey="comm-therapeutic-content" defaultText={'Therapeutic communication is <span data-hover-term="goal-directed">goal-directed</span> interaction that prioritizes the patient\'s needs. It requires active listening, empathy, and intentional use of verbal and nonverbal techniques.'} as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <ProgressiveReveal
          title={t("data.pre_nursing_communication.therapeuticTechniques")}
          cards={[
            {
              id: "tc1",
              title: "Active Listening",
              summary: "Full attention with verbal and nonverbal engagement",
              detail: "Maintain eye contact (culturally appropriate), lean slightly forward, nod to indicate understanding, avoid interrupting. Verbal cues: 'I hear you,' 'Tell me more,' 'Go on.' Active listening communicates respect and encourages patients to share important information they might otherwise withhold.",
            },
            {
              id: "tc2",
              title: "Open-Ended Questions",
              summary: "Questions that invite elaboration",
              detail: "Ask 'How are you feeling about your care today?' instead of 'Are you feeling okay?' Open-ended questions begin with how, what, tell me, describe — they yield richer assessment data and make patients feel heard. Closed-ended questions (yes/no) are useful for specific data collection but limit patient expression.",
            },
            {
              id: "tc3",
              title: "Reflection & Paraphrasing",
              summary: "Mirroring content and feelings back",
              detail: "Reflection: 'It sounds like you're feeling anxious about the procedure.' Paraphrasing: 'So what you're saying is...' These techniques confirm understanding, validate the patient's experience, and encourage deeper exploration. They also catch miscommunication before it causes harm.",
            },
            {
              id: "tc4",
              title: "Silence",
              summary: "Purposeful pauses that allow processing",
              detail: "Silence gives patients time to organize thoughts, process emotions, and decide what to share. It communicates that you're not rushed and that their words matter. Many healthcare providers fill silence prematurely — learn to tolerate it as a therapeutic tool.",
            },
          ]}
        />
        <CognitiveCard
          type="warning"
          title={t("data.pre_nursing_communication.nontherapeuticResponsesToAvoid")}
          content={therapeuticWarning}
        />
      </MicroLesson>

      <MicroLesson title="SBAR Communication" subtitle="Structured handoff for patient safety" icon={<Users className="w-5 h-5" />}>
        <EditableModuleText sectionKey="comm-sbar-content" defaultText={'SBAR is a <span data-hover-term="standardized communication framework">standardized communication framework</span> designed to prevent critical information loss during handoffs, phone calls to providers, and escalation of concerns.'} as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
            <p className="text-xs font-semibold text-red-700 mb-1">S — Situation</p>
            <p className="text-xs text-red-600">What is happening right now? State the patient's name, location, the immediate concern. Be concise and specific. Example: 'I'm calling about Mr. Smith in Room 412. His blood pressure has dropped to 82/50 and he is diaphoretic.'</p>
          </div>
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">B — Background</p>
            <p className="text-xs text-blue-600">What is the relevant clinical context? Admitting diagnosis, pertinent medical history, current treatment, recent changes. Only include information relevant to the current situation. Example: 'He was admitted yesterday for pneumonia. He has a history of heart failure.'</p>
          </div>
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
            <p className="text-xs font-semibold text-amber-700 mb-1">A — Assessment</p>
            <p className="text-xs text-amber-600">What do you think is going on? Share your clinical judgment. Example: 'I'm concerned he may be developing sepsis. His lactate was 3.2 an hour ago and he has a new fever of 38.8°C.'</p>
          </div>
          <div className="p-4 bg-green-50/60 rounded-xl border border-green-100">
            <p className="text-xs font-semibold text-green-700 mb-1">R — Recommendation</p>
            <p className="text-xs text-green-600">What do you need? Be specific. Example: 'I'd like you to come evaluate him. Would you like me to start a fluid bolus and draw blood cultures in the meantime?'</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_communication.whySbarWorks")}
          content={sbarConcept}
        />
      </MicroLesson>

      <MicroLesson title="Documentation Principles" subtitle="If it wasn't documented, it wasn't done" icon={<FileText className="w-5 h-5" />}>
        <EditableModuleText sectionKey="comm-documentation-content" defaultText={'Healthcare documentation is a <span data-hover-term="legal record">legal record</span> that serves multiple critical functions: continuity of care, legal protection, communication between providers, quality improvement, and reimbursement.'} as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-green-50/60 rounded-xl border border-green-100">
            <p className="text-xs font-semibold text-green-700 mb-1">Documentation Best Practices</p>
            <p className="text-xs text-green-600"><strong>Be objective:</strong> Document what you observe, not your opinions. 'Patient stated: I feel dizzy' not 'Patient seems dizzy.' <strong>Be timely:</strong> Document as close to the event as possible. <strong>Be accurate:</strong> Use exact measurements, times, and quotes. <strong>Be complete:</strong> Include assessment findings, interventions, and patient response.</p>
          </div>
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
            <p className="text-xs font-semibold text-red-700 mb-1">Documentation Errors to Avoid</p>
            <p className="text-xs text-red-600"><strong>Never:</strong> Use correction fluid or erase entries. Backdate or add entries out of sequence. Document in advance ('pre-charting'). Include subjective judgments ('Patient is non-compliant'). Use unapproved abbreviations. Leave blank spaces in paper records. Document care that was not provided.</p>
          </div>
        </div>
      </MicroLesson>

      <MicroLesson title="Error Prevention & Situational Awareness" subtitle="Communication strategies that prevent harm" icon={<Shield className="w-5 h-5" />}>
        <EditableModuleText sectionKey="comm-error-prevention-content" defaultText={'Most healthcare errors involve <span data-hover-term="communication failures">communication failures</span>. A culture of safety requires specific communication strategies.'} as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">Read-Back / Repeat-Back</p>
            <p className="text-xs text-blue-600">When receiving verbal orders or critical test results, repeat the information back to the sender for verification. 'I'm reading back: Give Metoprolol 25 mg by mouth now. Is that correct?' This catches mishearing or miscommunication before it reaches the patient.</p>
          </div>
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 mb-1">CUS Framework — Escalating Concerns</p>
            <p className="text-xs text-purple-600"><strong>C</strong> — 'I am <em>Concerned</em>' (first level). <strong>U</strong> — 'I am <em>Uncomfortable</em>' (second level). <strong>S</strong> — 'This is a <em>Safety issue</em>' (highest level — stops the action). This graduated framework gives team members language to escalate concerns assertively.</p>
          </div>
          <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
            <p className="text-xs font-semibold text-teal-700 mb-1">Two-Challenge Rule</p>
            <p className="text-xs text-teal-600">If your concern is dismissed the first time, voice it again with different framing. If dismissed twice, escalate to the next level (charge nurse, supervisor, chain of command). Patient safety always takes priority over hierarchy.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_communication.justCulture")}
          content={justCultureConcept}
        />
      </MicroLesson>

      <MatchingExercise
        title={t("data.pre_nursing_communication.matchTheCommunicationConcept")}
        pairs={[
          { term: "Open-ended question", definition: "Invites elaboration — 'How are you feeling?'" },
          { term: "SBAR", definition: "Situation, Background, Assessment, Recommendation" },
          { term: "Active listening", definition: "Full attention with verbal and nonverbal engagement" },
          { term: "Read-back", definition: "Repeating orders back for verification" },
          { term: "CUS framework", definition: "Concerned → Uncomfortable → Safety issue" },
          { term: "Therapeutic silence", definition: "Purposeful pause allowing patient processing" },
        ]}
      />

      <SelfCheckQuiz
        title={t("data.pre_nursing_communication.communicationFoundationsQuiz")}
        questions={[
          {
            id: "cm1",
            question: "Which response is an example of therapeutic communication?",
            options: ["'Everything will be fine, don't worry.'", "'Tell me more about what concerns you.'", "'Why didn't you take your medication?'", "'If I were you, I would try exercising more.'"],
            correctIndex: 1,
            rationale: "'Tell me more about what concerns you' is an open-ended, non-judgmental prompt that encourages the patient to elaborate. The others are non-therapeutic: false reassurance, accusatory 'why' question, and giving unsolicited advice.",
          },
          {
            id: "cm2",
            question: "In SBAR, the 'A' stands for:",
            options: ["Action", "Assessment", "Alert", "Acknowledgment"],
            correctIndex: 1,
            rationale: "A = Assessment — your clinical judgment about what is happening. This is where you share your analysis, not just data. It helps the receiver understand your reasoning.",
          },
          {
            id: "cm3",
            question: "A nurse receives a verbal order for 'Metformin 500 mg PO BID.' The correct response is:",
            options: ["Write the order and administer the medication", "Ask the physician to enter it electronically", "Read back: 'Metformin 500 mg by mouth twice daily, is that correct?'", "Ask the charge nurse to confirm"],
            correctIndex: 2,
            rationale: "Read-back is the safety standard for verbal orders: repeat the order including drug name, dose, route, and frequency, and ask for confirmation. This catches errors before they reach the patient.",
          },
          {
            id: "cm4",
            question: "Which documentation practice is correct?",
            options: ["Documenting care before it is provided to save time", "Using correction fluid for minor errors", "Recording exact patient quotes using quotation marks", "Leaving blank spaces to fill in later"],
            correctIndex: 2,
            rationale: "Documenting exact patient quotes preserves the patient's own words as objective data. Pre-charting, correction fluid, and blank spaces are all documentation errors that compromise the legal record.",
          },
          {
            id: "cm5",
            question: "The CUS framework is used to:",
            options: ["Document patient care", "Escalate safety concerns through graduated language", "Communicate with patients", "Write nursing diagnoses"],
            correctIndex: 1,
            rationale: "CUS provides a structured way to escalate concerns: Concerned → Uncomfortable → Safety issue. Each level carries more urgency and signals to the team that the concern requires attention.",
          },
          {
            id: "cm6",
            question: "Most sentinel events in healthcare involve failures in:",
            options: ["Medication calculations", "Communication", "Equipment", "Staffing levels"],
            correctIndex: 1,
            rationale: "Studies consistently show that 60-70% of sentinel events involve communication breakdowns — during handoffs, between disciplines, or when team members fail to speak up about concerns.",
          },
          {
            id: "cm7",
            question: "A patient says, 'I'm scared about my surgery tomorrow.' Which response best demonstrates reflection?",
            options: ["'Don't worry, the surgeon is very experienced.'", "'It sounds like you're feeling anxious about the procedure.'", "'Why are you scared?'", "'Let me tell you about the surgery steps.'"],
            correctIndex: 1,
            rationale: "Reflection mirrors the patient's feelings back to them ('It sounds like you're feeling anxious'), validating their experience and encouraging further expression. The other options are false reassurance, an accusatory 'why' question, and premature information-giving.",
          },
          {
            id: "cm8",
            question: "Which statement represents the 'S' (Situation) component of SBAR?",
            options: ["'The patient has a history of diabetes and COPD.'", "'I believe the patient is experiencing respiratory distress.'", "'I'm calling about Mrs. Jones in Room 302 who is having difficulty breathing.'", "'I would like you to order a chest X-ray and ABG.'"],
            correctIndex: 2,
            rationale: "Situation identifies who you are calling about and what is happening right now. It should include the patient's name, location, and the immediate concern. The other options represent Background, Assessment, and Recommendation respectively.",
          },
          {
            id: "cm9",
            question: "A nurse makes a documentation error on a paper chart. The correct action is to:",
            options: ["Use correction fluid to cover the error", "Draw a single line through the error, initial, date, and write the correction", "Remove the page and rewrite it", "Leave it and add a note at the bottom of the page"],
            correctIndex: 1,
            rationale: "The correct method for correcting a paper chart error is to draw a single line through the error so the original entry remains legible, then initial, date, and write the correct information. This preserves the integrity of the legal record.",
          },
          {
            id: "cm10",
            question: "The two-challenge rule states that if a concern is dismissed twice, the nurse should:",
            options: ["Accept the decision and move on", "Document the concern and take no further action", "Escalate to the next level in the chain of command", "Report to the patient's family"],
            correctIndex: 2,
            rationale: "The two-challenge rule requires that if a safety concern is dismissed twice, the team member must escalate to the next level of authority (charge nurse, supervisor, chain of command). Patient safety always takes priority over hierarchy.",
          },
          {
            id: "cm11",
            question: "Which is an example of an open-ended question?",
            options: ["'Did you take your medication today?'", "'Are you in pain?'", "'How would you describe what you're experiencing?'", "'Is your pain a 5 out of 10?'"],
            correctIndex: 2,
            rationale: "'How would you describe what you're experiencing?' invites the patient to elaborate in their own words. The other options are closed-ended questions that can be answered with yes/no or a single data point, limiting the depth of information gathered.",
          },
          {
            id: "cm12",
            question: "In a just culture, a nurse who takes a known shortcut by skipping a safety check is demonstrating:",
            options: ["Human error", "At-risk behavior", "Reckless behavior", "System failure"],
            correctIndex: 1,
            rationale: "At-risk behavior involves consciously choosing to take shortcuts or deviate from standard practice, often because the risk seems low or the behavior has been normalized. The appropriate response is coaching, not punishment. Reckless behavior involves conscious disregard for substantial risk.",
          },
          {
            id: "cm13",
            question: "Therapeutic silence is best used when:",
            options: ["The nurse doesn't know what to say", "The patient needs time to process emotions or organize thoughts", "The nurse disagrees with the patient", "There is nothing left to discuss"],
            correctIndex: 1,
            rationale: "Therapeutic silence is an intentional pause that gives patients time to process emotions, organize their thoughts, and decide what to share. It communicates that the nurse is present and not rushed. It is a deliberate communication technique, not a default when conversation stalls.",
          },
          {
            id: "cm14",
            question: "Which documentation entry is most appropriate?",
            options: ["'Patient is non-compliant with diet.'", "'Patient was confused and agitated all day.'", "'Patient stated: I did not eat the foods on my diet plan today.'", "'Patient doesn't seem to care about his health.'"],
            correctIndex: 2,
            rationale: "Using the patient's exact words in quotation marks is objective documentation. The other options include subjective judgments ('non-compliant,' 'doesn't seem to care') or vague descriptions ('confused and agitated all day') that lack specificity and objectivity.",
          },
          {
            id: "cm15",
            question: "The 'R' in SBAR stands for Recommendation. An appropriate recommendation would be:",
            options: ["'I think the patient looks bad.'", "'The patient's vitals are abnormal.'", "'Would you like me to administer a fluid bolus and draw a lactate level?'", "'The patient was admitted for chest pain.'"],
            correctIndex: 2,
            rationale: "The Recommendation should be a specific, actionable request. Asking about a fluid bolus and lactate level gives the provider a clear proposed intervention. The other options describe vague impressions, assessment data, or background information.",
          },
          {
            id: "cm16",
            question: "Paraphrasing differs from reflection in that paraphrasing focuses on:",
            options: ["The patient's emotions", "Restating the content of what the patient said", "Asking follow-up questions", "Giving medical advice"],
            correctIndex: 1,
            rationale: "Paraphrasing restates the content or facts of what the patient communicated ('So what you're saying is...'), while reflection mirrors the emotional component ('It sounds like you're feeling...'). Both confirm understanding but address different aspects of the message.",
          },
          {
            id: "cm17",
            question: "A nurse witnesses a colleague administer medication without scanning the patient's wristband. Using CUS, which is the appropriate first response?",
            options: ["'This is a safety issue — stop immediately.'", "'I am concerned that the patient's wristband was not scanned.'", "'I am uncomfortable with how you are giving medications.'", "'I'm reporting this to the manager.'"],
            correctIndex: 1,
            rationale: "CUS is graduated: start with 'I am Concerned' (lowest level). If dismissed, escalate to 'I am Uncomfortable,' then to 'This is a Safety issue.' Starting at the first level maintains collegiality while still addressing the concern.",
          },
          {
            id: "cm18",
            question: "Pre-charting (documenting care before it is provided) is problematic because:",
            options: ["It saves too much time", "It creates a false legal record if the care is not actually delivered", "It uses too much paper", "It is only an issue in electronic records"],
            correctIndex: 1,
            rationale: "Pre-charting creates a false legal record. If the documented care is never performed, or if the patient's condition changes before the care is given, the chart will contain inaccurate information. This can lead to patient harm and legal liability.",
          },
          {
            id: "cm19",
            question: "Which action best promotes effective interprofessional communication during a patient handoff?",
            options: ["Providing as much information as possible without filtering", "Using a standardized framework like SBAR to organize key information", "Letting the receiving nurse ask all the questions", "Writing a brief note and leaving it at the nurses' station"],
            correctIndex: 1,
            rationale: "Standardized frameworks like SBAR ensure that critical information is communicated in a structured, consistent way during handoffs. This prevents information overload, reduces the chance of omitting key details, and ensures both parties share a common mental model.",
          },
          {
            id: "cm20",
            question: "A nurse accidentally administers the wrong dose of a medication due to a similar-looking label. In a just culture, this is classified as:",
            options: ["At-risk behavior", "Reckless behavior", "Human error", "Intentional misconduct"],
            correctIndex: 2,
            rationale: "Human error is unintentional — the nurse did not choose to make the mistake. In a just culture, human error is addressed by supporting the individual and examining the system (e.g., look-alike labels) to prevent recurrence. Punishment is not appropriate for genuine human error.",
          },
        ]}
      />
    </div>
  );
}
