"use client";

import { useMemo, useState } from "react";
import { Image as ImageIcon, Search, Stethoscope, Volume2, Wind } from "lucide-react";
import { ClinicalAudioBlock } from "@/components/clinical-media/clinical-audio-block";
import { ClinicalImageBlock } from "@/components/clinical-media/clinical-image-block";
import {
  CLINICAL_MEDIA_PATHWAYS,
  CLINICAL_MEDIA_TYPE_LABELS,
  type ClinicalMediaAsset,
  type ClinicalMediaPathway,
  type ClinicalMediaType,
} from "@/lib/clinical-media/clinical-media-library";

function sourceLabel(asset: ClinicalMediaAsset) {
  if (asset.sourceKind === "uploaded_audio") return "Uploaded audio";
  if (asset.sourceKind === "synthesized_audio") return "Audio simulator";
  if (asset.sourceKind === "image") return "Visual asset";
  return "Mapping placeholder";
}

function audioParts(asset: ClinicalMediaAsset) {
  const [kind, soundId] = asset.id.split(":");
  if ((kind === "respiratory" || kind === "cardiac") && soundId) {
    return { kind, soundId } as const;
  }
  return null;
}

function MediaIcon({ asset }: { asset: ClinicalMediaAsset }) {
  if (asset.type === "respiratory_sound") return <Wind className="h-4 w-4" aria-hidden />;
  if (asset.type === "cardiac_sound") return <Stethoscope className="h-4 w-4" aria-hidden />;
  if (asset.sourceKind === "image") return <ImageIcon className="h-4 w-4" aria-hidden />;
  return <Volume2 className="h-4 w-4" aria-hidden />;
}

export function ClinicalMediaLibraryClient({
  items,
  typeCoverage,
  pathwayCoverage,
}: {
  items: ClinicalMediaAsset[];
  typeCoverage: Array<{ type: ClinicalMediaType; label: string; count: number }>;
  pathwayCoverage: Array<{ pathway: ClinicalMediaPathway; count: number }>;
}) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<ClinicalMediaType | "all">("all");
  const [pathway, setPathway] = useState<ClinicalMediaPathway>("RN");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (type !== "all" && item.type !== type) return false;
      if (!item.pathways.includes(pathway)) return false;
      if (!q) return true;
      return [
        item.title,
        item.module,
        item.category,
        item.description,
        item.clinicalSignificance,
        item.clinicalPearl,
        ...item.commonCauses,
        ...item.examTips,
      ].join(" ").toLowerCase().includes(q);
    });
  }, [items, pathway, query, type]);

  return (
    <div className="space-y-6">
      <section className="nn-learner-page-hero">
        <p className="nn-ls-kicker">Clinical Media Library</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--semantic-text-primary)]">
          Clinical media learning center
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--semantic-text-secondary)]">
          Reusable respiratory sounds, cardiac sounds, ECG/clinical visuals, and future media mapped into one pathway-aware learning inventory.
        </p>
        <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_14rem_14rem]">
          <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4">
            <Search className="h-4 w-4 text-[var(--semantic-text-muted)]" aria-hidden />
            <span className="sr-only">Search clinical media</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search wheeze, S3, ECG, image..."
              className="min-w-0 flex-1 bg-transparent text-sm text-[var(--semantic-text-primary)] outline-none placeholder:text-[var(--semantic-text-muted)]"
            />
          </label>
          <label className="sr-only" htmlFor="clinical-media-type">Media type</label>
          <select
            id="clinical-media-type"
            value={type}
            onChange={(event) => setType(event.target.value as ClinicalMediaType | "all")}
            className="min-h-12 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 text-sm font-semibold text-[var(--semantic-text-primary)]"
          >
            <option value="all">All media</option>
            {typeCoverage.map((row) => (
              <option key={row.type} value={row.type}>
                {row.label} ({row.count})
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="clinical-media-pathway">Pathway overlay</label>
          <select
            id="clinical-media-pathway"
            value={pathway}
            onChange={(event) => setPathway(event.target.value as ClinicalMediaPathway)}
            className="min-h-12 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 text-sm font-semibold text-[var(--semantic-text-primary)]"
          >
            {CLINICAL_MEDIA_PATHWAYS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Clinical media coverage">
        {typeCoverage.map((row) => (
          <article key={row.type} className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
            <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{row.label}</p>
            <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">
              {row.count > 0 ? `${row.count} mapped asset${row.count === 1 ? "" : "s"}` : "Needs upload/mapping"}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Pathway coverage">
        {pathwayCoverage.map((row) => (
          <article key={row.pathway} className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
            <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{row.pathway}</p>
            <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">{row.count} available media mappings</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-2" aria-label="Clinical media results">
        {filtered.map((asset) => {
          const audio = audioParts(asset);
          return (
            <article
              key={asset.id}
              className="rounded-3xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)] sm:p-5"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--semantic-panel-muted)] text-[var(--semantic-brand)]">
                  <MediaIcon asset={asset} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--semantic-brand)]">
                    {CLINICAL_MEDIA_TYPE_LABELS[asset.type]} · {sourceLabel(asset)}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-[var(--semantic-text-primary)]">{asset.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--semantic-text-secondary)]">{asset.description}</p>
                </div>
              </div>

              <div className="mt-4">
                {asset.sourceKind === "uploaded_audio" && asset.sourceUrl ? (
                  <audio className="w-full" controls preload="none" src={asset.sourceUrl}>
                    Your browser does not support the audio element.
                  </audio>
                ) : audio ? (
                  <ClinicalAudioBlock
                    kind={audio.kind}
                    soundId={audio.soundId}
                    showAuscultationSite
                    showSignificance
                  />
                ) : asset.sourceKind === "image" && asset.sourceUrl ? (
                  <ClinicalImageBlock
                    url={asset.sourceUrl}
                    alt={asset.title}
                    caption={asset.description}
                    compact
                  />
                ) : (
                  <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4 text-sm text-[var(--semantic-text-secondary)]">
                    Media upload pending.
                  </div>
                )}
              </div>

              <dl className="mt-5 grid gap-4 text-sm md:grid-cols-2">
                {asset.location ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">Location</dt>
                    <dd className="mt-1 text-[var(--semantic-text-secondary)]">{asset.location}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">Clinical significance</dt>
                  <dd className="mt-1 text-[var(--semantic-text-secondary)]">{asset.clinicalSignificance}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">Common causes</dt>
                  <dd className="mt-1 text-[var(--semantic-text-secondary)]">
                    {asset.commonCauses.length ? asset.commonCauses.join(", ") : "Context-dependent"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">Exam tips</dt>
                  <dd className="mt-1 text-[var(--semantic-text-secondary)]">{asset.examTips.join(" ")}</dd>
                </div>
              </dl>

              <div className="mt-5 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">Clinical pearl</p>
                <p className="mt-1 text-sm leading-6 text-[var(--semantic-text-secondary)]">{asset.clinicalPearl}</p>
                {asset.pathwayOverlays[pathway] ? (
                  <p className="mt-3 text-sm leading-6 text-[var(--semantic-text-secondary)]">
                    <span className="font-semibold text-[var(--semantic-text-primary)]">{pathway} overlay: </span>
                    {asset.pathwayOverlays[pathway]}
                  </p>
                ) : null}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
