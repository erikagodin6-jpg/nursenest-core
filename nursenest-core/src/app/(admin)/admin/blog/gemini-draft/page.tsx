import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function AdminBlogGeminiDraftRedirectPage() {
  redirect("/admin/blog#generate-blog-draft");
}
