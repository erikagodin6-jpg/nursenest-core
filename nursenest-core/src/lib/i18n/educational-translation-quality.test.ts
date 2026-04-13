import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  evaluateEducationalTranslation,
  scriptExpectationLocaleKey,
} from "@/lib/i18n/educational-translation-quality";

describe("educational-translation-quality", () => {
  it("accepts empty english check for overlay-only validation", () => {
    const r = evaluateEducationalTranslation("", "العناية بالمريض تشمل تقييم الألم.", "ar");
    assert.equal(r.acceptTranslation, true);
  });

  it("rejects copy-paste English for Arabic locale (missing Arabic script)", () => {
    const en =
      "The nurse is assessing a client with acute chest pain. Which finding requires immediate follow-up?";
    const r = evaluateEducationalTranslation(en, en, "ar");
    assert.equal(r.acceptTranslation, false);
    assert.ok(r.reasons.some((x) => x.startsWith("missing_expected_script")));
  });

  it("rejects verbatim English exam boilerplate in non-English", () => {
    const r = evaluateEducationalTranslation(
      "x",
      "Select all that apply regarding infection control precautions.",
      "fr",
    );
    assert.equal(r.acceptTranslation, false);
    assert.ok(r.reasons.includes("english_boilerplate"));
  });

  it("rejects near-duplicate of long English stem for Spanish", () => {
    const en =
      "A client with type 2 diabetes mellitus reports polydipsia and blurred vision. Which laboratory value should the nurse anticipate reviewing first?";
    const r = evaluateEducationalTranslation(en, `${en} `, "es");
    assert.equal(r.acceptTranslation, false);
    assert.ok(r.reasons.includes("identical_to_english_source") || r.reasons.includes("near_duplicate_of_english"));
  });

  it("rejects doubled article pattern", () => {
    const r = evaluateEducationalTranslation("a", "El paciente tiene the the dolor agudo.", "es");
    assert.equal(r.acceptTranslation, false);
    assert.ok(r.reasons.includes("doubled_article_the"));
  });

  it("zh-tw uses Han expectation key", () => {
    assert.equal(scriptExpectationLocaleKey("zh-TW"), "zh-tw");
    assert.equal(scriptExpectationLocaleKey("zh"), "zh");
  });
});
