"use server";

import type { LearnerNoteScope } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { hrefForLearnerNote, labelForLearnerNoteScope } from "@/lib/learner/learner-note-href";
import {
  NOTEBOOK_CATEGORIES,
  decodeNotebookBody,
  notebookCategoryLabel,
  notebookSourceLabel,
} from "@/lib/learner/personal-study-notebook";
import type { NoteRow } from "@/lib/learner/notes-index-types";

export type PersonalStudyNotebookPayload = {
  notes: NoteRow[];
  total: number;
  favoriteCount: number;
  recentCount: number;
  categoryCounts: Record<string, number>;
  systems: string[];
  topics: string[];
  tags: string[];
};

type NotebookRecord = {
  id: string;
  scope: LearnerNoteScope;
  contextId: string;
  title: string | null;
  body: string;
  topic: string | null;
  updatedAt: Date;
};

function toNotebookRow(r: NotebookRecord): NoteRow {
  const decoded = decodeNotebookBody(r.body, { contextId: r.contextId, scope: r.scope, topic: r.topic });
  const content = decoded.content.replace(/\s+/g, " ").trim();
  return {
    id: r.id,
    scope: r.scope,
    contextId: r.contextId,
    title: r.title ?? decoded.sourceTitle,
    bodySnippet: content.slice(0, 320),
    topic: decoded.topic ?? r.topic,
    updatedAt: r.updatedAt.toISOString(),
    href: hrefForLearnerNote(r.scope, r.contextId, r.body),
    scopeLabel: labelForLearnerNoteScope(r.scope),
    isBookmark: r.contextId.startsWith("bk:"),
    isSavedRationale: r.contextId.startsWith("rationale:"),
    isSectionNote: r.contextId.startsWith("sn:"),
    notebookCategory: decoded.category,
    notebookCategoryLabel: notebookCategoryLabel(decoded.category),
    notebookSourceType: decoded.sourceType,
    notebookSourceLabel: notebookSourceLabel(decoded.sourceType),
    notebookSystem: decoded.system,
    notebookTags: decoded.tags,
    isNotebookEntry: decoded.isNotebookEntry || r.contextId.startsWith("rationale:") || r.contextId.startsWith("sn:"),
    isFavorite: decoded.favorite,
  };
}

export async function loadPersonalStudyNotebook(userId: string): Promise<PersonalStudyNotebookPayload> {
  if (!userId || !isDatabaseUrlConfigured()) {
    return emptyNotebookPayload();
  }

  const rows = await prisma.learnerNote.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 500,
    select: { id: true, scope: true, contextId: true, title: true, body: true, topic: true, updatedAt: true },
  });

  const notes = rows.map(toNotebookRow);
  const categoryCounts = Object.fromEntries(NOTEBOOK_CATEGORIES.map((category) => [category, 0])) as Record<string, number>;
  const systems = new Set<string>();
  const topics = new Set<string>();
  const tags = new Set<string>();
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  for (const note of notes) {
    const category = note.notebookCategory ?? "notes";
    categoryCounts[category] = (categoryCounts[category] ?? 0) + 1;
    if (note.notebookSystem) systems.add(note.notebookSystem);
    if (note.topic) topics.add(note.topic);
    for (const tag of note.notebookTags ?? []) tags.add(tag);
  }

  return {
    notes,
    total: notes.length,
    favoriteCount: notes.filter((note) => note.isFavorite).length,
    recentCount: notes.filter((note) => new Date(note.updatedAt).getTime() >= sevenDaysAgo).length,
    categoryCounts,
    systems: [...systems].sort((a, b) => a.localeCompare(b)),
    topics: [...topics].sort((a, b) => a.localeCompare(b)),
    tags: [...tags].sort((a, b) => a.localeCompare(b)),
  };
}

function emptyNotebookPayload(): PersonalStudyNotebookPayload {
  return {
    notes: [],
    total: 0,
    favoriteCount: 0,
    recentCount: 0,
    categoryCounts: Object.fromEntries(NOTEBOOK_CATEGORIES.map((category) => [category, 0])),
    systems: [],
    topics: [],
    tags: [],
  };
}
