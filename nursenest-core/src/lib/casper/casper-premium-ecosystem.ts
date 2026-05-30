export type CasperScenarioCategory =
  | "ethics"
  | "professionalism"
  | "conflict"
  | "patient_advocacy"
  | "equity"
  | "bias_awareness"
  | "communication"
  | "interprofessional"
  | "confidentiality"
  | "patient_safety";

export type CasperScoreDimension =
  | "empathy"
  | "professionalism"
  | "stakeholder_awareness"
  | "communication"
  | "reasoning"
  | "ethics"
  | "conflict_resolution"
  | "bias_awareness"
  | "equity"
  | "confidentiality"
  | "patient_safety";

export type CasperResponseBand = "excellent" | "average" | "poor";

export type CasperResponseExample = {
  band: CasperResponseBand;
  title: string;
  response: string;
  whyItPerformsThisWay: string;
  scoringExplanation: string;
};

export type CasperScenario = {
  id: string;
  category: CasperScenarioCategory;
  title: string;
  setting: string;
  prompt: string;
  timedPromptSeconds: number;
  reflectionPrompts: string[];
  stakeholderCues: string[];
  scoringDimensions: CasperScoreDimension[];
  communicationFramework: string[];
  videoCoaching: string[];
  examples: CasperResponseExample[];
};

export type CasperDimensionScore = {
  dimension: CasperScoreDimension;
  score: number;
  feedback: string;
};

export type CasperStructuredReview = {
  overallScore: number;
  level: "Developing" | "Competent" | "Strong";
  dimensionScores: CasperDimensionScore[];
  strengths: string[];
  nextSteps: string[];
};

const dimensionLabels: Record<CasperScoreDimension, string> = {
  empathy: "Empathy",
  professionalism: "Professionalism",
  stakeholder_awareness: "Stakeholder Awareness",
  communication: "Communication",
  reasoning: "Reasoning Quality",
  ethics: "Ethics",
  conflict_resolution: "Conflict Resolution",
  bias_awareness: "Bias Awareness",
  equity: "Equity",
  confidentiality: "Confidentiality",
  patient_safety: "Patient Safety",
};

export function formatCasperDimensionLabel(dimension: CasperScoreDimension): string {
  return dimensionLabels[dimension];
}

const strongResponse: Pick<CasperResponseExample, "band" | "title"> = {
  band: "excellent",
  title: "Excellent response",
};

const averageResponse: Pick<CasperResponseExample, "band" | "title"> = {
  band: "average",
  title: "Average response",
};

const poorResponse: Pick<CasperResponseExample, "band" | "title"> = {
  band: "poor",
  title: "Poor response",
};

