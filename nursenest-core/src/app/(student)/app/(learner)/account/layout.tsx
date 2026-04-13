import { LearnerAccountNav } from "@/components/student/learner-account-nav";
import { LearnerAccountShellHeader } from "@/components/student/learner-account-shell-header";

export const dynamic = "force-dynamic";

export default function LearnerAccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <LearnerAccountShellHeader />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <LearnerAccountNav />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
