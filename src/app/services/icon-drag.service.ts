import { ElementRef, Injectable } from '@angular/core';
import { ShipCardComponent } from '../home/icon-ui/ship-card-list/ship-card/ship-card.component';

@Injectable({
  providedIn: 'root'
})
export class IconDragService {

  draggedShipComponent: ShipCardComponent; // used for communication between home and currently dragged card component (primarily scrolling)
  categoryRefs: ElementRef[];
  isLoadingShipList: boolean; // used by ship card to know whether to go into .start or .default selector when dropped
  shipCards: ShipCardComponent[];
  shipCardRefs: ElementRef[];

  constructor() { }
}
