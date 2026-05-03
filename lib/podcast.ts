/**
 * Podcast metadata + episode list. All fields marked TODO are placeholders
 * Jay needs to confirm before launch — show name, episode titles/summaries,
 * Apple/Spotify/YouTube URLs, and cover art.
 */

export const podcast = {
  name: "Field Signal", // TODO Jay confirms — actual show name
  tagline: "Conversations from the floor of high-risk industries.",
  description:
    "Operator-to-operator interviews on EHS doctrine, training instrumentation, AI co-pilots, and the federal market for veteran-owned small business. Hosted by Jamil 'Jay' Jones.",
  links: {
    apple: "https://podcasts.apple.com/", // TODO Jay confirms
    spotify: "https://open.spotify.com/", // TODO Jay confirms
    youtube: "https://www.youtube.com/", // TODO Jay confirms
    overcast: "https://overcast.fm/", // TODO Jay confirms
    rss: "https://feeds.example.com/field-signal.xml", // TODO Jay confirms
  },
} as const;

export type Episode = {
  number: number;
  slug: string;
  title: string;
  guest?: string;
  date: string;
  duration: string;
  summary: string;
  links: {
    apple?: string;
    spotify?: string;
    youtube?: string;
  };
};

// TODO Jay confirms — replace placeholder episode roster with real episodes
export const episodes: Episode[] = [
  {
    number: 6,
    slug: "ep-006",
    title: "Episode title TBD",
    guest: "Guest TBD",
    date: "2026-04-22",
    duration: "48 min",
    summary:
      "Placeholder summary — replace with the actual episode description, talking points, and call-out to any cited frameworks.",
    links: {},
  },
  {
    number: 5,
    slug: "ep-005",
    title: "Episode title TBD",
    guest: "Guest TBD",
    date: "2026-04-08",
    duration: "52 min",
    summary: "Placeholder summary.",
    links: {},
  },
  {
    number: 4,
    slug: "ep-004",
    title: "Episode title TBD",
    guest: "Guest TBD",
    date: "2026-03-25",
    duration: "41 min",
    summary: "Placeholder summary.",
    links: {},
  },
  {
    number: 3,
    slug: "ep-003",
    title: "Episode title TBD",
    guest: "Guest TBD",
    date: "2026-03-11",
    duration: "55 min",
    summary: "Placeholder summary.",
    links: {},
  },
  {
    number: 2,
    slug: "ep-002",
    title: "Episode title TBD",
    guest: "Guest TBD",
    date: "2026-02-26",
    duration: "47 min",
    summary: "Placeholder summary.",
    links: {},
  },
  {
    number: 1,
    slug: "ep-001",
    title: "Episode title TBD — pilot",
    guest: "Guest TBD",
    date: "2026-02-12",
    duration: "39 min",
    summary: "Pilot episode placeholder.",
    links: {},
  },
];
