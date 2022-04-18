import { Injectable } from '@angular/core';
import { Ship } from '../interfaces/ship';
import { ShipsService } from './ships.service';

@Injectable({
  providedIn: 'root'
})
export class IconLoaderService {

  ships = [];
  interval: any;

  // how many ships can fade in at once
  shipsPerTick: number = 999;

  // determines if the 'no ships' text shows up
  hasShips: boolean;

  constructor(private shipsService: ShipsService) { }

  loadShips(shipsFilterPass) {
    
    // reset
    clearInterval(this.interval);
    this.ships = [];

    let toAdd = [];
    this.shipsService.ships.forEach(ship => {
      if(shipsFilterPass[ship.id]) {
        toAdd.push(ship);
      }
    })

    // although ship list HTML already does this, ship list HTML will load them in non-proper positions if shipsPerTick is less than total ship count
    toAdd = this.shipsService.setAllProperShipPos(toAdd);
    
    this.hasShips = toAdd.length > 0;

    let index = 0;
    this.interval = setInterval(() => {
      const isLoading = index < toAdd.length;
      if(isLoading) {
        for(let i = 0; i < Math.min(this.shipsPerTick, toAdd.length); i++) {
          this.ships.push(toAdd[index]);
          index++;
        }
      } else {
        clearInterval(this.interval);
      }
    })
  }

  refresh() {
    clearInterval(this.interval);
    this.ships = this.shipsService.ships;
  }

  getIndex(id: string) {
    for(let i = 0; i < this.ships.length; i++) {
      if(this.ships[i].id == id) {
        return i;
      }
    }
  }
}
