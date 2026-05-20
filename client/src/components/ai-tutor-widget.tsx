import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  GraduationCap, Send, Loader2, X, MessageCircle,
  Lightbulb, BookOpen, Brain, Target, Lock, ArrowRight, Sparkles
} from "lucide-react";

function getUserAuthHeaders(): Record<string, string> {
  try {
    const token = localStorage.getItem("nursenest-user-token");
    if (token) return { "x-user-token": token };
  } catch {}
  try {
    const adminToken = localStorage.getItem("nn_admin_access_token");
    const expiresAt = localStorage.getItem("nn_admin_expires_at");
    if (adminToken && (!expiresAt || Date.now() < Number(expiresAt))) {
      return { "Authorization": `Bearer ${adminToken}` };
    }
  } catch {}
  return {};
}

export type TutorContextType = "practice_question" | "flashcard" | "study_guide" | "mock_exam" | "general";

export interface TutorContext {
  type: TutorContextType;
  id?: string;
  data?: Record<string, any>;
  title?: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const QUICK_ACTIONS = [
  { key: "walk_through", icon: Target, labelKey: "tutor.walkThrough", fallback: "Walk me through this" },
  { key: "explain_simply", icon: Lightbulb, labelKey: "tutor.explainSimply", fallback: "Explain simply" },
  { key: "mnemonic", icon: Brain, labelKey: "tutor.giveMnemonic", fallback: "Give me a mnemonic" },
  { key: "study_next", icon: BookOpen, labelKey: "tutor.studyNext", fallback: "What should I study next?" },
];

const QUICK_ACTION_PROMPTS: Record<string, string> = {
  walk_through: "Please walk me through this step by step. Explain the reasoning for each answer choice.",
  explain_simply: "Can you explain this concept in simple, easy-to-understand terms?",
  mnemonic: "Can you give me a mnemonic or memory trick to remember this concept?",
  study_next: "Based on this topic, what should I study next to strengthen my understanding?",
};

interface AITutorWidgetProps {
  context?: TutorContext;
}

export function AITutorWidget({ context }: AITutorWidgetProps) {
  const { user } = useAuth();
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [usageInfo, setUsageInfo] = useState<{ usedToday: number; dailyLimit: number | null; isPremium: boolean; remaining: number | null } | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && user) {
      fetchUsage();
    }
  }, [isOpen, user]);

  const fetchUsage = async () => {
    try {
      const res = await fetch("/api/tutor/usage", { headers: getUserAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setUsageInfo(data);
        setLimitReached(!data.isPremium && data.remaining !== null && data.remaining <= 0);
      }
    } catch {}
  };

  const createConversation = async (): Promise<number | null> => {
    try {
      const res = await fetch("/api/tutor/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getUserAuthHeaders() },
        body: JSON.stringify({
          contextType: context?.type || "general",
          contextId: context?.id || null,
          language: localStorage.getItem("nursenest-language") || "en",
          title: context?.title || "AI Tutor Chat",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setConversationId(data.id);
        return data.id;
      }
    } catch {}
    return null;
  };

  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || loading || !user) return;

    setError("");
    const trimmed = messageContent.trim();
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);

    let convId = conversationId;
    if (!convId) {
      convId = await createConversation();
      if (!convId) {
        setError(t("tutor.errorConversation") || "Failed to create conversation");
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch(`/api/tutor/conversations/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getUserAuthHeaders() },
        body: JSON.stringify({
          content: trimmed,
          contextType: context?.type || "general",
          contextData: context?.data || {},
          language: localStorage.getItem("nursenest-language") || "en",
        }),
      });

      if (res.status === 429) {
        const data = await res.json();
        setLimitReached(true);
        setMessages((prev) => prev.slice(0, -1));
        setError(data.error || "Daily limit reached");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send message");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let assistantMessage = "";
      let buffer = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.content) {
                assistantMessage += parsed.content;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "assistant", content: assistantMessage };
                  return updated;
                });
              }
              if (parsed.error) {
                setError(parsed.error);
              }
            } catch {}
          }
        }
      }

      fetchUsage();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setMessages((prev) => {
        if (prev.length > 0 && prev[prev.length - 1].role === "assistant" && prev[prev.length - 1].content === "") {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (key: string) => {
    const prompt = QUICK_ACTION_PROMPTS[key] || key;
    sendMessage(prompt);
  };

  const handleNewChat = () => {
    setMessages([]);
    setConversationId(null);
    setError("");
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
          data-testid="button-ai-tutor-open"
        >
          <GraduationCap className="w-5 h-5" />
          <span className="hidden sm:inline">{t("tutor.title") || "AI Tutor"}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] flex flex-col" data-testid="ai-tutor-panel">
      <div className="bg-white border border-teal-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-teal-100 shrink-0">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-teal-600" />
            <span className="text-sm font-semibold text-teal-900">{t("tutor.title") || "AI Tutor"}</span>
            {context?.type && context.type !== "general" && (
              <span className="text-[10px] px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full font-medium">
                {context.type.replace("_", " ")}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-teal-600 hover:text-teal-800" onClick={handleNewChat} data-testid="button-tutor-new-chat">
                New
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setIsOpen(false)} data-testid="button-tutor-close">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!user ? (
          <div className="p-6 text-center">
            <Lock className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700 mb-2">{t("tutor.loginRequired") || "Sign in to use the AI Tutor"}</p>
            <p className="text-xs text-gray-500 mb-4">{t("tutor.loginDesc") || "Get personalized help with your exam preparation"}</p>
            <Button
              onClick={() => window.location.assign("/login")}
              className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl"
              data-testid="button-tutor-login"
            >
              Sign In <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        ) : limitReached ? (
          <div className="p-6 text-center">
            <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700 mb-2">{t("tutor.limitReached") || "Daily limit reached"}</p>
            <p className="text-xs text-gray-500 mb-4">
              {t("tutor.limitDesc") || "You've used all 5 free tutor questions for today. Upgrade for unlimited access."}
            </p>
            <Button
              onClick={() => window.location.assign("/pricing")}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-white rounded-xl"
              data-testid="button-tutor-upgrade"
            >
              Upgrade for Unlimited <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[200px]" data-testid="tutor-messages-container">
              {messages.length === 0 && (
                <div className="text-center py-6">
                  <GraduationCap className="w-10 h-10 text-teal-200 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-700 mb-1">{t("tutor.welcomeTitle") || "How can I help you study?"}</p>
                  <p className="text-xs text-gray-500 mb-4">{t("tutor.welcomeDesc") || "Ask me anything about your current topic, or use the quick actions below."}</p>

                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_ACTIONS.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.key}
                          onClick={() => handleQuickAction(action.key)}
                          className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 text-left text-xs text-gray-700 hover:bg-teal-50 hover:border-teal-200 transition-all"
                          data-testid={`button-tutor-quick-${action.key}`}
                        >
                          <Icon className="w-4 h-4 text-teal-500 shrink-0" />
                          <span>{t(action.labelKey) || action.fallback}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  data-testid={`tutor-message-${msg.role}-${i}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-teal-600 text-white rounded-br-md"
                        : "bg-gray-100 text-gray-800 rounded-bl-md"
                    }`}
                  >
                    {msg.content || (loading && i === messages.length - 1 ? (
                      <span className="flex items-center gap-2 text-gray-400">
                        <Loader2 className="w-3 h-3 animate-spin" /> Thinking...
                      </span>
                    ) : "")}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {error && (
              <div className="px-4 pb-2">
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs" data-testid="text-tutor-error">
                  {error}
                </div>
              </div>
            )}

            {usageInfo && !usageInfo.isPremium && usageInfo.remaining !== null && (
              <div className="px-4 pb-1">
                <p className="text-[10px] text-gray-400 text-center" data-testid="text-tutor-usage">
                  {usageInfo.remaining} of {usageInfo.dailyLimit} free questions remaining today
                </p>
              </div>
            )}

            <div className="px-4 pb-4 pt-2 border-t border-gray-100 shrink-0">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && !loading && sendMessage(input)}
                  placeholder={t("tutor.inputPlaceholder") || "Ask a question..."}
                  className="flex-1 px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300"
                  disabled={loading}
                  data-testid="input-tutor-message"
                />
                <Button
                  onClick={() => sendMessage(input)}
                  disabled={loading || !input.trim()}
                  size="sm"
                  className="h-10 w-10 p-0 bg-teal-600 hover:bg-teal-700 rounded-xl shrink-0"
                  data-testid="button-tutor-send"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function TutorCTA({ context, label }: { context: TutorContext; label?: string }) {
  const [showWidget, setShowWidget] = useState(false);
  const { t } = useI18n();

  if (showWidget) {
    return <AITutorWidget context={context} />;
  }

  return (
    <button
      onClick={() => setShowWidget(true)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors"
      data-testid="button-tutor-cta"
    >
      <MessageCircle className="w-3.5 h-3.5" />
      {label || t("tutor.needHelp") || "Need help? Ask the AI Tutor"}
    </button>
  );
}
