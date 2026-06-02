import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const dbModulePath = join(here, "..", "db.ts");

function transformDbModuleSource(source: string): string {
  return (
    source
      .replace(/^import "\.\/db\/env-bootstrap";\n/m, "envBootstrap();\n")
      .replace(/^import \{ attachPrismaQueryCapture \} from "@\/lib\/db\/prisma-query-capture";\n/m, "")
      .replace(/^import \{ PrismaClient, type Prisma \} from "@prisma\/client";\n/m, "")
      .replace(
        /const globalForPrisma = globalThis as unknown as \{[\s\S]*?\};\n\n/m,
        "const globalForPrisma = globalThis;\n\n",
      )
      .replace(
        /\(globalThis as typeof globalThis & \{ __ENV_BOOTSTRAP_RAN__\?: boolean \}\)\.__ENV_BOOTSTRAP_RAN__/g,
        "globalThis.__ENV_BOOTSTRAP_RAN__",
      )
      .replace(/function shouldCapturePrismaQueries\(\): boolean \{/g, "function shouldCapturePrismaQueries() {")
      .replace(
        /function prismaLogOptions\(\): Prisma\.LogLevel\[\] \| Prisma\.LogDefinition\[\] \{/g,
        "function prismaLogOptions() {",
      )
      .replace(/function registerPrismaClientConstruction\(\): void \{/g, "function registerPrismaClientConstruction() {")
      .replace(/export const prisma =/g, "const prisma =") + "\nmodule.exports = { prisma };\n"
  );
}

function evaluateDbModule({
  compiledSource,
  sharedGlobal,
  env,
  constructions,
  capturedClients,
  warnings,
}: {
  compiledSource: string;
  sharedGlobal: Record<string, unknown>;
  env: Record<string, string>;
  constructions: unknown[];
  capturedClients: unknown[];
  warnings: string[];
}) {
  class MockPrismaClient {
    options: unknown;

    constructor(options: unknown) {
      this.options = options;
      constructions.push(options);
    }
  }

  const module = { exports: {} as { prisma?: unknown } };
  const runner = new Function(
    "module",
    "exports",
    "globalThis",
    "process",
    "console",
    "PrismaClient",
    "attachPrismaQueryCapture",
    "envBootstrap",
    `${compiledSource}\nreturn module.exports;`,
  );

  return runner(
    module,
    module.exports,
    sharedGlobal,
    { env },
    {
      warn(message: string) {
        warnings.push(message);
      },
      log() {},
      error() {},
    },
    MockPrismaClient,
    (client: unknown) => {
      capturedClients.push(client);
    },
    () => {
      sharedGlobal.__ENV_BOOTSTRAP_RAN__ = true;
    },
  ) as { prisma: unknown };
}

describe("prisma production singleton", () => {
  it("reuses one PrismaClient across repeated production-mode module evaluation", () => {
    const compiledSource = transformDbModuleSource(readFileSync(dbModulePath, "utf8"));
    const sharedGlobal: Record<string, unknown> = {};
    const constructions: unknown[] = [];
    const capturedClients: unknown[] = [];
    const warnings: string[] = [];

    const first = evaluateDbModule({
      compiledSource,
      sharedGlobal,
      env: { NODE_ENV: "production" },
      constructions,
      capturedClients,
      warnings,
    }).prisma;
    const second = evaluateDbModule({
      compiledSource,
      sharedGlobal,
      env: { NODE_ENV: "production" },
      constructions,
      capturedClients,
      warnings,
    }).prisma;

    assert.equal(constructions.length, 1);
    assert.equal(first, second);
    assert.equal(sharedGlobal.prisma, first);
    assert.equal(sharedGlobal.__PRISMA_CLIENT_COUNT__, 1);
    assert.equal(sharedGlobal.__PRISMA_CLIENT_DUPLICATE_WARNED__, undefined);
    assert.deepEqual(capturedClients, []);
    assert.deepEqual(warnings, []);
  });

  it("stores the shared Prisma singleton back onto globalThis unconditionally", () => {
    const source = readFileSync(dbModulePath, "utf8");
    assert.match(source, /export const prisma =/);
    assert.match(source, /globalForPrisma\.prisma = prisma;/);
    assert.doesNotMatch(source, /if\s*\(\s*process\.env\.NODE_ENV\s*!==\s*"production"\s*\)\s*\{\s*globalForPrisma\.prisma = prisma;/);
  });
});
