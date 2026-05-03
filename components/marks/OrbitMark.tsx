type Props = { className?: string };

/**
 * Trainovate.ai orbit mark — twin-orbit / atomic symbol.
 * Uses currentColor so it inherits the surrounding text colour.
 */
export function OrbitMark({ className = "h-6 w-6" }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Trainovate.ai mark"
    >
      <ellipse
        cx="50"
        cy="50"
        rx="46"
        ry="20"
        transform="rotate(35 50 50)"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <ellipse
        cx="50"
        cy="50"
        rx="46"
        ry="20"
        transform="rotate(-35 50 50)"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx="50" cy="50" r="8" fill="currentColor" />
    </svg>
  );
}
