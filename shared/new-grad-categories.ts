export const ACTIVE_BUILD_PRIORITY = ["NEW_GRAD_EXPANSION", "SCENARIO_QUESTIONS", "INTERVIEW_SIMULATIONS", "MOCK_TESTS", "ADMIN_ANALYTICS"];

export interface SubCategory {
  id: string;
  label: string;
  description: string;
}

export interface CategoryGroup {
  id: string;
  label: string;
  description: string;
  subcategories: SubCategory[];
}

export const NEW_GRAD_CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: "interview_preparation",
    label: "Interview Preparation",
    description: "Master behavioral, clinical, and scenario-based interview questions with STAR-format responses",
    subcategories: [
      { id: "behavioral", label: "Behavioral Questions", description: "STAR-format behavioral interview scenarios" },
      { id: "clinical_judgment", label: "Clinical Judgment", description: "Clinical decision-making and critical thinking scenarios" },
      { id: "scenario_responses", label: "Scenario Responses", description: "Situational judgment and response questions" },
      { id: "star_examples", label: "STAR Examples", description: "Structured STAR framework answer examples" },
      { id: "common_nursing_interview", label: "Common Nursing Interview", description: "Frequently asked nursing interview questions" },
      { id: "difficult_interviewer", label: "Difficult Interviewer", description: "Handling tough, curveball, and stress interview questions" },
      { id: "panel_interview", label: "Panel Interview", description: "Multi-interviewer panel preparation scenarios" },
    ],
  },
  {
    id: "workplace_scenarios",
    label: "Workplace Scenarios",
    description: "Navigate real-world workplace situations including prioritization, delegation, and communication",
    subcategories: [
      { id: "prioritization", label: "Prioritization", description: "Managing competing patient needs and task prioritization" },
      { id: "delegation", label: "Delegation", description: "Appropriate delegation and supervision scenarios" },
      { id: "patient_safety", label: "Patient Safety", description: "Maintaining safety standards and preventing errors" },
      { id: "medication_error", label: "Medication Error", description: "Responding to and preventing medication errors" },
      { id: "handoff_communication", label: "Handoff Communication", description: "SBAR and shift handoff communication scenarios" },
      { id: "difficult_coworkers", label: "Difficult Coworkers", description: "Managing interpersonal conflict with colleagues" },
      { id: "interdisciplinary_communication", label: "Interdisciplinary Communication", description: "Communicating across healthcare team disciplines" },
    ],
  },
  {
    id: "clinical_transition",
    label: "Clinical Transition",
    description: "Successfully transition from student to practicing clinician",
    subcategories: [
      { id: "first_shift", label: "First Shift", description: "Preparing for and surviving your first shifts" },
      { id: "new_nurse_anxiety", label: "New Nurse Anxiety", description: "Managing imposter syndrome and transition anxiety" },
      { id: "time_management", label: "Time Management", description: "Organizing workflow and managing time effectively" },
      { id: "documentation_challenges", label: "Documentation Challenges", description: "Accurate and efficient clinical documentation" },
      { id: "critical_thinking_drills", label: "Critical Thinking Drills", description: "Developing clinical reasoning and critical thinking" },
    ],
  },
  {
    id: "professional_development",
    label: "Professional Development",
    description: "Build professional skills, navigate ethics, and develop your career identity",
    subcategories: [
      { id: "professional_boundaries", label: "Professional Boundaries", description: "Maintaining appropriate professional relationships" },
      { id: "ethical_dilemmas", label: "Ethical Dilemmas", description: "Navigating ethical conflicts in clinical practice" },
      { id: "workplace_bullying", label: "Workplace Bullying", description: "Recognizing and addressing lateral violence and bullying" },
      { id: "advocacy", label: "Advocacy", description: "Patient and professional advocacy scenarios" },
      { id: "patient_communication", label: "Patient Communication", description: "Therapeutic communication and difficult conversations" },
    ],
  },
  {
    id: "career_navigation",
    label: "Career Navigation",
    description: "Navigate job offers, evaluations, and career advancement opportunities",
    subcategories: [
      { id: "job_offer_negotiation", label: "Job Offer Negotiation", description: "Evaluating and negotiating employment offers" },
      { id: "probation_period", label: "Probation Period", description: "Succeeding during orientation and probationary periods" },
      { id: "performance_evaluation", label: "Performance Evaluation", description: "Preparing for and responding to performance reviews" },
      { id: "career_advancement", label: "Career Advancement", description: "Planning long-term career growth and specialization" },
    ],
  },
];

export const ALL_SUBCATEGORIES = NEW_GRAD_CATEGORY_GROUPS.flatMap(g =>
  g.subcategories.map(s => ({
    groupId: g.id,
    groupLabel: g.label,
    subcategoryId: s.id,
    subcategoryLabel: s.label,
  }))
);

export function getCategoryGroup(groupId: string): CategoryGroup | undefined {
  return NEW_GRAD_CATEGORY_GROUPS.find(g => g.id === groupId);
}

export function getSubcategory(groupId: string, subcategoryId: string): SubCategory | undefined {
  const group = getCategoryGroup(groupId);
  return group?.subcategories.find(s => s.id === subcategoryId);
}
