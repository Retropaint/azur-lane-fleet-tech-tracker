import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { LocalShip, Ship } from '../interfaces/ship';
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
    let localShips: LocalShip[] = [];
    this.ships.forEach(ship => {
      localShips.push(
        {
          id: ship.id,
          level: ship.level,
          isObtained: ship.isObtained
        }
      )  
    })

    this.storage.set("ships", localShips);
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
    let lastWIP: number = 0;
    let lastUnobtained: number = 0;
    let lastMaxed: number = 0;
    
    let newArray: Ship[] = [];
    for(let i = 0; i < shipArray.length; i++) {
      switch(this.getShipStatus(shipArray[i])) {
        case "obtained":
          newArray.splice(lastWIP, 0, shipArray[i]);
          lastWIP++;
          lastUnobtained++;
          lastMaxed++;   
        break; case "maxed":
          newArray.splice(lastMaxed, 0, shipArray[i]);
          lastMaxed++;
        break; default:
          newArray.splice(lastUnobtained, 0, shipArray[i]);
          lastMaxed++; 
          lastUnobtained++;
        break;
      }
    }

    return newArray;
  }

  getShipStatus(ship): string {
    if(!ship.isObtained) {
      return "unobtained";
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

        // prepare ship level for calculation
        if(level < 100) {
          level = 100;
        } else {
          // ceil level to every 5th 
          if(level%5 != 0) {
            level += (5 - (level%5));
          }
        }
        
        // cog calculation
        for(let i = level; i < 120; i += 5) {
          
          // don't include cogs of exact level
          if(i == ship.level) {
            level += 5;
          } else {
            this.cogReqs += this.cogReqList.data[ship.rarity + " " + level];
            level += 5;
          }
        }
      }
    })
  }

  getByName(name: string): Ship {
    return this.ships.find(ship => ship.name == name)
  }

  getRetroRarity(id: string): string {
    if(!this.getById(id).hasRetrofit || this.settingsData.settings['retrofit-forms'] == 'No') {
      return this.getById(id).rarity;
    }
    const rarities = ["Common", "Rare", "Elite", "Super-Rare", "Ultra-Rare"];
    
    const ship = this.ships.find(ship => ship.id == id)
    return rarities[rarities.indexOf(ship.rarity) + 1];
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
}
