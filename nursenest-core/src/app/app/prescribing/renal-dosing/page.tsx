import { RenalDosingPanel } from "@/src/components/prescribing/renal-dosing-panel";

export default function RenalDosingPage() {
  return (
    <main className="min-h-screen bg-[var(--semantic-background)] px-6 py-10 text-[var(--semantic-foreground)]">
      <div className="mx-auto max-w-7xl">
        <RenalDosingPanel />
      </div>
    </main>
  );
}
