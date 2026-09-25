"use client";

// Sección "Configuración del juego": empresa, número de periodos, tipo de
// periodo y producto. Usa `useFormContext` para que el form completo
// decida cómo exponer register/control.

import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@repo/ui/input";
import { Select } from "@repo/ui/select";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@repo/ui/field";
import { TimeUnit } from "@/types/general-types";
import type { GameFormData } from "./types";

const PERIOD_OPTIONS = Array.from({ length: 20 }, (_, i) => i + 1).map(
  (num) => ({
    value: String(num),
    label: String(num),
  }),
);

const PERIOD_TYPE_OPTIONS = [
  { value: TimeUnit.Weeks, label: "Semanas" },
  { value: TimeUnit.Days, label: "Días" },
  { value: TimeUnit.Hours, label: "Horas" },
];

export function GameConfigSection() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<GameFormData>();

  return (
    <FieldSet className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <FieldLegend>Configuración del juego</FieldLegend>
      <FieldGroup className="gap-6">
        <Field>
          <FieldLabel htmlFor="configuration-business-name">Empresa</FieldLabel>
          <Input
            id="configuration-business-name"
            type="text"
            aria-invalid={!!errors.businessName}
            {...register("businessName", {
              required: "El nombre de la empresa es requerido",
            })}
          />
          <FieldError>{errors.businessName?.message}</FieldError>
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="configuration-periods">
              Número total de periodos
            </FieldLabel>
            <Controller
              name="periods"
              control={control}
              rules={{ required: "El número de periodos es requerido" }}
              render={({ field }) => (
                <Select
                  id="configuration-periods"
                  status={errors.periods ? "error" : undefined}
                  placeholder="Selecciona un valor"
                  value={field.value ? String(field.value) : undefined}
                  onChange={(value) => field.onChange(parseInt(String(value)))}
                  options={PERIOD_OPTIONS}
                />
              )}
            />
            <FieldError>{errors.periods?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="configuration-period-type">
              Tipo de periodo
            </FieldLabel>
            <Controller
              name="periodType"
              control={control}
              render={({ field }) => (
                <Select
                  id="configuration-period-type"
                  placeholder="Selecciona un periodo"
                  value={field.value}
                  onChange={field.onChange}
                  options={PERIOD_TYPE_OPTIONS}
                />
              )}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="configuration-product">Producto</FieldLabel>
            <Input
              id="configuration-product"
              type="text"
              aria-invalid={!!errors.product}
              {...register("product", {
                required: "El producto es requerido",
              })}
            />
            <FieldError>{errors.product?.message}</FieldError>
          </Field>
        </div>
      </FieldGroup>
    </FieldSet>
  );
}
