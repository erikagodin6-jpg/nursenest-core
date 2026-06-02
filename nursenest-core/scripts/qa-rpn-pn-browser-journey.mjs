/**
 * One-off RPN/PN learner browser QA — run from nursenest-core:
 *   node scripts/qa-rpn-pn-browser-journey.mjs
 * Env: BASE_URL (default http://localhost:3000), OUT_DIR (default ../docs/qa-reports/rpn-pn-browser-2026-05-07)
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium, request } from "@playwright/test";

/**
 * Default `http://localhost:3000` — in some agent hosts `request.post` to `127.0.0.1` fails while `localhost` works.
 * Override with `BASE_URL` (e.g. `http://localhost:3010` if dev is on another port).
 */
const BASE = process.env.BASE_URL?.replace(/\/$/, "") || "http://localhost:3000";
const OUT = process.env.OUT_DIR || join(process.cwd(), "../docs/qa-reports/rpn-pn-browser-2026-05-07");
const ts = Date.now();
const email = `rpn.qa.student+${ts}@nursenest.test`;
const password = "NurseQA1a";
const username = `rpnqa${ts}`.slice(0, 28);

const findings = [];
const routesHit = [];
const screenshots = [];
const consoleErrors = [];
let signupAuthMethod = "unknown";

function note(severity, code, detail) {
  findings.push({ severity, code, detail });
}

async function shot(page, name) {
  const safe = name.replace(/[^a-z0-9-]+/gi, "-").toLowerCase();
  const fp = join(OUT, `${String(screenshots.length + 1).padStart(2, "0")}-${safe}.png`);
  await page.screenshot({ path: fp, fullPage: false, timeout: 60_000 });
  screenshots.push(fp);
  return fp;
}

async function goto(page, path, label) {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  const r = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 }).catch((e) => {
    note("high", "nav-fail", `${label}: ${e.message}`);
    return null;
  });
  routesHit.push({ label, final: page.url(), ok: Boolean(r) });
  return r;
}

