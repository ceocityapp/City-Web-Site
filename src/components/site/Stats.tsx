import { Reveal } from "./Reveal";

/**
 * Stats — dark, sitting directly under the city network on the same plane.
 *
 * The argument the numbers make: local connection is not a nice-to-have on top
 * of a city's economy, it is the thing the economy is made of, and it
 * compounds. Two of these are statements of fact, one is deliberately the
 * infinity sign rather than a projection, and the last states the principle of
 * local ownership rather than printing a metric before there are real numbers
 * to cite.
 */
const STATS = [
  { value: "∞", label: "Compounding local growth", note: "the base of the economy" },
  { value: "1", label: "City live today", note: "Huesca" },
  { value: "8,000+", label: "Municipalities in Spain", note: "the addressable map" },
  { value: "100%", label: "Run by its people", note: "each city runs its own app" },
];

export function Stats() {
  return (
    <section
      className="ca-sec ca-sec--tight"
      data-tone="dark"
      data-surface="raised"
      id="growth"
      aria-labelledby="ca-stats-title"
    >
      <div className="ca-shell">
        <div className="ca-split ca-cities__head">
          <div className="ca-stack">
            <p className="ca-eyebrow">Why it compounds</p>
            <h2 id="ca-stats-title" className="ca-h2">
              Local connection is the base of the economy
            </h2>
          </div>
          <p className="ca-lead">
            Cities do not grow from the top down. They compound — neighbour by
            neighbour, shop by shop, community by community.
          </p>
        </div>

        <Reveal className="ca-stats">
          {STATS.map((stat) => (
            <div className="ca-stat" key={stat.label}>
              <span className="ca-num ca-stat__value">{stat.value}</span>
              <span className="ca-stat__label">{stat.label}</span>
              <span className="ca-stat__note">{stat.note}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
