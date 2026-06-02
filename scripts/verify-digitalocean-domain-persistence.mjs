#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appRoot = path.join(root, "nursenest-core");
const requireFromApp = createRequire(path.join(appRoot, "package.json"));
const yaml = requireFromApp("js-yaml");
const specPaths = [
  ".do/app-nursenest-core-next.yaml",
  ".do/app.yaml",
  "nursenest-core/.do/app.yaml",
];

const requiredDomains = new Map([
  ["nursenest.ca", "PRIMARY"],
  ["www.nursenest.ca", "ALIAS"],
]);

const failures = [];
const checked = [];

function fail(message) {
  failures.push(message);
}

function relative(file) {
  return path.relative(root, file) || ".";
}

function isProductionSpec(spec) {
  if (typeof spec?.name === "string" && /^nursenest(?:-core-next)?$/.test(spec.name)) {
    return true;
  }

  return (spec?.services ?? []).some(
    (service) => service?.github?.repo === "erikagodin6-jpg/nursenest-core",
  );
}

for (const specPath of specPaths) {
  const absolutePath = path.join(root, specPath);
  if (!existsSync(absolutePath)) continue;

  let spec;
  try {
    spec = yaml.load(readFileSync(absolutePath, "utf8")) ?? {};
  } catch (error) {
    fail(`${specPath} is not valid YAML: ${error instanceof Error ? error.message : String(error)}`);
    continue;
  }

  if (!isProductionSpec(spec)) continue;
  checked.push(specPath);

  const domains = Array.isArray(spec.domains) ? spec.domains : [];
  if (domains.length === 0) {
    fail(`${specPath} is a production DigitalOcean App Platform spec but has no top-level domains block`);
    continue;
  }

  for (const [domain, expectedType] of requiredDomains) {
    const entry = domains.find((candidate) => candidate?.domain === domain);
    if (!entry) {
      fail(`${specPath} is missing domains entry for ${domain}`);
      continue;
    }

    if (entry.type !== expectedType) {
      fail(`${specPath} must set ${domain} type: ${expectedType} (found ${entry.type ?? "missing"})`);
    }
  }
}

if (checked.length === 0) {
  fail(`no production DigitalOcean App Platform specs found under ${relative(root)}`);
}

if (failures.length > 0) {
  console.error("[verify-digitalocean-domain-persistence] FATAL");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("[verify-digitalocean-domain-persistence] protected domains present:");
for (const specPath of checked) {
  console.log(`- ${specPath}: nursenest.ca PRIMARY, www.nursenest.ca ALIAS`);
}
