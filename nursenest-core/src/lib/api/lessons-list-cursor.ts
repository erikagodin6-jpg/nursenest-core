import type { Prisma } from "@prisma/client";

/**
 * Keyset pagination for `/api/lessons` (subscriber `content_items` list).
 *
 * **Sort order (must match `findMany` `orderBy`):** `updatedAt` descending, then `id` descending.
 * This extends the historical single-field `orderBy: { updatedAt: "desc" }` with a deterministic
 * tie-break so pages cannot duplicate or drop rows when many lessons share the same `updatedAt`.
 */
export type LessonListCursorPayload = {
  /** ISO 8601 */
  u: string;
  i: string;
};

export function encodeLessonListCursor(updatedAt: Date, id: string): string {
  const payload: LessonListCursorPayload = { u: updatedAt.toISOString(), i: id };
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function decodeLessonListCursor(raw: string):
  | { ok: true; updatedAt: Date; id: string }
  | { ok: false; code: "invalid_cursor_encoding"; message: string } {
  let parsed: unknown;
  try {
    const json = Buffer.from(raw, "base64url").toString("utf8");
    parsed = JSON.parse(json) as unknown;
  } catch {
    return { ok: false, code: "invalid_cursor_encoding", message: "cursor is not valid base64url JSON" };
  }
  if (!parsed || typeof parsed !== "object") {
    return { ok: false, code: "invalid_cursor_encoding", message: "cursor payload must be an object" };
  }
  const u = (parsed as LessonListCursorPayload).u;
  const i = (parsed as LessonListCursorPayload).i;
  if (typeof u !== "string" || typeof i !== "string" || !i.trim()) {
    return { ok: false, code: "invalid_cursor_encoding", message: "cursor must include string fields u (ISO date) and i (id)" };
  }
  const updatedAt = new Date(u);
  if (Number.isNaN(updatedAt.getTime())) {
    return { ok: false, code: "invalid_cursor_encoding", message: "cursor field u is not a valid ISO date" };
  }
  return { ok: true, updatedAt, id: i };
}

/** Rows strictly after `cursor` in sort order (updatedAt desc, id desc). */
export function lessonListKeysetWhereAfter(cursor: { updatedAt: Date; id: string }): Prisma.ContentItemWhereInput {
  return {
    OR: [{ updatedAt: { lt: cursor.updatedAt } }, { AND: [{ updatedAt: cursor.updatedAt }, { id: { lt: cursor.id } }] }],
  };
}

export const LESSON_LIST_ORDER_BY: Prisma.ContentItemOrderByWithRelationInput[] = [{ updatedAt: "desc" }, { id: "desc" }];
