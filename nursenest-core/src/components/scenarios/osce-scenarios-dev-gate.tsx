import Link from "next/link";
import { SCENARIO_LEARNER_ROUTES, withScenarioPathwayQuery } from "@/lib/scenarios/scenario-routes";

export function OsceScenariosDevGate({
  surface,
  pathwayId,
}: {
  surface: "osce" | "clinical_scenarios";
  pathwayId: string | null;
}) {
  const title = surface === "osce" ? "OSCE prep (unpublished)" : "Clinical scenarios (unpublished)";
  const learnerHref =
    surface === "osce"
      ? withScenarioPathwayQuery(SCENARIO_LEARNER_ROUTES.osce, pathwayId)
      : withScenarioPathwayQuery(SCENARIO_LEARNER_ROUTES.clinicalScenarios, pathwayId);
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-10">
      <div
        className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_45%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_12%,var(--semantic-surface))] px-4 py-3 text-sm text-[var(--semantic-text-primary)]"
        role="status"
      >
        <strong className="font-semibold">Development preview.</strong> This surface is not published in production
        until <code className="rounded bg-[var(--bg-muted)] px-1 py-0.5 text-xs">NEXT_PUBLIC_ENABLE_OSCE_SCENARIOS=true</code>.
        Production requests return 404.
      </div>
      <h1 className="text-2xl font-semibold text-[var(--semantic-text-primary)]">{title}</h1>
      <p className="text-sm text-[var(--theme-body-text)]">
        {pathwayId ? (
          <>
            Pathway <span className="font-mono">{pathwayId}</span> — open the learner shell to test navigation when the
            flag is enabled.
          </>
        ) : (
          "Add pathwayId to mirror a learner session."
        )}
      </p>
      <Link
        href={learnerHref}
        className="inline-flex w-fit rounded-full border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_18%,var(--bg-card))] px-4 py-2 text-sm font-medium text-[var(--semantic-brand)]"
      >
        Open learner route
      </Link>
    </div>
  );
}
