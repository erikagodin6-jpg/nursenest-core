#!/usr/bin/env node
/**
 * Restore missing homepage premium i18n keys into `public/i18n/en/pages.json`.
 *
 * Strategy: parse `src/components/marketing/home/*.tsx` for the patterns:
 *   tr("pages.home.<path>", "fallback")
 *   safeHomepageMarketingT(t, "pages.home.<path>", "fallback")
 * Resolve `${var}` template segments deterministically via maps below.
 * Only ADD missing keys — never overwrite existing English values; never insert placeholders.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
const homeDir = path.join(repoRoot, "src/components/marketing/home");
const routesFile = path.join(homeDir, "premium-homepage-routes.ts");
const pagesShard = path.join(repoRoot, "public/i18n/en/pages.json");

const TR_STR_RE = /(?:safeHomepageMarketingT\(\s*t\s*,|tr\()\s*"(pages\.home\.[^"]+)"\s*,\s*((?:"(?:\\.|[^"\\])*")|(?:`(?:[^`]|\\`)*`))/g;
const TR_TEMPLATE_RE = /(?:safeHomepageMarketingT\(\s*t\s*,|tr\()\s*`(pages\.home\.[^`]+)`\s*,\s*((?:"(?:\\.|[^"\\])*")|(?:`(?:[^`]|\\`)*`))/g;

const STEP_KEYS = ["read", "practice", "detectWeakness", "remediate", "reassess"];
const STEP_FALLBACKS = {
  read: { label: "Read", title: "Lessons", body: "Build the concept map with concise clinical teaching and exam-focused examples." },
  practice: { label: "Practice", title: "Questions", body: "Apply judgment to NGN-style prompts, rationales, and clinical distractors." },
  detectWeakness: { label: "Detect Weakness", title: "Readiness Signals", body: "Use recent results, domain trends, and weak-area routing to see what is slipping before exam day." },
  remediate: { label: "Remediate", title: "Flashcards and Focused Review", body: "Go straight into weak topics with recall drills, medication holds, precautions, and targeted refreshers." },
  reassess: { label: "Reassess", title: "CAT Readiness", body: "Return to adaptive practice to confirm the fix, rebuild confidence, and decide what to study next." },
};

const ECG_CORE_FEATURES = {
  telemetry: "Telemetry interpretation & rhythm foundations",
  adaptive: "Adaptive drills tied to lessons and practice",
  bedside: "Bedside judgment framing for exams and clinical reasoning",
  waveform: "Waveform literacy integrated with your study loop",
};
const ECG_ADVANCED_TEASERS = {
  lead12: "12-lead analysis & axis",
  icu: "ICU telemetry & deterioration scenarios",
  advancedStemi: "Advanced STEMI patterns & localization",
};

const CLINICAL_DEPTH_CARDS = {
  ecgTelemetry: { title: "ECG and Telemetry", body: "Build rhythm recognition, telemetry interpretation, and bedside pattern recognition inside the same study system." },
  labsInterpretation: { title: "Labs and Clinical Interpretation", body: "Connect ABGs, electrolytes, cultures, biomarkers, and trend shifts to the next safest nursing action." },
  clinicalScenarios: { title: "Clinical Scenarios", body: "Practice unfolding bedside judgment with escalation cues, prioritization, and exam-style distractors." },
  clinicalSkills: { title: "Clinical Skills and OSCE", body: "Rehearse communication, escalation, patient education, and safe bedside sequencing in a realistic flow." },
  medMath: { title: "Medication Safety and Med Math", body: "Review dosage calculations, high-alert medications, hold parameters, and administration safety with practical context." },
  newGrad: { title: "New Grad Readiness", body: "Bridge licensure prep into transition-to-practice confidence with specialty signals and bedside readiness framing." },
};

const READINESS_DOMAINS = {
  fundamentals: { name: "Fundamentals", score: "Strong" },
  pharmacology: { name: "Pharmacology", score: "Focus" },
  pediatrics: { name: "Pediatrics", score: "On track" },
  prioritization: { name: "Prioritization", score: "Building" },
};

const TRUST_CARDS = {
  amelia: { quote: "I finally felt like every study session moved my readiness instead of adding to the pile.", name: "Amelia, RN candidate", badge: "NCLEX-RN" },
  jordan: { quote: "The adaptive loop kept me focused on weak topics without making me feel behind.", name: "Jordan, PN graduate", badge: "NCLEX-PN" },
  priya: { quote: "Clinical reasoning practice felt like the bridge I needed between school and bedside.", name: "Priya, new grad RN", badge: "Transition to practice" },
};

function decodeLiteral(lit) {
  if (lit.startsWith('"') && lit.endsWith('"')) {
    try { return JSON.parse(lit); } catch { return lit.slice(1, -1); }
  }
  if (lit.startsWith("`") && lit.endsWith("`")) {
    const inner = lit.slice(1, -1);
    if (inner.includes("${")) return null;
    return inner;
  }
  return null;
}

const found = new Map();
function add(key, value) {
  if (!key || typeof value !== "string") return;
  if (!key.startsWith("pages.home.")) return;
  const trimmed = value.trim();
  if (!trimmed || /^pages\./.test(trimmed) || /placeholder/i.test(trimmed)) return;
  if (!found.has(key)) found.set(key, trimmed);
}

function scanFile(file) {
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(TR_STR_RE)) {
    const val = decodeLiteral(m[2]);
    if (val !== null) add(m[1], val);
  }
  for (const m of src.matchAll(TR_TEMPLATE_RE)) {
    const tplKey = m[1];
    if (tplKey.startsWith("pages.home.premium.studyEcosystem.steps.${step.key}.")) {
      const suffix = tplKey.replace("pages.home.premium.studyEcosystem.steps.${step.key}.", "");
      for (const stepKey of STEP_KEYS) {
        const key = `pages.home.premium.studyEcosystem.steps.${stepKey}.${suffix}`;
        if (["label","title","body"].includes(suffix)) add(key, STEP_FALLBACKS[stepKey][suffix]);
        else if (suffix === "cta") add(key, `Open ${STEP_FALLBACKS[stepKey].title}`);
      }
      continue;
    }
    if (tplKey === "pages.home.premium.ecg.coreFeatures.${item.key}") {
      for (const [k, v] of Object.entries(ECG_CORE_FEATURES)) add(`pages.home.premium.ecg.coreFeatures.${k}`, v);
      continue;
    }
    if (tplKey === "pages.home.premium.ecg.advancedTeasers.${item.key}") {
      for (const [k, v] of Object.entries(ECG_ADVANCED_TEASERS)) add(`pages.home.premium.ecg.advancedTeasers.${k}`, v);
      continue;
    }
    if (tplKey.startsWith("pages.home.premium.clinicalDepth.cards.${")) {
      const suffix = tplKey.split(".").slice(-1)[0];
      for (const [k, v] of Object.entries(CLINICAL_DEPTH_CARDS)) if (v[suffix]) add(`pages.home.premium.clinicalDepth.cards.${k}.${suffix}`, v[suffix]);
      continue;
    }
    if (tplKey.startsWith("pages.home.premium.readiness.domains.${")) {
      const suffix = tplKey.split(".").slice(-1)[0];
      for (const [k, v] of Object.entries(READINESS_DOMAINS)) if (v[suffix]) add(`pages.home.premium.readiness.domains.${k}.${suffix}`, v[suffix]);
      continue;
    }
    if (tplKey.startsWith("pages.home.premium.trust.cards.${")) {
      const suffix = tplKey.split(".").slice(-1)[0];
      for (const [k, v] of Object.entries(TRUST_CARDS)) if (v[suffix]) add(`pages.home.premium.trust.cards.${k}.${suffix}`, v[suffix]);
      continue;
    }
  }
}

const files = readdirSync(homeDir).filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"));
for (const f of files) scanFile(path.join(homeDir, f));

// Additional explicit keys from hero stats line (constructed dynamically so regex may miss).
add("pages.home.hero.statsLine.questions", "{{count}} practice questions");
add("pages.home.hero.statsLine.lessons", "{{count}} clinical lessons");
add("pages.home.hero.statsLine.separator", " \u00b7 ");
add("pages.home.hero.statsFallback", "Updated regularly");
add("pages.home.hero.noCreditCard", "No credit card required");
add("pages.home.hero.trust.evidence", "Evidence-based clinical learning");
add("pages.home.hero.trust.cat", "CAT-style readiness practice");

const pages = JSON.parse(readFileSync(pagesShard, "utf8"));
const additions = {};
let added = 0;
const skipped = [];
for (const [k, v] of [...found.entries()].sort()) {
  if (Object.prototype.hasOwnProperty.call(pages, k)) { skipped.push(k); continue; }
  additions[k] = v; added += 1;
}
const merged = { ...pages, ...additions };
const sortedKeys = Object.keys(merged).sort();
const out = {};
for (const k of sortedKeys) out[k] = merged[k];
writeFileSync(pagesShard, JSON.stringify(out, null, 2) + "\n", "utf8");

console.log(`[restore-homepage-i18n-keys] discovered=${found.size} added=${added} pre_existing=${skipped.length}`);
for (const k of Object.keys(additions).sort()) console.log(`  + ${k}`);
