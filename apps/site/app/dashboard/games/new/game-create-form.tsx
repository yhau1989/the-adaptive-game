"use client";

import { useCallback, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
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

export function GameCreateForm() {
  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: conectar con acción del servidor para persistir la creación del juego.
  }, []);

  return (
    <form className="mx-auto mt-6 w-full max-w-4xl" onSubmit={handleSubmit}>
      <FieldGroup className="gap-8">
        <FieldSet className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <FieldLegend>Información general</FieldLegend>
          <FieldGroup className="gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="game-name">Nombre</FieldLabel>
                <Input id="game-name" name="game.name" type="text" required />
              </Field>
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="game-description">Descripción</FieldLabel>
                <Textarea
                  id="game-description"
                  name="game.description"
                  className="min-h-24 resize-none"
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="game-start-date">
                  Fecha de inicio
                </FieldLabel>
                <Input
                  id="game-start-date"
                  name="game.start_date"
                  type="date"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="game-end-date">Fecha de cierre</FieldLabel>
                <Input
                  id="game-end-date"
                  name="game.end_date"
                  type="date"
                  required
                />
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>

        <FieldSet className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <FieldLegend>Configuración del juego</FieldLegend>
          <FieldGroup className="gap-6">
            <Field>
              <FieldLabel htmlFor="configuration-business-name">
                Nombre comercial
              </FieldLabel>
              <Input
                id="configuration-business-name"
                name="configuration.bussiness_name"
                type="text"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="configuration-periods">
                  Periodos
                </FieldLabel>
                <Input
                  id="configuration-periods"
                  name="configuration.periods"
                  type="number"
                  min={0}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="configuration-period-type">
                  Tipo de periodo
                </FieldLabel>
                <Select name="configuration.period_type" defaultValue="weeks">
                  <SelectTrigger
                    id="configuration-period-type"
                    className="w-full justify-between"
                  >
                    <SelectValue placeholder="Selecciona un periodo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weeks">Semanas</SelectItem>
                    <SelectItem value="days">Días</SelectItem>
                    <SelectItem value="hours">Horas</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="configuration-product">
                  Producto
                </FieldLabel>
                <Input
                  id="configuration-product"
                  name="configuration.product"
                  type="text"
                  required
                />
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>

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
                  name="costs.stock_cost"
                  type="number"
                  min={0}
                  step="0.01"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="cost-pending">
                  Costo pedido pendiente
                </FieldLabel>
                <Input
                  id="cost-pending"
                  name="costs.cost_pending_order"
                  type="number"
                  min={0}
                  step="0.01"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="cost-purchase">Costo de compra</FieldLabel>
                <Input
                  id="cost-purchase"
                  name="costs.purchase_cost"
                  type="number"
                  min={0}
                  step="0.01"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="cost-sale">Precio de venta</FieldLabel>
                <Input
                  id="cost-sale"
                  name="costs.sale_price"
                  type="number"
                  min={0}
                  step="0.01"
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="cost-node-type">Tipo de nodo</FieldLabel>
              <Input id="cost-node-type" name="costs.node_type" type="text" />
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <FieldLegend>Tiempos de entrega</FieldLegend>
          <FieldGroup className="gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="delivery-time">Tiempo</FieldLabel>
                <Input
                  id="delivery-time"
                  name="delivery.time"
                  type="number"
                  min={0}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="delivery-variability">
                  Variabilidad
                </FieldLabel>
                <Input
                  id="delivery-variability"
                  name="delivery.variability"
                  type="number"
                  min={0}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="delivery-node-type">Tipo de nodo</FieldLabel>
              <Input
                id="delivery-node-type"
                name="delivery.node_type"
                type="text"
              />
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
                  name="events.node_type"
                  type="text"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="events-period">Periodo</FieldLabel>
                <Input
                  id="events-period"
                  name="events.period"
                  type="number"
                  min={0}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="events-message">Mensaje</FieldLabel>
              <Textarea
                id="events-message"
                name="events.message"
                className="min-h-24 resize-none"
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
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
        </FieldSet>

        <FieldSet className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <FieldLegend>Inventario inicial</FieldLegend>
          <FieldGroup className="gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="stock-stock">Inventario</FieldLabel>
                <Input
                  id="stock-stock"
                  name="initial_stock.stock"
                  type="number"
                  min={0}
                  step="0.01"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="stock-order">Pedido inicial</FieldLabel>
                <Input
                  id="stock-order"
                  name="initial_stock.initial_order"
                  type="number"
                  min={0}
                  step="0.01"
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="stock-node-type">Tipo de nodo</FieldLabel>
              <Input
                id="stock-node-type"
                name="initial_stock.node_type"
                type="text"
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <FieldLegend>Restricciones de pedidos</FieldLegend>
          <FieldGroup className="gap-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="restriction-minimum">Mínimo</FieldLabel>
                <Input
                  id="restriction-minimum"
                  name="order_restriction.minimum"
                  type="number"
                  min={0}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="restriction-maximum">Máximo</FieldLabel>
                <Input
                  id="restriction-maximum"
                  name="order_restriction.maximum"
                  type="number"
                  min={0}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="restriction-batch">
                  Tamaño de lote
                </FieldLabel>
                <Input
                  id="restriction-batch"
                  name="order_restriction.batch_size"
                  type="number"
                  min={0}
                />
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
                name="order_restriction.node_type"
                type="text"
              />
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
                name="stock_notification.node_type"
                type="text"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="notification-message">Mensaje</FieldLabel>
              <Textarea
                id="notification-message"
                name="stock_notification.message"
                className="min-h-24 resize-none"
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        <Field
          orientation="responsive"
          className="border-t border-slate-200 pt-6 @md/field-group:justify-end gap-3"
        >
          <Button
            type="reset"
            variant="outline"
            className="w-full gap-2 sm:w-auto"
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
