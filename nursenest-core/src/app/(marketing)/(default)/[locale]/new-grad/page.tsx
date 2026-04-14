import { redirect } from "next/navigation";

type Props = { params: Promise<{ locale: string }> };

export default async function NewGradShortcutPage({ params }: Props) {
  const { locale } = await params;
  if (locale === "us") {
    redirect(`/${locale}/rn/new-grad-transition/lessons`);
  }
  redirect(`/${locale}/rn/nclex-rn`);
}
