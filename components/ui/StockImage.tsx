import { BrandPanel } from "./BrandPanel";

type Props = {
  stockKey: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  treatment?: "default" | "cool" | "warm";
  label?: string;
};

/**
 * StockImage now renders a brand-correct SVG panel keyed off the slot name
 * (e.g. "field.manufacturing", "platform.safeguard"). No external image
 * dependencies, no broken Unsplash hot-links, no off-brand colour casts.
 *
 * If we later swap in real licensed photography, this is the only component
 * that needs to change — keep the same prop shape.
 */
export function StockImage({
  stockKey,
  className = "",
  treatment = "default",
  label,
}: Props) {
  return (
    <BrandPanel
      slot={stockKey}
      className={className}
      treatment={treatment}
      label={label}
    />
  );
}
