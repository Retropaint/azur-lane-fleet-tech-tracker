import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Ship } from 'src/app/interfaces/ship';
import { FilterService } from 'src/app/services/filter.service';
import { ShipCategoryDataService } from 'src/app/services/ship-category-data.service';
import { SortService } from 'src/app/services/sort.service';

@Component({
  selector: 'app-sort-list',
  templateUrl: './sort-list.component.html',
  styleUrls: ['./sort-list.component.scss', '../icon-ui/icon-ui.component.scss', '../home.page.scss'],
})
export class SortListComponent implements OnInit {

  objectKeys = Object.keys;

  types = {
    "Rarity": false,
    "Level": false,
    "Name": false
  }

  rarityRanks = {
    "Normal": 0,
    "Rare": 1,
    "Elite": 2,
    "Super-Rare": 3,
    "Ultra-Rare": 4,
    "Decisive": 4
  }

  constructor(private shipCategoryData: ShipCategoryDataService, private filter: FilterService, private storage: Storage, private sortService: SortService) { }

  ngOnInit() {}

  async sort(type: string) {
    this.types[type] = !this.types[type];
    
    if(await this.storage.get("icon-ui")) {
      this.sortService.sort(type, this.shipCategoryData.selectedCategory);
    } else {
      this.sortService.allSort(type);
    }
  }
}
