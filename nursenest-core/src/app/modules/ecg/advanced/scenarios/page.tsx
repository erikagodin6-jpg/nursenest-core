import { redirect } from "next/navigation";

export default function EcgAdvancedScenariosRedirectPage() {
  redirect("/modules/ecg-advanced/cases");
}
