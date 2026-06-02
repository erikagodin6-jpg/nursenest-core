import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`flex h-10 w-full rounded-md border border-[var(--border-subtle,var(--theme-card-border))] bg-[var(--surface-input,var(--theme-input-bg))] px-3 py-2 text-sm font-normal leading-[1.5] text-[var(--theme-heading-text)] shadow-sm outline-none ring-offset-2 ring-offset-[var(--bg-page,var(--theme-page-bg))] placeholder:font-normal placeholder:text-[var(--theme-muted-text)] focus-visible:border-[var(--border-medium)] focus-visible:ring-2 focus-visible:ring-[var(--focus-halo,var(--theme-ring))] ${className}`}
    {...props}
  />
));
Input.displayName = "Input";
