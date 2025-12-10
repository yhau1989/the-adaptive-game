export enum TimeUnit {
  Weeks = "weeks",
  Days = "days",
  Hours = "hours",
}

export interface IDemandValue {
  period: number;
  values: number;
}
