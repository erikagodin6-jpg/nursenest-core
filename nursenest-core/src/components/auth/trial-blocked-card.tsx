"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { trackClientEvent } from "@/lib/observability/posthog-client";

export function TrialBlockedCard({
  reason,
}: {
  reason: "already_used" | "device_used" | "email_not_verified" | "rate_limited" | "generic";
}) {
  const messages: Record<string, { title: string; body: string }> = {
    already_used: {
      title: "Trial Already Used",
      body: "It looks like you have already used a free trial. Sign in to your existing account, or choose a plan to continue.",
    },
    device_used: {
      title: "Trial Already Used",
      body: "A free trial has already been used on this device. Sign in to your existing account, or choose a plan.",
    },
    email_not_verified: {
      title: "Verify Your Email First",
      body: "Check your inbox for a verification link. Once verified, you can start your free trial.",
    },
    rate_limited: {
      title: "Too Many Attempts",
      body: "Please wait a moment before trying again. If you already have an account, sign in instead.",
    },
    generic: {
      title: "Unable to Start Trial",
      body: "Something went wrong. If you already have an account, sign in or choose a plan below.",
    },
  };

  const msg = messages[reason] ?? messages.generic;

  return (
    <div className="nn-trial-blocked">
      <ShieldAlert className="h-5 w-5 text-[var(--semantic-warning)]" aria-hidden />
      <h3 className="nn-trial-blocked__title">{msg.title}</h3>
      <p className="nn-trial-blocked__body">{msg.body}</p>
      <div className="nn-trial-blocked__actions">
        <Link
          href="/login"
          className="nn-trial-blocked__btn-primary"
          onClick={() => trackClientEvent("trial_blocked_sign_in_clicked", { reason })}
        >
          Sign In
        </Link>
        <Link
          href="/pricing"
          className="nn-trial-blocked__btn-secondary"
          onClick={() => trackClientEvent("trial_blocked_pricing_clicked", { reason })}
        >
          View Plans
        </Link>
      </div>
    </div>
  );
}
