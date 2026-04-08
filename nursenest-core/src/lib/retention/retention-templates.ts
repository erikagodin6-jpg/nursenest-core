import { appOriginForEmail } from "@/lib/email/app-origin";
import { htmlEmailShell } from "@/lib/email/resend-transactional";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function cta(href: string, label: string): string {
  const o = appOriginForEmail();
  const url = href.startsWith("http") ? href : `${o}${href.startsWith("/") ? href : `/${href}`}`;
  return `<p><a href="${esc(url)}" style="display:inline-block;padding:10px 18px;background:#1d4ed8;color:#fff;text-decoration:none;border-radius:999px;font-weight:600;">${esc(label)}</a></p>`;
}

export function welcomeEmailHtml(name: string): { subject: string; html: string; text: string } {
  const first = name.trim().split(/\s+/)[0] ?? "there";
  const subject = "Welcome to NurseNest";
  const body = `
    <p>Hi ${esc(first)},</p>
    <p>Your account is ready. Open the app to start lessons, the question bank, or a timed mock exam.</p>
    ${cta("/app", "Open your dashboard")}
    <p style="font-size:14px;color:#444;">Tip: short daily blocks beat rare cram sessions.</p>
  `;
  const html = htmlEmailShell(subject, body);
  const text = `Hi ${first}, your NurseNest account is ready. Open ${appOriginForEmail()}/app to start studying.`;
  return { subject, html, text };
}

export function firstExamEmailHtml(score: number, total: number): { subject: string; html: string; text: string } {
  const subject = "First mock exam recorded";
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const body = `
    <p>Nice work finishing a practice exam.</p>
    <p>Score: ${esc(String(score))}/${esc(String(total))} (${esc(String(pct))}%).</p>
    <p>Review misses in the question bank, then try another timed block this week.</p>
    ${cta("/app/exams", "View exams")}
    ${cta("/app/questions", "Practice questions")}
  `;
  const html = htmlEmailShell(subject, body);
  const text = `First mock recorded: ${score}/${total} (${pct}%). Visit ${appOriginForEmail()}/app/questions to drill more.`;
  return { subject, html, text };
}

export function weakAreaEmailHtml(hint: string): { subject: string; html: string; text: string } {
  const subject = "Quick practice: tighten your weak spots";
  const body = `
    <p>Your last mock had room to lift accuracy.</p>
    <p><strong>${esc(hint)}</strong></p>
    <p>Try five more questions in that area today.</p>
    ${cta("/app/questions", "Open question bank")}
    ${cta("/lessons", "Review exam lessons")}
  `;
  const html = htmlEmailShell(subject, body);
  const text = `Practice tip: ${hint}. Try 5 more questions at ${appOriginForEmail()}/app/questions`;
  return { subject, html, text };
}

export function inactiveNudgeEmailHtml(): { subject: string; html: string; text: string } {
  const subject = "Two minutes to stay on track";
  const body = `
    <p>We have not seen study activity in a couple of days.</p>
    <p>Open the app and pick up where you left off, or start a short question block.</p>
    ${cta("/app", "Continue studying")}
    ${cta("/app/questions", "Question bank")}
  `;
  const html = htmlEmailShell(subject, body);
  const text = `Pick up your NurseNest study streak: ${appOriginForEmail()}/app`;
  return { subject, html, text };
}

export function progressDigestEmailHtml(attempts: number, lastPct: number | null): { subject: string; html: string; text: string } {
  const subject = "Your progress snapshot";
  const pctLine =
    lastPct !== null ? `Latest mock score about ${esc(String(lastPct))}%.` : "Log a mock exam to track your trend.";
  const body = `
    <p>Here is a quick snapshot.</p>
    <p>Mocks completed so far: ${esc(String(attempts))}. ${pctLine}</p>
    <p>Keep mixing lessons and timed practice.</p>
    ${cta("/app", "Open dashboard")}
    ${cta("/app/exams", "Mock exams")}
  `;
  const html = htmlEmailShell(subject, body);
  const text = `Progress: ${attempts} mock(s). ${lastPct !== null ? `Latest about ${lastPct}%.` : ""} ${appOriginForEmail()}/app`;
  return { subject, html, text };
}

export function studyPlanReminderEmailHtml(): { subject: string; html: string; text: string } {
  const subject = "Your study plan is waiting";
  const body = `
    <p>You set study goals in NurseNest.</p>
    <p>Open your study plan and check off the next small step.</p>
    ${cta("/app/study-plan", "Open study plan")}
    ${cta("/app/questions", "Practice questions")}
  `;
  const html = htmlEmailShell(subject, body);
  const text = `Review your study plan: ${appOriginForEmail()}/app/study-plan`;
  return { subject, html, text };
}
