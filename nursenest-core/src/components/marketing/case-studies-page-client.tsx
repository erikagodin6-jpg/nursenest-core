"use client";

import { useState } from "react";
import cases from "@/content/clinical-case-studies.json";

type CaseItem = {
  id: string;
  title: string;
  summary: string;
  vignette: string;
  question: string;
  options: string[];
  correctIndex: number;
  takeaway: string;
};

const DATA = cases as CaseItem[];

export function CaseStudiesPageClient() {
  const [open, setOpen] = useState<string | null>(DATA[0]?.id ?? null);
  const [picked, setPicked] = useState<Record<string, number | null>>({});

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)]">Clinical case studies</h1>
        <p className="mt-3 text-lg text-[var(--theme-muted-text)]">
          Short, exam-style vignettes with prioritization and safety reasoning—pair with your question bank sessions.
        </p>
      </header>
      <ul className="space-y-4">
        {DATA.map((c) => {
          const isOpen = open === c.id;
          const choice = picked[c.id] ?? null;
          return (
            <li key={c.id} className="rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] shadow-sm">
              <button
                type="button"
                className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left"
                onClick={() => setOpen(isOpen ? null : c.id)}
              >
                <div>
                  <h2 className="font-bold text-[var(--theme-heading-text)]">{c.title}</h2>
                  <p className="mt-1 text-sm text-[var(--theme-muted-text)]">{c.summary}</p>
                </div>
                <span className="shrink-0 text-sm text-primary">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen ? (
                <div className="border-t border-[var(--theme-separator)] px-5 pb-5 pt-2">
                  <p className="text-sm leading-relaxed text-[var(--theme-heading-text)]">{c.vignette}</p>
                  <p className="mt-4 text-sm font-semibold text-[var(--theme-heading-text)]">{c.question}</p>
                  <ul className="mt-3 space-y-2">
                    {c.options.map((opt, i) => (
                      <li key={opt}>
                        <button
                          type="button"
                          onClick={() => setPicked((p) => ({ ...p, [c.id]: i }))}
                          className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                            choice === i ? "border-primary bg-primary/10" : "border-[var(--theme-card-border)]"
                          }`}
                        >
                          {opt}
                        </button>
                      </li>
                    ))}
                  </ul>
                  {choice !== null ? (
                    <p
                      className={`mt-3 text-sm ${choice === c.correctIndex ? "text-emerald-800" : "text-amber-900"}`}
                    >
                      <span className="font-semibold">Takeaway: </span>
                      {c.takeaway}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
