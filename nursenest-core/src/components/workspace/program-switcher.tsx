"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IconChevronDown, IconCheck } from "./workspace-icons";

export type ProgramOption = {
  id: string;
  label: string;
  /** Short label for collapsed display, e.g. "RN", "FNP" */
  shortLabel: string;
};

type ProgramSwitcherProps = {
  currentPathwayId: string | null;
  programs: ProgramOption[];
  collapsed: boolean;
};

const LS_KEY = "nn_workspace_program";

function saveProgram(id: string): void {
  try { localStorage.setItem(LS_KEY, id); } catch { /* quota or private mode */ }
}

export function ProgramSwitcher({ currentPathwayId, programs, collapsed }: ProgramSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const current = programs.find((p) => p.id === currentPathwayId) ?? programs[0] ?? null;

  const handleSelect = useCallback(
    (program: ProgramOption) => {
      setOpen(false);
      saveProgram(program.id);
      // Navigate to command center with new pathway — server will pick it up from DB after update.
      router.push(`/app/command-center?pathwayId=${encodeURIComponent(program.id)}`);
    },
    [router],
  );

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  if (!current) return null;

  return (
    <div className="nn-workspace-program" ref={ref}>
      <button
        type="button"
        className="nn-workspace-program__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={collapsed ? `Program: ${current.shortLabel}` : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="nn-workspace-program__label">
          {collapsed ? current.shortLabel : current.label}
        </span>
        <span className="nn-workspace-program__caret" aria-hidden="true">
          <IconChevronDown />
        </span>
      </button>

      {open && (
        <div
          className="nn-workspace-program__dropdown"
          role="listbox"
          aria-label="Select program"
        >
          {programs.map((p) => (
            <button
              key={p.id}
              type="button"
              role="option"
              aria-selected={p.id === current.id}
              className="nn-workspace-program__option"
              onClick={() => handleSelect(p)}
            >
              <span style={{ flex: 1 }}>{p.label}</span>
              {p.id === current.id && (
                <span className="nn-workspace-program__check" aria-hidden="true">
                  <IconCheck />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
