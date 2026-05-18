import { PrescriptionWritingWorkflow } from "@/src/components/prescribing/prescription-writing-workflow";

export default function PrescriptionWritingPage() {
  return (
    <main className="min-h-screen bg-[var(--semantic-background)] px-6 py-10 text-[var(--semantic-foreground)]">
      <div className="mx-auto max-w-7xl">
        <PrescriptionWritingWorkflow />
      </div>
    </main>
  );
}
