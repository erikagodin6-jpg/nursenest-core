import {
  buildSpectrumHeatmap
} from "@/src/lib/prescribing/spectrum-heatmap";

const heatmap = buildSpectrumHeatmap();

function tone(score: number) {
  if (score >= 3) {
    return "bg-emerald-500/30 text-emerald-50 border-emerald-400/20";
  }

  if (score >= 2) {
    return "bg-cyan-500/25 text-cyan-50 border-cyan-400/20";
  }

  if (score >= 1) {
    return "bg-amber-500/25 text-amber-50 border-amber-400/20";
  }

  return "bg-zinc-500/10 text-zinc-300 border-white/10";
}

export function AntibioticSpectrumHeatmap() {
  return (
    <section className="rounded-3xl border border-white/10 bg-[var(--semantic-card-background)] p-8 shadow-2xl">
      <div className="max-w-3xl">
        <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-cyan-100">
          Antibiotic Spectrum Heatmap
        </div>

        <h2 className="mt-5 text-4xl font-black tracking-tight">
          Visualize antibiotic coverage patterns.
        </h2>

        <p className="mt-5 text-base leading-8 text-[var(--semantic-muted-foreground)]">
          Learn how clinicians think about spectrum coverage, resistance risk,
          and stewardship escalation.
        </p>
      </div>

      <div className="mt-10 overflow-x-auto">
        <div className="min-w-[900px] space-y-4">
          {heatmap.map((row) => (
            <div
              key={row.antibioticId}
              className="grid grid-cols-[220px_repeat(6,minmax(110px,1fr))] gap-3"
            >
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <div className="font-semibold">
                  {row.antibioticName}
                </div>
              </div>

              {row.cells.map((cell) => (
                <div
                  key={`${row.antibioticId}-${cell.target}`}
                  className={`rounded-2xl border p-4 text-center ${tone(
                    cell.score
                  )}`}
                >
                  <div className="text-xs font-bold uppercase tracking-wide opacity-70">
                    {cell.label}
                  </div>

                  <div className="mt-2 text-sm font-semibold capitalize">
                    {String(cell.strength).replaceAll("-", " ")}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
