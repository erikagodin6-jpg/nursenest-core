import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { appAccountBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { loadNotesPagePayload } from "./actions";
import { NotesIndexClient } from "./notes-index-client";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      title: "My Notes & Highlights — NurseNest",
      robots: { index: false, follow: false },
    }),
    { pathname: "/app/account/notes", routeGroup: "student.learner.account_notes" },
  );
}

export default async function AccountNotesPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const crumbs = appAccountBreadcrumbs("Notes & Highlights");

  // ── Auth guard ──────────────────────────────────────────────────────────────
  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline="Notes & Highlights"
          body="Sign in to access your study notes, bookmarks, and saved rationales."
          primaryCta={{
            label: "Sign in",
            href: loginWithCallback("/app/account/notes"),
            variant: "primary",
          }}
          secondaryCtas={[{ label: "Browse lessons", href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </main>
    );
  }

  // ── Entitlement gate ────────────────────────────────────────────────────────
  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline="Notes & Highlights"
          body="We could not verify your subscription. Please try again."
          tone="default"
          primaryCta={{ label: "Refresh", href: "/app/account/notes", variant: "primary" }}
          secondaryCtas={[{ label: "Go to dashboard", href: "/app", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </main>
    );
  }

  if (!entitlement.hasAccess) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <SubscriptionPaywall context="dashboard" />
      </main>
    );
  }

  // ── Load initial data ───────────────────────────────────────────────────────
  const payload = await loadNotesPagePayload(userId);

  return (
    <main className="space-y-6">
      <BreadcrumbTrail items={crumbs} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl px-6 py-7 sm:px-8"
        style={{
          background: "var(--surface-emphasis, var(--semantic-panel-cool))",
          border: "1px solid var(--semantic-border-soft)",
          boxShadow: "var(--semantic-shadow-soft)",
        }}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--semantic-text-muted)" }}
            >
              Your study companion
            </p>
            <h1
              className="text-2xl font-extrabold sm:text-3xl"
              style={{ color: "var(--semantic-text-primary)" }}
            >
              Notes &amp; Highlights
            </h1>
            <p className="max-w-md text-sm" style={{ color: "var(--semantic-text-secondary)" }}>
              All your notes, bookmarked sections, and saved rationales — organized in one place.
              Write inside any lesson or question to add a note.
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex shrink-0 flex-wrap gap-4">
            <StatPill label="Notes" value={payload.total} color="var(--semantic-brand)" />
            <StatPill label="Section notes" value={payload.sectionNoteCount} color="var(--semantic-chart-2, var(--semantic-brand))" />
            <StatPill label="Bookmarks" value={payload.bookmarkCount} color="var(--semantic-info)" />
            <StatPill
              label="Rationales"
              value={payload.rationaleCount}
              color="var(--semantic-success)"
            />
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href="/app/lessons"
            className="inline-flex rounded-full px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-80"
            style={{
              background: "var(--semantic-brand)",
              color: "var(--semantic-on-brand, white)",
            }}
          >
            Write a lesson note
          </a>
          <a
            href="/app/questions"
            className="inline-flex rounded-full px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-80"
            style={{
              background: "color-mix(in srgb, var(--semantic-text-muted) 10%, var(--semantic-surface))",
              border: "1px solid var(--semantic-border-soft)",
              color: "var(--semantic-text-secondary)",
            }}
          >
            Save a rationale
          </a>
        </div>
      </div>

      {/* ── Interactive notes list (client component) ─────────────────────── */}
      <NotesIndexClient payload={payload} userId={userId} />
    </main>
  );
}

// ── StatPill ──────────────────────────────────────────────────────────────────

function StatPill({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="text-center">
      <p
        className="text-xl font-extrabold tabular-nums"
        style={{ color }}
      >
        {value.toLocaleString()}
      </p>
      <p className="text-[10px] font-medium" style={{ color: "var(--semantic-text-muted)" }}>
        {label}
      </p>
    </div>
  );
}
