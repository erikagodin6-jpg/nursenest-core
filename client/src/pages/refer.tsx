import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, Gift, Users, Share2, ArrowRight } from "lucide-react";

import { useI18n } from "@/lib/i18n";
function getAuthHeaders(): Record<string, string> {

  try {
    const stored = localStorage.getItem("nursenest-user");
    if (stored) {
      const u = JSON.parse(stored);
      return { "x-user-id": u.id };
    }
  } catch {}
  return {};
}

export default function ReferPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralUses, setReferralUses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchReferralCode();
  }, [user]);

  async function fetchReferralCode() {
    try {
      const res = await fetch("/api/referral/my-code", { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setReferralCode(data.referralCode);
        setReferralUses(data.referralUses || 0);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/referral/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      });
      if (res.ok) {
        const data = await res.json();
        setReferralCode(data.referralCode);
        toast({ title: "Referral code generated" });
      } else {
        const err = await res.json();
        toast({ title: "Unable to generate code", description: err.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  }

  function getShareLink() {
    return `https://nursenest.ca/signup?ref=${referralCode}`;
  }

  async function copyCode() {
    if (!referralCode) return;
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast({ title: "Code copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  }

  async function copyLink() {
    if (!referralCode) return;
    try {
      await navigator.clipboard.writeText(getShareLink());
      setCopiedLink(true);
      toast({ title: "Share link copied to clipboard" });
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
        <Navigation />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md border-none shadow-xl text-center">
            <CardContent className="pt-8 pb-8">
              <Gift className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">{t("pages.refer.signInToAccessYour")}</h2>
              <p className="text-gray-500 text-sm mb-6">{t("pages.refer.betaTestersAndSubscribersCan")}</p>
              <Button onClick={() => navigate("/login")} className="w-full" data-testid="button-refer-login">
                Sign In <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
      <Navigation />
      <main className="flex-1 px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold" data-testid="text-refer-heading">{t("pages.refer.referAFriend")}</h1>
            <p className="text-gray-500 mt-2">{t("pages.refer.shareYourReferralCodeAnd")}</p>
          </div>

          {loading ? (
            <Card className="border-none shadow-lg">
              <CardContent className="py-12 text-center">
                <div className="animate-pulse text-gray-400">{t("pages.refer.loadingYourReferralInfo")}</div>
              </CardContent>
            </Card>
          ) : referralCode ? (
            <>
              <Card className="border-none shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-primary" />
                    Your Referral Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 font-mono text-lg font-bold tracking-wider text-center" data-testid="text-referral-code">
                      {referralCode}
                    </div>
                    <Button variant="outline" size="icon" onClick={copyCode} className="shrink-0" data-testid="button-copy-code">
                      {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 font-medium">{t("pages.refer.shareLink")}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-600 truncate" data-testid="text-referral-link">
                        {getShareLink()}
                      </div>
                      <Button variant="outline" size="icon" onClick={copyLink} className="shrink-0" data-testid="button-copy-link">
                        {copiedLink ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Referral Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-primary/5 rounded-xl p-5 text-center">
                      <div className="text-3xl font-bold text-primary" data-testid="text-referral-count">{referralUses}</div>
                      <div className="text-sm text-gray-500 mt-1">{t("pages.refer.friendsReferred")}</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-5 text-center">
                      <div className="text-3xl font-bold text-green-600">15%</div>
                      <div className="text-sm text-gray-500 mt-1">{t("pages.refer.discountForEachFriend")}</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-5 text-center">
                      <div className="text-3xl font-bold text-blue-600" data-testid="text-referral-days">{referralUses * 7}</div>
                      <div className="text-sm text-gray-500 mt-1">{t("pages.refer.premiumDaysEarned")}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-gradient-to-r from-primary/5 to-primary/10">
                <CardContent className="py-6">
                  <h3 className="font-semibold text-lg mb-3">{t("pages.refer.howItWorks")}</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">1</span>
                      </div>
                      <p>{t("pages.refer.shareYourReferralCodeOr")}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">2</span>
                      </div>
                      <p>{t("pages.refer.whenTheySignUpUsing")}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">3</span>
                      </div>
                      <p>{t("pages.refer.theyReceive15OffTheir")}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">4</span>
                      </div>
                      <p>{t("pages.refer.youReceive7FreeDays")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-none shadow-lg">
              <CardContent className="py-8 text-center space-y-4">
                <Gift className="w-12 h-12 text-gray-300 mx-auto" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">{t("pages.refer.getYourReferralCode")}</h3>
                  <p className="text-gray-500 text-sm">{t("pages.refer.betaTestersAndPaidSubscribers")}</p>
                </div>
                <Button onClick={handleGenerate} disabled={generating} className="mx-auto" data-testid="button-generate-referral">
                  {generating ? "Generating..." : "Generate My Referral Code"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
