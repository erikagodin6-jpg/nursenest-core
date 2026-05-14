#!/usr/bin/env tsx
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  buildHealthcareExamAuthorityUrlInventory,
  listHealthcareExamAuthorityPillars,
  listHealthcareExamEcosystemPages,
  listHealthcareExamTopicClusters,
  listLiveHealthcareExamAuthorityUrls,
} from "@/lib/seo/healthcare-exam-authority-architecture";

const outDir = path.join(process.cwd(), "reports");
mkdirSync(outDir, { recursive: true });

const inventory = buildHealthcareExamAuthorityUrlInventory();
const pillars = listHealthcareExamAuthorityPillars();
const ecosystem = listHealthcareExamEcosystemPages();
const clusters = listHealthcareExamTopicClusters();
const liveUrls = listLiveHealthcareExamAuthorityUrls();

const jsonPath = path.join(outDir, "healthcare-exam-seo-authority-inventory.json");
const mdPath = path.join(outDir, "healthcare-exam-seo-authority-architecture.md");

writeFileSync(
  jsonPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      counts: {
        pillars: pillars.length,
        ecosystemPages: ecosystem.length,
        topicClusters: clusters.length,
        inventoryRows: inventory.length,
        liveUrls: liveUrls.length,
        plannedRows: inventory.filter((row) => row.status === "planned").length,
      },
      liveUrls,
      inventory,
      topicClusters: clusters,
    },
    null,
    2,
  ),
);

const lines: string[] = [];
lines.push("# Healthcare Exam SEO Authority Architecture");
lines.push("");
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push("");
lines.push("## Summary");
lines.push("");
lines.push(`- Pillars: ${pillars.length}`);
lines.push(`- Ecosystem page definitions: ${ecosystem.length}`);
lines.push(`- Long-tail topic clusters: ${clusters.length}`);
lines.push(`- Live indexable URLs: ${liveUrls.length}`);
lines.push(`- Planned expansion rows: ${inventory.filter((row) => row.status === "planned").length}`);
lines.push("");
lines.push("## Live Pillar Routes");
lines.push("");
lines.push("| Family | Pillar | Canonical | Primary Queries |");
lines.push("|---|---|---|---|");
for (const pillar of pillars) {
  lines.push(
    `| ${pillar.family} | ${pillar.label} | \`${pillar.canonicalPath}\` | ${pillar.targetQueries.join("; ")} |`,
  );
}
lines.push("");
lines.push("## Live URL Inventory");
lines.push("");
lines.push("| Kind | Family | URL | Status |");
lines.push("|---|---|---|---|");
for (const row of inventory.filter((item) => item.status === "live")) {
  lines.push(`| ${row.kind} | ${row.family} | \`${row.canonicalPath}\` | ${row.status} |`);
}
lines.push("");
lines.push("## Planned Expansion Inventory");
lines.push("");
lines.push("| Kind | Family | Canonical Target | Planned Alias | Intent / Title |");
lines.push("|---|---|---|---|---|");
for (const row of inventory.filter((item) => item.status === "planned")) {
  lines.push(
    `| ${row.kind} | ${row.family} | \`${row.canonicalPath}\` | ${row.plannedAliasPath ? `\`${row.plannedAliasPath}\`` : ""} | ${row.title} |`,
  );
}
lines.push("");
lines.push("## Topic Clusters");
lines.push("");
lines.push("| Cluster | Families | Queries | Required Internal Links | Status |");
lines.push("|---|---|---|---|---|");
for (const cluster of clusters) {
  lines.push(
    `| ${cluster.canonicalTopic} | ${cluster.families.join(", ")} | ${cluster.targetQueries.join("; ")} | ${cluster.requiredInternalLinks.map((link) => `\`${link}\``).join(", ")} | ${cluster.status} |`,
  );
}
lines.push("");
lines.push("## Guardrails");
lines.push("");
lines.push("- Planned aliases are not emitted as live URLs until a substantive route exists.");
lines.push("- Live routes must resolve to existing route patterns.");
lines.push("- Pillars require FAQPage, EducationalCourse, and BreadcrumbList schema.");
lines.push("- Ecosystem hubs require FAQPage, BreadcrumbList, and ItemList or Article schema depending on intent.");
lines.push("- Every pillar must include conversion CTAs and internal links to questions, lessons, CAT, flashcards, or related hubs.");

writeFileSync(mdPath, `${lines.join("\n")}\n`);

console.log(`wrote ${jsonPath}`);
console.log(`wrote ${mdPath}`);
