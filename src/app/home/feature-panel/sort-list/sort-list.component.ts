import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AppComponent } from 'src/app/app.component';
import { FilterService } from 'src/app/services/filter.service';
import { SortService } from 'src/app/services/sort.service';

@Component({
  selector: 'app-sort-list',
  templateUrl: './sort-list.component.html',
  styleUrls: ['./sort-list.component.scss', '../../icon-ui/icon-ui.component.scss', '../../home.page.scss', '../../Components/generic-big-button/generic-big-button.component.scss'],
})
export class SortListComponent {

  objectKeys = Object.keys;

  types = ["Level", "Rarity", "Name"];

  rarityRanks = {
    "Normal": 0,
    "Rare": 1,
    "Elite": 2,
    "Super-Rare": 3,
    "Ultra-Rare": 4,
    "Decisive": 4
  }

  constructor(private filter: FilterService, private storage: Storage, public sortService: SortService, public app: AppComponent) { }

  async sort(type: string) {
    this.sortService.sort(type);
  }
}
