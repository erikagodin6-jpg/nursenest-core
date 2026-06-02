import * as fs from "node:fs";
import * as path from "node:path";

export type LikelyTier = "PN" | "RN" | "NP" | "Allied" | "mixed" | "unknown";

export function likelyTierFromPath(relPath: string): LikelyTier {
  const p = relPath.toLowerCase();
  if (
    /(^|\/)(rrt|paramedic|mlt|imaging|surgical-tech|dms-|ota|pta|echo|allied|social-worker|psychotherapist|addictions|occupational-therapy|pharmacy|sonography)/.test(
      p,
    )
  )
    return "Allied";
  if (/\brpn\b|\/rpn-|\/lpn-|rex-pn|practical-nurse/.test(p)) return "PN";
  if (/\/np-|np-free|np-clinical|np-content|np-generated|np-curriculum|np-patho|np-expanded/.test(p)) return "NP";
  if (/\/rn-|rn-shock|rn-patho|rn-expanded|rn-incomplete|cardiovascular|respiratory|renal\//.test(p)) return "RN";
  if (/\/generated-batch|\/clinical-conditions|\/missing-batch|\/rpn-content-batch/.test(p)) return "mixed";
  return "unknown";
}

export function walkTsFiles(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) walkTsFiles(full, out);
    else if (name.isFile() && (name.name.endsWith(".ts") || name.name.endsWith(".tsx"))) out.push(full);
  }
  return out;
}

/** Extract string ids from `id: "..."` patterns (legacy lesson objects). */
export function extractLessonIdsFromSource(src: string): string[] {
  const ids = new Set<string>();
  const re = /\bid:\s*["']([^"'\n]+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    const id = m[1].trim();
    if (id.length >= 2 && id.length < 200) ids.add(id);
  }
  return [...ids];
}

export function normalizeTitleKey(title: string): string {
  return title
    .toLowerCase()
    .replace(/&amp;/g, "&")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function guessPathwayForLegacyId(lessonId: string, tier: LikelyTier): string | null {
  const id = lessonId.toLowerCase();
  if (tier === "Allied" || /rrt|paramedic|mlt|imaging|ota|pta|dms-|surgical-tech|social-worker|psychotherapist|addictions/.test(id))
    return "us-allied-core";
  if (tier === "PN" || /rpn|lpn|rex|practical-nurse/.test(id)) return "ca-rpn-rex-pn";
  if (tier === "NP" || /(^|-)np-/.test(id) || id.includes("-np-")) return "us-np-fnp";
  if (tier === "RN" || id.includes("rn-") || id.startsWith("rn")) return "us-rn-nclex-rn";
  return null;
}
