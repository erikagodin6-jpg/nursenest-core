import * as React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => (
    <textarea
      ref={ref}
      className={`flex min-h-[5rem] w-full rounded-md border border-[var(--border-subtle,var(--theme-card-border))] bg-[var(--surface-input,var(--theme-input-bg))] px-3 py-2 text-sm font-normal leading-[1.5] text-[var(--theme-heading-text)] shadow-sm outline-none ring-offset-2 ring-offset-[var(--bg-page,var(--theme-page-bg))] placeholder:font-normal placeholder:text-[var(--theme-muted-text)] focus-visible:border-[var(--border-medium)] focus-visible:ring-2 focus-visible:ring-[var(--focus-halo,var(--theme-ring))] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
