import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findUserById, listGames } from "@/lib/db";
import { logoutAction } from "./actions";
import { Sidebar } from "./sidebar";
import { GameTableSection, type SerializedGame } from "./game-table-section";

export const metadata: Metadata = {
  title: "Panel de control",
};

async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("userId");

  return sessionCookie?.value ?? null;
}

export default async function DashboardPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  const user = await findUserById(userId);

  if (!user) {
    redirect("/login");
  }

  const games = await listGames();

  const serializedGames: SerializedGame[] = games.map((game) => ({
    ...game,
    start_date:
      game.start_date instanceof Date
        ? game.start_date.toISOString()
        : String(game.start_date),
    end_date:
      game.end_date instanceof Date
        ? game.end_date.toISOString()
        : String(game.end_date),
  }));

  return (
    <div className="min-h-screen bg-linear-to-br from-violet-100 via-white to-violet-200">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-violet-200/60 bg-white/80 px-8 py-6 backdrop-blur-sm">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-violet-500/80">
                Sesión iniciada como
              </p>
              <h1 className="text-2xl font-semibold text-violet-900">
                {user.name ?? user.email}
              </h1>
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

          <main className="flex flex-1 flex-col gap-8 px-8 py-10">
            <section className="rounded-3xl border border-violet-200/40 bg-white/90 p-10 shadow-lg shadow-violet-200/40 backdrop-blur">
              <h2 className="text-3xl font-semibold text-violet-900">
                Hola, {user.name ?? user.email}!
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-violet-600">
                Esta es tu área privada dentro de The Adaptive Game. Aquí podrás
                ver tus métricas, campañas y próximos lanzamientos en cuanto
                estén disponibles.
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-2xl border border-violet-200/50 bg-violet-50/70 p-6">
                  <p className="text-xs uppercase tracking-wide text-violet-500">
                    Progreso
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-violet-900">
                    72%
                  </p>
                  <p className="mt-2 text-xs text-violet-500/90">
                    Avance estimado de tu campaña actual.
                  </p>
                </div>
                <div className="rounded-2xl border border-violet-200/50 bg-violet-50/70 p-6">
                  <p className="text-xs uppercase tracking-wide text-violet-500">
                    Retos activos
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-violet-900">
                    4
                  </p>
                  <p className="mt-2 text-xs text-violet-500/90">
                    Nuevas misiones que requieren tu atención esta semana.
                  </p>
                </div>
                <div className="rounded-2xl border border-violet-200/50 bg-violet-50/70 p-6">
                  <p className="text-xs uppercase tracking-wide text-violet-500">
                    Siguiente hito
                  </p>
                  <p className="mt-3 text-lg font-semibold text-violet-900">
                    Lanzamiento de mapa beta
                  </p>
                  <p className="mt-2 text-xs text-violet-500/90">
                    Programado para el 12 de diciembre.
                  </p>
                </div>
              </div>
            </section>

            <GameTableSection games={serializedGames} />

            <section className="rounded-3xl border border-violet-200/40 bg-white/80 p-8 shadow-inner shadow-violet-200/30">
              <h3 className="text-lg font-semibold text-violet-900">
                Próximas acciones sugeridas
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-violet-700">
                <li className="rounded-xl border border-violet-200/40 bg-violet-50/70 p-3">
                  Revisa la dificultad del nivel 4 para aumentar la retención.
                </li>
                <li className="rounded-xl border border-violet-200/40 bg-violet-50/70 p-3">
                  Actualiza la biografía en tu perfil para reforzar tu presencia
                  con la comunidad.
                </li>
                <li className="rounded-xl border border-violet-200/40 bg-violet-50/70 p-3">
                  Planifica una sesión de prueba con jugadores avanzados el
                  próximo viernes.
                </li>
              </ul>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
