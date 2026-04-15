/* One-off browser QA — delete after use */
const { chromium } = require("playwright");

const base = "http://127.0.0.1:3000";

function countryButton(page) {
  return page.getByRole("button", { name: /Region:/i }).first();
}

async function readRegionLabel(page) {
  const t = await countryButton(page).innerText();
  return (t || "").replace(/\s+/g, " ").trim();
}

async function openMenuDesktop(page) {
  await countryButton(page).click();
  await page.waitForTimeout(400);
}

async function scenarioDesktopUS() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const before = `${base}/exams/philippines`;
  await page.goto(before, { waitUntil: "networkidle" });
  const labelBefore = await readRegionLabel(page);
  await openMenuDesktop(page);
  await page.getByRole("option", { name: /United States/i }).click();
  await page.waitForTimeout(2000);
  const after = page.url();
  const labelAfter = await readRegionLabel(page);
  await browser.close();
  return { before, after, labelBefore, labelAfter };
}

async function scenarioDesktopCA() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const before = `${base}/exams/philippines`;
  await page.goto(before, { waitUntil: "networkidle" });
  await openMenuDesktop(page);
  await page.getByRole("option", { name: /^Canada$/ }).click();
  await page.waitForTimeout(2000);
  const after = page.url();
  const labelAfter = await readRegionLabel(page);
  await browser.close();
  return { before, after, labelAfter };
}

async function scenarioMobileUS() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const before = `${base}/exams/philippines`;
  await page.goto(before, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Region and language settings/i }).click();
  await page.waitForTimeout(600);
  await page.getByRole("button", { name: /Region:/i }).first().click();
  await page.waitForTimeout(500);
  await page.getByRole("option", { name: /United States/i }).click();
  await page.waitForTimeout(2000);
  const after = page.url();
  const labelAfter = await readRegionLabel(page);
  await browser.close();
  return { before, after, labelAfter };
}

async function scenarioMobileCA() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const before = `${base}/exams/philippines`;
  await page.goto(before, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Region and language settings/i }).click();
  await page.waitForTimeout(600);
  await page.getByRole("button", { name: /Region:/i }).first().click();
  await page.waitForTimeout(500);
  await page.getByRole("option", { name: /^Canada$/ }).click();
  await page.waitForTimeout(2000);
  const after = page.url();
  const labelAfter = await readRegionLabel(page);
  await browser.close();
  return { before, after, labelAfter };
}

async function scenarioMarketingToggle() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const before = `${base}/pricing`;
  await page.goto(before, { waitUntil: "networkidle" });
  await openMenuDesktop(page);
  await page.getByRole("option", { name: /^Canada$/ }).click();
  await page.waitForTimeout(2000);
  const mid = page.url();
  const labelCa = await readRegionLabel(page);
  await openMenuDesktop(page);
  await page.getByRole("option", { name: /United States/i }).click();
  await page.waitForTimeout(2000);
  const after = page.url();
  const labelUs = await readRegionLabel(page);
  await browser.close();
  return { before, mid, after, labelCa, labelUs };
}

(async () => {
  const results = {
    desktop_ph_to_us: await scenarioDesktopUS(),
    desktop_ph_to_ca: await scenarioDesktopCA(),
    mobile_ph_to_us: await scenarioMobileUS(),
    mobile_ph_to_ca: await scenarioMobileCA(),
    marketing_toggle: await scenarioMarketingToggle(),
  };
  console.log(JSON.stringify(results, null, 2));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
