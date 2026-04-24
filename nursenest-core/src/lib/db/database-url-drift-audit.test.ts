import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import {
  databaseUrlDriftAuditPublic,
  evaluateDatabaseUrlShape,
  fingerprintDatabaseUrlPrefix10,
  guessDatabaseConnectionMode,
  runDatabaseUrlShapeGuardForProcess,
} from "./database-url-drift-audit";

const ENV_KEYS = ["DATABASE_URL", "CI", "NN_DATABASE_URL_SHAPE_GUARD"] as const;

function snapshotEnv(): Record<(typeof ENV_KEYS)[number], string | undefined> {
  const s = {} as Record<(typeof ENV_KEYS)[number], string | undefined>;
  for (const k of ENV_KEYS) s[k] = process.env[k];
  return s;
}

function restoreEnv(s: ReturnType<typeof snapshotEnv>): void {
  for (const k of ENV_KEYS) {
    if (s[k] === undefined) delete process.env[k];
    else process.env[k] = s[k];
  }
}

describe("database-url-drift-audit", () => {
  describe("fingerprintDatabaseUrlPrefix10", () => {
    it("returns 10 lowercase hex chars and changes when password changes", () => {
      const a =
        "postgresql://user:pass1@db.example.com:5432/mydb?sslmode=require";
      const b =
        "postgresql://user:pass2@db.example.com:5432/mydb?sslmode=require";
      const fa = fingerprintDatabaseUrlPrefix10(a);
      const fb = fingerprintDatabaseUrlPrefix10(b);
      assert.match(fa, /^[0-9a-f]{10}$/);
      assert.match(fb, /^[0-9a-f]{10}$/);
      assert.notEqual(fa, fb);
    });
  });

  describe("databaseUrlDriftAuditPublic", () => {
    it("parses host, port, database, username, sslmode, and never exposes password", () => {
      const raw =
        "postgresql://myuser:mysupersecret@pool.example.com:6432/appdb?sslmode=require";
      const audit = databaseUrlDriftAuditPublic(raw);
      assert.ok(audit);
      assert.equal(audit.host, "pool.example.com");
      assert.equal(audit.port, "6432");
      assert.equal(audit.database, "appdb");
      assert.equal(audit.username, "myuser");
      assert.equal(audit.sslmodeRequire, true);
      assert.equal(audit.connectionMode, "likely_pooler");
      const dumped = JSON.stringify(audit);
      assert.equal(dumped.includes("mysupersecret"), false);
    });

    it("returns null for empty or malformed URL", () => {
      assert.equal(databaseUrlDriftAuditPublic(""), null);
      assert.equal(databaseUrlDriftAuditPublic("   "), null);
      assert.equal(databaseUrlDriftAuditPublic("not-a-valid-url"), null);
    });
  });

  describe("guessDatabaseConnectionMode", () => {
    it("detects pgbouncer flag", () => {
      const p = new URLSearchParams("pgbouncer=true");
      assert.equal(guessDatabaseConnectionMode("x", "5432", p), "likely_pooler");
    });
  });

  describe("runDatabaseUrlShapeGuardForProcess / evaluateDatabaseUrlShape", () => {
    let saved: ReturnType<typeof snapshotEnv>;
    afterEach(() => {
      restoreEnv(saved);
    });

    it("NN_DATABASE_URL_SHAPE_GUARD=1 fails when DATABASE_URL missing", () => {
      saved = snapshotEnv();
      delete process.env.DATABASE_URL;
      process.env.NN_DATABASE_URL_SHAPE_GUARD = "1";
      delete process.env.CI;
      assert.equal(runDatabaseUrlShapeGuardForProcess(), "fail");
    });

    it("NN_DATABASE_URL_SHAPE_GUARD=1 fails when DATABASE_URL malformed", () => {
      saved = snapshotEnv();
      process.env.DATABASE_URL = "%%%";
      process.env.NN_DATABASE_URL_SHAPE_GUARD = "1";
      delete process.env.CI;
      assert.equal(runDatabaseUrlShapeGuardForProcess(), "fail");
    });

    it("NN_DATABASE_URL_SHAPE_GUARD=1 passes for parseable URL", () => {
      saved = snapshotEnv();
      process.env.DATABASE_URL =
        "postgresql://u:p@h.example:5432/db?sslmode=require";
      process.env.NN_DATABASE_URL_SHAPE_GUARD = "1";
      delete process.env.CI;
      assert.equal(runDatabaseUrlShapeGuardForProcess(), "pass");
    });

    it("CI without DATABASE_URL skips (no fail)", () => {
      saved = snapshotEnv();
      delete process.env.DATABASE_URL;
      process.env.CI = "true";
      delete process.env.NN_DATABASE_URL_SHAPE_GUARD;
      assert.equal(runDatabaseUrlShapeGuardForProcess(), "skip");
    });

    it("CI with malformed DATABASE_URL fails", () => {
      saved = snapshotEnv();
      process.env.CI = "true";
      process.env.DATABASE_URL = "not-a-url";
      delete process.env.NN_DATABASE_URL_SHAPE_GUARD;
      assert.equal(runDatabaseUrlShapeGuardForProcess(), "fail");
    });

    it("evaluateDatabaseUrlShape matches missing/malformed/ok", () => {
      saved = snapshotEnv();
      delete process.env.DATABASE_URL;
      assert.deepEqual(evaluateDatabaseUrlShape(), {
        ok: false,
        reason: "db_missing_url",
      });
      process.env.DATABASE_URL = "bad";
      assert.deepEqual(evaluateDatabaseUrlShape(), {
        ok: false,
        reason: "db_malformed_url",
      });
      process.env.DATABASE_URL = "postgresql://a:b@c:5432/d";
      assert.deepEqual(evaluateDatabaseUrlShape(), { ok: true });
    });
  });
});
