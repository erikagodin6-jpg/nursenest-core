"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Eye, Monitor, Plus, Smartphone } from "lucide-react";
import {
  HOTSPOT_ASSETS,
  HOTSPOT_OVERLAYS,
  HOTSPOT_QUESTIONS,
  HOTSPOT_SUPPORTED_CONTENT,
  HOTSPOT_WORKFLOW_PHASES,
  normalizeHotspotPoint,
  validateHotspotAsset,
  validateHotspotOverlay,
  validateHotspotQuestionForPublication,
  type HotspotPoint,
  type HotspotRegion,
  type HotspotRegionRole,
  type HotspotRegionShape,
} from "@/lib/hotspots/hotspot-question-infrastructure";

type PreviewMode = "desktop" | "mobile";

export function HotspotEditorClient() {
  const asset = HOTSPOT_ASSETS[0];
  const overlay = HOTSPOT_OVERLAYS[0];
  const [regions, setRegions] = useState<HotspotRegion[]>(overlay.regions);
  const [shape, setShape] = useState<HotspotRegionShape>("rectangle");
  const [role, setRole] = useState<HotspotRegionRole>("correct");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [previewOnly, setPreviewOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(regions[0]?.id ?? null);

  const draftOverlay = useMemo(() => ({ ...overlay, regions }), [overlay, regions]);
  const assetValidation = validateHotspotAsset(asset);
  const overlayValidation = validateHotspotOverlay(draftOverlay, asset);
  const questionValidation = validateHotspotQuestionForPublication(HOTSPOT_QUESTIONS[0], overlay);
  const selected = regions.find((region) => region.id === selectedId) ?? null;

  function addRegion(point: HotspotPoint) {
    if (previewOnly) return;
    const normalized = normalizeHotspotPoint(point);
    const id = `draft-region-${Date.now()}`;
    const next: HotspotRegion = {
      id,
      label: role === "correct" ? "New Correct Region" : "New Distractor Region",
      role,
      shape,
      points:
        shape === "polygon"
          ? [
              normalized,
              normalizeHotspotPoint({ x: normalized.x + 10, y: normalized.y + 4 }),
              normalizeHotspotPoint({ x: normalized.x + 3, y: normalized.y + 14 }),
            ]
          : [normalized, normalizeHotspotPoint({ x: normalized.x + 12, y: normalized.y + 10 })],
      rationale: "Draft rationale: explain why this region is correct or distracting before clinical review.",
    };
    setRegions((current) => [...current, next]);
    setSelectedId(id);
  }

  function resizeSelected(delta: number) {
    if (!selected) return;
    setRegions((current) =>
      current.map((region) => {
        if (region.id !== selected.id) return region;
        if (region.shape === "polygon") {
          return {
            ...region,
            points: region.points.map((point, index) =>
              index === 0 ? point : normalizeHotspotPoint({ x: point.x + delta, y: point.y + delta }),
            ),
          };
        }
        const [start, end] = region.points;
        return { ...region, points: [start, normalizeHotspotPoint({ x: end.x + delta, y: end.y + delta })] };
      }),
    );
  }

  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="rounded-2xl border border-border bg-[var(--theme-card-bg)] p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">Hotspot Overlay Editor</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Click the image to place reusable coordinate regions. The image asset remains independent from questions.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <EditorButton active={previewMode === "desktop"} onClick={() => setPreviewMode("desktop")}>
              <Monitor className="h-4 w-4" aria-hidden /> Desktop
            </EditorButton>
            <EditorButton active={previewMode === "mobile"} onClick={() => setPreviewMode("mobile")}>
              <Smartphone className="h-4 w-4" aria-hidden /> Mobile
            </EditorButton>
            <EditorButton active={previewOnly} onClick={() => setPreviewOnly((value) => !value)}>
              <Eye className="h-4 w-4" aria-hidden /> Preview
            </EditorButton>
          </div>
        </div>

        <div className="mt-5 grid gap-3 rounded-xl border border-border bg-muted/30 p-3 sm:grid-cols-3">
          <label className="space-y-1 text-sm">
            <span className="font-semibold">Region Shape</span>
            <select value={shape} onChange={(event) => setShape(event.target.value as HotspotRegionShape)} className="h-10 w-full rounded-md border border-border bg-background px-3">
              <option value="rectangle">Rectangle</option>
              <option value="circle">Circle</option>
              <option value="polygon">Polygon</option>
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-semibold">Region Role</span>
            <select value={role} onChange={(event) => setRole(event.target.value as HotspotRegionRole)} className="h-10 w-full rounded-md border border-border bg-background px-3">
              <option value="correct">Correct Region</option>
              <option value="distractor">Distractor Region</option>
            </select>
          </label>
          <div className="flex items-end gap-2">
            <EditorButton active={false} onClick={() => resizeSelected(2)} disabled={!selected}>
              <Plus className="h-4 w-4" aria-hidden /> Resize Selected
            </EditorButton>
          </div>
        </div>

        <div
          className={`mx-auto mt-5 overflow-hidden rounded-2xl border border-border bg-white shadow-sm ${
            previewMode === "mobile" ? "max-w-[390px]" : "max-w-4xl"
          }`}
        >
          <button
            type="button"
            className="relative block w-full cursor-crosshair"
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              addRegion({
                x: ((event.clientX - rect.left) / rect.width) * 100,
                y: ((event.clientY - rect.top) / rect.height) * 100,
              });
            }}
          >
            <img src={asset.url} alt={asset.alt} className="block w-full" />
            {regions.map((region) => (
              <RegionOverlay key={region.id} region={region} selected={region.id === selectedId} onSelect={() => setSelectedId(region.id)} />
            ))}
          </button>
        </div>
      </section>

      <aside className="space-y-5">
        <AdminPanel title="Workflow">
          <ol className="space-y-2 text-sm">
            {HOTSPOT_WORKFLOW_PHASES.map((phase, index) => (
              <li key={phase} className="flex items-center gap-2 rounded-lg border border-border p-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {index + 1}
                </span>
                {phase}
              </li>
            ))}
          </ol>
        </AdminPanel>

        <AdminPanel title="Validation">
          <ValidationLine label="Image Asset" ok={assetValidation.ok} issues={assetValidation.issues} />
          <ValidationLine label="Overlay" ok={overlayValidation.ok} issues={overlayValidation.issues} />
          <ValidationLine label="Question" ok={questionValidation.ok} issues={questionValidation.issues} />
        </AdminPanel>

        <AdminPanel title="Selected Region">
          {selected ? (
            <div className="space-y-2 text-sm">
              <p className="font-semibold">{selected.label}</p>
              <p className="text-muted-foreground">{selected.shape} / {selected.role}</p>
              <p className="rounded-lg bg-muted p-2 font-mono text-xs">{JSON.stringify(selected.points)}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select a region to inspect coordinates.</p>
          )}
        </AdminPanel>

        <AdminPanel title="Supported Hotspot Types">
          <div className="space-y-3 text-sm">
            {Object.entries(HOTSPOT_SUPPORTED_CONTENT).map(([profession, items]) => (
              <div key={profession}>
                <p className="font-semibold capitalize">{profession.replace(/_/g, " ")}</p>
                <p className="text-muted-foreground">{items.join(", ")}</p>
              </div>
            ))}
          </div>
        </AdminPanel>
      </aside>
    </div>
  );
}

