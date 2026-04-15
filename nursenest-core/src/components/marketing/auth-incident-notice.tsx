import Link from "next/link";
import { supportEmail } from "@/lib/legal/legal-config";

type Props = {
  contactHref: string;
};

/**
 * Temporary incident banner for sign-in / password reset flows.
 * Copy is English-only for operational speed; keep calm and avoid account-existence hints.
 */
export function AuthIncidentNotice({ contactHref }: Props) {
  const email = supportEmail();
  return (
    <aside
      className="mb-6 rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_38%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_92%,transparent)] p-4 text-sm leading-relaxed text-[var(--theme-body)]"
      role="status"
      aria-live="polite"
    >
      <p className="font-medium text-[var(--theme-heading-text)]">Sign-in and password help</p>
      <p className="mt-2">
        We&apos;re currently investigating some sign-in and password reset issues affecting some users. If you&apos;re
        unable to access your account, please use the support option below and we&apos;ll help restore access.
      </p>
      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <Link className="font-semibold text-[var(--semantic-info)] underline underline-offset-2" href={contactHref}>
          Contact support
        </Link>
        <span className="text-muted-foreground">or email</span>
        <a className="font-semibold text-[var(--semantic-info)] underline underline-offset-2" href={`mailto:${email}`}>
          {email}
        </a>
      </p>
    </aside>
  );
}
