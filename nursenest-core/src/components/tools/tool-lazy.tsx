"use client";

import dynamic from "next/dynamic";
import type { ToolSlug } from "@/lib/tools/tool-registry";

const loading = () => (
  <div className="min-h-[12rem] rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-6 text-sm text-[var(--theme-muted-text)]" />
);

/** Module-level `dynamic()` keeps chunk IDs stable for Turbopack (avoid `dynamic()` inside render). */
const MedMathTool = dynamic(() => import("./calculators/med-math-tool"), { loading });
const LabValuesTool = dynamic(() => import("./calculators/lab-values-tool"), { loading });
const ElectrolyteAbgTool = dynamic(() => import("./calculators/electrolyte-abg-tool"), { loading });
const IvInfusionTool = dynamic(() => import("./calculators/iv-infusion-tool"), { loading });
const TransfusionSafetyTool = dynamic(() => import("./calculators/transfusion-safety-tool"), { loading });

export function ToolLazyView({ slug }: { slug: ToolSlug }) {
  switch (slug) {
    case "med-math":
      return <MedMathTool />;
    case "lab-values":
      return <LabValuesTool />;
    case "electrolyte-abg":
      return <ElectrolyteAbgTool />;
    case "iv-infusion":
      return <IvInfusionTool />;
    case "transfusion-safety":
      return <TransfusionSafetyTool />;
    default:
      return null;
  }
}
