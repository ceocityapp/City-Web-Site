"use client";

import { useEffect, useRef, useState } from "react";

/**
 * An in-page video panel.
 *
 * Nothing is fetched until the panel is near the viewport: the `<source>` is
 * withheld on first render, so a visitor who never scrolls this far pays none
 * of the bytes. Once mounted it behaves like the hero bed — muted, looping,
 * paused whenever it is off screen or the tab is hidden, and left on its poster
 * frame entirely for anyone who has asked for reduced motion.
 */
export function SiteVideo({
  src,
  srcSmall,
  poster,
  className,
}: {
  src: string;
  srcSmall: string;
  poster: string;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setLoad(true);
        near.disconnect();
      },
      { rootMargin: "300px 0px" }
    );

    near.observe(wrap);
    return () => near.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const wrap = wrapRef.current;
    if (!load || !video || !wrap) return;

    const play = () => void video.play().catch(() => {});

    const visible = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else video.pause();
      },
      { threshold: 0.15 }
    );
    visible.observe(wrap);

    const onVisibility = () => {
      if (document.visibilityState === "hidden") video.pause();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      visible.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [load]);

  return (
    <div ref={wrapRef} className={["ca-video", className].filter(Boolean).join(" ")}>
      <video ref={videoRef} muted loop playsInline preload="none" poster={poster} disablePictureInPicture>
        {load ? (
          <>
            <source src={srcSmall} type="video/mp4" media="(max-width: 759px)" />
            <source src={src} type="video/mp4" />
          </>
        ) : null}
      </video>
    </div>
  );
}
