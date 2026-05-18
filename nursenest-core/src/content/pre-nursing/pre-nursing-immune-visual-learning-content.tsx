import { PreNursingVisualLearningBlock } from "@/components/pre-nursing/pre-nursing-visual-learning-block";

export function ImmuneInflammationVisualLearningBlock() {
  return (
    <PreNursingVisualLearningBlock
      title="Inflammation and immune response flow"
      description="Follow how the body recognizes tissue irritation or infection, recruits immune defenses, and creates the classic signs of inflammation."
      clinicalConnection="Inflammation helps explain fever, swelling, redness, pain, wound healing, immune-system activation, and infection-control priorities."
      steps={[
        {
          id: "trigger",
          label: "Tissue detects a trigger",
          description: "Cells recognize injury, microbes, irritants, or damaged tissue and release chemical signals.",
        },
        {
          id: "vasodilation",
          label: "Blood vessels dilate",
          description: "More blood flow brings immune cells and nutrients to the area, causing warmth and redness.",
        },
        {
          id: "permeability",
          label: "Vessels become more permeable",
          description: "Fluid and immune proteins move into tissues, which can cause swelling and pressure.",
        },
        {
          id: "immune-cells",
          label: "Immune cells arrive",
          description: "Neutrophils, macrophages, and other cells help contain and clear the trigger.",
        },
        {
          id: "body-response",
          label: "Body-wide signs may appear",
          description: "Temperature, heart rate, energy level, and lab values can change when the response becomes broader.",
        },
        {
          id: "resolution",
          label: "Healing follows regulation",
          description: "The inflammatory response should quiet after the trigger is controlled and tissue repair begins.",
        },
      ]}
    >
      <div className="grid gap-3 md:grid-cols-4">
        <ImmuneTile label="Heat" description="Increased blood flow" />
        <ImmuneTile label="Redness" description="Vasodilation" />
        <ImmuneTile label="Swelling" description="Fluid movement" />
        <ImmuneTile label="Pain" description="Pressure + mediators" />
      </div>
    </PreNursingVisualLearningBlock>
  );
}

function ImmuneTile({ label, description }: { label: string; description: string }) {
  return (
    <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-warning)_7%,var(--semantic-surface))] p-4 text-center">
      <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--semantic-warning)]">
        {label}
      </p>
      <p className="m-0 text-sm font-semibold text-[var(--theme-heading-text)]">
        {description}
      </p>
    </div>
  );
}
