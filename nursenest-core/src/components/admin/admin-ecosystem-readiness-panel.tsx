import type { ReactNode } from "react";
import type {
  CapabilityReadinessRow,
  EcosystemReadinessLifecycle,
  GovernanceSampleRow,
  IntegrationContractRow,
  MarketplaceSampleRow,
  ModerationPipelineSampleRow,
  PluginPlanRow,
} from "@/lib/admin/admin-ecosystem-readiness-registry";

function lifecycleLabel(l: EcosystemReadinessLifecycle): string {
  switch (l) {
    case "contract_only":
      return "Contract-only";
    case "planned":
      return "Planned";
    case "internal_preview":
      return "Internal preview";
    case "blocked":
      return "Blocked";
    case "ready_for_implementation":
      return "Ready for implementation";
    default:
      return l;
  }
}

function lifecycleBadgeClass(l: EcosystemReadinessLifecycle): string {
  switch (l) {
    case "contract_only":
      return "nn-badge-semantic-info border border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))]";
    case "planned":
      return "nn-badge-semantic-warning border border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))]";
    case "internal_preview":
      return "border border-[color-mix(in_srgb,var(--semantic-chart-2)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-2)_12%,var(--semantic-surface))] text-[var(--semantic-text-primary)]";
    case "blocked":
      return "nn-badge-semantic-danger border border-[color-mix(in_srgb,var(--semantic-danger)_35%,var(--semantic-border-soft))]";
    case "ready_for_implementation":
      return "nn-badge-semantic-success border border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))]";
    default:
      return "rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-xs text-[var(--semantic-text-secondary)]";
  }
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="mt-10 text-lg font-semibold tracking-tight text-[var(--semantic-text-primary)]">{children}</h2>
  );
}

