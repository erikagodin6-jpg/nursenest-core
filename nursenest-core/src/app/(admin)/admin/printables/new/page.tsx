import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { isPrintableAdminApiAllowed } from "@/lib/printables/printable-store-flags";

export const dynamic = "force-dynamic";

export default async function AdminPrintablesNewPage() {
  await requireAdmin();
  if (!isPrintableAdminApiAllowed()) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12 text-sm text-muted-foreground">
        <h1 className="text-lg font-semibold text-foreground">Printout store</h1>
        <p className="mt-2">Printable admin is currently disabled (see env flags).</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">New printable</h1>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
        <li>
          Upload the PDF via{" "}
          <Link className="underline" href="/admin/media">
            Media library
          </Link>{" "}
          (PDF kind) or <code className="rounded bg-muted px-1">POST /api/admin/media/upload</code> — note{" "}
          <code className="rounded bg-muted px-1">confirmIntent=admin-media-upload-confirm</code>.
        </li>
        <li>Optional: upload a PNG/JPG thumbnail as an image asset.</li>
        <li>
          Create the product with{" "}
          <code className="rounded bg-muted px-1">POST /api/admin/printables</code> using{" "}
          <code className="rounded bg-muted px-1">{"{ confirm: true, ... }"}</code> and the returned{" "}
          <code className="rounded bg-muted px-1">fileAssetId</code>.
        </li>
        <li>
          Replace file later with{" "}
          <code className="rounded bg-muted px-1">POST /api/admin/printables/[id]/upload</code> (
          <code className="rounded bg-muted px-1">confirmIntent=printable-admin-upload-confirm</code>, form field{" "}
          <code className="rounded bg-muted px-1">role=pdf|thumbnail</code>) — bumps <code className="rounded bg-muted px-1">version</code>{" "}
          for PDF swaps.
        </li>
      </ol>
      <p className="mt-6 text-sm">
        <Link href="/admin/printables" className="underline">
          Back to list
        </Link>
      </p>
    </main>
  );
}
