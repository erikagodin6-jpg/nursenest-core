import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import {
  Loader2, CheckCircle2, XCircle, ArrowRight, BookOpen,
  Lock, FileText, Layers, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { useI18n } from "@/lib/i18n";
type OptionItem = string | { text: string; label?: string };

interface QuestionPreviewData {
  topicSlug: string;
  topic: string;
  bodySystem: string;
  difficulty: number;
  questionType: string;
  stem: string;
  options: OptionItem[];
  correctIndex: number;
  firstParagraph: string;
  hasMoreRationale: boolean;
  totalQuestions: number;
  relatedTopics: { topicSlug: string; topic: string; questionCount: number }[];
  relatedLessons: { id: string; title: string }[];
  relatedFlashcards: { slug: string; title: string }[];
}

function getOptionText(opt: OptionItem): string {

  if (typeof opt === "string") return opt;
  if (opt && typeof opt === "object" && "text" in opt) return opt.text;
  return String(opt);
}

function DifficultyLabel({ level }: { level: number }) {
  const config = level <= 2
    ? { label: "Foundational", color: "bg-green-100 text-green-700" }
    : level <= 3
    ? { label: "Intermediate", color: "bg-yellow-100 text-yellow-700" }
    : { label: "Advanced", color: "bg-red-100 text-red-700" };
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${config.color}`} data-testid="badge-difficulty">
      {config.label}
    </span>
  );
}

export default function QuestionPreviewPage() {
  const params = useParams<{ slug: string }>();
  const [data, setData] = useState<QuestionPreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (!params.slug) return;
    setLoading(true);
    setSelectedOption(null);
    setAnswered(false);
    fetch(`/api/questions/preview/${params.slug}`)
      .then(r => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(d => { setData(d); setError(null); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [params.slug]);

  const handleSelectOption = (index: number) => {
    if (answered) return;
    setSelectedOption(index);
    setAnswered(true);
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-not-found">{t("pages.questionPreview.questionNotFound")}</h1>
          <p className="text-gray-600 mb-4">{t("pages.questionPreview.theNclexQuestionTopicYoure")}</p>
          <Link href="/" className="inline-block px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:opacity-90" data-testid="link-go-home">
            Go Home
          </Link>
        </div>
      </>
    );
  }

  const topicTitle = data.topic.charAt(0).toUpperCase() + data.topic.slice(1);
  const isCorrect = selectedOption === data.correctIndex;
  const pageTitle = `NCLEX ${topicTitle} Question — Practice with Rationale`;
  const pageDescription = `Practice this NCLEX-style ${topicTitle} question with detailed clinical rationale. Part of ${data.bodySystem} — ${data.totalQuestions} questions available on NurseNest.`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is tested in NCLEX ${topicTitle} questions?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `NCLEX ${topicTitle} questions test your clinical knowledge of ${data.topic} within ${data.bodySystem}. Questions cover assessment, diagnosis, planning, and intervention related to ${data.topic}.`,
        },
      },
      {
        "@type": "Question",
        name: `How many ${topicTitle} practice questions are available?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `NurseNest has ${data.totalQuestions} practice questions on ${topicTitle}, each with detailed clinical rationales to help you understand the reasoning behind the correct answer.`,
        },
      },
    ],
  };

  return (
    <>
      <Navigation />
      <SEO
        title={pageTitle}
        description={pageDescription}
        canonicalPath={`/questions/${data.topicSlug}`}
        structuredData={faqSchema}
        keywords={`NCLEX ${data.topic} question, ${data.topic} nursing question, NCLEX ${data.bodySystem} practice, ${data.topic} rationale`}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Practice Questions", url: "https://www.nursenest.ca/practice-questions" },
          { name: topicTitle, url: `https://www.nursenest.ca/questions/${data.topicSlug}` },
        ]}
      />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white" data-testid="question-preview-page">
        <nav className="bg-white border-b border-gray-100 py-3 px-4" data-testid="breadcrumbs">
          <div className="max-w-3xl mx-auto flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors" data-testid="breadcrumb-home">{t("pages.questionPreview.home")}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/practice-questions" className="hover:text-primary transition-colors" data-testid="breadcrumb-questions">{t("pages.questionPreview.practiceQuestions")}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900 font-medium" data-testid="breadcrumb-current">{topicTitle}</span>
          </div>
        </nav>

        <section className="bg-gradient-to-br from-teal-50 via-white to-blue-50 border-b border-gray-100 py-10 px-4" data-testid="section-hero">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold text-teal-600 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full" data-testid="badge-body-system">
                {data.bodySystem}
              </span>
              <DifficultyLabel level={data.difficulty} />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3" data-testid="text-page-title">
              NCLEX {topicTitle} Question
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed" data-testid="text-page-description">
              Test your knowledge of {data.topic} with this NCLEX-style practice question.
              Select your answer to reveal the clinical rationale.
            </p>
          </div>
        </section>

        <section className="py-8 sm:py-12 px-4" data-testid="section-question">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8" data-testid="card-question">
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t("pages.questionPreview.practiceQuestion")}</span>
                <span className="text-xs text-gray-400">{data.questionType === "multiple_choice" ? "Multiple Choice" : data.questionType}</span>
              </div>

              <p className="text-base sm:text-lg text-gray-800 font-medium mb-6 leading-relaxed" data-testid="text-question-stem">
                {data.stem}
              </p>

              <div className="space-y-3 mb-6" data-testid="options-container">
                {data.options.map((opt, i) => {
                  const isSelected = selectedOption === i;
                  const isAnswer = i === data.correctIndex;
                  let borderColor = "border-gray-200 hover:border-teal-300 hover:bg-teal-50/50";
                  let bgColor = "bg-white";
                  let cursor = "cursor-pointer";

                  if (answered) {
                    cursor = "cursor-default";
                    if (isAnswer) {
                      borderColor = "border-green-400";
                      bgColor = "bg-green-50";
                    } else if (isSelected && !isCorrect) {
                      borderColor = "border-red-400";
                      bgColor = "bg-red-50";
                    } else {
                      borderColor = "border-gray-100";
                    }
                  } else if (isSelected) {
                    borderColor = "border-teal-400";
                    bgColor = "bg-teal-50";
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(i)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl border-2 ${borderColor} ${bgColor} transition-all text-sm sm:text-base flex items-center gap-3 ${cursor}`}
                      disabled={answered}
                      data-testid={`option-${i}`}
                    >
                      <span className="font-bold text-gray-400 w-6 text-center">{String.fromCharCode(65 + i)}.</span>
                      <span className="flex-1">{getOptionText(opt)}</span>
                      {answered && isAnswer && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />}
                      {answered && isSelected && !isCorrect && i === selectedOption && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {!answered && (
                <p className="text-sm text-gray-400 text-center" data-testid="text-prompt">
                  Select an answer to reveal the rationale
                </p>
              )}

              {answered && (
                <div data-testid="section-rationale">
                  <div className={`rounded-xl p-5 mb-4 ${isCorrect ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
                    <h3 className={`text-sm font-bold mb-2 ${isCorrect ? "text-green-800" : "text-amber-800"}`} data-testid="text-result-label">
                      {isCorrect ? "Correct!" : "Incorrect"} — Here's the rationale:
                    </h3>
                    <p className="text-sm text-gray-800 leading-relaxed" data-testid="text-first-paragraph">
                      {data.firstParagraph}
                    </p>
                  </div>

                  {data.hasMoreRationale && (
                    <div className="relative" data-testid="section-blurred-rationale">
                      <div className="bg-gray-50 rounded-xl p-5 filter blur-sm select-none" aria-hidden="true">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          The full clinical rationale continues with detailed explanations of why each incorrect
                          option is wrong, key nursing considerations, and clinical pearls to help you remember
                          this concept. Understanding the complete reasoning behind each answer choice is essential
                          for developing the clinical judgment needed to pass the NCLEX exam.
                        </p>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-xl backdrop-blur-[1px]">
                        <div className="text-center px-4">
                          <Lock className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm font-semibold text-gray-700 mb-4">{t("pages.questionPreview.fullExplanationAvailableWithNursenest")}</p>
                          <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href="/start-free">
                              <Button className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-200" data-testid="button-unlock-explanation">
                                Unlock full explanation
                                <ArrowRight className="w-4 h-4 ml-1" />
                              </Button>
                            </Link>
                            <Link href="/pricing">
                              <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50" data-testid="button-access-questions">
                                Access 3,000+ questions
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {!data.hasMoreRationale && (
                    <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-5 border border-teal-100 text-center" data-testid="section-cta-inline">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Want more practice on {topicTitle}?</p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/start-free">
                          <Button className="bg-teal-600 hover:bg-teal-700 text-white" data-testid="button-unlock-explanation">
                            Unlock full explanation
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                        <Link href="/pricing">
                          <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50" data-testid="button-access-questions">
                            Access 3,000+ questions
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {(data.relatedLessons.length > 0 || data.relatedFlashcards.length > 0) && (
          <section className="py-8 px-4 bg-gray-50" data-testid="section-related-resources">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-5" data-testid="text-related-heading">
                Related Study Resources
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.relatedLessons.map(lesson => (
                  <Link
                    key={lesson.id}
                    href={`/lessons/${lesson.id}`}
                    className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-teal-200 transition-all group"
                    data-testid={`link-lesson-${lesson.id}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-teal-500" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-teal-700 transition-colors truncate">{lesson.title}</h3>
                      <p className="text-xs text-gray-500">{t("pages.questionPreview.lesson")}</p>
                    </div>
                  </Link>
                ))}
                {data.relatedFlashcards.map(deck => (
                  <Link
                    key={deck.slug}
                    href={`/flashcards/deck/${deck.slug}`}
                    className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-blue-200 transition-all group"
                    data-testid={`link-flashcard-${deck.slug}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Layers className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors truncate">{deck.title}</h3>
                      <p className="text-xs text-gray-500">{t("pages.questionPreview.flashcardDeck")}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {data.relatedTopics.length > 0 && (
          <section className="py-8 px-4" data-testid="section-related-topics">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-5" data-testid="text-related-topics-heading">
                More {data.bodySystem} Questions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.relatedTopics.map(rt => (
                  <Link
                    key={rt.topicSlug}
                    href={`/preview/${rt.topicSlug}`}
                    className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-teal-200 transition-all group"
                    data-testid={`link-related-topic-${rt.topicSlug}`}
                  >
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-teal-700 transition-colors capitalize">{rt.topic}</h3>
                      <p className="text-xs text-gray-400">{rt.questionCount} questions</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-teal-500 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-12 bg-gradient-to-br from-teal-50 to-blue-50 border-t border-gray-100" data-testid="section-final-cta">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Master {topicTitle} for Your NCLEX Exam</h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Access {data.totalQuestions}+ questions on {data.topic} with complete rationales,
              adaptive difficulty, and personalized progress tracking.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/start-free">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-base font-semibold shadow-lg shadow-teal-200" size="lg" data-testid="button-final-cta">
                  Start Free <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="/pricing" className="text-teal-600 font-medium hover:text-teal-700 text-sm" data-testid="link-view-pricing">
                View Pricing Plans
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
