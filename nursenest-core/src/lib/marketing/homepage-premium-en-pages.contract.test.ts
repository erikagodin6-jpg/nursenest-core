/**
 * Contract: canonical English `public/i18n/en/pages.json` ships premium homepage copy
 * (no stub titles, no raw key paths as values).
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const PAGES_JSON = path.resolve(process.cwd(), "public/i18n/en/pages.json");

const REQUIRED_KEYS: Record<string, string> = {
  "pages.home.hero.eyebrow": "Canada-first nursing exam prep",
  "pages.home.hero.headlinePremium": "Pass the boards with a calm, clinical study companion.",
  "pages.home.hero.subheadingPremium":
    "Study with lessons, flashcards, rationales, and readiness tools built for RN, RPN, NP, and allied health learners.",
  "pages.home.hero.premiumPrimaryCta": "Start free",
  "pages.home.hero.premiumSecondaryCta": "View pricing",
  "pages.home.hero.panel.live": "Live readiness preview",
  "pages.home.hero.panel.readinessLabel": "Readiness",
  "pages.home.hero.panel.streakLabel": "Study streak",
  "pages.home.hero.panel.masteredLabel": "Mastered topics",
  "pages.home.hero.panel.ecgLabel": "ECG practice",
  "pages.home.premium.readiness.dashboardCta": "Open dashboard",
  "pages.home.hero.eyebrowAdaptive": "Adaptive Clinical Readiness",
  "pages.home.hero.headlineAdaptive": "Master Nursing. Think Like a Clinician.",
  "pages.home.hero.subheadingAdaptive":
    "Study with lessons, NGN practice, simulations, ECG, telemetry, labs, competency tracking, and CAT readiness—built for RN, PN or RPN, NP, allied health, and pre-nursing learners.",
  "pages.home.hero.panel.tag": "Adaptive Readiness Preview",
  "pages.home.hero.panel.live": "Live Clinical Readiness Preview",
  "pages.home.hero.panel.readinessValue": "78%",
  "pages.home.hero.panel.streakValue": "9 days",
  "pages.home.hero.panel.masteredUnit": "cards",
  "pages.home.hero.panel.ecgLabel": "Lead II · Normal Sinus Rhythm",
  "pages.home.hero.panel.ecgBpm": "72 bpm",
  "pages.home.hero.panel.mini1.title": "Labs and Clinical Interpretation",
  "pages.home.hero.panel.mini1.sub": "79% readiness · weak areas detected",
  "pages.home.hero.panel.mini2.title": "Medication Safety and Med Math",
  "pages.home.hero.panel.mini2.sub": "54% readiness · focused review queued",
  "pages.home.premium.pathways.heading": "Every Path Has Its Own Clinical Scaffold.",
  "pages.home.premium.pathways.body":
    "Choose the lane that matches your role. RN, PN or RPN, NP, allied health, and pre-nursing each keep their own public entry points and readiness framing.",
  "pages.home.premium.pathways.allied.body":
    "Occupation-aware study hubs for allied roles with practice modes scoped to each profession.",
  "pages.home.premium.pathways.preNursing.title": "Pre-Nursing",
  "pages.home.premium.pathways.preNursing.subtitle": "Public foundations and study planning",
  "pages.home.premium.pathways.preNursing.body":
    "Start with open foundations, prerequisite science support, and study planning before role-specific licensure prep.",
  "pages.home.premium.pathways.preNursing.cta": "Explore Pre-Nursing",
  "pages.home.premium.pathways.international.badge": "International RN",
  "pages.home.premium.pathways.international.heading": "Live Hubs and Foundation Coverage Vary by Region.",
  "pages.home.premium.pathways.international.body":
    "Launched country hubs are live, but not every international route carries the same readiness system or CAT depth yet. Keep regional expectations explicit.",
  "pages.home.premium.pathways.international.live": "Live Now: Launched Country Hubs",
  "pages.home.premium.pathways.international.cta": "View a Live International Hub",
  "pages.home.premium.studyEcosystem.eyebrow": "Adaptive Loop",
  "pages.home.premium.studyEcosystem.heading": "Read → Practice → Detect Weakness → Remediate → Reassess",
  "pages.home.premium.studyEcosystem.body":
    "The same study destinations read as one adaptive clinical workflow—linking lessons, NGN practice, simulations, remediation, and CAT reassessment.",
  "pages.home.premium.studyEcosystem.steps.read.label": "Read",
  "pages.home.premium.studyEcosystem.steps.read.title": "Lessons",
  "pages.home.premium.studyEcosystem.steps.read.body":
    "Build the concept map with concise clinical teaching and exam-focused examples.",
  "pages.home.premium.studyEcosystem.steps.read.cta": "Open Lessons",
  "pages.home.premium.studyEcosystem.steps.practice.label": "Practice",
  "pages.home.premium.studyEcosystem.steps.practice.title": "Questions",
  "pages.home.premium.studyEcosystem.steps.practice.body":
    "Apply judgment to NGN-style prompts, simulations, rationales, and clinical distractors.",
  "pages.home.premium.studyEcosystem.steps.practice.cta": "Open Questions",
  "pages.home.premium.studyEcosystem.steps.detectWeakness.label": "Detect Weakness",
  "pages.home.premium.studyEcosystem.steps.detectWeakness.title": "Readiness Signals",
  "pages.home.premium.studyEcosystem.steps.detectWeakness.body":
    "Use recent results, domain trends, Harm Index signals, and weak-area routing before exam day.",
  "pages.home.premium.studyEcosystem.steps.detectWeakness.cta": "Open Readiness Signals",
  "pages.home.premium.studyEcosystem.steps.remediate.label": "Remediate",
  "pages.home.premium.studyEcosystem.steps.remediate.title": "Flashcards and Focused Review",
  "pages.home.premium.studyEcosystem.steps.remediate.body":
    "Go straight into weak topics with recall drills, medication holds, precautions, and targeted refreshers.",
  "pages.home.premium.studyEcosystem.steps.remediate.cta": "Open Flashcards and Focused Review",
  "pages.home.premium.studyEcosystem.steps.reassess.label": "Reassess",
  "pages.home.premium.studyEcosystem.steps.reassess.title": "CAT Readiness",
  "pages.home.premium.studyEcosystem.steps.reassess.body":
    "Return to adaptive practice to confirm the fix, rebuild confidence, and decide what to study next.",
  "pages.home.premium.studyEcosystem.steps.reassess.cta": "Open CAT Readiness",
  "pages.home.premium.clinicalDepth.eyebrow": "Clinical Readiness Ecosystems",
  "pages.home.premium.clinicalDepth.heading": "A full clinical reasoning ecosystem.",
  "pages.home.premium.clinicalDepth.body":
    "NurseNest spans ECG and telemetry, NGN judgment, branching simulations, labs, medication safety, clinical skills, competency tracking, and new-graduate readiness—integrated, not siloed.",
  "pages.home.premium.clinicalDepth.priorityCueLabel": "Platform Rule",
  "pages.home.premium.clinicalDepth.priorityCueBody":
    "These readiness domains are integrated into the same learner ecosystem, not broken out into disconnected tools or mini-apps.",
  "pages.home.premium.clinicalDepth.cards.ecgTelemetry.title": "ECG and Telemetry",
  "pages.home.premium.clinicalDepth.cards.ecgTelemetry.body":
    "Build rhythm recognition, telemetry interpretation, and bedside pattern recognition inside the same study system.",
  "pages.home.premium.clinicalDepth.cards.labsInterpretation.title": "Labs and Clinical Interpretation",
  "pages.home.premium.clinicalDepth.cards.labsInterpretation.body":
    "Connect ABGs, electrolytes, cultures, biomarkers, and trend shifts to the next safest nursing action.",
  "pages.home.premium.clinicalDepth.cards.clinicalScenarios.title": "Clinical Scenarios",
  "pages.home.premium.clinicalDepth.cards.clinicalScenarios.body":
    "Practice unfolding bedside judgment with escalation cues, prioritization, and exam-style distractors.",
  "pages.home.premium.clinicalDepth.cards.clinicalSkills.title": "Clinical Skills and OSCE",
  "pages.home.premium.clinicalDepth.cards.clinicalSkills.body":
    "Rehearse communication, escalation, patient education, and safe bedside sequencing in a realistic flow.",
  "pages.home.premium.clinicalDepth.cards.medMath.title": "Medication Safety and Med Math",
  "pages.home.premium.clinicalDepth.cards.medMath.body":
    "Review dosage calculations, high-alert medications, hold parameters, and administration safety with practical context.",
  "pages.home.premium.clinicalDepth.cards.newGrad.title": "New Grad Readiness",
  "pages.home.premium.clinicalDepth.cards.newGrad.body":
    "Bridge licensure prep into transition-to-practice confidence with specialty signals and bedside readiness framing.",
  "pages.home.premium.ecg.coreEyebrow": "Integrated Telemetry Learning",
  "pages.home.premium.ecg.coreHeading": "Adaptive ECG Education Built Into NurseNest, Not a Bolt-On Simulator.",
  "pages.home.premium.ecg.coreBody":
    "Build telemetry literacy with nursing-focused rhythm recognition, interpretation workflows, and practice-aligned reinforcement across RN, NP, allied, and new grad pathways.",
  "pages.home.premium.ecg.coreFeaturesLabel": "Core ECG highlights",
  "pages.home.premium.ecg.coreFeatures.telemetry": "Telemetry interpretation & rhythm foundations",
  "pages.home.premium.ecg.coreFeatures.adaptive": "Adaptive drills tied to lessons and practice",
  "pages.home.premium.ecg.coreFeatures.bedside": "Bedside judgment framing for exams and clinical reasoning",
  "pages.home.premium.ecg.coreFeatures.waveform": "Waveform literacy integrated with your study loop",
  "pages.home.premium.ecg.stripLabel": "Lead II · Normal Sinus Rhythm",
  "pages.home.premium.ecg.stripBpm": "72 bpm",
  "pages.home.premium.ecg.stripAria": "Illustrative sinus rhythm strip for marketing",
  "pages.home.premium.ecg.coreCtaLessons": "Explore lessons",
  "pages.home.premium.ecg.coreCtaQuestions": "Practice questions",
  "pages.home.premium.ecg.coreFootnote":
    "Core ECG learning is woven into the NurseNest study ecosystem for eligible learners — pathways, practice, and readiness surfaces stay coordinated.",
  "pages.home.premium.ecg.advancedBadge": "Coming soon",
  "pages.home.premium.ecg.advancedHeading": "Advanced ECG & Telemetry Mastery",
  "pages.home.premium.ecg.advancedBody":
    "A future specialty premium program for immersive workstation-style telemetry training — advanced rhythms, 12-lead depth, ICU scenarios, and telemetry analytics.",
  "pages.home.premium.ecg.advancedTeasers.lead12": "12-lead analysis & axis",
  "pages.home.premium.ecg.advancedTeasers.icu": "ICU telemetry & deterioration scenarios",
  "pages.home.premium.ecg.advancedTeasers.advancedStemi": "Advanced STEMI patterns & localization",
  "pages.home.premium.ecg.advancedCta": "View plans & upgrades",
  "pages.home.premium.ecg.advancedDisclaimer":
    "Advanced ECG & Telemetry Mastery is not included with standard RN/PN/NP/allied subscriptions. Availability and pricing will be announced separately.",
};

const FORBIDDEN_SUBSTRINGS = ["placeholder", "headline premium", "subheading premium", "readiness label"] as const;

describe("homepage premium EN pages.json contract", () => {
  it("has required keys with expected production copy", () => {
    const raw = fs.readFileSync(PAGES_JSON, "utf8");
    const pages = JSON.parse(raw) as Record<string, string>;

    for (const [key, expected] of Object.entries(REQUIRED_KEYS)) {
      assert.equal(typeof pages[key], "string", `missing key: ${key}`);
      assert.equal(pages[key].trim(), expected, key);
    }
  });

  it("does not ship forbidden placeholder fragments on premium home keys", () => {
    const raw = fs.readFileSync(PAGES_JSON, "utf8");
    const pages = JSON.parse(raw) as Record<string, string>;
    const prefix = "pages.home.";
    for (const [key, val] of Object.entries(pages)) {
      if (!key.startsWith(prefix)) continue;
      if (typeof val !== "string") continue;
      const lower = val.toLowerCase();
      for (const bad of FORBIDDEN_SUBSTRINGS) {
        assert.ok(!lower.includes(bad), `forbidden "${bad}" in ${key}=${JSON.stringify(val.slice(0, 120))}`);
      }
      assert.ok(
        !/^(pages|learner|marketing|components|home|nav|footer)\.[a-z0-9_.]+$/i.test(val.trim()),
        `raw i18n path as value: ${key}`,
      );
    }
  });
});
