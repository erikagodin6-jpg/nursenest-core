#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const APP_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const I18N_ROOT = path.join(APP_ROOT, "public", "i18n");
const REPORT_DIR = path.join(APP_ROOT, "reports");
const APPLY = process.argv.includes("--apply");
const DRY_RUN = !APPLY || process.argv.includes("--dry-run");
const SHARDS = ["nav", "auth", "billing", "brand", "common", "components", "errors", "learner", "marketing", "pages", "allied"];
const PROTECTED = ["NurseNest", "REx-PN", "NCLEX", "CPNRE", "OSCE", "CAT", "RN", "RPN", "PN", "NP", "NGN", "NCSBN", "CASN"];

const GLOSSARY = new Map([
  ["practice questions", "questions d'entraînement"],
  ["flashcards", "cartes mémoire"],
  ["rationale", "justification"],
  ["care plan", "plan de soins"],
  ["clinical judgment", "jugement clinique"],
  ["priority assessment", "évaluation prioritaire"],
  ["medication administration", "administration des médicaments"],
  ["dosage calculation", "calcul de dose"],
  ["patient safety", "sécurité des patients"],
  ["infection prevention", "prévention des infections"],
  ["therapeutic communication", "communication thérapeutique"],
  ["scope of practice", "champ d'exercice"],
  ["professional accountability", "responsabilité professionnelle"],
  ["health assessment", "évaluation de la santé"],
  ["pediatrics", "pédiatrie"],
  ["maternity", "maternité"],
  ["mental health", "santé mentale"],
  ["pharmacology", "pharmacologie"],
  ["medical-surgical nursing", "soins infirmiers médico-chirurgicaux"],
  ["practical nurse", "infirmière auxiliaire autorisée"],
  ["registered practical nurse", "infirmière auxiliaire autorisée"],
  ["registered nurse", "infirmière autorisée"],
  ["nurse practitioner", "infirmière praticienne"],
  ["nursing exam prep", "préparation aux examens infirmiers"],
]);

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return {};
  }
}

function writeJson(file, data) {
  const normalized = file.replace(/\\/g, "/");
  if (/\/public\/i18n\/en\//.test(normalized)) {
    throw new Error(`Refusing to write English source file: ${file}`);
  }
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function preserveProtected(original, translated) {
  let out = translated;
  for (const term of PROTECTED) {
    const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    if (re.test(original)) out = out.replace(re, term);
  }
  return out;
}

function candidateTranslation(value) {
  let out = String(value);
  for (const [en, fr] of GLOSSARY) {
    out = out.replace(new RegExp(`\\b${en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi"), fr);
  }
  return preserveProtected(value, out);
}

fs.mkdirSync(REPORT_DIR, { recursive: true });
const changes = [];

for (const shard of SHARDS) {
  const enFile = path.join(I18N_ROOT, "en", `${shard}.json`);
  const frFile = path.join(I18N_ROOT, "fr", `${shard}.json`);
  const en = readJson(enFile);
  const fr = readJson(frFile);
  let changed = false;
  for (const [key, value] of Object.entries(en)) {
    if (typeof value !== "string") continue;
    const current = fr[key];
    if (typeof current === "string" && current.trim() !== "" && current !== value) continue;
    const proposed = candidateTranslation(value);
    const needsReview = proposed === value || /^[\x00-\x7F\s.,;:!?'"()/$%&+-]+$/.test(proposed);
    changes.push({ shard, key, action: APPLY ? "write-fr" : "dry-run", needsReview, proposed });
    if (APPLY) {
      fr[key] = needsReview ? `${proposed} [FR REVIEW REQUIRED]` : proposed;
      changed = true;
    }
  }
  if (APPLY && changed) writeJson(frFile, fr);
}

const report = {
  generatedAt: new Date().toISOString(),
  dryRun: DRY_RUN,
  applied: APPLY,
  locale: "fr",
  changedKeys: changes.length,
  reviewRequired: changes.filter((c) => c.needsReview).length,
  changes: changes.slice(0, 500),
};

fs.writeFileSync(path.join(REPORT_DIR, "translate-fr-missing-report.json"), JSON.stringify(report, null, 2));
console.log(`[i18n:translate:fr] ${APPLY ? "applied" : "dry-run"}; ${changes.length} French keys need fill/review. Report: reports/translate-fr-missing-report.json`);
