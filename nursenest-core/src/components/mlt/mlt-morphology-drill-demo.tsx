import { buildMltMorphologyDrillViewModel } from "@/lib/mlt/mlt-morphology-drill-view-model";
import { MltMorphologyDrillPanel } from "./mlt-morphology-drill-panel";

export function MltMorphologyDrillDemo() {
  const viewModel = buildMltMorphologyDrillViewModel();

  return <MltMorphologyDrillPanel viewModel={viewModel} />;
}

export default MltMorphologyDrillDemo;
