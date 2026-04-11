export type NotFoundResumeStudying = {
  href: string;
  label: string;
};

export async function loadResumeStudyingForNotFound(_userId: string): Promise<NotFoundResumeStudying | null> {
  return null;
}
