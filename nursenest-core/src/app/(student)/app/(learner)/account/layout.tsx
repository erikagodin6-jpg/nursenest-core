import { LearnerAccountNav } from "@/components/student/learner-account-nav";

export default function LearnerAccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <LearnerAccountNav />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
