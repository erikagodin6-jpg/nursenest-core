import { LearnerAccountNav } from "@/components/student/learner-account-nav";
import { LearnerAccountShellHeader } from "@/components/student/learner-account-shell-header";

export const dynamic = "force-dynamic";

export default function LearnerAccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="nn-learner-account-workspace min-w-0 space-y-6">
      <LearnerAccountShellHeader />
      <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="shrink-0 lg:sticky lg:top-20 lg:w-56 xl:w-64">
          <LearnerAccountNav />
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
