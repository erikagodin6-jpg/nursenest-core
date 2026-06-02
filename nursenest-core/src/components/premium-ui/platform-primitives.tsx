import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

type PlatformButtonVariant = "primary" | "secondary" | "ghost" | "icon" | "destructive";
type PlatformInputKind = "text" | "password" | "search";
type PlatformPanelVariant = "card" | "glass" | "monitor" | "report";
type PlatformFeedbackVariant = "banner" | "alert" | "toast" | "inline-validation";
type PlatformTextVariant = "heading" | "label" | "helper-text" | "educational-copy" | "metadata";

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export type PlatformButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: PlatformButtonVariant;
};

export function PlatformButton({
  variant = "primary",
  className,
  type = "button",
  ...props
}: PlatformButtonProps) {
  return (
    <button
      data-nn-platform-primitive="button"
      data-variant={variant}
      className={classes("nn-platform-button", `nn-platform-button--${variant}`, className)}
      type={type}
      {...props}
    />
  );
}

export type PlatformIconButtonProps = Omit<PlatformButtonProps, "variant"> & {
  "aria-label": string;
};

export function PlatformIconButton({ className, ...props }: PlatformIconButtonProps) {
  return <PlatformButton variant="icon" className={className} {...props} />;
}

export type PlatformInputProps = InputHTMLAttributes<HTMLInputElement> & {
  kind?: PlatformInputKind;
  invalid?: boolean;
};

export function PlatformInput({
  kind = "text",
  className,
  invalid,
  type,
  ...props
}: PlatformInputProps) {
  return (
    <input
      data-nn-platform-primitive="input"
      data-input-kind={kind}
      aria-invalid={invalid ? true : undefined}
      className={classes("nn-platform-input", className)}
      type={type ?? kind}
      {...props}
    />
  );
}

export function PlatformTextarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      data-nn-platform-primitive="textarea"
      className={classes("nn-platform-input", "nn-platform-textarea", className)}
      {...props}
    />
  );
}

export function PlatformSelect({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      data-nn-platform-primitive="select"
      className={classes("nn-platform-input", "nn-platform-select", className)}
      {...props}
    />
  );
}

export type PlatformPanelProps = HTMLAttributes<HTMLDivElement> & {
  variant?: PlatformPanelVariant;
};

export function PlatformPanel({ variant = "card", className, ...props }: PlatformPanelProps) {
  return (
    <div
      data-nn-platform-primitive="panel"
      data-variant={variant}
      className={classes("nn-platform-panel", `nn-platform-panel--${variant}`, className)}
      {...props}
    />
  );
}

export type PlatformFeedbackProps = HTMLAttributes<HTMLDivElement> & {
  variant?: PlatformFeedbackVariant;
};

export function PlatformFeedback({ variant = "banner", className, ...props }: PlatformFeedbackProps) {
  return (
    <div
      data-nn-platform-primitive="feedback"
      data-variant={variant}
      className={classes("nn-platform-feedback", `nn-platform-feedback--${variant}`, className)}
      role={variant === "inline-validation" ? "status" : props.role}
      {...props}
    />
  );
}

export function PlatformTopbar({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <header
      data-nn-platform-primitive="topbar"
      className={classes("nn-platform-topbar", className)}
      {...props}
    />
  );
}

export function PlatformTabs({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-nn-platform-primitive="tabs"
      className={classes("nn-platform-tabs", className)}
      role={props.role ?? "tablist"}
      {...props}
    />
  );
}

export function PlatformSegmentedControl({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-nn-platform-primitive="segmented-control"
      className={classes("nn-platform-segmented-control", className)}
      role={props.role ?? "group"}
      {...props}
    />
  );
}

export function PlatformBreadcrumbs({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <nav
      data-nn-platform-primitive="breadcrumbs"
      aria-label={props["aria-label"] ?? "Breadcrumbs"}
      className={classes("nn-platform-breadcrumbs", className)}
      {...props}
    />
  );
}

export type PlatformTextProps = HTMLAttributes<HTMLElement> & {
  as?: "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4";
  variant?: PlatformTextVariant;
  children: ReactNode;
};

export function PlatformText({ as: Tag = "p", variant = "educational-copy", className, ...props }: PlatformTextProps) {
  return (
    <Tag
      data-nn-platform-primitive="typography"
      data-variant={variant}
      className={classes("nn-platform-text", `nn-platform-text--${variant}`, className)}
      {...props}
    />
  );
}

export function PlatformLabel({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      data-nn-platform-primitive="label"
      className={classes("nn-platform-text", "nn-platform-text--label", className)}
      {...props}
    />
  );
}
