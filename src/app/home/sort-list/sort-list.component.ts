import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Ship } from 'src/app/interfaces/ship';
import { FilterService } from 'src/app/services/filter.service';
import { ShipCategoryDataService } from 'src/app/services/ship-category-data.service';

@Component({
  selector: 'app-sort-list',
  templateUrl: './sort-list.component.html',
  styleUrls: ['./sort-list.component.scss', '../icon-ui/icon-ui.component.scss', '../home.page.scss'],
})
export class SortListComponent implements OnInit {

  objectKeys = Object.keys;

  types = {
    "Rarity": false,
    "Level": false,
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

  constructor(private shipCategoryData: ShipCategoryDataService, private filter: FilterService, private storage: Storage) { }

  ngOnInit() {}

  async sort(type: string) {
    this.types[type] = !this.types[type];
    
    if(await this.storage.get("icon-ui")) {
      this.iconSort(type);
    } else {
      this.sheetSort(type);
    }
    
    this.shipCategoryData.save();
    this.filter.filter();
  }

  iconSort(type: string) {
    this.sortCategory(this.shipCategoryData.selectedCategory, type);
  }

  sheetSort(type: string) {
    Object.keys(this.shipCategoryData.categories).forEach(category => {
      this.sortCategory(category, type);
    })
  }

  sortCategory(category, type) {
    const shipValue = type.toLowerCase();
    if(type == "Rarity") {
      this.shipCategoryData.categories[category].ships.sort((a: Ship, b: Ship) => {
        if(this.types[type] && this.rarityRanks[a[shipValue]] > this.rarityRanks[b[shipValue]] || 
          !this.types[type] && this.rarityRanks[a[shipValue]] < this.rarityRanks[b[shipValue]]) {
          return 1;
        } else {
          return -1;
        }
      })
    } else if(type == "Level") {
      this.shipCategoryData.categories[category].ships.sort((a: Ship, b: Ship) => {
        if(this.types[type] && parseInt(a[shipValue]) > parseInt(b[shipValue]) || 
          !this.types[type] && parseInt(a[shipValue]) < parseInt(b[shipValue])) {
          return 1;
        } else {
          return -1;
        }
      })
    } else {
      this.shipCategoryData.categories[category].ships.sort((a: Ship, b: Ship) => {
        if(this.types[type] && a[shipValue] > b[shipValue] ||
          !this.types[type] && a[shipValue] < b[shipValue]) {
          return 1;
        } else {
          return -1;
        }
      })
    }
  }
}
