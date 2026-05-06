"use client";

import { useState } from "react";

type Props = {
  apiPath: string;
  label?: string;
  onSuccess?: () => void;
};

/**
 * Small inline button that POSTs to an admin retry-repair endpoint and shows
 * success/error feedback without a full page reload.
 */
export function AdminBlogRepairRetryButton({ apiPath, label = "Retry repair", onSuccess }: Props) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState<string | null>(null);

  async function handleClick() {
    setState("loading");
    setErrMsg(null);
    try {
      const res = await fetch(apiPath, { method: "POST", credentials: "include" });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setErrMsg(json.error ?? `Request failed (HTTP ${res.status})`);
        setState("error");
        return;
      }
      setState("done");
      onSuccess?.();
    } catch (e) {
      setErrMsg(e instanceof Error ? e.message : String(e));
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
        Re-queued — will retry on next cron run.
      </span>
    );
  }

  return (
    <span className="inline-flex flex-col gap-0.5">
      <button
        type="button"
        disabled={state === "loading"}
        onClick={() => void handleClick()}
        className="rounded border border-amber-400/60 bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-800 hover:bg-amber-500/20 disabled:opacity-50 dark:text-amber-200"
      >
        {state === "loading" ? "Queuing…" : label}
      </button>
      {state === "error" && errMsg ? (
        <span className="text-xs text-rose-700 dark:text-rose-300">{errMsg}</span>
      ) : null}
    </span>
  );
}
