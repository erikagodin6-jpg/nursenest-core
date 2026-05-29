#!/usr/bin/env npx tsx
import { validateI18nRuntimeKeys } from "../src/lib/i18n/i18n-runtime-key-validation";

const result = validateI18nRuntimeKeys();
const errors = [
  ...result.missingKeys.map((key) => `code references missing translation key: ${key}`),
  ...result.localeKeySetErrors,
  ...result.loggedMissingStillMissing.map((key) => `production log key still missing: ${key}`),
];

console.log(
  `[i18n-runtime-keys] scanned=${result.scannedFiles} codeKeys=${result.codeKeys.length} loggedMissing=${result.loggedMissingKeys.length} dynamicPatterns=${result.dynamicKeys.length}`,
);

if (result.dynamicKeys.length > 0) {
  console.log(
    `[i18n-runtime-keys] dynamic key patterns observed: ${result.dynamicKeys
      .slice(0, 10)
      .map((row) => `${row.file}:${row.key}`)
      .join(" | ")}`,
  );
}

if (errors.length > 0) {
  console.error(`[i18n-runtime-keys] ${errors.length} error(s)`);
  for (const error of errors.slice(0, 200)) console.error(`  - ${error}`);
  if (errors.length > 200) console.error(`  ... ${errors.length - 200} more`);
  process.exit(1);
}

console.log("[i18n-runtime-keys] ok");

