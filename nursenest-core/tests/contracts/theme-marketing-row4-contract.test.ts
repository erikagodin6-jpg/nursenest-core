/**
 * === THEME ARCHITECTURE CONTRACT (marketing) — STATIC GUARD ===
 *
 * Ocean is the canonical structural theme for the marketing header
 * (`[data-nn-header-layout="marketing-row4"]`). Blossom and Midnight inherit
 * Ocean's structure and may only override the visual layer (color, gradient,
 * shadow, border, opacity, hover/focus state).
 *
 * Forbidden in any Blossom or Midnight rule scoped to `marketing-row4` or its
 * known descendants:
 *   - display
 *   - flex-direction
 *   - flex-wrap
 *   - grid-template / grid-template-columns / grid-template-rows / grid-template-areas
 *   - width / max-width / min-width
 *
 * Escape hatch: a CSS comment `/* theme-contract:allow <reason> *​/`
 * IMMEDIATELY preceding a declaration suppresses the violation for that one
 * declaration. Use sparingly and document the reason.
 *
 * This test reads `premium-redesign-2026.css` as text and fails on any
 * unsuppressed violation. No browser, no DOM, no heavy deps — regex only.
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/theme-marketing-row4-contract.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import fs from "node:fs";
import path from "node:path";

const MARKETING_CSS_PATH = path.resolve(
  process.cwd(),
  "src/app/premium-redesign-2026.css",
);

const FORBIDDEN_PROPERTIES: ReadonlyArray<string> = [
  "display",
  "flex-direction",
  "flex-wrap",
  "grid-template",
  "grid-template-columns",
  "grid-template-rows",
  "grid-template-areas",
  "width",
  "max-width",
  "min-width",
];

const THEME_TOKENS: ReadonlyArray<string> = [
  '[data-theme="blossom"]',
  '[data-theme="midnight"]',
];

const MARKETING_ROW4_DESCENDANTS: ReadonlyArray<string> = [
  "marketing-row4",
  "nn-header-desktop-grid",
  "nn-header-brand-cluster",
  "nn-header-desktop-auth-cluster",
  "nn-marketing-nav-link",
  "nn-marketing-nav-v31-tier-inner",
  "nn-marketing-nav-v31-bar-a",
];

const ESCAPE_HATCH_RE = /\/\*\s*theme-contract:allow\b[^*]*\*\//;

interface RuleBlock {
  selector: string;
  body: string;
}

interface Violation {
  selector: string;
  property: string;
  declaration: string;
}

/**
 * Recursively unwrap `@media (...)` and `@supports (...)` blocks so the body's
 * rules become top-level for the simple block parser below. Operates on a
 * working copy of the CSS text only — never written back to disk.
 */
function flattenAtRules(css: string): string {
  let result = css;
  let changed = true;
  while (changed) {
    changed = false;
    result = result.replace(
      /@(?:media|supports|container)\s*[^{}]*\{((?:[^{}]|\{[^{}]*\})*)\}/g,
      (_match, body: string) => {
        changed = true;
        return body;
      },
    );
  }
  return result;
}

/**
 * Strip block comments so they do not pollute selectors or property scans.
 * Preserves length-irrelevant analysis; this is only used for selector
 * extraction. Declaration-level escape-hatch detection re-reads the original
 * body so it can see the marker comment.
 */
function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

function extractRuleBlocks(css: string): RuleBlock[] {
  const blocks: RuleBlock[] = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(css)) !== null) {
    const rawSelector = match[1] ?? "";
    const body = match[2] ?? "";
    const selector = stripComments(rawSelector).trim().replace(/\s+/g, " ");
    if (!selector) continue;
    blocks.push({ selector, body });
  }
  return blocks;
}

function selectorMatchesContract(selector: string): boolean {
  const hasTheme = THEME_TOKENS.some((tok) => selector.includes(tok));
  if (!hasTheme) return false;
  const touchesMarketingRow4 = MARKETING_ROW4_DESCENDANTS.some((cls) =>
    selector.includes(cls),
  );
  return touchesMarketingRow4;
}

interface Declaration {
  property: string;
  value: string;
  precedingCommentRaw: string;
  declarationRaw: string;
}

/**
 * Parse a rule body into individual declarations, retaining the raw block
 * comment that immediately precedes each declaration so we can detect the
 * `/* theme-contract:allow *​/` escape hatch.
 */
