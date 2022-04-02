import { Component, Input } from '@angular/core';
import { FilterService } from 'src/app/services/filter.service';
import { ShipsService } from 'src/app/services/ships.service';

@Component({
  selector: 'app-sheet-category',
  templateUrl: './sheet-category.component.html',
  styleUrls: ['./sheet-category.component.scss'],
})
export class SheetCategoryComponent {

  @Input() category: string;
  @Input() index: number;
  canOpenEditor: boolean = true;

  constructor(public filter: FilterService, public shipsService: ShipsService) {}

  openCategoryEditor() {
  }
}
