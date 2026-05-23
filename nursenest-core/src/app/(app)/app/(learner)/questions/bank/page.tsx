import { QuestionBankGatedEntry } from "../question-bank-gated-server";

type PageProps = { searchParams: Promise<{ pathwayId?: string | string[] }> };

/** Advanced filters, presets, and in-page bank — linked from the compact practice exam launcher. */
export default async function QuestionBankBrowsePage({ searchParams }: PageProps) {
  return <QuestionBankGatedEntry searchParams={searchParams} variant="bank" />;
}
