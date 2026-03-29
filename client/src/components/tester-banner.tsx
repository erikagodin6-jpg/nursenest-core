import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { X, TestTube, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TesterFeedbackDialog } from "@/components/tester-feedback-dialog";

import { useI18n } from "@/lib/i18n";
export function TesterBanner() {
  const { t } = useI18n();
  const { user, isTester } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  if (!isTester || dismissed) return null;

  const expiryDate = user?.testerExpiry ? new Date(user.testerExpiry) : null;
  const daysLeft = expiryDate ? Math.max(0, Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null;

  return (
    <>
      <div
        className="border-b"
        style={{
          background: `linear-gradient(to right, color-mix(in srgb, var(--theme-primary) 15%, transparent), color-mix(in srgb, var(--theme-border) 15%, transparent))`,
          borderColor: `color-mix(in srgb, var(--theme-primary) 20%, transparent)`,
        }}
        data-testid="tester-banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <TestTube className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--theme-primary)' }} />
            <span className="text-foreground font-medium">
              Beta Tester Access
            </span>
            {daysLeft !== null && (
              <span className="text-gray-500">
                {daysLeft > 0 ? `${daysLeft} days remaining` : "Expiring today"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-xs h-7 px-2 tester-banner-feedback-btn"
              onClick={() => setFeedbackOpen(true)}
              data-testid="button-tester-feedback"
            >
              <MessageSquare className="w-3.5 h-3.5 mr-1" />
              Send Feedback
            </Button>
            <button
              onClick={() => setDismissed(true)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={t("components.testerBanner.dismissBanner")}
              data-testid="button-dismiss-tester-banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <TesterFeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </>
  );
}
