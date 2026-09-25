// Helper de clases compartido por todos los wrappers. Mantenemos clsx +
// tailwind-merge tal y como pidió AGENTS.md §8.

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
