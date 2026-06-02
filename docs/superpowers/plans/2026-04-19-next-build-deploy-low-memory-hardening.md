# Next Build And Deploy Low-Memory Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Standardize low-memory build settings for DigitalOcean, preserve the existing single-worker Next.js posture, and make deploy builds fail fast when required standalone artifacts are missing.

**Architecture:** Keep the current Next.js build execution model intact and only harden the edges around it. The implementation should align build-time heap defaults at `4096`, leave `next.config.ts` single-worker settings unchanged unless validation proves otherwise, and extend standalone verification from a single entrypoint existence check to a small, stable set of required build artifacts.

**Tech Stack:** Next.js 16, Node.js, npm scripts, DigitalOcean App Platform spec YAML, Node test runner, TypeScript tests

---

### Task 1: Align build-time memory defaults and lock them with tests

**Files:**
- Modify: `nursenest-core/scripts/verify-standalone-artifact.test.cjs`
- Modify: `nursenest-core/package.json`
- Modify: `.do/app-nursenest-core-next.yaml`
- Test: `nursenest-core/scripts/verify-standalone-artifact.test.cjs`

- [ ] **Step 1: Write the failing assertions for the new `4096` default**

Add two assertions to `nursenest-core/scripts/verify-standalone-artifact.test.cjs` so the current code fails until the build defaults are updated:

```js
test("deploy build script defaults to a 4096 MB build heap", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8"));

  assert.match(
    pkg.scripts.build,
    /NODE_OPTIONS=\$\{NODE_OPTIONS:-"--max-old-space-size=\$\{BUILD_NODE_MAX_OLD_SPACE_SIZE_MB:-4096\}"\}/,
  );
});

test("active DigitalOcean app spec sets the build heap target to 4096 MB", () => {
  const appSpec = fs.readFileSync(path.join(__dirname, "..", "..", ".do", "app-nursenest-core-next.yaml"), "utf8");

  assert.match(
    appSpec,
    /- key: BUILD_NODE_MAX_OLD_SPACE_SIZE_MB\n\s+value: "4096"\n\s+scope: BUILD_TIME/,
  );
});
```

- [ ] **Step 2: Run the focused verifier test file and confirm it fails**

Run: `cd /root/nursenest-core-reclone/nursenest-core && node --test scripts/verify-standalone-artifact.test.cjs`

Expected: FAIL because the package script regex still points at `3584` and the active DO spec still sets `3584`.

- [ ] **Step 3: Update the build script defaults in `package.json`**

Change the three deploy-style build scripts in `nursenest-core/package.json` from `3584` to `4096` and keep the caller override behavior unchanged:

```json
{
  "scripts": {
    "build": "TMPDIR=${TMPDIR:-/tmp} NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 RUN_HEAVY_BUILD_TASKS=false SKIP_I18N_PREBUILD=1 SENTRY_ENABLED=false NODE_OPTIONS=${NODE_OPTIONS:-\"--max-old-space-size=${BUILD_NODE_MAX_OLD_SPACE_SIZE_MB:-4096}\"} next build --webpack",
    "build:webpack": "TMPDIR=${TMPDIR:-/tmp} NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 RUN_HEAVY_BUILD_TASKS=false SKIP_I18N_PREBUILD=1 SENTRY_ENABLED=false NODE_OPTIONS=${NODE_OPTIONS:-\"--max-old-space-size=${BUILD_NODE_MAX_OLD_SPACE_SIZE_MB:-4096}\"} next build --webpack",
    "build:full": "TMPDIR=${TMPDIR:-/tmp} NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 RUN_HEAVY_BUILD_TASKS=false SKIP_I18N_PREBUILD=1 SENTRY_ENABLED=false NODE_OPTIONS=${NODE_OPTIONS:-\"--max-old-space-size=${BUILD_NODE_MAX_OLD_SPACE_SIZE_MB:-4096}\"} next build --webpack"
  }
}
```

- [ ] **Step 4: Update the active DigitalOcean build-time heap default**

