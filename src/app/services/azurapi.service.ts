import { HttpClient } from '@angular/common/http';
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
  hasLoaded: boolean = false;

  constructor(
    private storage: Storage, 
    private shortenedNames: ShortenedNamesService,
    private shipsService: ShipsService,
    private httpClient: HttpClient
  ) {}

  async init(isRetrieving: boolean = false) {
    // reset ships
    this.shipsService.ships = [];
    
    let savedShips: Ship[] = await this.storage.get("ships");

    let names = [];
    let ids = [];

    this.httpClient.get("https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/dist/ships.json", {reportProgress: true})
      .subscribe((ships: any) => {
        ships.forEach(async ship => {
        
          // only accept ships with a max level fleet tech bonus
          //if(ship["fleetTech"]["statsBonus"]["collection"]) {
          if(true) {
  
            let shipHasTech: boolean = false;
  
            if(ship["fleetTech"]["statsBonus"]["collection"]) {
              shipHasTech = true;
            }
  
            const fleetTech = ship["fleetTech"]["statsBonus"]["maxLevel"]
            const obtainFleetTech = ship["fleetTech"]["statsBonus"]["collection"];
  
            // there's a ' on Pamiat for some reason
            if(ship["names"]["en"].includes("Pamiat")) {
              ship["names"]["en"] = "Pamiat Merkuria";
            } else if(ship["names"]["en"].includes("Royal.META")) {
              ship["names"]["en"] = "Ark Royal META";
            } else if(ship["names"]["en"].includes("Hiryu.META")) {
              ship["names"]["en"] = "Hiryuu META";
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
  
            if(shipHasTech) {
              // abbreviate applicable hulls
              for(let i = 0; i < fleetTech['applicable'].length; i++) {
                fleetTech['applicable'][i] = this.shortenedNames.applicableHulls[fleetTech['applicable'][i]]
              }
              for(let i = 0; i < obtainFleetTech['applicable'].length; i++) {
                obtainFleetTech['applicable'][i] = this.shortenedNames.applicableHulls[obtainFleetTech['applicable'][i]]
              }
            }
  
            let newShip: Ship;
  
            if(shipHasTech) {
              newShip = {
                name: ship["names"]["en"],
                id: ship["id"],
                level: 1,
                isObtained: false,
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
                obtainAppliedHulls: obtainFleetTech['applicable'],
                techPoints: {
                  obtain: ship['fleetTech']['techPoints']['collection'],
                  maxLevel: ship['fleetTech']['techPoints']['maxLevel'],
                  maxLimitBreak: ship['fleetTech']['techPoints']['maxLimitBreak']
                }
              }
            } else {
              newShip = {
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
            }
  
            // retain dynamic data of existing ships
            if(savedShips != null && savedShips.length > 0) {
              for(const savedShip of savedShips) {
                if(savedShip.id == ship.id) {
                  newShip.level = savedShip.level;
  
                  // isObtained wasn't explicitly assigned before, so it may cause errors for older users without this check
                  if(newShip.isObtained != null) {
                    newShip.isObtained = savedShip.isObtained;
                  }
                  break;
                }
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
          }
        })
        this.hasLoaded = true;
        this.shipsService.save();
      })
  }
}
