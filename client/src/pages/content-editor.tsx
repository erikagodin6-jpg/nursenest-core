import { useState, useEffect, useCallback } from "react";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import {
  Plus,
  ArrowLeft,
  Save,
  Trash2,
  Search,
  ChevronUp,
  ChevronDown,
  Shield,
  Eye,
  EyeOff,
  RefreshCw,
  Send,
  Sparkles,
  X,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  GripVertical,
  Type,
  AlertTriangle,
  Pill,
  MessageSquare,
  HelpCircle,
  CreditCard,
  Heading,
  Link2,
  ExternalLink,
  Copy,
  CheckCircle2,
  Image as ImageIcon,
  Zap,
  Loader2,
} from "lucide-react";

type ContentBlock = {
  type: string;
  content: string;
};

type ContentItem = {
  id: string;
  title: string;
  slug: string;
  type: string;
  category: string | null;
  bodySystem: string | null;
  tier: string | null;
  status: string | null;
  tags: string[] | null;
  summary: string | null;
  content: ContentBlock[] | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[] | null;
  primaryKeyword: string | null;
  secondaryKeywords: string[] | null;
  scheduledAt: string | null;
  clinicalSafetyReview: boolean | null;
  autoPublish: boolean | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  authorId: string | null;
  authorName: string | null;
  regionScope: string | null;
};

const CONTENT_TYPES = ["lesson", "article", "guide", "flashcard-set", "blog-post", "blog", "exam", "clinical-case"];

const CMS_TEMPLATES: Record<string, { blocks: ContentBlock[]; category: string; tags: string[] }> = {
  lesson: {
    blocks: [
      { type: "heading", content: "Learning Objectives" },
      { type: "paragraph", content: "After completing this lesson, you will be able to:" },
      { type: "list", content: "Objective 1\nObjective 2\nObjective 3" },
      { type: "heading", content: "Pathophysiology" },
      { type: "paragraph", content: "Describe the cellular and molecular mechanisms..." },
      { type: "heading", content: "Clinical Presentation" },
      { type: "paragraph", content: "Key signs and symptoms include..." },
      { type: "heading", content: "Abnormal Findings" },
      { type: "paragraph", content: "Abnormal lab values and diagnostic findings..." },
      { type: "heading", content: "Nursing Interventions" },
      { type: "paragraph", content: "Priority nursing actions..." },
      { type: "callout", content: "Clinical Pearl: Important safety consideration..." },
      { type: "heading", content: "Scope of Practice" },
      { type: "paragraph", content: "RPN: Monitor and report...\nRN: Protocol-based interventions...\nNP: Order and prescribe..." },
    ],
    category: "pathophysiology",
    tags: ["lesson", "pathophysiology", "clinical-reasoning"],
  },
  "flashcard-set": {
    blocks: [
      { type: "flashcard", content: "Q: What is the mechanism of action?\nA: Describe the mechanism..." },
      { type: "flashcard", content: "Q: What are the key nursing considerations?\nA: List the considerations..." },
      { type: "flashcard", content: "Q: What are the contraindications?\nA: List contraindications..." },
      { type: "flashcard", content: "Q: What patient education is needed?\nA: Describe education points..." },
      { type: "flashcard", content: "Q: What are the expected lab values?\nA: Describe abnormal findings..." },
    ],
    category: "exam-prep",
    tags: ["flashcards", "study-aid", "review"],
  },
  exam: {
    blocks: [
      { type: "question", content: "Q: A patient presents with...\nA) Option A\nB) Option B\nC) Option C\nD) Option D\nCorrect: B\nRationale: Explain why B is correct..." },
      { type: "question", content: "Q: The nurse should prioritize...\nA) Option A\nB) Option B\nC) Option C\nD) Option D\nCorrect: A\nRationale: Explain why A is correct..." },
      { type: "question", content: "Q: Which assessment finding...\nA) Option A\nB) Option B\nC) Option C\nD) Option D\nCorrect: C\nRationale: Explain why C is correct..." },
    ],
    category: "exam-prep",
    tags: ["exam", "practice-questions", "NCLEX-prep"],
  },
  "clinical-case": {
    blocks: [
      { type: "heading", content: "Patient Presentation" },
      { type: "paragraph", content: "Age, sex, chief complaint, relevant history..." },
      { type: "heading", content: "Initial Assessment" },
      { type: "paragraph", content: "Vital signs, physical findings..." },
      { type: "heading", content: "Diagnostic Results" },
      { type: "paragraph", content: "Lab values, imaging findings..." },
      { type: "heading", content: "Clinical Decision Point" },
      { type: "paragraph", content: "What would you do next? Options..." },
      { type: "heading", content: "Outcome & Debrief" },
      { type: "paragraph", content: "Correct action and rationale..." },
    ],
    category: "clinical-reasoning",
    tags: ["case-study", "clinical-judgment", "simulation"],
  },
};
const CATEGORIES = [
  "clinical-reasoning",
  "pharmacology",
  "lab-interpretation",
  "exam-prep",
  "patient-safety",
  "pathophysiology",
  "assessment-skills",
  "medication-safety",
  "nursing-fundamentals",
];
const BODY_SYSTEMS = [
  "cardiovascular",
  "respiratory",
  "neurological",
  "gastrointestinal",
  "renal",
  "endocrine",
  "hematologic",
  "musculoskeletal",
  "integumentary",
  "immune",
  "reproductive",
];
const TIERS = ["free", "rpn", "rn", "np"];
const STATUSES = ["draft", "review", "scheduled", "published"];
const BLOCK_TYPES = [
  "heading",
  "paragraph",
  "list",
  "clinical-pearl",
  "medication",
  "warning",
  "quiz-question",
  "callout",
  "flashcard",
  "question",
  "image",
];

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  review: "bg-amber-100 text-amber-700",
  scheduled: "bg-blue-100 text-blue-700",
  published: "bg-green-100 text-green-700",
};

