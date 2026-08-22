/**
 * Opportunity — light, on the soft background.
 *
 * The market and the model, laid out on the same bordered plane as the
 * platform grid so both read as parts of one argument: the opportunity is not
 * a feature, it is the structure of the local economy itself. The final cell
 * carries the green surface — the one moment on the page where the model is
 * stated plainly.
 */
export function Opportunity() {
  return (
    <section
      className="ca-sec"
      data-tone="light"
      data-surface="paper"
      id="opportunity"
      aria-labelledby="ca-opportunity-title"
    >
      <div className="ca-shell">
        <div className="ca-split ca-platform__head">
          <div className="ca-stack">
            <p className="ca-eyebrow">The opportunity</p>
            <h2 id="ca-opportunity-title" className="ca-h2">
              The civic economy is missing its local layer
            </h2>
          </div>
          <p className="ca-lead">
            For two decades the internet pulled local economies into global
            marketplaces. City App gives them a home again — infrastructure
            that a city runs for itself.
          </p>
        </div>

        <div className="ca-grid ca-opportunity__grid">
          <article className="ca-cell">
            <span className="ca-index">01</span>
            <h3 className="ca-h4 ca-cell__title">A market of 8,000+ cities</h3>
            <p className="ca-body">
              Spain alone has more than 8,000 municipalities, each with its own
              businesses, communities and rules — and nearly all of them
              underserved by the platforms built for capital cities.
            </p>
          </article>

          <article className="ca-cell">
            <span className="ca-index">02</span>
            <h3 className="ca-h4 ca-cell__title">Local commerce is being hollowed out</h3>
            <p className="ca-body">
              Global platforms take the transaction but not the place. A city
              loses the link between a purchase and the street it happens on —
              and with it, part of its tax base, its jobs and its identity.
            </p>
          </article>

          <article className="ca-cell">
            <span className="ca-index">03</span>
            <h3 className="ca-h4 ca-cell__title">Infrastructure the city owns</h3>
            <p className="ca-body">
              Each city runs its own app on one shared platform, with its own
              communities, businesses and rules. Anything built for one city is
              ready for the next.
            </p>
          </article>

          <article className="ca-cell ca-cell--accent">
            <span className="ca-index">＋</span>
            <div>
              <h3 className="ca-h4 ca-cell__title">How City App earns</h3>
              <p className="ca-body">
                The model is aligned with the city&apos;s growth. Businesses get the
                tools to reach the neighbours who already shop there, and the
                platform takes a small share of the local transactions it
                enables. When the local economy grows, City App grows with it.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
