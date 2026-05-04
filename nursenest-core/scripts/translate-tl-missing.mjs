#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const APP_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const REPO_ROOT = path.resolve(APP_ROOT, "..");
const I18N_ROOT = path.join(APP_ROOT, "public", "i18n");
const CLIENT_I18N_ROOT = path.join(REPO_ROOT, "client", "public", "i18n");
const REPORT_DIR = path.join(APP_ROOT, "reports");
const CACHE_DIR = path.join(APP_ROOT, ".cache");
const CACHE_FILE = path.join(CACHE_DIR, "translate-tl-google-cache.json");
const APPLY = process.argv.includes("--apply");
const DRY_RUN = !APPLY;
const LOCALE = "tl";

const SHARDS = ["allied", "auth", "billing", "brand", "common", "components", "errors", "learner", "marketing", "nav", "pages"];

const PROTECTED_TERMS = [
  "NurseNest", "REx-PN", "NCLEX-RN", "NCLEX-PN", "NCLEX", "CPNRE", "OSCE", "CAT", "ECG", "EKG", "IV",
  "BP", "HR", "SpO2", "RN", "RPN", "PN", "NP", "NGN", "NCSBN", "CASN", "LPN", "LVN", "NNQE", "UWorld",
  "Archer", "Klarna", "Afterpay", "Affirm", "LinkedIn",
  "Flashcards", "Status", "Status:", "Dose", "Normal", "Total", "Popular", "Individual", "Original", "Regular",
  "Serif", "Cardiovascular", "Cardiovascular:", "Gastrointestinal", "Neonatal", "Distal", "Medial", "Lateral",
  "Superficial", "Superior", "Inferior", "Anterior (ventral)", "Posterior (dorsal)", "Anorexia Nervosa",
  "Bulimia Nervosa", "Impetigo", "Galactosemia", "Glaucoma", "Neuroblastoma", "Retinoblastoma", "Vitiligo",
  "Pneumonia:", "YouTube", "NurseNest Pro", "Erika Godin, RN", "James T.", "Priya K.", "China (NNQE)",
  "bpm", "SpO2", "pH", "pH:", "gtt/min", "Hct", "Endo-", "Epi-", "Inter-", "Intra-", "Peri-", "Retro-",
  "Sub-", "Trans-", "Esc", "min", "receptor", "Dup", "PNG, SVG, JPG, WebP", "RN (BScN)",
  "NP (AANP, ANCC, FNP-BC)", "Anion Gap = Na⁺ - (Cl⁻ + HCO₃⁻) — Normal: 8-12 mEq/L", "HR (bpm)", "-ia",
  "D", "S", "T", "Q", "F", "M", "W",
  "nursenest.ca", "{{exam}} CAT", "Levetiracetam (Keppra)", "Volume (mL)", "Nepal", "Mosteller:",
  "Normal: 22-26", "Normal: 80-100", "support@nursenest.ca", "150 µmol/L", "Conv. Normal", "SI Normal",
  "{{region}} · {{shortName}}",
];

const ACCEPTABLE_TAGALOG_ENGLISH_LABELS = /\b(?:Dashboard|Premium|Blog|Draft|Account|Profile|Format|Email|Password|Analytics|Adaptive|Mastery|Flashcard|Flashcards|Practice|Mock|Exam|Exams|Hub|Test Bank|Allied Health|Diagnostic Imaging|Medical Lab Tech|Occupational Therapy|Paramedic|Psychotherapy|Respiratory Therapy|Pharmacology|Contraindications|Pathophysiology|Vital Signs|Neurological|Pediatrics|Differential Diagnosis|Perioperative|Med Math|Hematology|Endocrine|Transition to Practice|Clinical Judgment|Readiness|Report card|Study Coach|Study Streak|Learn Mode|Review Mode|Practice Mode|Question Pack|Flashcard Pack|Career Hub|Healthcare Encyclopedia|Australia|Canada|Ireland|Nepal|New Zealand|Saudi Arabia|United Arab Emirates|United Kingdom)\b/i;

