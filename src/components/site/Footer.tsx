import Link from "next/link";
import { Wordmark } from "./Mark";

/**
 * Footer — dark, and the page's last visual beat.
 *
 * An enormous "City App" is set behind the content and deliberately allowed to
 * run past both edges of the viewport. It is not readable copy and is hidden
 * from assistive tech; it exists so the page ends on the name at architectural
 * scale rather than on a list of links.
 */
const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Platform",
    links: [
      { label: "Overview", href: "/platform" },
      { label: "For businesses", href: "/#business" },
      { label: "The vision", href: "/vision" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Cities", href: "/cities" },
      { label: "The opportunity", href: "/#opportunity" },
      { label: "Team", href: "/team" },
      { label: "Contact", href: "/#bring" },
    ],
  },
  {
    heading: "Cities",
    links: [
      { label: "Huesca", href: "https://huesca.city" },
      { label: "Zaragoza", href: "/#cities" },
      { label: "Bring your city", href: "/#bring" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="ca-sec ca-foot" data-tone="dark" data-surface="raised">
      <div className="ca-shell ca-foot__inner">
        <div className="ca-foot__top">
          <div className="ca-foot__brand">
            <span className="ca-nav__brand">
              <Wordmark size={34} />
            </span>
            <p className="ca-body ca-measure--narrow">
              The community platform for smarter European cities.
            </p>
          </div>

          <div className="ca-foot__cols">
            {COLUMNS.map((col) => (
              <div className="ca-footer__col" key={col.heading}>
                <h2 className="ca-footer__heading">{col.heading}</h2>
                <ul>
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("http") ? (
                        <a
                          className="ca-link"
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link className="ca-link" href={link.href}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="ca-footer__bottom">
          <p className="ca-small">
            © {new Date().getFullYear()} <strong>Smart City App, S.L.</strong> — Huesca, Spain
          </p>
          <div className="ca-footer__legal">
            <Link className="ca-link" href="/privacy">
              Privacy
            </Link>
            <Link className="ca-link" href="/terms">
              Terms
            </Link>
            <Link className="ca-link" href="/#bring">
              Contact
            </Link>
          </div>
        </div>
      </div>

      <div className="ca-foot__giant" aria-hidden="true">
        <span>City App</span>
      </div>
    </footer>
  );
}
