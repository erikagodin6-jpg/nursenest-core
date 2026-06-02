import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { LAB_VALUES_MODULES } from "@/lib/lab-values/lab-values-module";

export const dynamic = "force-dynamic";

export default async function AdminLabValuesModulesPage() {
  await requireAdmin();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8" data-testid="admin-lab-values-modules">
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
        <strong>Hidden / Admin Preview Only.</strong> Not visible to public users. Public pricing, sitemap, hreflang,
        and checkout remain disabled.
      </div>

      <header className="mt-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--semantic-brand)]">Admin preview</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--semantic-text-primary)]">Lab Values Mastery System</h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          Structured hidden review build across basics, basic mastery, and advanced clinical reasoning.
        </p>
      </header>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {LAB_VALUES_MODULES.map((module) => (
          <article key={module.id} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
            <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">{module.title}</h2>
            <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{module.description}</p>
            <dl className="mt-4 grid gap-2 text-sm text-[var(--semantic-text-secondary)]">
              <div className="flex justify-between gap-4">
                <dt>Status</dt>
                <dd>Hidden / Admin Preview Only</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Future access</dt>
                <dd>{module.futureAccess}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Entitlement placeholder</dt>
                <dd className="font-mono text-xs">{module.entitlementKey}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Content counts</dt>
                <dd>{module.lessons.length} lessons</dd>
              </div>
            </dl>
            <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-950">Not visible to public users.</p>
            <Link href={module.route} className="mt-4 inline-flex text-sm font-semibold text-[var(--semantic-brand)] underline">
              Preview module
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-10">
        <Link href="/admin/modules" className="text-sm font-semibold text-[var(--semantic-brand)] underline">
          Back to hidden module previews
        </Link>
      </div>
    </main>
  );
}
