import type { ReactNode } from "react";
import Link from "next/link";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { EcgEducationalDisclaimer } from "@/components/ecg/ecg-educational-disclaimer";
import { EcgRhythmStrip } from "@/components/ecg/ecg-rhythm-strip";

export function EcgMarketingLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8" data-nn-ecg-marketing>
      <div className="mb-6">
        <BreadcrumbTrail
          items={[
            { name: "Home", href: "/" },
            { name: "ECG", href: "/ecg" },
            { name: title, href: undefined },
          ]}
        />
      </div>
      <header className="mb-8 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--semantic-brand)]">ECG learning suite</p>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--semantic-text-primary)]">{title}</h1>
        <p className="max-w-prose text-pretty text-base text-[var(--semantic-text-secondary)]">{subtitle}</p>
        <EcgEducationalDisclaimer />
      </header>
      {children}
      <div className="mt-10 flex flex-wrap gap-3 border-t border-[var(--semantic-border-soft)] pt-8 text-sm">
        <Link className="font-semibold text-primary hover:underline" href="/ecg">
          ECG home
        </Link>
        <Link className="font-semibold text-primary hover:underline" href="/pricing">
          Premium plans
        </Link>
        <Link className="font-semibold text-primary hover:underline" href="/login">
          Sign in
        </Link>
      </div>
    </div>
  );
}

export function EcgMarketingPreviewRow() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <EcgRhythmStrip rhythmId="nsr" />
      <EcgRhythmStrip rhythmId="afib" />
      <EcgRhythmStrip rhythmId="sinus_brady" />
    </div>
  );
}
