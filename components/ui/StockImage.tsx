import Image from "next/image";
import { getStock } from "@/lib/stock";

type Props = {
  stockKey: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  /** Override the default treatment (e.g. for the federal hero) */
  treatment?: "default" | "cool" | "warm";
};

export function StockImage({
  stockKey,
  className = "",
  imgClassName = "",
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  fill = true,
  width,
  height,
  treatment = "default",
}: Props) {
  const img = getStock(stockKey);
  if (!img || !img.url) {
    return (
      <div
        className={`relative bg-carbon grid-noise ${className}`}
        aria-label={img?.alt ?? "Image placeholder"}
      >
        <div className="absolute inset-0 flex items-center justify-center text-fog font-mono text-[10px] uppercase tracking-eyebrow">
          Photo · TODO
        </div>
      </div>
    );
  }

  const tone =
    treatment === "cool"
      ? "after:bg-[linear-gradient(135deg,rgba(10,37,64,0.55),transparent_60%)]"
      : treatment === "warm"
      ? "after:bg-[linear-gradient(135deg,rgba(255,181,71,0.18),transparent_60%)]"
      : "";

  return (
    <div className={`tnv-photo ${className} ${tone}`}>
      <Image
        src={img.url}
        alt={img.alt}
        sizes={sizes}
        priority={priority}
        fill={fill && !width}
        width={width}
        height={height}
        className={`object-cover ${imgClassName}`}
      />
    </div>
  );
}
