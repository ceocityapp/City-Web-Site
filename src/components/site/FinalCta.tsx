import Link from "next/link";

/**
 * Final CTA — light.
 *
 * The conversion block: centred, spacious, and stripped to four elements.
 * No card, no border, no panel — the whitespace does the framing.
 *
 * The closing argument of the whole page: a smart city is not its technology,
 * it is the people who live in it. The primary action hands the visitor the
 * petition that was scaffolded just below.
 */
export function FinalCta() {
  return (
    <section
      className="ca-sec"
      data-tone="light"
      data-surface="paper"
      id="access"
      aria-labelledby="ca-cta-title"
    >
      <div className="ca-shell">
        <div className="ca-stack ca-stack--center ca-cta">
          <p className="ca-eyebrow">Your city</p>

          <h2 id="ca-cta-title" className="ca-h2 ca-measure">
            What makes a city smart is the people who live in it
          </h2>

          <p className="ca-lead ca-measure--narrow">
            City App is a new way to connect locally — every community, shop,
            event and service in one place, owned by the people who call your
            city home. It is a new base for the civic economy, and it starts in
            your hands.
          </p>

          <div className="ca-actions ca-cta__actions">
            <Link className="ca-btn ca-btn--primary ca-btn--lg" href="/#bring">
              Bring City App to your city
            </Link>
            <a
              className="ca-btn ca-btn--outline ca-btn--lg"
              href="https://huesca.city"
              target="_blank"
              rel="noreferrer"
            >
              See it live in Huesca
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
