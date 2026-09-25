"use client";

// Button: envoltorio sobre antd v6 que mantiene la API shadcn (variant /
// size / asChild / type) para no reescribir todos los call sites de
// golpe. El look final lo controla el ConfigProvider (theme.ts).
//
// Notas de implementación:
// - `type` se re-mapea a `htmlType` para no colisionar con el `type`
//   visual de antd (`primary`, `default`, etc.).
// - `asChild` clona el hijo inyectando el `className` del wrapper, igual
//   que Radix Slot. Solo soporta un único hijo ReactElement.

import type { ComponentProps, ReactElement, ReactNode } from "react";
import { cloneElement, isValidElement } from "react";
import { Button as AntButton } from "antd";
import { cn } from "./utils";

type AntButtonProps = ComponentProps<typeof AntButton>;

type ButtonVariant =
  "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

type ButtonSize = "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";

type ButtonProps = Omit<
  AntButtonProps,
  "type" | "variant" | "size" | "htmlType"
> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /**
   * HTML button type (`"button" | "submit" | "reset"`). Se traduce a
   * `htmlType` en antd para no colisionar con el `type` visual
   * (`primary`, `default`, etc.).
   */
  type?: "button" | "submit" | "reset";
  /**
   * Si true, el botón se renderiza como el hijo (Radix Slot behavior).
   * Clona el hijo inyectando el `className` del wrapper. Default: false.
   */
  asChild?: boolean;
  children?: ReactNode;
};

/**
 * Mapeo de la API shadcn → antd v6.
 * - variant="default"      → type=primary + variant=solid (botón violeta lleno)
 * - variant="destructive"  → danger
 * - variant="outline"      → type=default + variant=outlined
 * - variant="secondary"    → type=default + variant=outlined
 * - variant="ghost"        → type=default + variant=text
 * - variant="link"         → type=link
 */
function mapVariant(variant: ButtonVariant | undefined): {
  type?: AntButtonProps["type"];
  antVariant?: AntButtonProps["variant"];
  danger?: boolean;
} {
  switch (variant) {
    case "destructive":
      return { danger: true };
    case "outline":
      return { type: "default", antVariant: "outlined" };
    case "secondary":
      return { type: "default", antVariant: "outlined" };
    case "ghost":
      return { type: "default", antVariant: "text" };
    case "link":
      return { type: "link" };
    case "default":
    default:
      return { type: "primary", antVariant: "solid" };
  }
}

function mapSize(size: ButtonSize | undefined): {
  antSize?: AntButtonProps["size"];
  shape?: AntButtonProps["shape"];
} {
  if (size === "icon" || size === "icon-sm" || size === "icon-lg") {
    return { shape: "circle" };
  }
  switch (size) {
    case "sm":
      return { antSize: "small" };
    case "lg":
      return { antSize: "large" };
    case "default":
    default:
      return { antSize: "middle" };
  }
}

export function Button({
  variant = "default",
  size = "default",
  asChild = false,
  type: htmlType,
  className,
  children,
  ...rest
}: ButtonProps) {
  const { type: typeVariant, antVariant, danger } = mapVariant(variant);
  const { antSize, shape } = mapSize(size);

  // asChild → clonar el hijo directo, mergeando className (Radix Slot).
  if (asChild && isValidElement(children)) {
    const childElement = children as ReactElement<{ className?: string }>;
    return cloneElement(childElement, {
      className: cn(className, childElement.props.className),
    });
  }

  return (
    <AntButton
      type={typeVariant}
      htmlType={htmlType}
      variant={antVariant}
      size={antSize}
      shape={shape}
      danger={danger}
      className={className}
      {...rest}
    >
      {children}
    </AntButton>
  );
}
