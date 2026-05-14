import { expect, test } from "@playwright/test";

const pages = [
  {
    path: "/us/rn/nclex-rn/test-bank",
    h1: "NCLEX-RN test bank for clinical judgment practice",
    required: ["/us/rn/nclex-rn/questions", "/us/rn/nclex-rn/cat", "/us/rn/nclex-rn/flashcards", "/us/rn/nclex-rn/lessons", "/us/rn/nclex-rn/pricing"],
  },
  {
    path: "/canada/rpn/rex-pn/test-bank",
    h1: "REx-PN test bank for Canadian practical nurses",
    required: ["/canada/rpn/rex-pn/questions", "/canada/rpn/rex-pn/cat", "/canada/rpn/rex-pn/flashcards", "/canada/rpn/rex-pn/lessons", "/canada/rpn/rex-pn/pricing"],
  },
  {
    path: "/canada/np/cnple/test-bank",
    h1: "CNPLE test bank for Canadian nurse practitioner prep",
    required: ["/canada/np/cnple/questions", "/canada/np/cnple/simulation", "/canada/np/cnple/flashcards", "/canada/np/cnple/lessons", "/canada/np/cnple/pricing"],
  },
  {
    path: "/us/np/fnp/test-bank",
    h1: "FNP test bank for primary care clinical reasoning",
    required: ["/us/np/fnp/questions", "/us/np/fnp/cat", "/us/np/fnp/flashcards", "/us/np/fnp/lessons", "/us/np/fnp/pricing"],
  },
  {
    path: "/us/np/agpcnp/test-bank",
    h1: "AGPCNP test bank for adult-gerontology practice",
    required: ["/us/np/agpcnp/questions", "/us/np/agpcnp/cat", "/us/np/agpcnp/flashcards", "/us/np/agpcnp/lessons", "/us/np/agpcnp/pricing"],
  },
] as const;

test.describe("healthcare test-bank SEO pages", () => {
  for (const pageDef of pages) {
    test(`${pageDef.path} loads with metadata, schema, and study links`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });

      const response = await page.goto(pageDef.path, { waitUntil: "domcontentloaded" });
      expect(response?.status(), `${pageDef.path} should return 200`).toBe(200);

      await expect(page.getByRole("heading", { level: 1, name: pageDef.h1 })).toBeVisible();
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${pageDef.path.replace(/\//g, "\\/")}$`));
      const robots = await page.locator('meta[name="robots"]').first().getAttribute("content").catch(() => null);
      expect(robots ?? "").not.toMatch(/noindex/i);

      for (const href of pageDef.required) {
        await expect(page.locator(`a[href="${href}"]`).first(), `${pageDef.path} missing ${href}`).toBeVisible();
      }

      const jsonLdTypes = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) =>
        nodes.flatMap((node) => {
          try {
            const parsed = JSON.parse(node.textContent || "{}");
            return Array.isArray(parsed["@type"]) ? parsed["@type"] : [parsed["@type"]];
          } catch {
            return [];
          }
        }),
      );
      expect(jsonLdTypes).toContain("FAQPage");
      expect(jsonLdTypes).toContain("BreadcrumbList");
      expect(jsonLdTypes).toContain("EducationalCourse");
      expect(consoleErrors).toEqual([]);
    });
  }
});
