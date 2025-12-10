import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { findUserById } from "@/lib/db";
import { logoutAction } from "../../actions";
import { Sidebar } from "../../sidebar";
import { GameCreateForm } from "./game-create-form";

export const metadata: Metadata = {
  title: "Crear juego",
};

async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("userId");

  return sessionCookie?.value ?? null;
}

export default async function NewGamePage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  const user = await findUserById(userId);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-violet-100 via-white to-violet-200">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-violet-200/60 bg-white/80 px-8 py-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-medium text-violet-700 transition hover:-translate-y-0.5 hover:border-violet-400 hover:text-violet-900"
              >
                <ChevronLeft className="h-4 w-4" />
                Volver al panel
              </Link>
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-violet-500/80">
                  Creación de juego
                </p>
                <h1 className="text-2xl font-semibold text-violet-900">
                  Nuevo juego para {user.name ?? user.email}
                </h1>
              </div>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-full border border-violet-300 bg-white px-5 py-2 text-sm font-semibold text-violet-700 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-400 hover:text-violet-900 hover:shadow-md"
              >
                Cerrar sesión
              </button>
            </form>
          </header>

          <main className="flex flex-1 flex-col gap-6 px-8 py-10">
            <section className="rounded-3xl border border-violet-200/40 bg-white/95 p-10 shadow-lg shadow-violet-200/40 backdrop-blur">
              <h2 className="text-xl font-semibold text-violet-900">
                Configura los parámetros del juego
              </h2>
              <p className="text-sm leading-6 text-violet-600">
                Completa la información en cada bloque. Más adelante podremos
                conectar este formulario con acciones del servidor para
                persistir la configuración en la base de datos.
              </p>

              <GameCreateForm />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
