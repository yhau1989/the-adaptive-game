"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Field, FieldError, FieldLabel } from "@repo/ui/field";
import { loginAction } from "./actions";
import type { LoginFormState } from "./types";

const initialLoginState: LoginFormState = {
  status: "idle",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="default"
      disabled={pending}
      className="w-full"
      loading={pending}
    >
      {pending ? "Ingresando..." : "Iniciar sesión"}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialLoginState);

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-6">
      <Field>
        <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="tu@correo.com"
          status={state.status === "error" ? "error" : undefined}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="password">Contraseña</FieldLabel>
        <Input.Password
          id="password"
          name="password"
          autoComplete="current-password"
          required
          placeholder="********"
          status={state.status === "error" ? "error" : undefined}
        />
      </Field>

      {state.status === "error" ? (
        <FieldError>{state.message}</FieldError>
      ) : null}

      <SubmitButton />
    </form>
  );
}
