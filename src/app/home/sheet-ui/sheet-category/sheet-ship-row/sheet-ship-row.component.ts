import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Gesture, GestureController, GestureDetail } from '@ionic/angular';
import { Ship } from 'src/app/interfaces/ship';
import { DragFuncsService } from 'src/app/services/drag-funcs.service';
import { FilterService } from 'src/app/services/filter.service';
import { SheetDragService } from 'src/app/services/sheet-drag.service';
import { ShipCategoryDataService } from 'src/app/services/ship-category-data.service';
import { SheetUIComponent } from '../../sheet-ui.component';

@Component({
  selector: 'app-sheet-ship-row',
  templateUrl: './sheet-ship-row.component.html',
  styleUrls: ['./sheet-ship-row.component.scss', '../../sheet-ui.component.scss'],
})
export class SheetShipRowComponent implements AfterViewInit, OnInit {

  @ViewChild('row', {read: ElementRef}) rowElement: ElementRef;
  @ViewChild('levelInput', {read: ElementRef}) levelInputElement: ElementRef;
  @Input() ship: Ship;
  @Input() category: string;
  transformX: number = 0;
  transformY: number = 0;
  mouse: GestureDetail;
  draggedStatus: string = "default";
  halfWidth: number; 
  halfHeight: number;
  gesture: Gesture;
  greenBorder: string;
  scrollingDir: number;
  inputShipLevel: string;
  zIndex: number; // used to render row ahead for level focus outline

  constructor(
    private gestureController: GestureController, 
    private shipCategoryData: ShipCategoryDataService,
    private sheetUI: SheetUIComponent,
    public filter: FilterService,
    private dragFuncs: DragFuncsService,
    private sheetDrag: SheetDragService) {}

  ngOnInit() {
    this.inputShipLevel = this.ship.level.toString();
  }

  ngAfterViewInit() {
    let isBeingDragged = false;
    let moveFrame = 0;
    let lastCollisionFrameMouse: GestureDetail = null;

    // add row script and element 
    const addToDragData = (object, toAdd) => {
      if(object[this.category] == null) {
        object[this.category] = {};
        object[this.category].ships = [];
      }
      object[this.category].ships.push(toAdd);
    }
    addToDragData(this.sheetDrag.rows, this);
    addToDragData(this.sheetDrag.rowRefs, this.rowElement);

    this.gesture = this.gestureController.create({
      el: this.rowElement.nativeElement,
      gestureName: 'my-gesture',
      threshold: 0,
      onMove: (mouse) => {
        if(!isBeingDragged) {
          if(Math.abs(mouse.deltaX) > 10 || Math.abs(mouse.deltaY) > 10) {
            lastCollisionFrameMouse = mouse;
            this.mouse = mouse;
            isBeingDragged = true;
            this.draggedStatus = "dragged";
            document.getElementById(this.category).style.setProperty('z-index', '99');
          }
        } else {
          if(this.mouse != null) {
            if(this.halfWidth == null || this.halfHeight == null) {
              const sizes = this.dragFuncs.getHalfSizes(this.rowElement);
              this.halfWidth = sizes[0];
              this.halfHeight = sizes[1];
            }
            this.updateRowPos();

            // collision doesn't need to be checked every frame, so reduce the load
            moveFrame++;
            if(moveFrame >= 3) {
              moveFrame = 0;
              this.checkCollidingShip(false, this.mouse);

              // do not *reference* the mouse, just copy its values in this frame
              lastCollisionFrameMouse = JSON.parse(JSON.stringify(this.mouse));
            }
          }
        }
      },
      onEnd: () => {
        if(!isBeingDragged) {
          return;
        }
        document.getElementById(this.category).style.setProperty('z-index', '0');
        isBeingDragged = false;
        this.draggedStatus = "default";
        this.transformX = 0;
        this.transformY = 0;
        this.checkCollidingShip(true, lastCollisionFrameMouse);
        this.mouse = null;
        this.sheetDrag.highlightedHeader = null;
        this.shipCategoryData.save();
        clearInterval(this.sheetDrag.scrollingInterval);
        this.sheetDrag.scrollingInterval = null;
        console.log(this.sheetDrag.rows);
      }
    }, true)
    this.gesture.enable();
  }

