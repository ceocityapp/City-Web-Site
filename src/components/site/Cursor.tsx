"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient cursor light and the City App pointer.
 *
 * Three fixed layers track the pointer:
 *   • the glow — a soft green wash that may only fall on empty paper, so it
 *     never washes over the film, imagery, the cards or the dark sections;
 *   • the ring — trails a beat behind the pointer and opens wide over anything
 *     clickable;
 *   • the dot — tracks exactly and carries the focus.
 *
 * Everything is driven by two custom properties written once per animation
 * frame, so a pointermove storm can never queue more than one style write and
 * the compositor does the rest. No React state is involved — re-rendering the
 * tree on mouse movement would be the one thing guaranteed to drop frames.
 *
 * The whole thing mounts only for devices with a fine pointer that have not
 * asked for reduced motion; on touch it renders nothing at all.
 */

/** Elements the gradient may never fall on — only the whitespace is safe. */
const NOT_PAPER =
  "[data-tone='dark'], video, img, picture, canvas, svg, " +
  "a, button, input, textarea, select, header, footer, " +
  ".ca-card, .ca-biz__media, .ca-eco__film, .ca-net__field, .ca-node, .ca-form";

export function Cursor() {
  const glowRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return;

    const root = document.documentElement;
    root.dataset.caCursor = "on";

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    // The glow and the ring trail the pointer at their own pace; the dot
    // tracks it exactly.
    let gx = x;
    let gy = y;
    let rx = x;
    let ry = y;
    let frame = 0;

    const tick = () => {
      frame = 0;
      gx += (x - gx) * 0.08;
      gy += (y - gy) * 0.08;
      rx += (x - rx) * 0.22;
      ry += (y - ry) * 0.22;

      glowRef.current?.style.setProperty(
        "transform",
        `translate3d(${gx}px, ${gy}px, 0) translate(-50%, -50%)`
      );
      ringRef.current?.style.setProperty(
        "transform",
        `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`
      );
      dotRef.current?.style.setProperty(
        "transform",
        `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      );

      // Keep easing until the glow has caught up, then stop burning frames.
      if (Math.abs(x - gx) > 0.5 || Math.abs(y - gy) > 0.5) {
        frame = requestAnimationFrame(tick);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;

      const target = event.target as Element | null;

      // Grow the ring over anything clickable, and stand down over text fields
      // so the native caret stays visible where it matters.
      const interactive = target?.closest("a, button, [role='button'], summary");
      const typing = target?.closest("input, textarea, select");
      const state = typing ? "text" : interactive ? "active" : "idle";
      if (cursorRef.current?.dataset.state !== state) {
        if (cursorRef.current) cursorRef.current.dataset.state = state;
      }

      // The gradient is only for the whitespace: stand it down over the film,
      // the cards, the dark sections and anything carrying content.
      const glow = glowRef.current;
      if (glow) {
        const visible = target?.closest(NOT_PAPER) ? "off" : "on";
        if (glow.dataset.visible !== visible) glow.dataset.visible = visible;
      }

      schedule();
    };

    const onLeave = () => root.setAttribute("data-ca-cursor-out", "true");
    const onEnter = () => root.removeAttribute("data-ca-cursor-out");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      if (frame) cancelAnimationFrame(frame);
      delete root.dataset.caCursor;
      root.removeAttribute("data-ca-cursor-out");
    };
  }, []);

  return (
    <>
      <div ref={glowRef} className="ca-glow" data-visible="off" aria-hidden="true" />
      <div ref={cursorRef} className="ca-cursor" data-state="idle" aria-hidden="true">
        <span ref={ringRef} className="ca-cursor__ring" />
        <span ref={dotRef} className="ca-cursor__dot" />
      </div>
    </>
  );
}