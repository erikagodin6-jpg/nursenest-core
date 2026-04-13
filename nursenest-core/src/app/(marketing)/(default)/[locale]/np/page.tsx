import { redirect } from "next/navigation";

type Props = { params: Promise<{ locale: string }> };

export default async function NpShortcutPage({ params }: Props) {
  const { locale } = await params;
  const target = locale === "canada" ? `/${locale}/np/cnple` : `/${locale}/np/fnp`;
  redirect(target);
}
