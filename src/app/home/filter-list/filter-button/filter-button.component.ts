import { Component, Input, OnInit } from '@angular/core';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-filter-button',
  templateUrl: './filter-button.component.html',
  styleUrls: ['./filter-button.component.scss', '../filter-list.component.scss'],
})
export class FilterButtonComponent implements OnInit {

  @Input() filterName: string;
  @Input() filterType: any;
  @Input() index: number;
  @Input() iconWidth: number;
  @Input() textRightMargin: number;
  @Input() fileName: string;

  doubleClickTimeout: any;
  clickCount: number = 0;
  previousPressedFilter: string;

  constructor(private filter: FilterService) { }

  ngOnInit() {}

  clickedFilterButton() {
    this.filter.pressedFilter(this.filterName, this.filterType);
  }
}
