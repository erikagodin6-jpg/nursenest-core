import { ALLIED_READINESS_MANIFEST, getAlliedReadinessAverage, listAlliedReadinessBelow } from "../src/lib/allied/allied-readiness-manifest";

type OutputFormat = "markdown" | "json";

function getOutputFormat(): OutputFormat {
  const arg = process.argv.find((value) => value.startsWith("--format="));
  const format = arg?.split("=")[1];
  if (format === "json") return "json";
  return "markdown";
}

const format = getOutputFormat();
const average = getAlliedReadinessAverage();
const belowNinetyNine = listAlliedReadinessBelow(99);
const complete = ALLIED_READINESS_MANIFEST.filter((entry) => entry.percentComplete === 100);
const nearComplete = ALLIED_READINESS_MANIFEST.filter((entry) => entry.percentComplete >= 95 && entry.percentComplete < 100);

if (format === "json") {
  console.log(
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        averagePercentComplete: average,
        counts: {
          total: ALLIED_READINESS_MANIFEST.length,
          complete: complete.length,
          nearComplete: nearComplete.length,
          belowNinetyNine: belowNinetyNine.length,
        },
        entries: ALLIED_READINESS_MANIFEST,
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

console.log("# Allied Health Readiness Report");
console.log("");
console.log(`Generated: ${new Date().toISOString()}`);
console.log(`Average readiness: ${average}%`);
console.log(`Tracked professions: ${ALLIED_READINESS_MANIFEST.length}`);
console.log(`Complete professions: ${complete.length}`);
console.log(`Near-complete professions: ${nearComplete.length}`);
console.log("");
console.log("| Profession | Percent | Status | Dedicated Catalog | Primary Remaining Gap |");
console.log("|---|---:|---|---|---|");

for (const entry of [...ALLIED_READINESS_MANIFEST].sort((a, b) => b.percentComplete - a.percentComplete || a.label.localeCompare(b.label))) {
  console.log(
    `| ${entry.label} | ${entry.percentComplete}% | ${entry.status} | ${entry.dedicatedCatalogFile ?? "pending"} | ${entry.remainingGaps[0] ?? "none"} |`,
  );
}

console.log("");
console.log("## Below 99%");
console.log("");

if (belowNinetyNine.length === 0) {
  console.log("All tracked allied professions are at or above 99% readiness.");
} else {
  for (const entry of belowNinetyNine) {
    console.log(`- ${entry.label}: ${entry.percentComplete}% — ${entry.remainingGaps.join("; ")}`);
  }
}
