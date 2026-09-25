"use client";

// Sección "Información general": nombre, descripción, fechas de inicio
// y cierre.

import { useFormContext } from "react-hook-form";
import { Input, TextArea as Textarea } from "@repo/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@repo/ui/field";
import type { GameFormData } from "./types";

export function GeneralInfoSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<GameFormData>();

  return (
    <FieldSet className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <FieldLegend>Información general</FieldLegend>
      <FieldGroup className="gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="game-name">Nombre</FieldLabel>
            <Input
              id="game-name"
              type="text"
              aria-invalid={!!errors.name}
              {...register("name", { required: "El nombre es requerido" })}
            />
            <FieldError>{errors.name?.message}</FieldError>
          </Field>
          <Field className="sm:col-span-2">
            <FieldLabel htmlFor="game-description">Descripción</FieldLabel>
            <Textarea
              id="game-description"
              className="min-h-24 resize-none"
              aria-invalid={!!errors.description}
              {...register("description", {
                required: "La descripción es requerida",
              })}
            />
            <FieldError>{errors.description?.message}</FieldError>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="game-start-date">Fecha de inicio</FieldLabel>
            <Input
              id="game-start-date"
              type="date"
              aria-invalid={!!errors.startDate}
              {...register("startDate", {
                required: "La fecha de inicio es requerida",
              })}
            />
            <FieldError>{errors.startDate?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="game-end-date">Fecha de cierre</FieldLabel>
            <Input
              id="game-end-date"
              type="date"
              aria-invalid={!!errors.endDate}
              {...register("endDate", {
                required: "La fecha de cierre es requerida",
              })}
            />
            <FieldError>{errors.endDate?.message}</FieldError>
          </Field>
        </div>
      </FieldGroup>
    </FieldSet>
  );
}
