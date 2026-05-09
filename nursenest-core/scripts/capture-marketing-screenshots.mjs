#!/usr/bin/env node
/**
 * Marketing homepage CDN screenshot capture — Playwright (Chromium).
 *
 * Produces `screenshot1.png` … `screenshot15.png` under `public/marketing/screenshots/`
 * plus `capture-manifest.json`. CDN keys match DigitalOcean Spaces bucket root — **manual approval only** before upload.
 *
 * Target definitions: `capture-slot-targets.json` (single source of truth for routes, slots, notes).
 *
 * Prerequisites:
 *   1. `npx playwright install chromium`
 *   2. `DATABASE_URL=… npx tsx scripts/seed-screenshot-demo-user.ts` (from repo root — entitled demo user)
 *   3. Running app (`npm run dev` in nursenest-core; default PORT 8080 or override SCREENSHOT_BASE_URL)
 *
 * Usage:
 *   node scripts/capture-marketing-screenshots.mjs
 *   SCREENSHOT_BASE_URL=http://localhost:8080 node scripts/capture-marketing-screenshots.mjs
 *   SCREENSHOT_ONLY_SLOTS=1,2,10 node scripts/capture-marketing-screenshots.mjs
 *   node scripts/capture-marketing-screenshots.mjs --list-targets
 *   node scripts/capture-marketing-screenshots.mjs --targets=slot-14-marketing-home-desktop,slot-06-cat-launch-or-session
 *
 * Env:
 *   SCREENSHOT_BASE_URL          (default: http://localhost:8080)
 *   SCREENSHOT_OUTPUT_DIR        (default: public/marketing/screenshots)
 *   SCREENSHOT_DEMO_EMAIL / SCREENSHOT_DEMO_PASSWORD
 *   SCREENSHOT_WAIT_MS           (default: 1800)
 *   SCREENSHOT_ONLY_SLOTS        Comma-separated 1–15
 *   SCREENSHOT_TARGET_IDS        Comma-separated target ids (same as JSON `id`; filters slots)
 *   SCREENSHOT_GLOBAL_THEME      Overrides per-target theme when set
 *   SCREENSHOT_INCLUDE_SUPPLEMENTARY  Set "0" to skip supplementary PNGs
 *   SCREENSHOT_DEMO_PATHWAY_ID   Default `ca-rn-nclex-rn` for CAT launch deep link
 *   SCREENSHOT_CAT_SESSION_PATH  Optional override for slot 6 — e.g. /app/practice-tests/{sessionId}
 *   SCREENSHOT_CAT_RESULTS_PATH  Optional override for slot 7 — e.g. /app/practice-tests/{id}/results
 *   SCREENSHOT_LESSON_DETAIL_PATH Optional — /app/lessons/{id}; when unset, first hub lesson link is used for slot 12
 *   SCREENSHOT_FLASHCARD_STUDY_PATH Optional — /app/flashcards/{deckSlug}; when unset, slot 2 uses /app/flashcards hub
 */
import { chromium } from "@playwright/test";
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "..");

const BASE_URL = process.env.SCREENSHOT_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:8080";
const OUTPUT_DIR =
  process.env.SCREENSHOT_OUTPUT_DIR ?? join(APP_ROOT, "public/marketing/screenshots");
const DEMO_EMAIL =
  process.env.SCREENSHOT_DEMO_EMAIL ?? "demo-screenshots@internal.nursenest.io";
const DEMO_PASSWORD = process.env.SCREENSHOT_DEMO_PASSWORD ?? "DemoScreenshot2024!";
const EXTRA_WAIT_MS = Number(process.env.SCREENSHOT_WAIT_MS ?? "1800");
const GLOBAL_THEME = process.env.SCREENSHOT_GLOBAL_THEME?.trim() || null;
const PATHWAY_ID = process.env.SCREENSHOT_DEMO_PATHWAY_ID?.trim() || "ca-rn-nclex-rn";

const ONLY_SLOTS = process.env.SCREENSHOT_ONLY_SLOTS
  ? new Set(
      process.env.SCREENSHOT_ONLY_SLOTS.split(",").map((s) => {
        const n = Number(s.trim());
        if (!Number.isInteger(n) || n < 1 || n > 15) {
          throw new Error(`Invalid SCREENSHOT_ONLY_SLOTS entry: ${s}`);
        }
        return n;
      }),
    )
  : null;

