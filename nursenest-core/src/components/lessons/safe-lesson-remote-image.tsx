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
  /** Notified right before this component unmounts due to image load failure (parent can remove chrome). */
  onHidden,
}: {
  src: string;
  alt: string;
  className?: string;
  onHidden?: () => void;
}) {
  const [visible, setVisible] = useState(true);
  const onError = useCallback(() => {
    onHidden?.();
    setVisible(false);
  }, [onHidden]);
  if (!visible) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- CDN / catalog URLs; onError fallback
    <img src={src} alt={alt} loading="lazy" decoding="async" className={className} onError={onError} />
  );
}
