import { Injectable } from '@angular/core';
import { Ship } from '../interfaces/ship';
import { FilterService } from './filter.service';
import { ShipCategoryDataService } from './ship-category-data.service';

@Injectable({
  providedIn: 'root'
})
export class SortService {

  isAscending = {
    "Level": false,
    "Rarity": false,
    "Name": false
  }

  rarityRanks = {
    "Normal": 0,
    "Rare": 1,
    "Elite": 2,
    "Super-Rare": 3,
    "Ultra-Rare": 4,
    "Decisive": 4
  }

  lastType: string;

  constructor(private shipCategoryData: ShipCategoryDataService, private filter: FilterService) {}

  allSort(type: string, useCurrentToggle: boolean = false) {
    Object.keys(this.shipCategoryData.categories).forEach(category => {
      this.sort(type, category, useCurrentToggle);
    })
  }

  sort(type: string, category: string, useCurrentToggle: boolean = false) {
    this.lastType = type;

    if(useCurrentToggle) {
      // switch toggle now, and then turn it back the other way once the sorting is done
      this.isAscending[type] = !this.isAscending[type];
    }

    switch(type) {
      case "Level":
        this.shipCategoryData.categories[category].ships.sort((a: Ship, b: Ship) => {
          if(!this.isAscending[type] && a.level > b.level || 
            this.isAscending[type] && a.level < b.level) {
            return 1;
          } else {
            return -1;
          }
        })
      break; case "Rarity":
        this.shipCategoryData.categories[category].ships.sort((a: Ship, b: Ship) => {
          if(!this.isAscending[type] && this.rarityRanks[a.rarity] > this.rarityRanks[b.rarity] || 
            this.isAscending[type] && this.rarityRanks[a.rarity] < this.rarityRanks[b.rarity]) {
            return 1;
          } else {
            return -1;
          }
        })
      break; case "Name":
        this.shipCategoryData.categories[category].ships.sort((a: Ship, b: Ship) => {
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

    this.shipCategoryData.save();
    this.filter.filter();
  }
}
