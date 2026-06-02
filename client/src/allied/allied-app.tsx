import { AlliedLayout } from "./allied-layout";
import { AlliedRoutes } from "./allied-routes";
import { ParamedicRegionProvider } from "./contexts/paramedic-region-context";

export function AlliedApp() {
  return (
    <ParamedicRegionProvider>
      <AlliedLayout>
        <AlliedRoutes />
      </AlliedLayout>
    </ParamedicRegionProvider>
  );
}
