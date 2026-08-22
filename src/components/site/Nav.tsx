"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wordmark } from "./Mark";

/**
 * Floating navigation.
 *
 * A single glass object sitting above the page rather than a full-width band
 * welded to the top of it. It keeps the dark treatment over light sections
 * too — one consistent element travelling down the page reads more confident
 * than a bar that changes identity every time the tone flips.
 *
 * The only client-side state on the site is the mobile disclosure.
 */

/** Primary navigation copy, in the order the argument is made on the page.
    Each entry is its own page now; the landing tells the whole story. */
const LINKS = [
  { label: "Vision", href: "/vision" },
  { label: "Platform", href: "/platform" },
  { label: "Cities", href: "/cities" },
  { label: "Team", href: "/team" },
];

export function Nav({ hasHero = false }: { hasHero?: boolean }) {
  const [open, setOpen] = useState(false);
  const [past, setPast] = useState(hasHero ? false : true);

  /*
   * Glass this transparent only works over the hero video. Carried onto the
   * white sections below it the bar composites to pale grey and its white
   * labels disappear, so it thickens once the hero has gone by.
   *
   * Observing the hero rather than listening to scroll: the callback fires
   * twice per page, not on every frame, and there is no scroll position to
   * measure against a viewport-height section.
   */
  useEffect(() => {
    // Section pages have no hero, so the navigation starts dense from the top.
    if (!hasHero) return;

    /*
     * Observing the marker at the hero's bottom, not the hero itself: the hero
     * is pinned so the page can scroll over it, which means it never stops
     * intersecting the viewport and would report "still at the top" forever.
     */
    const marker = document.getElementById("ca-hero-end");
    if (!marker) return;

    const observer = new IntersectionObserver(
      ([entry]) => setPast(!entry.isIntersecting),
      // Shrink the root past the bar itself, so the switch happens as the hero
      // leaves from under the glass rather than from under the viewport.
      { rootMargin: "-88px 0px 0px 0px", threshold: 0 }
    );

    observer.observe(marker);
    return () => observer.disconnect();
  }, [hasHero]);

  return (
    <header className="ca-nav">
      <div className="ca-shell">
        <div className="ca-nav__bar" data-past={past}>
          <Link className="ca-nav__brand" href="/">
            <Wordmark />
          </Link>

          <span className="ca-nav__spacer" />

          <nav aria-label="Primary">
            <ul className="ca-nav__links">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <Link className="ca-nav__link" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <span className="ca-nav__spacer" />

          <div className="ca-nav__right">
            <Link className="ca-nav__link" href="/login">
              Log in
            </Link>
            <span className="ca-nav__divider" aria-hidden="true" />
            <Link className="ca-btn ca-btn--primary ca-btn--sm" href="/signup">
              Get started
            </Link>
          </div>

          <button
            type="button"
            className="ca-nav__toggle"
            aria-expanded={open}
            aria-controls="ca-nav-panel"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              {open ? (
                <path
                  d="M4 4l10 10M14 4L4 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M2.5 5.5h13M2.5 12.5h13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>

        {open ? (
          <div className="ca-nav__panel" id="ca-nav-panel">
            <ul>
              {LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    className="ca-nav__link"
                    href={link.href}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="ca-nav__panel-actions">
              <Link
                className="ca-btn ca-btn--outline"
                href="/login"
                onClick={() => setOpen(false)}
              >
                Log in
              </Link>
              <Link
                className="ca-btn ca-btn--primary"
                href="/signup"
                onClick={() => setOpen(false)}
              >
                Get started
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
