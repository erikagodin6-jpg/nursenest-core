"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { redeemBetaCode } from "@/lib/beta/beta-access";

export async function redeemBetaAccessCodeAction(formData: FormData): Promise<void> {
  const session = await getProtectedRouteSession("(student).app.(learner).account.beta.redeem");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const rawCode = String(formData.get("code") ?? "");
  const result = await redeemBetaCode(userId, rawCode);
  revalidatePath("/app/account/beta");
  revalidatePath("/app/account/settings");

  if (result.ok) {
    const params = new URLSearchParams({
      status: result.alreadyRedeemed ? "already" : "redeemed",
      name: result.codeName,
    });
    redirect(`/app/account/beta?${params.toString()}`);
  }

  const params = new URLSearchParams({ status: result.code, message: result.message });
  redirect(`/app/account/beta?${params.toString()}`);
}
