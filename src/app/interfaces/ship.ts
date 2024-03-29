export interface Ship {
  name: string;
  id: string;
  level: number;
  faction: string;
  rarity: string;
  hull: string;
  fallbackThumbnail: string;
  techStat?: string;
  techBonus?: number;
  appliedHulls?: string[];
  hasRetrofit: boolean;
  obtainStat?: string;
  obtainBonus?: number;
  retroHull: string;
  retroThumbnail: string;
  isObtained: boolean;
  obtainAppliedHulls?: string[];
  techPoints?: {
    obtain: number;
    maxLimitBreak: number;
    maxLevel: number;
  }

  // all vars below are used for code purposes and are not actual properties

  isBulkSelected?: boolean;
}

export interface LocalShip {
  id: string;
  level: number;
  isObtained: boolean;
}