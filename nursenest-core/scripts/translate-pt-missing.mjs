#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const APP_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const REPO_ROOT = path.resolve(APP_ROOT, "..");
const I18N_ROOT = path.join(APP_ROOT, "public", "i18n");
const CLIENT_I18N_ROOT = path.join(REPO_ROOT, "client", "public", "i18n");
const REPORT_DIR = path.join(APP_ROOT, "reports");
const CACHE_DIR = path.join(APP_ROOT, ".cache");
const CACHE_FILE = path.join(CACHE_DIR, "translate-pt-google-cache.json");
const APPLY = process.argv.includes("--apply");
const DRY_RUN = !APPLY;
const LOCALE = "pt";

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

const PORTUGUESE_OVERRIDES = {
  "common:nursenest.ca": "nursenest.ca",
  "breadcrumbs.home": "Início",
  "breadcrumbs.pricing": "Preços",
  "breadcrumbs.lessons": "Lições",
  "breadcrumbs.questionBank": "Questões de prática",
  "nav.home": "Início",
  "nav.pricing": "Preços",
  "nav.lessons": "Lições",
  "nav.practiceQuestions": "Questões de prática",
  "nav.flashcards": "Cartões de estudo",
  "nav.login": "Entrar",
  "nav.signup": "Começar",
  "pages.home.metaTitleCA": "NurseNest | Preparação para exames de enfermagem no Canadá",
  "pages.home.metaDescriptionCA": "Lições, questões de prática, cartões de estudo e acompanhamento de preparo para REx-PN, NCLEX-RN, NP e Allied Health.",
  "pages.home.metaTitleUS": "NurseNest | Preparação para exames de enfermagem",
  "pages.home.metaDescriptionUS": "Lições, questões de prática, cartões de estudo e acompanhamento de preparo para NCLEX-RN, NCLEX-PN, NP e Allied Health.",
  "pages.pricing.title": "Preços do NurseNest",
  "pages.pricing.description": "Planos simples para preparação para exames de enfermagem e saúde. Estude com lições, questões de prática, cartões de estudo e simulados adaptativos.",
  "pages.publicQuestionBank.metaTitleCA": "Questões de prática | REx-PN, NCLEX-RN, NP e Allied Health",
  "pages.publicQuestionBank.metaDescriptionCA": "Questões de prática, justificativas e revisão de tópicos fracos para preparação de enfermagem e saúde com foco no Canadá.",
  "pages.publicQuestionBank.metaTitleUS": "Questões de prática | NCLEX-RN, NCLEX-PN, NP e Allied Health",
  "pages.publicQuestionBank.metaDescriptionUS": "Questões de prática, justificativas e revisão de tópicos fracos para preparação de enfermagem e saúde.",
  "pages.publicQuestionBank.metaTitle": "Questões de prática NCLEX e REx-PN | NurseNest",
  "pages.publicQuestionBank.metaDescription": "Visão geral pública do banco de questões do NurseNest para NCLEX-RN, NCLEX-PN, REx-PN e trilhas NP. Cadastre-se para praticar no app.",
  "pages.publicQuestionBank.h1": "Questões de prática de enfermagem",
  "pages.publicQuestionBank.intro": "Escolha questões por trilha de exame, leia as justificativas e pratique novamente os tópicos mais fracos.",
  "pages.home.finalCta.headline": "Passe no seu exame de enfermagem com confiança",
  "pages.home.finalCta.subheading": "Aprenda com lições, pratique com questões e acompanhe seu progresso em um só lugar.",
  "pages.home.finalCta.pricingLink": "Ver preços",
  "pages.home.globalRegions.us.title": "Estados Unidos (NCLEX-RN / NCLEX-PN)",
  "marketing:home.heroFeatures.pathophysiology": "Fisiopatologia",
  "marketing:npExamHub.pathophysiology": "Fisiopatologia",
  "marketing:rexPnHub.pathophysiology": "Fisiopatologia",
  "pages:pages.clinicalSeo.conditionPage.pathophysiology": "Fisiopatologia",
  "pages:pages.conditionPage.pathophysiology": "Fisiopatologia",
  "pages:pages.lessonDetail.pathophysiology": "Fisiopatologia",
  "pages:pages.lessonDetail.pathophysiology2": "Fisiopatologia",
  "pages:pages.nclexRnContentHub.pathophysiology": "Fisiopatologia",
  "pages:pages.rexPnContentHub.pathophysiology": "Fisiopatologia",
  "pages:pages.seoLessonDetail.pathophysiology": "Fisiopatologia",
  "pages:pages.imagingPositioningDetail.collimation": "Colimação",
  "pages:pages.orderOfTheDraw.additive2": "Aditivo",
  "pages:pages.preNursing.tachycardia": "Taquicardia",
  "allied:allied.physicsVisuals.formula": "Fórmula",
  "components:components.ngnRenderersCalculationNumericRenderer.formula": "Fórmula",
  "pages:pages.clinicalCalculators.formula3": "Fórmula",
  "pages:pages.productBuilder.radius": "Raio",
  "learner.qbank.peer.heading": "Desempenho da turma",
  "learner.qbank.peer.youSelected": "Você selecionou:",
  "learner.qbank.peer.noneSelected": "(nenhuma seleção)",
  "learner.qbank.peer.optionDistributionAria": "Distribuição das opções de resposta entre os estudantes",
  "learner.printables.subtitle": "Materiais de estudo que você pode baixar quando estiverem disponíveis no seu plano.",
  "learner.printables.empty": "Nenhum material para download disponível ainda.",
  "learner.printables.loadError": "Não foi possível carregar os materiais para download agora.",
  "learner.printables.locked": "Disponível no seu plano premium.",
  "learner.printables.download": "Baixar",
  "learner.printables.badgeProIncluded": "Incluído no Pro",
  "dashboard.daySun": "D",
  "dashboard.dayMon": "S",
  "dashboard.dayTue": "T",
  "dashboard.dayWed": "Q",
  "dashboard.dayThu": "Q",
  "dashboard.dayFri": "S",
  "dashboard.daySat": "S",
  "pages:pages.examPrepHub.examPrepHubHealthcareCertification": "Centro de preparação para exames: recursos de estudo para certificação em saúde | NurseNest",
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
  if (/\/public\/i18n\/(?:en|fr|es|hi)\//.test(normalized) || /\/client\/public\/i18n\/(?:en|fr|es|hi)\.json$/.test(normalized)) {
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
  const words = withoutPlaceholders.match(/[A-Za-z][A-Za-z0-9-]*/g) ?? [];
  return words.length > 0 && words.every((word) => PROTECTED_TERMS.includes(word) || /^[A-Z0-9]{2,}$/.test(word));
}

function shouldTranslate(enValue, ptValue) {
  const en = String(enValue ?? "");
  const pt = String(ptValue ?? "");
  if (!en.trim()) return false;
  if (pt === en && /[a-z]{3,}/.test(en) && !PROTECTED_TERMS.includes(en)) return true;
  if (isProtectedIdentical(en)) return false;
  if (!pt.trim()) return true;
  if (pt === en) return true;
  const hasPortugueseEvidence = /[áàâãéêíóôõúç]|(?:\b(?:de|do|da|dos|das|se|que|para|com|seu|sua|exame|enfermagem|perguntas|questões|preparação|lições|cuidados|paciente|clínico|clínica|força|risco|pagamento|acesso|estudo|prática)\b)/i.test(pt);
  const startsAsEnglishSentence = /^(?:if|you|your|build|same|used|plan status|practice tests|exam prep hub|most candidates|counts vary|start with|complete at least|jump back|subscribe to|real numbers|latest mock|hang on)\b/i.test(pt.trim());
  if (hasPortugueseEvidence && !startsAsEnglishSentence) return false;
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
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=${encodeURIComponent(masked)}`;
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
  const audit = readJson(path.join(REPORT_DIR, "i18n-pt-audit-after.json"));
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
      const proposedOverride = PORTUGUESE_OVERRIDES[`${shard}:${key}`] ?? PORTUGUESE_OVERRIDES[key];
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
        console.log(`[i18n:pt] translated ${completed}/${planned.length}`);
      }
    });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache), "utf8");
    for (const shard of SHARDS) writeJson(path.join(I18N_ROOT, LOCALE, `${shard}.json`), perShard.get(shard));

    const clientEn = readJson(path.join(CLIENT_I18N_ROOT, "en.json"));
    const clientPt = readJson(path.join(CLIENT_I18N_ROOT, "pt.json"));
    const publicPt = mergedPublicLocale(LOCALE);
    for (const key of Object.keys(clientEn)) {
      if (publicPt[key] !== undefined) clientPt[key] = publicPt[key];
      else if (!(key in clientPt) || String(clientPt[key] ?? "").trim() === "") clientPt[key] = clientEn[key];
    }
    writeJson(path.join(CLIENT_I18N_ROOT, "pt.json"), clientPt);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    dryRun: DRY_RUN,
    applied: APPLY,
    locale: LOCALE,
    language: "pt-BR",
    plannedChanges: planned.length,
    changedKeys: APPLY ? planned.length : 0,
    protectedLocales: ["en", "fr", "es", "hi"],
    changes: planned,
  };
  fs.writeFileSync(path.join(REPORT_DIR, "translate-pt-missing-report.json"), JSON.stringify(report, null, 2), "utf8");
  console.log(`[i18n:translate:pt] ${APPLY ? "applied" : "dry-run"}; ${planned.length} Portuguese keys planned.`);
}

main().catch((error) => {
  console.error("[i18n:translate:pt] failed:");
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});
