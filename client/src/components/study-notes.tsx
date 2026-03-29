import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StickyNote, Save, X } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface StudyNotesProps {
  noteId: string;
  title: string;
}

export function StudyNotes({ noteId, title }: StudyNotesProps) {
  const { t } = useI18n();
  const { user } = useAuth();
  const [showNotes, setShowNotes] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [noteSaving, setNoteSaving] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (user && noteId) {
      fetch(`/api/notes/${user.id}/${noteId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data?.content) setNoteContent(data.content);
        })
        .catch(() => {});
    }
  }, [user, noteId]);

  const saveNote = useCallback(() => {
    if (!user || !noteId) return;
    setNoteSaving(true);
    fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, lessonId: noteId, content: noteContent }),
    })
      .then(() => setNoteSaving(false))
      .catch(() => setNoteSaving(false));
  }, [user, noteId, noteContent]);

  const handleNoteChange = (value: string) => {
    setNoteContent(value);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      if (user && noteId) {
        fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, lessonId: noteId, content: value }),
        });
      }
    }, 2000);
  };

  if (!user) return null;

  return (
    <>
      <Button
        variant={showNotes ? "default" : "outline"}
        onClick={() => setShowNotes(!showNotes)}
        className="gap-2"
        data-testid={`button-toggle-notes-${noteId}`}
      >
        <StickyNote className="w-4 h-4" />
        {showNotes ? "Hide Notes" : "My Notes"}
      </Button>

      {showNotes && (
        <div className="fixed bottom-4 right-4 z-40 w-80 sm:w-96 max-h-[70vh] shadow-2xl rounded-2xl border border-yellow-200 bg-yellow-50/95 backdrop-blur-lg overflow-hidden flex flex-col" data-testid={`panel-notes-${noteId}`}>
          <div className="flex items-center justify-between p-4 pb-2 border-b border-yellow-200/60">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
              <StickyNote className="w-4 h-4 text-yellow-600" /> Study Notes
            </h3>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-medium ${noteSaving ? "text-amber-500" : "text-emerald-500"}`}>
                {noteSaving ? "Saving..." : "Saved"}
              </span>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={saveNote} data-testid={`button-save-note-${noteId}`}>
                <Save className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setShowNotes(false)} data-testid={`button-close-notes-${noteId}`}>
                <X className="w-3.5 h-3.5 text-gray-400" />
              </Button>
            </div>
          </div>
          <div className="px-3 py-2 border-b border-yellow-100 bg-yellow-50/50">
            <p className="text-[10px] text-yellow-700 font-medium">{title}</p>
          </div>
          <div className="p-3 flex-1 overflow-y-auto">
            <Textarea
              value={noteContent}
              onChange={(e) => handleNoteChange(e.target.value)}
              placeholder={"Write your study notes here...\n\nTips:\n- Key concepts to remember\n- Questions for further review\n- Connections between topics"}
              className="min-h-[220px] bg-white border-yellow-200 focus:border-yellow-400 text-sm resize-y leading-relaxed"
              data-testid={`textarea-notes-${noteId}`}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-[10px] text-gray-400">{t("components.studyNotes.autosavesAsYouType")}</p>
              <p className="text-[10px] text-gray-400">{noteContent.length > 0 ? `${noteContent.length} chars` : ""}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
