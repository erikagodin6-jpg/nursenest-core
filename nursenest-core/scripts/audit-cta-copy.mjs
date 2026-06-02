#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import {
  containsPlaceholderCTACopy,
  isLikelyCTA,
  normalizeCTAText,
  validateCTACasing,
} from "../src/lib/ui/cta-copy-policy.ts";

const ROOT = process.cwd();
const STRICT = process.env.CTA_AUDIT_STRICT === "1";
const MAX_FINDINGS_TO_PRINT = Number.parseInt(process.env.CTA_AUDIT_MAX_PRINT ?? "80", 10);

const SCAN_ROOTS = [
  "src/app",
  "src/components",
  "src/config",
  "src/lib",
  "src/legacy",
  "scripts/i18n",
];

const EXCLUDED_PATH_PARTS = [
  `${path.sep}.next${path.sep}`,
  `${path.sep}node_modules${path.sep}`,
  `${path.sep}src${path.sep}content${path.sep}`,
  `${path.sep}src${path.sep}content-pipeline${path.sep}`,
  `${path.sep}src${path.sep}content-quality${path.sep}`,
  `${path.sep}src${path.sep}content-source-of-truth${path.sep}`,
  `${path.sep}src${path.sep}study-content-failover${path.sep}`,
  `${path.sep}src${path.sep}lib${path.sep}blog${path.sep}`,
  `${path.sep}src${path.sep}lib${path.sep}content${path.sep}`,
  `${path.sep}src${path.sep}lib${path.sep}lessons${path.sep}`,
  `${path.sep}src${path.sep}lib${path.sep}questions${path.sep}`,
  `${path.sep}src${path.sep}lib${path.sep}clinical${path.sep}`,
];

const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".json"]);

const CTA_KEY_RE =
  /(?:^|[.\-_])(cta|ctaText|ctaLabel|buttonText|buttonLabel|buttonCopy|actionLabel|actionText|linkLabel|launchLabel|primaryCta|secondaryCta|primaryAction|secondaryAction|pricingAction|onboardingAction|paywallAction)(?:$|[.\-_])/i;

