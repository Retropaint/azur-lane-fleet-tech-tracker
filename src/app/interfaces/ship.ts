import { ShipCategory } from "./ship-category";

export interface Ship {
  name: string;
  id: string;
  level: number;
  faction: string;
  rarity: string;
  hull: string;
  fallbackThumbnail: string;
  techStat: string;
  techBonus: number;
  appliedHulls: string[];
  hasRetrofit: boolean;
  obtainStat: string;
  obtainBonus: number;
  retroHull: string;
  isObtained?: boolean;
}
