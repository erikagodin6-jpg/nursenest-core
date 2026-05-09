import { permanentRedirect } from "next/navigation";

/** Canonical learner home is `/app` (Study Hub). */
export default function LearnerDashboardAliasRedirect() {
  permanentRedirect("/app");
}
