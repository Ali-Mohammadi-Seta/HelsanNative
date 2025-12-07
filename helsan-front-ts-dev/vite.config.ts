/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import i18n from "./src/i18n";

const manifest: any = {
  name: i18n.t("logoTitle"),
  short_name: i18n.t("logoTitle"),
  id: "/",
  start_url: "/?source=pwa",
  scope: "/",
  display: "standalone",
  background_color: "#ffffff",
  theme_color: "#0f172a",
  orientation: "portrait",
  launch_handler: { client_mode: "navigate-existing" },
  capture_links: "existing-client-navigate",
  icons: [
    { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icons/icon-256.png", sizes: "256x256", type: "image/png" },
    { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    {
      src: "/icons/icon-512-maskable.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable any",
    },
  ],
};

export default defineConfig({
  // @ts-ignore - Vitest types conflict with Vite plugin types
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts", // فایل SW که می‌نویسیم
      injectRegister: "auto",
      registerType: "autoUpdate",
      includeAssets: ["icons/*", "favicon.svg"],
      manifest,
      devOptions: { enabled: false },
      injectManifest: {
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
      workbox: {
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [
          /^\/(api|auth|oauth|graphql|trpc|uploads|files|static|assets|media|storage|content|socket|ws|events|sse|realtime|downloads)\//,
          /^\/v\d+\//,
          /\/(health|metrics)$/,
          /^\/\.well-known\//,
          /^\/[^?]+\.[^/]+$/,
        ],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
  ],
  resolve: { alias: { "@": "/src" } },
  build: { outDir: "build" },
  server: {
    port: 3000,
    allowedHosts: [
      "farnood.helsan.pic",
      "sobuhi.helsan.pic",
      "zahra.helsan.pic",
    ],
  },
  // @ts-ignore - Vitest config is not recognized by Vite types but works at runtime
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/mockData/**",
      ],
    },
  },
} as any);
