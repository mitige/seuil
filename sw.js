const CACHE_NAME = "seuil-v2.3.110";
const NETWORK_TIMEOUT_MS = 4500;
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=33",
  "./i18n.js?v=52",
  "./boot.js?v=7",
  "./ui.js?v=3",
  "./app.js?v=104",
  "./ai.js?v=8",
  "./auth.js?v=19",
  "./psychonaut-data.js?v=5",
  "./index-substances.js?v=9",
  "./substances-data.js?v=4",
  "./route-model.js?v=15",
  "./db.js?v=14",
  "./favicon.svg",
  "./manifest.webmanifest",
  "./fonts/space-grotesk-latin.woff2",
  "./fonts/space-grotesk-latin-ext.woff2",
  "./fonts/jetbrains-mono-latin.woff2",
  "./fonts/jetbrains-mono-latin-ext.woff2",
  "./mentions-legales.html",
  "./confidentialite.html",
  "./conditions-utilisation.html",
  "./accessibilite.html",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-180.png"
];

function timeoutError() {
  return new Error("network-timeout");
}

function fetchWithTimeout(request, timeoutMs) {
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const fetchOptions = controller ? { signal: controller.signal } : undefined;
  let timer = null;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      if (controller) controller.abort();
      reject(timeoutError());
    }, timeoutMs);
  });

  return Promise.race([
    fetch(request, fetchOptions),
    timeout
  ]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

self.addEventListener("install", (event) => {
  // Met en cache les assets un par un pour qu'un seul échec ne fasse pas tomber l'install.
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(CORE_ASSETS.map(async (url) => {
      try {
        const res = await fetchWithTimeout(new Request(url, { cache: "reload" }), NETWORK_TIMEOUT_MS);
        if (res && res.ok) await cache.put(url, res);
      } catch (_) { /* ignoré */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    // Purger TOUS les caches précédents - pas seulement ceux dont le nom diffère.
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
    // Prendre le contrôle des onglets ouverts. Le rechargement éventuel est géré
    // côté page via controllerchange, pour éviter les doubles navigations.
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  if (new URL(request.url).pathname.startsWith("/api/")) return; // ne jamais cacher le pont IA
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Stratégie network-first pour HTML / JS / CSS : on récupère toujours la dernière version
  // si le réseau est disponible, et on retombe sur le cache hors-ligne uniquement.
  // (les autres ressources gardent une stratégie cache-first pour la rapidité et l'offline)
  const dest = request.destination;
  const isDoc = dest === "document" || url.pathname === "/" || url.pathname.endsWith(".html");
  const isScript = dest === "script" || url.pathname.endsWith(".js") || /\.js\?/.test(url.pathname + url.search);
  const isStyle  = dest === "style"  || url.pathname.endsWith(".css") || /\.css\?/.test(url.pathname + url.search);

  if (isDoc || isScript || isStyle) {
    event.respondWith(
      fetchWithTimeout(request, NETWORK_TIMEOUT_MS).then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      }).catch(async () => (await caches.match(request)) || Response.error())
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetchWithTimeout(request, NETWORK_TIMEOUT_MS).then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      }).catch(async () => (await caches.match(request)) || Response.error());
    })
  );
});
