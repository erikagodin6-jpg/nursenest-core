"use client";

/**
 * Admin screenshot registry viewer.
 *
 * Shows all screenshots registered in screenshot-registry.ts with:
 *   - Live thumbnail from the CDN
 *   - Metadata (feature, label, description)
 *   - The screenshot ID and object key for reference
 *
 * Also displays the capture workflow so admins know how to add new screenshots.
 */

import { useState } from "react";
import { MarketingChainScreenshot } from "@/components/marketing/marketing-screenshot-stack";
import {
  SCREENSHOT_REGISTRY,
  SCREENSHOT_CDN_BASE,
  type ScreenshotRecord,
} from "@/lib/marketing/screenshot-registry";

const DEMO_EMAIL = "demo-screenshots@internal.nursenest.io";

type Tab = "registry" | "workflow";

function RegistryCard({ record }: { record: ScreenshotRecord }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
      {/* Thumbnail */}
      <MarketingChainScreenshot
        objectKey={record.objectKey}
        publicUrl={record.publicUrl}
        alt={record.alt ?? record.label}
        aspectRatio="16 / 10"
        fit="contain"
        rounded="rounded-none"
        imgClassName="object-top"
      />

      {/* Metadata */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-[var(--theme-heading-text)]">
            {record.label}
          </span>
          <span className="shrink-0 rounded-full bg-[color-mix(in_srgb,var(--theme-primary)_10%,var(--bg-card))] px-2 py-0.5 text-[10px] font-bold text-[var(--theme-primary)]">
            #{record.id}
          </span>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">{record.description}</p>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          <span className="rounded border border-[var(--border-subtle)] px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {record.feature}
          </span>
          <span className="rounded border border-[var(--border-subtle)] px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
            {record.objectKey}
          </span>
        </div>

        <a
          href={record.publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 text-[11px] text-primary underline hover:no-underline"
        >
          Open CDN URL ↗
        </a>
      </div>
    </div>
  );
}

function WorkflowPanel() {
  const steps = [
    {
      n: "1",
      title: "Create or reset the demo account",
      code: "npx tsx scripts/seed-screenshot-demo-user.ts",
      detail: `Email: ${DEMO_EMAIL}\nPassword: DemoScreenshot2024!\n\nRun with SCREENSHOT_DEMO_RESET=true to wipe and recreate.`,
    },
    {
      n: "2",
      title: "Start the dev server",
      code: "npm run dev",
      detail: "Screenshots are captured from the running app — not from build output.",
    },
    {
      n: "3",
      title: "Run the capture script",
      code: "node scripts/capture-screenshots.mjs",
      detail:
        "Captures all targets defined in the script. Filter with:\nSCREENSHOT_ONLY_IDS=cat-exam-desktop,smart-review-desktop node scripts/capture-screenshots.mjs",
    },
    {
      n: "4",
      title: "Review output and upload to Spaces",
      code: "ls screenshots/",
      detail: `Upload files to DigitalOcean Spaces under the 'screenshots/' prefix.\nCDN base: ${SCREENSHOT_CDN_BASE}`,
    },
    {
      n: "5",
      title: "Register new screenshots",
      code: "# Edit src/lib/marketing/screenshot-registry.ts",
      detail:
        "Add a new entry() call with the stable ID, objectKey, feature tag, label, and description.\nThe ScreenshotCarousel and ScreenshotGrid components will pick it up automatically.",
    },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--theme-primary)_4%,var(--bg-card))] p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          Capture workflow
        </p>
        <h2 className="mt-1.5 text-lg font-bold text-[var(--theme-heading-text)]">
          How to add new screenshots
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The full workflow from capturing a real product page to it appearing in carousels across the site.
        </p>
      </div>

      <div className="space-y-3">
        {steps.map((step) => (
          <div
            key={step.n}
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--theme-primary)_12%,var(--bg-card))] text-sm font-bold text-primary">
                {step.n}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[var(--theme-heading-text)]">{step.title}</p>
                <code className="mt-2 block rounded-lg bg-[var(--theme-muted-surface)] px-3 py-2 text-xs font-mono text-[var(--theme-heading-text)]">
                  {step.code}
                </code>
                {step.detail ? (
                  <pre className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                    {step.detail}
                  </pre>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 text-sm">
        <p className="font-semibold text-[var(--theme-heading-text)]">Demo account credentials</p>
        <dl className="mt-3 grid gap-1.5 text-xs">
          <div className="flex gap-2">
            <dt className="w-20 font-medium text-muted-foreground">Email</dt>
            <dd className="font-mono text-[var(--theme-heading-text)]">{DEMO_EMAIL}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-20 font-medium text-muted-foreground">Password</dt>
            <dd className="font-mono text-[var(--theme-heading-text)]">DemoScreenshot2024!</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-20 font-medium text-muted-foreground">Role</dt>
            <dd className="text-[var(--theme-heading-text)]">LEARNER (never use for billing)</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export function AdminScreenshotsClient() {
  const [tab, setTab] = useState<Tab>("registry");

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-6 flex gap-2 border-b border-[var(--border-subtle)]">
        {(
          [
            { id: "registry" as const, label: `Registry (${SCREENSHOT_REGISTRY.length})` },
            { id: "workflow" as const, label: "Capture workflow" },
          ] as const
        ).map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-[var(--theme-heading-text)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Registry grid */}
      {tab === "registry" && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SCREENSHOT_REGISTRY.map((record) => (
            <RegistryCard key={record.id} record={record} />
          ))}
        </div>
      )}

      {/* Workflow */}
      {tab === "workflow" && (
        <div className="max-w-2xl">
          <WorkflowPanel />
        </div>
      )}
    </div>
  );
}
