import { permanentRedirect } from "next/navigation";
import { buildAlliedGlobalHubPath } from "@/lib/allied/allied-global-pathway";

export default function GlobalAlliedClinicalScenariosRedirectPage() {
  permanentRedirect(buildAlliedGlobalHubPath("questions"));
}
