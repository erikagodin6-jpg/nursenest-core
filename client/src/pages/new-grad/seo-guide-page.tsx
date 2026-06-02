import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { NewGradGuide, GuideData } from "./new-grad-guide-template";
import { BookOpen, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { fetchWithOptionalRetry } from "@/lib/fetch-utils";

type GuideLoadResult =
  | { status: "ok"; guide: GuideData }
  | { status: "not_found" }
  | { status: "unavailable" }
  | { status: "network" };

function mapRawToGuide(raw: Record<string, unknown>, slugKey: string): GuideData | null {
  const title =
    typeof raw.title === "string" && raw.title.trim()
      ? raw.title.trim()
      : typeof raw.seo_title === "string"
        ? raw.seo_title.trim()
        : "";
  if (!title) return null;

  const sectionsRaw = Array.isArray(raw.sections) ? raw.sections : [];
  const faqRaw = Array.isArray(raw.faq_items) ? raw.faq_items : Array.isArray(raw.faqItems) ? raw.faqItems : [];
  const relatedRaw = Array.isArray(raw.related_links)
    ? raw.related_links
    : Array.isArray(raw.relatedLinks)
      ? raw.relatedLinks
      : [];

  return {
    slug: typeof raw.slug === "string" ? raw.slug : slugKey,
    type:
      (raw.guide_type as GuideData["type"]) ||
      (raw.guideType as GuideData["type"]) ||
      "survival-guide",
    title,
    subtitle:
      (typeof raw.seo_description === "string" && raw.seo_description) ||
      (typeof raw.seoDescription === "string" && raw.seoDescription) ||
      "",
    profession: typeof raw.profession === "string" ? raw.profession : "",
    professionSlug: typeof raw.profession === "string" ? raw.profession : "",
    readTime:
      (typeof raw.read_time === "string" && raw.read_time) ||
      (typeof raw.readTime === "string" && raw.readTime) ||
      "12 min read",
    author:
      (typeof raw.author_name === "string" && raw.author_name) ||
      (typeof raw.authorName === "string" && raw.authorName) ||
      "NurseNest Clinical Team",
    publishDate:
      (typeof raw.publish_date === "string" && raw.publish_date) ||
      (typeof raw.publishDate === "string" && raw.publishDate) ||
      new Date().toISOString().split("T")[0],
    seoTitle:
      (typeof raw.seo_title === "string" && raw.seo_title) ||
      (typeof raw.seoTitle === "string" && raw.seoTitle) ||
      title,
    seoDescription:
      (typeof raw.seo_description === "string" && raw.seo_description) ||
      (typeof raw.seoDescription === "string" && raw.seoDescription) ||
      "",
    seoKeywords:
      (typeof raw.seo_keywords === "string" && raw.seo_keywords) ||
      (typeof raw.seoKeywords === "string" && raw.seoKeywords) ||
      "",
    sections: sectionsRaw.map((s: unknown) => {
      const sec = s && typeof s === "object" ? (s as Record<string, unknown>) : {};
      const st = typeof sec.title === "string" ? sec.title : "";
      return {
        id:
          typeof sec.id === "string" && sec.id
            ? sec.id
            : st
              ? st.toLowerCase().replace(/\s+/g, "-")
              : "",
        title: st,
        content: typeof sec.content === "string" ? sec.content : "",
        items: Array.isArray(sec.items) ? sec.items.filter((x): x is string => typeof x === "string") : [],
      };
    }),
    faqs: faqRaw
      .map((f: unknown) => {
        const faq = f && typeof f === "object" ? (f as Record<string, unknown>) : {};
        const q = typeof faq.question === "string" ? faq.question : "";
        const a = typeof faq.answer === "string" ? faq.answer : "";
        return { question: q, answer: a };
      })
      .filter((f) => f.question || f.answer),
    relatedLinks: relatedRaw
      .map((l: unknown) => {
        const link = l && typeof l === "object" ? (l as Record<string, unknown>) : {};
        const titleL = typeof link.title === "string" ? link.title : "";
        const href =
          typeof link.href === "string"
            ? link.href
            : typeof link.slug === "string"
              ? `/${link.slug}`
              : "/";
        return {
          title: titleL,
          href,
          description: typeof link.description === "string" ? link.description : "",
        };
      })
      .filter((l) => l.title || l.href !== "/"),
  };
}

async function loadGuide(slug: string): Promise<GuideLoadResult> {
  let res: Response;
  try {
    res = await fetchWithOptionalRetry(`/api/new-grad/guides/by-slug/${encodeURIComponent(slug)}`);
  } catch {
    return { status: "network" };
  }

  if (res.status === 404) return { status: "not_found" };
  if (!res.ok) return { status: "unavailable" };

  let raw: unknown;
  try {
    raw = await res.json();
  } catch {
    return { status: "unavailable" };
  }

  if (!raw || typeof raw !== "object") return { status: "not_found" };

  const guide = mapRawToGuide(raw as Record<string, unknown>, slug);
  if (!guide) return { status: "not_found" };
  return { status: "ok", guide };
}

export default function SeoGuidePage() {
  const { t } = useI18n();
  const params = useParams<{ profession: string; guideSlug: string }>();
  const slug = `new-grad/${params.profession}/${params.guideSlug}`;

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["/api/new-grad/guides/by-slug", slug],
    queryFn: () => loadGuide(slug),
    enabled: !!slug && !!params.profession && !!params.guideSlug,
  });

  if (isLoading) {
    return (
      <div data-testid="guide-loading">
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  if (data.status === "ok") {
    return <NewGradGuide guideData={data.guide} />;
  }

  if (data.status === "not_found") {
    return (
      <div data-testid="guide-not-found">
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.newGrad.seoGuidePage.guideNotFound")}</h1>
            <p className="text-gray-600 mb-4">{t("pages.newGrad.seoGuidePage.thisGuideMayNotBe")}</p>
            <Link href="/new-grad" className="text-blue-600 hover:underline" data-testid="link-back-hub">
              {t("pages.newGrad.seoGuidePage.backToNewGradHub")}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isNet = data.status === "network";
  return (
    <div data-testid="guide-fetch-error">
      <Navigation />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <BookOpen className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            {isNet ? "Connection problem" : "This guide couldn’t be loaded"}
          </h1>
          <p className="text-gray-600 mb-6 text-sm">
            {isNet
              ? "Check your network connection, then try again."
              : "The server had trouble loading this guide. You can retry in a moment."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
              onClick={() => refetch()}
              disabled={isFetching}
              data-testid="button-retry-guide"
            >
              {isFetching ? "Retrying…" : "Try again"}
            </button>
            <Link href="/new-grad" className="px-4 py-2 text-sm text-blue-600 hover:underline" data-testid="link-back-hub-error">
              {t("pages.newGrad.seoGuidePage.backToNewGradHub")}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
