"use client";

// Select: re-export del Select de antd. antd v6 acepta tanto la API de
// opciones (`options={[]}`) como hijos `<Select.Option>` (deprecada pero
// aún funcional). Preferimos `options` y la exponemos normalizada.

import { Select as AntSelect } from "antd";
import { cn } from "@repo/ui/utils";
import type { ComponentProps } from "react";

type AntSelectProps = ComponentProps<typeof AntSelect>;

export function Select({ className, ...props }: AntSelectProps) {
  return (
    <AntSelect
      className={cn("w-full", className)}
      popupMatchSelectWidth
      {...props}
    />
  );
}

export const SelectOption = AntSelect.Option;
export { AntSelect as AntSelectRaw };
