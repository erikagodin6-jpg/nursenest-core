import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { CheckCircle2, Loader2, Target, Smartphone } from "lucide-react";

import { useI18n } from "@/lib/i18n";
export default function SubscriptionSuccess() {
  const { t } = useI18n();
  const [, navigate] = useLocation();
  const { user, refreshUser } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const params = new URLSearchParams(window.location.search);
  const isMobileApp = params.get("source") === "mobile_app";

  useEffect(() => {
    const sessionId = params.get("session_id");
    const tier = params.get("tier");

    if (sessionId && user) {
      fetch("/api/stripe/verify-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, userId: user.id, tier }),
      })
        .then((res) => res.json())
        .then((data) => {
          setSuccess(data.success);
          if (data.success) refreshUser();
          if (data.error) setErrorMessage(data.error);
        })
        .catch(() => {
          setErrorMessage("Could not reach the server. Please refresh the page to try again.");
        })
        .finally(() => setVerifying(false));
    } else {
      setVerifying(false);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
      <Navigation />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-none shadow-xl">
          <CardContent className="p-8 text-center space-y-6">
            {verifying ? (
              <>
                <Loader2 className="w-16 h-16 text-primary mx-auto animate-spin" data-testid="icon-verifying" />
                <h2 className="text-2xl font-bold">{t("pages.subscriptionSuccess.verifyingYourSubscription")}</h2>
              </>
            ) : success ? (
              isMobileApp ? (
                <>
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h2 className="text-2xl font-bold" data-testid="text-subscription-activated-mobile">Your Subscription is Active!</h2>
                  <p className="text-gray-600">Your payment was successful and your subscription is now active.</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Smartphone className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">Return to the NurseNest App</span>
                    </div>
                    <p className="text-sm text-blue-700">Close this browser window and open the NurseNest app. Pull down to refresh and your premium access will be ready.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h2 className="text-2xl font-bold" data-testid="text-subscription-activated">{t("pages.subscriptionSuccess.subscriptionActivated")}</h2>
                  <p className="text-gray-600">{t("pages.subscriptionSuccess.youNowHaveFullAccess")}</p>
                  <div className="flex flex-col gap-2">
                    <Button onClick={() => navigate("/onboarding/plan")} className="rounded-full px-8" data-testid="button-build-study-plan">
                      <Target className="w-4 h-4 mr-2" /> Build My Study Plan
                    </Button>
                    <Button onClick={() => navigate("/lessons")} variant="outline" className="rounded-full px-8" data-testid="button-go-to-lessons">
                      Browse Lessons
                    </Button>
                  </div>
                </>
              )
            ) : (
              <>
                <h2 className="text-2xl font-bold" data-testid="text-verification-failed">{t("pages.subscriptionSuccess.somethingWentWrong")}</h2>
                <p className="text-gray-600">
                  {errorMessage || "We couldn't verify your subscription. Please try again or contact support."}
                </p>
                <p className="text-sm text-gray-400">{t("pages.subscriptionSuccess.ifYouWereChargedYour")}</p>
                <div className="flex flex-col gap-2">
                  <Button onClick={() => window.location.reload()} className="rounded-full px-8" data-testid="button-retry-verification">
                    Retry Verification
                  </Button>
                  <Button onClick={() => navigate("/lessons")} variant="outline" data-testid="button-back-to-lessons">
                    Back to Lessons
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
