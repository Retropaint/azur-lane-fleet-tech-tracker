import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FilterService } from 'src/app/services/filter.service';
import { MiscService } from 'src/app/services/misc.service';

@Component({
  selector: 'app-filter-button',
  templateUrl: './filter-button.component.html',
  styleUrls: ['./filter-button.component.scss', '../filter-list.component.scss'],
})
export class FilterButtonComponent implements OnInit {

  @Input() filterName: string;
  @Input() filterType: any;
  @Input() fileName: string;
  hasImage: boolean = true;

  doubleClickTimeout: any;
  clickCount: number = 0;
  previousPressedFilter: string;

  constructor(
    private filter: FilterService, 
    private misc: MiscService
  ) { }

  ngOnInit() {
    if(this.filterName == 'No Tech' || 
      this.filterName == 'Has Tech' || 
      this.filterName == 'All' || 
      this.filterType == this.filter.rarities || 
      this.filterType == this.filter.statuses) {
      this.hasImage = false;
    }
  }

  clickedFilterButton() {
    if(!this.misc.isMobile) {
      this.misc.scrollUp();
    }
    this.filter.pressedFilter(this.filterName, this.filterType);
  }

  test() {
  }
}
