import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n";
import {
  Sparkles, Send, Loader2, X, Wand2, FileText,
  Search, Zap, MessageSquare, BookOpen, HelpCircle,
  ChevronDown, ChevronUp, Globe
} from "lucide-react";

function getCredentials() {

  try {
    const stored = localStorage.getItem("nursenest-credentials");
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

interface AIAssistantProps {
  contentTitle?: string;
  contentSummary?: string;
  contentTier?: string;
  contentCategory?: string;
  contentBlocks?: any[];
  onBlocksGenerated?: (blocks: any[]) => void;
  onSeoGenerated?: (seo: { seoTitle: string; seoDescription: string; seoKeywords: string[]; primaryKeyword: string; secondaryKeywords: string[] }) => void;
  compact?: boolean;
}

type AIMode = "generate" | "improve" | "expand" | "simplify" | "quiz" | "seo" | "chat";

const MODE_CONFIG: Record<AIMode, { label: string; icon: any; description: string; color: string }> = {
  generate: { label: "Generate", icon: Sparkles, description: "Create new content from a topic", color: "text-purple-600" },
  improve: { label: "Improve", icon: Wand2, description: "Enhance existing content quality", color: "text-blue-600" },
  expand: { label: "Expand", icon: BookOpen, description: "Add more detail and depth", color: "text-emerald-600" },
  simplify: { label: "Simplify", icon: FileText, description: "Make content more accessible", color: "text-amber-600" },
  quiz: { label: "Quiz", icon: HelpCircle, description: "Generate NCLEX-style questions", color: "text-rose-600" },
  seo: { label: "SEO", icon: Globe, description: "Generate SEO metadata", color: "text-indigo-600" },
  chat: { label: "Ask AI", icon: MessageSquare, description: "Ask a question about this content", color: "text-gray-600" },
};

export function AIAssistant({
  contentTitle,
  contentSummary,
  contentTier,
  contentCategory,
  contentBlocks,
  onBlocksGenerated,
  onSeoGenerated,
  compact = false,
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AIMode>("generate");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chatReply, setChatReply] = useState("");
  const [generatedBlocks, setGeneratedBlocks] = useState<any[] | null>(null);

  const handleGenerate = async () => {
    const creds = getCredentials();
    if (!creds) {
      setError("Admin credentials not found.");
      return;
    }
    if (!prompt.trim() && mode !== "seo") {
      setError("Please enter a prompt.");
      return;
    }
    setLoading(true);
    setError("");
    setChatReply("");
    setGeneratedBlocks(null);

    try {
      if (mode === "seo") {
        const res = await fetch("/api/ai/generate-seo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: creds.username,
            password: creds.password,
            title: contentTitle || prompt,
            summary: contentSummary,
            content: contentBlocks,
            tier: contentTier,
            category: contentCategory,
          }),
        });
        if (!res.ok) throw new Error((await res.json()).error || "SEO generation failed");
        const seo = await res.json();
        onSeoGenerated?.(seo);
        setChatReply(`SEO generated:\nTitle: ${seo.seoTitle || "—"}\nDescription: ${seo.seoDescription || "—"}\nKeywords: ${(seo.seoKeywords || []).join(", ")}`);
      } else if (mode === "chat") {
        const res = await fetch("/api/ai/chat-assist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: creds.username,
            password: creds.password,
            message: prompt,
            contentContext: contentBlocks ? { title: contentTitle, blocks: contentBlocks.slice(0, 3) } : null,
          }),
        });
        if (!res.ok) throw new Error((await res.json()).error || "Chat failed");
        const data = await res.json();
        setChatReply(data.reply);
      } else {
        const res = await fetch("/api/ai/generate-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: creds.username,
            password: creds.password,
            prompt,
            context: (mode === "improve" || mode === "expand" || mode === "simplify") ? contentBlocks : undefined,
            mode,
          }),
        });
        if (!res.ok) throw new Error((await res.json()).error || "Content generation failed");
        const data = await res.json();
        setGeneratedBlocks(data.blocks);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const applyBlocks = () => {
    if (generatedBlocks && onBlocksGenerated) {
      onBlocksGenerated(generatedBlocks);
      setGeneratedBlocks(null);
      setPrompt("");
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
        data-testid="button-ai-assistant-open"
      >
        <Sparkles className="w-3.5 h-3.5" />
        AI Assistant
      </button>
    );
  }

  return (
    <div className={`bg-white border border-purple-200 rounded-xl shadow-lg overflow-hidden ${compact ? "w-full" : ""}`} data-testid="ai-assistant-panel">
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-semibold text-purple-900">{t("components.aiAssistant.aiAssistant")}</span>
        </div>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setIsOpen(false)} data-testid="button-ai-close">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-3 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {(Object.entries(MODE_CONFIG) as [AIMode, typeof MODE_CONFIG[AIMode]][]).map(([key, config]) => (
            <button
              key={key}
              onClick={() => { setMode(key); setError(""); setChatReply(""); setGeneratedBlocks(null); }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === key
                  ? "bg-purple-100 text-purple-800 ring-1 ring-purple-300"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
              data-testid={`button-ai-mode-${key}`}
            >
              <config.icon className="w-3 h-3" />
              {config.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-500">{MODE_CONFIG[mode].description}</p>

        {mode !== "seo" && (
          <div className="flex gap-2">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                mode === "chat" ? "Ask a question..."
                : mode === "generate" ? "Enter topic (e.g., Heart Failure Management)..."
                : mode === "quiz" ? "Enter topic for quiz questions..."
                : "Describe what to change..."
              }
              className="text-sm h-9"
              onKeyDown={(e) => e.key === "Enter" && !loading && handleGenerate()}
              data-testid="input-ai-prompt"
            />
            <Button
              onClick={handleGenerate}
              disabled={loading}
              size="sm"
              className="h-9 px-3 bg-purple-600 hover:bg-purple-700 shrink-0"
              data-testid="button-ai-send"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        )}

        {mode === "seo" && (
          <Button
            onClick={handleGenerate}
            disabled={loading}
            size="sm"
            className="w-full h-9 bg-indigo-600 hover:bg-indigo-700 gap-2"
            data-testid="button-ai-generate-seo"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
            Generate SEO from Current Content
          </Button>
        )}

        {error && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">{error}</div>
        )}

        {chatReply && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 whitespace-pre-wrap max-h-48 overflow-y-auto" data-testid="text-ai-reply">
            {chatReply}
          </div>
        )}

        {generatedBlocks && generatedBlocks.length > 0 && (
          <div className="space-y-2">
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg max-h-48 overflow-y-auto">
              <p className="text-xs font-semibold text-purple-700 mb-2">
                Generated {generatedBlocks.length} content block{generatedBlocks.length > 1 ? "s" : ""}:
              </p>
              {generatedBlocks.map((block, i) => (
                <div key={i} className="text-xs text-gray-700 mb-1">
                  <span className="font-mono text-purple-600">[{block.type}]</span>{" "}
                  {(block.content || "").substring(0, 100)}
                  {(block.content || "").length > 100 ? "..." : ""}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={applyBlocks}
                size="sm"
                className="flex-1 h-8 bg-emerald-600 hover:bg-emerald-700 text-xs gap-1"
                data-testid="button-ai-apply"
              >
                <Zap className="w-3 h-3" />
                Apply to Content
              </Button>
              <Button
                onClick={() => setGeneratedBlocks(null)}
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                data-testid="button-ai-discard"
              >
                Discard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AIAssistantFAB(props: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
          data-testid="button-ai-fab"
        >
          <Sparkles className="w-4 h-4" />
          AI Assistant
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 w-96 max-w-[calc(100vw-3rem)]">
      <div className="bg-white border border-purple-200 rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-900">{t("components.aiAssistant.aiAssistant2")}</span>
          </div>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          <AIAssistant {...props} compact />
        </div>
      </div>
    </div>
  );
}
