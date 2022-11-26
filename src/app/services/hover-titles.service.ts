import { Injectable } from '@angular/core';
import { Ship } from '../interfaces/ship';

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
    "DDG": "Guided-Missile Destroyer",
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
    "SSV": "Submarine Carrier",
    "IX": "Sailing Frigate"
  }

  constructor() { }

  getTechStatTitle(ship: Ship) {
    if(!ship.appliedHulls) {
      return;
    }
    let hullString = "";
    ship.appliedHulls.forEach(hull => {
      hullString += hull + "s, ";
    })
    hullString = hullString.substring(0, hullString.length - 2);
    return ship.techStat + ' (+' + ship.techBonus + ") to " + hullString;
  }
}
