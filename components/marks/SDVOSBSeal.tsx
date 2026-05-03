type Props = { className?: string };

export function SDVOSBSeal({ className = "h-16 w-16" }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Service-Disabled Veteran-Owned Small Business"
      fill="none"
      stroke="currentColor"
    >
      {/* Outer ring */}
      <circle cx="50" cy="50" r="48" strokeWidth="1.2" />
      <circle cx="50" cy="50" r="44" strokeWidth="0.6" opacity="0.55" />

      {/* Curved text top */}
      <defs>
        <path
          id="sealTop"
          d="M 12,50 A 38,38 0 0 1 88,50"
        />
        <path
          id="sealBottom"
          d="M 16,52 A 34,34 0 0 0 84,52"
        />
      </defs>
      <text
        fontFamily="ui-monospace, monospace"
        fontSize="6.4"
        letterSpacing="2.4"
        fill="currentColor"
        stroke="none"
      >
        <textPath href="#sealTop" startOffset="50%" textAnchor="middle">
          SERVICE-DISABLED VETERAN-OWNED
        </textPath>
      </text>
      <text
        fontFamily="ui-monospace, monospace"
        fontSize="6.4"
        letterSpacing="2.4"
        fill="currentColor"
        stroke="none"
      >
        <textPath href="#sealBottom" startOffset="50%" textAnchor="middle">
          SMALL · BUSINESS · SDVOSB
        </textPath>
      </text>

      {/* Star */}
      <path
        d="M50 32 L53 42 L63 42 L55 48 L58 58 L50 52 L42 58 L45 48 L37 42 L47 42 Z"
        fill="currentColor"
        stroke="none"
      />
      {/* Chevron */}
      <path
        d="M38 66 L50 74 L62 66"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
