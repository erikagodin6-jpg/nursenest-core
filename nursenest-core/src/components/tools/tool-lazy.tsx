"use client";

import type { ComponentType } from "react";
import dynamic from "next/dynamic";
import type { ToolSlug } from "@/lib/tools/tool-registry";

const loaders: Record<ToolSlug, () => Promise<{ default: ComponentType }>> = {
  "med-math": () => import("./calculators/med-math-tool"),
  "lab-values": () => import("./calculators/lab-values-tool"),
  "electrolyte-abg": () => import("./calculators/electrolyte-abg-tool"),
  "iv-infusion": () => import("./calculators/iv-infusion-tool"),
  "transfusion-safety": () => import("./calculators/transfusion-safety-tool"),
};

export function ToolLazyView({ slug }: { slug: ToolSlug }) {
  const load = loaders[slug];
  const Cmp = dynamic(load, { loading: () => <div className="min-h-[12rem] rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-6 text-sm text-[var(--theme-muted-text)]" /> });
  return <Cmp />;
}
