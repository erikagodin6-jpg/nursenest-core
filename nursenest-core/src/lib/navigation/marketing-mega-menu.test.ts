import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CANADA_NEW_GRAD_MARKETING_HUB_PATH, US_NEW_GRAD_MARKETING_HUB_PATH } from "./marketing-mega-menu-active-prefixes";
import { buildMarketingMegaMenus } from "./marketing-mega-menu";

describe("buildMarketingMegaMenus", () => {
  const t = (key: string) => key;

  it("US New Grad mega menu hub is the marketing landing (not /pre-nursing or generic /lessons)", () => {
    const menus = buildMarketingMegaMenus("US", t);
    const ng = menus.find((m) => m.key === "newgrad");
    assert.equal(ng?.hubHref, US_NEW_GRAD_MARKETING_HUB_PATH);
    const flat = ng?.groups.flatMap((g) => g.links) ?? [];
    assert.equal(flat.find((l) => l.key === "ng-lessons")?.href, "/us/rn/new-grad-transition/lessons");
    assert.equal(flat.find((l) => l.key === "ng-questions")?.href, "/us/rn/new-grad-transition/questions");
    assert.match(flat.find((l) => l.key === "ng-readiness")?.href ?? "", /\/us\/rn\/new-grad-transition\/cat$/);
    assert.equal(flat.find((l) => l.key === "ng-flashcards")?.href, "/flashcards");
    assert.equal(flat.some((l) => l.href === "/pre-nursing"), false);
    assert.equal(flat.some((l) => l.href === "/lessons"), false);
  });

  it("CA New Grad mega menu hub is the Canada new-grad landing (study links still on RN pathway)", () => {
    const menus = buildMarketingMegaMenus("CA", t);
    const ng = menus.find((m) => m.key === "newgrad");
    assert.equal(ng?.hubHref, CANADA_NEW_GRAD_MARKETING_HUB_PATH);
    const flat = ng?.groups.flatMap((g) => g.links) ?? [];
    assert.equal(flat.find((l) => l.key === "ng-lessons")?.href, "/canada/rn/nclex-rn/lessons");
    assert.equal(flat.find((l) => l.key === "ng-questions")?.href, "/canada/rn/nclex-rn/questions");
  });

  it("RN/PN mega menu Learn + Practice stay on pathway hubs (no global /lessons or /question-bank)", () => {
    const menus = buildMarketingMegaMenus("US", t);
    const rn = menus.find((x) => x.key === "rn");
    assert.equal(rn?.hubHref, "/us/rn/nclex-rn");
    const rnLessons = rn?.groups.flatMap((g) => g.links).find((l) => l.key === "rn-lessons");
    assert.equal(rnLessons?.href, "/us/rn/nclex-rn/lessons");
    const rnQuestions = rn?.groups.flatMap((g) => g.links).find((l) => l.key === "rn-questions");
    assert.equal(rnQuestions?.href, "/us/rn/nclex-rn/questions");
    for (const key of ["pn", "np"] as const) {
      const m = menus.find((x) => x.key === key);
      const lessons = m?.groups.flatMap((g) => g.links).find((l) => l.key === `${key}-lessons`);
      assert.equal(lessons?.href.startsWith("/lessons"), false);
    }
    const pn = menus.find((x) => x.key === "pn");
    const pnQ = pn?.groups.flatMap((g) => g.links).find((l) => l.key === "pn-questions");
    assert.equal(pnQ?.href, "/us/pn/nclex-pn/questions");
  });

  it("NP mega menu exposes specialty discovery links without replacing the canonical NP hub", () => {
    const usMenus = buildMarketingMegaMenus("US", t);
    const usNp = usMenus.find((m) => m.key === "np");
    assert.equal(usNp?.hubHref, "/us/np/fnp");
    const usSpecialties = usNp?.groups.find((g) => g.key === "specialties")?.links ?? [];
    assert.deepEqual(
      usSpecialties.map((link) => link.href),
      ["/us/np/fnp", "/us/np/agpcnp", "/us/np/pmhnp", "/us/np/whnp", "/us/np/pnp-pc", "/canada/np/cnple"],
    );

    const caMenus = buildMarketingMegaMenus("CA", t);
    const caNp = caMenus.find((m) => m.key === "np");
    assert.equal(caNp?.hubHref, "/canada/np/cnple");
    const caSpecialties = caNp?.groups.find((g) => g.key === "specialties")?.links ?? [];
    assert.equal(caSpecialties.some((link) => link.href === "/canada/np/cnple"), true);
    assert.equal(caSpecialties.some((link) => link.href === "/us/np/whnp"), true);
  });
});
