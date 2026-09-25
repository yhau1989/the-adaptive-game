"use client";

// Card: envoltorio ligero sobre antd Card. Mantiene los subcomponentes
// del estilo shadcn (Header / Title / Description / Content / Footer /
// Action) para que migrar un call site sea casi mecánico.

import type { ComponentProps, ReactNode } from "react";
import { Card as AntCard, Typography } from "antd";
import { cn } from "./utils";

type AntCardProps = ComponentProps<typeof AntCard>;

type DivProps = ComponentProps<"div"> & { children?: ReactNode };

function CardRoot({ className, ...props }: AntCardProps) {
  return (
    <AntCard
      variant="outlined"
      className={cn("rounded-xl border border-zinc-200", className)}
      {...props}
    />
  );
}

function CardHeader({ className, children, ...props }: DivProps) {
  return (
    <div
      className={cn("flex flex-col gap-1.5 px-6 pt-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function CardTitle({ className, children, ...props }: DivProps) {
  return (
    <Typography.Title
      level={4}
      className={cn("!mb-0 font-semibold text-slate-900", className)}
      {...props}
    >
      {children}
    </Typography.Title>
  );
}

function CardDescription({ className, children, ...props }: DivProps) {
  return (
    <p
      className={cn("text-sm text-slate-500", className)}
      {...(props as object)}
    >
      {children}
    </p>
  );
}

function CardContent({ className, children, ...props }: DivProps) {
  return (
    <div className={cn("px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ className, children, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "flex items-center border-t border-zinc-100 px-6 py-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CardAction({ className, children, ...props }: DivProps) {
  return (
    <div className={cn("self-start justify-self-end", className)} {...props}>
      {children}
    </div>
  );
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
  Action: CardAction,
});

export {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
};
