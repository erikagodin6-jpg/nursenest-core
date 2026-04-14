import type { CountryBlogPriorityEntry, PilotCountrySlug } from "./country-localization-types";

export const COUNTRY_BLOG_PRIORITY_MAP: Record<PilotCountrySlug, CountryBlogPriorityEntry> = {
  india: {
    countrySlug: "india",
    manifestRelativePath: "data/blog-manifest/india-nursing-200.manifest.json",
    blogTagNameKey: "blog.country.india.tagName",
    sampleBatchRelativePath: "data/blog-content/india-nursing/sample-posts.json",
  },
  "middle-east": {
    countrySlug: "middle-east",
    manifestRelativePath: "data/blog-manifest/middle-east-nursing-200.manifest.json",
    blogTagNameKey: "blog.country.middleEast.tagName",
    sampleBatchRelativePath: "data/blog-content/middle-east-nursing/sample-posts.json",
  },
  australia: {
    countrySlug: "australia",
    manifestRelativePath: "data/blog-manifest/australia-nursing-200.manifest.json",
    blogTagNameKey: "blog.country.australia.tagName",
    sampleBatchRelativePath: "data/blog-content/australia-nursing/sample-posts.json",
  },
};
