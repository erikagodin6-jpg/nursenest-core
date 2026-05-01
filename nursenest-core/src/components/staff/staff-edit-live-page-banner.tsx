import Link from "next/link";
import { getStaffSession } from "@/lib/auth/staff-session";

/**
 * Server-only: renders nothing for anonymous/non-staff users (no SEO impact, no client JS).
 * Fixed position so it does not shift public layout for staff.
 */
export async function StaffEditLivePageBanner({
  adminHref,
  label = "Edit in admin",
}: {
  adminHref: string | null | undefined;
  label?: string;
}) {
  const href = adminHref?.trim();
  if (!href) return null;
  const staff = await getStaffSession().catch(() => null);
  if (!staff) return null;

  return (
    <div
      className="nn-staff-edit-live-banner pointer-events-auto fixed bottom-4 right-4 z-[200] max-w-[min(100vw-2rem,20rem)] rounded-lg border px-3 py-2 text-xs shadow-lg print:hidden"
      data-nn-staff-only="true"
      style={{
        borderColor: "color-mix(in srgb, var(--semantic-info) 35%, var(--semantic-border-soft))",
        background: "color-mix(in srgb, var(--semantic-panel-cool) 88%, var(--theme-page-bg))",
        color: "var(--semantic-text-secondary)",
      }}
    >
      <Link
        href={href}
        rel="nofollow noreferrer"
        className="font-semibold underline decoration-dotted underline-offset-2 hover:opacity-90"
        style={{ color: "var(--semantic-info)" }}
        prefetch={false}
      >
        {label}
      </Link>
      <span className="mt-1 block text-[10px] leading-snug opacity-80">Staff only — opens canonical admin editor.</span>
    </div>
  );
}
