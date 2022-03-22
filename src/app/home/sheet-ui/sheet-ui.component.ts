import { AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { GestureController } from '@ionic/angular';
import { CategoryEditorComponent } from 'src/app/prompts/category-editor/category-editor.component';
import { FilterService } from 'src/app/services/filter.service';
import { SheetDragService } from 'src/app/services/sheet-drag.service';
import { ShipCategoryDataService } from 'src/app/services/ship-category-data.service';
import { HomePage } from '../home.page';
import { SheetShipRowComponent } from './sheet-category/sheet-ship-row/sheet-ship-row.component';

@Component({
  selector: 'app-sheet-ui',
  templateUrl: './sheet-ui.component.html',
  styleUrls: ['./sheet-ui.component.scss', '../home.page.scss'],
})
export class SheetUIComponent {

  @ViewChildren('categoryContainers', {read: ElementRef}) categoryContainers: QueryList<ElementRef>;
  @ViewChild('container') container: ElementRef;

  loadedSheets: number = 0;

  constructor(public shipCategoryData: ShipCategoryDataService, 
    public home: HomePage, 
    public filter: FilterService, 
    private categoryEditor: CategoryEditorComponent,
    public sheetDrag: SheetDragService) {}
}
