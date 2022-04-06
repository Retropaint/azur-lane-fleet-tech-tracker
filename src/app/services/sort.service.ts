import { Injectable } from '@angular/core';
import { Ship } from '../interfaces/ship';
import { FilterService } from './filter.service';
import { ShipsService } from './ships.service';

@Injectable({
  providedIn: 'root'
})
export class SortService {

  lastType: string;

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

  constructor(private filter: FilterService, private ships: ShipsService) {}

  sort(type: string, useCurrentToggle: boolean = false) {
    this.lastType = type;

    if(useCurrentToggle) {
      // switch toggle now, and then turn it back the other way once the sorting is done
      this.isAscending[type] = !this.isAscending[type];
    }

    switch(type) {
      case "Level":
        this.ships.ships.sort((a: Ship, b: Ship) => {
          if(!this.isAscending[type] && a.level > b.level || 
            this.isAscending[type] && a.level < b.level) {
            return 1;
          } else {
            return -1;
          }
        })
      break; case "Rarity":
        this.ships.ships.sort((a: Ship, b: Ship) => {
          if(!this.isAscending[type] && this.rarityRanks[a.rarity] > this.rarityRanks[b.rarity] || 
            this.isAscending[type] && this.rarityRanks[a.rarity] < this.rarityRanks[b.rarity]) {
            return 1;
          } else {
            return -1;
          }
        })
      break; case "Name":
        this.ships.ships.sort((a: Ship, b: Ship) => {
          if(!this.isAscending[type] && a.name > b.name || 
            this.isAscending[type] && a.name < b.name) {
            return 1;
          } else {
            return -1;
          }
        })
      break;
    }
    this.isAscending[type] = !this.isAscending[type];

    this.ships.save();
    this.filter.filter();
  }
}
