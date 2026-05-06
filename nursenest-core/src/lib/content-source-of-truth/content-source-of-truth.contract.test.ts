import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import { ADMIN_EDIT_PUBLISH_SURFACES } from "@/lib/admin/admin-edit-publish-surface-registry";
import {
  APPROVED_SRC_CONTENT_ROOT_FILES,
  APPROVED_SRC_CONTENT_TOP_LEVEL_DIRS,
  CONTENT_REGISTRY_IDS,
  assertEveryRegistryEntryHasId,
  listRegistryEntries,
} from "@/lib/content-source-of-truth/content-registry";
import { resolveContentRoutes } from "@/lib/content-source-of-truth/resolve-content-routes";

const here = dirname(fileURLToPath(import.meta.url));
/** From `src/lib/content-source-of-truth/` → app package root (`nursenest-core/`). */
const appRoot = join(here, "../../..");

describe("content source-of-truth registry", () => {
  it("has every required content type id", () => {
    const required = new Set<string>([
      "lessons",
      "flashcards",
      "practice_questions",
      "cat_questions",
      "osce_stations",
      "medication_mastery",
      "blogs",
      "new_grad_content",
      "allied_health_content",
      "study_plan_items",
      "report_card_progress",
    ]);
    for (const id of required) {
      assert.ok(CONTENT_REGISTRY_IDS.includes(id as (typeof CONTENT_REGISTRY_IDS)[number]), `missing ${id}`);
    }
  });

  it("registry keys match entry.id", () => {
    assertEveryRegistryEntryHasId();
  });

  it("VERIFIED types must declare canonical storage + admin edit + at least one read route", () => {
    for (const e of listRegistryEntries()) {
      if (e.verificationStatus !== "VERIFIED") continue;
      assert.ok(e.canonicalStorageModel && e.canonicalStorageModel.length > 2, e.id);
      assert.ok(e.adminEditRoute && e.adminEditRoute.length > 2, e.id);
      assert.ok(
        (e.publicReadRoutePattern && e.publicReadRoutePattern.length > 2) ||
          (e.learnerReadRoutePattern && e.learnerReadRoutePattern.length > 2),
        e.id,
      );
    }
  });

  it("NOT_VERIFIED types must not claim VERIFIED-level live routing", () => {
    for (const e of listRegistryEntries()) {
      if (e.verificationStatus !== "NOT_VERIFIED") continue;
      const r = resolveContentRoutes(e.id, "sample-id");
      assert.equal(r.isLive, false, e.id);
    }
  });

  it("resolveContentRoutes returns templates for lessons", () => {
    const r = resolveContentRoutes("lessons", "fluid-balance-101", {
      locale: "en",
      hubSlug: "us",
      examCode: "nclex-rn",
      lessonSlug: "fluid-balance-101",
      pathwayLessonId: "clxyz",
      pathwayId: "us-rn-nclex-rn",
    });
    assert.match(r.learnerRoute ?? "", /fluid-balance-101|clxyz/);
    assert.equal(r.isLive, true);
  });

  it("admin edit publish surface registry keys are unique (guard for drift)", () => {
    const keys = ADMIN_EDIT_PUBLISH_SURFACES.map((r) => r.contentType);
    assert.equal(new Set(keys).size, keys.length);
  });

  it("OSCE admin + public API routes exist on disk", () => {
    for (const rel of [
      "src/app/api/admin/osce-stations/route.ts",
      "src/app/api/admin/osce-stations/[id]/route.ts",
      "src/app/api/osce-stations/route.ts",
      "src/app/api/osce-stations/[id]/route.ts",
    ]) {
      assert.ok(existsSync(join(appRoot, rel)), `missing ${rel}`);
    }
  });

  it("OSCE resolve gates legacy behind explicit env flag (contract: source file)", () => {
    const src = readFileSync(join(appRoot, "src/lib/scenarios/osce-stations-resolve.server.ts"), "utf8");
    assert.match(src, /isOsceLegacyFallbackWhenDbEmptyEnabled/);
    assert.match(src, /hasAnyPublishedOsceStation/, "public reads must key off published rows, not any row");
    assert.equal(
      /if\s*\(\s*await\s+isOsceDatabasePopulated\s*\(\)/.test(src),
      false,
      "public OSCE reads must not branch on isOsceDatabasePopulated()",
    );
    const fb = readFileSync(join(appRoot, "src/lib/scenarios/osce-legacy-fallback.ts"), "utf8");
    assert.match(fb, /OSCE_LEGACY_FALLBACK/);
  });

  it("OSCE learner hub page does not import merged legacy JSON directly (must use resolve server)", () => {
    const src = readFileSync(join(appRoot, "src/app/(student)/app/(learner)/osce/page.tsx"), "utf8");
    assert.equal(src.includes("getMergedLegacyOsceSkillStations"), false);
    assert.match(src, /getOsceHubListItemsResolved/);
  });

  it("resolveContentRoutes(osce_stations) fills public + learner + admin templates", () => {
    const r = resolveContentRoutes("osce_stations", "sample-station", {
      locale: "en",
      hubSlug: "us",
      examCode: "nclex-rn",
      osceStationSlug: "sample-station",
    });
    assert.ok(r.publicRoute);
    assert.ok(r.learnerRoute);
    assert.ok(r.adminEditRoute);
    assert.ok(r.adminCreateRoute);
    assert.equal(r.canonicalSource, "OsceStation (osce_stations)");
  });

  it("src/content top-level only contains registry-approved dirs + files", () => {
    const contentDir = join(appRoot, "src/content");
    const names = readdirSync(contentDir);
    for (const name of names) {
      const full = join(contentDir, name);
      const st = statSync(full);
      if (st.isDirectory()) {
        assert.ok(
          (APPROVED_SRC_CONTENT_TOP_LEVEL_DIRS as readonly string[]).includes(name),
          `unexpected src/content dir: ${name} — add to APPROVED_SRC_CONTENT_TOP_LEVEL_DIRS in content-registry.ts if intentional`,
        );
      } else if (st.isFile()) {
        assert.ok(
          APPROVED_SRC_CONTENT_ROOT_FILES.has(name),
          `unexpected src/content file: ${name} — add to APPROVED_SRC_CONTENT_ROOT_FILES if intentional`,
        );
      }
    }
  });
});
