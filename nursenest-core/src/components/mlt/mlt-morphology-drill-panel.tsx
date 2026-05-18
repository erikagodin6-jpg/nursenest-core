import type { MltMorphologyDrillCard, MltMorphologyDrillViewModel } from "@/lib/mlt/mlt-morphology-drill-view-model";

const difficultyLabel: Record<MltMorphologyDrillCard["difficulty"], string> = {
  intro: "Intro",
  core: "Core",
  exam: "Exam",
};

const difficultyClassName: Record<MltMorphologyDrillCard["difficulty"], string> = {
  intro: "border-sky-200 bg-sky-50 text-sky-950",
  core: "border-violet-200 bg-violet-50 text-violet-950",
  exam: "border-rose-200 bg-rose-50 text-rose-950",
};

function TagList({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function MorphologyDrillCard({ card }: { card: MltMorphologyDrillCard }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">RBC morphology drill</p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{card.answer}</h3>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase shadow-sm ${difficultyClassName[card.difficulty]}`}>
          {difficultyLabel[card.difficulty]}
        </span>
      </div>

      <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{card.prompt}</p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <TagList label="Associated conditions" items={card.associatedConditions} />
        <TagList label="Differentiate from" items={card.differentialMorphologies} />
        <TagList label="Workflow implications" items={card.workflowImplications} />
        <TagList label="Escalation triggers" items={card.escalationTriggers} />
      </div>

      <p className="mt-5 text-sm leading-6 text-slate-600">{card.clinicalMeaning}</p>
    </article>
  );
}

export function MltMorphologyDrillPanel({ viewModel }: { viewModel: MltMorphologyDrillViewModel }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-slate-50/70 p-5 shadow-sm md:p-8" data-testid="mlt-morphology-drill-panel">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase">MLS / MLT morphology lab</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">RBC morphology reasoning drills</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Practice morphology recognition with differential reasoning, clinical correlation, and workflow escalation prompts.
          </p>
        </div>
        <div className="rounded-2xl border border-white bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
          {viewModel.totalCards} drill cards · {viewModel.highEscalationCount} escalation-linked
        </div>
      </header>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {viewModel.drillCards.map((card) => (
          <MorphologyDrillCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}

export default MltMorphologyDrillPanel;
