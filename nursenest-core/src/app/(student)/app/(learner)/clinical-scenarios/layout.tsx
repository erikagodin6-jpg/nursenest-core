import type { Metadata } from "next";
import type { ReactNode } from "react";
import { clinicalScenariosRobotsMetadata } from "@/lib/clinical-scenarios/clinical-scenarios-metadata";
import { requireClinicalScenariosLearnerShellAccess } from "@/lib/clinical-scenarios/clinical-scenario-learner-layout-gate.server";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Clinical scenarios",
    robots: clinicalScenariosRobotsMetadata(),
  };
}

export default async function ClinicalScenariosLearnerLayout({ children }: { children: ReactNode }) {
  await requireClinicalScenariosLearnerShellAccess();
  return <>{children}</>;
}
