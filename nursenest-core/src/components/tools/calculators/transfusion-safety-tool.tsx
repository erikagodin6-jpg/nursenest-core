"use client";

import { useState } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import questions from "@/content/transfusion-safety-questions.json";

type Q = {
  promptKey: string;
  options: string[];
  correctIndex: number;
  rationaleKey: string;
};

const DATA = questions as Q[];

export default function TransfusionSafetyTool() {
  const { t } = useMarketingI18n();
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const q = DATA[idx];

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--theme-muted-text)]">{t("tools.transfusionSafety.intro")}</p>
      <div className="rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-page-bg)] p-4">
        <p className="font-medium text-[var(--theme-heading-text)]">{t(q.promptKey)}</p>
        <ul className="mt-3 space-y-2">
          {q.options.map((optKey, i) => (
            <li key={optKey}>
              <button
                type="button"
                onClick={() => setPicked(i)}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                  picked === i ? "border-primary bg-primary/10" : "border-[var(--theme-card-border)] bg-[var(--theme-card-bg)]"
                }`}
              >
                {t(optKey)}
              </button>
            </li>
          ))}
        </ul>
        {picked !== null ? (
          <p
            className={`mt-3 text-sm ${picked === q.correctIndex ? "text-emerald-800" : "text-amber-900"}`}
          >
            {t(q.rationaleKey)}
          </p>
        ) : null}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="rounded-full border border-border px-3 py-1.5 text-sm font-medium"
            onClick={() => {
              setIdx((j) => (j - 1 + DATA.length) % DATA.length);
              setPicked(null);
            }}
          >
            Previous
          </button>
          <button
            type="button"
            className="rounded-full border border-border px-3 py-1.5 text-sm font-medium"
            onClick={() => {
              setIdx((j) => (j + 1) % DATA.length);
              setPicked(null);
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
