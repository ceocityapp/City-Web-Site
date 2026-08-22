import { SiteShell } from "./SiteShell";
import { Hero } from "./Hero";
import { Ecosystem } from "./Ecosystem";
import { Vision } from "./Vision";
import { FeatureRail } from "./FeatureRail";
import { Business } from "./Business";
import { CityNetwork } from "./CityNetwork";
import { Opportunity } from "./Opportunity";
import { Stats } from "./Stats";
import { Team } from "./Team";
import { FinalCta } from "./FinalCta";
import { Bring } from "./Bring";

/**
 * The City App website.
 *
 * The page is a single argument, told in order:
 *   the idea → the vision → the product → businesses → the network → the
 *   market → the proof → the team → the case to act.
 *
 * Tone alternates dark/light throughout, the hero is pinned and everything
 * after it rides up over it, and green appears only on the marks, the primary
 * action, the live city and the accents.
 *
 * The navigation's tabs lead to dedicated pages for the vision, the platform,
 * the cities and the team; this page stays the one continuous telling.
 */
export function Landing() {
  return (
    <SiteShell hasHero>
      {/* Spans the hero's flow region. The hero itself is pinned and so never
          stops intersecting the viewport; this is the only thing on the page
          that can answer "have we scrolled past it". Both the navigation and
          the video playback observe it. */}
      <div id="ca-hero-end" className="ca-hero-end" aria-hidden="true" />

      <Hero />
      <Ecosystem />
      <Vision />
      <FeatureRail />
      <Business />
      <CityNetwork />
      <Opportunity />
      <Stats />
      <Team />
      <FinalCta />
      <Bring />
    </SiteShell>
  );
}