Change the active App Platform spec in `.do/app-nursenest-core-next.yaml` so the build-time environment matches the new default:

```yaml
      - key: BUILD_NODE_MAX_OLD_SPACE_SIZE_MB
        value: "4096"
        scope: BUILD_TIME
```

Keep this build-only. Do not add or change runtime `NODE_OPTIONS` or `NODE_MAX_OLD_SPACE_SIZE_MB` here.

- [ ] **Step 5: Re-run the focused verifier test file and confirm it passes**

Run: `cd /root/nursenest-core-reclone/nursenest-core && node --test scripts/verify-standalone-artifact.test.cjs`

Expected: PASS for the new `4096` assertions and the existing deploy-path assertions.

- [ ] **Step 6: Commit the memory-default alignment**

```bash
cd /root/nursenest-core-reclone
git add nursenest-core/package.json .do/app-nursenest-core-next.yaml nursenest-core/scripts/verify-standalone-artifact.test.cjs
git commit -m "build: align low-memory deploy heap defaults"
```

### Task 2: Extend standalone artifact verification to fail fast on incomplete builds

**Files:**
- Modify: `nursenest-core/scripts/verify-standalone-artifact.test.cjs`
- Modify: `nursenest-core/scripts/verify-standalone-artifact.mjs`
- Test: `nursenest-core/scripts/verify-standalone-artifact.test.cjs`

- [ ] **Step 1: Write failing tests for missing required standalone artifacts**

Add three new tests to `nursenest-core/scripts/verify-standalone-artifact.test.cjs` that prove the verifier rejects incomplete builds:

```js
test("verifyStandaloneArtifact fails when BUILD_ID is missing", async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "nn-standalone-missing-build-id-"));
  const standaloneEntry = path.join(tempRoot, ".next", "standalone", "nursenest-core", "server.js");
  const staticDir = path.join(tempRoot, ".next", "static");
  fs.mkdirSync(path.dirname(standaloneEntry), { recursive: true });
  fs.mkdirSync(staticDir, { recursive: true });
  fs.writeFileSync(standaloneEntry, "module.exports = {};\n", "utf8");

  try {
    const { verifyStandaloneArtifact } = await loadVerifier();
    assert.throws(() => verifyStandaloneArtifact(tempRoot), /missing required standalone artifact: .*\.next\/BUILD_ID/);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("verifyStandaloneArtifact fails when .next/static is missing", async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "nn-standalone-missing-static-"));
  const standaloneEntry = path.join(tempRoot, ".next", "standalone", "nursenest-core", "server.js");
  const buildIdPath = path.join(tempRoot, ".next", "BUILD_ID");
  fs.mkdirSync(path.dirname(standaloneEntry), { recursive: true });
  fs.writeFileSync(standaloneEntry, "module.exports = {};\n", "utf8");
  fs.writeFileSync(buildIdPath, "build-id\n", "utf8");

  try {
    const { verifyStandaloneArtifact } = await loadVerifier();
    assert.throws(() => verifyStandaloneArtifact(tempRoot), /missing required standalone artifact: .*\.next\/static/);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("verifyStandaloneArtifact fails when the standalone directory is missing", async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "nn-standalone-missing-dir-"));
  const buildIdPath = path.join(tempRoot, ".next", "BUILD_ID");
  const staticDir = path.join(tempRoot, ".next", "static");
  fs.mkdirSync(staticDir, { recursive: true });
  fs.writeFileSync(buildIdPath, "build-id\n", "utf8");

  try {
    const { verifyStandaloneArtifact } = await loadVerifier();
    assert.throws(() => verifyStandaloneArtifact(tempRoot), /standalone server\.js not found|missing required standalone artifact: .*\.next\/standalone/);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});
```

- [ ] **Step 2: Run the verifier test file and confirm the new tests fail**

Run: `cd /root/nursenest-core-reclone/nursenest-core && node --test scripts/verify-standalone-artifact.test.cjs`

