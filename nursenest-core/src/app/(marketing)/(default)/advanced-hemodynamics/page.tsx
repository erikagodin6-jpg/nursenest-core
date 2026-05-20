import { redirect } from "next/navigation";

/**
 * Canonical URL for Advanced Hemodynamics is /advanced-hemodynamic-monitoring.
 * This route provides an additional entry point without duplicate content.
 */
export const dynamic = "force-static";
export const revalidate = false;

export default function AdvancedHemodynamicsCanonicalRedirect() {
  redirect("/advanced-hemodynamic-monitoring");
}
