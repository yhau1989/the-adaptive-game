"use client";

// Sección "Costos y precios": costo de inventario + costo de pedido
// pendiente. La distribución por nodo del costo de compra y del precio
// de venta se hace con `NodeDistributionSection`.

import { useFormContext } from "react-hook-form";
import { Input } from "@repo/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@repo/ui/field";
import { NodeDistributionSection } from "./node-distribution-section";
import type { GameFormData } from "./types";

export function CostsSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<GameFormData>();

  return (
    <>
      <FieldSet className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <FieldLegend>Costos y precios</FieldLegend>
        <FieldGroup className="gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="cost-stock">Costo de inventario</FieldLabel>
              <Input
                id="cost-stock"
                type="number"
                min={0}
                step="0.01"
                aria-invalid={!!errors.stockCost}
                {...register("stockCost", {
                  required: "El costo de inventario es requerido",
                  valueAsNumber: true,
                })}
              />
              <FieldError>{errors.stockCost?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="cost-pending">
                Costo pedido pendiente (Back Order)
              </FieldLabel>
              <Input
                id="cost-pending"
                type="number"
                min={0}
                step="0.01"
                aria-invalid={!!errors.pendingOrderCost}
                {...register("pendingOrderCost", {
                  required: "El costo de pedido pendiente es requerido",
                  valueAsNumber: true,
                })}
              />
              <FieldError>{errors.pendingOrderCost?.message}</FieldError>
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>

      <NodeDistributionSection
        field="purchaseCost"
        title="Costo de compra"
        idPrefix="purchase-cost"
      />

      <NodeDistributionSection
        field="salePrice"
        title="Precio de venta"
        idPrefix="sale-price"
      />
    </>
  );
}
