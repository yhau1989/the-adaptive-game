"use client";

// Separator → re-export del Divider de antd.

import { Divider as AntDivider } from "antd";
import { cn } from "@repo/ui/utils";
import type { ComponentProps } from "react";

export function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: ComponentProps<typeof AntDivider> & {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}) {
  return (
    <AntDivider
      type={orientation === "vertical" ? "vertical" : "horizontal"}
      plain={decorative}
      className={cn(
        "border-zinc-200",
        orientation === "vertical" ? "mx-2 h-auto" : "my-2",
        className,
      )}
      {...props}
    />
  );
}

export { AntDivider as AntDividerRaw };
