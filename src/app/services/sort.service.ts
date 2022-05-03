import { Injectable } from '@angular/core';
import { Ship } from '../interfaces/ship';
import { MiscService } from './misc.service';
import { ShipsService } from './ships.service';

@Injectable({
  providedIn: 'root'
})
export class SortService {

  lastType: string = "Name";

  isAscending = {
    "Level": false,
    "Rarity": false,
    "Name": false
  }

  rarityRanks = {
    "Common": 0,
    "Rare": 1,
    "Elite": 2,
    "Super-Rare": 3,
    "Ultra-Rare": 4,
  }

  constructor(private shipsService: ShipsService, private misc: MiscService) {}

  sort(type: string, keepState: boolean = false) {
    this.lastType = type;

    if(!keepState) {
      this.isAscending[type] = !this.isAscending[type];
    }

    this.misc.refreshIconList();
  }

  immediateSort(array: Ship[]) {
    switch(this.lastType) {
      case "Level":
        return array.sort((a: Ship, b: Ship) => {
          if(a.level == b.level) {
            return 0;
          }
          if(!this.isAscending["Level"] && a.level < b.level || 
              this.isAscending["Level"] && a.level > b.level) {
            return 1;
          } else {
            return -1;
          }
        })
      case "Rarity":
        return array.sort((a: Ship, b: Ship) => {
          let aRarity = this.shipsService.getRetroRarity(a.id);
          let bRarity = this.shipsService.getRetroRarity(b.id);
          if(this.rarityRanks[aRarity] == this.rarityRanks[bRarity]) {
            return 0;
          }
          if(!this.isAscending["Rarity"] && this.rarityRanks[aRarity] < this.rarityRanks[bRarity] || 
              this.isAscending["Rarity"] && this.rarityRanks[aRarity] > this.rarityRanks[bRarity]) {
            return 1;
          } else {
            return -1;
          }
        })
      case "Name":
        return array.sort((a: Ship, b: Ship) => {
          if(a.name == b.name) {
            return 0;
          }
          if(!this.isAscending["Name"] && a.name < b.name || 
              this.isAscending["Name"] && a.name > b.name) {
            return 1;
          } else {
            return -1;
          }
        })
    }
  }
}
