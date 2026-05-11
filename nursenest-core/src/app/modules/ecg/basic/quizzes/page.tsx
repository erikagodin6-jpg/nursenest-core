import { EcgModulePage } from "@/components/ecg-module/ecg-module-page";
import { ECG_ROUTE_CONFIGS } from "@/lib/ecg-module/ecg-module-config";
import { getCurrentEcgModuleAccess } from "@/lib/ecg-module/ecg-module.server";

export default async function EcgBasicQuizzesPage() {
  const access = await getCurrentEcgModuleAccess();
  return <EcgModulePage config={ECG_ROUTE_CONFIGS["/modules/ecg/basic/quizzes"]} accessState={access.ok ? access.accessState : "basic_only"} />;
}

