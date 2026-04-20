import Link from "next/link";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";

type Section = { id: string; heading?: string | null };

/**
 * Marketing / preview pathway lessons: tease locked sections without exposing full body (blur headings only).
 * Receives only { id, heading } — body is stripped server-side before passing here.
 */
export function PathwayLessonLockedSectionsPreview({
  sections,
  postAuthReturnPath,
}: {
  sections: Section[];
  /** Current marketing lesson URL — keeps users in the same shell after sign-in. */
  postAuthReturnPath?: string;
}) {
  if (sections.length === 0) return null;

  const resume = postAuthReturnPath?.trim()
    ? postAuthReturnPath.startsWith("/")
      ? postAuthReturnPath
      : `/${postAuthReturnPath}`
    : "/";
  const signInHref = loginWithCallback(resume);

  return (
    <div className="relative mt-8 overflow-hidden rounded-2xl border border-dashed border-primary/35 bg-[var(--theme-muted-surface)]/40">
      <div className="pointer-events-none max-h-48 select-none overflow-hidden blur-[6px] opacity-60" aria-hidden>
        <div className="space-y-6 p-6">
          {sections.map((s) => (
            <div key={s.id}>
              <h3 className="nn-marketing-h4">{s.heading?.trim() || "Section"}</h3>
              <p className="mt-2 nn-marketing-body-sm leading-relaxed text-[var(--theme-body-text)]">
                Additional clinical detail, exam hooks, and takeaways continue in the full lesson.
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-background/70 via-background/90 to-background p-6 text-center">
        <p className="max-w-md nn-marketing-body-sm font-semibold text-[var(--theme-heading-text)]">
          Unlock full lesson + practice questions
        </p>
        <p className="mt-2 max-w-md nn-marketing-caption">
          {sections.length} more section{sections.length === 1 ? "" : "s"} with scenarios, priorities, and review drills.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Link
            href="/pricing"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-sm"
          >
            Start free trial
          </Link>
          <Link
            href={signInHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-border-soft)_80%,var(--semantic-brand))] bg-[var(--semantic-surface)] px-6 py-2 text-sm font-semibold text-[var(--theme-heading-text)]"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
