"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IDemandValue, TimeUnit } from "@/types/general-types";

interface GameFormData {
  // Información general
  name: string;
  description: string;
  startDate: string;
  endDate: string;

  // Configuración del juego
  businessName: string;
  periods: number;
  periodType: TimeUnit;
  product: string;

  // Demanda
  demandValues: IDemandValue[];
  deliveryTime: number;
  deliveryVariability: number;
  deliveryNodeType: string;

  // BackOrder inicial
  initialBackorderGlobal: number;
  initialBackorderManufacturer: number;
  initialBackorderDistributor: number;
  initialBackorderWholesaler: number;
  initialBackorderRetail: number;

  // Stock inicial
  initialStockGlobal: number;
  initialStockManufacturer: number;
  initialStockDistributor: number;
  initialStockWholesaler: number;
  initialStockRetail: number;

  // Stock de seguridad
  safetyStockGlobal: number;
  safetyStockManufacturer: number;
  safetyStockDistributor: number;
  safetyStockWholesaler: number;
  safetyStockRetail: number;

  // Pedidos en tránsito
  transitOrdersGlobal: number;
  transitOrdersManufacturer: number;
  transitOrdersDistributor: number;
  transitOrdersWholesaler: number;
  transitOrdersRetail: number;

  // Variabilidad Suministro
  supplyVariabilityGlobal: number;
  supplyVariabilityManufacturer: number;
  supplyVariabilityDistributor: number;
  supplyVariabilityWholesaler: number;
  supplyVariabilityRetail: number;

  // Lead Time
  leadTimeGlobal: number;
  leadTimeManufacturer: number;
  leadTimeDistributor: number;
  leadTimeWholesaler: number;
  leadTimeRetail: number;

  // Variabilidad Lead Time
  leadTimeVarGlobal: number;
  leadTimeVarManufacturer: number;
  leadTimeVarDistributor: number;
  leadTimeVarWholesaler: number;
  leadTimeVarRetail: number;

  // Costos
  stockCost: number;
  pendingOrderCost: number;
  purchaseCost: number;
  salePrice: number;
  costsNodeType: string;

  // Eventos
  eventsNodeType: string;
  eventsPeriod: number;
  eventsMessage: string;

  // Restricciones
  restrictionMinimum: number;
  restrictionMaximum: number;
  restrictionBatchSize: number;
  restrictionNodeType: string;

  // Alertas
  notificationNodeType: string;
  notificationMessage: string;
}

const chartConfig = {
  demanda: {
    label: "Demanda",
    color: "hsl(262.1 83.3% 57.8%)",
  },
} satisfies ChartConfig;

