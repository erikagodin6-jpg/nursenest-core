// Test the login directly via fetch - simulating what the Playwright page.evaluate does
import "@/lib/db/script-env-bootstrap";

const BASE = "http://127.0.0.1:3099";
const EMAIL = "cnple-e2e-test@nursenest-qa.internal";
const PASSWORD = "NurseNest_E2E_CNPLE_2026!";

// Step 1: Get CSRF
const csrfRes = await fetch(`${BASE}/api/auth/csrf`, {
  headers: { "accept": "application/json" }
});
const { csrfToken } = await csrfRes.json() as { csrfToken: string };
const setCookies = csrfRes.headers.get("set-cookie") ?? "";
console.log("CSRF:", csrfToken?.slice(0,30) + "...");

// Step 2: Credentials POST
const formBody = new URLSearchParams({
  email: EMAIL,
  password: PASSWORD,
  rememberMe: "true",
  csrfToken,
  callbackUrl: `${BASE}/app`,
});

const credRes = await fetch(`${BASE}/api/auth/callback/credentials`, {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "X-Auth-Return-Redirect": "1",
    "Cookie": setCookies,
  },
  body: formBody.toString(),
  redirect: "manual"
});

const body = await credRes.json().catch(() => credRes.text().then(t => ({ raw: t.slice(0,200) })));
console.log("Status:", credRes.status);
console.log("Response URL:", JSON.stringify(body).slice(0,200));
console.log("Has session cookie:", credRes.headers.get("set-cookie")?.includes("authjs.session-token") ?? false);
