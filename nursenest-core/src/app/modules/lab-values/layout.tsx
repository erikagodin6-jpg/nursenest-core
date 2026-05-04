import type { Metadata } from "next";
import type { ReactNode } from "react";
import { requireLabValuesModuleAccess } from "@/lib/lab-values/lab-values-module.server";

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

export default async function LabValuesModuleLayout({ children }: { children: ReactNode }) {
  await requireLabValuesModuleAccess();
  return children;
}
