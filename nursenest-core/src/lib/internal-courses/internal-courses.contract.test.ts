import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { InternalCourseStatus } from "@prisma/client";
import { z } from "zod";
import { LEGACY_INTERNAL_COURSE_IMPORT } from "@/lib/internal-courses/legacy-import-catalog";

const __dirname = dirname(fileURLToPath(import.meta.url));

function collectJsonKeys(value: unknown, out = new Set<string>()): Set<string> {
  if (value !== null && typeof value === "object") {
    if (Array.isArray(value)) {
      for (const v of value) collectJsonKeys(v, out);
    } else {
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        out.add(k);
        collectJsonKeys(v, out);
      }
    }
  }
  return out;
}

const FORBIDDEN_LESSON_DUPE_KEYS = new Set([
  "html",
  "markdown",
  "lessonBody",
  "lessonMarkdown",
  "portableText",
  "blocks",
  "mdx",
  "contentHtml",
]);

test("robots.txt route disallows /internal/ (no public indexing)", () => {
  const robotsRoute = join(__dirname, "../../app/robots.txt/route.ts");
  const src = readFileSync(robotsRoute, "utf8");
  assert.match(src, /Disallow:\s*\/internal\//);
});

test("legacy internal course seed does not embed pathway lesson bodies in module JSON", () => {
  for (const course of LEGACY_INTERNAL_COURSE_IMPORT) {
    for (const mod of course.modules) {
      const keys = collectJsonKeys(mod.content);
      for (const k of keys) {
        assert.ok(
          !FORBIDDEN_LESSON_DUPE_KEYS.has(k),
          `module type=${mod.type} sort=${mod.sortOrder} must not duplicate lesson fields; forbidden key: ${k}`,
        );
      }
    }
  }
});

const adminPatchSchema = z
  .object({
    status: z.nativeEnum(InternalCourseStatus),
  })
  .strict();

test("admin internal-courses PATCH contract: status only, strict", () => {
  assert.equal(adminPatchSchema.safeParse({ status: "internal" }).success, true);
  assert.equal(adminPatchSchema.safeParse({ status: "draft", modules: [] }).success, false);
});

test("internalCourseRowVisibleOnInternalSurface: staff sees draft/internal (dev off)", async () => {
  const { internalCourseRowVisibleOnInternalSurface } = await import("@/lib/internal-courses/surface-visibility");
  const { UserRole } = await import("@prisma/client");
  const prev = process.env.NN_INTERNAL_COURSES_DEV;
  process.env.NN_INTERNAL_COURSES_DEV = "";
  try {
    const staff = { userId: "u", role: UserRole.ADMIN, tier: "super" as const };
    assert.equal(internalCourseRowVisibleOnInternalSurface(staff, "draft"), true);
    assert.equal(internalCourseRowVisibleOnInternalSurface(staff, "internal"), true);
  } finally {
    process.env.NN_INTERNAL_COURSES_DEV = prev;
  }
});
