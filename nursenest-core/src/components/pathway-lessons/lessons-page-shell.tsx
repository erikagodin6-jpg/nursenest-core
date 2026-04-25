import type { ReactNode } from "react";
import { PathwayHero } from "@/components/study/pathway-hero";

type CtaButton = {
  label: string;
  href: string;
  variant: "primary" | "outline" | "ghost";
};

type Props = {
  title: string;
  subtitle?: string;
  toolbar?: ReactNode;
  ctas?: CtaButton[];
  backLink?: { label: string; href: string };
  children: ReactNode;
};

/**
 * Page shell for lessons hub pages.
 * Uses a div because marketing layouts already provide the document main landmark.
 */
export function LessonsPageShell({
  title,
  subtitle = "",
  toolbar,
  ctas,
  backLink,
  children,
}: Props) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-[var(--semantic-border-soft)] bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--semantic-brand)_14%,transparent),transparent_38%),linear-gradient(135deg,var(--semantic-surface),var(--semantic-panel-muted))] shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
        <div className="px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
          <PathwayHero
            title={title}
            subtitle={subtitle}
            toolbar={
              toolbar ? (
                <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_82%,transparent)] p-3 shadow-sm">
                  {toolbar}
                </div>
              ) : undefined
            }
            ctas={ctas}
            backLink={backLink}
          />
        </div>
      </section>

      <section className="mt-5 rounded-[2rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3 shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:p-4 lg:p-5">
        {children}
      </section>
    </div>
  );
}