const KEY_VALUE_RE =
  /(?<key>\b(?:cta(?:Text|Label|Copy)?|buttonText|buttonLabel|buttonCopy|actionLabel|actionText|linkLabel|launchLabel|primaryCta|secondaryCta|primaryAction|secondaryAction|pricingAction|onboardingAction|paywallAction)\b)\s*[:=]\s*(?<quote>["'`])(?<value>[^"'`\n]{1,96})\k<quote>/g;

const JSX_ACTION_RE =
  /<(?<tag>Button|LearnerCtaLink|Link|MarketingButton|PrimaryButton|SecondaryButton)[^>]*>(?<value>[^<>{}\n]{1,80})<\/\k<tag>>/g;

const NON_COPY_VARIANT_VALUES = new Set([
  "primary",
  "secondary",
  "tertiary",
  "ghost",
  "outline",
  "link",
  "button",
  "marketing",
  "learner",
]);

const regressionFixtures = [
  "View plans and pricing",
  "Choose your occupation track",
  "Start mixed practice (all hubs)",
  "Create account",
  "START PRACTICE TEST",
  "placeholder CTA",
  "click here",
];

function shouldSkip(filePath) {
  const absolute = path.resolve(ROOT, filePath);
  return EXCLUDED_PATH_PARTS.some((part) => absolute.includes(part));
}

async function collectFiles(dir, out = []) {
  let entries = [];
  try {
    entries = await readdir(path.resolve(ROOT, dir), { withFileTypes: true });
  } catch {
    return out;
  }

  for (const entry of entries) {
    const rel = path.join(dir, entry.name);
    if (shouldSkip(rel)) continue;
    if (entry.isDirectory()) {
      await collectFiles(rel, out);
      continue;
    }
    if (!entry.isFile()) continue;
    if (!SOURCE_EXTENSIONS.has(path.extname(entry.name))) continue;
    if (/\.test\.(ts|tsx)$/i.test(entry.name)) continue;
    out.push(rel);
  }
  return out;
}

function lineForOffset(text, offset) {
  return text.slice(0, offset).split("\n").length;
}

function addFinding(findings, file, line, context, value) {
  const clean = value.replace(/\s+/g, " ").trim();
  if (!clean) return;
  if (NON_COPY_VARIANT_VALUES.has(clean.toLowerCase())) return;
  if (!containsPlaceholderCTACopy(clean) && !isLikelyCTA(clean, context)) return;

  const result = validateCTACasing(clean);
  if (result.ok && !containsPlaceholderCTACopy(clean)) return;

  findings.push({
    file,
    line,
    context,
    value: clean,
    normalized: result.normalized || normalizeCTAText(clean),
    issues: result.issues,
  });
}

function scanSourceFile(file, text, findings) {
  for (const match of text.matchAll(KEY_VALUE_RE)) {
    const key = match.groups?.key ?? "cta";
    const value = match.groups?.value ?? "";
    addFinding(findings, file, lineForOffset(text, match.index ?? 0), key, value);
  }

  for (const match of text.matchAll(JSX_ACTION_RE)) {
    const tag = match.groups?.tag ?? "Button";
    const value = match.groups?.value ?? "";
    addFinding(findings, file, lineForOffset(text, match.index ?? 0), tag, value);
  }
}

function scanJsonValue(file, keyPath, value, findings) {
  if (typeof value === "string") {
    if (CTA_KEY_RE.test(keyPath)) {
      addFinding(findings, file, 1, keyPath, value);
    }
    return;
  }
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((item, index) => scanJsonValue(file, `${keyPath}.${index}`, item, findings));
    return;
  }
  for (const [key, nested] of Object.entries(value)) {
    scanJsonValue(file, keyPath ? `${keyPath}.${key}` : key, nested, findings);
  }
}

function verifyRegressionFixtures() {
  return regressionFixtures.map((value) => {
    const result = validateCTACasing(value);
    return { value, caught: !result.ok, normalized: result.normalized, issues: result.issues };
  });
}

const files = [];
for (const root of SCAN_ROOTS) {
  await collectFiles(root, files);
}

const findings = [];
for (const file of files) {
  const text = await readFile(path.resolve(ROOT, file), "utf8");
  if (file.endsWith(".json")) {
    try {
      scanJsonValue(file, "", JSON.parse(text), findings);
    } catch {
      scanSourceFile(file, text, findings);
    }
  } else {
    scanSourceFile(file, text, findings);
  }
}

const fixtureResults = verifyRegressionFixtures();

console.log("[cta-copy-audit] CTA policy fixture checks:");
for (const item of fixtureResults) {
  console.log(
    `[cta-copy-audit] ${item.caught ? "caught" : "missed"} "${item.value}" -> "${item.normalized}" (${item.issues.join(", ") || "ok"})`,
  );
}

console.log("");
console.log(`[cta-copy-audit] Scanned ${files.length} files.`);
console.log(`[cta-copy-audit] Findings: ${findings.length}`);

for (const finding of findings.slice(0, MAX_FINDINGS_TO_PRINT)) {
  console.log(
    `${finding.file}:${finding.line} [${finding.context}] "${finding.value}" -> "${finding.normalized}" (${finding.issues.join(", ")})`,
  );
}

if (findings.length > MAX_FINDINGS_TO_PRINT) {
  console.log(`[cta-copy-audit] ${findings.length - MAX_FINDINGS_TO_PRINT} additional findings omitted. Set CTA_AUDIT_MAX_PRINT to adjust.`);
}

if (findings.length > 0) {
  console.log(
    STRICT
      ? "[cta-copy-audit] Strict mode enabled; failing on CTA copy findings."
      : "[cta-copy-audit] Dry run only. Set CTA_AUDIT_STRICT=1 to fail on findings.",
  );
}

process.exit(STRICT && findings.length > 0 ? 1 : 0);
