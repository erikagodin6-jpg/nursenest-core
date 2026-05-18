import { buildMltGramStainDrillViewModel } from "@/lib/mlt/mlt-gram-stain-drill-view-model";
import { MltGramStainDrillPanel } from "./mlt-gram-stain-drill-panel";

export function MltGramStainDrillDemo() {
  const viewModel = buildMltGramStainDrillViewModel();

  return <MltGramStainDrillPanel viewModel={viewModel} />;
}

export default MltGramStainDrillDemo;
