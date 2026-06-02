const fs = require("node:fs");
const path = require("node:path");

function jsonToTsSource(jsonPath, outPath, varName) {
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  const entries = Object.entries(data);

  // Sort keys for determinism
  entries.sort((a, b) => a[0].localeCompare(b[0]));

  const lines = entries.map(([key, value]) => {
    // Escape backslashes first, then quotes, then newlines
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

// Backport Spanish
jsonToTsSource(
  "client/public/i18n/es.json",
  "tools/i18n/source/i18n-es.ts",
  "esTranslations"
);

// Backport German (will be mostly English, but establishes the file)
jsonToTsSource(
  "client/public/i18n/de.json",
  "tools/i18n/source/i18n-de.ts",
  "deTranslations"
);