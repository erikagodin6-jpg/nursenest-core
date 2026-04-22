import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LearnerKickerHeading } from "@/components/learner-ui/learner-kicker-heading";
import { assertKeysLoadedByDefaultPublicMarketingLayout } from "@/lib/marketing-i18n/marketing-public-layout-shard-coverage";
import {
  formatMarketingMessage,
  getOptionalPublicMessage,
  getRequiredPublicMessage,
  type MarketingMessages,
} from "@/lib/marketing-i18n-core";

describe("public marketing copy hardening (contract)", () => {
  it("formatMarketingMessage never emits humanized missing-key tails in development", () => {
    const prev = process.env.NODE_ENV;
    Object.assign(process.env, { NODE_ENV: "development" });
    try {
      assert.equal(formatMarketingMessage({}, "pages.home.hero.intentionallyMissing", undefined, undefined), "");
    } finally {
      Object.assign(process.env, { NODE_ENV: prev });
    }
  });

  it("getOptionalPublicMessage returns empty for missing keys and scrubs shouty tokens", () => {
    assert.equal(getOptionalPublicMessage({}, "pages.any.optional"), "");
    const m: MarketingMessages = { "x.y": "KICKER" };
    const prev = process.env.NODE_ENV;
    Object.assign(process.env, { NODE_ENV: "production" });
    try {
      assert.equal(getOptionalPublicMessage(m, "x.y"), "");
    } finally {
      Object.assign(process.env, { NODE_ENV: prev });
    }
  });

  it("getRequiredPublicMessage throws when the bundle only contains a mirror stub title", () => {
    const m: MarketingMessages = { "pages.shop.title": "Title" };
    assert.throws(() => getRequiredPublicMessage(m, "pages.shop.title"), /missing or forbidden/);
  });

  it("default public marketing layout merge covers a representative homepage key shard", () => {
    assert.doesNotThrow(() =>
      assertKeysLoadedByDefaultPublicMarketingLayout(["pages.home.hero.headline"], "contract:home-headline"),
    );
  });

  it("LearnerKickerHeading omits the kicker row when kicker is absent or whitespace (no empty placeholder line)", () => {
    const a = renderToStaticMarkup(createElement(LearnerKickerHeading, { title: "T" }));
    assert.equal(a.includes("nn-ls-kicker"), false);
    const b = renderToStaticMarkup(createElement(LearnerKickerHeading, { kicker: "   ", title: "T" }));
    assert.equal(b.includes("nn-ls-kicker"), false);
    const c = renderToStaticMarkup(createElement(LearnerKickerHeading, { kicker: "Real", title: "T" }));
    assert.equal(c.includes("nn-ls-kicker"), true);
    assert.match(c, /Real/);
  });
});
