"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Award,
  BookOpen,
  ChevronDown,
  Dna,
  HeartPulse,
  Stethoscope,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { marketingExamHubPath } from "@/lib/marketing/country-exam-offerings";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { formatNavLabel } from "@/lib/format/title-case";

type TierItem = {
  key: string;
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  href: string;
};

const NAV_TRIGGER_CLASS =
  "nn-marketing-body-sm nn-marketing-nav-link font-medium tracking-tight text-[var(--theme-menu-text)] flex items-center gap-1";

export function TierGatewayDropdown({
  triggerLabelKey = "nav.exams",
  navLinkClass,
}: {
  triggerLabelKey?: string;
  navLinkClass?: string;
}) {
  const { t, locale } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const localize = (href: string) => withMarketingLocale(locale, href);

  const items: TierItem[] = [
    {
      key: "rn",
      icon: Stethoscope,
      titleKey: "nav.tierDrop.rnTitle",
      descKey: "nav.tierDrop.rnDesc",
      href: marketingExamHubPath(region, "rn"),
    },
    {
      key: "pn",
      icon: HeartPulse,
      titleKey: region === "CA" ? "nav.tierDrop.rpnTitle" : "nav.tierDrop.lpnTitle",
      descKey: region === "CA" ? "nav.tierDrop.rpnDesc" : "nav.tierDrop.lpnDesc",
      href: marketingExamHubPath(region, "pn"),
    },
    {
      key: "np",
      icon: Award,
      titleKey: "nav.tierDrop.npTitle",
      descKey: "nav.tierDrop.npDesc",
      href: marketingExamHubPath(region, "np"),
    },
    {
      key: "allied",
      icon: Dna,
      titleKey: "nav.tierDrop.alliedTitle",
      descKey: "nav.tierDrop.alliedDesc",
      href: marketingExamHubPath(region, "allied"),
    },
    {
      key: "pre-nursing",
      icon: BookOpen,
      titleKey: "nav.tierDrop.preNursingTitle",
      descKey: "nav.tierDrop.preNursingDesc",
      href: "/pre-nursing",
    },
    {
      key: "tools",
      icon: Wrench,
      titleKey: "nav.tierDrop.toolsTitle",
      descKey: "nav.tierDrop.toolsDesc",
      href: HUB.tools,
    },
  ];

  const openDropdown = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openDropdown}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={navLinkClass ?? NAV_TRIGGER_CLASS}
      >
        {formatNavLabel(t(triggerLabelKey as Parameters<typeof t>[0]), { locale, context: "tier-dropdown.trigger" })}
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute start-0 top-full z-[300] mt-1.5 w-[22rem] rounded-2xl border border-[var(--theme-separator)] bg-[var(--theme-card-bg)] p-2 shadow-[var(--shadow-elevated)] backdrop-blur-sm"
          onMouseEnter={openDropdown}
          onMouseLeave={scheduleClose}
        >
          <p className="nn-marketing-label px-3 pb-2 pt-2 text-[var(--theme-muted-text)]">
            {t("nav.tierDrop.heading")}
          </p>
          <ul className="space-y-0.5">
            {items.map((item) => {
              const Icon = item.icon;
              const href = localize(item.href);
              return (
                <li key={item.key}>
                  <Link
                    href={href}
                    role="menuitem"
                    className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--surface-accent-soft)]"
                    onClick={() => {
                      setOpen(false);
                      trackClientEvent(PH.marketingNavClick, {
                        actor: "anonymous",
                        nav_id: `tier_drop_${item.key}`,
                        surface: "tier_gateway_dropdown",
                        marketing_region: region,
                      });
                    }}
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-accent-soft)] text-[var(--text-accent)] transition-colors group-hover:bg-[var(--surface-bubble)]">
                      <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="nn-marketing-body-sm block font-semibold leading-tight tracking-tight text-[var(--theme-heading-text)]">
                        {formatNavLabel(t(item.titleKey as Parameters<typeof t>[0]), { locale, context: `tier-dropdown.${item.key}` })}
                      </span>
                      <span className="nn-marketing-caption mt-0.5 block leading-snug text-[var(--theme-muted-text)]">
                        {t(item.descKey as Parameters<typeof t>[0])}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