export function GameCreateForm() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GameFormData>({
    defaultValues: {
      periodType: TimeUnit.Weeks,
      demandValues: [],
      deliveryTime: 0,
      deliveryVariability: 0,
      // BackOrder inicial
      initialBackorderGlobal: 1,
      initialBackorderManufacturer: 1,
      initialBackorderDistributor: 1,
      initialBackorderWholesaler: 1,
      initialBackorderRetail: 1,
      // Stock inicial
      initialStockGlobal: 1,
      initialStockManufacturer: 1,
      initialStockDistributor: 1,
      initialStockWholesaler: 1,
      initialStockRetail: 1,
      // Stock de seguridad
      safetyStockGlobal: 1,
      safetyStockManufacturer: 1,
      safetyStockDistributor: 1,
      safetyStockWholesaler: 1,
      safetyStockRetail: 1,
      // Pedidos en tránsito
      transitOrdersGlobal: 1,
      transitOrdersManufacturer: 1,
      transitOrdersDistributor: 1,
      transitOrdersWholesaler: 1,
      transitOrdersRetail: 1,
      // Variabilidad Suministro
      supplyVariabilityGlobal: 1,
      supplyVariabilityManufacturer: 1,
      supplyVariabilityDistributor: 1,
      supplyVariabilityWholesaler: 1,
      supplyVariabilityRetail: 1,
      // Lead Time
      leadTimeGlobal: 1,
      leadTimeManufacturer: 1,
      leadTimeDistributor: 1,
      leadTimeWholesaler: 1,
      leadTimeRetail: 1,
      // Variabilidad Lead Time
      leadTimeVarGlobal: 1,
      leadTimeVarManufacturer: 1,
      leadTimeVarDistributor: 1,
      leadTimeVarWholesaler: 1,
      leadTimeVarRetail: 1,
      // Costos
      stockCost: 0,
      pendingOrderCost: 0,
      purchaseCost: 0,
      salePrice: 0,
      // Eventos
      eventsPeriod: 0,
      // Restricciones
      restrictionMinimum: 0,
      restrictionMaximum: 0,
      restrictionBatchSize: 0,
    },
  });

  const periods = watch("periods");
  const demandValues = (watch("demandValues") || []) as IDemandValue[];
  const formValues = watch();

  useEffect(() => {
    console.log("Form values changed:", formValues);
  }, [formValues]);

  const handleDemandChange = (period: number, value: string) => {
    const numValue = value === "" ? 0 : parseInt(value);
    const currentValues: IDemandValue[] = Array.isArray(demandValues)
      ? [...demandValues]
      : [];
    const existingIndex = currentValues.findIndex((d) => d.period === period);

    if (existingIndex >= 0) {
      currentValues[existingIndex] = { period, values: numValue };
    } else {
      currentValues.push({ period, values: numValue });
    }

    setValue("demandValues", currentValues);
  };

  const getDemandValue = (period: number): number => {
    if (!Array.isArray(demandValues)) return 0;
    const demand = demandValues.find((d) => d.period === period);
    return demand?.values || 0;
  };

  const chartData = Array.from({ length: periods || 0 }, (_, i) => i + 1).map(
    (period) => ({
      periodo: period,
      demanda: getDemandValue(period),
    })
  );

  const onSubmit = (data: GameFormData) => {
    console.log(data);
    // TODO: conectar con acción del servidor para persistir la creación del juego.
  };

  return (
    <form
      className="mx-auto mt-6 w-full max-w-4xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FieldGroup className="gap-8">
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
                <FieldLabel htmlFor="game-start-date">
                  Fecha de inicio
                </FieldLabel>
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

        <FieldSet className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <FieldLegend>Configuración del juego</FieldLegend>
          <FieldGroup className="gap-6">
            <Field>
              <FieldLabel htmlFor="configuration-business-name">
                Empresa
              </FieldLabel>
              <Input
                id="configuration-business-name"
                type="text"
                aria-invalid={!!errors.businessName}
                {...register("businessName", {
                  required: "El nombre de la empresa es requerido",
                })}
              />
              <FieldError>{errors.businessName?.message}</FieldError>
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="configuration-periods">
                  Número total de periodos
                </FieldLabel>
                <Controller
                  name="periods"
                  control={control}
                  rules={{ required: "El número de periodos es requerido" }}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <SelectTrigger
                        id="configuration-periods"
                        className="w-full justify-between"
                        aria-invalid={!!errors.periods}
                      >
                        <SelectValue placeholder="Selecciona un valor" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 20 }, (_, i) => i + 1).map(
                          (num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>{errors.periods?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="configuration-period-type">
                  Tipo de periodo
                </FieldLabel>
                <Controller
                  name="periodType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="configuration-period-type"
                        className="w-full justify-between"
                      >
                        <SelectValue placeholder="Selecciona un periodo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TimeUnit.Weeks}>Semanas</SelectItem>
                        <SelectItem value={TimeUnit.Days}>Días</SelectItem>
                        <SelectItem value={TimeUnit.Hours}>Horas</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="configuration-product">
                  Producto
                </FieldLabel>
                <Input
                  id="configuration-product"
                  type="text"
                  aria-invalid={!!errors.product}
                  {...register("product", {
                    required: "El producto es requerido",
                  })}
                />
                <FieldError>{errors.product?.message}</FieldError>
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>

        <FieldSet className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <FieldLegend>Demanda</FieldLegend>

          <FieldGroup className="gap-6">
            <FieldDescription>
              Define la demanda para cada periodo del juego
            </FieldDescription>

            {/* Inputs */}
            <div className="grid gap-4 grid-cols-8" key={periods}>
              {Array.from({ length: periods || 0 }, (_, i) => i + 1).map(
                (period) => (
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
                      onChange={(e) =>
                        handleDemandChange(period, e.target.value)
                      }
                    />
                  </Field>
                )
              )}
            </div>

            {/* Gráfico */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              {periods && periods > 0 ? (
                <ChartContainer
                  config={chartConfig}
                  className="h-[250px] w-full"
                >
                  <LineChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                      top: 20,
                      left: 12,
                      right: 12,
                      bottom: 12,
                    }}
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
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid gap-2">
                                <div className="flex flex-col">
                                  <span className="text-muted-foreground">
                                    Periodo {payload[0].payload.periodo}
                                  </span>
                                  <span className="font-bold text-muted-foreground">
                                    Demanda: {payload[0].value}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      dataKey="demanda"
                      type="natural"
                      stroke="var(--color-demanda)"
                      strokeWidth={1.5}
                      dot={{
                        fill: "var(--color-demanda)",
                        r: 4,
                      }}
                      activeDot={{
                        r: 6,
                      }}
                      connectNulls
                    />
                  </LineChart>
                </ChartContainer>
              ) : (
                <p className="text-sm text-slate-500 text-center py-8">
                  Selecciona el número de periodos para ver el gráfico
                </p>
              )}
            </div>
            <Field>
              <FieldLabel htmlFor="delivery-variability">
                Variabilidad
              </FieldLabel>
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

          {/* <FieldGroup className="gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="delivery-time">Tiempo</FieldLabel>
                <Input
                  id="delivery-time"
                  type="number"
                  min={0}
                  {...register("deliveryTime", { valueAsNumber: true })}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="delivery-variability">
                  Variabilidad
                </FieldLabel>
                <Input
                  id="delivery-variability"
                  type="number"
                  min={0}
                  {...register("deliveryVariability", { valueAsNumber: true })}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="delivery-node-type">Tipo de nodo</FieldLabel>
              <Input
                id="delivery-node-type"
                type="text"
                {...register("deliveryNodeType")}
              />
            </Field>
          </FieldGroup> */}
        </FieldSet>

        <Accordion
          type="single"
          collapsible
          className="rounded-lg border border-slate-200 bg-white shadow-sm"
        >
          <AccordionItem value="backorder" className="border-none">
            <AccordionTrigger className="px-6 py-4 text-base font-semibold hover:no-underline">
              BackOrder inicial
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <FieldGroup className="gap-6">
                <Field>
                  <FieldLabel htmlFor="backorder-global">
                    Valor global (aplica a todos los nodos)
                  </FieldLabel>
                  <FieldDescription>
                    Si defines un valor global, se aplicará a todos los tipos de
                    nodos a menos que los edites individualmente
                  </FieldDescription>
                  <Input
                    id="backorder-global"
                    type="number"
                    min={0}
                    placeholder="0"
                    aria-invalid={!!errors.initialBackorderGlobal}
                    {...register("initialBackorderGlobal", {
                      required: "El valor global es requerido",
                      valueAsNumber: true,
                    })}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? 0 : parseInt(e.target.value);
                      setValue("initialBackorderGlobal", value);
                      // Aplicar valor global a todos los nodos
                      setValue("initialBackorderManufacturer", value);
                      setValue("initialBackorderDistributor", value);
                      setValue("initialBackorderWholesaler", value);
                      setValue("initialBackorderRetail", value);
                    }}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="backorder-manufacturer">
                      Fabricante
                    </FieldLabel>
                    <Input
                      id="backorder-manufacturer"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.initialBackorderManufacturer}
                      {...register("initialBackorderManufacturer", {
                        required: "El valor del fabricante es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="backorder-distributor">
                      Distribuidor
                    </FieldLabel>
                    <Input
                      id="backorder-distributor"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.initialBackorderDistributor}
                      {...register("initialBackorderDistributor", {
                        required: "El valor del distribuidor es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="backorder-wholesaler">
                      Mayorista
                    </FieldLabel>
                    <Input
                      id="backorder-wholesaler"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.initialBackorderWholesaler}
                      {...register("initialBackorderWholesaler", {
                        required: "El valor del mayorista es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="backorder-retail">Retail</FieldLabel>
                    <Input
                      id="backorder-retail"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.initialBackorderRetail}
                      {...register("initialBackorderRetail", {
                        required: "El valor del retail es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                </div>
              </FieldGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion
          type="single"
          collapsible
          className="rounded-lg border border-slate-200 bg-white shadow-sm"
        >
          <AccordionItem value="initial-stock" className="border-none">
            <AccordionTrigger className="px-6 py-4 text-base font-semibold hover:no-underline">
              Stock inicial (Inventario)
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <FieldGroup className="gap-6">
                <Field>
                  <FieldLabel htmlFor="initial-stock-global">
                    Valor global (aplica a todos los nodos)
                  </FieldLabel>
                  <FieldDescription>
                    Si defines un valor global, se aplicará a todos los tipos de
                    nodos a menos que los edites individualmente
                  </FieldDescription>
                  <Input
                    id="initial-stock-global"
                    type="number"
                    min={0}
                    placeholder="0"
                    aria-invalid={!!errors.initialStockGlobal}
                    {...register("initialStockGlobal", {
                      required: "El valor global es requerido",
                      valueAsNumber: true,
                    })}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? 0 : parseInt(e.target.value);
                      setValue("initialStockGlobal", value);
                      setValue("initialStockManufacturer", value);
                      setValue("initialStockDistributor", value);
                      setValue("initialStockWholesaler", value);
                      setValue("initialStockRetail", value);
                    }}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="initial-stock-manufacturer">
                      Fabricante
                    </FieldLabel>
                    <Input
                      id="initial-stock-manufacturer"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.initialStockManufacturer}
                      {...register("initialStockManufacturer", {
                        required: "El valor del fabricante es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="initial-stock-distributor">
                      Distribuidor
                    </FieldLabel>
                    <Input
                      id="initial-stock-distributor"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.initialStockDistributor}
                      {...register("initialStockDistributor", {
                        required: "El valor del distribuidor es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="initial-stock-wholesaler">
                      Mayorista
                    </FieldLabel>
                    <Input
                      id="initial-stock-wholesaler"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.initialStockWholesaler}
                      {...register("initialStockWholesaler", {
                        required: "El valor del mayorista es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="initial-stock-retail">
                      Retail
                    </FieldLabel>
                    <Input
                      id="initial-stock-retail"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.initialStockRetail}
                      {...register("initialStockRetail", {
                        required: "El valor del retail es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                </div>
              </FieldGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion
          type="single"
          collapsible
          className="rounded-lg border border-slate-200 bg-white shadow-sm"
        >
          <AccordionItem value="safety-stock" className="border-none">
            <AccordionTrigger className="px-6 py-4 text-base font-semibold hover:no-underline">
              Stock de seguridad
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <FieldGroup className="gap-6">
                <Field>
                  <FieldLabel htmlFor="safety-stock-global">
                    Valor global (aplica a todos los nodos)
                  </FieldLabel>
                  <FieldDescription>
                    Si defines un valor global, se aplicará a todos los tipos de
                    nodos a menos que los edites individualmente
                  </FieldDescription>
                  <Input
                    id="safety-stock-global"
                    type="number"
                    min={0}
                    placeholder="0"
                    aria-invalid={!!errors.safetyStockGlobal}
                    {...register("safetyStockGlobal", {
                      required: "El valor global es requerido",
                      valueAsNumber: true,
                    })}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? 0 : parseInt(e.target.value);
                      setValue("safetyStockGlobal", value);
                      setValue("safetyStockManufacturer", value);
                      setValue("safetyStockDistributor", value);
                      setValue("safetyStockWholesaler", value);
                      setValue("safetyStockRetail", value);
                    }}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="safety-stock-manufacturer">
                      Fabricante
                    </FieldLabel>
                    <Input
                      id="safety-stock-manufacturer"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.safetyStockManufacturer}
                      {...register("safetyStockManufacturer", {
                        required: "El valor del fabricante es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="safety-stock-distributor">
                      Distribuidor
                    </FieldLabel>
                    <Input
                      id="safety-stock-distributor"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.safetyStockDistributor}
                      {...register("safetyStockDistributor", {
                        required: "El valor del distribuidor es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="safety-stock-wholesaler">
                      Mayorista
                    </FieldLabel>
                    <Input
                      id="safety-stock-wholesaler"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.safetyStockWholesaler}
                      {...register("safetyStockWholesaler", {
                        required: "El valor del mayorista es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="safety-stock-retail">
                      Retail
                    </FieldLabel>
                    <Input
                      id="safety-stock-retail"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.safetyStockRetail}
                      {...register("safetyStockRetail", {
                        required: "El valor del retail es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                </div>
              </FieldGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion
          type="single"
          collapsible
          className="rounded-lg border border-slate-200 bg-white shadow-sm"
        >
          <AccordionItem value="transit-orders" className="border-none">
            <AccordionTrigger className="px-6 py-4 text-base font-semibold hover:no-underline">
              Pedidos en tránsito inicial (Arribos)
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <FieldGroup className="gap-6">
                <Field>
                  <FieldLabel htmlFor="transit-orders-global">
                    Valor global (aplica a todos los nodos)
                  </FieldLabel>
                  <FieldDescription>
                    Si defines un valor global, se aplicará a todos los tipos de
                    nodos a menos que los edites individualmente
                  </FieldDescription>
                  <Input
                    id="transit-orders-global"
                    type="number"
                    min={0}
                    placeholder="0"
                    aria-invalid={!!errors.transitOrdersGlobal}
                    {...register("transitOrdersGlobal", {
                      required: "El valor global es requerido",
                      valueAsNumber: true,
                    })}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? 0 : parseInt(e.target.value);
                      setValue("transitOrdersGlobal", value);
                      setValue("transitOrdersManufacturer", value);
                      setValue("transitOrdersDistributor", value);
                      setValue("transitOrdersWholesaler", value);
                      setValue("transitOrdersRetail", value);
                    }}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="transit-orders-manufacturer">
                      Fabricante
                    </FieldLabel>
                    <Input
                      id="transit-orders-manufacturer"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.transitOrdersManufacturer}
                      {...register("transitOrdersManufacturer", {
                        required: "El valor del fabricante es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="transit-orders-distributor">
                      Distribuidor
                    </FieldLabel>
                    <Input
                      id="transit-orders-distributor"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.transitOrdersDistributor}
                      {...register("transitOrdersDistributor", {
                        required: "El valor del distribuidor es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="transit-orders-wholesaler">
                      Mayorista
                    </FieldLabel>
                    <Input
                      id="transit-orders-wholesaler"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.transitOrdersWholesaler}
                      {...register("transitOrdersWholesaler", {
                        required: "El valor del mayorista es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="transit-orders-retail">
                      Retail
                    </FieldLabel>
                    <Input
                      id="transit-orders-retail"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.transitOrdersRetail}
                      {...register("transitOrdersRetail", {
                        required: "El valor del retail es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                </div>
              </FieldGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion
          type="single"
          collapsible
          className="rounded-lg border border-slate-200 bg-white shadow-sm"
        >
          <AccordionItem value="supply-variability" className="border-none">
            <AccordionTrigger className="px-6 py-4 text-base font-semibold hover:no-underline">
              Variabilidad Suministro
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <FieldGroup className="gap-6">
                <Field>
                  <FieldLabel htmlFor="supply-variability-global">
                    Valor global (aplica a todos los nodos)
                  </FieldLabel>
                  <FieldDescription>
                    Si defines un valor global, se aplicará a todos los tipos de
                    nodos a menos que los edites individualmente
                  </FieldDescription>
                  <Input
                    id="supply-variability-global"
                    type="number"
                    min={0}
                    placeholder="0"
                    aria-invalid={!!errors.supplyVariabilityGlobal}
                    {...register("supplyVariabilityGlobal", {
                      required: "El valor global es requerido",
                      valueAsNumber: true,
                    })}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? 0 : parseInt(e.target.value);
                      setValue("supplyVariabilityGlobal", value);
                      setValue("supplyVariabilityManufacturer", value);
                      setValue("supplyVariabilityDistributor", value);
                      setValue("supplyVariabilityWholesaler", value);
                      setValue("supplyVariabilityRetail", value);
                    }}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="supply-variability-manufacturer">
                      Fabricante
                    </FieldLabel>
                    <Input
                      id="supply-variability-manufacturer"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.supplyVariabilityManufacturer}
                      {...register("supplyVariabilityManufacturer", {
                        required: "El valor del fabricante es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="supply-variability-distributor">
                      Distribuidor
                    </FieldLabel>
                    <Input
                      id="supply-variability-distributor"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.supplyVariabilityDistributor}
                      {...register("supplyVariabilityDistributor", {
                        required: "El valor del distribuidor es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="supply-variability-wholesaler">
                      Mayorista
                    </FieldLabel>
                    <Input
                      id="supply-variability-wholesaler"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.supplyVariabilityWholesaler}
                      {...register("supplyVariabilityWholesaler", {
                        required: "El valor del mayorista es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="supply-variability-retail">
                      Retail
                    </FieldLabel>
                    <Input
                      id="supply-variability-retail"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.supplyVariabilityRetail}
                      {...register("supplyVariabilityRetail", {
                        required: "El valor del retail es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                </div>
              </FieldGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion
          type="single"
          collapsible
          className="rounded-lg border border-slate-200 bg-white shadow-sm"
        >
          <AccordionItem value="lead-time" className="border-none">
            <AccordionTrigger className="px-6 py-4 text-base font-semibold hover:no-underline">
              Lead Time
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <FieldGroup className="gap-6">
                <Field>
                  <FieldLabel htmlFor="lead-time-global">
                    Valor global (aplica a todos los nodos)
                  </FieldLabel>
                  <FieldDescription>
                    Si defines un valor global, se aplicará a todos los tipos de
                    nodos a menos que los edites individualmente
                  </FieldDescription>
                  <Input
                    id="lead-time-global"
                    type="number"
                    min={0}
                    placeholder="0"
                    aria-invalid={!!errors.leadTimeGlobal}
                    {...register("leadTimeGlobal", {
                      required: "El valor global es requerido",
                      valueAsNumber: true,
                    })}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? 0 : parseInt(e.target.value);
                      setValue("leadTimeGlobal", value);
                      setValue("leadTimeManufacturer", value);
                      setValue("leadTimeDistributor", value);
                      setValue("leadTimeWholesaler", value);
                      setValue("leadTimeRetail", value);
                    }}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="lead-time-manufacturer">
                      Fabricante
                    </FieldLabel>
                    <Input
                      id="lead-time-manufacturer"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.leadTimeManufacturer}
                      {...register("leadTimeManufacturer", {
                        required: "El valor del fabricante es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lead-time-distributor">
                      Distribuidor
                    </FieldLabel>
                    <Input
                      id="lead-time-distributor"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.leadTimeDistributor}
                      {...register("leadTimeDistributor", {
                        required: "El valor del distribuidor es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lead-time-wholesaler">
                      Mayorista
                    </FieldLabel>
                    <Input
                      id="lead-time-wholesaler"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.leadTimeWholesaler}
                      {...register("leadTimeWholesaler", {
                        required: "El valor del mayorista es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lead-time-retail">Retail</FieldLabel>
                    <Input
                      id="lead-time-retail"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.leadTimeRetail}
                      {...register("leadTimeRetail", {
                        required: "El valor del retail es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                </div>
              </FieldGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion
          type="single"
          collapsible
          className="rounded-lg border border-slate-200 bg-white shadow-sm"
        >
          <AccordionItem value="lead-time-var" className="border-none">
            <AccordionTrigger className="px-6 py-4 text-base font-semibold hover:no-underline">
              Variabilidad de Lead Time
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <FieldGroup className="gap-6">
                <Field>
                  <FieldLabel htmlFor="lead-time-var-global">
                    Valor global (aplica a todos los nodos)
                  </FieldLabel>
                  <FieldDescription>
                    Si defines un valor global, se aplicará a todos los tipos de
                    nodos a menos que los edites individualmente
                  </FieldDescription>
                  <Input
                    id="lead-time-var-global"
                    type="number"
                    min={0}
                    placeholder="0"
                    aria-invalid={!!errors.leadTimeVarGlobal}
                    {...register("leadTimeVarGlobal", {
                      required: "El valor global es requerido",
                      valueAsNumber: true,
                    })}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? 0 : parseInt(e.target.value);
                      setValue("leadTimeVarGlobal", value);
                      setValue("leadTimeVarManufacturer", value);
                      setValue("leadTimeVarDistributor", value);
                      setValue("leadTimeVarWholesaler", value);
                      setValue("leadTimeVarRetail", value);
                    }}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="lead-time-var-manufacturer">
                      Fabricante
                    </FieldLabel>
                    <Input
                      id="lead-time-var-manufacturer"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.leadTimeVarManufacturer}
                      {...register("leadTimeVarManufacturer", {
                        required: "El valor del fabricante es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lead-time-var-distributor">
                      Distribuidor
                    </FieldLabel>
                    <Input
                      id="lead-time-var-distributor"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.leadTimeVarDistributor}
                      {...register("leadTimeVarDistributor", {
                        required: "El valor del distribuidor es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lead-time-var-wholesaler">
                      Mayorista
                    </FieldLabel>
                    <Input
                      id="lead-time-var-wholesaler"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.leadTimeVarWholesaler}
                      {...register("leadTimeVarWholesaler", {
                        required: "El valor del mayorista es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lead-time-var-retail">
                      Retail
                    </FieldLabel>
                    <Input
                      id="lead-time-var-retail"
                      type="number"
                      min={0}
                      placeholder="0"
                      aria-invalid={!!errors.leadTimeVarRetail}
                      {...register("leadTimeVarRetail", {
                        required: "El valor del retail es requerido",
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                </div>
              </FieldGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <FieldSet className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <FieldLegend>Costos y precios</FieldLegend>
          <FieldGroup className="gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="cost-stock">
                  Costo de inventario
                </FieldLabel>
                <Input
                  id="cost-stock"
                  type="number"
                  min={0}
                  step="0.01"
                  aria-invalid={!!errors.stockCost}
                  {...register("stockCost", {
                    required: "El costo de inventario es requerido",
                    valueAsNumber: true,
                  })}
                />
                <FieldError>{errors.stockCost?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="cost-pending">
                  Costo pedido pendiente (Costo Back Order)
                </FieldLabel>
                <Input
                  id="cost-pending"
                  type="number"
                  min={0}
                  step="0.01"
                  aria-invalid={!!errors.pendingOrderCost}
                  {...register("pendingOrderCost", {
                    required: "El costo de pedido pendiente es requerido",
                    valueAsNumber: true,
                  })}
                />
                <FieldError>{errors.pendingOrderCost?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="cost-purchase">Costo de compra</FieldLabel>
                <Input
                  id="cost-purchase"
                  type="number"
                  min={0}
                  step="0.01"
                  aria-invalid={!!errors.purchaseCost}
                  {...register("purchaseCost", {
                    required: "El costo de compra es requerido",
                    valueAsNumber: true,
                  })}
                />
                <FieldError>{errors.purchaseCost?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="cost-sale">Precio de venta</FieldLabel>
                <Input
                  id="cost-sale"
                  type="number"
                  min={0}
                  step="0.01"
                  aria-invalid={!!errors.salePrice}
                  {...register("salePrice", {
                    required: "El precio de venta es requerido",
                    valueAsNumber: true,
                  })}
                />
                <FieldError>{errors.salePrice?.message}</FieldError>
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="cost-node-type">Tipo de nodo</FieldLabel>
              <Input
                id="cost-node-type"
                type="text"
                aria-invalid={!!errors.costsNodeType}
                {...register("costsNodeType", {
                  required: "El tipo de nodo es requerido",
                })}
              />
              <FieldError>{errors.costsNodeType?.message}</FieldError>
            </Field>
          </FieldGroup>
        </FieldSet>

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

        {/* <FieldSet className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <FieldLegend>Reclamo inicial</FieldLegend>
          <FieldGroup className="gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="initial-period">Periodo</FieldLabel>
                <Input
                  id="initial-period"
                  name="initial.period_number"
                  type="number"
                  min={0}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="initial-claim">
                  Valor del reclamo
                </FieldLabel>
                <Input
                  id="initial-claim"
                  name="initial.claim_value"
                  type="number"
                  min={0}
                  step="0.01"
                />
              </Field>
            </div>
          </FieldGroup>
        </FieldSet> */}

        <FieldSet className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <FieldLegend>Restricciones de pedidos</FieldLegend>
          <FieldGroup className="gap-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="restriction-minimum">Mínimo</FieldLabel>
                <Input
                  id="restriction-minimum"
                  type="number"
                  min={0}
                  aria-invalid={!!errors.restrictionMinimum}
                  {...register("restrictionMinimum", {
                    required: "El mínimo es requerido",
                    valueAsNumber: true,
                  })}
                />
                <FieldError>{errors.restrictionMinimum?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="restriction-maximum">Máximo</FieldLabel>
                <Input
                  id="restriction-maximum"
                  type="number"
                  min={0}
                  aria-invalid={!!errors.restrictionMaximum}
                  {...register("restrictionMaximum", {
                    required: "El máximo es requerido",
                    valueAsNumber: true,
                  })}
                />
                <FieldError>{errors.restrictionMaximum?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="restriction-batch">
                  Múltiplo de pedido (factor de lote)
                </FieldLabel>
                <Input
                  id="restriction-batch"
                  type="number"
                  min={0}
                  aria-invalid={!!errors.restrictionBatchSize}
                  {...register("restrictionBatchSize", {
                    required: "El múltiplo de pedido es requerido",
                    valueAsNumber: true,
                  })}
                />
                <FieldError>{errors.restrictionBatchSize?.message}</FieldError>
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="restriction-node-type">
                Tipo de nodo
              </FieldLabel>
              <FieldDescription>
                Define los parámetros operativos permitidos para cada pedido.
              </FieldDescription>
              <Input
                id="restriction-node-type"
                type="text"
                aria-invalid={!!errors.restrictionNodeType}
                {...register("restrictionNodeType", {
                  required: "El tipo de nodo es requerido",
                })}
              />
              <FieldError>{errors.restrictionNodeType?.message}</FieldError>
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <FieldLegend>Alertas de inventario</FieldLegend>
          <FieldGroup className="gap-6">
            <Field>
              <FieldLabel htmlFor="notification-node-type">
                Tipo de nodo
              </FieldLabel>
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

        <Field
          orientation="responsive"
          className="border-t border-slate-200 pt-6 @md/field-group:justify-end gap-3"
        >
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 sm:w-auto"
            onClick={() => reset()}
          >
            Limpiar
          </Button>
          <Button
            type="submit"
            className="w-full gap-2 bg-violet-600 text-white hover:bg-violet-500 focus-visible:ring-violet-500/50 sm:w-auto"
          >
            Guardar juego
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
