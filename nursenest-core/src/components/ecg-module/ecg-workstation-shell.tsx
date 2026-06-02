"use client";

import type { ReactNode } from "react";
import { EcgWorkstationMobileStrip, EcgWorkstationSidebar } from "@/components/ecg-module/ecg-workstation-sidebar";
import { LearningModuleShell } from "@/components/learner-modules/learning-module-shell";

export function EcgWorkstationShell({ children }: { children: ReactNode }) {
  return (
    <LearningModuleShell
      className="nn-ecg-workstation"
      legacyRootDataAttribute="data-nn-ecg-workstation"
      moduleKey="ecg"
      sidebar={<EcgWorkstationSidebar />}
      mobileStrip={<EcgWorkstationMobileStrip />}
    >
      {children}
    </LearningModuleShell>
  );
}
