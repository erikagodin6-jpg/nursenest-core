import { EcgModulePage } from "@/components/ecg-module/ecg-module-page";
import { ECG_ROUTE_CONFIGS } from "@/lib/ecg-module/ecg-module-config";

export default function EcgAdvancedVideoDrillsPage() {
  return <EcgModulePage config={ECG_ROUTE_CONFIGS["/modules/ecg/advanced/video-drills"]} />;
}

