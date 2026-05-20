import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { groupedAlliedMasteryModules } from "@/lib/allied/allied-mastery-modules";

export const dynamic = "force-dynamic";

const ADMIN_ALLIED_MODULES_PAGE_SIZE = 12;

type Props = { searchParams?: Promise<{ page?: string }> };

export default async function AdminAlliedModulesPage({ searchParams }: Props) {
  await requireAdmin();
  const groups = groupedAlliedMasteryModules();
  const pageRaw = Number((await searchParams)?.page ?? "1");
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;
  const allCards = groups.flatMap((group) => group.modules.map((module) => ({ group, module })));
  const totalPages = Math.max(1, Math.ceil(allCards.length / ADMIN_ALLIED_MODULES_PAGE_SIZE));
  const visibleCards = allCards.slice((page - 1) * ADMIN_ALLIED_MODULES_PAGE_SIZE, page * ADMIN_ALLIED_MODULES_PAGE_SIZE);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" data-testid="admin-allied-mastery-modules">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--semantic-brand)]">Admin preview</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--semantic-text-primary)]">
          Allied mastery modules
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          Hidden career-specific allied modules for staff review. Public launch, pricing, sitemap, hreflang, and
          checkout remain disabled until explicitly enabled.
        </p>
      </header>

      <div className="mt-8 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4 text-sm text-[var(--semantic-text-secondary)]">
        Paginated admin preview: page {Math.min(page, totalPages)} of {totalPages}, {ADMIN_ALLIED_MODULES_PAGE_SIZE} modules per page.
      </div>

      <div className="mt-8 space-y-8">
        {groups.map((group) => {
          const modules = visibleCards.filter((card) => card.group.professionKey === group.professionKey).map((card) => card.module);
          if (modules.length === 0) return null;
          return (
          <section key={group.professionKey} className="space-y-3">
            <h2 className="text-xl font-semibold text-[var(--semantic-text-primary)]">{group.professionLabel}</h2>
            {modules.length === 0 ? (
              <p className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4 text-sm text-[var(--semantic-text-secondary)]">
                No hidden mastery modules registered yet.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {modules.map((module) => (
                  <article
                    key={module.id}
                    className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--semantic-text-primary)]">{module.title}</h3>
                        <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{module.description}</p>
                      </div>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                        Hidden / Admin Preview Only
                      </span>
                    </div>
                    <dl className="mt-4 grid gap-2 text-sm text-[var(--semantic-text-secondary)]">
                      <div className="flex justify-between gap-4">
                        <dt>Public enabled</dt>
                        <dd>false</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt>Entitlement key</dt>
                        <dd className="text-right font-mono text-xs">{module.entitlementKey}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt>Content counts</dt>
                        <dd>{module.contentTypes.length} content type shells</dd>
                      </div>
                    </dl>
                    <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-950">
                      Not visible to public users.
                    </p>
                    <Link
                      href={module.route}
                      className="mt-4 inline-flex min-h-[40px] items-center rounded-full bg-[var(--semantic-brand)] px-4 text-sm font-semibold nn-text-on-solid-fill"
                    >
                      Preview module
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>
          );
        })}
      </div>

      <nav className="mt-8 flex flex-wrap gap-3" aria-label="Allied mastery module pages">
        {page > 1 ? <Link href={`/admin/modules/allied?page=${page - 1}`} className="text-sm font-semibold underline">Previous</Link> : null}
        {page < totalPages ? <Link href={`/admin/modules/allied?page=${page + 1}`} className="text-sm font-semibold underline">Next</Link> : null}
      </nav>
    </main>
  );
}