export const CASPER_SCENARIOS: CasperScenario[] = [
  {
    id: "casper-ethics-confidential-disclosure",
    category: "ethics",
    title: "Confidential disclosure from a classmate",
    setting: "Nursing-school interview scenario",
    prompt:
      "A classmate tells you they copied part of a reflective assignment because they were overwhelmed caring for a family member. They ask you not to tell anyone. What would you do?",
    timedPromptSeconds: 300,
    reflectionPrompts: [
      "What duties do you have to the classmate, the school, and the profession?",
      "How can you respond without shaming the classmate?",
      "What information would you need before taking formal action?",
    ],
    stakeholderCues: ["classmate under stress", "academic integrity", "future patient trust", "school policy"],
    scoringDimensions: ["empathy", "ethics", "professionalism", "communication", "reasoning"],
    communicationFramework: ["Acknowledge stress", "Clarify facts", "Encourage self-reporting", "Use policy-based support"],
    videoCoaching: [
      "Use a calm pace and avoid sounding punitive.",
      "Name both compassion and integrity.",
      "End with a concrete next step, not a vague promise.",
    ],
    examples: [
      {
        ...strongResponse,
        response:
          "I would first acknowledge that the classmate is under real pressure and thank them for trusting me. I would explain that copying work creates an academic-integrity issue that could affect professional trust, so I could not simply ignore it. I would encourage them to contact the instructor or advisor themselves, ask about compassionate supports, and be honest before the issue escalates. If they refused and the policy required reporting, I would follow the school process while still offering support.",
        whyItPerformsThisWay:
          "It balances empathy with accountability, identifies the professional principle being tested, and uses a policy-based pathway rather than personal judgment.",
        scoringExplanation:
          "High scores for ethics, professionalism, empathy, and reasoning because the answer protects integrity while preserving the classmate's dignity.",
      },
      {
        ...averageResponse,
        response:
          "I would tell the classmate that copying is wrong and that they should talk to the instructor. I would try to support them because they have family stress, but I would also remind them that nursing requires honesty.",
        whyItPerformsThisWay:
          "It identifies the main issue, but the plan is underdeveloped and does not clearly address what happens if the classmate refuses to act.",
        scoringExplanation:
          "Moderate score because the answer has the right direction but lacks stakeholder detail, policy reasoning, and a complete next step.",
      },
      {
        ...poorResponse,
        response:
          "I would not get involved because it is their assignment and they trusted me. Everyone has difficult times, so I would keep it private.",
        whyItPerformsThisWay:
          "It centers loyalty over professional integrity and ignores the broader impact on trust and fairness.",
        scoringExplanation:
          "Low ethics and professionalism because the response avoids the core responsibility being tested.",
      },
    ],
  },
  {
    id: "casper-professionalism-late-team-member",
    category: "professionalism",
    title: "Repeatedly late team member",
    setting: "Interprofessional group project",
    prompt:
      "A group member repeatedly arrives late and misses agreed tasks. The final presentation is approaching, and the team is frustrated. How would you handle this?",
    timedPromptSeconds: 300,
    reflectionPrompts: [
      "What assumptions should you avoid?",
      "How can you preserve team functioning?",
      "When should escalation occur?",
    ],
    stakeholderCues: ["team fairness", "unknown barriers", "deadline risk", "professional communication"],
    scoringDimensions: ["professionalism", "communication", "conflict_resolution", "empathy", "reasoning"],
    communicationFramework: ["Private check-in", "Specific observations", "Ask about barriers", "Set accountable plan"],
    videoCoaching: [
      "Use 'I noticed' language instead of blame.",
      "Avoid sarcasm or public embarrassment.",
      "State the shared goal and timeline clearly.",
    ],
    examples: [
      {
        ...strongResponse,
        response:
          "I would speak with the team member privately and describe the pattern specifically: missed meetings and unfinished tasks. I would ask whether there are barriers we do not know about and offer to adjust roles if needed, while being clear that the group needs reliable follow-through. I would document a revised task plan with deadlines. If the pattern continued, I would involve the facilitator because the team and assessment are affected.",
        whyItPerformsThisWay:
          "It avoids assumptions, uses direct communication, supports the person, and protects the team's responsibilities.",
        scoringExplanation:
          "Strong professionalism and conflict resolution because it combines private dialogue, accountability, and proportionate escalation.",
      },
      {
        ...averageResponse,
        response:
          "I would ask them to be on time and complete their part. If they did not improve, I would tell the instructor because the project matters.",
        whyItPerformsThisWay:
          "It has accountability but limited empathy and no clear plan for understanding barriers or redistributing work.",
        scoringExplanation:
          "Moderate score for recognizing the problem, lower score for communication depth and stakeholder awareness.",
      },
      {
        ...poorResponse,
        response:
          "I would remove their name from the project because they did not do the work.",
        whyItPerformsThisWay:
          "It jumps to punishment without communication, context, or a fair process.",
        scoringExplanation:
          "Low professionalism because the response escalates too quickly and risks unfairness.",
      },
    ],
  },
  {
    id: "casper-patient-advocacy-dismissed-pain",
    category: "patient_advocacy",
    title: "Patient pain is being dismissed",
    setting: "Clinical observation placement",
    prompt:
      "During a placement, a patient says their pain is severe, but a staff member responds, 'They always exaggerate.' You are a student observing the interaction. What would you do?",
    timedPromptSeconds: 300,
    reflectionPrompts: [
      "How can you advocate while respecting your student role?",
      "What immediate patient need should be addressed?",
      "How should you handle the staff member's comment?",
    ],
    stakeholderCues: ["patient dignity", "student scope", "pain reassessment", "bias risk"],
    scoringDimensions: ["empathy", "patient_safety" as CasperScoreDimension, "communication", "professionalism"].filter(
      (d): d is CasperScoreDimension => d !== "patient_safety",
    ),
    communicationFramework: ["Validate patient", "Ask for reassessment", "Escalate through preceptor", "Reflect on bias"],
    videoCoaching: [
      "Keep tone respectful toward staff while centering the patient.",
      "Use concrete language: pain score, location, change, request for reassessment.",
      "Avoid accusing; focus on patient safety and dignity.",
    ],
    examples: [
      {
        ...strongResponse,
        response:
          "I would acknowledge the patient's pain and ask clarifying questions within my role, such as location, severity, and whether it has changed. I would then speak to my preceptor or the assigned nurse and say the patient is reporting severe pain and may need reassessment. I would avoid confronting the staff member publicly, but I would later discuss the dismissive comment with my preceptor because it may reflect bias and could affect patient care.",
        whyItPerformsThisWay:
          "It advocates for the patient, respects student scope, and addresses the professionalism concern through an appropriate channel.",
        scoringExplanation:
          "High empathy, communication, and professionalism because the answer protects the patient without overstepping.",
      },
      {
        ...averageResponse,
        response:
          "I would tell the nurse the patient is still in pain and ask if someone can check on them. I would not want the patient to feel ignored.",
        whyItPerformsThisWay:
          "It supports reassessment but does not address the dismissive comment or bias risk.",
        scoringExplanation:
          "Moderate score because patient advocacy is present but professional reflection is incomplete.",
      },
      {
        ...poorResponse,
        response:
          "I would tell the patient that the staff are busy and that they should wait.",
        whyItPerformsThisWay:
          "It dismisses the patient's concern and fails to advocate within the student role.",
        scoringExplanation:
          "Low empathy and patient advocacy because the response normalizes dismissal.",
      },
    ],
  },
  {
    id: "casper-equity-language-barrier",
    category: "equity",
    title: "Language barrier during discharge teaching",
    setting: "Hospital discharge scenario",
    prompt:
      "A patient nods during discharge teaching but later tells you quietly that they did not understand because English is not their first language. The unit is busy. What would you do?",
    timedPromptSeconds: 300,
    reflectionPrompts: [
      "What equity issue is present?",
      "What is unsafe about relying on nodding?",
      "How can you use resources appropriately?",
    ],
    stakeholderCues: ["language access", "safe discharge", "teach-back", "interpreter services"],
    scoringDimensions: ["equity", "communication", "empathy", "professionalism", "reasoning"],
    communicationFramework: ["Pause discharge teaching", "Arrange interpreter", "Use teach-back", "Document understanding"],
    videoCoaching: [
      "Avoid implying the patient caused the misunderstanding.",
      "Use plain language and emphasize safety.",
      "Mention interpreter services rather than family translation for clinical teaching.",
    ],
    examples: [
      {
        ...strongResponse,
        response:
          "I would thank the patient for telling me and reassure them that understanding discharge instructions is important for safety. I would notify the nurse or preceptor that teaching needs to be repeated with a qualified interpreter. I would use teach-back to confirm understanding and make sure key medication, follow-up, and warning-sign instructions are clear before discharge continues.",
        whyItPerformsThisWay:
          "It recognizes language access as a safety and equity issue and uses an appropriate resource instead of rushing the process.",
        scoringExplanation:
          "Strong communication, empathy, and reasoning because the answer prevents unsafe discharge and respects patient autonomy.",
      },
      {
        ...averageResponse,
        response:
          "I would explain it again more slowly and ask if they understand. If they still did not, I would ask someone for help.",
        whyItPerformsThisWay:
          "It tries to help but does not identify interpreter services or teach-back as the safer approach.",
        scoringExplanation:
          "Moderate score because communication effort is present but equity and safety reasoning are incomplete.",
      },
      {
        ...poorResponse,
        response:
          "I would ask a family member to translate quickly because the unit is busy.",
        whyItPerformsThisWay:
          "It uses an unreliable and potentially inappropriate translation pathway for clinical discharge teaching.",
        scoringExplanation:
          "Low score because it sacrifices accuracy, privacy, and equity for speed.",
      },
    ],
  },
  {
    id: "casper-bias-assumption-substance-use",
    category: "bias_awareness",
    title: "Assumptions about substance use",
    setting: "Admissions interview reflection",
    prompt:
      "A peer says a patient with a history of substance use is probably drug-seeking and should not receive pain medication. How would you respond?",
    timedPromptSeconds: 300,
    reflectionPrompts: [
      "What bias may be influencing the peer?",
      "How do you protect safety without ignoring pain?",
      "How can you respond professionally?",
    ],
    stakeholderCues: ["stigma", "pain assessment", "safety monitoring", "respectful correction"],
    scoringDimensions: ["bias_awareness", "empathy", "communication", "ethics", "reasoning"],
    communicationFramework: ["Name concern respectfully", "Return to assessment data", "Balance pain and safety", "Invite reflection"],
    videoCoaching: [
      "Avoid sounding morally superior.",
      "Use patient-centered language.",
      "State that history informs monitoring, not dismissal.",
    ],
    examples: [
      {
        ...strongResponse,
        response:
          "I would respond respectfully that a substance-use history should guide careful assessment and monitoring, not automatic disbelief. The patient's pain should still be assessed using objective findings, reported symptoms, medication history, and safety risks. I would encourage the peer to avoid labels like drug-seeking and to focus on a plan that treats pain while reducing harm.",
        whyItPerformsThisWay:
          "It identifies stigma, protects patient dignity, and balances pain management with safety.",
        scoringExplanation:
          "High bias-awareness and ethics because the answer challenges harmful assumptions without dismissing legitimate safety considerations.",
      },
      {
        ...averageResponse,
        response:
          "I would say we should not judge the patient and should assess their pain first.",
        whyItPerformsThisWay:
          "It is patient-centered but brief and does not show how safety concerns can still be managed.",
        scoringExplanation:
          "Moderate score because the core value is right, but reasoning depth is limited.",
      },
      {
        ...poorResponse,
        response:
          "I would agree because people with substance-use histories often exaggerate pain.",
        whyItPerformsThisWay:
          "It reinforces stigma and ignores individualized assessment.",
        scoringExplanation:
          "Low score because it relies on stereotype rather than evidence and patient-centered care.",
      },
    ],
  },
  {
    id: "casper-conflict-family-request",
    category: "conflict",
    title: "Family asks you to hide information",
    setting: "Clinical ethics scenario",
    prompt:
      "A patient's adult child asks you not to tell the patient about a concerning test result because it will upset them. The patient is alert and has decision-making capacity. What would you do?",
    timedPromptSeconds: 300,
    reflectionPrompts: [
      "Who has the right to information?",
      "How can you respond empathetically to the family?",
      "What team members should be involved?",
    ],
    stakeholderCues: ["patient autonomy", "family distress", "capacity", "team communication"],
    scoringDimensions: ["ethics", "empathy", "communication", "professionalism", "reasoning"],
    communicationFramework: ["Acknowledge concern", "Explain autonomy", "Involve team", "Support disclosure"],
    videoCoaching: [
      "Keep the family member's fear visible in your response.",
      "Avoid saying simply 'that's illegal' without support.",
      "Mention patient capacity and right to participate.",
    ],
    examples: [
      {
        ...strongResponse,
        response:
          "I would acknowledge that the family member is trying to protect the patient from distress. I would explain that if the patient has decision-making capacity, they have the right to receive information about their own health and participate in decisions. I would bring the concern to the nurse or physician so the team can plan a compassionate, clear conversation and support both the patient and family.",
        whyItPerformsThisWay:
          "It balances autonomy, compassion, and team-based communication.",
        scoringExplanation:
          "Strong ethics and empathy because it protects the patient's rights without dismissing the family's fear.",
      },
      {
        ...averageResponse,
        response:
          "I would tell the family that the patient needs to know and that the doctor should explain it.",
        whyItPerformsThisWay:
          "It recognizes autonomy but does not fully address family emotion or how disclosure should be supported.",
        scoringExplanation:
          "Moderate score for ethical direction, lower for communication depth.",
      },
      {
        ...poorResponse,
        response:
          "I would agree not to tell the patient because the family knows them best.",
        whyItPerformsThisWay:
          "It ignores the patient's autonomy and capacity, and it does not recognize that a capable patient should participate in decisions.",
        scoringExplanation:
          "Low ethics because it allows family preference to override the patient's right to information.",
      },
    ],
  },
  {
    id: "casper-interprofessional-medication-concern",
    category: "interprofessional",
    title: "Concern about a medication order",
    setting: "Interprofessional communication scenario",
    prompt:
      "You notice a medication dose appears much higher than expected during a learning simulation. A senior team member says, 'Just give it; we are behind.' How would you respond?",
    timedPromptSeconds: 300,
    reflectionPrompts: [
      "How do you raise concern despite hierarchy?",
      "What language supports safety?",
      "How can you avoid personal blame?",
    ],
    stakeholderCues: ["medication safety", "hierarchy", "closed-loop communication", "patient harm prevention"],
    scoringDimensions: ["patient_safety", "communication", "professionalism", "reasoning", "ethics"],
    communicationFramework: ["Pause", "State concern", "Use check-back", "Escalate if unresolved"],
    videoCoaching: [
      "Use concise safety language.",
      "Do not apologize for raising a safety concern.",
      "Name the specific dose concern rather than saying it feels wrong.",
    ],
    examples: [
      {
        ...strongResponse,
        response:
          "I would pause and state the concern clearly: the dose appears higher than expected and I want to verify it before administration. I would ask to recheck the order, medication, patient factors, and calculation. If pressure continued, I would escalate to the instructor or supervising clinician because medication safety must come before speed.",
        whyItPerformsThisWay:
          "It uses assertive but respectful safety communication and resists hierarchy pressure.",
        scoringExplanation:
          "High communication and ethics because the answer prevents harm while keeping the team focused on verification.",
      },
      {
        ...averageResponse,
        response:
          "I would ask if we can double-check the medication because I think the dose is high.",
        whyItPerformsThisWay:
          "It identifies the concern but lacks a clear escalation plan if the concern is dismissed.",
        scoringExplanation:
          "Moderate score because safety is recognized but hierarchy handling is incomplete.",
      },
      {
        ...poorResponse,
        response:
          "I would give it because the senior team member probably knows more than I do.",
        whyItPerformsThisWay:
          "It defers to hierarchy despite a potential safety issue.",
        scoringExplanation:
          "Low score because it fails to use professional responsibility to pause unsafe action.",
      },
    ],
  },
  {
    id: "casper-confidentiality-social-media",
    category: "confidentiality",
    title: "Clinical story on social media",
    setting: "Professionalism scenario",
    prompt:
      "A friend in your program posts a social media story about a clinical day. They do not use the patient's name, but the unit, age, and diagnosis are recognizable. What would you do?",
    timedPromptSeconds: 300,
    reflectionPrompts: [
      "Why can de-identified details still be unsafe?",
      "How can you approach your friend?",
      "When is escalation required?",
    ],
    stakeholderCues: ["privacy", "professional standards", "digital footprint", "patient trust"],
    scoringDimensions: ["confidentiality", "professionalism", "communication", "ethics", "reasoning"],
    communicationFramework: ["Private prompt", "Explain identifiable details", "Encourage removal", "Follow policy"],
    videoCoaching: [
      "Be specific about why the post is identifiable.",
      "Avoid public correction online.",
      "Mention policy and patient trust.",
    ],
    examples: [
      {
        ...strongResponse,
        response:
          "I would contact the friend privately and explain that even without a name, the combination of unit, age, diagnosis, and timing may identify the patient. I would ask them to remove it immediately and review the program's social media policy. If they refused or the post remained a privacy risk, I would follow the appropriate reporting process because patient confidentiality is not optional.",
        whyItPerformsThisWay:
          "It protects confidentiality while giving the peer an immediate chance to correct the harm.",
        scoringExplanation:
          "Strong ethics and professionalism because it recognizes indirect identifiers and uses proportionate escalation.",
      },
      {
        ...averageResponse,
        response:
          "I would tell them the post may be unprofessional and ask them to delete it.",
        whyItPerformsThisWay:
          "It is directionally correct but lacks explanation of indirect identifiers and reporting responsibility.",
        scoringExplanation:
          "Moderate score for recognizing the issue, lower for reasoning depth.",
      },
      {
        ...poorResponse,
        response:
          "I would ignore it because there is no name, so it is not a privacy violation.",
        whyItPerformsThisWay:
          "It misunderstands confidentiality and indirect identification.",
        scoringExplanation:
          "Low score because it misses a core professionalism and privacy principle.",
      },
    ],
  },
  {
    id: "casper-patient-safety-fatigue",
    category: "patient_safety",
    title: "Fatigued peer after a night shift",
    setting: "Patient-safety judgment scenario",
    prompt:
      "A peer says they are too tired to think clearly after a night shift but plans to drive home and study for an exam. What would you do?",
    timedPromptSeconds: 300,
    reflectionPrompts: [
      "What immediate safety concern is present?",
      "How can you respect autonomy while intervening?",
      "What practical options could reduce risk?",
    ],
    stakeholderCues: ["fatigue", "transport safety", "peer support", "realistic options"],
    scoringDimensions: ["empathy", "communication", "reasoning", "professionalism", "ethics"],
    communicationFramework: ["Name concern", "Offer concrete help", "Reduce immediate risk", "Encourage recovery"],
    videoCoaching: [
      "Use supportive urgency.",
      "Offer practical alternatives, not just advice.",
      "Avoid minimizing fatigue.",
    ],
    examples: [
      {
        ...strongResponse,
        response:
          "I would take their fatigue seriously and say I am concerned about them driving when they feel unable to think clearly. I would offer practical options such as calling a ride, waiting somewhere safe, arranging a taxi or rideshare, or contacting someone they trust. I would also encourage rest before studying because fatigue affects safety and learning.",
        whyItPerformsThisWay:
          "It recognizes immediate safety risk and offers realistic support without taking control away from the peer.",
        scoringExplanation:
          "High empathy and reasoning because it moves from concern to concrete harm-reduction options.",
      },
      {
        ...averageResponse,
        response:
          "I would tell them they should rest before driving or studying because being tired is unsafe.",
        whyItPerformsThisWay:
          "It names the risk but does not offer enough practical help.",
        scoringExplanation:
          "Moderate score because the concern is accurate but action planning is thin.",
      },
      {
        ...poorResponse,
        response:
          "I would let them decide because they know their own limits.",
        whyItPerformsThisWay:
          "It avoids a preventable safety concern and misses a realistic opportunity to reduce immediate harm for the peer.",
        scoringExplanation:
          "Low score because it fails to intervene supportively when harm is foreseeable.",
      },
    ],
  },
  {
    id: "casper-communication-angry-applicant",
    category: "communication",
    title: "Angry applicant in a volunteer clinic",
    setting: "Volunteer communication scenario",
    prompt:
      "While volunteering at a clinic, a visitor becomes angry because the wait is longer than expected. They raise their voice at the front desk. What would you do?",
    timedPromptSeconds: 300,
    reflectionPrompts: [
      "How can you de-escalate without making promises?",
      "What safety cues would change your response?",
      "How do you support staff and the visitor?",
    ],
    stakeholderCues: ["de-escalation", "boundaries", "staff support", "safety"],
    scoringDimensions: ["communication", "empathy", "professionalism", "conflict_resolution", "reasoning"],
    communicationFramework: ["Stay calm", "Validate frustration", "Set respectful boundaries", "Seek staff support"],
    videoCoaching: [
      "Keep voice low and slow.",
      "Use short sentences.",
      "Do not argue about whether their frustration is justified.",
    ],
    examples: [
      {
        ...strongResponse,
        response:
          "I would remain calm and acknowledge the frustration: waiting longer than expected is stressful. I would avoid making promises I cannot keep, but I could offer to check with staff about the process or available updates. If the person became threatening, I would prioritize safety and involve the appropriate clinic staff or security. I would also support the front desk by not leaving them alone in the interaction.",
        whyItPerformsThisWay:
          "It de-escalates, preserves boundaries, and adapts if safety risk increases.",
        scoringExplanation:
          "Strong communication and conflict resolution because the answer validates feelings without losing safety or role clarity.",
      },
      {
        ...averageResponse,
        response:
          "I would ask them to calm down and tell them everyone is waiting.",
        whyItPerformsThisWay:
          "It attempts to address behavior but may escalate because it does not validate or offer a next step.",
        scoringExplanation:
          "Moderate to low score because communication is direct but not very therapeutic.",
      },
      {
        ...poorResponse,
        response:
          "I would ignore them because it is not my job.",
        whyItPerformsThisWay:
          "It misses an opportunity to support safety and communication within an appropriate volunteer role.",
        scoringExplanation:
          "Low professionalism because it avoids a visible conflict affecting staff and visitors.",
      },
    ],
  },
];

