import { redirect } from "next/navigation";

/** Canonical account analytics live under `/app/account/overview`. */
export default function LearnerProfileRedirectPage() {
  redirect("/app/account/overview");
}
