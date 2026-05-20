#!/usr/bin/env node
/**
 * Build gate: every string leaf under `public/i18n/en/*.json` must not contain forbidden
 * placeholder/stub values (see `marketing-message-value-policy.ts`).
 *
 * Invoked from `scripts/validate-marketing-production-surface.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const enDir = path.join(pkgRoot, "public", "i18n", "en");
const MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS = [
  "marketing",
  "nav",
  "brand",
  "components",
  "common",
  "auth",
  "billing",
  "learner",
  "errors",
  "pages",
] as const;

type FlatMessageScanHit = {
  file: string;
  key: string;
  value: string;
  reason: string;
};

const MIRROR_ROOTS = ["title", "description", "label", "question", "answer", "text", "body", "link", "lead", "kicker"] as const;
const MARKETING_FORBIDDEN_WHOLE_VALUE_CI = new Set(
  [
    "label",
    "placeholder",
    "todo",
    "tbd",
    "stub",
    "lorem",
    "heading",
    "eyebrow",
    "intro",
    "lead",
    "kicker",
    "title",
    "body",
    "link",
    "subtitle",
    "cta",
    "button",
    "copy",
    "string",
  ].map((s) => s.toLowerCase()),
);
const MARKETING_FORBIDDEN_VALUE_SUBSTRINGS = ["lorem ipsum", "<<stub", "tbd —", "{{missing", "[missing:"] as const;
const FORBIDDEN_SHOUTY_TEMPLATE_TOKENS = new Set([
  "LABEL",
  "KICKER",
  "TITLE",
  "DESCRIPTION",
  "LEAD",
  "QUESTION",
  "ANSWER",
  "BODY",
  "LINK",
  "TEXT",
  "PLACEHOLDER",
  "CTA",
  "BUTTON",
  "STUB",
  "TODO",
  "TBD",
]);

function mirrorRootFromMessageKey(messageKey: string): string | null {
  const segRaw = messageKey.includes(".") ? (messageKey.split(".").pop() ?? messageKey) : messageKey;
  const seg = segRaw.toLowerCase().replace(/\d+$/u, "");

  if ((MIRROR_ROOTS as readonly string[]).includes(seg)) return seg;

  for (const root of MIRROR_ROOTS) {
    if (seg.startsWith(root) && seg.length > root.length) return root;
  }

  return null;
}

function isKeyContentMirrorStub(messageKey: string, value: string): boolean {
  const v = value.trim();
  const root = mirrorRootFromMessageKey(messageKey);

  return Boolean(v && root && v.toLowerCase() === root);
}

function isForbiddenShoutyTemplateToken(value: string): boolean {
  const t = value.trim();
  return /^[A-Z0-9_]{3,40}$/u.test(t) && FORBIDDEN_SHOUTY_TEMPLATE_TOKENS.has(t);
}

function marketingShardUsesStrictPublicPageLeafPolicy(fileLabel: string): boolean {
  return fileLabel === "en/pages.json";
}

function scanFlatMarketingMessagesForForbiddenValues(
  fileLabel: string,
  messages: Record<string, unknown>,
): FlatMessageScanHit[] {
  const hits: FlatMessageScanHit[] = [];
  const strictLeafPolicy = marketingShardUsesStrictPublicPageLeafPolicy(fileLabel);

  for (const [key, val] of Object.entries(messages)) {
    if (typeof val !== "string") continue;

    const t = val.trim();
    if (!t) continue;

    let substringHit: string | null = null;
    for (const sub of MARKETING_FORBIDDEN_VALUE_SUBSTRINGS) {
      if (t.toLowerCase().includes(sub.toLowerCase())) {
        substringHit = sub;
        break;
      }
    }
    if (substringHit) {
      hits.push({
        file: fileLabel,
        key,
        value: t.slice(0, 120),
        reason: `forbidden substring "${substringHit}"`,
      });
      continue;
    }

    if (isForbiddenShoutyTemplateToken(t)) {
      hits.push({
        file: fileLabel,
        key,
        value: t.slice(0, 120),
        reason: "invalid marketing copy",
      });
      continue;
    }

    if (
      strictLeafPolicy &&
      (isKeyContentMirrorStub(key, t) || MARKETING_FORBIDDEN_WHOLE_VALUE_CI.has(t.toLowerCase()))
    ) {
      hits.push({
        file: fileLabel,
        key,
        value: t.slice(0, 120),
        reason: "invalid marketing copy",
      });
    }
  }

  return hits;
}

function main() {
  if (!fs.existsSync(enDir)) {
    console.error("[validate-marketing-en-shard-placeholder-leakage] missing directory:", enDir);
    process.exit(1);
  }
  const errors: string[] = [];
  for (const shard of MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS) {
    const name = `${shard}.json`;
    const fp = path.join(enDir, name);
    if (!fs.existsSync(fp)) {
      errors.push(`missing shard file: en/${name}`);
      continue;
    }
    const raw = JSON.parse(fs.readFileSync(fp, "utf8")) as Record<string, unknown>;
    const hits = scanFlatMarketingMessagesForForbiddenValues(`en/${name}`, raw);
    for (const h of hits) {
      errors.push(`${h.file} :: ${h.key} → ${h.reason} (value="${h.value}")`);
    }
  }
  if (errors.length) {
    console.error("[validate-marketing-en-shard-placeholder-leakage] FAILED:");
    for (const e of errors) console.error("  -", e);
    process.exit(1);
  }
  console.log(
    `[validate-marketing-en-shard-placeholder-leakage] OK — no forbidden placeholder leaves in default public marketing shards (${MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS.join(",")}).`,
  );
}

main();
