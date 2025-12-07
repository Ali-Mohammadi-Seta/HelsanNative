/// <reference lib="webworker" />
/* eslint-disable no-undef */
// src/sw.ts
import { clientsClaim } from "workbox-core";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import {
  registerRoute,
  setDefaultHandler,
  NavigationRoute,
} from "workbox-routing";
import { NetworkOnly, CacheFirst } from "workbox-strategies";
import { BackgroundSyncPlugin } from "workbox-background-sync";
import { ExpirationPlugin } from "workbox-expiration";

declare const self: ServiceWorkerGlobalScope & typeof globalThis;

// --- App Shell ---
self.skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST as any);

// --- BG Sync just for certain post requests---
// sending replay after success message
const importantApiQueue = new BackgroundSyncPlugin("important-api-queue", {
  maxRetentionTime: 24 * 60, // دقیقه
  onSync: async ({ queue }) => {
    try {
      await queue.replayRequests(); // اگر همه ok بود
      const all = (await self.clients.matchAll({
        includeUncontrolled: true,
        type: "window",
      })) as WindowClient[];
      all.forEach((c) => c.postMessage({ type: "QUEUE_FLUSHED" }));
    } catch (err) {
      // اگر هنوز خطا داشت (مثلاً CORS)، بعداً دوباره تلاش می‌شود
      const all = (await self.clients.matchAll({
        includeUncontrolled: true,
        type: "window",
      })) as WindowClient[];
      all.forEach((c) => c.postMessage({ type: "QUEUE_RETRY_LATER" }));
      throw err;
    }
  },
});

//just for certain post requests
const isApiPost = ({ url, request }: { url: URL; request: Request }) => {
  if (request.method !== "POST") return false;

  const isProd = url.hostname === "inhso.ir" && url.protocol === "https:";
  const isLocal =
    (url.hostname === "localhost" || url.hostname === "127.0.0.1") &&
    (url.protocol === "http:" || url.protocol === "https:");

  //endpoints should be in queue
  const allowedPath = /^\/api\/user\/(login)$/.test(url.pathname);

  return allowedPath && (isProd || isLocal);
};

registerRoute(
  isApiPost,
  new NetworkOnly({ plugins: [importantApiQueue] }),
  "POST"
);

// --- SPA navigation fallback به index.html ---
const appShellHandler = createHandlerBoundToURL("/index.html");
const denylist = [
  /^\/(api|auth|oauth|graphql|trpc|uploads|files|static|assets|media|storage|content|socket|ws|events|sse|realtime|downloads)\//,
  /^\/v\d+\//,
  /\/(health|metrics)$/,
  /^\/\.well-known\//,
  /^\/[^?]+\.[^/]+$/, //all things is like a file
];
registerRoute(new NavigationRoute(appShellHandler, { denylist }));

// ---cache for static things like fonts , images and etc. ---
registerRoute(
  ({ request }) => ["image", "font"].includes(request.destination),
  new CacheFirst({
    cacheName: "assets-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  })
);

// ---just for network---
setDefaultHandler(new NetworkOnly());

export {};
