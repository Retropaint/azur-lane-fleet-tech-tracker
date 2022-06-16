import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Ship } from '../interfaces/ship';
import { CogReqsService } from './cog-reqs.service';
import { FactionTechDataService } from './faction-tech-data.service';
import { HullHierarchyService } from './hull-hierarchy.service';
import { MiscService } from './misc.service';
import { SettingsDataService } from './settings-data.service';

@Injectable({
  providedIn: 'root'
})
export class ShipsService {

  ships: Ship[] = [];
  cogReqs: number = 0;
  quickTechMax = {};
  quickTechTotal = {};

  // can be used to 'refresh' the tech view
  lastQuickTechStat: string;
  lastQuickTechHull: string;

  constructor(
    private storage: Storage, 
    private cogReqList: CogReqsService, 
    private settingsData: SettingsDataService,
    private factionTechData: FactionTechDataService,
    private hullHierarchy: HullHierarchyService,
    private misc: MiscService
  ) {}

  async init() {
    this.ships = await this.storage.get("ships") || [];
    this.setAllProperShipPos(this.ships);
  }

  save() {
    this.storage.set("ships", this.ships);
  }

  getById(id: string): Ship {
    for(const ship of this.ships) {
      if(ship.id == id) {
        return ship;
      }
    }
  }

  // set normal, maxed, and ignored ships in their respective positions
  setAllProperShipPos(shipArray): Ship[] {
    if(!this.misc.considerStatusSorting) {
      return shipArray;
    }
    
    const shipTypes: Ship[][] = [[], [], []];
    shipArray.forEach(ship => {
      switch(this.getShipStatus(ship)) {
        case "obtained":
          shipTypes[0].push(ship);
        break; case "maxed":
          shipTypes[2].push(ship);
        break; default:
          shipTypes[1].push(ship);
        break;
      }
    })

    // concatenate all types
    shipArray = [];
    for(let i = 0; i < 3; i++) {
      for(let j = 0; j < shipTypes[i].length; j++) {
        shipArray.push(shipTypes[i][j]);
      }
    }
    return shipArray;
  }

  getShipStatus(ship): string {
    if(!ship.isObtained) {
      return "ignored";
    } else if(ship.level >= 120) {
      return "maxed";
    } else if(ship.isObtained) {
      return "obtained";
    }
  }

  refreshCogChipReq(shipsFilterPass) {
    this.cogReqs = 0;
    Object.keys(shipsFilterPass).forEach(id => {
      const ship = this.getById(id);

      // store as value, as it will be incremented when checking
      let level = ship.level;
      
      if(shipsFilterPass[id] && level <= 115 && ship.isObtained) {
        if(level < 100) {
          level = 100;
        } else {
          // ceil level to every 5th 
          if(level%5 != 0) {
            level += (5 - (level%5));
          }
        }
        
        for(let i = level; i < 120; i += 5) {
          this.cogReqs += this.cogReqList.data[ship.rarity + " " + level];
          level += 5;
        }
      }
    })
  }

  getByName(name: string): Ship {
    for(const ship of this.ships) {
      if(ship.name == name) {
        return ship;
      }
    }
  }

  getRetroRarity(id: string): string {
    if(!this.getById(id).hasRetrofit || this.settingsData.settings['retrofit-form'] == 'No') {
      return this.getById(id).rarity;
    }
    const rarities = ["Common", "Rare", "Elite", "Super-Rare", "Ultra-Rare"];
    
    for(const ship of this.ships) {
      if(ship.id == id) {
        return rarities[rarities.indexOf(ship.rarity) + 1];
      }
    }
  }

  // called by hull info panel
  getAlphabeticalOrder() {
    return this.ships.sort((a: Ship, b: Ship) => {
      if(a.name > b.name) { 
        return 1;
      } else {
        return -1;
      }
    })
  }

  quickTechView(stat, hull) {
    if(stat == null || hull == null) {
      return;
    }

    this.lastQuickTechStat = stat;
    this.lastQuickTechHull = hull;

    this.hullHierarchy.hulls[hull].forEach(hull => {
      this.quickTechMax[hull] = this.getMaxTechOf(stat, hull);
    })
    this.hullHierarchy.hulls[hull].forEach(hull => {
      this.quickTechTotal[hull] = this.getTotalTechOf(stat, hull);
    })
  }

  getMaxTechOf(stat, hull) {
    return this.getTech(false, this.factionTechData.maxLevels, stat, hull);
  }

  getTotalTechOf(stat, hull) {
    return this.getTech(true, this.factionTechData.levels, stat, hull);
  }

  getTech(checkShipReqs: boolean, factionDataLevelType: any, stat: string, hull: string) {
    let returnedStat = 0;

    // get tech from faction
    const factionNames = ['USS', 'HMS', 'IJN', 'KMS'];
    factionNames.forEach(name => {
      const stats = this.factionTechData.getTotalStats(name, factionDataLevelType[name]);
      if(stats[hull] != null) {
        if(stats[hull][stat] != null) {
          returnedStat += stats[hull][stat];
        }
      }
    })

    // get tech from ship
    this.ships.forEach(ship => {
      if(ship.isObtained || !checkShipReqs) {
        ship.obtainAppliedHulls.forEach(appliedHull => {
          if(appliedHull == hull) {
            if(ship.obtainStat == stat) {
              returnedStat += ship.obtainBonus
            }
          }
        })
      }
      if(ship.level >= 120 || !checkShipReqs) {
        ship.appliedHulls.forEach(appliedHull => {
          if(appliedHull == hull) {
            if(ship.techStat == stat) {
              returnedStat += ship.techBonus;
            }
          }
        })
      }
    })

    return returnedStat;
  }
}
