"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import type { LearnerConnectedAccountsSnapshot } from "@/lib/auth/oauth-connected-accounts.server";
import { trackProductEvent } from "@/lib/observability/product-analytics";
import { PH } from "@/lib/observability/posthog-conversion-events";

const CONNECT_CALLBACK = "/app/account/security";

function providerLabel(provider: "google" | "apple"): string {
  return provider === "google" ? "Google" : "Apple";
}

export function LearnerConnectedAccounts({ snapshot }: { snapshot: LearnerConnectedAccountsSnapshot }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const connectTrackedRef = useRef(false);
  const [pending, setPending] = useState<"google" | "apple" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const linked = new Set(snapshot.links.map((l) => l.provider));

  useEffect(() => {
    const connected = searchParams.get("connected");
    if (connectTrackedRef.current || (connected !== "google" && connected !== "apple")) return;
    connectTrackedRef.current = true;
    trackProductEvent(PH.providerConnectCompleted, { provider: connected, actor: "learner" });
    const sp = new URLSearchParams(searchParams.toString());
    sp.delete("connected");
    const qs = sp.toString();
    router.replace(`${CONNECT_CALLBACK}${qs ? `?${qs}` : ""}`);
  }, [router, searchParams]);

  async function disconnect(provider: "google" | "apple") {
    if (!window.confirm(`Disconnect ${providerLabel(provider)} from your NurseNest account?`)) return;
    setPending(provider);
    setError(null);
    try {
      const res = await fetch("/api/learner/account/oauth-disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !data.ok) {
        setError(data.message ?? "Could not disconnect. Try again.");
        return;
      }
      trackProductEvent(PH.providerDisconnectCompleted, { provider, actor: "learner" });
      window.location.reload();
    } catch {
      setError("Could not disconnect. Check your connection and try again.");
    } finally {
      setPending(null);
    }
  }

  function connect(provider: "google" | "apple") {
    setPending(provider);
    setError(null);
    trackProductEvent(PH.providerConnectStarted, { provider, actor: "learner" });
    void signIn(provider, { callbackUrl: `${CONNECT_CALLBACK}?connected=${provider}` });
  }

  const rows: Array<{
    provider: "google" | "apple";
    available: boolean;
    connected: boolean;
    meta?: (typeof snapshot.links)[number];
  }> = [
    {
      provider: "google",
      available: snapshot.googleAvailable,
      connected: linked.has("google"),
      meta: snapshot.links.find((l) => l.provider === "google"),
    },
    {
      provider: "apple",
      available: snapshot.appleAvailable,
      connected: linked.has("apple"),
      meta: snapshot.links.find((l) => l.provider === "apple"),
    },
  ];

  const visible = rows.filter((r) => r.available);
  if (visible.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-border/60 bg-[var(--bg-card)] shadow-sm">
      <div className="border-b border-border/60 bg-gradient-to-r from-[color-mix(in_srgb,var(--semantic-info)_8%,transparent)] to-transparent px-5 py-4">
        <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">Connected accounts</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Link Google or Apple for faster sign-in. You can keep email and password as well.
        </p>
      </div>
      <ul className="divide-y divide-border/50 p-5">
        {visible.map((row) => (
          <li key={row.provider} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
            <div>
              <p className="text-sm font-semibold text-[var(--theme-heading-text)]">{providerLabel(row.provider)}</p>
              <p className="text-xs text-muted-foreground">
                {row.connected
                  ? row.meta?.linkedAt
                    ? `Connected ${new Date(row.meta.linkedAt).toLocaleDateString()}`
                    : "Connected"
                  : "Not connected"}
                {row.meta?.isApplePrivateRelay ? " · Private relay email" : null}
              </p>
            </div>
            {row.connected ? (
              <button
                type="button"
                disabled={pending !== null}
                onClick={() => void disconnect(row.provider)}
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted/30 disabled:opacity-50"
              >
                {pending === row.provider ? "Disconnecting…" : "Disconnect"}
              </button>
            ) : (
              <button
                type="button"
                disabled={pending !== null}
                onClick={() => connect(row.provider)}
                className="rounded-full border border-role-cta/35 bg-role-cta-soft px-4 py-2 text-sm font-semibold text-role-cta-on-soft disabled:opacity-50"
              >
                {pending === row.provider ? "Connecting…" : "Connect"}
              </button>
            )}
          </li>
        ))}
      </ul>
      {error ? (
        <p className="border-t border-border/50 px-5 py-3 text-sm text-[var(--semantic-danger)]" role="alert">
          {error}
        </p>
      ) : null}
      {!snapshot.hasPassword && snapshot.links.length <= 1 ? (
        <p className="border-t border-border/50 px-5 py-3 text-xs text-muted-foreground">
          Keep at least one sign-in method. Set a password before removing your only connected provider.
        </p>
      ) : null}
    </section>
  );
}
