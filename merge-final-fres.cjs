const fs = require('fs');
const translations = JSON.parse(fs.readFileSync('/tmp/fr-es-all.json', 'utf8'));
const transFile = fs.readFileSync('client/src/lib/i18n-translations.ts', 'utf8');
let result = transFile;

for (const lang of ['fr', 'es']) {
  const langData = translations[lang];
  if (!langData || Object.keys(langData).length === 0) continue;
  const re = new RegExp(`(\\b${lang}:\\s*\\{)[\\s\\S]*?(\\n  \\},)`, 'm');
  const match = result.match(re);
  if (!match) { console.log(`Could not find ${lang} block`); continue; }
  const sortedKeys = Object.keys(langData).sort();
  const lines = sortedKeys.map(k => {
    const v = langData[k].replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `    "${k}": "${v}"`;
  });
  const newBlock = `${match[1]}\n${lines.join(',\n')}\n  },`;
  result = result.replace(match[0], newBlock);
  console.log(`${lang}: merged ${sortedKeys.length} keys`);
}
fs.writeFileSync('client/src/lib/i18n-translations.ts', result);
console.log('Done!');
