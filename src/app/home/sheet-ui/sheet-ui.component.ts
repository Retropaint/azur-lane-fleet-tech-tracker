import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CategoryEditorComponent } from 'src/app/prompts/category-editor/category-editor.component';
import { FilterService } from 'src/app/services/filter.service';
import { SheetDragService } from 'src/app/services/sheet-drag.service';
import { ShipCategoryDataService } from 'src/app/services/ship-category-data.service';
import { HomePage } from '../home.page';

@Component({
  selector: 'app-sheet-ui',
  templateUrl: './sheet-ui.component.html',
  styleUrls: ['./sheet-ui.component.scss', '../home.page.scss'],
})
export class SheetUIComponent implements OnInit {

  @ViewChildren('categoryContainers', {read: ElementRef}) categoryContainers: QueryList<ElementRef>;
  @ViewChild('container') container: ElementRef;

  loadedSheets: number = 0;

  constructor(public shipCategoryData: ShipCategoryDataService, 
    public home: HomePage, 
    public filter: FilterService, 
    private categoryEditor: CategoryEditorComponent,
    public sheetDrag: SheetDragService) {}

    ngOnInit() {
      this.sheetDrag.rows = {};
      this.sheetDrag.rowRefs = {};
    }
}
