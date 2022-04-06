import { Injectable } from '@angular/core';
import { Ship } from '../interfaces/ship';
import { Storage } from '@ionic/storage-angular';
import { IconLoaderService } from './icon-loader.service';
import { ShipsService } from './ships.service';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(private iconLoader: IconLoaderService, private shipService: ShipsService) { }

  shipsFilterPass = {};

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

  rarities = {
    "Common": false,
    "Rare": false,
    "Elite": false,
    "Super-Rare": false,
    "Ultra-Rare": false,
    "All": true
  }

  async init() {
    // reset shipsFilterPass
    this.shipService.ships.forEach(ship => {
      this.shipsFilterPass[ship.id] = false;
    })

    this.filter();
  }

  filter() {
    // reset shipsFilterPass
    Object.keys(this.shipsFilterPass).forEach(id => {
      this.shipsFilterPass[id] = false;
    })

    // assign shipsFilterPass
    this.shipService.ships.forEach(ship => {
      if(this.passesCriteria(ship)) {
        this.shipsFilterPass[ship.id] = true;
      }
    })

    this.shipService.ships = this.shipService.setAllProperShipPos(this.shipService.ships);

    this.shipService.refreshCogChipReq(this.shipsFilterPass);

    this.iconLoader.loadShips(this.shipsFilterPass);
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

    if(!this.genericFilterCheck(ship, this.factions, 'faction')) {
      return;
    }

    if(!this.genericFilterCheck(ship, this.stats, 'techStat')) {
      return;
    }

    if(!this.genericFilterCheck(ship, this.rarities, 'rarity')) {
      return;
    }

    return true;
  }

  genericFilterCheck(ship: Ship, filterType: any, shipProperty: string): boolean {
    let hasQualified = false;
    Object.keys(filterType).forEach(filter => {
      if(filterType.All || filterType[filter] && ship[shipProperty] == filter) {
        hasQualified = true;
        return;
      }
    })
    return hasQualified;
  }

  // called from Home page filter buttons
  pressedFilter(name: string, filterType: any) {
    if(name == "All") {
      Object.keys(filterType).forEach(filterName => {
        filterType[filterName] = false
      })
    }
    filterType[name] = !filterType[name];

    // check if all in the category are true/false
    if(this.isEverything(false, filterType) || this.isEverything(true, filterType)) {
      Object.keys(filterType).forEach(filterName => {
        filterType[filterName] = false;
      })
      filterType["All"] = true;
    } else {
      filterType["All"] = false;
    }

    this.filter();
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