Expected: FAIL because `verifyStandaloneArtifact()` only checks for `server.js` today.

- [ ] **Step 3: Implement minimal required-artifact validation in the verifier**

Extend `nursenest-core/scripts/verify-standalone-artifact.mjs` with a small helper that validates the resolved entry and its stable companion outputs:

```js
import { existsSync, statSync } from "node:fs";

function assertRequiredArtifact(targetPath, label) {
  if (!existsSync(targetPath)) {
    throw new Error(
      `missing required standalone artifact: ${targetPath} (${label}). ` +
        "Run `npm run build:deploy` from nursenest-core to generate a fresh standalone build.",
    );
  }
}

function assertReadableDirectory(targetPath, label) {
  assertRequiredArtifact(targetPath, label);
  if (!statSync(targetPath).isDirectory()) {
    throw new Error(
      `required standalone artifact is not a directory: ${targetPath} (${label}). ` +
        "Run `npm run build:deploy` from nursenest-core to generate a fresh standalone build.",
    );
  }
}

export function verifyStandaloneArtifact(root = packageRoot) {
  const standaloneServerPath = resolveStandaloneServerPath(root);
  if (!standaloneServerPath) {
    const candidates = getStandaloneServerCandidates(root);
    throw new Error(
      "standalone server.js not found. Expected one of:\n" +
        candidates.map((candidate) => `  - ${candidate}`).join("\n") +
        "\nRun `npm run build:deploy` from nursenest-core to generate a fresh standalone build.",
    );
  }

  assertRequiredArtifact(path.join(root, ".next", "BUILD_ID"), "Next BUILD_ID");
  assertReadableDirectory(path.join(root, ".next", "standalone"), "standalone output directory");
  assertReadableDirectory(path.join(root, ".next", "static"), "Next static assets");

  return standaloneServerPath;
}
```

Keep the function filesystem-only. Do not import app code, do not execute runtime logic, and do not add checks for unstable internal Next files.

- [ ] **Step 4: Re-run the verifier tests and confirm they pass**

Run: `cd /root/nursenest-core-reclone/nursenest-core && node --test scripts/verify-standalone-artifact.test.cjs`

Expected: PASS for both the existing nested/top-level server entrypoint cases and the new missing-artifact failure cases.

- [ ] **Step 5: Commit the verifier hardening**

```bash
cd /root/nursenest-core-reclone
git add nursenest-core/scripts/verify-standalone-artifact.mjs nursenest-core/scripts/verify-standalone-artifact.test.cjs
git commit -m "build: fail fast on incomplete standalone artifacts"
```

### Task 3: Document the low-memory build contract and preserve the current single-worker posture

**Files:**
- Modify: `nursenest-core/docs/deploy-safety.md`
- Modify: `.do/app-nursenest-core-next.yaml`
- Modify: `nursenest-core/src/lib/marketing/build-phase-memory-guards.test.ts` only if validation proves a concrete `next.config.ts` mismatch
- Test: `nursenest-core/src/lib/marketing/build-phase-memory-guards.test.ts`

- [ ] **Step 1: Add documentation assertions only if a concrete mismatch is found**

Do not change `nursenest-core/next.config.ts` proactively. First validate the current posture by running the existing memory-guard test file:

Run: `cd /root/nursenest-core-reclone/nursenest-core && npx tsx --test src/lib/marketing/build-phase-memory-guards.test.ts`

Expected: PASS, confirming the current settings still express:

```ts
experimental: {
  cpus: 1,
  memoryBasedWorkersCount: true,
  webpackBuildWorker: true,
  webpackMemoryOptimizations: true,
  externalDir: true,
},
webpack: (config) => {
  config.parallelism = 1;
  return config;
},
```

If this test fails because Next 16 changed the config contract, update only the mismatched assertions and the corresponding config. If it passes, leave `next.config.ts` untouched.

- [ ] **Step 2: Update deploy documentation with the build-memory and artifact contract**

Add a short section to `nursenest-core/docs/deploy-safety.md` that states:

```md
## Build memory contract

The standalone deploy build path is intentionally constrained for low-memory builders:

- `npm run build:deploy` is the canonical deploy build
- build-time `NODE_OPTIONS` defaults to `--max-old-space-size=4096`
- `RUN_HEAVY_BUILD_TASKS=false`, `SKIP_I18N_PREBUILD=1`, and `SENTRY_ENABLED=false` remain part of the guarded build path
- `next.config.ts` keeps the existing single-worker posture unless explicitly revalidated

## Standalone artifact contract

Deploy builds must produce:

- `.next/BUILD_ID`
- `.next/standalone`
- `.next/static`
- a valid standalone `server.js`

`npm run verify:standalone-artifact` now fails fast if any of those are missing.
```

- [ ] **Step 3: Expand the App Platform spec comments to match the hardened build contract**

Update the nearby comments in `.do/app-nursenest-core-next.yaml` so operators can see the build expectations without opening the codebase:

```yaml
    # Low-memory build contract:
    # - build-time heap defaults to 4096 MB via BUILD_NODE_MAX_OLD_SPACE_SIZE_MB
    # - build:deploy verifies .next/BUILD_ID, .next/standalone, .next/static, and standalone server.js
    # - keep RUN_HEAVY_BUILD_TASKS=false for constrained builders
```

- [ ] **Step 4: Re-run the existing build-memory guard test**

Run: `cd /root/nursenest-core-reclone/nursenest-core && npx tsx --test src/lib/marketing/build-phase-memory-guards.test.ts`

Expected: PASS. If you changed only docs/comments, this is just confirmation that the single-worker posture remains intact.

- [ ] **Step 5: Commit the docs and validation pass**

```bash
cd /root/nursenest-core-reclone
git add nursenest-core/docs/deploy-safety.md .do/app-nursenest-core-next.yaml
git commit -m "docs: document low-memory build safeguards"
```

### Task 4: Run focused final verification and capture any gaps

**Files:**
- Modify: none unless a verification issue forces a surgical fix
- Test: `nursenest-core/scripts/verify-standalone-artifact.test.cjs`
- Test: `nursenest-core/src/lib/marketing/build-phase-memory-guards.test.ts`

- [ ] **Step 1: Run the focused automated checks**

Run:

```bash
cd /root/nursenest-core-reclone/nursenest-core
node --test scripts/verify-standalone-artifact.test.cjs
npx tsx --test src/lib/marketing/build-phase-memory-guards.test.ts
```

Expected: PASS for both test commands.

- [ ] **Step 2: Run lint diagnostics on edited files**

Run Cursor lints or, from the shell, run:

```bash
cd /root/nursenest-core-reclone/nursenest-core
npx eslint scripts/verify-standalone-artifact.mjs scripts/verify-standalone-artifact.test.cjs src/lib/marketing/build-phase-memory-guards.test.ts
```

Expected: no new lint errors in the edited JS/TS files. Ignore YAML/docs here if the linter is not configured for them.

- [ ] **Step 3: Optionally run a deploy-style build if the machine can afford it**

Run:

```bash
cd /root/nursenest-core-reclone/nursenest-core
npm run build:deploy
```

Expected: PASS with a verified standalone artifact and no missing-output failure.

If this is skipped because the environment is too slow or memory-constrained, record that explicitly in the handoff instead of claiming it ran.

- [ ] **Step 4: Record the exact validation results in the final handoff**

Use this structure in the final summary:

```md
Validation run:

- `node --test scripts/verify-standalone-artifact.test.cjs` — PASS
- `npx tsx --test src/lib/marketing/build-phase-memory-guards.test.ts` — PASS
- `npx eslint ...` — PASS
- `npm run build:deploy` — PASS | SKIPPED (reason)
```

- [ ] **Step 5: Create the final verification commit**

```bash
cd /root/nursenest-core-reclone
git add -A
git commit -m "chore: verify low-memory deploy hardening"
```