const TARGET_IDS_FROM_ENV = process.env.SCREENSHOT_TARGET_IDS?.trim()
  ? new Set(
      process.env.SCREENSHOT_TARGET_IDS.split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    )
  : null;

function parseCliArgs(argv) {
  const out = { help: false, listTargets: false, targetIds: null };
  for (const a of argv) {
    if (a === "--help" || a === "-h") out.help = true;
    else if (a === "--list-targets" || a === "--list") out.listTargets = true;
    else if (a.startsWith("--targets="))
      out.targetIds = a
        .slice("--targets=".length)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
  }
  return out;
}

const CLI = parseCliArgs(process.argv.slice(2));

const THEME_STORAGE_KEY = "nursenest-theme";

const TARGETS_FILE = join(__dirname, "capture-slot-targets.json");
const targetsDoc = JSON.parse(readFileSync(TARGETS_FILE, "utf8"));
const CDN_BASE_DOC = targetsDoc.cdnBaseDocumentation;

const VIEWPORTS = targetsDoc.viewportPresets;

function resolveSlotRoute(target) {
  if (target.route) return target.route;
  const tpl = target.routeTemplate;
  if (tpl === "CAT_SLOT_6_ROUTE") {
    const override = process.env.SCREENSHOT_CAT_SESSION_PATH?.trim();
    if (override) return override;
    return `/app/practice-tests/cat-launch?pathwayId=${encodeURIComponent(PATHWAY_ID)}`;
  }
  if (tpl === "CAT_SLOT_7_ROUTE") {
    const override = process.env.SCREENSHOT_CAT_RESULTS_PATH?.trim();
    if (override) return override;
    return "/app/practice-tests/cat-insights";
  }
  if (tpl === "LESSON_DETAIL_PATH") {
    const explicit = process.env.SCREENSHOT_LESSON_DETAIL_PATH?.trim();
    if (explicit && explicit !== "/app/lessons") return explicit;
    return "__FIRST_LESSON_FROM_HUB__";
  }
  if (tpl === "FLASHCARD_STUDY_PATH") {
    const explicit = process.env.SCREENSHOT_FLASHCARD_STUDY_PATH?.trim();
    if (explicit) return explicit;
    return "/app/flashcards";
  }
  throw new Error(`Unresolved route for target ${target.id}`);
}

function printHelp() {
  console.log(`
NurseNest marketing screenshot capture (Playwright Chromium)

Writes screenshot1.png … screenshot15.png and capture-manifest.json under SCREENSHOT_OUTPUT_DIR.
DigitalOcean Spaces upload is manual-approval only — see docs/SCREENSHOT_CAPTURE_TO_CDN.md.

Commands:
  node scripts/capture-marketing-screenshots.mjs
  node scripts/capture-marketing-screenshots.mjs --list-targets
  node scripts/capture-marketing-screenshots.mjs --targets=<id>,<id>

Env (subset): SCREENSHOT_BASE_URL, SCREENSHOT_ONLY_SLOTS, SCREENSHOT_TARGET_IDS,
  SCREENSHOT_FLASHCARD_STUDY_PATH, SCREENSHOT_LESSON_DETAIL_PATH, SCREENSHOT_CAT_SESSION_PATH

Prerequisites: Chromium via npx playwright install chromium; dev server; AUTH_SECRET for login;
  seed demo user (scripts/seed-screenshot-demo-user.ts) when capturing authenticated routes.
`);
}

function printTargetList(targetsDoc) {
  console.log("Named capture targets (id → CDN slot → route template)\n");
  for (const t of targetsDoc.slots) {
    const routeHint = t.route ?? t.routeTemplate ?? "?";
    console.log(
      `  ${t.id}\n    slot: ${t.screenshotSlot} → screenshot${t.screenshotSlot}.png\n    route: ${routeHint}\n    viewport: ${t.viewport ?? "desktop"} | auth: ${t.auth} | theme: ${t.theme ?? "—"}`,
    );
    console.log();
  }
  console.log("Supplementary (not CDN slots 1–15):");
  for (const s of targetsDoc.supplementary ?? []) {
    console.log(`  ${s.id} → ${s.filename} (${s.route})`);
  }
}

function ensureDir(filePath) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

async function applyThemeToPage(page, themeId) {
  if (!themeId) return;
  await page.evaluate(
    ({ key, id }) => {
      try {
        localStorage.setItem(key, id);
      } catch {
        /* ignore */
      }
    },
    { key: THEME_STORAGE_KEY, id: themeId },
  );
}

