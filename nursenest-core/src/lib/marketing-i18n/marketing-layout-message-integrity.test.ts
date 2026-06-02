import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { homeHeroSlideTitleKey } from "@/config/home-hero-carousel";
import { MARKETING_CHROME_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { assertMarketingLayoutMessagesIntegrity } from "@/lib/marketing-i18n/marketing-layout-message-integrity";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EN_DIR = path.join(__dirname, "..", "..", "..", "public", "i18n", "en");

function readJsonFile(filePath: string): MarketingMessages {
  assert.ok(fs.existsSync(filePath), `Missing i18n shard: ${filePath}`);

  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw) as MarketingMessages;

  assert.ok(parsed && typeof parsed === "object", `Invalid i18n shard: ${filePath}`);
  assert.ok(Object.keys(parsed).length > 0, `Empty i18n shard: ${filePath}`);

  return parsed;
}

function readChromeBundle(): MarketingMessages {
  return MARKETING_CHROME_MESSAGE_SHARDS.reduce<MarketingMessages>((merged, shard) => {
    const shardPath = path.join(EN_DIR, `${shard}.json`);
    return {
      ...merged,
      ...readJsonFile(shardPath),
    };
  }, {});
}

function assertInvalidBundle(messages: MarketingMessages, expected: RegExp) {
  assert.throws(
    () =>
      assertMarketingLayoutMessagesIntegrity({
        route: "shared-marketing-default",
        locale: "en",
        messages,
      }),
    expected,
  );
}

function assertValidBundle(messages: MarketingMessages) {
  assert.doesNotThrow(() =>
    assertMarketingLayoutMessagesIntegrity({
      route: "shared-marketing-default",
      locale: "en",
      messages,
    }),
  );
}

test("chrome shard bundle fixture is present and non-empty", () => {
  const messages = readChromeBundle();

  assert.ok(Object.keys(messages).length > 0, "Chrome bundle must not be empty");
  assert.equal(typeof messages["nav.logIn"], "string");
  assert.equal(typeof messages["footer.faq"], "string");
});

test("does not allow messageCount: 0 to render marketing shell as healthy", () => {
  assertInvalidBundle({}, /loaded 0 primary messages/);
});

test("throws when homepage hero carousel chrome key is missing", () => {
  const messages = readChromeBundle();
  const slideTitleKey = homeHeroSlideTitleKey(1);

  assert.equal(typeof messages[slideTitleKey], "string");

  delete messages[slideTitleKey];

  assertInvalidBundle(messages, /missing or empty marketing chrome keys/);
});

test("throws when required nav key is missing", () => {
  const messages = readChromeBundle();

  assert.equal(typeof messages["nav.logIn"], "string");

  delete messages["nav.logIn"];

  assertInvalidBundle(messages, /nav\.logIn/);
});

test("throws when required footer key is missing", () => {
  const messages = readChromeBundle();

  assert.equal(typeof messages["footer.faq"], "string");

  delete messages["footer.faq"];

  assertInvalidBundle(messages, /footer\.faq/);
});

test("throws when required key exists but is empty", () => {
  const messages = readChromeBundle();

  messages["nav.logIn"] = "";

  assertInvalidBundle(messages, /nav\.logIn/);
});

test("passes for valid English chrome bundle", () => {
  const messages = readChromeBundle();

  assertValidBundle(messages);
});