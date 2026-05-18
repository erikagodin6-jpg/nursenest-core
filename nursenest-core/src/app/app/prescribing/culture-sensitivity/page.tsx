import { CultureSensitivityPanel } from "@/src/components/prescribing/culture-sensitivity-panel";

export default function CultureSensitivityPage() {
  return (
    <main className="min-h-screen bg-[var(--semantic-background)] px-6 py-10 text-[var(--semantic-foreground)]">
      <div className="mx-auto max-w-7xl">
        <CultureSensitivityPanel />
      </div>
    </main>
  );
}
