"use client";

// Dropdown: re-export del Dropdown de antd. En antd se usa con un trigger
// (children) y `menu={{ items }}`. Mantenemos la API shadcn mediante el
// wrapper <UIDropdown> que acepta `items` como data + un `trigger` ReactNode.
//
// Importante: clonamos el trigger en lugar de envolverlo en un <span>,
// porque anidar <button> dentro de <span> puede romper estilos/foco del
// elemento original (el span se queda con `pointer-events` del padre).

import type { ComponentProps, ReactElement } from "react";
import { cloneElement, isValidElement } from "react";
import { Dropdown as AntDropdown } from "antd";
import type { MenuProps } from "antd";
import { cn } from "./utils";

type AntDropdownProps = ComponentProps<typeof AntDropdown>;

type UIDropdownProps = Omit<
  AntDropdownProps,
  "menu" | "children" | "trigger"
> & {
  items: NonNullable<MenuProps["items"]>;
  /**
   * Elemento que abre el menú al hacer click. Debe ser un único
   * ReactElement que antd pueda clonar para inyectar handlers.
   */
  trigger: ReactElement;
  /** className aplicada al trigger clonado (mergea con la suya). */
  triggerClassName?: string;
};

/**
 * Wrapper que acerca la API shadcn a antd:
 *   <UIDropdown items={[...]} trigger={<Button>...</Button>} />
 *
 * Si necesitas más control (submenús, eventos, etc.) usa AntDropdown
 * directo importándolo de este módulo.
 */
export function UIDropdown({
  items,
  trigger,
  triggerClassName,
  ...rest
}: UIDropdownProps) {
  const triggerProps =
    (trigger.props as { className?: string } | undefined) ?? {};

  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger as ReactElement<{ className?: string }>, {
        className: cn(triggerClassName, triggerProps.className),
      })
    : trigger;

  return (
    <AntDropdown menu={{ items }} trigger={["click"]} {...rest}>
      {triggerElement}
    </AntDropdown>
  );
}

export { AntDropdown as AntDropdownRaw };
export type { MenuProps };
