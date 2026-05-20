import { redirect } from "next/navigation";

type Props = { params: Promise<{ locale: string }> };

/**
 * BCP marketing locale shortcuts (`/fr/new-grad`, …) — `[locale]` is a **language** code (`en`, `fr`, …),
 * never `us`/`canada`. Always send to the canonical US New Grad marketing landing (`/us/new-grad`).
 */
export default async function NewGradShortcutPage({ params }: Props) {
  await params;
  redirect("/us/new-grad");
}
