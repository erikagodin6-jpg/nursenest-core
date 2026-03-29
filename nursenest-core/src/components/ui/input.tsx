import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`flex h-10 w-full rounded-md border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] px-3 py-2 text-sm text-[var(--theme-heading-text)] shadow-sm outline-none ring-primary/30 placeholder:text-[var(--theme-muted-text)] focus-visible:ring-2 ${className}`}
    {...props}
  />
));
Input.displayName = "Input";
