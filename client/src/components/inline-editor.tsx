import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Save, X, Plus, Trash2, ChevronUp, ChevronDown,
  GripVertical, Loader2, Pencil, Eye, EyeOff, Globe, Rocket, Languages, Sparkles,
} from "lucide-react";
import { AIAssistant } from "@/components/ai-assistant";

import { useI18n } from "@/lib/i18n";
const TRANSLATION_LANGS = [
  { code: "en", label: "English (Source)" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "zh", label: "Chinese" },
  { code: "ar", label: "Arabic" },
  { code: "hi", label: "Hindi" },
  { code: "pt", label: "Portuguese" },
  { code: "tl", label: "Filipino" },
  { code: "ko", label: "Korean" },
  { code: "ja", label: "Japanese" },
  { code: "de", label: "German" },
  { code: "vi", label: "Vietnamese" },
  { code: "pa", label: "Punjabi" },
  { code: "ur", label: "Urdu" },
  { code: "fa", label: "Farsi" },
];

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
  const { t } = useI18n();
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

function getCredentials() {
  try {
    const stored = localStorage.getItem("nursenest-credentials");
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

interface ContentItemData {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  tier?: string | null;
  status?: string | null;
  tags?: string[] | null;
  content?: any;
}

interface InlineEditorPanelProps {
  contentItem: ContentItemData;
  onClose: () => void;
  onSaved: () => void;
}

export function InlineEditorPanel({ contentItem, onClose, onSaved }: InlineEditorPanelProps) {
  const rawBlocks = (contentItem.content as any[]) || [];
  const [title, setTitle] = useState(contentItem.title);
  const [summary, setSummary] = useState(contentItem.summary || "");
  const [tier, setTier] = useState(contentItem.tier || "free");
  const [status, setStatus] = useState(contentItem.status || "draft");
  const [tagsStr, setTagsStr] = useState((contentItem.tags || []).join(", "));
  const [blocks, setBlocks] = useState<EditableBlock[]>(rawBlocks.map(blockToEditable));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const [editLang, setEditLang] = useState("en");
  const [transTitle, setTransTitle] = useState("");
  const [transSummary, setTransSummary] = useState("");
  const [transBlocks, setTransBlocks] = useState<EditableBlock[]>([]);
  const [transLoading, setTransLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const sourceTitle = contentItem.title;
  const sourceSummary = contentItem.summary || "";
  const sourceBlocks = rawBlocks;

  useEffect(() => {
    if (editLang === "en") {
      setTransTitle("");
      setTransSummary("");
      setTransBlocks([]);
      return;
    }
    setTransLoading(true);
    const creds = getCredentials();
    const credParams = creds ? `username=${encodeURIComponent(creds.username)}&password=${encodeURIComponent(creds.password)}&` : "";
    fetch(`/api/content/slug/${contentItem.slug}?${credParams}lang=${encodeURIComponent(editLang)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data._translation && data._translation.status !== "missing") {
          setTransTitle(data.title !== sourceTitle ? data.title : "");
          setTransSummary(data.summary !== sourceSummary ? (data.summary || "") : "");
          if (data.content && JSON.stringify(data.content) !== JSON.stringify(sourceBlocks)) {
            setTransBlocks((data.content as any[]).map(blockToEditable));
          } else {
            setTransBlocks([]);
          }
        } else {
          setTransTitle("");
          setTransSummary("");
          setTransBlocks([]);
        }
      })
      .catch(() => {
        setTransTitle("");
        setTransSummary("");
        setTransBlocks([]);
      })
      .finally(() => setTransLoading(false));
  }, [editLang]);

  const handleGenerateAITranslation = async () => {
    const creds = getCredentials();
    if (!creds) return;
    setGenerating(true);
    setError("");
    try {
      const fields: Record<string, any> = { title: sourceTitle, summary: sourceSummary };
      if (sourceBlocks.length > 0) {
        fields.content = JSON.stringify(sourceBlocks);
      }
      const res = await fetch(`/api/content-translations/${contentItem.id}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang: editLang, fields, username: creds.username, password: creds.password }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.translations) {
          if (data.translations.title) setTransTitle(data.translations.title);
          if (data.translations.summary) setTransSummary(data.translations.summary);
          if (data.translations.content) {
            try {
              const parsed = JSON.parse(data.translations.content);
              if (Array.isArray(parsed)) setTransBlocks(parsed.map(blockToEditable));
            } catch {}
          }
          setSuccess(true);
          setTimeout(() => setSuccess(false), 2000);
        }
      } else {
        const err = await res.json();
        setError(err.error || "AI translation failed");
      }
    } catch (e: any) {
      setError(e.message);
    }
    setGenerating(false);
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
      if (editLang !== "en") {
        const translations: Record<string, string> = {};
        if (transTitle.trim()) translations.title = transTitle;
        if (transSummary.trim()) translations.summary = transSummary;
        if (transBlocks.length > 0) {
          translations.content = JSON.stringify(transBlocks.map(editableToBlock));
        }
        if (Object.keys(translations).length === 0) {
          setError("No translated content to save. Enter translations first.");
          setSaving(false);
          return;
        }
        const res = await fetch(`/api/content-translations/${contentItem.id}/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lang: editLang,
            translations,
            username: creds.username,
            password: creds.password,
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to save translation");
        }
        setSuccess(true);
        setTimeout(() => onSaved(), 800);
      } else {
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
        setTimeout(() => onSaved(), 800);
      }
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
          <h2 className="text-lg font-bold text-gray-900">{t("components.inlineEditor.editPage")}</h2>
          <div className="flex items-center gap-2">
            {status !== "published" && (
              <Button
                onClick={() => { setStatus("published"); setTimeout(handleSave, 50); }}
                disabled={saving}
                size="sm"
                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                data-testid="button-inline-publish"
              >
                <Rocket className="w-4 h-4" />
                Publish
              </Button>
            )}
            <Button onClick={handleSave} disabled={saving} size="sm" className="gap-2" data-testid="button-inline-save">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} data-testid="button-inline-close">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {error && (
          <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}
        {success && (
          <div className="mx-4 mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
            Saved successfully. Refreshing...
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t("components.inlineEditor.title")}</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} data-testid="input-inline-title" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t("components.inlineEditor.summary")}</label>
            <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} data-testid="input-inline-summary" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t("components.inlineEditor.tier")}</label>
              <Select value={tier} onValueChange={setTier}>
                <SelectTrigger data-testid="select-inline-tier"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIER_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>{t.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t("components.inlineEditor.status")}</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger data-testid="select-inline-status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">{t("components.inlineEditor.draft")}</SelectItem>
                  <SelectItem value="published">{t("components.inlineEditor.published")}</SelectItem>
                  <SelectItem value="archived">{t("components.inlineEditor.archived")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t("components.inlineEditor.tagsCommaSeparated")}</label>
            <Input value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} placeholder={t("components.inlineEditor.nursingPathophysiologyClinical")} data-testid="input-inline-tags" />
          </div>

          <div className="pt-2 border-t">
            <AIAssistant
              contentTitle={title}
              contentSummary={summary}
              contentTier={tier}
              contentBlocks={blocks.map(editableToBlock)}
              onBlocksGenerated={(newBlocks) => {
                const converted = newBlocks.map(blockToEditable);
                setBlocks((prev) => [...prev, ...converted]);
              }}
              onSeoGenerated={() => {}}
              compact
            />
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("components.inlineEditor.contentBlocks")}</label>
              <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => addBlock(blocks.length - 1)} data-testid="button-inline-add-block">
                <Plus className="w-3 h-3" /> Add Block
              </Button>
            </div>

            <div className="space-y-3">
              {blocks.map((block, index) => (
                <div key={index} className="border rounded-lg p-3 bg-gray-50/50 space-y-2" data-testid={`block-editor-${index}`}>
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
                    <Select value={block.type} onValueChange={(v) => updateBlock(index, "type", v)}>
                      <SelectTrigger className="h-8 text-xs w-36"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {BLOCK_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-0.5 ml-auto">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => moveBlock(index, "up")} disabled={index === 0}>
                        <ChevronUp className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => moveBlock(index, "down")} disabled={index === blocks.length - 1}>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400 hover:text-red-600" onClick={() => removeBlock(index)}>
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
                  <Button variant="ghost" size="sm" className="h-6 text-xs text-gray-400 gap-1" onClick={() => addBlock(index)}>
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

interface QuickCreatePanelProps {
  pageName: string;
  defaultTier?: string;
  defaultCategory?: string;
  onClose: () => void;
  onCreated: (item: any) => void;
}

export function QuickCreatePanel({ pageName, defaultTier = "free", defaultCategory, onClose, onCreated }: QuickCreatePanelProps) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [tier, setTier] = useState(defaultTier);
  const [status, setStatus] = useState("draft");
  const [blocks, setBlocks] = useState<EditableBlock[]>([
    { type: "heading", editText: "", originalShape: "content" },
    { type: "paragraph", editText: "", originalShape: "content" },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    const creds = getCredentials();
    if (!creds) {
      setError("Admin credentials not found.");
      return;
    }
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const outputBlocks = blocks.map(editableToBlock);
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: creds.username,
          password: creds.password,
          title,
          slug,
          type: "lesson",
          summary: summary || null,
          tier,
          status,
          category: defaultCategory || pageName,
          content: outputBlocks,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create");
      }
      const item = await res.json();
      onCreated(item);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const updateBlock = (index: number, field: "type" | "editText", value: string) => {
    const updated = [...blocks];
    updated[index] = { ...updated[index], [field]: value };
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

  return (
    <div className="fixed inset-0 z-50 flex" data-testid="quick-create-panel">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-lg bg-white shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-4 border-b bg-emerald-50">
          <h2 className="text-lg font-bold text-gray-900">{t("components.inlineEditor.createNewContent")}</h2>
          <div className="flex items-center gap-2">
            <Button onClick={handleCreate} disabled={saving} size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700" data-testid="button-create-save">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Create
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} data-testid="button-create-close">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {error && (
          <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t("components.inlineEditor.title2")}</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("components.inlineEditor.enterPageTitle")} data-testid="input-create-title" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t("components.inlineEditor.summary2")}</label>
            <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} placeholder={t("components.inlineEditor.briefDescription")} data-testid="input-create-summary" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t("components.inlineEditor.tier2")}</label>
              <Select value={tier} onValueChange={setTier}>
                <SelectTrigger data-testid="select-create-tier"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIER_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>{t.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t("components.inlineEditor.status2")}</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger data-testid="select-create-status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">{t("components.inlineEditor.draft2")}</SelectItem>
                  <SelectItem value="published">{t("components.inlineEditor.published2")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-2 border-t">
            <AIAssistant
              contentTitle={title}
              contentSummary={summary}
              contentTier={tier}
              contentBlocks={blocks.map(editableToBlock)}
              onBlocksGenerated={(newBlocks) => {
                const converted = newBlocks.map(blockToEditable);
                setBlocks((prev) => [...prev, ...converted]);
              }}
              onSeoGenerated={() => {}}
              compact
            />
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("components.inlineEditor.contentBlocks2")}</label>
              <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => addBlock(blocks.length - 1)} data-testid="button-create-add-block">
                <Plus className="w-3 h-3" /> Add Block
              </Button>
            </div>
            <div className="space-y-3">
              {blocks.map((block, index) => (
                <div key={index} className="border rounded-lg p-3 bg-gray-50/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
                    <Select value={block.type} onValueChange={(v) => updateBlock(index, "type", v)}>
                      <SelectTrigger className="h-8 text-xs w-36"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {BLOCK_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400 hover:text-red-600 ml-auto" onClick={() => removeBlock(index)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <Textarea
                    value={block.editText}
                    onChange={(e) => updateBlock(index, "editText", e.target.value)}
                    rows={block.type === "paragraph" || block.type === "list" ? 4 : 2}
                    className="text-sm"
                    placeholder={`Enter ${block.type} content...`}
                  />
                  <Button variant="ghost" size="sm" className="h-6 text-xs text-gray-400 gap-1" onClick={() => addBlock(index)}>
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

interface AdminInlineToolbarProps {
  contentId?: string;
  contentSlug?: string;
  pageName?: string;
  defaultTier?: string;
  defaultCategory?: string;
  onContentUpdated?: () => void;
}

export function AdminInlineToolbar({
  contentId,
  contentSlug,
  pageName = "page",
  defaultTier = "free",
  defaultCategory,
  onContentUpdated,
}: AdminInlineToolbarProps) {
  const { isAdmin } = useAuth();
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [contentItem, setContentItem] = useState<ContentItemData | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewAsUser, setPreviewAsUser] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    if (contentId || contentSlug) {
      loadContent();
    }
  }, [contentId, contentSlug, isAdmin]);

  const loadContent = async () => {
    const creds = getCredentials();
    if (!creds) return;
    setLoading(true);
    try {
      const url = contentId
        ? `/api/content/${contentId}?username=${encodeURIComponent(creds.username)}&password=${encodeURIComponent(creds.password)}`
        : `/api/content/slug/${contentSlug}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setContentItem(data);
      }
    } catch {}
    setLoading(false);
  };

  if (!isAdmin) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2 items-end" data-testid="admin-inline-toolbar">
        <div className="flex items-center gap-2 bg-white rounded-full shadow-lg border border-gray-200 px-3 py-2">
          {contentItem && (
            <Button
              size="sm"
              variant="outline"
              className="gap-2 rounded-full text-xs h-9"
              onClick={() => setEditing(true)}
              data-testid="button-admin-inline-edit"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit Page
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="gap-2 rounded-full text-xs h-9 bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
            onClick={() => setCreating(true)}
            data-testid="button-admin-inline-create"
          >
            <Plus className="w-3.5 h-3.5" />
            New Content
          </Button>
          <Button
            size="sm"
            variant={previewAsUser ? "default" : "outline"}
            className={`gap-2 rounded-full text-xs h-9 ${previewAsUser ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}`}
            onClick={() => setPreviewAsUser(!previewAsUser)}
            data-testid="button-admin-preview-user"
          >
            {previewAsUser ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {previewAsUser ? "Exit Preview" : "View as User"}
          </Button>
        </div>
      </div>

      {editing && contentItem && (
        <InlineEditorPanel
          contentItem={contentItem}
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            loadContent();
            onContentUpdated?.();
          }}
        />
      )}

      {creating && (
        <QuickCreatePanel
          pageName={pageName}
          defaultTier={defaultTier}
          defaultCategory={defaultCategory}
          onClose={() => setCreating(false)}
          onCreated={(item) => {
            setCreating(false);
            setContentItem(item);
            onContentUpdated?.();
          }}
        />
      )}
    </>
  );
}
