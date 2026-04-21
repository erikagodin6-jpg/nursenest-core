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

function readChromeBundle(): MarketingMessages {
  return MARKETING_CHROME_MESSAGE_SHARDS.reduce<MarketingMessages>((merged, shard) => {
    const shardPath = path.join(EN_DIR, `${shard}.json`);
    return {
      ...merged,
      ...(JSON.parse(fs.readFileSync(shardPath, "utf8")) as MarketingMessages),
    };
  }, {});
}

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

test("marketing layout integrity throws when hero carousel chrome key is missing", () => {
  const messages = readChromeBundle();
  const slideTitleKey = homeHeroSlideTitleKey(1);
  assert.equal(typeof messages[slideTitleKey], "string");
  delete messages[slideTitleKey];

  assert.throws(
    () =>
      assertMarketingLayoutMessagesIntegrity({
        route: "shared-marketing-default",
        locale: "en",
        messages,
      }),
    /missing or empty marketing chrome keys/,
  );
});

test("marketing layout integrity throws on missing required keys and passes for a valid bundle", () => {
  const messages = readChromeBundle();
  delete messages["nav.logIn"];

  assert.throws(
    () =>
      assertMarketingLayoutMessagesIntegrity({
        route: "shared-marketing-default",
        locale: "en",
        messages,
      }),
    /nav\.logIn/,
  );

  const validMessages = readChromeBundle();

  assert.equal(typeof validMessages["nav.logIn"], "string");
  assert.equal(typeof validMessages["footer.faq"], "string");
  assert.doesNotThrow(() =>
    assertMarketingLayoutMessagesIntegrity({
      route: "shared-marketing-default",
      locale: "en",
      messages: validMessages,
    }),
  );
});
