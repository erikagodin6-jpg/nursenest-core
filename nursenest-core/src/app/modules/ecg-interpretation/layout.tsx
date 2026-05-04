import type { ReactNode } from "react";
import type { Metadata } from "next";
import { requireEcgModuleAccess } from "@/lib/ecg-module/ecg-module.server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function EcgInterpretationLayout({ children }: { children: ReactNode }) {
  await requireEcgModuleAccess();
  return children;
}
