export type LifecycleState =
  | "no_exam_date"
  | "exam_upcoming"
  | "exam_approaching_soon"
  | "awaiting_results"
  | "passed"
  | "did_not_pass"
  | "postponed"
  | "new_grad_active";

export type LifecycleData = {
  examDate: string | null;
  examDateType: string | null;
  examResultStatus: string | null;
  examFollowupCompleted: boolean;
  examPostponed: boolean;
  careerStage: string | null;
  newGradResourcesActivated: boolean;
  examCountdownHidden: boolean;
  studyPlannerHidden: boolean;
  studyPlanIntensity: string | null;
  daysRemaining: number | null;
  tier: string | null;
};

export function resolveLifecycleState(data: LifecycleData): LifecycleState {
  if (data.careerStage === "new_grad" && data.newGradResourcesActivated) {
    return "new_grad_active";
  }

  if (data.examResultStatus === "passed") {
    return "passed";
  }

  if (data.examResultStatus === "did_not_pass") {
    return "did_not_pass";
  }

  if (data.examResultStatus === "awaiting") {
    return "awaiting_results";
  }

  if (data.examPostponed) {
    return "postponed";
  }

  if (!data.examDate) {
    return "no_exam_date";
  }

  const days = data.daysRemaining ?? 0;

  if (days <= 0) {
    return "awaiting_results";
  }

  if (days <= 14) {
    return "exam_approaching_soon";
  }

  return "exam_upcoming";
}

export type LifecycleStateInfo = {
  state: LifecycleState;
  label: string;
  badgeColor: string;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  iconBg: string;
};

const STATE_INFO: Record<LifecycleState, Omit<LifecycleStateInfo, "state">> = {
  no_exam_date: {
    label: "Get Started",
    badgeColor: "bg-blue-100 text-blue-700",
    gradientFrom: "from-blue-50",
    gradientTo: "to-indigo-50/30",
    borderColor: "border-blue-200/60",
    iconBg: "bg-blue-100",
  },
  exam_upcoming: {
    label: "Exam Prep",
    badgeColor: "bg-primary/10 text-primary",
    gradientFrom: "from-violet-50/50",
    gradientTo: "to-purple-50/30",
    borderColor: "border-primary/20",
    iconBg: "bg-primary/10",
  },
  exam_approaching_soon: {
    label: "Final Stretch",
    badgeColor: "bg-amber-100 text-amber-700",
    gradientFrom: "from-amber-50/60",
    gradientTo: "to-orange-50/30",
    borderColor: "border-amber-200/60",
    iconBg: "bg-amber-100",
  },
  awaiting_results: {
    label: "Awaiting Results",
    badgeColor: "bg-sky-100 text-sky-700",
    gradientFrom: "from-sky-50/50",
    gradientTo: "to-blue-50/30",
    borderColor: "border-sky-200/60",
    iconBg: "bg-sky-100",
  },
  passed: {
    label: "Congratulations!",
    badgeColor: "bg-emerald-100 text-emerald-700",
    gradientFrom: "from-emerald-50/60",
    gradientTo: "to-green-50/30",
    borderColor: "border-emerald-200/60",
    iconBg: "bg-emerald-100",
  },
  did_not_pass: {
    label: "Next Steps",
    badgeColor: "bg-rose-100 text-rose-700",
    gradientFrom: "from-rose-50/40",
    gradientTo: "to-pink-50/20",
    borderColor: "border-rose-200/50",
    iconBg: "bg-rose-100",
  },
  postponed: {
    label: "Exam Postponed",
    badgeColor: "bg-gray-100 text-gray-700",
    gradientFrom: "from-gray-50/50",
    gradientTo: "to-slate-50/30",
    borderColor: "border-gray-200/60",
    iconBg: "bg-gray-100",
  },
  new_grad_active: {
    label: "New Graduate",
    badgeColor: "bg-indigo-100 text-indigo-700",
    gradientFrom: "from-indigo-50/50",
    gradientTo: "to-blue-50/30",
    borderColor: "border-indigo-200/60",
    iconBg: "bg-indigo-100",
  },
};

export function getStateInfo(state: LifecycleState): LifecycleStateInfo {
  return { state, ...STATE_INFO[state] };
}
