"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { useId, useState } from "react";
import { ChevronDown, ShieldCheck, Sparkles, Stethoscope, WalletCards } from "lucide-react";

export type PremiumFaqCategory = "Billing" | "Access" | "Learning" | "Platform";

export type PremiumFaqItem = {
  question: string;
  answer: string;
  category: PremiumFaqCategory;
};

const CATEGORY_ICON: Record<PremiumFaqCategory, ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  Billing: WalletCards,
  Access: ShieldCheck,
  Learning: Stethoscope,
  Platform: Sparkles,
};

const CATEGORY_SUMMARY: Record<PremiumFaqCategory, string> = {
  Billing: "Subscriptions, cancellations, refunds, and purchase records.",
  Access: "Account security, premium access, and content protection.",
  Learning: "Exam prep, readiness analytics, rationales, and educational scope.",
  Platform: "Reliability, privacy, regions, free previews, and support.",
};

function categoryForItem(item: PremiumFaqItem): PremiumFaqCategory {
  return item.category;
}

function PremiumFaqCard({
  item,
  index,
  open,
  onToggle,
}: {
  item: PremiumFaqItem;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const baseId = useId();
  const buttonId = `${baseId}-trigger`;
  const panelId = `${baseId}-panel`;
  const Icon = CATEGORY_ICON[item.category];

  return (
    <article
      className="nn-premium-faq-redesign-card"
      data-testid="premium-faq-card"
      data-faq-category={item.category.toLowerCase()}
    >
      <button
        id={buttonId}
        type="button"
        className="nn-premium-faq-redesign-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        data-testid="premium-faq-accordion-trigger"
        onClick={onToggle}
      >
        <span className="nn-premium-faq-redesign-index" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="nn-premium-faq-redesign-question-wrap">
          <span className="nn-faq-section-label">
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {item.category}
          </span>
          <span className="nn-premium-faq-redesign-question">{item.question}</span>
        </span>
        <span className="nn-premium-faq-redesign-chevron" aria-hidden="true">
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="nn-premium-faq-redesign-panel"
        hidden={!open}
      >
        <p>{item.answer}</p>
      </div>
    </article>
  );
}

export function PremiumFaqAccordion({ title, items }: { title: string; items: PremiumFaqItem[] }) {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(() => new Set([0]));
  const grouped = items.reduce<Record<PremiumFaqCategory, PremiumFaqItem[]>>(
    (acc, item) => {
      acc[categoryForItem(item)].push(item);
      return acc;
    },
    { Billing: [], Access: [], Learning: [], Platform: [] },
  );

  function toggle(index: number) {
    setOpenIndexes((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  let globalIndex = 0;

  return (
    <section
      className="nn-premium-faq-redesign"
      data-testid="premium-faq-shell"
      data-faq-capitalization-check
      aria-labelledby="premium-faq-heading"
    >
      <div className="nn-premium-faq-redesign-ambient" aria-hidden="true" />
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8">
        <div className="nn-premium-faq-redesign-hero">
          <div className="nn-premium-faq-redesign-eyebrow">Premium Support Center</div>
          <h1 id="premium-faq-heading" className="nn-premium-faq-redesign-title">
            {title}
          </h1>
          <p className="nn-premium-faq-redesign-subtitle">
            Fast answers for subscriptions, premium access, readiness analytics, and exam-prep support.
            Everything stays theme-aware across Ocean, Blossom, and Midnight.
          </p>
          <div className="nn-premium-faq-redesign-chips" aria-label="FAQ Categories">
            {Object.entries(grouped).map(([category, categoryItems]) => (
              <a key={category} href={`#faq-${category.toLowerCase()}`} className="nn-faq-chip">
                {category}
                <span>{categoryItems.length}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="nn-premium-faq-redesign-layout">
          <aside className="nn-premium-faq-redesign-sidebar" aria-label="FAQ Navigation">
            <p className="nn-premium-faq-redesign-sidebar-title">Browse FAQ</p>
            {Object.entries(grouped).map(([category, categoryItems]) => {
              const Icon = CATEGORY_ICON[category as PremiumFaqCategory];
              return (
                <a key={category} href={`#faq-${category.toLowerCase()}`} className="nn-premium-faq-redesign-nav-link">
                  <Icon className="h-4 w-4" aria-hidden />
                  <span>{category}</span>
                  <strong>{categoryItems.length}</strong>
                </a>
              );
            })}
          </aside>

          <div className="nn-premium-faq-redesign-groups">
            {(Object.keys(grouped) as PremiumFaqCategory[]).map((category) => {
              const categoryItems = grouped[category];
              if (categoryItems.length === 0) return null;
              const Icon = CATEGORY_ICON[category];
              return (
                <section key={category} id={`faq-${category.toLowerCase()}`} className="nn-premium-faq-redesign-group">
                  <div className="nn-premium-faq-redesign-group-header">
                    <span className="nn-premium-faq-redesign-group-icon">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <div>
                      <h2>{category}</h2>
                      <p>{CATEGORY_SUMMARY[category]}</p>
                    </div>
                  </div>

                  <div className="nn-premium-faq-redesign-list">
                    {categoryItems.map((item) => {
                      const index = globalIndex++;
                      return (
                        <PremiumFaqCard
                          key={`${category}-${item.question}`}
                          item={item}
                          index={index}
                          open={openIndexes.has(index)}
                          onToggle={() => toggle(index)}
                        />
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>

      <div className="nn-premium-faq-redesign-sticky-cta" data-testid="premium-faq-sticky-cta">
        <div>
          <strong>Ready to study with NurseNest?</strong>
          <span>Preview lessons, rationales, and readiness tools before upgrading.</span>
        </div>
        <Link href="/signup" className="nn-premium-faq-redesign-cta">
          Start Studying Now
        </Link>
      </div>
    </section>
  );
}
