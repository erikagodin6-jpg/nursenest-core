#!/usr/bin/env npx tsx
/**
 * Static validation of exam registry, marketing hubs, and i18n bundles (no DB).
 * Fails with exit 1 when critical drift is detected — run before deploy via `npm run validate:content`.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  EXAM_PATHWAYS,
  buildExamPathwayPath,
  getExamPathwayById,
  getExamPathwayByRoute,
} from "../src/lib/exam-pathways/exam-product-registry";
import { DEFAULT_MARKETING_LOCALE } from "../src/lib/i18n/marketing-locale-policy";
import {
  marketingExamPrepHubs,
  publicMarketingCatHrefForOffering,
} from "../src/lib/marketing/marketing-exam-navigation";
import { isWellFormedExamHubPath } from "../src/lib/marketing/nursing-exam-nav-validation";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

function resolveI18nPath(locale: string): string | null {
  const file = `${locale}.json`;
  const candidates = [
    path.join(REPO_ROOT, "public", "i18n", file),
    path.join(REPO_ROOT, "nursenest-core", "public", "i18n", file),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return null;
}

function main(): void {
  const errors: string[] = [];

  const ids = new Map<string, number>();
  const routes = new Map<string, string>();
  for (const p of EXAM_PATHWAYS) {
    ids.set(p.id, (ids.get(p.id) ?? 0) + 1);
    const rk = `${p.countrySlug}/${p.roleTrack}/${p.examCode}`;
    if (routes.has(rk) && routes.get(rk) !== p.id) {
      errors.push(`Duplicate route key ${rk} for pathway ids ${routes.get(rk)} vs ${p.id}`);
    }
    routes.set(rk, p.id);
  }
  for (const [id, n] of ids) {
    if (n > 1) errors.push(`Duplicate pathway id in registry: ${id} (${n} times)`);
  }

  for (const p of EXAM_PATHWAYS) {
    if (p.status === "hidden") continue;
    const resolved = getExamPathwayByRoute(p.countrySlug, p.roleTrack, p.examCode);
    if (!resolved || resolved.id !== p.id) {
      errors.push(`Route index mismatch for ${p.id}`);
    }
    const href = buildExamPathwayPath(p);
    if (!isWellFormedExamHubPath(href)) {
      errors.push(`Malformed buildExamPathwayPath for ${p.id}: ${href}`);
    }
    if (getExamPathwayById(p.id)?.id !== p.id) {
      errors.push(`getExamPathwayById broken for ${p.id}`);
    }
  }

  for (const region of ["US", "CA"] as const) {
    const hubs = marketingExamPrepHubs(region);
    for (const [offering, href] of Object.entries(hubs)) {
      if (!isWellFormedExamHubPath(href)) {
        errors.push(`marketingExamPrepHubs ${region} ${offering} -> bad href ${href}`);
      }
      const catHref = publicMarketingCatHrefForOffering(region, offering as "rn" | "pn" | "np" | "allied");
      if (!catHref.startsWith("/") || catHref.includes("//")) {
        errors.push(`CAT href suspicious for ${region} ${offering}: ${catHref}`);
      }
    }
  }

  const requiredNavKeys = [
    "nav.examStrip.rn",
    "nav.examStrip.pnUS",
    "nav.examStrip.pnCA",
    "nav.examStrip.npUS",
    "nav.examStrip.npCA",
    "nav.examStrip.alliedUS",
    "nav.examStrip.alliedCA",
  ];
  const enPath = resolveI18nPath(DEFAULT_MARKETING_LOCALE);
  if (!enPath) {
    errors.push(`Missing merged i18n bundle at public/i18n/${DEFAULT_MARKETING_LOCALE}.json (run i18n merge if expected)`);
  } else {
    try {
      const bundle = JSON.parse(readFileSync(enPath, "utf8")) as Record<string, string>;
      for (const k of requiredNavKeys) {
        const v = bundle[k];
        if (typeof v !== "string" || v.trim().length === 0) {
          errors.push(`Missing or empty i18n key in English bundle: ${k}`);
        }
      }
      for (const [k, v] of Object.entries(bundle)) {
        if (!/^nav\.examStrip\./.test(k)) continue;
        if (typeof v === "string" && /\bmock exam\b/i.test(v)) {
          errors.push(
            `English i18n key "${k}" contains legacy "mock exam" phrasing — use exam-appropriate wording in the exam strip.`,
          );
        }
      }
    } catch {
      errors.push(`Failed to parse English i18n JSON at ${enPath}`);
    }
  }

  if (errors.length > 0) {
    console.error("[validate:content] FAILED:\n" + errors.map((e) => `  - ${e}`).join("\n"));
    process.exit(1);
  }
  console.log("[validate:content] OK — registry, hub paths, and English nav keys validated.");
}

main();
