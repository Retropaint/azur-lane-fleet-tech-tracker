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
    "Sardegna Empire": "RN"
  };

  hulls = {
    "Destroyer": "DD",
    "Battleship": "BB",
    "Battlecruiser": "BC",
    "Aviation Battleship": "BBV",
    "Aircraft Carrier": "CV",
    "Light Carrier": "CVL",
    "Light Cruiser": "CL",
    "Heavy Cruiser": "CA",
    "Large Cruiser": "CB",
    "Munition Ship": "AE",
    "Repair": "AR",
    "Submarine": "SS",
    "Submarine Carrier": "SSV",
    "Monitor": "BM",
  }
  
  stats = {
    "firepower": "FP", 
    "torpedo": "TRP", 
    "aviation": "AVI", 
    "antiair": "AA", 
    "reload": "RLD", 
    "accuracy": 'HIT', 
    "antisubmarineWarfare": "ASW", 
    "evasion": "EVA", 
    "health": "HP"
  };

  onlyApplicable = {
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
    "Heavy cruiser": "CA",
    "Large cruiser": "CB",
    "Battlecruiser": "BC",
    "Destroyer": "DD",
    "Guided-missile destroyer": "DDG"
  }

  constructor() { }
}
