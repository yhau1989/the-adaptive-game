"use client";

// Bloque reutilizable: "valor global" + 4 inputs por nodo (Fabricante,
// Distribuidor, Mayorista, Retail). Reaparece en 6 secciones del form
// de creación de juego (backorder, stock inicial, stock de seguridad,
// tránsito inicial, variabilidad de suministro, lead time y su
// variabilidad, costo de compra y precio de venta).
//
// AGENTS.md §6: este componente reemplaza los 9 bloques casi idénticos
// que había inline en game-create-form.tsx (≈ 1000 líneas).

import { useFormContext } from "react-hook-form";
import { Input } from "@repo/ui/input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/field";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/accordion";

import type { GameFormData } from "./types";

/**
 * Sufijo que identifica el campo dentro de `GameFormData`. El componente
 * genera ids como `${idPrefix}-${suffix.toLowerCase()}` y propaga el
 * valor del input global a las cuatro variantes por nodo.
 */
export type NodeDistributionField =
  | "initialBackorder"
  | "initialStock"
  | "safetyStock"
  | "transitOrders"
  | "supplyVariability"
  | "leadTime"
  | "leadTimeVar"
  | "purchaseCost"
  | "salePrice";

type Node = {
  suffix: string; // Manufacturer | Distributor | Wholesaler | Retail
  label: string;
};

const NODES: readonly Node[] = [
  { suffix: "Manufacturer", label: "Fabricante" },
  { suffix: "Distributor", label: "Distribuidor" },
  { suffix: "Wholesaler", label: "Mayorista" },
  { suffix: "Retail", label: "Retail" },
] as const;

export type NodeDistributionSectionProps = {
  /** Prefijo del campo en GameFormData. Ej: "initialStock". */
  field: NodeDistributionField;
  /** Título visible en el Accordion. Ej: "Stock inicial". */
  title: string;
  /** Prefijo HTML para los ids. Ej: "initial-stock". */
  idPrefix: string;
};

/**
 * Una sección colapsable "valor global + 4 nodos". Usa `useFormContext`
 * para no tener que pasar register/setValue/errors como props.
 *
 * Para secciones con decimales (precios/costos), el call site puede
 * ajustar `step` y la validación; por ahora todas las secciones del form
 * actual usan enteros.
 */
export function NodeDistributionSection({
  field,
  title,
  idPrefix,
}: NodeDistributionSectionProps) {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<GameFormData>();

  const globalName = `${field}Global` as keyof GameFormData;
  const nodeName = (suffix: string) =>
    `${field}${suffix}` as keyof GameFormData;

  const propagateGlobal = (value: number) => {
    setValue(globalName, value);
    for (const node of NODES) {
      setValue(nodeName(node.suffix), value);
    }
  };

  const globalErr = errors[globalName];

  return (
    <Accordion
      type="single"
      collapsible
      className="rounded-lg border border-slate-200 bg-white shadow-sm"
    >
      <AccordionItem value={idPrefix} className="border-none">
        <AccordionTrigger className="px-6 py-4 text-base font-semibold hover:no-underline">
          {title}
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-6">
          <FieldGroup className="gap-6">
            <Field>
              <FieldLabel htmlFor={`${idPrefix}-global`}>
                Valor global (aplica a todos los nodos)
              </FieldLabel>
              <FieldDescription>
                Si defines un valor global, se aplicará a todos los tipos de
                nodos a menos que los edites individualmente
              </FieldDescription>
              <Input
                id={`${idPrefix}-global`}
                type="number"
                min={0}
                placeholder="0"
                aria-invalid={!!globalErr}
                {...register(globalName, {
                  required: "El valor global es requerido",
                  valueAsNumber: true,
                })}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? 0 : parseInt(e.target.value);
                  propagateGlobal(value);
                }}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              {NODES.map((node) => {
                const name = nodeName(node.suffix);
                const err = errors[name];
                return (
                  <Field key={node.suffix}>
                    <FieldLabel
                      htmlFor={`${idPrefix}-${node.suffix.toLowerCase()}`}
                    >
                      {node.label}
                    </FieldLabel>
                    <Input
                      id={`${idPrefix}-${node.suffix.toLowerCase()}`}
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!err}
                      {...register(name, {
                        required: `El valor de ${node.label.toLowerCase()} es requerido`,
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                );
              })}
            </div>
          </FieldGroup>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
