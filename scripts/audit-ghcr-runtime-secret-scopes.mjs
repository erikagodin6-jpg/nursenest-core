#!/usr/bin/env node
/**
 * GHCR + App Platform: runtime secrets must use scope RUN_TIME (not RUN_AND_BUILD_TIME only).
 * Pre-built images skip DO build — build-scoped secrets never reach `start-standalone.mjs`.
 *
 * Run: node scripts/audit-ghcr-runtime-secret-scopes.mjs [.do/app-nursenest-core-next.yaml]
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const yaml = require("js-yaml");

const __dir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dir, "..");
const defaultSpec = path.join(ROOT, ".do", "app-nursenest-core-next.yaml");

const RUNTIME_SECRET_KEYS = [
  "DATABASE_URL",
  "DIRECT_URL",
  "AUTH_SECRET",
  "NEXTAUTH_SECRET",
];

function loadSpec(specPath) {
  return yaml.load(readFileSync(specPath, "utf8"));
}

function webService(spec) {
  const services = Array.isArray(spec?.services) ? spec.services : [];
  return services.find((s) => s?.name === "web") ?? null;
}

function audit(specPath) {
  const spec = loadSpec(specPath);
  const web = webService(spec);
  const failures = [];

  if (!web?.image) {
    failures.push('Web service must use image: (GHCR) — github: clone deploy is out of scope for this audit.');
    return failures;
  }

  if (web.image.registry_type !== "GHCR") {
    failures.push(`Expected image.registry_type GHCR, got ${web.image.registry_type ?? "(unset)"}`);
  }

  const envs = Array.isArray(web.envs) ? web.envs : [];
  const byKey = new Map(envs.map((e) => [e.key, e]));

  for (const key of RUNTIME_SECRET_KEYS) {
    const entry = byKey.get(key);
    if (!entry) {
      failures.push(`Missing env key "${key}" in web service.`);
      continue;
    }
    const scope = entry.scope ?? "RUN_TIME";
    if (scope !== "RUN_TIME") {
      failures.push(
        `"${key}" has scope ${scope} — must be RUN_TIME for GHCR runtime injection (RUN_AND_BUILD_TIME is not applied when App Platform does not build the image).`,
      );
    }
    if (entry.type !== "SECRET") {
      failures.push(`"${key}" must remain type: SECRET (got ${entry.type ?? "GENERAL"}).`);
    }
  }

  for (const entry of envs) {
    if (entry.type !== "SECRET") continue;
    const scope = entry.scope ?? "RUN_TIME";
    if (scope === "BUILD_TIME") {
      failures.push(`Secret "${entry.key}" is BUILD_TIME only — will not reach the running container.`);
    }
    if (scope === "RUN_AND_BUILD_TIME") {
      failures.push(
        `Secret "${entry.key}" is RUN_AND_BUILD_TIME — use RUN_TIME for GHCR deploys (no platform build step).`,
      );
    }
  }

  return failures;
}

const specPath = path.resolve(process.argv[2] ?? defaultSpec);
const failures = audit(specPath);

if (failures.length > 0) {
  console.error("[audit-ghcr-runtime-secret-scopes] FAILED:");
  for (const f of failures) {
    console.error(`  - ${f}`);
  }
  process.exit(1);
}

console.log(`[audit-ghcr-runtime-secret-scopes] OK — ${path.relative(ROOT, specPath)}`);
