"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { GameRecord } from "@/lib/db";
import { cn } from "@/lib/utils";

export type SerializedGame = Omit<GameRecord, "start_date" | "end_date"> & {
  start_date: string;
  end_date: string;
};

type GameTableSectionProps = {
  games: SerializedGame[];
};

export function GameTableSection({ games }: GameTableSectionProps) {
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    []
  );

  const statusStyles = useMemo(
    () => ({
      active: {
        label: "Activo",
        className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      },
      paused: {
        label: "Pausado",
        className: "bg-amber-100 text-amber-700 border border-amber-200",
      },
      archived: {
        label: "Archivado",
        className: "bg-slate-200 text-slate-700 border border-slate-300",
      },
    }),
    []
  );

  const formatDate = (value: string) => {
    const parsed = new Date(value);
    return Number.isNaN(parsed.valueOf())
      ? "Sin fecha"
      : dateFormatter.format(parsed);
  };

  const resolveStatus = (status: string) =>
    statusStyles[status as keyof typeof statusStyles] ?? {
      label: status,
      className: "bg-violet-100 text-violet-700 border border-violet-200",
    };

  const renderDescription = (value: string | null) =>
    value?.trim() || "Sin descripción";

  return (
    <section className="rounded-3xl border border-violet-200/50 bg-white/95 p-8 shadow-lg shadow-violet-200/50 backdrop-blur-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-violet-900">
            Juegos activos en la plataforma
          </h3>
          <p className="text-sm text-violet-600">
            Visualiza el estado y calendario de cada campaña creada.
          </p>
        </div>
        <Link
          href="/dashboard/games/new"
          className="inline-flex items-center gap-2 rounded-full border border-violet-300 bg-violet-600/90 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-600"
        >
          Crear nuevo juego
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-violet-100 bg-white">
        {games.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-10 py-16 text-center text-violet-600">
            <span className="text-lg font-medium text-violet-800">
              Aún no hay juegos registrados
            </span>
            <p className="max-w-md text-sm text-violet-600/90">
              Cuando crees tu primer juego aparecerá aquí con su calendario,
              estado y descripción general.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-violet-100 text-sm">
              <thead className="bg-violet-50/70 text-left text-xs font-semibold uppercase tracking-wide text-violet-500">
                <tr>
                  <th scope="col" className="px-5 py-4">
                    Juego
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Inicio
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Fin
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-violet-50/70 bg-white text-violet-800">
                {games.map((game) => {
                  const status = resolveStatus(game.status);
                  return (
                    <tr key={game.id} className="hover:bg-violet-50/40">
                      <td className="px-5 py-4 align-top">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-semibold text-violet-900">
                            {game.name}
                          </span>
                          <span className="text-xs text-violet-500">
                            {renderDescription(game.description)}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top text-xs font-medium text-violet-600">
                        {formatDate(game.start_date)}
                      </td>
                      <td className="px-5 py-4 align-top text-xs font-medium text-violet-600">
                        {formatDate(game.end_date)}
                      </td>
                      <td className="px-5 py-4 align-top">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                            status.className
                          )}
                        >
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
