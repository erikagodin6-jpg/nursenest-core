import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { adminRouteGateDecision } from "@/lib/auth/admin-path-policy";

const HERE = path.dirname(fileURLToPath(import.meta.url));
/** `nursenest-core/` package root (this file lives under `src/lib/admin/`). */
const REPO_ROOT = path.join(HERE, "..", "..", "..");
const ECOSYSTEM_PAGE = path.join(REPO_ROOT, "src", "app", "(admin)", "admin", "platform-ecosystem", "page.tsx");

function readUtf8(p: string): string {
  return fs.readFileSync(p, "utf8");
}

function listAppSourceFiles(dir: string, acc: string[] = []): string[] {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      listAppSourceFiles(full, acc);
    } else if (/\.(tsx|ts|mts|jsx|js)$/.test(ent.name)) {
      acc.push(full);
    }
  }
  return acc;
}

function isPublicAppSourceFile(absPath: string): boolean {
  const norm = absPath.replace(/\\/g, "/");
  if (norm.includes("/src/app/(admin)/")) return false;
  if (norm.includes("/src/app/api/admin/")) return false;
  return norm.includes("/src/app/");
}

describe("admin ecosystem readiness (Phase 10B)", () => {
  it("gates the ecosystem page with requireAdmin and staff session helpers", () => {
    const src = readUtf8(ECOSYSTEM_PAGE);
    assert.match(src, /import\s+\{\s*requireAdmin\s*\}\s+from\s+["']@\/lib\/auth\/guards["']/);
    assert.match(src, /await\s+requireAdmin\(\)/);
    assert.match(src, /getStaffSession/);
    assert.match(src, /loadAdminEcosystemReadinessRegistry/);
    assert.ok(!src.includes("fetch("), "page must stay static-registry only (no ad-hoc HTTP)");
  });

  it("redirects signed-in learners (no staff DB row) away from the ecosystem path", () => {
    const gate = adminRouteGateDecision(null, "/admin/platform-ecosystem");
    assert.equal(gate.allow, false);
    if (!gate.allow) assert.equal(gate.redirectTo, "/app");
  });

  it("allows super staff to access the ecosystem path", () => {
    const gate = adminRouteGateDecision({ tier: "super" }, "/admin/platform-ecosystem");
    assert.equal(gate.allow, true);
  });

  it("allows support staff when the path is on the support allowlist", () => {
    const gate = adminRouteGateDecision({ tier: "support" }, "/admin/platform-ecosystem");
    assert.equal(gate.allow, true);
  });

  it("does not expose Phase 10 admin registry or phase10 barrels from public app routes", () => {
    const appDir = path.join(REPO_ROOT, "src", "app");
    const files = listAppSourceFiles(appDir).filter(isPublicAppSourceFile);
    const forbidden = [
      "admin-ecosystem-readiness-registry",
      "loadAdminEcosystemReadinessRegistry",
      "@/lib/platform/phase10",
      "lib/platform/phase10",
    ];
    const hits: string[] = [];
    for (const f of files) {
      const src = readUtf8(f);
      for (const token of forbidden) {
        if (src.includes(token)) hits.push(`${path.relative(REPO_ROOT, f)}: ${token}`);
      }
    }
    assert.deepEqual(hits, []);
  });
});
