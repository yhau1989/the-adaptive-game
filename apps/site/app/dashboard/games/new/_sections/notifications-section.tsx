"use client";

// Sección "Alertas de inventario": tipo de nodo y mensaje.

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

export function NotificationsSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<GameFormData>();

  return (
    <FieldSet className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <FieldLegend>Alertas de inventario</FieldLegend>
      <FieldGroup className="gap-6">
        <Field>
          <FieldLabel htmlFor="notification-node-type">Tipo de nodo</FieldLabel>
          <Input
            id="notification-node-type"
            type="text"
            aria-invalid={!!errors.notificationNodeType}
            {...register("notificationNodeType", {
              required: "El tipo de nodo es requerido",
            })}
          />
          <FieldError>{errors.notificationNodeType?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="notification-message">Mensaje</FieldLabel>
          <Textarea
            id="notification-message"
            className="min-h-24 resize-none"
            aria-invalid={!!errors.notificationMessage}
            {...register("notificationMessage", {
              required: "El mensaje es requerido",
            })}
          />
          <FieldError>{errors.notificationMessage?.message}</FieldError>
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
