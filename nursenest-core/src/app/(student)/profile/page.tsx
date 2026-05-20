import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false, follow: false },
};

/** Short URL → learner account hub (`/app/profile` also redirects here). */
export default function ProfileShortLinkPage() {
  redirect("/app/account");
}
