import PracticeTestsPage from "../practice-tests/page";

type PageProps = {
  searchParams: Promise<{ pathwayId?: string | string[] | undefined; topic?: string | string[] | undefined }>;
};

/**
 * `/app/practice-exams` is a stable learner URL for the live practice hub.
 * Render the shared practice-tests hub directly so the pathname stays put instead of redirecting on mount.
 */
export default function LearnerPracticeExamsPage(props: PageProps) {
  return <PracticeTestsPage searchParams={props.searchParams} />;
}
