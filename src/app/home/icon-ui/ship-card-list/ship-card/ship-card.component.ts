import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Gesture, GestureController, GestureDetail, IonInput, ModalController } from '@ionic/angular';
import { FilterService } from 'src/app/services/filter.service';
import { ShipCategoryDataService } from 'src/app/services/ship-category-data.service';
import { ShipLevelEditorComponent } from 'src/app/prompts/ship-level-editor/ship-level-editor.component';
import { IconUIComponent } from '../../icon-ui.component';
import { AzurapiService } from 'src/app/services/azurapi.service';
import { HomePage } from 'src/app/home/home.page';
import { IconDragService } from 'src/app/services/icon-drag.service';
import { DragFuncsService } from 'src/app/services/drag-funcs.service';
import { IconLoaderService } from 'src/app/services/icon-loader.service';

@Component({
  selector: 'app-ship-card',
  templateUrl: './ship-card.component.html',
  styleUrls: ['./ship-card.component.scss'],
})
export class ShipCardComponent implements OnInit, AfterViewInit {

  @ViewChild("card", {read: ElementRef}) shipElement: ElementRef;
  @ViewChild('levelInput') levelInput: IonInput;
  halfWidth: number;
  halfHeight: number;
  transformX: number = 0;
  transformY: number = 0;
  mouse: GestureDetail;
  input: boolean;
  gesture: Gesture;
  everyOtherFrame: boolean;
  dragStatus: string = "start";
  imageSrc: string = "";
  droppingDir: number;

  @Input() ship = null;
  @Input() currentCategory: string;

  fleetTechStatIconWidths = {
    "HP": 16,
    "AA": 17,
    "ASW": 18,
    "TRP": 16,
    "FP": 27,
    "EVA": 15,
    "HIT": 16,
    "AVI": 17,
    "RLD": 15,
  };

  constructor(private gestureController: GestureController, 
    private shipCategoryData: ShipCategoryDataService,
    private filter: FilterService,
    private modalController: ModalController,
    private iconUI: IconUIComponent,
    private home: HomePage,
    private iconDrag: IconDragService,
    private dragFuncs: DragFuncsService,
    private iconLoader: IconLoaderService) { }

  ngOnInit() {
    this.imageSrc = 'assets/ship thumbnails/' + this.ship.id + '.webp';
  }

  getFallbackThumbnail() {
    this.imageSrc = this.ship.thumbnail;
  }

  ngAfterViewInit() {
    // keep dragged ship still
    if(this.iconDrag.draggedShipComponent != null) {
      this.iconDrag.draggedShipComponent.updateDraggedShipPos();
    }

    this.iconDrag.shipCardRefs.push(this.shipElement);
    this.iconDrag.shipCards.push(this);

    // use setTimeout to delay it, as there is expression check error otherwise
    setTimeout(() => {
      this.dragStatus = "default";
    }, 50)

    // dragging threshold is handled manually, as the default only handles the X and Y axises separately
    let isBeingDragged = false;
    this.gesture = this.gestureController.create({
      el: this.shipElement.nativeElement,
      threshold: 0,
      gestureName: 'my-gesture',
      onMove: mouse => {
        if(!isBeingDragged) {
          if(Math.abs(mouse.deltaX) > 10 || Math.abs(mouse.deltaY) > 10) {
            this.iconDrag.draggedShipComponent = this;
            this.mouse = mouse;
            isBeingDragged = true;
            this.dragStatus = "dragged";
            const sizes = this.dragFuncs.getHalfSizes(this.shipElement);
            this.halfWidth = sizes[0];
            this.halfHeight = sizes[1];

            // place ship last in list, to make it appear like it's taken out
            this.removeFromPreviousCategory();
            this.shipCategoryData.categories[this.currentCategory].ships.push(this.ship);
            this.iconLoader.refresh();
            this.updateDraggedShipPos();
          }
        } else {
          this.updateDraggedShipPos();
          this.otherCategoryCheck();
          this.betweenShipCheck(false);
        }
      },
      onEnd: () => {
        if(!isBeingDragged) {
          return;
        }
        isBeingDragged = false;
        this.iconDrag.draggedShipComponent = null;
        this.betweenShipCheck(true);
        this.mouse = null;
        this.dragStatus = "default";
        this.transformX = 0;
        this.transformY = 0;
        this.iconDrag.shipCards.forEach(card => {
          card.droppingDir = 0;
        })
      }
    }, true);
    this.gesture.enable();
  }

