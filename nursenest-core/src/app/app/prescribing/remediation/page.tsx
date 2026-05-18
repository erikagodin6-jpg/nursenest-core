import { RemediationDashboard } from "@/src/components/prescribing/remediation-dashboard";

export default function PrescribingRemediationPage() {
  return (
    <main className="min-h-screen bg-[var(--semantic-background)] px-6 py-10 text-[var(--semantic-foreground)]">
      <div className="mx-auto max-w-7xl">
        <RemediationDashboard />
      </div>
    </main>
  );
}
