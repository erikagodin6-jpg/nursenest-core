import { permanentRedirect } from "next/navigation";

/** Canonical public lessons hub is `/lessons`. */
export default function ExamLessonsRedirectPage() {
  permanentRedirect("/lessons");
}
