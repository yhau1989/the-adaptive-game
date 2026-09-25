import type { IDemandValue, TimeUnit } from "@/types/general-types";

export interface GameFormData {
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
  purchaseCostGlobal: number;
  purchaseCostManufacturer: number;
  purchaseCostDistributor: number;
  purchaseCostWholesaler: number;
  purchaseCostRetail: number;
  salePriceGlobal: number;
  salePriceManufacturer: number;
  salePriceDistributor: number;
  salePriceWholesaler: number;
  salePriceRetail: number;
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
