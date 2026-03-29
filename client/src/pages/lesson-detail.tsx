import { LocaleLink } from "@/lib/LocaleLink";
import { SeoLessonDetail } from "@/pages/seo-lesson-detail";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { ProtectedContent } from "@/components/protected-content";
import { SEO } from "@/components/seo";
import { AdminEditButton } from "@/components/admin-edit-button";
import { QuickCreatePanel } from "@/components/inline-editor";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, Microscope, AlertCircle, Stethoscope, Pill, Lightbulb, FileText,
  CheckCircle2, XCircle, Trophy, Activity, Heart, Droplets, Brain, Wind, Zap, Baby, Users, Eye, Beaker, Leaf, ShieldAlert,
  ClipboardList, HeartPulse, HandHelping, Search, Lock, StickyNote, Save, Crown, TrendingUp, BarChart3, Pencil, X, Plus, Trash2,
  PlayCircle, Clock, ChevronRight, ChevronLeft, Sparkles, Loader2, Wand2, ArrowRight, GraduationCap, BookOpen, ExternalLink
} from "lucide-react";
import { getLecturesForLesson } from "@/data/micro-lectures";
import { getLessonNavigation, getLessonTier } from "@/lib/lesson-navigation";
import { useToast } from "@/hooks/use-toast";
import { getDifficulty, difficultyConfig } from "@/lib/difficulty";
import { getLessonI18n, loadTranslationLanguage, isTranslationLoaded } from "@/lib/getI18n";
import { useAuth } from "@/lib/auth";
import { getAuthHeaders } from "@/lib/queryClient";
import {
  BackendErrorCodes,
  getLearnerMessageForCode,
  isAuthRequiredCode,
  isLessonNotFoundCode,
  readApiJsonResponse,
} from "@/lib/api-error";
import { canAccessTier, getTierPricingPath, getTierLabel } from "@/lib/access";
import type { LessonContent, QuizQuestion } from "@/data/lessons/types";
import { generateLessonSeoDescription, generateLessonSeoTitle, generateLessonKeywords, buildLessonStructuredData, getLessonBodySystem, buildArticleStructuredData, buildCourseStructuredData, buildLessonFaqFromContent, buildFaqStructuredData, isLessonThinContent } from "@/lib/seo-utils";
import { buildFaqFromQuizQuestions } from "@/lib/structured-data";
import { trackMilestone } from "@/components/upgrade-prompt";
import { getInternalLinksForLesson, getCrossPlatformLinksForLesson } from "@/data/internal-links";
import { getConditionSlugsForLesson } from "@/data/cross-profession-conditions";
import { getConditionBySlug } from "@/data/seo-conditions";
import { LessonQuizEmbed } from "@/components/lesson-quiz-embed";
import { getLessonImage } from "@/lib/system-images";
import { ProtectedImage } from "@/components/protected-image";
import { getImageAltText, getImageTitle, getImageStructuredData, getImageCaption } from "@/lib/image-seo";
import { LessonImageManager } from "@/components/lesson-image-manager";
import { RichTextEditor, RichTextListEditor, RichTextDisplay } from "@/components/rich-text-editor";
import { ContentBlockRenderer, LessonObjectives, ClinicalPearlsList } from "@/components/content-block-renderer";
import { AuscultationSitesDiagram } from "@/components/auscultation-sites-diagram";
import { RespiratorySoundsLibrary } from "@/components/respiratory-sounds-library";
import { useI18n } from "@/lib/i18n";
import { ConversionFunnel, SocialProofBar } from "@/components/conversion-funnel";
import { FixedLessonNav } from "@/components/fixed-lesson-nav";
import { AutoRelatedContent } from "@/components/auto-related-content";
import { MedicalReviewBadge, MedicalReviewJsonLd } from "@/components/medical-review-badge";
import { MedicalReferences } from "@/components/medical-references";

function getCredentials() {
  try {
    return JSON.parse(localStorage.getItem("nursenest-credentials") || "null");
  } catch { return null; }
}

