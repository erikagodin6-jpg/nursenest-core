import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useI18n } from "@/lib/i18n";
interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  adminEmail: string;
  adminPhone: string;
  notifyOnNewSubscription: boolean;
  notifyOnCancellation: boolean;
  notifyOnPaymentFailed: boolean;
  notifyOnLifetimePurchase: boolean;
  notifyOnTrialStart: boolean;
}

interface LogEntry {
  id: string;
  event_type: string;
  channel: string;
  recipient: string;
  subject: string;
  status: string;
  error_message: string | null;
  stripe_event_id: string | null;
  created_at: string;
}

export default function AdminNotifications() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [testingChannel, setTestingChannel] = useState<string | null>(null);

  const { data: settings, isLoading } = useQuery<NotificationSettings>({
    queryKey: ["/api/admin/notifications/settings"],
  });

  const { data: logData } = useQuery<{ items: LogEntry[]; total: number }>({
    queryKey: ["/api/admin/notifications/log"],
  });

  const saveMutation = useMutation({
    mutationFn: async (updates: Partial<NotificationSettings>) => {
      const res = await fetch("/api/admin/notifications/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/notifications/settings"] }),
  });

  const testMutation = useMutation({
    mutationFn: async (channel?: string) => {
      setTestingChannel(channel || "both");
      const res = await fetch("/api/admin/notifications/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel }),
      });
      return res.json();
    },
    onSettled: () => {
      setTestingChannel(null);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/notifications/log"] });
    },
  });

  const toggleSetting = (key: keyof NotificationSettings) => {
    if (!settings) return;
    saveMutation.mutate({ [key]: !settings[key] });
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto" data-testid="page-admin-notifications">
        <p className="text-slate-500">{t("pages.adminNotifications.loadingNotificationSettings")}</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8" data-testid="page-admin-notifications">
      <div>
        <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">{t("pages.adminNotifications.purchaseNotifications")}</h1>
        <p className="text-slate-600 mt-1">{t("pages.adminNotifications.getNotifiedWhenStudentsSubscribe")}</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-slate-800">{t("pages.adminNotifications.channels")}</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-700">{t("pages.adminNotifications.emailNotifications")}</p>
              <p className="text-sm text-slate-500">{settings?.adminEmail}</p>
            </div>
            <button
              data-testid="button-toggle-email"
              onClick={() => toggleSetting("emailEnabled")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings?.emailEnabled ? "bg-violet-600" : "bg-slate-300"
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings?.emailEnabled ? "translate-x-6" : "translate-x-1"
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-700">{t("pages.adminNotifications.smsNotifications")}</p>
              <p className="text-sm text-slate-500">{settings?.adminPhone}</p>
            </div>
            <button
              data-testid="button-toggle-sms"
              onClick={() => toggleSetting("smsEnabled")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings?.smsEnabled ? "bg-violet-600" : "bg-slate-300"
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings?.smsEnabled ? "translate-x-6" : "translate-x-1"
              }`} />
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            data-testid="button-test-email"
            onClick={() => testMutation.mutate("email")}
            disabled={testingChannel !== null}
            className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-50 transition-colors"
          >
            {testingChannel === "email" ? "Sending..." : "Test Email"}
          </button>
          <button
            data-testid="button-test-sms"
            onClick={() => testMutation.mutate("sms")}
            disabled={testingChannel !== null}
            className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-50 transition-colors"
          >
            {testingChannel === "sms" ? "Sending..." : "Test SMS"}
          </button>
          <button
            data-testid="button-test-both"
            onClick={() => testMutation.mutate(undefined)}
            disabled={testingChannel !== null}
            className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg disabled:opacity-50 transition-colors"
          >
            {testingChannel === "both" ? "Sending..." : "Test Both"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">{t("pages.adminNotifications.eventTypes")}</h2>

        {([
          { key: "notifyOnNewSubscription" as const, label: "New Subscription", desc: "When a student subscribes to any plan" },
          { key: "notifyOnLifetimePurchase" as const, label: "Lifetime Purchase", desc: "When a student buys lifetime access" },
          { key: "notifyOnTrialStart" as const, label: "Trial Started", desc: "When a student starts a free trial" },
          { key: "notifyOnCancellation" as const, label: "Cancellation", desc: "When a subscription is cancelled" },
          { key: "notifyOnPaymentFailed" as const, label: "Payment Failed", desc: "When an invoice payment fails" },
        ]).map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
            <div>
              <p className="font-medium text-slate-700">{label}</p>
              <p className="text-sm text-slate-500">{desc}</p>
            </div>
            <button
              data-testid={`button-toggle-${key}`}
              onClick={() => toggleSetting(key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings?.[key] ? "bg-violet-600" : "bg-slate-300"
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings?.[key] ? "translate-x-6" : "translate-x-1"
              }`} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">{t("pages.adminNotifications.notificationLog")}</h2>
          {logData?.total !== undefined && (
            <span className="text-sm text-slate-500" data-testid="text-log-count">{logData.total} total</span>
          )}
        </div>

        {logData?.items && logData.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-2 text-slate-500 font-medium">{t("pages.adminNotifications.time")}</th>
                  <th className="text-left py-2 px-2 text-slate-500 font-medium">{t("pages.adminNotifications.event")}</th>
                  <th className="text-left py-2 px-2 text-slate-500 font-medium">{t("pages.adminNotifications.channel")}</th>
                  <th className="text-left py-2 px-2 text-slate-500 font-medium">{t("pages.adminNotifications.status")}</th>
                  <th className="text-left py-2 px-2 text-slate-500 font-medium">{t("pages.adminNotifications.recipient")}</th>
                </tr>
              </thead>
              <tbody>
                {logData.items.map((entry) => (
                  <tr key={entry.id} className="border-b border-slate-50" data-testid={`row-log-${entry.id}`}>
                    <td className="py-2 px-2 text-slate-600 whitespace-nowrap">
                      {new Date(entry.created_at).toLocaleString("en-CA", { timeZone: "America/Toronto" })}
                    </td>
                    <td className="py-2 px-2">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {entry.event_type}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-slate-600">{entry.channel}</td>
                    <td className="py-2 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        entry.status === "sent"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-slate-600 text-xs">{entry.recipient}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8" data-testid="text-log-empty">{t("pages.adminNotifications.noNotificationsSentYet")}</p>
        )}
      </div>
    </div>
  );
}
