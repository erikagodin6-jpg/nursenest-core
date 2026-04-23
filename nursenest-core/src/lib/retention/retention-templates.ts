import { appOriginForEmail } from "@/lib/email/app-origin";
import { htmlEmailShell } from "@/lib/email/resend-transactional";
import type { LearnerEngagementEmailContext } from "@/lib/retention/learner-engagement-email-context";
import { engagementFooterHtml, engagementPreambleHtml } from "@/lib/retention/learner-engagement-email-context";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function cta(href: string, label: string): string {
  const o = appOriginForEmail();
  const url = href.startsWith("http") ? href : `${o}${href.startsWith("/") ? href : `/${href}`}`;
  return `<p><a href="${esc(url)}" style="display:inline-block;padding:10px 18px;background:#1d4ed8;color:#fff;text-decoration:none;border-radius:999px;font-weight:600;">${esc(label)}</a></p>`;
}

function wrapEngagementBody(ctx: LearnerEngagementEmailContext, innerHtml: string): string {
  return `${engagementPreambleHtml(ctx)}${innerHtml}${engagementFooterHtml(ctx)}`;
}

export function welcomeEmailHtml(name: string, ctx: LearnerEngagementEmailContext): { subject: string; html: string; text: string } {
  const first = name.trim().split(/\s+/)[0] ?? "there";
  const subject = `Welcome to NurseNest — ${ctx.trackLabel} prep`;
  const inner = `
    <p>Your account is ready. Open the app to start lessons, the question bank, or a timed practice block aligned to your track.</p>
    ${cta("/app", "Open your dashboard")}
    <p style="font-size:14px;color:#444;">Tip: short daily blocks beat rare cram sessions.</p>
  `;
  const html = htmlEmailShell(subject, wrapEngagementBody(ctx, inner));
  const text = `Hi ${first}, your NurseNest account is ready for ${ctx.trackLabel} prep. Open ${appOriginForEmail()}/app — ${ctx.educationalDisclaimer} Manage emails: ${ctx.managePrefsUrl}`;
  return { subject, html, text };
}

export function welcomeFollowup3EmailHtml(ctx: LearnerEngagementEmailContext): { subject: string; html: string; text: string } {
  const subject = `Your first week with NurseNest (${ctx.trackLabel})`;
  const inner = `
    <p>Quick check-in: have you opened a lesson or a short question block yet?</p>
    <p>If not, start with one 10–15 minute pass today — small wins compound.</p>
    ${cta("/app/lessons", "Browse lessons")}
    ${cta("/app/questions", "Question bank")}
  `;
  const html = htmlEmailShell(subject, wrapEngagementBody(ctx, inner));
  const text = `Quick check-in for your ${ctx.trackLabel} prep on NurseNest. ${appOriginForEmail()}/app — ${ctx.educationalDisclaimer}`;
  return { subject, html, text };
}

export function welcomeFollowup7EmailHtml(ctx: LearnerEngagementEmailContext): { subject: string; html: string; text: string } {
  const subject = `Build a steady rhythm (${ctx.trackLabel})`;
  const inner = `
    <p>Consistency matters more than marathon sessions. Pick a default time slot and protect it on your calendar.</p>
    <p>Mix reading with active recall: questions, flashcards, or a short mock block.</p>
    ${cta("/app/study-plan", "Review study plan")}
    ${cta("/app/practice-tests", "Practice tests")}
  `;
  const html = htmlEmailShell(subject, wrapEngagementBody(ctx, inner));
  const text = `Build a steady study rhythm for ${ctx.trackLabel}. ${appOriginForEmail()}/app/study-plan — ${ctx.educationalDisclaimer}`;
  return { subject, html, text };
}

export function firstExamEmailHtml(
  score: number,
  total: number,
  ctx: LearnerEngagementEmailContext,
): { subject: string; html: string; text: string } {
  const subject = "First practice exam recorded";
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const inner = `
    <p>Nice work finishing a practice block.</p>
    <p>Score: ${esc(String(score))}/${esc(String(total))} (${esc(String(pct))}%).</p>
    <p>Use misses as a study map: revisit related lessons, then try another short timed set this week.</p>
    ${cta("/app/exams", "View exams")}
    ${cta("/app/questions", "Practice questions")}
  `;
  const html = htmlEmailShell(subject, wrapEngagementBody(ctx, inner));
  const text = `First practice block recorded: ${score}/${total} (${pct}%). ${appOriginForEmail()}/app/questions — ${ctx.educationalDisclaimer}`;
  return { subject, html, text };
}

export function weakAreaEmailHtml(hint: string, ctx: LearnerEngagementEmailContext): { subject: string; html: string; text: string } {
  const subject = "Quick practice: tighten accuracy";
  const inner = `
    <p>Your recent practice suggests a few topics deserve another pass.</p>
    <p><strong>${esc(hint)}</strong></p>
    <p>Try a short drill set today, then revisit the related lesson outline if it still feels fuzzy.</p>
    ${cta("/app/questions", "Open question bank")}
    ${cta("/app/lessons", "Browse lessons")}
  `;
  const html = htmlEmailShell(subject, wrapEngagementBody(ctx, inner));
  const text = `Practice tip for ${ctx.trackLabel}: ${hint}. ${appOriginForEmail()}/app/questions — ${ctx.educationalDisclaimer}`;
  return { subject, html, text };
}

