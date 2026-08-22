import Link from "next/link";
import { HuescaMark } from "./Mark";
import { Reveal } from "./Reveal";

/**
 * Cities — dark.
 *
 * Not a roadmap and not a list. One field in which every city is a node of the
 * same network: two of them are lit because they are real, and the rest drift
 * around the statement at the sizes and opacities of a depth-of-field.
 *
 * The drift is pure CSS — each name gets its own duration, delay and direction
 * from inline custom properties, so twenty elements animate on the compositor
 * with no JavaScript running at all after first paint.
 *
 * Below the live rail the section states the goal in plain words, then the
 * horizon arrives as the cityfield: the four capitals at size, the long tail
 * of smaller cities blurring in behind them.
 */

type Drift = {
  name: string;
  /** percentage position within the field */
  x: number;
  y: number;
  /** 0 = furthest back and faintest, 2 = nearest and brightest */
  depth: 0 | 1 | 2;
};

const FIELD: Drift[] = [
  { name: "Barcelona", x: 8, y: 16, depth: 2 },
  { name: "Madrid", x: 74, y: 10, depth: 2 },
  { name: "Valencia", x: 20, y: 78, depth: 2 },
  { name: "Sevilla", x: 80, y: 72, depth: 2 },
  { name: "Bilbao", x: 46, y: 6, depth: 1 },
  { name: "Málaga", x: 4, y: 46, depth: 1 },
  { name: "Granada", x: 90, y: 40, depth: 1 },
  { name: "Pamplona", x: 30, y: 30, depth: 1 },
  { name: "Alicante", x: 64, y: 88, depth: 1 },
  { name: "Santander", x: 14, y: 62, depth: 0 },
  { name: "Tarragona", x: 88, y: 22, depth: 0 },
  { name: "Girona", x: 40, y: 92, depth: 0 },
  { name: "Logroño", x: 60, y: 24, depth: 0 },
  { name: "Cádiz", x: 24, y: 44, depth: 0 },
  { name: "Burgos", x: 70, y: 58, depth: 0 },
  { name: "Salamanca", x: 6, y: 88, depth: 0 },
  { name: "Teruel", x: 52, y: 70, depth: 0 },
  { name: "A Coruña", x: 94, y: 86, depth: 0 },
  { name: "Toledo", x: 36, y: 54, depth: 0 },
  { name: "Jaca", x: 78, y: 50, depth: 0 },
];

/** Arrive slowly, at display size. */
const MAJOR = ["Barcelona", "Madrid", "Valencia", "Sevilla"];

/** The long tail — smaller type, quicker arrivals. */
const MINOR = [
  "Bilbao",
  "Pamplona",
  "Tarragona",
  "Cádiz",
  "Málaga",
  "Granada",
  "Logroño",
  "Lleida",
  "Girona",
  "Santander",
  "Vitoria",
  "Burgos",
  "Salamanca",
  "Murcia",
  "Alicante",
  "Valladolid",
  "Córdoba",
  "Gijón",
  "A Coruña",
  "Toledo",
  "Teruel",
  "Jaca",
];

export function CityNetwork() {
  return (
    <section className="ca-sec ca-net" data-tone="dark" id="cities" aria-labelledby="ca-net-title">
      <div className="ca-shell">
        <Reveal className="ca-net__field">
          {/* The drifting network. Decorative: the same names are listed in the
              live/next rail below, so nothing here is the only copy of a fact. */}
          <div className="ca-net__drift" aria-hidden="true">
            {FIELD.map((city, i) => (
              <span
                className="ca-net__city"
                key={city.name}
                data-depth={city.depth}
                style={
                  {
                    "--ca-nx": `${city.x}%`,
                    "--ca-ny": `${city.y}%`,
                    "--ca-dur": `${18 + (i % 7) * 4}s`,
                    "--ca-delay": `${-(i * 1.7)}s`,
                    "--ca-swing": i % 2 === 0 ? "1" : "-1",
                  } as React.CSSProperties
                }
              >
                {city.name}
              </span>
            ))}
          </div>

          <div className="ca-net__core">
            <p className="ca-eyebrow">Every city</p>
            <h2 id="ca-net-title" className="ca-display ca-net__title">
              One platform.
              <br />
              Every city.
            </h2>
            <p className="ca-lead ca-measure--narrow ca-net__lead">
              Each city runs its own app, with its own communities, businesses
              and rules — all on one network, so anything built for one city is
              ready for the next.
            </p>
          </div>
        </Reveal>

        <div className="ca-net__live">
          <a className="ca-node ca-node--live" href="https://huesca.city" target="_blank" rel="noreferrer">
            <HuescaMark size={36} />
            <span className="ca-node__body">
              <span className="ca-node__status">
                <span className="ca-node__dot" aria-hidden="true" />
                Live now
              </span>
              <span className="ca-node__city">
                Huesca
                <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
                  <path
                    d="M4 10L10 4M10 4H5M10 4V9"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="ca-small">huesca.city</span>
            </span>
          </a>

          <div className="ca-node">
            <span className="ca-node__body">
              <span className="ca-node__status">
                <span className="ca-node__dot" data-state="building" aria-hidden="true" />
                In development
              </span>
              <span className="ca-node__city">Zaragoza</span>
              <span className="ca-small">Opening next on the same platform</span>
            </span>
          </div>

          <div className="ca-node ca-node--open">
            <span className="ca-node__body">
              <span className="ca-node__status">
                <span className="ca-node__dot" data-state="next" aria-hidden="true" />
                Open
              </span>
              <span className="ca-node__city">Your city</span>
              <Link className="ca-btn ca-btn--quiet ca-node__cta" href="/#bring">
                Bring City App here
              </Link>
            </span>
          </div>
        </div>

        <Reveal className="ca-net__goal">
          <p className="ca-h3">
            Our goal is that every European city, town and community is
            connected through our network — built on European values of
            openness, locality and shared ownership.
          </p>
        </Reveal>

        <Reveal className="ca-cityfield">
          <p className="ca-cityfield__label">On the horizon</p>

          <p className="ca-cityfield__major">
            {MAJOR.map((city, i) => (
              <span
                className="ca-city"
                data-tier="major"
                key={city}
                style={{ "--ca-delay": `${i * 260}ms` } as React.CSSProperties}
              >
                {city}
              </span>
            ))}
          </p>

          <p className="ca-cityfield__minor">
            {MINOR.map((city, i) => (
              <span
                className="ca-city"
                data-tier="minor"
                key={city}
                style={{ "--ca-delay": `${900 + i * 55}ms` } as React.CSSProperties}
              >
                {city}
              </span>
            ))}
            <span
              className="ca-city ca-city--more"
              data-tier="minor"
              style={{ "--ca-delay": `${900 + MINOR.length * 55}ms` } as React.CSSProperties}
            >
              and many more
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}