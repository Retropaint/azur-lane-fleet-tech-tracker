import { Component, Input, OnInit } from '@angular/core';
import { Ship } from 'src/app/interfaces/ship';
import { FilterService } from 'src/app/services/filter.service';
import { MiscService } from 'src/app/services/misc.service';
import { ShipsService } from 'src/app/services/ships.service';
import { SortService } from 'src/app/services/sort.service';

@Component({
  selector: 'app-sheet-table',
  templateUrl: './sheet-table.component.html',
  styleUrls: ['./sheet-table.component.scss'],
})
export class SheetTableComponent implements OnInit {

  isLoading: boolean = true;
  isFading: boolean = false;

  ships: Ship[] = [];
  placeholderShips: Ship[] = [];

  constructor(
    public filter: FilterService, 
    public shipsService: ShipsService, 
    public sort: SortService,
    public misc: MiscService
  ) {}

  ngOnInit(): void {
    this.misc.sheetTable = this;
    this.filter.filter();
  }

  ngOnDestroy() {
    this.misc.sheetTable = null;
  }

  refresh() {
    if(!this.misc.hasFocus) {
      this.misc.blurOnShipListLoad = true;
      return;
    } else {
      this.misc.blurOnShipListLoad = false;
    }

    this.placeholderShips = this.ships.slice();
    this.ships = [];
    this.isLoading = true;
    this.isFading = false;
    setTimeout(() => {
      this.isLoading = false;
      this.shipsService.setAllProperShipPos(this.sort.immediateSort(this.shipsService.ships))
        .forEach(ship => {
          if(this.misc.shipsFilterPass[ship.id]) {
            this.ships.push(ship);
          }
        })
    })
    setTimeout(() => {
      this.isFading = true;
    }, 50)
  }
}
