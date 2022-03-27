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

  clickedFilterButton(name: string, type: any) {
    if(name != this.previousPressedFilter) {
      this.clickCount = 0;
    }

    this.previousPressedFilter = name;
    this.clickCount++;
    if(this.clickCount >= 2) {
      this.filter.pressedFilter(name, type, true);
      clearTimeout(this.doubleClickTimeout);
    } else {
      this.filter.pressedFilter(name, type, false);
    }

    this.doubleClickTimeout = setTimeout(() => {
      this.clickCount = 0;
    }, 250)
  }

}
