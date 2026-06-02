import assert from "node:assert/strict";
import test from "node:test";

import { normalizeBranch, normalizeEnvString, resolveBuildMeta } from "./write-build-git-meta.mjs";

const fixedNow = new Date("2026-05-10T12:00:00.000Z");

function gitFrom(values = {}) {
  return (args) => values[args.join(" ")] ?? null;
}

test("normalizeEnvString trims and maps empty to null", () => {
  assert.equal(normalizeEnvString("  abc  "), "abc");
  assert.equal(normalizeEnvString(""), null);
  assert.equal(normalizeEnvString("   "), null);
  assert.equal(normalizeEnvString(undefined), null);
  assert.equal(normalizeEnvString(null), null);
});

test("normalizeBranch treats HEAD and blank as null", () => {
  assert.equal(normalizeBranch("HEAD"), null);
  assert.equal(normalizeBranch("   "), null);
  assert.equal(normalizeBranch("origin/preview"), "preview");
});

test("resolveBuildMeta reads local git commit and branch when no build env is supplied", () => {
  const meta = resolveBuildMeta({
    env: {
      NODE_ENV: "production",
    },
    git: gitFrom({
      "rev-parse HEAD": "git-commit",
      "rev-parse --abbrev-ref HEAD": "feature/deploy-hardening",
    }),
    now: fixedNow,
    logDiagnostics: false,
  });

  assert.equal(meta.commit, "git-commit");
  assert.equal(meta.branch, "feature/deploy-hardening");
  assert.equal(meta.source, "git-cli");
});

test("resolveBuildMeta prefers NN_BUILD_COMMIT and NN_BUILD_BRANCH over all other env probes", () => {
  const meta = resolveBuildMeta({
    env: {
      NODE_ENV: "production",
      NN_APP_PLATFORM_BUILD: "true",
      NN_BUILD_COMMIT: "nn-commit-aaa",
      NN_BUILD_BRANCH: "nn-branch",
      SOURCE_COMMIT: "source-commit",
      SOURCE_BRANCH: "source-branch",
      DIGITALOCEAN_GIT_COMMIT_SHA: "do-commit",
      DIGITALOCEAN_GIT_BRANCH: "do-branch",
      GITHUB_SHA: "gh-commit",
      GITHUB_REF_NAME: "gh-branch",
      VERCEL_GIT_COMMIT_SHA: "vercel-commit",
      VERCEL_GIT_COMMIT_REF: "vercel-branch",
    },
    git: gitFrom({
      "rev-parse HEAD": "git-commit",
      "rev-parse --abbrev-ref HEAD": "git-branch",
    }),
    now: fixedNow,
    logDiagnostics: false,
  });

  assert.equal(meta.commit, "nn-commit-aaa");
  assert.equal(meta.branch, "nn-branch");
  assert.equal(meta.source, "nn_build");
});

test("resolveBuildMeta lets explicit source envs override local git for Docker builds", () => {
  const meta = resolveBuildMeta({
    env: {
      NODE_ENV: "production",
      SOURCE_COMMIT: "source-commit",
      SOURCE_BRANCH: "release/main",
    },
    git: gitFrom({
      "rev-parse HEAD": "git-commit",
      "rev-parse --abbrev-ref HEAD": "local-main",
    }),
    now: fixedNow,
    logDiagnostics: false,
  });

  assert.equal(meta.commit, "source-commit");
  assert.equal(meta.branch, "release/main");
  assert.equal(meta.source, "sourceCommitEnv");
});

test("resolveBuildMeta prefers DigitalOcean commit and branch envs when git metadata is unavailable", () => {
  const meta = resolveBuildMeta({
    env: {
      NODE_ENV: "production",
      DIGITALOCEAN_APP_ID: "app-123",
      DIGITALOCEAN_GIT_COMMIT_SHA: "do-commit",
      DIGITALOCEAN_GIT_BRANCH: "main",
    },
    git: gitFrom(),
    now: fixedNow,
    logDiagnostics: false,
  });

  assert.deepEqual(meta, {
    commit: "do-commit",
    branch: "main",
    recordedAt: "2026-05-10T12:00:00.000Z",
    environment: "production",
    buildPlatform: "digitalocean",
    source: "digitalocean",
  });
});

test("resolveBuildMeta handles GitHub Actions envs without local git", () => {
  const meta = resolveBuildMeta({
    env: {
      NODE_ENV: "production",
      GITHUB_ACTIONS: "true",
      GITHUB_SHA: "gh-commit",
      GITHUB_REF_NAME: "release/main",
    },
    git: gitFrom(),
    now: fixedNow,
    logDiagnostics: false,
  });

  assert.equal(meta.commit, "gh-commit");
  assert.equal(meta.branch, "release/main");
  assert.equal(meta.buildPlatform, "github-actions");
  assert.equal(meta.source, "github");
});

