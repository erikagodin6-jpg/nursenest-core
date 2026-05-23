import { QuestionBankGatedEntry } from "../question-bank-gated-server";

type PageProps = { searchParams: Promise<{ pathwayId?: string | string[] }> };

export default async function PracticeQuestionSessionPage({ searchParams }: PageProps) {
  return <QuestionBankGatedEntry searchParams={searchParams} variant="practice_session" />;
}
