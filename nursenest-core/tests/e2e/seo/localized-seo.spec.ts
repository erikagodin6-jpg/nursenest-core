import { expect, test } from "@playwright/test";

const routes = [
  { locale: "en", path: "/", crumb: "Home" },
  { locale: "fr", path: "/fr", crumb: "Accueil" },
  { locale: "es", path: "/es", crumb: "Inicio" },
  { locale: "en", path: "/pricing", crumb: "Pricing" },
  { locale: "fr", path: "/fr/pricing", crumb: "Tarifs" },
  { locale: "es", path: "/es/pricing", crumb: "Precios" },
  { locale: "en", path: "/question-bank", crumb: "Practice Questions" },
  { locale: "fr", path: "/fr/question-bank", crumb: "Questions pratiques" },
  { locale: "es", path: "/es/question-bank", crumb: "Preguntas de práctica" },
] as const;

test.describe("localized SEO metadata", () => {
  for (const route of routes) {
    test(`${route.locale} ${route.path} has localized SEO shell`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });
      const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });
      expect(response?.status(), `${route.path} status`).toBeLessThan(400);

      await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });
      await expect.poll(() => page.title()).not.toEqual("");
      await expect(page.locator('meta[name="description"]')).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      await expect(page.locator('link[rel="alternate"][hreflang]')).not.toHaveCount(0);

      const html = await page.content();
      expect(html).not.toMatch(/\[missing|missing key|pages\.[a-z0-9_.-]+/i);
      if (route.locale !== "en") {
        expect(html).toContain(route.crumb);
      }
      expect(consoleErrors.filter((x) => !/favicon|ResizeObserver|webpack-hmr/i.test(x))).toEqual([]);
    });
  }
});
