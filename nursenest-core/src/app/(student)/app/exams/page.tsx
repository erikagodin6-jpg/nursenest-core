import { redirect } from "next/navigation";

export default function ExamsPage() {
  redirect("/app/practice-tests?startMode=practice_exam");
}
