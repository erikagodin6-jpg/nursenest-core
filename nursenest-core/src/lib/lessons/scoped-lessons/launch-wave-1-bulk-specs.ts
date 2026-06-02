/**
 * Launch Wave 1 — thirteen bulk scoped gold lessons built from `BULK_ROWS` + {@link bulkRowToSpec}.
 * Together with `launch-wave-1a-high-yield-gold.ts` (DKA/HHS), adds **14** injectable slugs to the registry.
 */
import { bulkRowToSpec } from "@/lib/lessons/scoped-lessons/launch-wave-1-bulk-builder";
import { BULK_ROWS } from "@/lib/lessons/scoped-lessons/launch-wave-1-bulk-rows";
import {
  wave1ProviderFromSpec,
  type Wave1ScopedGoldProvider,
} from "@/lib/lessons/scoped-lessons/launch-wave-1-shared";

export const LAUNCH_WAVE_1_BULK_SPECS = BULK_ROWS.map(bulkRowToSpec);

export const LAUNCH_WAVE_1_BULK_PROVIDERS: Wave1ScopedGoldProvider[] = LAUNCH_WAVE_1_BULK_SPECS.map(wave1ProviderFromSpec);