const TAGALOG_OVERRIDES = {
  "common:nursenest.ca": "nursenest.ca",
  "breadcrumbs.home": "Home",
  "breadcrumbs.pricing": "Presyo",
  "breadcrumbs.lessons": "Mga aralin",
  "breadcrumbs.questionBank": "Mga practice questions",
  "nav.home": "Home",
  "nav.pricing": "Presyo",
  "nav.lessons": "Mga aralin",
  "nav.practiceQuestions": "Mga practice questions",
  "nav.flashcards": "Flashcards",
  "nav.login": "Mag-log in",
  "nav.signup": "Magsimula",
  "footer.ecosystem": "Ecosystem ng NurseNest",
  "footer.feedback": "Feedback",
  "footer.traumaGuide": "Gabay sa trauma nursing",
  "nav.allied.testBank": "Test bank",
  "nav.anatomy": "Anatomy",
  "nav.clinicalLessons": "Nursing",
  "nav.diagnosticImaging": "Diagnostic imaging",
  "nav.ecosystem": "Ecosystem ng NurseNest",
  "nav.newGradCareer": "Nursing (RPN/RN)",
  "nav.npAdvanced": "NP/Advanced",
  "nav.dashboard": "Dashboard mo",
  "nav.seoDashboard": "SEO dashboard",
  "nav.preNursing": "Pre-nursing",
  "nav.preNursingFoundations": "Pre-nursing foundations",
  "nav.previewMode": "Preview mode",
  "nav.screenshotStudio": "Screenshot studio",
  "nav.tierDrop.preNursingTitle": "Pre-nursing foundations",
  "pages.home.audience.np.title": "Nurse practitioners",
  "pages.examReadinessDemo.demoStudent": "Demo student",
  "pages.examStudyGuide.passingScore": "Passing score",
  "pages.home.metaTitleCA": "NurseNest | Paghahanda para sa nursing exams sa Canada",
  "pages.home.metaDescriptionCA": "Mga aralin, practice questions, flashcards, at readiness tracking para sa REx-PN, NCLEX-RN, NP, at Allied Health.",
  "pages.home.metaTitleUS": "NurseNest | Paghahanda para sa nursing exams",
  "pages.home.metaDescriptionUS": "Mga aralin, practice questions, flashcards, at readiness tracking para sa NCLEX-RN, NCLEX-PN, NP, at Allied Health.",
  "pages.pricing.title": "Presyo ng NurseNest",
  "pages.pricing.description": "Simple na mga plano para sa paghahanda sa nursing at healthcare exams. Mag-aral gamit ang mga aralin, practice questions, flashcards, at adaptive mock exams.",
  "pages.publicQuestionBank.metaTitleCA": "Mga practice questions | REx-PN, NCLEX-RN, NP, at Allied Health",
  "pages.publicQuestionBank.metaDescriptionCA": "Practice questions, rationales, at review ng mahihinang topic para sa nursing at healthcare exam prep na nakaayon sa Canada.",
  "pages.publicQuestionBank.metaTitleUS": "Mga practice questions | NCLEX-RN, NCLEX-PN, NP, at Allied Health",
  "pages.publicQuestionBank.metaDescriptionUS": "Practice questions, rationales, at review ng mahihinang topic para sa nursing at healthcare exam prep.",
  "pages.publicQuestionBank.metaTitle": "NCLEX at REx-PN practice questions | NurseNest",
  "pages.publicQuestionBank.metaDescription": "Public overview ng NurseNest question bank para sa NCLEX-RN, NCLEX-PN, REx-PN, at NP tracks. Mag-sign up para mag-practice sa app.",
  "pages.publicQuestionBank.h1": "Nursing practice questions",
  "pages.publicQuestionBank.intro": "Pumili ng questions ayon sa exam pathway, basahin ang rationale, at mag-practice ulit sa mahihinang topics.",
  "pages.examPrepHub.examPrepHub": "Hub sa exam prep",
  "pages.examPrepHub.examPrepHubHealthcareCertification": "Hub sa exam prep: study resources para sa healthcare certification | NurseNest",
  "pages.healthcareCareersHub.examPrepHub": "Hub sa exam prep",
  "pages.healthcareCareersHub.examPrepHub2": "Hub sa exam prep",
  "pages.healthcareCertificationsHub.examPrepHub": "Hub sa exam prep",
  "pages.newGraduateSupportHub.examPrepHub": "Hub sa exam prep",
  "pages.pricing.conversion.includes.lessons": "Mga pathway-scoped lessons",
  "pages.pricing.conversionClarity.value2Title": "Adaptive readiness tracking",
  "pages.home.trustStrip.pill.lessonsLarge": "Mga structured pathway lessons",
  "newGrad.burnout.seoTitle": "Pag-iwas sa burnout ng bagong graduate nurse - mental health at resilience | NurseNest",
  "newGrad.career.seoTitle": "Career development para sa bagong graduate nurse - career planning guide | NurseNest",
  "newGrad.guides.cat2Title": "Communication at documentation",
  "newGrad.resume.templateResumeDesc": "Resume template para sa bagong graduate nurse",
  "newGrad.salary.seoTitle": "Sahod at negotiation guide para sa bagong graduate nurse | NurseNest",
  "newGrad.salary.specER": "Emergency department",
  "newGrad.salary.specMedSurg": "Med-surg",
  "newGrad.salary.specPedsNote": "Pediatric setting",
  "allied.alliedHealthHub.breadcrumb": "Breadcrumb ng Allied Health",
  "lesson.preTest": "Pre-test",
  "lesson.postTest": "Post-test",
  "pages.questionBank.tier": "Tier",
  "account.role.admin": "Admin",
  "flashcards.mode": "Mode",
  "flashcards.categoryPsychiatry": "Psychiatry",
  "pages.home.finalCta.headline": "Ipasa ang nursing exam nang may kumpiyansa",
  "pages.home.finalCta.subheading": "Matuto gamit ang mga aralin, mag-practice gamit ang questions, at subaybayan ang progress mo sa iisang lugar.",
  "pages.home.finalCta.pricingLink": "Tingnan ang presyo",
  "pages.home.globalRegions.us.title": "United States (NCLEX-RN / NCLEX-PN)",
  "marketing:home.heroFeatures.pathophysiology": "Pathophysiology",
  "marketing:npExamHub.pathophysiology": "Pathophysiology",
  "marketing:rexPnHub.pathophysiology": "Pathophysiology",
  "pages:pages.clinicalSeo.conditionPage.pathophysiology": "Pathophysiology",
  "pages:pages.conditionPage.pathophysiology": "Pathophysiology",
  "pages:pages.lessonDetail.pathophysiology": "Pathophysiology",
  "pages:pages.lessonDetail.pathophysiology2": "Pathophysiology",
  "pages:pages.nclexRnContentHub.pathophysiology": "Pathophysiology",
  "pages:pages.rexPnContentHub.pathophysiology": "Pathophysiology",
  "pages:pages.seoLessonDetail.pathophysiology": "Pathophysiology",
  "pages:pages.imagingPositioningDetail.collimation": "Collimation",
  "pages:pages.orderOfTheDraw.additive2": "Additive",
  "pages:pages.preNursing.tachycardia": "Tachycardia",
  "allied:allied.physicsVisuals.formula": "Formula",
  "components:components.ngnRenderersCalculationNumericRenderer.formula": "Formula",
  "pages:pages.clinicalCalculators.formula3": "Formula",
  "pages:pages.productBuilder.radius": "Radius",
  "learner.qbank.peer.heading": "Performance ng klase",
  "learner.qbank.peer.youSelected": "Pinili mo:",
  "learner.qbank.peer.noneSelected": "(walang pinili)",
  "learner.qbank.peer.optionDistributionAria": "Distribution ng answer choices sa mga learner",
  "learner.printables.subtitle": "Study aids na puwede mong i-download kapag available sa plano mo.",
  "learner.printables.empty": "Wala pang downloadable study aids.",
  "learner.printables.loadError": "Hindi ma-load ang downloadable study aids ngayon.",
  "learner.printables.locked": "Available sa premium plan mo.",
  "learner.printables.download": "I-download",
  "learner.printables.badgeProIncluded": "Kasama sa Pro",
  "dashboard.daySun": "L",
  "dashboard.dayMon": "L",
  "dashboard.dayTue": "M",
  "dashboard.dayWed": "M",
  "dashboard.dayThu": "H",
  "dashboard.dayFri": "B",
  "dashboard.daySat": "S",
  "allied.alliedDashboard.dashboard": "Dashboard mo",
  "allied.mltStudentDashboard.dashboard": "Dashboard mo",
  "allied.occupationalTherapyHub.examPrepHub": "Hub sa exam prep",
  "allied.pharmtechHub.examPrepHub": "Hub sa exam prep",
  "allied.pharmtechAdaptivePractice.masteryDashboard": "Mastery dashboard mo",
  "allied.pharmtechAdaptivePractice.masteryDashboard2": "Mastery dashboard mo",
  "allied.pharmtechAdaptivePractice.masteryDashboard3": "Mastery dashboard mo",
  "allied.paramedicParamedicLessonsHub.paramedicLessons": "Mga aralin sa paramedic",
  "components.footer.alliedPricing": "Presyo ng Allied Health",
  "components.footer.npExamPrepHub": "Hub sa NP exam prep",
  "components.examPathwayHub.studyModes.lessonsBody": "Buuin ang fundamentals at i-review ang mahihinang topics",
  "components.examPathwayHub.studyModes.subhead": "Parehong exam track para sa bawat option sa ibaba. Pumili ng isang path o i-rotate ang tatlo.",
  "components.trustSignals.usageLine": "Ginagamit ng nursing students na naghahanda sa United States at Canada.",
  "data.pre_nursing_infection_control.the5MomentsForHand": "5 Moments para sa hand hygiene (WHO)",
  "learner.dashboard.insight.scoreMeterLabel": "Readiness meter mo",
  "pages.demoCatExam.adaptiveReadinessCheck": "Adaptive readiness check",
  "pages.demoExamReview.passReadiness": "Pass readiness",
  "pages.dashboard.myDashboardPersonalizedLearningHub": "Dashboard ko - personalized learning hub",
  "pages.flashcards.learnMode": "Learn mode",
  "pages.flashcards.learnMode2": "Learn mode",
  "pages.preNursing.spotTheAbnormalFindings": "Hanapin ang abnormal findings",
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
  if (/\/public\/i18n\/(?:en|fr|es|hi|pt)\//.test(normalized) || /\/client\/public\/i18n\/(?:en|fr|es|hi|pt)\.json$/.test(normalized)) {
    throw new Error(`Refusing to write protected locale file: ${file}`);
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function isProtectedIdentical(value) {
  const text = String(value).trim();
  if (!text) return true;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return true;
  if (/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(text)) return true;
  if (/^[A-Z][A-Z0-9 _-]{2,}$/.test(text)) return true;
  const withoutPlaceholders = text.replace(/\{\{[^}]+\}\}/g, "").trim();
  if (!withoutPlaceholders) return true;
  if (/^[\s%.,:;()/+&·–—×μµ³⁻₀-₉→✓✗-]+$/.test(withoutPlaceholders)) return true;
  if (PROTECTED_TERMS.includes(text)) return true;
  if (/^[\d\s%.,:;()/+&·–—-]+$/.test(text)) return true;
  if (/^[\d\s%.,:;()/+&·–—×μµ³⁻₀-₉A-Za-z]+$/.test(text) && /(?:mmHg|mEq|mol|L|dL|PaCO|PaO|SaO|HCO|PLT|WBC)/i.test(text)) return true;
  if (ACCEPTABLE_TAGALOG_ENGLISH_LABELS.test(text) && !/\b(?:the|and|with|from|your|you|learn|subscribe|counts vary|most candidates|start with|complete at least|build fundamentals)\b/i.test(text)) return true;
  const words = withoutPlaceholders.match(/[A-Za-z][A-Za-z0-9-]*/g) ?? [];
  if (words.length > 0 && words.length <= 6 && !/\b(?:the|and|with|from|your|you|learn|subscribe|counts vary|most candidates|start with|complete at least|build fundamentals)\b/i.test(withoutPlaceholders)) return true;
  return words.length > 0 && words.every((word) => PROTECTED_TERMS.includes(word) || /^[A-Z0-9]{2,}$/.test(word));
}

function shouldTranslate(enValue, ptValue) {
  const en = String(enValue ?? "");
  const pt = String(ptValue ?? "");
  if (!en.trim()) return false;
  if (isProtectedIdentical(en)) return false;
  if (!pt.trim()) return true;
  if (/(?:^|\b)(?:mag|naka|nagsa|nire)-/i.test(pt) || /\b(?:pagkatapos|paano|mananatiling|ka|mga|at|hanggang)\b/i.test(pt)) return false;
  if (/^(?:\.[a-z0-9]+,|Nurse Practitioner \(|Stage \d|Radiographic positioning|Air embolism|BP \d|-[a-z]+ =)/i.test(pt)) return false;
  if (pt === en && /[a-z]{3,}/.test(en) && !PROTECTED_TERMS.includes(en)) return true;
  if (pt === en) return true;
  const hasTagalogEvidence = /\b(?:ang|ng|mga|para|sa|nasa|gamit|kung|kapag|hindi|iyong|natin|ninyo|pasyente|aralin|paghahanda|tanong|sagot|pagsasanay|pag-aaral|bayad|presyo|simulan|magpatuloy|bagong|graduate|nursing|exam|clinical|practice|flashcards)\b/i.test(pt);
  const startsAsEnglishSentence = /^(?:if|you|your|build|same|used|plan status|practice tests|exam prep hub|most candidates|counts vary|start with|complete at least|jump back|subscribe to|real numbers|latest mock|hang on)\b/i.test(pt.trim());
  if (hasTagalogEvidence && !startsAsEnglishSentence) return false;
  return /\b(the|and|your|with|for|this|that|from|learn|practice questions|pricing|dashboard|subscribe|lesson|lessons|account|sign in|get started|study plan|readiness|exam prep|patient care|clinical judgment)\b/i.test(pt);
}

function mask(text) {
  const tokens = [];
  let out = text.replace(/\{\{[^}]+\}\}/g, (match) => {
    const token = `NNTOKEN${tokens.length}NN`;
    tokens.push([token, match]);
    return token;
  });
  for (const term of PROTECTED_TERMS.sort((a, b) => b.length - a.length)) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(`\\b${escaped}\\b`, "g"), (match) => {
      const token = `NNTOKEN${tokens.length}NN`;
      tokens.push([token, match]);
      return token;
    });
  }
  return { masked: out, tokens };
}

