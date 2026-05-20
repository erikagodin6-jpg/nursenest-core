import { cn } from "@/lib/utils";

/**
 * Minimal leaf mark for loading chrome — simplified path only; does not replace header/footer logo components.
 */
export function BrandedLeafMark({ className }: { className?: string }) {
  return (
    <svg
      className={cn("block h-[2.125rem] w-[1.75rem] shrink-0", className)}
      viewBox="0 0 28 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M14 2c-5 7.5-9 15.2-8.8 23.4C5.4 30 9 33 14 33s8.6-3 8.8-7.6C23 17.2 19 9.5 14 2z"
        opacity="0.92"
      />
      <path
        fill="currentColor"
        fillOpacity="0.35"
        d="M14 8c2.8 5.4 4.6 11 4.4 16.2-.1 2.4-1.7 4.1-4.4 4.1s-4.3-1.7-4.4-4.1C9.4 19 11.2 13.4 14 8z"
      />
    </svg>
  );
}
