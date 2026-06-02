/** Shape aligned with `client/src/allied/data/paramedic-blog-data.ts` (avoids cross-package type import in build). */
export type ParamedicBlogArticle = {
  slug: string;
  title: string;
  metaDescription: string;
  sections: {
    title: string;
    level: number;
    content: string;
    bullets?: string[];
    numbered?: string[];
  }[];
  faq?: { question: string; answer: string }[];
};

/** Convert allied paramedic article to a single HTML document (stored in BlogPost.body). */
export function paramedicArticleToHtml(article: ParamedicBlogArticle): string {
  const parts: string[] = [];
  for (const sec of article.sections) {
    const level = Math.min(6, Math.max(2, sec.level ?? 2));
    parts.push(`<h${level}>${escapeHtml(sec.title)}</h${level}>`);
    if (sec.content) parts.push(`<p>${formatInline(sec.content)}</p>`);
    if (sec.bullets?.length) {
      parts.push(`<ul>${sec.bullets.map((b) => `<li>${formatInline(b)}</li>`).join("")}</ul>`);
    }
    if (sec.numbered?.length) {
      parts.push(`<ol>${sec.numbered.map((b) => `<li>${formatInline(b)}</li>`).join("")}</ol>`);
    }
  }
  if (article.faq?.length) {
    parts.push("<h2>FAQ</h2>");
    for (const f of article.faq) {
      parts.push(`<h3>${escapeHtml(f.question)}</h3><p>${formatInline(f.answer)}</p>`);
    }
  }
  return parts.join("\n");
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function formatInline(s: string): string {
  return escapeHtml(s).replace(/\n/g, "<br/>");
}

export function excerptFromParamedic(article: ParamedicBlogArticle): string {
  if (article.metaDescription?.trim()) return article.metaDescription.trim().slice(0, 500);
  const first = article.sections[0]?.content || "";
  return first.slice(0, 280) + (first.length > 280 ? "…" : "");
}
