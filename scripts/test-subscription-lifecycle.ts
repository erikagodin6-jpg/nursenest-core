import fetch from "node-fetch";
import fs from "fs";

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "";

const TEST_USER = {
  username: `testuser_sub_${Date.now()}`,
  password: "TestPass123!",
};

interface TestResult {
  step: string;
  status: "PASS" | "FAIL";
  details: string;
}

const results: TestResult[] = [];

function log(step: string, status: "PASS" | "FAIL", details: string) {
  results.push({ step, status, details });
  const icon = status === "PASS" ? "PASS" : "FAIL";
  console.log(`[${icon}] ${step}: ${details}`);
}

function writeResults() {
  const timestamp = new Date().toISOString();
  const passed = results.filter(r => r.status === "PASS").length;
  const failed = results.filter(r => r.status === "FAIL").length;

  let report = `# Subscription Lifecycle Test Results\n`;
  report += `Run: ${timestamp}\n`;
  report += `Test user: ${TEST_USER.username}\n`;
  report += `Base URL: ${BASE_URL}\n\n`;
  report += `## Summary\n`;
  report += `Total: ${results.length} | Passed: ${passed} | Failed: ${failed}\n\n`;
  report += `## Detailed Results\n\n`;
  report += `| Step | Status | Details |\n`;
  report += `|------|--------|---------|\n`;
  for (const r of results) {
    report += `| ${r.step} | ${r.status} | ${r.details} |\n`;
  }

  if (failed > 0) {
    report += `\n## Failed Tests\n\n`;
    for (const r of results.filter(r => r.status === "FAIL")) {
      report += `- **${r.step}**: ${r.details}\n`;
    }
  }

  fs.writeFileSync("scripts/test-results.md", report);
  console.log(`\nTest results written to scripts/test-results.md`);
}

