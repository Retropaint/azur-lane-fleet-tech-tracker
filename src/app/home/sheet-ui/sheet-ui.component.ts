import { Component, ElementRef, NgZone, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Ship } from 'src/app/interfaces/ship';
import { CategoryEditorComponent } from 'src/app/prompts/category-editor/category-editor.component';
import { FilterService } from 'src/app/services/filter.service';
import { ShipCategoryDataService } from 'src/app/services/ship-category-data.service';
import { HomePage } from '../home.page';
import { SheetShipRowComponent } from './sheet-ship-row/sheet-ship-row.component';

@Component({
  selector: 'app-sheet-ui',
  templateUrl: './sheet-ui.component.html',
  styleUrls: ['./sheet-ui.component.scss', '../home.page.scss'],
})
export class SheetUIComponent {

  @ViewChildren('categories') categoryElements: QueryList<ElementRef>
  @ViewChildren('categoryHeaders') categoryHeaderElements: QueryList<ElementRef>
  @ViewChild('container') container: ElementRef;
  highlightedHeaderElement: number;
  belowGridIndex: number;
  scrollingInterval: any;
  multiSelectedShipRows: SheetShipRowComponent[] = [];

  constructor(public shipCategoryData: ShipCategoryDataService, public home: HomePage, public filter: FilterService, private categoryEditor: CategoryEditorComponent) {}

  openCategoryEditor(category: string) {
    this.categoryEditor.open(category);
  }
}
