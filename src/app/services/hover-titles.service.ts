import { Injectable } from '@angular/core';

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

  constructor() { }
}
