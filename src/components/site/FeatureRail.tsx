"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";

/*
 * Whether this visit gets the pinned experience at all.
 *
 * Read through useSyncExternalStore rather than an effect: matchMedia is an
 * external store, the server snapshot is honestly "no" (the markup ships as the
 * native scroller), and the component now also survives someone dragging their
 * window across the breakpoint.
 */
const WIDE = "(min-width: 1000px)";
const CALM = "(prefers-reduced-motion: reduce)";

function subscribeJack(onChange: () => void) {
  const wide = window.matchMedia(WIDE);
  const calm = window.matchMedia(CALM);
  wide.addEventListener("change", onChange);
  calm.addEventListener("change", onChange);
  return () => {
    wide.removeEventListener("change", onChange);
    calm.removeEventListener("change", onChange);
  };
}

const readJack = () =>
  window.matchMedia(WIDE).matches && !window.matchMedia(CALM).matches;

const readJackOnServer = () => false;

/**
 * The feature rail — the page's main interaction.
 *
 * Two completely different experiences behind one markup tree:
 *
 *   Desktop  the section is a tall spacer with a pinned stage inside it. Vertical
 *            scroll is converted into horizontal travel, so the page appears to
 *            hold still while the cards move past. Progress drives one custom
 *            property; the transform is the compositor's problem.
 *
 *   Touch    no hijacking at all. The rail becomes a native horizontal scroller
 *            with CSS scroll-snap, which is what a thumb expects and what the
 *            platform already does at 60fps for free.
 *
 * Progress is measured from the *outer* section's rect, never from the pinned
 * stage: a sticky element reports its shifted position, so measuring it makes
 * progress read as zero forever and the rail silently never moves.
 */

type Card = {
  n: number;
  title: string;
  blurb: string;
  image: string;
  id?: string;
};

const CARDS: Card[] = [
  {
    n: 1,
    title: "Local businesses",
    blurb: "A page for every shop, bar and workshop in town — claimed and run by its owner.",
    image: "/media/cards/businesses.jpg",
    id: "businesses",
  },
  {
    n: 2,
    title: "Communities",
    blurb: "Neighbourhood groups, associations and clubs, each with a place of their own.",
    image: "/media/cards/community.jpg",
  },
  {
    n: 3,
    title: "Posts",
    blurb: "A feed of the city's everyday life — what the people around you are up to.",
    image: "/media/generated/vecinos-calle.jpg",
  },
  {
    n: 4,
    title: "Forums",
    blurb: "Where the city argues about the city, in the open and under its own name.",
    image: "/media/cards/forums.jpg",
  },
  {
    n: 5,
    title: "Jobs",
    blurb: "Local vacancies, posted by the employers who are actually down the road.",
    image: "/media/cards/jobs.jpg",
  },
  {
    n: 6,
    title: "Events",
    blurb: "What is on this week, from concerts and markets to council meetings.",
    image: "/media/cards/events.jpg",
  },
  {
    n: 7,
    title: "Messaging",
    blurb: "Direct and group chat between neighbours, communities and local pages.",
    image: "/media/cards/messaging.jpg",
  },
  {
    n: 8,
    title: "Profiles",
    blurb: "The people who make the city — neighbours, shopkeepers and local voices.",
    image: "/media/city/04-gente.jpg",
  },
];

