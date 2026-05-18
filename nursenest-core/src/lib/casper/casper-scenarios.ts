export type CasperScenarioCategory =
  | "professionalism"
  | "ethics"
  | "teamwork"
  | "communication"
  | "patient-safety"
  | "leadership"
  | "equity";

export type CasperScenarioDifficulty = "intro" | "moderate" | "advanced";

export type CasperScenario = {
  id: string;
  slug: string;
  title: string;
  category: CasperScenarioCategory;
  difficulty: CasperScenarioDifficulty;
  prompt: string;
  followUps: string[];
  stakeholders: string[];
  ethicalDomains: string[];
  strongResponseSignals: string[];
  commonMistakes: string[];
  reflectionPrompt: string;
};

export const CASPER_ENTITLEMENT = "CASPER_PREP_PREMIUM" as const;

export const CASPER_MARKETING_PATHS = [
  "/casper",
  "/casper/practice-test",
  "/casper/sample-questions",
  "/casper/scenarios",
  "/casper/ethical-reasoning",
  "/casper/video-response",
  "/casper/nursing",
  "/casper/medical-school",
  "/casper/social-work",
  "/casper/teacher-education",
] as const;

export const CASPER_SCENARIOS: CasperScenario[] = [
  {
    id: "casper-roommate-cheating",
    slug: "roommate-cheating",
    title: "Roommate cheating concern",
    category: "ethics",
    difficulty: "intro",
    prompt:
      "You notice your roommate using unauthorized notes during an online course assessment. They tell you they are overwhelmed and ask you not to say anything because this grade affects their program application.",
    followUps: [
      "What would you do first?",
      "How would you balance compassion for your roommate with academic integrity?",
      "What would make your response stronger if this involved a healthcare program?",
    ],
    stakeholders: ["Applicant", "Roommate", "Classmates", "Instructor", "Future patients"],
    ethicalDomains: ["Integrity", "Accountability", "Fairness", "Professional trust"],
    strongResponseSignals: [
      "Speaks privately and nonjudgmentally first",
      "Names the integrity concern without attacking the person",
      "Encourages self-reporting or seeking academic support",
      "Escalates appropriately if the issue is not addressed",
    ],
    commonMistakes: [
      "Ignoring the behaviour because the person is stressed",
      "Reporting immediately without attempting respectful communication",
      "Making threats or using punitive language",
    ],
    reflectionPrompt: "Where is the line between empathy for stress and enabling unsafe professional habits?",
  },
  {
    id: "casper-patient-confidentiality",
    slug: "patient-confidentiality",
    title: "Confidentiality in a public space",
    category: "patient-safety",
    difficulty: "moderate",
    prompt:
      "During a volunteer shift, you hear two students discussing identifiable patient details in a hospital cafeteria. They seem unaware that others can hear them.",
    followUps: [
      "How would you intervene in the moment?",
      "What would you do after the conversation stops?",
      "How would you avoid embarrassing the students while protecting confidentiality?",
    ],
    stakeholders: ["Patient", "Students", "Hospital team", "Public listeners"],
    ethicalDomains: ["Confidentiality", "Nonmaleficence", "Professionalism", "Psychological safety"],
    strongResponseSignals: [
      "Interrupts discreetly and respectfully",
      "Protects patient privacy immediately",
      "Uses coaching language rather than public shaming",
      "Escalates through proper channels if there is ongoing risk",
    ],
    commonMistakes: [
      "Waiting until later while identifiable details continue",
      "Calling them out loudly in the cafeteria",
      "Treating confidentiality as a minor etiquette issue",
    ],
    reflectionPrompt: "How can you correct a peer while preserving dignity and safety?",
  },
  {
    id: "casper-team-conflict",
    slug: "team-conflict",
    title: "Team member not contributing",
    category: "teamwork",
    difficulty: "intro",
    prompt:
      "You are assigned a group presentation. One member has missed two meetings and has not completed their section. The deadline is tomorrow and the rest of the group wants to remove their name from the project.",
    followUps: [
      "What would you do before making a decision?",
      "How would you support fairness to the group?",
      "What if the student shares that they are dealing with a family emergency?",
    ],
    stakeholders: ["Group members", "Absent student", "Instructor", "Audience"],
    ethicalDomains: ["Fairness", "Team accountability", "Compassion", "Communication"],
    strongResponseSignals: [
      "Seeks information before judging motives",
      "Communicates expectations clearly",
      "Creates a realistic recovery plan if possible",
      "Involves the instructor if fairness cannot be resolved internally",
    ],
    commonMistakes: [
      "Assuming laziness without checking in",
      "Doing the missing work silently and becoming resentful",
      "Letting one person receive full credit without contribution or explanation",
    ],
    reflectionPrompt: "How do you keep both compassion and accountability visible in your response?",
  },
  {
    id: "casper-biased-comment",
    slug: "biased-comment",
    title: "Biased comment from a peer",
    category: "equity",
    difficulty: "moderate",
    prompt:
      "A peer makes a dismissive comment about a patient population during a study session. Others laugh awkwardly and move on.",
    followUps: [
      "How would you respond in the moment?",
      "What would you say to the peer privately?",
      "When would escalation be appropriate?",
    ],
    stakeholders: ["Peer", "Affected patient population", "Study group", "Future care team"],
    ethicalDomains: ["Equity", "Respect", "Cultural safety", "Professional accountability"],
    strongResponseSignals: [
      "Names the concern without humiliation",
      "Redirects toward respectful patient-centered language",
      "Invites reflection rather than performing moral superiority",
      "Escalates if discriminatory behaviour persists or creates risk",
    ],
    commonMistakes: [
      "Laughing along to avoid tension",
      "Delivering a lecture that shuts down learning",
      "Treating bias as only a personal opinion rather than a care-quality issue",
    ],
    reflectionPrompt: "What wording would make your response firm but still educational?",
  },
  {
    id: "casper-missed-medication-error",
    slug: "missed-medication-error",
    title: "Possible medication error noticed late",
    category: "patient-safety",
    difficulty: "advanced",
    prompt:
      "While shadowing on a clinical unit, you think you notice a medication dose was documented differently than what was discussed during handoff. You are not fully sure, and the nurse looks very busy.",
    followUps: [
      "What is your immediate priority?",
      "How would you raise the concern without overstepping your role?",
      "What if the nurse dismisses your concern?",
    ],
    stakeholders: ["Patient", "Nurse", "Clinical instructor", "Healthcare team", "Learner"],
    ethicalDomains: ["Patient safety", "Humility", "Duty to speak up", "Scope awareness"],
    strongResponseSignals: [
      "Prioritizes patient safety despite uncertainty",
      "Uses humble language: ‘I may be mistaken, but…’",
      "Escalates to instructor or charge nurse if risk remains unresolved",
      "Documents/communicates only through appropriate channels",
    ],
    commonMistakes: [
      "Staying silent because you are not certain",
      "Accusing the nurse of an error",
      "Discussing the issue with peers instead of the care team",
    ],
    reflectionPrompt: "How can uncertainty be communicated safely without becoming passivity?",
  },
  {
    id: "casper-family-pressure",
    slug: "family-pressure",
    title: "Family pressure and autonomy",
    category: "communication",
    difficulty: "advanced",
    prompt:
      "A patient quietly tells you they do not want a procedure, but their family is pressuring them to agree. The family insists they know what is best and asks you to convince the patient.",
    followUps: [
      "How would you support the patient?",
      "How would you communicate with the family?",
      "What professional boundaries matter here?",
    ],
    stakeholders: ["Patient", "Family", "Care team", "Learner"],
    ethicalDomains: ["Autonomy", "Beneficence", "Consent", "Family-centered care"],
    strongResponseSignals: [
      "Centers the patient’s voice and consent",
      "Acknowledges family concern without giving them decision authority",
      "Escalates to the licensed care team for informed consent support",
      "Avoids coercive language",
    ],
    commonMistakes: [
      "Automatically siding with family because they seem concerned",
      "Ignoring family emotions",
      "Trying to independently counsel beyond role/scope",
    ],
    reflectionPrompt: "How do you show respect for family while protecting patient autonomy?",
  },
];

export const CASPER_FREE_MINI_TEST = CASPER_SCENARIOS.slice(0, 5);

export function getCasperScenarioBySlug(slug: string): CasperScenario | undefined {
  return CASPER_SCENARIOS.find((scenario) => scenario.slug === slug);
}

export function listCasperScenarioCategories(): CasperScenarioCategory[] {
  return ["professionalism", "ethics", "teamwork", "communication", "patient-safety", "leadership", "equity"];
}
