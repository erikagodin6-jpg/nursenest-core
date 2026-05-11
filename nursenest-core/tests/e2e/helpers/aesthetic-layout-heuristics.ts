/**
 * Automated layout heuristics for the aesthetic audit.
 *
 * All checks run inside the page via `page.evaluate` and return structured
 * findings so the {@link AestheticIssueCollector} can grade them. Heuristics
 * are deliberately conservative — they should report *candidates* without
 * forcing tests to fail. Severity is decided here; CI gating is decided by
 * the aggregator + AESTHETIC_AUDIT_GATE.
 */
import type { Page } from "@playwright/test";
import {
  CARD_HEIGHT_IMBALANCE_RATIO,
  EMPTY_VERTICAL_GAP_RATIO,
  MOBILE_TAP_TARGET_MIN_PX,
  type Severity,
  type ViewportId,
} from "./aesthetic-audit-config";
import { AestheticIssueCollector } from "./aesthetic-regression";

interface BoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface CtaRecord {
  text: string;
  box: BoundingBox;
}

interface ZIndexCollision {
  selectorA: string;
  selectorB: string;
  zA: number;
  zB: number;
  overlap: number;
}

interface TruncationHit {
  selector: string;
  text: string;
  scrollWidth: number;
  clientWidth: number;
}

interface OverflowingNode {
  selector: string;
  excess: number;
}

interface TapTargetHit {
  selector: string;
  text: string;
  minSide: number;
}

interface DuplicateCtaCluster {
  text: string;
  count: number;
  boxes: BoundingBox[];
}

interface GradientHit {
  selector: string;
  gradient: string;
  contrastRatio: number | null;
}

interface CardImbalance {
  containerSelector: string;
  maxHeight: number;
  minHeight: number;
  ratio: number;
  cardCount: number;
}

interface EmptyGap {
  yStart: number;
  yEnd: number;
  height: number;
  viewportHeight: number;
  ratio: number;
}

interface StickyCollision {
  stickySelector: string;
  collidingSelector: string;
  overlap: number;
}

export interface HeuristicResults {
  horizontalOverflow: OverflowingNode[];
  cardImbalances: CardImbalance[];
  emptyVerticalGaps: EmptyGap[];
  orphanedButtons: CtaRecord[];
  duplicateCtas: DuplicateCtaCluster[];
  lowContrastGradients: GradientHit[];
  smallTapTargets: TapTargetHit[];
  truncatedText: TruncationHit[];
  zIndexCollisions: ZIndexCollision[];
  stickyCollisions: StickyCollision[];
  textOnBackgroundContrastSamples: Array<{ selector: string; ratio: number; sample: string }>;
}

/**
 * One shot through the DOM that captures every signal we care about. Keeping
 * this single-pass keeps the audit fast and avoids state drift between checks.
 */
