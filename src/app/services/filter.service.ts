import { Injectable } from '@angular/core';
import { ShipCategoryDataService } from './ship-category-data.service';
import { Ship } from '../interfaces/ship';
import { Storage } from '@ionic/storage-angular';
import { IconDragService } from './icon-drag.service';
import { IconLoaderService } from './icon-loader.service';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(private shipCategoryData: ShipCategoryDataService, 
    private storage: Storage, 
    private iconDrag: IconDragService,
    private iconLoader: IconLoaderService) { }

  ships = [];
  shipFilterPass: boolean[] = [];
  delay: number = 30;
  isAll: boolean; // keep track of if the last category was set to All, to decide whether to use the icon loader

  stats = {
    "FP": false,
    "TRP": false, 
    "AVI": false, 
    "AA": false,
    "RLD": false, 
    "HIT": false,
    "ASW": false,
    "EVA": false, 
    "HP": false,
    "All": true
  }

  factions = {
    "USS": false, 
    "HMS": false,
    "IJN": false,
    "KMS": false,
    "ROC": false,
    "SN": false,
    "FFNF": false,
    "MNF": false,
    "RN": false,
    "All": true
  }

  hulls = {
    "DD": false, 
    "CL": false,
    "CA": false,
    "CV": false, 
    "BB": false, 
    "SS": false,
    "Others": false,
    "All": true
  }

  async filter() {
    this.ships = [];
    this.shipFilterPass = [];
    
    // icon UI
    if(this.shipCategoryData.selectedCategory != null) {
      this.filterCategory();
    }
    if(this.isAll) {
      this.iconLoader.loadShips(this.ships);
    } else {
      this.iconLoader.loadedShips = this.ships;
    }

    // sheet UI
    this.filterShipRows();
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
      if(this.hulls[hull] || this.hulls.All == true) {
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
      if(this.factions.All || this.factions[faction] && ship.faction == faction) {
        hasQualifiedFaction = true;
      }
    })
    if(!hasQualifiedFaction) {
      return;
    }

    // check stat 
    let hasQualifiedStat = false;
    Object.keys(this.stats).forEach(stat => {
      if(this.stats.All || this.stats[stat] && ship.techStat == stat) {
        hasQualifiedStat = true;
      }
    })
    if(!hasQualifiedStat) {
      return;
    }

    return true;
  }

  // called from Home page filter buttons
  pressedFilter(name: string, filterType: any) {
    if(name == "All") {
      Object.keys(filterType).forEach(filterName => {
        filterType[filterName] = false
      })
    }
    filterType[name] = !filterType[name];
    this.checkAllInType(filterType);
    this.filter();
  }

  checkAllInType(type: any) {
    if(this.isEverything(false, type) || this.isEverything(true, type)) {
      Object.keys(type).forEach(filterName => {
        type[filterName] = false;
      })
      type["All"] = true;
      this.isAll = true;
    } else {
      type["All"] = false;
      this.isAll = false;
    }
  }

  isEverything(toggle: boolean, type: any) {
    let isYes = true;
    Object.keys(type).forEach(filterName => {
      if(filterName != "All") {
        if(toggle && !type[filterName] || !toggle && type[filterName]) {
          isYes = false;
        }
      }
    })
    return isYes;
  }
}
