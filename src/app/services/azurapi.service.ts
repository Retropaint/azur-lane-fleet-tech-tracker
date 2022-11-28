import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { LocalShip, Ship } from '../interfaces/ship';
import { ShipsService } from './ships.service';
import { ShortenedNamesService } from './shortened-names.service';
import { SortService } from './sort.service';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AzurapiService {

  filteredOtherShips: any[] = [];
  hasLoaded: boolean = false;

  constructor(
    private storage: Storage, 
    private shortenedNames: ShortenedNamesService,
    private shipsService: ShipsService,
  ) {}

  async init() {
    // reset ships
    this.shipsService.ships = [];
    
    let savedShips: LocalShip[] = await this.storage.get("ships");

    let names = [];
    let ids = [];

    await fetch("https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/dist/ships.json")
      .then(value => value.text())
      .then(ships => {
        JSON.parse(ships).forEach(async ship => {

          // name corrections
          if(ship["names"]["en"].includes("Pamiat")) {
            ship["names"]["en"] = "Pamiat Merkuria";
          } else if(ship["names"]["en"].includes("Royal.META")) {
            ship["names"]["en"] = "Ark Royal META";
          } else if(ship["names"]["en"].includes("Hiryu.META")) {
            ship["names"]["en"] = "Hiryuu META";
          }

          // replace PR rarities with normal counterparts, and add dash for CSS
          if(ship["rarity"] == "Super Rare" || ship["rarity"] == "Priority") {
            ship["rarity"] = "Super-Rare";
          }
          if(ship["rarity"] == "Ultra Rare" || ship["rarity"] == "Decisive") {
            ship["rarity"] = "Ultra-Rare";
          }

          if(ship["rarity"] == "Normal") {
            ship["rarity"] = "Common";
          }

          let newShip: Ship = {
            name: ship["names"]["en"],
            id: ship["id"],
            level: 1,
            isObtained: false,
            faction: this.shortenedNames.factions[ship["nationality"]],
            rarity: ship["rarity"],
            hull: this.shortenedNames.hulls[ship["hullType"]],
            fallbackThumbnail: ship["thumbnail"],
            hasRetrofit: ship["retrofit"],
            retroHull: this.shortenedNames.hulls[ship['retrofitHullType']],
          }

          if(ship["fleetTech"]["statsBonus"]["collection"]) {
            
            const fleetTech = ship["fleetTech"]["statsBonus"]["maxLevel"]
            const obtainFleetTech = ship["fleetTech"]["statsBonus"]["collection"];

            // abbreviate applicable hulls
            for(let i = 0; i < fleetTech['applicable'].length; i++) {
              fleetTech['applicable'][i] = this.shortenedNames.applicableHulls[fleetTech['applicable'][i]]
            }
            for(let i = 0; i < obtainFleetTech['applicable'].length; i++) {
              obtainFleetTech['applicable'][i] = this.shortenedNames.applicableHulls[obtainFleetTech['applicable'][i]]
            }

            newShip = {
              ...newShip,
              techBonus: parseInt(fleetTech["bonus"][1]),
              techStat: this.shortenedNames.stats[fleetTech["stat"]],
              appliedHulls: fleetTech["applicable"],
              obtainStat: this.shortenedNames.stats[obtainFleetTech["stat"]],
              obtainBonus: parseInt(obtainFleetTech["bonus"][1]),
              obtainAppliedHulls: obtainFleetTech['applicable'],
              techPoints: {
                obtain: ship['fleetTech']['techPoints']['collection'],
                maxLevel: ship['fleetTech']['techPoints']['maxLevel'],
                maxLimitBreak: ship['fleetTech']['techPoints']['maxLimitBreak']
              }
            }
          }

          // retain dynamic data of existing ships
          if(savedShips != null && savedShips.length > 0) {
            const savedShip = savedShips.find(ship => ship.id == newShip.id);
            if(savedShip) {
              newShip.level = savedShip.level;
              newShip.isObtained = savedShip.isObtained;
            }
          }

          this.shipsService.ships.push(newShip);
          /*
          let name = encodeURI(newShip.name).replace(/%20/g, '_');
          names.push(name);
          ids.push(newShip.id);
          
          if(newShip.hasRetrofit) {
            names.push(name + 'Kai')
            const retroId = parseInt(newShip.id) + 3000
            ids.push(retroId.toString());
          }
          */
        })
        this.hasLoaded = true;
        this.shipsService.save();
      })
  }
}
