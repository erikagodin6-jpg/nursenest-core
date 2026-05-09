import { permanentRedirect } from "next/navigation";

/** Settings hub lives under Account Center. */
export default function LearnerSettingsAliasRedirect() {
  permanentRedirect("/app/account/settings");
}
