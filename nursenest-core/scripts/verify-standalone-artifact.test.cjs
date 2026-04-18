const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

async function loadVerifier() {
  return import(pathToFileUrl(path.join(__dirname, "verify-standalone-artifact.mjs")));
}

function pathToFileUrl(filePath) {
  const normalized = path.resolve(filePath).replace(/\\/g, "/");
  return `file://${normalized}`;
}

test("verifyStandaloneArtifact returns the expected nested standalone server path", async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "nn-standalone-artifact-"));
  const standaloneEntry = path.join(tempRoot, ".next", "standalone", "nursenest-core", "server.js");
  fs.mkdirSync(path.dirname(standaloneEntry), { recursive: true });
  fs.writeFileSync(standaloneEntry, "module.exports = {};\n", "utf8");

  try {
    const { getExpectedStandaloneServerPath, verifyStandaloneArtifact } = await loadVerifier();
    assert.equal(getExpectedStandaloneServerPath(tempRoot), standaloneEntry);
    assert.equal(verifyStandaloneArtifact(tempRoot), standaloneEntry);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("verifyStandaloneArtifact hard-fails when the nested standalone server path is missing", async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "nn-standalone-artifact-missing-"));

  try {
    const { verifyStandaloneArtifact } = await loadVerifier();
    assert.throws(
      () => verifyStandaloneArtifact(tempRoot),
      /standalone server\.js not found at .*\.next\/standalone\/nursenest-core\/server\.js/,
    );
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("next config keeps standalone output enabled", () => {
  const nextConfig = fs.readFileSync(path.join(__dirname, "..", "next.config.ts"), "utf8");
  assert.match(nextConfig, /output:\s*"standalone"/);
});

test("deploy build script forces a clean rebuild and verifies the standalone artifact", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8"));
  assert.equal(pkg.scripts.build.includes("next build"), true);
  assert.equal(pkg.scripts["verify:standalone-artifact"], "node scripts/verify-standalone-artifact.mjs");
  assert.equal(
    pkg.scripts["build:deploy"],
    "npm run clean:next && npm run build && npm run verify:standalone-artifact && node scripts/post-build-prune.mjs",
  );
  assert.equal(pkg.scripts.start, "node scripts/start-standalone.mjs");
});

test("active DigitalOcean app spec builds before runtime and starts through npm run start", () => {
  const appSpec = fs.readFileSync(path.join(__dirname, "..", "..", ".do", "app-nursenest-core-next.yaml"), "utf8");
  assert.match(appSpec, /build_command: npm run build:deploy && npm prune --omit=dev/);
  assert.match(appSpec, /run_command: npm run start/);
});

test("runtime startup checks the same standalone artifact path as build verification", () => {
  const startupSource = fs.readFileSync(path.join(__dirname, "start-standalone.mjs"), "utf8");
  assert.match(startupSource, /\.next", "standalone", "nursenest-core", "server\.js"/);
  assert.doesNotMatch(startupSource, /\.next", "standalone", "server\.js"/);
  assert.match(startupSource, /standalone server\.js not found at:/);
});
