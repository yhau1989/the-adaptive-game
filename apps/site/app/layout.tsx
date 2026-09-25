import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { UIProvider } from "@repo/ui/provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Adaptive Game",
  description:
    "Plataforma web para correr partidas del Beer Distribution Game.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/*
       * `suppressHydrationWarning` en <body>: algunas extensiones del
       * navegador (p.ej. Shortcat, Vimium) añaden atributos como
       * `cz-shortcut-listen="true"` al <body> en el cliente, lo que
       * dispara un warning de hidratación. No controlamos esos atributos,
       * así que silenciamos solo este nodo — el resto del árbol sigue
       * validando SSR ↔ cliente con normalidad.
       */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <UIProvider>{children}</UIProvider>
      </body>
    </html>
  );
}
