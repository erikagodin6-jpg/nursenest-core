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
import { ShieldAlert, Brain, MessageSquare, AlertTriangle } from "lucide-react";

export function HumanFactorsModule() {
  const { t } = useI18n();
  const swissCheeseContent = useEditableText("hf-swiss-cheese-content", "The Swiss Cheese Model (James Reason) explains that healthcare errors rarely result from a single mistake. Each layer of defense (policies, training, checklists, technology, supervision) has 'holes' — weaknesses that can be latent or active. An adverse event occurs only when the holes in multiple layers align, allowing a hazard to pass through every defense. This means preventing errors requires strengthening multiple layers simultaneously rather than blaming individuals.");
  const justCultureContent = useEditableText("hf-just-culture-content", "A just culture distinguishes between human error (inadvertent — support and coach), at-risk behavior (conscious choice due to drift from best practice — coach and remove incentives for risk), and reckless behavior (conscious disregard of substantial risk — disciplinary action). This replaces blame culture, where all errors are punished regardless of intent, which discourages reporting and prevents organizational learning. In a just culture, reporting is encouraged because the focus is on fixing systems, not punishing people.");
  const sbarContent = useEditableText("hf-sbar-content", "SBAR is a structured communication framework: Situation (What is happening right now?), Background (What is the clinical context?), Assessment (What do I think the problem is?), Recommendation (What do I think should be done?). I-PASS is used for handoffs: Illness severity, Patient summary, Action list, Situation awareness and contingency planning, Synthesis by receiver. Structured communication prevents information loss during transitions of care — a leading cause of preventable adverse events.");

  return (
    <div className="space-y-10" data-testid="module-human-factors">
      <div>
        <EditableModuleText sectionKey="hf-title" defaultText="Human Factors & Patient Safety" as="h2" className="text-2xl font-bold text-gray-900 mb-2" />
        <EditableModuleText sectionKey="hf-desc" defaultText="Understand how system design, cognitive biases, fatigue, and communication failures contribute to healthcare errors. Learn frameworks for building safer healthcare systems and a culture of safety." as="p" className="text-gray-600" multiline />
      </div>

      <MicroLesson title="The Swiss Cheese Model of Errors" subtitle="Understanding system-level failure" icon={<ShieldAlert className="w-5 h-5" />}>
        <EditableModuleText sectionKey="hf-swiss-intro" defaultText="Most healthcare errors are not caused by incompetent individuals — they result from system failures. Understanding error theory helps nurses recognize vulnerabilities and advocate for system improvements that protect patients." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
            <p className="text-xs font-semibold text-red-700 mb-1">Active Errors</p>
            <p className="text-xs text-red-600">Errors committed by the person at the 'sharp end' — the nurse, physician, or technician directly interacting with the patient. These are immediately apparent: wrong medication administered, incorrect dose calculated, procedure performed on wrong site. Active errors are the visible tip of the iceberg.</p>
          </div>
          <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-100">
            <p className="text-xs font-semibold text-orange-700 mb-1">Latent Errors</p>
            <p className="text-xs text-orange-600">Hidden system conditions that exist long before an incident: understaffing, poor equipment design, inadequate training, confusing medication labeling, workaround culture, lack of standardized protocols. Latent errors are created by organizational decisions and lie dormant until they combine with active errors to cause harm. They are the 'holes' in the Swiss cheese.</p>
          </div>
        </div>
        <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 mt-3">
          <p className="text-xs font-semibold text-blue-700 mb-1">Root Cause Analysis (RCA)</p>
          <p className="text-xs text-blue-600">RCA is a systematic process for investigating adverse events. Instead of asking 'Who made the error?', RCA asks 'WHY did the error occur?' and 'What system factors contributed?' The goal is to identify and fix latent conditions. The '5 Whys' technique drills down from the surface event to underlying causes. Example: Wrong medication given → Why? → Look-alike packaging → Why not caught? → No independent double-check required → Why? → Policy gap → System fix: implement barcode scanning.</p>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_human_factors.theSwissCheeseModel")}
          content={swissCheeseContent}
        />
      </MicroLesson>

      <MicroLesson title="Cognitive Biases in Healthcare" subtitle="How thinking shortcuts lead to errors" icon={<Brain className="w-5 h-5" />}>
        <EditableModuleText sectionKey="hf-bias-intro" defaultText="Cognitive biases are mental shortcuts (heuristics) that normally help us make quick decisions but can lead to systematic errors in clinical reasoning. Recognizing these biases in yourself and colleagues is a critical patient safety skill." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <ProgressiveReveal
          title={t("data.pre_nursing_human_factors.commonCognitiveBiasesInClinical")}
          cards={[
            {
              id: "hf-confirm",
              title: "Confirmation Bias",
              summary: "Seeking information that confirms your initial impression",
              detail: "Once you form an initial diagnosis or impression, you tend to notice and remember evidence that supports it while ignoring or dismissing evidence that contradicts it. Example: A nurse believes a patient is drug-seeking and interprets all pain behaviors through that lens, missing a genuine surgical complication. Mitigation: Actively seek disconfirming evidence. Ask yourself, 'What would prove me wrong?'",
            },
            {
              id: "hf-anchor",
              title: "Anchoring Bias",
              summary: "Over-relying on the first piece of information received",
              detail: "The first piece of information you receive about a patient disproportionately influences your thinking, even when subsequent information contradicts it. Example: The ED report says 'anxiety attack,' so the receiving nurse interprets tachycardia and diaphoresis as anxiety rather than considering MI. Mitigation: Perform your own independent assessment rather than anchoring to the previous provider's impression.",
            },
            {
              id: "hf-avail",
              title: "Availability Bias",
              summary: "Overestimating probability of events that come easily to mind",
              detail: "Recent or dramatic experiences disproportionately influence clinical judgment. If a nurse recently cared for a patient with pulmonary embolism, they may over-diagnose PE in subsequent patients with chest pain — or conversely, if they've never seen a rare condition, they may fail to consider it. Mitigation: Use systematic assessment frameworks rather than relying on memory-based pattern matching.",
            },
            {
              id: "hf-premature",
              title: "Premature Closure",
              summary: "Accepting a diagnosis before fully verifying it",
              detail: "Stopping the diagnostic process once a plausible explanation is found, without considering alternatives or completing the assessment. Example: A patient presents with chest pain and has a history of GERD — the nurse assumes it's GERD without completing a cardiac workup. Premature closure is the most common cognitive bias in diagnostic errors. Mitigation: Always ask, 'What else could this be?'",
            },
          ]}
        />
      </MicroLesson>

      <MicroLesson title="Fatigue & Performance Degradation" subtitle="The science of human limitations" icon={<AlertTriangle className="w-5 h-5" />}>
        <EditableModuleText sectionKey="hf-fatigue-content" defaultText="Healthcare providers are human — subject to fatigue, circadian rhythm disruption, and cognitive overload. Understanding these limitations is essential for designing safe work systems and recognizing when performance is compromised." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
            <p className="text-xs font-semibold text-amber-700 mb-1">Fatigue Science</p>
            <p className="text-xs text-amber-600">After 17 hours of wakefulness, cognitive performance equals a blood alcohol level of 0.05%. After 24 hours, it equals 0.10% — above the legal driving limit. Night shift nurses experience the combined effects of sleep deprivation and circadian misalignment. Studies show error rates increase significantly after 12.5 hours on shift, with the highest risk between 3-5 AM when circadian alertness is lowest.</p>
          </div>
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 mb-1">Interruptions & Cognitive Load</p>
            <p className="text-xs text-purple-600">Nurses are interrupted an average of every 6-8 minutes during medication administration. Each interruption increases error risk by 12.7%. Cognitive load theory explains that working memory has limited capacity — when it's overwhelmed by interruptions, multitasking, and environmental noise, critical information is lost. Strategies: Wear 'Do Not Disturb' vests during med passes, use checklists to prevent omissions, and minimize environmental distractions.</p>
          </div>
          <div className="p-4 bg-green-50/60 rounded-xl border border-green-100">
            <p className="text-xs font-semibold text-green-700 mb-1">High-Reliability Organizations (HROs)</p>
            <p className="text-xs text-green-600">HROs (aviation, nuclear power, healthcare leaders) achieve extraordinary safety through five principles: preoccupation with failure (treat near-misses as system weaknesses), reluctance to simplify (resist easy explanations), sensitivity to operations (awareness of frontline conditions), commitment to resilience (ability to recover from errors), and deference to expertise (decisions made by the most knowledgeable person, regardless of hierarchy).</p>
          </div>
        </div>
      </MicroLesson>

      <MicroLesson title="Handoff Communication & Safety Culture" subtitle="SBAR, I-PASS, and just culture" icon={<MessageSquare className="w-5 h-5" />}>
        <EditableModuleText sectionKey="hf-communication-content" defaultText="Communication failures are the leading root cause of sentinel events in healthcare. Structured communication tools standardize information transfer, reducing the risk of critical details being lost during handoffs, escalations, and team communication." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-2">SBAR Framework</p>
            <div className="space-y-1">
              <p className="text-xs text-blue-600"><strong>S — Situation:</strong> "I'm calling about Mr. Jones in room 412. His BP has dropped to 80/50."</p>
              <p className="text-xs text-blue-600"><strong>B — Background:</strong> "He's 2 days post-op from a hip replacement. He's been stable until this shift."</p>
              <p className="text-xs text-blue-600"><strong>A — Assessment:</strong> "I think he may be bleeding internally. His hemoglobin was 10.2 this morning."</p>
              <p className="text-xs text-blue-600"><strong>R — Recommendation:</strong> "I'd like to get a stat CBC, type and crossmatch, and have you come assess him."</p>
            </div>
          </div>
          <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
            <p className="text-xs font-semibold text-teal-700 mb-2">I-PASS Handoff</p>
            <div className="space-y-1">
              <p className="text-xs text-teal-600"><strong>I — Illness severity:</strong> Stable, watcher, or unstable</p>
              <p className="text-xs text-teal-600"><strong>P — Patient summary:</strong> Diagnosis, pertinent history, current plan</p>
              <p className="text-xs text-teal-600"><strong>A — Action list:</strong> Pending tasks, follow-up items</p>
              <p className="text-xs text-teal-600"><strong>S — Situation awareness:</strong> What to watch for, contingency plans</p>
              <p className="text-xs text-teal-600"><strong>S — Synthesis:</strong> Receiving nurse reads back key points</p>
            </div>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_human_factors.structuredCommunication")}
          content={sbarContent}
        />
        <CognitiveCard
          type="warning"
          title={t("data.pre_nursing_human_factors.justCultureVsBlameCulture")}
          content={justCultureContent}
        />
      </MicroLesson>

      <MatchingExercise
        title={t("data.pre_nursing_human_factors.matchTheHumanFactorsConcept")}
        pairs={[
          { id: "hf-m1", term: "Swiss cheese model", definition: "Errors occur when holes in multiple defense layers align" },
          { id: "hf-m2", term: "Confirmation bias", definition: "Seeking evidence that supports your initial impression" },
          { id: "hf-m3", term: "Latent error", definition: "Hidden system condition existing before an incident" },
          { id: "hf-m4", term: "SBAR", definition: "Situation, Background, Assessment, Recommendation" },
          { id: "hf-m5", term: "Just culture", definition: "Distinguishes human error from reckless behavior" },
          { id: "hf-m6", term: "Premature closure", definition: "Accepting a diagnosis without fully verifying it" },
        ]}
      />

      <SelfCheckQuiz
        title={t("data.pre_nursing_human_factors.humanFactorsPatientSafetyQuiz")}
        questions={[
          {
            id: "hf1",
            question: "The Swiss Cheese Model of error theory was developed by:",
            options: ["Florence Nightingale", "James Reason", "Abraham Maslow", "Virginia Henderson"],
            correctIndex: 1,
            rationale: "James Reason developed the Swiss Cheese Model, which explains that adverse events occur when weaknesses in multiple layers of defense align, allowing a hazard to reach the patient.",
          },
          {
            id: "hf2",
            question: "A nurse administers the wrong medication because the packaging looks identical to another drug. This is an example of:",
            options: ["Active error only", "Latent error only", "Both active and latent errors", "Neither — it is expected practice"],
            correctIndex: 2,
            rationale: "The nurse committed an active error (administering the wrong drug), but a latent error (confusing look-alike packaging) created the condition for the mistake. Fixing the latent error (changing packaging) is more effective than punishing the nurse.",
          },
          {
            id: "hf3",
            question: "Confirmation bias in nursing practice means:",
            options: ["Confirming medication orders before administration", "Seeking information that supports your initial clinical impression while ignoring contradictory data", "Getting a second opinion on a diagnosis", "Confirming patient identity with two identifiers"],
            correctIndex: 1,
            rationale: "Confirmation bias is the tendency to seek, notice, and remember information that confirms what you already believe while ignoring evidence that contradicts it. This can delay correct diagnosis and appropriate treatment.",
          },
          {
            id: "hf4",
            question: "After 17 hours of continuous wakefulness, cognitive performance is equivalent to a blood alcohol level of approximately:",
            options: ["0.01%", "0.05%", "0.10%", "0.15%"],
            correctIndex: 1,
            rationale: "Research shows that 17 hours of wakefulness produces cognitive impairment equivalent to a 0.05% blood alcohol level. After 24 hours, it rises to approximately 0.10%, exceeding legal driving limits in most jurisdictions.",
          },
          {
            id: "hf5",
            question: "The 'S' in SBAR stands for:",
            options: ["Safety", "Situation", "Summary", "Systems"],
            correctIndex: 1,
            rationale: "In SBAR, S stands for Situation — a concise statement of what is happening with the patient right now. This immediately orients the listener to the reason for communication.",
          },
          {
            id: "hf6",
            question: "In a just culture, a nurse who makes an inadvertent error (human error) should be:",
            options: ["Terminated immediately", "Supported and coached — the system should be examined", "Transferred to a different unit", "Required to retake nursing school courses"],
            correctIndex: 1,
            rationale: "A just culture recognizes that human error is inevitable and should be met with support, coaching, and system improvement rather than punishment. Only reckless behavior (conscious disregard of substantial risk) warrants disciplinary action.",
          },
          {
            id: "hf7",
            question: "Anchoring bias occurs when a nurse:",
            options: ["Uses an anchor device for patient safety", "Over-relies on the first piece of information received about a patient", "Anchors their practice in evidence-based guidelines", "Secures the patient in bed to prevent falls"],
            correctIndex: 1,
            rationale: "Anchoring bias occurs when the first piece of information (e.g., a previous provider's diagnosis) disproportionately influences subsequent clinical judgment, even when new data contradicts it.",
          },
          {
            id: "hf8",
            question: "Root cause analysis (RCA) primarily asks:",
            options: ["Who made the error?", "Why did the error occur and what system factors contributed?", "How much did the error cost?", "When was the error first documented?"],
            correctIndex: 1,
            rationale: "RCA focuses on identifying WHY the error occurred and what latent system conditions contributed, rather than blaming individuals. The goal is to implement system-level fixes that prevent recurrence.",
          },
          {
            id: "hf9",
            question: "A nurse recently cared for a patient who had a pulmonary embolism and now suspects PE in every patient with shortness of breath. This is an example of:",
            options: ["Clinical expertise", "Availability bias", "Anchoring bias", "Confirmation bias"],
            correctIndex: 1,
            rationale: "Availability bias occurs when recent or dramatic experiences disproportionately influence judgment. Because PE is vivid in the nurse's recent memory, it becomes the most 'available' explanation for symptoms.",
          },
          {
            id: "hf10",
            question: "Each interruption during medication administration increases the risk of error by approximately:",
            options: ["1%", "5%", "12.7%", "25%"],
            correctIndex: 2,
            rationale: "Research shows that each interruption during medication administration increases error risk by approximately 12.7%. This is why many facilities implement 'no interruption zones' and distraction-free protocols during medication passes.",
          },
          {
            id: "hf11",
            question: "The I-PASS handoff framework includes all of the following EXCEPT:",
            options: ["Illness severity", "Patient summary", "Action list", "Differential diagnosis"],
            correctIndex: 3,
            rationale: "I-PASS includes Illness severity, Patient summary, Action list, Situation awareness and contingency planning, and Synthesis by receiver. Differential diagnosis is not a specific component of I-PASS.",
          },
          {
            id: "hf12",
            question: "A latent error differs from an active error because latent errors:",
            options: ["Are committed by nurses at the bedside", "Exist in the system before any incident occurs", "Are immediately visible when they happen", "Only occur during night shifts"],
            correctIndex: 1,
            rationale: "Latent errors are hidden system conditions — such as poor design, inadequate staffing, or lack of protocols — that exist before any incident. They create the conditions in which active (immediate, visible) errors are more likely to occur.",
          },
          {
            id: "hf13",
            question: "Premature closure is the most common cognitive bias in:",
            options: ["Medication administration errors", "Diagnostic errors", "Documentation errors", "Communication errors"],
            correctIndex: 1,
            rationale: "Premature closure — accepting a diagnosis before fully verifying it — is the most commonly identified cognitive bias in diagnostic error. It occurs when clinicians stop considering alternatives once a plausible explanation is found.",
          },
          {
            id: "hf14",
            question: "High-reliability organizations (HROs) achieve safety through all of the following EXCEPT:",
            options: ["Preoccupation with failure", "Deference to expertise regardless of hierarchy", "Blame culture for all errors", "Sensitivity to operations"],
            correctIndex: 2,
            rationale: "HROs use a just culture, not a blame culture. The five HRO principles are: preoccupation with failure, reluctance to simplify, sensitivity to operations, commitment to resilience, and deference to expertise.",
          },
          {
            id: "hf15",
            question: "A nurse notices that a near-miss occurred when two similar-sounding medications were confused. In a just culture, the BEST response is to:",
            options: ["Ignore it because no harm occurred", "Punish the nurse involved", "Report it so the system can be improved", "Wait to see if it happens again"],
            correctIndex: 2,
            rationale: "Near-misses are valuable learning opportunities. In a just culture, reporting is encouraged because near-misses reveal system vulnerabilities (latent errors) that can be fixed before they cause actual harm.",
          },
          {
            id: "hf16",
            question: "The period of highest error risk during a 12-hour night shift is typically:",
            options: ["8 PM - 10 PM", "10 PM - 12 AM", "3 AM - 5 AM", "6 AM - 7 AM"],
            correctIndex: 2,
            rationale: "The circadian low point (nadir) occurs between approximately 3-5 AM, when core body temperature drops and alertness is at its lowest. This coincides with the combined effects of sleep deprivation and circadian misalignment.",
          },
          {
            id: "hf17",
            question: "The '5 Whys' technique is used in:",
            options: ["Patient education", "Medication reconciliation", "Root cause analysis", "Discharge planning"],
            correctIndex: 2,
            rationale: "The '5 Whys' is a root cause analysis technique that drills down from the surface event to underlying causes by repeatedly asking 'Why?' The goal is to identify the root system cause rather than stopping at the immediate cause.",
          },
          {
            id: "hf18",
            question: "At-risk behavior in a just culture is defined as:",
            options: ["Intentionally harming a patient", "Making an inadvertent error", "A conscious choice to drift from best practice, often due to normalization of deviance", "Following established protocols"],
            correctIndex: 2,
            rationale: "At-risk behavior involves choosing to deviate from best practice — often because shortcuts have become normalized over time ('we've always done it this way'). The just culture response is coaching and removing incentives for the risky behavior.",
          },
          {
            id: "hf19",
            question: "Communication failures are the leading root cause of:",
            options: ["Falls", "Medication errors only", "Sentinel events", "Pressure injuries"],
            correctIndex: 2,
            rationale: "The Joint Commission has consistently identified communication failures as the leading root cause of sentinel events (unexpected occurrences resulting in death or serious harm). This is why structured tools like SBAR and I-PASS are critical.",
          },
          {
            id: "hf20",
            question: "To mitigate confirmation bias, a nurse should:",
            options: ["Trust their first instinct completely", "Actively seek evidence that could disprove their initial assessment", "Avoid forming any clinical impressions", "Only consider diagnoses they have seen before"],
            correctIndex: 1,
            rationale: "The best strategy for countering confirmation bias is deliberately seeking disconfirming evidence — asking 'What would prove me wrong?' or 'What else could this be?' This forces consideration of alternative explanations.",
          },
        ]}
      />
    </div>
  );
}