import { Component, Input, OnInit } from '@angular/core';
import { FilterService } from 'src/app/services/filter.service';
import { MiscService } from 'src/app/services/misc.service';
import { ShipsService } from 'src/app/services/ships.service';
import { SortService } from 'src/app/services/sort.service';

@Component({
  selector: 'app-sheet-category',
  templateUrl: './sheet-category.component.html',
  styleUrls: ['./sheet-category.component.scss'],
})
export class SheetCategoryComponent implements OnInit {

  @Input() category: string;
  @Input() index: number;

  constructor(
    public filter: FilterService, 
    public shipsService: ShipsService, 
    public sort: SortService,
    public misc: MiscService
  ) {}

  ngOnInit(): void {
    this.filter.filter();
  }
}
