"use client";

import { useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Counts from 0 up to `target` once the element scrolls into view.
 * Non-numeric values (e.g. "100%", "0€") should skip this and render as-is.
 */
export function useCountUp(target: number, duration = 1600) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      // deferred so this doesn't cascade a render from inside the effect
      const id = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(id);
    }

    const run = () => {
      if (started.current) return;
      started.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        // Clamped at both ends: rAF can hand back a timestamp from just
        // before `start` (it is the frame's time, not the call's), and a
        // negative `t` sends easeOutExpo below zero — long enough to paint
        // one frame of "-1%" where "100%" belongs.
        const t = Math.max(0, Math.min(1, (now - start) / duration));
        // easeOutExpo — fast start, long settle
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setValue(target * eased);
        if (t < 1) requestAnimationFrame(tick);
        else setValue(target);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, value };
}
