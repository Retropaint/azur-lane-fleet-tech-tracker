import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { PresetSelectionComponent } from 'src/app/prompts/preset-selection/preset-selection.component';
import { Ship } from '../interfaces/ship';
import { ShipCategory } from '../interfaces/ship-category';

@Injectable({
  providedIn: 'root'
})
export class ShipCategoryDataService {

  categories = {};
  allShips = [];
  sortedCategoryNames: string[] = [] // used by home page to sort by sortId
  loadedShips = [];
  selectedCategory: string;
  hasLoaded: boolean;

  constructor(private storage: Storage, private modalController: ModalController) {}

  async init() {
    this.categories = await this.storage.get("categories") || {};
    this.sort();
  }

  save() {
    this.storage.set("categories", this.categories);
  }

  sort() {
    this.sortedCategoryNames = [];
    let index = 0;
    while(index < Object.keys(this.categories).length) {
      Object.keys(this.categories).forEach(category => {
          if(this.categories[category].sortId == index) {
            this.sortedCategoryNames.push(category);
            index++;
            return;
          }
      })
    }
  }

  decrementSortIds(startingId: number) {
    Object.keys(this.categories).forEach(category => {
      if(this.categories[category].sortId > startingId) {
        this.categories[category].sortId--;
      }
    })
  }

  async promptPreset() {
    const modal = await this.modalController.create({
      component: PresetSelectionComponent,
      animated: false
    })
    modal.present();
    await modal.onDidDismiss().then(value => {
      this.selectedPreset(value.data);
    })
  }

  selectedPreset(presetName: string) {
    switch(presetName) {
      case "hulls":
        this.allShips.forEach(ship => {
          if(this.categories[ship.hull] == null) {
            this.newCategoryWithShip(ship.hull, ship);
          } else {
            this.categories[ship.hull].ships.push(ship);
          }
        })
      break; case "stats":
        this.allShips.forEach(ship => {
          if(this.categories[ship.maxLevelFleetTechStat] == null) {
            this.newCategoryWithShip(ship.maxLevelFleetTechStat, ship);
          } else {
            this.categories[ship.maxLevelFleetTechStat].ships.push(ship);
          }
        })
      break; case "both":
        this.bothPreset();
      break; default: 
        this.allShips.forEach(ship => {
          if(this.categories["Other"] == null) {
            this.newCategoryWithShip("Other", ship);
          } else {
            this.categories["Other"].ships.push(ship);
          }
        })
      break;
    }

    // created the sortedCategoryNames array
    let categoryArray = [];
    Object.keys(this.categories).forEach(category => {
      categoryArray.push(category);        
    })
    categoryArray.sort((a, b) => {
      if(a > b) {
        return 1;
      } else {
        return -1
      }
    });
    for(let i = 0; i < categoryArray.length; i++) {
      this.categories[categoryArray[i]].sortId = i;
    }
    categoryArray.forEach(category => {
      this.sortedCategoryNames.push(category);
    })
    this.selectedCategory = this.sortedCategoryNames[0];
  }

  bothPreset() {
    this.allShips.forEach(ship => {
      let hull = ship.hull;
      if(ship.onlyApplicableHulls.length != 0 && ship.onlyApplicableHulls != null) {
        hull = ship.onlyApplicableHulls[0];
      } else {
        switch(ship.hull) {
          case "CV": case "CVL":
            hull = "CV";
          break; case "BB": case "BC": case "BBV" :
            hull = "BB";
          break; case "CA": case "CB": case "BM":
            hull = "CA";
          break;
        }
      }
      
      if(this.categories[hull + " " + ship.maxLevelFleetTechStat] == null) {
        this.newCategoryWithShip(hull + " " + ship.maxLevelFleetTechStat, ship);
      } else {
        this.categories[hull + " " + ship.maxLevelFleetTechStat].ships.push(ship);
      }
    })
  }

  newCategoryWithShip(categoryName, ship) {
    const newShipCategory: ShipCategory = {
      ships: [],
      isAffectedByFilter: false,
      sortId: Object.keys(this.categories).length,
      title: categoryName
    }

    this.categories[categoryName] = newShipCategory;
    this.categories[categoryName].ships.push(ship);
  }

  newCategory(name: string) {
    const newCategory: ShipCategory = {
      ships: [],
      isAffectedByFilter: false,
      sortId: Object.keys(this.categories).length,
      title: name
    }
    this.categories[name] = newCategory;
    this.save();
    this.sortedCategoryNames.push(name);
  }

  switchPos(ship: Ship, fromCategory: string, toCategory: string, index: number = this.categories[toCategory].ships.length) {
    this.remove(ship, fromCategory);
    this.categories[toCategory].ships.splice(index, 0, ship);
  }

  remove(ship: Ship, fromCategory: string) {
    const ships = this.categories[fromCategory].ships;
    ships.splice(ships.indexOf(ship), 1);
  }

  indexOf(ship): number {
    for(const category of Object.keys(this.categories)) {
      for(let i = 0; i < this.categories[category].ships.length; i++) {
        const checkingShip = this.categories[category].ships[i];
        if(checkingShip == ship) {
          return i;
        }
      }
    }
  }
}
