"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { Session } from "next-auth";

function buildAuthState(session: Session | null): "authenticated" | "guest" {
  if (session?.user) return "authenticated";
  return "guest";
}

export function OptionalAuthIsland(): JSX.Element | null {
  const [state, setState] = useState<"loading" | "authenticated" | "guest">("loading");

  useEffect(() => {
    let mounted = true;
    void import("next-auth/react")
      .then(({ getSession }) => getSession())
      .then((session) => {
        if (!mounted) return;
        setState(buildAuthState(session));
      })
      .catch(() => {
        if (!mounted) return;
        setState("guest");
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (state === "loading") return null;
  if (state === "authenticated") {
    return (
      <Link
        href="/app"
        className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_78%,transparent)] px-3 py-2 font-medium text-[color-mix(in_srgb,var(--semantic-text-primary)_90%,transparent)] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-panel-cool)_28%,transparent)]"
      >
        Dashboard
      </Link>
    );
  }
  return null;
}
