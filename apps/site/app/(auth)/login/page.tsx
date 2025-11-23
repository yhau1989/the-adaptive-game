import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-zinc-50 via-white to-violet-100 px-6 py-16">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-25">
        <div className="absolute left-1/4 top-1/5 h-56 w-56 rounded-full bg-violet-300 blur-3xl" />
        <div className="absolute right-1/5 top-1/3 h-64 w-64 rounded-full bg-fuchsia-300 blur-3xl" />
      </div>

      <div className="flex w-full max-w-5xl items-center justify-between gap-16 rounded-4xl border border-zinc-200/80 bg-white/85 p-12 shadow-xl shadow-violet-100/40 backdrop-blur">
        <div className="hidden max-w-md flex-1 flex-col gap-6 text-slate-600 lg:flex">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/60 bg-violet-100/70 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-violet-700">
            <Sparkles className="h-3.5 w-3.5" />
            The Adaptive Game
          </div>
          <h1 className="text-4xl font-semibold leading-tight text-slate-900">
            Bienvenido de vuelta
            <br />a una experiencia adaptable.
          </h1>
          <p className="text-base leading-7 text-slate-500">
            Ingresa tus credenciales para continuar hacia tu panel
            personalizado. Si todavía no tienes una cuenta, ponte en contacto
            con el administrador.
          </p>
          <div className="rounded-2xl border border-zinc-200/70 bg-white/70 p-4 text-sm text-slate-500">
            <p className="font-medium text-slate-700">¿Necesitas ayuda?</p>
            <p className="mt-1">
              Escríbenos a{" "}
              <Link
                href="mailto:soporte@adaptive.game"
                className="font-semibold text-violet-700 underline decoration-violet-300/60 underline-offset-4"
              >
                soporte@adaptive.game
              </Link>
              . Nuestro equipo responderá en menos de 24 horas.
            </p>
          </div>
        </div>
        <div className="flex w-full max-w-md flex-col items-center gap-8">
          <div className="flex w-full flex-col gap-2 text-center">
            <h2 className="text-3xl font-semibold text-slate-900">
              Inicia sesión
            </h2>
            <p className="text-sm text-slate-500">
              Usa tu correo y contraseña registrados para entrar.
            </p>
          </div>
          <LoginForm />
          <div className="text-center text-xs text-slate-400">
            <p>Demo accesible con:</p>
            <p className="font-mono">demo@adaptive.game / demo1234</p>
          </div>
        </div>
      </div>
    </div>
  );
}
