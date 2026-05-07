import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CANADA_NEW_GRAD_MARKETING_HUB_PATH,
  strippedPathActivatesMegaMenuKey,
} from "./marketing-mega-menu-active-prefixes";

describe("strippedPathActivatesMegaMenuKey", () => {
  it("activates Allied on global hub and occupation hubs without requiring legacy country prefixes", () => {
    assert.equal(strippedPathActivatesMegaMenuKey("allied", "/allied/allied-health"), true);
    assert.equal(strippedPathActivatesMegaMenuKey("allied", "/allied/mlt"), true);
    assert.equal(strippedPathActivatesMegaMenuKey("allied", "/allied/respiratory/lessons"), true);
  });

  it("does not activate Allied on unrelated nursing hubs", () => {
    assert.equal(strippedPathActivatesMegaMenuKey("allied", "/us/rn/nclex-rn"), false);
  });

  it("activates New Grad on locale-stripped /new-grad without matching /new-graduation", () => {
    assert.equal(strippedPathActivatesMegaMenuKey("newgrad", "/new-grad"), true);
    assert.equal(strippedPathActivatesMegaMenuKey("newgrad", "/new-graduation"), false);
  });

  it("activates New Grad on Canada landing", () => {
    assert.equal(strippedPathActivatesMegaMenuKey("newgrad", CANADA_NEW_GRAD_MARKETING_HUB_PATH), true);
  });
});