export async function collectHeuristics(page: Page, viewport: ViewportId): Promise<HeuristicResults> {
  const data = await page.evaluate(
    ({ TAP_MIN, CARD_RATIO, GAP_RATIO, vp }) => {
      const cssSelectorFor = (el: Element): string => {
        if (!(el instanceof HTMLElement)) return el.tagName.toLowerCase();
        const dataAttrs = Array.from(el.attributes)
          .filter((a) => a.name.startsWith("data-nn") || a.name === "data-route")
          .slice(0, 2)
          .map((a) => `[${a.name}${a.value ? `="${a.value.slice(0, 32)}"` : ""}]`)
          .join("");
        const id = el.id ? `#${el.id}` : "";
        const cls = el.classList[0] ? `.${el.classList[0]}` : "";
        return `${el.tagName.toLowerCase()}${id}${cls}${dataAttrs}`.slice(0, 160);
      };

      const isVisible = (el: HTMLElement): boolean => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none") return false;
        if (parseFloat(cs.opacity || "1") < 0.05) return false;
        return r.width > 1 && r.height > 1;
      };

      const parseRgb = (color: string): [number, number, number] | null => {
        const m = color.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
        return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
      };
      const luminance = (rgb: [number, number, number]): number => {
        const lin = rgb.map((c) => {
          const x = c / 255;
          return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * lin[0]! + 0.7152 * lin[1]! + 0.0722 * lin[2]!;
      };
      const contrast = (a: [number, number, number], b: [number, number, number]): number => {
        const la = luminance(a);
        const lb = luminance(b);
        const hi = Math.max(la, lb);
        const lo = Math.min(la, lb);
        return (hi + 0.05) / (lo + 0.05);
      };

      const horizontalOverflow: OverflowingNode[] = [];
      const docExcess = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      if (docExcess > 1) {
        horizontalOverflow.push({ selector: "documentElement", excess: docExcess });
      }
      const overflowCandidates = document.querySelectorAll<HTMLElement>(
        "main, section, header, footer, .nn-learner-app, [data-nn-learner-main]",
      );
      for (const el of overflowCandidates) {
        const excess = el.scrollWidth - el.clientWidth;
        const cs = getComputedStyle(el);
        if (excess > 4 && cs.overflowX === "visible") {
          horizontalOverflow.push({ selector: cssSelectorFor(el), excess });
        }
      }

      const ctaSel =
        'button:not([disabled]), a[href], [role="button"], a.btn, [data-nn-cta], [data-nn-e2e-cta]';
      const ctas = Array.from(document.querySelectorAll<HTMLElement>(ctaSel)).filter(isVisible);
      const ctaRecords: CtaRecord[] = ctas
        .map((el) => {
          const r = el.getBoundingClientRect();
          return {
            text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 96),
            box: { x: r.x, y: r.y, w: r.width, h: r.height },
          };
        })
        .filter((c) => c.text.length > 0);

      const smallTapTargets: TapTargetHit[] = [];
      if (vp === "mobile") {
        for (const el of ctas) {
          const r = el.getBoundingClientRect();
          const minSide = Math.min(r.width, r.height);
          if (minSide < TAP_MIN) {
            smallTapTargets.push({
              selector: cssSelectorFor(el),
              text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 64),
              minSide,
            });
          }
        }
      }

      const duplicateCtas: DuplicateCtaCluster[] = [];
      const seen = new Map<string, CtaRecord[]>();
      for (const c of ctaRecords) {
        const key = c.text.toLowerCase();
        if (key.length < 3) continue;
        const list = seen.get(key) ?? [];
        list.push(c);
        seen.set(key, list);
      }
      for (const [text, list] of seen) {
        if (list.length < 3) continue;
        // ignore CTAs that are clearly part of repeating grids (e.g. lesson cards)
        const xs = list.map((c) => c.box.x);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        if (maxX - minX < 50 && list.length < 5) continue;
        duplicateCtas.push({
          text,
          count: list.length,
          boxes: list.map((c) => c.box).slice(0, 8),
        });
      }

      const orphanedButtons: CtaRecord[] = [];
      const docH = document.documentElement.scrollHeight;
      for (const c of ctaRecords) {
        // a CTA below the fold sitting alone in the bottom 8% of the page
        // with no neighbor within 200px is likely orphaned content
        if (c.box.y < docH * 0.85) continue;
        const nearby = ctaRecords.filter(
          (o) => o !== c && Math.abs(o.box.y - c.box.y) < 200 && o.box.y >= c.box.y - 60,
        ).length;
        if (nearby === 0) orphanedButtons.push(c);
      }

      const lowContrastGradients: GradientHit[] = [];
      const gradientCandidates = Array.from(document.querySelectorAll<HTMLElement>(
        "section, header, footer, [class*='hero'], [class*='gradient'], [class*='banner']",
      ));
      for (const el of gradientCandidates) {
        const cs = getComputedStyle(el);
        const bg = cs.backgroundImage || "";
        if (!/(linear|radial|conic)-gradient/i.test(bg)) continue;
        // sample text foreground against approximate midpoint background
        const fgRgb = parseRgb(cs.color || "");
        const stops = bg.match(/rgba?\([^\)]+\)/g) || [];
        const stopRgbs = stops.map(parseRgb).filter((s): s is [number, number, number] => !!s);
        if (!fgRgb || stopRgbs.length === 0) continue;
        const minRatio = Math.min(...stopRgbs.map((s) => contrast(fgRgb, s)));
        if (minRatio < 2.5) {
          lowContrastGradients.push({
            selector: cssSelectorFor(el),
            gradient: bg.slice(0, 160),
            contrastRatio: minRatio,
          });
        }
      }

      const truncatedText: TruncationHit[] = [];
      const textNodes = Array.from(document.querySelectorAll<HTMLElement>(
        "h1, h2, h3, h4, p, li, button, a, [data-nn-card-title], [data-nn-cta]",
      ));
      for (const el of textNodes) {
        if (!isVisible(el)) continue;
        const cs = getComputedStyle(el);
        const clamped = cs.webkitLineClamp && cs.webkitLineClamp !== "none";
        const ellipsis = cs.textOverflow === "ellipsis" && cs.whiteSpace === "nowrap";
        if (!clamped && !ellipsis) continue;
        if (el.scrollWidth - el.clientWidth > 2 || el.scrollHeight - el.clientHeight > 2) {
          truncatedText.push({
            selector: cssSelectorFor(el),
            text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80),
            scrollWidth: el.scrollWidth,
            clientWidth: el.clientWidth,
          });
        }
      }

      const cardImbalances: CardImbalance[] = [];
      const cardContainers = Array.from(document.querySelectorAll<HTMLElement>(
        "[class*='grid'], [class*='cards'], [data-nn-card-grid]",
      ));
      for (const container of cardContainers) {
        const children = Array.from(container.children).filter(
          (c) => c instanceof HTMLElement && isVisible(c),
        ) as HTMLElement[];
        if (children.length < 3) continue;
        const heights = children.map((c) => c.getBoundingClientRect().height).filter((h) => h > 16);
        if (heights.length < 3) continue;
        const max = Math.max(...heights);
        const min = Math.min(...heights);
        if (min === 0) continue;
        const ratio = max / min;
        if (ratio > CARD_RATIO) {
          cardImbalances.push({
            containerSelector: cssSelectorFor(container),
            maxHeight: max,
            minHeight: min,
            ratio,
            cardCount: heights.length,
          });
        }
      }

      // Empty vertical gaps: scan main column for big spans of nothing.
      const emptyVerticalGaps: EmptyGap[] = [];
      const mainCol =
        document.querySelector<HTMLElement>("main") ||
        document.querySelector<HTMLElement>("#nn-learner-main") ||
        document.querySelector<HTMLElement>("[data-nn-learner-main]") ||
        document.body;
      if (mainCol) {
        const candidates = Array.from(mainCol.querySelectorAll<HTMLElement>("section, [data-nn-section], article, .nn-section"))
          .filter(isVisible)
          .map((el) => {
            const r = el.getBoundingClientRect();
            return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY };
          })
          .sort((a, b) => a.top - b.top);
        for (let i = 1; i < candidates.length; i++) {
          const prev = candidates[i - 1]!;
          const cur = candidates[i]!;
          const gap = cur.top - prev.bottom;
          if (gap > 0 && gap / window.innerHeight > GAP_RATIO) {
            emptyVerticalGaps.push({
              yStart: prev.bottom,
              yEnd: cur.top,
              height: gap,
              viewportHeight: window.innerHeight,
              ratio: gap / window.innerHeight,
            });
          }
        }
      }

      // z-index collisions: visible elements with explicit z-index that overlap a sibling
      const zIndexCollisions: ZIndexCollision[] = [];
      const zNodes = Array.from(document.querySelectorAll<HTMLElement>("*"))
        .filter(isVisible)
        .filter((el) => {
          const z = getComputedStyle(el).zIndex;
          return z !== "auto" && !Number.isNaN(Number(z));
        })
        .slice(0, 80); // bound — page can have thousands
      for (let i = 0; i < zNodes.length; i++) {
        const a = zNodes[i]!;
        const ra = a.getBoundingClientRect();
        const za = Number(getComputedStyle(a).zIndex);
        for (let j = i + 1; j < zNodes.length; j++) {
          const b = zNodes[j]!;
          if (a.contains(b) || b.contains(a)) continue;
          const rb = b.getBoundingClientRect();
          const zb = Number(getComputedStyle(b).zIndex);
          const overlapW = Math.max(0, Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left));
          const overlapH = Math.max(0, Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top));
          const overlap = overlapW * overlapH;
          // require meaningful overlap (≥40×40) and clashing layers
          if (overlap < 1600) continue;
          if (Math.abs(za - zb) < 1) continue;
          zIndexCollisions.push({
            selectorA: cssSelectorFor(a),
            selectorB: cssSelectorFor(b),
            zA: za,
            zB: zb,
            overlap,
          });
          if (zIndexCollisions.length >= 12) break;
        }
        if (zIndexCollisions.length >= 12) break;
      }

      const stickyCollisions: StickyCollision[] = [];
      const stickyNodes = Array.from(document.querySelectorAll<HTMLElement>("*")).filter((el) => {
        if (!isVisible(el)) return false;
        const cs = getComputedStyle(el);
        return cs.position === "sticky" || cs.position === "fixed";
      });
      for (const sticky of stickyNodes.slice(0, 8)) {
        const sr = sticky.getBoundingClientRect();
        if (sr.bottom < 0 || sr.top > window.innerHeight) continue;
        const stickyHeight = sr.height;
        if (stickyHeight < 20) continue;
        const beneath = document.elementsFromPoint(sr.left + sr.width / 2, sr.top + stickyHeight + 2);
        for (const el of beneath) {
          if (!(el instanceof HTMLElement)) continue;
          if (sticky.contains(el) || el.contains(sticky)) continue;
          const rb = el.getBoundingClientRect();
          const overlap = Math.max(0, sr.bottom - rb.top);
          // we want to catch headers eating into hero text
          if (overlap > 6 && rb.height > 18 && el.textContent && el.textContent.trim().length > 4) {
            stickyCollisions.push({
              stickySelector: cssSelectorFor(sticky),
              collidingSelector: cssSelectorFor(el),
              overlap,
            });
            break;
          }
        }
      }

      // Sample text-on-background contrast for the largest visible headings.
      const textOnBackgroundContrastSamples: Array<{
        selector: string;
        ratio: number;
        sample: string;
      }> = [];
      const headingSamples = Array.from(document.querySelectorAll<HTMLElement>("h1, h2, h3"))
        .filter(isVisible)
        .slice(0, 6);
      for (const el of headingSamples) {
        const fg = parseRgb(getComputedStyle(el).color || "");
        let bgEl: HTMLElement | null = el;
        let bg: [number, number, number] | null = null;
        while (bgEl) {
          const c = parseRgb(getComputedStyle(bgEl).backgroundColor || "");
          if (c && (c[0] + c[1] + c[2] > 0)) {
            bg = c;
            break;
          }
          bgEl = bgEl.parentElement;
        }
        if (!fg || !bg) continue;
        const ratio = contrast(fg, bg);
        textOnBackgroundContrastSamples.push({
          selector: cssSelectorFor(el),
          ratio,
          sample: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60),
        });
      }

      return {
        horizontalOverflow,
        cardImbalances,
        emptyVerticalGaps,
        orphanedButtons,
        duplicateCtas,
        lowContrastGradients,
        smallTapTargets,
        truncatedText,
        zIndexCollisions,
        stickyCollisions,
        textOnBackgroundContrastSamples,
      };
    },
    {
      TAP_MIN: MOBILE_TAP_TARGET_MIN_PX,
      CARD_RATIO: CARD_HEIGHT_IMBALANCE_RATIO,
      GAP_RATIO: EMPTY_VERTICAL_GAP_RATIO,
      vp: viewport,
    },
  );

  return data as HeuristicResults;
}

