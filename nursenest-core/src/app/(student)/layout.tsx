import type { Metadata } from "next";

import { traceLayout } from "@/build/tracing";

/** Subscriber app — not for public search indexing. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Student segment: no marketing chrome (learner shell is under `app/(learner)`; exams under `app/exams`). */
const StudentGroupLayout = traceLayout(
  import.meta,
  function StudentGroupLayout({ children }: { children: React.ReactNode }) {
    return children;
  },
  { name: "StudentGroupLayout" },
);

export default StudentGroupLayout;
