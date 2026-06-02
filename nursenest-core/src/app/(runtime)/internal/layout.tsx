import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { traceLayout } from "@/build/tracing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const InternalSegmentLayout = traceLayout(
  import.meta,
  function InternalSegmentLayout({ children }: { children: ReactNode }) {
    return (
      <div
      className="nn-marketing-surface min-h-screen bg-[var(--theme-bg)] px-4 py-4 text-[var(--theme-fg)] sm:px-6"
      data-nn-internal-premium-shell=""
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <header className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2.5 shadow-[var(--semantic-shadow-soft)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/app" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--semantic-text-primary)]">
              <SiteBrandLogoMark variant="learner" />
              <span>NurseNest Internal</span>
            </Link>
            <span className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-alt)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
              Operational Surface
            </span>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
  },
  { name: "InternalSegmentLayout" },
);

export default InternalSegmentLayout;
