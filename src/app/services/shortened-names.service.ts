import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShortenedNamesService {

  factions = {
    "Eagle Union": "USS", 
    "Royal Navy": "HMS", 
    "Sakura Empire": "IJN", 
    "Iron Blood": "KMS", 
    "Dragon Empery": "ROC", 
    "Northern Parliament": "SN", 
    "Iris Libre": "FFNF", 
    "Vichya Dominion": "MNF", 
    "Sardegna Empire": "RN",
    "Tempesta": "MOT",
    "META": "META"
  };

  hulls = {
    "Destroyer": "DD",

    // I have no clue why DDG uses the shorthand version already
    "DDG": "DDG",
    "Guided-Missile Destroyer": "DDG",
    
    "Battleship": "BB",
    "Battlecruiser": "BC",
    "Aviation Battleship": "BBV",
    "Aircraft Carrier": "CV",

    // fool-proof
    "Light Aircraft Carrier": "CVL",
    "Light Carrier": "CVL",
    
    "Light Cruiser": "CL",
    "Heavy Cruiser": "CA",
    "Large Cruiser": "CB",
    "Munition Ship": "AE",
    "Repair Ship": "AR",
    "Submarine": "SS",
    "Submarine Carrier": "SSV",
    "Monitor": "BM",
    "Sailing Frigate (Submarine)": "IXs",
    "Sailing Frigate (Main)": "IXm",
    "Sailing Frigate (Vanguard)": "IXv"
  }
  
  stats = {
    "Firepower": "FP", 
    "Torpedo": "TRP", 
    "Aviation": "AVI", 
    "AA": "AA", 
    "Reload": "RLD", 
    "Accuracy": 'HIT', 
    "ASW": "ASW", 
    "Evasion": "EVA", 
    "Health": "HP"
  };

  // applicable hull names are sometimes different
  applicableHulls = {
    "Battleship": "BB",
    "Light aircraft carrier": "CVL",
    "Aircraft carrier": "CV",
    "Monitor": "BM",
    "Repair ship": "AR",
    "Munition ship": "AE",
    "Aviation battleship": "BBV",
    "Submarine carrier": "SSV",
    "Submarine": "SS",
    "Light cruiser": "CL",
    "Heavy Cruiser": "CA",
    "Large cruiser": "CB",
    "Battlecruiser": "BC",
    "Destroyer": "DD",
    "Guided-missile destroyer": "DDG"
  }

  constructor() { }
}
