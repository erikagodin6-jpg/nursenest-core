import * as React from "react";

/**
 * Single-thumb range control, API-shaped like Radix/shadcn `Slider` (`value` / `defaultValue` as `number[]`).
 * Implemented with native `<input type="range">` — no extra UI packages; uses theme / semantic CSS variables.
 */
export type SliderProps = Omit<
  React.ComponentPropsWithoutRef<"input">,
  "type" | "value" | "defaultValue" | "onChange" | "onInput" | "min" | "max" | "step"
> & {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
};

function firstThumb(raw: number[] | undefined, fallback: number): number {
  if (!raw?.length) return fallback;
  const n = Number(raw[0]);
  return Number.isFinite(n) ? n : fallback;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className = "",
      value,
      defaultValue,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      disabled,
      style,
      ...rest
    },
    ref,
  ) => {
    const controlled = value !== undefined;
    const v = controlled ? firstThumb(value, min) : undefined;
    const d0 = !controlled && defaultValue !== undefined ? firstThumb(defaultValue, min) : undefined;

    const emit = (el: HTMLInputElement) => {
      onValueChange?.([Number(el.value)]);
    };

    return (
      <div
        className={["relative flex w-full touch-none select-none items-center", className].filter(Boolean).join(" ")}
      >
        <input
          ref={ref}
          type="range"
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[color-mix(in_srgb,var(--border-subtle,var(--theme-card-border))_70%,transparent)] disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            accentColor: "var(--semantic-brand, var(--focus-halo, var(--theme-ring)))",
            ...style,
          }}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          {...(controlled ? { value: v } : d0 !== undefined ? { defaultValue: d0 } : { defaultValue: min })}
          onInput={(e) => emit(e.currentTarget)}
          {...rest}
        />
      </div>
    );
  },
);
Slider.displayName = "Slider";
