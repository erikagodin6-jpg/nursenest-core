import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const statsPath = join(here, "load-admin-dashboard-stats.ts");

describe("loadAdminDashboardStats — demo user exclusion", () => {
  const src = readFileSync(statsPath, "utf8");

  it("filters demo users from recent lists, DAU union, learner counts, and subscription aggregates", () => {
    assert.match(src, /const recentUsers = await prisma\.user\.findMany\(\{\s*where: \{ isDemoUser: false \}/);
    assert.match(src, /recentSignups[\s\S]*?role: UserRole\.LEARNER, isDemoUser: false/);
    assert.match(src, /recentPurchases[\s\S]*?where: \{ user: \{ isDemoUser: false \} \}/);
    assert.match(src, /"is_demo_user"\s*=\s*false/);
    assert.match(src, /role: UserRole\.LEARNER,\s*isDemoUser: false/);
  });
});
