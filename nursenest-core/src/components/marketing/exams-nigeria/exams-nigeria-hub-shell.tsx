import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { marketingCanonicalPathForLocale } from "@/lib/seo/marketing-alternates";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

const EN_PATH = "/exams/nigeria";

export function ExamsNigeriaHubShell({
  locale,
  messages,
}: {
  locale: string;
  messages: MarketingMessages;
}) {
  const title =
    messages["exams.nigeria.metaTitle"] ?? messages["exams.nigeria.title"] ?? "Nursing licensure in Nigeria";
  const description =
    messages["exams.nigeria.metaDescription"] ??
    messages["exams.nigeria.lead"] ??
    "Nursing and Midwifery Council of Nigeria (NMCN) licensure orientation.";
  const path = marketingCanonicalPathForLocale(locale, EN_PATH);
  const { crumbs, schemaItems } = simpleMarketingBreadcrumbs(
    messages["exams.nigeria.breadcrumb"] ?? "Nigeria exams",
    path,
  );
  const lead = messages["exams.nigeria.lead"] ?? "";
  const body = messages["exams.nigeria.body"] ?? "";
  const cta = messages["exams.nigeria.ctaLabel"] ?? "Open RN prep hub";
  const rnHubHref = messages["exams.nigeria.ctaHref"] ?? "/nigeria/rn/nmcn-licensure";

  return (
    <>
      <WebPageJsonLd
        {...buildMarketingWebPageJsonLdProps({
          locale,
          enPath: EN_PATH,
          title,
          description,
        })}
      />
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mx-auto max-w-3xl nn-marketing-x pb-[var(--nn-rhythm-tight-y)] pt-[var(--nn-rhythm-page-y)]">
        <BreadcrumbTrail items={crumbs} />
        <article className="nn-marketing-body">
          <h1 className="nn-marketing-h1 text-balance">{messages["exams.nigeria.title"] ?? title}</h1>
          {lead ? <p className="nn-marketing-lead mt-4 text-[var(--theme-muted-text)]">{lead}</p> : null}
          {body ? (
            <div className="mt-8 space-y-4 whitespace-pre-line text-[var(--theme-body-text)]">{body}</div>
          ) : null}
          <p className="mt-10">
            <Link
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground no-underline hover:opacity-95"
              href={rnHubHref}
            >
              {cta}
            </Link>
          </p>
        </article>
      </div>
    </>
  );
}
