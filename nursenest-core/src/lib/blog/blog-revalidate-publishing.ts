import "server-only";

import { revalidatePath } from "next/cache";

/** Paths touched when blog posts go live or sitemap should refresh (keep aligned with `/api/cron/blog-publish`). */
export function revalidateBlogPublishingSurfaces() {
  revalidatePath("/blog");
  revalidatePath("/blog", "layout");
  revalidatePath("/");
  revalidatePath("/lessons");
  revalidatePath("/sitemap.xml");
  revalidatePath("/sitemaps/blog.xml");
  revalidatePath("/sitemaps/localized-blog.xml");
}
