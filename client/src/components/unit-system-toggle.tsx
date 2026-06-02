/**
 * UnitSystemToggle
 *
 * Prominently styled SI / CONV (Conventional) unit selector for any study view
 * that displays lab values. Uses semantic theme tokens — no hardcoded colours.
 *
 * WCAG AA compliant:
 *   • min 36px desktop height (--unit-toggle-min-h-desktop)
 *   • min 44px mobile height  (--unit-toggle-min-h-mobile)
 *   • Active state: --theme-primary background, white foreground
 *   • Inactive state: --semantic-surface background, --semantic-text-muted foreground
 *   • 3:1+ contrast ratio on both states
 *
 * Usage:
 *   <UnitSystemToggle unit={unit} onUnitChange={setUnit} />
 */

interface UnitSystemToggleProps {
  unit: "si" | "conventional";
  onUnitChange: (unit: "si" | "conventional") => void;
  /** Label for the SI option. Defaults to "SI (Canada)" */
  siLabel?: string;
  /** Label for the conventional option. Defaults to "Conventional (US)" */
  convLabel?: string;
  /** Additional wrapper class */
  className?: string;
}

export function UnitSystemToggle({
  unit,
  onUnitChange,
  siLabel = "SI (Canada)",
  convLabel = "Conventional (US)",
  className = "",
}: UnitSystemToggleProps) {
  return (
    <div
      role="group"
      aria-label="Lab value unit system"
      className={`unit-system-toggle ${className}`}
      data-testid="unit-system-toggle"
    >
      <button
        type="button"
        onClick={() => onUnitChange("si")}
        aria-pressed={unit === "si"}
        data-active={unit === "si" ? "true" : "false"}
        data-testid="unit-toggle-si"
        className="unit-system-toggle__btn"
      >
        <span className="unit-system-toggle__label">{siLabel}</span>
        {unit === "si" && (
          <span className="unit-system-toggle__indicator" aria-hidden="true" />
        )}
      </button>

      <span className="unit-system-toggle__divider" aria-hidden="true" />

      <button
        type="button"
        onClick={() => onUnitChange("conventional")}
        aria-pressed={unit === "conventional"}
        data-active={unit === "conventional" ? "true" : "false"}
        data-testid="unit-toggle-conv"
        className="unit-system-toggle__btn"
      >
        <span className="unit-system-toggle__label">{convLabel}</span>
        {unit === "conventional" && (
          <span className="unit-system-toggle__indicator" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