async function main() {
  const log = (...a) => console.error("[qa-rpn-pn]", ...a);
  log("start", { BASE, OUT });
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  log("browser launched");
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  context.setDefaultTimeout(25_000);
  context.setDefaultNavigationTimeout(25_000);
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const t = msg.text();
      consoleErrors.push(t);
    }
  });
  page.on("pageerror", (err) => {
    consoleErrors.push(`pageerror: ${err.message}`);
  });

  // Phase 1: Home → signup
  log("goto homepage");
  await goto(page, "/", "homepage");
  await shot(page, "homepage-desktop");

  log("goto signup");
  await goto(page, "/signup", "signup");
  await shot(page, "signup-form");

  const createBtn = page.getByRole("button", { name: /create account/i });
  const uiGate = await createBtn.isDisabled().catch(() => true);
  if (uiGate) {
    signupAuthMethod = "api_signup_plus_credentials_login";
    note(
      "med",
      "signup-ui-turnstile",
      "Create Account disabled in browser — NEXT_PUBLIC_TURNSTILE_SITE_KEY gates the form. Using POST /api/signup for QA (same payload server accepts when Turnstile is not enforced).",
    );
    await shot(page, "signup-ui-gated");
    const apiCtx = await request.newContext({ baseURL: BASE });
    const signupRes = await apiCtx.post("/api/signup", {
      data: {
        email,
        password,
        username,
        name: "QA RPN Student",
        firstName: "QA",
        lastName: "RPN",
        country: "CA",
        tier: "RPN",
        examFocus: "rex_pn",
        studyGoal: "pass_first",
        dailyStudyMinutes: 30,
        learnerPath: "new_grad",
      },
    });
    const signupBody = await signupRes.text();
    if (!signupRes.ok()) {
      note("high", "api-signup-fail", `${signupRes.status()} ${signupBody.slice(0, 400)}`);
      await writeFile(
        join(OUT, "qa-metadata.json"),
        JSON.stringify(
          {
            email,
            username,
            baseUrl: BASE,
            screenshots,
            routesHit,
            findings,
            consoleErrors: consoleErrors.slice(0, 80),
            signupCompleted: false,
          },
          null,
          2,
        ),
      );
      await apiCtx.dispose();
      await browser.close();
      return;
    }
    await apiCtx.dispose();
    routesHit.push({ label: "api-signup", final: `${BASE}/api/signup`, ok: true });
  } else {
    signupAuthMethod = "ui_signup_form_plus_credentials_login";
    await page.locator('input[name="firstName"]').fill("QA");
    await page.locator('input[name="lastName"]').fill("RPN");
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('select[name="country"]').selectOption("CA");
    await page.locator('select[name="tier"]').selectOption("RPN");
    await page.locator('select[name="examFocus"]').selectOption("rex_pn");
    await page.locator('select[name="learnerPath"]').selectOption("new_grad");
    await page.locator('select[name="studyGoal"]').selectOption("pass_first");
    await page.locator('select[name="dailyStudyMinutes"]').selectOption("30");
    await Promise.all([
      page.waitForResponse((res) => res.url().includes("/api/signup") && res.request().method() === "POST", { timeout: 60000 }),
      createBtn.click(),
    ]).catch((e) => note("high", "signup-request", String(e)));
    await page.waitForTimeout(2000);
  }

  log("goto login");
  await goto(page, `/login?callbackUrl=${encodeURIComponent("/app")}`, "login");
  await page.waitForSelector("#login-identifier", { state: "visible", timeout: 20000 });
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
  await page.waitForFunction(
    () => {
      const id = document.querySelector("#login-identifier");
      const form = id?.closest("form");
      const btn = form?.querySelector("button[type=\"submit\"]");
      return Boolean(btn && !btn.disabled);
    },
    null,
    { timeout: 60000 },
  );
  await shot(page, "login-form");
  await page.locator("#login-identifier").fill(email);
  const pw = page.locator("#login-password");
  await pw.scrollIntoViewIfNeeded();
  await pw.fill(password, { force: true });
  log("submit login");
  await page.getByRole("button", { name: /sign in|log in/i }).first().click({ timeout: 20000 });
  await page.waitForTimeout(12_000);
  log("post-login url", page.url());
  if (!/\/app(\/|$)/i.test(page.url())) {
    note("high", "login-redirect", `Expected /app after login; got ${page.url()}`);
  }
  await shot(page, "after-login-app");

  // Phase 2: Dashboard
  log("dashboard");
  await goto(page, "/app", "learner-dashboard");
  await page.waitForTimeout(2000);
  await shot(page, "dashboard-desktop");
  const storagePath = join(OUT, "_qa-auth-storage.json");
  await context.storageState({ path: storagePath });
  const dashText = await page.locator("main").innerText().catch(() => page.innerText("body"));
  if (/blog/i.test(dashText) && dashText.length > 8000) {
    note("low", "blog-weight", "Dashboard main text is very long — check if blog module dominates.");
  }

  // Phase 3: Lessons
  log("lessons hub");
  await goto(page, "/app/lessons", "lessons-hub");
  await page.waitForTimeout(2000);
  await shot(page, "lessons-hub-desktop");
  const firstLesson = page.locator('main a[href*="/app/lessons/"]').first();
  if (await firstLesson.count()) {
    const lessonHref = await firstLesson.getAttribute("href");
    if (lessonHref?.startsWith("/")) {
      await goto(page, lessonHref, "lesson-detail");
    } else if (lessonHref) {
      await goto(page, lessonHref, "lesson-detail");
    }
    await shot(page, "lesson-detail-desktop");
    routesHit.push({ label: "lesson-detail", final: page.url(), ok: true });
  } else {
    note("med", "lessons-links", "No lesson detail link found in hub.");
  }

  // Mobile lessons hub (separate context; keep main learner session)
  {
    const mctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      storageState: storagePath,
    });
    const mp = await mctx.newPage();
    mp.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    await mp.goto(`${BASE}/app/lessons`, { waitUntil: "domcontentloaded", timeout: 18000 }).catch(() => {});
    await mp.waitForTimeout(1500);
    const mpath = join(OUT, `${String(screenshots.length + 1).padStart(2, "0")}-lessons-hub-mobile.png`);
    await mp.screenshot({ path: mpath, fullPage: false });
    screenshots.push(mpath);
    await mctx.close();
  }

  // Phase 4: Flashcards
  log("flashcards");
  await goto(page, "/app/flashcards", "flashcards-hub");
  await page.waitForTimeout(2000);
  await shot(page, "flashcards-hub");
  const fcLink = page.locator('main a[href*="/app/flashcards/"]').first();
  if (await fcLink.count()) {
    await fcLink.click();
    await page.waitForTimeout(2000);
    await shot(page, "flashcards-category");
  }

  // Phase 5: Questions
  await goto(page, "/app/questions", "questions-hub");
  await page.waitForTimeout(2000);
  await shot(page, "questions-hub");
  const startQ = page.getByRole("link", { name: /start|practice|bank/i }).first();
  if (await startQ.count()) {
    await startQ.click().catch(() => {});
    await page.waitForTimeout(2500);
    await shot(page, "questions-flow");
  }

  // Phase 6: Practice tests
  await goto(page, "/app/practice-tests", "practice-tests-hub");
  await page.waitForTimeout(2000);
  await shot(page, "practice-tests-hub");
  const h1 = await page.locator("h1").first().innerText().catch(() => "");
  if (/practice tests/i.test(h1) && !/^Practice Tests$/m.test(h1.trim())) {
    note("med", "practice-tests-title-case", `H1 observed: "${h1.trim()}" — spec wants Title Case "Practice Tests".`);
  }
  await goto(page, "/app/practice-tests/start", "practice-tests-builder");
  await page.waitForTimeout(2000);
  await shot(page, "practice-tests-builder");
  const builderHtml = await page.content();
  for (const ph of ["Builder Title", "Selection Label", "Pool Preset"]) {
    if (builderHtml.includes(ph)) {
      note("med", "placeholder", `Builder surface shows placeholder text: ${ph}`);
    }
  }

  // Phase 7: CAT
  await goto(page, "/app/cat", "cat");
  await page.waitForTimeout(2000);
  await shot(page, "cat-page");

  // Phase 8: Report card, progress, study plan, account
  for (const [label, path] of [
    ["report-card", "/app/account/report-card"],
    ["progress", "/app/account/progress"],
    ["study-plan", "/app/study-plan"],
    ["account", "/app/account"],
  ]) {
    await goto(page, path, label);
    await page.waitForTimeout(1500);
    await shot(page, label);
  }

  // Phase 9: Marketing nav matrix (logged-out new context to avoid learner shell)
  const navResults = [];
  const m2 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p2 = await m2.newPage();
  const matrix = [
    ["/us/rn/nclex-rn", "US RN hub"],
    ["/canada/rpn/rex-pn", "CA RPN REx-PN hub"],
    ["/us/np", "US NP"],
    ["/new-grad", "New Grad"],
    ["/allied-health", "Allied"],
    ["/pre-nursing", "Pre-Nursing"],
    ["/pricing", "Pricing"],
    ["/blog", "Blog"],
    ["/faq", "FAQ"],
    ["/tools", "Tools"],
  ];
  p2.setDefaultNavigationTimeout(22_000);
  for (const [path, name] of matrix) {
    const ok = await p2.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded", timeout: 22000 }).then(() => true).catch(() => false);
    navResults.push({ path, name, final: p2.url(), ok });
  }
  await m2.close();

  log("write metadata, close browser");
  await writeFile(
    join(OUT, "qa-metadata.json"),
    JSON.stringify(
      {
        email,
        username,
        passwordPattern: "strongPasswordSchema (8+ chars, letter+digit)",
        baseUrl: BASE,
        pathway: { tier: "RPN", country: "CA", examFocus: "rex_pn" },
        authEntitlementMethod: signupAuthMethod,
        screenshots,
        routesHit,
        navMatrix: navResults,
        findings,
        consoleErrors: [...new Set(consoleErrors)].slice(0, 120),
        signupCompleted: true,
      },
      null,
      2,
    ),
  );

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
