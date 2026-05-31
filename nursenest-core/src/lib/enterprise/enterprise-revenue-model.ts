import { HIDDEN_ENTERPRISE_VISIBILITY } from "@/lib/enterprise/enterprise-visibility";

export type EnterpriseRevenueModel =
  | "per_student_licensing"
  | "program_licensing"
  | "hospital_licensing"
  | "department_licensing"
  | "enterprise_contract";

export type EnterpriseRevenueModelDefinition = Readonly<{
  model: EnterpriseRevenueModel;
  description: string;
  publicPricingEnabled: false;
  visibility: typeof HIDDEN_ENTERPRISE_VISIBILITY;
}>;

export const ENTERPRISE_REVENUE_MODELS: readonly EnterpriseRevenueModelDefinition[] = [
  {
    model: "per_student_licensing",
    description: "Seat-based licensing for schools or cohorts.",
    publicPricingEnabled: false,
    visibility: HIDDEN_ENTERPRISE_VISIBILITY,
  },
  {
    model: "program_licensing",
    description: "Program-level licensing for nursing or residency programs.",
    publicPricingEnabled: false,
    visibility: HIDDEN_ENTERPRISE_VISIBILITY,
  },
  {
    model: "hospital_licensing",
    description: "Hospital-wide learner access for onboarding and readiness.",
    publicPricingEnabled: false,
    visibility: HIDDEN_ENTERPRISE_VISIBILITY,
  },
  {
    model: "department_licensing",
    description: "Department licensing for specialty orientation.",
    publicPricingEnabled: false,
    visibility: HIDDEN_ENTERPRISE_VISIBILITY,
  },
  {
    model: "enterprise_contract",
    description: "Custom enterprise contract with negotiated scope.",
    publicPricingEnabled: false,
    visibility: HIDDEN_ENTERPRISE_VISIBILITY,
  },
];
