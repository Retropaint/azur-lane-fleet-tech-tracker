import { Injectable } from '@angular/core';
import { Ship } from '../interfaces/ship';
import { ShortenedNamesService } from './shortened-names.service';

@Injectable({
  providedIn: 'root'
})
export class HoverTitlesService {

  stats = {
    "FP": "Firepower",
    "HP": "Health",
    "RLD": "Reload",
    "ASW": "Anti-Submarine Warfare",
    "TRP": "Torpedo",
    "AA": "Anti-Air",
    "AVI": "Aviation",
    "HIT": "Accuracy",
    "EVA": "Evasion",
  }

  hulls = {
    "DD": "Destroyer",
    "CV": "Aircraft Carrier",
    "CVL": "Light Aircraft Carrier",
    "CA": "Heavy Cruiser",
    "CB": "Large Cruiser",
    "CL": "Light Cruiser",
    "BM": "Monitor",
    "BB": "Battleship",
    "BC": "Battlecruiser",
    "AE": "Munition",
    "AR": "Repair",
    "BBV": "Aviation Battleship",
    "SS": "Submarine",
    "SSV": "Submarine Carrier"
  }

  constructor(private shortenedNames: ShortenedNamesService) { }

  getTechStatTitle(ship: Ship) {
    let hullString = "";
    ship.appliedHulls.forEach(hull => {
      hullString += this.shortenedNames.onlyApplicable[hull] + "s, ";
    })
    hullString = hullString.substring(0, hullString.length - 2);
    return ship.techStat + ' (+' + ship.techBonus + ") to " + hullString;
  }
}
