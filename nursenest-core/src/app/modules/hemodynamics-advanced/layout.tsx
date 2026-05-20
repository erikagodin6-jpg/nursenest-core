import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PremiumLayoutVersionMarker } from "@/components/layout/premium-layout-version-marker";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Advanced Hemodynamic Monitoring | NurseNest",
  description:
    "Advanced Hemodynamic Monitoring: Swan-Ganz, cardiac index, SVR, SVV, PAOP/wedge pressure, mixed venous oxygen saturation, vasopressor reasoning, and ICU case simulations. Premium add-on for RN and NP.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function AdvancedHemodynamicsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PremiumLayoutVersionMarker surface="advanced-hemodynamics-module" />
      {children}
    </>
  );
}
