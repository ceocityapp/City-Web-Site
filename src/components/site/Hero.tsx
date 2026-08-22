import Link from "next/link";
import { HeroVideo } from "./HeroVideo";
import { Rotator } from "./Rotator";

/* The whole of the hero's copy — these two constants are the headline. */
const LEAD_IN = "Made to feel";
const WORDS = ["local", "human", "yours", "alive", "connected"];

/**
 * Hero — dark, full viewport, video bed.
 *
 * Three elements and nothing else: headline, two actions, and the footage. Both
 * the supporting paragraph and the eyebrow have been removed — with the film
 * carrying the atmosphere and the rotator carrying the adjectives, anything
 * else was a third telling of the same thing.
 *
 * The headline gets an explicit accessible name because its second line is a
 * stack of five words that only one of is visible at a time.
 */
export function Hero() {
  return (
    <section className="ca-sec ca-hero" data-tone="dark" id="top">
      <HeroVideo />

      <div className="ca-shell">
        <div className="ca-stack ca-hero__head">
          <h1
            className="ca-display ca-hero__title"
            aria-label={`${LEAD_IN} ${WORDS.join(", ")}`}
          >
            <span aria-hidden="true">{LEAD_IN}</span>
            <span aria-hidden="true">
              <Rotator words={WORDS} />
            </span>
          </h1>

          <div className="ca-actions">
            <Link className="ca-btn ca-btn--primary ca-btn--lg" href="/signup">
              Get started
            </Link>
            <Link className="ca-btn ca-btn--outline ca-btn--lg" href="/#platform">
              See the platform
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
