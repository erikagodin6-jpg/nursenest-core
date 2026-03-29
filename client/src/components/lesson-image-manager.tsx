import { useState, useEffect, useCallback } from "react";
import { ObjectUploader } from "@/components/ObjectUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ImagePlus, Trash2, Pencil, Check, X, Sparkles, Loader2 } from "lucide-react";
import type { UppyFile } from "@uppy/core";

import { useI18n } from "@/lib/i18n";
interface LessonImage {
  id: number;
  lesson_id: string;
  object_path: string;
  file_name: string;
  section: string;
  caption: string | null;
  position: number;
}

function getAdminCredentials(): {
username: string; password: string } | null {
  try {
    const stored = localStorage.getItem("nursenest-credentials");
    if (stored) {
      const { username, password } = JSON.parse(stored);
      if (username && password) return { username, password };
    }
  } catch {}
  return null;
}

function getAdminId(): string | null {
  try {
    const stored = localStorage.getItem("nursenest-user");
    if (stored) {
      const user = JSON.parse(stored);
      if (user?.id && user?.tier === "admin") return user.id;
    }
  } catch {}
  return null;
}

interface LessonImageManagerProps {
  lessonId: string;
  section?: string;
  isAdmin: boolean;
  isEditing: boolean;
}

export function LessonImageManager({ lessonId, section = "general", isAdmin, isEditing }: LessonImageManagerProps) {
  const [images, setImages] = useState<LessonImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCaption, setEditingCaption] = useState<number | null>(null);
  const [captionText, setCaptionText] = useState("");
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiCaption, setAiCaption] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const { toast } = useToast();

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch(`/api/lesson-images/${lessonId}`);
      if (res.ok) {
        const data = await res.json();
        const filtered = section === "all" ? data : data.filter((img: LessonImage) => img.section === section);
        setImages(filtered);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [lessonId, section]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleGetUploadParameters = async (file: UppyFile<Record<string, unknown>, Record<string, unknown>>) => {
    const res = await fetch("/api/uploads/request-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: file.name,
        size: file.size,
        contentType: file.type,
      }),
    });
    if (!res.ok) throw new Error("Failed to get upload URL");
    const data = await res.json();
    (file as any)._objectPath = data.objectPath;
    return {
      method: "PUT" as const,
      url: data.uploadURL,
      headers: { "Content-Type": file.type || "application/octet-stream" },
    };
  };

  const handleUploadComplete = async (result: any) => {
    const creds = getAdminCredentials();
    const adminId = getAdminId();
    const successfulFiles = result.successful || [];
    for (const file of successfulFiles) {
      const objectPath = (file as any)._objectPath;
      if (!objectPath) continue;
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (adminId) headers["x-admin-id"] = adminId;
        const res = await fetch("/api/lesson-images", {
          method: "POST",
          headers,
          body: JSON.stringify({
            lessonId,
            objectPath,
            fileName: file.name,
            section,
            caption: "",
            position: images.length,
            ...(creds ? { username: creds.username, password: creds.password } : { adminId }),
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error);
        }
        toast({ title: "Image uploaded", description: `${file.name} added successfully` });
      } catch (e: any) {
        toast({ title: "Error saving image record", description: e.message, variant: "destructive" });
      }
    }
    fetchImages();
  };

  const deleteImage = async (imageId: number) => {
    const creds = getAdminCredentials();
    const adminId = getAdminId();
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (adminId) headers["x-admin-id"] = adminId;
      const res = await fetch(`/api/lesson-images/${imageId}`, {
        method: "DELETE",
        headers,
        body: JSON.stringify({
          ...(creds ? { username: creds.username, password: creds.password } : { adminId }),
        }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      toast({ title: "Image removed" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const saveCaption = async (imageId: number) => {
    const creds = getAdminCredentials();
    const adminId = getAdminId();
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (adminId) headers["x-admin-id"] = adminId;
      const res = await fetch(`/api/lesson-images/${imageId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          caption: captionText,
          ...(creds ? { username: creds.username, password: creds.password } : { adminId }),
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      setImages((prev) => prev.map((img) => img.id === imageId ? { ...img, caption: captionText } : img));
      setEditingCaption(null);
      toast({ title: "Caption updated" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const generateAiImage = async () => {
    if (!aiPrompt.trim()) {
      toast({ title: "Enter a prompt", description: "Describe the clinical image you want to generate", variant: "destructive" });
      return;
    }
    const creds = getAdminCredentials();
    const adminId = getAdminId();
    if (!creds && !adminId) {
      toast({ title: "Not authenticated", description: "Please log out and log back in", variant: "destructive" });
      return;
    }
    setAiGenerating(true);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (adminId) headers["x-admin-id"] = adminId;
      const res = await fetch("/api/ai/generate-lesson-image", {
        method: "POST",
        headers,
        body: JSON.stringify({
          lessonId,
          section,
          prompt: aiPrompt.trim(),
          caption: aiCaption.trim() || null,
          ...(creds ? { username: creds.username, password: creds.password } : { adminId }),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }
      const newImage = await res.json();
      if (newImage && newImage.id) {
        setImages((prev) => [...prev, {
          id: newImage.id,
          lesson_id: newImage.lesson_id,
          object_path: newImage.object_path,
          file_name: newImage.file_name,
          section: newImage.section,
          caption: newImage.caption,
          position: newImage.position,
        }]);
      }
      toast({ title: "AI image generated", description: "Image has been added to this section" });
      setAiPrompt("");
      setAiCaption("");
      setShowAiGenerator(false);
    } catch (e: any) {
      toast({ title: "AI Generation Error", description: e.message, variant: "destructive" });
    } finally {
      setAiGenerating(false);
    }
  };

  if (loading) return null;

  if (!isAdmin && images.length === 0) return null;

  return (
    <div className="space-y-3" data-testid={`lesson-images-${section}`}>
      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {images.map((img) => (
            <figure key={img.id} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
              <img
                src={img.object_path}
                alt={img.caption || `${(img.lesson_id || "").replace(/-/g, " ")} clinical illustration - NurseNest nursing education`}
                title={img.caption || img.file_name}
                className="w-full h-auto object-contain max-h-80"
                loading="lazy"
                data-testid={`img-lesson-${img.id}`}
              />
              {img.caption && editingCaption !== img.id && (
                <figcaption className="px-3 py-2 text-sm text-gray-600 italic bg-gray-50 border-t border-gray-100">
                  {img.caption}
                </figcaption>
              )}
              {isAdmin && isEditing && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-7 w-7 bg-white/90 shadow"
                    onClick={() => { setEditingCaption(img.id); setCaptionText(img.caption || ""); }}
                    data-testid={`button-edit-caption-${img.id}`}
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-7 w-7 shadow"
                    onClick={() => deleteImage(img.id)}
                    data-testid={`button-delete-image-${img.id}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              )}
              {editingCaption === img.id && (
                <div className="px-3 py-2 flex gap-2 bg-gray-50 border-t border-gray-100">
                  <Input
                    value={captionText}
                    onChange={(e) => setCaptionText(e.target.value)}
                    placeholder={t("components.lessonImageManager.addACaption")}
                    className="text-sm h-8"
                    data-testid={`input-caption-${img.id}`}
                  />
                  <Button size="icon" className="h-8 w-8" onClick={() => saveCaption(img.id)} data-testid={`button-save-caption-${img.id}`}>
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setEditingCaption(null)}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </figure>
          ))}
        </div>
      )}

      {isAdmin && isEditing && (
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <ObjectUploader
              maxNumberOfFiles={5}
              maxFileSize={15728640}
              onGetUploadParameters={handleGetUploadParameters}
              onComplete={handleUploadComplete}
              buttonClassName="gap-2 text-sm"
            >
              <ImagePlus className="w-4 h-4" />
              Upload Image{images.length > 0 ? "s" : ""}
            </ObjectUploader>

            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-sm border-violet-200 text-violet-700 hover:bg-violet-50"
              onClick={() => setShowAiGenerator(!showAiGenerator)}
              data-testid={`button-ai-generate-${section}`}
            >
              <Sparkles className="w-4 h-4" />
              AI Generate Image
            </Button>
          </div>

          {showAiGenerator && (
            <div className="border border-violet-200 rounded-xl p-4 bg-violet-50/50 space-y-3" data-testid={`ai-generator-${section}`}>
              <div className="flex items-center gap-2 text-sm font-semibold text-violet-800">
                <Sparkles className="w-4 h-4" />
                AI Image Generator
              </div>
              <Textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder={t("components.lessonImageManager.describeTheClinicalImageYou")}
                className="min-h-[80px] text-sm bg-white"
                data-testid={`input-ai-prompt-${section}`}
              />
              <Input
                value={aiCaption}
                onChange={(e) => setAiCaption(e.target.value)}
                placeholder={t("components.lessonImageManager.captionToDisplayUnderThe")}
                className="text-sm bg-white"
                data-testid={`input-ai-caption-${section}`}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="gap-2 bg-violet-600 hover:bg-violet-700"
                  onClick={generateAiImage}
                  disabled={aiGenerating || !aiPrompt.trim()}
                  data-testid={`button-ai-submit-${section}`}
                >
                  {aiGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { setShowAiGenerator(false); setAiPrompt(""); setAiCaption(""); }}
                >
                  Cancel
                </Button>
              </div>
              {aiGenerating && (
                <p className="text-xs text-violet-600 italic">
                  Generating your clinical image... this may take 15-30 seconds.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
