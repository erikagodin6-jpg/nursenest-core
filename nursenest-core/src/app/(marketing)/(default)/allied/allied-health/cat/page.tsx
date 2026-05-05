import LegacyAlliedCatPage, {
  generateMetadata as generateLegacyMetadata,
} from "@/app/(marketing)/(default)/[locale]/[slug]/[examCode]/cat/page";

type Props = { searchParams?: Promise<{ alliedProfession?: string }> };

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

export default async function GlobalAlliedCatPage({ searchParams }: Props) {
  return LegacyAlliedCatPage({
    params: GLOBAL_ALLIED_PARAMS,
    searchParams,
  });
}
