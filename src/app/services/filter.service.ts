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
    this.ships = [];
    this.shipFilterPass = [];
    
    // icon UI
    if(this.shipCategoryData.selectedCategory != null) {
      this.filterCategory();
    }
    this.iconLoader.loadShips(this.ships);

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
