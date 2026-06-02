import { redirect } from "next/navigation";
import { authRouteQueryString, type AuthRouteSearchParams } from "@/lib/auth/auth-route-query";

type SignUpAliasPageProps = {
  searchParams: Promise<AuthRouteSearchParams>;
};

export const dynamic = "force-dynamic";

export default async function SignUpAliasPage({ searchParams }: SignUpAliasPageProps) {
  const query = authRouteQueryString(await searchParams);
  redirect(`/signup${query}`);
}
