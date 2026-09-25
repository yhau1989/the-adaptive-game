import type { NextConfig } from "next";

/**
 * Next.js 16 config for The Adaptive Game (apps/site).
 *
 * Notas Node 26 / Next 16:
 * - El runtime por defecto ahora es Node (no Edge). `proxy.ts` se ejecuta en
 *   Node 26 con las Fetch APIs estándar (`globalThis.fetch`, `Request`,
 *   `Response`) — ya no hace falta polyfill de `undici`.
 * - `experimental.serverActions` ya no existe: Server Actions son estables
 *   en Next 16 y se habilitan por defecto al usar `"use server"`.
 * - `serverComponentsExternalPackages` se sustituye por `serverExternalPackages`.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Server Components: paquetes que deben cargarse como require() nativo.
  serverExternalPackages: ["postgres", "pg", "bcryptjs"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
  // typedRoutes ya es estable en Next 16; lo dejamos apagado hasta que
  // el equipo lo pida explícitamente.
  typedRoutes: false,
  // Compatibilidad explícita con Node 26 al desplegar en Vercel/CI.
  env: {
    NEXT_RUNTIME_NODE_VERSION: process.versions.node,
  },
};

export default nextConfig;
