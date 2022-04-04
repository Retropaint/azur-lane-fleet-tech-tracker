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

  rarities = {
    "Normal": false,
    "Rare": false,
    "Elite": false,
    "Super-Rare": false,
    "Ultra-Rare": false,
    "All": true
  }

  async init() {
    this.shipService.ships.forEach(ship => {
      this.shipsFilterPass[ship.id] = false;
    })
    this.filter(true);
  }

  filter(refresh: boolean = false) {
    Object.keys(this.shipsFilterPass).forEach(id => {
      this.shipsFilterPass[id] = false;
    })

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

  genericFilterCheck(ship, filterType, shipProperty): boolean {
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
    this.checkAllInType(filterType);
    this.filter(filterType["All"]);
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