function AdminLessonCreator({ lessonId, existingContent, onPublished }: { lessonId: string; existingContent?: any; onPublished?: () => void }) {
  const displayName = lessonId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  function extractFromBlocks(blocks: any[], heading: string): string[] {
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].type === "heading" && typeof blocks[i].content === "string" && new RegExp(heading, "i").test(blocks[i].content)) {
        const next = blocks[i + 1];
        if (next && (next.type === "list" || next.type === "bulletList") && Array.isArray(next.items)) return next.items;
      }
    }
    return [""];
  }
  function extractParagraphAfterHeading(blocks: any[], heading: string): string {
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].type === "heading" && typeof blocks[i].content === "string" && new RegExp(heading, "i").test(blocks[i].content)) {
        const next = blocks[i + 1];
        if (next && next.type === "paragraph" && next.content) return next.content;
      }
    }
    return "";
  }
  function extractMeds(blocks: any[]): { name: string; type: string; action: string; sideEffects: string; contra: string; pearl: string }[] {
    return blocks.filter(b => b.type === "medication" && b.content).map(b => {
      const lines = b.content.split("\n");
      const nameLine = lines[0] || "";
      const nameMatch = nameLine.match(/^(.+?)\s*\((.+?)\)/);
      return {
        name: nameMatch ? nameMatch[1].trim() : nameLine.trim(),
        type: nameMatch ? nameMatch[2].trim() : "",
        action: (lines.find((l: string) => l.startsWith("Action:")) || "").replace("Action:", "").trim(),
        sideEffects: (lines.find((l: string) => l.startsWith("Side Effects:")) || "").replace("Side Effects:", "").trim(),
        contra: (lines.find((l: string) => l.startsWith("Contraindications:")) || "").replace("Contraindications:", "").trim(),
        pearl: (lines.find((l: string) => l.startsWith("Nursing Pearl:")) || "").replace("Nursing Pearl:", "").trim(),
      };
    });
  }

  const ec = existingContent;
  const ecBlocks = ec && Array.isArray(ec.content) ? ec.content : [];

  const [title, setTitle] = useState(ec?.title || displayName);
  const [summary, setSummary] = useState(ec?.summary || "");
  const [tier, setTier] = useState(ec?.tier || "rpn");
  const [category, setCategory] = useState(ec?.category || "");
  const [status, setStatus] = useState("published");
  const [pathophysiology, setPathophysiology] = useState(ecBlocks.length ? extractParagraphAfterHeading(ecBlocks, "pathophysiology") : "");
  const [riskFactors, setRiskFactors] = useState<string[]>(ecBlocks.length ? extractFromBlocks(ecBlocks, "risk factors") : [""]);
  const [diagnostics, setDiagnostics] = useState<string[]>(ecBlocks.length ? extractFromBlocks(ecBlocks, "diagnostic") : [""]);
  const [management, setManagement] = useState<string[]>(ecBlocks.length ? extractFromBlocks(ecBlocks, "management|medical management") : [""]);
  const [nursingActions, setNursingActions] = useState<string[]>(ecBlocks.length ? extractFromBlocks(ecBlocks, "nursing actions") : [""]);
  const [assessmentFindings, setAssessmentFindings] = useState<string[]>(ecBlocks.length ? extractFromBlocks(ecBlocks, "assessment findings") : [""]);
  const [signsLeft, setSignsLeft] = useState<string[]>(ecBlocks.length ? extractFromBlocks(ecBlocks, "early signs") : [""]);
  const [signsRight, setSignsRight] = useState<string[]>(ecBlocks.length ? extractFromBlocks(ecBlocks, "late.*signs|emergency") : [""]);
  const [medications, setMedications] = useState<{ name: string; type: string; action: string; sideEffects: string; contra: string; pearl: string }[]>([]);
  const [pearls, setPearls] = useState<string[]>([""]);
  const [lifespanContent, setLifespanContent] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [saving, setSaving] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [seoGenerating, setSeoGenerating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const defaultPrompt = `Generate a comprehensive clinical nursing lesson about "${title}". Include:
1. Pathophysiology section with detailed explanation
2. Risk factors (list of 5-8 items)
3. Diagnostic findings (list of 5-8 items)
4. Medical management (list of 5-8 items)
5. Priority nursing actions (list of 5-8 items)
6. Assessment findings: vital signs changes, inspection/auscultation/palpation/percussion findings, lab values, objective/subjective data (list of 5-8 items)
7. Signs and symptoms split into two columns (early signs and late/emergency signs)
8. Key medications with drug name, classification, mechanism of action, side effects, contraindications, and nursing pearl
9. Clinical pearls (3-5 high-yield exam tips)
10. Lifespan considerations

Return as JSON: {"pathophysiology":"...","riskFactors":["..."],"diagnostics":["..."],"management":["..."],"nursingActions":["..."],"assessmentFindings":["..."],"signsLeft":["early sign 1","early sign 2"],"signsRight":["late sign 1","late sign 2"],"medications":[{"name":"...","type":"...","action":"...","sideEffects":"...","contra":"...","pearl":"..."}],"pearls":["..."],"lifespan":"...","summary":"one sentence summary"}`;

  const generateWithAI = async () => {
    const creds = getCredentials();
    if (!creds) { setError("Admin credentials not found"); return; }
    setAiGenerating(true);
    setError("");
    try {
      const finalPrompt = customPrompt.trim()
        ? `${customPrompt.trim()}\n\nTopic: "${title}"\n\nReturn as JSON: {"pathophysiology":"...","riskFactors":["..."],"diagnostics":["..."],"management":["..."],"nursingActions":["..."],"signsLeft":["early sign 1","early sign 2"],"signsRight":["late sign 1","late sign 2"],"medications":[{"name":"...","type":"...","action":"...","sideEffects":"...","contra":"...","pearl":"..."}],"pearls":["..."],"lifespan":"...","summary":"one sentence summary"}`
        : defaultPrompt;

      const res = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: creds.username,
          password: creds.password,
          prompt: finalPrompt,
          mode: "generate",
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "AI generation failed");
      const data = await res.json();
      const blocks = data.blocks || [];
      const jsonBlock = blocks.find((b: any) => b.content && b.content.includes('"pathophysiology"'));
      if (jsonBlock) {
        try {
          const jsonMatch = jsonBlock.content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.pathophysiology) setPathophysiology(parsed.pathophysiology);
            if (parsed.riskFactors?.length) setRiskFactors(parsed.riskFactors);
            if (parsed.diagnostics?.length) setDiagnostics(parsed.diagnostics);
            if (parsed.management?.length) setManagement(parsed.management);
            if (parsed.nursingActions?.length) setNursingActions(parsed.nursingActions);
            if (parsed.assessmentFindings?.length) setAssessmentFindings(parsed.assessmentFindings);
            if (parsed.signsLeft?.length) setSignsLeft(parsed.signsLeft);
            if (parsed.signsRight?.length) setSignsRight(parsed.signsRight);
            if (parsed.medications?.length) setMedications(parsed.medications);
            if (parsed.pearls?.length) setPearls(parsed.pearls);
            if (parsed.lifespan) setLifespanContent(parsed.lifespan);
            if (parsed.summary) setSummary(parsed.summary);
            toast({ title: "AI Content Generated", description: "All sections populated. Review and edit before saving." });
            return;
          }
        } catch {}
      }
      let patho = "";
      const risks: string[] = [];
      const diags: string[] = [];
      const mgmt: string[] = [];
      const nursing: string[] = [];
      const pearlList: string[] = [];
      for (const block of blocks) {
        const c = block.content || "";
        const t = (block.type || "").toLowerCase();
        if (t === "paragraph" && !patho && c.length > 50) {
          patho = c;
        } else if (t === "list" && block.items) {
          if (risks.length === 0) risks.push(...block.items);
          else if (diags.length === 0) diags.push(...block.items);
          else if (mgmt.length === 0) mgmt.push(...block.items);
          else if (nursing.length === 0) nursing.push(...block.items);
        } else if (t === "clinical-pearl") {
          pearlList.push(c);
        }
      }
      if (patho) setPathophysiology(patho);
      if (risks.length) setRiskFactors(risks);
      if (diags.length) setDiagnostics(diags);
      if (mgmt.length) setManagement(mgmt);
      if (nursing.length) setNursingActions(nursing);
      if (pearlList.length) setPearls(pearlList);
      toast({ title: "AI Content Generated", description: "Content populated from AI. Review and edit before saving." });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setAiGenerating(false);
    }
  };

  const generateSEO = async () => {
    const creds = getCredentials();
    if (!creds) { setError("Admin credentials not found"); return; }
    setSeoGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: creds.username,
          password: creds.password,
          title,
          summary,
          tier,
          category,
          content: [
            { type: "heading", content: "Pathophysiology" },
            { type: "paragraph", content: pathophysiology },
            { type: "heading", content: "Risk Factors" },
            { type: "list", items: riskFactors },
            { type: "heading", content: "Clinical Pearls" },
            ...pearls.map((p) => ({ type: "clinical-pearl", content: p })),
          ],
        }),
      });
      if (!res.ok) throw new Error("SEO generation failed");
      const data = await res.json();
      if (data.seoTitle) setSeoTitle(data.seoTitle);
      if (data.seoDescription) setSeoDescription(data.seoDescription);
      if (data.seoKeywords) setSeoKeywords(Array.isArray(data.seoKeywords) ? data.seoKeywords.join(", ") : String(data.seoKeywords));
      toast({ title: "SEO Generated", description: "SEO metadata populated. Review before saving." });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSeoGenerating(false);
    }
  };

  const handleSave = async () => {
    const creds = getCredentials();
    if (!creds) { setError("Admin credentials not found"); return; }
    if (!title.trim()) { setError("Title is required"); return; }
    if (!tier.trim()) { setError("Tier is required (rpn, rn, or np)"); return; }
    if (!category.trim() || category.toLowerCase() === "general") { setError("A specific body system or category is required"); return; }
    const totalContent = [pathophysiology, ...riskFactors, ...diagnostics, ...management, ...nursingActions, ...assessmentFindings, ...signsLeft, ...signsRight, ...pearls, lifespanContent].join(" ");
    if (totalContent.length < 200) { setError("Lesson content must be at least 200 characters. Add more detail to the pathophysiology, risk factors, or other sections."); return; }
    setSaving(true);
    setError("");
    try {
      const contentBlocks: any[] = [];
      if (pathophysiology) {
        contentBlocks.push({ type: "heading", content: "Pathophysiology" });
        contentBlocks.push({ type: "paragraph", content: pathophysiology });
      }
      if (riskFactors.some((r) => r.trim())) {
        contentBlocks.push({ type: "heading", content: "Risk Factors" });
        contentBlocks.push({ type: "list", items: riskFactors.filter((r) => r.trim()) });
      }
      if (diagnostics.some((d) => d.trim())) {
        contentBlocks.push({ type: "heading", content: "Diagnostic Findings" });
        contentBlocks.push({ type: "list", items: diagnostics.filter((d) => d.trim()) });
      }
      if (management.some((m) => m.trim())) {
        contentBlocks.push({ type: "heading", content: "Medical Management" });
        contentBlocks.push({ type: "list", items: management.filter((m) => m.trim()) });
      }
      if (nursingActions.some((n) => n.trim())) {
        contentBlocks.push({ type: "heading", content: "Priority Nursing Actions" });
        contentBlocks.push({ type: "list", items: nursingActions.filter((n) => n.trim()) });
      }
      if (assessmentFindings.some((a) => a.trim())) {
        contentBlocks.push({ type: "heading", content: "Assessment Findings" });
        contentBlocks.push({ type: "list", items: assessmentFindings.filter((a) => a.trim()) });
      }
      if (signsLeft.some((s) => s.trim()) || signsRight.some((s) => s.trim())) {
        contentBlocks.push({ type: "heading", content: "Signs & Symptoms" });
        if (signsLeft.some((s) => s.trim())) {
          contentBlocks.push({ type: "heading", content: "Early Signs" });
          contentBlocks.push({ type: "list", items: signsLeft.filter((s) => s.trim()) });
        }
        if (signsRight.some((s) => s.trim())) {
          contentBlocks.push({ type: "heading", content: "Late/Emergency Signs" });
          contentBlocks.push({ type: "list", items: signsRight.filter((s) => s.trim()) });
        }
      }
      if (medications.length > 0) {
        contentBlocks.push({ type: "heading", content: "Medications" });
        for (const med of medications) {
          contentBlocks.push({
            type: "medication",
            content: `${med.name} (${med.type})\nAction: ${med.action}\nSide Effects: ${med.sideEffects}\nContraindications: ${med.contra}\nNursing Pearl: ${med.pearl}`,
          });
        }
      }
      for (const pearl of pearls.filter((p) => p.trim())) {
        contentBlocks.push({ type: "clinical-pearl", content: pearl });
      }
      if (lifespanContent) {
        contentBlocks.push({ type: "heading", content: "Across the Lifespan" });
        contentBlocks.push({ type: "paragraph", content: lifespanContent });
      }

      const slug = lessonId;
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: creds.username,
          password: creds.password,
          title,
          slug,
          type: "lesson",
          summary: summary || null,
          tier,
          status,
          category: category || "General",
          content: contentBlocks,
          seoTitle: seoTitle || null,
          seoDescription: seoDescription || null,
          seoKeywords: seoKeywords ? seoKeywords.split(",").map((k: string) => k.trim()).filter(Boolean) : [],
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to create lesson");
      }
      setSuccess(true);
      toast({ title: "Lesson Published", description: "The lesson is now live and visible to students." });
      setTimeout(() => {
        if (onPublished) {
          onPublished();
        }
      }, 1500);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const addListItem = (list: string[], setList: (v: string[]) => void) => {
    setList([...list, ""]);
  };

  const updateListItem = (list: string[], setList: (v: string[]) => void, index: number, value: string) => {
    const updated = [...list];
    updated[index] = value;
    setList(updated);
  };

  const removeListItem = (list: string[], setList: (v: string[]) => void, index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const addMedication = () => {
    setMedications([...medications, { name: "", type: "", action: "", sideEffects: "", contra: "", pearl: "" }]);
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  if (success) {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
        <Navigation />
        <main className="max-w-2xl mx-auto px-4 py-20 w-full text-center space-y-6">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-lesson-created">{t("pages.lessonDetail.lessonCreated")}</h1>
          <p className="text-gray-600">{t("pages.lessonDetail.theLessonIsBeingLoaded")}</p>
        </main>
        <Footer />
      </div>
    );
  }

  function ListEditor({ items, setItems, placeholder }: { items: string[]; setItems: (v: string[]) => void; placeholder: string }) {
    return (
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => updateListItem(items, setItems, i, e.target.value)}
              placeholder={placeholder}
              className="flex-1"
              data-testid={`input-list-item-${i}`}
            />
            {items.length > 1 && (
              <Button variant="ghost" size="sm" onClick={() => removeListItem(items, setItems, i)} data-testid={`button-remove-item-${i}`}>
                <Trash2 className="w-4 h-4 text-red-400" />
              </Button>
            )}
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => addListItem(items, setItems)} className="gap-1" data-testid="button-add-item">
          <Plus className="w-3 h-3" /> Add Item
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-10 w-full space-y-6" data-testid="admin-lesson-creator">
        <LocaleLink href="/lessons">
          <Button variant="ghost" className="mb-4 group" data-testid="button-back-lessons">
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Lessons
          </Button>
        </LocaleLink>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Crown className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-amber-800">{t("pages.lessonDetail.adminCreateNewLesson")}</p>
            <p className="text-sm text-amber-700">{t("pages.lessonDetail.thisLessonDoesntExistYet")}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm" data-testid="text-error">{error}</div>
        )}

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{t("pages.lessonDetail.lessonDetails")}</h2>
              <Button onClick={handleSave} disabled={saving} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white" data-testid="button-save-lesson">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving..." : "Save & Publish"}
              </Button>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <label className="text-sm font-semibold text-purple-800">{t("pages.lessonDetail.aiContentGeneration")}</label>
              </div>
              <Textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={4}
                placeholder={t("pages.lessonDetail.enterACustomPromptFor")}
                className="text-sm bg-white border-purple-200 placeholder:text-purple-300"
                data-testid="input-custom-ai-prompt"
              />
              <div className="flex items-center gap-3">
                <Button onClick={generateWithAI} disabled={aiGenerating} className="gap-2 bg-purple-600 hover:bg-purple-700" data-testid="button-ai-generate">
                  {aiGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {aiGenerating ? "Generating..." : "Generate with AI"}
                </Button>
                {customPrompt.trim() && (
                  <span className="text-xs text-purple-600">{t("pages.lessonDetail.usingCustomPrompt")}</span>
                )}
                {!customPrompt.trim() && (
                  <span className="text-xs text-gray-400">{t("pages.lessonDetail.usingDefaultTemplate")}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t("pages.lessonDetail.title")}</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("pages.lessonDetail.lessonTitle")} data-testid="input-lesson-title" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t("pages.lessonDetail.category")}</label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Respiratory, Cardiovascular..." data-testid="input-lesson-category" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t("pages.lessonDetail.summary")}</label>
              <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} placeholder={t("pages.lessonDetail.briefClinicalSummaryOfThis")} data-testid="input-lesson-summary" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t("pages.lessonDetail.tier")}</label>
                <Select value={tier} onValueChange={setTier}>
                  <SelectTrigger data-testid="select-lesson-tier"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">FREE</SelectItem>
                    <SelectItem value="rpn">RPN</SelectItem>
                    <SelectItem value="rn">RN</SelectItem>
                    <SelectItem value="np">NP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t("pages.lessonDetail.status")}</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger data-testid="select-lesson-status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">{t("pages.lessonDetail.draft")}</SelectItem>
                    <SelectItem value="published">{t("pages.lessonDetail.published")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <LessonImageManager lessonId={lessonId} section="header" isAdmin={true} isEditing={true} />

        <div className="space-y-12">
          <section id="pathophysiology" className="space-y-6">
            <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
              <Microscope className="text-primary w-8 h-8" />
              <h2>{t("pages.lessonDetail.pathophysiology")}</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">{t("pages.lessonDetail.pathophysiologyAtTheCellularLevel")}</p>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <Textarea
                value={pathophysiology}
                onChange={(e) => setPathophysiology(e.target.value)}
                rows={6}
                placeholder={t("pages.lessonDetail.describeTheUnderlyingPathophysiologyCellular")}
                className="border-none shadow-none p-0 focus-visible:ring-0 text-gray-700 leading-relaxed resize-y"
                data-testid="input-pathophysiology"
              />
            </div>
            <LessonImageManager lessonId={lessonId} section="pathophysiology" isAdmin={true} isEditing={true} />
          </section>

          <section id="risk-factors" className="space-y-6">
            <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
              <ShieldAlert className="text-rose-500 w-8 h-8" />
              <h2>{t("pages.lessonDetail.riskFactors")}</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">{t("pages.lessonDetail.keyPredisposingAndContributingFactors")}</p>
            <Card className="border-none shadow-sm bg-rose-50/60">
              <CardContent className="p-8">
                <ListEditor items={riskFactors} setItems={setRiskFactors} placeholder={t("pages.lessonDetail.enterRiskFactor")} />
              </CardContent>
            </Card>
            <LessonImageManager lessonId={lessonId} section="risk-factors" isAdmin={true} isEditing={true} />
          </section>

          <section id="diagnostics" className="space-y-6">
            <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
              <Search className="text-cyan-600 w-8 h-8" />
              <h2>{t("pages.lessonDetail.diagnostics")}</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">{t("pages.lessonDetail.confirmatoryFindingsAndExpectedResults")}</p>
            <Card className="border-none shadow-sm bg-cyan-50/60">
              <CardContent className="p-8">
                <ListEditor items={diagnostics} setItems={setDiagnostics} placeholder={t("pages.lessonDetail.enterDiagnosticFinding")} />
              </CardContent>
            </Card>
            <LessonImageManager lessonId={lessonId} section="diagnostics" isAdmin={true} isEditing={true} />
          </section>

          <section id="management" className="space-y-6">
            <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
              <ClipboardList className="text-emerald-600 w-8 h-8" />
              <h2>{t("pages.lessonDetail.management")}</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">{t("pages.lessonDetail.evidenceinformedInterventionsAndMonitoring")}</p>
            <Card className="border-none shadow-sm bg-emerald-50/60">
              <CardContent className="p-8">
                <ListEditor items={management} setItems={setManagement} placeholder={t("pages.lessonDetail.enterManagementStep")} />
              </CardContent>
            </Card>
            <LessonImageManager lessonId={lessonId} section="management" isAdmin={true} isEditing={true} />
          </section>

          <section id="nursing-actions" className="space-y-6">
            <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
              <HeartPulse className="text-violet-600 w-8 h-8" />
              <h2>{t("pages.lessonDetail.nursingActionsAndScopeConsiderations")}</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">{t("pages.lessonDetail.priorityAssessmentsInterventionsAndEscalatio")}</p>
            <Card className="border-none shadow-sm bg-violet-50/60">
              <CardContent className="p-8">
                <ListEditor items={nursingActions} setItems={setNursingActions} placeholder={t("pages.lessonDetail.enterNursingAction")} />
              </CardContent>
            </Card>
            <LessonImageManager lessonId={lessonId} section="nursing-actions" isAdmin={true} isEditing={true} />
          </section>

          <section id="assessment-findings" className="space-y-6">
            <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
              <ClipboardList className="text-teal-600 w-8 h-8" />
              <h2>{t("pages.lessonDetail.assessmentFindings")}</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">{t("pages.lessonDetail.keyNursingAssessmentDataVital")}</p>
            <Card className="border-none shadow-sm bg-teal-50/60">
              <CardContent className="p-8">
                <ListEditor items={assessmentFindings} setItems={setAssessmentFindings} placeholder={t("pages.lessonDetail.enterAssessmentFinding")} />
              </CardContent>
            </Card>
            <LessonImageManager lessonId={lessonId} section="assessment-findings" isAdmin={true} isEditing={true} />
          </section>

          <section id="lifespan" className="space-y-6">
            <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
              <Users className="text-indigo-500 w-8 h-8" />
              <h2>{t("pages.lessonDetail.acrossTheLifespan")}</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">{t("pages.lessonDetail.agespecificClinicalVariationsAndSafety")}</p>
            <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100">
              <Textarea
                value={lifespanContent}
                onChange={(e) => setLifespanContent(e.target.value)}
                rows={4}
                placeholder={t("pages.lessonDetail.considerationsForPediatricAdultAnd")}
                className="border-none shadow-none p-0 focus-visible:ring-0 text-indigo-900 leading-relaxed italic resize-y bg-transparent"
                data-testid="input-lifespan"
              />
            </div>
            <LessonImageManager lessonId={lessonId} section="lifespan" isAdmin={true} isEditing={true} />
          </section>

          <section id="clinical-findings" className="space-y-6">
            <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
              <AlertCircle className="text-orange-500 w-8 h-8" />
              <h2>{t("pages.lessonDetail.clinicalFindingsAndRedFlags")}</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">{t("pages.lessonDetail.keyClinicalPresentationsAndWarning")}</p>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-none shadow-md bg-white">
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
                    <AlertCircle className="text-blue-500 w-6 h-6" />
                    <h3>{t("pages.lessonDetail.clinicalFindings")}</h3>
                  </div>
                  <ListEditor items={signsLeft} setItems={setSignsLeft} placeholder={t("pages.lessonDetail.enterEarlySign")} />
                </CardContent>
              </Card>
              <Card className="border-none shadow-md bg-white border-l-4 border-l-orange-400">
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
                    <AlertCircle className="text-orange-500 w-6 h-6" />
                    <h3>{t("pages.lessonDetail.redFlagsWhenToEscalate")}</h3>
                  </div>
                  <ListEditor items={signsRight} setItems={setSignsRight} placeholder={t("pages.lessonDetail.enterLateemergencySign")} />
                </CardContent>
              </Card>
            </div>
            <LessonImageManager lessonId={lessonId} section="clinical-findings" isAdmin={true} isEditing={true} />
          </section>

          <section id="pharmacology" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                  <Pill className="text-primary w-8 h-8" />
                  <h2>{t("pages.lessonDetail.pharmacologyAndSafety")}</h2>
                </div>
                <p className="text-sm text-gray-500 mt-1">{t("pages.lessonDetail.medicationsMechanismsAndSafetyConsiderations")}</p>
              </div>
              <Button variant="outline" size="sm" onClick={addMedication} className="gap-1" data-testid="button-add-medication">
                <Plus className="w-3 h-3" /> Add Medication
              </Button>
            </div>
            <div className="space-y-4">
              {medications.map((med, i) => (
                <Card key={i} className="border-none shadow-sm bg-white overflow-hidden text-gray-900" data-testid={`medication-card-${i}`}>
                  <div className="bg-primary/5 px-6 py-3 border-b border-primary/10 flex items-center justify-between">
                    <div className="flex gap-2 flex-1">
                      <Input value={med.name} onChange={(e) => updateMedication(i, "name", e.target.value)} placeholder={t("pages.lessonDetail.drugName")} className="font-bold w-40" data-testid={`input-med-name-${i}`} />
                      <Input value={med.type} onChange={(e) => updateMedication(i, "type", e.target.value)} placeholder={t("pages.lessonDetail.classification")} className="w-32" data-testid={`input-med-type-${i}`} />
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-600" onClick={() => removeMedication(i)} data-testid={`button-remove-med-${i}`}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6 grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-gray-400 uppercase">{t("pages.lessonDetail.action")}</p>
                      <Input value={med.action} onChange={(e) => updateMedication(i, "action", e.target.value)} placeholder={t("pages.lessonDetail.mechanismOfAction")} data-testid={`input-med-action-${i}`} />
                      <p className="text-sm font-bold text-gray-400 uppercase pt-2">{t("pages.lessonDetail.sideEffects")}</p>
                      <Input value={med.sideEffects} onChange={(e) => updateMedication(i, "sideEffects", e.target.value)} placeholder={t("pages.lessonDetail.sideEffects4")} data-testid={`input-med-side-${i}`} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-gray-400 uppercase">{t("pages.lessonDetail.contraindications")}</p>
                      <Input value={med.contra} onChange={(e) => updateMedication(i, "contra", e.target.value)} placeholder={t("pages.lessonDetail.contraindications4")} data-testid={`input-med-contra-${i}`} />
                      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100 flex gap-2 items-center">
                        <Lightbulb className="w-5 h-5 text-yellow-600 shrink-0" />
                        <Input value={med.pearl} onChange={(e) => updateMedication(i, "pearl", e.target.value)} placeholder={t("pages.lessonDetail.nursingPearl")} className="text-sm border-none shadow-none p-0 focus-visible:ring-0 bg-transparent" data-testid={`input-med-pearl-${i}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {medications.length === 0 && (
                <Card className="border-none shadow-sm bg-white">
                  <CardContent className="p-8 text-center">
                    <p className="text-sm text-gray-400">{t("pages.lessonDetail.noMedicationsAddedClickAdd")}</p>
                  </CardContent>
                </Card>
              )}
            </div>
            <LessonImageManager lessonId={lessonId} section="pharmacology" isAdmin={true} isEditing={true} />
          </section>

          <section id="exam-readiness" className="bg-gray-900 text-white p-10 rounded-3xl space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 text-2xl font-bold">
              <FileText className="text-primary w-8 h-8" />
              <h2>{t("pages.lessonDetail.examReadiness")}</h2>
            </div>
            <div className="space-y-4">
              <h4 className="text-primary font-bold uppercase tracking-widest text-sm">{t("pages.lessonDetail.clinicalPearlsPriorityLogic")}</h4>
              <div className="space-y-2">
                {pearls.map((pearl, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-2" />
                    <div className="flex gap-2 flex-1">
                      <Input
                        value={pearl}
                        onChange={(e) => { const updated = [...pearls]; updated[i] = e.target.value; setPearls(updated); }}
                        placeholder={t("pages.lessonDetail.enterClinicalPearl")}
                        className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
                        data-testid={`input-pearl-${i}`}
                      />
                      {pearls.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => setPearls(pearls.filter((_, idx) => idx !== i))} className="text-gray-500 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => setPearls([...pearls, ""])} className="gap-1 border-gray-700 text-gray-400 hover:text-white mt-2" data-testid="button-add-pearl">
                  <Plus className="w-3 h-3" /> Add Pearl
                </Button>
              </div>
            </div>
          </section>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-bold">{t("pages.lessonDetail.seoMetadata")}</h2>
              </div>
              <Button onClick={generateSEO} disabled={seoGenerating} variant="outline" className="gap-2" data-testid="button-generate-seo">
                {seoGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                {seoGenerating ? "Generating..." : "Generate SEO"}
              </Button>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t("pages.lessonDetail.seoTitle")}</label>
              <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder={t("pages.lessonDetail.seooptimizedPageTitle")} data-testid="input-seo-title" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t("pages.lessonDetail.seoDescription")}</label>
              <Textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={2} placeholder={t("pages.lessonDetail.metaDescriptionForSearchEngines")} data-testid="input-seo-description" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t("pages.lessonDetail.seoKeywords")}</label>
              <Input value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder={t("pages.lessonDetail.commaseparatedKeywords")} data-testid="input-seo-keywords" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pb-10">
          <Button variant="outline" onClick={() => setLocation("/lessons")} data-testid="button-cancel-create">{t("pages.lessonDetail.cancel")}</Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2 px-8 bg-emerald-600 hover:bg-emerald-700 text-white" data-testid="button-save-lesson-bottom">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save & Publish"}
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function EditableText({ value, onChange, multiline = false, className = "" }: { value: string; onChange: (v: string) => void; multiline?: boolean; className?: string }) {
  if (multiline) {
    return <RichTextEditor value={value} onChange={onChange} className={className} minHeight="120px" />;
  }
  return <Input value={value} onChange={(e) => onChange(e.target.value)} className={className} />;
}

function EditableList({ items, onChange, placeholder = "Enter item..." }: { items: string[]; onChange: (items: string[]) => void; placeholder?: string }) {
  return <RichTextListEditor items={items} onChange={onChange} placeholder={placeholder} />;
}

function VitalSignsReferenceCharts() {
  const vitalSignsData = [
    { ageGroup: "Newborn (0-28 days)", hr: "120-160", rr: "30-60", sbp: "60-80", dbp: "35-55", temp: "36.5-37.5°C", spo2: "≥95%" },
    { ageGroup: "Infant (1-12 months)", hr: "100-150", rr: "25-50", sbp: "70-100", dbp: "40-65", temp: "36.5-37.5°C", spo2: "≥95%" },
    { ageGroup: "Toddler (1-3 years)", hr: "90-140", rr: "20-30", sbp: "80-110", dbp: "50-75", temp: "36.5-37.5°C", spo2: "≥95%" },
    { ageGroup: "Preschool (3-5 years)", hr: "80-120", rr: "20-28", sbp: "85-110", dbp: "50-75", temp: "36.5-37.5°C", spo2: "≥95%" },
    { ageGroup: "School Age (6-12 years)", hr: "70-110", rr: "18-25", sbp: "90-120", dbp: "55-80", temp: "36.5-37.5°C", spo2: "≥95%" },
    { ageGroup: "Adolescent (13-17 years)", hr: "60-100", rr: "12-20", sbp: "100-130", dbp: "60-85", temp: "36.5-37.5°C", spo2: "≥95%" },
    { ageGroup: "Adult (18-64 years)", hr: "60-100", rr: "12-20", sbp: "90-140", dbp: "60-90", temp: "36.1-37.2°C", spo2: "≥95%" },
    { ageGroup: "Older Adult (65+ years)", hr: "60-100", rr: "12-20", sbp: "90-150", dbp: "60-90", temp: "35.8-36.9°C", spo2: "≥93%" },
  ];

  const redFlagsByAge = [
    {
      group: "Newborn & Infant",
      flags: [
        "HR < 100 or > 180 bpm  -  consider sepsis, dehydration, or cardiac anomaly",
        "RR > 60  -  assess for respiratory distress syndrome, TTN, or congenital anomaly",
        "Temperature < 36.0°C or > 38.0°C  -  infection risk highest in neonates",
        "Capillary refill > 3 seconds  -  perfusion concern",
        "SBP < 60 mmHg (newborn) or < 70 mmHg (infant)  -  shock"
      ]
    },
    {
      group: "Toddler & Preschool",
      flags: [
        "HR > 150  -  rule out fever, pain, dehydration, or cardiac cause",
        "RR > 40  -  respiratory distress; assess for retractions, nasal flaring, grunting",
        "SBP < 70 + (2 × age in years)  -  hypotension formula for ages 1-10",
        "Temperature > 39°C  -  assess for febrile seizure risk (6 months-5 years)",
        "SpO2 < 94%  -  supplemental O2 and escalation"
      ]
    },
    {
      group: "School Age & Adolescent",
      flags: [
        "HR < 50 or > 130  -  evaluate for cardiac arrhythmia, substance use, or anxiety vs. true pathology",
        "RR > 28  -  consider asthma exacerbation, DKA, or panic attack",
        "SBP > 130 or < 80  -  assess for hypertensive emergency or hemorrhage",
        "New-onset orthostatic hypotension  -  dehydration, eating disorder, or cardiac",
        "Temperature > 40°C  -  aggressive cooling and investigation"
      ]
    },
    {
      group: "Adult",
      flags: [
        "HR < 40 or > 130  -  immediate RRT activation",
        "RR < 8 or > 28  -  most predictive sign of deterioration",
        "SBP < 90 or > 180 mmHg  -  hemodynamic emergency",
        "SpO2 < 90% (< 88% in COPD)  -  supplemental O2 and escalation",
        "Temperature > 38.5°C with tachycardia  -  sepsis screening (qSOFA)"
      ]
    },
    {
      group: "Older Adult (65+)",
      flags: [
        "Baseline may be lower  -  'normal' BP of 150/80 may be their norm; acute drop is the red flag",
        "Blunted febrile response  -  infection without fever is common; assess WBC and mental status",
        "New confusion or agitation  -  may be the ONLY sign of UTI, pneumonia, or MI",
        "Orthostatic hypotension  -  fall risk; hold antihypertensives and reassess",
        "SpO2 < 93%  -  lower threshold for escalation due to reduced reserve"
      ]
    }
  ];

  return (
    <section id="vital-signs-charts" className="space-y-6" data-testid="vital-signs-reference-charts">
      <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
        <HeartPulse className="text-red-500 w-8 h-8" />
        <h2>{t("pages.lessonDetail.normalVitalSignsReferenceCharts")}</h2>
      </div>
      <p className="text-sm text-gray-500 mt-1">{t("pages.lessonDetail.agespecificNormalRangesForClinical")}</p>

      <Card className="border-none shadow-md bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="table-vital-signs-ranges">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                  <th className="text-left px-4 py-3 font-bold text-gray-800 whitespace-nowrap">{t("pages.lessonDetail.ageGroup")}</th>
                  <th className="text-center px-3 py-3 font-bold text-gray-800">
                    <div className="flex flex-col items-center gap-0.5">
                      <Heart className="w-4 h-4 text-red-400" />
                      <span>{t("pages.lessonDetail.hrBpm")}</span>
                    </div>
                  </th>
                  <th className="text-center px-3 py-3 font-bold text-gray-800">
                    <div className="flex flex-col items-center gap-0.5">
                      <Wind className="w-4 h-4 text-blue-400" />
                      <span>{t("pages.lessonDetail.rrMin")}</span>
                    </div>
                  </th>
                  <th className="text-center px-3 py-3 font-bold text-gray-800">
                    <div className="flex flex-col items-center gap-0.5">
                      <Activity className="w-4 h-4 text-purple-400" />
                      <span>{t("pages.lessonDetail.sbpMmhg")}</span>
                    </div>
                  </th>
                  <th className="text-center px-3 py-3 font-bold text-gray-800">
                    <div className="flex flex-col items-center gap-0.5">
                      <Activity className="w-4 h-4 text-indigo-400" />
                      <span>{t("pages.lessonDetail.dbpMmhg")}</span>
                    </div>
                  </th>
                  <th className="text-center px-3 py-3 font-bold text-gray-800">
                    <div className="flex flex-col items-center gap-0.5">
                      <Zap className="w-4 h-4 text-orange-400" />
                      <span>{t("pages.lessonDetail.tempC")}</span>
                    </div>
                  </th>
                  <th className="text-center px-3 py-3 font-bold text-gray-800">
                    <div className="flex flex-col items-center gap-0.5">
                      <Droplets className="w-4 h-4 text-cyan-400" />
                      <span>{t("pages.lessonDetail.spo2")}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {vitalSignsData.map((row, i) => (
                  <tr key={row.ageGroup} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-blue-50/50 transition-colors`}>
                    <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">{row.ageGroup}</td>
                    <td className="text-center px-3 py-3 text-gray-700 font-medium">{row.hr}</td>
                    <td className="text-center px-3 py-3 text-gray-700 font-medium">{row.rr}</td>
                    <td className="text-center px-3 py-3 text-gray-700 font-medium">{row.sbp}</td>
                    <td className="text-center px-3 py-3 text-gray-700 font-medium">{row.dbp}</td>
                    <td className="text-center px-3 py-3 text-gray-700 font-medium">{row.temp}</td>
                    <td className="text-center px-3 py-3 text-gray-700 font-medium">{row.spo2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 bg-amber-50 border-t border-amber-100">
            <p className="text-xs text-amber-700 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              Values are general ranges. Always compare to the individual patient's baseline. Ranges may vary slightly by source.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3 text-xl font-bold text-gray-900 mt-8">
        <ShieldAlert className="text-orange-500 w-7 h-7" />
        <h3>{t("pages.lessonDetail.agespecificRedFlagsEscalationTriggers")}</h3>
      </div>
      <p className="text-sm text-gray-500 mt-1">{t("pages.lessonDetail.whenToEscalateCriticalThresholds")}</p>

      <div className="grid md:grid-cols-2 gap-4">
        {redFlagsByAge.map((section) => (
          <Card key={section.group} className="border-none shadow-md bg-white" data-testid={`card-red-flags-${section.group.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                {section.group.includes("Newborn") && <Baby className="w-5 h-5 text-pink-500" />}
                {section.group.includes("Toddler") && <Baby className="w-5 h-5 text-purple-500" />}
                {section.group.includes("School") && <Users className="w-5 h-5 text-blue-500" />}
                {section.group === "Adult" && <HeartPulse className="w-5 h-5 text-red-500" />}
                {section.group.includes("Older") && <Users className="w-5 h-5 text-amber-600" />}
                <h4 className="font-bold text-gray-800">{section.group}</h4>
              </div>
              <ul className="space-y-2">
                {section.flags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <AlertCircle className="w-3.5 h-3.5 text-orange-400 mt-0.5 flex-shrink-0" />
                    <RichTextDisplay html={flag} />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function IsolationTypesGuide() {
  const isolationTypes = [
    {
      type: "Standard Precautions",
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
      headerBg: "bg-green-100",
      applies: "ALL patients, ALL encounters, regardless of diagnosis",
      when: "Every patient interaction  -  the baseline for all care",
      ppe: ["Gloves (when touching blood/body fluids/mucous membranes)", "Gown (if splashing anticipated)", "Mask + eye protection (if splash/spray risk)", "Hand hygiene before and after every contact"],
      room: "No special room required",
      examples: ["Every patient in every setting", "Routine vital signs with intact skin  -  gloves optional, hand hygiene mandatory", "Blood draw, wound care, suctioning  -  gloves required"],
      keyPoints: ["Foundation of ALL infection prevention", "Treats every patient as potentially infectious", "Hand hygiene is the single most important measure"]
    },
    {
      type: "Contact Precautions",
      color: "bg-yellow-50 border-yellow-200",
      iconColor: "text-yellow-600",
      headerBg: "bg-yellow-100",
      applies: "Organisms spread by direct or indirect physical contact",
      when: "Known or suspected infection with contact-transmitted organisms",
      ppe: ["Gown  -  don before entering the room", "Gloves  -  don before entering the room", "Remove PPE before leaving the room", "Hand hygiene immediately after removal"],
      room: "Private room preferred; cohort patients with same organism if unavailable",
      examples: ["MRSA (Methicillin-Resistant Staphylococcus aureus)", "VRE (Vancomycin-Resistant Enterococcus)", "C. difficile (Clostridioides difficile)  -  use SOAP & WATER, not alcohol rub", "Scabies, lice (pediculosis)", "Draining wounds with heavy drainage not contained by dressing", "RSV (Respiratory Syncytial Virus) in infants", "Norovirus, Rotavirus"],
      keyPoints: ["Dedicated equipment (stethoscope, BP cuff) stays in the room", "C. difficile spores resist alcohol  -  ONLY soap and water works", "Patient transport: cover infected area, clean surfaces after contact"]
    },
    {
      type: "Droplet Precautions",
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
      headerBg: "bg-blue-100",
      applies: "Organisms spread by large respiratory droplets (>5 microns) that travel 3-6 feet",
      when: "Known or suspected infection with droplet-transmitted organisms",
      ppe: ["Surgical mask  -  don before entering the room", "Eye protection if splash risk", "Gloves and gown per standard precautions as needed"],
      room: "Private room preferred; maintain ≥3 feet between patients if cohorting; door may remain open",
      examples: ["Influenza (seasonal flu)", "Pertussis (whooping cough)", "Bacterial meningitis (Neisseria meningitidis)", "Mumps", "Rubella (German measles)", "Group A Streptococcus (pharyngitis, scarlet fever)", "Respiratory infections caused by adenovirus, rhinovirus"],
      keyPoints: ["Surgical mask is sufficient  -  N95 is NOT required", "Patient wears surgical mask during transport", "Droplets fall to surfaces quickly  -  do not remain airborne", "Negative pressure room is NOT needed"]
    },
    {
      type: "Airborne Precautions",
      color: "bg-red-50 border-red-200",
      iconColor: "text-red-600",
      headerBg: "bg-red-100",
      applies: "Organisms spread by tiny airborne nuclei (<5 microns) that remain suspended in air and travel long distances",
      when: "Known or suspected infection with airborne-transmitted organisms",
      ppe: ["N95 respirator (must be fit-tested annually)  -  don BEFORE entering room", "PAPR (Powered Air-Purifying Respirator) as alternative to N95", "Gloves and gown per standard precautions"],
      room: "Airborne Infection Isolation Room (AIIR)  -  negative pressure, ≥6-12 air exchanges/hour, air exhausted outside or HEPA-filtered, DOOR MUST REMAIN CLOSED",
      examples: ["Tuberculosis (pulmonary or laryngeal TB)", "Measles (Rubeola)", "Varicella (Chickenpox)", "Disseminated Herpes Zoster (Shingles) in immunocompromised patients", "COVID-19 (during aerosol-generating procedures)", "Smallpox"],
      keyPoints: ["N95 required  -  surgical mask is NOT sufficient", "Room must be negative pressure with door CLOSED at all times", "Patient wears surgical mask during transport (NOT N95)", "Immune healthcare workers preferred for varicella/measles patients", "Verify negative pressure daily (smoke test or monitor)"]
    },
    {
      type: "Protective (Reverse) Isolation",
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
      headerBg: "bg-purple-100",
      applies: "Severely immunocompromised patients at high risk for opportunistic infections",
      when: "ANC (Absolute Neutrophil Count) < 500/mm³ or as ordered for high-risk patients",
      ppe: ["Mask, gown, gloves for anyone entering the room", "Strict hand hygiene enforcement for all visitors", "Visitors screened for signs of illness before entering"],
      room: "Private room with positive pressure (air flows OUT of the room); HEPA-filtered air; door closed",
      examples: ["Neutropenic patients (post-chemotherapy, ANC < 500)", "Bone marrow / stem cell transplant recipients", "Severe combined immunodeficiency (SCID)", "Organ transplant patients on heavy immunosuppression"],
      keyPoints: ["Protects the PATIENT from environmental organisms (opposite of other isolation types)", "No fresh flowers, fruits, or raw vegetables (harbor bacteria/fungi)", "Low-microbial diet (neutropenic diet) may be ordered", "Monitor for subtle infection signs  -  fever may be the ONLY indicator", "Positive pressure keeps contaminated air OUT of the room"]
    }
  ];

  return (
    <section id="isolation-types" className="space-y-6" data-testid="isolation-types-guide">
      <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
        <ShieldAlert className="text-blue-600 w-8 h-8" />
        <h2>{t("pages.lessonDetail.typesOfIsolationPrecautions")}</h2>
      </div>
      <p className="text-sm text-gray-500 mt-1">{t("pages.lessonDetail.whenWhyAndHowTo")}</p>

      <div className="space-y-6">
        {isolationTypes.map((iso) => (
          <Card key={iso.type} className={`border shadow-md overflow-hidden ${iso.color}`} data-testid={`card-isolation-${iso.type.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
            <div className={`${iso.headerBg} px-6 py-4 border-b ${iso.color.split(" ")[1]}`}>
              <div className="flex items-center gap-3">
                <ShieldAlert className={`w-6 h-6 ${iso.iconColor}`} />
                <h3 className="text-xl font-bold text-gray-900">{iso.type}</h3>
              </div>
              <p className="text-sm text-gray-700 mt-1 font-medium">{iso.applies}</p>
            </div>
            <CardContent className="p-6 space-y-5">
              <div>
                <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  When to Use
                </h4>
                <p className="text-gray-700 text-sm">{iso.when}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
                    <ShieldAlert className="w-4 h-4 text-blue-500" />
                    Required PPE
                  </h4>
                  <ul className="space-y-1.5">
                    {iso.ppe.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                        <RichTextDisplay html={item} />
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
                    <Stethoscope className="w-4 h-4 text-indigo-500" />
                    Common Conditions
                  </h4>
                  <ul className="space-y-1.5">
                    {iso.examples.map((ex, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
                        <RichTextDisplay html={ex} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-purple-500" />
                  Room Requirements
                </h4>
                <p className="text-gray-700 text-sm bg-white/60 rounded-lg px-4 py-2 border border-gray-100">{iso.room}</p>
              </div>

              <div className="bg-white/70 rounded-lg p-4 border border-gray-100">
                <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Key Points to Remember
                </h4>
                <ul className="space-y-1.5">
                  {iso.keyPoints.map((kp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <Zap className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                      <RichTextDisplay html={kp} />
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-md bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="table-isolation-comparison">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                  <th className="text-left px-4 py-3 font-bold text-gray-800">{t("pages.lessonDetail.feature")}</th>
                  <th className="text-center px-3 py-3 font-bold text-yellow-700 bg-yellow-50/50">{t("pages.lessonDetail.contact")}</th>
                  <th className="text-center px-3 py-3 font-bold text-blue-700 bg-blue-50/50">{t("pages.lessonDetail.droplet")}</th>
                  <th className="text-center px-3 py-3 font-bold text-red-700 bg-red-50/50">{t("pages.lessonDetail.airborne")}</th>
                  <th className="text-center px-3 py-3 font-bold text-purple-700 bg-purple-50/50">{t("pages.lessonDetail.protective")}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3 font-semibold text-gray-800">{t("pages.lessonDetail.maskType")}</td>
                  <td className="text-center px-3 py-3 text-gray-700">{t("pages.lessonDetail.notRequired")}</td>
                  <td className="text-center px-3 py-3 text-gray-700">{t("pages.lessonDetail.surgicalMask")}</td>
                  <td className="text-center px-3 py-3 text-gray-700 font-medium">{t("pages.lessonDetail.n95Respirator")}</td>
                  <td className="text-center px-3 py-3 text-gray-700">{t("pages.lessonDetail.surgicalMask2")}</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <td className="px-4 py-3 font-semibold text-gray-800">{t("pages.lessonDetail.gown")}</td>
                  <td className="text-center px-3 py-3 text-green-600 font-medium">{t("pages.lessonDetail.yes")}</td>
                  <td className="text-center px-3 py-3 text-gray-700">{t("pages.lessonDetail.perStandard")}</td>
                  <td className="text-center px-3 py-3 text-gray-700">{t("pages.lessonDetail.perStandard2")}</td>
                  <td className="text-center px-3 py-3 text-green-600 font-medium">{t("pages.lessonDetail.yes2")}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3 font-semibold text-gray-800">{t("pages.lessonDetail.gloves")}</td>
                  <td className="text-center px-3 py-3 text-green-600 font-medium">{t("pages.lessonDetail.yes3")}</td>
                  <td className="text-center px-3 py-3 text-gray-700">{t("pages.lessonDetail.perStandard3")}</td>
                  <td className="text-center px-3 py-3 text-gray-700">{t("pages.lessonDetail.perStandard4")}</td>
                  <td className="text-center px-3 py-3 text-green-600 font-medium">{t("pages.lessonDetail.yes4")}</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <td className="px-4 py-3 font-semibold text-gray-800">{t("pages.lessonDetail.roomPressure")}</td>
                  <td className="text-center px-3 py-3 text-gray-700">{t("pages.lessonDetail.normal")}</td>
                  <td className="text-center px-3 py-3 text-gray-700">{t("pages.lessonDetail.normal2")}</td>
                  <td className="text-center px-3 py-3 text-red-600 font-medium">{t("pages.lessonDetail.negative")}</td>
                  <td className="text-center px-3 py-3 text-purple-600 font-medium">{t("pages.lessonDetail.positive")}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3 font-semibold text-gray-800">{t("pages.lessonDetail.door")}</td>
                  <td className="text-center px-3 py-3 text-gray-700">{t("pages.lessonDetail.mayBeOpen")}</td>
                  <td className="text-center px-3 py-3 text-gray-700">{t("pages.lessonDetail.mayBeOpen2")}</td>
                  <td className="text-center px-3 py-3 text-red-600 font-medium">CLOSED</td>
                  <td className="text-center px-3 py-3 text-purple-600 font-medium">CLOSED</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <td className="px-4 py-3 font-semibold text-gray-800">{t("pages.lessonDetail.dedicatedEquipment")}</td>
                  <td className="text-center px-3 py-3 text-green-600 font-medium">{t("pages.lessonDetail.yes5")}</td>
                  <td className="text-center px-3 py-3 text-gray-700">{t("pages.lessonDetail.preferred")}</td>
                  <td className="text-center px-3 py-3 text-gray-700">{t("pages.lessonDetail.preferred2")}</td>
                  <td className="text-center px-3 py-3 text-green-600 font-medium">{t("pages.lessonDetail.yes6")}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-800">{t("pages.lessonDetail.purpose")}</td>
                  <td className="text-center px-3 py-3 text-gray-700 text-xs">{t("pages.lessonDetail.protectOthersFromPatient")}</td>
                  <td className="text-center px-3 py-3 text-gray-700 text-xs">{t("pages.lessonDetail.protectOthersFromPatient2")}</td>
                  <td className="text-center px-3 py-3 text-gray-700 text-xs">{t("pages.lessonDetail.protectOthersFromPatient3")}</td>
                  <td className="text-center px-3 py-3 text-purple-700 text-xs font-medium">{t("pages.lessonDetail.protectPatientFromOthers")}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 bg-amber-50 border-t border-amber-100">
            <p className="text-xs text-amber-700 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              *Contact precautions: mask not routinely required unless splash risk. Always apply Standard Precautions in addition to Transmission-Based Precautions.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}


const tierPricing: Record<string, { name: string; priceCAD: string; priceUSD: string }> = {
  rpn: { name: "RPN/LVN", priceCAD: "$29.99 CAD/mo", priceUSD: "$21.99 USD/mo" },
  rn: { name: "RN", priceCAD: "$39.99 CAD/mo", priceUSD: "$29.99 USD/mo" },
  np: { name: "NP Advanced", priceCAD: "$49.99 CAD/mo", priceUSD: "$36.99 USD/mo" },
};

function getTestQuestions(lesson: LessonContent, testType: "pretest" | "posttest"): QuizQuestion[] {
  if (testType === "pretest" && lesson.preTest && lesson.preTest.length >= 25) {
    return lesson.preTest;
  }
  if (testType === "posttest" && lesson.postTest && lesson.postTest.length >= 25) {
    return lesson.postTest;
  }
  const source = testType === "pretest" ? (lesson.preTest || lesson.quiz) : (lesson.postTest || lesson.quiz);
  return source;
}

type AnswerRecord = { questionIndex: number; selected: number; correct: number; isCorrect: boolean };

function ScoreRing({ percentage, size = 120 }: { percentage: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color = percentage >= 75 ? "#10b981" : percentage >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e5e7eb" strokeWidth="8" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth="8" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>{percentage}%</span>
        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{t("pages.lessonDetail.score")}</span>
      </div>
    </div>
  );
}

function QuizReport({
  questions,
  answers,
  score,
  testType,
  lessonId,
  preTestScore,
  onRetake,
}: {
  questions: QuizQuestion[];
  answers: AnswerRecord[];
  score: number;
  testType: "pretest" | "posttest";
  lessonId: string;
  preTestScore: { percentage: number; score: number; total: number } | null;
  onRetake: () => void;
}) {
  const { t } = useI18n();
  const { user } = useAuth();
  const [showReview, setShowReview] = useState(false);
  const derivedScore = answers.filter((a) => a.isCorrect).length;
  const percentage = Math.round((derivedScore / questions.length) * 100);
  const passed = percentage >= 75;
  const missed = answers.filter((a) => !a.isCorrect);

  return (
    <div className="space-y-8" data-testid={`section-${testType}-report`}>
      <div className="text-center space-y-4">
        <ScoreRing percentage={percentage} size={140} />
        <h2 className="text-2xl sm:text-3xl font-bold" data-testid={`text-${testType}-result`}>
          {testType === "pretest" ? t("lesson.preTestComplete") : t("lesson.postTestComplete")}
        </h2>
        <p className="text-lg text-gray-600" data-testid={`text-${testType}-score`}>
          {derivedScore} of {questions.length} correct
        </p>
        {passed ? (
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" /> Passed (75% threshold)
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-bold border border-amber-200">
            <AlertCircle className="w-4 h-4" /> Below 75% - Review recommended
          </span>
        )}
      </div>

      {testType === "posttest" && preTestScore && (
        <Card className="border-none shadow-lg bg-gradient-to-r from-blue-50 to-emerald-50" data-testid="section-score-comparison">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 justify-center text-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" /> Learning Progress
            </h3>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">{t("pages.lessonDetail.pretest")}</p>
                <p className="text-3xl font-bold text-blue-600">{preTestScore.percentage}%</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-300 text-2xl">→</span>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">{t("pages.lessonDetail.posttest")}</p>
                <p className="text-3xl font-bold text-emerald-600">{percentage}%</p>
              </div>
            </div>
            {percentage - preTestScore.percentage > 0 ? (
              <p className="text-center text-emerald-600 font-bold text-lg" data-testid="text-improvement">
                +{percentage - preTestScore.percentage}% improvement
              </p>
            ) : percentage === preTestScore.percentage ? (
              <p className="text-center text-gray-600 font-medium">{t("pages.lessonDetail.sameScoreConsiderReviewingThe")}</p>
            ) : (
              <p className="text-center text-orange-600 font-medium">{t("pages.lessonDetail.keepStudyingRevisitTheAreas")}</p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-emerald-50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{answers.filter((a) => a.isCorrect).length}</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">{t("lesson.correct")}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-red-50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-500">{missed.length}</p>
            <p className="text-xs text-red-500 font-medium mt-1">{t("pages.lessonDetail.missed")}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-blue-50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{questions.length}</p>
            <p className="text-xs text-blue-600 font-medium mt-1">{t("pages.lessonDetail.total")}</p>
          </CardContent>
        </Card>
      </div>

      {missed.length > 0 && (
        <Card className="border-none shadow-sm bg-amber-50/60">
          <CardContent className="p-6 space-y-3">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" /> Areas to Review
            </h3>
            <p className="text-sm text-gray-600">
              {t("lesson.youMissed")} {missed.length} {t("lesson.questions")}. {t("lesson.focusOnRationale")}
            </p>
            {testType === "pretest" && (
              <p className="text-sm text-primary font-medium">
                {t("lesson.proceedToClinical")}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <Button
          variant="outline"
          onClick={() => setShowReview(!showReview)}
          className="w-full gap-2 h-12"
          data-testid={`button-toggle-${testType}-review`}
        >
          <FileText className="w-4 h-4" />
          {showReview ? "Hide Question Review" : `Review All ${questions.length} Questions`}
        </Button>

        {showReview && (
          <div className="space-y-4 mt-4" data-testid={`section-${testType}-question-review`}>
            {questions.map((q, idx) => {
              const answer = answers.find((a) => a.questionIndex === idx);
              const wasCorrect = answer?.isCorrect ?? false;
              return (
                <Card key={idx} className={`border shadow-sm ${wasCorrect ? "border-l-4 border-l-emerald-400" : "border-l-4 border-l-red-400"}`}>
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${wasCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {idx + 1}
                      </div>
                      <p className="font-medium text-gray-900 text-sm leading-relaxed">{q.question}</p>
                    </div>
                    <div className="ml-10 space-y-1.5">
                      {q.options.map((opt, oi) => {
                        const isCorrectOpt = oi === q.correct;
                        const wasSelected = answer?.selected === oi;
                        let optClass = "text-gray-500 text-sm";
                        if (isCorrectOpt) optClass = "text-emerald-700 font-medium text-sm";
                        else if (wasSelected && !isCorrectOpt) optClass = "text-red-600 line-through text-sm";
                        return (
                          <div key={oi} className={`flex items-center gap-2 ${optClass}`}>
                            {isCorrectOpt ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> :
                             wasSelected ? <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" /> :
                             <div className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0" />}
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                    {!wasCorrect && (
                      !user && idx >= 2 ? (
                        <div className="ml-10 mt-2 relative" data-testid={`review-rationale-gate-${idx}`}>
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 select-none" style={{ filter: "blur(4px)", pointerEvents: "none" }}>
                            <p className="text-xs font-bold text-gray-400 mb-1">{t("pages.lessonDetail.whyThisMatters")}</p>
                            <p className="text-xs text-gray-400 leading-relaxed">{q.rationale}</p>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-lg">
                            <div className="text-center px-4">
                              <Lock className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                              <p className="text-xs text-gray-600 font-medium mb-1.5">{t("pages.lessonDetail.createAFreeAccountTo")}</p>
                              <LocaleLink href="/start-free">
                                <Button size="sm" variant="outline" className="gap-1 text-xs h-7 px-3" data-testid={`btn-review-rationale-signup-${idx}`}>
                                  Start Free <ArrowRight className="w-3 h-3" />
                                </Button>
                              </LocaleLink>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="ml-10 mt-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
                          <p className="text-xs font-bold text-amber-700 mb-1">{t("pages.lessonDetail.whyThisMatters2")}</p>
                          <p className="text-xs text-amber-800 leading-relaxed">{q.rationale}</p>
                        </div>
                      )
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-center pt-4">
        <Button variant="outline" onClick={onRetake} className="gap-2" data-testid={`button-retake-${testType}`}>
          <Activity className="w-4 h-4" /> {testType === "pretest" ? t("lesson.retakePreTest") : t("lesson.retakePostTest")}
        </Button>
        {testType === "pretest" && (
          <p className="text-sm text-gray-500 self-center">{t("pages.lessonDetail.orContinueToClinicalContent")}</p>
        )}
      </div>
    </div>
  );
}

function QuizSection({
  questions,
  lessonId,
  testType,
  onComplete,
}: {
  questions: QuizQuestion[];
  lessonId: string;
  testType: "pretest" | "posttest";
  onComplete: (score: number, total: number) => void;
}) {
  const { t } = useI18n();
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [complete, setComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answerLog, setAnswerLog] = useState<AnswerRecord[]>([]);
  const { user } = useAuth();

  const preTestScore = useMemo(() => {
    const stored = localStorage.getItem(`nursenest-pretest-${lessonId}`);
    return stored ? JSON.parse(stored) : null;
  }, [lessonId, complete]);

  const resetQuiz = () => {
    setStarted(false);
    setCurrentQ(0);
    setScore(0);
    setComplete(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setAnswerLog([]);
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    const isCorrect = index === questions[currentQ].correct;
    if (isCorrect) setScore((s) => s + 1);
    setAnswerLog((prev) => [...prev, { questionIndex: currentQ, selected: index, correct: questions[currentQ].correct, isCorrect }]);

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      if (currentQ + 1 < questions.length) {
        setCurrentQ((q) => q + 1);
      } else {
        const finalScore = score + (isCorrect ? 1 : 0);
        setComplete(true);
        localStorage.setItem(
          `nursenest-${testType}-${lessonId}`,
          JSON.stringify({ score: finalScore, total: questions.length, percentage: Math.round((finalScore / questions.length) * 100) })
        );
        onComplete(finalScore, questions.length);

        if (user) {
          fetch("/api/test-results", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.id,
              lessonId,
              testType,
              score: finalScore,
              totalQuestions: questions.length,
            }),
          }).catch(() => {});
        }
      }
    }, 2000);
  };

  if (!started) {
    return (
      <div className="text-center space-y-6 py-12">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          {testType === "pretest" ? <BarChart3 className="w-10 h-10 text-primary" /> : <TrendingUp className="w-10 h-10 text-primary" />}
        </div>
        <h2 className="text-3xl font-bold" data-testid={`text-${testType}-title`}>
          {testType === "pretest" ? "Pre-Test: Baseline Assessment" : "Post-Test: Knowledge Check"}
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          {testType === "pretest"
            ? "Take this test before studying the lesson to assess your baseline knowledge. Your score will be compared with your post-test results."
            : "Now that you've studied the lesson, test your knowledge. Your score will be compared with your pre-test to measure improvement."}
        </p>
        <p className="text-sm text-gray-400">{questions.length} questions</p>
        <Button
          size="lg"
          onClick={() => setStarted(true)}
          className="rounded-full px-12 bg-primary hover:brightness-110 h-14 text-lg text-white"
          data-testid={`button-start-${testType}`}
        >
          {testType === "pretest" ? t("lesson.startPreTest") : t("lesson.startPostTest")}
        </Button>
      </div>
    );
  }

  if (complete) {
    return (
      <QuizReport
        questions={questions}
        answers={answerLog}
        score={score}
        testType={testType}
        lessonId={lessonId}
        preTestScore={preTestScore}
        onRetake={resetQuiz}
      />
    );
  }

  const progressPercent = ((currentQ + 1) / questions.length) * 100;
  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-primary uppercase tracking-wider" data-testid={`text-${testType}-progress`}>
            {t("lesson.question")} {currentQ + 1} {t("lesson.of")} {questions.length}
          </p>
          <span className="text-sm text-gray-400">{Math.round(progressPercent)}%</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900" data-testid={`text-${testType}-question`}>
        {questions[currentQ].question}
      </h3>
      <div className="grid gap-4">
        {questions[currentQ].options.map((option, i) => {
          const isCorrect = i === questions[currentQ].correct;
          const isSelected = selectedAnswer === i;
          let cardStyle = "hover:bg-primary/5 hover:border-primary/40 hover:shadow-md cursor-pointer";
          if (selectedAnswer !== null) {
            if (isCorrect) cardStyle = "bg-emerald-50 border-emerald-400 text-emerald-900";
            else if (isSelected) cardStyle = "bg-red-50 border-red-400 text-red-900";
            else cardStyle = "opacity-60";
          }
          return (
            <Card
              key={i}
              className={`border shadow-sm transition-all ${cardStyle}`}
              onClick={() => selectedAnswer === null && handleAnswer(i)}
              data-testid={`card-${testType}-option-${i}`}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                  selectedAnswer !== null && isCorrect ? "bg-emerald-500 text-white" :
                  isSelected && !isCorrect ? "bg-red-500 text-white" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {selectedAnswer !== null && isCorrect ? <CheckCircle2 className="w-5 h-5" /> :
                   isSelected && !isCorrect ? <XCircle className="w-5 h-5" /> :
                   String.fromCharCode(65 + i)}
                </div>
                <span className="pt-1">{option}</span>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {showFeedback && (
        !user && currentQ >= 2 ? (
          <div className="relative" data-testid={`text-${testType}-rationale`}>
            <div className="p-4 rounded-xl border bg-gray-50 border-gray-200 text-gray-400 select-none" style={{ filter: "blur(4px)", pointerEvents: "none" }}>
              <p className="font-bold mb-1">{selectedAnswer === questions[currentQ].correct ? "Correct!" : "Incorrect"}</p>
              <p className="text-sm">{questions[currentQ].rationale}</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl">
              <div className="text-center px-4">
                <Lock className="w-5 h-5 text-gray-400 mx-auto mb-1.5" />
                <p className="text-sm text-gray-600 font-medium mb-2" data-testid="text-rationale-gate">{t("pages.lessonDetail.createAFreeAccountTo2")}</p>
                <LocaleLink href="/start-free">
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs" data-testid="btn-rationale-signup">
                    Start Free <ArrowRight className="w-3 h-3" />
                  </Button>
                </LocaleLink>
              </div>
            </div>
          </div>
        ) : (
          <div className={`p-4 rounded-xl border ${
            selectedAnswer === questions[currentQ].correct
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`} data-testid={`text-${testType}-rationale`}>
            <p className="font-bold mb-1">{selectedAnswer === questions[currentQ].correct ? "Correct!" : "Incorrect"}</p>
            <p className="text-sm">{questions[currentQ].rationale}</p>
          </div>
        )
      )}
    </div>
  );
}

export default function LessonDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [hidePreTest, setHidePreTest] = useState(() => localStorage.getItem("nursenest-hide-pretest") === "true");
  const [hidePostTest, setHidePostTest] = useState(() => localStorage.getItem("nursenest-hide-posttest") === "true");
  const { user, hasAccess, effectiveTier, previewTier, isLoading: authLoading } = useAuth();
  const { language, t } = useI18n();
  const isAdmin = user?.tier === "admin" && !previewTier;
  
  const validTierPrefixes = new Set(["rpn", "rn", "np", "free"]);
  const tierFromId = id?.split('-')[0];
  const isTierPrefixed = tierFromId ? validTierPrefixes.has(tierFromId) : false;
  const slugFromId = id?.split('-').slice(1).join('-');

  useEffect(() => {
    if (!isTierPrefixed) return;
    const activeTier = previewTier || user?.tier || "free";
    if (user && activeTier !== 'admin' && tierFromId && tierFromId !== activeTier) {
      const targetId = `${activeTier}-${slugFromId}`;
      fetch(`/api/lessons/content/${targetId}`, { headers: getAuthHeaders() })
        .then((r) => { if (r.ok) setLocation(`/lessons/${targetId}`); })
        .catch(() => {});
    }
  }, [user, id, isTierPrefixed, tierFromId, slugFromId, setLocation, previewTier]);

  const [activeTab, setActiveTab] = useState(() => {
    const hidePre = localStorage.getItem("nursenest-hide-pretest") === "true";
    const hidePost = localStorage.getItem("nursenest-hide-posttest") === "true";
    if (hidePre && hidePost) return "content";
    if (hidePre) return "content";
    return "pretest";
  });
  const [preTestDone, setPreTestDone] = useState(false);
  const [postTestDone, setPostTestDone] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [isPreviewOnly, setIsPreviewOnly] = useState(false);
  const [previewRequiredTier, setPreviewRequiredTier] = useState<string>("rpn");

  useEffect(() => {
    if (isPreviewOnly && activeTab !== "content") {
      setActiveTab("content");
    }
  }, [isPreviewOnly, activeTab]);
  const [noteContent, setNoteContent] = useState("");
  const [noteSaving, setNoteSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout>(undefined);
  const [region, setRegion] = useState<"US" | "CA">(() => {
    return (localStorage.getItem("nursenest-region") as "US" | "CA") || "US";
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<LessonContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [dbContent, setDbContent] = useState<any>(null);
  const [dbLoading, setDbLoading] = useState(true);
  const [dbEditMode, setDbEditMode] = useState(false);
  const [showAdminCreator, setShowAdminCreator] = useState(false);
  const { toast } = useToast();

  const [seoLesson, setSeoLesson] = useState<any>(null);
  const [seoRelated, setSeoRelated] = useState<any[]>([]);
  const [seoChecked, setSeoChecked] = useState(false);

  useEffect(() => {
    if (!id) { setSeoChecked(true); return; }
    setSeoLesson(null);
    setSeoRelated([]);
    setSeoChecked(false);
    const controller = new AbortController();
    fetch(`/api/seo-lessons/${id}`, { signal: controller.signal, headers: getAuthHeaders() })
      .then(r => {
        if (!r.ok) return null;
        return r.json();
      })
      .then(data => {
        if (data?.lesson) {
          setSeoLesson(data.lesson);
          setSeoRelated(data.related || []);
        }
        setSeoChecked(true);
      })
      .catch(() => { setSeoChecked(true); });
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    const handleRegionChange = () => {
      setRegion((localStorage.getItem("nursenest-region") as "US" | "CA") || "US");
    };
    window.addEventListener("regionChange", handleRegionChange);
    return () => window.removeEventListener("regionChange", handleRegionChange);
  }, []);

  const [apiLesson, setApiLesson] = useState<LessonContent | null>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiLessonId, setApiLessonId] = useState<string | null>(null);
  const [tierLocked, setTierLocked] = useState<{ requiredTier: string } | null>(null);
  const [lessonApiError, setLessonApiError] = useState<{
    code?: string;
    status: number;
    retryable?: boolean;
  } | null>(null);
  const [lessonContentRetryNonce, setLessonContentRetryNonce] = useState(0);

  useEffect(() => {
    if (!id) { setApiLoading(false); return; }
    if (authLoading) return;
    setApiLesson(null);
    setApiLessonId(null);
    setIsPreviewOnly(false);
    setTierLocked(null);
    setLessonApiError(null);
    setOverrides(null);
    setDbContent(null);
    setNoteContent("");
    setApiLoading(true);
    setDbLoading(true);
    const controller = new AbortController();
    fetch(`/api/lessons/content/${id}`, { signal: controller.signal, headers: getAuthHeaders() })
      .then(async (r) => {
        const parsed = await readApiJsonResponse(r);
        if (!parsed.ok) {
          const st = parsed.status;
          const code = parsed.code;
          const body = parsed.errorBody as Record<string, unknown>;

          if (st === 403 && body.code === BackendErrorCodes.LESSON_TIER_LOCKED) {
            setTierLocked({ requiredTier: String(body.requiredTier || "rpn") });
            setApiLesson(null);
            setApiLoading(false);
            return;
          }
          if (st === 403 && (code === BackendErrorCodes.ENTITLEMENT_DENIED || code === BackendErrorCodes.PREMIUM_REQUIRED)) {
            setTierLocked({ requiredTier: String(body.requiredTier || body.currentTier || "rn") });
            setApiLesson(null);
            setApiLoading(false);
            return;
          }

          if (isAuthRequiredCode(code, st)) {
            setLessonApiError({ code: code || BackendErrorCodes.AUTH_REQUIRED, status: st });
            setApiLesson(null);
            setApiLoading(false);
            return;
          }

          if (code === BackendErrorCodes.CONTENT_MODULE_UNAVAILABLE || st === 503) {
            setLessonApiError({
              code: code || BackendErrorCodes.CONTENT_MODULE_UNAVAILABLE,
              status: st,
              retryable: true,
            });
            setApiLesson(null);
            setApiLoading(false);
            return;
          }

          if (isLessonNotFoundCode(code, st)) {
            setLessonApiError({ code: code || BackendErrorCodes.LESSON_NOT_FOUND, status: st });
            setApiLesson(null);
            setApiLoading(false);
            return;
          }

          setLessonApiError({ code, status: st });
          setApiLesson(null);
          setApiLoading(false);
          return;
        }

        const data = parsed.data as Record<string, unknown> | null;
        if (data) {
          const returnedId = data.id as string | undefined;
          if (returnedId && returnedId !== id) {
            window.history.replaceState(null, "", `/lessons/${returnedId}`);
            setLocation(`/lessons/${returnedId}`);
            return;
          }
          if (data.isPreviewOnly) {
            setIsPreviewOnly(true);
            setPreviewRequiredTier((data.requiredTier as string) || (data.tier as string) || "rpn");
          }
          const { id: _id, isPreviewOnly: _ip, requiredTier: _rt, ...lesson } = data;
          setApiLesson(lesson as LessonContent);
          setApiLessonId(returnedId || id);
        }
        setApiLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setLessonApiError({ status: 0 });
          setApiLesson(null);
          setApiLoading(false);
        }
      });
    return () => controller.abort();
  }, [id, authLoading, lessonContentRetryNonce, setLocation]);

  const baseLesson = apiLesson;

  const [overrides, setOverrides] = useState<Partial<LessonContent> | null>(null);
  const [translating, setTranslating] = useState(false);
  const [translationsReady, setTranslationsReady] = useState(isTranslationLoaded(language));

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    fetch(`/api/lesson-overrides/${id}`, { signal: controller.signal, headers: getAuthHeaders() })
      .then((r) => r.json())
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setOverrides(data);
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (language === "en") { setTranslationsReady(true); setTranslating(false); return; }
    if (isTranslationLoaded(language)) { setTranslationsReady(true); setTranslating(false); return; }
    setTranslationsReady(false);
    setTranslating(true);
    let cancelled = false;
    loadTranslationLanguage(language).then(() => {
      if (!cancelled) { setTranslationsReady(true); setTranslating(false); }
    });
    return () => { cancelled = true; };
  }, [language]);

  const fetchDbLesson = useCallback((slug: string) => {
    setDbLoading(true);
    const creds = getCredentials();
    const queryParts: string[] = [];
    if (creds) {
      queryParts.push(`username=${encodeURIComponent(creds.username)}&password=${encodeURIComponent(creds.password)}`);
    }
    if (language && language !== "en") {
      queryParts.push(`lang=${encodeURIComponent(language)}`);
    }
    const params = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
    fetch(`/api/content/slug/${slug}${params}`, { headers: getAuthHeaders() })
      .then((r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((data) => {
        setDbContent(data);
        setDbEditMode(false);
      })
      .catch(() => {
        setDbContent(null);
      })
      .finally(() => {
        setDbLoading(false);
      });
  }, [language]);

  useEffect(() => {
    if (baseLesson) {
      setDbLoading(false);
      return;
    }
    if (!id) {
      setDbLoading(false);
      return;
    }
    fetchDbLesson(id);
  }, [baseLesson, id, fetchDbLesson, language]);

  const lessonContent = useMemo(() => {
    if (!baseLesson || !id) return null;
    if (apiLessonId && apiLessonId !== id) return null;
    let content = overrides ? { ...baseLesson, ...overrides } as LessonContent : baseLesson;
    if (language !== "en" && translationsReady) {
      const localized = getLessonI18n(id, language, baseLesson);
      if (localized && localized !== baseLesson) {
        content = overrides ? { ...localized, ...overrides } as LessonContent : localized;
      }
    }
    return content;
  }, [baseLesson, overrides, language, translationsReady, id, apiLessonId]);

  const [sectionAiPrompt, setSectionAiPrompt] = useState("");
  const [sectionAiTarget, setSectionAiTarget] = useState<string | null>(null);
  const [sectionAiLoading, setSectionAiLoading] = useState(false);

  useEffect(() => {
    trackMilestone("lesson_view");
    trackMilestone("session_start");
  }, [id]);

  useEffect(() => {
    if (user && id) {
      fetch(`/api/notes/${user.id}/${id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data?.content) setNoteContent(data.content);
        })
        .catch(() => {});
    }
  }, [user, id]);

  const saveNote = useCallback(() => {
    if (!user || !id) return;
    setNoteSaving(true);
    fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, lessonId: id, content: noteContent }),
    })
      .then(() => setNoteSaving(false))
      .catch(() => setNoteSaving(false));
  }, [user, id, noteContent]);

  const preTestQuestions = useMemo(() => {
    return lessonContent ? getTestQuestions(lessonContent, "pretest") : [];
  }, [lessonContent]);

  const postTestQuestions = useMemo(() => {
    return lessonContent ? getTestQuestions(lessonContent, "posttest") : [];
  }, [lessonContent]);

  if (seoLesson && seoChecked) {
    return <SeoLessonDetail lesson={seoLesson} related={seoRelated} />;
  }

  if (!baseLesson || !lessonContent) {
    if (apiLoading || dbLoading || !seoChecked) {
      return (
        <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
          <Navigation />
          <main className="max-w-2xl mx-auto px-4 py-20 w-full text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-600">{t("pages.lessonDetail.loadingLesson")}</span>
            </div>
          </main>
          <Footer />
        </div>
      );
    }

    if (lessonApiError && isAuthRequiredCode(lessonApiError.code, lessonApiError.status)) {
      return (
        <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
          <Navigation />
          <main className="max-w-2xl mx-auto px-4 py-20 w-full text-center space-y-6">
            <LocaleLink href="/lessons">
              <Button variant="ghost" className="mb-4 group">
                <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Lessons
              </Button>
            </LocaleLink>
            <h1 className="text-2xl font-bold text-gray-900">Sign in required</h1>
            <p className="text-gray-600 max-w-md mx-auto">{getLearnerMessageForCode(lessonApiError.code, "Please sign in to view this lesson.")}</p>
            <Button
              className="mt-4"
              onClick={() => setLocation(`/login?returnUrl=${encodeURIComponent(`/lessons/${id || ""}`)}`)}
            >
              Sign in
            </Button>
          </main>
          <Footer />
        </div>
      );
    }

    if (lessonApiError?.retryable && lessonApiError.code === BackendErrorCodes.CONTENT_MODULE_UNAVAILABLE) {
      return (
        <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
          <Navigation />
          <main className="max-w-2xl mx-auto px-4 py-20 w-full text-center space-y-6">
            <LocaleLink href="/lessons">
              <Button variant="ghost" className="mb-4 group">
                <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Lessons
              </Button>
            </LocaleLink>
            <h1 className="text-2xl font-bold text-gray-900">Content temporarily unavailable</h1>
            <p className="text-gray-600 max-w-md mx-auto">{getLearnerMessageForCode(lessonApiError.code, "Please try again in a moment.")}</p>
            <Button className="mt-4" onClick={() => setLessonContentRetryNonce((n) => n + 1)}>
              Try again
            </Button>
          </main>
          <Footer />
        </div>
      );
    }

    if (lessonApiError && isLessonNotFoundCode(lessonApiError.code, lessonApiError.status)) {
      return (
        <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
          <Navigation />
          <main className="max-w-2xl mx-auto px-4 py-20 w-full text-center space-y-6">
            <LocaleLink href="/lessons">
              <Button variant="ghost" className="mb-4 group">
                <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Lessons
              </Button>
            </LocaleLink>
            <h1 className="text-3xl font-bold text-gray-900" data-testid="text-lesson-not-found-api">{t("pages.lessonDetail.lessonNotFound")}</h1>
            <p className="text-gray-600">{getLearnerMessageForCode(lessonApiError.code, t("pages.lessonDetail.thisLessonDoesNotExist"))}</p>
            {isAdmin && id ? (
              <>
                <Button
                  className="mt-4"
                  onClick={() => setShowAdminCreator(true)}
                  data-testid="button-create-lesson-api-notfound"
                >
                  Create New Lesson: {id}
                </Button>
                {showAdminCreator && (
                  <AdminLessonCreator lessonId={id} onPublished={() => fetchDbLesson(id)} />
                )}
              </>
            ) : null}
            <LocaleLink href="/lessons">
              <Button variant="outline" className="mt-4">
                Browse lessons
              </Button>
            </LocaleLink>
          </main>
          <Footer />
        </div>
      );
    }

    if (lessonApiError) {
      return (
        <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
          <Navigation />
          <main className="max-w-2xl mx-auto px-4 py-20 w-full text-center space-y-6">
            <LocaleLink href="/lessons">
              <Button variant="ghost" className="mb-4 group">
                <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Lessons
              </Button>
            </LocaleLink>
            <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
            <p className="text-gray-600 max-w-md mx-auto">
              {getLearnerMessageForCode(lessonApiError.code, "We could not load this lesson. Please try again later.")}
            </p>
            <Button className="mt-4" onClick={() => setLessonContentRetryNonce((n) => n + 1)}>
              Try again
            </Button>
          </main>
          <Footer />
        </div>
      );
    }

    if (dbContent && dbEditMode && isAdmin && id) {
      return (
        <AdminLessonCreator
          lessonId={id}
          existingContent={dbContent}
          onPublished={() => {
            setDbEditMode(false);
            fetchDbLesson(id);
          }}
        />
      );
    }

    if (dbContent) {
      const blocks = Array.isArray(dbContent.content) ? dbContent.content : [];

      const objectives: string[] = [];
      const clinicalPearls: string[] = [];
      const assessmentItems: string[] = [];
      let pathophysiologyText = "";
      const riskFactors: string[] = [];
      const diagnosticItems: string[] = [];
      const managementItems: string[] = [];
      const nursingActionItems: string[] = [];
      const signsLeft: string[] = [];
      const signsRight: string[] = [];
      let lifespanText = "";
      const medsParsed: { name: string; type: string; action: string; sideEffects: string; contra: string; pearl: string }[] = [];
      const consumedIndices = new Set<number>();

      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        const headingText = (block.type === "heading" && typeof block.content === "string") ? block.content : "";
        const next = blocks[i + 1];
        const nextItems = next && (next.type === "bulletList" || next.type === "list" || next.type === "numberedList" || next.type === "numbered-list") && Array.isArray(next.items) ? next.items : null;
        const nextParagraph = next && next.type === "paragraph" && next.content ? next.content : "";

        if (/objectives/i.test(headingText) && nextItems) {
          objectives.push(...nextItems);
          consumedIndices.add(i); consumedIndices.add(i + 1);
        } else if (/pathophysiology/i.test(headingText) && nextParagraph) {
          pathophysiologyText = nextParagraph;
          consumedIndices.add(i); consumedIndices.add(i + 1);
        } else if (/risk\s*factors/i.test(headingText) && nextItems) {
          riskFactors.push(...nextItems);
          consumedIndices.add(i); consumedIndices.add(i + 1);
        } else if (/diagnostic/i.test(headingText) && nextItems) {
          diagnosticItems.push(...nextItems);
          consumedIndices.add(i); consumedIndices.add(i + 1);
        } else if (/medical\s*management|^management$/i.test(headingText) && nextItems) {
          managementItems.push(...nextItems);
          consumedIndices.add(i); consumedIndices.add(i + 1);
        } else if (/nursing\s*actions/i.test(headingText) && nextItems) {
          nursingActionItems.push(...nextItems);
          consumedIndices.add(i); consumedIndices.add(i + 1);
        } else if (/assessment\s*findings/i.test(headingText) && nextItems) {
          assessmentItems.push(...nextItems);
          consumedIndices.add(i); consumedIndices.add(i + 1);
        } else if (/early\s*signs/i.test(headingText) && nextItems) {
          signsLeft.push(...nextItems);
          consumedIndices.add(i); consumedIndices.add(i + 1);
        } else if (/late.*signs|emergency/i.test(headingText) && nextItems) {
          signsRight.push(...nextItems);
          consumedIndices.add(i); consumedIndices.add(i + 1);
        } else if (/lifespan/i.test(headingText) && nextParagraph) {
          lifespanText = nextParagraph;
          consumedIndices.add(i); consumedIndices.add(i + 1);
        } else if (/signs\s*&?\s*symptoms|signs\s*and\s*symptoms/i.test(headingText)) {
          consumedIndices.add(i);
        } else if (/^medications$/i.test(headingText)) {
          consumedIndices.add(i);
        }

        if (block.type === "clinical-pearl" || block.type === "clinicalPearl") {
          if (block.content) clinicalPearls.push(block.content);
          consumedIndices.add(i);
        }
        if (block.type === "medication" && block.content) {
          const lines = block.content.split("\n");
          const nameLine = lines[0] || "";
          const nameMatch = nameLine.match(/^(.+?)\s*\((.+?)\)/);
          medsParsed.push({
            name: nameMatch ? nameMatch[1].trim() : nameLine.trim(),
            type: nameMatch ? nameMatch[2].trim() : "",
            action: (lines.find((l: string) => l.startsWith("Action:")) || "").replace("Action:", "").trim(),
            sideEffects: (lines.find((l: string) => l.startsWith("Side Effects:")) || "").replace("Side Effects:", "").trim(),
            contra: (lines.find((l: string) => l.startsWith("Contraindications:")) || "").replace("Contraindications:", "").trim(),
            pearl: (lines.find((l: string) => l.startsWith("Nursing Pearl:")) || "").replace("Nursing Pearl:", "").trim(),
          });
          consumedIndices.add(i);
        }
      }

      const remainingBlocks = blocks.filter((_: any, i: number) => !consumedIndices.has(i));

      const dbLessonIsPublished = dbContent.status === "published";
      const dbTierLabel = dbContent.tier === "np" ? "NP Focus" : dbContent.tier === "rn" ? "RN Focus" : dbContent.tier === "free" ? "Free" : "RPN Focus";

      return (
        <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
          <Navigation />
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full" data-testid="db-lesson-detail">
            <nav aria-label={t("pages.lessonDetail.breadcrumb")} className="mb-4 text-sm text-gray-500">
              <ol className="flex items-center gap-1 flex-wrap">
                <li><LocaleLink href="/" className="hover:text-primary transition-colors">{t("pages.lessonDetail.home")}</LocaleLink></li>
                <li className="text-gray-300">/</li>
                <li><LocaleLink href="/lessons" className="hover:text-primary transition-colors">{t("pages.lessonDetail.lessons")}</LocaleLink></li>
                <li className="text-gray-300">/</li>
                <li className="text-gray-900 font-medium">{dbContent.title}</li>
              </ol>
            </nav>
            <div className="flex items-center justify-between mb-8">
              <LocaleLink href="/lessons">
                <Button variant="ghost" className="group" data-testid="button-back-lessons">
                  <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Overview
                </Button>
              </LocaleLink>
            </div>

            <div className="space-y-8">
              <div className="space-y-4 lesson-header-bar">
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight" data-testid="text-lesson-title">{dbContent.title}</h1>
                  {isAdmin && (
                    <div className="flex gap-2">
                      {!dbLessonIsPublished && (
                        <Button
                          size="sm"
                          className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                          data-testid="button-publish-db-lesson"
                          onClick={async () => {
                            const creds = getCredentials();
                            if (!creds) return;
                            try {
                              const res = await fetch(`/api/content/${dbContent.id}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ username: creds.username, password: creds.password, status: "published" }),
                              });
                              if (!res.ok) throw new Error("Publish failed");
                              setDbContent({ ...dbContent, status: "published" });
                              toast({ title: "Published", description: "Lesson is now live and visible to students." });
                            } catch (e: any) {
                              toast({ title: "Error", description: e.message, variant: "destructive" });
                            }
                          }}
                        >
                          <Save className="w-3 h-3" /> Publish
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-xs"
                        data-testid="button-edit-db-lesson"
                        onClick={() => { setDbEditMode(true); }}
                      >
                        <Pencil className="w-3 h-3" /> Edit Lesson
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-primary/8 text-primary text-xs font-bold uppercase tracking-wide">
                    {dbTierLabel}
                  </span>
                  {dbContent.category && (
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold" data-testid="badge-category">
                      {dbContent.category}
                    </span>
                  )}
                  {!dbLessonIsPublished && (
                    <span className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-800 text-xs font-bold" data-testid="badge-draft">
                      Draft
                    </span>
                  )}
                </div>
                {dbContent.summary && (
                  <p className="text-gray-600 text-base leading-relaxed max-w-2xl" data-testid="text-lesson-summary">{dbContent.summary}</p>
                )}
              </div>

              {objectives.length > 0 && <LessonObjectives objectives={objectives} />}

              {id && <LessonImageManager lessonId={id} section="header" isAdmin={user?.tier === "admin"} isEditing={false} />}

              <div className="space-y-12">
                {pathophysiologyText && (
                  <section id="pathophysiology" className="space-y-6">
                    <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                      <Microscope className="text-primary w-8 h-8" />
                      <h2>{t("lesson.pathophysiology")}</h2>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{t("lesson.pathophysiologySubtitle")}</p>
                    <Card className="border-none shadow-sm bg-violet-50/50">
                      <CardContent className="p-8 leading-relaxed text-gray-700">
                        <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: pathophysiologyText }} />
                      </CardContent>
                    </Card>
                    {id && (
                      <LessonImageManager lessonId={id} section="pathophysiology" isAdmin={user?.tier === "admin"} isEditing={false} />
                    )}
                  </section>
                )}

                {riskFactors.length > 0 && (
                  <section id="risk-factors" className="space-y-6">
                    <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                      <ShieldAlert className="text-rose-500 w-8 h-8" />
                      <h2>{t("lesson.riskFactors")}</h2>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{t("lesson.riskFactorsSubtitle")}</p>
                    <Card className="border-none shadow-sm bg-rose-50/60">
                      <CardContent className="p-8">
                        <div className="grid sm:grid-cols-2 gap-3">
                          {riskFactors.map((rf, i) => (
                            <div key={i} className="flex items-start gap-2 text-gray-700">
                              <div className="w-2 h-2 rounded-full bg-rose-400 mt-2 shrink-0" />
                              <span dangerouslySetInnerHTML={{ __html: rf }} />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    {id && (
                      <LessonImageManager lessonId={id} section="risk-factors" isAdmin={user?.tier === "admin"} isEditing={false} />
                    )}
                  </section>
                )}

                {diagnosticItems.length > 0 && (
                  <section id="diagnostics" className="space-y-6">
                    <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                      <Search className="text-cyan-600 w-8 h-8" />
                      <h2>{t("lesson.diagnostics")}</h2>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{t("lesson.diagnosticsSubtitle")}</p>
                    <Card className="border-none shadow-sm bg-cyan-50/60">
                      <CardContent className="p-8">
                        <div className="grid sm:grid-cols-2 gap-3">
                          {diagnosticItems.map((d, i) => (
                            <div key={i} className="flex items-start gap-2 text-gray-700">
                              <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 shrink-0" />
                              <span dangerouslySetInnerHTML={{ __html: d }} />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    {id && (
                      <LessonImageManager lessonId={id} section="diagnostics" isAdmin={user?.tier === "admin"} isEditing={false} />
                    )}
                  </section>
                )}

                {managementItems.length > 0 && (
                  <section id="management" className="space-y-6">
                    <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                      <ClipboardList className="text-emerald-600 w-8 h-8" />
                      <h2>{t("lesson.management")}</h2>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{t("lesson.managementSubtitle")}</p>
                    <Card className="border-none shadow-sm bg-emerald-50/60">
                      <CardContent className="p-8">
                        <ul className="space-y-3">
                          {managementItems.map((m, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-700">
                              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-emerald-700 text-xs font-bold">{i + 1}</span>
                              </div>
                              <span dangerouslySetInnerHTML={{ __html: m }} />
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    {id && (
                      <LessonImageManager lessonId={id} section="management" isAdmin={user?.tier === "admin"} isEditing={false} />
                    )}
                  </section>
                )}

                {nursingActionItems.length > 0 && (
                  <section id="nursing-actions" className="space-y-6">
                    <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                      <HeartPulse className="text-violet-600 w-8 h-8" />
                      <h2>{t("lesson.nursingActionsHeading")}</h2>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{t("lesson.nursingActionsSubtitle")}</p>
                    <Card className="border-none shadow-sm bg-violet-50/60">
                      <CardContent className="p-8">
                        <ul className="space-y-3">
                          {nursingActionItems.map((na, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-700">
                              <HeartPulse className="w-4 h-4 text-violet-500 mt-1 shrink-0" />
                              <span dangerouslySetInnerHTML={{ __html: na }} />
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    {id && (
                      <LessonImageManager lessonId={id} section="nursing-actions" isAdmin={user?.tier === "admin"} isEditing={false} />
                    )}
                  </section>
                )}

                {assessmentItems.length > 0 && (
                  <section id="assessment-findings" className="space-y-6">
                    <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                      <ClipboardList className="text-teal-600 w-8 h-8" />
                      <h2>{t("lesson.assessmentFindings")}</h2>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{t("lesson.assessmentFindingsSubtitle")}</p>
                    <Card className="border-none shadow-sm bg-teal-50/60">
                      <CardContent className="p-8">
                        <div className="grid sm:grid-cols-2 gap-3">
                          {assessmentItems.map((af, i) => (
                            <div key={i} className="flex items-start gap-2 text-gray-700">
                              <Stethoscope className="w-4 h-4 text-teal-600 mt-1 shrink-0" />
                              <span dangerouslySetInnerHTML={{ __html: af }} />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    {id && (
                      <LessonImageManager lessonId={id} section="assessment-findings" isAdmin={user?.tier === "admin"} isEditing={false} />
                    )}
                  </section>
                )}

                {lifespanText && (
                  <section id="lifespan" className="space-y-6">
                    <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                      <Users className="text-indigo-500 w-8 h-8" />
                      <h2>{t("pages.lessonDetail.acrossTheLifespan2")}</h2>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{t("pages.lessonDetail.agespecificClinicalVariationsAndSafety2")}</p>
                    <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100 leading-relaxed text-indigo-900">
                      <span className="italic" dangerouslySetInnerHTML={{ __html: lifespanText }} />
                    </div>
                    {id && (
                      <LessonImageManager lessonId={id} section="lifespan" isAdmin={user?.tier === "admin"} isEditing={false} />
                    )}
                  </section>
                )}

                {(signsLeft.length > 0 || signsRight.length > 0) && (
                  <section id="clinical-findings" className="space-y-6">
                    <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                      <AlertCircle className="text-orange-500 w-8 h-8" />
                      <h2>{t("pages.lessonDetail.clinicalFindingsAndRedFlags2")}</h2>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{t("pages.lessonDetail.keyClinicalPresentationsAndWarning2")}</p>
                    <div className="grid md:grid-cols-2 gap-8">
                      {signsLeft.length > 0 && (
                        <Card className="border-none shadow-md bg-white">
                          <CardContent className="p-8 space-y-4">
                            <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
                              <AlertCircle className="text-blue-500 w-6 h-6" />
                              <h3>{t("pages.lessonDetail.clinicalFindings2")}</h3>
                            </div>
                            <ul className="space-y-2">
                              {signsLeft.map((s, i) => (
                                <li key={i} className="flex items-center gap-2 text-gray-600">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                  <span dangerouslySetInnerHTML={{ __html: s }} />
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}
                      {signsRight.length > 0 && (
                        <Card className="border-none shadow-md bg-white border-l-4 border-l-orange-400">
                          <CardContent className="p-8 space-y-4">
                            <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
                              <AlertCircle className="text-orange-500 w-6 h-6" />
                              <h3>{t("pages.lessonDetail.redFlagsWhenToEscalate2")}</h3>
                            </div>
                            <ul className="space-y-2">
                              {signsRight.map((s, i) => (
                                <li key={i} className="flex items-center gap-2 text-gray-600">
                                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                                  <span dangerouslySetInnerHTML={{ __html: s }} />
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                    {id && (
                      <LessonImageManager lessonId={id} section="clinical-findings" isAdmin={user?.tier === "admin"} isEditing={false} />
                    )}
                  </section>
                )}

                {medsParsed.length > 0 && (
                  <section id="pharmacology" className="space-y-6">
                    <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                      <Pill className="text-primary w-8 h-8" />
                      <h2>{t("pages.lessonDetail.pharmacologyAndSafety2")}</h2>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{t("pages.lessonDetail.medicationsMechanismsAndSafetyConsiderations2")}</p>
                    <div className="space-y-4">
                      {medsParsed.map((med, i) => (
                        <Card key={i} className="border-none shadow-sm bg-white overflow-hidden text-gray-900">
                          <div className="bg-primary/5 px-6 py-3 border-b border-primary/10">
                            <span className="font-bold text-gray-900">{med.name}</span> {med.type && <span className="text-gray-500 text-sm">({med.type})</span>}
                          </div>
                          <CardContent className="p-6 grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <p className="text-sm font-bold text-gray-400 uppercase">{t("pages.lessonDetail.action2")}</p>
                              <p className="text-gray-700">{med.action}</p>
                              <p className="text-sm font-bold text-gray-400 uppercase pt-2">{t("pages.lessonDetail.sideEffects2")}</p>
                              <p className="text-gray-700">{med.sideEffects}</p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-bold text-gray-400 uppercase">{t("pages.lessonDetail.contraindications2")}</p>
                              <p className="text-gray-700">{med.contra}</p>
                              {med.pearl && (
                                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100 flex gap-2">
                                  <Lightbulb className="w-5 h-5 text-yellow-600 shrink-0" />
                                  <p className="text-sm text-yellow-800 font-medium">Pearl: {med.pearl}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    {id && (
                      <LessonImageManager lessonId={id} section="pharmacology" isAdmin={user?.tier === "admin"} isEditing={false} />
                    )}
                  </section>
                )}

                {clinicalPearls.length > 0 && (
                  <section id="exam-readiness" className="bg-gray-900 text-white p-10 rounded-3xl space-y-6 shadow-2xl">
                    <div className="flex items-center gap-3 text-2xl font-bold">
                      <FileText className="text-primary w-8 h-8" />
                      <h2>{t("pages.lessonDetail.examReadiness2")}</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="text-primary font-bold uppercase tracking-widest text-sm">{t("pages.lessonDetail.priorityLogic")}</h4>
                        <ul className="space-y-2 text-gray-300">
                          {clinicalPearls.map((p, i) => (
                            <li key={i} className="flex gap-2">
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                              <span dangerouslySetInnerHTML={{ __html: p }} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </section>
                )}

                {remainingBlocks.length > 0 && (
                  <ContentBlockRenderer blocks={remainingBlocks} />
                )}

                {!isAdmin && (!user || effectiveTier === "free") && (
                  <div className="mt-10 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20 p-8 text-center space-y-4" data-testid="lesson-conversion-cta">
                    <div className="flex items-center justify-center gap-2">
                      <TrendingUp className="w-6 h-6 text-primary" />
                      <h3 className="text-xl font-bold text-gray-900">{t("lesson.conversionCta.title")}</h3>
                    </div>
                    <p className="text-gray-600 max-w-lg mx-auto">{t("lesson.conversionCta.subtitle")}</p>
                    <p className="text-sm text-primary font-medium italic">{t("lesson.conversionCta.socialProof")}</p>
                    <LocaleLink href="/pricing">
                      <Button className="mt-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 text-base font-semibold gap-2" data-testid="button-lesson-upgrade-cta">
                        <Crown className="w-5 h-5" />
                        {t("lesson.conversionCta.button")}
                      </Button>
                    </LocaleLink>
                  </div>
                )}
              </div>
            </div>
          </main>
          <FixedLessonNav lessonId={id || ""} />
          <div className="pb-14" />
          <Footer />
        </div>
      );
    }

    if (isAdmin && id) {
      return (
        <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
          <Navigation />
          <main className="max-w-2xl mx-auto px-4 py-20 w-full text-center space-y-6">
            <LocaleLink href="/lessons">
              <Button variant="ghost" className="mb-4 group">
                <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Lessons
              </Button>
            </LocaleLink>
            <h1 className="text-3xl font-bold text-gray-900" data-testid="text-lesson-not-found-admin">{t("pages.lessonDetail.lessonNotFound")}</h1>
            <p className="text-gray-600">{t("pages.lessonDetail.thisLessonDoesNotExist")}</p>
            <Button
              className="mt-4"
              onClick={() => setShowAdminCreator(true)}
              data-testid="button-create-lesson"
            >
              Create New Lesson: {id}
            </Button>
            {showAdminCreator && (
              <AdminLessonCreator lessonId={id} onPublished={() => fetchDbLesson(id)} />
            )}
          </main>
          <Footer />
        </div>
      );
    }

    if (tierLocked) {
      return (
        <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
          <Navigation />
          <main className="max-w-2xl mx-auto px-4 py-20 w-full text-center space-y-6">
            <LocaleLink href="/lessons">
              <Button variant="ghost" className="mb-4 group" data-testid="button-back-lessons-locked">
                <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Lessons
              </Button>
            </LocaleLink>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900" data-testid="text-lesson-locked">{t("pages.lessonDetail.premiumLesson")}</h1>
            <p className="text-gray-600 max-w-md mx-auto">
              This lesson is part of the {getTierLabel(tierLocked.requiredTier)} plan. Upgrade your account to access this lesson and hundreds more with adaptive quizzes, flashcards, and spaced repetition.
            </p>
            <LocaleLink href={getTierPricingPath(tierLocked.requiredTier)}>
              <Button className="mt-4 bg-primary hover:bg-primary/90 text-white px-8 py-3 text-base font-semibold gap-2" data-testid="button-lesson-locked-upgrade">
                <Crown className="w-5 h-5" />
                Upgrade to {getTierLabel(tierLocked.requiredTier)}
              </Button>
            </LocaleLink>
          </main>
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
        <Navigation />
        <main className="max-w-2xl mx-auto px-4 py-20 w-full text-center space-y-6">
          <LocaleLink href="/lessons">
            <Button variant="ghost" className="mb-4 group" data-testid="button-back-lessons-coming-soon">
              <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Lessons
            </Button>
          </LocaleLink>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-lesson-coming-soon">{t("pages.lessonDetail.lessonComingSoon")}</h1>
          <p className="text-gray-600 max-w-md mx-auto">{t("pages.lessonDetail.thisLessonIsCurrentlyBeing")}</p>
          <LocaleLink href="/lessons">
            <Button className="mt-4 bg-primary hover:bg-primary/90 text-white px-6" data-testid="button-browse-lessons">
              Browse Available Lessons
            </Button>
          </LocaleLink>
        </main>
        <Footer />
      </div>
    );
  }

  const generateSectionWithAI = async (section: string) => {
    if (!sectionAiPrompt.trim()) {
      toast({ title: "Enter a prompt", description: "Describe what you want AI to generate for this section.", variant: "destructive" });
      return;
    }
    const creds = JSON.parse(localStorage.getItem("nursenest-credentials") || "{}");
    if (!creds.username) return;
    setSectionAiLoading(true);
    try {
      const sectionPromptMap: Record<string, string> = {
        pathophysiology: `For the lesson "${lessonContent?.title || id}", generate the pathophysiology section. ${sectionAiPrompt}. Return as JSON: {"content":"detailed pathophysiology text"}`,
        riskFactors: `For the lesson "${lessonContent?.title || id}", generate risk factors. ${sectionAiPrompt}. Return as JSON: {"items":["risk factor 1","risk factor 2",...]}`,
        diagnostics: `For the lesson "${lessonContent?.title || id}", generate diagnostic findings. ${sectionAiPrompt}. Return as JSON: {"items":["diagnostic 1","diagnostic 2",...]}`,
        management: `For the lesson "${lessonContent?.title || id}", generate medical management steps. ${sectionAiPrompt}. Return as JSON: {"items":["step 1","step 2",...]}`,
        nursingActions: `For the lesson "${lessonContent?.title || id}", generate priority nursing actions. ${sectionAiPrompt}. Return as JSON: {"items":["action 1","action 2",...]}`,
        assessmentFindings: `For the lesson "${lessonContent?.title || id}", generate nursing assessment findings including vital signs changes, inspection/auscultation/palpation/percussion findings, lab values, and key objective/subjective data a nurse would assess. ${sectionAiPrompt}. Return as JSON: {"items":["finding 1","finding 2",...]}`,
        signs: `For the lesson "${lessonContent?.title || id}", generate signs/symptoms in two columns. ${sectionAiPrompt}. Return as JSON: {"left":["early sign 1",...],"right":["late sign 1",...]}`,
        medications: `For the lesson "${lessonContent?.title || id}", generate key medications. ${sectionAiPrompt}. Return as JSON: {"medications":[{"name":"...","type":"...","action":"...","sideEffects":"...","contra":"...","pearl":"..."}]}`,
        pearls: `For the lesson "${lessonContent?.title || id}", generate clinical pearls. ${sectionAiPrompt}. Return as JSON: {"items":["pearl 1","pearl 2",...]}`,
        lifespan: `For the lesson "${lessonContent?.title || id}", generate lifespan considerations. ${sectionAiPrompt}. Return as JSON: {"content":"detailed lifespan text"}`,
      };
      const res = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: creds.username,
          password: creds.password,
          prompt: sectionPromptMap[section] || sectionAiPrompt,
          mode: "generate",
        }),
      });
      if (!res.ok) throw new Error("AI generation failed");
      const data = await res.json();
      const blocks = data.blocks || [];
      const jsonBlock = blocks.find((b: any) => b.content && (b.content.includes('"content"') || b.content.includes('"items"') || b.content.includes('"medications"') || b.content.includes('"left"')));
      if (jsonBlock && editData) {
        try {
          const jsonMatch = jsonBlock.content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            const updated = { ...editData };
            if (section === "pathophysiology" && parsed.content) {
              updated.cellular = { ...updated.cellular, content: parsed.content };
            } else if (section === "riskFactors" && parsed.items) {
              updated.riskFactors = parsed.items;
            } else if (section === "diagnostics" && parsed.items) {
              updated.diagnostics = parsed.items;
            } else if (section === "management" && parsed.items) {
              updated.management = parsed.items;
            } else if (section === "nursingActions" && parsed.items) {
              updated.nursingActions = parsed.items;
            } else if (section === "assessmentFindings" && parsed.items) {
              updated.assessmentFindings = parsed.items;
            } else if (section === "signs" && parsed.left) {
              updated.signs = { ...updated.signs, left: parsed.left, right: parsed.right || updated.signs?.right || [] };
            } else if (section === "medications" && parsed.medications) {
              updated.medications = parsed.medications;
            } else if (section === "pearls" && parsed.items) {
              updated.pearls = parsed.items;
            } else if (section === "lifespan" && parsed.content) {
              updated.lifespan = { title: updated.lifespan?.title || "Across the Lifespan", content: parsed.content };
            }
            setEditData(updated);
            toast({ title: "Section Updated", description: `AI generated content for ${section}. Review before saving.` });
          }
        } catch { toast({ title: "Parse Error", description: "Could not parse AI response. Try a different prompt.", variant: "destructive" }); }
      }
      setSectionAiTarget(null);
      setSectionAiPrompt("");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSectionAiLoading(false);
    }
  };

  const SectionAIButton = ({ section, label }: { section: string; label: string }) => {
    if (!isEditing) return null;
    return sectionAiTarget === section ? (
      <div className="flex items-center gap-2 mt-2">
        <Input
          value={sectionAiPrompt}
          onChange={(e) => setSectionAiPrompt(e.target.value)}
          placeholder={`Describe what to generate for ${label}...`}
          className="text-xs h-8"
          onKeyDown={(e) => { if (e.key === "Enter") generateSectionWithAI(section); }}
          data-testid={`input-section-ai-${section}`}
        />
        <Button size="sm" className="h-8 gap-1 bg-purple-600 hover:bg-purple-700 text-xs shrink-0" onClick={() => generateSectionWithAI(section)} disabled={sectionAiLoading} data-testid={`button-section-ai-generate-${section}`}>
          {sectionAiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          Generate
        </Button>
        <Button size="sm" variant="ghost" className="h-8 text-xs shrink-0" onClick={() => { setSectionAiTarget(null); setSectionAiPrompt(""); }}>
          <X className="w-3 h-3" />
        </Button>
      </div>
    ) : (
      <Button size="sm" variant="ghost" className="gap-1 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50" onClick={() => setSectionAiTarget(section)} data-testid={`button-section-ai-${section}`}>
        <Sparkles className="w-3 h-3" /> AI Generate
      </Button>
    );
  };

  const startEditing = () => {
    const data = JSON.parse(JSON.stringify(lessonContent));
    if (!data.riskFactors) data.riskFactors = [];
    if (!data.diagnostics) data.diagnostics = [];
    if (!data.management) data.management = [];
    if (!data.nursingActions) data.nursingActions = [];
    if (!data.assessmentFindings) data.assessmentFindings = [];
    if (!data.lifespan) data.lifespan = { title: "Across the Lifespan", content: "" };
    setEditData(data);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditData(null);
    setIsEditing(false);
  };

  const saveEdits = async () => {
    if (!editData || !id) return;
    setSaving(true);
    try {
      const diff: Record<string, any> = {};
      const fields: (keyof LessonContent)[] = ["cellular", "riskFactors", "diagnostics", "management", "nursingActions", "assessmentFindings", "lifespan", "signs", "medications", "pearls"];
      for (const field of fields) {
        const editVal = editData[field];
        const baseVal = baseLesson[field];
        if (JSON.stringify(editVal) !== JSON.stringify(baseVal)) {
          diff[field] = editVal;
        }
      }

      const creds = JSON.parse(localStorage.getItem("nursenest-credentials") || "{}");
      const adminId = user?.id || "";
      const headers: Record<string, string> = { "Content-Type": "application/json", "x-user-tier": user?.tier || "" };
      if (adminId) headers["x-admin-id"] = adminId;
      const res = await fetch(`/api/lesson-overrides/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ ...diff, ...(creds.username ? { username: creds.username, password: creds.password } : { adminId }) }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save failed");
      }
      setOverrides(Object.keys(diff).length > 0 ? diff : null);
      setIsEditing(false);
      setEditData(null);
      toast({ title: "Saved", description: "Lesson content updated successfully" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to save changes", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const ed = isEditing && editData ? editData : null;

  const lessonTier = getLessonTier(id || "");
  const userHasAccess = isPreviewOnly === false || canAccessTier(user?.tier, lessonTier, user?.testerAccess, user?.testerExpiry);

  const handleNoteChange = (value: string) => {
    setNoteContent(value);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      if (user && id) {
        fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, lessonId: id, content: value }),
        });
      }
    }, 2000);
  };

  async function handleSubscribe() {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, tier: lessonTier }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      toast({ title: "Error", description: "Could not start checkout", variant: "destructive" });
    }
  }

  const isPeds = id?.includes("peds") || id === "epiglottitis" || id === "cp-management" || id === "kawasaki-critical" || id === "all-leukemia";
  const isMeds = id?.includes("safety") || id?.includes("labs") || id?.includes("mi-management");

  if (!authLoading && !userHasAccess && !isPreviewOnly) {
    const tp = tierPricing[lessonTier];
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
        <SEO title={`${lessonContent?.title || "Lesson"} - NurseNest`} description={t("pages.lessonDetail.subscribeToAccessThisLesson")} />
        <Navigation />
        <main className="max-w-2xl mx-auto px-4 py-20 w-full text-center space-y-8">
          <LocaleLink href="/lessons">
            <Button variant="ghost" className="mb-4 group">
              <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Lessons
            </Button>
          </LocaleLink>

          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-12 h-12 text-primary" />
          </div>

          <h1 className="text-4xl font-bold">{lessonContent.title}</h1>
          <p className="text-lg text-gray-600">
            This lesson requires a <strong>{tp.name}</strong> subscription to access.
          </p>

          <Card className="border-none shadow-xl max-w-sm mx-auto">
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-2 justify-center">
                <Crown className="w-6 h-6 text-amber-500" />
                <span className="text-xl font-bold">{tp.name} Tier</span>
              </div>
              <p className="text-3xl font-bold text-primary">{region === "CA" ? tp.priceCAD : tp.priceUSD}</p>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Full access to all {tp.name} lessons</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> {t("pages.lessonDetail.flashcardsAndQuestionBank")}</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> {t("pages.lessonDetail.progressTrackingAndReports")}</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> {t("pages.lessonDetail.notetakingAndStudyTools")}</li>
              </ul>
              <Button className="w-full rounded-full h-12 text-lg" onClick={handleSubscribe} data-testid="button-subscribe">
                {user ? "Subscribe Now" : "Sign In to Subscribe"}
              </Button>
            </CardContent>
          </Card>

          <div className="mt-10 max-w-2xl mx-auto" data-testid="lesson-locked-social-proof">
            <SocialProofBar />
          </div>

          {(() => {
            const nav = getLessonNavigation(id || "");
            if (!nav) return null;
            return (
              <div className="mt-8 flex items-stretch gap-4 max-w-2xl mx-auto w-full" data-testid="lesson-navigation">
                {nav.prev ? (
                  <LocaleLink href={`/lessons/${nav.prev.id}`} className="flex-1">
                    <div className="h-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all group cursor-pointer" data-testid="button-prev-lesson">
                      <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="text-xs text-gray-500 block">{t("pages.lessonDetail.previousLesson")}</span>
                        <span className="text-sm font-medium text-gray-900 block truncate">{nav.prev.name}</span>
                      </div>
                    </div>
                  </LocaleLink>
                ) : (
                  <div className="flex-1" />
                )}
                {nav.next ? (
                  <LocaleLink href={`/lessons/${nav.next.id}`} className="flex-1">
                    <div className="h-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all group cursor-pointer text-right" data-testid="button-next-lesson">
                      <div className="min-w-0 flex-1">
                        <span className="text-xs text-gray-500 block">{t("pages.lessonDetail.nextLesson")}</span>
                        <span className="text-sm font-medium text-gray-900 block truncate">{nav.next.name}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                    </div>
                  </LocaleLink>
                ) : (
                  <div className="flex-1" />
                )}
              </div>
            );
          })()}
        </main>
        <AdminEditButton />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900 ${user?.tier !== "admin" ? "select-none" : ""}`} onContextMenu={user?.tier !== "admin" ? (e) => e.preventDefault() : undefined}>
      <SEO
        title={generateLessonSeoTitle(id || "", lessonContent)}
        description={generateLessonSeoDescription(id || "", lessonContent)}
        keywords={generateLessonKeywords(id || "", lessonContent)}
        canonicalPath={`/lessons/${id}`}
        ogType="article"
        noindex={isLessonThinContent(lessonContent)}
        structuredData={buildLessonStructuredData(id || "", lessonContent, lessonTier === "free")}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: "Lessons", url: "https://www.nursenest.ca/lessons" },
          { name: getLessonBodySystem(id || ""), url: "https://www.nursenest.ca/lessons" },
          { name: lessonContent.title, url: `https://www.nursenest.ca/lessons/${id}` },
        ]}
        additionalStructuredData={[
          buildArticleStructuredData(id || "", lessonContent),
          buildCourseStructuredData(id || "", lessonContent),
          ...(lessonContent.quiz && lessonContent.quiz.length > 0 ? [buildFaqFromQuizQuestions(lessonContent.quiz)] : []),
          ...(buildLessonFaqFromContent(id || "", lessonContent).length > 0 ? [buildFaqStructuredData(buildLessonFaqFromContent(id || "", lessonContent))] : []),
        ]}
      />
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav aria-label={t("pages.lessonDetail.breadcrumb2")} className="mb-2 text-sm text-gray-500" data-testid="nav-breadcrumb">
          <ol className="flex items-center gap-1 flex-wrap">
            <li><LocaleLink href="/" className="hover:text-primary transition-colors">{t("pages.lessonDetail.home2")}</LocaleLink></li>
            <li className="text-gray-300">/</li>
            <li><LocaleLink href="/lessons" className="hover:text-primary transition-colors">{t("pages.lessonDetail.lessons2")}</LocaleLink></li>
            <li className="text-gray-300">/</li>
            <li className="text-gray-400">{getLessonBodySystem(id || "")}</li>
            <li className="text-gray-300">/</li>
            <li className="text-gray-900 font-medium truncate max-w-[200px]">{lessonContent.title}</li>
          </ol>
        </nav>

        <div className="flex items-center justify-between mb-2">
          <LocaleLink href="/lessons">
            <Button variant="ghost" size="sm" className="group -ml-2 h-8 text-sm">
              <ArrowLeft className="mr-1.5 w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              Back to Overview
            </Button>
          </LocaleLink>
        </div>

        {(() => {
          const nav = getLessonNavigation(id || "");
          return (
            <div className="grid grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] items-center min-h-[36px] mb-4" data-testid="nav-prev-next">
              <div className="min-w-0 overflow-hidden">
                {nav?.prev ? (
                  <LocaleLink href={`/lessons/${nav.prev.id}`}>
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors cursor-pointer max-w-full" data-testid="link-prev-lesson-top">
                      <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
                      <span className="hidden sm:inline truncate" title={nav.prev.name}>{nav.prev.name}</span>
                      <span className="sm:hidden">{t("pages.lessonDetail.prev")}</span>
                    </span>
                  </LocaleLink>
                ) : <span className="text-sm text-transparent select-none" aria-hidden="true">{t("pages.lessonDetail.prev2")}</span>}
              </div>
              <div />
              <div className="min-w-0 overflow-hidden flex justify-end">
                {nav?.next ? (
                  <LocaleLink href={`/lessons/${nav.next.id}`}>
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors cursor-pointer max-w-full" data-testid="link-next-lesson-top">
                      <span className="hidden sm:inline truncate" title={nav.next.name}>{nav.next.name}</span>
                      <span className="sm:hidden">{t("pages.lessonDetail.next")}</span>
                      <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    </span>
                  </LocaleLink>
                ) : <span className="text-sm text-transparent select-none" aria-hidden="true">{t("pages.lessonDetail.next2")}</span>}
              </div>
            </div>
          );
        })()}

        {showNotes && (
          <div className="fixed bottom-4 right-4 z-40 w-80 sm:w-96 max-h-[70vh] shadow-2xl rounded-2xl border border-yellow-200 bg-yellow-50/95 backdrop-blur-lg overflow-hidden flex flex-col" data-testid="panel-sticky-notes">
            <div className="flex items-center justify-between p-4 pb-2 border-b border-yellow-200/60">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                <StickyNote className="w-4 h-4 text-yellow-600" /> Study Notes
              </h3>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-medium ${noteSaving ? "text-amber-500" : "text-emerald-500"}`}>
                  {noteSaving ? "Saving..." : "Saved"}
                </span>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={saveNote} data-testid="button-save-note">
                  <Save className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setShowNotes(false)} data-testid="button-close-notes">
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </Button>
              </div>
            </div>
            <div className="px-3 py-2 border-b border-yellow-100 bg-yellow-50/50">
              <p className="text-[10px] text-yellow-700 font-medium">{lessonContent.title}</p>
            </div>
            <div className="p-3 flex-1 overflow-y-auto">
              <Textarea
                value={noteContent}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder={"Write your study notes here...\n\nTips:\n- Key findings to remember\n- Nursing priorities\n- Medications and side effects\n- Questions for further review"}
                className="min-h-[220px] bg-white border-yellow-200 focus:border-yellow-400 text-sm resize-y leading-relaxed"
                data-testid="textarea-notes"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-[10px] text-gray-400">{t("pages.lessonDetail.autosavesAsYouType")}</p>
                <p className="text-[10px] text-gray-400">{noteContent.length > 0 ? `${noteContent.length} chars` : ""}</p>
              </div>
            </div>
          </div>
        )}

        {(() => {
          const lessonImg = getLessonImage(id || "");
          const lessonId = id || "";
          const caption = getImageCaption(lessonId);
          return lessonImg ? (
            <figure className="mb-6" data-testid={`figure-lesson-${lessonId}`}>
              <div className="relative w-full rounded-2xl overflow-hidden shadow-md bg-gray-50">
                <ProtectedImage
                  src={lessonImg}
                  alt={getImageAltText(lessonId, lessonContent.title)}
                  title={getImageTitle(lessonId, lessonContent.title)}
                  className="w-full h-auto max-h-[500px] object-contain"
                  loading="lazy"
                  data-testid={`img-lesson-${lessonId}`}
                />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getImageStructuredData(lessonId, lessonImg, lessonContent.title)) }} />
              </div>
              {caption && (
                <figcaption className="mt-2 text-sm text-gray-500 italic text-center px-4" data-testid={`caption-lesson-${lessonId}`}>
                  {caption}
                </figcaption>
              )}
            </figure>
          ) : null;
        })()}
        <LessonImageManager lessonId={id || ""} section="header" isAdmin={user?.tier === "admin"} isEditing={isEditing} />

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-x-6 gap-y-3 items-start">
            <div className="space-y-3 min-w-0">
              <div className="flex items-center gap-3">
                {isPeds && (
                  <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-500 shrink-0">
                    <Baby className="w-5 h-5" />
                  </div>
                )}
                {isMeds && (
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-500 shrink-0">
                    <Beaker className="w-5 h-5" />
                  </div>
                )}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight" data-testid="text-lesson-title">{lessonContent.title}</h1>
              </div>
              {(() => {
                const diff = getDifficulty(id || "");
                const config = difficultyConfig[diff];
                return (
                  <div className="flex items-center gap-2 flex-wrap" data-testid="lesson-chips">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold" data-testid="chip-tier">
                      {lessonTier === "np" ? "NP Focus" : lessonTier === "rn" ? "RN Focus" : "RPN Focus"}
                    </span>
                    <span data-testid="lesson-difficulty-badge" className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${config.bg} ${config.color}`}>
                      Difficulty: {config.label}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold" data-testid="chip-region">
                      {region === "CA" ? "Canadian Guidelines" : "US Guidelines"}
                    </span>
                  </div>
                );
              })()}
            </div>

            {!isPreviewOnly && (
            <div className="flex md:flex-col items-center md:items-stretch gap-2 md:pt-1 w-full md:w-[220px]" data-testid="lesson-actions">
              <Button
                variant={showNotes ? "default" : "outline"}
                onClick={() => setShowNotes(!showNotes)}
                className="gap-2 w-full justify-center h-9 text-sm"
                data-testid="button-toggle-notes"
              >
                <StickyNote className="w-4 h-4" />
                {showNotes ? "Hide Notes" : "My Notes"}
              </Button>
              {user?.tier === "admin" && !isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs w-full justify-center h-9"
                  onClick={startEditing}
                  data-testid="button-admin-edit-lesson"
                >
                  <Pencil className="w-3 h-3" />
                  Edit Inline
                </Button>
              )}
            </div>
            )}
          </div>

          {!isPreviewOnly && (
          <Card className="bg-primary/5 border-none">
            <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="space-y-0.5 min-w-0">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">{t("pages.lessonDetail.learningProgress")}</p>
                <p className="text-sm text-gray-600 hidden sm:block">{t("pages.lessonDetail.pretestStudyPosttestTrackYour")}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-bold text-primary" data-testid="text-progress-pct">{postTestDone ? "100%" : preTestDone ? "50%" : "0%"}</p>
                <Progress value={postTestDone ? 100 : preTestDone ? 50 : 0} className="w-28 h-2" />
              </div>
            </CardContent>
          </Card>
          )}

          {!isPreviewOnly && (
          <div className="flex items-center justify-end gap-4 text-xs text-gray-500" data-testid="test-visibility-toggles">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={!hidePreTest}
                onChange={(e) => {
                  const hide = !e.target.checked;
                  setHidePreTest(hide);
                  localStorage.setItem("nursenest-hide-pretest", String(hide));
                  if (hide && activeTab === "pretest") setActiveTab("content");
                }}
                className="rounded border-gray-300 text-primary focus:ring-primary w-3.5 h-3.5"
                data-testid="toggle-pretest"
              />
              Show Pre-Test
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={!hidePostTest}
                onChange={(e) => {
                  const hide = !e.target.checked;
                  setHidePostTest(hide);
                  localStorage.setItem("nursenest-hide-posttest", String(hide));
                  if (hide && activeTab === "posttest") setActiveTab("content");
                }}
                className="rounded border-gray-300 text-primary focus:ring-primary w-3.5 h-3.5"
                data-testid="toggle-posttest"
              />
              Show Post-Test
            </label>
          </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" data-testid="tabs-lesson">
            <TabsList className={`grid w-full h-12 ${(hidePreTest || isPreviewOnly) && (hidePostTest || isPreviewOnly) ? "grid-cols-1" : (hidePreTest || isPreviewOnly) || (hidePostTest || isPreviewOnly) ? "grid-cols-2" : "grid-cols-3"}`}>
              {!hidePreTest && !isPreviewOnly && (
                <TabsTrigger value="pretest" className="gap-2 text-sm" data-testid="tab-pretest">
                  <BarChart3 className="w-4 h-4" />
                  Pre-Test
                </TabsTrigger>
              )}
              <TabsTrigger value="content" className="gap-2 text-sm" data-testid="tab-content">
                <Stethoscope className="w-4 h-4" />
                {isPreviewOnly ? "Preview" : "Clinical Content"}
              </TabsTrigger>
              {!hidePostTest && !isPreviewOnly && (
                <TabsTrigger value="posttest" className="gap-2 text-sm" data-testid="tab-posttest">
                  <TrendingUp className="w-4 h-4" />
                  Post-Test
                </TabsTrigger>
              )}
            </TabsList>

            {!hidePreTest && (
              <TabsContent value="pretest" className="mt-6">
                <QuizSection
                  questions={preTestQuestions}
                  lessonId={id || ""}
                  testType="pretest"
                  onComplete={(score, total) => {
                    setPreTestDone(true);
                    trackMilestone("test_complete", { score: Math.round((score / total) * 100) });
                  }}
                />
              </TabsContent>
            )}

            <TabsContent value="content" className="mt-6">
              <ProtectedContent>
              <nav className="hidden lg:block fixed left-4 top-1/3 z-30 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-3 space-y-1 max-w-[160px]" data-testid="nav-quick-sections">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{t("pages.lessonDetail.sections")}</p>
                {[
                  { id: "pathophysiology", label: "Pathophysiology" },
                  { id: "risk-factors", label: "Risk Factors" },
                  { id: "diagnostics", label: "Diagnostics & Labs" },
                  { id: "management", label: "Management & Treatment" },
                  { id: "nursing-actions", label: "Nursing Interventions" },
                  { id: "assessment-findings", label: "Assessment Findings" },
                  { id: "lifespan", label: "Lifespan" },
                  { id: "clinical-findings", label: "Signs & Red Flags" },
                  { id: "pharmacology", label: "Pharmacology & Safety" },
                  { id: "exam-readiness", label: "Exam & Clinical Pearls" },
                ].map(item => (
                  <a key={item.id} href={`#${item.id}`} className="block text-xs text-gray-500 hover:text-primary py-1 px-2 rounded hover:bg-primary/5 transition-colors truncate">
                    {item.label}
                  </a>
                ))}
              </nav>
              {isEditing && (
                <div className="sticky top-0 z-50 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between shadow-lg mb-6" data-testid="bar-inline-editing">
                  <div className="flex items-center gap-2 text-amber-800 font-medium">
                    <Pencil className="w-4 h-4" />
                    Editing Mode
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={cancelEditing} className="gap-1" data-testid="button-cancel-edit">
                      <X className="w-3 h-3" /> Cancel
                    </Button>
                    <Button size="sm" onClick={saveEdits} disabled={saving} className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white" data-testid="button-save-publish">
                      <Save className="w-3 h-3" /> {saving ? "Saving..." : "Save & Publish"}
                    </Button>
                  </div>
                </div>
              )}
              <div className="space-y-12">
                <section id="pathophysiology" className="space-y-6">
                  <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                    <Microscope className="text-primary w-8 h-8" />
                    {ed ? (
                      <EditableText value={ed.cellular.title} onChange={(v) => setEditData({ ...ed, cellular: { ...ed.cellular, title: v } })} className="text-2xl font-bold" />
                    ) : (
                      <h2>{lessonContent.cellular.title}</h2>
                    )}
                    <SectionAIButton section="pathophysiology" label={t("pages.lessonDetail.pathophysiology2")} />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{t("pages.lessonDetail.pathophysiologyAtTheCellularLevel2")}</p>
                  <Card className="border-none shadow-sm bg-violet-50/50">
                    <CardContent className="p-8 leading-relaxed text-gray-700">
                    {ed ? (
                      <EditableText value={ed.cellular.content} onChange={(v) => setEditData({ ...ed, cellular: { ...ed.cellular, content: v } })} multiline className="min-h-[200px]" />
                    ) : (
                      <div className="whitespace-pre-wrap"><RichTextDisplay html={lessonContent.cellular.content} /></div>
                    )}
                    </CardContent>
                  </Card>
                  {id && (
                    <LessonImageManager
                      lessonId={id}
                      section="pathophysiology"
                      isAdmin={user?.tier === "admin"}
                      isEditing={isEditing}
                    />
                  )}
                </section>

                {isPreviewOnly && (
                  <div className="relative" data-testid="container-preview-lock">
                    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-white shadow-lg">
                      <CardContent className="p-8 text-center space-y-4">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                          <Lock className="w-7 h-7 text-primary/70" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{t("pages.lessonDetail.unlockFullLesson")}</h3>
                        <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                          You're viewing a preview of this lesson. Upgrade to {getTierLabel(previewRequiredTier)} to access the complete content including diagnostics, management, nursing actions, medications, and exam readiness.
                        </p>
                        <LocaleLink href={getTierPricingPath(previewRequiredTier)}>
                          <Button size="lg" className="rounded-full gap-2 bg-primary text-white hover:brightness-110 px-8 shadow-lg shadow-primary/20" data-testid="button-preview-upgrade">
                            <Sparkles className="w-4 h-4" />
                            Upgrade to {getTierLabel(previewRequiredTier)}
                          </Button>
                        </LocaleLink>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {!isPreviewOnly && <>
                {(ed || (lessonContent.riskFactors && lessonContent.riskFactors.length > 0)) ? (
                  <section id="risk-factors" data-testid="section-risk-factors" className="space-y-6">
                    <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                      <ShieldAlert className="text-rose-500 w-8 h-8" />
                      <h2>{t("pages.lessonDetail.riskFactors2")}</h2>
                      <SectionAIButton section="riskFactors" label={t("pages.lessonDetail.riskFactors3")} />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{t("pages.lessonDetail.keyPredisposingAndContributingFactors2")}</p>
                    <Card className="border-none shadow-sm bg-rose-50/60">
                      <CardContent className="p-8">
                        {ed ? (
                          <EditableList items={ed.riskFactors || []} onChange={(items) => setEditData({ ...ed, riskFactors: items })} placeholder={t("pages.lessonDetail.riskFactor")} />
                        ) : (
                          <div className="grid sm:grid-cols-2 gap-3">
                            {lessonContent.riskFactors!.map((rf, i) => (
                              <div key={i} className="flex items-start gap-2 text-gray-700">
                                <div className="w-2 h-2 rounded-full bg-rose-400 mt-2 shrink-0" />
                                <RichTextDisplay html={rf} />
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    {id && (
                      <LessonImageManager
                        lessonId={id}
                        section="risk-factors"
                        isAdmin={user?.tier === "admin"}
                        isEditing={isEditing}
                      />
                    )}
                  </section>
                ) : null}

                {(ed || (lessonContent.diagnostics && lessonContent.diagnostics.length > 0)) ? (
                  <section id="diagnostics" data-testid="section-diagnostics" className="space-y-6">
                    <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                      <Search className="text-cyan-600 w-8 h-8" />
                      <h2>{t("pages.lessonDetail.diagnosticStudiesAmpLabFindings")}</h2>
                      <SectionAIButton section="diagnostics" label={t("pages.lessonDetail.diagnostics2")} />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{t("pages.lessonDetail.confirmatoryDiagnosticTestsLabValues")}</p>
                    <Card className="border-none shadow-sm bg-cyan-50/60">
                      <CardContent className="p-8">
                        {ed ? (
                          <EditableList items={ed.diagnostics || []} onChange={(items) => setEditData({ ...ed, diagnostics: items })} placeholder={t("pages.lessonDetail.diagnosticFinding")} />
                        ) : (
                          <div className="grid sm:grid-cols-2 gap-3">
                            {lessonContent.diagnostics!.map((d, i) => (
                              <div key={i} className="flex items-start gap-2 text-gray-700">
                                <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 shrink-0" />
                                <RichTextDisplay html={d} />
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    {id && (
                      <LessonImageManager
                        lessonId={id}
                        section="diagnostics"
                        isAdmin={user?.tier === "admin"}
                        isEditing={isEditing}
                      />
                    )}
                  </section>
                ) : null}

                {(ed || (lessonContent.management && lessonContent.management.length > 0)) ? (
                  <section id="management" data-testid="section-management" className="space-y-6">
                    <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                      <ClipboardList className="text-emerald-600 w-8 h-8" />
                      <h2>{t("pages.lessonDetail.clinicalManagementAmpTreatment")}</h2>
                      <SectionAIButton section="management" label={t("pages.lessonDetail.management2")} />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{t("pages.lessonDetail.evidencebasedInterventionsTreatmentProtocols")}</p>
                    <Card className="border-none shadow-sm bg-emerald-50/60">
                      <CardContent className="p-8">
                        {ed ? (
                          <EditableList items={ed.management || []} onChange={(items) => setEditData({ ...ed, management: items })} placeholder={t("pages.lessonDetail.managementStep")} />
                        ) : (
                          <ul className="space-y-3">
                            {lessonContent.management!.map((m, i) => (
                              <li key={i} className="flex items-start gap-3 text-gray-700">
                                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                  <span className="text-emerald-700 text-xs font-bold">{i + 1}</span>
                                </div>
                                <RichTextDisplay html={m} />
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                    {id && (
                      <LessonImageManager
                        lessonId={id}
                        section="management"
                        isAdmin={user?.tier === "admin"}
                        isEditing={isEditing}
                      />
                    )}
                  </section>
                ) : null}

                {(ed || (lessonContent.nursingActions && lessonContent.nursingActions.length > 0)) ? (
                  <section id="nursing-actions" data-testid="section-nursing-actions" className="space-y-6">
                    <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                      <HeartPulse className="text-violet-600 w-8 h-8" />
                      <h2>{t("pages.lessonDetail.nursingInterventionsAmpScopeOf")}</h2>
                      <SectionAIButton section="nursingActions" label={t("pages.lessonDetail.nursingActions")} />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{t("pages.lessonDetail.priorityNursingAssessmentsClinicalInterventio")}</p>
                    <Card className="border-none shadow-sm bg-violet-50/60">
                      <CardContent className="p-8">
                        {ed ? (
                          <EditableList items={ed.nursingActions || []} onChange={(items) => setEditData({ ...ed, nursingActions: items })} placeholder={t("pages.lessonDetail.nursingAction")} />
                        ) : (
                          <ul className="space-y-3">
                            {lessonContent.nursingActions!.map((na, i) => (
                              <li key={i} className="flex items-start gap-3 text-gray-700">
                                <HeartPulse className="w-4 h-4 text-violet-500 mt-1 shrink-0" />
                                <RichTextDisplay html={na} />
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                    {id && (
                      <LessonImageManager
                        lessonId={id}
                        section="nursing-actions"
                        isAdmin={user?.tier === "admin"}
                        isEditing={isEditing}
                      />
                    )}
                  </section>
                ) : null}

                {(ed || (lessonContent.assessmentFindings && lessonContent.assessmentFindings.length > 0)) ? (
                  <section id="assessment-findings" data-testid="section-assessment-findings" className="space-y-6">
                    <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                      <ClipboardList className="text-teal-600 w-8 h-8" />
                      <h2>{t("pages.lessonDetail.clinicalAssessmentFindings")}</h2>
                      <SectionAIButton section="assessmentFindings" label={t("pages.lessonDetail.assessmentFindings2")} />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{t("pages.lessonDetail.keyNursingAssessmentDataVital2")}</p>
                    <Card className="border-none shadow-sm bg-teal-50/60">
                      <CardContent className="p-8">
                        {ed ? (
                          <EditableList items={ed.assessmentFindings || []} onChange={(items) => setEditData({ ...ed, assessmentFindings: items })} placeholder={t("pages.lessonDetail.assessmentFinding")} />
                        ) : (
                          <div className="grid sm:grid-cols-2 gap-3">
                            {lessonContent.assessmentFindings!.map((af, i) => (
                              <div key={i} className="flex items-start gap-2 text-gray-700">
                                <Stethoscope className="w-4 h-4 text-teal-600 mt-1 shrink-0" />
                                <RichTextDisplay html={af} />
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    {id && (
                      <LessonImageManager
                        lessonId={id}
                        section="assessment-findings"
                        isAdmin={user?.tier === "admin"}
                        isEditing={isEditing}
                      />
                    )}
                  </section>
                ) : null}

                {(ed || lessonContent.lifespan) && (
                  <section id="lifespan" className="space-y-6">
                    <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                      <Users className="text-indigo-500 w-8 h-8" />
                      <h2>{t("pages.lessonDetail.acrossTheLifespan3")}</h2>
                      <SectionAIButton section="lifespan" label={t("pages.lessonDetail.lifespan")} />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{t("pages.lessonDetail.agespecificClinicalVariationsAndSafety3")}</p>
                    <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100 leading-relaxed text-indigo-900">
                      {ed && ed.lifespan ? (
                        <EditableText value={ed.lifespan.content} onChange={(v) => setEditData({ ...ed, lifespan: { ...ed.lifespan!, content: v } })} multiline className="min-h-[120px]" />
                      ) : (
                        <span className="italic"><RichTextDisplay html={lessonContent.lifespan!.content} /></span>
                      )}
                    </div>
                    {id && (
                      <LessonImageManager
                        lessonId={id}
                        section="lifespan"
                        isAdmin={user?.tier === "admin"}
                        isEditing={isEditing}
                      />
                    )}
                  </section>
                )}

                {id === "vital-signs-red-flags" && <VitalSignsReferenceCharts />}
                {id === "infection-prevention-ppe" && <IsolationTypesGuide />}

                <section id="clinical-findings" className="space-y-6">
                  <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                    <AlertCircle className="text-orange-500 w-8 h-8" />
                    <h2>{t("pages.lessonDetail.signsSymptomsAmpClinicalRed")}</h2>
                    <SectionAIButton section="signs" label={t("pages.lessonDetail.signsSymptoms")} />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{t("pages.lessonDetail.keyClinicalPresentationsWarningSigns")}</p>
                  <div className="grid md:grid-cols-2 gap-8">
                    <Card className="border-none shadow-md bg-white">
                      <CardContent className="p-8 space-y-4">
                        <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
                          <AlertCircle className="text-blue-500 w-6 h-6" />
                          <h3>{t("pages.lessonDetail.clinicalFindings3")}</h3>
                        </div>
                        {ed ? (
                          <EditableList items={ed.signs.left} onChange={(items) => setEditData({ ...ed, signs: { ...ed.signs, left: items } })} placeholder={t("pages.lessonDetail.clinicalFinding")} />
                        ) : (
                          <ul className="space-y-2">
                            {lessonContent.signs.left.map((s, i) => (
                              <li key={i} className="flex items-center gap-2 text-gray-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                <RichTextDisplay html={s} />
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                    <Card className="border-none shadow-md bg-white border-l-4 border-l-orange-400">
                      <CardContent className="p-8 space-y-4">
                        <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
                          <AlertCircle className="text-orange-500 w-6 h-6" />
                          <h3>{t("pages.lessonDetail.redFlagsWhenToEscalate3")}</h3>
                        </div>
                        {ed ? (
                          <EditableList items={ed.signs.right} onChange={(items) => setEditData({ ...ed, signs: { ...ed.signs, right: items } })} placeholder={t("pages.lessonDetail.redFlag")} />
                        ) : (
                          <ul className="space-y-2">
                            {lessonContent.signs.right.map((s, i) => (
                              <li key={i} className="flex items-center gap-2 text-gray-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                                <RichTextDisplay html={s} />
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  {id && (
                    <LessonImageManager
                      lessonId={id}
                      section="clinical-findings"
                      isAdmin={user?.tier === "admin"}
                      isEditing={isEditing}
                    />
                  )}
                </section>

                {id && /^(lung-auscultation|lung-sounds|respiratory-assessment|breath-sound|pulmonary-assessment)/.test(id) && !isEditing && (
                  <section id="auscultation-interactive" className="space-y-6" data-testid="section-auscultation-interactive">
                    <AuscultationSitesDiagram />
                    <RespiratorySoundsLibrary />
                  </section>
                )}

                <section id="pharmacology" className="space-y-6">
                  <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                    <Pill className="text-primary w-8 h-8" />
                    <h2>{t("pages.lessonDetail.pharmacologyMedicationsAmpSafety")}</h2>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{t("pages.lessonDetail.keyMedicationsDrugClassesMechanisms")}</p>
                  <SectionAIButton section="medications" label={t("pages.lessonDetail.medications")} />
                  <div className="space-y-4">
                    {(ed || lessonContent).medications.map((med, i) => (
                      <Card key={i} className="border-none shadow-sm bg-white overflow-hidden text-gray-900">
                        <div className="bg-primary/5 px-6 py-3 border-b border-primary/10 flex items-center justify-between">
                          {ed ? (
                            <div className="flex gap-2 flex-1">
                              <Input value={med.name} onChange={(e) => { const meds = [...ed.medications]; meds[i] = { ...meds[i], name: e.target.value }; setEditData({ ...ed, medications: meds }); }} placeholder={t("pages.lessonDetail.drugName2")} className="font-bold w-40" />
                              <Input value={med.type} onChange={(e) => { const meds = [...ed.medications]; meds[i] = { ...meds[i], type: e.target.value }; setEditData({ ...ed, medications: meds }); }} placeholder={t("pages.lessonDetail.type")} className="w-32" />
                              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-600" onClick={() => { const meds = ed.medications.filter((_, idx) => idx !== i); setEditData({ ...ed, medications: meds }); }}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div>
                              <span className="font-bold text-gray-900">{med.name}</span> <span className="text-gray-500 text-sm">({med.type})</span>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-6 grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <p className="text-sm font-bold text-gray-400 uppercase">{t("pages.lessonDetail.action3")}</p>
                            {ed ? (
                              <RichTextEditor value={med.action} onChange={(v) => { const meds = [...ed.medications]; meds[i] = { ...meds[i], action: v }; setEditData({ ...ed, medications: meds }); }} minHeight="60px" />
                            ) : (
                              <p className="text-gray-700"><RichTextDisplay html={med.action} /></p>
                            )}
                            <p className="text-sm font-bold text-gray-400 uppercase pt-2">{t("pages.lessonDetail.sideEffects3")}</p>
                            {ed ? (
                              <RichTextEditor value={med.sideEffects} onChange={(v) => { const meds = [...ed.medications]; meds[i] = { ...meds[i], sideEffects: v }; setEditData({ ...ed, medications: meds }); }} minHeight="60px" />
                            ) : (
                              <p className="text-gray-700"><RichTextDisplay html={med.sideEffects} /></p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-bold text-gray-400 uppercase">{t("pages.lessonDetail.contraindications3")}</p>
                            {ed ? (
                              <RichTextEditor value={med.contra} onChange={(v) => { const meds = [...ed.medications]; meds[i] = { ...meds[i], contra: v }; setEditData({ ...ed, medications: meds }); }} minHeight="60px" />
                            ) : (
                              <p className="text-gray-700"><RichTextDisplay html={med.contra} /></p>
                            )}
                            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100 flex gap-2">
                              <Lightbulb className="w-5 h-5 text-yellow-600 shrink-0" />
                              {ed ? (
                                <Input value={med.pearl} onChange={(e) => { const meds = [...ed.medications]; meds[i] = { ...meds[i], pearl: e.target.value }; setEditData({ ...ed, medications: meds }); }} className="text-sm" />
                              ) : (
                                <p className="text-sm text-yellow-800 font-medium">Pearl: <RichTextDisplay html={med.pearl} /></p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {ed && (
                      <Button variant="outline" className="gap-2" onClick={() => setEditData({ ...ed, medications: [...ed.medications, { name: "", type: "", action: "", sideEffects: "", contra: "", pearl: "" }] })}>
                        <Plus className="w-4 h-4" /> Add Medication
                      </Button>
                    )}
                  </div>
                  {id && (
                    <LessonImageManager
                      lessonId={id}
                      section="pharmacology"
                      isAdmin={user?.tier === "admin"}
                      isEditing={isEditing}
                    />
                  )}
                </section>

                <section id="exam-readiness" className="bg-gray-900 text-white p-10 rounded-3xl space-y-6 shadow-2xl">
                  <div className="flex items-center gap-3 text-2xl font-bold">
                    <FileText className="text-primary w-8 h-8" />
                    <h2>{t("pages.lessonDetail.examReadinessAmpClinicalPearls")}</h2>
                  </div>
                  <SectionAIButton section="pearls" label={t("pages.lessonDetail.examPearls")} />
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-primary font-bold uppercase tracking-widest text-sm">{t("pages.lessonDetail.priorityLogic2")}</h4>
                      {ed ? (
                        <EditableList items={ed.pearls} onChange={(items) => setEditData({ ...ed, pearls: items })} placeholder={t("pages.lessonDetail.examPearl")} />
                      ) : (
                        <ul className="space-y-2 text-gray-300">
                          {lessonContent.pearls.map((p, i) => (
                            <li key={i} className="flex gap-2">
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                              <RichTextDisplay html={p} />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                      <h4 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">{t("pages.lessonDetail.commonExamTraps")}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed italic">
                        These are the high-yield reasoning patterns most commonly tested. Focus on what changed, what is the priority, and what should the nurse do first.
                      </p>
                    </div>
                  </div>
                </section>
                </>}
              </div>
              </ProtectedContent>
            </TabsContent>

            {!hidePostTest && (
              <TabsContent value="posttest" className="mt-6">
                <QuizSection
                  questions={postTestQuestions}
                  lessonId={id || ""}
                  testType="posttest"
                  onComplete={(score, total) => {
                    setPostTestDone(true);
                    trackMilestone("test_complete", { score: Math.round((score / total) * 100) });
                    if (user) {
                      fetch("/api/progress", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          userId: user.id,
                          lessonId: id,
                          completed: "true",
                        }),
                      }).catch(() => {});
                    }
                  }}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>

        {(() => {
          const relatedLectures = getLecturesForLesson(id || "");
          if (relatedLectures.length === 0) return null;
          return (
            <div className="mt-8">
              <Card className="border border-primary/20 bg-primary/5">
                <div className="p-4 flex items-center gap-2 border-b border-primary/10">
                  <PlayCircle className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-gray-900">{t("pages.lessonDetail.relatedMicrolectures")}</span>
                </div>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {relatedLectures.map((lecture) => (
                      <LocaleLink key={lecture.slug} href={`/lectures/${lecture.slug}`}>
                        <div
                          className="flex items-center gap-3 p-3 rounded-lg bg-white border border-primary/15 hover:border-primary/30 cursor-pointer transition-all group"
                          data-testid={`related-lecture-${lecture.slug}`}
                        >
                          <PlayCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <span className="text-sm font-medium text-gray-900 block truncate">{lecture.title}</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />{lecture.duration}
                            </span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform flex-shrink-0" />
                        </div>
                      </LocaleLink>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })()}

        <LessonQuizEmbed lessonSlug={id || ""} />

        {(() => {
          const conditionSlugs = getConditionSlugsForLesson(id || "");
          if (conditionSlugs.length === 0) return null;
          const conditions = conditionSlugs.map(s => getConditionBySlug(s)).filter(Boolean);
          if (conditions.length === 0) return null;
          return (
            <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 shadow-sm" data-testid="section-condition-links">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{t("pages.lessonDetail.relatedConditionGuides")}</h3>
              <p className="text-sm text-gray-500 mb-4">{t("pages.lessonDetail.deepdiveConditionPagesWithCrossprofession")}</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {conditions.map((cond, i) => cond && (
                  <LocaleLink
                    key={cond.slug}
                    href={`/conditions/${cond.slug}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-indigo-100 hover:border-primary/30 hover:shadow-sm transition-all group"
                    data-testid={`link-condition-${cond.slug}`}
                  >
                    <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="w-4 h-4 text-indigo-500" />
                    </span>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-primary block truncate">{cond.name}</span>
                      <span className="text-xs text-gray-400">{cond.bodySystem}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary ml-auto flex-shrink-0" />
                  </LocaleLink>
                ))}
              </div>
            </div>
          );
        })()}

        {(() => {
          const contextualLinks = getInternalLinksForLesson(id || "");
          const crossLinks = getCrossPlatformLinksForLesson(id || "");
          const hasLinks = contextualLinks.length > 0 || crossLinks.length > 0;
          return hasLinks ? (
            <div className="mt-10 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm" data-testid="section-internal-links">
              {contextualLinks.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("pages.lessonDetail.relatedTopics")}</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {contextualLinks.slice(0, 6).map((link, i) => (
                      <LocaleLink
                        key={i}
                        href={link.target}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                        data-testid={`link-internal-${i}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-primary capitalize">{link.anchor}</span>
                      </LocaleLink>
                    ))}
                  </div>
                </>
              )}
              {crossLinks.length > 0 && (
                <div className={contextualLinks.length > 0 ? "mt-6 pt-6 border-t border-gray-100" : ""}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("pages.lessonDetail.relatedResources")}</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {crossLinks.map((link, i) => (
                      <LocaleLink
                        key={i}
                        href={link.target}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all group ${
                          link.platform === "new-grad"
                            ? "bg-blue-50/50 border-blue-100 hover:border-blue-300 hover:bg-blue-50"
                            : "bg-teal-50/50 border-teal-100 hover:border-teal-300 hover:bg-teal-50"
                        }`}
                        data-testid={`link-cross-platform-${i}`}
                      >
                        {link.platform === "new-grad" ? (
                          <GraduationCap className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        ) : (
                          <BookOpen className="w-4 h-4 text-teal-500 flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <span className={`text-sm font-medium block truncate ${
                            link.platform === "new-grad" ? "text-gray-700 group-hover:text-blue-700" : "text-gray-700 group-hover:text-teal-700"
                          }`}>{link.anchor}</span>
                          <span className="text-xs text-gray-400">{link.platform === "new-grad" ? "New Grad Hub" : "Allied Health"}</span>
                        </div>
                      </LocaleLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null;
        })()}

        <AutoRelatedContent
          slug={id || ""}
          contentType="lesson"
          title={lessonContent?.title || id || ""}
          bodySystem={getLessonBodySystem(id || "")}
          category={dbContent?.category || lessonContent?.category || undefined}
          tags={dbContent?.tags as string[] || undefined}
          className="mt-10 pt-8 border-t border-gray-200"
          sectionTitle="Related Lessons, Articles & Practice"
        />

        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          <MedicalReviewBadge lastUpdated={dbContent?.updated_at || undefined} />
          <MedicalReferences lessonId={id || ""} />
        </div>

        <MedicalReviewJsonLd
          title={lessonContent?.title || id || ""}
          slug={id || ""}
          lastUpdated={dbContent?.updated_at || undefined}
          description={lessonContent?.overview || undefined}
        />

        <div className="mt-10" data-testid="lesson-conversion-funnel">
          <ConversionFunnel
            topic={lessonContent?.title || id || ""}
            bodySystem={getLessonBodySystem(id || "")}
            showPracticeQuestions={true}
            showFlashcards={true}
            showProgressPrompt={!user}
            showMockExam={true}
            showPremiumSummary={!user || effectiveTier === "free"}
            showSocialProof={true}
            showTopCta={false}
            showMidCta={!user || effectiveTier === "free"}
            showBottomCta={false}
          />
        </div>

        <div className="mt-8 p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-blue-50 border border-primary/10" data-testid="section-next-action">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{t("pages.lessonDetail.whatsNext")}</h3>
          <p className="text-sm text-gray-600 mb-6">{t("pages.lessonDetail.reinforceWhatYouJustLearned")}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <LocaleLink href="/free-practice" className="block" data-testid="cta-practice-questions">
              <div className="h-full p-4 rounded-xl bg-white border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <ClipboardList className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{t("pages.lessonDetail.practiceQuestions")}</h4>
                <p className="text-xs text-gray-500">{t("pages.lessonDetail.testYourKnowledgeWithExamstyle")}</p>
              </div>
            </LocaleLink>
            <LocaleLink href="/flashcards" className="block" data-testid="cta-flashcards">
              <div className="h-full p-4 rounded-xl bg-white border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-emerald-100 transition-colors">
                  <StickyNote className="w-5 h-5 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{t("pages.lessonDetail.reviewFlashcards")}</h4>
                <p className="text-xs text-gray-500">{t("pages.lessonDetail.buildADeckForThis")}</p>
              </div>
            </LocaleLink>
            <LocaleLink href="/mock-exams" className="block" data-testid="cta-mock-exam">
              <div className="h-full p-4 rounded-xl bg-white border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer">
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-amber-100 transition-colors">
                  <Trophy className="w-5 h-5 text-amber-600" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{t("pages.lessonDetail.takeAMockExam")}</h4>
                <p className="text-xs text-gray-500">{t("pages.lessonDetail.simulateExamConditions")}</p>
              </div>
            </LocaleLink>
            {!user ? (
              <LocaleLink href="/start-free" className="block" data-testid="cta-create-account">
                <div className="h-full p-4 rounded-xl bg-primary/5 border border-primary/20 hover:border-primary/40 hover:shadow-md transition-all group cursor-pointer">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <Crown className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-primary text-sm mb-1">{t("pages.lessonDetail.startFree")}</h4>
                  <p className="text-xs text-gray-500">{t("pages.lessonDetail.saveProgressTrackMastery")}</p>
                </div>
              </LocaleLink>
            ) : (
              <LocaleLink href="/dashboard" className="block" data-testid="cta-dashboard">
                <div className="h-full p-4 rounded-xl bg-white border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{t("pages.lessonDetail.viewDashboard")}</h4>
                  <p className="text-xs text-gray-500">{t("pages.lessonDetail.trackYourStudyProgress")}</p>
                </div>
              </LocaleLink>
            )}
          </div>
        </div>

        {!isAdmin && (!user || effectiveTier === "free") && (
          <div className="mt-10 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20 p-8 text-center space-y-4" data-testid="lesson-conversion-cta">
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-gray-900">{t("lesson.conversionCta.title")}</h3>
            </div>
            <p className="text-gray-600 max-w-lg mx-auto">{t("lesson.conversionCta.subtitle")}</p>
            <p className="text-sm text-primary font-medium italic">{t("lesson.conversionCta.socialProof")}</p>
            <LocaleLink href="/pricing">
              <Button className="mt-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 text-base font-semibold gap-2" data-testid="button-lesson-upgrade-cta">
                <Crown className="w-5 h-5" />
                {t("lesson.conversionCta.button")}
              </Button>
            </LocaleLink>
          </div>
        )}

      </main>

      <style>{`
        @media print {
          .select-none { user-select: text !important; -webkit-user-select: text !important; }
        }
      `}</style>
      {isAdmin && language !== "en" && baseLesson && lessonContent && (
        <div className="fixed bottom-20 right-4 z-40" data-testid="admin-translate-panel">
          {Object.keys(lessonTranslations).length > 0 ? (
            <div className="bg-green-100 text-green-800 text-xs px-3 py-2 rounded-lg shadow-lg border border-green-200 mb-2 max-w-[200px]">
              Translated ({language.toUpperCase()})
            </div>
          ) : null}
          <Button
            data-testid="button-generate-translation"
            size="sm"
            disabled={translating}
            className="shadow-lg gap-2"
            onClick={async () => {
              if (!id || !lessonContent) return;
              setTranslating(true);
              try {
                const creds = getCredentials();
                const fields: Record<string, any> = {
                  title: lessonContent.title,
                  overview: lessonContent.overview || "",
                  pathophysiology: lessonContent.pathophysiology || "",
                  lifespan: lessonContent.lifespan || "",
                };
                if (lessonContent.objectives?.length) fields.objectives = JSON.stringify(lessonContent.objectives);
                if (lessonContent.clinicalPearls?.length) fields.clinicalPearls = JSON.stringify(lessonContent.clinicalPearls);
                if (lessonContent.riskFactors?.length) fields.riskFactors = JSON.stringify(lessonContent.riskFactors);
                if (lessonContent.diagnostics?.length) fields.diagnostics = JSON.stringify(lessonContent.diagnostics);
                if (lessonContent.management?.length) fields.management = JSON.stringify(lessonContent.management);
                if (lessonContent.nursingActions?.length) fields.nursingActions = JSON.stringify(lessonContent.nursingActions);

                const res = await fetch(`/api/lesson-translations/${encodeURIComponent(id)}/generate`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    lang: language,
                    fields,
                    ...(creds ? { username: creds.username, password: creds.password } : {}),
                  }),
                });
                if (res.ok) {
                  const data = await res.json();
                  if (data.translations) {
                    setLessonTranslations(data.translations);
                    toast({ title: "Translation generated", description: `Lesson translated to ${language.toUpperCase()}` });
                  }
                } else {
                  toast({ title: "Translation failed", description: "Could not generate translation", variant: "destructive" });
                }
              } catch {
                toast({ title: "Translation failed", description: "Network error", variant: "destructive" });
              }
              setTranslating(false);
            }}
          >
            {translating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {translating ? "Translating..." : `Translate to ${language.toUpperCase()}`}
          </Button>
        </div>
      )}
      <AdminEditButton />
      <FixedLessonNav lessonId={id || ""} />
      <div className="pb-14" />
      <Footer />
    </div>
  );
}
