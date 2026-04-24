import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import {
  DOCKER_BUILD_PLACEHOLDER_DATABASE_URL_MARKER,
  REJECTED_DEFAULT_POSTGRES_LOCALHOST_CREDENTIALS,
  isDockerBuildPlaceholderDatabaseUrl,
  isRejectedRuntimePlaceholderDatabaseUrl,
  isProductionLikeDatabaseHost,
  maskDatabaseUrlHostForLog,
  requireDatabaseEnv,
} from "./require-database-env";

const KEYS = ["DATABASE_URL", "NN_SKIP_DATABASE_ENV_CONTRACT"] as const;

function snapshotEnv(): Record<(typeof KEYS)[number], string | undefined> {
  const s = {} as Record<(typeof KEYS)[number], string | undefined>;
  for (const k of KEYS) s[k] = process.env[k];
  return s;
}

function restoreEnv(s: ReturnType<typeof snapshotEnv>): void {
  for (const k of KEYS) {
    if (s[k] === undefined) delete process.env[k];
    else process.env[k] = s[k];
  }
}

describe("require-database-env", () => {
  afterEach(() => {
    delete process.env.NN_SKIP_DATABASE_ENV_CONTRACT;
  });

  it("rejects the Docker build placeholder substring", () => {
    assert.equal(isDockerBuildPlaceholderDatabaseUrl(`postgresql://x:y@${DOCKER_BUILD_PLACEHOLDER_DATABASE_URL_MARKER}?schema=public`), true);
    assert.equal(
      isDockerBuildPlaceholderDatabaseUrl(
        "postgresql://nn_prisma_codegen:nn_prisma_codegen@127.0.0.1:65432/nn_prisma_codegen?schema=public",
      ),
      false,
    );
  });

  it("rejects default postgres:postgres@127.0.0.1 even when db name is not postgres", () => {
    assert.equal(
      isRejectedRuntimePlaceholderDatabaseUrl(
        `postgresql://${REJECTED_DEFAULT_POSTGRES_LOCALHOST_CREDENTIALS}:5432/myapp?schema=public`,
      ),
      true,
    );
  });

  it("requireDatabaseEnv throws when DATABASE_URL is missing", () => {
    const snap = snapshotEnv();
    try {
      delete process.env.DATABASE_URL;
      delete process.env.NN_SKIP_DATABASE_ENV_CONTRACT;
      assert.throws(() => requireDatabaseEnv({ context: "test" }), /DATABASE_URL is missing/);
    } finally {
      restoreEnv(snap);
    }
  });

  it("requireDatabaseEnv throws on placeholder URL", () => {
    const snap = snapshotEnv();
    try {
      process.env.DATABASE_URL = `postgresql://postgres:postgres@${DOCKER_BUILD_PLACEHOLDER_DATABASE_URL_MARKER}?schema=public`;
      delete process.env.NN_SKIP_DATABASE_ENV_CONTRACT;
      assert.throws(() => requireDatabaseEnv({ context: "test" }), /localhost placeholder/);
    } finally {
      restoreEnv(snap);
    }
  });

  it("maskDatabaseUrlHostForLog does not include password", () => {
    const u = "postgresql://secretuser:secretpass@db.prod.example.com:25061/mydb?sslmode=require";
    const { host, port } = maskDatabaseUrlHostForLog(u);
    assert.match(host, /\*\*\*/);
    assert.equal(host.includes("secret"), false);
    assert.equal(port, "25061");
  });

  it("isProductionLikeDatabaseHost is false for loopback", () => {
    assert.equal(isProductionLikeDatabaseHost("postgresql://u:p@127.0.0.1:5432/x"), false);
    assert.equal(isProductionLikeDatabaseHost("postgresql://u:p@db.ondigitalocean.com:25061/x"), true);
  });
});
