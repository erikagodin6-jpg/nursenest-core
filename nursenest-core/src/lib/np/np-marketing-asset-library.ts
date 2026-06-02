import type { NpCertificationTag } from "./np-certification-ecosystem";

export type NpMarketingScreenshotModule =
  | "Question Bank"
  | "Lessons"
  | "Flashcards"
  | "Clinical Cases"
  | "Readiness Dashboard"
  | "Analytics"
  | "OSCE Preparation";

export type NpMarketingScreenshotAsset = {
  readonly id: string;
  readonly certification: Exclude<NpCertificationTag, "NP_CORE">;
  readonly module: NpMarketingScreenshotModule;
  readonly filePath: string;
  readonly status: "planned_hidden" | "draft_captured" | "approved_hidden";
  readonly publicReferenceAllowed: false;
  readonly adminOnly: true;
};

const certifications: readonly Exclude<NpCertificationTag, "NP_CORE">[] = ["FNP", "AGPCNP", "PMHNP", "WHNP", "PNP_PC", "PNP_AC", "ACNPC_AG", "ENP", "CNPLE"];
const modules: readonly NpMarketingScreenshotModule[] = ["Question Bank", "Lessons", "Flashcards", "Clinical Cases", "Readiness Dashboard", "Analytics", "OSCE Preparation"];

function slug(value: string): string {
  return value.toLowerCase().replaceAll("_", "-").replaceAll(" ", "-");
}

export const NP_MARKETING_SCREENSHOT_LIBRARY: readonly NpMarketingScreenshotAsset[] = certifications.flatMap((certification) =>
  modules.map((module) => ({
    id: `${slug(certification)}-${slug(module)}`,
    certification,
    module,
    filePath: `/images/np-pathways/${slug(certification)}-${slug(module)}.png`,
    status: "planned_hidden" as const,
    publicReferenceAllowed: false as const,
    adminOnly: true as const,
  })),
);

export function validateNpMarketingScreenshotLibrary(): readonly string[] {
  const issues: string[] = [];
  const ids = new Set<string>();
  for (const asset of NP_MARKETING_SCREENSHOT_LIBRARY) {
    if (ids.has(asset.id)) issues.push(`Duplicate NP screenshot id: ${asset.id}`);
    ids.add(asset.id);
    if (asset.publicReferenceAllowed || !asset.adminOnly) issues.push(`${asset.id} must remain hidden`);
    if (!asset.filePath.startsWith("/images/np-pathways/")) issues.push(`${asset.id} must live under /images/np-pathways/`);
  }
  return issues;
}
