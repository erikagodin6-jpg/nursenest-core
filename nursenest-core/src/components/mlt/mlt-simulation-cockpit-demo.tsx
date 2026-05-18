import { MLT_SIMULATION_STARTER_STATE } from "@/lib/mlt/mlt-simulation-types";
import { buildMltSimulationCockpitViewModel } from "@/lib/mlt/mlt-simulation-view-model";
import { MltSimulationCockpit } from "./mlt-simulation-cockpit";

export function MltSimulationCockpitDemo() {
  const viewModel = buildMltSimulationCockpitViewModel(MLT_SIMULATION_STARTER_STATE);

  return <MltSimulationCockpit viewModel={viewModel} />;
}

export default MltSimulationCockpitDemo;
