"use client";

import Link from "next/link";
import type { NotFoundResumeStudying } from "@/lib/ui/not-found-resume";

type NotFoundClientProps = {
  isAuthenticated: boolean;
  resumeStudying: NotFoundResumeStudying | null;
};

export function NotFoundClient({ isAuthenticated, resumeStudying }: NotFoundClientProps) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">404</p>
      <h1 className="mt-3 text-3xl font-bold text-[var(--theme-heading-text)]">Page not found</h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        The page you were looking for does not exist or may have moved.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href={resumeStudying?.href ?? (isAuthenticated ? "/app" : "/")} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
          {resumeStudying?.label ?? (isAuthenticated ? "Back to study hub" : "Go home")}
        </Link>
        <Link href="/lessons" className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted/80">
          Browse lessons
        </Link>
      </div>
    </main>
  );
}
