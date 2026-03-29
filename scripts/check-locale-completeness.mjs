import fs from 'fs';
import path from 'path';

const LANGUAGES = [
  'en', 'fr', 'tl', 'hi', 'es', 'zh', 'zh-tw', 'ar', 'ko',
  'pt', 'pa', 'vi', 'ht', 'ur', 'ja', 'fa', 'de', 'th', 'tr', 'id'
];

const NON_EN = LANGUAGES.filter(l => l !== 'en');

const LANG_NAMES = {
  en: 'English', fr: 'French', tl: 'Filipino', hi: 'Hindi', es: 'Spanish',
  zh: 'Chinese (Simplified)', 'zh-tw': 'Chinese (Traditional)', ar: 'Arabic',
  ko: 'Korean', pt: 'Portuguese', pa: 'Punjabi', vi: 'Vietnamese',
  ht: 'Haitian Creole', ur: 'Urdu', ja: 'Japanese', fa: 'Farsi',
  de: 'German', th: 'Thai', tr: 'Turkish', id: 'Indonesian'
};

function getAllKeys(obj, prefix = '') {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const args = process.argv.slice(2);
const enforce = args.includes('--enforce');
const i18nDir = path.resolve('client/public/i18n');

if (!fs.existsSync(i18nDir)) {
  console.error('ERROR: i18n directory not found at', i18nDir);
  console.error('Run the i18n compilation step first.');
  process.exit(1);
}

const enPath = path.join(i18nDir, 'en.json');
if (!fs.existsSync(enPath)) {
  console.error('ERROR: English baseline JSON not found at', enPath);
  process.exit(1);
}

console.log('\n=== Locale File Completeness Check ===');

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const enKeys = getAllKeys(enData);
console.log(`English baseline: ${enKeys.length} keys\n`);

const failures = [];
const report = {};

for (const lang of NON_EN) {
  const langPath = path.join(i18nDir, `${lang}.json`);
  if (!fs.existsSync(langPath)) {
    console.log(`✗ ${LANG_NAMES[lang]} (${lang}): JSON file not found`);
    failures.push({ lang, name: LANG_NAMES[lang], missing: enKeys.length, keys: enKeys.slice(0, 10) });
    report[lang] = { name: LANG_NAMES[lang], totalKeys: 0, missingKeys: enKeys.length, extraKeys: 0, coverage: 0 };
    continue;
  }

  let langData;
  try {
    langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
  } catch (err) {
    console.log(`✗ ${LANG_NAMES[lang]} (${lang}): JSON parse error`);
    failures.push({ lang, name: LANG_NAMES[lang], missing: -1, error: 'parse error' });
    report[lang] = { name: LANG_NAMES[lang], totalKeys: 0, missingKeys: -1, extraKeys: 0, coverage: 0, error: 'parse error' };
    continue;
  }

  const langKeys = getAllKeys(langData);
  const langKeySet = new Set(langKeys);
  const enKeySet = new Set(enKeys);

  const missingKeys = enKeys.filter(k => !langKeySet.has(k));
  const extraKeys = langKeys.filter(k => !enKeySet.has(k));

  const coverage = enKeys.length > 0 ? parseFloat(((langKeys.filter(k => enKeySet.has(k)).length / enKeys.length) * 100).toFixed(1)) : 100;

  report[lang] = {
    name: LANG_NAMES[lang],
    totalKeys: langKeys.length,
    missingKeys: missingKeys.length,
    extraKeys: extraKeys.length,
    coverage,
    missingKeysList: missingKeys.slice(0, 20),
  };

  if (missingKeys.length > 0) {
    console.log(`✗ ${LANG_NAMES[lang]} (${lang}): ${missingKeys.length} missing key(s) (${coverage}% complete)`);
    for (const k of missingKeys.slice(0, 5)) {
      console.log(`    - ${k}`);
    }
    if (missingKeys.length > 5) {
      console.log(`    ... and ${missingKeys.length - 5} more`);
    }
    failures.push({ lang, name: LANG_NAMES[lang], missing: missingKeys.length, keys: missingKeys.slice(0, 10) });
  } else {
    console.log(`✓ ${LANG_NAMES[lang]} (${lang}): complete (${langKeys.length} keys)`);
  }
}

const reportPath = path.resolve('scripts/locale-completeness-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\nReport saved to: ${reportPath}`);

if (enforce && failures.length > 0) {
  console.error(`\n=== LOCALE COMPLETENESS CHECK FAILED ===`);
  console.error(`${failures.length} locale file(s) have missing keys compared to the English baseline.\n`);
  for (const f of failures) {
    console.error(`  ✗ ${f.name} (${f.lang}): ${f.missing === -1 ? 'parse error' : `${f.missing} missing key(s)`}`);
  }
  console.error(`\nAll locale JSON files must contain every key present in en.json.`);
  process.exit(1);
}
