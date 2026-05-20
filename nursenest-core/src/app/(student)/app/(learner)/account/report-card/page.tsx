import { permanentRedirect } from "next/navigation";

/** Canonical report card lives at `/app/account/report`. */
export default function AccountReportCardLegacyRedirect() {
  permanentRedirect("/app/account/report");
}
