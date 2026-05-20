import test from "node:test";
import assert from "node:assert/strict";
import {
  parseStudyReferencesJson,
  referencesJsonMeetsPublicationBar,
  validateStudyCardReference,
} from "./study-card-reference";

test("validateStudyCardReference accepts credible HTTPS hosts", () => {
  assert.equal(
    validateStudyCardReference({
      url: "https://www.cdc.gov/hypertension/facts.htm",
      year: new Date().getUTCFullYear(),
    }).level,
    "valid",
  );
});

test("validateStudyCardReference rejects placeholders and non-HTTPS", () => {
  assert.equal(validateStudyCardReference({ url: "http://www.cdc.gov/foo" }).level, "invalid");
  assert.equal(validateStudyCardReference({ url: "https://example.com/x" }).level, "invalid");
  assert.equal(validateStudyCardReference({ url: "https://random-bogus.example/phish" }).level, "invalid");
});

test("referencesJsonMeetsPublicationBar requires non-empty valid refs", () => {
  assert.equal(referencesJsonMeetsPublicationBar([]), false);
  assert.equal(referencesJsonMeetsPublicationBar([{ url: "https://www.cdc.gov/hypertension/facts.htm" }]), true);
  assert.equal(referencesJsonMeetsPublicationBar([{ url: "https://example.com" }]), false);
});

test("parseStudyReferencesJson tolerates mixed shapes", () => {
  const refs = parseStudyReferencesJson([{ url: " https://www.who.int/ " }, { noturl: 1 }]);
  assert.equal(refs.length, 1);
  assert.match(refs[0].url, /who\.int/);
});
