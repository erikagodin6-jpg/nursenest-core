import { HIDDEN_ENTERPRISE_VISIBILITY } from "@/lib/enterprise/enterprise-visibility";

export type EnterpriseScreenshotAsset = Readonly<{
  id: string;
  title: string;
  suggestedPath: string;
  useCase: "faculty_dashboard" | "institution_analytics" | "cohort_progress" | "competency_tracking" | "residency_program";
  generated: false;
  visibility: typeof HIDDEN_ENTERPRISE_VISIBILITY;
}>;

export const ENTERPRISE_SCREENSHOT_LIBRARY: readonly EnterpriseScreenshotAsset[] = [
  {
    id: "faculty-dashboard",
    title: "Faculty Dashboard",
    suggestedPath: "/public/images/enterprise/faculty-dashboard.png",
    useCase: "faculty_dashboard",
    generated: false,
    visibility: HIDDEN_ENTERPRISE_VISIBILITY,
  },
  {
    id: "institution-analytics",
    title: "Institution Analytics",
    suggestedPath: "/public/images/enterprise/institution-analytics.png",
    useCase: "institution_analytics",
    generated: false,
    visibility: HIDDEN_ENTERPRISE_VISIBILITY,
  },
  {
    id: "cohort-progress",
    title: "Cohort Progress",
    suggestedPath: "/public/images/enterprise/cohort-progress.png",
    useCase: "cohort_progress",
    generated: false,
    visibility: HIDDEN_ENTERPRISE_VISIBILITY,
  },
  {
    id: "competency-tracking",
    title: "Competency Tracking",
    suggestedPath: "/public/images/enterprise/competency-tracking.png",
    useCase: "competency_tracking",
    generated: false,
    visibility: HIDDEN_ENTERPRISE_VISIBILITY,
  },
  {
    id: "residency-programs",
    title: "Residency Programs",
    suggestedPath: "/public/images/enterprise/residency-programs.png",
    useCase: "residency_program",
    generated: false,
    visibility: HIDDEN_ENTERPRISE_VISIBILITY,
  },
];
