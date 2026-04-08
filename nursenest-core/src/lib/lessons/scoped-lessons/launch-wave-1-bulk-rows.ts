import { ROWS_A } from "@/lib/lessons/scoped-lessons/launch-wave-1-bulk-rows-a";
import { ROWS_B } from "@/lib/lessons/scoped-lessons/launch-wave-1-bulk-rows-b";
import type { BulkRow } from "@/lib/lessons/scoped-lessons/launch-wave-1-bulk-builder";

/** Thirteen scoped gold lessons (Launch Wave 1 bulk). Pair with `launch-wave-1a` (DKA/HHS) for 14 total new injectables. */
export const BULK_ROWS: BulkRow[] = [...ROWS_A, ...ROWS_B];
