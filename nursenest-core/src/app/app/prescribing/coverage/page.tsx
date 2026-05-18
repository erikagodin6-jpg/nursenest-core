import { OrganismMatchDrill } from "@/src/components/prescribing/organism-match-drill";

export default function PrescribingCoveragePage() {
  return (
    <main className="min-h-screen bg-[var(--semantic-background)] px-6 py-10 text-[var(--semantic-foreground)]">
      <div className="mx-auto max-w-7xl">
        <OrganismMatchDrill />
      </div>
    </main>
  );
}
