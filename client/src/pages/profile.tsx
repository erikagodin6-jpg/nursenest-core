import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { User, BookOpen, FileText, Crown, LogOut, Printer, Trash2, Plus, Pencil, X, RotateCcw, ChevronLeft, ChevronRight, Layers, Mail, ShoppingBag, Download, AlertCircle, Eye, Lock } from "lucide-react";
import { LocaleLink } from "@/lib/LocaleLink";
import { useTrialStatus } from "@/hooks/use-trial-status";

import { useI18n } from "@/lib/i18n";
function formatNoteTitle(lessonId: string): string {

  if (lessonId.startsWith("anatomy-")) {
    return "Anatomy: " + lessonId.replace("anatomy-", "").split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }
  if (lessonId.startsWith("prenursing-")) {
    return "Pre-Nursing: " + lessonId.replace("prenursing-", "").split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }
  return lessonId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export default function ProfilePage() {
  const { user, logout, previewTier, setPreviewTier, effectiveTier, isAdmin } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { isOnTrial } = useTrialStatus();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [flashcardsLoading, setFlashcardsLoading] = useState(true);
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [editingCard, setEditingCard] = useState<any>(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newCategory, setNewCategory] = useState("My Cards");
  const [studyMode, setStudyMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [purchasesLoading, setPurchasesLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [emailSub, setEmailSub] = useState<any>(null);
  const [emailSubLoading, setEmailSubLoading] = useState(true);
  const [emailSubFreq, setEmailSubFreq] = useState("weekly");
  const [emailSubSaving, setEmailSubSaving] = useState(false);

  const FREQ_OPTIONS = [
    { value: "daily", label: "Once a day" },
    { value: "every_other_day", label: "Every other day" },
    { value: "twice_week", label: "Twice a week" },
    { value: "3x_week", label: "3 times a week" },
    { value: "weekly", label: "Once a week" },
    { value: "biweekly", label: "Every two weeks" },
    { value: "monthly", label: "Once a month" },
  ];

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetch(`/api/notes/${user.id}`)
      .then((r) => r.json())
      .then(setNotes)
      .catch(() => {})
      .finally(() => setLoading(false));
    fetch(`/api/user-flashcards/${user.id}`)
      .then((r) => r.json())
      .then(setFlashcards)
      .catch(() => {})
      .finally(() => setFlashcardsLoading(false));
    fetch(`/api/shop/my-purchases?userId=${user.id}`)
      .then((r) => r.json())
      .then((data) => setPurchases(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setPurchasesLoading(false));
    if (user.email) {
      fetch(`/api/subscribe/${encodeURIComponent(user.email)}`)
        .then((r) => r.ok ? r.json() : null)
        .then((data) => {
          if (data) {
            setEmailSub(data);
            setEmailSubFreq(data.frequency || "weekly");
          }
        })
        .catch(() => {})
        .finally(() => setEmailSubLoading(false));
    } else {
      setEmailSubLoading(false);
    }
  }, [user]);

  async function handleCreateFlashcard() {
    if (!user || !newQuestion.trim() || !newAnswer.trim()) return;
    const res = await fetch("/api/user-flashcards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, question: newQuestion, answer: newAnswer, category: newCategory }),
    });
    if (res.ok) {
      const card = await res.json();
      setFlashcards([card, ...flashcards]);
      setNewQuestion(""); setNewAnswer(""); setNewCategory("My Cards"); setShowCreateCard(false);
      toast({ title: "Flashcard created" });
    }
  }

  async function handleUpdateFlashcard() {
    if (!user || !editingCard) return;
    const res = await fetch(`/api/user-flashcards/${editingCard.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, question: newQuestion, answer: newAnswer, category: newCategory }),
    });
    if (res.ok) {
      const updated = await res.json();
      setFlashcards(flashcards.map(c => c.id === updated.id ? updated : c));
      setEditingCard(null); setNewQuestion(""); setNewAnswer(""); setNewCategory("My Cards");
      toast({ title: "Flashcard updated" });
    }
  }

  async function handleDeleteFlashcard(id: string) {
    if (!user) return;
    await fetch(`/api/user-flashcards/${id}?userId=${user.id}`, { method: "DELETE" });
    setFlashcards(flashcards.filter(c => c.id !== id));
    toast({ title: "Flashcard deleted" });
  }

  function startEdit(card: any) {
    setEditingCard(card);
    setNewQuestion(card.question);
    setNewAnswer(card.answer);
    setNewCategory(card.category || "My Cards");
    setShowCreateCard(true);
  }

  function handlePrint(note: any) {
    const title = formatNoteTitle(note.lessonId);
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(`
        <html><head><title>${title} - Notes</title>
        <style>body{font-family:sans-serif;padding:40px;max-width:800px;margin:auto;line-height:1.6}h1{color:#333}pre{white-space:pre-wrap;font-family:inherit}</style>
        </head><body><h1>${title} - My Notes</h1><pre>${note.content}</pre></body></html>
      `);
      w.document.close();
      w.print();
    }
  }

  async function handleDelete(noteId: string, lessonId: string) {
    if (!user) return;
    await fetch(`/api/notes/${user.id}/${lessonId}`, { method: "DELETE" });
    setNotes(notes.filter((n) => n.id !== noteId));
    toast({ title: "Note deleted" });
  }

  async function handleUpdateEmailFrequency() {
    if (!user?.email || !emailSub) return;
    setEmailSubSaving(true);
    try {
      const res = await fetch(`/api/subscribe/${encodeURIComponent(user.email)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frequency: emailSubFreq }),
      });
      if (res.ok) {
        const data = await res.json();
        setEmailSub(data.subscriber);
        toast({ title: "Email preferences updated" });
      }
    } catch {
      toast({ title: "Failed to update preferences", variant: "destructive" });
    } finally {
      setEmailSubSaving(false);
    }
  }

  async function handleUnsubscribeEmail() {
    if (!user?.email) return;
    setEmailSubSaving(true);
    try {
      await fetch(`/api/subscribe/${encodeURIComponent(user.email)}`, { method: "DELETE" });
      setEmailSub(null);
      toast({ title: "Unsubscribed from practice questions" });
    } catch {
      toast({ title: "Failed to unsubscribe", variant: "destructive" });
    } finally {
      setEmailSubSaving(false);
    }
  }

  function handleManageSubscription() {
    if (!user) return;
    fetch("/api/stripe/portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.url) window.location.href = data.url;
      });
  }

  async function handleDownload(purchaseId: string) {
    if (!user) return;
    setDownloadingId(purchaseId);
    try {
      const res = await fetch(`/api/shop/download/${purchaseId}?userId=${user.id}`);
      if (!res.ok) {
        const err = await res.json();
        toast({ title: "Download Error", description: err.error, variant: "destructive" });
        return;
      }
      const { downloadUrl, downloadsRemaining } = await res.json();
      setPurchases(purchases.map(p =>
        p.id === purchaseId
          ? { ...p, downloadCount: (p.downloadCount || 0) + 1 }
          : p
      ));
      if (downloadUrl) {
        window.open(downloadUrl, "_blank");
      }
      toast({ title: `Download started. ${downloadsRemaining} downloads remaining.` });
    } catch {
      toast({ title: "Download failed", variant: "destructive" });
    } finally {
      setDownloadingId(null);
    }
  }

  if (!user) return null;

  const tierLabels: Record<string, string> = { rpn: "RPN/LVN", rn: "RN/NCLEX", np: "NP Advanced", free: "Free" };

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl sm:text-4xl font-bold">{t("pages.profile.myProfile")}</h1>
          <Button variant="outline" onClick={() => { logout(); navigate("/"); }} data-testid="button-logout">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-primary" /> Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><span className="text-gray-500">{t("pages.profile.username")}</span> <strong>{user.username}</strong></p>
              <p><span className="text-gray-500">{t("pages.profile.email")}</span> <strong>{user.email || "Not set"}</strong></p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Crown className="w-5 h-5 text-amber-500" /> Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p><span className="text-gray-500">{t("pages.profile.tier")}</span> <strong className="text-primary">{tierLabels[user.tier] || user.tier}</strong></p>
              <p><span className="text-gray-500">{t("pages.profile.status")}</span>{" "}
                <span className={user.subscriptionStatus === "active" ? "text-emerald-600 font-bold" : "text-gray-400"}>
                  {user.subscriptionStatus === "active" ? "Active" : "Inactive"}
                </span>
              </p>
              {user.subscriptionStatus === "active" && (
                <Button variant="outline" size="sm" onClick={handleManageSubscription} data-testid="button-manage-subscription">
                  Manage Subscription
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {isAdmin && (
          <Card className="border-none shadow-sm bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200" data-testid="card-tier-preview">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Eye className="w-5 h-5 text-amber-600" /> View As Different Tier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-gray-500">{t("pages.profile.previewTheAppAsA")}</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: null, label: "Admin (Default)", desc: "Full access", color: "bg-purple-600" },
                  { id: "free", label: "Free", desc: "Basic access", color: "bg-gray-500" },
                  { id: "rpn", label: "RPN/LVN", desc: "Practical nurse tier", color: "bg-blue-500" },
                  { id: "rn", label: "RN/NCLEX", desc: "Registered nurse tier", color: "bg-emerald-500" },
                  { id: "np", label: "NP Advanced", desc: "Nurse practitioner", color: "bg-amber-500" },
                ].map(t => {
                  const isActive = previewTier === t.id || (!previewTier && t.id === null);
                  return (
                    <button
                      key={t.id || "admin"}
                      onClick={() => {
                        setPreviewTier(t.id);
                        toast({ title: t.id ? `Viewing as ${t.label}` : "Restored admin view", description: t.desc });
                      }}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition text-left ${isActive ? "border-amber-500 bg-white shadow-sm ring-1 ring-amber-200" : "border-gray-200 bg-white/60 hover:border-gray-300"}`}
                      data-testid={`button-preview-tier-${t.id || "admin"}`}
                    >
                      <div className={`w-3 h-3 rounded-full ${t.color}`} />
                      <div>
                        <span className="text-sm font-semibold text-gray-800 block">{t.label}</span>
                        <span className="text-[10px] text-gray-400">{t.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {previewTier && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-100 border border-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-800">
                    You are currently viewing as <strong>{previewTier.toUpperCase()}</strong>. Paywalls and feature limits are active. Click "Admin (Default)" to restore full access.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="border-none shadow-sm" data-testid="card-my-purchases">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-500" /> My Purchases
              <span className="text-sm font-normal text-gray-400 ml-2">{purchases.length} items</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {purchasesLoading ? (
              <p className="text-gray-500 text-sm" data-testid="text-purchases-loading">{t("pages.profile.loadingPurchases")}</p>
            ) : purchases.length === 0 ? (
              <div className="text-center py-6 space-y-3">
                <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto" />
                <p className="text-gray-500" data-testid="text-purchases-empty">{t("pages.profile.noPurchasesYetBrowseThe")}</p>
                <LocaleLink href="/shop">
                  <Button variant="outline" size="sm" data-testid="button-browse-store">
                    Browse Store
                  </Button>
                </LocaleLink>
              </div>
            ) : (
              <div className="space-y-4">
                {purchases.map((purchase: any) => {
                  const product = purchase.product;
                  const downloadsUsed = purchase.downloadCount || 0;
                  const maxDownloads = purchase.maxDownloads || 5;
                  const remaining = maxDownloads - downloadsUsed;
                  const limitReached = remaining <= 0;
                  return (
                    <div key={purchase.id} className="border rounded-xl p-4 flex items-start gap-4" data-testid={`purchase-item-${purchase.id}`}>
                      {product?.coverImageUrl && (
                        <img src={product.coverImageUrl} alt={`${product.title} - NurseNest study resource`} title={product.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" loading="lazy" />
                      )}
                      <div className="flex-1 min-w-0">
                        <LocaleLink href={`/shop/${product?.slug}`}>
                          <h3 className="font-semibold text-gray-900 hover:text-primary transition-colors truncate" data-testid={`text-purchase-title-${purchase.id}`}>
                            {product?.title || "Product"}
                          </h3>
                        </LocaleLink>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Purchased {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {limitReached ? (
                            <span className="text-xs text-red-500 flex items-center gap-1" data-testid={`text-limit-reached-${purchase.id}`}>
                              <AlertCircle className="w-3 h-3" /> Download limit reached
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500" data-testid={`text-downloads-remaining-${purchase.id}`}>
                              {remaining} of {maxDownloads} downloads remaining
                            </span>
                          )}
                        </div>
                      </div>
                      {isOnTrial ? (
                        <Button size="sm" variant="outline" disabled data-testid={`button-download-trial-locked-${purchase.id}`}>
                          <Lock className="w-4 h-4 mr-1" />
                          Trial - Upgrade to Download
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant={limitReached ? "outline" : "default"}
                          disabled={limitReached || downloadingId === purchase.id}
                          onClick={() => handleDownload(purchase.id)}
                          data-testid={`button-download-${purchase.id}`}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          {downloadingId === purchase.id ? "..." : "Download"}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm" data-testid="card-email-subscription">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="w-5 h-5 text-primary" /> Practice Question Emails
            </CardTitle>
          </CardHeader>
          <CardContent>
            {emailSubLoading ? (
              <p className="text-gray-500 text-sm">{t("pages.profile.loading")}</p>
            ) : !user?.email ? (
              <p className="text-gray-500 text-sm">{t("pages.profile.addAnEmailToYour")}</p>
            ) : !emailSub ? (
              <p className="text-gray-500 text-sm">{t("pages.profile.youAreNotSubscribedTo")}</p>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Subscribed as <strong>{emailSub.email}</strong>
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <label className="text-sm text-gray-500">{t("pages.profile.deliveryFrequency")}</label>
                  <select
                    value={emailSubFreq}
                    onChange={(e) => setEmailSubFreq(e.target.value)}
                    className="h-9 px-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm bg-white"
                    data-testid="select-profile-frequency"
                  >
                    {FREQ_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <Button
                    size="sm"
                    onClick={handleUpdateEmailFrequency}
                    disabled={emailSubSaving || emailSubFreq === emailSub.frequency}
                    data-testid="button-update-frequency"
                  >
                    {emailSubSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
                <div className="pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={handleUnsubscribeEmail}
                    disabled={emailSubSaving}
                    data-testid="button-unsubscribe-email"
                  >
                    Unsubscribe from practice question emails
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" /> My Flashcards
              <span className="text-sm font-normal text-gray-400 ml-2">{flashcards.length} cards</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {studyMode && flashcards.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{currentIndex + 1} / {flashcards.length}</span>
                  <Button variant="outline" size="sm" onClick={() => { setStudyMode(false); setCurrentIndex(0); setFlipped(false); }} data-testid="button-exit-study">
                    <X className="w-4 h-4 mr-1" /> Exit Study
                  </Button>
                </div>
                <div
                  className="min-h-[200px] border-2 rounded-2xl p-8 flex items-center justify-center cursor-pointer transition-all hover:shadow-md bg-gradient-to-br from-white to-gray-50"
                  onClick={() => setFlipped(!flipped)}
                  data-testid="flashcard-study-card"
                >
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-2">{flipped ? "ANSWER" : "QUESTION"}</p>
                    <p className="text-lg font-medium">{flipped ? flashcards[currentIndex]?.answer : flashcards[currentIndex]?.question}</p>
                    {!flipped && <p className="text-xs text-gray-400 mt-4">{t("pages.profile.tapToRevealAnswer")}</p>}
                  </div>
                </div>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" size="sm" onClick={() => { setCurrentIndex(Math.max(0, currentIndex - 1)); setFlipped(false); }} disabled={currentIndex === 0} data-testid="button-prev-card">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { setFlipped(false); }} data-testid="button-flip-card">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { setCurrentIndex(Math.min(flashcards.length - 1, currentIndex + 1)); setFlipped(false); }} disabled={currentIndex === flashcards.length - 1} data-testid="button-next-card">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => { setShowCreateCard(!showCreateCard); setEditingCard(null); setNewQuestion(""); setNewAnswer(""); setNewCategory("My Cards"); }} data-testid="button-create-flashcard">
                    <Plus className="w-4 h-4 mr-1" /> New Card
                  </Button>
                  {flashcards.length > 0 && (
                    <Button variant="outline" size="sm" onClick={() => { setStudyMode(true); setCurrentIndex(0); setFlipped(false); }} data-testid="button-study-flashcards">
                      <BookOpen className="w-4 h-4 mr-1" /> Study ({flashcards.length})
                    </Button>
                  )}
                </div>

                {showCreateCard && (
                  <div className="border rounded-xl p-4 space-y-3 bg-gray-50">
                    <Input placeholder={t("pages.profile.question")} value={newQuestion} onChange={e => setNewQuestion(e.target.value)} data-testid="input-flashcard-question" />
                    <Textarea placeholder={t("pages.profile.answer")} value={newAnswer} onChange={e => setNewAnswer(e.target.value)} rows={3} data-testid="input-flashcard-answer" />
                    <Input placeholder={t("pages.profile.categoryOptional")} value={newCategory} onChange={e => setNewCategory(e.target.value)} data-testid="input-flashcard-category" />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={editingCard ? handleUpdateFlashcard : handleCreateFlashcard} disabled={!newQuestion.trim() || !newAnswer.trim()} data-testid="button-save-flashcard">
                        {editingCard ? "Update" : "Save"}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { setShowCreateCard(false); setEditingCard(null); }} data-testid="button-cancel-flashcard">
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {flashcardsLoading ? (
                  <p className="text-gray-500">{t("pages.profile.loadingFlashcards")}</p>
                ) : flashcards.length === 0 && !showCreateCard ? (
                  <p className="text-gray-500">{t("pages.profile.noFlashcardsYetCreateYour")}</p>
                ) : (
                  <div className="space-y-3">
                    {flashcards.map(card => (
                      <div key={card.id} className="border rounded-xl p-4 space-y-1" data-testid={`flashcard-item-${card.id}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{card.question}</p>
                            <p className="text-sm text-gray-600 mt-1">{card.answer}</p>
                            {card.category && <p className="text-xs text-gray-400 mt-1">{card.category}</p>}
                          </div>
                          <div className="flex gap-1 ml-2 flex-shrink-0">
                            <Button variant="ghost" size="sm" onClick={() => startEdit(card)} data-testid={`button-edit-flashcard-${card.id}`}>
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteFlashcard(card.id)} data-testid={`button-delete-flashcard-${card.id}`}>
                              <Trash2 className="w-3 h-3 text-red-400" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> My Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-500">{t("pages.profile.loadingNotes")}</p>
            ) : notes.length === 0 ? (
              <p className="text-gray-500">{t("pages.profile.noNotesYetTakeNotes")}</p>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => {
                  return (
                    <div key={note.id} className="border rounded-xl p-4 space-y-2" data-testid={`note-item-${note.id}`}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">{formatNoteTitle(note.lessonId)}</h3>
                        <div className="flex gap-2">
                          {!isOnTrial && (
                            <Button variant="ghost" size="sm" onClick={() => handlePrint(note)} data-testid={`button-print-note-${note.id}`}>
                              <Printer className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(note.id, note.lessonId)} data-testid={`button-delete-note-${note.id}`}>
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-3">{note.content}</p>
                      <p className="text-xs text-gray-400">Last updated: {new Date(note.updatedAt).toLocaleDateString()}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
