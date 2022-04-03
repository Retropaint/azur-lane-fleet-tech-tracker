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
    this.shipsService.ships = [];
    let savedShips = await this.storage.get("ships");
    await fetch("https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/dist/ships.json").then(value => value.text()).then(ships => {
      JSON.parse(ships).forEach(async ship => {
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

          const newShip: Ship = {
            name: ship["names"]["en"],
            id: ship["id"],
            level: 1,
            faction: this.shortenedNames.factions[ship["nationality"]],
            rarity: ship["rarity"],
            hull: this.shortenedNames.hulls[ship["hullType"]],
            thumbnail: ship["thumbnail"],
            techBonus: fleetTech["bonus"],
            techStat: this.shortenedNames.stats[fleetTech["stat"]],
            appliedHulls: fleetTech["applicable"],
          }
          console.log(ship);

          // retain data from previous ship version, if it exists
          if(savedShips != null && savedShips.length > 0) {
            for(const savedShip of savedShips) {
              if(savedShip.id == ship.id) {
                newShip.level = savedShip.level;
                newShip.isIgnored = savedShip.isIgnored;
                break;
              }
            }
          }

          this.shipsService.ships.push(newShip);
        }
      })
    }).then(() => {
      this.shipsService.save();
      this.sort.sort("Name", true);
    })
  }
}
