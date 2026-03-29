import { LocaleLink } from "@/lib/LocaleLink";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRoute, useLocation } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  BookOpen,
  Lightbulb,
  Clock,
  Maximize2,
  Minimize2,
  Volume2,
  List,
  X,
  GraduationCap,
  Heart,
  CheckCircle,
} from "lucide-react";
import { lectureData, lectureRegistry, getLecturesForLesson } from "@/data/micro-lectures";
import { Video } from "lucide-react";
import { AdminEditButton } from "@/components/admin-edit-button";
import { ProtectedImage } from "@/components/protected-image";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { slugToDisplayName } from "@/lib/canonical-display";

import { useI18n } from "@/lib/i18n";
export default function LectureViewer() {
  const { t } = useI18n();
  const [, params] = useRoute("/lectures/:slug");
  const [, navigate] = useLocation();
  const slug = params?.slug || "heart-failure";
  const lectureMeta = lectureRegistry.find((l) => l.slug === slug);
  const isVideoLecture = !!lectureMeta?.videoUrl;
  const lecture = isVideoLecture ? null : lectureData[slug];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [showVoiceover, setShowVoiceover] = useState(true);
  const [showNav, setShowNav] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [showPearls, setShowPearls] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [visitedSlides, setVisitedSlides] = useState<Set<number>>(new Set([0]));
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!lecture && !isVideoLecture) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-primary)" }}>
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>{t("pages.lectureViewer.lectureNotFound")}</h2>
            <p style={{ color: "var(--text-secondary)" }}>{t("pages.lectureViewer.theRequestedLectureCouldNot")}</p>
            <Button className="mt-4" onClick={() => navigate("/lectures")} data-testid="button-back-lessons">{t("pages.lectureViewer.backToLectures")}</Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (isVideoLecture && lectureMeta) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-primary)" }}>
        <Navigation />
        <div className="flex-1 flex flex-col">
          <div className="max-w-5xl mx-auto px-4 pt-4">
            <BreadcrumbNav title={lectureMeta.title} />
          </div>
          <div className="w-full" style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }}>
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate("/lectures")} data-testid="button-back-lectures" className="shrink-0">
                <ChevronLeft className="h-4 w-4 mr-1" />Back
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold leading-tight truncate" style={{ color: "var(--text-primary)" }} data-testid="text-lecture-title">
                  {lectureMeta.title}
                </h1>
                <div className="flex items-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <span className="flex items-center gap-1"><Video className="h-3.5 w-3.5" />{t("pages.lectureViewer.videoLecture")}</span>
                  <span className="flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" />{lectureMeta.level}</span>
                  {lectureMeta.free && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">FREE</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto w-full px-4 py-6">
            <Card className="overflow-hidden" style={{ border: "1px solid var(--border-color)" }}>
              <div className="relative bg-black aspect-video">
                <video
                  ref={videoRef}
                  src={lectureMeta.videoUrl}
                  controls
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full h-full"
                  playsInline
                  preload="metadata"
                  data-testid="video-lecture-player"
                >
                  Your browser does not support the video element.
                </video>
              </div>
            </Card>

            <div className="mt-6">
              <Card style={{ border: "1px solid var(--border-color)" }}>
                <CardContent className="p-5">
                  <h2 className="font-semibold text-lg mb-2" style={{ color: "var(--text-primary)" }}>{t("pages.lectureViewer.aboutThisLecture")}</h2>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    This video lecture covers cell anatomy and cellular biology foundations essential for all nursing students. 
                    Topics include organelle structure and function, membrane transport, cell division, and how cellular 
                    processes relate to clinical nursing practice.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}>
                      {lectureMeta.category}
                    </span>
                    {lectureMeta.tiers.map((tier) => (
                      <span key={tier} className="text-xs px-2 py-1 rounded-full uppercase font-medium" style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}>
                        {tier}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const slides = lecture!.slides;
  const totalSlides = slides.length;
  const slide = slides[currentSlide];
  const progress = ((currentSlide + 1) / totalSlides) * 100;

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  useEffect(() => {
    if (isAutoPlay) {
      autoPlayRef.current = setTimeout(() => {
        if (currentSlide < totalSlides - 1) {
          goToSlide(currentSlide + 1);
        } else {
          setIsAutoPlay(false);
        }
      }, 75000);
    }
    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, [isAutoPlay, currentSlide, totalSlides]);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
      setVisitedSlides((prev) => new Set(prev).add(index));
      if (!isTimerRunning) setIsTimerRunning(true);
    }
  }, [totalSlides, isTimerRunning]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goToSlide(currentSlide + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToSlide(currentSlide - 1);
      } else if (e.key === "Escape") {
        setShowNav(false);
        setShowFlashcards(false);
        setShowPearls(false);
        if (isFullscreen) toggleFullscreen();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentSlide, goToSlide, isFullscreen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const toggleFlipCard = (idx: number) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-primary)" }}>
      {!isFullscreen && <Navigation />}

      <div className="flex-1 flex flex-col">
        {!isFullscreen && (
          <div className="max-w-7xl mx-auto px-4 pt-4 w-full">
            <BreadcrumbNav title={lecture!.title} />
          </div>
        )}
        <div className="w-full" style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }}>
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5" style={{ color: "var(--accent-primary)" }} />
              <div>
                <h1 className="text-lg font-bold leading-tight" style={{ color: "var(--text-primary)" }} data-testid="text-lecture-title">{lecture!.title}</h1>
                <div className="flex items-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{lecture!.duration}</span>
                  <span className="flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" />{lecture!.level}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--accent-primary)", color: "white" }} data-testid="text-timer">
                {formatTime(elapsedSeconds)}
              </span>
              <Button variant="outline" size="sm" onClick={() => { setShowFlashcards(!showFlashcards); setShowPearls(false); setShowNav(false); }} data-testid="button-flashcards">
                <BookOpen className="h-4 w-4 mr-1" />Flashcards
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setShowPearls(!showPearls); setShowFlashcards(false); setShowNav(false); }} data-testid="button-pearls">
                <Lightbulb className="h-4 w-4 mr-1" />Pearls
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setShowNav(!showNav); setShowFlashcards(false); setShowPearls(false); }} data-testid="button-slide-nav">
                <List className="h-4 w-4 mr-1" />Slides
              </Button>
            </div>
          </div>
          <div className="h-1 w-full" style={{ backgroundColor: "var(--border-color)" }}>
            <div className="h-full transition-all duration-500 ease-out" style={{ width: `${progress}%`, backgroundColor: "var(--accent-primary)" }} data-testid="progress-bar" />
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-4 py-6 gap-6">
          <div className="flex-1 flex flex-col gap-4">
            <Card className="flex-1 overflow-hidden" style={{ border: "1px solid var(--border-color)" }}>
              <div className="p-2 flex items-center justify-between" style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }}>
                <span className="text-sm font-medium px-2" style={{ color: "var(--text-secondary)" }}>
                  Slide {currentSlide + 1} of {totalSlides}
                </span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setIsAutoPlay(!isAutoPlay)} data-testid="button-autoplay" title={isAutoPlay ? "Stop auto-advance" : "Auto-advance slides"}>
                    {isAutoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={toggleFullscreen} data-testid="button-fullscreen" title={t("pages.lectureViewer.toggleFullscreen")}>
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <CardContent className="p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: "var(--text-primary)" }} data-testid="text-slide-title">
                  {slide.title}
                </h2>
                {slide.image && (
                  <div className="mb-6 flex justify-center">
                    <ProtectedImage
                      src={slide.image}
                      alt={slide.title}
                      className="rounded-xl shadow-md max-h-64 w-auto object-contain"
                      data-testid={`img-slide-${slide.number}`}
                    />
                  </div>
                )}
                <ul className="space-y-3">
                  {slide.bullets.map((bullet, i) => {
                    const isIndented = bullet.startsWith("   ");
                    const cleanBullet = bullet.trimStart();
                    return (
                      <li key={i} className={`flex items-start gap-3 ${isIndented ? "ml-6" : ""}`}>
                        <span className="mt-1.5 flex-shrink-0 h-2 w-2 rounded-full" style={{ backgroundColor: isIndented ? "var(--text-tertiary)" : "var(--accent-primary)" }} />
                        <span className={`leading-relaxed ${isIndented ? "text-sm" : "text-base"}`} style={{ color: isIndented ? "var(--text-secondary)" : "var(--text-primary)" }} data-testid={`text-bullet-${i}`}>
                          {cleanBullet}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between gap-4">
              <Button variant="outline" onClick={() => goToSlide(currentSlide - 1)} disabled={currentSlide === 0} className="flex items-center gap-2" data-testid="button-prev-slide">
                <ChevronLeft className="h-4 w-4" />Previous
              </Button>
              <div className="flex items-center gap-1 overflow-hidden">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    className="h-2 rounded-full transition-all duration-300 cursor-pointer"
                    style={{
                      width: i === currentSlide ? 24 : 8,
                      backgroundColor: i === currentSlide ? "var(--accent-primary)" : visitedSlides.has(i) ? "var(--accent-secondary, var(--accent-primary))" : "var(--border-color)",
                      opacity: i === currentSlide ? 1 : visitedSlides.has(i) ? 0.6 : 0.3,
                    }}
                    data-testid={`dot-slide-${i}`}
                  />
                ))}
              </div>
              <Button variant="outline" onClick={() => goToSlide(currentSlide + 1)} disabled={currentSlide === totalSlides - 1} className="flex items-center gap-2" data-testid="button-next-slide">
                Next<ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {showVoiceover && slide.voiceover && (
              <Card style={{ border: "1px solid var(--border-color)" }}>
                <div className="p-3 flex items-center justify-between" style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }}>
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" style={{ color: "var(--accent-primary)" }} />
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{t("pages.lectureViewer.instructorVoiceoverScript")}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowVoiceover(false)} data-testid="button-hide-voiceover">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-5">
                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--text-secondary)", fontStyle: "italic" }} data-testid="text-voiceover">
                    {slide.voiceover}
                  </p>
                </CardContent>
              </Card>
            )}

            {!showVoiceover && (
              <Button variant="outline" size="sm" onClick={() => setShowVoiceover(true)} className="self-start" data-testid="button-show-voiceover">
                <Volume2 className="h-4 w-4 mr-1" />Show Voiceover Script
              </Button>
            )}
          </div>

          {showNav && (
            <div className="lg:w-72 shrink-0">
              <Card style={{ border: "1px solid var(--border-color)" }}>
                <div className="p-3 flex items-center justify-between" style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }}>
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{t("pages.lectureViewer.slideNavigator")}</span>
                  <Button variant="ghost" size="sm" onClick={() => setShowNav(false)}><X className="h-4 w-4" /></Button>
                </div>
                <CardContent className="p-2 max-h-[60vh] overflow-y-auto">
                  {slides.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { goToSlide(i); setShowNav(false); }}
                      className="w-full text-left p-2.5 rounded-lg transition-colors flex items-start gap-2 text-sm"
                      style={{
                        backgroundColor: i === currentSlide ? "var(--accent-primary)" : "transparent",
                        color: i === currentSlide ? "white" : "var(--text-primary)",
                      }}
                      data-testid={`nav-slide-${i}`}
                    >
                      <span className="font-bold shrink-0 w-5">{i + 1}.</span>
                      <span className="leading-tight">{s.title}</span>
                      {visitedSlides.has(i) && i !== currentSlide && (
                        <CheckCircle className="h-3.5 w-3.5 ml-auto shrink-0 mt-0.5" style={{ color: "var(--accent-primary)" }} />
                      )}
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {showFlashcards && (
          <div className="max-w-7xl mx-auto w-full px-4 pb-8">
            <Card style={{ border: "1px solid var(--border-color)" }}>
              <div className="p-4 flex items-center justify-between" style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }}>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" style={{ color: "var(--accent-primary)" }} />
                  <span className="font-semibold" style={{ color: "var(--text-primary)" }}>Review Flashcards ({lecture!.flashcards.length})</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowFlashcards(false)}><X className="h-4 w-4" /></Button>
              </div>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lecture!.flashcards.map((fc, i) => (
                    <div
                      key={i}
                      onClick={() => toggleFlipCard(i)}
                      className="cursor-pointer rounded-xl p-5 min-h-[140px] flex items-center justify-center text-center transition-all duration-300 hover:shadow-md"
                      style={{
                        backgroundColor: flippedCards.has(i) ? "var(--accent-primary)" : "var(--bg-secondary)",
                        color: flippedCards.has(i) ? "white" : "var(--text-primary)",
                        border: "1px solid var(--border-color)",
                      }}
                      data-testid={`flashcard-${i}`}
                    >
                      <div>
                        <p className="text-xs uppercase tracking-wider mb-2 opacity-70">
                          {flippedCards.has(i) ? "Answer" : "Question"} {i + 1}/{lecture!.flashcards.length}
                        </p>
                        <p className="text-sm leading-relaxed font-medium">
                          {flippedCards.has(i) ? fc.back : fc.front}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {showPearls && (
          <div className="max-w-7xl mx-auto w-full px-4 pb-8">
            <Card style={{ border: "1px solid var(--border-color)" }}>
              <div className="p-4 flex items-center justify-between" style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }}>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" style={{ color: "var(--accent-primary)" }} />
                  <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{t("pages.lectureViewer.clinicalSafetyPearlsMemoryAnchors")}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowPearls(false)}><X className="h-4 w-4" /></Button>
              </div>
              <CardContent className="p-4 space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: "var(--accent-primary)" }}>{t("pages.lectureViewer.safetyPearls")}</h3>
                  <ul className="space-y-2">
                    {lecture!.clinicalSafetyPearls.map((pearl, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm" data-testid={`pearl-${i}`}>
                        <span className="mt-1 flex-shrink-0 h-2 w-2 rounded-full" style={{ backgroundColor: "var(--accent-primary)" }} />
                        <span style={{ color: "var(--text-primary)" }}>{pearl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: "var(--accent-primary)" }}>{t("pages.lectureViewer.memoryAnchors")}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {lecture!.memoryAnchors.map((anchor, i) => (
                      <div key={i} className="rounded-lg p-3 text-sm" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }} data-testid={`anchor-${i}`}>
                        <span style={{ color: "var(--text-primary)" }}>{anchor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {!isFullscreen && lectureMeta && lectureMeta.relatedLessonIds.length > 0 && (
        <div className="max-w-7xl mx-auto w-full px-4 pb-8">
          <Card style={{ border: "1px solid var(--border-color)" }}>
            <div className="p-4" style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }}>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" style={{ color: "var(--accent-primary)" }} />
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{t("pages.lectureViewer.relatedLessons")}</span>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lectureMeta.relatedLessonIds.map((lessonId) => (
                  <LocaleLink key={lessonId} href={`/lessons/${lessonId}`}>
                    <div
                      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:opacity-80"
                      style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
                      data-testid={`related-lesson-${lessonId}`}
                    >
                      <BookOpen className="h-4 w-4 flex-shrink-0" style={{ color: "var(--accent-primary)" }} />
                      <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        {slugToDisplayName(lessonId)}
                      </span>
                      <ChevronRight className="h-4 w-4 ml-auto flex-shrink-0" style={{ color: "var(--text-secondary)" }} />
                    </div>
                  </LocaleLink>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <AdminEditButton pageName="lecture-viewer" />
      {!isFullscreen && <Footer />}
    </div>
  );
}
