"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Marks its subtree as revealed the first time it enters the viewport.
 *
 * It owns no animation itself — it only flips `data-revealed`, and the CSS
 * decides what that means. That keeps the timing (which differs per city tier)
 * in the stylesheet next to the rest of the motion, and keeps this component to
 * one observer that disconnects after firing once.
 *
 * Reduced motion is handled in CSS rather than here, and the no-JS case by a
 * `<noscript>` rule in the layout: content that only appears once an observer
 * fires must never be able to stay hidden.
 */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setRevealed(true);
        observer.disconnect();
      },
      // Start once the block is meaningfully on screen, not at the first pixel.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} data-revealed={revealed}>
      {children}
    </div>
  );
}
