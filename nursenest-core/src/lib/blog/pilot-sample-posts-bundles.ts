import type { BlogSampleFile, PilotCountrySlug } from "@/config/country-localization-types";
import australiaSamples from "../../../data/blog-content/australia-nursing/sample-posts.json";
import indiaSamples from "../../../data/blog-content/india-nursing/sample-posts.json";
import middleEastSamples from "../../../data/blog-content/middle-east-nursing/sample-posts.json";

export const PILOT_BLOG_SAMPLE_BUNDLES: Record<PilotCountrySlug, BlogSampleFile> = {
  india: indiaSamples as BlogSampleFile,
  "middle-east": middleEastSamples as BlogSampleFile,
  australia: australiaSamples as BlogSampleFile,
};
