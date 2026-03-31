/**
 * Injects safe internal links into blog HTML using an allowlist (no user-supplied hrefs).
 * Splits on tags so we never wrap inside attributes or existing anchors' tag tokens.
 */

const DEFAULT_LINKS: Array<{ pattern: RegExp; href: string }> = [
  { pattern: /\bNCLEX-RN\b/g, href: "/nclex-rn-practice-questions" },
  { pattern: /\bNCLEX-PN\b/g, href: "/nclex-pn-practice-questions" },
  { pattern: /\bREx-PN\b/g, href: "/rex-pn-practice-questions" },
  { pattern: /\bexam lesson(s)?\b/gi, href: "/exam-lessons" },
  { pattern: /\bpractice question(s)?\b/gi, href: "/nclex-rn-practice-questions" },
  { pattern: /\bstudy plan\b/gi, href: "/app/study-plan" },
  { pattern: /\bfree tools?\b/gi, href: "/tools" },
];

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

/**
 * Link only in text fragments (even segments when splitting by HTML tags).
 */
export function applyBlogAutoLinks(html: string, extraLinks?: Array<{ pattern: RegExp; href: string }>): string {
  const rules = [...(extraLinks ?? []), ...DEFAULT_LINKS];
  const parts = html.split(/(<[^>]+>)/g);
  return parts
    .map((part, i) => {
      if (i % 2 === 1) return part;
      let text = part;
      for (const rule of rules) {
        const pattern = new RegExp(rule.pattern.source, rule.pattern.flags);
        text = text.replace(pattern, (match) => {
          return `<a class="text-primary underline underline-offset-2" href="${escapeAttr(rule.href)}">${match}</a>`;
        });
      }
      return text;
    })
    .join("");
}
