import { NextResponse } from "next/server";

export type AdminJsonMutationIntent = { dryRun: boolean };

/**
 * Enforces explicit operator intent on JSON mutation bodies:
 * - `dryRun: true` — preview / validation only (route must not persist).
 * - `confirm: true` — execute writes.
 */
export function parseAdminJsonMutationIntent(body: unknown): AdminJsonMutationIntent | NextResponse {
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      {
        ok: false,
        error: "JSON body required with { confirm: true } to execute or { dryRun: true } for preview-only.",
      },
      { status: 400 },
    );
  }
  const o = body as Record<string, unknown>;
  const dryRun = o.dryRun === true;
  const confirm = o.confirm === true;
  if (dryRun) return { dryRun: true };
  if (confirm) return { dryRun: false };
  return NextResponse.json(
    {
      ok: false,
      error: "Mutation requires { confirm: true } to execute or { dryRun: true } for preview-only.",
    },
    { status: 400 },
  );
}

/** Strip control keys before passing the rest to a route-specific zod schema. */
export function stripAdminMutationControlFields<T extends Record<string, unknown>>(body: T): Omit<T, "confirm" | "dryRun"> {
  const { confirm: _c, dryRun: _d, ...rest } = body;
  return rest as Omit<T, "confirm" | "dryRun">;
}
