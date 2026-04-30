import type { Metadata } from "next";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function InternalSegmentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="nn-marketing-surface min-h-screen bg-[var(--theme-bg)] text-[var(--theme-fg)]">{children}</div>
  );
}
