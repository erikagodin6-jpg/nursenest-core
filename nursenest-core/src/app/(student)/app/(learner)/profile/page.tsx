import { redirect } from "next/navigation";

/** Legacy `/profile` parity: land on the account hub (overview remains one tap away). */
export default function LearnerProfileRedirectPage() {
  redirect("/app/account");
}