async function loginAsDemoUser(page) {
  console.log(`  ↳ Logging in as ${DEMO_EMAIL}…`);
  await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded", timeout: 45_000 });

  const emailInput = page.locator('input[type="email"], input[name="email"]').first();
  const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
  const submitBtn = page
    .locator('button[type="submit"]:not([disabled]), input[type="submit"]')
    .first();

  await emailInput.fill(DEMO_EMAIL);
  await passwordInput.fill(DEMO_PASSWORD);
  await submitBtn.click();
  await page.waitForLoadState("domcontentloaded");

  const url = page.url();
  if (url.includes("/login") || url.includes("/signup")) {
    throw new Error(
      `Login failed — still on auth URL (${url}). Seed demo user (scripts/seed-screenshot-demo-user.ts) or check credentials.`,
    );
  }
  console.log("  ↳ Logged in successfully.");
}

/** Slot 12 — navigate from hub to first lesson when no explicit lesson id env is set. */
async function navigateFirstLessonFromHub(page) {
  await page.goto(`${BASE_URL}/app/lessons`, {
    waitUntil: "domcontentloaded",
    timeout: 45_000,
  });
  const link = page.locator('#nn-learner-main a[href^="/app/lessons/"]').first();
  await link.waitFor({ state: "visible", timeout: 25_000 });
  await link.click();
  await page.waitForLoadState("domcontentloaded");
}

/** Supplementary — open mobile nav drawer (learner shell). */
async function openMobileLearnerNav(page) {
  const menuBtn = page.getByRole("button", { name: /open menu|menu/i }).first();
  await menuBtn.click({ timeout: 8000 }).catch(async () => {
    await page.locator('button[aria-expanded]').nth(1).click({ timeout: 5000 });
  });
  await page.waitForTimeout(400);
}

async function captureViewportScreenshot(page, target, relPath, resolvedRoute) {
  const absPath = join(OUTPUT_DIR, relPath);
  ensureDir(absPath);

  const vpName = target.viewport ?? "desktop";
  const vp = VIEWPORTS[vpName] ?? VIEWPORTS.desktop;
  await page.setViewportSize(vp);

  const theme = target.theme ?? GLOBAL_THEME;
  if (theme) {
    await applyThemeToPage(page, theme);
  }

  console.log(`  Capturing [${vpName}] ${resolvedRoute} → ${relPath}`);

  if (target.prepareHook === "openMobileLearnerNav") {
    await page.goto(`${BASE_URL}${target.route}`, {
      waitUntil: "domcontentloaded",
      timeout: 45_000,
    });
    if (target.waitFor) {
      await page.waitForSelector(target.waitFor, { timeout: 15_000 }).catch(() => {
        console.warn(`    ⚠ waitFor not found: ${target.waitFor} — continuing`);
      });
    }
    await openMobileLearnerNav(page);
  } else if (resolvedRoute === "__FIRST_LESSON_FROM_HUB__") {
    await navigateFirstLessonFromHub(page);
    if (target.waitFor) {
      await page.waitForSelector(target.waitFor, { timeout: 15_000 }).catch(() => {
        console.warn(`    ⚠ waitFor not found: ${target.waitFor} — continuing`);
      });
    }
  } else {
    await page.goto(`${BASE_URL}${resolvedRoute}`, {
      waitUntil: "domcontentloaded",
      timeout: 45_000,
    });
    if (target.waitFor) {
      await page.waitForSelector(target.waitFor, { timeout: 15_000 }).catch(() => {
        console.warn(`    ⚠ waitFor not found: ${target.waitFor} — continuing`);
      });
    }
  }

  if (EXTRA_WAIT_MS > 0) await page.waitForTimeout(EXTRA_WAIT_MS);

  await page.screenshot({ path: absPath, fullPage: false });
  console.log(`    ✓ ${absPath}`);
  return { status: "ok", path: absPath };
}

