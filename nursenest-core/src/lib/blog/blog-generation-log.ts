/**
 * Unified stdout logs for automated blog materialization (grep-friendly in production logs).
 */
export function logBlogGenerationCreated(slug: string, id: string, publishedAt: Date): void {
  console.log(`[blog-generation] created BlogPost slug=${slug} id=${id} publishedAt=${publishedAt.toISOString()}`);
}

export function logBlogGenerationRejected(slug: string, reason: string): void {
  const safeReason = reason.replace(/\s+/g, " ").trim().slice(0, 800);
  console.log(`[blog-generation] rejected slug=${slug} reason=${safeReason}`);
}
