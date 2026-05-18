export type AlliedSubdomainSlice = {
  slug: string;
  label: string;
  primaryPath: string;
  seoCluster: string[];
  launchPriority: "p0" | "p1" | "p2";
  readinessPercent: number;
};

export const ALLIED_SUBDOMAIN_HOST = "allied.nursenest.ca";

export const ALLIED_SUBDOMAIN_SLICES: readonly AlliedSubdomainSlice[] = [
  {
    slug: "paramedic",
    label: "Paramedic / EMS",
    primaryPath: "/paramedic",
    seoCluster: [
      "paramedic scenarios",
      "EMS ECG interpretation",
      "prehospital STEMI",
      "airway management",
      "trauma and shock",
      "EMS clinical judgment",
    ],
    launchPriority: "p0",
    readinessPercent: 78,
  },
  {
    slug: "respiratory-therapy",
    label: "Respiratory Therapy",
    primaryPath: "/respiratory-therapy",
    seoCluster: [
      "ABG interpretation",
      "ventilator management",
      "oxygenation and ventilation",
      "RT board preparation",
    ],
    launchPriority: "p0",
    readinessPercent: 82,
  },
  {
    slug: "medical-laboratory",
    label: "Medical Laboratory Science",
    primaryPath: "/medical-laboratory",
    seoCluster: [
      "hematology",
      "microbiology",
      "clinical chemistry",
      "lab safety",
    ],
    launchPriority: "p1",
    readinessPercent: 35,
  },
  {
    slug: "diagnostic-imaging",
    label: "Diagnostic Imaging",
    primaryPath: "/diagnostic-imaging",
    seoCluster: [
      "xray positioning",
      "CT fundamentals",
      "MRI safety",
      "radiography exam prep",
    ],
    launchPriority: "p2",
    readinessPercent: 20,
  },
];

export function buildAlliedSubdomainUrl(path: string): string {
  return `https://${ALLIED_SUBDOMAIN_HOST}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getAlliedSubdomainSlice(slug: string): AlliedSubdomainSlice | undefined {
  return ALLIED_SUBDOMAIN_SLICES.find((slice) => slice.slug === slug);
}

export function getHighestPriorityAlliedSlices(): AlliedSubdomainSlice[] {
  return ALLIED_SUBDOMAIN_SLICES.filter((slice) => slice.launchPriority === "p0");
}

export const ALLIED_SUBDOMAIN_ARCHITECTURE_READINESS_PERCENT = 92;
