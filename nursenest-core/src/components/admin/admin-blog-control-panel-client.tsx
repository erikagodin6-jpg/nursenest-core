"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BlogFunnelStage, BlogImageStatus, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import { ADMIN_BLOG_TARGET_EXAM_OPTIONS } from "@/lib/marketing/blog-admin-exam-options";
import type { BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";
import { parseBlogSourcesJson } from "@/lib/blog/blog-citation-safety";
import { formatApa7Source } from "@/lib/blog/apa7";
import {
  effectiveLessonHref,
  isAllowedBlogInternalHref,
  lessonRowsToRelatedPaths,
  normalizeLessonRowsFromStorage,
} from "@/lib/blog/blog-internal-lesson-links";
import type { BlogImageSlotAttachment } from "@/lib/blog/blog-image-workflow";
import {
  buildEducationalFigureHtml,
  mergeAttachmentsBySlotKey,
  normalizeImagePlacementsFromPlan,
  parseInternalLinkPlanJson,
} from "@/lib/blog/blog-image-workflow";
import { parseBlogAdminPublishLog } from "@/lib/blog/blog-admin-publish-log";

/** Mirrors API `prePublish` payload (avoid importing server validation module in client). */
type PrePublishIssueClient = {
  id: string;
  severity: "block" | "warn";
  message: string;
  fix: string;
};
type PrePublishResultClient = {
  issues: PrePublishIssueClient[];
  blocking: PrePublishIssueClient[];
  warnings: PrePublishIssueClient[];
  okToPublish: boolean;
  hasWarnings: boolean;
};
import { buildPersistedSeoBundle, buildSchemaSummaryPayload } from "@/lib/blog/blog-seo-automation";
import { AdminBlogDraftEditorShell, DraftSectionCard } from "@/components/admin/blog/admin-blog-draft-editor-shell";
import { AdminBlogHtmlPreview } from "@/components/admin/blog/admin-blog-html-preview";

type GenState = "idle" | "generating" | "success" | "failed";

type AdminPostPayload = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  exam: string | null;
  postStatus: string;
  workflowStatus?: string | null;
  adminPublishLog?: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
  targetKeyword: string | null;
  keywordCluster: string | null;
  countryTarget: string | null;
  intent: BlogPostIntent | null;
  funnelStage: BlogFunnelStage | null;
  postTemplate: BlogPostTemplate | null;
  outlineJson: unknown;
  faqBlock: unknown;
  internalLinkPlan: unknown;
  titleAlternates: string[];
  keyTakeaways: string[];
  relatedLessonPaths: string[];
  schemaSummary: string | null;
  metaTitleVariant: string | null;
  metaDescriptionVariant: string | null;
  featuredSnippet: string | null;
  apaReferences: string[];
  tags: string[];
  keyQuestions: string[];
  updatedAt: string;
  /** ISO datetime when the post is scheduled or was published */
  publishAt?: string | null;
  sourcesJson?: unknown;
  requiresReferences?: boolean;
  medicalRiskFlags?: string[];
  sourceReliabilityScore?: number | null;
  coverImage?: string | null;
  coverImageAlt?: string | null;
  coverImageCaption?: string | null;
  coverImagePrompt?: string | null;
  imageStatus?: BlogImageStatus | string;
};

const templates = Object.values(BlogPostTemplate);

function mergeAttachmentRowsForPlan(plan: BlogControlPanelPlan, stored: BlogImageSlotAttachment[]): BlogImageSlotAttachment[] {
  const norm = normalizeImagePlacementsFromPlan(plan.imagePlacements);
  const by = new Map(stored.map((s) => [s.slotKey, s]));
  return norm.map((n) => {
    const old = by.get(n.slotKey);
    if (old) return old;
    return {
      slotKey: n.slotKey,
      url: null,
      alt: n.altIdea.slice(0, 240),
      caption: n.captionIdea ? n.captionIdea.slice(0, 300) : null,
      sourceKind: "none" as const,
    };
  });
}

function controlPanelPostStatusChipClass(status: string) {
  switch (status) {
    case "PUBLISHED":
      return "bg-emerald-500/15 text-emerald-900 dark:text-emerald-100";
    case "SCHEDULED":
      return "bg-amber-500/15 text-amber-950 dark:text-amber-100";
    case "APPROVED":
      return "bg-sky-500/15 text-sky-950 dark:text-sky-100";
    case "NEEDS_REVIEW":
      return "bg-orange-500/15 text-orange-950 dark:text-orange-100";
    case "FAILED":
      return "bg-red-500/15 text-red-950 dark:text-red-100";
    default:
      return "bg-muted text-foreground";
  }
}

function normalizeAdminBlogSlug(raw: string): string | null {
  const s = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
  if (s.length < 3 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)) return null;
  return s;
}

function planFromPost(post: AdminPostPayload): BlogControlPanelPlan {
  const faqBlock = post.faqBlock as { items?: { q: string; a: string }[] } | null;
  const parsedPlan = parseInternalLinkPlanJson(post.internalLinkPlan);
  const internal = post.internalLinkPlan as {
    lessons?: BlogControlPanelPlan["suggestedInternalLessons"];
    imagePlacements?: BlogControlPanelPlan["imagePlacements"];
  } | null;
  const seo = parsedPlan.seo;
  let breadcrumbs: BlogControlPanelPlan["breadcrumbs"] = [];
  if (seo?.normalizedBreadcrumbs?.length) {
    breadcrumbs = seo.normalizedBreadcrumbs;
  } else {
    try {
      if (post.schemaSummary) {
        const j = JSON.parse(post.schemaSummary) as { breadcrumbs?: BlogControlPanelPlan["breadcrumbs"] };
        if (Array.isArray(j?.breadcrumbs)) breadcrumbs = j.breadcrumbs;
      }
    } catch {
      /* ignore */
    }
  }
  const outline = Array.isArray(post.outlineJson)
    ? (post.outlineJson as BlogControlPanelPlan["outline"])
    : [];

  const excerptFallback = post.excerpt?.trim().slice(0, 360) || "Edit excerpt before publish.";
  const focusFromTags = (post.tags ?? []).map((t) => t.trim()).filter(Boolean).slice(0, 10);

  return {
    titleOptions: [post.title, ...(post.titleAlternates ?? [])].filter((t) => t && t.trim().length > 0),
    h1: post.title,
    recommendedSlug: post.slug,
    metaTitle: post.seoTitle ?? post.metaTitleVariant ?? post.title,
    metaDescription: post.seoDescription ?? post.metaDescriptionVariant ?? "",
    outline: outline.length ? outline : [{ h2: "Introduction", bullets: ["Generated outline missing — regenerate outline."] }],
    suggestedInternalLessons: normalizeLessonRowsFromStorage(internal?.lessons ?? []) as BlogControlPanelPlan["suggestedInternalLessons"],
    faqs: faqBlock?.items ?? [],
    breadcrumbs,
    imagePlacements: internal?.imagePlacements ?? [],
    apaSourceStubs: [],
    keyTakeaways: post.keyTakeaways?.length ? post.keyTakeaways : [],
    featuredSnippetHint: post.featuredSnippet ?? undefined,
    suggestedExcerpt: seo?.suggestedExcerpt ?? excerptFallback,
    openGraphTitle: seo?.openGraphTitle ?? undefined,
    openGraphDescription: seo?.openGraphDescription ?? undefined,
    canonicalPath: seo?.canonicalPath ?? undefined,
    seoFocusKeywords: seo?.focusKeywords?.length ? seo.focusKeywords : focusFromTags,
  };
}

