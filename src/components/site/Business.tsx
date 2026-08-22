import Link from "next/link";
import { Reveal } from "./Reveal";
import { SiteVideo } from "./SiteVideo";

/**
 * For local businesses — light.
 *
 * Positioned as part of the ecosystem rather than as an advertising product:
 * the promise is visibility among neighbours, not impressions. The video sits
 * on the left as a tall panel so the section reads as one composition instead
 * of a copy block with a picture stuck beside it.
 */
const POINTS = [
  {
    n: 1,
    title: "Be found by the people nearby",
    body: "A page in the city's own directory, seen by the people who walk past your door.",
  },
  {
    n: 2,
    title: "Reach your actual catchment",
    body: "Post to the neighbourhoods you serve, rather than to an audience scattered across a country.",
  },
  {
    n: 3,
    title: "Build the relationship, not the funnel",
    body: "Answer questions, share what's new, and keep the regulars who already know your name.",
  },
];

export function Business() {
  return (
    <section
      className="ca-sec"
      data-tone="light"
      id="business"
      aria-labelledby="ca-business-title"
    >
      <div className="ca-shell">
        <div className="ca-biz">
          <SiteVideo
            className="ca-biz__media"
            src="/media/site/commerce.mp4"
            srcSmall="/media/site/commerce-sm.mp4"
            poster="/media/site/commerce-poster.jpg"
          />

          <Reveal className="ca-biz__copy">
            <p className="ca-eyebrow">For local businesses</p>

            <h2 id="ca-business-title" className="ca-h2 ca-biz__title">
              Connect with the people who make your city
            </h2>

            <p className="ca-lead">
              Every shop, bar and workshop already has a community around it.
              City App gives it somewhere to happen.
            </p>

            <ol className="ca-points">
              {POINTS.map((point) => (
                <li className="ca-point" key={point.title}>
                  <span className="ca-num ca-point__num">
                    {String(point.n).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="ca-h4">{point.title}</h3>
                    <p className="ca-body">{point.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <Link className="ca-btn ca-btn--primary" href="/#bring">
              List your business
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
