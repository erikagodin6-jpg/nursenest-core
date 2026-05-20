/**
 * Contract tests — marketing footer regression guards.
 *
 * Guards against:
 *   1. Duplicate section headings (h3 + accordion summary both visible on desktop)
 *   2. Chevron icons rendered alongside headings on desktop
 *   3. Missing desktop-hide rule for accordion summary in CSS (specificity fix)
 *   4. Missing blossom contrast override (dark nav-fg on dark brand-strong bg)
 *
 * These are static file-read tests; no DOM or browser is needed.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..", "..");

const footerComponent = readFileSync(
  join(ROOT, "src/components/layout/site-footer.tsx"),
  "utf8",
);

const footerCss = readFileSync(
  join(ROOT, "src/app/styles/marketing/footer-seo.css"),
  "utf8",
);

// ── Component structure ───────────────────────────────────────────────────────

describe("site-footer component — heading deduplication", () => {
  it("renders exactly one h3 per nav column with hidden md:block (desktop-only static heading)", () => {
    // h3 with desktop-only visibility — must be present
    assert.ok(
      footerComponent.includes('className="nn-footer-col-heading hidden md:block"'),
      'h3.nn-footer-col-heading must have "hidden md:block" to be desktop-only static heading',
    );
  });

  it("accordion summary has md:hidden so it is hidden on desktop", () => {
    assert.ok(
      footerComponent.includes('className="nn-footer-premium-accordion-summary md:hidden"'),
      'summary must carry "md:hidden" Tailwind class so it is invisible on desktop ≥768px',
    );
  });

  it("accordion icon (chevron) is only inside the md:hidden summary, never standalone on desktop", () => {
    // The icon span must appear only inside the accordion summary block
    const summaryBlock = footerComponent.match(
      /<summary[^>]*nn-footer-premium-accordion-summary[^>]*>[\s\S]*?<\/summary>/,
    );
    assert.ok(summaryBlock, "accordion summary block must exist in component");
    assert.ok(
      summaryBlock![0].includes("nn-footer-premium-accordion-icon"),
      "chevron icon must be inside the summary block (not rendered standalone)",
    );

    // The icon must NOT appear outside a summary element at all
    const iconsOutsideSummary = footerComponent
      .replace(/<summary[\s\S]*?<\/summary>/g, "")
      .includes("nn-footer-premium-accordion-icon");
    assert.equal(
      iconsOutsideSummary,
      false,
      "nn-footer-premium-accordion-icon must not appear outside a <summary> element",
    );
  });

  it("FooterPremiumNavColumn renders heading title exactly once in h3 and once in summary — not duplicated at top level", () => {
    // Title is passed once as prop and used in two places (h3 + summary);
    // both are gated by visibility classes — there must be no third rendering.
    const h3Matches = footerComponent.match(/nn-footer-col-heading hidden md:block/g) ?? [];
    const summaryMatches = footerComponent.match(/nn-footer-premium-accordion-summary md:hidden/g) ?? [];

    // There is one h3 and one summary per FooterPremiumNavColumn definition
    assert.equal(h3Matches.length, 1, "exactly one h3 heading definition in FooterPremiumNavColumn");
    assert.equal(summaryMatches.length, 1, "exactly one summary definition in FooterPremiumNavColumn");
  });
});

// ── CSS rules ─────────────────────────────────────────────────────────────────

describe("footer-seo.css — desktop accordion-summary hidden rule", () => {
  it("@media (min-width: 768px) block hides .nn-footer-premium-accordion-summary", () => {
    // The hide rule must appear in a min-width:768px block that comes AFTER the base display:flex
    // rule (cascade order). We find the last 768px block to verify it contains display:none.
    const allMediaIdx: number[] = [];
    let searchFrom = 0;
    while (true) {
      const idx = footerCss.indexOf("min-width: 768px", searchFrom);
      if (idx === -1) break;
      allMediaIdx.push(idx);
      searchFrom = idx + 1;
    }
    assert.ok(allMediaIdx.length > 0, "footer CSS must contain at least one @media (min-width: 768px) block");

    // Find any 768px block that contains both the summary selector and display:none
    const hasSummaryHideInAny768Block = allMediaIdx.some((mediaIdx) => {
      // Grab content from the media query up to the next @media or end of accordion section
      const blockContent = footerCss.slice(mediaIdx, mediaIdx + 600);
      const summaryIdx = blockContent.indexOf("nn-footer-premium-accordion-summary");
      if (summaryIdx === -1) return false;
      const ruleSnippet = blockContent.slice(summaryIdx, summaryIdx + 100);
      return ruleSnippet.includes("display: none");
    });

    assert.ok(
      hasSummaryHideInAny768Block,
      "@media (min-width: 768px) must contain a rule setting .nn-footer-premium-accordion-summary { display: none } " +
        "to override the base display:flex rule (specificity fix for duplicate desktop headings). " +
        "The rule must appear in a 768px block that is AFTER the base display:flex rule in the file.",
    );
  });

  it("base .nn-footer-premium-accordion-summary rule sets display:flex (mobile accordion trigger)", () => {
    assert.ok(
      footerCss.includes("nn-footer-premium-accordion-summary") &&
        footerCss.includes("display: flex"),
      "base (non-media-query) rule must set display:flex for mobile accordion trigger",
    );
  });
});

describe("footer-seo.css — blossom theme contrast fix", () => {
  it("blossom override sets --footer-fg to #ffffff for WCAG contrast on dark brand-strong background", () => {
    // The blossom section must contain a rule that sets --footer-fg: #ffffff
    const blossomSections = footerCss.match(
      /\[data-theme="blossom"\][^{]*\{[^}]*\}/g,
    ) ?? [];
    const hasFgOverride = blossomSections.some(
      (block) => block.includes("--footer-fg") && block.includes("#ffffff"),
    );
    assert.ok(
      hasFgOverride,
      '[data-theme="blossom"] must override --footer-fg: #ffffff in footer CSS ' +
        "(blossom --footer-bg is dark #b3359a; inheriting dark nav-fg #10182f has no contrast)",
    );
  });

  it("blossom override also recalculates --footer-muted and --footer-border from white", () => {
    const blossomSections = footerCss.match(
      /\[data-theme="blossom"\][^{]*\{[^}]*\}/g,
    ) ?? [];
    const hasMutedAndBorder = blossomSections.some(
      (block) =>
        block.includes("--footer-muted") &&
        block.includes("--footer-border") &&
        block.includes("#ffffff"),
    );
    assert.ok(
      hasMutedAndBorder,
      "[data-theme=\"blossom\"] footer rule must recalculate --footer-muted and --footer-border " +
        "from #ffffff so all footer text tokens are light on the dark blossom background",
    );
  });
});

describe("footer-seo.css — footer foreground tokens use semantic token classes", () => {
  it("footer link color uses --footer-muted token (not a hardcoded dark hex)", () => {
    // The .nn-footer-link rule in globals.css uses --footer-muted — verify the token is referenced in footer CSS
    assert.ok(
      footerCss.includes("--footer-muted"),
      "footer CSS must reference --footer-muted token for muted/link text color",
    );
  });

  it("footer column heading uses --footer-fg token for text color", () => {
    assert.ok(
      footerCss.includes("--footer-fg"),
      "footer CSS must reference --footer-fg token for heading/body text color",
    );
  });

  it("footer CSS does not hardcode a dark color (#0f172a/#10182f/#1e293b) as footer foreground", () => {
    // Any occurrence of these dark hex values should only be in comments, not in property values
    const lines = footerCss.split("\n");
    const darkFgInProperty = lines.filter((line) => {
      const isComment = line.trim().startsWith("/*") || line.trim().startsWith("*");
      if (isComment) return false;
      // Check if a dark nav-fg hex is used as a direct color value (not via token)
      return (
        /color:\s*#(0f172a|10182f|1e293b)/i.test(line) ||
        /--footer-fg:\s*#(0f172a|10182f|1e293b)/i.test(line)
      );
    });
    assert.equal(
      darkFgInProperty.length,
      0,
      `footer CSS must not hardcode dark hex colors as --footer-fg or color properties. Offending lines:\n${darkFgInProperty.join("\n")}`,
    );
  });
});
