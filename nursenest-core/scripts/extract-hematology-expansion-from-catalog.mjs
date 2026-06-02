/**
 * Move hematology/oncology expansion rows out of catalog.json into
 * rn-nclex-hematology-oncology-expansion-catalog.json (cardio/neuro pattern).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../src/content/pathway-lessons");
const catalogPath = path.join(root, "catalog.json");
const outPath = path.join(root, "rn-nclex-hematology-oncology-expansion-catalog.json");

const SLUGS = new Set([
  "cbc-interpretation-nurses",
  "cbc-hgb-hct-platelets-wbc-priorities",
  "iron-deficiency-anemia-nclex",
  "pernicious-anemia-b12-deficiency",
  "folate-deficiency-anemia",
  "aplastic-anemia-nursing",
  "hemolytic-anemia-nursing",
  "thrombocytopenia-bleeding-precautions",
  "hemophilia-nursing-care",
  "disseminated-intravascular-coagulation-dic",
  "dvt-pe-prevention-nursing",
  "anticoagulant-safety-heparin-warfarin-doacs",
  "heparin-induced-thrombocytopenia-hit",
  "blood-product-administration-nursing",
  "blood-components-prbc-platelets-plasma-cryo",
  "transfusion-reactions-first-actions",
  "leukemia-nursing-care",
  "lymphoma-nursing-care",
  "multiple-myeloma-nursing-care",
  "oncologic-emergencies-nclex",
  "tumour-lysis-syndrome-tls",
  "superior-vena-cava-syndrome-svcs",
  "spinal-cord-compression-oncology",
  "hypercalcemia-malignancy",
  "chemotherapy-safety-side-effects",
  "radiation-therapy-nursing-care",
  "immunotherapy-targeted-therapy-basics",
  "cancer-pain-management-nursing",
  "nausea-vomiting-mucositis-cancer-care",
  "cancer-fatigue-nutrition",
  "central-lines-port-care-oncology",
  "bone-marrow-biopsy-nursing-care",
  "stem-cell-bone-marrow-transplant-basics",
  "oncology-infection-risk",
  "palliative-end-of-life-oncology-care",
  "which-hematology-patient-unstable",
  "which-oncology-patient-unstable",
  "hematology-oncology-priority-first-actions",
]);

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const pathways = { "ca-rn-nclex-rn": [], "us-rn-nclex-rn": [] };

for (const pid of Object.keys(pathways)) {
  const lessons = catalog.pathways[pid]?.lessons;
  if (!Array.isArray(lessons)) throw new Error(`missing ${pid}`);
  const kept = [];
  for (const l of lessons) {
    if (SLUGS.has(l.slug)) {
      pathways[pid].push(l);
    } else {
      kept.push(l);
    }
  }
  catalog.pathways[pid].lessons = kept;
}

if (pathways["ca-rn-nclex-rn"].length !== SLUGS.size || pathways["us-rn-nclex-rn"].length !== SLUGS.size) {
  throw new Error(
    `Expected ${SLUGS.size} lessons per pathway, got ca=${pathways["ca-rn-nclex-rn"].length} us=${pathways["us-rn-nclex-rn"].length}`,
  );
}

const expansion = {
  version: 1,
  generatedAt: new Date().toISOString(),
  source: "scripts/extract-hematology-expansion-from-catalog.mjs",
  pathways,
};

fs.writeFileSync(outPath, `${JSON.stringify(expansion, null, 2)}\n`);
fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Wrote ${outPath}; stripped ${SLUGS.size} slugs × 2 from catalog.json`);
