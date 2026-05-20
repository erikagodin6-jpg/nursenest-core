import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { SUPPORT_CONTACT_COPY, SUPPORT_EMAIL, SUPPORT_RESPONSE_TIME_COPY } from "./support-policy";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.join(__dirname, "..", "..");

const FORBIDDEN = [
  /\blive\s+chat\b/i,
  /\bchat\s+with\s+us\b/i,
  /\bsupport\s+chat\b/i,
  /\bmessage\s+us\b/i,
  /\btalk\s+to\s+us\b/i,
  /\bcontact\s+chat\b/i,
] as const;

function* walkFiles(dir: string, exts: Set<string>): Generator<string> {
  if (!fs.existsSync(dir)) return;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".next") continue;
      yield* walkFiles(full, exts);
    } else if (ent.isFile()) {
      const ext = path.extname(ent.name);
      if (exts.has(ext)) yield full;
    }
  }
}

function assertNoForbiddenCopy(label: string, text: string, file: string) {
  for (const re of FORBIDDEN) {
    const m = text.match(re);
    assert.equal(
      m,
      null,
      `${label}: forbidden public copy ${re} in ${path.relative(repoRoot, file)}: ${m?.[0] ?? ""}`,
    );
  }
}

test("public legal markdown has no forbidden live-support phrasing", () => {
  const legalDir = path.join(repoRoot, "content", "legal");
  for (const file of walkFiles(legalDir, new Set([".md"]))) {
    const text = fs.readFileSync(file, "utf8");
    assertNoForbiddenCopy("legal", text, file);
  }
});

test("public i18n JSON values have no forbidden live-support phrasing", () => {
  const i18nDir = path.join(repoRoot, "public", "i18n");
  for (const file of walkFiles(i18nDir, new Set([".json"]))) {
    const raw = fs.readFileSync(file, "utf8");
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw) as Record<string, string>;
    } catch {
      assert.fail(`invalid JSON: ${path.relative(repoRoot, file)}`);
    }
    if (!parsed || typeof parsed !== "object") continue;
    for (const v of Object.values(parsed as Record<string, unknown>)) {
      if (typeof v !== "string") continue;
      assertNoForbiddenCopy("i18n", v, file);
    }
  }
});

test("support policy exports stay aligned with response-time copy", () => {
  assert.match(SUPPORT_CONTACT_COPY, new RegExp(SUPPORT_EMAIL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert(SUPPORT_CONTACT_COPY.includes(SUPPORT_RESPONSE_TIME_COPY));
});
