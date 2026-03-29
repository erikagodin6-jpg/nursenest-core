import type { Metadata } from "next";
import { ToolsHubClient } from "@/components/tools/tools-hub-client";

export const metadata: Metadata = {
  title: "Clinical tools | NurseNest",
  description: "Free nursing calculators: medication math, lab reference, and ABG interpretation practice.",
  alternates: { canonical: "/tools" },
};

export default function ToolsHubPage() {
  return <ToolsHubClient />;
}
