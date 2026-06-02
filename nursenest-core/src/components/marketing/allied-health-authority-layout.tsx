import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, BookOpenCheck, CheckCircle2, ClipboardList, GraduationCap, Search } from "lucide-react";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import type { AlliedAuthorityLink } from "@/lib/seo/allied-health-authority-program";

export function AlliedAuthorityPageShell({
  breadcrumbs,
  eyebrow,
  title,
  deck,
  children,
  sidebarLinks,
}: {
  breadcrumbs: Array<{ name: string; href: string }>;
  eyebrow: string;
  title: string;
  deck: string;
  children: ReactNode;
  sidebarLinks: AlliedAuthorityLink[];
}) {
  return (
    <main className="bg-[var(--theme-page-bg)] text-[var(--theme-body-text)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <BreadcrumbTrail items={breadcrumbs} navClassName="nn-marketing-caption text-[var(--theme-muted-text)]" />
        <header className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--semantic-brand)]">{eyebrow}</p>
            <h1 className="nn-marketing-h1 mt-3 text-[var(--theme-heading-text)]">{title}</h1>
            <p className="nn-marketing-lead mt-4 max-w-3xl text-[var(--theme-muted-text)]">{deck}</p>
          </div>
          <aside className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
            <h2 className="flex items-center gap-2 text-base font-bold text-[var(--theme-heading-text)]">
              <Search className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden />
              Explore This Pathway
            </h2>
            <ul className="mt-4 space-y-2">
              {sidebarLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group flex items-center justify-between gap-3 rounded-xl border border-[var(--semantic-border-soft)] px-3 py-2 text-sm font-semibold text-[var(--theme-body-text)] hover:border-[var(--semantic-brand)] hover:text-primary">
                    <span>{link.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </header>
        <div className="mt-10">{children}</div>
      </div>
    </main>
  );
}

export function AuthoritySectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6">
      <h2 className="text-2xl font-bold text-[var(--theme-heading-text)]">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-7 text-[var(--theme-body-text)]">{children}</div>
    </section>
  );
}

export function AuthorityIconList({ items, icon = "check" }: { items: string[]; icon?: "check" | "book" | "clinical" | "placement" }) {
  const Icon = icon === "book" ? BookOpenCheck : icon === "clinical" ? ClipboardList : icon === "placement" ? GraduationCap : CheckCircle2;
  return (
    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-sm leading-6">
          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function AuthorityLinkGrid({ links }: { links: AlliedAuthorityLink[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="group rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)] hover:border-[var(--semantic-brand)]"
        >
          <span className="block text-sm font-bold text-[var(--theme-heading-text)]">{link.label}</span>
          <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Open guide
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </Link>
      ))}
    </div>
  );
}
