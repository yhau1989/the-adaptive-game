"use client";

// Sección "Restricciones de pedidos": lote mínimo, máximo y múltiplo de
// pedido, más el tipo de nodo al que aplican.

import { useFormContext } from "react-hook-form";
import { Input } from "@repo/ui/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@repo/ui/field";
import type { GameFormData } from "./types";

export function RestrictionsSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<GameFormData>();

  return (
    <FieldSet className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <FieldLegend>Restricciones de pedidos</FieldLegend>
      <FieldGroup className="gap-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="restriction-minimum">Mínimo</FieldLabel>
            <Input
              id="restriction-minimum"
              type="number"
              min={0}
              aria-invalid={!!errors.restrictionMinimum}
              {...register("restrictionMinimum", {
                required: "El mínimo es requerido",
                valueAsNumber: true,
              })}
            />
            <FieldError>{errors.restrictionMinimum?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="restriction-maximum">Máximo</FieldLabel>
            <Input
              id="restriction-maximum"
              type="number"
              min={0}
              aria-invalid={!!errors.restrictionMaximum}
              {...register("restrictionMaximum", {
                required: "El máximo es requerido",
                valueAsNumber: true,
              })}
            />
            <FieldError>{errors.restrictionMaximum?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="restriction-batch">
              Múltiplo de pedido (factor de lote)
            </FieldLabel>
            <Input
              id="restriction-batch"
              type="number"
              min={0}
              aria-invalid={!!errors.restrictionBatchSize}
              {...register("restrictionBatchSize", {
                required: "El múltiplo de pedido es requerido",
                valueAsNumber: true,
              })}
            />
            <FieldError>{errors.restrictionBatchSize?.message}</FieldError>
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="restriction-node-type">Tipo de nodo</FieldLabel>
          <FieldDescription>
            Define los parámetros operativos permitidos para cada pedido.
          </FieldDescription>
          <Input
            id="restriction-node-type"
            type="text"
            aria-invalid={!!errors.restrictionNodeType}
            {...register("restrictionNodeType", {
              required: "El tipo de nodo es requerido",
            })}
          />
          <FieldError>{errors.restrictionNodeType?.message}</FieldError>
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
