import LegacyAlliedLessonsPage, {
  generateMetadata as generateLegacyMetadata,
} from "@/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page";

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

export default async function GlobalAlliedLessonsPage({ searchParams }: Props) {
  return LegacyAlliedLessonsPage({
    params: GLOBAL_ALLIED_PARAMS,
    searchParams,
    skipAlliedHealthHubCanonicalRedirect: true,
  });
}
