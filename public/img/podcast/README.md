# Podcast assets

Drop the cover art image at:

    operational-minds.jpg

referenced from `lib/podcast.ts` -> `coverArt: "/img/podcast/operational-minds.jpg"`.

Recommended size: 3000×3000 (Apple Podcasts requires 3000×3000 minimum,
1400×1400 minimum for Spotify; use the largest you have). JPEG or PNG.

The page (`/podcast`) renders the image with `next/image`, which will
serve optimized AVIF/WebP variants at runtime.