test("resolveBuildMeta handles Vercel envs without local git", () => {
  const meta = resolveBuildMeta({
    env: {
      NODE_ENV: "production",
      VERCEL: "1",
      VERCEL_GIT_COMMIT_SHA: "vercel-commit",
      VERCEL_GIT_COMMIT_REF: "origin/preview",
    },
    git: gitFrom(),
    now: fixedNow,
    logDiagnostics: false,
  });

  assert.equal(meta.commit, "vercel-commit");
  assert.equal(meta.branch, "preview");
  assert.equal(meta.buildPlatform, "vercel");
  assert.equal(meta.source, "vercel");
});

test("resolveBuildMeta handles source commit envs without local git", () => {
  const meta = resolveBuildMeta({
    env: {
      NODE_ENV: "production",
      SOURCE_COMMIT: "source-commit",
      SOURCE_BRANCH: "deploy/main",
    },
    git: gitFrom(),
    now: fixedNow,
    logDiagnostics: false,
  });

  assert.equal(meta.commit, "source-commit");
  assert.equal(meta.branch, "deploy/main");
  assert.equal(meta.source, "sourceCommitEnv");
});

test("resolveBuildMeta falls back from detached HEAD to branch env", () => {
  const meta = resolveBuildMeta({
    env: {
      NODE_ENV: "production",
      SOURCE_BRANCH: "main",
    },
    git: gitFrom({
      "rev-parse HEAD": "git-commit",
      "rev-parse --abbrev-ref HEAD": "HEAD",
    }),
    now: fixedNow,
    logDiagnostics: false,
  });

  assert.equal(meta.commit, "git-commit");
  assert.equal(meta.branch, "main");
  assert.equal(meta.source, "git-cli");
});

test("resolveBuildMeta skips whitespace-only DigitalOcean SHA and uses GitHub next", () => {
  const meta = resolveBuildMeta({
    env: {
      NODE_ENV: "production",
      DIGITALOCEAN_GIT_COMMIT_SHA: "   ",
      GITHUB_SHA: "7133b1044fb2be5cd9232955d3b322ab699035be",
      GITHUB_REF_NAME: "main",
    },
    git: gitFrom(),
    now: fixedNow,
    logDiagnostics: false,
  });

  assert.equal(meta.commit, "7133b1044fb2be5cd9232955d3b322ab699035be");
  assert.equal(meta.branch, "main");
  assert.equal(meta.source, "github");
});

test("resolveBuildMeta handles explicit null env values without throwing", () => {
  const meta = resolveBuildMeta({
    env: {
      NODE_ENV: "production",
      DIGITALOCEAN_GIT_COMMIT_SHA: /** @type {any} */ (null),
      GITHUB_SHA: "from-github",
    },
    git: gitFrom(),
    now: fixedNow,
    logDiagnostics: false,
  });

  assert.equal(meta.commit, "from-github");
  assert.equal(meta.source, "github");
});

test("resolveBuildMeta uses git-cli when env is empty and git returns values", () => {
  const meta = resolveBuildMeta({
    env: { NODE_ENV: "production" },
    git: gitFrom({
      "rev-parse HEAD": "7133b1044fb2be5cd9232955d3b322ab699035be",
      "rev-parse --abbrev-ref HEAD": "main",
    }),
    now: fixedNow,
    logDiagnostics: false,
  });

  assert.equal(meta.commit, "7133b1044fb2be5cd9232955d3b322ab699035be");
  assert.equal(meta.branch, "main");
  assert.equal(meta.source, "git-cli");
});

test("resolveBuildMeta uses gitExecSync per cwd until one succeeds", () => {
  let headAttempts = 0;
  const meta = resolveBuildMeta({
    env: { NODE_ENV: "production" },
    gitExecSync: (args) => {
      const a = args.join(" ");
      if (a === "rev-parse HEAD") {
        headAttempts += 1;
        return headAttempts >= 2 ? "7133b1044fb2be5cd9232955d3b322ab699035be" : null;
      }
      if (a === "rev-parse --abbrev-ref HEAD") return "main";
      return null;
    },
    now: fixedNow,
    logDiagnostics: false,
  });

  assert.equal(meta.commit, "7133b1044fb2be5cd9232955d3b322ab699035be");
  assert.equal(meta.branch, "main");
  assert.equal(meta.source, "git-cli");
  assert.equal(headAttempts, 2);
});

test("resolveBuildMeta exposes nulls without leaking arbitrary env values", () => {
  const meta = resolveBuildMeta({
    env: {
      NODE_ENV: "production",
      SECRET_TOKEN: "do-not-leak",
    },
    git: gitFrom(),
    now: fixedNow,
    logDiagnostics: false,
  });

  assert.deepEqual(meta, {
    commit: null,
    branch: null,
    recordedAt: "2026-05-10T12:00:00.000Z",
    environment: "production",
    buildPlatform: "local",
    source: null,
  });
});
