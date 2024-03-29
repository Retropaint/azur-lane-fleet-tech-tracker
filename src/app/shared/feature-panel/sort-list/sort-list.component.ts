import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AppComponent } from 'src/app/app.component';
import { FilterService } from 'src/app/services/filter.service';
import { MiscService } from 'src/app/services/misc.service';
import { SortService } from 'src/app/services/sort.service';

@Component({
  selector: 'app-sort-list',
  templateUrl: './sort-list.component.html',
  styleUrls: ['./sort-list.component.scss', '../../../home/home.page.scss', '../../generic-big-button/generic-big-button.component.scss'],
})
export class SortListComponent {

  objectKeys = Object.keys;

  types = ["Level", "Rarity", "Name"];

  considerStatus: boolean;

  rarityRanks = {
    "Normal": 0,
    "Rare": 1,
    "Elite": 2,
    "Super-Rare": 3,
    "Ultra-Rare": 4,
    "Decisive": 4
  }

  constructor(public sortService: SortService, public misc: MiscService) { }

  sort(type: string) {
    this.sortService.sort(type);
  }

  refreshConsiderStatus() {
    this.misc.considerStatusSorting = !this.misc.considerStatusSorting;
    this.sortService.sort(this.sortService.lastType, true);
  }
}
