import type { ReactNode } from "react";
import Link from "next/link";
import { AUTH_EDUCATIONAL_DISCLAIMER } from "@/components/auth/auth-experience/constants";

export type AuthSupportFooterProps = {
  termsHref: string;
  privacyHref: string;
  contactHref: string;
  /** Optional slot above legal (trust strip, recovery hints) */
  children?: ReactNode;
};

/**
 * Canonical auth legal + support footer — all routes use this primitive.
 */
export function AuthSupportFooter({ termsHref, privacyHref, contactHref, children }: AuthSupportFooterProps) {
  return (
    <footer className="nn-premium-auth-legal mt-auto" data-nn-premium-auth-legal>
      {children}
      <p>{AUTH_EDUCATIONAL_DISCLAIMER}</p>
      <p>
        By continuing, you agree to the <Link href={termsHref}>Terms Of Service</Link> and acknowledge the{" "}
        <Link href={privacyHref}>Privacy Policy</Link>. Need help? <Link href={contactHref}>Contact Support</Link>.
      </p>
    </footer>
  );
}
