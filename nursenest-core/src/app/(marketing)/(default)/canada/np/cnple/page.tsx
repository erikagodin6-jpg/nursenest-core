/**
 * Canada NP / CNPLE hub — delegates to the generic exam pathway hub route.
 *
 * Next.js App Router resolves static segments (canada/np/cnple) before dynamic
 * segments ([locale]/[slug]/[examCode]), so the old static authority cluster page
 * was blocking the NP hub workstation. This file delegates to the dynamic hub's
 * generateMetadata + page, hardcoding the CNPLE params so the full hub renders.
 *
 * Segment config must be declared inline — Next.js cannot statically analyse re-exports.
 */
import type { Metadata } from "next";
import HubPage, {
  generateMetadata as hubGenerateMetadata,
} from "@/app/(marketing)/(default)/[locale]/[slug]/[examCode]/page";

// Must be declared here directly — Next.js segment config cannot be re-exported
export const dynamic = "force-dynamic";
export const dynamicParams = true;

const CNPLE_PARAMS = Promise.resolve({
  locale: "canada",
  slug: "np",
  examCode: "cnple",
});

export async function generateMetadata(): Promise<Metadata> {
  return hubGenerateMetadata({ params: CNPLE_PARAMS });
}

export default function CnpleHubPage() {
  return <HubPage params={CNPLE_PARAMS} />;
}
