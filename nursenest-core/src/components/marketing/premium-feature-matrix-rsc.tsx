import "server-only";

import { Suspense } from "react";
import { getCachedFeatureInventory, buildFeatureMatrixRows } from "@/lib/marketing/feature-inventory-metrics";
import { PremiumFeatureMatrix } from "@/components/marketing/premium-feature-matrix";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/** Skeleton while inventory loads — matches matrix dimensions */
function FeatureMatrixSkeleton() {
  return (
    <section aria-labelledby="feature-matrix-heading" data-testid="section-premium-feature-matrix">
      <div className="mb-8 text-center">
        <div className="mx-auto h-6 w-48 animate-pulse rounded-full bg-[color-mix(in_srgb,var(--palette-primary)_10%,var(--semantic-border-soft))]" />
        <div className="mx-auto mt-4 h-8 w-72 animate-pulse rounded-md bg-[color-mix(in_srgb,var(--palette-primary)_8%,var(--semantic-border-soft))]" />
        <div className="mx-auto mt-2 h-4 w-96 max-w-[90%] animate-pulse rounded-md bg-[color-mix(in_srgb,var(--palette-primary)_5%,var(--semantic-border-soft))]" />
      </div>
      <div className="rounded-2xl border border-[var(--semantic-border-soft)]">
        <div className="flex items-stretch border-b border-[var(--semantic-border-soft)] px-4 py-3.5">
          <div className="flex-[2]">
            <div className="h-3 w-16 animate-pulse rounded-md bg-[color-mix(in_srgb,var(--palette-primary)_10%,var(--semantic-border-soft))]" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-1 justify-center">
              <div className="h-3 w-14 animate-pulse rounded-md bg-[color-mix(in_srgb,var(--palette-primary)_10%,var(--semantic-border-soft))]" />
            </div>
          ))}
        </div>
        {[1, 2, 3, 4, 5, 6].map((group) => (
          <div key={group}>
            <div className="flex items-center border-b border-[var(--semantic-border-soft)] px-4 py-2.5">
              <div className="h-3 w-28 animate-pulse rounded-md bg-[color-mix(in_srgb,var(--palette-primary)_6%,var(--semantic-border-soft))]" />
            </div>
            {[1, 2, 3, 4].map((row) => (
              <div
                key={row}
                className="flex items-stretch border-b border-[var(--semantic-border-soft)] px-4 py-3"
              >
                <div className="flex-[2]">
                  <div className="h-4 w-36 animate-pulse rounded-md bg-[color-mix(in_srgb,var(--palette-primary)_6%,var(--semantic-border-soft))]" />
                  <div className="mt-1 h-3 w-52 animate-pulse rounded-md bg-[color-mix(in_srgb,var(--palette-primary)_4%,var(--semantic-border-soft))]" />
                </div>
                {[1, 2, 3, 4, 5].map((c) => (
                  <div key={c} className="flex flex-1 justify-center">
                    <div className="h-5 w-5 animate-pulse rounded-md bg-[color-mix(in_srgb,var(--palette-primary)_6%,var(--semantic-border-soft))]" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * RSC wrapper that loads the feature inventory and renders the Premium Feature Matrix.
 * Uses the cached inventory service — no DB hit on each render.
 * Falls back gracefully to skeleton on error.
 */
async function FeatureMatrixContent() {
  try {
    const inventory = await getCachedFeatureInventory();
    const rows = buildFeatureMatrixRows(inventory);
    return <PremiumFeatureMatrix rows={rows} />;
  } catch (error) {
    safeServerLog("marketing", "feature_matrix_rsc_error", {
      error: error instanceof Error ? error.message.slice(0, 300) : String(error).slice(0, 300),
    });
    return null;
  }
}

export function PremiumFeatureMatrixRsc() {
  return (
    <Suspense fallback={<FeatureMatrixSkeleton />}>
      <FeatureMatrixContent />
    </Suspense>
  );
}