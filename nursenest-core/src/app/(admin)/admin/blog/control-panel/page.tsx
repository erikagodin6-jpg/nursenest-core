import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminBlogControlPanelRedirectPage({
  searchParams,
}: {
  searchParams?: Promise<{ id?: string; preview?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const query = new URLSearchParams();
  if (typeof sp.id === "string" && sp.id.trim()) query.set("id", sp.id);
  if (typeof sp.preview === "string" && sp.preview.trim()) query.set("preview", sp.preview);
  redirect(`/admin/blog${query.size ? `?${query.toString()}` : ""}`);
}
