import { Injectable } from '@angular/core';
import { Ship } from '../interfaces/ship';
import { ShipsService } from './ships.service';

@Injectable({
  providedIn: 'root'
})
export class IconLoaderService {

  ships = [];
  interval: any;
  intervalTick: number = 9999;
  hasShips: boolean;

  constructor(private shipsService: ShipsService) { }

  loadShips(shipsFilterPass) {
    let index = 0;
    this.ships = [];
    let toAdd = [];
    this.shipsService.ships.forEach(ship => {
      if(shipsFilterPass[ship.id]) {
        toAdd.push(ship);
      }
    })
    toAdd = this.shipsService.setAllProperShipPos(toAdd);
    this.hasShips = toAdd.length > 0;

    clearInterval(this.interval);
    this.interval = setInterval(() => {
      const isLoading = index < toAdd.length;
      if(isLoading) {
        for(let i = 0; i < this.intervalTick; i++) {
          if(i > toAdd.length - 1) {
            break;
          }
          if(shipsFilterPass[toAdd[index].id]) {
            this.ships.push(toAdd[index]);
          }
          index++;
        }
      } else {
        clearInterval(this.interval);
      }
    })
  }

  refresh(ship: Ship) {
    clearInterval(this.interval);
    const lastIndex = this.getIndex(ship.id);
    this.ships = this.shipsService.setAllProperShipPos(this.shipsService.ships);
    console.log(lastIndex + ", " + this.getIndex(ship.id));
  }

  getIndex(id: string) {
    for(let i = 0; i < this.ships.length; i++) {
      if(this.ships[i].id == id) {
        return i;
      }
    }
  }
}
