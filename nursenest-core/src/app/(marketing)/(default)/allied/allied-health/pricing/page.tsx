import LegacyAlliedPricingPage, {
  generateMetadata as generateLegacyMetadata,
} from "@/app/(marketing)/(default)/[locale]/[slug]/[examCode]/pricing/page";

const GLOBAL_ALLIED_PARAMS = Promise.resolve({
  locale: "us",
  slug: "allied",
  examCode: "allied-health",
});

export async function generateMetadata() {
  return generateLegacyMetadata({
    params: GLOBAL_ALLIED_PARAMS,
  });
}

export default async function GlobalAlliedPricingPage() {
  return LegacyAlliedPricingPage({
    params: GLOBAL_ALLIED_PARAMS,
  });
}
