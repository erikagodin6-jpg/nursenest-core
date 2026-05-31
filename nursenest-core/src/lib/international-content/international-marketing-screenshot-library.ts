export type InternationalScreenshotAssetStatus = "planned_hidden" | "draft_captured" | "approved_hidden";

export type InternationalScreenshotAsset = {
  readonly id: string;
  readonly pathwayLabel: string;
  readonly module: string;
  readonly targetPath: string;
  readonly filePath: string;
  readonly status: InternationalScreenshotAssetStatus;
  readonly publicReferenceAllowed: false;
  readonly adminOnly: true;
};

export const INTERNATIONAL_SCREENSHOT_LIBRARY: readonly InternationalScreenshotAsset[] = [
  {
    id: "uk-rn-nmc-cbt-question",
    pathwayLabel: "UK RN NMC CBT",
    module: "Answered Question With Rationale",
    targetPath: "/admin/global-expansion/hubs/uk/rn",
    filePath: "/images/international/uk-rn-nmc-cbt-question.png",
    status: "planned_hidden",
    publicReferenceAllowed: false,
    adminOnly: true,
  },
  {
    id: "uk-rn-news2-simulation",
    pathwayLabel: "UK RN NMC CBT",
    module: "NEWS2 Deterioration Simulation",
    targetPath: "/admin/global-expansion/hubs/uk/rn",
    filePath: "/images/international/uk-rn-news2-simulation.png",
    status: "planned_hidden",
    publicReferenceAllowed: false,
    adminOnly: true,
  },
  {
    id: "au-rn-nmba-standards",
    pathwayLabel: "Australia RN NMBA",
    module: "NMBA Standards Lesson",
    targetPath: "/admin/global-expansion/hubs/au/rn",
    filePath: "/images/international/au-rn-nmba-standards.png",
    status: "planned_hidden",
    publicReferenceAllowed: false,
    adminOnly: true,
  },
  {
    id: "nz-rn-cultural-safety",
    pathwayLabel: "New Zealand RN NCNZ",
    module: "Cultural Safety Case",
    targetPath: "/admin/global-expansion/hubs/nz/rn",
    filePath: "/images/international/nz-rn-cultural-safety.png",
    status: "planned_hidden",
    publicReferenceAllowed: false,
    adminOnly: true,
  },
] as const;

export function validateInternationalScreenshotLibrary(): readonly string[] {
  const issues: string[] = [];
  const ids = new Set<string>();
  for (const asset of INTERNATIONAL_SCREENSHOT_LIBRARY) {
    if (ids.has(asset.id)) issues.push(`Duplicate international screenshot id: ${asset.id}`);
    ids.add(asset.id);
    if (asset.publicReferenceAllowed || !asset.adminOnly) {
      issues.push(`${asset.id} must remain hidden and admin-only`);
    }
    if (!asset.filePath.startsWith("/images/international/")) {
      issues.push(`${asset.id} must store under /images/international/`);
    }
  }
  return issues;
}
