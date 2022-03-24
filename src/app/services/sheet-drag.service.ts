import { Injectable } from '@angular/core';
import { DragElement } from '../interfaces/drag-element';
import { DragFuncsService } from './drag-funcs.service';

@Injectable({
  providedIn: 'root'
})
export class SheetDragService {

  rows = {};
  rowRefs = {};
  categoryRefs = [];
  headerRefs = [];
  highlightHeaderIndex: number;
  belowGridIndex: number
  highlightedHeader: number;
  scrollingInterval: any;

  constructor(private dragFuncs: DragFuncsService) { }

  startScrolling(dragElement: DragElement, speed: number) {
    if(this.scrollingInterval == null) {
      this.scrollingInterval = setInterval(() => {
        dragElement.sheetUI.container.nativeElement.scrollLeft += speed;
        this.updateElementPos(dragElement);
      })
    }
  }

  updateElementPos(dragElement: DragElement) {
    const containerRect = dragElement.sheetUI.container.nativeElement.getBoundingClientRect();
    const rect = dragElement.gestureElement.nativeElement.getBoundingClientRect();

    const pos = this.dragFuncs.moveElement(dragElement.gestureElement, dragElement.transformX, dragElement.transformY, dragElement.halfWidth, dragElement.halfHeight, dragElement.mouse);
    const initialX = this.dragFuncs.getInitialX(dragElement.gestureElement, dragElement.transformX);
    dragElement.transformY = pos[1];

    // scrolling right
    if(dragElement.mouse.currentX + dragElement.halfWidth > containerRect.x + containerRect.width) {
      dragElement.transformX = initialX + (containerRect.x + containerRect.width) - rect.width;
      dragElement.scrollingDir = 1;
      this.startScrolling(dragElement, -7);
    }
    // scrolling left
    else if(dragElement.mouse.currentX - dragElement.halfWidth < containerRect.x) {
      dragElement.transformX = initialX + containerRect.x;
      dragElement.scrollingDir = -1;
      this.startScrolling(dragElement, 7);
    } else {
      console.log("what");
      dragElement.transformX = pos[0];
      dragElement.scrollingDir = 0;
      clearInterval(this.scrollingInterval);
      this.scrollingInterval = null;
    }
  }
}
