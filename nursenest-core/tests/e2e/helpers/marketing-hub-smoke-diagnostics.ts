import type { Page } from "@playwright/test";

/** Server-rendered JSON in `#nn-marketing-hub-smoke-diagnostics` (marketing pathway lessons hub). */
export async function readMarketingHubSmokeDiagnostics(page: Page): Promise<unknown> {
  const raw = await page.locator("#nn-marketing-hub-smoke-diagnostics").textContent().catch(() => null);
  if (!raw?.trim()) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return { parseError: true as const, rawSlice: raw.slice(0, 600) };
  }
}
