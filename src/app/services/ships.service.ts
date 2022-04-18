import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Ship } from '../interfaces/ship';
import { CogReqsService } from './cog-reqs.service';
import { IconLoaderService } from './icon-loader.service';
import { SettingsDataService } from './settings-data.service';

@Injectable({
  providedIn: 'root'
})
export class ShipsService {

  ships: Ship[] = [];
  cogReqs: number = 0;

  constructor(private storage: Storage, private cogReqList: CogReqsService, private settingsData: SettingsDataService) {}

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
    
    const shipTypes: Ship[][] = [[], [], []];
    shipArray.forEach(ship => {
      switch(this.getShipStatus(ship)) {
        case "obtained":
          shipTypes[0].push(ship);
        break; case "maxed":
          shipTypes[1].push(ship);
        break; default:
          shipTypes[2].push(ship);
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
}
