import assert from "node:assert/strict";
import { test } from "node:test";
import { UserRole } from "@prisma/client";
import { internalCourseRowVisibleOnInternalSurface } from "@/lib/internal-courses/surface-visibility";

test("internalCourseRowVisibleOnInternalSurface: staff sees published", () => {
  const prev = process.env.NN_INTERNAL_COURSES_DEV;
  process.env.NN_INTERNAL_COURSES_DEV = "";
  try {
    assert.equal(
      internalCourseRowVisibleOnInternalSurface({ userId: "u", role: UserRole.ADMIN, tier: "super" }, "published"),
      true,
    );
  } finally {
    process.env.NN_INTERNAL_COURSES_DEV = prev;
  }
});

test("internalCourseRowVisibleOnInternalSurface: dev flag hides published for non-staff", () => {
  const prev = process.env.NN_INTERNAL_COURSES_DEV;
  process.env.NN_INTERNAL_COURSES_DEV = "1";
  try {
    assert.equal(internalCourseRowVisibleOnInternalSurface(null, "published"), false);
    assert.equal(internalCourseRowVisibleOnInternalSurface(null, "internal"), true);
    assert.equal(internalCourseRowVisibleOnInternalSurface(null, "draft"), true);
  } finally {
    process.env.NN_INTERNAL_COURSES_DEV = prev;
  }
});
