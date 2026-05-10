import assert from "node:assert/strict";
import test from "node:test";

import { resolveBuildMeta } from "./write-build-git-meta.mjs";

const fixedNow = new Date("2026-05-10T12:00:00.000Z");

function gitFrom(values = {}) {
  return (args) => values[args.join(" ")] ?? null;
}

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
  });

  assert.equal(meta.commit, "git-commit");
  assert.equal(meta.branch, "feature/deploy-hardening");
  assert.equal(meta.source, "git:rev-parse HEAD");
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
  });

  assert.equal(meta.commit, "source-commit");
  assert.equal(meta.branch, "release/main");
  assert.equal(meta.source, "env:SOURCE_COMMIT");
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
  });

  assert.deepEqual(meta, {
    commit: "do-commit",
    branch: "main",
    recordedAt: "2026-05-10T12:00:00.000Z",
    environment: "production",
    buildPlatform: "digitalocean",
    source: "env:DIGITALOCEAN_GIT_COMMIT_SHA",
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
  });

  assert.equal(meta.commit, "gh-commit");
  assert.equal(meta.branch, "release/main");
  assert.equal(meta.buildPlatform, "github-actions");
  assert.equal(meta.source, "env:GITHUB_SHA");
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
  });

  assert.equal(meta.commit, "vercel-commit");
  assert.equal(meta.branch, "preview");
  assert.equal(meta.buildPlatform, "vercel");
  assert.equal(meta.source, "env:VERCEL_GIT_COMMIT_SHA");
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
  });

  assert.equal(meta.commit, "source-commit");
  assert.equal(meta.branch, "deploy/main");
  assert.equal(meta.source, "env:SOURCE_COMMIT");
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
  });

  assert.equal(meta.commit, "git-commit");
  assert.equal(meta.branch, "main");
  assert.equal(meta.source, "git:rev-parse HEAD");
});

test("resolveBuildMeta exposes nulls without leaking arbitrary env values", () => {
  const meta = resolveBuildMeta({
    env: {
      NODE_ENV: "production",
      SECRET_TOKEN: "do-not-leak",
    },
    git: gitFrom(),
    now: fixedNow,
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
