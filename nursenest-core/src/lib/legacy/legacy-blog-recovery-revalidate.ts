/**
 * Blog recovery scripts run outside a Next.js request; they log revalidation targets for operators
 * (or for tests) instead of calling `revalidatePath` directly.
 */
export function blogRecoveryRevalidationTargets(slug: string): { paths: string[] } {
  const s = slug.trim();
  return { paths: ["/blog", `/blog/${s}`] };
}
