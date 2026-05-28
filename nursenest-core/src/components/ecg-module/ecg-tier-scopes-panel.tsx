const TIERS = [
  {
    id: "rn",
    label: "RN — acute telemetry",
    accent: "var(--semantic-danger)",
    focus: ["Unstable rhythm recognition", "ACLS integration", "Telemetry escalation", "Hemodynamic significance"],
    signals: ["Wide-complex tachycardia recognition", "Telemetry escalation timing"],
  },
  {
    id: "rpn",
    label: "RPN/LPN — rhythm safety",
    accent: "var(--semantic-warning)",
    focus: ["Foundational rhythm ID", "Symptom recognition", "Safe escalation", "Monitoring communication"],
    signals: ["Sinus rhythm interpretation", "PR interval measurement reinforcement"],
  },
  {
    id: "np",
    label: "NP — advanced reasoning",
    accent: "var(--semantic-chart-4)",
    focus: ["Conduction pathology", "Ischemia correlation", "Mechanism analysis", "Treatment-pathway decisions"],
    signals: ["Electrophysiology reasoning", "Advanced conduction differentiation"],
  },
] as const;

export function EcgTierScopesPanel() {
  return (
    <section className="grid gap-4 lg:grid-cols-3" aria-label="Tier-scoped ECG pathways">
      {TIERS.map((tier) => (
        <article
          key={tier.id}
          className="rounded-xl border p-5"
          style={{
            borderColor: `color-mix(in srgb, ${tier.accent} 22%, var(--semantic-border-soft))`,
            background: `color-mix(in srgb, ${tier.accent} 5%, var(--semantic-surface))`,
          }}
        >
          <h3 className="text-sm font-bold text-[var(--semantic-text-primary)]">{tier.label}</h3>
          <ul className="mt-3 space-y-1 text-xs text-[var(--semantic-text-secondary)]">
            {tier.focus.map((f) => (
              <li key={f}>• {f}</li>
            ))}
          </ul>
          <p className="mt-4 text-[10px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">Report card signals</p>
          <ul className="mt-1 space-y-1 text-xs text-[var(--semantic-text-secondary)]">
            {tier.signals.map((s) => (
              <li key={s}>↳ {s}</li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}
