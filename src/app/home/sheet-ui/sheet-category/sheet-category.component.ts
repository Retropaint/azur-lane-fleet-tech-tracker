import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Gesture, GestureController, GestureDetail } from '@ionic/angular';
import { DragElement } from 'src/app/interfaces/drag-element';
import { CategoryEditorComponent } from 'src/app/prompts/category-editor/category-editor.component';
import { DragFuncsService } from 'src/app/services/drag-funcs.service';
import { FilterService } from 'src/app/services/filter.service';
import { SheetDragService } from 'src/app/services/sheet-drag.service';
import { ShipCategoryDataService } from 'src/app/services/ship-category-data.service';
import { SheetUIComponent } from '../sheet-ui.component';

@Component({
  selector: 'app-sheet-category',
  templateUrl: './sheet-category.component.html',
  styleUrls: ['./sheet-category.component.scss', '../sheet-ui.component.scss'],
})
export class SheetCategoryComponent implements AfterViewInit, OnInit {

  @ViewChild('header') headerElement: ElementRef;
  @ViewChild('categoryRef') categoryElement: ElementRef;
  @Input() category: string;
  @Input() index: number;
  @Input() isHeaderHighlighted: boolean;
  @Input() belowThisGrid: boolean;
  dragElement: DragElement;
  canOpenEditor: boolean;
  collidedCategory: SheetCategoryComponent;

  constructor(public filter: FilterService, 
    public shipCategoryData: ShipCategoryDataService,
    private sheetDrag: SheetDragService,
    private categoryEditor: CategoryEditorComponent,
    private gestureController: GestureController,
    private selfRef: ElementRef,
    private dragFuncs: DragFuncsService,
    private sheetUI: SheetUIComponent
    ) {}

  ngOnInit() {
    this.dragElement = {
      sheetUI: this.sheetUI,
    }
  }

  ngAfterViewInit(): void {
    this.dragElement.gestureElement = this.headerElement;

    this.sheetDrag.headerRefs.push(this.headerElement);
    this.sheetDrag.categoryRefs.push(this.categoryElement);
    this.sheetDrag.categories.push(this);

    let isBeingDragged = false;
    this.dragElement.gesture = this.gestureController.create({
      el: this.headerElement.nativeElement,
      gestureName: "element",
      threshold: 0,
      onMove: (mouse) => {
        if(!isBeingDragged) {
          if(mouse.deltaX > 0.1 || mouse.deltaY > 0.1) {
            if(this.dragElement.halfWidth == null) {
              const sizes = this.dragFuncs.getHalfSizes(this.headerElement);
              this.dragElement.halfWidth = sizes[0];
              this.dragElement.halfHeight = sizes[1];
            }
            isBeingDragged = true;
            this.dragElement.mouse = mouse;
            const categories = this.shipCategoryData.categories; 

            // push category to last and decrement Id's accordingly
            this.shipCategoryData.decrementSortIds(categories[this.category].sortId);
            this.shipCategoryData.categories[this.category].sortId = Object.keys(categories).length - 1;
            this.shipCategoryData.sort();
            this.sheetDrag.updateElementPos(this.dragElement);
          }
        } else {
          this.sheetDrag.updateElementPos(this.dragElement);
          this.checkCategoryCollision();
        }
      },
      onEnd: () => {
        if(!isBeingDragged) {
          return;
        } 
        isBeingDragged = false;
        this.dragElement.transformX = 0;
        this.dragElement.transformY = 0;
        clearInterval(this.sheetDrag.scrollingInterval);
        this.categoryCollision();

        // prevent editor opening
        this.canOpenEditor = false;
        setTimeout(() => {
          this.canOpenEditor = true
        }, 500)
        console.log(this.sheetDrag.categoryRefs);
      }
    }, true)
    this.dragElement.gesture.enable();
  }

  checkCategoryCollision() {
    for(let i = 0; i < this.sheetDrag.categoryRefs.length; i++) {
      const categoryRef = this.sheetDrag.categoryRefs[i];
      if(categoryRef == this.categoryElement) {
        continue;
      }
      const rect = categoryRef.nativeElement.getBoundingClientRect();
      if(this.dragFuncs.isColliding(rect, this.dragElement.mouse)) {
        const sizes = this.dragFuncs.getHalfSizes(categoryRef);
        this.collidedCategory = this.sheetDrag.categories[i];
        if(this.dragElement.mouse.currentX < rect.x + sizes[0]) {
          this.collidedCategory.dragElement.droppingDir = -1;
        } else {
          this.collidedCategory.dragElement.droppingDir = 1;
        }
        break;
      }
    }
  }

  categoryCollision() {
    if(this.collidedCategory == null) {
      return;
    }
    if(this.collidedCategory.dragElement.droppingDir == -1) {
      this.shipCategoryData.categories[this.category].sortId = this.shipCategoryData.categories[this.collidedCategory.category].sortId;      
      this.shipCategoryData.incrementSortIds(this.shipCategoryData.categories[this.category].sortId, this.category);
    } else {
      this.shipCategoryData.categories[this.category].sortId = this.shipCategoryData.categories[this.collidedCategory.category].sortId+1;      
      this.shipCategoryData.incrementSortIds(this.shipCategoryData.categories[this.category].sortId, this.category);
    }
    this.shipCategoryData.sort();
    this.shipCategoryData.save();
  }

  openCategoryEditor(category: string) {
    if(this.canOpenEditor) {
      this.categoryEditor.open(category);
    }
  }
}
