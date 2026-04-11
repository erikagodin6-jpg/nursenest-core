"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import { hrefForLearnerNote, labelForLearnerNoteScope } from "@/lib/learner/learner-note-href";
import type { LearnerNoteScope } from "@prisma/client";
import type { NoteRow, NotesPagePayload } from "@/lib/learner/notes-index-types";

// ── Auth guard ────────────────────────────────────────────────────────────────

async function requireUserId(): Promise<string | null> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return null;
  const entitlement = await resolveEntitlement(userId);
  if (!entitlement.hasAccess) return null;
  return userId;
}

// ── Row mapper ────────────────────────────────────────────────────────────────

function toNoteRow(r: {
  id: string;
  scope: LearnerNoteScope;
  contextId: string;
  title: string | null;
  body: string;
  topic: string | null;
  updatedAt: Date;
}): NoteRow {
  return {
    id: r.id,
    scope: r.scope,
    contextId: r.contextId,
    title: r.title,
    bodySnippet: r.body.slice(0, 220),
    topic: r.topic,
    updatedAt: r.updatedAt.toISOString(),
    href: hrefForLearnerNote(r.scope, r.contextId),
    scopeLabel: labelForLearnerNoteScope(r.scope),
    isBookmark: r.contextId.startsWith("bk:"),
    isSavedRationale: r.contextId.startsWith("rationale:"),
  };
}

// ── Initial page load (called server-side from RSC page) ──────────────────────

export async function loadNotesPagePayload(userId: string): Promise<NotesPagePayload> {
  if (!isDatabaseUrlConfigured()) {
    return { notes: [], hasMore: false, cursor: null, total: 0, bookmarkCount: 0, rationaleCount: 0 };
  }

  const PAGE_SIZE = 10;

  const [rows, total, bookmarkCount, rationaleCount] = await Promise.all([
    prisma.learnerNote.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: PAGE_SIZE + 1,
      select: { id: true, scope: true, contextId: true, title: true, body: true, topic: true, updatedAt: true },
    }),
    prisma.learnerNote.count({ where: { userId } }),
    prisma.learnerNote.count({ where: { userId, contextId: { startsWith: "bk:" } } }),
    prisma.learnerNote.count({ where: { userId, contextId: { startsWith: "rationale:" } } }),
  ]);

  const hasMore = rows.length > PAGE_SIZE;
  const page = hasMore ? rows.slice(0, PAGE_SIZE) : rows;

  return {
    notes: page.map(toNoteRow),
    hasMore,
    cursor: hasMore ? (page[page.length - 1]?.id ?? null) : null,
    total,
    bookmarkCount,
    rationaleCount,
  };
}

// ── Paginated "Load more" Server Action ────────────────────────────────────────

export async function loadMoreNotes(
  cursor: string,
  filter: "all" | "bookmarks" | "rationales" | "lessons" | "questions" = "all",
): Promise<{ notes: NoteRow[]; hasMore: boolean; cursor: string | null }> {
  const userId = await requireUserId();
  if (!userId || !isDatabaseUrlConfigured()) {
    return { notes: [], hasMore: false, cursor: null };
  }

  const PAGE_SIZE = 10;

  const contextIdFilter: { startsWith?: string } | undefined =
    filter === "bookmarks"
      ? { startsWith: "bk:" }
      : filter === "rationales"
        ? { startsWith: "rationale:" }
        : undefined;

  const scopeFilter: LearnerNoteScope | undefined =
    filter === "lessons"
      ? ("PATHWAY_LESSON" as LearnerNoteScope)
      : filter === "questions"
        ? ("QUESTION_BANK" as LearnerNoteScope)
        : undefined;

  try {
    const rows = await prisma.learnerNote.findMany({
      where: {
        userId,
        ...(scopeFilter ? { scope: scopeFilter } : {}),
        ...(contextIdFilter ? { contextId: contextIdFilter } : {}),
      },
      orderBy: { updatedAt: "desc" },
      take: PAGE_SIZE + 1,
      cursor: { id: cursor },
      skip: 1,
      select: { id: true, scope: true, contextId: true, title: true, body: true, topic: true, updatedAt: true },
    });

    const hasMore = rows.length > PAGE_SIZE;
    const page = hasMore ? rows.slice(0, PAGE_SIZE) : rows;

    return {
      notes: page.map(toNoteRow),
      hasMore,
      cursor: hasMore ? (page[page.length - 1]?.id ?? null) : null,
    };
  } catch {
    return { notes: [], hasMore: false, cursor: null };
  }
}

// ── Filtered notes for bookmarks / rationales tabs ────────────────────────────

export async function loadFilteredNotes(
  userId: string,
  filter: "bookmarks" | "rationales",
): Promise<{ notes: NoteRow[]; hasMore: boolean; cursor: string | null }> {
  if (!isDatabaseUrlConfigured()) return { notes: [], hasMore: false, cursor: null };

  const PAGE_SIZE = 10;
  const prefix = filter === "bookmarks" ? "bk:" : "rationale:";

  try {
    const rows = await prisma.learnerNote.findMany({
      where: { userId, contextId: { startsWith: prefix } },
      orderBy: { updatedAt: "desc" },
      take: PAGE_SIZE + 1,
      select: { id: true, scope: true, contextId: true, title: true, body: true, topic: true, updatedAt: true },
    });

    const hasMore = rows.length > PAGE_SIZE;
    const page = hasMore ? rows.slice(0, PAGE_SIZE) : rows;

    return {
      notes: page.map(toNoteRow),
      hasMore,
      cursor: hasMore ? (page[page.length - 1]?.id ?? null) : null,
    };
  } catch {
    return { notes: [], hasMore: false, cursor: null };
  }
}
