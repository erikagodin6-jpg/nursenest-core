import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { humanizedMarketingKeyFallback } from "@/lib/marketing-i18n/marketing-message-value-policy";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = join(__dirname, "../../..");
const repoRoot = join(appRoot, "..");
const hubPath = join(appRoot, "src/components/student/practice-tests-hub-client.tsx");
const marketingEnPath = join(repoRoot, "tools/i18n/marketing/marketing-en.json");
const appLearnerShardPath = join(appRoot, "public/i18n/en/learner.json");
const clientEnglishBundlePath = join(repoRoot, "client/public/i18n/en.json");

const knownHumanizedPracticeHubFallbacks = [
  "Hero Title",
  "Hero Subtitle",
  "Cta Cat",
  "Builder Headline",
  "Resume Cta",
  "Review Cta",
  "Row Question Count",
  "Study Tools Rail Title",
] as const;

const fallbackSensitivePracticeHubKeys = [
  "learner.practiceTests.examFirst.heroTitle",
  "learner.practiceTests.examFirst.heroSubtitle",
  "learner.practiceTests.examFirst.ctaCat",
  "learner.practiceTests.examFirst.ctaCatSublabel",
  "learner.practiceTests.examFirst.studyToolsRailTitle",
  "learner.practiceTests.examFirst.studyToolsRailIntro",
  "learner.practiceTests.hub.builderHeadline",
  "learner.practiceTests.hub.builderIntro",
  "learner.practiceTests.hub.resumeCta",
  "learner.practiceTests.hub.reviewCta",
  "learner.practiceTests.hub.rowQuestionCount",
  "learner.practiceTests.hub.rationalesShortLabel",
  "learner.practiceTests.hub.rowInProgress",
  "learner.practiceTests.hub.rowAbandoned",
  "learner.practiceTests.hub.rowUntitled",
] as const;

function loadJson(path: string): Record<string, string> {
  return JSON.parse(readFileSync(path, "utf8")) as Record<string, string>;
}

function extractPracticeHubKeys(): string[] {
  const src = readFileSync(hubPath, "utf8");
  const keys = new Set<string>();
  const re = /t\("(?<key>learner\.practiceTests\.[^"]+)"/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(src))) {
    const key = match.groups?.key;
    if (key?.startsWith("learner.practiceTests.examFirst.") || key?.startsWith("learner.practiceTests.hub.")) {
      keys.add(key);
    }
  }
  return [...keys].sort();
}

function assertRequiredKeysAreResolved(catalog: Record<string, string>, label: string) {
  const failures: string[] = [];
  const fallbackSensitive = new Set<string>(fallbackSensitivePracticeHubKeys);
  for (const key of extractPracticeHubKeys()) {
    const value = catalog[key];
    if (typeof value !== "string" || !value.trim()) {
      failures.push(`${label}:${key}: missing`);
      continue;
    }
    const trimmed = value.trim();
    const humanized = humanizedMarketingKeyFallback(key);
    if (knownHumanizedPracticeHubFallbacks.includes(trimmed as never)) {
      failures.push(`${label}:${key}: fallback ${trimmed}`);
      continue;
    }
    if (fallbackSensitive.has(key) && trimmed === humanized) {
      failures.push(`${label}:${key}: fallback ${trimmed}`);
    }
  }
  assert.deepEqual(failures, []);
}

describe("Practice Tests hub i18n fallback guard", () => {
  it("defines every PracticeTestsHubClient examFirst/hub key in canonical English copy", () => {
    assertRequiredKeysAreResolved(loadJson(marketingEnPath), "marketing-en");
  });

  it("compiles every PracticeTestsHubClient examFirst/hub key into runtime English learner shards", () => {
    assertRequiredKeysAreResolved(loadJson(appLearnerShardPath), "app-learner-shard");
    assertRequiredKeysAreResolved(loadJson(clientEnglishBundlePath), "client-en-bundle");
  });
});
