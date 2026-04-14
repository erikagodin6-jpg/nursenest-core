import type { BlogSampleFile, PilotCountrySlug } from "@/config/country-localization-types";
import australiaSamples from "../../../data/blog-content/australia-nursing/sample-posts.json";
import chinaSamples from "../../../data/blog-content/china-nursing/sample-posts.json";
import franceSamples from "../../../data/blog-content/france-nursing/sample-posts.json";
import germanySamples from "../../../data/blog-content/germany-nursing/sample-posts.json";
import hungarySamples from "../../../data/blog-content/hungary-nursing/sample-posts.json";
import indiaSamples from "../../../data/blog-content/india-nursing/sample-posts.json";
import italySamples from "../../../data/blog-content/italy-nursing/sample-posts.json";
import japanSamples from "../../../data/blog-content/japan-nursing/sample-posts.json";
import koreaSamples from "../../../data/blog-content/korea-nursing/sample-posts.json";
import mexicoSamples from "../../../data/blog-content/mexico-nursing/sample-posts.json";
import middleEastSamples from "../../../data/blog-content/middle-east-nursing/sample-posts.json";
import philippinesSamples from "../../../data/blog-content/philippines-nursing/sample-posts.json";
import portugalSamples from "../../../data/blog-content/portugal-nursing/sample-posts.json";

/** Small client-safe batches (metadata only). Full 200-row manifests stay server-side. */
export const PILOT_BLOG_SAMPLE_BUNDLES: Record<PilotCountrySlug, BlogSampleFile> = {
  india: indiaSamples as BlogSampleFile,
  "middle-east": middleEastSamples as BlogSampleFile,
  australia: australiaSamples as BlogSampleFile,
  china: chinaSamples as BlogSampleFile,
  korea: koreaSamples as BlogSampleFile,
  japan: japanSamples as BlogSampleFile,
  germany: germanySamples as BlogSampleFile,
  france: franceSamples as BlogSampleFile,
  italy: italySamples as BlogSampleFile,
  hungary: hungarySamples as BlogSampleFile,
  portugal: portugalSamples as BlogSampleFile,
  mexico: mexicoSamples as BlogSampleFile,
  philippines: philippinesSamples as BlogSampleFile,
};
