// Helper cn() re-exportado desde @repo/ui para que los imports existentes
// `@/lib/utils` sigan funcionando en apps/site. La implementación vive en
// packages/ui/src/utils.ts (AGENTS.md §8: clsx + tailwind-merge conservados).

export { cn } from "@repo/ui/utils";