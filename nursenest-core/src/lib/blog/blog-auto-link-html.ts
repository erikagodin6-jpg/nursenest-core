import { defaultPracticeHubForExam, toolPathForSlug } from "./blog-exam-routes";

export type BlogAutoLinkContext = {
  exam?: string | null;
  /** Absolute or root-relative lesson paths already curated on the post */
  relatedLessonPaths?: string[];
  relatedTools?: string[];
};

type LinkRule = { pattern: RegExp; href: string };

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Build phrase → link rules from post context (longest phrases first to avoid partial matches). */
export function buildAutoLinkRules(ctx: BlogAutoLinkContext): LinkRule[] {
  const rules: LinkRule[] = [];
  const hub = defaultPracticeHubForExam(ctx.exam ?? null);

  for (const raw of ctx.relatedLessonPaths ?? []) {
    const path = raw.trim();
    if (!path.startsWith("/")) continue;
    const segments = path.split("/").filter(Boolean);
    const slug = segments[segments.length - 1];
    if (!slug) continue;
    const phrase = slug.replace(/-/g, " ");
    if (phrase.length < 4) continue;
    rules.push({
      pattern: new RegExp(`\\b(${escapeRegex(phrase)})\\b`, "gi"),
      href: path,
    });
  }

  for (const tool of ctx.relatedTools ?? []) {
    const href = toolPathForSlug(tool);
    const label = tool.replace(/-/g, " ");
    if (label.length < 2) continue;
    rules.push({
      pattern: new RegExp(`\\b(${escapeRegex(label)})\\b`, "gi"),
      href,
    });
  }

  rules.push(
    { pattern: /\b(NCLEX)\b/g, href: "/exam-lessons" },
    { pattern: /\b(practice questions)\b/gi, href: hub },
    { pattern: /\b(question bank)\b/gi, href: hub },
    { pattern: /\b(study plan)\b/gi, href: "/app/study-plan" },
  );

  rules.sort((a, b) => {
    const al = a.pattern.source.length;
    const bl = b.pattern.source.length;
    return bl - al;
  });

  return dedupeRules(rules);
}

function dedupeRules(rules: LinkRule[]): LinkRule[] {
  const seen = new Set<string>();
  const out: LinkRule[] = [];
  for (const r of rules) {
    const k = `${r.pattern.source}::${r.href}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(r);
  }
  return out;
}

function applyRulesToPlainText(text: string, rules: LinkRule[]): string {
  let out = text;
  for (const { pattern, href } of rules) {
    out = out.replace(pattern, (m) => {
      if (m.includes("<a ")) return m;
      return `<a href="${href}" class="nn-blog-auto-link">${m}</a>`;
    });
  }
  return out;
}

/**
 * Injects internal links into HTML body text nodes only (skips existing anchors, pre, script, style).
 * Safe for trusted admin HTML; escapes are not re-parsed as XML.
 */
export function applyAutoLinksToHtml(html: string, ctx: BlogAutoLinkContext): string {
  const rules = buildAutoLinkRules(ctx);
  if (rules.length === 0) return html;

  const tokens = html.split(/(<[^>]+>)/g);
  let inA = 0;
  let inPre = 0;
  let inScript = 0;
  const result: string[] = [];

  for (const token of tokens) {
    if (!token) continue;
    if (token.startsWith("<")) {
      const low = token.toLowerCase();
      if (/^<a[\s>]/.test(low) && !low.startsWith("</a")) inA += 1;
      if (low === "</a>" || low.startsWith("</a>")) inA = Math.max(0, inA - 1);
      if (low.startsWith("<pre")) inPre += 1;
      if (low === "</pre>" || low.startsWith("</pre>")) inPre = Math.max(0, inPre - 1);
      if (low.startsWith("<script")) inScript += 1;
      if (low.startsWith("</script")) inScript = Math.max(0, inScript - 1);
      result.push(token);
      continue;
    }
    if (inA > 0 || inPre > 0 || inScript > 0) {
      result.push(token);
      continue;
    }
    result.push(applyRulesToPlainText(token, rules));
  }
  return result.join("");
}
