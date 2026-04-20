import Link from "next/link";
import { isNavHrefAllowedForStaffTier } from "@/lib/auth/admin-path-policy";
import type { StaffTier } from "@/lib/auth/staff-roles";

type HubItem = { href: string; title: string; body: string };

type HubGroup = { id: string; title: string; subtitle: string; items: readonly HubItem[] };

/**
 * Legacy monolith admin (`client/src/pages/admin.tsx`) grouped daily work into tabbed workspaces
 * (overview, users, activity, content engine, analytics, feedback, …). Next admin splits those into
 * routes; this hub restores the **entry-point / IA** pattern: grouped shortcuts to real tools.
 */
const LEGACY_STYLE_GROUPS: readonly HubGroup[] = [
  {
    id: "people-growth",
    title: "People, subscriptions & voice",
    subtitle: "Legacy “Users”, “Sub analytics”, and feedback loops — now discrete admin routes.",
    items: [
      { href: "/admin/users", title: "Users & support", body: "Search learners, tiers, and support actions." },
      { href: "/admin/subscriptions", title: "Revenue & subscriptions", body: "Plans, Stripe health, and retention signals." },
      { href: "/admin/analytics", title: "Analytics hub", body: "Traffic, study, and product analytics entry." },
      { href: "/admin/analytics/funnels", title: "Funnel analytics", body: "Step conversion and drop-offs." },
      { href: "/admin/feedback", title: "User feedback", body: "Bugs and product messages from the app." },
    ],
  },
  {
    id: "content-bank",
    title: "Content engine & question bank",
    subtitle: "Legacy “Content engine”, bank, and inventory — mapped to coverage + authoring tools.",
    items: [
      { href: "/admin/content", title: "Coverage & quality", body: "Lessons, pathways, and bank linkage." },
      { href: "/admin/inventory", title: "Inventory drill-down", body: "Pathway-scoped lesson and bank counts." },
      { href: "/admin/lessons", title: "Lessons", body: "Authoring, JSON tools, and lesson ops." },
      { href: "/admin/questions", title: "Question bank", body: "Stem review, diagnostics, and publishing." },
      { href: "/admin/questions/import", title: "Bulk question import", body: "Validate JSON and dedupe stems." },
      { href: "/admin/media", title: "Media library", body: "Uploads and delivery URLs." },
    ],
  },
  {
    id: "publishing",
    title: "Publishing, SEO & social queue",
    subtitle: "Legacy blog / social / SEO tabs — publishing hub plus schedulers.",
    items: [
      { href: "/admin/hub/publishing", title: "Publishing hub", body: "Blog + SEO shortcuts in one place." },
      { href: "/admin/blog/studio", title: "Article studio", body: "Draft packages and editorial workflow." },
      { href: "/admin/blog/scheduler", title: "Blog scheduler", body: "Queue and publish timing." },
      { href: "/admin/seo", title: "SEO & internal links", body: "Meta gaps, href inventory, fixes." },
    ],
  },
  {
    id: "platform-safety",
    title: "Platform, safety & access",
    subtitle: "Legacy “audit”, “AI safety”, operations — RBAC and diagnostics stay server-enforced.",
    items: [
      { href: "/admin/operations", title: "System health", body: "DB, APIs, and safe-mode signals." },
      { href: "/admin/diagnostics", title: "Diagnostics", body: "Deep checks and admin-only probes." },
      { href: "/admin/content-quality", title: "Content quality", body: "Rationale depth and corpus gates." },
      { href: "/admin/ai/review", title: "AI review queue", body: "Human review for generated content." },
      { href: "/admin/premium-protection", title: "Premium protection", body: "Abuse deterrence rollups." },
      { href: "/admin/fraud", title: "Fraud detection", body: "Risk review and escalations." },
      { href: "/admin/access", title: "Access & roles", body: "RBAC reference for staff tiers." },
    ],
  },
] as const;

export function AdminLegacyOperationsHub({ staffTier = "super" }: { staffTier?: StaffTier }) {
  const groups = LEGACY_STYLE_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((item) => isNavHrefAllowedForStaffTier(staffTier, item.href)),
  })).filter((g) => g.items.length > 0);

  if (groups.length === 0) return null;

  return (
    <section
      className="space-y-6 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-sm"
      data-testid="admin-legacy-operations-hub"
      aria-labelledby="admin-legacy-ops-heading"
    >
      <div className="space-y-1">
        <h2 id="admin-legacy-ops-heading" className="text-lg font-bold text-[var(--semantic-text-primary)]">
          Operations workspaces
        </h2>
        <p className="max-w-3xl text-sm text-[var(--semantic-text-secondary)]">
          Same mental model as the legacy admin dashboard: grouped entry points for users, content, publishing, and
          platform safety. Each card opens a real route; authorization stays on the server.
        </p>
      </div>

      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.id} className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                {group.title}
              </h3>
              <p className="mt-0.5 text-xs text-[var(--semantic-text-secondary)]">{group.subtitle}</p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex h-full flex-col rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_40%,var(--semantic-surface))] p-4 transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] hover:shadow-md"
                  >
                    <span className="text-sm font-semibold text-[var(--semantic-text-primary)]">{item.title}</span>
                    <span className="mt-1 text-xs leading-snug text-[var(--semantic-text-secondary)]">{item.body}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
