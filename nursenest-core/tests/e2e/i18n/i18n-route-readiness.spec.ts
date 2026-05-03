import { expect, test } from "@playwright/test";
import { dismissMarketingScrims } from "../helpers/marketing-smoke-scrims";

const RAW_KEYISH = /\b(?:pages|nav|footer|brand|components|common|billing|learner|auth)\.[a-z0-9_.-]+/i;
const MISSING_OR_PLACEHOLDER = /\[missing[:\]]|\{\{missing|TODO\b|TBD\b|lorem ipsum|translate this|content unavailable right now/i;
const FRENCH_UI = /\b(Tarifs|Connexion|Accueil|Leçons|Questions d'entraînement|Cartes mémoire)\b/i;
const SPANISH_UI = /\b(Precios|Iniciar sesión|Inicio|Lecciones|Preguntas de práctica|Tarjetas de memoria)\b/i;
const ENGLISH_FALLBACK = /\b(Sign In|Sign Up|Get Started|Pricing|Practice questions|Flashcards|My Dashboard|Subscribe|Lessons)\b/i;

const ROUTES = [
  { path: "/", locale: "en", indexable: true },
  { path: "/fr", locale: "fr", indexableWhenComplete: true },
  { path: "/es", locale: "es", indexable: true },
  { path: "/rex-pn", locale: "en", indexable: true, allow404: true },
  { path: "/fr/rex-pn", locale: "fr", indexableWhenComplete: true, allow404: true },
  { path: "/es/rex-pn", locale: "es", indexable: true, allow404: true },
  { path: "/es/rn", locale: "es", indexable: true, allow404: true },
  { path: "/es/np", locale: "es", indexable: true, allow404: true },
  { path: "/pricing", locale: "en", indexable: true },
  { path: "/fr/pricing", locale: "fr", indexableWhenComplete: true },
  { path: "/es/pricing", locale: "es", indexable: true },
  { path: "/es/allied-health", locale: "es", indexable: true },
  { path: "/canada/pn/rex-pn/lessons", locale: "en", indexable: true },
  { path: "/fr/canada/rex-pn/lessons", locale: "fr", indexableWhenComplete: true, allow404: true },
  { path: "/es/canada/rex-pn/lessons", locale: "es", indexable: true, allow404: true },
  { path: "/canada/pn/rex-pn/lessons/clinical-judgment-prioritization-gold", locale: "en", indexable: true, allow404: true },
  { path: "/fr/canada/rex-pn/lessons/clinical-judgment-prioritization-gold", locale: "fr", indexableWhenComplete: true, allow404: true },
  { path: "/es/canada/rex-pn/lessons/clinical-judgment-prioritization-gold", locale: "es", indexable: true, allow404: true },
  { path: "/canada/pn/rex-pn/questions", locale: "en", indexable: true },
  { path: "/fr/question-bank", locale: "fr", indexableWhenComplete: true },
  { path: "/es/question-bank", locale: "es", indexable: true },
  { path: "/app/flashcards", locale: "en", indexable: false, allowRedirect: true },
  { path: "/fr/practice-exams", locale: "fr", indexableWhenComplete: true },
  { path: "/es/practice-exams", locale: "es", indexable: true },
];

function hasNoindex(content: string | null): boolean {
  return /noindex/i.test(content ?? "");
}

test.describe("i18n route readiness", () => {
  for (const route of ROUTES) {
    test(`${route.path} has localized route safety`, async ({ page }) => {
      const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });
      if (route.allow404 && response?.status() === 404) test.skip(true, `${route.path} is not currently routed in this build`);
      if (route.allowRedirect && response && response.status() >= 300 && response.status() < 400) test.skip(true, `${route.path} redirects before learner auth`);
      expect(response?.ok(), `HTTP ${response?.status()} for ${route.path}`).toBeTruthy();
      await dismissMarketingScrims(page).catch(() => {});
      const title = await page.title();
      expect(title.trim().length, "title is not empty").toBeGreaterThan(0);
      await expect(page.locator("h1").first(), "page has H1").toBeVisible({ timeout: 30_000 });

      const body = await page.locator("body").innerText();
      expect(body, "no raw i18n keys").not.toMatch(RAW_KEYISH);
      expect(body, "no missing-key or placeholder text").not.toMatch(MISSING_OR_PLACEHOLDER);

      if (route.locale === "en") {
        expect(body, "English page does not contain French UI labels").not.toMatch(FRENCH_UI);
        expect(body, "English page does not contain Spanish UI labels").not.toMatch(SPANISH_UI);
      } else {
        const robots = await page.locator('meta[name="robots"]').first().getAttribute("content").catch(() => null);
        const xRobots = response?.headers()["x-robots-tag"] ?? null;
        if (route.locale === "fr" && ENGLISH_FALLBACK.test(body)) {
          expect(hasNoindex(robots) || hasNoindex(xRobots), "French pages with obvious English fallback must be noindex").toBeTruthy();
        }
        if (route.locale === "es") {
          expect(body, "Spanish page does not contain obvious English fallback labels").not.toMatch(ENGLISH_FALLBACK);
          expect(hasNoindex(robots) || hasNoindex(xRobots), "Spanish completed pages should be indexable").toBeFalsy();
        }
      }

      const canonicalCount = await page.locator('link[rel="canonical"]').count();
      expect(canonicalCount, "canonical present").toBeGreaterThan(0);
      const hreflangValues = await page.locator('link[rel="alternate"][hreflang]').evaluateAll((els) =>
        els.map((el) => el.getAttribute("hreflang")).filter(Boolean),
      );
      if (route.locale === "en" && route.indexable) {
        expect(hreflangValues.includes("x-default"), "English completed pages include x-default hreflang").toBeTruthy();
      }
      if (route.locale === "fr") {
        const robots = await page.locator('meta[name="robots"]').first().getAttribute("content").catch(() => null);
        const xRobots = response?.headers()["x-robots-tag"] ?? null;
        if (hasNoindex(robots) || hasNoindex(xRobots)) {
          expect(hreflangValues.includes("fr-CA"), "incomplete French noindex pages are not completed hreflang alternates").toBeFalsy();
        }
      }
      if (route.locale === "es" && route.indexable) {
        expect(hreflangValues.includes("es"), "Spanish completed pages include Spanish hreflang").toBeTruthy();
      }
    });
  }
});
