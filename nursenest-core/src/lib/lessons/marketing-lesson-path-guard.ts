/**
 * Guards CMS/blog “related lesson” paths so we do not link to hubs or empty routes as if they were lessons.
 * Lesson detail URLs contain `/lessons/<slug>` where `<slug>` is not `topics`.
 */
export function isPlausibleMarketingLessonDetailPath(path: string): boolean {
  const p = path.trim();
  if (!p.startsWith("/")) return false;
  if (/\/lessons\/?$/.test(p)) return false;
  const idx = p.indexOf("/lessons/");
  if (idx === -1) return false;
  const rest = p.slice(idx + "/lessons/".length);
  if (!rest || rest.startsWith("topics/")) return false;
  const first = rest.split("/")[0] ?? "";
  return first.length > 0;
}
