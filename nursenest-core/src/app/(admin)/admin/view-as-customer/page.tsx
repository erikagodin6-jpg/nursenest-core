/**
 * Admin "View As Customer" — Phase 11F extension.
 *
 * Lets admins select one of 8 pre-defined user personas and experience
 * the platform exactly as that subscriber type would.
 *
 * Backed by the existing QA simulation cookie system
 * (`nn_admin_learner_qa`) and entitlement override mechanism.
 * Every activation is logged with admin user ID, target persona, and timestamp.
 *
 * Access: ADMIN, SUPER_ADMIN only (enforced by `requireAdmin()`).
 */
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { getStaffSession } from "@/lib/auth/staff-session";
import { readAdminLearnerQaPublicState } from "@/lib/admin/admin-learner-qa-simulation";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { ViewAsCustomerClient } from "./view-as-customer-client";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "View As Customer · Admin",
  robots: "noindex",
};

export default async function ViewAsCustomerPage() {
  // ── Security gate ──────────────────────────────────────────────────────────
  // requireAdmin() throws/redirects for non-admins; staff-session is DB-backed.
  const admin = await requireAdmin();
  const staff = await getStaffSession();

  if (!staff?.userId) {
    redirect("/admin");
  }

  // ── Audit page load ────────────────────────────────────────────────────────
  safeServerLog("admin_view_as_customer", "page_loaded", {
    adminId: staff.userId.slice(0, 12),
    surface: "view_as_customer_portal",
    ip: "server", // IP is available in middleware but not here; proxy logs capture it
  });

  // ── Current simulation state ───────────────────────────────────────────────
  const activeState = isDatabaseUrlConfigured()
    ? await readAdminLearnerQaPublicState(staff.userId).catch(() => null)
    : null;

  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="text-sm text-[var(--semantic-text-muted)] hover:text-[var(--semantic-text-primary)]"
            >
              ← Admin
            </Link>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-[var(--semantic-text-primary)]">
            View As Customer
          </h1>
          <p className="mt-1 text-sm text-[var(--semantic-text-muted)]">
            Simulate the exact experience of any user type — paywalls, subscriptions, content access,
            dashboards, and study flows — without touching their account.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/learner-qa"
            className="inline-flex items-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--surface-interactive-hover)]"
          >
            Full QA Tools
          </Link>
          <Link
            href="/admin/users"
            className="inline-flex items-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--surface-interactive-hover)]"
          >
            User Management
          </Link>
        </div>
      </div>

      {/* Admin identity strip */}
      <div className="mb-6 flex items-center gap-3 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 text-sm">
        <span className="rounded-full bg-[var(--semantic-brand)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          Admin
        </span>
        <span className="text-[var(--semantic-text-muted)]">
          Signed in as <span className="font-semibold text-[var(--semantic-text-primary)]">{staff.userId.slice(0, 8)}…</span>
          {" · "}
          <span className="text-[var(--semantic-text-secondary)]">{staff.role}</span>
        </span>
        <span className="ml-auto text-xs text-[var(--semantic-text-muted)]">
          All actions are audited and logged
        </span>
      </div>

      {/* Main client component */}
      <ViewAsCustomerClient activeState={activeState} />
    </main>
  );
}
