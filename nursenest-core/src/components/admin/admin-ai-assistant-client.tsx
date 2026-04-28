"use client";

import React from "react";
import { useState } from "react";
import { Clipboard, Sparkles, Stethoscope } from "lucide-react";
import { useAdminAiGenerationGate } from "@/components/admin/admin-ai-generation-context";
import {
  ADMIN_AI_ASSISTANT_TASKS,
  type AdminAiAssistantTaskType,
} from "@/lib/admin/admin-ai-assistant";

type AssistantResponse = {
  ok?: boolean;
  output?: string;
  notice?: string;
  error?: string;
  hint?: string;
};

const DEFAULT_TASK = ADMIN_AI_ASSISTANT_TASKS[0];

function activeTask(taskType: AdminAiAssistantTaskType) {
  return ADMIN_AI_ASSISTANT_TASKS.find((task) => task.value === taskType) ?? DEFAULT_TASK;
}

export function AdminAiAssistantClient() {
  const aiGate = useAdminAiGenerationGate();
  const [taskType, setTaskType] = useState<AdminAiAssistantTaskType>(DEFAULT_TASK.value);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState("");
  const [notice, setNotice] = useState("Draft only. Nothing here publishes, emails, saves, or deploys automatically.");
  const [copied, setCopied] = useState(false);

  const task = activeTask(taskType);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    const trimmed = input.trim();
    if (!trimmed) {
      setError("Input is required.");
      return;
    }

    setLoading(true);
    setError(null);
    setCopied(false);

    try {
      const res = await fetch("/api/admin/ai-assistant", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskType, input: trimmed }),
      });
      const data = (await res.json().catch(() => ({}))) as AssistantResponse;
      if (!res.ok) {
        setError(String(data.error ?? data.hint ?? `Request failed (${res.status})`));
        setOutput("");
        return;
      }
      setOutput(String(data.output ?? ""));
      setNotice(String(data.notice ?? "Draft only. Review and approve manually."));
    } catch {
      setError("Network error while contacting the admin AI assistant.");
      setOutput("");
    } finally {
      setLoading(false);
    }
  }

  async function onCopy() {
    if (!output.trim()) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
      <section className="overflow-hidden rounded-3xl border border-border/70 bg-[linear-gradient(145deg,rgba(14,116,144,0.10),rgba(255,255,255,0.96)_42%,rgba(10,37,64,0.05))] shadow-[0_28px_80px_-42px_rgba(15,23,42,0.45)]">
        <div className="border-b border-border/60 px-6 py-6 sm:px-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-950 text-cyan-50 shadow-sm">
              <Stethoscope className="h-6 w-6" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-900/80">Admin Assistant</p>
              <h2 className="mt-1 text-2xl font-semibold text-[var(--theme-heading-text)]">Draft-first clinical operations AI</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">
                Use this for internal drafts and recommendations only. Human admin review stays required before anything becomes real.
              </p>
            </div>
          </div>
        </div>

        <form className="space-y-6 px-6 py-6 sm:px-8" onSubmit={(e) => void onSubmit(e)}>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {ADMIN_AI_ASSISTANT_TASKS.map((option) => {
              const selected = option.value === taskType;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTaskType(option.value)}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    selected
                      ? "border-cyan-700 bg-cyan-950 text-cyan-50 shadow-sm"
                      : "border-border/70 bg-white/80 text-slate-900 hover:border-cyan-300 hover:bg-cyan-50/70"
                  }`}
                  aria-pressed={selected}
                >
                  <div className="text-sm font-semibold">{option.label}</div>
                  <div className={`mt-2 text-xs leading-5 ${selected ? "text-cyan-100/90" : "text-slate-600"}`}>
                    {option.description}
                  </div>
                </button>
              );
            })}
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-900">Input</span>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={task.placeholder}
              className="mt-2 min-h-[280px] w-full rounded-2xl border border-border/70 bg-white/90 px-4 py-4 text-sm leading-6 text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-cyan-700 focus:ring-2 focus:ring-cyan-200"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={loading || !input.trim() || !aiGate.runnable}
              className="inline-flex items-center gap-2 rounded-2xl bg-cyan-900 px-5 py-3 text-sm font-semibold text-cyan-50 shadow-sm transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              {loading ? "Generating draft…" : "Generate Draft"}
            </button>
            <p className="text-xs leading-5 text-slate-600">
              Guardrails: no billing promises, no refund decisions, no medical advice beyond educational exam prep, no deploy/code changes.
            </p>
          </div>

          {error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        </form>
      </section>

      <aside className="overflow-hidden rounded-3xl border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,249,255,0.88))] shadow-[0_20px_70px_-44px_rgba(15,23,42,0.45)]">
        <div className="border-b border-border/60 px-6 py-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Output Preview</p>
              <h3 className="mt-1 text-lg font-semibold text-[var(--theme-heading-text)]">{task.label}</h3>
            </div>
            <button
              type="button"
              onClick={() => void onCopy()}
              disabled={!output.trim()}
              className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-white/85 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Clipboard className="h-4 w-4" aria-hidden />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-600">{notice}</p>
        </div>

        <div className="px-6 py-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-950 px-4 py-4 shadow-inner">
            <pre className="min-h-[360px] whitespace-pre-wrap text-sm leading-6 text-slate-100">
              {output || "Draft preview will appear here after generation."}
            </pre>
          </div>
        </div>
      </aside>
    </div>
  );
}
