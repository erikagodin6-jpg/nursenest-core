import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { AlliedProfessionMarketing } from "@/lib/allied/allied-professions-registry";

export function AlliedHubProfessionGrid({ professions }: { professions: AlliedProfessionMarketing[] }) {
  if (professions.length === 0) {
    return (
      <p className="rounded-xl border border-border bg-muted/20 p-6 text-sm text-muted">
        Profession hubs will appear here as we expand allied coverage.
      </p>
    );
  }
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {professions.map((p) => (
        <li key={p.segment}>
          <div className="flex h-full flex-col rounded-2xl border border-[var(--theme-card-border)] bg-card p-5 shadow-sm transition hover:border-primary/35">
            <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">{p.h1}</h3>
            <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted">{p.description}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/allied-health/${p.segment}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Prep guide
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={`/allied-health/${p.professionKey}/lessons`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary hover:underline"
              >
                Lessons
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
