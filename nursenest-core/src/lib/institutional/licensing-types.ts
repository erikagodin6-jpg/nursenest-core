export const INSTITUTION_TYPES = [
  "nursing_school",
  "hospital",
  "health_system",
  "college",
  "university",
  "new_grad_program",
  "residency_program",
] as const;

export type InstitutionType = (typeof INSTITUTION_TYPES)[number];
export type InstitutionalRole = "institution_admin" | "faculty" | "learner";
export type InstitutionalStatus = "active" | "trial" | "past_due" | "suspended" | "cancelled";

export type InstitutionalOrganizationSummary = {
  id: string;
  name: string;
  slug: string;
  type: InstitutionType | string;
  status: InstitutionalStatus | string;
  seatCap: number;
  assignedSeats: number;
  availableSeats: number;
  renewalAt: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  primaryTimezone: string | null;
  learnerCount: number;
  facultyCount: number;
  adminCount: number;
  avgReadinessScore: number | null;
  completionRatePct: number | null;
  activeLearners7d: number;
  createdAt: string;
};

export type InstitutionalLearnerRow = {
  userId: string;
  name: string | null;
  email: string;
  tier: string;
  learnerPath: string | null;
  readinessScore: number | null;
  readinessLevel: string | null;
  weakAreas: string[];
  catCompleted: number;
  lessonsCompleted: number;
  flashcardsCompleted: number;
  clinicalSkillsActivity: number;
  lastActiveAt: string | null;
};

export type InstitutionalCohortRow = {
  id: string;
  organizationId: string;
  name: string;
  defaultPathwayId: string | null;
  status: string;
  learnerCount: number;
  avgReadinessScore: number | null;
  completionRatePct: number | null;
};

export type InstitutionalLicenseEventRow = {
  id: string;
  organizationId: string;
  actorUserId: string | null;
  eventType: string;
  seatDelta: number | null;
  meta: unknown;
  createdAt: string;
};

export type InstitutionalDashboardData = {
  generatedAt: string;
  organizations: InstitutionalOrganizationSummary[];
  selectedOrganization: InstitutionalOrganizationSummary | null;
  learners: InstitutionalLearnerRow[];
  cohorts: InstitutionalCohortRow[];
  recentEvents: InstitutionalLicenseEventRow[];
  totals: {
    organizations: number;
    seatsPurchased: number;
    seatsAssigned: number;
    seatsAvailable: number;
    activeLearners7d: number;
    avgReadinessScore: number | null;
    completionRatePct: number | null;
  };
};

export function normalizeInstitutionType(value: string): InstitutionType | string {
  const normalized = value.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return INSTITUTION_TYPES.includes(normalized as InstitutionType) ? (normalized as InstitutionType) : normalized;
}

export function institutionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    nursing_school: "Nursing School",
    hospital: "Hospital",
    health_system: "Health System",
    college: "College",
    university: "University",
    new_grad_program: "New Grad Program",
    residency_program: "Residency Program",
  };
  return labels[type] ?? type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function calculateSeatUtilization(seatCap: number, assignedSeats: number) {
  const cap = Math.max(0, Math.floor(seatCap));
  const assigned = Math.max(0, Math.floor(assignedSeats));
  return {
    seatCap: cap,
    assignedSeats: assigned,
    availableSeats: Math.max(0, cap - assigned),
    utilizationPct: cap > 0 ? Math.round((assigned / cap) * 1000) / 10 : null,
  };
}
