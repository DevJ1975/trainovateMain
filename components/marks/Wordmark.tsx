type Props = { className?: string };

export function Wordmark({ className = "h-6" }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 40"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Trainovate"
      fill="currentColor"
    >
      {/* T with hex notch */}
      <path d="M0 4h36v6H22v30h-8V10H0V4z" />
      <path d="M36 4h-4l-4 6h8V4z" opacity="0.55" />

      {/* RAINOVATE — geometric, slightly condensed */}
      <text
        x="42"
        y="32"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="32"
        fontWeight="600"
        letterSpacing="-1.2"
      >
        rainovate
      </text>
    </svg>
  );
}
