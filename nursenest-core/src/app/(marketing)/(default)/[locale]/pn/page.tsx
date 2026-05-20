import { redirect } from "next/navigation";

type Props = { params: Promise<{ locale: string }> };

export default async function PnShortcutPage({ params }: Props) {
  const { locale } = await params;
  const target = locale === "canada" ? `/${locale}/pn/rex-pn` : `/${locale}/pn/nclex-pn`;
  redirect(target);
}
