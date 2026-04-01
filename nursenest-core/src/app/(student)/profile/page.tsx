import { redirect } from "next/navigation";

/** Short URL → canonical learner profile under /app. */
export default function ProfileShortLinkPage() {
  redirect("/app/profile");
}
