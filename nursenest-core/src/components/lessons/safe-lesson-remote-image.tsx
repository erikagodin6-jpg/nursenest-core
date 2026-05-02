"use client";

import { useCallback, useState } from "react";

/**
 * Remote lesson image that removes itself on load error so learners never see a broken icon
 * or an empty bordered frame.
 */
export function SafeLessonRemoteImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [visible, setVisible] = useState(true);
  const onError = useCallback(() => setVisible(false), []);
  if (!visible) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- CDN / catalog URLs; onError fallback
    <img src={src} alt={alt} loading="lazy" decoding="async" className={className} onError={onError} />
  );
}
