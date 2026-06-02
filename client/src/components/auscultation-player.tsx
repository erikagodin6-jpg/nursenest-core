import { useState, useRef, useEffect, useCallback } from "react";
import { fisherYatesShuffle } from "@shared/shuffle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useI18n } from "@/lib/i18n";
import {
  Play, Pause, Volume2, VolumeX, Repeat, SkipForward,
  Stethoscope, HeartPulse, Wind, Activity, Eye, EyeOff,
  CheckCircle2, XCircle, HelpCircle, ChevronDown, ChevronUp,
  Clock
} from "lucide-react";

type AudioClipData = {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  conditionTag?: string;
  descriptionShort?: string;
  bodySite?: string;
  audioUrlStream?: string;
  durationSeconds?: number;
  licenseType: string;
  attributionText?: string;
  sourceUrl?: string;
  quizPrompt?: string;
  answerKey?: string;
};

function getCategoryIcon(category: string) {

  switch (category) {
    case "HEART": return <HeartPulse className="w-5 h-5 text-red-500" />;
    case "LUNG": return <Wind className="w-5 h-5 text-blue-500" />;
    case "BOWEL": return <Activity className="w-5 h-5 text-green-500" />;
    default: return <Stethoscope className="w-5 h-5 text-gray-500" />;
  }
}

