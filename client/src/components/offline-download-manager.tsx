import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download, Trash2, Wifi, WifiOff, RefreshCw, CheckCircle2,
  BookOpen, Brain, HardDrive, CloudOff, ChevronDown,
} from "lucide-react";
import {
  saveQuestionPack,
  saveFlashcardPack,
  getDownloadedPacks,
  deletePack,
  getOfflineStorageSize,
} from "@/lib/offline-store";
import { syncOfflineProgress, startAutoSync } from "@/lib/offline-sync";
import { useToast } from "@/hooks/use-toast";

import { useI18n } from "@/lib/i18n";
interface AvailablePack {
  id: string;
  title: string;
  topic: string;
  tier?: string;
  questionCount?: number;
  cardCount?: number;
  type: "questions" | "flashcards";
}

interface DownloadedPack {
  id: string;
  type: string;
  title: string;
  topic: string;
  tier: string;
  itemCount: number;
  downloadedAt: number;
  lastSyncedAt: number | null;
}

export function OfflineDownloadManager() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [availablePacks, setAvailablePacks] = useState<{ questionPacks: AvailablePack[]; flashcardPacks: AvailablePack[] }>({ questionPacks: [], flashcardPacks: [] });
  const [downloadedPacks, setDownloadedPacks] = useState<DownloadedPack[]>([]);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [storageUsed, setStorageUsed] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const loadData = useCallback(async () => {
    try {
      const packs = await getDownloadedPacks();
      setDownloadedPacks(packs);

      const size = await getOfflineStorageSize();
      setStorageUsed(size);

      if (isOnline) {
        const res = await fetch("/api/offline/packs");
        if (res.ok) {
          const data = await res.json();
          setAvailablePacks(data);
        }
      }
    } catch (e) {
      console.error("Load offline data error:", e);
    }
  }, [isOnline]);

  useEffect(() => {
    loadData();
    startAutoSync();
  }, [loadData]);

  const handleDownload = useCallback(
    async (pack: AvailablePack) => {
      setDownloading(pack.id);
      try {
        const res = await fetch(`/api/offline/download-pack/${pack.id}`);
        if (!res.ok) throw new Error("Download failed");
        const data = await res.json();

        if (data.type === "questions") {
          await saveQuestionPack(pack.id, pack.title, pack.topic, pack.tier || "", data.questions);
        } else {
          await saveFlashcardPack(pack.id, pack.title, pack.topic, pack.tier || "", data.cards);
        }

        toast({ title: "Downloaded!", description: `${pack.title} is now available offline.` });
        await loadData();
      } catch (e: any) {
        toast({ title: "Download Failed", description: e.message, variant: "destructive" });
      }
      setDownloading(null);
    },
    [toast, loadData]
  );

  const handleDelete = useCallback(
    async (packId: string) => {
      try {
        await deletePack(packId);
        toast({ title: "Removed", description: "Pack removed from offline storage." });
        await loadData();
      } catch (e: any) {
        toast({ title: "Error", description: e.message, variant: "destructive" });
      }
    },
    [toast, loadData]
  );

  const handleSync = useCallback(async () => {
    setSyncing(true);
    try {
      const result = await syncOfflineProgress();
      toast({
        title: "Sync Complete",
        description: `${result.synced} answers synced${result.errors > 0 ? `, ${result.errors} errors` : ""}.`,
      });
    } catch (e: any) {
      toast({ title: "Sync Error", description: e.message, variant: "destructive" });
    }
    setSyncing(false);
  }, [toast]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const [questionPackLimit, setQuestionPackLimit] = useState(10);
  const [flashcardPackLimit, setFlashcardPackLimit] = useState(10);
  const downloadedIds = new Set(downloadedPacks.map((p) => p.id));

  const visibleQuestionPacks = useMemo(
    () => availablePacks.questionPacks.slice(0, questionPackLimit),
    [availablePacks.questionPacks, questionPackLimit]
  );
  const visibleFlashcardPacks = useMemo(
    () => availablePacks.flashcardPacks.slice(0, flashcardPackLimit),
    [availablePacks.flashcardPacks, flashcardPackLimit]
  );

  return (
    <div className="space-y-6" data-testid="section-offline-manager">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <CloudOff className="w-5 h-5" />
            Offline Study
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Download content to study without internet
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Badge variant="outline" className="text-green-600 border-green-200">
              <Wifi className="w-3 h-3 mr-1" /> Online
            </Badge>
          ) : (
            <Badge variant="outline" className="text-amber-600 border-amber-200">
              <WifiOff className="w-3 h-3 mr-1" /> Offline
            </Badge>
          )}
          {storageUsed > 0 && (
            <Badge variant="outline">
              <HardDrive className="w-3 h-3 mr-1" /> {formatSize(storageUsed)}
            </Badge>
          )}
        </div>
      </div>

      {downloadedPacks.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{t("components.offlineDownloadManager.downloadedContent")}</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={handleSync}
                disabled={syncing || !isOnline}
                data-testid="button-sync-progress"
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${syncing ? "animate-spin" : ""}`} />
                Sync Progress
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {downloadedPacks.map((pack) => (
              <div
                key={pack.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                data-testid={`downloaded-pack-${pack.id}`}
              >
                <div className="flex items-center gap-3">
                  {pack.type === "questions" ? (
                    <BookOpen className="w-4 h-4 text-primary" />
                  ) : (
                    <Brain className="w-4 h-4 text-primary" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{pack.title}</p>
                    <p className="text-xs text-gray-500">
                      {pack.itemCount} {pack.type === "questions" ? "questions" : "cards"}
                      {pack.lastSyncedAt && ` · Synced ${new Date(pack.lastSyncedAt).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(pack.id)}
                  data-testid={`button-delete-${pack.id}`}
                >
                  <Trash2 className="w-4 h-4 text-gray-400" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {isOnline && (
        <>
          {availablePacks.questionPacks.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Question Packs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {visibleQuestionPacks.map((pack) => (
                  <div
                    key={pack.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    data-testid={`available-pack-${pack.id}`}
                  >
                    <div>
                      <p className="text-sm font-medium">{pack.title}</p>
                      <p className="text-xs text-gray-500">{pack.questionCount} questions</p>
                    </div>
                    {downloadedIds.has(pack.id) ? (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Downloaded
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(pack)}
                        disabled={downloading === pack.id}
                        data-testid={`button-download-${pack.id}`}
                      >
                        {downloading === pack.id ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Download className="w-3 h-3 mr-1" /> Download
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                ))}
                {availablePacks.questionPacks.length > questionPackLimit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 min-h-[44px]"
                    onClick={() => setQuestionPackLimit((l) => l + 10)}
                    data-testid="button-show-more-questions"
                  >
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Show More ({availablePacks.questionPacks.length - questionPackLimit} remaining)
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {availablePacks.flashcardPacks.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Flashcard Packs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {visibleFlashcardPacks.map((pack) => (
                  <div
                    key={pack.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    data-testid={`available-flashcard-${pack.id}`}
                  >
                    <div>
                      <p className="text-sm font-medium">{pack.title}</p>
                      <p className="text-xs text-gray-500">{pack.cardCount} cards</p>
                    </div>
                    {downloadedIds.has(pack.id) ? (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Downloaded
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(pack)}
                        disabled={downloading === pack.id}
                        data-testid={`button-download-fc-${pack.id}`}
                      >
                        {downloading === pack.id ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Download className="w-3 h-3 mr-1" /> Download
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                ))}
                {availablePacks.flashcardPacks.length > flashcardPackLimit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 min-h-[44px]"
                    onClick={() => setFlashcardPackLimit((l) => l + 10)}
                    data-testid="button-show-more-flashcards"
                  >
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Show More ({availablePacks.flashcardPacks.length - flashcardPackLimit} remaining)
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
