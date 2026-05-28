"use client";

import type { ReactNode } from "react";
import { EcgWorkstationMobileStrip, EcgWorkstationSidebar } from "@/components/ecg-module/ecg-workstation-sidebar";

export function EcgWorkstationShell({ children }: { children: ReactNode }) {
  return (
    <div className="nn-ecg-workstation" data-nn-ecg-workstation="">
      <div className="nn-ecg-workstation__frame">
        <EcgWorkstationSidebar />
        <div className="nn-ecg-workstation__main">
          <EcgWorkstationMobileStrip />
          {children}
        </div>
      </div>
    </div>
  );
}
