import { useState, useEffect, useCallback, createContext, useContext, useRef, type ReactNode } from "react";
import { Camera, Upload, RotateCcw, X, Check, Loader2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import { useI18n } from "@/lib/i18n";
interface SiteImageOverride {
  id: string;
  imageKey: string;
  url: string;
  alt: string | null;
  updatedAt: string;
}

function getAdminCredentials(): { username: string; password: string } | null {
  try {
    const stored = localStorage.getItem("nursenest-credentials");
    if (stored) {
      const { username, password } = JSON.parse(stored);
      if (username && password) return { username, password };
    }
  } catch {}
  return null;
}

interface SiteImagesContextValue {
  overrides: Record<string, SiteImageOverride>;
  loading: boolean;
  getImageUrl: (key: string, defaultUrl: string) => string;
  refresh: () => void;
}

const SiteImagesContext = createContext<SiteImagesContextValue>({
  overrides: {},
  loading: true,
  getImageUrl: (_k, d) => d,
  refresh: () => {},
});

export function SiteImagesProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Record<string, SiteImageOverride>>({});
  const [loading, setLoading] = useState(true);

  const fetchOverrides = useCallback(async () => {
    try {
      const res = await fetch("/api/site-images");
      if (res.ok) {
        const data: SiteImageOverride[] = await res.json();
        const map: Record<string, SiteImageOverride> = {};
        data.forEach((img) => { map[img.imageKey] = img; });
        setOverrides(map);
      }
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOverrides(); }, [fetchOverrides]);

  const getImageUrl = useCallback((key: string, defaultUrl: string) => {
    return overrides[key]?.url || defaultUrl;
  }, [overrides]);

  return (
    <SiteImagesContext.Provider value={{ overrides, loading, getImageUrl, refresh: fetchOverrides }}>
      {children}
    </SiteImagesContext.Provider>
  );
}

export function useSiteImages() {
  return useContext(SiteImagesContext);
}

interface AdminImageOverlayProps {
  imageKey: string;
  src: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  isAdmin?: boolean;
  draggable?: boolean;
}

export function AdminImageOverlay({
  imageKey,
  src,
  alt = "",
  className = "",
  imgClassName = "",
  isAdmin = false,
  draggable = false,
}: AdminImageOverlayProps) {
  const { getImageUrl, refresh, overrides } = useSiteImages();
  const [showEditor, setShowEditor] = useState(false);
  const resolvedSrc = getImageUrl(imageKey, src);
  const currentOverride = overrides[imageKey];

  if (!isAdmin) {
    return (
      <div className={className}>
        <img src={resolvedSrc} alt={alt} className={imgClassName} draggable={draggable} />
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      <img src={resolvedSrc} alt={alt} className={imgClassName} draggable={draggable} />
      <button
        onClick={(e) => { e.stopPropagation(); setShowEditor(true); }}
        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow-md border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-primary hover:text-white hover:border-primary"
        data-testid={`button-edit-image-${imageKey}`}
        title={t("components.adminImageOverlay.changeImage2")}
      >
        <Camera className="w-4 h-4" />
      </button>
      {showEditor && (
        <ImageEditorModal
          imageKey={imageKey}
          currentSrc={resolvedSrc}
          defaultSrc={src}
          currentAlt={currentOverride?.alt || alt}
          onClose={() => setShowEditor(false)}
          onSaved={refresh}
        />
      )}
    </div>
  );
}

function ImageEditorModal({
  imageKey,
  currentSrc,
  defaultSrc,
  currentAlt,
  onClose,
  onSaved,
}: {
  imageKey: string;
  currentSrc: string;
  defaultSrc: string;
  currentAlt?: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [urlInput, setUrlInput] = useState("");
  const [altInput, setAltInput] = useState(currentAlt || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentSrc);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const res = await fetch("/api/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type || "image/png" }),
      });
      if (!res.ok) throw new Error("Failed to get upload URL");
      const { uploadURL, objectPath } = await res.json();

      const uploadRes = await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "image/png" },
      });
      if (!uploadRes.ok) throw new Error("Upload failed");

      setPreviewUrl(objectPath);
      setUrlInput(objectPath);
      toast({ title: "Image uploaded", description: "Click Save to apply" });
    } catch (e: any) {
      toast({ title: "Upload error", description: e.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    const url = urlInput || previewUrl;
    if (!url) return;
    if (url === defaultSrc && altInput === (currentAlt || "")) return;
    setSaving(true);
    const creds = getAdminCredentials();
    try {
      const res = await fetch(`/api/site-images/${encodeURIComponent(imageKey)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, alt: altInput || undefined, username: creds?.username, password: creds?.password }),
      });
      if (!res.ok) throw new Error("Save failed");
      toast({ title: "Image updated" });
      onSaved();
      onClose();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = async () => {
    setSaving(true);
    const creds = getAdminCredentials();
    try {
      const res = await fetch(`/api/site-images/${encodeURIComponent(imageKey)}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: creds?.username, password: creds?.password }),
      });
      if (!res.ok) throw new Error("Restore failed");
      toast({ title: "Default image restored" });
      onSaved();
      onClose();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()} data-testid="modal-image-editor">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{t("components.adminImageOverlay.changeImage")}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          <img src={previewUrl} alt={t("components.adminImageOverlay.preview")} className="w-full h-48 object-contain p-2" />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setMode("upload")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${mode === "upload" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            <Upload className="w-4 h-4 inline mr-1" /> Upload
          </button>
          <button
            onClick={() => setMode("url")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${mode === "url" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            <Link2 className="w-4 h-4 inline mr-1" /> Paste URL
          </button>
        </div>

        {mode === "upload" && (
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              data-testid="button-upload-image"
            >
              {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> {t("components.adminImageOverlay.uploading")}</> : <><Upload className="w-4 h-4" /> {t("components.adminImageOverlay.chooseFile")}</>}
            </Button>
          </div>
        )}

        {mode === "url" && (
          <div className="space-y-2">
            <Input
              value={urlInput}
              onChange={(e) => { setUrlInput(e.target.value); setPreviewUrl(e.target.value); }}
              placeholder="https://example.com/image.png"
              data-testid="input-image-url"
            />
          </div>
        )}

        <Input
          value={altInput}
          onChange={(e) => setAltInput(e.target.value)}
          placeholder={t("components.adminImageOverlay.altTextOptional")}
          data-testid="input-image-alt"
        />

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving || (!urlInput && previewUrl === currentSrc && altInput === (currentAlt || ""))} className="flex-1 gap-2" data-testid="button-save-image">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save
          </Button>
          {currentSrc !== defaultSrc && (
            <Button variant="outline" onClick={handleRestore} disabled={saving} className="gap-2" data-testid="button-restore-default">
              <RotateCcw className="w-4 h-4" /> Restore Default
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
