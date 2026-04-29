import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..", "..", "..", "..");
const UPGRADE_SCRIPT = path.join(REPO_ROOT, "scripts", "upgrade-existing-lesson-depth.mjs");

const thinLegacyLesson = {
  slug: "zz-test-depth-upgrade",
  title: "ZZ test depth upgrade",
  topic: "TestTopic",
  topicSlug: "test-topic",
  bodySystem: "General",
  previewSectionCount: 2,
  seoTitle: "ZZ test | NurseNest",
  seoDescription: "Short description for catalog test only.",
  sections: [
    {
      id: "clinical_meaning",
      heading: "Clinical meaning",
      kind: "clinical_meaning",
      body: "General nursing overview text without mechanism vocabulary.",
    },
    {
      id: "exam_relevance",
      heading: "Exam relevance",
      kind: "exam_relevance",
      body: "Exam pacing tips only.",
    },
    {
      id: "core_concept",
      heading: "Core concept",
      kind: "core_concept",
      body: "Core ideas.",
    },
    {
      id: "clinical_scenario",
      heading: "Clinical scenario",
      kind: "clinical_scenario",
      body: "Scenario text.",
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Summary bullets.",
    },
  ],
};

function makeCatalog(lessons: unknown[], pathwayId = "ca-rn-nclex-rn") {
  return {
    version: 1,
    pathways: {
      [pathwayId]: { lessons },
    },
  };
}

describe("lesson depth upgrade (CLI + lib)", () => {
  it("dry-run does not mutate catalog files", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "nn-lesson-upgrade-"));
    const fp = path.join(dir, "fixture-catalog.json");
    fs.writeFileSync(fp, `${JSON.stringify(makeCatalog([thinLegacyLesson]), null, 2)}\n`, "utf8");
    const before = fs.readFileSync(fp, "utf8");
    execFileSync(process.execPath, [UPGRADE_SCRIPT, "--tier=rn", "--limit=3", "--dry-run"], {
      cwd: REPO_ROOT,
      encoding: "utf8",
      env: { ...process.env, NN_LESSON_PATHWAY_DIR: dir },
      stdio: ["ignore", "pipe", "pipe"],
    });
    const after = fs.readFileSync(fp, "utf8");
    assert.equal(after, before);
  });

  it("write mode preserves slug and appends spine scaffolds", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "nn-lesson-upgrade-"));
    const fp = path.join(dir, "fixture-catalog.json");
    fs.writeFileSync(fp, `${JSON.stringify(makeCatalog([structuredClone(thinLegacyLesson)]), null, 2)}\n`, "utf8");
    execFileSync(process.execPath, [UPGRADE_SCRIPT, "--tier=rn", "--limit=1", "--write"], {
      cwd: REPO_ROOT,
      encoding: "utf8",
      env: { ...process.env, NN_LESSON_PATHWAY_DIR: dir },
      stdio: ["ignore", "pipe", "pipe"],
    });
    const data = JSON.parse(fs.readFileSync(fp, "utf8"));
    const lesson = data.pathways["ca-rn-nclex-rn"].lessons[0];
    assert.equal(lesson.slug, thinLegacyLesson.slug);
    const corpus = [lesson.title, lesson.seoDescription, ...lesson.sections.map((s: { body: string }) => s.body)].join(
      "\n",
    );
    assert.match(corpus, /##\s+Pathophysiology/i);
    assert.match(corpus, /clinical-spine-scaffold:zz-test-depth-upgrade/);
  });

  it("RN tier filter does not select PN-only pathway fixtures", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "nn-lesson-upgrade-"));
    const fp = path.join(dir, "pn-only.json");
    fs.writeFileSync(fp, `${JSON.stringify(makeCatalog([thinLegacyLesson], "us-lpn-nclex-pn"), null, 2)}\n`, "utf8");
    const reportPath = path.join(dir, "report.json");
    execFileSync(
      process.execPath,
      [UPGRADE_SCRIPT, "--tier=rn", "--limit=5", "--write", `--json-out=${reportPath}`],
      {
        cwd: REPO_ROOT,
        encoding: "utf8",
        env: { ...process.env, NN_LESSON_PATHWAY_DIR: dir },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    const data = JSON.parse(fs.readFileSync(fp, "utf8"));
    const lesson = data.pathways["us-lpn-nclex-pn"].lessons[0];
    assert.equal(lesson.slug, thinLegacyLesson.slug);
    assert.ok(!lesson.sections[0].body.includes("clinical-spine-scaffold"));
    const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    assert.equal(report.summary.wouldWrite + report.summary.written, 0);
  });

  it("banned hard phrases in source lesson skip upgrade", async () => {
    const bad = structuredClone(thinLegacyLesson);
    bad.slug = "zz-test-banned";
    bad.sections[0].body = "Read the stem as a safety problem. " + String(bad.sections[0].body);
    const lib = await import(pathToFileURL(path.join(REPO_ROOT, "scripts", "lib", "lesson-depth-upgrade-lib.mjs")).href);
    const r = lib.upgradeLessonInMemory(bad, { onlyMissingSpine: false });
    assert.equal(r.ok, false);
    assert.match(String(r.skippedReason), /preexisting_hard_banned/);
  });

  it("duplicate fingerprint in batch skips second lesson", async () => {
    const lib = await import(pathToFileURL(path.join(REPO_ROOT, "scripts", "lib", "lesson-depth-upgrade-lib.mjs")).href);
    const a = structuredClone(thinLegacyLesson);
    a.slug = "zz-dup-a";
    const b = structuredClone(thinLegacyLesson);
    b.slug = "zz-dup-b";
    const upA = lib.upgradeLessonInMemory(a, { onlyMissingSpine: true });
    const upB = lib.upgradeLessonInMemory(b, { onlyMissingSpine: true });
    assert.ok(upA.ok && upB.ok);
    const fpA = lib.lessonsStructuralFingerprint(upA.lesson);
    const fpB = lib.lessonsStructuralFingerprint(upB.lesson);
    assert.notEqual(fpA, fpB, "slug marker should differentiate fingerprints");
  });
});
