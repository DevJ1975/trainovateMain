type Props = {
  index?: string;
  label: string;
  tone?: "signal" | "fog" | "amber";
  className?: string;
};

export function Eyebrow({ index, label, tone = "signal", className = "" }: Props) {
  const color =
    tone === "fog" ? "text-fog" : tone === "amber" ? "text-amber" : "text-signal";
  return (
    <div
      className={`font-mono text-[11px] uppercase tracking-eyebrow flex items-center gap-2 ${color} ${className}`}
    >
      <span aria-hidden="true">[</span>
      {index && <span>{index}</span>}
      {index && <span className="opacity-50">/</span>}
      <span>{label}</span>
      <span aria-hidden="true">]</span>
    </div>
  );
}
