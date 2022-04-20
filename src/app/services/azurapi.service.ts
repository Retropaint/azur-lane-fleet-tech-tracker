import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Ship } from '../interfaces/ship';
import { ShipsService } from './ships.service';
import { ShortenedNamesService } from './shortened-names.service';
import { SortService } from './sort.service';

@Injectable({
  providedIn: 'root'
})
export class AzurapiService {

  filteredOtherShips: any[] = [];

  constructor(
    private storage: Storage, 
    private shortenedNames: ShortenedNamesService,
    private shipsService: ShipsService,
    private sort: SortService) {}

  async init() {
    
    // reset ships
    this.shipsService.ships = [];
    
    let savedShips: Ship[] = await this.storage.get("ships");

    let names = [];
    let ids = [];
    
    await fetch("https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/dist/ships.json").then(value => value.text()).then(ships => {
      JSON.parse(ships).forEach(async ship => {
        // only accept ships with a max level fleet tech bonus
        if(ship["fleetTech"]["statsBonus"]["maxLevel"]) {

          const fleetTech = ship["fleetTech"]["statsBonus"]["maxLevel"]
          const obtainFleetTech = ship["fleetTech"]["statsBonus"]["collection"];

          // there's a ' on Pamiat for some reason
          if(ship["names"]["en"].includes("Pamiat")) {
            ship["names"]["en"] = "Pamiat Merkuria";
          }

          // Normal LOL
          if(ship["rarity"] == "Normal") {
            ship["rarity"] = "Common";
          }

          // replace PR rarities with normal counterparts, and add dash for CSS
          if(ship["rarity"] == "Super Rare" || ship["rarity"] == "Priority") {
            ship["rarity"] = "Super-Rare";
          }
          if(ship["rarity"] == "Ultra Rare" || ship["rarity"] == "Decisive") {
            ship["rarity"] = "Ultra-Rare";
          }

          // abbreviate applicable hulls
          for(let i = 0; i < fleetTech['applicable'].length; i++) {
            fleetTech['applicable'][i] = this.shortenedNames.applicableHulls[fleetTech['applicable'][i]]
          }
          for(let i = 0; i < obtainFleetTech['applicable'].length; i++) {
            obtainFleetTech['applicable'][i] = this.shortenedNames.applicableHulls[obtainFleetTech['applicable'][i]]
          }

          if(ship['names']['en'] == 'An Shan') {
            console.log(ship);
          }

          const newShip: Ship = {
            name: ship["names"]["en"],
            id: ship["id"],
            level: 1,
            faction: this.shortenedNames.factions[ship["nationality"]],
            rarity: ship["rarity"],
            hull: this.shortenedNames.hulls[ship["hullType"]],
            fallbackThumbnail: ship["thumbnail"],
            techBonus: parseInt(fleetTech["bonus"][1]),
            techStat: this.shortenedNames.stats[fleetTech["stat"]],
            appliedHulls: fleetTech["applicable"],
            hasRetrofit: ship["retrofit"],
            obtainStat: this.shortenedNames.stats[obtainFleetTech["stat"]],
            obtainBonus: parseInt(obtainFleetTech["bonus"][1]),
            retroHull: this.shortenedNames.hulls[ship['retrofitHullType']],
            obtainAppliedHulls: obtainFleetTech['applicable']
          }

          // if updating to a new version, retain user-generated ship data from previous version
          if(savedShips != null && savedShips.length > 0) {
            for(const savedShip of savedShips) {
              if(savedShip.id == ship.id) {
                newShip.level = savedShip.level;
                newShip.isObtained = savedShip.isObtained;
                break;
              }
            }
          }

          this.shipsService.ships.push(newShip);
          //let name = newShip.name.replace(/\s/g, "_");
          //names.push(name);
          //ids.push(newShip.id);
        }
      })
    }).then(() => {
      //console.log(JSON.stringify(names));
      //console.log(JSON.stringify(ids));
      this.shipsService.save();
      this.sort.sort("Name", true);
    })
  }
}
