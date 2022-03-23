import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Gesture, GestureController, GestureDetail } from '@ionic/angular';
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
export class SheetCategoryComponent implements AfterViewInit {

  @ViewChild('header') headerElement: ElementRef;
  @Input() category: string;
  @Input() index: number;
  @Input() isHeaderHighlighted: boolean;
  @Input() belowThisGrid: boolean;
  gesture: Gesture;
  transformX: number = 0;
  transformY: number = 0;
  halfWidth: number;
  halfHeight: number;
  mouse: GestureDetail;
  scrollingDir: number;

  constructor(public filter: FilterService, 
    public shipCategoryData: ShipCategoryDataService,
    private sheetDrag: SheetDragService,
    private categoryEditor: CategoryEditorComponent,
    private gestureController: GestureController,
    private selfRef: ElementRef,
    private dragFuncs: DragFuncsService,
    private sheetUI: SheetUIComponent
    ) {}

  ngAfterViewInit(): void {
    this.sheetDrag.headerRefs.push(this.headerElement);

    let isBeingDragged = false;
    this.gesture = this.gestureController.create({
      el: this.headerElement.nativeElement,
      gestureName: "element",
      threshold: 0,
      onMove: (mouse) => {
        if(!isBeingDragged) {
          if(mouse.deltaX > 1 || mouse.deltaY > 1) {
            isBeingDragged = true;
            this.mouse = mouse;
          }
        } else {
          if(this.halfWidth == null || this.halfHeight == null) {
            const sizes = this.dragFuncs.getHalfSizes(this.headerElement);
            this.halfWidth = sizes[0];
            this.halfHeight = sizes[1];
          } else {
            this.sheetDrag.updateElementPos(this, this.headerElement);
          }
        }
      },
      onEnd: () => {
        isBeingDragged = false;
        this.transformX = 0;
        this.transformY = 0;
      }
    }, true)
    this.gesture.enable();
  }

  updatePos() {
    const pos = this.dragFuncs.moveElement(this.headerElement, this.transformX, this.transformY, this.halfWidth, this.halfHeight, this.mouse);
    this.transformX = pos[0];
    this.transformY = pos[1];
  }

  openCategoryEditor(category: string) {
    this.categoryEditor.open(category);
  }
}