function unmask(text, tokens) {
  let out = text;
  for (const [token, value] of tokens) out = out.replaceAll(token, value).replaceAll(token.toLowerCase(), value);
  return out;
}

function placeholderNames(text) {
  const re = /\{\{\s*([^}]+?)\s*\}\}/g;
  const out = [];
  let match;
  while ((match = re.exec(text)) !== null) out.push(match[1].trim());
  return [...new Set(out)].sort();
}

async function translateValue(value, cache) {
  if (cache[value]) return cache[value];
  const { masked, tokens } = mask(value);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=tl&dt=t&q=${encodeURIComponent(masked)}`;
  let lastError;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const translated = Array.isArray(data?.[0]) ? data[0].map((part) => part?.[0] ?? "").join("") : "";
      if (!translated.trim()) throw new Error("empty translation response");
      const valueOut = unmask(translated, tokens);
      if (JSON.stringify(placeholderNames(valueOut)) !== JSON.stringify(placeholderNames(value))) return value;
      cache[value] = valueOut;
      return valueOut;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  throw lastError;
}

async function pool(items, concurrency, fn) {
  let index = 0;
  async function worker() {
    while (index < items.length) await fn(items[index++]);
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
}

function mergedPublicLocale(locale) {
  const out = {};
  for (const shard of SHARDS) Object.assign(out, readJson(path.join(I18N_ROOT, locale, `${shard}.json`)));
  return out;
}

function forcedKeysFromAudit() {
  const audit = readJson(path.join(REPORT_DIR, "i18n-tl-audit-after.json"));
  const keys = new Set([
    ...((audit.missingKeys ?? [])),
    ...((audit.untranslatedFields ?? [])),
    ...((audit.englishLeakSuspicions ?? []).map((line) => String(line).split(":")[0]).filter(Boolean)),
  ]);
  return keys;
}

async function main() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const cache = readJson(CACHE_FILE);
  const forcedKeys = forcedKeysFromAudit();
  const planned = [];
  const perShard = new Map();

  for (const shard of SHARDS) {
    const en = readJson(path.join(I18N_ROOT, "en", `${shard}.json`));
      const pt = readJson(path.join(I18N_ROOT, LOCALE, `${shard}.json`));
    for (const [key, enValue] of Object.entries(en)) {
      if (typeof enValue !== "string") continue;
      const current = pt[key];
      const proposedOverride = TAGALOG_OVERRIDES[`${shard}:${key}`] ?? TAGALOG_OVERRIDES[key];
      const hasPendingOverride = proposedOverride && current !== proposedOverride;
      const forcedByAudit = forcedKeys.has(key);
      if (hasPendingOverride || forcedByAudit || shouldTranslate(enValue, current)) {
        planned.push({
          shard,
          key,
          english: enValue,
          current: typeof current === "string" ? current : "",
          proposed: hasPendingOverride ? proposedOverride : null,
          reason: hasPendingOverride ? "curated-override" : forcedByAudit ? "audit-forced" : current == null || String(current).trim() === "" ? "missing" : "english-identical-or-leak",
        });
      }
    }
    perShard.set(shard, pt);
  }

  if (APPLY) {
    let completed = 0;
    await pool(planned, 6, async (change) => {
      const pt = perShard.get(change.shard);
      const translated = change.proposed ?? await translateValue(change.english, cache);
      pt[change.key] = translated;
      change.proposed = translated;
      completed++;
      if (completed % 100 === 0) {
        fs.writeFileSync(CACHE_FILE, JSON.stringify(cache), "utf8");
        console.log(`[i18n:tl] translated ${completed}/${planned.length}`);
      }
    });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache), "utf8");
    for (const shard of SHARDS) writeJson(path.join(I18N_ROOT, LOCALE, `${shard}.json`), perShard.get(shard));

    const clientEn = readJson(path.join(CLIENT_I18N_ROOT, "en.json"));
    const clientPt = readJson(path.join(CLIENT_I18N_ROOT, "tl.json"));
    const publicPt = mergedPublicLocale(LOCALE);
    for (const key of Object.keys(clientEn)) {
      if (publicPt[key] !== undefined) clientPt[key] = publicPt[key];
      else if (!(key in clientPt) || String(clientPt[key] ?? "").trim() === "") clientPt[key] = clientEn[key];
    }
    writeJson(path.join(CLIENT_I18N_ROOT, "tl.json"), clientPt);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    dryRun: DRY_RUN,
    applied: APPLY,
    locale: LOCALE,
    language: "tl",
    plannedChanges: planned.length,
    changedKeys: APPLY ? planned.length : 0,
    protectedLocales: ["en", "fr", "es", "hi", "pt"],
    changes: planned,
  };
  fs.writeFileSync(path.join(REPORT_DIR, "translate-tl-missing-report.json"), JSON.stringify(report, null, 2), "utf8");
  console.log(`[i18n:translate:tl] ${APPLY ? "applied" : "dry-run"}; ${planned.length} Tagalog keys planned.`);
}

main().catch((error) => {
  console.error("[i18n:translate:tl] failed:");
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});
