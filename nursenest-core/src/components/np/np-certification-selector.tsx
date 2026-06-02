"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Brain, ClipboardCheck, GraduationCap, LineChart, Stethoscope } from "lucide-react";
import type { NpCertificationCountry, NpCertificationPathway } from "@/lib/np/np-certification-pathways";

function formatCount(value: number, fallback: string): string {
  return value > 0 ? value.toLocaleString("en-US") : fallback;
}

function countryOrder(country: NpCertificationCountry): number {
  return country === "Canada" ? 0 : 1;
}

export function NpCertificationSelector({
  pathways,
  selectedPathwayId,
  returnTo = "/app",
}: {
  pathways: NpCertificationPathway[];
  selectedPathwayId: string | null;
  returnTo?: string;
}) {
  const router = useRouter();
  const [busyPathwayId, setBusyPathwayId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const groups = useMemo(() => {
    const byCountry = new Map<NpCertificationCountry, NpCertificationPathway[]>();
    for (const pathway of pathways) {
      const rows = byCountry.get(pathway.country) ?? [];
      rows.push(pathway);
      byCountry.set(pathway.country, rows);
    }
    return [...byCountry.entries()].sort((a, b) => countryOrder(a[0]) - countryOrder(b[0]));
  }, [pathways]);

  async function selectPathway(pathwayId: string) {
    setBusyPathwayId(pathwayId);
    setError(null);
    try {
      const res = await fetch("/api/learner/np-certification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathwayId }),
      });
      if (!res.ok) {
        setError("We could not save that certification pathway. Please try again.");
        return;
      }
      router.push(`${returnTo}${returnTo.includes("?") ? "&" : "?"}pathwayId=${encodeURIComponent(pathwayId)}`);
      router.refresh();
    } finally {
      setBusyPathwayId(null);
    }
  }

  function onCardKeyDown(event: KeyboardEvent<HTMLButtonElement>, pathwayId: string) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    void selectPathway(pathwayId);
  }

  return (
    <section className="space-y-6" data-testid="np-certification-selector" aria-labelledby="np-certification-selector-title">
      <div className="nn-learner-page-hero">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--semantic-brand)]">Nurse Practitioner Pathway</p>
        <h1 id="np-certification-selector-title" className="mt-3 text-3xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-4xl">
          Choose Your Nurse Practitioner Certification Pathway
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)] sm:text-base">
          Your selected certification scopes questions, lessons, flashcards, simulations, readiness tracking, rationales, and clinical pearls across NurseNest.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_08%,var(--semantic-surface))] px-4 py-3 text-sm text-[var(--semantic-text-primary)]">
          {error}
        </div>
      ) : null}

      <div className="space-y-8">
        {groups.map(([country, rows]) => (
          <div key={country} className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">{country}</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {rows.map((pathway) => {
                const selected = pathway.pathwayId === selectedPathwayId;
                const busy = busyPathwayId === pathway.pathwayId;
                return (
                  <button
                    key={pathway.pathwayId}
                    type="button"
                    onClick={() => void selectPathway(pathway.pathwayId)}
                    onKeyDown={(event) => onCardKeyDown(event, pathway.pathwayId)}
                    disabled={busyPathwayId != null}
                    className="group flex min-h-[18rem] w-full flex-col rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 text-left shadow-[var(--semantic-shadow-soft)] transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--semantic-brand)_30%,var(--semantic-border-soft))] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)] disabled:cursor-wait disabled:opacity-75 motion-reduce:transform-none"
                    aria-pressed={selected}
                    data-np-certification-card={pathway.pathwayId}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_08%,var(--semantic-surface))] text-[var(--semantic-brand)]">
                        <GraduationCap className="h-5 w-5" aria-hidden />
                      </span>
                      {selected ? (
                        <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] px-3 py-1 text-xs font-semibold text-[var(--semantic-success)]">
                          Selected
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-bold text-[var(--semantic-text-primary)]">{pathway.shortName}</h3>
                      <p className="mt-1 text-sm font-semibold text-[var(--semantic-text-primary)]">{pathway.name}</p>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{pathway.description}</p>
                    </div>
                    <dl className="mt-4 grid gap-2 text-xs text-[var(--semantic-text-secondary)] sm:grid-cols-2">
                      <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface))] p-3">
                        <dt className="flex items-center gap-2 font-semibold text-[var(--semantic-text-primary)]"><ClipboardCheck className="h-3.5 w-3.5" aria-hidden /> Questions</dt>
                        <dd className="mt-1">{formatCount(pathway.questions, "Pathway-scoped")} questions</dd>
                      </div>
                      <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-success)_06%,var(--semantic-surface))] p-3">
                        <dt className="flex items-center gap-2 font-semibold text-[var(--semantic-text-primary)]"><BookOpen className="h-3.5 w-3.5" aria-hidden /> Lessons</dt>
                        <dd className="mt-1">{formatCount(pathway.lessons, "Pathway-scoped")} lessons</dd>
                      </div>
                      <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-3)_06%,var(--semantic-surface))] p-3">
                        <dt className="flex items-center gap-2 font-semibold text-[var(--semantic-text-primary)]"><Brain className="h-3.5 w-3.5" aria-hidden /> Flashcards</dt>
                        <dd className="mt-1">{pathway.flashcardsLabel}</dd>
                      </div>
                      <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-warning)_08%,var(--semantic-surface))] p-3">
                        <dt className="flex items-center gap-2 font-semibold text-[var(--semantic-text-primary)]"><LineChart className="h-3.5 w-3.5" aria-hidden /> Readiness</dt>
                        <dd className="mt-1">{pathway.readinessTrackingLabel}</dd>
                      </div>
                    </dl>
                    <div className="mt-4 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_04%,var(--semantic-surface))] p-3">
                      <p className="flex items-start gap-2 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
                        <Stethoscope className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--semantic-brand)]" aria-hidden />
                        <span>{pathway.expectedRole}</span>
                      </p>
                    </div>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                      <span className="text-xs font-semibold text-[var(--semantic-brand)]">{pathway.hubHref}</span>
                      <span className="rounded-full bg-[var(--semantic-brand)] px-4 py-2 text-sm font-semibold text-[var(--semantic-on-brand)]">
                        {busy ? "Saving..." : selected ? "Continue" : "Select pathway"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
