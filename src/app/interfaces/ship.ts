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
  obtainAppliedHulls: string[];

  // all vars below are used for code purposes and are not actual properties

  isBulkSelected?: boolean;
  // cards are recreated on edits, so this keeps track of which one was so it can flash
  isEdited?: boolean;

  // check if card was initiated due to virtual scrolling or refresh
  isVisible?: boolean;
}
