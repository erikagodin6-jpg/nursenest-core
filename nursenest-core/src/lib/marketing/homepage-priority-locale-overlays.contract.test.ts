/**
 * Contract: the new homepage layout copy should not remain English-identical in
 * priority marketing locale overlays once the homepage overlay fill step runs.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const ROOT = process.cwd();
const REPO_ROOT = path.resolve(ROOT, "..");
const MARKETING_EN = path.join(REPO_ROOT, "tools/i18n/marketing/marketing-en.json");
const LOCALE_DIR = path.join(REPO_ROOT, "tools/i18n/marketing/locale");

const PRIORITY_LOCALES = [
  "fr",
  "es",
  "pt",
  "hi",
  "tl",
  "ar",
  "de",
  "fa",
  "ht",
  "id",
  "it",
  "ja",
  "ko",
  "pa",
  "ru",
  "th",
  "tr",
  "ur",
  "vi",
  "zh",
  "zh-tw",
] as const;
const HOMEPAGE_KEYS = [
  "pages.home.hero.headlineAdaptive",
  "pages.home.premium.pathways.international.heading",
  "pages.home.premium.studyEcosystem.steps.detectWeakness.label",
  "pages.home.premium.ecg.coreHeading",
] as const;

function readJson(file: string): Record<string, string> {
  return JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, string>;
}

test("priority marketing locale overlays localize new homepage keys beyond English carryover", () => {
  const en = readJson(MARKETING_EN);

  for (const locale of PRIORITY_LOCALES) {
    const overlay = readJson(path.join(LOCALE_DIR, `marketing-${locale}.json`));

    for (const key of HOMEPAGE_KEYS) {
      assert.equal(typeof overlay[key], "string", `${locale}: missing ${key}`);
      assert.notEqual(
        overlay[key].trim(),
        en[key].trim(),
        `${locale}: ${key} still matches English source`,
      );
    }

    assert.doesNotMatch(
      overlay["pages.home.premium.ecg.coreHeading"],
      /Adaptive ECG education built into NurseNest/i,
      `${locale}: ECG homepage heading still leaks English marketing copy`,
    );
  }
});
