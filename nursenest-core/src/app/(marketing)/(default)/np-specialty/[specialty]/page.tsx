import { redirect } from "next/navigation";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;

const SPECIALTY_HUB_PATHS: Record<string, string> = {
  fnp: "/en/np/fnp",
  agpcnp: "/en/np/agpcnp",
  pmhnp: "/en/np/pmhnp",
  whnp: "/en/np/whnp",
  "pnp-pc": "/en/np/pnp-pc",
};

type Props = { params: Promise<{ specialty: string }> };

export default async function NpSpecialtyHubRedirect({ params }: Props) {
  const { specialty } = await params;
  const target = SPECIALTY_HUB_PATHS[specialty] ?? "/np-exam-prep";
  redirect(target);
}
