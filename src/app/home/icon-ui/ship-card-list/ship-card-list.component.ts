import { AfterContentChecked, AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChildren } from '@angular/core';
import { Ship } from 'src/app/interfaces/ship';
import { FilterService } from 'src/app/services/filter.service';
import { IconLoaderService } from 'src/app/services/icon-loader.service';
import { ShipCategoryDataService } from 'src/app/services/ship-category-data.service';
import { ShipCardComponent } from './ship-card/ship-card.component';

@Component({
  selector: 'app-ship-card-list',
  templateUrl: './ship-card-list.component.html',
  styleUrls: ['./ship-card-list.component.scss'],
})
export class ShipCardListComponent implements OnChanges {

  fleetTechStatIconWidths = {
    "HP": 16,
    "AA": 17,
    "ASW": 18,
    "TRP": 16,
    "FP": 27,
    "EVA": 15,
    "HIT": 16,
    "AVI": 17,
    "RLD": 15,
  };

  @Input() category: string;
  @ViewChildren('ships') shipComponents: ShipCardComponent
  interval: any;
  ships: Ship[] = [];
  delay: number = 30;

  constructor(private shipCategoryData: ShipCategoryDataService, 
    public filter: FilterService,
    public iconLoader: IconLoaderService) {}

  ngOnChanges(changes: SimpleChanges) {
    if(changes.category.previousValue == changes.category.currentValue) {
      return;
    }
    this.filter.filter();
  }
}
