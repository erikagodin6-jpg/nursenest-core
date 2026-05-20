const fs = require("node:fs");
const path = require("node:path");

function jsonToTsSource(jsonPath, outPath, varName) {
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  const entries = Object.entries(data);
  entries.sort((a, b) => a[0].localeCompare(b[0]));

  const lines = entries.map(([key, value]) => {
    const escaped = String(value)
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n");
    return `    "${key}": "${escaped}",`;
  });

  const output = `const ${varName}: Record<string, string> = {\n${lines.join("\n")}\n};\n\nexport default ${varName};\n`;
  fs.writeFileSync(outPath, output, "utf8");
  console.log(`Wrote ${entries.length} entries to ${outPath}`);
}

const targets = [
  { lang: "tl", varName: "tlTranslations" },
  { lang: "ar", varName: "arTranslations" },
  { lang: "de", varName: "deTranslations" },
  { lang: "id", varName: "idTranslations" },
  { lang: "ja", varName: "jaTranslations" },
];

for (const { lang, varName } of targets) {
  const jsonPath = `client/public/i18n/${lang}.json`;
  const outPath = `tools/i18n/source/i18n-${lang}.ts`;
  if (fs.existsSync(jsonPath)) {
    jsonToTsSource(jsonPath, outPath, varName);
  } else {
    console.log(`SKIP: ${jsonPath} not found`);
  }
}
