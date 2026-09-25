"use client";

// Sección "Mensajes por evento": tipo de nodo + periodo + mensaje.

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

export function EventsMessageSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<GameFormData>();

  return (
    <FieldSet className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <FieldLegend>Mensajes por evento</FieldLegend>
      <FieldGroup className="gap-6">
        <div className="grid gap-4 sm:grid-cols-[2fr,1fr]">
          <Field>
            <FieldLabel htmlFor="events-node-type">Tipo de nodo</FieldLabel>
            <Input
              id="events-node-type"
              type="text"
              aria-invalid={!!errors.eventsNodeType}
              {...register("eventsNodeType", {
                required: "El tipo de nodo es requerido",
              })}
            />
            <FieldError>{errors.eventsNodeType?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="events-period">Periodo</FieldLabel>
            <Input
              id="events-period"
              type="number"
              min={0}
              aria-invalid={!!errors.eventsPeriod}
              {...register("eventsPeriod", {
                required: "El periodo es requerido",
                valueAsNumber: true,
              })}
            />
            <FieldError>{errors.eventsPeriod?.message}</FieldError>
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="events-message">Mensaje</FieldLabel>
          <Textarea
            id="events-message"
            className="min-h-24 resize-none"
            aria-invalid={!!errors.eventsMessage}
            {...register("eventsMessage", {
              required: "El mensaje es requerido",
            })}
          />
          <FieldError>{errors.eventsMessage?.message}</FieldError>
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
