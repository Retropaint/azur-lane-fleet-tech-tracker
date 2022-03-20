import { Ship } from "./ship";

export interface ShipCategory {
  ships: Ship[];
  isAffectedByFilter: boolean;
  sortId: number;
  title: string;
}
