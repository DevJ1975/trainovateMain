/* Trainovate near-miss service worker.
 *
 * Phase 1 scope: install + activate so the site is treated as a PWA on iOS
 * and chromium browsers. Caching is intentionally minimal — full offline
 * submit (queue in IndexedDB, replay on reconnect) is a fast follow.
 */

const CACHE = "nm-shell-v1";
const SHELL = ["/report", "/report/status"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // Best-effort: pre-cache the report shells; ignore failures (e.g. dev
      // server not yet warm).
      await Promise.allSettled(SHELL.map((u) => cache.add(u)));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Network-first for HTML navigations to /report so updates land fast,
  // falling back to cached shell if the user is offline.
  if (req.mode === "navigate" && SHELL.includes(url.pathname)) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          return cached ?? new Response("Offline", { status: 503 });
        }),
    );
  }
});
