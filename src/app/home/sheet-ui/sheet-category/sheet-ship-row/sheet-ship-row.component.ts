import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Gesture, GestureController, GestureDetail, ModalController } from '@ionic/angular';
import { DragElement } from 'src/app/interfaces/drag-element';
import { Ship } from 'src/app/interfaces/ship';
import { ShipLevelEditorComponent } from 'src/app/prompts/ship-level-editor/ship-level-editor.component';
import { DragFuncsService } from 'src/app/services/drag-funcs.service';
import { FilterService } from 'src/app/services/filter.service';
import { HoverTitlesService } from 'src/app/services/hover-titles.service';
import { SheetDragService } from 'src/app/services/sheet-drag.service';
import { ShipCategoryDataService } from 'src/app/services/ship-category-data.service';
import { SortService } from 'src/app/services/sort.service';
import { SheetUIComponent } from '../../sheet-ui.component';

@Component({
  selector: 'app-sheet-ship-row',
  templateUrl: './sheet-ship-row.component.html',
  styleUrls: ['./sheet-ship-row.component.scss', '../sheet-category.component.scss'],
})
export class SheetShipRowComponent implements AfterViewInit, OnInit {

  @ViewChild('row', {read: ElementRef}) rowElement: ElementRef;
  @ViewChild('levelInput', {read: ElementRef}) levelInputElement: ElementRef;
  @Input() ship: Ship;
  @Input() category: string;
  draggedStatus: string = "default";
  greenBorder: string;
  inputShipLevel: string;
  zIndex: number; // used to render row ahead for level focus outline
  dragEl: DragElement;
  isSliderActive: boolean;
  fleetTechHoverTitle: string;

  fleetTechStatIconWidths = {
    "HP": 16,
    "AA": 17,
    "ASW": 17,
    "TRP": 16,
    "FP": 17,
    "EVA": 15,
    "HIT": 16,
    "AVI": 17,
    "RLD": 15,
  };

  constructor(
    private gestureController: GestureController, 
    private shipCategoryData: ShipCategoryDataService,
    private sheetUI: SheetUIComponent,
    public filter: FilterService,
    private dragFuncs: DragFuncsService,
    private sheetDrag: SheetDragService,
    private selfRef: ElementRef,
    private modalController: ModalController,
    public hoverTitles: HoverTitlesService,
    private sort: SortService) {}

  ngOnInit() {
    this.inputShipLevel = this.ship.level.toString();
    this.dragEl = {
      sheetUI: this.sheetUI,
    }
    this.fleetTechHoverTitle = this.hoverTitles.stats[this.ship.techStat] + ' (' + this.ship.techStat + ') +' + this.ship.techBonus;
  }

  ngAfterViewInit() {
    this.dragEl.gestureElement = this.rowElement;

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

    this.dragEl.gesture = this.gestureController.create({
      el: this.rowElement.nativeElement,
      gestureName: 'my-gesture',
      threshold: 0,
      onMove: (mouse) => {
        if(!isBeingDragged) {
          if(Math.abs(mouse.deltaX) > 10 || Math.abs(mouse.deltaY) > 10) {
            lastCollisionFrameMouse = mouse;
            this.dragEl.mouse = mouse;
            isBeingDragged = true;
            this.draggedStatus = "dragged";
            console.log(document.getElementById(this.category));
            document.getElementById(this.category).style.zIndex = "99";
          }
        } else {
          if(this.dragEl.mouse != null) {
            if(this.dragEl.halfWidth == null || this.dragEl.halfHeight == null) {
              const sizes = this.dragFuncs.getHalfSizes(this.rowElement);
              this.dragEl.halfWidth = sizes[0];
              this.dragEl.halfHeight = sizes[1];
            }
            this.sheetDrag.updateElementPos(this.dragEl);

            // collision doesn't need to be checked every frame, so reduce the load
            moveFrame++;
            if(moveFrame >= 3) {
              moveFrame = 0;
              this.checkCollidingShip(false, this.dragEl.mouse);

              // do not *reference* the mouse, just copy its values in this frame
              lastCollisionFrameMouse = JSON.parse(JSON.stringify(this.dragEl.mouse));
            }
          }
        }
      },
      onEnd: () => {
        if(!isBeingDragged) {
          return;
        }
        document.getElementById(this.category).style.zIndex = "0";
        isBeingDragged = false;
        this.draggedStatus = "default";
        this.dragEl.transformX = 0;
        this.dragEl.transformY = 0;
        this.checkCollidingShip(true, lastCollisionFrameMouse);
        this.dragEl.mouse = null;
        this.sheetDrag.highlightedHeader = null;
        this.shipCategoryData.save();
        clearInterval(this.sheetDrag.scrollingInterval);
        this.sheetDrag.scrollingInterval = null;
        console.log(this.sheetDrag.rows);
      }
    }, true)
    //this.dragEl.gesture.enable();
  }

  startScrolling(speed) {
    if(this.sheetDrag.scrollingInterval == null) {
      this.sheetDrag.scrollingInterval = setInterval(() => {
        this.sheetUI.container.nativeElement.scrollLeft += speed;
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

  async enterLevel() {
    const modal = await this.modalController.create({
      component:ShipLevelEditorComponent,
      animated: false,
      componentProps: {
        "name": this.ship.name,
        "level": this.ship.level
      }
    })
    modal.present();
    modal.onDidDismiss().then(value => {
      if(value.data != null) {
        this.ship.level = value.data;
        this.shipCategoryData.save();
        if(this.sort.lastType == "Level") {
          this.sort.sort("Level", this.category, true)
        }
      }
    })
  }

  ngOnDestroy() {
    this.dragEl.gesture.destroy();
  }

  // functions for level cell in its input version

  levelInputFocus() {
    this.inputShipLevel = "";
    this.zIndex = 99; // render on top for outline
    this.isSliderActive = true;
  }

  submitLevel(byBlur: boolean) {
    this.isSliderActive = false;
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
}
