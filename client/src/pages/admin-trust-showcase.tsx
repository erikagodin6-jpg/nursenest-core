import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { adminFetch } from "@/lib/admin-fetch";
import {
  Plus, Trash2, ChevronUp, ChevronDown, Save, Image as ImageIcon,
  FileText, ArrowLeft, Upload, Eye, GripVertical, X,
} from "lucide-react";
import { LocaleLink } from "@/lib/LocaleLink";

import { useI18n } from "@/lib/i18n";
type TrustImageItem = { id: string; type: "image"; title: string; caption?: string; src: string; href?: string; tag?: string; alt: string };
type TrustSnippetItem = { id: string; type: "snippet"; title: string; excerpt: string; href: string; tag?: string };
type TrustItem = TrustImageItem | TrustSnippetItem;

function genId() {
  const { t } = useI18n();
  return "ts-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function ItemEditor({
  item,
  index,
  total,
  onUpdate,
  onDelete,
  onMove,
  onUpload,
}: {
  item: TrustItem;
  index: number;
  total: number;
  onUpdate: (updated: TrustItem) => void;
  onDelete: () => void;
  onMove: (dir: "up" | "down") => void;
  onUpload: (file: File) => Promise<string | null>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("File must be under 2 MB");
      return;
    }
    setUploading(true);
    const src = await onUpload(file);
    setUploading(false);
    if (src && item.type === "image") {
      onUpdate({ ...item, src });
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <Card className="border border-gray-200" data-testid={`card-editor-${item.id}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
          <Badge variant={item.type === "image" ? "default" : "secondary"} className="text-xs">
            {item.type === "image" ? "Image" : "Snippet"}
          </Badge>
          <span className="text-xs text-gray-400 ml-auto">#{index + 1}</span>
          <Button
            variant="ghost" size="sm"
            onClick={() => onMove("up")}
            disabled={index === 0}
            data-testid={`button-move-up-${item.id}`}
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost" size="sm"
            onClick={() => onMove("down")}
            disabled={index === total - 1}
            data-testid={`button-move-down-${item.id}`}
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost" size="sm"
            onClick={onDelete}
            data-testid={`button-delete-${item.id}`}
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">{t("pages.adminTrustShowcase.titleMax80")}</label>
            <Input
              value={item.title}
              maxLength={80}
              onChange={e => onUpdate({ ...item, title: e.target.value } as TrustItem)}
              data-testid={`input-title-${item.id}`}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">{t("pages.adminTrustShowcase.tagMax20")}</label>
            <Input
              value={item.tag || ""}
              maxLength={20}
              onChange={e => onUpdate({ ...item, tag: e.target.value || undefined } as TrustItem)}
              data-testid={`input-tag-${item.id}`}
            />
          </div>
        </div>

        {item.type === "snippet" && (
          <div className="mt-3 space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">{t("pages.adminTrustShowcase.excerptMax160")}</label>
              <Textarea
                value={item.excerpt}
                maxLength={160}
                rows={2}
                onChange={e => onUpdate({ ...item, excerpt: e.target.value })}
                data-testid={`input-excerpt-${item.id}`}
              />
              <span className="text-xs text-gray-400">{item.excerpt.length}/160</span>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">{t("pages.adminTrustShowcase.linkMustStartWith")}</label>
              <Input
                value={item.href}
                onChange={e => onUpdate({ ...item, href: e.target.value })}
                placeholder="/flashcards"
                data-testid={`input-href-${item.id}`}
              />
            </div>
          </div>
        )}

        {item.type === "image" && (
          <div className="mt-3 space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">{t("pages.adminTrustShowcase.altText")}</label>
              <Input
                value={item.alt}
                onChange={e => onUpdate({ ...item, alt: e.target.value })}
                data-testid={`input-alt-${item.id}`}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">{t("pages.adminTrustShowcase.captionOptional")}</label>
              <Input
                value={item.caption || ""}
                onChange={e => onUpdate({ ...item, caption: e.target.value || undefined })}
                data-testid={`input-caption-${item.id}`}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">{t("pages.adminTrustShowcase.linkOptionalMustStartWith")}</label>
              <Input
                value={item.href || ""}
                onChange={e => onUpdate({ ...item, href: e.target.value || undefined })}
                placeholder="/lessons"
                data-testid={`input-href-${item.id}`}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">{t("pages.adminTrustShowcase.imageSource")}</label>
                <Input
                  value={item.src}
                  onChange={e => onUpdate({ ...item, src: e.target.value })}
                  placeholder="/trust/screenshot.webp"
                  data-testid={`input-src-${item.id}`}
                />
              </div>
              <div className="pt-4">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button
                  variant="outline" size="sm"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  data-testid={`button-upload-${item.id}`}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </div>
            {item.src && (
              <div className="rounded-lg overflow-hidden border bg-gray-50 max-w-[200px]">
                <img src={item.src} alt={item.alt} className="w-full h-auto" />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminTrustShowcase() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<TrustItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/trust-showcase")
      .then(r => r.json())
      .then(data => { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{t("pages.adminTrustShowcase.adminAccessRequired")}</p>
      </div>
    );
  }

  const handleSave = async () => {
    for (const item of items) {
      if (item.title.length > 80) {
        toast({ title: "Validation Error", description: `Title too long: "${item.title.slice(0, 30)}..."`, variant: "destructive" });
        return;
      }
      if (item.tag && item.tag.length > 20) {
        toast({ title: "Validation Error", description: `Tag too long on "${item.title}"`, variant: "destructive" });
        return;
      }
      if (item.type === "snippet") {
        if (!item.href.startsWith("/")) {
          toast({ title: "Validation Error", description: `Link must start with / on "${item.title}"`, variant: "destructive" });
          return;
        }
        if (item.excerpt.length > 160) {
          toast({ title: "Validation Error", description: `Excerpt too long on "${item.title}"`, variant: "destructive" });
          return;
        }
      }
      if (item.type === "image" && item.href && !item.href.startsWith("/")) {
        toast({ title: "Validation Error", description: `Link must start with / on "${item.title}"`, variant: "destructive" });
        return;
      }
    }

    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/trust-showcase", {
        method: "PUT",
        body: { items },
      });
      if (res.ok) {
        toast({ title: "Saved", description: "Trust showcase items updated successfully" });
      } else {
        const err = await res.json().catch(() => ({}));
        toast({ title: "Error", description: err.error || "Save failed", variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const handleUpload = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    const creds = JSON.parse(localStorage.getItem("nursenest-credentials") || "{}");
    const storedUser = JSON.parse(localStorage.getItem("nursenest-user") || "{}");
    if (creds.username) formData.append("username", creds.username);
    if (creds.password) formData.append("password", creds.password);
    if (storedUser?.id) formData.append("adminId", storedUser.id);

    try {
      const res = await fetch("/api/admin/trust-showcase/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        toast({ title: "Uploaded", description: "Image uploaded successfully" });
        return data.src;
      } else {
        const err = await res.json().catch(() => ({}));
        toast({ title: "Upload Error", description: err.error || "Upload failed", variant: "destructive" });
        return null;
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
      return null;
    }
  };

  const addSnippet = () => {
    setItems(prev => [...prev, {
      id: genId(),
      type: "snippet",
      title: "",
      excerpt: "",
      href: "/",
      tag: "",
    }]);
  };

  const addImage = () => {
    setItems(prev => [...prev, {
      id: genId(),
      type: "image",
      title: "",
      src: "",
      alt: "",
      tag: "",
    }]);
  };

  const updateItem = (index: number, updated: TrustItem) => {
    setItems(prev => prev.map((it, i) => i === index ? updated : it));
  };

  const deleteItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, dir: "up" | "down") => {
    setItems(prev => {
      const arr = [...prev];
      const target = dir === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= arr.length) return arr;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return arr;
    });
  };

  return (
    <div className="min-h-screen bg-warmwhite font-sans text-gray-900">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <LocaleLink href="/admin">
            <Button variant="ghost" size="sm" data-testid="button-back-admin">
              <ArrowLeft className="w-4 h-4 mr-1" /> Admin
            </Button>
          </LocaleLink>
          <h1 className="text-2xl font-bold" data-testid="text-trust-admin-title">{t("pages.adminTrustShowcase.trustShowcaseManager")}</h1>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Button onClick={addSnippet} variant="outline" size="sm" data-testid="button-add-snippet">
            <FileText className="w-4 h-4 mr-1" /> Add Snippet
          </Button>
          <Button onClick={addImage} variant="outline" size="sm" data-testid="button-add-image">
            <ImageIcon className="w-4 h-4 mr-1" /> Add Image
          </Button>
          <div className="ml-auto">
            <Button onClick={handleSave} disabled={saving} data-testid="button-save-showcase">
              <Save className="w-4 h-4 mr-1" />
              {saving ? "Saving..." : "Save All"}
            </Button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-400 text-center py-12">{t("pages.adminTrustShowcase.loading")}</p>
        ) : items.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
            <Eye className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-600 mb-1">{t("pages.adminTrustShowcase.noShowcaseItemsYet")}</h3>
            <p className="text-sm text-gray-400 mb-4">{t("pages.adminTrustShowcase.addSnippetOrImageCards")}</p>
            <div className="flex justify-center gap-3">
              <Button onClick={addSnippet} variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-1" /> Add Snippet
              </Button>
              <Button onClick={addImage} variant="outline" size="sm">
                <ImageIcon className="w-4 h-4 mr-1" /> Add Image
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, i) => (
              <ItemEditor
                key={item.id}
                item={item}
                index={i}
                total={items.length}
                onUpdate={updated => updateItem(i, updated)}
                onDelete={() => deleteItem(i)}
                onMove={dir => moveItem(i, dir)}
                onUpload={handleUpload}
              />
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSave} disabled={saving} data-testid="button-save-showcase-bottom">
              <Save className="w-4 h-4 mr-1" />
              {saving ? "Saving..." : "Save All"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
