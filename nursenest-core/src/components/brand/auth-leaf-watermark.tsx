"use client";

/**
 * Decorative leaf watermark for auth surfaces — uses the same approved leaf raster as
 * {@link SiteBrandLogoMark} / header lockup ({@link useThemeLogo} `"leaf"`).
 *
 * Absolutely positioned, pointer-events: none, aria-hidden.
 * Parent must be `relative overflow-hidden`; content above uses `relative z-[1]`.
 */
import { useThemeLogo } from "@/lib/theme/use-theme-logo";

type AuthLeafPlacement = "card-corner" | "panel-hero" | "page-ambient";

const placementClass: Record<AuthLeafPlacement, string> = {
  "card-corner": "bottom-[-3rem] right-[-3rem] h-[260px] w-[260px] opacity-[0.055] hidden sm:block",
  "panel-hero":
    "left-1/2 top-[42%] h-[min(72vw,420px)] w-[min(72vw,420px)] max-h-[420px] max-w-[420px] opacity-[0.09]",
  "page-ambient":
    "right-[-12%] top-[18%] h-[min(88vw,520px)] w-[min(88vw,520px)] max-h-[520px] max-w-[520px] opacity-[0.06] hidden md:block",
};

const placementTransform: Record<AuthLeafPlacement, string> = {
  "card-corner": "rotate(9deg)",
  "panel-hero": "translate(-50%, -50%) rotate(-14deg)",
  "page-ambient": "rotate(12deg)",
};

function AuthLeafImage({
  placement,
  className = "",
}: {
  placement: AuthLeafPlacement;
  className?: string;
}) {
  const { url, kind } = useThemeLogo("leaf");
  if (kind !== "local" || !url) return null;

  return (
    <img
      src={url}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={[
        "pointer-events-none absolute select-none object-contain",
        "bg-transparent shadow-none ring-0 outline-none [mix-blend-mode:normal]",
        placementClass[placement],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ transform: placementTransform[placement], backgroundColor: "transparent" }}
    />
  );
}

/** Small corner mark on auth form cards (sign-in / sign-up). */
export function AuthLeafWatermark() {
  return <AuthLeafImage placement="card-corner" />;
}

/** Large transparent leaf behind celebration / verification panels. */
export function AuthLeafBackground({
  placement = "panel-hero",
  className,
}: {
  placement?: Extract<AuthLeafPlacement, "panel-hero" | "page-ambient">;
  className?: string;
}) {
  return <AuthLeafImage placement={placement} className={className} />;
}
