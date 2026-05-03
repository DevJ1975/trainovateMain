/**
 * VimeoEmbed — responsive 16:9 iframe wrapper. Loads lazily.
 * Optionally emits VideoObject JSON-LD for SEO when description +
 * uploadDate are provided.
 */
type Props = {
  videoId: string;
  hash?: string;
  title?: string;
  className?: string;
  description?: string;
  uploadDate?: string; // ISO date — required for VideoObject schema
  duration?: string;   // ISO 8601 duration (e.g. "PT2M30S")
  thumbnailUrl?: string;
};

export function VimeoEmbed({
  videoId,
  hash,
  title = "Video",
  className = "",
  description,
  uploadDate,
  duration,
  thumbnailUrl,
}: Props) {
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

  const videoObject =
    description && uploadDate
      ? {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: title,
          description,
          uploadDate,
          ...(duration ? { duration } : {}),
          embedUrl: src,
          contentUrl: `https://vimeo.com/${videoId}`,
          ...(thumbnailUrl ? { thumbnailUrl } : {}),
          publisher: {
            "@type": "Organization",
            name: "Trainovate Technologies",
          },
        }
      : null;

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
      {videoObject && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoObject) }}
        />
      )}
    </div>
  );
}
