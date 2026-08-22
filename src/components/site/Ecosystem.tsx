import Link from "next/link";
import { Reveal } from "./Reveal";
import { SiteVideo } from "./SiteVideo";

/**
 * Ecosystem — light. The first tone change, and the section that overlaps the
 * hero video on its rounded top edge as it scrolls up over it.
 *
 * The aerial film does the work a photograph could not: it makes "a city" mean
 * streets and roofs and the people under them, before a single feature is
 * named.
 */
export function Ecosystem() {
  return (
    <section
      className="ca-sec ca-sec--over"
      data-tone="light"
      id="about"
      aria-labelledby="ca-ecosystem-title"
    >
      <div className="ca-shell">
        <Reveal>
          <p className="ca-eyebrow">The idea</p>

          <div className="ca-split ca-mission">
            <h2 id="ca-ecosystem-title" className="ca-h2">
              A whole ecosystem for better connection
            </h2>

            <div className="ca-stack">
              <p className="ca-lead">
                Not another feed, and not another directory. One place where the
                parts of a city that already depend on each other can finally
                reach each other.
              </p>
              <Link className="ca-btn ca-btn--quiet" href="/#platform">
                See what is inside
              </Link>
            </div>
          </div>
        </Reveal>

        <SiteVideo
          className="ca-eco__film"
          src="/media/site/community.mp4"
          srcSmall="/media/site/community-sm.mp4"
          poster="/media/site/community-poster.jpg"
        />

        <div className="ca-claim">
          <p className="ca-h3 ca-claim__text">
            A new way to <span className="ca-claim__accent">connect locally</span>.
            A city is not a market to enter — it is a place, and the people in
            it already know each other.
          </p>
        </div>
      </div>
    </section>
  );
}
