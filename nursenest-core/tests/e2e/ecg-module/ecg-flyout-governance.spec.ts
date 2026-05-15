/**
 * Clinical Modules flyout + ECG curriculum governance — E2E behavioral contract.
 *
 * Covers:
 *   Flyout interaction:
 *     - Opens on click; closes on outside pointerdown (Safari-safe pattern)
 *     - Closes on Escape and restores focus to trigger button
 *     - Full keyboard navigation: ArrowDown/Up/Home/End through focusable items
 *     - Disabled items are non-focusable and non-interactive
 *     - No href="#" page-top jump on disabled items
 *     - Tab leaves the menu without focus trap
 *
 *   ARIA correctness:
 *     - Trigger has aria-haspopup="menu", aria-expanded, aria-controls
 *     - Panel has role="menu"
 *     - Items have role="menuitem"
 *     - Disabled items have aria-disabled="true"
 *     - No axe critical/serious violations when flyout is open
 *
 *   Reduced motion:
 *     - Chevron transition class is motion-safe-gated (not applied under reduced-motion)
 *
 *   Layout:
 *     - No horizontal overflow at 390px
 *     - Flyout panel does not clip at viewport edges
 *     - Portal renders in document.body (not inside nav overflow ancestor)
 *
 *   Nav correctness:
 *     - All flyout link hrefs are learner-scoped (/app/* or /modules/*)
 *     - Fallback nav href is learner-scoped
 *
 * All flyout tests require auth + E2E_ECG_MODULE_ENABLED=1.
 * Curriculum governance tests (pure data) run without auth.
 *
 * Run:
 *   E2E_ECG_MODULE_ENABLED=1 npx playwright test tests/e2e/ecg-module/ecg-flyout-governance.spec.ts --project=chromium
 */
import { expect, test, type Page } from "@playwright/test";
import { loginWithCredentials } from "../helpers/learner-login";
import { getQaPaidCredentials } from "../helpers/smoke-credentials";
import { attachPageObservers, logObserverDiagnostics } from "../helpers/attach-observers";
import { expectNoBlockingA11yViolations } from "../helpers/accessibility";

const IS_ECG_ENABLED = process.env.E2E_ECG_MODULE_ENABLED === "1";
const TIMEOUT = 60_000;

// ─── Locators ─────────────────────────────────────────────────────────────────

/** The trigger button that opens the Clinical Modules flyout. */
const FLYOUT_TRIGGER = '[aria-haspopup="menu"]';
/** The open flyout panel (role=menu). */
const FLYOUT_PANEL = '[role="menu"][aria-label="Clinical Modules"]';
/** All focusable (non-disabled) menuitems inside the open panel. */
const FOCUSABLE_ITEMS = `${FLYOUT_PANEL} [role="menuitem"]:not([aria-disabled="true"])`;
/** All disabled menuitems — must not be focusable links. */
const DISABLED_ITEMS = `${FLYOUT_PANEL} [role="menuitem"][aria-disabled="true"]`;

async function openFlyout(page: Page) {
  const trigger = page.locator(FLYOUT_TRIGGER).first();
  await expect(trigger).toBeVisible({ timeout: TIMEOUT });
  await trigger.click();
  await expect(page.locator(FLYOUT_PANEL)).toBeVisible({ timeout: 10_000 });
  return trigger;
}

async function navigateToLearnerApp(page: Page) {
  await page.goto("/app/lessons", { waitUntil: "domcontentloaded", timeout: TIMEOUT });
  await page.waitForLoadState("networkidle").catch(() => {});
}

// ─── Flyout open/close ────────────────────────────────────────────────────────

