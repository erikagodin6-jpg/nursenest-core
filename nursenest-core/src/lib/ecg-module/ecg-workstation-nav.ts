export type EcgWorkstationNavItem = {
  href: string;
  label: string;
  description?: string;
};

export type EcgWorkstationNavSection = {
  id: string;
  title: string;
  items: EcgWorkstationNavItem[];
};

export const ECG_WORKSTATION_NAV: EcgWorkstationNavSection[] = [
  {
    id: "telemetry-lab",
    title: "Telemetry lab",
    items: [
      { href: "/modules/ecg", label: "ECG overview", description: "Curriculum map & readiness" },
      { href: "/modules/ecg/basic/lessons", label: "Foundations & rhythms", description: "Animated strips + measurement" },
      { href: "/modules/ecg/basic/quizzes", label: "Rhythm practice", description: "Interpretation checkpoints" },
      { href: "/modules/ecg/advanced/video-drills", label: "Rapid drills", description: "Bedside recognition speed" },
    ],
  },
  {
    id: "clinical",
    title: "Clinical application",
    items: [
      { href: "/modules/ecg/advanced/scenarios", label: "Telemetry scenarios", description: "ACLS-style escalation" },
      { href: "/modules/ecg/pediatric", label: "Pediatric ECG", description: "PALS rhythm safety" },
      { href: "/modules/ecg-advanced", label: "Advanced ECG add-on", description: "12-lead & ICU depth" },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    items: [
      { href: "/modules/ecg/basic/worksheets", label: "Worksheets" },
      { href: "/modules/ecg/advanced/worksheets", label: "Advanced worksheets" },
      { href: "/app/questions/bank?topic=ECG", label: "Question bank (ECG)" },
    ],
  },
];