const tierLabels: Record<string, string> = {
  free: "Free",
  rpn: "RPN/LVN",
  rn: "RN",
  np: "NP Advanced",
};

function slugify(text: string): string {
  const { t } = useI18n();
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getCredentials(): { username: string; password: string } | null {
  try {
    const stored = localStorage.getItem("nursenest-credentials");
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function formatDate(d: string | null) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ContentEditorPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const isAdmin = user?.tier === "admin";

  const [view, setView] = useState<"list" | "editor">("list");
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkSuggestions, setLinkSuggestions] = useState<any>(null);
  const [linkSuggestionsOpen, setLinkSuggestionsOpen] = useState(false);
  const [linkSuggestionsLoading, setLinkSuggestionsLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("lesson");
  const [bodySystem, setBodySystem] = useState<string>("");
  const [tier, setTier] = useState("free");
  const [status, setStatus] = useState("draft");
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [summary, setSummary] = useState("");
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [secondaryKeywords, setSecondaryKeywords] = useState("");
  const [category, setCategory] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [clinicalSafetyReview, setClinicalSafetyReview] = useState(false);
  const [autoPublish, setAutoPublish] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [regionScope, setRegionScope] = useState<string>("BOTH");
  const [currentRegion, setCurrentRegion] = useState<"US" | "CA">("US");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showSeo, setShowSeo] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [imageGenPrompt, setImageGenPrompt] = useState<Record<number, string>>({});
  const [imageGenLoading, setImageGenLoading] = useState<Record<number, boolean>>({});

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const creds = getCredentials();
      const params = creds ? `?status=all&username=${encodeURIComponent(creds.username)}&password=${encodeURIComponent(creds.password)}` : "";
      const res = await fetch(`/api/content${params}`);
      if (!res.ok) throw new Error("Failed to load content");
      const data = await res.json();
      setItems(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/region").then(r => r.json()).then(d => {
      if (d?.region) setCurrentRegion(d.region);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (isAdmin) fetchItems();
  }, [isAdmin, fetchItems]);

  function resetEditor() {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setType("lesson");
    setCategory("");
    setBodySystem("");
    setTier("free");
    setStatus("draft");
    setTagsInput("");
    setTags([]);
    setSummary("");
    setBlocks([]);
    setSeoTitle("");
    setSeoDescription("");
    setSeoKeywords("");
    setPrimaryKeyword("");
    setSecondaryKeywords("");
    setScheduledAt("");
    setClinicalSafetyReview(false);
    setAutoPublish(false);
    setAuthorName("");
    setRegionScope("BOTH");
    setShowSeo(false);
    setShowPreview(false);
    setDeleteConfirm(false);
  }

  function openNew() {
    resetEditor();
    setView("editor");
  }

  function openNewWithTemplate(templateType: string) {
    resetEditor();
    const template = CMS_TEMPLATES[templateType];
    if (template) {
      setType(templateType);
      setBlocks(template.blocks);
      setCategory(template.category);
      setTags(template.tags);
    }
    setView("editor");
  }

  function openEdit(item: ContentItem) {
    setEditingId(item.id);
    setTitle(item.title);
    setSlug(item.slug);
    setType(item.type);
    setCategory(item.category || "");
    setBodySystem(item.bodySystem || "");
    setTier(item.tier || "free");
    setStatus(item.status || "draft");
    setTags(item.tags || []);
    setTagsInput("");
    setSummary(item.summary || "");
    setBlocks(item.content || []);
    setSeoTitle(item.seoTitle || "");
    setSeoDescription(item.seoDescription || "");
    setSeoKeywords((item.seoKeywords || []).join(", "));
    setPrimaryKeyword(item.primaryKeyword || "");
    setSecondaryKeywords((item.secondaryKeywords || []).join(", "));
    setScheduledAt(item.scheduledAt ? new Date(item.scheduledAt).toISOString().slice(0, 16) : "");
    setClinicalSafetyReview(item.clinicalSafetyReview || false);
    setAutoPublish(item.autoPublish || false);
    setAuthorName(item.authorName || "");
    setRegionScope((item as any).regionScope || "BOTH");
    setShowSeo(false);
    setShowPreview(false);
    setDeleteConfirm(false);
    setView("editor");
  }

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!editingId) {
      setSlug(slugify(val));
    }
  }

  function addTag() {
    const newTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t && !tags.includes(t));
    if (newTags.length) {
      setTags([...tags, ...newTags]);
      setTagsInput("");
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  function addBlock(blockType: string) {
    setBlocks([...blocks, { type: blockType, content: "" }]);
  }

  function updateBlock(index: number, content: string) {
    const updated = [...blocks];
    updated[index] = { ...updated[index], content };
    setBlocks(updated);
  }

  function removeBlock(index: number) {
    setBlocks(blocks.filter((_, i) => i !== index));
  }

  function handleDragDrop(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;
    const updated = [...blocks];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setBlocks(updated);
    setDragIndex(null);
    setDragOverIndex(null);
  }

  function applyFormatting(index: number, format: string) {
    const textarea = document.querySelector(`[data-testid="textarea-block-${index}"]`) as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = blocks[index].content;
    const selected = text.substring(start, end);
    if (start === end) return;

    let wrapped = selected;
    switch (format) {
      case "bold": wrapped = `**${selected}**`; break;
      case "italic": wrapped = `*${selected}*`; break;
      case "underline": wrapped = `<u>${selected}</u>`; break;
      case "heading": wrapped = `## ${selected}`; break;
      case "bullet": wrapped = selected.split("\n").map(l => `- ${l}`).join("\n"); break;
      case "numbered": wrapped = selected.split("\n").map((l, i) => `${i + 1}. ${l}`).join("\n"); break;
      default: return;
    }

    const newContent = text.substring(0, start) + wrapped + text.substring(end);
    updateBlock(index, newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start;
      textarea.selectionEnd = start + wrapped.length;
    }, 0);
  }

  function moveBlock(index: number, direction: "up" | "down") {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === blocks.length - 1)
    )
      return;
    const updated = [...blocks];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
    setBlocks(updated);
  }

  async function generateImageForBlock(index: number) {
    const prompt = imageGenPrompt[index];
    if (!prompt?.trim()) return;
    setImageGenLoading(prev => ({ ...prev, [index]: true }));
    try {
      const creds = getCredentials();
      if (!creds) throw new Error("Admin credentials required");
      const res = await fetch("/api/admin/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          size: "1024x1024",
          username: creds.username,
          password: creds.password,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert("Error: " + (err.error || "Failed to generate image"));
        return;
      }
      const data = await res.json();
      updateBlock(index, data.url);
      setImageGenPrompt(prev => ({ ...prev, [index]: "" }));
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setImageGenLoading(prev => ({ ...prev, [index]: false }));
    }
  }

  async function autoGenerateSeo() {
    const creds = getCredentials();
    if (!creds) {
      setSeoTitle(title ? `${title} | NurseNest` : "");
      setSeoDescription(summary || blocks.filter((b) => b.type === "paragraph").map((b) => b.content).join(" ").slice(0, 160));
      setSeoKeywords([title.toLowerCase(), type, bodySystem, "nursing", "nclex", ...tags].filter(Boolean).join(", "));
      return;
    }
    try {
      const res = await fetch("/api/ai/generate-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: creds.username, password: creds.password,
          title, summary, content: blocks, tier, category,
        }),
      });
      if (!res.ok) throw new Error("AI SEO failed");
      const seo = await res.json();
      if (seo.seoTitle) setSeoTitle(seo.seoTitle);
      if (seo.seoDescription) setSeoDescription(seo.seoDescription);
      if (seo.seoKeywords) setSeoKeywords(seo.seoKeywords.join(", "));
      if (seo.primaryKeyword) setPrimaryKeyword(seo.primaryKeyword);
      if (seo.secondaryKeywords) setSecondaryKeywords(seo.secondaryKeywords.join(", "));
    } catch {
      setSeoTitle(title ? `${title} | NurseNest` : "");
      setSeoDescription(summary || blocks.filter((b) => b.type === "paragraph").map((b) => b.content).join(" ").slice(0, 160));
      setSeoKeywords([title.toLowerCase(), type, bodySystem, "nursing", "nclex", ...tags].filter(Boolean).join(", "));
    }
  }

  async function handleSave() {
    const creds = getCredentials();
    if (!creds) {
      setError("No credentials found. Please log out and log in again.");
      return;
    }
    if (!title.trim() || !slug.trim()) {
      setError("Title and slug are required.");
      return;
    }

    setSaving(true);
    setError(null);

    const payload: any = {
      username: creds.username,
      password: creds.password,
      title: title.trim(),
      slug: slug.trim(),
      type,
      category: category || null,
      bodySystem: bodySystem || null,
      tier,
      status,
      tags,
      summary: summary || null,
      content: blocks,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      seoKeywords: seoKeywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
      primaryKeyword: primaryKeyword || null,
      secondaryKeywords: secondaryKeywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
      scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      clinicalSafetyReview,
      autoPublish,
      authorName: authorName || null,
      regionScope,
    };

    try {
      const url = editingId ? `/api/content/${editingId}` : "/api/content";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }
      const saved = await res.json();
      if (!editingId) {
        setEditingId(saved.id);
      }
      await fetchItems();
      setError(null);
      fetchLinkSuggestions();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function fetchLinkSuggestions() {
    const creds = getCredentials();
    if (!creds) return;
    setLinkSuggestionsLoading(true);
    try {
      const res = await fetch("/api/content/internal-link-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: creds.username,
          password: creds.password,
          content: blocks,
          title,
          slug,
          summary,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setLinkSuggestions(data);
        if (data.suggestions && data.suggestions.length > 0) {
          setLinkSuggestionsOpen(true);
        }
      }
    } catch {}
    setLinkSuggestionsLoading(false);
  }

  function copyLinkMarkdown(suggestion: any) {
    const md = `[${suggestion.title}](${suggestion.url})`;
    navigator.clipboard.writeText(md);
    setCopiedLink(suggestion.slug);
    setTimeout(() => setCopiedLink(null), 2000);
  }

  async function handlePublish() {
    setStatus("published");
    const creds = getCredentials();
    if (!creds || !editingId) return;

    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/content/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: creds.username,
          password: creds.password,
          status: "published",
          publishedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to publish");
      }
      await fetchItems();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!editingId) return;
    const creds = getCredentials();
    if (!creds) return;

    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/content/${editingId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: creds.username,
          password: creds.password,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete");
      }
      resetEditor();
      setView("list");
      await fetchItems();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  const filteredItems = items.filter((item) => {
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    const matchesType =
      typeFilter === "all" || item.type === typeFilter;
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-8 text-center">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Admin Access Required
              </h2>
              <p className="text-gray-500 mb-6">
                Please log in with an admin account to access this page.
              </p>
              <Button
                onClick={() => setLocation("/login")}
                data-testid="button-content-login"
              >
                Log In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-8 text-center">
              <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Access Denied
              </h2>
              <p className="text-gray-500">
                This page is restricted to administrators.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
      <SEO
        title={t("pages.contentEditor.contentEditorNursenest")}
        description={t("pages.contentEditor.adminContentManagementEditor")}
        canonicalPath="/content-editor"
      />
      <Navigation />

      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700"
              data-testid="text-content-error"
            >
              {error}
              <button
                onClick={() => setError(null)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4 inline" />
              </button>
            </div>
          )}

          {view === "list" ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1
                    className="text-3xl font-bold text-gray-900"
                    data-testid="text-content-title"
                  >
                    Content Engine
                  </h1>
                  <p className="text-gray-500 mt-1">
                    Create and manage learning content
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={openNew}
                    className="gap-2"
                    data-testid="button-new-content"
                  >
                    <Plus className="w-4 h-4" />
                    Blank
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openNewWithTemplate("lesson")} data-testid="button-template-lesson">{t("pages.contentEditor.lesson")}</Button>
                  <Button variant="outline" size="sm" onClick={() => openNewWithTemplate("flashcard-set")} data-testid="button-template-flashcard">{t("pages.contentEditor.flashcards")}</Button>
                  <Button variant="outline" size="sm" onClick={() => openNewWithTemplate("exam")} data-testid="button-template-exam">{t("pages.contentEditor.exam")}</Button>
                  <Button variant="outline" size="sm" onClick={() => openNewWithTemplate("clinical-case")} data-testid="button-template-case">{t("pages.contentEditor.caseStudy")}</Button>
                </div>
              </div>

              <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-grow max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder={t("pages.contentEditor.searchByTitle")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                      data-testid="input-search-content"
                    />
                  </div>
                  <div className="flex gap-1 bg-white rounded-lg border border-primary/10 p-1">
                    {["all", "draft", "review", "scheduled", "published"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          statusFilter === s
                            ? "bg-primary text-white"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                        data-testid={`filter-status-${s}`}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {["all", ...CONTENT_TYPES].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        typeFilter === t
                          ? "bg-primary/10 text-primary border border-primary/30"
                          : "text-gray-500 border border-gray-200 hover:bg-gray-50"
                      }`}
                      data-testid={`filter-type-${t}`}
                    >
                      {t === "all" ? "All Types" : t.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : (
                <Card
                  className="border border-primary/10 overflow-hidden"
                  data-testid="card-content-list"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-primary/10">
                          <th className="text-left px-4 py-3 font-medium text-gray-600">
                            Title
                          </th>
                          <th className="text-left px-4 py-3 font-medium text-gray-600">
                            Type
                          </th>
                          <th className="text-left px-4 py-3 font-medium text-gray-600">
                            Body System
                          </th>
                          <th className="text-left px-4 py-3 font-medium text-gray-600">
                            Tier
                          </th>
                          <th className="text-left px-4 py-3 font-medium text-gray-600">
                            Status
                          </th>
                          <th className="text-right px-4 py-3 font-medium text-gray-600">
                            Updated
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredItems.map((item) => (
                          <tr
                            key={item.id}
                            onClick={() => openEdit(item)}
                            className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                            data-testid={`row-content-${item.id}`}
                          >
                            <td className="px-4 py-3 font-medium text-gray-900">
                              {item.title}
                            </td>
                            <td className="px-4 py-3 text-gray-600 capitalize">
                              {item.type}
                            </td>
                            <td className="px-4 py-3 text-gray-600 capitalize">
                              {item.bodySystem || "-"}
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className="text-xs">
                                {tierLabels[item.tier || "free"] ||
                                  item.tier}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  statusColors[item.status || "draft"]
                                }`}
                                data-testid={`badge-status-${item.id}`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right text-gray-500 text-xs">
                              {formatDate(item.updatedAt)}
                            </td>
                          </tr>
                        ))}
                        {filteredItems.length === 0 && (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-4 py-8 text-center text-gray-400"
                            >
                              {searchQuery || statusFilter !== "all"
                                ? "No content matches your filters"
                                : "No content yet. Create your first item!"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setView("list");
                    resetEditor();
                  }}
                  className="gap-2"
                  data-testid="button-back-to-list"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to List
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">
                  {editingId ? "Edit Content" : "New Content"}
                </h1>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="border border-primary/10">
                    <CardHeader>
                      <CardTitle className="text-sm font-semibold text-gray-700">
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">
                          Title *
                        </label>
                        <Input
                          value={title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          placeholder={t("pages.contentEditor.enterContentTitle")}
                          data-testid="input-title"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">
                          Slug *
                        </label>
                        <Input
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          placeholder="auto-generated-slug"
                          data-testid="input-slug"
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600 mb-1 block">
                            Type
                          </label>
                          <Select value={type} onValueChange={setType}>
                            <SelectTrigger data-testid="select-type">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {CONTENT_TYPES.map((t) => (
                                <SelectItem key={t} value={t}>
                                  {t
                                    .replace("-", " ")
                                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600 mb-1 block">
                            Body System
                          </label>
                          <Select
                            value={bodySystem || "none"}
                            onValueChange={(v) =>
                              setBodySystem(v === "none" ? "" : v)
                            }
                          >
                            <SelectTrigger data-testid="select-body-system">
                              <SelectValue placeholder={t("pages.contentEditor.select")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">{t("pages.contentEditor.none")}</SelectItem>
                              {BODY_SYSTEMS.map((bs) => (
                                <SelectItem key={bs} value={bs}>
                                  {bs.charAt(0).toUpperCase() + bs.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">
                          Category
                        </label>
                        <Select
                          value={category || "none"}
                          onValueChange={(v) => setCategory(v === "none" ? "" : v)}
                        >
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder={t("pages.contentEditor.select2")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">{t("pages.contentEditor.none2")}</SelectItem>
                            {CATEGORIES.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c.replace(/-/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase())}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">
                          Summary
                        </label>
                        <Textarea
                          value={summary}
                          onChange={(e) => setSummary(e.target.value)}
                          placeholder={t("pages.contentEditor.briefSummaryOfTheContent")}
                          rows={3}
                          data-testid="textarea-summary"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-primary/10">
                    <CardHeader>
                      <CardTitle className="text-sm font-semibold text-gray-700">
                        Tags
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2 mb-3">
                        <Input
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addTag();
                            }
                          }}
                          placeholder={t("pages.contentEditor.addTagsCommaSeparated")}
                          data-testid="input-tags"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addTag}
                          data-testid="button-add-tag"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="gap-1 cursor-pointer"
                            onClick={() => removeTag(tag)}
                            data-testid={`badge-tag-${tag}`}
                          >
                            {tag}
                            <X className="w-3 h-3" />
                          </Badge>
                        ))}
                        {tags.length === 0 && (
                          <span className="text-sm text-gray-400">
                            No tags added
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-gray-700">
                        Content Blocks
                      </CardTitle>
                      <Select
                        onValueChange={(v) => addBlock(v)}
                        value=""
                      >
                        <SelectTrigger
                          className="w-auto gap-2"
                          data-testid="select-add-block"
                        >
                          <Plus className="w-4 h-4" />
                          <span>{t("pages.contentEditor.addBlock")}</span>
                        </SelectTrigger>
                        <SelectContent>
                          {BLOCK_TYPES.map((bt) => (
                            <SelectItem key={bt} value={bt}>
                              {bt
                                .replace("-", " ")
                                .replace(/\b\w/g, (c) => c.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {blocks.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-8">
                          No content blocks. Use "Add Block" to get started.
                        </p>
                      )}
                      {blocks.map((block, index) => (
                        <div
                          key={index}
                          className={`border rounded-lg p-4 space-y-2 transition-all ${
                            dragOverIndex === index ? "border-primary border-2 bg-primary/5" :
                            dragIndex === index ? "opacity-50 border-dashed border-gray-300" :
                            "border-gray-200"
                          }`}
                          data-testid={`block-${index}`}
                          draggable
                          onDragStart={() => setDragIndex(index)}
                          onDragOver={(e) => { e.preventDefault(); setDragOverIndex(index); }}
                          onDragLeave={() => setDragOverIndex(null)}
                          onDrop={(e) => { e.preventDefault(); if (dragIndex !== null) handleDragDrop(dragIndex, index); }}
                          onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                                <GripVertical className="w-4 h-4" />
                              </div>
                              <Badge variant="outline" className="capitalize">
                                {block.type.replace("-", " ")}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => moveBlock(index, "up")}
                                disabled={index === 0}
                                data-testid={`button-move-up-${index}`}
                              >
                                <ChevronUp className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => moveBlock(index, "down")}
                                disabled={index === blocks.length - 1}
                                data-testid={`button-move-down-${index}`}
                              >
                                <ChevronDown className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeBlock(index)}
                                data-testid={`button-delete-block-${index}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 border border-gray-100 rounded-md p-1 bg-gray-50">
                            <button
                              type="button"
                              className="p-1.5 rounded hover:bg-white hover:shadow-sm text-gray-500 hover:text-gray-900 transition-colors"
                              title={t("pages.contentEditor.bold")}
                              onClick={() => applyFormatting(index, "bold")}
                            >
                              <Bold className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              className="p-1.5 rounded hover:bg-white hover:shadow-sm text-gray-500 hover:text-gray-900 transition-colors"
                              title={t("pages.contentEditor.italic")}
                              onClick={() => applyFormatting(index, "italic")}
                            >
                              <Italic className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              className="p-1.5 rounded hover:bg-white hover:shadow-sm text-gray-500 hover:text-gray-900 transition-colors"
                              title={t("pages.contentEditor.underline")}
                              onClick={() => applyFormatting(index, "underline")}
                            >
                              <UnderlineIcon className="w-3.5 h-3.5" />
                            </button>
                            <div className="w-px h-5 bg-gray-200 mx-1" />
                            <button
                              type="button"
                              className="p-1.5 rounded hover:bg-white hover:shadow-sm text-gray-500 hover:text-gray-900 transition-colors"
                              title={t("pages.contentEditor.heading")}
                              onClick={() => applyFormatting(index, "heading")}
                            >
                              <Heading className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              className="p-1.5 rounded hover:bg-white hover:shadow-sm text-gray-500 hover:text-gray-900 transition-colors"
                              title={t("pages.contentEditor.bulletList")}
                              onClick={() => applyFormatting(index, "bullet")}
                            >
                              <List className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              className="p-1.5 rounded hover:bg-white hover:shadow-sm text-gray-500 hover:text-gray-900 transition-colors"
                              title={t("pages.contentEditor.numberedList")}
                              onClick={() => applyFormatting(index, "numbered")}
                            >
                              <ListOrdered className="w-3.5 h-3.5" />
                            </button>
                            <div className="w-px h-5 bg-gray-200 mx-1" />
                            <Select onValueChange={(v) => { const updated = [...blocks]; updated[index] = { ...updated[index], type: v }; setBlocks(updated); }} value={block.type}>
                              <SelectTrigger className="h-7 w-auto gap-1 text-xs border-none shadow-none bg-transparent px-2">
                                <Type className="w-3 h-3" />
                                <span className="capitalize">{block.type.replace("-", " ")}</span>
                              </SelectTrigger>
                              <SelectContent>
                                {BLOCK_TYPES.map((bt) => (
                                  <SelectItem key={bt} value={bt}>
                                    {bt.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {block.type === "image" ? (
                            <div className="space-y-3" data-testid={`image-block-${index}`}>
                              {block.content && (
                                <div className="border rounded-lg overflow-hidden bg-gray-50">
                                  <img src={block.content} alt={t("pages.contentEditor.generated")} className="max-h-48 mx-auto object-contain" />
                                </div>
                              )}
                              <Input
                                value={block.content}
                                onChange={(e) => updateBlock(index, e.target.value)}
                                placeholder={t("pages.contentEditor.imageUrlPasteOrGenerate")}
                                className="text-sm font-mono"
                                data-testid={`input-image-url-${index}`}
                              />
                              <div className="flex gap-2 items-end">
                                <div className="flex-1">
                                  <Textarea
                                    value={imageGenPrompt[index] || ""}
                                    onChange={(e) => setImageGenPrompt(prev => ({ ...prev, [index]: e.target.value }))}
                                    placeholder={t("pages.contentEditor.describeTheMedicalImageTo")}
                                    rows={2}
                                    className="text-sm"
                                    data-testid={`textarea-image-prompt-${index}`}
                                  />
                                </div>
                                <Button
                                  onClick={() => generateImageForBlock(index)}
                                  disabled={imageGenLoading[index] || !(imageGenPrompt[index]?.trim())}
                                  size="sm"
                                  className="shrink-0 gap-1.5"
                                  data-testid={`button-generate-image-${index}`}
                                >
                                  {imageGenLoading[index] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                                  {imageGenLoading[index] ? "Generating..." : "AI Generate"}
                                </Button>
                              </div>
                              <p className="text-[10px] text-gray-400">{t("pages.contentEditor.aigeneratedImagesAreSavedTo")}</p>
                            </div>
                          ) : (
                            <Textarea
                              value={block.content}
                              onChange={(e) =>
                                updateBlock(index, e.target.value)
                              }
                              placeholder={`Enter ${block.type} content...`}
                              rows={
                                block.type === "heading"
                                  ? 1
                                  : block.type === "quiz-question"
                                    ? 6
                                    : 4
                              }
                              className="allow-select font-mono text-sm"
                              data-testid={`textarea-block-${index}`}
                            />
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border border-primary/10">
                    <CardHeader>
                      <button
                        onClick={() => setShowSeo(!showSeo)}
                        className="flex items-center justify-between w-full"
                        data-testid="button-toggle-seo"
                      >
                        <CardTitle className="text-sm font-semibold text-gray-700">
                          SEO Settings
                        </CardTitle>
                        {showSeo ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </CardHeader>
                    {showSeo && (
                      <CardContent className="space-y-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={autoGenerateSeo}
                          className="gap-2"
                          data-testid="button-auto-seo"
                        >
                          <Sparkles className="w-4 h-4" />
                          Auto-generate from content
                        </Button>
                        <div>
                          <label className="text-sm font-medium text-gray-600 mb-1 block">
                            SEO Title
                          </label>
                          <Input
                            value={seoTitle}
                            onChange={(e) => setSeoTitle(e.target.value)}
                            placeholder={t("pages.contentEditor.seoTitle")}
                            data-testid="input-seo-title"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600 mb-1 block">
                            SEO Description
                          </label>
                          <Textarea
                            value={seoDescription}
                            onChange={(e) => setSeoDescription(e.target.value)}
                            placeholder={t("pages.contentEditor.seoDescription")}
                            rows={3}
                            data-testid="textarea-seo-description"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600 mb-1 block">
                            SEO Keywords
                          </label>
                          <Input
                            value={seoKeywords}
                            onChange={(e) => setSeoKeywords(e.target.value)}
                            placeholder={t("pages.contentEditor.keyword1Keyword2Keyword3")}
                            data-testid="input-seo-keywords"
                          />
                        </div>
                      </CardContent>
                    )}
                  </Card>

                  <Card className="border border-primary/10">
                    <CardHeader>
                      <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center justify-between w-full"
                        data-testid="button-toggle-preview"
                      >
                        <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          {showPreview ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                          Preview
                        </CardTitle>
                        {showPreview ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </CardHeader>
                    {showPreview && (
                      <CardContent>
                        <div className="prose max-w-none" data-testid="content-preview">
                          {blocks.length === 0 && (
                            <p className="text-gray-400 text-center">
                              No content blocks to preview
                            </p>
                          )}
                          {blocks.map((block, i) => {
                            switch (block.type) {
                              case "heading":
                                return (
                                  <h2
                                    key={i}
                                    className="text-xl font-bold text-gray-900 mt-6 mb-2"
                                  >
                                    {block.content}
                                  </h2>
                                );
                              case "paragraph":
                                return (
                                  <p
                                    key={i}
                                    className="text-gray-700 mb-4 whitespace-pre-wrap"
                                  >
                                    {block.content}
                                  </p>
                                );
                              case "list":
                                return (
                                  <ul
                                    key={i}
                                    className="list-disc list-inside mb-4 space-y-1 text-gray-700"
                                  >
                                    {block.content
                                      .split("\n")
                                      .filter(Boolean)
                                      .map((li, j) => (
                                        <li key={j}>{li}</li>
                                      ))}
                                  </ul>
                                );
                              case "clinical-pearl":
                                return (
                                  <div
                                    key={i}
                                    className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-4"
                                  >
                                    <p className="font-semibold text-blue-800 mb-1">
                                      Clinical Pearl
                                    </p>
                                    <p className="text-blue-700 whitespace-pre-wrap">
                                      {block.content}
                                    </p>
                                  </div>
                                );
                              case "medication":
                                return (
                                  <div
                                    key={i}
                                    className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg mb-4"
                                  >
                                    <p className="font-semibold text-purple-800 mb-1">
                                      Medication Note
                                    </p>
                                    <p className="text-purple-700 whitespace-pre-wrap">
                                      {block.content}
                                    </p>
                                  </div>
                                );
                              case "warning":
                                return (
                                  <div
                                    key={i}
                                    className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mb-4"
                                  >
                                    <p className="font-semibold text-red-800 mb-1">
                                      ⚠️ Warning
                                    </p>
                                    <p className="text-red-700 whitespace-pre-wrap">
                                      {block.content}
                                    </p>
                                  </div>
                                );
                              case "quiz-question":
                                return (
                                  <div
                                    key={i}
                                    className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mb-4"
                                  >
                                    <p className="font-semibold text-amber-800 mb-1">
                                      Quiz Question
                                    </p>
                                    <p className="text-amber-700 whitespace-pre-wrap">
                                      {block.content}
                                    </p>
                                  </div>
                                );
                              case "image":
                                return block.content ? (
                                  <div key={i} className="mb-4">
                                    <img src={block.content} alt={t("pages.contentEditor.contentImage")} className="max-w-full rounded-lg shadow-sm" />
                                  </div>
                                ) : (
                                  <div key={i} className="mb-4 p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg text-center text-gray-400">
                                    <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                                    <p>{t("pages.contentEditor.noImageSet")}</p>
                                  </div>
                                );
                              default:
                                return (
                                  <p key={i} className="text-gray-700 mb-4">
                                    {block.content}
                                  </p>
                                );
                            }
                          })}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="border border-primary/10 sticky top-20">
                    <CardHeader>
                      <CardTitle className="text-sm font-semibold text-gray-700">
                        Publishing
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">
                          Status
                        </label>
                        <Select value={status} onValueChange={setStatus}>
                          <SelectTrigger data-testid="select-status">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">
                          Tier
                        </label>
                        <Select value={tier} onValueChange={setTier}>
                          <SelectTrigger data-testid="select-tier">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TIERS.map((t) => (
                              <SelectItem key={t} value={t}>
                                {tierLabels[t]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">
                          Region Scope
                        </label>
                        {(() => {
                          const tierLower = (tier || "free").toLowerCase();
                          const isRegionLocked = (tierLower === "rpn" || tierLower === "rn" || tierLower === "lvn");
                          const isPublished = editingId && status === "published" && isRegionLocked;
                          const forcedScope = isRegionLocked ? (currentRegion === "CA" ? "CA_ONLY" : "US_ONLY") : null;
                          if (forcedScope && regionScope !== forcedScope && !editingId) {
                            setTimeout(() => setRegionScope(forcedScope), 0);
                          }
                          return (
                            <div className="flex items-center gap-2">
                              <Select
                                value={isRegionLocked && !editingId ? (forcedScope || regionScope) : regionScope}
                                onValueChange={setRegionScope}
                                disabled={!!isPublished}
                              >
                                <SelectTrigger data-testid="select-region-scope">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {isRegionLocked ? (
                                    <SelectItem value={currentRegion === "CA" ? "CA_ONLY" : "US_ONLY"}>
                                      {currentRegion === "CA" ? "CA Only" : "US Only"}
                                    </SelectItem>
                                  ) : (
                                    <>
                                      <SelectItem value="BOTH">{t("pages.contentEditor.bothUsAmpCa")}</SelectItem>
                                      <SelectItem value="US_ONLY">{t("pages.contentEditor.usOnly")}</SelectItem>
                                      <SelectItem value="CA_ONLY">{t("pages.contentEditor.caOnly")}</SelectItem>
                                    </>
                                  )}
                                </SelectContent>
                              </Select>
                              <span className="text-xs font-bold text-primary whitespace-nowrap" data-testid="text-current-domain-region">
                                {currentRegion === "CA" ? "🇨🇦" : "🇺🇸"} {currentRegion} domain
                              </span>
                              {isPublished && (
                                <span className="text-[10px] text-amber-600">{t("pages.contentEditor.lockedAfterPublish")}</span>
                              )}
                            </div>
                          );
                        })()}
                        {editingId && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 text-xs gap-1"
                            onClick={async () => {
                              const otherRegion = currentRegion === "CA" ? "US" : "CA";
                              const otherScope = `${otherRegion}_ONLY`;
                              const newTitle = title + ` (${otherRegion})`;
                              const newSlug = slug + `-${otherRegion.toLowerCase()}`;
                              const creds = getCredentials();
                              if (!creds) return;
                              const payload = {
                                title: newTitle,
                                slug: newSlug,
                                type,
                                category: category || null,
                                bodySystem: bodySystem || null,
                                tier,
                                status: "draft",
                                tags,
                                summary: summary || null,
                                content: blocks,
                                seoTitle: seoTitle || null,
                                seoDescription: seoDescription || null,
                                seoKeywords: seoKeywords.split(",").map(k => k.trim()).filter(Boolean),
                                primaryKeyword: primaryKeyword || null,
                                secondaryKeywords: secondaryKeywords.split(",").map(k => k.trim()).filter(Boolean),
                                regionScope: otherScope,
                                authorName: authorName || null,
                                versionKey: editingId,
                                username: creds.username,
                                password: creds.password,
                              };
                              try {
                                const res = await fetch("/api/content", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify(payload),
                                });
                                if (!res.ok) {
                                  const err = await res.json();
                                  alert(err.error || "Failed to create variant");
                                  return;
                                }
                                const created = await res.json();
                                alert(`Created ${otherRegion} variant as draft. Opening...`);
                                openItem(created);
                              } catch {
                                alert("Failed to create variant");
                              }
                            }}
                            data-testid="button-create-region-variant"
                          >
                            <RefreshCw className="w-3 h-3" /> Create {currentRegion === "CA" ? "US" : "CA"} Variant
                          </Button>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">
                          Author
                        </label>
                        <Input
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          placeholder="e.g. Erika Godin, RN"
                          data-testid="input-author-name"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">
                          Primary Keyword
                        </label>
                        <Input
                          value={primaryKeyword}
                          onChange={(e) => setPrimaryKeyword(e.target.value)}
                          placeholder="e.g. sepsis nursing assessment"
                          data-testid="input-primary-keyword"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">
                          Secondary Keywords
                        </label>
                        <Input
                          value={secondaryKeywords}
                          onChange={(e) => setSecondaryKeywords(e.target.value)}
                          placeholder={t("pages.contentEditor.keyword1Keyword2")}
                          data-testid="input-secondary-keywords"
                        />
                      </div>

                      {(status === "scheduled" || type === "blog-post" || type === "article") && (
                        <div>
                          <label className="text-sm font-medium text-gray-600 mb-1 block">
                            Scheduled Publish Date
                          </label>
                          <Input
                            type="datetime-local"
                            value={scheduledAt}
                            onChange={(e) => setScheduledAt(e.target.value)}
                            data-testid="input-scheduled-at"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-1">
                        <input
                          type="checkbox"
                          id="safety-review"
                          checked={clinicalSafetyReview}
                          onChange={(e) => setClinicalSafetyReview(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300"
                          data-testid="checkbox-safety-review"
                        />
                        <label htmlFor="safety-review" className="text-sm text-gray-600">
                          Requires clinical safety review
                        </label>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="auto-publish"
                          checked={autoPublish}
                          onChange={(e) => setAutoPublish(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300"
                          data-testid="checkbox-auto-publish"
                        />
                        <label htmlFor="auto-publish" className="text-sm text-gray-600">
                          Auto-publish when scheduled
                        </label>
                      </div>

                      {type === "lesson" && status === "published" && (() => {
                        const wc = blocks.reduce((acc, b) => acc + (b.content || "").split(/\s+/).filter(Boolean).length, 0);
                        const issues: string[] = [];
                        if (!title.trim()) issues.push("Missing title");
                        if (!slug.trim()) issues.push("Missing slug");
                        if (wc < 100) issues.push(`Content too short (${wc} words, min 100)`);
                        if (blocks.length === 0) issues.push("No content blocks");
                        if (issues.length === 0) return null;
                        return (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-2" data-testid="warning-incomplete-lesson">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-xs font-semibold text-amber-800">{t("pages.contentEditor.incompleteLesson")}</p>
                                <ul className="text-xs text-amber-700 mt-1 space-y-0.5">
                                  {issues.map((issue, i) => <li key={i}>{issue}</li>)}
                                </ul>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      <div className="flex flex-col gap-2 pt-2">
                        <Button
                          onClick={handleSave}
                          disabled={saving}
                          className="w-full gap-2"
                          data-testid="button-save"
                        >
                          {saving ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          {saving ? "Saving..." : "Save"}
                        </Button>

                        {editingId && status !== "published" && (
                          <Button
                            onClick={handlePublish}
                            disabled={saving}
                            variant="outline"
                            className="w-full gap-2 border-green-300 text-green-700 hover:bg-green-50"
                            data-testid="button-publish"
                          >
                            <Send className="w-4 h-4" />
                            Publish
                          </Button>
                        )}

                        {editingId && (
                          <>
                            {deleteConfirm ? (
                              <div className="flex gap-2">
                                <Button
                                  onClick={handleDelete}
                                  disabled={saving}
                                  variant="destructive"
                                  className="flex-1"
                                  data-testid="button-confirm-delete"
                                >
                                  Confirm
                                </Button>
                                <Button
                                  onClick={() => setDeleteConfirm(false)}
                                  variant="outline"
                                  className="flex-1"
                                  data-testid="button-cancel-delete"
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <Button
                                onClick={() => setDeleteConfirm(true)}
                                variant="outline"
                                className="w-full gap-2 border-red-300 text-red-600 hover:bg-red-50"
                                data-testid="button-delete"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </Button>
                            )}
                          </>
                        )}
                      </div>

                      <div className="pt-3 border-t">
                        <Button
                          onClick={fetchLinkSuggestions}
                          disabled={linkSuggestionsLoading || !blocks.length}
                          variant="outline"
                          className="w-full gap-2"
                          size="sm"
                          data-testid="button-scan-links"
                        >
                          {linkSuggestionsLoading ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Link2 className="w-3.5 h-3.5" />
                          )}
                          Scan for Internal Links
                        </Button>
                      </div>

                      {linkSuggestions && (
                        <div className="pt-3 border-t" data-testid="panel-link-suggestions">
                          <button
                            className="flex items-center justify-between w-full text-left text-sm font-medium mb-2"
                            onClick={() => setLinkSuggestionsOpen(!linkSuggestionsOpen)}
                            data-testid="button-toggle-link-suggestions"
                          >
                            <span className="flex items-center gap-1.5">
                              <Link2 className="w-3.5 h-3.5" />
                              Internal Links
                              {linkSuggestions.suggestions?.length > 0 && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                  {linkSuggestions.suggestions.length}
                                </Badge>
                              )}
                            </span>
                            {linkSuggestionsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          {linkSuggestionsOpen && (
                            <div className="space-y-2">
                              {linkSuggestions.meta && (
                                <div className="text-[10px] text-muted-foreground space-y-0.5 p-2 bg-muted/50 rounded" data-testid="text-link-density-info">
                                  <p>{linkSuggestions.meta.wordCount} words · Max {linkSuggestions.meta.maxLinksAllowed} links allowed</p>
                                  <p>
                                    Existing: {linkSuggestions.meta.existingInternalLinks} internal, {linkSuggestions.meta.existingExternalLinks} external
                                  </p>
                                  {linkSuggestions.meta.density && (
                                    <p className={linkSuggestions.meta.density.withinLimit ? "text-emerald-600" : "text-red-600"}>
                                      Density: {linkSuggestions.meta.density.withinLimit ? "Within limit" : "Over limit"} ({linkSuggestions.meta.density.wordsPerLink} words/link)
                                    </p>
                                  )}
                                </div>
                              )}

                              {linkSuggestions.suggestions?.length === 0 && (
                                <p className="text-xs text-muted-foreground italic py-1">{t("pages.contentEditor.noInternalLinkOpportunitiesFound")}</p>
                              )}

                              {linkSuggestions.suggestions?.map((s: any, i: number) => (
                                <div
                                  key={s.slug}
                                  className="p-2 rounded border bg-card text-xs space-y-1"
                                  data-testid={`link-suggestion-${i}`}
                                >
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="font-medium truncate flex-1">{s.title}</span>
                                    <Badge variant="outline" className="text-[9px] px-1 shrink-0">
                                      {s.matchType}
                                    </Badge>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground leading-relaxed break-words">
                                    ...{s.contextSnippet}...
                                  </p>
                                  <div className="flex items-center gap-1 pt-0.5">
                                    <code className="text-[9px] bg-muted px-1 py-0.5 rounded flex-1 truncate">{s.url}</code>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0 shrink-0"
                                      onClick={() => copyLinkMarkdown(s)}
                                      data-testid={`button-copy-link-${i}`}
                                    >
                                      {copiedLink === s.slug ? (
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </Button>
                                    <a
                                      href={s.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center justify-center h-6 w-6 rounded hover:bg-muted shrink-0"
                                      data-testid={`link-preview-${i}`}
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
