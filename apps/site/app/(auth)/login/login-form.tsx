"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction } from "./actions";
import type { LoginFormState } from "./types.ts";

const initialLoginState: LoginFormState = {
  status: "idle",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="w-full rounded-full bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-violet-200/60 transition hover:-translate-y-0.5 hover:bg-violet-600 disabled:translate-y-0 disabled:opacity-70"
      disabled={pending}
    >
      {pending ? "Ingresando..." : "Iniciar sesión"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialLoginState);

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
          placeholder="tu@correo.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-slate-700"
        >
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
          placeholder="********"
        />
      </div>

      {state.status === "error" ? (
        <p className="rounded-xl border border-red-200 bg-red-50/90 px-3 py-2 text-sm text-red-700 shadow-sm">
          {state.message}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