  updateRowPos() {
    const containerRect = this.sheetUI.container.nativeElement.getBoundingClientRect();
    const rect = this.rowElement.nativeElement.getBoundingClientRect();

    const pos = this.dragFuncs.moveElement(this.rowElement, this.transformX, this.transformY, this.halfWidth, this.halfHeight, this.mouse);
    const initialX = this.dragFuncs.getInitialX(this.rowElement, this.transformX);
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
      clearInterval(this.sheetDrag.scrollingInterval);
      this.sheetDrag.scrollingInterval = null;
    }
  }

  startScrolling(speed) {
    if(this.sheetDrag.scrollingInterval == null) {
      this.sheetDrag.scrollingInterval = setInterval(() => {
        this.sheetUI.container.nativeElement.scrollLeft += speed;
        this.updateRowPos();
      })
    }
  }

  checkCollidingShip(hasDropped: boolean, mouse) {
    this.sheetDrag.highlightedHeader = null;
    this.sheetDrag.belowGridIndex = null;
    Object.keys(this.sheetDrag.rows).forEach(shipRow => {
      this.sheetDrag.rows[shipRow].ships.forEach(ship => {
        ship.greenBorder = "";
      })
    })

    for(let i = 0; i < this.sheetUI.categoryContainers.length; i++) {
      const rect = this.sheetUI.categoryContainers.get(i).nativeElement.getBoundingClientRect();

      // instead of checking collision against all ship rows, it only checks the grid it's in
      if(this.dragFuncs.isColliding(rect, mouse)) {
        let isBelowGrid = true;
        
        // category header
        if(this.dragFuncs.isColliding(this.sheetDrag.headerRefs[i].nativeElement.getBoundingClientRect(), mouse)) {
          isBelowGrid = false;
          console.log("header");
          if(hasDropped) {
            this.remove();
            this.shipCategoryData.categories[this.shipCategoryData.sortedCategoryNames[i]].ships.unshift(this.ship);
          } else {
            this.sheetDrag.highlightedHeader = i;
          }
          break;
        }

        // specific ship row
        const categoryName = this.shipCategoryData.sortedCategoryNames[i]
        const rows = this.sheetDrag.rows[categoryName]['ships'];
        const rowRefs = this.sheetDrag.rowRefs[categoryName]['ships']
        if(this.shipCategoryData.categories[categoryName].ships.length != 0) {
          for(let j = 0; j < rows.length; j++) {
            const shipRow = rows[j];
            const el = rowRefs[j].nativeElement.getBoundingClientRect();
            if(shipRow == this) {
              continue;
            }
            if(this.dragFuncs.isColliding(el, mouse)) {
              isBelowGrid = false;
              if(hasDropped) {
                this.shipCategoryData.switchPos(this.ship, this.category, categoryName, this.shipCategoryData.indexOf(shipRow.ship));
              } else {
                shipRow.displayGreenLine();
              }
              break;
            }
          }
        }

        if(isBelowGrid) {
          if(hasDropped) {
            this.shipCategoryData.switchPos(this.ship, this.category, categoryName);
            this.shipCategoryData.save();
          } else {
            this.sheetDrag.belowGridIndex = i;
          }
        }
        break;
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

  remove() {
    this.shipCategoryData.remove(this.ship, this.category);
  }

  levelInputFocus() {
    this.inputShipLevel = "";
    this.zIndex = 99; // render on top for outline
  }

  submitLevel(byBlur: boolean) {
    this.zIndex = 0; 
    if(this.inputShipLevel == "" || this.inputShipLevel == null) {
      this.inputShipLevel = this.ship.level.toString();
    } else {
      if(this.inputShipLevel == "0") {
        this.inputShipLevel = "1";
      }
      const num = Math.min(parseInt(this.inputShipLevel), 125);
      this.inputShipLevel = num.toString();
      this.ship.level = num;
    }

    // go to next ship in the grid
    if(!byBlur) {
      const index = this.sheetDrag.rowRefs[this.category].ships.indexOf(this.rowElement);
      const shipRows = this.sheetDrag.rows[this.category].ships;
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

  ngOnDestroy() {
    this.gesture.destroy();
  }
}
