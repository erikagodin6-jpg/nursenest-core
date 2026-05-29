#!/usr/bin/env node
/**
 * Restore missing homepage premium i18n keys into:
 *   - `public/i18n/en/pages.json` (Next shard source during local repair)
 *   - `tools/i18n/marketing/marketing-en.json` (canonical marketing source used by compile)
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
const marketingShard = path.join(repoRoot, "..", "tools/i18n/marketing/marketing-en.json");

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
  medSurg: { name: "Medical-surgical", score: "On track" },
  maternity: { name: "Maternity", score: "Focus" },
  psych: { name: "Psychiatric mental health", score: "Strong" },
};

const TRUST_CARDS = {
  amelia: { quote: "I finally felt like every study session moved my readiness instead of adding to the pile.", name: "Amelia, RN candidate", badge: "NCLEX-RN" },
  jordan: { quote: "The adaptive loop kept me focused on weak topics without making me feel behind.", name: "Jordan, PN graduate", badge: "NCLEX-PN" },
  priya: { quote: "Clinical reasoning practice felt like the bridge I needed between school and bedside.", name: "Priya, new grad RN", badge: "Transition to practice" },
  rn: {
    quote: "The platform tells me what to review next instead of leaving me to guess from a giant queue.",
    name: "RN candidate",
    badge: "Licensure prep learner",
  },
  pn: {
    quote: "Rationales walk through the clinical decision like an instructor at the bedside, not just correct or incorrect.",
    name: "PN learner",
    badge: "Practice question focus",
  },
  np: {
    quote: "Lessons, flashcards, and CAT-style practice feel like one study system instead of three disconnected apps.",
    name: "NP candidate",
    badge: "Graduate-level pathway",
  },
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
add("pages.home.premium.pathways.eyebrow", "Pathways");
add("pages.home.premium.pathways.rn.title", "RN");
add("pages.home.premium.pathways.rn.subtitle", "NCLEX-RN readiness");
add("pages.home.premium.pathways.rn.body", "Adaptive lessons, prioritization and delegation scenarios, weak-area targeting, and readiness loops for registered nurse candidates.");
add("pages.home.premium.pathways.rn.cta", "Explore RN");
add("pages.home.premium.pathways.pn.title", "PN / RPN");
add("pages.home.premium.pathways.pn.subtitle", "NCLEX-PN and REx-PN readiness");
add("pages.home.premium.pathways.pn.body", "Focused practical nursing prep across fundamentals, bedside safety, medication administration, and delegation.");
add("pages.home.premium.pathways.pn.cta", "Explore PN");
add("pages.home.premium.pathways.np.title", "NP");
add("pages.home.premium.pathways.np.subtitle", "CNPLE and specialty pathway discovery");
add("pages.home.premium.pathways.np.body", "Specialty-first nurse practitioner prep with pathway hubs for primary care, psych, women's health, pediatrics, and Canada-specific CNPLE discovery.");
add("pages.home.premium.pathways.np.cta", "Explore NP");
add("pages.home.premium.pathways.allied.title", "Allied Health");
add("pages.home.premium.pathways.allied.subtitle", "Cross-discipline certification prep");
add("pages.home.premium.pathways.allied.cta", "Explore Allied");
add("pages.home.premium.pathways.internationalRn.title", "International RN");
add("pages.home.premium.pathways.internationalRn.subtitle", "Region-aware readiness support");
add("pages.home.premium.pathways.internationalRn.body", "Country hubs and study resources help internationally educated nurses understand the pathway, exam expectations, and readiness gaps before they commit.");
add("pages.home.premium.pathways.internationalRn.cta", "Explore international RN");
add("pages.home.premium.studyEcosystem.steps.assess.label", "Assess");
add("pages.home.premium.studyEcosystem.steps.assess.title", "Readiness Signals");
add("pages.home.premium.studyEcosystem.steps.assess.body", "Use recent results, domain trends, and weak-area routing to see what is slipping before exam day.");
add("pages.home.premium.studyEcosystem.steps.assess.cta", "Open Readiness Signals");
add("pages.home.premium.studyEcosystem.steps.recall.label", "Recall");
add("pages.home.premium.studyEcosystem.steps.recall.title", "Flashcards and Focused Review");
add("pages.home.premium.studyEcosystem.steps.recall.body", "Go straight into weak topics with recall drills, medication holds, precautions, and targeted refreshers.");
add("pages.home.premium.studyEcosystem.steps.recall.cta", "Open Flashcards and Focused Review");
add("pages.home.premium.clinicalDepth.cards.pathophysiology.title", "Pathophysiology");
add("pages.home.premium.clinicalDepth.cards.pathophysiology.body", "Connect disease mechanisms to assessment cues, deterioration risk, and the safest next action.");
add("pages.home.premium.clinicalDepth.cards.diagnostics.title", "Diagnostics and Labs");
add("pages.home.premium.clinicalDepth.cards.diagnostics.body", "Practice interpreting trends, red flags, and abnormal values in the clinical context learners will see on exams and at the bedside.");
add("pages.home.premium.clinicalDepth.cards.interventions.title", "Interventions");
add("pages.home.premium.clinicalDepth.cards.interventions.body", "Learn which action comes first, what can wait, and what must be escalated when patient data changes.");
add("pages.home.premium.clinicalDepth.cards.medications.title", "Medication Safety");
add("pages.home.premium.clinicalDepth.cards.medications.body", "Review high-alert medications, hold parameters, monitoring cues, and patient teaching inside the same adaptive study loop.");
add("pages.home.premium.clinicalDepth.cards.pearls.title", "Clinical Pearls");
add("pages.home.premium.clinicalDepth.cards.pearls.body", "Turn each rationale into a practical pattern, memory hook, or recognition cue that supports long-term recall.");
add("pages.home.premium.clinicalDepth.cards.redFlags.title", "Red Flags");
add("pages.home.premium.clinicalDepth.cards.redFlags.body", "Spot urgent findings, escalation triggers, and unsafe distractors before they become missed priorities.");
add("pages.home.premium.readiness.eyebrow", "Readiness dashboard");
add("pages.home.premium.readiness.heading", "Know where to study next without guessing.");
add("pages.home.premium.readiness.body", "Readiness signals combine domain mastery, recent practice, and study momentum. The preview uses sample data only and avoids outcome guarantees.");
add("pages.home.premium.readiness.catCta", "See CAT practice");
add("pages.home.premium.readiness.previewLabel", "Sample readiness");
add("pages.home.premium.readiness.previewHeading", "On track with focused review");
add("pages.home.premium.readiness.previewBody", "Next priority: pediatric respiratory assessment and bronchodilator safety.");
add("pages.home.premium.readiness.metricNext.label", "Next 30 min");
add("pages.home.premium.readiness.metricNext.value", "Pediatric asthma set");
add("pages.home.premium.readiness.metricStreak.label", "Study streak");
add("pages.home.premium.readiness.metricStreak.value", "5 active days");
add("pages.home.premium.readiness.metricProgress.label", "Progress");
add("pages.home.premium.readiness.metricProgress.value", "42 items this week");
add("pages.home.premium.readiness.domains.pharmacology", "Pharmacology");
add("pages.home.premium.readiness.domains.medSurg", "Medical-surgical");
add("pages.home.premium.readiness.domains.maternity", "Maternity");
add("pages.home.premium.readiness.domains.pediatrics", "Pediatrics");
add("pages.home.premium.readiness.domains.psych", "Psychiatric mental health");
add("pages.home.premium.readiness.domains.fundamentals", "Fundamentals");
add("pages.home.premium.trust.eyebrow", "Learner experience");
add("pages.home.premium.trust.heading", "Calm focus beats last-minute cramming.");
add("pages.home.premium.trust.body", "Representative feedback from exam candidates, not outcome guarantees. Content stays exam-scoped with conservative claims.");
add("pages.home.premium.trust.cards.rn.quote", TRUST_CARDS.rn.quote);
add("pages.home.premium.trust.cards.rn.name", TRUST_CARDS.rn.name);
add("pages.home.premium.trust.cards.rn.badge", TRUST_CARDS.rn.badge);
add("pages.home.premium.trust.cards.pn.quote", TRUST_CARDS.pn.quote);
add("pages.home.premium.trust.cards.pn.name", TRUST_CARDS.pn.name);
add("pages.home.premium.trust.cards.pn.badge", TRUST_CARDS.pn.badge);
add("pages.home.premium.trust.cards.np.quote", TRUST_CARDS.np.quote);
add("pages.home.premium.trust.cards.np.name", TRUST_CARDS.np.name);
add("pages.home.premium.trust.cards.np.badge", TRUST_CARDS.np.badge);
add("pages.home.premium.bottomCta.assurance0", "Free to start");
add("pages.home.premium.bottomCta.assurance1", "No credit card required");
add("pages.home.premium.bottomCta.assurance2", "Cancel anytime");
add("pages.home.premium.bottomCta.eyebrow", "Start today");
add("pages.home.premium.bottomCta.heading", "Build a calmer study rhythm with NurseNest.");
add("pages.home.premium.bottomCta.body", "Create an account, choose your pathway, and start with lessons, flashcards, questions, and readiness tools that work together.");
add("pages.home.premium.bottomCta.primaryCta", "Create free account");
add("pages.home.premium.bottomCta.secondaryCta", "Compare subscription plans");
add("pages.home.premium.bottomCta.tiles.lessons.label", "Lessons");
add("pages.home.premium.bottomCta.tiles.lessons.title", "Browse clinical lessons");
add("pages.home.premium.bottomCta.tiles.schools.label", "Schools");
add("pages.home.premium.bottomCta.tiles.schools.title", "Explore partner institutions");
add("pages.home.premium.bottomCta.tiles.practice.label", "Practice");
add("pages.home.premium.bottomCta.tiles.practice.title", "Open question bank");

function mergeIntoJson(filePath) {
  const current = JSON.parse(readFileSync(filePath, "utf8"));
  const additions = {};
  let added = 0;
  const skipped = [];
  for (const [k, v] of [...found.entries()].sort()) {
    if (Object.prototype.hasOwnProperty.call(current, k)) { skipped.push(k); continue; }
    additions[k] = v; added += 1;
  }
  const merged = { ...current, ...additions };
  const sortedKeys = Object.keys(merged).sort();
  const out = {};
  for (const k of sortedKeys) out[k] = merged[k];
  writeFileSync(filePath, JSON.stringify(out, null, 2) + "\n", "utf8");
  return { added, skipped, additions };
}

const pagesResult = mergeIntoJson(pagesShard);
const marketingResult = mergeIntoJson(marketingShard);

console.log(`[restore-homepage-i18n-keys] discovered=${found.size} pages_added=${pagesResult.added} marketing_added=${marketingResult.added}`);
for (const k of Object.keys(marketingResult.additions).sort()) console.log(`  + ${k}`);
