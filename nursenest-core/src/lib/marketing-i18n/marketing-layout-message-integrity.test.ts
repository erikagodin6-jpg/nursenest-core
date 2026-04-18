import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { MARKETING_CHROME_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import {
  assertMarketingLayoutMessagesIntegrity,
  resolveDefaultEnglishMarketingLayoutMessages,
} from "@/lib/marketing-i18n/marketing-layout-message-integrity";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EN_DIR = path.join(__dirname, "..", "..", "..", "public", "i18n", "en");

function readChromeBundle(): MarketingMessages {
  return MARKETING_CHROME_MESSAGE_SHARDS.reduce<MarketingMessages>((merged, shard) => {
    const shardPath = path.join(EN_DIR, `${shard}.json`);
    return {
      ...merged,
      ...(JSON.parse(fs.readFileSync(shardPath, "utf8")) as MarketingMessages),
    };
  }, {});
}

test("English empty marketing bundle falls back to canonical English messages", () => {
  const messages = resolveDefaultEnglishMarketingLayoutMessages({
    route: "shared-marketing-default",
    messages: {},
  });

  assert.equal(typeof messages["brand.nurseNest"], "string");
  assert.equal(typeof messages["nav.logIn"], "string");
  assert.notEqual(Object.keys(messages).length, 0);
});

test("Do not allow messageCount: 0 to render the marketing shell as healthy", () => {
  assert.throws(
    () =>
      assertMarketingLayoutMessagesIntegrity({
        route: "shared-marketing-default",
        locale: "en",
        messages: {},
      }),
    /loaded 0 primary messages/,
  );
});

test("English missing required keys fails loudly", () => {
  const messages = readChromeBundle();
  delete messages["nav.logIn"];
  delete messages["footer.blog"];

  assert.throws(
    () =>
      assertMarketingLayoutMessagesIntegrity({
        route: "shared-marketing-default",
        locale: "en",
        messages,
      }),
    /nav\.logIn|footer\.blog/,
  );
});

test("valid marketing chrome bundle passes and contains nav, footer, and hero keys", () => {
  const messages = readChromeBundle();

  assert.equal(typeof messages["nav.logIn"], "string");
  assert.equal(typeof messages["footer.rights"], "string");
  assert.equal(typeof messages["components.homeHeroCarousel.slide01.title"], "string");
  assert.doesNotThrow(() =>
    assertMarketingLayoutMessagesIntegrity({
      route: "shared-marketing-default",
      locale: "en",
      messages,
    }),
  );
});
