import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MEGA_MENU_STRIPPED_ACTIVE_PREFIXES, publicNewGradStudyDestinations } from "./marketing-pathway-nav-destinations";

describe("publicNewGradStudyDestinations", () => {
  it("US: hub is pathway root; lessons target the dedicated new-grad transition pathway (not pre-nursing)", () => {
    const d = publicNewGradStudyDestinations("US", "/us/rn/nclex-rn");
    assert.equal(d.hubHref, "/us/rn/new-grad-transition");
    assert.equal(d.lessons, "/us/rn/new-grad-transition/lessons");
    assert.equal(d.questions, "/us/rn/new-grad-transition/questions");
    assert.match(d.cat, /\/us\/rn\/new-grad-transition\/cat$/);
  });

  it("CA: lessons and questions stay on the RN hub (no mixed-tier /lessons or /question-bank)", () => {
    const rnHub = "/canada/rn/nclex-rn";
    const d = publicNewGradStudyDestinations("CA", rnHub);
    assert.equal(d.hubHref, rnHub);
    assert.equal(d.lessons, `${rnHub}/lessons`);
    assert.equal(d.questions, `${rnHub}/questions`);
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
    assert.equal(
      MEGA_MENU_STRIPPED_ACTIVE_PREFIXES.newgrad.some((p) => "/us/rn/new-grad-transition".startsWith(p)),
      true,
    );
  });
});
