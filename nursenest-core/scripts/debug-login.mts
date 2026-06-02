import "@/lib/db/script-env-bootstrap";

// Test via direct fetch to the local server
const BASE = "http://127.0.0.1:3099";
const EMAIL = "cnple-e2e-test@nursenest-qa.internal";
const PASSWORD = "NurseNest_E2E_CNPLE_2026!";

// Step 1: Get CSRF token
const csrfResp = await fetch(`${BASE}/api/auth/csrf`, { credentials: "include" });
const { csrfToken } = await csrfResp.json() as { csrfToken: string };
console.log("CSRF:", csrfToken.slice(0, 20) + "...");
const cookieHeader = csrfResp.headers.get("set-cookie") ?? "";
console.log("Cookies:", cookieHeader.slice(0, 100));

// Step 2: Login
const body = new URLSearchParams({
  email: EMAIL,
  password: PASSWORD,
  csrfToken,
  callbackUrl: `${BASE}/`,
  rememberMe: "true",
});
const loginResp = await fetch(`${BASE}/api/auth/callback/credentials`, {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "X-Auth-Return-Redirect": "1",
    "Cookie": cookieHeader,
  },
  body: body.toString(),
  redirect: "manual",
});
const loginBody = await loginResp.json().catch(() => loginResp.text());
console.log("Login status:", loginResp.status);
console.log("Login body:", JSON.stringify(loginBody).slice(0, 200));
console.log("Login headers:", Object.fromEntries([...loginResp.headers.entries()].filter(([k]) => !k.includes("cookie"))));
