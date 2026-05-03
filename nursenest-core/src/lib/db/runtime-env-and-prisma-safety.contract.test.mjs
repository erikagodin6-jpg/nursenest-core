import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, it } from "node:test";

import {
  RuntimeEnvError,
  loadRuntimeEnv,
} from "../../../scripts/lib/load-runtime-env.mjs";
import {
  ALLIED_AUDIT_REQUIRED_COLUMNS,
  PRODUCTION_REQUIRED_COLUMNS,
  SchemaReadinessError,
  checkRequiredColumnsWithQuery,
} from "../../../scripts/lib/schema-readiness.mjs";

const VALID_DATABASE_URL = "postgresql://user:secret@example-do-user-1.db.ondigitalocean.com:25060/defaultdb?sslmode=require";
const VALID_DIRECT_URL = "postgresql://direct:secret@example-do-user-1.db.ondigitalocean.com:25060/defaultdb?sslmode=require";

function withCleanDbEnv(fn) {
  const keys = ["DATABASE_URL", "DIRECT_URL", "DATABASE_DIRECT_URL"];
  const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  for (const key of keys) delete process.env[key];
  try {
    return fn();
  } finally {
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
}

function withTempEnv(files, fn) {
  const dir = mkdtempSync(join(tmpdir(), "nn-runtime-env-"));
  try {
    for (const [file, content] of Object.entries(files)) {
      writeFileSync(join(dir, file), content);
    }
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe("runtime env loader", () => {
  it("finds DIRECT_URL from env files when app-style bootstrap can", () =>
    withCleanDbEnv(() =>
      withTempEnv(
        {
          ".env.local": `DATABASE_URL=${VALID_DATABASE_URL}\nDIRECT_URL=${VALID_DIRECT_URL}\n`,
        },
        (envRoot) => {
          const logs = [];
          const telemetry = loadRuntimeEnv({ envRoot, logger: { log: (line) => logs.push(line) } });
          assert.equal(telemetry.databaseUrlPresent, true);
          assert.equal(telemetry.directUrlPresent, true);
          assert.equal(telemetry.directUrlSource, ".env.local");
          assert.equal(process.env.DIRECT_URL, VALID_DIRECT_URL);
          assert.equal(logs.some((line) => line.includes("secret")), false, "loader must not print secrets");
        },
      ),
    ));

  it("missing DIRECT_URL fails clearly", () =>
    withCleanDbEnv(() =>
      withTempEnv(
        {
          ".env": `DATABASE_URL=${VALID_DATABASE_URL}\n`,
        },
        (envRoot) => {
          assert.throws(
            () => loadRuntimeEnv({ envRoot, quiet: true }),
            (error) => error instanceof RuntimeEnvError && error.code === "ENV_MISSING" && error.message.includes("DIRECT_URL"),
          );
        },
      ),
    ));

  it("process env wins over env files", () =>
    withCleanDbEnv(() =>
      withTempEnv(
        {
          ".env.production": `DATABASE_URL=postgresql://file:secret@file.example.com:5432/db\nDIRECT_URL=${VALID_DIRECT_URL}\n`,
        },
        (envRoot) => {
          process.env.DATABASE_URL = VALID_DATABASE_URL;
          process.env.DIRECT_URL = VALID_DIRECT_URL;
          const telemetry = loadRuntimeEnv({ envRoot, quiet: true });
          assert.equal(telemetry.databaseUrlSource, "process.env");
          assert.equal(process.env.DATABASE_URL, VALID_DATABASE_URL);
        },
      ),
    ));
});

describe("schema readiness", () => {
  it("includes allied and recently added production columns", () => {
    assert.ok(PRODUCTION_REQUIRED_COLUMNS.some((c) => c.table === "pathway_lessons" && c.column === "allied_profession_key"));
    assert.ok(PRODUCTION_REQUIRED_COLUMNS.some((c) => c.table === "blog_article_generation_jobs" && c.column === "next_attempt_at"));
    assert.deepEqual(ALLIED_AUDIT_REQUIRED_COLUMNS, [
      { table: "pathway_lessons", column: "allied_profession_key" },
    ]);
  });

  it("missing allied column is reported as schema readiness failure", async () => {
    const result = await checkRequiredColumnsWithQuery(
      async (_text, params) => ({ rows: params[1] === "allied_profession_key" ? [] : [{ ok: 1 }] }),
      ALLIED_AUDIT_REQUIRED_COLUMNS,
    );
    assert.equal(result.ready, false);
    assert.deepEqual(result.missingColumns, [{ table: "pathway_lessons", column: "allied_profession_key" }]);
    assert.throws(() => {
      throw new SchemaReadinessError(result.missingColumns);
    }, /SCHEMA_NOT_READY/);
  });
});

describe("allied audit Prisma error handling", () => {
  it("treats Prisma P2022 as schema missing, never zero content", () => {
    const source = readFileSync(resolve("src/lib/audit/allied-profession-completeness-guard.ts"), "utf8");
    assert.match(source, /candidate\.code === "P2022"/);
    assert.match(source, /throw toSchemaNotReadyError\(error\)/);
    assert.doesNotMatch(source, /does not exist"\)\) \{\s*return 0;/);
    assert.doesNotMatch(source, /P2022[\s\S]{0,200}return 0;/);
  });
});

describe("package Prisma safety scripts", () => {
  it("nursenest-core package exposes safe Prisma scripts and no raw npx prisma commands", () => {
    const pkg = JSON.parse(readFileSync(resolve("package.json"), "utf8"));
    assert.equal(pkg.scripts["db:migrate:status:safe"], "node scripts/prisma-safe.mjs status");
    assert.equal(pkg.scripts["db:migrate:deploy:safe"], "node scripts/prisma-safe.mjs deploy");
    assert.equal(pkg.scripts["db:generate:safe"], "node scripts/prisma-safe.mjs generate");
    assert.equal(pkg.scripts["db:schema:check:safe"], "node scripts/prisma-safe.mjs check-schema");
    assert.equal(pkg.scripts["production:preflight"], "node scripts/production-preflight.mjs");

    const rawPrismaScripts = Object.entries(pkg.scripts).filter(([, command]) => /\bnpx\s+prisma\b|\bprisma\s+(migrate|generate|db|format|validate)\b/.test(command));
    assert.deepEqual(rawPrismaScripts, []);
  });

  it("root package delegates production preflight and safe migration commands", () => {
    const rootPkg = JSON.parse(readFileSync(resolve("..", "package.json"), "utf8"));
    assert.equal(rootPkg.scripts["production:preflight"], "npm --prefix nursenest-core run production:preflight");
    assert.equal(rootPkg.scripts["db:migrate:status:safe"], "npm --prefix nursenest-core run db:migrate:status:safe");
    assert.equal(rootPkg.scripts["db:migrate:deploy:safe"], "npm --prefix nursenest-core run db:migrate:deploy:safe");
  });
});
