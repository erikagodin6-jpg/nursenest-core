"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { readMarketingRegionFromDocument } from "@/lib/observability/learner-analytics-context.client";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { useMarketingI18n, useMarketingLocale } from "@/lib/marketing-i18n";
import { formatTitleCase } from "@/lib/format/text-case";
import {
  buildClinicalModulesShellNavItem,
  buildEcgShellNavItem,
  buildLearnerPrimaryNavItems,
  buildOptionalClinicalScenariosShellNavItem,
  buildOptionalOsceScenarioShellNavItems,
  buildOptionalPrintablesShellNavItem,
  buildOptionalStudyToolsShellNavItem,
  CLINICAL_MODULES_SHELL_NAV_ID,
  ECG_SHELL_NAV_ID,
  isClinicalModuleLinkDisabled,
  isLearnerPrimaryNavKey,
  learnerPrimaryNavLabelKey,
  type ClinicalModulesNavLink,
  type LearnerShellStudyNavRowId,
} from "@/lib/navigation/learner-primary-nav";
import { SignOutButton } from "@/components/auth/sign-out-button";

const STUDY_TOOLS_ACTIVE_PREFIXES = [
  "/app/study-tools",
  "/app/matching",
  "/app/fill-in-the-blank",
  "/app/ordering",
  "/app/lab-drills",
  "/app/medication-drills",
] as const;

// ─── Clinical Modules flyout ───────────────────────────────────────────────

/** Status badge label map. */
const STATUS_BADGE: Partial<Record<ClinicalModulesNavLink["status"], string>> = {
  premium: "ADD-ON",
  new: "NEW",
  coming_soon: "SOON",
  locked: "LOCKED",
};

/**
 * Portal-based Clinical Modules flyout with full keyboard navigation, ARIA menu
 * semantics, Safari-safe outside-click detection, and reduced-motion compliance.
 *
 * Architecture decisions:
 *   Portal to document.body — prevents clipping by overflow:hidden ancestors in
 *   the learner nav row. Position is recalculated from trigger's getBoundingClientRect
 *   on open and on scroll/resize.
 *
 *   Outside-click via pointerdown on document (not onBlur/relatedTarget) — robust
 *   on iOS/iPadOS Safari where relatedTarget is unreliably null.
 *
 *   Keyboard: ArrowDown/Up/Home/End cycle focusable items; Escape closes and
 *   restores focus to trigger; Enter/Space activate the focused item.
 *
 *   Disabled items (coming_soon | locked): rendered as <span role="menuitem">
 *   with tabIndex={-1} — non-focusable, no href="#" page-top jump risk.
 */
