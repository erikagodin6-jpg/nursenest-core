import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  collectAuthPublicOriginEnvIssues,
  hasAnyAuthPublicOriginUrl,
} from "@/lib/auth/auth-public-origin-env";

const KEYS = ["AUTH_URL", "NEXTAUTH_URL", "NEXT_PUBLIC_APP_URL"] as const;

function readEnvSnapshot(): Record<(typeof KEYS)[number], string | undefined> {
  return {
    AUTH_URL: process.env.AUTH_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  };
}

function restoreEnvSnapshot(s: ReturnType<typeof readEnvSnapshot>): void {
  for (const k of KEYS) {
    const v = s[k];
    if (v === undefined) Reflect.deleteProperty(process.env, k);
    else process.env[k] = v;
  }
}

describe("auth-public-origin-env", () => {
  it("hasAnyAuthPublicOriginUrl is false when neither AUTH_URL nor NEXTAUTH_URL is set", () => {
    const snap = readEnvSnapshot();
    try {
      Reflect.deleteProperty(process.env, "AUTH_URL");
      Reflect.deleteProperty(process.env, "NEXTAUTH_URL");
      assert.equal(hasAnyAuthPublicOriginUrl(), false);
    } finally {
      restoreEnvSnapshot(snap);
    }
  });

  it("collectAuthPublicOriginEnvIssues returns no issues when no auth URLs are set", () => {
    const snap = readEnvSnapshot();
    try {
      Reflect.deleteProperty(process.env, "AUTH_URL");
      Reflect.deleteProperty(process.env, "NEXTAUTH_URL");
      assert.deepEqual(collectAuthPublicOriginEnvIssues({ requireProductionHttps: true }), []);
    } finally {
      restoreEnvSnapshot(snap);
    }
  });

  it("AUTH_URL and NEXTAUTH_URL origin mismatch => critical auth_url_pair_mismatch", () => {
    const snap = readEnvSnapshot();
    try {
      process.env.AUTH_URL = "https://www.alpha.example";
      process.env.NEXTAUTH_URL = "https://www.beta.example";
      const issues = collectAuthPublicOriginEnvIssues({ requireProductionHttps: true });
      const hit = issues.find((i) => i.code === "auth_url_pair_mismatch");
      assert.ok(hit, `expected auth_url_pair_mismatch, got ${JSON.stringify(issues.map((i) => i.code))}`);
      assert.equal(hit!.severity, "critical");
    } finally {
      restoreEnvSnapshot(snap);
    }
  });

  it("configured URL with path suffix => critical auth_url_has_path", () => {
    const snap = readEnvSnapshot();
    try {
      process.env.AUTH_URL = "https://www.example.com/login";
      Reflect.deleteProperty(process.env, "NEXTAUTH_URL");
      const issues = collectAuthPublicOriginEnvIssues({ requireProductionHttps: true });
      const hit = issues.find((i) => i.code === "auth_url_has_path");
      assert.ok(hit, `expected auth_url_has_path, got ${JSON.stringify(issues.map((i) => i.code))}`);
      assert.equal(hit!.severity, "critical");
    } finally {
      restoreEnvSnapshot(snap);
    }
  });

  it("http URL with requireProductionHttps true => critical auth_url_not_https", () => {
    const snap = readEnvSnapshot();
    try {
      process.env.AUTH_URL = "http://www.example.com";
      Reflect.deleteProperty(process.env, "NEXTAUTH_URL");
      const issues = collectAuthPublicOriginEnvIssues({ requireProductionHttps: true });
      const hit = issues.find((i) => i.code === "auth_url_not_https");
      assert.ok(hit, `expected auth_url_not_https, got ${JSON.stringify(issues.map((i) => i.code))}`);
      assert.equal(hit!.severity, "critical");
    } finally {
      restoreEnvSnapshot(snap);
    }
  });

  it("http URL with requireProductionHttps false => no https critical", () => {
    const snap = readEnvSnapshot();
    try {
      process.env.AUTH_URL = "http://localhost:3000";
      Reflect.deleteProperty(process.env, "NEXTAUTH_URL");
      Reflect.deleteProperty(process.env, "NEXT_PUBLIC_APP_URL");
      const issues = collectAuthPublicOriginEnvIssues({ requireProductionHttps: false });
      assert.equal(
        issues.some((i) => i.code === "auth_url_not_https"),
        false,
        "should not require https when requireProductionHttps is false",
      );
    } finally {
      restoreEnvSnapshot(snap);
    }
  });

  it("NEXT_PUBLIC_APP_URL origin differs from auth origin => warning only", () => {
    const snap = readEnvSnapshot();
    try {
      process.env.AUTH_URL = "https://www.example.com";
      Reflect.deleteProperty(process.env, "NEXTAUTH_URL");
      process.env.NEXT_PUBLIC_APP_URL = "https://apex.example.com";
      const issues = collectAuthPublicOriginEnvIssues({ requireProductionHttps: true });
      const hit = issues.find((i) => i.code === "auth_url_public_app_url_host_mismatch");
      assert.ok(hit, `expected host mismatch warning, got ${JSON.stringify(issues.map((i) => i.code))}`);
      assert.equal(hit!.severity, "warning");
      assert.equal(issues.some((i) => i.severity === "critical"), false);
    } finally {
      restoreEnvSnapshot(snap);
    }
  });
});
