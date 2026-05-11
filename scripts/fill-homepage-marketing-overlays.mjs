#!/usr/bin/env node
/**
 * Fills homepage marketing overlay keys (`pages.home.*`) when a locale overlay
 * is missing them or still carries the English source value.
 *
 * Usage:
 *   node scripts/fill-homepage-marketing-overlays.mjs
 *   node scripts/fill-homepage-marketing-overlays.mjs --locales=fr,es,pt,hi,tl
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");
const EN_PATH = path.join(REPO_ROOT, "tools", "i18n", "marketing", "marketing-en.json");
const LOCALE_DIR = path.join(REPO_ROOT, "tools", "i18n", "marketing", "locale");

const DEFAULT_LOCALES = ["fr", "es", "pt", "hi", "tl"];
const LANG_OPTS = {
  fr: { to: "fr-CA", forceTo: true },
  es: { to: "es" },
  pt: { to: "pt" },
  hi: { to: "hi" },
  tl: { to: "tl" },
  zh: { to: "zh-CN" },
  "zh-tw": { to: "zh-TW" },
  ar: { to: "ar" },
  ko: { to: "ko" },
  pa: { to: "pa" },
  vi: { to: "vi" },
  ht: { to: "ht" },
  ur: { to: "ur" },
  ja: { to: "ja" },
  fa: { to: "fa" },
  de: { to: "de" },
  th: { to: "th" },
  tr: { to: "tr" },
  id: { to: "id" },
};

const HOMEPAGE_OVERRIDES = {
  fr: {
    "pages.home.hero.headlineAdaptive": "Maîtrisez les soins infirmiers. Pensez comme un clinicien.",
    "pages.home.premium.pathways.international.heading": "Les hubs en ligne et la couverture de base varient selon la région.",
    "pages.home.premium.ecg.coreHeading": "Une formation ECG adaptative intégrée à NurseNest, pas un simulateur ajouté.",
  },
  es: {
    "pages.home.hero.headlineAdaptive": "Domina la enfermería. Piensa como un clínico.",
    "pages.home.premium.pathways.international.heading": "Los hubs activos y la cobertura base varían según la región.",
    "pages.home.premium.ecg.coreHeading": "Educación ECG adaptativa integrada en NurseNest, no un simulador añadido.",
  },
  pt: {
    "pages.home.hero.headlineAdaptive": "Domine a enfermagem. Pense como um clínico.",
    "pages.home.premium.pathways.international.heading": "Os hubs ativos e a cobertura fundamental variam por região.",
    "pages.home.premium.ecg.coreHeading": "Educação adaptativa em ECG integrada ao NurseNest, não um simulador avulso.",
  },
  hi: {
    "pages.home.hero.headlineAdaptive": "नर्सिंग में महारत हासिल करें। एक क्लिनिशियन की तरह सोचें।",
    "pages.home.premium.pathways.international.heading": "लाइव हब और बुनियादी कवरेज क्षेत्र के अनुसार बदलते हैं।",
    "pages.home.premium.ecg.coreHeading": "NurseNest में एकीकृत अनुकूली ECG शिक्षा, कोई अलग से जोड़ा गया सिम्युलेटर नहीं।",
  },
  tl: {
    "pages.home.hero.headlineAdaptive": "Masterin ang Nursing. Mag-isip na parang isang clinician.",
    "pages.home.premium.pathways.international.heading": "Nagkakaiba ang mga live hub at batayang coverage ayon sa rehiyon.",
    "pages.home.premium.ecg.coreHeading": "Adaptive na edukasyon sa ECG na naka-built in sa NurseNest, hindi hiwalay na simulator.",
  },
};

const BATCH = 32;
const BATCH_GAP_MS = 120;

function parseLocalesArg() {
  const arg = process.argv.find((value) => value.startsWith("--locales="));
  if (!arg) return DEFAULT_LOCALES;
  return arg
    .slice("--locales=".length)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function shield(source) {
  const tokens = [];
  const masked = String(source).replace(/\{\{([^}]*)\}\}/g, (_, inner) => {
    const token = `NNTOKEN${tokens.length}`;
    tokens.push([token, `{{${inner}}}`]);
    return token;
  });
  return { masked, tokens };
}

function unshield(translated, tokens) {
  let out = translated;
  for (const [token, original] of tokens) {
    out = out.replaceAll(token, original).replaceAll(token.toLowerCase(), original);
  }
  return out;
}

function placeholderSignature(text) {
  return JSON.stringify((String(text).match(/\{\{[^}]+\}\}/g) ?? []).sort());
}

async function translateOneSafe(text, opts) {
  const { masked, tokens } = shield(text);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(opts.to)}&dt=t&q=${encodeURIComponent(masked)}`;
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  const translated = Array.isArray(data?.[0]) ? data[0].map((part) => part?.[0] ?? "").join("") : "";
  if (!translated.trim()) throw new Error("empty translation response");
  return unshield(translated, tokens);
}

async function translateBatchSafe(texts, opts) {
  try {
    return await Promise.all(texts.map((text) => translateOneSafe(text, opts)));
  } catch {
    return null;
  }
}

function homepageKeysToTranslate(en, overlay) {
  return Object.keys(en)
    .filter((key) => key.startsWith("pages.home."))
    .filter((key) => {
      const english = String(en[key] ?? "");
      const localized = overlay[key];
      if (typeof localized !== "string" || localized.trim() === "") return true;
      return localized.trim() === english.trim();
    })
    .sort();
}

async function fillLocale(locale, en) {
  const opts = LANG_OPTS[locale];
  if (!opts) throw new Error(`Unsupported locale ${locale}`);

  const overlayPath = path.join(LOCALE_DIR, `marketing-${locale}.json`);
  if (!fs.existsSync(overlayPath)) throw new Error(`Missing overlay ${overlayPath}`);

  const overlay = readJson(overlayPath);
  const overrides = HOMEPAGE_OVERRIDES[locale] ?? {};
  const keys = homepageKeysToTranslate(en, overlay);

  if (keys.length === 0) {
    console.log(`[${locale}] homepage overlay already localized`);
    return 0;
  }

  console.log(`[${locale}] translating ${keys.length} homepage keys`);

  for (let i = 0; i < keys.length; i += BATCH) {
    const slice = keys.slice(i, i + BATCH);
    const texts = slice.map((key) => String(en[key]));
    let batch = await translateBatchSafe(texts, opts);
    if (!batch) batch = new Array(slice.length).fill(null);

    for (let j = 0; j < slice.length; j++) {
      const key = slice[j];
      if (key in overrides) {
        overlay[key] = overrides[key];
        continue;
      }
      let translated = batch[j];

      if (!translated || placeholderSignature(translated) !== placeholderSignature(texts[j])) {
        try {
          translated = await translateOneSafe(texts[j], opts);
        } catch {
          translated = texts[j];
        }
      }

      overlay[key] = translated;
    }

    for (const [key, value] of Object.entries(overrides)) {
      overlay[key] = value;
    }

    process.stdout.write(`\r[${locale}] ${Math.min(i + slice.length, keys.length)}/${keys.length}`);
    await new Promise((resolve) => setTimeout(resolve, BATCH_GAP_MS));
  }

  fs.writeFileSync(overlayPath, `${JSON.stringify(overlay, null, 2)}\n`);
  process.stdout.write("\n");
  console.log(`[${locale}] wrote ${overlayPath}`);
  return keys.length;
}

async function main() {
  const en = readJson(EN_PATH);
  const locales = parseLocalesArg();
  let total = 0;

  for (const locale of locales) {
    total += await fillLocale(locale, en);
  }

  console.log(`Done. Updated ${total} homepage locale entries.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
