import { Injectable } from '@angular/core';
import { FactionTechDataService } from './faction-tech-data.service';
import { ShipsService } from './ships.service';
import { Ship } from '../interfaces/ship';

@Injectable({
  providedIn: 'root'
})
export class FleetTechService {

  USS = {};
  HMS = {};
  IJN = {};
  KMS = {};

  obtain = {};
  maxed = {};
  total = {};
  full = {};

  pointsUSS: number = 0;
  pointsHMS: number = 0;
  pointsIJN: number = 0;
  pointsKMS: number = 0;

  constructor(
    private factionTech: FactionTechDataService,
    private shipsService: ShipsService
  ) { }

  refresh() {
    this.USS = {};
    this.HMS = {};
    this.IJN = {};
    this.KMS = {};

    this.obtain = {};
    this.maxed = {};
    this.total = {};
    this.full = {};

    this.pointsUSS = 0;
    this.pointsHMS = 0;
    this.pointsIJN = 0;
    this.pointsKMS = 0;

    this.getFactionTech();
    this.getStats();
    this.full = this.addFactionToTotal("full");
    this.total = this.addFactionToTotal("total");
  }

  getFactionTech() {
    const factions = ["USS", "HMS", "IJN", "KMS"];

    for(let i = 0; i < 4; i++) {
      for(let j = 1; j < this.factionTech.levels[factions[i]]+1; j++) {
        this[factions[i]] = {
          ...this[factions[i]],
          ...this.factionTech[factions[i]][j]
        }
      }
    }
  }

  getStats() {
    this.shipsService.ships.forEach(ship => {
      if(ship.obtainBonus && ship.isObtained) {
        this.obtain = this.addStat(ship, this.obtain, "obtain");
        this.total = this.addStat(ship, this.total, "obtain");
      }
      if(ship.techBonus && ship.level >= 120) {
        this.maxed = this.addStat(ship, this.maxed, "max");
        this.total = this.addStat(ship, this.total, "max");
      }
      if(ship.techBonus) {
        this.full = this.addStat(ship, this.full, "obtain");
        this.full = this.addStat(ship, this.full, "max");
      }

      let name = ["USS", "HMS", "IJN", "KMS"].find(name => name == ship.faction);
      if(name != null && ship.techPoints) {
        this[`points${name}`] += (ship.isObtained) ? ship.techPoints.obtain : 0;
        this[`points${name}`] += (ship.level >= 71) ? ship.techPoints.maxLimitBreak : 0;
        this[`points${name}`] += (ship.level >= 120) ? ship.techPoints.maxLevel : 0;
      }
    })
  }
  
  addStat(ship: Ship, object: any, type: "max" | "obtain") {

    const appliedHulls =  type == "max" ? "appliedHulls" : "obtainAppliedHulls";
    const stat =          type == "max" ? "techStat" : "obtainStat";
    const bonus =         type == "max" ? "techBonus" : "obtainBonus";

    ship[appliedHulls].forEach(hull => {
      
      // add hull if it doesn't exist
      if(object[hull] == null) {
        object = {
          ...object,
          [hull]: {}
        }
      }
      
      // add stat if it doesn't exist
      if(object[hull][ship[stat]] == null) {
        object[hull] = {
          ...object[hull],
          [ship[stat]]: 0
        }
      }

      object[hull][ship[stat]] += ship[bonus];
    })

    return object;
  }

  addFactionToTotal(type: "total" | "full") {
    const factions = type == "total" ? 
      [this.USS, this.HMS, this.IJN, this.KMS] : 
      [this.getFullTech("USS"), this.getFullTech("HMS"), this.getFullTech("IJN"), this.getFullTech("KMS")];

    let object = type == "total" ? this.total : this.full;

    factions.forEach(faction => {
      Object.keys(faction).forEach(hull => {
        if(object[hull] == null) {
          object = {
            ...object,
            [hull]: {}
          }
        }

        Object.keys(faction[hull]).forEach(stat => {
          if(object[hull][stat] == null) {
            object[hull] = {
              ...object[hull],
              [stat]: 0
            }
          }

          object[hull][stat] += faction[hull][stat];
        })
      })
    })

    return object;
  }

  getFullTech(faction: "USS" | "HMS" | "IJN" | "KMS") {
    let object;
    for(let i = 1; i < this.factionTech.maxLevels[faction]+1; i++) {
      object = {
        ...object,
        ...this.factionTech[faction][i]
      }
    }

    return object;
  }
}