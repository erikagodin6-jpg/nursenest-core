import { isClinicalScenariosPubliclyEnabled } from "@/lib/clinical-scenarios/clinical-scenarios-feature-flag";

/** Marketing exam-hub clinical scenario pages: blocked in production when the flag is off. */
export function clinicalScenarioMarketingPageBlocked(): boolean {
  if (isClinicalScenariosPubliclyEnabled()) return false;
  return process.env.NODE_ENV === "production";
}
