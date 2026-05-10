import {
  ALLIED_MINIMUM_CONTENT_PER_OCCUPATION,
  ALLIED_OCCUPATION_CONTENT_FOCUS,
  alliedPremiumModuleMatrixForOccupation,
  listAlliedOccupationsFromRegistry,
  US_ALLIED_CORE_PATHWAY_ID,
  usAlliedPathwayOrThrow,
} from "@/lib/allied/allied-hub-program-model";
import { ALLIED_GLOBAL_HUB_PATH, buildAlliedOccupationMarketingHubPath } from "@/lib/allied/allied-global-hub-path";

export type AlliedHubReportOptions = {
  generatedAtIso: string;
  /** Deterministic flags for server-safe report generation (no env reads). */
  clinicalScenariosPublic: boolean;
  oscePublic: boolean;
};

function bulletList(lines: readonly string[]): string {
  return lines.map((l) => `- ${l}`).join("\n");
}

/**
 * Markdown inventory: registry occupations, hub routes, premium module matrix, minimum floors.
 * DB-backed counts (lessons/flashcards/questions/…) are **explicitly TODO** — never invented here.
 */
export function buildAlliedHubProgramMarkdown(opts: AlliedHubReportOptions): string {
  const pathway = usAlliedPathwayOrThrow();
  const professions = listAlliedOccupationsFromRegistry();

  const lines: string[] = [];
  lines.push("# Allied Health hub — program inventory & minimum standards");
  lines.push("");
  lines.push(`_Generated: ${opts.generatedAtIso} (UTC)_`);
  lines.push("");
  lines.push("## Executive summary");
  lines.push("");
  lines.push(
    "- **Pathways:** `us-allied-core`, `ca-allied-core` share one marketing occupation model; public occupation hubs live at `/allied/{professionKey}` with canonical lessons/questions under `/allied/allied-health/...?alliedProfession=` when scoped.",
  );
  lines.push(
    "- **Counts:** `npm run report:allied-hub` appends **Part 3** with bounded Prisma inventory (see `src/lib/allied/allied-hub-inventory-counts.server.ts`) when `DATABASE_URL` is available; cells show `unavailable (reason)` instead of invented numbers.",
  );
  lines.push(
    "- **Figma / UI parity:** See `reports/allied-health-figma-ui-plan.md` for frames, tokens, and acceptance criteria before large UI refactors.",
  );
  lines.push("");

  lines.push("## Part 2 — Minimum content (per occupation)");
  lines.push("");
  lines.push("| Dimension | Minimum | Notes |");
  lines.push("|-----------|---------|--------|");
  for (const [k, v] of Object.entries(ALLIED_MINIMUM_CONTENT_PER_OCCUPATION)) {
    lines.push(`| ${k} | ${v} | Enforce via content pipeline + QA; CAT row applies when occupation unlocks adaptive marketing card |`);
  }
  lines.push("");

  lines.push("## Occupation-specific content expectations (curated)");
  lines.push("");
  for (const [key, bullets] of Object.entries(ALLIED_OCCUPATION_CONTENT_FOCUS)) {
    lines.push(`### ${key}`);
    lines.push("");
    lines.push(bulletList(bullets));
    lines.push("");
  }

  lines.push("## Part 1 — Inventory table (registry + routing + modules)");
  lines.push("");
  lines.push("| Occupation key | Public hub route | Pathway ID | Exam code | Hub category |");
  lines.push("|----------------|------------------|------------|-----------|----------------|");
  for (const p of professions) {
    lines.push(
      `| \`${p.professionKey}\` | \`${buildAlliedOccupationMarketingHubPath(p.professionKey)}\` | \`${p.pathwayId}\` | \`allied-health\` | ${p.hubCategory} |`,
    );
  }
  lines.push("");
  lines.push(`Global chooser: \`${ALLIED_GLOBAL_HUB_PATH}\`, canonical lessons base: \`${ALLIED_GLOBAL_HUB_PATH}/lessons\` (+ \`alliedProfession\` query).`);
  lines.push("");

  lines.push("### Premium module matrix (marketing grid, deterministic flags)");
  lines.push("");
  lines.push(
    `Flags: \`clinicalScenariosPublic=${opts.clinicalScenariosPublic}\`, \`oscePublic=${opts.oscePublic}\` (align with contract tests / feature flags).`,
  );
  lines.push("");
  lines.push("| Occupation | Study tools (keys) | Readiness | Locked study tools | CAT card unlocked (marketing) |");
  lines.push("|------------|--------------------|------------|--------------------|----------------------------------|");
  for (const p of professions) {
    const m = alliedPremiumModuleMatrixForOccupation(pathway, p.professionKey, {
      clinicalScenariosPublic: opts.clinicalScenariosPublic,
      oscePublic: opts.oscePublic,
    });
    lines.push(
      `| \`${p.professionKey}\` | ${m.studyToolKeys.map((k) => `\`${k}\``).join(", ")} | ${m.readinessKeys.map((k) => `\`${k}\``).join(", ")} | ${m.lockedStudyToolKeys.length ? m.lockedStudyToolKeys.map((k) => `\`${k}\``).join(", ") : "—"} | ${m.catMarketingUnlocked ? "yes" : "locked / de-emphasized"} |`,
    );
  }
  lines.push("");

  lines.push("### Inventory columns — DB-backed (see Part 3)");
  lines.push("");
  lines.push(bulletList([
    "Part 3 attaches live counts and compliance when the report script runs with database access.",
    "Deferred from automation: broken link crawl, DOM admin-leak scan, theme VR, Playwright evidence (see allied-health program report).",
  ]));
  lines.push("");

  lines.push("## Allied pathway registry reference");
  lines.push("");
  lines.push(`- Primary inventory pathway: \`${US_ALLIED_CORE_PATHWAY_ID}\``);
  lines.push("- See `src/lib/allied/allied-professions-registry.ts` for the authoritative occupation list.");
  lines.push("");

  return lines.join("\n");
}
