"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's video bed.
 *
 * Deliberately not `autoPlay` in the markup: playback is started from an effect
 * so that `prefers-reduced-motion` can suppress it and leave the poster frame
 * standing. That also means a JS failure degrades to a still image rather than
 * a black rectangle.
 *
 * The clip is encoded as a seamless loop — its last 1.2s are crossfaded over
 * its first — so there is no visible cut at the wrap.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Safari rejects the promise if the tab is backgrounded at mount; the
    // poster stays up in that case, which is the correct outcome anyway.
    const start = () => void video.play().catch(() => {});

    start();

    // Browsers pause media in hidden tabs and do not reliably resume it, which
    // leaves the hero frozen on a still after the user comes back.
    const onVisible = () => {
      if (document.visibilityState === "visible" && video.paused) start();
    };
    document.addEventListener("visibilitychange", onVisible);

    /*
     * The hero is pinned for the whole page, so without this the video would
     * keep decoding behind five sections of opaque content. Pause it once the
     * page has scrolled past, resume when it comes back.
     */
    const marker = document.getElementById("ca-hero-end");
    const observer = marker
      ? new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) start();
            else video.pause();
          },
          { threshold: 0 }
        )
      : null;

    if (marker && observer) observer.observe(marker);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      observer?.disconnect();
    };
  }, []);

  return (
    <div className="ca-hero__media" aria-hidden="true">
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/media/hero/city-hero-poster.jpg"
        disablePictureInPicture
      >
        <source
          src="/media/hero/city-hero-sm.mp4"
          type="video/mp4"
          media="(max-width: 759px)"
        />
        <source src="/media/hero/city-hero.mp4" type="video/mp4" />
      </video>
      <div className="ca-hero__scrim" />
    </div>
  );
}