function RegionOverlay({ region, selected, onSelect }: { region: HotspotRegion; selected: boolean; onSelect: () => void }) {
  const color = region.role === "correct" ? "var(--semantic-success)" : "var(--semantic-warning)";
  if (region.shape === "polygon") {
    const points = region.points.map((point) => `${point.x},${point.y}`).join(" ");
    return (
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon points={points} fill="color-mix(in srgb, var(--semantic-success) 20%, transparent)" stroke={color} strokeWidth={selected ? 1.2 : 0.7} />
      </svg>
    );
  }
  const [start, end] = region.points;
  const left = Math.min(start.x, end.x);
  const top = Math.min(start.y, end.y);
  const width = Math.abs(end.x - start.x);
  const height = Math.abs(end.y - start.y);
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onSelect();
      }}
      className="absolute border-2 bg-white/10"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${width}%`,
        height: `${height}%`,
        borderColor: color,
        borderRadius: region.shape === "circle" ? "9999px" : "0.75rem",
        outline: selected ? "3px solid var(--semantic-brand)" : undefined,
      }}
    />
  );
}

function AdminPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-[var(--theme-card-bg)] p-5 shadow-sm">
      <h2 className="text-base font-bold text-[var(--theme-heading-text)]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ValidationLine({ label, ok, issues }: { label: string; ok: boolean; issues: string[] }) {
  return (
    <div className="mb-3 rounded-lg border border-border p-3 text-sm last:mb-0">
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold">{label}</span>
        <span className={ok ? "text-[var(--semantic-success)]" : "text-[var(--semantic-warning)]"}>{ok ? "Ready" : "Needs Work"}</span>
      </div>
      {issues.length ? <p className="mt-2 text-xs text-muted-foreground">{issues.join(", ")}</p> : null}
    </div>
  );
}

function EditorButton({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition disabled:opacity-50 ${
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}
