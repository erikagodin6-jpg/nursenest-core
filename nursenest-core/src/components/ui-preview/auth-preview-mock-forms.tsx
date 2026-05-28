"use client";

import Link from "next/link";

/** Static form chrome for auth Figma / QA previews — no submit, no session. */
export function AuthPreviewLoginForm() {
  return (
    <div
      className="nn-premium-auth-form mt-6 space-y-4"
      data-nn-premium-auth-form="login"
      aria-hidden="true"
    >
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-[var(--theme-heading-text)]">Email</label>
        <input
          type="email"
          readOnly
          tabIndex={-1}
          defaultValue="student@example.edu"
          className="nn-premium-auth-input w-full rounded-xl px-3 py-2"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-[var(--theme-heading-text)]">Password</label>
        <input
          type="password"
          readOnly
          tabIndex={-1}
          defaultValue="••••••••••"
          className="nn-premium-auth-input w-full rounded-xl px-3 py-2"
        />
      </div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <label className="flex items-center gap-2 text-muted-foreground">
          <input type="checkbox" readOnly tabIndex={-1} className="nn-premium-auth-checkbox rounded" defaultChecked />
          Remember me
        </label>
        <Link href="#" className="font-semibold text-[var(--semantic-brand)]">
          Forgot password?
        </Link>
      </div>
      <button type="button" className="nn-premium-auth-primary-button nn-btn-primary w-full px-4 py-3 text-base font-semibold">
        Sign in
      </button>
      <p className="text-center text-xs text-muted-foreground">Or continue with</p>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" className="nn-premium-auth-input rounded-xl px-3 py-2.5 text-sm font-semibold">
          Google
        </button>
        <button type="button" className="nn-premium-auth-input rounded-xl px-3 py-2.5 text-sm font-semibold">
          Apple
        </button>
      </div>
    </div>
  );
}

export function AuthPreviewSignupForm() {
  return (
    <div className="nn-premium-auth-form mt-4 space-y-3" data-nn-premium-auth-form="signup" aria-hidden="true">
      <div className="grid gap-3 sm:grid-cols-2">
        <input readOnly tabIndex={-1} placeholder="First name" className="nn-premium-auth-input w-full rounded-xl px-3 py-2" />
        <input readOnly tabIndex={-1} placeholder="Last name" className="nn-premium-auth-input w-full rounded-xl px-3 py-2" />
      </div>
      <input
        readOnly
        tabIndex={-1}
        defaultValue="student@example.edu"
        className="nn-premium-auth-input w-full rounded-xl px-3 py-2"
      />
      <input readOnly tabIndex={-1} type="password" defaultValue="••••••••••" className="nn-premium-auth-input w-full rounded-xl px-3 py-2" />
      <div className="nn-premium-auth-signup-cta">
        <button type="button" className="nn-premium-auth-primary-button nn-btn-primary w-full px-4 py-3 text-base font-semibold">
          Create account
        </button>
        <p className="nn-premium-auth-signup-cta__subtext">Free to start · upgrade when you are ready</p>
      </div>
    </div>
  );
}
