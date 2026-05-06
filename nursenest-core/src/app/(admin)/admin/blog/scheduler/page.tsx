import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function AdminBlogSchedulerRedirectPage() {
  redirect("/admin/blog#scheduled-queued-posts");
}
