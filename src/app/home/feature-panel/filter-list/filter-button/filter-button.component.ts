import { Component, Input, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { FilterService } from 'src/app/services/filter.service';
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

  constructor(private filter: FilterService, private home: HomePage, private app: AppComponent) { }

  ngOnInit() {}

  clickedFilterButton() {
    this.home.ionContent.scrollToTop();
    if(this.app.isMobile) {
      this.home.ionContent.scrollToPoint(0, 100);
    }
    this.filter.pressedFilter(this.filterName, this.filterType);
  }
}
