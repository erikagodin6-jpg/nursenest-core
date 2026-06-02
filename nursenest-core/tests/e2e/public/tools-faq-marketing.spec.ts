import { expect, test } from "@playwright/test";

test.describe("Marketing tools + FAQ redesign smoke", () => {
  test("tools hub, med-math tool, FAQ accordions — console clean, links resolve, mobile overflow", async ({
    page,
    request,
  }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => pageErrors.push(err?.message ?? String(err)));

    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto("/tools", { waitUntil: "load", timeout: 120_000 });
    await expect(page.getByTestId("marketing-tools-hub")).toBeVisible({ timeout: 30_000 });
    const medMathHref = await page.locator('a[href*="med-math"]').first().getAttribute("href");
    expect(medMathHref, "tools hub should link to med-math").toBeTruthy();
    expect(medMathHref).not.toBe("#");
    const toolsRes = await request.get(medMathHref!);
    expect(toolsRes.status(), medMathHref!).not.toBe(404);

    let overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflow, "/tools mobile horizontal overflow").toBe(false);

    await page.goto("/tools/med-math", { waitUntil: "load", timeout: 120_000 });
    await expect(page.getByTestId("marketing-tool-med-math")).toBeVisible({ timeout: 30_000 });
    overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflow, "/tools/med-math mobile horizontal overflow").toBe(false);

    await page.goto("/faq", { waitUntil: "load", timeout: 120_000 });
    await expect(page.getByTestId("marketing-faq-legal")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId("premium-faq-shell")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId("premium-faq-sticky-cta")).toBeVisible();
    await expect(page.getByTestId("marketing-faq-product")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId("premium-faq-accordion-trigger").first()).toHaveAttribute("aria-expanded", "true");
    const firstAccordion = page.getByTestId("marketing-faq-product-accordion-first");
    await expect(firstAccordion.getByRole("button")).toBeVisible();
    overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflow, "/faq mobile horizontal overflow").toBe(false);

    expect(pageErrors, pageErrors.join(" | ")).toEqual([]);
    const fatalConsole = consoleErrors.filter((text) =>
      /hydration|Minified React error|Cannot read properties/i.test(text),
    );
    expect(fatalConsole, fatalConsole.join(" | ")).toEqual([]);
  });
});
