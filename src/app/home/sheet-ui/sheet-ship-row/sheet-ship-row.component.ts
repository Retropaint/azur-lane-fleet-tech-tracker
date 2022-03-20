import { AfterViewInit, Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { Gesture, GestureController, GestureDetail, IonInput, ModalController } from '@ionic/angular';
import { Ship } from 'src/app/interfaces/ship';
import { DragDataService } from 'src/app/services/drag-data.service';
import { FilterService } from 'src/app/services/filter.service';
import { ShipCategoryDataService } from 'src/app/services/ship-category-data.service';
import { SheetUIComponent } from '../sheet-ui.component';

@Component({
  selector: 'app-sheet-ship-row',
  templateUrl: './sheet-ship-row.component.html',
  styleUrls: ['./sheet-ship-row.component.scss', '../sheet-ui.component.scss'],
})
export class SheetShipRowComponent implements AfterViewInit, OnInit {

  @ViewChild('row', {read: ElementRef}) rowElement: ElementRef;
  @ViewChild('levelInput', {read: ElementRef}) levelInputElement: ElementRef;
  @Input() ship: Ship;
  @Input() category: string;
  transformX: number = 0;
  transformY: number = 0;
  mouse: GestureDetail;
  halfWidth: number; 
  halfHeight: number;
  gesture: Gesture;
  draggedStatus: string = "default";
  greenBorder: string;
  scrollingDir: number;
  prevLevelInputShipLevel: string;
  levelInputShipLevel: string;
  zIndex: number; // used to render row ahead for level focus outline

  constructor(
    private gestureController: GestureController, 
    private dragData: DragDataService, 
    private shipCategoryData: ShipCategoryDataService,
    private sheetUI: SheetUIComponent,
    public filter: FilterService) {}

  ngOnInit() {
    this.levelInputShipLevel = this.ship.level.toString();
    this.prevLevelInputShipLevel = this.levelInputShipLevel;
  }

  ngAfterViewInit() {
    let isBeingDragged = false;

    // add row script and element 
    const addToDragData = (object, toAdd) => {
      if(object[this.category] == null) {
        object[this.category] = {};
        object[this.category].ships = [];
      }
      object[this.category].ships.push(toAdd);
    }
    addToDragData(this.dragData.shipRows, this);
    addToDragData(this.dragData.shipRowElements, this.rowElement);

    this.gesture = this.gestureController.create({
      el: this.rowElement.nativeElement,
      gestureName: 'my-gesture',
      threshold: 0,
      onMove: (mouse) => {
        if(!isBeingDragged) {
          if(Math.abs(mouse.deltaX) > 10 || Math.abs(mouse.deltaY) > 10) {
            this.mouse = mouse;
            isBeingDragged = true;
            this.draggedStatus = "dragged";
            // since absolute position changes size, wait for html update
            setTimeout(() => {
              const sizes = this.dragData.getHalfSizes(this.rowElement);
              this.halfWidth = sizes[0];
              this.halfHeight = sizes[1];
            })
            document.getElementById(this.category).style.setProperty('z-index', '99');
          }
        } else {
          if(this.mouse != null) {
            this.updateRowPos();
            this.checkCollidingShip(false);
          }
        }
      },
      onEnd: () => {
        document.getElementById(this.category).style.setProperty('z-index', '0');
        isBeingDragged = false;
        this.draggedStatus = "default";
        this.transformX = 0;
        this.transformY = 0;
        if(this.mouse != null) {
          this.checkCollidingShip(true);
        }
        this.mouse = null;
        this.sheetUI.highlightedHeaderElement = null;
        this.shipCategoryData.save();
        clearInterval(this.sheetUI.scrollingInterval);
        this.sheetUI.scrollingInterval = null;
      }
    }, true)
    this.gesture.enable();
  }

  updateRowPos() {
    const containerRect = this.sheetUI.container.nativeElement.getBoundingClientRect();
    const rect = this.rowElement.nativeElement.getBoundingClientRect();
    const pos = this.dragData.moveElement(this.rowElement, this.transformX, this.transformY, this.halfWidth, this.halfHeight, this.mouse);
    const initialX = this.dragData.getInitialX(this.rowElement, this.transformX);
    this.transformY = pos[1];

    // scrolling right
    if(this.mouse.currentX + this.halfWidth > containerRect.x + containerRect.width) {
      this.transformX = initialX + (containerRect.x + containerRect.width) - rect.width;
      this.scrollingDir = 1;
      this.startScrolling(-7);
    }
    // scrolling left
    else if(this.mouse.currentX - this.halfWidth < containerRect.x) {
      this.transformX = initialX + containerRect.x;
      this.scrollingDir = -1;
      this.startScrolling(7);
    } else {
      this.transformX = pos[0];
      this.scrollingDir = 0;
      clearInterval(this.sheetUI.scrollingInterval);
      this.sheetUI.scrollingInterval = null;
    }
  }

  startScrolling(speed) {
    if(this.sheetUI.scrollingInterval == null) {
      this.sheetUI.scrollingInterval = setInterval(() => {
        this.sheetUI.container.nativeElement.scrollLeft += speed;
        this.updateRowPos();
      })
    }
  }

  checkCollidingShip(hasDropped: boolean) {
    this.sheetUI.highlightedHeaderElement = null;
    this.sheetUI.belowGridIndex = null;
    Object.keys(this.dragData.shipRows).forEach(shipRow => {
      this.dragData.shipRows[shipRow].ships.forEach(ship => {
        ship.greenBorder = "";
      })
    })

    for(let i = 0; i < this.sheetUI.categoryElements.length; i++) {
      const rect = this.sheetUI.categoryElements.get(i).nativeElement.getBoundingClientRect();

      // instead of checking collision against all ship rows, it only checks the grid it's in
      if(this.dragData.isColliding(rect, this.mouse)) {
        let isBelowGrid = true;
        
        // category header
        if(this.dragData.isColliding(this.sheetUI.categoryHeaderElements.get(i).nativeElement.getBoundingClientRect(), this.mouse)) {
          isBelowGrid = false;
          if(hasDropped) {
            this.removeFromPreviousCategory();
            this.shipCategoryData.categories[this.shipCategoryData.sortedCategoryNames[i]].ships.unshift(this.ship);
          } else {
            this.sheetUI.highlightedHeaderElement = i;
          }
          return;
        }

        // specific ship row
        const categoryName = this.shipCategoryData.sortedCategoryNames[i]
        if(this.shipCategoryData.categories[categoryName].ships.length != 0) {
          for(let j = 0; j < this.dragData.shipRowElements[categoryName]['ships'].length; j++) {
            const shipRow = this.dragData.shipRows[categoryName]['ships'][j];
            const el = this.dragData.shipRowElements[categoryName]['ships'][j].nativeElement.getBoundingClientRect();
            if(shipRow == this) {
              continue;
            }
            if(this.dragData.isColliding(el, this.mouse)) {
              isBelowGrid = false;
              if(hasDropped) {
                this.removeFromPreviousCategory();
                shipRow.addToCategory(this.ship);
              } else {
                shipRow.displayGreenLine();
              }
              break;
            }
          }
        }

        if(isBelowGrid) {
          if(hasDropped) {
            this.removeFromPreviousCategory();
            this.shipCategoryData.categories[categoryName].ships.push(this.ship);
            this.shipCategoryData.save();
          } else {
            this.sheetUI.belowGridIndex = i;
          }
        }
      }
    }
  }

  displayGreenLine() {
    this.greenBorder = "top";
  }

  addToCategory(addedShip: Ship) {
    let ships = this.shipCategoryData.categories[this.category].ships;
    ships.splice(ships.indexOf(this.ship), 0, addedShip);
  }

  removeFromPreviousCategory() {
    let ships = this.shipCategoryData.categories[this.category].ships;
    
    ships.splice(ships.indexOf(this.ship), 1);
  }

  levelInputFocus() {
    this.levelInputShipLevel = "";
    this.zIndex = 99; // render on top for outline
  }

  submitLevel(byBlur: boolean) {
    this.zIndex = 0; 
    if(this.levelInputShipLevel == "" || this.levelInputShipLevel == null) {
      this.levelInputShipLevel = this.ship.level.toString();
    } else {
      if(this.levelInputShipLevel == "0") {
        this.levelInputShipLevel = "1";
      }
      const num = Math.min(parseInt(this.levelInputShipLevel), 125);
      this.levelInputShipLevel = num.toString();
      this.ship.level = num;
    }

    // go to next ship in the grid
    if(!byBlur) {
      const index = this.dragData.shipRowElements[this.category].ships.indexOf(this.rowElement);
      const shipRows = this.dragData.shipRows[this.category].ships;
      if(index < shipRows.length - 1) {
        shipRows[index + 1].focusInput();
      } else {
        this.levelInputElement.nativeElement.blur();
      }
    }
    this.shipCategoryData.save();
  }

  focusInput() {
    this.levelInputElement.nativeElement.focus();
  }
}
