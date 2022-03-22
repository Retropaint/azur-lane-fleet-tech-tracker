import { Injectable } from '@angular/core';
import { Ship } from '../interfaces/ship';
import { IconDragService } from './icon-drag.service';

@Injectable({
  providedIn: 'root'
})
export class IconLoaderService {

  loadedShips = [];
  interval: any;

  constructor(private iconDrag: IconDragService, ) { }

  loadShips(ships: Ship[]) {
    let index = 0;
    this.loadedShips = [];
    let hadDraggedShip = this.iconDrag.draggedShipComponent != null;

    // dragged ship is added instantly to make it render seamlessly across switches
    if(this.iconDrag.draggedShipComponent != null) {
      this.loadedShips[ships.length - 1] = ships[ships.length - 1]
      this.iconDrag.draggedShipComponent.updateDraggedShipPos();
    }
    clearInterval(this.interval);

    this.interval = setInterval(() => {
      const isLoading = index < ships.length;

      // place dragged ship in fading queue if dropped while others are still fading
      if(isLoading && hadDraggedShip && this.iconDrag.draggedShipComponent == null) {
        this.loadedShips[ships.length - 1] = null;
      }
      
      if(isLoading) {
        this.loadedShips[index] = ships[index];
        index++;
      } else {
        clearInterval(this.interval);
      }
    })
  }
}