export function FeatureRail() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const jacked = useSyncExternalStore(subscribeJack, readJack, readJackOnServer);

  useEffect(() => {
    // Touch, narrow, or reduced-motion visitors keep the native scroller.
    if (!jacked) return;

    const section = sectionRef.current;
    const rail = railRef.current;
    const stage = stageRef.current;
    if (!section || !rail || !stage) return;

    let travel = 0;
    let frame = 0;

    const measure = () => {
      // How far the rail must slide for its last card to reach the right edge.
      travel = Math.max(0, rail.scrollWidth - stage.clientWidth);
      // Give the spacer enough height that the slide happens at a natural pace:
      // roughly one viewport of scrolling per screenful of horizontal travel.
      section.style.setProperty("--ca-jack-h", `${window.innerHeight + travel}px`);
    };

    const update = () => {
      const rect = section.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      if (span <= 0) return;

      const p = Math.min(1, Math.max(0, -rect.top / span));
      rail.style.setProperty("--ca-x", `${-p * travel}px`);

      // Which card is nearest the centre of the stage.
      const cards = rail.children;
      const centre = stage.clientWidth / 2;
      let best = 0;
      let bestGap = Infinity;
      for (let i = 0; i < cards.length; i++) {
        const c = (cards[i] as HTMLElement).getBoundingClientRect();
        const gap = Math.abs(c.left + c.width / 2 - rect.left - centre);
        if (gap < bestGap) {
          bestGap = gap;
          best = i;
        }
      }
      setActive(best);
    };

    /*
     * Driven by a frame loop that only runs while the section is on screen,
     * rather than by scroll events.
     *
     * Two reasons. A scroll listener misses any movement the browser makes
     * without dispatching one — anchor jumps, scroll restoration, momentum
     * hand-off — and leaves the rail stranded mid-slide. And rAF is already
     * throttled to the display and suspended in background tabs, so gating it
     * on visibility costs nothing while the section is off screen, which is
     * almost the whole page.
     */
    const loop = () => {
      update();
      frame = requestAnimationFrame(loop);
    };

    const onScreen = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!frame) frame = requestAnimationFrame(loop);
        } else if (frame) {
          cancelAnimationFrame(frame);
          frame = 0;
          update();
        }
      },
      { threshold: 0 }
    );

    measure();
    update();
    onScreen.observe(section);

    const resize = new ResizeObserver(() => {
      measure();
      update();
    });
    resize.observe(rail);
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("resize", measure);
      onScreen.disconnect();
      resize.disconnect();
      if (frame) cancelAnimationFrame(frame);
      section.style.removeProperty("--ca-jack-h");
      rail.style.removeProperty("--ca-x");
    };
  }, [jacked]);

  return (
    <section
      ref={sectionRef}
      className="ca-sec ca-jack"
      data-tone="light"
      data-surface="paper"
      data-jacked={jacked}
      id="platform"
      aria-labelledby="ca-rail-title"
    >
      <div ref={stageRef} className="ca-jack__stage">
        <div className="ca-shell ca-jack__head">
          <div className="ca-split">
            <div className="ca-stack">
              <p className="ca-eyebrow">The platform</p>
              <h2 id="ca-rail-title" className="ca-h2">
                Everything a city already does
              </h2>
            </div>
            <p className="ca-lead">
              Eight areas that work as one product, because in a real city they
              were never separate to begin with.
            </p>
          </div>
        </div>

        <div className="ca-rail__viewport">
          <div ref={railRef} className="ca-rail">
            {CARDS.map((card, i) => (
              <article
                className="ca-card"
                key={card.title}
                id={card.id}
                data-active={jacked ? i === active : undefined}
              >
                <div className="ca-card__media">
                  <Image
                    src={card.image}
                    alt=""
                    width={1024}
                    height={768}
                    sizes="(max-width: 1000px) 82vw, 420px"
                  />
                </div>
                <div className="ca-card__body">
                  <span className="ca-num ca-card__num">
                    {String(card.n).padStart(2, "0")}
                  </span>
                  <h3 className="ca-h3 ca-card__title">{card.title}</h3>
                  <p className="ca-body">{card.blurb}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {jacked ? (
          <div className="ca-shell ca-rail__progress" aria-hidden="true">
            <span className="ca-rail__count">
              {String(active + 1).padStart(2, "0")}
              <i>/</i>
              {CARDS.length}
            </span>
            <span className="ca-rail__track">
              <span
                className="ca-rail__bar"
                style={{ transform: `scaleX(${(active + 1) / CARDS.length})` }}
              />
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
