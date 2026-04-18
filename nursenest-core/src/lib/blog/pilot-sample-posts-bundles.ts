import type { BlogSampleFile, PilotCountrySlug } from "@/config/country-localization-types";

const pilotBlogSampleBundleCache: Partial<Record<PilotCountrySlug, BlogSampleFile>> = {};

/** Small client-safe batches (metadata only). Full 200-row manifests stay server-side. */
export function getPilotBlogSampleBundle(pilot: PilotCountrySlug): BlogSampleFile {
  const cached = pilotBlogSampleBundleCache[pilot];
  if (cached) return cached;

  const bundle = (() => {
    switch (pilot) {
      case "india":
        return require("../../../data/blog-content/india-nursing/sample-posts.json") as BlogSampleFile;
      case "middle-east":
        return require("../../../data/blog-content/middle-east-nursing/sample-posts.json") as BlogSampleFile;
      case "australia":
        return require("../../../data/blog-content/australia-nursing/sample-posts.json") as BlogSampleFile;
      case "china":
        return require("../../../data/blog-content/china-nursing/sample-posts.json") as BlogSampleFile;
      case "korea":
        return require("../../../data/blog-content/korea-nursing/sample-posts.json") as BlogSampleFile;
      case "japan":
        return require("../../../data/blog-content/japan-nursing/sample-posts.json") as BlogSampleFile;
      case "germany":
        return require("../../../data/blog-content/germany-nursing/sample-posts.json") as BlogSampleFile;
      case "france":
        return require("../../../data/blog-content/france-nursing/sample-posts.json") as BlogSampleFile;
      case "italy":
        return require("../../../data/blog-content/italy-nursing/sample-posts.json") as BlogSampleFile;
      case "hungary":
        return require("../../../data/blog-content/hungary-nursing/sample-posts.json") as BlogSampleFile;
      case "portugal":
        return require("../../../data/blog-content/portugal-nursing/sample-posts.json") as BlogSampleFile;
      case "mexico":
        return require("../../../data/blog-content/mexico-nursing/sample-posts.json") as BlogSampleFile;
      case "philippines":
        return require("../../../data/blog-content/philippines-nursing/sample-posts.json") as BlogSampleFile;
      default: {
        const exhaustivenessCheck: never = pilot;
        throw new Error(`Unsupported pilot bundle: ${exhaustivenessCheck}`);
      }
    }
  })();

  pilotBlogSampleBundleCache[pilot] = bundle;
  return bundle;
}
