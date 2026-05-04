import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { ECG_ROUTE_CONFIGS, ECG_MASTERY_ENTITLEMENT } from "@/lib/ecg-module/ecg-module-config";
import { LAB_VALUES_MODULES } from "@/lib/lab-values/lab-values-module";

export const dynamic = "force-dynamic";

export default async function AdminModulesPage() {
  await requireAdmin();

  const ecgCount = Object.keys(ECG_ROUTE_CONFIGS).filter((route) => route.startsWith("/modules/ecg/")).length;
  const labCount = LAB_VALUES_MODULES.length;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" data-testid="admin-hidden-modules">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--semantic-brand)]">Admin preview</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--semantic-text-primary)]">Hidden module previews</h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          Private review surfaces only. Nothing here is visible to public users, pricing, sitemap, hreflang, or checkout.
        </p>
      </header>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <PreviewCard
          title="ECG Mastery System"
          status="Hidden / Admin Preview Only"
          publicFlag="disabled"
          countLabel={`${ecgCount} preview routes`}
          entitlementKey={ECG_MASTERY_ENTITLEMENT}
          previewHref="/admin/modules/ecg"
        />
        <PreviewCard
          title="Lab Values Mastery System"
          status="Hidden / Admin Preview Only"
          publicFlag="disabled"
          countLabel={`${labCount} level tracks`}
          entitlementKey="LAB_VALUES_BASICS_FREE, LAB_VALUES_MASTERY_PAID"
          previewHref="/admin/modules/lab-values"
        />
        <PreviewCard
          title="Allied Mastery Modules"
          status="Hidden / Admin Preview Only"
          publicFlag="disabled"
          countLabel="Career-specific module set"
          entitlementKey="Allied entitlement placeholders"
          previewHref="/admin/modules/allied"
        />
      </div>
    </main>
  );
}

function PreviewCard({
  title,
  status,
  publicFlag,
  countLabel,
  entitlementKey,
  previewHref,
}: {
  title: string;
  status: string;
  publicFlag: string;
  countLabel: string;
  entitlementKey: string;
  previewHref: string;
}) {
  return (
    <article className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">{title}</h2>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{status}</p>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">{status}</span>
      </div>
      <dl className="mt-4 grid gap-2 text-sm text-[var(--semantic-text-secondary)]">
        <div className="flex justify-between gap-4">
          <dt>Public flag</dt>
          <dd>{publicFlag}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Content counts</dt>
          <dd>{countLabel}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Entitlement placeholders</dt>
          <dd className="text-right font-mono text-xs">{entitlementKey}</dd>
        </div>
      </dl>
      <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-950">Not visible to public users.</p>
      <Link
        href={previewHref}
        className="mt-4 inline-flex min-h-[40px] items-center rounded-full bg-[var(--semantic-brand)] px-4 text-sm font-semibold nn-text-on-solid-fill"
      >
        Preview module
      </Link>
    </article>
  );
}
