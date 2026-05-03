#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const APP_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const I18N_ROOT = path.join(APP_ROOT, "public", "i18n");
const REPORT_DIR = path.join(APP_ROOT, "reports");
const APPLY = process.argv.includes("--apply");
const SHARDS = ["allied", "auth", "billing", "brand", "common", "components", "errors", "learner", "marketing", "nav", "pages"];

const SPANISH_OVERRIDES = {
  "learner.shell.nav.printouts": "Materiales imprimibles",
  "learner.qbank.peer.heading": "Rendimiento de la clase",
  "learner.qbank.peer.youSelected": "Seleccionaste:",
  "learner.qbank.peer.correctAnswer": "Respuesta correcta:",
  "learner.qbank.peer.noneSelected": "(sin selección)",
  "learner.qbank.peer.classCorrect": "Estudiantes que respondieron correctamente esta pregunta: {{pct}}%",
  "learner.qbank.peer.optionDistributionAria": "Distribución de opciones de respuesta entre estudiantes",
  "learner.qbank.peer.tagCorrect": "respuesta correcta",
  "learner.qbank.peer.tagYours": "tu respuesta",
  "learner.printables.title": "Materiales imprimibles",
  "learner.printables.subtitle": "Recursos de estudio que puedes descargar cuando estén disponibles para tu plan.",
  "learner.printables.empty": "Todavía no hay materiales imprimibles que coincidan con este filtro.",
  "learner.printables.loadError": "No pudimos cargar los materiales imprimibles. Inténtalo de nuevo en breve.",
  "learner.printables.locked": "La tienda de materiales imprimibles no está disponible.",
  "learner.printables.download": "Descargar",
  "learner.printables.badgeFree": "Gratis",
  "learner.printables.badgeProIncluded": "Incluido en Pro",
};

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return {};
  }
}

function writeJson(file, data) {
  const normalized = file.replace(/\\/g, "/");
  if (/\/public\/i18n\/(?:en|fr)\//.test(normalized)) {
    throw new Error(`Refusing to write protected locale file: ${file}`);
  }
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

fs.mkdirSync(REPORT_DIR, { recursive: true });
const changes = [];

for (const shard of SHARDS) {
  const enFile = path.join(I18N_ROOT, "en", `${shard}.json`);
  const esFile = path.join(I18N_ROOT, "es", `${shard}.json`);
  const en = readJson(enFile);
  const es = readJson(esFile);
  let changed = false;
  for (const [key, value] of Object.entries(en)) {
    if (typeof value !== "string") continue;
    const current = es[key];
    if (typeof current === "string" && current.trim() !== "") continue;
    const proposed = SPANISH_OVERRIDES[key];
    changes.push({
      shard,
      key,
      action: APPLY && proposed ? "write-es" : "dry-run",
      proposed: proposed ?? value,
      needsReview: proposed == null,
    });
    if (APPLY && proposed) {
      es[key] = proposed;
      changed = true;
    }
  }
  if (APPLY && changed) writeJson(esFile, es);
}

const report = {
  generatedAt: new Date().toISOString(),
  dryRun: !APPLY,
  applied: APPLY,
  changedKeys: changes.length,
  reviewRequired: changes.filter((change) => change.needsReview).length,
  changes,
};

fs.writeFileSync(path.join(REPORT_DIR, "translate-es-missing-report.json"), JSON.stringify(report, null, 2));
console.log(`[i18n:translate:es] ${APPLY ? "applied" : "dry-run"}; ${changes.length} missing Spanish keys found.`);
