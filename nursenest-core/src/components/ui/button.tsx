import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  /** Skip `.nn-ui-btn*` — use when `className` already defines the full control (e.g. segmented tabs). */
  unstyled?: boolean;
}

const VARIANT_CLASS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "nn-ui-btn--primary",
  secondary: "nn-ui-btn--secondary",
  outline: "nn-ui-btn--outline",
  ghost: "nn-ui-btn--ghost",
  destructive: "nn-ui-btn--destructive",
  link: "nn-ui-btn--link",
};

const SIZE_CLASS: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "nn-ui-btn--md",
  sm: "nn-ui-btn--sm",
  lg: "nn-ui-btn--lg",
  icon: "nn-ui-btn--icon",
};

/**
 * Theme-token button styles (see `.nn-ui-btn*` in `globals.css`).
 * Pass `className` to layer layout/spacing utilities; variant/size set the semantic look.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", type = "button", variant = "default", size = "default", unstyled = false, ...props }, ref) => {
    if (unstyled) {
      return <button ref={ref} type={type} className={className} {...props} />;
    }
    const v = VARIANT_CLASS[variant] ?? VARIANT_CLASS.default;
    const s = SIZE_CLASS[size] ?? SIZE_CLASS.default;
    return (
      <button
        ref={ref}
        type={type}
        className={["nn-ui-btn", v, s, className].filter(Boolean).join(" ")}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
