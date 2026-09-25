"use client";

// Accordion: wrapper shadcn-compatible sobre antd v6 Collapse.
//
// antd v6 deprecó el patrón `<Collapse><Collapse.Panel>...</Collapse.Panel>`
// (warning "children will be removed in next major version"). La API
// soportada es `<Collapse items={[{ key, label, children }]} />`, y rc-collapse
// corta los handlers del header cuando recibe `children` en vez de
// `items`, así que los acordeones NO se expanden al hacer click.
//
// Conservamos la API shadcn (Accordion / AccordionItem / AccordionTrigger /
// AccordionContent) para no tocar los 9 call sites; internamente el wrapper
// interpreta `<AccordionItem>` con `React.Children` y los convierte a
// `items[]` que el Collapse nativo sí maneja.
//
// Si necesitas la API nativa de antd, importa `Collapse` / `CollapsePanel`
// de este módulo.

import type { ReactNode } from "react";
import { Children, isValidElement } from "react";
import { Collapse as AntCollapse } from "antd";
import type { CollapseProps } from "antd";
import { cn } from "./utils";

type AccordionProps = {
  /** Compatibilidad con shadcn. Antd siempre es single-expandible por defecto. */
  type?: "single";
  collapsible?: boolean;
  className?: string;
  children?: ReactNode;
};

type AccordionItemProps = {
  value: string;
  className?: string;
  children?: ReactNode;
};

export function Accordion({ className, children }: AccordionProps) {
  // Mapear <AccordionItem> → items[] consumibles por antd Collapse.
  const items: CollapseProps["items"] = Children.toArray(children)
    .filter(isValidElement)
    .filter((child) => child.type === AccordionItem)
    .map((child) => {
      const itemElement = child as React.ReactElement<AccordionItemProps>;
      const {
        value,
        className: itemClassName,
        children: itemChildren,
      } = itemElement.props;

      let header: ReactNode = null;
      let body: ReactNode = null;
      for (const grand of Children.toArray(itemChildren)) {
        if (!isValidElement(grand)) continue;
        if (grand.type === AccordionTrigger) {
          header = (grand.props as { children?: ReactNode }).children;
        } else if (grand.type === AccordionContent) {
          body = (grand.props as { children?: ReactNode }).children;
        }
      }

      return {
        key: value,
        label: header,
        children: body,
        className: itemClassName,
      };
    });

  return (
    <AntCollapse
      // `items` es la API soportada en antd v6; `children` está deprecated y
      // rompe los handlers del header en rc-collapse.
      items={items} // shadcn: `type="single"` → sólo un panel abierto a la vez.
      accordion
      bordered={false}
      expandIconPlacement="end"
      className={cn(
        "rounded-lg border border-slate-200 bg-white shadow-sm",
        className,
      )}
    />
  );
}

/**
 * Marcador estructural. No se monta directamente: `Accordion` lo extrae
 * del árbol con `React.Children` y lo traduce a un `item` del Collapse.
 */
export function AccordionItem(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: AccordionItemProps,
) {
  return null;
}

/**
 * Marcador estructural. `Accordion` extrae `children` y los usa como
 * `label` del item. Las className que el call site pase se ignoran — el
 * styling vive en el ConfigProvider de antd.
 */
export function AccordionTrigger(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: {
    className?: string;
    children?: ReactNode;
  },
) {
  return null;
}

/**
 * Marcador estructural. `Accordion` extrae `children` y los pone como
 * `children` del item (cuerpo del panel).
 */
export function AccordionContent(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: {
    className?: string;
    children?: ReactNode;
  },
) {
  return null;
}

// API nativa de antd, por si alguien la necesita.
export const Collapse = AntCollapse;
export const CollapsePanel = AntCollapse.Panel;
export { AntCollapse as AntCollapseRaw };
