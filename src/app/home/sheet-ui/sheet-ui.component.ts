import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FilterService } from 'src/app/services/filter.service';
import { ShipsService } from 'src/app/services/ships.service';
import { HomePage } from '../home.page';

@Component({
  selector: 'app-sheet-ui',
  templateUrl: './sheet-ui.component.html',
  styleUrls: ['./sheet-ui.component.scss', '../home.page.scss'],
})
export class SheetUIComponent {

  @ViewChildren('categoryContainers', {read: ElementRef}) categoryContainers: QueryList<ElementRef>;
  @ViewChild('container') container: ElementRef;

  loadedSheets: number = 0;

  constructor(
    public home: HomePage, 
    public filter: FilterService,
    private shipsService: ShipsService) {}

  openCategoryEditor(category: string) {
  }
}
