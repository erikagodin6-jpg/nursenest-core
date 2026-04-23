import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getRequiredPublicMetadataInterpolated,
  getRequiredPublicMetadataLine,
} from "@/lib/marketing-i18n/marketing-metadata-strict";
import { defaultHomeMetaTitle } from "@/lib/marketing/nursing-tier-public-labels";

describe("getRequiredPublicMetadataLine", () => {
  it("returns resolved copy when the key exists", () => {
    const m = { "pages.smoke.meta": "Smoke meta title" } as Record<string, string>;
    assert.equal(getRequiredPublicMetadataLine(m, "pages.smoke.meta", undefined, "Fallback"), "Smoke meta title");
  });

  it("throws in development when the key is missing", () => {
    const prev = process.env.NODE_ENV;
    Object.assign(process.env, { NODE_ENV: "development" });
    try {
      assert.throws(
        () => getRequiredPublicMetadataLine({}, "pages.intentionally.missing.meta", undefined, defaultHomeMetaTitle("CA")),
        /missing or forbidden/,
      );
    } finally {
      Object.assign(process.env, { NODE_ENV: prev });
    }
  });

  it("returns explicit production fallback when the key is missing in production", () => {
    const prev = process.env.NODE_ENV;
    Object.assign(process.env, { NODE_ENV: "production" });
    try {
      const fb = defaultHomeMetaTitle("CA");
      assert.equal(
        getRequiredPublicMetadataLine({}, "pages.intentionally.missing.meta", undefined, fb),
        fb,
      );
    } finally {
      Object.assign(process.env, { NODE_ENV: prev });
    }
  });

  it("rejects forbidden placeholder literals in productionOnlyFallback (throws in all environments)", () => {
    assert.throws(() => getRequiredPublicMetadataLine({}, "pages.x.meta", undefined, "Title"), /marketing/);
  });
});

describe("getRequiredPublicMetadataInterpolated", () => {
  it("interpolates params into a resolved template", () => {
    const m = { "pages.smoke.metaDeck": "{{title}} · {{count}} cards" } as Record<string, string>;
    assert.equal(
      getRequiredPublicMetadataInterpolated(m, "pages.smoke.metaDeck", { title: "A", count: 3 }, undefined, "FB"),
      "A · 3 cards",
    );
  });

  it("throws in development when the template key is missing", () => {
    const prev = process.env.NODE_ENV;
    Object.assign(process.env, { NODE_ENV: "development" });
    try {
      assert.throws(
        () =>
          getRequiredPublicMetadataInterpolated(
            {},
            "pages.intentionally.missing.interpolated",
            { x: 1 },
            undefined,
            defaultHomeMetaTitle("CA"),
          ),
        /missing or forbidden/,
      );
    } finally {
      Object.assign(process.env, { NODE_ENV: prev });
    }
  });
});
