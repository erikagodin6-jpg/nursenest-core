import Link from "next/link";
import { HotspotEditorClient } from "@/components/admin/hotspots/hotspot-editor-client";
import { requireAdmin } from "@/lib/auth/guards";
import { HOTSPOT_ASSETS, HOTSPOT_OVERLAYS, HOTSPOT_QUESTIONS } from "@/lib/hotspots/hotspot-question-infrastructure";

export const dynamic = "force-dynamic";

export default async function AdminHotspotsPage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">NGN item authoring</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Hotspot Question Infrastructure</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Admin-only workflow for licensed assets, human-reviewed SVG diagrams, independent overlays, hotspot questions,
            coordinate validation, and clinical review gates. Production hotspot questions must never rely on AI-generated
            clinical imagery.
          </p>
        </div>
        <Link href="/admin/questions" className="rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-muted">
          Question Bank Admin
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Metric label="Image Assets" value={String(HOTSPOT_ASSETS.length)} />
        <Metric label="Overlays" value={String(HOTSPOT_OVERLAYS.length)} />
        <Metric label="Hotspot Questions" value={String(HOTSPOT_QUESTIONS.length)} />
      </div>

      <HotspotEditorClient />
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-[var(--theme-card-bg)] p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold text-[var(--theme-heading-text)]">{value}</p>
    </div>
  );
}
