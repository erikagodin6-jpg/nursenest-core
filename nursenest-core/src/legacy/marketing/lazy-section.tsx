import { useState, useEffect, useRef, type ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  className?: string;
  rootMargin?: string;
  minHeight?: string;
}

/** Restored from `client/src/components/lazy-section.tsx` (unchanged behavior). */
export function LazySection({ children, className = "", rootMargin = "200px", minHeight = "100px" }: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={ref}
      className={className}
      style={isVisible ? undefined : { minHeight, contentVisibility: "auto", containIntrinsicSize: `auto ${minHeight}` }}
    >
      {isVisible ? children : null}
    </div>
  );
}
