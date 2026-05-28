import { redirect } from "next/navigation";

/** Legacy module entry — canonical Labs workstation lives under /app/labs. */
export default function LabValuesIndexPage() {
  redirect("/app/labs");
}
