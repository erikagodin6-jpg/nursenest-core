"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CountryCode, TierCode } from "@prisma/client";
import { ChevronDown, ChevronUp, Heart, Pause, Play, Repeat, Stethoscope, Volume2, VolumeX, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import type { LessonInteractiveSoundLibraryItem, LessonInteractiveSoundLibraryModule } from "@/lib/lessons/pathway-lesson-types";
import type { CardiacSoundCategory } from "@/lib/lessons/cardiac-sounds-library-data";
import { lessonSoundCountryNote, lessonSoundItemVisibleForTier } from "@/lib/lessons/lesson-sound-library-scope";
import {
  scheduleCardiacWaveform,
  scheduleRespiratoryWaveform,
  type CardiacWaveformId,
  type RespiratoryWaveformId,
} from "@/lib/lessons/lesson-sound-waveform-synth";

type SoundKind = "respiratory" | "cardiac";

type BaseSound = {
  id: string;
  name: string;
  timing: string;
  pitchLine: string;
  description: string;
  auscultationSite: string;
  clinicalSignificance: string;
  commonCauses: string[];
  audioSrc?: string;
  waveformType: string;
  countryNote?: string;
  clinicalPearl?: string;
  miniQuestion?: { question: string; options: string[]; correctIndex: number; rationale: string };
};

function moduleItemToBase(item: LessonInteractiveSoundLibraryItem, countryCode: CountryCode): BaseSound {
  const cn = lessonSoundCountryNote(item.countryNotes, countryCode);
  return {
    id: item.id,
    name: item.name,
    timing: item.timing,
    pitchLine: item.pitch,
    description: item.description,
    auscultationSite: item.auscultationSite,
    clinicalSignificance: item.clinicalSignificance,
    commonCauses: item.commonCauses,
    audioSrc: item.audioUrl ?? undefined,
    waveformType: item.waveformType,
    countryNote: cn,
    clinicalPearl: item.clinicalPearl,
    miniQuestion: item.miniQuestion,
  };
}

function categoryBadgeClass(kind: SoundKind, category: string): string {
  if (kind === "respiratory") {
    if (category === "normal") return "nn-badge-semantic-success";
    if (category === "voice") return "nn-badge-semantic-info";
    return "nn-badge-semantic-warning";
  }
  if (category === "normal") return "nn-badge-semantic-success";
  if (category === "extra_sounds") return "nn-badge-semantic-info";
  if (category === "murmurs") return "nn-badge-semantic-warning";
  return "nn-badge-semantic-danger";
}

function categoryLabelText(
  t: (k: string, p?: Record<string, string | number | undefined>) => string,
  kind: SoundKind,
  category: string,
): string {
  if (kind === "respiratory") {
    if (category === "normal") return t("components.respiratorySoundsLibrary.filterNormal");
    if (category === "voice") return t("components.lessonSoundLibrary.filterVoice");
    return t("components.respiratorySoundsLibrary.filterAdventitious");
  }
  if (category === "normal") return t("components.cardiacSoundsLibrary.categoryNormal");
  if (category === "extra_sounds") return t("components.cardiacSoundsLibrary.categoryExtra");
  if (category === "murmurs") return t("components.cardiacSoundsLibrary.categoryMurmurs");
  return t("components.cardiacSoundsLibrary.categoryAbnormal");
}

function SoundStudyCard({
  sound,
  kind,
  category,
  timingLabel,
  pitchLabel,
  significanceLabel,
  causesLabel,
  auscultationLabel,
}: {
  sound: BaseSound;
  kind: SoundKind;
  category: string;
  timingLabel: string;
  pitchLabel: string;
  significanceLabel: string;
  causesLabel: string;
  auscultationLabel: string;
}) {
  const { t } = useMarketingI18n();
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.72);
  const [isLooping, setIsLooping] = useState(false);
  const loopRef = useRef(false);
  const playingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showMini, setShowMini] = useState(false);
  const [revealRationale, setRevealRationale] = useState(false);

  const usesAudioFile = Boolean(sound.audioSrc);

  useEffect(() => {
    loopRef.current = isLooping;
    if (audioElRef.current) audioElRef.current.loop = isLooping;
  }, [isLooping]);

  const stopPlayback = useCallback(() => {
    playingRef.current = false;
    setIsPlaying(false);
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current.currentTime = 0;
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (ctxRef.current && ctxRef.current.state !== "closed") {
      ctxRef.current.close().catch(() => {});
      ctxRef.current = null;
    }
  }, []);

  const startPlayback = useCallback(() => {
    if (playingRef.current) {
      stopPlayback();
      return;
    }

    if (usesAudioFile && sound.audioSrc) {
      if (!audioElRef.current) audioElRef.current = new Audio(sound.audioSrc);
      audioElRef.current.loop = loopRef.current;
      audioElRef.current.volume = volume;
      void audioElRef.current.play().catch(() => {});
      playingRef.current = true;
      setIsPlaying(true);
      if (!loopRef.current) {
        audioElRef.current.onended = () => {
          playingRef.current = false;
          setIsPlaying(false);
        };
      }
      return;
    }

    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const gain = ctx.createGain();
    gain.gain.value = volume;
    gain.connect(ctx.destination);
    gainRef.current = gain;
    const dur = 6;
    playingRef.current = true;
    setIsPlaying(true);

    const playCycle = () => {
      if (!playingRef.current || !ctxRef.current || ctxRef.current.state === "closed") return;
      if (kind === "respiratory") {
        scheduleRespiratoryWaveform(ctxRef.current, sound.waveformType as RespiratoryWaveformId, dur, gainRef.current!);
      } else {
        scheduleCardiacWaveform(ctxRef.current, sound.waveformType as CardiacWaveformId, dur, gainRef.current!);
      }
      timerRef.current = setTimeout(() => {
        if (loopRef.current && playingRef.current) playCycle();
        else stopPlayback();
      }, dur * 1000);
    };

    playCycle();
  }, [kind, sound.audioSrc, sound.waveformType, stopPlayback, usesAudioFile, volume]);

  useEffect(() => {
    return () => {
      playingRef.current = false;
      if (audioElRef.current) {
        audioElRef.current.pause();
        audioElRef.current = null;
      }
      if (timerRef.current) clearTimeout(timerRef.current);
      if (ctxRef.current && ctxRef.current.state !== "closed") {
        ctxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const handleVolumeChange = useCallback((val: number[]) => {
    setVolume(val[0]);
    if (audioElRef.current) audioElRef.current.volume = val[0];
    if (gainRef.current) gainRef.current.gain.value = val[0];
  }, []);

  return (
    <div
      className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_14%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_22%,transparent)] p-4 shadow-sm"
      data-testid={`sound-card-${kind}-${sound.id}`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-[var(--theme-body-text)]">{sound.name}</h4>
          <span
            className={`mt-1 inline-flex px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${categoryBadgeClass(kind, category)}`}
          >
            {categoryLabelText(t, kind, category)}
          </span>
        </div>
        {kind === "respiratory" ? (
          <Wind className="mt-0.5 h-5 w-5 shrink-0 text-[var(--semantic-info)]" aria-hidden />
        ) : (
          <Heart className="mt-0.5 h-5 w-5 shrink-0 text-[var(--semantic-danger)]" aria-hidden />
        )}
      </div>

      <p className="mb-3 text-xs leading-relaxed text-[var(--theme-muted-text)]">{sound.description}</p>
      {sound.countryNote ? (
        <p className="mb-3 rounded-md border border-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_18%,transparent)] p-2 text-xs text-[var(--theme-body-text)]">
          {sound.countryNote}
        </p>
      ) : null}

      <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="font-semibold text-[var(--theme-body-text)]">{timingLabel}</span>
          <p className="text-[var(--theme-muted-text)]">{sound.timing}</p>
        </div>
        <div>
          <span className="font-semibold text-[var(--theme-body-text)]">{pitchLabel}</span>
          <p className="text-[var(--theme-muted-text)]">{sound.pitchLine}</p>
        </div>
      </div>

      <div className="mb-3">
        <span className="text-xs font-semibold text-[var(--theme-body-text)]">{auscultationLabel}</span>
        <p className="text-xs text-[var(--theme-muted-text)]">{sound.auscultationSite}</p>
      </div>

      <div className="mb-3">
        <span className="text-xs font-semibold text-[var(--theme-body-text)]">{significanceLabel}</span>
        <p className="text-xs text-[var(--theme-muted-text)]">{sound.clinicalSignificance}</p>
      </div>

      <div className="mb-3">
        <span className="text-xs font-semibold text-[var(--theme-body-text)]">{causesLabel}</span>
        <ul className="mt-1 space-y-0.5">
          {sound.commonCauses.map((cause, i) => (
            <li key={i} className="text-xs text-[var(--theme-muted-text)]">
              — {cause}
            </li>
          ))}
        </ul>
      </div>

      {sound.clinicalPearl ? (
        <div className="mb-3 rounded-md border border-[color-mix(in_srgb,var(--semantic-success)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_16%,transparent)] p-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--semantic-success)]">
            {t("components.lessonSoundLibrary.clinicalPearlHeading")}
          </p>
          <p className="text-xs text-[var(--theme-body-text)]">{sound.clinicalPearl}</p>
        </div>
      ) : null}

      {sound.miniQuestion ? (
        <div className="mb-3 rounded-md border border-border bg-[var(--theme-muted-surface)]/60 p-2">
          <button
            type="button"
            className="text-left text-xs font-semibold text-primary hover:underline"
            onClick={() => setShowMini((v) => !v)}
          >
            {showMini ? t("components.cardiacSoundsLibrary.hideQuickCheck") : t("components.cardiacSoundsLibrary.miniCheck")}
            {": "}
            {sound.miniQuestion.question}
          </button>
          {showMini ? (
            <div className="mt-2 space-y-2 text-xs text-[var(--theme-body-text)]">
              <ol className="list-decimal space-y-1 pl-4">
                {sound.miniQuestion.options.map((o, idx) => (
                  <li
                    key={idx}
                    className={idx === sound.miniQuestion!.correctIndex ? "font-semibold text-[var(--semantic-success)]" : ""}
                  >
                    {o}
                  </li>
                ))}
              </ol>
              <button type="button" className="font-medium text-primary hover:underline" onClick={() => setRevealRationale((r) => !r)}>
                {revealRationale ? t("components.cardiacSoundsLibrary.hideRationale") : t("components.cardiacSoundsLibrary.showRationale")}
              </button>
              {revealRationale ? <p className="text-[var(--theme-muted-text)]">{sound.miniQuestion.rationale}</p> : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="flex items-center gap-2 border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_70%,transparent)] pt-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-9 w-9 rounded-full ${isPlaying ? "bg-primary text-primary-foreground" : ""}`}
          onClick={startPlayback}
          data-testid={`button-play-sound-${kind}-${sound.id}`}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <span className="w-28 text-[10px] text-[var(--theme-muted-text)]">
          {isPlaying
            ? t("components.cardiacSoundsLibrary.playing")
            : usesAudioFile
              ? t("components.cardiacSoundsLibrary.recording")
              : t("components.cardiacSoundsLibrary.synthesized")}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-7 w-7 ${isLooping ? "bg-primary/10 text-primary" : "text-[var(--theme-muted-text)]"}`}
          onClick={() => setIsLooping(!isLooping)}
        >
          <Repeat className="h-3.5 w-3.5" />
        </Button>
        <div className="ml-auto flex items-center gap-1">
          {volume === 0 ? (
            <VolumeX className="h-3.5 w-3.5 text-[var(--theme-muted-text)]" />
          ) : (
            <Volume2 className="h-3.5 w-3.5 text-[var(--theme-muted-text)]" />
          )}
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => handleVolumeChange([Number(e.target.value)])}
            aria-label="Volume"
            className="w-16 accent-[var(--semantic-brand)]"
          />
        </div>
      </div>
    </div>
  );
}

function RespiratorySoundsLibraryInner({
  structuredItems,
  viewerTier,
  countryCode,
}: {
  structuredItems: LessonInteractiveSoundLibraryItem[];
  viewerTier: TierCode;
  countryCode: CountryCode;
}) {
  const { t } = useMarketingI18n();
  const [expanded, setExpanded] = useState(true);
  const [filter, setFilter] = useState<"all" | "normal" | "adventitious">("all");

  const items = useMemo(() => {
    return structuredItems.filter((r) => lessonSoundItemVisibleForTier({ allowedTiers: r.allowedTiers }, viewerTier));
  }, [structuredItems, viewerTier]);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((s) => s.category === filter);
  }, [filter, items]);

  return (
    <Card
      className="border border-[color-mix(in_srgb,var(--semantic-info)_16%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_12%,var(--theme-surface-elevated))]"
      data-testid="card-respiratory-sounds"
    >
      <CardContent className="space-y-4 p-5">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center gap-2 text-left"
          data-testid="button-toggle-respiratory-sounds-library"
        >
          <Stethoscope className="h-5 w-5 text-[var(--semantic-info)]" aria-hidden />
          <h3 className="flex-1 text-lg font-semibold text-[var(--theme-body-text)]">{t("components.respiratorySoundsLibrary.respiratorySoundsLibrary")}</h3>
          <span className="rounded-full bg-[var(--theme-muted-surface)] px-2 py-0.5 text-xs text-[var(--theme-muted-text)]">
            {t("components.lessonSoundLibrary.soundCount", { count: items.length })}
          </span>
          {expanded ? <ChevronUp className="h-4 w-4 text-[var(--theme-muted-text)]" /> : <ChevronDown className="h-4 w-4 text-[var(--theme-muted-text)]" />}
        </button>

        {expanded ? (
          <>
            <p className="text-sm text-[var(--theme-muted-text)]">{t("components.respiratorySoundsLibrary.listenToRealRecordingsOf")}</p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
                {t("components.lessonSoundLibrary.filterAll")} ({items.length})
              </Button>
              <Button type="button" variant={filter === "normal" ? "default" : "outline"} size="sm" onClick={() => setFilter("normal")}>
                {t("components.respiratorySoundsLibrary.filterNormal")} ({items.filter((s) => s.category === "normal").length})
              </Button>
              <Button type="button" variant={filter === "adventitious" ? "default" : "outline"} size="sm" onClick={() => setFilter("adventitious")}>
                {t("components.respiratorySoundsLibrary.filterAdventitious")} ({items.filter((s) => s.category === "adventitious").length})
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2" data-testid="grid-respiratory-sounds">
              {filtered.map((r) => (
                <SoundStudyCard
                  key={r.id}
                  sound={moduleItemToBase(r, countryCode)}
                  kind="respiratory"
                  category={r.category}
                  timingLabel={t("components.respiratorySoundsLibrary.timing")}
                  pitchLabel={t("components.respiratorySoundsLibrary.pitch")}
                  significanceLabel={t("components.respiratorySoundsLibrary.clinicalSignificance")}
                  causesLabel={t("components.respiratorySoundsLibrary.commonCauses")}
                  auscultationLabel={t("components.lessonSoundLibrary.bestAuscultation")}
                />
              ))}
            </div>
            <p className="rounded-lg border border-border bg-[var(--theme-muted-surface)]/50 p-3 text-xs text-[var(--theme-muted-text)]">
              {t("components.lessonSoundLibrary.eduDisclaimer")}
            </p>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}

function CardiacSoundsLibraryInner({
  structuredItems,
  viewerTier,
  countryCode,
}: {
  structuredItems: LessonInteractiveSoundLibraryItem[];
  viewerTier: TierCode;
  countryCode: CountryCode;
}) {
  const { t } = useMarketingI18n();
  const [expanded, setExpanded] = useState(true);
  const [filter, setFilter] = useState<"all" | CardiacSoundCategory>("all");

  const items = useMemo(() => {
    return structuredItems.filter((r) => lessonSoundItemVisibleForTier({ allowedTiers: r.allowedTiers }, viewerTier));
  }, [structuredItems, viewerTier]);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((s) => s.category === filter);
  }, [filter, items]);

  return (
    <Card
      className="border border-[color-mix(in_srgb,var(--semantic-danger)_14%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_10%,var(--theme-surface-elevated))]"
      data-testid="card-cardiac-sounds"
    >
      <CardContent className="space-y-4 p-5">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center gap-2 text-left"
          data-testid="button-toggle-cardiac-sounds-library"
        >
          <Heart className="h-5 w-5 text-[var(--semantic-danger)]" aria-hidden />
          <h3 className="flex-1 text-lg font-semibold text-[var(--theme-body-text)]">{t("components.cardiacSoundsLibrary.title")}</h3>
          <span className="rounded-full bg-[var(--theme-muted-surface)] px-2 py-0.5 text-xs text-[var(--theme-muted-text)]">
            {t("components.lessonSoundLibrary.soundCount", { count: items.length })}
          </span>
          {expanded ? <ChevronUp className="h-4 w-4 text-[var(--theme-muted-text)]" /> : <ChevronDown className="h-4 w-4 text-[var(--theme-muted-text)]" />}
        </button>

        {expanded ? (
          <>
            <p className="text-sm text-[var(--theme-muted-text)]">{t("components.cardiacSoundsLibrary.subtitle")}</p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
                {t("components.lessonSoundLibrary.filterAll")} ({items.length})
              </Button>
              {(["normal", "extra_sounds", "murmurs", "abnormal"] as const).map((c) => (
                <Button key={c} type="button" variant={filter === c ? "default" : "outline"} size="sm" onClick={() => setFilter(c)}>
                  {categoryLabelText(t, "cardiac", c)} ({items.filter((s) => s.category === c).length})
                </Button>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2" data-testid="grid-cardiac-sounds">
              {filtered.map((r) => (
                <SoundStudyCard
                  key={r.id}
                  sound={moduleItemToBase(r, countryCode)}
                  kind="cardiac"
                  category={r.category}
                  timingLabel={t("components.cardiacSoundsLibrary.timing")}
                  pitchLabel={t("components.cardiacSoundsLibrary.pitchQuality")}
                  significanceLabel={t("components.cardiacSoundsLibrary.clinicalSignificance")}
                  causesLabel={t("components.cardiacSoundsLibrary.commonCauses")}
                  auscultationLabel={t("components.cardiacSoundsLibrary.location")}
                />
              ))}
            </div>
            <p className="rounded-lg border border-border bg-[var(--theme-muted-surface)]/50 p-3 text-xs text-[var(--theme-muted-text)]">
              {t("components.cardiacSoundsLibrary.disclaimer")}
            </p>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}

/**
 * Renders structured sound-library modules (items hydrated at normalize time).
 * Callers should pass `modules` from `lesson.interactiveModules` (sound-library entries only).
 */
export function PathwayEmbeddedSoundLibraries(props: {
  modules: LessonInteractiveSoundLibraryModule[];
  viewerTier: TierCode;
  countryCode: CountryCode;
}) {
  const { modules, viewerTier, countryCode } = props;
  if (!modules.length) return null;
  return (
    <section
      className="mx-auto mt-6 max-w-5xl space-y-6"
      aria-label="Embedded lesson sound libraries"
      data-testid="section-pathway-embedded-sound-libraries"
    >
      {modules.map((mod) =>
        mod.soundLibrary === "cardiac_sounds" ? (
          <CardiacSoundsLibraryInner
            key={mod.id}
            structuredItems={mod.items}
            viewerTier={viewerTier}
            countryCode={countryCode}
          />
        ) : (
          <RespiratorySoundsLibraryInner
            key={mod.id}
            structuredItems={mod.items}
            viewerTier={viewerTier}
            countryCode={countryCode}
          />
        ),
      )}
    </section>
  );
}