export const CASPER_ANALYTICS_DIMENSIONS: CasperScoreDimension[] = [
  "empathy",
  "professionalism",
  "communication",
  "conflict_resolution",
  "ethics",
  "bias_awareness",
  "stakeholder_awareness",
  "reasoning",
];

const dimensionKeywords: Record<CasperScoreDimension, string[]> = {
  empathy: ["acknowledge", "understand", "support", "stress", "concern", "thank", "reassure", "dignity"],
  professionalism: ["professional", "policy", "role", "instructor", "preceptor", "process", "accountability"],
  stakeholder_awareness: ["patient", "family", "team", "school", "classmate", "staff", "peer", "instructor"],
  communication: ["ask", "explain", "speak", "listen", "clarify", "discuss", "conversation", "privately"],
  reasoning: ["because", "before", "if", "while", "balance", "risk", "safety", "evidence"],
  ethics: ["integrity", "autonomy", "confidentiality", "honest", "right", "fair", "trust"],
  conflict_resolution: ["private", "barrier", "plan", "deadline", "escalate", "facilitator", "calm"],
  bias_awareness: ["bias", "stigma", "assumption", "stereotype", "equity", "language", "interpreter"],
  equity: ["access", "interpreter", "barrier", "fair", "equity", "language", "understand"],
  confidentiality: ["privacy", "confidential", "identify", "policy", "permission", "trust", "private"],
  patient_safety: ["safety", "harm", "verify", "reassess", "risk", "pause", "monitor"],
};

