import { LocaleLink } from "@/lib/LocaleLink";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, GraduationCap, BookOpen, Video } from "lucide-react";
import { lectureRegistry } from "@/data/micro-lectures";
import { SEO } from "@/components/seo";
import { AdminEditButton } from "@/components/admin-edit-button";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

import { useI18n } from "@/lib/i18n";
export default function LecturesPage() {
  const { t } = useI18n();
  return (
    <>
      <SEO
        title={t("pages.lectures.microlecturesNursenest")}
        description={t("pages.lectures.interactiveSlidebasedMicrolecturesCoveringKe")}
      />
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <BreadcrumbNav />

          <header className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Play className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground" data-testid="text-lectures-title">
                Micro-Lectures
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Interactive slide-based lectures with voiceover scripts, embedded flashcards, and clinical pearls. 
              Each lecture breaks complex topics into visual, digestible segments.
            </p>
          </header>

          {lectureRegistry.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-lg font-semibold mb-2">{t("pages.lectures.comingSoon")}</h2>
                <p className="text-muted-foreground">{t("pages.lectures.microlecturesAreBeingDevelopedCheck")}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {lectureRegistry.map((lecture) => (
                <LocaleLink key={lecture.slug} href={`/lectures/${lecture.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer group border-primary/10" data-testid={`card-lecture-${lecture.slug}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Play className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex gap-1.5 flex-wrap justify-end">
                          {lecture.free && (
                            <Badge className="text-[10px] uppercase bg-green-100 text-green-700 hover:bg-green-100">
                              FREE
                            </Badge>
                          )}
                          {lecture.videoUrl && (
                            <Badge variant="outline" className="text-[10px] uppercase gap-1">
                              <Video className="h-3 w-3" />Video
                            </Badge>
                          )}
                          {lecture.tiers.map((tier) => (
                            <Badge key={tier} variant="secondary" className="text-[10px] uppercase">
                              {tier}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2" data-testid={`text-lecture-title-${lecture.slug}`}>
                        {lecture.title}
                      </h2>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {lecture.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3.5 w-3.5" />
                          {lecture.level}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{lecture.category}</p>
                    </CardContent>
                  </Card>
                </LocaleLink>
              ))}
            </div>
          )}
        </div>
      </main>
      <AdminEditButton pageName="lectures" />
      <Footer />
    </>
  );
}