  otherCategoryCheck() {
    for(let i = 0; i < this.iconUI.categoryElements.length; i++) {
      const rect = this.iconUI.categoryElements.get(i).nativeElement.getBoundingClientRect();

      if(this.dragFuncs.isColliding(rect, this.mouse)) {
        if(this.shipCategoryData.categories[this.currentCategory].sortId != i) {
          const category = this.shipCategoryData.sortedCategoryNames[i];
          this.shipCategoryData.switchPos(this.ship, this.currentCategory, category);
          this.filter.filter();
          
          this.shipCategoryData.selectedCategory = this.shipCategoryData.sortedCategoryNames[i];
          this.shipCategoryData.save();
          break;
        }
      }
    }
  }

  betweenShipCheck(dropped: boolean) {
    for(let i = 0; i < this.iconDrag.shipCardRefs.length; i++) {
      const el = this.iconDrag.shipCardRefs[i];
      const rect = el.nativeElement.getBoundingClientRect();
      if(this.iconDrag.shipCardRefs[i] == this.shipElement) {
        continue;
      }
      if(this.dragFuncs.isColliding(rect, this.mouse)) {
        const leftHalf = this.dragFuncs.getHalfSizes(el)[0] + rect.x;
        const index = this.shipCategoryData.indexOf(this.iconDrag.shipCards[i].ship);
        if(this.mouse.currentX < leftHalf) {
          if(dropped) {
            this.shipCategoryData.switchPos(this.ship, this.currentCategory, this.currentCategory, index);
          } else {
            this.iconDrag.shipCards[i].droppingDir = -1;
          }
        } else {
          if(dropped) {
            this.shipCategoryData.switchPos(this.ship, this.currentCategory, this.currentCategory, index+1);
          } else {
            this.iconDrag.shipCards[i].droppingDir = 1;
          }
        }

        if(dropped) {
          this.iconLoader.refresh();
        }
      } else {
        this.iconDrag.shipCards[i].droppingDir = 0;
      }
    }
  }

  checkDroppedInCategory() {
    for(let i = 0; i < this.iconUI.categoryElements.length; i++) {
      const rect = this.iconUI.categoryElements.get(i).nativeElement.getBoundingClientRect();
    
      if(this.dragFuncs.isColliding(rect, this.mouse)) {
        if(this.shipCategoryData.categories[this.currentCategory].sortId != i) {
          this.addToCategory(i);
          this.removeFromPreviousCategory();
          this.filter.filter();
          break;
        }
      }
    }
  }

  addToCategory(index: number) {
    Object.keys(this.shipCategoryData.categories).forEach(categoryName => {
      const category = this.shipCategoryData.categories[categoryName];
      if(category.sortId == index) {
        category.ships.push(this.ship);
        this.filter.filter();
        return;
      }
    })
  }

  removeFromPreviousCategory() {
    let ships = this.shipCategoryData.categories[this.currentCategory].ships;
    ships.splice(ships.indexOf(this.ship), 1);
  }

  updateDraggedShipPos() {
    // if mouse doesn't exist, it's not being dragged
    if(this.mouse == null) {
      return;
    }

    // scroll not needed, but it prevents card from flickering when switching categories
    this.home.ionContent.getScrollElement().then(() => {
      const pos = this.dragFuncs.moveElement(this.shipElement, this.transformX, this.transformY, this.halfWidth, this.halfHeight, this.mouse);
      this.transformX = pos[0];
      this.transformY = pos[1];
    });
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
      }
    })
  }

  ngOnDestroy() {
    this.gesture.destroy();
  }
}