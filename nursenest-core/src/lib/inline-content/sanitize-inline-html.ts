/**
 * Minimal HTML sanitizer for admin-saved rich inline copy (no external deps).
 * Strips scripts, event handlers, embeds, and javascript: URLs. Not a full HTML parser.
 */
export function sanitizeInlineRichHtml(html: string): string {
  let s = html;
  // Remove well-formed script blocks first (do not strip `</script>` before this or pairs won't match).
  s = s.replace(/<script\b[\s\S]*?<\/script>/gi, "");
  s = s.replace(/<\/script\b[^>]*>/gi, "");
  // Unclosed `<script…` (malformed / attacker) — drop from the opening tag onward.
  s = s.replace(/<script\b[\s\S]*/gi, "");
  s = s.replace(/<style\b[\s\S]*?>[\s\S]*?<\/style>/gi, "");
  s = s.replace(/<iframe\b[\s\S]*?>[\s\S]*?<\/iframe>/gi, "");
  s = s.replace(/<object\b[\s\S]*?>[\s\S]*?<\/object>/gi, "");
  s = s.replace(/<embed\b[^>]*>/gi, "");
  s = s.replace(/\s(on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+))/gi, "");
  s = s.replace(/javascript:/gi, "blocked:");
  s = s.replace(/vbscript:/gi, "blocked:");
  s = s.replace(/data:text\/html/gi, "blocked:");
  return s;
}
