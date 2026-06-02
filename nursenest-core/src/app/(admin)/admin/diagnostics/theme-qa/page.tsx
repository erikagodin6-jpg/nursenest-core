import Link from "next/link";
import { ThemeQaMatrix } from "@/components/admin/theme-qa-matrix";
import { requireAdmin } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function AdminThemeQaPage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Diagnostics</p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--theme-heading-text)]">Theme & logo QA</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Registry color, light/dark group, local-canonical check, load errors, runtime contrast boost flags, and surface
            samples per theme. Remove this route when no longer needed.
          </p>
        </div>
        <Link
          href="/admin/diagnostics"
          className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          ← Diagnostics
        </Link>
      </div>

      <section className="mt-8">
        <ThemeQaMatrix />
      </section>
    </main>
  );
}
