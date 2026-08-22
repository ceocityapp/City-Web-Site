/**
 * Platform — light, on the soft background.
 *
 * One bordered plane split by hairlines rather than a scatter of floating
 * cards: no per-cell shadow, no per-cell radius, one container.
 *
 * Ten areas plus a closing cell. The count is not arbitrary — with the closing
 * cell spanning two columns the grid divides exactly at both three and two
 * columns, so no row is ever left with a hole in it.
 */
const AREAS: { name: string; blurb: string; id?: string }[] = [
  { name: "Community", blurb: "Neighbourhood groups, associations and clubs." },
  {
    name: "Local businesses",
    blurb: "A page for every shop, bar and workshop in town.",
    id: "businesses",
  },
  { name: "Marketplace", blurb: "Buy and sell locally, without leaving the city." },
  { name: "Classifieds", blurb: "Small ads, lost and found, everything in between." },
  { name: "Events", blurb: "What is on this week, from concerts to council meetings." },
  { name: "Jobs", blurb: "Local vacancies, posted by local employers." },
  { name: "Transport", blurb: "Getting around: lines, times and disruptions." },
  { name: "Debate forums", blurb: "Where the city argues about the city, in the open." },
  { name: "Messaging", blurb: "Direct and group chat between people and pages." },
  { name: "City services", blurb: "The practical layer: notices, contacts, paperwork." },
];

export function Platform() {
  return (
    <section
      className="ca-sec"
      data-tone="light"
      data-surface="paper"
      id="platform"
      aria-labelledby="ca-platform-title"
    >
      <div className="ca-shell">
        <div className="ca-split ca-platform__head">
          <div className="ca-stack">
            <p className="ca-eyebrow">The platform</p>
            <h2 id="ca-platform-title" className="ca-h2">
              Everything a city already does, in one place
            </h2>
          </div>
          <p className="ca-lead">
            Ten areas that work as one product, because in a real city they were
            never separate to begin with.
          </p>
        </div>

        <div className="ca-grid ca-platform__grid">
          {AREAS.map((area, i) => (
            <article className="ca-cell" key={area.name} id={area.id}>
              <span className="ca-index">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="ca-h4 ca-cell__title">{area.name}</h3>
              <p className="ca-body">{area.blurb}</p>
            </article>
          ))}

          <article className="ca-cell ca-cell--accent">
            <span className="ca-index">＋</span>
            <div>
              <h3 className="ca-h4 ca-cell__title">And whatever the city needs next</h3>
              <p className="ca-body">
                Each city runs the same platform, so anything built for one is
                available to all of them.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
