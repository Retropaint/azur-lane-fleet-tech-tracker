import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AzurapiService } from './services/azurapi.service';
import { FilterService } from './services/filter.service';
import { ShipCategoryDataService } from './services/ship-category-data.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private storage: Storage, 
    private azurapi: AzurapiService, 
    private filter: FilterService, 
    private shipCategoryData: ShipCategoryDataService) {
    this.storage.create();
  }

  async ngOnInit() {
    const factionNames = ["USS", "HMS", "IJN", "KMS", "ROC", "SN", "FFNF", "MNF", "RN", "All", "None"];
    const statNames = ["FP", "TRP", "AVI", "AA", "RLD", "HIT", "ASW", "EVA", "HP", "All", "None"];
    this.azurapi.init().then(() => {
      this.shipCategoryData.init().then(() => {
        this.shipCategoryData.selectedCategory = this.shipCategoryData.sortedCategoryNames[0];
        this.filter.filter();
      });
    });
  }
}