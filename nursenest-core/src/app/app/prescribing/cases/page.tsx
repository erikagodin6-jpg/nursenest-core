import { PrescribingCaseRunner } from "@/src/components/prescribing/prescribing-case-runner";

export default function PrescribingCasesPage() {
  return (
    <main className="min-h-screen bg-[var(--semantic-background)] px-6 py-10 text-[var(--semantic-foreground)]">
      <div className="mx-auto max-w-7xl">
        <PrescribingCaseRunner />
      </div>
    </main>
  );
}
