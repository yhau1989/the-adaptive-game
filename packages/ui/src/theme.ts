// Tema de Ant Design para @repo/ui.
// Los tokens se derivan de la paleta violet + tipografía Geist que ya viven
// en apps/site/app/globals.css, para no perder el look actual (AGENTS.md §8).

import type { ThemeConfig } from "antd";

/**
 * Tokens base. Ant Design v6 los interpreta en HSL/RGB/HEX; los hex de abajo
 * se alinean con las clases `violet-*` y `red-*` que la app ya usa, de modo
 * que el resto del CSS basado en Tailwind siga haciendo juego.
 */
export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: "#7c3aed", // violet-600 (CTAs, foco)
    colorInfo: "#7c3aed",
    colorSuccess: "#10b981", // emerald-500
    colorWarning: "#f59e0b", // amber-500
    colorError: "#ef4444", // red-500
    colorTextBase: "#0f172a", // slate-900 (--foreground)
    colorBgBase: "#ffffff", // --background
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",
    colorBgLayout: "#f8fafc", // slate-50
    colorBorder: "#e4e4e7", // zinc-200
    colorBorderSecondary: "#f4f4f5", // zinc-100
    borderRadius: 10, // ≈ --radius (0.625rem)
    borderRadiusLG: 14,
    borderRadiusSM: 6,
    fontFamily:
      'var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
    controlHeight: 36, // ≈ h-9 (Input por defecto)
    controlHeightLG: 44,
    controlHeightSM: 32,
    wireframe: false,
  },
  components: {
    Button: {
      controlHeight: 36,
      controlHeightLG: 44,
      controlHeightSM: 32,
      fontWeight: 600,
      defaultBg: "#7c3aed",
      defaultColor: "#ffffff",
      defaultHoverBg: "#6d28d9", // violet-700
      defaultHoverColor: "#ffffff",
      primaryShadow: "none",
      defaultShadow: "none",
    },
    Input: {
      controlHeight: 36,
      activeShadow: "0 0 0 3px rgb(124 58 237 / 0.15)",
      hoverBorderColor: "#a78bfa", // violet-400
    },
    Card: {
      borderRadiusLG: 14,
      paddingLG: 24,
    },
    Select: {
      controlHeight: 36,
    },
    Form: {
      itemMarginBottom: 16,
      verticalLabelPadding: "0 0 6px",
    },
    Dropdown: {
      borderRadiusLG: 12,
      paddingBlock: 8,
    },
    Collapse: {
      borderRadiusLG: 12,
      headerPadding: "16px 24px",
      contentPadding: "0 24px 24px",
    },
    Divider: {
      colorSplit: "#e4e4e7",
    },
  },
};