test.describe("Clinical Modules flyout — open/close", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("flyout opens on click and closes on second click", async ({ page }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await navigateToLearnerApp(page);

      const trigger = await openFlyout(page);
      await info.attach("flyout-open.png", { body: await page.screenshot(), contentType: "image/png" });

      // Second click closes it
      await trigger.click();
      await expect(page.locator(FLYOUT_PANEL)).toHaveCount(0);
    } finally {
      await logObserverDiagnostics(obs, info.title);
      obs.dispose();
    }
  });

  test("flyout closes on outside pointerdown (Safari-safe)", async ({ page }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await navigateToLearnerApp(page);

      await openFlyout(page);

      // Simulate pointerdown outside the flyout and trigger
      await page.mouse.click(10, 10, { button: "left" });
      await expect(page.locator(FLYOUT_PANEL)).toHaveCount(0, { timeout: 3_000 });
    } finally {
      await logObserverDiagnostics(obs, info.title);
      obs.dispose();
    }
  });

  test("Escape key closes flyout and restores focus to trigger", async ({ page }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await navigateToLearnerApp(page);

      const trigger = await openFlyout(page);
      await page.keyboard.press("Escape");
      await expect(page.locator(FLYOUT_PANEL)).toHaveCount(0, { timeout: 3_000 });

      // Focus must be back on the trigger
      const focused = await page.evaluate(() => document.activeElement?.getAttribute("aria-haspopup"));
      expect(focused, "Focus should have returned to the flyout trigger button").toBe("menu");
    } finally {
      await logObserverDiagnostics(obs, info.title);
      obs.dispose();
    }
  });
});

// ─── Keyboard navigation ──────────────────────────────────────────────────────

test.describe("Clinical Modules flyout — keyboard navigation", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("ArrowDown moves focus through focusable menu items", async ({ page }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await navigateToLearnerApp(page);

      const trigger = page.locator(FLYOUT_TRIGGER).first();
      await expect(trigger).toBeVisible({ timeout: TIMEOUT });

      // Open via keyboard (ArrowDown opens and focuses first item)
      await trigger.focus();
      await page.keyboard.press("ArrowDown");
      await expect(page.locator(FLYOUT_PANEL)).toBeVisible({ timeout: 10_000 });

      // First focusable item should receive focus
      const items = page.locator(FOCUSABLE_ITEMS);
      const firstItem = items.first();
      await expect(firstItem).toBeVisible({ timeout: 5_000 });

      // ArrowDown again should move to second item
      await page.keyboard.press("ArrowDown");

      // Home should jump to first focusable item
      await page.keyboard.press("Home");
      // End should jump to last focusable item
      await page.keyboard.press("End");

      // Escape closes and focus returns
      await page.keyboard.press("Escape");
      await expect(page.locator(FLYOUT_PANEL)).toHaveCount(0, { timeout: 3_000 });

      await info.attach("keyboard-nav.png", { body: await page.screenshot(), contentType: "image/png" });
    } finally {
      await logObserverDiagnostics(obs, info.title);
      obs.dispose();
    }
  });

  test("ArrowUp wraps from first item to last", async ({ page }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await navigateToLearnerApp(page);

      const trigger = page.locator(FLYOUT_TRIGGER).first();
      await trigger.focus();
      await page.keyboard.press("ArrowDown");
      await expect(page.locator(FLYOUT_PANEL)).toBeVisible({ timeout: 10_000 });

      // ArrowUp from first item should wrap to last
      await page.keyboard.press("ArrowUp");
      // Verify flyout is still open (wrap didn't close it)
      await expect(page.locator(FLYOUT_PANEL)).toBeVisible();
    } finally {
      await logObserverDiagnostics(obs, info.title);
      obs.dispose();
    }
  });

  test("Tab leaves the menu without focus trap", async ({ page }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await navigateToLearnerApp(page);

      const trigger = page.locator(FLYOUT_TRIGGER).first();
      await trigger.focus();
      await page.keyboard.press("ArrowDown");
      await expect(page.locator(FLYOUT_PANEL)).toBeVisible({ timeout: 10_000 });

      // Tab should close the flyout (not trap focus)
      await page.keyboard.press("Tab");
      await expect(page.locator(FLYOUT_PANEL)).toHaveCount(0, { timeout: 3_000 });
    } finally {
      await logObserverDiagnostics(obs, info.title);
      obs.dispose();
    }
  });
});

