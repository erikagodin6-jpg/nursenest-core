import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { MARKETING_CHROME_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { loadMarketingMetadataMessagesSync } from "@/lib/marketing-i18n/load-marketing-metadata-messages";

describe("loadMarketingMetadataMessagesSync", () => {
  it("returns only the requested metadata keys (safe)", () => {
    const keys = ["pages.home.metaTitleCA", "tools.hub.metaTitle"] as const;

    const messages = loadMarketingMetadataMessagesSync(
      DEFAULT_MARKETING_LOCALE,
      keys,
      [...MARKETING_CHROME_MESSAGE_SHARDS, "pages"]
    );

    // must return only requested keys
    assert.deepEqual(Object.keys(messages).sort(), [...keys].sort());

    // values should not crash even if missing
    for (const k of keys) {
      assert.ok(
        typeof messages[k] === "string" || messages[k] === undefined,
        `key ${k} must be string or undefined`
      );
    }

    // ensure no leakage
    assert.equal(messages["nav.home"], undefined);
  });

  it("falls back safely to default locale", () => {
    const keys = ["exams.india.metaTitle", "tools.medMath.metaTitle"] as const;

    const fallback = loadMarketingMetadataMessagesSync("zz", keys);
    const english = loadMarketingMetadataMessagesSync(DEFAULT_MARKETING_LOCALE, keys);

    assert.deepEqual(fallback, english);
  });

  it("never throws on bad input", () => {
    assert.doesNotThrow(() => {
      loadMarketingMetadataMessagesSync("invalid-locale", ["bad.key"] as any);
    });
  });
});