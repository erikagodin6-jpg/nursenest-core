#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const I18N_DIR = path.join(__dirname, '../client/public/i18n');
const SUPPORTED_LANGUAGES = [
  'en','fr','tl','hi','es','zh','zh-tw','ar','ko','pt',
  'pa','vi','ht','ur','ja','fa','de','th','tr','id'
];

function loadJson(lang) {
  const filePath = path.join(I18N_DIR, `${lang}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function validate() {
  const en = loadJson('en');
  if (!en) {
    console.error('ERROR: en.json not found');
    process.exit(1);
  }

  const enKeys = Object.keys(en).sort();
  const enCount = enKeys.length;
  let hasErrors = false;
  const results = [];

  const blankEnKeys = enKeys.filter(k => en[k] === '' || en[k] === null || en[k] === undefined);
  if (blankEnKeys.length > 0) {
    console.error(`ERROR: ${blankEnKeys.length} blank key(s) in en.json:`);
    blankEnKeys.forEach(k => console.error(`  - ${k}`));
    hasErrors = true;
  }

  for (const lang of SUPPORTED_LANGUAGES) {
    if (lang === 'en') continue;

    const data = loadJson(lang);
    if (!data) {
      console.error(`ERROR: ${lang}.json not found`);
      hasErrors = true;
      results.push({ lang, total: 0, missing: enCount, blank: 0, coverage: '0.00%' });
      continue;
    }

    const langKeys = Object.keys(data);
    const missingKeys = enKeys.filter(k => !(k in data));
    const blankKeys = langKeys.filter(k => data[k] === '' || data[k] === null || data[k] === undefined);

    const coverage = ((enCount - missingKeys.length) / enCount * 100).toFixed(2);

    results.push({
      lang,
      total: langKeys.length,
      missing: missingKeys.length,
      blank: blankKeys.length,
      coverage: coverage + '%'
    });

    if (missingKeys.length > 0) {
      console.error(`ERROR: ${lang} is missing ${missingKeys.length} key(s):`);
      missingKeys.slice(0, 10).forEach(k => console.error(`  - ${k}`));
      if (missingKeys.length > 10) console.error(`  ... and ${missingKeys.length - 10} more`);
      hasErrors = true;
    }

    if (blankKeys.length > 0) {
      console.warn(`WARN: ${lang} has ${blankKeys.length} blank value(s):`);
      blankKeys.slice(0, 5).forEach(k => console.warn(`  - ${k}`));
      if (blankKeys.length > 5) console.warn(`  ... and ${blankKeys.length - 5} more`);
    }
  }

  console.log('\n=== i18n Validation Summary ===');
  console.log(`Reference: en.json (${enCount} keys)\n`);
  console.log('Lang     | Keys   | Missing | Blank | Coverage');
  console.log('---------|--------|---------|-------|--------');
  for (const r of results) {
    const lang = r.lang.padEnd(8);
    const total = String(r.total).padStart(6);
    const missing = String(r.missing).padStart(7);
    const blank = String(r.blank).padStart(5);
    console.log(`${lang} |${total} |${missing} |${blank} | ${r.coverage}`);
  }

  if (hasErrors) {
    console.error('\ni18n validation FAILED');
    process.exit(1);
  } else {
    console.log('\ni18n validation PASSED — all languages at 100% coverage');
    process.exit(0);
  }
}

validate();
