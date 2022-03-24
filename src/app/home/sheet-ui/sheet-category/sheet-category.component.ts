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
  @Input() category: string;
  @Input() index: number;
  @Input() isHeaderHighlighted: boolean;
  @Input() belowThisGrid: boolean;
  dragElement: DragElement;

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

    let isBeingDragged = false;
    this.dragElement.gesture = this.gestureController.create({
      el: this.headerElement.nativeElement,
      gestureName: "element",
      threshold: 0,
      onMove: (mouse) => {
        if(!isBeingDragged) {
          if(mouse.deltaX > 1 || mouse.deltaY > 1) {
            isBeingDragged = true;
            this.dragElement.mouse = mouse;
          }
        } else {
          if(this.dragElement.halfWidth == null || this.dragElement.halfHeight == null) {
            const sizes = this.dragFuncs.getHalfSizes(this.headerElement);
            this.dragElement.halfWidth = sizes[0];
            this.dragElement.halfHeight = sizes[1];
          } else {
            this.sheetDrag.updateElementPos(this.dragElement);
          }
        }
      },
      onEnd: () => {
        isBeingDragged = false;
        this.dragElement.transformX = 0;
        this.dragElement.transformY = 0;
      }
    }, true)
    this.dragElement.gesture.enable();
  }

  openCategoryEditor(category: string) {
    this.categoryEditor.open(category);
  }
}
