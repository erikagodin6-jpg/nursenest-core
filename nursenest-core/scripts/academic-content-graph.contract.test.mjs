import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const schema = readFileSync(new URL("../prisma/schema.prisma", import.meta.url), "utf8");
const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const migrationScript = readFileSync(new URL("./build-academic-content-graph.mts", import.meta.url), "utf8");
const topicHubLoader = readFileSync(new URL("../src/lib/academic-content-graph/topic-hub.server.ts", import.meta.url), "utf8");

test("canonical topic is the master academic graph model", () => {
  assert.match(schema, /model CanonicalTopic/);
  assert.match(schema, /learningObjectives\s+String\[\]/);
  assert.match(schema, /professionMappings\s+String\[\]/);
  assert.match(schema, /examMappings\s+String\[\]/);
  assert.match(schema, /prerequisiteTopicKeys\s+String\[\]/);
  assert.match(schema, /weakAreaTopicKeys\s+String\[\]/);
});

test("academic asset links attach all assets to one canonical taxonomy", () => {
  assert.match(schema, /model AcademicContentAssetLink/);
  assert.match(schema, /canonicalTopic\s+CanonicalTopic/);
  assert.match(schema, /@@unique\(\[assetType, assetId, relationship\]/);
});

test("academic graph migration report command exists", () => {
  assert.equal(
    packageJson.scripts["audit:academic-content-graph"],
    "npx tsx scripts/build-academic-content-graph.mts",
  );
});

test("migration report covers mapping, conflicts, orphans, and completeness", () => {
  for (const token of [
    "mappedContent",
    "unmappedContent",
    "duplicateTopics",
    "orphanedContent",
    "taxonomyConflicts",
    "topicCompleteness",
    "coverageGapReport",
  ]) {
    assert.match(migrationScript, new RegExp(token));
  }
});

test("topic hub launches activities from the graph rather than separate taxonomies", () => {
  for (const token of ["Lessons", "Flashcards", "Questions", "CAT", "Simulation", "Clinical Skills", "Pharmacology", "ECG", "Labs"]) {
    assert.match(topicHubLoader, new RegExp(token));
  }
  assert.match(topicHubLoader, /academic_content_asset_links/);
});
