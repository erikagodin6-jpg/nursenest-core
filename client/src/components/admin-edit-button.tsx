import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, ExternalLink, Eye, EyeOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InlineEditorPanel, QuickCreatePanel } from "@/components/inline-editor";

interface AdminEditButtonProps {
  editId?: string;
  editSlug?: string;
  pageName?: string;
  className?: string;
  variant?: "floating" | "inline";
  defaultTier?: string;
  defaultCategory?: string;
  onContentUpdated?: () => void;
}

function getCredentials() {
  try {
    const stored = localStorage.getItem("nursenest-credentials");
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

export function AdminEditButton({
  editId,
  editSlug,
  pageName,
  className = "",
  variant = "floating",
  defaultTier = "free",
  defaultCategory,
  onContentUpdated,
}: AdminEditButtonProps) {
  const { isAdmin, setPreviewTier, previewTier } = useAuth();
  const [, setLocation] = useLocation();
  const [showInlineEditor, setShowInlineEditor] = useState(false);
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [contentItem, setContentItem] = useState<any>(null);
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    if (!isAdmin || (!editId && !editSlug)) return;
    loadContent();
  }, [editId, editSlug, isAdmin]);

  const loadContent = async () => {
    const creds = getCredentials();
    if (!creds) return;
    setLoadingContent(true);
    try {
      const url = editId
        ? `/api/content/${editId}?username=${encodeURIComponent(creds.username)}&password=${encodeURIComponent(creds.password)}`
        : `/api/content/slug/${editSlug}`;
      const res = await fetch(url);
      if (res.ok) {
        setContentItem(await res.json());
      }
    } catch {}
    setLoadingContent(false);
  };

  if (!isAdmin) return null;

  const editUrl = editId
    ? `/content-editor?edit=${editId}`
    : editSlug
      ? `/content-editor?slug=${editSlug}`
      : "/content-editor";

  const isPreviewingAsUser = previewTier !== null;

  if (variant === "inline") {
    return (
      <>
        <div className={`flex items-center gap-2 ${className}`}>
          {(editId || contentItem) && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-full text-xs"
              onClick={() => setShowInlineEditor(true)}
              data-testid="button-admin-edit-inline"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit Inline
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-full text-xs"
            onClick={() => setShowCreatePanel(true)}
            data-testid="button-admin-add-inline"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Content
          </Button>
        </div>

        {showInlineEditor && contentItem && (
          <InlineEditorPanel
            contentItem={contentItem}
            onClose={() => setShowInlineEditor(false)}
            onSaved={() => {
              setShowInlineEditor(false);
              loadContent();
              onContentUpdated?.();
            }}
          />
        )}

        {showCreatePanel && (
          <QuickCreatePanel
            pageName={pageName || "page"}
            defaultTier={defaultTier}
            defaultCategory={defaultCategory}
            onClose={() => setShowCreatePanel(false)}
            onCreated={(item) => {
              setShowCreatePanel(false);
              setContentItem(item);
              onContentUpdated?.();
            }}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className={`fixed bottom-6 right-6 z-50 ${className}`} data-testid="admin-edit-fab">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="rounded-full w-12 h-12 shadow-lg bg-primary text-white hover:brightness-110"
              data-testid="button-admin-fab"
            >
              <Pencil className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            {contentItem && (
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={() => setShowInlineEditor(true)}
                data-testid="menu-admin-inline-edit"
              >
                <Pencil className="w-4 h-4" />
                Edit Inline
              </DropdownMenuItem>
            )}
            {(editId || editSlug) && (
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={() => setLocation(editUrl)}
                data-testid="menu-admin-edit-page"
              >
                <ExternalLink className="w-4 h-4" />
                Open in Editor
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="cursor-pointer gap-2"
              onClick={() => setShowCreatePanel(true)}
              data-testid="menu-admin-new-content"
            >
              <Plus className="w-4 h-4" />
              New Content
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer gap-2"
              onClick={() => setPreviewTier(isPreviewingAsUser ? null : "free")}
              data-testid="menu-admin-preview-user"
            >
              {isPreviewingAsUser ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isPreviewingAsUser ? "Exit User Preview" : "View as Free User"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer gap-2"
              onClick={() => setLocation("/admin")}
              data-testid="menu-admin-dashboard"
            >
              <ExternalLink className="w-4 h-4" />
              Admin Dashboard
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isPreviewingAsUser && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white text-center py-1.5 text-sm font-medium shadow-md" data-testid="banner-preview-mode">
          Viewing as: {previewTier?.toUpperCase() || "FREE"} user
          <button
            className="ml-4 underline hover:no-underline text-xs"
            onClick={() => setPreviewTier(null)}
          >
            Exit Preview
          </button>
        </div>
      )}

      {showInlineEditor && contentItem && (
        <InlineEditorPanel
          contentItem={contentItem}
          onClose={() => setShowInlineEditor(false)}
          onSaved={() => {
            setShowInlineEditor(false);
            loadContent();
            onContentUpdated?.();
          }}
        />
      )}

      {showCreatePanel && (
        <QuickCreatePanel
          pageName={pageName || "page"}
          defaultTier={defaultTier}
          defaultCategory={defaultCategory}
          onClose={() => setShowCreatePanel(false)}
          onCreated={(item) => {
            setShowCreatePanel(false);
            setContentItem(item);
            onContentUpdated?.();
          }}
        />
      )}
    </>
  );
}