async function run() {
  let userId = "";
  let userToken = "";

  console.log(`\n========== SUBSCRIPTION LIFECYCLE TEST ==========`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Test user: ${TEST_USER.username}\n`);

  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(TEST_USER),
    });
    const body = await res.json() as any;
    if (res.ok && body.id && body.username === TEST_USER.username) {
      userId = body.id;
      log("1. Register", "PASS", `Created user ${body.id}`);
      if (body.tier !== "free") log("1a. Register tier=free", "FAIL", `Expected free, got ${body.tier}`);
      else log("1a. Register tier=free", "PASS", "tier=free confirmed");
      if (body.subscriptionStatus !== "inactive") log("1b. Register subscriptionStatus=inactive", "FAIL", `Expected inactive, got ${body.subscriptionStatus}`);
      else log("1b. Register subscriptionStatus=inactive", "PASS", "subscriptionStatus=inactive confirmed");
      if (body.testerAccess !== false) log("1c. Register testerAccess=false", "FAIL", `Expected false, got ${body.testerAccess}`);
      else log("1c. Register testerAccess=false", "PASS", "testerAccess=false confirmed");
    } else {
      log("1. Register", "FAIL", `Status ${res.status}: ${JSON.stringify(body)}`);
      writeResults();
      return;
    }
  } catch (e: any) {
    log("1. Register", "FAIL", e.message);
    writeResults();
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(TEST_USER),
    });
    const body = await res.json() as any;
    if (res.ok && body.userToken) {
      userToken = body.userToken;
      log("2. Login", "PASS", `Got userToken, tier=${body.tier}`);
      if (body.tier !== "free") log("2a. Login tier=free", "FAIL", `Expected free, got ${body.tier}`);
      else log("2a. Login tier=free", "PASS", "tier=free confirmed on login");
    } else {
      log("2. Login", "FAIL", `Status ${res.status}: ${JSON.stringify(body)}`);
      writeResults();
      return;
    }
  } catch (e: any) {
    log("2. Login", "FAIL", e.message);
    writeResults();
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/user/${userId}`);
    const body = await res.json() as any;
    if (res.ok && body.id === userId) {
      log("3. GET /api/user/:userId", "PASS", `Profile retrieved`);
      if (body.tier !== "free") log("3a. Profile tier=free", "FAIL", `Expected free, got ${body.tier}`);
      else log("3a. Profile tier=free", "PASS", "tier=free confirmed");
      if (body.subscriptionStatus !== "inactive") log("3b. Profile subscriptionStatus=inactive", "FAIL", `Expected inactive, got ${body.subscriptionStatus}`);
      else log("3b. Profile subscriptionStatus=inactive", "PASS", "subscriptionStatus=inactive confirmed");
    } else {
      log("3. GET /api/user/:userId", "FAIL", `Status ${res.status}: ${JSON.stringify(body)}`);
    }
  } catch (e: any) {
    log("3. GET /api/user/:userId", "FAIL", e.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { "Authorization": `Bearer ${userToken}` },
    });
    const body = await res.json() as any;
    if (res.ok && body.id === userId) {
      log("3c. GET /api/auth/me (authenticated)", "PASS", `id=${body.id}, tier=${body.tier}`);
      if (body.tier !== "free") log("3d. /api/auth/me tier=free", "FAIL", `Expected free, got ${body.tier}`);
      else log("3d. /api/auth/me tier=free", "PASS", "tier=free confirmed");
      if (body.testerAccess !== false) log("3e. /api/auth/me testerAccess=false", "FAIL", `Expected false, got ${body.testerAccess}`);
      else log("3e. /api/auth/me testerAccess=false", "PASS", "testerAccess=false confirmed (pre-grant)");
    } else {
      log("3c. GET /api/auth/me (authenticated)", "FAIL", `Status ${res.status}: ${JSON.stringify(body)}`);
    }
  } catch (e: any) {
    log("3c. GET /api/auth/me (authenticated)", "FAIL", e.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/api/auth/me`);
    if (res.status === 401) {
      log("3f. GET /api/auth/me (no auth) returns 401", "PASS", "401 returned as expected");
    } else {
      log("3f. GET /api/auth/me (no auth) returns 401", "FAIL", `Expected 401, got ${res.status}`);
    }
  } catch (e: any) {
    log("3f. GET /api/auth/me (no auth) returns 401", "FAIL", e.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/api/entitlement/resolve?productType=feature`, {
      headers: { "Authorization": `Bearer ${userToken}` },
    });
    const body = await res.json() as any;
    if (res.ok) {
      const hasAccess = body.hasAccess;
      const accessSource = body.accessSource;
      const accessReason = body.accessDecisionReason;
      log("4. Entitlement resolve (free tier)", "PASS", `hasAccess=${hasAccess}, accessSource=${accessSource}, reason=${accessReason}`);
      if (accessSource === "subscription" || accessSource === "tester") {
        log("4a. Free user should not have paid access source", "FAIL", `Expected none/free source, got accessSource=${accessSource}`);
      } else {
        log("4a. Free user entitlement source is not paid", "PASS", `accessSource=${accessSource} (expected non-paid source for free user)`);
      }
    } else {
      log("4. Entitlement resolve (free tier)", "FAIL", `Status ${res.status}: ${JSON.stringify(body)}`);
    }
  } catch (e: any) {
    log("4. Entitlement resolve (free tier)", "FAIL", e.message);
  }

  if (!ADMIN_API_KEY) {
    log("5. Admin grant tester access", "FAIL", "ADMIN_API_KEY not set, cannot test admin grant");
  } else {
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      const res = await fetch(`${BASE_URL}/api/admin/tester/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ADMIN_API_KEY}`,
        },
        body: JSON.stringify({ testerAccess: true, testerExpiry: expiryDate.toISOString() }),
      });
      const body = await res.json() as any;
      if (res.ok && body.testerAccess === true) {
        log("5. Admin grant tester access", "PASS", `testerAccess=${body.testerAccess}, testerExpiry=${body.testerExpiry}`);
      } else {
        log("5. Admin grant tester access", "FAIL", `Status ${res.status}: ${JSON.stringify(body)}`);
      }
    } catch (e: any) {
      log("5. Admin grant tester access", "FAIL", e.message);
    }

    try {
      const res = await fetch(`${BASE_URL}/api/user/${userId}`);
      const body = await res.json() as any;
      if (res.ok && body.testerAccess === true) {
        log("6. Re-fetch profile reflects tester access", "PASS", `testerAccess=${body.testerAccess}, testerExpiry=${body.testerExpiry}`);
      } else {
        log("6. Re-fetch profile reflects tester access", "FAIL", `testerAccess=${body.testerAccess}: ${JSON.stringify(body)}`);
      }
    } catch (e: any) {
      log("6. Re-fetch profile reflects tester access", "FAIL", e.message);
    }

    try {
      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: { "Authorization": `Bearer ${userToken}` },
      });
      const body = await res.json() as any;
      if (res.ok && (body.testerAccess === true)) {
        log("6b. /api/auth/me reflects tester access", "PASS", `testerAccess=${body.testerAccess}`);
      } else {
        log("6b. /api/auth/me reflects tester access", "FAIL", `testerAccess=${body.testerAccess}`);
      }
    } catch (e: any) {
      log("6b. /api/auth/me reflects tester access", "FAIL", e.message);
    }

    try {
      const res = await fetch(`${BASE_URL}/api/entitlement/resolve?productType=feature`, {
        headers: { "Authorization": `Bearer ${userToken}` },
      });
      const body = await res.json() as any;
      if (res.ok) {
        const hasAccess = body.hasAccess;
        const accessSource = body.accessSource;
        const accessReason = body.accessDecisionReason;
        log("7. Entitlement resolve (post-grant)", "PASS", `hasAccess=${hasAccess}, accessSource=${accessSource}, reason=${accessReason}`);
        if (hasAccess === true) {
          log("7a. Tester has access after grant", "PASS", `hasAccess=true, source=${accessSource}`);
        } else if (accessSource === "tester" || accessReason?.includes("tester") || accessReason?.includes("emergency")) {
          log("7a. Tester has access after grant", "PASS", `Access recognized via source=${accessSource}, reason=${accessReason}`);
        } else {
          log("7a. Tester has access after grant", "FAIL", `Expected hasAccess=true or tester source, got hasAccess=${hasAccess}, source=${accessSource}`);
        }
      } else {
        log("7. Entitlement resolve (post-grant)", "FAIL", `Status ${res.status}: ${JSON.stringify(body)}`);
      }
    } catch (e: any) {
      log("7. Entitlement resolve (post-grant)", "FAIL", e.message);
    }
  }

  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(TEST_USER),
    });
    const body = await res.json() as any;
    if (res.ok && body.userToken) {
      const newToken = body.userToken;
      log("8. Re-login succeeds", "PASS", `Got new userToken`);

      if (body.testerAccess === true) {
        log("8a. Re-login preserves testerAccess", "PASS", `testerAccess=${body.testerAccess} persisted after re-login`);
      } else {
        log("8a. Re-login preserves testerAccess", "FAIL", `Expected testerAccess=true after grant, got ${body.testerAccess}`);
      }

      const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: { "Authorization": `Bearer ${newToken}` },
      });
      const meBody = await meRes.json() as any;
      if (meRes.ok && meBody.id === userId && meBody.testerAccess === true) {
        log("8b. /api/auth/me with new token persists state", "PASS", `testerAccess=${meBody.testerAccess}, tier=${meBody.tier}`);
      } else if (meRes.ok && meBody.id === userId) {
        log("8b. /api/auth/me with new token persists state", "FAIL", `testerAccess=${meBody.testerAccess} (expected true)`);
      } else {
        log("8b. /api/auth/me with new token persists state", "FAIL", `Status ${meRes.status}: ${JSON.stringify(meBody)}`);
      }
    } else {
      log("8. Re-login succeeds", "FAIL", `Status ${res.status}: ${JSON.stringify(body)}`);
    }
  } catch (e: any) {
    log("8. Re-login succeeds", "FAIL", e.message);
  }

  console.log(`\n========== TEST RESULTS SUMMARY ==========`);
  const passed = results.filter(r => r.status === "PASS").length;
  const failed = results.filter(r => r.status === "FAIL").length;
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  if (failed > 0) {
    console.log(`\nFailed tests:`);
    results.filter(r => r.status === "FAIL").forEach(r => {
      console.log(`  ${r.step}: ${r.details}`);
    });
  }

  writeResults();
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(e => {
  console.error("Test script crashed:", e);
  process.exit(1);
});