export function reviewCasperWrittenResponse(response: string, scenario: CasperScenario): CasperStructuredReview {
  const normalized = response.trim().toLowerCase();
  const words = normalized.split(/\s+/).filter(Boolean);
  const dimensionScores = CASPER_ANALYTICS_DIMENSIONS.map((dimension) => {
    const keywords = dimensionKeywords[dimension];
    const hits = keywords.filter((keyword) => normalized.includes(keyword)).length;
    const scenarioBoost = scenario.scoringDimensions.includes(dimension) ? 8 : 0;
    const lengthScore = Math.min(28, Math.floor(words.length / 5));
    const score = Math.min(100, 34 + scenarioBoost + lengthScore + hits * 7);
    return {
      dimension,
      score,
      feedback: buildDimensionFeedback(dimension, score),
    };
  });
  const overallScore = Math.round(
    dimensionScores.reduce((sum, dimension) => sum + dimension.score, 0) / dimensionScores.length,
  );

  return {
    overallScore,
    level: overallScore >= 78 ? "Strong" : overallScore >= 58 ? "Competent" : "Developing",
    dimensionScores,
    strengths: buildStrengths(dimensionScores),
    nextSteps: buildNextSteps(dimensionScores, scenario),
  };
}

function buildDimensionFeedback(dimension: CasperScoreDimension, score: number): string {
  const label = formatCasperDimensionLabel(dimension);
  if (score >= 78) return `${label} is clear and anchored in a practical response plan.`;
  if (score >= 58) return `${label} is present, but the response would improve with more concrete wording.`;
  return `${label} needs more explicit attention in the response.`;
}

