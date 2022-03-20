import { Injectable } from '@angular/core';
import { AzurapiService } from './azurapi.service';
import { ShipCategoryDataService } from './ship-category-data.service';
import { Ship } from '../interfaces/ship';
import { ShipCardListComponent } from '../home/icon-ui/ship-card-list/ship-card-list.component';
import { DragDataService } from './drag-data.service';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(private shipCategoryData: ShipCategoryDataService, private dragData: DragDataService, private storage: Storage) { }

  ships = [];
  loadedShips = [];
  shipFilterPass: boolean[] = [];
  interval: any;
  delay: number = 30;

  stats = {
    "FP": true,
    "TRP": true, 
    "AVI": true, 
    "AA": true,
    "RLD": true, 
    "HIT": true,
    "ASW": true,
    "EVA": true, 
    "HP": true,
  }

  factions = {
    "USS": true, 
    "HMS": true,
    "IJN": true,
    "KMS": true,
    "ROC": true,
    "SN": true,
    "FFNF": true,
    "MNF": true,
    "RN": true,
  }

  hulls = {
    "DD": true, 
    "CL": true,
    "CA": true,
    "CV": true, 
    "BB": true, 
    "SS": true,
    "Others": true,
  }

  async filter() {
    this.loadedShips = [];
    this.ships = [];
    this.shipFilterPass = [];
    
    // icon UI
    if(this.shipCategoryData.selectedCategory != null) {
      this.filterCategory();
    }
    this.load();

    // sheet UI
    this.filterShipRows();
  }

  load() {
    let index = 0;
    this.loadedShips = [];
    let hadDraggedShip = this.dragData.draggedShipComponent != null;

    // dragged ship is added instantly to make it render seamlessly across switches
    if(this.dragData.draggedShipComponent != null) {
      this.loadedShips[this.ships.length - 1] = this.ships[this.ships.length - 1]
      this.dragData.draggedShipComponent.updateDraggedShipPos();
    }
    clearInterval(this.interval);

    this.interval = setInterval(() => {
      const isLoading = index < this.ships.length;

      // place dragged ship in fading queue if dropped while others are still fading
      if(isLoading && hadDraggedShip && this.dragData.draggedShipComponent == null) {
        this.loadedShips[this.ships.length - 1] = null;
      }
      
      if(isLoading) {
        this.loadedShips[index] = this.ships[index];
        index++;
      } else {
        clearInterval(this.interval);
      }
    }, this.delay)
  }

  filterCategory() {
    this.shipCategoryData.categories[this.shipCategoryData.selectedCategory].ships.forEach(ship => {
      if(this.passesCriteria(ship)) {
        this.ships.push(ship);
      }
    })
  }

  filterShipRows() {
    Object.keys(this.shipCategoryData.categories).forEach(category => {
      this.shipCategoryData.categories[category].ships.forEach(ship => {
        if(this.passesCriteria(ship)) {
          this.shipFilterPass[ship.id] = true;
        }        
      })
    })
  }

  passesCriteria(ship: Ship) {
    let isHullQualified = false;

    const checkHullFilter = (hull: string) => {
      if(this.hulls[hull]) {
        isHullQualified = true;
      }
    }
    
    // check hull
    switch(ship.hull) {
      case "DD":
        checkHullFilter("DD");
      break; case "CL": 
        checkHullFilter("CL");
      break; case "CA": case "CB":
        checkHullFilter("CA");
      break; case "BB": case "BC": case "BBV ":
        checkHullFilter("BB");
      break; case "CV": case "CVL": 
        checkHullFilter("CV");
      break; case "SS": case "SSV": 
        checkHullFilter("SS");
      break; case "BM": case "AE": case "AR":
        checkHullFilter("Others");
    }
    if(!isHullQualified) {
      return;
    }

    // check faction
    let hasQualifiedFaction = false;
    Object.keys(this.factions).forEach(faction => {
      if(this.factions[faction] && ship.faction == faction) {
        hasQualifiedFaction = true;
      }
    })
    if(!hasQualifiedFaction) {
      return;
    }

    // check stat 
    let hasQualifiedStat = false;
    Object.keys(this.stats).forEach(stat => {
      if(this.stats[stat] && ship.maxLevelFleetTechStat == stat) {
        hasQualifiedStat = true;
      }
    })
    if(!hasQualifiedStat) {
      return;
    }

    return true;
  }

  // called from Home page filter buttons
  pressedFilter(name: string, filterType: any, filterAll: boolean) {
    
    if(filterAll) {
      Object.keys(filterType).forEach(filter => {
        filterType[filter] = filterType[name];
      })
    } else {
      filterType[name] = !filterType[name];
    }
    this.filter();
  }

  toggleEverythingOn() {
    const types = [this.stats, this.factions, this.hulls];
    types.forEach(type => {
      Object.keys(type).forEach(key => {
        type[key] = true;
      })
    })
    this.filter();
  }

  isEverythingOn() {
    const types = [this.stats, this.factions, this.hulls];
    let isIt = true;
    types.forEach(type => {
      Object.keys(type).forEach(key => {
        if(!type[key]) {
          isIt = false;
          return;
        }
      })
    })
    return isIt;
  }
}
