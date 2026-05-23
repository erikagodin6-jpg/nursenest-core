"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useMarketingI18n } from "@/lib/marketing-i18n";

type PrintableListItem = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  pathwayId: string | null;
  roleTrack: string | null;
  isFree: boolean;
  isPremiumIncluded: boolean;
  priceCents: number;
  currency: string;
  hasThumbnail: boolean;
};

export function PrintablesLearnerHub() {
  const { t } = useMarketingI18n();
  const [items, setItems] = useState<PrintableListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/printables?take=40", { credentials: "same-origin" });
      const data = (await res.json()) as { ok?: boolean; items?: PrintableListItem[]; code?: string };
      if (!res.ok || !data.ok) {
        setError(t("learner.printables.loadError"));
        setItems([]);
        return;
      }
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch {
      setError(t("learner.printables.loadError"));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-[var(--semantic-text-primary)] sm:text-3xl">
          {t("learner.printables.title")}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          {t("learner.printables.subtitle")}
        </p>
      </header>

      {loading ? (
        <p className="text-sm text-[var(--semantic-text-muted)]" role="status">
          …
        </p>
      ) : error ? (
        <div
          className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-danger)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_08%,var(--semantic-surface))] px-4 py-3 text-sm text-[var(--semantic-text-primary)]"
          role="alert"
        >
          {error}
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-[var(--semantic-text-secondary)]">{t("learner.printables.empty")}</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {items.map((p) => (
            <li
              key={p.id}
              className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-sm"
            >
              <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">{p.title}</h2>
              {p.description ? (
                <p className="mt-2 line-clamp-3 text-sm text-[var(--semantic-text-secondary)]">{p.description}</p>
              ) : null}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Link
                  href={`/api/printables/${encodeURIComponent(p.id)}/download`}
                  className="nn-btn-primary inline-flex min-h-10 items-center justify-center rounded-full px-4 text-sm font-semibold"
                  prefetch={false}
                >
                  {t("learner.printables.download")}
                </Link>
                {p.isFree ? (
                  <span className="nn-badge-semantic-success text-[11px]">{t("learner.printables.badgeFree")}</span>
                ) : p.isPremiumIncluded ? (
                  <span className="nn-badge-semantic-info text-[11px]">{t("learner.printables.badgeProIncluded")}</span>
                ) : (
                  <span className="text-xs text-[var(--semantic-text-muted)]">
                    {(p.priceCents / 100).toFixed(2)} {p.currency}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
