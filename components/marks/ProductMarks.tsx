type Props = { className?: string };

const base =
  "stroke-current fill-none stroke-[1.4] [stroke-linecap:round] [stroke-linejoin:round]";

export function MarkSafeguard({ className = "h-6 w-6" }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`}>
      <path d="M12 3l8 3v6c0 4.5-3.4 8.4-8 9-4.6-.6-8-4.5-8-9V6l8-3z" />
      <rect x="9.5" y="11" width="5" height="5" rx="0.6" />
      <path d="M10.5 11V9.5a1.5 1.5 0 013 0V11" />
    </svg>
  );
}

export function MarkField({ className = "h-6 w-6" }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`}>
      <rect x="3" y="3" width="18" height="18" rx="1.5" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </svg>
  );
}

export function MarkLearning({ className = "h-6 w-6" }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 7h6M9 11h6M9 15h4" />
      <circle cx="12" cy="19" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function MarkCopilot({ className = "h-6 w-6" }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`}>
      <path d="M3 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <path d="M12 4v3M12 17v3" />
    </svg>
  );
}
