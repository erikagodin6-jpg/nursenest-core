import { PreNursingVisualLearningBlock } from "@/components/pre-nursing/pre-nursing-visual-learning-block";

export function OxygenationPerfusionVisualLearningBlock() {
  return (
    <PreNursingVisualLearningBlock
      title="Oxygenation and perfusion flow"
      description="Follow the path of oxygen from the environment to the tissues, then connect perfusion failure to tissue hypoxia and lactate production."
      clinicalConnection="Nurses constantly monitor whether oxygen can reach tissues effectively. Oxygenation problems can occur in the lungs, circulation, blood, or cellular environment."
      steps={[
        {
          id: "airway",
          label: "Air enters the airway",
          description:
            "Oxygen travels through the nose or mouth into the trachea and bronchi before reaching the alveoli.",
        },
        {
          id: "alveoli",
          label: "Gas exchange occurs",
          description:
            "Oxygen crosses the alveolar-capillary membrane into the bloodstream while carbon dioxide moves out.",
        },
        {
          id: "hemoglobin",
          label: "Hemoglobin transports oxygen",
          description:
            "Red blood cells carry oxygen through systemic circulation toward tissues with metabolic demand.",
        },
        {
          id: "perfusion",
          label: "Perfusion delivers oxygen",
          description:
            "Adequate blood pressure and cardiac output are required to move oxygenated blood into tissues.",
        },
        {
          id: "cellular-respiration",
          label: "Cells produce ATP",
          description:
            "Oxygen supports aerobic metabolism and high-yield ATP production inside mitochondria.",
        },
        {
          id: "hypoxia",
          label: "Hypoxia disrupts energy production",
          description:
            "When oxygen delivery fails, lactate can rise and tissues may shift toward anaerobic metabolism.",
        },
      ]}
    >
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-info)_7%,var(--semantic-surface))] p-4 text-center">
          <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--semantic-info)]">
            Oxygenation
          </p>
          <p className="m-0 text-sm font-semibold text-[var(--theme-heading-text)]">
            Moving oxygen into the bloodstream
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-success)_7%,var(--semantic-surface))] p-4 text-center">
          <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--semantic-success)]">
            Perfusion
          </p>
          <p className="m-0 text-sm font-semibold text-[var(--theme-heading-text)]">
            Delivering oxygenated blood to tissues
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-warning)_7%,var(--semantic-surface))] p-4 text-center">
          <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--semantic-warning)]">
            Cellular energy
          </p>
          <p className="m-0 text-sm font-semibold text-[var(--theme-heading-text)]">
            Oxygen supports ATP production
          </p>
        </div>
      </div>
    </PreNursingVisualLearningBlock>
  );
}
