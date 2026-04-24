#!/usr/bin/env npx tsx
/**
 * Pathway-wide audit: default marketing lessons hub inventory (same pipeline as the page).
 *
 *   cd nursenest-core && npm run lessons:audit-public-hubs
 *
 * Optional:
 *   MARKETING_HUB_AUDIT_LOCALE=en  (content locale; default en)
 *   MARKETING_HUB_AUDIT_PATHWAY_IDS=ca-rn-nclex-rn,us-rn-nclex-rn  (comma list; default = all non-hidden pathways)
 *   MARKETING_HUB_AUDIT_DETAIL_PROBE=1  (HTTP-check first 5 lesson detail URLs; needs MARKETING_HUB_AUDIT_ORIGIN
 *     or MARKETING_STUDY_SMOKE_BASE_URL, e.g. https://www.nursenest.ca)
 *
 * Requires DATABASE_URL.
 */
import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
config({ path: path.join(root, ".env.local") });

await import("../../src/lib/db/script-env-bootstrap");
import { EXAM_PATHWAYS } from "../../src/lib/exam-pathways/exam-pathways-catalog";
import { normalizePreferredMarketingLocale } from "../../src/lib/i18n/marketing-locale-cookie";
import { auditPublicMarketingLessonHubForPathway } from "../../src/lib/lessons/marketing-hub-lesson-inventory-audit";
import { MARKETING_HUB_MIN_VISIBLE_LESSONS } from "../../src/lib/lessons/marketing-hub-lesson-inventory-fill";

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("[lessons:audit-public-hubs] DATABASE_URL is required.");
    process.exit(1);
  }

  if (process.env.MARKETING_HUB_AUDIT_DETAIL_PROBE === "1") {
    const origin = (process.env.MARKETING_HUB_AUDIT_ORIGIN ?? process.env.MARKETING_STUDY_SMOKE_BASE_URL)?.trim();
    if (!origin) {
      console.warn(
        "[lessons:audit-public-hubs] MARKETING_HUB_AUDIT_DETAIL_PROBE=1 but no MARKETING_HUB_AUDIT_ORIGIN or MARKETING_STUDY_SMOKE_BASE_URL — detailStatus rows will be empty.",
      );
    }
  }

  const locale = normalizePreferredMarketingLocale(process.env.MARKETING_HUB_AUDIT_LOCALE);
  const filterRaw = process.env.MARKETING_HUB_AUDIT_PATHWAY_IDS?.trim();
  const allow = filterRaw
    ? new Set(
        filterRaw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      )
    : null;

  const pathways = EXAM_PATHWAYS.filter((p) => {
    if (p.status === "hidden") return false;
    if (allow && !allow.has(p.id)) return false;
    return true;
  });

  const rows = [];
  for (const pathway of pathways) {
    const row = await auditPublicMarketingLessonHubForPathway(pathway, locale);
    rows.push(row);
  }

  const summary = {
    ok: true,
    locale,
    pathwayCount: pathways.length,
    minVisible: MARKETING_HUB_MIN_VISIBLE_LESSONS,
    passingMin12: rows.filter((r) => r.passesMinVisible12).length,
    failingMin12: rows.filter((r) => !r.passesMinVisible12 && r.lessonsPageLoadStatus === "ok").length,
    loadErrors: rows.filter((r) => r.lessonsPageLoadStatus !== "ok").length,
    rows,
  };

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
