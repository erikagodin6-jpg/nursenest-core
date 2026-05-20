/**
 * Hard validation for **seed/import** pipelines — throws instead of filtering bad rows.
 * Do not call from hot-path RSC pages (use Playwright / cron probes instead).
 */

export class PublicContentNotRenderableError extends Error {
  constructor(
    message: string,
    readonly surface: "blog" | "lessons" | "flashcards",
  ) {
    super(message);
    this.name = "PublicContentNotRenderableError";
  }
}

export function assertPublicBlogSeedRenderable(args: {
  slug: string;
  title: string;
  body: string;
  pathwayId?: string | null;
}): void {
  const slug = args.slug?.trim() ?? "";
  if (slug.length < 2) {
    throw new PublicContentNotRenderableError("blog seed: slug missing or too short", "blog");
  }
  if (!args.title?.trim()) {
    throw new PublicContentNotRenderableError(`blog seed: empty title (slug=${slug})`, "blog");
  }
  if (!args.body?.trim()) {
    throw new PublicContentNotRenderableError(`blog seed: empty body (slug=${slug})`, "blog");
  }
}
