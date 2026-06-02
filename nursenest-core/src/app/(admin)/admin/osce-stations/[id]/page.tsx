import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminOsceStationEditClient } from "@/components/admin/osce/admin-osce-station-edit-client";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminOsceStationEditPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const row = await prisma.osceStation.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      scenarioIntro: true,
      isPublished: true,
    },
  });
  if (!row) notFound();

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Edit OSCE station</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          DB id <code className="rounded bg-muted px-1">{row.id}</code> — full checklist JSON editing remains API-driven;
          this form covers publish gate and primary narrative fields.
        </p>
        <p className="mt-2 text-sm">
          <Link className="text-primary underline-offset-4 hover:underline" href={`/api/osce-stations/${row.slug}`} prefetch={false}>
            Public GET by slug
          </Link>
        </p>
      </div>
      <AdminOsceStationEditClient station={row} />
    </main>
  );
}
