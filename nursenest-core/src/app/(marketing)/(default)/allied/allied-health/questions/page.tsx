import LegacyAlliedQuestionsPage, {
  generateMetadata as generateLegacyMetadata,
} from "@/app/(marketing)/(default)/[locale]/[slug]/[examCode]/questions/page";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const GLOBAL_ALLIED_PARAMS = Promise.resolve({
  locale: "us",
  slug: "allied",
  examCode: "allied-health",
});

export async function generateMetadata({ searchParams }: Props) {
  return generateLegacyMetadata({
    params: GLOBAL_ALLIED_PARAMS,
    searchParams,
  });
}

export default async function GlobalAlliedQuestionsPage({ searchParams }: Props) {
  return LegacyAlliedQuestionsPage({
    params: GLOBAL_ALLIED_PARAMS,
    searchParams,
  });
}
