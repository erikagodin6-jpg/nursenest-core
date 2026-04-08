import { redirect } from "next/navigation";

/** Legacy URL: appearance and study prefs live on `/app/account/study-preferences`. */
export default function AccountSettingsPage() {
  redirect("/app/account/study-preferences");
}