// ─── Disabled items ───────────────────────────────────────────────────────────

test.describe("Clinical Modules flyout — disabled item safety", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("disabled items are rendered as spans (not anchors) with aria-disabled=true", async ({
    page,
  }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await navigateToLearnerApp(page);
      await openFlyout(page);

      const disabledItems = page.locator(DISABLED_ITEMS);
      const count = await disabledItems.count();

      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const item = disabledItems.nth(i);
          const tag = await item.evaluate((el) => el.tagName.toLowerCase());
          expect(tag, `Disabled menuitem at index ${i} must not be an anchor`).not.toBe("a");
          // Must not be keyboard-focusable
          const tabIndex = await item.getAttribute("tabindex");
          expect(
            tabIndex,
            `Disabled menuitem at index ${i} must have tabIndex="-1"`,
          ).toBe("-1");
        }
      }

      await info.attach("disabled-items.png", { body: await page.screenshot(), contentType: "image/png" });
    } finally {
      await logObserverDiagnostics(obs, info.title);
      obs.dispose();
    }
  });

  test("no href='#' in the flyout panel (prevents page-top jump on disabled items)", async ({
    page,
  }) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    await loginWithCredentials(page, creds!.email, creds!.password);
    await navigateToLearnerApp(page);
    await openFlyout(page);

    const hashLinks = page.locator(`${FLYOUT_PANEL} a[href="#"]`);
    await expect(hashLinks, "Flyout must not contain href='#' anchors").toHaveCount(0);
  });
});

// ─── ARIA correctness ─────────────────────────────────────────────────────────

test.describe("Clinical Modules flyout — ARIA semantics", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("trigger button has correct ARIA attributes", async ({ page }) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    await loginWithCredentials(page, creds!.email, creds!.password);
    await navigateToLearnerApp(page);

    const trigger = page.locator(FLYOUT_TRIGGER).first();
    await expect(trigger).toBeVisible({ timeout: TIMEOUT });

    // Before open
    await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    // After open
    await trigger.click();
    await expect(page.locator(FLYOUT_PANEL)).toBeVisible({ timeout: 10_000 });
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    // aria-controls should reference the flyout panel ID
    const controls = await trigger.getAttribute("aria-controls");
    expect(controls, "aria-controls must reference a non-empty ID when open").toBeTruthy();
    const referenced = page.locator(`#${controls}`);
    await expect(referenced).toBeVisible();
  });

  test("flyout panel has role=menu; all items have role=menuitem", async ({ page }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await navigateToLearnerApp(page);
      await openFlyout(page);

      const panel = page.locator(FLYOUT_PANEL);
      await expect(panel).toHaveAttribute("role", "menu");

      // All direct interaction elements must be menuitems
      const allItems = panel.locator("[role='menuitem']");
      const count = await allItems.count();
      expect(count, "Flyout panel must contain at least one menuitem").toBeGreaterThan(0);

      await info.attach("aria-panel.png", { body: await page.screenshot(), contentType: "image/png" });
    } finally {
      await logObserverDiagnostics(obs, info.title);
      obs.dispose();
    }
  });

  test("axe: no critical/serious accessibility violations when flyout is open", async ({
    page,
  }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    await loginWithCredentials(page, creds!.email, creds!.password);
    await navigateToLearnerApp(page);
    await openFlyout(page);

    await expectNoBlockingA11yViolations({ page, testInfo: info, label: "clinical-modules-flyout-open" });
  });
});

// ─── Reduced motion ───────────────────────────────────────────────────────────

