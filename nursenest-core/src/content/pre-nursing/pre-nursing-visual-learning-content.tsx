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

export function CardiovascularBloodFlowVisualLearningBlock() {
  return (
    <PreNursingVisualLearningBlock
      title="Blood flow through the heart"
      description="Trace how blood moves from the body to the lungs, back to the heart, and out to systemic circulation."
      clinicalConnection="Understanding blood flow helps learners connect heart failure, low cardiac output, poor perfusion, cyanosis, and oxygen delivery problems."
      steps={[
        {
          id: "systemic-return",
          label: "Blood returns from the body",
          description:
            "Deoxygenated blood returns through the superior and inferior vena cava into the right atrium.",
        },
        {
          id: "right-ventricle",
          label: "Right ventricle pumps to lungs",
          description:
            "Blood moves through the tricuspid valve into the right ventricle, then through the pulmonary valve into the pulmonary artery.",
        },
        {
          id: "lungs",
          label: "Lungs reload oxygen",
          description:
            "In pulmonary capillaries, carbon dioxide leaves the blood and oxygen binds to hemoglobin.",
        },
        {
          id: "left-atrium",
          label: "Oxygenated blood returns",
          description:
            "Pulmonary veins return oxygenated blood to the left atrium.",
        },
        {
          id: "left-ventricle",
          label: "Left ventricle pumps to body",
          description:
            "Blood moves through the mitral valve into the left ventricle, then through the aortic valve into the aorta.",
        },
        {
          id: "systemic-delivery",
          label: "Tissues receive oxygen",
          description:
            "Systemic arteries and capillaries deliver oxygen and nutrients to cells throughout the body.",
        },
      ]}
    >
      <div className="grid gap-3 md:grid-cols-4">
        {[
          ["Right heart", "Receives deoxygenated blood"],
          ["Pulmonary circuit", "Reloads oxygen in lungs"],
          ["Left heart", "Pumps oxygenated blood"],
          ["Systemic circuit", "Delivers to tissues"],
        ].map(([label, description]) => (
          <div
            key={label}
            className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-center"
          >
            <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--semantic-brand)]">
              {label}
            </p>
            <p className="m-0 text-sm font-semibold text-[var(--theme-heading-text)]">
              {description}
            </p>
          </div>
        ))}
      </div>
    </PreNursingVisualLearningBlock>
  );
}

export function FluidShiftVisualLearningBlock() {
  return (
    <PreNursingVisualLearningBlock
      title="Fluid shifts and osmosis"
      description="Visualize how water moves between spaces when solute concentration changes."
      clinicalConnection="Fluid shifts explain dehydration, edema, sodium imbalance, IV fluid effects, and neurologic risk when osmolality changes too quickly."
      steps={[
        {
          id: "compartments",
          label: "Fluid lives in compartments",
          description:
            "Water is distributed inside cells, outside cells, and inside blood vessels.",
        },
        {
          id: "solute",
          label: "Solute creates pull",
          description:
            "Dissolved particles such as sodium influence where water tends to move.",
        },
        {
          id: "osmosis",
          label: "Water moves toward higher solute",
          description:
            "Across semipermeable membranes, water shifts toward the side with greater solute concentration.",
        },
        {
          id: "hypotonic",
          label: "Hypotonic fluid moves water into cells",
          description:
            "Cells can swell when the surrounding fluid has a lower solute concentration.",
        },
        {
          id: "hypertonic",
          label: "Hypertonic fluid pulls water out",
          description:
            "Cells can shrink when the surrounding fluid has a higher solute concentration.",
        },
        {
          id: "clinical-risk",
          label: "Rapid shifts can be dangerous",
          description:
            "Brain cells are especially sensitive to rapid sodium and water shifts.",
        },
      ]}
    >
      <div className="grid gap-3 md:grid-cols-3">
        {[
          ["Hypotonic", "Water into cells"],
          ["Isotonic", "No major net shift"],
          ["Hypertonic", "Water out of cells"],
        ].map(([label, description]) => (
          <div
            key={label}
            className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-info)_6%,var(--semantic-surface))] p-4 text-center"
          >
            <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--semantic-info)]">
              {label}
            </p>
            <p className="m-0 text-sm font-semibold text-[var(--theme-heading-text)]">
              {description}
            </p>
          </div>
        ))}
      </div>
    </PreNursingVisualLearningBlock>
  );
}
