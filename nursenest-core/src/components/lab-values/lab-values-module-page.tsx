import { findLabValuesModule, type LabValuesLevel } from "@/lib/lab-values/lab-values-module";

export function LabValuesModulePage({ level }: { level: LabValuesLevel }) {
  const module = findLabValuesModule(level);
  if (!module) return null;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8" data-testid={`lab-values-preview-${level}`}>
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
        <strong>Hidden / Admin Preview Only.</strong> Not visible to public users. Not in sitemap, hreflang, public
        navigation, pricing, or checkout.
      </div>

      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
          Lab Values Mastery / {module.level}
        </p>
        <h1 className="text-3xl font-bold tracking-normal text-[var(--semantic-text-primary)] sm:text-4xl">
          {module.title}
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-[var(--semantic-text-secondary)]">{module.description}</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card title="Future access" items={[module.futureAccess === "free" ? "Future free track" : "Future paid track", module.entitlementKey]} />
        <Card title="Quizzes" items={module.quizFocus} />
        <Card title="Pattern maps" items={module.patternMaps} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card title="Lessons" items={module.lessons} />
        <Card title="Case scenarios" items={module.caseScenarios} />
        <Card title="Rapid drills" items={module.rapidDrills.length ? module.rapidDrills : ["Advanced-only timed pattern recognition"]} />
        <Card title="Worksheets" items={module.worksheets} />
      </section>

      {module.nursingActionLayer.length > 0 ? <Card title="Nursing action layer" items={module.nursingActionLayer} /> : null}
    </main>
  );
}

function Card({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
      <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">{title}</h2>
      <ul className="mt-4 space-y-2 text-sm text-[var(--semantic-text-secondary)]">
        {items.map((item) => (
          <li key={item} className="rounded-lg bg-[var(--semantic-panel-muted)] px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
