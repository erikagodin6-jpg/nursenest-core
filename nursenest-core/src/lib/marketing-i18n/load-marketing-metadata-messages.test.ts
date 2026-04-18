import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { MARKETING_CHROME_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { loadMarketingMetadataMessagesSync } from "@/lib/marketing-i18n/load-marketing-metadata-messages";

describe("loadMarketingMetadataMessagesSync", () => {
  it("returns only the requested metadata keys", () => {
    const keys = ["pages.home.metaTitleUS", "tools.hub.metaTitle"] as const;

    const messages = loadMarketingMetadataMessagesSync(DEFAULT_MARKETING_LOCALE, keys, [
      ...MARKETING_CHROME_MESSAGE_SHARDS,
      "pages",
    ]);

    assert.deepEqual(Object.keys(messages).sort(), [...keys].sort());
    assert.equal(typeof messages["pages.home.metaTitleUS"], "string");
    assert.equal(typeof messages["tools.hub.metaTitle"], "string");
    assert.equal(messages["nav.home"], undefined);
  });

  it("falls back to the default locale when the requested locale has no shard", () => {
    const keys = ["exams.india.metaTitle", "tools.medMath.metaTitle"] as const;

    const fallback = loadMarketingMetadataMessagesSync("zz", keys);
    const english = loadMarketingMetadataMessagesSync(DEFAULT_MARKETING_LOCALE, keys);

    assert.deepEqual(fallback, english);
  });
});
