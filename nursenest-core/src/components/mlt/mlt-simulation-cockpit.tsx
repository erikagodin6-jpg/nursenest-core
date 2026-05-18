import type { MltSimulationCockpitCard, MltSimulationCockpitViewModel, MltSimulationSeverity } from "@/lib/mlt/mlt-simulation-view-model";

const severityLabel: Record<MltSimulationSeverity, string> = {
  stable: "Stable",
  watch: "Watch",
  urgent: "Urgent",
  critical: "Critical",
};

const severityClassName: Record<MltSimulationSeverity, string> = {
  stable: "border-emerald-200 bg-emerald-50 text-emerald-950",
  watch: "border-sky-200 bg-sky-50 text-sky-950",
  urgent: "border-amber-200 bg-amber-50 text-amber-950",
  critical: "border-rose-200 bg-rose-50 text-rose-950",
};

function CardGrid({ title, cards }: { title: string; cards: MltSimulationCockpitCard[] }) {
  if (cards.length === 0) return null;

  return (
    <section className="space-y-3" aria-label={title}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold tracking-[0.18em] text-slate-500 uppercase">{title}</h3>
        <span className="text-xs font-medium text-slate-500">{cards.length} active</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <article key={card.id} className={`rounded-2xl border p-4 shadow-sm ${severityClassName[card.severity]}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] uppercase opacity-75">{card.label}</p>
                <p className="mt-1 text-lg font-semibold">{card.value}</p>
              </div>
              <span className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase shadow-sm">
                {severityLabel[card.severity]}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 opacity-85">{card.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function MltSimulationCockpit({ viewModel }: { viewModel: MltSimulationCockpitViewModel }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-8" data-testid="mlt-simulation-cockpit">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase">MLS / MLT simulation cockpit</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">Laboratory operations snapshot</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Monitor analyzers, specimens, critical events, and unresolved workflow decisions in one simulation-ready view.
          </p>
        </div>
        <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold shadow-sm ${severityClassName[viewModel.overallSeverity]}`}>
          Overall status: {severityLabel[viewModel.overallSeverity]}
        </div>
      </header>

      <div className="mt-6 space-y-8">
        <CardGrid title="Simulation summary" cards={viewModel.summaryCards} />
        <CardGrid title="Analyzers" cards={viewModel.analyzerCards} />
        <CardGrid title="Specimens" cards={viewModel.specimenCards} />
        <CardGrid title="Critical events" cards={viewModel.criticalEventCards} />
        <CardGrid title="Pending decisions" cards={viewModel.pendingDecisionCards} />
      </div>
    </div>
  );
}

export default MltSimulationCockpit;