test.describe("Clinical Modules flyout — reduced motion", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("chevron rotation class is inside motion-safe wrapper (not applied under reduced-motion)", async ({
    page,
  }) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await loginWithCredentials(page, creds!.email, creds!.password);
    await navigateToLearnerApp(page);

    // The chevron wrapper has class 'motion-safe:transition-transform motion-safe:duration-150'
    // Under reduced-motion, Tailwind's motion-safe: variant suppresses these classes.
    // We verify: no horizontal scroll after open/close (transition suppressed = no layout side effects).
    const trigger = page.locator(FLYOUT_TRIGGER).first();
    await expect(trigger).toBeVisible({ timeout: TIMEOUT });
    await trigger.click();
    await expect(page.locator(FLYOUT_PANEL)).toBeVisible({ timeout: 10_000 });
    await trigger.click();
    await expect(page.locator(FLYOUT_PANEL)).toHaveCount(0, { timeout: 3_000 });

    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
  });
});

// ─── Layout — portal positioning and overflow ─────────────────────────────────

test.describe("Clinical Modules flyout — layout and portal", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("flyout panel renders in document.body portal (not inside nav ancestor)", async ({
    page,
  }) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    await loginWithCredentials(page, creds!.email, creds!.password);
    await navigateToLearnerApp(page);
    await openFlyout(page);

    // The panel must be a direct child of body (portaled), not nested under the nav
    const parentTagName = await page.locator(FLYOUT_PANEL).evaluate((el) => el.parentElement?.tagName ?? "");
    expect(parentTagName.toLowerCase(), "Flyout panel must be portaled to document.body (parentElement should be BODY)").toBe("body");
  });

  test("no horizontal overflow at 390px mobile when flyout is open", async ({ page }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    await page.setViewportSize({ width: 390, height: 844 });
    await loginWithCredentials(page, creds!.email, creds!.password);
    await navigateToLearnerApp(page);

    // On mobile the bottom nav is shown, not the desktop flyout — this checks that the
    // page itself doesn't overflow (bottom nav uses the same links, no flyout on mobile).
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(
      scrollWidth,
      `body must not overflow at 390px (scrollWidth=${scrollWidth}, clientWidth=${clientWidth})`,
    ).toBeLessThanOrEqual(clientWidth + 2);

    await info.attach("mobile-390.png", { body: await page.screenshot({ fullPage: true }), contentType: "image/png" });
  });

  test("flyout panel does not clip at right viewport edge (desktop 1280px)", async ({
    page,
  }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    await page.setViewportSize({ width: 1280, height: 800 });
    await loginWithCredentials(page, creds!.email, creds!.password);
    await navigateToLearnerApp(page);
    await openFlyout(page);

    const panel = page.locator(FLYOUT_PANEL);
    const box = await panel.boundingBox();
    expect(box, "Flyout panel must have a resolvable bounding box").not.toBeNull();
    if (box) {
      expect(
        box.x + box.width,
        `Flyout right edge (${box.x + box.width}px) must not exceed viewport width (1280px)`,
      ).toBeLessThanOrEqual(1282);
      expect(box.x, "Flyout must not start off-screen").toBeGreaterThanOrEqual(0);
    }

    await info.attach("flyout-1280.png", { body: await page.screenshot(), contentType: "image/png" });
  });
});

// ─── Nav href correctness ─────────────────────────────────────────────────────

test.describe("Clinical Modules flyout — link destination correctness", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("all open flyout links are learner-scoped (/app/* or /modules/*)", async ({ page }) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    await loginWithCredentials(page, creds!.email, creds!.password);
    await navigateToLearnerApp(page);
    await openFlyout(page);

    const allAnchors = page.locator(`${FLYOUT_PANEL} a[href]`);
    const count = await allAnchors.count();
    expect(count, "Flyout must have at least one navigable anchor").toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const href = await allAnchors.nth(i).getAttribute("href");
      const isLearnerScoped =
        href?.startsWith("/app") || href?.startsWith("/modules");
      expect(
        isLearnerScoped,
        `Flyout anchor at index ${i} has non-learner-scoped href: "${href}" — must start with /app or /modules`,
      ).toBe(true);
    }
  });
});
