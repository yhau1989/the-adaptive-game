"use client";

// ConfigProvider global para apps/site (AGENTS.md §8).
// Marca "use client" porque antd inyecta estilos en runtime con cssinjs y
// ConfigProvider usa contexto de React. Lo envolvemos en layout.tsx.

import type { ReactNode } from "react";
import { ConfigProvider, App as AntApp } from "antd";
import esES from "antd/locale/es_ES";
import { antdTheme } from "./theme";

type UIProviderProps = {
  children: ReactNode;
};

export function UIProvider({ children }: UIProviderProps) {
  return (
    <ConfigProvider theme={antdTheme} locale={esES}>
      <AntApp message={{ maxCount: 3 }}>{children}</AntApp>
    </ConfigProvider>
  );
}
