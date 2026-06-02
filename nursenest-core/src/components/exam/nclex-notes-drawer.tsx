"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function NclexNotesDrawer({
  initialText = "",
  onSave,
  onClose,
}: {
  initialText?: string;
  onSave: (text: string) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState(initialText);

  return (
    <div className="nn-nclex-notes-drawer" role="dialog" aria-modal="true" aria-label="Exam notes">
      <div className="nn-nclex-notes-drawer__backdrop" onClick={onClose} aria-hidden="true" />
      <div className="nn-nclex-notes-drawer__panel">
        <div className="nn-nclex-notes-drawer__header">
          <span className="nn-nclex-notes-drawer__title">Notes</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notes"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "1.75rem",
              height: "1.75rem",
              borderRadius: "0.375rem",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#94a3b8",
            }}
          >
            <X size={15} />
          </button>
        </div>
        <div className="nn-nclex-notes-drawer__body">
          <textarea
            className="nn-nclex-notes-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your notes for this question…"
            aria-label="Question notes"
          />
          <button
            type="button"
            className="nn-nclex-notes-save-btn"
            onClick={() => onSave(text)}
          >
            Save &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
}