export function AdminBlogControlPanelClient({
  initialPostId,
  initialPreviewOpen,
}: {
  initialPostId?: string | null;
  /** Open HTML preview column when arriving from library “Preview” for non-live posts */
  initialPreviewOpen?: boolean;
}) {
  const [topic, setTopic] = useState("");
  const [exam, setExam] = useState(ADMIN_BLOG_TARGET_EXAM_OPTIONS[0].value);
  const [country, setCountry] = useState<"US" | "CA" | "unspecified">("unspecified");
  const [keywords, setKeywords] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [keywordCluster, setKeywordCluster] = useState("");
  const [template, setTemplate] = useState<BlogPostTemplate>(BlogPostTemplate.TOPIC_EXPLAINED);
  const [intent, setIntent] = useState<BlogPostIntent>(BlogPostIntent.EXAM_PREP);
  const [funnelStage, setFunnelStage] = useState<BlogFunnelStage>(BlogFunnelStage.CONSIDERATION);
  const [tone, setTone] = useState<"professional" | "supportive" | "direct">("professional");
  const [includeImage, setIncludeImage] = useState(true);
  const [includeAiImage, setIncludeAiImage] = useState(false);
  const [fixedSlug, setFixedSlug] = useState("");
  const [sourceRecordsJsonText, setSourceRecordsJsonText] = useState("[]\n");
  const [allowInsufficientCitations, setAllowInsufficientCitations] = useState(false);
  const [citationRecoveryMode, setCitationRecoveryMode] = useState(false);

  const [genState, setGenState] = useState<GenState>("idle");
  const [genError, setGenError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  const [postId, setPostId] = useState<string | null>(initialPostId ?? null);
  const [post, setPost] = useState<AdminPostPayload | null>(null);
  const [plan, setPlan] = useState<BlogControlPanelPlan | null>(null);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [apaText, setApaText] = useState("");
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [sectionBusy, setSectionBusy] = useState<string | null>(null);
  const [imageAttachments, setImageAttachments] = useState<BlogImageSlotAttachment[]>([]);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverImageAltInput, setCoverImageAltInput] = useState("");
  const [coverImageCaptionInput, setCoverImageCaptionInput] = useState("");
  const [coverImagePromptInput, setCoverImagePromptInput] = useState("");
  const [imageWorkflowMsg, setImageWorkflowMsg] = useState<string | null>(null);
  const [slugDraft, setSlugDraft] = useState("");
  const [previewOpen, setPreviewOpen] = useState(Boolean(initialPreviewOpen));
  const [publishAtLocal, setPublishAtLocal] = useState("");
  const [prePublish, setPrePublish] = useState<PrePublishResultClient | null>(null);
  const [prePublishLoading, setPrePublishLoading] = useState(false);
  const [acknowledgePrePublishWarnings, setAcknowledgePrePublishWarnings] = useState(false);
  const [workflowFailureNote, setWorkflowFailureNote] = useState("");
  const [outlineJsonText, setOutlineJsonText] = useState("");
  const [outlineJsonErr, setOutlineJsonErr] = useState<string | null>(null);
  const [outlineEditorOpen, setOutlineEditorOpen] = useState(false);

  const hydrateFromPost = useCallback((p: AdminPostPayload) => {
    setPost(p);
    setPostId(p.id);
    setCitationRecoveryMode(false);
    setTitle(p.title);
    setExcerpt(p.excerpt);
    setBody(p.body);
    setSeoTitle(p.seoTitle ?? "");
    setSeoDescription(p.seoDescription ?? "");
    setApaText((p.apaReferences ?? []).join("\n"));
    const nextPlan = planFromPost(p);
    setPlan(nextPlan);
    const { imageAttachments: storedAtt } = parseInternalLinkPlanJson(p.internalLinkPlan);
    setImageAttachments(mergeAttachmentRowsForPlan(nextPlan, storedAtt));
    setCoverImageUrl(p.coverImage ?? "");
    setCoverImageAltInput(p.coverImageAlt ?? "");
    setCoverImageCaptionInput(p.coverImageCaption ?? "");
    setCoverImagePromptInput(p.coverImagePrompt ?? "");
    if (p.exam) setExam(p.exam);
    setCountry(
      p.countryTarget === "US" ? "US" : p.countryTarget === "CA" ? "CA" : "unspecified",
    );
    if (p.postTemplate) setTemplate(p.postTemplate);
    if (p.intent) setIntent(p.intent);
    if (p.funnelStage) setFunnelStage(p.funnelStage);
    if (p.targetKeyword) setTargetKeyword(p.targetKeyword);
    if (p.keywordCluster) setKeywordCluster(p.keywordCluster);
    setKeywords((p.tags ?? []).join(", "));
    setSlugDraft(p.slug);
    setPublishAtLocal(datetimeLocalFromIso(p.publishAt));
    setOutlineJsonErr(null);
    setOutlineEditorOpen(false);
  }, []);

  function datetimeLocalFromIso(iso: string | null | undefined): string {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  const citationReview = useMemo(() => {
    if (!post?.sourcesJson) return null;
    const { envelope, legacyRecords } = parseBlogSourcesJson(post.sourcesJson);
    if (envelope) {
      return {
        kind: "envelope" as const,
        verifiedApa: envelope.verified.map((v) => formatApa7Source(v)),
        verified: envelope.verified,
        excluded: envelope.excluded,
        generatedAt: envelope.generatedAt,
      };
    }
    if (legacyRecords.length) {
      return { kind: "legacy" as const, note: `${legacyRecords.length} legacy row(s) — open APA editor below to normalize.` };
    }
    return null;
  }, [post?.sourcesJson]);

  const adminPublishLogEntries = useMemo(
    () => (post ? parseBlogAdminPublishLog(post.adminPublishLog) : []),
    [post],
  );

  useEffect(() => {
    if (!initialPostId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/blog/${initialPostId}`);
        const json = (await res.json()) as { post?: AdminPostPayload; error?: string };
        if (!res.ok || !json.post) return;
        if (!cancelled) hydrateFromPost(json.post);
        setGenState("success");
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialPostId, hydrateFromPost]);

  const refreshPrePublishValidation = useCallback(async (id: string | null) => {
    if (!id) {
      setPrePublish(null);
      return;
    }
    setPrePublishLoading(true);
    try {
      const res = await fetch(`/api/admin/blog/${id}/pre-publish-validation`, { cache: "no-store" });
      const json = (await res.json()) as { ok?: boolean; prePublish?: PrePublishResultClient; error?: string };
      if (res.ok && json.prePublish) {
        setPrePublish(json.prePublish);
        if (!json.prePublish.hasWarnings) setAcknowledgePrePublishWarnings(false);
      } else {
        setPrePublish(null);
      }
    } catch {
      setPrePublish(null);
    } finally {
      setPrePublishLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshPrePublishValidation(postId);
  }, [postId, refreshPrePublishValidation]);

  const formDisabled = genState === "generating" || Boolean(sectionBusy);

  function parseSourceRecordsForSubmit(): unknown[] | null {
    try {
      const raw = sourceRecordsJsonText.trim() || "[]";
      const j = JSON.parse(raw) as unknown;
      return Array.isArray(j) ? j : null;
    } catch {
      return null;
    }
  }

  function controlPanelPersistPayload(planArg: BlogControlPanelPlan) {
    const records = parseSourceRecordsForSubmit();
    return {
      topic,
      exam,
      country,
      keywords: keywords || undefined,
      targetKeyword: targetKeyword || undefined,
      keywordCluster: keywordCluster || undefined,
      template,
      intent,
      funnelStage,
      tone,
      includeImage,
      includeAiImage,
      fixedSlug: fixedSlug.trim() || undefined,
      sourceRecords: records ?? undefined,
      allowInsufficientCitations: allowInsufficientCitations || undefined,
      plan: planArg,
      bodyHtml: body,
    };
  }

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    const recordsCheck = parseSourceRecordsForSubmit();
    if (recordsCheck === null) {
      setGenError("Verified sources JSON must be a valid JSON array (use [] if none yet).");
      return;
    }
    setGenState("generating");
    setGenError(null);
    setWarnings([]);
    setSaveMsg(null);
    setSaveErr(null);
    setCitationRecoveryMode(false);
    try {
      const res = await fetch("/api/admin/blog/control-panel/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          exam,
          country,
          keywords: keywords || undefined,
          targetKeyword: targetKeyword || undefined,
          keywordCluster: keywordCluster || undefined,
          template,
          intent,
          funnelStage,
          tone,
          includeImage,
          includeAiImage,
          fixedSlug: fixedSlug.trim() || undefined,
          sourceRecords: recordsCheck.length ? recordsCheck : undefined,
          allowInsufficientCitations: allowInsufficientCitations || undefined,
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        message?: string;
        code?: string;
        plan?: BlogControlPanelPlan;
        bodyHtml?: string;
        post?: AdminPostPayload | null;
        postId?: string;
        warnings?: string[];
        skipped?: boolean;
        reason?: string;
        existingSlug?: string;
        hint?: string;
        riskFlags?: string[];
      };

      if (res.status === 409) {
        setGenState("failed");
        setGenError(
          json.hint
            ? `${json.error}: ${json.existingSlug ?? ""} — ${json.hint}`
            : `Topic may already exist (${json.existingSlug ?? "existing post"}).`,
        );
        return;
      }

      if (res.status === 422 && (json.error === "insufficient_citations" || json.code === "INSUFFICIENT_CITATIONS")) {
        setGenState("failed");
        setCitationRecoveryMode(true);
        if (json.plan) {
          setPlan(json.plan);
          setImageAttachments((prev) => mergeAttachmentRowsForPlan(json.plan!, prev));
          setTitle(json.plan.h1 || json.plan.titleOptions[0] || title);
          setSeoTitle(json.plan.metaTitle);
          setSeoDescription(json.plan.metaDescription);
        }
        if (typeof json.bodyHtml === "string") {
          setBody(json.bodyHtml);
          const plain = json.bodyHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 480);
          setExcerpt(plain.length >= 10 ? plain : "");
        }
        const flagStr = json.riskFlags?.length ? ` Risk flags: ${json.riskFlags.join(", ")}.` : "";
        setGenError(
          `${json.message ?? "Citation support insufficient for this topic."}${flagStr} Add verified sources (HTTPS URL or valid DOI + title + year) or use “Allow save without verified citations”, then Persist draft.`,
        );
        return;
      }

      if (!res.ok) {
        setGenState("failed");
        setGenError(json.message ?? json.error ?? "Generation failed");
        if (json.plan) {
          setPlan(json.plan);
          setImageAttachments((prev) => mergeAttachmentRowsForPlan(json.plan!, prev));
        }
        return;
      }

      if (json.skipped) {
        setGenState("failed");
        setGenError(`Skipped: ${json.reason ?? "unknown"}`);
        if (json.plan) {
          setPlan(json.plan);
          setImageAttachments((prev) => mergeAttachmentRowsForPlan(json.plan!, prev));
        }
        return;
      }

      let loaded = false;
      let loadErr: string | null = null;
      if (json.post) {
        hydrateFromPost(json.post);
        if (json.plan) {
          setPlan(json.plan);
          setImageAttachments((prev) => mergeAttachmentRowsForPlan(json.plan!, prev));
        }
        loaded = true;
      } else if (json.postId) {
        const g = await fetch(`/api/admin/blog/${json.postId}`);
        const gj = (await g.json()) as { post?: AdminPostPayload };
        if (g.ok && gj.post) {
          hydrateFromPost(gj.post);
          if (json.plan) setPlan(json.plan);
          loaded = true;
        } else {
          loadErr = "Draft created but could not load post — try Blog hub or ?id=" + json.postId;
        }
      }
      setWarnings(json.warnings ?? []);
      if (loaded) {
        setGenState("success");
      } else {
        setGenState("failed");
        setGenError(loadErr ?? "Unexpected response from server.");
      }
    } catch (err) {
      setGenState("failed");
      setGenError(err instanceof Error ? err.message : String(err));
    }
  }

  async function saveDraft() {
    setSaveMsg(null);
    setSaveErr(null);

    if (citationRecoveryMode && plan && body.length >= 450) {
      const recordsCheck = parseSourceRecordsForSubmit();
      if (recordsCheck === null) {
        setSaveErr("Verified sources JSON must be a valid JSON array.");
        return;
      }
      try {
        const res = await fetch("/api/admin/blog/control-panel/persist-draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(controlPanelPersistPayload(plan)),
        });
        const json = (await res.json()) as {
          ok?: boolean;
          error?: string;
          message?: string;
          post?: AdminPostPayload | null;
          postId?: string;
          warnings?: string[];
          plan?: BlogControlPanelPlan;
          code?: string;
          riskFlags?: string[];
          hint?: string;
        };
        if (res.status === 422 && json.code === "INSUFFICIENT_CITATIONS") {
          const flagStr = json.riskFlags?.length ? ` ${json.riskFlags.join(", ")}` : "";
          setSaveErr(`${json.message ?? "Still insufficient citations."}${flagStr}`);
          return;
        }
        if (!res.ok) {
          setSaveErr(json.message ?? json.error ?? "Persist failed");
          return;
        }
        if (json.post) {
          hydrateFromPost(json.post);
          setPlan(json.plan ?? planFromPost(json.post));
          setCitationRecoveryMode(false);
          setGenState("success");
          setGenError(null);
          setWarnings(json.warnings ?? []);
          setSaveMsg("Draft saved to database.");
          return;
        }
        if (json.postId) {
          const g = await fetch(`/api/admin/blog/${json.postId}`);
          const gj = (await g.json()) as { post?: AdminPostPayload };
          if (g.ok && gj.post) {
            hydrateFromPost(gj.post);
            setPlan(json.plan ?? planFromPost(gj.post));
            setCitationRecoveryMode(false);
            setGenState("success");
            setGenError(null);
            setWarnings(json.warnings ?? []);
            setSaveMsg("Draft saved to database.");
            return;
          }
        }
        setSaveErr("Persist succeeded but post payload was missing.");
      } catch (err) {
        setSaveErr(err instanceof Error ? err.message : String(err));
      }
      return;
    }

    if (!postId) {
      setSaveErr("No post id — use Generate first, or Persist draft when recovering from citation gate.");
      return;
    }

    const apaReferences = apaText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 40);
    const faqBlock = plan ? { items: plan.faqs } : undefined;
    const planForSeo =
      plan && post
        ? {
            ...plan,
            metaTitle: seoTitle.trim() || plan.metaTitle,
            metaDescription: seoDescription.trim() || plan.metaDescription,
            suggestedExcerpt:
              excerpt.trim().length >= 40 ? excerpt.trim().slice(0, 360) : plan.suggestedExcerpt,
          }
        : null;
    const normalizedSlug = post ? normalizeAdminBlogSlug(slugDraft) : null;
    const slugForSeo =
      normalizedSlug ?? post?.slug ?? plan?.recommendedSlug ?? "draft";
    const slugPatch =
      postId && post && normalizedSlug && normalizedSlug !== post.slug ? { slug: normalizedSlug } : {};
    const seoBundle =
      planForSeo && post ? buildPersistedSeoBundle(planForSeo, slugForSeo, post.tags ?? []) : null;
    const internalLinkPlan = plan
      ? {
          lessons: plan.suggestedInternalLessons,
          imagePlacements: plan.imagePlacements,
          imageAttachments: mergeAttachmentsBySlotKey(imageAttachments),
          ...(seoBundle ? { seo: seoBundle } : {}),
        }
      : undefined;
    try {
      const res = await fetch(`/api/admin/blog/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...slugPatch,
          title,
          excerpt,
          body,
          seoTitle: seoTitle || null,
          seoDescription: seoDescription || null,
          apaReferences,
          coverImage: coverImageUrl.trim() || null,
          coverImageAlt: coverImageAltInput.trim() || null,
          coverImageCaption: coverImageCaptionInput.trim() || null,
          coverImagePrompt: coverImagePromptInput.trim() || null,
          outlineJson: plan?.outline ?? undefined,
          faqBlock,
          internalLinkPlan,
          titleAlternates: plan?.titleOptions.slice(1) ?? undefined,
          keyTakeaways: plan?.keyTakeaways ?? undefined,
          relatedLessonPaths: plan ? lessonRowsToRelatedPaths(plan.suggestedInternalLessons, country) : undefined,
          schemaSummary: seoBundle ? buildSchemaSummaryPayload(seoBundle) : undefined,
          metaTitleVariant: seoTitle || null,
          metaDescriptionVariant: seoDescription || null,
          featuredSnippet: plan?.featuredSnippetHint ?? null,
          keyQuestions: plan?.faqs.map((f) => f.q) ?? undefined,
        }),
      });
      const json = (await res.json()) as { error?: string; post?: AdminPostPayload };
      if (!res.ok) {
        setSaveErr(
          res.status === 409
            ? (json.error ?? "Slug already taken — pick another.")
            : (json.error ?? "Save failed"),
        );
        return;
      }
      if (json.post) {
        hydrateFromPost(json.post);
        void refreshPrePublishValidation(json.post.id);
      }
      setSaveMsg("Draft saved.");
    } catch (err) {
      setSaveErr(err instanceof Error ? err.message : String(err));
    }
  }

  async function publishNow() {
    if (!postId) return;
    setSaveMsg(null);
    setSaveErr(null);
    try {
      const res = await fetch(`/api/admin/blog/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "publish_now",
          ...(acknowledgePrePublishWarnings ? { acknowledgePrePublishWarnings: true } : {}),
        }),
      });
      const json = (await res.json()) as {
        error?: string;
        post?: AdminPostPayload;
        reasons?: string[];
        prePublish?: PrePublishResultClient;
        needsAcknowledgement?: boolean;
      };
      if (!res.ok) {
        if (json.prePublish) setPrePublish(json.prePublish);
        if (res.status === 422) {
          if (json.needsAcknowledgement) {
            setSaveErr(
              json.error ??
                "There are pre-publish warnings. Review the list below, check the acknowledgment box, then try again.",
            );
            return;
          }
          if (Array.isArray(json.reasons) && json.reasons.length > 0) {
            setSaveErr(`Cannot publish: ${json.reasons.join(" · ")} — see “How to fix” under each item below.`);
            return;
          }
        }
        setSaveErr(json.error ?? "Publish failed");
        return;
      }
      if (json.post) hydrateFromPost(json.post);
      setAcknowledgePrePublishWarnings(false);
      void refreshPrePublishValidation(postId);
      setSaveMsg("Published.");
    } catch (err) {
      setSaveErr(err instanceof Error ? err.message : String(err));
    }
  }

  async function runWorkflowAction(payload: Record<string, unknown>, successMsg: string) {
    if (!postId) return;
    setSaveMsg(null);
    setSaveErr(null);
    try {
      const res = await fetch(`/api/admin/blog/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as {
        error?: string;
        post?: AdminPostPayload;
        reasons?: string[];
        prePublish?: PrePublishResultClient;
        needsAcknowledgement?: boolean;
      };
      if (!res.ok) {
        if (json.prePublish) setPrePublish(json.prePublish);
        if (res.status === 422) {
          if (json.needsAcknowledgement) {
            setSaveErr(json.error ?? "Review pre-publish warnings and acknowledge if appropriate.");
            return;
          }
          if (Array.isArray(json.reasons) && json.reasons.length > 0) {
            setSaveErr(json.reasons.join(" · "));
            return;
          }
        }
        setSaveErr(json.error ?? "Update failed");
        return;
      }
      if (json.post) hydrateFromPost(json.post);
      setSaveMsg(successMsg);
      setWorkflowFailureNote("");
    } catch (err) {
      setSaveErr(err instanceof Error ? err.message : String(err));
    }
  }

  async function runRegenerate(section: Parameters<typeof buildRegenPayload>[0]) {
    if (!plan) {
      setSaveErr("Generate or load a post first.");
      return;
    }
    const t = topic.trim() || title.trim();
    if (t.length < 3) {
      setSaveErr("Topic (or title) is required for regeneration.");
      return;
    }
    setSectionBusy(section);
    setSaveErr(null);
    try {
      const res = await fetch("/api/admin/blog/control-panel/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          buildRegenPayload(section, {
            topic: t,
            exam,
            country,
            template,
            intent,
            funnelStage,
            tone,
            keywords: keywords || undefined,
            currentPlan: plan,
            currentTitle: title,
            currentBody: body,
          }),
        ),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        message?: string;
        result?: Record<string, unknown>;
      };
      if (!res.ok) {
        setSaveErr(json.message ?? json.error ?? "Regeneration failed");
        return;
      }
      const r = json.result;
      if (!r) return;

      if (r.section === "title_options" && Array.isArray((r as { titleOptions?: string[] }).titleOptions)) {
        const next = { ...plan, titleOptions: (r as { titleOptions: string[] }).titleOptions };
        setPlan(next);
        if (!title || next.titleOptions.includes(title)) {
          /* keep */
        } else if (next.titleOptions[0]) setTitle(next.titleOptions[0]);
      }
      if (r.section === "meta") {
        const m = r as {
          metaTitle: string;
          metaDescription: string;
          recommendedSlug: string;
          suggestedExcerpt?: string;
          openGraphTitle?: string;
          openGraphDescription?: string;
          canonicalPath?: string | null;
          seoFocusKeywords?: string[];
        };
        setPlan((prev) =>
          prev
            ? {
                ...prev,
                metaTitle: m.metaTitle,
                metaDescription: m.metaDescription,
                recommendedSlug: m.recommendedSlug,
                ...(m.suggestedExcerpt !== undefined ? { suggestedExcerpt: m.suggestedExcerpt.slice(0, 360) } : {}),
                ...(m.openGraphTitle !== undefined
                  ? { openGraphTitle: m.openGraphTitle.trim() ? m.openGraphTitle.slice(0, 90) : undefined }
                  : {}),
                ...(m.openGraphDescription !== undefined
                  ? {
                      openGraphDescription: m.openGraphDescription.trim()
                        ? m.openGraphDescription.slice(0, 200)
                        : undefined,
                    }
                  : {}),
                ...(m.canonicalPath !== undefined
                  ? { canonicalPath: m.canonicalPath?.trim() ? m.canonicalPath.trim().slice(0, 220) : undefined }
                  : {}),
                ...(m.seoFocusKeywords !== undefined ? { seoFocusKeywords: m.seoFocusKeywords.slice(0, 10) } : {}),
              }
            : prev,
        );
        setSeoTitle(m.metaTitle);
        setSeoDescription(m.metaDescription);
        if (m.suggestedExcerpt?.trim()) setExcerpt(m.suggestedExcerpt.trim().slice(0, 500));
      }
      if (r.section === "outline") {
        const o = r as { outline: BlogControlPanelPlan["outline"] };
        setPlan((prev) => (prev ? { ...prev, outline: o.outline } : prev));
      }
      if (r.section === "article_html") {
        setBody((r as { bodyHtml: string }).bodyHtml);
      }
      if (r.section === "faqs") {
        const f = r as { faqs: BlogControlPanelPlan["faqs"] };
        setPlan((prev) => (prev ? { ...prev, faqs: f.faqs } : prev));
      }
      if (r.section === "internal_links") {
        const il = r as { suggestedInternalLessons: BlogControlPanelPlan["suggestedInternalLessons"] };
        setPlan((prev) => (prev ? { ...prev, suggestedInternalLessons: il.suggestedInternalLessons } : prev));
      }
      if (r.section === "apa_sources") {
        const a = r as { apaSourceStubs: { authors?: string[]; year?: string; title?: string; source?: string; url?: string }[] };
        setPlan((prev) => (prev ? { ...prev, apaSourceStubs: a.apaSourceStubs as BlogControlPanelPlan["apaSourceStubs"] } : prev));
        setSaveMsg("APA stubs updated in plan — click Save draft to persist references from last full generation, or paste manually.");
      } else if (r.section === "image_placements") {
        const im = r as { imagePlacements: BlogControlPanelPlan["imagePlacements"] };
        const mergedPlan = { ...plan, imagePlacements: im.imagePlacements };
        setPlan(mergedPlan);
        setImageAttachments((prevAtt) => mergeAttachmentRowsForPlan(mergedPlan, prevAtt));
        setSaveMsg("Image concepts regenerated — check featured + inline rows, then Save draft.");
      } else {
        setSaveMsg("Section regenerated — review and Save draft.");
      }
    } catch (err) {
      setSaveErr(err instanceof Error ? err.message : String(err));
    } finally {
      setSectionBusy(null);
    }
  }

  const normalizedVisualPlacements = useMemo(
    () => (plan ? normalizeImagePlacementsFromPlan(plan.imagePlacements) : []),
    [plan],
  );
  const heroPlacement = normalizedVisualPlacements[0];
  const inlineVisualPlacements = normalizedVisualPlacements.slice(1);

  function patchImageAttachment(slotKey: string, patch: Partial<BlogImageSlotAttachment>) {
    setImageAttachments((rows) => rows.map((row) => (row.slotKey === slotKey ? { ...row, ...patch } : row)));
  }

  function patchLessonLinkRow(i: number, patch: Partial<BlogControlPanelPlan["suggestedInternalLessons"][number]>) {
    setPlan((prev) =>
      prev
        ? {
            ...prev,
            suggestedInternalLessons: prev.suggestedInternalLessons.map((row, j) => (j === i ? { ...row, ...patch } : row)),
          }
        : prev,
    );
  }

  function patchFaqRow(i: number, patch: Partial<BlogControlPanelPlan["faqs"][number]>) {
    setPlan((prev) =>
      prev ? { ...prev, faqs: prev.faqs.map((row, j) => (j === i ? { ...row, ...patch } : row)) } : prev,
    );
  }

  function addFaqRow() {
    setPlan((prev) =>
      prev
        ? {
            ...prev,
            faqs: [...prev.faqs, { q: "New question", a: "Answer with a concrete exam-prep teaching point." }],
          }
        : prev,
    );
  }

  function removeFaqRow(i: number) {
    setPlan((prev) => (prev ? { ...prev, faqs: prev.faqs.filter((_, j) => j !== i) } : prev));
  }

  function patchBreadcrumbRow(i: number, patch: Partial<BlogControlPanelPlan["breadcrumbs"][number]>) {
    setPlan((prev) =>
      prev ? { ...prev, breadcrumbs: prev.breadcrumbs.map((row, j) => (j === i ? { ...row, ...patch } : row)) } : prev,
    );
  }

  function addBreadcrumbRow() {
    setPlan((prev) =>
      prev ? { ...prev, breadcrumbs: [...prev.breadcrumbs, { label: "Section", href: "/" }] } : prev,
    );
  }

  function removeBreadcrumbRow(i: number) {
    setPlan((prev) => (prev ? { ...prev, breadcrumbs: prev.breadcrumbs.filter((_, j) => j !== i) } : prev));
  }

  function applyOutlineJsonFromEditor() {
    if (!plan) return;
    setOutlineJsonErr(null);
    try {
      const parsed = JSON.parse(outlineJsonText || "[]") as unknown;
      if (!Array.isArray(parsed)) {
        setOutlineJsonErr("Outline must be a JSON array.");
        return;
      }
      const next: BlogControlPanelPlan["outline"] = [];
      for (const row of parsed) {
        if (!row || typeof row !== "object") continue;
        const r = row as Record<string, unknown>;
        const h2 = typeof r.h2 === "string" ? r.h2.trim() : "";
        if (h2.length < 2) continue;
        const h3 = Array.isArray(r.h3) ? r.h3.filter((x): x is string => typeof x === "string") : undefined;
        const bullets = Array.isArray(r.bullets) ? r.bullets.filter((x): x is string => typeof x === "string") : undefined;
        next.push({ h2: h2.slice(0, 200), h3, bullets });
      }
      if (next.length < 3) {
        setOutlineJsonErr("Need at least 3 sections with valid h2 strings.");
        return;
      }
      setPlan({ ...plan, outline: next.slice(0, 10) });
      setOutlineJsonErr(null);
      setSaveMsg("Outline updated in plan — Save draft to persist.");
    } catch {
      setOutlineJsonErr("Invalid JSON.");
    }
  }

  async function revertToDraft() {
    if (!postId) return;
    setSaveMsg(null);
    setSaveErr(null);
    try {
      const res = await fetch(`/api/admin/blog/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revert_to_draft" }),
      });
      const json = (await res.json()) as { error?: string; post?: AdminPostPayload };
      if (!res.ok) {
        setSaveErr(json.error ?? "Could not revert to draft");
        return;
      }
      if (json.post) hydrateFromPost(json.post);
      setSaveMsg("Reverted to draft.");
    } catch (err) {
      setSaveErr(err instanceof Error ? err.message : String(err));
    }
  }

  async function applySchedule() {
    if (!postId || !publishAtLocal.trim()) {
      setSaveErr("Set a publish date/time first.");
      return;
    }
    setSaveMsg(null);
    setSaveErr(null);
    const when = new Date(publishAtLocal);
    if (Number.isNaN(when.getTime())) {
      setSaveErr("Invalid date/time.");
      return;
    }
    try {
      const res = await fetch(`/api/admin/blog/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "schedule",
          publishAt: when.toISOString(),
          ...(acknowledgePrePublishWarnings ? { acknowledgePrePublishWarnings: true } : {}),
        }),
      });
      const json = (await res.json()) as {
        error?: string;
        post?: AdminPostPayload;
        reasons?: string[];
        prePublish?: PrePublishResultClient;
        needsAcknowledgement?: boolean;
      };
      if (!res.ok) {
        if (json.prePublish) setPrePublish(json.prePublish);
        if (res.status === 422) {
          if (json.needsAcknowledgement) {
            setSaveErr(
              json.error ??
                "There are pre-publish warnings. Review below, check acknowledgment, then schedule again.",
            );
            return;
          }
          if (Array.isArray(json.reasons) && json.reasons.length > 0) {
            setSaveErr(`Cannot schedule: ${json.reasons.join(" · ")}`);
            return;
          }
        }
        setSaveErr(json.error ?? "Schedule failed");
        return;
      }
      if (json.post) hydrateFromPost(json.post);
      setAcknowledgePrePublishWarnings(false);
      void refreshPrePublishValidation(postId);
      setSaveMsg("Scheduled.");
    } catch (err) {
      setSaveErr(err instanceof Error ? err.message : String(err));
    }
  }

  async function uploadImageToSpaces(file: File): Promise<string | null> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("kind", "image");
    const res = await fetch("/api/admin/storage/upload", { method: "POST", body: fd });
    const j = (await res.json()) as { publicUrl?: string; error?: string };
    if (!res.ok) {
      setImageWorkflowMsg(j.error ?? "Upload failed");
      return null;
    }
    return j.publicUrl ?? null;
  }

  async function onCoverFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImageWorkflowMsg(null);
    const url = await uploadImageToSpaces(file);
    if (url) {
      setCoverImageUrl(url);
      setCoverImageAltInput((prev) => prev || heroPlacement?.altIdea.slice(0, 240) || "");
      setImageWorkflowMsg("Cover URL set from upload.");
    }
  }

  async function onInlineFileSelected(slotKey: string, ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    ev.target.value = "";
    if (!file) return;
    setImageWorkflowMsg(null);
    const url = await uploadImageToSpaces(file);
    if (url) {
      patchImageAttachment(slotKey, { url, sourceKind: "upload" });
      setImageWorkflowMsg(`Attached image to ${slotKey}.`);
    }
  }

  async function queueFeaturedAiImage() {
    if (!postId) {
      setImageWorkflowMsg("Save the draft first so the post has an id, then queue AI.");
      return;
    }
    setImageWorkflowMsg(null);
    try {
      const res = await fetch(`/api/admin/blog/${postId}/image-generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: coverImagePromptInput.trim() || undefined }),
      });
      const j = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setImageWorkflowMsg(j.error ?? "Could not queue image job");
        return;
      }
      setImageWorkflowMsg("Featured image job queued (async). Reload post after the worker runs.");
    } catch (err) {
      setImageWorkflowMsg(err instanceof Error ? err.message : String(err));
    }
  }

  const statusBadge = useMemo(() => {
    if (genState === "idle") return { label: "Idle", className: "bg-muted text-muted-foreground" };
    if (genState === "generating") return { label: "Generating…", className: "bg-amber-500/20 text-amber-900 dark:text-amber-100" };
    if (genState === "success") return { label: "Ready", className: "bg-emerald-500/15 text-emerald-900 dark:text-emerald-100" };
    return { label: "Failed", className: "bg-rose-500/15 text-rose-900 dark:text-rose-100" };
  }, [genState]);

  const publishBlockedByValidation = Boolean(prePublish && !prePublish.okToPublish);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge.className}`}>{statusBadge.label}</span>
        {post ? (
          <span className="text-xs text-muted-foreground">
            Post <code className="rounded bg-muted px-1">{post.slug}</code> · {post.postStatus}
          </span>
        ) : citationRecoveryMode && plan ? (
          <span className="text-xs text-amber-800 dark:text-amber-200">
            Not saved · proposed slug <code className="rounded bg-muted px-1">{plan.recommendedSlug}</code>
          </span>
        ) : null}
      </div>

      <form onSubmit={onGenerate} className="space-y-4 rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">1. Brief</h2>
        <p className="text-sm text-muted-foreground">
          Two-step AI: editorial JSON plan (titles, SEO, outline, links, FAQs, images, APA stubs) then full HTML draft. Requires{" "}
          <code className="rounded bg-muted px-1">AI_ADMIN_GENERATION_ENABLED=true</code> and OpenAI credentials.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-xs font-medium text-muted-foreground">Topic *</span>
            <input
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              minLength={3}
              disabled={formDisabled}
              placeholder="e.g. Fluid volume overload cues on NCLEX"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Pathway / audience *</span>
            <select
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              disabled={formDisabled}
            >
              {ADMIN_BLOG_TARGET_EXAM_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Country</span>
            <select
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={country}
              onChange={(e) => setCountry(e.target.value as typeof country)}
              disabled={formDisabled}
            >
              <option value="unspecified">Unspecified / both</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
            </select>
          </label>
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-xs font-medium text-muted-foreground">Keyword targets (optional)</span>
            <input
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              disabled={formDisabled}
              placeholder="Comma-separated phrases"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Primary target keyword</span>
            <input
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              disabled={formDisabled}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Keyword cluster</span>
            <input
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={keywordCluster}
              onChange={(e) => setKeywordCluster(e.target.value)}
              disabled={formDisabled}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Article type (template)</span>
            <select
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={template}
              onChange={(e) => setTemplate(e.target.value as BlogPostTemplate)}
              disabled={formDisabled}
            >
              {templates.map((t) => (
                <option key={t} value={t}>
                  {t.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Intent</span>
            <select
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={intent}
              onChange={(e) => setIntent(e.target.value as BlogPostIntent)}
              disabled={formDisabled}
            >
              {Object.values(BlogPostIntent).map((i) => (
                <option key={i} value={i}>
                  {i.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Funnel stage</span>
            <select
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={funnelStage}
              onChange={(e) => setFunnelStage(e.target.value as BlogFunnelStage)}
              disabled={formDisabled}
            >
              {Object.values(BlogFunnelStage).map((i) => (
                <option key={i} value={i}>
                  {i.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Tone</span>
            <select
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={tone}
              onChange={(e) => setTone(e.target.value as typeof tone)}
              disabled={formDisabled}
            >
              <option value="professional">Professional</option>
              <option value="supportive">Supportive</option>
              <option value="direct">Direct</option>
            </select>
          </label>
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-xs font-medium text-muted-foreground">Optional fixed slug (kebab-case)</span>
            <input
              className="w-full rounded-lg border border-border px-3 py-2 font-mono text-sm"
              value={fixedSlug}
              onChange={(e) => setFixedSlug(e.target.value)}
              disabled={formDisabled}
              placeholder="auto from AI + uniqueness if empty"
            />
          </label>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" checked={includeImage} onChange={(e) => setIncludeImage(e.target.checked)} disabled={formDisabled} />
            Featured image workflow
          </label>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" checked={includeAiImage} onChange={(e) => setIncludeAiImage(e.target.checked)} disabled={formDisabled} />
            Request AI hero image (sets prompt from first placement)
          </label>
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-xs font-medium text-muted-foreground">
              Verified sources (JSON array) — only these can appear in the published APA list
            </span>
            <textarea
              className="min-h-[140px] w-full rounded-lg border border-border px-3 py-2 font-mono text-xs"
              value={sourceRecordsJsonText}
              onChange={(e) => setSourceRecordsJsonText(e.target.value)}
              disabled={formDisabled}
              spellCheck={false}
            />
            <span className="text-[11px] text-muted-foreground">
              Each object may include authors[], year, title, source, publisher, url (https only), doi. AI “stubs” from the plan are never auto-published.
            </span>
          </label>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={allowInsufficientCitations}
              onChange={(e) => setAllowInsufficientCitations(e.target.checked)}
              disabled={formDisabled}
            />
            Allow save without verified citations on high-sensitivity topics (use only when intentionally editorial)
          </label>
        </div>
        <button
          type="submit"
          disabled={formDisabled}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {genState === "generating" ? "Running plan + article…" : "Generate publish-ready draft"}
        </button>
        {genError ? <p className="text-sm text-rose-700 dark:text-rose-300">{genError}</p> : null}
      </form>

      {warnings.length > 0 ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-950 dark:text-amber-100">
          <p className="font-semibold">Warnings</p>
          <ul className="mt-2 list-disc pl-5">
            {warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {plan ? (
        <section className="space-y-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] to-transparent p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">2. Review &amp; edit</h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void saveDraft()}
                className="rounded-lg border border-border bg-[var(--theme-card-bg)] px-4 py-2 text-sm font-semibold hover:bg-muted/60"
              >
                {citationRecoveryMode ? "Persist draft (no AI rerun)" : "Save draft"}
              </button>
              <button
                type="button"
                onClick={() => void publishNow()}
                disabled={!postId || publishBlockedByValidation}
                title={
                  publishBlockedByValidation
                    ? "Fix blocking pre-publish issues (see Publish status section) or save draft first."
                    : undefined
                }
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-40"
              >
                Publish now
              </button>
              {post ? (
                <Link
                  href={`/blog/${normalizeAdminBlogSlug(slugDraft) ?? post.slug}`}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-primary hover:bg-muted/60"
                >
                  Open public URL →
                </Link>
              ) : null}
            </div>
          </div>
          {citationRecoveryMode ? (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-950 dark:text-amber-100">
              <p className="font-semibold">Citation gate — draft not in the database yet</p>
              <p className="mt-1 text-xs opacity-90">
                The plan and HTML below are kept in this session. Fix the JSON sources (or use the override checkbox), then click Persist draft.
              </p>
            </div>
          ) : null}
          {saveMsg ? <p className="text-sm text-emerald-700 dark:text-emerald-300">{saveMsg}</p> : null}
          {saveErr ? <p className="text-sm text-rose-700 dark:text-rose-300">{saveErr}</p> : null}

          {citationReview && citationReview.kind === "envelope" ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm">
                <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Verified bibliography ({citationReview.verified.length})</h3>
                <p className="mt-1 text-xs text-muted-foreground">Built {citationReview.generatedAt}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
                  {citationReview.verifiedApa.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
                <h3 className="font-semibold text-amber-950 dark:text-amber-100">
                  Missing / held for review ({citationReview.excluded.length})
                </h3>
                <ul className="mt-2 max-h-48 list-disc space-y-2 overflow-auto pl-5 text-xs">
                  {citationReview.excluded.map((ex, i) => (
                    <li key={i}>
                      <span className="font-medium">{ex.stub.title ?? "(no title)"}</span> — {ex.provenance}: {ex.reasons.join("; ")}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : citationReview && citationReview.kind === "legacy" ? (
            <p className="text-xs text-muted-foreground">{citationReview.note}</p>
          ) : null}

          <AdminBlogDraftEditorShell
            navItems={[
              { id: "draft-publish", label: "Publish & URL" },
              { id: "draft-title", label: "Title" },
              { id: "draft-seo", label: "Meta & SEO" },
              { id: "draft-outline", label: "Outline" },
              { id: "draft-body", label: "Article body" },
              { id: "draft-media", label: "Images" },
              { id: "draft-faq", label: "FAQs" },
              { id: "draft-links", label: "Internal links" },
              { id: "draft-breadcrumbs", label: "Breadcrumbs" },
              { id: "draft-references", label: "References" },
              { id: "draft-excerpt", label: "Excerpt" },
            ]}
            previewOpen={previewOpen}
            onTogglePreview={() => setPreviewOpen((v) => !v)}
            previewPanel={
              <AdminBlogHtmlPreview
                title={title}
                excerpt={excerpt}
                coverImageUrl={coverImageUrl}
                coverAlt={coverImageAltInput}
                bodyHtml={body}
              />
            }
          >
            <DraftSectionCard
              id="draft-publish"
              title="Publish status & URL"
              description={
                postId
                  ? "Slug is written on Save draft. Use kebab-case. Scheduling stores UTC from the datetime you pick."
                  : "Persist the draft first to edit slug and schedule."
              }
            >
              <div className="space-y-4 text-sm">
                {postId ? (
                  <div className="space-y-3 rounded-lg border border-border/80 bg-muted/15 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-foreground">Pre-publish validation</p>
                      <button
                        type="button"
                        disabled={prePublishLoading}
                        onClick={() => void refreshPrePublishValidation(postId)}
                        className="rounded-md border border-border bg-background px-2 py-1 text-[11px] font-semibold hover:bg-muted/60 disabled:opacity-50"
                      >
                        {prePublishLoading ? "Checking…" : "Re-run checks"}
                      </button>
                    </div>
                    <p className="text-[10px] leading-snug text-muted-foreground">
                      Validates the <strong>saved</strong> post in the database. Click Save draft before publishing if you edited title, body, SEO, links, or images above.
                    </p>
                    {prePublishLoading && !prePublish ? (
                      <p className="text-xs text-muted-foreground">Running checks…</p>
                    ) : null}
                    {prePublish ? (
                      <>
                        {!prePublish.okToPublish ? (
                          <div className="rounded-md border border-rose-500/45 bg-rose-500/[0.08] p-3">
                            <p className="text-xs font-semibold text-rose-900 dark:text-rose-100">
                              Blocking — fix before publish or schedule
                            </p>
                            <ul className="mt-2 list-none space-y-3 text-xs text-rose-950 dark:text-rose-50">
                              {prePublish.blocking.map((row) => (
                                <li key={`b-${row.id}-${row.message.slice(0, 24)}`} className="border-b border-rose-500/20 pb-2 last:border-0 last:pb-0">
                                  <p className="font-medium">{row.message}</p>
                                  <p className="mt-1 text-[11px] opacity-90">
                                    <span className="text-muted-foreground">How to fix: </span>
                                    {row.fix}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                        {prePublish.hasWarnings ? (
                          <div
                            className={`rounded-md border p-3 ${
                              prePublish.okToPublish
                                ? "border-amber-500/45 bg-amber-500/[0.08]"
                                : "border-border/60 bg-muted/20"
                            }`}
                          >
                            <p
                              className={`text-xs font-semibold ${
                                prePublish.okToPublish
                                  ? "text-amber-950 dark:text-amber-100"
                                  : "text-muted-foreground"
                              }`}
                            >
                              Warnings {prePublish.okToPublish ? "(acknowledge to publish or schedule)" : ""}
                            </p>
                            <ul className="mt-2 list-none space-y-3 text-xs">
                              {prePublish.warnings.map((row) => (
                                <li key={`w-${row.id}-${row.message.slice(0, 24)}`} className="border-b border-border/30 pb-2 last:border-0 last:pb-0">
                                  <p className="font-medium text-foreground">{row.message}</p>
                                  <p className="mt-1 text-[11px] text-muted-foreground">{row.fix}</p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                        {prePublish.okToPublish && !prePublish.hasWarnings ? (
                          <p className="text-xs font-medium text-emerald-800 dark:text-emerald-200">
                            Required checks pass. You can publish or schedule.
                          </p>
                        ) : null}
                        {prePublish.okToPublish && prePublish.hasWarnings ? (
                          <label className="flex cursor-pointer items-start gap-2 text-xs">
                            <input
                              type="checkbox"
                              className="mt-0.5"
                              checked={acknowledgePrePublishWarnings}
                              onChange={(e) => setAcknowledgePrePublishWarnings(e.target.checked)}
                            />
                            <span>
                              I reviewed the warnings above and accept publishing or scheduling with them (required when warnings are present).
                            </span>
                          </label>
                        ) : null}
                      </>
                    ) : !prePublishLoading ? (
                      <p className="text-xs text-muted-foreground">Validation could not be loaded. Use Re-run checks or refresh the page.</p>
                    ) : null}
                  </div>
                ) : null}
                {postId && post ? (
                  <>
                    <label className="block space-y-1">
                      <span className="text-xs text-muted-foreground">URL slug</span>
                      <input
                        className="w-full rounded-md border border-border px-3 py-2 font-mono text-sm"
                        value={slugDraft}
                        onChange={(e) => setSlugDraft(e.target.value)}
                        spellCheck={false}
                      />
                    </label>
                    <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span
                        className={`rounded-full px-2 py-0.5 font-medium ${controlPanelPostStatusChipClass(post.postStatus)}`}
                      >
                        {post.postStatus.replaceAll("_", " ")}
                      </span>
                      {post.workflowStatus ? (
                        <span className="rounded-full bg-muted/80 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                          workflow: {post.workflowStatus.replaceAll("_", " ")}
                        </span>
                      ) : null}
                      {post.publishAt ? (
                        <span>Publish: {new Date(post.publishAt).toLocaleString()}</span>
                      ) : null}
                    </p>
                    <div className="flex flex-wrap gap-2 border-t border-border/60 pt-3">
                      <button
                        type="button"
                        disabled={post.postStatus === "PUBLISHED"}
                        onClick={() => void runWorkflowAction({ action: "submit_for_review" }, "Submitted for review.")}
                        className="rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-muted/60 disabled:opacity-40"
                      >
                        Submit for review
                      </button>
                      <button
                        type="button"
                        disabled={post.postStatus === "PUBLISHED"}
                        onClick={() => void runWorkflowAction({ action: "approve" }, "Approved for publish.")}
                        className="rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-muted/60 disabled:opacity-40"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={post.postStatus !== "NEEDS_REVIEW"}
                        onClick={() => void runWorkflowAction({ action: "reject_review" }, "Returned to draft.")}
                        className="rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-muted/60 disabled:opacity-40"
                      >
                        Reject to draft
                      </button>
                    </div>
                    <div className="space-y-2 rounded-lg border border-border/60 bg-muted/20 p-3">
                      <p className="text-[11px] font-medium text-muted-foreground">Mark failed (blocks publish until fixed)</p>
                      <textarea
                        className="min-h-[56px] w-full rounded-md border border-border px-2 py-1.5 text-xs"
                        placeholder="Optional note (logged)"
                        value={workflowFailureNote}
                        onChange={(e) => setWorkflowFailureNote(e.target.value)}
                        disabled={post.postStatus === "PUBLISHED"}
                      />
                      <button
                        type="button"
                        disabled={post.postStatus === "PUBLISHED"}
                        onClick={() =>
                          void runWorkflowAction(
                            {
                              action: "mark_failed",
                              ...(workflowFailureNote.trim() ? { failureReason: workflowFailureNote.trim() } : {}),
                            },
                            "Marked as failed.",
                          )
                        }
                        className="rounded-lg border border-rose-500/40 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-500/10 disabled:opacity-40 dark:text-rose-300"
                      >
                        Mark failed
                      </button>
                    </div>
                    <details className="rounded-lg border border-border/60 bg-muted/10 p-3 text-xs">
                      <summary className="cursor-pointer font-semibold text-muted-foreground">Activity log (newest last)</summary>
                      <ul className="mt-2 max-h-48 space-y-2 overflow-auto font-mono text-[10px] text-muted-foreground">
                        {adminPublishLogEntries.map((row, i) => (
                          <li key={`${row.at}-${i}`} className="border-b border-border/30 pb-2 last:border-0">
                            <span className="text-foreground/80">{row.at}</span>{" "}
                            <span
                              className={
                                row.level === "error"
                                  ? "text-rose-600"
                                  : row.level === "warn"
                                    ? "text-amber-600"
                                    : "text-emerald-700 dark:text-emerald-400"
                              }
                            >
                              [{row.event}]
                            </span>{" "}
                            {row.message}
                          </li>
                        ))}
                        {adminPublishLogEntries.length === 0 ? (
                          <li className="text-muted-foreground">No log entries yet — they appear after save, workflow steps, or publish attempts.</li>
                        ) : null}
                      </ul>
                    </details>
                    <div className="flex flex-col gap-3 border-t border-border/60 pt-3 sm:flex-row sm:items-end">
                      <label className="min-w-0 flex-1 space-y-1">
                        <span className="text-xs text-muted-foreground">Schedule publish (local)</span>
                        <input
                          type="datetime-local"
                          className="w-full rounded-md border border-border px-3 py-2 text-sm"
                          value={publishAtLocal}
                          onChange={(e) => setPublishAtLocal(e.target.value)}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => void applySchedule()}
                        disabled={publishBlockedByValidation}
                        title={
                          publishBlockedByValidation
                            ? "Fix blocking validation issues before scheduling."
                            : undefined
                        }
                        className="shrink-0 rounded-lg border border-border bg-muted/50 px-4 py-2 text-xs font-semibold hover:bg-muted/80 disabled:opacity-40"
                      >
                        Save as scheduled
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => void revertToDraft()}
                      className="rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-muted/60"
                    >
                      Revert to draft
                    </button>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    After persist, slug will match AI suggestion when possible:{" "}
                    <code className="rounded bg-muted px-1">{plan.recommendedSlug}</code>
                  </p>
                )}
              </div>
            </DraftSectionCard>

            <div className="grid gap-4 lg:grid-cols-2">
            <DraftSectionCard
              id="draft-title"
              title="Title"
              description="Pick a generated option or type your own on-page headline."
              actions={
                <button
                  type="button"
                  disabled={Boolean(sectionBusy)}
                  onClick={() => void runRegenerate("title_options")}
                  className="text-xs font-semibold text-primary underline disabled:opacity-50"
                >
                  {sectionBusy === "title_options" ? "…" : "Regenerate"}
                </button>
              }
            >
              <div className="space-y-3">
              <ul className="space-y-2 text-sm">
                {plan.titleOptions.map((topt, i) => (
                  <li key={`${i}-${topt.slice(0, 24)}`}>
                    <label className="flex cursor-pointer gap-2">
                      <input type="radio" name="titlePick" checked={title === topt} onChange={() => setTitle(topt)} />
                      <span>{topt}</span>
                    </label>
                  </li>
                ))}
              </ul>
              <label className="block space-y-1">
                <span className="text-xs text-muted-foreground">Display title (editable)</span>
                <input className="w-full rounded-md border border-border px-3 py-2 text-sm" value={title} onChange={(e) => setTitle(e.target.value)} />
              </label>
            </div>
            </DraftSectionCard>

            <DraftSectionCard
              id="draft-seo"
              title="Meta & SEO"
              description="Search title and description; optional Open Graph and canonical overrides."
              actions={
                <button
                  type="button"
                  disabled={Boolean(sectionBusy)}
                  onClick={() => void runRegenerate("meta")}
                  className="text-xs font-semibold text-primary underline disabled:opacity-50"
                >
                  {sectionBusy === "meta" ? "…" : "Regenerate"}
                </button>
              }
            >
            <div className="space-y-3">
              <label className="block space-y-1">
                <span className="text-xs text-muted-foreground">Meta title</span>
                <input className="w-full rounded-md border border-border px-3 py-2 text-sm" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
              </label>
              <label className="block space-y-1">
                <span className="text-xs text-muted-foreground">Meta description</span>
                <textarea className="min-h-[88px] w-full rounded-md border border-border px-3 py-2 text-sm" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
              </label>
              {plan ? (
                <>
                  <label className="block space-y-1">
                    <span className="text-xs text-muted-foreground">Open Graph title (optional)</span>
                    <input
                      className="w-full rounded-md border border-border px-3 py-2 text-sm"
                      value={plan.openGraphTitle ?? ""}
                      placeholder="Defaults to meta title"
                      onChange={(e) => {
                        const v = e.target.value.trim();
                        setPlan((p) => (p ? { ...p, openGraphTitle: v ? v.slice(0, 90) : undefined } : p));
                      }}
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-xs text-muted-foreground">Open Graph description (optional)</span>
                    <input
                      className="w-full rounded-md border border-border px-3 py-2 text-sm"
                      value={plan.openGraphDescription ?? ""}
                      placeholder="Shorter social preview"
                      onChange={(e) => {
                        const v = e.target.value.trim();
                        setPlan((p) => (p ? { ...p, openGraphDescription: v ? v.slice(0, 200) : undefined } : p));
                      }}
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-xs text-muted-foreground">Canonical path (optional)</span>
                    <input
                      className="w-full rounded-md border border-border px-3 py-2 font-mono text-xs"
                      value={plan.canonicalPath ?? ""}
                      placeholder={post ? `/blog/${post.slug}` : "/blog/your-slug"}
                      onChange={(e) => {
                        const v = e.target.value.trim();
                        setPlan((p) => (p ? { ...p, canonicalPath: v ? v.slice(0, 220) : undefined } : p));
                      }}
                    />
                    <span className="text-[10px] text-muted-foreground">Only <code className="rounded bg-muted px-0.5">/blog/{"{slug}"}</code> for this post is accepted on save.</span>
                  </label>
                  <label className="block space-y-1">
                    <span className="text-xs text-muted-foreground">SEO focus keywords (comma-separated)</span>
                    <input
                      className="w-full rounded-md border border-border px-3 py-2 text-sm"
                      value={(plan.seoFocusKeywords ?? []).join(", ")}
                      onChange={(e) => {
                        const parts = e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                          .slice(0, 10);
                        setPlan((p) => (p ? { ...p, seoFocusKeywords: parts.length ? parts : undefined } : p));
                      }}
                    />
                  </label>
                </>
              ) : null}
            </div>
            </DraftSectionCard>
          </div>

          <DraftSectionCard
            id="draft-outline"
            title="Outline (structure)"
            description="Guides sections in the article. Edit JSON carefully or regenerate."
            actions={
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={Boolean(sectionBusy)}
                  onClick={() => void runRegenerate("outline")}
                  className="text-xs font-semibold text-primary underline disabled:opacity-50"
                >
                  {sectionBusy === "outline" ? "…" : "Regenerate"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOutlineJsonText(JSON.stringify(plan.outline, null, 2));
                    setOutlineEditorOpen((o) => !o);
                    setOutlineJsonErr(null);
                  }}
                  className="text-xs font-semibold text-muted-foreground underline"
                >
                  {outlineEditorOpen ? "Hide JSON editor" : "Edit as JSON"}
                </button>
              </div>
            }
          >
            <pre className="max-h-48 overflow-auto rounded-md bg-muted/40 p-3 text-xs">{JSON.stringify(plan.outline, null, 2)}</pre>
            {outlineEditorOpen ? (
              <div className="mt-3 space-y-2 border-t border-border/60 pt-3">
                <textarea
                  className="min-h-[200px] w-full rounded-md border border-border px-3 py-2 font-mono text-xs"
                  value={outlineJsonText}
                  onChange={(e) => setOutlineJsonText(e.target.value)}
                  spellCheck={false}
                />
                {outlineJsonErr ? <p className="text-xs text-rose-600">{outlineJsonErr}</p> : null}
                <button
                  type="button"
                  onClick={() => applyOutlineJsonFromEditor()}
                  className="rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs font-semibold hover:bg-muted/70"
                >
                  Apply outline JSON
                </button>
              </div>
            ) : null}
          </DraftSectionCard>

          <DraftSectionCard
            id="draft-body"
            title="Article body (HTML)"
            description="Valid HTML for published article. Regenerate replaces the full body."
            actions={
              <button
                type="button"
                disabled={Boolean(sectionBusy)}
                onClick={() => void runRegenerate("article_html")}
                className="text-xs font-semibold text-primary underline disabled:opacity-50"
              >
                {sectionBusy === "article_html" ? "…" : "Regenerate body"}
              </button>
            }
          >
            <textarea
              className="min-h-[min(420px,50vh)] w-full rounded-md border border-border px-3 py-2 font-mono text-xs"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </DraftSectionCard>

          <DraftSectionCard
            id="draft-media"
            title="Visuals & media"
            description="Hero cover and inline slots; copy figure HTML into the body when ready."
            actions={
              <div className="flex flex-wrap items-center gap-2">
                {post?.imageStatus ? (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
                    {String(post.imageStatus).replace(/_/g, " ")}
                  </span>
                ) : null}
                <button
                  type="button"
                  disabled={Boolean(sectionBusy)}
                  onClick={() => void runRegenerate("image_placements")}
                  className="text-xs font-semibold text-primary underline disabled:opacity-50"
                >
                  {sectionBusy === "image_placements" ? "…" : "Regenerate image concepts"}
                </button>
              </div>
            }
          >
            <div className="rounded-xl border border-primary/15 bg-gradient-to-br from-primary/[0.03] to-transparent p-4">
            <p className="text-[11px] text-muted-foreground">
              Featured image renders above the article when the cover URL is set. Inline images are not auto-inserted into HTML — attach a URL (upload or stock), then copy the figure snippet into the body so we never ship empty{" "}
              <code className="rounded bg-muted px-1">&lt;img&gt;</code> tags.
            </p>
            {imageWorkflowMsg ? <p className="mt-2 text-xs text-amber-800 dark:text-amber-200">{imageWorkflowMsg}</p> : null}

            <div className="mt-4 space-y-3 rounded-lg border border-border/70 bg-[var(--theme-card-bg)] p-4">
              <p className="text-xs font-semibold">Featured (hero)</p>
              {heroPlacement ? (
                <p className="text-[11px] text-muted-foreground">
                  <span className="font-medium text-foreground">Suggested concept:</span> {heroPlacement.promptIdea}
                </p>
              ) : (
                <p className="text-[11px] text-muted-foreground">No hero concept in plan — regenerate image concepts or continue without a cover.</p>
              )}
              {coverImageUrl.trim().startsWith("https://") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverImageUrl.trim()}
                  alt={coverImageAltInput.slice(0, 80) || "Preview"}
                  className="max-h-44 w-full max-w-md rounded-lg border border-border object-contain"
                />
              ) : null}
              <label className="block space-y-1">
                <span className="text-xs text-muted-foreground">Cover image URL (https)</span>
                <input
                  className="w-full rounded-md border border-border px-3 py-2 font-mono text-xs"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="https://…"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-xs text-muted-foreground">Alt text</span>
                <input
                  className="w-full rounded-md border border-border px-3 py-2 text-xs"
                  value={coverImageAltInput}
                  onChange={(e) => setCoverImageAltInput(e.target.value)}
                  placeholder={heroPlacement?.altIdea ?? "Describe the image for screen readers"}
                />
              </label>
              <label className="block space-y-1">
                <span className="text-xs text-muted-foreground">Caption (optional)</span>
                <input
                  className="w-full rounded-md border border-border px-3 py-2 text-xs"
                  value={coverImageCaptionInput}
                  onChange={(e) => setCoverImageCaptionInput(e.target.value)}
                  placeholder={heroPlacement?.captionIdea ?? ""}
                />
              </label>
              <label className="block space-y-1">
                <span className="text-xs text-muted-foreground">AI generation prompt (optional)</span>
                <textarea
                  className="min-h-[72px] w-full rounded-md border border-border px-3 py-2 font-mono text-xs"
                  value={coverImagePromptInput}
                  onChange={(e) => setCoverImagePromptInput(e.target.value)}
                  placeholder={heroPlacement?.promptIdea ?? "Educational hero image for nursing exam prep…"}
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <label className="cursor-pointer rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-semibold hover:bg-muted/50">
                  Upload to Spaces
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={(e) => void onCoverFileSelected(e)} />
                </label>
                <button
                  type="button"
                  onClick={() => void queueFeaturedAiImage()}
                  className="rounded-lg border border-border bg-[var(--theme-card-bg)] px-3 py-2 text-xs font-semibold hover:bg-muted/60"
                >
                  Queue AI hero job
                </button>
              </div>
            </div>

            {inlineVisualPlacements.length > 0 ? (
              <div className="mt-4 space-y-3">
                <p className="text-xs font-semibold">Inline placement slots</p>
                <div className="space-y-3">
                  {inlineVisualPlacements.map((slot) => {
                    const att = imageAttachments.find((a) => a.slotKey === slot.slotKey);
                    const rowUrl = att?.url ?? "";
                    const rowAlt = att?.alt ?? slot.altIdea;
                    const rowCap = att?.caption ?? (slot.captionIdea ? slot.captionIdea : null);
                    return (
                      <div key={slot.slotKey} className="space-y-2 rounded-lg border border-border/70 bg-[var(--theme-card-bg)] p-3 text-xs">
                        <p className="font-semibold text-foreground">
                          {slot.section}{" "}
                          <code className="rounded bg-muted px-1 text-[10px] text-muted-foreground">{slot.slotKey}</code>
                        </p>
                        <p className="text-muted-foreground">{slot.promptIdea}</p>
                        <label className="block space-y-1">
                          <span className="text-[11px] text-muted-foreground">Image URL (https)</span>
                          <input
                            className="w-full rounded-md border border-border px-2 py-1.5 font-mono text-[11px]"
                            value={rowUrl}
                            onChange={(e) => {
                              const v = e.target.value.trim();
                              patchImageAttachment(slot.slotKey, {
                                url: v || null,
                                sourceKind: v ? "external_url" : "none",
                              });
                            }}
                            placeholder="https://…"
                          />
                        </label>
                        <label className="block space-y-1">
                          <span className="text-[11px] text-muted-foreground">Alt</span>
                          <input
                            className="w-full rounded-md border border-border px-2 py-1.5 text-[11px]"
                            value={rowAlt}
                            onChange={(e) => patchImageAttachment(slot.slotKey, { alt: e.target.value.slice(0, 240) })}
                          />
                        </label>
                        <label className="block space-y-1">
                          <span className="text-[11px] text-muted-foreground">Caption (optional)</span>
                          <input
                            className="w-full rounded-md border border-border px-2 py-1.5 text-[11px]"
                            value={rowCap ?? ""}
                            onChange={(e) =>
                              patchImageAttachment(slot.slotKey, {
                                caption: e.target.value.trim() ? e.target.value.trim().slice(0, 300) : null,
                              })
                            }
                          />
                        </label>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <label className="cursor-pointer rounded-md border border-border px-2 py-1 text-[11px] font-semibold hover:bg-muted/50">
                            Upload
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif"
                              className="sr-only"
                              onChange={(e) => void onInlineFileSelected(slot.slotKey, e)}
                            />
                          </label>
                          <button
                            type="button"
                            className="rounded-md border border-border px-2 py-1 text-[11px] font-semibold hover:bg-muted/50"
                            onClick={() => {
                              const snippet = buildEducationalFigureHtml(rowUrl, rowAlt, rowCap);
                              if (!snippet) {
                                setImageWorkflowMsg("Add a valid https URL before copying figure HTML.");
                                return;
                              }
                              void navigator.clipboard.writeText(snippet).then(() => {
                                setImageWorkflowMsg(`Figure HTML for ${slot.slotKey} copied — paste into article body.`);
                              });
                            }}
                          >
                            Copy figure HTML
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {plan.imagePlacements.length > 0 ? (
              <div className="mt-4 border-t border-border/50 pt-4">
                <p className="text-xs font-semibold">AI image concepts (from plan)</p>
                <p className="mt-1 text-[10px] text-muted-foreground">Quick reference for prompts; attach URLs and alt text in the slots above.</p>
                <ul className="mt-2 max-h-40 space-y-2 overflow-auto text-xs text-muted-foreground">
                  {plan.imagePlacements.map((im, i) => (
                    <li key={i}>
                      <span className="font-medium text-foreground">{im.section}</span>
                      {im.slotKey ? (
                        <code className="ml-1 rounded bg-muted px-1 text-[10px]">{im.slotKey}</code>
                      ) : null}
                      : {im.promptIdea}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            </div>
          </DraftSectionCard>

          <DraftSectionCard
            id="draft-faq"
            title="FAQ section"
            description="Structured Q&A stored with the post; edit text directly or regenerate."
            actions={
              <button
                type="button"
                disabled={Boolean(sectionBusy)}
                onClick={() => void runRegenerate("faqs")}
                className="text-xs font-semibold text-primary underline disabled:opacity-50"
              >
                {sectionBusy === "faqs" ? "…" : "Regenerate"}
              </button>
            }
          >
            <div className="space-y-4">
              {plan.faqs.map((f, i) => (
                <div key={i} className="rounded-lg border border-border/60 p-3">
                  <label className="block space-y-1">
                    <span className="text-[11px] text-muted-foreground">Question</span>
                    <input
                      className="w-full rounded-md border border-border px-2 py-1.5 text-sm"
                      value={f.q}
                      onChange={(e) => patchFaqRow(i, { q: e.target.value.slice(0, 300) })}
                    />
                  </label>
                  <label className="mt-2 block space-y-1">
                    <span className="text-[11px] text-muted-foreground">Answer</span>
                    <textarea
                      className="min-h-[72px] w-full rounded-md border border-border px-2 py-1.5 text-sm"
                      value={f.a}
                      onChange={(e) => patchFaqRow(i, { a: e.target.value.slice(0, 1200) })}
                    />
                  </label>
                  <button
                    type="button"
                    className="mt-2 text-[11px] font-medium text-rose-600 underline"
                    onClick={() => removeFaqRow(i)}
                  >
                    Remove FAQ
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addFaqRow()}
                className="rounded-lg border border-dashed border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted/40"
              >
                + Add FAQ
              </button>
            </div>
          </DraftSectionCard>

          <DraftSectionCard
            id="draft-links"
            title="Study product links (review)"
            description="Lessons, question banks, practice exams — verified against allowlists and lesson DB where possible. Active rows drive in-article auto-links and the public footer."
            actions={
              <button
                type="button"
                disabled={Boolean(sectionBusy)}
                onClick={() => void runRegenerate("internal_links")}
                className="text-xs font-semibold text-primary underline disabled:opacity-50"
              >
                {sectionBusy === "internal_links" ? "…" : "Regenerate suggestions"}
              </button>
            }
          >
              <p className="text-[11px] text-muted-foreground">
                Path check: <strong>ok</strong> = safe to surface; <strong>not found</strong> = lesson slug missing in DB (fix path or remove); <strong>skipped</strong> = hub/programmatic URL (no slug check). Country: <strong>{country}</strong>. Replace target overrides a bad suggestion. Save / persist re-runs verification.
              </p>
              <ul className="mt-3 max-h-[min(28rem,55vh)] space-y-3 overflow-auto text-xs">
                {plan.suggestedInternalLessons.map((l, i) => {
                  const eff = effectiveLessonHref(l);
                  const ok = Boolean(eff && isAllowedBlogInternalHref(eff));
                  const ps = l.pathStatus ?? "unchecked";
                  const pathLabel =
                    ps === "ok"
                      ? "path · ok"
                      : ps === "not_found"
                        ? "path · lesson not in DB"
                        : ps === "invalid_allowlist"
                          ? "path · blocked pattern"
                          : ps === "skipped_non_lesson"
                            ? "path · hub/programmatic"
                            : "path · unchecked";
                  return (
                    <li key={l.id ?? i} className="rounded-lg border border-border/60 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold text-foreground">{l.label}</span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                              l.reviewStatus === "removed"
                                ? "bg-muted text-muted-foreground"
                                : ok
                                  ? "bg-emerald-500/15 text-emerald-900 dark:text-emerald-100"
                                  : "bg-amber-500/15 text-amber-950 dark:text-amber-100"
                            }`}
                          >
                            {l.reviewStatus === "removed" ? "removed" : ok ? "live href" : "needs fix"}
                          </span>
                          <span className="rounded-full bg-muted/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {pathLabel}
                          </span>
                        </div>
                      </div>
                      {l.linkKind ? (
                        <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">Kind: {l.linkKind.replace(/_/g, " ")}</p>
                      ) : null}
                      <p className="mt-1 font-mono text-[11px] text-muted-foreground">Suggested: {l.suggestedPath}</p>
                      {eff && eff !== l.suggestedPath.trim() ? (
                        <p className="mt-0.5 font-mono text-[11px] text-primary">Effective: {eff}</p>
                      ) : null}
                      {eff ? (
                        <a
                          href={eff}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-block text-[11px] font-semibold text-primary underline"
                        >
                          Open in new tab
                        </a>
                      ) : null}
                      <label className="mt-2 block space-y-1">
                        <span className="text-[11px] text-muted-foreground">Replace target (optional, root-relative)</span>
                        <input
                          className="w-full rounded-md border border-border px-2 py-1.5 font-mono text-[11px]"
                          value={l.replacementPath ?? ""}
                          onChange={(e) => patchLessonLinkRow(i, { replacementPath: e.target.value.trim() || null })}
                          placeholder="/us/rn/nclex-rn/lessons/…"
                          disabled={l.reviewStatus === "removed"}
                        />
                      </label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <label className="flex items-center gap-1.5 text-[11px]">
                          <span className="text-muted-foreground">Status</span>
                          <select
                            className="rounded border border-border bg-background px-2 py-1 text-[11px]"
                            value={l.reviewStatus ?? "active"}
                            onChange={(e) =>
                              patchLessonLinkRow(i, {
                                reviewStatus: e.target.value as "active" | "removed",
                              })
                            }
                          >
                            <option value="active">Active (include)</option>
                            <option value="removed">Removed</option>
                          </select>
                        </label>
                        <button
                          type="button"
                          className="rounded border border-border px-2 py-1 text-[11px] font-medium hover:bg-muted/60"
                          onClick={() => patchLessonLinkRow(i, { reviewStatus: "active", replacementPath: null })}
                        >
                          Accept suggested path
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
          </DraftSectionCard>

          <DraftSectionCard
            id="draft-breadcrumbs"
            title="Breadcrumb data"
            description="Label and root-relative href per crumb. Last item should match this post’s /blog/slug path."
          >
            <div className="space-y-3">
              {plan.breadcrumbs.map((row, i) => (
                <div key={i} className="flex flex-col gap-2 rounded-lg border border-border/60 p-3 sm:flex-row sm:flex-wrap sm:items-end">
                  <label className="min-w-0 flex-1 space-y-1">
                    <span className="text-[11px] text-muted-foreground">Label</span>
                    <input
                      className="w-full rounded-md border border-border px-2 py-1.5 text-sm"
                      value={row.label}
                      onChange={(e) => patchBreadcrumbRow(i, { label: e.target.value.slice(0, 80) })}
                    />
                  </label>
                  <label className="min-w-0 flex-[2] space-y-1">
                    <span className="text-[11px] text-muted-foreground">Href (root-relative)</span>
                    <input
                      className="w-full rounded-md border border-border px-2 py-1.5 font-mono text-xs"
                      value={row.href}
                      onChange={(e) => patchBreadcrumbRow(i, { href: e.target.value.slice(0, 500) })}
                      placeholder="/blog/…"
                    />
                  </label>
                  <button
                    type="button"
                    className="shrink-0 rounded-md border border-border px-2 py-1.5 text-[11px] font-medium text-rose-600 hover:bg-muted/50"
                    onClick={() => removeBreadcrumbRow(i)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addBreadcrumbRow()}
                className="rounded-lg border border-dashed border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted/40"
              >
                + Add breadcrumb
              </button>
            </div>
          </DraftSectionCard>

          <DraftSectionCard
            id="draft-references"
            title="APA 7 references"
            description="One citation per line. Regenerate fills stubs from the plan; manual edits persist on Save draft."
            actions={
              <button
                type="button"
                disabled={Boolean(sectionBusy)}
                onClick={() => void runRegenerate("apa_sources")}
                className="text-xs font-semibold text-primary underline disabled:opacity-50"
              >
                {sectionBusy === "apa_sources" ? "…" : "Regenerate stubs"}
              </button>
            }
          >
            <textarea
              className="min-h-[120px] w-full rounded-md border border-border px-3 py-2 font-mono text-xs"
              value={apaText}
              onChange={(e) => setApaText(e.target.value)}
            />
            <p className="mt-2 text-[11px] text-muted-foreground">
              Published APA lines come from verified admin JSON on generate/persist. Editing here overrides stored strings on Save — prefer fixing structured sources when possible.
            </p>
          </DraftSectionCard>

          <DraftSectionCard
            id="draft-excerpt"
            title="Excerpt / teaser"
            description="Shown in listings and social fallbacks; kept in sync with suggestedExcerpt in the plan JSON."
          >
            <textarea
              className="min-h-[72px] w-full rounded-md border border-border px-3 py-2 text-sm"
              value={excerpt}
              onChange={(e) => {
                const v = e.target.value;
                setExcerpt(v);
                setPlan((p) => (p ? { ...p, suggestedExcerpt: v.slice(0, 360) } : p));
              }}
            />
          </DraftSectionCard>
          </AdminBlogDraftEditorShell>
        </section>
      ) : null}
    </div>
  );
}

function buildRegenPayload(
  section:
    | "title_options"
    | "meta"
    | "outline"
    | "article_html"
    | "faqs"
    | "internal_links"
    | "apa_sources"
    | "image_placements",
  ctx: {
    topic: string;
    exam: string;
    country: "US" | "CA" | "unspecified";
    template: BlogPostTemplate;
    intent: BlogPostIntent;
    funnelStage: BlogFunnelStage;
    tone: "professional" | "supportive" | "direct";
    keywords?: string;
    currentPlan: BlogControlPanelPlan;
    currentTitle: string;
    currentBody: string;
  },
) {
  return {
    section,
    topic: ctx.topic,
    exam: ctx.exam,
    country: ctx.country,
    template: ctx.template,
    intent: ctx.intent,
    funnelStage: ctx.funnelStage,
    tone: ctx.tone,
    keywords: ctx.keywords,
    currentPlan: ctx.currentPlan,
    currentTitle: ctx.currentTitle,
    currentBody: ctx.currentBody,
  };
}
