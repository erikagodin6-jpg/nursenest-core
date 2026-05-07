import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CANADA_NEW_GRAD_MARKETING_HUB_PATH, US_NEW_GRAD_MARKETING_HUB_PATH } from "./marketing-mega-menu-active-prefixes";
import { MEGA_MENU_STRIPPED_ACTIVE_PREFIXES, publicNewGradStudyDestinations } from "./marketing-pathway-nav-destinations";

describe("publicNewGradStudyDestinations", () => {
  it("US: marketing hub is /us/new-grad; lessons target the dedicated new-grad transition pathway (not pre-nursing)", () => {
    const d = publicNewGradStudyDestinations("US", "/us/rn/nclex-rn");
    assert.equal(d.hubHref, US_NEW_GRAD_MARKETING_HUB_PATH);
    assert.equal(d.lessons, "/us/rn/new-grad-transition/lessons");
    assert.equal(d.questions, "/us/rn/new-grad-transition/questions");
    assert.match(d.cat, /\/us\/rn\/new-grad-transition\/cat$/);
  });

  it("CA: hub is Canada new-grad landing; lessons/questions stay on the RN hub (no mixed-tier /lessons)", () => {
    const rnHub = "/canada/rn/nclex-rn";
    const d = publicNewGradStudyDestinations("CA", rnHub);
    assert.equal(d.hubHref, CANADA_NEW_GRAD_MARKETING_HUB_PATH);
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

  it("marks New Grad active on the US marketing landing and work-area hubs", () => {
    assert.equal(
      MEGA_MENU_STRIPPED_ACTIVE_PREFIXES.newgrad.some((p) => "/us/new-grad/emergency-department".startsWith(p)),
      true,
    );
    assert.equal(
      MEGA_MENU_STRIPPED_ACTIVE_PREFIXES.newgrad.some((p) => "/us/new-grad".startsWith(p)),
      true,
    );
  });
});