function ClinicalModulesFlyout({
  links,
  label,
  isActive,
}: {
  links: ClinicalModulesNavLink[];
  label: string;
  isActive: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [panelPos, setPanelPos] = useState<{ top: number; left: number } | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const flyoutId = "nn-clinical-modules-flyout";

  // Focusable item count for keyboard nav (excludes disabled items)
  const focusableLinks = useMemo(
    () => links.map((l, i) => ({ ...l, index: i, disabled: isClinicalModuleLinkDisabled(l) })),
    [links],
  );
  // "View all" is always last focusable
  const totalFocusable = focusableLinks.filter((l) => !l.disabled).length + 1;

  const repositionPanel = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    // Viewport-edge clamping: prevent right-edge overflow on narrow desktops
    // and Safari iOS where the flyout can clip outside the visible area.
    // PANEL_WIDTH must stay in sync with width:"18rem" (288px) on the panel div.
    const PANEL_WIDTH = 288; // 18rem × 16px
    const VIEWPORT_PADDING = 8;
    const rawLeft = rect.left + window.scrollX;
    const maxLeft = window.innerWidth + window.scrollX - PANEL_WIDTH - VIEWPORT_PADDING;
    const clampedLeft = Math.min(rawLeft, Math.max(VIEWPORT_PADDING, maxLeft));
    setPanelPos({
      top: rect.bottom + window.scrollY + 6,
      left: clampedLeft,
    });
  }, []);

  // Open / reposition
  const openFlyout = useCallback(() => {
    repositionPanel();
    setOpen(true);
    setFocusedIndex(-1);
  }, [repositionPanel]);

  const closeFlyout = useCallback((restoreFocus = true) => {
    setOpen(false);
    setFocusedIndex(-1);
    if (restoreFocus) {
      // requestAnimationFrame is reliable on desktop Chrome/Firefox.
      // On Safari/iOS (VoiceOver especially) rAF can fire before the browser has
      // committed the DOM update, causing focus() to land on the wrong element.
      // The setTimeout(0) fallback fires in the next task, after layout, ensuring
      // reliable focus restoration on iPad Safari and iPhone Safari + VoiceOver.
      requestAnimationFrame(() => {
        if (document.activeElement !== triggerRef.current) {
          triggerRef.current?.focus();
        }
      });
      // Safari/VoiceOver fallback
      setTimeout(() => triggerRef.current?.focus(), 0);
    }
  }, []);

  // Reposition on scroll / resize
  useEffect(() => {
    if (!open) return;
    const onScroll = () => repositionPanel();
    const onResize = () => repositionPanel();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [open, repositionPanel]);

  // Outside-click via pointerdown (Safari-safe — relatedTarget is unreliable on iOS)
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }
      closeFlyout(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, closeFlyout]);

  // Move focus to the item at `index` within the menu.
  // Uses rAF + setTimeout(0) fallback for reliable focus on Safari/iOS.
  const focusItem = useCallback((index: number) => {
    setFocusedIndex(index);
    requestAnimationFrame(() => itemRefs.current[index]?.focus());
    // Safari/VoiceOver fallback: ensure focus lands if rAF fires too early
    setTimeout(() => {
      if (document.activeElement !== itemRefs.current[index]) {
        itemRefs.current[index]?.focus();
      }
    }, 0);
  }, []);

  // Keyboard handler for the trigger button
  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        openFlyout();
        // Focus first focusable item after paint
        requestAnimationFrame(() => {
          const first = itemRefs.current.findIndex((r) => r !== null);
          if (first >= 0) focusItem(first);
        });
      }
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      closeFlyout(true);
    }
  };

  // Keyboard handler inside the menu panel
  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    const total = itemRefs.current.filter(Boolean).length;
    if (total === 0) return;

    if (e.key === "Escape") {
      e.preventDefault();
      closeFlyout(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = focusedIndex < total - 1 ? focusedIndex + 1 : 0;
      focusItem(next);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = focusedIndex > 0 ? focusedIndex - 1 : total - 1;
      focusItem(prev);
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      focusItem(0);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      focusItem(total - 1);
      return;
    }
    if (e.key === "Tab") {
      // Allow tab to leave menu; close without focus restore so native tab order continues
      closeFlyout(false);
    }
  };

  // Register/unregister item ref
  const setItemRef = (el: HTMLElement | null, index: number) => {
    itemRefs.current[index] = el;
  };

  // Panel content — rendered inside a portal when open
  const panel = open && panelPos ? (
    <div
      ref={menuRef}
      id={flyoutId}
      role="menu"
      aria-label="Clinical Modules"
      onKeyDown={handleMenuKeyDown}
      style={{
        position: "absolute",
        top: panelPos.top,
        left: panelPos.left,
        zIndex: 9999,
        width: "18rem",
      }}
      className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-2 shadow-[0_8px_32px_-8px_color-mix(in_srgb,var(--semantic-text-primary)_18%,transparent)]"
    >
      {(() => {
        let refIndex = 0;
        const items = links.map((link) => {
          const disabled = isClinicalModuleLinkDisabled(link);
          const badge = STATUS_BADGE[link.status];
          const itemClass = `flex flex-col gap-0.5 rounded-xl px-3 py-2.5 text-start outline-none ${
            disabled
              ? "cursor-default opacity-40"
              : "cursor-pointer hover:bg-[color-mix(in_srgb,var(--semantic-brand)_06%,var(--semantic-surface))] focus-visible:bg-[color-mix(in_srgb,var(--semantic-brand)_08%,var(--semantic-surface))] focus-visible:outline-2 focus-visible:outline-[var(--semantic-brand)]"
          }`;

          const inner = (
            <>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--semantic-text-primary)]">
                {link.label}
                {badge && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      link.status === "premium"
                        ? "bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-brand)]"
                        : link.status === "new"
                          ? "bg-[color-mix(in_srgb,var(--semantic-success)_14%,var(--semantic-surface))] text-[var(--semantic-success)]"
                          : "bg-[color-mix(in_srgb,var(--semantic-text-muted)_10%,var(--semantic-surface))] text-[var(--semantic-text-muted)]"
                    }`}
                    aria-label={badge}
                  >
                    {badge}
                  </span>
                )}
              </span>
              <span className="text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
                {link.description}
              </span>
            </>
          );

          if (disabled) {
            // Non-interactive, non-focusable — prevents href="#" page-top jump
            // and prevents screen readers from announcing a navigable link
            return (
              <span
                key={link.key}
                role="menuitem"
                aria-disabled="true"
                tabIndex={-1}
                className={itemClass}
              >
                {inner}
              </span>
            );
          }

          const ri = refIndex++;
          return (
            <Link
              key={link.key}
              href={link.href}
              role="menuitem"
              tabIndex={-1}
              ref={(el) => setItemRef(el, ri)}
              onClick={() => {
                closeFlyout(false);
                trackClientEvent(PH.learnerNavClick, {
                  actor: "authenticated",
                  nav_id: `clinical_modules.${link.key}`,
                  href: link.href,
                  country: readMarketingRegionFromDocument(),
                  surface: "learner_clinical_modules_flyout",
                });
              }}
              className={itemClass}
            >
              {inner}
            </Link>
          );
        });

        // "View all" footer — always last focusable, uses learner-scoped destination
        const viewAllIndex = refIndex;
        items.push(
          <div key="footer" className="mt-1.5 border-t border-[var(--semantic-border-soft)] pt-1.5">
            <Link
              href="/app/study-tools"
              role="menuitem"
              tabIndex={-1}
              ref={(el) => setItemRef(el, viewAllIndex)}
              onClick={() => {
                closeFlyout(false);
                trackClientEvent(PH.learnerNavClick, {
                  actor: "authenticated",
                  nav_id: "clinical_modules.view_all",
                  href: "/app/study-tools",
                  country: readMarketingRegionFromDocument(),
                  surface: "learner_clinical_modules_flyout",
                });
              }}
              className="flex items-center rounded-xl px-3 py-2 text-xs font-semibold text-[var(--semantic-text-muted)] outline-none transition-colors hover:text-[var(--semantic-brand)] focus-visible:outline-2 focus-visible:outline-[var(--semantic-brand)]"
            >
              View all Clinical Modules
            </Link>
          </div>,
        );
        return items;
      })()}
    </div>
  ) : null;

  return (
    <div className="relative" data-nn-clinical-modules-flyout="">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? flyoutId : undefined}
        onClick={() => (open ? closeFlyout(false) : openFlyout())}
        onKeyDown={handleTriggerKeyDown}
        className={
          isActive
            ? "nn-marketing-body-sm inline-flex min-h-11 min-w-0 touch-manipulation items-center gap-1 rounded-full border border-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--bg-card))] px-2.5 py-1.5 font-medium leading-snug text-[var(--semantic-brand)] transition-colors duration-150 sm:px-3 sm:py-2"
            : "nn-marketing-body-sm inline-flex min-h-11 min-w-0 touch-manipulation items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2.5 py-1.5 font-medium leading-snug text-[var(--theme-body-text)] transition-colors duration-150 hover:bg-[var(--accent-soft)] hover:text-primary sm:px-3 sm:py-2"
        }
      >
        {label}
        {/* motion-safe wrapper: suppresses rotation animation for prefers-reduced-motion */}
        <span className="motion-safe:transition-transform motion-safe:duration-150">
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 ${open ? "rotate-180" : "rotate-0"}`}
            aria-hidden
          />
        </span>
      </button>

      {typeof document !== "undefined" && panel
        ? createPortal(panel, document.body)
        : null}
    </div>
  );
}

type LearnerShellNavRow = {
  id: LearnerShellStudyNavRowId;
  href: string;
  matchPrefix: string;
  matchPrefixes?: readonly string[];
  label: string;
};

function isLearnerShellNavActive(pathname: string, item: { matchPrefix: string; matchPrefixes?: readonly string[] }) {
  if (item.matchPrefixes?.length) {
    return item.matchPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  }
  return pathname.startsWith(item.matchPrefix);
}

export type LearnerShellNavProps = {
  pathwayPillLabel: string | null;
  pathwayId: string | null;
  pathwayHubHref: string | null;
  examsLabel: import("@/lib/testing/testing-model-types").LearnerExamsSurfaceLabel;
  /** When true, show Printouts in learner shell nav (server: printable store + public flag). */
  printablesNavVisible?: boolean;
  /** When true (RN/NP only), show dedicated ECG nav item and ECG items in Clinical Modules flyout. Hidden from RPN/LVN_LPN. */
  ecgNavEnabled?: boolean;
};

function useLearnerNavItems({
  pathwayId,
  examsLabel,
  printablesNavVisible = false,
  ecgNavEnabled = false,
}: Pick<LearnerShellNavProps, "pathwayId" | "examsLabel" | "printablesNavVisible" | "ecgNavEnabled">) {
  const { t } = useMarketingI18n();
  const locale = useMarketingLocale();

  return useMemo(() => {
    const built = buildLearnerPrimaryNavItems(pathwayId, { examsLabel });
    const rows: LearnerShellNavRow[] = built.map((row) => {
      const labelKey = learnerPrimaryNavLabelKey(row.key);
      let label = formatTitleCase(t(labelKey), locale);
      if (row.key === "cat" && examsLabel === "LOFT Simulation") {
        label = formatTitleCase("LOFT Simulation", locale);
      } else if (row.key === "cat" && examsLabel === "Exams") {
        label = formatTitleCase(t("learner.shell.nav.examsSurface"), locale);
      }
      return {
        id: row.key,
        href: row.href,
        matchPrefix: row.matchBase,
        label,
      };
    });
    const studyTools = buildOptionalStudyToolsShellNavItem(pathwayId);
    let insertAt = Math.min(3, rows.length);
    if (studyTools) {
      const label = formatTitleCase(t(studyTools.labelKey), locale);
      rows.splice(insertAt, 0, {
        id: studyTools.id,
        href: studyTools.href,
        matchPrefix: studyTools.matchPrefix,
        matchPrefixes: STUDY_TOOLS_ACTIVE_PREFIXES,
        label,
      });
      insertAt += 1;
    }
    const printables = buildOptionalPrintablesShellNavItem(pathwayId, printablesNavVisible);
    if (printables) {
      const label = formatTitleCase(t(printables.labelKey), locale);
      rows.splice(insertAt, 0, {
        id: printables.id,
        href: printables.href,
        matchPrefix: printables.matchPrefix,
        label,
      });
      insertAt += 1;
    }
    for (const row of buildOptionalOsceScenarioShellNavItems(pathwayId)) {
      const label = formatTitleCase(t(row.labelKey), locale);
      rows.splice(insertAt, 0, {
        id: row.id,
        href: row.href,
        matchPrefix: row.matchPrefix,
        label,
      });
      insertAt += 1;
    }
    const clinical = buildOptionalClinicalScenariosShellNavItem(pathwayId);
    if (clinical) {
      const label = formatTitleCase(t(clinical.labelKey), locale);
      rows.splice(insertAt, 0, {
        id: clinical.id,
        href: clinical.href,
        matchPrefix: clinical.matchPrefix,
        label,
      });
      insertAt += 1;
    }
    // ECG standalone nav — RN/NP only. Appears before Clinical Modules flyout.
    if (ecgNavEnabled) {
      const ecgItem = buildEcgShellNavItem(pathwayId);
      rows.splice(insertAt, 0, {
        id: ecgItem.id,
        href: ecgItem.href,
        matchPrefix: ecgItem.matchPrefix,
        label: formatTitleCase(t(ecgItem.labelKey) || "ECG", locale),
      });
      insertAt += 1;
    }
    // Clinical Modules flyout — always present after optional items, before Reports.
    // ECG items inside the flyout are filtered by ecgNavEnabled.
    const clinicalModules = buildClinicalModulesShellNavItem(pathwayId, ecgNavEnabled);
    const clinicalModulesLabel = formatTitleCase(
      t(clinicalModules.labelKey) || "Clinical Modules",
      locale,
    );
    rows.splice(insertAt, 0, {
      id: clinicalModules.id,
      href: clinicalModules.href,
      matchPrefix: clinicalModules.matchPrefix,
      label: clinicalModulesLabel,
    });
    return rows;
  }, [pathwayId, examsLabel, printablesNavVisible, ecgNavEnabled, t, locale]);
}

/** Pathway hub pill — sits in the top chrome row next to the logo. */
export function LearnerShellPathwayPill({
  pathwayPillLabel,
  pathwayHubHref,
}: Pick<LearnerShellNavProps, "pathwayPillLabel" | "pathwayHubHref">) {
  const pathwayHref = pathwayHubHref ?? "/app";
  const pathwayLabel = pathwayPillLabel ?? "Pathway";

  return (
    <Link
      href={pathwayHref}
      onClick={() => {
        trackClientEvent(PH.learnerNavClick, {
          actor: "authenticated",
          nav_id: "pathway-pill",
          href: pathwayHref,
          country: readMarketingRegionFromDocument(),
          surface: "learner_primary_nav",
        });
      }}
      className="nn-header-tier-pill max-w-[12rem] shrink-0 truncate sm:max-w-[14rem]"
      aria-label={`Open your pathway hub: ${pathwayLabel}`}
    >
      {pathwayLabel}
    </Link>
  );
}

/** Full-width study destinations row (tablet/desktop). Flex-wrap keeps all links visible without horizontal scroll. */
export function LearnerShellDesktopStudyLinks({
  pathwayId,
  examsLabel,
  printablesNavVisible,
  ecgNavEnabled,
}: Pick<LearnerShellNavProps, "pathwayId" | "examsLabel" | "printablesNavVisible" | "ecgNavEnabled">) {
  const pathname = usePathname();
  const items = useLearnerNavItems({ pathwayId, examsLabel, printablesNavVisible, ecgNavEnabled });
  // Pre-build Clinical Modules links so flyout doesn't need pathwayId re-lookup.
  const clinicalModulesLinks: ClinicalModulesNavLink[] = useMemo(
    () => buildClinicalModulesShellNavItem(pathwayId, ecgNavEnabled).links,
    [pathwayId, ecgNavEnabled],
  );

  // `max-md:hidden` — avoid Tailwind v4 `hidden` + `md:block` display ordering bugs (desktop nav stuck display:none).
  return (
    <nav
      className="w-full max-md:hidden"
      aria-label="Learner primary actions"
      data-nn-learner-shell-study-nav=""
    >
      <div className="grid w-full grid-cols-1 gap-2 md:max-lg:grid-cols-2 md:max-lg:gap-x-2 md:max-lg:gap-y-2 lg:flex lg:flex-wrap lg:items-center lg:justify-start lg:gap-x-2 lg:gap-y-2 xl:gap-x-3">
        {items.map((item) => {
          const active = isLearnerShellNavActive(pathname, item);
          const isPrimarySurface = isLearnerPrimaryNavKey(item.id);

          // Clinical Modules renders as a flyout dropdown, not a plain link.
          if (item.id === CLINICAL_MODULES_SHELL_NAV_ID) {
            return (
              <ClinicalModulesFlyout
                key={item.id}
                label={item.label}
                links={clinicalModulesLinks}
                isActive={active}
              />
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={() => {
                trackClientEvent(PH.learnerNavClick, {
                  actor: "authenticated",
                  nav_id: item.id,
                  href: item.href,
                  country: readMarketingRegionFromDocument(),
                  surface: "learner_primary_nav",
                });
              }}
              className={
                active
                  ? "nn-marketing-body-sm max-w-full min-h-11 min-w-0 touch-manipulation rounded-full border border-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--bg-card))] px-2.5 py-1.5 text-start font-medium leading-snug text-[var(--semantic-brand)] transition-colors duration-150 sm:px-3 sm:py-2 md:max-lg:w-full md:max-lg:justify-center md:max-lg:text-center lg:w-auto lg:justify-start lg:text-start"
                  : isPrimarySurface
                    ? "nn-marketing-body-sm max-w-full min-h-11 min-w-0 touch-manipulation rounded-full px-2.5 py-1.5 text-start leading-snug transition-colors duration-150 sm:px-3 sm:py-2 nn-learner-shell-link--primary hover:text-primary md:max-lg:flex md:max-lg:w-full md:max-lg:justify-center md:max-lg:text-center lg:inline-flex lg:w-auto lg:justify-start lg:text-start"
                    : "nn-marketing-body-sm max-w-full min-h-11 min-w-0 touch-manipulation rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2.5 py-1.5 text-start font-medium leading-snug text-[var(--theme-body-text)] transition-colors duration-150 hover:bg-[var(--accent-soft)] hover:text-primary sm:px-3 sm:py-2 md:max-lg:flex md:max-lg:w-full md:max-lg:justify-center md:max-lg:text-center lg:inline-flex lg:w-auto lg:justify-start lg:text-start"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function LearnerShellMobileBottomNav({
  pathwayPillLabel,
  pathwayId,
  pathwayHubHref,
  examsLabel,
  printablesNavVisible,
  ecgNavEnabled,
}: LearnerShellNavProps) {
  const pathname = usePathname();
  const items = useLearnerNavItems({ pathwayId, examsLabel, printablesNavVisible, ecgNavEnabled });
  const pathwayHref = pathwayHubHref ?? "/app";
  const pathwayLabel = pathwayPillLabel ?? "Pathway";

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-6px_20px_-10px_color-mix(in_srgb,var(--semantic-text-primary)_10%,transparent)] md:hidden [overscroll-behavior-x:contain]"
      aria-label="Learner bottom navigation"
      data-nn-learner-shell-study-nav=""
    >
      <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-1.5 px-0.5">
        <Link
          href={pathwayHref}
          title={pathwayLabel}
          onClick={() => {
            trackClientEvent(PH.learnerNavClick, {
              actor: "authenticated",
              nav_id: "pathway-pill",
              href: pathwayHref,
              country: readMarketingRegionFromDocument(),
              surface: "learner_bottom_nav",
            });
          }}
          className="nn-header-tier-pill nn-header-tier-pill--compact inline-flex min-h-12 max-w-[min(100%,10rem)] shrink-0 touch-manipulation items-center justify-center truncate px-2 sm:max-w-none"
          aria-label={`Open your pathway hub: ${pathwayLabel}`}
        >
          {pathwayLabel}
        </Link>
        {items.map((item) => {
          const active = isLearnerShellNavActive(pathname, item);
          const isPrimarySurface = isLearnerPrimaryNavKey(item.id);
          return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => {
                  trackClientEvent(PH.learnerNavClick, {
                    actor: "authenticated",
                    nav_id: item.id,
                    href: item.href,
                    country: readMarketingRegionFromDocument(),
                    surface: "learner_bottom_nav",
                  });
                }}
                className={
                  active
                    ? "inline-flex min-h-12 min-w-0 max-w-[min(46vw,10rem)] flex-1 touch-manipulation items-center justify-center rounded-full border border-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--bg-card))] px-2 text-center text-xs font-semibold leading-snug text-[var(--semantic-brand)] sm:max-w-none sm:px-2.5"
                  : isPrimarySurface
                    ? "nn-learner-shell-bottom-link--primary inline-flex min-h-12 min-w-0 max-w-[min(46vw,10rem)] flex-1 touch-manipulation items-center justify-center rounded-full px-2 text-center text-xs leading-snug text-[var(--theme-body-text)] sm:max-w-none sm:px-2.5"
                    : "inline-flex min-h-12 min-w-0 max-w-[min(46vw,10rem)] flex-1 touch-manipulation items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2 text-center text-xs font-semibold leading-snug text-[var(--theme-body-text)] sm:max-w-none sm:px-2.5"
              }
            >
              {item.label}
            </Link>
          );
        })}
        <SignOutButton className="inline-flex min-h-12 shrink-0 touch-manipulation items-center justify-center rounded-full border border-[var(--semantic-danger)]/35 bg-[color-mix(in_srgb,var(--semantic-danger)_8%,var(--bg-card))] px-2.5 text-xs font-semibold leading-snug text-[var(--semantic-danger)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 sm:px-3" />
      </div>
    </nav>
  );
}
