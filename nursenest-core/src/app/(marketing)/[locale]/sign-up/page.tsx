import { redirect } from "next/navigation";
import { authRouteQueryString, type AuthRouteSearchParams } from "@/lib/auth/auth-route-query";
import { resolveLoginMarketingLocaleFromUrlSegment } from "@/lib/i18n/resolve-login-marketing-locale";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";

type LocalizedSignUpAliasPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<AuthRouteSearchParams>;
};

export const dynamic = "force-dynamic";

export default async function LocalizedSignUpAliasPage({
  params,
  searchParams,
}: LocalizedSignUpAliasPageProps) {
  const { locale } = await params;
  const resolvedLocale = resolveLoginMarketingLocaleFromUrlSegment(locale);
  const query = authRouteQueryString(await searchParams);
  redirect(`${withMarketingLocale(resolvedLocale, "/signup")}${query}`);
}
