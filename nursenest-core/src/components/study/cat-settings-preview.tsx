import { Clock, ToggleLeft, BookOpen, HelpCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const SETTINGS: Array<{ icon: LucideIcon; title: string; description: string }> = [
  {
    icon: HelpCircle,
    title: "Adaptive length",
    description: "Session ends when the algorithm is confident in your score.",
  },
  {
    icon: Clock,
    title: "Timed or untimed",
    description: "Practice under exam conditions or study at your own pace.",
  },
  {
    icon: ToggleLeft,
    title: "Explanations on/off",
    description: "See rationales immediately or save them for after the session.",
  },
  {
    icon: BookOpen,
    title: "Topic focus",
    description: "Narrow the question pool to specific clinical areas.",
  },
];

export function CatSettingsPreview() {
  return (
    <section className="mt-6" aria-labelledby="cat-settings-heading">
      <div className="rounded-[1.75rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-[var(--semantic-shadow-soft)] sm:p-8">
        <span className="nn-marketing-label">Configuration</span>
        <h2
          id="cat-settings-heading"
          className="nn-marketing-h2 mt-2 text-[var(--theme-heading-text)]"
        >
          Session settings
        </h2>
        <p className="nn-marketing-body-sm mt-2 max-w-2xl text-[var(--theme-muted-text)]">
          Customise your session before you start — no setup required to begin.
        </p>

        <ul className="mt-6 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {SETTINGS.map((setting) => {
            const Icon = setting.icon;
            return (
              <li
                key={setting.title}
                className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-info)_4%,var(--semantic-surface))] p-5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] text-[var(--semantic-info)]">
                  <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </span>
                <p className="mt-3 font-semibold leading-snug text-[var(--theme-heading-text)]">
                  {setting.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--theme-muted-text)]">
                  {setting.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
