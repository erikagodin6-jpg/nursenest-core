import { useState } from "react";
import { Mail, CheckCircle, Loader2, ArrowLeft, Bell, BellOff, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

import { useI18n } from "@/lib/i18n";
type SubscriptionCategory = "exam_prep" | "new_grad_tips" | "job_alerts" | "general";

const CATEGORY_INFO: Record<SubscriptionCategory, { label: string; description: string; icon: string }> = {
  exam_prep: {
    label: "Exam Prep Tips",
    description: "NCLEX strategies, practice questions, study schedules, and exam day tips.",
    icon: "📝",
  },
  new_grad_tips: {
    label: "New Grad Survival Tips",
    description: "First-year advice, clinical confidence builders, preceptor tips, and workplace navigation.",
    icon: "🎓",
  },
  job_alerts: {
    label: "Healthcare Job Alerts",
    description: "Curated job openings, resume tips, interview prep, and salary negotiation advice.",
    icon: "💼",
  },
  general: {
    label: "General Updates",
    description: "Platform news, new features, community highlights, and educational content.",
    icon: "📬",
  },
};

const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Every 2 Weeks" },
  { value: "monthly", label: "Monthly" },
];

interface SubscriberData {
  email: string;
  categories: SubscriptionCategory[];
  frequency: string;
}

export default function EmailPreferencesPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [lookupStatus, setLookupStatus] = useState<"idle" | "loading" | "found" | "not_found" | "error">("idle");
  const [subscriber, setSubscriber] = useState<SubscriberData | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<SubscriptionCategory[]>([]);
  const [frequency, setFrequency] = useState("weekly");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [unsubscribeStatus, setUnsubscribeStatus] = useState<"idle" | "confirming" | "done">("idle");
  const { toast } = useToast();

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) return;

    setLookupStatus("loading");
    try {
      const res = await fetch(`/api/subscribe/${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const data = await res.json();
        setSubscriber(data);
        setSelectedCategories(data.categories || ["general"]);
        setFrequency(data.frequency || "weekly");
        setLookupStatus("found");
      } else if (res.status === 404) {
        setLookupStatus("not_found");
      } else {
        setLookupStatus("error");
      }
    } catch {
      setLookupStatus("error");
    }
  };

  const toggleCategory = (cat: SubscriptionCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSave = async () => {
    if (!subscriber) return;
    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/subscribe/${encodeURIComponent(subscriber.email)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categories: selectedCategories.length > 0 ? selectedCategories : ["general"],
          frequency,
        }),
      });
      if (res.ok) {
        setSaveStatus("saved");
        toast({ title: "Preferences saved", description: "Your newsletter preferences have been updated." });
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
        toast({ title: "Error", description: "Failed to save preferences. Please try again.", variant: "destructive" });
      }
    } catch {
      setSaveStatus("error");
      toast({ title: "Error", description: "Failed to save preferences. Please try again.", variant: "destructive" });
    }
  };

  const handleUnsubscribe = async () => {
    if (!subscriber) return;
    try {
      const res = await fetch(`/api/subscribe/${encodeURIComponent(subscriber.email)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUnsubscribeStatus("done");
        toast({ title: "Unsubscribed", description: "You have been unsubscribed from all newsletters." });
      }
    } catch {
      toast({ title: "Error", description: "Failed to unsubscribe. Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-8" data-testid="link-back-home">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </a>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="text-preferences-title">
            Email Preferences
          </h1>
          <p className="text-gray-600" data-testid="text-preferences-subtitle">
            Manage your newsletter subscriptions and choose the content that matters to you.
          </p>
        </div>

        {lookupStatus !== "found" && unsubscribeStatus !== "done" && (
          <Card className="mb-8" data-testid="card-email-lookup">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Find Your Subscription
              </CardTitle>
              <CardDescription>
                Enter your email address to manage your newsletter preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLookup} className="flex gap-3">
                <Input
                  type="email"
                  placeholder={t("pages.emailPreferences.youremailcom")}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setLookupStatus("idle"); }}
                  className="h-11"
                  required
                  data-testid="input-preferences-email"
                />
                <Button type="submit" disabled={lookupStatus === "loading"} className="shrink-0" data-testid="button-preferences-lookup">
                  {lookupStatus === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Look Up"}
                </Button>
              </form>
              {lookupStatus === "not_found" && (
                <p className="text-sm text-amber-600 mt-3" data-testid="text-not-found">
                  No subscription found for this email. Would you like to subscribe?
                </p>
              )}
              {lookupStatus === "error" && (
                <p className="text-sm text-red-500 mt-3" data-testid="text-lookup-error">
                  Something went wrong. Please try again.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {unsubscribeStatus === "done" && (
          <Card data-testid="card-unsubscribed">
            <CardContent className="text-center py-12">
              <BellOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{t("pages.emailPreferences.unsubscribed")}</h2>
              <p className="text-gray-600 mb-6">
                You have been unsubscribed from all newsletters. We're sorry to see you go.
              </p>
              <Button variant="outline" onClick={() => { setUnsubscribeStatus("idle"); setLookupStatus("idle"); setSubscriber(null); }} data-testid="button-resubscribe">
                Resubscribe
              </Button>
            </CardContent>
          </Card>
        )}

        {lookupStatus === "found" && subscriber && unsubscribeStatus !== "done" && (
          <>
            <Card className="mb-6" data-testid="card-category-preferences">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Newsletter Categories
                </CardTitle>
                <CardDescription>
                  Choose which types of content you'd like to receive.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(Object.keys(CATEGORY_INFO) as SubscriptionCategory[]).map((cat) => {
                  const info = CATEGORY_INFO[cat];
                  return (
                    <div
                      key={cat}
                      className={`flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer ${
                        selectedCategories.includes(cat)
                          ? "border-primary/30 bg-primary/5"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                      onClick={() => toggleCategory(cat)}
                      data-testid={`card-category-${cat}`}
                    >
                      <Checkbox
                        checked={selectedCategories.includes(cat)}
                        onCheckedChange={() => {}}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-0.5 pointer-events-none"
                        data-testid={`checkbox-pref-category-${cat}`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{info.icon}</span>
                          <Label className="font-semibold text-gray-900 cursor-pointer">{info.label}</Label>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{info.description}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="mb-6" data-testid="card-frequency-preferences">
              <CardHeader>
                <CardTitle className="text-lg">{t("pages.emailPreferences.emailFrequency")}</CardTitle>
                <CardDescription>{t("pages.emailPreferences.howOftenWouldYouLike")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger className="w-full" data-testid="select-frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} data-testid={`option-frequency-${opt.value}`}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between gap-4">
              <Button
                onClick={handleSave}
                disabled={saveStatus === "saving"}
                className="flex-1"
                data-testid="button-save-preferences"
              >
                {saveStatus === "saving" ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </span>
                ) : saveStatus === "saved" ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Saved!
                  </span>
                ) : (
                  "Save Preferences"
                )}
              </Button>

              {unsubscribeStatus === "confirming" ? (
                <div className="flex gap-2">
                  <Button variant="destructive" size="sm" onClick={handleUnsubscribe} data-testid="button-confirm-unsubscribe">
                    Confirm
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setUnsubscribeStatus("idle")} data-testid="button-cancel-unsubscribe">
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className="text-gray-400 hover:text-red-500"
                  onClick={() => setUnsubscribeStatus("confirming")}
                  data-testid="button-unsubscribe"
                >
                  Unsubscribe
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
