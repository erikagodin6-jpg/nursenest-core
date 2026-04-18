import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { shouldBypassMarketingI18nAtStartup } from "@/lib/marketing-i18n/marketing-i18n-startup";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("bypasses marketing i18n loads during production startup window", () => {
  assert.equal(
    shouldBypassMarketingI18nAtStartup({
      uptimeMs: 5_000,
      nodeEnv: "production",
      ci: "0",
    }),
    true,
  );
});

test("does not bypass marketing i18n loads after startup window", () => {
  assert.equal(
    shouldBypassMarketingI18nAtStartup({
      uptimeMs: 30_000,
      nodeEnv: "production",
      ci: "0",
    }),
    false,
  );
});

test("does not bypass marketing i18n loads outside production", () => {
  assert.equal(
    shouldBypassMarketingI18nAtStartup({
      uptimeMs: 5_000,
      nodeEnv: "development",
      ci: "0",
    }),
    false,
  );
});

test("marketing layouts enforce message integrity before rendering chrome", () => {
  const defaultLayout = fs.readFileSync(path.join(__dirname, "..", "..", "app", "(marketing)", "(default)", "layout.tsx"), "utf8");
  const localeLayout = fs.readFileSync(path.join(__dirname, "..", "..", "app", "(marketing)", "[locale]", "layout.tsx"), "utf8");

  assert.equal(defaultLayout.includes("assertMarketingLayoutMessagesIntegrity"), true);
  assert.equal(localeLayout.includes("assertMarketingLayoutMessagesIntegrity"), true);
  assert.equal(defaultLayout.includes("resolveDefaultEnglishMarketingLayoutMessages"), false);
});
