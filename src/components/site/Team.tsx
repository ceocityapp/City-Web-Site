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
    name: "[Founder one]",
    role: "Co-founder & CEO",
    bio: "What brought them here — the city they grew up in, the gap they saw in it, and the conviction that its people were the answer.",
    initials: "FN",
  },
  {
    name: "[Founder two]",
    role: "Co-founder & CTO",
    bio: "The builder behind the platform — the shared network that lets one city's tools become every city's, and the craft of keeping it local.",
    initials: "FN",
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
