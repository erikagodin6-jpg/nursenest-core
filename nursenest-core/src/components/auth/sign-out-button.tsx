"use client";

import { signOut } from "next-auth/react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";

type SignOutButtonProps = {
  className?: string;
  /** Runs before `signOut` (e.g. close menus). */
  onBeforeSignOut?: () => void;
  /** Defaults to localized `/login` (safe public page). */
  redirectTo?: string;
  /** Use `menuitem` inside `role="menu"` dropdowns. */
  role?: "button" | "menuitem";
};

/**
 * Ends the NextAuth session for this browser (JWT + cookies, including “Remember me”).
 * Always use this instead of clearing client-only state.
 */
export function SignOutButton({
  className,
  onBeforeSignOut,
  redirectTo: redirectOverride,
  role = "button",
}: SignOutButtonProps) {
  const { t, locale } = useMarketingI18n();
  const redirectTo = redirectOverride ?? withMarketingLocale(locale, "/login");

  const defaultClass =
    "inline-flex min-h-[44px] touch-manipulation items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-[var(--nav-fg)] underline-offset-2 transition-colors hover:bg-[var(--nav-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";

  return (
    <button
      type="button"
      role={role}
      className={className !== undefined ? className : defaultClass}
      onClick={() => {
        onBeforeSignOut?.();
        void signOut({ redirectTo });
      }}
    >
      {t("nav.signout")}
    </button>
  );
}
