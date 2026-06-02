export type HiddenEnterpriseVisibility = Readonly<{
  published: false;
  visibleInNavigation: false;
  launchReady: false;
  adminOnly: true;
  indexable: false;
}>;

export const HIDDEN_ENTERPRISE_VISIBILITY: HiddenEnterpriseVisibility = {
  published: false,
  visibleInNavigation: false,
  launchReady: false,
  adminOnly: true,
  indexable: false,
};

export type EnterpriseEntityKind =
  | "institution"
  | "program"
  | "cohort"
  | "faculty_dashboard"
  | "hospital_onboarding"
  | "placement_readiness"
  | "competency_validation"
  | "assignment"
  | "benchmark"
  | "accreditation"
  | "residency"
  | "analytics"
  | "revenue_model"
  | "assignment_bundle"
  | "screenshot";