function AudioPlayerCard({ clip, allClips }: { clip: AudioClipData; allClips: AudioClipData[] }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(clip.durationSeconds || 0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quizMode, setQuizMode] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleSeek = useCallback((value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  }, []);

  const handleVolumeChange = useCallback((value: number[]) => {
    const v = value[0];
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    setIsMuted(v === 0);
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  }, [isMuted]);

  const cycleSpeed = useCallback(() => {
    const speeds = [0.75, 1, 1.25];
    const idx = speeds.indexOf(playbackRate);
    const next = speeds[(idx + 1) % speeds.length];
    setPlaybackRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  }, [playbackRate]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration);
    const onEnded = () => { if (!isLooping) setIsPlaying(false); };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
    };
  }, [isLooping]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const quizOptions = quizMode
    ? fisherYatesShuffle(allClips.filter(c => c.category === clip.category && c.id !== clip.id).slice(0, 3).map(c => c.title).concat(clip.title))
    : [];

  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow" data-testid={`audio-player-${clip.id}`}>
      <audio ref={audioRef} src={clip.audioUrlStream || ""} loop={isLooping} preload="metadata" />

      <div className="flex items-start gap-3 mb-3">
        {getCategoryIcon(clip.category)}
        <div className="flex-1 min-w-0">
          {quizMode && !showAnswer ? (
            <p className="font-medium text-gray-900" data-testid="text-quiz-prompt">
              <HelpCircle className="w-4 h-4 inline mr-1 text-amber-500" />
              Identify this sound
            </p>
          ) : (
            <>
              <p className="font-medium text-gray-900 truncate" data-testid={`text-clip-title-${clip.id}`}>{clip.title}</p>
              {clip.descriptionShort && <p className="text-sm text-gray-500 mt-0.5">{clip.descriptionShort}</p>}
            </>
          )}
          {clip.bodySite && <span className="text-xs text-primary/70 bg-primary/5 px-2 py-0.5 rounded-full mt-1 inline-block">{clip.bodySite}</span>}
        </div>
        <Button
          variant="ghost" size="sm"
          onClick={() => { setQuizMode(!quizMode); setSelectedAnswer(null); setShowAnswer(false); }}
          className={`text-xs ${quizMode ? "text-amber-600 bg-amber-50" : "text-gray-500"}`}
          data-testid={`button-quiz-toggle-${clip.id}`}
        >
          {quizMode ? <Eye className="w-3.5 h-3.5 mr-1" /> : <EyeOff className="w-3.5 h-3.5 mr-1" />}
          {quizMode ? "Show" : "Test Me"}
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={togglePlay} data-testid={`button-play-${clip.id}`}>
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>

        <span className="text-xs text-gray-400 w-10 text-right font-mono">{formatTime(currentTime)}</span>
        <Slider
          value={[currentTime]} min={0} max={duration || 1} step={0.1}
          onValueChange={handleSeek} className="flex-1"
          data-testid={`slider-seek-${clip.id}`}
        />
        <span className="text-xs text-gray-400 w-10 font-mono">{formatTime(duration)}</span>
      </div>

      <div className="flex items-center gap-1 justify-between">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleMute} data-testid={`button-mute-${clip.id}`}>
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]} min={0} max={1} step={0.05}
            onValueChange={handleVolumeChange} className="w-16"
            data-testid={`slider-volume-${clip.id}`}
          />
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost" size="sm"
            onClick={cycleSpeed}
            className="text-xs h-7 px-2 font-mono"
            data-testid={`button-speed-${clip.id}`}
          >
            {playbackRate}x
          </Button>
          <Button
            variant="ghost" size="icon"
            className={`h-7 w-7 ${isLooping ? "text-primary bg-primary/10" : "text-gray-400"}`}
            onClick={() => setIsLooping(!isLooping)}
            data-testid={`button-loop-${clip.id}`}
          >
            <Repeat className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {quizMode && (
        <div className="mt-3 pt-3 border-t space-y-2" data-testid={`quiz-options-${clip.id}`}>
          {quizOptions.map((opt, i) => (
            <button
              key={i}
              onClick={() => { setSelectedAnswer(opt); setShowAnswer(true); }}
              disabled={showAnswer}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                showAnswer && opt === clip.title ? "bg-green-100 text-green-800 border border-green-300" :
                showAnswer && opt === selectedAnswer && opt !== clip.title ? "bg-red-100 text-red-800 border border-red-300" :
                selectedAnswer === opt ? "bg-primary/10 border border-primary/30" :
                "bg-gray-50 hover:bg-gray-100 border border-transparent"
              }`}
              data-testid={`button-quiz-option-${clip.id}-${i}`}
            >
              {showAnswer && opt === clip.title && <CheckCircle2 className="w-4 h-4 inline mr-2 text-green-600" />}
              {showAnswer && opt === selectedAnswer && opt !== clip.title && <XCircle className="w-4 h-4 inline mr-2 text-red-600" />}
              {opt}
            </button>
          ))}
          {showAnswer && (
            <p className="text-xs text-gray-500 mt-2 italic">
              {selectedAnswer === clip.title ? "Correct!" : `The correct answer is: ${clip.title}`}
              {clip.descriptionShort && ` — ${clip.descriptionShort}`}
            </p>
          )}
        </div>
      )}

      {clip.attributionText && (
        <p className="text-[10px] text-gray-400 mt-2 leading-tight">
          {clip.licenseType.replace(/_/g, " ")} — {clip.attributionText}
          {clip.sourceUrl && <> · <a href={clip.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">{t("components.auscultationPlayer.source")}</a></>}
        </p>
      )}
    </div>
  );
}

export function AuscultationPracticeSection({ lessonId }: { lessonId: string }) {
  const [clips, setClips] = useState<AudioClipData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    fetch(`/api/lesson-audio/${lessonId}`)
      .then(r => r.json())
      .then(links => {
        const mapped = links.map((l: any) => ({
          ...l.clip,
          quizPrompt: l.quizPrompt,
          answerKey: l.answerKey,
        }));
        setClips(mapped);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lessonId]);

  if (loading || clips.length === 0) return null;

  return (
    <div className="mb-8" data-testid="section-auscultation-practice">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full text-left mb-4"
        data-testid="button-toggle-auscultation"
      >
        <Stethoscope className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-gray-900 flex-1">{t("components.auscultationPlayer.auscultationAudioPractice")}</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{clips.length} clips</span>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {expanded && (
        <div className="grid gap-3 md:grid-cols-2" data-testid="grid-audio-clips">
          {clips.map(clip => (
            <AudioPlayerCard key={clip.id} clip={clip} allClips={clips} />
          ))}
        </div>
      )}
    </div>
  );
}
