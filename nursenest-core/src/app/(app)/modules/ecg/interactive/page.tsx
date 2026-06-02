import type { Metadata } from "next";
import { EcgInteractiveEcosystemClient } from "@/components/ecg-module/ecg-interactive-ecosystem-client";

export const metadata: Metadata = {
  title: "Interactive ECG clinical reasoning | NurseNest",
  description: "Detective mode, compare-and-contrast, telemetry shift simulation, deterioration pathways, clearances, report cards, and adaptive ECG remediation.",
  robots: { index: false, follow: true },
};

export default function EcgInteractiveEcosystemPage() {
  return <EcgInteractiveEcosystemClient />;
}
