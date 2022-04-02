import { AfterContentChecked, AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChildren } from '@angular/core';
import { Ship } from 'src/app/interfaces/ship';
import { FilterService } from 'src/app/services/filter.service';
import { IconLoaderService } from 'src/app/services/icon-loader.service';
import { ShipsService } from 'src/app/services/ships.service';
import { ShipCardComponent } from './ship-card/ship-card.component';

@Component({
  selector: 'app-ship-card-list',
  templateUrl: './ship-card-list.component.html',
  styleUrls: ['./ship-card-list.component.scss', '../../home.page.scss'],
})
export class ShipCardListComponent {

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

  @ViewChildren('ships') shipComponents: ShipCardComponent
  interval: any;
  ships: Ship[] = [];
  delay: number = 30;

  constructor(
    public filter: FilterService,
    public iconLoader: IconLoaderService,
    public shipsService: ShipsService) {}
}
