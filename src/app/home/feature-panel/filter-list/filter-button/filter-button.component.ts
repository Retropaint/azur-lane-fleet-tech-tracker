import { Component, Input, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { FilterService } from 'src/app/services/filter.service';
import { MiscService } from 'src/app/services/misc.service';
import { HomePage } from '../../../home.page';

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
  @Input() hasImage: boolean = true;

  doubleClickTimeout: any;
  clickCount: number = 0;
  previousPressedFilter: string;

  constructor(
    private filter: FilterService, 
    private home: HomePage, 
    private misc: MiscService
    ) { }

  ngOnInit() {}

  clickedFilterButton() {
    if(!this.misc.isMobile) {
      this.home.ionContent.scrollToTop();
    }
    this.filter.pressedFilter(this.filterName, this.filterType);
  }
}
