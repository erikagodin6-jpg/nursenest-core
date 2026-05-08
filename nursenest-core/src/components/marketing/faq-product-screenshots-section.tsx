"use client";

/**
 * Product FAQ section with inline screenshots.
 *
 * Rendered below the legal FAQ on /faq, this section answers common "what does
 * this look like?" questions with the actual product screenshot alongside the answer.
 *
 * Screenshots are sourced from the registry via FAQ_VISUAL_QA in get-screenshots.ts.
 * Never hardcode CDN URLs here.
 */

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { MarketingChainScreenshot } from "@/components/marketing/marketing-screenshot-stack";
import { SCREENSHOT_REGISTRY } from "@/lib/marketing/screenshot-registry";
import { FAQ_VISUAL_QA } from "@/lib/marketing/get-screenshots";

function FaqVisualItem({
  question,
  answer,
  screenshotId,
  defaultOpen = false,
  testId,
}: {
  question: string;
  answer: string;
  screenshotId: (typeof FAQ_VISUAL_QA)[number]["screenshotId"];
  defaultOpen?: boolean;
  testId?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const record = SCREENSHOT_REGISTRY.find((s) => s.id === screenshotId);

  return (
    <div
      data-testid={testId}
      className="group overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_1,var(--border))] bg-[var(--semantic-surface)] shadow-[var(--elevation-rest)]"
    >
      <button
        type="button"
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-brand)_4%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_35%,transparent)] sm:px-6 sm:py-5"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="nn-marketing-body-sm font-semibold text-[var(--semantic-text-primary)]">{question}</span>
        <ChevronDown
          className={`mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-text-muted)] transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open ? (
        <div className="border-t border-[var(--semantic-border-soft)] px-5 pb-6 pt-4 sm:px-6 sm:pb-7 sm:pt-5">
          <div className="grid items-start gap-8 md:grid-cols-2">
            <p className="nn-marketing-body-sm text-[var(--semantic-text-secondary)]">{answer}</p>
            {record ? (
              <div className="min-w-0">
                <MarketingChainScreenshot
                  objectKey={record.objectKey}
                  publicUrl={record.publicUrl}
                  alt={record.alt ?? record.label}
                  aspectRatio="16 / 10"
                  fit="contain"
                  rounded="rounded-xl"
                  imgClassName="object-top"
                />
                <p className="nn-marketing-caption mt-2 text-center text-[var(--semantic-text-muted)]">
                  {record.label} — real NurseNest interface
                </p>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Drop-in section for the /faq page that adds visual product Q&A below the
 * existing legal/billing FAQ. Each answer expands inline with a screenshot.
 */
export function FaqProductScreenshotsSection() {
  return (
    <section
      className="border-t border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_12%,var(--page-bg))] py-12 sm:py-14"
      aria-labelledby="product-faq-heading"
      data-testid="marketing-faq-product"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_1,var(--border))] bg-[var(--semantic-surface)] px-5 py-5 shadow-[var(--elevation-rest)] sm:px-6">
          <p className="nn-marketing-caption font-bold uppercase tracking-widest text-[var(--semantic-brand)]">
            Product questions
          </p>
          <h2 id="product-faq-heading" className="nn-marketing-h2 mt-2">
            What does the platform look like?
          </h2>
          <p className="nn-marketing-body-sm mt-2 text-[var(--semantic-text-secondary)]">
            Every screenshot below is taken from the live NurseNest platform. Click any question to see the real interface.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_VISUAL_QA.map((item, i) => (
            <FaqVisualItem
              key={item.id}
              question={item.question}
              answer={item.answer}
              screenshotId={item.screenshotId}
              defaultOpen={i === 0}
              testId={i === 0 ? "marketing-faq-product-accordion-first" : undefined}
            />
          ))}
        </div>

        <p className="nn-marketing-body-sm mt-8 text-center text-[var(--semantic-text-muted)]">
          Want to see it in action?{" "}
          <a
            href="/signup"
            className="font-semibold text-[var(--semantic-brand)] underline-offset-4 hover:underline"
          >
            Start for free
          </a>{" "}
          — no credit card required.
        </p>
      </div>
    </section>
  );
}
