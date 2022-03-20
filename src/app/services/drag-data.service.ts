import { ElementRef, Injectable } from '@angular/core';
import { GestureDetail, IonContent } from '@ionic/angular';
import { HomePage } from '../home/home.page';
import { SheetShipRowComponent } from '../home/sheet-ui/sheet-ship-row/sheet-ship-row.component';
import { Ship } from '../interfaces/ship';

@Injectable({
  providedIn: 'root'
})
export class DragDataService {

  homeIonContent: IonContent; // used for scroll info
  draggedShipComponent: any; // used for communication between home and currently dragged card component (primarily scrolling)
  categoryElements: ElementRef[];
  selectedCategory: string;
  isLoadingShipList: boolean; // used by ship card to know whether to go into .start or .default selector when dropped

  shipRows = {};
  shipRowElements = {};

  constructor() {}

  moveElement(el: ElementRef, transformX: number, transformY: number, halfWidth: number, halfHeight: number, mouse: GestureDetail) {
    const pos = [];

    const initialX = el.nativeElement.getBoundingClientRect().x - transformX;
    const initialY = el.nativeElement.getBoundingClientRect().y - transformY;
    pos[0] = initialX - (initialX * 2) + mouse.currentX - halfWidth;
    pos[1] = initialY - (initialY * 2) + mouse.currentY - halfHeight;
    return pos;
  }

  getHalfSizes(el: ElementRef) {
    const sizes = [];

    sizes[0] = el.nativeElement.getBoundingClientRect().width / 2;
    sizes[1] = el.nativeElement.getBoundingClientRect().height / 2;
    return sizes;
  }

  isColliding(rect, mouse): boolean {
    if(mouse.currentX > rect.left && mouse.currentX < rect.left+rect.width) {
      if(mouse.currentY > rect.top && mouse.currentY < rect.top+rect.height) {
        return true;
      }
    }
    return false;
  }

  getInitialX(el, transformX): number {
    const initialX = el.nativeElement.getBoundingClientRect().x - transformX;
    return initialX - (initialX * 2);
  }
}
