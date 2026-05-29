import assert from "node:assert/strict";
import test from "node:test";
import { validateI18nRuntimeKeys } from "./i18n-runtime-key-validation";

test("runtime i18n keys are present in compiled locale bundles and production-log keys are resolved", () => {
  const result = validateI18nRuntimeKeys();

  assert.equal(result.missingKeys.length, 0, `missing code keys:\n${result.missingKeys.slice(0, 50).join("\n")}`);
  assert.equal(
    result.loggedMissingStillMissing.length,
    0,
    `production missing_or_invalid keys still missing:\n${result.loggedMissingStillMissing.join("\n")}`,
  );
});

test("compiled English runtime bundles do not contain orphaned keys", () => {
  const result = validateI18nRuntimeKeys();

  assert.equal(
    result.localeKeySetErrors.length,
    0,
    `locale key-set errors:\n${result.localeKeySetErrors.slice(0, 50).join("\n")}`,
  );
});
