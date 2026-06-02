"use client";

import { usePathname } from "next/navigation";
import {
  IconMenu, IconSearch, IconBell, IconMoon, IconSun, IconUser,
} from "./workspace-icons";

/** Map route prefixes to human-readable section names */
const BREADCRUMB_MAP: Array<[string, string]> = [
  ["/app/command-center", "Dashboard"],
  ["/app/lessons", "Lessons"],
  ["/app/ecg", "ECG Interpretation"],
  ["/app/labs", "Lab Interpretation"],
  ["/app/clinical-skills", "Clinical Skills"],
  ["/app/flashcards", "Flashcards"],
  ["/app/question-bank", "Question Bank"],
  ["/app/practice-tests", "Practice Tests"],
  ["/app/cat", "CAT Exams"],
  ["/app/readiness", "Readiness Assessment"],
  ["/app/study-plan", "Study Plan"],
  ["/app/coach", "Study Coach"],
  ["/app/account/report-card", "Report Cards"],
  ["/app/account/analytics", "Analytics"],
  ["/app/account/notes", "Notes"],
  ["/app/account/settings", "Settings"],
  ["/app/account", "Account"],
  ["/blog", "Blog"],
  ["/app", "Dashboard"],
];

function useBreadcrumb(): string {
  const pathname = usePathname();
  const path = pathname.split("?")[0] ?? "";
  for (const [prefix, label] of BREADCRUMB_MAP) {
    if (path === prefix || path.startsWith(prefix + "/")) return label;
  }
  return "NurseNest";
}

function useIsDarkMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-theme")?.includes("dark") ?? false;
}

type WorkspaceHeaderProps = {
  onMenuClick: () => void;
  userName?: string | null;
  /** Notification count */
  notificationCount?: number;
};

export function WorkspaceHeader({ onMenuClick, userName, notificationCount = 0 }: WorkspaceHeaderProps) {
  const breadcrumb = useBreadcrumb();

  function handleThemeToggle() {
    const root = document.documentElement;
    const current = root.getAttribute("data-theme") ?? "";
    const isDark = current.includes("dark");
    // Toggle between clinical-light and dark-clinical (existing themes)
    root.setAttribute("data-theme", isDark ? "clinical-light" : "dark-clinical");
    try { localStorage.setItem("nn_theme", isDark ? "clinical-light" : "dark-clinical"); } catch { /* ok */ }
  }

  return (
    <header className="nn-workspace-header" role="banner">
      {/* Mobile hamburger (hidden on desktop via CSS) */}
      <button
        type="button"
        className="nn-workspace-header__hamburger"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <IconMenu />
      </button>

      {/* Breadcrumb / section name */}
      <span className="nn-workspace-header__breadcrumb" aria-live="polite">
        {breadcrumb}
      </span>

      {/* Right-side actions */}
      <div className="nn-workspace-header__actions">
        {/* Search */}
        <button
          type="button"
          className="nn-workspace-header__btn"
          aria-label="Search lessons, topics, questions"
          title="Search (⌘K)"
        >
          <IconSearch />
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="nn-workspace-header__btn"
          aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount} unread)` : ""}`}
          style={{ position: "relative" }}
        >
          <IconBell />
          {notificationCount > 0 && (
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "4px",
                right: "4px",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--semantic-danger, #e11d48)",
                border: "1.5px solid var(--workspace-sidebar-bg, #fff)",
              }}
            />
          )}
        </button>

        {/* Theme toggle */}
        <button
          type="button"
          className="nn-workspace-header__btn"
          onClick={handleThemeToggle}
          aria-label="Toggle dark mode"
          title="Toggle theme"
        >
          <IconMoon />
        </button>

        {/* User avatar */}
        <a
          href="/app/account"
          className="nn-workspace-header__btn"
          aria-label={userName ? `Account: ${userName}` : "Account"}
          title={userName ?? "Account"}
          style={{
            borderRadius: "50%",
            overflow: "hidden",
            background: "color-mix(in srgb, var(--semantic-brand) 15%, var(--semantic-surface))",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "var(--semantic-brand)",
            textDecoration: "none",
          }}
        >
          {userName ? userName.charAt(0).toUpperCase() : <IconUser />}
        </a>
      </div>
    </header>
  );
}
