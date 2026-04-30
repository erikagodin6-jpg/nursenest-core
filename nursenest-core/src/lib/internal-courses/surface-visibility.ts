import type { InternalCourseStatus } from "@prisma/client";
import type { StaffSession } from "@/lib/auth/staff-session";

/**
 * Whether a course row may appear on `/internal/courses` for the current principal.
 * - **Staff:** all statuses (including `published`) — editorial / QA.
 * - **Dev-gate learners** (`NN_INTERNAL_COURSES_DEV=1`): `draft` + `internal` only — never `published`.
 */
export function internalCourseRowVisibleOnInternalSurface(
  staff: StaffSession | null | undefined,
  status: InternalCourseStatus,
): boolean {
  if (staff) return true;
  if (status === "published") return false;
  return process.env.NN_INTERNAL_COURSES_DEV === "1";
}
