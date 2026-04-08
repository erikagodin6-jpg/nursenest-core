"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BlogFunnelStage, BlogImageStatus, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import { ADMIN_BLOG_TARGET_EXAM_OPTIONS } from "@/lib/marketing/blog-admin-exam-options";
import type { BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";
import { parseBlogSourcesJson } from "@/lib/blog/blog-citation-safety";
import { formatApa7Source } from "@/lib/blog/apa7";
import type { BlogImageSlotAttachment } from "@/lib/blog/blog-image-workflow";
import {
  buildEducationalFigureHtml,
  mergeAttachmentsBySlotKey,
  normalizeImagePlacementsFromPlan,
  parseInternalLinkPlanJson,
} from "@/lib/blog/blog-image-workflow";

type GenState = "idle" | "generating" | "success" | "failed";

type AdminPostPayload = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  exam: string | null;
  postStatus: string;
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

function planFromPost(post: AdminPostPayload): BlogControlPanelPlan {
  const faqBlock = post.faqBlock as { items?: { q: string; a: string }[] } | null;
  const internal = post.internalLinkPlan as {
    lessons?: BlogControlPanelPlan["suggestedInternalLessons"];
    imagePlacements?: BlogControlPanelPlan["imagePlacements"];
  } | null;
  let breadcrumbs: BlogControlPanelPlan["breadcrumbs"] = [];
  try {
    if (post.schemaSummary) {
      const j = JSON.parse(post.schemaSummary) as { breadcrumbs?: BlogControlPanelPlan["breadcrumbs"] };
      if (Array.isArray(j?.breadcrumbs)) breadcrumbs = j.breadcrumbs;
    }
  } catch {
    /* ignore */
  }
  const outline = Array.isArray(post.outlineJson)
    ? (post.outlineJson as BlogControlPanelPlan["outline"])
    : [];

  return {
    titleOptions: [post.title, ...(post.titleAlternates ?? [])].filter((t) => t && t.trim().length > 0),
    h1: post.title,
    recommendedSlug: post.slug,
    metaTitle: post.seoTitle ?? post.metaTitleVariant ?? post.title,
    metaDescription: post.seoDescription ?? post.metaDescriptionVariant ?? "",
    outline: outline.length ? outline : [{ h2: "Introduction", bullets: ["Generated outline missing — regenerate outline."] }],
    suggestedInternalLessons: internal?.lessons ?? [],
    faqs: faqBlock?.items ?? [],
    breadcrumbs,
    imagePlacements: internal?.imagePlacements ?? [],
    apaSourceStubs: [],
    keyTakeaways: post.keyTakeaways?.length ? post.keyTakeaways : [],
    featuredSnippetHint: post.featuredSnippet ?? undefined,
  };
}

export function AdminBlogControlPanelClient({ initialPostId }: { initialPostId?: string | null }) {
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
  }, []);

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
        setPlan(json.plan ?? planFromPost(json.post));
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
    const internalLinkPlan = plan
      ? {
          lessons: plan.suggestedInternalLessons,
          imagePlacements: plan.imagePlacements,
          imageAttachments: mergeAttachmentsBySlotKey(imageAttachments),
        }
      : undefined;
    try {
      const res = await fetch(`/api/admin/blog/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
          relatedLessonPaths: plan?.suggestedInternalLessons.map((l) => l.suggestedPath).filter((p) => /^\/[a-z0-9]/i.test(p)) ?? undefined,
          schemaSummary: plan ? JSON.stringify({ breadcrumbs: plan.breadcrumbs, type: "Article" }) : undefined,
          metaTitleVariant: seoTitle || null,
          metaDescriptionVariant: seoDescription || null,
          featuredSnippet: plan?.featuredSnippetHint ?? null,
          keyQuestions: plan?.faqs.map((f) => f.q) ?? undefined,
        }),
      });
      const json = (await res.json()) as { error?: string; post?: AdminPostPayload };
      if (!res.ok) {
        setSaveErr(json.error ?? "Save failed");
        return;
      }
      if (json.post) hydrateFromPost(json.post);
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
        body: JSON.stringify({ action: "publish_now" }),
      });
      const json = (await res.json()) as { error?: string; post?: AdminPostPayload };
      if (!res.ok) {
        setSaveErr(json.error ?? "Publish failed");
        return;
      }
      if (json.post) hydrateFromPost(json.post);
      setSaveMsg("Published.");
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
        const m = r as { metaTitle: string; metaDescription: string; recommendedSlug: string };
        setPlan((prev) => (prev ? { ...prev, metaTitle: m.metaTitle, metaDescription: m.metaDescription, recommendedSlug: m.recommendedSlug } : prev));
        setSeoTitle(m.metaTitle);
        setSeoDescription(m.metaDescription);
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
                disabled={!postId}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-40"
              >
                Publish now
              </button>
              {post ? (
                <Link href={`/blog/${post.slug}`} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-primary hover:bg-muted/60">
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

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">Title options</h3>
                <button
                  type="button"
                  disabled={Boolean(sectionBusy)}
                  onClick={() => void runRegenerate("title_options")}
                  className="text-xs font-semibold text-primary underline disabled:opacity-50"
                >
                  {sectionBusy === "title_options" ? "…" : "Regenerate"}
                </button>
              </div>
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
              {post ? (
                <p className="text-xs text-muted-foreground">
                  Slug: <code className="rounded bg-muted px-1">{post.slug}</code> (set at create; change via DB if required)
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Slug: <code className="rounded bg-muted px-1">{plan.recommendedSlug}</code> (assigned on persist)
                </p>
              )}
            </div>

            <div className="space-y-3 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">Meta &amp; SEO</h3>
                <button
                  type="button"
                  disabled={Boolean(sectionBusy)}
                  onClick={() => void runRegenerate("meta")}
                  className="text-xs font-semibold text-primary underline disabled:opacity-50"
                >
                  {sectionBusy === "meta" ? "…" : "Regenerate"}
                </button>
              </div>
              <label className="block space-y-1">
                <span className="text-xs text-muted-foreground">Meta title</span>
                <input className="w-full rounded-md border border-border px-3 py-2 text-sm" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
              </label>
              <label className="block space-y-1">
                <span className="text-xs text-muted-foreground">Meta description</span>
                <textarea className="min-h-[88px] w-full rounded-md border border-border px-3 py-2 text-sm" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">Outline (structured)</h3>
              <button
                type="button"
                disabled={Boolean(sectionBusy)}
                onClick={() => void runRegenerate("outline")}
                className="text-xs font-semibold text-primary underline disabled:opacity-50"
              >
                {sectionBusy === "outline" ? "…" : "Regenerate"}
              </button>
            </div>
            <pre className="mt-2 max-h-48 overflow-auto rounded-md bg-muted/40 p-3 text-xs">{JSON.stringify(plan.outline, null, 2)}</pre>
          </div>

          <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">Article HTML</h3>
              <button
                type="button"
                disabled={Boolean(sectionBusy)}
                onClick={() => void runRegenerate("article_html")}
                className="text-xs font-semibold text-primary underline disabled:opacity-50"
              >
                {sectionBusy === "article_html" ? "…" : "Regenerate body"}
              </button>
            </div>
            <textarea
              className="mt-2 min-h-[280px] w-full rounded-md border border-border px-3 py-2 font-mono text-xs"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/[0.03] to-transparent p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">Visuals &amp; media</h3>
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
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
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
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">FAQs (JSON)</h3>
                <button
                  type="button"
                  disabled={Boolean(sectionBusy)}
                  onClick={() => void runRegenerate("faqs")}
                  className="text-xs font-semibold text-primary underline disabled:opacity-50"
                >
                  {sectionBusy === "faqs" ? "…" : "Regenerate"}
                </button>
              </div>
              <pre className="mt-2 max-h-40 overflow-auto text-xs">{JSON.stringify(plan.faqs, null, 2)}</pre>
            </div>
            <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">Internal lesson links</h3>
                <button
                  type="button"
                  disabled={Boolean(sectionBusy)}
                  onClick={() => void runRegenerate("internal_links")}
                  className="text-xs font-semibold text-primary underline disabled:opacity-50"
                >
                  {sectionBusy === "internal_links" ? "…" : "Regenerate"}
                </button>
              </div>
              <ul className="mt-2 max-h-40 space-y-2 overflow-auto text-xs">
                {plan.suggestedInternalLessons.map((l, i) => (
                  <li key={i}>
                    <span className="font-medium">{l.label}</span> — <code className="rounded bg-muted px-1">{l.suggestedPath}</code>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4">
              <h3 className="text-sm font-semibold">Breadcrumb data</h3>
              <pre className="mt-2 max-h-36 overflow-auto text-xs">{JSON.stringify(plan.breadcrumbs, null, 2)}</pre>
            </div>
            <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4">
              <h3 className="text-sm font-semibold">Image suggestions</h3>
              <ul className="mt-2 max-h-36 space-y-2 overflow-auto text-xs">
                {plan.imagePlacements.map((im, i) => (
                  <li key={i}>
                    <span className="font-medium">{im.section}</span>: {im.promptIdea} (alt: {im.altIdea})
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">APA 7 references (one per line)</h3>
              <button
                type="button"
                disabled={Boolean(sectionBusy)}
                onClick={() => void runRegenerate("apa_sources")}
                className="text-xs font-semibold text-primary underline disabled:opacity-50"
              >
                {sectionBusy === "apa_sources" ? "…" : "Regenerate stubs"}
              </button>
            </div>
            <textarea className="mt-2 min-h-[120px] w-full rounded-md border border-border px-3 py-2 font-mono text-xs" value={apaText} onChange={(e) => setApaText(e.target.value)} />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Published APA lines come from verified admin JSON on generate/persist. Editing here overrides stored strings on Save — prefer fixing structured sources when possible.
            </p>
          </div>

          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Excerpt / teaser</span>
            <textarea className="min-h-[72px] w-full rounded-md border border-border px-3 py-2 text-sm" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void saveDraft()}
              className="rounded-lg border border-border bg-[var(--theme-card-bg)] px-4 py-2 text-sm font-semibold hover:bg-muted/60"
            >
              Save draft
            </button>
            <button
              type="button"
              onClick={() => void publishNow()}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Publish now
            </button>
          </div>
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
    | "apa_sources",
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
