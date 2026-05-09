import type { ReactNode } from "react";
import type { Metadata } from "next";
import { EcgModulePublicationNotice } from "@/components/ecg-module/ecg-module-publication-notice";
import { requireEcgModuleAccess } from "@/lib/ecg-module/ecg-module.server";
import { getEcgModuleStatus } from "@/lib/ecg-module/ecg-module-status";
import { isEcgModuleEnabled } from "@/lib/ecg-module/ecg-module-config";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const enabled = isEcgModuleEnabled();
  const status = await getEcgModuleStatus();
  const published = enabled && status === "published";
  return {
    robots: published
      ? {
          index: false,
          follow: true,
          googleBot: { index: false, follow: true },
        }
      : {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        },
  };
}

export default async function EcgModuleLayout({ children }: { children: ReactNode }) {
  await requireEcgModuleAccess();
  return (
    <>
      <EcgModulePublicationNotice />
      {children}
    </>
  );
}
