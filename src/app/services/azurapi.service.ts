import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Ship } from '../interfaces/ship';
import { FilterService } from './filter.service';
import { ShortenedNamesService } from './shortened-names.service';
import { HttpClient } from '@angular/common/http';
import { ShipsService } from './ships.service';
import { SortService } from './sort.service';

@Injectable({
  providedIn: 'root'
})
export class AzurapiService {

  filteredOtherShips: any[] = [];

  constructor(
    private storage: Storage, 
    private filter: FilterService, 
    private shortenedNames: ShortenedNamesService,
    private shipsService: ShipsService,
    private sort: SortService) {}

  async init(isRetrieving: boolean = false) {
    console.log(this.shipsService.ships);
    if(!isRetrieving && this.shipsService.ships.length != 0) {
      return;
    }
    await fetch("https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/dist/ships.json").then(value => value.text()).then(ships => {
      JSON.parse(ships).forEach(ship => {
        // only accept ships with a max level fleet tech bonus
        if(ship["fleetTech"]["statsBonus"]["maxLevel"]) {

          const fleetTech = ship["fleetTech"]["statsBonus"]["maxLevel"]

          fleetTech["bonus"] = parseInt(fleetTech["bonus"][1]);

          // add dash for CSS
          if(ship["rarity"] == "Super Rare" || ship["rarity"] == "Priority") {
            ship["rarity"] = "Super-Rare";
          }
          if(ship["rarity"] == "Ultra Rare" || ship["rarity"] == "Decisive") {
            ship["rarity"] = "Ultra-Rare";
          }

          // check whether fleet tech only applies to a certain sub-hull 
          fleetTech["onlyApplicable"] = []; // make empty array to prevent html complaining
          switch(ship["hullType"]) {
            case "Aircraft Carrier": case "Light Carrier":
              this.checkApplicability(["Aircraft carrier", "Light aircraft carrier"], fleetTech);
            break; case "Monitor": case "Heavy Cruiser": case "Large Cruiser":
              this.checkApplicability(['Heavy cruiser', 'Large cruiser', 'Monitor'], fleetTech);
            break; case "Battleship": case "Battlecruiser": case "Aviation Battleship":
              this.checkApplicability(['Battleship', 'Battlecruiser', 'Aviation battleship'], fleetTech);
            break;
          }

          const newShip: Ship = {
            name: ship["names"]["en"],
            id: ship["id"],
            level: 1,
            faction: this.shortenedNames.factions[ship["nationality"]],
            rarity: ship["rarity"],
            hull: this.shortenedNames.hulls[ship["hullType"]],
            thumbnail: ship["thumbnail"],
            onlyApplicableHulls: fleetTech["onlyApplicable"],
            techBonus: fleetTech["bonus"],
            techStat: this.shortenedNames.stats[fleetTech["stat"]],
            appliedHulls: fleetTech["applicable"],
          }

          this.shipsService.ships.push(newShip);
        }
      })
    }).then(() => {
      this.shipsService.save();
      this.sort.sort("Name", true);
    })
  }

  checkApplicability(maxApplicableHulls: string[], fleetTech) {
    let applicableHulls = [];
    maxApplicableHulls.forEach(hull => {
      let isApplicable = false;
      fleetTech["applicable"].forEach(applicableHull => {
        if(applicableHull == hull) {
          isApplicable = true;
          return;
        }
      })
      if(isApplicable) {
        applicableHulls.push(this.shortenedNames.onlyApplicable[hull]);
      }
    })
    
    if(applicableHulls.length != maxApplicableHulls.length) {
      fleetTech["onlyApplicable"] = applicableHulls;
    }
  }

  isLostShip(searchingShip, ships): boolean {
    for(const ship of ships) {
      if(ship == searchingShip) {
        return false;
      }
    }
    return true;
  }
}
