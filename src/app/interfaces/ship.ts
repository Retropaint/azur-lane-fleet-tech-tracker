import { ShipCategory } from "./ship-category";

export interface Ship {
  name: string;
  id: string;
  level: number;
  faction: string;
  rarity: string;
  hull: string;
  thumbnail: string;
  onlyApplicableHulls: string[]; // for ships whose tech doesn't apply to all hulls of their type, eg Elbe, Weser, Perseus
  techStat: string;
  techBonus: number;
  appliedHulls: string[];
  isIgnored?: boolean
}
