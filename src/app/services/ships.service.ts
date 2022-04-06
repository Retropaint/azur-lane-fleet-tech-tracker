import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Ship } from '../interfaces/ship';
import { CogReqsService } from './cog-reqs.service';
import { IconLoaderService } from './icon-loader.service';

@Injectable({
  providedIn: 'root'
})
export class ShipsService {

  ships: Ship[] = [];
  cogReqs: number = 0;

  constructor(private storage: Storage, private cogReqList: CogReqsService) {}

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
  setAllProperShipPos(shipArray) {
    
    const shipTypes: Ship[][] = [[], [], []];
    shipArray.forEach(ship => {
      switch(this.getShipStatus(ship)) {
        case "ignored":
          shipTypes[2].push(ship);
        break; case "maxed":
          shipTypes[1].push(ship);
        break; default:
          shipTypes[0].push(ship);
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
    if(ship.isIgnored) {
      return "ignored";
    } else if(ship.level >= 120) {
      return "maxed";
    }
    return "normal";
  }

  refreshCogChipReq(shipsFilterPass) {
    this.cogReqs = 0;
    Object.keys(shipsFilterPass).forEach(id => {
      const ship = this.getById(id);

      // store as value, as it will be incremented when checking
      let level = ship.level;
      
      if(shipsFilterPass[id] && level <= 115 && !ship.isIgnored) {
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
}
