import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  type CapitalizationPolicyContext,
  validateEnglishCapitalization,
} from "@/lib/format/text-case";

const MARKETING_EN_PATH = path.resolve(process.cwd(), "../tools/i18n/marketing/marketing-en.json");

const messages = JSON.parse(readFileSync(MARKETING_EN_PATH, "utf8")) as Record<string, string>;

const TITLE_CASE_KEY_PATTERNS: Array<[RegExp, CapitalizationPolicyContext]> = [
  [/^nav\.(?:regionLabel|selectCountry|chooseYourExam|tierDrop\.heading|mega\.link\..+|marketingFlow\..+)$/, "nav"],
  [/^footer\.(?:viewAllLanguages|clinicalTools|labValues|toolsHub|studyTools|mockExams)$/, "nav"],
  [/^tools\.(?:hub|card\.[^.]+|labValues|electrolyteAbg|ivInfusion|medMath|transfusionSafety)\.(?:title|metaTitle)$/, "title"],
  [/^(?:home\.email\.button|examAttempt\.viewPlansCta|home\.conversion\.final\.ctaPrimary|home\.conversion\.final\.ctaSecondary)$/, "cta"],
  [/^components\.examPathwayHub\.body\.(?:ctaCreateAccount|ctaJoinOrSignIn|pricingCardCta|viewAllPlans)$/, "cta"],
];

function stripMetaSuffix(value: string): string {
  return value.replace(/\s*\|\s*NurseNest$/u, "");
}

function valueForPolicy(key: string, value: string): string {
  const normalized = stripMetaSuffix(value).replace(/&amp;/g, "&");
  return key.endsWith(".metaTitle") ? normalized : normalized;
}

test("marketing EN chrome keys follow title-case capitalization policy", () => {
  const issues: string[] = [];

  for (const [key, value] of Object.entries(messages)) {
    const match = TITLE_CASE_KEY_PATTERNS.find(([pattern]) => pattern.test(key));
    if (!match) continue;

    const [, context] = match;
    const result = validateEnglishCapitalization(valueForPolicy(key, value), context, "en");
    if (!result.ok) {
      issues.push(`${key}: "${value}" -> "${result.normalized}" (${result.issues.join(", ")})`);
    }
  }

  assert.deepEqual(issues, []);
});
