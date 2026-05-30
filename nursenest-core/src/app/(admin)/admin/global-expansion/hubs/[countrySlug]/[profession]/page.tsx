import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  hiddenInternationalHubMetadata,
  resolveHiddenInternationalHub,
} from "@/lib/exam-pathways/hidden-international-hubs";

type Props = {
  params: Promise<{ countrySlug: string; profession: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { countrySlug, profession } = await params;
  const hub = resolveHiddenInternationalHub(countrySlug, profession);
  if (!hub) return { robots: { index: false, follow: false } };
  return hiddenInternationalHubMetadata(hub);
}

export default async function HiddenInternationalHubAdminPage({ params }: Props) {
  const { countrySlug, profession } = await params;
  const hub = resolveHiddenInternationalHub(countrySlug, profession);
  if (!hub) notFound();

  const { entry } = hub;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span>Admin Only</span>
          <span>Draft</span>
          <span>Noindex</span>
          <span>Hidden From Navigation</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">{hub.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{hub.description}</p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase text-muted-foreground">Country</dt>
            <dd className="mt-1 text-sm font-medium">{entry.country}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-muted-foreground">Regulator</dt>
            <dd className="mt-1 text-sm font-medium">{entry.regulator}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-muted-foreground">Exam</dt>
            <dd className="mt-1 text-sm font-medium">{entry.exam}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-muted-foreground">Profession</dt>
            <dd className="mt-1 text-sm font-medium">{entry.profession.toUpperCase()}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-muted-foreground">Public Path Reservation</dt>
            <dd className="mt-1 text-sm font-medium">{entry.publicPath}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-muted-foreground">Pathway ID</dt>
            <dd className="mt-1 text-sm font-medium">{entry.pathwayId ?? "Not Created"}</dd>
          </div>
        </dl>
      </div>
    </main>
  );
}
