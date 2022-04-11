import { ShipCategory } from "./ship-category";

export interface Ship {
  name: string;
  id: string;
  level: number;
  faction: string;
  rarity: string;
  hull: string;
  thumbnail: string;
  techStat: string;
  techBonus: number;
  appliedHulls: string[];
  isIgnored?: boolean;
  hasRetrofit: boolean;
  obtainStat: string;
  obtainBonus: number;
}