async function main() {
  if (CLI.help) {
    printHelp();
    process.exit(0);
  }

  if (CLI.listTargets) {
    printTargetList(targetsDoc);
    process.exit(0);
  }

  const targetIdFilter =
    CLI.targetIds?.length || TARGET_IDS_FROM_ENV?.size
      ? new Set([...(CLI.targetIds ?? []), ...(TARGET_IDS_FROM_ENV ? [...TARGET_IDS_FROM_ENV] : [])])
      : null;

  console.log("\nNurseNest — marketing screenshot capture");
  console.log("CDN doc base (reference):", CDN_BASE_DOC);
  console.log("Base URL:", BASE_URL);
  console.log("Output:  ", OUTPUT_DIR);
  console.log("Targets: ", TARGETS_FILE);
  if (ONLY_SLOTS) console.log("Slots:   ", [...ONLY_SLOTS].sort((a, b) => a - b).join(", "));
  if (targetIdFilter) console.log("Filter:  ", [...targetIdFilter].join(", "));
  console.log();

  mkdirSync(OUTPUT_DIR, { recursive: true });

  let targets = targetsDoc.slots;
  if (ONLY_SLOTS) targets = targets.filter((t) => ONLY_SLOTS.has(t.screenshotSlot));
  if (targetIdFilter?.size) {
    targets = targets.filter((t) => targetIdFilter.has(t.id));
  }

  if (targets.length === 0) {
    console.error("No slot targets selected (check SCREENSHOT_ONLY_SLOTS / SCREENSHOT_TARGET_IDS / --targets).");
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    reducedMotion: "reduce",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 NurseNest-Screenshot-Bot/1.0",
  });
  const page = await context.newPage();

  let loggedIn = false;
  const manifestEntries = [];
  const errors = [];

  async function ensureAuth(auth) {
    if (auth === "guest") return;
    if (!loggedIn) {
      await loginAsDemoUser(page);
      loggedIn = true;
    }
  }

  for (const t of targets) {
    const resolvedRoute = t.route ?? resolveSlotRoute(t);

    console.log(`\n[screenshot${t.screenshotSlot}.png] ${t.id}`);
    try {
      await ensureAuth(t.auth);
      const rel = `screenshot${t.screenshotSlot}.png`;

      const merged = { ...t, route: resolvedRoute };
      await captureViewportScreenshot(page, merged, rel, resolvedRoute);

      manifestEntries.push({
        screenshotSlot: t.screenshotSlot,
        targetId: t.id,
        route: resolvedRoute,
        viewport: VIEWPORTS[t.viewport] ?? VIEWPORTS.desktop,
        auth: t.auth,
        theme: t.theme ?? GLOBAL_THEME ?? "ocean",
        localRelativePath: rel,
        recommendedCdnObjectKey: rel,
        recommendedCdnUrl: `${CDN_BASE_DOC}/${rel}`,
        manualReviewNotes: t.manualReviewNotes,
        registryScreenshotId: t.registryScreenshotId,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`    ✗ ${msg}`);
      errors.push({ slot: t.screenshotSlot, id: t.id, error: msg });
      manifestEntries.push({
        screenshotSlot: t.screenshotSlot,
        targetId: t.id,
        route: resolvedRoute,
        status: "error",
        error: msg,
      });
    }
  }

  const supplementaryResults = [];
  const supplementary = targetsDoc.supplementary ?? [];
  if (!ONLY_SLOTS && process.env.SCREENSHOT_INCLUDE_SUPPLEMENTARY !== "0") {
    console.log("\n── Supplementary captures ──");
    for (const s of supplementary) {
      try {
        await ensureAuth(s.auth);
        const merged = { ...s };
        await captureViewportScreenshot(page, merged, s.filename, s.route);
        supplementaryResults.push({
          id: s.id,
          filename: s.filename,
          route: s.route,
          auth: s.auth,
          theme: s.theme ?? GLOBAL_THEME ?? "ocean",
          manualReviewNotes: s.manualReviewNotes,
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`    ✗ ${s.id}: ${msg}`);
        supplementaryResults.push({ id: s.id, status: "error", error: msg });
      }
    }
  }

  await browser.close();

  const manifest = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    outputDir: OUTPUT_DIR,
    pathwayIdDefault: PATHWAY_ID,
    cdnBaseDocumentation: CDN_BASE_DOC,
    uploadPolicy:
      "Do not upload to DigitalOcean Spaces or overwrite production screenshot1.png–screenshot15.png keys until manually approved (see docs/SCREENSHOT_CAPTURE_TO_CDN.md).",
    slots: manifestEntries,
    supplementary: supplementaryResults,
    errors,
  };

  const manifestPath = join(OUTPUT_DIR, "capture-manifest.json");
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest: ${manifestPath}`);
  console.log(`Failures: ${errors.length}`);

  if (errors.length > 0) process.exit(1);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
