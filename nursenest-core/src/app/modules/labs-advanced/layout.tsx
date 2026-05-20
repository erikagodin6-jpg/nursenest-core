import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PremiumLayoutVersionMarker } from "@/components/layout/premium-layout-version-marker";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Advanced Labs Interpretation | NurseNest",
  description:
    "Advanced Labs Interpretation: CBC, BMP, LFTs, coagulation, lactate, ABG, cardiac markers, DKA, AKI, and critical care electrolytes. Premium add-on for RN and NP.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function AdvancedLabsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PremiumLayoutVersionMarker surface="advanced-labs-module" />
      {children}
    </>
  );
}
