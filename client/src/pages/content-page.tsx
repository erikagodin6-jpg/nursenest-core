import { LocaleLink } from "@/lib/LocaleLink";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AdminEditButton } from "@/components/admin-edit-button";
import { SEO } from "@/components/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BlogInlineLeadCapture } from "@/components/lead-capture";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EducationalIntegrity } from "@/components/educational-integrity";
import { CiteThisPage } from "@/components/cite-this-page";
import { MedicalReviewBadge, MedicalReviewJsonLd } from "@/components/medical-review-badge";
import { MedicalReferences } from "@/components/medical-references";
import { ContextualRelatedResources, CrossPlatformRelatedContent } from "@/components/related-resources";
import { AutoRelatedContent } from "@/components/auto-related-content";
import {
  ArrowLeft,
  Lightbulb,
  Pill,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Calendar,
  BookOpen,
  Home,
  List,
  User,
  Pencil,
  X,
  Save,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import type { ContentItem } from "@shared/schema";

interface ContentBlock {
  type: string;
  content: string;
}

function QuizQuestionBlock({ content }: { content: string }) {
  const { t } = useI18n();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const lines = content.split("\n").filter((l) => l.trim());
  const question = lines.find((l) => l.startsWith("Q:"))?.replace("Q:", "").trim() || "";
  const options: { label: string; text: string }[] = [];
  let correctAnswer = "";
  let rationale = "";

  for (const line of lines) {
    const optMatch = line.match(/^([A-D]):\s*(.+)/);
    if (optMatch) {
      options.push({ label: optMatch[1], text: optMatch[2].trim() });
    }
    if (line.startsWith("Correct:")) {
      correctAnswer = line.replace("Correct:", "").trim();
    }
    if (line.startsWith("Rationale:")) {
      rationale = line.replace("Rationale:", "").trim();
    }
  }

  const handleSelect = (label: string) => {
    if (showResult) return;
    setSelectedAnswer(label);
    setShowResult(true);
  };

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <div className="my-6 p-6 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-4" data-testid="section-quiz-question">
      <div className="flex items-center gap-2 text-blue-700 font-bold text-sm uppercase tracking-wider">
        <BookOpen className="w-4 h-4" />
        Knowledge Check
      </div>
      <p className="text-lg font-semibold text-gray-900" data-testid="text-quiz-question">{question}</p>
      <div className="grid gap-3">
        {options.map((opt) => {
          let style = "hover:bg-blue-50 hover:border-blue-300 cursor-pointer";
          if (showResult) {
            if (opt.label === correctAnswer) style = "bg-emerald-50 border-emerald-400 text-emerald-900";
            else if (opt.label === selectedAnswer) style = "bg-red-50 border-red-400 text-red-900";
            else style = "opacity-60";
          }
          return (
            <Card
              key={opt.label}
              className={`border shadow-sm transition-all ${style}`}
              onClick={() => handleSelect(opt.label)}
              data-testid={`card-quiz-option-${opt.label}`}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                    showResult && opt.label === correctAnswer
                      ? "bg-emerald-500 text-white"
                      : showResult && opt.label === selectedAnswer
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {showResult && opt.label === correctAnswer ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : showResult && opt.label === selectedAnswer ? (
                    <XCircle className="w-5 h-5" />
                  ) : (
                    opt.label
                  )}
                </div>
                <span className="pt-1">{opt.text}</span>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {showResult && (
        <div
          className={`p-4 rounded-xl border ${
            isCorrect ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"
          }`}
          data-testid="text-quiz-rationale"
        >
          <p className="font-bold mb-1">{isCorrect ? "✓ Correct!" : "✗ Incorrect"}</p>
          {rationale && <p className="text-sm">{rationale}</p>}
        </div>
      )}
    </div>
  );
}

function getBlockContent(block: any): string {
  return block.content || block.text || "";
}

function getBlockItems(block: any): string[] {
  if (block.items && Array.isArray(block.items)) return block.items;
  const content = getBlockContent(block);
  return content.split("\n").filter((item: string) => item.trim());
}

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  const content = getBlockContent(block);

  switch (block.type) {
    case "heading":
      return (
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4" data-testid="text-content-heading">
          {content}
        </h2>
      );

    case "paragraph":
      return (
        <p className="text-gray-700 leading-relaxed mb-4" data-testid="text-content-paragraph">
          {content}
        </p>
      );

    case "list":
      return (
        <ul className="my-4 space-y-2 pl-1" data-testid="list-content">
          {getBlockItems(block).map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-700">
              <List className="w-4 h-4 text-primary shrink-0 mt-1" />
              <span>{item.trim()}</span>
            </li>
          ))}
        </ul>
      );

    case "clinical-pearl":
      return (
        <Card className="my-6 border-none shadow-lg bg-amber-50/80" data-testid="card-clinical-pearl">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-700 uppercase tracking-wider mb-1">{t("pages.contentPage.clinicalPearl")}</p>
                <p className="text-gray-800 leading-relaxed">{content}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      );

    case "medication":
      return (
        <Card className="my-6 border-none shadow-lg bg-purple-50/80" data-testid="card-medication">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                <Pill className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-purple-700 uppercase tracking-wider mb-1">{t("pages.contentPage.medicationInformation")}</p>
                <p className="text-gray-800 leading-relaxed">{content}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      );

    case "warning":
      return (
        <Card className="my-6 border-none shadow-lg bg-red-50/80 border-l-4 border-l-red-400" data-testid="card-warning">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-red-700 uppercase tracking-wider mb-1">{t("pages.contentPage.warning")}</p>
                <p className="text-gray-800 leading-relaxed">{content}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      );

    case "quiz-question":
    case "question":
      return <QuizQuestionBlock content={content} />;

    case "callout":
      return (
        <Card className="my-6 border-none shadow-lg bg-blue-50/80" data-testid="card-callout">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-1">{t("pages.contentPage.keyPoint")}</p>
                <p className="text-gray-800 leading-relaxed">{content}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      );

    case "flashcard":
      return (
        <Card className="my-6 border-none shadow-lg bg-indigo-50/80" data-testid="card-flashcard">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-indigo-700 uppercase tracking-wider mb-1">{t("pages.contentPage.flashcard")}</p>
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">{content}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      );

    case "references":
      return (
        <div className="my-6 border-t border-gray-200 pt-6" data-testid="references-section">
          <ol className="space-y-3 pl-0 list-none">
            {getBlockItems(block).map((ref, i) => (
              <li key={i} className="text-sm text-gray-700 leading-relaxed pl-8 relative" style={{ textIndent: "-2rem", paddingLeft: "2rem" }}>
                {ref.split(/(\*[^*]+\*)/g).map((part, j) =>
                  part.startsWith("*") && part.endsWith("*")
                    ? <em key={j}>{part.slice(1, -1)}</em>
                    : part.includes("https://") 
                      ? <span key={j}>{part.split(/(https?:\/\/[^\s]+)/g).map((seg, k) =>
                          seg.startsWith("http") ? <a key={k} href={seg} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{seg}</a> : seg
                        )}</span>
                      : <span key={j}>{part}</span>
                )}
              </li>
            ))}
          </ol>
        </div>
      );

    default:
      return (
        <p className="text-gray-700 leading-relaxed mb-4">{content}</p>
      );
  }
}

const BLOCK_TYPES = [
  "heading", "paragraph", "list", "clinical-pearl", "medication",
  "warning", "quiz-question", "callout", "flashcard", "references",
];

const TIER_OPTIONS = ["free", "rpn", "rn", "np"];

type EditableBlock = {
  type: string;
  editText: string;
  originalShape: "content" | "text" | "items";
};

function blockToEditable(block: any): EditableBlock {
  if (block.items && Array.isArray(block.items)) {
    return { type: block.type, editText: block.items.join("\n"), originalShape: "items" };
  }
  if (block.text !== undefined) {
    return { type: block.type, editText: block.text, originalShape: "text" };
  }
  return { type: block.type, editText: block.content || "", originalShape: "content" };
}

function editableToBlock(eb: EditableBlock): any {
  if (eb.type === "list" || eb.originalShape === "items") {
    return { type: eb.type, items: eb.editText.split("\n").filter((l: string) => l.trim()), content: eb.editText };
  }
  if (eb.originalShape === "text") {
    return { type: eb.type, text: eb.editText, content: eb.editText };
  }
  return { type: eb.type, content: eb.editText };
}

function InlineEditorPanel({
  contentItem,
  onClose,
  onSaved,
}: {
  contentItem: ContentItem;
  onClose: () => void;
  onSaved: () => void;
}) {
  const rawBlocks = (contentItem.content as any[]) || [];
  const [title, setTitle] = useState(contentItem.title);
  const [summary, setSummary] = useState(contentItem.summary || "");
  const [tier, setTier] = useState(contentItem.tier || "free");
  const [status, setStatus] = useState(contentItem.status || "draft");
  const [tagsStr, setTagsStr] = useState((contentItem.tags || []).join(", "));
  const [blocks, setBlocks] = useState<EditableBlock[]>(
    rawBlocks.map(blockToEditable)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const getCredentials = () => {
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (stored) return JSON.parse(stored);
    } catch {}
    return null;
  };

  const handleSave = async () => {
    const creds = getCredentials();
    if (!creds) {
      setError("Admin credentials not found. Please log out and log in again.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const outputBlocks = blocks.map(editableToBlock);
      const res = await fetch(`/api/content/${contentItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: creds.username,
          password: creds.password,
          title,
          summary: summary || null,
          tier,
          status,
          tags: tagsStr.split(",").map((t: string) => t.trim()).filter(Boolean),
          content: outputBlocks,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }
      setSuccess(true);
      setTimeout(() => {
        onSaved();
      }, 800);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const updateBlock = (index: number, field: "type" | "editText", value: string) => {
    const updated = [...blocks];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "type" && value === "list") {
      updated[index].originalShape = "items";
    }
    setBlocks(updated);
  };

  const addBlock = (afterIndex: number) => {
    const updated = [...blocks];
    updated.splice(afterIndex + 1, 0, { type: "paragraph", editText: "", originalShape: "content" });
    setBlocks(updated);
  };

  const removeBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const updated = [...blocks];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= updated.length) return;
    [updated[index], updated[target]] = [updated[target], updated[index]];
    setBlocks(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex" data-testid="inline-editor-panel">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-lg bg-white shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">{t("pages.contentPage.editPage")}</h2>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              size="sm"
              className="gap-2"
              data-testid="button-inline-save"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} data-testid="button-inline-close">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {error && (
          <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mx-4 mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
            Saved successfully. Refreshing...
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t("pages.contentPage.title")}</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="input-inline-title"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t("pages.contentPage.summary")}</label>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={2}
              data-testid="input-inline-summary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t("pages.contentPage.tier")}</label>
              <Select value={tier} onValueChange={setTier}>
                <SelectTrigger data-testid="select-inline-tier">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIER_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>{t.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t("pages.contentPage.status")}</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger data-testid="select-inline-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">{t("pages.contentPage.draft")}</SelectItem>
                  <SelectItem value="published">{t("pages.contentPage.published")}</SelectItem>
                  <SelectItem value="archived">{t("pages.contentPage.archived")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t("pages.contentPage.tagsCommaSeparated")}</label>
            <Input
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder={t("pages.contentPage.nursingPathophysiologyClinical")}
              data-testid="input-inline-tags"
            />
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("pages.contentPage.contentBlocks")}</label>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-xs"
                onClick={() => addBlock(blocks.length - 1)}
                data-testid="button-inline-add-block"
              >
                <Plus className="w-3 h-3" /> Add Block
              </Button>
            </div>

            <div className="space-y-3">
              {blocks.map((block, index) => (
                <div key={index} className="border rounded-lg p-3 bg-gray-50/50 space-y-2" data-testid={`block-editor-${index}`}>
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
                    <Select value={block.type} onValueChange={(v) => updateBlock(index, "type", v)}>
                      <SelectTrigger className="h-8 text-xs w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOCK_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-0.5 ml-auto">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => moveBlock(index, "up")}
                        disabled={index === 0}
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => moveBlock(index, "down")}
                        disabled={index === blocks.length - 1}
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-400 hover:text-red-600"
                        onClick={() => removeBlock(index)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={block.editText}
                    onChange={(e) => updateBlock(index, "editText", e.target.value)}
                    rows={block.type === "paragraph" || block.type === "list" ? 4 : 2}
                    className="text-sm"
                    placeholder={block.type === "list" ? "One item per line" : `Enter ${block.type} content...`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-gray-400 gap-1"
                    onClick={() => addBlock(index)}
                  >
                    <Plus className="w-3 h-3" /> Insert below
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function ContentPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAdmin } = useAuth();
  const { language } = useI18n();
  const queryClient = useQueryClient();
  const [showEditor, setShowEditor] = useState(false);

  const { data: contentItem, isLoading, error } = useQuery<ContentItem>({
    queryKey: ["content-slug", slug, language],
    queryFn: async () => {
      const langParam = language && language !== "en" ? `?lang=${encodeURIComponent(language)}` : "";
      const res = await fetch(`/api/content/slug/${slug}${langParam}`);
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
    enabled: !!slug,
  });

  const { data: relatedItems } = useQuery<{ slug: string; title: string; category: string; summary: string }[]>({
    queryKey: ["content-related", slug],
    queryFn: async () => {
      const res = await fetch(`/api/content/slug/${slug}/related`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!slug && !!contentItem,
  });

  const isNotFound = !isLoading && (!contentItem || contentItem.status !== "published");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full text-center">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
            <div className="h-64 bg-gray-200 rounded-xl" />
          </div>
        </main>
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
        <SEO title={t("pages.contentPage.contentNotFoundNursenest")} description={t("pages.contentPage.theRequestedContentCouldNot")} />
        <Navigation />
        <main className="max-w-2xl mx-auto px-4 py-20 w-full text-center space-y-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{t("pages.contentPage.contentNotFound")}</h1>
          <p className="text-gray-600">{t("pages.contentPage.thePageYoureLookingFor")}</p>
          <LocaleLink href="/">
            <Button className="rounded-full px-8" data-testid="button-go-home">
              <Home className="w-4 h-4 mr-2" /> Go Home
            </Button>
          </LocaleLink>
        </main>
      </div>
    );
  }

  const title = contentItem!.seoTitle || contentItem!.title;
  const description = contentItem!.seoDescription || contentItem!.summary || "";
  const contentBlocks: ContentBlock[] = (contentItem!.content as ContentBlock[]) || [];
  const tags: string[] = contentItem!.tags || [];
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://www.nursenest.ca";

  const isBlogType = ["blog", "blog-post", "article"].includes(contentItem!.type || "");

  const APPLYNEST_CATEGORIES = ["nursing-education", "career-entry", "admissions", "scholarships"];
  const APPLYNEST_PHRASES = ["admissions", "admission", "scholarship", "scholarships", "career entry", "personal statement", "personal statements", "program application", "career transition", "new grad career", "new graduate career", "career launch", "nursing school application", "healthcare program application"];
  const articleCategory = (contentItem!.category || "").toLowerCase();
  const articleTagText = (tags || []).map(t => t.toLowerCase()).join(" ");
  const articleFullText = `${contentItem!.title} ${contentItem!.summary || ""} ${contentBlocks.map(b => b.content || "").join(" ")}`.toLowerCase();
  const categoryMatch = APPLYNEST_CATEGORIES.includes(articleCategory);
  const phraseMatch = APPLYNEST_PHRASES.some(kw => articleTagText.includes(kw) || articleFullText.includes(kw));
  const showApplyNestBacklink = isBlogType && (categoryMatch || phraseMatch);

  const wordCount = contentBlocks.reduce((acc, block) => acc + (block.content || "").split(/\s+/).length, 0);
  const isThinContent = wordCount < 100 || contentBlocks.length < 2;

  const structuredData = isBlogType
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: contentItem!.title,
        description: description,
        author: {
          "@type": "Organization",
          name: "NurseNest",
          url: baseUrl,
        },
        publisher: {
          "@type": "Organization",
          name: "NurseNest",
          url: baseUrl,
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/logo.png`,
          },
        },
        datePublished: contentItem!.publishedAt || contentItem!.createdAt,
        dateModified: contentItem!.updatedAt || contentItem!.publishedAt || contentItem!.createdAt,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${baseUrl}/learn/${slug}`,
        },
        url: `${baseUrl}/learn/${slug}`,
        inLanguage: "en",
        isAccessibleForFree: true,
        keywords: tags.length > 0 ? tags.join(", ") : contentItem!.category || undefined,
        wordCount: wordCount > 0 ? wordCount : undefined,
        articleSection: contentItem!.category || "Nursing Education",
      }
    : {
        "@context": "https://schema.org",
        "@type": "LearningResource",
        name: contentItem!.title,
        description: description,
        learningResourceType: contentItem!.type || "Lesson",
        educationalLevel: contentItem!.tier === "np" ? "Nurse Practitioner" : contentItem!.tier === "rn" ? "Registered Nurse" : "Practical Nurse",
        provider: {
          "@type": "EducationalOrganization",
          name: "NurseNest",
          url: baseUrl,
        },
        isAccessibleForFree: contentItem!.tier === "free",
        inLanguage: "en",
        datePublished: contentItem!.publishedAt,
        url: `${baseUrl}/learn/${slug}`,
      };

  const tierLabel =
    contentItem!.tier === "np" ? "NP" : contentItem!.tier === "rn" ? "RN" : contentItem!.tier === "free" ? "Free" : "RPN";

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
      <AdminEditButton />
      <SEO
        title={`${title} - NurseNest`}
        description={description}
        canonicalPath={`/learn/${slug}`}
        ogType="article"
        noindex={language !== "en" || isThinContent}
        keywords={tags.length > 0 ? tags.join(", ") : (contentItem!.category ? `${contentItem!.category}, nursing, ${contentItem!.tier || "education"}` : undefined)}
        structuredData={structuredData}
        breadcrumbs={
          isBlogType
            ? [
                { name: "Home", url: `${baseUrl}/` },
                { name: "Blog", url: `${baseUrl}/blog` },
                { name: contentItem!.title, url: `${baseUrl}/learn/${slug}` },
              ]
            : [
                { name: "Home", url: `${baseUrl}/` },
                { name: "Learn", url: `${baseUrl}/lessons` },
                { name: contentItem!.title, url: `${baseUrl}/learn/${slug}` },
              ]
        }
      />
      <Navigation />

      <article
        className={user?.tier !== "admin" ? "select-none" : ""}
        onContextMenu={user?.tier !== "admin" ? (e) => e.preventDefault() : undefined}
        data-testid="article-content"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <nav aria-label={t("pages.contentPage.breadcrumb")} className="mb-6 text-sm text-gray-500" data-testid="nav-breadcrumb">
            <ol className="flex items-center gap-1 flex-wrap">
              <li>
                <LocaleLink href="/" className="hover:text-primary transition-colors">
                  Home
                </LocaleLink>
              </li>
              <li>
                <ChevronRight className="w-3 h-3 text-gray-300 mx-1" />
              </li>
              <li>
                <LocaleLink href="/lessons" className="hover:text-primary transition-colors">
                  Learn
                </LocaleLink>
              </li>
              <li>
                <ChevronRight className="w-3 h-3 text-gray-300 mx-1" />
              </li>
              <li className="text-gray-900 font-medium">{contentItem!.title}</li>
            </ol>
          </nav>

          <header className="mb-10 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              {contentItem!.bodySystem && (
                <Badge variant="secondary" className="text-sm" data-testid="badge-body-system">
                  {contentItem!.bodySystem}
                </Badge>
              )}
              <Badge
                variant="outline"
                className="text-sm"
                data-testid="badge-tier"
              >
                {tierLabel}
              </Badge>
              {contentItem!.publishedAt && (
                <span className="flex items-center gap-1 text-sm text-gray-400" data-testid="text-published-date">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(contentItem!.publishedAt as unknown as string)}
                </span>
              )}
              {(contentItem as any).authorName && (
                <span className="flex items-center gap-1 text-sm text-gray-400" data-testid="text-author-name">
                  <User className="w-3.5 h-3.5" />
                  {(contentItem as any).authorName}
                </span>
              )}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900" data-testid="text-content-title">
              {contentItem!.title}
            </h1>
            {contentItem!.summary && (
              <p className="text-lg text-gray-600 leading-relaxed" data-testid="text-content-summary">
                {contentItem!.summary}
              </p>
            )}
          </header>

          <div className="flex items-center gap-3 mb-8" data-testid="section-cite-top">
            <CiteThisPage
              title={contentItem!.title}
              publishedDate={contentItem!.publishedAt as unknown as string}
            />
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-full"
                onClick={() => setShowEditor(true)}
                data-testid="button-admin-edit"
              >
                <Pencil className="w-4 h-4" />
                Edit Page
              </Button>
            )}
          </div>

          <section className="prose-lg max-w-none" data-testid="section-content-blocks">
            {contentBlocks.map((block, index) => (
              <ContentBlockRenderer key={index} block={block} />
            ))}
          </section>

          {showApplyNestBacklink && (
            <div className="mt-8 p-5 bg-purple-50/50 border border-purple-100 rounded-xl" data-testid="section-applynest-backlink">
              <p className="text-sm text-gray-700 leading-relaxed">
                Exploring applications, scholarships, or career preparation? <a href="https://applynest.ca" target="_blank" rel="noopener noreferrer" className="text-purple-600 font-medium hover:underline" data-testid="link-applynest-blog-article">{t("pages.contentPage.applynestProvidesHealthcareProgramApplication")}</a> to help you navigate the next step in your career.
              </p>
            </div>
          )}

          {tags.length > 0 && (
            <section className="mt-12 pt-8 border-t border-gray-200" data-testid="section-tags">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">{t("pages.contentPage.topics")}</h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-sm" data-testid={`badge-tag-${tag}`}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          <div className="mt-8 flex justify-start" data-testid="section-cite-this-page">
            <CiteThisPage
              title={contentItem!.title}
              publishedDate={contentItem!.publishedAt as unknown as string}
            />
          </div>

          {relatedItems && relatedItems.length > 0 && (
            <section className="mt-12 pt-8 border-t border-gray-200" data-testid="section-related-content">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t("pages.contentPage.relatedArticles")}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {relatedItems.map((item) => (
                  <LocaleLink key={item.slug} href={`/learn/${item.slug}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full" data-testid={`card-related-${item.slug}`}>
                      <CardContent className="p-5 space-y-2">
                        <div className="flex items-center gap-2">
                          {item.category && (
                            <Badge variant="secondary" className="text-xs">
                              {item.category}
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                        {item.summary && (
                          <p className="text-sm text-gray-500 line-clamp-2">{item.summary}</p>
                        )}
                      </CardContent>
                    </Card>
                  </LocaleLink>
                ))}
              </div>
            </section>
          )}

          <AutoRelatedContent
            slug={slug || ""}
            contentType={isBlogType ? "blog" : "lesson"}
            title={contentItem!.title}
            bodySystem={contentItem!.bodySystem || undefined}
            category={contentItem!.category || undefined}
            tags={tags}
            className="mt-12 pt-8 border-t border-gray-200"
            sectionTitle="Explore Related Content"
          />

          <ContextualRelatedResources
            pageType={isBlogType ? "blog" : "lesson"}
            category={contentItem!.category}
            tags={tags}
            currentPath={`/learn/${slug}`}
            className="mt-12 pt-8 border-t border-gray-200"
          />

          <CrossPlatformRelatedContent
            slug={slug || ""}
            source="nursing"
            className="border-t border-gray-200"
          />

          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            <MedicalReviewBadge lastUpdated={contentItem!.updatedAt as unknown as string || undefined} />
            <MedicalReferences lessonId={slug || ""} />
          </div>

          <MedicalReviewJsonLd
            title={contentItem!.title}
            slug={slug || ""}
            lastUpdated={contentItem!.updatedAt as unknown as string || undefined}
            description={contentItem!.summary || undefined}
            pageUrl={`https://www.nursenest.ca/learn/${slug}`}
          />

          <BlogInlineLeadCapture professionContext={contentItem?.category || "nursing"} />

          <div className="mt-12">
            <EducationalIntegrity variant="footer" />
          </div>
        </div>
      </article>
      <Footer />

      {showEditor && contentItem && (
        <InlineEditorPanel
          contentItem={contentItem}
          onClose={() => setShowEditor(false)}
          onSaved={() => {
            setShowEditor(false);
            queryClient.invalidateQueries({ queryKey: ["content-slug", slug, language] });
            queryClient.invalidateQueries({ queryKey: ["content-slug"] });
          }}
        />
      )}
    </div>
  );
}
