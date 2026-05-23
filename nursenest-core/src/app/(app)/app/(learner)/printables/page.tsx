import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isPrintableStoreEnabledForLearners } from "@/lib/printables/printable-store-flags";
import { PrintablesLearnerHub } from "./printables-learner-hub";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Printouts",
  robots: { index: false, follow: false },
};

export default function LearnerPrintablesPage() {
  if (!isPrintableStoreEnabledForLearners()) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl py-6">
      <PrintablesLearnerHub />
    </div>
  );
}
