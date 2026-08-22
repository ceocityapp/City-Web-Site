"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scene progress for a pinned (`position: sticky`) section.
 *
 * Attach the ref to the *tall outer* element; put a `sticky top-0 h-[100svh]`
 * stage inside it. Progress is 0 the instant the stage pins and 1 the instant
 * it unpins, which is the only mapping that stays honest when the section is
 * taller than the viewport.
 *
 * Two channels, on purpose:
 *   • `onFrame` fires inside rAF and never re-renders — use it to write CSS
 *     custom properties for anything that has to move every frame.
 *   • the returned `progress` / `index` state updates only when the value
 *     actually changes at the requested granularity, so React work stays rare.
 */
export function useScrollScene<T extends HTMLElement = HTMLDivElement>(options?: {
  /** How many discrete steps the returned `progress` state snaps to. */
  steps?: number;
  /** Number of chapters; drives the returned `index`. */
  chapters?: number;
  /** Runs every animation frame while the scene is near the viewport. */
  onFrame?: (progress: number) => void;
}) {
  const { steps = 60, chapters = 0 } = options ?? {};
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  const [index, setIndex] = useState(0);

  // keep the latest callback without restarting the listener
  const frameCb = useRef(options?.onFrame);
  useEffect(() => {
    frameCb.current = options?.onFrame;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let near = true;
    let lastStep = -1;
    let lastIndex = -1;

    const observer = new IntersectionObserver(([e]) => (near = e.isIntersecting), {
      rootMargin: "20% 0px",
    });
    observer.observe(el);

    const update = () => {
      raf = 0;
      if (!near) return;

      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = travel <= 0 ? (rect.top <= 0 ? 1 : 0) : clamp(-rect.top / travel, 0, 1);

      frameCb.current?.(p);

      const step = Math.round(p * steps);
      if (step !== lastStep) {
        lastStep = step;
        setProgress(step / steps);
      }

      if (chapters > 0) {
        const i = Math.min(chapters - 1, Math.floor(p * chapters));
        if (i !== lastIndex) {
          lastIndex = i;
          setIndex(i);
        }
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("load", onScroll);

    // A scene can mount already scrolled into — a reload that restores the
    // position, an inbound `#film` link, a back navigation. There is no
    // scroll event in any of those cases, and the single `update()` above
    // runs against a layout that images and webfonts are still moving. Watch
    // the document box so every one of those settles gets a recompute;
    // without this the scene sits frozen at whatever it measured on mount.
    const resize = new ResizeObserver(onScroll);
    resize.observe(document.documentElement);

    return () => {
      observer.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("load", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [steps, chapters]);

  return { ref, progress, index };
}

/** Scroll direction, debounced past a dead zone so tiny jitters don't flip it. */
export function useScrollDirection(deadZone = 6) {
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    let raf = 0;
    let last = window.scrollY;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setAtTop(y < 24);
      if (Math.abs(y - last) < deadZone) return;
      setDirection(y > last && y > 120 ? "down" : "up");
      last = y;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [deadZone]);

  return { direction, atTop };
}

export function clamp(v: number, min: number, max: number) {
  return v < min ? min : v > max ? max : v;
}

/** Maps `v` from [a,b] onto [0,1], clamped. */
export function range(v: number, a: number, b: number) {
  return clamp((v - a) / (b - a), 0, 1);
}

/** Smoothstep easing — the default curve for scroll-scrubbed motion. */
export function ease(t: number) {
  return t * t * (3 - 2 * t);
}
