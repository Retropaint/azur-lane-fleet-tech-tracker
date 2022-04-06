import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CogReqsService {

  data = {
    "Common 100": 60,
    "Common 105": 120,
    "Common 110": 180,
    "Common 115": 300,

    "Rare 100": 80,
    "Rare 105": 160,
    "Rare 110": 240,
    "Rare 115": 400,
    
    "Elite 100": 120,
    "Elite 105": 240,
    "Elite 110": 360,
    "Elite 115": 600,
    
    "Super-Rare 100": 200,
    "Super-Rare 105": 400,
    "Super-Rare 110": 600,
    "Super-Rare 115": 1000,
    
    "Ultra-Rare 100": 300,
    "Ultra-Rare 105": 600,
    "Ultra-Rare 110": 900,
    "Ultra-Rare 115": 1500,
  }

  constructor() { }
}
