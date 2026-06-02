import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PremiumLayoutVersionMarker } from "@/components/layout/premium-layout-version-marker";
import { traceLayout } from "@/build/tracing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hemodynamic Monitoring Fundamentals | NurseNest",
  description:
    "Hemodynamic Monitoring Fundamentals: perfusion, preload, afterload, MAP, arterial lines, CVP, cardiac output, and shock states. Included with eligible RN and NP subscriptions.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

const HemodynamicsLayout = traceLayout(
  import.meta,
  function HemodynamicsLayout({ children }: { children: ReactNode }) {
    return (
      <>
        <PremiumLayoutVersionMarker surface="hemodynamics-module" />
        {children}
      </>
    );
  },
  { name: "HemodynamicsLayout" },
);

export default HemodynamicsLayout;
