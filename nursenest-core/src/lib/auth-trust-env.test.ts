import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const modulePath = join(here, "auth-trust-env.ts");

function transformSource(source: string): string {
  return source
    .replace(
      /const g = globalThis as unknown as \{ process\?: \{ env\?: Record<string, string \| undefined> \} \};/g,
      "const g = globalThis;",
    )
    .concat("\nreturn globalThis.process?.env;\n");
}

function runWithEnv(env: Record<string, string | undefined>) {
  const source = transformSource(readFileSync(modulePath, "utf8"));
  const runner = new Function("globalThis", source);
  return runner({ process: { env } });
}

test("auth trust env normalizes blank auth URLs and defaults AUTH_TRUST_HOST", () => {
  const env = {
    AUTH_URL: "   ",
    NEXTAUTH_URL: "",
    AUTH_TRUST_HOST: "",
  };
  const result = runWithEnv(env as Record<string, string | undefined>) as Record<string, string | undefined>;

  assert.equal(result.AUTH_URL, undefined);
  assert.equal(result.NEXTAUTH_URL, undefined);
  assert.equal(result.AUTH_TRUST_HOST, "true");
});

test("auth trust env preserves valid auth origin settings", () => {
  const env = {
    AUTH_URL: "https://www.nursenest.ca",
    NEXTAUTH_URL: "https://www.nursenest.ca",
    AUTH_TRUST_HOST: "false",
  };
  const result = runWithEnv(env as Record<string, string | undefined>) as Record<string, string | undefined>;

  assert.equal(result.AUTH_URL, "https://www.nursenest.ca");
  assert.equal(result.NEXTAUTH_URL, "https://www.nursenest.ca");
  assert.equal(result.AUTH_TRUST_HOST, "false");
});
