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

  //@ViewChild('list') list: ElementRef;

  ships: Ship[] = [];
  rows: Ship[][] = [];
  rowHeight: number;
  refreshCount: number;

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
    // reset 
    this.ships = [];
    this.rows = [];

    // get width of list element to calculate how many ships can fit in a row
    let listWidth = this.list.nativeElement.getBoundingClientRect().width;

    const shipsPerRow = Math.floor(listWidth / (116 * this.settingsData.settings['ship-card-size']/100));

    const shipCardSize = this.settingsData.settings['ship-card-size']/100;
    if(!this.misc.isMobile) {
      this.rowHeight = 158 * shipCardSize;
    } else {
      this.rowHeight = 128 * shipCardSize;
    }
    
    // create rows array
    let rowIndex = 0;
    this.shipsService.setAllProperShipPos(this.sort.immediateSort(this.shipsService.ships)).forEach(ship => {
      if(this.misc.shipsFilterPass[ship.id] || Object.keys(this.misc.shipsFilterPass).length == 0) {
        if(this.rows[rowIndex] == null) {
          this.rows.push([]);
        }
        this.rows[rowIndex].push(ship);
        if(this.rows[rowIndex].length >= shipsPerRow) {
          rowIndex++;
        }
      }
    })
    console.log(this.rowHeight)
  }
}
