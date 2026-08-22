import Link from "next/link";

/**
 * Vision — dark.
 *
 * The belief at the centre of the company, set at display size on its own
 * dark plane. Deliberately empty of product: this is the "why", standing
 * between the film of a real city and the machinery of the platform, so the
 * argument reads why → what, never the other way round.
 */
export function Vision() {
  return (
    <section
      className="ca-sec ca-sec--tight"
      data-tone="dark"
      id="vision"
      aria-labelledby="ca-vision-title"
    >
      <div className="ca-shell">
        <div className="ca-stack ca-stack--center ca-vision">
          <p className="ca-eyebrow">The vision</p>

          <h2 id="ca-vision-title" className="ca-display ca-measure ca-vision__title">
            The smartest cities aren&apos;t the most technological.
            <br />
            <span className="ca-vision__accent">They&apos;re the most connected.</span>
          </h2>

          <p className="ca-lead ca-measure--narrow">
            A city is its streets, its shops, its clubs and its neighbours.
            Most &quot;smart city&quot; projects begin with sensors and dashboards. We
            begin with the people, and the connections between them — and let
            technology do the one thing it is good at: making those connections
            effortless.
          </p>

          <Link className="ca-btn ca-btn--outline" href="/#platform">
            See how it works
          </Link>
        </div>
      </div>
    </section>
  );
}
