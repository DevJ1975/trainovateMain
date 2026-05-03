/**
 * VimeoEmbed — responsive 16:9 iframe wrapper. Loads lazily.
 */
type Props = {
  videoId: string;
  hash?: string;
  title?: string;
  className?: string;
};

export function VimeoEmbed({ videoId, hash, title = "Video", className = "" }: Props) {
  const params = new URLSearchParams({
    title: "0",
    byline: "0",
    portrait: "0",
    badge: "0",
    autopause: "0",
    player_id: "0",
    app_id: "58479",
  });
  if (hash) params.set("h", hash);
  const src = `https://player.vimeo.com/video/${videoId}?${params.toString()}`;

  return (
    <div className={`relative w-full overflow-hidden bg-ink-soft ${className}`} style={{ aspectRatio: "16 / 9" }}>
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 w-full h-full"
        loading="lazy"
        frameBorder={0}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
