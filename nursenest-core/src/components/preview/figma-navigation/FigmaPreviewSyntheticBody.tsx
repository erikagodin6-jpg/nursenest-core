import type { FigmaPreviewVariantId } from "./figma-preview-nav-types";

/**
 * Long synthetic marketing body so sticky nav + scroll affordances can be exercised in preview.
 */
export function FigmaPreviewSyntheticBody({ variant }: { variant: FigmaPreviewVariantId }) {
  const band =
    variant === "b"
      ? "from-[color-mix(in_srgb,var(--semantic-panel-cool)_22%,var(--background))] via-[var(--background)] to-[color-mix(in_srgb,var(--semantic-panel-warm)_18%,var(--background))]"
      : variant === "c"
        ? "from-[color-mix(in_srgb,var(--semantic-panel-positive)_12%,var(--background))] to-[var(--background)]"
        : "from-[var(--background)] to-[color-mix(in_srgb,var(--semantic-border-soft)_40%,var(--background))]";

  return (
    <div
      className="min-h-[220vh] bg-[var(--background)] text-[var(--foreground)]"
      data-preview-body-variant={variant}
    >
      <section
        id="study"
        className={`relative overflow-hidden bg-gradient-to-b ${band} px-4 py-16 sm:px-8`}
      >
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
            Preview surface
          </p>
          <h1 className="mb-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Premium clinical navigation — design rehearsal
          </h1>
          <p className="max-w-2xl text-lg text-[var(--muted-foreground)]">
            Scroll this page to observe sticky behavior, elevation shifts, and spacing rhythm. This content is
            synthetic and ships only under `/preview/figma-navigation/*`.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {["Study momentum", "Focused practice", "Confidence tracking"].map((title) => (
              <div
                key={title}
                className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--card)] p-5 shadow-[var(--elevation-rest)]"
              >
                <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  Token-driven surfaces — no production routes modified.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="practice" className="border-t border-[var(--semantic-border-soft)] px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-2xl font-semibold">Practice lane</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--card)] p-6">
              <p className="mb-2 text-sm font-medium text-[color-mix(in_srgb,var(--semantic-success)_85%,var(--foreground))]">
                Accuracy band
              </p>
              <div className="h-2 w-full rounded-full bg-[var(--semantic-border-soft)]">
                <div
                  className="h-2 w-3/5 rounded-full"
                  style={{
                    background: "color-mix(in srgb, var(--semantic-info) 75%, var(--semantic-success))",
                  }}
                />
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--card)] p-6">
              <p className="mb-2 text-sm font-medium text-[var(--muted-foreground)]">CAT readiness</p>
              <p className="text-sm text-[var(--foreground)]">
                Semantic hues reinforce status without loud chrome — aligned with NurseNest guardrails.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pathways" className="border-t border-[var(--semantic-border-soft)] px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="mb-3 text-2xl font-semibold">Pathways megamenu anchor</h2>
          <p className="text-[var(--muted-foreground)]">
            Desktop dropdown links scroll here; mobile sheet lists the same destinations.
          </p>
        </div>
      </section>
    </div>
  );
}
