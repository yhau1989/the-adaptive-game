"use client";

// Sección "Demanda": matriz de inputs por periodo + gráfico Recharts.
//
// Antes dependía de `apps/site/components/ui/chart.tsx` (wrapper shadcn/ui
// sobre Recharts con `@ts-nocheck`). Tras la migración §8, Recharts se usa
// directo: `ResponsiveContainer` resuelve el responsive, los colores van
// como `hsl(...)` en lugar de CSS vars (Recharts no necesita el truco de
// `ChartStyle` para pintar una sola serie).

import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@repo/ui/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@repo/ui/field";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { IDemandValue } from "@/types/general-types";

import type { GameFormData } from "./types";

/** Color de la serie — coincide con violet-600 (--color-primary antd). */
const DEMAND_COLOR = "hsl(262.1 83.3% 57.8%)";

export function DemandSection() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<GameFormData>();

  const periods = Number(watch("periods") ?? 0);
  const rawDemandValues = watch("demandValues");
  const demandValues = useMemo(
    () => (rawDemandValues ?? []) as IDemandValue[],
    [rawDemandValues],
  );

  const demandByPeriod = useMemo(() => {
    const map = new Map<number, number>();
    for (const d of demandValues) map.set(d.period, d.values);
    return map;
  }, [demandValues]);

  const chartData = useMemo(
    () =>
      Array.from({ length: periods }, (_, i) => i + 1).map((period) => ({
        periodo: period,
        demanda: demandByPeriod.get(period) ?? 0,
      })),
    [periods, demandByPeriod],
  );

  const handleDemandChange = (period: number, value: string) => {
    const numValue = value === "" ? 0 : parseInt(value);
    const next = Array.isArray(demandValues) ? [...demandValues] : [];
    const idx = next.findIndex((d) => d.period === period);
    if (idx >= 0) {
      next[idx] = { period, values: numValue };
    } else {
      next.push({ period, values: numValue });
    }
    setValue("demandValues", next);
  };

  const getDemandValue = (period: number) => demandByPeriod.get(period) ?? 0;

  return (
    <FieldSet className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <FieldLegend>Demanda</FieldLegend>
      <FieldGroup className="gap-6">
        <FieldDescription>
          Define la demanda para cada periodo del juego
        </FieldDescription>

        <div className="grid gap-4 grid-cols-8" key={periods}>
          {Array.from({ length: periods }, (_, i) => i + 1).map((period) => (
            <Field key={period}>
              <FieldLabel htmlFor={`delivery-period-${period}`}>
                Periodo {period}
              </FieldLabel>
              <Input
                id={`delivery-period-${period}`}
                type="number"
                min={0}
                placeholder="0"
                value={getDemandValue(period) || ""}
                onChange={(e) => handleDemandChange(period, e.target.value)}
              />
            </Field>
          ))}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {periods > 0 ? (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  accessibilityLayer
                  data={chartData}
                  margin={{ top: 20, left: 12, right: 12, bottom: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="periodo"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={20}
                    tickFormatter={(value) => `P${value}`}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <Tooltip
                    content={({ active, payload }) => (
                      <DemandTooltip
                        active={active}
                        payload={payload as unknown as DemandTooltipPayload}
                      />
                    )}
                  />
                  <Line
                    dataKey="demanda"
                    type="natural"
                    stroke={DEMAND_COLOR}
                    strokeWidth={1.5}
                    dot={{ fill: DEMAND_COLOR, r: 4 }}
                    activeDot={{ r: 6 }}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center py-8 text-sm text-slate-500">
              Selecciona el número de periodos para ver el gráfico
            </p>
          )}
        </div>

        <Field>
          <FieldLabel htmlFor="delivery-variability">Variabilidad</FieldLabel>
          <Input
            id="delivery-variability"
            type="number"
            min={0}
            aria-invalid={!!errors.deliveryVariability}
            {...register("deliveryVariability", {
              required: "La variabilidad es requerida",
              valueAsNumber: true,
            })}
          />
          <FieldError>{errors.deliveryVariability?.message}</FieldError>
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}

/**
 * Tooltip custom del gráfico de demanda. Se declara fuera del componente
 * principal para que React no lo remonte en cada render (Recharts lo
 * recibe como prop `content` y depende de la identidad para no perder
 * foco/teclado).
 */
type DemandTooltipPayload = Array<{
  value?: number | string;
  payload?: { periodo?: number };
}>;

function DemandTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: DemandTooltipPayload;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0];
  const periodo = item?.payload?.periodo;
  const value = Number(item?.value ?? 0);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
      <div className="grid gap-1">
        <span className="text-slate-500">Periodo {periodo}</span>
        <span className="font-semibold text-slate-900">Demanda: {value}</span>
      </div>
    </div>
  );
}
