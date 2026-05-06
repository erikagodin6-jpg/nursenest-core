import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function AdminBlogStudioRedirectPage() {
  redirect("/admin/blog#generate-blog-draft");
}
