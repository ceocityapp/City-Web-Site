/**
 * Brand marks.
 *
 * Both are rebuilt as inline SVG rather than image files so they can take the
 * brand gradient from CSS custom properties, stay crisp at any size, and cost
 * no extra request. If you want the originals byte-for-byte instead, drop them
 * in and swap the two components — nothing else references the geometry.
 */

/**
 * The City App mark: a hub with three linked nodes. No container, no plate —
 * the glyph is the logo.
 */
export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg
      className="ca-mark"
      width={size}
      height={size}
      viewBox="0 0 104 104"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ca-mark-grad" x1="8" y1="96" x2="96" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--ca-green-vivid, #2ee86f)" />
          <stop offset="1" stopColor="var(--ca-green-spring, #00e5a0)" />
        </linearGradient>
      </defs>
      <g stroke="url(#ca-mark-grad)" strokeWidth="15" strokeLinecap="round">
        <path d="M22 57 L52 52" />
        <path d="M52 52 L80 23" />
        <path d="M52 52 L76 83" />
      </g>
      <g fill="url(#ca-mark-grad)">
        <circle cx="20" cy="57" r="18" />
        <circle cx="52" cy="52" r="14" />
        <circle cx="80" cy="22" r="16" />
        <circle cx="76" cy="84" r="15" />
      </g>
    </svg>
  );
}

/** Mark plus the name, as used in the navigation and the footer. */
export function Wordmark({ size = 28 }: { size?: number }) {
  return (
    <>
      <Mark size={size} />
      <span className="ca-wordmark">City App</span>
    </>
  );
}

/**
 * The Huesca City mark — the tower-and-arch "h" from the app icon, on the
 * lime-to-teal gradient. Drawn as two overlapping shapes sharing one
 * user-space gradient, with the tower window knocked out by a mask.
 */
export function HuescaMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="ca-huesca-grad"
          x1="110"
          y1="60"
          x2="420"
          y2="450"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#9bdf33" />
          <stop offset="0.5" stopColor="#35d96b" />
          <stop offset="1" stopColor="#00d4b4" />
        </linearGradient>
        <mask id="ca-huesca-window">
          <rect width="512" height="512" fill="#fff" />
          {/* arched tower window */}
          <path
            d="M132 200 Q132 208 140 208 L168 208 Q176 208 176 200 L176 167 A22 22 0 0 0 132 167 Z"
            fill="#000"
          />
        </mask>
      </defs>

      <g fill="url(#ca-huesca-grad)" mask="url(#ca-huesca-window)">
        {/* tower: stem with a pitched roof */}
        <path d="M96 380 L96 120 L147 51 Q154 44 161 51 L212 120 L212 380 Z" />
        {/*
          Shoulder arch and right leg, counter open to the baseline.

          Concentric arcs about (268, 372): the counter springs tangent to the
          stem's right edge at r=56, the outer shoulder at r=148. The 92-unit
          difference is the leg's width — narrower than the 116 tower, which is
          what stops the glyph looking bottom-heavy.
        */}
        <path
          d="M120 372
             A148 148 0 0 1 416 372
             L416 438 Q416 452 402 452
             L338 452 Q324 452 324 438
             L324 372
             A56 56 0 0 0 212 372
             L212 438 Q212 452 198 452
             L110 452 Q96 452 96 438
             L96 372
             Z"
        />
      </g>
    </svg>
  );
}
