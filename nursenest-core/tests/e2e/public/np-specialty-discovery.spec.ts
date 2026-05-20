import { expect, test } from "@playwright/test";
import { expectMarketingPublicShell, gotoExpectOk, requireOrigin, seedUsMarketingCookie } from "../helpers/navigation-e2e";

test.describe("NP specialty discovery", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test("US generic NP hub keeps specialty-first discovery and footer links", async ({ request, baseURL }) => {
    test.slow();
    requireOrigin(baseURL);
    const response = await request.get("/np-exam-prep", {
      headers: { cookie: "nn_global_region=us" },
    });
    expect(response.ok()).toBeTruthy();
    const html = await response.text();

    expect(html).toMatch(/Choose your NP specialty track/i);
    expect(html).toMatch(/Choose the exact NP specialty first/i);
    expect(html).toMatch(/>FNP</);
    expect(html).toMatch(/>AGPCNP</);
    expect(html).toMatch(/>PMHNP</);
    expect(html).toMatch(/>WHNP</);
    expect(html).toMatch(/>PNP-PC</);
    expect(html).toMatch(/>CNPLE</);
    expect(html).toMatch(/href="(?:\/en)?\/us\/np\/whnp"/);
    expect(html).toMatch(/href="(?:\/en)?\/us\/np\/whnp\/questions"/);
    expect(html).toMatch(/href="(?:\/en)?\/us\/np\/whnp\/cat"/);
    expect(html).toMatch(/href="(?:\/en)?\/np-exam-prep"/);
    expect(html).toMatch(/href="(?:\/en)?\/us\/np\/fnp"/);
    expect(html).toMatch(/href="(?:\/en)?\/us\/np\/agpcnp"/);
    expect(html).toMatch(/href="(?:\/en)?\/us\/np\/pmhnp"/);
    expect(html).toMatch(/href="(?:\/en)?\/us\/np\/whnp"/);
    expect(html).toMatch(/href="(?:\/en)?\/us\/np\/pnp-pc"/);
    expect(html).toMatch(/href="(?:\/en)?\/canada\/np\/cnple"/);
  });

  test("CA generic NP hub preserves CNPLE-first discovery and CA header entry", async ({ request, baseURL }) => {
    test.slow();
    requireOrigin(baseURL);
    const response = await request.get("/canada-np-exam-prep", {
      headers: { cookie: "nn_global_region=canada" },
    });
    expect(response.ok()).toBeTruthy();
    const html = await response.text();

    expect(html).toMatch(/Choose your NP specialty track/i);
    expect(html).toMatch(/Start with the Canadian NP track/i);
    expect(html).toMatch(/href="(?:\/en)?\/canada-np-exam-prep"/);
    expect(html).toMatch(/href="(?:\/en)?\/canada\/np\/cnple"/);
    expect(html.indexOf(">CNPLE<")).toBeGreaterThan(-1);
    const cnpleIndex = html.indexOf(">CNPLE<");
    const fnpIndex = html.indexOf(">FNP<");
    expect(cnpleIndex).toBeLessThan(fnpIndex);
  });

  test("mobile header drawer keeps NP entry on specialty discovery hubs", async ({ page, baseURL }) => {
    test.slow();
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoExpectOk(page, "/signup");
    await expectMarketingPublicShell(page);

    await page.getByRole("button", { name: /open menu/i }).click();
    await expect(page.getByRole("link", { name: /^NP$/ }).first()).toHaveAttribute("href", /\/np-exam-prep$/);

    await page.getByRole("link", { name: /^NP$/ }).first().click();
    await expect(page).toHaveURL(/\/np-exam-prep(?:\?|$)/);
    await expect(page.getByRole("heading", { name: /Choose your NP specialty track/i })).toBeVisible({ timeout: 60_000 });
  });

  test("legacy EN NP hub and CAT routes emit pathway-specific titles", async ({ request, baseURL }) => {
    test.slow();
    requireOrigin(baseURL);

    const hubResponse = await request.get("/en/np/fnp");
    expect(hubResponse.ok()).toBeTruthy();
    const hubHtml = await hubResponse.text();
    const hubTitle = hubHtml.match(/<title>(.*?)<\/title>/i)?.[1] ?? "";
    expect(hubTitle).toMatch(/FNP Exam Prep/i);
    expect(hubTitle).not.toMatch(/Canada-First/i);

    const catResponse = await request.get("/en/np/fnp/cat");
    expect(catResponse.ok()).toBeTruthy();
    const catHtml = await catResponse.text();
    const catTitle = catHtml.match(/<title>(.*?)<\/title>/i)?.[1] ?? "";
    expect(catTitle).toMatch(/FNP/i);
    expect(catTitle).not.toMatch(/^\s*$/);
  });
});
