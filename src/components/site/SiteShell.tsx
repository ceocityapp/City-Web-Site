import { Nav } from "./Nav";
import { Footer } from "./Footer";

/**
 * The chrome every public page shares: the scoped `.ca` environment with its
 * English copy, the skip link, the cursor and the navigation, and the footer.
 *
 * `hasHero` tells the navigation whether this page begins with the pinned hero
 * film — it is the only thing that changes between the landing and the section
 * pages (the navigation must start dense on a page with no hero to float over).
 */
export function SiteShell({
  children,
  hasHero = false,
}: {
  children: React.ReactNode;
  hasHero?: boolean;
}) {
  return (
    <div className="ca flex-1" lang="en">
      {/* Reveals that depend on IntersectionObserver must never be the reason
          content stays invisible. */}
      <noscript>
        <style>{`[data-revealed="false"] .ca-city,[data-revealed="false"] .ca-num,[data-revealed="false"] .ca-net__city{opacity:1!important;filter:none!important;transform:none!important}`}</style>
      </noscript>

      <a className="ca-skip" href="#content">
        Skip to content
      </a>

      <Nav hasHero={hasHero} />

      <main id="content">{children}</main>

      <Footer />
    </div>
  );
}