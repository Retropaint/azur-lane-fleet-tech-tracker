import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Ship } from 'src/app/interfaces/ship';
import { FilterService } from 'src/app/services/filter.service';
import { MiscService } from 'src/app/services/misc.service';
import { SettingsDataService } from 'src/app/services/settings-data.service';
import { ShipsService } from 'src/app/services/ships.service';
import { SortService } from 'src/app/services/sort.service';

@Component({
  selector: 'app-ship-card-list',
  templateUrl: './ship-card-list.component.html',
  styleUrls: ['./ship-card-list.component.scss', '../../home.page.scss'],
})
export class ShipCardListComponent implements AfterViewInit {

  // shisp are divided into rows, so virtual scrolling can work by treating it like a list of items
  rows: Ship[][] = [];

  rowHeight: number;
  refreshCount: number;
  isLoading: boolean = true;

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

  constructor(
    public filter: FilterService,
    public shipsService: ShipsService,
    public sort: SortService,
    public misc: MiscService,
    private settingsData: SettingsDataService,
    private list: ElementRef
  ) {}

  onResize() {
    this.refresh();
  }

  ngAfterViewInit() {
    this.misc.shipCardList = this;
    setTimeout(() => {
      this.refresh();
    }, 1000)
  }
  
  refresh() {
    let desiredShipsPerRow = this.settingsData.settings['ship-cards-per-row'];

    this.isLoading = true;
    this.rows = [];

    // get width of list element to calculate how many ships can fit in a row
    let listWidth = this.list.nativeElement.getBoundingClientRect().width;

    const shipCardSize = (listWidth / desiredShipsPerRow) - 30;
    const ratio = (shipCardSize / 100);

    document.documentElement.style.setProperty('--ship-card-zoom', ratio.toString());
    this.rowHeight = 158 * ratio;
    
    // create ship list
    let rowIndex = 0;
    this.shipsService.setAllProperShipPos(this.sort.immediateSort(this.shipsService.ships)).forEach(ship => {
      if(this.misc.shipsFilterPass[ship.id] || Object.keys(this.misc.shipsFilterPass).length == 0) {
        if(this.rows[rowIndex] == null) {
          this.rows.push([]);
        }
        this.rows[rowIndex].push(ship);
        if(this.rows[rowIndex].length >= desiredShipsPerRow) {
          rowIndex++;
        }
      }
    })

    // add invisible ship cards for the last row, to anchor visible ships to the left
    while(this.rows[this.rows.length - 1].length < desiredShipsPerRow) {
      // quick and dirty way to create a new ship. Parse and stringify used to prevent referencing
      const invisibleShip: Ship = JSON.parse(JSON.stringify(this.shipsService.ships[0]));
      
      invisibleShip.id = "-1";
      this.rows[this.rows.length - 1].push(invisibleShip);
    }

    // delay allows all ship cards to destroy themselves, so they can restart fade
    setTimeout(() => {
      this.isLoading = false;
    })
  }

  getMaximumShipsPerRow(listWidth: number) {
    const shipsPerRow = Math.ceil(listWidth / (100 + 30));
    return shipsPerRow;
  }
}
