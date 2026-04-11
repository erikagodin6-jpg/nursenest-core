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
import { MarketingChainScreenshot } from "@/components/marketing/marketing-screenshot-stack";
import { SCREENSHOT_REGISTRY } from "@/lib/marketing/screenshot-registry";
import { FAQ_VISUAL_QA } from "@/lib/marketing/get-screenshots";

const ACCENT = "var(--theme-primary)";
const TEXT_HEADING = "var(--theme-heading-text)";
const TEXT_BODY = "var(--theme-body-text)";
const TEXT_MUTED = "var(--theme-muted-text)";
const SURFACE_ELEVATED = "color-mix(in srgb, var(--theme-primary) 4%, var(--bg-card))";
const SURFACE_SOFT = "color-mix(in srgb, var(--theme-primary) 6%, var(--bg-card))";
const BORDER = "var(--border-subtle)";

function FaqVisualItem({
  question,
  answer,
  screenshotId,
  defaultOpen = false,
}: {
  question: string;
  answer: string;
  screenshotId: (typeof FAQ_VISUAL_QA)[number]["screenshotId"];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const record = SCREENSHOT_REGISTRY.find((s) => s.id === screenshotId);

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{ border: `1px solid ${BORDER}`, background: SURFACE_ELEVATED }}
    >
      {/* Question row — always visible */}
      <button
        type="button"
        className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--theme-primary)_3%,transparent)]"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span
          className="text-base font-semibold leading-snug"
          style={{ color: TEXT_HEADING }}
        >
          {question}
        </span>
        <span
          className="mt-0.5 shrink-0 text-xl leading-none transition-transform"
          style={{
            color: ACCENT,
            transform: open ? "rotate(45deg)" : "none",
          }}
          aria-hidden
        >
          +
        </span>
      </button>

      {/* Answer + screenshot — toggleable */}
      {open && (
        <div
          className="border-t px-6 pb-7 pt-5"
          style={{ borderColor: BORDER }}
        >
          <div className="grid items-start gap-8 md:grid-cols-2">
            {/* Answer text */}
            <div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: TEXT_BODY }}
              >
                {answer}
              </p>
            </div>
            {/* Screenshot */}
            {record ? (
              <div>
                <MarketingChainScreenshot
                  objectKey={record.objectKey}
                  publicUrl={record.publicUrl}
                  alt={record.alt ?? record.label}
                  aspectRatio="16 / 10"
                  fit="contain"
                  rounded="rounded-xl"
                  imgClassName="object-top"
                />
                <p
                  className="mt-2 text-center text-xs"
                  style={{ color: TEXT_MUTED }}
                >
                  {record.label} — real NurseNest interface
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}
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
      className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8"
      aria-labelledby="product-faq-heading"
    >
      {/* Section header */}
      <div
        className="mb-8 rounded-2xl px-6 py-5"
        style={{ background: SURFACE_SOFT, border: `1px solid ${BORDER}` }}
      >
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: ACCENT }}
        >
          Product questions
        </p>
        <h2
          id="product-faq-heading"
          className="nn-marketing-h3 mt-2"
          style={{ color: TEXT_HEADING }}
        >
          What does the platform look like?
        </h2>
        <p
          className="mt-2 text-sm leading-relaxed"
          style={{ color: TEXT_BODY }}
        >
          Every screenshot below is taken from the live NurseNest platform. Click any question to see the real interface.
        </p>
      </div>

      {/* Visual Q&A items */}
      <div className="space-y-3">
        {FAQ_VISUAL_QA.map((item, i) => (
          <FaqVisualItem
            key={item.id}
            question={item.question}
            answer={item.answer}
            screenshotId={item.screenshotId}
            defaultOpen={i === 0}
          />
        ))}
      </div>

      {/* Footer link */}
      <p
        className="mt-8 text-center text-sm"
        style={{ color: TEXT_MUTED }}
      >
        Want to see it in action?{" "}
        <a
          href="/signup"
          className="font-semibold hover:underline"
          style={{ color: ACCENT }}
        >
          Start for free
        </a>{" "}
        — no credit card required.
      </p>
    </section>
  );
}
