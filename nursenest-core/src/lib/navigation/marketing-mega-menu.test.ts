import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildMarketingMegaMenus } from "./marketing-mega-menu";

describe("buildMarketingMegaMenus", () => {
  const t = (key: string) => key;

  it("US New Grad mega menu uses the transition pathway lesson hub (not /pre-nursing or generic /lessons)", () => {
    const menus = buildMarketingMegaMenus("US", t);
    const ng = menus.find((m) => m.key === "newgrad");
    assert.equal(ng?.hubHref, "/us/rn/new-grad-transition/lessons");
    const flat = ng?.groups.flatMap((g) => g.links) ?? [];
    assert.equal(flat.find((l) => l.key === "ng-lessons")?.href, "/us/rn/new-grad-transition/lessons");
    assert.equal(flat.find((l) => l.key === "ng-questions")?.href, "/us/rn/new-grad-transition/questions");
    assert.match(flat.find((l) => l.key === "ng-readiness")?.href ?? "", /\/us\/rn\/new-grad-transition\/cat$/);
    assert.equal(flat.find((l) => l.key === "ng-flashcards")?.href, "/flashcards");
    assert.equal(flat.some((l) => l.href === "/pre-nursing"), false);
    assert.equal(flat.some((l) => l.href === "/lessons"), false);
  });

  it("CA New Grad mega menu stays on canonical RN surfaces (region policy)", () => {
    const menus = buildMarketingMegaMenus("CA", t);
    const ng = menus.find((m) => m.key === "newgrad");
    assert.equal(ng?.hubHref, "/lessons");
    const flat = ng?.groups.flatMap((g) => g.links) ?? [];
    assert.equal(flat.find((l) => l.key === "ng-lessons")?.href, "/lessons");
  });

  it("RN mega menu uses global lessons + question bank; PN/NP stay pathway-scoped", () => {
    const menus = buildMarketingMegaMenus("US", t);
    const rn = menus.find((x) => x.key === "rn");
    const rnLessons = rn?.groups.flatMap((g) => g.links).find((l) => l.key === "rn-lessons");
    assert.equal(rnLessons?.href, "/lessons");
    const rnQuestions = rn?.groups.flatMap((g) => g.links).find((l) => l.key === "rn-questions");
    assert.equal(rnQuestions?.href, "/question-bank");
    for (const key of ["pn", "np"] as const) {
      const m = menus.find((x) => x.key === key);
      const lessons = m?.groups.flatMap((g) => g.links).find((l) => l.key === `${key}-lessons`);
      assert.equal(lessons?.href.startsWith("/lessons"), false);
    }
  });
});
