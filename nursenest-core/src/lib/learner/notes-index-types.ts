/**
 * Shared types for the Notes Index page and related components.
 */

export type NoteRow = {
  id: string;
  scope: string;
  contextId: string;
  title: string | null;
  /** Body trimmed to ~220 chars for display. */
  bodySnippet: string;
  topic: string | null;
  updatedAt: string;
  href: string;
  scopeLabel: string;
  /** true when contextId starts with "bk:" */
  isBookmark: boolean;
  /** true when contextId starts with "rationale:" */
  isSavedRationale: boolean;
  /** true when contextId starts with "sn:" (per-section inline note) */
  isSectionNote: boolean;
};

export type NotesPagePayload = {
  notes: NoteRow[];
  hasMore: boolean;
  /** Cursor (note id) for next page, or null if no more. */
  cursor: string | null;
  /** Summary counts. */
  total: number;
  bookmarkCount: number;
  rationaleCount: number;
  sectionNoteCount: number;
};
