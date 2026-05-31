import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, LockKeyhole, Sparkles } from "lucide-react";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { loadFeatureValueActivitySnapshot } from "@/lib/discovery/feature-value-activity-events.server";
import {
  buildProductDiscoveryDashboard,
  type ProductDiscoveryDashboard,
  type ProductDiscoveryModule,
} from "@/lib/discovery/product-discovery-engine";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type SessionLike = {
  user?: {
    id?: string;
    tier?: string | null;
  };
} | null;

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      title: "My Learning Ecosystem | NurseNest",
      description: "Discover the NurseNest modules included in your plan and find the next learning experience to try.",
      robots: { index: false, follow: false },
    }),
    { pathname: "/app/learning-ecosystem", routeGroup: "student.learner.discovery" },
  );
}

async function loadDiscoveryDashboard(userId: string, session: SessionLike): Promise<ProductDiscoveryDashboard> {
  const entitlement = await resolveEntitlementForPage(userId);
  let learnerPath: string | null = null;
  let alliedCareer: string | null = null;
  if (isDatabaseUrlConfigured()) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        learnerPath: true,
        alliedProfessionKey: true,
      },
    }).catch(() => null);
    learnerPath = user?.learnerPath ?? null;
    alliedCareer = user?.alliedProfessionKey ?? null;
  }

  const activityUsage = await loadFeatureValueActivitySnapshot(userId);
  const hasBaseAccess = entitlement !== "error" ? entitlement.hasAccess : false;

  return buildProductDiscoveryDashboard({
    tier: session?.user?.tier,
    learnerPath,
    alliedCareer,
    activityUsage,
    hasBaseAccess,
    hasAdvancedEcgEntitlement: false,
  });
}

function statusLabel(status: ProductDiscoveryModule["status"]): string {
  switch (status) {
    case "completed":
      return "Completed";
    case "started":
      return "Started";
    case "upgrade":
      return "Upgrade";
    case "not_yet_explored":
      return "Not Yet Explored";
  }
}

function statusClass(status: ProductDiscoveryModule["status"]): string {
  switch (status) {
    case "completed":
      return "border-[color-mix(in_srgb,var(--semantic-success)_34%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,transparent)]";
    case "started":
      return "border-[color-mix(in_srgb,var(--semantic-info)_34%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_10%,transparent)]";
    case "upgrade":
      return "border-[color-mix(in_srgb,var(--semantic-warning)_34%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,transparent)]";
    case "not_yet_explored":
      return "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]";
  }
}

function ModuleCard({ module }: { module: ProductDiscoveryModule }) {
  const href = module.status === "upgrade" ? module.upgradeHref ?? module.href : module.href;
  return (
    <Link
      href={href}
      className={`group flex h-full flex-col rounded-2xl border p-4 shadow-[var(--semantic-shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--semantic-shadow-medium)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-focus-ring)] ${statusClass(module.status)}`}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--semantic-text-secondary)]">
          {statusLabel(module.status)}
        </span>
        {module.status === "upgrade" ? <LockKeyhole className="h-4 w-4 text-[var(--semantic-warning)]" aria-hidden /> : null}
      </span>
      <span className="mt-2 text-base font-bold tracking-tight text-[var(--semantic-text-primary)]">{module.label}</span>
      <span className="mt-2 flex-1 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{module.valueMessage}</span>
      <span className="mt-4 flex items-center justify-between gap-3 text-xs font-semibold text-[var(--semantic-text-secondary)]">
        <span>{module.itemsCompleted > 0 ? `${module.itemsCompleted} items` : "Ready to open"}</span>
        <span className="inline-flex items-center gap-1 text-[var(--semantic-brand)]">
          Open
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </span>
    </Link>
  );
}

function ModuleGroup({ title, modules }: { title: string; modules: readonly ProductDiscoveryModule[] }) {
  if (modules.length === 0) return null;
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold tracking-tight text-[var(--semantic-text-primary)]">{title}</h2>
        <span className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-secondary)]">
          {modules.length}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <ModuleCard key={module.key} module={module} />
        ))}
      </div>
    </section>
  );
}

export default async function LearningEcosystemPage() {
  const session = (await getProtectedRouteSession("(student).app.(learner).learning-ecosystem")) as SessionLike;
  const userId = session?.user?.id ?? "";
  const dashboard = await loadDiscoveryDashboard(userId, session);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="nn-learner-page-hero">
        <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
          <Compass className="h-4 w-4" aria-hidden />
          My Learning Ecosystem
        </p>
        <h1 className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight text-[var(--semantic-text-primary)]">
          Discover the full NurseNest learning system.
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)] sm:text-base">
          Track what you have completed, what you have started, and the high-value modules still waiting in your plan.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-4">
        <div className="nn-card rounded-2xl p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--semantic-text-secondary)]">7-Day Goal</p>
          <p className="mt-2 text-3xl font-black text-[var(--semantic-text-primary)]">
            {dashboard.sevenDayDiscoveryGoal.discovered}/{dashboard.sevenDayDiscoveryGoal.target}
          </p>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
            {dashboard.sevenDayDiscoveryGoal.met ? "Goal met" : `${dashboard.sevenDayDiscoveryGoal.remaining} modules to discover`}
          </p>
        </div>
        <div className="nn-card rounded-2xl p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--semantic-text-secondary)]">30-Day Goal</p>
          <p className="mt-2 text-3xl font-black text-[var(--semantic-text-primary)]">
            {dashboard.thirtyDayDiscoveryGoal.discovered}/{dashboard.thirtyDayDiscoveryGoal.target}
          </p>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
            {dashboard.thirtyDayDiscoveryGoal.met ? "Goal met" : `${dashboard.thirtyDayDiscoveryGoal.remaining} modules to discover`}
          </p>
        </div>
        <div className="nn-card rounded-2xl p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--semantic-text-secondary)]">Value Used</p>
          <p className="mt-2 text-3xl font-black text-[var(--semantic-text-primary)]">{dashboard.subscriptionValue.featuresUsed}</p>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{dashboard.subscriptionValue.estimatedValueUnlockedLabel}</p>
        </div>
        <div className="nn-card rounded-2xl p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--semantic-text-secondary)]">Still Waiting</p>
          <p className="mt-2 text-3xl font-black text-[var(--semantic-text-primary)]">{dashboard.subscriptionValue.featuresRemaining}</p>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">Features to explore or unlock</p>
        </div>
      </section>

      {dashboard.recommendations.length > 0 ? (
        <section className="nn-card rounded-2xl p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden />
            <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Recommended Next</h2>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
            {dashboard.recommendations.slice(0, 3).map((recommendation) => (
              <Link
                key={recommendation.id}
                href={recommendation.href}
                className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 transition hover:bg-[var(--semantic-panel-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-focus-ring)]"
              >
                <span className="text-sm font-bold text-[var(--semantic-text-primary)]">{recommendation.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{recommendation.body}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <ModuleGroup title="Completed" modules={dashboard.completed} />
      <ModuleGroup title="Started" modules={dashboard.started} />
      <ModuleGroup title="Not Yet Explored" modules={dashboard.notYetExplored} />
      <ModuleGroup title="Upgrade To Unlock" modules={dashboard.upgrades} />
    </main>
  );
}
