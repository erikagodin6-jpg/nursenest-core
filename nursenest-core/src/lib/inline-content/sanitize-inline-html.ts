/**
 * Minimal HTML sanitizer for admin-saved rich inline copy (no external deps).
 * Strips scripts, event handlers, and javascript: URLs. Not a full HTML parser.
 */
export function sanitizeInlineRichHtml(html: string): string {
  let s = html.replace(/<\/script\b[^>]*>/gi, "");
  s = s.replace(/<script\b[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  s = s.replace(/<style\b[\s\S]*?>[\s\S]*?<\/style>/gi, "");
  s = s.replace(/\s(on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+))/gi, "");
  s = s.replace(/javascript:/gi, "blocked:");
  s = s.replace(/data:text\/html/gi, "blocked:");
  return s;
}
