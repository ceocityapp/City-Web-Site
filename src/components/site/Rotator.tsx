"use client";

import { useEffect, useState } from "react";

/**
 * The rotating half of the hero headline.
 *
 * Words dissolve through blur rather than sliding or fading flat: the outgoing
 * one drifts up and out of focus while the next rises into it. Each word
 * carries its own green gradient, so the accent has variety across the cycle
 * without any single moment being loud.
 *
 * The vocabulary arrives as a prop rather than living here: the hero is a
 * server component and needs the same list for the headline's accessible name,
 * and a plain array exported across a `"use client"` boundary reaches the
 * server as a module proxy, not as strings.
 */

/** Milliseconds a word holds before the next one starts arriving. */
const INTERVAL = 2800;

export function Rotator({ words }: { words: readonly string[] }) {
  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState(-1);

  useEffect(() => {
    // Honour the OS setting: no cycling at all, just the first word.
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (query.matches) return;

    const id = window.setInterval(() => {
      setIndex((current) => {
        setPrevious(current);
        return (current + 1) % words.length;
      });
    }, INTERVAL);

    return () => window.clearInterval(id);
  }, [words.length]);

  return (
    <span className="ca-rotator">
      {words.map((word, i) => (
        <span
          key={word}
          className="ca-rotator__word"
          data-state={i === index ? "in" : i === previous ? "out" : "idle"}
          style={
            {
              "--ca-word-grad": `var(--ca-grad-${(i % 5) + 1})`,
            } as React.CSSProperties
          }
        >
          {word}
        </span>
      ))}
    </span>
  );
}
