import { permanentRedirect } from "next/navigation";

/** Canonical report card is `/app/account/report` (legacy bookmarks may use this path). */
export default function LearnerReportCardAliasRedirect() {
  permanentRedirect("/app/account/report");
}
