/**
 * One-shot: add NP premium workstation marketing keys to English baseline + locale overlays.
 * Run from repo root: node scripts/add-np-premium-i18n-keys.mjs
 */
import fs from "node:fs";
import path from "node:path";

const KEYS = {
  "components.examPathwayHub.npPremium.workstationEyebrow": "NP clinical workstation",
  "components.examPathwayHub.npPremium.readinessTitle": "Readiness telemetry",
  "components.examPathwayHub.npPremium.readinessLead":
    "Adaptive pacing, timer budget, and item band for this pathway — pair with lessons and targeted drills before high-stakes runs.",
  "components.examPathwayHub.npPremium.metricItemBand": "Item band",
  "components.examPathwayHub.npPremium.metricTimer": "Timer budget",
  "components.examPathwayHub.npPremium.metricModeShort": "Delivery mode",
  "components.examPathwayHub.npPremium.specialtyTitle": "Specialty focus · {{track}}",
  "components.examPathwayHub.npPremium.specialtyLead":
    "Recommendations emphasize diagnostic reasoning, pharmacology safety, and advanced assessment depth for this board specialty.",
  "components.examPathwayHub.npPremium.diagnosticBlockTitle": "Diagnostic reasoning",
  "components.examPathwayHub.npPremium.diagnosticBlockBody":
    "Open mixed pathway questions to train differentials, red-flag recognition, and evidence-weighting under time pressure.",
  "components.examPathwayHub.npPremium.pharmBlockTitle": "Pharmacology emphasis",
  "components.examPathwayHub.npPremium.pharmBlockBody":
    "Prescribing-adjacent drills: mechanisms, monitoring, interactions, and deprescribing judgment scoped to your NP track.",
  "components.examPathwayHub.npPremium.assessmentTitle": "Advanced assessment",
  "components.examPathwayHub.npPremium.assessmentBody":
    "Targeted exam elements that change pretest probability — history, focused exam, and interpretation before management jumps.",
  "components.examPathwayHub.npPremium.integrationTitle": "ECG · labs · cases · OSCE",
  "components.examPathwayHub.npPremium.integrationLead":
    "Telemetry, lab interpretation, branching cases, and station-style communication — linked into the same pathway entitlements you use in-app.",
  "components.examPathwayHub.npPremium.reportTitle": "Report card & progression",
  "components.examPathwayHub.npPremium.reportBody":
    "Momentum signals pair lesson progress with accuracy-style bands so you can see where confidence is still volatile.",
  "components.examPathwayHub.npPremium.quickLaunchTitle": "Quick launch",
  "components.examPathwayHub.npPremium.diagnosticRouteNote":
    "There is no standalone “diagnostic reasoning” URL; use mixed pathway questions (same deep link as NGN-style mixed practice).",
  "components.examPathwayHub.npPremium.guestSignInHint": "Sign in to open in-app destinations with your pathway context preserved.",
};

const root = path.resolve(import.meta.dirname, "..");
const files = [
  path.join(root, "tools/i18n/marketing/marketing-en.json"),
  ...fs
    .readdirSync(path.join(root, "tools/i18n/marketing/locale"))
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(root, "tools/i18n/marketing/locale", f)),
];

for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  const json = JSON.parse(raw);
  for (const [k, v] of Object.entries(KEYS)) {
    json[k] = v;
  }
  fs.writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
}
console.log(`Updated ${files.length} marketing locale files with ${Object.keys(KEYS).length} keys.`);