/**
 * Severity table — kept centralized so report consumers can rely on stable
 * ruleId → severity mapping. Adjust here, not in spec files.
 */
const HEURISTIC_SEVERITY: Record<string, Severity> = {
  "horizontal-overflow": "critical",
  "horizontal-overflow-document": "critical",
  "card-height-imbalance": "moderate",
  "empty-vertical-gap": "moderate",
  "orphaned-button": "moderate",
  "duplicate-cta-cluster": "moderate",
  "low-contrast-gradient": "major",
  "small-tap-target": "major",
  "text-truncation": "moderate",
  "z-index-collision": "major",
  "sticky-collision": "critical",
  "low-contrast-heading-critical": "critical",
  "low-contrast-heading-major": "major",
  "low-contrast-heading-moderate": "moderate",
};

function record(
  collector: AestheticIssueCollector,
  ruleId: string,
  message: string,
  detail: Record<string, unknown>,
  overrideSeverity?: Severity,
): void {
  const severity = overrideSeverity ?? HEURISTIC_SEVERITY[ruleId] ?? "cosmetic";
  collector.recordHeuristic(ruleId, severity, message, detail);
}

export function attachHeuristicsToCollector(
  collector: AestheticIssueCollector,
  results: HeuristicResults,
): void {
  for (const n of results.horizontalOverflow) {
    const id = n.selector === "documentElement" ? "horizontal-overflow-document" : "horizontal-overflow";
    record(collector, id, `Horizontal overflow on ${n.selector} (${n.excess}px excess)`, n);
  }

  for (const c of results.cardImbalances) {
    record(
      collector,
      "card-height-imbalance",
      `Card heights vary ${c.ratio.toFixed(2)}× in ${c.containerSelector} (max ${c.maxHeight.toFixed(0)} / min ${c.minHeight.toFixed(0)})`,
      c,
    );
  }

  for (const g of results.emptyVerticalGaps) {
    record(
      collector,
      "empty-vertical-gap",
      `Empty vertical gap ${g.height.toFixed(0)}px (${(g.ratio * 100).toFixed(0)}% of viewport)`,
      g,
    );
  }

  for (const o of results.orphanedButtons) {
    record(
      collector,
      "orphaned-button",
      `Orphaned CTA "${o.text}" near bottom of page`,
      o as unknown as Record<string, unknown>,
    );
  }

  for (const d of results.duplicateCtas) {
    record(
      collector,
      "duplicate-cta-cluster",
      `Duplicate CTA copy appears ${d.count}× ("${d.text}")`,
      d,
    );
  }

  for (const grad of results.lowContrastGradients) {
    record(
      collector,
      "low-contrast-gradient",
      `Gradient background may be unreadable (ratio ${grad.contrastRatio?.toFixed(2) ?? "?"})`,
      grad,
    );
  }

  for (const t of results.smallTapTargets) {
    record(
      collector,
      "small-tap-target",
      `Tap target "${t.text}" is ${t.minSide.toFixed(0)}px on mobile`,
      t,
    );
  }

  for (const t of results.truncatedText) {
    record(
      collector,
      "text-truncation",
      `Truncated text: "${t.text}"`,
      t,
    );
  }

  for (const z of results.zIndexCollisions) {
    record(
      collector,
      "z-index-collision",
      `z-index collision between ${z.selectorA} (z=${z.zA}) and ${z.selectorB} (z=${z.zB})`,
      z,
    );
  }

  for (const s of results.stickyCollisions) {
    record(
      collector,
      "sticky-collision",
      `Sticky/fixed ${s.stickySelector} overlaps ${s.collidingSelector} by ${s.overlap.toFixed(0)}px`,
      s,
    );
  }

  for (const sample of results.textOnBackgroundContrastSamples) {
    if (sample.ratio < 2.0) {
      record(
        collector,
        "low-contrast-heading-critical",
        `Heading "${sample.sample}" contrast ${sample.ratio.toFixed(2)} (unreadable)`,
        sample,
      );
    } else if (sample.ratio < 3.0) {
      record(
        collector,
        "low-contrast-heading-major",
        `Heading "${sample.sample}" contrast ${sample.ratio.toFixed(2)}`,
        sample,
      );
    } else if (sample.ratio < 4.5) {
      record(
        collector,
        "low-contrast-heading-moderate",
        `Heading "${sample.sample}" contrast ${sample.ratio.toFixed(2)} (below WCAG AA)`,
        sample,
      );
    }
  }
}