function DataTable({
  headers,
  rows,
}: {
  headers: readonly string[];
  rows: readonly (readonly ReactNode[])[];
}) {
  return (
    <div className="mt-3 overflow-x-auto rounded-xl border border-[var(--semantic-border-soft)]">
      <table className="min-w-full divide-y divide-[var(--semantic-border-soft)] text-sm">
        <thead className="bg-[color-mix(in_srgb,var(--semantic-panel-cool)_25%,var(--semantic-surface))]">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                scope="col"
                className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]">
          {rows.map((cells, i) => (
            <tr key={i} className="hover:bg-[color-mix(in_srgb,var(--semantic-panel-warm)_12%,transparent)]">
              {cells.map((cell, j) => (
                <td key={j} className="whitespace-nowrap px-3 py-2 text-[var(--semantic-text-primary)]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type AdminEcosystemReadinessPanelProps = {
  capabilities: readonly CapabilityReadinessRow[];
  plannedPlugins: readonly PluginPlanRow[];
  marketplaceSamples: readonly MarketplaceSampleRow[];
  integrationContracts: readonly IntegrationContractRow[];
  governance: readonly GovernanceSampleRow[];
  moderationStates: readonly ModerationPipelineSampleRow[];
};

export function AdminEcosystemReadinessPanel({
  capabilities,
  plannedPlugins,
  marketplaceSamples,
  integrationContracts,
  governance,
  moderationStates,
}: AdminEcosystemReadinessPanelProps) {
  return (
    <div className="space-y-2" data-testid="admin-ecosystem-readiness-panel">
      <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-warm)]/15 px-4 py-3 text-sm text-[var(--semantic-text-secondary)]">
        <strong className="text-[var(--semantic-danger)]">Non-authoritative.</strong> Rows describe{" "}
        <span className="font-semibold text-[var(--semantic-text-primary)]">contracts and planning labels only</span>.
        Extension context and hints must never replace{" "}
        <code className="rounded bg-[var(--semantic-surface)] px-1 text-xs">getUserAccess</code>,{" "}
        <code className="rounded bg-[var(--semantic-surface)] px-1 text-xs">requireSubscriberSession</code>, or other
        server-side entitlement checks on every protected path.
      </div>

      <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_18%,var(--semantic-surface))] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]">
        <strong className="text-[var(--semantic-text-primary)]">No public surface.</strong> There is no learner marketplace,
        no partner HTTP API, and no webhook delivery runtime in this phase — admin visibility only.
      </div>

      <SectionTitle>Platform capabilities</SectionTitle>
      <DataTable
        headers={["Capability", "Title", "Lifecycle", "Notes"]}
        rows={capabilities.map((r) => [
          <code key="c" className="text-xs">
            {r.capability}
          </code>,
          r.title,
          <span key="l" className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${lifecycleBadgeClass(r.lifecycle)}`}>
            {lifecycleLabel(r.lifecycle)}
          </span>,
          <span key="n" className="max-w-md whitespace-normal text-[var(--semantic-text-secondary)]">
            {r.notes}
          </span>,
        ])}
      />

      <SectionTitle>Planned plugins / extensions</SectionTitle>
      <DataTable
        headers={["Module ID", "Lifecycle", "Capabilities", "Integrity class"]}
        rows={plannedPlugins.map((r) => [
          <code key="m" className="text-xs">
            {r.moduleId}
          </code>,
          <span key="l" className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${lifecycleBadgeClass(r.lifecycle)}`}>
            {lifecycleLabel(r.lifecycle)}
          </span>,
          <span key="c" className="font-mono text-xs text-[var(--semantic-text-secondary)]">
            {r.declaredCapabilities.join(", ")}
          </span>,
          <code key="i" className="text-xs">
            {r.integrityClass}
          </code>,
        ])}
      />

      <SectionTitle>Marketplace listing metadata (sample)</SectionTitle>
      <p className="text-sm text-[var(--semantic-text-secondary)]">
        Illustrative rows only — not live SKUs, no checkout, no public listing pages.
      </p>
      <DataTable
        headers={["Listing ID", "SKU", "Offer kind", "Moderation", "Lifecycle"]}
        rows={marketplaceSamples.map((r) => [
          <code key="id" className="text-xs">
            {r.listingId}
          </code>,
          <code key="sku" className="text-xs">
            {r.sku}
          </code>,
          <code key="ok" className="text-xs">
            {r.offerKind}
          </code>,
          <code key="mod" className="text-xs">
            {r.moderation}
          </code>,
          <span key="l" className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${lifecycleBadgeClass(r.lifecycle)}`}>
            {lifecycleLabel(r.lifecycle)}
          </span>,
        ])}
      />

      <SectionTitle>Integration / webhook contract readiness</SectionTitle>
      <p className="text-sm text-[var(--semantic-text-secondary)]">
        Event domains are taxonomy only — dispatchers remain unimplemented (<code className="text-xs">none_contract_only</code>
        ).
      </p>
      <DataTable
        headers={["Event domain", "Lifecycle", "Dispatcher"]}
        rows={integrationContracts.map((r) => [
          <code key="d" className="text-xs">
            {r.domain}
          </code>,
          <span key="l" className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${lifecycleBadgeClass(r.lifecycle)}`}>
            {lifecycleLabel(r.lifecycle)}
          </span>,
          <code key="disp" className="text-xs">
            {r.dispatcher}
          </code>,
        ])}
      />

      <SectionTitle>Module ownership / governance (sample)</SectionTitle>
      <DataTable
        headers={["Module key", "Owning team", "Escalation", "Lifecycle"]}
        rows={governance.map((r) => [
          <code key="k" className="text-xs">
            {r.moduleKey}
          </code>,
          r.owningTeam,
          r.escalationTier,
          <span key="l" className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${lifecycleBadgeClass(r.lifecycle)}`}>
            {lifecycleLabel(r.lifecycle)}
          </span>,
        ])}
      />

      <SectionTitle>Moderation pipeline states</SectionTitle>
      <DataTable
        headers={["State", "Lifecycle", "Description"]}
        rows={moderationStates.map((r) => [
          <code key="s" className="text-xs">
            {r.state}
          </code>,
          <span key="l" className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${lifecycleBadgeClass(r.lifecycle)}`}>
            {lifecycleLabel(r.lifecycle)}
          </span>,
          r.description,
        ])}
      />
    </div>
  );
}
