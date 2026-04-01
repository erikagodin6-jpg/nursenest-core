import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false, follow: false },
};

/** Short URL → canonical learner profile under /app. */
export default function ProfileShortLinkPage() {
  redirect("/app/profile");
}
