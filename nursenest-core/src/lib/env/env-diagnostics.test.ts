import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { buildEnvDiagnosticsReport } from "./env-diagnostics";

describe("env-diagnostics", () => {
  test("dev profile allows missing DATABASE_URL (info only)", () => {
    const prev = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;
    try {
      const r = buildEnvDiagnosticsReport({ profile: "dev" });
      assert.equal(r.exitCode, 0);
      assert.ok(r.diagnostics.some((d) => d.code === "database_url_absent_dev"));
    } finally {
      if (prev === undefined) delete process.env.DATABASE_URL;
      else process.env.DATABASE_URL = prev;
    }
  });

  test("dev profile flags malformed DATABASE_URL", () => {
    const prev = process.env.DATABASE_URL;
    process.env.DATABASE_URL = "not-a-url";
    try {
      const r = buildEnvDiagnosticsReport({ profile: "dev" });
      assert.equal(r.exitCode, 1);
      assert.ok(r.diagnostics.some((d) => d.severity === "error"));
    } finally {
      if (prev === undefined) delete process.env.DATABASE_URL;
      else process.env.DATABASE_URL = prev;
    }
  });

  test("ci profile is ok when DATABASE_URL unset", () => {
    const prev = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;
    try {
      const r = buildEnvDiagnosticsReport({ profile: "ci" });
      assert.equal(r.exitCode, 0);
    } finally {
      if (prev === undefined) delete process.env.DATABASE_URL;
      else process.env.DATABASE_URL = prev;
    }
  });

  test("production profile does not mutate process.env.NODE_ENV", () => {
    const prevNodeEnv = process.env.NODE_ENV;
    delete process.env.NODE_ENV;
    try {
      buildEnvDiagnosticsReport({ profile: "production" });
      assert.equal(process.env.NODE_ENV, undefined);
    } finally {
      if (prevNodeEnv === undefined) delete process.env.NODE_ENV;
      else process.env.NODE_ENV = prevNodeEnv;
    }
  });
});
