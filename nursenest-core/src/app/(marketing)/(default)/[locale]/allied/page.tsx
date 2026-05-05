import { permanentRedirect } from "next/navigation";
import { ALLIED_GLOBAL_HUB_PATH } from "@/lib/allied/allied-global-pathway";

type Props = { params: Promise<{ locale: string }> };

export default async function AlliedShortcutPage({ params }: Props) {
  await params;
  permanentRedirect(ALLIED_GLOBAL_HUB_PATH);
}
