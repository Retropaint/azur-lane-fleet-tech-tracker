import { Ship } from "./ship";

export interface ShipCategory {
  ships: Ship[];
  sortId: number;
  title: string;
}