function buildStrengths(scores: CasperDimensionScore[]): string[] {
  return scores
    .filter((score) => score.score >= 72)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((score) => `${formatCasperDimensionLabel(score.dimension)} is one of the stronger parts of this response.`);
}

function buildNextSteps(scores: CasperDimensionScore[], scenario: CasperScenario): string[] {
  const lowest = [...scores].sort((a, b) => a.score - b.score).slice(0, 3);
  const steps = lowest.map((score) => {
    switch (score.dimension) {
      case "empathy":
        return "Add one sentence that validates the person's feelings or context before moving to action.";
      case "stakeholder_awareness":
        return `Name the affected stakeholders explicitly: ${scenario.stakeholderCues.slice(0, 3).join(", ")}.`;
      case "communication":
        return "Use direct communication verbs such as ask, clarify, explain, listen, and discuss.";
      case "reasoning":
        return "Explain why your action is proportionate and what risk it prevents.";
      case "bias_awareness":
        return "Identify assumptions or equity barriers that could affect the situation.";
      case "conflict_resolution":
        return "Describe a private, respectful first step before formal escalation.";
      case "ethics":
        return "Connect the action to an ethical principle such as autonomy, integrity, fairness, or confidentiality.";
      case "professionalism":
        return "Anchor the response in role clarity, policy, or an appropriate chain of support.";
      case "equity":
        return "Name the access barrier and describe the support needed to make the interaction fair and safe.";
      case "confidentiality":
        return "Explain how privacy is protected, including indirect identifiers or permission boundaries.";
      case "patient_safety":
        return "State the immediate safety risk and the concrete step that reduces potential harm.";
    }
  });
  return [...new Set(steps)];
}

export function getCasperScenarioById(id: string): CasperScenario | undefined {
  return CASPER_SCENARIOS.find((scenario) => scenario.id === id);
}

export function getCasperCategoryCoverage(): { category: CasperScenarioCategory; count: number }[] {
  const categories: CasperScenarioCategory[] = [
    "ethics",
    "professionalism",
    "conflict",
    "patient_advocacy",
    "equity",
    "bias_awareness",
    "communication",
    "interprofessional",
    "confidentiality",
    "patient_safety",
  ];
  return categories.map((category) => ({
    category,
    count: CASPER_SCENARIOS.filter((scenario) => scenario.category === category).length,
  }));
}
