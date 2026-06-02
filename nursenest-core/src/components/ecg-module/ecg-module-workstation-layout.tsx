"use client";

import type { ReactNode } from "react";
import { EcgWorkstationShell } from "@/components/ecg-module/ecg-workstation-shell";

export function EcgModuleWorkstationLayout({ children }: { children: ReactNode }) {
  return <EcgWorkstationShell>{children}</EcgWorkstationShell>;
}
