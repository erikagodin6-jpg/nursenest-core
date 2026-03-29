import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell, BellOff, Clock, BookOpen, Brain, Target } from "lucide-react";
import { useAuth } from "@/lib/auth";

import { useI18n } from "@/lib/i18n";
interface NotificationSettings {
  subscribed: boolean;
  reminderTime: string;
  enableDailyReminder: boolean;
  enableExamReminder: boolean;
  enableFlashcardReminder: boolean;
}

export function PushNotificationSettings() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings>({
    subscribed: false,
    reminderTime: "09:00",
    enableDailyReminder: true,
    enableExamReminder: true,
    enableFlashcardReminder: true,
  });
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    const isSupported = "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;
    setSupported(isSupported);
    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    if (!supported) return;
    checkSubscription();
  }, [supported]);

  const checkSubscription = useCallback(async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        const response = await fetch(`/api/push/status?endpoint=${encodeURIComponent(sub.endpoint)}`);
        if (response.ok) {
          const data = await response.json();
          setSettings({
            subscribed: data.subscribed,
            reminderTime: data.reminderTime || "09:00",
            enableDailyReminder: data.enableDailyReminder !== false,
            enableExamReminder: data.enableExamReminder !== false,
            enableFlashcardReminder: data.enableFlashcardReminder !== false,
          });
        }
      }
    } catch (e) {
      console.error("Push check error:", e);
    }
  }, []);

  const subscribe = useCallback(async () => {
    setLoading(true);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") {
        setLoading(false);
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        const vapidKey = "BN8vSRFXKnqBwCxDQVjW0TjGSj9_VX2F_Yk8RKt7E1aVx_iEP6hhSxqLqT-DGfHYKT8W8UYF5KqpO3fFLkSiCE";
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });
      }

      const key = sub.getKey("p256dh");
      const auth = sub.getKey("auth");

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: sub.endpoint,
          p256dh: key ? btoa(String.fromCharCode(...new Uint8Array(key))) : "",
          auth: auth ? btoa(String.fromCharCode(...new Uint8Array(auth))) : "",
          userId: user?.id || null,
          ...settings,
        }),
      });

      setSettings((s) => ({ ...s, subscribed: true }));
    } catch (e) {
      console.error("Subscribe error:", e);
    }
    setLoading(false);
  }, [settings, user]);

  const unsubscribe = useCallback(async () => {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setSettings((s) => ({ ...s, subscribed: false }));
    } catch (e) {
      console.error("Unsubscribe error:", e);
    }
    setLoading(false);
  }, []);

  const updateSettings = useCallback(
    async (updates: Partial<NotificationSettings>) => {
      const newSettings = { ...settings, ...updates };
      setSettings(newSettings);

      if (!settings.subscribed) return;

      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          const key = sub.getKey("p256dh");
          const auth = sub.getKey("auth");
          await fetch("/api/push/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              endpoint: sub.endpoint,
              p256dh: key ? btoa(String.fromCharCode(...new Uint8Array(key))) : "",
              auth: auth ? btoa(String.fromCharCode(...new Uint8Array(auth))) : "",
              userId: user?.id || null,
              ...newSettings,
            }),
          });
        }
      } catch (e) {
        console.error("Update settings error:", e);
      }
    },
    [settings, user]
  );

  if (!supported) {
    return (
      <Card>
        <CardContent className="p-4 text-center text-gray-500 text-sm">
          Push notifications are not supported in this browser.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-push-notifications">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="w-5 h-5 text-primary" />
          Study Reminders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">{t("components.pushNotifications.enableNotifications")}</p>
            <p className="text-xs text-gray-500">{t("components.pushNotifications.getRemindersToStayOn")}</p>
          </div>
          <Button
            size="sm"
            variant={settings.subscribed ? "outline" : "default"}
            onClick={settings.subscribed ? unsubscribe : subscribe}
            disabled={loading}
            data-testid="button-toggle-notifications"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : settings.subscribed ? (
              <>
                <BellOff className="w-4 h-4 mr-1" /> Disable
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 mr-1" /> Enable
              </>
            )}
          </Button>
        </div>

        {permission === "denied" && (
          <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
            Notifications are blocked. Please enable them in your browser settings.
          </p>
        )}

        {settings.subscribed && (
          <>
            <div className="border-t pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{t("components.pushNotifications.reminderTime")}</span>
                </div>
                <select
                  value={settings.reminderTime}
                  onChange={(e) => updateSettings({ reminderTime: e.target.value })}
                  className="text-sm border rounded px-2 py-1"
                  data-testid="select-reminder-time"
                >
                  {["06:00", "07:00", "08:00", "09:00", "10:00", "12:00", "14:00", "18:00", "20:00"].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{t("components.pushNotifications.dailyStudyReminder")}</span>
                </div>
                <Switch
                  checked={settings.enableDailyReminder}
                  onCheckedChange={(checked) => updateSettings({ enableDailyReminder: checked })}
                  data-testid="switch-daily-reminder"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{t("components.pushNotifications.practiceExamReminders")}</span>
                </div>
                <Switch
                  checked={settings.enableExamReminder}
                  onCheckedChange={(checked) => updateSettings({ enableExamReminder: checked })}
                  data-testid="switch-exam-reminder"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{t("components.pushNotifications.flashcardReviewPrompts")}</span>
                </div>
                <Switch
                  checked={settings.enableFlashcardReminder}
                  onCheckedChange={(checked) => updateSettings({ enableFlashcardReminder: checked })}
                  data-testid="switch-flashcard-reminder"
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
