import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle: string;
  toolbar?: ReactNode;
  children: ReactNode;
};

export function LessonsPageShell({ title, subtitle, toolbar, children }: Props) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="rounded-[1.75rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--theme-muted-text)]">{subtitle}</p>
        {toolbar}
      </header>

      <div className="mt-8">{children}</div>
    </main>
  );
}
