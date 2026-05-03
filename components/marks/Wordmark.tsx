import { OrbitMark } from "./OrbitMark";

type Props = {
  className?: string;
  /** When false, renders only the wordmark text (no orbit). */
  showMark?: boolean;
};

/**
 * Trainovate.ai logo — orbit mark + wordmark.
 *
 * The size scales with font-size, so callers control sizing via Tailwind
 * text-* classes (e.g. text-xl, text-2xl). The orbit mark inherits
 * currentColor; the ".ai" suffix is rendered at medium weight, 60% opacity,
 * matching the original Trainovate.ai intro treatment.
 */
export function Wordmark({ className = "", showMark = true }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-[0.45em] whitespace-nowrap leading-none ${className}`}
      aria-label="Trainovate.ai"
    >
      {showMark && (
        <OrbitMark className="h-[1.05em] w-[1.4em] flex-shrink-0" />
      )}
      <span className="font-display font-bold tracking-[-0.025em]">
        Trainovate<span className="font-medium opacity-60">.ai</span>
      </span>
    </span>
  );
}
