import type { SyntheticEvent } from "react";

const FALLBACK_SVG =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Cpath d='M70 80 L130 80 L130 140 L70 140 Z' fill='none' stroke='%23d1d5db' stroke-width='3'/%3E%3Ccircle cx='90' cy='100' r='6' fill='%23d1d5db'/%3E%3Cpath d='M70 130 L95 110 L115 125 L130 115 L130 140 L70 140 Z' fill='%23d1d5db'/%3E%3C/svg%3E";

export const imageFallback = (e: SyntheticEvent<HTMLImageElement>) => {
  const t = e.currentTarget;
  if (t.dataset.fallbackApplied) return;
  t.dataset.fallbackApplied = "true";
  t.src = FALLBACK_SVG;
};
