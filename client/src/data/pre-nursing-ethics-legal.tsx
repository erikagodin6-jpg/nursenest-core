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
import { Scale, Shield, BookOpen, Heart } from "lucide-react";

export function EthicsLegalModule() {
  const { t } = useI18n();
  const principlesConflict = useEditableText("ethics-principles-conflict", "A competent adult patient refuses a blood transfusion based on religious beliefs, but without it they may die. Autonomy says respect their decision. Beneficence says intervene to save their life. This is an ethical dilemma — and in most legal frameworks, autonomy prevails for competent adults. Recognizing these tensions and reasoning through them is the foundation of ethical practice.");
  const mandatoryReporting = useEditableText("ethics-mandatory-reporting", "Confidentiality is not absolute. Healthcare providers are legally required to report: suspected child abuse or neglect, suspected elder abuse, certain communicable diseases (to public health), gunshot wounds and stab wounds, threats of harm to self or others (duty to warn/protect). These reporting obligations override patient confidentiality.");

  return (
    <div className="space-y-10" data-testid="module-ethics-legal">
      <div>
        <EditableModuleText sectionKey="ethics-title" defaultText="Ethical & Legal Foundations" as="h2" className="text-2xl font-bold text-gray-900 mb-2" />
        <EditableModuleText sectionKey="ethics-desc" defaultText="Understand the bioethics principles, legal concepts, patient rights, and professional standards that govern healthcare practice — foundational knowledge for safe, ethical nursing." as="p" className="text-gray-600" multiline />
      </div>

      <MicroLesson title="Bioethics Principles" subtitle="The four pillars of healthcare ethics" icon={<Heart className="w-5 h-5" />}>
        <EditableModuleText sectionKey="ethics-bioethics-content" defaultText="Healthcare ethics is built on four core bioethics principles — Autonomy (patient self-determination), Beneficence (doing good), Nonmaleficence (do no harm), and Justice (fairness in resource allocation) — established by Beauchamp and Childress. When these principles conflict — and they frequently do — ethical reasoning requires balancing them thoughtfully." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <ProgressiveReveal
          title={t("data.pre_nursing_ethics_legal.theFourPrinciples")}
          cards={[
            {
              id: "ep1",
              title: "Autonomy",
              summary: "Patient self-determination and informed choice",
              detail: "Patients have the right to make their own healthcare decisions, even if those decisions conflict with medical advice. This principle underlies informed consent, advance directives, and the right to refuse treatment. Respecting autonomy requires providing adequate information in understandable language and ensuring decisions are made voluntarily, without coercion.",
            },
            {
              id: "ep2",
              title: "Beneficence",
              summary: "Acting in the patient's best interest",
              detail: "The obligation to do good — to act in ways that benefit the patient. This goes beyond simply avoiding harm; it requires actively promoting the patient's well-being. It includes providing competent care, advocating for patients, and balancing benefits against risks of interventions.",
            },
            {
              id: "ep3",
              title: "Nonmaleficence",
              summary: "First, do no harm",
              detail: "The obligation to avoid causing harm. Every intervention carries potential risks — nonmaleficence requires that the expected benefit outweighs the potential harm. This principle drives medication safety checks, fall prevention protocols, and the careful assessment of intervention risks.",
            },
            {
              id: "ep4",
              title: "Justice",
              summary: "Fair distribution of resources and care",
              detail: "The obligation to treat patients fairly and equitably. This includes equitable access to care, fair allocation of scarce resources (triage), and avoiding discrimination. Justice requires that healthcare decisions are not influenced by social status, ability to pay, ethnicity, or personal biases.",
            },
          ]}
        />
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_ethics_legal.whenPrinciplesConflict")}
          content={principlesConflict}
        />
      </MicroLesson>

      <MicroLesson title="Informed Consent" subtitle="More than a signature" icon={<BookOpen className="w-5 h-5" />}>
        <EditableModuleText sectionKey="ethics-consent-content" defaultText="Informed consent is a process, not a form. The signed form is documentation that the process occurred. The actual consent process involves a conversation where the provider explains the procedure, its risks, benefits, alternatives, and the right to refuse — and the patient demonstrates understanding before agreeing. It is the practical application of the autonomy principle." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">Required Elements</p>
            <p className="text-xs text-blue-600"><strong>1. Disclosure:</strong> Nature of the procedure, risks, benefits, alternatives, and consequences of refusal. <strong>2. Comprehension:</strong> Information is presented in language the patient understands. <strong>3. Voluntariness:</strong> Decision is free from coercion. <strong>4. Competence:</strong> Patient has decision-making capacity. <strong>5. Consent:</strong> Patient agrees to the procedure.</p>
          </div>
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
            <p className="text-xs font-semibold text-amber-700 mb-1">Who Obtains Consent?</p>
            <p className="text-xs text-amber-600">The person performing the procedure (physician, surgeon, NP) is responsible for explaining the procedure and obtaining informed consent. The nurse's role is to witness the signature, ensure the patient understood the information, and advocate for the patient if they appear confused, coerced, or uninformed.</p>
          </div>
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
            <p className="text-xs font-semibold text-red-700 mb-1">Exceptions to Informed Consent</p>
            <p className="text-xs text-red-600"><strong>Emergency:</strong> When delay would cause death or serious harm and consent cannot be obtained. <strong>Therapeutic privilege:</strong> Rare — when disclosure would cause serious psychological harm. <strong>Patient waiver:</strong> Patient explicitly states they don't want to know details. <strong>Implied consent:</strong> Patient presents for routine care (e.g., extending arm for blood draw).</p>
          </div>
        </div>
      </MicroLesson>

      <MicroLesson title="Patient Rights & Confidentiality" subtitle="HIPAA, privacy, and patient advocacy" icon={<Shield className="w-5 h-5" />}>
        <EditableModuleText sectionKey="ethics-rights-content" defaultText="Patient rights are legally protected. Understanding these rights and the duty of confidentiality — the legal and ethical obligation to protect patient health information (PHI), codified in privacy legislation (e.g., HIPAA in the US, PIPEDA in Canada) — is non-negotiable for all healthcare providers. Violations can result in fines, license sanctions, and criminal charges." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-green-50/60 rounded-xl border border-green-100">
            <p className="text-xs font-semibold text-green-700 mb-1">Core Patient Rights</p>
            <p className="text-xs text-green-600">Right to informed consent. Right to refuse treatment. Right to privacy and confidentiality. Right to access their own medical records. Right to be treated with dignity. Right to a second opinion. Right to know the names and roles of their care providers.</p>
          </div>
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 mb-1">Confidentiality Rules</p>
            <p className="text-xs text-purple-600"><strong>Minimum necessary:</strong> Only access/share the minimum information needed for your role. <strong>Need to know:</strong> Don't discuss patients with colleagues who are not involved in their care. <strong>Social media:</strong> Never post identifiable patient information, even without names — details can be identifying. <strong>Elevator rule:</strong> Don't discuss patients in public spaces.</p>
          </div>
        </div>
        <CognitiveCard
          type="warning"
          title={t("data.pre_nursing_ethics_legal.mandatoryReportingExceptions")}
          content={mandatoryReporting}
        />
      </MicroLesson>

      <MicroLesson title="Scope of Practice & Professional Standards" subtitle="Practicing within legal boundaries" icon={<Scale className="w-5 h-5" />}>
        <EditableModuleText sectionKey="ethics-scope-content" defaultText="Every regulated healthcare professional has a defined scope of practice — the range of activities, procedures, and processes that a regulated healthcare professional is legally authorized to perform based on their education, competency, and registration/licensure. Practicing outside scope of practice is illegal and creates liability." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
            <p className="text-xs font-semibold text-teal-700 mb-1">Key Legal Concepts</p>
            <p className="text-xs text-teal-600"><strong>Negligence:</strong> Failure to provide care that a reasonable nurse would provide under similar circumstances. Requires four elements: duty, breach of duty, causation, and damages. <strong>Malpractice:</strong> Professional negligence — negligence committed by a professional in the course of their professional duties. <strong>Abandonment:</strong> Terminating the provider-patient relationship without ensuring continuity of care.</p>
          </div>
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
            <p className="text-xs font-semibold text-indigo-700 mb-1">Delegation Principles</p>
            <p className="text-xs text-indigo-600">The Five Rights of Delegation: Right <strong>task</strong> (appropriate to delegate), Right <strong>circumstance</strong> (stable patient, predictable outcome), Right <strong>person</strong> (competent for the task), Right <strong>direction/communication</strong> (clear instructions), Right <strong>supervision/evaluation</strong> (follow up on outcomes). The delegating nurse retains accountability.</p>
          </div>
        </div>
      </MicroLesson>

      <MatchingExercise
        title={t("data.pre_nursing_ethics_legal.matchTheEthicsLegalConcept")}
        pairs={[
          { term: "Autonomy", definition: "Patient's right to self-determination" },
          { term: "Beneficence", definition: "Obligation to act in patient's best interest" },
          { term: "Nonmaleficence", definition: "Obligation to do no harm" },
          { term: "Justice", definition: "Fair distribution of resources" },
          { term: "Informed consent", definition: "Process ensuring patient understands treatment" },
          { term: "Negligence", definition: "Failure to meet standard of care" },
        ]}
      />

      <SelfCheckQuiz
        title={t("data.pre_nursing_ethics_legal.ethicsLegalFoundationsQuiz")}
        questions={[
          {
            id: "el1",
            question: "A competent adult patient refuses life-saving treatment. Which ethical principle supports their right to refuse?",
            options: ["Beneficence", "Justice", "Autonomy", "Nonmaleficence"],
            correctIndex: 2,
            rationale: "Autonomy — the right to self-determination — gives competent adults the legal and ethical right to refuse any treatment, even if refusal leads to death. Competence and voluntary decision-making are the key requirements.",
          },
          {
            id: "el2",
            question: "Who is responsible for explaining a surgical procedure and its risks to the patient?",
            options: ["The nurse caring for the patient", "The surgeon performing the procedure", "The unit clerk", "Any available physician"],
            correctIndex: 1,
            rationale: "The person performing the procedure (surgeon/physician) is responsible for the informed consent discussion. The nurse may witness the signature and advocate for the patient if they appear uninformed, but the nurse does not obtain surgical consent.",
          },
          {
            id: "el3",
            question: "A nurse notices a colleague accessing the medical record of a celebrity patient who is not in their care. This is a violation of:",
            options: ["Beneficence", "Scope of practice", "Minimum necessary standard / Confidentiality", "Delegation principles"],
            correctIndex: 2,
            rationale: "Accessing a patient's record when you are not involved in their care violates the minimum necessary standard — only access the information needed for your role. This is a confidentiality violation regardless of intent.",
          },
          {
            id: "el4",
            question: "The four elements required to prove negligence are:",
            options: ["Intent, action, harm, reporting", "Duty, breach, causation, damages", "Consent, disclosure, competence, voluntariness", "Assessment, planning, implementation, evaluation"],
            correctIndex: 1,
            rationale: "To prove negligence: (1) the provider owed a duty of care, (2) that duty was breached, (3) the breach caused harm, and (4) actual damages (injury) resulted.",
          },
          {
            id: "el5",
            question: "Which situation REQUIRES breaking patient confidentiality?",
            options: ["A family member asks about the patient's diagnosis", "A coworker is curious about the patient's condition", "The nurse suspects child abuse", "The patient's employer calls for health information"],
            correctIndex: 2,
            rationale: "Suspected child abuse is a mandatory reporting situation that overrides confidentiality. The nurse is legally required to report to the appropriate authorities. The other situations do not justify breaking confidentiality.",
          },
          {
            id: "el6",
            question: "Emergency consent applies when:",
            options: ["The patient is anxious about signing forms", "The family requests the procedure", "Delay would cause death or serious harm and consent cannot be obtained", "The patient speaks a different language"],
            correctIndex: 2,
            rationale: "Emergency consent (implied consent) applies when there is an immediate threat to life or health AND the patient is unable to give consent AND no surrogate is immediately available. It does not apply to language barriers or patient anxiety.",
          },
          {
            id: "el7",
            question: "When delegating a task, the nurse retains:",
            options: ["No responsibility once delegated", "Accountability for the outcome", "Only responsibility for documentation", "Authority over the delegate's license"],
            correctIndex: 1,
            rationale: "The delegating nurse retains accountability for the delegation decision and the patient outcome. Delegation transfers the performance of the task but not the accountability for ensuring it was appropriate and properly completed.",
          },
          {
            id: "el8",
            question: "Which ethical principle requires that scarce resources such as ventilators during a pandemic be distributed fairly?",
            options: ["Autonomy", "Beneficence", "Nonmaleficence", "Justice"],
            correctIndex: 3,
            rationale: "Justice is the ethical principle concerned with fair and equitable distribution of resources. During scarcity, triage decisions must be guided by justice to ensure resources reach those who will benefit most, without discrimination.",
          },
          {
            id: "el9",
            question: "A patient signs a consent form but later tells the nurse they did not understand the procedure. The nurse should:",
            options: ["Proceed because the form is signed", "Explain the procedure themselves", "Notify the provider so the consent discussion can be repeated", "Ask a family member to explain"],
            correctIndex: 2,
            rationale: "Informed consent requires comprehension. If the patient indicates they do not understand, the nurse must advocate for them by notifying the provider to repeat the consent discussion. The signed form alone does not constitute valid consent.",
          },
          {
            id: "el10",
            question: "HIPAA's 'minimum necessary' standard means:",
            options: ["Use the smallest dose of medication possible", "Share only the patient information needed for the specific purpose", "Limit the number of nurses on a unit", "Provide the minimum treatment required by law"],
            correctIndex: 1,
            rationale: "The minimum necessary standard requires that healthcare workers only access and share the minimum amount of protected health information (PHI) needed to accomplish the intended purpose of the use or disclosure.",
          },
          {
            id: "el11",
            question: "A nurse posts a photo of a patient's unique wound on social media without identifying the patient by name. This is:",
            options: ["Acceptable because no name was used", "A HIPAA violation because details can be identifying", "Only a violation if someone recognizes the patient", "Permitted if used for educational purposes"],
            correctIndex: 1,
            rationale: "Protected health information includes any information that could reasonably be used to identify a patient. Unique clinical details, location, timing, and images can all be identifying even without a name. This is a confidentiality violation.",
          },
          {
            id: "el12",
            question: "Which of the following is an example of malpractice?",
            options: ["A nurse trips in the hallway and falls", "A nurse administers the wrong medication due to failure to check the MAR", "A patient refuses treatment and has a poor outcome", "A nurse follows the physician's correct order"],
            correctIndex: 1,
            rationale: "Malpractice is professional negligence — failing to meet the standard of care in the course of professional duties. Administering the wrong medication because the nurse did not verify the MAR is a breach of the standard of care that constitutes malpractice.",
          },
          {
            id: "el13",
            question: "An advance directive allows a patient to:",
            options: ["Override a physician's medical license", "Specify healthcare decisions in advance in case they lose decision-making capacity", "Refuse to pay for medical treatment", "Delegate their nursing care to a family member"],
            correctIndex: 1,
            rationale: "An advance directive is a legal document that allows a competent adult to specify their healthcare wishes in advance, to be followed if they become unable to make or communicate decisions. Examples include living wills and durable power of attorney for healthcare.",
          },
          {
            id: "el14",
            question: "Which is NOT one of the Five Rights of Delegation?",
            options: ["Right task", "Right circumstance", "Right documentation", "Right supervision"],
            correctIndex: 2,
            rationale: "The Five Rights of Delegation are: Right task, Right circumstance, Right person, Right direction/communication, and Right supervision/evaluation. 'Right documentation' is not one of the five rights, although documentation remains important in nursing practice.",
          },
          {
            id: "el15",
            question: "Patient abandonment occurs when a nurse:",
            options: ["Takes a scheduled break while another nurse covers", "Transfers care properly at shift change", "Leaves the unit without ensuring continuity of care for assigned patients", "Calls in sick before the shift starts"],
            correctIndex: 2,
            rationale: "Abandonment occurs when a nurse who has accepted a patient assignment terminates the nurse-patient relationship without ensuring another qualified provider assumes care. Proper handoffs and calling in before a shift begins are not abandonment.",
          },
          {
            id: "el16",
            question: "A 16-year-old patient needs surgery. Who provides informed consent?",
            options: ["The patient alone", "The parent or legal guardian", "Any adult family member", "The attending nurse"],
            correctIndex: 1,
            rationale: "Minors generally cannot provide informed consent. A parent or legal guardian must give consent for treatment of a minor, except in specific situations such as emancipated minors or emergencies. Some jurisdictions allow mature minor exceptions for certain treatments.",
          },
          {
            id: "el17",
            question: "The principle of beneficence is BEST demonstrated when a nurse:",
            options: ["Respects a patient's refusal of medication", "Advocates for a patient to receive pain management", "Reports a medication error to the supervisor", "Distributes supplies equally among patients"],
            correctIndex: 1,
            rationale: "Beneficence means acting in the patient's best interest — actively promoting their well-being. Advocating for adequate pain management directly benefits the patient. Respecting refusal is autonomy, reporting errors relates to nonmaleficence, and equal distribution relates to justice.",
          },
          {
            id: "el18",
            question: "A nurse suspects that an elderly patient is being financially exploited by a family member. The nurse is legally obligated to:",
            options: ["Discuss concerns with the family member first", "Document suspicions but take no further action", "Report the suspected abuse to the appropriate authorities", "Wait for physical evidence of abuse before reporting"],
            correctIndex: 2,
            rationale: "Suspected elder abuse — including financial exploitation — is a mandatory reporting situation. Healthcare providers are legally required to report to the appropriate authorities (e.g., Adult Protective Services). Physical proof is not required; reasonable suspicion is sufficient.",
          },
          {
            id: "el19",
            question: "Scope of practice for a nurse is determined by:",
            options: ["The nurse's personal comfort level", "The employing hospital's policy alone", "Legislation, regulatory body standards, and the nurse's education and competency", "The attending physician's preferences"],
            correctIndex: 2,
            rationale: "Scope of practice is defined by nursing legislation (Nurse Practice Act), regulatory body standards (College of Nurses), institutional policies, and the individual nurse's education, training, and demonstrated competency. It is not determined by personal comfort or physician preference alone.",
          },
          {
            id: "el20",
            question: "Therapeutic privilege — withholding information from a patient — is ethically justified when:",
            options: ["The family requests it", "The nurse thinks the information will upset the patient", "Disclosure would cause serious, documented psychological harm to the patient", "The physician prefers not to share bad news"],
            correctIndex: 2,
            rationale: "Therapeutic privilege is a rare and controversial exception to full disclosure in informed consent. It applies only when there is clear evidence that disclosure would cause serious psychological harm — not simply distress. It must never be used as a convenience or at the request of others.",
          },
        ]}
      />
    </div>
  );
}