function parseDeclarations(body: string): Declaration[] {
  const decls: Declaration[] = [];
  let buf = "";
  let lastCommentRaw = "";
  let i = 0;
  while (i < body.length) {
    if (body[i] === "/" && body[i + 1] === "*") {
      const end = body.indexOf("*/", i + 2);
      if (end === -1) break;
      const commentRaw = body.slice(i, end + 2);
      if (buf.trim().length === 0) {
        lastCommentRaw = commentRaw;
      }
      i = end + 2;
      continue;
    }
    if (body[i] === ";") {
      const declRaw = buf.trim();
      buf = "";
      if (declRaw.length > 0) {
        const colonIdx = declRaw.indexOf(":");
        if (colonIdx !== -1) {
          decls.push({
            property: declRaw.slice(0, colonIdx).trim().toLowerCase(),
            value: declRaw.slice(colonIdx + 1).trim(),
            precedingCommentRaw: lastCommentRaw,
            declarationRaw: declRaw,
          });
        }
        lastCommentRaw = "";
      }
      i += 1;
      continue;
    }
    buf += body[i];
    i += 1;
  }
  const tail = buf.trim();
  if (tail.length > 0) {
    const colonIdx = tail.indexOf(":");
    if (colonIdx !== -1) {
      decls.push({
        property: tail.slice(0, colonIdx).trim().toLowerCase(),
        value: tail.slice(colonIdx + 1).trim(),
        precedingCommentRaw: lastCommentRaw,
        declarationRaw: tail,
      });
    }
  }
  return decls;
}

function findViolations(css: string): Violation[] {
  const flat = flattenAtRules(css);
  const blocks = extractRuleBlocks(flat);
  const violations: Violation[] = [];
  for (const block of blocks) {
    if (!selectorMatchesContract(block.selector)) continue;
    const decls = parseDeclarations(block.body);
    for (const decl of decls) {
      if (!FORBIDDEN_PROPERTIES.includes(decl.property)) continue;
      if (
        decl.precedingCommentRaw &&
        ESCAPE_HATCH_RE.test(decl.precedingCommentRaw)
      ) {
        continue;
      }
      violations.push({
        selector: block.selector,
        property: decl.property,
        declaration: decl.declarationRaw,
      });
    }
  }
  return violations;
}

describe("theme-marketing-row4-contract (static CSS guard)", () => {
  it("source CSS file exists", () => {
    assert.ok(
      fs.existsSync(MARKETING_CSS_PATH),
      `Expected ${MARKETING_CSS_PATH} to exist`,
    );
  });

  it("no Blossom/Midnight rule scoped to marketing-row4 overrides forbidden structural properties", () => {
    const css = fs.readFileSync(MARKETING_CSS_PATH, "utf8");
    const violations = findViolations(css);
    if (violations.length > 0) {
      const grouped = violations
        .map(
          (v) =>
            `  - selector: ${v.selector}\n    property: ${v.property}\n    decl:     ${v.declaration};`,
        )
        .join("\n");
      assert.fail(
        `Theme architecture contract violations (${violations.length}) — Blossom/Midnight may only override color/visual layer on marketing-row4. Forbidden: ${FORBIDDEN_PROPERTIES.join(", ")}.\n${grouped}\n\nAllowed escape hatch: place '/* theme-contract:allow <reason> */' immediately before the declaration.`,
      );
    }
  });

  it("contract self-test: a synthetic violation is detected", () => {
    const synthetic = `
      :is(html[data-theme="blossom"], html[data-theme="aurora"]) [data-nn-header-layout="marketing-row4"] .nn-header-desktop-grid {
        display: block;
        background: red;
      }
    `;
    const violations = findViolations(synthetic);
    assert.equal(violations.length, 1);
    assert.equal(violations[0]?.property, "display");
  });

  it("contract self-test: escape hatch suppresses a synthetic violation", () => {
    const synthetic = `
      html[data-theme="midnight"] [data-nn-header-layout="marketing-row4"] .nn-marketing-nav-link {
        /* theme-contract:allow legacy IE fallback retained intentionally */
        display: inline-block;
        color: white;
      }
    `;
    const violations = findViolations(synthetic);
    assert.equal(violations.length, 0);
  });

  it("contract self-test: non-theme rule is not checked", () => {
    const synthetic = `
      [data-nn-header-layout="marketing-row4"] .nn-header-desktop-grid {
        display: grid;
        max-width: 80rem;
      }
    `;
    const violations = findViolations(synthetic);
    assert.equal(violations.length, 0);
  });
});
