"use client";

// Form completo de creación de juego.
//
// AGENTS.md §6: este archivo solo orquesta las secciones (cada una
// vive en `_sections/*` y mide < 200 líneas). El estado y la validación
// viven aquí vía react-hook-form; las secciones consumen el contexto con
// `useFormContext`.

import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@repo/ui/button";
import { Field, FieldGroup, FieldError } from "@repo/ui/field";

import { TimeUnit } from "@/types/general-types";

import type { GameFormData } from "./_sections/types";
import { GeneralInfoSection } from "./_sections/general-info-section";
import { GameConfigSection } from "./_sections/game-config-section";
import { DemandSection } from "./_sections/demand-section";
import { NodeDistributionSection } from "./_sections/node-distribution-section";
import { CostsSection } from "./_sections/costs-section";
import { EventsMessageSection } from "./_sections/events-message-section";
import { RestrictionsSection } from "./_sections/restrictions-section";
import { NotificationsSection } from "./_sections/notifications-section";

const defaultValues: GameFormData = {
  // Información general
  name: "",
  description: "",
  startDate: "",
  endDate: "",

  // Configuración del juego
  businessName: "",
  periods: 0,
  periodType: TimeUnit.Weeks,
  product: "",

  // Demanda
  demandValues: [],
  deliveryTime: 0,
  deliveryVariability: 0,
  deliveryNodeType: "",

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
  purchaseCostGlobal: 0,
  purchaseCostManufacturer: 0,
  purchaseCostDistributor: 0,
  purchaseCostWholesaler: 0,
  purchaseCostRetail: 0,
  salePriceGlobal: 0,
  salePriceManufacturer: 0,
  salePriceDistributor: 0,
  salePriceWholesaler: 0,
  salePriceRetail: 0,
  costsNodeType: "",

  // Eventos
  eventsNodeType: "",
  eventsPeriod: 0,
  eventsMessage: "",

  // Restricciones
  restrictionMinimum: 0,
  restrictionMaximum: 0,
  restrictionBatchSize: 0,
  restrictionNodeType: "",

  // Alertas
  notificationNodeType: "",
  notificationMessage: "",
};

export function GameCreateForm() {
  const methods = useForm<GameFormData>({
    defaultValues,
  });

  const onSubmit = (data: GameFormData) => {
    // TODO: conectar con Server Action para persistir el juego.
    // Dejado en `console.debug` para no contaminar consola de prod.
    if (process.env.NODE_ENV !== "production") {
      console.debug("[GameCreateForm] submit", data);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className="mx-auto mt-6 w-full max-w-4xl"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <FieldGroup className="gap-8">
          <GeneralInfoSection />
          <GameConfigSection />
          <DemandSection />
          <NodeDistributionSection
            field="initialBackorder"
            title="BackOrder inicial"
            idPrefix="backorder"
          />
          <NodeDistributionSection
            field="initialStock"
            title="Stock inicial (Inventario)"
            idPrefix="initial-stock"
          />
          <NodeDistributionSection
            field="safetyStock"
            title="Stock de seguridad"
            idPrefix="safety-stock"
          />
          <NodeDistributionSection
            field="transitOrders"
            title="Pedidos en tránsito inicial (Arribos)"
            idPrefix="transit-orders"
          />
          <NodeDistributionSection
            field="supplyVariability"
            title="Variabilidad Suministro"
            idPrefix="supply-variability"
          />
          <NodeDistributionSection
            field="leadTime"
            title="Lead Time"
            idPrefix="lead-time"
          />
          <NodeDistributionSection
            field="leadTimeVar"
            title="Variabilidad de Lead Time"
            idPrefix="lead-time-var"
          />
          <CostsSection />
          <EventsMessageSection />
          <RestrictionsSection />
          <NotificationsSection />

          <Field
            orientation="responsive"
            className="border-t border-slate-200 pt-6 @md/field-group:justify-end gap-3"
          >
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 sm:w-auto"
              onClick={() => methods.reset()}
            >
              Limpiar
            </Button>
            <Button
              type="submit"
              variant="default"
              className="w-full gap-2 sm:w-auto"
            >
              Guardar juego
            </Button>
            {Object.keys(methods.formState.errors).length > 0 ? (
              <FieldError>
                Hay errores en el formulario. Revisa los campos marcados.
              </FieldError>
            ) : null}
          </Field>
        </FieldGroup>
      </form>
    </FormProvider>
  );
}
