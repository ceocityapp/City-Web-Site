"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Translates an element on scroll at a fraction of the page speed.
 * Writes straight to `style.transform` inside rAF — no re-renders.
 *
 * @param speed  positive moves slower than the page (background),
 *               negative moves faster (foreground).
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(speed = 0.2) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let visible = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "120px" }
    );
    observer.observe(el);

    const update = () => {
      frame = 0;
      if (!visible) return;
      const rect = el.getBoundingClientRect();
      // 0 when the element's centre is at viewport centre
      const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${(offset * speed).toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [speed]);

  return ref;
}

/**
 * Progress (0→1) of an element travelling through the viewport.
 * 0 = the element's top has just reached the bottom of the viewport,
 * 1 = its bottom has just left the top. Drives scroll-scrubbed art.
 */
export function useScrollProgress<T extends HTMLElement = HTMLDivElement>(options?: {
  /** Fraction of the travel to use, so the animation finishes before the
   *  section leaves the screen. 0.65 = done at two thirds of the way. */
  span?: number;
}) {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  const span = options?.span ?? 0.72;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    let visible = true;

    const observer = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      rootMargin: "200px",
    });
    observer.observe(el);

    const update = () => {
      frame = 0;
      if (!visible) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const travelled = vh - rect.top;
      const raw = travelled / (total * span);
      setProgress(Math.min(1, Math.max(0, raw)));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [span]);

  return { ref, progress };
}

/** True once the page has scrolled past `threshold` px. rAF-throttled. */
export function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > threshold);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return scrolled;
}
