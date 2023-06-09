import { Injectable } from '@angular/core';
import { Ship } from '../interfaces/ship';

import { MiscService } from './misc.service';
import { SettingsDataService } from './settings-data.service';
import { ShipsService } from './ships.service';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(
    private shipsService: ShipsService, 
    private settingsData: SettingsDataService,
    private misc: MiscService,
  ) { }

  oneSelectedStat: string;
  oneSelectedHull: string;

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
    "No Tech": false,
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
    "META": false,
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

  statuses = {
    "W.I.P": false,
    "Maxed": false,
    "Unobtained": false,
    "All": true
  }

  init() {
    // reset shipsFilterPass
    this.shipsService.ships.forEach(ship => {
      this.misc.shipsFilterPass[ship.id] = false;
    })

    this.filter();
  }

  filter() {
    if(!this.settingsData.checkBool('show-no-tech-ships')) {
      this.stats['No Tech'] = false;
      if(this.isEverything(false, this.stats)) {
        this.stats['All'] = true;
      }
    }

    // assign shipsFilterPass
    this.shipsService.ships.forEach(ship => {
      if(this.passesCriteria(ship)) {
        this.misc.shipsFilterPass[ship.id] = true;
      } else {
        this.misc.shipsFilterPass[ship.id] = false;
      }
    })

    this.misc.refreshShipList();

    this.shipsService.refreshCogChipReq(this.misc.shipsFilterPass);
  }

  passesCriteria(ship: Ship) {
    let isHullQualified = false;

    const checkHullFilter = (hull: string) => {
      if(this.hulls[hull] || this.hulls.All) {
        isHullQualified = true;
      }
    }
    
    // check hull
    let hull = null;
    if(this.settingsData.checkBool('retrofit-forms') && ship.retroHull) {
      hull = ship.retroHull
    } else {
      hull = ship.hull;
    }
    switch(hull) {
      case "DD": case "DDG":
        checkHullFilter("DD");
      break; case "CL": 
        checkHullFilter("CL");
      break; case "CA": case "CB":
        checkHullFilter("CA");
      break; case "BB": case "BC": case "BBV":
        checkHullFilter("BB");
      break; case "CV": case "CVL": 
        checkHullFilter("CV");
      break; case "SS": case "SSV": 
        checkHullFilter("SS");
      break; case "BM": case "AE": case "AR": case "IX":
        checkHullFilter("Others");
    }
    if(!isHullQualified) {
      return;
    }

    let rarity = null;
    if(this.settingsData.checkBool('retrofit-forms') && ship.hasRetrofit) {
      rarity = this.shipsService.getRetroRarity(ship.id);
    } else {
      rarity = ship.rarity;
    }

    // check rarity
    let hasQualifiedRarity = false;
    Object.keys(this.rarities).forEach(filter => {
      if(this.rarities.All || this.rarities[filter] && rarity == filter) {
        hasQualifiedRarity = true;
        return;
      }
    })
    if(!hasQualifiedRarity) {
      return;
    }

    // check status
    let hasQualifiedStatus = this.statuses["All"];
    Object.keys(this.statuses).forEach(status => {
      if(this.statuses[status]) {
        switch(status) {
          case "W.I.P": 
            if(ship.isObtained && ship.level < 120) {
              hasQualifiedStatus = true;
              return;
            }
          break; case "Maxed": 
            if(ship.isObtained && ship.level >= 120) {
              hasQualifiedStatus = true;
              return;
            }
          break; case "Unobtained": 
            if(!ship.isObtained) {
              hasQualifiedStatus = true;
              return;
            }
          break;
        }
      }
    })
    if(!hasQualifiedStatus) {
      return;
    }

    if(!this.genericFilterCheck(ship, this.factions, 'faction')) {
      return;
    }

    if(!this.genericFilterCheck(ship, this.stats, (this.misc.filteringMaxTech ? 'techStat' : 'obtainStat'))) {
      return;
    }

    return true;
  }

  genericFilterCheck(ship: Ship, filterType: any, shipProperty: string): boolean {
    if(shipProperty.includes('Stat') && ship.techStat == null) {
      if(this.settingsData.checkBool('show-no-tech-ships') && filterType['All'] || filterType['No Tech']) {
        return true;
      } else {
        return false;
      }
    }

    let hasQualified = false;
    Object.keys(filterType).forEach(filter => {
      if(filterType.All || filterType['Has Tech'] || filterType[filter] && ship[shipProperty] == filter) {
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

    this.oneSelectedHull = this.getTheOnlyOne(this.hulls);
    this.oneSelectedStat = this.getTheOnlyOne(this.stats);

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

  getTheOnlyOne(type: any) {
    let gotOne: boolean = false;
    let chosenFilter = "";
    for(const toggle of Object.keys(type)) {
      if(type[toggle]) {
        if(gotOne) {
          return;
        }
        gotOne = true;
        chosenFilter = toggle;
      }
    }

    if(chosenFilter != 'All') {
      return chosenFilter;
    }
  }
}
