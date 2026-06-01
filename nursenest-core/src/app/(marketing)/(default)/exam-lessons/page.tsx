import { permanentRedirect } from "next/navigation";

export const dynamic = "force-static";
export const revalidate = false;

/** Canonical public lessons hub is `/lessons`. */
export default function ExamLessonsRedirectPage() {
  permanentRedirect("/lessons");
}
