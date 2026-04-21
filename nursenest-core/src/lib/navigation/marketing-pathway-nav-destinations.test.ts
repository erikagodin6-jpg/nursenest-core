import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MEGA_MENU_STRIPPED_ACTIVE_PREFIXES, publicNewGradStudyDestinations } from "./marketing-pathway-nav-destinations";

describe("publicNewGradStudyDestinations", () => {
  it("US: hub and lessons target the dedicated new-grad transition pathway (not pre-nursing)", () => {
    const d = publicNewGradStudyDestinations("US", "/us/rn/nclex-rn");
    assert.equal(d.hubHref, "/us/rn/new-grad-transition/lessons");
    assert.equal(d.lessons, "/us/rn/new-grad-transition/lessons");
    assert.equal(d.questions, "/us/rn/new-grad-transition/questions");
    assert.match(d.cat, /\/us\/rn\/new-grad-transition\/cat$/);
  });

  it("CA: aligns to canonical RN hub + RN lesson entry (matches /[locale]/new-grad redirect policy)", () => {
    const rnHub = "/lessons";
    const d = publicNewGradStudyDestinations("CA", rnHub);
    assert.equal(d.hubHref, rnHub);
    assert.equal(d.lessons, "/lessons");
    assert.equal(d.questions, "/question-bank");
    assert.match(d.cat, /\/canada\/rn\/nclex-rn\/cat$/);
  });
});

describe("MEGA_MENU_STRIPPED_ACTIVE_PREFIXES", () => {
  it("does not mark New Grad active on the global /lessons index", () => {
    assert.equal(MEGA_MENU_STRIPPED_ACTIVE_PREFIXES.newgrad.some((p) => p === "/lessons"), false);
    assert.equal(
      MEGA_MENU_STRIPPED_ACTIVE_PREFIXES.newgrad.some((p) => "/lessons".startsWith(p)),
      false,
    );
  });

  it("marks New Grad active on the US transition pathway", () => {
    assert.equal(
      MEGA_MENU_STRIPPED_ACTIVE_PREFIXES.newgrad.some((p) => "/us/rn/new-grad-transition/lessons".startsWith(p)),
      true,
    );
  });
});
