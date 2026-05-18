import { ANTIBIOTIC_REGISTRY } from "@/src/lib/prescribing/antibiotic-registry";

function coverageTone(value: string) {
  switch (value) {
    case "strong":
      return "bg-emerald-500/20 text-emerald-200 border-emerald-400/30";
    case "moderate":
      return "bg-blue-500/20 text-blue-200 border-blue-400/30";
    case "weak":
      return "bg-amber-500/20 text-amber-100 border-amber-400/30";
    default:
      return "bg-zinc-500/10 text-zinc-300 border-zinc-400/20";
  }
}

export function AntibioticCoverageMatrix() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {ANTIBIOTIC_REGISTRY.map((antibiotic) => (
        <article
          key={antibiotic.id}
          className="rounded-3xl border border-white/10 bg-[var(--semantic-card-background)] p-6 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-[var(--semantic-foreground)]">
                {antibiotic.name}
              </h3>
              <p className="mt-1 text-sm text-[var(--semantic-muted-foreground)]">
                {antibiotic.className}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {antibiotic.mrsa ? (
                <span className="rounded-full border border-rose-400/30 bg-rose-500/20 px-3 py-1 text-xs font-medium text-rose-100">
                  MRSA
                </span>
              ) : null}

              {antibiotic.pseudomonas ? (
                <span className="rounded-full border border-cyan-400/30 bg-cyan-500/20 px-3 py-1 text-xs font-medium text-cyan-100">
                  Pseudomonas
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              ["Gram +", antibiotic.gramPositive],
              ["Gram -", antibiotic.gramNegative],
              ["Anaerobes", antibiotic.anaerobes],
              ["Atypicals", antibiotic.atypicals]
            ].map(([label, value]) => (
              <div
                key={label}
                className={`rounded-2xl border px-4 py-3 ${coverageTone(
                  String(value)
                )}`}
              >
                <div className="text-xs uppercase tracking-wide opacity-70">
                  {label}
                </div>
                <div className="mt-1 text-sm font-semibold capitalize">
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-amber-100">
              Stewardship Pearl
            </div>
            <p className="mt-2 text-sm text-amber-50/90">
              {antibiotic.stewardshipNote}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
