import { Reveal } from "./Reveal";

/**
 * Team — light.
 *
 * The people behind the platform. Two founders to start; the grid grows as the
 * company does. Avatars are initial-marked circles, so a card is complete the
 * moment a name exists — there is no photo that can go stale.
 *
 * NOTE: names, roles and bios below are placeholders. Replace them with the
 * real team before the site goes to a program.
 */
const TEAM = [
  {
    name: "Jack de la Figuera",
    role: "Co-founder & CEO",
    bio: "At 18, Jack came up with the idea of a local connection that weaves a city's utilities and its social media into one shared network. A visionary and a risk-taker, he is the action-taker who turns the idea into momentum.",
    initials: "JF",
  },
  {
    name: "Tom de la Figuera",
    role: "Co-founder & CFA",
    bio: "At 22, Tom is the decision-evaluator behind the platform — owning finance and legal, and thinking short-term to keep every move sharp, measured and accountable.",
    initials: "TF",
  },
];

export function Team() {
  return (
    <section className="ca-sec" data-tone="light" id="team" aria-labelledby="ca-team-title">
      <div className="ca-shell">
        <div className="ca-split ca-platform__head">
          <div className="ca-stack">
            <p className="ca-eyebrow">The team</p>
            <h2 id="ca-team-title" className="ca-h2">
              Built by people who believe a city is its people
            </h2>
          </div>
          <p className="ca-lead">
            A small team with deep roots in the places we build for — and the
            patience to go one city at a time.
          </p>
        </div>

        <Reveal className="ca-team">
          {TEAM.map((member) => (
            <article className="ca-team__card" key={member.name}>
              <span className="ca-team__avatar" aria-hidden="true">
                {member.initials}
              </span>
              <h3 className="ca-h4 ca-team__name">{member.name}</h3>
              <p className="ca-small ca-team__role">{member.role}</p>
              <p className="ca-body ca-team__bio">{member.bio}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
