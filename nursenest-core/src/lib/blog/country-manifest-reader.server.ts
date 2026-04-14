/**
 * Server-only helpers for reading planned blog manifests (JSON) without pulling rows into the client bundle.
 * Use for ISR pages, audits, and build-time validation — not for root layout.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { PilotCountrySlug } from "@/config/country-localization-types";
import { COUNTRY_BLOG_PRIORITY_MAP } from "@/config/country-blog-priority-map";

type ManifestShape = {
  generatedAt?: string;
  count: number;
  entries: unknown[];
};

function repoRoot(): string {
  return join(process.cwd());
}

export function readPilotManifestSummary(country: PilotCountrySlug): ManifestShape | null {
  const rel = COUNTRY_BLOG_PRIORITY_MAP[country].manifestRelativePath;
  try {
    const raw = readFileSync(join(repoRoot(), rel), "utf8");
    return JSON.parse(raw) as ManifestShape;
  } catch {
    return null;
  }
}
