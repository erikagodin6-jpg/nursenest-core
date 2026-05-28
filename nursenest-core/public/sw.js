/* NurseNest Service Worker — Offline Study Mode
 * Phase 16: Mobile & Offline Study
 * Cache strategy: cache-first for content, network-first for API, stale-while-revalidate for assets
 */

const SW_VERSION = "nursenest-resilience-v1";
const STATIC_CACHE = `${SW_VERSION}-static`;
const CONTENT_CACHE = `${SW_VERSION}-content`;
const API_CACHE = `${SW_VERSION}-api`;

const STATIC_ASSETS = [
  "/",
  "/app/flashcards",
  "/app/practice",
  "/app/lessons",
  "/offline",
];

const CACHEABLE_API_PREFIXES = [
  "/api/flashcards",
  "/api/lessons",
  "/api/questions",
  "/api/clinical-skills",
  "/api/pharmacology",
  "/api/daily-question",
  "/api/cat/pool",
];

const BYPASS_PREFIXES = [
  "/api/auth",
  "/api/billing",
  "/api/stripe",
  "/api/admin",
  "/api/webhook",
];

const MAX_CONTENT_CACHE_SIZE = 200;
const CONTENT_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith("nursenest-") && k !== STATIC_CACHE && k !== CONTENT_CACHE && k !== API_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

function isCacheableApi(url) {
  const path = new URL(url).pathname;
  return CACHEABLE_API_PREFIXES.some((prefix) => path.startsWith(prefix));
}

function isBypassApi(url) {
  const path = new URL(url).pathname;
  return BYPASS_PREFIXES.some((prefix) => path.startsWith(prefix));
}

function isStaticAsset(url) {
  return /\.(js|css|png|jpg|jpeg|svg|ico|woff2|woff|ttf)$/.test(new URL(url).pathname);
}

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxEntries) {
    await Promise.all(keys.slice(0, keys.length - maxEntries).map((k) => cache.delete(k)));
  }
}

async function networkFirstWithFallback(request, cacheName) {
  try {
    const response = await fetch(request.clone());
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
      trimCache(cacheName, MAX_CONTENT_CACHE_SIZE);
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(
      JSON.stringify({ error: "offline", offline: true, cached: false }),
      { status: 503, headers: { "Content-Type": "application/json", "X-Offline-Mode": "true" } }
    );
  }
}

async function cacheFirstWithNetwork(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) {
    fetch(request.clone())
      .then((res) => {
        if (res.ok) caches.open(cacheName).then((c) => c.put(request, res));
      })
      .catch(() => {});
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Offline — content not yet cached", { status: 503, headers: { "X-Offline-Mode": "true" } });
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = request.url;

  if (isBypassApi(url)) return;

  if (isCacheableApi(url)) {
    event.respondWith(networkFirstWithFallback(request, API_CACHE));
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(cacheFirstWithNetwork(request, STATIC_CACHE));
    return;
  }

  if (url.includes("/app/") || url.includes("/lessons/") || url.includes("/flashcards/")) {
    event.respondWith(networkFirstWithFallback(request, CONTENT_CACHE));
    return;
  }
});

// Receive sync messages from the main thread
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
  if (event.data?.type === "CACHE_CONTENT") {
    const { url, payload } = event.data;
    if (url && payload) {
      caches.open(CONTENT_CACHE).then((cache) => {
        cache.put(url, new Response(JSON.stringify(payload), {
          headers: { "Content-Type": "application/json", "X-Cached-At": Date.now().toString() }
        }));
      });
    }
  }
});

// Background sync for queued progress events
self.addEventListener("sync", (event) => {
  if (event.tag === "progress-sync") {
    event.waitUntil(syncProgressQueue());
  }
  if (event.tag === "analytics-flush") {
    event.waitUntil(flushAnalyticsQueue());
  }
});

async function syncProgressQueue() {
  try {
    const clients = await self.clients.matchAll();
    clients.forEach((client) => client.postMessage({ type: "TRIGGER_PROGRESS_SYNC" }));
  } catch {}
}

async function flushAnalyticsQueue() {
  try {
    const clients = await self.clients.matchAll();
    clients.forEach((client) => client.postMessage({ type: "TRIGGER_ANALYTICS_FLUSH" }));
  } catch {}
}