export function weakAreaStudyNudgeEmailHtml(topicLabel: string, ctx: LearnerEngagementEmailContext): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `Focused review: ${topicLabel.slice(0, 48)}${topicLabel.length > 48 ? "…" : ""}`;
  const inner = `
    <p>Your recent results cluster around <strong>${esc(topicLabel)}</strong>.</p>
    <p>A short targeted session now can prevent that gap from widening before test day.</p>
    ${cta("/app/flashcards/weak-areas", "Weak-area flashcards")}
    ${cta("/app/questions", "Practice questions")}
  `;
  const html = htmlEmailShell(subject, wrapEngagementBody(ctx, inner));
  const text = `Focused review suggestion for ${ctx.trackLabel}: ${topicLabel}. ${appOriginForEmail()}/app/questions — ${ctx.educationalDisclaimer}`;
  return { subject, html, text };
}

export function inactiveNudgeEmailHtml(ctx: LearnerEngagementEmailContext): { subject: string; html: string; text: string } {
  const subject = "Two minutes to stay on track";
  const inner = `
    <p>We have not seen you in the app for several days.</p>
    <p>Open NurseNest and pick up where you left off, or start a short question block to protect momentum.</p>
    ${cta("/app", "Continue studying")}
    ${cta("/app/questions", "Question bank")}
  `;
  const html = htmlEmailShell(subject, wrapEngagementBody(ctx, inner));
  const text = `Pick up your NurseNest study streak (${ctx.trackLabel}): ${appOriginForEmail()}/app — ${ctx.educationalDisclaimer}`;
  return { subject, html, text };
}

export function progressDigestEmailHtml(
  attempts: number,
  lastPct: number | null,
  ctx: LearnerEngagementEmailContext,
): { subject: string; html: string; text: string } {
  const subject = "Your progress snapshot";
  const pctLine =
    lastPct !== null ? `Latest practice score about ${esc(String(lastPct))}%.` : "Log another timed block to track your trend.";
  const inner = `
    <p>Here is a quick snapshot.</p>
    <p>Timed practice blocks completed so far: ${esc(String(attempts))}. ${pctLine}</p>
    <p>Keep mixing lessons with active recall.</p>
    ${cta("/app", "Open dashboard")}
    ${cta("/app/exams", "Practice hub")}
  `;
  const html = htmlEmailShell(subject, wrapEngagementBody(ctx, inner));
  const text = `Progress (${ctx.trackLabel}): ${attempts} block(s). ${lastPct !== null ? `Latest about ${lastPct}%.` : ""} ${appOriginForEmail()}/app`;
  return { subject, html, text };
}

export function studyPlanReminderEmailHtml(ctx: LearnerEngagementEmailContext): { subject: string; html: string; text: string } {
  const subject = "Your study plan is waiting";
  const inner = `
    <p>You saved study goals in NurseNest.</p>
    <p>Open your study plan and check off the next small step — even 10 minutes counts.</p>
    ${cta("/app/study-plan", "Open study plan")}
    ${cta("/app/questions", "Practice questions")}
  `;
  const html = htmlEmailShell(subject, wrapEngagementBody(ctx, inner));
  const text = `Review your study plan (${ctx.trackLabel}): ${appOriginForEmail()}/app/study-plan`;
  return { subject, html, text };
}

export function milestoneLessonsEmailHtml(completed: number, ctx: LearnerEngagementEmailContext): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `Milestone: ${completed} lessons checked off`;
  const inner = `
    <p>You have completed <strong>${esc(String(completed))}</strong> lessons — that is meaningful progress.</p>
    <p>Reinforce with questions or a short mock block so the material sticks under exam-style pressure.</p>
    ${cta("/app/lessons", "Continue lessons")}
    ${cta("/app/questions", "Question bank")}
  `;
  const html = htmlEmailShell(subject, wrapEngagementBody(ctx, inner));
  const text = `Milestone: ${completed} lessons completed on NurseNest (${ctx.trackLabel}). ${ctx.educationalDisclaimer}`;
  return { subject, html, text };
}

export function newContentRoundupEmailHtml(ctx: LearnerEngagementEmailContext): { subject: string; html: string; text: string } {
  const subject = `What is new for ${ctx.trackLabel} learners`;
  const inner = `
    <p>We regularly expand lessons, question banks, and pathway-aligned drills.</p>
    <p>Open your lesson hub or practice area to see fresh material matched to your tier and pathway.</p>
    ${cta("/app/lessons", "Lesson hub")}
    ${cta("/app/practice-tests", "Practice tests")}
  `;
  const html = htmlEmailShell(subject, wrapEngagementBody(ctx, inner));
  const text = `See new ${ctx.trackLabel} prep content on NurseNest: ${appOriginForEmail()}/app/lessons — ${ctx.educationalDisclaimer}`;
  return { subject, html, text };
}
