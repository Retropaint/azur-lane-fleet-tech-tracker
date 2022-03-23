import { Injectable } from '@angular/core';
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

  startScrolling(component, movingElement, speed) {
    if(this.scrollingInterval == null) {
      this.scrollingInterval = setInterval(() => {
        component.sheetUI.container.nativeElement.scrollLeft += speed;
        console.log(component);
        this.updateElementPos(component, movingElement);
      })
    }
  }

  updateElementPos(component, movingElement) {
    const containerRect = component.sheetUI.container.nativeElement.getBoundingClientRect();
    const rect = movingElement.nativeElement.getBoundingClientRect();

    const pos = this.dragFuncs.moveElement(movingElement, component.transformX, component.transformY, component.halfWidth, component.halfHeight, component.mouse);
    const initialX = this.dragFuncs.getInitialX(movingElement, component.transformX);
    component.transformY = pos[1];

    // scrolling right
    if(component.mouse.currentX + component.halfWidth > containerRect.x + containerRect.width) {
      component.transformX = initialX + (containerRect.x + containerRect.width) - rect.width;
      component.scrollingDir = 1;
      this.startScrolling(component, movingElement, -7);
    }
    // scrolling left
    else if(component.mouse.currentX - component.halfWidth < containerRect.x) {
      component.transformX = initialX + containerRect.x;
      component.scrollingDir = -1;
      this.startScrolling(component, movingElement, 7);
    } else {
      console.log("what");
      component.transformX = pos[0];
      component.scrollingDir = 0;
      clearInterval(component.sheetDrag.scrollingInterval);
      component.sheetDrag.scrollingInterval = null;
    }
  }
}
