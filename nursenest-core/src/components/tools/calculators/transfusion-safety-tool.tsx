"use client";

import { useState } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";

type Q = {
  promptKey: string;
  options: string[];
  correctIndex: number;
  rationaleKey: string;
};

let questionsCache: Q[] | null = null;

function getQuestions(): Q[] {
  if (questionsCache) return questionsCache;
  questionsCache = require("@/content/transfusion-safety-questions.json") as Q[];
  return questionsCache;
}

export default function TransfusionSafetyTool() {
  const { t } = useMarketingI18n();
  const data = getQuestions();
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const q = data[idx];

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--theme-muted-text)]">{t("tools.transfusionSafety.intro")}</p>
      <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_1,var(--border))] bg-[var(--semantic-surface)] p-4 shadow-[var(--elevation-rest)]">
        <p className="nn-marketing-body-sm font-semibold text-[var(--semantic-text-primary)]">{t(q.promptKey)}</p>
        <ul className="mt-3 space-y-2">
          {q.options.map((optKey, i) => (
            <li key={optKey}>
              <button
                type="button"
                onClick={() => setPicked(i)}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_40%,transparent)] ${
                  picked === i
                    ? "border-[color-mix(in_srgb,var(--semantic-brand)_42%,var(--border))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))]"
                    : "border-[color-mix(in_srgb,var(--semantic-border-soft)_1,var(--border))] bg-[color-mix(in_srgb,var(--semantic-text-muted)_4%,var(--semantic-surface))]"
                }`}
              >
                {t(optKey)}
              </button>
            </li>
          ))}
        </ul>
        {picked !== null ? (
          <p
            className={`mt-3 text-sm ${
              picked === q.correctIndex ? "text-[var(--semantic-success)]" : "text-[var(--semantic-warning)]"
            }`}
          >
            {t(q.rationaleKey)}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-full border border-[color-mix(in_srgb,var(--semantic-border-soft)_1,var(--border))] bg-[color-mix(in_srgb,var(--semantic-text-muted)_5%,var(--semantic-surface))] px-3 py-1.5 text-sm font-semibold text-[var(--semantic-text-primary)] shadow-[var(--elevation-rest)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--border))]"
            onClick={() => {
              setIdx((j) => (j - 1 + data.length) % data.length);
              setPicked(null);
            }}
          >
            {t("common.previous")}
          </button>
          <button
            type="button"
            className="rounded-full border border-[color-mix(in_srgb,var(--semantic-border-soft)_1,var(--border))] bg-[color-mix(in_srgb,var(--semantic-text-muted)_5%,var(--semantic-surface))] px-3 py-1.5 text-sm font-semibold text-[var(--semantic-text-primary)] shadow-[var(--elevation-rest)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--border))]"
            onClick={() => {
              setIdx((j) => (j + 1) % data.length);
              setPicked(null);
            }}
          >
            {t("common.next")}
          </button>
        </div>
      </div>
    </div>
  );
}
