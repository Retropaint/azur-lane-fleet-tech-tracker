import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { LocalShip, Ship } from '../interfaces/ship';
import { ShipsService } from './ships.service';
import { ShortenedNamesService } from './shortened-names.service';
import md5 from 'crypto-js/md5';
import { ApplicableHullsService } from './applicable-hulls.service';

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
    private applicableHulls: ApplicableHullsService
  ) {}

  async init() {
    // reset ships
    this.shipsService.ships = [];
    
    let savedShips: LocalShip[] = await this.storage.get("ships");

    await this.fetchShips("https://raw.githubusercontent.com/thebombzen/thebombzen.moe/main/azur-lane/data/shiplist_0.json", savedShips);
    await this.fetchShips("https://raw.githubusercontent.com/thebombzen/thebombzen.moe/main/azur-lane/data/shiplist_1.json", savedShips);

    console.log(this.shipsService.ships)

    this.hasLoaded = true;
    this.shipsService.save();

    console.log('what')
  }

  async fetchShips(url: string, savedShips: LocalShip[]) {
    fetch(url)
    .then(value => value.text())
    .then(ships => {
      JSON.parse(ships).cargoquery.forEach(ship => {
        this.parseShip(ship.title, savedShips);
      })

      return;
    })
  }

  async parseShip(ship: any, savedShips: LocalShip[]) {
    let imageName = ship.Name.replace(' ', '_') + "ShipyardIcon.png";
    let hash = md5(imageName).toString();
    
    let retroImageName = ship.Name.replace(' ', '_') + "KaiShipyardIcon.png";
    let retroHash = md5(retroImageName).toString();

    let newShip: Ship = {
      name: ship.Name,
      id: ship.ShipID,
      level: 1,
      isObtained: false,
      faction: this.shortenedNames.factions[ship.Nationality],
      rarity: this.parseRarity(ship.Rarity),
      hull: this.shortenedNames.hulls[ship.Type],
      fallbackThumbnail: `https://azurlane.netojuu.com/images/${hash[0]}/${hash[0]}${hash[1]}/${imageName}`,
      hasRetrofit: ship.ReloadKai > 0,
      retroHull: this.shortenedNames.hulls[ship.SubtypeRetro],
      retroThumbnail: `https://azurlane.netojuu.com/images/${retroHash[0]}/${retroHash[0]}${retroHash[1]}/${retroImageName}`
    }

    if(ship.StatBonus120) {

      newShip = {
        ...newShip,
        techBonus: parseInt(ship.StatBonus120),
        techStat: this.shortenedNames.stats[ship.StatBonus120Type],
        appliedHulls: await this.applicableHulls.getHulls("120", newShip.name, newShip.hull),
        obtainStat: this.shortenedNames.stats[ship.StatBonusCollectType],
        obtainBonus: parseInt(ship.StatBonusCollect),
        obtainAppliedHulls: await this.applicableHulls.getHulls("obtain", newShip.name, newShip.hull),
        techPoints: {
          obtain: ship.TechPointCollect,
          maxLevel: ship.TechPoint120,
          maxLimitBreak: ship.TechPointMLB
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
  }

  parseRarity(rarity: string) {
    switch(rarity) {
      case "Priority":
        return "Super-Rare";
      case "Decisive":
        return "Ultra-Rare";
      case "Normal":
        return "Common";
      default:
        return rarity.replace(" ", "-");
    }
  }
}
