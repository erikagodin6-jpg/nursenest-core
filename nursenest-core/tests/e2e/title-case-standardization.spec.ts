import { expect, test, type Page } from "@playwright/test";
import { resolveE2eAppBaseUrl } from "./helpers/e2e-env";

const COMMON_TITLE_CASE_VIOLATIONS = [
  "Clinical lab workstation",
  "Study progress dashboard",
  "Medication calculation practice",
  "Weak areas review",
  "Clinical skills simulation lab",
  "Electrocardiogram interpretation",
  "Laboratory interpretation",
  "Computer adaptive testing",
  "Pathway lessons",
  "Practice questions",
  "Practice tests",
  "Lab drills",
  "Labs overview",
];

const ROUTES = [
  { label: "Homepage", path: "/" },
  { label: "RN Hub", path: "/ca/rn/nclex-rn" },
  { label: "Pricing", path: "/pricing" },
  { label: "Labs Hub", path: "/app/labs?pathwayId=ca-rn-nclex-rn", app: true },
  { label: "ECG Hub", path: "/app/ecg", app: true },
  { label: "Flashcards Hub", path: "/app/flashcards?pathwayId=ca-rn-nclex-rn", app: true },
  { label: "Lessons Hub", path: "/app/lessons?pathwayId=ca-rn-nclex-rn", app: true },
  { label: "Practice Hub", path: "/app/questions?pathwayId=ca-rn-nclex-rn", app: true },
];

async function visibleText(page: Page) {
  const main = page.locator("main, #nn-learner-main, [data-nn-learner-main]").first();
  if (await main.isVisible().catch(() => false)) return main.innerText();
  return page.locator("body").innerText();
}

test.describe("Global Title Case Standardization", () => {
  for (const route of ROUTES) {
    test(`${route.label} has no common sentence-case title regressions`, async ({ page, baseURL }) => {
      const url = new URL(route.path, resolveE2eAppBaseUrl(baseURL)).toString();
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
      if (route.app && /\/login|\/signin|\/sign-in/i.test(page.url())) {
        test.skip(true, `${route.label} requires authenticated storage state in this config.`);
      }

      await expect(page.locator("body")).toBeVisible({ timeout: 30_000 });
      const text = await visibleText(page);
      const title = await page.title();
      const haystack = `${title}\n${text}`;
      const found = COMMON_TITLE_CASE_VIOLATIONS.filter((phrase) => haystack.includes(phrase));
      expect(found, `${route.label} contains sentence-case title labels`).toEqual([]);
    });
  }
});
