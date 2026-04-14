import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const EMAIL = process.env.RUNTIME_TEST_EMAIL ?? "demo-screenshots@internal.nursenest.io";
const PASSWORD = process.env.RUNTIME_TEST_PASSWORD ?? "DemoScreenshot2024!";
const NEW_PASSWORD = process.env.RUNTIME_TEST_NEW_PASSWORD ?? "DemoScreenshot2024!X";

const checks = [];

function record(flow, step, status, details) {
  checks.push({ flow, step, status, details });
  console.log(`[${status}] ${flow} :: ${step} :: ${details}`);
}

async function safeGoto(page, path) {
  await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded", timeout: 60000 });
}

async function click(locator, timeout = 4000) {
  await locator.first().click({ timeout });
}

async function login(page, password) {
  await safeGoto(page, `/login?callbackUrl=${encodeURIComponent("/app")}`);
  const form = page.locator("form").filter({ has: page.locator('input[name="email"]') }).first();
  await form.locator('input[name="email"]').fill(EMAIL);
  await form.locator('input[name="password"]').fill(password);
  await click(form.locator('button[type="submit"]'));
  await page.waitForTimeout(1500);
  return page.url().includes("/app");
}

async function logout(page) {
  await safeGoto(page, "/app");
  await page.waitForTimeout(1000);
  try {
    await click(page.getByRole("button", { name: /sign ?out/i }), 2500);
  } catch {
    try {
      await click(page.getByRole("menuitem", { name: /sign ?out/i }), 2500);
    } catch {
      await safeGoto(page, "/app/account/security");
      await page.waitForTimeout(900);
      await click(page.getByRole("button", { name: /sign ?out/i }), 3000);
    }
  }
  await page.waitForTimeout(1500);
  await safeGoto(page, "/app");
  await page.waitForTimeout(1000);
  return page.url().includes("/login") || page.url().includes("/signup");
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  let practiceCreateRequest = null;
  let practiceCreateResponse = null;

  page.on("request", (req) => {
    if (req.url().includes("/api/practice-tests") && req.method() === "POST") {
      const body = req.postData();
      if (!body) return;
      try {
        practiceCreateRequest = JSON.parse(body);
      } catch {
        practiceCreateRequest = { raw: body };
      }
    }
  });
  page.on("response", async (res) => {
    if (res.url().includes("/api/practice-tests") && res.request().method() === "POST") {
      try {
        practiceCreateResponse = { status: res.status(), body: await res.json() };
      } catch {
        practiceCreateResponse = { status: res.status(), body: null };
      }
    }
  });

  // AUTH signup
  try {
    await safeGoto(page, "/signup");
    const form = page.locator("form").filter({ has: page.locator('input[name="email"]') }).first();
    await form.locator('input[name="firstName"]').fill("Runtime");
    await form.locator('input[name="lastName"]').fill("Tester");
    await form.locator('input[name="username"]').fill(`runtime_${Date.now()}`);
    await form.locator('input[name="email"]').fill(`runtime+${Date.now()}@example.com`);
    await form.locator('input[name="password"]').fill("RuntimePass123!");
    await click(form.locator('button[type="submit"]'));
    await page.waitForTimeout(1700);
    record("AUTH", "signup", "PASS", `submit completed, URL=${page.url()}`);
  } catch (e) {
    record("AUTH", "signup", "FAIL", `Exception: ${e instanceof Error ? e.message : String(e)}`);
  }

  // AUTH login/logout/reset
  try {
    const ok = await login(page, PASSWORD);
    record("AUTH", "login", ok ? "PASS" : "FAIL", ok ? "Reached /app" : `Landed at ${page.url()}`);
  } catch (e) {
    record("AUTH", "login", "FAIL", `Exception: ${e instanceof Error ? e.message : String(e)}`);
  }

  try {
    const ok = await logout(page);
    record("AUTH", "logout", ok ? "PASS" : "FAIL", ok ? "Unauthenticated redirect confirmed" : `Stayed ${page.url()}`);
  } catch (e) {
    record("AUTH", "logout", "FAIL", `Exception: ${e instanceof Error ? e.message : String(e)}`);
  }

  try {
    const forgot = await context.request.post(`${BASE}/api/auth/forgot-password`, {
      data: { email: EMAIL },
      headers: { "Content-Type": "application/json" },
      timeout: 60000,
    });
    const forgotJson = await forgot.json().catch(() => ({}));
    if (forgot.status() >= 400) {
      record("AUTH", "password reset request", "FAIL", `HTTP ${forgot.status()} ${JSON.stringify(forgotJson)}`);
    } else if (!forgotJson?._devResetUrl) {
      record("AUTH", "password reset request", "FAIL", `No _devResetUrl returned: ${JSON.stringify(forgotJson)}`);
    } else {
      await page.goto(forgotJson._devResetUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
      const resetForm = page.locator("form").filter({ has: page.locator('input[name="password"]') }).first();
      await resetForm.locator('input[name="password"]').fill(NEW_PASSWORD);
      await resetForm.locator('input[name="confirm"]').fill(NEW_PASSWORD);
      await click(resetForm.locator('button[type="submit"]'));
      await page.waitForTimeout(1200);
      const relogin = await login(page, NEW_PASSWORD);
      record(
        "AUTH",
        "password reset -> login",
        relogin ? "PASS" : "FAIL",
        relogin ? "Reset login succeeded" : `Reset login failed URL=${page.url()}`,
      );
    }
  } catch (e) {
    record("AUTH", "password reset flow", "FAIL", `Exception: ${e instanceof Error ? e.message : String(e)}`);
  }

  // Ensure authenticated for remaining flows
  if (!(await login(page, NEW_PASSWORD))) {
    await login(page, PASSWORD);
  }

  // CHECKOUT
  try {
    await safeGoto(page, "/pricing");
    const pricingVisible = (await page.locator("text=/pricing|plan|monthly|yearly/i").count()) > 0;
    if (!pricingVisible) {
      record("CHECKOUT", "pricing", "FAIL", `Pricing page not recognizable URL=${page.url()}`);
    } else {
      record("CHECKOUT", "pricing", "PASS", `Loaded URL=${page.url()}`);
    }

    const before = page.url();
    const cta = page
      .getByRole("button", { name: /start|choose|subscribe|get started|checkout/i })
      .or(page.getByRole("link", { name: /start|choose|subscribe|get started|checkout/i }));
    await click(cta, 4000);
    await page.waitForTimeout(1800);
    const after = page.url();
    if (after === before) {
      const body = (await page.textContent("body")) ?? "";
      record(
        "CHECKOUT",
        "entry",
        "FAIL",
        /401|unauthorized/i.test(body) ? "Stayed on pricing with auth error" : "CTA clicked but no progression",
      );
    } else {
      record("CHECKOUT", "entry", "PASS", `Navigated to ${after}`);
    }
  } catch (e) {
    record("CHECKOUT", "flow", "FAIL", `Exception: ${e instanceof Error ? e.message : String(e)}`);
  }

  // PRACTICE EXAM
  let linearTestId = null;
  try {
    await safeGoto(page, "/app/practice-tests/start");
    await click(page.locator('[data-nn-qa-practice-hub-start-test]'), 5000);
    await page.waitForTimeout(2200);
    if (!practiceCreateResponse || ![200, 201].includes(practiceCreateResponse.status)) {
      record(
        "PRACTICE_EXAM",
        "start",
        "FAIL",
        `POST create missing/failed: ${practiceCreateResponse ? JSON.stringify(practiceCreateResponse) : "none"}`,
      );
    } else {
      linearTestId = practiceCreateResponse.body?.id ?? null;
      record(
        "PRACTICE_EXAM",
        "start",
        "PASS",
        `id=${linearTestId ?? "unknown"} payload=${JSON.stringify(practiceCreateRequest)}`,
      );
    }

    if (linearTestId) {
      const getRes = await context.request.get(`${BASE}/api/practice-tests/${linearTestId}`, { timeout: 60000 });
      const getJson = await getRes.json().catch(() => ({}));
      const qids = Array.isArray(getJson.questionIds) ? getJson.questionIds : [];
      if (qids.length === 0) {
        record("PRACTICE_EXAM", "load", "FAIL", "No questionIds in created session");
      } else {
        let answers = {};
        for (let i = 0; i < Math.min(3, qids.length); i += 1) {
          answers[qids[i]] = "A";
          await context.request.patch(`${BASE}/api/practice-tests/${linearTestId}`, {
            data: { action: "save", answers, cursorIndex: i },
            timeout: 60000,
          });
        }
        const afterRes = await context.request.get(`${BASE}/api/practice-tests/${linearTestId}`, { timeout: 60000 });
        const afterJson = await afterRes.json().catch(() => ({}));
        record(
          "PRACTICE_EXAM",
          "progress",
          typeof afterJson.cursorIndex === "number" && afterJson.cursorIndex >= 2 ? "PASS" : "FAIL",
          `cursorIndex=${afterJson.cursorIndex ?? "n/a"}`,
        );

        await safeGoto(page, `/app/practice-tests/${linearTestId}`);
        await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
        record(
          "PRACTICE_EXAM",
          "refresh-resume",
          page.url().includes(`/app/practice-tests/${linearTestId}`) ? "PASS" : "FAIL",
          `URL=${page.url()}`,
        );

        const completeRes = await context.request.patch(`${BASE}/api/practice-tests/${linearTestId}`, {
          data: { action: "complete", answers, cursorIndex: Math.max(0, qids.length - 1) },
          timeout: 60000,
        });
        const completeJson = await completeRes.json().catch(() => ({}));
        record(
          "PRACTICE_EXAM",
          "complete-results",
          completeRes.status() === 200 && completeJson?.results ? "PASS" : "FAIL",
          `status=${completeRes.status()} hasResults=${Boolean(completeJson?.results)}`,
        );
      }
    }
  } catch (e) {
    record("PRACTICE_EXAM", "flow", "FAIL", `Exception: ${e instanceof Error ? e.message : String(e)}`);
  }

  // CAT
  try {
    const catCreate = await context.request.post(`${BASE}/api/practice-tests`, {
      data: {
        questionCount: 10,
        topicNames: [],
        selectionMode: "cat",
        catSelectionBasis: "random",
        catPresentationMode: "practice",
        catExamFeedbackMode: "test",
        pathwayId: "ca-rn-nclex-rn",
        timedMode: false,
        timeLimitSec: null,
      },
      timeout: 60000,
    });
    const catCreateJson = await catCreate.json().catch(() => ({}));
    if (![200, 201].includes(catCreate.status()) || !catCreateJson?.id) {
      record("CAT", "start", "FAIL", `status=${catCreate.status()} body=${JSON.stringify(catCreateJson)}`);
    } else {
      const catId = catCreateJson.id;
      const catGet = await context.request.get(`${BASE}/api/practice-tests/${catId}`, { timeout: 60000 });
      const catJson = await catGet.json().catch(() => ({}));
      const firstQ = Array.isArray(catJson.questionIds) ? catJson.questionIds[0] : null;
      if (!firstQ) {
        record("CAT", "initial-load", "FAIL", "No CAT questionIds");
      } else {
        const adv = await context.request.patch(`${BASE}/api/practice-tests/${catId}`, {
          data: { action: "cat_advance", answers: { [firstQ]: "A" }, cursorIndex: 0 },
          timeout: 60000,
        });
        const advJson = await adv.json().catch(() => ({}));
        record(
          "CAT",
          "adaptive-progress",
          adv.status() === 200 && advJson?.ok === true ? "PASS" : "FAIL",
          `status=${adv.status()} body=${JSON.stringify(advJson)}`,
        );
      }
    }
  } catch (e) {
    record("CAT", "flow", "FAIL", `Exception: ${e instanceof Error ? e.message : String(e)}`);
  }

  // ERROR states
  try {
    const invalid = await context.request.post(`${BASE}/api/practice-tests`, {
      data: { questionCount: 1, selectionMode: "random", timedMode: false },
      timeout: 60000,
    });
    const invalidJson = await invalid.json().catch(() => ({}));
    record(
      "ERROR_STATES",
      "invalid-payload",
      invalid.status() === 400 ? "PASS" : "FAIL",
      `status=${invalid.status()} body=${JSON.stringify(invalidJson)}`,
    );
  } catch (e) {
    record("ERROR_STATES", "invalid-payload", "FAIL", `Exception: ${e instanceof Error ? e.message : String(e)}`);
  }

  try {
    await logout(page);
    const unauth = await context.request.post(`${BASE}/api/practice-tests`, {
      data: { questionCount: 20, selectionMode: "random", timedMode: false },
      timeout: 60000,
    });
    const unauthJson = await unauth.json().catch(() => ({}));
    record(
      "ERROR_STATES",
      "missing-entitlement-or-unauth",
      unauth.status() === 401 || unauth.status() === 403 ? "PASS" : "FAIL",
      `status=${unauth.status()} body=${JSON.stringify(unauthJson)}`,
    );
  } catch (e) {
    record(
      "ERROR_STATES",
      "missing-entitlement-or-unauth",
      "FAIL",
      `Exception: ${e instanceof Error ? e.message : String(e)}`,
    );
  }

  await browser.close();

  const summary = checks.reduce((acc, row) => {
    if (!acc[row.flow]) acc[row.flow] = { pass: 0, fail: 0, rows: [] };
    if (row.status === "PASS") acc[row.flow].pass += 1;
    else acc[row.flow].fail += 1;
    acc[row.flow].rows.push(row);
    return acc;
  }, {});
  console.log("\n=== RUNTIME FLOW VALIDATION SUMMARY ===");
  console.log(JSON.stringify(summary, null, 2));
}

run().catch((e) => {
  console.error("Runtime validation crashed:", e);
  process.exitCode = 1;
});
